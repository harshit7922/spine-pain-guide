# First-step exercises – evidence table (Phase 11, 4 Nov 2026)

New file: `data/exercises.js`. The result page now shows a card called "First exercises to ask your physiotherapist about". Each exercise has a posed 3D picture, plain steps in English and Hindi, and the guideline or trial behind it.

Safety rules built in:

- The card appears only for **green or yellow** results. It never appears for orange or red (urgent) results.
- It appears only for the condition at the top of the list, and never for a "rule out" or rare serious condition.
- Every card starts with: show these to your doctor or physiotherapist before you start; move gently; stop and ask for advice if the pain becomes sharp or keeps getting worse, or if you get new numbness, tingling or weakness.
- **No repetitions, hold times or sessions per week are shown.** The guidelines leave the dose to the physiotherapist, so the card says "How many and how often: your physiotherapist will set this for you". Every number on the card comes from a source below.

## Which condition gets which exercise

| Condition (module) | Exercises (picture) | Why: what the evidence says | Source |
| --- | --- | --- | --- |
| Back strain, disc, facet, disc wear, muscle pain, long-standing low back pain (lumbar) | Regular walking | Guidelines recommend exercise for low back pain, matched to the person. In 701 adults just recovered from a bout, a walking programme with 6 physiotherapist education sessions: median 208 vs 112 days before the next bout (hazard ratio 0.72) | NICE NG59; WHO 2023; WalkBack (Pocovi 2024, Lancet) |
| Knee osteoarthritis (knee) | Walking, sit to stand, straight-leg raise | Offer tailored therapeutic exercise (muscle strengthening, general fitness) to everyone with osteoarthritis as a core treatment | NICE NG226 (2022) |
| Hip osteoarthritis (hip) | Walking, sit to stand | Same as above | NICE NG226 |
| Pain around the kneecap (knee) | Sit to stand, side leg raise | Exercise recommended; combine hip and knee exercises rather than knee exercises alone | Crossley 2016 consensus, BJSM |
| Outer hip pain, gluteal tendinopathy (hip) | Text card: take pressure off the tendon | Education plus exercise: success at 8 weeks 77.3% vs 58.5% (injection) vs 29.4% (wait and see) | LEAP (Mellor 2018, BMJ) |
| Hamstring strain (hip) | The extender | Lengthening exercises: return to play in 28 vs 51 days | Askling 2013, BJSM |
| Neck strain, wry neck, whiplash (neck) | Gentle neck turns | New neck pain: range-of-motion and low-load exercise, stay active, home programme | Blanpied 2017, APTA neck pain guideline |
| Neck pain with arm pain (neck) | Chin tuck, gentle neck turns | Mobilising and stabilising exercise | Blanpied 2017 |
| Neck wear and tear (neck) | Chin tuck, gentle neck turns | Long-standing neck pain: neck and shoulder-blade strengthening and endurance | Blanpied 2017 |
| Headache from the neck (neck, headache) | Chin tuck | 200 people: low-load exercise reduced headache frequency and intensity, lasting to 12 months | Jull 2002, Spine; Blanpied 2017 |
| Frozen shoulder (shoulder) | Pendulum swing | Education and stretching (grade B), intensity set by how irritable the shoulder is. Gentle exercise within pain limits, including pendulum swings: good result in 89% vs 64% with intensive stretching at 24 months | Kelley 2013, APTA adhesive capsulitis guideline; BESS/BOA 2015 |
| Rotator cuff-related shoulder pain (shoulder) | Turning the shoulder outward | Exercise-based physiotherapy for at least 6 weeks first | BESS/BOA/RCS 2014 |
| Plantar fasciitis (foot) | Calf stretch against a wall | Calf and plantar fascia stretching, grade A | Koc 2023, APTA heel pain guideline |
| Achilles tendinopathy (foot) | Heel raises | Tendon-loading exercise grade A; complete rest not advised | APTA midportion Achilles guideline 2024 |
| Ankle sprain (foot) | Single-leg balance | 8-week home balance programme: new sprain within a year 22% vs 33% (35% fewer); supervised exercise preferred over passive treatment | Hupperets 2009, BMJ; Vuurberg 2018, BJSM |
| Tennis elbow (hand) | Wrist lift | Isometric, concentric or eccentric resisted wrist-extensor exercise for subacute or long-standing pain, grade B | Lucado 2022, APTA lateral elbow guideline; Bisset 2006 |
| Fibromyalgia (whole spine) | Regular walking | Exercise was the only therapy rated "strong for" | EULAR 2017 (Macfarlane) |
| Axial spondyloarthritis (lumbar, thoracic, whole spine) | Regular walking | Exercise improved disease activity, function and mobility (moderate to large effects) | Review behind the 2022 ASAS-EULAR recommendations, Ann Rheum Dis 2023 |

## Left out on purpose

- Conditions where the guideline first step is not exercise, or where exercise could be unsafe without an examination first: migraine, cluster headache, giant cell arteritis, fractures, infection, tumours, Achilles rupture, ACL and meniscus injuries, spinal stenosis, sciatica with weakness, carpal tunnel, trigger finger, gout, nerve and artery problems.
- Repetition and hold-time numbers, because none of the guidelines above give one fixed dose for everyone.

## How the pictures are made

The same male and female 3D bodies used for the bedside tests are posed with the 52-bone skeleton (`TPOSE.ex_*` in `js/app.js`). The muscles working or being stretched are coloured green and arrows show the movement. The pictures follow the painful side (left or right). Props are a chair, a bed, a wall, a table under the supporting hand (pendulum) and a side table under the forearm (wrist lift).

## Sources

- NICE NG59 – Low back pain and sciatica in over 16s: https://www.nice.org.uk/guidance/ng59/chapter/Recommendation
- WHO guideline for non-surgical management of chronic primary low back pain (2023): https://cdn.who.int/media/docs/default-source/mca-documents/ageing/lbp/summary_who_guideline_lower-back-pain_brochure_v7.pdf
- Pocovi N et al. WalkBack, Lancet 2024 (via HealthDay): https://www.healthday.com/healthpro-news/bone-and-joint/walking-education-intervention-prevents-recurrence-of-low-back-pain
- NICE NG226 – Osteoarthritis in over 16s (2022): https://www.nice.org.uk/guidance/ng226/chapter/Recommendations
- Crossley KM et al. Patellofemoral pain consensus statement, BJSM 2016: https://repub.eur.nl/pub/97316/REPUB_97316-OA.pdf
- Mellor R et al. LEAP trial, BMJ 2018;361:k1662 (summary by Running Physio): https://www.running-physio.com/gluteal-leap/
- Askling CM et al. BJSM 2013: https://bjsm.bmj.com/content/47/15/953
- Blanpied PR et al. Neck pain revision 2017, decision tree: https://www.orthopt.org/uploads/content_files/files/Neck%20Pain%20Revision%20Decision%20Tree%202017%20-%20Ortho%20Section.pdf
- Jull G et al. Spine 2002: https://chiro.org/Headache/A_Randomized_Controlled_Trial.shtml
- Kelley MJ et al. Adhesive capsulitis guideline, JOSPT 2013: https://www.orthopt.org/uploads/content_files/ICF/Updated_Guidelines/Shoulder_Guidelines_AdhesiveCapsulitis_JOSPT_May_2013.pdf
- BESS/BOA/RCS commissioning guide: subacromial shoulder pain (2014): https://boa.ac.uk/asset/CAD0336B-9051-48A7-9E4DF7072C5C7E47
- Koc TA et al. Heel pain revision 2023 (via Physical Therapy First): https://physicaltherapyfirst.com/blog/heel-pain-plantar-fasciitis-revision-2023/
- Midportion Achilles tendinopathy revision 2024 (via Physical Therapy First): https://physicaltherapyfirst.com/blog/2024-clnical-practice-guideline-for-midportion-achilles-tendinopathy/
- Hupperets MDW et al. BMJ 2009 (via Medical News Today): https://www.medicalnewstoday.com/articles/157185/
- Vuurberg G et al. BJSM 2018: https://pubmed.ncbi.nlm.nih.gov/29514819/
- Lucado AM et al. Lateral elbow pain guideline, JOSPT 2022: https://www.orthopt.org/uploads/content_files/files/jospt.2022.0302.pdf
- Macfarlane GJ et al. EULAR fibromyalgia recommendations, Ann Rheum Dis 2017: https://ard.bmj.com/content/76/2/318.abstract
- ASAS-EULAR 2022 systematic literature review, Ann Rheum Dis 2023: https://ard.bmj.com/content/82/1/142
