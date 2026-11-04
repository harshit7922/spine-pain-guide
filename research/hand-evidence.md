# Elbow, wrist and hand – evidence table (Phase 8, 4 Nov 2026)

New module: `data/hand.js`. Same scoring rule as the other regions: points = `round(4 × log10(LR))` where a likelihood ratio (LR) exists, otherwise an expert estimate marked here. Every result still sends the person to a doctor.

## 1. How common, and how it usually goes

| Finding | Number | Source |
| --- | --- | --- |
| Tennis elbow (lateral epicondylitis) | 1.3% of adults; highest at 45–54; no sex difference; forceful plus repetitive work OR 5.6; current smoking OR 3.4 | Shiri 2006, Am J Epidemiol (4,783 people) |
| Golfer's elbow (medial epicondylitis) | 0.4% of adults; linked to obesity | Shiri 2006 |
| Tennis elbow, natural course | wait-and-see: success 27% at 6 weeks, 83% at 26 weeks, 90% at 52 weeks | Bisset 2006, BMJ (via Physio First) |
| Tennis elbow, steroid injection | recovered or much improved at 1 year 83% after steroid vs 96% after placebo injection; recurrence 54% vs 12% | Coombes 2013, JAMA (165 people) |
| De Quervain's | women 1.3%, men 0.5%; peaks in the 40s–50s; late pregnancy and new mothers; one or two injections give near-complete relief in 52–90% | StatPearls |
| Trigger finger | 2–3% of people, about 10% with diabetes; one steroid injection succeeds in 60–80% at a year | Sports Medicine Review |
| Hand osteoarthritis | symptomatic in about 15% (6–26%); women over 50; thumb base involvement common | Radiopaedia |
| Rheumatoid arthritis in India | 0.75% of 44,551 adults near Delhi (about 7 million nationally) | Malaviya 1993, Rheumatol Int |
| Ganglion cyst | back of the wrist 60–70%, palm side 13–20%; up to half go away; aspiration succeeds in 30–50%; surgical recurrence about 5–16% | Gude & Morelli 2008 |
| Dupuytren's | ring finger most often; 3–33% of people with diabetes; about 10% regress | Trojian & Chu 2007, Am Fam Physician |
| Scaphoid fracture | 60–70% of carpal fractures; mean age 29; up to 25% not seen on the first X-ray; non-union almost 10 times more likely if diagnosis is delayed beyond 4 weeks | StatPearls |
| Olecranon bursitis | about one third infected; 65–85% of non-infected settle by 4 weeks | StatPearls |

## 2. Tests and findings with published accuracy

| Condition | Test or finding (question in the tool) | Accuracy | Points | Source |
| --- | --- | --- | --- | --- |
| Carpal tunnel syndrome | Night tingling eased by shaking the hand, flick sign (`ch_night_hand`) | LR+ 21.4, LR− 0.1 | +5 | D'Arcy & McGee 2000, JAMA (via TheNNT) |
| Carpal tunnel syndrome | Classic or probable hand diagram: thumb, index and middle fingers (`ch_numb_median`) | LR+ 2.4 | +2 | same |
| Carpal tunnel syndrome | Phalen, Tinel | LR+ 1.3 and 1.4 | not asked (adds almost nothing) | same |
| Tennis elbow | Cozen test, self-performed (`cozen_pos` / `cozen_neg`) | sensitivity 91%; specificity not reported | +2 / −2, expert estimate (a sensitive test, so a negative counts) | J Hand Ther 2021 systematic review |
| De Quervain's | WHAT test, self-performed with the other hand resisting (`what_pos` / `what_neg`) | sensitivity 99%, specificity 29% → LR+ 1.4, LR− 0.03 | +1 / −5 (LR− would give −6; reduced because the test is self-performed) | Goubau 2014 |
| Cubital tunnel syndrome | Elbow flexion test (`elbflx_pos` / `elbflx_neg`) | sensitivity 36–93%, specificity 40–99% across studies | +2 / −1, expert estimate | Physiotutors summary |
| Hand osteoarthritis | ACR classification criteria (examination) | tree format sensitivity 92%, specificity 98% | quoted in "how doctors confirm it"; self-reported bony knobs +4, expert | Altman 1990 |
| Elbow fracture | Being able to fully straighten the elbow (elbow extension test) | sensitivity 96.8%; adults with full extension 1.6% fracture risk; less reliable in children | used in the emergency rule (`rf_deform`) | Appelboam 2008, BMJ |
| Flexor sheath infection | Kanavel signs | all four signs sensitivity 91–97%; fever present in only 17% | emergency rule (`rf_infect`) | Chan 2019, BJGP |

## 3. Red flags

| Warning sign (question) | Action in the tool | Source |
| --- | --- | --- |
| Deformed or quickly swollen elbow or wrist after a fall, or an elbow that will not straighten (`rf_deform`) | red: X-ray today | Appelboam 2008 |
| Red, hot, swollen finger held bent and painful to straighten, or after a cut or bite (`rf_infect`) | red: hand surgery emergency | Chan 2019 |
| Hot, red, swollen elbow or wrist, or hot elbow-point swelling, with fever (`rf_hot`) | red: possible infected joint or bursa | BSR hot joint guideline; StatPearls olecranon bursitis |
| Arm pain with chest pressure, breathlessness or sweating (`rf_chest`) | red: call 108 (heart) | AHA (shared with the shoulder module) |
| Pain in the base-of-thumb hollow after a fall (`rf_snuffbox`) | orange: X-ray and splint within a day | StatPearls scaphoid fracture |
| Worsening weakness or muscle wasting (`rf_weak`) | orange | nerve entrapment sources |
| Soft swelling of small hand joints with long morning stiffness | yellow, with NICE's advice of rheumatology referral within 3 working days | NICE QS33 |

## 4. Conditions in the module

Tennis elbow, golfer's elbow, olecranon bursitis, cubital tunnel syndrome, carpal tunnel syndrome, de Quervain's tenosynovitis, trigger finger, hand and thumb-base osteoarthritis, rheumatoid or other inflammatory arthritis, ganglion cyst, Dupuytren's contracture, possible scaphoid fracture, and pain or tingling coming from the neck. Emergencies: broken bone or dislocation, serious hand infection, infected joint or bursa, heart attack.

## 5. Expert estimates

Area weights; pain on gripping; forceful repeated work (OR 5.6, reduced to +2 because it is self-reported); lifting a baby; pregnancy and new motherhood; pinching; clicking or locking fingers; cords in the palm and the table-top test; smooth wrist lumps; bony finger knobs; soft knuckle swelling; long versus short morning stiffness; diabetes (trigger finger about four times more common, +2); elbow-point swelling and leaning on the elbow; ring and little finger tingling; neck pain with arm pain.

## 6. What was built

- Two new body areas in the 3D model (back of the wrist, finger joints; the rest are unchanged), giving ten areas with reference pictures: outer, inner and back of the elbow, thumb side of the wrist, base of the thumb, palm side and back of the wrist, palm at the base of the fingers, finger joints and the neck.
- Three self-tests with posed 3D pictures: lifting the wrist against resistance (Cozen), bending the wrist and pushing the thumb out (WHAT), and bending the elbow fully for a minute.
- Nine new word pictures: tennis elbow, golfer's elbow, olecranon bursitis, de Quervain's, scaphoid, trigger finger, Dupuytren's, ganglion, Heberden's and Bouchard's nodes (56 words in total).
- 18 new test scenarios (135 in total, all passing).

## Sources

- Shiri R et al. Am J Epidemiol 2006: https://www.qxmd.com/r/16968862
- Bisset L et al. BMJ 2006 (wait-and-see results, via Physio First): https://physiofirst.org.uk/static/uploaded/a9315881-2a2d-4004-8b95c313f2d5a3d4.pdf
- Coombes BK et al. JAMA 2013 (summary): https://www.sciencedaily.com/releases/2013/02/130205162119.htm
- Diagnostic accuracy of examination tests for lateral elbow tendinopathy, J Hand Ther 2021: https://read.qxmd.com/read/33814224/diagnostic-accuracy-of-examination-tests-for-lateral-elbow-tendinopathy-let-a-systematic-review
- Goubau JF et al. 2014, WHAT test (summary): https://www.physiotutors.com/de/wiki/what-test/
- StatPearls – De Quervain tenosynovitis: https://www.statpearls.com/point-of-care/20270
- Trigger finger review: https://www.sportsmedreview.com/?p=5806
- Altman R et al. Arthritis Rheum 1990 (hand OA criteria): https://www.qxmd.com/r/2242058
- Radiopaedia – Osteoarthritis of the hand: https://radiopaedia.org/articles/osteoarthritis-of-the-hand
- Malaviya AN et al. Rheumatol Int 1993: https://link.springer.com/doi/10.1007/BF00301258
- NICE QS33 Rheumatoid arthritis: https://nice.org.uk/guidance/qs33/resources/rheumatoid-arthritis-in-over-16s-pdf-2098604563909
- Gude W, Morelli V. Curr Rev Musculoskelet Med 2008: https://link.springer.com/doi/10.1007/s12178-008-9033-4
- Trojian TH, Chu SM. Am Fam Physician 2007: https://www.aafp.org/pubs/afp/issues/2007/0701/p86.html
- StatPearls – Scaphoid fracture: https://statpearls.com/point-of-care/31423
- Appelboam A et al. BMJ 2008 (summary): https://www.aafp.org/afp/2009/1101/p997.html
- Chan E et al. Br J Gen Pract 2019: https://bjgp.org/content/bjgp/69/683/315.full.pdf
- StatPearls – Olecranon bursitis: https://www.statpearls.com/point-of-care/26147
- D'Arcy CA, McGee S. JAMA 2000 (likelihood ratios via TheNNT): https://thennt.com/lr/carpal-tunnel-syndrome/
- Elbow flexion test: https://www.physiotutors.com/wiki/elbow-flexion-test/
