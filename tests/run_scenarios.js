// Runs the clinical scenario checks against the real site engine (no 3D needed).
// Needs Node.js and Playwright:  npm i -D playwright && npx playwright install chromium
// Usage:  node tests/run_scenarios.js            (all case files)
//         node tests/run_scenarios.js cervical   (one file from tests/cases/)
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
const dir = path.join(__dirname, 'cases');
const which = process.argv[2] ? [process.argv[2] + '.js'] : fs.readdirSync(dir).filter(f => f.endsWith('.js'));
(async () => {
  const b = await chromium.launch(); const p = await b.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + path.join(__dirname, '..', 'index.html')); await p.waitForTimeout(800);
  let pass = 0, total = 0;
  for (const f of which) {
    console.log('\n== ' + f);
    for (const [name, mod, a, ok] of require(path.join(dir, f))) {
      const r = await p.evaluate(([a, m]) => window.SPG_TEST.analyze(a, m), [a, mod]);
      const good = eval(ok)(r); total++; if (good) pass++;
      console.log((good ? 'PASS ' : 'FAIL ') + name.padEnd(36), r.level.padEnd(7), r.top.join(' | '), 'roots=' + r.roots.join(','), 'depts=' + r.depts.join(','));
    }
  }
  console.log(`\n${pass}/${total} scenarios passed`, errs.length ? errs : '');
  await b.close(); process.exit(pass === total ? 0 : 1);
})();
