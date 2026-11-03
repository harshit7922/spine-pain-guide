# Adds cervical and thoracic vertebrae (+discs) to spine_parts.npy
import numpy as np, base64
from sdf import *
exec(open('spine.py').read().split("def b64(a)")[0].split("# ---------- vertebra")[0])  # imports only
src=open('spine.py').read()
exec(src[src.index('def vertebra('):src.index('def sacrum(')])
exec(src[src.index('def disc('):src.index('# ---------- pelvis')])
def b64(a): return base64.b64encode(np.ascontiguousarray(a).tobytes()).decode()
def pack(v,f):
    sc=float(np.abs(v).max())/32000
    return {'v':b64(np.round(v/sc).astype(np.int16)),'f':b64(f.astype(np.uint16)),'s':sc}
SP=np.load('spine_parts.npy',allow_pickle=True).item(); parts=SP['parts']
def cervical(bw,bd,bh,sp_len,bifid,c7=False):
    def f(p):
        x,y,z=p[:,0],p[:,1],p[:,2]
        e=(np.sqrt((x/bw)**2+(z/bd)**2)-1)*min(bw,bd)
        body=smax(e,np.abs(y)-bh,0.0015)
        out=body
        for sg in (1,-1):
            out=smin(out,capsule(p,(sg*bw*0.85,bh*0.6,0.0),(sg*bw*0.95,bh+0.003,-0.002),0.0022),0.0015)          # uncinate
            out=smin(out,capsule(p,(sg*0.008,0.0,-0.007),(sg*0.012,0.0,-0.014),0.0032),0.002)                  # pedicle
            out=smin(out,ellipsoid(p,(sg*0.0165,0.0,-0.017),(0.0065,0.0095,0.0075)),0.002)                       # lateral mass / facets
            ring=smax(np.abs(length((p-np.array((sg*0.020,0.0,-0.004)))*np.array((1,1.6,1)))-0.0052)-0.0022,np.abs(y)-0.0042,0.001)
            out=smin(out,ring,0.0015)                                                                             # transverse process with foramen
            out=smin(out,capsule(p,(sg*0.017,-0.001,-0.021),(0,0.0,-0.028),0.0028),0.002)                      # lamina
        tip=(0,-0.006 if not c7 else -0.010,-0.028-sp_len)
        out=smin(out,capsule(p,(0,-0.001,-0.027),tip,0.0034 if not c7 else 0.0042),0.002)
        if bifid:
            for sg in (1,-1): out=smin(out,ellipsoid(p,(sg*0.0045,tip[1],tip[2]),(0.004,0.004,0.004)),0.002)
        else: out=smin(out,ellipsoid(p,tip,(0.005,0.006,0.005)),0.002)
        return out
    return f
def atlas():
    def f(p):
        x,y,z=p[:,0],p[:,1],p[:,2]
        r=np.sqrt((x/0.023)**2+((z+0.008)/0.021)**2)
        ring=smax(np.abs(r-1)*0.021-0.0035,np.abs(y)-0.0045,0.001)
        out=ring
        for sg in (1,-1):
            out=smin(out,ellipsoid(p,(sg*0.017,0,-0.004),(0.0075,0.0075,0.010)),0.002)
            out=smin(out,smax(np.abs(length((p-np.array((sg*0.032,0.0,-0.006)))*np.array((1,1.5,1)))-0.005)-0.0025,np.abs(y)-0.004,0.001),0.002)
        out=smin(out,ellipsoid(p,(0,0,0.012),(0.006,0.005,0.004)),0.002)
        out=smin(out,ellipsoid(p,(0,0,-0.030),(0.004,0.005,0.004)),0.002)
        return out
    return f
def axis():
    def f(p):
        x,y,z=p[:,0],p[:,1],p[:,2]
        e=(np.sqrt((x/0.0085)**2+(z/0.008)**2)-1)*0.008
        body=smax(e,np.abs(y+0.002)-0.009,0.0015)
        out=smin(body,capsule(p,(0,0.006,0.001),(0,0.020,0.002),0.0045),0.002)   # dens
        for sg in (1,-1):
            out=smin(out,ellipsoid(p,(sg*0.0135,0.005,-0.006),(0.007,0.005,0.009)),0.002)
            out=smin(out,capsule(p,(sg*0.012,0.0,-0.012),(0,-0.002,-0.028),0.0035),0.002)
            out=smin(out,ellipsoid(p,(sg*0.005,-0.005,-0.038),(0.0045,0.006,0.005)),0.002)
        out=smin(out,capsule(p,(0,-0.002,-0.026),(0,-0.005,-0.036),0.0045),0.002)
        return out
    return f
new={}
v,f=mesh_from_sdf(atlas(),(-0.05,-0.012,-0.045),(0.05,0.012,0.025),0.0006,1600); new['C1']=pack(v,f)
v,f=mesh_from_sdf(axis(),(-0.03,-0.018,-0.05),(0.03,0.03,0.02),0.0006,1600); new['C2']=pack(v,f)
v,f=mesh_from_sdf(cervical(0.0085,0.0075,0.0065,0.010,True),(-0.035,-0.02,-0.05),(0.035,0.02,0.015),0.0006,1600); new['C36']=pack(v,f)
v,f=mesh_from_sdf(cervical(0.0095,0.0080,0.0070,0.020,False,True),(-0.04,-0.025,-0.06),(0.04,0.02,0.015),0.0006,1700); new['C7']=pack(v,f)
v,f=mesh_from_sdf(vertebra('Tup',0.0135,0.0115,0.0085,0.024,0.85,0.026),(-0.04,-0.045,-0.08),(0.04,0.03,0.02),0.0007,1800); new['Tup']=pack(v,f)
v,f=mesh_from_sdf(vertebra('Tmid',0.0165,0.0140,0.0095,0.025,1.0,0.030),(-0.045,-0.05,-0.085),(0.045,0.03,0.025),0.0007,1800); new['Tmid']=pack(v,f)
for nm,bw,bd,th in [('discC',0.0095,0.0082,0.0045),('discTup',0.0145,0.0125,0.0045),('discTmid',0.0175,0.0150,0.0050)]:
    v,f=mesh_from_sdf(disc(bw,bd,th),(-0.022,-0.004,-0.022),(0.022,0.004,0.02),0.0006,500); new[nm]=pack(v,f)
parts.update(new); SP['parts']=parts
np.save('spine_parts2.npy',SP,allow_pickle=True); print({k:len(base64.b64decode(v['f']))//6 for k,v in new.items()})
