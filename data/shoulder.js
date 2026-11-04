window.SPG = window.SPG || {data:{modules:{}}};
/* Shoulder module (v5.3). Questions, weights, rules and explanations for shoulder pain.
   Evidence table: research/shoulder-evidence.md. Weights from likelihood ratios use round(4 x log10(LR)); others are marked expert estimates there. */
(function(){
const PI = Math.PI;
const L = (en, hi) => ({en, hi});
const C = SPG.data.common;
C.SRC.push(
  ['besssap','BESS / BOA / Royal College of Surgeons. Commissioning guide: subacromial shoulder pain (2014): rotator cuff causes up to 70% of new shoulder pain; red flags; 6 weeks of physiotherapy first','https://boa.ac.uk/asset/CAD0336B-9051-48A7-9E4DF7072C5C7E47'],
  ['bessfs','Rangan A et al. BESS/BOA patient care pathways: frozen shoulder. Shoulder Elbow 2015;7:299–307 (2.4 per 1,000 a year; 10–36% with diabetes; 59% full recovery at 4.4 years)','https://boa.ac.uk/asset/221D74D9-2DB0-40C6-AE113E5B1BEF68E5'],
  ['hermans','Hermans J et al. Does this patient with shoulder pain have rotator cuff disease? JAMA Rational Clinical Examination 2013;310:837–47 (painful arc LR+ 3.7, LR− 0.36; drop arm LR+ 3.3)','https://repub.eur.nl/pub/41413'],
  ['chrono','Chronopoulos E et al. Diagnostic value of physical tests for isolated chronic acromioclavicular lesions. Am J Sports Med 2004;32:655–61 (cross-body adduction sensitivity 77%)','https://read.qxmd.com/read/15090381/diagnostic-value-of-physical-tests-for-isolated-chronic-acromioclavicular-lesions'],
  ['kimcalc','Kim MS et al. Diagnosis and treatment of calcific tendinitis of the shoulder. Clin Shoulder Elb 2020;23:210–6','https://www.cisejournal.org/journal/view.php?number=782'],
  ['robinson','Robinson CM et al. Functional outcome and risk of recurrent instability after primary traumatic anterior shoulder dislocation in young patients. J Bone Joint Surg Am 2006;88:2326–36 (55.7% unstable within 2 years)','https://www.orthobullets.com/evidence/17079387'],
  ['pmr2012','Dasgupta B et al. 2012 provisional classification criteria for polymyalgia rheumatica (EULAR/ACR): age 50+, both shoulders, raised CRP/ESR; score 4+ sensitivity 68%, specificity 78%','https://scholars.aku.edu/en/publications/2012-provisional-classification-criteria-for-polymyalgia-rheumati-2/']
);
const ONSETS = [
  ['on_gradual',L('Slowly, with no clear reason','धीरे-धीरे, बिना किसी साफ़ वजह के')],
  ['on_overhead',L('Overhead work, painting, throwing, swimming or gym','सिर के ऊपर हाथ करके काम, पेंटिंग, फेंकना, तैरना या जिम')],
  ['on_lift',L('Lifting or pulling something heavy','कुछ भारी उठाना या खींचना')],
  ['on_fall',L('A fall onto the shoulder or an outstretched hand','कंधे पर या फैले हाथ पर गिरना')],
  ['on_jerk',L('A sudden jerk of the arm (bus handle, dog lead, catching something)','बांह को अचानक झटका (बस का हैंडल, कुत्ते का पट्टा, कुछ पकड़ना)')],
  ['on_twist',L('Sport: cricket, badminton, volleyball, wrestling','खेल: क्रिकेट, बैडमिंटन, वॉलीबॉल, कुश्ती')],
  ['on_woke',L('Woke up with it','सुबह उठे तो दर्द था')],
  ['on_accident',L('Road accident','सड़क दुर्घटना')]
];
const PAT = {
  char:[
    ['ch_night_lie',L('Pain at night, worse lying on that shoulder','रात में दर्द, उस कंधे पर लेटने से ज़्यादा')],
    ['ch_stiff_all',L('The shoulder has become stiff: hard to comb hair, put on a shirt or reach the back pocket','कंधा जकड़ गया है: बाल बनाना, कमीज़ पहनना या पीछे की जेब तक हाथ ले जाना मुश्किल')],
    ['ch_weak_lift',L('The arm feels weak or heavy when lifting it; it gives way','बांह उठाते समय कमज़ोर या भारी लगती है; बीच में गिर जाती है')],
    ['ch_sudden_severe',L('Sudden, very severe pain that came on in hours, without an injury','अचानक कुछ घंटों में शुरू हुआ बहुत तेज़ दर्द, बिना चोट के')],
    ['ch_click',L('Grinding, clicking or catching inside the shoulder','कंधे के अंदर किरकिराहट, क्लिक या अटकना')],
    ['ch_unstable',L('The shoulder feels loose, slips, or has come out of place before','कंधा ढीला लगता है, खिसकता है, या पहले उतर चुका है')],
    ['ch_tingle',L('Tingling or numbness running down the arm into the fingers','बांह से उंगलियों तक झुनझुनी या सुन्नपन')],
    ['ch_girdle',L('Both shoulders (and often hips) stiff and aching for more than 45 minutes every morning','दोनों कंधे (और अक्सर कूल्हे) हर सुबह 45 मिनट से ज़्यादा जकड़े और दुखते हैं')]
  ],
  worse:[
    ['w_overhead',L('Lifting the arm up or reaching to a high shelf','बांह ऊपर उठाना या ऊंची शेल्फ़ तक पहुंचना')],
    ['w_behind',L('Reaching behind the back (tucking in a shirt, fastening a bra)','पीठ के पीछे हाथ ले जाना (कमीज़ अंदर करना, ब्रा का हुक लगाना)')],
    ['w_across',L('Reaching across the body (seat belt, washing the other armpit)','शरीर के आर-पार हाथ ले जाना (सीट बेल्ट, दूसरी बगल धोना)')],
    ['w_neck',L('Moving or bending the neck','गर्दन हिलाना या झुकाना')]
  ],
  better:[['b_rest',L('Rest, keeping the arm still','आराम, बांह को स्थिर रखना')]],
  other:[
    ['o_neck_pain',L('Neck pain as well','साथ में गर्दन दर्द भी')],
    ['o_shoulder_ok',L('Moving the shoulder itself does not change the pain','कंधा हिलाने से दर्द पर कोई असर नहीं पड़ता')],
    ['o_meal',L('Right shoulder-tip pain with upper-belly pain, often after fatty meals','दाएं कंधे के सिरे पर दर्द के साथ पेट के ऊपरी हिस्से में दर्द, अक्सर तला-भुना खाने के बाद')]
  ]
};
const RFS = [
  ['rf_hot',L('The shoulder is hot, red and swollen, or you have a fever with the pain','कंधा गर्म, लाल और सूजा है, या दर्द के साथ बुखार है')],
  ['rf_deform',L('After a fall or injury the shoulder looks out of shape, or you cannot move the arm at all','गिरने या चोट के बाद कंधे का आकार बदला दिखता है, या बांह बिल्कुल नहीं हिला पाते')],
  ['rf_cardiac',L('Shoulder, arm or jaw pain with chest pressure, sweating or breathlessness','कंधे, बांह या जबड़े में दर्द के साथ सीने में दबाव, पसीना या सांस फूलना')],
  ['rf_sudden_weak',L('Sudden loss of the ability to lift the arm after an injury or a jerk','चोट या झटके के बाद अचानक बांह उठाने की ताकत चली जाना')],
  ['rf_mass',L('A new lump or swelling in the shoulder or armpit','कंधे या बगल में नई गांठ या सूजन')],
  ['rf_fever',L('Fever, night sweats or weight loss without trying','बुखार, रात को पसीना या बिना कोशिश वज़न घटना')],
  ['rf_night',L('Constant pain at night that no position eases','रात को लगातार दर्द जो किसी भी पोज़िशन में कम न हो')]
];
const VIEWS = {
  sh_top:{az:0.55,el:0.55,d:1.05,yk:'sh',dy:0,tx:0.12}, sh_front:{az:0.45,el:0.12,d:1.05,yk:'sh',dy:-0.05,tx:0.12},
  sh_side:{az:1.35,el:0.12,d:1.15,yk:'sh',dy:-0.08,tx:0.12}, sh_back:{az:2.6,el:0.15,d:1.05,yk:'sh',dy:-0.05,tx:0.12},
  neck:{az:PI,el:0.12,d:1.15,yk:'c4',dy:-0.01}, forearm:{az:0.5,el:0.12,d:1.35,yk:'wrist',dy:0.04,tx:0.2}
};
const AREAS = [
  {id:'sh_top',pair:true,view:'sh_top',name:L('Top of the shoulder','कंधे का ऊपरी हिस्सा'),desc:L('The bony point on top of the shoulder where the collarbone ends (the AC joint).','कंधे के ऊपर की हड्डी वाली जगह जहाँ कॉलरबोन खत्म होती है (AC जोड़)।'),rel:L('Pain pinpointed here, worse reaching across the body, points to the AC joint.','यहीं पर दर्द, जो शरीर के आर-पार हाथ ले जाने पर बढ़े, AC जोड़ की ओर इशारा करता है।')},
  {id:'sh_front',pair:true,view:'sh_front',name:L('Front of the shoulder','कंधे का अगला हिस्सा'),desc:L('The front of the shoulder joint, below the collarbone.','कॉलरबोन के नीचे, कंधे के जोड़ का अगला हिस्सा।'),rel:L('Front pain is common with rotator cuff and biceps tendon problems and with frozen shoulder.','अगले हिस्से का दर्द रोटेटर कफ, बाइसेप्स टेंडन की समस्या और फ्रोज़न शोल्डर में आम है।')},
  {id:'sh_side',pair:true,view:'sh_side',name:L('Outer side of the shoulder and upper arm','कंधे और ऊपरी बांह का बाहरी हिस्सा'),desc:L('The rounded outer part of the shoulder, down to the middle of the upper arm.','कंधे का गोल बाहरी हिस्सा, ऊपरी बांह के बीच तक।'),rel:L('Pain here is typical of the rotator cuff (subacromial pain), even though the problem is inside the joint.','यहाँ का दर्द रोटेटर कफ (सबएक्रोमियल दर्द) का खास लक्षण है, भले ही समस्या जोड़ के अंदर हो।')},
  {id:'sh_back',pair:true,view:'sh_back',name:L('Back of the shoulder','कंधे का पिछला हिस्सा'),desc:L('The back of the shoulder joint, above the shoulder blade.','कंधे की हड्डी के ऊपर, कंधे के जोड़ का पिछला हिस्सा।'),rel:L('Back-of-shoulder pain can come from the joint, the cuff or the neck.','पीछे का दर्द जोड़, रोटेटर कफ या गर्दन से आ सकता है।')},
  {id:'neck',pair:false,view:'neck',name:L('Neck','गर्दन'),desc:L('From the base of the skull down to the top of the shoulders.','खोपड़ी के निचले हिस्से से कंधों के ऊपर तक।'),rel:L('Neck pain with shoulder pain raises the chance that the pain comes from the neck.','कंधे के दर्द के साथ गर्दन दर्द हो तो दर्द के गर्दन से आने की संभावना बढ़ती है।')},
  {id:'forearm',pair:true,view:'forearm',regs:['c6','c7','c8'],name:L('Forearm, hand or fingers','अग्रबाहु, हाथ या उंगलियाँ'),desc:L('Pain, tingling or numbness below the elbow.','कोहनी के नीचे दर्द, झुनझुनी या सुन्नपन।'),rel:L('Symptoms below the elbow usually come from a nerve in the neck rather than the shoulder.','कोहनी के नीचे के लक्षण आमतौर पर कंधे के बजाय गर्दन की नस से आते हैं।')}
];
const TESTS = [
  {id:'arc',name:L('Painful arc (lift the arm sideways)','दर्द वाला चाप (बांह साइड से उठाना)'),
   steps:[L('Stand up straight. With the thumb pointing up, slowly lift the painful arm out to the side as high as it will go.','सीधे खड़े हों। अंगूठा ऊपर रखते हुए दर्द वाली बांह को साइड से धीरे-धीरे जितना हो सके ऊपर उठाएं।'),L('Lower it slowly. Notice where in the movement it hurts.','धीरे-धीरे नीचे लाएं। ध्यान दें कि हरकत में कहाँ दर्द होता है।')],
   pos:L('Pain mainly in the middle of the movement (roughly between shoulder height and two-thirds of the way up), easing as the arm goes higher or lower.','दर्द मुख्य रूप से हरकत के बीच में (लगभग कंधे की ऊंचाई से दो-तिहाई ऊपर तक), और बांह ज़्यादा ऊपर या नीचे जाने पर कम।'),
   acc:L('A painful arc makes rotator cuff disease about 3.7 times more likely; no painful arc lowers the chance (likelihood ratio 0.36).','दर्द वाला चाप रोटेटर कफ की समस्या की संभावना लगभग 3.7 गुना करता है; चाप में दर्द न हो तो संभावना घटती है (लाइकलीहुड रेशियो 0.36)।'),src:'hermans',ans:[['arc_pos','tPos','y'],['arc_neg','tNeg','n'],['arc_skip','tSkip','s']]},
  {id:'drop',name:L('Slow lowering (drop arm) test','धीरे से नीचे लाने का (ड्रॉप आर्म) टेस्ट'),
   steps:[L('Lift the painful arm out to the side to shoulder height (use the other hand to help if needed).','दर्द वाली बांह को साइड से कंधे की ऊंचाई तक उठाएं (ज़रूरत हो तो दूसरे हाथ की मदद लें)।'),L('Let go and lower it as slowly and smoothly as you can.','छोड़ दें और जितना हो सके धीरे और आराम से नीचे लाएं।')],
   pos:L('The arm suddenly drops, or you cannot lower it smoothly.','बांह अचानक गिर जाए, या आप उसे आराम से नीचे न ला सकें।'),
   acc:L('A positive drop arm test makes a rotator cuff problem about 3.3 times more likely (wide uncertainty), often a tear.','पॉज़िटिव ड्रॉप आर्म टेस्ट रोटेटर कफ की समस्या, अक्सर फटन, की संभावना लगभग 3.3 गुना करता है (अनिश्चितता ज़्यादा)।'),src:'hermans',ans:[['drop_pos','tPos','y'],['drop_neg','tNeg','n'],['drop_skip','tSkip','s']]},
  {id:'erom',name:L('Turning out both forearms (stiffness check)','दोनों अग्रबाहु बाहर घुमाना (जकड़न की जांच)'),
   steps:[L('Stand with both elbows tucked into your sides and bent at a right angle, palms facing each other.','दोनों कोहनियाँ शरीर से सटाकर समकोण पर मोड़ें, हथेलियाँ आमने-सामने।'),L('Keeping the elbows at your sides, turn both forearms outward like opening a book. Compare the two sides.','कोहनियाँ शरीर से सटी रखते हुए दोनों अग्रबाहु किताब खोलने की तरह बाहर घुमाएं। दोनों तरफ़ की तुलना करें।')],
   pos:L('The painful side turns out much less, about half or less of the other side, even when you help it with the other hand.','दर्द वाली तरफ़ बहुत कम बाहर घूमे, दूसरी तरफ़ का लगभग आधा या उससे कम, दूसरे हाथ से मदद करने पर भी।'),
   acc:L('Losing outward turning more than other movements, with a normal X-ray, is the hallmark of frozen shoulder.','दूसरी हरकतों से ज़्यादा बाहर घुमाने की क्षमता खोना, सामान्य एक्स-रे के साथ, फ्रोज़न शोल्डर की पहचान है।'),src:'bessfs',ans:[['erom_lim','tPos','y'],['erom_ok','tNeg','n'],['erom_skip','tSkip','s']]},
  {id:'xbody',name:L('Reach across the chest','छाती के आर-पार हाथ ले जाना'),
   steps:[L('Lift the painful arm to the front at shoulder height.','दर्द वाली बांह को आगे कंधे की ऊंचाई तक उठाएं।'),L('Move it across your chest towards the other shoulder, and gently press the elbow further with the other hand.','उसे छाती के आर-पार दूसरे कंधे की ओर ले जाएं, और दूसरे हाथ से कोहनी को हल्का और दबाएं।')],
   pos:L('Sharp pain on the very top of the shoulder.','कंधे के बिल्कुल ऊपर तेज़ दर्द।'),
   acc:L('Picks up about 77% of AC joint problems, but many positives come from other causes, so it is read with where the pain is.','लगभग 77% AC जोड़ की समस्याएं पकड़ता है, पर कई पॉज़िटिव दूसरे कारणों से भी आते हैं, इसलिए दर्द की जगह के साथ देखा जाता है।'),src:'chrono',ans:[['xbody_pos','tPos','y'],['xbody_neg','tNeg','n'],['xbody_skip','tSkip','s']]}
];
const D = C.DEPTS;
D.cardio = D.cardio || {n:L('Cardiology','कार्डियोलॉजी'),s:L('Heart specialist; heart pain can be felt in the neck, jaw, arm or back.','दिल के विशेषज्ञ; दिल का दर्द गर्दन, जबड़े, बांह या पीठ में भी महसूस हो सकता है।'),q:'cardiologist'};
D.medicine = D.medicine || {n:L('General medicine / Internal medicine','जनरल मेडिसिन / इंटरनल मेडिसिन'),s:L('Whole-body causes: blood tests, infections, diabetes, gallbladder and liver.','पूरे शरीर से जुड़े कारण: ब्लड टेस्ट, इन्फेक्शन, डायबिटीज़, पित्ताशय और लिवर।'),q:'physician'};
const CONDS = [
  {id:'rcrsp',th:[10,7,4],anchor:['arc_pos','w_overhead','sh_side'],depts:['ortho','physio'],
   name:L('Rotator cuff pain (subacromial pain, “impingement”)','रोटेटर कफ का दर्द (सबएक्रोमियल दर्द, “इम्पिंजमेंट”)'),sci:'Rotator cuff related shoulder pain · subacromial pain syndrome',
   what:L('The rotator cuff is a group of four tendons that hold the ball of the shoulder in its socket. When they are overloaded or worn they become painful, felt on the top and outer side of the shoulder and upper arm, especially when lifting the arm and at night. The shoulder usually still moves fully if someone else moves it.','रोटेटर कफ चार टेंडन का समूह है जो कंधे की गेंद को उसके सॉकेट में थामे रखता है। ज़्यादा भार या घिसावट से ये दर्द करने लगते हैं, जो कंधे के ऊपर और बाहर तथा ऊपरी बांह में महसूस होता है, खासकर बांह उठाते समय और रात में। कोई और कंधा हिलाए तो आमतौर पर पूरा हिलता है।'),
   causes:L('Overhead work or sport, a sudden rise in activity, age-related tendon wear and poor shoulder-blade control. It is the cause of up to 70% of new shoulder pain and is most common between 35 and 75.','सिर के ऊपर हाथ करके काम या खेल, अचानक बढ़ी गतिविधि, उम्र से टेंडन की घिसावट और कंधे की हड्डी पर कमज़ोर नियंत्रण। नए कंधे दर्द के 70% तक मामलों का कारण यही है और यह 35 से 75 की उम्र में सबसे आम है।'),cSrc:['besssap'],
   confirm:L('Shoulder examination; ultrasound or MRI only if a tear is suspected or the pain does not settle. Many people without pain also have tendon changes on scans.','कंधे की जांच; फटन का शक हो या दर्द न सुधरे तभी अल्ट्रासाउंड या MRI। बिना दर्द वाले कई लोगों के स्कैन में भी टेंडन में बदलाव दिखते हैं।'),
   treat:L('Advice, pain relief and a structured exercise programme with a physiotherapist for at least 6 weeks; one steroid injection can help you exercise. Surgery only if pain and loss of function persist after proper non-surgical treatment.','सलाह, दर्द की दवा और फिज़ियोथेरेपिस्ट के साथ कम से कम 6 हफ्ते का व्यवस्थित व्यायाम; एक स्टेरॉयड इंजेक्शन व्यायाम में मदद कर सकता है। सही गैर-सर्जिकल इलाज के बाद भी दर्द और काम में दिक्कत रहे तभी सर्जरी।'),
   outlook:L('Most people improve with exercise over weeks to months; guidelines advise at least 6 weeks of physiotherapy before considering referral to a surgeon.','ज़्यादातर लोग व्यायाम से कुछ हफ्तों से महीनों में सुधरते हैं; दिशानिर्देश सर्जन के पास भेजने से पहले कम से कम 6 हफ्ते फिज़ियोथेरेपी की सलाह देते हैं।'),oSrc:['besssap'],
   w:{sh_side:3,sh_front:1,sh_top:1,w_overhead:3,ch_night_lie:2,arc_pos:2,arc_neg:-2,drop_pos:1,on_overhead:2,on_gradual:1,r_heavy:1,a_30_39:1,a_40_49:2,a_50_59:2,a_60p:1,
      erom_lim:-3,ch_stiff_all:-1,ch_unstable:-1,ch_tingle:-2,forearm:-2,o_shoulder_ok:-4,ch_girdle:-2}},
  {id:'rctear',th:[11,8,5],anchor:['ch_weak_lift','drop_pos','rf_sudden_weak'],depts:['ortho','physio'],
   name:L('Rotator cuff tear','रोटेटर कफ का फटना'),sci:'Full-thickness or partial rotator cuff tear',
   what:L('One or more cuff tendons tear away from the bone, either suddenly after a fall or jerk, or slowly from wear after 50. The arm feels weak and may drop when lowered, with pain at night.','एक या ज़्यादा कफ टेंडन हड्डी से फट जाते हैं, या तो गिरने या झटके के बाद अचानक, या 50 के बाद घिसावट से धीरे-धीरे। बांह कमज़ोर लगती है, नीचे लाते समय गिर सकती है, और रात में दर्द होता है।'),
   causes:L('Age-related tendon wear (common after 60), a fall on the outstretched arm, a sudden heavy pull, or a dislocation in someone over 40.','उम्र से टेंडन की घिसावट (60 के बाद आम), फैले हाथ पर गिरना, अचानक भारी खिंचाव, या 40 से ज़्यादा उम्र में कंधा उतरना।'),cSrc:['besssap','hermans'],
   confirm:L('Examination of strength (lag signs are the most accurate bedside tests for a full tear) and an ultrasound or MRI scan.','ताकत की जांच (पूरी फटन के लिए लैग साइन सबसे सटीक बेडसाइड टेस्ट हैं) और अल्ट्रासाउंड या MRI स्कैन।'),
   treat:L('Exercise therapy for many wear-related tears; repair surgery is considered for a sudden (traumatic) tear in an active person, ideally within weeks.','घिसावट वाली कई फटन में व्यायाम थेरेपी; सक्रिय व्यक्ति में अचानक (चोट वाली) फटन की मरम्मत सर्जरी पर विचार होता है, बेहतर हो कि कुछ हफ्तों में।'),
   outlook:L('A sudden loss of lifting after an injury should be seen urgently, because early repair gives the best results.','चोट के बाद अचानक बांह उठाने की ताकत जाना हो तो जल्दी दिखाएं, क्योंकि जल्दी मरम्मत के सबसे अच्छे नतीजे होते हैं।'),oSrc:['besssap'],
   w:{ch_weak_lift:3,drop_pos:2,arc_pos:1,rf_sudden_weak:4,sh_side:2,ch_night_lie:1,on_fall:2,on_jerk:2,on_lift:1,a_40_49:1,a_50_59:2,a_60p:3,a_u18:-3,a_18_29:-2,erom_lim:-1,ch_tingle:-1,o_shoulder_ok:-3}},
  {id:'frozen',th:[10,7,4],anchor:['erom_lim','ch_stiff_all'],depts:['ortho','physio',{id:'medicine',when:'r_immune'}],
   name:L('Frozen shoulder (adhesive capsulitis)','फ्रोज़न शोल्डर (एडहेसिव कैप्सुलाइटिस)'),sci:'Adhesive capsulitis of the shoulder',
   what:L('The lining (capsule) of the shoulder joint becomes inflamed, thickened and tight. It starts with pain, often at night, then the shoulder stiffens so that turning the arm outward and reaching behind the back become very limited, and finally it slowly loosens.','कंधे के जोड़ की झिल्ली (कैप्सूल) में सूजन आती है, वह मोटी और कसी हो जाती है। शुरू में दर्द, अक्सर रात में, फिर कंधा जकड़ जाता है जिससे बांह बाहर घुमाना और पीठ के पीछे हाथ ले जाना बहुत सीमित हो जाता है, और आखिर में धीरे-धीरे खुलता है।'),
   causes:L('Often no clear cause. It is linked with diabetes (10–36% of people with diabetes), thyroid disease, and a period of not moving the arm after an injury or operation. Most common between 40 and 60, more in women.','अक्सर कोई साफ़ कारण नहीं। यह डायबिटीज़ (डायबिटीज़ वाले 10–36% लोगों में), थायरॉइड और चोट या ऑपरेशन के बाद बांह न हिलाने से जुड़ा है। 40 से 60 की उम्र में सबसे आम, महिलाओं में ज़्यादा।'),cSrc:['bessfs'],
   confirm:L('Examination showing that outward turning is lost more than other movements, with a normal X-ray (to rule out arthritis or an old dislocation).','जांच जिसमें दूसरी हरकतों से ज़्यादा बाहर घुमाना कम हो, और सामान्य एक्स-रे (गठिया या पुराना उतरा कंधा खारिज करने के लिए)।'),
   treat:L('Pain relief, a steroid injection into the joint, and home exercises with physiotherapy; if severe symptoms persist after about 3 months, hydrodilatation, manipulation under anaesthesia or keyhole release. Good diabetes control matters.','दर्द की दवा, जोड़ में स्टेरॉयड इंजेक्शन, और फिज़ियोथेरेपी के साथ घर पर व्यायाम; लगभग 3 महीने बाद भी तेज़ लक्षण रहें तो हाइड्रोडाइलेटेशन, बेहोशी में मैनिपुलेशन या की-होल रिलीज़। डायबिटीज़ का अच्छा नियंत्रण ज़रूरी।'),
   outlook:L('It passes through a painful phase (2–9 months), a stiff phase (4–12 months) and a thawing phase (12–42 months). At about 4 years, 59% have fully recovered, 35% have mild to moderate symptoms and 6% severe ones; people with diabetes respond less well.','यह दर्द वाले चरण (2–9 महीने), जकड़न वाले चरण (4–12 महीने) और खुलने वाले चरण (12–42 महीने) से गुज़रता है। लगभग 4 साल बाद 59% पूरी तरह ठीक, 35% में हल्के से मध्यम और 6% में तेज़ लक्षण रहते हैं; डायबिटीज़ वालों में सुधार कम होता है।'),oSrc:['bessfs'],
   w:{erom_lim:4,ch_stiff_all:3,w_behind:2,ch_night_lie:2,r_immune:3,a_40_49:2,a_50_59:2,sex_f:1,on_gradual:2,d_6_12:1,d_3m:1,sh_front:1,sh_side:1,
      a_u18:-3,a_18_29:-2,erom_ok:-3,ch_unstable:-2,ch_tingle:-1,o_shoulder_ok:-4}},
  {id:'calcific',th:[8,6,4],anchor:['ch_sudden_severe'],depts:['ortho','physio'],
   name:L('Calcific tendinitis (calcium in a cuff tendon)','कैल्सिफ़िक टेंडिनाइटिस (कफ टेंडन में कैल्शियम)'),sci:'Calcific tendinopathy of the rotator cuff',
   what:L('A chalky calcium deposit forms inside a cuff tendon, most often the supraspinatus. When the body starts to clear it, it can cause sudden, very severe pain, worse at night, so that the arm can hardly be moved.','कफ टेंडन के अंदर, ज़्यादातर सुप्रास्पाइनेटस में, चॉक जैसा कैल्शियम जमा हो जाता है। जब शरीर इसे साफ़ करना शुरू करता है तो अचानक बहुत तेज़ दर्द हो सकता है, रात में ज़्यादा, और बांह मुश्किल से हिलती है।'),
   causes:L('Not fully understood. Most common between 30 and 50 and about twice as common in women.','पूरी तरह समझा नहीं गया। 30 से 50 की उम्र में सबसे आम और महिलाओं में लगभग दोगुना।'),cSrc:['kimcalc'],
   confirm:L('An X-ray or ultrasound shows the deposit.','एक्स-रे या अल्ट्रासाउंड में जमाव दिखता है।'),
   treat:L('Pain relief, ice, a steroid injection; ultrasound-guided needling (barbotage) or shock-wave therapy if it persists; surgery is rarely needed.','दर्द की दवा, बर्फ़, स्टेरॉयड इंजेक्शन; बना रहे तो अल्ट्रासाउंड से सुई द्वारा निकालना (बारबोटाज) या शॉक-वेव थेरेपी; सर्जरी कम ही चाहिए।'),
   outlook:L('The condition usually settles on its own; non-surgical treatment succeeds in 30–80% and about 70% are satisfied after needling.','आमतौर पर अपने आप ठीक हो जाता है; गैर-सर्जिकल इलाज 30–80% में सफल और सुई से निकालने के बाद लगभग 70% संतुष्ट।'),oSrc:['kimcalc'],
   w:{ch_sudden_severe:4,pain_high:1,ch_night_lie:1,sh_side:2,sh_front:1,a_30_39:1,a_40_49:2,a_50_59:1,sex_f:1,d_days:2,on_gradual:1,on_woke:1,on_fall:-2,a_60p:-1,erom_lim:-1}},
  {id:'acj',th:[8,6,4],anchor:['sh_top','xbody_pos'],depts:['ortho','physio'],
   name:L('AC joint pain (top of the shoulder)','AC जोड़ का दर्द (कंधे का ऊपरी हिस्सा)'),sci:'Acromioclavicular joint arthritis or sprain',
   what:L('The small joint where the collarbone meets the tip of the shoulder blade becomes worn or sprained. Pain is pinpointed on top of the shoulder and is worse reaching across the body or lying on that side.','वह छोटा जोड़ जहाँ कॉलरबोन कंधे की हड्डी के सिरे से मिलती है, घिस जाता है या उसमें मोच आती है। दर्द कंधे के ठीक ऊपर होता है और शरीर के आर-पार हाथ ले जाने या उस तरफ़ लेटने पर बढ़ता है।'),
   causes:L('A fall on the point of the shoulder, heavy weight training (bench press, push-ups), manual work and age-related wear.','कंधे के सिरे पर गिरना, भारी वज़न की ट्रेनिंग (बेंच प्रेस, पुश-अप), मेहनत वाला काम और उम्र से घिसावट।'),
   confirm:L('Tenderness over the joint, the cross-body test, an X-ray; a local anaesthetic injection into the joint can confirm it.','जोड़ पर दबाने से दर्द, क्रॉस-बॉडी टेस्ट, एक्स-रे; जोड़ में सुन्न करने वाला इंजेक्शन पुष्टि कर सकता है।'),cSrc:['chrono'],
   treat:L('Activity changes (avoid heavy pressing), pain relief, physiotherapy, an injection; rarely, surgery to remove the end of the collarbone.','गतिविधि में बदलाव (भारी पुशिंग से बचें), दर्द की दवा, फिज़ियोथेरेपी, इंजेक्शन; कभी-कभी कॉलरबोन का सिरा निकालने की सर्जरी।'),
   outlook:L('Usually settles with these measures.','आमतौर पर इन उपायों से ठीक हो जाता है।'),
   w:{sh_top:3,xbody_pos:2,xbody_neg:-1,w_across:2,r_heavy:1,on_fall:1,on_lift:1,a_30_39:1,a_40_49:1,a_50_59:1,sh_side:-1,erom_lim:-1,ch_tingle:-1}},
  {id:'instab',th:[8,6,4],anchor:['ch_unstable'],depts:['ortho','physio'],
   name:L('Shoulder instability (dislocating or loose shoulder)','कंधे की अस्थिरता (उतरने वाला या ढीला कंधा)'),sci:'Glenohumeral instability',
   what:L('After a dislocation, or because the joint is naturally loose, the ball of the shoulder slips partly or fully out of the socket, often with the arm up and turned out (throwing position).','कंधा उतरने के बाद, या जोड़ के स्वाभाविक ढीलेपन से, कंधे की गेंद सॉकेट से आंशिक या पूरी खिसक जाती है, अक्सर बांह ऊपर और बाहर मुड़ी होने पर (फेंकने की स्थिति)।'),
   causes:L('A first dislocation from a fall or sport, especially in young men; loose joints (hypermobility).','गिरने या खेल से पहली बार कंधा उतरना, खासकर युवा पुरुषों में; ढीले जोड़ (हाइपरमोबिलिटी)।'),
   confirm:L('Examination by a doctor (apprehension tests should only be done by them), X-rays and an MRI scan.','डॉक्टर द्वारा जांच (एप्रिहेंशन टेस्ट सिर्फ़ डॉक्टर करें), एक्स-रे और MRI स्कैन।'),
   treat:L('Physiotherapy to strengthen the muscles around the joint; stabilising surgery for repeated dislocations, especially in young athletes.','जोड़ के आसपास की मांसपेशियाँ मज़बूत करने के लिए फिज़ियोथेरेपी; बार-बार उतरने पर, खासकर युवा खिलाड़ियों में, स्थिर करने की सर्जरी।'),
   outlook:L('In people aged 15–35 after a first dislocation, 55.7% become unstable again within 2 years, young men most often.','15–35 उम्र में पहली बार कंधा उतरने के बाद 55.7% का कंधा 2 साल के अंदर फिर अस्थिर होता है, सबसे ज़्यादा युवा पुरुषों में।'),oSrc:['robinson'],
   w:{ch_unstable:5,ch_click:1,a_u18:2,a_18_29:2,a_30_39:1,sex_m:1,on_fall:1,on_twist:1,a_60p:-2,erom_lim:-2,ch_stiff_all:-1}},
  {id:'shoa',th:[9,6,4],anchor:['ch_click','ch_stiff_all'],depts:['ortho','physio'],
   name:L('Shoulder arthritis (glenohumeral osteoarthritis)','कंधे की गठिया (ग्लेनोह्यूमरल ऑस्टियोआर्थराइटिस)'),sci:'Glenohumeral osteoarthritis',
   what:L('The cartilage of the ball-and-socket joint wears away, causing deep aching, grinding and gradual stiffness in all directions.','गेंद-सॉकेट जोड़ की कार्टिलेज घिस जाती है, जिससे गहरा दर्द, किरकिराहट और हर दिशा में धीरे-धीरे जकड़न होती है।'),
   causes:L('Age (mostly over 60), old injuries or dislocations, long-standing cuff tears and inflammatory arthritis.','उम्र (ज़्यादातर 60 से ऊपर), पुरानी चोट या उतरा कंधा, लंबे समय की कफ फटन और सूजन वाली गठिया।'),cSrc:['besssap'],
   confirm:L('Examination and an X-ray showing joint-space narrowing.','जांच और एक्स-रे जिसमें जोड़ की जगह कम दिखे।'),
   treat:L('Exercise, pain relief, injections; shoulder replacement when pain and stiffness limit daily life.','व्यायाम, दर्द की दवा, इंजेक्शन; दर्द और जकड़न रोज़मर्रा का काम रोकें तो कंधा बदलवाना (रिप्लेसमेंट)।'),
   outlook:L('Slowly progressive; replacement gives good pain relief when needed.','धीरे-धीरे बढ़ता है; ज़रूरत हो तो रिप्लेसमेंट से अच्छा आराम मिलता है।'),
   w:{a_60p:3,a_50_59:1,ch_click:2,ch_stiff_all:2,erom_lim:1,on_gradual:2,d_3m:2,h_5y:1,h_1_5y:1,a_u18:-3,a_18_29:-3,a_30_39:-2,ch_unstable:-1,ch_sudden_severe:-2}},
  {id:'neckref',th:[8,6,4],anchor:['o_neck_pain','w_neck','ch_tingle','forearm'],depts:['ortho_spine','physio'],
   name:L('Pain coming from the neck','गर्दन से आने वाला दर्द'),sci:'Referred or radicular pain from the cervical spine',
   what:L('A pinched nerve root or worn joints in the neck can cause pain over the shoulder blade, the top and outer side of the shoulder and down the arm, while the shoulder joint itself is healthy.','गर्दन में दबी नस की जड़ या घिसे जोड़ कंधे की हड्डी, कंधे के ऊपर और बाहर तथा बांह में नीचे तक दर्द दे सकते हैं, जबकि कंधे का जोड़ खुद ठीक होता है।'),
   causes:L('Cervical spondylosis or a neck disc pressing the C5 or C6 nerve root.','सर्वाइकल स्पॉन्डिलोसिस या गर्दन की डिस्क का C5 या C6 नस की जड़ पर दबाव।'),
   confirm:L('Neck and nerve examination; use the neck section of this guide for a detailed check.','गर्दन और नसों की जांच; विस्तार से जांचने के लिए इस गाइड का गर्दन वाला हिस्सा इस्तेमाल करें।'),
   treat:L('Treatment of the neck problem (see the neck section).','गर्दन की समस्या का इलाज (गर्दन वाला हिस्सा देखें)।'),
   outlook:L('Most neck nerve pain improves within weeks to months.','गर्दन की नस का ज़्यादातर दर्द कुछ हफ्तों से महीनों में सुधरता है।'),
   w:{o_neck_pain:3,neck:2,w_neck:3,ch_tingle:3,forearm:3,o_shoulder_ok:4,arc_neg:1,erom_ok:1,w_overhead:-1,arc_pos:-1,erom_lim:-2,sh_top:-1}},
  {id:'pmr',th:[8,6,4],anchor:['ch_girdle'],onlyIf:{any:['a_50_59','a_60p']},depts:['rheum','medicine'],
   name:L('Polymyalgia rheumatica','पॉलीमायल्जिया रूमैटिका'),sci:'Polymyalgia rheumatica',
   what:L('An inflammatory condition after 50 that causes aching and long morning stiffness in both shoulders, often the hips and neck too, with tiredness.','50 के बाद की सूजन वाली बीमारी, जिसमें दोनों कंधों में और अक्सर कूल्हों और गर्दन में भी दर्द और सुबह की लंबी अकड़न होती है, साथ में थकान।'),
   causes:L('Unknown immune trigger. It is linked with giant cell arteritis: a new headache, scalp tenderness, jaw pain on chewing or any change in vision needs same-day care.','अज्ञात इम्यून कारण। यह जायंट सेल आर्टराइटिस से जुड़ा है: नया सिरदर्द, सिर की त्वचा दुखना, चबाने पर जबड़े में दर्द या नज़र में कोई बदलाव हो तो उसी दिन दिखाएं।'),
   confirm:L('Blood tests (ESR, CRP) and examination. Classification needs age 50 or over, pain in both shoulders and raised inflammation markers; with morning stiffness over 45 minutes and hip pain the score reaches the threshold (sensitivity 68%, specificity 78%).','ब्लड टेस्ट (ESR, CRP) और जांच। वर्गीकरण के लिए 50 या ज़्यादा उम्र, दोनों कंधों में दर्द और बढ़े सूजन के मार्कर ज़रूरी; 45 मिनट से ज़्यादा सुबह की अकड़न और कूल्हे के दर्द से स्कोर सीमा तक पहुंचता है (संवेदनशीलता 68%, विशिष्टता 78%)।'),cSrc:['pmr2012'],
   treat:L('Steroid tablets under close medical supervision, usually with a dramatic improvement within days.','करीबी डॉक्टरी निगरानी में स्टेरॉयड की गोलियाँ, आमतौर पर कुछ दिनों में बहुत अच्छा सुधार।'),
   outlook:L('Responds quickly to treatment, which often continues for 1–2 years.','इलाज से जल्दी सुधार, जो अक्सर 1–2 साल चलता है।'),
   w:{ch_girdle:5,sh_both:2,a_60p:2,a_50_59:1,neck:1,on_gradual:1,rf_fever:1,ch_unstable:-2,on_fall:-2}},
  {id:'visceral',th:[7,5,4],anchor:['o_meal'],depts:['medicine','gp'],
   name:L('Pain referred from the gallbladder, liver or diaphragm','पित्ताशय, लिवर या डायाफ्राम से आने वाला दर्द'),sci:'Referred visceral pain (right shoulder tip)',
   what:L('Organs under the right ribs share nerves with the shoulder tip, so gallbladder or liver problems can be felt there, usually with upper-belly pain.','दाईं पसलियों के नीचे के अंग कंधे के सिरे से नसें साझा करते हैं, इसलिए पित्ताशय या लिवर की समस्या वहाँ महसूस हो सकती है, आमतौर पर पेट के ऊपरी दर्द के साथ।'),
   causes:L('Gallstones, gallbladder inflammation, liver or diaphragm irritation.','पित्ते की पथरी, पित्ताशय की सूजन, लिवर या डायाफ्राम की जलन।'),
   confirm:L('Examination of the abdomen, blood tests and an abdominal ultrasound.','पेट की जांच, ब्लड टेस्ट और पेट का अल्ट्रासाउंड।'),
   treat:L('Treatment of the cause by a physician or surgeon.','फिज़िशियन या सर्जन द्वारा कारण का इलाज।'),
   outlook:L('Fever, yellow eyes or severe belly pain need same-day care.','बुखार, आंखें पीली होना या पेट में तेज़ दर्द हो तो उसी दिन दिखाएं।'),
   w:{o_meal:5,o_shoulder_ok:2,sh_top:1,rf_fever:1,arc_pos:-2,erom_lim:-2,w_overhead:-1}}
];
const EMERG = {
  septic:{name:L('Possible infected joint','जोड़ में इन्फेक्शन की आशंका'),sci:'Septic arthritis of the shoulder',
    what:L('A hot, red, swollen joint or pain with fever can be an infection inside the joint, which can destroy it within days. It needs same-day emergency assessment.','गर्म, लाल, सूजा जोड़ या बुखार के साथ दर्द जोड़ के अंदर इन्फेक्शन हो सकता है, जो कुछ दिनों में जोड़ खराब कर सकता है। उसी दिन इमरजेंसी जांच ज़रूरी।'),src:['besssap','bessfs'],depts:['emergency','ortho']},
  disloc:{name:L('Possible dislocation or fracture','कंधा उतरने या फ्रैक्चर की आशंका'),sci:'Unreduced dislocation · proximal humerus fracture',
    what:L('A shoulder that looks out of shape or cannot be moved after an injury may be dislocated or broken. Support the arm in a sling or against the body and go to the emergency department; do not let anyone pull on it.','चोट के बाद कंधे का आकार बदला दिखे या हिल न सके तो वह उतरा या टूटा हो सकता है। बांह को स्लिंग या शरीर से सटाकर सहारा दें और इमरजेंसी जाएं; किसी को खींचने न दें।'),src:['besssap'],depts:['emergency','ortho']},
  cardiac:{name:L('Possible heart attack','दिल के दौरे की आशंका'),sci:'Acute coronary syndrome',
    what:L('Heart pain can be felt in the shoulder, arm or jaw, with chest pressure, sweating or breathlessness. Call an ambulance; do not wait.','दिल का दर्द कंधे, बांह या जबड़े में भी महसूस हो सकता है, साथ में सीने में दबाव, पसीना या सांस फूलना। एम्बुलेंस बुलाएं; इंतज़ार न करें।'),src:['aha'],depts:['emergency','cardio']}
};
const RS = {
  o_sudden_weak:L('Sudden loss of lifting strength after an injury (possible acute cuff tear)','चोट के बाद अचानक बांह उठाने की ताकत जाना (अचानक कफ फटन की आशंका)'),
  o_mass:L('A new lump or swelling in the shoulder or armpit','कंधे या बगल में नई गांठ या सूजन'),
  o_fever:L('Fever, night sweats or weight loss with shoulder pain','कंधे के दर्द के साथ बुखार, रात को पसीना या वज़न घटना'),
  o_night:L('Constant night pain at age 50 or over','50 या ज़्यादा उम्र में रात का लगातार दर्द'),
  o_pain:L('Very severe pain (9–10 out of 10)','बहुत तेज़ दर्द (10 में 9–10)'),
  o_pmr:L('Both shoulders stiff every morning after age 50 (needs blood tests soon)','50 के बाद हर सुबह दोनों कंधों में जकड़न (जल्दी ब्लड टेस्ट ज़रूरी)'),
  y_weak:L('Weakness lifting the arm','बांह उठाने में कमज़ोरी'), y_stiff:L('Stiff shoulder: early treatment helps','जकड़ा कंधा: जल्दी इलाज से फ़ायदा'),
  y_unstable:L('The shoulder slips or has come out of place','कंधा खिसकता है या उतर चुका है'), y_long:L('This bout has lasted more than 6 weeks','इस बार का दर्द 6 हफ्ते से ज़्यादा से है'),
  y_pain:L('Strong pain (7–8 out of 10)','तेज़ दर्द (10 में 7–8)'), y_sleep:L('Pain disturbing sleep','दर्द से नींद खराब'),
  y_injury:L('Started after a fall, jerk or accident','गिरने, झटके या दुर्घटना के बाद शुरू'), y_sudden:L('Sudden severe pain without injury','बिना चोट के अचानक तेज़ दर्द'),
  y_neck:L('Tingling down the arm: the neck may be involved','बांह में नीचे तक झुनझुनी: गर्दन शामिल हो सकती है'), y_meal:L('Right shoulder-tip pain with belly pain','पेट दर्द के साथ दाएं कंधे के सिरे पर दर्द'),
  y_diab:L('Diabetes with a stiff shoulder','जकड़े कंधे के साथ डायबिटीज़')
};
const shAreas = ['sh_top','sh_front','sh_side','sh_back'];
const DERIVED = [
  {id:'pain_high', when:{painGte:8}},
  {id:'arm_weak', when:{any:['reach_no','dress_no']}}
];
const URGENCY = {
  orange:[
    {r:'o_sudden_weak', when:'rf_sudden_weak'}, {r:'o_mass', when:'rf_mass'}, {r:'o_fever', when:'rf_fever'},
    {r:'o_night', when:{all:['rf_night',{any:['age_ge50','r_cancer']}]}}, {r:'o_pain', when:{painGte:9}},
    {r:'o_pmr', when:{all:['ch_girdle',{any:['a_50_59','a_60p']}]}}
  ],
  yellow:[
    {r:'y_weak', when:{any:['ch_weak_lift','drop_pos']}}, {r:'y_stiff', when:{any:['erom_lim','ch_stiff_all']}}, {r:'y_unstable', when:'ch_unstable'},
    {r:'y_often', when:'btw_often'}, {r:'y_long', when:{any:['d_6_12','d_3m']}}, {r:'y_pain', when:{all:[{painGte:7},{not:{painGte:9}}]}},
    {r:'y_sleep', when:'sleep_bad'}, {r:'y_injury', when:{any:['on_fall','on_jerk','on_accident']}}, {r:'y_sudden', when:'ch_sudden_severe'},
    {r:'y_neck', when:{any:['ch_tingle','forearm']}}, {r:'y_meal', when:'o_meal'}, {r:'y_diab', when:{all:['r_immune',{any:['erom_lim','ch_stiff_all']}]}}
  ]
};
const EMERG_WHEN = {septic:'rf_hot', disloc:'rf_deform', cardiac:'rf_cardiac'};
const DEPT_RULES = [];
const FOCUS = {
  rcrsp:{bones:['scap','arm']}, rctear:{bones:['scap','arm']}, frozen:{bones:['scap','arm','clav']}, calcific:{bones:['arm']},
  acj:{bones:['clav','scap']}, instab:{bones:['arm','scap']}, shoa:{bones:['arm','scap']}, pmr:{bones:['scap','arm','pelvis']},
  neckref:{vert:['C5','C6'], roots:['C5','C6'], useSides:true}
};
const LBLX = {sh_one:L('One shoulder','एक कंधा'), sh_both:L('Both shoulders','दोनों कंधे'), pain_high:L('Severe pain (8 or more out of 10)','तेज़ दर्द (10 में 8 या ज़्यादा)'), arm_weak:L('Cannot reach up or dress','ऊपर हाथ नहीं जाता या कपड़े नहीं पहन पाते')};
const FX = {
  sh_side:L('Pain over the outer shoulder and upper arm is where the rotator cuff refers pain.','कंधे के बाहर और ऊपरी बांह में दर्द वहीं होता है जहाँ रोटेटर कफ दर्द भेजता है।'),
  sh_top:L('Pain pinpointed on top of the shoulder points to the AC joint.','कंधे के ठीक ऊपर दर्द AC जोड़ की ओर इशारा करता है।'),
  w_overhead:L('Pain lifting the arm overhead is typical of the rotator cuff.','बांह ऊपर उठाने पर दर्द रोटेटर कफ का खास लक्षण है।'),
  arc_pos:L('A painful arc makes rotator cuff disease about 3.7 times more likely.','दर्द वाला चाप रोटेटर कफ की समस्या की संभावना लगभग 3.7 गुना करता है।'),
  arc_neg:L('No painful arc makes rotator cuff disease less likely.','चाप में दर्द न होना रोटेटर कफ की संभावना कम करता है।'),
  drop_pos:L('An arm that drops when lowered suggests a cuff tear.','नीचे लाते समय गिरने वाली बांह कफ फटन का संकेत है।'),
  ch_weak_lift:L('Weakness lifting the arm suggests a torn cuff tendon.','बांह उठाने में कमज़ोरी फटे कफ टेंडन का संकेत है।'),
  erom_lim:L('Losing outward turning more than other movements is the hallmark of frozen shoulder.','दूसरी हरकतों से ज़्यादा बाहर घुमाने की क्षमता खोना फ्रोज़न शोल्डर की पहचान है।'),
  erom_ok:L('Normal outward turning makes frozen shoulder unlikely.','सामान्य बाहर घुमाना फ्रोज़न शोल्डर की संभावना कम करता है।'),
  ch_stiff_all:L('A shoulder that has become stiff for dressing and reaching suggests frozen shoulder or arthritis.','कपड़े पहनने और हाथ पहुंचाने में जकड़ा कंधा फ्रोज़न शोल्डर या गठिया का संकेत है।'),
  r_immune:L('Frozen shoulder affects 10–36% of people with diabetes.','डायबिटीज़ वाले 10–36% लोगों को फ्रोज़न शोल्डर होता है।'),
  w_behind:L('Difficulty reaching behind the back is typical of a tight capsule.','पीठ के पीछे हाथ ले जाने में दिक्कत कसे कैप्सूल का खास लक्षण है।'),
  ch_sudden_severe:L('Sudden severe pain without injury is typical of calcific tendinitis.','बिना चोट के अचानक तेज़ दर्द कैल्सिफ़िक टेंडिनाइटिस का खास लक्षण है।'),
  xbody_pos:L('Pain on top of the shoulder when reaching across points to the AC joint.','आर-पार हाथ ले जाने पर कंधे के ऊपर दर्द AC जोड़ की ओर इशारा करता है।'),
  w_across:L('Reaching across the body compresses the AC joint.','शरीर के आर-पार हाथ ले जाने से AC जोड़ दबता है।'),
  ch_unstable:L('A shoulder that slips or has dislocated points to instability.','खिसकने या उतरने वाला कंधा अस्थिरता की ओर इशारा करता है।'),
  ch_click:L('Grinding inside the joint is common with arthritis.','जोड़ के अंदर किरकिराहट गठिया में आम है।'),
  o_shoulder_ok:L('When moving the shoulder does not change the pain, the cause is often outside the shoulder (neck, heart, belly).','जब कंधा हिलाने से दर्द न बदले, तो कारण अक्सर कंधे के बाहर होता है (गर्दन, दिल, पेट)।'),
  ch_tingle:L('Tingling down the arm usually comes from a nerve in the neck.','बांह में नीचे तक झुनझुनी आमतौर पर गर्दन की नस से आती है।'),
  forearm:L('Symptoms below the elbow point to the neck rather than the shoulder.','कोहनी के नीचे लक्षण कंधे के बजाय गर्दन की ओर इशारा करते हैं।'),
  o_neck_pain:L('Neck pain with shoulder pain raises the chance of a neck cause.','कंधे के दर्द के साथ गर्दन दर्द गर्दन वाले कारण की संभावना बढ़ाता है।'),
  w_neck:L('Shoulder pain brought on by neck movement points to the neck.','गर्दन हिलाने से होने वाला कंधे का दर्द गर्दन की ओर इशारा करता है।'),
  ch_girdle:L('Long morning stiffness in both shoulders after 50 suggests polymyalgia rheumatica.','50 के बाद दोनों कंधों में सुबह की लंबी अकड़न पॉलीमायल्जिया रूमैटिका का संकेत है।'),
  o_meal:L('Right shoulder-tip pain with belly pain after meals suggests the gallbladder.','खाने के बाद पेट दर्द के साथ दाएं कंधे के सिरे पर दर्द पित्ताशय का संकेत है।'),
  ch_night_lie:L('Night pain lying on the shoulder is common with cuff problems and frozen shoulder.','कंधे पर लेटने से रात का दर्द कफ की समस्या और फ्रोज़न शोल्डर में आम है।'),
  on_overhead:L('Overhead work and sport overload the rotator cuff.','सिर के ऊपर का काम और खेल रोटेटर कफ पर भार डालते हैं।'),
  sh_both:L('Both shoulders together suggests a whole-body cause such as polymyalgia.','दोनों कंधे एक साथ होना पॉलीमायल्जिया जैसे पूरे शरीर के कारण का संकेत है।')
};
const STATS = [
  {v:'70%',t:L('of new shoulder pain comes from the rotator cuff','नए कंधे दर्द के मामले रोटेटर कफ से'),s:'besssap'},
  {v:'14%',t:L('of people have a shoulder complaint at any time','लोगों को किसी भी समय कंधे की शिकायत'),s:'besssap'},
  {v:'10–36%',t:L('of people with diabetes get a frozen shoulder','डायबिटीज़ वाले लोगों को फ्रोज़न शोल्डर'),s:'bessfs'},
  {v:'59%',t:L('fully recover from frozen shoulder at about 4 years; 6% keep severe symptoms','फ्रोज़न शोल्डर से लगभग 4 साल में पूरी तरह ठीक; 6% में तेज़ लक्षण रहते हैं'),s:'bessfs'},
  {v:'3.7×',t:L('more likely to be a cuff problem when the arc of lifting is painful','ज़्यादा संभावना कफ की समस्या की, जब बांह उठाने के चाप में दर्द हो'),s:'hermans'},
  {v:'55.7%',t:L('of young people dislocate again within 2 years of a first dislocation','युवाओं का कंधा पहली बार उतरने के 2 साल के अंदर फिर उतरता है'),s:'robinson'}
];
const UI = {
  repT:L('Shoulder pain assessment','कंधे के दर्द की जांच रिपोर्ट'), tag:L('Shoulder assessment','कंधे की जांच'),
  must:[L('This assessment cannot test your shoulder strength, the movement of the joint when someone else moves it, or the nerves of the arm, which together show the cause.','यह जांच आपके कंधे की ताकत, किसी और के हिलाने पर जोड़ की हरकत, या बांह की नसें नहीं परख सकती, जो मिलकर कारण बताती हैं।'),
    L('Only a doctor can decide whether you need an X-ray, ultrasound, MRI or blood tests, and interpret them with the examination.','एक्स-रे, अल्ट्रासाउंड, MRI या ब्लड टेस्ट की ज़रूरत है या नहीं, यह सिर्फ़ डॉक्टर तय कर सकते हैं और जांच के साथ उनका मतलब समझा सकते हैं।'),
    L('Shoulder pain can also come from the neck, the heart, the lungs or the gallbladder; a doctor examines these too.','कंधे का दर्द गर्दन, दिल, फेफड़ों या पित्ताशय से भी आ सकता है; डॉक्टर इनकी भी जांच करते हैं।'),
    L('Medicines, injections and exercise plans must be chosen for you personally.','दवाएं, इंजेक्शन और व्यायाम योजना आपके लिए व्यक्तिगत रूप से तय होनी चाहिए।')],
  tip1:L('Keep the arm gently moving within comfort; avoid heavy lifting and overhead work until you are examined.','आराम की सीमा में बांह को हल्का हिलाते रहें; जांच होने तक भारी वज़न उठाने और सिर के ऊपर हाथ करके काम से बचें।'),
  tip2:L('At night, a pillow under the painful arm helps; try not to lie on that side.','रात में दर्द वाली बांह के नीचे तकिया मदद करता है; उस तरफ़ लेटने से बचें।'),
  gPost:L('Shoulder bones seen from behind (shoulder blade, collarbone and upper-arm bone) with the arm nerves; the highlighted bones are those most involved in the likely cause.','पीछे से कंधे की हड्डियाँ (कंधे की हड्डी, कॉलरबोन और ऊपरी बांह की हड्डी) और बांह की नसें; चमकती हड्डियाँ संभावित कारण से सबसे ज़्यादा जुड़ी हैं।'),
  gRef:L('Shoulder bones and nerves for reference.','संदर्भ के लिए कंधे की हड्डियाँ और नसें।'),
  gX:L('See-through view: the bones under the areas you marked.','आर-पार व्यू: आपके चिन्हित हिस्सों के नीचे की हड्डियाँ।'),
  reachT:L('Reaching up (high shelf, combing hair)','ऊपर हाथ ले जाना (ऊंची शेल्फ़, बाल बनाना)'), dressT:L('Dressing and reaching behind (shirt, back pocket)','कपड़े पहनना और पीछे हाथ ले जाना (कमीज़, पीछे की जेब)')
};
const FUNCS = [
  {id:'reach', label:'reachT', req:true, opts:[['reach_ok',L('Normally','सामान्य')],['reach_diff',L('With pain or only partly','दर्द के साथ या थोड़ा ही')],['reach_no',L('Cannot lift the arm up','बांह ऊपर नहीं उठती')]]},
  {id:'dress', label:'dressT', req:true, opts:[['dress_ok',L('Normally','सामान्य')],['dress_diff',L('With difficulty','मुश्किल से')],['dress_no',L('Need help','मदद चाहिए')]]},
  {id:'sleep', label:'sleep', opts:C.SLEEPS}
];
SPG.data.modules.shoulder = {id:'shoulder', order:5,
  card:{reg:['sh_side_l','sh_front_l','sh_top_l','sh_back_l'], view:{az:0.55, el:0.1, d:1.9, yk:'sh', dy:-0.12, tx:0.06}, hint:L('Frozen shoulder, rotator cuff pain, stiffness, pain lifting the arm','फ्रोज़न शोल्डर, रोटेटर कफ दर्द, जकड़न, बांह उठाने में दर्द')},
  name:L('Shoulder pain','कंधे का दर्द'), safetyView:'sh_front', startRegions:['sh_side_l','sh_front_l'], safetyRegions:[],
  labelSet:[], GAL:{nerves:['C5_','C6_','C7_','C8_','T1_','median','ulnar','radial'], joint:{view:{az:2.3, el:0.25, d:0.62, yk:'sh', dy:0.0, tx:0.15}, opts:{noBody:true, nerveKeep:['C5_','C6_','C7_','radial','median'], hideBones:['ribs','sternum'], noLegs:true, noPelvis:true}}},
  resultView:{az:0.65, el:0.12, d:1.25, yk:'sh', dy:-0.06, tx:0.12}, defaultDept:'ortho',
  ONSETS, PAT, RFS, VIEWS, AREAS, TESTS, CONDS, EMERG, ROOTS:{}, RS, DERIVED, SIDES:{areas:shAreas, one:'sh_one', both:'sh_both', sideAreas:shAreas.concat(['forearm'])},
  URGENCY, EMERG_WHEN, ROOT_RULES:[], DISC_OF:{}, EXIT_OF:{}, DEPT_RULES, FOCUS, LBLX, UI, FUNCS, FX, STATS};
})();
