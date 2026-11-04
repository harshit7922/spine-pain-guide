# Headache, face and jaw – evidence table (Phase 10, 4 Nov 2026)

New module: `data/head.js`; the hip module gains the back of the thigh (hamstring strain). Same scoring rule as the other regions: points = `round(4 × log10(LR))` where a likelihood ratio (LR) exists, otherwise an expert estimate marked here. Every result still sends the person to a doctor, and emergencies are checked before anything else.

## 1. How common, and how it usually goes

| Finding | Number | Source |
| --- | --- | --- |
| Headache in India (Karnataka, 2,329 adults) | any headache 63.9% in a year; migraine 25.2%; tension-type 35.1%; headache on 15+ days a month 3.0%; probable medication-overuse headache 1.2% | Kulkarni 2015, J Headache Pain |
| "Sinus headache" | 88% of 2,991 people with self- or doctor-diagnosed sinus headache met migraine criteria | Schreiber 2004, Arch Intern Med (via The Hospitalist) |
| Cervicogenic headache | 1–4% of people with headache; manual and exercise therapy reduce intensity and frequency (20 trials, 1,439 people) | Bini 2022, Chiropr Man Therap |
| Temporomandibular disorder | an estimated 10–15% of adults | DentistryIQ summary of DC/TMD |
| Medication-overuse headache | about 1% worldwide; relapse about 30% at 6 months and 50% at 5 years | StatPearls |
| Cluster headache | about 1 in 1,000; men about 4:1; attacks 15–180 minutes; 100% oxygen gives complete relief in about 78% | FPnotebook |
| Trigeminal neuralgia | 4–13 per 100,000 a year; onset under 40, sensory loss or both sides need an MRI | Patient.info (professional) |
| Hamstring strain (professional football) | 19% of 14,057 injuries; 18% recurrences; average lay-off 13 days | Ekstrand 2022, BJSM (via Physio Update) |
| Hamstring rehabilitation | lengthening exercises: return in 28 days vs 51 days with conventional exercises | Askling 2013, BJSM |

## 2. Findings and tests with published accuracy

| Condition | Finding (question in the tool) | Accuracy | Points | Source |
| --- | --- | --- | --- | --- |
| Migraine | 4 or 5 POUND features: Pulsating, 4–72 hours, Unilateral, Nausea, Disabling (`pound4`) | LR 24 (95% CI 1.5–388) | +5 (LR would give +6; reduced because the interval is very wide) | Detsky 2006, JAMA |
| Migraine | exactly 3 features (`pound3`) | LR 3.5 | +2 | same |
| Migraine | 2 or fewer (`pound_le2`) | LR 0.41 | −2 | same |
| Serious cause | cluster-type headache | LR 10.7 for a significant abnormality on imaging | orange urgency for one-sided eye pain with a watering eye; quoted in the cluster headache text | same |
| Serious cause | abnormal neurological examination | LR 5.3 | emergency rule (`rf_neuro`) | same |
| Subarachnoid haemorrhage | Ottawa SAH rule for sudden headache peaking within an hour | sensitivity 100%, specificity 15.3% | any thunderclap headache (`rf_thunder`) is an emergency | Perry 2013, JAMA |
| Cervicogenic headache | flexion-rotation test (`frt_pos` / `frt_neg`) | examiner test: sensitivity 91%, specificity 90% (LR+ 9.1, LR− 0.1) | +3 / −3 (LR would give +4 / −4; reduced because it is self-performed) | Ogince 2007 (via Physiotutors) |
| Painful TMD | familiar pain on wide opening and on pressing the jaw muscles (`jawt_pos` / `jawt_neg`) | DC/TMD pain diagnoses: sensitivity ≥ 0.86, specificity ≥ 0.98 (examiner plus history) | +3 / −2, expert estimate | Schiffman 2014 |
| Giant cell arteritis | jaw pain on chewing (`ch_jaw_claud`) | LR+ 4.0 | +3 (LR would give +2; raised for safety because missing it risks blindness) | Smetana & Shmerling 2002, JAMA |
| Medication-overuse headache | headache on 15+ days a month with painkillers on 10–15+ days (`moh_crit`) | ICHD-3 definition | +6 (definition met) | StatPearls |
| Tension-type headache | 2 of: both sides, pressing, not disabling, not worse with activity, with at least one positive feature and no nausea (`tth_feat`) | ICHD-3 definition (no accuracy figures) | +3, expert estimate | ICHD-3 via Physiotutors |

## 3. Red flags (SNNOOP10)

| Warning sign (question) | Action in the tool | Source |
| --- | --- | --- |
| Sudden, worst-ever headache peaking within a minute or two (`rf_thunder`) | red: emergency, CT scan | Perry 2013; Do 2019 |
| Fever with stiff neck, non-fading rash, confusion or drowsiness (`rf_mening`) | red: emergency | Do 2019 |
| Weakness, numbness, speech or vision problems, or a fit (`rf_neuro`) | red: emergency | Detsky 2006; Do 2019 |
| Head injury with vomiting, drowsiness or blood thinners (`rf_headinj`) | red: emergency | Do 2019 |
| Age 50+ with new headache and vision symptoms (`rf_vision`), or jaw claudication with a tender scalp | red: same-day assessment for giant cell arteritis | Smetana 2002 |
| New or steadily worsening headache after 50 (`rf_new50`) | orange; arteritis on the rule-out list | Do 2019 |
| Worse lying down or on waking with vomiting, or set off by coughing or straining (`rf_lying`) | orange | Do 2019 |
| New headache in pregnancy or soon after birth (`rf_preg`) | orange | Do 2019 |
| New headache with cancer, HIV or low immunity | orange | Do 2019 |
| Painkillers on too many days | yellow | StatPearls (MOH) |

## 4. Conditions in the module

Migraine, tension-type headache, cervicogenic headache, temporomandibular disorder, medication-overuse headache, cluster headache, giant cell arteritis (rule-out), trigeminal neuralgia, sinusitis (only with nose symptoms). Emergencies: bleeding around the brain, meningitis, stroke or other brain problem, head injury, giant cell arteritis with vision symptoms. Hip module: hamstring strain.

## 5. What was built

- Six new areas on the 3D head (forehead, temples, around the eye, jaw joint and cheek, back of the head and top of the neck), plus an "all around the head" area; existing body areas unchanged.
- Three new questions on headache length, headache days per month and painkiller days per month, used for the migraine and medication-overuse rules.
- Two self-tests with posed 3D pictures: chin down and turn the head (flexion-rotation), and open wide and press the jaw muscle (with the two press points marked).
- Nine new word pictures (migraine and aura, tension-type headache, cervicogenic headache, TMJ, trigeminal nerve, giant cell arteritis, cluster headache, medication-overuse headache, hamstring), 65 words in total.
- The "answer to continue" hint on the daily-life step is now general (it mentioned walking and sitting in every section).
- 17 new test scenarios (161 in total, all passing).

## Sources

- Detsky ME et al. JAMA 2006;296:1274–83: https://www.qxmd.com/r/16968852
- Perry JJ et al. JAMA 2013;310:1248–55 (summary): https://rebelem.com/the-ottawa-sah-clinical-decision-rule/
- Do TP et al. Neurology 2019;92:134–44: https://read.qxmd.com/doi/10.1212/WNL.0000000000006697
- Kulkarni GB et al. J Headache Pain 2015;16:67: https://spiral.imperial.ac.uk/entities/publication/a6c1e600-5a3c-4869-8f0c-92ed3aed54d5
- ICHD-3 tension-type headache criteria (Physiotutors): https://book.physiotutors.com/?p=2235
- Flexion-rotation test (Ogince 2007): https://www.physiotutors.com/wiki/flexion-rotation-test/
- Bini P et al. Chiropr Man Therap 2022;30:49: https://chiro.org/Headache/The_Effectiveness_of_Manual_and_Exercise.shtml
- Schiffman E et al. J Oral Facial Pain Headache 2014;28:6–27: https://research.regionh.dk/da/publications/diagnostic-criteria-for-temporomandibular-disorders-dctmd-for-cli/
- DentistryIQ – DC/TMD summary: https://www.dentistryiq.com/dental-hygiene/clinical-hygiene/article/16360542/evidencebased-diagnostic-standards-for-temporomandibular-disorders
- Smetana GW, Shmerling RH. JAMA 2002 (summary in J Fam Pract): https://cdn.mdedge.com/files/s3fs-public/Document/September-2017/5702JFP_ClinicalInq2.pdf
- Patient.info – Trigeminal neuralgia: https://patient.info/doctor/neurology/trigeminal-neuralgia-pro
- StatPearls – Medication overuse headache: https://www.statpearls.com/point-of-care/24890
- FPnotebook – Cluster headache: https://fpnotebook.com/Neuro/Headache/ClstrHdch.htm
- Schreiber CP et al. 2004 (via The Hospitalist): https://community.the-hospitalist.org/index.php/content/what-best-approach-sinus-headaches
- Ekstrand J et al. BJSM 2022 (via Physio Update): https://physioupdate.co.uk/?p=1496
- Askling CM et al. BJSM 2013;47:953–9: https://bjsm.bmj.com/content/47/15/953
