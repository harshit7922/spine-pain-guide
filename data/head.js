window.SPG = window.SPG || {data:{modules:{}}};
/* Headache, face and jaw module (v5.8). Questions, weights, rules and explanations for headache, jaw (TMJ) and face pain.
   Evidence table: research/head-evidence.md. Weights from likelihood ratios use round(4 x log10(LR)); others are marked expert estimates there. */
(function(){
const PI = Math.PI;
const L = (en, hi) => ({en, hi});
const C = SPG.data.common;
C.SRC.push(
  ['detsky06','Detsky ME et al. Does this patient with headache have a migraine or need neuroimaging? JAMA 2006;296:1274–83 (POUND: 4 or 5 features LR 24, 3 features LR 3.5, 2 or fewer LR 0.41; cluster-type headache LR 10.7 and abnormal neurological examination LR 5.3 for a serious cause)','https://www.qxmd.com/r/16968852'],
  ['ottsah','Perry JJ et al. Clinical decision rules to rule out subarachnoid hemorrhage for acute headache (Ottawa SAH rule). JAMA 2013;310:1248–55 (sensitivity 100%, specificity 15.3%)','https://rebelem.com/the-ottawa-sah-clinical-decision-rule/'],
  ['snnoop','Do TP et al. Red and orange flags for secondary headaches in clinical practice: SNNOOP10 list. Neurology 2019;92:134–44','https://read.qxmd.com/doi/10.1212/WNL.0000000000006697'],
  ['kulkarni15','Kulkarni GB et al. Headache disorders and public ill-health in India: prevalence estimates in Karnataka State. J Headache Pain 2015;16:67 (2,329 adults: any headache 63.9%, migraine 25.2%, tension-type 35.1%, headache on 15+ days a month 3.0%, probable medication-overuse headache 1.2%)','https://spiral.imperial.ac.uk/entities/publication/a6c1e600-5a3c-4869-8f0c-92ed3aed54d5'],
  ['tthcrit','ICHD-3 criteria for tension-type headache (2 of: both sides, pressing or tightening, mild to moderate, not worse with routine activity; no moderate or severe nausea), via Physiotutors','https://book.physiotutors.com/?p=2235'],
  ['frt','Ogince M et al. The diagnostic validity of the cervical flexion-rotation test in C1/2-related cervicogenic headache. Man Ther 2007 (sensitivity 91%, specificity 90%), via Physiotutors','https://www.physiotutors.com/wiki/flexion-rotation-test/'],
  ['bini22','Bini P et al. Manual and exercise therapy for cervicogenic headache: systematic review and meta-analysis. Chiropr Man Therap 2022;30:49 (20 trials, 1,439 people; cervicogenic headache in 1–4% of people with headache)','https://chiro.org/Headache/The_Effectiveness_of_Manual_and_Exercise.shtml'],
  ['dctmd','Schiffman E et al. Diagnostic Criteria for Temporomandibular Disorders (DC/TMD). J Oral Facial Pain Headache 2014;28:6–27 (pain-related TMD: sensitivity 0.86 or more, specificity 0.98 or more)','https://research.regionh.dk/da/publications/diagnostic-criteria-for-temporomandibular-disorders-dctmd-for-cli/'],
  ['tmdprev','DentistryIQ – Evidence-based diagnostic standards for TMD (TMD affects an estimated 10–15% of adults; symptom screener questions)','https://www.dentistryiq.com/dental-hygiene/clinical-hygiene/article/16360542/evidencebased-diagnostic-standards-for-temporomandibular-disorders'],
  ['gca02','Smetana GW, Shmerling RH. Does this patient have temporal arteritis? JAMA 2002;287:92–101 (jaw claudication LR+ 4.0; diplopia 2.0; abnormal temporal artery 2.0; extremely rare under 50), summarised in J Fam Pract','https://cdn.mdedge.com/files/s3fs-public/Document/September-2017/5702JFP_ClinicalInq2.pdf'],
  ['trigem','Patient.info (professional) – Trigeminal neuralgia (4–13 per 100,000 a year; triggers; onset under 40 or sensory loss needs investigation; carbamazepine first line)','https://patient.info/doctor/neurology/trigeminal-neuralgia-pro'],
  ['moh','StatPearls – Medication overuse headache (ICHD-3: headache 15+ days a month with simple painkillers on 15+ days or triptans/combination/opioids on 10+ days for 3 months; about 1% worldwide; relapse about 30% at 6 months)','https://www.statpearls.com/point-of-care/24890'],
  ['cluster','FPnotebook – Cluster headache (about 1 in 1,000; men 4:1; attacks 15–180 minutes; 100% oxygen gives complete relief in about 78%)','https://fpnotebook.com/Neuro/Headache/ClstrHdch.htm'],
  ['sinusmig','Schreiber CP et al. Arch Intern Med 2004: 88% of 2,991 people with “sinus headache” met migraine criteria (summarised by The Hospitalist)','https://community.the-hospitalist.org/index.php/content/what-best-approach-sinus-headaches']
);
const ONSETS = [
  ['on_gradual',L('Slowly, over weeks or months','धीरे-धीरे, हफ्तों या महीनों में')],
  ['on_since_young',L('I have had headaches like this for years','मुझे ऐसा सिरदर्द सालों से होता है')],
  ['on_sudden',L('Suddenly, within minutes','अचानक, कुछ ही मिनटों में')],
  ['on_neck_injury',L('After a neck injury or whiplash','गर्दन की चोट या झटके के बाद')],
  ['on_dental',L('After dental work, a long mouth opening or a blow to the jaw','दांत के इलाज, देर तक मुंह खोलने या जबड़े पर चोट के बाद')],
  ['on_illness',L('With a cold, flu or fever','सर्दी, फ्लू या बुखार के साथ')]
];
const PAT = {
  char:[
    ['ch_pulsing',L('Throbbing or pulsing','धड़कता हुआ या फड़कने जैसा')],
    ['ch_pressing',L('Pressing or tight, like a band around the head','दबाव या कसाव, जैसे सिर के चारों ओर पट्टी')],
    ['ch_one_side',L('On one side of the head','सिर की एक तरफ़')],
    ['ch_both_sides',L('On both sides of the head','सिर की दोनों तरफ़')],
    ['ch_nausea',L('Feeling sick or vomiting with the headache','सिरदर्द के साथ जी मिचलाना या उल्टी')],
    ['ch_disabling',L('So bad that you have to stop what you are doing or lie down','इतना तेज़ कि काम रोकना या लेटना पड़े')],
    ['ch_light',L('Bright light or noise makes it worse','तेज़ रोशनी या शोर से बढ़ता है')],
    ['ch_aura',L('Before the headache: zigzag lines, flashing lights or a blind spot that lasts 5–60 minutes','सिरदर्द से पहले: टेढ़ी-मेढ़ी रेखाएं, चमकती रोशनी या अंधा धब्बा जो 5–60 मिनट रहे')],
    ['ch_neck_start',L('Starts in the neck or back of the head and spreads forwards on the same side','गर्दन या सिर के पीछे से शुरू होकर उसी तरफ़ आगे फैलता है')],
    ['ch_eye_watery',L('Red, watering eye or blocked or runny nose on the same side during the pain','दर्द के दौरान उसी तरफ़ लाल, पानी भरी आंख या बंद या बहती नाक')],
    ['ch_restless',L('So severe that you cannot keep still and pace around','इतना तेज़ कि स्थिर नहीं रह पाते और इधर-उधर घूमते हैं')],
    ['ch_jaw_click',L('The jaw clicks, catches or locks when opening','मुंह खोलते समय जबड़ा क्लिक करता, अटकता या फंसता है')],
    ['ch_clench',L('Clenching or grinding the teeth, or the jaw feels tight on waking','दांत भींचना या पीसना, या सुबह उठने पर जबड़ा कसा लगता है')],
    ['ch_shock_face',L('Brief electric-shock or stabbing pains in the face lasting seconds','चेहरे में कुछ सेकंड का बिजली के झटके या चुभन जैसा दर्द')],
    ['ch_jaw_claud',L('The jaw aches when chewing and eases when you stop','चबाते समय जबड़ा दुखता है और रुकने पर ठीक हो जाता है')],
    ['ch_scalp_tender',L('The scalp is tender to touch, for example when combing the hair','सिर की त्वचा छूने पर दुखती है, जैसे कंघी करते समय')],
    ['ch_nasal',L('Blocked or runny nose with thick coloured mucus, with pain in the cheeks or forehead','गाढ़े रंगीन बलगम के साथ बंद या बहती नाक, गालों या माथे में दर्द')]
  ],
  worse:[
    ['w_activity',L('Routine activity (walking, climbing stairs) makes it worse','रोज़ की गतिविधि (चलना, सीढ़ी चढ़ना) से बढ़ता है')],
    ['w_neck_move',L('Neck movement or holding the head in one position (screen, driving) brings it on','गर्दन हिलाने या सिर एक स्थिति में रखने (स्क्रीन, ड्राइविंग) से शुरू होता है')],
    ['w_chew',L('Chewing, yawning or talking a lot','चबाना, जम्हाई लेना या ज़्यादा बोलना')],
    ['w_touch_face',L('Touching the face, brushing teeth, eating or cold wind sets it off','चेहरा छूना, ब्रश करना, खाना या ठंडी हवा से शुरू होता है')],
    ['w_stress',L('Stress, missed meals or poor sleep','तनाव, खाना छोड़ना या खराब नींद')],
    ['w_periods',L('Around periods','माहवारी के आसपास')]
  ],
  better:[['b_rest',L('Rest in a dark, quiet room or sleep','अंधेरे, शांत कमरे में आराम या नींद')]],
  other:[
    ['o_family',L('Parents, brothers or sisters also have migraine','माता-पिता या भाई-बहन को भी माइग्रेन है')],
    ['o_screen',L('Long hours at a screen or desk','स्क्रीन या डेस्क पर लंबे घंटे')]
  ]
};
const RFS = [
  ['rf_thunder',L('A sudden, very severe headache that reached its worst within a minute or two (“the worst headache of my life”)','अचानक बहुत तेज़ सिरदर्द जो एक-दो मिनट में ही सबसे ज़्यादा हो गया (“ज़िंदगी का सबसे बुरा सिरदर्द”)')],
  ['rf_mening',L('Fever with a stiff neck, a rash that does not fade when pressed, confusion or drowsiness','बुखार के साथ अकड़ी गर्दन, दबाने पर न मिटने वाले दाने, भ्रम या ज़्यादा नींद')],
  ['rf_neuro',L('Weakness or numbness of the face, arm or leg, slurred speech, double vision, loss of vision or a fit','चेहरे, बांह या पैर में कमज़ोरी या सुन्नपन, लड़खड़ाती बोली, दोहरी दिखना, नज़र जाना या दौरा')],
  ['rf_headinj',L('Headache after a head injury with vomiting, drowsiness or while taking blood thinners','सिर की चोट के बाद सिरदर्द, साथ में उल्टी, ज़्यादा नींद, या खून पतला करने की दवा लेते हुए')],
  ['rf_vision',L('Age 50 or over with new headache and blurred, double or lost vision','50 या ज़्यादा उम्र में नए सिरदर्द के साथ धुंधला, दोहरा दिखना या नज़र जाना')],
  ['rf_new50',L('A new kind of headache after age 50, or one that is getting steadily worse over weeks','50 की उम्र के बाद नए तरह का सिरदर्द, या जो हफ्तों में लगातार बढ़ रहा है')],
  ['rf_lying',L('Headache worse on lying down or on waking with vomiting, or brought on by coughing, sneezing or straining','लेटने पर या उठने पर उल्टी के साथ बढ़ने वाला, या खांसने, छींकने या ज़ोर लगाने से शुरू होने वाला सिरदर्द')],
  ['rf_preg',L('Pregnant or had a baby in the last 6 weeks, with a new headache','गर्भवती हैं या पिछले 6 हफ्तों में बच्चा हुआ है, और नया सिरदर्द')]
];
const VIEWS = {
  forehead:{az:0.0,el:0.1,d:0.5,yk:'c4',dy:0.11}, temple:{az:1.2,el:0.1,d:0.5,yk:'c4',dy:0.09,tx:0.03}, eye:{az:0.2,el:0.05,d:0.45,yk:'c4',dy:0.09},
  jaw:{az:1.2,el:0.05,d:0.5,yk:'c4',dy:0.07,tx:0.03}, occiput:{az:PI,el:0.08,d:0.55,yk:'c4',dy:0.06}, band:{az:0.6,el:0.15,d:0.6,yk:'c4',dy:0.1},
  neck:{az:PI,el:0.12,d:1.15,yk:'c4',dy:-0.01}
};
const AREAS = [
  {id:'forehead',pair:false,view:'forehead',name:L('Forehead','माथा'),desc:L('The front of the head above the eyebrows.','भौंहों के ऊपर सिर का अगला हिस्सा।'),rel:L('Forehead pain is common in tension-type headache and migraine; with a blocked nose and fever it may be sinusitis.','माथे का दर्द टेंशन-टाइप सिरदर्द और माइग्रेन में आम है; बंद नाक और बुखार के साथ यह साइनस हो सकता है।')},
  {id:'temple',pair:true,view:'temple',name:L('Temple (side of the head)','कनपटी (सिर का किनारा)'),desc:L('The side of the head above and in front of the ear.','कान के ऊपर और आगे सिर का किनारा।'),rel:L('Throbbing temple pain on one side is typical of migraine; after 50, a new temple headache needs checking for arteritis.','एक तरफ़ कनपटी में धड़कता दर्द माइग्रेन का खास लक्षण है; 50 के बाद नया कनपटी का सिरदर्द आर्टराइटिस के लिए जांचना ज़रूरी है।')},
  {id:'eye',pair:true,view:'eye',name:L('Around or behind one eye','एक आंख के आसपास या पीछे'),desc:L('Around the eye socket and behind the eye.','आंख के गड्ढे के आसपास और आंख के पीछे।'),rel:L('Severe pain behind one eye with a watering eye is typical of cluster headache.','एक आंख के पीछे तेज़ दर्द और पानी भरी आंख क्लस्टर सिरदर्द का खास लक्षण है।')},
  {id:'jaw',pair:true,view:'jaw',name:L('Jaw joint and cheek (in front of the ear)','जबड़े का जोड़ और गाल (कान के आगे)'),desc:L('The jaw joint just in front of the ear and the chewing muscle over the cheek.','कान के ठीक आगे जबड़े का जोड़ और गाल पर चबाने की मांसपेशी।'),rel:L('Pain here with chewing and jaw clicking points to a temporomandibular disorder (TMJ).','चबाने और जबड़े के क्लिक के साथ यहाँ दर्द टेम्पोरोमैंडिबुलर डिसऑर्डर (TMJ) की ओर इशारा करता है।')},
  {id:'occiput',pair:false,view:'occiput',name:L('Back of the head and top of the neck','सिर का पिछला हिस्सा और गर्दन का ऊपरी भाग'),desc:L('The base of the skull where the neck muscles attach.','खोपड़ी का निचला हिस्सा जहाँ गर्दन की मांसपेशियाँ जुड़ती हैं।'),rel:L('Headache starting here and spreading forwards may come from the upper neck joints (cervicogenic headache).','यहाँ से शुरू होकर आगे फैलने वाला सिरदर्द गर्दन के ऊपरी जोड़ों से हो सकता है (सर्विकोजेनिक सिरदर्द)।')},
  {id:'band',pair:false,view:'band',regs:['forehead','temple_l','temple_r','occiput'],name:L('All around the head, like a tight band','पूरे सिर के चारों ओर, कसी पट्टी जैसा'),desc:L('Pressure across the forehead, both temples and the back of the head.','माथे, दोनों कनपटियों और सिर के पीछे दबाव।'),rel:L('A band of pressure on both sides is typical of tension-type headache.','दोनों तरफ़ दबाव की पट्टी टेंशन-टाइप सिरदर्द का खास लक्षण है।')},
  {id:'neck',pair:false,view:'neck',name:L('Neck','गर्दन'),desc:L('The back of the neck.','गर्दन का पिछला हिस्सा।'),rel:L('Neck pain with headache on the same side suggests the headache comes from the neck.','उसी तरफ़ सिरदर्द के साथ गर्दन दर्द बताता है कि सिरदर्द गर्दन से आ रहा है।')}
];
const TESTS = [
  {id:'frt',name:L('Chin down, then turn the head (self flexion-rotation test)','ठुड्डी नीचे, फिर सिर घुमाना (खुद किया फ्लेक्शन-रोटेशन टेस्ट)'),
   steps:[L('Sit upright. Tuck your chin fully down towards your chest and keep it there.','सीधे बैठें। ठुड्डी को पूरी तरह छाती की ओर नीचे करें और वहीं रखें।'),L('Slowly turn your head as far as is comfortable to the left, back to the middle, then to the right. Compare the two sides.','सिर को धीरे-धीरे जितना आराम से हो बाईं ओर घुमाएं, बीच में लाएं, फिर दाईं ओर। दोनों तरफ़ की तुलना करें।')],
   pos:L('Turning to one side is clearly less than to the other, or brings on your usual headache.','एक तरफ़ घुमाना दूसरी तरफ़ से साफ़ कम हो, या आपका सामान्य सिरदर्द आ जाए।'),
   acc:L('When an examiner does this test, it picked up 91% of headaches from the upper neck, with specificity 90%; doing it yourself is less precise, so it counts for less here.','जब जांच करने वाला यह टेस्ट करता है, तो इसने ऊपरी गर्दन से आने वाले 91% सिरदर्द पकड़े, विशिष्टता 90%; खुद करने पर यह कम सटीक है, इसलिए यहाँ इसका वज़न कम है।'),src:'frt',ans:[['frt_pos','tPos','y'],['frt_neg','tNeg','n'],['frt_skip','tSkip','s']]},
  {id:'jawt',name:L('Open wide and press the jaw muscle','मुंह पूरा खोलें और जबड़े की मांसपेशी दबाएं'),
   steps:[L('Open your mouth slowly as wide as you can, then close it.','धीरे-धीरे मुंह जितना हो सके पूरा खोलें, फिर बंद करें।'),L('With two fingers, press firmly for a few seconds on the cheek muscle and just in front of the ear (marked), on each side.','दो उंगलियों से दोनों तरफ़ गाल की मांसपेशी पर और कान के ठीक आगे (निशान वाली जगह) कुछ सेकंड ज़ोर से दबाएं।')],
   pos:L('Opening or pressing brings on your familiar jaw, face or temple pain.','मुंह खोलने या दबाने पर आपका जाना-पहचाना जबड़े, चेहरे या कनपटी का दर्द आ जाए।'),
   acc:L('Familiar pain on opening and on pressing these muscles is part of the international TMD criteria, which together with the history have sensitivity of 86% or more and specificity of 98% or more for painful TMD.','मुंह खोलने और इन मांसपेशियों को दबाने पर जाना-पहचाना दर्द अंतरराष्ट्रीय TMD मापदंडों का हिस्सा है, जो इतिहास के साथ दर्द वाले TMD के लिए 86% या ज़्यादा संवेदनशील और 98% या ज़्यादा विशिष्ट हैं।'),src:'dctmd',ans:[['jawt_pos','tPos','y'],['jawt_neg','tNeg','n'],['jawt_skip','tSkip','s']]}
];
const D = C.DEPTS;
D.medicine = D.medicine || {n:L('General medicine / Internal medicine','जनरल मेडिसिन / इंटरनल मेडिसिन'),s:L('Whole-body causes: blood tests, infections, diabetes, gout.','पूरे शरीर से जुड़े कारण: ब्लड टेस्ट, इन्फेक्शन, डायबिटीज़, गाउट।'),q:'physician'};
D.dental = D.dental || {n:L('Dentist / Oral medicine (TMJ clinic)','दंत चिकित्सक / ओरल मेडिसिन (TMJ क्लिनिक)'),s:L('Jaw joint and chewing muscle problems, teeth grinding and bite splints.','जबड़े के जोड़ और चबाने की मांसपेशियों की समस्याएं, दांत पीसना और बाइट स्प्लिंट।'),q:'TMJ dentist oral medicine'};
D.ent = D.ent || {n:L('ENT (ear, nose and throat)','ENT (कान, नाक, गला)'),s:L('Sinus and nose problems.','साइनस और नाक की समस्याएं।'),q:'ENT specialist'};
const CONDS = [
  {id:'migraine',th:[10,7,4],anchor:['pound4','pound3','ch_aura'],depts:['neuro','gp'],
   name:L('Migraine','माइग्रेन'),sci:'Migraine without or with aura',
   what:L('A brain-based headache that comes in attacks of throbbing pain, often on one side, lasting 4 hours to 3 days, with feeling sick and sensitivity to light and noise. About 1 in 4 people with migraine see an aura (zigzag lines or flashing lights) beforehand.','दिमाग से जुड़ा सिरदर्द जो दौरों में आता है: धड़कता दर्द, अक्सर एक तरफ़, 4 घंटे से 3 दिन तक, जी मिचलाना और रोशनी व शोर से परेशानी के साथ। माइग्रेन वाले कुछ लोगों को पहले ऑरा (टेढ़ी रेखाएं या चमकती रोशनी) दिखता है।'),
   causes:L('Inherited tendency; attacks are triggered by missed meals, poor sleep, stress, periods, bright light and some foods. In Karnataka, 25.2% of adults had migraine in a year.','आनुवंशिक प्रवृत्ति; दौरे खाना छोड़ने, खराब नींद, तनाव, माहवारी, तेज़ रोशनी और कुछ खानों से शुरू होते हैं। कर्नाटक में साल भर में 25.2% वयस्कों को माइग्रेन हुआ।'),cSrc:['kulkarni15'],
   confirm:L('Diagnosed from the history and a normal examination. Four or five of the POUND features (Pulsating, lasting 4–72 hours, Unilateral, Nausea, Disabling) make migraine about 24 times more likely; two or fewer make it much less likely. Scans are not needed unless there are warning signs.','इतिहास और सामान्य जांच से पहचान। POUND के पांच में से चार या पांच लक्षण (धड़कता, 4–72 घंटे, एक तरफ़, जी मिचलाना, काम रोकने वाला) माइग्रेन की संभावना लगभग 24 गुना करते हैं; दो या कम इसे बहुत कम करते हैं। खतरे के संकेत न हों तो स्कैन ज़रूरी नहीं।'),oSrc:['detsky06'],
   treat:L('Early treatment of attacks with a painkiller or anti-inflammatory, or a triptan prescribed by a doctor; regular meals and sleep; a headache diary. Preventive medicine if attacks are frequent. Limit painkillers to fewer than 10–15 days a month to avoid medication overuse headache.','दौरे की शुरुआत में दर्द निवारक या सूजन-रोधी दवा, या डॉक्टर द्वारा लिखी ट्रिप्टान; नियमित खाना और नींद; सिरदर्द डायरी। दौरे बार-बार हों तो बचाव की दवा। दवा से होने वाले सिरदर्द से बचने के लिए दर्द की दवा महीने में 10–15 दिन से कम लें।'),
   outlook:L('A long-term condition that usually becomes much more manageable with the right plan.','लंबे समय की स्थिति, जो सही योजना से आमतौर पर काफ़ी काबू में आ जाती है।'),
   w:{pound4:5,pound3:2,pound_le2:-2,ch_aura:2,ch_light:1,o_family:1,w_periods:1,w_stress:1,b_rest:1,sex_f:1,on_since_young:2,fr_1_14:1,temple:1,eye:1,
      a_60p:-2,rf_new50:-2,ch_pressing:-1,ch_neck_start:-1,ch_eye_watery:-1,ch_shock_face:-2,ch_jaw_claud:-2}},
  {id:'tth',th:[9,6,4],anchor:['tth_feat','band','ch_pressing'],depts:['gp','physio','neuro'],
   name:L('Tension-type headache','टेंशन-टाइप सिरदर्द'),sci:'Tension-type headache',
   what:L('The most common headache: a pressing or tight band of mild to moderate pain on both sides of the head, not made worse by routine activity, without real nausea. It can last from 30 minutes to days.','सबसे आम सिरदर्द: सिर की दोनों तरफ़ हल्के से मध्यम दर्द का दबाव या कसी पट्टी, जो रोज़ की गतिविधि से नहीं बढ़ता, असली जी मिचलाने के बिना। यह 30 मिनट से कई दिनों तक रह सकता है।'),
   causes:L('Stress, poor sleep, long screen or desk work, tight neck and shoulder muscles. In Karnataka, 35.1% of adults had it in a year.','तनाव, खराब नींद, स्क्रीन या डेस्क पर लंबा काम, गर्दन और कंधे की कसी मांसपेशियाँ। कर्नाटक में साल भर में 35.1% वयस्कों को हुआ।'),cSrc:['kulkarni15','tthcrit'],
   confirm:L('Diagnosed from the history (international criteria: at least 2 of both sides, pressing, mild to moderate, not worse with activity) and a normal examination.','इतिहास (अंतरराष्ट्रीय मापदंड: दोनों तरफ़, दबाव, हल्का से मध्यम, गतिविधि से न बढ़ना में से कम से कम 2) और सामान्य जांच से पहचान।'),
   treat:L('Regular exercise, posture and screen breaks, sleep and stress care, neck and shoulder physiotherapy; simple painkillers occasionally, not on most days.','नियमित व्यायाम, पोस्चर और स्क्रीन से ब्रेक, नींद और तनाव की देखभाल, गर्दन और कंधे की फिज़ियोथेरेपी; कभी-कभी साधारण दर्द की दवा, ज़्यादातर दिनों नहीं।'),
   outlook:L('Usually settles with habit changes; frequent headaches need a review of painkiller use.','आमतौर पर आदतें बदलने से ठीक; बार-बार सिरदर्द हो तो दर्द की दवा के इस्तेमाल की समीक्षा ज़रूरी।'),
   w:{tth_feat:3,band:2,ch_pressing:2,ch_both_sides:1,w_stress:1,o_screen:1,r_desk:1,forehead:1,occiput:1,fr_1_14:1,
      ch_nausea:-2,ch_pulsing:-1,ch_one_side:-1,ch_disabling:-1,ch_aura:-2,ch_eye_watery:-2,ch_shock_face:-2,pound4:-2}},
  {id:'cervicogenic',th:[9,6,4],anchor:['ch_neck_start','w_neck_move','frt_pos'],depts:['physio','ortho_spine','neuro'],
   name:L('Headache coming from the neck (cervicogenic headache)','गर्दन से आने वाला सिरदर्द (सर्विकोजेनिक सिरदर्द)'),sci:'Cervicogenic headache (C1–C3)',
   what:L('Pain from the joints and muscles of the upper neck is felt in the head, usually on one side, starting at the back of the head and spreading forwards to the temple or eye. It is brought on by neck movements or holding the head still for long, and neck movement is reduced.','ऊपरी गर्दन के जोड़ों और मांसपेशियों का दर्द सिर में महसूस होता है, आमतौर पर एक तरफ़, सिर के पीछे से शुरू होकर आगे कनपटी या आंख तक फैलता है। गर्दन की हरकत या सिर को देर तक स्थिर रखने से शुरू होता है, और गर्दन कम घूमती है।'),
   causes:L('Upper neck joint strain or wear, whiplash, long screen or driving postures. It accounts for 1–4% of headaches.','ऊपरी गर्दन के जोड़ में खिंचाव या घिसावट, झटके की चोट, स्क्रीन या ड्राइविंग की लंबी मुद्रा। यह 1–4% सिरदर्द का कारण है।'),cSrc:['bini22'],
   confirm:L('Examination of the neck by a physiotherapist or doctor; the flexion-rotation test performed by an examiner has sensitivity 91% and specificity 90%. Diagnostic nerve blocks are used in difficult cases.','फिज़ियोथेरेपिस्ट या डॉक्टर द्वारा गर्दन की जांच; जांचकर्ता द्वारा किया फ्लेक्शन-रोटेशन टेस्ट 91% संवेदनशील और 90% विशिष्ट है। मुश्किल मामलों में नस का ब्लॉक इंजेक्शन।'),
   treat:L('Manual therapy and specific neck exercises with a physiotherapist reduce headache intensity and frequency; posture and screen changes.','फिज़ियोथेरेपिस्ट के साथ मैनुअल थेरेपी और गर्दन के खास व्यायाम सिरदर्द की तीव्रता और बारंबारता कम करते हैं; पोस्चर और स्क्रीन में बदलाव।'),
   outlook:L('Most improve with physiotherapy over weeks.','ज़्यादातर फिज़ियोथेरेपी से कुछ हफ्तों में सुधरते हैं।'),oSrc:['bini22','frt'],
   w:{ch_neck_start:3,w_neck_move:3,frt_pos:3,frt_neg:-3,neck:2,occiput:2,ch_one_side:1,on_neck_injury:2,o_screen:1,r_desk:1,
      ch_aura:-2,pound4:-2,ch_eye_watery:-2,ch_shock_face:-2,ch_both_sides:-1}},
  {id:'tmd',th:[9,6,4],anchor:['jaw','w_chew','jawt_pos'],depts:['dental','physio'],
   name:L('Jaw joint and muscle pain (temporomandibular disorder, TMJ)','जबड़े के जोड़ और मांसपेशी का दर्द (टेम्पोरोमैंडिबुलर डिसऑर्डर, TMJ)'),sci:'Painful temporomandibular disorder (myalgia / arthralgia)',
   what:L('Pain in the chewing muscles or the jaw joint in front of the ear, often spreading to the temple or ear, worse with chewing, yawning and talking, sometimes with clicking or the jaw catching.','चबाने की मांसपेशियों या कान के आगे जबड़े के जोड़ में दर्द, अक्सर कनपटी या कान तक फैलता, चबाने, जम्हाई और बोलने से बढ़ता, कभी क्लिक या जबड़ा अटकने के साथ।'),
   causes:L('Clenching or grinding (often with stress), chewing hard foods or gum, a long dental procedure or a blow. It affects an estimated 10–15% of adults, more often women.','दांत भींचना या पीसना (अक्सर तनाव के साथ), सख्त खाना या च्युइंग गम, लंबा दांत का इलाज या चोट। अनुमानित 10–15% वयस्कों को होता है, महिलाओं में ज़्यादा।'),cSrc:['tmdprev'],
   confirm:L('Examination by a dentist or oral medicine specialist using the international DC/TMD criteria (sensitivity 86% or more, specificity 98% or more for painful TMD); scans only for joint problems that do not settle.','अंतरराष्ट्रीय DC/TMD मापदंडों से दंत चिकित्सक या ओरल मेडिसिन विशेषज्ञ द्वारा जांच (दर्द वाले TMD के लिए 86% या ज़्यादा संवेदनशील, 98% या ज़्यादा विशिष्ट); स्कैन सिर्फ़ ठीक न होने वाली जोड़ की समस्याओं में।'),
   treat:L('Soft diet for a while, no gum, jaw relaxation (lips together, teeth apart), warm packs, jaw exercises with a physiotherapist and a night bite splint from a dentist if you grind.','कुछ समय नरम खाना, च्युइंग गम नहीं, जबड़ा ढीला रखना (होंठ बंद, दांत अलग), गर्म सिकाई, फिज़ियोथेरेपिस्ट के साथ जबड़े के व्यायाम और दांत पीसते हों तो दंत चिकित्सक से रात की बाइट स्प्लिंट।'),
   outlook:L('Most improve with self-care within weeks to months.','ज़्यादातर अपनी देखभाल से कुछ हफ्तों से महीनों में सुधरते हैं।'),oSrc:['dctmd'],
   w:{jaw:4,w_chew:3,jawt_pos:3,jawt_neg:-2,ch_jaw_click:2,ch_clench:2,temple:1,on_dental:2,w_stress:1,sex_f:1,a_18_29:1,a_30_39:1,a_40_49:1,
      ch_jaw_claud:-1,ch_shock_face:-1,ch_aura:-1,pound4:-1}},
  {id:'moh',th:[8,6,4],anchor:['moh_crit'],depts:['neuro','gp'],
   name:L('Medication overuse headache','दवा के ज़्यादा इस्तेमाल से सिरदर्द'),sci:'Medication-overuse headache',
   what:L('Taking painkillers for headache on too many days makes the headaches more frequent, until there is a headache on most days.','सिरदर्द के लिए बहुत ज़्यादा दिनों तक दर्द की दवा लेने से सिरदर्द और बार-बार होने लगते हैं, जब तक कि ज़्यादातर दिन सिरदर्द न रहे।'),
   causes:L('Headache on 15 or more days a month with simple painkillers on 15 or more days (or triptans or combination painkillers on 10 or more days) for over 3 months. About 1% of people worldwide; 1.2% in Karnataka.','3 महीने से ज़्यादा, महीने में 15 या ज़्यादा दिन सिरदर्द और 15 या ज़्यादा दिन साधारण दर्द की दवा (या 10 या ज़्यादा दिन ट्रिप्टान या मिश्रित दवा)। दुनिया में लगभग 1% लोग; कर्नाटक में 1.2%।'),cSrc:['moh','kulkarni15'],
   confirm:L('Diagnosed by a doctor from a headache and medicine diary.','सिरदर्द और दवा की डायरी से डॉक्टर पहचानते हैं।'),
   treat:L('Stopping or cutting down the overused medicine under a doctor’s guidance, usually with a preventive treatment; headaches often worsen for a few days before improving.','डॉक्टर की देखरेख में ज़्यादा ली जा रही दवा बंद या कम करना, आमतौर पर बचाव के इलाज के साथ; सुधरने से पहले कुछ दिन सिरदर्द बढ़ सकता है।'),
   outlook:L('Good with a plan, but about 30% relapse within 6 months, so follow-up matters.','योजना के साथ अच्छा, पर लगभग 30% छह महीने में फिर से इस्तेमाल शुरू कर देते हैं, इसलिए फ़ॉलो-अप ज़रूरी।'),oSrc:['moh'],
   w:{moh_crit:6,fr_15:2,med_15:2,med_10_14:1,dur_const:1,on_since_young:1}},
  {id:'cluster',th:[9,7,5],anchor:['ch_eye_watery','ch_restless'],depts:['neuro'],
   name:L('Cluster headache','क्लस्टर सिरदर्द'),sci:'Cluster headache (trigeminal autonomic cephalalgia)',
   what:L('Attacks of extremely severe pain around or behind one eye, lasting 15 minutes to 3 hours, often at the same time each day or night, with a red watering eye or blocked nose on that side and restlessness. Attacks come in bouts lasting weeks.','एक आंख के आसपास या पीछे बेहद तेज़ दर्द के दौरे, 15 मिनट से 3 घंटे तक, अक्सर रोज़ एक ही समय दिन या रात को, उसी तरफ़ लाल पानी भरी आंख या बंद नाक और बेचैनी के साथ। दौरे हफ्तों तक चलने वाले दौर में आते हैं।'),
   causes:L('About 1 in 1,000 people, men about 4 times more often, usually starting at 20–40; alcohol can trigger attacks during a bout.','लगभग 1,000 में से 1 व्यक्ति, पुरुषों में लगभग 4 गुना ज़्यादा, आमतौर पर 20–40 साल में शुरू; दौर के समय शराब दौरा शुरू कर सकती है।'),cSrc:['cluster'],
   confirm:L('A neurologist makes the diagnosis; a brain scan is usually done once, because headaches that look like this are more often linked to a serious cause (likelihood ratio 10.7).','न्यूरोलॉजिस्ट पहचान करते हैं; आमतौर पर एक बार दिमाग का स्कैन होता है, क्योंकि ऐसे दिखने वाले सिरदर्द ज़्यादा बार गंभीर कारण से जुड़े होते हैं (लाइकलीहुड रेशियो 10.7)।'),
   treat:L('High-flow 100% oxygen through a mask gives complete relief in about 78%; triptan injections or nasal sprays; preventive medicine during bouts.','मास्क से तेज़ बहाव वाली 100% ऑक्सीजन लगभग 78% को पूरी राहत देती है; ट्रिप्टान इंजेक्शन या नाक का स्प्रे; दौर के समय बचाव की दवा।'),
   outlook:L('Very treatable once recognised.','पहचान होने पर अच्छा इलाज संभव।'),oSrc:['cluster','detsky06'],
   w:{ch_eye_watery:4,ch_restless:2,eye:2,dur_30_3h:2,sex_m:2,ch_one_side:1,a_18_29:1,a_30_39:1,a_40_49:1,
      dur_4_72:-1,ch_both_sides:-2,band:-2,ch_pressing:-1}},
  {id:'gca',th:[8,6,4],rare:true,anchor:['ch_jaw_claud','ch_scalp_tender','rf_vision','rf_new50'],onlyIf:'age_ge50',depts:['medicine','rheum','emergency'],
   name:L('Giant cell (temporal) arteritis – needs same-day checking','जायंट सेल (टेम्पोरल) आर्टराइटिस – उसी दिन जांच ज़रूरी'),sci:'Giant cell arteritis',
   what:L('Inflammation of the arteries of the head after age 50 causes a new headache, often at the temples, a tender scalp and jaw pain on chewing. It can cause sudden permanent loss of vision, so it is treated urgently with steroids.','50 की उम्र के बाद सिर की धमनियों में सूजन से नया सिरदर्द, अक्सर कनपटी पर, सिर की त्वचा में दुखन और चबाने पर जबड़े में दर्द होता है। इससे अचानक स्थायी रूप से नज़र जा सकती है, इसलिए स्टेरॉयड से तुरंत इलाज होता है।'),
   causes:L('Almost never under 50, more common with age; linked with polymyalgia rheumatica.','50 से कम में लगभग कभी नहीं, उम्र के साथ ज़्यादा; पॉलीमायल्जिया रूमैटिका से जुड़ा।'),cSrc:['gca02'],
   confirm:L('Same-day blood tests (ESR, CRP, platelets), and an ultrasound or biopsy of the temple artery. Jaw pain on chewing makes it about 4 times more likely.','उसी दिन ब्लड टेस्ट (ESR, CRP, प्लेटलेट्स), और कनपटी की धमनी का अल्ट्रासाउंड या बायोप्सी। चबाने पर जबड़े का दर्द इसकी संभावना लगभग 4 गुना करता है।'),
   treat:L('Steroid tablets started the same day by a doctor, without waiting for the biopsy.','डॉक्टर द्वारा उसी दिन स्टेरॉयड की गोलियाँ, बायोप्सी का इंतज़ार किए बिना।'),
   outlook:L('Early treatment protects vision.','जल्दी इलाज से नज़र बचती है।'),oSrc:['gca02'],
   w:{ch_jaw_claud:3,ch_scalp_tender:2,temple:2,rf_new50:3,rf_vision:4,a_60p:2,a_50_59:1}},
  {id:'trigem',th:[8,6,4],anchor:['ch_shock_face'],depts:['neuro'],
   name:L('Trigeminal neuralgia (electric-shock face pain)','ट्राइजेमिनल न्यूरेल्जिया (चेहरे में बिजली जैसा दर्द)'),sci:'Trigeminal neuralgia',
   what:L('Sudden, one-sided, electric-shock or stabbing pains in the cheek, jaw, teeth or forehead lasting seconds, set off by light touch, brushing the teeth, eating, talking or cold wind.','चेहरे की एक तरफ़ गाल, जबड़े, दांत या माथे में कुछ सेकंड के अचानक बिजली के झटके या चुभन जैसे दर्द, हल्के स्पर्श, ब्रश, खाने, बोलने या ठंडी हवा से शुरू।'),
   causes:L('Usually a blood vessel pressing on the trigeminal nerve; rare (4–13 per 100,000 a year), more common with age and slightly more in women. Onset before 40, numbness or pain on both sides needs a brain MRI.','आमतौर पर ट्राइजेमिनल नस पर खून की नली का दबाव; दुर्लभ (हर साल 1 लाख में 4–13), उम्र के साथ ज़्यादा और महिलाओं में थोड़ा ज़्यादा। 40 से पहले शुरुआत, सुन्नपन या दोनों तरफ़ दर्द हो तो दिमाग का MRI ज़रूरी।'),cSrc:['trigem'],
   confirm:L('Diagnosed by a doctor from the typical pattern; MRI if there are unusual features.','खास पैटर्न से डॉक्टर पहचानते हैं; असामान्य लक्षण हों तो MRI।'),
   treat:L('Carbamazepine prescribed by a doctor is the first treatment; surgery for those who do not respond.','डॉक्टर द्वारा लिखी कार्बामाज़ेपिन पहला इलाज है; असर न हो तो सर्जरी।'),
   outlook:L('Most respond to medicine; it can come and go for years.','ज़्यादातर पर दवा असर करती है; यह सालों तक आता-जाता रह सकता है।'),oSrc:['trigem'],
   w:{ch_shock_face:5,w_touch_face:3,jaw:1,forehead:1,ch_one_side:1,a_50_59:1,a_60p:1,sex_f:1,dur_lt30:1,
      ch_pulsing:-1,ch_nausea:-1,band:-2,pound4:-2}},
  {id:'sinus',th:[8,6,4],anchor:['ch_nasal'],depts:['ent','gp'],
   name:L('Sinusitis (only with nose symptoms)','साइनसाइटिस (सिर्फ़ नाक के लक्षणों के साथ)'),sci:'Acute rhinosinusitis',
   what:L('Infection of the sinuses causes pain and pressure in the cheeks or forehead with a blocked nose and thick coloured mucus, often after a cold. Recurring “sinus headaches” without these nose symptoms are usually migraine: 88% of people with self-diagnosed sinus headache met migraine criteria in one study.','साइनस के इन्फेक्शन से बंद नाक और गाढ़े रंगीन बलगम के साथ गालों या माथे में दर्द और दबाव होता है, अक्सर सर्दी के बाद। इन नाक के लक्षणों के बिना बार-बार होने वाला “साइनस सिरदर्द” आमतौर पर माइग्रेन होता है: एक अध्ययन में खुद को साइनस सिरदर्द मानने वाले 88% लोगों में माइग्रेन के मापदंड मिले।'),cSrc:['sinusmig'],
   causes:L('Colds and allergies; bacterial infection in a minority.','सर्दी और एलर्जी; कुछ में बैक्टीरियल इन्फेक्शन।'),
   confirm:L('Examination by a doctor; scans only for complications or repeated infections.','डॉक्टर द्वारा जांच; स्कैन सिर्फ़ जटिलताओं या बार-बार इन्फेक्शन में।'),
   treat:L('Saline nasal rinses, steam and painkillers; antibiotics only if a doctor thinks it is bacterial.','नमक के पानी से नाक धोना, भाप और दर्द की दवा; डॉक्टर को बैक्टीरियल लगे तभी एंटीबायोटिक।'),
   outlook:L('Most settle within 2–3 weeks.','ज़्यादातर 2–3 हफ्तों में ठीक।'),
   w:{ch_nasal:5,on_illness:2,forehead:1,dur_const:1,pound4:-2,ch_aura:-2,on_since_young:-1}}
];
const EMERG = {
  sah:{name:L('Possible bleeding around the brain','दिमाग के आसपास खून बहने की आशंका'),sci:'Subarachnoid haemorrhage (thunderclap headache)',
    what:L('A sudden, severe headache that peaks within a minute or two can be bleeding around the brain, even if it settles. Call 108 or go to the emergency department now; a CT scan is needed. Doctors use the Ottawa rule (age 40+, neck pain or stiffness, collapse, onset during exertion, instant peak, stiff neck), which missed no bleeds in its validation study.','अचानक तेज़ सिरदर्द जो एक-दो मिनट में चरम पर पहुंचे, दिमाग के आसपास खून बहना हो सकता है, भले ही ठीक हो जाए। अभी 108 बुलाएं या इमरजेंसी जाएं; CT स्कैन ज़रूरी है। डॉक्टर ओटावा नियम (40+ उम्र, गर्दन दर्द या अकड़न, बेहोशी, मेहनत के समय शुरुआत, तुरंत चरम, अकड़ी गर्दन) इस्तेमाल करते हैं, जिसने अपने अध्ययन में कोई ब्लीड नहीं छोड़ा।'),src:['ottsah'],depts:['emergency','neurosurg']},
  mening:{name:L('Possible meningitis or brain infection','मेनिनजाइटिस या दिमाग के इन्फेक्शन की आशंका'),sci:'Meningitis / encephalitis',
    what:L('Headache with fever and a stiff neck, a rash that does not fade, confusion or drowsiness needs emergency treatment. Call 108 now.','बुखार और अकड़ी गर्दन, न मिटने वाले दाने, भ्रम या ज़्यादा नींद के साथ सिरदर्द में तुरंत इलाज चाहिए। अभी 108 बुलाएं।'),src:['snnoop'],depts:['emergency','medicine']},
  stroke:{name:L('Possible stroke or other brain problem','स्ट्रोक या दिमाग की दूसरी समस्या की आशंका'),sci:'Stroke / intracranial lesion',
    what:L('Headache with weakness, numbness, speech or vision problems or a fit needs emergency care: an abnormal neurological examination makes a serious cause about 5 times more likely. Note the time and call 108 now.','कमज़ोरी, सुन्नपन, बोलने या देखने की समस्या या दौरे के साथ सिरदर्द में तुरंत इलाज चाहिए: असामान्य न्यूरोलॉजिकल जांच गंभीर कारण की संभावना लगभग 5 गुना करती है। समय नोट करें और अभी 108 बुलाएं।'),src:['detsky06','snnoop'],depts:['emergency','neuro']},
  headinj:{name:L('Head injury needing a scan','सिर की चोट जिसमें स्कैन ज़रूरी'),sci:'Post-traumatic headache with red flags',
    what:L('Headache after a head injury with vomiting or drowsiness, or in someone on blood thinners, needs emergency assessment and often a CT scan.','सिर की चोट के बाद उल्टी या ज़्यादा नींद के साथ सिरदर्द, या खून पतला करने की दवा लेने वाले व्यक्ति में, तुरंत जांच और अक्सर CT स्कैन ज़रूरी है।'),src:['snnoop'],depts:['emergency','neurosurg']},
  gcav:{name:L('Possible giant cell arteritis with vision symptoms','नज़र के लक्षणों के साथ जायंट सेल आर्टराइटिस की आशंका'),sci:'Giant cell arteritis (vision at risk)',
    what:L('After age 50, a new headache with blurred, double or lost vision, or jaw pain on chewing with a tender scalp, can be arteritis that threatens sight. Go to the emergency department today for blood tests and steroids.','50 की उम्र के बाद धुंधले, दोहरे दिखने या नज़र जाने के साथ नया सिरदर्द, या सिर की दुखती त्वचा के साथ चबाने पर जबड़े का दर्द, नज़र को खतरे वाली आर्टराइटिस हो सकती है। ब्लड टेस्ट और स्टेरॉयड के लिए आज ही इमरजेंसी जाएं।'),src:['gca02'],depts:['emergency','medicine']}
};
const RS = {
  o_new50:L('A new or steadily worsening headache after age 50','50 के बाद नया या लगातार बढ़ता सिरदर्द'),
  o_lying:L('Headache worse lying down or on waking with vomiting, or set off by coughing or straining','लेटने पर या उठने पर उल्टी के साथ बढ़ने वाला, या खांसी या ज़ोर लगाने से शुरू होने वाला सिरदर्द'),
  o_preg:L('A new headache in pregnancy or soon after birth','गर्भावस्था में या डिलीवरी के बाद नया सिरदर्द'),
  o_cluster:L('Severe one-sided eye pain with a watering eye: needs a neurologist','पानी भरी आंख के साथ एक तरफ़ आंख में तेज़ दर्द: न्यूरोलॉजिस्ट ज़रूरी'),
  o_immune:L('New headache with cancer, HIV or low immunity','कैंसर, HIV या कम इम्युनिटी के साथ नया सिरदर्द'),
  o_pain:L('Very severe pain (9–10 out of 10)','बहुत तेज़ दर्द (10 में 9–10)'),
  y_moh:L('Painkillers on too many days: risk of medication overuse headache','बहुत ज़्यादा दिनों दर्द की दवा: दवा से होने वाले सिरदर्द का खतरा'),
  y_freq:L('Headache on 15 or more days a month','महीने में 15 या ज़्यादा दिन सिरदर्द'),
  y_aura:L('Visual aura before headaches','सिरदर्द से पहले नज़र का ऑरा'),
  y_long:L('This bout has lasted more than 6 weeks','इस बार का दर्द 6 हफ्ते से ज़्यादा से है'), y_pain:L('Strong pain (7–8 out of 10)','तेज़ दर्द (10 में 7–8)'), y_sleep:L('Pain disturbing sleep','दर्द से नींद खराब'),
  y_trigem:L('Electric-shock face pain: needs a doctor’s assessment','चेहरे में बिजली जैसा दर्द: डॉक्टर की जांच ज़रूरी')
};
const POUND = ['ch_pulsing','dur_4_72','ch_one_side','ch_nausea','ch_disabling'];
const DERIVED = [
  {id:'pound4', when:{atLeast:[4,POUND]}},
  {id:'pound3', when:{all:[{atLeast:[3,POUND]},{not:{atLeast:[4,POUND]}}]}},
  {id:'pound_le2', when:{not:{atLeast:[3,POUND]}}},
  {id:'tth_feat', when:{all:[{atLeast:[2,['ch_both_sides','ch_pressing','not_disabling','not_activity']]},{any:['ch_both_sides','ch_pressing','band']},{not:'ch_nausea'}]}},
  {id:'not_disabling', when:{not:'ch_disabling'}}, {id:'not_activity', when:{not:'w_activity'}},
  {id:'moh_crit', when:{all:['fr_15',{any:['med_15','med_10_14']}]}},
  {id:'head_any', when:{any:['forehead','temple','eye','jaw','occiput','band']}}
];
const URGENCY = {
  orange:[
    {r:'o_new50', when:'rf_new50'}, {r:'o_lying', when:'rf_lying'}, {r:'o_preg', when:'rf_preg'},
    {r:'o_cluster', when:{all:['ch_eye_watery',{any:['eye','ch_restless']}]}}, {r:'o_immune', when:{all:[{any:['r_cancer','r_immune']},{any:['on_sudden','on_gradual']}]}},
    {r:'o_pain', when:{painGte:9}}
  ],
  yellow:[
    {r:'y_moh', when:{any:['moh_crit','med_15']}}, {r:'y_freq', when:'fr_15'}, {r:'y_aura', when:'ch_aura'}, {r:'y_trigem', when:'ch_shock_face'},
    {r:'y_often', when:'btw_often'}, {r:'y_long', when:{any:['d_6_12','d_3m']}}, {r:'y_pain', when:{all:[{painGte:7},{not:{painGte:9}}]}}, {r:'y_sleep', when:'sleep_bad'}
  ]
};
const EMERG_WHEN = {sah:'rf_thunder', mening:'rf_mening', stroke:'rf_neuro', headinj:'rf_headinj',
  gcav:{any:['rf_vision',{all:['age_ge50','ch_jaw_claud','ch_scalp_tender']}]}};
const FOCUS = {cervicogenic:{vert:['C1','C2','C3']}, tth:{vert:['C1','C2']}};
const LBLX = {head_one:L('One side','एक तरफ़'), head_both:L('Both sides','दोनों तरफ़'), head_any:L('Head or face pain','सिर या चेहरे में दर्द'),
  pound4:L('4 or 5 migraine (POUND) features','माइग्रेन (POUND) के 4 या 5 लक्षण'), pound3:L('3 migraine (POUND) features','माइग्रेन (POUND) के 3 लक्षण'), pound_le2:L('2 or fewer migraine features','माइग्रेन के 2 या कम लक्षण'),
  tth_feat:L('Tension-type headache features','टेंशन-टाइप सिरदर्द के लक्षण'), not_disabling:L('Not disabling','काम रोकने वाला नहीं'), not_activity:L('Not worse with activity','गतिविधि से नहीं बढ़ता'),
  moh_crit:L('Headache 15+ days a month with frequent painkillers','महीने में 15+ दिन सिरदर्द और बार-बार दर्द की दवा')};
const FX = {
  pound4:L('Four or five of Pulsating, 4–72 hours, One-sided, Nausea and Disabling make migraine about 24 times more likely.','धड़कता, 4–72 घंटे, एक तरफ़, जी मिचलाना और काम रोकने वाला में से चार या पांच माइग्रेन की संभावना लगभग 24 गुना करते हैं।'),
  pound3:L('Three of the five POUND features make migraine about 3.5 times more likely.','POUND के पांच में से तीन लक्षण माइग्रेन की संभावना लगभग 3.5 गुना करते हैं।'),
  pound_le2:L('Two or fewer POUND features make migraine less likely.','POUND के दो या कम लक्षण माइग्रेन की संभावना कम करते हैं।'),
  ch_aura:L('A visual aura before the headache is typical of migraine; a first-ever aura needs a doctor’s check.','सिरदर्द से पहले नज़र का ऑरा माइग्रेन का खास लक्षण है; पहली बार ऑरा हो तो डॉक्टर से जांच ज़रूरी।'),
  tth_feat:L('A pressing, two-sided, mild to moderate headache not made worse by activity fits tension-type headache.','दबाव वाला, दोनों तरफ़, हल्का से मध्यम सिरदर्द जो गतिविधि से न बढ़े, टेंशन-टाइप सिरदर्द से मेल खाता है।'),
  ch_neck_start:L('Headache starting in the neck and spreading forwards on one side points to the upper neck joints.','गर्दन से शुरू होकर एक तरफ़ आगे फैलने वाला सिरदर्द ऊपरी गर्दन के जोड़ों की ओर इशारा करता है।'),
  w_neck_move:L('Headache brought on by neck movement or sustained postures fits cervicogenic headache.','गर्दन की हरकत या लंबी मुद्रा से शुरू सिरदर्द सर्विकोजेनिक सिरदर्द से मेल खाता है।'),
  frt_pos:L('Less turning with the chin tucked suggests a stiff C1–C2 joint (examiner test: sensitivity 91%, specificity 90%).','ठुड्डी नीचे रखकर कम घूमना C1–C2 जोड़ की जकड़न का संकेत है (जांचकर्ता टेस्ट: संवेदनशीलता 91%, विशिष्टता 90%)।'),
  frt_neg:L('Full, pain-free turning with the chin tucked makes a neck-related headache less likely.','ठुड्डी नीचे रखकर पूरा, बिना दर्द घूमना गर्दन से जुड़े सिरदर्द की संभावना कम करता है।'),
  jaw:L('Pain in front of the ear or over the cheek points to the jaw joint or chewing muscles.','कान के आगे या गाल पर दर्द जबड़े के जोड़ या चबाने की मांसपेशियों की ओर इशारा करता है।'),
  w_chew:L('Pain with chewing, yawning or talking is typical of TMD.','चबाने, जम्हाई या बोलने पर दर्द TMD का खास लक्षण है।'),
  jawt_pos:L('Familiar pain on opening wide or pressing the jaw muscles is part of the TMD criteria.','मुंह पूरा खोलने या जबड़े की मांसपेशी दबाने पर जाना-पहचाना दर्द TMD मापदंडों का हिस्सा है।'),
  ch_clench:L('Clenching and grinding overload the chewing muscles.','दांत भींचना और पीसना चबाने की मांसपेशियों पर भार डालते हैं।'),
  moh_crit:L('Headache on 15+ days a month with painkillers on 10–15+ days meets the definition of medication overuse headache.','महीने में 15+ दिन सिरदर्द और 10–15+ दिन दर्द की दवा, दवा से होने वाले सिरदर्द की परिभाषा में आता है।'),
  ch_eye_watery:L('A red, watering eye or runny nose on the side of the pain is typical of cluster headache.','दर्द वाली तरफ़ लाल, पानी भरी आंख या बहती नाक क्लस्टर सिरदर्द का खास लक्षण है।'),
  ch_jaw_claud:L('Jaw pain on chewing that eases with rest makes giant cell arteritis about 4 times more likely after 50.','आराम से ठीक होने वाला चबाने पर जबड़े का दर्द 50 के बाद जायंट सेल आर्टराइटिस की संभावना लगभग 4 गुना करता है।'),
  ch_shock_face:L('Seconds-long electric-shock face pain is the hallmark of trigeminal neuralgia.','सेकंडों का बिजली के झटके जैसा चेहरे का दर्द ट्राइजेमिनल न्यूरेल्जिया की पहचान है।'),
  w_touch_face:L('Pain set off by touch, brushing or eating is typical of trigeminal neuralgia.','स्पर्श, ब्रश या खाने से शुरू दर्द ट्राइजेमिनल न्यूरेल्जिया का खास लक्षण है।'),
  ch_nasal:L('A blocked nose with thick coloured mucus is needed before a headache is called sinusitis.','किसी सिरदर्द को साइनस कहने से पहले गाढ़े रंगीन बलगम के साथ बंद नाक होना ज़रूरी है।'),
  band:L('A tight band around the head fits tension-type headache.','सिर के चारों ओर कसी पट्टी टेंशन-टाइप सिरदर्द से मेल खाती है।')
};
const STATS = [
  {v:'63.9%',t:L('of adults in Karnataka had a headache in the past year; migraine 25.2%, tension-type 35.1%','कर्नाटक में वयस्कों को पिछले साल सिरदर्द हुआ; माइग्रेन 25.2%, टेंशन-टाइप 35.1%'),s:'kulkarni15'},
  {v:'24×',t:L('more likely migraine with 4 or 5 POUND features','ज़्यादा संभावना माइग्रेन की, POUND के 4 या 5 लक्षणों के साथ'),s:'detsky06'},
  {v:'100%',t:L('of brain bleeds were caught by the Ottawa rule for sudden headache','दिमाग के ब्लीड अचानक सिरदर्द के ओटावा नियम से पकड़े गए'),s:'ottsah'},
  {v:'88%',t:L('of self-diagnosed “sinus headaches” met migraine criteria','खुद पहचाने गए “साइनस सिरदर्द” में माइग्रेन के मापदंड मिले'),s:'sinusmig'},
  {v:'10–15%',t:L('of adults have jaw joint or muscle pain (TMD)','वयस्कों को जबड़े के जोड़ या मांसपेशी का दर्द (TMD)'),s:'tmdprev'},
  {v:'1.2%',t:L('of adults in Karnataka had probable medication overuse headache','कर्नाटक में वयस्कों को संभावित दवा से होने वाला सिरदर्द'),s:'kulkarni15'}
];
const UI = {
  repT:L('Headache, face and jaw pain assessment','सिरदर्द, चेहरे और जबड़े के दर्द की जांच रिपोर्ट'), tag:L('Headache and jaw assessment','सिरदर्द और जबड़े की जांच'),
  safPic:L('Head (asked below): a sudden “worst ever” headache, fever with a stiff neck, or weakness or speech problems is an emergency.','सिर (नीचे पूछा गया): अचानक “सबसे बुरा” सिरदर्द, अकड़ी गर्दन के साथ बुखार, या कमज़ोरी या बोलने की समस्या इमरजेंसी है।'),
  must:[L('This assessment cannot examine your nervous system, eyes, blood pressure, neck or jaw, which a doctor does by examining you.','यह जांच आपके तंत्रिका तंत्र, आंखों, ब्लड प्रेशर, गर्दन या जबड़े की जांच नहीं कर सकती, जो डॉक्टर जांच से करते हैं।'),
    L('Only a doctor can decide whether you need a scan or blood tests; most headaches do not need a scan.','स्कैन या ब्लड टेस्ट की ज़रूरत है या नहीं, यह सिर्फ़ डॉक्टर तय कर सकते हैं; ज़्यादातर सिरदर्द में स्कैन की ज़रूरत नहीं होती।'),
    L('Headache can also come from high blood pressure, eye strain, teeth, medicines or a whole-body illness; a doctor checks these too.','सिरदर्द हाई ब्लड प्रेशर, आंखों पर ज़ोर, दांत, दवाओं या पूरे शरीर की बीमारी से भी हो सकता है; डॉक्टर इनकी भी जांच करते हैं।'),
    L('Medicines, especially for frequent headaches, must be chosen for you personally; keep a headache diary for your doctor.','दवाएं, खासकर बार-बार के सिरदर्द के लिए, आपके लिए व्यक्तिगत रूप से तय होनी चाहिए; डॉक्टर के लिए सिरदर्द डायरी रखें।')],
  tip1:L('Keep regular meals, water and sleep; take short breaks from screens and move your neck and shoulders every 30–45 minutes.','नियमित खाना, पानी और नींद रखें; स्क्रीन से छोटे ब्रेक लें और हर 30–45 मिनट में गर्दन और कंधे हिलाएं।'),
  tip2:L('For jaw pain: soft foods, no chewing gum, lips together and teeth apart, and avoid opening very wide until you are examined.','जबड़े के दर्द में: नरम खाना, च्युइंग गम नहीं, होंठ बंद और दांत अलग, और जांच होने तक बहुत ज़्यादा मुंह खोलने से बचें।'),
  gPost:L('The upper neck vertebrae and nerves that can refer pain to the head; the highlighted parts relate to your likely cause.','ऊपरी गर्दन की हड्डियाँ और नसें जो सिर में दर्द भेज सकती हैं; चमकते हिस्से आपके संभावित कारण से जुड़े हैं।'),
  gRef:L('Upper neck vertebrae and nerves for reference.','संदर्भ के लिए ऊपरी गर्दन की हड्डियाँ और नसें।'), gX:L('See-through view of the head and neck.','सिर और गर्दन का आर-पार व्यू।'),
  hdurT:L('How long does a typical headache last (without treatment)?','एक सामान्य सिरदर्द (बिना इलाज) कितनी देर रहता है?'), hfreqT:L('How many days a month do you have a headache?','महीने में कितने दिन सिरदर्द होता है?'), hmedT:L('On how many days a month do you take painkillers for headache?','महीने में कितने दिन सिरदर्द के लिए दर्द की दवा लेते हैं?')
};
const FUNCS = [
  {id:'hdur', label:'hdurT', req:true, opts:[['dur_lt30',L('Seconds to 30 minutes','कुछ सेकंड से 30 मिनट')],['dur_30_3h',L('30 minutes to 3 hours','30 मिनट से 3 घंटे')],['dur_4_72',L('4 hours to 3 days','4 घंटे से 3 दिन')],['dur_const',L('Constant, every day','लगातार, हर दिन')]]},
  {id:'hfreq', label:'hfreqT', req:true, opts:[['fr_lt1',L('Less than 1 day','1 दिन से कम')],['fr_1_14',L('1 to 14 days','1 से 14 दिन')],['fr_15',L('15 days or more','15 दिन या ज़्यादा')]]},
  {id:'hmed', label:'hmedT', req:true, opts:[['med_lt10',L('Fewer than 10 days','10 दिन से कम')],['med_10_14',L('10 to 14 days','10 से 14 दिन')],['med_15',L('15 days or more','15 दिन या ज़्यादा')]]},
  {id:'sleep', label:'sleep', opts:C.SLEEPS}
];
SPG.data.modules.head = {id:'head', order:10,
  card:{reg:['temple_l','forehead','jaw_l','eye_l'], view:{az:0.5, el:0.08, d:0.6, yk:'c4', dy:0.08}, hint:L('Migraine, tension headache, headache from the neck, jaw (TMJ) pain, face pain','माइग्रेन, टेंशन सिरदर्द, गर्दन से सिरदर्द, जबड़े (TMJ) का दर्द, चेहरे का दर्द')},
  name:L('Headache, face or jaw pain','सिरदर्द, चेहरे या जबड़े का दर्द'), safetyView:'band', startRegions:['temple_l','jaw_l'], safetyRegions:['forehead','temple_l','temple_r','occiput'],
  labelSet:['C1','C2','C3','C4'], GAL:{d:0.40, ld:0.36, td:0.17, ref:'C2', refDy:0, nerves:['cord']}, defaultDept:'gp',
  resultView:{az:0.5, el:0.08, d:0.65, yk:'c4', dy:0.07},
  ONSETS, PAT, RFS, VIEWS, AREAS, TESTS, CONDS, EMERG, ROOTS:{}, RS, DERIVED, SIDES:{areas:['temple','eye','jaw'], one:'head_one', both:'head_both', sideAreas:['temple','eye','jaw']},
  URGENCY, EMERG_WHEN, ROOT_RULES:[], DISC_OF:{}, EXIT_OF:{}, DEPT_RULES:[], FOCUS, LBLX, UI, FUNCS, FX, STATS};
})();
