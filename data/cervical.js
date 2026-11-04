window.SPG = window.SPG || {data:{modules:{}}};
/* Neck and arm (cervical) module. All questions, weights, rules and explanations used by the engine.
   Sources are added to the shared list below and cited by key. */
(function(){
const PI = Math.PI;
const L = (en, hi) => ({en, hi});
const C = SPG.data.common;
C.SRC.push(
  ['gbdneck','GBD 2021 Neck Pain Collaborators. Global burden of neck pain 1990–2020 and projections to 2050. Lancet Rheumatol 2024;6:e142–55','https://research.uaeu.ac.ae/en/publications/global-regional-and-national-burden-of-neck-pain-19902020-and-pro/'],
  ['radhak','Radhakrishnan K et al. Epidemiology of cervical radiculopathy, Rochester 1976–1990. Brain 1994 (PubMed abstract)','https://pubmed.ncbi.nlm.nih.gov/8186959/'],
  ['wikemcr','WikEM – Cervical radiculopathy (exam by level)','https://wikem.org/wiki/Cervical_Radiculopathy'],
  ['wainner','Physiopedia – Clinical prediction rule for cervical radiculopathy (Wainner 2003)','https://physio-pedia.com/CPR_for_Cervical_Radiculopathy'],
  ['myelo','Orthobullets – Cervical myelopathy','https://www.orthobullets.com/spine/2031/cervical-myelopathy'],
  ['mening','UK Health Security Agency – Meningitis: don’t ignore the signs','https://gov.uk/government/publications/meningitis-signs-and-symptoms-poster/meningitis-dont-ignore-the-signs-and-symptoms'],
  ['aha','Heart attack warning signs (American Heart Association)','https://oaklawnhospital.org/services/cardiology/warning-signs-of-a-heart-attack-american-heart-association/']
);
const ONSETS = C.ONSETS.filter(o => !['on_preg','on_house'].includes(o[0])).concat([
  ['on_whiplash',L('A jerk to the neck in a vehicle (sudden stop or rear impact)','गाड़ी में गर्दन को झटका (अचानक ब्रेक या पीछे से टक्कर)')],
  ['on_screen',L('Long hours on laptop or phone','लैपटॉप या फ़ोन पर लंबे घंटे')],
  ['on_overhead',L('Overhead work or gym lifting','ऊपर हाथ करके काम या जिम में वज़न')]
]);
const DOMS = [['dom_neck',L('Neck pain is worse','गर्दन का दर्द ज़्यादा')],['dom_arm',L('Arm or hand pain is worse','हाथ या बांह का दर्द ज़्यादा')],['dom_equal',L('About the same','लगभग बराबर')]];
const PAT = {
  char:[
    ['ch_shoot',L('Sharp, electric pain shooting into the arm','बांह में करंट जैसा तेज़ दर्द')],
    ['ch_tingle',L('Pins and needles in the hand or fingers','हाथ या उंगलियों में झुनझुनी')],
    ['ch_numb',L('A numb patch on the arm or fingers','बांह या उंगलियों पर सुन्न हिस्सा')],
    ['ch_ache',L('Dull, deep ache in the neck','गर्दन में भारी, गहरा दर्द')],
    ['ch_stiff',L('Stiff neck; hard to turn the head','गर्दन जकड़ी; सिर घुमाना मुश्किल')],
    ['ch_spasm',L('Muscle spasm; neck stuck to one side','मांसपेशियों में ऐंठन; गर्दन एक तरफ अटकी')],
    ['ch_headache',L('Headache starting at the back of the head','सिर के पीछे से शुरू होने वाला सिरदर्द')],
    ['ch_clumsy',L('Clumsy hands: dropping things, trouble with buttons or writing','हाथों में अनाड़ीपन: चीज़ें गिरना, बटन या लिखने में दिक्कत')],
    ['ch_balance',L('Unsteady walking or poor balance','चलने में लड़खड़ाहट या संतुलन की कमी')],
    ['ch_lhermitte',L('Electric shock down the spine when bending the head forward','सिर आगे झुकाने पर रीढ़ में नीचे तक करंट')],
    ['ch_night_hand',L('Hand tingling at night that eases by shaking the hand','रात को हाथ में झुनझुनी जो हाथ झटकने से कम हो')],
    ['ch_stiff_am',L('Stiff for more than 30 minutes after waking','सुबह उठने पर 30 मिनट से ज़्यादा अकड़न')]
  ],
  worse:[
    ['w_lookup',L('Looking up or tilting the head back','ऊपर देखना या सिर पीछे झुकाना')],['w_turn',L('Turning the head','सिर घुमाना')],
    ['w_screen',L('Long screen or phone use','देर तक स्क्रीन या फ़ोन')],['w_cough',L('Coughing or sneezing','खांसी या छींक')],
    ['w_overhead',L('Lifting the arm overhead','बांह सिर के ऊपर उठाना')],['w_rest',L('Resting (better once you move)','आराम करना (हिलने से बेहतर)')]
  ],
  better:[['b_hand_head',L('Resting the hand on top of the head','हाथ को सिर के ऊपर रखना')],['b_rest',L('Rest and lying down','आराम और लेटना')],['b_exercise',L('Exercise and movement','व्यायाम और हलचल')]],
  other:[['o_shoulder_move',L('Pain mainly when moving the shoulder','दर्द मुख्य रूप से कंधा हिलाने पर')]]
};
const RFS = [
  ['rf_myelo',L('Clumsy hands, weak legs or unsteady walking that is getting worse quickly, or new bladder problems','हाथों का अनाड़ीपन, पैरों में कमज़ोरी या लड़खड़ाहट जो तेज़ी से बढ़ रही हो, या पेशाब की नई दिक्कत')],
  ['rf_trauma',L('Neck pain after a fall, road accident, diving or a blow to the head','गिरने, सड़क दुर्घटना, गोता लगाने या सिर पर चोट के बाद गर्दन दर्द')],
  ['rf_mening',L('Fever with stiff neck, severe headache or dislike of bright light','बुखार के साथ गर्दन जकड़न, तेज़ सिरदर्द या तेज़ रोशनी से परेशानी')],
  ['rf_stroke',L('Sudden severe neck pain or headache with double vision, slurred speech, face drooping or dizziness','अचानक तेज़ गर्दन दर्द या सिरदर्द के साथ दोहरा दिखना, लड़खड़ाती बोली, चेहरा टेढ़ा होना या चक्कर')],
  ['rf_cardiac',L('Neck, jaw or left arm pain with chest pressure, sweating or breathlessness','गर्दन, जबड़े या बाईं बांह में दर्द के साथ सीने में दबाव, पसीना या सांस फूलना')],
  ['rf_fever',L('Fever, night sweats or weight loss without trying','बुखार, रात को पसीना या बिना कोशिश वज़न घटना')],
  ['rf_night',L('Constant pain at night that no position eases','रात को लगातार दर्द जो किसी भी पोज़िशन में कम न हो')]
];
const VIEWS = {
  neck:{az:PI,el:0.12,d:1.15,yk:'c4',dy:-0.01}, trap:{az:PI-0.35,el:0.3,d:1.3,yk:'sh',dy:0.04}, scap:{az:PI,el:0.08,d:1.45,yk:'t6',dy:0.02},
  interscap:{az:PI,el:0.08,d:1.35,yk:'t6',dy:0.03}, c5:{az:0.9,el:0.1,d:1.25,yk:'sh',dy:-0.08,tx:0.12}, t1:{az:0.45,el:0.05,d:1.3,yk:'elbow',dy:0.06,tx:0.15},
  c6:{az:0.5,el:0.12,d:1.0,yk:'wrist',dy:0.02,tx:0.2}, c7:{az:PI-0.5,el:0.12,d:1.0,yk:'wrist',dy:0.02,tx:0.2}, c8:{az:1.7,el:0.12,d:1.0,yk:'wrist',dy:0.02,tx:0.2}
};
const AREAS = [
  {id:'neck',pair:false,view:'neck',name:L('Back and sides of the neck','गर्दन का पिछला और साइड वाला हिस्सा'),desc:L('From the base of the skull down to the top of the shoulders.','खोपड़ी के निचले हिस्से से कंधों के ऊपर तक।'),rel:L('Neck pain alone usually comes from muscles, discs or the small facet joints.','सिर्फ गर्दन का दर्द आमतौर पर मांसपेशियों, डिस्क या छोटे फ़ैसेट जोड़ों से होता है।')},
  {id:'trap',pair:true,view:'trap',name:L('Top of the shoulder','कंधे का ऊपरी हिस्सा'),desc:L('The top of the shoulder between the neck and the shoulder tip, where a bag strap rests (trapezius muscle).','गर्दन और कंधे के सिरे के बीच कंधे का ऊपरी हिस्सा, जहाँ बैग का पट्टा टिकता है (ट्रेपेज़ियस मांसपेशी)।'),rel:L('Common in posture strain; also where C4–C5 roots refer pain.','पोस्चर के खिंचाव में आम; C4–C5 जड़ों का दर्द भी यहाँ आता है।')},
  {id:'interscap',pair:false,view:'interscap',name:L('Between the shoulder blades','कंधे की हड्डियों के बीच'),desc:L('The upper back along the spine, in the gap between the two shoulder blades.','ऊपरी पीठ में रीढ़ के साथ, कंधे की हड्डियों के बीच।'),rel:L('Neck discs often refer pain here, especially C6–C7.','गर्दन की डिस्क का दर्द अक्सर यहाँ आता है, खासकर C6–C7।')},
  {id:'scap',pair:true,view:'scap',name:L('Over the shoulder blade','कंधे की हड्डी (स्कैपुला) के ऊपर'),desc:L('The flat, triangle-shaped bone on each side of the upper back, behind the ribs (scapula). You can feel its edge by reaching over your shoulder.','ऊपरी पीठ में दोनों तरफ़ की चपटी, तिकोनी हड्डी (स्कैपुला), पसलियों के पीछे। कंधे के ऊपर से हाथ ले जाकर इसका किनारा छू सकते हैं।'),rel:L('Pain over the blade can be referred from a pinched neck nerve.','स्कैपुला पर दर्द गर्दन की दबी नस से आ सकता है।')},
  {id:'c5',pair:true,view:'c5',code:'C5',name:L('Shoulder and outer upper arm','कंधा और ऊपरी बांह का बाहरी हिस्सा'),desc:L('The cap of the shoulder and the outside of the upper arm.','कंधे का ऊपरी गोल हिस्सा और ऊपरी बांह का बाहरी भाग।'),rel:L('The C5 dermatome; shoulder joint problems also hurt here.','C5 डर्मेटोम; कंधे के जोड़ की समस्या भी यहाँ दुखती है।')},
  {id:'t1',pair:true,view:'t1',code:'T1',name:L('Inner upper arm and elbow','ऊपरी बांह का अंदरूनी हिस्सा और कोहनी'),desc:L('The inside of the arm from the armpit to the elbow.','बगल से कोहनी तक बांह का अंदरूनी हिस्सा।'),rel:L('The T1 dermatome, supplied by the lowest root of the arm.','T1 डर्मेटोम, बांह की सबसे निचली जड़ से।')},
  {id:'c6',pair:true,view:'c6',code:'C6',name:L('Thumb side of the forearm, thumb and index finger','अग्रबाहु का अंगूठे वाला हिस्सा, अंगूठा और तर्जनी'),desc:L('Along the forearm on the thumb side, into the thumb and index finger.','अंगूठे की ओर अग्रबाहु के साथ, अंगूठे और तर्जनी तक।'),rel:L('The C6 dermatome, usually affected by a C5–C6 disc.','C6 डर्मेटोम, आमतौर पर C5–C6 डिस्क से प्रभावित।')},
  {id:'c7',pair:true,view:'c7',code:'C7',name:L('Middle finger and the middle of the forearm','बीच की उंगली और अग्रबाहु का बीच वाला हिस्सा'),desc:L('The middle finger and a strip along the back of the forearm.','बीच की उंगली और अग्रबाहु के पीछे की एक पट्टी।'),rel:L('The C7 dermatome; C7 is the root most often pinched in the neck.','C7 डर्मेटोम; गर्दन में सबसे ज़्यादा C7 जड़ दबती है।')},
  {id:'c8',pair:true,view:'c8',code:'C8',name:L('Little-finger side of the forearm, ring and little fingers','अग्रबाहु का छोटी उंगली वाला हिस्सा, अनामिका और छोटी उंगली'),desc:L('The inner forearm into the ring and little fingers.','अग्रबाहु का अंदरूनी हिस्सा, अनामिका और छोटी उंगली तक।'),rel:L('The C8 dermatome; the ulnar nerve at the elbow can mimic it.','C8 डर्मेटोम; कोहनी पर अल्नर नस की समस्या भी ऐसी लगती है।')}
];
const TESTS = [
  {id:'spur',name:L('Neck tilt test (gentle Spurling)','गर्दन झुकाने का टेस्ट (हल्का स्परलिंग)'),
   steps:[L('Sit upright. Slowly tilt your head towards the painful side, then look slightly up.','सीधे बैठें। धीरे से सिर दर्द वाली तरफ झुकाएं, फिर थोड़ा ऊपर देखें।'),L('Hold for 5 seconds. Do not press on your head and stop at once if pain becomes sharp.','5 सेकंड रुकें। सिर पर दबाव न डालें और तेज़ दर्द होते ही रुक जाएं।')],
   pos:L('It brings on pain, tingling or numbness running down the arm.','बांह में नीचे तक दर्द, झुनझुनी या सुन्नपन आ जाए।'),
   acc:L('Part of a validated set of four neck tests: when 3 of 4 are positive, specificity is 94%.','चार टेस्ट के प्रमाणित सेट का हिस्सा: 4 में से 3 पॉज़िटिव हों तो विशिष्टता 94%।'),src:'wainner',ans:[['spur_pos','tPos','y'],['spur_neg','tNeg','n'],['spur_skip','tSkip','s']]},
  {id:'sabd',name:L('Hand-on-head relief test','सिर पर हाथ रखने का टेस्ट'),
   steps:[L('Rest the palm of the painful arm on top of your head for one minute.','दर्द वाली बांह की हथेली एक मिनट सिर के ऊपर रखें।')],
   pos:L('The arm pain clearly eases while the hand is on the head.','हाथ सिर पर रखने से बांह का दर्द साफ़ कम हो जाए।'),
   acc:L('Relief suggests a pinched nerve root in the neck rather than a shoulder problem.','आराम मिलना कंधे की समस्या के बजाय गर्दन में दबी नस की ओर इशारा करता है।'),src:'wainner',ans:[['sabd_pos','tPos','y'],['sabd_neg','tNeg','n'],['sabd_skip','tSkip','s']]},
  {id:'grip',name:L('Grip-and-release test (hand speed)','मुट्ठी बंद-खोल टेस्ट (हाथ की गति)'),
   steps:[L('Hold both hands in front of you. Make a full fist and open the fingers completely, as fast as you can, for 10 seconds.','दोनों हाथ सामने रखें। 10 सेकंड तक जितनी तेज़ी से हो सके पूरी मुट्ठी बंद करें और उंगलियाँ पूरी खोलें।'),L('Count how many times you manage with each hand.','हर हाथ से कितनी बार कर पाए, गिनें।')],
   pos:L('Fewer than 20 full cycles in 10 seconds, or clearly slower on one side.','10 सेकंड में 20 से कम पूरे चक्र, या एक तरफ साफ़ धीमा।'),
   acc:L('Slow grip and release is a sign of spinal cord compression (myelopathy).','धीमी मुट्ठी बंद-खोल स्पाइनल कॉर्ड पर दबाव (मायलोपैथी) का संकेत है।'),src:'myelo',ans:[['grip_slow','tWeak','y'],['grip_ok','tNorm','n'],['grip_skip','tSkip','s']]},
  {id:'tandem',name:L('Heel-to-toe walk','एड़ी-पंजा चाल'),
   steps:[L('Stand next to a wall for safety.','सुरक्षा के लिए दीवार के पास खड़े हों।'),L('Walk 10 steps in a straight line, placing the heel of one foot directly in front of the toes of the other.','सीधी रेखा में 10 कदम चलें, एक पैर की एड़ी दूसरे पैर के पंजे के ठीक आगे रखते हुए।')],
   pos:L('You lose balance, need to grab the wall or step off the line.','संतुलन बिगड़े, दीवार पकड़नी पड़े या लाइन से हट जाएं।'),
   acc:L('Unsteady walking is the most important clue to spinal cord compression in the neck.','लड़खड़ाती चाल गर्दन में स्पाइनल कॉर्ड पर दबाव का सबसे अहम संकेत है।'),src:'myelo',ans:[['tandem_bad','tPos','y'],['tandem_ok','tNeg','n'],['tandem_skip','tSkip','s']]}
];
const D = C.DEPTS;
D.cardio = D.cardio || {n:L('Cardiology','कार्डियोलॉजी'),s:L('Heart specialist; heart pain can be felt in the neck, jaw, arm or back.','दिल के विशेषज्ञ; दिल का दर्द गर्दन, जबड़े, बांह या पीठ में भी महसूस हो सकता है।'),q:'cardiologist'};
D.handsurg = D.handsurg || {n:L('Hand surgery / Orthopaedics','हैंड सर्जरी / ऑर्थोपेडिक्स'),s:L('Nerve entrapment at the wrist or elbow and shoulder problems.','कलाई या कोहनी पर नस का दबना और कंधे की समस्याएं।'),q:'hand surgeon'};
const CONDS = [
  {id:'cervrad',th:[14,8,4],anchor:['arm_any','ch_shoot','spur_pos'],depts:['ortho_spine','physio','neurosurg',{id:'neuro',when:{any:['ch_numb','arm_weak']}}],
   name:L('Cervical disc herniation or bone spur pinching a nerve root (cervical radiculopathy)','गर्दन की डिस्क या हड्डी के उभार से नस की जड़ दबना (सर्वाइकल रेडिकुलोपैथी)'),sci:'Cervical radiculopathy · disc herniation · foraminal stenosis',
   what:L('A disc or a bony spur in the neck narrows the opening where a nerve root leaves the spine. Pain, tingling and numbness travel down the arm along that root, often worse when looking up or turning the head.','गर्दन की डिस्क या हड्डी का उभार उस छेद को संकरा कर देता है जहाँ से नस की जड़ निकलती है। दर्द, झुनझुनी और सुन्नपन उस जड़ के रास्ते बांह में नीचे जाते हैं, अक्सर ऊपर देखने या सिर घुमाने पर बढ़ते हैं।'),
   causes:L('Age-related drying of the discs with bony spurs (spondylosis) causes about two-thirds of cases; a soft disc herniation causes about one in five. Long screen time, heavy overhead work and smoking add risk.','डिस्क का उम्र के साथ सूखना और हड्डी का उभार (स्पॉन्डिलोसिस) लगभग दो-तिहाई मामलों का कारण है; नरम डिस्क हर्निएशन लगभग पाँच में से एक का। लंबा स्क्रीन टाइम, ऊपर हाथ करके भारी काम और धूम्रपान खतरा बढ़ाते हैं।'),cSrc:['radhak'],
   confirm:L('Neurological examination of strength, reflexes and sensation in both arms; MRI of the neck if there is weakness or no improvement after 6 weeks; nerve conduction tests if the cause is unclear.','दोनों बांहों में ताकत, रिफ्लेक्स और संवेदना की जांच; कमज़ोरी हो या 6 हफ्ते में सुधार न हो तो गर्दन का MRI; कारण साफ़ न हो तो नर्व कंडक्शन टेस्ट।'),
   treat:L('Activity changes, medicines chosen by your doctor, physiotherapy (posture, nerve gliding, strengthening) and sometimes a short period in a soft collar. Image-guided injections for persistent arm pain; surgery (ACDF or disc replacement) for weakness or pain that does not settle.','गतिविधि में बदलाव, डॉक्टर द्वारा चुनी दवाएं, फिज़ियोथेरेपी (पोस्चर, नर्व ग्लाइडिंग, मज़बूती) और कभी-कभी थोड़े समय सॉफ्ट कॉलर। लगातार बांह दर्द में इमेज-गाइडेड इंजेक्शन; कमज़ोरी या न सुधरने वाले दर्द में सर्जरी (ACDF या डिस्क रिप्लेसमेंट)।'),
   outlook:L('About 90% are symptom-free or only mildly affected at follow-up; about one in four needs surgery, and about one in three has another episode.','लगभग 90% लोग बाद में बिना लक्षण या हल्के लक्षणों वाले रहते हैं; लगभग चार में से एक को सर्जरी चाहिए, और तीन में से एक को दोबारा दर्द होता है।'),oSrc:['radhak'],
   w:{h_lt1y:1,btw_free:1,c6:3,c7:3,c8:2,c5:2,t1:1,arm_any:2,below_elbow:3,dom_arm:3,ch_shoot:3,ch_tingle:2,ch_numb:2,w_lookup:3,w_turn:1,w_cough:2,b_hand_head:3,spur_pos:4,sabd_pos:3,arm_one:1,a_30_39:1,a_40_49:2,a_50_59:2,on_woke:1,on_overhead:1,on_lift:1,arm_weak:1,interscap:1,scap:1,
      spur_neg:-2,both_arms:-1,rf_fever:-3,o_shoulder_move:-2,ch_night_hand:-1}},
  {id:'myelo',th:[10,7,4],anchor:['myelo_any'],depts:['neurosurg','ortho_spine','neuro'],
   name:L('Spinal cord compression in the neck (cervical myelopathy)','गर्दन में स्पाइनल कॉर्ड पर दबाव (सर्वाइकल मायलोपैथी)'),sci:'Degenerative cervical myelopathy',
   what:L('Discs, bony spurs and thickened ligaments narrow the canal and press on the spinal cord itself. Typical signs are clumsy hands, numb hands in both arms, unsteady walking and electric shocks down the spine. Neck pain may be mild or absent.','डिस्क, हड्डी के उभार और मोटे लिगामेंट नली को संकरा कर स्पाइनल कॉर्ड पर ही दबाव डालते हैं। खास संकेत: हाथों में अनाड़ीपन, दोनों हाथों में सुन्नपन, लड़खड़ाती चाल और रीढ़ में करंट। गर्दन दर्द हल्का या न के बराबर हो सकता है।'),
   causes:L('Mostly age-related spondylosis after 50; also a congenitally narrow canal, ossified ligaments (OPLL) or a large disc.','ज़्यादातर 50 के बाद उम्र से जुड़ा स्पॉन्डिलोसिस; जन्म से संकरी नली, लिगामेंट का हड्डी बन जाना (OPLL) या बड़ी डिस्क भी।'),cSrc:['myelo'],
   confirm:L('Neurological examination (Hoffmann sign, reflexes, gait) and MRI of the neck.','न्यूरोलॉजिकल जांच (हॉफमैन साइन, रिफ्लेक्स, चाल) और गर्दन का MRI।'),
   treat:L('Usually decompression surgery when function is affected; mild cases are watched closely with regular examinations.','काम पर असर हो तो आमतौर पर डीकंप्रेशन सर्जरी; हल्के मामलों में नियमित जांच के साथ करीबी निगरानी।'),
   outlook:L('It tends to worsen slowly and step-wise and rarely improves without surgery; early treatment protects function.','यह धीरे-धीरे, सीढ़ी की तरह बढ़ता है और बिना सर्जरी कम ही सुधरता है; जल्दी इलाज से काम करने की क्षमता बचती है।'),oSrc:['myelo'],
   w:{btw_often:2,h_1_5y:1,ch_clumsy:4,ch_balance:4,ch_lhermitte:3,grip_slow:4,tandem_bad:4,both_arms:2,ch_numb:1,ch_tingle:1,a_50_59:2,a_60p:3,on_gradual:2,d_3m:1,d_6_12:1,t_worse:1,a_u18:-3,a_18_29:-2}},
  {id:'neckstrain',th:[9,6,3],anchor:['neck','trap'],depts:['physio','gp','ortho_spine'],
   name:L('Neck muscle strain and postural neck pain','गर्दन की मांसपेशियों में खिंचाव और पोस्चर से गर्दन दर्द'),sci:'Non-specific mechanical neck pain',
   what:L('Overworked neck and shoulder muscles become tight and sore, often from holding the head forward over a screen. Pain stays in the neck and shoulders without nerve signs in the arm.','गर्दन और कंधे की ज़्यादा काम करती मांसपेशियाँ जकड़ कर दुखने लगती हैं, अक्सर स्क्रीन पर सिर आगे झुकाए रखने से। दर्द बांह में नस के लक्षणों के बिना गर्दन और कंधों में रहता है।'),
   causes:L('Forward-head posture, long laptop or phone use, a poor pillow, stress and weak shoulder-blade muscles.','सिर आगे निकाले रखना, लैपटॉप या फ़ोन का लंबा उपयोग, गलत तकिया, तनाव और कंधे की कमज़ोर मांसपेशियाँ।'),
   confirm:L('Clinical examination; scans are not needed without warning signs.','क्लिनिकल जांच; खतरे के संकेत न हों तो स्कैन ज़रूरी नहीं।'),
   treat:L('Posture and workstation changes, regular movement breaks, heat, physiotherapy exercises; medicines only as prescribed.','पोस्चर और काम की जगह में बदलाव, नियमित ब्रेक, सिकाई, फिज़ियोथेरेपी व्यायाम; दवाएं सिर्फ डॉक्टर की सलाह से।'),
   outlook:L('Most episodes settle within weeks; staying active helps.','ज़्यादातर दर्द कुछ हफ्तों में ठीक होता है; सक्रिय रहना मदद करता है।'),
   w:{h_first:2,btw_free:1,h_5y:-1,neck:2,trap:2,ch_ache:2,ch_stiff:2,w_screen:3,on_screen:2,r_desk:2,w_turn:1,d_days:1,d_weeks:1,b_rest:1,scap:1,below_elbow:-3,spur_pos:-3,ch_shoot:-2,dom_arm:-2,rf_fever:-3}},
  {id:'cspondy',th:[10,6,3],anchor:['neck'],depts:['ortho_spine','physio','pain'],
   name:L('Cervical spondylosis (neck arthritis)','सर्वाइकल स्पॉन्डिलोसिस (गर्दन की गठिया)'),sci:'Cervical spondylosis · facet arthropathy',
   what:L('Wear of the neck discs and small facet joints causes stiffness and aching, often with headaches from the back of the head and grinding on movement.','गर्दन की डिस्क और छोटे फ़ैसेट जोड़ों की घिसावट से जकड़न और दर्द होता है, अक्सर सिर के पीछे से सिरदर्द और हिलाने पर किरकिराहट के साथ।'),
   causes:L('Ageing, previous injury, long years of desk work and genetics. Most people over 50 show some changes on X-ray.','उम्र, पुरानी चोट, सालों का डेस्क वर्क और आनुवंशिकता। 50 से ऊपर ज़्यादातर लोगों के एक्स-रे में कुछ बदलाव दिखते हैं।'),
   confirm:L('Examination; X-ray or MRI only if symptoms persist or nerves are involved.','जांच; लक्षण बने रहें या नसें शामिल हों तभी एक्स-रे या MRI।'),
   treat:L('Exercise, posture, heat and pain relief; facet injections or radiofrequency treatment for persistent pain.','व्यायाम, पोस्चर, सिकाई और दर्द की दवा; लंबे दर्द में फ़ैसेट इंजेक्शन या रेडियोफ्रीक्वेंसी इलाज।'),
   outlook:L('Symptoms come and go; good posture and exercise keep most people active.','लक्षण आते-जाते रहते हैं; अच्छा पोस्चर और व्यायाम ज़्यादातर लोगों को सक्रिय रखते हैं।'),
   w:{h_1_5y:2,h_5y:3,btw_some:2,h_first:-2,neck:2,ch_stiff:2,ch_ache:2,w_turn:2,w_lookup:1,a_40_49:1,a_50_59:2,a_60p:2,d_3m:2,on_gradual:2,ch_headache:1,ep_recur:1,below_elbow:-2,dom_arm:-2}},
  {id:'wryneck',th:[9,6,4],anchor:['ch_stiff','ch_spasm'],depts:['physio','gp'],
   name:L('Acute wry neck (torticollis)','अचानक गर्दन अकड़ना (टॉर्टिकोलिस)'),sci:'Acute torticollis',
   what:L('Waking with a painful, locked neck that is tilted or turned to one side, caused by muscle spasm or a jammed facet joint.','सुबह उठने पर गर्दन दर्द के साथ एक तरफ झुकी या मुड़ी हुई जकड़ जाना, मांसपेशियों की ऐंठन या फ़ैसेट जोड़ के अटकने से।'),
   causes:L('An awkward sleeping position, a draught or a sudden movement.','सोते समय गलत पोज़िशन, ठंडी हवा या अचानक हलचल।'),
   confirm:L('Clinical examination.','क्लिनिकल जांच।'),
   treat:L('Heat, gentle movement and pain relief; physiotherapy if it does not ease in a few days.','सिकाई, हल्की हलचल और दर्द की दवा; कुछ दिनों में ठीक न हो तो फिज़ियोथेरेपी।'),
   outlook:L('Usually settles within a week.','आमतौर पर एक हफ्ते में ठीक।'),
   w:{h_first:1,btw_free:1,on_woke:3,ch_stiff:3,ch_spasm:3,neck:1,trap:1,d_days:2,a_u18:1,a_18_29:1,arm_any:-2,below_elbow:-2,d_3m:-3}},
  {id:'whiplash',th:[8,6,4],anchor:['on_whiplash','on_accident'],depts:['ortho_spine','physio'],
   name:L('Whiplash injury','व्हिपलैश चोट'),sci:'Whiplash-associated disorder',
   what:L('A sudden back-and-forth jerk of the head strains the neck muscles, ligaments and joints. Pain and stiffness often start hours later.','सिर के अचानक आगे-पीछे झटके से गर्दन की मांसपेशियों, लिगामेंट और जोड़ों में खिंचाव। दर्द और जकड़न अक्सर कुछ घंटों बाद शुरू होती है।'),
   causes:L('Rear-end collisions, sudden braking, falls and contact sports.','पीछे से टक्कर, अचानक ब्रेक, गिरना और संपर्क वाले खेल।'),
   confirm:L('Examination; doctors use the Canadian C-spine rule to decide on an X-ray or CT, for example at age 65 or over or with tingling in the limbs.','जांच; एक्स-रे या CT का फ़ैसला डॉक्टर कैनेडियन C-स्पाइन नियम से करते हैं, जैसे 65 या ज़्यादा उम्र में या हाथ-पैर में झुनझुनी हो तो।'),
   treat:L('Staying active, pain relief and physiotherapy; collars are generally not advised for long.','सक्रिय रहना, दर्द की दवा और फिज़ियोथेरेपी; कॉलर लंबे समय तक आमतौर पर नहीं।'),
   outlook:L('Most improve within weeks to a few months.','ज़्यादातर कुछ हफ्तों से कुछ महीनों में सुधरते हैं।'),
   w:{h_first:2,on_whiplash:6,on_accident:3,neck:2,ch_stiff:1,ch_headache:1,trap:1}},
  {id:'cgh',th:[8,6,4],anchor:['ch_headache'],depts:['physio','neuro'],
   name:L('Headache coming from the neck (cervicogenic headache)','गर्दन से आने वाला सिरदर्द (सर्विकोजेनिक हेडेक)'),sci:'Cervicogenic headache',
   what:L('Irritated upper neck joints (C1–C3) refer pain to the back of the head, temple or behind the eye, usually on one side and triggered by neck posture.','ऊपरी गर्दन के जोड़ों (C1–C3) की जलन सिर के पीछे, कनपटी या आंख के पीछे दर्द भेजती है, आमतौर पर एक तरफ और गर्दन के पोस्चर से शुरू।'),
   causes:L('Sustained forward-head posture, upper-neck arthritis or past whiplash.','लगातार सिर आगे झुकाए रखना, ऊपरी गर्दन की गठिया या पुराना व्हिपलैश।'),
   confirm:L('Examination of the upper neck; a diagnostic nerve block if needed. Other headache types are ruled out.','ऊपरी गर्दन की जांच; ज़रूरत हो तो डायग्नोस्टिक नर्व ब्लॉक। दूसरे सिरदर्द खारिज किए जाते हैं।'),
   treat:L('Physiotherapy (manual therapy, deep neck flexor exercises) and posture correction.','फिज़ियोथेरेपी (मैनुअल थेरेपी, गहरी गर्दन की मांसपेशियों के व्यायाम) और पोस्चर सुधार।'),
   outlook:L('Responds well to targeted physiotherapy.','लक्षित फिज़ियोथेरेपी से अच्छा सुधार।'),
   w:{h_1_5y:1,btw_some:1,ch_headache:4,neck:2,w_turn:1,w_screen:1,ch_stiff:1,on_whiplash:1}},
  {id:'shoulder',th:[9,6,4],anchor:['o_shoulder_move','w_overhead'],depts:['ortho','physio'],
   name:L('Shoulder problem (rotator cuff or frozen shoulder)','कंधे की समस्या (रोटेटर कफ या फ्रोज़न शोल्डर)'),sci:'Rotator cuff tendinopathy · adhesive capsulitis',
   what:L('Pain from the shoulder joint is felt over the outer upper arm and can be mistaken for a neck problem. It is worse lifting the arm, reaching behind and lying on that side.','कंधे के जोड़ का दर्द ऊपरी बांह के बाहर महसूस होता है और गर्दन की समस्या लग सकता है। बांह उठाने, पीछे ले जाने और उस तरफ लेटने पर बढ़ता है।'),
   causes:L('Overuse, age-related tendon wear, injury; frozen shoulder is more common with diabetes.','ज़्यादा उपयोग, उम्र से टेंडन की घिसावट, चोट; डायबिटीज़ में फ्रोज़न शोल्डर ज़्यादा आम।'),
   confirm:L('Shoulder examination; ultrasound or MRI if needed.','कंधे की जांच; ज़रूरत हो तो अल्ट्रासाउंड या MRI।'),
   treat:L('Physiotherapy, pain relief, sometimes an injection; surgery for selected tears.','फिज़ियोथेरेपी, दर्द की दवा, कभी-कभी इंजेक्शन; कुछ फटे टेंडन में सर्जरी।'),
   outlook:L('Most improve over months with exercise.','व्यायाम से ज़्यादातर महीनों में सुधरते हैं।'),
   w:{o_shoulder_move:5,w_overhead:3,c5:2,sleep_bad:1,a_40_49:1,a_50_59:2,r_immune:1,below_elbow:-3,spur_pos:-2,ch_tingle:-1,b_hand_head:-1}},
  {id:'cts',th:[8,6,4],anchor:['ch_night_hand'],depts:['handsurg','neuro'],
   name:L('Carpal tunnel syndrome (nerve pressed at the wrist)','कार्पल टनल सिंड्रोम (कलाई पर नस दबना)'),sci:'Median nerve entrapment at the wrist',
   what:L('The median nerve is squeezed at the wrist, causing tingling in the thumb, index and middle fingers, typically at night. It can mimic a C6 or C7 root problem.','कलाई पर मीडियन नस दबती है, जिससे अंगूठे, तर्जनी और बीच की उंगली में झुनझुनी होती है, खासकर रात में। यह C6 या C7 जड़ की समस्या जैसी लग सकती है।'),
   causes:L('Repetitive wrist use, pregnancy, diabetes, thyroid problems and wrist injury.','कलाई का बार-बार उपयोग, गर्भावस्था, डायबिटीज़, थायरॉइड और कलाई की चोट।'),
   confirm:L('Examination and nerve conduction studies.','जांच और नर्व कंडक्शन स्टडी।'),
   treat:L('Night wrist splint, activity changes, injection; release surgery if severe.','रात में कलाई की स्प्लिंट, गतिविधि बदलाव, इंजेक्शन; गंभीर हो तो रिलीज़ सर्जरी।'),
   outlook:L('Very treatable; early treatment prevents muscle wasting.','अच्छा इलाज संभव; जल्दी इलाज मांसपेशी घटने से बचाता है।'),
   w:{ch_night_hand:5,ch_tingle:2,c6:1,c7:1,r_immune:1,neck:-1,spur_pos:-2,ch_shoot:-1}},
  {id:'cinflam',th:[12,8,5],anchor:['ch_stiff_am','b_exercise','w_rest'],depts:['rheum','physio'],
   name:L('Inflammatory arthritis of the neck','गर्दन की सूजन वाली गठिया'),sci:'Axial spondyloarthritis · rheumatoid arthritis of the cervical spine',
   what:L('Immune conditions can inflame the neck joints, causing long morning stiffness that improves with movement.','इम्यून बीमारियाँ गर्दन के जोड़ों में सूजन ला सकती हैं, जिससे सुबह लंबी अकड़न होती है जो हलचल से सुधरती है।'),
   causes:L('Axial spondyloarthritis (linked to HLA-B27) and rheumatoid arthritis.','एक्सियल स्पॉन्डिलोआर्थराइटिस (HLA-B27 से जुड़ा) और रूमेटॉइड आर्थराइटिस।'),
   confirm:L('Blood tests and imaging under a rheumatologist.','रूमेटोलॉजिस्ट की देखरेख में ब्लड टेस्ट और इमेजिंग।'),
   treat:L('Anti-inflammatory and disease-modifying medicines with exercise.','व्यायाम के साथ सूजन-रोधी और बीमारी नियंत्रित करने वाली दवाएं।'),
   outlook:L('Well controlled with early treatment.','जल्दी इलाज से अच्छा नियंत्रण।'),
   w:{h_1_5y:2,h_5y:2,btw_some:1,h_first:-1,ch_stiff_am:3,b_exercise:3,w_rest:2,r_spa:3,d_3m:2,on_gradual:2,a_18_29:1,a_30_39:1,neck:1}},
  {id:'cinfect',th:[9,6,4],anchor:['rf_fever'],depts:['ortho_spine','id_tb','gp'],
   name:L('Infection of the neck spine, including TB','गर्दन की रीढ़ का इन्फेक्शन, टीबी सहित'),sci:'Cervical spondylodiscitis · tuberculosis',
   what:L('Bacteria or TB can infect a neck disc and the bones beside it, causing constant pain with fever, sweats or weight loss.','बैक्टीरिया या टीबी गर्दन की डिस्क और पास की हड्डियों को संक्रमित कर सकते हैं, जिससे बुखार, पसीना या वज़न घटने के साथ लगातार दर्द होता है।'),
   causes:L('Spread through the blood; diabetes, low immunity and past TB raise the risk.','खून के ज़रिए फैलाव; डायबिटीज़, कम इम्युनिटी और पुरानी टीबी खतरा बढ़ाते हैं।'),
   confirm:L('Blood tests, MRI and a biopsy.','ब्लड टेस्ट, MRI और बायोप्सी।'),
   treat:L('Long antibiotic or anti-TB treatment; surgery if the cord is compressed.','लंबा एंटीबायोटिक या टीबी का इलाज; कॉर्ड पर दबाव हो तो सर्जरी।'),
   outlook:L('Curable when treated early.','जल्दी इलाज से ठीक।'),
   w:{h_first:2,h_5y:-2,rf_fever:5,r_tb:3,r_immune:2,rf_night:2,d_6_12:1,d_3m:1,t_worse:1}},
  {id:'ctumour',th:[10,8,7],rare:true,anchor:['r_cancer'],depts:['ortho_spine','onco'],
   name:L('Tumour involving the neck spine (rare)','गर्दन की रीढ़ से जुड़ी गांठ (दुर्लभ)'),sci:'Spinal metastasis or primary tumour',
   what:L('Rare. Checked when there is past cancer, weight loss or constant night pain.','दुर्लभ। पहले कैंसर, वज़न घटने या रात के लगातार दर्द में जांच होती है।'),
   causes:L('Spread from another cancer, or rarely a primary spinal tumour.','दूसरे कैंसर से फैलाव, या कभी-कभी रीढ़ की अपनी गांठ।'),
   confirm:L('MRI and blood tests.','MRI और ब्लड टेस्ट।'),treat:L('Depends on the cause.','कारण पर निर्भर।'),outlook:L('Early assessment matters.','जल्दी जांच ज़रूरी।'),
   w:{h_first:2,btw_often:1,h_5y:-2,r_cancer:5,rf_night:3,rf_fever:1,a_50_59:1,a_60p:2,d_3m:1,t_worse:1}}
];
const EMERG = {
  cord:{name:L('Rapidly worsening spinal cord compression','तेज़ी से बढ़ता स्पाइनल कॉर्ड दबाव'),sci:'Acute or progressive cervical myelopathy',
    what:L('Quickly worsening clumsiness, weakness, unsteadiness or new bladder trouble means the spinal cord is under pressure and needs emergency MRI and surgical assessment.','तेज़ी से बढ़ता अनाड़ीपन, कमज़ोरी, लड़खड़ाहट या पेशाब की नई दिक्कत का मतलब है कि स्पाइनल कॉर्ड पर दबाव है; तुरंत MRI और सर्जिकल जांच ज़रूरी।'),src:['myelo'],depts:['emergency','neurosurg']},
  trauma:{name:L('Possible neck injury','गर्दन की चोट की आशंका'),sci:'Cervical spine trauma',
    what:L('After a fall, accident, dive or head injury, keep the head and neck still and get emergency care to rule out a fracture.','गिरने, दुर्घटना, गोते या सिर की चोट के बाद सिर और गर्दन स्थिर रखें और फ्रैक्चर खारिज करने के लिए तुरंत इमरजेंसी जाएं।'),src:['wikem'],depts:['emergency','ortho_spine']},
  mening:{name:L('Possible meningitis','मेनिनजाइटिस की आशंका'),sci:'Meningitis',
    what:L('Fever with a stiff neck, severe headache or dislike of light can be meningitis, which is a medical emergency.','बुखार के साथ गर्दन जकड़न, तेज़ सिरदर्द या रोशनी से परेशानी मेनिनजाइटिस हो सकती है, जो मेडिकल इमरजेंसी है।'),src:['mening'],depts:['emergency']},
  stroke:{name:L('Possible artery tear or stroke','धमनी फटने या स्ट्रोक की आशंका'),sci:'Cervical artery dissection · stroke',
    what:L('Sudden severe neck pain or headache with vision, speech or balance problems can come from a torn neck artery or a stroke. Call an ambulance.','अचानक तेज़ गर्दन दर्द या सिरदर्द के साथ देखने, बोलने या संतुलन की समस्या गर्दन की धमनी फटने या स्ट्रोक से हो सकती है। एम्बुलेंस बुलाएं।'),src:['wikem'],depts:['emergency','neuro']},
  cardiac:{name:L('Possible heart attack','दिल के दौरे की आशंका'),sci:'Acute coronary syndrome',
    what:L('Heart pain can be felt in the neck, jaw, arm or back, with chest pressure, sweating or breathlessness. Call an ambulance; do not wait.','दिल का दर्द गर्दन, जबड़े, बांह या पीठ में भी महसूस हो सकता है, साथ में सीने में दबाव, पसीना या सांस फूलना। एम्बुलेंस बुलाएं; इंतज़ार न करें।'),src:['aha'],depts:['emergency','cardio']}
};
const ROOTS = {
  C5:{skin:L('Shoulder cap and outer upper arm','कंधे का गोल हिस्सा और ऊपरी बांह का बाहरी भाग'),mus:L('Lifting the arm sideways (deltoid), bending the elbow (biceps)','बांह को साइड में उठाना (डेल्टॉइड), कोहनी मोड़ना (बाइसेप्स)'),ref:L('Biceps reflex reduced','बाइसेप्स रिफ्लेक्स कम'),disc:'C4–C5',test:L('Lift arms sideways against resistance','विरोध के खिलाफ बांहें साइड में उठाना')},
  C6:{skin:L('Thumb-side forearm, thumb and index finger','अग्रबाहु का अंगूठे वाला हिस्सा, अंगूठा और तर्जनी'),mus:L('Wrist extension, elbow bending (brachioradialis)','कलाई पीछे मोड़ना, कोहनी मोड़ना (ब्रैकियोरेडियलिस)'),ref:L('Brachioradialis reflex reduced','ब्रैकियोरेडियलिस रिफ्लेक्स कम'),disc:'C5–C6',test:L('Bend the wrist back against resistance','विरोध के खिलाफ कलाई पीछे मोड़ना')},
  C7:{skin:L('Middle finger, back of the forearm','बीच की उंगली, अग्रबाहु का पिछला भाग'),mus:L('Straightening the elbow (triceps), wrist flexion','कोहनी सीधी करना (ट्राइसेप्स), कलाई आगे मोड़ना'),ref:L('Triceps reflex reduced','ट्राइसेप्स रिफ्लेक्स कम'),disc:'C6–C7',test:L('Push-up against a wall','दीवार पर पुश-अप')},
  C8:{skin:L('Little-finger side of forearm, ring and little fingers','अग्रबाहु का छोटी उंगली वाला हिस्सा, अनामिका और छोटी उंगली'),mus:L('Finger bending and grip','उंगलियाँ मोड़ना और पकड़'),ref:L('None reliable','कोई भरोसेमंद नहीं'),disc:'C7–T1',test:L('Grip strength','पकड़ की ताकत')},
  T1:{skin:L('Inner elbow and upper arm','कोहनी और ऊपरी बांह का अंदरूनी भाग'),mus:L('Spreading the fingers (hand muscles)','उंगलियाँ फैलाना (हाथ की मांसपेशियाँ)'),ref:L('None reliable','कोई भरोसेमंद नहीं'),disc:'T1–T2',test:L('Spread fingers against resistance','विरोध के खिलाफ उंगलियाँ फैलाना')}
};
const RS = {
  o_motor_arm:L('Arm weakness or inability to grip','बांह में कमज़ोरी या पकड़ न पाना'),
  o_myelo:L('Signs of spinal cord pressure: clumsy hands, unsteady walking or electric shocks','स्पाइनल कॉर्ड पर दबाव के संकेत: हाथों में अनाड़ीपन, लड़खड़ाती चाल या करंट'),
  o_fever:L('Fever, night sweats or weight loss with neck pain','गर्दन दर्द के साथ बुखार, रात को पसीना या वज़न घटना'),
  o_cancer:L('New neck pain with a history of cancer','कैंसर के इतिहास के साथ नया गर्दन दर्द'),
  o_night:L('Constant night pain at age 50 or over','50 या ज़्यादा उम्र में रात का लगातार दर्द'),
  o_pain:L('Very severe pain (9–10 out of 10)','बहुत तेज़ दर्द (10 में 9–10)'),
  o_worse:L('Arm nerve pain that is getting worse','बढ़ता हुआ बांह का नस दर्द'),
  o_injury_old:L('Neck injury at age 60 or over','60 या ज़्यादा उम्र में गर्दन की चोट'),
  y_radic:L('Arm pain with nerve-root features','नस की जड़ के लक्षणों वाला बांह दर्द'),
  y_long:L('This bout has lasted more than 6 weeks','इस बार का दर्द 6 हफ्ते से ज़्यादा से है'),
  y_inflam:L('Inflammatory pattern: long morning stiffness, better with exercise','सूजन वाला पैटर्न: सुबह लंबी अकड़न, व्यायाम से आराम'),
  y_age:L('Age under 18 or over 60','18 से कम या 60 से ज़्यादा उम्र'),
  y_pain:L('Strong pain (7–8 out of 10)','तेज़ दर्द (10 में 7–8)'),
  y_injury:L('Started after a jerk, fall or accident','झटके, गिरने या दुर्घटना के बाद शुरू'),
  y_night:L('Pain at rest at night','रात को आराम में दर्द'), y_sleep:L('Pain disturbing sleep','दर्द से नींद खराब'),
  y_headache:L('Headaches with the neck pain','गर्दन दर्द के साथ सिरदर्द'), y_hand:L('Hand tingling at night','रात को हाथ में झुनझुनी')
};
const armAreas = ['c5','c6','c7','c8','t1'];
const DERIVED = [
  {id:'arm_any', when:{any:armAreas}}, {id:'below_elbow', when:{any:['c6','c7','c8']}},
  {id:'arm_weak', when:{any:['arm_no','arm_diff']}},
  {id:'radicular', when:{any:['below_elbow','dom_arm','ch_shoot','spur_pos','sabd_pos']}},
  {id:'myelo_any', when:{any:['ch_clumsy','ch_balance','grip_slow','tandem_bad','ch_lhermitte']}}
];
const URGENCY = {
  orange:[
    {r:'o_motor_arm', when:'arm_no'}, {r:'o_myelo', when:'myelo_any'}, {r:'o_fever', when:'rf_fever'},
    {r:'o_cancer', when:{all:['r_cancer',{not:'d_3m'}]}}, {r:'o_night', when:{all:['rf_night',{any:['age_ge50','r_cancer']}]}},
    {r:'o_pain', when:{painGte:9}}, {r:'o_worse', when:{all:['t_worse','radicular']}},
    {r:'o_injury_old', when:{all:['a_60p',{any:['on_whiplash','on_fall','on_accident','on_blow']}]}}
  ],
  yellow:[
    {r:'y_radic', when:'radicular'}, {r:'y_often', when:'btw_often'}, {r:'y_long', when:{any:['d_6_12','d_3m']}},
    {r:'y_inflam', when:{all:['ch_stiff_am',{any:['b_exercise','w_rest']}]}}, {r:'y_age', when:{any:['a_u18','a_60p']}},
    {r:'y_pain', when:{all:[{painGte:7},{not:{painGte:9}}]}}, {r:'y_injury', when:{any:['on_whiplash','on_fall','on_accident','on_blow']}},
    {r:'y_night', when:'rf_night'}, {r:'y_sleep', when:'sleep_bad'}, {r:'y_headache', when:'ch_headache'}, {r:'y_hand', when:'ch_night_hand'}
  ]
};
const EMERG_WHEN = {cord:'rf_myelo', trauma:'rf_trauma', mening:'rf_mening', stroke:'rf_stroke', cardiac:'rf_cardiac'};
const ROOT_RULES = [{root:'C6', when:'c6'}, {root:'C7', when:'c7'}, {root:'C8', when:'c8'}, {root:'C5', when:'c5'}, {root:'T1', when:{all:['t1',{not:{any:['c6','c7','c8']}}]}}];
const DISC_OF = {C5:'C4–C5', C6:'C5–C6', C7:'C6–C7', C8:'C7–T1', T1:'T1–T2'};
const DEPT_RULES = [{when:{any:['arm_no','myelo_any']}, add:['neurosurg'], why:'o_motor_arm'}];
const FOCUS = {
  cervrad:{lesion:true}, myelo:{discs:['C5–C6','C6–C7'], cord:true, herniate:true, side:'b', label:['C5–C6']},
  cspondy:{vert:['C5','C6'], discs:['C5–C6'], label:['C5–C6']}, wryneck:{vert:['C2','C3','C4']}, whiplash:{vert:['C4','C5','C6']},
  cgh:{vert:['C1','C2','C3']}, shoulder:{bones:['scap','arm']}, cts:{nerves:['median','medianF0','medianF1','medianF2'], useSides:true},
  cinflam:{vert:['C1','C2']}, cinfect:{discs:['C5–C6'], vert:['C5','C6'], label:['C5–C6']}
};
const RCA = {conds:['cervrad'], emerg:[], cerv:true, defaultRoots:['C6','C7'], defaultLevels:['C5–C6','C6–C7'], nerveTable:['C5','C6','C7','C8','T1'],
  text:{
    en:['Your answers fit a disc or bony spur at {levels} pressing on the {roots} nerve root{sideEn}. In the neck, each nerve root leaves the spine through a small opening (foramen) just behind the disc. With age the discs lose water and bony spurs grow (spondylosis), narrowing these openings; a soft disc herniation can also bulge into them.',
        'The pressed root becomes inflamed, so pain, tingling and numbness travel down the arm along its own path: C6 to the thumb, C7 to the middle finger, C8 to the little finger. Looking up and tilting the head towards the painful side narrows the opening further, which is why it hurts more; resting the hand on the head takes tension off the root.',
        'Unlike the lower back, the neck canal contains the spinal cord itself. If a disc or spurs press on the cord (myelopathy), the warning signs are clumsy hands, unsteady walking and electric shocks down the spine; these need prompt specialist assessment.{cite:myelo}'],
    hi:['आपके जवाब {levels} पर डिस्क या हड्डी के उभार से {roots} नस की जड़ पर दबाव से मेल खाते हैं{sideHi}। गर्दन में हर नस की जड़ डिस्क के ठीक पीछे एक छोटे छेद (फोरामेन) से निकलती है। उम्र के साथ डिस्क में पानी घटता है और हड्डी के उभार बनते हैं (स्पॉन्डिलोसिस), जिससे ये छेद संकरे होते हैं; नरम डिस्क हर्निएशन भी इनमें उभर सकता है।',
        'दबी हुई जड़ में सूजन आती है, इसलिए दर्द, झुनझुनी और सुन्नपन उसके अपने रास्ते से बांह में जाते हैं: C6 अंगूठे तक, C7 बीच की उंगली तक, C8 छोटी उंगली तक। ऊपर देखने और सिर को दर्द की तरफ झुकाने से छेद और संकरा होता है, इसलिए दर्द बढ़ता है; हाथ सिर पर रखने से जड़ का खिंचाव कम होता है।',
        'कमर के उलट, गर्दन की नली में खुद स्पाइनल कॉर्ड होती है। अगर डिस्क या उभार कॉर्ड को दबाएं (मायलोपैथी), तो चेतावनी के संकेत हैं हाथों में अनाड़ीपन, लड़खड़ाती चाल और रीढ़ में करंट; इनकी जल्दी विशेषज्ञ जांच ज़रूरी है।{cite:myelo}']},
  known:{en:'C7 and then C6 are the roots most often affected. About 90% of people are symptom-free or only mildly affected at follow-up, and about one in four needs surgery.{cite:radhak} Only an MRI confirms the exact level.', hi:'सबसे ज़्यादा C7 और फिर C6 जड़ प्रभावित होती है। लगभग 90% लोग बाद में बिना लक्षण या हल्के लक्षणों वाले रहते हैं, और लगभग चार में से एक को सर्जरी चाहिए।{cite:radhak} सटीक स्तर सिर्फ MRI से पक्का होता है।'},
  unknown:{en:'C5–C6 and C6–C7 are the most commonly affected levels.{cite:wikemcr} Marking which fingers tingle (thumb, middle or little finger) narrows the level; an MRI gives the final answer.', hi:'सबसे ज़्यादा C5–C6 और C6–C7 स्तर प्रभावित होते हैं।{cite:wikemcr} कौन सी उंगली में झुनझुनी है (अंगूठा, बीच की या छोटी उंगली) चिन्हित करने से स्तर का अंदाज़ा होता है; अंतिम पुष्टि MRI से होती है।'}
};
const LBLX = {arm_any:L('Pain spreads into the arm','दर्द बांह में फैलता है'), below_elbow:L('Symptoms below the elbow','कोहनी के नीचे लक्षण'), arm_one:L('One arm only','सिर्फ एक बांह'), both_arms:L('Both arms','दोनों बांहें'), radicular:L('Nerve-root features','नस की जड़ के लक्षण'), myelo_any:L('Signs of spinal cord pressure','स्पाइनल कॉर्ड पर दबाव के संकेत'), arm_weak:L('Arm weakness','बांह में कमज़ोरी')};
const FX = {
  below_elbow:L('Symptoms below the elbow point to a nerve root rather than a muscle.','कोहनी के नीचे लक्षण मांसपेशी नहीं, नस की जड़ की ओर इशारा करते हैं।'),
  arm_any:L('Pain spreading from the neck into the arm suggests a nerve root is involved.','गर्दन से बांह में फैलता दर्द नस की जड़ के शामिल होने का संकेत है।'),
  dom_arm:L('Arm pain worse than neck pain is typical of a pinched nerve root.','गर्दन से ज़्यादा बांह का दर्द दबी नस की जड़ का खास लक्षण है।'),
  w_lookup:L('Looking up narrows the openings where neck nerve roots leave the spine.','ऊपर देखने से वे छेद संकरे होते हैं जहाँ से गर्दन की नसें निकलती हैं।'),
  b_hand_head:L('Relief with the hand on the head takes tension off a pinched root.','सिर पर हाथ रखने से दबी जड़ का खिंचाव कम होता है।'),
  spur_pos:L('A positive neck tilt test reproduces root pain by narrowing the opening.','पॉज़िटिव गर्दन झुकाने का टेस्ट छेद संकरा करके जड़ का दर्द दोहराता है।'),
  sabd_pos:L('Relief on the hand-on-head test points to the neck rather than the shoulder.','सिर पर हाथ वाले टेस्ट में आराम कंधे के बजाय गर्दन की ओर इशारा करता है।'),
  c6:L('Thumb and index finger symptoms map to the C6 root.','अंगूठे और तर्जनी के लक्षण C6 जड़ से मेल खाते हैं।'), c7:L('Middle finger symptoms map to the C7 root, the most commonly affected.','बीच की उंगली के लक्षण C7 जड़ से मेल खाते हैं, जो सबसे ज़्यादा प्रभावित होती है।'),
  c8:L('Ring and little finger symptoms map to the C8 root (or the ulnar nerve at the elbow).','अनामिका और छोटी उंगली के लक्षण C8 जड़ (या कोहनी पर अल्नर नस) से मेल खाते हैं।'),
  ch_clumsy:L('Clumsy hands can mean the spinal cord itself is pressed.','हाथों में अनाड़ीपन का मतलब हो सकता है कि खुद स्पाइनल कॉर्ड दब रही है।'),
  ch_balance:L('Unsteady walking is the most important clue to cord compression in the neck.','लड़खड़ाती चाल गर्दन में कॉर्ड दबने का सबसे अहम संकेत है।'),
  ch_lhermitte:L('Electric shocks on bending the head forward suggest irritation of the cord.','सिर आगे झुकाने पर करंट कॉर्ड की जलन का संकेत है।'),
  grip_slow:L('Slow grip-and-release is a sign of myelopathy.','धीमी मुट्ठी बंद-खोल मायलोपैथी का संकेत है।'),
  tandem_bad:L('Losing balance on heel-to-toe walking suggests the cord’s balance pathways are affected.','एड़ी-पंजा चाल में संतुलन खोना कॉर्ड के संतुलन रास्तों पर असर का संकेत है।'),
  w_screen:L('Long screen time holds the head forward and overloads neck muscles.','लंबा स्क्रीन टाइम सिर आगे रखता है और गर्दन की मांसपेशियों पर भार डालता है।'),
  ch_stiff:L('Stiffness with limited turning is typical of muscle spasm or joint irritation.','घुमाने में दिक्कत के साथ जकड़न मांसपेशी ऐंठन या जोड़ की जलन का खास लक्षण है।'),
  ch_headache:L('Headaches starting at the back of the head can come from the upper neck joints.','सिर के पीछे से शुरू सिरदर्द ऊपरी गर्दन के जोड़ों से हो सकता है।'),
  on_whiplash:L('A whiplash jerk strains neck muscles, ligaments and joints.','व्हिपलैश झटका गर्दन की मांसपेशियों, लिगामेंट और जोड़ों में खिंचाव लाता है।'),
  on_woke:L('Waking with a locked neck is typical of a wry neck or a disc flare.','अकड़ी गर्दन के साथ जागना टॉर्टिकोलिस या डिस्क के उभार का खास लक्षण है।'),
  o_shoulder_move:L('Pain mainly on moving the shoulder points to the shoulder joint.','मुख्य रूप से कंधा हिलाने पर दर्द कंधे के जोड़ की ओर इशारा करता है।'),
  w_overhead:L('Pain lifting the arm overhead is typical of rotator cuff problems.','बांह ऊपर उठाने पर दर्द रोटेटर कफ की समस्या का खास लक्षण है।'),
  ch_night_hand:L('Night tingling eased by shaking the hand is typical of carpal tunnel syndrome.','रात की झुनझुनी जो हाथ झटकने से कम हो, कार्पल टनल सिंड्रोम का खास लक्षण है।'),
  neck:L('Pain in the neck itself usually comes from muscles, discs or facet joints.','गर्दन का दर्द आमतौर पर मांसपेशियों, डिस्क या फ़ैसेट जोड़ों से होता है।'),
  trap:L('Pain on top of the shoulder is common with posture strain.','कंधे के ऊपर दर्द पोस्चर के खिंचाव में आम है।'),
  arm_no:L('Being unable to lift or grip shows significant nerve involvement.','उठा या पकड़ न पाना नस पर गंभीर असर दिखाता है।')
};
const STATS = [
  {v:'203 M',t:L('people worldwide lived with neck pain in 2020; projected 269 M by 2050','लोग 2020 में दुनिया भर में गर्दन दर्द से पीड़ित; 2050 तक 269 M का अनुमान'),s:'gbdneck'},
  {v:'C7',t:L('is the nerve root most often pinched in the neck, followed by C6','गर्दन में सबसे ज़्यादा दबने वाली नस की जड़, फिर C6'),s:'radhak'},
  {v:'~90%',t:L('of people with a pinched neck nerve are symptom-free or mildly affected at follow-up','दबी गर्दन नस वाले लोग बाद में बिना लक्षण या हल्के लक्षणों वाले'),s:'radhak'}
];
const UI = {
  domT:L('Which troubles you more: neck pain or arm pain?','ज़्यादा तकलीफ़ किसमें है: गर्दन के दर्द में या बांह के दर्द में?'),
  domWhy:L('Arm pain worse than neck pain is typical of a pinched nerve root.','गर्दन से ज़्यादा बांह का दर्द दबी नस की जड़ का खास लक्षण है।'),
  repT:L('Neck and arm pain assessment','गर्दन और बांह दर्द जांच रिपोर्ट'),
  gPost:L('Neck spine from behind, vertebrae numbered. Pink: affected disc. Orange: the pressed nerve root and its path into the arm.','पीछे से गर्दन की रीढ़, हड्डियों पर नंबर। गुलाबी: प्रभावित डिस्क। नारंगी: दबी नस की जड़ और बांह में उसका रास्ता।'),
  gRef:L('Neck spine, spinal cord and arm nerves for reference.','संदर्भ के लिए गर्दन की रीढ़, स्पाइनल कॉर्ड और बांह की नसें।'),
  gX:L('Nerve path: the affected root continues down the arm to the hand, which is why symptoms reach the fingers you marked.','नस का रास्ता: प्रभावित जड़ बांह से हाथ तक जाती है, इसीलिए लक्षण आपकी चिन्हित उंगलियों तक पहुंचते हैं।'), armT:L('Using the arm and hand','बांह और हाथ का उपयोग'), workT:L('Desk, laptop or phone work','डेस्क, लैपटॉप या फ़ोन का काम')
};
const FUNCS = [
  {id:'armuse', label:'armT', req:true, opts:[['arm_ok',L('Normally','सामान्य')],['arm_diff',L('With pain or some weakness','दर्द या थोड़ी कमज़ोरी के साथ')],['arm_no',L('Cannot lift the arm or grip','बांह उठा या पकड़ नहीं पाते')]]},
  {id:'work', label:'workT', req:true, opts:[['work_ok',L('More than 1 hour','1 घंटे से ज़्यादा')],['work_lim',L('Less than 1 hour','1 घंटे से कम')],['work_no',L('Cannot do it','नहीं कर पाते')]]},
  {id:'sleep', label:'sleep', opts:C.SLEEPS}
];
SPG.data.modules.cervical = {id:'cervical', order:2, card:{reg:['neck','trap_l','trap_r','c6_l','c7_l'], view:{az:Math.PI, el:0.08, d:2.1, yk:'sh', dy:-0.14}, hint:L('Stiff or painful neck, pain or tingling down the arm','गर्दन में दर्द या जकड़न, बांह में नीचे तक दर्द या झुनझुनी')}, name:L('Neck pain, with or without arm pain','गर्दन दर्द, बांह के दर्द के साथ या बिना'), safetyView:'neck', startRegions:['neck'], safetyRegions:[],
  labelSet:['C1','C2','C3','C4','C5','C6','C7','T1','T2'], GAL:{d:0.40, ld:0.36, td:0.17, ref:'C4', refDy:0, nerves:['C5_','C6_','C7_','C8_','T1_','median','ulnar','radial','cord']}, defaultDept:'ortho_spine',
  ONSETS, DOMS, PAT, RFS, VIEWS, AREAS, TESTS, CONDS, EMERG, ROOTS, RS, DERIVED, SIDES:{areas:armAreas, one:'arm_one', both:'both_arms', sideAreas:armAreas.concat(['trap','scap'])},
  URGENCY, EMERG_WHEN, ROOT_RULES, DISC_OF, EXIT_OF:{}, DEPT_RULES, FOCUS, RCA, LBLX, UI, FUNCS, FX, STATS, domWhen:{any:armAreas}};
})();
