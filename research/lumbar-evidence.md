# Lower back – evidence table (Phase 1, 4 Nov 2026)

How to read this: every answer the tool asks about adds points to a condition. Where a study gives a **likelihood ratio (LR)** — how many times more often a finding is seen in people who have the condition than in people who do not — the points are `round(4 × log10(LR))`: LR 2.5 → +2, LR 6.4 → +3, LR 12 → +4, LR 0.29 → −2. Where no usable study exists, the points are an **expert estimate** and are marked so. The scoring is evidence-informed; it is **not** a validated clinical prediction rule, and every result still sends the person to a doctor.

## 1. How common each cause is (base rates)

| Finding | Number | Source |
| --- | --- | --- |
| Spinal fracture among people with low back pain in primary care | 1% assumed; median 3.6% observed | Downie 2013, BMJ |
| Spinal cancer among people with low back pain in primary care | 0.5% assumed; median 0.2% observed | Downie 2013, BMJ |
| Chronic primary (non-specific) low back pain among chronic low back pain in primary care | more than 90% | WHO guideline 2023 |
| India's share of the world's TB cases | about 25% | WHO Global TB Report 2025 (news summary) |
| Vitamin D deficiency (< 20 ng/mL) in Indian adults | 67% (95% CI 61–73%) | Siddiqee 2021, BMC Public Health |

## 2. Findings with published accuracy

| Condition | Finding (question in the tool) | LR+ (95% CI) | LR− | Points | Source |
| --- | --- | --- | --- | --- | --- |
| Spinal stenosis | No pain when seated (`b_sit_nopain`) | 7.4 (1.9–30) | 0.57 | +3 | Suri 2010 JAMA (TheNNT) |
| Spinal stenosis | Improvement when bending forward (`b_sitflex`) | 6.4 (4.1–9.9) | 0.52 | +3 | Suri 2010 |
| Spinal stenosis | Pain in both buttocks or legs (`both_legs`) | 6.3 (3.1–13) | 0.54 | +3 | Suri 2010 |
| Spinal stenosis | Neurogenic claudication (`w_walk`) | 3.7 (2.9–4.8) | 0.23 | +2 | Suri 2010 |
| Spinal stenosis | Age over 65 (`a_60p`) | 2.5 (1.4–4.2) | 0.34 | +2 | Suri 2010 |
| Spinal stenosis | Worse on standing (`w_stand`) | 2.3 (1.8–2.8) | 0.46 | +1 | Suri 2010 |
| Leg artery disease | Pain relieved by standing still (`w_walk_calf`) | 7.8; with calf location 20 | 0.24 | +5 | Nadeau 2013, Can J Surg |
| Spinal stenosis vs artery | Relief by sitting (neurogenic) | 3.8 | 0.21 | (see `b_sitflex`) | Nadeau 2013 |
| Disc herniation | Straight leg raise positive (`slr_pos`) | ≈1.3 (sens 92%, spec 28%) | 0.29 | +1 (positive), −2 (negative) | Cochrane CD007431 (van der Windt 2010) |
| Disc herniation | Crossed straight leg raise positive (`cslr_pos`) | ≈2.8 (sens 28%, spec 90%) | 0.8 | +2 | Cochrane CD007431 |
| Axial spondyloarthritis | 2 of 4 inflammatory back pain features (`ibp2`) | 3.7 | – | +2 | Rudwaleit 2006 |
| Axial spondyloarthritis | 3 of 4 features (`ibp3`, added on top of `ibp2`) | 12.4 | – | +2 more (total +4) | Rudwaleit 2006 |
| Axial spondyloarthritis | Heel pain without injury, enthesitis (`ch_heel`) | 3.4 | – | +2 | Rudwaleit 2004, Ann Rheum Dis |
| Axial spondyloarthritis | Uveitis (part of `r_spa`) | 7.3 | – | +3 | Rudwaleit 2004 |
| Spinal cancer | History of cancer (`r_cancer`) | post-test probability 7% from 0.5% (≈ LR 15) | – | +5 | Downie 2013 |
| Spinal cancer | Older age, weight loss, night pain, not better after a month | post-test probability < 3% (weak) | – | +1 each | Downie 2013 |
| Spinal fracture | Prolonged corticosteroid use (`r_bones`) | post-test probability 33% | – | +4 | Downie 2013 |
| Spinal fracture | Severe trauma (`rf_trauma`) | post-test probability 11% (≈ LR 12) | – | +4 | Downie 2013 |
| Spinal fracture | Age over 64 (`a_60p`) | 2.5 (2.2–2.8) | – | +2 | Downie 2013 |
| Spinal fracture | 3 of: female, over 70, severe trauma, steroids (`fx_combo`) | post-test probability 90% | – | +4 | Downie 2013 (Henschke) |
| Cauda equina | Bladder, bowel or saddle symptoms | sensitivity 19–43%, specificity 62–88% | – | emergency rule, not points | Systematic review abstract (World Physiotherapy) |

Cauda equina red flags are poor at ruling the condition in or out, but guidelines still require same-day MRI when they appear, so the tool keeps them as an emergency (red) rule.

## 3. Expert estimates kept from version 4

Leg-dominant pain, pain below the knee, shooting pain and pain on coughing (disc herniation); muscle spasm after a lift (strain); pain on arching backwards (facet joints, spondylolysis); buttock pain on rising (SI joint); tailbone pain on sitting (coccydynia); flank pain with urine symptoms (kidney); pain with periods (gynaecological). These follow the clinical descriptions in the guideline and textbook sources listed in the app but have no usable likelihood ratio, so they are labelled expert estimates.

## 4. Changes made in this phase

- New questions: no pain while sitting; calf pain on walking that eases by standing still; buttock pain that switches sides; heel pain without injury; risk factors for artery disease (smoking, diabetes, high blood pressure, high cholesterol); family history of spondyloarthritis.
- New conditions: narrowed leg arteries (peripheral artery disease) and chronic primary low back pain (WHO 2023).
- Re-weighted: spinal stenosis, axial spondyloarthritis (now uses the 2-of-4 / 3-of-4 rule), disc herniation (straight leg raise points lowered to match its low specificity), fracture (steroids, combination rule), spinal cancer (only cancer history carries strong weight).
- Recovery figures now cited: acute back pain falls from 52 to 23 (out of 100) by 6 weeks and to 6 at one year; persistent pain from 51 to 33 and 23 (Costa 2012, CMAJ).

## Sources

- Suri P et al. JAMA 2010;304:2628-36 — likelihood ratios via TheNNT: https://thennt.com/lr/spinal-stenosis-in-the-elderly/
- Downie A et al. BMJ 2013;347:f7095: https://repub.eur.nl/pub/72777
- Nadeau M et al. Can J Surg 2013;56:372-7: https://www.canjsurg.ca/content/cjs/56/6/372.full.pdf
- van der Windt DA et al. Cochrane Database Syst Rev 2010;CD007431: https://www.cochrane.org/evidence/CD007431_physical-examination-diagnosis-lumbar-radiculopathy-due-disc-herniation-patients-low-back-pain-and
- Rudwaleit M et al. Arthritis Rheum 2006 (criteria and LRs as summarised): https://mrcpfacts.blogspot.com/2008/10/recognition-of-inflammatory-back-pain.html
- Rudwaleit M et al. Ann Rheum Dis 2004;63:535-43: https://ard.bmj.com/content/63/5/535
- da C Menezes Costa L et al. CMAJ 2012;184:E613-24: https://pmc.ncbi.nlm.nih.gov/articles/PMC3414626/
- WHO guideline on chronic primary low back pain 2023 (summary): https://cdn.who.int/media/docs/default-source/mca-documents/ageing/lbp/summary_who_guideline_lower-back-pain_brochure_v7.pdf
- Siddiqee MH et al. BMC Public Health 2021: https://pmc.ncbi.nlm.nih.gov/articles/PMC8501935
- WHO Global TB Report 2025 (news summary): https://health.medicaldialogues.in/health-topics/respiratory-health/india-records-21-drop-in-tb-cases-still-accounts-for-25-of-global-burden-who-tb-report-158564
- Cauda equina red flag accuracy (systematic review abstract): https://world.physio/congress-proceeding/what-clinical-diagnostic-accuracy-red-flags-related-cauda-equina-syndrome-ces
