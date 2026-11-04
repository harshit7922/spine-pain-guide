# Shoulder – evidence table (Phase 4, 4 Nov 2026)

New module: `data/shoulder.js`. Same scoring rule as the other regions: points = `round(4 × log10(LR))` where a likelihood ratio (LR) exists, otherwise an expert estimate marked here. Every result still sends the person to a doctor.

## 1. How common, and how it usually goes

| Finding | Number | Source |
| --- | --- | --- |
| People with a shoulder complaint at any time (UK) | about 14%; 1–2% of adults see a GP each year with new shoulder pain | BESS/BOA/RCS commissioning guide, subacromial shoulder pain 2014 |
| Share of new shoulder pain from the rotator cuff | up to 70% | same |
| Usual ages | rotator cuff 35–75; frozen shoulder 35–65; arthritis over 60 | same (appendix) |
| Frozen shoulder, new cases | about 2.4 per 1,000 people a year | Rangan 2015, BESS/BOA frozen shoulder pathway |
| Frozen shoulder in diabetes | 10–36%; responds less well to treatment | same |
| Frozen shoulder course | painful phase 2–9 months, stiff phase 4–12 months, thawing 12–42 months; at a mean of 4.4 years 59% fully recovered, 35% mild–moderate, 6% severe; other shoulder affected in 6–17% within 5 years | same |
| Calcific tendinitis | mostly ages 30–50, about twice as common in women; supraspinatus in about 63%; non-surgical treatment succeeds in 30–80%; about 70% satisfied after needling (barbotage) | Kim 2020, Clin Shoulder Elb |
| After a first dislocation at age 15–35 | 55.7% unstable again within 2 years, 66.8% by 5 years; young men at highest risk | Robinson 2006, JBJS Am |

## 2. Bedside tests and findings

| Condition | Test or finding (question in the tool) | Accuracy | Points | Source |
| --- | --- | --- | --- | --- |
| Rotator cuff disease | Painful arc (`arc_pos` / `arc_neg`) | LR+ 3.7 (95% CI 1.9–7.0); LR− 0.36 (0.23–0.54) | +2 / −2 | Hermans 2013, JAMA Rational Clinical Examination |
| Rotator cuff disease / tear | Drop arm (`drop_pos`) | LR+ 3.3 (1.0–11) | +2 for a tear, +1 for cuff pain | Hermans 2013 |
| Full-thickness cuff tear | External rotation lag LR+ 7.2 (1.7–31); internal rotation lag LR+ 5.6 (2.6–12), normal LR− 0.04 | – | not asked: they need an examiner; quoted in "how doctors confirm it" | Hermans 2013 |
| Frozen shoulder | Outward turning lost more than other movements (capsular pattern) with a normal X-ray (`erom_lim`, self-check comparing both forearms) | hallmark sign; no pooled LR | +4, expert estimate; normal turning −3 | Rangan 2015 |
| Frozen shoulder | Diabetes or low immunity (`r_immune`) | 10–36% of people with diabetes | +3, expert estimate | Rangan 2015 |
| AC joint pain | Cross-body adduction (`xbody_pos`) | sensitivity 77%, overall accuracy 79%; positive predictive value under 30% | +2 (with pain on top of the shoulder +3), expert estimate | Chronopoulos 2004, Am J Sports Med |
| Polymyalgia rheumatica | Both shoulders, age 50+, morning stiffness over 45 minutes (`ch_girdle`) | classification score ≥4: sensitivity 68%, specificity 78% (88% against other shoulder conditions) | +5, only counted at age 50+ | Dasgupta 2012, EULAR/ACR |

## 3. Red flags (from the BESS/BOA pathways)

| Warning sign (question) | Action in the tool | Pathway advice |
| --- | --- | --- |
| Hot, red, swollen joint or fever with pain (`rf_hot`) | red: emergency (possible infected joint) | same-day referral |
| Out of shape or cannot move after an injury (`rf_deform`) | red: emergency (dislocation or fracture) | same-day referral |
| Shoulder or arm pain with chest pressure, sweating or breathlessness (`rf_cardiac`) | red: emergency (heart) | – |
| Sudden loss of lifting after injury or a jerk (`rf_sudden_weak`) | orange: 24–48 hours (acute cuff tear) | urgent referral, early repair |
| New lump or swelling (`rf_mass`) | orange | urgent (2-week) cancer pathway |
| Fever, sweats or weight loss; constant night pain at 50+ | orange | – |

## 4. Conditions in the module

Rotator cuff pain (subacromial pain), rotator cuff tear, frozen shoulder, calcific tendinitis, AC joint pain, shoulder instability, shoulder osteoarthritis, pain coming from the neck, polymyalgia rheumatica, and pain referred from the gallbladder, liver or diaphragm. Emergencies: infected joint, dislocation or fracture, heart attack.

Thoracic outlet syndrome was considered and left out for now: it is rare and its bedside tests (for example the Roos test) have many false positives.

## 5. Expert estimates

Area weights (outer shoulder for the cuff, top for the AC joint, both shoulders for polymyalgia), age bands, night pain lying on the shoulder, stiffness for dressing, sudden severe pain without injury (calcific tendinitis), a loose or slipping shoulder (instability), grinding (arthritis), neck pain or tingling below the elbow with a shoulder that moves freely (neck cause), right shoulder-tip pain with meals (gallbladder). These follow the pathway and review descriptions above.

## 6. What was built

- New body areas on the 3D models: top, front, outer side and back of the shoulder (and, for the next phases, elbow, wrist and hand, hip, knee, lower leg, ankle and foot), generated by `3d-build/body5.py`.
- Four new self-tests with posed 3D pictures: painful arc, slow lowering (drop arm), turning out both forearms, reach across the chest.
- Joint modules get their own result picture (bones of the joint from behind) and camera.
- Three new word pictures: rotator cuff, AC joint, frozen shoulder.
- 12 new test scenarios (69 in total, all passing).

## Sources

- BESS/BOA/RCS. Commissioning guide: subacromial shoulder pain, 2014: https://boa.ac.uk/asset/CAD0336B-9051-48A7-9E4DF7072C5C7E47
- Rangan A et al. BESS/BOA patient care pathways: frozen shoulder. Shoulder Elbow 2015;7:299–307: https://boa.ac.uk/asset/221D74D9-2DB0-40C6-AE113E5B1BEF68E5
- Hermans J et al. JAMA 2013;310:837–47: https://repub.eur.nl/pub/41413
- Chronopoulos E et al. Am J Sports Med 2004;32:655–61: https://read.qxmd.com/read/15090381/diagnostic-value-of-physical-tests-for-isolated-chronic-acromioclavicular-lesions
- Kim MS et al. Clin Shoulder Elb 2020;23:210–6: https://www.cisejournal.org/journal/view.php?number=782
- Robinson CM et al. J Bone Joint Surg Am 2006;88:2326–36: https://www.orthobullets.com/evidence/17079387
- Dasgupta B et al. 2012 PMR classification criteria (EULAR/ACR): https://scholars.aku.edu/en/publications/2012-provisional-classification-criteria-for-polymyalgia-rheumati-2/
