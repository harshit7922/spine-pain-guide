import numpy as np, json, re
def load_obj(p='base.obj'):
    V=[]; groups={}; cur=None
    for line in open(p):
        if line.startswith('v '): V.append([float(x) for x in line.split()[1:4]])
        elif line.startswith('g '): cur=line.split()[1]
        elif line.startswith('f '):
            idx=[int(t.split('/')[0])-1 for t in line.split()[1:]]
            groups.setdefault(cur,[]).append(idx)
    return np.array(V), groups
def load_target(p):
    d={}
    for line in open(p):
        if line.startswith('#') or not line.strip(): continue
        a=line.split(); d[int(a[0])]=[float(a[1]),float(a[2]),float(a[3])]
    return d
def build(sex):
    V,G=load_obj()
    V=V.copy()
    for r in ['african','asian','caucasian']:
        t=load_target(f't/{r}-{sex}-young.target')
        for i,dv in t.items(): V[i]+=np.array(dv)/3
    return V,G
