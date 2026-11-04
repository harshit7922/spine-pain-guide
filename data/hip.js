window.SPG = window.SPG || {data:{modules:{}}};
/* Hip and groin module (v5.5). Questions, weights, rules and explanations for hip, groin and outer-thigh pain.
   Evidence table: research/hip-evidence.md. Weights from likelihood ratios use round(4 x log10(LR)); others are marked expert estimates there. */
(function(){
const PI = Math.PI;
const L = (en, hi) => ({en, hi});
const C = SPG.data.common;
C.SRC.push(
  ['acrhip','Altman R et al. ACR criteria for the classification of osteoarthritis of the hip. Arthritis Rheum 1991;34:505–14: clinical criteria sensitivity 86%, specificity 75%','https://www.physiotutors.com/wiki/hip-osteoarthritis-diagnosis'],
  ['hipoaind','Malhotra R et al. Femoral head–neck offset in the Indian population. Indian J Orthop 2012;46:212–5 (primary hip osteoarthritis is rare among Indians and Asians)','https://rcastoragev2.blob.core.windows.net/e797d4ff4da7ab65a27b9deee14d00d6/PMC3308664.pdf'],
  ['avnind','Yakkanti RR et al. Relative frequency of avascular necrosis of the hip as indication for primary total hip arthroplasty in the USA vs. India. J Orthop 2023;36:1–6 (India 51.8%, USA 5.97%)','https://vufind.lboro.ac.uk/PrimoRecord/cdi_pubmedcentral_primary_oai_pubmedcentral_nih_gov_9747526'],
  ['avn','FPnotebook – Avascular necrosis of the femoral head (men aged 30–50; steroids, alcohol, sickle cell disease; early X-ray normal, MRI preferred)','https://fpnotebook.com/Ortho/Hip/AvsclrNcrsOfThFmrlHd.htm'],
  ['slstest','Single-leg stance test for gluteal tendinopathy: Lequesne 2008 sensitivity 100%, specificity 97.3%; Grimaldi 2017 sensitivity 38%, specificity 100%','https://www.physiotutors.com/wiki/single-leg-stance-test/'],
  ['segal07','Segal NA et al. Greater trochanteric pain syndrome: epidemiology and associated factors. Arch Phys Med Rehabil 2007;88:988–92 (age 50–79: women 15.0% one side and 8.5% both; men 6.6% and 1.9%; female sex OR 3.37, low back pain OR 2.79)','https://www.qxmd.com/r/17678660'],
  ['leap','Mellor R et al. Education plus exercise versus corticosteroid injection versus wait and see for gluteal tendinopathy (LEAP). BMJ 2018;361:k1662 (success at 8 weeks 77.3% vs 58.5% vs 29.4%; at 52 weeks 78.6% vs 58.3% vs 51.9%)','https://www.running-physio.com/gluteal-leap/'],
  ['reiman15','Reiman MP et al. Diagnostic accuracy of clinical tests for hip femoroacetabular impingement/labral tear: systematic review with meta-analysis. Br J Sports Med 2015;49:811 (FADIR sensitivity 99%, specificity 5%)','https://www.physiotutors.com/wiki/faddir-test/'],
  ['faber','FABER (Patrick) test: groin pain points to the hip, back pain to the sacroiliac joint; for a painful sacroiliac joint sensitivity 50%, specificity 56% (Schneider 2020)','https://www.physiotutors.com/ro/wiki/patricks-test/'],
  ['nicehipfx','NICE CG124 Hip fracture: surgery on the day of, or the day after, admission','https://www.mddus.com/resources/resource-library/news-digest/2011/june/nice-urges-prompt-surgery-in-hip-fractures'],
  ['indhipfx','One-year mortality after proximal femur fracture surgery in India: 18.92% (1,101 patients, mean age 74). J Orthop Case Rep 2025;15(2):262–8','https://jocr.co.in/wp/2025/02/demographic-insights-into-one-year-mortality-following-proximal-femur-fracture-surgery-in-india/'],
  ['fnsf','Femoral neck stress fractures: military recruits and distance runners; 5% of all stress fractures; tension-side fractures can displace and need a surgeon; MRI shows them before X-ray','https://www.sportsmedreview.com/?p=14373'],
  ['kocher','Kocher criteria for septic hip in children (fever 38.5°C or more, will not bear weight, ESR over 40, white cells over 12,000): 3 criteria 93%, 4 criteria 99%; transient synovitis peaks at 3–8 years, boys 2:1','https://wikem.org/wiki/Transient_(Toxic)_Synovitis_(Hip)'],
  ['perthes','FPnotebook – Legg-Calvé-Perthes disease (age 4–9, peak 5–7; boys 4–5 times more often; pain may be felt in the knee; orthopaedic review within 1 week)','https://fpnotebook.com/Ortho/Peds/LgClvPrths.htm'],
  ['meralgia','5-Minute Clinical Consult – Meralgia paresthetica (4.3 per 10,000 person-years; about 7 times more common with diabetes; tight clothing or belts, obesity, pregnancy)','https://im.unboundmedicine.com/medicine/pview/5-Minute-Clinical-Consult/1688833/all/Meralgia%20Paresthetica'],
  ['hernia','Fitzgibbons RJ, Forse RA. Groin hernias in adults. N Engl J Med 2015 (lifetime risk 27% in men, 3% in women), summarised on Wikipedia','https://en.wikipedia.org/wiki/Inguinal_hernia'],
  ['doha','Weir A et al. Doha agreement meeting on terminology and definitions in groin pain in athletes. Br J Sports Med 2015;49:768–74','https://repub.eur.nl/pub/79674']
);
const ONSETS = [
  ['on_gradual',L('Slowly, with no clear reason','धीरे-धीरे, बिना किसी साफ़ वजह के')],
  ['on_fall',L('A fall onto the hip or side','कूल्हे या बगल के बल गिरना')],
  ['on_sport',L('Suddenly during sport: a kick, sprint, twist or change of direction','खेल के दौरान अचानक: किक, तेज़ दौड़, मुड़ना या दिशा बदलना')],
  ['on_training',L('More walking, running, marching or training than usual','सामान्य से ज़्यादा चलना, दौड़ना, मार्च या ट्रेनिंग')],
  ['on_lift',L('Lifting, straining or a bout of coughing','भारी उठाना, ज़ोर लगाना या खांसी का दौर')],
  ['on_woke',L('Woke up with it','सुबह उठे तो दर्द था')],
  ['on_accident',L('Road accident','सड़क दुर्घटना')]
];
const PAT = {
  char:[
    ['ch_groin_deep',L('A deep ache inside the hip, felt in the groin (people often cup the side of the hip with their hand)','कूल्हे के अंदर गहरा दर्द, जो जांघ के जोड़ (ग्रोइन) में महसूस हो (लोग अक्सर हाथ से कूल्हे को C की तरह पकड़कर बताते हैं)')],
    ['ch_stiff_short',L('Stiff in the morning or after sitting, easing within an hour','सुबह या बैठने के बाद जकड़न, जो एक घंटे के अंदर कम हो जाती है')],
    ['ch_stiff_long',L('Stiff in the morning for more than an hour','सुबह एक घंटे से ज़्यादा जकड़न')],
    ['ch_socks',L('Hard to put on socks or shoes, cut toenails or sit cross-legged on that side','उस तरफ़ मोज़े या जूते पहनना, नाखून काटना या पालथी मारकर बैठना मुश्किल')],
    ['ch_limp',L('Limping','लंगड़ाकर चलना')],
    ['ch_click_hip',L('Painful clicking, catching or locking deep in the hip','कूल्हे के अंदर दर्द के साथ क्लिक, अटकना या फंसना')],
    ['ch_lie_side',L('Pain when lying on that side at night','रात को उस करवट लेटने पर दर्द')],
    ['ch_lump_groin',L('A lump in the groin that gets bigger on coughing or standing and goes away on lying down','जांघ के जोड़ में गांठ जो खांसने या खड़े होने पर बड़ी हो और लेटने पर गायब हो जाए')],
    ['ch_burn_thigh',L('A burning, tingling or numb patch on the front and outer side of the thigh, with normal strength','जांघ के आगे और बाहरी हिस्से पर जलन, झनझनाहट या सुन्नपन का एक हिस्सा, ताकत सामान्य')],
    ['ch_shoot_leg',L('Shooting pain from the back or buttock down the leg below the knee','कमर या नितंब से घुटने के नीचे तक पैर में करंट जैसा दर्द')],
    ['ch_pull_groin',L('Sudden pain on the inner groin during a kick, sprint or quick turn','किक, तेज़ दौड़ या तेज़ी से मुड़ते समय जांघ के अंदरूनी जोड़ में अचानक दर्द')]
  ],
  worse:[
    ['w_walk_long',L('Walking or standing for long','देर तक चलना या खड़े रहना')],
    ['w_stairs',L('Stairs, slopes or getting up from a chair','सीढ़ियाँ, ढलान या कुर्सी से उठना')],
    ['w_deepflex',L('Deep bending: squatting, sitting on the floor, low seats or getting in and out of a car','गहरा मुड़ना: उकड़ू बैठना, ज़मीन पर बैठना, नीची सीट या कार में चढ़ना-उतरना')],
    ['w_cross_legs',L('Crossing the legs or standing with weight on one hip','पैर पर पैर रखकर बैठना या एक कूल्हे पर वज़न डालकर खड़े रहना')],
    ['w_pivot',L('Twisting or pivoting on the leg, sport','पैर पर मुड़ना या घूमना, खेल')],
    ['w_run',L('Running, jumping or marching','दौड़ना, कूदना या मार्च करना')],
    ['w_cough',L('Coughing, straining or lifting','खांसना, ज़ोर लगाना या भारी उठाना')]
  ],
  better:[['b_rest',L('Rest','आराम')]],
  other:[
    ['o_steroid',L('Steroid tablets or injections taken for weeks (for example for asthma, skin disease or COVID)','हफ्तों तक ली गई स्टेरॉयड गोलियां या इंजेक्शन (जैसे दमा, त्वचा रोग या कोविड के लिए)')],
    ['o_alcohol',L('Drinking alcohol most days','लगभग रोज़ शराब पीना')],
    ['o_sickle',L('Sickle cell disease','सिकल सेल रोग')],
    ['o_overweight',L('Overweight, or gained weight recently','ज़्यादा वज़न, या हाल में वज़न बढ़ा')],
    ['o_tight',L('Tight belt, trousers or waist pouch, pregnancy, or quick weight change','कसी बेल्ट, पैंट या कमर का पाउच, गर्भावस्था, या वज़न का तेज़ी से बदलना')],
    ['o_other_joints',L('Other joints also swollen or painful','दूसरे जोड़ भी सूजे या दर्द वाले')]
  ]
};
const RFS = [
  ['rf_fall_hip',L('After a fall: cannot stand or walk on the leg, or the leg looks shorter or turned outwards','गिरने के बाद: पैर पर खड़े या चल नहीं पाते, या पैर छोटा या बाहर की ओर मुड़ा दिखता है')],
  ['rf_hot',L('Fever with severe hip pain, or cannot put any weight on the leg and has a fever','तेज़ कूल्हे के दर्द के साथ बुखार, या बुखार के साथ पैर पर ज़रा भी वज़न नहीं डाल पाते')],
  ['rf_hernia',L('A groin lump that has become hard, very painful and will not go back, especially with vomiting','जांघ के जोड़ की गांठ जो सख्त, बहुत दर्दनाक हो गई है और वापस अंदर नहीं जाती, खासकर उल्टी के साथ')],
  ['rf_child_limp',L('A child or teenager is limping, or has hip, thigh or knee pain','बच्चा या किशोर लंगड़ा रहा है, या उसे कूल्हे, जांघ या घुटने में दर्द है')],
  ['rf_stress',L('Groin pain that started with running, marching or training and now hurts with every step or at rest','दौड़ने, मार्च या ट्रेनिंग से शुरू हुआ जांघ के जोड़ का दर्द जो अब हर कदम पर या आराम में भी होता है')],
  ['rf_fever',L('Fever, night sweats or weight loss without trying','बुखार, रात को पसीना या बिना कोशिश वज़न घटना')],
  ['rf_night',L('Constant pain at night that no position eases','रात को लगातार दर्द जो किसी भी पोज़िशन में कम न हो')]
];
const VIEWS = {
  groin:{az:0.35,el:0.08,d:1.05,yk:'hj',dy:-0.02,tx:0.07}, hip_side:{az:1.45,el:0.08,d:1.05,yk:'hj',dy:-0.02,tx:0.07},
  buttock:{az:PI-0.4,el:0.1,d:1.1,yk:'hj',dy:0.0,tx:0.07}, thigh_front:{az:0.6,el:0.05,d:1.5,yk:'hj',dy:-0.2,tx:0.08},
  hknee:{az:0.3,el:0.1,d:1.05,yk:'knee',dy:0,tx:0.12}, lowback:{az:PI,el:0.1,d:2.0,yk:'hj',dy:0.18}
};
const AREAS = [
  {id:'groin',pair:true,view:'groin',name:L('Groin (the crease at the top of the thigh)','जांघ का जोड़ (ग्रोइन, जांघ के ऊपर का मोड़)'),desc:L('The front crease where the thigh meets the lower belly.','आगे का वह मोड़ जहाँ जांघ पेट के निचले हिस्से से मिलती है।'),rel:L('Pain from inside the hip joint (wear, impingement, loss of blood supply) is felt mostly in the groin; a groin lump may be a hernia.','कूल्हे के जोड़ के अंदर का दर्द (घिसावट, इंपिंजमेंट, खून की सप्लाई रुकना) ज़्यादातर जांघ के जोड़ में महसूस होता है; यहाँ गांठ हर्निया हो सकती है।')},
  {id:'hip_side',pair:true,view:'hip_side',name:L('Outer side of the hip (the bony point)','कूल्हे का बाहरी हिस्सा (हड्डी का उभार)'),desc:L('The bony point on the outside of the hip that you lie on when lying on your side.','कूल्हे के बाहर की हड्डी का उभार, जिस पर करवट लेकर लेटते समय वज़न आता है।'),rel:L('Pain here, worse lying on that side, is usually from the buttock tendons (greater trochanteric pain), not the hip joint.','यहाँ दर्द, जो उस करवट लेटने पर बढ़े, आमतौर पर नितंब के टेंडन (ग्रेटर ट्रोकैन्टेरिक दर्द) से होता है, कूल्हे के जोड़ से नहीं।')},
  {id:'buttock',pair:true,view:'buttock',name:L('Buttock','नितंब (कूल्हे का पिछला हिस्सा)'),desc:L('The fleshy area at the back of the hip.','कूल्हे के पीछे का मांसल हिस्सा।'),rel:L('Buttock pain often comes from the lower back or the sacroiliac joint; the hip joint can also hurt here.','नितंब का दर्द अक्सर कमर या सैक्रोइलियक जोड़ से आता है; कूल्हे का जोड़ भी यहाँ दर्द दे सकता है।')},
  {id:'thigh_front',pair:true,view:'thigh_front',name:L('Front or outer side of the thigh','जांघ का अगला या बाहरी हिस्सा'),desc:L('The thigh between the groin and the knee.','जांघ के जोड़ और घुटने के बीच की जांघ।'),rel:L('Hip joint pain spreads down the front of the thigh; a burning numb patch on the outer thigh is a pinched skin nerve (meralgia).','कूल्हे के जोड़ का दर्द जांघ के आगे नीचे तक फैलता है; बाहरी जांघ पर जलन वाला सुन्न हिस्सा त्वचा की दबी नस (मेराल्जिया) है।')},
  {id:'hknee',pair:true,view:'hknee',regs:['knee_front'],name:L('Knee, as well as the hip','घुटना, कूल्हे के साथ'),desc:L('Pain felt in the knee together with hip or thigh pain.','कूल्हे या जांघ के दर्द के साथ घुटने में महसूस होने वाला दर्द।'),rel:L('Hip problems often send pain to the knee; in children this can hide a serious hip condition.','कूल्हे की समस्या अक्सर घुटने तक दर्द भेजती है; बच्चों में इसके पीछे कूल्हे की गंभीर बीमारी छिपी हो सकती है।')},
  {id:'lowback',pair:false,view:'lowback',name:L('Lower back','कमर'),desc:L('The lower back, between the bottom ribs and the buttocks.','कमर, नीचे की पसलियों और नितंबों के बीच।'),rel:L('Hip and buttock pain with back pain may come from the lower back or the sacroiliac joint.','कमर दर्द के साथ कूल्हे और नितंब का दर्द कमर या सैक्रोइलियक जोड़ से हो सकता है।')}
];
const TESTS = [
  {id:'sls',name:L('Stand on one leg for 30 seconds','30 सेकंड एक पैर पर खड़े रहना'),
   steps:[L('Stand side-on to a wall and rest one finger on it for balance only.','दीवार के बगल में खड़े हों और सिर्फ़ संतुलन के लिए एक उंगली दीवार पर रखें।'),L('Lift the foot of the good leg so that you stand on the painful leg, and hold for up to 30 seconds. Stop if it hurts.','ठीक वाले पैर का पंजा उठाएं ताकि दर्द वाले पैर पर खड़े हों, और 30 सेकंड तक रुकें। दर्द हो तो रुक जाएं।')],
   pos:L('It brings on your pain on the outer side of the hip within 30 seconds.','30 सेकंड के अंदर कूल्हे के बाहरी हिस्से में आपका दर्द आ जाए।'),
   acc:L('Pain on the outer hip within 30 seconds was found in 100% and 38% of people with gluteal tendon problems in two studies, and almost never without them (specificity 97–100%): a positive test is strong evidence; a negative one does not rule it out.','दो अध्ययनों में नितंब के टेंडन की समस्या वाले 100% और 38% लोगों में 30 सेकंड में कूल्हे के बाहर दर्द आया, और इसके बिना लगभग कभी नहीं (विशिष्टता 97–100%): पॉज़िटिव टेस्ट मज़बूत सबूत है; नेगेटिव होने से यह खारिज नहीं होता।'),src:'slstest',ans:[['sls_pos','tPos','y'],['sls_neg','tNeg','n'],['sls_skip','tSkip','s']]},
  {id:'faber',name:L('Figure-4 position lying on your back (FABER)','पीठ के बल लेटकर 4 जैसी स्थिति (FABER)'),
   steps:[L('Lie on your back on a bed. Bend the painful leg and rest that ankle just above the other knee, making a figure 4.','बिस्तर पर पीठ के बल लेटें। दर्द वाला पैर मोड़ें और उसका टखना दूसरे घुटने के ठीक ऊपर रखें, जिससे 4 जैसी आकृति बने।'),L('Let the bent knee slowly fall outwards towards the bed. Do not push it. Notice where you feel pain.','मुड़े घुटने को धीरे-धीरे बाहर की ओर बिस्तर की तरफ़ गिरने दें। धक्का न दें। ध्यान दें कि दर्द कहाँ होता है।')],
   pos:L('Pain in the groin, or pain at the back near the buttock or lower back.','जांघ के जोड़ में दर्द, या पीछे नितंब या कमर के पास दर्द।'),
   acc:L('This position stresses the hip joint and the sacroiliac joint. Groin pain points to the hip joint; pain at the back points to the sacroiliac joint or lower back. On its own it is not accurate (for the sacroiliac joint, sensitivity 50%, specificity 56%), so it only adds a little.','यह स्थिति कूल्हे के जोड़ और सैक्रोइलियक जोड़ पर ज़ोर डालती है। जांघ के जोड़ में दर्द कूल्हे के जोड़ की ओर; पीछे दर्द सैक्रोइलियक जोड़ या कमर की ओर इशारा करता है। अकेले यह सटीक नहीं (सैक्रोइलियक जोड़ के लिए संवेदनशीलता 50%, विशिष्टता 56%), इसलिए इससे थोड़ी ही मदद मिलती है।'),src:'faber',ans:[['faber_groin','tFaberGroin','y'],['faber_back','tFaberBack','y'],['faber_neg','tNeg','n'],['faber_skip','tSkip','s']]}
];
const D = C.DEPTS;
D.medicine = D.medicine || {n:L('General medicine / Internal medicine','जनरल मेडिसिन / इंटरनल मेडिसिन'),s:L('Whole-body causes: blood tests, infections, diabetes, gout.','पूरे शरीर से जुड़े कारण: ब्लड टेस्ट, इन्फेक्शन, डायबिटीज़, गाउट।'),q:'physician'};
D.sports = D.sports || {n:L('Sports medicine / Arthroscopy','स्पोर्ट्स मेडिसिन / आर्थ्रोस्कोपी'),s:L('Ligament, cartilage and sports-related joint problems.','लिगामेंट, कार्टिलेज और खेल से जुड़ी जोड़ों की समस्याएं।'),q:'sports medicine arthroscopy surgeon'};
D.paeds = D.paeds || {n:L('Paediatric orthopaedics','बाल हड्डी रोग (पीडियाट्रिक ऑर्थोपेडिक्स)'),s:L('Bone and joint problems in children and teenagers.','बच्चों और किशोरों में हड्डी और जोड़ों की समस्याएं।'),q:'pediatric orthopedic'};
D.surgery = D.surgery || {n:L('General surgery','जनरल सर्जरी'),s:L('Hernias and other problems of the belly wall and abdomen.','हर्निया और पेट की दीवार व पेट की दूसरी समस्याएं।'),q:'general surgeon hernia'};
const hipAreas = ['groin','hip_side','buttock','thigh_front'];
const CONDS = [
  {id:'hipoa',th:[10,7,4],anchor:['groin','ch_socks','hipoa_cl'],depts:['ortho','physio'],
   name:L('Hip osteoarthritis (wear of the hip joint)','कूल्हे का ऑस्टियोआर्थराइटिस (कूल्हे के जोड़ की घिसावट)'),sci:'Hip osteoarthritis',
   what:L('The cartilage lining the ball-and-socket hip joint wears thin. Pain is felt mainly in the groin and front of the thigh, sometimes in the buttock or knee, with walking and stairs; the hip stiffens after rest, and putting on socks or cutting toenails becomes hard because the hip no longer turns and bends fully.','गेंद-कटोरी जैसे कूल्हे के जोड़ की कार्टिलेज पतली हो जाती है। दर्द मुख्य रूप से जांघ के जोड़ और जांघ के आगे, कभी नितंब या घुटने में, चलने और सीढ़ी पर होता है; आराम के बाद कूल्हा जकड़ता है, और मोज़े पहनना या नाखून काटना मुश्किल हो जाता है क्योंकि कूल्हा पूरा घूमता और मुड़ता नहीं।'),
   causes:L('Age, earlier hip problems (childhood hip disease, impingement, avascular necrosis), injury and family history. Primary hip osteoarthritis is less common among Indians than in Western countries; in India, hip pain in younger adults is more often avascular necrosis.','उम्र, कूल्हे की पुरानी समस्याएं (बचपन की कूल्हे की बीमारी, इंपिंजमेंट, एवैस्कुलर नेक्रोसिस), चोट और पारिवारिक इतिहास। भारतीयों में प्राथमिक कूल्हे का ऑस्टियोआर्थराइटिस पश्चिमी देशों से कम है; भारत में कम उम्र के वयस्कों में कूल्हे का दर्द ज़्यादा बार एवैस्कुलर नेक्रोसिस होता है।'),cSrc:['hipoaind','niceoa'],
   confirm:L('Examination, especially reduced and painful inward turning of the hip, and an X-ray. Clinical criteria based on age, morning stiffness and hip movement pick up 86% of cases.','जांच, खासकर कूल्हे का अंदर की ओर घूमना कम और दर्दनाक होना, और एक्स-रे। उम्र, सुबह की जकड़न और कूल्हे की हरकत पर आधारित क्लिनिकल मापदंड 86% मामले पकड़ते हैं।'),
   treat:L('Exercise tailored to you (hip and thigh strengthening, walking, swimming or cycling) and weight loss if overweight; a walking stick in the opposite hand eases load. Hip replacement is a very successful operation when pain and stiffness seriously affect life.','आपके हिसाब से व्यायाम (कूल्हे और जांघ को मज़बूत करना, चलना, तैरना या साइकिल) और ज़्यादा वज़न हो तो वज़न कम करना; उल्टे हाथ में छड़ी से भार कम होता है। जब दर्द और जकड़न जीवन पर बहुत असर डालें तो कूल्हा बदलने का ऑपरेशन बहुत सफल है।'),
   outlook:L('It usually progresses slowly over years; exercise improves pain and function.','आमतौर पर सालों में धीरे-धीरे बढ़ता है; व्यायाम से दर्द और काम करने की क्षमता सुधरती है।'),oSrc:['niceoa','acrhip'],
   w:{hipoa_cl:2,nice_hip:2,groin:3,thigh_front:1,hknee:1,buttock:1,ch_socks:2,ch_stiff_short:1,ch_groin_deep:1,ch_limp:1,w_walk_long:1,w_stairs:1,w_deepflex:1,faber_groin:1,on_gradual:2,
      a_60p:2,a_50_59:1,h_1_5y:1,h_5y:2,o_overweight:1,
      a_u18:-4,a_18_29:-3,a_30_39:-2,ch_stiff_long:-2,ch_shoot_leg:-1,ch_pull_groin:-2,ch_lump_groin:-2,ch_burn_thigh:-2,sls_pos:-1}},
  {id:'gtps',th:[10,7,4],anchor:['hip_side','sls_pos'],depts:['physio','ortho'],
   name:L('Outer hip pain from the buttock tendons (gluteal tendinopathy, “trochanteric bursitis”)','नितंब के टेंडन से कूल्हे के बाहर का दर्द (ग्लूटियल टेंडिनोपैथी, “ट्रोकैन्टेरिक बर्साइटिस”)'),sci:'Greater trochanteric pain syndrome (gluteal tendinopathy)',
   what:L('The tendons of the buttock muscles attach to the bony point on the outer hip (the greater trochanter). When they are overloaded or squashed, the outer hip aches, hurts to lie on at night, and hurts on stairs, standing on one leg and crossing the legs. The hip joint itself is usually healthy.','नितंब की मांसपेशियों के टेंडन कूल्हे के बाहर की हड्डी के उभार (ग्रेटर ट्रोकैन्टर) से जुड़ते हैं। ज़्यादा भार या दबाव से कूल्हे के बाहर दर्द होता है, रात को उस करवट लेटने पर, सीढ़ी पर, एक पैर पर खड़े होने और पैर पर पैर रखने पर दर्द होता है। कूल्हे का जोड़ खुद आमतौर पर ठीक होता है।'),
   causes:L('Very common in women over 40: in people aged 50–79, 23.5% of women and 8.5% of men had it on one or both sides. Linked to low back pain, knee arthritis, crossing the legs and sudden increases in walking.','40 से ऊपर की महिलाओं में बहुत आम: 50–79 साल के लोगों में 23.5% महिलाओं और 8.5% पुरुषों को एक या दोनों तरफ़ था। कमर दर्द, घुटने की गठिया, पैर पर पैर रखने और अचानक ज़्यादा चलने से जुड़ा।'),cSrc:['segal07'],
   confirm:L('Examination: tenderness on the bony point and pain standing on one leg for 30 seconds; ultrasound or MRI only if the picture is unclear.','जांच: हड्डी के उभार पर दबाने से दर्द और 30 सेकंड एक पैर पर खड़े होने पर दर्द; तस्वीर साफ़ न हो तभी अल्ट्रासाउंड या MRI।'),
   treat:L('Education (avoid crossing the legs, hanging on one hip and lying on the painful side; a pillow between the knees) plus a graded strengthening programme. In a trial, this helped 77% at 8 weeks, more than a steroid injection (59%) or waiting (29%), and stayed better at a year.','जानकारी (पैर पर पैर न रखना, एक कूल्हे पर वज़न डालकर न खड़े होना, दर्द वाली करवट न लेटना; घुटनों के बीच तकिया) और धीरे-धीरे बढ़ने वाला मज़बूती का कार्यक्रम। एक ट्रायल में इससे 8 हफ्तों में 77% को फ़ायदा हुआ, जो स्टेरॉयड इंजेक्शन (59%) या इंतज़ार (29%) से ज़्यादा था, और एक साल में भी बेहतर रहा।'),
   outlook:L('Most improve over months with education and exercise; injections give short relief only.','ज़्यादातर जानकारी और व्यायाम से महीनों में सुधरते हैं; इंजेक्शन से सिर्फ़ थोड़े समय की राहत।'),oSrc:['leap'],
   w:{hip_side:4,ch_lie_side:3,w_cross_legs:2,sls_pos:4,sls_neg:-1,w_stairs:1,w_walk_long:1,sex_f:2,a_40_49:1,a_50_59:1,a_60p:1,lowback:1,on_gradual:1,o_overweight:1,
      groin:-2,ch_socks:-1,ch_groin_deep:-2,ch_shoot_leg:-1,a_u18:-3,a_18_29:-1,ch_lump_groin:-2,ch_pull_groin:-2}},
  {id:'fai',th:[10,7,4],anchor:['ch_click_hip','ch_groin_deep','w_deepflex'],depts:['sports','ortho','physio'],
   name:L('Hip impingement or labral tear (FAI)','कूल्हे का इंपिंजमेंट या लैब्रम फटना (FAI)'),sci:'Femoroacetabular impingement syndrome / acetabular labral tear',
   what:L('An extra bump on the ball or the rim of the hip socket makes them pinch together when the hip bends deeply and turns. This can tear the labrum, the rubbery rim of the socket. It causes a deep groin ache with sitting, squatting, getting into a car and pivoting sport, sometimes with painful clicking or catching.','कूल्हे की गेंद या कटोरी के किनारे पर एक अतिरिक्त उभार की वजह से गहरा मुड़ने और घूमने पर दोनों आपस में दबते हैं। इससे लैब्रम, यानी कटोरी का रबर जैसा किनारा, फट सकता है। बैठने, उकड़ू बैठने, कार में चढ़ने और मुड़ने वाले खेल में जांघ के जोड़ में गहरा दर्द होता है, कभी दर्द के साथ क्लिक या अटकना।'),
   causes:L('Young, active adults; football, cricket, hockey, martial arts, yoga and dance with deep hip bending. The bony shape is found in many people without pain, so symptoms matter more than scans.','युवा, सक्रिय वयस्क; फुटबॉल, क्रिकेट, हॉकी, मार्शल आर्ट, योग और नृत्य जिनमें कूल्हा गहरा मुड़ता है। यह हड्डी का आकार बिना दर्द वाले कई लोगों में भी मिलता है, इसलिए स्कैन से ज़्यादा लक्षण मायने रखते हैं।'),cSrc:['hipoaind'],
   confirm:L('Examination by a doctor or physiotherapist: the FADIR test (bending the hip and turning it inwards) is positive in 99% of people with impingement, so a negative test makes it unlikely; it is also positive in many without it. X-rays and an MRI arthrogram if surgery is being considered.','डॉक्टर या फिज़ियोथेरेपिस्ट द्वारा जांच: FADIR टेस्ट (कूल्हा मोड़कर अंदर घुमाना) इंपिंजमेंट वाले 99% लोगों में पॉज़िटिव होता है, इसलिए नेगेटिव टेस्ट से इसकी संभावना कम होती है; यह बिना इंपिंजमेंट वाले कई लोगों में भी पॉज़िटिव होता है। सर्जरी पर विचार हो तो एक्स-रे और MRI आर्थ्रोग्राम।'),
   treat:L('Physiotherapy (hip and trunk strengthening, changing deep-bending activities) first; keyhole hip surgery (arthroscopy) for people who do not improve.','पहले फिज़ियोथेरेपी (कूल्हे और धड़ की मज़बूती, गहरे मुड़ने वाली गतिविधियाँ बदलना); सुधार न हो तो की-होल कूल्हे की सर्जरी (आर्थ्रोस्कोपी)।'),
   outlook:L('Many manage well with exercise and activity changes; surgery helps selected people.','कई लोग व्यायाम और गतिविधि में बदलाव से अच्छी तरह संभाल लेते हैं; चुने हुए लोगों में सर्जरी मदद करती है।'),oSrc:['reiman15'],
   w:{groin:3,ch_groin_deep:2,ch_click_hip:3,w_deepflex:2,w_pivot:2,on_sport:1,faber_groin:1,a_18_29:2,a_30_39:2,a_40_49:1,w_run:1,
      a_60p:-2,a_50_59:-1,a_u18:-1,hip_side:-1,ch_stiff_long:-1,ch_lump_groin:-3,ch_burn_thigh:-2,ch_shoot_leg:-1,hipoa_cl:-1}},
  {id:'avn',th:[10,7,4],anchor:['avn_risk'],depts:['ortho'],
   name:L('Avascular necrosis of the hip (loss of blood supply to the ball of the hip)','कूल्हे का एवैस्कुलर नेक्रोसिस (कूल्हे की गेंद में खून की सप्लाई रुकना)'),sci:'Osteonecrosis (avascular necrosis) of the femoral head',
   what:L('Part of the ball of the hip loses its blood supply and the bone slowly dies and can collapse. It causes groin pain, at first with walking and later at rest and at night, a limp and a stiff hip. Early X-rays can be normal, so an MRI is needed when it is suspected.','कूल्हे की गेंद के एक हिस्से की खून की सप्लाई रुक जाती है और हड्डी धीरे-धीरे मरकर दब सकती है। इससे जांघ के जोड़ में दर्द होता है, पहले चलने पर और बाद में आराम और रात में भी, लंगड़ाहट और कूल्हे में जकड़न। शुरू में एक्स-रे सामान्य हो सकता है, इसलिए शक होने पर MRI ज़रूरी है।'),
   causes:L('Steroid tablets or injections (including courses given for COVID), regular alcohol, sickle cell disease, injury, and sometimes no cause; it often affects both hips and is common in men aged 30–50. In India it is the reason for about half (51.8%) of hip replacements, compared with 6% in the USA.','स्टेरॉयड गोलियां या इंजेक्शन (कोविड में दिए गए कोर्स समेत), नियमित शराब, सिकल सेल रोग, चोट, और कभी कोई वजह नहीं; अक्सर दोनों कूल्हों में होता है और 30–50 साल के पुरुषों में आम है। भारत में लगभग आधे (51.8%) कूल्हा बदलने के ऑपरेशन इसी वजह से होते हैं, जबकि अमेरिका में 6%।'),cSrc:['avn','avnind'],
   confirm:L('An MRI scan of both hips (early X-rays are often normal).','दोनों कूल्हों का MRI स्कैन (शुरुआती एक्स-रे अक्सर सामान्य होते हैं)।'),
   treat:L('Stopping alcohol and reviewing steroids with the prescribing doctor; in early stages, reduced weight-bearing and hip-preserving surgery (core decompression); after collapse, hip replacement.','शराब बंद करना और स्टेरॉयड के बारे में लिखने वाले डॉक्टर से बात; शुरुआती चरण में पैर पर कम वज़न और कूल्हा बचाने वाली सर्जरी (कोर डीकम्प्रेशन); हड्डी दबने के बाद कूल्हा बदलना।'),
   outlook:L('Found early, the hip can sometimes be saved; that is why groin pain after steroids or with heavy drinking should be seen soon.','जल्दी पकड़ में आए तो कभी-कभी कूल्हा बचाया जा सकता है; इसलिए स्टेरॉयड के बाद या ज़्यादा शराब के साथ जांघ के जोड़ का दर्द जल्दी दिखाना चाहिए।'),oSrc:['avn'],
   w:{groin:3,o_steroid:4,r_bones:2,o_alcohol:3,o_sickle:4,ch_limp:1,w_walk_long:1,ch_socks:1,ch_groin_deep:1,thigh_front:1,hknee:1,a_30_39:2,a_40_49:2,a_18_29:1,sex_m:1,rf_night:1,on_gradual:1,
      a_u18:-2,a_60p:-1,hip_side:-2,ch_click_hip:-1,ch_lump_groin:-3,ch_burn_thigh:-2,ch_pull_groin:-2}},
  {id:'stressfx',th:[9,6,4],anchor:['on_training','rf_stress'],depts:['ortho','sports'],
   name:L('Stress fracture of the hip (femoral neck)','कूल्हे का स्ट्रेस फ्रैक्चर (फ़ीमर की गर्दन)'),sci:'Femoral neck stress fracture',
   what:L('Repeated loading without enough recovery causes a crack in the neck of the thigh bone just below the ball of the hip. It causes groin or front-thigh pain that comes on with running or marching and then with walking, often with a limp. Some of these can break fully and displace, so it is treated as urgent.','पर्याप्त आराम के बिना बार-बार भार पड़ने से कूल्हे की गेंद के ठीक नीचे जांघ की हड्डी की गर्दन में दरार आ जाती है। दौड़ने या मार्च से शुरू होकर फिर चलने पर भी जांघ के जोड़ या जांघ के आगे दर्द होता है, अक्सर लंगड़ाहट के साथ। इनमें से कुछ पूरी टूटकर खिसक सकती हैं, इसलिए इसे जल्दी का मामला माना जाता है।'),
   causes:L('Military, police and sports recruits, distance runners, a sudden rise in training, women with low energy intake or missed periods, and weak bones. It makes up about 5% of stress fractures.','सेना, पुलिस और खेल के नए रंगरूट, लंबी दूरी के धावक, ट्रेनिंग में अचानक बढ़ोतरी, कम खाना खाने या माहवारी रुकने वाली महिलाएं, और कमज़ोर हड्डियाँ। यह लगभग 5% स्ट्रेस फ्रैक्चर होते हैं।'),cSrc:['fnsf'],
   confirm:L('An MRI scan, which shows it before an X-ray does.','MRI स्कैन, जो एक्स-रे से पहले इसे दिखा देता है।'),
   treat:L('Stop running and impact at once; crutches and no weight on the leg until a doctor has seen the scan. Fractures on the tension (upper) side often need surgical fixation.','तुरंत दौड़ना और झटके वाली गतिविधि बंद करें; जब तक डॉक्टर स्कैन न देख लें, बैसाखी और पैर पर वज़न नहीं। तनाव वाली (ऊपरी) तरफ़ के फ्रैक्चर में अक्सर सर्जरी से जोड़ना पड़ता है।'),
   outlook:L('Treated early, most heal over weeks to a few months (return to running about 7–14 weeks in early grades).','जल्दी इलाज से ज़्यादातर कुछ हफ्तों से कुछ महीनों में भरते हैं (शुरुआती ग्रेड में दौड़ने में वापसी लगभग 7–14 हफ्ते)।'),oSrc:['fnsf'],
   w:{rf_stress:5,on_training:4,w_run:2,groin:2,thigh_front:1,ch_limp:1,sex_f:1,a_18_29:2,a_u18:1,a_30_39:1,r_bones:1,rf_night:1,
      a_60p:-2,a_50_59:-1,on_gradual:-1,hip_side:-1,ch_lump_groin:-3,ch_burn_thigh:-2,ch_click_hip:-1}},
  {id:'hipchild',th:[8,6,4],anchor:['rf_child_limp','ch_limp'],onlyIf:'a_u18',depts:['paeds','ortho'],
   name:L('Hip problem in a growing child (irritable hip, Perthes disease or slipped growth plate)','बढ़ते बच्चे में कूल्हे की समस्या (इरिटेबल हिप, पर्थीस रोग या खिसकी ग्रोथ प्लेट)'),sci:'Transient synovitis / Legg-Calvé-Perthes disease / slipped capital femoral epiphysis',
   what:L('A limp or hip, thigh or knee pain in a child needs the hip checked. The common causes depend on age: an “irritable hip” after a cold (age 3–8, settles within about 2 weeks), Perthes disease, where the ball of the hip temporarily loses its blood supply (age 4–9), and a slipped growth plate in older, often overweight, children (about 10–16). Hip pain is often felt only in the knee.','बच्चे में लंगड़ाहट या कूल्हे, जांघ या घुटने का दर्द हो तो कूल्हा जांचना ज़रूरी है। आम कारण उम्र पर निर्भर हैं: सर्दी-ज़ुकाम के बाद “इरिटेबल हिप” (3–8 साल, लगभग 2 हफ्ते में ठीक), पर्थीस रोग, जिसमें कूल्हे की गेंद की खून की सप्लाई कुछ समय के लिए रुकती है (4–9 साल), और बड़े, अक्सर ज़्यादा वज़न वाले बच्चों में खिसकी ग्रोथ प्लेट (लगभग 10–16 साल)। कूल्हे का दर्द अक्सर सिर्फ़ घुटने में महसूस होता है।'),
   causes:L('Irritable hip follows a viral illness in 32–50%; Perthes affects boys 4–5 times more often; a slipped growth plate presents with knee pain in 26% and is linked to excess weight.','इरिटेबल हिप 32–50% में वायरल बीमारी के बाद होता है; पर्थीस लड़कों में 4–5 गुना ज़्यादा; खिसकी ग्रोथ प्लेट 26% में घुटने के दर्द के रूप में आती है और ज़्यादा वज़न से जुड़ी है।'),cSrc:['kocher','perthes','scfe'],
   confirm:L('Examination of the hip and X-rays of both hips (including a frog-leg view); blood tests and an ultrasound if there is fever, to rule out infection.','कूल्हे की जांच और दोनों कूल्हों का एक्स-रे (फ्रॉग-लेग व्यू समेत); बुखार हो तो इन्फेक्शन खारिज करने के लिए ब्लड टेस्ट और अल्ट्रासाउंड।'),
   treat:L('Irritable hip: rest and pain relief. Perthes: orthopaedic care within a week. A slipped growth plate: no weight on the leg and urgent surgery to pin it.','इरिटेबल हिप: आराम और दर्द की दवा। पर्थीस: एक हफ्ते के अंदर हड्डी रोग विशेषज्ञ की देखभाल। खिसकी ग्रोथ प्लेट: पैर पर वज़न नहीं और जल्दी सर्जरी से पिन लगाना।'),
   outlook:L('Most limping children have an irritable hip that settles, but a missed slipped growth plate or infection can damage the hip for life, so see a doctor promptly.','ज़्यादातर लंगड़ाते बच्चों को इरिटेबल हिप होता है जो ठीक हो जाता है, पर छूटी हुई खिसकी ग्रोथ प्लेट या इन्फेक्शन कूल्हे को जीवनभर के लिए नुकसान पहुंचा सकते हैं, इसलिए जल्दी डॉक्टर को दिखाएं।'),oSrc:['scfe','perthes'],
   w:{rf_child_limp:4,a_u18:3,ch_limp:2,groin:2,thigh_front:1,hknee:2,o_overweight:1,on_gradual:1,sex_m:1,ch_socks:1,ch_pull_groin:-2,on_sport:-1}},
  {id:'adductor',th:[9,6,4],anchor:['ch_pull_groin','on_sport'],depts:['sports','physio'],
   name:L('Groin strain (adductor-related groin pain)','ग्रोइन स्ट्रेन (जांघ की अंदरूनी मांसपेशी से जुड़ा दर्द)'),sci:'Adductor-related groin pain',
   what:L('The inner-thigh (adductor) muscles or their attachment to the pubic bone are strained by kicking, sprinting and quick changes of direction. Pain is on the inner groin, worse when squeezing the knees together or kicking.','किक, तेज़ दौड़ और तेज़ी से दिशा बदलने से जांघ की अंदरूनी (एडक्टर) मांसपेशियाँ या प्यूबिक हड्डी पर उनका जुड़ाव खिंच जाता है। दर्द जांघ के अंदरूनी जोड़ पर होता है, घुटनों को आपस में दबाने या किक करने पर बढ़ता है।'),
   causes:L('Football, hockey, kabaddi, cricket and running sports. Experts classify groin pain in athletes as adductor-, iliopsoas-, inguinal- or pubic-related, hip-related or other.','फुटबॉल, हॉकी, कबड्डी, क्रिकेट और दौड़ने वाले खेल। विशेषज्ञ खिलाड़ियों के ग्रोइन दर्द को एडक्टर, इलियोप्सोआस, इंगुइनल या प्यूबिक हड्डी से जुड़ा, कूल्हे से जुड़ा या अन्य में बांटते हैं।'),cSrc:['doha'],
   confirm:L('Examination: tenderness at the adductor attachment and pain on resisted squeezing; ultrasound or MRI if it does not settle.','जांच: एडक्टर के जुड़ाव पर दबाने से दर्द और रुकावट के खिलाफ़ दबाने पर दर्द; ठीक न हो तो अल्ट्रासाउंड या MRI।'),
   treat:L('Relative rest from kicking and sprinting, then a graded adductor strengthening programme with a physiotherapist before return to sport.','किक और तेज़ दौड़ से कुछ आराम, फिर खेल में लौटने से पहले फिज़ियोथेरेपिस्ट के साथ धीरे-धीरे बढ़ता एडक्टर मज़बूती कार्यक्रम।'),
   outlook:L('Most acute strains settle within weeks; long-standing groin pain needs a structured programme.','ज़्यादातर नए खिंचाव कुछ हफ्तों में ठीक होते हैं; लंबे समय का ग्रोइन दर्द व्यवस्थित कार्यक्रम मांगता है।'),
   w:{ch_pull_groin:4,on_sport:3,w_pivot:1,w_run:1,groin:2,sex_m:1,a_18_29:2,a_30_39:1,a_u18:1,
      a_60p:-2,ch_socks:-1,ch_stiff_short:-1,on_gradual:-1,ch_lump_groin:-2,hip_side:-1,o_steroid:-1}},
  {id:'hernia',th:[8,6,4],anchor:['ch_lump_groin'],depts:['surgery'],
   name:L('Groin hernia (inguinal or femoral hernia)','जांघ के जोड़ का हर्निया (इंगुइनल या फ़ेमोरल हर्निया)'),sci:'Inguinal / femoral hernia',
   what:L('Part of the belly contents pushes through a weak spot in the belly wall at the groin, making a lump that bulges on coughing, straining or standing and goes back on lying down, with a dragging ache. If it becomes hard, very painful and will not go back, the bowel may be trapped — an emergency.','पेट के अंदर का कुछ हिस्सा जांघ के जोड़ पर पेट की दीवार की कमज़ोर जगह से बाहर निकलता है, जिससे खांसने, ज़ोर लगाने या खड़े होने पर उभरने वाली और लेटने पर वापस जाने वाली गांठ बनती है, खिंचाव वाले दर्द के साथ। अगर यह सख्त, बहुत दर्दनाक हो जाए और वापस न जाए तो आंत फंस सकती है — यह इमरजेंसी है।'),
   causes:L('Very common in men: about 27% of men and 3% of women get a groin hernia in their lifetime. Heavy lifting, chronic cough, constipation and straining add to the risk.','पुरुषों में बहुत आम: लगभग 27% पुरुषों और 3% महिलाओं को जीवन में ग्रोइन हर्निया होता है। भारी उठाना, पुरानी खांसी, कब्ज़ और ज़ोर लगाना खतरा बढ़ाते हैं।'),cSrc:['hernia'],
   confirm:L('Examination by a doctor, standing and coughing; ultrasound if unclear.','डॉक्टर द्वारा खड़े होकर और खांसकर जांच; साफ़ न हो तो अल्ट्रासाउंड।'),
   treat:L('A surgeon advises on repair (open or keyhole surgery with a mesh); some small, painless hernias in men can be watched.','सर्जन मरम्मत (मेश के साथ खुली या की-होल सर्जरी) की सलाह देते हैं; पुरुषों में कुछ छोटे, बिना दर्द वाले हर्निया पर नज़र रखी जा सकती है।'),
   outlook:L('Repair is routine and effective; do not ignore a lump that becomes painful and stuck.','मरम्मत आम और असरदार है; दर्दनाक होकर फंसी गांठ को नज़रअंदाज़ न करें।'),
   w:{ch_lump_groin:5,w_cough:3,on_lift:2,groin:2,sex_m:2,a_50_59:1,a_60p:1,
      ch_socks:-1,hip_side:-2,buttock:-2,ch_limp:-1,ch_stiff_short:-1,ch_click_hip:-2}},
  {id:'meralgia',th:[8,6,4],anchor:['ch_burn_thigh'],depts:['neuro','gp'],
   name:L('Meralgia paresthetica (pinched skin nerve of the thigh)','मेराल्जिया पैरेस्थेटिका (जांघ की त्वचा की दबी नस)'),sci:'Lateral femoral cutaneous nerve entrapment',
   what:L('A nerve that only carries feeling from the skin of the outer thigh is squeezed where it passes under the groin ligament near the hip bone. It causes burning, tingling or numbness over the front and outer thigh, without weakness, often worse when standing or walking.','एक नस जो सिर्फ़ बाहरी जांघ की त्वचा से संवेदना लाती है, कूल्हे की हड्डी के पास जांघ के जोड़ के लिगामेंट के नीचे से गुज़रते समय दब जाती है। इससे जांघ के आगे और बाहर जलन, झनझनाहट या सुन्नपन होता है, कमज़ोरी के बिना, अक्सर खड़े होने या चलने पर ज़्यादा।'),
   causes:L('Tight belts, trousers or tool belts, weight gain, pregnancy and diabetes (about 7 times more common). It affects about 4 in 10,000 people a year, most often aged 30–40.','कसी बेल्ट, पैंट या औज़ार की बेल्ट, वज़न बढ़ना, गर्भावस्था और डायबिटीज़ (लगभग 7 गुना ज़्यादा)। हर साल लगभग 10,000 में से 4 लोगों को होता है, ज़्यादातर 30–40 साल में।'),cSrc:['meralgia'],
   confirm:L('Examination of sensation and strength (strength and reflexes are normal); nerve tests if the picture is unusual, to rule out a back nerve root.','संवेदना और ताकत की जांच (ताकत और रिफ़्लेक्स सामान्य); तस्वीर असामान्य हो तो कमर की नस की जड़ खारिज करने के लिए नस की जांच।'),
   treat:L('Loosening belts and clothing, weight loss and controlling diabetes; nerve-pain medicines or an injection if it persists.','बेल्ट और कपड़े ढीले करना, वज़न कम करना और डायबिटीज़ नियंत्रण; बना रहे तो नस के दर्द की दवाएं या इंजेक्शन।'),
   outlook:L('Usually improves within months once the pressure is removed.','दबाव हटने पर आमतौर पर कुछ महीनों में सुधरता है।'),
   w:{ch_burn_thigh:5,thigh_front:2,o_tight:3,o_overweight:1,r_immune:1,a_30_39:1,a_40_49:1,
      ch_limp:-2,ch_socks:-2,groin:-1,ch_groin_deep:-2,ch_shoot_leg:-1,lowback:-1}},
  {id:'backref',th:[8,6,4],anchor:['lowback','ch_shoot_leg'],depts:['ortho_spine','physio'],
   name:L('Pain coming from the lower back or sacroiliac joint','कमर या सैक्रोइलियक जोड़ से आने वाला दर्द'),sci:'Lumbar radicular / referred pain or sacroiliac joint pain',
   what:L('The lower back and the sacroiliac joint (between the base of the spine and the pelvis) commonly cause buttock and hip pain; a pinched nerve root sends shooting pain down the leg below the knee (sciatica).','कमर और सैक्रोइलियक जोड़ (रीढ़ के आधार और पेल्विस के बीच) अक्सर नितंब और कूल्हे में दर्द देते हैं; दबी नस की जड़ घुटने के नीचे तक पैर में करंट जैसा दर्द भेजती है (साइटिका)।'),
   causes:L('Disc, facet joint and sacroiliac joint problems; see the lower back section of this guide for a full assessment.','डिस्क, फ़ेसेट जोड़ और सैक्रोइलियक जोड़ की समस्याएं; पूरी जांच के लिए इस गाइड का कमर वाला भाग देखें।'),
   confirm:L('Examination of the back, hips and nerves; scans only if they will change treatment.','कमर, कूल्हों और नसों की जांच; स्कैन तभी जब इलाज बदले।'),
   treat:L('Staying active, physiotherapy and simple pain relief; see a doctor urgently for weakness or bladder or bowel changes.','सक्रिय रहना, फिज़ियोथेरेपी और साधारण दर्द की दवा; कमज़ोरी या पेशाब-शौच में बदलाव हो तो तुरंत डॉक्टर को दिखाएं।'),
   outlook:L('Most back-related leg and buttock pain improves within weeks to a few months.','कमर से जुड़ा ज़्यादातर पैर और नितंब का दर्द कुछ हफ्तों से कुछ महीनों में सुधरता है।'),
   w:{lowback:3,buttock:2,ch_shoot_leg:4,faber_back:1,w_deepflex:0,
      groin:-1,ch_socks:-1,hip_side:-1,ch_lump_groin:-3,ch_pull_groin:-2,ch_click_hip:-1}},
  {id:'inflam',th:[8,6,4],anchor:['ch_stiff_long','o_other_joints'],depts:['rheum','medicine'],
   name:L('Inflammatory arthritis (for example ankylosing spondylitis)','सूजन वाली गठिया (जैसे एंकिलॉज़िंग स्पॉन्डिलाइटिस)'),sci:'Inflammatory arthritis / axial spondyloarthritis',
   what:L('The immune system inflames the joints; in young adults this often affects the back, the sacroiliac joints and the hips, with long morning stiffness that improves with movement.','इम्यून सिस्टम जोड़ों में सूजन लाता है; युवाओं में यह अक्सर कमर, सैक्रोइलियक जोड़ और कूल्हों को प्रभावित करता है, सुबह की लंबी जकड़न के साथ जो हिलने-डुलने से सुधरती है।'),
   causes:L('Ankylosing spondylitis, psoriatic arthritis, rheumatoid arthritis and others.','एंकिलॉज़िंग स्पॉन्डिलाइटिस, सोरियाटिक आर्थराइटिस, रूमेटॉइड आर्थराइटिस और अन्य।'),
   confirm:L('Blood tests, X-rays or MRI of the sacroiliac joints, and examination by a rheumatologist.','ब्लड टेस्ट, सैक्रोइलियक जोड़ का एक्स-रे या MRI, और रूमेटोलॉजिस्ट द्वारा जांच।'),
   treat:L('Exercise and anti-inflammatory medicines; disease-modifying or biological medicines when needed.','व्यायाम और सूजन-रोधी दवाएं; ज़रूरत हो तो बीमारी नियंत्रित करने वाली या बायोलॉजिकल दवाएं।'),
   outlook:L('Well controlled when treated early.','जल्दी इलाज से अच्छा नियंत्रण।'),
   w:{ch_stiff_long:3,o_other_joints:3,r_spa:2,r_famspa:2,buttock:1,lowback:1,hip_both:1,a_18_29:1,a_30_39:1,
      ch_stiff_short:-2,on_sport:-1,ch_lump_groin:-2,ch_pull_groin:-2,a_60p:-1}}
];
const EMERG = {
  fracture:{name:L('Possible broken hip','कूल्हे की हड्डी टूटने की आशंका'),sci:'Hip (proximal femur) fracture',
    what:L('After a fall, especially in an older person, being unable to stand or walk, or a leg that looks shorter and turned outwards, suggests a broken hip. Do not try to walk on it; call 108 or go to the emergency department. Surgery should be on the day of, or the day after, admission: in an Indian study of people operated on for a broken hip (average age 74), about 19% had died within a year, so quick surgery and getting up early matter.','गिरने के बाद, खासकर बुज़ुर्गों में, खड़े या चल न पाना, या पैर छोटा और बाहर की ओर मुड़ा दिखना कूल्हे की हड्डी टूटने का संकेत है। उस पर चलने की कोशिश न करें; 108 बुलाएं या इमरजेंसी जाएं। सर्जरी भर्ती के दिन या अगले दिन होनी चाहिए: टूटे कूल्हे के ऑपरेशन वाले लोगों (औसत उम्र 74) के एक भारतीय अध्ययन में लगभग 19% की एक साल में मृत्यु हो गई, इसलिए जल्दी सर्जरी और जल्दी उठना-चलना ज़रूरी है।'),src:['nicehipfx','indhipfx'],depts:['emergency','ortho']},
  septic:{name:L('Possible infected hip joint','कूल्हे के जोड़ में इन्फेक्शन की आशंका'),sci:'Septic arthritis of the hip',
    what:L('Fever with severe hip pain, or a child who will not put weight on the leg and has a fever, can mean infection inside the hip joint, which can destroy the joint within days. Go to the emergency department today. In children, a fever of 38.5°C or more, refusing to bear weight and two raised blood tests make infection very likely (93% with 3 of these 4, 99% with all 4).','तेज़ कूल्हे के दर्द के साथ बुखार, या बुखार वाला बच्चा जो पैर पर वज़न न डाले, कूल्हे के जोड़ के अंदर इन्फेक्शन का संकेत हो सकता है, जो कुछ दिनों में जोड़ खराब कर सकता है। आज ही इमरजेंसी जाएं। बच्चों में 38.5°C या ज़्यादा बुखार, वज़न न डालना और दो बढ़े हुए ब्लड टेस्ट इन्फेक्शन की संभावना बहुत बढ़ाते हैं (इन 4 में से 3 हों तो 93%, चारों हों तो 99%)।'),src:['kocher','hotjoint'],depts:['emergency','ortho']},
  hernia:{name:L('Possible trapped (strangulated) hernia','फंसे (स्ट्रैंगुलेटेड) हर्निया की आशंका'),sci:'Incarcerated / strangulated groin hernia',
    what:L('A groin lump that has become hard, very painful and will not go back, especially with vomiting or a swollen belly, may have trapped bowel with its blood supply cut off. This needs emergency surgery: go to the emergency department now and do not eat or drink.','जांघ के जोड़ की गांठ जो सख्त, बहुत दर्दनाक हो गई है और वापस नहीं जाती, खासकर उल्टी या पेट फूलने के साथ, उसमें आंत फंसकर उसकी खून की सप्लाई कट सकती है। इसमें तुरंत सर्जरी चाहिए: अभी इमरजेंसी जाएं और कुछ खाएं-पिएं नहीं।'),src:['hernia'],depts:['emergency','surgery']}
};
const RS = {
  o_child:L('A limping child or teenager with hip, thigh or knee pain: the hip must be checked','कूल्हे, जांघ या घुटने के दर्द के साथ लंगड़ाता बच्चा या किशोर: कूल्हा जांचना ज़रूरी'),
  o_stress:L('Groin pain with training that now hurts with every step: possible stress fracture — stop running','ट्रेनिंग से जांघ के जोड़ का दर्द जो अब हर कदम पर है: स्ट्रेस फ्रैक्चर हो सकता है — दौड़ना बंद करें'),
  o_fever:L('Fever, night sweats or weight loss with hip pain','कूल्हे के दर्द के साथ बुखार, रात को पसीना या वज़न घटना'),
  o_night:L('Constant night pain in a child, at age 50 or over, or with past cancer','बच्चे में, 50 या ज़्यादा उम्र में, या पहले कैंसर के साथ रात का लगातार दर्द'),
  o_pain:L('Very severe pain (9–10 out of 10)','बहुत तेज़ दर्द (10 में 9–10)'),
  y_injury:L('Started with a fall, sport injury or accident','गिरने, खेल की चोट या दुर्घटना से शुरू'), y_avn:L('Groin pain with steroid use, regular alcohol or sickle cell disease: needs an MRI if it persists','स्टेरॉयड, नियमित शराब या सिकल सेल के साथ जांघ के जोड़ का दर्द: बना रहे तो MRI ज़रूरी'),
  y_hernia:L('A groin lump: needs a doctor’s examination','जांघ के जोड़ में गांठ: डॉक्टर की जांच ज़रूरी'), y_limp:L('Limping','लंगड़ाहट'),
  y_long:L('This bout has lasted more than 6 weeks','इस बार का दर्द 6 हफ्ते से ज़्यादा से है'), y_pain:L('Strong pain (7–8 out of 10)','तेज़ दर्द (10 में 7–8)'), y_sleep:L('Pain disturbing sleep','दर्द से नींद खराब'),
  y_inflam:L('Long morning stiffness or several swollen joints','सुबह की लंबी जकड़न या कई सूजे जोड़'), y_walk:L('Difficulty walking','चलने में दिक्कत'), y_back:L('Shooting pain down the leg','पैर में नीचे तक करंट जैसा दर्द')
};
const DERIVED = [
  {id:'hip_any', when:{any:hipAreas}},
  {id:'hipjoint_pain', when:{any:['groin','thigh_front','buttock','hknee']}},
  {id:'hipoa_cl', when:{all:['hipjoint_pain','age_ge50','ch_stiff_short',{any:['ch_socks','faber_groin']}]}},
  {id:'nice_hip', when:{all:['hipjoint_pain',{any:['a_40_49','a_50_59','a_60p']},{any:['w_walk_long','w_stairs','w_deepflex']},{not:'ch_stiff_long'}]}},
  {id:'avn_risk', when:{any:['o_steroid','o_alcohol','o_sickle','r_bones']}},
  {id:'walk_hard', when:{any:['hwalk_no','hwalk_diff']}}
];
const URGENCY = {
  orange:[
    {r:'o_child', when:'rf_child_limp'}, {r:'o_stress', when:'rf_stress'}, {r:'o_fever', when:'rf_fever'},
    {r:'o_night', when:{all:['rf_night',{any:['age_ge50','r_cancer','a_u18']}]}}, {r:'o_pain', when:{painGte:9}}
  ],
  yellow:[
    {r:'y_injury', when:{any:['on_fall','on_sport','on_accident']}}, {r:'y_avn', when:{all:['hipjoint_pain',{any:['o_steroid','o_alcohol','o_sickle']}]}},
    {r:'y_hernia', when:'ch_lump_groin'}, {r:'y_limp', when:'ch_limp'}, {r:'y_often', when:'btw_often'}, {r:'y_long', when:{any:['d_6_12','d_3m']}},
    {r:'y_pain', when:{all:[{painGte:7},{not:{painGte:9}}]}}, {r:'y_sleep', when:'sleep_bad'}, {r:'y_inflam', when:{any:['ch_stiff_long','o_other_joints']}},
    {r:'y_walk', when:'hwalk_no'}, {r:'y_back', when:'ch_shoot_leg'}
  ]
};
const EMERG_WHEN = {fracture:'rf_fall_hip', septic:{any:['rf_hot',{all:['rf_child_limp','rf_fever']}]}, hernia:'rf_hernia'};
const FOCUS = {
  hipoa:{bones:['pelvis','leg']}, gtps:{bones:['pelvis','leg']}, fai:{bones:['pelvis','leg']}, avn:{bones:['pelvis','leg']}, stressfx:{bones:['pelvis','leg']},
  hipchild:{bones:['pelvis','leg']}, adductor:{bones:['pelvis','leg']}, hernia:{bones:['pelvis']}, meralgia:{nerves:['femoral'], useSides:true}, inflam:{bones:['pelvis','sacrum']},
  backref:{vert:['L4','L5','S1'], roots:['L5','S1'], useSides:true}
};
const LBLX = {hip_one:L('One hip','एक कूल्हा'), hip_both:L('Both hips','दोनों कूल्हे'), hip_any:L('Hip or groin pain','कूल्हे या जांघ के जोड़ का दर्द'),
  hipjoint_pain:L('Pain in the groin, front of the thigh, buttock or knee','जांघ के जोड़, जांघ के आगे, नितंब या घुटने में दर्द'),
  hipoa_cl:L('Age 50+, short morning stiffness and a hip that does not bend or turn fully','50+ उम्र, सुबह थोड़ी जकड़न और कूल्हा पूरा न मुड़ना या घूमना'),
  nice_hip:L('Age 40+, pain with activity, little morning stiffness','40+ उम्र, गतिविधि से दर्द, सुबह कम जकड़न'),
  avn_risk:L('Steroids, regular alcohol or sickle cell disease','स्टेरॉयड, नियमित शराब या सिकल सेल रोग'), walk_hard:L('Difficulty walking','चलने में दिक्कत')};
const FX = {
  hipoa_cl:L('Age over 50, morning stiffness under an hour and a stiff hip are the self-reportable parts of the clinical criteria for hip osteoarthritis (86% sensitivity).','50 से ज़्यादा उम्र, एक घंटे से कम सुबह की जकड़न और जकड़ा कूल्हा, कूल्हे के ऑस्टियोआर्थराइटिस के क्लिनिकल मापदंडों के वे हिस्से हैं जो आप खुद बता सकते हैं (संवेदनशीलता 86%)।'),
  nice_hip:L('NICE diagnoses osteoarthritis clinically at 45+ with activity-related pain and little morning stiffness.','NICE 45+ उम्र में गतिविधि से दर्द और सुबह कम जकड़न पर बिना स्कैन ऑस्टियोआर्थराइटिस पहचानता है।'),
  groin:L('Groin pain is the typical place for pain from inside the hip joint.','जांघ के जोड़ का दर्द कूल्हे के जोड़ के अंदर के दर्द की खास जगह है।'),
  hip_side:L('Pain on the bony point of the outer hip points to the buttock tendons rather than the hip joint.','कूल्हे के बाहर हड्डी के उभार पर दर्द कूल्हे के जोड़ की बजाय नितंब के टेंडन की ओर इशारा करता है।'),
  ch_lie_side:L('Pain lying on the painful side is typical of gluteal tendon pain.','दर्द वाली करवट लेटने पर दर्द ग्लूटियल टेंडन दर्द का खास लक्षण है।'),
  w_cross_legs:L('Crossing the legs squashes the buttock tendons against the bone.','पैर पर पैर रखना नितंब के टेंडन को हड्डी पर दबाता है।'),
  sls_pos:L('Outer hip pain within 30 seconds of standing on one leg is a very specific sign of gluteal tendinopathy.','एक पैर पर खड़े होने के 30 सेकंड में कूल्हे के बाहर दर्द ग्लूटियल टेंडिनोपैथी का बहुत विशिष्ट संकेत है।'),
  sls_neg:L('No pain standing on one leg makes gluteal tendon pain a little less likely.','एक पैर पर खड़े होने पर दर्द न होना ग्लूटियल टेंडन दर्द की संभावना थोड़ी कम करता है।'),
  ch_socks:L('Difficulty with socks and toenails shows the hip no longer bends and turns fully, typical of hip joint disease.','मोज़े और नाखून में दिक्कत दिखाती है कि कूल्हा पूरा मुड़ता और घूमता नहीं, जो कूल्हे के जोड़ की बीमारी का खास लक्षण है।'),
  ch_groin_deep:L('A deep groin ache, often shown by cupping the hip, points to the hip joint.','जांघ के जोड़ में गहरा दर्द, जिसे अक्सर कूल्हा पकड़कर बताया जाता है, कूल्हे के जोड़ की ओर इशारा करता है।'),
  ch_click_hip:L('Painful clicking or catching in the hip suggests a labral tear.','कूल्हे में दर्द के साथ क्लिक या अटकना लैब्रम फटने का संकेत है।'),
  w_deepflex:L('Pain with deep bending (squatting, low seats, getting into a car) is typical of hip impingement.','गहरा मुड़ने (उकड़ू, नीची सीट, कार में चढ़ना) पर दर्द कूल्हे के इंपिंजमेंट का खास लक्षण है।'),
  faber_groin:L('Groin pain in the figure-4 position points to the hip joint.','4 जैसी स्थिति में जांघ के जोड़ का दर्द कूल्हे के जोड़ की ओर इशारा करता है।'),
  faber_back:L('Back pain in the figure-4 position points to the sacroiliac joint or lower back.','4 जैसी स्थिति में पीछे का दर्द सैक्रोइलियक जोड़ या कमर की ओर इशारा करता है।'),
  o_steroid:L('Steroid courses are a leading cause of loss of blood supply to the ball of the hip.','स्टेरॉयड के कोर्स कूल्हे की गेंद की खून की सप्लाई रुकने का एक प्रमुख कारण हैं।'),
  o_alcohol:L('Regular alcohol is a common cause of avascular necrosis of the hip.','नियमित शराब कूल्हे के एवैस्कुलर नेक्रोसिस का आम कारण है।'),
  o_sickle:L('Sickle cell disease can block the small vessels of the hip bone.','सिकल सेल रोग कूल्हे की हड्डी की छोटी नलियों को बंद कर सकता है।'),
  r_bones:L('Long steroid use or weak bones raise the risk of avascular necrosis and stress fractures.','लंबे समय तक स्टेरॉयड या कमज़ोर हड्डियाँ एवैस्कुलर नेक्रोसिस और स्ट्रेस फ्रैक्चर का खतरा बढ़ाती हैं।'),
  on_training:L('A rise in running, marching or training can crack the femoral neck (stress fracture).','दौड़ने, मार्च या ट्रेनिंग में बढ़ोतरी से फ़ीमर की गर्दन में दरार (स्ट्रेस फ्रैक्चर) आ सकती है।'),
  rf_stress:L('Groin pain with every step after training needs an MRI to rule out a stress fracture.','ट्रेनिंग के बाद हर कदम पर जांघ के जोड़ का दर्द हो तो स्ट्रेस फ्रैक्चर खारिज करने के लिए MRI ज़रूरी।'),
  rf_child_limp:L('Hip, thigh or knee pain with a limp in a child needs a hip examination and X-ray.','बच्चे में लंगड़ाहट के साथ कूल्हे, जांघ या घुटने का दर्द हो तो कूल्हे की जांच और एक्स-रे ज़रूरी।'),
  hknee:L('Hip problems often send pain to the knee.','कूल्हे की समस्या अक्सर घुटने तक दर्द भेजती है।'),
  ch_lump_groin:L('A groin lump that bulges on coughing and goes back lying down is the classic sign of a hernia.','खांसने पर उभरने और लेटने पर वापस जाने वाली गांठ हर्निया का क्लासिक संकेत है।'),
  w_cough:L('Pain or a bulge on coughing and straining points to a hernia.','खांसने और ज़ोर लगाने पर दर्द या उभार हर्निया की ओर इशारा करता है।'),
  ch_pull_groin:L('Sudden inner groin pain on kicking or sprinting is typical of an adductor strain.','किक या तेज़ दौड़ते समय अचानक जांघ के अंदरूनी जोड़ में दर्द एडक्टर खिंचाव का खास लक्षण है।'),
  on_sport:L('Kicking, sprinting and twisting load the groin muscles and the hip joint rim.','किक, तेज़ दौड़ और मुड़ना जांघ के जोड़ की मांसपेशियों और कूल्हे की कटोरी के किनारे पर भार डालते हैं।'),
  ch_burn_thigh:L('A burning, numb patch on the outer thigh with normal strength is typical of meralgia paresthetica.','सामान्य ताकत के साथ बाहरी जांघ पर जलन वाला सुन्न हिस्सा मेराल्जिया पैरेस्थेटिका का खास लक्षण है।'),
  o_tight:L('Tight belts, pregnancy and weight change can squeeze the thigh skin nerve.','कसी बेल्ट, गर्भावस्था और वज़न में बदलाव जांघ की त्वचा की नस को दबा सकते हैं।'),
  ch_shoot_leg:L('Shooting pain below the knee points to a nerve root in the back.','घुटने के नीचे तक करंट जैसा दर्द कमर में नस की जड़ की ओर इशारा करता है।'),
  lowback:L('Hip and buttock pain with back pain often comes from the back.','कमर दर्द के साथ कूल्हे और नितंब का दर्द अक्सर कमर से आता है।'),
  ch_stiff_long:L('Morning stiffness over an hour suggests an inflammatory arthritis.','एक घंटे से ज़्यादा सुबह की जकड़न सूजन वाली गठिया का संकेत है।'),
  ch_stiff_short:L('Stiffness that eases within an hour fits osteoarthritis.','एक घंटे के अंदर कम होने वाली जकड़न ऑस्टियोआर्थराइटिस से मेल खाती है।'),
  o_other_joints:L('Several painful joints point to an inflammatory arthritis.','कई दर्द वाले जोड़ सूजन वाली गठिया की ओर इशारा करते हैं।'),
  ch_limp:L('A limp shows the hip is not taking weight normally.','लंगड़ाहट दिखाती है कि कूल्हा सामान्य रूप से वज़न नहीं ले रहा।')
};
const STATS = [
  {v:'51.8%',t:L('of hip replacements in India are for avascular necrosis (USA: 6%)','भारत में कूल्हा बदलने के ऑपरेशन एवैस्कुलर नेक्रोसिस के लिए (अमेरिका: 6%)'),s:'avnind'},
  {v:'23.5%',t:L('of women aged 50–79 have outer hip (gluteal tendon) pain on one or both sides','50–79 साल की महिलाओं को एक या दोनों तरफ़ कूल्हे के बाहर (ग्लूटियल टेंडन) दर्द'),s:'segal07'},
  {v:'77%',t:L('improved with education and exercise for gluteal tendon pain at 8 weeks, vs 59% with an injection','ग्लूटियल टेंडन दर्द में 8 हफ्तों में जानकारी और व्यायाम से सुधरे, इंजेक्शन से 59%'),s:'leap'},
  {v:'27%',t:L('of men get a groin hernia in their lifetime (women 3%)','पुरुषों को जीवन में ग्रोइन हर्निया होता है (महिलाएं 3%)'),s:'hernia'},
  {v:'1 day',t:L('NICE: hip fracture surgery on the day of, or the day after, admission','NICE: कूल्हे के फ्रैक्चर की सर्जरी भर्ती के दिन या अगले दिन'),s:'nicehipfx'},
  {v:'99%',t:L('of hip impingement is picked up by the FADIR test, so a negative test makes it unlikely','कूल्हे का इंपिंजमेंट FADIR टेस्ट से पकड़ा जाता है, इसलिए नेगेटिव टेस्ट से इसकी संभावना कम'),s:'reiman15'}
];
const UI = {
  repT:L('Hip and groin pain assessment','कूल्हे और जांघ के जोड़ के दर्द की जांच रिपोर्ट'), tag:L('Hip assessment','कूल्हे की जांच'),
  safPic:L('Groin and hip (asked below): a fall with inability to stand, or fever with severe hip pain, is an emergency.','जांघ का जोड़ और कूल्हा (नीचे पूछा गया): गिरने के बाद खड़े न हो पाना, या तेज़ कूल्हे के दर्द के साथ बुखार, इमरजेंसी है।'),
  must:[L('This assessment cannot measure how far your hip turns and bends, test your strength and nerves, or examine a groin lump, which a doctor does by examining you.','यह जांच नहीं माप सकती कि आपका कूल्हा कितना घूमता और मुड़ता है, आपकी ताकत और नसें नहीं परख सकती, या जांघ के जोड़ की गांठ की जांच नहीं कर सकती, जो डॉक्टर जांच से करते हैं।'),
    L('Only a doctor can decide whether you need an X-ray, MRI, ultrasound or blood tests, and interpret them with the examination.','एक्स-रे, MRI, अल्ट्रासाउंड या ब्लड टेस्ट की ज़रूरत है या नहीं, यह सिर्फ़ डॉक्टर तय कर सकते हैं और जांच के साथ उनका मतलब समझा सकते हैं।'),
    L('Hip and groin pain can also come from the back, a hernia, the belly or pelvic organs, or a whole-body illness; a doctor examines these too.','कूल्हे और जांघ के जोड़ का दर्द कमर, हर्निया, पेट या पेल्विस के अंगों, या पूरे शरीर की बीमारी से भी हो सकता है; डॉक्टर इनकी भी जांच करते हैं।'),
    L('Do not stop or change steroid medicines on your own; discuss them with the doctor who prescribed them.','स्टेरॉयड दवाएं खुद से बंद या बदलें नहीं; इन्हें लिखने वाले डॉक्टर से बात करें।')],
  tip1:L('Keep moving within comfort; short walks, cycling or swimming are better than complete rest.','आराम की सीमा में चलते-फिरते रहें; पूरे आराम से बेहतर हैं छोटी सैर, साइकिल या तैराकी।'),
  tip2:L('Until you are examined, avoid crossing your legs, deep squatting, sitting on the floor and very low seats; use a chair and a western toilet if possible.','जांच होने तक पैर पर पैर रखना, गहरा उकड़ू बैठना, ज़मीन पर बैठना और बहुत नीची सीट से बचें; हो सके तो कुर्सी और वेस्टर्न टॉयलेट इस्तेमाल करें।'),
  tFaberGroin:L('Pain in the groin','जांघ के जोड़ में दर्द'), tFaberBack:L('Pain at the back','पीछे दर्द'),
  gPost:L('Pelvis and thigh bones with the leg nerves; the highlighted bones are those most involved in the likely cause.','पेल्विस और जांघ की हड्डियाँ और पैर की नसें; चमकती हड्डियाँ संभावित कारण से सबसे ज़्यादा जुड़ी हैं।'),
  gRef:L('Pelvis, hip joint and leg nerves for reference.','संदर्भ के लिए पेल्विस, कूल्हे का जोड़ और पैर की नसें।'), gX:L('See-through view: the bones under the areas you marked.','आर-पार व्यू: आपके चिन्हित हिस्सों के नीचे की हड्डियाँ।'),
  hwalkT:L('Walking','चलना'), hsockT:L('Putting on socks and shoes, getting in and out of a car','मोज़े और जूते पहनना, कार में चढ़ना-उतरना')
};
const FUNCS = [
  {id:'hwalk', label:'hwalkT', req:true, opts:[['hwalk_ok',L('Normally','सामान्य')],['hwalk_diff',L('With pain or a limp','दर्द या लंगड़ाहट के साथ')],['hwalk_no',L('Can hardly walk','मुश्किल से चल पाते हैं')]]},
  {id:'hsock', label:'hsockT', req:true, opts:[['hsock_ok',L('Normally','सामान्य')],['hsock_diff',L('With difficulty','मुश्किल से')],['hsock_no',L('Need help','मदद चाहिए')]]},
  {id:'sleep', label:'sleep', opts:C.SLEEPS}
];
SPG.data.modules.hip = {id:'hip', order:8,
  card:{reg:['groin_l','hip_side_l','buttock_l','thigh_front_l'], view:{az:0.75, el:0.08, d:1.45, yk:'hj', dy:-0.08, tx:0.06}, hint:L('Hip arthritis, outer hip pain, groin pain, hip impingement, avascular necrosis, hernia','कूल्हे की गठिया, कूल्हे के बाहर दर्द, जांघ के जोड़ का दर्द, इंपिंजमेंट, एवैस्कुलर नेक्रोसिस, हर्निया')},
  name:L('Hip or groin pain','कूल्हे या जांघ के जोड़ का दर्द'), safetyView:'groin', startRegions:['groin_l','hip_side_l'], safetyRegions:['groin_l','groin_r'],
  labelSet:[], GAL:{nerves:['sciatic','femoral'], joint:{view:{az:0.5, el:0.12, d:0.9, yk:'hj', dy:0.0, tx:0.07}, opts:{nerveKeep:['sciatic','femoral'], noUpper:true}}},
  resultView:{az:0.75, el:0.1, d:1.2, yk:'hj', dy:-0.05, tx:0.06}, defaultDept:'ortho',
  ONSETS, PAT, RFS, VIEWS, AREAS, TESTS, CONDS, EMERG, ROOTS:{}, RS, DERIVED, SIDES:{areas:hipAreas, one:'hip_one', both:'hip_both', sideAreas:hipAreas.concat(['hknee'])},
  URGENCY, EMERG_WHEN, ROOT_RULES:[], DISC_OF:{}, EXIT_OF:{}, DEPT_RULES:[], FOCUS, LBLX, UI, FUNCS, FX, STATS};
})();
