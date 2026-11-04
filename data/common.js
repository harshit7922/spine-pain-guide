window.SPG = window.SPG || {data:{modules:{}}};
/* Shared research data: sources, interface text, common questions, departments, urgency levels and answer explanations.
   Edit this file to change wording or evidence; the app reads it at start-up. */
(function(){
const PI = Math.PI;
const L = (en, hi) => ({en, hi});
const SRC = [
  ['who','WHO guideline on chronic low back pain (summary, Health Policy Watch, 2023)','https://healthpolicy-watch.news/who-issues-first-guidelines-low-back-pain/'],
  ['ortho','Orthobullets – Lumbar disc herniation','https://www.orthobullets.com/spine/2035/lumbar-disc-herniation'],
  ['chiu','Chiu CC et al. Probability of spontaneous regression of lumbar herniated disc. Clin Rehabil 2015;29:184–95 (summary)','https://www.painscience.com/biblio/intervertebral-disc-injuries-spontaneously-regress-surprisingly-often--and-worse-ones-more.html'],
  ['cochrane','Cochrane review CD007431 – Physical examination for lumbar radiculopathy due to disc herniation','https://www.cochrane.org/evidence/CD007431_physical-examination-diagnosis-lumbar-radiculopathy-due-disc-herniation-patients-low-back-pain-and'],
  ['ajnr','Brinjikji W et al. Imaging features of spinal degeneration in asymptomatic populations. AJNR 2015;36:811–6','https://www.ajnr.org/content/36/4/811'],
  ['nomen','Radiology Assistant – Lumbar disc nomenclature 2.0','https://radiologyassistant.nl/neuroradiology/spine/lumbar-disc-nomenclature-2-0'],
  ['nass','North American Spine Society – Bulge vs herniation','https://www.spine.org/KnowYourBack/Conditions/Degenerative-Conditions/Bulge-Herniation'],
  ['msd','MSD Manual – Symptoms of common radiculopathies by dermatomal level','https://www.msdmanuals.com/professional/multimedia/table/symptoms-of-common-radiculopathies-by-dermatomal-level'],
  ['physio','Physiopedia – Lumbar radiculopathy assessment (myotomes, reflexes)','https://www.physio-pedia.com/Lumbar_Radiculopathy_Assessment'],
  ['medm','Medmastery – Diagnosing lumbar radiculopathy','https://www.medmastery.com/guide/neurology-diseases-clinical-guide/diagnosing-lumbar-radiculopathy'],
  ['nice','NICE NG59 – Low back pain and sciatica in over 16s','https://www.nice.org.uk/guidance/ng59/chapter/Recommendation'],
  ['ces','Royal Free London NHS – Cauda equina syndrome warning signs','https://royalfree.nhs.uk/patients-and-visitors/patient-information-leaflets/cauda-equina-syndrome'],
  ['wikem','WikEM – Back pain red flags','https://wikem.org/wiki/Back_pain_(red_flags)'],
  ['msdss','MSD Manual – Lumbar spinal stenosis','https://www.msdmanuals.com/professional/musculoskeletal-and-connective-tissue-disorders/neck-and-back-pain/lumbar-spinal-stenosis'],
  ['asas','ASAS criteria for inflammatory back pain','https://empendium.com/mcmtextbook/table/031_6932'],
  ['fx','Spine-health – Vertebral fracture symptoms','https://spine-health.com/conditions/osteoporosis/vertebral-fracture-symptoms'],
  ['pott',"Pott's disease (spinal tuberculosis)",'https://en.wikipedia.org/wiki/Pott%27s_disease'],
  ['kid','NHS 111 Wales – Kidney stones','https://111.wales.nhs.uk/kidneystones/'],
  ['coc','Texas Orthopedics – Coccydynia','https://www.txortho.com/patient-education-article/coccydynia-tailbone-pain-969'],
  ['nums','Medical emergency numbers in India (108, 112)','https://zhl.org.in/blog/medical-emergency-numbers-india/'],
  ['suri','Suri P et al. Does this older adult with lower extremity pain have lumbar spinal stenosis? JAMA Rational Clinical Examination 2010 (likelihood ratios summarised by TheNNT)','https://thennt.com/lr/spinal-stenosis-in-the-elderly/'],
  ['downie','Downie A et al. Red flags to screen for malignancy and fracture in patients with low back pain: systematic review. BMJ 2013;347:f7095','https://repub.eur.nl/pub/72777'],
  ['nadeau','Nadeau M et al. The reliability of differentiating neurogenic claudication from vascular claudication based on symptomatic presentation. Can J Surg 2013;56(6):372-7','https://www.canjsurg.ca/content/cjs/56/6/372.full.pdf'],
  ['rudw06','Rudwaleit M et al. Inflammatory back pain in ankylosing spondylitis: a reassessment of the clinical history for application as classification and diagnostic criteria. Arthritis Rheum 2006 (2 of 4 criteria LR 3.7; 3 of 4 LR 12.4)','https://mrcpfacts.blogspot.com/2008/10/recognition-of-inflammatory-back-pain.html'],
  ['rudw04','Rudwaleit M et al. How to diagnose axial spondyloarthritis early. Ann Rheum Dis 2004;63:535-43','https://ard.bmj.com/content/63/5/535'],
  ['costa','da C Menezes Costa L et al. The prognosis of acute and persistent low-back pain: a meta-analysis. CMAJ 2012;184:E613-24','https://pmc.ncbi.nlm.nih.gov/articles/PMC3414626/'],
  ['whocplbp','WHO guideline for non-surgical management of chronic primary low back pain in adults (2023), summary brochure','https://cdn.who.int/media/docs/default-source/mca-documents/ageing/lbp/summary_who_guideline_lower-back-pain_brochure_v7.pdf'],
  ['vitd','Siddiqee MH et al. High prevalence of vitamin D deficiency among South Asian adults: systematic review and meta-analysis. BMC Public Health 2021 (India: 67%)','https://pmc.ncbi.nlm.nih.gov/articles/PMC8501935'],
  ['tbindia','WHO Global Tuberculosis Report 2025: India still about 25% of the global TB burden (news summary)','https://health.medicaldialogues.in/health-topics/respiratory-health/india-records-21-drop-in-tb-cases-still-accounts-for-25-of-global-burden-who-tb-report-158564'],
  ['cesacc','Diagnostic accuracy of red flags for cauda equina syndrome: systematic review (World Physiotherapy congress abstract): sensitivity 19-43%, specificity 62-88%','https://world.physio/congress-proceeding/what-clinical-diagnostic-accuracy-red-flags-related-cauda-equina-syndrome-ces']
];
const U = {
  brand:L('Spine Pain Guide','रीढ़ दर्द गाइड'), tag:L('Spine assessment','रीढ़ दर्द जांच'), sos:L('Emergency','इमरजेंसी'),
  secs:[L('Profile','प्रोफ़ाइल'),L('Location','जगह'),L('Onset','शुरुआत'),L('Pattern','पैटर्न'),L('Function','असर'),L('Exam','टेस्ट'),L('Red flags','खतरे'),L('Result','नतीजा')],
  kicker:L('Clinical self-assessment · Spine','क्लिनिकल सेल्फ-असेसमेंट · रीढ़'),
  title:L('Find the likely cause of your spine pain and the right specialist','अपने रीढ़ के दर्द का संभावित कारण और सही विशेषज्ञ जानें'),
  lede:L('A structured assessment built on clinical guidelines: where it hurts, how it started, how it behaves, simple bedside tests and a red-flag screen. You get a root-cause explanation with realistic 3D images of your spine, discs and nerves, and a PDF report to take to your doctor.','क्लिनिकल गाइडलाइंस पर बनी व्यवस्थित जांच: दर्द कहाँ है, कैसे शुरू हुआ, कैसा व्यवहार करता है, कुछ आसान टेस्ट और खतरे के लक्षणों की जांच। आपको अपनी रीढ़, डिस्क और नसों की असली जैसी 3D तस्वीरों के साथ मूल कारण की व्याख्या और डॉक्टर को दिखाने के लिए PDF रिपोर्ट मिलेगी।'),
  problem:L('Where is the main problem?','मुख्य समस्या कहाँ है?'),
  pLow:L('Lower back pain, with or without leg pain','कमर दर्द, पैर के दर्द के साथ या बिना'),
  pNeck:L('Neck and arm pain (in development)','गर्दन और हाथ का दर्द (तैयार हो रहा है)'),
  pThor:L('Upper and mid back pain (in development)','ऊपरी और बीच की पीठ का दर्द (तैयार हो रहा है)'),
  begin:L('Begin assessment','जांच शुरू करें'),
  meta1:L('7 sections, about 4 minutes','7 हिस्से, लगभग 4 मिनट'),
  meta2:L('Runs in your browser; nothing is stored or sent','आपके ब्राउज़र में चलता है; कुछ भी सेव या भेजा नहीं जाता'),
  meta3:L('Decision support, not a diagnosis','निर्णय में मदद, डायग्नोसिस नहीं'),
  numsT:L('Spine pain by the numbers','आंकड़ों में रीढ़ का दर्द'),
  coversT:L('What the assessment covers','जांच में क्या शामिल है'),
  covers:[L('<b>Profile</b> – age, sex and medical history','<b>प्रोफ़ाइल</b> – उम्र, लिंग और मेडिकल इतिहास'),L('<b>Location</b> – body areas mapped to nerve roots on a realistic 3D body','<b>जगह</b> – असली जैसे 3D शरीर पर नस की जड़ों से जुड़े हिस्से'),L('<b>Onset</b> – how and when it started','<b>शुरुआत</b> – कैसे और कब शुरू हुआ'),L('<b>Pattern</b> – what the pain feels like and what changes it','<b>पैटर्न</b> – दर्द कैसा है और किससे बदलता है'),L('<b>Function</b> – pain score, walking, sitting, sleep','<b>असर</b> – दर्द स्कोर, चलना, बैठना, नींद'),L('<b>Exam</b> – simple bedside tests you can do at home','<b>टेस्ट</b> – घर पर होने वाले आसान टेस्ट'),L('<b>Red flags</b> – signs that need urgent care','<b>खतरे</b> – तुरंत इलाज वाले लक्षण')],
  stepOf:L('Step {a} of {b}','चरण {a} / {b}'),
  cont:L('Continue','आगे बढ़ें'), back:L('Back','पीछे'), seeRes:L('See result','नतीजा देखें'),
  // profile
  profT:L('About you','आपके बारे में'), profS:L('Age and history change which causes are likely and how urgent they are.','उम्र और इतिहास से संभावित कारण और उनकी गंभीरता बदलती है।'),
  age:L('Age','उम्र'), sex:L('Sex','लिंग'), ep:L('Has this happened before?','क्या पहले भी ऐसा हुआ है?'), hist:L('Medical history (tick any that apply)','मेडिकल इतिहास (जो लागू हो, चुनें)'),
  needAge:L('Choose your age group to continue.','आगे बढ़ने के लिए उम्र चुनें।'),
  // areas
  areaK:L('Area {a} of {b}','हिस्सा {a} / {b}'),
  qArea:L('Do you have pain, numbness or tingling in the highlighted area?','क्या चमकते हुए हिस्से में दर्द, सुन्नपन या झुनझुनी है?'),
  yes:L('Yes','हाँ'), no:L('No','नहीं'), left:L('Left','बायां'), right:L('Right','दायां'), both:L('Both','दोनों'),
  sideNote:L('Left and right are your own left and right.','बायां और दायां यानी आपका अपना बायां और दायां।'),
  rel:L('Clinical relevance','क्लिनिकल महत्व'),
  domT:L('Which troubles you more: back pain or leg pain?','ज़्यादा तकलीफ़ किसमें है: कमर के दर्द में या पैर के दर्द में?'),
  domWhy:L('Leg pain worse than back pain is typical of a pressed nerve root (sciatica).','पैर का दर्द कमर से ज़्यादा होना नस की जड़ दबने (साइटिका) का खास लक्षण है।'),
  // onset
  onT:L('How did it start?','यह कैसे शुरू हुआ?'), onS:L('Pick the closest match.','सबसे करीबी विकल्प चुनें।'),
  since:L('When did this current bout of pain start?','इस बार का दर्द कब शुरू हुआ?'), sinceH:L('Count from the day the pain started this time, even if you have had similar pain before.','इस बार जिस दिन दर्द शुरू हुआ, वहीं से गिनें — चाहे पहले भी ऐसा दर्द हुआ हो।'),
  hx:L('When did you first ever get pain in this part of the spine?','रीढ़ के इस हिस्से में पहली बार दर्द कब हुआ था?'), hxH:L('Think back to the very first time, even if it went away completely in between.','बिल्कुल पहली बार के बारे में सोचें, चाहे बीच में पूरी तरह ठीक हो गया हो।'),
  btw:L('Between bouts, how is it?','दो दौरों के बीच कैसा रहता है?'),
  timeT:L('When did it start?','दर्द कब से है?'), timeS:L('Two separate questions: when this bout started, and when you first ever had this pain.','दो अलग सवाल: इस बार का दर्द कब शुरू हुआ, और पहली बार कब हुआ था।'),
  timeWhy:L('Doctors separate the two. This bout: under 6 weeks is called acute, 6 weeks to 3 months sub-acute, over 3 months chronic. Overall history: years of pain that comes and goes points to wear-and-tear or inflammatory causes, while a brand-new pain that keeps getting worse needs closer checking.','डॉक्टर इन दोनों को अलग देखते हैं। इस बार का दर्द: 6 हफ्ते से कम को एक्यूट, 6 हफ्ते से 3 महीने को सब-एक्यूट और 3 महीने से ज़्यादा को क्रॉनिक कहते हैं। पूरा इतिहास: सालों से आता-जाता दर्द घिसाव या सूजन वाली बीमारी की ओर इशारा करता है, जबकि बिल्कुल नया और लगातार बढ़ता दर्द ज़्यादा ध्यान से जांचना होता है।'),
  needTime:L('Answer both questions (this bout and first time) to continue.','आगे बढ़ने के लिए दोनों सवालों (इस बार और पहली बार) का जवाब दें।'),
  tlFirst:L('First time','पहली बार'), rpSkin:L('Where on the body','शरीर पर कहाँ'), inst:L('Install app','ऐप इंस्टॉल करें'), instT:L('Use it like an app','इसे ऐप की तरह इस्तेमाल करें'), instS:L('Add an icon to your phone. It opens full-screen and works without internet.','फ़ोन पर आइकन जोड़ें। यह पूरी स्क्रीन पर खुलेगा और बिना इंटरनेट के भी चलेगा।'), instDone:L('Installed. Open it from your home screen.','इंस्टॉल हो गया। होम स्क्रीन से खोलें।'), instClose:L('Close','बंद करें'),
  instIos:[L('Open this page in Safari.','यह पेज Safari में खोलें।'), L('Tap the Share button {share} at the bottom (on iPad, at the top).','नीचे शेयर बटन {share} दबाएं (iPad पर ऊपर)।'), L('Scroll and tap “Add to Home Screen” {add}.','नीचे स्क्रॉल करके “Add to Home Screen” {add} दबाएं।'), L('Tap “Add”. The Spine Guide icon appears on your home screen.','“Add” दबाएं। होम स्क्रीन पर Spine Guide का आइकन आ जाएगा।')],
  instAnd:[L('Open the browser menu {menu} (top right in Chrome).','ब्राउज़र का मेन्यू {menu} खोलें (Chrome में ऊपर दाईं ओर)।'), L('Tap “Install app” or “Add to Home screen”.','“Install app” या “Add to Home screen” दबाएं।'), L('Confirm. The icon appears on your home screen.','पुष्टि करें। होम स्क्रीन पर आइकन आ जाएगा।')],
  instDesk:[L('In Chrome or Edge, click the install icon {add} at the right end of the address bar.','Chrome या Edge में एड्रेस बार के दाएं सिरे पर इंस्टॉल आइकन {add} दबाएं।'), L('Click “Install”. The app opens in its own window.','“Install” दबाएं। ऐप अपनी अलग विंडो में खुलेगा।')],
  tpPain:L('Pain felt here if the test is positive','टेस्ट पॉज़िटिव हो तो यहाँ दर्द'), tpWork:L('Muscles being tested','जिन मांसपेशियों की जांच होती है'), tpMove:L('Arrow: the movement','तीर: हरकत की दिशा'), rpBone:L('Bones and nerves underneath','अंदर की हड्डियां और नसें'), tlNow:L('This bout','इस बार'), tlToday:L('Today','आज'), tlYrs:L('years','साल'), trend:L('Since it started, it is','शुरू होने के बाद से यह'),
  needOn:L('Choose how it started to continue.','आगे बढ़ने के लिए चुनें कि यह कैसे शुरू हुआ।'),
  // pattern
  patT:L('How does the pain behave?','दर्द कैसा व्यवहार करता है?'), patS:L('Select everything that applies. Leave out anything you are unsure about.','जो-जो लागू हो, सब चुनें। जिसका पक्का न हो, छोड़ दें।'),
  gChar:L('What it feels like','कैसा महसूस होता है'), gWorse:L('Worse with','किससे बढ़ता है'), gBetter:L('Better with','किससे आराम मिलता है'), gOther:L('Other','अन्य'),
  // function
  funT:L('Impact on daily life','रोज़मर्रा पर असर'), pain:L('Pain right now','अभी दर्द'), painS:L('0 = no pain · 10 = worst imaginable','0 = कोई दर्द नहीं · 10 = सबसे ज़्यादा'),
  walk:L('Walking','चलना'), sit:L('Sitting','बैठना'), sleep:L('Sleep','नींद'), needFun:L('Answer walking and sitting to continue.','आगे बढ़ने के लिए चलना और बैठना चुनें।'),
  // tests
  testK:L('Bedside test {a} of {b}','टेस्ट {a} / {b}'), how:L('How to do it','कैसे करें'), pos:L('Counts as positive','कब पॉज़िटिव माना जाए'),
  safeT:L('Skip any test if pain is severe or you cannot stand safely. Stop at the first sharp pain.','दर्द बहुत ज़्यादा हो या सुरक्षित खड़े न हो पाएं तो टेस्ट छोड़ दें। पहला तेज़ दर्द होते ही रुक जाएं।'),
  tPos:L('Positive','पॉज़िटिव'), tNeg:L('Negative','नेगेटिव'), tSkip:L('Could not do / skip','नहीं कर पाए / छोड़ें'), tWeak:L('Weak or unable','कमज़ोर या नहीं हुआ'), tNorm:L('Normal','सामान्य'),
  acc:L('Accuracy','सटीकता'),
  // safety
  safT:L('Red-flag screen','खतरे के लक्षणों की जांच'), safS:L('These signs need urgent care. Answer every line.','इन लक्षणों में तुरंत इलाज चाहिए। हर लाइन का जवाब दें।'), needSaf:L('Answer every line to see your result.','नतीजा देखने के लिए हर लाइन का जवाब दें।'),
  // result
  resK:L('Assessment result','जांच का नतीजा'), keyF:L('Key findings','मुख्य बातें'),
  imp:L('Clinical impression','क्लिनिकल आकलन'), primary:L('Most likely','सबसे संभावित'),
  strong:L('Strong match','मज़बूत मेल'), moderate:L('Moderate match','मध्यम मेल'), possible:L('Possible','संभव'), ruleout:L('Rule out','जांच ज़रूरी'),
  sup:L('Supports','पक्ष में'), ag:L('Against','विपक्ष में'),
  diff:L('Other possibilities','दूसरी संभावनाएं'), thCond:L('Condition','स्थिति'), thMatch:L('Match','मेल'), thWhy:L('Main reason','मुख्य कारण'), thSpec:L('Specialist','विशेषज्ञ'),
  rca:L('Root cause explained','मूल कारण की व्याख्या'),
  sag:L('Side view of the lumbar spine. The highlighted disc presses the nerve root shown in orange.','कमर की रीढ़ का साइड व्यू। चमकती डिस्क नारंगी रंग की नस की जड़ को दबा रही है।'),
  ax:L('Cross-section at the disc, viewed from the feet as on an MRI (your left is on the right).','डिस्क का क्रॉस-सेक्शन, पैरों की ओर से देखा गया जैसे MRI में (आपका बायां दाईं तरफ है)।'),
  types:L('Disc herniation types (Nomenclature 2.0) and how often each shrinks on its own','डिस्क हर्निएशन के प्रकार (नोमेनक्लेचर 2.0) और कितनी बार अपने आप सिकुड़ते हैं'),
  nerveT:L('Nerve root reference','नस की जड़ (नर्व रूट) संदर्भ'),
  thRoot:L('Root','रूट'), thSkin:L('Pain and numbness','दर्द और सुन्नपन'), thMus:L('Weakness','कमज़ोरी'), thRef:L('Reflex','रिफ्लेक्स'), thDisc:L('Usual disc','आम डिस्क'), thTest:L('Home test','घर का टेस्ट'),
  confirm:L('How doctors confirm it','डॉक्टर कैसे पुष्टि करते हैं'), outlook:L('Outlook','आगे क्या होता है'),
  docs:L('Which specialist to see','किस विशेषज्ञ को दिखाएं'), startHere:L('Start here','यहाँ से शुरू करें'), forL:L('For','किसलिए'), near:L('Find near me','पास में खोजें'),
  until:L('Until your appointment','अपॉइंटमेंट तक'),
  tip1:L('Stay as active as the pain allows; short, frequent walks are better than bed rest.','दर्द जितना इजाज़त दे, सक्रिय रहें; बिस्तर पर आराम से बेहतर हैं छोटी-छोटी, बार-बार सैर।'),
  tip2:L('Avoid heavy lifting and long sitting; change position every 30–45 minutes.','भारी वज़न उठाने और देर तक बैठने से बचें; हर 30–45 मिनट में पोज़िशन बदलें।'),
  tip3:L('Take medicines only as prescribed by your doctor.','दवाएं सिर्फ डॉक्टर की सलाह से लें।'),
  rep:L('Report for your doctor','डॉक्टर के लिए रिपोर्ट'), repS:L('PDF with your answers, body map pictures, the clinical impression, root-cause diagrams and sources.','PDF जिसमें आपके जवाब, बॉडी मैप की तस्वीरें, क्लिनिकल आकलन, मूल कारण के चित्र और स्रोत हैं।'),
  dl:L('Download report (PDF)','रिपोर्ट डाउनलोड करें (PDF)'), prep:L('Preparing report…','रिपोर्ट तैयार हो रही है…'), saved:L('Report saved.','रिपोर्ट सेव हो गई।'),
  declined:L('Download cancelled.','डाउनलोड रद्द।'), busy:L('A download prompt is already open.','एक डाउनलोड पहले से खुला है।'),
  dlNA:L('Downloads are not available in this view. Open the page in your browser to save the report.','इस व्यू में डाउनलोड उपलब्ध नहीं है। रिपोर्ट सेव करने के लिए पेज ब्राउज़र में खोलें।'),
  dlFail:L('The report could not be created. Please try again.','रिपोर्ट नहीं बन पाई। फिर से कोशिश करें।'),
  edit:L('Change answers','जवाब बदलें'), restart:L('New assessment','नई जांच'),
  call108:L('Ambulance','एम्बुलेंस'), call112:L('All emergencies','सभी इमरजेंसी'), callN:L('If tapping does not open your dialer, dial the number yourself.','अगर टैप से डायलर न खुले, तो नंबर खुद डायल करें।'),
  anatNote:L('Switch the 3D viewer to Anatomy to see the affected disc and the nerve path down the leg.','प्रभावित डिस्क और पैर में नस का रास्ता देखने के लिए 3D व्यू को एनाटॉमी पर करें।'),
  disc:L('This tool supports decisions about how soon to seek care and which specialist to see. It does not diagnose or treat, and it does not replace an examination by a doctor. If you feel very unwell or are worried, go to a hospital.','यह टूल यह तय करने में मदद करता है कि इलाज कितनी जल्दी लें और किस विशेषज्ञ को दिखाएं। यह डायग्नोसिस या इलाज नहीं करता, और डॉक्टर की जांच की जगह नहीं लेता। तबीयत बहुत खराब लगे या चिंता हो, तो अस्पताल जाएं।'),
  srcT:L('Sources','स्रोत'),
  skin:L('Skin','त्वचा'), anat:L('Anatomy','एनाटॉमी'), front:L('Front','आगे'), backV:L('Back','पीछे'), vF:L('Front view','आगे से'), vB:L('Back view','पीछे से'),
  drag:L('Drag to rotate · scroll, pinch or + − to zoom','घुमाने के लिए खींचें · ज़ूम के लिए स्क्रॉल, पिंच या + −'), zIn:L('Zoom in','ज़ूम इन'), zOut:L('Zoom out','ज़ूम आउट'), rotL:L('Turn left','बाएं घुमाएं'), rotR:L('Turn right','दाएं घुमाएं'), zReset:L('Reset view','व्यू रीसेट करें'), lgBone:L('Bone','हड्डी'), lgDisc:L('Disc','डिस्क'), spineV:L('Spine','रीढ़'),
  mustT:L('A doctor’s examination is essential','डॉक्टर की जांच ज़रूरी है'), must:[L('This assessment cannot test your reflexes, muscle strength or skin sensation, which show which nerve is involved and how badly.','यह जांच आपके रिफ्लेक्स, मांसपेशियों की ताकत या त्वचा की संवेदना नहीं परख सकती, जिनसे पता चलता है कि कौन सी नस और कितनी प्रभावित है।'),L('Only a doctor can decide whether you need an MRI, X-ray or blood tests, and interpret them alongside your examination.','MRI, एक्स-रे या ब्लड टेस्ट की ज़रूरत है या नहीं, यह सिर्फ डॉक्टर तय कर सकते हैं और जांच के साथ उनका मतलब समझा सकते हैं।'),L('Similar pain can come from the hip, kidney, pelvis or abdomen; a doctor examines these too.','ऐसा ही दर्द कूल्हे, गुर्दे, पेल्विस या पेट से भी हो सकता है; डॉक्टर इनकी भी जांच करते हैं।'),L('Medicines, injections and exercise plans must be chosen for you personally.','दवाएं, इंजेक्शन और व्यायाम योजना आपके लिए व्यक्तिगत रूप से तय होनी चाहिए।')],
  whyT:L('Why your answers point here','आपके जवाब यहाँ क्यों इशारा करते हैं'), causesT:L('Why it happens','यह क्यों होता है'), treatT:L('How it is treated','इलाज कैसे होता है'),
  galT:L('3D anatomy of your problem','आपकी समस्या की 3D एनाटॉमी'), galN:L('Images are generated from your answers on an anatomical model. They illustrate the likely problem; they are not your scan.','ये तस्वीरें आपके जवाबों से एनाटॉमिकल मॉडल पर बनाई गई हैं। ये संभावित समस्या समझाती हैं; ये आपका स्कैन नहीं हैं।'), galWait:L('Rendering 3D images…','3D तस्वीरें बन रही हैं…'),
  gPost:L('Lumbar spine from behind, vertebrae numbered. Pink: affected disc. Red: the herniated part. Orange: the pressed nerve root and its path into the leg.','पीछे से कमर की रीढ़, हड्डियों पर नंबर। गुलाबी: प्रभावित डिस्क। लाल: बाहर निकला हिस्सा (हर्निएशन)। नारंगी: दबी हुई नस की जड़ और पैर में उसका रास्ता।'), gLat:L('Side view: the disc bulging backwards into the space where the nerve roots run.','साइड व्यू: डिस्क पीछे की ओर उस जगह में उभरी हुई जहाँ से नसें गुज़रती हैं।'), gTop:L('Looking down on the {a} disc with the vertebra above removed, as on an MRI cross-section.','ऊपर की हड्डी हटाकर {a} डिस्क को ऊपर से देखना, जैसे MRI क्रॉस-सेक्शन में।'), gX:L('Nerve path: the affected root continues into the leg, which is why pain travels where you marked it.','नस का रास्ता: प्रभावित जड़ पैर में जाती है, इसीलिए दर्द वहाँ जाता है जहाँ आपने चिन्हित किया।'), gRef:L('Lumbar spine, pelvis and leg nerves for reference.','संदर्भ के लिए कमर की रीढ़, पेल्विस और पैर की नसें।'), gBack:L('Areas you marked, back view','आपके चिन्हित हिस्से, पीछे से'), gFront:L('Areas you marked, front view','आपके चिन्हित हिस्से, आगे से'),
  lgNerve:L('Nerve','नस'), lgHit:L('Affected','प्रभावित'), lgNerve:L('Nerve','नस'), lgHit:L('Affected','प्रभावित'),
  noGL:L('This device cannot show the 3D model. Every question still works.','यह डिवाइस 3D मॉडल नहीं दिखा सकता। फिर भी हर सवाल काम करेगा।'),
  sideL:L('left','बायां'), sideR:L('right','दायां'), sideB:L('both sides','दोनों तरफ'),
  repT:L('Lower back pain assessment','कमर दर्द जांच रिपोर्ट'), created:L('Created','बनाई गई'), page:L('Page','पेज'), notDx:L('Decision support, not a diagnosis','निर्णय में मदद, डायग्नोसिस नहीं'),
  ansT:L('Your answers','आपके जवाब'), marked:L('Areas marked','चुने गए हिस्से'), none:L('None','कोई नहीं'), notA:L('Not answered','जवाब नहीं'),
  bodyMap:L('Body map','बॉडी मैप'), rfNone:L('No to all warning signs','सभी खतरे के लक्षणों में "नहीं"'), closeups:L('Marked areas','चुने गए हिस्से')
};

/* ================= options ================= */
const AGES = [['a_u18',L('Under 18','18 से कम')],['a_18_29',L('18–29','18–29')],['a_30_39',L('30–39','30–39')],['a_40_49',L('40–49','40–49')],['a_50_59',L('50–59','50–59')],['a_60p',L('60 or over','60 या ज़्यादा')]];
const SEXES = [['sex_m',L('Male','पुरुष')],['sex_f',L('Female','महिला')],['sex_x',L('Prefer not to say','नहीं बताना')]];
const EPIS = [['ep_first',L('First episode','पहली बार')],['ep_recur',L('Has happened before','पहले भी हुआ है')]];
const RISKS = [
  ['r_cancer',L('Cancer, now or in the past','कैंसर, अभी या पहले')],
  ['r_bones',L('Osteoporosis, or steroid tablets for 3+ months','ऑस्टियोपोरोसिस, या 3+ महीने स्टेरॉयड की गोलियां')],
  ['r_immune',L('Diabetes, HIV or low immunity','डायबिटीज़, HIV या कम इम्युनिटी')],
  ['r_tb',L('TB now or before, or a TB patient at home','अभी या पहले टीबी, या घर में टीबी मरीज़')],
  ['r_spa',L('Psoriasis, inflammatory bowel disease or recurring red, painful eye','सोरायसिस, आंतों की सूजन (IBD) या बार-बार लाल, दर्द भरी आंख')],
  ['r_desk',L('Desk job or long hours of sitting','डेस्क जॉब या लंबे समय बैठना')],
  ['r_heavy',L('Heavy physical work','भारी शारीरिक काम')],
  ['r_vasc',L('Smoking or tobacco, diabetes, high blood pressure or high cholesterol','धूम्रपान या तंबाकू, डायबिटीज़, हाई बीपी या हाई कोलेस्ट्रॉल')],
  ['r_famspa',L('Parent, brother or sister with ankylosing spondylitis, psoriasis or inflammatory bowel disease','माता-पिता या भाई-बहन को एंकिलॉज़िंग स्पॉन्डिलाइटिस, सोरायसिस या आंतों की सूजन (IBD)')]
];
const ONSETS = [
  ['on_getup',L('Getting up quickly from bed or a chair','बिस्तर या कुर्सी से जल्दी उठते समय')],
  ['on_bend',L('Bending forward to pick something up','कुछ उठाने के लिए आगे झुकते समय')],
  ['on_lift',L('Lifting something heavy','भारी चीज़ उठाते समय')],
  ['on_twist',L('Twisting, sport or a gym workout','मुड़ते समय, खेल या जिम में')],
  ['on_cough',L('A strong cough or sneeze','ज़ोर की खांसी या छींक')],
  ['on_sitting',L('After long sitting, driving or travel','लंबे समय बैठने, ड्राइविंग या सफर के बाद')],
  ['on_woke',L('Woke up with it','सोकर उठे तो दर्द था')],
  ['on_fall',L('Slip or fall (stairs, bathroom, floor)','फिसलना या गिरना (सीढ़ी, बाथरूम, फर्श)')],
  ['on_accident',L('Road accident','सड़क दुर्घटना')],
  ['on_blow',L('Fight, hit or a direct blow to the back','लड़ाई, मार या पीठ पर सीधी चोट')],
  ['on_preg',L('During pregnancy or after delivery','गर्भावस्था में या डिलीवरी के बाद')],
  ['on_gradual',L('Slowly, with no clear reason','धीरे-धीरे, बिना साफ़ वजह')]
];
const SINCE = [['d_days',L('Within the last week','पिछले 1 हफ्ते के अंदर')],['d_weeks',L('1 to 6 weeks ago','1 से 6 हफ्ते पहले')],['d_6_12',L('6 weeks to 3 months ago','6 हफ्ते से 3 महीने पहले')],['d_3m',L('More than 3 months ago, and it has not gone away since','3 महीने से भी पहले, और तब से गया नहीं')]];
/* History: when the pain in this part of the spine first ever started (separate from the current bout) */
const HX = [['h_first',L('This is the first time','यह पहली बार हुआ है')],['h_lt1y',L('First time was within the last year','पहली बार पिछले 1 साल के अंदर हुआ था')],['h_1_5y',L('First time was 1 to 5 years ago','पहली बार 1 से 5 साल पहले हुआ था')],['h_5y',L('First time was more than 5 years ago','पहली बार 5 साल से भी पहले हुआ था')]];
const BTW = [['btw_free',L('Completely fine between bouts','दो दौरों के बीच पूरी तरह ठीक रहता है')],['btw_some',L('Some pain always stays','थोड़ा दर्द हमेशा बना रहता है')],['btw_often',L('Bouts now come more often or are getting worse','दौरे अब जल्दी-जल्दी आते हैं या ज़्यादा तेज़ हो रहे हैं')]];
/* Longer labels used in findings, explanations and the PDF report */
const LBLX = {
  d_days:L('This bout started within the last week','इस बार का दर्द पिछले 1 हफ्ते के अंदर शुरू हुआ'), d_weeks:L('This bout started 1 to 6 weeks ago','इस बार का दर्द 1 से 6 हफ्ते पहले शुरू हुआ'),
  d_6_12:L('This bout started 6 weeks to 3 months ago','इस बार का दर्द 6 हफ्ते से 3 महीने पहले शुरू हुआ'), d_3m:L('This bout has lasted more than 3 months without going away','इस बार का दर्द 3 महीने से ज़्यादा से है, गया नहीं'),
  h_first:L('First time ever with this pain','ऐसा दर्द पहली बार हुआ है'), h_lt1y:L('First had this pain within the last year','पहली बार यह दर्द पिछले 1 साल में हुआ'),
  h_1_5y:L('First had this pain 1 to 5 years ago','पहली बार यह दर्द 1 से 5 साल पहले हुआ'), h_5y:L('First had this pain more than 5 years ago','पहली बार यह दर्द 5 साल से भी पहले हुआ'),
  btw_free:L('Completely fine between bouts','दौरों के बीच पूरी तरह ठीक'), btw_some:L('Some pain always stays between bouts','दौरों के बीच भी थोड़ा दर्द रहता है'), btw_often:L('Bouts coming more often or getting worse','दौरे जल्दी-जल्दी या ज़्यादा तेज़')
};
const TRENDS = [['t_better',L('Getting better','ठीक हो रहा है')],['t_same',L('About the same','लगभग वैसा ही')],['t_worse',L('Getting worse','बढ़ रहा है')]];
const WALKS = [['walk_ok',L('Normally','सामान्य')],['walk_diff',L('With difficulty','मुश्किल से')],['walk_no',L('Cannot walk or stand','चल या खड़े नहीं हो पाते')]];
const SITS = [['sit_ok',L('More than 30 minutes','30 मिनट से ज़्यादा')],['sit_30',L('Less than 30 minutes','30 मिनट से कम')],['sit_no',L('Cannot sit','बैठ नहीं पाते')]];
const SLEEPS = [['sleep_ok',L('Normal','सामान्य')],['sleep_bad',L('Pain wakes me up','दर्द से नींद खुलती है')]];
const DEPTS = {
  emergency:{n:L('Emergency department','इमरजेंसी विभाग'),s:L('Go now. Call 108 for an ambulance or 112 for any emergency.','अभी जाएं। एम्बुलेंस के लिए 108 या किसी भी इमरजेंसी के लिए 112 पर कॉल करें।'),q:'hospital emergency'},
  ortho_spine:{n:L('Orthopaedics – Spine','ऑर्थोपेडिक्स – स्पाइन'),s:L('Bone, joint and spine specialist; first stop for most back and sciatica problems.','हड्डी, जोड़ और रीढ़ के विशेषज्ञ; ज़्यादातर कमर और साइटिका की समस्याओं के लिए पहला कदम।'),q:'orthopedic spine specialist'},
  neurosurg:{n:L('Neurosurgery / Spine surgery','न्यूरोसर्जरी / स्पाइन सर्जरी'),s:L('For nerve compression with weakness, or pain that does not settle with treatment.','कमज़ोरी के साथ नस दबने, या इलाज से न सुधरने वाले दर्द के लिए।'),q:'neurosurgeon spine surgeon'},
  neuro:{n:L('Neurology','न्यूरोलॉजी'),s:L('Assesses nerve damage; nerve conduction studies and EMG.','नसों के नुकसान की जांच; नर्व कंडक्शन स्टडी और EMG।'),q:'neurologist'},
  physio:{n:L('Physiotherapy / PM&R','फिज़ियोथेरेपी / PMR'),s:L('Structured exercise and rehabilitation; the core of treatment for most back pain.','व्यवस्थित व्यायाम और रिहैबिलिटेशन; ज़्यादातर कमर दर्द के इलाज का मुख्य हिस्सा।'),q:'physiotherapist'},
  pain:{n:L('Pain medicine','पेन मेडिसिन'),s:L('Image-guided injections and nerve blocks for pain that persists.','लंबे दर्द के लिए इमेज-गाइडेड इंजेक्शन और नर्व ब्लॉक।'),q:'pain management clinic'},
  rheum:{n:L('Rheumatology','रूमेटोलॉजी'),s:L('Inflammatory arthritis of the spine; blood tests and SI-joint MRI.','रीढ़ की सूजन वाली गठिया; ब्लड टेस्ट और SI जोड़ का MRI।'),q:'rheumatologist'},
  ortho:{n:L('Orthopaedics','ऑर्थोपेडिक्स'),s:L('Hip, pelvis and tailbone problems.','कूल्हे, पेल्विस और टेलबोन की समस्याएं।'),q:'orthopedic doctor'},
  gp:{n:L('General physician','जनरल फिज़िशियन'),s:L('First assessment, blood and urine tests, and referral.','पहली जांच, ब्लड और यूरिन टेस्ट, और रेफरल।'),q:'general physician'},
  urology:{n:L('Urology','यूरोलॉजी'),s:L('Kidney stones and urinary tract problems.','गुर्दे की पथरी और मूत्र मार्ग की समस्याएं।'),q:'urologist'},
  id_tb:{n:L('Chest / TB specialist','चेस्ट / टीबी विशेषज्ञ'),s:L('Treats TB and other infections alongside the spine surgeon.','स्पाइन सर्जन के साथ टीबी और दूसरे इन्फेक्शन का इलाज।'),q:'TB chest specialist pulmonologist'},
  endo:{n:L('Endocrinology (bone health)','एंडोक्राइनोलॉजी (हड्डियों की सेहत)'),s:L('Osteoporosis, vitamin D and calcium.','ऑस्टियोपोरोसिस, विटामिन D और कैल्शियम।'),q:'endocrinologist osteoporosis'},
  gyn:{n:L('Obstetrics and gynaecology','स्त्री एवं प्रसूति रोग'),s:L('Pain related to pregnancy, delivery or periods.','गर्भावस्था, डिलीवरी या पीरियड्स से जुड़ा दर्द।'),q:'gynecologist'},
  onco:{n:L('Oncology','ऑन्कोलॉजी'),s:L('Only if tests by the spine doctor point to it.','सिर्फ तब, जब स्पाइन डॉक्टर की जांच में ज़रूरत लगे।'),q:'oncologist'}
};
// Each condition: weighted evidence; th = [strong, moderate, possible]
const STATS = [
  {v:'619 M',t:L('people live with low back pain; the leading cause of disability worldwide','लोग कमर दर्द से पीड़ित; दुनिया में विकलांगता का सबसे बड़ा कारण'),s:'who'},
  {v:'95%',t:L('of lumbar disc herniations occur at L4–L5 or L5–S1','लम्बर डिस्क हर्निएशन L4–L5 या L5–S1 पर होते हैं'),s:'ortho'},
  {v:'~90%',t:L('of people with a disc herniation improve within 3 months without surgery','डिस्क हर्निएशन वाले लोग 3 महीने में बिना सर्जरी बेहतर होते हैं'),s:'ortho'},
  {v:'70–96%',t:L('of extruded and sequestered discs shrink on their own','एक्सट्रूडेड और सीक्वेस्टर्ड डिस्क अपने आप सिकुड़ती हैं'),s:'chiu'},
  {v:'30% → 84%',t:L('of people with no pain show a disc bulge on MRI, at age 20 and 80','बिना दर्द वाले लोगों के MRI में डिस्क बल्ज, 20 और 80 की उम्र में'),s:'ajnr'},
  {v:'92%',t:L('sensitivity of the straight leg raise test for disc herniation','डिस्क हर्निएशन के लिए SLR टेस्ट की संवेदनशीलता'),s:'cochrane'}
];
DEPTS.vascular = {n:L('Vascular surgery','वैस्कुलर सर्जरी'),s:L('Blood vessel problems: aneurysm, or blocked leg arteries that cause calf pain on walking.','खून की नसों की इमरजेंसी, जैसे एन्यूरिज़्म।'),q:'vascular surgeon'};
const FX = {
  b_sit_nopain:L('No pain at all when sitting is one of the strongest clues to spinal stenosis (likelihood ratio 7.4).','बैठने पर बिल्कुल दर्द न होना स्पाइनल स्टेनोसिस का सबसे मज़बूत संकेतों में से एक है (likelihood ratio 7.4)।'),
  w_walk_calf:L('Calf pain on walking that eases just by standing still points to narrowed leg arteries rather than the spine (likelihood ratio 7.8).','चलने पर पिंडली का दर्द जो सिर्फ़ खड़े रहने से ठीक हो, रीढ़ के बजाय पैर की धमनियों के संकरेपन की ओर इशारा करता है (likelihood ratio 7.8)।'),
  ch_alt_buttock:L('Buttock pain that switches sides is one of the four classic inflammatory back pain features.','नितंब का दर्द जो तरफ़ बदलता है, सूजन वाले कमर दर्द के चार खास लक्षणों में से एक है।'),
  ch_heel:L('Heel pain without an injury can be inflammation where tendons attach (enthesitis), seen in spondyloarthritis (likelihood ratio 3.4).','बिना चोट एड़ी का दर्द टेंडन जुड़ने की जगह की सूजन (एंथेसाइटिस) हो सकता है, जो स्पॉन्डिलोआर्थराइटिस में दिखता है (likelihood ratio 3.4)।'),
  ibp2:L('Two or more inflammatory back pain features raise the chance of axial spondyloarthritis about 3.7 times.','सूजन वाले कमर दर्द के दो या ज़्यादा लक्षण एक्सियल स्पॉन्डिलोआर्थराइटिस की संभावना लगभग 3.7 गुना बढ़ाते हैं।'),
  ibp3:L('Three or more inflammatory back pain features raise the chance about 12 times.','तीन या ज़्यादा लक्षण संभावना लगभग 12 गुना बढ़ाते हैं।'),
  r_vasc:L('Smoking, diabetes, high blood pressure and high cholesterol narrow the leg arteries.','धूम्रपान, डायबिटीज़, हाई बीपी और हाई कोलेस्ट्रॉल पैर की धमनियों को संकरा करते हैं।'),
  r_famspa:L('Spondyloarthritis runs in families.','स्पॉन्डिलोआर्थराइटिस परिवारों में चलता है।'),
  fx_combo:L('Three of these together (female, over 60, major injury, weak bones or steroids) make a spinal fracture very likely.','इनमें से तीन एक साथ (महिला, 60 से ज़्यादा, बड़ी चोट, कमज़ोर हड्डियां या स्टेरॉयड) हों तो रीढ़ में फ्रैक्चर की बहुत संभावना होती है।'),
  below_knee:L('Symptoms below the knee point to a nerve root rather than a muscle, because muscle pain rarely travels that far.','घुटने के नीचे लक्षण मांसपेशी नहीं, नस की जड़ की ओर इशारा करते हैं, क्योंकि मांसपेशी का दर्द इतनी दूर कम जाता है।'),
  leg_any:L('Pain spreading from the back into the leg shows that a nerve or its root may be involved.','कमर से पैर में फैलता दर्द दिखाता है कि नस या उसकी जड़ शामिल हो सकती है।'),
  leg_one:L('Pain in one leg only fits a single pressed nerve root on that side.','सिर्फ एक पैर का दर्द उसी तरफ की एक दबी जड़ से मेल खाता है।'),
  dom_leg:L('Leg pain worse than back pain is a classic feature of sciatica.','कमर से ज़्यादा पैर का दर्द साइटिका का खास लक्षण है।'),
  ch_shoot:L('Sharp, electric pain running along a line is typical of an irritated nerve root.','एक रेखा में दौड़ता तेज़, करंट जैसा दर्द नस की जड़ में जलन का खास संकेत है।'),
  ch_tingle:L('Burning or pins and needles mean the nerve’s signals are disturbed.','जलन या झुनझुनी का मतलब है कि नस के संकेत गड़बड़ हैं।'),
  ch_numb:L('A numb patch shows the sensory fibres of a nerve are affected.','सुन्न हिस्सा दिखाता है कि नस के संवेदी तंतु प्रभावित हैं।'),
  w_sit:L('Sitting raises pressure inside the lumbar discs, so disc problems hurt more when you sit.','बैठने से कमर की डिस्क के अंदर दबाव बढ़ता है, इसलिए डिस्क की समस्या बैठने पर ज़्यादा दुखती है।'),
  w_bend:L('Bending forward squeezes the front of the disc and pushes its gel backwards towards the nerves.','आगे झुकने से डिस्क का अगला हिस्सा दबता है और जेल पीछे नसों की ओर जाता है।'),
  w_cough:L('Coughing and straining briefly raise pressure in the spinal canal, aggravating a pressed root.','खांसने और ज़ोर लगाने से स्पाइनल कैनाल में दबाव बढ़ता है, जिससे दबी जड़ में दर्द बढ़ता है।'),
  slr_pos:L('A positive straight leg raise stretches the lower nerve roots; pain past the knee means a root is irritated (92% sensitive).','पॉज़िटिव SLR निचली नस की जड़ों को खींचता है; घुटने के नीचे दर्द का मतलब है जड़ में जलन (92% संवेदनशील)।'),
  cslr_pos:L('Pain in the bad leg when the good leg is lifted is very specific (90%) for disc herniation.','अच्छा पैर उठाने पर खराब पैर में दर्द डिस्क हर्निएशन के लिए बहुत विशिष्ट (90%) है।'),
  heel_weak:L('Weak heel walking means the L4–L5 motor fibres are affected and needs prompt review.','एड़ी पर चलने में कमज़ोरी का मतलब है L4–L5 के मोटर तंतु प्रभावित हैं; जल्दी जांच ज़रूरी।'),
  toe_weak:L('Weak heel raise means the S1 motor fibres are affected and needs prompt review.','पंजों पर उठने में कमज़ोरी का मतलब है S1 के मोटर तंतु प्रभावित हैं; जल्दी जांच ज़रूरी।'),
  on_getup:L('A sudden load with the spine bent, such as getting up quickly, is the most common trigger for a disc herniation.','झुकी रीढ़ पर अचानक भार, जैसे जल्दी उठना, डिस्क हर्निएशन का सबसे आम कारण है।'),
  on_bend:L('Bending to pick something up loads the back of the disc.','कुछ उठाने को झुकना डिस्क के पिछले हिस्से पर भार डालता है।'),
  on_lift:L('Lifting a heavy weight loads both discs and muscles.','भारी वज़न उठाना डिस्क और मांसपेशियों दोनों पर भार डालता है।'),
  on_jerk:L('A sudden jerk can tear the outer ring of a disc or strain muscles.','अचानक झटका डिस्क के बाहरी छल्ले में दरार या मांसपेशी में खिंचाव ला सकता है।'),
  on_twist:L('Twisting under load strains muscles, ligaments and the disc ring.','भार के साथ मुड़ना मांसपेशियों, लिगामेंट और डिस्क के छल्ले पर खिंचाव डालता है।'),
  ch_spasm:L('Spasm is the muscles guarding an injured area.','ऐंठन चोट वाली जगह की रक्षा करती मांसपेशियाँ हैं।'),
  ch_ache:L('A dull, deep ache is typical of muscles, discs and joints rather than nerves.','भारी, गहरा दर्द नस से नहीं, मांसपेशियों, डिस्क और जोड़ों से होता है।'),
  w_extend:L('Pain on arching backwards loads the facet joints and the pars.','पीछे झुकने पर दर्द फ़ैसेट जोड़ों और पार्स पर भार दिखाता है।'),
  w_walk:L('Leg symptoms on walking that ease with sitting are typical of spinal stenosis.','चलने पर पैरों के लक्षण जो बैठने पर कम हों, स्पाइनल स्टेनोसिस के खास हैं।'),
  b_sitflex:L('Relief on bending forward means opening the canal helps, as in stenosis.','आगे झुकने पर आराम का मतलब है नली खुलने से राहत, जैसे स्टेनोसिस में।'),
  ch_stiff_am:L('Morning stiffness over 30 minutes is a feature of inflammatory back pain.','सुबह 30 मिनट से ज़्यादा अकड़न सूजन वाले कमर दर्द का लक्षण है।'),
  b_exercise:L('Pain that eases with exercise suggests inflammation rather than injury.','व्यायाम से कम होने वाला दर्द चोट नहीं, सूजन की ओर इशारा करता है।'),
  w_rest:L('Pain worse at rest suggests inflammation.','आराम में बढ़ने वाला दर्द सूजन का संकेत है।'),
  ch_night_wake:L('Waking late at night and easing on getting up is typical of inflammatory back pain.','देर रात नींद खुलना और उठने पर आराम सूजन वाले दर्द का खास लक्षण है।'),
  buttock:L('Pain low in the buttock is common in SI-joint and piriformis problems and can be referred from the lumbar spine.','नितंब के निचले हिस्से का दर्द SI जोड़ और पिरिफॉर्मिस में आम है और कमर की रीढ़ से भी आ सकता है।'),
  thigh_back:L('Pain behind the thigh follows the path of the sciatic nerve.','जांघ के पीछे का दर्द साइटिक नस के रास्ते पर होता है।'),
  tailbone:L('Pain exactly at the tailbone, worse on sitting, points to the coccyx.','ठीक टेलबोन पर दर्द, जो बैठने पर बढ़े, कॉक्सिक्स की ओर इशारा करता है।'),
  groin:L('Groin pain often comes from the hip joint.','ग्रोइन का दर्द अक्सर कूल्हे के जोड़ से होता है।'),
  flank:L('Side pain below the ribs raises the possibility of a kidney problem.','पसलियों के नीचे साइड का दर्द गुर्दे की समस्या की संभावना बढ़ाता है।'),
  ch_colic:L('Pain in waves is typical of a stone moving in the urinary tract.','लहरों में आता दर्द मूत्र मार्ग में चलती पथरी का खास संकेत है।'),
  u_urine:L('Urine changes point to the kidney or bladder.','पेशाब में बदलाव गुर्दे या मूत्राशय की ओर इशारा करते हैं।'),
  rf_fever:L('Fever or weight loss with back pain raises concern for infection.','कमर दर्द के साथ बुखार या वज़न घटना इन्फेक्शन की चिंता बढ़ाता है।'),
  r_tb:L('Previous TB exposure raises the chance of spinal TB.','पहले टीबी का संपर्क स्पाइनल टीबी की संभावना बढ़ाता है।'),
  r_bones:L('Weak bones can fracture after a minor strain.','कमज़ोर हड्डियाँ छोटे झटके से भी टूट सकती हैं।'),
  r_cancer:L('Past cancer means new back pain must be checked carefully.','पहले कैंसर हो तो नया कमर दर्द ध्यान से जांचना ज़रूरी।'),
  d_3m:L('Pain beyond 3 months is chronic and needs a structured plan.','3 महीने से ज़्यादा दर्द पुराना माना जाता है और व्यवस्थित इलाज चाहिए।'),
  a_30_39:L('Disc herniation is most common between 30 and 50.','डिस्क हर्निएशन 30 से 50 की उम्र में सबसे आम है।'),
  a_40_49:L('Disc herniation is most common between 30 and 50.','डिस्क हर्निएशन 30 से 50 की उम्र में सबसे आम है।'),
  a_60p:L('Wear-related conditions such as stenosis and facet arthritis become common after 60.','60 के बाद स्टेनोसिस और फ़ैसेट गठिया जैसी घिसावट वाली समस्याएं आम हैं।'),
  r_desk:L('Long sitting loads the discs and weakens the core muscles.','लंबे समय बैठना डिस्क पर भार डालता है और कोर मांसपेशियाँ कमज़ोर करता है।'),
  r_heavy:L('Heavy manual work repeatedly loads the spine.','भारी शारीरिक काम रीढ़ पर बार-बार भार डालता है।'),
  walk_no:L('Being unable to walk shows how strongly the nerve is affected and raises urgency.','चल न पाना दिखाता है कि नस कितनी प्रभावित है और जल्दी इलाज ज़रूरी है।'),
  sit_no:L('Being unable to sit fits high disc pressure on a nerve root.','बैठ न पाना नस की जड़ पर डिस्क के ज़्यादा दबाव से मेल खाता है।'),
  on_preg:L('Pregnancy changes posture and loosens the pelvic joints.','गर्भावस्था पोस्चर बदलती है और पेल्विक जोड़ों को ढीला करती है।'),
  ch_period:L('Pain linked to periods suggests a gynaecological cause.','पीरियड्स से जुड़ा दर्द स्त्री रोग से जुड़े कारण का संकेत है।'),
  ep_recur:L('Repeated episodes suggest an underlying spinal problem rather than a one-off strain.','बार-बार होना एक बार के खिंचाव के बजाय रीढ़ की अंदरूनी समस्या का संकेत है।'),
  lowback:L('Central low back pain often comes from the discs or small spinal joints.','कमर के बीच का दर्द अक्सर डिस्क या रीढ़ के छोटे जोड़ों से होता है।'),
  lowback_side:L('Pain beside the spine usually comes from muscles, ligaments or facet joints.','रीढ़ के बगल का दर्द आमतौर पर मांसपेशियों, लिगामेंट या फ़ैसेट जोड़ों से होता है।'),
  on_sitting:L('Pain after long sitting or travel loads discs and muscles.','लंबे बैठने या सफर के बाद दर्द डिस्क और मांसपेशियों पर भार दिखाता है।'),
  on_fall:L('A fall can injure bones, joints or the tailbone.','गिरने से हड्डियों, जोड़ों या टेलबोन को चोट लग सकती है।'),
  on_gradual:L('A slow start without injury fits wear-related or inflammatory causes.','बिना चोट धीरे शुरू होना घिसावट या सूजन वाले कारणों से मेल खाता है।')
};

const LEVELS = {
  red:{short:L('Now','अभी'),title:L('Go to the emergency department now','अभी इमरजेंसी विभाग जाएं'),act:L('Call 108 for an ambulance or 112 for any emergency. Do not drive yourself.','एम्बुलेंस के लिए 108 या किसी भी इमरजेंसी के लिए 112 पर कॉल करें। खुद गाड़ी न चलाएं।')},
  orange:{short:L('24–48 h','24–48 घंटे'),title:L('See a doctor within 24–48 hours','24–48 घंटे में डॉक्टर को दिखाएं'),act:L('Do not wait for it to settle. Book the earliest appointment or attend a hospital OPD.','ठीक होने का इंतज़ार न करें। सबसे जल्दी अपॉइंटमेंट लें या अस्पताल की OPD जाएं।')},
  yellow:{short:L('Within a week','1 हफ्ते में'),title:L('See a specialist doctor within a week','1 हफ्ते के अंदर विशेषज्ञ डॉक्टर को दिखाएं'),act:L('Not an emergency, but your symptoms need a proper examination. Go sooner if the pain worsens, numbness spreads or a leg feels weak.','इमरजेंसी नहीं, पर आपके लक्षणों की ठीक से जांच ज़रूरी है। दर्द बढ़े, सुन्नपन फैले या पैर कमज़ोर लगे तो पहले जाएं।')},
  green:{short:L('Within 2 weeks','2 हफ्ते में'),title:L('Book a doctor visit within 2 weeks','2 हफ्ते के अंदर डॉक्टर को दिखाएं'),act:L('Your answers show no warning signs, but a doctor still needs to examine you to confirm the cause and rule out others. Until then, stay active and avoid heavy lifting.','आपके जवाबों में कोई खतरे का संकेत नहीं है, फिर भी कारण पक्का करने और दूसरे कारणों को खारिज करने के लिए डॉक्टर की जांच ज़रूरी है। तब तक सक्रिय रहें और भारी वज़न न उठाएं।')}
};
const RS = {
  y_often:L('Bouts are coming more often or getting worse','दौरे जल्दी-जल्दी आ रहे हैं या बढ़ रहे हैं'),
  g_ok:L('No red flags and no nerve-root signs','कोई खतरे का संकेत नहीं और नस की जड़ के लक्षण नहीं')
};
const VIEWS = {
  full:{az:0.55,el:0.06,d:4.2,yk:'mid',dy:0.03}, back:{az:PI,el:0.05,d:4.2,yk:'mid',dy:0.03}, front:{az:0,el:0.05,d:4.2,yk:'mid',dy:0.03},
  spine:{az:PI-0.5,el:0.14,d:0.78,yk:'L3',dy:-0.03}
};
ONSETS.splice(6, 0, ['on_jerk',L('A sudden jerk or slip without falling','बिना गिरे अचानक झटका या फिसलना')], ['on_house',L('Housework: sweeping, mopping, washing clothes','घर का काम: झाड़ू, पोछा, कपड़े धोना')], ['on_bike',L('Two-wheeler ride or travel on bumpy roads','दोपहिया की सवारी या खराब सड़कों पर सफर')], ['on_yoga',L('Yoga, stretching or exercise','योग, स्ट्रेचिंग या व्यायाम')]);
SPG.data.common = {SRC, U, AGES, SEXES, EPIS, RISKS, ONSETS, SINCE, HX, BTW, LBLX, TRENDS, WALKS, SITS, SLEEPS, DEPTS, STATS, FX, LEVELS, RS, VIEWS};
})();
