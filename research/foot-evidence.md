# Leg, ankle and foot – evidence table (Phase 6, 4 Nov 2026)

New module: `data/foot.js`. Same scoring rule as the other regions: points = `round(4 × log10(LR))` where a likelihood ratio (LR) exists, otherwise an expert estimate marked here. Every result still sends the person to a doctor.

## 1. How common, and how it usually goes

| Finding | Number | Source |
| --- | --- | --- |
| Plantar fasciitis | about 10% of people in their lifetime; peak in women aged 40–60; 5–10% of runners; about 80% improve within 12 months without surgery; heel spurs are common without pain | Trojian & Tucker 2019, Am Fam Physician |
| Child heel pain (Sever's disease) | girls 8–13, boys 10–15 | same |
| Shin splints (medial tibial stress syndrome) | 13.6–20% of runners, up to 35% of military recruits; tenderness over more than 5 cm (a stress fracture is pinpoint, under 5 cm) | StatPearls |
| Bunion (hallux valgus) | 23% of adults 18–65, 35.7% over 65; women 30%, men 13% | Nix 2010, J Foot Ankle Res |
| Diabetes in India | 11.4% of people (prediabetes 15.3%) | ICMR-INDIAB, Lancet Diabetes Endocrinol 2023 |
| Morton's neuroma | 3rd–4th web space in 80–85%; more common in women, peak age 40–50 | Sports Injury Bulletin (citing Mahadevan 2015) |
| Achilles rupture | up to 20–25% missed at the first visit; same-day orthopaedic referral | GPnotebook |

## 2. Tests and findings with published accuracy

| Condition | Test or finding (question in the tool) | Accuracy | Points | Source |
| --- | --- | --- | --- | --- |
| Ankle or midfoot fracture | Ottawa ankle rules after injury (`rf_fracture`) | pooled sensitivity 97.6% (96.4–98.9) | emergency rule (X-ray) | Bachmann 2003, BMJ |
| Plantar fasciitis | Windlass test (`windlass_pos`) | specificity 100%, sensitivity 32% in one study (the summary also quotes LR+ 1.47, which is inconsistent with 100% specificity) | +2, expert estimate | Trojian & Tucker 2019 |
| Morton's neuroma | Thumb-index finger squeeze (`squeeze_pos`) | sensitivity 96% (Mulder's click 61%, foot squeeze 41%) | +3, expert estimate (specificity not reported); negative −2 | Mahadevan 2015, via Sports Injury Bulletin |
| Achilles rupture | Calf squeeze (examiner) | sensitivity 0.96 | not asked; quoted in "how doctors confirm it"; inability to rise on the toes (`hr_cannot`) +3, expert | GPnotebook |
| Leg artery disease | Calf pain on walking relieved by standing still (`w_walk_calf`) | LR+ 7.8 | +5 | Nadeau 2013, Can J Surg (also in the lower back module) |

## 3. Red flags

| Warning sign (question) | Action in the tool | Source |
| --- | --- | --- |
| Ottawa ankle rules positive (`rf_fracture`) | red: emergency X-ray | Bachmann 2003 |
| Sudden cold, pale, numb, very painful foot, or black skin (`rf_ischaemia`) | red: emergency (blocked artery) | NHS Borders / Scottish Diabetes Foot Action Group |
| Foot wound with fever, spreading redness or bad smell (`rf_ulcer_fever`) | red: emergency | same |
| Non-healing foot wound (`rf_ulcer`) | orange: foot clinic within one working day | same |
| Swollen, warm, tender calf (`rf_dvt`) | red: ultrasound within 4 hours | NICE QS201 |
| Hot, red, swollen joint with fever (`rf_hot`) | red: assume infection | BSR hot swollen joint guideline |
| Kick-like heel pain with weak push-off (`ch_snap` + Achilles or `hr_cannot`) | red: same-day orthopaedic assessment | GPnotebook |

## 4. Conditions in the module

Plantar heel pain (plantar fasciitis), Sever's disease, Achilles tendinopathy, Achilles rupture, ankle sprain, shin splints, stress fracture, Morton's neuroma, bunion or big toe arthritis, gout attack, peripheral neuropathy, leg artery disease, calf muscle tear, and pain coming from the lower back (sciatica).

## 5. Expert estimates

Area weights; first-step heel pain; sudden kick-like heel pain; sudden calf pain on push-off; pinpoint bone pain; "pebble" feeling with toe numbness; tight shoes; bony bump on the big toe; hot swollen big toe; numbness or burning in both feet; night burning; cold pale feet; diabetes; shooting pain from the back. These follow the descriptions in the sources above.

## 6. What was built

- Nine leg and foot body areas plus the lower back, each with 3D reference pictures (big toe and arch views use a camera target in front of or under the foot).
- Three self-tests with posed 3D pictures: big toe lift (windlass), single-leg heel raise, squeeze between the toes (with the web space marked).
- Five new word pictures: plantar fascia, Achilles tendon, Morton's neuroma, peripheral neuropathy, gout (41 words in total).
- 16 new test scenarios (99 in total, all passing).

## Sources

- Trojian T, Tucker AK. Plantar fasciitis. Am Fam Physician 2019;99:744–50: https://www.aafp.org/pubs/afp/issues/2019/0615/p744.html
- Bachmann LM et al. BMJ 2003;326:417–9 (summary): https://www.aafp.org/pubs/afp/issues/2003/0815/p745a.html
- GPnotebook – Achilles tendon rupture: https://gpnotebook.com/pages/musculoskeletal-medicine/complete-rupture-of-the-achilles-tendon/diagnostic-process
- Morton's neuroma (Mahadevan 2015): https://www.sportsinjurybulletin.com/mortons-neuroma-clinical-assessment-and-management/
- StatPearls – Medial tibial stress syndrome: https://statpearls.com/point-of-care/42693
- Nix S et al. J Foot Ankle Res 2010;3:21: https://scalda.mijn.bsl.nl/prevalence-of-hallux-valgus-in-the-general-population-a-systemat/7109980
- ICMR-INDIAB 2023 (news summary): https://www.thequint.com/fit/diabetes-obesity-study-results-india-icmr
- NHS Borders – diabetic foot: https://www.rightdecisions.scot.nhs.uk/borders-ref-help-toolkit/podiatry/management-of-the-diabetic-foot
- Nadeau M et al. Can J Surg 2013;56:372–7: https://www.canjsurg.ca/content/cjs/56/6/372.full.pdf
