# Neck and arm – evidence table (Phase 3, 4 Nov 2026)

Same rules as the lower back table (`research/lumbar-evidence.md`): where a study gives a likelihood ratio (LR), the points are `round(4 × log10(LR))`; otherwise the points are an expert estimate and are marked so. Every result still sends the person to a doctor.

## 1. How common, and how it usually goes

| Finding | Number | Source |
| --- | --- | --- |
| New cases of cervical radiculopathy (pinched neck nerve root) | 83.2 per 100,000 per year (men 107.3, women 63.5); peak at age 50–54 (202.9 per 100,000) | Radhakrishnan 1994, Brain |
| Cause | Spondylosis, disc or both in 68.4%; confirmed soft disc protrusion in 21.9%; exertion or injury before onset in only 14.8% | Radhakrishnan 1994 |
| Most affected roots | C7, then C6 | Radhakrishnan 1994 |
| Outcome | 90% symptom-free or only mildly affected at last follow-up; 26% had surgery; 31.7% had a recurrence (median follow-up 4.9 years) | Radhakrishnan 1994 |
| Early course | About 88% improve within 4 weeks of onset | Alentado 2014, Global Spine J (literature review) |
| Course of disc herniation with radiculopathy | Substantial improvement within the first 4–6 months; complete recovery in about 83% by 24–36 months (weak evidence, three studies) | Wong 2014, Spine J |
| Neck pain coming back | 50–85% of people with neck pain report it again 1–5 years later | Carroll 2008, Bone and Joint Decade Task Force |
| Whiplash | About 50% still report neck pain one year after the injury | Carroll 2008 (whiplash paper of the same Task Force) |
| Scan findings without pain | Disc bulging on MRI in 87.6% of 1,211 adults with no neck symptoms (73.3% of men and 78.0% of women in their 20s); cord compression 5.3% | Nakashima 2015, Spine |
| People living with neck pain worldwide | 203 million in 2020, projected 269 million by 2050 | GBD 2021 Neck Pain Collaborators 2024 |

## 2. Bedside tests with published accuracy

| Condition | Test or finding (question in the tool) | Sensitivity / specificity | LR+ | LR− | Points | Source |
| --- | --- | --- | --- | --- | --- | --- |
| Cervical radiculopathy | Spurling test A (`spur_pos` / `spur_neg`) | 50% / 86% | 3.6 | 0.58 | +2 / −1 (was +4 / −2) | Wainner 2003 |
| Cervical radiculopathy | Neck distraction, lifting the head relieves arm symptoms (`dist_pos` / `dist_neg`, **new test**, needs a helper) | 44% / 90% | 4.4 | 0.62 | +3 / −1 | Wainner 2003 |
| Cervical radiculopathy | Rotation towards the painful side under 60° | 89% / 49% | 1.7 | 0.22 | not asked (needs a goniometer) | Wainner 2003 |
| Cervical radiculopathy | Upper limb tension test A | 97% / 22% | 1.2 | 0.14 | not asked (examiner only) | Wainner 2003 |
| Cervical radiculopathy | 3 of the 4 tests above positive | – | 6.1 | – | shown as context only | Wainner 2003 |
| Cervical radiculopathy | 4 of 4 positive | – | 30.3 (95% CI 1.7–538) | – | shown as context only | Wainner 2003 |
| Cervical radiculopathy | Shoulder abduction (hand-on-head) relief (`sabd_pos`) | low–moderate / moderate–high | not pooled | – | +2, expert estimate (was +3) | Rubinstein 2007 systematic review |
| Cervical radiculopathy | Relief with the hand on the head in daily life (`b_hand_head`) | – | – | – | +2, expert estimate (was +3) | Rubinstein 2007 (same sign, reported by history) |
| Cervical myelopathy | Cluster: gait deviation, Hoffmann, inverted supinator, Babinski, age over 45 | – | 3 of 5: 30.9 | 1 of 5 or fewer: 0.18 | gait (`tandem_bad`, `ch_balance`) +4 each; age 40–49 +1 (new), 50–59 +2, 60+ +3; the three reflex signs need an examiner | Cook 2010 |
| Carpal tunnel syndrome | Flick sign: night tingling eased by shaking the hand (`ch_night_hand`) | – | 21.4 (one study) | 0.1 | +5 (unchanged, now documented) | D'Arcy & McGee 2000, JAMA; TheNNT |
| Carpal tunnel syndrome | Classic or probable hand diagram | – | 2.4 | 0.5 | covered by the C6/C7 finger areas (+1 each) | D'Arcy & McGee 2000 |
| Carpal tunnel syndrome | Symptoms in both hands (`both_arms`) | – | 1.4 | 0.7 | +1 (new) | D'Arcy & McGee 2000 |
| Carpal tunnel syndrome | Phalen 1.3, Tinel 1.4, night tingling alone 1.2 | – | ≈1 | – | not used: they add almost nothing | D'Arcy & McGee 2000 |
| Cubital tunnel syndrome | Elbow flexion test | 36–93% / 40–99% across studies (not poolable) | – | – | the symptom version (`ch_elbow_bend`) is +5, expert estimate | Physiotutors summary of Buehler 1988 and later studies |

## 3. Expert estimates kept

Arm-dominant pain, symptoms below the elbow, shooting pain, finger areas by root (C6 thumb, C7 middle finger, C8 little finger), pain on looking up; clumsy hands and Lhermitte's sign for myelopathy; morning stiffness for inflammatory arthritis; fever for infection; past cancer for a tumour; shoulder-movement pain for shoulder problems; a jerk in a vehicle for whiplash. These follow the clinical sources in the app but have no usable likelihood ratio.

## 4. Changes made in this phase

- New bedside test: neck lift relief (distraction) with a helper, with its own 3D picture (helper's hands at the jaw and back of the head, arrow up, the areas that should ease shown in teal).
- New condition: ulnar nerve pressed at the elbow (cubital tunnel syndrome), the second most common nerve entrapment in the arm and a common mimic of a C8 root problem; new question about ring and little finger tingling with the elbow bent.
- Re-weighted: Spurling and hand-on-head relief lowered to match their published accuracy; distraction added; carpal tunnel and myelopathy weights now tied to the JAMA and Cook cluster numbers.
- Outlooks now quote numbers with sources: radiculopathy (88% better in 4 weeks, 90% fine at follow-up, 26% surgery, 31.7% recurrence), neck strain (50–85% recurrence), whiplash (half still have pain at a year), spondylosis (87.6% of people without pain have bulging discs, so scans are read with the examination).
- Tests: 3 new scenarios (cubital tunnel; radiculopathy found by the neck lift test alone; all three neck tests negative lowers radiculopathy). 57 of 57 pass.

## Sources

- Radhakrishnan K et al. Brain 1994;117:325–35: https://www.qxmd.com/r/8186959
- Wainner RS et al. Spine 2003;28:52–62 (values as summarised): https://www.physiotutors.com/wiki/cluster-of-wainner/
- Rubinstein SM et al. Eur Spine J 2007;16:307–19: https://www.orthobullets.com/evidence/17013656
- Cook C et al. J Man Manip Ther 2010;18:175–80: https://www.physiotutors.com/wiki/cervical-myelopathy-cluster
- Alentado VJ et al. Global Spine J 2014: https://www.epistemonikos.org/en/documents/a4d2c4f86f91b634127490c329039494144e6821
- Wong JJ et al. Spine J 2014;14:1781–9: https://chiropractic.ca/wp-content/uploads/2015/01/Wong-2014-Course-prognosis-factors-sympto-cer-disc-hern-radic.pdf
- Nakashima H et al. Spine 2015;40:392–8: https://www.qxmd.com/r/25584950
- Carroll LJ et al. Spine 2008;33(4 Suppl):S75–92: https://chiro.org/Whiplash/Course_and_Prognostic_Factors_for_Neck_Pain.shtml
- D'Arcy CA, McGee S. JAMA 2000;283:3110–7, likelihood ratios via TheNNT: https://thennt.com/lr/carpal-tunnel-syndrome/
- Elbow flexion test summary: https://www.physiotutors.com/wiki/elbow-flexion-test/
