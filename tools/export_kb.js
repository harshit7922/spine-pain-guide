// Exports every research table the site uses (all modules, English + Hindi) to one JSON file.
// The site itself reads the same data/*.js files, so this export is always in step with what the site calculates.
// Usage:  node tools/export_kb.js  [output.json]
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');
const ctx = { window: {}, Math, console };
ctx.window.window = ctx.window; ctx.SPG = ctx.window.SPG = { data: { modules: {} } };
vm.createContext(ctx);
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const files = [...html.matchAll(/<script src="(data\/(?!body3d|spine3d)[^"]+\.js)"/g)].map(m => m[1]);
const modSrc = {};
for (const f of files) {
  const d0 = ctx.window.SPG.data, n0 = d0.common ? d0.common.SRC.length : 0, k0 = Object.keys(d0.modules);
  vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx, { filename: f });
  const d1 = ctx.window.SPG.data; Object.keys(d1.modules).filter(k => !k0.includes(k)).forEach(k => modSrc[k] = d1.common.SRC.slice(n0).map(s => s[0]));
}
const S = ctx.window.SPG.data, C = S.common;
const mods = Object.values(S.modules).sort((a, b) => a.order - b.order);
const plain = o => o === undefined ? null : JSON.parse(JSON.stringify(o));
const opts = arr => (arr || []).map(o => ({ id: o[0], label: o[1] }));

function labelsFor(M) {
  const L = {};
  [C.AGES, C.SEXES, C.EPIS, C.RISKS, M.ONSETS || C.ONSETS, C.SINCE, C.HX || [], C.BTW || [], C.TRENDS, M.DOMS || [], M.PAT.char, M.PAT.worse, M.PAT.better, M.PAT.other, M.RFS].forEach(a => a.forEach(o => L[o[0]] = o[1]));
  M.FUNCS.forEach(f => f.opts.forEach(o => L[o[0]] = o[1]));
  M.AREAS.forEach(a => { L[a.id] = a.name; if (a.pair) { L[a.id + '_l'] = { en: a.name.en + ' (left)', hi: a.name.hi + ' (बायां)' }; L[a.id + '_r'] = { en: a.name.en + ' (right)', hi: a.name.hi + ' (दायां)' }; } });
  const UU = Object.assign({}, C.U, M.UI || {});
  (M.TESTS || []).forEach(t => t.ans.forEach(o => { const r = UU[o[1]] || {}; L[o[0]] = { en: t.name.en + ': ' + (r.en || '').toLowerCase(), hi: t.name.hi + ': ' + (r.hi || '') }; }));
  Object.assign(L, { age_lt40: { en: 'Age under 40', hi: '40 से कम उम्र' }, age_ge50: { en: 'Age 50 or over', hi: '50 या ज़्यादा उम्र' } }, C.LBLX || {}, M.LBLX || {});
  return L;
}

const out = {
  meta: {
    title: 'Spine Pain Guide – clinical knowledge base (all spine regions)',
    version: 'v5.8', exported: new Date().toISOString().slice(0, 10), languages: ['en', 'hi'],
    disclaimer: 'Decision support for self-assessment, not a diagnosis. Every result recommends consultation with a doctor.',
    howScoringWorks: [
      'Each answer becomes a feature (for example "slr_pos" or "neck"). Some features are derived from others (DERIVED rules, e.g. "radicular").',
      'Each condition has evidence weights per feature. Score = sum of the weights of the features present (negative weights count against).',
      'Strength: score ≥ th[0] → Strong; ≥ th[1] → Moderate; ≥ th[2] → Possible. If no anchor feature is present the strength is capped at Possible.',
      'Rare, serious conditions are shown as "Rule out" instead of a strength. "onlyIf" limits a condition to a group (e.g. age 50+).',
      'Urgency: red (emergency) if any EMERG_WHEN rule is met; else orange (24–48 h) / yellow (within a week) rules; else green (doctor within 2 weeks). Every result recommends a doctor.',
      'Rule language: "feature" | {any:[…]} | {all:[…]} | {not:x} | {painGte:n} | {atLeast:[n,[…]]}.'
    ],
    sourceFiles: files
  },
  common: {
    sources: C.SRC.map(s => ({ key: s[0], title: s[1], url: s[2] })),
    glossary: (S.glossary || []).map(g => ({ id: g.id, terms: g.terms, title: g.title, plain: g.plain, sources: g.src || [], picture: g.pic ? g.pic.k : null })),
    levels: plain(C.LEVELS), urgencyReasons: plain(C.RS), departments: plain(C.DEPTS), statistics: plain(C.STATS),
    questions: { age: opts(C.AGES), sex: opts(C.SEXES), episode: opts(C.EPIS), history: opts(C.RISKS), onset: opts(C.ONSETS), thisBoutStarted: opts(C.SINCE), firstEverStarted: opts(C.HX), betweenBouts: opts(C.BTW), trend: opts(C.TRENDS) }
  },
  modules: mods.map(M => {
    const LB = labelsFor(M);
    return {
      id: M.id, order: M.order, title: plain(M.UI && M.UI.repT), tag: plain(M.UI && M.UI.modTag),
      sourcesAddedByModule: modSrc[M.id] || [],
      conditions: M.CONDS.map(c => ({
        id: c.id, name: plain(c.name), scientific: c.sci, what: plain(c.what), causes: plain(c.causes), confirm: plain(c.confirm), treat: plain(c.treat), outlook: plain(c.outlook),
        thresholds: c.th, anchors: c.anchor || [], rare: !!c.rare, onlyIf: plain(c.onlyIf || null), departments: c.depts, outlookSource: c.oSrc || null,
        weights: Object.entries(c.w).map(([f, w]) => ({ feature: f, label: plain(LB[f] || null), weight: w }))
      })),
      emergencies: Object.entries(M.EMERG).map(([id, e]) => ({ id, name: plain(e.name), scientific: e.sci, what: plain(e.what), when: plain(M.EMERG_WHEN[id] || null) })),
      urgency: Object.fromEntries(Object.entries(M.URGENCY).map(([lv, arr]) => [lv, arr.map(u => ({ reason: u.r, text: plain((M.RS || {})[u.r] || C.RS[u.r] || null), when: plain(u.when) }))])),
      redFlags: opts(M.RFS),
      areas: M.AREAS.map(a => ({ id: a.id, name: plain(a.name), paired: !!a.pair, code: a.code || null, view: a.view || null })),
      derived: plain(M.DERIVED || []),
      patterns: { character: opts(M.PAT.char), worse: opts(M.PAT.worse), better: opts(M.PAT.better), other: opts(M.PAT.other) },
      mainComplaint: opts(M.DOMS),
      functionQuestions: M.FUNCS.map(f => ({ id: f.id, options: opts(f.opts) })),
      bedsideTests: (M.TESTS || []).map(t => ({ id: t.id, name: plain(t.name), steps: plain(t.steps), positiveMeans: plain(t.pos), accuracy: plain(t.acc), source: t.src, answers: t.ans.map(a => a[0]) })),
      nerveRoots: plain(M.ROOTS || {}), rootRules: plain(M.ROOT_RULES || []), discOfRoot: plain(M.DISC_OF || {}),
      departmentRules: plain(M.DEPT_RULES || []), extraDepartments: plain(M.DEPTS_ADD || null),
      featureLabels: plain(LB)
    };
  })
};
const dest = process.argv[2] || path.join(ROOT, 'research', 'spine-knowledge-base.json');
fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.writeFileSync(dest, JSON.stringify(out, null, 2));
console.log('wrote', dest, '·', out.modules.map(m => `${m.id}: ${m.conditions.length} conditions`).join(', '));
