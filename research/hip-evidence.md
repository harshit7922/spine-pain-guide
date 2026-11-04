# Hip and groin – evidence table (Phase 7, 4 Nov 2026)

New module: `data/hip.js`. Same scoring rule as the other regions: points = `round(4 × log10(LR))` where a likelihood ratio (LR) exists, otherwise an expert estimate marked here. Every result still sends the person to a doctor.

## 1. How common, and how it usually goes

| Finding | Number | Source |
| --- | --- | --- |
| Avascular necrosis as the reason for hip replacement | India 51.8% of primary hip replacements, USA 5.97% | Yakkanti 2023, J Orthop |
| Primary hip osteoarthritis | described as rare among Indians and Asians (the study itself measured hip shape, not prevalence) | Malhotra 2012, Indian J Orthop |
| Outer hip pain (greater trochanteric pain syndrome), age 50–79 | women 15.0% one side + 8.5% both (23.5%); men 6.6% + 1.9% (8.5%); female sex OR 3.37, low back pain OR 2.79, knee osteoarthritis on the same side OR 3.47; age and BMI not significant | Segal 2007, Arch Phys Med Rehabil |
| Gluteal tendinopathy treatment (LEAP trial, 204 people) | success at 8 weeks: education + exercise 77.3%, steroid injection 58.5%, wait and see 29.4%; at 52 weeks 78.6%, 58.3%, 51.9% | Mellor 2018, BMJ |
| Hip fracture | NICE: surgery on the day of, or the day after, admission | NICE CG124 |
| Hip fracture in India | one-year mortality 18.92% after surgery (1,101 patients, mean age 74) | J Orthop Case Rep 2025 |
| Femoral neck stress fracture | military recruits and distance runners; 5% of stress fractures; tension-side fractures can displace; MRI before X-ray; return to running about 7 weeks (grade I) and 13.8 weeks (grade II) | Sports Medicine Review summary |
| Irritable hip (transient synovitis) | most common cause of acute hip pain under 10; peak 3–8 years; boys 2:1; follows a viral illness in 32–50% | WikEM |
| Perthes disease | age 4–9 (peak 5–7); boys 4–5 times more often; pain may be felt in the knee; both hips in 10–20%; orthopaedic review within 1 week | FPnotebook |
| Slipped growth plate (SCFE) | knee pain is the presenting complaint in 26% | StatPearls (from the knee phase) |
| Groin hernia | lifetime risk 27% in men, 3% in women | Fitzgibbons & Forse 2015, NEJM (via Wikipedia) |
| Meralgia paresthetica | 4.3 per 10,000 person-years; about 7 times higher with diabetes; most common at 30–40; tight belts, obesity, pregnancy | 5-Minute Clinical Consult |
| Avascular necrosis | men aged 30–50; steroids, alcohol, sickle cell disease; early X-ray normal, MRI preferred | FPnotebook |

## 2. Tests and findings with published accuracy

| Condition | Test or finding (question in the tool) | Accuracy | Points | Source |
| --- | --- | --- | --- | --- |
| Gluteal tendinopathy | Standing on one leg for 30 seconds brings on outer hip pain (`sls_pos` / `sls_neg`) | Lequesne 2008: sensitivity 100%, specificity 97.3% (LR+ about 37); Grimaldi 2017: sensitivity 38%, specificity 100% (LR− 0.62) | +4 (reduced from +6 because the two studies disagree on sensitivity) / −1 | physiotutors summary of both studies |
| Hip osteoarthritis | ACR clinical criteria (pain + reduced or painful inward turning, morning stiffness up to 60 min, age over 50) | sensitivity 86%, specificity 75% → LR+ 3.4 | +2 for the self-reportable part (`hipoa_cl`: age 50+, short morning stiffness, difficulty with socks or groin pain in the figure-4 position); expert adaptation, because the tool cannot measure hip rotation | Altman 1991 |
| Hip osteoarthritis | NICE clinical diagnosis: 45+, activity-related pain, little morning stiffness (`nice_hip`) | diagnose without imaging | +2, expert estimate (age band 40–49 counted because the app uses 10-year bands) | NICE NG226 |
| Hip impingement / labral tear | FADIR (examiner) | sensitivity 99%, specificity 5% (LR− about 0.2): good for ruling out, not for diagnosis | not asked (needs an examiner); quoted in "how doctors confirm it" | Reiman 2015, BJSM |
| Hip joint vs sacroiliac joint | Figure-4 (FABER) position, self-performed (`faber_groin` / `faber_back`) | sacroiliac joint: sensitivity 50%, specificity 56% (LR about 1.1) | +1 each, expert estimate based on where the pain is felt | Schneider 2020 via physiotutors |
| Septic hip in children | Kocher criteria (fever 38.5 °C+, will not bear weight, ESR over 40, white cells over 12,000) | 3 criteria 93%, 4 criteria 99% probability of infection | used as an emergency rule: limping child + fever → emergency | Kocher 1999 via WikEM |

## 3. Red flags

| Warning sign (question) | Action in the tool | Source |
| --- | --- | --- |
| After a fall, cannot stand or walk, or the leg looks shorter and turned out (`rf_fall_hip`) | red: possible hip fracture, emergency | NICE CG124 |
| Fever with severe hip pain, or cannot bear weight with fever (`rf_hot`), or a limping child with fever (`rf_child_limp` + `rf_fever`) | red: possible infected joint | Kocher; BSR hot swollen joint guideline |
| Groin lump that is hard, very painful and stuck, especially with vomiting (`rf_hernia`) | red: possible strangulated hernia, emergency surgery | Fitzgibbons 2015 |
| Limping child or teenager with hip, thigh or knee pain (`rf_child_limp`) | orange: paediatric orthopaedics | SCFE / Perthes sources |
| Groin pain after training that now hurts with every step or at rest (`rf_stress`) | orange: stop running, MRI | Sports Medicine Review |
| Groin pain with steroid use, regular alcohol or sickle cell disease | yellow, with a note that an MRI is needed if it persists | FPnotebook (AVN) |

## 4. Conditions in the module

Hip osteoarthritis, gluteal tendinopathy (greater trochanteric pain syndrome), hip impingement or labral tear, avascular necrosis, femoral neck stress fracture, hip problems in growing children (irritable hip, Perthes disease, slipped growth plate), adductor-related groin strain (Doha classification), groin hernia, meralgia paresthetica, pain from the lower back or sacroiliac joint, inflammatory arthritis. Emergencies: broken hip, infected hip joint, trapped hernia.

## 5. Expert estimates

Area weights (groin for the hip joint, outer bony point for the buttock tendons, buttock and lower back for referred pain, front-outer thigh for meralgia, knee for hip pain in children), pain lying on the side, crossing the legs, deep groin ache, painful clicking, deep bending, pivoting, difficulty with socks, limp, steroid courses, regular alcohol, sickle cell disease, training increases, kicking injuries, a groin lump that changes with coughing, burning numb patch on the outer thigh, tight belts or pregnancy, and long morning stiffness. Female sex for gluteal tendinopathy uses the odds ratio 3.37 (+2).

## 6. What was built

- Six body areas with 3D reference pictures (groin, outer hip, buttock, front-outer thigh, knee, lower back).
- Two self-tests with posed 3D pictures: standing on one leg for 30 seconds, and the figure-4 position lying on a bed (pain in the groin or at the back are separate answers).
- Six new word pictures: greater trochanter and gluteal tendons, hip socket and labrum, avascular necrosis, groin hernia, meralgia paresthetica, FABER test (47 words in total).
- Glossary fixes: "impingement" on its own no longer opens the shoulder picture, and "bulge" / "उभार" only link when they mean a disc bulge (bone spurs and bunions were being linked to disc herniation).
- 18 new test scenarios (117 in total, all passing).

## Sources

- Altman R et al. Arthritis Rheum 1991;34:505–14 (criteria summary): https://www.physiotutors.com/wiki/hip-osteoarthritis-diagnosis
- Malhotra R et al. Indian J Orthop 2012;46:212–5: https://rcastoragev2.blob.core.windows.net/e797d4ff4da7ab65a27b9deee14d00d6/PMC3308664.pdf
- Yakkanti RR et al. J Orthop 2023;36:1–6: https://vufind.lboro.ac.uk/PrimoRecord/cdi_pubmedcentral_primary_oai_pubmedcentral_nih_gov_9747526
- FPnotebook – Avascular necrosis of the femoral head: https://fpnotebook.com/Ortho/Hip/AvsclrNcrsOfThFmrlHd.htm
- Single-leg stance test (Lequesne 2008; Grimaldi 2017): https://www.physiotutors.com/wiki/single-leg-stance-test/
- Segal NA et al. Arch Phys Med Rehabil 2007;88:988–92: https://www.qxmd.com/r/17678660
- Mellor R et al. BMJ 2018;361:k1662 (LEAP): https://www.running-physio.com/gluteal-leap/
- Reiman MP et al. Br J Sports Med 2015;49:811 (FADIR): https://www.physiotutors.com/wiki/faddir-test/
- FABER / Patrick test: https://www.physiotutors.com/ro/wiki/patricks-test/
- NICE CG124 Hip fracture (summary): https://www.mddus.com/resources/resource-library/news-digest/2011/june/nice-urges-prompt-surgery-in-hip-fractures
- One-year mortality after hip fracture surgery in India (J Orthop Case Rep 2025): https://jocr.co.in/wp/2025/02/demographic-insights-into-one-year-mortality-following-proximal-femur-fracture-surgery-in-india/
- Femoral neck stress fractures: https://www.sportsmedreview.com/?p=14373
- WikEM – Transient synovitis and Kocher criteria: https://wikem.org/wiki/Transient_(Toxic)_Synovitis_(Hip)
- FPnotebook – Legg-Calvé-Perthes disease: https://fpnotebook.com/Ortho/Peds/LgClvPrths.htm
- 5-Minute Clinical Consult – Meralgia paresthetica: https://im.unboundmedicine.com/medicine/pview/5-Minute-Clinical-Consult/1688833/all/Meralgia%20Paresthetica
- Inguinal hernia (citing Fitzgibbons & Forse, NEJM 2015): https://en.wikipedia.org/wiki/Inguinal_hernia
- Weir A et al. Doha agreement, Br J Sports Med 2015;49:768–74: https://repub.eur.nl/pub/79674
