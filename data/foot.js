window.SPG = window.SPG || {data:{modules:{}}};
/* Leg, ankle and foot module (v5.5). Questions, weights, rules and explanations.
   Evidence table: research/foot-evidence.md. Weights from likelihood ratios use round(4 x log10(LR)); others are marked expert estimates there. */
(function(){
const PI = Math.PI;
const L = (en, hi) => ({en, hi});
const C = SPG.data.common;
C.SRC.push(
  ['aafppf','Trojian T, Tucker AK. Plantar fasciitis. Am Fam Physician 2019;99:744–50 (10% lifetime; about 80% improve within 12 months; windlass test specificity 100%, sensitivity 32%)','https://www.aafp.org/pubs/afp/issues/2019/0615/p744.html'],
  ['ottankle','Bachmann LM et al. Accuracy of Ottawa ankle rules to exclude fractures of the ankle and mid-foot: systematic review. BMJ 2003;326:417–9 (pooled sensitivity 97.6%)','https://www.aafp.org/pubs/afp/issues/2003/0815/p745a.html'],
  ['achrup','GPnotebook – Complete rupture of the Achilles tendon: calf squeeze sensitivity 0.96; up to 20–25% missed at first visit; same-day orthopaedic referral','https://gpnotebook.com/pages/musculoskeletal-medicine/complete-rupture-of-the-achilles-tendon/diagnostic-process'],
  ['morton','Sports Injury Bulletin – Morton’s neuroma, citing Mahadevan 2015 (J Foot Ankle Surg): thumb-index finger squeeze sensitivity 96%; 3rd–4th web space in 80–85%','https://www.sportsinjurybulletin.com/mortons-neuroma-clinical-assessment-and-management/'],
  ['mtss','StatPearls – Medial tibial stress syndrome (13.6–20% of runners; tenderness over more than 5 cm, a stress fracture is pinpoint under 5 cm)','https://statpearls.com/point-of-care/42693'],
  ['hvalgus','Nix S et al. Prevalence of hallux valgus: systematic review and meta-analysis. J Foot Ankle Res 2010;3:21 (23% of adults, 35.7% over 65; women 30%, men 13%)','https://scalda.mijn.bsl.nl/prevalence-of-hallux-valgus-in-the-general-population-a-systemat/7109980'],
  ['indiab','ICMR-INDIAB study, Lancet Diabetes Endocrinol 2023: diabetes in 11.4% of Indians, prediabetes 15.3%','https://www.thequint.com/fit/diabetes-obesity-study-results-india-icmr'],
  ['diabfoot','NHS Borders / Scottish Diabetes Foot Action Group – management of the diabetic foot: ulcer with fever, sepsis, ischaemia or gangrene needs immediate referral; other active foot problems within 1 working day','https://www.rightdecisions.scot.nhs.uk/borders-ref-help-toolkit/podiatry/management-of-the-diabetic-foot']
);
const ONSETS = [
  ['on_gradual',L('Slowly, with no clear reason','धीरे-धीरे, बिना किसी साफ़ वजह के')],
  ['on_roll',L('Rolled or twisted the ankle (missed a step, uneven road, sport)','टखना मुड़ गया (सीढ़ी चूकी, ऊबड़-खाबड़ रास्ता, खेल)')],
  ['on_more_walk',L('More walking, running, standing or sport than usual','सामान्य से ज़्यादा चलना, दौड़ना, खड़े रहना या खेल')],
  ['on_new_shoes',L('New or tight shoes, or walking barefoot more','नए या तंग जूते, या ज़्यादा नंगे पैर चलना')],
  ['on_fall',L('A fall, a jump from a height or something dropped on the foot','गिरना, ऊंचाई से कूदना या पैर पर कुछ गिरना')],
  ['on_woke',L('Woke up with it','सुबह उठे तो दर्द था')],
  ['on_accident',L('Road accident','सड़क दुर्घटना')]
];
const PAT = {
  char:[
    ['ch_first_step',L('Sharp heel pain with the first steps in the morning or after sitting, easing after a few minutes','सुबह या बैठने के बाद पहले कदमों पर एड़ी में तेज़ दर्द, जो कुछ मिनट में कम हो जाए')],
    ['ch_snap',L('A sudden feeling of being kicked or hit at the back of the heel, sometimes with a snap','एड़ी के पीछे अचानक किसी के लात मारने या चोट लगने जैसा एहसास, कभी-कभी चटकने की आवाज़ के साथ')],
    ['ch_calf_sudden',L('Sudden sharp pain in the calf muscle during sport or a push-off','खेल या पैर से धक्का देते समय पिंडली की मांसपेशी में अचानक तेज़ दर्द')],
    ['ch_focal_bone',L('Pain pinpointed on one spot of a bone, worse with every step or hop','हड्डी के एक ही बिंदु पर दर्द, हर कदम या कूदने पर बढ़ता')],
    ['ch_stone',L('Feels like walking on a pebble; burning, sharp pain or numbness into two toes','जैसे कंकड़ पर चल रहे हों; दो उंगलियों तक जलन, तेज़ दर्द या सुन्नपन')],
    ['ch_numb_both',L('Numbness, tingling or burning in both feet, starting in the toes','दोनों पैरों में सुन्नपन, झुनझुनी या जलन, उंगलियों से शुरू')],
    ['ch_hot_toe',L('A sudden, very painful, red, hot and swollen big toe or foot joint, often overnight','अचानक बहुत दर्द वाला, लाल, गर्म और सूजा अंगूठा या पैर का जोड़, अक्सर रात भर में')],
    ['ch_bunion',L('A bony bump on the side of the big toe, with the toe angled inwards','अंगूठे की साइड में हड्डी का उभार, अंगूठा अंदर की ओर मुड़ा')],
    ['ch_swell',L('Swelling and bruising around the ankle','टखने के आसपास सूजन और नील')],
    ['ch_unstable',L('The ankle keeps rolling over or feels weak on uneven ground','टखना बार-बार मुड़ता है या ऊबड़-खाबड़ ज़मीन पर कमज़ोर लगता है')],
    ['ch_shoot_leg',L('Shooting pain from the back or buttock down the leg into the foot','कमर या नितंब से पैर में नीचे तक करंट जैसा दर्द')]
  ],
  worse:[
    ['w_run',L('Running, jumping or sport','दौड़ना, कूदना या खेल')],
    ['w_walk_long',L('Walking or standing for long','देर तक चलना या खड़े रहना')],
    ['w_walk_calf',L('Calf pain on walking a set distance that eases within minutes of standing still','एक तय दूरी चलने पर पिंडली में दर्द जो खड़े होकर रुकने पर कुछ मिनट में ठीक हो जाए')],
    ['w_tight_shoes',L('Tight or narrow shoes, high heels','तंग या पतले जूते, ऊंची एड़ी')],
    ['w_night',L('Burning or pain in the feet at night in bed','रात को बिस्तर पर पैरों में जलन या दर्द')]
  ],
  better:[['b_rest',L('Rest','आराम')],['b_shoes_off',L('Taking the shoes off and rubbing the foot','जूते उतारकर पैर मलना')]],
  other:[
    ['o_overweight',L('Overweight, or gained weight recently','ज़्यादा वज़न, या हाल में वज़न बढ़ा')],
    ['o_gout',L('Past attacks of gout','पहले गाउट के दौरे')],
    ['o_cold_foot',L('The foot is often cold or pale, or cuts on it heal slowly','पैर अक्सर ठंडा या पीला रहता है, या उस पर कट धीरे भरते हैं')]
  ]
};
const RFS = [
  ['rf_fracture',L('After an injury: could not take 4 steps, or the back or tip of either ankle bone, the outer edge of the foot or the top of the inner midfoot hurts to touch','चोट के बाद: 4 कदम नहीं चल पाए, या किसी भी टखने की हड्डी का पिछला हिस्सा या सिरा, पैर का बाहरी किनारा या अंदरूनी बीच के पैर का ऊपरी हिस्सा छूने पर दुखता है')],
  ['rf_ischaemia',L('The foot or leg suddenly became cold, pale, numb or very painful, or there is black skin','पैर अचानक ठंडा, पीला, सुन्न या बहुत दर्द वाला हो गया, या त्वचा काली पड़ गई')],
  ['rf_ulcer_fever',L('A foot wound or ulcer with fever, spreading redness or a bad smell','पैर के घाव या अल्सर के साथ बुखार, फैलती लाली या बदबू')],
  ['rf_dvt',L('The calf is swollen, warm and tender, especially after long travel, an operation, a plaster cast or bed rest','पिंडली सूजी, गर्म और दबाने पर दर्द वाली है, खासकर लंबी यात्रा, ऑपरेशन, प्लास्टर या बिस्तर पर आराम के बाद')],
  ['rf_hot',L('A foot or ankle joint is hot, red and swollen and you have a fever','पैर या टखने का जोड़ गर्म, लाल और सूजा है और बुखार है')],
  ['rf_ulcer',L('A wound, blister or sore on the foot that is not healing (especially with diabetes)','पैर पर घाव, छाला या ज़ख्म जो भर नहीं रहा (खासकर डायबिटीज़ में)')],
  ['rf_night',L('Constant pain at night that no position eases, or fever and weight loss','रात को लगातार दर्द जो किसी भी पोज़िशन में कम न हो, या बुखार और वज़न घटना')]
];
const VIEWS = {
  shin_in:{az:-0.55,el:0.12,d:1.2,yk:'knee',dy:-0.2,tx:0.16}, calf:{az:PI-0.35,el:0.08,d:1.25,yk:'knee',dy:-0.16,tx:0.14},
  achilles:{az:PI-0.4,el:0.12,d:0.75,yk:'ankle',dy:0.06,tx:0.2}, ankle_out:{az:1.35,el:0.18,d:0.7,yk:'ankle',dy:0.03,tx:0.2},
  ankle_in:{az:-1.0,el:0.18,d:0.7,yk:'ankle',dy:0.03,tx:0.2}, heel:{az:PI-0.5,el:-0.05,d:0.7,yk:'ankle',dy:0.0,tx:0.2},
  arch:{az:-1.2,el:-0.3,d:0.7,yk:'ankle',dy:0.0,tx:0.2}, ball:{az:0.4,el:-0.35,d:0.7,yk:'ankle',dy:0.0,tx:0.2},
  bigtoe:{az:-0.9,el:0.35,d:0.5,yk:'ankle',dy:-0.03,tx:0.19,tz:0.1}, lowback:{az:PI,el:0.1,d:2.0,yk:'hj',dy:0.18}
};
const AREAS = [
  {id:'heel',pair:true,view:'heel',name:L('Under or behind the heel','एड़ी के नीचे या पीछे'),desc:L('The bottom of the heel where it meets the ground, and the back of the heel bone.','एड़ी का निचला हिस्सा जो ज़मीन पर टिकता है, और एड़ी की हड्डी का पिछला हिस्सा।'),rel:L('Pain under the heel with the first steps is typical of plantar fasciitis, the commonest cause of heel pain in adults.','पहले कदमों पर एड़ी के नीचे दर्द प्लांटर फ़ेशियाइटिस का खास लक्षण है, जो वयस्कों में एड़ी दर्द का सबसे आम कारण है।')},
  {id:'achilles',pair:true,view:'achilles',name:L('Achilles tendon (cord above the back of the heel)','एकिलीज़ टेंडन (एड़ी के पीछे ऊपर की ओर जाती डोरी)'),desc:L('The thick cord running up from the back of the heel to the calf.','एड़ी के पीछे से पिंडली तक ऊपर जाती मोटी डोरी।'),rel:L('Pain and stiffness here point to Achilles tendinopathy; a sudden kick-like pain to a rupture.','यहाँ दर्द और जकड़न एकिलीज़ टेंडिनोपैथी की ओर; अचानक लात जैसा दर्द फटने की ओर इशारा करता है।')},
  {id:'ankle_out',pair:true,view:'ankle_out',name:L('Outer side of the ankle','टखने का बाहरी हिस्सा'),desc:L('Around and below the bony knob on the outside of the ankle.','टखने के बाहर की उभरी हड्डी के आसपास और नीचे।'),rel:L('Most ankle sprains injure the ligaments on the outer side.','ज़्यादातर टखने की मोच में बाहरी तरफ़ के लिगामेंट चोटिल होते हैं।')},
  {id:'ankle_in',pair:true,view:'ankle_in',name:L('Inner side of the ankle','टखने का अंदरूनी हिस्सा'),desc:L('Around and below the bony knob on the inside of the ankle.','टखने के अंदर की उभरी हड्डी के आसपास और नीचे।'),rel:L('Inner ankle pain can come from a tendon that supports the arch, or from a sprain or fracture.','अंदरूनी टखने का दर्द आर्च को सहारा देने वाले टेंडन, या मोच या फ्रैक्चर से हो सकता है।')},
  {id:'arch',pair:true,view:'arch',name:L('Arch of the foot','पैर का आर्च (तलवे का बीच)'),desc:L('The middle of the sole between the heel and the ball of the foot.','एड़ी और पंजे के गद्देदार हिस्से के बीच तलवे का बीच वाला भाग।'),rel:L('Arch pain often comes from the plantar fascia or, with long standing, from foot strain.','आर्च का दर्द अक्सर प्लांटर फ़ेशिया से, या देर तक खड़े रहने से पैर पर खिंचाव से होता है।')},
  {id:'ball',pair:true,view:'ball',name:L('Ball of the foot or between the toes','पंजे का गद्देदार हिस्सा या उंगलियों के बीच'),desc:L('The padded front of the sole under the toe joints, and the spaces between the toes.','उंगलियों के जोड़ों के नीचे तलवे का गद्देदार आगे का हिस्सा, और उंगलियों के बीच की जगह।'),rel:L('Burning pain between the 3rd and 4th toes points to a Morton’s neuroma.','तीसरी और चौथी उंगली के बीच जलन वाला दर्द मॉर्टन न्यूरोमा की ओर इशारा करता है।')},
  {id:'bigtoe',pair:true,view:'bigtoe',name:L('Big toe joint','अंगूठे का जोड़'),desc:L('The joint at the base of the big toe.','पैर के अंगूठे की जड़ का जोड़।'),rel:L('A hot, swollen big toe joint is the classic place for gout; a bony bump on its side is a bunion.','गर्म, सूजा अंगूठे का जोड़ गाउट की क्लासिक जगह है; उसकी साइड में हड्डी का उभार बनियन है।')},
  {id:'shin_in',pair:true,view:'shin_in',name:L('Inner edge of the shin','पिंडली की हड्डी का अंदरूनी किनारा'),desc:L('The inner border of the shin bone, in the lower two-thirds of the leg.','पिंडली की हड्डी का अंदरूनी किनारा, पैर के निचले दो-तिहाई हिस्से में।'),rel:L('Diffuse pain along more than 5 cm here is shin splints; one pinpoint spot suggests a stress fracture.','यहाँ 5 सेमी से ज़्यादा फैला दर्द शिन स्प्लिंट्स है; एक ही बिंदु पर दर्द स्ट्रेस फ्रैक्चर का संकेत है।')},
  {id:'calf',pair:true,view:'calf',name:L('Calf (back of the lower leg)','पिंडली (निचले पैर का पिछला हिस्सा)'),desc:L('The muscle at the back of the leg below the knee.','घुटने के नीचे पैर के पीछे की मांसपेशी।'),rel:L('Calf pain can be a muscle tear, narrowed leg arteries, or a blood clot that needs a scan.','पिंडली का दर्द मांसपेशी फटना, पैर की संकरी धमनियाँ, या खून का थक्का हो सकता है जिसके लिए स्कैन ज़रूरी है।')},
  {id:'lowback',pair:false,view:'lowback',name:L('Lower back','कमर'),desc:L('The lower back, between the bottom ribs and the buttocks.','कमर, नीचे की पसलियों और नितंबों के बीच।'),rel:L('Leg and foot pain with back pain may come from a pinched nerve in the back (sciatica).','कमर दर्द के साथ पैर और पंजे का दर्द कमर की दबी नस (साइटिका) से हो सकता है।')}
];
const TESTS = [
  {id:'windlass',name:L('Big toe lift (windlass test)','अंगूठा ऊपर उठाना (विंडलास टेस्ट)'),
   steps:[L('Stand with your weight on both feet, holding something for balance.','दोनों पैरों पर वज़न रखकर खड़े हों, संतुलन के लिए कुछ पकड़ लें।'),L('Lift the big toe of the painful foot up as far as it will go (or ask someone to bend it up) and hold for 30 seconds.','दर्द वाले पैर का अंगूठा जितना हो सके ऊपर उठाएं (या किसी से ऊपर मुड़वाएं) और 30 सेकंड रोकें।')],
   pos:L('It brings on your pain under the heel or along the arch.','एड़ी के नीचे या आर्च में आपका दर्द आ जाए।'),
   acc:L('Very specific but insensitive: when positive it points strongly to plantar fasciitis, but it is negative in about two-thirds of people who have it.','बहुत विशिष्ट पर कम संवेदनशील: पॉज़िटिव हो तो प्लांटर फ़ेशियाइटिस की ओर मज़बूत इशारा, पर यह बीमारी वाले लगभग दो-तिहाई लोगों में नेगेटिव आता है।'),src:'aafppf',ans:[['windlass_pos','tPos','y'],['windlass_neg','tNeg','n'],['windlass_skip','tSkip','s']]},
  {id:'fheel',name:L('Single-leg heel raise','एक पैर पर पंजों के बल उठना'),
   steps:[L('Stand on the painful leg only, lightly holding a wall.','सिर्फ़ दर्द वाले पैर पर खड़े हों, हल्का सा दीवार पकड़ें।'),L('Rise up onto the toes as high as you can, 10 times, and compare with the other side.','पंजों के बल जितना ऊंचा हो सके 10 बार उठें, और दूसरी तरफ़ से तुलना करें।')],
   pos:L('Pain at the back of the heel or in the Achilles tendon, or you cannot rise at all on that side.','एड़ी के पीछे या एकिलीज़ टेंडन में दर्द, या उस तरफ़ बिल्कुल नहीं उठ पाते।'),
   acc:L('Pain points to the Achilles tendon. Being unable to rise at all after a sudden injury suggests a rupture, which up to 20–25% of the time is missed at the first visit.','दर्द एकिलीज़ टेंडन की ओर इशारा करता है। अचानक चोट के बाद बिल्कुल न उठ पाना फटने का संकेत है, जो 20–25% तक बार पहली जांच में छूट जाता है।'),src:'achrup',ans:[['hr_pain','tPos','y'],['hr_cannot','tHrCannot','y'],['hr_ok','tNeg','n'],['hr_skip','tSkip','s']]},
  {id:'fsq',name:L('Squeeze between the toes','उंगलियों के बीच दबाना'),
   steps:[L('Sit and take the foot in your hand. Place your thumb on the sole and your index finger on top, in the space between the 3rd and 4th toes, just behind the toes.','बैठें और पैर हाथ में लें। अंगूठा तलवे पर और तर्जनी ऊपर रखें, तीसरी और चौथी उंगली के बीच की जगह में, उंगलियों के ठीक पीछे।'),L('Squeeze firmly for a few seconds. Repeat between the 2nd and 3rd toes.','कुछ सेकंड ज़ोर से दबाएं। दूसरी और तीसरी उंगली के बीच दोहराएं।')],
   pos:L('It brings on your sharp or burning pain, or numbness running into the toes.','आपका तेज़ या जलन वाला दर्द, या उंगलियों तक जाता सुन्नपन आ जाए।'),
   acc:L('This thumb-and-finger squeeze picked up 96% of Morton’s neuromas in one study.','एक अध्ययन में इस अंगूठे-उंगली वाले दबाव से 96% मॉर्टन न्यूरोमा पकड़े गए।'),src:'morton',ans:[['squeeze_pos','tPos','y'],['squeeze_neg','tNeg','n'],['squeeze_skip','tSkip','s']]}
];
const D = C.DEPTS;
D.medicine = D.medicine || {n:L('General medicine / Internal medicine','जनरल मेडिसिन / इंटरनल मेडिसिन'),s:L('Whole-body causes: blood tests, infections, diabetes, gout.','पूरे शरीर से जुड़े कारण: ब्लड टेस्ट, इन्फेक्शन, डायबिटीज़, गाउट।'),q:'physician'};
D.sports = D.sports || {n:L('Sports medicine / Arthroscopy','स्पोर्ट्स मेडिसिन / आर्थ्रोस्कोपी'),s:L('Ligament, tendon and sports injuries.','लिगामेंट, टेंडन और खेल की चोटें।'),q:'sports medicine doctor'};
D.paeds = D.paeds || {n:L('Paediatric orthopaedics','बाल हड्डी रोग (पीडियाट्रिक ऑर्थोपेडिक्स)'),s:L('Bone and joint problems in children and teenagers.','बच्चों और किशोरों में हड्डी और जोड़ों की समस्याएं।'),q:'pediatric orthopedic'};
D.podiatry = D.podiatry || {n:L('Diabetic foot clinic / Podiatry','डायबिटिक फ़ुट क्लिनिक / पोडियाट्री'),s:L('Foot checks, wounds, shoes and insoles, especially with diabetes.','पैरों की जांच, घाव, जूते और इनसोल, खासकर डायबिटीज़ में।'),q:'diabetic foot clinic podiatrist'};
const footAreas = ['heel','achilles','ankle_out','ankle_in','arch','ball','bigtoe','shin_in','calf'];
const CONDS = [
  {id:'pfasc',th:[10,7,4],anchor:['heel','ch_first_step','windlass_pos'],depts:['physio','ortho'],
   name:L('Plantar heel pain (plantar fasciitis)','एड़ी के नीचे दर्द (प्लांटर फ़ेशियाइटिस)'),sci:'Plantar fasciitis (plantar fasciopathy)',
   what:L('The thick band under the sole (plantar fascia) is overloaded where it attaches to the heel bone. The pain is sharp with the first steps in the morning or after sitting, eases after a few minutes of walking, then returns at the end of the day.','तलवे के नीचे की मोटी पट्टी (प्लांटर फ़ेशिया) पर एड़ी की हड्डी से जुड़ने की जगह पर ज़्यादा भार पड़ता है। सुबह या बैठने के बाद पहले कदमों पर तेज़ दर्द, कुछ मिनट चलने पर कम, फिर दिन के अंत में लौट आता है।'),
   causes:L('Long standing or walking on hard floors, a rise in walking or running, extra body weight and tight calves. About 10% of people get it in their lifetime; it is most common in women aged 40–60. Heel spurs on X-ray are common in people without pain and are not the cause.','सख्त फ़र्श पर देर तक खड़े रहना या चलना, ज़्यादा चलना या दौड़ना, ज़्यादा वज़न और कसी पिंडलियाँ। लगभग 10% लोगों को जीवन में कभी होता है; 40–60 उम्र की महिलाओं में सबसे आम। एक्स-रे में एड़ी का स्पर बिना दर्द वालों में भी आम है और यह कारण नहीं है।'),cSrc:['aafppf'],
   confirm:L('Examination is usually enough; ultrasound if it lasts more than 3 months despite treatment.','आमतौर पर जांच काफ़ी है; इलाज के बावजूद 3 महीने से ज़्यादा रहे तो अल्ट्रासाउंड।'),
   treat:L('Plantar fascia and calf stretching, cushioned footwear or off-the-shelf insoles, ice massage, reducing standing; injections or shock-wave therapy only if it persists.','प्लांटर फ़ेशिया और पिंडली की स्ट्रेचिंग, गद्देदार जूते या बाज़ार में मिलने वाले इनसोल, बर्फ़ से मालिश, खड़े रहना कम करना; बना रहे तभी इंजेक्शन या शॉक-वेव थेरेपी।'),
   outlook:L('About 80% improve within 12 months without an operation.','लगभग 80% लोग बिना ऑपरेशन 12 महीने में सुधर जाते हैं।'),oSrc:['aafppf'],
   w:{heel:3,arch:1,ch_first_step:4,windlass_pos:2,w_walk_long:2,on_more_walk:1,o_overweight:1,a_40_49:2,a_50_59:2,sex_f:1,b_shoes_off:-1,
      ch_numb_both:-2,w_night:-2,achilles:-1,ch_snap:-3,a_u18:-2,ch_hot_toe:-2}},
  {id:'sever',th:[8,6,4],anchor:['heel'],onlyIf:'a_u18',depts:['paeds','physio'],
   name:L('Sever’s disease (heel pain in growing children)','सीवर रोग (बढ़ते बच्चों में एड़ी का दर्द)'),sci:'Calcaneal apophysitis',
   what:L('In active children the Achilles tendon pulls on the growth area at the back of the heel bone, causing heel pain with running and jumping.','सक्रिय बच्चों में एकिलीज़ टेंडन एड़ी की हड्डी के पिछले बढ़ने वाले हिस्से पर खिंचाव डालता है, जिससे दौड़ने और कूदने पर एड़ी में दर्द होता है।'),
   causes:L('Sport during growth: girls about 8–13, boys about 10–15.','बढ़त के दौर में खेल: लड़कियाँ लगभग 8–13, लड़के लगभग 10–15।'),cSrc:['aafppf'],
   confirm:L('Examination.','जांच।'),treat:L('Adjusting sport to pain, heel cups, calf stretching.','दर्द के हिसाब से खेल कम-ज़्यादा करना, हील कप, पिंडली की स्ट्रेचिंग।'),outlook:L('Settles when the growth plate closes.','ग्रोथ प्लेट बंद होने पर ठीक हो जाता है।'),
   w:{heel:3,achilles:1,a_u18:3,w_run:2,on_more_walk:2,ch_first_step:-1}},
  {id:'achten',th:[9,6,4],anchor:['achilles'],depts:['physio','sports'],
   name:L('Achilles tendinopathy','एकिलीज़ टेंडिनोपैथी'),sci:'Achilles tendinopathy (mid-portion or insertional)',
   what:L('The Achilles tendon becomes painful and thickened from overload, usually a few centimetres above the heel or where it joins the heel bone. It is stiff and sore first thing in the morning and at the start of exercise.','ज़्यादा भार से एकिलीज़ टेंडन दर्द वाला और मोटा हो जाता है, आमतौर पर एड़ी से कुछ सेंटीमीटर ऊपर या जहाँ वह एड़ी की हड्डी से जुड़ता है। सुबह और व्यायाम की शुरुआत में जकड़ा और दुखता है।'),
   causes:L('A rise in running or walking, hill running, new flat shoes, and some medicines (steroids, certain antibiotics).','ज़्यादा दौड़ना या चलना, चढ़ाई पर दौड़ना, नए सपाट जूते, और कुछ दवाएं (स्टेरॉयड, कुछ एंटीबायोटिक)।'),
   confirm:L('Examination; ultrasound if unclear.','जांच; साफ़ न हो तो अल्ट्रासाउंड।'),
   treat:L('A graded calf and tendon-loading exercise programme with a physiotherapist; heel raises in shoes in the short term.','फिज़ियोथेरेपिस्ट के साथ धीरे-धीरे बढ़ता पिंडली और टेंडन-लोडिंग व्यायाम; थोड़े समय के लिए जूतों में हील रेज़।'),
   outlook:L('Improves over months with loading exercise; rest alone rarely cures it.','लोडिंग व्यायाम से महीनों में सुधरता है; सिर्फ़ आराम से कम ही ठीक होता है।'),
   w:{achilles:4,hr_pain:2,w_run:2,on_more_walk:2,a_30_39:1,a_40_49:2,a_50_59:1,r_bones:1,ch_snap:-3,hr_cannot:-2,ch_first_step:-1,heel:-1}},
  {id:'achrupt',th:[9,6,5],anchor:['ch_snap','hr_cannot'],depts:['ortho','sports'],
   name:L('Achilles tendon rupture','एकिलीज़ टेंडन फटना'),sci:'Acute Achilles tendon rupture',
   what:L('The tendon tears, usually during a push-off in sport. People feel as if they were kicked at the back of the heel; walking is possible but pushing off and rising on the toes are weak or impossible.','टेंडन फट जाता है, आमतौर पर खेल में पैर से धक्का देते समय। ऐसा लगता है जैसे एड़ी के पीछे किसी ने लात मारी; चलना संभव है पर धक्का देना और पंजों पर उठना कमज़ोर या असंभव होता है।'),
   causes:L('Sudden effort in middle-aged weekend players (badminton, cricket, football), steroid injections or tablets, certain antibiotics.','अधेड़ उम्र के हफ़्ते के आखिर में खेलने वालों में अचानक ज़ोर (बैडमिंटन, क्रिकेट, फुटबॉल), स्टेरॉयड इंजेक्शन या गोलियाँ, कुछ एंटीबायोटिक।'),
   confirm:L('A doctor squeezes the calf (the foot should move); this squeeze test picks up about 96% of ruptures. Up to 20–25% are missed at the first visit because walking is still possible.','डॉक्टर पिंडली दबाते हैं (पैर हिलना चाहिए); यह स्क्वीज़ टेस्ट लगभग 96% फटन पकड़ता है। 20–25% तक पहली जांच में छूट जाते हैं क्योंकि चलना फिर भी संभव होता है।'),cSrc:['achrup'],
   treat:L('Same-day orthopaedic assessment; treatment is a boot with the foot pointed down, or surgery, followed by rehabilitation.','उसी दिन ऑर्थोपेडिक जांच; इलाज में पैर नीचे की ओर रखते हुए बूट, या सर्जरी, फिर पुनर्वास।'),
   outlook:L('Good results when treated early; delay makes recovery harder.','जल्दी इलाज से अच्छे नतीजे; देरी से ठीक होना मुश्किल।'),oSrc:['achrup'],
   w:{ch_snap:5,hr_cannot:3,achilles:2,calf:1,on_more_walk:1,a_30_39:1,a_40_49:2,a_50_59:1,r_bones:1,on_gradual:-3,ch_first_step:-2}},
  {id:'sprain',th:[9,6,4],anchor:['on_roll','ankle_out'],depts:['physio','ortho'],
   name:L('Ankle sprain (ligament injury)','टखने की मोच (लिगामेंट की चोट)'),sci:'Lateral ankle sprain',
   what:L('Rolling the foot inwards stretches or tears the ligaments on the outer ankle, causing pain, swelling and bruising. Repeated sprains can leave the ankle unstable.','पैर अंदर की ओर मुड़ने से टखने के बाहरी लिगामेंट खिंचते या फटते हैं, जिससे दर्द, सूजन और नील पड़ता है। बार-बार मोच से टखना अस्थिर रह सकता है।'),
   causes:L('Uneven roads and stairs, sport, high heels and previous sprains.','ऊबड़-खाबड़ सड़कें और सीढ़ियाँ, खेल, ऊंची एड़ी और पहले की मोच।'),
   confirm:L('Examination; an X-ray only if the Ottawa ankle rules say so (they miss very few fractures, pooled sensitivity 97.6%).','जांच; एक्स-रे तभी जब ओटावा एंकल नियम कहें (ये बहुत कम फ्रैक्चर छोड़ते हैं, संयुक्त संवेदनशीलता 97.6%)।'),cSrc:['ottankle'],
   treat:L('Early protected walking, ice and elevation for the first days, then balance and strengthening exercises; a brace for return to sport.','शुरू में सहारे के साथ चलना, पहले कुछ दिन बर्फ़ और पैर ऊंचा रखना, फिर संतुलन और मज़बूती के व्यायाम; खेल में लौटने के लिए ब्रेस।'),
   outlook:L('Most recover over weeks; balance exercises lower the chance of another sprain.','ज़्यादातर कुछ हफ्तों में ठीक होते हैं; संतुलन के व्यायाम दोबारा मोच की संभावना कम करते हैं।'),
   w:{on_roll:4,ankle_out:3,ch_swell:2,ch_unstable:1,a_u18:1,a_18_29:1,ankle_in:1,on_gradual:-3,ch_first_step:-2,ch_numb_both:-2}},
  {id:'mtss',th:[8,6,4],anchor:['shin_in'],depts:['physio','sports'],
   name:L('Shin splints (medial tibial stress syndrome)','शिन स्प्लिंट्स (मीडियल टिबियल स्ट्रेस सिंड्रोम)'),sci:'Medial tibial stress syndrome',
   what:L('Overload of the bone and its lining along the inner edge of the shin causes a diffuse ache over more than 5 cm during and after running.','पिंडली की हड्डी के अंदरूनी किनारे और उसकी परत पर ज़्यादा भार से दौड़ते समय और बाद में 5 सेमी से ज़्यादा में फैला दर्द होता है।'),
   causes:L('A sudden rise in running or marching, hard surfaces, flat feet, extra weight and low vitamin D. It affects 13.6–20% of runners and up to 35% of military recruits.','अचानक ज़्यादा दौड़ना या मार्च, सख्त सतह, सपाट पैर, ज़्यादा वज़न और कम विटामिन D। 13.6–20% धावकों और 35% तक सैन्य रंगरूटों में होता है।'),cSrc:['mtss'],
   confirm:L('Examination; MRI if a stress fracture is suspected.','जांच; स्ट्रेस फ्रैक्चर का शक हो तो MRI।'),
   treat:L('Reducing running load and gradually rebuilding it, shock-absorbing insoles, checking vitamin D and calcium.','दौड़ने का भार कम करके धीरे-धीरे बढ़ाना, झटका सोखने वाले इनसोल, विटामिन D और कैल्शियम की जांच।'),
   outlook:L('Full recovery is expected with adequate rest and activity changes.','पर्याप्त आराम और गतिविधि में बदलाव से पूरी तरह ठीक होने की उम्मीद।'),oSrc:['mtss'],
   w:{shin_in:4,w_run:3,on_more_walk:2,sex_f:1,a_u18:1,a_18_29:2,o_overweight:1,ch_focal_bone:-2,a_60p:-2}},
  {id:'stressfx',th:[8,6,4],anchor:['ch_focal_bone'],depts:['ortho','sports'],
   name:L('Stress fracture','स्ट्रेस फ्रैक्चर'),sci:'Bone stress injury (tibia, metatarsal, navicular)',
   what:L('A tiny crack in a bone from repeated loading, felt as pain pinpointed on one spot (under 5 cm) that worsens with each step and may ache at night.','बार-बार भार से हड्डी में बहुत छोटी दरार, जो एक ही बिंदु (5 सेमी से कम) पर दर्द के रूप में महसूस होती है, हर कदम पर बढ़ती है और रात को दुख सकती है।'),
   causes:L('A sudden rise in walking, running or marching, low vitamin D or calcium, thin bones, low body weight or irregular periods in women athletes.','अचानक ज़्यादा चलना, दौड़ना या मार्च, कम विटामिन D या कैल्शियम, कमज़ोर हड्डियाँ, कम वज़न या महिला खिलाड़ियों में अनियमित माहवारी।'),cSrc:['mtss'],
   confirm:L('X-rays are often normal early; MRI confirms it.','शुरू में एक्स-रे अक्सर सामान्य; MRI से पुष्टि।'),
   treat:L('Offloading (sometimes a boot), then a gradual return; some fractures (front of the shin, navicular) need specialist care.','भार हटाना (कभी-कभी बूट), फिर धीरे-धीरे वापसी; कुछ फ्रैक्चर (पिंडली का आगे का हिस्सा, नेवीकुलर) में विशेषज्ञ इलाज ज़रूरी।'),
   outlook:L('Most heal in weeks to a few months with offloading.','भार हटाने से ज़्यादातर कुछ हफ्तों से कुछ महीनों में भर जाते हैं।'),
   w:{ch_focal_bone:4,w_run:2,on_more_walk:2,sex_f:1,r_bones:2,shin_in:1,arch:1,ball:1,rf_night:1,a_60p:-1}},
  {id:'morton',th:[8,6,4],anchor:['ball','squeeze_pos','ch_stone'],depts:['ortho','podiatry'],
   name:L('Morton’s neuroma (pinched nerve between the toes)','मॉर्टन न्यूरोमा (उंगलियों के बीच दबी नस)'),sci:'Interdigital (Morton’s) neuroma',
   what:L('A nerve between two long foot bones thickens and is pinched, most often between the 3rd and 4th toes. It feels like a pebble in the shoe, with burning or numbness into those toes.','पैर की दो लंबी हड्डियों के बीच की नस मोटी होकर दब जाती है, ज़्यादातर तीसरी और चौथी उंगली के बीच। जूते में कंकड़ जैसा लगता है, उन उंगलियों तक जलन या सुन्नपन के साथ।'),
   causes:L('Tight, narrow shoes and high heels; more common in women and in middle age. The 3rd–4th toe space is affected in 80–85%.','तंग, पतले जूते और ऊंची एड़ी; महिलाओं और अधेड़ उम्र में ज़्यादा। 80–85% में तीसरी-चौथी उंगली के बीच की जगह।'),cSrc:['morton'],
   confirm:L('Examination; ultrasound if needed.','जांच; ज़रूरत हो तो अल्ट्रासाउंड।'),
   treat:L('Wider, low-heeled shoes and a metatarsal pad; injection or surgery if it persists.','चौड़े, कम एड़ी वाले जूते और मेटाटार्सल पैड; बना रहे तो इंजेक्शन या सर्जरी।'),
   outlook:L('Many improve with footwear changes.','कई लोग जूते बदलने से सुधरते हैं।'),
   w:{ball:3,ch_stone:3,squeeze_pos:3,squeeze_neg:-2,w_tight_shoes:2,b_shoes_off:2,sex_f:1,a_40_49:1,a_50_59:1,ch_numb_both:-2,ch_hot_toe:-2}},
  {id:'bunion',th:[8,6,4],anchor:['bigtoe','ch_bunion'],depts:['ortho','podiatry'],
   name:L('Bunion or big toe arthritis','बनियन या अंगूठे की गठिया'),sci:'Hallux valgus · hallux rigidus',
   what:L('The big toe drifts towards the other toes and a bony bump forms at its base (bunion), or the big toe joint wears and stiffens (hallux rigidus). Shoes press on the bump and walking hurts.','अंगूठा दूसरी उंगलियों की ओर खिसकता है और उसकी जड़ में हड्डी का उभार (बनियन) बनता है, या अंगूठे का जोड़ घिसकर जकड़ जाता है (हैलक्स रिजिडस)। जूते उभार पर दबते हैं और चलने में दर्द होता है।'),
   causes:L('Family tendency, narrow or high-heeled shoes, flat feet. Bunions affect 23% of adults and 35.7% of people over 65, and women (30%) more than men (13%).','पारिवारिक प्रवृत्ति, पतले या ऊंची एड़ी के जूते, सपाट पैर। बनियन 23% वयस्कों और 65 से ऊपर के 35.7% लोगों में, और पुरुषों (13%) से ज़्यादा महिलाओं (30%) में होता है।'),cSrc:['hvalgus'],
   confirm:L('Examination and a standing X-ray if surgery is considered.','जांच, और सर्जरी पर विचार हो तो खड़े होकर एक्स-रे।'),
   treat:L('Wide, soft shoes, toe spacers and padding; surgery if pain persists.','चौड़े, नरम जूते, टो स्पेसर और पैडिंग; दर्द बना रहे तो सर्जरी।'),
   outlook:L('Shoes and padding help most; surgery corrects the shape.','जूते और पैडिंग सबसे ज़्यादा मदद करते हैं; सर्जरी से आकार ठीक होता है।'),
   w:{bigtoe:3,ch_bunion:4,w_tight_shoes:2,sex_f:1,a_50_59:1,a_60p:1,ch_hot_toe:-3,o_gout:-2}},
  {id:'gout',th:[8,6,4],anchor:['ch_hot_toe','o_gout'],depts:['medicine','rheum'],
   name:L('Gout attack','गाउट का दौरा'),sci:'Acute gouty arthritis',
   what:L('Uric acid crystals in a joint, classically the big toe, trigger sudden, very painful redness, heat and swelling, often overnight; even a bedsheet touching it hurts.','जोड़ में, खासकर अंगूठे में, यूरिक एसिड के क्रिस्टल अचानक बहुत दर्दनाक लाली, गर्मी और सूजन लाते हैं, अक्सर रात भर में; चादर का छूना भी दुखता है।'),
   causes:L('High uric acid, alcohol, red meat and seafood, sweet drinks, some water tablets, kidney disease, dehydration.','ज़्यादा यूरिक एसिड, शराब, लाल मांस और सी-फ़ूड, मीठे पेय, कुछ पेशाब की गोलियाँ, गुर्दे की बीमारी, पानी की कमी।'),
   confirm:L('Examination and blood uric acid (which can be normal during an attack); joint fluid shows crystals. If there is fever, infection must be ruled out the same day.','जांच और खून का यूरिक एसिड (जो दौरे में सामान्य भी हो सकता है); जोड़ के तरल में क्रिस्टल दिखते हैं। बुखार हो तो उसी दिन इन्फेक्शन खारिज करना ज़रूरी।'),cSrc:['hotjoint'],
   treat:L('Anti-inflammatory medicines, colchicine or steroids for the attack; long-term uric acid lowering if attacks repeat.','दौरे में सूजन-रोधी दवाएं, कोल्चिसिन या स्टेरॉयड; दौरे बार-बार हों तो लंबे समय तक यूरिक एसिड घटाने की दवा।'),
   outlook:L('Attacks settle in days; lowering uric acid prevents joint damage.','दौरे कुछ दिनों में ठीक; यूरिक एसिड घटाने से जोड़ खराब होने से बचते हैं।'),
   w:{ch_hot_toe:5,o_gout:3,bigtoe:2,sex_m:1,a_40_49:1,a_50_59:1,a_60p:1,on_woke:1,ch_bunion:-2,on_roll:-2}},
  {id:'neuro',th:[8,6,4],anchor:['ch_numb_both'],depts:['medicine','neuro','podiatry'],
   name:L('Nerve damage in the feet (peripheral neuropathy)','पैरों की नसों को नुकसान (पेरिफ़ेरल न्यूरोपैथी)'),sci:'Length-dependent peripheral neuropathy (often diabetic)',
   what:L('Long nerves to the feet are damaged, causing numbness, tingling or burning in both feet that starts in the toes and is often worse at night. Numb feet do not feel injuries, so wounds can go unnoticed.','पैरों तक जाने वाली लंबी नसें खराब हो जाती हैं, जिससे दोनों पैरों में सुन्नपन, झुनझुनी या जलन होती है जो उंगलियों से शुरू होती है और अक्सर रात में बढ़ती है। सुन्न पैर चोट महसूस नहीं करते, इसलिए घाव पर ध्यान नहीं जाता।'),
   causes:L('Diabetes is the most common cause (11.4% of Indians have diabetes); also vitamin B12 deficiency, alcohol, thyroid disease and some medicines.','डायबिटीज़ सबसे आम कारण है (11.4% भारतीयों को डायबिटीज़ है); विटामिन B12 की कमी, शराब, थायरॉइड और कुछ दवाएं भी।'),cSrc:['indiab'],
   confirm:L('Foot sensation tests (monofilament), blood sugar, HbA1c, vitamin B12 and thyroid tests.','पैर की संवेदना की जांच (मोनोफ़िलामेंट), ब्लड शुगर, HbA1c, विटामिन B12 और थायरॉइड टेस्ट।'),
   treat:L('Good sugar control, treating the cause, nerve-pain medicines if needed, and daily foot checks with proper footwear.','शुगर का अच्छा नियंत्रण, कारण का इलाज, ज़रूरत हो तो नस दर्द की दवाएं, और सही जूतों के साथ रोज़ पैरों की जांच।'),
   outlook:L('Damage can be slowed; a non-healing foot wound needs review within one working day, and one with fever or spreading redness immediately.','नुकसान धीमा किया जा सकता है; न भरने वाले पैर के घाव को एक कामकाजी दिन में, और बुखार या फैलती लाली वाले को तुरंत दिखाएं।'),oSrc:['diabfoot'],
   w:{ch_numb_both:5,w_night:2,r_immune:3,a_50_59:1,a_60p:2,rf_ulcer:2,o_cold_foot:1,on_roll:-2,ch_first_step:-1}},
  {id:'pad',th:[8,6,4],anchor:['w_walk_calf'],depts:['vascular','medicine'],
   name:L('Narrowed leg arteries (peripheral artery disease)','पैर की धमनियाँ संकरी होना (पेरिफ़ेरल आर्टरी डिज़ीज़)'),sci:'Peripheral artery disease with intermittent claudication',
   what:L('Narrowed arteries cannot bring enough blood to the calf muscles during walking, so the calf cramps after a set distance and eases within minutes of standing still.','संकरी धमनियाँ चलते समय पिंडली की मांसपेशियों तक पर्याप्त खून नहीं पहुंचा पातीं, इसलिए एक तय दूरी के बाद पिंडली में ऐंठन होती है जो खड़े होकर रुकने पर कुछ मिनट में ठीक हो जाती है।'),
   causes:L('Smoking or tobacco, diabetes, high blood pressure and cholesterol, age over 50.','धूम्रपान या तंबाकू, डायबिटीज़, हाई ब्लड प्रेशर और कोलेस्ट्रॉल, 50 से ज़्यादा उम्र।'),
   confirm:L('Ankle-brachial pressure index and a Doppler ultrasound. Calf pain that eases by standing still makes artery disease about 7.8 times more likely than a back cause.','एंकल-ब्रेकियल प्रेशर इंडेक्स और डॉप्लर अल्ट्रासाउंड। खड़े होकर रुकने से कम होने वाला पिंडली का दर्द कमर वाले कारण की तुलना में धमनी रोग की संभावना लगभग 7.8 गुना करता है।'),cSrc:['nadeau'],
   treat:L('Stopping tobacco, supervised walking exercise, blood pressure, sugar and cholesterol control, medicines to prevent clots; procedures for severe cases.','तंबाकू छोड़ना, निगरानी में चलने का व्यायाम, ब्लड प्रेशर, शुगर और कोलेस्ट्रॉल नियंत्रण, थक्का रोकने की दवाएं; गंभीर मामलों में प्रक्रियाएं।'),
   outlook:L('Walking distance improves with exercise; it is also a warning sign for heart attack and stroke risk.','व्यायाम से चलने की दूरी बढ़ती है; यह दिल के दौरे और स्ट्रोक के खतरे का भी चेतावनी संकेत है।'),
   w:{w_walk_calf:5,calf:2,r_vasc:3,a_60p:2,a_50_59:1,o_cold_foot:2,sex_m:1,ch_shoot_leg:-2,lowback:-1,a_u18:-3,a_18_29:-3}},
  {id:'calfstrain',th:[8,6,4],anchor:['ch_calf_sudden'],depts:['physio','sports'],
   name:L('Calf muscle tear (“tennis leg”)','पिंडली की मांसपेशी फटना (“टेनिस लेग”)'),sci:'Medial gastrocnemius strain',
   what:L('A sudden push-off tears fibres of the inner calf muscle, causing sharp pain like being hit in the calf, then bruising and swelling.','अचानक पैर से धक्का देने पर पिंडली की अंदरूनी मांसपेशी के रेशे फट जाते हैं, जिससे पिंडली में चोट लगने जैसा तेज़ दर्द, फिर नील और सूजन होती है।'),
   causes:L('Racquet sports, sprinting and jumping, often in middle age.','रैकेट वाले खेल, तेज़ दौड़ और कूदना, अक्सर अधेड़ उम्र में।'),
   confirm:L('Examination; ultrasound if it is unclear or to rule out a blood clot when the calf is swollen.','जांच; साफ़ न हो या पिंडली सूजी हो तो खून का थक्का खारिज करने के लिए अल्ट्रासाउंड।'),
   treat:L('Protected walking, then progressive calf stretching and strengthening.','सहारे से चलना, फिर धीरे-धीरे पिंडली की स्ट्रेचिंग और मज़बूती।'),
   outlook:L('Usually recovers in a few weeks.','आमतौर पर कुछ हफ्तों में ठीक।'),
   w:{ch_calf_sudden:5,calf:3,a_30_39:1,a_40_49:1,a_50_59:1,ch_snap:-1,achilles:-1,on_gradual:-2}},
  {id:'backref',th:[8,6,4],anchor:['lowback','ch_shoot_leg'],depts:['ortho_spine','physio'],
   name:L('Pain coming from the lower back (sciatica)','कमर से आने वाला दर्द (साइटिका)'),sci:'Lumbosacral radiculopathy (L5 or S1)',
   what:L('A pinched L5 or S1 nerve root in the lower back can cause pain, tingling or weakness in the foot, often with back or buttock pain.','कमर में दबी L5 या S1 नस की जड़ पैर में दर्द, झुनझुनी या कमज़ोरी दे सकती है, अक्सर कमर या नितंब के दर्द के साथ।'),
   causes:L('A disc bulge or narrowing of the nerve canal in the lower back.','कमर में डिस्क का उभार या नस की नली का संकरा होना।'),
   confirm:L('Back and nerve examination; use the lower back section of this guide for a detailed check.','कमर और नसों की जांच; विस्तार से जांचने के लिए इस गाइड का कमर वाला हिस्सा इस्तेमाल करें।'),
   treat:L('Treatment of the back problem (see the lower back section).','कमर की समस्या का इलाज (कमर वाला हिस्सा देखें)।'),
   outlook:L('Most sciatica improves within weeks to months.','ज़्यादातर साइटिका कुछ हफ्तों से महीनों में सुधरता है।'),
   w:{lowback:3,ch_shoot_leg:4,calf:1,ch_numb_both:-1,w_walk_calf:-2,heel:-1,bigtoe:-1}}
];
const EMERG = {
  fracture:{name:L('Possible fracture','फ्रैक्चर की आशंका'),sci:'Ankle or midfoot fracture (Ottawa ankle rules positive)',
    what:L('After an injury, being unable to take 4 steps, or bone tenderness at the back or tip of either ankle bone, the outer edge of the foot or the inner midfoot, means an X-ray is needed. These rules miss very few fractures. Go to the emergency department.','चोट के बाद 4 कदम न चल पाना, या किसी भी टखने की हड्डी के पीछे या सिरे पर, पैर के बाहरी किनारे पर या अंदरूनी बीच के पैर पर हड्डी में दर्द का मतलब है कि एक्स-रे ज़रूरी है। ये नियम बहुत कम फ्रैक्चर छोड़ते हैं। इमरजेंसी जाएं।'),src:['ottankle'],depts:['emergency','ortho']},
  ischaemia:{name:L('Possible blocked artery in the leg','पैर की धमनी बंद होने की आशंका'),sci:'Acute or critical limb ischaemia',
    what:L('A foot or leg that suddenly turns cold, pale, numb or very painful, or skin turning black, can mean the blood supply is blocked. Call 108 now; every hour matters.','पैर का अचानक ठंडा, पीला, सुन्न या बहुत दर्द वाला होना, या त्वचा का काला पड़ना, खून की सप्लाई बंद होने का संकेत हो सकता है। अभी 108 बुलाएं; हर घंटा मायने रखता है।'),src:['diabfoot'],depts:['emergency','vascular']},
  footinf:{name:L('Possible serious foot infection','पैर में गंभीर इन्फेक्शन की आशंका'),sci:'Infected foot ulcer · sepsis',
    what:L('A foot wound with fever, spreading redness or a bad smell, especially with diabetes, needs immediate hospital care.','बुखार, फैलती लाली या बदबू वाला पैर का घाव, खासकर डायबिटीज़ में, तुरंत अस्पताल में इलाज मांगता है।'),src:['diabfoot'],depts:['emergency','podiatry']},
  dvt:{name:L('Possible blood clot in the leg (DVT)','पैर में खून का थक्का (DVT) की आशंका'),sci:'Deep vein thrombosis',
    what:L('A swollen, warm, tender calf, especially after travel, surgery, a plaster or bed rest, can be a clot in a deep vein. It needs an ultrasound scan within hours. If you are breathless or have chest pain, call 108 now.','सूजी, गर्म, दर्द वाली पिंडली, खासकर यात्रा, सर्जरी, प्लास्टर या बिस्तर पर आराम के बाद, गहरी नस में थक्का हो सकती है। कुछ घंटों में अल्ट्रासाउंड स्कैन ज़रूरी। सांस फूले या सीने में दर्द हो तो अभी 108 बुलाएं।'),src:['nicedvt'],depts:['emergency','vascular']},
  septic:{name:L('Possible infected joint','जोड़ में इन्फेक्शन की आशंका'),sci:'Septic arthritis',
    what:L('A hot, red, swollen joint with fever must be treated as infected until proven otherwise. Go to the emergency department today.','बुखार के साथ गर्म, लाल, सूजा जोड़ इन्फेक्शन मानकर ही देखा जाना चाहिए जब तक साबित न हो। आज ही इमरजेंसी जाएं।'),src:['hotjoint'],depts:['emergency','ortho']},
  rupture:{name:L('Possible Achilles tendon rupture','एकिलीज़ टेंडन फटने की आशंका'),sci:'Acute Achilles tendon rupture',
    what:L('A sudden kick-like pain at the back of the heel with weak push-off or an inability to rise on the toes needs same-day orthopaedic assessment; up to a quarter are missed at first.','एड़ी के पीछे अचानक लात जैसा दर्द, कमज़ोर धक्का या पंजों पर न उठ पाना हो तो उसी दिन ऑर्थोपेडिक जांच ज़रूरी; एक-चौथाई तक पहली बार में छूट जाते हैं।'),src:['achrup'],depts:['emergency','ortho']}
};
const RS = {
  o_ulcer:L('A foot wound that is not healing (needs a foot clinic within one working day)','पैर का घाव जो भर नहीं रहा (एक कामकाजी दिन में फ़ुट क्लिनिक ज़रूरी)'),
  o_night:L('Constant night pain, fever or weight loss','रात का लगातार दर्द, बुखार या वज़न घटना'),
  o_pain:L('Very severe pain (9–10 out of 10)','बहुत तेज़ दर्द (10 में 9–10)'), o_gout:L('A hot, swollen toe or foot joint (gout or infection)','गर्म, सूजा अंगूठा या पैर का जोड़ (गाउट या इन्फेक्शन)'),
  o_stress:L('Pinpoint bone pain with every step (possible stress fracture)','हर कदम पर हड्डी के एक बिंदु पर दर्द (स्ट्रेस फ्रैक्चर की आशंका)'),
  y_injury:L('Started with a twist, fall or accident','मुड़ने, गिरने या दुर्घटना से शुरू'), y_swell:L('Swelling or bruising','सूजन या नील'),
  y_numb:L('Numbness or burning in both feet','दोनों पैरों में सुन्नपन या जलन'), y_vasc:L('Calf pain on walking that eases with standing (check the arteries)','चलने पर पिंडली दर्द जो खड़े होने पर कम हो (धमनियों की जांच)'),
  y_long:L('This bout has lasted more than 6 weeks','इस बार का दर्द 6 हफ्ते से ज़्यादा से है'), y_pain:L('Strong pain (7–8 out of 10)','तेज़ दर्द (10 में 7–8)'),
  y_sleep:L('Pain disturbing sleep','दर्द से नींद खराब'), y_walk:L('Difficulty walking','चलने में दिक्कत'), y_unstable:L('The ankle keeps giving way','टखना बार-बार मुड़ता है'),
  y_back:L('Shooting pain from the back down the leg (see the lower back section)','कमर से पैर तक करंट जैसा दर्द (कमर वाला हिस्सा देखें)'),
  y_diab:L('Diabetes with foot symptoms: the feet need a proper check','पैर के लक्षणों के साथ डायबिटीज़: पैरों की ठीक से जांच ज़रूरी')
};
const DERIVED = [
  {id:'foot_any', when:{any:footAreas}}
];
const URGENCY = {
  orange:[
    {r:'o_ulcer', when:'rf_ulcer'}, {r:'o_night', when:'rf_night'}, {r:'o_pain', when:{painGte:9}}, {r:'o_gout', when:'ch_hot_toe'},
    {r:'o_stress', when:'ch_focal_bone'}
  ],
  yellow:[
    {r:'y_injury', when:{any:['on_roll','on_fall','on_accident']}}, {r:'y_swell', when:'ch_swell'}, {r:'y_numb', when:'ch_numb_both'},
    {r:'y_vasc', when:'w_walk_calf'}, {r:'y_often', when:'btw_often'}, {r:'y_long', when:{any:['d_6_12','d_3m']}},
    {r:'y_pain', when:{all:[{painGte:7},{not:{painGte:9}}]}}, {r:'y_sleep', when:'sleep_bad'}, {r:'y_walk', when:'fwalk_no'},
    {r:'y_unstable', when:'ch_unstable'}, {r:'y_back', when:'ch_shoot_leg'}, {r:'y_diab', when:{all:['r_immune',{any:['ch_numb_both','rf_ulcer','o_cold_foot']}]}}
  ]
};
const EMERG_WHEN = {fracture:'rf_fracture', ischaemia:'rf_ischaemia', footinf:'rf_ulcer_fever', dvt:'rf_dvt', septic:'rf_hot', rupture:{all:['ch_snap',{any:['hr_cannot','achilles']}]}};
const FOCUS = {pfasc:{bones:['leg']}, sever:{bones:['leg']}, achten:{bones:['leg']}, achrupt:{bones:['leg']}, sprain:{bones:['leg']}, mtss:{bones:['leg']}, stressfx:{bones:['leg']},
  morton:{nerves:['tibial'], useSides:true}, bunion:{bones:['leg']}, gout:{bones:['leg']}, neuro:{nerves:['sciatic','tibial','peroneal'], sides:['l','r']}, pad:{bones:['leg']}, calfstrain:{bones:['leg']},
  backref:{vert:['L4','L5'], roots:['L5','S1'], useSides:true}};
const LBLX = {foot_one:L('One leg or foot','एक पैर'), foot_both:L('Both legs or feet','दोनों पैर'), foot_any:L('Leg, ankle or foot pain','पिंडली, टखने या पैर में दर्द')};
const FX = {
  ch_first_step:L('Heel pain with the first steps that eases with walking is the hallmark of plantar fasciitis.','पहले कदमों पर एड़ी का दर्द जो चलने से कम हो, प्लांटर फ़ेशियाइटिस की पहचान है।'),
  windlass_pos:L('Pain when the big toe is lifted stretches the plantar fascia; the test is very specific.','अंगूठा ऊपर उठाने पर दर्द प्लांटर फ़ेशिया को खींचता है; यह टेस्ट बहुत विशिष्ट है।'),
  heel:L('Pain under the heel is most often plantar fasciitis.','एड़ी के नीचे दर्द ज़्यादातर प्लांटर फ़ेशियाइटिस होता है।'),
  achilles:L('Pain in the cord above the heel points to the Achilles tendon.','एड़ी के ऊपर की डोरी में दर्द एकिलीज़ टेंडन की ओर इशारा करता है।'),
  hr_pain:L('Pain on heel raises loads the Achilles tendon.','पंजों पर उठने पर दर्द एकिलीज़ टेंडन पर भार से होता है।'),
  hr_cannot:L('Being unable to rise on the toes after a sudden injury suggests an Achilles rupture.','अचानक चोट के बाद पंजों पर न उठ पाना एकिलीज़ फटने का संकेत है।'),
  ch_snap:L('A kick-like pain at the back of the heel is typical of an Achilles rupture.','एड़ी के पीछे लात जैसा दर्द एकिलीज़ फटने का खास लक्षण है।'),
  on_roll:L('Rolling the ankle inwards injures the outer ligaments.','टखना अंदर मुड़ने से बाहरी लिगामेंट चोटिल होते हैं।'),
  ankle_out:L('Outer ankle pain after a roll is typical of a sprain.','मुड़ने के बाद बाहरी टखने का दर्द मोच का खास लक्षण है।'),
  shin_in:L('Diffuse pain along the inner shin is typical of shin splints.','पिंडली के अंदरूनी किनारे पर फैला दर्द शिन स्प्लिंट्स का खास लक्षण है।'),
  ch_focal_bone:L('Pinpoint bone pain with every step suggests a stress fracture.','हर कदम पर हड्डी के एक बिंदु पर दर्द स्ट्रेस फ्रैक्चर का संकेत है।'),
  ch_stone:L('Feeling a pebble under the ball of the foot with toe numbness points to Morton’s neuroma.','पंजे के नीचे कंकड़ जैसा लगना और उंगलियों में सुन्नपन मॉर्टन न्यूरोमा की ओर इशारा करता है।'),
  squeeze_pos:L('Pain on squeezing between the toes picked up 96% of Morton’s neuromas in one study.','उंगलियों के बीच दबाने पर दर्द ने एक अध्ययन में 96% मॉर्टन न्यूरोमा पकड़े।'),
  ball:L('Pain under the ball of the foot or between the toes points to the forefoot nerves and joints.','पंजे के नीचे या उंगलियों के बीच दर्द आगे के पैर की नसों और जोड़ों की ओर इशारा करता है।'),
  ch_bunion:L('A bony bump at the base of the big toe is a bunion.','अंगूठे की जड़ में हड्डी का उभार बनियन है।'),
  ch_hot_toe:L('A sudden hot, swollen big toe is the classic gout attack.','अचानक गर्म, सूजा अंगूठा गाउट का क्लासिक दौरा है।'),
  ch_numb_both:L('Numbness or burning in both feet starting in the toes is typical of neuropathy, most often from diabetes.','उंगलियों से शुरू होकर दोनों पैरों में सुन्नपन या जलन न्यूरोपैथी का खास लक्षण है, ज़्यादातर डायबिटीज़ से।'),
  w_walk_calf:L('Calf pain on walking that eases by standing still points to the leg arteries (likelihood ratio 7.8).','चलने पर पिंडली का दर्द जो खड़े होकर रुकने पर कम हो, पैर की धमनियों की ओर इशारा करता है (लाइकलीहुड रेशियो 7.8)।'),
  ch_calf_sudden:L('Sudden calf pain during push-off is typical of a calf muscle tear.','धक्का देते समय अचानक पिंडली का दर्द पिंडली की मांसपेशी फटने का खास लक्षण है।'),
  ch_shoot_leg:L('Shooting pain from the back into the foot points to a nerve root in the back.','कमर से पैर तक करंट जैसा दर्द कमर में नस की जड़ की ओर इशारा करता है।'),
  w_tight_shoes:L('Pain in tight shoes points to forefoot problems such as neuroma or bunion.','तंग जूतों में दर्द आगे के पैर की समस्याओं जैसे न्यूरोमा या बनियन की ओर इशारा करता है।'),
  w_night:L('Burning feet at night is common with nerve damage.','रात को पैरों में जलन नसों को नुकसान में आम है।'),
  o_cold_foot:L('Cold, pale feet or slow healing suggest poor blood supply.','ठंडे, पीले पैर या धीरे भरना कम खून की सप्लाई का संकेत है।')
};
const STATS = [
  {v:'10%',t:L('of people get plantar fasciitis in their lifetime; about 80% improve within a year','लोगों को जीवन में प्लांटर फ़ेशियाइटिस; लगभग 80% एक साल में सुधरते हैं'),s:'aafppf'},
  {v:'97.6%',t:L('of ankle and midfoot fractures are caught by the Ottawa ankle rules','टखने और बीच के पैर के फ्रैक्चर ओटावा एंकल नियमों से पकड़े जाते हैं'),s:'ottankle'},
  {v:'11.4%',t:L('of Indians have diabetes, the commonest cause of numb, burning feet','भारतीयों को डायबिटीज़, जो सुन्न और जलते पैरों का सबसे आम कारण है'),s:'indiab'},
  {v:'23%',t:L('of adults have a bunion; 35.7% over 65','वयस्कों को बनियन; 65 से ऊपर 35.7%'),s:'hvalgus'},
  {v:'20–25%',t:L('of Achilles ruptures are missed at the first visit','एकिलीज़ फटन पहली जांच में छूट जाते हैं'),s:'achrup'},
  {v:'96%',t:L('of Morton’s neuromas are picked up by squeezing between the toes','मॉर्टन न्यूरोमा उंगलियों के बीच दबाने से पकड़े जाते हैं'),s:'morton'}
];
const UI = {
  repT:L('Leg, ankle and foot pain assessment','पिंडली, टखने और पैर के दर्द की जांच रिपोर्ट'), tag:L('Leg and foot assessment','पिंडली और पैर की जांच'),
  safPic:L('Calf (asked below): a swollen, warm, tender calf can be a blood clot.','पिंडली (नीचे पूछा गया): सूजी, गर्म, दर्द वाली पिंडली खून का थक्का हो सकती है।'),
  must:[L('This assessment cannot feel your foot pulses, test the sensation and strength of your feet, or check the ligaments and bones, which a doctor does by examining you.','यह जांच आपके पैर की नब्ज़ नहीं देख सकती, पैरों की संवेदना और ताकत नहीं परख सकती, या लिगामेंट और हड्डियाँ नहीं जांच सकती, जो डॉक्टर जांच से करते हैं।'),
    L('Only a doctor can decide whether you need an X-ray, ultrasound, Doppler, MRI or blood tests, and interpret them with the examination.','एक्स-रे, अल्ट्रासाउंड, डॉप्लर, MRI या ब्लड टेस्ट की ज़रूरत है या नहीं, यह सिर्फ़ डॉक्टर तय कर सकते हैं और जांच के साथ उनका मतलब समझा सकते हैं।'),
    L('Leg and foot pain can come from the back, the arteries, the veins, diabetes or gout; a doctor examines these too.','पिंडली और पैर का दर्द कमर, धमनियों, नसों, डायबिटीज़ या गाउट से भी हो सकता है; डॉक्टर इनकी भी जांच करते हैं।'),
    L('If you have diabetes, check your feet every day and never ignore a wound.','अगर डायबिटीज़ है तो रोज़ पैरों की जांच करें और किसी घाव को कभी नज़रअंदाज़ न करें।')],
  tip1:L('Wear supportive, cushioned footwear indoors and out; avoid walking barefoot on hard floors.','घर के अंदर और बाहर सहारा देने वाले, गद्देदार जूते-चप्पल पहनें; सख्त फ़र्श पर नंगे पैर चलने से बचें।'),
  tip2:L('Reduce running and long standing until you are examined; keep moving within comfort.','जांच होने तक दौड़ना और देर तक खड़े रहना कम करें; आराम की सीमा में चलते-फिरते रहें।'),
  tHrCannot:L('Cannot rise','उठ नहीं पाते'),
  gPost:L('Lower leg and foot bones with the leg nerves; the highlighted bones are those most involved in the likely cause.','निचले पैर और पंजे की हड्डियाँ और पैर की नसें; चमकती हड्डियाँ संभावित कारण से सबसे ज़्यादा जुड़ी हैं।'),
  gRef:L('Lower leg and foot bones and nerves for reference.','संदर्भ के लिए निचले पैर और पंजे की हड्डियाँ और नसें।'), gX:L('See-through view: the bones under the areas you marked.','आर-पार व्यू: आपके चिन्हित हिस्सों के नीचे की हड्डियाँ।'),
  fwalkT:L('Walking','चलना'), standT:L('Standing and wearing shoes','खड़े रहना और जूते पहनना')
};
const FUNCS = [
  {id:'fwalk', label:'fwalkT', req:true, opts:[['fwalk_ok',L('Normally','सामान्य')],['fwalk_diff',L('With pain or a limp','दर्द या लंगड़ाहट के साथ')],['fwalk_no',L('Can hardly walk','मुश्किल से चल पाते हैं')]]},
  {id:'stand', label:'standT', req:true, opts:[['stand_ok',L('Normally','सामान्य')],['stand_diff',L('Painful after a while','थोड़ी देर बाद दर्द')],['stand_no',L('Cannot stand for long or wear shoes','देर तक खड़े नहीं रह पाते या जूते नहीं पहन पाते')]]},
  {id:'sleep', label:'sleep', opts:C.SLEEPS}
];
SPG.data.modules.foot = {id:'foot', order:7,
  card:{reg:['heel_l','achilles_l','ankle_out_l','ball_l','bigtoe_l','shin_in_l'], view:{az:0.9, el:0.15, d:1.25, yk:'ankle', dy:0.22, tx:0.15}, hint:L('Heel pain, ankle sprain, Achilles, numb or burning feet, gout, bunion','एड़ी दर्द, टखने की मोच, एकिलीज़, सुन्न या जलते पैर, गाउट, बनियन')},
  name:L('Leg, ankle or foot pain','पिंडली, टखने या पैर का दर्द'), safetyView:'calf', startRegions:['heel_l','ankle_out_l'], safetyRegions:['calf_l','calf_r'],
  labelSet:[], GAL:{nerves:['sciatic','tibial','peroneal','saphenous'], joint:{view:{az:0.75, el:0.2, d:0.75, yk:'ankle', dy:0.08, tx:0.2}, opts:{nerveKeep:['tibial','peroneal','saphenous'], noUpper:true}}},
  resultView:{az:0.7, el:0.15, d:1.3, yk:'ankle', dy:0.2, tx:0.16}, defaultDept:'ortho',
  ONSETS, PAT, RFS, VIEWS, AREAS, TESTS, CONDS, EMERG, ROOTS:{}, RS, DERIVED, SIDES:{areas:footAreas, one:'foot_one', both:'foot_both', sideAreas:footAreas},
  URGENCY, EMERG_WHEN, ROOT_RULES:[], DISC_OF:{}, EXIT_OF:{}, DEPT_RULES:[], FOCUS, LBLX, UI, FUNCS, FX, STATS};
})();
