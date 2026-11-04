window.SPG = window.SPG || {data:{modules:{}}};
/* Knee module (v5.4). Questions, weights, rules and explanations for knee pain.
   Evidence table: research/knee-evidence.md. Weights from likelihood ratios use round(4 x log10(LR)); others are marked expert estimates there. */
(function(){
const PI = Math.PI;
const L = (en, hi) => ({en, hi});
const C = SPG.data.common;
C.SRC.push(
  ['altman86','Altman R et al. Classification criteria for osteoarthritis of the knee (American College of Rheumatology). Arthritis Rheum 1986;29:1039–49: knee pain + 3 of 6 clinical items, sensitivity 95%, specificity 69%; 4 of 6: 84% / 89%','https://physiotutors.com/?p=11991'],
  ['niceoa','NICE NG226 (2022) Osteoarthritis in over 16s: diagnose clinically at 45+ with activity-related joint pain and no or under 30 minutes of morning stiffness; exercise and weight loss first','https://bestpractice-bmj-com.bibliotheek.ehb.be/topics/en-gb/192/nice-summary'],
  ['indiaoa','Ministry of Health and Family Welfare, India. Standard treatment guidelines: osteoarthritis knee (2017), citing Pal 2016: knee osteoarthritis in 28.7% of adults studied','https://qps.nhsrcindia.org/sites/default/files/2021-05/Osteoarthritis%20Knee.pdf'],
  ['ottawa','Ottawa knee rule; Bachmann LM et al. Ann Intern Med 2004;140:121–4 (sensitivity 98.5% for fracture)','https://wikem.org/wiki/Ottawa_knee_rules'],
  ['wagacl','Wagemakers HP et al. History taking and physical examination for ACL lesions in primary care. Arch Phys Med Rehabil 2010;91:1452–9 (popping LR+ 2.3; 2 of 3 of popping, swelling, giving way LR+ 2.5)','https://repub.eur.nl/pub/20762'],
  ['wagmen','Wagemakers HP et al. History taking and physical examination for meniscal tears in general practice. Clin J Sport Med 2008;18:24–30 (age over 40 LR+ up to 2.0)','https://repub.eur.nl/pub/15186'],
  ['hegedus','Hegedus EJ et al. Physical examination tests for a torn meniscus: systematic review and meta-analysis. JOSPT 2007;37:541–50 (joint line tenderness sensitivity 63%, specificity 77%)','https://scholars.duke.edu/publication/743030'],
  ['smithpfp','Smith BE et al. Incidence and prevalence of patellofemoral pain: systematic review and meta-analysis. PLoS One 2018 (annual prevalence 22.7%; adolescents 28.9%)','https://ideas.repec.org/a/plo/pone00/0190892.html'],
  ['nunes','Nunes GS et al. Clinical tests for patellofemoral pain: systematic review with meta-analysis. Phys Ther Sport 2013;14:54–9 (squatting among the more useful tests)','https://myorthoevidence.com/AceReport/Report/5252'],
  ['osgood','StatPearls – Osgood-Schlatter disease (prevalence 9.8% at age 12–15; both knees in 20–30%; settles within about 2 years)','https://www.statpearls.com/point-of-care/26359'],
  ['scfe','StatPearls – Slipped capital femoral epiphysis (knee pain is the presenting complaint in 26%)','https://www.statpearls.com/point-of-care/29145'],
  ['hotjoint','Weston V, Coakley G. Guideline for the management of the hot swollen joint in adults (BSR). J Antimicrob Chemother 2006;58:492–3 (treat as septic until proven otherwise; mortality up to 11%)','https://academic.oup.com/jac/article/58/3/492/748748'],
  ['nicedvt','NICE QS201 / NG158 – suspected deep vein thrombosis: leg vein ultrasound within 4 hours','https://www.nice.org.uk/guidance/qs201/chapter/quality-statement-3-proximal-leg-vein-ultrasound-scan-for-a-likely-deep-vein-thrombosis-wells']
);
const ONSETS = [
  ['on_gradual',L('Slowly, with no clear reason','धीरे-धीरे, बिना किसी साफ़ वजह के')],
  ['on_twist',L('Twisting or turning on a planted foot (sport, slipping)','ज़मीन पर टिके पैर पर मुड़ना या घूमना (खेल, फिसलना)')],
  ['on_fall',L('A fall or a direct blow to the knee','गिरना या घुटने पर सीधी चोट')],
  ['on_jump',L('More running, jumping, stairs or sport than usual','सामान्य से ज़्यादा दौड़ना, कूदना, सीढ़ियाँ या खेल')],
  ['on_kneel',L('A lot of kneeling, squatting or floor work','बहुत ज़्यादा घुटनों के बल बैठना, उकड़ू बैठना या ज़मीन पर काम')],
  ['on_woke',L('Woke up with it','सुबह उठे तो दर्द था')],
  ['on_accident',L('Road accident','सड़क दुर्घटना')]
];
const PAT = {
  char:[
    ['ch_pop',L('Felt or heard a pop at the moment of injury','चोट के समय पॉप जैसी आवाज़ या एहसास')],
    ['ch_swell_fast',L('The knee swelled up quickly, within about 2 hours of an injury','चोट के लगभग 2 घंटे के अंदर घुटना तेज़ी से सूज गया')],
    ['ch_swell_slow',L('Swelling that came on slowly or the next day','धीरे-धीरे या अगले दिन आई सूजन')],
    ['ch_giveway',L('The knee gives way or buckles','घुटना जवाब दे देता है या मुड़ जाता है')],
    ['ch_lock',L('The knee catches, clicks painfully or gets stuck','घुटना अटकता है, दर्द के साथ क्लिक करता है या फंस जाता है')],
    ['ch_stiff_short',L('Stiff in the morning, easing within 30 minutes','सुबह जकड़न जो 30 मिनट के अंदर कम हो जाती है')],
    ['ch_stiff_long',L('Stiff in the morning for more than 30 minutes','सुबह 30 मिनट से ज़्यादा जकड़न')],
    ['ch_crepitus',L('Grinding or crackling when the knee bends','घुटना मोड़ने पर किरकिराहट या कड़कड़ाहट')],
    ['ch_bony',L('The knee looks knobbly or bigger than before (bony swelling)','घुटना पहले से गांठदार या बड़ा दिखता है (हड्डी की सूजन)')],
    ['ch_lump_back',L('A soft swelling behind the knee','घुटने के पीछे नरम सूजन')],
    ['ch_swell_front',L('A soft swelling on the front of the kneecap','घुटने की कटोरी के आगे नरम सूजन')],
    ['ch_bump_below',L('A painful bump just below the kneecap','घुटने की कटोरी के ठीक नीचे दर्द वाला उभार')]
  ],
  worse:[
    ['w_stairs',L('Stairs, especially coming down','सीढ़ियाँ, खासकर उतरते समय')],
    ['w_squat',L('Squatting, kneeling or sitting cross-legged on the floor','उकड़ू बैठना, घुटनों के बल बैठना या ज़मीन पर पालथी मारकर बैठना')],
    ['w_sit_long',L('Sitting for long with the knee bent (cinema, travel)','घुटना मोड़कर देर तक बैठना (सिनेमा, यात्रा)')],
    ['w_run',L('Running or jumping','दौड़ना या कूदना')],
    ['w_walk_long',L('Walking or standing for long','देर तक चलना या खड़े रहना')],
    ['w_twist',L('Twisting or turning on the leg','पैर पर मुड़ना या घूमना')]
  ],
  better:[['b_rest',L('Rest','आराम')]],
  other:[
    ['o_overweight',L('Overweight, or gained weight recently','ज़्यादा वज़न, या हाल में वज़न बढ़ा')],
    ['o_hip_pain',L('Pain in the groin or hip as well','साथ में जांघ के जोड़ या कूल्हे में दर्द')],
    ['o_other_joints',L('Other joints also swollen or painful (hands, wrists, feet)','दूसरे जोड़ भी सूजे या दर्द वाले (हाथ, कलाई, पैर)')],
    ['o_gout',L('Past attacks of gout, or a red, swollen big toe before','पहले गाउट के दौरे, या पहले पैर का अंगूठा लाल और सूजा था')]
  ]
};
const RFS = [
  ['rf_hot',L('The knee became hot, red and swollen over hours or days (with or without fever)','घुटना कुछ घंटों या दिनों में गर्म, लाल और सूजा हो गया (बुखार के साथ या बिना)')],
  ['rf_fracture',L('After an injury: could not take 4 steps, cannot bend the knee to a right angle, or the kneecap or the bony point below the outer knee hurts to touch','चोट के बाद: 4 कदम नहीं चल पाए, घुटना समकोण तक नहीं मुड़ता, या घुटने की कटोरी या बाहर नीचे की हड्डी छूने पर दुखती है')],
  ['rf_dvt',L('The calf is swollen, warm and tender, especially after long travel, an operation, a plaster cast or bed rest','पिंडली सूजी, गर्म और दबाने पर दर्द वाली है, खासकर लंबी यात्रा, ऑपरेशन, प्लास्टर या बिस्तर पर आराम के बाद')],
  ['rf_locked',L('The knee is locked and will not straighten fully after an injury','चोट के बाद घुटना फंस गया है और पूरा सीधा नहीं होता')],
  ['rf_child_limp',L('A child or teenager is limping, with pain in the knee, thigh or hip','बच्चा या किशोर लंगड़ा रहा है, घुटने, जांघ या कूल्हे में दर्द के साथ')],
  ['rf_fever',L('Fever, night sweats or weight loss without trying','बुखार, रात को पसीना या बिना कोशिश वज़न घटना')],
  ['rf_night',L('Constant pain at night that no position eases','रात को लगातार दर्द जो किसी भी पोज़िशन में कम न हो')]
];
const VIEWS = {
  knee_front:{az:0.3,el:0.1,d:1.05,yk:'knee',dy:0,tx:0.12}, knee_in:{az:-0.75,el:0.18,d:1.0,yk:'knee',dy:0,tx:0.12}, knee_out:{az:1.35,el:0.1,d:1.05,yk:'knee',dy:0,tx:0.12},
  knee_back:{az:PI-0.3,el:0.1,d:1.05,yk:'knee',dy:0,tx:0.12}, tibial_tub:{az:0.35,el:0.12,d:0.9,yk:'knee',dy:-0.05,tx:0.12}, calf:{az:PI-0.35,el:0.08,d:1.25,yk:'knee',dy:-0.16,tx:0.12},
  hipthigh:{az:0.3,el:0.05,d:1.7,yk:'hj',dy:-0.1,tx:0.06}
};
const AREAS = [
  {id:'knee_front',pair:true,view:'knee_front',name:L('Front of the knee, around or behind the kneecap','घुटने का अगला हिस्सा, कटोरी के आसपास या पीछे'),desc:L('The kneecap and the area around it.','घुटने की कटोरी और उसके आसपास का हिस्सा।'),rel:L('Pain around or behind the kneecap, worse on stairs and squatting, is typical of patellofemoral pain.','कटोरी के आसपास या पीछे दर्द, जो सीढ़ी और उकड़ू बैठने पर बढ़े, पटेलोफ़ेमोरल दर्द का खास लक्षण है।')},
  {id:'knee_in',pair:true,view:'knee_in',name:L('Inner side of the knee','घुटने का अंदरूनी हिस्सा'),desc:L('The side of the knee that faces the other knee.','घुटने का वह हिस्सा जो दूसरे घुटने की तरफ़ है।'),rel:L('Inner knee pain is common with osteoarthritis, a torn inner meniscus or an inner ligament sprain.','अंदरूनी घुटने का दर्द ऑस्टियोआर्थराइटिस, अंदरूनी मेनिस्कस फटने या अंदरूनी लिगामेंट मोच में आम है।')},
  {id:'knee_out',pair:true,view:'knee_out',name:L('Outer side of the knee','घुटने का बाहरी हिस्सा'),desc:L('The side of the knee facing away from the body.','घुटने का शरीर से बाहर की तरफ़ वाला हिस्सा।'),rel:L('Outer knee pain in runners and cyclists points to the iliotibial band; after a twist, to the outer meniscus.','दौड़ने या साइकिल चलाने वालों में बाहरी दर्द आईटी बैंड की ओर; मुड़ने के बाद बाहरी मेनिस्कस की ओर इशारा करता है।')},
  {id:'knee_back',pair:true,view:'knee_back',name:L('Back of the knee','घुटने का पिछला हिस्सा'),desc:L('The hollow behind the knee.','घुटने के पीछे का गड्ढा।'),rel:L('A soft swelling here is usually a Baker’s cyst; if the calf below is also swollen and warm, a blood clot must be ruled out.','यहाँ नरम सूजन आमतौर पर बेकर सिस्ट होती है; अगर नीचे पिंडली भी सूजी और गर्म हो तो खून का थक्का खारिज करना ज़रूरी है।')},
  {id:'tibial_tub',pair:true,view:'tibial_tub',name:L('Bony bump just below the kneecap','कटोरी के ठीक नीचे की हड्डी का उभार'),desc:L('The bump on the shin bone where the kneecap tendon attaches.','पिंडली की हड्डी का वह उभार जहाँ कटोरी का टेंडन जुड़ता है।'),rel:L('In active children aged 10–15, pain here is usually Osgood-Schlatter disease; in jumping athletes, the kneecap tendon.','10–15 साल के सक्रिय बच्चों में यहाँ दर्द आमतौर पर ऑसगुड-श्लैटर रोग होता है; कूदने वाले खिलाड़ियों में कटोरी का टेंडन।')},
  {id:'calf',pair:true,view:'calf',name:L('Calf (back of the lower leg)','पिंडली (निचले पैर का पिछला हिस्सा)'),desc:L('The muscle at the back of the leg below the knee.','घुटने के नीचे पैर के पीछे की मांसपेशी।'),rel:L('Calf pain with swelling and warmth needs a scan to rule out a blood clot (DVT).','सूजन और गर्मी के साथ पिंडली में दर्द हो तो खून का थक्का (DVT) खारिज करने के लिए स्कैन ज़रूरी है।')},
  {id:'hipthigh',pair:true,view:'hipthigh',regs:['groin','thigh_front'],name:L('Groin or front of the thigh','जांघ का जोड़ या जांघ का अगला हिस्सा'),desc:L('The crease at the top of the thigh and the front of the thigh.','जांघ के ऊपर का मोड़ और जांघ का अगला हिस्सा।'),rel:L('Hip problems often send pain down to the knee; in children this can hide a serious hip condition.','कूल्हे की समस्या अक्सर घुटने तक दर्द भेजती है; बच्चों में इसके पीछे कूल्हे की गंभीर बीमारी छिपी हो सकती है।')}
];
const TESTS = [
  {id:'ksquat',name:L('Squat test (hold on to something)','उकड़ू बैठने का टेस्ट (कुछ पकड़कर)'),
   steps:[L('Stand holding a table or door frame. Slowly bend both knees as if sitting down, as far as is comfortable.','मेज़ या दरवाज़े की चौखट पकड़कर खड़े हों। जैसे बैठ रहे हों, दोनों घुटने धीरे-धीरे जितना आराम से हो सके मोड़ें।'),L('Hold for a few seconds, then stand up slowly.','कुछ सेकंड रुकें, फिर धीरे से खड़े हों।')],
   pos:L('It brings on your pain at the front of the knee, around or behind the kneecap.','घुटने के आगे, कटोरी के आसपास या पीछे आपका दर्द आ जाए।'),
   acc:L('Pain on squatting is one of the more useful signs of patellofemoral pain, but many knee problems hurt on squatting, so it is read with where the pain is.','उकड़ू बैठने पर दर्द पटेलोफ़ेमोरल दर्द के ज़्यादा उपयोगी संकेतों में से है, पर कई घुटने की समस्याओं में उकड़ू बैठने पर दर्द होता है, इसलिए इसे दर्द की जगह के साथ देखा जाता है।'),src:'nunes',ans:[['squat_pos','tPos','y'],['squat_neg','tNeg','n'],['squat_skip','tSkip','s']]},
  {id:'kjlt',name:L('Press along the joint line','जोड़ की लाइन पर दबाना'),
   steps:[L('Sit with the knee bent to a right angle. Find the soft groove on each side of the knee, just beside the lower edge of the kneecap, where the thigh bone meets the shin bone.','घुटना समकोण पर मोड़कर बैठें। घुटने के दोनों तरफ़, कटोरी के निचले किनारे के बगल में, वह नरम खांचा ढूंढें जहाँ जांघ की हड्डी पिंडली की हड्डी से मिलती है।'),L('Press firmly with a thumb along the inner and then the outer groove.','अंगूठे से पहले अंदरूनी और फिर बाहरी खांचे पर ज़ोर से दबाएं।')],
   pos:L('Sharp, pinpoint pain in the groove on one side that matches your pain.','एक तरफ़ के खांचे में तेज़, एक जगह का दर्द जो आपके दर्द से मेल खाए।'),
   acc:L('Joint line tenderness: sensitivity 63%, specificity 77%; a tender joint line makes a meniscus tear about 2.7 times more likely, and it is also common with arthritis.','जोड़ की लाइन पर दर्द: संवेदनशीलता 63%, विशिष्टता 77%; इससे मेनिस्कस फटने की संभावना लगभग 2.7 गुना होती है, और यह गठिया में भी आम है।'),src:'hegedus',ans:[['jlt_pos','tPos','y'],['jlt_neg','tNeg','n'],['jlt_skip','tSkip','s']]},
  {id:'kext',name:L('Can the knee straighten fully?','क्या घुटना पूरा सीधा होता है?'),
   steps:[L('Sit or lie with both legs straight out in front of you.','दोनों पैर सामने सीधे करके बैठें या लेटें।'),L('Tighten the thigh muscles and push the back of each knee down towards the floor. Compare the two sides.','जांघ की मांसपेशियाँ कसें और हर घुटने का पिछला हिस्सा ज़मीन की तरफ़ दबाएं। दोनों तरफ़ की तुलना करें।')],
   pos:L('The painful knee cannot go as straight or as flat as the other one.','दर्द वाला घुटना दूसरे जितना सीधा या सपाट नहीं होता।'),
   acc:L('A knee that will not straighten fully points to swelling inside the joint, arthritis or a torn meniscus caught in the joint; a suddenly locked knee after an injury needs prompt review.','पूरा सीधा न होने वाला घुटना जोड़ के अंदर सूजन, गठिया या जोड़ में फंसे फटे मेनिस्कस की ओर इशारा करता है; चोट के बाद अचानक फंसा घुटना जल्दी दिखाना ज़रूरी है।'),src:'wagmen',ans:[['ext_lim','tPos','y'],['ext_ok','tNeg','n'],['ext_skip','tSkip','s']]}
];
const D = C.DEPTS;
D.medicine = D.medicine || {n:L('General medicine / Internal medicine','जनरल मेडिसिन / इंटरनल मेडिसिन'),s:L('Whole-body causes: blood tests, infections, diabetes, gout.','पूरे शरीर से जुड़े कारण: ब्लड टेस्ट, इन्फेक्शन, डायबिटीज़, गाउट।'),q:'physician'};
D.sports = D.sports || {n:L('Sports medicine / Arthroscopy (knee surgeon)','स्पोर्ट्स मेडिसिन / आर्थ्रोस्कोपी (घुटने के सर्जन)'),s:L('Ligament and meniscus injuries, and sports-related joint problems.','लिगामेंट और मेनिस्कस की चोटें, और खेल से जुड़ी जोड़ों की समस्याएं।'),q:'sports medicine knee arthroscopy surgeon'};
D.paeds = D.paeds || {n:L('Paediatric orthopaedics','बाल हड्डी रोग (पीडियाट्रिक ऑर्थोपेडिक्स)'),s:L('Bone and joint problems in children and teenagers.','बच्चों और किशोरों में हड्डी और जोड़ों की समस्याएं।'),q:'pediatric orthopedic'};
const kneeAreas = ['knee_front','knee_in','knee_out','knee_back','tibial_tub'];
const CONDS = [
  {id:'koa',th:[10,7,4],anchor:['acr3','nice_oa'],depts:['ortho','physio'],
   name:L('Knee osteoarthritis (wear of the knee joint)','घुटने का ऑस्टियोआर्थराइटिस (घुटने के जोड़ की घिसावट)'),sci:'Knee osteoarthritis',
   what:L('The cartilage that cushions the knee wears thin and the bone underneath reacts, forming small spurs. The knee aches with walking, stairs and squatting, stiffens briefly in the morning or after sitting, grinds and may look knobbly. The inner side is affected most often.','घुटने को गद्दी देने वाली कार्टिलेज पतली हो जाती है और नीचे की हड्डी प्रतिक्रिया में छोटे उभार बनाती है। चलने, सीढ़ी और उकड़ू बैठने पर दर्द होता है, सुबह या बैठने के बाद थोड़ी देर जकड़न रहती है, किरकिराहट होती है और घुटना गांठदार दिख सकता है। सबसे ज़्यादा अंदरूनी हिस्सा प्रभावित होता है।'),
   causes:L('Age, extra body weight, previous knee injury or meniscus surgery, heavy kneeling and squatting work, and family history. In an Indian community study, 28.7% of adults studied had knee osteoarthritis.','उम्र, ज़्यादा वज़न, घुटने की पुरानी चोट या मेनिस्कस की सर्जरी, भारी घुटनों के बल और उकड़ू काम, और पारिवारिक इतिहास। एक भारतीय सामुदायिक अध्ययन में 28.7% वयस्कों को घुटने का ऑस्टियोआर्थराइटिस था।'),cSrc:['indiaoa','altman86','niceoa'],
   confirm:L('Doctors can diagnose it from the history and examination without scans at age 45 or over with activity-related pain and morning stiffness under 30 minutes. Knee pain with 3 of 6 features (age over 50, short morning stiffness, grinding, bony tenderness, bony enlargement, no warmth) picks up 95% of cases. An X-ray is used if the picture is unusual.','45 या ज़्यादा उम्र में गतिविधि से होने वाले दर्द और 30 मिनट से कम सुबह की जकड़न में डॉक्टर बिना स्कैन के, सिर्फ़ इतिहास और जांच से पहचान सकते हैं। 6 में से 3 लक्षण (50 से ज़्यादा उम्र, सुबह थोड़ी जकड़न, किरकिराहट, हड्डी पर दबाने से दर्द, हड्डी का बढ़ना, गर्मी न होना) 95% मामले पकड़ते हैं। तस्वीर असामान्य हो तो एक्स-रे।'),
   treat:L('Exercise tailored to you (thigh and hip strengthening) and, if overweight, weight loss — losing 10% of body weight is better than 5%. A topical anti-inflammatory gel is the first medicine. NICE does not recommend routine paracetamol, glucosamine, hyaluronic acid injections or arthroscopic washout. Joint replacement is considered when symptoms seriously affect life despite this.','आपके हिसाब से व्यायाम (जांघ और कूल्हे को मज़बूत करना) और ज़्यादा वज़न हो तो वज़न कम करना — शरीर का 10% वज़न घटाना 5% से बेहतर है। पहली दवा लगाने वाला सूजन-रोधी जेल। NICE नियमित पैरासिटामोल, ग्लूकोसामाइन, हयालूरोनिक एसिड इंजेक्शन या आर्थ्रोस्कोपिक धुलाई की सलाह नहीं देता। इन सबके बाद भी लक्षण जीवन पर बहुत असर डालें तो जोड़ बदलवाने पर विचार।'),
   outlook:L('It usually changes slowly over years, with good and bad spells; exercise and weight loss reduce pain and improve function.','आमतौर पर सालों में धीरे-धीरे बदलता है, अच्छे और बुरे दौर के साथ; व्यायाम और वज़न घटाने से दर्द कम होता है और काम करने की क्षमता बढ़ती है।'),oSrc:['niceoa'],
   w:{acr3:2,acr4:2,acr_lt3:-3,nice_oa:2,knee_in:1,knee_front:1,ch_crepitus:1,ch_bony:2,w_stairs:1,w_squat:1,w_walk_long:1,o_overweight:2,r_heavy:1,on_gradual:2,on_kneel:1,h_1_5y:1,h_5y:2,sex_f:1,ext_lim:1,jlt_pos:1,
      a_u18:-4,a_18_29:-3,a_30_39:-1,ch_stiff_long:-2,ch_swell_fast:-2,ch_pop:-1,o_other_joints:-1}},
  {id:'pfp',th:[10,7,4],anchor:['knee_front','squat_pos'],depts:['physio','ortho'],
   name:L('Kneecap pain (patellofemoral pain)','घुटने की कटोरी का दर्द (पटेलोफ़ेमोरल दर्द)'),sci:'Patellofemoral pain',
   what:L('Pain around or behind the kneecap from overload of the joint between the kneecap and the thigh bone. It is brought on by stairs, squatting, kneeling, running and sitting for long with the knees bent.','कटोरी और जांघ की हड्डी के बीच के जोड़ पर ज़्यादा भार से कटोरी के आसपास या पीछे दर्द। सीढ़ी, उकड़ू बैठना, घुटनों के बल बैठना, दौड़ना और घुटने मोड़कर देर तक बैठना इसे बढ़ाते हैं।'),
   causes:L('A sudden increase in running, jumping or stairs, weak hip and thigh muscles, and growth spurts. It is very common: about 23% of people a year, and 29% of teenagers.','अचानक ज़्यादा दौड़ना, कूदना या सीढ़ियाँ, कूल्हे और जांघ की कमज़ोर मांसपेशियाँ, और तेज़ बढ़त का दौर। यह बहुत आम है: हर साल लगभग 23% लोगों में, और 29% किशोरों में।'),cSrc:['smithpfp','nunes'],
   confirm:L('Examination; scans are not needed in a typical case.','जांच; सामान्य मामले में स्कैन ज़रूरी नहीं।'),
   treat:L('Hip and thigh strengthening exercises with a physiotherapist, adjusting running and stair loads; taping or foot orthoses can help in the short term.','फिज़ियोथेरेपिस्ट के साथ कूल्हे और जांघ को मज़बूत करने के व्यायाम, दौड़ने और सीढ़ियों का भार ठीक करना; थोड़े समय के लिए टेपिंग या जूते के इनसोल मदद कर सकते हैं।'),
   outlook:L('Most improve with exercise, though it can come back with sudden increases in activity.','ज़्यादातर व्यायाम से सुधरते हैं, हालांकि गतिविधि अचानक बढ़ाने पर लौट सकता है।'),
   w:{knee_front:3,w_stairs:2,w_squat:2,w_sit_long:3,squat_pos:2,squat_neg:-2,w_run:1,on_jump:1,a_u18:2,a_18_29:2,a_30_39:1,sex_f:1,on_gradual:1,
      a_60p:-2,a_50_59:-1,ch_bony:-2,ch_lock:-1,ch_swell_fast:-2,knee_in:-1,knee_back:-1,acr3:-1}},
  {id:'menisc',th:[10,7,4],anchor:['ch_lock','jlt_pos','on_twist'],depts:['ortho','sports','physio'],
   name:L('Meniscus tear (torn knee cartilage)','मेनिस्कस फटना (घुटने की गद्दी फटना)'),sci:'Meniscal tear',
   what:L('The menisci are two C-shaped rubbery cushions between the thigh bone and the shin bone. A tear causes pain on the inner or outer joint line, swelling that builds up over a day, and catching or locking. In older people, small tears are often part of wear and tear.','मेनिस्कस जांघ और पिंडली की हड्डी के बीच दो C आकार की रबर जैसी गद्दियाँ हैं। फटने पर जोड़ की अंदरूनी या बाहरी लाइन पर दर्द, एक दिन में धीरे-धीरे आने वाली सूजन, और अटकना या फंसना होता है। बड़ी उम्र में छोटी फटन अक्सर घिसावट का हिस्सा होती है।'),
   causes:L('Twisting on a bent, weight-bearing knee (sport, slipping, getting up from squatting). Age over 40 and weight-bearing during the injury make a tear more likely.','मुड़े हुए, वज़न उठाते घुटने पर मुड़ना (खेल, फिसलना, उकड़ू बैठकर उठना)। 40 से ज़्यादा उम्र और चोट के समय पैर पर वज़न होना फटन की संभावना बढ़ाते हैं।'),cSrc:['wagmen','hegedus'],
   confirm:L('Examination and an MRI scan if it will change treatment. History is more useful than single bedside tests.','जांच, और अगर इलाज बदलेगा तो MRI स्कैन। अकेले बेडसाइड टेस्ट से ज़्यादा उपयोगी मरीज़ का इतिहास है।'),
   treat:L('Exercise therapy first for most tears, especially wear-related ones; keyhole surgery for a locked knee or a large tear in a young person.','ज़्यादातर फटन में, खासकर घिसावट वाली में, पहले व्यायाम थेरेपी; फंसे घुटने या युवा व्यक्ति में बड़ी फटन में की-होल सर्जरी।'),
   outlook:L('Many settle with exercise over a few months; a knee that keeps locking needs a surgeon’s opinion.','कई कुछ महीनों में व्यायाम से ठीक होते हैं; बार-बार फंसने वाले घुटने के लिए सर्जन की राय ज़रूरी।'),
   w:{on_twist:3,ch_lock:3,jlt_pos:2,jlt_neg:-1,knee_in:2,knee_out:1,ch_swell_slow:2,w_twist:2,w_squat:1,a_40_49:1,a_50_59:1,a_60p:1,ext_lim:1,rf_locked:3,
      on_gradual:-1,ch_swell_fast:-1,knee_front:-1,w_sit_long:-1}},
  {id:'acl',th:[10,7,4],anchor:['ch_pop','ch_swell_fast','ch_giveway'],depts:['sports','ortho','physio'],
   name:L('Anterior cruciate ligament (ACL) injury','एंटीरियर क्रूसिएट लिगामेंट (ACL) की चोट'),sci:'Anterior cruciate ligament rupture',
   what:L('The ACL is a strong band in the centre of the knee that stops the shin bone sliding forward. It tears with a sudden twist or landing; people often feel a pop, the knee swells within hours and later feels unstable or gives way.','ACL घुटने के बीच में एक मज़बूत पट्टी है जो पिंडली की हड्डी को आगे खिसकने से रोकती है। अचानक मुड़ने या कूदकर उतरने से फटती है; अक्सर पॉप महसूस होता है, घुटना कुछ घंटों में सूज जाता है और बाद में अस्थिर लगता या जवाब दे देता है।'),
   causes:L('Pivoting sports (football, kabaddi, basketball, badminton), awkward landings and road accidents.','मुड़ने वाले खेल (फुटबॉल, कबड्डी, बास्केटबॉल, बैडमिंटन), गलत तरह उतरना और सड़क दुर्घटनाएं।'),
   confirm:L('Examination by a doctor (Lachman and drawer tests) and an MRI scan. In primary care, a pop alone makes an ACL tear about 2.3 times more likely, and two of pop, quick swelling and giving way about 2.5 times.','डॉक्टर द्वारा जांच (लैकमैन और ड्रॉअर टेस्ट) और MRI स्कैन। प्राथमिक जांच में अकेला पॉप ACL फटने की संभावना लगभग 2.3 गुना, और पॉप, तेज़ सूजन और जवाब देने में से दो मिलकर लगभग 2.5 गुना करते हैं।'),cSrc:['wagacl'],
   treat:L('Physiotherapy rehabilitation for everyone; reconstruction surgery for people who want to return to pivoting sport or whose knee keeps giving way.','सभी के लिए फिज़ियोथेरेपी पुनर्वास; मुड़ने वाले खेल में लौटना चाहें या घुटना बार-बार जवाब दे तो रीकंस्ट्रक्शन सर्जरी।'),
   outlook:L('Early assessment matters because repeated giving way damages the meniscus and cartilage.','जल्दी जांच ज़रूरी है क्योंकि बार-बार जवाब देने से मेनिस्कस और कार्टिलेज खराब होते हैं।'),
   w:{ch_pop:1,ch_swell_fast:2,ch_giveway:2,acl2:2,on_twist:3,on_accident:1,a_u18:1,a_18_29:2,a_30_39:1,w_twist:1,ext_lim:1,a_60p:-2,on_gradual:-3,knee_front:-1}},
  {id:'osgood',th:[8,6,4],anchor:['tibial_tub','ch_bump_below'],onlyIf:{any:['a_u18','a_18_29']},depts:['paeds','physio','ortho'],
   name:L('Osgood-Schlatter disease (growing knee pain)','ऑसगुड-श्लैटर रोग (बढ़ती उम्र का घुटने का दर्द)'),sci:'Tibial tubercle apophysitis',
   what:L('In active children, the strong kneecap tendon pulls on the growth area of the shin bone just below the knee, causing a painful bump that hurts with running, jumping, kneeling and squatting.','सक्रिय बच्चों में घुटने के ठीक नीचे पिंडली की हड्डी के बढ़ने वाले हिस्से पर कटोरी का मज़बूत टेंडन खिंचाव डालता है, जिससे दर्द वाला उभार बनता है जो दौड़ने, कूदने, घुटनों के बल बैठने और उकड़ू बैठने पर दुखता है।'),
   causes:L('Sport during a growth spurt: boys about 10–15, girls about 8–13. It affects 9.8% of 12–15 year olds, and both knees in 20–30%.','बढ़त के दौर में खेल: लड़के लगभग 10–15, लड़कियाँ लगभग 8–13। 12–15 साल के 9.8% बच्चों में होता है, और 20–30% में दोनों घुटनों में।'),cSrc:['osgood'],
   confirm:L('Examination; an X-ray only if the picture is unusual or there was an injury.','जांच; तस्वीर असामान्य हो या चोट लगी हो तभी एक्स-रे।'),
   treat:L('Adjusting sport to pain, ice, a pad over the bump for kneeling, and thigh and hamstring stretching and strengthening; injections and surgery are not recommended.','दर्द के हिसाब से खेल कम-ज़्यादा करना, बर्फ़, घुटनों के बल बैठने के लिए उभार पर पैड, और जांघ व हैमस्ट्रिंग की स्ट्रेचिंग और मज़बूती; इंजेक्शन और सर्जरी की सलाह नहीं।'),
   outlook:L('It settles when growth finishes, usually within about 2 years; a small bump may remain.','बढ़त पूरी होने पर ठीक हो जाता है, आमतौर पर लगभग 2 साल में; छोटा उभार रह सकता है।'),oSrc:['osgood'],
   w:{tibial_tub:4,ch_bump_below:3,a_u18:3,w_run:2,w_squat:1,on_jump:2,on_gradual:1,sex_m:1,a_18_29:-2,ch_swell_fast:-2,ch_lock:-2}},
  {id:'ptend',th:[9,6,4],anchor:['on_jump','w_run'],depts:['physio','sports'],
   name:L('Kneecap tendon pain (jumper’s knee)','कटोरी के टेंडन का दर्द (जम्पर्स नी)'),sci:'Patellar tendinopathy',
   what:L('The tendon between the lower edge of the kneecap and the shin bone becomes painful from repeated jumping and landing. Pain is pinpointed just below the kneecap and comes on with loading.','कटोरी के निचले किनारे और पिंडली की हड्डी के बीच का टेंडन बार-बार कूदने और उतरने से दर्द करने लगता है। दर्द कटोरी के ठीक नीचे एक जगह होता है और भार पड़ने पर आता है।'),
   causes:L('Volleyball, basketball, athletics, kabaddi and sudden training increases.','वॉलीबॉल, बास्केटबॉल, एथलेटिक्स, कबड्डी और अचानक बढ़ी ट्रेनिंग।'),
   confirm:L('Examination; ultrasound if unclear.','जांच; साफ़ न हो तो अल्ट्रासाउंड।'),
   treat:L('A graded tendon-loading exercise programme with a physiotherapist and adjusting jumping load.','फिज़ियोथेरेपिस्ट के साथ धीरे-धीरे बढ़ता टेंडन-लोडिंग व्यायाम कार्यक्रम और कूदने का भार ठीक करना।'),
   outlook:L('Improves over months with loading exercise; rest alone rarely cures it.','लोडिंग व्यायाम से महीनों में सुधरता है; सिर्फ़ आराम से कम ही ठीक होता है।'),
   w:{on_jump:3,w_run:2,knee_front:1,tibial_tub:2,a_18_29:2,a_30_39:1,sex_m:1,a_u18:-1,a_60p:-2,ch_swell_fast:-2,ch_lock:-2,acr3:-1}},
  {id:'itb',th:[8,6,4],anchor:['knee_out'],depts:['physio','sports'],
   name:L('Iliotibial band syndrome (outer knee pain in runners)','इलियोटिबियल बैंड सिंड्रोम (धावकों में बाहरी घुटने का दर्द)'),sci:'Iliotibial band syndrome',
   what:L('The thick band running down the outside of the thigh rubs and irritates the tissue over the outer knee, causing sharp outer knee pain that starts after a set distance of running or cycling.','जांघ के बाहर से नीचे जाने वाली मोटी पट्टी बाहरी घुटने के ऊपर के ऊतक को रगड़कर परेशान करती है, जिससे दौड़ने या साइकिल चलाने की एक तय दूरी के बाद बाहरी घुटने में तेज़ दर्द शुरू होता है।'),
   causes:L('A sudden increase in running or cycling, downhill running and weak hip muscles.','अचानक ज़्यादा दौड़ना या साइकिल चलाना, ढलान पर दौड़ना और कूल्हे की कमज़ोर मांसपेशियाँ।'),
   confirm:L('Examination.','जांच।'),
   treat:L('Reducing and then gradually rebuilding running load, and hip strengthening with a physiotherapist.','दौड़ना कम करके फिर धीरे-धीरे बढ़ाना, और फिज़ियोथेरेपिस्ट के साथ कूल्हे को मज़बूत करना।'),
   outlook:L('Usually settles within weeks to a few months.','आमतौर पर कुछ हफ्तों से कुछ महीनों में ठीक।'),
   w:{knee_out:4,w_run:2,on_jump:2,a_18_29:1,a_30_39:1,on_gradual:1,knee_in:-2,ch_swell_fast:-2,ch_lock:-1,acr3:-1,a_60p:-1}},
  {id:'bursa',th:[8,6,4],anchor:['ch_swell_front'],depts:['ortho','gp'],
   name:L('Kneecap bursitis (housemaid’s knee)','कटोरी की बर्साइटिस (हाउसमेड्स नी)'),sci:'Prepatellar bursitis',
   what:L('A small fluid sac in front of the kneecap becomes inflamed from repeated kneeling, making a soft, sometimes warm swelling on the kneecap.','बार-बार घुटनों के बल बैठने से कटोरी के आगे की छोटी तरल थैली में सूजन आ जाती है, जिससे कटोरी पर नरम, कभी-कभी गर्म सूजन होती है।'),
   causes:L('Kneeling for floor cleaning, prayer, tiling or plumbing; a blow to the kneecap. If it becomes hot and red with fever, it may be infected.','फ़र्श साफ़ करने, प्रार्थना, टाइल या प्लंबिंग के लिए घुटनों के बल बैठना; कटोरी पर चोट। अगर गर्म और लाल हो और बुखार हो तो इन्फेक्शन हो सकता है।'),
   confirm:L('Examination; fluid may be drawn off to check for infection.','जांच; इन्फेक्शन जांचने के लिए तरल निकाला जा सकता है।'),
   treat:L('Avoiding kneeling, a kneeling pad, ice; antibiotics if infected.','घुटनों के बल बैठने से बचना, घुटने का पैड, बर्फ़; इन्फेक्शन हो तो एंटीबायोटिक।'),
   outlook:L('Usually settles in weeks once kneeling is reduced.','घुटनों के बल बैठना कम करने पर आमतौर पर कुछ हफ्तों में ठीक।'),
   w:{ch_swell_front:4,on_kneel:3,knee_front:1,on_fall:1,ch_lock:-1,ch_giveway:-1}},
  {id:'baker',th:[8,6,4],anchor:['ch_lump_back','knee_back'],depts:['ortho','physio'],
   name:L('Baker’s cyst (swelling behind the knee)','बेकर सिस्ट (घुटने के पीछे सूजन)'),sci:'Popliteal cyst',
   what:L('Extra joint fluid, usually from arthritis or a meniscus tear, bulges into a sac behind the knee, causing tightness and a soft swelling. If it bursts, the calf can swell and look like a blood clot, so a calf swelling always needs checking.','जोड़ का ज़्यादा तरल, आमतौर पर गठिया या मेनिस्कस फटने से, घुटने के पीछे एक थैली में उभर आता है, जिससे खिंचाव और नरम सूजन होती है। फटने पर पिंडली सूज सकती है और खून के थक्के जैसी लगती है, इसलिए पिंडली की सूजन हमेशा जांचनी चाहिए।'),
   causes:L('Knee osteoarthritis, a meniscus tear or inflammatory arthritis.','घुटने का ऑस्टियोआर्थराइटिस, मेनिस्कस फटना या सूजन वाली गठिया।'),
   confirm:L('Examination and an ultrasound scan, which also rules out a blood clot.','जांच और अल्ट्रासाउंड स्कैन, जिससे खून का थक्का भी खारिज होता है।'),
   treat:L('Treating the knee problem behind it; drainage or injection if troublesome.','पीछे की घुटने की समस्या का इलाज; तकलीफ़ हो तो तरल निकालना या इंजेक्शन।'),
   outlook:L('Often shrinks when the underlying knee problem settles.','अक्सर घुटने की मूल समस्या ठीक होने पर छोटा हो जाता है।'),
   w:{ch_lump_back:4,knee_back:3,ch_bony:1,ch_crepitus:1,acr3:1,a_50_59:1,a_60p:1,w_squat:1,calf:1}},
  {id:'crystal',th:[8,6,4],anchor:['o_gout','rf_hot'],depts:['medicine','rheum'],
   name:L('Gout or pseudogout (crystal arthritis)','गाउट या स्यूडोगाउट (क्रिस्टल गठिया)'),sci:'Crystal arthritis (urate or calcium pyrophosphate)',
   what:L('Crystals in the joint fluid trigger a sudden, very painful, hot, red and swollen joint, often overnight. Because an infected joint looks the same, a hot swollen knee is treated as infection until proven otherwise.','जोड़ के तरल में क्रिस्टल अचानक बहुत दर्द वाला, गर्म, लाल और सूजा जोड़ बना देते हैं, अक्सर रात भर में। क्योंकि इन्फेक्शन वाला जोड़ भी ऐसा ही दिखता है, गर्म सूजे घुटने को इन्फेक्शन मानकर चला जाता है जब तक कि साबित न हो जाए कि वह नहीं है।'),
   causes:L('Gout: high uric acid, alcohol, some water tablets, kidney disease. Pseudogout: older age.','गाउट: ज़्यादा यूरिक एसिड, शराब, कुछ पेशाब की गोलियाँ, गुर्दे की बीमारी। स्यूडोगाउट: बड़ी उम्र।'),
   confirm:L('Drawing fluid from the joint to look for crystals and rule out infection.','क्रिस्टल देखने और इन्फेक्शन खारिज करने के लिए जोड़ से तरल निकालना।'),cSrc:['hotjoint'],
   treat:L('Anti-inflammatory medicines or steroids for the attack; long-term uric acid lowering for repeated gout.','दौरे में सूजन-रोधी दवाएं या स्टेरॉयड; बार-बार गाउट में लंबे समय तक यूरिक एसिड घटाने की दवा।'),
   outlook:L('Attacks settle in days to weeks; lowering uric acid prevents further attacks.','दौरे कुछ दिनों से हफ्तों में ठीक होते हैं; यूरिक एसिड घटाने से आगे के दौरे रुकते हैं।'),
   w:{o_gout:4,rf_hot:3,a_50_59:1,a_60p:1,sex_m:1,on_woke:1,o_other_joints:1,ch_pop:-2,on_twist:-2}},
  {id:'inflam',th:[8,6,4],anchor:['ch_stiff_long','o_other_joints'],depts:['rheum','medicine'],
   name:L('Inflammatory arthritis (for example rheumatoid arthritis)','सूजन वाली गठिया (जैसे रूमेटॉइड आर्थराइटिस)'),sci:'Inflammatory arthritis',
   what:L('The immune system inflames the joint lining, causing swelling, warmth and long morning stiffness, often in several joints at once.','इम्यून सिस्टम जोड़ की झिल्ली में सूजन लाता है, जिससे सूजन, गर्मी और सुबह की लंबी जकड़न होती है, अक्सर एक साथ कई जोड़ों में।'),
   causes:L('Rheumatoid arthritis, psoriatic arthritis, spondyloarthritis and others.','रूमेटॉइड आर्थराइटिस, सोरियाटिक आर्थराइटिस, स्पॉन्डिलोआर्थराइटिस और अन्य।'),
   confirm:L('Blood tests, examination of all joints and sometimes joint fluid tests, by a rheumatologist.','रूमेटोलॉजिस्ट द्वारा ब्लड टेस्ट, सभी जोड़ों की जांच और कभी-कभी जोड़ के तरल की जांच।'),
   treat:L('Early disease-modifying medicines protect the joints.','जल्दी शुरू की गई बीमारी नियंत्रित करने वाली दवाएं जोड़ों को बचाती हैं।'),
   outlook:L('Well controlled when treated early.','जल्दी इलाज से अच्छा नियंत्रण।'),
   w:{ch_stiff_long:3,o_other_joints:3,knee_both:1,ch_swell_slow:1,sex_f:1,h_1_5y:1,r_spa:2,ch_stiff_short:-2,on_twist:-2,ch_pop:-2}},
  {id:'hipref',th:[8,6,4],anchor:['hipthigh','o_hip_pain','rf_child_limp'],depts:['ortho',{id:'paeds',when:'a_u18'}],
   name:L('Pain coming from the hip','कूल्हे से आने वाला दर्द'),sci:'Hip pathology referring to the knee (in children, slipped capital femoral epiphysis)',
   what:L('The hip and knee share nerves, so hip arthritis in adults, or a slipped hip growth plate in an overweight child or teenager, can be felt mainly in the knee or thigh.','कूल्हे और घुटने की नसें साझा होती हैं, इसलिए वयस्कों में कूल्हे की गठिया, या ज़्यादा वज़न वाले बच्चे या किशोर में कूल्हे की ग्रोथ प्लेट खिसकना, मुख्य रूप से घुटने या जांघ में महसूस हो सकता है।'),
   causes:L('Hip osteoarthritis; in children, slipped capital femoral epiphysis (knee pain is the presenting complaint in 26%) or Perthes disease.','कूल्हे का ऑस्टियोआर्थराइटिस; बच्चों में स्लिप्ड कैपिटल फ़ेमोरल एपिफ़ाइसिस (26% में शुरुआती शिकायत घुटने का दर्द) या पर्थीस रोग।'),cSrc:['scfe'],
   confirm:L('Hip examination (especially turning the hip inwards) and a hip X-ray.','कूल्हे की जांच (खासकर कूल्हे को अंदर घुमाना) और कूल्हे का एक्स-रे।'),
   treat:L('Depends on the cause; a slipped growth plate needs urgent surgery.','कारण पर निर्भर; खिसकी ग्रोथ प्लेट में जल्दी सर्जरी ज़रूरी।'),
   outlook:L('A delay in finding a slipped hip in a child leads to more complications, so a limping child needs prompt review.','बच्चे में खिसका कूल्हा देर से पकड़ने पर जटिलताएं बढ़ती हैं, इसलिए लंगड़ाते बच्चे को जल्दी दिखाएं।'),oSrc:['scfe'],
   w:{hipthigh:3,o_hip_pain:3,rf_child_limp:4,o_overweight:1,a_u18:1,a_60p:1,squat_neg:1,jlt_neg:1,knee_front:-1,knee_in:-1,ch_lock:-2,ch_swell_fast:-2}}
];
const EMERG = {
  septic:{name:L('Possible infected joint or crystal attack','जोड़ में इन्फेक्शन या क्रिस्टल के दौरे की आशंका'),sci:'Acute hot swollen joint (septic arthritis until proven otherwise)',
    what:L('A knee that becomes hot, red and swollen over hours or days must be treated as infected until proven otherwise, even without fever: infection can destroy a joint, and has a mortality of up to 11%. Go to the emergency department today; fluid is drawn from the joint before antibiotics.','कुछ घंटों या दिनों में गर्म, लाल और सूजे घुटने को इन्फेक्शन मानकर ही चलना चाहिए जब तक साबित न हो, भले ही बुखार न हो: इन्फेक्शन जोड़ को खराब कर सकता है और इसमें मृत्यु दर 11% तक है। आज ही इमरजेंसी जाएं; एंटीबायोटिक से पहले जोड़ से तरल निकाला जाता है।'),src:['hotjoint'],depts:['emergency','ortho']},
  fracture:{name:L('Possible fracture','फ्रैक्चर की आशंका'),sci:'Knee fracture (Ottawa knee rule positive)',
    what:L('After an injury, being unable to take 4 steps, to bend the knee to a right angle, or pain on touching the kneecap or the bony point below the outer knee means an X-ray is needed. This rule misses only about 1.5% of fractures. Go to the emergency department.','चोट के बाद 4 कदम न चल पाना, घुटना समकोण तक न मुड़ना, या कटोरी या बाहर नीचे की हड्डी छूने पर दर्द का मतलब है कि एक्स-रे ज़रूरी है। यह नियम सिर्फ़ लगभग 1.5% फ्रैक्चर छोड़ता है। इमरजेंसी जाएं।'),src:['ottawa'],depts:['emergency','ortho']},
  dvt:{name:L('Possible blood clot in the leg (DVT)','पैर में खून का थक्का (DVT) की आशंका'),sci:'Deep vein thrombosis',
    what:L('A swollen, warm, tender calf, especially after travel, surgery, a plaster or bed rest, can be a clot in a deep vein. It needs an ultrasound scan within hours. If you are breathless or have chest pain, call 108 now: the clot may have moved to the lungs.','सूजी, गर्म, दर्द वाली पिंडली, खासकर यात्रा, सर्जरी, प्लास्टर या बिस्तर पर आराम के बाद, गहरी नस में थक्का हो सकती है। कुछ घंटों में अल्ट्रासाउंड स्कैन ज़रूरी। सांस फूले या सीने में दर्द हो तो अभी 108 बुलाएं: थक्का फेफड़ों तक जा सकता है।'),src:['nicedvt'],depts:['emergency','vascular']}
};
const RS = {
  o_locked:L('Knee locked after an injury: a torn meniscus may be caught in the joint','चोट के बाद घुटना फंसा: फटा मेनिस्कस जोड़ में फंसा हो सकता है'),
  o_child:L('A limping child or teenager with knee or thigh pain: the hip must be checked','घुटने या जांघ के दर्द के साथ लंगड़ाता बच्चा या किशोर: कूल्हा जांचना ज़रूरी'),
  o_fever:L('Fever, night sweats or weight loss with knee pain','घुटने के दर्द के साथ बुखार, रात को पसीना या वज़न घटना'),
  o_night:L('Constant night pain in a child, at age 50 or over, or with past cancer','बच्चे में, 50 या ज़्यादा उम्र में, या पहले कैंसर के साथ रात का लगातार दर्द'),
  o_pain:L('Very severe pain (9–10 out of 10)','बहुत तेज़ दर्द (10 में 9–10)'),
  y_injury:L('Started with a twist, fall or accident','मुड़ने, गिरने या दुर्घटना से शुरू'), y_swell:L('The knee is swollen','घुटना सूजा है'), y_giveway:L('The knee gives way','घुटना जवाब देता है'),
  y_lock:L('The knee catches or locks','घुटना अटकता या फंसता है'), y_long:L('This bout has lasted more than 6 weeks','इस बार का दर्द 6 हफ्ते से ज़्यादा से है'),
  y_pain:L('Strong pain (7–8 out of 10)','तेज़ दर्द (10 में 7–8)'), y_sleep:L('Pain disturbing sleep','दर्द से नींद खराब'),
  y_inflam:L('Long morning stiffness or several swollen joints','सुबह की लंबी जकड़न या कई सूजे जोड़'), y_gout:L('Past gout attacks','पहले गाउट के दौरे'),
  y_walk:L('Difficulty walking','चलने में दिक्कत')
};
const DERIVED = [
  {id:'knee_any', when:{any:kneeAreas}},
  {id:'age50', when:{any:['a_50_59','a_60p']}},
  {id:'nowarm', when:{not:'rf_hot'}},
  {id:'acr3', when:{all:['knee_any',{atLeast:[3,['age50','ch_stiff_short','ch_crepitus','jlt_pos','ch_bony','nowarm']]}]}},
  {id:'acr4', when:{all:['knee_any',{atLeast:[4,['age50','ch_stiff_short','ch_crepitus','jlt_pos','ch_bony','nowarm']]}]}},
  {id:'acr_lt3', when:{all:['knee_any',{not:'acr3'}]}},
  {id:'nice_oa', when:{all:[{any:['a_40_49','a_50_59','a_60p']},{any:['w_stairs','w_walk_long','w_squat','w_run']},{not:'ch_stiff_long'}]}},
  {id:'acl2', when:{atLeast:[2,['ch_pop','ch_swell_fast','ch_giveway']]}},
  {id:'walk_hard', when:{any:['kwalk_no','kwalk_diff']}}
];
const URGENCY = {
  orange:[
    {r:'o_locked', when:'rf_locked'}, {r:'o_child', when:'rf_child_limp'}, {r:'o_fever', when:'rf_fever'},
    {r:'o_night', when:{all:['rf_night',{any:['age_ge50','r_cancer','a_u18']}]}}, {r:'o_pain', when:{painGte:9}}
  ],
  yellow:[
    {r:'y_injury', when:{any:['on_twist','on_fall','on_accident']}}, {r:'y_swell', when:{any:['ch_swell_fast','ch_swell_slow','ch_lump_back','ch_swell_front']}},
    {r:'y_giveway', when:'ch_giveway'}, {r:'y_lock', when:'ch_lock'}, {r:'y_often', when:'btw_often'}, {r:'y_long', when:{any:['d_6_12','d_3m']}},
    {r:'y_pain', when:{all:[{painGte:7},{not:{painGte:9}}]}}, {r:'y_sleep', when:'sleep_bad'}, {r:'y_inflam', when:{any:['ch_stiff_long','o_other_joints']}},
    {r:'y_gout', when:'o_gout'}, {r:'y_walk', when:'kwalk_no'}
  ]
};
const EMERG_WHEN = {septic:'rf_hot', fracture:'rf_fracture', dvt:'rf_dvt'};
const FOCUS = {
  koa:{bones:['leg']}, pfp:{bones:['leg']}, menisc:{bones:['leg']}, acl:{bones:['leg']}, osgood:{bones:['leg']}, ptend:{bones:['leg']},
  itb:{bones:['leg']}, bursa:{bones:['leg']}, baker:{bones:['leg']}, crystal:{bones:['leg']}, inflam:{bones:['leg']},
  hipref:{bones:['pelvis','leg']}
};
const LBLX = {knee_one:L('One knee','एक घुटना'), knee_both:L('Both knees','दोनों घुटने'), knee_any:L('Knee pain','घुटने का दर्द'),
  acr3:L('3 or more of the 6 osteoarthritis features','ऑस्टियोआर्थराइटिस के 6 में से 3 या ज़्यादा लक्षण'), acr4:L('4 or more of the 6 osteoarthritis features','ऑस्टियोआर्थराइटिस के 6 में से 4 या ज़्यादा लक्षण'),
  acr_lt3:L('Fewer than 3 of the 6 osteoarthritis features','ऑस्टियोआर्थराइटिस के 6 में से 3 से कम लक्षण'), nice_oa:L('Age 40+, pain with activity, little morning stiffness','40+ उम्र, गतिविधि से दर्द, सुबह कम जकड़न'),
  acl2:L('Two of: pop, quick swelling, giving way','इनमें से दो: पॉप, तेज़ सूजन, जवाब देना'), age50:L('Age 50 or over','50 या ज़्यादा उम्र'), nowarm:L('No warmth or redness','गर्मी या लाली नहीं'), walk_hard:L('Difficulty walking','चलने में दिक्कत')};
const FX = {
  acr3:L('Knee pain with 3 of 6 classic features (age over 50, short morning stiffness, grinding, bony tenderness, bony enlargement, no warmth) picks up 95% of knee osteoarthritis and makes it about 3 times more likely.','6 में से 3 खास लक्षणों (50 से ज़्यादा उम्र, सुबह थोड़ी जकड़न, किरकिराहट, हड्डी पर दबाने से दर्द, हड्डी का बढ़ना, गर्मी न होना) के साथ घुटने का दर्द 95% ऑस्टियोआर्थराइटिस पकड़ता है और संभावना लगभग 3 गुना करता है।'),
  acr4:L('4 of the 6 features make knee osteoarthritis about 7.6 times more likely.','6 में से 4 लक्षण घुटने के ऑस्टियोआर्थराइटिस की संभावना लगभग 7.6 गुना करते हैं।'),
  acr_lt3:L('Fewer than 3 of the 6 features makes osteoarthritis much less likely.','6 में से 3 से कम लक्षण ऑस्टियोआर्थराइटिस की संभावना बहुत कम करते हैं।'),
  nice_oa:L('NICE diagnoses osteoarthritis clinically at 45+ with activity-related pain and little morning stiffness.','NICE 45+ उम्र में गतिविधि से दर्द और सुबह कम जकड़न पर बिना स्कैन ऑस्टियोआर्थराइटिस पहचानता है।'),
  knee_front:L('Pain around the kneecap points to the kneecap joint.','कटोरी के आसपास दर्द कटोरी के जोड़ की ओर इशारा करता है।'),
  knee_in:L('Inner knee pain is typical of osteoarthritis and inner meniscus tears.','अंदरूनी घुटने का दर्द ऑस्टियोआर्थराइटिस और अंदरूनी मेनिस्कस फटन का खास लक्षण है।'),
  knee_out:L('Outer knee pain in runners points to the iliotibial band.','धावकों में बाहरी घुटने का दर्द आईटी बैंड की ओर इशारा करता है।'),
  w_sit_long:L('Pain after sitting with bent knees (the “cinema sign”) is typical of kneecap pain.','घुटने मोड़कर बैठने के बाद दर्द (“सिनेमा साइन”) कटोरी के दर्द का खास लक्षण है।'),
  w_stairs:L('Stairs load the kneecap joint and worn cartilage.','सीढ़ियाँ कटोरी के जोड़ और घिसी कार्टिलेज पर भार डालती हैं।'),
  w_squat:L('Squatting and floor sitting load the kneecap joint and the menisci.','उकड़ू और ज़मीन पर बैठना कटोरी के जोड़ और मेनिस्कस पर भार डालता है।'),
  squat_pos:L('Pain on squatting is one of the more useful signs of kneecap pain.','उकड़ू बैठने पर दर्द कटोरी के दर्द के ज़्यादा उपयोगी संकेतों में से है।'),
  jlt_pos:L('Tenderness on the joint line makes a meniscus tear about 2.7 times more likely; it also occurs with arthritis.','जोड़ की लाइन पर दर्द मेनिस्कस फटने की संभावना लगभग 2.7 गुना करता है; यह गठिया में भी होता है।'),
  ch_lock:L('Catching or locking suggests a torn meniscus or a loose fragment.','अटकना या फंसना फटे मेनिस्कस या ढीले टुकड़े का संकेत है।'),
  on_twist:L('A twisting injury on a planted foot can tear the meniscus or the ACL.','टिके पैर पर मुड़ने की चोट मेनिस्कस या ACL फाड़ सकती है।'),
  ch_pop:L('A pop at the moment of injury makes an ACL tear about 2.3 times more likely.','चोट के समय पॉप ACL फटने की संभावना लगभग 2.3 गुना करता है।'),
  ch_swell_fast:L('Swelling within about 2 hours means bleeding into the joint, typical of an ACL tear or fracture.','लगभग 2 घंटे में सूजन का मतलब जोड़ में खून आना है, जो ACL फटने या फ्रैक्चर का खास लक्षण है।'),
  ch_swell_slow:L('Swelling that builds up over a day is typical of a meniscus tear.','एक दिन में धीरे-धीरे आई सूजन मेनिस्कस फटन का खास लक्षण है।'),
  ch_giveway:L('A knee that gives way suggests a ligament injury or a weak thigh.','जवाब देने वाला घुटना लिगामेंट की चोट या कमज़ोर जांघ का संकेत है।'),
  acl2:L('Two of pop, quick swelling and giving way make an ACL tear about 2.5 times more likely.','पॉप, तेज़ सूजन और जवाब देने में से दो ACL फटने की संभावना लगभग 2.5 गुना करते हैं।'),
  tibial_tub:L('Pain on the bump below the kneecap in an active child is typical of Osgood-Schlatter disease.','सक्रिय बच्चे में कटोरी के नीचे के उभार पर दर्द ऑसगुड-श्लैटर रोग का खास लक्षण है।'),
  ch_bump_below:L('A painful bump below the kneecap is the classic sign of Osgood-Schlatter disease.','कटोरी के नीचे दर्द वाला उभार ऑसगुड-श्लैटर रोग का क्लासिक संकेत है।'),
  ch_lump_back:L('A soft swelling behind the knee is usually a Baker’s cyst.','घुटने के पीछे नरम सूजन आमतौर पर बेकर सिस्ट होती है।'),
  ch_swell_front:L('A soft swelling on the kneecap after kneeling is a bursitis.','घुटनों के बल बैठने के बाद कटोरी पर नरम सूजन बर्साइटिस है।'),
  on_kneel:L('Repeated kneeling and squatting load the knee and the bursa in front of it.','बार-बार घुटनों के बल और उकड़ू बैठना घुटने और उसके आगे की बर्सा पर भार डालता है।'),
  ch_bony:L('A knobbly, enlarged knee is typical of osteoarthritis.','गांठदार, बढ़ा हुआ घुटना ऑस्टियोआर्थराइटिस का खास लक्षण है।'),
  ch_crepitus:L('Grinding on bending is one of the osteoarthritis features.','मोड़ने पर किरकिराहट ऑस्टियोआर्थराइटिस के लक्षणों में से एक है।'),
  ch_stiff_short:L('Morning stiffness under 30 minutes fits osteoarthritis.','30 मिनट से कम सुबह की जकड़न ऑस्टियोआर्थराइटिस से मेल खाती है।'),
  ch_stiff_long:L('Morning stiffness over 30 minutes suggests an inflammatory arthritis.','30 मिनट से ज़्यादा सुबह की जकड़न सूजन वाली गठिया का संकेत है।'),
  o_other_joints:L('Several swollen joints point to an inflammatory arthritis.','कई सूजे जोड़ सूजन वाली गठिया की ओर इशारा करते हैं।'),
  o_gout:L('Past gout attacks make a crystal flare likely, though infection must still be ruled out.','पहले के गाउट दौरे क्रिस्टल दौरे की संभावना बढ़ाते हैं, फिर भी इन्फेक्शन खारिज करना ज़रूरी है।'),
  o_overweight:L('Extra weight increases the load through the knee and the risk of osteoarthritis.','ज़्यादा वज़न घुटने पर भार और ऑस्टियोआर्थराइटिस का खतरा बढ़ाता है।'),
  hipthigh:L('Groin or front-of-thigh pain with knee pain points to the hip.','घुटने के दर्द के साथ जांघ के जोड़ या जांघ के आगे दर्द कूल्हे की ओर इशारा करता है।'),
  o_hip_pain:L('Hip pain often spreads to the knee.','कूल्हे का दर्द अक्सर घुटने तक फैलता है।'),
  ext_lim:L('A knee that will not straighten fully suggests swelling, arthritis or a trapped meniscus.','पूरा सीधा न होने वाला घुटना सूजन, गठिया या फंसे मेनिस्कस का संकेत है।'),
  on_jump:L('A rise in running and jumping overloads the kneecap tendon and joint.','दौड़ने और कूदने में बढ़ोतरी कटोरी के टेंडन और जोड़ पर भार डालती है।'),
  w_run:L('Pain with running or jumping points to the tendons and the kneecap joint.','दौड़ने या कूदने पर दर्द टेंडन और कटोरी के जोड़ की ओर इशारा करता है।')
};
const STATS = [
  {v:'28.7%',t:L('of adults in an Indian community study had knee osteoarthritis','एक भारतीय सामुदायिक अध्ययन में वयस्कों को घुटने का ऑस्टियोआर्थराइटिस'),s:'indiaoa'},
  {v:'95%',t:L('of knee osteoarthritis is picked up by knee pain + 3 of 6 simple features','घुटने का ऑस्टियोआर्थराइटिस घुटने के दर्द + 6 में से 3 आसान लक्षणों से पकड़ में आता है'),s:'altman86'},
  {v:'10%',t:L('weight loss helps knee osteoarthritis more than 5%','वज़न घटाना 5% से ज़्यादा घुटने के ऑस्टियोआर्थराइटिस में मदद करता है'),s:'niceoa'},
  {v:'22.7%',t:L('of people have kneecap (patellofemoral) pain in a year; 28.9% of teenagers','लोगों को साल में कटोरी (पटेलोफ़ेमोरल) का दर्द; किशोरों में 28.9%'),s:'smithpfp'},
  {v:'98.5%',t:L('of knee fractures are caught by the Ottawa knee rule after an injury','घुटने के फ्रैक्चर चोट के बाद ओटावा नी रूल से पकड़े जाते हैं'),s:'ottawa'},
  {v:'9.8%',t:L('of 12–15 year olds get Osgood-Schlatter disease','12–15 साल के बच्चों को ऑसगुड-श्लैटर रोग'),s:'osgood'}
];
const UI = {
  repT:L('Knee pain assessment','घुटने के दर्द की जांच रिपोर्ट'), tag:L('Knee assessment','घुटने की जांच'),
  safPic:L('Calf (asked below): a swollen, warm, tender calf can be a blood clot.','पिंडली (नीचे पूछा गया): सूजी, गर्म, दर्द वाली पिंडली खून का थक्का हो सकती है।'),
  must:[L('This assessment cannot test the ligaments, the menisci, swelling inside the joint or the strength of your thigh, which a doctor checks by examining the knee.','यह जांच लिगामेंट, मेनिस्कस, जोड़ के अंदर की सूजन या जांघ की ताकत नहीं परख सकती, जिन्हें डॉक्टर घुटने की जांच से देखते हैं।'),
    L('Only a doctor can decide whether you need an X-ray, MRI, ultrasound, blood tests or joint fluid tests, and interpret them with the examination.','एक्स-रे, MRI, अल्ट्रासाउंड, ब्लड टेस्ट या जोड़ के तरल की जांच की ज़रूरत है या नहीं, यह सिर्फ़ डॉक्टर तय कर सकते हैं और जांच के साथ उनका मतलब समझा सकते हैं।'),
    L('Knee pain can also come from the hip, the back, a blood clot in the calf or a whole-body illness; a doctor examines these too.','घुटने का दर्द कूल्हे, कमर, पिंडली में खून के थक्के या पूरे शरीर की बीमारी से भी हो सकता है; डॉक्टर इनकी भी जांच करते हैं।'),
    L('Medicines, injections and exercise plans must be chosen for you personally.','दवाएं, इंजेक्शन और व्यायाम योजना आपके लिए व्यक्तिगत रूप से तय होनी चाहिए।')],
  tip1:L('Keep moving within comfort; short walks and gentle exercise are better than complete rest.','आराम की सीमा में चलते-फिरते रहें; पूरे आराम से बेहतर हैं छोटी सैर और हल्का व्यायाम।'),
  tip2:L('Until you are examined, avoid deep squatting, sitting cross-legged on the floor and twisting sports; use a chair and a western toilet if possible.','जांच होने तक गहरा उकड़ू बैठना, ज़मीन पर पालथी मारकर बैठना और मुड़ने वाले खेल से बचें; हो सके तो कुर्सी और वेस्टर्न टॉयलेट इस्तेमाल करें।'),
  gPost:L('Knee bones (thigh bone, shin bone and kneecap area) with the leg nerves; the highlighted bones are those most involved in the likely cause.','घुटने की हड्डियाँ (जांघ की हड्डी, पिंडली की हड्डी और कटोरी का हिस्सा) और पैर की नसें; चमकती हड्डियाँ संभावित कारण से सबसे ज़्यादा जुड़ी हैं।'),
  gRef:L('Knee bones and leg nerves for reference.','संदर्भ के लिए घुटने की हड्डियाँ और पैर की नसें।'), gX:L('See-through view: the bones under the areas you marked.','आर-पार व्यू: आपके चिन्हित हिस्सों के नीचे की हड्डियाँ।'),
  kwalkT:L('Walking','चलना'), stairsT:L('Stairs, squatting and getting up from the floor','सीढ़ियाँ, उकड़ू बैठना और ज़मीन से उठना')
};
const FUNCS = [
  {id:'kwalk', label:'kwalkT', req:true, opts:[['kwalk_ok',L('Normally','सामान्य')],['kwalk_diff',L('With pain or a limp','दर्द या लंगड़ाहट के साथ')],['kwalk_no',L('Can hardly walk','मुश्किल से चल पाते हैं')]]},
  {id:'stairs', label:'stairsT', req:true, opts:[['stairs_ok',L('Normally','सामान्य')],['stairs_diff',L('With difficulty or support','मुश्किल से या सहारे से')],['stairs_no',L('Cannot do it','नहीं कर पाते')]]},
  {id:'sleep', label:'sleep', opts:C.SLEEPS}
];
SPG.data.modules.knee = {id:'knee', order:6,
  card:{reg:['knee_front_l','knee_in_l','knee_out_l','tibial_tub_l'], view:{az:0.35, el:0.08, d:2.0, yk:'knee', dy:0.12, tx:0.06}, hint:L('Knee arthritis, kneecap pain, twisting injury, swelling, Osgood-Schlatter','घुटने की गठिया, कटोरी का दर्द, मुड़ने की चोट, सूजन, ऑसगुड-श्लैटर')},
  name:L('Knee pain','घुटने का दर्द'), safetyView:'calf', startRegions:['knee_front_l','knee_in_l'], safetyRegions:['calf_l','calf_r'],
  labelSet:[], GAL:{nerves:['sciatic','tibial','peroneal','femoral','saphenous'], joint:{view:{az:0.55, el:0.12, d:0.85, yk:'knee', dy:0.0, tx:0.13}, opts:{nerveKeep:['tibial','peroneal','femoral','saphenous','sciatic'], noUpper:true}}},
  resultView:{az:0.45, el:0.1, d:1.5, yk:'knee', dy:0.05, tx:0.1}, defaultDept:'ortho',
  ONSETS, PAT, RFS, VIEWS, AREAS, TESTS, CONDS, EMERG, ROOTS:{}, RS, DERIVED, SIDES:{areas:kneeAreas, one:'knee_one', both:'knee_both', sideAreas:kneeAreas.concat(['calf','hipthigh'])},
  URGENCY, EMERG_WHEN, ROOT_RULES:[], DISC_OF:{}, EXIT_OF:{}, DEPT_RULES:[], FOCUS, LBLX, UI, FUNCS, FX, STATS};
})();
