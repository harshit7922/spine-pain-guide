# Upper/mid back and whole spine – evidence update (Phase 9, 4 Nov 2026)

Updated modules: `data/thoracic.js` (upper or mid back) and `data/whole.js` (more than one part of the spine). Same scoring rule as the other regions: points = `round(4 × log10(LR))` where a likelihood ratio (LR) exists, otherwise an expert estimate marked here. Safety rules (emergencies and urgent referrals) are never lowered to make a result look calmer.

## 1. How common, and how it usually goes

| Finding | Number | Source |
| --- | --- | --- |
| Upper or mid back (thoracic) pain | 1-year prevalence 3.5–34.8%; lifetime 15.6–19.5%; impact comparable to neck and low back pain | Briggs 2009, BMC Musculoskelet Disord |
| Shingles | about 1 in 3 people in their lifetime; antivirals work best within 72 hours of the rash | CDC (via Northwestern Medicine) |
| Osteoporosis in India | about 46 million women; vertebral fractures in 17.1% of women over 50 (Delhi Vertebral Osteoporosis Study) | Khadilkar & Mandlik 2015, Int J Womens Health |
| Low vitamin D in Indian adults | 67% | Siddiqee 2021, BMC Public Health (already in the lower back table) |
| TB | India has about 25% of the world's cases; the thoracic spine is the commonest site of spinal TB | WHO Global TB Report 2025 (news summary); Pott's disease overview |
| Thoracic disc herniation | 0.25–0.75% of symptomatic disc herniations; about three-quarters below T8, most at T11–T12 | Physiopedia |
| Adolescent idiopathic scoliosis | 2.93% of 784 school pupils (Cobb angle 10° or more) | Malays Orthop J 2017 |

## 2. Findings with published accuracy

| Condition | Finding (question in the tool) | Accuracy | Points | Source |
| --- | --- | --- | --- | --- |
| Heart (acute coronary syndrome) | Pain brought on by exertion (`w_exert`) | LR+ 2.4 | kept at +6 as a safety rule (heart causes are always ruled out first); orange urgency unchanged | Swap & Nagurney 2005, JAMA |
| Heart | Pain spreading to both arms (`ch_arm_spread`, new) | LR+ 4.1 (right arm 4.7, left arm 2.3) | +2 | same |
| Heart | Pleuritic (sharp on breathing) pain (`ch_sharp_breath`) | LR 0.2 | −2 (LR would give −3; reduced for safety) | same |
| Heart | Reproduced by pressing (`press_pos`), positional (`twist_pos`) | LR 0.3 each | −1 each (LR would give −2; reduced for safety) | same |
| Aortic dissection | Tearing or ripping pain (`rf_tear`) | LR+ 1.2–10.8; no sudden onset LR− 0.3; pulse deficit LR+ 5.7; focal neurological deficit LR+ 6.6–33 | emergency rule (unchanged); explanation updated | Klompas 2002, JAMA |
| Axial spondyloarthritis | 2 of 3 inflammatory features: morning stiffness over 30 min, better with exercise and worse with rest, waking in the second half of the night (`ibp2`, new in these modules) | LR+ 3.7 (Berlin criteria, 2 of 4) | +2 | Rudwaleit 2006 |
| Axial spondyloarthritis | all 3 (`ibp3`) | LR+ 12.4 (3 of 4) | +2 more (total +4); single features reduced to +1 | Rudwaleit 2006 |
| Vertebral fracture | Prolonged steroid use (`r_bones`) | post-test probability 33% | +4 (was +3) | Downie 2013, BMJ |
| Vertebral fracture | 3 of female, over 60, major injury, steroids (`fx_combo`, new here) | post-test probability 90% | +4 (thoracic), +2 (whole-spine osteoporosis) | Downie 2013 |
| Vertebral fracture | Older age (`a_60p`) | LR 2.5 | +2 (was +3) | Downie 2013 |
| Spinal tumour | History of cancer (`r_cancer`) | about LR 15 | +5 (unchanged) | Downie 2013 |
| Spinal tumour | Night pain, older age | weak (post-test probability under 3%) | +1 each (was +3 and +2); orange urgency for night pain at 50+ unchanged | Downie 2013 |
| Polymyalgia rheumatica | 2012 EULAR/ACR criteria: age 50+, both shoulders, raised ESR/CRP, then stiffness over 45 min, hip pain, normal rheumatoid tests | sensitivity 68%, specificity 78% (score 4+) | quoted in "how doctors confirm it"; weights unchanged (expert) | Dasgupta 2012, Ann Rheum Dis |
| Scoliosis | Rib hump on bending forward (`ch_rib_hump`, new) | scoliometer at 7°: sensitivity 78%, specificity 89% | +3, expert estimate (self-report by another person) | Malays Orthop J 2017 |

## 3. Other changes

- Multilevel spondylosis now scores −3 under 18 (wear at several levels is not a cause of back pain in children).
- Emergency texts for heart attack and aortic dissection now say to call 108.
- New start-of-result numbers for both modules, each with its source.
- 9 new test scenarios (144 in total, all passing): pleuritic pain with cough and fever goes to the lungs and not the heart; exertional pain still triggers the heart check even when it is sharp and tender; three inflammatory features; the fracture combination; cancer history with night pain; a rib hump in a teenager; steroid-related osteoporosis.

## Sources

- Briggs AM et al. BMC Musculoskelet Disord 2009;10:77: https://bmcmusculoskeletdisord.biomedcentral.com/track/pdf/10.1186/1471-2474-10-77
- Swap CJ, Nagurney JT. JAMA 2005;294:2623–9: https://clinicalmonster.com/wp-content/uploads/sites/2/2016/06/Swap-ChestPainHx-JAMA-2005.pdf
- Klompas M. JAMA 2002;287:2262–72 (likelihood ratios summary): https://medicinespecifics.com/jama-aortic-dissection-likelihood-ratios
- Shingles lifetime risk and antiviral timing (CDC, via Northwestern Medicine): https://nm.org/healthbeat/healthy-tips/I-Think-I-Have-Shingles-Now-What
- Khadilkar AV, Mandlik RM. Int J Womens Health 2015;7:841–50: https://dovepress.com/epidemiology-and-treatment-of-osteoporosis-innbspwomen-an-indian-persp-peer-reviewed-article-IJWH
- Physiopedia – Thoracic disc syndrome: https://physio-pedia.com/Thoracic_Disc_Syndrome
- Dasgupta B et al. Ann Rheum Dis 2012;71:484–92: https://ard.bmj.com/content/71/4/484
- Scoliosis school screening, Malays Orthop J 2017: https://www.morthoj.org/2017/v11n3/adolescent-idiopathic-scoliosis-abstract.php
- Downie A et al. BMJ 2013;347:f7095: https://repub.eur.nl/pub/72777
- Rudwaleit M et al. Arthritis Rheum 2006 (via the lower back table)
- Siddiqee MH et al. BMC Public Health 2021: https://pmc.ncbi.nlm.nih.gov/articles/PMC8501935
