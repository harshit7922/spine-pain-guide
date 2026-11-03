import numpy as np, json, base64, trimesh
from sdf import *
from load import load_obj
d=np.load('lm.npy',allow_pickle=True).item(); SP=np.load('spine_parts2.npy',allow_pickle=True).item()
LEVELS=SP['LEVELS']; parts=SP['parts']
V0,G=load_obj(); quads=np.array(G['body']); TRI=np.concatenate([quads[:,[0,1,2]],quads[:,[0,2,3]]])
vseg=d['vseg']
def b64(a): return base64.b64encode(np.ascontiguousarray(a).tobytes()).decode()
def M4(R,t,sc):
    m=np.eye(4); m[:3,:3]=R@np.diag(sc); m[:3,3]=t; return m
DTH={'T10–T11':0.006,'T11–T12':0.0065,'T12–L1':0.0075,'L1–L2':0.009,'L2–L3':0.010,'L3–L4':0.011,'L4–L5':0.012,'L5–S1':0.012}
out={}
for cd in ['m','f']:
    P=d['LM'][cd]['P']; J=d['LM'][cd]['J']; hj=J['l-upper-leg'][1]; H=P[:,1].max(); s=H/1.73
    tm=trimesh.Trimesh(P,TRI,process=False)
    ys=np.arange(hj-0.08,hj+0.50*s,0.004); zb=[]; zf=[]
    for yy in ys:
        loc,_,_=tm.ray.intersects_location([[0,yy,-1]],[[0,0,1]])
        zb.append(loc[:,2].min() if len(loc) else np.nan); zf.append(loc[:,2].max() if len(loc) else np.nan)
    zb=np.array(zb); zf=np.array(zf)
    ok=~np.isnan(zb); zb=np.interp(ys,ys[ok],zb[ok]); zf=np.interp(ys,ys[ok],zf[ok])
    k=np.ones(9)/9; zbs=np.convolve(np.pad(zb,4,mode='edge'),k,'valid')
    zc=lambda y: np.interp(y,ys,zbs)+0.017*s+0.074*s
    slope=lambda y: (zc(y+0.01)-zc(y-0.01))/0.02
    XF={}; LV={}; DC={}
    y=hj+0.100*s; order=LEVELS[::-1]  # L5 first going up
    discs=['L5–S1','L4–L5','L3–L4','L2–L3','L1–L2','T12–L1','T11–T12','T10–T11']
    for i,lv in enumerate(order):
        nm,bw,bd,bh=lv[0],lv[1],lv[2],lv[3]
        th=DTH[discs[i]]*s; yc=y+th/2; b=np.arctan(slope(yc))
        XF['disc_'+discs[i]]=M4(rot_x(b),[0,yc,zc(yc)],[s,th/0.010,s]); DC[discs[i]]=[0,yc,float(zc(yc))]
        y+=th; yb=y+bh*s; b=np.arctan(slope(yb))
        XF[nm]=M4(rot_x(b),[0,yb,zc(yb)],[s,s,s]); LV[nm]=[0,yb,float(zc(yb))]
        y+=2*bh*s
    y0=hj+0.100*s; th_s=np.radians(38)
    XF['sacrum']=M4(rot_x(th_s),[0,y0,zc(y0)],[s,s,s])
    Rs=rot_x(th_s); sac=lambda q: (Rs@(np.array(q)*s))+np.array([0,y0,zc(y0)])
    LV['S1']=sac((0,-0.02,0)).tolist(); LV['Coccyx']=sac((0,-0.125,0.004)).tolist()
    # pelvis affine
    hipx=J['l-upper-leg'][0]; sx=0.86*hipx/0.090
    ycrest=LV['L4'][1]; ysym=hj-0.005*s; sy=(ycrest-ysym)/(0.152+0.040); ty=ysym+0.040*sy
    ypsis=ty+0.090*sy; zpsis=np.interp(ypsis,ys,zbs)+0.014*s; zsym=np.interp(ysym+0.02,ys,zf)-0.024*s
    sz=(zsym-zpsis)/(0.050+0.088); tz=zpsis+0.088*sz
    XF['pelvis_l']=M4(np.eye(3),[0,ty,tz],[sx,sy,sz]); XF['pelvis_r']=M4(np.eye(3),[0,ty,tz],[-sx,sy,sz])
    pel=lambda q,sd=1: np.array([sd*q[0]*sx,q[1]*sy+ty,q[2]*sz+tz])
    A=pel((0.090,0,0))
    # leg slices (left)
    legs=np.isin(vseg,['thigh','shin','foot'])&(P[:,0]>0)
    def sl(yy):
        for w in (0.008,0.014,0.022,0.035):
            sel=legs&(np.abs(P[:,1]-yy)<w)
            if sel.sum()>=8: break
        c=P[sel].mean(0); c[1]=yy; r=np.sqrt(((P[sel][:,[0,2]]-c[[0,2]])**2).sum(1)).mean(); return c,r
    K=J['l-knee']; AN=J['l-ankle']
    # leg bones (left) in world coords
    def legbones(p):
        f=sphere(p,A,0.022*s)
        GT=A+np.array([0.050,-0.012,-0.010])*s
        f=smin(f,capsule(p,A,GT+np.array([-0.012,-0.008,0])*s,0.0135*s),0.006)
        f=smin(f,ellipsoid(p,GT,np.array([0.016,0.026,0.020])*s),0.006)
        f=smin(f,ellipsoid(p,A+np.array([0.020,-0.060,-0.012])*s,np.array([0.009,0.012,0.009])*s),0.004)
        kc=K+np.array([0,0.018,-0.004])*s
        f=smin(f,capsule(p,GT+np.array([-0.010,-0.035,0.004])*s,kc+np.array([0,0.04,0])*s,(0.0135*s,0.0125*s)),0.01)
        for sd in (-1,1): f=smin(f,ellipsoid(p,kc+np.array([sd*0.021,0,-0.004])*s,np.array([0.019,0.024,0.030])*s),0.008)
        f=smin(f,ellipsoid(p,K+np.array([0,0.012,0.045])*s,np.array([0.021,0.024,0.010])*s),0.001)
        tp=K-np.array([0,0.022,0])*s
        t=ellipsoid(p,tp,np.array([0.036,0.014,0.030])*s)
        t=smin(t,capsule(p,tp,AN+np.array([0,0.03,0])*s,(0.016*s,0.0105*s)),0.012)
        t=smin(t,ellipsoid(p,AN+np.array([-0.016,0.004,0.0])*s,np.array([0.009,0.016,0.012])*s),0.006)
        t=smin(t,ellipsoid(p,tp+np.array([0,-0.03,0.026])*s,np.array([0.010,0.016,0.008])*s),0.008)
        fb=capsule(p,K+np.array([0.030,-0.042,-0.016])*s,AN+np.array([0.022,-0.006,-0.008])*s,0.0058*s)
        fb=smin(fb,ellipsoid(p,K+np.array([0.031,-0.040,-0.016])*s,np.array([0.010,0.011,0.010])*s),0.004)
        fb=smin(fb,ellipsoid(p,AN+np.array([0.022,-0.006,-0.008])*s,np.array([0.008,0.018,0.011])*s),0.004)
        return np.minimum(np.minimum(f,t),fb)
    lo=np.minimum(A,AN)-0.07; hi=np.maximum(A,AN)+0.08; lo[1]=AN[1]-0.04; hi[1]=A[1]+0.04
    lv_,lf_=mesh_from_sdf(legbones,lo,hi,0.0018,4200)
    # ---- nerves ----
    W=lambda nm,q: (XF[nm][:3,:3]@np.array(q))+XF[nm][:3,3]
    N={}
    bh={l[0]:l[3] for l in LEVELS}
    for sd,sg in (('l',1),('r',-1)):
        X=lambda q: np.array([q[0]*sg,q[1],q[2]])
        plex=sac(X((0.034,-0.050,0.032)))
        def root(nm,prev):
            h=bh[nm]
            return [W(nm,X((0.006,h+0.006,-0.025))),W(nm,X((0.010,0.0,-0.022))),W(nm,X((0.016,-h+0.001,-0.021))),W(nm,X((0.028,-h-0.010,-0.010)))]
        for nm in ['L1','L2','L3']: N[nm+'_'+sd]=root(nm,None)+[W('L5',X((0.042,0.0,0.012)))]
        N['L4_'+sd]=root('L4',None)+[sac(X((0.050,0.012,0.030))),plex]
        N['L5_'+sd]=root('L5',None)+[sac(X((0.040,0.004,0.028))),plex]
        N['S1_'+sd]=[W('L5',X((0.006,-0.012,-0.026))),sac(X((0.010,-0.006,-0.012))),sac(X((0.016,-0.021,0.006))),sac(X((0.022,-0.024,0.024))),plex]
        # sciatic
        pts=[plex,pel(X((0.058,0.022,-0.058)),sg) if False else np.array([sg*0.058*sx,0.022*sy+ty,-0.058*sz+tz]),np.array([sg*0.074*sx,-0.012*sy+ty,-0.066*sz+tz]),np.array([sg*0.088*sx,-0.068*sy+ty,-0.060*sz+tz])]
        legpts=[]
        for yy in np.linspace(hj-0.12*s,K[1]+0.09*s,6):
            c,r=sl(yy); legpts.append(np.array([sg*(c[0]+0.05*r),yy,c[2]-0.42*r]))
        N['sciatic_'+sd]=pts+legpts
        bif=legpts[-1]
        tib=[bif]; 
        for yy,dz in [(K[1],-0.48),(K[1]-0.08*s,-0.40),(K[1]-0.2*s,-0.30),(AN[1]+0.1*s,-0.25)]:
            c,r=sl(yy); tib.append(np.array([sg*(c[0]-0.15*r),yy,c[2]+dz*r]))
        an=np.array([sg*AN[0],AN[1],AN[2]])
        tib+= [an+np.array([-sg*0.019,0.006,-0.022])*s,an+np.array([-sg*0.012,-0.045,0.012])*s,an+np.array([-sg*0.004,-0.055,0.075])*s,an+np.array([-sg*0.006,-0.058,0.13])*s]
        N['tibial_'+sd]=tib
        per=[bif]
        c,r=sl(K[1]+0.03*s); per.append(np.array([sg*(c[0]+0.55*r),K[1]+0.03*s,c[2]-0.45*r]))
        c,r=sl(K[1]-0.055*s); per.append(np.array([sg*(c[0]+0.9*r),K[1]-0.055*s,c[2]-0.05*r]))
        for yy in [K[1]-0.12*s,K[1]-0.25*s,AN[1]+0.08*s]:
            c,r=sl(yy); per.append(np.array([sg*(c[0]+0.35*r),yy,c[2]+0.45*r]))
        per+=[an+np.array([sg*0.002,-0.012,0.040])*s,an+np.array([-sg*0.010,-0.040,0.095])*s,an+np.array([-sg*0.020,-0.052,0.150])*s]
        N['peroneal_'+sd]=per
        fem=[W('L4',X((0.030,-0.018,0.000))),W('L5',X((0.040,0.0,0.015))),np.array([sg*0.070*sx,0.065*sy+ty,0.0*sz+tz]),np.array([sg*0.085*sx,0.035*sy+ty,0.050*sz+tz])]
        yi=hj+0.035*s; fem.append(np.array([sg*0.088*sx,yi,np.interp(yi,ys,zf)-0.025*s]))
        for yy,lat,fz in [(hj-0.05*s,-0.1,0.55),(hj-0.18*s,-0.3,0.45),(K[1]+0.10*s,-0.6,0.15),(K[1],-0.85,-0.1)]:
            c,r=sl(yy); fem.append(np.array([sg*(c[0]+lat*r),yy,c[2]+fz*r]))
        N['femoral_'+sd]=fem
        sap=[fem[-1]]
        for yy in [K[1]-0.12*s,K[1]-0.25*s,AN[1]+0.08*s]:
            c,r=sl(yy); sap.append(np.array([sg*(c[0]-0.85*r),yy,c[2]+0.1*r]))
        sap.append(an+np.array([-sg*0.026,0.0,0.014])*s); sap.append(an+np.array([-sg*0.028,-0.035,0.05])*s)
        N['saphenous_'+sd]=sap
    for k_ in list(N):
        if k_.split('_')[0] in ('sciatic','tibial','peroneal','femoral','saphenous'):
            a_=np.array(N[k_],float)
            st=4 if k_.startswith('sciatic') else 1
            for _ in range(2):
                b_=a_.copy(); b_[st:-1]=0.25*a_[st-1:-2]+0.5*a_[st:-1]+0.25*a_[st+1:]; a_=b_
            N[k_]=a_
    sacpts=[W(nm,(0,0,-0.026)) for nm in ['T10','T11','T12','L1','L2','L3','L4','L5']]+[sac((0,-0.015,-0.012)),sac((0,-0.035,-0.006))]
    N['sac']=sacpts
    # ================= upper spine, ribs, shoulder girdle, arms and their nerves =================
    import trimesh as _tm
    ys2=np.arange(hj+0.20*s,0.935*H,0.004); zb2=[]; zf2=[]
    for yy in ys2:
        loc,_,_=tm.ray.intersects_location([[0,yy,-1]],[[0,0,1]])
        zb2.append(loc[:,2].min() if len(loc) else np.nan); zf2.append(loc[:,2].max() if len(loc) else np.nan)
    zb2=np.array(zb2); zf2=np.array(zf2); ok2=~np.isnan(zb2); zb2=np.interp(ys2,ys2[ok2],zb2[ok2]); zf2=np.interp(ys2,ys2[ok2],zf2[ok2])
    kk=np.ones(7)/7; zb2s=np.convolve(np.pad(zb2,3,mode='edge'),kk,'valid'); zf2s=np.convolve(np.pad(zf2,3,mode='edge'),kk,'valid')
    yC7=0.853*H
    def zcu(y):
        t=np.clip((y-(yC7-0.03*s))/(0.04*s),0,1)
        return np.interp(y,ys2,zb2s)+(1-t)*(0.015*s+0.062*s)+t*(0.050*s)
    slope2=lambda y: (zcu(y+0.01)-zcu(y-0.01))/0.02
    PM={}
    top=LV['T10'][1]+0.0105*s
    seq=[('T9','Tmid',1.0,0.0098),('T8','Tmid',0.98,0.0096),('T7','Tmid',0.96,0.0094),('T6','Tmid',0.94,0.0092),('T5','Tmid',0.92,0.0090),
         ('T4','Tup',1.02,0.0088),('T3','Tup',0.99,0.0086),('T2','Tup',0.97,0.0084),('T1','Tup',0.98,0.0084),
         ('C7','C7',1.0,0.0072),('C6','C36',1.04,0.0068),('C5','C36',1.02,0.0067),('C4','C36',1.0,0.0066),('C3','C36',0.98,0.0065)]
    prev='T10'; yy=top
    for nm,pk,k,bhh in seq:
        dth=(0.0055 if nm[0]=='T' else 0.0048)*s
        dn=nm+'–'+prev; dpk='discTmid' if nm in ('T9','T8','T7','T6','T5') else 'discTup' if nm[0]=='T' else 'discC'
        yd=yy+dth/2; b=np.arctan(slope2(yd)); XF['disc_'+dn]=M4(rot_x(b),[0,yd,zcu(yd)],[s*k,dth/0.0050 if dpk!='discC' else dth/0.0045,s*k]); PM['disc_'+dn]=dpk; DC[dn]=[0,yd,float(zcu(yd))]
        yy+=dth; yb=yy+bhh*s*k; b=np.arctan(slope2(yb)); XF[nm]=M4(rot_x(b),[0,yb,zcu(yb)],[s*k,s*k,s*k]); PM[nm]=pk; LV[nm]=[0,yb,float(zcu(yb))]
        yy+=2*bhh*s*k; prev=nm
    dth=0.0045*s; yd=yy+dth/2; XF['disc_C2–C3']=M4(rot_x(np.arctan(slope2(yd))),[0,yd,zcu(yd)],[s,dth/0.0045,s]); PM['disc_C2–C3']='discC'; DC['C2–C3']=[0,yd,float(zcu(yd))]
    yy+=dth; yb=yy+0.011*s; XF['C2']=M4(rot_x(np.arctan(slope2(yb))),[0,yb,zcu(yb)],[s,s,s]); LV['C2']=[0,yb,float(zcu(yb))]
    yb1=yb+0.019*s; XF['C1']=M4(rot_x(np.arctan(slope2(yb1))),[0,yb1,zcu(yb1)-0.002*s],[s,s,s]); LV['C1']=[0,yb1,float(zcu(yb1))]
    ORDER=['C1','C2','C3','C4','C5','C6','C7','T1','T2','T3','T4','T5','T6','T7','T8','T9','T10','T11','T12','L1','L2','L3','L4','L5']
    DORDER=['C2–C3','C3–C4','C4–C5','C5–C6','C6–C7','C7–T1','T1–T2','T2–T3','T3–T4','T4–T5','T5–T6','T6–T7','T7–T8','T8–T9','T9–T10','T10–T11','T11–T12','T12–L1','L1–L2','L2–L3','L3–L4','L4–L5','L5–S1']
    # fix disc names to upper–lower order
    for dn in list(DC):
        a_,b_=dn.split('–')
        if ORDER.index(a_) > ORDER.index(b_) if a_ in ORDER and b_ in ORDER else False:
            nn=b_+'–'+a_; DC[nn]=DC.pop(dn); XF['disc_'+nn]=XF.pop('disc_'+dn); PM['disc_'+nn]=PM.pop('disc_'+dn)
    canalz={'C':-0.015,'T':-0.022,'L':-0.026}
    cord=[W(nm,(0,0.004 if nm=='C1' else 0,canalz[nm[0]])) for nm in ORDER[:20]]
    top_c=np.array(LV['C1'])+np.array([0,0.02*s,-0.012*s]); N['cord']=[top_c]+cord
    # ---- torso surface helpers ----
    def skin_r(y,phi,sg,zc0):
        d=np.array([sg*np.sin(phi),0,np.cos(phi)]); o=np.array([0,y,zc0])
        loc,ri,_=tm.ray.intersects_location([o],[d])
        if not len(loc): return None
        return float(np.min(np.linalg.norm(loc-o,axis=1)))
    RIBS={}; CART={}
    ends=[14,16,18,20,22,24,26,32,40,48,72,105]; drops=[0.025,0.04,0.055,0.065,0.072,0.078,0.08,0.08,0.078,0.072,0.06,0.045]
    yst_top=LV['T2'][1]; yst_bot=LV['T9'][1]
    for i in range(12):
        nm='T%d'%(i+1)
        for sd,sg in (('l',1),('r',-1)):
            orig=W(nm,(sg*0.024,0.004,-0.022)); y0_=orig[1]
            zc0=(np.interp(y0_,ys2,zb2s)+np.interp(y0_,ys2,zf2s))/2
            pts=[W(nm,(sg*0.012,0.002,-0.012)),orig]
            for ph_deg in np.linspace(165,ends[i],9):
                ph=np.radians(ph_deg); yph=y0_-drops[i]*s*(1-ph_deg/180)**1.3
                zc1=(np.interp(yph,ys2,zb2s)+np.interp(yph,ys2,zf2s))/2
                r=skin_r(yph,ph,sg,zc1)
                if r is None: continue
                rr=r-0.017*s; pts.append(np.array([sg*np.sin(ph)*rr,yph,zc1+np.cos(ph)*rr]))
            RIBS['rib%d_%s'%(i+1,sd)]=pts
            if i<10:
                e=pts[-1]; yst=np.interp(i,[0,6],[yst_top-0.01*s,yst_bot+0.01*s]) if i<7 else yst_bot-0.005*s
                xs=0.016*s if i<7 else 0.045*s
                zst=np.interp(yst,ys2,zf2s)-0.012*s
                CART['cart%d_%s'%(i+1,sd)]=[e,(e+np.array([sg*xs,yst,zst]))/2+np.array([0,0,0.004*s]),np.array([sg*xs,yst,zst])]
    # sternum
    def sternum(p):
        f_=None
        for t in np.linspace(0,1,9):
            yv=yst_top+0.012*s+(yst_bot-0.02*s-yst_top)*t; zv=np.interp(yv,ys2,zf2s)-0.011*s
            hw=(0.024-0.012*min(t*3,1)+(-0.006*max(t-0.85,0)/0.15))*s
            e=ellipsoid(p,(0,yv,zv),(max(hw,0.006*s),0.016*s,0.0055*s))
            f_=e if f_ is None else smin(f_,e,0.006)
        return f_
    stv,stf=mesh_from_sdf(sternum,(-0.04,yst_bot-0.05,np.interp(yst_bot,ys2,zf2s)-0.06),(0.04,yst_top+0.05,np.interp(yst_top,ys2,zf2s)+0.02),0.0012,900)
    # shoulder girdle and arm (left; mirrored in the browser)
    S_=J['l-shoulder']; E_=J['l-elbow']; Wr=J['l-hand']
    Fj=d['LM'][cd].get('F',{})
    clav=[np.array([0.018*s,yst_top+0.012*s,np.interp(yst_top,ys2,zf2s)-0.008*s]),None,S_+np.array([0.004,0.028,-0.002])*s]
    clav[1]=(clav[0]+clav[2])/2+np.array([0,0.006*s,0.012*s]); clav=[clav[0],(clav[0]*2+clav[1])/3+np.array([0,0,0.006*s]),clav[1],(clav[1]+clav[2]*2)/3-np.array([0,0,0.004*s]),clav[2]]
    def zback(x,y):
        loc,_,_=tm.ray.intersects_location([[x,y,0.0]],[[0,0,-1]])
        return float(loc[:,2].max()) if len(loc) else np.interp(y,ys2,zb2s)
    SA=np.array([0.072*s,LV['T2'][1],0]); IA=np.array([0.085*s,LV['T7'][1],0]); GL=S_+np.array([-0.018,-0.004,-0.012])*s
    for P_ in (SA,IA): P_[2]=zback(P_[0],P_[1])+0.022*s
    LB=np.array([GL[0]-0.012*s,GL[1]-0.035*s,GL[2]-0.01*s])
    tri1=np.array([SA,IA,LB]); tri2=np.array([SA,LB,GL])
    def scap(p):
        def tdist(tri):
            T_=np.repeat(tri[None],len(p),0); cp=_tm.triangles.closest_point(T_,p); return np.linalg.norm(p-cp,axis=1)
        f_=np.minimum(tdist(tri1),tdist(tri2))-0.0028*s
        sp0=SA+(IA-SA)*0.22; acr=S_+np.array([0.006,0.022,-0.018])*s
        f_=smin(f_,capsule(p,sp0+np.array([0,0,0.002]),acr,(0.003*s,0.006*s)),0.004)
        f_=smin(f_,ellipsoid(p,acr,np.array([0.012,0.005,0.014])*s),0.004)
        f_=smin(f_,ellipsoid(p,GL,np.array([0.009,0.014,0.010])*s),0.004)
        f_=smin(f_,capsule(p,GL+np.array([-0.004,0.012,0.004])*s,GL+np.array([-0.006,0.016,0.030])*s,0.004*s),0.004)
        f_=smin(f_,capsule(p,SA,IA,0.0035*s),0.003); f_=smin(f_,capsule(p,IA,LB,0.004*s),0.003)
        return f_
    lo=np.minimum.reduce([SA,IA,GL,S_])-0.04; hi_=np.maximum.reduce([SA,IA,GL,S_])+0.04
    scv,scf=mesh_from_sdf(scap,lo,hi_,0.0016,1800)
    ua=(E_-S_)/np.linalg.norm(E_-S_); fa_=(Wr-E_)/np.linalg.norm(Wr-E_)
    ex=np.array([1.0,0,0]); lat=ex-(ex@ua)*ua; lat/=np.linalg.norm(lat); ant=np.cross(lat,ua); ant=ant if ant[2]>0 else -ant
    th_=[Fj.get('l-finger-1-%d'%i) for i in (1,2,3)]; thb=th_[0] if th_[0] is not None else Wr+lat*0.02
    rd=(thb-E_)-((thb-E_)@fa_)*fa_; rd/=np.linalg.norm(rd)
    def armbones(p):
        f_=sphere(p,S_-lat*0.004*s,0.021*s)
        f_=smin(f_,capsule(p,S_,E_+ua*0.012*s,(0.012*s,0.010*s)),0.012)
        for sg_ in (1,-1): f_=smin(f_,ellipsoid(p,E_+lat*sg_*0.019*s+ua*0.004*s,np.array([0.011,0.010,0.011])*s),0.008)
        rA=E_+rd*0.010*s; rB=Wr+rd*0.012*s; uA=E_-rd*0.010*s-ant*0.010*s+ua*(-0.012*s); uB=Wr-rd*0.012*s
        f_=smin(f_,capsule(p,rA,rB,(0.0075*s,0.0105*s)),0.004)
        f_=np.minimum(f_,smin(capsule(p,uA,uB,(0.010*s,0.0065*s)),ellipsoid(p,uA,np.array([0.012,0.012,0.012])*s),0.004))
        return f_
    lo=np.minimum.reduce([S_,E_,Wr])-0.05; hi_=np.maximum.reduce([S_,E_,Wr])+0.05
    arv,arf=mesh_from_sdf(armbones,lo,hi_,0.0019,3200)
    fings=[[Fj.get('l-finger-%d-%d'%(a_,b_)) for b_ in range(1,5)] for a_ in range(1,6)]
    def handbones(p):
        f_=ellipsoid(p,Wr+fa_*0.012*s,np.array([0.022,0.012,0.016])*s)
        for a_,chain in enumerate(fings):
            ch=[c for c in chain if c is not None]
            if len(ch)<2: continue
            ch=[Wr+fa_*0.02*s+(ch[0]-Wr)*0.15]+ch; ch.append(ch[-1]+(ch[-1]-ch[-2])*0.7)
            for i_ in range(len(ch)-1):
                r_=(0.0052-0.0007*i_)*s*(1.1 if a_==0 else 1.0)
                f_=smin(f_,capsule(p,ch[i_],ch[i_+1],max(r_,0.0026*s)),0.0015)
        return f_
    allh=[c for ch in fings for c in ch if c is not None]+[Wr]
    lo=np.min(allh,0)-0.03; hi_=np.max(allh,0)+0.03
    hdv,hdf=mesh_from_sdf(handbones,lo,hi_,0.0011,3000)
    # ---- nerves: brachial plexus and arm ----
    def arm_r(P0_,P1_,t):
        c_=P0_+(P1_-P0_)*t; u_=(P1_-P0_)/np.linalg.norm(P1_-P0_)
        m_=(np.isin(vseg,['arm']))&(P[:,0]>0); q=P[m_]-P0_; tt=(q@u_)/np.linalg.norm(P1_-P0_)
        sel=np.abs(tt-t)<0.06; dd=q[sel]-np.outer(q[sel]@u_,u_)
        return c_, (np.linalg.norm(dd,axis=1).mean() if sel.sum()>5 else 0.035*s)
    for sd,sg in (('l',1),('r',-1)):
        Xm=lambda v: np.array([v[0]*sg,v[1],v[2]])
        trunk=Xm(np.array([0.050*s,LV['C7'][1]-0.012*s,LV['C7'][2]+0.022*s])); clm=Xm(clav[2]*0.55+clav[0]*0.45)-np.array([0,0.012*s,0.010*s])
        ax_=Xm(S_+np.array([-0.030,-0.045,0.004])*s)
        bh_={'C3':0.0065,'C4':0.0066,'C5':0.0067,'C6':0.0068,'C7':0.0072,'T1':0.0084}
        for rt,vv,up in [('C5','C5',1),('C6','C6',1),('C7','C7',1),('C8','T1',1),('T1','T1',-1)]:
            h_=bh_[vv]*up
            N[rt+'_'+sd]=[W(vv,(sg*0.005,h_+0.002*up,-0.015)),W(vv,(sg*0.015,h_+0.002*up,-0.010)),W(vv,(sg*0.030,h_-0.004,0.004)),trunk]
        segpts=lambda P0_,P1_,ts,offs: [ (lambda cr: cr[0]+Xm(o_[0]*lat*cr[1])+Xm(o_[1]*ant*cr[1])+Xm(o_[2]*rd*cr[1]) )(arm_r(P0_,P1_,t_)) for t_,o_ in zip(ts,offs)]
        def mirror_pts(pts): return [Xm(q_) for q_ in pts]
        base=[trunk,clm,ax_]
        up_med=[arm_r(S_,E_,t_) for t_ in (0.2,0.55,0.9)]
        med=base+[Xm(c_-lat*0.45*r_+ant*0.45*r_) for c_,r_ in up_med]+[Xm(E_+ant*0.018*s-lat*0.006*s)]
        fo=[arm_r(E_,Wr,t_) for t_ in (0.25,0.6,0.92)]
        med+= [Xm(c_) for c_,r_ in fo]+[Xm(Wr+fa_*0.025*s)]
        uln=base+[Xm(c_-lat*0.75*r_) for c_,r_ in up_med[:2]]+[Xm(E_-lat*0.022*s-ant*0.012*s)]+[Xm(c_-rd*0.55*r_) for c_,r_ in fo]+[Xm(Wr-rd*0.016*s+fa_*0.02*s)]
        rad=base+[Xm(up_med[0][0]-ant*0.6*up_med[0][1]),Xm(up_med[1][0]-ant*0.4*up_med[1][1]+lat*0.6*up_med[1][1]),Xm(E_+lat*0.014*s+ant*0.012*s)]+[Xm(c_+rd*0.6*r_) for c_,r_ in fo]+[Xm(Wr+rd*0.018*s)]
        def fingers(k_list):
            out_=[]
            for a_ in k_list:
                ch=[c for c in fings[a_] if c is not None]
                if ch: out_.append([Xm(c) for c in ch]+[Xm(ch[-1]+(ch[-1]-ch[-2])*0.6)])
            return out_
        N['median_'+sd]=med; N['ulnar_'+sd]=uln; N['radial_'+sd]=rad
        for j_,fp in enumerate(fingers([0,1,2])): N['medianF%d_%s'%(j_,sd)]=[med[-1]]+fp
        for j_,fp in enumerate(fingers([3,4])): N['ulnarF%d_%s'%(j_,sd)]=[uln[-1]]+fp
        for i in range(12):
            rp=RIBS['rib%d_%s'%(i+1,sd)]; nm='T%d'%(i+1)
            N['ic%d_%s'%(i+1,sd)]=[W(nm,(sg*0.012,-0.006,-0.016))]+[q_+np.array([0,-0.006*s,0]) for q_ in rp[1:]]
    for k_,v_ in list(N.items()):
        if k_.split('_')[0] in ('median','ulnar','radial'):
            a_=np.array(v_,float); b_=a_.copy(); b_[3:-1]=0.25*a_[2:-2]+0.5*a_[3:-1]+0.25*a_[4:]; N[k_]=b_
    EXTRA={'sternum':(stv,stf),'scap':(scv,scf),'arm':(arv,arf),'hand':(hdv,hdf)}
    RIBP={k_:np.round(np.array(v_),4).tolist() for k_,v_ in RIBS.items()}; CARTP={k_:np.round(np.array(v_),4).tolist() for k_,v_ in CART.items()}
    CLAV=np.round(np.array(clav),4).tolist()
    for nm in list(LV): LV[nm]=[round(float(v),4) for v in LV[nm]]
    out[cd]={'xf':{k:[round(float(v),5) for v in m.T.ravel()] for k,m in XF.items()},'nerves':{k:np.round(np.array(v),4).tolist() for k,v in N.items()},
             'lv':LV,'lm':{'c4':round(float(LV['C4'][1]),4),'t6':round(float(LV['T6'][1]),4),'sh':round(float(J['l-shoulder'][1]),4),'elbow':round(float(J['l-elbow'][1]),4),'wrist':round(float(J['l-hand'][1]),4),'hj':round(float(hj),4),'knee':round(float(K[1]),4),'ankle':round(float(AN[1]),4),'H':round(float(H),4),'s':round(float(s),4)},'dc':{k:[round(float(x),4) for x in v] for k,v in DC.items()},
             'pmap':PM,'order':ORDER,'discOrder':DORDER,'ribs':RIBP,'cart':CARTP,'clav':CLAV,'extra':{k_:{'v':b64(np.round(v_[0]/(np.abs(v_[0]).max()/32000)).astype(np.int16)),'f':b64(v_[1].astype(np.uint16)),'s':float(np.abs(v_[0]).max()/32000)} for k_,v_ in EXTRA.items()},
             'leg':{'v':b64(np.round(lv_/(np.abs(lv_).max()/32000)).astype(np.int16)),'f':b64(lf_.astype(np.uint16)),'s':float(np.abs(lv_).max()/32000)}}
    print(cd,'leg tris',len(lf_),'S1 y',round(y0,3),'L1 y',round(LV['L1'][1],3),'pel',round(sx,3),round(sy,3),round(sz,3))
data={'parts':parts,'m':out['m'],'f':out['f']}
open('spinedata.js','w').write('window.SPG_SPINE='+json.dumps(data,separators=(',',':'))+';')
print(round(len(open('spinedata.js').read())/1024),'KB')
