window.SPG = window.SPG || {data:{modules:{}}};
/* Upper and mid back (thoracic) module: questions, weights, urgency rules and explanations read by the engine. */
(function(){
const PI = Math.PI;
const L = (en, hi) => ({en, hi});
const C = SPG.data.common;
C.SRC.push(
  ['thor','Healthdirect (Australian Government) – Upper back (thoracic) pain','https://www.healthdirect.gov.au/upper-back-thoracic-pain'],
  ['zoster','Patient.info – Shingles (herpes zoster)','https://patient.info/health/Shingles.htm']
);
const ONSETS = C.ONSETS.filter(o => !['on_preg'].includes(o[0])).concat([
  ['on_carry',L('Carrying a heavy bag or child on one side','एक तरफ भारी बैग या बच्चा उठाना')],
  ['on_cough_bout',L('After a bout of coughing or a chest infection','लगातार खांसी या छाती के इन्फेक्शन के बाद')]
]);
const PAT = {
  char:[
    ['ch_ache',L('Dull ache or tightness between or over the shoulder blades','कंधे की हड्डियों के बीच या ऊपर भारी दर्द या जकड़न')],
    ['ch_sharp_breath',L('Sharp, catching pain on a deep breath','गहरी सांस लेने पर तेज़, अटकने वाला दर्द')],
    ['ch_band',L('Pain that wraps around the chest like a band on one side','एक तरफ छाती के चारों ओर पट्टी जैसा दर्द')],
    ['ch_burn_skin',L('Burning, tingling skin that is sore to touch','त्वचा में जलन, झुनझुनी, छूने से दर्द')],
    ['ch_rash',L('A rash or blisters in a strip on one side','एक तरफ पट्टी में दाने या छाले')],
    ['ch_spasm',L('Muscle spasm or a knot that grips','मांसपेशियों में ऐंठन या जकड़ती गांठ')],
    ['ch_posture',L('Rounded upper back or loss of height','गोल ऊपरी पीठ या कद कम होना')],
    ['ch_stiff_am',L('Stiff for more than 30 minutes after waking','सुबह उठने पर 30 मिनट से ज़्यादा अकड़न')],
    ['ch_leg_weak',L('Weak, numb or stiff legs or difficulty walking','पैरों में कमज़ोरी, सुन्नपन, अकड़न या चलने में दिक्कत')]
  ],
  worse:[
    ['w_breath',L('Deep breathing, coughing or sneezing','गहरी सांस, खांसी या छींक')],['w_twist',L('Twisting or reaching','मुड़ना या हाथ बढ़ाना')],
    ['w_sit',L('Long sitting or hunching','देर तक बैठना या झुककर बैठना')],['w_lift',L('Lifting or carrying','उठाना या ढोना')],
    ['w_meal',L('After fatty or heavy meals','तले या भारी खाने के बाद')],['w_exert',L('Exertion such as climbing stairs or walking fast','मेहनत जैसे सीढ़ी चढ़ना या तेज़ चलना')],
    ['w_rest',L('Resting (better once you move)','आराम करना (हिलने से बेहतर)')]
  ],
  better:[['b_rest',L('Rest','आराम')],['b_move',L('Movement and stretching','हलचल और स्ट्रेचिंग')],['b_exercise',L('Exercise','व्यायाम')]],
  other:[['o_cough',L('Cough, fever or breathlessness','खांसी, बुखार या सांस फूलना')],['u_urine',L('Burning urine or blood in urine','पेशाब में जलन या खून')]]
};
const RFS = [
  ['rf_cardiac',L('Chest pressure or pain spreading to the arm, neck or jaw, with sweating, nausea or breathlessness','सीने में दबाव या दर्द जो बांह, गर्दन या जबड़े तक जाए, साथ में पसीना, उल्टी जैसा या सांस फूलना')],
  ['rf_tear',L('Sudden, severe tearing or ripping pain between the shoulder blades','कंधे की हड्डियों के बीच अचानक, बहुत तेज़ चीरने जैसा दर्द')],
  ['rf_lung',L('Sudden breathlessness, or coughing up blood','अचानक सांस फूलना, या खांसी में खून')],
  ['rf_trauma',L('Started after a major injury: road accident or fall from a height','बड़ी चोट के बाद शुरू: सड़क दुर्घटना या ऊंचाई से गिरना')],
  ['rf_cord',L('Leg weakness, numbness below the chest, or bladder or bowel problems','पैरों में कमज़ोरी, छाती के नीचे सुन्नपन, या पेशाब/शौच की दिक्कत')],
  ['rf_fever',L('Fever, night sweats or weight loss without trying','बुखार, रात को पसीना या बिना कोशिश वज़न घटना')],
  ['rf_night',L('Constant pain at night that no position eases','रात को लगातार दर्द जो किसी भी पोज़िशन में कम न हो')]
];
const VIEWS = {
  interscap:{az:PI,el:0.08,d:1.35,yk:'t6',dy:0.03}, scap:{az:PI-0.25,el:0.08,d:1.45,yk:'t6',dy:0.02}, midback:{az:PI,el:0.05,d:1.4,yk:'t6',dy:-0.08},
  midback_side:{az:PI-0.25,el:0.05,d:1.45,yk:'t6',dy:-0.08}, ribs:{az:1.25,el:0.08,d:1.5,yk:'t6',dy:-0.06}, chest:{az:0,el:0.06,d:1.4,yk:'t6',dy:0.0}
};
const AREAS = [
  {id:'interscap',pair:false,view:'interscap',name:L('Between the shoulder blades','कंधे की हड्डियों के बीच'),desc:L('Along the spine, in the gap between the two shoulder blades (vertebrae T1–T6).','कंधे की हड्डियों के बीच रीढ़ के साथ (T1–T6)।'),rel:L('Common with posture strain; neck discs and, rarely, the heart or aorta can refer pain here.','पोस्चर के खिंचाव में आम; गर्दन की डिस्क और कभी-कभी दिल या महाधमनी का दर्द भी यहाँ आता है।')},
  {id:'scap',pair:true,view:'scap',name:L('Over the shoulder blade','कंधे की हड्डी के ऊपर'),desc:L('The flat, triangle-shaped bone on each side of the upper back, behind the ribs (scapula). You can feel its edge by reaching over your shoulder.','ऊपरी पीठ में दोनों तरफ़ की चपटी, तिकोनी हड्डी (स्कैपुला), पसलियों के पीछे। कंधे के ऊपर से हाथ ले जाकर इसका किनारा छू सकते हैं।'),rel:L('Muscle knots are common here; pain under the right blade can come from the gallbladder.','यहाँ मांसपेशियों की गांठ आम है; दाईं हड्डी के नीचे दर्द पित्ताशय से भी हो सकता है।')},
  {id:'midback',pair:false,view:'midback',name:L('Middle of the back, centre','पीठ का बीच, केंद्र'),desc:L('Over the spine, below the shoulder blades and above the waist (vertebrae T7–T12).','कंधे की हड्डियों के नीचे रीढ़ के ऊपर (T7–T12)।'),rel:L('Central pain here can come from the vertebrae (including fractures), discs or joints.','यहाँ बीच का दर्द हड्डियों (फ्रैक्चर सहित), डिस्क या जोड़ों से हो सकता है।')},
  {id:'midback_side',pair:true,view:'midback_side',name:L('Middle back, beside the spine','पीठ का बीच, रीढ़ के बगल में'),desc:L('A hand-width beside the spine, over the lower ribs.','रीढ़ से एक हथेली दूर, निचली पसलियों के ऊपर।'),rel:L('Rib joints and back muscles; the kidney sits just below.','पसली के जोड़ और पीठ की मांसपेशियाँ; ठीक नीचे गुर्दा है।')},
  {id:'ribs',pair:true,view:'ribs',name:L('Side of the chest and ribs','छाती और पसलियों का साइड'),desc:L('Around the side of the chest, following the ribs.','पसलियों के साथ छाती के साइड में।'),rel:L('A band of pain here follows a thoracic nerve; shingles is a common cause.','यहाँ पट्टी जैसा दर्द एक थोरेसिक नस के रास्ते पर होता है; शिंगल्स आम कारण है।')},
  {id:'chest',pair:false,view:'chest',name:L('Front of the chest','छाती का अगला हिस्सा'),desc:L('Over and around the breastbone, the flat bone in the middle of the chest.','छाती की हड्डी (स्टर्नम) के ऊपर और आसपास।'),rel:L('Chest pain with back pain must rule out the heart, aorta and lungs first.','पीठ दर्द के साथ सीने का दर्द हो तो पहले दिल, महाधमनी और फेफड़े खारिज करने ज़रूरी।')}
];
const TESTS = [
  {id:'press',name:L('Press test','दबाने का टेस्ट'),
   steps:[L('Ask someone to press firmly with a thumb along your spine and the muscles beside it, and along the painful rib.','किसी से कहें कि अंगूठे से आपकी रीढ़, उसके बगल की मांसपेशियों और दर्द वाली पसली के साथ मज़बूती से दबाए।')],
   pos:L('One spot is sharply tender and reproduces your usual pain.','एक जगह बहुत दर्द करती है और आपका सामान्य दर्द दोहराती है।'),
   acc:L('Local tenderness points to muscles, rib joints or a vertebra; very sharp bony tenderness after a fall needs an X-ray.','स्थानीय दर्द मांसपेशियों, पसली के जोड़ों या हड्डी की ओर इशारा करता है; गिरने के बाद हड्डी पर बहुत तेज़ दर्द हो तो एक्स-रे ज़रूरी।'),src:'thor',ans:[['press_pos','tPos','y'],['press_neg','tNeg','n'],['press_skip','tSkip','s']]},
  {id:'twist',name:L('Breath-and-twist test','सांस-और-मोड़ टेस्ट'),
   steps:[L('Sit on a chair with arms crossed. Take a slow deep breath, then gently twist to each side.','बांहें मोड़कर कुर्सी पर बैठें। धीरे से गहरी सांस लें, फिर धीरे-धीरे दोनों तरफ मुड़ें।')],
   pos:L('It brings on your sharp back or rib pain.','आपका तेज़ पीठ या पसली का दर्द आ जाए।'),
   acc:L('Pain from breathing and twisting together suggests a rib (costovertebral) joint or muscle; it does not rule out lung causes.','सांस और मोड़ दोनों से दर्द पसली के जोड़ या मांसपेशी का संकेत है; फेफड़े के कारण खारिज नहीं करता।'),src:'thor',ans:[['twist_pos','tPos','y'],['twist_neg','tNeg','n'],['twist_skip','tSkip','s']]},
  {id:'wall',name:L('Wall test (posture)','दीवार टेस्ट (पोस्चर)'),
   steps:[L('Stand with your heels, buttocks and shoulders against a wall, looking straight ahead.','एड़ी, नितंब और कंधे दीवार से लगाकर सीधे देखते हुए खड़े हों।'),L('Try to touch the wall with the back of your head without lifting your chin.','ठुड्डी उठाए बिना सिर का पिछला हिस्सा दीवार से लगाने की कोशिश करें।')],
   pos:L('Your head cannot touch the wall.','सिर दीवार से नहीं लगता।'),
   acc:L('A gap suggests a rounded upper back (kyphosis), seen with osteoporosis, Scheuermann’s disease or ankylosing spondylitis.','दूरी का मतलब गोल ऊपरी पीठ (काइफोसिस), जो ऑस्टियोपोरोसिस, शॉयरमान रोग या एंकिलोज़िंग स्पॉन्डिलाइटिस में दिखती है।'),src:'asas',ans:[['wall_pos','tPos','y'],['wall_neg','tNeg','n'],['wall_skip','tSkip','s']]}
];
const D = C.DEPTS;
D.cardio = D.cardio || {n:L('Cardiology','कार्डियोलॉजी'),s:L('Heart specialist; heart pain can be felt in the neck, jaw, arm or back.','दिल के विशेषज्ञ; दिल का दर्द गर्दन, जबड़े, बांह या पीठ में भी महसूस हो सकता है।'),q:'cardiologist'};
D.derm = {n:L('Dermatology / General physician','त्वचा रोग / जनरल फिज़िशियन'),s:L('Shingles needs antiviral tablets, best started within 72 hours of the rash.','शिंगल्स में एंटीवायरल दवा चाहिए, दाने के 72 घंटे के अंदर शुरू करना सबसे अच्छा।'),q:'dermatologist'};
D.pulm = {n:L('Chest medicine (pulmonology)','चेस्ट मेडिसिन (पल्मोनोलॉजी)'),s:L('Lung and pleura problems that cause back or chest pain.','फेफड़े और प्लूरा की समस्याएं जो पीठ या सीने में दर्द देती हैं।'),q:'pulmonologist'};
D.gastro = {n:L('Gastroenterology / General surgery','गैस्ट्रोएंटेरोलॉजी / जनरल सर्जरी'),s:L('Gallbladder and pancreas problems that refer pain to the back.','पित्ताशय और पैंक्रियास की समस्याएं जो पीठ में दर्द भेजती हैं।'),q:'gastroenterologist'};
const CONDS = [
  {id:'tstrain',th:[9,6,3],anchor:['interscap','scap','midback_side'],depts:['physio','gp','ortho_spine'],
   name:L('Upper back muscle strain and postural pain','ऊपरी पीठ की मांसपेशियों में खिंचाव और पोस्चर का दर्द'),sci:'Non-specific thoracic back pain · myofascial pain',
   what:L('The most common cause of upper back pain. Muscles between and around the shoulder blades become tight and sore from posture, lifting or stress.','ऊपरी पीठ दर्द का सबसे आम कारण। पोस्चर, वज़न उठाने या तनाव से कंधे की हड्डियों के बीच और आसपास की मांसपेशियाँ जकड़ कर दुखती हैं।'),cSrc:['thor'],
   causes:L('Hunching at a desk or phone, carrying bags on one shoulder, lifting, lack of exercise, stress and poor sleep.','डेस्क या फ़ोन पर झुकना, एक कंधे पर बैग, वज़न उठाना, व्यायाम की कमी, तनाव और खराब नींद।'),
   confirm:L('Clinical examination; scans are not needed without warning signs.','क्लिनिकल जांच; खतरे के संकेत न हों तो स्कैन ज़रूरी नहीं।'),
   treat:L('Posture and workstation changes, movement breaks, heat and a physiotherapy programme for shoulder-blade and upper-back muscles.','पोस्चर और काम की जगह में बदलाव, हलचल ब्रेक, सिकाई और कंधे-ऊपरी पीठ की मांसपेशियों के लिए फिज़ियोथेरेपी।'),
   outlook:L('Usually improves within weeks.','आमतौर पर कुछ हफ्तों में सुधार।'),
   w:{h_first:1,btw_free:1,interscap:2,scap:2,midback_side:1,ch_ache:2,ch_spasm:2,w_sit:2,r_desk:2,on_carry:2,on_lift:1,press_pos:1,b_move:1,d_days:1,d_weeks:1,rf_fever:-3,w_exert:-3,ch_band:-2,ch_rash:-3}},
  {id:'costo',th:[9,6,4],anchor:['ch_sharp_breath','twist_pos'],depts:['physio','ortho_spine','gp'],
   name:L('Rib joint strain (costovertebral dysfunction)','पसली के जोड़ में खिंचाव (कॉस्टोवर्टेब्रल डिसफंक्शन)'),sci:'Costovertebral / costotransverse joint dysfunction',
   what:L('The small joints where ribs meet the spine get strained or stuck, causing sharp one-sided pain beside the spine that catches on deep breaths and twisting.','जहाँ पसलियाँ रीढ़ से मिलती हैं, वे छोटे जोड़ खिंच या अटक जाते हैं, जिससे रीढ़ के बगल में एक तरफ तेज़ दर्द होता है जो गहरी सांस और मुड़ने पर अटकता है।'),
   causes:L('Twisting, reaching, coughing bouts or sleeping awkwardly.','मुड़ना, हाथ बढ़ाना, लगातार खांसी या गलत तरीके से सोना।'),
   confirm:L('Examination; a doctor first rules out lung and heart causes.','जांच; डॉक्टर पहले फेफड़े और दिल के कारण खारिज करते हैं।'),
   treat:L('Physiotherapy (mobilisation, breathing and posture exercises), heat and pain relief.','फिज़ियोथेरेपी (मोबिलाइज़ेशन, सांस और पोस्चर व्यायाम), सिकाई और दर्द की दवा।'),
   outlook:L('Usually settles in days to a few weeks.','आमतौर पर कुछ दिनों से कुछ हफ्तों में ठीक।'),
   w:{btw_free:1,ch_sharp_breath:3,w_breath:2,w_twist:3,twist_pos:3,press_pos:2,midback_side:2,scap:1,on_twist:2,on_cough_bout:2,on_woke:1,d_days:1,o_cough:-2,rf_fever:-3,w_exert:-3}},
  {id:'tfx',th:[9,6,4],anchor:['on_fall','on_accident','on_blow','r_bones','rf_trauma','ch_posture'],depts:['ortho_spine','endo'],
   name:L('Vertebral compression fracture','रीढ़ की हड्डी का दबकर टूटना (कम्प्रेशन फ्रैक्चर)'),sci:'Osteoporotic or traumatic thoracic compression fracture',
   what:L('A thoracic vertebra collapses after a fall or, when bones are weak, after a minor lift or cough. Sudden central pain, worse standing; several fractures cause a rounded back and height loss.','गिरने के बाद, या हड्डियाँ कमज़ोर हों तो छोटा वज़न उठाने या खांसी से, थोरेसिक हड्डी दब जाती है। अचानक बीच में दर्द, खड़े होने पर ज़्यादा; कई फ्रैक्चर से पीठ गोल और कद कम होता है।'),
   causes:L('Osteoporosis (age, menopause, steroid tablets, low vitamin D), trauma or, rarely, a tumour.','ऑस्टियोपोरोसिस (उम्र, मेनोपॉज़, स्टेरॉयड की गोलियाँ, कम विटामिन D), चोट या कभी-कभी गांठ।'),cSrc:['fx'],
   confirm:L('X-ray, MRI to see if the fracture is new, and a DEXA bone density scan.','एक्स-रे, फ्रैक्चर नया है या नहीं इसके लिए MRI, और DEXA हड्डी घनत्व स्कैन।'),
   treat:L('Pain control, sometimes a brace, bone-strengthening medicine, vitamin D and calcium; cement procedures for selected cases.','दर्द नियंत्रण, कभी-कभी ब्रेस, हड्डी मज़बूत करने की दवा, विटामिन D और कैल्शियम; चुने हुए मामलों में सीमेंट प्रोसीजर।'),
   outlook:L('Most stable fractures heal in 6–12 weeks; treating osteoporosis prevents the next one.','ज़्यादातर स्थिर फ्रैक्चर 6–12 हफ्तों में जुड़ते हैं; ऑस्टियोपोरोसिस का इलाज अगला फ्रैक्चर रोकता है।'),
   w:{h_first:1,midback:2,r_bones:3,a_60p:3,a_50_59:1,sex_f:1,on_fall:3,on_lift:1,on_bend:1,on_cough_bout:1,rf_trauma:4,ch_posture:2,wall_pos:1,press_pos:2,d_days:1}},
  {id:'zoster',th:[8,6,4],anchor:['ch_band','ch_burn_skin','ch_rash'],depts:['derm','gp'],
   name:L('Shingles (herpes zoster)','शिंगल्स (हर्पीज़ ज़ोस्टर)'),sci:'Herpes zoster of a thoracic dermatome',
   what:L('The chickenpox virus reawakens in one nerve, causing burning pain in a band on one side of the back and chest. The rash usually appears 2–3 days after the pain starts.','चिकनपॉक्स का वायरस एक नस में फिर सक्रिय होता है, जिससे पीठ और छाती के एक तरफ पट्टी में जलन वाला दर्द होता है। दाने आमतौर पर दर्द शुरू होने के 2–3 दिन बाद आते हैं।'),cSrc:['zoster'],
   causes:L('More common after 50 and with low immunity (diabetes, steroids, chemotherapy, HIV); about 1 in 4 people get it in their lifetime.','50 के बाद और कम इम्युनिटी (डायबिटीज़, स्टेरॉयड, कीमोथेरेपी, HIV) में ज़्यादा आम; लगभग 4 में से 1 व्यक्ति को जीवन में होता है।'),
   confirm:L('Usually diagnosed by a doctor from the rash pattern.','आमतौर पर डॉक्टर दानों के पैटर्न से पहचानते हैं।'),
   treat:L('Antiviral tablets work best when started within 72 hours of the rash, plus pain relief. A vaccine prevents it in older adults.','एंटीवायरल गोलियाँ दाने के 72 घंटे के अंदर शुरू हों तो सबसे अच्छा असर, साथ में दर्द की दवा। बुज़ुर्गों में टीका इसे रोकता है।'),
   outlook:L('Rash heals in 2–4 weeks; some develop lasting nerve pain (post-herpetic neuralgia).','दाने 2–4 हफ्तों में ठीक; कुछ लोगों में लंबा नस दर्द (पोस्ट-हर्पेटिक न्यूरेल्जिया) रहता है।'),oSrc:['zoster'],
   w:{h_first:2,h_5y:-2,btw_some:-2,ch_band:3,ch_burn_skin:3,ch_rash:5,ribs:2,a_50_59:1,a_60p:2,r_immune:2,d_days:1,press_pos:-1,twist_pos:-1}},
  {id:'tspondy',th:[10,6,3],anchor:['interscap','midback'],depts:['ortho_spine','physio','pain'],
   name:L('Thoracic spondylosis (wear of the upper back)','थोरेसिक स्पॉन्डिलोसिस (ऊपरी पीठ की घिसावट)'),sci:'Thoracic spondylosis · facet arthropathy',
   what:L('Age-related wear of thoracic discs and joints causes stiffness and aching, worse after long sitting.','थोरेसिक डिस्क और जोड़ों की उम्र से घिसावट जकड़न और दर्द देती है, लंबे बैठने के बाद ज़्यादा।'),cSrc:['thor'],
   causes:L('Ageing, posture over many years and previous injury.','उम्र, सालों का पोस्चर और पुरानी चोट।'),
   confirm:L('Examination; X-ray or MRI if symptoms persist.','जांच; लक्षण बने रहें तो एक्स-रे या MRI।'),
   treat:L('Exercise, posture and pain relief; injections rarely needed.','व्यायाम, पोस्चर और दर्द की दवा; इंजेक्शन की ज़रूरत कम।'),
   outlook:L('Symptoms fluctuate; exercise keeps most people active.','लक्षण बढ़ते-घटते हैं; व्यायाम से ज़्यादातर लोग सक्रिय रहते हैं।'),
   w:{h_1_5y:2,h_5y:2,btw_some:1,h_first:-1,interscap:1,midback:2,ch_ache:2,a_40_49:1,a_50_59:2,a_60p:2,d_3m:2,on_gradual:2,w_sit:1,ep_recur:1,ch_band:-1,rf_fever:-3}},
  {id:'scheuer',th:[9,6,4],anchor:['ch_posture','wall_pos'],depts:['ortho_spine','physio'],
   name:L('Scheuermann’s kyphosis or postural round back','शॉयरमान काइफोसिस या पोस्चर से गोल पीठ'),sci:'Scheuermann disease · postural kyphosis',
   what:L('In teenagers, wedge-shaped vertebrae can create a fixed rounded back with aching after activity; postural rounding corrects when standing tall.','किशोरों में फन्नी आकार की हड्डियाँ स्थायी गोल पीठ बना सकती हैं, गतिविधि के बाद दर्द के साथ; पोस्चर वाली गोलाई सीधे खड़े होने पर ठीक हो जाती है।'),
   causes:L('Growth-related changes in the vertebral end plates; posture habits.','बढ़ती उम्र में हड्डियों के एंड प्लेट में बदलाव; पोस्चर की आदतें।'),
   confirm:L('Standing side X-ray of the spine.','खड़े होकर रीढ़ का साइड एक्स-रे।'),
   treat:L('Exercise and physiotherapy; a brace while growing; surgery only for severe curves.','व्यायाम और फिज़ियोथेरेपी; बढ़ती उम्र में ब्रेस; गंभीर मोड़ में ही सर्जरी।'),
   outlook:L('Most do well with exercise.','ज़्यादातर व्यायाम से ठीक रहते हैं।'),
   w:{h_5y:2,h_1_5y:1,btw_some:1,ch_posture:4,wall_pos:3,a_u18:3,a_18_29:1,d_3m:2,midback:1,on_gradual:1}},
  {id:'taxspa',th:[12,8,5],anchor:['ch_stiff_am','b_exercise','w_rest'],depts:['rheum','physio'],
   name:L('Inflammatory spine disease (ankylosing spondylitis)','सूजन वाली रीढ़ की बीमारी (एंकिलोज़िंग स्पॉन्डिलाइटिस)'),sci:'Axial spondyloarthritis',
   what:L('Inflammation can spread up the whole spine and rib joints, causing morning stiffness, reduced chest expansion and a stooped posture over years.','सूजन पूरी रीढ़ और पसली के जोड़ों तक फैल सकती है, जिससे सुबह अकड़न, छाती का कम फैलना और सालों में झुका पोस्चर होता है।'),cSrc:['asas'],
   causes:L('An immune condition linked to the HLA-B27 gene, usually starting before 40.','HLA-B27 जीन से जुड़ी इम्यून बीमारी, आमतौर पर 40 से पहले शुरू।'),
   confirm:L('Blood tests (CRP, HLA-B27) and MRI of the sacroiliac joints and spine.','ब्लड टेस्ट (CRP, HLA-B27) और SI जोड़ों व रीढ़ का MRI।'),
   treat:L('Daily exercise, anti-inflammatory medicines and biologics under a rheumatologist.','रोज़ व्यायाम, सूजन-रोधी दवाएं और रूमेटोलॉजिस्ट की देखरेख में बायोलॉजिक्स।'),
   outlook:L('Early treatment preserves movement and posture.','जल्दी इलाज से हलचल और पोस्चर बचता है।'),
   w:{h_1_5y:2,h_5y:2,btw_some:1,h_first:-1,ch_stiff_am:3,b_exercise:3,w_rest:2,r_spa:3,d_3m:2,on_gradual:2,a_18_29:2,a_30_39:2,wall_pos:2,w_breath:1,interscap:1,midback:1}},
  {id:'tdisc',th:[10,7,5],anchor:['ch_leg_weak','ch_band'],depts:['neurosurg','ortho_spine','neuro'],
   name:L('Thoracic disc herniation (uncommon)','थोरेसिक डिस्क हर्निएशन (कम आम)'),sci:'Thoracic disc herniation · thoracic radiculopathy or myelopathy',
   what:L('A thoracic disc can press a nerve root, causing a band of pain around the chest, or press the spinal cord, causing leg weakness, numbness and walking difficulty.','थोरेसिक डिस्क नस की जड़ को दबाकर छाती के चारों ओर पट्टी जैसा दर्द, या स्पाइनल कॉर्ड को दबाकर पैरों में कमज़ोरी, सुन्नपन और चलने में दिक्कत कर सकती है।'),
   causes:L('Disc degeneration, sometimes with calcification; uncommon compared with neck and lower back.','डिस्क की घिसावट, कभी-कभी कैल्सिफिकेशन के साथ; गर्दन और कमर की तुलना में कम आम।'),
   confirm:L('Neurological examination and MRI of the thoracic spine.','न्यूरोलॉजिकल जांच और थोरेसिक रीढ़ का MRI।'),
   treat:L('Physiotherapy and medicines for nerve pain; surgery if the cord is compressed.','नस दर्द के लिए फिज़ियोथेरेपी और दवाएं; कॉर्ड दबे तो सर्जरी।'),
   outlook:L('Root pain often settles; cord compression needs early surgical review.','जड़ का दर्द अक्सर ठीक होता है; कॉर्ड दबाव में जल्दी सर्जिकल जांच ज़रूरी।'),
   w:{h_lt1y:1,ch_band:3,ch_leg_weak:5,ch_burn_skin:-1,ch_rash:-4,ribs:1,midback:1,a_40_49:1,a_50_59:1,d_weeks:1,d_6_12:1}},
  {id:'gb',th:[9,6,4],anchor:['w_meal'],depts:['gastro','gp'],
   name:L('Gallbladder or pancreas pain felt in the back','पित्ताशय या पैंक्रियास का दर्द पीठ में'),sci:'Biliary colic · pancreatitis (referred pain)',
   what:L('Gallstone pain is felt in the upper abdomen and often under the right shoulder blade, typically after fatty meals; pancreatitis causes severe pain boring through to the back.','पित्त की पथरी का दर्द ऊपरी पेट में और अक्सर दाईं कंधे की हड्डी के नीचे महसूस होता है, खासकर तले खाने के बाद; पैंक्रियाटाइटिस का तेज़ दर्द पीठ तक चुभता है।'),
   causes:L('Gallstones, alcohol and high triglycerides.','पित्त की पथरी, शराब और ज़्यादा ट्राइग्लिसराइड।'),
   confirm:L('Abdominal ultrasound and blood tests.','पेट का अल्ट्रासाउंड और ब्लड टेस्ट।'),
   treat:L('Depends on the cause; gallbladder removal for recurrent gallstone pain.','कारण पर निर्भर; बार-बार पथरी के दर्द में पित्ताशय निकालना।'),
   outlook:L('Very treatable once found.','पता चलने पर अच्छा इलाज।'),
   w:{btw_free:1,h_lt1y:1,w_meal:5,scap_r:2,midback_side_r:1,chest:1,ch_spasm:-1,twist_pos:-2,press_pos:-1}},
  {id:'lung',th:[9,6,4],anchor:['o_cough','ch_sharp_breath'],depts:['pulm','gp'],
   name:L('Lung or pleura problem (pleurisy, pneumonia)','फेफड़े या प्लूरा की समस्या (प्लूरिसी, निमोनिया)'),sci:'Pleuritic pain · pneumonia',
   what:L('Inflammation of the lining of the lung causes sharp pain on breathing, often with cough, fever or breathlessness, and can be felt in the back.','फेफड़े की परत में सूजन से सांस लेने पर तेज़ दर्द होता है, अक्सर खांसी, बुखार या सांस फूलने के साथ, और पीठ में भी महसूस होता है।'),
   causes:L('Infections, and less often blood clots or other lung conditions.','इन्फेक्शन, और कम बार खून के थक्के या फेफड़े की दूसरी समस्याएं।'),
   confirm:L('Examination, chest X-ray and blood tests.','जांच, छाती का एक्स-रे और ब्लड टेस्ट।'),
   treat:L('Depends on the cause; antibiotics for pneumonia.','कारण पर निर्भर; निमोनिया में एंटीबायोटिक।'),
   outlook:L('Most infections clear with prompt treatment.','जल्दी इलाज से ज़्यादातर इन्फेक्शन ठीक।'),
   w:{h_first:2,h_5y:-2,o_cough:4,ch_sharp_breath:2,w_breath:2,rf_fever:2,on_cough_bout:1,twist_pos:-1,press_pos:-2}},
  {id:'tinfect',th:[9,6,4],anchor:['rf_fever'],depts:['ortho_spine','id_tb','gp'],
   name:L('Spinal infection, including spinal TB','रीढ़ का इन्फेक्शन, स्पाइनल टीबी सहित'),sci:"Spondylodiscitis · Pott's disease",
   what:L('The thoracic spine is the most common site of spinal TB, which causes constant pain, fever, night sweats and weight loss, and can lead to a hump.','थोरेसिक रीढ़ स्पाइनल टीबी की सबसे आम जगह है, जिससे लगातार दर्द, बुखार, रात को पसीना और वज़न घटता है, और कूबड़ बन सकता है।'),cSrc:['pott'],
   causes:L('TB or bacteria reaching the spine through the blood; diabetes and low immunity raise the risk.','खून के ज़रिए रीढ़ तक पहुंची टीबी या बैक्टीरिया; डायबिटीज़ और कम इम्युनिटी खतरा बढ़ाते हैं।'),
   confirm:L('Blood tests, MRI and biopsy.','ब्लड टेस्ट, MRI और बायोप्सी।'),
   treat:L('Months of anti-TB or antibiotic treatment; surgery if the cord is pressed or the spine is unstable.','महीनों तक टीबी या एंटीबायोटिक इलाज; कॉर्ड दबे या रीढ़ अस्थिर हो तो सर्जरी।'),
   outlook:L('Curable when treated early.','जल्दी इलाज से ठीक।'),
   w:{h_first:2,h_5y:-2,rf_fever:5,r_tb:3,r_immune:2,rf_night:2,ch_posture:1,d_6_12:1,d_3m:1,t_worse:1}},
  {id:'ttumour',th:[10,8,7],rare:true,anchor:['r_cancer'],depts:['ortho_spine','onco'],
   name:L('Tumour involving the upper back (rare)','ऊपरी पीठ से जुड़ी गांठ (दुर्लभ)'),sci:'Spinal metastasis · myeloma',
   what:L('Rare. The thoracic spine is the commonest site for cancer spread to the spine; checked when there is past cancer, weight loss or constant night pain.','दुर्लभ। रीढ़ में कैंसर फैलने की सबसे आम जगह थोरेसिक रीढ़ है; पहले कैंसर, वज़न घटने या रात के लगातार दर्द में जांच।'),
   causes:L('Spread from breast, lung, prostate, kidney or thyroid cancer, or myeloma.','स्तन, फेफड़े, प्रोस्टेट, गुर्दे या थायरॉइड कैंसर से फैलाव, या मायलोमा।'),
   confirm:L('MRI and blood tests.','MRI और ब्लड टेस्ट।'),treat:L('Depends on the cause.','कारण पर निर्भर।'),outlook:L('Early assessment matters.','जल्दी जांच ज़रूरी।'),
   w:{h_first:2,btw_often:1,h_5y:-2,r_cancer:5,rf_night:3,rf_fever:1,a_50_59:1,a_60p:2,d_3m:1,t_worse:1}},
  {id:'cardiacr',th:[8,6,5],rare:true,anchor:['w_exert'],depts:['cardio','gp'],
   name:L('Heart-related pain felt in the back','दिल से जुड़ा दर्द जो पीठ में महसूस हो'),sci:'Angina (rule out)',
   what:L('Pain between the shoulder blades or in the chest that comes on with exertion and eases with rest can be from the heart, especially with diabetes, smoking, high BP or age over 40.','मेहनत से शुरू और आराम से कम होने वाला कंधे की हड्डियों के बीच या सीने का दर्द दिल से हो सकता है, खासकर डायबिटीज़, धूम्रपान, हाई BP या 40 से ऊपर की उम्र में।'),
   causes:L('Narrowed heart arteries.','दिल की धमनियों का संकरा होना।'),confirm:L('ECG, blood tests and a stress test.','ECG, ब्लड टेस्ट और स्ट्रेस टेस्ट।'),treat:L('Cardiology assessment.','कार्डियोलॉजी जांच।'),outlook:L('Needs prompt checking.','जल्दी जांच ज़रूरी।'),
   w:{h_first:1,w_exert:6,chest:2,interscap:1,a_40_49:1,a_50_59:2,a_60p:2,r_immune:1}}
];
const EMERG = {
  cardiac:{name:L('Possible heart attack','दिल के दौरे की आशंका'),sci:'Acute coronary syndrome',what:L('Chest pressure spreading to the arm, neck, jaw or back with sweating or breathlessness can be a heart attack. Call an ambulance now.','सीने का दबाव जो बांह, गर्दन, जबड़े या पीठ तक जाए, पसीने या सांस फूलने के साथ, दिल का दौरा हो सकता है। अभी एम्बुलेंस बुलाएं।'),src:['aha'],depts:['emergency','cardio']},
  aorta:{name:L('Possible tear of the aorta (aortic dissection)','महाधमनी फटने की आशंका (एओर्टिक डिसेक्शन)'),sci:'Acute aortic dissection',what:L('Sudden, severe tearing pain between the shoulder blades is a classic warning sign of a tear in the main artery. Call an ambulance now.','कंधे की हड्डियों के बीच अचानक, बहुत तेज़ चीरने जैसा दर्द मुख्य धमनी फटने का खास संकेत है। अभी एम्बुलेंस बुलाएं।'),src:['wikem'],depts:['emergency','vascular']},
  lung:{name:L('Possible blood clot in the lung','फेफड़े में खून के थक्के की आशंका'),sci:'Pulmonary embolism',what:L('Sudden breathlessness or coughing blood with chest or back pain needs emergency care.','सीने या पीठ दर्द के साथ अचानक सांस फूलना या खांसी में खून के लिए तुरंत इमरजेंसी ज़रूरी।'),src:['wikem'],depts:['emergency','pulm']},
  trauma:{name:L('Possible spinal injury','रीढ़ की चोट की आशंका'),sci:'Major trauma',what:L('After a major injury, keep still and get emergency imaging of the spine.','बड़ी चोट के बाद स्थिर रहें और तुरंत रीढ़ की इमेजिंग कराएं।'),src:['wikem'],depts:['emergency','ortho_spine']},
  cord:{name:L('Spinal cord compression','स्पाइनल कॉर्ड पर दबाव'),sci:'Thoracic myelopathy',what:L('Leg weakness, numbness below the chest or bladder problems mean the spinal cord may be pressed; this needs emergency MRI.','पैरों में कमज़ोरी, छाती के नीचे सुन्नपन या पेशाब की दिक्कत का मतलब कॉर्ड दब सकती है; तुरंत MRI ज़रूरी।'),src:['wikem'],depts:['emergency','neurosurg']}
};
const RS = {
  o_fever:L('Fever, night sweats or weight loss with back pain','पीठ दर्द के साथ बुखार, रात को पसीना या वज़न घटना'),
  o_cancer:L('New back pain with a history of cancer','कैंसर के इतिहास के साथ नया पीठ दर्द'),
  o_night:L('Constant night pain at age 50 or over','50 या ज़्यादा उम्र में रात का लगातार दर्द'),
  o_fx:L('Fracture risk: weak bones or age 60+ with a fall, lift or bad cough','फ्रैक्चर का खतरा: कमज़ोर हड्डियाँ या 60+ उम्र और गिरना, वज़न उठाना या तेज़ खांसी'),
  o_pain:L('Very severe pain (9–10 out of 10)','बहुत तेज़ दर्द (10 में 9–10)'),
  o_exert:L('Pain brought on by exertion: the heart must be checked first','मेहनत से शुरू होने वाला दर्द: पहले दिल की जांच ज़रूरी'),
  o_zoster:L('A one-sided band of burning pain or rash: shingles treatment works best within 72 hours','एक तरफ पट्टी में जलन या दाने: शिंगल्स का इलाज 72 घंटे के अंदर सबसे असरदार'),
  o_lung:L('Pain on breathing with cough, fever or breathlessness','खांसी, बुखार या सांस फूलने के साथ सांस लेने पर दर्द'),
  o_leg:L('Leg weakness or numbness with back pain','पीठ दर्द के साथ पैरों में कमज़ोरी या सुन्नपन'),
  y_long:L('This bout has lasted more than 6 weeks','इस बार का दर्द 6 हफ्ते से ज़्यादा से है'),
  y_inflam:L('Inflammatory pattern: long morning stiffness, better with exercise','सूजन वाला पैटर्न: सुबह लंबी अकड़न, व्यायाम से आराम'),
  y_age:L('Age under 18 or over 60','18 से कम या 60 से ज़्यादा उम्र'),
  y_pain:L('Strong pain (7–8 out of 10)','तेज़ दर्द (10 में 7–8)'),
  y_injury:L('Started after a fall, blow or accident','गिरने, चोट या दुर्घटना के बाद शुरू'),
  y_chest:L('Chest pain together with back pain','पीठ दर्द के साथ सीने का दर्द'),
  y_meal:L('Pain after meals','खाने के बाद दर्द'), y_posture:L('Rounded back or height loss','गोल पीठ या कद कम होना'),
  y_night:L('Pain at rest at night','रात को आराम में दर्द'), y_sleep:L('Pain disturbing sleep','दर्द से नींद खराब'), y_urine:L('Urine symptoms','पेशाब के लक्षण')
};
const URGENCY = {
  orange:[
    {r:'o_exert', when:'w_exert'}, {r:'o_zoster', when:{any:['ch_rash',{all:['ch_band','ch_burn_skin']}]}}, {r:'o_lung', when:{all:['o_cough',{any:['ch_sharp_breath','w_breath','rf_fever']}]}},
    {r:'o_leg', when:'ch_leg_weak'}, {r:'o_fever', when:'rf_fever'}, {r:'o_cancer', when:{all:['r_cancer',{not:'d_3m'}]}},
    {r:'o_night', when:{all:['rf_night',{any:['age_ge50','r_cancer']}]}},
    {r:'o_fx', when:{all:[{any:['r_bones','a_60p']},{any:['on_fall','on_lift','on_bend','on_blow','on_cough','on_cough_bout']}]}}, {r:'o_pain', when:{painGte:9}}
  ],
  yellow:[
    {r:'y_chest', when:'chest'}, {r:'y_often', when:'btw_often'}, {r:'y_long', when:{any:['d_6_12','d_3m']}}, {r:'y_inflam', when:{all:['ch_stiff_am',{any:['b_exercise','w_rest']}]}},
    {r:'y_age', when:{any:['a_u18','a_60p']}}, {r:'y_pain', when:{all:[{painGte:7},{not:{painGte:9}}]}}, {r:'y_injury', when:{any:['on_fall','on_accident','on_blow']}},
    {r:'y_meal', when:'w_meal'}, {r:'y_posture', when:{any:['ch_posture','wall_pos']}}, {r:'y_night', when:'rf_night'}, {r:'y_sleep', when:'sleep_bad'}, {r:'y_urine', when:'u_urine'}
  ]
};
const EMERG_WHEN = {cardiac:'rf_cardiac', aorta:'rf_tear', lung:'rf_lung', trauma:'rf_trauma', cord:'rf_cord'};
const FOCUS = {
  tstrain:{}, costo:{bones:['ribs']}, tfx:{vert:['T11','T12']}, zoster:{nerves:['ic6','ic7'], useSides:true}, tspondy:{vert:['T6','T7'], discs:['T6–T7'], label:['T6–T7']},
  scheuer:{vert:['T6','T7','T8','T9']}, taxspa:{vert:['T6','T7','T8','T9','T10'], bones:['ribs','sacrum','pelvis']}, tdisc:{discs:['T7–T8'], cord:true, herniate:true, side:'b', label:['T7–T8']},
  tinfect:{vert:['T8','T9'], discs:['T8–T9'], label:['T8–T9']}, ttumour:{vert:['T8']}
};
const FX = {
  ch_sharp_breath:L('Sharp pain on deep breathing comes from rib joints, muscles or the lining of the lung.','गहरी सांस पर तेज़ दर्द पसली के जोड़, मांसपेशी या फेफड़े की परत से होता है।'),
  twist_pos:L('Pain on breathing and twisting together points to a rib joint.','सांस और मुड़ने दोनों पर दर्द पसली के जोड़ की ओर इशारा करता है।'),
  press_pos:L('Sharp local tenderness points to muscle, rib joint or bone.','तेज़ स्थानीय दर्द मांसपेशी, पसली के जोड़ या हड्डी की ओर इशारा करता है।'),
  ch_band:L('A band of pain around one side of the chest follows a single thoracic nerve.','छाती के एक तरफ पट्टी जैसा दर्द एक थोरेसिक नस के रास्ते पर होता है।'),
  ch_burn_skin:L('Burning, touch-sensitive skin is typical of nerve pain such as shingles.','जलन वाली, छूने से दुखती त्वचा शिंगल्स जैसे नस दर्द का खास लक्षण है।'),
  ch_rash:L('A one-sided strip of rash is almost always shingles.','एक तरफ पट्टी में दाने लगभग हमेशा शिंगल्स होते हैं।'),
  w_exert:L('Pain brought on by exertion must be checked for heart disease.','मेहनत से शुरू दर्द में दिल की बीमारी की जांच ज़रूरी।'),
  w_meal:L('Pain after fatty meals points to the gallbladder.','तले खाने के बाद दर्द पित्ताशय की ओर इशारा करता है।'),
  o_cough:L('Cough, fever or breathlessness point to the lungs.','खांसी, बुखार या सांस फूलना फेफड़ों की ओर इशारा करते हैं।'),
  ch_posture:L('A rounded back or height loss can come from vertebral fractures or kyphosis.','गोल पीठ या कद कम होना हड्डी के फ्रैक्चर या काइफोसिस से हो सकता है।'),
  wall_pos:L('Not touching the wall with the head shows a rounded upper back.','सिर का दीवार से न लगना गोल ऊपरी पीठ दिखाता है।'),
  ch_leg_weak:L('Leg weakness with upper back pain can mean the spinal cord is pressed.','ऊपरी पीठ दर्द के साथ पैरों की कमज़ोरी का मतलब कॉर्ड दबना हो सकता है।'),
  interscap:L('Pain between the shoulder blades is usually muscular, but can be referred from the neck or heart.','कंधे की हड्डियों के बीच दर्द आमतौर पर मांसपेशियों का होता है, पर गर्दन या दिल से भी आ सकता है।'),
  w_sit:L('Hunched sitting overloads upper back muscles and joints.','झुककर बैठना ऊपरी पीठ की मांसपेशियों और जोड़ों पर भार डालता है।'),
  on_carry:L('Carrying loads on one side strains the muscles around the shoulder blade.','एक तरफ भार ढोना कंधे की हड्डी के आसपास की मांसपेशियों पर खिंचाव डालता है।'),
  midback:L('Central mid-back pain can come from a vertebra, so bone causes are checked.','पीठ के बीच का दर्द हड्डी से हो सकता है, इसलिए हड्डी के कारण जांचे जाते हैं।'),
  ribs:L('Pain along a rib follows the intercostal nerve or rib joint.','पसली के साथ दर्द इंटरकोस्टल नस या पसली के जोड़ के रास्ते पर होता है।')
};
const STATS = [
  {v:'Most',t:L('upper back pain has no serious cause and settles with movement and posture changes','ऊपरी पीठ दर्द का कोई गंभीर कारण नहीं होता और हलचल व पोस्चर बदलाव से ठीक होता है'),s:'thor'},
  {v:'72 h',t:L('window in which shingles antivirals work best after the rash appears','दाने आने के बाद शिंगल्स की एंटीवायरल दवा का सबसे असरदार समय'),s:'zoster'},
  {v:'1 in 4',t:L('people get shingles during their life, more often after 50','लोगों को जीवन में शिंगल्स होता है, 50 के बाद ज़्यादा'),s:'zoster'}
];
const UI = {
  repT:L('Upper and mid back pain assessment','ऊपरी और बीच की पीठ दर्द जांच रिपोर्ट'), breathT:L('Taking a deep breath','गहरी सांस लेना'),
  gPost:L('Upper and mid spine from behind with the ribs, vertebrae numbered. Highlighted: the structures linked to your likely cause.','पसलियों के साथ ऊपरी और बीच की रीढ़ पीछे से, हड्डियों पर नंबर। चमकते हिस्से: आपके संभावित कारण से जुड़े ढांचे।'),
  gRef:L('Thoracic spine, ribs and nerves for reference.','संदर्भ के लिए थोरेसिक रीढ़, पसलियाँ और नसें।'),
  gX:L('Full skeleton and nerves; highlighted parts relate to your likely cause.','पूरा कंकाल और नसें; चमकते हिस्से आपके संभावित कारण से जुड़े हैं।')
};
const FUNCS = [
  {id:'breathe', label:'breathT', req:true, opts:[['br_ok',L('No pain','दर्द नहीं')],['br_pain',L('Hurts at the end of the breath','सांस के अंत में दर्द')],['br_no',L('Cannot take a full breath','पूरी सांस नहीं ले पाते')]]},
  {id:'sit', label:'sit', req:true, opts:C.SITS}, {id:'sleep', label:'sleep', opts:C.SLEEPS}
];
const sideAreas = ['scap','midback_side','ribs'];
SPG.data.modules.thoracic = {id:'thoracic', order:3, name:L('Upper or mid back pain (between or around the shoulder blades)','ऊपरी या बीच की पीठ का दर्द (कंधे की हड्डियों के बीच या आसपास)'), safetyView:'chest', startRegions:['interscap'], safetyRegions:['chest'],
  labelSet:['T1','T2','T3','T4','T5','T6','T7','T8','T9','T10','T11','T12'], GAL:{d:0.95, ref:'T7', refDy:0, pelvis:false, nerves:['ic','cord','T'], ribs:true, lscale:1.4}, defaultDept:'ortho_spine',
  ONSETS, DOMS:null, PAT, RFS, VIEWS, AREAS, TESTS, CONDS, EMERG, ROOTS:{}, RS, DERIVED:[{id:'radicular', when:'ch_band'}], SIDES:{areas:sideAreas, one:'side_one', both:'side_both', sideAreas},
  URGENCY, EMERG_WHEN, ROOT_RULES:[], DISC_OF:{}, EXIT_OF:{}, DEPT_RULES:[{when:'ch_leg_weak', add:['neurosurg'], why:'o_leg'}], FOCUS, RCA:null, LBLX:{}, UI, FUNCS, FX, STATS};
})();
