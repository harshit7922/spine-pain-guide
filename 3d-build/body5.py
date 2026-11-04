import numpy as np, json, base64
from collections import defaultdict
from load import *
V0,G=load_obj()
W=json.load(open('weights.mhw'))['weights']
NB=13380
quads=np.array(G['body']); TRIS=np.concatenate([quads[:,[0,1,2]],quads[:,[0,2,3]]])
segw=defaultdict(lambda: np.zeros(NB))
def seg_of(b):
    if b.startswith('upperleg'): return 'thigh'
    if b.startswith('lowerleg'): return 'shin'
    if b.startswith(('foot','toe')): return 'foot'
    if b.startswith(('pelvis','spine','root')): return 'torso'
    if b.startswith('breast'): return 'torso'
    if b.startswith(('upperarm','lowerarm','wrist','finger','metacarpal','shoulder','clavicle')): return 'arm'
    return 'head'
for b,l in W.items():
    sg=seg_of(b)
    for v,w in l:
        if v<NB: segw[sg][v]+=w
SEGS=['thigh','shin','foot','torso','arm','head']
M=np.stack([segw[k] for k in SEGS],1); vseg=np.array(SEGS)[M.argmax(1)]
def verts(name): return sorted(set(i for f in G[name] for i in f))
def jm(P,name): return P[verts('joint-'+name)].mean(0)
def tf(V): g=V[verts('joint-ground')].mean(0); return (V-np.array([0,g[1],0]))*0.1
P0=tf(V0); B=P0[:NB]
# vertex normals
fn=np.cross(B[quads[:,2]]-B[quads[:,0]],B[quads[:,3]]-B[quads[:,1]])
vn=np.zeros_like(B)
for k in range(4): np.add.at(vn,quads[:,k],fn)
vn/=np.linalg.norm(vn,axis=1,keepdims=True)+1e-12
H=B[:,1].max(); hj=jm(P0,'l-upper-leg')[1]; s=H/1.73
knee=jm(P0,'l-knee')[1]; ank=jm(P0,'l-ankle')[1]
eyeL=P0[verts('helper-l-eye')].mean(0); mouth=jm(P0,'mouth')
x,y,z=B.T; ax=np.abs(x); side=np.where(x>=0,'l','r'); n=vn
rel=(y-hj)/s
key=np.array(['']*NB,dtype=object)
def setk(mask,name):
    for sd in 'lr': key[mask&(side==sd)]=name+'_'+sd
back=n[:,2]<-0.2; front=n[:,2]>0.2
torso=vseg=='torso'; legs=np.isin(vseg,['thigh','shin','foot'])
def leg_center(sd,yy):
    vm=legs&((B[:,0]>0) if sd=='l' else (B[:,0]<0)); sel=vm&(np.abs(B[:,1]-yy)<0.012)
    return B[sel].mean(0) if sel.sum()>3 else None
cent={sd:{} for sd in 'lr'}
phi=np.full(NB,np.nan)
for i in np.where(legs)[0]:
    sd=side[i]; b=round(min(max(round(y[i],2),0.0),round(hj,2)),2)
    if b not in cent[sd]: cent[sd][b]=leg_center(sd,b)
    c=cent[sd][b]
    if c is None: continue
    lat=(x[i]-c[0])*(1 if sd=='l' else -1); dz=z[i]-c[2]; phi[i]=np.degrees(np.arctan2(lat,dz))

fr=M/np.maximum(M.sum(1,keepdims=True),1e-9)
nbl=[set() for _ in range(NB)]
for q in quads:
    for a_,b_ in zip(q,np.roll(q,-1)): nbl[a_].add(b_); nbl[b_].add(a_)
ni=np.concatenate([np.full(len(l),i) for i,l in enumerate(nbl)]); nj=np.concatenate([list(l) for l in nbl])
deg_=np.bincount(ni,minlength=NB)
for _ in range(25):
    acc=np.zeros_like(fr); np.add.at(acc,ni,fr[nj]); fr=0.5*fr+0.5*acc/deg_[:,None]
TF=fr[:,SEGS.index('torso')]; THF=fr[:,SEGS.index('thigh')]; SHF=fr[:,SEGS.index('shin')]; FOF=fr[:,SEGS.index('foot')]
K=0.04
def AND(*c): return np.min(np.stack(c),0)
def OR(*c): return np.max(np.stack(c),0)
segc=lambda f: (f-0.5)*K
deg=lambda d: np.radians(d)*0.05
ph=np.nan_to_num(phi,nan=0.0)
legsF=THF+SHF+FOF
backc=(-n[:,2]-0.2)*K; frontc=(n[:,2]-0.2)*K
R=lambda lo,hi: AND((rel-lo)*s,(hi-rel)*s)
sidec={'l':x,'r':-x}
raw={}
raw['lowback']=AND(backc,R(0.05,0.25),0.045*s-ax)
for sd in 'lr':
    raw['lowback_side_'+sd]=AND(backc,R(0.05,0.25),ax-0.045*s,0.125*s-ax,sidec[sd])
    raw['flank_'+sd]=AND(R(0.16,0.31),(0.2-n[:,2])*K,ax-0.085*s,0.16*s-ax,(n[:,0]*np.sign(x)-0.3)*K,sidec[sd])
raw['tailbone']=AND(backc,R(-0.035,0.05),0.024*s-ax)
for sd in 'lr':
    raw['buttock_'+sd]=AND(segc(TF+THF),backc,R(-0.11,0.05),ax-0.012*s,0.17*s-ax,sidec[sd])
    raw['groin_'+sd]=AND(frontc,R(-0.075,0.05),ax-0.035*s,0.15*s-ax,sidec[sd])
per=AND(segc(TF+THF),0.035*s-ax,R(-0.16,-0.03),(0.3-n[:,1])*K)
inn=AND(segc(THF),deg(-35-ph),deg(ph+150),(rel+0.24)*s)
raw['saddle']=OR(per,inn)
for sd in 'lr':
    raw['thigh_front_'+sd]=AND(segc(THF),(y-knee-0.05),deg(65-np.abs(ph)),(-0.06-rel)*s,sidec[sd])
    raw['thigh_back_'+sd]=AND(segc(THF),(y-knee-0.05),deg(np.abs(ph)-115),(-0.10-rel)*s,sidec[sd])
    kn=AND(segc(legsF),0.05-np.abs(y-knee),deg(75-np.abs(ph)),sidec[sd])
    shz=AND(segc(SHF),(y-ank-0.03),sidec[sd])
    raw['l4_'+sd]=OR(kn,AND(shz,deg(ph+150),deg(-30-ph)))
    raw['l5_'+sd]=AND(shz,deg(ph+30),deg(100-ph))
    raw['s1_'+sd]=AND(shz,OR(deg(ph-100),deg(-150-ph)))
    c=B[(vseg=='foot')&((B[:,0]>0) if sd=='l' else (B[:,0]<0))].mean(0); az_=jm(P0,sd+'-ankle')[2]
    lat=(x-c[0])*(1 if sd=='l' else -1)
    fz=AND(segc(legsF),(ank+0.03-y),sidec[sd])
    s1f=AND(fz,OR((-n[:,1]-0.45)*K,az_-0.015-z,lat-0.028))
    l4f=AND(fz,-0.03-lat,ank+0.02-y,az_+0.05-z,-s1f)
    l5f=AND(fz,-s1f,-l4f)
    raw['s1_'+sd]=OR(raw['s1_'+sd],s1f); raw['l4_'+sd]=OR(raw['l4_'+sd],l4f); raw['l5_'+sd]=OR(raw['l5_'+sd],l5f)

# ---------- upper body: neck, upper/mid back, chest, arm dermatomes ----------
GRP={}
def grpw(pred):
    w=np.zeros(NB)
    for b_,l_ in W.items():
        if pred(b_):
            for v_,x_ in l_:
                if v_<NB: w[v_]+=x_
    return w
tot=np.maximum(M.sum(1),1e-9)
G2={'UA':lambda b:b.startswith(('upperarm','shoulder01')),'FA':lambda b:b.startswith(('lowerarm','wrist')),
    'D1':lambda b:b.startswith(('finger1','metacarpal1')),'D2':lambda b:b.startswith(('finger2','metacarpal2')),'D3':lambda b:b.startswith(('finger3','metacarpal3')),
    'D4':lambda b:b.startswith(('finger4','metacarpal4')),'D5':lambda b:b.startswith(('finger5','metacarpal5')),'HD':lambda b:b.startswith(('head','neck','jaw')) }
GF=np.stack([grpw(f) for f in G2.values()],1)/tot[:,None]
for _ in range(25):
    acc=np.zeros_like(GF); np.add.at(acc,ni,GF[nj]); GF=0.5*GF+0.5*acc/deg_[:,None]
gi={k:i for i,k in enumerate(G2)}
gf=lambda *ks: sum(GF[:,gi[k]] for k in ks)
yC7=0.853*H; yT7=0.752*H; yT12=hj+0.25*s
raw['neck']=AND(segc(TF+gf('HD')),y-(yC7-0.012*s),(0.905*H)-y,0.062*s-ax,(0.05-n[:,2])*K)
raw['interscap']=AND(segc(TF),backc,y-yT7,yC7-y,0.05*s-ax)
raw['midback']=AND(segc(TF),backc,y-yT12,yT7-y,0.05*s-ax)
raw['chest']=AND(segc(TF),frontc,y-0.72*H,0.80*H-y,0.075*s-ax)
for sd in 'lr':
    raw['trap_'+sd]=AND(segc(TF),(n[:,1]-0.05)*K,y-0.79*H,ax-0.045*s,0.19*s-ax,sidec[sd])
    raw['scap_'+sd]=AND(segc(TF),backc,y-(yT7-0.01*s),(yC7-0.015*s)-y,ax-0.05*s,0.155*s-ax,sidec[sd])
    raw['midback_side_'+sd]=AND(segc(TF),backc,y-yT12,yT7-y,ax-0.05*s,0.13*s-ax,sidec[sd])
    raw['ribs_'+sd]=AND(segc(TF),y-0.655*H,0.765*H-y,ax-0.07*s,(n[:,2]+0.3)*K,sidec[sd])
    S_=jm(P0,sd+'-shoulder'); E_=jm(P0,sd+'-elbow'); Wr=jm(P0,sd+'-hand'); sg=1 if sd=='l' else -1
    u=(E_-S_)/np.linalg.norm(E_-S_); d=B-S_; vp=d-np.outer(d@u,u)
    ex=np.array([sg,0,0.]); lat=ex-(ex@u)*u; lat/=np.linalg.norm(lat)
    ua=segc(gf('UA'))
    raw['c5_'+sd]=AND(ua,vp@lat,sidec[sd]); raw['t1_'+sd]=AND(ua,-(vp@lat),sidec[sd])
    u2=(Wr-E_)/np.linalg.norm(Wr-E_); d2=B-E_; vp2=d2-np.outer(d2@u2,u2)
    tb=B[(GF[:,gi['D1']]>0.5)&((B[:,0]>0) if sd=='l' else (B[:,0]<0))].mean(0)-E_; rd=tb-(tb@u2)*u2; rd/=np.linalg.norm(rd)
    cth=(vp2@rd)/np.maximum(np.linalg.norm(vp2,axis=1),1e-6)
    fa=segc(gf('FA'))
    c70,c110=np.cos(np.radians(70)),np.cos(np.radians(110))
    raw['c6_'+sd]=OR(AND(fa,(cth-c70)*0.04,sidec[sd]),AND(segc(gf('D1','D2')),sidec[sd]))
    raw['c8_'+sd]=OR(AND(fa,(c110-cth)*0.04,sidec[sd]),AND(segc(gf('D4','D5')),sidec[sd]))
    raw['c7_'+sd]=OR(AND(fa,(cth-c110)*0.04,(c70-cth)*0.04,sidec[sd]),AND(segc(gf('D3')),sidec[sd]))
# ---------- joints of the limbs (v5.3): shoulder, elbow, wrist and hand, hip, knee, leg, ankle and foot ----------
# Not exclusive with the spine regions above (they overlap, e.g. outer upper arm = c5 and side of the shoulder), exclusive among themselves.
G3={'UA':G2['UA'],'FA':G2['FA'],'HAND':lambda b:b.startswith(('finger','metacarpal','wrist')),'T1':lambda b:b.startswith('toe1'),
    'FT':lambda b:b.startswith(('foot','toe')),'D1':G2['D1'],'DF':lambda b:b.startswith(('finger2','finger3','finger4','finger5','metacarpal2','metacarpal3','metacarpal4'))}
GF3=np.stack([grpw(f) for f in G3.values()],1)/tot[:,None]
for _ in range(25):
    acc=np.zeros_like(GF3); np.add.at(acc,ni,GF3[nj]); GF3=0.5*GF3+0.5*acc/deg_[:,None]
g3={k:i for i,k in enumerate(G3)}
gq=lambda *ks: sum(GF3[:,g3[k]] for k in ks)
unit=lambda v: v/np.linalg.norm(v)
perp=lambda v,a: unit(v-(v@a)*a)
raw2={}
for sd in 'lr':
    sg=1 if sd=='l' else -1; sc=sidec[sd]
    S_=jm(P0,sd+'-shoulder'); E_=jm(P0,sd+'-elbow'); Wr=jm(P0,sd+'-hand'); Kn=jm(P0,sd+'-knee'); An=jm(P0,sd+'-ankle'); Hp=jm(P0,sd+'-upper-leg')
    u=unit(E_-S_); latA=perp(np.array([sg,0,0.]),u); frA=perp(np.array([0,0,1.]),u); upA=np.cross(u,frA)*0+np.array([0,1.,0])
    d=B-S_; t=d@u; armish=segc(TF+gq('UA'))
    shz=AND(armish,0.115*s-np.linalg.norm(d,axis=1),t+0.02*s,sc)
    raw2['sh_top_'+sd]=AND(shz,(n[:,1]-0.5)*K)
    raw2['sh_front_'+sd]=AND(shz,(n@frA-0.35)*K,(0.6-n[:,1])*K)
    raw2['sh_back_'+sd]=AND(shz,(-(n@frA)-0.35)*K,(0.6-n[:,1])*K)
    delt=AND(segc(gq('UA')),t-0.02*s,0.15*s-t,sc)
    raw2['sh_side_'+sd]=OR(AND(shz,(n@latA-0.3)*K,(0.6-n[:,1])*K),AND(delt,(n@latA-0.35)*K))
    raw2['arm_front_'+sd]=AND(segc(gq('UA')),t-0.10*s,(np.linalg.norm(E_-S_)-0.04*s)-t,(n@frA-0.45)*K,sc)
    # elbow
    de=B-E_; elz=AND(segc(gq('UA','FA')),0.062*s-np.linalg.norm(de,axis=1),sc)
    latE=perp(np.array([sg,0,0.]),u); bkE=perp(np.array([0,0,-1.]),u)
    raw2['elb_out_'+sd]=AND(elz,(n@latE-0.4)*K)
    raw2['elb_in_'+sd]=AND(elz,(-(n@latE)-0.4)*K)
    raw2['elb_back_'+sd]=AND(elz,(n@bkE-0.5)*K)
    # wrist and hand
    u2=unit(Wr-E_); tb=B[(GF[:,gi['D1']]>0.5)&((B[:,0]>0) if sd=='l' else (B[:,0]<0))].mean(0)-Wr; rd=perp(tb,u2)
    tip=B[(gq('DF')>0.5)&((B[:,0]>0) if sd=='l' else (B[:,0]<0))].mean(0)-Wr; pd=perp(tip-(tip@rd)*rd,u2)
    dw=B-Wr; tw=dw@u2
    hz=segc(gq('FA','HAND'))
    raw2['wrist_thumb_'+sd]=AND(hz,tw+0.06*s,0.035*s-tw,(n@rd-0.45)*K,0.05*s-np.linalg.norm(dw-np.outer(tw,u2),axis=1),sc)
    raw2['wrist_palm_'+sd]=AND(hz,tw+0.03*s,0.045*s-tw,(n@pd-0.4)*K,sc)
    raw2['finger_base_'+sd]=AND(segc(gq('DF')),(n@pd-0.3)*K,tw-0.07*s,0.115*s-tw,sc)
    raw2['thumb_base_'+sd]=AND(segc(gq('D1')),0.07*s-tw,sc)
    # hip (outer side, over the greater trochanter)
    raw2['hip_side_'+sd]=AND(segc(TF+THF),0.075*s-np.abs(y-(Hp[1]-0.03*s)),(n[:,0]*sg-0.5)*K,sc)
    # knee
    kz=AND(segc(legsF),0.06*s-np.abs(y-Kn[1]),sc)
    raw2['knee_front_'+sd]=AND(kz,deg(40-np.abs(ph)))
    raw2['knee_in_'+sd]=AND(kz,deg(-ph-35),deg(ph+135))
    raw2['knee_out_'+sd]=AND(kz,deg(ph-35),deg(135-ph))
    raw2['knee_back_'+sd]=AND(kz,deg(np.abs(ph)-135))
    raw2['tibial_tub_'+sd]=AND(segc(SHF),(Kn[1]-0.055*s)-y,y-(Kn[1]-0.115*s),deg(35-np.abs(ph)),sc)
    # lower leg
    raw2['shin_in_'+sd]=AND(segc(SHF),y-(An[1]+0.06*s),(Kn[1]-0.13*s)-y,deg(-ph-10),deg(ph+80),sc)
    raw2['calf_'+sd]=AND(segc(SHF),y-(An[1]+0.48*(Kn[1]-An[1])),(Kn[1]-0.07*s)-y,deg(np.abs(ph)-115),sc)
    raw2['achilles_'+sd]=AND(segc(SHF+FOF),y-(An[1]+0.0*s),(An[1]+0.14*s)-y,deg(np.abs(ph)-140),sc)
    # ankle and foot
    da=B-An; lat=da[:,0]*sg
    az=AND(segc(SHF+FOF),0.032*s-np.abs(da[:,1]),0.035*s-np.abs(da[:,2]+0.005*s),sc)
    raw2['ankle_out_'+sd]=AND(az,lat-0.022*s)
    raw2['ankle_in_'+sd]=AND(az,-lat-0.018*s)
    ft=segc(gq('FT'))
    raw2['heel_'+sd]=AND(ft,(An[2]-0.015*s)-z,(An[1]+0.01*s)-y,sc)
    T1j=jm(P0,sd+'-toe-1-1'); T3j=jm(P0,sd+'-toe-3-1')
    raw2['arch_'+sd]=AND(ft,(-n[:,1]-0.4)*K,z-(An[2]+0.0*s),(T3j[2]-0.035*s)-z,sc)
    raw2['ball_'+sd]=AND(ft,(-n[:,1]-0.3)*K,0.028*s-np.abs(z-(T3j[2]-0.008*s)),sc)
    raw2['bigtoe_'+sd]=AND(OR(segc(gq('T1')),AND(ft,0.022*s-np.linalg.norm(B-T1j,axis=1))),sc)
REG2=[k+'_'+sd for k in ['sh_top','sh_front','sh_side','sh_back','arm_front','elb_out','elb_in','elb_back','wrist_thumb','wrist_palm','finger_base','thumb_base','hip_side','knee_front','knee_in','knee_out','knee_back','tibial_tub','shin_in','calf','achilles','ankle_out','ankle_in','heel','arch','ball','bigtoe'] for sd in 'lr']
REG=['lowback','lowback_side_l','lowback_side_r','flank_l','flank_r','tailbone','buttock_l','buttock_r','groin_l','groin_r','saddle','thigh_front_l','thigh_front_r','thigh_back_l','thigh_back_r','l4_l','l4_r','l5_l','l5_r','s1_l','s1_r','neck','interscap','midback','chest','trap_l','trap_r','scap_l','scap_r','midback_side_l','midback_side_r','ribs_l','ribs_r','c5_l','c5_r','t1_l','t1_r','c6_l','c6_r','c7_l','c7_r','c8_l','c8_r']
fin={}; taken=np.full(NB,-1.0)
for r_ in REG:
    m=AND(raw[r_],-taken)
    fin[r_]=m; taken=np.maximum(taken,m)
taken2=np.full(NB,-1.0)
for r_ in REG2:
    m=AND(raw2[r_],-taken2)
    fin[r_]=m; taken2=np.maximum(taken2,m)
LIM=0.015
LIMS={}
sparse={}
for r_ in REG+REG2:
    lim=0.012 if r_[:2] in ('c5','c6','c7','c8','t1') or r_.startswith(('wrist','finger','thumb','elb','ankle','bigtoe','ball','heel','arch','achilles','tibial')) else 0.03
    m=fin[r_]; vi=np.where(m>-lim)[0]
    sparse[r_]=(vi.astype(np.uint16),np.clip(np.round(m[vi]/lim*127),-127,127).astype(np.int8)); LIMS[r_]=lim
print({r_:int((fin[r_]>0).sum()) for r_ in REG+REG2}, 'entries',sum(len(v[0]) for v in sparse.values()))
key=np.array(['']*NB,dtype=object)
for r_ in REG: key[fin[r_]>0]=r_
# continuous fields (neutral space, meters)
waist=hj+0.105*s; cut=hj-0.15*s
shorts=np.where(np.isin(vseg,['torso','thigh']),np.minimum(waist-y,y-cut),-0.05)
bw=np.zeros(NB)
for b in ['breast.L','breast.R']:
    for v,w in W[b]:
        if v<NB: bw[v]=max(bw[v],w)
by=B[bw>0.3,1]; ylo,yhi=by.min()-0.035,by.max()+0.01
armw=M[:,SEGS.index('arm')]/np.maximum(M.sum(1),1e-9)
top=np.where(vseg=='torso',np.minimum(np.minimum(yhi-y,y-ylo),(0.35-armw)*0.08),-0.05)
ex=abs(eyeL[0]); byy=eyeL[1]+0.019
db=((ax-ex-0.002)/0.021)**2+((y-(byy+0.003*(1-((ax-ex)/0.021)**2)))/0.0042)**2
brow=np.clip((1.15-db)/0.6,0,1)*(vseg=='head')*(n[:,2]>0.2)
dl=(x/0.0235)**2+((y-mouth[1]+0.0005)/0.0078)**2
lip=np.clip((1.05-dl)/0.35,0,1)*(vseg=='head')*(z>mouth[2]-0.012)
# hair field on head vertices: positive = hair
ang=np.degrees(np.arctan2(x,z-(eyeL[2]-0.09)))   # 0 front, +-180 back
front_line=eyeL[1]+0.058; temple=eyeL[1]+0.032; nape=eyeL[1]-0.055
a=np.abs(ang)
hl=np.where(a<35,front_line+ (temple-front_line)*0*(a/35), np.where(a<100, front_line+(temple-front_line)*((a-35)/65), temple+(nape-temple)*np.clip((a-100)/55,0,1)))
hair=np.where(vseg=='head',y-hl,-0.05)
ear=(ax>0.062)&(y<eyeL[1]+0.028)&(y>eyeL[1]-0.05)&(np.abs(z-(eyeL[2]-0.09))<0.03)
hair=np.where(ear,np.minimum(hair,-0.004),hair)
hairF=[i for i,q in enumerate(quads) if (hair[q]>-0.02).all() and (vseg[q]=='head').all()]
print({k:int((key==k).sum()) for k in REG})
b64=lambda a: base64.b64encode(np.ascontiguousarray(a).tobytes()).decode()
W2=json.load(open('weights.mhw'))['weights']
ARM=('shoulder01','upperarm','lowerarm','wrist','finger','metacarpal')
def armw2(sd):
    w=np.zeros(len(V0))
    for b,l in W2.items():
        if b.endswith('.'+sd) and b.startswith(ARM):
            for v,xx in l: w[v]+=xx
        if b=='clavicle.'+sd:
            for v,xx in l: w[v]+=0.25*xx
    return np.clip(w,0,1)
AW={'L':armw2('L'),'R':armw2('R')}
def pose(V,deg=30):
    V=V.copy()
    for sd,sgn in (('L',-1),('R',1)):
        j=V[verts('joint-'+sd.lower()+'-shoulder')].mean(0); a_=np.radians(deg)*sgn; c,s_=np.cos(a_),np.sin(a_)
        d=V-j; rot=np.stack([d[:,0]*c-d[:,1]*s_,d[:,0]*s_+d[:,1]*c,d[:,2]],1)+j
        w=AW[sd][:,None]; V=V*(1-w)+rot*w
    return V
q16=lambda a,sc: np.clip(np.round(a*sc),-32767,32767).astype(np.int16)
hairq=np.array(hairF,dtype=np.uint16)
hairTris=np.concatenate([quads[hairq][:,[0,1,2]],quads[hairq][:,[0,2,3]]]).astype(np.uint16)
data={'idx':b64(TRIS.astype(np.uint16).ravel()),'reg':REG+REG2,'mem':{r_:[b64(sparse[r_][0]),b64(sparse[r_][1]),LIMS[r_]] for r_ in REG+REG2},'shorts':b64(q16(shorts,10000)),'top':b64(q16(top,10000)),
      'brow':b64(np.round(brow*255).astype(np.uint8)),'lip':b64(np.round(lip*255).astype(np.uint8)),'hair':b64(q16(hair,10000)),'hairIdx':b64(hairTris.ravel())}
LM={}
for sex,cd in [('male','m'),('female','f')]:
    V,_=build(sex); Vp=pose(V); P=tf(Vp); Pu=tf(V)
    eyes=[]
    for e in ['helper-l-eye','helper-r-eye']:
        vv=P[verts(e)]; c=vv.mean(0); r=np.linalg.norm(vv-c,axis=1).mean(); eyes.append([*np.round(c,4).tolist(),round(float(r),4)])
    data[cd]={'pos':b64(q16(P[:NB],10000)),'eyes':eyes,'H':round(float(P[:NB,1].max()),4)}
    LM[cd]={'P':P[:NB],'J':{k:jm(P,k) for k in ['l-upper-leg','r-upper-leg','l-knee','r-knee','l-ankle','r-ankle','pelvis','spine-4','spine-3','spine-2','spine-1','l-shoulder','r-shoulder','l-elbow','r-elbow','l-hand','r-hand','neck','head','l-clavicle','r-clavicle','l-scapula','r-scapula']}, 'F':{k:jm(P,k) for sd in 'lr' for k in [sd+'-finger-%d-%d'%(a_,b_) for a_ in range(1,6) for b_ in range(1,5) if not (a_==1 and b_==4)] if G.get('joint-'+k)}}
open('bodydata.js','w').write('window.SPG_BODY='+json.dumps(data,separators=(',',':'))+';')
np.save('lm.npy',dict(LM=LM,vseg=vseg,quads=quads,NB=NB,key=key),allow_pickle=True)
print(round(len(open('bodydata.js').read())/1024),'KB')
