import numpy as np, json, base64, trimesh
from sdf import *
from load import load_obj
d=np.load('lm.npy',allow_pickle=True).item()
V0,G=load_obj(); quads=np.array(G['body']); TRI=np.concatenate([quads[:,[0,1,2]],quads[:,[0,2,3]]])
# ---------- vertebra (local frame: y up, z anterior, x = patient's left) ----------
def vertebra(kind, bw, bd, bh, tp, sp_tilt, sp_len):
    def f(p):
        x,y,z=p[:,0],p[:,1],p[:,2]
        waist=1-0.07*(1-np.clip((y/bh)**2,0,1))
        e=np.sqrt((x/(bw*waist))**2+(z/(bd*waist))**2)-1
        e=e*min(bw,bd)
        conc=np.sqrt(x**2+(z+bd+0.0085)**2)-0.0125
        k=smax(e,-conc,0.003)
        body=np.maximum(k,np.abs(y)-bh)
        s=lambda a,b_,r: capsule(p,a,b_,r)
        parts=[]
        for sg in (1,-1):
            parts.append(s((sg*0.011,0.004,-0.012),(sg*0.013,0.004,-0.027),0.0047))      # pedicle
            parts.append(s((sg*0.013,0.007,-0.028),(0,0.002,-0.040),0.0036))            # lamina upper
            parts.append(s((sg*0.013,-0.004,-0.030),(0,-0.007,-0.041),0.0036))          # lamina lower
            parts.append(capsule(p,(sg*0.014,0.004,-0.026),(sg*tp,0.006,-0.031),(0.0048,0.0032)))  # transverse
            parts.append(s((sg*0.013,0.006,-0.029),(sg*0.016,0.019,-0.033),0.0049))     # superior articular
            parts.append(ellipsoid(p,(sg*0.019,0.016,-0.036),(0.004,0.0045,0.004)))     # mammillary
            parts.append(s((sg*0.008,-0.004,-0.039),(sg*0.010,-0.020,-0.038),0.0043))   # inferior articular
        R=rot_x(sp_tilt)
        parts.append(roundbox(p,(0,-0.004-np.sin(sp_tilt)*sp_len*0.5,-0.040-sp_len*0.5*np.cos(sp_tilt)),(0.0033,0.0095,sp_len*0.5),0.0025,R))
        parts.append(ellipsoid(p,(0,-0.006-np.sin(sp_tilt)*sp_len,-0.040-sp_len*np.cos(sp_tilt)),(0.0045,0.0105,0.0045)))
        out=body
        for q in parts: out=smin(out,q,0.0028)
        return out
    return f
def sacrum():
    L=0.105
    def f(p):
        x,y,z=p[:,0],p[:,1],p[:,2]
        t=np.clip(-y/L,0,1)
        w=0.052*(1-t)**0.85+0.011*t
        zc=-0.022*t+0.030*t**2
        h=(0.017*(1-t)+0.0055*t)*(1-0.35*np.clip(np.abs(x)/np.maximum(w,1e-4),0,1)**2)
        dx=np.abs(x)-w; dz=np.abs(z-zc)-h; dy=np.maximum(y-0.0,-y-L)
        d=np.maximum(np.maximum(dx,dz),dy)
        d=smin(d,ellipsoid(p,(0,-0.0005,-0.001),(0.025,0.006,0.017)),0.004)   # S1 endplate body
        for sg in (1,-1):
            d=smin(d,capsule(p,(sg*0.016,0.0,-0.020),(sg*0.017,0.014,-0.026),0.005),0.003)  # superior articular
            for tk in (0.2,0.42,0.62,0.8):
                d=smax(d,-capsule(p,(sg*0.016,-L*tk,0.03),(sg*0.016,-L*tk,-0.01),0.0034),0.0015)
        for tk in (0.15,0.35,0.55,0.72):
            d=smin(d,ellipsoid(p,(0,-L*tk,-0.022*tk+0.03*tk**2-(0.017*(1-tk)+0.0055*tk)-0.003),(0.004,0.008,0.005)),0.003)
        # coccyx
        for i,(tk,r) in enumerate([(1.07,0.0085),(1.17,0.0072),(1.26,0.006),(1.34,0.005)]):
            d=smin(d,ellipsoid(p,(0,-L*tk,-0.022*tk+0.03*tk**2+0.004*(tk-1)*10*0.3),(r*1.3,r,r*0.8)),0.0015)
        return d
    return f
def disc(bw,bd,th):
    def f(p):
        x,y,z=p[:,0],p[:,1],p[:,2]
        e=(np.sqrt((x/bw)**2+(z/bd)**2)-1)*min(bw,bd)
        conc=np.sqrt(x**2+(z+bd+0.0085)**2)-0.0125
        k=smax(e,-conc,0.003)
        return smax(k,np.abs(y)-th/2,0.0025)
    return f
# ---------- pelvis half (left), local frame: origin between hip joints ----------
def pelvis_half():
    crest=np.array([(0.030,0.090,-0.088),(0.060,0.135,-0.080),(0.100,0.152,-0.050),(0.126,0.140,-0.010),(0.128,0.112,0.025),(0.118,0.082,0.048)])
    lower=np.array([(0.032,0.050,-0.080),(0.055,0.030,-0.064),(0.080,0.028,-0.035),(0.090,0.030,-0.008),(0.096,0.036,0.018),(0.104,0.050,0.040)])
    from scipy.interpolate import CubicSpline
    u0=np.linspace(0,1,len(crest)); U=np.linspace(0,1,120); Vv=np.linspace(0,1,50)
    Cc=CubicSpline(u0,crest)(U); Ll=CubicSpline(u0,lower)(U)
    S=(1-Vv[None,:,None])*Cc[:,None,:]+Vv[None,:,None]*Ll[:,None,:]
    # iliac fossa: concave medially (push lateral) in middle
    bulge=np.sin(np.pi*U)[:,None]*np.sin(np.pi*Vv)[None,:]*0.010
    S[:,:,0]+=bulge
    th=(0.0028+0.0035*(1-np.sin(np.pi*Vv))[None,:]+0.002*np.cos(np.pi*U/2)[:,None]**4)
    from scipy.spatial import cKDTree
    pts=S.reshape(-1,3); tree=cKDTree(pts); thf=np.broadcast_to(th,S.shape[:2]).reshape(-1)
    A=np.array((0.090,0.0,0.0))
    def f(p):
        dd,ii=tree.query(p,distance_upper_bound=0.03)
        dd=np.where(np.isinf(dd),0.03,dd); ii=np.minimum(ii,len(thf)-1)
        plate=dd-thf[ii]
        out=plate
        out=smin(out,capsule(p,crest[0],crest[1],0.006),0.003)
        for a_,b_ in zip(crest[1:-1],crest[2:]): out=smin(out,capsule(p,a_,b_,0.0055),0.003)
        cup=np.abs(length(p-A)-0.0265)-0.0045
        dirn=np.array([1,-0.55,0.45]); dirn=dirn/np.linalg.norm(dirn)
        cup=smax(cup,(p-A)@dirn-0.004,0.002)
        out=smin(out,cup,0.004)
        ring=[(0.088,-0.022,-0.012,0.010),(0.076,-0.052,-0.030,0.011),(0.060,-0.074,-0.034,0.013),(0.040,-0.078,0.004,0.008),(0.020,-0.062,0.034,0.0075),(0.007,-0.040,0.050,0.009),(0.030,-0.018,0.050,0.0085),(0.060,-0.008,0.040,0.0085),(0.082,-0.004,0.022,0.009)]
        for a_,b_ in zip(ring[:-1],ring[1:]): out=smin(out,capsule(p,a_[:3],b_[:3],(a_[3],b_[3])),0.004)
        out=smin(out,capsule(p,ring[-1][:3],(0.090,0.012,0.010),0.009),0.005)
        out=smin(out,ellipsoid(p,(0.032,0.07,-0.07),(0.010,0.03,0.016)),0.006)   # sacroiliac auricular region
        return out
    return f
def b64(a): return base64.b64encode(np.ascontiguousarray(a).tobytes()).decode()
def pack(v,f):
    sc=float(np.abs(v).max())/32000
    return {'v':b64(np.round(v/sc).astype(np.int16)),'f':b64(f.astype(np.uint16)),'s':sc}
parts={}
LEVELS=[('T10',0.019,0.0150,0.0105,0.026,0.55,0.030),('T11',0.020,0.0155,0.0110,0.027,0.45,0.030),('T12',0.021,0.0160,0.0115,0.028,0.30,0.030),
        ('L1',0.0225,0.0160,0.0125,0.034,0.12,0.028),('L2',0.0235,0.0163,0.0130,0.038,0.10,0.029),('L3',0.0245,0.0168,0.0135,0.041,0.10,0.030),
        ('L4',0.0252,0.0172,0.0138,0.039,0.12,0.029),('L5',0.0262,0.0178,0.0140,0.036,0.18,0.026)]
for nm,bw,bd,bh,tp,tilt,sl in LEVELS:
    v,f=mesh_from_sdf(vertebra(nm,bw,bd,bh,tp,tilt,sl),(-0.05,-0.04,-0.085),(0.05,0.04,0.025),0.0008,2400)
    parts[nm]=pack(v,f); print(nm,len(f))
v,f=mesh_from_sdf(sacrum(),(-0.065,-0.16,-0.05),(0.065,0.025,0.04),0.0009,3200); parts['sacrum']=pack(v,f); print('sacrum',len(f))
DISCS=[]
for (a,b_) in zip(LEVELS[:-1],LEVELS[1:]):
    DISCS.append((a[0]+'–'+b_[0],(a[1]+b_[1])/2*1.02,(a[2]+b_[2])/2*1.02))
DISCS.append(('L5–S1',0.026,0.0178))
for nm,bw,bd in DISCS:
    v,f=mesh_from_sdf(disc(bw,bd,1.0*0.010),(-0.03,-0.007,-0.03),(0.03,0.007,0.025),0.0008,700); parts['disc_'+nm]=pack(v,f)
v,f=mesh_from_sdf(pelvis_half(),(0.0,-0.095,-0.10),(0.145,0.17,0.07),0.0012,5200); parts['pelvis']=pack(v,f); print('pelvis',len(f))
np.save('spine_parts.npy',dict(parts=parts,LEVELS=LEVELS,DISCS=DISCS),allow_pickle=True)
