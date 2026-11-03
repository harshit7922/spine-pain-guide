# Spine Pain Guide · रीढ़ दर्द गाइड

**Live:** https://harshit7922.github.io/spine-pain-guide/ — open it on a phone and tap **Install app** to add it to the home screen (works offline).

A self-assessment tool for spine pain in English and Hindi. It asks where it hurts, how it started and how it behaves, runs a few safe bedside tests, checks warning signs, then shows the likely causes, how urgent it is, which specialist to see, realistic 3D pictures of the spine and nerves involved, and a PDF report for the doctor.

**It is decision support, not a diagnosis. Every result tells the person to see a doctor.**

## Open it

Online: the link above. As an app: tap **Install app** (Android/Chrome installs directly; on iPhone use Safari → Share → Add to Home Screen). Offline on a computer:


Double-click `index.html`. Everything runs from this folder with no internet:
3D library (`lib/three.min.js`), PDF library (`lib/jspdf.umd.min.js`), research data (`data/`) and the app (`js/app.js`).
With internet the page uses IBM Plex / Source Serif fonts; offline it falls back to system fonts.

On first open it asks for the language (English / हिंदी). The choice is remembered and can be switched at any time from the top bar.

## The four parts of the spine it covers

| Choice on the start page | Data file | Conditions | Emergencies checked |
|---|---|---|---|
| Lower back, buttock or leg | `data/lumbar.js` | 19 | cauda equina, cord, trauma, aortic aneurysm |
| Neck, shoulder blade or arm | `data/cervical.js` | 12 | cord compression, trauma, meningitis, stroke, heart attack |
| Upper or mid back, ribs or chest wall | `data/thoracic.js` | 13 | heart attack, aortic dissection, lung clot, trauma, cord |
| More than one part / whole spine | `data/whole.js` | 10 | cauda equina, cord, heart attack, trauma |

## Where the research lives (and how the calculation reads it)

The app has **no medical knowledge inside the code**. `js/app.js` is a generic engine; all research is in the data files, in both languages:

- `data/common.js` — sources list, all interface text, shared questions (age, sex, history, onset, duration), urgency levels, departments, statistics.
- `data/<module>.js` — for one spine region: body areas, symptom patterns, red-flag questions, bedside tests with accuracy figures, conditions with evidence weights, urgency rules, nerve-root rules, explanations (what it is, causes, how doctors confirm it, treatment, outlook).

How a result is calculated:
1. Every answer becomes a *feature* (e.g. `slr_pos`, `neck`, `ch_stiff_am`). Some features are derived (e.g. `radicular`).
2. Each condition adds up its weights for the features present → score.
3. Score ≥ thresholds `th:[strong, moderate, possible]` gives the strength. No anchor feature → capped at "possible". Rare serious conditions show as "rule out".
4. Urgency is separate: red (emergency now) → orange (24–48 h) → yellow (within a week) → green (doctor within 2 weeks).
5. Rules use a small language: `'feature'`, `{any:[…]}`, `{all:[…]}`, `{not:x}`, `{painGte:n}`, `{atLeast:[n,[…]]}`.

### To change or add research
1. Edit the data file (for example change a weight in `data/cervical.js`). Keep English and Hindi together: `L('English', 'हिंदी')`.
2. Reload `index.html` — the site uses the new numbers immediately.
3. Run the checks: `node tests/run_scenarios.js` (48 clinical scenarios must still pass).
4. Refresh the readable copies: `node tools/export_kb.js` then `python3 tools/build_xlsx.py`.
5. Rebuild the single-file version: `python3 tools/bundle.py` → `dist/spine-pain-guide.html`. This one file contains everything (use it for hosting or to send to someone); the hosted link is published from it.

### To add a new region (module)
Copy one module file, give it a new `id` and `order`, add it to `index.html` after the other data files, and add test cases in `tests/cases/`. It then appears in the start-page dropdown automatically.

## Folder map

```
index.html            open this
lib/                  three.js r128 (MIT), jsPDF 2.5.1 (MIT)
data/                 research data (edit these) + generated 3D data (body3d.js, spine3d.js)
js/app.js             engine, screens, 3D viewer, PDF report
research/             spine-knowledge-base.json / .xlsx (all modules, EN + HI); personal case files stay out of git
dist/                 spine-pain-guide.html — the whole site in one file; web/index.html — same file, ready to host (see HOSTING.md)
tools/                export_kb.js, build_xlsx.py (rebuild the research copies), bundle.py (single-file version)
tests/                run_scenarios.js + cases/ (lumbar 17, cervical 11, thoracic + whole 14, history 6)
3d-build/             Python scripts that generate the 3D bodies, bones and nerves (build.sh)
```

## 3D models

Male and female bodies come from the MakeHuman CC0 base mesh and targets. Vertebrae C1–coccyx, discs, ribs, pelvis, sternum, shoulder blades, arm and leg bones are modelled with signed-distance functions; the spinal cord, cauda equina, lumbar and cervical nerve roots, brachial plexus, arm nerves, sciatic/femoral nerves and intercostal nerves are tubes routed through the body. For the bedside-test pictures the same bodies are posed with a 52-bone skeleton (`data/rig3d.js`) — lying with a leg raised, seated with the head tilted, hand on head, walking on heels, rising on toes, against a wall, rising from a chair — with props, motion arrows and the area where symptoms appear coloured. `3d-build/build.sh` regenerates `data/body3d.js`, `data/spine3d.js` and `data/rig3d.js`; the poses themselves are listed in `TPOSE` in `js/app.js`.

---

## हिंदी में

यह रीढ़ के दर्द की खुद-जांच का टूल है (अंग्रेज़ी और हिंदी)। यह डायग्नोसिस नहीं है — हर नतीजे में डॉक्टर को दिखाने की सलाह दी जाती है।

- **खोलना:** `index.html` पर डबल-क्लिक करें। इंटरनेट की ज़रूरत नहीं। पूरी साइट एक ही फ़ाइल में चाहिए तो `dist/spine-pain-guide.html` खोलें।
- **चार हिस्से:** कमर/पैर, गर्दन/बांह, ऊपरी-बीच की पीठ/पसलियां, और पूरी पीठ।
- **रिसर्च कहां है:** `data/` फ़ोल्डर की फ़ाइलों में — हर बीमारी, उसके लक्षणों के अंक (weights), खतरे के संकेत, टेस्ट और व्याख्या। ऐप इन्हीं फ़ाइलों से पढ़कर गणना करता है।
- **बदलाव करना:** डेटा फ़ाइल बदलें → `index.html` रीलोड करें → `node tests/run_scenarios.js` चलाएं → `node tools/export_kb.js` और `python3 tools/build_xlsx.py` से Excel/JSON कॉपी अपडेट करें।
- **पढ़ने लायक कॉपी:** `research/spine-knowledge-base.xlsx` में सभी बीमारियां, अंक, खतरे के नियम, नसें, टेस्ट और स्रोत हैं।
