// First-step exercises (Phase 11): reuses scenarios from the other case files and checks which exercises the result shows.
// Exercises appear only for green or yellow results and only for the condition at the top of the list.
const pick = (file, name) => { const c = require('./' + file).find(x => x[0] === name); if (!c) throw new Error('missing scenario ' + name); return c; };
const T = (file, name, check) => { const c = pick(file, name); return [name + ' → exercises', c[1], c[2], check]; };
module.exports = [
  T('knee.js', 'Knee osteoarthritis (woman, 58)', "r=>r.ex.join()==='walk,sitstand,slr'"),
  T('knee.js', 'Kneecap pain (teenage girl)', "r=>r.ex.join()==='sitstand,hipabd'"),
  T('hip.js', 'Hip osteoarthritis (man, 64)', "r=>r.ex.join()==='walk,sitstand'"),
  T('hip.js', 'Outer hip pain (woman, 52)', "r=>r.ex.join()==='gtpsedu'"),
  T('hip.js', 'Hamstring strain (sprinter)', "r=>r.ex.join()==='extender'"),
  T('foot.js', 'Plantar fasciitis (teacher, 45)', "r=>r.ex.join()==='calfstretch'"),
  T('foot.js', 'Achilles tendinopathy (runner)', "r=>r.ex.join()==='heelraise'"),
  T('foot.js', 'Ankle sprain', "r=>r.ex.join()==='balance'"),
  T('shoulder.js', 'Frozen shoulder (diabetic woman)', "r=>r.ex.join()==='pendulum'"),
  T('shoulder.js', 'Rotator cuff pain (painter)', "r=>r.ex.join()==='ser'"),
  T('hand.js', 'Tennis elbow (carpenter, 46)', "r=>r.ex.join()==='wristext'"),
  T('cervical.js', 'Text neck strain', "r=>r.ex.join()==='neckturn'"),
  T('cervical.js', 'Whiplash', "r=>r.ex.join()==='neckturn'"),
  T('head.js', 'Headache from the neck', "r=>r.ex.join()==='chintuck'"),
  T('lumbar.js', 'Acute strain', "r=>r.ex.join()==='walk'"),
  T('thoracic_whole.js', 'Fibromyalgia', "r=>r.ex.join()==='walk'"),
  // never shown for orange or red results, or for conditions without a guideline-backed first step
  T('lumbar.js', 'Cauda equina', "r=>r.level==='red'&&!r.ex.length"),
  T('foot.js', 'Achilles rupture is urgent', "r=>!r.ex.length"),
  T('knee.js', 'Hot swollen knee is an emergency', "r=>!r.ex.length"),
  T('head.js', 'Migraine (woman, 28, POUND 5)', "r=>!r.ex.length"),
  T('lumbar.js', 'Kidney stone', "r=>!r.ex.length")
];
