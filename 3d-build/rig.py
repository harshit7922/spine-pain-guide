# Builds a small skeleton for posing the 3D bodies (bedside-test pictures).
# Output: rigdata.js -> window.SPG_RIG = {bones:[[name,parentIndex],...], bi:<uint8 x4 per vertex>, bw:<uint8 x4>, m:{piv}, f:{piv}}
# Same arms-down rest pose and coordinates as bodydata.js (body5.py).
import numpy as np, json, base64
from load import load_obj, build

V0, G = load_obj()
NB = 13380
W = json.load(open('weights.mhw'))['weights']
SK = json.load(open('default.mhskel'))
JV = SK['joints']

def verts(name): return sorted(set(i for f in G[name] for i in f))
def tf(V):
    g = V[verts('joint-ground')].mean(0); return (V - np.array([0, g[1], 0])) * 0.1

# ---- arm lowering, identical to body5.py ----
ARM = ('shoulder01', 'upperarm', 'lowerarm', 'wrist', 'finger', 'metacarpal')
def armw2(sd):
    w = np.zeros(len(V0))
    for b, l in W.items():
        if b.endswith('.' + sd) and b.startswith(ARM):
            for v, xx in l: w[v] += xx
        if b == 'clavicle.' + sd:
            for v, xx in l: w[v] += 0.25 * xx
    return np.clip(w, 0, 1)
AW = {'L': armw2('L'), 'R': armw2('R')}
def pose(V, deg=30):
    V = V.copy()
    for sd, sgn in (('L', -1), ('R', 1)):
        j = V[verts('joint-' + sd.lower() + '-shoulder')].mean(0); a_ = np.radians(deg) * sgn; c, s_ = np.cos(a_), np.sin(a_)
        d = V - j; rot = np.stack([d[:, 0] * c - d[:, 1] * s_, d[:, 0] * s_ + d[:, 1] * c, d[:, 2]], 1) + j
        w = AW[sd][:, None]; V = V * (1 - w) + rot * w
    return V

# ---- reduced bones: name, parent, MakeHuman bones merged into it, pivot joint(s) ----
FACE = ['head', 'jaw', 'eye.L', 'eye.R', 'oculi01.L', 'oculi01.R', 'orbicularis03.L', 'orbicularis03.R', 'orbicularis04.L', 'orbicularis04.R',
        'oris01', 'oris03.L', 'oris03.R', 'oris05', 'oris07.L', 'oris07.R', 'risorius03.L', 'risorius03.R', 'special04', 'special05.L', 'special05.R',
        'tongue00', 'tongue01', 'tongue02', 'tongue03', 'tongue04', 'tongue05.L', 'tongue05.R', 'tongue06.L', 'tongue06.R', 'tongue07.L', 'tongue07.R',
        'levator05.L', 'levator05.R', 'levator06.L', 'levator06.R']
BONES = [
    ('hips', None, ['root', 'pelvis.L', 'pelvis.R', 'spine05'], ['root____head']),
    ('lspine', 'hips', ['spine04', 'spine03'], ['spine04____head']),
    ('tspine', 'lspine', ['spine02'], ['spine02____head']),
    ('chest', 'tspine', ['spine01', 'breast.L', 'breast.R'], ['spine01____head']),
    ('neck', 'chest', ['neck01', 'neck02', 'neck03'], ['neck01____head']),
    ('head', 'neck', FACE, ['head____head']),
]
for sd in 'LR':
    s = sd.lower()
    BONES += [
        ('clav_' + s, 'chest', ['clavicle.' + sd, 'shoulder01.' + sd], ['clavicle.%s____head' % sd]),
        ('uarm_' + s, 'clav_' + s, ['upperarm01.' + sd, 'upperarm02.' + sd], ['upperarm01.%s____head' % sd]),
        ('farm_' + s, 'uarm_' + s, ['lowerarm01.' + sd, 'lowerarm02.' + sd], ['lowerarm01.%s____head' % sd]),
        ('hand_' + s, 'farm_' + s, ['wrist.' + sd] + ['metacarpal%d.%s' % (i, sd) for i in range(1, 5)], ['wrist.%s____head' % sd]),
    ]
    for f in range(1, 6):
        for k in range(1, 4):
            par = 'hand_' + s if k == 1 else 'f%d%d_%s' % (f, k - 1, s)
            BONES.append(('f%d%d_%s' % (f, k, s), par, ['finger%d-%d.%s' % (f, k, sd)], ['finger%d-%d.%s____head' % (f, k, sd)]))
    BONES += [
        ('thigh_' + s, 'hips', ['upperleg01.' + sd, 'upperleg02.' + sd], ['upperleg01.%s____head' % sd]),
        ('shin_' + s, 'thigh_' + s, ['lowerleg01.' + sd, 'lowerleg02.' + sd], ['lowerleg01.%s____head' % sd]),
        ('foot_' + s, 'shin_' + s, ['foot.' + sd], ['foot.%s____head' % sd]),
        ('toes_' + s, 'foot_' + s, [b for b in W if b.startswith('toe') and b.endswith('.' + sd)], ['toe%d-1.%s____head' % (i, sd) for i in range(1, 6)]),
    ]
names = [b[0] for b in BONES]; idx = {n: i for i, n in enumerate(names)}
used = set(m for b in BONES for m in b[2]); missing = [b for b in W if b not in used]
print('bones', len(BONES), 'unmapped MH bones:', missing)

# ---- per-vertex weights (body vertices only), top 4 ----
A = np.zeros((NB, len(BONES)))
for i, b in enumerate(BONES):
    for m in b[2]:
        for v, w in W.get(m, []):
            if v < NB: A[v, i] += w
nz = A.sum(1) == 0; A[nz, idx['hips']] = 1; print('vertices without weights:', int(nz.sum()))
top = np.argsort(-A, 1)[:, :4]; tw = np.take_along_axis(A, top, 1); tw = tw / tw.sum(1, keepdims=True)
q = np.floor(tw * 255).astype(int); q[:, 0] += 255 - q.sum(1)
b64 = lambda a: base64.b64encode(np.ascontiguousarray(a).tobytes()).decode()
out = {'bones': [[b[0], idx[b[1]] if b[1] else -1] for b in BONES], 'bi': b64(top.astype(np.uint8)), 'bw': b64(q.astype(np.uint8))}
for sex, cd in (('male', 'm'), ('female', 'f')):
    V, _ = build(sex); P = tf(pose(V))
    piv = [np.mean([P[JV[j]].mean(0) for j in b[3]], 0) for b in BONES]
    out[cd] = {'piv': np.round(np.array(piv), 4).tolist()}
open('rigdata.js', 'w').write('window.SPG_RIG=' + json.dumps(out, separators=(',', ':')) + ';')
print(round(len(open('rigdata.js').read()) / 1024), 'KB')
P = out['m']['piv']; print({n: [round(x, 3) for x in P[idx[n]]] for n in ['hips', 'lspine', 'tspine', 'chest', 'neck', 'head', 'uarm_l', 'farm_l', 'hand_l', 'thigh_l', 'shin_l', 'foot_l', 'toes_l']})
