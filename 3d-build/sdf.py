import numpy as np
from skimage.measure import marching_cubes
import fast_simplification
def length(v): return np.linalg.norm(v,axis=-1)
def smin(a,b,k):
    h=np.clip(0.5+0.5*(b-a)/k,0,1); return b*(1-h)+a*h-k*h*(1-h)
def smax(a,b,k): return -smin(-a,-b,k)
def capsule(p,a,b,r):
    a=np.array(a,float); b=np.array(b,float); pa=p-a; ba=b-a
    h=np.clip((pa@ba)/(ba@ba),0,1); return length(pa-h[:,None]*ba)-(r if np.isscalar(r) else (r[0]*(1-h)+r[1]*h))
def ellipsoid(p,c,r):
    q=(p-np.array(c))/np.array(r); k0=length(q); k1=length(q/np.array(r)); return k0*(k0-1)/np.maximum(k1,1e-9)
def sphere(p,c,r): return length(p-np.array(c))-r
def rot_x(a): c,s=np.cos(a),np.sin(a); return np.array([[1,0,0],[0,c,-s],[0,s,c]])
def roundbox(p,c,half,r,R=None):
    q=p-np.array(c)
    if R is not None: q=q@R
    d=np.abs(q)-np.array(half)+r
    return length(np.maximum(d,0))+np.minimum(np.max(d,axis=1),0)-r
def mesh_from_sdf(f,lo,hi,step,target=None):
    xs=np.arange(lo[0],hi[0],step); ys=np.arange(lo[1],hi[1],step); zs=np.arange(lo[2],hi[2],step)
    X,Y,Z=np.meshgrid(xs,ys,zs,indexing='ij'); P=np.stack([X.ravel(),Y.ravel(),Z.ravel()],1)
    D=f(P).reshape(X.shape)
    v,fc,_,_=marching_cubes(D,0.0,spacing=(step,step,step))
    v+=np.array(lo)
    if target and len(fc)>target:
        v,fc=fast_simplification.simplify(v.astype(np.float32),fc.astype(np.int32),target_reduction=1-target/len(fc))
    return v,fc
