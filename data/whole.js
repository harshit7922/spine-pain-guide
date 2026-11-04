window.SPG = window.SPG || {data:{modules:{}}};
/* Whole back / more than one region module: screens conditions that affect the whole spine or cause widespread pain.
   Uses the 2016 fibromyalgia "generalised pain" idea: pain in 4 of 5 body regions (left/right upper, left/right lower, axial). */
(function(){
const PI = Math.PI;
const L = (en, hi) => ({en, hi});
const C = SPG.data.common;
C.SRC.push(['fm2016','Wolfe F et al. 2016 revisions to the fibromyalgia diagnostic criteria (criteria form)','https://lin-web.clarkson.edu/~lrussek/2016FMS.pdf'],
  ['pmr12','Dasgupta B et al. 2012 provisional classification criteria for polymyalgia rheumatica (EULAR/ACR). Ann Rheum Dis 2012;71:484–92 (age 50+, both shoulders aching, raised ESR/CRP; score 4+ without ultrasound: sensitivity 68%, specificity 78%)','https://ard.bmj.com/content/71/4/484'],
  ['scolio17','Adolescent idiopathic scoliosis school screening with the Adams forward bend test and scoliometer. Malays Orthop J 2017;11(3) (prevalence 2.93% of 784 pupils; scoliometer 7°: sensitivity 78%, specificity 89%)','https://www.morthoj.org/2017/v11n3/adolescent-idiopathic-scoliosis-abstract.php']);
const PAT = {
  char:[
    ['ch_ache',L('Deep aching in many places','कई जगह गहरा दर्द')],
    ['ch_stiff_am',L('Stiff for more than 30 minutes after waking','सुबह उठने पर 30 मिनट से ज़्यादा अकड़न')],
    ['ch_night_wake',L('Wakes you late at night and eases after getting up','देर रात दर्द से नींद खुलती है, उठने पर आराम')],
    ['ch_fatigue',L('Tired all the time; sleep does not refresh','हर समय थकान; नींद से ताज़गी नहीं')],
    ['ch_brainfog',L('Poor memory or concentration','याददाश्त या ध्यान में कमी')],
    ['ch_bone_tender',L('Bones ache or hurt when pressed (shins, ribs, hips)','हड्डियों में दर्द या दबाने पर दुखना (पिंडली, पसलियाँ, कूल्हे)')],
    ['ch_muscle_weak',L('Difficulty climbing stairs or getting up from a low seat','सीढ़ी चढ़ने या नीची सीट से उठने में दिक्कत')],
    ['ch_girdle',L('Stiffness and pain in both shoulders and hips, worst in the morning','दोनों कंधों और कूल्हों में अकड़न व दर्द, सुबह सबसे ज़्यादा')],
    ['ch_fever_ache',L('Recent fever with body ache or joint pains','हाल में बुखार के साथ बदन दर्द या जोड़ों का दर्द')],
    ['ch_posture',L('Rounded back, a curve in the spine or loss of height','गोल पीठ, रीढ़ में मोड़ या कद कम होना')],
    ['ch_rib_hump',L('Someone has noticed one shoulder blade or one side of the ribs sticking out more, especially when bending forward','किसी ने देखा है कि एक कंधे की हड्डी या पसलियों का एक हिस्सा ज़्यादा उभरा है, खासकर आगे झुकने पर')],
    ['ch_numb',L('Numbness or tingling in arms or legs','बांहों या पैरों में सुन्नपन या झुनझुनी')]
  ],
  worse:[['w_rest',L('Resting (better once you move)','आराम करना (हिलने से बेहतर)')],['w_sit',L('Long sitting','देर तक बैठना')],['w_stress',L('Stress or poor sleep','तनाव या खराब नींद')],['w_cold',L('Cold weather','ठंडा मौसम')]],
  better:[['b_exercise',L('Exercise and movement','व्यायाम और हलचल')],['b_rest',L('Rest','आराम')],['b_walk',L('Walking','चलना')]],
  other:[['u_urine',L('Burning urine or blood in urine','पेशाब में जलन या खून')]]
};
const RFS = [
  ['rf_bladder',L('New difficulty passing urine, leaking, or loss of bowel control','पेशाब करने में नई दिक्कत, पेशाब निकलना, या शौच पर नियंत्रण न रहना')],
  ['rf_weak_prog',L('Weakness or numbness in arms or legs that is getting worse','बांहों या पैरों में बढ़ती कमज़ोरी या सुन्नपन')],
  ['rf_cardiac',L('Chest pressure with sweating or breathlessness','पसीने या सांस फूलने के साथ सीने में दबाव')],
  ['rf_trauma',L('Started after a major injury','बड़ी चोट के बाद शुरू')],
  ['rf_fever',L('Fever, night sweats or weight loss without trying','बुखार, रात को पसीना या बिना कोशिश वज़न घटना')],
  ['rf_night',L('Constant pain at night that no position eases','रात को लगातार दर्द जो किसी भी पोज़िशन में कम न हो')]
];
const VIEWS = {
  wneck:{az:PI,el:0.1,d:1.3,yk:'c4',dy:0}, wup:{az:PI,el:0.08,d:1.45,yk:'t6',dy:0.03}, wmid:{az:PI,el:0.05,d:1.45,yk:'t6',dy:-0.08}, wlow:{az:PI,el:0.08,d:1.75,yk:'hj',dy:0.13},
  wchest:{az:0,el:0.06,d:1.45,yk:'t6',dy:0}, wsh:{az:PI-0.3,el:0.25,d:1.5,yk:'sh',dy:0.02}, warm:{az:0.9,el:0.1,d:1.5,yk:'sh',dy:-0.12,tx:0.12}, wfore:{az:0.5,el:0.1,d:1.2,yk:'wrist',dy:0.04,tx:0.2},
  whip:{az:PI,el:0.04,d:1.75,yk:'hj',dy:0}, wthigh:{az:0,el:0.03,d:2.3,yk:'knee',dy:0.22}, wleg:{az:0.25,el:0.1,d:2.2,yk:'knee',dy:-0.12}
};
const AREAS = [
  {id:'neck',pair:false,view:'wneck',name:L('Neck','गर्दन'),desc:L('Back and sides of the neck.','गर्दन का पिछला और साइड वाला हिस्सा।'),rel:L('Part of the axial (spine) region.','अक्षीय (रीढ़) हिस्से का भाग।')},
  {id:'interscap',pair:false,view:'wup',name:L('Upper back','ऊपरी पीठ'),desc:L('Between the shoulder blades.','कंधे की हड्डियों के बीच।'),rel:L('Part of the axial (spine) region.','अक्षीय (रीढ़) हिस्से का भाग।')},
  {id:'midback',pair:false,view:'wmid',name:L('Middle back','बीच की पीठ'),desc:L('Below the shoulder blades.','कंधे की हड्डियों के नीचे।'),rel:L('Part of the axial (spine) region.','अक्षीय (रीढ़) हिस्से का भाग।')},
  {id:'lowback',pair:false,view:'wlow',name:L('Lower back','कमर'),desc:L('Between the bottom ribs and the buttocks.','नीचे की पसलियों और नितंबों के बीच।'),rel:L('Part of the axial (spine) region.','अक्षीय (रीढ़) हिस्से का भाग।')},
  {id:'chest',pair:false,view:'wchest',name:L('Chest','छाती'),desc:L('Front of the chest.','छाती का अगला हिस्सा।'),rel:L('Counted in the axial region in widespread pain scoring.','व्यापक दर्द स्कोर में अक्षीय हिस्से में गिना जाता है।')},
  {id:'trap',pair:true,view:'wsh',name:L('Shoulder','कंधा'),desc:L('Top of the shoulder and shoulder girdle.','कंधे का ऊपरी हिस्सा।'),rel:L('Shoulder-girdle pain on both sides in older adults suggests polymyalgia.','बुज़ुर्गों में दोनों कंधों का दर्द पॉलीमायल्जिया का संकेत हो सकता है।')},
  {id:'c5',pair:true,view:'warm',name:L('Upper arm','ऊपरी बांह'),desc:L('Between the shoulder and the elbow.','कंधे और कोहनी के बीच।'),rel:L('Counted in the upper-limb regions.','ऊपरी अंग के हिस्सों में गिना जाता है।')},
  {id:'c6',pair:true,view:'wfore',name:L('Forearm and hand','अग्रबाहु और हाथ'),desc:L('Below the elbow.','कोहनी के नीचे।'),rel:L('Counted in the upper-limb regions.','ऊपरी अंग के हिस्सों में गिना जाता है।')},
  {id:'buttock',pair:true,view:'whip',name:L('Hip and buttock','कूल्हा और नितंब'),desc:L('The buttock and side of the hip.','नितंब और कूल्हे का साइड।'),rel:L('Counted in the lower-limb regions.','निचले अंग के हिस्सों में गिना जाता है।')},
  {id:'thigh_front',pair:true,view:'wthigh',name:L('Thigh','जांघ'),desc:L('The upper leg.','ऊपरी पैर।'),rel:L('Counted in the lower-limb regions.','निचले अंग के हिस्सों में गिना जाता है।')},
  {id:'l4',pair:true,view:'wleg',name:L('Knee and lower leg','घुटना और निचला पैर'),desc:L('From the knee down.','घुटने से नीचे।'),rel:L('Counted in the lower-limb regions.','निचले अंग के हिस्सों में गिना जाता है।')}
];
const TESTS = [
  {id:'wall',name:L('Wall test (posture)','दीवार टेस्ट (पोस्चर)'),
   steps:[L('Stand with heels, buttocks and shoulders against a wall.','एड़ी, नितंब और कंधे दीवार से लगाकर खड़े हों।'),L('Try to touch the wall with the back of your head without lifting the chin.','ठुड्डी उठाए बिना सिर का पिछला हिस्सा दीवार से लगाने की कोशिश करें।')],
   pos:L('Your head cannot touch the wall.','सिर दीवार से नहीं लगता।'),
   acc:L('A gap shows a rounded upper back, seen with osteoporotic fractures and ankylosing spondylitis.','दूरी गोल ऊपरी पीठ दिखाती है, जो ऑस्टियोपोरोटिक फ्रैक्चर और एंकिलोज़िंग स्पॉन्डिलाइटिस में दिखती है।'),src:'asas',ans:[['wall_pos','tPos','y'],['wall_neg','tNeg','n'],['wall_skip','tSkip','s']]},
  {id:'squat',name:L('Chair rise test','कुर्सी से उठने का टेस्ट'),
   steps:[L('Sit on a firm chair with arms crossed over the chest.','बांहें छाती पर मोड़कर मज़बूत कुर्सी पर बैठें।'),L('Stand up and sit down 5 times as quickly as you safely can, without using your hands.','हाथों का उपयोग किए बिना सुरक्षित रूप से जितनी जल्दी हो सके 5 बार उठें और बैठें।')],
   pos:L('You need your hands, or it takes clearly longer than 15 seconds.','हाथों की ज़रूरत पड़े, या 15 सेकंड से साफ़ ज़्यादा समय लगे।'),
   acc:L('Weak hip and thigh muscles point to vitamin D deficiency, polymyalgia or muscle disease rather than a back problem alone.','कूल्हे और जांघ की कमज़ोर मांसपेशियाँ सिर्फ पीठ की समस्या के बजाय विटामिन D की कमी, पॉलीमायल्जिया या मांसपेशी रोग की ओर इशारा करती हैं।'),src:'',ans:[['squat_weak','tWeak','y'],['squat_ok','tNorm','n'],['squat_skip','tSkip','s']]}
];
const D = C.DEPTS;
D.medicine = {n:L('General medicine / Internal medicine','जनरल मेडिसिन / इंटरनल मेडिसिन'),s:L('Whole-body causes: vitamin D, thyroid, infections, blood tests.','पूरे शरीर के कारण: विटामिन D, थायरॉइड, इन्फेक्शन, ब्लड टेस्ट।'),q:'internal medicine physician'};
const CONDS = [
  {id:'fibro',th:[12,8,5],anchor:['wp_general'],depts:['rheum','medicine','physio'],
   name:L('Widespread pain syndrome (fibromyalgia)','व्यापक दर्द सिंड्रोम (फाइब्रोमायल्जिया)'),sci:'Fibromyalgia (2016 criteria: generalised pain in 4 of 5 regions for 3 months)',
   what:L('The nervous system becomes over-sensitive to pain, so pain is felt in many places at once, along with tiredness, unrefreshing sleep and poor concentration. Scans and blood tests are normal.','तंत्रिका तंत्र दर्द के प्रति ज़्यादा संवेदनशील हो जाता है, इसलिए एक साथ कई जगह दर्द होता है, साथ में थकान, बेताज़ा नींद और ध्यान की कमी। स्कैन और ब्लड टेस्ट सामान्य होते हैं।'),cSrc:['fm2016'],
   causes:L('Poor sleep, stress, previous injury or illness and genetics; more common in women.','खराब नींद, तनाव, पुरानी चोट या बीमारी और आनुवंशिकता; महिलाओं में ज़्यादा आम।'),
   confirm:L('A doctor applies the 2016 criteria (widespread pain index and symptom severity) and runs blood tests to rule out thyroid, vitamin D and inflammatory causes.','डॉक्टर 2016 के मानदंड (व्यापक दर्द सूचकांक और लक्षण गंभीरता) लगाते हैं और थायरॉइड, विटामिन D और सूजन के कारण खारिज करने के लिए ब्लड टेस्ट कराते हैं।'),
   treat:L('Graded exercise, sleep care, stress management and medicines chosen by your doctor; physiotherapy and psychological support help.','धीरे-धीरे बढ़ाया व्यायाम, नींद की देखभाल, तनाव प्रबंधन और डॉक्टर द्वारा चुनी दवाएं; फिज़ियोथेरेपी और मनोवैज्ञानिक सहायता मदद करती है।'),
   outlook:L('A long-term condition, but most people improve function with a combined plan.','लंबी चलने वाली स्थिति, पर संयुक्त योजना से ज़्यादातर लोगों का काम बेहतर होता है।'),
   w:{h_1_5y:2,h_5y:2,btw_some:2,h_first:-1,wp_general:5,wp_axial:1,ch_fatigue:3,ch_brainfog:2,sleep_bad:2,w_stress:2,d_3m:3,sex_f:1,ch_ache:1,rf_fever:-3,ch_stiff_am:-1}},
  {id:'waxspa',th:[13,8,5],anchor:['ibp2','ch_stiff_am','b_exercise','w_rest','ch_night_wake'],depts:['rheum','physio'],
   name:L('Inflammatory spine disease affecting the whole back (ankylosing spondylitis)','पूरी पीठ को प्रभावित करने वाली सूजन की बीमारी (एंकिलोज़िंग स्पॉन्डिलाइटिस)'),sci:'Axial spondyloarthritis',
   what:L('Inflammation starts in the sacroiliac joints and lower back and can climb the whole spine to the neck, causing morning stiffness that eases with exercise and, over years, a stooped posture.','सूजन SI जोड़ों और कमर से शुरू होकर पूरी रीढ़ से गर्दन तक चढ़ सकती है, जिससे सुबह अकड़न होती है जो व्यायाम से कम होती है और सालों में झुका पोस्चर।'),cSrc:['asas','rudw06'],
   causes:L('An immune condition linked to HLA-B27, usually starting before 40; psoriasis, bowel inflammation and eye inflammation are related. Two inflammatory back pain features make it about 3.7 times more likely, and three or more about 12 times.','HLA-B27 से जुड़ी इम्यून बीमारी, आमतौर पर 40 से पहले; सोरायसिस, आंतों और आंख की सूजन इससे जुड़ी हैं। सूजन वाले पीठ दर्द के दो लक्षण इसकी संभावना लगभग 3.7 गुना, और तीन या ज़्यादा लगभग 12 गुना करते हैं।'),
   confirm:L('Blood tests (CRP, ESR, HLA-B27) and MRI of the sacroiliac joints and spine.','ब्लड टेस्ट (CRP, ESR, HLA-B27) और SI जोड़ों व रीढ़ का MRI।'),
   treat:L('Daily exercise, anti-inflammatory medicines and biologics under a rheumatologist.','रोज़ व्यायाम, सूजन-रोधी दवाएं और रूमेटोलॉजिस्ट की देखरेख में बायोलॉजिक्स।'),
   outlook:L('Early treatment preserves movement and posture.','जल्दी इलाज से हलचल और पोस्चर बचता है।'),
   w:{h_1_5y:2,h_5y:2,btw_some:2,h_first:-1,spine_multi:3,lowback:1,ibp2:2,ibp3:2,ch_stiff_am:1,ibp_ex:1,ch_night_wake:1,r_famspa:2,a_18_29:2,a_30_39:2,r_spa:3,wall_pos:3,d_3m:2,on_gradual:1,sex_m:1,a_60p:-2}},
  {id:'multispond',th:[10,7,4],anchor:['spine_multi'],depts:['ortho_spine','physio','pain'],
   name:L('Wear in several parts of the spine (multilevel spondylosis)','रीढ़ के कई हिस्सों में घिसावट (मल्टीलेवल स्पॉन्डिलोसिस)'),sci:'Multilevel degenerative disc disease · spondylosis',
   what:L('Age-related drying of discs and wear of joints at several levels, for example neck and lower back together, gives aching and stiffness in more than one region.','कई स्तरों पर डिस्क का सूखना और जोड़ों की घिसावट, जैसे गर्दन और कमर एक साथ, एक से ज़्यादा हिस्से में दर्द और जकड़न देती है।'),cSrc:['ajnr'],
   causes:L('Ageing, desk work, heavy work, smoking, obesity and genetics. MRI changes are common even without pain, so they must match symptoms.','उम्र, डेस्क वर्क, भारी काम, धूम्रपान, मोटापा और आनुवंशिकता। बिना दर्द भी MRI में बदलाव आम हैं, इसलिए उन्हें लक्षणों से मिलाना ज़रूरी।'),
   confirm:L('Examination; whole-spine MRI screening when symptoms or nerve signs come from more than one level.','जांच; जब लक्षण या नस के संकेत एक से ज़्यादा स्तर से हों तो पूरी रीढ़ का MRI स्क्रीनिंग।'),
   treat:L('Exercise, posture, weight control and pain relief; treatment targets the level that causes symptoms.','व्यायाम, पोस्चर, वज़न नियंत्रण और दर्द की दवा; इलाज उस स्तर पर जो लक्षण दे रहा है।'),
   outlook:L('Flares come and go; most people stay active with exercise.','दर्द कभी बढ़ता-घटता है; ज़्यादातर लोग व्यायाम से सक्रिय रहते हैं।'),
   w:{h_1_5y:2,h_5y:3,btw_some:2,h_first:-2,spine_multi:4,a_u18:-3,a_30_39:1,a_40_49:2,a_50_59:2,a_60p:2,ch_ache:2,d_3m:2,r_desk:1,r_heavy:1,ep_recur:1,w_sit:1,ch_numb:1,rf_fever:-3}},
  {id:'osteomal',th:[10,7,4],anchor:['ch_bone_tender','ch_muscle_weak','squat_weak'],depts:['medicine','endo'],
   name:L('Vitamin D deficiency bone pain (osteomalacia)','विटामिन D की कमी से हड्डियों का दर्द (ऑस्टियोमलेशिया)'),sci:'Osteomalacia',
   what:L('Severe vitamin D deficiency softens the bones, causing diffuse aching in the back, ribs, hips and legs, bone tenderness and weak thigh muscles.','विटामिन D की गंभीर कमी से हड्डियाँ नरम होती हैं, जिससे पीठ, पसलियों, कूल्हों और पैरों में फैला दर्द, हड्डियों में दुखन और जांघ की कमज़ोर मांसपेशियाँ होती हैं।'),
   causes:L('Little sunlight exposure, covered skin, darker skin, diet low in vitamin D, obesity, kidney or liver disease and some medicines. About 67% of Indian adults have low vitamin D, though most do not have osteomalacia.','कम धूप, ढकी त्वचा, गहरी त्वचा, विटामिन D कम भोजन, मोटापा, गुर्दे या लिवर की बीमारी और कुछ दवाएं। लगभग 67% भारतीय वयस्कों में विटामिन D कम है, हालांकि ज़्यादातर को ऑस्टियोमलेशिया नहीं होता।'),cSrc:['vitd'],
   confirm:L('Blood tests: vitamin D, calcium, phosphate and alkaline phosphatase.','ब्लड टेस्ट: विटामिन D, कैल्शियम, फॉस्फेट और एल्कलाइन फॉस्फेटेज़।'),
   treat:L('Vitamin D and calcium at doses set by your doctor, with follow-up blood tests.','डॉक्टर द्वारा तय खुराक में विटामिन D और कैल्शियम, और बाद में ब्लड टेस्ट।'),
   outlook:L('Pain and weakness improve over weeks to months of treatment.','इलाज के हफ्तों से महीनों में दर्द और कमज़ोरी सुधरते हैं।'),
   w:{btw_some:1,ch_bone_tender:4,ch_muscle_weak:3,squat_weak:3,spine_multi:1,wp_general:1,ch_fatigue:1,ch_ache:1,d_3m:1,sex_f:1}},
  {id:'osteopor',th:[9,6,4],anchor:['r_bones','ch_posture','wall_pos'],depts:['endo','ortho_spine'],
   name:L('Osteoporosis with spinal fractures','रीढ़ के फ्रैक्चर के साथ ऑस्टियोपोरोसिस'),sci:'Osteoporotic vertebral fractures',
   what:L('Thin bones lead to small collapses of vertebrae at several levels, causing back pain in different areas, a rounded back and height loss.','पतली हड्डियों से कई स्तरों पर हड्डियाँ दबती हैं, जिससे अलग-अलग जगह पीठ दर्द, गोल पीठ और कद कम होता है।'),cSrc:['fx','khadilkar15','downie'],
   causes:L('Age, menopause, long-term steroid tablets, low vitamin D and calcium, smoking and low body weight. About 46 million Indian women have osteoporosis; in a Delhi study 17.1% of women over 50 had a vertebral fracture.','उम्र, मेनोपॉज़, लंबे समय स्टेरॉयड की गोलियाँ, कम विटामिन D और कैल्शियम, धूम्रपान और कम वज़न। लगभग 4.6 करोड़ भारतीय महिलाओं को ऑस्टियोपोरोसिस है; दिल्ली के एक अध्ययन में 50 से ऊपर की 17.1% महिलाओं को रीढ़ का फ्रैक्चर था।'),
   confirm:L('Spine X-rays and a DEXA bone density scan.','रीढ़ के एक्स-रे और DEXA हड्डी घनत्व स्कैन।'),
   treat:L('Bone-strengthening medicine, vitamin D and calcium, fall prevention and exercise.','हड्डी मज़बूत करने की दवा, विटामिन D और कैल्शियम, गिरने से बचाव और व्यायाम।'),
   outlook:L('Treatment reduces the risk of new fractures.','इलाज से नए फ्रैक्चर का खतरा कम होता है।'),
   w:{r_bones:4,fx_combo:2,a_60p:2,a_50_59:1,ch_posture:3,wall_pos:2,midback:1,sex_f:1,spine_multi:1}},
  {id:'pmr',th:[10,7,5],anchor:['ch_girdle'],onlyIf:{any:['a_50_59','a_60p']},depts:['rheum','medicine'],
   name:L('Polymyalgia rheumatica','पॉलीमायल्जिया रूमैटिका'),sci:'Polymyalgia rheumatica',
   what:L('An inflammatory condition after 50 causing pain and morning stiffness in both shoulders, the neck and both hips, often with tiredness.','50 के बाद की सूजन वाली बीमारी, जिसमें दोनों कंधों, गर्दन और दोनों कूल्हों में दर्द और सुबह की अकड़न, अक्सर थकान के साथ।'),
   causes:L('Unknown immune trigger; linked with giant cell arteritis (sudden headache or vision loss needs emergency care).','अज्ञात इम्यून कारण; जायंट सेल आर्टराइटिस से जुड़ा (अचानक सिरदर्द या नज़र जाना इमरजेंसी है)।'),
   confirm:L('Blood tests (ESR, CRP) and examination. Classification criteria need age 50 or over, aching in both shoulders and raised ESR or CRP, then add points for morning stiffness over 45 minutes, hip pain and normal rheumatoid tests (sensitivity 68%, specificity 78%).','ब्लड टेस्ट (ESR, CRP) और जांच। वर्गीकरण मापदंडों में 50 या ज़्यादा उम्र, दोनों कंधों में दर्द और बढ़ा ESR या CRP ज़रूरी है, फिर 45 मिनट से ज़्यादा सुबह की अकड़न, कूल्हे के दर्द और सामान्य रूमेटॉइड टेस्ट के अंक जुड़ते हैं (संवेदनशीलता 68%, विशिष्टता 78%)।'),cSrc:['pmr12'],
   treat:L('Steroid tablets under close medical supervision.','करीबी डॉक्टरी निगरानी में स्टेरॉयड की गोलियाँ।'),
   outlook:L('Responds quickly to treatment.','इलाज से जल्दी सुधार।'),
   w:{h_first:2,h_5y:-2,ch_girdle:5,trap:1,buttock:1,neck:1,ch_stiff_am:2,ch_fatigue:1,a_60p:2,a_50_59:1,squat_weak:1}},
  {id:'viral',th:[8,6,4],anchor:['ch_fever_ache'],depts:['medicine','gp'],
   name:L('Body ache from a viral fever (dengue, chikungunya, flu)','वायरल बुखार से बदन दर्द (डेंगू, चिकनगुनिया, फ्लू)'),sci:'Viral myalgia and arthralgia',
   what:L('Viral infections cause aching in the back, muscles and joints with fever; chikungunya can leave joint pain for weeks.','वायरल इन्फेक्शन बुखार के साथ पीठ, मांसपेशियों और जोड़ों में दर्द देते हैं; चिकनगुनिया में जोड़ों का दर्द हफ्तों रह सकता है।'),
   causes:L('Mosquito-borne and seasonal viruses.','मच्छर से फैलने वाले और मौसमी वायरस।'),
   confirm:L('Blood tests for dengue, chikungunya and blood counts as advised by a doctor.','डॉक्टर की सलाह पर डेंगू, चिकनगुनिया और ब्लड काउंट के टेस्ट।'),
   treat:L('Rest, fluids and fever medicine as advised; avoid painkillers that thin the blood in suspected dengue unless a doctor says otherwise.','आराम, पानी और डॉक्टर की सलाह से बुखार की दवा; डेंगू की आशंका में खून पतला करने वाली दर्द की दवा डॉक्टर की सलाह बिना न लें।'),
   outlook:L('Usually recovers in days to weeks.','आमतौर पर कुछ दिनों से हफ्तों में ठीक।'),
   w:{h_first:3,h_1_5y:-2,h_5y:-3,btw_some:-2,ch_fever_ache:6,d_days:2,d_weeks:1,wp_general:1,ch_fatigue:1,d_3m:-3}},
  {id:'wpost',th:[9,6,4],anchor:['spine_multi'],depts:['physio','gp'],
   name:L('Postural and muscle pain in several areas','कई जगह पोस्चर और मांसपेशियों का दर्द'),sci:'Myofascial and postural pain',
   what:L('Long hours of sitting, little exercise and stress tighten muscles along the whole back, from the neck to the lower back.','लंबे घंटे बैठना, कम व्यायाम और तनाव गर्दन से कमर तक पूरी पीठ की मांसपेशियों को जकड़ देते हैं।'),
   causes:L('Desk and screen work, weak core and shoulder muscles, poor sleep and stress.','डेस्क और स्क्रीन वर्क, कमज़ोर कोर और कंधे की मांसपेशियाँ, खराब नींद और तनाव।'),
   confirm:L('Examination; blood tests if tiredness or other symptoms suggest a medical cause.','जांच; थकान या दूसरे लक्षण हों तो ब्लड टेस्ट।'),
   treat:L('Regular movement breaks, strengthening, workstation changes and physiotherapy.','नियमित हलचल ब्रेक, मज़बूती के व्यायाम, काम की जगह में बदलाव और फिज़ियोथेरेपी।'),
   outlook:L('Improves well with habit changes.','आदतों में बदलाव से अच्छा सुधार।'),
   w:{btw_free:1,h_lt1y:1,spine_multi:2,r_desk:3,ch_ache:2,w_sit:2,b_exercise:1,b_walk:1,w_stress:1,a_18_29:1,a_30_39:1,rf_fever:-3}},
  {id:'scolio',th:[9,6,4],anchor:['ch_posture','wall_pos'],depts:['ortho_spine','physio'],
   name:L('Spinal curve (scoliosis or kyphosis)','रीढ़ में मोड़ (स्कोलियोसिस या काइफोसिस)'),sci:'Scoliosis · kyphosis',
   what:L('A sideways curve (scoliosis) or a forward rounding (kyphosis) changes how load passes through the spine and can cause aching at several levels.','साइड में मोड़ (स्कोलियोसिस) या आगे की गोलाई (काइफोसिस) रीढ़ पर भार के रास्ते को बदलती है और कई स्तरों पर दर्द दे सकती है।'),
   causes:L('Growth in adolescence, posture, degeneration in older adults or, rarely, nerve and muscle conditions.','किशोरावस्था की बढ़त, पोस्चर, बुज़ुर्गों में घिसावट या कभी-कभी नस और मांसपेशी की बीमारियाँ।'),
   confirm:L('A doctor looks at the back while you bend forward (Adams test) and may measure the rib hump with a scoliometer (at 7° it finds 78% of curves, specificity 89%); standing whole-spine X-rays confirm it. About 3% of school children have a curve of 10° or more.','डॉक्टर आगे झुकते समय पीठ देखते हैं (एडम्स टेस्ट) और स्कोलियोमीटर से पसलियों का उभार माप सकते हैं (7° पर यह 78% मोड़ पकड़ता है, विशिष्टता 89%); खड़े होकर पूरी रीढ़ का एक्स-रे पक्का करता है। लगभग 3% स्कूली बच्चों में 10° या ज़्यादा का मोड़ होता है।'),cSrc:['scolio17'],
   treat:L('Exercise and physiotherapy; a brace in growing children; surgery for severe or progressive curves.','व्यायाम और फिज़ियोथेरेपी; बढ़ते बच्चों में ब्रेस; गंभीर या बढ़ते मोड़ में सर्जरी।'),
   outlook:L('Most curves are mild and managed with exercise.','ज़्यादातर मोड़ हल्के होते हैं और व्यायाम से संभलते हैं।'),
   w:{h_5y:3,h_1_5y:1,h_first:-1,ch_posture:4,ch_rib_hump:3,wall_pos:2,a_u18:2,d_3m:2,spine_multi:1}},
  {id:'wserious',th:[10,8,7],rare:true,anchor:['r_cancer','rf_fever'],depts:['medicine','ortho_spine','onco'],
   name:L('Serious whole-body cause (myeloma, cancer spread or infection) – rare','गंभीर पूरे शरीर का कारण (मायलोमा, कैंसर फैलाव या इन्फेक्शन) – दुर्लभ'),sci:'Multiple myeloma · metastases · spinal infection',
   what:L('Rare, but doctors check for it when pain in several areas comes with past cancer, fever, weight loss, constant night pain or age over 50.','दुर्लभ, पर कई जगह दर्द के साथ पहले कैंसर, बुखार, वज़न घटना, रात का लगातार दर्द या 50 से ऊपर की उम्र हो तो डॉक्टर जांच करते हैं।'),
   causes:L('Bone marrow cancer (myeloma), spread from another cancer, or TB and other infections.','बोन मैरो कैंसर (मायलोमा), दूसरे कैंसर से फैलाव, या टीबी और दूसरे इन्फेक्शन।'),
   confirm:L('Blood tests (blood count, ESR, calcium, protein studies) and imaging.','ब्लड टेस्ट (ब्लड काउंट, ESR, कैल्शियम, प्रोटीन जांच) और इमेजिंग।'),treat:L('Depends on the cause.','कारण पर निर्भर।'),outlook:L('Early assessment matters.','जल्दी जांच ज़रूरी।'),
   w:{h_first:2,btw_often:2,h_5y:-2,r_cancer:5,rf_fever:3,rf_night:1,a_60p:1,a_50_59:1,ch_bone_tender:1,r_tb:2},cSrc:['downie','tbindia']}
];
const EMERG = {
  cauda:{name:L('Nerve compression affecting bladder or bowel','पेशाब या शौच को प्रभावित करता नस का दबाव'),sci:'Cauda equina or spinal cord compression',what:L('New bladder or bowel problems with back pain need an emergency MRI.','पीठ दर्द के साथ पेशाब या शौच की नई दिक्कत में तुरंत MRI ज़रूरी।'),src:['ces'],depts:['emergency','neurosurg']},
  cord:{name:L('Progressive nerve or cord damage','बढ़ता नस या कॉर्ड नुकसान'),sci:'Progressive neurological deficit',what:L('Worsening weakness or numbness needs emergency assessment.','बढ़ती कमज़ोरी या सुन्नपन में तुरंत जांच ज़रूरी।'),src:['wikem'],depts:['emergency','neurosurg']},
  cardiac:{name:L('Possible heart attack','दिल के दौरे की आशंका'),sci:'Acute coronary syndrome',what:L('Chest pressure with sweating or breathlessness: call an ambulance now.','पसीने या सांस फूलने के साथ सीने में दबाव: अभी एम्बुलेंस बुलाएं।'),src:['aha'],depts:['emergency','cardio']},
  trauma:{name:L('Possible spinal injury','रीढ़ की चोट की आशंका'),sci:'Major trauma',what:L('After a major injury get emergency imaging of the spine.','बड़ी चोट के बाद तुरंत रीढ़ की इमेजिंग।'),src:['wikem'],depts:['emergency','ortho_spine']}
};
C.DEPTS.cardio = C.DEPTS.cardio || {n:L('Cardiology','कार्डियोलॉजी'),s:L('Heart specialist.','दिल के विशेषज्ञ।'),q:'cardiologist'};
const RS = {
  o_fever:L('Fever, night sweats or weight loss with pain','दर्द के साथ बुखार, रात को पसीना या वज़न घटना'),
  o_cancer:L('New pain with a history of cancer','कैंसर के इतिहास के साथ नया दर्द'),
  o_night:L('Constant night pain at age 50 or over','50 या ज़्यादा उम्र में रात का लगातार दर्द'),
  o_pain:L('Very severe pain (9–10 out of 10)','बहुत तेज़ दर्द (10 में 9–10)'),
  o_pmr:L('Shoulder and hip girdle stiffness after 50: needs blood tests soon','50 के बाद कंधे और कूल्हे की अकड़न: जल्दी ब्लड टेस्ट ज़रूरी'),
  y_general:L('Pain in many body regions','शरीर के कई हिस्सों में दर्द'),
  y_multi:L('Pain in more than one part of the spine','रीढ़ के एक से ज़्यादा हिस्से में दर्द'),
  y_long:L('This bout has lasted more than 6 weeks','इस बार का दर्द 6 हफ्ते से ज़्यादा से है'),
  y_inflam:L('Inflammatory pattern: long morning stiffness, better with exercise','सूजन वाला पैटर्न: सुबह लंबी अकड़न, व्यायाम से आराम'),
  y_bone:L('Bone tenderness or weak thigh muscles','हड्डियों में दुखन या जांघ की कमज़ोर मांसपेशियाँ'),
  y_fever:L('Recent fever with body ache','हाल में बुखार के साथ बदन दर्द'),
  y_posture:L('Rounded back, curve or height loss','गोल पीठ, मोड़ या कद कम होना'),
  y_numb:L('Numbness or tingling in the limbs','हाथ-पैरों में सुन्नपन या झुनझुनी'),
  y_age:L('Age under 18 or over 60','18 से कम या 60 से ज़्यादा उम्र'), y_pain:L('Strong pain (7–8 out of 10)','तेज़ दर्द (10 में 7–8)'), y_sleep:L('Pain disturbing sleep','दर्द से नींद खराब')
};
const DERIVED = [
  {id:'reg_lu', when:{any:['trap_l','c5_l','c6_l']}}, {id:'reg_ru', when:{any:['trap_r','c5_r','c6_r']}},
  {id:'reg_ll', when:{any:['buttock_l','thigh_front_l','l4_l']}}, {id:'reg_rl', when:{any:['buttock_r','thigh_front_r','l4_r']}},
  {id:'wp_axial', when:{any:['neck','interscap','midback','lowback','chest']}},
  {id:'wp_general', when:{atLeast:[4,['reg_lu','reg_ru','reg_ll','reg_rl','wp_axial']]}},
  {id:'spine_multi', when:{atLeast:[2,['neck','interscap','midback','lowback']]}},
  {id:'ibp_ex', when:{any:['b_exercise','w_rest']}}, {id:'ibp2', when:{atLeast:[2,['ch_stiff_am','ibp_ex','ch_night_wake']]}}, {id:'ibp3', when:{atLeast:[3,['ch_stiff_am','ibp_ex','ch_night_wake']]}},
  {id:'fx_combo', when:{atLeast:[3,['sex_f','a_60p','rf_trauma','r_bones']]}}
];
const URGENCY = {
  orange:[{r:'o_fever', when:'rf_fever'}, {r:'o_cancer', when:{all:['r_cancer',{not:'d_3m'}]}}, {r:'o_night', when:{all:['rf_night',{any:['age_ge50','r_cancer']}]}}, {r:'o_pain', when:{painGte:9}},
    {r:'o_pmr', when:{all:['ch_girdle',{any:['a_50_59','a_60p']}]}}],
  yellow:[{r:'y_general', when:'wp_general'}, {r:'y_multi', when:'spine_multi'}, {r:'y_often', when:'btw_often'}, {r:'y_long', when:{any:['d_6_12','d_3m']}}, {r:'y_inflam', when:'ibp2'},
    {r:'y_bone', when:{any:['ch_bone_tender','ch_muscle_weak','squat_weak']}}, {r:'y_fever', when:'ch_fever_ache'}, {r:'y_posture', when:{any:['ch_posture','wall_pos','ch_rib_hump']}}, {r:'y_numb', when:'ch_numb'},
    {r:'y_age', when:{any:['a_u18','a_60p']}}, {r:'y_pain', when:{all:[{painGte:7},{not:{painGte:9}}]}}, {r:'y_sleep', when:'sleep_bad'}]
};
const FX = {
  wp_general:L('Pain in at least 4 of 5 body regions is "generalised pain", a key part of the fibromyalgia criteria.','5 में से कम से कम 4 हिस्सों में दर्द "सामान्यीकृत दर्द" है, जो फाइब्रोमायल्जिया मानदंडों का मुख्य हिस्सा है।'),
  spine_multi:L('Pain in two or more parts of the spine suggests a whole-spine process such as wear at several levels or inflammation.','रीढ़ के दो या ज़्यादा हिस्सों में दर्द पूरी रीढ़ की प्रक्रिया, जैसे कई स्तरों पर घिसावट या सूजन, का संकेत है।'),
  ch_fatigue:L('Unrefreshing sleep and tiredness often go with widespread pain.','बेताज़ा नींद और थकान अक्सर व्यापक दर्द के साथ होते हैं।'),
  ch_brainfog:L('Memory and concentration problems are part of the fibromyalgia symptom score.','याददाश्त और ध्यान की समस्या फाइब्रोमायल्जिया लक्षण स्कोर का हिस्सा है।'),
  ch_bone_tender:L('Tender bones suggest a bone problem such as vitamin D deficiency.','दुखती हड्डियाँ विटामिन D की कमी जैसी हड्डी की समस्या का संकेत हैं।'),
  ch_muscle_weak:L('Difficulty rising from low seats points to weak hip muscles (vitamin D, polymyalgia, muscle disease).','नीची सीट से उठने में दिक्कत कमज़ोर कूल्हे की मांसपेशियों (विटामिन D, पॉलीमायल्जिया, मांसपेशी रोग) की ओर इशारा करती है।'),
  squat_weak:L('A slow chair rise shows weak thigh and hip muscles.','धीमा कुर्सी से उठना कमज़ोर जांघ और कूल्हे की मांसपेशियाँ दिखाता है।'),
  ch_girdle:L('Morning stiffness in both shoulders and hips after 50 is typical of polymyalgia rheumatica.','50 के बाद दोनों कंधों और कूल्हों में सुबह की अकड़न पॉलीमायल्जिया रूमैटिका का खास लक्षण है।'),
  ch_fever_ache:L('Recent fever with body ache points to a viral illness.','हाल में बुखार के साथ बदन दर्द वायरल बीमारी की ओर इशारा करता है।'),
  ch_posture:L('A curve or rounding changes how load passes through the spine.','मोड़ या गोलाई रीढ़ पर भार के रास्ते को बदलती है।'),
  wall_pos:L('Not touching the wall with the head shows a rounded upper back.','सिर का दीवार से न लगना गोल ऊपरी पीठ दिखाता है।'),
  w_stress:L('Pain that worsens with stress and poor sleep fits central pain sensitisation.','तनाव और खराब नींद से बढ़ता दर्द केंद्रीय दर्द संवेदनशीलता से मेल खाता है।'),
  ch_rib_hump:L('A rib hump on bending forward is the classic sign of scoliosis.','आगे झुकने पर पसलियों का उभार स्कोलियोसिस का क्लासिक संकेत है।'),
  ch_night_wake:L('Waking in the second half of the night and easing on getting up is an inflammatory back pain feature.','रात के दूसरे हिस्से में नींद खुलना और उठने पर आराम सूजन वाले पीठ दर्द का लक्षण है।')
};
const STATS = [
  {v:'4 of 5',t:L('body regions with pain for 3 months defines "generalised pain" in the 2016 fibromyalgia criteria','शरीर के हिस्सों में 3 महीने दर्द 2016 फाइब्रोमायल्जिया मानदंड में "सामान्यीकृत दर्द" कहलाता है'),s:'fm2016'},
  {v:'67%',t:L('of Indian adults have low vitamin D, a treatable cause of aching bones','भारतीय वयस्कों में विटामिन D कम है, जो हड्डियों के दर्द का इलाज योग्य कारण है'),s:'vitd'},
  {v:'46 million',t:L('Indian women have osteoporosis; 17.1% of women over 50 in Delhi had a spinal fracture','भारतीय महिलाओं को ऑस्टियोपोरोसिस; दिल्ली में 50 से ऊपर की 17.1% महिलाओं को रीढ़ का फ्रैक्चर'),s:'khadilkar15'},
  {v:'12×',t:L('more likely axial spondyloarthritis with 3 inflammatory back pain features','ज़्यादा संभावना एक्सियल स्पॉन्डिलोआर्थराइटिस की, सूजन वाले पीठ दर्द के 3 लक्षणों के साथ'),s:'rudw06'},
  {v:'~3%',t:L('of school children have a scoliosis curve of 10° or more','स्कूली बच्चों में 10° या ज़्यादा का स्कोलियोसिस मोड़'),s:'scolio17'},
  {v:'~20%',t:L('of people with neck cord compression also have narrowing in the lower back (tandem stenosis)','गर्दन में कॉर्ड दबाव वाले लोगों में कमर में भी संकरापन होता है (टैंडम स्टेनोसिस)'),s:'myelo'}
];
const UI = {repT:L('Whole back pain assessment','पूरी पीठ दर्द जांच रिपोर्ट'),
  must:[L('This assessment cannot test your reflexes, muscle strength or skin feeling, or examine your joints, which a doctor does by examining you.','यह जांच आपके रिफ़्लेक्स, मांसपेशियों की ताकत या त्वचा की संवेदना नहीं परख सकती, या जोड़ों की जांच नहीं कर सकती, जो डॉक्टर जांच से करते हैं।'),
    L('Only a doctor can decide whether you need X-rays, an MRI or blood tests, and interpret them with the examination.','एक्स-रे, MRI या ब्लड टेस्ट की ज़रूरत है या नहीं, यह सिर्फ़ डॉक्टर तय कर सकते हैं और जांच के साथ उनका मतलब समझा सकते हैं।'),
    L('Pain in many places can also come from low vitamin D, thyroid problems, inflammation or infection; blood tests help a doctor find these.','कई जगह दर्द कम विटामिन D, थायरॉइड, सूजन या इन्फेक्शन से भी हो सकता है; ब्लड टेस्ट से डॉक्टर इन्हें पहचानते हैं।'),
    L('Medicines and exercise plans must be chosen for you personally.','दवाएं और व्यायाम योजना आपके लिए व्यक्तिगत रूप से तय होनी चाहिए।')],
  gPost:L('The whole spine from behind with key vertebrae numbered. Highlighted: the structures linked to your likely cause.','पूरी रीढ़ पीछे से, मुख्य हड्डियों पर नंबर। चमकते हिस्से: आपके संभावित कारण से जुड़े ढांचे।'),
  gRef:L('The whole spine from the neck to the tailbone, for reference.','संदर्भ के लिए गर्दन से टेलबोन तक पूरी रीढ़।'),
  gX:L('Full skeleton and nerves with the areas you marked.','आपके चिन्हित हिस्सों के साथ पूरा कंकाल और नसें।')};
const FUNCS = [{id:'walk', label:'walk', req:true, opts:C.WALKS}, {id:'sleep', label:'sleep', req:true, opts:C.SLEEPS}];
const FOCUS = {fibro:{}, waxspa:{bones:['sacrum','pelvis'], vert:['L3','L4','L5','T10','T11','T12']}, multispond:{discs:['C5–C6','C6–C7','L4–L5','L5–S1'], label:['C5–C6','L4–L5']},
  osteomal:{bones:['pelvis','leg','ribs']}, osteopor:{vert:['T7','T8','T12','L1']}, pmr:{bones:['scap','pelvis']}, scolio:{vert:['T6','T7','T8','T9','T10']}, wpost:{}, wserious:{}};
const sideAreas = ['trap','c5','c6','buttock','thigh_front','l4'];
SPG.data.modules.whole = {id:'whole', order:4, card:{reg:['neck','interscap','midback','lowback'], view:{az:Math.PI, el:0.05, d:3.5, yk:'mid', dy:-0.02}, hint:L('Pain in many places, morning stiffness, bent posture','कई जगह दर्द, सुबह की जकड़न, कमर का झुकना')}, name:L('Pain in more than one part of the back, or the whole spine','पीठ के एक से ज़्यादा हिस्से में या पूरी रीढ़ में दर्द'), safetyView:'back', startRegions:['neck','interscap','midback','lowback'], safetyRegions:[],
  labelSet:['C2','C5','C7','T4','T8','T12','L3','L5','S1'], GAL:{d:1.5, ref:'T10', refDy:0.02, pelvis:true, nerves:['cord'], lscale:2.2}, defaultDept:'medicine',
  DOMS:null, PAT, RFS, VIEWS, AREAS, TESTS, CONDS, EMERG, ROOTS:{}, RS, DERIVED, SIDES:{areas:sideAreas, sideAreas}, URGENCY,
  EMERG_WHEN:{cauda:'rf_bladder', cord:'rf_weak_prog', cardiac:'rf_cardiac', trauma:'rf_trauma'}, ROOT_RULES:[], DISC_OF:{}, EXIT_OF:{}, DEPT_RULES:[], FOCUS, RCA:null, LBLX:{
    wp_general:L('Generalised pain (4 of 5 regions)','सामान्यीकृत दर्द (5 में से 4 हिस्से)'), spine_multi:L('Pain in more than one spinal region','रीढ़ के एक से ज़्यादा हिस्से में दर्द'), wp_axial:L('Spine or chest pain','रीढ़ या छाती दर्द'),
    ibp_ex:L('Better with exercise, worse with rest','व्यायाम से बेहतर, आराम से बदतर'), ibp2:L('2 or more inflammatory back pain features','सूजन वाले पीठ दर्द के 2 या ज़्यादा लक्षण'), ibp3:L('3 inflammatory back pain features','सूजन वाले पीठ दर्द के 3 लक्षण'), fx_combo:L('Three fracture risk factors together','फ्रैक्चर के तीन जोखिम एक साथ')},
  UI, FUNCS, FX, STATS};
})();
