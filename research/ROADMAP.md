# Research and build roadmap (started 4 Nov 2026)

Goal set by the owner: deep, authentic, proven research for every option; reference pictures for every medical term; a friendlier app; and new physiotherapy topics (shoulder incl. frozen shoulder, knee, leg, foot, hip, elbow and hand), each researched in depth and added to the software. Work proceeds one phase at a time; each phase ends with tests passing, the site rebuilt, pushed to GitHub (main + gh-pages) and deployed on Render.

## Evidence rules (apply to every phase)

- Sources, in order of preference: clinical practice guidelines (NICE, ACP, AAOS, JOSPT/APTA CPGs, ACR/EULAR), Cochrane and other systematic reviews, JAMA "Rational Clinical Examination", large cohort or diagnostic-accuracy studies (PubMed), StatPearls (NCBI Bookshelf) for overviews, WHO/ICMR and Indian studies for local prevalence.
- Every number shown to users (accuracy, prevalence, recovery rates) carries its source key.
- Weights: where a published likelihood ratio (LR) exists, weight = round(4 x log10(LR)) points per feature (so LR 10 = +4, LR 3 = +2, LR 0.3 = -2); otherwise an expert estimate, marked as such in `research/<module>-evidence.md`.
- Red flags and urgency follow guidelines; never lowered to make a result look calmer.

## Phases

| # | Phase | Status |
| --- | --- | --- |
| 1 | Lower back: evidence table (prevalence, LRs, red flags, India data), refined weights, missing conditions, sharper questions | done 4 Nov (research/lumbar-evidence.md) |
| 2 | User-friendly pack: tap-a-term glossary with pictures, read aloud (Hindi/English), larger text, plain 3-line summary, save and resume, share report, body-part cards on the start page | in progress |
| 3 | Neck and arm deep research (cervical radiculopathy, myelopathy, thoracic outlet, etc.) | pending |
| 4 | New: Shoulder (frozen shoulder, rotator cuff, impingement, calcific tendinitis, AC joint, instability, referred pain) | pending |
| 5 | New: Knee (osteoarthritis, patellofemoral pain, meniscus, ligament injury, IT band, bursitis, Baker's cyst, gout, Osgood-Schlatter) | pending |
| 6 | New: Leg, ankle and foot (plantar fasciitis, Achilles, ankle sprain, shin splints, calf strain, DVT and artery red flags, neuropathy, Morton's neuroma) | pending |
| 7 | New: Hip (hip OA, greater trochanteric pain, FAI/labral tear, avascular necrosis, stress fracture) | pending |
| 8 | New: Elbow, wrist and hand (tennis/golfer's elbow, de Quervain, carpal tunnel, trigger finger, cubital tunnel, hand OA) | pending |
| 9 | Upper/mid back and whole spine deep research update | pending |
