window.SPG = window.SPG || {data:{modules:{}}};
/* Lower back (lumbar) module: body areas, questions, bedside tests, red flags, conditions with evidence weights,
   urgency rules, nerve-root rules and explanations. The engine in js/app.js reads everything from here. */
(function(){
const PI = Math.PI;
const L = (en, hi) => ({en, hi});
const C = SPG.data.common, WALKS = C.WALKS, SITS = C.SITS, SLEEPS = C.SLEEPS;
const DOMS = [['dom_back',L('Back pain is worse','कमर का दर्द ज़्यादा')],['dom_leg',L('Leg pain is worse','पैर का दर्द ज़्यादा')],['dom_equal',L('About the same','लगभग बराबर')]];
const PAT = {
  char:[
    ['ch_shoot',L('Sharp, electric or shooting pain down the leg','पैर में नीचे तक तेज़, करंट जैसा दर्द')],
    ['ch_tingle',L('Burning or pins and needles in the leg or foot','पैर या पंजे में जलन या झुनझुनी')],
    ['ch_numb',L('A numb patch on the leg or foot','पैर या पंजे पर सुन्न हिस्सा')],
    ['ch_ache',L('Dull, deep ache in the back','कमर में भारी, गहरा दर्द')],
    ['ch_spasm',L('Muscle spasm; back feels locked or tilted','मांसपेशियों में ऐंठन; कमर जकड़ी या टेढ़ी लगती है')],
    ['ch_heavy',L('Legs feel heavy or tired','पैर भारी या थके लगते हैं')],
    ['ch_colic',L('Pain at the side that comes in waves','साइड में लहरों की तरह आता दर्द')],
    ['ch_stiff_am',L('Stiff for more than 30 minutes after waking','सुबह उठने पर 30 मिनट से ज़्यादा अकड़न')],
    ['ch_night_wake',L('Wakes you late at night and eases after getting up','देर रात दर्द से नींद खुलती है, उठने पर आराम')],
    ['ch_alt_buttock',L('Buttock pain that switches from one side to the other','नितंब का दर्द जो कभी एक तरफ़, कभी दूसरी तरफ़ होता है')],
    ['ch_heel',L('Heel pain without any injury','बिना किसी चोट के एड़ी में दर्द')]
  ],
  worse:[
    ['w_sit',L('Sitting','बैठना')],['w_bend',L('Bending forward','आगे झुकना')],['w_cough',L('Coughing, sneezing or straining','खांसी, छींक या ज़ोर लगाना')],
    ['w_rise',L('Getting up from sitting','बैठे से उठना')],['w_extend',L('Bending backwards or arching','पीछे झुकना')],['w_stand',L('Standing for long','देर तक खड़े रहना')],
    ['w_walk',L('Walking: legs ache, tingle or feel heavy, and ease only after sitting or bending forward','चलना: पैरों में दर्द, झुनझुनी या भारीपन जो बैठने या आगे झुकने पर ही कम हो')],
    ['w_walk_calf',L('Walking: calf cramps or aches that ease within 1–2 minutes of just standing still','चलना: पिंडली में ऐंठन या दर्द जो सिर्फ़ 1–2 मिनट खड़े रहने से ठीक हो जाए')],
    ['w_rest',L('Resting (better once you get moving)','आराम करना (हिलने-डुलने से बेहतर)')]
  ],
  better:[['b_lying',L('Lying down','लेटना')],['b_sitflex',L('Sitting or leaning forward','बैठना या आगे झुकना')],['b_sit_nopain',L('No pain at all while sitting','बैठे रहने पर बिल्कुल दर्द नहीं')],['b_walk',L('Walking and moving around','चलना-फिरना')],['b_exercise',L('Exercise','व्यायाम')]],
  other:[['u_urine',L('Burning urine or blood in urine','पेशाब में जलन या खून')]]
};
const RFS = [
  ['rf_bladder',L('New difficulty passing urine, leaking urine, or loss of bowel control','पेशाब करने में नई दिक्कत, पेशाब अपने आप निकलना, या शौच पर नियंत्रण न रहना')],
  ['rf_saddle',L('Numbness around the genitals, inner thighs or back passage (saddle area)','जननांग, जांघों के अंदर या गुदा के आसपास सुन्नपन (सैडल एरिया)')],
  ['rf_weak_prog',L('Weakness in one or both legs that is getting worse','एक या दोनों पैरों में बढ़ती कमज़ोरी')],
  ['rf_trauma',L('Started after a major injury: road accident or fall from a height','बड़ी चोट के बाद शुरू: सड़क दुर्घटना या ऊंचाई से गिरना')],
  ['rf_fever',L('Fever, night sweats or weight loss without trying','बुखार, रात को पसीना या बिना कोशिश वज़न घटना')],
  ['rf_night',L('Constant pain at night that no position eases','रात को लगातार दर्द जो किसी भी पोज़िशन में कम न हो')]
];

/* ================= body areas ================= */
const VIEWS = {
  lowback:{az:PI,el:0.08,d:1.75,yk:'hj',dy:0.13}, flank:{az:PI-0.55,el:0.1,d:1.8,yk:'hj',dy:0.22}, buttock:{az:PI,el:0.04,d:1.75,yk:'hj',dy:0.0},
  tailbone:{az:PI,el:-0.04,d:1.15,yk:'hj',dy:0.02}, groin:{az:0,el:0.06,d:1.75,yk:'hj',dy:0.0}, thigh_back:{az:PI,el:0.03,d:2.3,yk:'knee',dy:0.22},
  thigh_front:{az:0,el:0.03,d:2.3,yk:'knee',dy:0.22}, l4:{az:0.25,el:0.1,d:2.2,yk:'knee',dy:-0.12}, l5:{az:0.4,el:0.28,d:1.9,yk:'ankle',dy:0.2}, s1:{az:PI-0.3,el:0.08,d:1.9,yk:'ankle',dy:0.2},
  saddle:{az:0,el:-0.18,d:1.6,yk:'hj',dy:-0.06}
};
const AREAS = [
  {id:'lowback',pair:false,view:'lowback',name:L('Lower back, centre','कमर का बीच का हिस्सा'),desc:L('Over the spine itself, between the bottom ribs and the buttocks.','रीढ़ के ठीक ऊपर, नीचे की पसलियों और नितंबों के बीच।'),rel:L('Midline pain often comes from the discs or the small spine joints.','बीच का दर्द अक्सर डिस्क या रीढ़ के छोटे जोड़ों से होता है।')},
  {id:'lowback_side',pair:true,view:'lowback',name:L('Lower back, beside the spine','कमर में, रीढ़ के बगल में'),desc:L('A hand-width to the side of the spine, above the hip bone.','रीढ़ से एक हथेली दूर, कूल्हे की हड्डी के ऊपर।'),rel:L('Paraspinal pain usually comes from muscles, ligaments or facet joints.','रीढ़ के बगल का दर्द आमतौर पर मांसपेशियों, लिगामेंट या फ़ैसेट जोड़ों से होता है।')},
  {id:'flank',pair:true,view:'flank',name:L('Flank, below the ribs','फ्लैंक, पसलियों के नीचे'),desc:L('On the side of the back, just below the last rib and above the hip bone, over the kidney.','पीठ की साइड में, आखिरी पसली के ठीक नीचे और कूल्हे की हड्डी के ऊपर — गुर्दे के ऊपर।'),rel:L('Flank pain raises the possibility of a kidney stone or kidney infection.','फ्लैंक का दर्द गुर्दे की पथरी या इन्फेक्शन की संभावना बढ़ाता है।')},
  {id:'buttock',pair:true,view:'buttock',name:L('Buttock','नितंब'),desc:L('The fleshy area you sit on, below the belt line.','बेल्ट लाइन के नीचे, बैठने वाला मांसल हिस्सा।'),rel:L('Buttock pain can arise from the SI joint, the piriformis muscle, or be referred from the lumbar spine.','नितंब का दर्द SI जोड़, पिरिफॉर्मिस मांसपेशी, या कमर की रीढ़ से आ सकता है।')},
  {id:'tailbone',pair:false,view:'tailbone',name:L('Tailbone (coccyx)','टेलबोन (कॉक्सिक्स)'),desc:L('The tip at the bottom of the spine, between the buttocks.','रीढ़ का निचला सिरा, नितंबों के बीच।'),rel:L('Localised tailbone pain, worse on sitting, points to coccydynia.','बैठने पर बढ़ने वाला टेलबोन का दर्द कॉक्सीडाइनिया की ओर इशारा करता है।')},
  {id:'groin',pair:true,view:'groin',name:L('Groin, front of the hip','ग्रोइन, कूल्हे का अगला हिस्सा'),desc:L('The crease where the thigh meets the trunk, at the front.','आगे की ओर, जहाँ जांघ धड़ से मिलती है।'),rel:L('Groin pain is more often from the hip joint than from the spine.','ग्रोइन का दर्द रीढ़ से ज़्यादा कूल्हे के जोड़ से होता है।')},
  {id:'thigh_back',pair:true,view:'thigh_back',code:'S1–S2',name:L('Back of the thigh','जांघ का पिछला हिस्सा'),desc:L('From below the buttock to the back of the knee.','नितंब के नीचे से घुटने के पीछे तक।'),rel:L('Pain here follows the sciatic nerve (L5–S1 roots) or is referred from the back and buttock.','यहाँ का दर्द साइटिक नस (L5–S1 जड़ें) के रास्ते पर होता है या कमर और नितंब से फैलता है।')},
  {id:'thigh_front',pair:true,view:'thigh_front',code:'L2–L3',name:L('Front of the thigh','जांघ का अगला हिस्सा'),desc:L('From the groin down to the knee, at the front.','आगे की ओर, ग्रोइन से घुटने तक।'),rel:L('Supplied by the upper lumbar roots (L2–L3) through the femoral nerve; hip disease can also refer here.','फीमोरल नस के ज़रिए ऊपरी लम्बर जड़ों (L2–L3) से जुड़ा; कूल्हे की बीमारी से भी यहाँ दर्द हो सकता है।')},
  {id:'l4',pair:true,view:'l4',code:'L4',name:L('Knee and inner shin','घुटना और पिंडली का अंदरूनी हिस्सा'),desc:L('Front of the knee and the inner side of the lower leg to the ankle.','घुटने का अगला हिस्सा और टखने तक निचले पैर का अंदरूनी हिस्सा।'),rel:L('The L4 dermatome: the medial leg.','L4 डर्मेटोम: पैर का अंदरूनी हिस्सा।')},
  {id:'l5',pair:true,view:'l5',code:'L5',name:L('Outer shin, top of the foot, big toe','पिंडली का बाहरी हिस्सा, पंजे का ऊपरी हिस्सा, अंगूठा'),desc:L('Outer side of the lower leg, the top of the foot and the big toe.','निचले पैर का बाहरी हिस्सा, पंजे का ऊपरी हिस्सा और अंगूठा।'),rel:L('The L5 dermatome. L5 is the root most often pressed by an L4–L5 disc.','L5 डर्मेटोम। L4–L5 डिस्क से सबसे ज़्यादा L5 जड़ दबती है।')},
  {id:'s1',pair:true,view:'s1',code:'S1',name:L('Back of the calf, heel, sole, little toe','पिंडली का पिछला हिस्सा, एड़ी, तलवा, छोटी उंगली'),desc:L('Back of the lower leg down to the heel, the sole and the outer edge of the foot.','निचले पैर का पिछला हिस्सा, एड़ी, तलवा और पंजे का बाहरी किनारा।'),rel:L('The S1 dermatome, usually affected by an L5–S1 disc.','S1 डर्मेटोम, आमतौर पर L5–S1 डिस्क से प्रभावित।')}
];

/* ================= bedside tests ================= */
const TESTS = [
  {id:'slr',name:L('Straight leg raise (SLR)','स्ट्रेट लेग रेज़ (SLR)'),
   steps:[L('Lie flat on your back on a firm bed or floor, legs straight.','सख्त बिस्तर या फर्श पर पीठ के बल सीधे लेटें, पैर सीधे।'),L('A helper holds the heel of your painful leg and slowly lifts it, keeping the knee straight. You stay relaxed.','कोई आपके दर्द वाले पैर की एड़ी पकड़कर घुटना सीधा रखते हुए धीरे-धीरे ऊपर उठाए। आप ढीले रहें।'),L('Stop at the first sharp pain and note the angle.','पहला तेज़ दर्द होते ही रुकें और कोण देखें।')],
   pos:L('Shooting pain down the leg, past the knee, when the leg is between about 30° and 70°. A tight pull only behind the thigh does not count.','पैर 30° से 70° के बीच हो तब घुटने के नीचे तक जाता करंट जैसा दर्द। सिर्फ जांघ के पीछे खिंचाव पॉज़िटिव नहीं है।'),
   acc:L('Sensitivity 92%, specificity 28%: a negative test makes a disc herniation less likely.','संवेदनशीलता 92%, विशिष्टता 28%: नेगेटिव टेस्ट से डिस्क हर्निएशन की संभावना कम होती है।'),src:'cochrane',ans:[['slr_pos','tPos','y'],['slr_neg','tNeg','n'],['slr_skip','tSkip','s']]},
  {id:'cslr',name:L('Crossed straight leg raise','क्रॉस्ड स्ट्रेट लेग रेज़'),
   steps:[L('Same position as before.','पहले जैसी ही पोज़िशन।'),L('The helper now slowly lifts your pain-free leg.','अब वह धीरे-धीरे आपका बिना दर्द वाला पैर उठाए।')],
   pos:L('Lifting the good leg brings on pain in the painful leg.','अच्छा पैर उठाने पर दर्द वाले पैर में दर्द होता है।'),
   acc:L('Specificity 90%, sensitivity 28%: a positive test strongly suggests a disc herniation.','विशिष्टता 90%, संवेदनशीलता 28%: पॉज़िटिव टेस्ट डिस्क हर्निएशन का मज़बूत संकेत है।'),src:'cochrane',ans:[['cslr_pos','tPos','y'],['cslr_neg','tNeg','n'],['cslr_skip','tSkip','s']]},
  {id:'heel',name:L('Heel walk (L4–L5 strength)','एड़ी पर चलना (L4–L5 ताकत)'),
   steps:[L('Stand next to a wall for support.','सहारे के लिए दीवार के पास खड़े हों।'),L('Lift your toes and walk 10 steps on your heels.','पंजे ऊपर उठाकर एड़ियों पर 10 कदम चलें।')],
   pos:L('The front of one foot drops, or you cannot stay on that heel.','एक पैर का अगला हिस्सा गिर जाता है, या उस एड़ी पर टिक नहीं पाते।'),
   acc:L('Tests ankle and big-toe lifting (L4–L5). Weakness here is a reason to see a doctor soon.','टखना और अंगूठा उठाने की जांच (L4–L5)। कमज़ोरी हो तो जल्दी डॉक्टर को दिखाएं।'),src:'msd',ans:[['heel_weak','tWeak','y'],['heel_ok','tNorm','n'],['heel_skip','tSkip','s']]},
  {id:'toe',name:L('Single-leg heel raise (S1 strength)','एक पैर पर पंजों के बल उठना (S1 ताकत)'),
   steps:[L('Hold a wall and stand on one leg.','दीवार पकड़कर एक पैर पर खड़े हों।'),L('Rise onto your toes 10 times, then repeat on the other leg.','10 बार पंजों के बल ऊपर उठें, फिर दूसरे पैर से दोहराएं।')],
   pos:L('You cannot rise, or manage clearly fewer on one side.','आप उठ नहीं पाते, या एक तरफ साफ़ तौर पर कम बार कर पाते हैं।'),
   acc:L('Tests calf strength (S1). The best bedside test for S1 weakness.','पिंडली की ताकत की जांच (S1)। S1 कमज़ोरी का सबसे अच्छा टेस्ट।'),src:'medm',ans:[['toe_weak','tWeak','y'],['toe_ok','tNorm','n'],['toe_skip','tSkip','s']]}
];

/* ================= label lookup ================= */
const CONDS = [
  {id:'disc',th:[14,8,4],anchor:['leg_any','ch_shoot','slr_pos','cslr_pos'],depts:['ortho_spine','physio','neurosurg','neuro'],
   name:L('Lumbar disc herniation with nerve root irritation (sciatica)','लम्बर डिस्क हर्निएशन से नस की जड़ में जलन (साइटिका)'),sci:'Lumbar disc herniation · lumbosacral radiculopathy',
   what:L('A disc between two vertebrae bulges or herniates backwards and presses a nerve root. Pain runs into the buttock and leg along that root, often worse when sitting, bending or coughing.','दो हड्डियों के बीच की डिस्क पीछे की ओर उभरकर नस की जड़ को दबाती है। दर्द उस जड़ के रास्ते नितंब और पैर में जाता है, और अक्सर बैठने, झुकने या खांसने पर बढ़ता है।'),
   confirm:L('Neurological examination (straight leg raise, strength, reflexes, sensation). MRI of the lumbar spine if there is weakness, a red flag, or no improvement after about 6 weeks. Plain X-rays do not show discs.','न्यूरोलॉजिकल जांच (SLR, ताकत, रिफ्लेक्स, संवेदना)। कमज़ोरी, खतरे के लक्षण, या लगभग 6 हफ्तों में सुधार न हो तो कमर का MRI। सादा एक्स-रे डिस्क नहीं दिखाता।'),
   outlook:L('About 90% of people improve within 3 months without surgery. Larger herniations shrink on their own more often: extrusions in about 70% and sequestrations in about 96%. Surgery (microdiscectomy) is considered for weakness or severe pain that does not settle.','लगभग 90% लोग बिना सर्जरी 3 महीने में बेहतर हो जाते हैं। बड़े हर्निएशन ज़्यादा बार अपने आप सिकुड़ते हैं: एक्सट्रूज़न लगभग 70% और सीक्वेस्ट्रेशन लगभग 96% में। कमज़ोरी या न सुधरने वाले तेज़ दर्द में सर्जरी (माइक्रोडिसेक्टॉमी) सोची जाती है।'),oSrc:['ortho','chiu'],
   w:{h_lt1y:1,btw_free:1,below_knee:4,leg_any:2,leg_one:1,dom_leg:3,ch_shoot:3,ch_numb:1,ch_tingle:1,w_sit:2,w_bend:2,w_cough:3,slr_pos:1,cslr_pos:2,heel_weak:2,toe_weak:2,on_getup:2,on_bend:2,on_lift:2,on_twist:1,on_cough:2,on_woke:1,a_18_29:1,a_30_39:1,a_40_49:1,b_lying:1,walk_no:1,sit_no:1,sit_30:1,r_desk:1,r_heavy:1,
      w_walk:-2,b_sitflex:-1,ch_stiff_am:-1,b_exercise:-2,rf_fever:-3,slr_neg:-2,groin:-1,flank:-2,ch_colic:-2}},
  {id:'strain',th:[9,6,3],anchor:['lowback','lowback_side'],oSrc:'costa',depts:['physio','gp','ortho_spine'],
   name:L('Muscle strain or ligament sprain','मांसपेशी में खिंचाव या लिगामेंट मोच'),sci:'Acute non-specific (mechanical) low back pain',
   what:L('Overloaded back muscles and ligaments go into protective spasm. The most common cause of sudden low back pain; it stays in the back without nerve signs.','ज़्यादा भार से पीठ की मांसपेशियाँ और लिगामेंट बचाव में जकड़ जाते हैं। अचानक कमर दर्द का सबसे आम कारण; दर्द नसों के लक्षणों के बिना कमर में रहता है।'),
   confirm:L('Clinical examination. Guidelines advise against routine imaging.','क्लिनिकल जांच। गाइडलाइंस नियमित इमेजिंग की सलाह नहीं देतीं।'),cSrc:['nice'],
   outlook:L('Usually settles with staying active and exercise. In a meta-analysis of new back pain, average pain fell from 52 to 23 (out of 100) within 6 weeks and to 6 at one year.','सक्रिय रहने और व्यायाम से आमतौर पर ठीक हो जाता है। नए कमर दर्द के एक मेटा-एनालिसिस में औसत दर्द 100 में से 52 से 6 हफ्तों में 23 और एक साल में 6 रह गया।'),
   w:{h_first:2,btw_free:1,h_5y:-1,btw_some:-1,lowback:1,lowback_side:2,ch_spasm:3,ch_ache:2,on_lift:2,on_twist:2,on_bend:1,on_getup:1,d_days:2,d_weeks:1,w_bend:1,w_rise:1,b_lying:1,r_heavy:1,
      below_knee:-4,ch_shoot:-2,slr_pos:-3,cslr_pos:-3,dom_leg:-3,leg_any:-1,d_3m:-2,rf_fever:-3}},
  {id:'facet',th:[10,6,3],anchor:['lowback','lowback_side'],depts:['ortho_spine','physio','pain'],
   name:L('Facet joint pain / lumbar spondylosis','फ़ैसेट जोड़ का दर्द / लम्बर स्पॉन्डिलोसिस'),sci:'Lumbar facet arthropathy · spondylosis',
   what:L('Wear of the small joints at the back of the spine. Aching, off-centre pain, worse on arching back or standing; it may spread to the buttock or thigh but rarely below the knee.','रीढ़ के पीछे के छोटे जोड़ों की घिसावट। बीच से हटकर भारी दर्द, जो पीछे झुकने या खड़े रहने पर बढ़ता है; नितंब या जांघ तक जा सकता है पर घुटने के नीचे कम।'),
   confirm:L('Examination; X-ray or MRI if it persists; a diagnostic medial branch block can confirm the joint as the source.','जांच; लंबे समय तक रहे तो एक्स-रे या MRI; डायग्नोस्टिक मीडियल ब्रांच ब्लॉक से जोड़ के दर्द की पुष्टि होती है।'),cSrc:['nice'],
   outlook:L('Managed with exercise, posture and weight control; injections or radiofrequency treatment for persistent cases.','व्यायाम, पोस्चर और वज़न नियंत्रण से संभलता है; लंबे मामलों में इंजेक्शन या रेडियोफ्रीक्वेंसी इलाज।'),
   w:{h_1_5y:1,h_5y:1,btw_free:1,lowback:1,lowback_side:2,w_extend:3,w_stand:1,ch_ache:2,a_40_49:1,a_50_59:2,a_60p:2,d_3m:2,d_6_12:1,on_gradual:2,ep_recur:1,b_walk:1,
      below_knee:-3,slr_pos:-2,dom_leg:-2,ch_shoot:-1}},
  {id:'si',th:[9,6,3],anchor:['buttock'],depts:['ortho','physio'],
   name:L('Sacroiliac (SI) joint dysfunction','सैक्रोइलियक (SI) जोड़ की समस्या'),sci:'Sacroiliac joint pain',
   what:L('The joint between the base of the spine and the pelvis. Pain sits low over one buttock, below the belt line, and is worse getting up, on stairs or standing on one leg.','रीढ़ के आधार और पेल्विस के बीच का जोड़। दर्द नीचे एक नितंब पर, बेल्ट लाइन के नीचे होता है, और उठने, सीढ़ी चढ़ने या एक पैर पर खड़े होने पर बढ़ता है।'),
   confirm:L('Provocation tests during examination; a diagnostic injection if unclear.','जांच के दौरान प्रोवोकेशन टेस्ट; साफ़ न हो तो डायग्नोस्टिक इंजेक्शन।'),
   outlook:L('Usually responds to targeted physiotherapy; common in pregnancy and after delivery.','आमतौर पर लक्षित फिज़ियोथेरेपी से ठीक; गर्भावस्था और डिलीवरी के बाद आम।'),
   w:{btw_free:1,buttock:3,w_rise:2,on_preg:3,on_fall:1,sex_f:1,lowback_side:1,thigh_back:1,below_knee:-2,slr_pos:-2,cslr_pos:-2,lowback:-1,dom_leg:-1}},
  {id:'piri',th:[9,6,4],anchor:['buttock'],depts:['physio','ortho'],
   name:L('Piriformis syndrome','पिरिफॉर्मिस सिंड्रोम'),sci:'Deep gluteal syndrome',
   what:L('A deep buttock muscle irritates the sciatic nerve: deep buttock pain, worse with long sitting, sometimes into the back of the thigh, usually with little back pain.','नितंब की गहरी मांसपेशी साइटिक नस को परेशान करती है: नितंब में गहरा दर्द, देर तक बैठने पर ज़्यादा, कभी जांघ के पीछे तक, आमतौर पर कमर दर्द कम।'),
   confirm:L('Examination; MRI to exclude a spinal cause.','जांच; रीढ़ के कारण को खारिज करने के लिए MRI।'),
   outlook:L('Stretching and physiotherapy; injections occasionally.','स्ट्रेचिंग और फिज़ियोथेरेपी; कभी-कभी इंजेक्शन।'),
   w:{buttock:2,thigh_back:2,w_sit:2,on_sitting:2,ch_shoot:1,lowback:-2,w_cough:-2,lowback_side:-1}},
  {id:'stenosis',th:[11,7,4],anchor:['w_walk','b_sitflex','b_sit_nopain','ch_heavy'],oSrc:'suri',depts:['ortho_spine','neurosurg','physio'],
   name:L('Lumbar spinal stenosis','लम्बर स्पाइनल स्टेनोसिस'),sci:'Neurogenic claudication',
   what:L('The canal for the nerves narrows with age. Legs ache, tingle or feel heavy on standing or walking and ease on sitting or bending forward; pushing a trolley helps.','उम्र के साथ नसों की नली संकरी होती है। खड़े रहने या चलने पर पैरों में दर्द, झुनझुनी या भारीपन, और बैठने या आगे झुकने पर आराम; ट्रॉली पकड़कर चलना आसान लगता है।'),
   confirm:L('MRI of the lumbar spine. Doctors also check leg pulses, because blocked leg arteries cause calf pain that eases simply by standing still.','कमर का MRI। डॉक्टर पैरों की नब्ज़ भी देखते हैं, क्योंकि धमनियों में रुकावट से भी पिंडली में दर्द होता है जो बस रुकने से ठीक होता है।'),cSrc:['msdss'],
   outlook:L('Physiotherapy and activity changes first; decompression surgery if walking distance keeps shrinking.','पहले फिज़ियोथेरेपी और गतिविधि में बदलाव; चलने की दूरी घटती रहे तो डीकंप्रेशन सर्जरी।'),
   w:{h_5y:2,h_1_5y:1,btw_some:1,h_first:-1,w_walk:2,b_sitflex:3,b_sit_nopain:3,both_legs:3,a_60p:2,a_50_59:1,ch_numb:1,ch_heavy:1,d_3m:1,on_gradual:1,w_extend:1,w_stand:1,w_walk_calf:-3,slr_pos:-1,a_u18:-3,a_18_29:-3,a_30_39:-2,w_sit:-2}},
  {id:'spondy',th:[8,5,3],anchor:['w_extend'],depts:['ortho_spine','physio'],
   name:L('Spondylolysis / spondylolisthesis','स्पॉन्डिलोलिसिस / स्पॉन्डिलोलिस्थेसिस'),sci:'Pars interarticularis defect or vertebral slip',
   what:L('A stress crack in the back of a lower vertebra, or one vertebra slipping forward. Common in teenage athletes; pain is worse on arching back.','निचली हड्डी के पिछले हिस्से में स्ट्रेस क्रैक, या एक हड्डी का आगे खिसकना। खेलने वाले किशोरों में आम; पीछे झुकने पर दर्द बढ़ता है।'),
   confirm:L('Standing X-rays including flexion and extension views; CT or MRI for a stress fracture.','खड़े होकर एक्स-रे, आगे-पीछे झुककर भी; स्ट्रेस फ्रैक्चर के लिए CT या MRI।'),
   outlook:L('Most improve with rest from sport and core strengthening; surgery for high-grade slips.','ज़्यादातर खेल से आराम और कोर मज़बूती से बेहतर; ज़्यादा खिसकाव में सर्जरी।'),
   w:{h_lt1y:1,w_extend:3,a_u18:3,a_18_29:1,on_twist:2,on_gradual:1,d_3m:1,lowback:1,thigh_back:1}},
  {id:'axspa',th:[9,6,4],anchor:['ibp2','r_spa','r_famspa'],depts:['rheum','physio'],
   name:L('Inflammatory back pain (axial spondyloarthritis)','सूजन वाला कमर दर्द (एक्सियल स्पॉन्डिलोआर्थराइटिस)'),sci:'Axial spondyloarthritis · ankylosing spondylitis',
   what:L('An immune condition that inflames the spine and SI joints. Typical features (ASAS): onset before 40, gradual start, better with exercise, not better with rest, and night pain that eases on getting up.','एक इम्यून बीमारी जो रीढ़ और SI जोड़ों में सूजन करती है। खास लक्षण (ASAS): 40 से पहले शुरुआत, धीरे-धीरे शुरू, व्यायाम से बेहतर, आराम से नहीं, और रात का दर्द जो उठने पर कम हो।'),cSrc:['asas'],
   confirm:L('Blood tests (CRP, ESR, HLA-B27) and MRI of the sacroiliac joints.','ब्लड टेस्ट (CRP, ESR, HLA-B27) और SI जोड़ों का MRI।'),
   outlook:L('Very treatable with anti-inflammatory and biologic medicines plus daily exercise; early diagnosis prevents stiffening.','सूजन-रोधी और बायोलॉजिक दवाओं और रोज़ के व्यायाम से अच्छा इलाज; जल्दी पहचान से जकड़न रोकी जा सकती है।'),
   w:{h_1_5y:1,h_5y:1,btw_some:1,h_first:-1,a_u18:1,a_18_29:1,a_30_39:1,on_gradual:1,ibp2:2,ibp3:2,ch_stiff_am:1,ibp_ex:1,d_3m:2,r_spa:3,r_famspa:2,ch_heel:2,buttock:1,ch_alt_buttock:1,on_lift:-1,on_getup:-1,on_bend:-1,d_days:-2,slr_pos:-1,a_60p:-2}},
  {id:'coccyx',th:[8,6,4],anchor:['tailbone'],depts:['ortho','pain','physio'],
   name:L('Coccydynia (tailbone pain)','कॉक्सीडाइनिया (टेलबोन दर्द)'),sci:'Coccydynia',
   what:L('Bruising or inflammation of the tailbone or its ligaments, often after a fall, childbirth or long sitting. Worst when sitting and leaning back.','टेलबोन या उसके लिगामेंट में चोट या सूजन, अक्सर गिरने, डिलीवरी या लंबे समय बैठने के बाद। बैठने और पीछे टिकने पर सबसे ज़्यादा।'),cSrc:['coc'],
   confirm:L('Examination; sitting and standing X-rays to check tailbone movement.','जांच; टेलबोन की हलचल देखने के लिए बैठकर और खड़े होकर एक्स-रे।'),
   outlook:L('A cushion, physiotherapy and medicines help most; injections if it persists.','कुशन, फिज़ियोथेरेपी और दवाओं से ज़्यादातर आराम; लंबा चले तो इंजेक्शन।'),
   w:{tailbone:6,w_sit:2,on_fall:2,on_preg:2,sex_f:1}},
  {id:'hip',th:[8,5,3],anchor:['groin'],depts:['ortho','physio'],
   name:L('Hip joint disorder','कूल्हे के जोड़ की समस्या'),sci:'Hip osteoarthritis · intra-articular hip pathology',
   what:L('Pain from the hip joint is felt in the groin and front of the thigh, and is worse walking and putting on shoes. It is often mistaken for back pain.','कूल्हे के जोड़ का दर्द ग्रोइन और जांघ के आगे महसूस होता है, और चलने व जूते पहनने पर बढ़ता है। इसे अक्सर कमर दर्द समझ लिया जाता है।'),
   confirm:L('Hip examination and an X-ray of the pelvis and hip.','कूल्हे की जांच और पेल्विस व कूल्हे का एक्स-रे।'),
   outlook:L('Exercise and weight control; joint replacement for advanced arthritis.','व्यायाम और वज़न नियंत्रण; ज़्यादा घिसावट में जोड़ बदलना।'),
   w:{h_1_5y:1,btw_some:1,groin:5,thigh_front:1,a_60p:2,a_50_59:1,w_stand:1,on_gradual:1,below_knee:-1,slr_pos:-1}},
  {id:'upper',th:[10,6,4],anchor:['thigh_front','l4'],depts:['ortho_spine','neuro','physio'],
   name:L('Upper lumbar nerve root irritation (L2–L4)','ऊपरी लम्बर नस की जड़ में जलन (L2–L4)'),sci:'Upper lumbar radiculopathy · femoral nerve irritation',
   what:L('A disc or narrowing higher in the lower back presses the L2–L4 roots, which supply the front of the thigh and inner shin. The straight leg raise is often negative.','कमर में थोड़ा ऊपर डिस्क या संकरापन L2–L4 जड़ों को दबाता है, जो जांघ के आगे और पिंडली के अंदर तक जाती हैं। SLR अक्सर नेगेटिव रहता है।'),cSrc:['medm'],
   confirm:L('Femoral nerve stretch test and MRI.','फीमोरल नर्व स्ट्रेच टेस्ट और MRI।'),
   outlook:L('Similar to sciatica: most improve without surgery.','साइटिका जैसा: ज़्यादातर बिना सर्जरी ठीक।'),
   w:{h_lt1y:1,thigh_front:4,l4:3,ch_shoot:2,ch_numb:1,a_50_59:1,a_60p:1,dom_leg:1,slr_neg:1,s1:-1,l5:-1,groin:-1}},
  {id:'kidney',th:[10,6,4],anchor:['flank','ch_colic','u_urine'],depts:['urology','gp'],
   name:L('Kidney stone or kidney infection','गुर्दे की पथरी या गुर्दे का इन्फेक्शन'),sci:'Renal colic · pyelonephritis',
   what:L('Pain at the side below the ribs that comes in waves and may spread to the groin, with burning urine, blood in urine or fever. Not a spine problem.','पसलियों के नीचे साइड में लहरों जैसा दर्द, जो ग्रोइन तक जा सकता है, साथ में पेशाब में जलन, खून या बुखार। यह रीढ़ की समस्या नहीं है।'),cSrc:['kid'],
   confirm:L('Urine test, blood tests and an ultrasound or CT (KUB).','पेशाब की जांच, ब्लड टेस्ट और अल्ट्रासाउंड या CT (KUB)।'),
   outlook:L('Most small stones pass with fluids and pain relief; infection needs prompt antibiotics.','ज़्यादातर छोटी पथरी पानी और दर्द की दवा से निकल जाती है; इन्फेक्शन में जल्दी एंटीबायोटिक ज़रूरी।'),
   w:{btw_free:1,flank:5,ch_colic:3,u_urine:4,rf_fever:2,groin:1,ch_spasm:-1,w_bend:-1,w_sit:-1}},
  {id:'infection',oSrc:'tbindia',th:[9,6,4],anchor:['rf_fever'],depts:['ortho_spine','id_tb','gp'],
   name:L('Spinal infection, including spinal TB','रीढ़ का इन्फेक्शन, स्पाइनल टीबी सहित'),sci:"Spondylodiscitis · Pott's disease",
   what:L('Bacteria or TB infect a disc and the bones beside it. Clues are constant pain with fever, night sweats, poor appetite or weight loss. Spinal TB remains common in India, which has about a quarter of all TB cases worldwide, and is curable when treated early.','बैक्टीरिया या टीबी डिस्क और पास की हड्डियों को संक्रमित करते हैं। संकेत: बुखार, रात को पसीना, भूख कम या वज़न घटने के साथ लगातार दर्द। स्पाइनल टीबी भारत में अब भी आम है (दुनिया के लगभग एक-चौथाई टीबी मरीज़ भारत में हैं) और जल्दी इलाज से ठीक होती है।'),cSrc:['pott','wikem'],
   confirm:L('Blood count, ESR and CRP, MRI, and a biopsy to identify the germ.','ब्लड काउंट, ESR और CRP, MRI, और कीटाणु पहचानने के लिए बायोप्सी।'),
   outlook:L('Long antibiotic or anti-TB treatment; surgery if bones collapse or nerves are pressed.','लंबा एंटीबायोटिक या टीबी का इलाज; हड्डी दबे या नस पर दबाव हो तो सर्जरी।'),
   w:{h_first:2,btw_often:1,h_5y:-2,rf_fever:5,r_tb:3,r_immune:2,rf_night:2,d_3m:1,d_6_12:1,t_worse:1}},
  {id:'fracture',th:[9,6,4],anchor:['on_fall','on_accident','on_blow','r_bones','rf_trauma'],depts:['ortho_spine','endo'],
   name:L('Vertebral fracture','रीढ़ की हड्डी में फ्रैक्चर'),sci:'Traumatic or osteoporotic compression fracture',
   what:L('A vertebra can break after trauma, or after a minor fall, lift or even a cough when bones are weak. Pain is sudden, worse standing and better lying down.','चोट के बाद, या हड्डियाँ कमज़ोर हों तो छोटी गिरावट, वज़न उठाने या खांसी से भी रीढ़ की हड्डी टूट सकती है। दर्द अचानक, खड़े होने पर ज़्यादा और लेटने पर कम।'),cSrc:['fx','wikem'],
   confirm:L('X-ray or CT; MRI to show whether the fracture is new; a DEXA scan for bone density.','एक्स-रे या CT; फ्रैक्चर नया है या पुराना, इसके लिए MRI; हड्डियों के घनत्व के लिए DEXA स्कैन।'),
   outlook:L('Most stable fractures heal with pain control and time; treating weak bones prevents the next one.','ज़्यादातर स्थिर फ्रैक्चर दर्द नियंत्रण और समय से जुड़ जाते हैं; कमज़ोर हड्डियों का इलाज अगला फ्रैक्चर रोकता है।'),
   w:{h_first:1,rf_trauma:4,on_fall:3,on_accident:3,on_blow:2,r_bones:4,fx_combo:4,a_60p:2,b_lying:1,w_stand:1}},
  {id:'tumour',th:[10,8,7],rare:true,anchor:['r_cancer'],depts:['ortho_spine','onco'],
   name:L('Tumour involving the spine (rare)','रीढ़ से जुड़ी गांठ (दुर्लभ)'),sci:'Spinal metastasis or primary tumour',
   what:L('Rare. Doctors look for it when there is past cancer, weight loss, or constant pain at night, especially after 50. Most such pain turns out to have another cause.','दुर्लभ। पहले कैंसर, वज़न घटने, या रात के लगातार दर्द में, खासकर 50 के बाद, डॉक्टर इसकी जांच करते हैं। ज़्यादातर ऐसा दर्द किसी और कारण से निकलता है।'),cSrc:['wikem'],
   confirm:L('Blood tests and MRI of the spine.','ब्लड टेस्ट और रीढ़ का MRI।'),
   outlook:L('Depends on the cause; early assessment matters.','कारण पर निर्भर; जल्दी जांच ज़रूरी।'),
   w:{h_first:2,btw_often:1,h_5y:-2,r_cancer:5,rf_night:1,rf_fever:1,a_60p:1,d_6_12:1,d_3m:1,t_worse:1}},
  {id:'pgp',th:[8,6,4],anchor:['on_preg'],depts:['gyn','physio'],
   name:L('Pregnancy-related pelvic girdle pain','गर्भावस्था से जुड़ा पेल्विक दर्द'),sci:'Pelvic girdle pain',
   what:L('Hormones loosen the pelvic joints during pregnancy and after delivery, causing pain over the buttocks, tailbone or pubic bone.','गर्भावस्था और डिलीवरी के बाद हार्मोन पेल्विस के जोड़ों को ढीला करते हैं, जिससे नितंब, टेलबोन या प्यूबिक हड्डी पर दर्द होता है।'),
   confirm:L('Clinical examination; imaging is usually avoided in pregnancy.','क्लिनिकल जांच; गर्भावस्था में इमेजिंग आमतौर पर नहीं होती।'),
   outlook:L('Physiotherapy and a pelvic support belt help; most settle after delivery.','फिज़ियोथेरेपी और पेल्विक सपोर्ट बेल्ट से मदद; ज़्यादातर डिलीवरी के बाद ठीक।'),
   w:{on_preg:5,sex_f:1,buttock:2,w_rise:1,tailbone:1}}
];
const EMERG = {
  cauda:{name:L('Cauda equina syndrome','कॉडा इक्विना सिंड्रोम'),sci:'Compression of the nerve roots at the base of the spine',
    what:L('A large disc or other mass squeezes the bundle of nerves at the base of the spine. It needs an emergency MRI and often surgery within hours to protect bladder, bowel, sexual and leg function.','बड़ी डिस्क या कोई गांठ रीढ़ के आधार की नसों के गुच्छे को दबाती है। मूत्राशय, आंत, यौन क्रिया और पैरों को बचाने के लिए तुरंत MRI और अक्सर कुछ घंटों में सर्जरी ज़रूरी है।'),src:['ces','ortho'],depts:['emergency','neurosurg','ortho_spine']},
  trauma:{name:L('Possible spinal injury','रीढ़ की चोट की आशंका'),sci:'Major trauma',
    what:L('After a road accident or a fall from height, the spine needs imaging in an emergency department. Keep still and keep the head, neck and back in line until help arrives.','सड़क दुर्घटना या ऊंचाई से गिरने के बाद रीढ़ की इमेजिंग इमरजेंसी में ज़रूरी है। मदद आने तक स्थिर रहें और सिर, गर्दन और पीठ एक सीध में रखें।'),src:['wikem'],depts:['emergency','ortho_spine']},
  cord:{name:L('Progressive nerve damage','बढ़ता हुआ नस का नुकसान'),sci:'Progressive neurological deficit',
    what:L('Weakness that is getting worse means a nerve is under heavy pressure. Guidelines treat this as an emergency referral.','बढ़ती कमज़ोरी का मतलब है कि नस पर बहुत दबाव है। गाइडलाइंस इसे इमरजेंसी रेफरल मानती हैं।'),src:['wikem'],depts:['emergency','neurosurg','neuro']}
};
const ROOTS = {
  L2:{skin:L('Upper front and inner thigh','जांघ का ऊपरी अगला और अंदरूनी हिस्सा'),mus:L('Hip flexion','कूल्हा मोड़ना'),ref:L('None reliable','कोई भरोसेमंद नहीं'),disc:'L1–L2',test:L('—','—')},
  L3:{skin:L('Front and outer thigh to the knee','जांघ का अगला-बाहरी हिस्सा, घुटने तक'),mus:L('Knee extension (quadriceps)','घुटना सीधा करना (क्वाड्रिसेप्स)'),ref:L('Knee jerk reduced','घुटने का रिफ्लेक्स कम'),disc:'L2–L3',test:L('Sit-to-stand','बैठे से खड़ा होना')},
  L4:{skin:L('Inner side of the lower leg','निचले पैर का अंदरूनी हिस्सा'),mus:L('Ankle dorsiflexion','पंजा ऊपर उठाना'),ref:L('Knee jerk reduced','घुटने का रिफ्लेक्स कम'),disc:'L3–L4',test:L('Heel walk','एड़ी पर चलना')},
  L5:{skin:L('Shin and top of the foot; pain in the buttock, back-outer thigh and outer leg','पिंडली और पंजे का ऊपरी हिस्सा; दर्द नितंब, जांघ के पीछे-बाहर और पैर के बाहर'),mus:L('Big-toe extension, ankle dorsiflexion (foot drop)','अंगूठा उठाना, पंजा उठाना (फुट ड्रॉप)'),ref:L('None reliable','कोई भरोसेमंद नहीं'),disc:'L4–L5',test:L('Heel walk','एड़ी पर चलना')},
  S1:{skin:L('Outer calf, ankle and foot; pain in the buttock and back of thigh and leg','पिंडली का बाहरी हिस्सा, टखना और पंजा; दर्द नितंब, जांघ और पैर के पीछे'),mus:L('Ankle plantar flexion','पंजों के बल उठना'),ref:L('Ankle jerk reduced or absent','टखने का रिफ्लेक्स कम या गायब'),disc:'L5–S1',test:L('Single-leg heel raise','एक पैर पर पंजों के बल उठना')}
};
const EXTRA = {
  disc:{causes:L('Discs slowly lose water and height from the late 20s. Long sitting, repeated bending, lifting with a rounded back, smoking and a desk job load the back of the disc until a crack in the outer ring lets the gel push out. The final trigger is often small: getting up, bending to wear shoes, a sneeze.','20 की उम्र के बाद डिस्क में धीरे-धीरे पानी और ऊंचाई घटती है। लंबे समय बैठना, बार-बार झुकना, कमर गोल करके वज़न उठाना, धूम्रपान और डेस्क जॉब डिस्क के पिछले हिस्से पर दबाव डालते हैं, जब तक बाहरी छल्ले में दरार से जेल बाहर न निकल आए। आखिरी झटका अक्सर छोटा होता है: उठना, जूते पहनने को झुकना, छींक।'),
    treat:L('First 6 weeks: stay active, a short course of pain medicine chosen by your doctor, and physiotherapy (nerve gliding, core and hip strengthening). If leg pain persists: an image-guided epidural steroid injection. Surgery (microdiscectomy) for worsening weakness, cauda equina, or severe pain beyond 6–12 weeks.','पहले 6 हफ्ते: सक्रिय रहें, डॉक्टर द्वारा तय की गई दर्द की दवा का छोटा कोर्स, और फिज़ियोथेरेपी (नर्व ग्लाइडिंग, कोर और कूल्हे की मज़बूती)। पैर का दर्द बना रहे तो इमेज-गाइडेड एपिड्यूरल स्टेरॉयड इंजेक्शन। बढ़ती कमज़ोरी, कॉडा इक्विना, या 6–12 हफ्ते बाद भी तेज़ दर्द में सर्जरी (माइक्रोडिसेक्टॉमी)।')},
  strain:{causes:L('A sudden or awkward load (lifting, twisting, a jerk) overstretches muscle fibres and ligaments. The muscles then go into protective spasm, which is what makes the back feel locked.','अचानक या गलत तरीके से भार (वज़न उठाना, मुड़ना, झटका) मांसपेशियों और लिगामेंट को ज़्यादा खींच देता है। फिर मांसपेशियाँ बचाव में जकड़ जाती हैं, इसी से कमर जाम लगती है।'),
    treat:L('Keep moving within comfort, use heat, take pain relief prescribed by your doctor, and follow a physiotherapy programme. Bed rest slows recovery.','आराम से जितना हो सके चलते-फिरते रहें, सिकाई करें, डॉक्टर की दी दर्द की दवा लें और फिज़ियोथेरेपी करें। बिस्तर पर आराम से ठीक होने में देर होती है।')},
  facet:{causes:L('As discs lose height, more load shifts to the small facet joints at the back of the spine. Their cartilage wears and the joints become inflamed, much like arthritis in a knee.','डिस्क की ऊंचाई घटने पर रीढ़ के पीछे के छोटे फ़ैसेट जोड़ों पर ज़्यादा भार आता है। उनका कार्टिलेज घिसता है और जोड़ों में सूजन आती है, जैसे घुटने की गठिया में।'),
    treat:L('Physiotherapy for core strength and posture, weight control and pain relief. For persistent pain: medial branch blocks and radiofrequency ablation.','कोर की मज़बूती और पोस्चर के लिए फिज़ियोथेरेपी, वज़न नियंत्रण और दर्द की दवा। लंबे दर्द में मीडियल ब्रांच ब्लॉक और रेडियोफ्रीक्वेंसी एब्लेशन।')},
  si:{causes:L('The SI joint moves very little. A fall on the buttock, uneven loading of the legs, pregnancy hormones or inflammatory arthritis can strain or inflame it.','SI जोड़ बहुत कम हिलता है। नितंब के बल गिरना, पैरों पर असमान भार, गर्भावस्था के हार्मोन या सूजन वाली गठिया इसमें खिंचाव या सूजन ला सकते हैं।'),
    treat:L('Targeted physiotherapy, a pelvic belt in some cases, and an image-guided SI-joint injection if needed.','लक्षित फिज़ियोथेरेपी, कुछ मामलों में पेल्विक बेल्ट, और ज़रूरत हो तो इमेज-गाइडेड SI जोड़ इंजेक्शन।')},
  piri:{causes:L('Long sitting (a wallet in the back pocket, long drives), running overuse or a fall can tighten or swell the piriformis muscle, which lies directly over the sciatic nerve.','लंबे समय बैठना (पिछली जेब में बटुआ, लंबी ड्राइव), दौड़ने में ज़्यादा उपयोग या गिरना पिरिफॉर्मिस मांसपेशी को जकड़ या सुजा सकता है, जो साइटिक नस के ठीक ऊपर होती है।'),
    treat:L('Stretching and strengthening, avoiding long sitting, and occasionally a guided injection.','स्ट्रेचिंग और मज़बूती के व्यायाम, लंबे समय बैठने से बचना, और कभी-कभी गाइडेड इंजेक्शन।')},
  stenosis:{causes:L('Over years, discs bulge, facet joints enlarge and ligaments thicken, narrowing the canal. Standing and walking arch the spine and narrow it further; bending forward opens it.','सालों में डिस्क उभरती है, फ़ैसेट जोड़ बड़े होते हैं और लिगामेंट मोटे होते हैं, जिससे नली संकरी होती है। खड़े होने और चलने से रीढ़ पीछे झुकती है और नली और संकरी होती है; आगे झुकने से खुलती है।'),
    treat:L('Physiotherapy with flexion exercises and cycling, pain relief and epidural injections; decompression surgery if walking distance keeps falling.','आगे झुकने वाले व्यायाम और साइकलिंग के साथ फिज़ियोथेरेपी, दर्द की दवा और एपिड्यूरल इंजेक्शन; चलने की दूरी घटती रहे तो डीकंप्रेशन सर्जरी।')},
  spondy:{causes:L('Repeated arching in sports such as fast bowling, gymnastics or weightlifting can cause a stress crack (pars defect). In adults, joint wear can let a vertebra slip forward.','फास्ट बॉलिंग, जिम्नास्टिक या वेटलिफ्टिंग जैसे खेलों में बार-बार पीछे झुकने से स्ट्रेस क्रैक (पार्स डिफेक्ट) हो सकता है। बड़ों में जोड़ों की घिसावट से हड्डी आगे खिसक सकती है।'),
    treat:L('Rest from the aggravating sport, core stabilisation, sometimes a brace; fusion surgery only for high-grade or unstable slips.','दर्द बढ़ाने वाले खेल से आराम, कोर स्टेबिलाइज़ेशन, कभी-कभी ब्रेस; ज़्यादा या अस्थिर खिसकाव में ही फ्यूज़न सर्जरी।')},
  axspa:{causes:L('An immune condition, strongly linked to the HLA-B27 gene, that inflames the points where ligaments attach to bone in the spine and SI joints. It often runs in families.','एक इम्यून बीमारी, जो HLA-B27 जीन से जुड़ी है और रीढ़ व SI जोड़ों में उन जगहों पर सूजन लाती है जहाँ लिगामेंट हड्डी से जुड़ते हैं। यह अक्सर परिवार में चलती है।'),
    treat:L('Daily exercise and anti-inflammatory medicines; biologic medicines under a rheumatologist if not controlled.','रोज़ व्यायाम और सूजन-रोधी दवाएं; नियंत्रण न हो तो रूमेटोलॉजिस्ट की देखरेख में बायोलॉजिक दवाएं।')},
  coccyx:{causes:L('A fall onto the buttocks, childbirth, or long sitting on hard surfaces bruises or strains the tailbone joint.','नितंब के बल गिरना, डिलीवरी, या सख्त सतह पर लंबे समय बैठना टेलबोन के जोड़ में चोट या खिंचाव लाता है।'),
    treat:L('A wedge or ring cushion, pain relief and pelvic-floor physiotherapy; an injection for persistent pain.','वेज या रिंग कुशन, दर्द की दवा और पेल्विक-फ्लोर फिज़ियोथेरेपी; लंबे दर्द में इंजेक्शन।')},
  hip:{causes:L('Cartilage wear in the hip (osteoarthritis), hip impingement or, rarely, loss of blood supply to the head of the thigh bone (avascular necrosis).','कूल्हे के कार्टिलेज की घिसावट (ऑस्टियोआर्थराइटिस), हिप इम्पिंजमेंट, या कभी-कभी जांघ की हड्डी के सिरे में खून की कमी (एवैस्कुलर नेक्रोसिस)।'),
    treat:L('Exercise, weight control and a walking aid if needed; joint replacement for advanced arthritis.','व्यायाम, वज़न नियंत्रण और ज़रूरत हो तो चलने का सहारा; ज़्यादा घिसावट में जोड़ बदलना।')},
  upper:{causes:L('The same process as sciatica, but higher (L2–L4): a disc or narrowing presses the roots that form the femoral nerve.','साइटिका जैसी ही प्रक्रिया, पर ऊपर (L2–L4): डिस्क या संकरापन उन जड़ों को दबाता है जिनसे फीमोरल नस बनती है।'),
    treat:L('As for sciatica: activity, medicines, physiotherapy and injections; surgery is rarely needed.','साइटिका जैसा: सक्रियता, दवाएं, फिज़ियोथेरेपी और इंजेक्शन; सर्जरी कम ही ज़रूरी।')},
  kidney:{causes:L('Crystals in concentrated urine form stones; low water intake and hot weather raise the risk. Infection can climb up from the bladder.','गाढ़े पेशाब में क्रिस्टल से पथरी बनती है; कम पानी पीना और गर्म मौसम खतरा बढ़ाते हैं। इन्फेक्शन मूत्राशय से ऊपर चढ़ सकता है।'),
    treat:L('Pain relief, fluids and medicines to help the stone pass; procedures for larger stones; antibiotics for infection.','दर्द की दवा, पानी और पथरी निकालने की दवाएं; बड़ी पथरी के लिए प्रोसीजर; इन्फेक्शन में एंटीबायोटिक।')},
  infection:{causes:L('Bacteria or TB reach the spine through the blood, often from a lung, urine or skin infection. Diabetes and low immunity raise the risk.','बैक्टीरिया या टीबी खून के ज़रिए रीढ़ तक पहुंचते हैं, अक्सर फेफड़े, पेशाब या त्वचा के इन्फेक्शन से। डायबिटीज़ और कम इम्युनिटी खतरा बढ़ाते हैं।'),
    treat:L('Months of antibiotics or anti-TB treatment; surgery if bone collapses or nerves are compressed.','महीनों तक एंटीबायोटिक या टीबी का इलाज; हड्डी दबे या नस पर दबाव हो तो सर्जरी।')},
  fracture:{causes:L('Major trauma in young people. In older people or those on steroids, weak bones (osteoporosis) can break with a minor fall or even lifting.','युवाओं में बड़ी चोट से। बुज़ुर्गों या स्टेरॉयड लेने वालों में कमज़ोर हड्डियाँ (ऑस्टियोपोरोसिस) छोटी गिरावट या वज़न उठाने से भी टूट सकती हैं।'),
    treat:L('Pain control, a brace in some cases and bone-strengthening treatment; cement augmentation or surgery for selected fractures.','दर्द नियंत्रण, कुछ मामलों में ब्रेस और हड्डियाँ मज़बूत करने का इलाज; चुने हुए फ्रैक्चर में सीमेंट या सर्जरी।')},
  tumour:{causes:L('Rarely, cancer spreads to the spine from the breast, prostate, lung, kidney or thyroid, or a growth starts in the spine itself.','कभी-कभी कैंसर स्तन, प्रोस्टेट, फेफड़े, गुर्दे या थायरॉइड से रीढ़ में फैलता है, या रीढ़ में ही गांठ शुरू होती है।'),
    treat:L('Depends on the cause; needs prompt assessment by the spine team and an oncologist.','कारण पर निर्भर; स्पाइन टीम और ऑन्कोलॉजिस्ट से जल्दी जांच ज़रूरी।')},
  pgp:{causes:L('Pregnancy hormones relax the pelvic ligaments while the growing baby changes posture and load.','गर्भावस्था के हार्मोन पेल्विक लिगामेंट को ढीला करते हैं और बढ़ता बच्चा पोस्चर व भार बदल देता है।'),
    treat:L('Physiotherapy, a pelvic support belt and activity changes; it usually settles after delivery.','फिज़ियोथेरेपी, पेल्विक सपोर्ट बेल्ट और गतिविधि में बदलाव; आमतौर पर डिलीवरी के बाद ठीक।')}
};
CONDS.push(
  {id:'ddd',th:[10,6,4],anchor:['lowback','w_sit'],depts:['ortho_spine','physio','pain'],
   name:L('Degenerative disc disease (discogenic pain)','डिस्क का घिसना (डिस्कोजेनिक दर्द)'),sci:'Disc degeneration · desiccation · internal disc disruption',
   what:L('The disc itself is the source of pain: it has dried out (desiccation), lost height or developed small tears in its outer ring, without a large herniation pressing a nerve. Pain is mainly central, deep and worse with sitting and bending.','दर्द खुद डिस्क से आता है: उसमें पानी कम हो गया है (डेसिकेशन), ऊंचाई घटी है या बाहरी छल्ले में छोटी दरारें हैं, पर कोई बड़ा हर्निएशन नस को नहीं दबा रहा। दर्द मुख्य रूप से बीच में, गहरा, और बैठने व झुकने पर ज़्यादा होता है।'),
   confirm:L('MRI shows dark (dehydrated) discs, height loss or annular fissures; findings must match symptoms because they are common without pain.','MRI में काली (पानी कम) डिस्क, ऊंचाई में कमी या एनुलर दरार दिखती है; ये बिना दर्द के भी आम हैं, इसलिए लक्षणों से मिलाना ज़रूरी।'),cSrc:['ajnr'],
   outlook:L('Flares come and go; most people do well with exercise, posture and weight control.','दर्द कभी बढ़ता-घटता है; ज़्यादातर लोग व्यायाम, पोस्चर और वज़न नियंत्रण से ठीक रहते हैं।'),
   causes:L('Ageing, genetics, smoking, obesity, long sitting and repeated heavy loading all speed up drying of the disc.','उम्र, आनुवंशिकता, धूम्रपान, मोटापा, लंबे समय बैठना और बार-बार भारी भार डिस्क के सूखने को तेज़ करते हैं।'),
   treat:L('Core-strengthening physiotherapy, regular walking, posture breaks and pain relief; injections or surgery only for selected cases.','कोर मज़बूत करने वाली फिज़ियोथेरेपी, नियमित सैर, पोस्चर ब्रेक और दर्द की दवा; इंजेक्शन या सर्जरी सिर्फ चुने हुए मामलों में।'),
   w:{h_1_5y:2,h_5y:3,btw_some:2,h_first:-2,lowback:2,w_sit:2,w_bend:2,ch_ache:1,d_3m:2,d_6_12:1,ep_recur:2,a_30_39:1,a_40_49:2,a_50_59:1,r_desk:1,on_sitting:1,on_bike:1,below_knee:-2,dom_leg:-2,slr_pos:-1,rf_fever:-3}},
  {id:'myofascial',th:[9,6,4],anchor:['lowback_side'],depts:['physio','gp'],
   name:L('Postural and myofascial back pain','पोस्चर और मांसपेशियों का दर्द (मायोफेशियल)'),sci:'Myofascial pain syndrome · postural low back pain',
   what:L('Tight, overworked back muscles develop tender knots (trigger points) that ache and can refer pain to the buttock. Typical after long hours at a desk or in a car.','ज़्यादा काम करती जकड़ी मांसपेशियों में दर्दनाक गांठें (ट्रिगर पॉइंट) बनती हैं जो दुखती हैं और नितंब तक दर्द भेज सकती हैं। डेस्क या कार में लंबे घंटों के बाद आम।'),
   confirm:L('Examination finds tender bands in the muscles; scans are normal or show only age-related changes.','जांच में मांसपेशियों में दर्दनाक पट्टियाँ मिलती हैं; स्कैन सामान्य या सिर्फ उम्र से जुड़े बदलाव दिखाते हैं।'),
   outlook:L('Responds well to regular movement, posture changes and strengthening.','नियमित हलचल, पोस्चर बदलाव और मज़बूती के व्यायाम से अच्छा सुधार।'),
   causes:L('Prolonged static postures, weak core and hip muscles, stress and poor sleep.','लंबे समय एक ही पोस्चर, कमज़ोर कोर और कूल्हे की मांसपेशियाँ, तनाव और खराब नींद।'),
   treat:L('Physiotherapy, ergonomic changes at work, heat and stretching, and trigger-point therapy.','फिज़ियोथेरेपी, काम की जगह पर एर्गोनॉमिक बदलाव, सिकाई और स्ट्रेचिंग, और ट्रिगर-पॉइंट थेरेपी।'),
   w:{btw_some:1,h_1_5y:1,lowback_side:2,ch_ache:2,r_desk:2,w_stand:1,w_sit:1,d_3m:1,on_sitting:2,on_gradual:1,b_walk:1,b_exercise:1,below_knee:-3,slr_pos:-2,dom_leg:-2,rf_fever:-3}},
  {id:'gyn',th:[8,6,4],anchor:['ch_period'],depts:['gyn','gp'],
   name:L('Gynaecological cause (endometriosis, fibroids, pelvic infection)','स्त्री रोग से जुड़ा कारण (एंडोमेट्रियोसिस, फाइब्रॉइड, पेल्विक इन्फेक्शन)'),sci:'Referred pelvic pain',
   what:L('Conditions of the uterus and ovaries can refer pain to the lower back and buttocks, typically linked to the menstrual cycle.','गर्भाशय और अंडाशय की समस्याएं कमर और नितंबों में दर्द भेज सकती हैं, आमतौर पर पीरियड्स के चक्र से जुड़ा।'),
   confirm:L('Gynaecological examination and pelvic ultrasound.','स्त्री रोग जांच और पेल्विक अल्ट्रासाउंड।'),
   outlook:L('Treatable once the cause is found.','कारण पता चलने पर इलाज संभव।'),
   causes:L('Endometriosis, fibroids, ovarian cysts or pelvic inflammatory disease.','एंडोमेट्रियोसिस, फाइब्रॉइड, अंडाशय की सिस्ट या पेल्विक इन्फेक्शन।'),
   treat:L('Depends on the cause: medicines, hormonal treatment or procedures.','कारण पर निर्भर: दवाएं, हार्मोनल इलाज या प्रोसीजर।'),
   w:{ch_period:6,sex_f:1,groin:1,lowback:1,on_gradual:1}},
  {id:'pad',th:[9,6,4],anchor:['w_walk_calf'],depts:['vascular','medicine'],oSrc:'nadeau',
   name:L('Narrowed leg arteries (peripheral artery disease)','पैर की धमनियों का संकरापन (पेरिफेरल आर्टरी डिज़ीज़)'),sci:'Peripheral artery disease · vascular (intermittent) claudication',
   what:L('Fatty plaque narrows the arteries to the legs, so the calf muscles run short of blood when walking. It feels like the spine problem called stenosis, but the pain sits in the calf and eases within a minute or two of just standing still; there is no need to sit or bend forward.','चर्बी की परत पैरों की धमनियों को संकरा कर देती है, इसलिए चलते समय पिंडली की मांसपेशियों को खून कम मिलता है। यह रीढ़ के स्टेनोसिस जैसा लगता है, लेकिन दर्द पिंडली में होता है और सिर्फ़ एक-दो मिनट खड़े रहने से ठीक हो जाता है; बैठने या आगे झुकने की ज़रूरत नहीं पड़ती।'),
   confirm:L('Feeling the foot pulses and the ankle-brachial index (blood pressure at the ankle compared with the arm); a Doppler ultrasound if it is low.','पैर की नब्ज़ देखना और एंकल-ब्रेकियल इंडेक्स (टखने और बांह का ब्लड प्रेशर मिलाना); कम हो तो डॉप्लर अल्ट्रासाउंड।'),
   outlook:L('Stopping smoking, a supervised walking programme and medicines for cholesterol, blood pressure and blood thinning improve walking distance and protect the heart. In one study, pain eased by simply standing still had a likelihood ratio of 7.8 for this cause.','धूम्रपान छोड़ना, निगरानी में चलने का अभ्यास और कोलेस्ट्रॉल, बीपी और खून पतला करने की दवाएं चलने की दूरी बढ़ाती हैं और दिल को भी बचाती हैं। एक अध्ययन में सिर्फ़ खड़े रहने से दर्द ठीक होने का likelihood ratio 7.8 था।'),
   causes:L('Smoking or tobacco, diabetes, high blood pressure, high cholesterol and age over 50.','धूम्रपान या तंबाकू, डायबिटीज़, हाई बीपी, हाई कोलेस्ट्रॉल और 50 से ज़्यादा उम्र।'),
   treat:L('A vascular or general physician checks the arteries; most people improve with walking exercise and medicines, and a few need a stent or bypass. Pain at rest, a cold pale foot or a sore that will not heal needs urgent care.','वैस्कुलर या जनरल फ़िज़िशियन धमनियां जांचते हैं; ज़्यादातर लोग चलने के व्यायाम और दवाओं से बेहतर होते हैं, कुछ को स्टेंट या बाईपास चाहिए। आराम में दर्द, ठंडा-पीला पैर या न भरने वाला घाव हो तो तुरंत इलाज ज़रूरी।'),
   w:{w_walk_calf:5,r_vasc:2,a_60p:2,a_50_59:1,sex_m:1,s1:1,b_sitflex:-2,b_sit_nopain:-1,w_walk:-1,lowback:-1,a_u18:-3,a_18_29:-3,a_30_39:-2}},
  {id:'cplbp',th:[9,6,4],anchor:['d_3m'],depts:['physio','gp','pain'],oSrc:'whocplbp',
   name:L('Chronic primary low back pain (long-lasting back pain without a specific disease)','क्रॉनिक प्राइमरी कमर दर्द (बिना किसी खास बीमारी के लंबा चलने वाला दर्द)'),sci:'Chronic primary low back pain (WHO 2023), previously chronic non-specific low back pain',
   what:L('Back pain that has lasted more than 3 months and is not caused by a specific disease such as a fracture, infection, inflammatory disease or a trapped nerve. The WHO says this is the cause in more than 90% of long-lasting back pain seen in primary care. The pain is real: nerves and muscles become more sensitive over time, and sleep, stress and inactivity keep it going.','कमर दर्द जो 3 महीने से ज़्यादा चल रहा हो और किसी खास बीमारी (फ्रैक्चर, इंफेक्शन, सूजन वाली बीमारी या दबी नस) से न हो। WHO के अनुसार प्राइमरी केयर में लंबे कमर दर्द के 90% से ज़्यादा मामले यही होते हैं। दर्द असली है: समय के साथ नसें और मांसपेशियां ज़्यादा संवेदनशील हो जाती हैं, और नींद, तनाव और कम हिलना-डुलना इसे बनाए रखते हैं।'),
   confirm:L('A doctor rules out specific causes by history and examination; routine scans are not needed unless a red flag or nerve signs appear.','डॉक्टर बातचीत और जांच से खास कारणों को खारिज करते हैं; खतरे के संकेत या नस के लक्षण न हों तो रूटीन स्कैन ज़रूरी नहीं।'),
   outlook:L('In a large meta-analysis, people whose back pain had lasted more than 6 weeks still improved, but more slowly: average pain fell from about 51 to 33 (out of 100) by 6 weeks and to 23 at one year. Structured exercise and education help most.','एक बड़े मेटा-एनालिसिस में 6 हफ्ते से ज़्यादा पुराने दर्द वाले लोग भी बेहतर हुए, बस धीरे: औसत दर्द 100 में से 51 से 6 हफ्तों में 33 और एक साल में 23 हुआ। नियमित व्यायाम और सही जानकारी सबसे ज़्यादा मदद करते हैं।'),
   causes:L('Usually a mix of factors: deconditioned back and hip muscles, long sitting, heavy or repetitive work, poor sleep, stress and fear of movement.','अक्सर कई कारण मिलकर: कमज़ोर कमर और कूल्हे की मांसपेशियां, लंबा बैठना, भारी या बार-बार का काम, कम नींद, तनाव और हिलने से डर।'),
   treat:L('The WHO 2023 guideline lists structured exercise, education and advice, and psychological approaches such as cognitive behavioural therapy; medicines are chosen by a doctor case by case.','WHO 2023 गाइडलाइन में नियमित व्यायाम, सही जानकारी और सलाह, और कॉग्निटिव बिहेवियरल थेरेपी जैसे मनोवैज्ञानिक तरीके शामिल हैं; दवाएं डॉक्टर हर व्यक्ति के हिसाब से चुनते हैं।'),
   w:{d_3m:4,btw_some:2,h_1_5y:1,h_5y:1,lowback:1,lowback_side:1,ch_ache:1,sleep_bad:1,r_desk:1,below_knee:-2,dom_leg:-2,slr_pos:-1,rf_fever:-3,r_cancer:-2,ibp2:-2,w_walk:-2,w_walk_calf:-2,flank:-2,groin:-1,tailbone:-1,ch_period:-2}}
);
CONDS.forEach(c => Object.assign(c, EXTRA[c.id] || {}));
EMERG.aaa = {name:L('Possible abdominal aortic aneurysm','पेट की महाधमनी फूलने (एन्यूरिज़्म) की आशंका'),sci:'Abdominal aortic aneurysm (rule out)',
  what:L('Sudden severe pain in the belly and back, or a pulsing lump in the belly, can come from the main artery. It is rare but life-threatening and needs emergency assessment.','पेट और कमर में अचानक तेज़ दर्द, या पेट में धड़कती गांठ, मुख्य धमनी से हो सकती है। यह दुर्लभ है पर जानलेवा, और तुरंत इमरजेंसी जांच ज़रूरी है।'),src:['wikem'],depts:['emergency','vascular']};
PAT.other.push(['ch_period',L('Pain that comes with periods','पीरियड्स के साथ आने वाला दर्द')]);
RFS.splice(5, 0, ['rf_abd',L('Sudden severe pain in the belly and back, or a pulsing lump in the belly','पेट और कमर में अचानक तेज़ दर्द, या पेट में धड़कती गांठ')]);
[['on_jerk',{disc:2,strain:2}],['on_house',{disc:1,strain:2,myofascial:1}],['on_bike',{disc:1,strain:1}],['on_yoga',{strain:2,disc:1}]].forEach(([k, m]) => CONDS.forEach(c => { if (m[c.id]) c.w[k] = m[c.id]; }));
const RS = {
  o_motor:L('Weakness on the heel-walk or heel-raise test','एड़ी पर चलने या पंजों पर उठने के टेस्ट में कमज़ोरी'),
  o_fever:L('Fever, night sweats or weight loss with back pain','पीठ दर्द के साथ बुखार, रात को पसीना या वज़न घटना'),
  o_cancer:L('New back pain with a history of cancer','कैंसर के इतिहास के साथ नया पीठ दर्द'),
  o_night:L('Constant night pain at age 50 or over','50 या ज़्यादा उम्र में रात का लगातार दर्द'),
  o_fx:L('Fracture risk: weak bones or age 60+ with a sudden strain or fall','फ्रैक्चर का खतरा: कमज़ोर हड्डियाँ या 60+ उम्र और अचानक झटका या गिरना'),
  o_walk:L('Unable to walk or stand','चल या खड़े नहीं हो पा रहे'),
  o_pain:L('Very severe pain (9–10 out of 10)','बहुत तेज़ दर्द (10 में 9–10)'),
  o_kidney:L('Flank pain with fever or urine symptoms','बुखार या पेशाब की दिक्कत के साथ फ्लैंक का दर्द'),
  o_worse:L('Nerve pain that is getting worse','बढ़ता हुआ नस का दर्द'),
  y_radic:L('Leg pain with nerve-root features','नस की जड़ के लक्षणों वाला पैर का दर्द'),
  y_long:L('This bout has lasted more than 6 weeks','इस बार का दर्द 6 हफ्ते से ज़्यादा से है'),
  y_inflam:L('Inflammatory pattern: long morning stiffness, better with exercise','सूजन वाला पैटर्न: सुबह लंबी अकड़न, व्यायाम से आराम'),
  y_vasc:L('Calf pain on walking that eases on standing: leg blood flow must be checked','चलने पर पिंडली का दर्द जो खड़े रहने से ठीक हो: पैरों का ब्लड फ़्लो जांचना ज़रूरी'),
  y_claud:L('Leg symptoms on walking that ease on sitting','चलने पर पैरों के लक्षण जो बैठने पर कम हों'),
  y_groin:L('Groin pain, which can come from the hip','ग्रोइन का दर्द, जो कूल्हे से हो सकता है'),
  y_tail:L('Tailbone pain for more than a week','एक हफ्ते से ज़्यादा टेलबोन दर्द'),
  y_age:L('Age under 18 or over 60','18 से कम या 60 से ज़्यादा उम्र'),
  y_pain:L('Strong pain (7–8 out of 10)','तेज़ दर्द (10 में 7–8)'),
  y_injury:L('Started after a fall, blow or accident','गिरने, चोट या दुर्घटना के बाद शुरू'),
  y_urine:L('Urine symptoms','पेशाब के लक्षण'), y_night:L('Pain at rest at night','रात को आराम में दर्द'), y_preg:L('Pregnancy or recent delivery','गर्भावस्था या हाल की डिलीवरी'),
  y_sleep:L('Pain disturbing sleep','दर्द से नींद खराब'), y_flank:L('Flank pain','फ्लैंक का दर्द'),
  g_ok:L('No red flags and no nerve-root signs','कोई खतरे का संकेत नहीं और नस की जड़ के लक्षण नहीं')
};

  /* ---- declarative rules (read by the engine) ---- */
  const limbAreas = ['thigh_back','thigh_front','l4','l5','s1'];
  const DERIVED = [
    {id:'ibp_ex', when:{any:['b_exercise','w_rest']}},
    {id:'ibp2', when:{atLeast:[2,['ch_stiff_am','ibp_ex','ch_night_wake','ch_alt_buttock']]}},
    {id:'ibp3', when:{atLeast:[3,['ch_stiff_am','ibp_ex','ch_night_wake','ch_alt_buttock']]}},
    {id:'fx_combo', when:{atLeast:[3,['sex_f','a_60p','rf_trauma','r_bones']]}},
    {id:'leg_any', when:{any:limbAreas}},
    {id:'below_knee', when:{any:['l4','l5','s1']}},
    {id:'radicular', when:{any:['below_knee','dom_leg','slr_pos','cslr_pos','ch_shoot']}}
  ];
  const SIDES = {areas:limbAreas, one:'leg_one', both:'both_legs', sideAreas:['thigh_back','thigh_front','l4','l5','s1','buttock']};
  const URGENCY = {
    orange:[
      {r:'o_motor', when:{any:['heel_weak','toe_weak']}},
      {r:'o_fever', when:'rf_fever'},
      {r:'o_cancer', when:{all:['r_cancer',{not:'d_3m'}]}},
      {r:'o_night', when:{all:['rf_night',{any:['age_ge50','r_cancer']}]}},
      {r:'o_fx', when:{all:[{any:['r_bones','a_60p']},{any:['on_fall','on_lift','on_bend','on_blow','on_cough']}]}},
      {r:'o_walk', when:'walk_no'},
      {r:'o_pain', when:{painGte:9}},
      {r:'o_kidney', when:{all:['flank',{any:['rf_fever','u_urine']}]}},
      {r:'o_worse', when:{all:['t_worse','radicular']}}
    ],
    yellow:[
      {r:'y_radic', when:'radicular'},
      {r:'y_often', when:'btw_often'}, {r:'y_long', when:{any:['d_6_12','d_3m']}},
      {r:'y_inflam', when:'ibp2'},
      {r:'y_claud', when:'w_walk'},
      {r:'y_vasc', when:'w_walk_calf'},
      {r:'y_groin', when:'groin'},
      {r:'y_flank', when:'flank'},
      {r:'y_tail', when:{all:['tailbone',{not:'d_days'}]}},
      {r:'y_age', when:{any:['a_u18','a_60p']}},
      {r:'y_pain', when:{all:[{painGte:7},{not:{painGte:9}}]}},
      {r:'y_injury', when:{any:['on_fall','on_accident','on_blow']}},
      {r:'y_urine', when:'u_urine'},
      {r:'y_night', when:'rf_night'},
      {r:'y_preg', when:'on_preg'},
      {r:'y_sleep', when:'sleep_bad'}
    ]
  };
  const EMERG_WHEN = {cauda:{any:['rf_bladder','rf_saddle']}, cord:'rf_weak_prog', trauma:'rf_trauma', aaa:'rf_abd'};
  const ROOT_RULES = [
    {root:'L5', when:{any:['l5','heel_weak']}},
    {root:'S1', when:{any:['s1','toe_weak']}},
    {root:'L4', when:'l4'},
    {root:'L3', when:{all:['thigh_front',{not:{any:['l5','heel_weak','s1','toe_weak','l4']}}]}}
  ];
  const DISC_OF = {L3:'L2–L3', L4:'L3–L4', L5:'L4–L5', S1:'L5–S1'};
  const EXIT_OF = {L5:'L4', S1:'L5', L4:'L3', L3:'L2'};
  const DEPT_RULES = [
    {when:{any:['heel_weak','toe_weak']}, add:['neurosurg','neuro'], why:'o_motor'},
    {drop:'neuro', cond:'disc', unless:{any:['ch_numb','heel_weak','toe_weak','ch_tingle']}}
  ];
  const FOCUS = {
    disc:{lesion:true}, upper:{lesion:true},
    stenosis:{discs:['L3–L4','L4–L5'], sac:true, roots:['L5'], sides:['l','r'], side:'b', herniate:true, label:['L4–L5']},
    spondy:{vert:['L5'], discs:['L5–S1'], label:['L5–S1']}, fracture:{vert:['L1']}, infection:{discs:['L4–L5'], vert:['L4','L5'], label:['L4–L5']},
    facet:{vert:['L4','L5']}, ddd:{discs:['L4–L5'], label:['L4–L5']}, si:{bones:['sacrum','pelvis']}, pgp:{bones:['sacrum','pelvis']}, axspa:{bones:['sacrum','pelvis']},
    coccyx:{bones:['sacrum']}, piri:{nerves:['sciatic'], useSides:true}, hip:{bones:['leg']}
  };
  const RCA = {conds:['disc','upper'], emerg:['cauda'], defaultRoots:['L5','S1'], defaultLevels:['L4–L5','L5–S1'], nerveTable:['L2','L3','L4','L5','S1'],
    text:{
      en:['Your answers fit a disc at {levels} pressing on the {roots} nerve root{sideEn}. Each disc has a tough outer ring (annulus fibrosus) around a gel centre (nucleus pulposus). A sudden load such as getting up quickly, bending or lifting can tear the ring, and the gel pushes backwards into the space where the nerve roots run.',
          'The pressed root becomes inflamed. That is why pain travels along its path into the buttock and leg (sciatica), and why sitting, bending and coughing, which raise pressure inside the disc, make it worse.',
          'About 90–95% of herniations sit just off-centre (paracentral) and press the root travelling down past the disc, so an L4–L5 disc usually affects the L5 root. The less common foraminal type (5–10%) presses the root leaving at that level.{cite:ortho}'],
      hi:['आपके जवाब {levels} डिस्क से {roots} नस की जड़ पर दबाव से मेल खाते हैं{sideHi}। हर डिस्क में बाहर एक मज़बूत छल्ला (एनुलस फाइब्रोसस) और बीच में जेल (न्यूक्लियस पल्पोसस) होता है। अचानक भार, जैसे जल्दी उठना, झुकना या वज़न उठाना, छल्ले में दरार कर सकता है और जेल पीछे उस जगह की ओर निकल आता है जहाँ से नसें गुज़रती हैं।',
          'दबी हुई जड़ में सूजन आ जाती है। इसीलिए दर्द उस जड़ के रास्ते नितंब और पैर में जाता है (साइटिका), और बैठना, झुकना और खांसना, जो डिस्क के अंदर का दबाव बढ़ाते हैं, दर्द को बढ़ाते हैं।',
          'लगभग 90–95% हर्निएशन बीच से थोड़ा हटकर (पैरासेंट्रल) होते हैं और उस जड़ को दबाते हैं जो डिस्क के पास से नीचे जाती है; इसलिए L4–L5 डिस्क आमतौर पर L5 जड़ को दबाती है। कम आम फोरामिनल प्रकार (5–10%) उसी स्तर से निकलने वाली जड़ को दबाता है।{cite:ortho}']},
    known:{en:'Only an MRI shows the exact level and type. MRI also finds bulges in many people without pain (30% at age 20, 84% at 80), so findings are always matched to symptoms.{cite:ajnr}', hi:'सटीक स्तर और प्रकार सिर्फ MRI दिखाता है। MRI बिना दर्द वाले कई लोगों में भी बल्ज दिखाता है (20 की उम्र में 30%, 80 में 84%), इसलिए रिपोर्ट को हमेशा लक्षणों से मिलाया जाता है।{cite:ajnr}'},
    unknown:{en:'95% of lumbar herniations are at L4–L5 or L5–S1.{cite:ortho} Marking the shin and foot areas and doing the heel and toe tests narrows the level; MRI gives the final answer.', hi:'95% लम्बर हर्निएशन L4–L5 या L5–S1 पर होते हैं।{cite:ortho} स्तर पक्का करने के लिए पिंडली और पंजे के हिस्से चिन्हित करें और एड़ी व पंजों वाले टेस्ट करें; अंतिम पुष्टि MRI से होती है।'}
  };
  const LBLX = {
    ibp_ex:L('Better with exercise, worse with rest','व्यायाम से बेहतर, आराम से बदतर'), ibp2:L('2 or more inflammatory back pain features','सूजन वाले कमर दर्द के 2 या ज़्यादा लक्षण'), ibp3:L('3 or more inflammatory back pain features','सूजन वाले कमर दर्द के 3 या ज़्यादा लक्षण'), fx_combo:L('Three fracture risk factors together','फ्रैक्चर के तीन जोखिम एक साथ'),
    leg_any:L('Pain spreads into the leg','दर्द पैर में फैलता है'), below_knee:L('Symptoms below the knee','घुटने के नीचे लक्षण'), leg_one:L('One leg only','सिर्फ एक पैर'), both_legs:L('Both legs','दोनों पैर'), radicular:L('Nerve-root features','नस की जड़ के लक्षण'),
    slr_pos:L('Straight leg raise positive','SLR पॉज़िटिव'), slr_neg:L('Straight leg raise negative','SLR नेगेटिव'), cslr_pos:L('Crossed SLR positive','क्रॉस्ड SLR पॉज़िटिव'),
    heel_weak:L('Weak on heel walk','एड़ी पर चलने में कमज़ोरी'), toe_weak:L('Weak on heel raise','पंजों पर उठने में कमज़ोरी')
  };
  const UI = {
    domT:L('Which troubles you more: back pain or leg pain?','ज़्यादा तकलीफ़ किसमें है: कमर के दर्द में या पैर के दर्द में?'),
    domWhy:L('Leg pain worse than back pain is typical of a pressed nerve root (sciatica).','पैर का दर्द कमर से ज़्यादा होना नस की जड़ दबने (साइटिका) का खास लक्षण है।'),
    repT:L('Lower back pain assessment','कमर दर्द जांच रिपोर्ट'), safPic:L('Saddle area (asked below): the skin that would touch a saddle — between the legs, around the back passage and genitals.','सैडल एरिया (नीचे पूछा गया): वह हिस्सा जो काठी पर बैठते समय छूता है — दोनों जांघों के बीच, मलद्वार और गुप्तांग के आसपास।'), modTag:L('Lower back','कमर')
  };
  const FUNCS = [{id:'walk', label:'walk', opts:WALKS, req:true}, {id:'sit', label:'sit', opts:SITS, req:true}, {id:'sleep', label:'sleep', opts:SLEEPS}];

SPG.data.modules.lumbar = {id:'lumbar', order:1, startRegions:['lowback'], labelSet:['T11','T12','L1','L2','L3','L4','L5','S1','Coccyx'], GAL:{d:0.66, ld:0.62, td:0.27, ref:'L3', refDy:-0.02, nerves:['L1_','L2_','L3_','L4_','L5_','S1_','sciatic','tibial','peroneal','femoral','saphenous','cord']}, safetyRegions:['saddle'], name:L('Lower back pain, with or without leg pain','कमर दर्द, पैर के दर्द के साथ या बिना'), safetyView:'saddle', anatomy:'lumbar',
  DOMS, PAT, RFS, VIEWS, AREAS, TESTS, CONDS, EMERG, ROOTS, RS, DERIVED, SIDES, URGENCY, EMERG_WHEN, ROOT_RULES, DISC_OF, EXIT_OF, DEPT_RULES, FOCUS, RCA, LBLX, UI, FUNCS,
  domWhen:{any:limbAreas}};
})();
