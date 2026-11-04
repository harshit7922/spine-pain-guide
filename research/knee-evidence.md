# Knee – evidence table (Phase 5, 4 Nov 2026)

New module: `data/knee.js`. Same scoring rule as the other regions: points = `round(4 × log10(LR))` where a likelihood ratio (LR) exists, otherwise an expert estimate marked here. Every result still sends the person to a doctor.

## 1. How common, and how it usually goes

| Finding | Number | Source |
| --- | --- | --- |
| Knee osteoarthritis in an Indian community study (5 sites, city to village) | 28.7% of adults studied (ICMR 2012 sites: 3.3–6.5%) | Government of India standard treatment guideline, osteoarthritis knee 2017 (citing Pal 2016) |
| Patellofemoral (kneecap) pain | annual prevalence 22.7% in the general population, 28.9% in adolescents | Smith 2018, PLoS One |
| Osgood-Schlatter disease | 9.8% of 12–15 year olds (boys 11.4%, girls 8.3%); both knees in 20–30%; settles within about 2 years; injections and surgery not recommended | StatPearls |
| Slipped hip growth plate in children (SCFE) | knee pain is the presenting complaint in 26%; delay causes more complications | StatPearls |
| Septic arthritis | treat a hot swollen joint as infected until proven otherwise, even without fever; mortality up to 11%, permanent damage in up to a third | BSR guideline (Weston & Coakley 2006) |

## 2. Findings and tests with published accuracy

| Condition | Finding (question in the tool) | Accuracy | Points | Source |
| --- | --- | --- | --- | --- |
| Knee osteoarthritis | Knee pain + 3 of 6: age over 50, morning stiffness under 30 min, grinding, bony tenderness (joint-line press), bony enlargement, no warmth (`acr3`) | sensitivity 95%, specificity 69% → LR+ 3.1, LR− 0.07 | +2; fewer than 3 (`acr_lt3`) −3 (LR− would be −5; reduced because the items are self-reported) | Altman 1986, ACR criteria |
| Knee osteoarthritis | 4 of the 6 (`acr4`) | sensitivity 84%, specificity 89% → LR+ 7.6 | +2 more (total +4) | Altman 1986 |
| Knee osteoarthritis | Age 45+, activity-related pain, no or short morning stiffness (`nice_oa`) | NICE: diagnose clinically without imaging | +2, expert estimate (age band 40–49 counted because the app uses 10-year bands) | NICE NG226 (2022) |
| Meniscus tear | Joint-line tenderness (`jlt_pos` / `jlt_neg`) | sensitivity 63%, specificity 77% → LR+ 2.7, LR− 0.48 | +2 / −1 | Hegedus 2007, JOSPT meta-analysis |
| Meniscus tear | Age over 40 (`a_40_49` and older) | LR+ up to 2.0 | +1 | Wagemakers 2008, Clin J Sport Med |
| ACL tear | Pop at injury (`ch_pop`) | sensitivity 63%, specificity 73% → LR+ 2.3 | +1 | Wagemakers 2010, Arch Phys Med Rehabil |
| ACL tear | 2 of 3: pop, swelling, giving way (`acl2`) | LR+ 2.5 | +2 | Wagemakers 2010 |
| Knee fracture | Ottawa knee rule after injury (`rf_fracture`) | sensitivity 98.5%, specificity 48.6% | emergency rule (X-ray) | Bachmann 2004, Ann Intern Med |
| Patellofemoral pain | Pain on squatting (`squat_pos`) | among the more useful tests in a meta-analysis; low specificity | +2, expert estimate | Nunes 2013, Phys Ther Sport |
| DVT | Swollen, warm, tender calf (`rf_dvt`) | – | emergency rule: ultrasound within 4 hours | NICE QS201 / NG158 |

## 3. Treatment statements shown

- Osteoarthritis (NICE NG226): tailored therapeutic exercise for everyone; weight loss if overweight (10% better than 5%); topical NSAID first for the knee; do not routinely offer paracetamol or weak opioids; do not offer glucosamine, hyaluronan injections or arthroscopic lavage/debridement; consider referral for replacement when symptoms seriously affect life.
- Osgood-Schlatter (StatPearls): load management, ice, kneeling pad, stretching and strengthening; no evidence for injections or surgery.
- Hot swollen joint (BSR): joint aspiration before antibiotics.

## 4. Conditions in the module

Knee osteoarthritis, kneecap (patellofemoral) pain, meniscus tear, ACL injury, Osgood-Schlatter disease, kneecap tendon pain (jumper's knee), iliotibial band syndrome, kneecap bursitis (housemaid's knee), Baker's cyst, gout or pseudogout, inflammatory arthritis, pain coming from the hip (including a slipped hip growth plate in children). Emergencies: hot swollen joint, possible fracture (Ottawa), possible DVT.

## 5. Expert estimates

Area weights (front for the kneecap, inner side for osteoarthritis and meniscus, outer side for the iliotibial band, bump below the kneecap for Osgood-Schlatter, back for Baker's cyst), the "cinema sign" (pain sitting with bent knees), stairs, squatting and floor sitting, catching or locking, swelling within 2 hours (bleeding into the joint) versus over a day, a knee that will not straighten, kneeling (bursitis), running and jumping (tendon and iliotibial band), long morning stiffness and several swollen joints (inflammatory arthritis), past gout, and groin or thigh pain or a limping child (hip).

## 6. What was built

- Seven knee-related body areas with 3D reference pictures; three self-tests with posed 3D pictures (squat, joint-line press with the two points marked, straightening the knee on a bed).
- Five new word pictures: meniscus, ACL, kneecap joint, Baker's cyst, DVT (36 words in total).
- 14 new test scenarios (83 in total, all passing).

## Sources

- Altman R et al. Arthritis Rheum 1986;29:1039–49 (criteria summary): https://physiotutors.com/?p=11991
- NICE NG226 Osteoarthritis (2022), summary: https://bestpractice-bmj-com.bibliotheek.ehb.be/topics/en-gb/192/nice-summary
- Government of India STG Osteoarthritis knee (2017): https://qps.nhsrcindia.org/sites/default/files/2021-05/Osteoarthritis%20Knee.pdf
- Bachmann LM et al. Ann Intern Med 2004;140:121–4 (Ottawa knee rule): https://wikem.org/wiki/Ottawa_knee_rules
- Wagemakers HP et al. Arch Phys Med Rehabil 2010;91:1452–9: https://repub.eur.nl/pub/20762
- Wagemakers HP et al. Clin J Sport Med 2008;18:24–30: https://repub.eur.nl/pub/15186
- Hegedus EJ et al. JOSPT 2007;37:541–50: https://scholars.duke.edu/publication/743030
- Smith BE et al. PLoS One 2018: https://ideas.repec.org/a/plo/pone00/0190892.html
- Nunes GS et al. Phys Ther Sport 2013;14:54–9: https://myorthoevidence.com/AceReport/Report/5252
- StatPearls – Osgood-Schlatter disease: https://www.statpearls.com/point-of-care/26359
- StatPearls – Slipped capital femoral epiphysis: https://www.statpearls.com/point-of-care/29145
- Weston V, Coakley G. J Antimicrob Chemother 2006;58:492–3: https://academic.oup.com/jac/article/58/3/492/748748
- NICE QS201 (DVT ultrasound within 4 hours): https://www.nice.org.uk/guidance/qs201/chapter/quality-statement-3-proximal-leg-vein-ultrasound-scan-for-a-likely-deep-vein-thrombosis-wells
