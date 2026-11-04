(function(){
'use strict';
const PI = Math.PI;
const $ = s => document.querySelector(s);
const L = (en, hi) => ({en, hi});
let lang = 'en';
let langChosen = false;
try { const s = localStorage.getItem('spg-lang'); if (s === 'en' || s === 'hi') { lang = s; langChosen = true; } } catch (e) {}
const tx = o => !o ? '' : typeof o === 'string' ? o : (o[lang] || o.en || '');
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fmt = (o, a, b) => tx(o).replace('{a}', a).replace('{b}', b);
const reduced = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);

/* ================= data binding (all research data comes from data/*.js) ================= */
const C = SPG.data.common;
const SRC = C.SRC, AGES = C.AGES, SEXES = C.SEXES, EPIS = C.EPIS, RISKS = C.RISKS, SINCE = C.SINCE, HX = C.HX, BTW = C.BTW, TRENDS = C.TRENDS, WALKS = C.WALKS, SITS = C.SITS, SLEEPS = C.SLEEPS, DEPTS = C.DEPTS, STATS = C.STATS, LEVELS = C.LEVELS;
const SRCI = {}; SRC.forEach((s, i) => SRCI[s[0]] = i + 1);
const cite = (...keys) => keys.filter(k => SRCI[k]).map(k => `<sup class="cite"><a href="#src-${SRCI[k]}">[${SRCI[k]}]</a></sup>`).join('');
const MODS = Object.values(SPG.data.modules).sort((a, b) => a.order - b.order);
let ONSETS = C.ONSETS, M, U, DOMS, PAT, RFS, V, AREAS, TESTS, CONDS, EMERG, ROOTS, RS, FX, LBL = {}, STEPS = [];
function buildLBL(){
  LBL = {};
  [AGES,SEXES,EPIS,RISKS,ONSETS,SINCE,HX,BTW,TRENDS,DOMS || [],PAT.char,PAT.worse,PAT.better,PAT.other,RFS].forEach(arr => arr.forEach(o => LBL[o[0]] = o[1]));
  M.FUNCS.forEach(f => f.opts.forEach(o => LBL[o[0]] = o[1]));
  AREAS.forEach(a => LBL[a.id] = a.name);
  const UU = Object.assign({}, C.U, M.UI || {});
  (M.TESTS || []).forEach(t => t.ans.forEach(o => { const r = UU[o[1]] || {}; LBL[o[0]] = L(t.name.en + ': ' + (r.en || '').toLowerCase(), t.name.hi + ': ' + (r.hi || '')); }));
  Object.assign(LBL, {age_lt40:L('Age under 40','40 से कम उम्र'), age_ge50:L('Age 50 or over','50 या ज़्यादा उम्र')}, C.LBLX || {}, M.LBLX || {});
}
function useModule(id){
  M = SPG.data.modules[id] || MODS[0];
  U = Object.assign({}, C.U, M.UI || {});
  ONSETS = M.ONSETS || C.ONSETS; DOMS = M.DOMS || null; PAT = M.PAT; RFS = M.RFS; AREAS = M.AREAS; TESTS = M.TESTS; CONDS = M.CONDS; EMERG = M.EMERG; ROOTS = M.ROOTS;
  RS = Object.assign({}, C.RS, M.RS); FX = Object.assign({}, C.FX, M.FX || {}); V = Object.assign({}, C.VIEWS, M.VIEWS);
  buildLBL(); buildSteps();
}
const lab = k => LBL[k] ? tx(LBL[k]) : k;
const optLab = id => LBL[id] ? tx(LBL[id]) : '';

/* ================= state ================= */
const fresh = () => ({age:'',sex:'',ep:'',hx:'',btw:'',risks:[],areas:{},dom:'',onset:'',since:'',trend:'',pat:[],pain:5,walk:'',sit:'',sleep:'',arm:'',slr:'',cslr:'',heel:'',toe:'',rf:{}});
let A = fresh();
const S = {view:'start', idx:0};
function buildSteps(){
  STEPS = [{sec:0,k:'profile'}].concat(AREAS.map(a => ({sec:1,k:'area',a})));
  if (DOMS && M.domWhen) STEPS.push({sec:1,k:'dom',when:() => evalW(M.domWhen, features(A), A.pain)});
  STEPS.push({sec:2,k:'onset'}, {sec:2,k:'time'}, {sec:3,k:'pattern'}, {sec:4,k:'function'});
  TESTS.forEach(t => STEPS.push({sec:5,k:'test',t}));
  STEPS.push({sec:6,k:'safety'});
}
const valid = i => !STEPS[i].when || STEPS[i].when();
const regionsOf = (a, v) => !a.pair ? (v === 'yes' ? [a.id] : []) : v === 'both' ? [a.id+'_l', a.id+'_r'] : v === 'l' ? [a.id+'_l'] : v === 'r' ? [a.id+'_r'] : [];
const allRegions = a => a.pair ? [a.id+'_l', a.id+'_r'] : [a.id];
function yesRegions(){ const o = []; AREAS.forEach(a => { const v = A.areas[a.id]; if (v) o.push(...regionsOf(a, v)); }); return o; }
function curRegions(){
  if (S.view === 'start' || S.view === 'lang') return M.startRegions || [AREAS[0].id];
  if (S.view !== 'q') return [];
  const st = STEPS[S.idx];
  if (st.k === 'area') return allRegions(st.a);
  if (st.k === 'safety') return M.safetyRegions || [];
  return [];
}

/* ================= analysis engine (generic; rules come from the module data) ================= */
function evalW(w, F, pain){
  if (!w) return false;
  if (typeof w === 'string') return F.has(w);
  if (w.any) return w.any.some(x => evalW(x, F, pain));
  if (w.all) return w.all.every(x => evalW(x, F, pain));
  if (w.not) return !evalW(w.not, F, pain);
  if (w.painGte !== undefined) return pain >= w.painGte;
  if (w.atLeast) return w.atLeast[1].filter(x => evalW(x, F, pain)).length >= w.atLeast[0];
  return false;
}
function sidesOf(a, ids){ const s = new Set(); (ids || []).forEach(k => { const v = a.areas[k]; if (v === 'both') { s.add('l'); s.add('r'); } else if (v === 'l' || v === 'r') s.add(v); }); return s; }
function features(a){
  const F = new Set();
  [a.age, a.sex, a.ep, a.dom, a.onset, a.since, a.trend, a.hx, a.btw].forEach(x => x && F.add(x));
  if (a.hx) F.add(a.hx === 'h_first' ? 'ep_first' : 'ep_recur');
  M.FUNCS.forEach(f => a[f.id] && F.add(a[f.id]));
  TESTS.forEach(t => a[t.id] && F.add(a[t.id]));
  a.risks.forEach(x => F.add(x)); a.pat.forEach(x => F.add(x));
  Object.keys(a.rf).forEach(k => { if (a.rf[k] === 'yes') F.add(k); });
  AREAS.forEach(ar => { const v = a.areas[ar.id]; if (v && v !== 'no') { F.add(ar.id); if (v === 'l' || v === 'both') F.add(ar.id + '_l'); if (v === 'r' || v === 'both') F.add(ar.id + '_r'); } });
  const sd = sidesOf(a, M.SIDES.areas);
  if (sd.size === 2 && M.SIDES.both) F.add(M.SIDES.both); else if (sd.size === 1 && M.SIDES.one) F.add(M.SIDES.one);
  if (['a_u18','a_18_29','a_30_39'].includes(a.age)) F.add('age_lt40');
  if (['a_50_59','a_60p'].includes(a.age)) F.add('age_ge50');
  for (let pass = 0; pass < 2; pass++) (M.DERIVED || []).forEach(d => { if (evalW(d.when, F, a.pain)) F.add(d.id); });
  return F;
}
function analyze(a){
  const F = features(a), has = k => F.has(k), pain = a.pain, ev = w => evalW(w, F, pain);
  let level, reasons = [];
  const emerg = Object.keys(M.EMERG_WHEN).filter(k => ev(M.EMERG_WHEN[k]));
  if (emerg.length) { level = 'red'; RFS.forEach(r => { if (has(r[0])) reasons.push(r[1]); }); }
  else {
    const O = M.URGENCY.orange.filter(r => ev(r.when)).map(r => RS[r.r]), Y = M.URGENCY.yellow.filter(r => ev(r.when)).map(r => RS[r.r]);
    if (O.length) { level = 'orange'; reasons = O.concat(Y); }
    else if (Y.length) { level = 'yellow'; reasons = Y; }
    else { level = 'green'; reasons = [RS.g_ok]; }
  }
  const ranked = CONDS.map(c => {
    let s = 0; const pros = [], cons = [];
    if (c.onlyIf && !ev(c.onlyIf)) return {c, s:0, rel:0, strength:'', pros, cons};
    Object.keys(c.w).forEach(k => { if (has(k)) { s += c.w[k]; (c.w[k] > 0 ? pros : cons).push([k, c.w[k]]); } });
    pros.sort((x, y) => y[1] - x[1]); cons.sort((x, y) => x[1] - y[1]);
    const anchored = c.anchor.some(has);
    let strength = s >= c.th[0] ? 'strong' : s >= c.th[1] ? 'moderate' : s >= c.th[2] ? 'possible' : '';
    if (!anchored && strength) strength = s >= c.th[1] ? 'possible' : '';
    if (c.rare && strength) strength = 'ruleout';
    return {c, s, rel: s / c.th[0], strength, pros, cons};
  }).filter(r => r.strength).sort((x, y) => {
    const rank = {strong:3, moderate:2, ruleout:1.5, possible:1};
    return (rank[y.strength] - rank[x.strength]) || (y.rel - x.rel);
  });
  const roots = []; (M.ROOT_RULES || []).forEach(r => { if (ev(r.when) && !roots.includes(r.root)) roots.push(r.root); });
  const sides = sidesOf(a, M.SIDES.sideAreas || M.SIDES.areas);
  const list = [];
  const push = (d, why) => { let e = list.find(x => x.id === d); if (!e) { e = {id:d, why:[]}; list.push(e); } if (why && !e.why.some(w => w.en === why.en)) e.why.push(why); };
  const rules = M.DEPT_RULES || [];
  emerg.forEach(e => EMERG[e].depts.forEach(d => push(d, EMERG[e].name)));
  ranked.slice(0, 3).filter((r, i) => i === 0 || r.strength !== 'possible').forEach(r => r.c.depts.forEach(d0 => {
    const d = typeof d0 === 'string' ? d0 : (ev(d0.when) ? d0.id : null); if (!d) return;
    if (rules.some(x => x.drop === d && x.cond === r.c.id && !ev(x.unless))) return; push(d, r.c.name); }));
  rules.filter(x => x.add && ev(x.when)).forEach(x => x.add.forEach(d => push(d, RS[x.why])));
  if (!list.length) { push('gp'); push(M.defaultDept || 'ortho_spine'); }
  let depts = list;
  if (level !== 'green') depts = list.filter(d => d.id !== 'physio').concat(list.filter(d => d.id === 'physio'));
  if (level === 'red') { const ed = new Set(emerg.flatMap(e => EMERG[e].depts)); depts = depts.filter(d => d.id === 'emergency').concat(depts.filter(d => d.id !== 'emergency' && ed.has(d.id))); }
  return {F, level, reasons:dedupe(reasons).slice(0, 6), emerg, ranked, roots, sides, depts:depts.slice(0, 4)};
}
function dedupe(arr){ const seen = new Set(); return arr.filter(r => { if (seen.has(r.en)) return false; seen.add(r.en); return true; }); }
function discInfo(R){
  const roots = R.roots.filter(r => M.DISC_OF[r]);
  if (!roots.length) return {known:false, roots:M.RCA.defaultRoots, levels:M.RCA.defaultLevels};
  return {known:true, roots, levels:roots.map(r => M.DISC_OF[r])};
}
function sideText(sides){ return sides.size === 2 ? tx(U.sideB) : sides.has('l') ? tx(U.sideL) : sides.has('r') ? tx(U.sideR) : ''; }
function rcaText(R){
  const d = discInfo(R), st = sideText(R.sides), hi = lang === 'hi';
  const sub = t => t.replace('{levels}', d.levels.join(hi ? ' या ' : ' or ')).replace('{roots}', d.roots.join(hi ? ' या ' : ' or '))
    .replace('{sideEn}', st ? ' on the ' + (R.sides.size === 2 ? 'both sides' : st + ' side') : '').replace('{sideHi}', st ? ' (' + st + ' तरफ)' : '')
    .replace(/\{cite:(\w+)\}/g, (m, k) => cite(k));
  return M.RCA.text[hi ? 'hi' : 'en'].map(sub).concat([sub(tx(d.known ? M.RCA.known : M.RCA.unknown))]);
}
function rcaApplies(R){ const top = R.ranked[0]; return !!M.RCA && ((top && M.RCA.conds.includes(top.c.id)) || R.emerg.some(e => M.RCA.emerg.includes(e))); }

/* ================= diagrams (SVG) ================= */
const PAL_PAGE = {bone:'var(--bone)',boneE:'var(--bone-edge)',disc:'var(--disc)',discE:'var(--disc-edge)',nuc:'var(--nucleus)',sac:'var(--sac)',nerve:'var(--nerve)',hit:'var(--lesion)',ink:'var(--ink)',muted:'var(--muted)',bg:'var(--surface-2)'};
const PAL_PDF = {bone:'#EEE7D9',boneE:'#A99D86',disc:'#AFC3D3',discE:'#5C7891',nuc:'#DCE8F1',sac:'#E6EFF7',nerve:'#B98600',hit:'#D2451F',ink:'#0F1C26',muted:'#56636E',bg:'#EDF1F4'};
const st = (f, s, w) => `style="fill:${f};stroke:${s || 'none'};stroke-width:${w || 0}"`;
const txt = (x, y, t, p, o) => `<text x="${x}" y="${y}" style="fill:${o && o.c || p.ink};font:${o && o.w || 500} ${o && o.s || 11}px 'IBM Plex Sans','IBM Plex Sans Devanagari',Arial,sans-serif" ${o && o.a ? `text-anchor="${o.a}"` : ''}>${esc(t)}</text>`;
function sagittalSVG(d, p){
  const H = lang === 'hi';
  const names = ['L1','L2','L3','L4','L5'], discs = ['L1–L2','L2–L3','L3–L4','L4–L5','L5–S1'];
  const top = i => 18 + i * 60;
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 420" role="img" aria-label="${H ? 'कमर की रीढ़ का साइड व्यू' : 'Side view of the lumbar spine'}">`;
  s += `<rect x="0" y="0" width="520" height="420" ${st(p.bg)}/>`;
  s += `<path d="M204 6 L236 6 L236 330 Q230 368 220 378 Q210 368 204 330 Z" ${st(p.sac, p.discE, 1)}/>`;
  for (let i = 0; i < 4; i++) s += `<line x1="${212 + i * 4}" y1="10" x2="${214 + i * 2}" y2="${340 + i * 6}" style="stroke:${p.nerve};stroke-width:1.2;opacity:.55"/>`;
  names.forEach((n, i) => {
    const y = top(i);
    s += `<rect x="74" y="${y}" width="116" height="46" rx="6" ${st(p.bone, p.boneE, 1.2)}/>`;
    s += `<path d="M240 ${y + 6} L276 ${y + 4} L338 ${y + 16} Q348 ${y + 23} 338 ${y + 30} L276 ${y + 42} L240 ${y + 40} Z" ${st(p.bone, p.boneE, 1.2)}/>`;
    s += txt(132, y + 29, n, p, {a:'middle', w:700, s:15});
  });
  s += `<path d="M76 318 L196 318 L246 326 L262 400 L176 412 L104 380 Z" ${st(p.bone, p.boneE, 1.2)}/>` + txt(172, 372, 'S1', p, {a:'middle', w:700, s:15});
  discs.forEach((nm, i) => {
    const y = top(i) + 46, hit = d.levels.includes(nm);
    s += `<rect x="76" y="${y + 2}" width="112" height="10" rx="4" ${st(hit ? p.hit : p.disc, hit ? p.hit : p.discE, 1)}/>`;
    s += txt(66, y + 11, nm, p, {a:'end', s:12, w:hit ? 700 : 500, c:hit ? p.hit : p.muted});
    if (hit) s += `<path d="M186 ${y} Q224 ${y + 7} 186 ${y + 14} Z" ${st(p.hit)}/>`;
  });
  const RI = {L3:1, L4:2, L5:3, S1:4};
  d.roots.forEach(r => {
    const i = RI[r]; if (i === undefined) return;
    const y0 = top(i) + 36, y1 = i < 4 ? top(i + 1) + 40 : 352;
    s += `<path d="M220 ${y0} L220 ${y1}" style="fill:none;stroke:${p.hit};stroke-width:5;stroke-linecap:round"/><circle cx="220" cy="${y1}" r="6" ${st(p.hit)}/>`;
  });
  const li = Math.max(0, discs.indexOf(d.levels[0])), dy = top(li) + 53, ri = RI[d.roots[0]] !== undefined ? RI[d.roots[0]] : li;
  const ry = top(ri) + 62;
  const call = (x1, y1, ty, t1, t2, c) => `<line x1="${x1}" y1="${y1}" x2="364" y2="${ty - 4}" style="stroke:${p.ink};stroke-width:0.9"/><circle cx="${x1}" cy="${y1}" r="2.2" ${st(p.ink)}/>` + txt(368, ty, t1, p, {w:700, s:13, c:c || p.ink}) + (t2 ? txt(368, ty + 17, t2, p, {s:12, c:p.muted}) : '');
  s += call(226, 24, 30, H ? 'स्पाइनल कैनाल' : 'Spinal canal', H ? 'नसों का गुच्छा' : 'bundle of nerve roots');
  s += call(204, dy, Math.max(dy - 26, 80), H ? 'हर्निएशन' : 'Herniation', (d.known ? d.levels[0] : d.levels.join(' / ')) + (H ? ' डिस्क' : ' disc'), p.hit);
  s += call(220, ry, Math.min(Math.max(dy - 26, 80) + 58, 380), d.roots.join(' / ') + (H ? ' नस की जड़' : ' nerve root'), H ? 'दबी हुई, सूजी हुई' : 'pressed and inflamed', p.hit);
  s += txt(12, 412, H ? '← आगे' : '← Front', p, {c:p.muted, s:11}) + txt(508, 412, H ? 'पीछे →' : 'Back →', p, {c:p.muted, s:11, a:'end'});
  return s + '</svg>';
}
function axialSVG(d, p){
  const H = lang === 'hi', side = d.side;
  const tr = d.roots[0] || M.RCA.defaultRoots[0], ex = (M.EXIT_OF || {})[tr] || '';
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 380" role="img" aria-label="${H ? 'डिस्क का क्रॉस-सेक्शन' : 'Axial disc cross-section'}">`;
  s += `<rect x="0" y="0" width="540" height="380" ${st(p.bg)}/><g transform="translate(10,0)">`;
  s += `<path d="M182 168 L206 176 L196 222 L170 216 Z" ${st(p.bone, p.boneE, 1.2)}/><path d="M338 168 L314 176 L324 222 L350 216 Z" ${st(p.bone, p.boneE, 1.2)}/>`;
  s += `<circle cx="168" cy="240" r="18" ${st(p.bone, p.boneE, 1.2)}/><circle cx="352" cy="240" r="18" ${st(p.bone, p.boneE, 1.2)}/>`;
  s += `<path d="M182 252 Q260 300 338 252 L330 272 Q260 320 190 272 Z" ${st(p.bone, p.boneE, 1.2)}/><rect x="248" y="292" width="24" height="62" rx="8" ${st(p.bone, p.boneE, 1.2)}/>`;
  s += `<path d="M150 118 Q150 48 260 44 Q370 48 370 118 Q370 160 322 172 Q292 160 260 162 Q228 160 198 172 Q150 160 150 118 Z" ${st(p.disc, p.discE, 1.4)}/>`;
  s += `<ellipse cx="260" cy="108" rx="56" ry="32" ${st(p.nuc, p.discE, 1)}/>`;
  s += `<ellipse cx="260" cy="224" rx="44" ry="32" ${st(p.sac, p.discE, 1.2)}/>`;
  [[246,214],[260,208],[274,214],[252,228],[268,228],[260,242]].forEach(c => s += `<circle cx="${c[0]}" cy="${c[1]}" r="3.4" ${st(p.nerve)}/>`);
  [128, 392].forEach(x => s += `<ellipse cx="${x}" cy="170" rx="14" ry="9" ${st(p.nerve)}/>`);
  const hitL = side === 'l' || side === 'b', hitR = side === 'r' || side === 'b';
  if (side === 'l') s += `<path d="M276 166 Q300 208 322 168 Z" ${st(p.hit)}/><ellipse cx="300" cy="184" rx="20" ry="15" ${st(p.hit)}/>`;
  else if (side === 'r') s += `<path d="M244 166 Q220 208 198 168 Z" ${st(p.hit)}/><ellipse cx="220" cy="184" rx="20" ry="15" ${st(p.hit)}/>`;
  else s += `<ellipse cx="260" cy="176" rx="46" ry="16" ${st(p.hit)}/>`;
  s += `<circle cx="${hitR ? 204 : 212}" cy="${hitR ? 204 : 198}" r="${hitR ? 11 : 9}" ${st(hitR ? p.hit : p.nerve, hitR ? p.ink : 'none', hitR ? 1.6 : 0)}/>`;
  s += `<circle cx="${hitL ? 316 : 308}" cy="${hitL ? 204 : 198}" r="${hitL ? 11 : 9}" ${st(hitL ? p.hit : p.nerve, hitL ? p.ink : 'none', hitL ? 1.6 : 0)}/>`;
  s += '</g>';
  const ld = (ax, ay, ty, t, sd, c) => sd === 'L'
    ? `<line x1="${ax + 10}" y1="${ay}" x2="124" y2="${ty - 4}" style="stroke:${p.muted};stroke-width:0.9"/><circle cx="${ax + 10}" cy="${ay}" r="2" ${st(p.ink)}/>` + txt(120, ty, t, p, {s:12, a:'end', w:600, c:c || p.ink})
    : `<line x1="${ax + 10}" y1="${ay}" x2="416" y2="${ty - 4}" style="stroke:${p.muted};stroke-width:0.9"/><circle cx="${ax + 10}" cy="${ay}" r="2" ${st(p.ink)}/>` + txt(420, ty, t, p, {s:12, w:600, c:c || p.ink});
  const herS = side === 'r' ? 'L' : 'R';
  s += ld(162, 88, 70, H ? 'एनुलस (छल्ला)' : 'Annulus', 'L');
  if (ex) s += ld(128, 170, 146, (H ? 'निकलती जड़ ' : 'Exiting root ') + ex, 'L');
  s += ld(156, 246, 290, H ? 'फ़ैसेट जोड़' : 'Facet joint', 'L');
  s += ld(290, 100, 70, H ? 'न्यूक्लियस (जेल)' : 'Nucleus', 'R');
  s += ld(side === 'r' ? 206 : side === 'l' ? 314 : 300, 180, side === 'r' ? 192 : 168, H ? 'हर्निएशन' : 'Herniation', herS, p.hit);
  s += ld(side === 'r' ? 196 : 324, 206, side === 'r' ? 232 : 214, (M.RCA.cerv ? (H ? 'दबी जड़ ' : 'Pressed root ') : (H ? 'नीचे जाती जड़ ' : 'Traversing root ')) + tr, herS, p.hit);
  s += ld(296, 238, 300, M.RCA.cerv ? (H ? 'स्पाइनल कॉर्ड' : 'Spinal cord') : (H ? 'थीकल सैक' : 'Thecal sac'), 'R');
  s += txt(16, 28, H ? 'दायां' : 'R', p, {w:700, s:15}) + txt(524, 28, H ? 'बायां' : 'L', p, {w:700, s:15, a:'end'});
  s += txt(270, 30, H ? 'आगे' : 'Front', p, {c:p.muted, s:11, a:'middle'}) + txt(270, 372, H ? 'पीछे' : 'Back', p, {c:p.muted, s:11, a:'middle'});
  return s + '</svg>';
}
function typesSVG(p){
  const H = lang === 'hi';
  const items = [[H ? 'बल्ज' : 'Bulge', '13%', 'bulge'],[H ? 'प्रोट्रूज़न' : 'Protrusion', '41%', 'pro'],[H ? 'एक्सट्रूज़न' : 'Extrusion', '70%', 'ext'],[H ? 'सीक्वेस्ट्रेशन' : 'Sequestration', '96%', 'seq']];
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 150" role="img" aria-label="Disc herniation types">`;
  s += `<rect x="0" y="0" width="440" height="150" ${st(p.bg)}/>`;
  items.forEach((it, i) => {
    const cx = 55 + i * 110, cy = 52;
    s += `<ellipse cx="${cx}" cy="${cy}" rx="40" ry="26" style="fill:none;stroke:${p.muted};stroke-width:1;stroke-dasharray:3 3"/>`;
    if (it[2] === 'bulge') s += `<ellipse cx="${cx}" cy="${cy + 3}" rx="44" ry="29" ${st(p.disc, p.discE, 1)}/>`;
    else s += `<ellipse cx="${cx}" cy="${cy}" rx="40" ry="26" ${st(p.disc, p.discE, 1)}/>`;
    if (it[2] === 'pro') s += `<path d="M${cx - 16} ${cy + 24} Q${cx} ${cy + 40} ${cx + 16} ${cy + 24} Z" ${st(p.hit)}/>`;
    if (it[2] === 'ext') s += `<path d="M${cx - 5} ${cy + 24} L${cx + 5} ${cy + 24} L${cx + 6} ${cy + 32} Q${cx + 20} ${cy + 36} ${cx + 12} ${cy + 46} Q${cx} ${cy + 52} ${cx - 12} ${cy + 46} Q${cx - 20} ${cy + 36} ${cx - 6} ${cy + 32} Z" ${st(p.hit)}/>`;
    if (it[2] === 'seq') s += `<circle cx="${cx + 4}" cy="${cy + 48}" r="9" ${st(p.hit)}/>`;
    s += `<ellipse cx="${cx}" cy="${cy - 2}" rx="18" ry="11" ${st(p.nuc)}/>`;
    s += txt(cx, 120, it[0], p, {a:'middle', w:600, s:12}) + txt(cx, 138, (H ? 'सिकुड़ता: ' : 'regresses ') + it[1], p, {a:'middle', s:10.5, c:p.muted});
  });
  return s + '</svg>';
}
function testSVG(id, p){
  const line = `style="fill:none;stroke:${p.ink};stroke-width:3;stroke-linecap:round;stroke-linejoin:round"`;
  const hl = `style="fill:none;stroke:${p.hit};stroke-width:3.5;stroke-linecap:round"`;
  if (!['slr','cslr','heel','toe'].includes(id)) return '';
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 170" role="img" aria-label="Test illustration">`;
  if (id === 'slr' || id === 'cslr') {
    s += `<line x1="20" y1="140" x2="340" y2="140" style="stroke:${p.muted};stroke-width:1.5"/>`;
    s += `<circle cx="40" cy="118" r="13" ${line}/><path d="M54 124 L170 128" ${line}/><path d="M72 130 L136 134" ${line}/>`;
    s += `<path d="M170 128 L300 132 L304 120" ${id === 'cslr' ? hl : line}/>`;
    s += `<path d="M170 126 L276 50 L286 58" ${id === 'slr' ? hl : line}/>`;
    s += `<path d="M206 129 A36 36 0 0 0 200 106" style="fill:none;stroke:${p.muted};stroke-width:1.4"/>` + txt(214, 116, '30°–70°', p, {s:13, w:700});
    s += `<circle cx="281" cy="47" r="7" style="fill:none;stroke:${p.muted};stroke-width:1.6"/><path d="M300 92 Q318 64 300 36 M300 36 L294 46 M300 36 L308 44" style="fill:none;stroke:${p.muted};stroke-width:1.6;stroke-linecap:round"/>` + txt(314, 70, lang === 'hi' ? 'सहायक उठाए' : 'helper lifts', p, {s:11, c:p.muted});
    if (id === 'cslr') s += txt(236, 156, lang === 'hi' ? 'दर्द इस पैर में' : 'pain felt in this leg', p, {s:12, c:p.hit, w:600});
    else s += txt(100, 156, lang === 'hi' ? 'दर्द घुटने के नीचे तक जाए = पॉज़िटिव' : 'shooting pain past the knee = positive', p, {s:12, c:p.hit, w:600});
  } else {
    const toe = id === 'toe';
    s += `<line x1="20" y1="150" x2="340" y2="150" style="stroke:${p.muted};stroke-width:1.5"/>`;
    s += `<circle cx="180" cy="26" r="13" ${line}/><path d="M180 40 L180 92 M180 56 L150 80 M180 56 L210 80 M180 92 L166 136 M180 92 L194 136" ${line}/>`;
    if (!toe) s += `<path d="M166 136 L158 146 L176 136 M194 136 L188 146 L206 136" ${hl}/>`;
    else s += `<path d="M166 136 L170 148 L184 150 M194 136 L198 148 L212 150" ${hl}/>`;
    s += txt(250, 100, toe ? (lang === 'hi' ? 'पंजों के बल' : 'on toes') : (lang === 'hi' ? 'एड़ी पर' : 'on heels'), p, {s:12, w:600});
    s += `<line x1="300" y1="20" x2="300" y2="150" style="stroke:${p.muted};stroke-width:4"/>` + txt(296, 16, lang === 'hi' ? 'दीवार' : 'wall', p, {s:10, c:p.muted, a:'end'});
  }
  return s + '</svg>';
}

/* ================= 3D ================= */
const G = {ok:false, anat:false, rca:null, sex:'m', H:{}, AN:{}, hlKey:'', imgs:null};
const COL = {skin:0xb47a5c, cloth:0x2c323c, lip:0x8e4f48, brow:0x2a1d16, hair:0x17110d, pain:0xd8401c, painE:0x3a0a02, cur:0x12a594,
  bone:0xefe4cf, boneHi:0xf08a5d, discWarn:0xe8a08a, cart:0xd6e1e4, boneHiE:0x3a1004, disc:0x8fb3cf, hit:0xe0401c, hitE:0x5a1004, nerve:0xe2b23a, nerveE:0x241a00, nerveHi:0xff5a1f, nerveHiE:0x6a1a04, sac:0xbcd4ea};
function dec(b64, Type){ const bin = atob(b64), u8 = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i); return new Type(u8.buffer); }
function makeEnv(T, renderer){
  const sc = new T.Scene();
  const room = new T.Mesh(new T.BoxGeometry(10, 6, 10), new T.MeshBasicMaterial({color:0x8d969e, side:T.BackSide})); room.position.y = 2; sc.add(room);
  const panel = (w, h, x, y, z, rx, ry, c) => { const m = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({color:c, side:T.DoubleSide})); m.position.set(x, y, z); m.rotation.set(rx, ry, 0); sc.add(m); };
  panel(4, 2.4, 0, 3.2, 4.9, 0, PI, 0xffffff); panel(2.4, 3, -4.9, 2.6, 1, 0, PI / 2, 0xfff1e2); panel(2.4, 3, 4.9, 2.6, -1, 0, -PI / 2, 0xe2ecff);
  panel(5, 5, 0, 4.95, 0, PI / 2, 0, 0xffffff); panel(10, 10, 0, -0.99, 0, -PI / 2, 0, 0x5d554e);
  const pm = new T.PMREMGenerator(renderer); const rt = pm.fromScene(sc, 0.04); pm.dispose(); return rt.texture;
}
function buildHuman(T, D, sexCode, C, opt){
  const S = D[sexCode], pos = dec(S.pos, Int16Array), idx = dec(D.idx, Uint16Array);
  const NV = pos.length / 3, P = opt && opt.P ? opt.P : new Float32Array(pos.length); if (!(opt && opt.P)) for (let i = 0; i < pos.length; i++) P[i] = pos[i] / 10000;
  const f16 = (b, sc) => { const a = dec(b, Int16Array), o = new Float32Array(a.length); for (let i = 0; i < a.length; i++) o[i] = a[i] / sc; return o; };
  const u8f = b => { const a = dec(b, Uint8Array), o = new Float32Array(a.length); for (let i = 0; i < a.length; i++) o[i] = a[i] / 255; return o; };
  const g = new T.BufferGeometry();
  g.setAttribute('position', new T.BufferAttribute(P, 3)); g.setIndex(new T.BufferAttribute(idx, 1)); g.computeVertexNormals();
  g.setAttribute('aShorts', new T.BufferAttribute(f16(D.shorts, 10000), 1)); g.setAttribute('aTop', new T.BufferAttribute(f16(D.top, 10000), 1));
  g.setAttribute('aBrow', new T.BufferAttribute(u8f(D.brow), 1)); g.setAttribute('aLip', new T.BufferAttribute(u8f(D.lip), 1));
  const hl = new T.BufferAttribute(new Float32Array(NV).fill(-1), 1), cu = new T.BufferAttribute(new Float32Array(NV).fill(-1), 1);
  hl.setUsage(T.DynamicDrawUsage); cu.setUsage(T.DynamicDrawUsage); g.setAttribute('aHl', hl); g.setAttribute('aCur', cu);
  const MEM = {}; Object.keys(D.mem).forEach(k => { MEM[k] = [dec(D.mem[k][0], Uint16Array), dec(D.mem[k][1], Int8Array)]; });
  const U = {uSkin:{value:C.skin}, uCloth:{value:C.cloth}, uLipC:{value:C.lip}, uBrowC:{value:C.brow}, uPain:{value:C.pain}, uPainE:{value:C.painE}, uCurC:{value:C.cur}, uPulse:{value:0.5}, uTopOn:{value:sexCode === 'f' ? 1 : 0}, uXray:{value:0}, uXrayA:{value:0.5}, uHlA:{value:0.32}};
  const mat = new T.MeshStandardMaterial({color:0xffffff, roughness:0.5, metalness:0});
  mat.onBeforeCompile = sh => {
    Object.assign(sh.uniforms, U);
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nattribute float aShorts; attribute float aTop; attribute float aBrow; attribute float aLip; attribute float aHl; attribute float aCur;\nvarying float vShorts; varying float vTop; varying float vBrow; varying float vLip; varying float vHl; varying float vCur;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvShorts = aShorts; vTop = aTop; vBrow = aBrow; vLip = aLip; vHl = aHl; vCur = aCur;');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nuniform vec3 uSkin; uniform vec3 uCloth; uniform vec3 uLipC; uniform vec3 uBrowC; uniform vec3 uPain; uniform vec3 uPainE; uniform vec3 uCurC; uniform float uPulse; uniform float uTopOn; uniform float uXray; uniform float uXrayA; uniform float uHlA;\nvarying float vShorts; varying float vTop; varying float vBrow; varying float vLip; varying float vHl; varying float vCur;')
      .replace('vec4 diffuseColor = vec4( diffuse, opacity );', 'float cl = max(smoothstep(-0.0012, 0.0012, vShorts), uTopOn * smoothstep(-0.0012, 0.0012, vTop));\nvec3 baseC = mix(uSkin, uBrowC, clamp(vBrow, 0.0, 1.0) * 0.75);\nbaseC = mix(baseC, uLipC, smoothstep(0.15, 0.6, vLip) * 0.85);\nbaseC = mix(baseC, uCloth, cl);\nfloat hh = smoothstep(-0.02, 0.02, vHl), cc = smoothstep(-0.02, 0.02, vCur);\nbaseC = mix(baseC, uPain, hh * 0.9); baseC = mix(baseC, uCurC, cc * 0.9);\nvec4 diffuseColor = vec4( baseC, opacity );')
      .replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\nroughnessFactor = mix(roughnessFactor, 0.88, cl);')
      .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\ntotalEmissiveRadiance += uPainE * hh + uCurC * cc * (0.15 + 0.45 * uPulse);')
      .replace('#include <dithering_fragment>', '#include <dithering_fragment>\nif (uXray > 0.5) { float fr = 1.0 - abs(dot(normalize(normal), normalize(vViewPosition))); float a = mix(0.035, uXrayA, pow(fr, 2.2)); a = max(a, (hh + cc) * uHlA); gl_FragColor.a = a; }');
  };
  const grp = new T.Group(), mesh = new T.Mesh(g, mat); grp.add(mesh);
  const hidx = dec(D.hairIdx, Uint16Array), hf = f16(D.hair, 10000), N = g.attributes.normal.array, th = sexCode === 'f' ? 0.0095 : 0.0042;
  const vm = new Map(), hp = [], hv = [], hi = [];
  for (const v of hidx) { if (!vm.has(v)) { vm.set(v, hp.length / 3); hp.push(P[v*3] + N[v*3] * th, P[v*3+1] + N[v*3+1] * th, P[v*3+2] + N[v*3+2] * th); hv.push(hf[v]); } hi.push(vm.get(v)); }
  const hg = new T.BufferGeometry(); hg.setAttribute('position', new T.Float32BufferAttribute(hp, 3)); hg.setAttribute('aHair', new T.Float32BufferAttribute(hv, 1)); hg.setIndex(hi); hg.computeVertexNormals();
  const hairM = new T.MeshStandardMaterial({color:C.hair, roughness:0.58, metalness:0, side:T.DoubleSide});
  hairM.onBeforeCompile = sh => {
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nattribute float aHair; varying float vHair;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvHair = aHair;');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying float vHair;').replace('vec4 diffuseColor = vec4( diffuse, opacity );', 'if (vHair < 0.0) discard;\nvec4 diffuseColor = vec4( diffuse, opacity );');
  };
  const extras = [new T.Mesh(hg, hairM)]; grp.add(extras[0]);
  if (sexCode === 'f') { let top = -1, back = 1; for (let i = 0; i < hp.length; i += 3) { if (hv[i/3] > 0) { if (hp[i+1] > top) top = hp[i+1]; if (hp[i+2] < back) back = hp[i+2]; } } const bunM = new T.MeshStandardMaterial({color:C.hair, roughness:0.58}); const bun = new T.Mesh(new T.SphereGeometry(0.04, 28, 18), bunM); bun.scale.set(1, 0.92, 0.8); if (opt && opt.head) { let t0 = -1, b0 = 1; for (const v of hidx) { if (hf[v] > 0) { t0 = Math.max(t0, pos[v*3+1] / 1e4); b0 = Math.min(b0, pos[v*3+2] / 1e4); } } bun.position.set(0, t0 - 0.06, b0 + 0.006).applyMatrix4(opt.head); bun.quaternion.setFromRotationMatrix(opt.head); } else bun.position.set(0, top - 0.06, back + 0.006); grp.add(bun); extras.push(bun); }
  S.eyes.forEach(e => {
    const r = e[3] * 0.96, eg = new T.SphereGeometry(r, 32, 24), col = [], p = eg.attributes.position;
    for (let i = 0; i < p.count; i++) { const zz = p.getZ(i) / r; const c = zz > 0.955 ? [0.02,0.015,0.012] : zz > 0.86 ? [0.16,0.09,0.045] : [0.86,0.83,0.80]; col.push(...c); }
    eg.setAttribute('color', new T.Float32BufferAttribute(col, 3));
    const em = new T.Mesh(eg, new T.MeshStandardMaterial({vertexColors:true, roughness:0.18})); em.position.set(e[0], e[1], e[2]); if (opt && opt.head) { em.position.applyMatrix4(opt.head); em.quaternion.setFromRotationMatrix(opt.head); } grp.add(em); extras.push(em);
  });
  const setHL = (yes, cur) => {
    const a = hl.array, b = cu.array; a.fill(-1); b.fill(-1);
    const fillA = (arr, list) => (list || []).forEach(k => { const m = MEM[k]; if (!m) return; const vi = m[0], va = m[1]; for (let j = 0; j < vi.length; j++) { const v = va[j] / 127; if (v > arr[vi[j]]) arr[vi[j]] = v; } });
    fillA(a, yes); fillA(b, cur); hl.needsUpdate = true; cu.needsUpdate = true;
  };
  const setXray = on => { U.uXray.value = on ? 1 : 0; mat.transparent = on; mat.depthWrite = !on; mat.needsUpdate = true; extras.forEach(e => e.visible = !on); };
  return {group:grp, mesh, mat, U, setHL, setXray};
}
function buildAnatomy(T, SD, sexCode, C){
  const S = SD[sexCode], grp = new T.Group(), cache = {};
  const geo = (pk, key) => { if (key && cache[key]) return cache[key]; const v = dec(pk.v, Int16Array), f = dec(pk.f, Uint16Array), p = new Float32Array(v.length); for (let i = 0; i < v.length; i++) p[i] = v[i] * pk.s; const g = new T.BufferGeometry(); g.setAttribute('position', new T.BufferAttribute(p, 3)); g.setIndex(new T.BufferAttribute(f, 1)); g.computeVertexNormals(); if (key) cache[key] = g; return g; };
  const M_ = (c, o) => new T.MeshStandardMaterial(Object.assign({color:c, roughness:0.6, metalness:0}, o || {}));
  const boneM = M_(C.bone, {side:T.DoubleSide}), boneHiM = M_(C.boneHi, {side:T.DoubleSide, emissive:C.boneHiE}), discM = M_(C.disc, {roughness:0.45}), discHiM = M_(C.discWarn, {roughness:0.45}), hernM = M_(C.hit, {roughness:0.4, emissive:C.hitE});
  const cartM = M_(C.cart, {roughness:0.45});
  const nerveM = M_(C.nerve, {roughness:0.4, emissive:C.nerveE}), nerveHiM = M_(C.nerveHi, {roughness:0.35, emissive:C.nerveHiE});
  const sacM = M_(C.sac, {roughness:0.3, transparent:true, opacity:0.45, depthWrite:false}), sacHiM = M_(C.hit, {transparent:true, opacity:0.6, depthWrite:false, emissive:C.hitE});
  const mat4 = a => new T.Matrix4().fromArray(a);
  const add = (g, m, xf) => { const me = new T.Mesh(g, m); me.matrixAutoUpdate = false; me.matrix.copy(mat4(xf)); grp.add(me); return me; };
  const vert = {}, discs = {}, nerves = {}, bones = {sacrum:[], pelvis:[], leg:[], arm:[], hand:[], scap:[], sternum:[], ribs:[], clav:[]};
  S.order.forEach(n => vert[n] = add(geo(SD.parts[S.pmap[n] || n], S.pmap[n] || n), boneM, S.xf[n]));
  bones.sacrum.push(add(geo(SD.parts.sacrum), boneM, S.xf.sacrum));
  const pg = geo(SD.parts.pelvis); bones.pelvis.push(add(pg, boneM, S.xf.pelvis_l), add(pg, boneM, S.xf.pelvis_r));
  Object.keys(S.dc).forEach(k => { const pk = S.pmap['disc_' + k] || 'disc_' + k; discs[k] = add(geo(SD.parts[pk], pk), discM, S.xf['disc_' + k]); });
  const pair = (g, list) => { const a = new T.Mesh(g, boneM), b = new T.Mesh(g, boneM); b.scale.x = -1; grp.add(a); grp.add(b); list.push(a, b); };
  pair(geo(S.leg), bones.leg);
  ['arm','hand','scap'].forEach(k => pair(geo(S.extra[k]), bones[k]));
  const st = new T.Mesh(geo(S.extra.sternum), boneM); grp.add(st); bones.sternum.push(st);
  const V3 = p => new T.Vector3(p[0], p[1], p[2]), mx = p => [-p[0], p[1], p[2]];
  const tube = (pts, r, seg) => new T.TubeGeometry(new T.CatmullRomCurve3(pts.map(V3), false, 'centripetal'), seg || Math.max(24, pts.length * 14), r, 8, false);
  Object.keys(S.ribs).forEach(k => { const m = new T.Mesh(tube(S.ribs[k], 0.0052, 60), boneM); grp.add(m); bones.ribs.push(m); });
  Object.keys(S.cart).forEach(k => { const m = new T.Mesh(tube(S.cart[k], 0.0045, 16), cartM); grp.add(m); bones.ribs.push(m); });
  [S.clav, S.clav.map(mx)].forEach(p => { const m = new T.Mesh(tube(p, 0.0058, 30), boneM); grp.add(m); bones.clav.push(m); });
  let sacMesh = null;
  const RAD = [['cord',0.0045],['sciatic',0.0052],['tibial',0.0036],['femoral',0.0036],['peroneal',0.003],['saphenous',0.0022],['medianF',0.0013],['ulnarF',0.0013],['median',0.0028],['ulnar',0.0026],['radial',0.0026],['ic',0.0013]];
  Object.keys(S.nerves).forEach(k => {
    if (k === 'sac') { sacMesh = new T.Mesh(tube(S.nerves.sac, 0.0075), sacM); grp.add(sacMesh); return; }
    const hit = RAD.find(r => k.startsWith(r[0])), r = hit ? hit[1] : 0.0026;
    nerves[k] = new T.Mesh(tube(S.nerves[k], r), nerveM); grp.add(nerves[k]);
  });
  const hern = new T.Mesh(new T.SphereGeometry(1, 24, 16), hernM); hern.visible = false; grp.add(hern);
  const PATH = {L5:['L5','sciatic','peroneal'], S1:['S1','sciatic','tibial'], L4:['L4','sciatic','femoral','saphenous'], L3:['L3','femoral','saphenous'], L2:['L2','femoral'],
    C5:['C5','radial'], C6:['C6','median','medianF0','medianF1','radial'], C7:['C7','median','medianF2','radial'], C8:['C8','ulnar','ulnarF0','ulnarF1'], T1:['T1','ulnar']};
  for (let i = 1; i <= 12; i++) PATH['T' + i] = (PATH['T' + i] || []).concat(['ic' + i]);
  const setFocus = f => {
    f = f || {};
    Object.values(discs).forEach(m => m.material = discM); Object.values(nerves).forEach(m => m.material = nerveM); Object.values(vert).forEach(m => m.material = boneM);
    Object.values(bones).forEach(a => a.forEach(m => m.material = m.material === cartM ? cartM : boneM)); if (sacMesh) sacMesh.material = f.sac ? sacHiM : sacM; hern.visible = false;
    if (nerves.cord) nerves.cord.material = f.cord ? nerveHiM : nerveM;
    (f.discs || []).forEach(l => { if (discs[l]) discs[l].material = discHiM; });
    (f.vert || []).forEach(n => { if (vert[n]) vert[n].material = boneHiM; });
    (f.bones || []).forEach(n => (bones[n] || []).forEach(m => { if (m.material !== cartM) m.material = boneHiM; }));
    (f.sides || []).forEach(sd => { (f.roots || []).forEach(r => (PATH[r] || []).forEach(n => { const m = nerves[n + '_' + sd]; if (m) m.material = nerveHiM; })); (f.nerves || []).forEach(n => { const m = nerves[n + '_' + sd]; if (m) m.material = nerveHiM; }); });
    if (f.herniate && f.discs && f.discs[0] && S.xf['disc_' + f.discs[0]]) {
      const xf = mat4(S.xf['disc_' + f.discs[0]]), q = new T.Quaternion(), sc = new T.Vector3(), c = new T.Vector3(); xf.decompose(c, q, sc);
      const cerv = f.discs[0][0] === 'C', k = cerv ? 0.4 : 1, sx = (f.side === 'l' ? 0.0105 : f.side === 'r' ? -0.0105 : 0) * k, s = sc.x;
      hern.position.copy(c).add(new T.Vector3(sx * s, 0, -(cerv ? 0.0085 : 0.0185) * s).applyQuaternion(q)); hern.quaternion.copy(q);
      hern.scale.set((f.side === 'b' ? 0.014 : 0.0088) * s * k * 1.15, 0.0055 * s * (cerv ? 0.6 : 1), 0.0065 * s * (cerv ? 0.6 : 1)); hern.visible = true;
    }
  };
  const labels = new T.Group(); grp.add(labels);
  const label = (txt, pos, o) => {
    const cv = document.createElement('canvas'), x = cv.getContext('2d'), fs = 30, font = `600 ${fs}px "IBM Plex Sans","IBM Plex Sans Devanagari",Arial,sans-serif`;
    x.font = font; const w = Math.ceil(x.measureText(txt).width) + 24; cv.width = w; cv.height = 50; x.font = font;
    x.fillStyle = o.bg; x.beginPath(); if (x.roundRect) x.roundRect(0, 0, w, 50, 9); else x.rect(0, 0, w, 50); x.fill();
    x.fillStyle = o.fg; x.textBaseline = 'middle'; x.fillText(txt, 12, 27);
    const tex = new T.CanvasTexture(cv); tex.encoding = T.sRGBEncoding; tex.anisotropy = 4;
    const sp = new T.Sprite(new T.SpriteMaterial({map:tex, depthTest:false, depthWrite:false, transparent:true})); const h = o.h || 0.015;
    sp.scale.set(h * w / 50, h, 1); sp.position.set(pos[0], pos[1], pos[2]); sp.renderOrder = 10; labels.add(sp);
    if (o.lead) { const pv = new T.Vector3(...pos), lv = new T.Vector3(...o.lead), e = pv.clone().sub(pv.clone().sub(lv).normalize().multiplyScalar(h * w / 100)); const ln = new T.Line(new T.BufferGeometry().setFromPoints([lv, e]), new T.LineBasicMaterial({color:o.line || 0x334155, depthTest:false, transparent:true, opacity:0.85})); ln.renderOrder = 9; labels.add(ln); }
  };
  const makeLabels = (side, hi, discWord, mode, set, scale) => {
    while (labels.children.length) labels.remove(labels.children[0]);
    const sg = side === 'r' ? -1 : 1, lat = mode === 'lat', names = (set || Object.keys(S.lv)).filter(n => S.lv[n]);
    const cerv = names.length && names[0][0] === 'C' && names[names.length - 1][0] !== 'L' && names.length < 12, h = (cerv ? 0.010 : 0.015) * (scale || 1), off = (cerv ? 0.055 : 0.082) * Math.max(1, (scale || 1) * 0.8);
    names.forEach(n => { const c = S.lv[n]; if (lat) label(n, [sg * 0.02, c[1], c[2] + (cerv ? 0.034 : 0.047)], {bg:'rgba(255,255,255,0.94)', fg:'#0F1C26', h:h * 0.8, lead:[sg * 0.02, c[1], c[2] + (cerv ? 0.012 : 0.022)]}); else label(n, [sg * off, c[1], c[2] - 0.03], {bg:'rgba(255,255,255,0.94)', fg:'#0F1C26', h, lead:[sg * off * 0.34, c[1], c[2] - 0.02]}); });
    (hi || []).forEach(l => { const c = S.dc[l]; if (!c) return; if (lat) label(l + ' ' + discWord, [sg * 0.03, c[1] - 0.004, c[2] - (cerv ? 0.055 : 0.085)], {bg:'#C93C17', fg:'#ffffff', h, lead:[sg * 0.012, c[1], c[2] - (cerv ? 0.012 : 0.024)], line:0xC93C17}); else label(l + ' ' + discWord, [-sg * (off + 0.01), c[1], c[2] - 0.03], {bg:'#C93C17', fg:'#ffffff', h, lead:[-sg * 0.016, c[1], c[2] - 0.026], line:0xC93C17}); });
  };
  return {group:grp, setFocus, makeLabels, labels, vert, discs, bones, nerves, S, get sac(){ return sacMesh; }};
}
const sexCode = () => A.sex === 'sex_f' ? 'f' : 'm';
function lmv(){ return window.SPG_SPINE[G.sex].lm; }
function resolveView(v){
  if (v.ty !== undefined) return Object.assign({}, v);
  const lm = lmv(), S = window.SPG_SPINE[G.sex];
  const base = v.yk === 'mid' ? lm.H * 0.5 : v.yk === 'disc' ? (S.dc[v.disc] || S.dc['L4–L5'])[1] : S.lv[v.yk] ? S.lv[v.yk][1] : lm[v.yk];
  const ty = (isFinite(base) ? base : lm.H * 0.5) + (v.dy || 0) * lm.s;
  return {az:v.az, el:v.el, d:v.d * lm.s, ty, tx:(v.tx || 0) * lm.s, tz:(v.tz || 0) * lm.s};
}
function useSex(code){
  if (!G.ok) return; if (G.sex === code && G.body) return;
  const T = G.T; if (G.body) { G.scene.remove(G.body.group); G.scene.remove(G.anatomy.group); }
  if (!G.H[code]) G.H[code] = buildHuman(T, window.SPG_BODY, code, G.C);
  if (!G.AN[code]) G.AN[code] = buildAnatomy(T, window.SPG_SPINE, code, G.C);
  G.sex = code; G.body = G.H[code]; G.anatomy = G.AN[code];
  G.scene.add(G.body.group); G.scene.add(G.anatomy.group);
  G.body.setXray(G.anat); G.anatomy.group.visible = G.anat; G.hlKey = ''; applyRCA();
}
function initGL(){
  const T = window.THREE, canvas = $('#gl');
  if (!T || !window.SPG_BODY || !window.SPG_SPINE) return false;
  let renderer;
  try { renderer = new T.WebGLRenderer({canvas, antialias:true, alpha:true, preserveDrawingBuffer:true}); } catch (e) { return false; }
  if (!renderer || !renderer.getContext()) return false;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputEncoding = T.sRGBEncoding; renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05; renderer.setClearColor(0x000000, 0);
  const scene = new T.Scene(); scene.environment = makeEnv(T, renderer);
  const k1 = new T.DirectionalLight(0xffffff, 0.95); k1.position.set(1.5, 3, 2.5); scene.add(k1);
  const k2 = new T.DirectionalLight(0xffffff, 0.5); k2.position.set(-2, 2, -2.5); scene.add(k2);
  const sc = document.createElement('canvas'); sc.width = sc.height = 128; const sx = sc.getContext('2d'); const gr = sx.createRadialGradient(64,64,4,64,64,64); gr.addColorStop(0,'rgba(0,0,0,0.30)'); gr.addColorStop(1,'rgba(0,0,0,0)'); sx.fillStyle = gr; sx.fillRect(0,0,128,128);
  const floor = new T.Mesh(new T.PlaneGeometry(0.9, 0.6), new T.MeshBasicMaterial({map:new T.CanvasTexture(sc), transparent:true, depthWrite:false})); floor.rotation.x = -PI / 2; floor.position.y = 0.002; scene.add(floor);
  const camera = new T.PerspectiveCamera(28, 1, 0.01, 50);
  const lin = h => new T.Color(h).convertSRGBToLinear(), C = {}; Object.keys(COL).forEach(k => C[k] = lin(COL[k]));
  Object.assign(G, {ok:true, T, renderer, scene, camera, C, floor, drag:null, spin:true});
  G.cur = resolveView(V.full); G.tgt = Object.assign({}, G.cur);
  useSex('m');
  const stage = $('#stage');
  const fit = () => { const w = stage.clientWidth, h = stage.clientHeight; if (!w || !h) return; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); };
  fit(); if (window.ResizeObserver) new ResizeObserver(fit).observe(stage); else window.addEventListener('resize', fit);
  const pts = new Map(); let pinch = null;
  const two = () => { const [a, b] = [...pts.values()]; return {d: Math.hypot(a.x - b.x, a.y - b.y), y: (a.y + b.y) / 2}; };
  canvas.addEventListener('pointerdown', e => { pts.set(e.pointerId, {x:e.clientX, y:e.clientY}); G.spin = false; try { canvas.setPointerCapture(e.pointerId); } catch (err) {}
    if (pts.size === 2) { pinch = two(); G.drag = null; } else if (pts.size === 1) G.drag = {x:e.clientX, y:e.clientY, pan:e.shiftKey}; });
  canvas.addEventListener('pointermove', e => {
    if (!pts.has(e.pointerId)) return; pts.set(e.pointerId, {x:e.clientX, y:e.clientY});
    if (pts.size >= 2 && pinch) { const n = two(); if (n.d > 10 && pinch.d > 10) zoomBy(pinch.d / n.d); panBy(n.y - pinch.y); pinch = n; return; }
    if (!G.drag) return; const dx = e.clientX - G.drag.x, dy = e.clientY - G.drag.y; G.drag.x = e.clientX; G.drag.y = e.clientY;
    if (G.drag.pan || e.shiftKey) { panBy(dy); return; }
    G.tgt.az -= dx * 0.009; G.tgt.el = Math.max(-0.5, Math.min(1.2, G.tgt.el + dy * 0.004)); G.cur.az = G.tgt.az; G.cur.el = G.tgt.el; });
  const end = e => { pts.delete(e.pointerId); if (pts.size < 2) pinch = null; if (pts.size === 1) { const [q] = [...pts.values()]; G.drag = {x:q.x, y:q.y}; } else if (!pts.size) G.drag = null; };
  canvas.addEventListener('pointerup', end); canvas.addEventListener('pointercancel', end);
  canvas.addEventListener('wheel', e => { e.preventDefault(); G.spin = false; const r = canvas.getBoundingClientRect(); zoomBy(1 + Math.sign(e.deltaY) * 0.12, 1 - 2 * (e.clientY - r.top) / r.height); }, {passive:false});
  requestAnimationFrame(loop);
  return true;
}
/* manual zoom, pan and rotate */
function zoomBy(f, ndcY){
  if (!G.ok) return; G.spin = false; const s = lmv().s, g = G.tgt, d0 = g.d;
  const nd = Math.max(0.3 * s, Math.min(6 * s, d0 * f));
  if (ndcY != null && isFinite(ndcY)) g.ty += ndcY * d0 * Math.tan(G.camera.fov * PI / 360) * (1 - nd / d0);
  g.d = nd; clampTy();
}
function panBy(dyPx){
  if (!G.ok) return; const h = G.renderer.domElement.clientHeight || 400, g = G.tgt;
  g.ty += dyPx / h * 2 * g.d * Math.tan(G.camera.fov * PI / 360); G.cur.ty = g.ty; clampTy();
}
function clampTy(){ const lm = lmv(); G.tgt.ty = Math.max(0.02 * lm.s, Math.min(lm.H * 1.02, G.tgt.ty)); }
function focusY(){ const S = window.SPG_SPINE[G.sex], lm = lmv(), ref = M && M.GAL && M.GAL.ref; return ref && S.lv[ref] ? S.lv[ref][1] : lm.H * 0.6; }
function zoomBtn(dir){
  if (!G.ok) return; const lm = lmv(), g = G.tgt;
  if (dir === 'in') { zoomBy(0.78); g.ty += (focusY() - g.ty) * 0.4; }
  else { zoomBy(1.28); if (g.d > 2.4 * lm.s) g.ty += (lm.H * 0.5 - g.ty) * 0.4; }
  clampTy();
}
function spineView(){
  const GP = (M && M.GAL) || {}, sd = G.rca && G.rca.side === 'r';
  return Object.assign({}, V.spine, GP.ref ? {yk:GP.ref, d:(GP.d || 0.66) * 1.18, dy:GP.refDy || 0} : {}, {az: sd ? PI + 0.5 : PI - 0.5});
}
function place(cam, v){ const ce = Math.cos(v.el), tx0 = v.tx || 0, tz0 = v.tz || 0; cam.position.set(tx0 + v.d*Math.sin(v.az)*ce, v.ty + v.d*Math.sin(v.el), tz0 + v.d*Math.cos(v.az)*ce); cam.lookAt(tx0, v.ty, tz0); }
function setAnat(on){
  if (!G.ok) return; G.anat = on; G.body.setXray(on); G.anatomy.group.visible = on; chrome();
}
function focusFor(R){
  const top = R && R.ranked[0], id = top ? top.c.id : '';
  const sides = R && R.sides.size ? [...R.sides] : ['l','r'], side = sides.length === 1 ? sides[0] : 'b';
  if (R && rcaApplies(R)) { const d = discInfo(R); return {discs:d.levels, roots:d.roots, sides, side, herniate:true, label:d.levels}; }
  const f = (M.FOCUS || {})[id]; if (!f) return {};
  const o = Object.assign({}, f); if (o.useSides) { o.sides = sides; o.side = side; } return o;
}
function applyRCA(){ if (!G.ok || !G.anatomy) return; const f = G.rca || {}; G.anatomy.setFocus(f); G.anatomy.makeLabels(f.side || 'l', f.label || [], lang === 'hi' ? 'डिस्क' : 'disc', null, M.labelSet); }
function paint(t){
  if (!G.body) return;
  const yes = yesRegions(), cur = curRegions(), key = yes.join() + '|' + cur.join();
  if (key !== G.hlKey) { G.hlKey = key; G.body.setHL(yes, cur); }
  G.body.U.uPulse.value = reduced ? 0.6 : 0.5 + 0.5 * Math.sin(t * 0.005);
}
function aim(v){ if (!G.ok) return; G.tgt = resolveView(v); if (reduced) G.cur = Object.assign({}, G.tgt); }
function loop(t){
  if (!G.ok) return;
  if (G.spin && !G.drag && !reduced) G.tgt.az += 0.0032;
  if (![G.tgt.az, G.tgt.el, G.tgt.d, G.tgt.ty].every(isFinite)) G.tgt = resolveView(V.full);
  if (![G.cur.az, G.cur.el, G.cur.d, G.cur.ty].every(isFinite)) G.cur = Object.assign({}, G.tgt);
  const k = reduced ? 1 : 0.085, c = G.cur, g = G.tgt;
  const da = ((g.az - c.az) % (2*PI) + 3*PI) % (2*PI) - PI;
  c.az += da * k; c.el += (g.el - c.el) * k; c.d += (g.d - c.d) * k; c.ty += (g.ty - c.ty) * k; c.tx = (c.tx || 0) + ((g.tx || 0) - (c.tx || 0)) * k;
  const close = c.d < 1.25 * lmv().s;
  if (G.anatomy) { G.anatomy.labels.visible = G.anat && close; G.anatomy.bones.pelvis.forEach(m => m.visible = !(G.anat && close)); }
  if (G.body && G.body.U.uHlA) G.body.U.uHlA.value = close ? 0.07 : 0.32;
  place(G.camera, c); paint(t); G.renderer.render(G.scene, G.camera);
  const isBack = Math.cos(c.az) < 0; if (isBack !== G.lastBack) { G.lastBack = isBack; chrome(); }
  requestAnimationFrame(loop);
}
let snapR = null, snapC = null;
function ensureSnap(T){ if (snapR) return; snapC = document.createElement('canvas'); snapR = new T.WebGLRenderer({canvas:snapC, antialias:true, alpha:false, preserveDrawingBuffer:true}); snapR.outputEncoding = T.sRGBEncoding; snapR.toneMapping = T.ACESFilmicToneMapping; snapR.toneMappingExposure = 1.1; snapR.setPixelRatio(1); G.envSnap = makeEnv(T, snapR); }
function snapshot(v, w, h, o){
  if (!G.ok) return null; const T = G.T; o = o || {};
  ensureSnap(T);
  if (!snapR) { snapC = document.createElement('canvas'); snapR = new T.WebGLRenderer({canvas:snapC, antialias:true, alpha:false, preserveDrawingBuffer:true}); snapR.outputEncoding = T.sRGBEncoding; snapR.toneMapping = T.ACESFilmicToneMapping; snapR.toneMappingExposure = 1.1; snapR.setPixelRatio(1); G.envSnap = makeEnv(T, snapR); }
  const envMain = G.scene.environment; G.scene.environment = G.envSnap;
  const an = G.anatomy, b = G.body, was = G.anat;
  if (!!o.anat !== was) { b.setXray(!!o.anat); an.group.visible = !!o.anat; }
  const keep = {body:b.group.visible, labels:an.labels.visible, floor:G.floor.visible};
  b.group.visible = !o.noBody; an.labels.visible = !!o.labels; G.floor.visible = !o.noBody;
  const pel = an.bones.pelvis.map(m => m.visible); an.bones.pelvis.forEach(m => m.visible = !o.noPelvis);
  const legs = an.bones.leg.map(m => m.visible); an.bones.leg.forEach(m => m.visible = !o.noLegs);
  const sac = an.bones.sacrum[0].visible; an.bones.sacrum[0].visible = !o.noSacrum;
  const upper = (o.keepRibs ? ['scap','clav','arm','hand'] : ['ribs','sternum','scap','clav','arm','hand']).flatMap(k => an.bones[k]); const upv = upper.map(m => m.visible); if (o.noUpper) upper.forEach(m => m.visible = false);
  const nk = Object.keys(an.nerves), nv = nk.map(k => an.nerves[k]); const nvv = nv.map(m => m.visible); if (o.nerveKeep) nv.forEach((m, i) => { m.visible = o.nerveKeep.some(p => nk[i].startsWith(p)); });
  const sacV = an.sac ? an.sac.visible : true; if (an.sac && o.noSac) an.sac.visible = false;
  const hid = []; (o.hide || []).forEach(n => { const m = an.vert[n] || an.discs[n]; if (m && m.visible) { m.visible = false; hid.push(m); } });
  if (o.only) { G.hlKey = ''; b.setHL(o.only, []); } else if (o.cur) { G.hlKey = ''; b.setHL([], o.cur); } else if (o.noHL) { G.hlKey = ''; b.setHL([], []); }
  const hlA = b.U.uHlA.value; if (o.hlA) b.U.uHlA.value = o.hlA;
  snapR.setSize(w, h, false); snapR.setClearColor(o.bg || 0xeef2f5, 1);
  const cam = new T.PerspectiveCamera(o.fov || 28, w / h, 0.01, 50); place(cam, resolveView(v)); b.U.uPulse.value = 0.6;
  snapR.render(G.scene, cam); G.scene.environment = envMain; b.U.uHlA.value = hlA;
  hid.forEach(m => m.visible = true); an.bones.sacrum[0].visible = sac; upper.forEach((m, i) => m.visible = upv[i]); nv.forEach((m, i) => m.visible = nvv[i]); if (an.sac) an.sac.visible = sacV; an.bones.pelvis.forEach((m, i) => m.visible = pel[i]); an.bones.leg.forEach((m, i) => m.visible = legs[i]);
  b.group.visible = keep.body; an.labels.visible = keep.labels; G.floor.visible = keep.floor;
  if (!!o.anat !== was) { b.setXray(was); an.group.visible = was; }
  G.hlKey = '';
  return snapC;
}
function chrome(){
  const back = !!G.lastBack;
  $('#sideL').textContent = tx(back ? U.left : U.right); $('#sideR').textContent = tx(back ? U.right : U.left);
  $('#viewTag').textContent = tx(back ? U.vB : U.vF);
  $('#tSkin').setAttribute('aria-pressed', !G.anat); $('#tAnat').setAttribute('aria-pressed', !!G.anat);
  const lg = $('#legend'); lg.hidden = !G.anat;
  lg.innerHTML = `<span><i style="background:#e8dcc4"></i>${tx(U.lgBone)}</span><span><i style="background:#8fb3cf"></i>${tx(U.lgDisc)}</span><span><i style="background:#e2b23a"></i>${tx(U.lgNerve)}</span><span><i style="background:#ff5a1f"></i>${tx(U.lgHit)}</span>`;
  $('#hint').hidden = G.anat;
}

/* ================= views ================= */
const pills = (act, opts, cur, role) => `<div class="pills" role="${role || 'radiogroup'}">${opts.map(o => `<button type="button" class="pill" role="radio" aria-checked="${cur === o[0]}" data-act="${act}" data-v="${o[0]}">${esc(tx(o[1]))}</button>`).join('')}</div>`;
const chips = (act, opts, set, radio) => `<div class="chips${radio ? ' onset' : ''}">${opts.map(o => { const on = radio ? set === o[0] : set.includes(o[0]); return `<button type="button" class="chip${radio ? ' radio' : ''}" aria-pressed="${on}" data-act="${act}" data-v="${o[0]}"><span class="bx" aria-hidden="true"></span><span>${esc(tx(o[1]))}</span></button>`; }).join('')}</div>`;
function stepper(){
  const cur = S.view === 'result' ? 7 : S.view === 'q' ? STEPS[S.idx].sec : -1;
  return U.secs.map((s, i) => `<li class="${i < cur ? 'done' : ''}${i === cur ? ' cur' : ''}"><span>${String(i + 1).padStart(2, '0')}</span>${tx(s)}</li>`).join('');
}
function vLang(){
  return `<section class="card langpick"><p class="kicker">Spine Pain Guide · रीढ़ दर्द गाइड</p><h1 id="qh" tabindex="-1" style="margin-top:8px">Choose your language<br><span lang="hi">अपनी भाषा चुनें</span></h1>
    <p class="lede">The whole assessment, result and PDF report will be in the language you choose. You can switch at any time from the top bar.<br><span lang="hi">पूरी जांच, नतीजा और PDF रिपोर्ट आपकी चुनी हुई भाषा में होगी। ऊपर से कभी भी बदल सकते हैं।</span></p>
    <div class="langbtns"><button class="btn primary" data-act="pickLang" data-v="en">English</button><button class="btn primary" data-act="pickLang" data-v="hi" lang="hi">हिंदी</button></div></section>`;
}
function vResume(){
  const s = loadSave(); if (!s) return '';
  const m = SPG.data.modules[s.mod], when = (() => { try { return new Date(s.t).toLocaleString(lang === 'hi' ? 'hi-IN' : 'en-IN', {day:'numeric', month:'short', hour:'numeric', minute:'2-digit'}); } catch (e) { return ''; } })();
  return `<section class="card resume"><h3>${tx(U.resT)}</h3><p><b>${esc(tx(m.name))}</b></p><p class="small muted">${s.view === 'result' ? tx(U.resDone) : fmt(U.resStep, s.idx + 1)}${when ? ' · ' + esc(when) : ''}</p>
    <div class="dl"><button class="btn primary" data-act="resume">${tx(s.view === 'result' ? U.resSee : U.resGo)} →</button><button class="btn ghost" data-act="resNo">${tx(U.resNo)}</button></div><p class="small muted" style="margin-top:8px">${tx(U.resS)}</p></section>`;
}
function vStart(){
  return `${vResume()}<section class="card">
    <p class="kicker">${tx(U.kicker)}</p>
    <h1 style="margin-top:8px" id="qh" tabindex="-1">${tx(U.title)}</h1>
    <p class="lede">${tx(U.lede)}</p>
    <div class="qhead" style="margin-top:18px"><p class="lbl" style="margin:0">${tx(U.pickT)}</p>${sayBtn()}</div>
    <div class="mcards${G.ok ? '' : ' nogl-on'}">${MODS.map(m => `<button type="button" class="mcard" data-act="pickMod" data-v="${m.id}"><span class="mimg">${G.ok ? `<img data-mod="${m.id}" alt="">` : ''}</span><span class="mtx"><b>${esc(tx(m.name))}</b>${m.card && m.card.hint ? `<small>${esc(tx(m.card.hint))}</small>` : ''}<span class="go">${tx(U.cardGo)} →</span></span></button>`).join('')}</div>
    <ul class="meta"><li>${tx(U.meta1)}</li><li>${tx(U.meta2)}</li><li>${tx(U.meta3)}</li><li>${tx(U.glTap)}</li></ul>
  </section>
  <section class="card appcard" id="appCard" ${PWA.can() ? '' : 'hidden'}><img src="icons/icon-192.png" alt=""><div><h3>${tx(U.instT)}</h3><p class="small muted" style="margin-top:4px">${tx(U.instS)}</p><button class="btn primary" data-act="install">${tx(U.inst)}</button></div></section>
  <section class="card"><h3>${tx(U.numsT)}</h3><dl class="numgrid">${(M.STATS || []).concat(STATS).slice(0, 6).map(s => `<div><dt>${s.v}</dt><dd>${tx(s.t)}${cite(s.s)}</dd></div>`).join('')}</dl></section>
  <section class="card"><h3>${tx(U.coversT)}</h3><ol class="covers">${U.covers.map(c => `<li>${tx(c)}</li>`).join('')}</ol></section>`;
}
function nav(ok, last){ return `<div class="qnav"><button class="linkbtn" data-act="prev">← ${tx(U.back)}</button><button class="btn primary" data-act="next" ${ok ? '' : 'disabled'}>${tx(last ? U.seeRes : U.cont)} →</button></div>`; }
function timelineSVG(){
  if (!A.since && !A.hx) return '';
  const xb = {d_days:470, d_weeks:420, d_6_12:365, d_3m:300}[A.since], xf = {h_first:xb, h_lt1y:215, h_1_5y:140, h_5y:60}[A.hx];
  const ink = 'var(--ink)', mu = 'var(--faint)', pn = 'var(--pain)', ac = 'var(--accent)';
  const t = (x, y, s, o) => `<text x="${x}" y="${y}" text-anchor="${(o && o.a) || 'middle'}" style="font:${(o && o.w) || 500} 12px var(--f-body);fill:${(o && o.c) || 'var(--muted)'}">${esc(s)}</text>`;
  let g = `<line x1="30" y1="52" x2="530" y2="52" stroke="${mu}" stroke-width="2" stroke-dasharray="2 5"/>`;
  if (xf !== undefined && xb !== undefined && A.hx !== 'h_first') {
    if (A.btw === 'btw_some') g += `<line x1="${xf}" y1="52" x2="${xb}" y2="52" stroke="${pn}" stroke-width="3" stroke-opacity=".35"/>`;
    const n = A.btw === 'btw_often' ? 5 : 3; for (let i = 1; i <= n; i++) { const x = xf + (xb - xf) * i / (n + 1) * (A.btw === 'btw_often' ? (0.55 + 0.45 * i / n) : 1); g += `<rect x="${x - 7}" y="45" width="14" height="14" rx="3" fill="${pn}" fill-opacity=".45"/>`; }
  }
  if (xb !== undefined) g += `<line x1="${xb}" y1="52" x2="530" y2="52" stroke="${pn}" stroke-width="6" stroke-linecap="round"/>` + `<circle cx="${xb}" cy="52" r="7" fill="${pn}"/>` + t(xb, 28, tx(U.tlNow), {w:600, c:ink}) + t(xb, 82, tx((SINCE.find(o => o[0] === A.since) || [0, ''])[1]).split(/[,，]/)[0]);
  if (xf !== undefined && A.hx !== 'h_first') g += `<circle cx="${xf}" cy="52" r="7" fill="${ac}"/>` + t(xf, 28, tx(U.tlFirst), {w:600, c:ink}) + t(xf, 82, ({h_lt1y:'< 1', h_1_5y:'1–5', h_5y:'> 5'})[A.hx] + ' ' + tx(U.tlYrs));
  g += `<circle cx="530" cy="52" r="5" fill="${ink}"/>` + t(530, 28, tx(U.tlToday), {w:600, c:ink});
  return `<figure class="fig" style="margin-top:14px"><svg viewBox="0 0 560 96" role="img" aria-label="${esc(tx(U.timeT))}">${g}</svg></figure>`;
}
function vQ(){
  const stp = STEPS[S.idx], n = STEPS.filter((s, i) => valid(i)).length, pos = STEPS.slice(0, S.idx + 1).filter((s, i) => valid(i)).length;
  const head = (extra) => `<div class="qhead"><span class="kicker">${tx(U.secs[stp.sec])} · ${fmt(U.stepOf, pos, n)}</span>${extra || ''}${sayBtn()}</div>`;
  if (stp.k === 'profile') return `<section class="card">${head()}<h2 id="qh" tabindex="-1">${tx(U.profT)}</h2><p class="qdesc">${tx(U.profS)}</p>
    <fieldset class="grp"><legend>${tx(U.age)}</legend>${pills('age', AGES, A.age)}</fieldset>
    <fieldset class="grp"><legend>${tx(U.sex)}</legend>${pills('sex', SEXES, A.sex)}</fieldset>
    <fieldset class="grp"><legend>${tx(U.hist)}</legend>${chips('risk', RISKS, A.risks)}</fieldset>
    <!--glstrip-->${nav(!!A.age)}${A.age ? '' : `<p class="note">${tx(U.needAge)}</p>`}</section>`;
  if (stp.k === 'area') {
    const a = stp.a, v = A.areas[a.id], ai = AREAS.indexOf(a) + 1;
    const b = (val, l, cls) => `<button class="ans ${cls}" data-act="area" data-v="${val}" aria-pressed="${v === val}">${tx(l)}</button>`;
    return `<section class="card">${head(a.code ? `<span class="code">${a.code}</span>` : '')}
      <p class="small muted mono">${fmt(U.areaK, ai, AREAS.length)}</p>
      <h2 id="qh" tabindex="-1" style="margin-top:4px">${tx(a.name)}</h2><p class="qdesc">${tx(a.desc)}</p>
      ${refPics('area:' + a.id)}
      <p class="qtext">${tx(U.qArea)}</p>
      <!--glstrip-->${a.pair ? `<div class="answers four">${b('l',U.left,'y')}${b('r',U.right,'y')}${b('both',U.both,'y')}${b('no',U.no,'n')}</div><p class="small muted" style="margin-top:8px">${tx(U.sideNote)}</p>` : `<div class="answers">${b('yes',U.yes,'y')}${b('no',U.no,'n')}</div>`}
      <p class="note"><b>${tx(U.rel)}:</b> ${tx(a.rel)}</p>
      <div class="qnav"><button class="linkbtn" data-act="prev">← ${tx(U.back)}</button></div></section>`;
  }
  if (stp.k === 'dom') return `<section class="card">${head()}<h2 id="qh" tabindex="-1">${tx(U.domT)}</h2>
    <!--glstrip--><div class="answers three" style="margin-top:16px">${DOMS.map(o => `<button class="ans" data-act="dom" data-v="${o[0]}" aria-pressed="${A.dom === o[0]}">${tx(o[1])}</button>`).join('')}</div>
    <p class="note"><b>${tx(U.rel)}:</b> ${tx(U.domWhy)}${cite('msd')}</p><div class="qnav"><button class="linkbtn" data-act="prev">← ${tx(U.back)}</button></div></section>`;
  if (stp.k === 'onset') { const ok = !!A.onset; return `<section class="card">${head()}<h2 id="qh" tabindex="-1">${tx(U.onT)}</h2><p class="qdesc">${tx(U.onS)}</p>
    <div style="margin-top:14px">${chips('onset', ONSETS, A.onset, true)}</div>
    <!--glstrip-->${nav(ok)}${ok ? '' : `<p class="note">${tx(U.needOn)}</p>`}</section>`; }
  if (stp.k === 'time') { const ok = !!(A.since && A.hx); return `<section class="card">${head()}<h2 id="qh" tabindex="-1">${tx(U.timeT)}</h2><p class="qdesc">${tx(U.timeS)}</p>
    <fieldset class="grp"><legend class="qq">1 · ${tx(U.since)}</legend><p class="small muted" style="margin:-2px 0 8px">${tx(U.sinceH)}</p>${pills('since', SINCE, A.since)}</fieldset>
    <fieldset class="grp"><legend class="qq">2 · ${tx(U.hx)}</legend><p class="small muted" style="margin:-2px 0 8px">${tx(U.hxH)}</p>${pills('hx', HX, A.hx)}</fieldset>
    ${A.hx && A.hx !== 'h_first' ? `<fieldset class="grp"><legend class="qq">3 · ${tx(U.btw)}</legend>${pills('btw', BTW, A.btw)}</fieldset>` : ''}
    <fieldset class="grp"><legend>${tx(U.trend)}</legend>${pills('trend', TRENDS, A.trend)}</fieldset>
    ${timelineSVG()}
    <p class="note"><b>${tx(U.rel)}:</b> ${tx(U.timeWhy)}${cite('who')}</p>
    <!--glstrip-->${nav(ok)}${ok ? '' : `<p class="note">${tx(U.needTime)}</p>`}</section>`; }
  if (stp.k === 'pattern') return `<section class="card">${head()}<h2 id="qh" tabindex="-1">${tx(U.patT)}</h2><p class="qdesc">${tx(U.patS)}</p>
    <fieldset class="grp"><legend>${tx(U.gChar)}</legend>${chips('pat', PAT.char, A.pat)}</fieldset>
    <fieldset class="grp"><legend>${tx(U.gWorse)}</legend>${chips('pat', PAT.worse, A.pat)}</fieldset>
    <fieldset class="grp"><legend>${tx(U.gBetter)}</legend>${chips('pat', PAT.better, A.pat)}</fieldset>
    <fieldset class="grp"><legend>${tx(U.gOther)}</legend>${chips('pat', PAT.other.filter(o => o[0] !== 'ch_period' || A.sex === 'sex_f'), A.pat)}</fieldset><!--glstrip-->${nav(true)}</section>`;
  if (stp.k === 'function') { const ok = M.FUNCS.every(f => !f.req || A[f.id]); return `<section class="card">${head()}<h2 id="qh" tabindex="-1">${tx(U.funT)}</h2>
    <fieldset class="grp"><legend>${tx(U.pain)}</legend><div class="painrow"><input type="range" id="pain" min="0" max="10" step="1" value="${A.pain}" aria-label="${esc(tx(U.pain))}"><output class="painval" id="painOut">${A.pain}</output></div><div class="scale"><span>0</span><span>5</span><span>10</span></div><p class="small muted" style="margin-top:4px">${tx(U.painS)}</p></fieldset>
    ${M.FUNCS.map(f => `<fieldset class="grp"><legend>${tx(U[f.label] || f.label)}</legend><div class="pills" role="radiogroup">${f.opts.map(o => `<button type="button" class="pill" role="radio" aria-checked="${A[f.id] === o[0]}" data-act="fn" data-k="${f.id}" data-v="${o[0]}">${esc(tx(o[1]))}</button>`).join('')}</div></fieldset>`).join('')}
    <!--glstrip-->${nav(ok)}${ok ? '' : `<p class="note">${tx(U.needFun)}</p>`}</section>`; }
  if (stp.k === 'test') {
    const t = stp.t, ti = TESTS.indexOf(t) + 1, v = A[t.id];
    GL.forEach(g => { if (g.pic && g.pic.test === t.id) GLU.add(g.id); });
    return `<section class="card">${head(`<span class="code">${fmt(U.testK, ti, TESTS.length)}</span>`)}<h2 id="qh" tabindex="-1">${tx(t.name)}</h2>
      ${G.ok && window.SPG_RIG && TPOSE[t.id] ? testFig(t) : testSVG(t.id, PAL_PAGE) ? `<div class="testfig">${testSVG(t.id, PAL_PAGE)}</div>` : ''}
      <h3>${tx(U.how)}</h3><ol class="steps">${t.steps.map(x => `<li>${tx(x)}</li>`).join('')}</ol>
      <p class="callout"><b>${tx(U.pos)}:</b> ${tx(t.pos)}</p>
      ${t.acc ? `<p class="note"><b>${tx(U.acc)}:</b> ${tx(t.acc)}${cite(t.src)}</p>` : ''}
      <p class="warn">${tx(U.safeT)}</p>
      <!--glstrip--><div class="answers three" style="margin-top:14px">${t.ans.map(o => `<button class="ans ${o[2] === 'y' ? 'y' : 'n'}" data-act="test" data-v="${o[0]}" aria-pressed="${v === o[0]}">${tx(U[o[1]])}</button>`).join('')}</div>
      <div class="qnav"><button class="linkbtn" data-act="prev">← ${tx(U.back)}</button></div></section>`;
  }
  if (stp.k === 'safety') { const ok = RFS.every(r => A.rf[r[0]]); return `<section class="card">${head()}<h2 id="qh" tabindex="-1">${tx(U.safT)}</h2><p class="qdesc">${tx(U.safS)}${cite('ces','wikem','nice')}</p>${M.safetyRegions && U.safPic ? `<p class="small" style="margin-top:12px"><b>${tx(U.safPic)}</b></p>${refPics('safety')}` : ''}
    <div class="safety">${RFS.map(r => `<div class="srow"><p>${tx(r[1])}</p><div class="yn"><button class="y" data-act="rf" data-k="${r[0]}" data-v="yes" aria-pressed="${A.rf[r[0]] === 'yes'}">${tx(U.yes)}</button><button class="n" data-act="rf" data-k="${r[0]}" data-v="no" aria-pressed="${A.rf[r[0]] === 'no'}">${tx(U.no)}</button></div></div>`).join('')}</div>
    <!--glstrip-->${nav(ok, true)}${ok ? '' : `<p class="note">${tx(U.needSaf)}</p>`}</section>`; }
  return '';
}
function findings(R){
  const out = [], F = R.F;
  if (A.onset) out.push(optLab(A.onset)); if (A.since) out.push(optLab(A.since)); if (A.hx) out.push(optLab(A.hx)); if (A.btw) out.push(optLab(A.btw));
  const sides = sideText(R.sides); if (F.has('leg_any')) out.push(lab('leg_any') + (sides ? ' (' + sides + ')' : ''));
  if (F.has('below_knee')) out.push(lab('below_knee')); if (A.dom === 'dom_leg') out.push(optLab('dom_leg'));
  ['slr_pos','cslr_pos','heel_weak','toe_weak'].forEach(k => { if (F.has(k)) out.push(lab(k)); });
  ['w_sit','w_bend','w_cough','ch_shoot','ch_numb'].forEach(k => { if (F.has(k)) out.push(lab(k)); });
  M.FUNCS.forEach(f => { if (A[f.id] && /_no$/.test(A[f.id])) out.push(optLab(A[f.id])); });
  out.push((lang === 'hi' ? 'दर्द ' : 'Pain ') + A.pain + '/10');
  return out;
}
function vResult(){
  const R = analyze(A), Lv = LEVELS[R.level], top = R.ranked[0];
  const meter = ['green','yellow','orange','red'].map(k => `<span class="m-${k}${k === R.level ? ' cur' : ''}">${tx(LEVELS[k].short)}</span>`).join('');
  const calls = R.level === 'red' ? `<div class="calls"><a class="call" href="tel:108"><b>108</b>${tx(U.call108)}</a><a class="call" href="tel:112"><b>112</b>${tx(U.call112)}</a></div><p class="small" style="margin-top:6px">${tx(U.callN)}</p>` : '';
  let html = `<section class="banner lv-${R.level}"><div class="meter" aria-hidden="true">${meter}</div><p class="kicker" style="margin:0">${tx(U.resK)}</p><h2 id="qh" tabindex="-1" style="margin-top:4px">${tx(Lv.title)}</h2><p>${tx(Lv.act)}</p>${calls}<ul class="reasons">${R.reasons.map(r => `<li>${esc(tx(r))}</li>`).join('')}</ul></section>`;
  html += `<section class="card sum3"><div class="qhead"><h3>${tx(U.sumT)}</h3>${sayBtn()}</div><ol>${summaryLines(R).map(l => `<li>${esc(l)}</li>`).join('')}</ol></section>`;
  html += `<section class="card must"><h3>${tx(U.mustT)}</h3><ul class="tips">${U.must.map(m => `<li>${tx(m)}</li>`).join('')}</ul></section>`;
  html += `<section class="card"><h3>${tx(U.keyF)}</h3><div class="findings">${findings(R).map(f => `<span>${esc(f)}</span>`).join('')}</div></section>`;
  // impression
  const strengthBadge = s => `<span class="badge b-${s}">${tx(U[s])}</span>`;
  if (R.emerg.length) {
    html += `<section class="card"><h3>${tx(U.imp)}</h3>${R.emerg.map(e => { const E = EMERG[e]; return `<div class="imp-top"><div><h4>${tx(E.name)}</h4><p class="sci">${E.sci}</p></div><span class="badge b-ruleout">${tx(U.ruleout)}</span></div><p class="para">${tx(E.what)}${cite(...E.src)}</p>`; }).join('')}</section>`;
  }
  if (top) {
    const c = top.c, pct = Math.max(8, Math.min(100, Math.round(top.rel * 100)));
    html += `<section class="card"><h3>${tx(R.emerg.length ? U.diff : U.imp)}</h3>
      <div class="imp-top"><div style="min-width:0"><p class="kicker" style="color:var(--muted)">${tx(U.primary)}</p><h4 style="margin-top:2px">${tx(c.name)}</h4><p class="sci">${c.sci}</p></div>${strengthBadge(top.strength)}</div>
      <div class="bar" aria-hidden="true"><i style="width:${pct}%"></i></div>
      <dl class="ev"><dt>${tx(U.sup)}</dt><dd>${top.pros.slice(0, 7).map(p => `<span class="p">${esc(lab(p[0]))}</span>`).join('')}</dd>${top.cons.length ? `<dt>${tx(U.ag)}</dt><dd>${top.cons.slice(0, 4).map(p => `<span class="c">${esc(lab(p[0]))}</span>`).join('')}</dd>` : ''}</dl>
      <p class="para">${tx(c.what)}${c.cSrc ? cite(...c.cSrc) : ''}</p>
      ${whyList(top)}
      <div class="kv"><div><b>${tx(U.causesT)}</b>${tx(c.causes)}</div><div><b>${tx(U.confirm)}</b>${tx(c.confirm)}${c.cSrc ? cite(...c.cSrc) : ''}</div><div><b>${tx(U.treatT)}</b>${tx(c.treat)}</div><div><b>${tx(U.outlook)}</b>${tx(c.outlook)}${c.oSrc ? cite(...c.oSrc) : ''}</div></div></section>`;
  }
  if (G.ok) {
    html += `<section class="card"><h3>${tx(U.galT)}</h3><p class="small muted" style="margin-top:6px">${tx(U.galN)}</p><div class="gal" id="gal"><p class="muted small">${tx(U.galWait)}</p></div></section>`;
  }
  // root cause
  if (rcaApplies(R)) {
    const d = discInfo(R); const side = R.sides.size === 1 ? [...R.sides][0] : 'b';
    const dd = Object.assign({}, d, {side});
    const hiRoots = d.roots;
    html += `<section class="card"><h3>${tx(U.rca)}</h3>${rcaText(R).map(p => `<p class="para">${p}</p>`).join('')}
      <div class="figs"><figure class="fig">${axialSVG(dd, PAL_PAGE)}<figcaption>${tx(U.ax)}${cite('nomen','ortho')}</figcaption></figure>
      <figure class="fig wide">${typesSVG(PAL_PAGE)}<figcaption>${tx(U.types)}${cite('nomen','nass','chiu')}</figcaption></figure></div>
      <p class="note">${tx(U.anatNote)}</p>
      <h3 style="margin-top:18px">${tx(U.nerveT)}</h3>
      <div class="tablewrap"><table><thead><tr><th>${tx(U.thRoot)}</th><th>${tx(U.thSkin)}</th><th>${tx(U.thMus)}</th><th>${tx(U.thRef)}</th><th>${tx(U.thDisc)}</th><th>${tx(U.thTest)}</th></tr></thead><tbody>
      ${(M.RCA.nerveTable || Object.keys(ROOTS)).map(k => { const r = ROOTS[k]; return `<tr class="${hiRoots.includes(k) ? 'hl' : ''}"><td class="root">${k}</td><td>${tx(r.skin)}</td><td>${tx(r.mus)}</td><td>${tx(r.ref)}</td><td class="mono">${r.disc}</td><td>${tx(r.test)}</td></tr>`; }).join('')}
      </tbody></table></div><p class="small muted" style="margin-top:6px">${cite('msd','physio','medm')}</p></section>`;
  }
  // differential
  const others = R.ranked.slice(top && !R.emerg.length ? 1 : 0, 6).filter(r => r !== top || R.emerg.length);
  if (others.length) {
    html += `<section class="card"><h3>${tx(U.diff)}</h3><div class="tablewrap"><table class="diff"><thead><tr><th>${tx(U.thCond)}</th><th>${tx(U.thMatch)}</th><th>${tx(U.thWhy)}</th><th>${tx(U.thSpec)}</th></tr></thead><tbody>
      ${others.map(r => `<tr><td>${esc(tx(r.c.name))}<div class="sci">${r.c.sci}</div></td><td>${strengthBadge(r.strength)}</td><td>${r.pros.slice(0, 3).map(p => esc(lab(p[0]))).join(' · ')}</td><td>${esc(tx(DEPTS[r.c.depts[0]].n))}</td></tr>`).join('')}
      </tbody></table></div></section>`;
  }
  // departments
  html += `<section class="card"><h3>${tx(U.docs)}</h3><ol class="depts">${R.depts.map((d, i) => { const D = DEPTS[d.id]; return `<li class="dept${i === 0 ? ' first' : ''}"><span class="ix">${i + 1}</span><div style="min-width:0">${i === 0 ? `<span class="st">${tx(U.startHere)}</span>` : ''}<h4>${esc(tx(D.n))}</h4><p>${esc(tx(D.s))}</p>${d.why.length ? `<p class="for"><b>${tx(U.forL)}:</b> ${d.why.map(w => esc(tx(w))).join(' · ')}</p>` : ''}${d.id !== 'emergency' ? `<a href="https://www.google.com/maps/search/${encodeURIComponent(D.q + ' near me')}" target="_blank" rel="noopener">${tx(U.near)} ↗</a>` : ''}</div></li>`; }).join('')}</ol></section>`;
  if (R.level !== 'red') html += `<section class="card"><h3>${tx(U.until)}</h3><ul class="tips"><li>${tx(U.tip1)}${cite('nice','who')}</li><li>${tx(U.tip2)}</li><li>${tx(U.tip3)}</li></ul></section>`;
  html += `<section class="card"><h3>${tx(U.rep)}</h3><p class="small muted" style="margin-top:6px">${tx(U.repS)}</p><div class="dl"><button class="btn primary" data-act="download" id="dlBtn">${tx(U.dl)}</button>${navigator.share || (navigator.clipboard && navigator.clipboard.writeText) ? `<button class="btn ghost" data-act="share" id="shBtn">${ICO.share}${tx(U.share)}</button>` : ''}<span class="small muted" id="dlStatus" role="status"></span></div></section>`;
  html += `<div class="actions"><button class="btn ghost" data-act="edit">${tx(U.edit)}</button><button class="btn ghost" data-act="home">${tx(U.restart)}</button></div>`;
  return html;
}
function whyList(top){
  const items = top.pros.filter(p => FX[p[0]]).slice(0, 7);
  if (!items.length) return '';
  return `<h4 style="margin-top:16px;font-size:15px">${tx(U.whyT)}</h4><ul class="why">${items.map(p => `<li><b>${esc(lab(p[0]))}</b> — ${esc(tx(FX[p[0]]))}</li>`).join('')}</ul>`;
}
/* ================= glossary: medical words become tappable, each opens a picture and a plain meaning ================= */
const GL = (SPG.data.glossary || []), GLI = {}; GL.forEach(g => GLI[g.id] = g);
let GLU = new Set(); const GLRX = {};
const SKIPT = new Set(['a','button','sup','svg','h3','th','figcaption','select','option','textarea','output','title']);
function glRx(){
  if (GLRX[lang]) return GLRX[lang];
  const list = [], map = {};
  GL.forEach(g => (g.terms[lang] || []).forEach(t => list.push([t, g.id])));
  list.sort((a, b) => b[0].length - a[0].length); list.forEach(([t, id]) => map[t.toLowerCase()] = id);
  const alt = list.map(x => x[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  const rx = !alt ? null : lang === 'hi' ? new RegExp('(^|[^\\u0900-\\u097F])(' + alt + ')([\\u0900-\\u097F]*)', 'g') : new RegExp('(^|[^A-Za-z])(' + alt + ')()(?![A-Za-z])', 'gi');
  return GLRX[lang] = {rx, map};
}
const glKey = (map, t) => map[t.toLowerCase()];
function gl(html){
  const {rx, map} = glRx(); if (!rx) return html.replace('<!--glstrip-->', '');
  const parts = html.split(/(<[^>]*>)/), seen = new Set(); let skip = 0;
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i]; if (!p) continue;
    if (p[0] === '<') { const m = /^<(\/?)([a-zA-Z0-9]+)/.exec(p); if (m && SKIPT.has(m[2].toLowerCase())) { if (m[1]) skip = Math.max(0, skip - 1); else if (!/\/>$/.test(p)) skip++; } continue; }
    if (skip) { p.replace(rx, (a, pre, term) => { const id = glKey(map, term); if (id) seen.add(id); return a; }); continue; }
    parts[i] = p.replace(rx, (a, pre, term, tail) => { const id = glKey(map, term); if (!id || GLU.has(id)) return a; GLU.add(id); return `${pre}<button type="button" class="term" data-act="term" data-v="${id}">${term}${tail || ''}</button>`; });
  }
  let out = parts.join('');
  if (out.includes('<!--glstrip-->')) {
    const ids = [...seen].filter(id => !GLU.has(id)); ids.forEach(id => GLU.add(id));
    out = out.replace('<!--glstrip-->', ids.length ? `<div class="glstrip"><span>${tx(U.glT)}:</span>${ids.map(id => `<button type="button" class="term" data-act="term" data-v="${id}">${esc(tx(GLI[id].title))}</button>`).join('')}</div>` : '');
  }
  return out;
}
const GLPIC = {};
function glLabels(p){
  const v = p.view || {}, f = p.focus || {}, lat = Math.abs(Math.sin(v.az || 0)) > 0.85, yk = String(v.yk || '');
  const set = p.lset || (/^(C\d|c4|sh|wrist)/.test(yk) ? ['C1','C2','C3','C4','C5','C6','C7','T1'] : /^(T\d|t6)/.test(yk) ? ['T1','T2','T3','T4','T5','T6','T7','T8','T9','T10','T11','T12'] : ['T12','L1','L2','L3','L4','L5','S1']);
  G.anatomy.makeLabels(lat ? 'l' : (f.side || 'l'), f.label || [], lang === 'hi' ? 'डिस्क' : 'disc', lat ? 'lat' : null, set);
}
function glPic(g){
  const p = g.pic || {}, key = [g.id, G.sex, lang].join('|'); if (GLPIC[key]) return GLPIC[key];
  if (!G.ok || !G.anatomy) return null;
  if (p.k === 'pose') { if (!window.SPG_RIG || !TPOSE[p.test]) return null; const u = testPic(p.test, 480, 560); return u ? (GLPIC[key] = u) : null; }
  let c;
  if (p.k === 'skin') c = snapshot(p.view, 480, 520, {cur:p.reg || [], hlA:0.42});
  else {
    G.anatomy.setFocus(p.focus || {}); if (p.labels) glLabels(p); else G.anatomy.makeLabels('l', [], '', null, []);
    const noBody = p.body === undefined ? (p.view.d < 1.0) : !p.body;
    c = snapshot(p.view, 480, 520, {anat:true, labels:!!p.labels, noBody, noLegs:p.noLegs, noUpper:p.noUpper, keepRibs:p.keepRibs, nerveKeep:p.nerveKeep, noPelvis:p.noPelvis, noSac:p.noSac, cur:p.reg || [], hlA:0.42, fov:30});
    applyRCA();
  }
  if (!c) return null; return GLPIC[key] = c.toDataURL('image/jpeg', 0.88);
}
function openTerm(id){
  const g = GLI[id]; if (!g) return; sayStop();
  const p = g.pic || {}, svg = p.k === 'svg' ? (p.fn === 'types' ? typesSVG(PAL_PAGE) : '') : '';
  $('#glossCard').innerHTML = `<div class="glhead"><p class="kicker">${tx(U.glK)}</p><button type="button" class="glx" data-act="glClose" aria-label="${esc(tx(U.glClose))}">×</button></div>
    <h2 id="glT" style="margin-top:4px">${esc(tx(g.title))}</h2>
    ${svg || G.ok ? `<figure class="glpic${svg ? '' : ' loading'}" id="glPic">${svg}</figure>` : ''}
    <p class="glplain">${esc(tx(g.plain))}${g.src ? cite(...g.src) : ''}</p>
    <div class="glbtns">${sayBtn('gloss')}<button type="button" class="btn primary" data-act="glClose">${tx(U.glClose)}</button></div>`;
  const gp = $('#glossPanel'); gp.hidden = false; gp.dataset.id = id; const x = $('#glossCard .glx'); if (x) x.focus();
  if (!svg && G.ok) setTimeout(() => requestAnimationFrame(() => {
    if (gp.hidden || gp.dataset.id !== id) return; const u = glPic(g), box = $('#glPic'); if (!box) return;
    box.classList.remove('loading'); if (u) box.innerHTML = `<img src="${u}" alt="${esc(tx(g.title))}">`; else box.remove();
  }), 30);
}
function closeTerm(){ const gp = $('#glossPanel'); if (gp && !gp.hidden) { gp.hidden = true; sayStop(); const b = document.querySelector(`.term[data-v="${gp.dataset.id}"]`); if (b) b.focus({preventScroll:true}); } }

/* ================= read aloud (the phone's own text-to-speech, nothing is sent anywhere) ================= */
const SAY = {on:false, warned:false};
const SPK = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3.5 7.5h3l4-3.5v12l-4-3.5h-3z"/><path d="M13.5 7a4 4 0 0 1 0 6M15.8 4.8a7 7 0 0 1 0 10.4"/></svg>';
const canSay = () => typeof window.speechSynthesis !== 'undefined' && typeof window.SpeechSynthesisUtterance !== 'undefined';
const sayBtn = scope => canSay() ? `<button type="button" class="saybtn" data-act="say" data-v="${scope || 'panel'}" aria-pressed="${SAY.on && SAY.scope === (scope || 'panel')}">${SPK}<span>${tx(SAY.on && SAY.scope === (scope || 'panel') ? U.sayStop : U.say)}</span></button>` : '';
function updSay(){ document.querySelectorAll('[data-act="say"]').forEach(b => { const on = SAY.on && SAY.scope === b.dataset.v; b.setAttribute('aria-pressed', on); const s = b.querySelector('span'); if (s) s.textContent = tx(on ? U.sayStop : U.say); }); }
function sayStop(){ if (canSay() && SAY.on) { speechSynthesis.cancel(); SAY.on = false; updSay(); } }
function sayVoice(){
  const vs = speechSynthesis.getVoices() || [], n = s => (s || '').replace('_', '-').toLowerCase();
  if (lang === 'hi') return vs.find(v => n(v.lang).startsWith('hi')) || null;
  return vs.find(v => n(v.lang) === 'en-in') || vs.find(v => n(v.lang).startsWith('en')) || null;
}
function sayText(scope){
  const clean = e => { const c = e.cloneNode(true); c.querySelectorAll('sup, .bx, svg, .saybtn').forEach(x => x.remove()); return c.textContent.replace(/\s+/g, ' ').trim(); };
  let els;
  if (scope === 'gloss') els = document.querySelectorAll('#glossCard h2, #glossCard .glplain');
  else if (S.view === 'result') els = document.querySelectorAll('#panel .banner h2, #panel .banner > p:not(.kicker), #panel .sum3 li, #panel .must li');
  else if (S.view === 'start') els = document.querySelectorAll('#panel h1, #panel .lede, #panel .lbl, #panel .mcard b, #panel .mcard small');
  else els = document.querySelectorAll('#panel section.card h2, #panel .qdesc, #panel .qtext, #panel .grp legend, #panel .chip, #panel .pill, #panel .ans, #panel .srow p, #panel ol.steps li, #panel .callout');
  const end = lang === 'hi' ? '।' : '.';
  return [...els].map(clean).filter(Boolean).map(t => /[.?!।:]$/.test(t) ? t : t + end).join(' ');
}
function say(scope){
  if (!canSay()) return; const ss = window.speechSynthesis;
  if (SAY.on) { const same = SAY.scope === scope; ss.cancel(); SAY.on = false; updSay(); if (same) return; }
  const text = sayText(scope); if (!text) return;
  const chunks = []; text.replace(/([.?!।])\s+/g, '$1\n').split('\n').forEach(s => { s = s.trim(); if (!s) return; const last = chunks[chunks.length - 1]; if (last && last.length + s.length < 180) chunks[chunks.length - 1] = last + ' ' + s; else chunks.push(s); });
  const v = sayVoice(); SAY.on = true; SAY.scope = scope; SAY.id = (SAY.id || 0) + 1; const my = SAY.id;
  chunks.forEach((c, i) => { const u = new SpeechSynthesisUtterance(c); u.lang = lang === 'hi' ? 'hi-IN' : 'en-IN'; if (v) u.voice = v; u.rate = lang === 'hi' ? 0.92 : 0.96;
    if (i === chunks.length - 1) u.onend = () => { if (SAY.id === my) { SAY.on = false; updSay(); } };
    u.onerror = () => { if (SAY.id === my) { SAY.on = false; updSay(); } }; ss.speak(u); });
  updSay();
  if (lang === 'hi' && !v && !SAY.warned) { SAY.warned = true; const n = document.createElement('p'); n.className = 'note'; n.textContent = tx(U.sayNoHi); const host = scope === 'gloss' ? $('#glossCard') : document.querySelector('#panel section'); if (host) host.appendChild(n); }
}
if (canSay()) { try { speechSynthesis.getVoices(); speechSynthesis.addEventListener && speechSynthesis.addEventListener('voiceschanged', () => {}); } catch (e) {} }

/* ================= larger text ================= */
let big = false; try { big = localStorage.getItem('spg-big') === '1'; } catch (e) {}
document.documentElement.classList.toggle('big', big);

/* ================= save and resume (kept only in this browser) ================= */
const SAVEK = 'spg-save';
function saveState(){ if (S.view !== 'q' && S.view !== 'result') return; try { localStorage.setItem(SAVEK, JSON.stringify({v:1, mod:M.id, A, view:S.view, idx:S.idx, t:Date.now()})); } catch (e) {} }
function loadSave(){
  try { const s = JSON.parse(localStorage.getItem(SAVEK) || 'null');
    if (!s || s.v !== 1 || !SPG.data.modules[s.mod] || !s.A || Date.now() - s.t > 30 * 864e5) return null;
    if (s.view === 'result' || (s.view === 'q' && s.idx > 0)) return s; } catch (e) {}
  return null;
}
function resume(){
  const s = loadSave(); if (!s) return;
  useModule(s.mod); A = Object.assign(fresh(), s.A); useSex(sexCode());
  if (s.view === 'result') return showResult();
  let i = Math.min(s.idx, STEPS.length - 1); while (i > 0 && !valid(i)) i--; goto(i);
}

/* ================= plain summary + share ================= */
function summaryLines(R){
  const out = [], top = R.ranked[0];
  if (R.emerg.length) out.push(fmt(U.sumE, tx(EMERG[R.emerg[0]].name)));
  else if (top) out.push(tx(U.sum1).replace('{a}', tx(top.c.name)).replace('{b}', tx(U[top.strength]).toLowerCase()));
  else out.push(tx(U.sumNone));
  out.push(fmt(U.sum2, tx(LEVELS[R.level].title)));
  const d0 = R.depts[0]; if (d0 && DEPTS[d0.id]) out.push(fmt(U.sum3, tx(DEPTS[d0.id].n)));
  return out;
}
const pdfKey = () => JSON.stringify([M.id, lang, A, G.sex]);
async function getPDF(){ const k = pdfKey(); if (G.pdf && G.pdf.k === k) return G.pdf.blob; const blob = await buildPDF(); G.pdf = {k, blob}; return blob; }
const pdfName = () => 'spine-assessment-' + new Date().toISOString().slice(0, 10) + '.pdf';
function shareText(){
  const R = analyze(A), lines = [tx(U.brand) + ' — ' + tx(U.shareH)];
  summaryLines(R).forEach(l => lines.push('• ' + l)); lines.push(tx(U.notDx) + '.');
  if (/^https?:$/.test(location.protocol) && !/claude|anthropic/.test(location.hostname)) lines.push(location.origin + location.pathname);
  return lines.join('\n');
}
async function shareReport(){
  const st = $('#dlStatus'), btn = $('#shBtn'), text = shareText(), cached = G.pdf && G.pdf.k === pdfKey();
  const done = m => { if (st) st.textContent = m ? tx(m) : ''; if (btn) btn.disabled = false; };
  if (btn) btn.disabled = true;
  try {
    if (navigator.share && navigator.canShare && typeof File === 'function') {
      if (!cached && st) st.textContent = tx(U.prep);
      const blob = await getPDF(), file = new File([blob], pdfName(), {type:'application/pdf'});
      if (navigator.canShare({files:[file]})) {
        try { await navigator.share({files:[file], title:tx(U.brand), text}); return done(U.shared); }
        catch (e) { if (e && e.name === 'AbortError') return done(); if (!cached && e && e.name === 'NotAllowedError') return done(U.shareAgain); }
      }
    }
    if (navigator.share) { try { await navigator.share({title:tx(U.brand), text}); return done(U.shared); } catch (e) { if (e && e.name === 'AbortError') return done(); } }
    if (navigator.clipboard && navigator.clipboard.writeText) { await navigator.clipboard.writeText(text); return done(U.shareCopied); }
  } catch (e) { console.warn('share', e); }
  done(U.shareNA);
}
/* ================= start page cards: one per body part, each with a 3D picture ================= */
const MODPIC = {};
function fillModPics(){
  if (!G.ok) return;
  document.querySelectorAll('.mcard img[data-mod]').forEach((img, i) => {
    const m = SPG.data.modules[img.dataset.mod], key = m.id + '|' + G.sex; if (!m) return;
    if (MODPIC[key]) { img.src = MODPIC[key]; return; }
    setTimeout(() => requestAnimationFrame(() => {
      if (!document.body.contains(img)) return; const cd = m.card || {};
      const c = snapshot(cd.view || V.back || V.full, 300, 330, {cur:cd.reg || m.startRegions || [], hlA:0.55}); if (!c) return;
      MODPIC[key] = c.toDataURL('image/jpeg', 0.86); img.src = MODPIC[key];
    }), 30 + i * 50);
  });
}
function vFoot(){ return `<p>${tx(U.disc)}</p><details class="srcs" id="srcDetails" ${S.view === 'result' ? 'open' : ''}><summary>${tx(U.srcT)} (${SRC.length})</summary><ol>${SRC.map((s, i) => `<li id="src-${i + 1}"><a href="${s[2]}" target="_blank" rel="noopener">${esc(s[1])}</a></li>`).join('')}</ol></details>`; }

function render(focus){
  document.documentElement.lang = lang;
  $('#brandText').textContent = tx(U.brand); $('#tagText').textContent = tx(U.tag); $('#sosText').textContent = tx(U.sos);
  $('#langEn').setAttribute('aria-pressed', lang === 'en'); $('#langHi').setAttribute('aria-pressed', lang === 'hi');
  $('#tSkin').textContent = tx(U.skin); $('#tAnat').textContent = tx(U.anat); $('#tFront').textContent = tx(U.front); $('#tBack').textContent = tx(U.backV); $('#tSpine').textContent = tx(U.spineV);
  $('#hint').textContent = tx(U.drag);
  [['zIn','zIn'],['zOut','zOut'],['rotL','rotL'],['rotR','rotR'],['zReset','zReset']].forEach(([id, k]) => { const b = $('#' + id); if (b) { b.title = tx(U[k]); b.setAttribute('aria-label', tx(U[k])); } });
  const zb = $('#zbar'); if (zb) zb.hidden = !G.ok;
  if (!G.ok) { const n = $('#nogl'); n.hidden = false; n.textContent = tx(U.noGL); $('#hint').hidden = true; }
  chrome();
  $('#stepper').innerHTML = stepper();
  const bb = $('#bigBtn'); if (bb) { bb.title = tx(U.bigT); bb.setAttribute('aria-label', tx(U.bigT)); bb.setAttribute('aria-pressed', big); }
  const pageKey = [S.view, S.idx, M.id, lang].join('|'); if (pageKey !== G.pageKey) { G.pageKey = pageKey; sayStop(); }
  GLU = new Set();
  const html = S.view === 'lang' ? vLang() : S.view === 'start' ? vStart() : S.view === 'q' ? vQ() : vResult();
  $('#panel').innerHTML = S.view === 'lang' ? html : gl(html);
  $('#foot').innerHTML = vFoot();
  fillRefPics(); fillTestPic(); fillModPics(); updInstall(); saveState();
  document.body.classList.toggle('is-q', S.view === 'q');
  if (focus) { const h = $('#qh'); if (h) h.focus({preventScroll:true}); }
}
function viewFor(stp){ if (stp.k === 'area') return V[stp.a.view] || V.full; if (stp.k === 'safety') return V[M.safetyView] || V.full; return V.full; }
function goto(i){
  S.view = 'q'; S.idx = i; G.spin = false; if (G.anat) setAnat(false);
  aim(viewFor(STEPS[i])); if (STEPS[i].k !== 'area' && STEPS[i].k !== 'safety') G.spin = true;
  render(true); window.scrollTo(0, 0);
}
function next(){ for (let i = S.idx + 1; i < STEPS.length; i++) if (valid(i)) return goto(i); showResult(); }
function prev(){ for (let i = S.idx - 1; i >= 0; i--) if (valid(i)) return goto(i); S.view = 'start'; aim(V.full); G.spin = true; render(true); }
function showResult(){
  S.view = 'result'; const R = analyze(A); useSex(sexCode());
  const f = focusFor(R); G.rca = Object.keys(f).length ? f : null; applyRCA(); G.imgs = null;
  if (G.ok) { setAnat(!!G.rca); G.spin = false; aim(Object.assign({}, V.full, {az: f.side === 'r' ? PI + 0.35 : PI - 0.35})); }
  render(true); window.scrollTo(0, 0);
  setTimeout(renderGallery, 60);
}
/* ================= bedside-test pictures: the 3D body posed for each test ================= */
const RIG = {};
function rigReady(){
  if (RIG.ok) return true; const R = window.SPG_RIG; if (!R || !G.ok) return false;
  RIG.bi = dec(R.bi, Uint8Array); RIG.bw = dec(R.bw, Uint8Array); RIG.ix = {}; R.bones.forEach((b, i) => RIG.ix[b[0]] = i); RIG.ok = true; return true;
}
function boneMats(T, sex, pz){
  const R = window.SPG_RIG, piv = R[sex].piv, out = [];
  R.bones.forEach(([name, par], i) => {
    const p = piv[i], r = pz[name], L = new T.Matrix4();
    if (r) L.makeTranslation(p[0], p[1], p[2]).multiply(new T.Matrix4().makeRotationFromEuler(new T.Euler(r[0] * PI / 180, r[1] * PI / 180, r[2] * PI / 180, r[3] || 'XYZ'))).multiply(new T.Matrix4().makeTranslation(-p[0], -p[1], -p[2]));
    out[i] = par < 0 ? L : out[par].clone().multiply(L);
  });
  if (pz.$rot) { const Rm = new T.Matrix4().makeRotationFromEuler(new T.Euler(pz.$rot[0] * PI / 180, pz.$rot[1] * PI / 180, pz.$rot[2] * PI / 180, 'XYZ')); out.forEach((m, i) => out[i] = Rm.clone().multiply(m)); }
  return out;
}
function skin(sex, mats){
  const q = dec(window.SPG_BODY[sex].pos, Int16Array), n = q.length / 3, P = new Float32Array(q.length), E = mats.map(m => m.elements), bi = RIG.bi, bw = RIG.bw;
  for (let v = 0; v < n; v++) {
    const x = q[v*3] / 1e4, y = q[v*3+1] / 1e4, z = q[v*3+2] / 1e4; let ox = 0, oy = 0, oz = 0;
    for (let k = 0; k < 4; k++) { const w = bw[v*4+k] / 255; if (!w) continue; const e = E[bi[v*4+k]];
      ox += w * (e[0]*x + e[4]*y + e[8]*z + e[12]); oy += w * (e[1]*x + e[5]*y + e[9]*z + e[13]); oz += w * (e[2]*x + e[6]*y + e[10]*z + e[14]); }
    P[v*3] = ox; P[v*3+1] = oy; P[v*3+2] = oz;
  }
  return P;
}
/* world position of a bone's pivot (+ optional offset in rest space) under a pose */
function bonePt(T, sex, mats, bone, off){ const i = RIG.ix[bone], p = window.SPG_RIG[sex].piv[i]; return new T.Vector3(p[0] + (off ? off[0] : 0), p[1] + (off ? off[1] : 0), p[2] + (off ? off[2] : 0)).applyMatrix4(mats[i]); }
const mirror = (pz, s) => { if (s === 'l') return pz; const o = {}; Object.keys(pz).forEach(k => { const v = pz[k]; const k2 = k.endsWith('_l') ? k.slice(0, -2) + '_r' : k.endsWith('_r') ? k.slice(0, -2) + '_l' : k; o[k2] = Array.isArray(v) && k[0] !== '$' ? [v[0], -v[1], -v[2], v[3]] : v; }); return o; };
const SEAT = {thigh_l:[-88, 0, 6], thigh_r:[-88, 0, -6], shin_l:[88, 0, 0], shin_r:[88, 0, 0]};
const ARMS_CROSS = {uarm_l:[-30, 0, -16], farm_l:[-52, -82, 0, 'YXZ'], uarm_r:[-30, 0, 16], farm_r:[-52, 82, 0, 'YXZ']};
const HANDS_THIGHS = {uarm_l:[-22, 0, -2], uarm_r:[-22, 0, 2], farm_l:[-22, 0, 0], farm_r:[-22, 0, 0]};
const FIST = s => { const o = {}, sg = s === 'l' ? 1 : -1; for (let f = 2; f <= 5; f++) { o[`f${f}1_${s}`] = [0, 0, 95 * sg]; o[`f${f}2_${s}`] = [0, 0, 110 * sg]; o[`f${f}3_${s}`] = [0, 0, 75 * sg]; } o[`f11_${s}`] = [0, 0, 25 * sg]; o[`f12_${s}`] = [0, 0, 35 * sg]; o[`f13_${s}`] = [0, 0, 30 * sg]; return o; };
/* each test: pose, coloured areas (pain = where symptoms appear, work = muscles tested), camera, props and motion arrows */
const TPOSE = {
  slr: s => { const o = s === 'l' ? 'r' : 'l'; return {pose:Object.assign({$rot:[-90, 0, 0]}, {['thigh_' + s]:[-55, 0, 0], ['foot_' + s]:[-8, 0, 0]}, {uarm_l:[0, 0, -8], uarm_r:[0, 0, 8], farm_l:[20, 0, 0], farm_r:[20, 0, 0]}),
    from:{['thigh_' + s]:[0, 0, 0]}, ground:'bed', pain:['buttock_' + s, 'thigh_back_' + s, 'l5_' + s, 's1_' + s], cam:{az:s === 'l' ? 64 : -64, el:22, fit:1.12, dy:0.0}, arc:{bone:'foot_' + s, off:[0, -0.02, 0.06]}, props:['bed']}; },
  cslr: s => { const o = s === 'l' ? 'r' : 'l'; return Object.assign(TPOSE.slr(o), {pain:['buttock_' + s, 'thigh_back_' + s, 'l5_' + s, 's1_' + s]}); },
  heel: () => ({pose:{thigh_l:[-22, 0, 0], shin_l:[12, 0, 0], foot_l:[-30, 0, 0], thigh_r:[12, 0, 0], shin_r:[18, 0, 0], foot_r:[-32, 0, 0], uarm_l:[-10, 0, 6], uarm_r:[14, 0, -6]}, ground:'heels', work:['l5_l', 'l5_r'], cam:{az:66, el:4, fit:1.0}, arc:{bone:'toes_l', off:[0, 0.02, 0.04], from:{foot_l:[0, 0, 0]}}, props:[]}),
  toe: s => ({pose:mirror({foot_l:[34, 0, 0], toes_l:[-30, 0, 0], thigh_r:[8, 0, 0], shin_r:[70, 0, 0], foot_r:[20, 0, 0], uarm_l:[-58, 0, 6], uarm_r:[-58, 0, -6], farm_l:[-10, 0, 0], farm_r:[-10, 0, 0]}, s), ground:'toes', work:['s1_' + s], cam:{az:s === 'l' ? 104 : -104, el:6, fit:1.0}, arc:{bone:'foot_' + s, off:[0, -0.05, -0.04], rel:'toes_' + s, from:{['foot_' + s]:[0, 0, 0], ['toes_' + s]:[0, 0, 0]}}, props:['wallFront']}),
  spur: s => ({pose:Object.assign({}, SEAT, HANDS_THIGHS, mirror({neck:[-10, 0, -14], head:[-10, 0, -16]}, s)), ground:'seat', pain:['neck', 'c6_' + s, 'c7_' + s, 'scap_' + s], cam:{az:s === 'l' ? 28 : -28, el:6, fit:1.0, dy:0.12, zoom:1.15}, arc:{bone:'head', off:[0, 0.2, 0.0], from:{neck:[0, 0, 0], head:[0, 0, 0]}}, props:['chair']}),
  sabd: s => ({pose:Object.assign({}, SEAT, HANDS_THIGHS, mirror({clav_l:[0, 0, 12], uarm_l:[-8, 0, 100], farm_l:[18, 0, 138], hand_l:[0, 0, 30]}, s)), ground:'seat', work:['c5_' + s, 'c6_' + s, 't1_' + s], relief:true, cam:{az:s === 'l' ? 22 : -22, el:6, fit:1.0, dy:0.12, zoom:1.15}, arc:{bone:'hand_' + s, off:[0, 0, 0]}, props:['chair']}),
  dist: s => ({pose:Object.assign({}, SEAT, HANDS_THIGHS), ground:'seat', work:['neck', 'c6_' + s, 'c7_' + s], relief:true, cam:{az:s === 'l' ? 40 : -40, el:8, fit:1.0, dy:0.1, zoom:1.02}, lift:true, props:['chair']}),
  grip: () => ({pose:Object.assign({uarm_l:[-55, 0, -17], uarm_r:[-55, 0, 17], farm_l:[-12, 0, 0], farm_r:[-12, 0, 0]}, FIST('r')), ground:'feet', work:['c7_l', 'c7_r', 'c8_l', 'c8_r'], cam:{az:40, el:12, focus:'hands', d:1.35, dy:0.12}, props:[]}),
  tandem: () => ({pose:{thigh_l:[-13, 0, -7], shin_l:[6, 0, 0], thigh_r:[8, 0, 7], shin_r:[10, 0, 0], foot_r:[8, 0, 0], uarm_l:[0, 0, 34], uarm_r:[0, 0, -34]}, ground:'feet', cam:{az:38, el:16, fit:1.05}, props:['line']}),
  press: () => ({pose:{}, ground:'feet', pain:['interscap', 'midback'], cam:{az:180, el:6, fit:0.62, dy:0.2}, marks:true, props:[]}),
  twist: () => ({pose:Object.assign({}, SEAT, ARMS_CROSS, {lspine:[0, 8, 0], tspine:[0, 14, 0], chest:[0, 12, 0], neck:[0, 6, 0]}), ground:'seat', pain:['midback', 'midback_side_l', 'midback_side_r', 'ribs_l', 'ribs_r'], cam:{az:150, el:14, fit:1.0, dy:0.1}, stool:true, arc:{bone:'uarm_r', off:[0, 0.05, 0], from:{lspine:[0, 0, 0], tspine:[0, 0, 0], chest:[0, 0, 0]}}, props:['chair']}),
  wall: () => ({pose:{tspine:[8, 0, 0], chest:[6, 0, 0], neck:[16, 0, 0], head:[-14, 0, 0]}, ground:'feet', cam:{az:66, el:4, fit:1.0}, gap:true, props:['wallBack']}),
  squat: () => ({pose:Object.assign({}, ARMS_CROSS, {thigh_l:[-62, 0, -6], thigh_r:[-62, 0, 6], shin_l:[58, 0, 0], shin_r:[58, 0, 0], foot_l:[0, 0, 0], lspine:[18, 0, 0], tspine:[10, 0, 0]}), ground:'feet', work:['thigh_front_l', 'thigh_front_r'], cam:{az:62, el:8, fit:1.05}, arc:{bone:'hips', off:[0, 0, -0.1], rel:'foot_l', from:Object.assign({}, SEAT)}, props:['chairBehind']})
};
const TPIC = {};
function testSide(){
  const pick = ids => { for (const k of ids) { const v = A.areas[k]; if (v === 'l' || v === 'r') return v; } return null; };
  return pick(['s1','l5','l4','thigh_back','buttock','thigh_front','c8','c7','c6','c5','t1','scap','trap','lowback_side']) || 'l';
}
function testPic(id, w, h){
  const mk = TPOSE[id]; if (!mk || !rigReady()) return null;
  const T = G.T, sex = G.sex, side = testSide(), key = [id, sex, side, w].join('|'); if (TPIC[key]) return TPIC[key];
  ensureSnap(T);
  const sp = mk(side), mats = boneMats(T, sex, sp.pose), P = skin(sex, mats);
  const hb = mats[RIG.ix.head];
  const human = buildHuman(T, window.SPG_BODY, sex, G.C, {P, head:hb});
  human.mesh.castShadow = true; human.group.traverse(o => { if (o.isMesh) o.castShadow = true; });
  human.setHL(sp.pain || [], sp.work || []); human.U.uPulse.value = 0.75; human.U.uHlA.value = 0.32;
  // grounding
  const bi = RIG.bi, n = P.length / 3, isB = (v, names) => names.includes(window.SPG_RIG.bones[bi[v*4]][0]);
  let minY = 1e9, seatY = 1e9, backY = 1e9; const bb = new T.Box3();
  for (let v = 0; v < n; v++) { const y = P[v*3+1]; if (y < minY) minY = y; if (isB(v, ['hips','thigh_l','thigh_r']) && y < seatY) seatY = y; }
  let dy = -minY; if (sp.ground === 'bed') dy = 0.46 - minY;
  human.group.position.y = dy;
  const scene = new T.Scene(); scene.environment = G.envSnap;
  const k1 = new T.DirectionalLight(0xffffff, 0.85); k1.position.set(1.4, 3.4, 2.4); k1.castShadow = true; k1.shadow.mapSize.set(1024, 1024);
  Object.assign(k1.shadow.camera, {left:-1.6, right:1.6, top:1.6, bottom:-1.6, near:0.5, far:8}); k1.shadow.bias = -0.0006; k1.shadow.radius = 4; scene.add(k1, k1.target);
  const k2 = new T.DirectionalLight(0xffffff, 0.35); k2.position.set(-2, 2.2, -2.5); scene.add(k2);
  scene.add(human.group);
  for (let v = 0; v < n; v++) bb.expandByPoint(new T.Vector3(P[v*3], P[v*3+1] + dy, P[v*3+2]));
  const mat = c => new T.MeshStandardMaterial({color:c, roughness:0.85, metalness:0});
  const floor = new T.Mesh(new T.PlaneGeometry(8, 8), mat(0xdfe4e8)); floor.rotation.x = -PI / 2; floor.receiveShadow = true; scene.add(floor);
  const box = (sx, sy, sz, x, y, z, c) => { const m = new T.Mesh(new T.BoxGeometry(sx, sy, sz), mat(c)); m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; scene.add(m); return m; };
  const cx = (bb.min.x + bb.max.x) / 2, cz = (bb.min.z + bb.max.z) / 2;
  (sp.props || []).forEach(pr => {
    if (pr === 'bed') { box(0.9, 0.42, 2.1, cx, 0.21, bb.min.z + 0.9, 0xb9c3cc); box(0.92, 0.04, 2.12, cx, 0.44, bb.min.z + 0.9, 0xf3f5f7); }
    if (pr === 'chair' || pr === 'chairBehind') {
      const hz = bonePt(T, sex, mats, 'hips').z, sy = (pr === 'chair' ? seatY + dy : 0.47), zc = pr === 'chair' ? hz + 0.02 : hz - 0.28;
      box(0.46, 0.05, 0.44, cx, sy - 0.025, zc, 0x8a6a4f); [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([a, b]) => box(0.035, sy - 0.05, 0.035, cx + a * 0.2, (sy - 0.05) / 2, zc + b * 0.19, 0x6e5440));
      if (!sp.stool) box(0.46, 0.42, 0.04, cx, sy + 0.21, zc - 0.21, 0x8a6a4f);
    }
    if (pr === 'wallFront') { const hz = Math.max(bonePt(T, sex, mats, 'f33_l').z, bonePt(T, sex, mats, 'f33_r').z) + 0.012; box(2.6, 2.4, 0.14, cx, 1.2, hz + 0.07, 0xeae6df); }
    if (pr === 'wallBack') { const wm = mat(0xeae6df); wm.side = T.DoubleSide; const wl = new T.Mesh(new T.PlaneGeometry(4, 3), wm); wl.position.set(cx, 1.5, bb.min.z - 0.004); wl.receiveShadow = true; scene.add(wl); }
    if (pr === 'line') box(0.03, 0.002, 2.4, (bonePt(T, sex, mats, 'foot_l').x + bonePt(T, sex, mats, 'foot_r').x) / 2, 0.001, cz, 0x2c3a46);
  });
  // camera
  const c = sp.cam, az = c.az * PI / 180, el = c.el * PI / 180, fov = 30;
  let tgt, d;
  if (c.focus === 'hands') { tgt = bonePt(T, sex, mats, 'hand_l').add(bonePt(T, sex, mats, 'hand_r')).multiplyScalar(0.5); tgt.y += dy + (c.dy || 0); d = c.d; }
  else { tgt = bb.getCenter(new T.Vector3()); const sz = bb.getSize(new T.Vector3()); const r = Math.max(sz.y, Math.hypot(sz.x, sz.z) * 0.9) * 0.5 * (c.fit || 1); d = r / Math.tan(fov * PI / 360) * 1.08 / (c.zoom || 1); tgt.y += (c.dy || 0); }
  const cam = new T.PerspectiveCamera(fov, w / h, 0.02, 30); cam.position.set(tgt.x + d * Math.sin(az) * Math.cos(el), tgt.y + d * Math.sin(el), tgt.z + d * Math.cos(az) * Math.cos(el)); cam.lookAt(tgt);
  snapR.shadowMap.enabled = true; snapR.shadowMap.type = T.PCFSoftShadowMap;
  snapR.setSize(w, h, false); snapR.setClearColor(0xeef2f5, 1); snapR.render(scene, cam); snapR.shadowMap.enabled = false;
  // 2D overlay: motion arrows, press points, wall gap
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h; const g = cv.getContext('2d'); g.drawImage(snapC, 0, 0);
  const pr2 = v => { const q = v.clone(); q.y += 0; q.project(cam); return [(q.x + 1) / 2 * w, (1 - q.y) / 2 * h]; };
  const arrow = (pts, col) => { if (pts.length < 2) return; g.save(); g.strokeStyle = col; g.fillStyle = col; g.lineWidth = Math.max(3, w / 140); g.lineCap = 'round'; g.lineJoin = 'round'; g.setLineDash([]); g.beginPath(); pts.forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.stroke();
    const [a, b] = [pts[pts.length - 2], pts[pts.length - 1]], ang = Math.atan2(b[1] - a[1], b[0] - a[0]), L = Math.max(12, w / 28); g.beginPath(); g.moveTo(b[0] + Math.cos(ang) * L * 0.35, b[1] + Math.sin(ang) * L * 0.35); g.lineTo(b[0] - Math.cos(ang - 0.5) * L, b[1] - Math.sin(ang - 0.5) * L); g.lineTo(b[0] - Math.cos(ang + 0.5) * L, b[1] - Math.sin(ang + 0.5) * L); g.closePath(); g.fill(); g.restore(); };
  if (sp.arc) {
    const fromPose = Object.assign({}, sp.pose); Object.keys(sp.arc.from || sp.from || {}).forEach(k => fromPose[k] = (sp.arc.from || sp.from)[k]);
    if (!sp.arc.from && !sp.from) { const b = sp.arc.bone; Object.keys(sp.pose).forEach(k => { if (k[0] !== '$' && (k.endsWith(b.slice(-2)) || k === b)) fromPose[k] = [0, 0, 0]; }); }
    const pts = []; for (let i = 0; i <= 16; i++) { const t = 0.12 + 0.82 * i / 16, pz = {}; Object.keys(sp.pose).forEach(k => { const a = sp.pose[k], f0 = fromPose[k] || a; pz[k] = k[0] === '$' ? a : [f0[0] + (a[0] - f0[0]) * t, f0[1] + (a[1] - f0[1]) * t, f0[2] + (a[2] - f0[2]) * t, a[3]]; }); Object.keys(fromPose).forEach(k => { if (!(k in pz)) pz[k] = fromPose[k].map((x, j) => j < 3 ? x * (1 - t) : x); });
      const m2 = boneMats(T, sex, pz), q = bonePt(T, sex, m2, sp.arc.bone, sp.arc.off); if (sp.arc.rel) q.sub(bonePt(T, sex, m2, sp.arc.rel)).add(bonePt(T, sex, mats, sp.arc.rel)); q.y += dy; pts.push(pr2(q)); }
    arrow(pts, '#0E6A64');
  }
  if (sp.marks) { [0.32, 0.45, 0.58].forEach((f, i) => { const q = bonePt(T, sex, mats, i ? 'tspine' : 'chest'); q.y = bb.min.y + (bb.max.y - bb.min.y) * (0.5 + f * 0.36); q.z = bb.min.z - 0.01; const [x, y] = pr2(q); g.strokeStyle = '#0E6A64'; g.lineWidth = Math.max(3, w / 150); g.beginPath(); g.arc(x, y, w / 30, 0, 2 * PI); g.stroke(); g.beginPath(); g.arc(x, y, w / 90, 0, 2 * PI); g.fillStyle = '#0E6A64'; g.fill(); }); }
  if (sp.lift) {
    const hd = bonePt(T, sex, mats, 'head', [0, 0.145, 0]); hd.y += dy; const up = hd.clone(); up.y += 0.1; arrow([pr2(hd), pr2(up)], '#0E6A64');
    [[0, -0.07, 0.075], [0, 0.0, -0.1]].forEach(o => { const q = bonePt(T, sex, mats, 'head', o); q.y += dy; const [x, y] = pr2(q); g.beginPath(); g.arc(x, y, w / 34, 0, 2 * PI); g.fillStyle = 'rgba(14,106,100,0.28)'; g.fill(); g.lineWidth = Math.max(2, w / 200); g.strokeStyle = '#0E6A64'; g.stroke(); });
  }
  if (sp.gap) { const hd = bonePt(T, sex, mats, 'head', [0, 0.03, -0.1]); hd.y += dy; const wl = hd.clone(); wl.z = bb.min.z; const a = pr2(hd), b = pr2(wl); arrow([[(a[0] + b[0]) / 2, a[1]], b], '#C9461E'); arrow([[(a[0] + b[0]) / 2, a[1]], a], '#C9461E'); }
  // free GPU memory of the temporary scene
  scene.traverse(o => { if (o.geometry) o.geometry.dispose(); if (o.material && o !== human.mesh) (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => m.dispose && m.dispose()); });
  TPIC[key] = cv.toDataURL('image/jpeg', 0.88); return TPIC[key];
}

function testFig(t){
  const sp = TPOSE[t.id](testSide()), dot = (c, l) => `<span class="tpk"><i style="background:${c}"></i>${tx(l)}</span>`;
  return `<figure class="testpic"><img data-test="${t.id}" alt="${esc(tx(t.name))}"><figcaption>${sp.pain ? dot('var(--pain)', U.tpPain) : ''}${sp.work ? dot('var(--accent)', sp.relief ? U.tpRelief : U.tpWork) : ''}${sp.lift ? dot('rgba(14,106,100,0.28)', U.tpHands) : ''}${sp.arc || sp.gap || sp.lift ? dot('transparent', U.tpMove) : ''}</figcaption></figure>`;
}
function fillTestPic(){
  const img = document.querySelector('.testpic img'); if (!img) return;
  const id = img.dataset.test, key = [id, G.sex, testSide(), 480].join('|');
  if (TPIC[key]) { img.src = TPIC[key]; return; }
  img.closest('.testpic').classList.add('loading');
  setTimeout(() => requestAnimationFrame(() => { if (!document.body.contains(img)) return; const u = testPic(id, 480, 560); if (u) { img.src = u; img.closest('.testpic').classList.remove('loading'); } }), 60);
}
/* Reference pictures inside a question: where the area is on the body, and the bones underneath */
const REFPIC = {};
function refPics(ref){
  if (!G.ok) return '';
  return `<div class="refpics" data-ref="${ref}"><figure><img data-k="skin" alt="${esc(tx(U.rpSkin))}"><figcaption>${tx(U.rpSkin)}</figcaption></figure><figure><img data-k="bone" alt="${esc(tx(U.rpBone))}"><figcaption>${tx(U.rpBone)}</figcaption></figure></div>`;
}
function fillRefPics(){
  const box = document.querySelector('.refpics'); if (!box || !G.ok) return;
  const ref = box.dataset.ref; let regs, v;
  if (ref.startsWith('area:')) { const a = AREAS.find(x => x.id === ref.slice(5)); if (!a) return; regs = allRegions(a); v = V[a.view] || V.full; }
  else { regs = M.safetyRegions || []; v = V[M.safetyView] || V.full; }
  const wide = Object.assign({}, v, {d: v.d * 1.15});
  box.querySelectorAll('img').forEach((img, i) => {
    const key = [M.id, ref, G.sex, img.dataset.k].join('|');
    if (REFPIC[key]) { img.src = REFPIC[key]; return; }
    setTimeout(() => requestAnimationFrame(() => {
      if (!document.body.contains(img)) return;
      const bone = img.dataset.k === 'bone';
      const c = snapshot(wide, 320, 380, bone ? {anat:true, cur:regs, hlA:0.42, nerveKeep:(M.GAL && M.GAL.nerves) || null} : {cur:regs});
      if (!c) return; REFPIC[key] = c.toDataURL('image/jpeg', 0.86); img.src = REFPIC[key];
    }), 40 + i * 60);
  });
}
function renderGallery(){
  const el = $('#gal'); if (!el) return;
  if (!G.ok) { el.closest('section').hidden = true; return; }
  const f = G.rca || {}, sd = f.side === 'r' ? 'r' : 'l', les = (f.label && f.label[0]) || (f.discs && f.discs[0]) || null;
  const an = G.anatomy, imgs = [], word = lang === 'hi' ? 'डिस्क' : 'disc';
  const shot = (key, v, w, h, o, cap, wide) => { const c = snapshot(v, w, h, o); if (c) imgs.push({key, url:c.toDataURL('image/jpeg', 0.9), w, h, cap, wide}); };
  const S3 = G.anatomy.S, vo = S3.order, dl = S3.discOrder, GP = Object.assign({d:0.66, ld:0.62, td:0.27, ref:'L3', refDy:-0.02}, M.GAL || {}), set = M.labelSet;
  try {
    an.makeLabels(sd, f.label || [], word, null, set, GP.lscale);
    shot('post', {az: sd === 'r' ? PI + 0.55 : PI - 0.55, el:0.16, d:GP.d, yk: les ? 'disc' : GP.ref, disc:les, dy: les ? 0.03 * GP.d / 0.66 : GP.refDy}, 1000, 760, {anat:true, noBody:true, noPelvis:!GP.pelvis, noLegs:true, noUpper:true, labels:true, fov:30, nerveKeep:GP.nerves, keepRibs:GP.ribs}, les ? U.gPost : U.gRef, true);
    an.makeLabels(sd, f.label || [], word, 'lat', set, GP.lscale);
    if (les) {
      shot('lat', {az: sd === 'r' ? -PI / 2 : PI / 2, el:0.04, d:GP.ld, yk:'disc', disc:les, dy:0.035 * GP.ld / 0.62}, 640, 760, {anat:true, noBody:true, noPelvis:true, noLegs:true, noUpper:true, labels:true, fov:30, nerveKeep:GP.nerves}, U.gLat);
      const di = dl.indexOf(les), up = les.split('–')[0], hide = vo.slice(0, vo.indexOf(up) + 1).concat(dl.slice(0, di));
      shot('top', {az:PI, el:1.42, d:GP.td, yk:'disc', disc:les, dy:0}, 640, 760, {anat:true, noBody:true, noPelvis:true, noLegs:true, noSacrum:true, noUpper:true, labels:false, hide, fov:32, noSac:true, nerveKeep:(GP.nerves || []).filter(n => n !== 'cord')}, fmt(U.gTop, les));
    }
    an.makeLabels(sd, f.label || [], word, null, set, GP.lscale);
    shot('xray', Object.assign({}, V.back, {az: sd === 'r' ? PI + 0.25 : PI - 0.25}), 520, 1000, {anat:true, labels:false, noHL:false, only:yesRegions()}, G.rca ? U.gX : U.gRef);
    shot('back', V.back, 520, 1000, {only:yesRegions()}, U.gBack);
    shot('front', V.front, 520, 1000, {only:yesRegions()}, U.gFront);
  } catch (e) { console.warn(e); }
  G.imgs = imgs;
  el.innerHTML = imgs.map(i => `<figure class="fig g-${i.key}${i.wide ? ' wide' : ''}"><img src="${i.url}" alt="${esc(tx(i.cap))}" width="${i.w}" height="${i.h}" loading="lazy"><figcaption>${esc(tx(i.cap))}</figcaption></figure>`).join('');
}
/* ================= PDF report ================= */
const dlReady = (window.claude && typeof window.claude.use === 'function') ? window.claude.use('downloads').catch(() => null) : Promise.resolve(undefined);
function svgImg(svg){ return new Promise(res => { const im = new Image(); im.onload = () => res(im); im.onerror = () => res(null); im.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg); }); }
const curMod = () => M;
async function buildPDF(){
  if (!window.jspdf || !window.jspdf.jsPDF) throw new Error('nolib');
  try { await Promise.all(['400 22px "IBM Plex Sans"','600 22px "IBM Plex Sans"','400 22px "IBM Plex Sans Devanagari"','700 40px "Source Serif 4"','500 18px "IBM Plex Mono"'].map(f => document.fonts.load(f))); } catch (e) {}
  const R = analyze(A), Lv = LEVELS[R.level], top = R.ranked[0];
  const FB = '"IBM Plex Sans","IBM Plex Sans Devanagari","Noto Sans Devanagari",Arial,sans-serif', FH = '"Source Serif 4","IBM Plex Sans Devanagari",Georgia,serif', FM = '"IBM Plex Mono",monospace';
  const PW = 1240, PH = 1754, M = 84, CW = PW - 2 * M;
  const LV = {red:['#B42318','#FDECEA'], orange:['#A44C00','#FEF0DF'], yellow:['#7A5E00','#FBF3D3'], green:['#1F6B45','#E3F2E9']}[R.level];
  const pages = []; let c, x, y;
  const newPage = () => { c = document.createElement('canvas'); c.width = PW; c.height = PH; x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, PW, PH); x.textBaseline = 'top'; pages.push(c); y = M; };
  const ensure = h => { if (y + h > PH - M - 40) newPage(); };
  const wrap = (t, f, w) => { x.font = f; const ws = String(t).split(/\s+/), ls = []; let l = ''; ws.forEach(wd => { const tt = l ? l + ' ' + wd : wd; if (x.measureText(tt).width > w && l) { ls.push(l); l = wd; } else l = tt; }); if (l) ls.push(l); return ls; };
  const para = (t, o) => { o = o || {}; const f = o.f || `400 22px ${FB}`, lh = o.lh || 33, ind = o.ind || 0; const ls = wrap(t, f, CW - ind); ensure(ls.length * lh); x.font = f; x.fillStyle = o.c || '#1b2630'; ls.forEach(l => { x.fillText(l, M + ind, y); y += lh; }); };
  const head = (t, keep) => { ensure(70 + (keep || 100)); y += 16; x.font = `600 17px ${FM}`; x.fillStyle = '#0E6A64'; x.fillText(t.toUpperCase(), M, y); y += 30; x.fillStyle = '#DCE2E8'; x.fillRect(M, y - 6, CW, 2); y += 8; };
  const kvline = (k, v) => { const kl = wrap(k, `600 19px ${FB}`, 290), ls = wrap(v, `400 21px ${FB}`, CW - 320); const h = Math.max(kl.length * 27, ls.length * 30); ensure(h + 10); x.font = `600 19px ${FB}`; x.fillStyle = '#56636E'; kl.forEach((l, i) => x.fillText(l, M, y + i * 27)); x.font = `400 21px ${FB}`; x.fillStyle = '#1b2630'; ls.forEach((l, i) => x.fillText(l, M + 320, y + i * 30)); y += h + 10; x.fillStyle = '#EDF1F4'; x.fillRect(M, y - 6, CW, 1); };
  const rr = (X, Y, W, H, r) => { x.beginPath(); x.moveTo(X + r, Y); x.arcTo(X + W, Y, X + W, Y + H, r); x.arcTo(X + W, Y + H, X, Y + H, r); x.arcTo(X, Y + H, X, Y, r); x.arcTo(X, Y, X + W, Y, r); x.closePath(); };
  newPage();
  x.font = `500 18px ${FM}`; x.fillStyle = '#0E6A64'; x.fillText((tx(U.brand) + ' · ' + tx(U.notDx)).toUpperCase(), M, y); y += 36;
  x.font = `700 50px ${FH}`; x.fillStyle = '#0F1C26'; x.fillText(tx(U.repT), M, y); y += 66;
  para(tx(U.created) + ': ' + new Date().toLocaleString(lang === 'hi' ? 'hi-IN' : 'en-IN', {dateStyle:'medium', timeStyle:'short'}), {c:'#56636E', f:`400 21px ${FB}`}); y += 4;
  para(tx(U.disc), {c:'#56636E', f:`400 18px ${FB}`, lh:26}); y += 14;
  // urgency box
  const tl = wrap(tx(Lv.title), `700 30px ${FB}`, CW - 60), al = wrap(tx(Lv.act), `400 22px ${FB}`, CW - 60), rl = R.reasons.map(r => wrap('• ' + tx(r), `400 21px ${FB}`, CW - 60));
  const bh = 34 + tl.length * 40 + 8 + al.length * 31 + 10 + rl.reduce((s, l) => s + l.length * 30, 0) + 26;
  ensure(bh); x.fillStyle = LV[1]; rr(M, y, CW, bh, 14); x.fill(); x.fillStyle = LV[0]; x.fillRect(M, y + 16, 7, bh - 32);
  let yy = y + 28; x.font = `700 30px ${FB}`; x.fillStyle = LV[0]; tl.forEach(l => { x.fillText(l, M + 30, yy); yy += 40; }); yy += 4;
  x.font = `400 22px ${FB}`; x.fillStyle = '#1b2630'; al.forEach(l => { x.fillText(l, M + 30, yy); yy += 31; }); yy += 8;
  x.font = `400 21px ${FB}`; rl.forEach(ls => ls.forEach(l => { x.fillText(l, M + 30, yy); yy += 30; })); y += bh + 16;
  // impression
  head(tx(U.imp));
  R.emerg.forEach(e => { para(tx(EMERG[e].name), {f:`700 24px ${FB}`}); para(tx(EMERG[e].what), {c:'#3b4a55'}); y += 8; });
  if (top) {
    para(tx(U.primary) + ': ' + tx(top.c.name) + '  [' + tx(U[top.strength]) + ']', {f:`700 24px ${FB}`, lh:34});
    para(top.c.sci, {f:`400 18px ${FM}`, c:'#56636E', lh:28});
    para(tx(U.sup) + ': ' + top.pros.slice(0, 7).map(p => lab(p[0])).join(' · '), {c:'#1b2630'});
    if (top.cons.length) para(tx(U.ag) + ': ' + top.cons.slice(0, 4).map(p => lab(p[0])).join(' · '), {c:'#56636E'});
    y += 6; para(tx(top.c.what), {c:'#3b4a55'});
    const wl = top.pros.filter(p => FX[p[0]]).slice(0, 7);
    if (wl.length) { y += 6; para(tx(U.whyT), {f:`700 21px ${FB}`}); wl.forEach(p => para('• ' + lab(p[0]) + ' — ' + tx(FX[p[0]]), {c:'#1b2630', ind:10})); }
    y += 6; para(tx(U.causesT) + ': ' + tx(top.c.causes), {c:'#3b4a55'}); para(tx(U.confirm) + ': ' + tx(top.c.confirm), {c:'#3b4a55'}); para(tx(U.treatT) + ': ' + tx(top.c.treat), {c:'#3b4a55'}); para(tx(U.outlook) + ': ' + tx(top.c.outlook), {c:'#3b4a55'});
  }
  head(tx(U.mustT)); U.must.forEach(m => para('• ' + tx(m), {c:'#1b2630', ind:10}));
  if (G.ok) {
    if (!G.imgs) renderGallery();
    const IM = {}; for (const i of (G.imgs || [])) IM[i.key] = Object.assign({}, i, {img: await new Promise(r => { const im = new Image(); im.onload = () => r(im); im.onerror = () => r(null); im.src = i.url; })});
    const pic = (k, X, W) => { const i = IM[k]; if (!i || !i.img) return 0; const H = W * i.h / i.w; x.save(); rr(X, y, W, H, 10); x.clip(); x.drawImage(i.img, X, y, W, H); x.restore(); return H; };
    const capt = (k, X, W, Y) => { const i = IM[k]; if (!i) return 0; const ls = wrap(tx(i.cap), `400 16px ${FB}`, W); x.font = `400 16px ${FB}`; x.fillStyle = '#56636E'; ls.forEach((l, j) => x.fillText(l, X, Y + j * 22)); return ls.length * 22; };
    if (IM.post) { head(tx(U.galT), CW * 0.76 + 60); const h = pic('post', M, CW); const c = capt('post', M, CW, y + h + 8); y += h + c + 18; }
    if (IM.lat && IM.top) { const W2 = (CW - 24) / 2, H2 = W2 * IM.lat.h / IM.lat.w; ensure(H2 + 80); pic('lat', M, W2); pic('top', M + W2 + 24, W2); const c1 = capt('lat', M, W2, y + H2 + 8), c2 = capt('top', M + W2 + 24, W2, y + H2 + 8); y += H2 + Math.max(c1, c2) + 18; }
    const W3 = (CW - 48) / 3, H3 = W3 * 1000 / 520; ensure(H3 + 80); let cm = 0;
    ['xray','back','front'].forEach((k, i) => { const X = M + i * (W3 + 24); pic(k, X, W3); cm = Math.max(cm, capt(k, X, W3, y + H3 + 8)); });
    y += H3 + cm + 18;
  }
  // root cause diagrams
  if (rcaApplies(R)) {
    const d = discInfo(R), dd = Object.assign({}, d, {side: R.sides.size === 1 ? [...R.sides][0] : 'b'});
    head(tx(U.rca), 460);
    rcaText(R).forEach(p => { para(p.replace(/<[^>]+>/g, '').replace(/\[\d+\]/g, ''), {c:'#3b4a55'}); y += 6; });
    const im2 = await svgImg(axialSVG(dd, PAL_PDF)), im3 = await svgImg(typesSVG(PAL_PDF));
    const fw = 760, fx = M + (CW - fw) / 2;
    const cap = t => { para(t, {f:`400 18px ${FB}`, lh:26, c:'#56636E'}); y += 8; };
    ensure(fw * 380 / 540 + 60); try { if (im2) x.drawImage(im2, fx, y, fw, fw * 380 / 540); } catch (e) {} y += fw * 380 / 540 + 10; cap(tx(U.ax));
    const h3 = CW * 150 / 440; ensure(h3 + 20); try { if (im3) x.drawImage(im3, M, y, CW, h3); } catch (e) {} y += h3 + 12;
    head(tx(U.nerveT), 200);
    d.roots.forEach(k => { const r = ROOTS[k]; if (!r) return; para(k + ' — ' + tx(U.thSkin) + ': ' + tx(r.skin) + '. ' + tx(U.thMus) + ': ' + tx(r.mus) + '. ' + tx(U.thRef) + ': ' + tx(r.ref) + '. ' + tx(U.thDisc) + ': ' + r.disc + '.', {c:'#1b2630'}); y += 6; });
  }
  // differential
  const others = R.ranked.filter(r => r !== top).slice(0, 5);
  if (others.length) { head(tx(U.diff)); others.forEach(r => para('• ' + tx(r.c.name) + ' [' + tx(U[r.strength]) + '] — ' + r.pros.slice(0, 3).map(p => lab(p[0])).join(', '), {c:'#1b2630'})); }
  // specialists
  head(tx(U.docs));
  R.depts.forEach((d, i) => { const D = DEPTS[d.id]; para((i + 1) + '. ' + tx(D.n) + (i === 0 ? '  (' + tx(U.startHere) + ')' : ''), {f:`700 22px ${FB}`}); para(tx(D.s) + (d.why.length ? ' ' + tx(U.forL) + ': ' + d.why.map(w => tx(w)).join(', ') + '.' : ''), {c:'#3b4a55', ind:28}); y += 4; });
  // answers
  head(tx(U.ansT));
  const ml = []; AREAS.forEach(a => { const v = A.areas[a.id]; if (v && v !== 'no') ml.push(tx(a.name) + (a.pair ? ' (' + tx(v === 'both' ? U.sideB : v === 'l' ? U.sideL : U.sideR) + ')' : '') + (a.code ? ' [' + a.code + ']' : '')); });
  kvline(tx(U.age), [optLab(A.age), optLab(A.sex)].filter(Boolean).join(' · ') || tx(U.notA));
  kvline(tx(U.hist), A.risks.map(optLab).join('; ') || tx(U.none));
  kvline(tx(U.marked), ml.join('; ') || tx(U.none));
  if (A.dom) kvline(tx(U.domT), optLab(A.dom));
  kvline(tx(U.onT), optLab(A.onset) || tx(U.notA));
  kvline(tx(U.timeT), [optLab(A.since), optLab(A.hx), optLab(A.btw), optLab(A.trend)].filter(Boolean).join(' · ') || tx(U.notA));
  kvline(tx(U.patT), A.pat.map(optLab).join('; ') || tx(U.none));
  kvline(tx(U.funT), `${tx(U.pain)} ${A.pain}/10` + curMod().FUNCS.map(f => ` · ${tx(U[f.label] || f.label)}: ${optLab(A[f.id]) || '—'}`).join(''));
  TESTS.forEach(t => { const v = A[t.id]; const o = t.ans.find(a => a[0] === v); kvline(tx(t.name), o ? tx(U[o[1]]) : tx(U.notA)); });
  const rfy = RFS.filter(r => A.rf[r[0]] === 'yes');
  kvline(tx(U.safT), rfy.length ? rfy.map(r => tx(r[1])).join('; ') : tx(U.rfNone));
  head(tx(U.srcT));
  SRC.forEach((s, i) => para((i + 1) + '. ' + s[1] + ' — ' + s[2], {f:`400 17px ${FB}`, lh:25, c:'#56636E'}));
  pages.forEach((p, i) => { const g = p.getContext('2d'); g.textBaseline = 'top'; g.font = `500 16px ${FM}`; g.fillStyle = '#8794A0'; g.fillText(tx(U.brand) + ' · ' + tx(U.notDx), M, PH - M + 12); const t = tx(U.page) + ' ' + (i + 1) + ' / ' + pages.length; g.fillText(t, PW - M - g.measureText(t).width, PH - M + 12); });
  const pdf = new window.jspdf.jsPDF({unit:'pt', format:'a4', compress:true});
  pages.forEach((p, i) => { if (i) pdf.addPage(); pdf.addImage(p.toDataURL('image/jpeg', 0.9), 'JPEG', 0, 0, 595.28, 841.89); });
  return pdf.output('blob');
}
async function download(){
  const btn = $('#dlBtn'), st = $('#dlStatus'); btn.disabled = true; st.textContent = tx(U.prep);
  let blob; try { await new Promise(r => setTimeout(r, 30)); blob = await getPDF(); } catch (e) { console.error("pdf", e && e.stack); st.textContent = tx(U.dlFail); btn.disabled = false; return; }
  const name = pdfName();
  const dl = await dlReady;
  if (dl) { try { await dl.save({filename:name, data:blob}); st.textContent = tx(U.saved); } catch (err) { const c = err && err.code; st.textContent = c === 'declined' ? tx(U.declined) : c === 'rate_limited' ? tx(U.busy) : tx(U.dlNA); } }
  else if (dl === null) st.textContent = tx(U.dlNA);
  else { const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 5000); st.textContent = tx(U.saved); }
  btn.disabled = false;
}

/* ================= events ================= */
const toggle = (arr, v) => { const i = arr.indexOf(v); if (i >= 0) arr.splice(i, 1); else arr.push(v); };
document.addEventListener('click', e => {
  const cl = e.target.closest('a[href^="#src-"]'); if (cl) { const dd = $('#srcDetails'); if (dd) dd.open = true; if (cl.closest('#glossPanel')) closeTerm(); return; }
  const t = e.target.closest('[data-act]'); if (!t || t.disabled) return;
  const act = t.dataset.act, v = t.dataset.v;
  const rerender = () => { const y0 = window.scrollY; render(false); window.scrollTo(0, y0); };
  switch (act) {
    case 'lang': lang = v; try { localStorage.setItem('spg-lang', v); } catch (err) {} rerender(); return;
    case 'home': A = fresh(); useSex('m'); S.view = 'start'; S.idx = 0; G.rca = null; applyRCA(); setAnat(false); aim(V.full); G.spin = true; render(true); window.scrollTo(0, 0); return;
    case 'begin': A = fresh(); goto(0); return;
    case 'pickMod': useModule(v); A = fresh(); G.rca = null; if (G.ok) { applyRCA(); G.hlKey = ''; } goto(0); return;
    case 'resume': resume(); return;
    case 'resNo': try { localStorage.removeItem(SAVEK); } catch (err) {} rerender(); return;
    case 'term': openTerm(v); return;
    case 'glClose': closeTerm(); return;
    case 'say': say(v); return;
    case 'big': big = !big; document.documentElement.classList.toggle('big', big); try { localStorage.setItem('spg-big', big ? '1' : '0'); } catch (err) {} t.setAttribute('aria-pressed', big); return;
    case 'share': shareReport(); return;
    case 'install': installApp(); return;
    case 'instClose': $('#installPanel').hidden = true; return;
    case 'zoom': zoomBtn(v); return;
    case 'rot': G.spin = false; G.tgt.az += (v === 'l' ? 1 : -1) * PI / 6; return;
    case 'reset3d': G.spin = false; aim(Object.assign({}, V.full, {az: Math.cos(G.tgt.az) < 0 ? PI : 0})); return;
    case 'view': G.spin = false; if (v === 'spine') { setAnat(true); aim(spineView()); } else aim(Object.assign({}, V.full, {az: v === 'back' ? PI : 0})); return;
    case 'anat': setAnat(v === '1'); if (v === '1') { G.spin = false; aim(Object.assign({}, V.full, {az:PI - 0.35})); } return;
    case 'age': A.age = v; rerender(); return;
    case 'sex': A.sex = v; useSex(sexCode()); rerender(); return;
    case 'ep': A.ep = v; rerender(); return;
    case 'risk': toggle(A.risks, v); rerender(); return;
    case 'area': A.areas[STEPS[S.idx].a.id] = v; next(); return;
    case 'dom': A.dom = v; next(); return;
    case 'onset': A.onset = v; rerender(); return;
    case 'since': A.since = v; rerender(); return;
    case 'trend': A.trend = v; rerender(); return;
    case 'hx': A.hx = v; if (v === 'h_first') A.btw = ''; rerender(); return;
    case 'btw': A.btw = v; rerender(); return;
    case 'pat': toggle(A.pat, v); rerender(); return;
    case 'fn': A[t.dataset.k] = v; rerender(); return;
    case 'pickLang': lang = v; langChosen = true; try { localStorage.setItem('spg-lang', v); } catch (err) {} S.view = 'start'; render(true); return;
    case 'test': A[STEPS[S.idx].t.id] = v; next(); return;
    case 'rf': A.rf[t.dataset.k] = v; rerender(); return;
    case 'next': next(); return;
    case 'prev': prev(); return;
    case 'edit': goto(0); return;
    case 'download': download(); return;
  }
});
document.addEventListener('change', e => { if (e.target.id === 'problem') { useModule(e.target.value); A = fresh(); G.rca = null; if (G.ok) { applyRCA(); G.hlKey = ''; } render(false); } });
document.addEventListener('input', e => { if (e.target.id === 'pain') { A.pain = +e.target.value; const o = $('#painOut'); if (o) o.textContent = A.pain; } });

window.SPG_TEST = {term: id => openTerm(id), glIds: () => GL.map(g => g.id), glPic: id => { Object.keys(GLPIC).forEach(k => delete GLPIC[k]); return glPic(GLI[id]); }, summary: () => shareText(), tpic: (id, w, h) => { const k = Object.keys(TPIC); k.forEach(x => delete TPIC[x]); return testPic(id, w || 480, h || 560); }, tposes: () => Object.keys(TPOSE), cam: () => Object.assign({}, G.tgt), steps: () => STEPS.map(x => x.k + (x.a ? ':' + x.a.id : '')), set: o => { Object.assign(A, o); render(false); }, mod: id => useModule(id), step: (i, mod, sex) => { if (mod) useModule(mod); if (sex) { A.sex = sex; useSex(sexCode()); } goto(i); }, kb: () => JSON.parse(JSON.stringify({sources:SRC, areas:AREAS.map(a => ({id:a.id, paired:a.pair, dermatome:a.code || null, name:a.name, description:a.desc, relevance:a.rel})), ages:AGES, sexes:SEXES, episodes:EPIS, history:RISKS, onsets:ONSETS, duration:SINCE, trend:TRENDS, dominance:DOMS, pattern:PAT, walking:WALKS, sitting:SITS, sleep:SLEEPS, redFlags:RFS, bedsideTests:TESTS, conditions:CONDS, emergencies:EMERG, departments:DEPTS, nerveRoots:ROOTS, stats:STATS, urgencyLevels:LEVELS, urgencyReasons:RS, featureExplanations:FX, featureLabels:LBL})), load: (a, lg, mod) => { if (lg) lang = lg; if (mod) useModule(mod); A = Object.assign(fresh(), a); useSex(sexCode()); showResult(); }, gal: () => (G.imgs || []).length, analyze: (a, mod) => { if (mod && (!M || M.id !== mod)) useModule(mod); const r = analyze(Object.assign(fresh(), a)); return {level:r.level, top:r.ranked.slice(0, 3).map(x => x.c.id + ':' + x.strength + ':' + x.s), roots:r.roots, sides:[...r.sides], depts:r.depts.map(d => d.id), emerg:r.emerg}; }};
useModule(MODS[0].id);
if (!langChosen) S.view = 'lang';
/* ================= install as an app (web app manifest + offline worker) ================= */
const PWA = {prompt:null, hosted:false,
  standalone: (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true,
  ios: /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1),
  mobile: /android|iphone|ipad|ipod|mobile/i.test(navigator.userAgent)};
PWA.can = () => !PWA.standalone && (!!PWA.prompt || PWA.hosted);
function updInstall(){ const b = $('#installBtn'); if (b) { b.hidden = !PWA.can(); $('#installTxt').textContent = tx(U.inst); } const c = $('#appCard'); if (c) c.hidden = !PWA.can(); }
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); PWA.prompt = e; updInstall(); });
window.addEventListener('appinstalled', () => { PWA.prompt = null; PWA.standalone = true; updInstall(); });
if (/^https?:$/.test(location.protocol) && window.top === window && !PWA.standalone) {
  fetch('manifest.webmanifest', {cache:'no-store'}).then(r => { if (r.ok) { PWA.hosted = true; updInstall(); } }).catch(() => {});
}
if (/^https?:$/.test(location.protocol) && window.top === window && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}
const ICO = {
  share:'<span class="ico"><svg viewBox="0 0 20 20"><path d="M10 13V2.5M6.5 6 10 2.5 13.5 6"/><path d="M6 9H4.5v8.5h11V9H14"/></svg></span>',
  add:'<span class="ico"><svg viewBox="0 0 20 20"><rect x="3" y="3" width="14" height="14" rx="3"/><path d="M10 6.5v7M6.5 10h7"/></svg></span>',
  menu:'<span class="ico"><svg viewBox="0 0 20 20"><circle cx="10" cy="4.5" r="1.2"/><circle cx="10" cy="10" r="1.2"/><circle cx="10" cy="15.5" r="1.2"/></svg></span>'};
function installApp(){
  if (PWA.prompt) { const p = PWA.prompt; p.prompt(); p.userChoice.then(c => { if (c && c.outcome === 'accepted') { PWA.prompt = null; PWA.standalone = true; } updInstall(); }).catch(() => {}); return; }
  const steps = PWA.ios ? U.instIos : PWA.mobile ? U.instAnd : U.instDesk;
  const fill = t => esc(tx(t)).replace(/\{(share|add|menu)\}/g, (m, k) => ICO[k]);
  $('#installCard').innerHTML = `<p class="kicker">${tx(U.brand)}</p><h2 id="ipT" style="margin-top:6px">${tx(U.instT)}</h2><p class="muted small" style="margin-top:6px">${tx(U.instS)}</p><ol>${steps.map(t => `<li>${fill(t)}</li>`).join('')}</ol><button class="btn primary block" data-act="instClose">${tx(U.instClose)}</button>`;
  $('#installPanel').hidden = false; const b = $('#installCard .btn'); if (b) b.focus();
}
{ const gp = $('#glossPanel'); if (gp) { gp.addEventListener('click', e => { if (e.target === gp) closeTerm(); }); document.addEventListener('keydown', e => { if (e.key === 'Escape') closeTerm(); }); } }
{ const ip = $('#installPanel'); if (ip) { ip.addEventListener('click', e => { if (e.target === ip) ip.hidden = true; }); document.addEventListener('keydown', e => { if (e.key === 'Escape') ip.hidden = true; }); } }
const has3D = () => !!(window.THREE && window.SPG_BODY && window.SPG_SPINE);
const late3D = !has3D();
G.ok = initGL();
if (G.ok) aim(V.full);
render(false);
if (late3D) {
  // Some hosts finish loading the large 3D files after this script has run: start the 3D view as soon as they arrive.
  let tries = 0;
  const retry = () => {
    if (G.ok) return true;
    if (!has3D()) return false;
    G.ok = initGL();
    if (G.ok) { $('#nogl').hidden = true; $('#hint').hidden = false; aim(V.full); const y0 = window.scrollY; render(false); window.scrollTo(0, y0); }
    return true;
  };
  window.addEventListener('load', retry);
  const iv = setInterval(() => { if (retry() || ++tries > 240) clearInterval(iv); }, 250);
}
})();
