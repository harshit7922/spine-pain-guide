window.SPG = window.SPG || {data:{modules:{}}};
/* Elbow, wrist and hand module (v5.6). Questions, weights, rules and explanations for elbow, wrist and hand pain.
   Evidence table: research/hand-evidence.md. Weights from likelihood ratios use round(4 x log10(LR)); others are marked expert estimates there. */
(function(){
const PI = Math.PI;
const L = (en, hi) => ({en, hi});
const C = SPG.data.common;
C.SRC.push(
  ['shiri06','Shiri R et al. Prevalence and determinants of lateral and medial epicondylitis: a population study. Am J Epidemiol 2006 (4,783 people: lateral 1.3%, medial 0.4%, highest at 45–54; forceful plus repetitive work OR 5.6; current smoking OR 3.4)','https://www.qxmd.com/r/16968862'],
  ['bisset','Bisset L et al. BMJ 2006, wait-and-see arm (success 83% at 26 weeks, 90% at 52 weeks), summarised by Physio First','https://physiofirst.org.uk/static/uploaded/a9315881-2a2d-4004-8b95c313f2d5a3d4.pdf'],
  ['coombes13','Coombes BK et al. Effect of corticosteroid injection, physiotherapy, or both on lateral epicondylalgia. JAMA 2013 (165 people; recovered or much improved at 1 year 83% after steroid vs 96% after placebo injection; recurrence 54% vs 12%)','https://www.sciencedaily.com/releases/2013/02/130205162119.htm'],
  ['letdx','Diagnostic accuracy of examination tests for lateral elbow tendinopathy: systematic review. J Hand Ther 2021 (Cozen test sensitivity 91%; grip strength difference sensitivity 78–83%, specificity 80–90%)','https://read.qxmd.com/read/33814224/diagnostic-accuracy-of-examination-tests-for-lateral-elbow-tendinopathy-let-a-systematic-review'],
  ['goubau','Goubau JF et al. The wrist hyperflexion and abduction of the thumb (WHAT) test for de Quervain’s disease. J Hand Surg Eur 2014 (sensitivity 99%, specificity 29%)','https://www.physiotutors.com/de/wiki/what-test/'],
  ['dqstat','StatPearls – De Quervain tenosynovitis (women 1.3%, men 0.5%; new mothers; one or two injections give near-complete relief in 52–90%)','https://www.statpearls.com/point-of-care/20270'],
  ['trigger','Trigger finger review (2–3% of people, about 10% with diabetes; one steroid injection succeeds in 60–80% at a year)','https://www.sportsmedreview.com/?p=5806'],
  ['acrhand','Altman R et al. ACR criteria for the classification of osteoarthritis of the hand. Arthritis Rheum 1990;33:1601–10 (classification tree sensitivity 92%, specificity 98%)','https://www.qxmd.com/r/2242058'],
  ['handoaprev','Radiopaedia – Osteoarthritis of the hand (symptomatic in about 15%, range 6–26%; women over 50 most affected; thumb base involvement)','https://radiopaedia.org/articles/osteoarthritis-of-the-hand'],
  ['malaviya','Malaviya AN et al. Prevalence of rheumatoid arthritis in the adult Indian population. Rheumatol Int 1993;13:131–4 (0.75% of 44,551 adults near Delhi)','https://link.springer.com/doi/10.1007/BF00301258'],
  ['niceraqs','NICE QS33 Rheumatoid arthritis: refer suspected persistent synovitis of the small joints of the hands or feet, or of more than one joint, within 3 working days','https://nice.org.uk/guidance/qs33/resources/rheumatoid-arthritis-in-over-16s-pdf-2098604563909'],
  ['ganglion','Gude W, Morelli V. Ganglion cysts of the wrist. Curr Rev Musculoskelet Med 2008;1:205–11 (back of the wrist 60–70%; up to half go away; aspiration succeeds in 30–50%)','https://link.springer.com/doi/10.1007/s12178-008-9033-4'],
  ['dupuytren','Trojian TH, Chu SM. Dupuytren’s disease: diagnosis and treatment. Am Fam Physician 2007;76:86–9 (ring finger most often; table-top test; refer at 30° knuckle contracture or any middle-joint contracture)','https://www.aafp.org/pubs/afp/issues/2007/0701/p86.html'],
  ['scaphoid','StatPearls – Scaphoid fracture (60–70% of wrist-bone fractures; up to 25% not seen on the first X-ray; non-union almost 10 times more likely if diagnosis is delayed over 4 weeks)','https://statpearls.com/point-of-care/31423'],
  ['elbext','Appelboam A et al. Elbow extension test to rule out elbow fracture. BMJ 2008 (sensitivity 96.8%; adults who can fully straighten the elbow have a 1.6% fracture risk)','https://www.aafp.org/afp/2009/1101/p997.html'],
  ['kanavel','Chan E et al. Kanavel signs of flexor sheath infection: a cautionary tale. Br J Gen Pract 2019 (surgical emergency; all four signs sensitivity 91–97%; fever in only 17%)','https://bjgp.org/content/bjgp/69/683/315.full.pdf'],
  ['olecranon','StatPearls – Olecranon bursitis (about one third are infected; 65–85% of non-infected cases settle by 4 weeks)','https://www.statpearls.com/point-of-care/26147']
);
const ONSETS = [
  ['on_gradual',L('Slowly, with no clear reason','धीरे-धीरे, बिना किसी साफ़ वजह के')],
  ['on_overuse',L('After more gripping, lifting, typing, tools or sport than usual','सामान्य से ज़्यादा पकड़ने, उठाने, टाइपिंग, औज़ार या खेल के बाद')],
  ['on_fall',L('A fall onto an outstretched hand','फैले हुए हाथ के बल गिरना')],
  ['on_blow',L('A blow, twist or sports injury to the arm or hand','बांह या हाथ पर चोट, मुड़ना या खेल की चोट')],
  ['on_woke',L('Woke up with it','सुबह उठे तो दर्द था')],
  ['on_accident',L('Road accident','सड़क दुर्घटना')]
];
const PAT = {
  char:[
    ['ch_grip_pain',L('Pain on gripping, lifting a cup or kettle, or shaking hands','पकड़ने, कप या केतली उठाने, या हाथ मिलाने पर दर्द')],
    ['ch_night_hand',L('Hand tingling that wakes you at night and eases by shaking the hand','हाथ की झुनझुनी जो रात को जगा दे और हाथ झटकने से कम हो')],
    ['ch_numb_median',L('Numbness or tingling in the thumb, index and middle fingers','अंगूठे, तर्जनी और बीच की उंगली में सुन्नपन या झुनझुनी')],
    ['ch_numb_ulnar',L('Numbness or tingling in the ring and little fingers','अनामिका और छोटी उंगली में सुन्नपन या झुनझुनी')],
    ['ch_elbow_bend',L('Ring and little finger tingling when the elbow stays bent (on the phone, sleeping with the arm bent)','कोहनी देर तक मुड़ी रहने पर (फ़ोन पर बात, मुड़ी बांह के साथ सोना) अनामिका और छोटी उंगली में झुनझुनी')],
    ['ch_weak_grip',L('Dropping things, or a clumsy or weak hand','चीज़ें गिर जाना, या हाथ अनाड़ी या कमज़ोर लगना')],
    ['ch_click_finger',L('A finger or thumb clicks, catches or gets stuck bent and has to be straightened','उंगली या अंगूठा क्लिक करता है, अटकता है या मुड़ा फंस जाता है और सीधा करना पड़ता है')],
    ['ch_lump_wrist',L('A smooth, rubbery lump on the wrist or at the base of a finger that may change size','कलाई पर या उंगली की जड़ में चिकनी, रबर जैसी गांठ जिसका आकार बदल सकता है')],
    ['ch_palm_cord',L('A firm lump or cord in the palm, with a finger slowly bending down','हथेली में सख्त गांठ या डोरी, और एक उंगली धीरे-धीरे नीचे मुड़ती जा रही है')],
    ['ch_tabletop',L('Cannot lay the palm and fingers flat on a table','हथेली और उंगलियाँ मेज़ पर सपाट नहीं रख पाते')],
    ['ch_bony_fingers',L('Hard, bony knobs on the end or middle finger joints','उंगलियों के आखिरी या बीच के जोड़ों पर सख्त, हड्डी जैसी गांठें')],
    ['ch_swell_knuckles',L('Soft, puffy swelling of the knuckles or middle finger joints','उंगलियों की जड़ के जोड़ों (नकल्स) या बीच के जोड़ों में नरम, फूली सूजन')],
    ['ch_stiff_short',L('Stiff in the morning, easing within 30 minutes','सुबह जकड़न जो 30 मिनट के अंदर कम हो जाती है')],
    ['ch_stiff_long',L('Stiff in the morning for more than 30 minutes','सुबह 30 मिनट से ज़्यादा जकड़न')],
    ['ch_elbow_swell',L('A soft, egg-like swelling on the point of the elbow','कोहनी की नोक पर नरम, अंडे जैसी सूजन')],
    ['ch_neck_arm',L('Neck pain with pain shooting down the arm','गर्दन दर्द के साथ बांह में नीचे तक करंट जैसा दर्द')]
  ],
  worse:[
    ['w_lift_baby',L('Lifting a baby, pouring, or twisting the thumb and wrist','बच्चे को उठाना, उड़ेलना, या अंगूठा और कलाई मोड़ना')],
    ['w_pinch',L('Pinching, opening jars, turning keys or writing','चुटकी से पकड़ना, जार खोलना, चाबी घुमाना या लिखना')],
    ['w_wrist_use',L('Typing, using a mouse or phone, wringing clothes, using tools','टाइपिंग, माउस या फ़ोन चलाना, कपड़े निचोड़ना, औज़ार चलाना')],
    ['w_lean_elbow',L('Leaning on the elbow','कोहनी पर टेक लगाना')]
  ],
  better:[['b_rest',L('Rest','आराम')]],
  other:[
    ['o_new_mother',L('Pregnant, or caring for a baby under a year old','गर्भवती, या एक साल से छोटे बच्चे की देखभाल')],
    ['o_repetitive',L('Work with forceful, repeated hand or arm use (tools, construction, cooking, tailoring, plumbing)','ज़ोर से और बार-बार हाथ या बांह के इस्तेमाल वाला काम (औज़ार, निर्माण, खाना बनाना, सिलाई, प्लंबिंग)')],
    ['o_thyroid',L('Underactive thyroid','थायरॉइड कम (हाइपोथायरॉइडिज़्म)')],
    ['o_overweight',L('Overweight','ज़्यादा वज़न')],
    ['o_other_joints',L('Other joints also swollen or painful (feet, knees, wrists)','दूसरे जोड़ भी सूजे या दर्द वाले (पैर, घुटने, कलाई)')]
  ]
};
const RFS = [
  ['rf_deform',L('After a fall or injury: the elbow or wrist looks deformed, swelled up quickly, or the elbow cannot be straightened fully','गिरने या चोट के बाद: कोहनी या कलाई टेढ़ी दिखती है, तेज़ी से सूज गई, या कोहनी पूरी सीधी नहीं होती')],
  ['rf_snuffbox',L('After a fall on the hand: pain when pressing the hollow at the base of the thumb','हाथ के बल गिरने के बाद: अंगूठे की जड़ के गड्ढे को दबाने पर दर्द')],
  ['rf_infect',L('A red, hot, swollen finger or hand, held bent and very painful to straighten, or after a cut or a human or animal bite','लाल, गर्म, सूजी उंगली या हाथ जो मुड़ा रहता है और सीधा करने पर बहुत दर्द हो, या कटने या इंसान या जानवर के काटने के बाद')],
  ['rf_hot',L('A hot, red, swollen elbow or wrist, or a hot elbow-point swelling, with fever','बुखार के साथ गर्म, लाल, सूजी कोहनी या कलाई, या कोहनी की नोक पर गर्म सूजन')],
  ['rf_chest',L('Arm pain with chest pain or pressure, breathlessness or sweating','बांह के दर्द के साथ सीने में दर्द या दबाव, सांस फूलना या पसीना')],
  ['rf_weak',L('Hand or arm weakness that is getting worse, or the muscles of the hand are wasting','हाथ या बांह की कमज़ोरी जो बढ़ रही है, या हाथ की मांसपेशियाँ घट रही हैं')],
  ['rf_fever',L('Fever, night sweats or weight loss without trying','बुखार, रात को पसीना या बिना कोशिश वज़न घटना')],
  ['rf_night',L('Constant pain at night that no position eases','रात को लगातार दर्द जो किसी भी पोज़िशन में कम न हो')]
];
const VIEWS = {
  elb_out:{az:1.3,el:0.1,d:0.6,yk:'elbow',dy:0,tx:0.24,tz:0.02}, elb_in:{az:-0.25,el:0.1,d:0.6,yk:'elbow',dy:0,tx:0.22,tz:0.03}, elb_back:{az:2.85,el:0.1,d:0.6,yk:'elbow',dy:0,tx:0.23,tz:0.0},
  wrist_thumb:{az:0.6,el:0.15,d:0.45,yk:'wrist',dy:0.03,tx:0.27,tz:0.2}, thumb_base:{az:0.4,el:0.2,d:0.45,yk:'wrist',dy:-0.01,tx:0.25,tz:0.29},
  wrist_palm:{az:-0.45,el:0.3,d:0.45,yk:'wrist',dy:-0.03,tx:0.27,tz:0.24}, wrist_back:{az:1.3,el:0.15,d:0.45,yk:'wrist',dy:0,tx:0.3,tz:0.22},
  finger_base:{az:-0.4,el:0.25,d:0.45,yk:'wrist',dy:-0.09,tx:0.28,tz:0.28}, fingers:{az:0.9,el:0.15,d:0.45,yk:'wrist',dy:-0.11,tx:0.28,tz:0.31},
  neck:{az:PI,el:0.12,d:1.15,yk:'c4',dy:-0.01}
};
const AREAS = [
  {id:'elb_out',pair:true,view:'elb_out',name:L('Outer side of the elbow','कोहनी का बाहरी हिस्सा'),desc:L('The bony bump on the thumb side of the elbow, and just below it.','कोहनी के अंगूठे वाली तरफ़ की हड्डी का उभार, और उसके ठीक नीचे।'),rel:L('Pain here on gripping and lifting is typical of tennis elbow.','पकड़ने और उठाने पर यहाँ दर्द टेनिस एल्बो का खास लक्षण है।')},
  {id:'elb_in',pair:true,view:'elb_in',name:L('Inner side of the elbow','कोहनी का अंदरूनी हिस्सा'),desc:L('The bony bump on the little-finger side of the elbow (the “funny bone” is just behind it).','कोहनी के छोटी उंगली वाली तरफ़ की हड्डी का उभार (“फ़नी बोन” इसके ठीक पीछे है)।'),rel:L('Pain here is typical of golfer’s elbow; tingling into the little finger points to the ulnar nerve.','यहाँ दर्द गोल्फ़र्स एल्बो का खास लक्षण है; छोटी उंगली तक झुनझुनी अल्नर नस की ओर इशारा करती है।')},
  {id:'elb_back',pair:true,view:'elb_back',name:L('Point of the elbow (back)','कोहनी की नोक (पीछे)'),desc:L('The bony point at the back of the elbow that you lean on.','कोहनी के पीछे की हड्डी की नोक जिस पर टेक लगाते हैं।'),rel:L('A soft swelling here is an olecranon bursitis; if it is hot and red it may be infected.','यहाँ नरम सूजन ओलेक्रेनन बर्साइटिस है; गर्म और लाल हो तो इन्फेक्शन हो सकता है।')},
  {id:'wrist_thumb',pair:true,view:'wrist_thumb',name:L('Thumb side of the wrist','कलाई का अंगूठे वाला हिस्सा'),desc:L('The side of the wrist just above the thumb.','अंगूठे के ठीक ऊपर कलाई का किनारा।'),rel:L('Pain here with thumb and wrist movement is typical of de Quervain’s; after a fall it may be a scaphoid fracture.','अंगूठे और कलाई की हरकत पर यहाँ दर्द डी क्वेरवेन का खास लक्षण है; गिरने के बाद यह स्कैफ़ॉइड फ्रैक्चर हो सकता है।')},
  {id:'thumb_base',pair:true,view:'thumb_base',name:L('Base of the thumb','अंगूठे की जड़'),desc:L('The fleshy base of the thumb and the joint where it meets the wrist.','अंगूठे की मांसल जड़ और वह जोड़ जहाँ यह कलाई से मिलता है।'),rel:L('Aching here with pinching and opening jars is typical of thumb-base arthritis.','चुटकी से पकड़ने और जार खोलने पर यहाँ दर्द अंगूठे की जड़ की गठिया का खास लक्षण है।')},
  {id:'wrist_palm',pair:true,view:'wrist_palm',name:L('Palm side of the wrist','कलाई का हथेली वाला हिस्सा'),desc:L('The front of the wrist, where you feel your pulse.','कलाई का आगे का हिस्सा, जहाँ नब्ज़ महसूस होती है।'),rel:L('The median nerve passes here through the carpal tunnel.','मीडियन नस यहाँ कार्पल टनल से गुज़रती है।')},
  {id:'wrist_back',pair:true,view:'wrist_back',name:L('Back of the wrist','कलाई का पिछला हिस्सा'),desc:L('The back of the wrist, on the same side as the knuckles.','कलाई का पिछला हिस्सा, उसी तरफ़ जहाँ नकल्स हैं।'),rel:L('A smooth lump here is usually a ganglion.','यहाँ चिकनी गांठ आमतौर पर गैंग्लियन होती है।')},
  {id:'finger_base',pair:true,view:'finger_base',name:L('Palm, at the base of the fingers','हथेली, उंगलियों की जड़ पर'),desc:L('The palm just below the fingers.','उंगलियों के ठीक नीचे की हथेली।'),rel:L('A tender lump here with a finger that clicks is trigger finger; a painless cord is Dupuytren’s.','यहाँ दर्द वाली गांठ और क्लिक करती उंगली ट्रिगर फिंगर है; बिना दर्द की डोरी ड्यूपुइट्रेन है।')},
  {id:'fingers',pair:true,view:'fingers',name:L('Finger joints','उंगलियों के जोड़'),desc:L('The middle and end joints of the fingers.','उंगलियों के बीच और आखिरी जोड़।'),rel:L('Bony knobs on the end and middle joints are typical of hand osteoarthritis; soft swelling of the knuckles and middle joints of both hands suggests rheumatoid arthritis.','आखिरी और बीच के जोड़ों पर हड्डी जैसी गांठें हाथ के ऑस्टियोआर्थराइटिस का खास लक्षण हैं; दोनों हाथों के नकल्स और बीच के जोड़ों की नरम सूजन रूमेटॉइड आर्थराइटिस का संकेत है।')},
  {id:'neck',pair:false,view:'neck',name:L('Neck','गर्दन'),desc:L('The back of the neck.','गर्दन का पिछला हिस्सा।'),rel:L('Arm and hand symptoms with neck pain may come from a pinched nerve in the neck.','गर्दन दर्द के साथ बांह और हाथ के लक्षण गर्दन की दबी नस से हो सकते हैं।')}
];
const TESTS = [
  {id:'cozen',name:L('Lift the wrist against resistance (Cozen test)','रुकावट के खिलाफ़ कलाई उठाना (कोज़ेन टेस्ट)'),
   steps:[L('Hold the painful arm out in front with the elbow straight and the palm facing down. Make a fist.','दर्द वाली बांह को कोहनी सीधी रखकर सामने करें, हथेली नीचे। मुट्ठी बनाएं।'),L('Bend the wrist up while your other hand presses down on the back of the fist to stop it moving.','कलाई ऊपर मोड़ें, जबकि दूसरा हाथ मुट्ठी के पीछे नीचे की ओर दबाकर उसे हिलने न दे।')],
   pos:L('It brings on your pain on the outer side of the elbow.','कोहनी के बाहरी हिस्से में आपका दर्द आ जाए।'),
   acc:L('This test picks up about 91% of tennis elbow, so a pain-free test makes it less likely; how often it is positive without tennis elbow has not been measured well.','यह टेस्ट लगभग 91% टेनिस एल्बो पकड़ता है, इसलिए बिना दर्द का टेस्ट इसकी संभावना कम करता है; टेनिस एल्बो के बिना यह कितनी बार पॉज़िटिव आता है, यह ठीक से मापा नहीं गया।'),src:'letdx',ans:[['cozen_pos','tPos','y'],['cozen_neg','tNeg','n'],['cozen_skip','tSkip','s']]},
  {id:'what',name:L('Bend the wrist and push the thumb out (WHAT test)','कलाई मोड़कर अंगूठा बाहर धकेलना (WHAT टेस्ट)'),
   steps:[L('Hold the painful arm out in front, palm facing down. Bend the wrist down as far as is comfortable, keeping the thumb straight and lifted away from the hand.','दर्द वाली बांह सामने करें, हथेली नीचे। कलाई जितना आराम से हो नीचे मोड़ें, अंगूठा सीधा और हाथ से दूर उठा रखें।'),L('Push the thumb further away from the hand while a finger of your other hand holds it back (the ring in the picture), for a few seconds.','कुछ सेकंड अंगूठे को हाथ से और दूर धकेलें, जबकि दूसरे हाथ की उंगली उसे रोके (तस्वीर में गोला)।')],
   pos:L('Pain on the thumb side of the wrist.','कलाई के अंगूठे वाले हिस्से में दर्द।'),
   acc:L('In one study this test was painful in 99% of people with de Quervain’s, so a pain-free test makes it very unlikely; it was also painful in many without it (specificity 29%).','एक अध्ययन में यह टेस्ट डी क्वेरवेन वाले 99% लोगों में दर्दनाक था, इसलिए बिना दर्द का टेस्ट इसकी संभावना बहुत कम करता है; यह बिना इस बीमारी वाले कई लोगों में भी दर्दनाक था (विशिष्टता 29%)।'),src:'goubau',ans:[['what_pos','tPos','y'],['what_neg','tNeg','n'],['what_skip','tSkip','s']]},
  {id:'elbflx',name:L('Bend the elbow fully for one minute','कोहनी एक मिनट पूरी मोड़कर रखना'),
   steps:[L('Sit or stand. Bend the painful elbow fully, bringing the hand towards the shoulder, with the wrist bent back.','बैठें या खड़े हों। दर्द वाली कोहनी पूरी मोड़ें, हाथ कंधे की ओर लाएं, कलाई पीछे मुड़ी रहे।'),L('Hold for up to 60 seconds and notice any tingling.','60 सेकंड तक रोकें और देखें कि झुनझुनी होती है या नहीं।')],
   pos:L('Tingling or numbness in the ring and little fingers.','अनामिका और छोटी उंगली में झुनझुनी या सुन्नपन।'),
   acc:L('Studies of this test vary widely (sensitivity 36–93%, specificity 40–99%), so it only adds a little to the other clues.','इस टेस्ट के अध्ययन बहुत अलग-अलग हैं (संवेदनशीलता 36–93%, विशिष्टता 40–99%), इसलिए यह बाकी संकेतों में थोड़ा ही जोड़ता है।'),src:'elbflex',ans:[['elbflx_pos','tPos','y'],['elbflx_neg','tNeg','n'],['elbflx_skip','tSkip','s']]}
];
const D = C.DEPTS;
D.medicine = D.medicine || {n:L('General medicine / Internal medicine','जनरल मेडिसिन / इंटरनल मेडिसिन'),s:L('Whole-body causes: blood tests, infections, diabetes, gout.','पूरे शरीर से जुड़े कारण: ब्लड टेस्ट, इन्फेक्शन, डायबिटीज़, गाउट।'),q:'physician'};
D.cardio = D.cardio || {n:L('Cardiology','कार्डियोलॉजी'),s:L('Heart specialist; heart pain can be felt in the neck, jaw, arm or back.','दिल के विशेषज्ञ; दिल का दर्द गर्दन, जबड़े, बांह या पीठ में भी महसूस हो सकता है।'),q:'cardiologist'};
D.handsurg = D.handsurg || {n:L('Hand surgery / Orthopaedics','हैंड सर्जरी / ऑर्थोपेडिक्स'),s:L('Nerve entrapment at the wrist or elbow and hand problems.','कलाई या कोहनी पर नस का दबना और हाथ की समस्याएं।'),q:'hand surgeon'};
const handAreas = ['elb_out','elb_in','elb_back','wrist_thumb','thumb_base','wrist_palm','wrist_back','finger_base','fingers'];
const CONDS = [
  {id:'latepi',th:[10,7,4],anchor:['elb_out'],depts:['physio','ortho'],
   name:L('Tennis elbow (lateral elbow tendinopathy)','टेनिस एल्बो (कोहनी के बाहर का टेंडन दर्द)'),sci:'Lateral elbow tendinopathy (lateral epicondylalgia)',
   what:L('The tendon that lifts the wrist and fingers is overloaded where it attaches to the bony bump on the outer elbow. It hurts to grip, lift a cup or kettle, shake hands or turn a key, and the bump is tender. Despite the name, most people with it do not play tennis.','कलाई और उंगलियों को उठाने वाला टेंडन कोहनी के बाहर की हड्डी के उभार पर जहाँ जुड़ता है, वहाँ ज़्यादा भार से दुखने लगता है। पकड़ने, कप या केतली उठाने, हाथ मिलाने या चाबी घुमाने पर दर्द होता है, और उभार दबाने पर दुखता है। नाम के बावजूद, ज़्यादातर लोग टेनिस नहीं खेलते।'),
   causes:L('About 1.3% of adults have it at any time, most often at 45–54; forceful, repeated work (tools, construction, cooking) and smoking raise the risk.','किसी भी समय लगभग 1.3% वयस्कों को होता है, ज़्यादातर 45–54 साल में; ज़ोर वाला, बार-बार का काम (औज़ार, निर्माण, खाना बनाना) और धूम्रपान खतरा बढ़ाते हैं।'),cSrc:['shiri06'],
   confirm:L('Examination: tenderness on the outer bump and pain on lifting the wrist against resistance (Cozen test, picks up about 91%). Scans are not needed in a typical case.','जांच: बाहर के उभार पर दबाने से दर्द और रुकावट के खिलाफ़ कलाई उठाने पर दर्द (कोज़ेन टेस्ट, लगभग 91% पकड़ता है)। सामान्य मामले में स्कैन ज़रूरी नहीं।'),cSrc:['letdx'],
   treat:L('Reducing painful gripping, a forearm strap, and a graded strengthening programme with a physiotherapist. Steroid injections are best avoided: in a trial, fewer people had recovered at a year after a steroid injection (83%) than after a dummy injection (96%), and more relapsed (54% vs 12%).','दर्द वाली पकड़ कम करना, अग्रबाहु की पट्टी, और फिज़ियोथेरेपिस्ट के साथ धीरे-धीरे बढ़ता मज़बूती का कार्यक्रम। स्टेरॉयड इंजेक्शन से बचना बेहतर है: एक ट्रायल में स्टेरॉयड इंजेक्शन के बाद एक साल में कम लोग ठीक हुए (83%) बनाम नकली इंजेक्शन (96%), और ज़्यादा लोगों में दर्द लौटा (54% बनाम 12%)।'),
   outlook:L('It usually settles on its own: about 83% are better by 6 months and 90% by a year.','आमतौर पर अपने आप ठीक होता है: लगभग 83% छह महीने में और 90% एक साल में बेहतर हो जाते हैं।'),oSrc:['bisset','coombes13'],
   w:{elb_out:4,ch_grip_pain:2,cozen_pos:2,cozen_neg:-2,on_overuse:2,o_repetitive:2,w_wrist_use:1,a_40_49:2,a_50_59:1,a_30_39:1,on_gradual:1,
      elb_in:-2,ch_numb_ulnar:-1,ch_elbow_swell:-2,ch_neck_arm:-2,a_u18:-3,a_18_29:-1,on_fall:-1}},
  {id:'medepi',th:[10,7,4],anchor:['elb_in'],depts:['physio','ortho'],
   name:L('Golfer’s elbow (medial elbow tendinopathy)','गोल्फ़र्स एल्बो (कोहनी के अंदर का टेंडन दर्द)'),sci:'Medial elbow tendinopathy (medial epicondylalgia)',
   what:L('The tendon that bends the wrist and fingers is overloaded where it attaches to the bony bump on the inner elbow. It hurts to grip, carry and twist. The ulnar nerve runs just behind, so tingling in the little finger can come with it.','कलाई और उंगलियों को मोड़ने वाला टेंडन कोहनी के अंदर की हड्डी के उभार पर जहाँ जुड़ता है, वहाँ ज़्यादा भार से दुखने लगता है। पकड़ने, उठाकर ले जाने और मोड़ने पर दर्द होता है। अल्नर नस ठीक पीछे से गुज़रती है, इसलिए छोटी उंगली में झुनझुनी भी हो सकती है।'),
   causes:L('Less common than tennis elbow (about 0.4% of adults); linked to forceful, repeated work and to being overweight.','टेनिस एल्बो से कम आम (लगभग 0.4% वयस्क); ज़ोर वाले, बार-बार के काम और ज़्यादा वज़न से जुड़ा।'),cSrc:['shiri06'],
   confirm:L('Examination: tenderness on the inner bump and pain on bending the wrist against resistance; the ulnar nerve is checked too.','जांच: अंदर के उभार पर दबाने से दर्द और रुकावट के खिलाफ़ कलाई मोड़ने पर दर्द; अल्नर नस भी जांची जाती है।'),
   treat:L('Load modification and a graded strengthening programme with a physiotherapist.','भार में बदलाव और फिज़ियोथेरेपिस्ट के साथ धीरे-धीरे बढ़ता मज़बूती का कार्यक्रम।'),
   outlook:L('Usually settles over months with load management and exercise.','आमतौर पर भार संभालने और व्यायाम से कुछ महीनों में ठीक।'),
   w:{elb_in:4,ch_grip_pain:2,on_overuse:2,o_repetitive:2,w_wrist_use:1,a_40_49:2,a_50_59:1,a_30_39:1,o_overweight:1,on_gradual:1,
      elb_out:-2,ch_elbow_swell:-2,ch_neck_arm:-2,a_u18:-2,on_fall:-1}},
  {id:'bursitis',th:[8,6,4],anchor:['ch_elbow_swell'],depts:['ortho','gp'],
   name:L('Elbow bursitis (olecranon bursitis)','कोहनी की बर्साइटिस (ओलेक्रेनन बर्साइटिस)'),sci:'Olecranon bursitis',
   what:L('A small fluid sac over the point of the elbow fills with fluid after leaning on the elbow or a knock, making a soft, egg-like swelling. About one in three is infected, especially after a graze or cut, when it becomes hot, red and tender.','कोहनी की नोक के ऊपर की छोटी तरल थैली कोहनी पर टेक लगाने या चोट के बाद भर जाती है, जिससे नरम, अंडे जैसी सूजन बनती है। लगभग तीन में से एक में इन्फेक्शन होता है, खासकर खरोंच या कटने के बाद, तब यह गर्म, लाल और दर्दनाक हो जाती है।'),
   causes:L('Leaning on the elbow (desk work, driving), a fall or knock, gout and rheumatoid arthritis.','कोहनी पर टेक लगाना (डेस्क का काम, गाड़ी चलाना), गिरना या चोट, गाउट और रूमेटॉइड आर्थराइटिस।'),cSrc:['olecranon'],
   confirm:L('Examination; if infection is possible the fluid is drawn off and tested.','जांच; इन्फेक्शन की आशंका हो तो तरल निकालकर जांचा जाता है।'),
   treat:L('Non-infected: rest, a pad, avoiding leaning on it; 65–85% settle within 4 weeks. Infected: antibiotics, sometimes surgery.','बिना इन्फेक्शन: आराम, पैड, टेक लगाने से बचना; 65–85% चार हफ्तों में ठीक। इन्फेक्शन: एंटीबायोटिक, कभी-कभी सर्जरी।'),
   outlook:L('Usually settles; see a doctor the same day if it becomes hot, red or you feel unwell.','आमतौर पर ठीक हो जाता है; गर्म, लाल हो या तबियत खराब लगे तो उसी दिन डॉक्टर को दिखाएं।'),oSrc:['olecranon'],
   w:{ch_elbow_swell:5,elb_back:3,w_lean_elbow:2,on_blow:1,on_fall:1,ch_grip_pain:-1,elb_in:-1,ch_numb_ulnar:-1}},
  {id:'cubital',th:[8,6,4],anchor:['ch_elbow_bend','ch_numb_ulnar'],depts:['handsurg','neuro'],
   name:L('Ulnar nerve pressed at the elbow (cubital tunnel syndrome)','कोहनी पर अल्नर नस दबना (क्यूबिटल टनल सिंड्रोम)'),sci:'Ulnar nerve entrapment at the elbow',
   what:L('The ulnar nerve (the “funny bone” nerve) is squeezed or stretched behind the inner elbow, causing tingling and numbness in the ring and little fingers, worse when the elbow stays bent. Later the hand can become weak and clumsy.','अल्नर नस (“फ़नी बोन” वाली नस) कोहनी के अंदर पीछे दबती या खिंचती है, जिससे अनामिका और छोटी उंगली में झुनझुनी और सुन्नपन होता है, कोहनी मुड़ी रहने पर ज़्यादा। बाद में हाथ कमज़ोर और अनाड़ी हो सकता है।'),
   causes:L('Long periods with the elbow bent (phone calls, sleeping with the arm bent), leaning on the elbow, old elbow fractures and arthritis. It is the second most common nerve entrapment of the arm after carpal tunnel.','कोहनी देर तक मोड़े रखना (फ़ोन पर बात, मुड़ी बांह के साथ सोना), कोहनी पर टेक लगाना, कोहनी के पुराने फ्रैक्चर और गठिया। कार्पल टनल के बाद यह बांह में नस दबने का दूसरा सबसे आम कारण है।'),
   confirm:L('Examination of feeling and the small hand muscles, and nerve conduction studies; the elbow flexion test varies widely in accuracy.','संवेदना और हाथ की छोटी मांसपेशियों की जांच, और नर्व कंडक्शन स्टडी; कोहनी मोड़ने वाले टेस्ट की सटीकता बहुत अलग-अलग है।'),cSrc:['elbflex'],
   treat:L('Avoiding long elbow bending and leaning on the elbow, a night splint or towel wrapped around the elbow; surgery if weakness or wasting develops.','कोहनी देर तक मोड़ने और टेक लगाने से बचना, रात को स्प्लिंट या कोहनी पर लिपटा तौलिया; कमज़ोरी या मांसपेशी घटे तो सर्जरी।'),
   outlook:L('Mild cases often improve with these changes; weakness needs prompt review.','हल्के मामले अक्सर इन बदलावों से सुधरते हैं; कमज़ोरी हो तो जल्दी दिखाएं।'),
   w:{ch_elbow_bend:4,ch_numb_ulnar:3,elbflx_pos:2,elbflx_neg:-1,elb_in:2,w_lean_elbow:1,ch_weak_grip:1,
      ch_numb_median:-2,ch_night_hand:-1,ch_neck_arm:-2,elb_out:-1}},
  {id:'cts',th:[8,6,4],anchor:['ch_night_hand','ch_numb_median'],depts:['handsurg','neuro'],
   name:L('Carpal tunnel syndrome (nerve pressed at the wrist)','कार्पल टनल सिंड्रोम (कलाई पर नस दबना)'),sci:'Median nerve entrapment at the wrist',
   what:L('The median nerve is squeezed in a tight tunnel at the front of the wrist, causing tingling and numbness in the thumb, index and middle fingers, typically waking you at night and eased by shaking the hand. Later the hand may feel clumsy and the thumb muscles can waste.','मीडियन नस कलाई के आगे एक तंग सुरंग में दबती है, जिससे अंगूठे, तर्जनी और बीच की उंगली में झुनझुनी और सुन्नपन होता है, खासकर रात को नींद से जगाता है और हाथ झटकने से कम होता है। बाद में हाथ अनाड़ी लग सकता है और अंगूठे की मांसपेशियाँ घट सकती हैं।'),
   causes:L('Pregnancy, diabetes, an underactive thyroid, rheumatoid arthritis, wrist fractures and repeated wrist use.','गर्भावस्था, डायबिटीज़, कम थायरॉइड, रूमेटॉइड आर्थराइटिस, कलाई के फ्रैक्चर और कलाई का बार-बार उपयोग।'),
   confirm:L('Examination and nerve conduction studies. Of the bedside clues, waking at night and shaking the hand to relieve it (flick sign) was the strongest in one study (about 21 times more likely); Phalen and Tinel tests add little.','जांच और नर्व कंडक्शन स्टडी। बेडसाइड संकेतों में रात को जागकर हाथ झटकने से आराम (फ्लिक साइन) एक अध्ययन में सबसे मज़बूत था (लगभग 21 गुना ज़्यादा संभावना); फ़ेलन और टिनेल टेस्ट थोड़ा ही जोड़ते हैं।'),cSrc:['darcy'],
   treat:L('A night wrist splint, activity changes, a steroid injection; release surgery if severe or if the muscles are wasting.','रात में कलाई की स्प्लिंट, गतिविधि बदलाव, स्टेरॉयड इंजेक्शन; गंभीर हो या मांसपेशियाँ घट रही हों तो रिलीज़ सर्जरी।'),
   outlook:L('Very treatable; in pregnancy it often settles after delivery; early treatment prevents muscle wasting.','अच्छा इलाज संभव; गर्भावस्था में अक्सर डिलीवरी के बाद ठीक हो जाता है; जल्दी इलाज मांसपेशी घटने से बचाता है।'),
   w:{ch_night_hand:5,ch_numb_median:2,wrist_palm:1,o_new_mother:1,r_immune:1,o_thyroid:1,ch_weak_grip:1,w_wrist_use:1,hand_both:1,
      ch_numb_ulnar:-2,ch_elbow_bend:-2,ch_neck_arm:-2,neck:-1}},
  {id:'dequervain',th:[9,6,4],anchor:['wrist_thumb','what_pos'],depts:['handsurg','physio'],
   name:L('De Quervain’s tenosynovitis (thumb-side wrist tendon pain)','डी क्वेरवेन टेनोसाइनोवाइटिस (कलाई के अंगूठे वाली तरफ़ टेंडन का दर्द)'),sci:'De Quervain tenosynovitis',
   what:L('The two tendons that move the thumb outwards rub in their tight tunnel on the thumb side of the wrist. Gripping, lifting a baby, pouring and twisting hurt there, sometimes with swelling.','अंगूठे को बाहर ले जाने वाले दो टेंडन कलाई के अंगूठे वाली तरफ़ अपनी तंग सुरंग में रगड़ खाते हैं। पकड़ने, बच्चे को उठाने, उड़ेलने और मोड़ने पर वहाँ दर्द होता है, कभी सूजन के साथ।'),
   causes:L('More common in women (1.3% vs 0.5% of men), at 40–60, in late pregnancy and in new mothers lifting a baby (“mummy’s wrist”), and with repeated thumb use.','महिलाओं में ज़्यादा (1.3% बनाम पुरुषों में 0.5%), 40–60 साल में, गर्भावस्था के आखिरी महीनों में और बच्चे को उठाने वाली नई माताओं में (“मम्मी रिस्ट”), और अंगूठे के बार-बार इस्तेमाल से।'),cSrc:['dqstat'],
   confirm:L('Examination: pain on the thumb-side wrist tendons with the WHAT or Finkelstein test. A pain-free WHAT test makes it very unlikely (it was painful in 99% of people with it).','जांच: WHAT या फ़िंकलस्टीन टेस्ट में कलाई के अंगूठे वाले टेंडन पर दर्द। बिना दर्द का WHAT टेस्ट इसकी संभावना बहुत कम करता है (इस बीमारी वाले 99% लोगों में दर्दनाक था)।'),cSrc:['goubau'],
   treat:L('A thumb splint, changing how you lift (scoop the baby with both palms), and a steroid injection, which gives near-complete relief in 52–90% after one or two injections; surgery if it persists.','अंगूठे की स्प्लिंट, उठाने का तरीका बदलना (बच्चे को दोनों हथेलियों से उठाना), और स्टेरॉयड इंजेक्शन, जिससे एक या दो इंजेक्शन के बाद 52–90% को लगभग पूरी राहत मिलती है; बना रहे तो सर्जरी।'),
   outlook:L('Most improve without surgery; in new mothers it often settles as the baby grows.','ज़्यादातर बिना सर्जरी सुधरते हैं; नई माताओं में बच्चा बड़ा होने के साथ अक्सर ठीक हो जाता है।'),oSrc:['dqstat'],
   w:{wrist_thumb:4,w_lift_baby:3,o_new_mother:2,what_pos:1,what_neg:-5,sex_f:2,a_30_39:1,a_40_49:1,a_50_59:1,thumb_base:1,on_overuse:1,
      ch_bony_fingers:-1,fingers:-1,ch_night_hand:-1,on_fall:-2,rf_snuffbox:-2}},
  {id:'trigger',th:[8,6,4],anchor:['ch_click_finger'],depts:['handsurg','ortho'],
   name:L('Trigger finger','ट्रिगर फिंगर'),sci:'Stenosing tenosynovitis of the flexor tendon',
   what:L('A thickened bend in the tendon catches on a tight band at the base of the finger, so the finger clicks, sticks bent and then snaps straight, often worse in the morning, with a tender lump in the palm.','टेंडन का मोटा हिस्सा उंगली की जड़ पर एक तंग पट्टी में अटकता है, जिससे उंगली क्लिक करती है, मुड़ी फंस जाती है और फिर झटके से सीधी होती है, अक्सर सुबह ज़्यादा, हथेली में दर्द वाली गांठ के साथ।'),
   causes:L('Affects 2–3% of people and about 10% of people with diabetes; more common in women and after 50.','2–3% लोगों को और डायबिटीज़ वाले लगभग 10% लोगों को होता है; महिलाओं में और 50 के बाद ज़्यादा।'),cSrc:['trigger'],
   confirm:L('Examination; no scans needed.','जांच; स्कैन की ज़रूरत नहीं।'),
   treat:L('A night splint keeping the knuckle straight; a steroid injection works for 60–80% at a year; a small operation to release the band if it keeps returning.','नकल सीधा रखने वाली रात की स्प्लिंट; स्टेरॉयड इंजेक्शन से एक साल में 60–80% को फ़ायदा; बार-बार लौटे तो पट्टी खोलने का छोटा ऑपरेशन।'),
   outlook:L('Very treatable; results of the operation are very good.','अच्छा इलाज संभव; ऑपरेशन के नतीजे बहुत अच्छे हैं।'),oSrc:['trigger'],
   w:{ch_click_finger:5,finger_base:3,r_immune:2,sex_f:1,a_40_49:1,a_50_59:1,a_60p:1,ch_stiff_short:1,
      a_u18:-2,a_18_29:-2,ch_numb_median:-1,ch_swell_knuckles:-1}},
  {id:'handoa',th:[10,7,4],anchor:['ch_bony_fingers','thumb_base','w_pinch'],depts:['ortho','rheum','physio'],
   name:L('Hand and thumb-base osteoarthritis','हाथ और अंगूठे की जड़ का ऑस्टियोआर्थराइटिस'),sci:'Hand osteoarthritis (nodal interphalangeal and thumb carpometacarpal)',
   what:L('Wear of the small finger joints causes hard, bony knobs on the end joints (Heberden’s nodes) and middle joints (Bouchard’s nodes), aching and brief stiffness; at the base of the thumb it makes pinching, opening jars and turning keys painful.','उंगलियों के छोटे जोड़ों की घिसावट से आखिरी जोड़ों (हेबर्डन नोड्स) और बीच के जोड़ों (बूशार्ड नोड्स) पर सख्त, हड्डी जैसी गांठें, दर्द और थोड़ी देर की जकड़न होती है; अंगूठे की जड़ में यह चुटकी से पकड़ना, जार खोलना और चाबी घुमाना दर्दनाक बनाता है।'),
   causes:L('Age over 40, female sex and family history; symptomatic hand osteoarthritis affects about 15% of adults, most often women over 50.','40 से ज़्यादा उम्र, महिला होना और पारिवारिक इतिहास; दर्द वाला हाथ का ऑस्टियोआर्थराइटिस लगभग 15% वयस्कों को होता है, ज़्यादातर 50 से ऊपर की महिलाओं को।'),cSrc:['handoaprev'],
   confirm:L('Examination of the hand joints (classification criteria based on bony enlargement of typical joints are 92% sensitive and 98% specific); an X-ray if the picture is unusual.','हाथ के जोड़ों की जांच (खास जोड़ों के हड्डी जैसे बढ़ने पर आधारित मापदंड 92% संवेदनशील और 98% विशिष्ट हैं); तस्वीर असामान्य हो तो एक्स-रे।'),cSrc:['acrhand'],
   treat:L('Hand exercises, a thumb splint for thumb-base pain, joint-protection tips and aids (jar openers, thicker pens), topical anti-inflammatory gel; surgery for a badly affected thumb base.','हाथ के व्यायाम, अंगूठे की जड़ के दर्द के लिए अंगूठे की स्प्लिंट, जोड़ बचाने के तरीके और साधन (जार खोलने वाला, मोटा पेन), लगाने वाला सूजन-रोधी जेल; अंगूठे की जड़ बहुत खराब हो तो सर्जरी।'),
   outlook:L('Flares come and go; pain often settles over years as the nodes form.','दर्द के दौर आते-जाते हैं; गांठें बनने के साथ सालों में दर्द अक्सर कम हो जाता है।'),
   w:{ch_bony_fingers:4,fingers:2,thumb_base:2,w_pinch:2,ch_stiff_short:1,a_60p:3,a_50_59:2,a_40_49:1,sex_f:1,hand_both:1,on_gradual:2,h_1_5y:1,h_5y:2,
      a_u18:-4,a_18_29:-3,a_30_39:-2,ch_stiff_long:-2,ch_swell_knuckles:-2,on_fall:-2}},
  {id:'ra',th:[9,6,4],anchor:['ch_swell_knuckles','ch_stiff_long'],depts:['rheum','medicine'],
   name:L('Rheumatoid or other inflammatory arthritis','रूमेटॉइड या दूसरी सूजन वाली गठिया'),sci:'Rheumatoid arthritis / inflammatory polyarthritis',
   what:L('The immune system inflames the joint linings, typically the knuckles and middle finger joints and the wrists of both hands, with soft, warm swelling and morning stiffness lasting more than 30 minutes, sometimes with tiredness.','इम्यून सिस्टम जोड़ों की झिल्लियों में सूजन लाता है, आमतौर पर दोनों हाथों के नकल्स, उंगलियों के बीच के जोड़ और कलाई में, नरम, गर्म सूजन और 30 मिनट से ज़्यादा सुबह की जकड़न के साथ, कभी थकान के साथ।'),
   causes:L('Rheumatoid arthritis affects about 0.75% of Indian adults (around 7 million people), women more than men; psoriasis can cause a similar arthritis.','रूमेटॉइड आर्थराइटिस लगभग 0.75% भारतीय वयस्कों (करीब 70 लाख लोगों) को होता है, पुरुषों से ज़्यादा महिलाओं को; सोरायसिस से भी ऐसी गठिया हो सकती है।'),cSrc:['malaviya'],
   confirm:L('Examination of the joints and blood tests (rheumatoid factor, anti-CCP, ESR/CRP) by a rheumatologist. NICE advises referral within 3 working days for persistent swelling of the small joints of the hands or feet.','रूमेटोलॉजिस्ट द्वारा जोड़ों की जांच और ब्लड टेस्ट (रूमेटॉइड फ़ैक्टर, एंटी-CCP, ESR/CRP)। NICE हाथों या पैरों के छोटे जोड़ों की बनी रहने वाली सूजन में 3 कामकाजी दिनों के अंदर रेफ़रल की सलाह देता है।'),cSrc:['niceraqs'],
   treat:L('Early disease-modifying medicines (such as methotrexate) protect the joints; exercise and hand therapy help.','जल्दी शुरू की गई बीमारी नियंत्रित करने वाली दवाएं (जैसे मेथोट्रेक्सेट) जोड़ों को बचाती हैं; व्यायाम और हैंड थेरेपी मदद करते हैं।'),
   outlook:L('Treated early, most people keep good hand function; delay can lead to permanent joint damage.','जल्दी इलाज से ज़्यादातर लोगों के हाथ अच्छा काम करते रहते हैं; देरी से जोड़ों को स्थायी नुकसान हो सकता है।'),oSrc:['niceraqs'],
   w:{ch_swell_knuckles:4,ch_stiff_long:3,hand_both:2,o_other_joints:2,r_spa:1,sex_f:1,a_30_39:1,a_40_49:1,a_50_59:1,fingers:1,wrist_back:1,
      ch_bony_fingers:-1,ch_stiff_short:-2,on_overuse:-1,on_fall:-2,ch_click_finger:-1}},
  {id:'ganglion',th:[8,6,4],anchor:['ch_lump_wrist'],depts:['handsurg','ortho'],
   name:L('Ganglion cyst','गैंग्लियन सिस्ट'),sci:'Ganglion cyst',
   what:L('A smooth, jelly-filled lump that grows from a joint or tendon sheath, most often on the back of the wrist (60–70%), also on the palm side of the wrist or at the base of a finger. It may change size and can ache with wrist use.','जेली से भरी चिकनी गांठ जो किसी जोड़ या टेंडन की झिल्ली से निकलती है, ज़्यादातर कलाई के पीछे (60–70%), कलाई के हथेली वाले हिस्से या उंगली की जड़ पर भी। इसका आकार बदल सकता है और कलाई के इस्तेमाल पर दर्द हो सकता है।'),
   causes:L('Usually no clear cause; common in young and middle-aged adults.','आमतौर पर कोई साफ़ वजह नहीं; युवा और अधेड़ वयस्कों में आम।'),cSrc:['ganglion'],
   confirm:L('Examination (it is smooth and lets light through); ultrasound if unclear.','जांच (यह चिकनी होती है और रोशनी आर-पार जाने देती है); साफ़ न हो तो अल्ट्रासाउंड।'),
   treat:L('Often just watching: up to half go away on their own. Draining with a needle works in 30–50%; surgery if it is painful or keeps coming back. Do not hit it with a book (“Bible cyst”).','अक्सर बस नज़र रखना: लगभग आधी अपने आप चली जाती हैं। सुई से निकालना 30–50% में काम करता है; दर्द हो या बार-बार लौटे तो सर्जरी। इसे किताब से न मारें।'),
   outlook:L('Harmless; many disappear within a couple of years.','हानिरहित; कई कुछ सालों में गायब हो जाती हैं।'),oSrc:['ganglion'],
   w:{ch_lump_wrist:5,wrist_back:2,wrist_palm:1,finger_base:1,sex_f:1,a_18_29:1,a_30_39:1,
      ch_bony_fingers:-1,ch_swell_knuckles:-2,a_60p:-1,ch_palm_cord:-2}},
  {id:'dupuytren',th:[8,6,4],anchor:['ch_palm_cord','ch_tabletop'],depts:['handsurg'],
   name:L('Dupuytren’s contracture','ड्यूपुइट्रेन कॉन्ट्रैक्चर'),sci:'Dupuytren disease',
   what:L('The tissue under the skin of the palm thickens into lumps and cords that slowly pull one or more fingers, most often the ring finger, into a bent position. It is usually painless.','हथेली की त्वचा के नीचे का ऊतक मोटा होकर गांठ और डोरी बन जाता है, जो धीरे-धीरे एक या ज़्यादा उंगलियों को, ज़्यादातर अनामिका को, मोड़ देती है। आमतौर पर बिना दर्द।'),
   causes:L('Men over 40–50, family history, diabetes, alcohol and smoking.','40–50 से ऊपर के पुरुष, पारिवारिक इतिहास, डायबिटीज़, शराब और धूम्रपान।'),cSrc:['dupuytren'],
   confirm:L('Examination. Being unable to lay the palm flat on a table (table-top test) is a reason to see a hand surgeon.','जांच। हथेली मेज़ पर सपाट न रख पाना (टेबल-टॉप टेस्ट) हैंड सर्जन को दिखाने की वजह है।'),
   treat:L('Watching while the hand works well; a hand surgeon considers needle release or surgery once the knuckle bends about 30° or a middle finger joint bends at all.','हाथ ठीक काम करे तब तक नज़र रखना; नकल लगभग 30° मुड़ जाए या उंगली का बीच का जोड़ ज़रा भी मुड़े, तो हैंड सर्जन सुई से रिलीज़ या सर्जरी पर विचार करते हैं।'),
   outlook:L('It progresses slowly; treatment straightens the finger but it can come back.','धीरे-धीरे बढ़ता है; इलाज से उंगली सीधी होती है पर यह लौट सकता है।'),oSrc:['dupuytren'],
   w:{ch_palm_cord:5,ch_tabletop:2,finger_base:2,sex_m:2,a_50_59:1,a_60p:2,r_immune:1,hand_both:1,
      a_u18:-3,a_18_29:-3,ch_numb_median:-1,ch_swell_knuckles:-1,ch_lump_wrist:-1}},
  {id:'scaphoid',th:[8,6,4],anchor:['rf_snuffbox'],depts:['ortho','emergency'],
   name:L('Possible scaphoid (wrist bone) fracture','स्कैफ़ॉइड (कलाई की हड्डी) फ्रैक्चर की आशंका'),sci:'Scaphoid fracture',
   what:L('The scaphoid is a small wrist bone at the base of the thumb that breaks with a fall on an outstretched hand. The wrist may look normal, with pain in the hollow at the base of the thumb. Up to 25% do not show on the first X-ray, and a missed fracture can fail to heal.','स्कैफ़ॉइड अंगूठे की जड़ पर कलाई की एक छोटी हड्डी है जो फैले हुए हाथ के बल गिरने से टूटती है। कलाई सामान्य दिख सकती है, अंगूठे की जड़ के गड्ढे में दर्द के साथ। 25% तक पहले एक्स-रे में नहीं दिखते, और छूटा फ्रैक्चर भर न पाए ऐसा हो सकता है।'),
   causes:L('Falls, sport and road accidents in young adults (average age 29); 60–70% of wrist-bone fractures are scaphoid fractures.','युवाओं (औसत उम्र 29) में गिरना, खेल और सड़क दुर्घटनाएं; कलाई की हड्डियों के 60–70% फ्रैक्चर स्कैफ़ॉइड के होते हैं।'),cSrc:['scaphoid'],
   confirm:L('X-rays with special scaphoid views; if they are normal but it still hurts, a splint and a repeat X-ray or an MRI.','स्कैफ़ॉइड के खास व्यू वाले एक्स-रे; सामान्य हों पर दर्द बना रहे तो स्प्लिंट और दोबारा एक्स-रे या MRI।'),
   treat:L('A splint or cast; surgery for displaced fractures. A diagnosis delayed beyond 4 weeks makes non-union almost 10 times more likely.','स्प्लिंट या प्लास्टर; खिसके फ्रैक्चर में सर्जरी। 4 हफ्ते से ज़्यादा देर से पहचान होने पर हड्डी न जुड़ने की संभावना लगभग 10 गुना हो जाती है।'),
   outlook:L('Most heal well when found and protected early.','जल्दी पकड़कर सुरक्षित रखने पर ज़्यादातर अच्छी तरह भर जाते हैं।'),oSrc:['scaphoid'],
   w:{rf_snuffbox:5,on_fall:3,wrist_thumb:2,a_18_29:2,a_30_39:1,a_u18:1,sex_m:1,on_accident:1,on_gradual:-3,a_60p:-1,ch_bony_fingers:-2}},
  {id:'neckref',th:[8,6,4],anchor:['neck','ch_neck_arm'],depts:['ortho_spine','physio'],
   name:L('Pain or tingling coming from the neck','गर्दन से आने वाला दर्द या झुनझुनी'),sci:'Cervical radiculopathy (referred arm symptoms)',
   what:L('A pinched nerve root in the neck can cause pain, tingling or weakness in the arm and hand that mimics elbow or wrist problems. The neck section of this guide checks this in detail.','गर्दन में दबी नस की जड़ बांह और हाथ में दर्द, झुनझुनी या कमज़ोरी पैदा कर सकती है, जो कोहनी या कलाई की समस्या जैसी लगती है। इस गाइड का गर्दन वाला भाग इसे विस्तार से जांचता है।'),
   causes:L('Disc bulges and wear in the neck (cervical spondylosis).','गर्दन में डिस्क का उभार और घिसावट (सर्वाइकल स्पॉन्डिलोसिस)।'),
   confirm:L('Examination of the neck, nerves and reflexes; an MRI if there is weakness or it does not settle.','गर्दन, नसों और रिफ़्लेक्स की जांच; कमज़ोरी हो या ठीक न हो तो MRI।'),
   treat:L('Staying active, physiotherapy and pain relief; urgent review for worsening weakness.','सक्रिय रहना, फिज़ियोथेरेपी और दर्द की दवा; कमज़ोरी बढ़े तो तुरंत दिखाएं।'),
   outlook:L('Most improve within weeks to a few months.','ज़्यादातर कुछ हफ्तों से कुछ महीनों में सुधरते हैं।'),
   w:{neck:3,ch_neck_arm:4,ch_weak_grip:1,ch_numb_median:0,elb_out:-1,ch_night_hand:-1,ch_elbow_bend:-1,ch_click_finger:-2,ch_lump_wrist:-2}}
];
const EMERG = {
  fracture:{name:L('Possible broken bone or dislocation','हड्डी टूटने या जोड़ उतरने की आशंका'),sci:'Elbow or wrist fracture / dislocation',
    what:L('A deformed or quickly swollen elbow or wrist after a fall or injury, or an elbow that cannot be straightened fully, needs an X-ray today. Adults who can fully straighten the elbow have only a 1.6% chance of a fracture (the test misses 3%); in children it is less reliable. Support the arm and go to the emergency department.','गिरने या चोट के बाद टेढ़ी या तेज़ी से सूजी कोहनी या कलाई, या कोहनी जो पूरी सीधी न हो, उसका आज ही एक्स-रे ज़रूरी है। जो वयस्क कोहनी पूरी सीधी कर पाते हैं उनमें फ्रैक्चर की संभावना सिर्फ़ 1.6% है (टेस्ट 3% छोड़ता है); बच्चों में यह कम भरोसेमंद है। बांह को सहारा दें और इमरजेंसी जाएं।'),src:['elbext'],depts:['emergency','ortho']},
  handinf:{name:L('Possible serious hand infection','हाथ के गंभीर इन्फेक्शन की आशंका'),sci:'Flexor sheath infection / deep hand infection',
    what:L('A swollen finger held bent, very painful to straighten and tender along its length, especially after a cut or bite, can be an infection of the tendon sheath, a surgical emergency that can destroy the finger. Fever is often absent (17%). Go to the emergency department today and keep the hand raised.','सूजी उंगली जो मुड़ी रहती है, सीधा करने पर बहुत दर्द करती है और पूरी लंबाई में दबाने पर दुखती है, खासकर कटने या काटने के बाद, टेंडन की झिल्ली का इन्फेक्शन हो सकती है — सर्जरी वाली इमरजेंसी जो उंगली खराब कर सकती है। बुखार अक्सर नहीं होता (17%)। आज ही इमरजेंसी जाएं और हाथ ऊपर रखें।'),src:['kanavel'],depts:['emergency','handsurg']},
  septic:{name:L('Possible infected joint or bursa','जोड़ या बर्सा में इन्फेक्शन की आशंका'),sci:'Septic arthritis / septic bursitis',
    what:L('A hot, red, swollen elbow or wrist, or a hot swelling on the point of the elbow, with fever, may be infected and needs treatment today; fluid is drawn off before antibiotics where possible.','बुखार के साथ गर्म, लाल, सूजी कोहनी या कलाई, या कोहनी की नोक पर गर्म सूजन में इन्फेक्शन हो सकता है और आज ही इलाज चाहिए; जहाँ संभव हो, एंटीबायोटिक से पहले तरल निकाला जाता है।'),src:['hotjoint','olecranon'],depts:['emergency','ortho']},
  cardiac:{name:L('Possible heart attack','दिल के दौरे की आशंका'),sci:'Acute coronary syndrome',
    what:L('Heart pain can be felt in the arm, elbow or wrist, with chest pressure, sweating or breathlessness. Call 108 now; do not wait.','दिल का दर्द बांह, कोहनी या कलाई में भी महसूस हो सकता है, साथ में सीने में दबाव, पसीना या सांस फूलना। अभी 108 बुलाएं; इंतज़ार न करें।'),src:['aha'],depts:['emergency','cardio']}
};
const RS = {
  o_snuffbox:L('Pain at the base of the thumb after a fall: X-ray and splint within a day','गिरने के बाद अंगूठे की जड़ में दर्द: एक दिन के अंदर एक्स-रे और स्प्लिंट'),
  o_weak:L('Worsening weakness or wasting of the hand muscles','हाथ की मांसपेशियों में बढ़ती कमज़ोरी या घटना'),
  o_fever:L('Fever, night sweats or weight loss with arm or hand pain','बांह या हाथ के दर्द के साथ बुखार, रात को पसीना या वज़न घटना'),
  o_night:L('Constant night pain at age 50 or over, or with past cancer','50 या ज़्यादा उम्र में, या पहले कैंसर के साथ रात का लगातार दर्द'),
  o_pain:L('Very severe pain (9–10 out of 10)','बहुत तेज़ दर्द (10 में 9–10)'),
  y_injury:L('Started with a fall, injury or accident','गिरने, चोट या दुर्घटना से शुरू'),
  y_ra:L('Soft swelling of small hand joints with long morning stiffness: NICE advises a rheumatology referral within 3 working days','हाथ के छोटे जोड़ों की नरम सूजन और सुबह की लंबी जकड़न: NICE 3 कामकाजी दिनों में रूमेटोलॉजी रेफ़रल की सलाह देता है'),
  y_nerve:L('Weak or clumsy hand: a pressed nerve should be checked','कमज़ोर या अनाड़ी हाथ: दबी नस की जांच ज़रूरी'),
  y_bursa:L('A swelling on the point of the elbow: about one in three is infected, so have it checked','कोहनी की नोक पर सूजन: लगभग तीन में से एक में इन्फेक्शन होता है, इसलिए जांच करवाएं'),
  y_long:L('This bout has lasted more than 6 weeks','इस बार का दर्द 6 हफ्ते से ज़्यादा से है'), y_pain:L('Strong pain (7–8 out of 10)','तेज़ दर्द (10 में 7–8)'), y_sleep:L('Pain or tingling disturbing sleep','दर्द या झुनझुनी से नींद खराब'),
  y_func:L('Cannot grip or lift','पकड़ या उठा नहीं पाते'), y_neck:L('Neck pain with pain down the arm','गर्दन दर्द के साथ बांह में नीचे तक दर्द')
};
const DERIVED = [
  {id:'hand_any', when:{any:handAreas}}
];
const URGENCY = {
  orange:[
    {r:'o_snuffbox', when:'rf_snuffbox'}, {r:'o_weak', when:'rf_weak'}, {r:'o_fever', when:'rf_fever'},
    {r:'o_night', when:{all:['rf_night',{any:['age_ge50','r_cancer']}]}}, {r:'o_pain', when:{painGte:9}}
  ],
  yellow:[
    {r:'y_injury', when:{any:['on_fall','on_blow','on_accident']}}, {r:'y_ra', when:{all:['ch_swell_knuckles',{any:['ch_stiff_long','hand_both','o_other_joints']}]}},
    {r:'y_nerve', when:'ch_weak_grip'}, {r:'y_bursa', when:'ch_elbow_swell'}, {r:'y_often', when:'btw_often'}, {r:'y_long', when:{any:['d_6_12','d_3m']}},
    {r:'y_pain', when:{all:[{painGte:7},{not:{painGte:9}}]}}, {r:'y_sleep', when:'sleep_bad'}, {r:'y_func', when:'hgrip_no'}, {r:'y_neck', when:'ch_neck_arm'}
  ]
};
const EMERG_WHEN = {fracture:'rf_deform', handinf:'rf_infect', septic:'rf_hot', cardiac:'rf_chest'};
const FOCUS = {
  latepi:{bones:['arm']}, medepi:{bones:['arm']}, bursitis:{bones:['arm']},
  cubital:{nerves:['ulnar','ulnarF0','ulnarF1'], useSides:true}, cts:{nerves:['median','medianF0','medianF1','medianF2'], useSides:true},
  dequervain:{bones:['hand']}, trigger:{bones:['hand']}, handoa:{bones:['hand']}, ra:{bones:['hand']}, ganglion:{bones:['hand']}, dupuytren:{bones:['hand']}, scaphoid:{bones:['hand']},
  neckref:{vert:['C5','C6','C7'], roots:['C6','C7'], useSides:true}
};
const LBLX = {hand_one:L('One arm or hand','एक बांह या हाथ'), hand_both:L('Both arms or hands','दोनों बांह या हाथ'), hand_any:L('Elbow, wrist or hand pain','कोहनी, कलाई या हाथ का दर्द')};
const FX = {
  elb_out:L('Outer elbow pain on gripping is typical of tennis elbow.','पकड़ने पर कोहनी के बाहर दर्द टेनिस एल्बो का खास लक्षण है।'),
  elb_in:L('Inner elbow pain is typical of golfer’s elbow; tingling there points to the ulnar nerve.','कोहनी के अंदर दर्द गोल्फ़र्स एल्बो का खास लक्षण है; वहाँ झुनझुनी अल्नर नस की ओर इशारा करती है।'),
  ch_grip_pain:L('Pain on gripping and lifting loads the elbow tendons.','पकड़ने और उठाने पर दर्द कोहनी के टेंडन पर भार से होता है।'),
  cozen_pos:L('Outer elbow pain on lifting the wrist against resistance fits tennis elbow.','रुकावट के खिलाफ़ कलाई उठाने पर कोहनी के बाहर दर्द टेनिस एल्बो से मेल खाता है।'),
  cozen_neg:L('No pain on the Cozen test makes tennis elbow less likely (it picks up about 91%).','कोज़ेन टेस्ट में दर्द न होना टेनिस एल्बो की संभावना कम करता है (यह लगभग 91% पकड़ता है)।'),
  o_repetitive:L('Forceful, repeated arm work makes tennis elbow about 5 times more likely.','ज़ोर वाला, बार-बार का बांह का काम टेनिस एल्बो की संभावना लगभग 5 गुना करता है।'),
  ch_elbow_swell:L('A soft swelling on the point of the elbow is an olecranon bursitis.','कोहनी की नोक पर नरम सूजन ओलेक्रेनन बर्साइटिस है।'),
  ch_night_hand:L('Night tingling eased by shaking the hand (flick sign) made carpal tunnel syndrome about 21 times more likely in one study.','हाथ झटकने से कम होने वाली रात की झुनझुनी (फ्लिक साइन) ने एक अध्ययन में कार्पल टनल सिंड्रोम की संभावना लगभग 21 गुना की।'),
  ch_numb_median:L('Tingling in the thumb, index and middle fingers matches the median nerve (about 2.4 times more likely).','अंगूठे, तर्जनी और बीच की उंगली में झुनझुनी मीडियन नस से मेल खाती है (लगभग 2.4 गुना ज़्यादा संभावना)।'),
  ch_numb_ulnar:L('Tingling in the ring and little fingers matches the ulnar nerve.','अनामिका और छोटी उंगली में झुनझुनी अल्नर नस से मेल खाती है।'),
  ch_elbow_bend:L('Tingling when the elbow stays bent points to the ulnar nerve at the elbow.','कोहनी मुड़ी रहने पर झुनझुनी कोहनी पर अल्नर नस की ओर इशारा करती है।'),
  elbflx_pos:L('Tingling with the elbow fully bent fits cubital tunnel syndrome.','कोहनी पूरी मोड़ने पर झुनझुनी क्यूबिटल टनल सिंड्रोम से मेल खाती है।'),
  wrist_thumb:L('Thumb-side wrist pain points to the de Quervain tendons or, after a fall, the scaphoid.','कलाई के अंगूठे वाली तरफ़ दर्द डी क्वेरवेन टेंडन या गिरने के बाद स्कैफ़ॉइड की ओर इशारा करता है।'),
  w_lift_baby:L('Lifting a baby and twisting the thumb load the de Quervain tendons.','बच्चे को उठाना और अंगूठा मोड़ना डी क्वेरवेन टेंडन पर भार डालते हैं।'),
  o_new_mother:L('Late pregnancy and caring for a baby are classic times for de Quervain’s and carpal tunnel.','गर्भावस्था के आखिरी महीने और बच्चे की देखभाल डी क्वेरवेन और कार्पल टनल के क्लासिक समय हैं।'),
  what_pos:L('Pain on the WHAT test fits de Quervain’s, but it is also painful in many without it.','WHAT टेस्ट में दर्द डी क्वेरवेन से मेल खाता है, पर इसके बिना भी कई लोगों में दर्द होता है।'),
  what_neg:L('A pain-free WHAT test makes de Quervain’s very unlikely (99% of people with it had pain).','बिना दर्द का WHAT टेस्ट डी क्वेरवेन की संभावना बहुत कम करता है (इस बीमारी वाले 99% लोगों को दर्द हुआ)।'),
  ch_click_finger:L('A finger that clicks and sticks bent is the hallmark of trigger finger.','क्लिक करती और मुड़ी फंसती उंगली ट्रिगर फिंगर की पहचान है।'),
  r_immune:L('Diabetes makes trigger finger, carpal tunnel and Dupuytren’s more common.','डायबिटीज़ ट्रिगर फिंगर, कार्पल टनल और ड्यूपुइट्रेन को ज़्यादा आम बनाती है।'),
  ch_bony_fingers:L('Hard knobs on the end and middle finger joints are typical of hand osteoarthritis.','उंगलियों के आखिरी और बीच के जोड़ों पर सख्त गांठें हाथ के ऑस्टियोआर्थराइटिस का खास लक्षण हैं।'),
  thumb_base:L('Pain at the base of the thumb with pinching points to thumb-base arthritis.','चुटकी से पकड़ने पर अंगूठे की जड़ में दर्द अंगूठे की जड़ की गठिया की ओर इशारा करता है।'),
  w_pinch:L('Pinching, opening jars and turning keys load the thumb-base joint.','चुटकी से पकड़ना, जार खोलना और चाबी घुमाना अंगूठे की जड़ के जोड़ पर भार डालते हैं।'),
  ch_swell_knuckles:L('Soft swelling of the knuckles and middle joints suggests inflammatory arthritis.','नकल्स और बीच के जोड़ों की नरम सूजन सूजन वाली गठिया का संकेत है।'),
  ch_stiff_long:L('Morning stiffness over 30 minutes suggests inflammatory arthritis.','30 मिनट से ज़्यादा सुबह की जकड़न सूजन वाली गठिया का संकेत है।'),
  ch_stiff_short:L('Brief morning stiffness fits osteoarthritis or trigger finger.','सुबह थोड़ी देर की जकड़न ऑस्टियोआर्थराइटिस या ट्रिगर फिंगर से मेल खाती है।'),
  hand_both:L('Symptoms in both hands fit arthritis or nerve problems from a whole-body cause.','दोनों हाथों में लक्षण गठिया या पूरे शरीर की वजह से नस की समस्या से मेल खाते हैं।'),
  ch_lump_wrist:L('A smooth, rubbery lump on the wrist is usually a ganglion.','कलाई पर चिकनी, रबर जैसी गांठ आमतौर पर गैंग्लियन होती है।'),
  ch_palm_cord:L('A cord in the palm pulling a finger down is Dupuytren’s contracture.','हथेली में उंगली को नीचे खींचती डोरी ड्यूपुइट्रेन कॉन्ट्रैक्चर है।'),
  ch_tabletop:L('Not being able to lay the hand flat is a reason to see a hand surgeon.','हाथ सपाट न रख पाना हैंड सर्जन को दिखाने की वजह है।'),
  rf_snuffbox:L('Pain at the base of the thumb after a fall needs an X-ray: the scaphoid can break without deformity.','गिरने के बाद अंगूठे की जड़ में दर्द हो तो एक्स-रे ज़रूरी: स्कैफ़ॉइड बिना टेढ़ेपन के टूट सकता है।'),
  on_fall:L('A fall on an outstretched hand can break the scaphoid or the wrist.','फैले हाथ के बल गिरने से स्कैफ़ॉइड या कलाई टूट सकती है।'),
  ch_neck_arm:L('Neck pain with pain down the arm points to a nerve root in the neck.','गर्दन दर्द के साथ बांह में नीचे तक दर्द गर्दन में नस की जड़ की ओर इशारा करता है।'),
  neck:L('Arm symptoms with neck pain may come from the neck.','गर्दन दर्द के साथ बांह के लक्षण गर्दन से हो सकते हैं।')
};
const STATS = [
  {v:'90%',t:L('of tennis elbow is better within a year without injections (83% by 6 months)','टेनिस एल्बो एक साल में बिना इंजेक्शन बेहतर (6 महीने में 83%)'),s:'bisset'},
  {v:'54%',t:L('relapsed within a year after a steroid injection for tennis elbow, vs 12% after a dummy injection','टेनिस एल्बो में स्टेरॉयड इंजेक्शन के बाद एक साल में दर्द लौटा, नकली इंजेक्शन के बाद 12%'),s:'coombes13'},
  {v:'21×',t:L('more likely carpal tunnel when night tingling eases by shaking the hand','ज़्यादा संभावना कार्पल टनल की, जब रात की झुनझुनी हाथ झटकने से कम हो'),s:'darcy'},
  {v:'0.75%',t:L('of Indian adults have rheumatoid arthritis (about 7 million people)','भारतीय वयस्कों को रूमेटॉइड आर्थराइटिस (करीब 70 लाख लोग)'),s:'malaviya'},
  {v:'10%',t:L('of people with diabetes get trigger finger, vs 2–3% overall','डायबिटीज़ वाले लोगों को ट्रिगर फिंगर, कुल मिलाकर 2–3%'),s:'trigger'},
  {v:'25%',t:L('of scaphoid fractures do not show on the first X-ray','स्कैफ़ॉइड फ्रैक्चर पहले एक्स-रे में नहीं दिखते'),s:'scaphoid'}
];
const UI = {
  repT:L('Elbow, wrist and hand pain assessment','कोहनी, कलाई और हाथ के दर्द की जांच रिपोर्ट'), tag:L('Elbow and hand assessment','कोहनी और हाथ की जांच'),
  safPic:L('Fingers and hand (asked below): a hot, swollen finger held bent, especially after a cut or bite, is an emergency.','उंगलियाँ और हाथ (नीचे पूछा गया): गर्म, सूजी, मुड़ी हुई उंगली, खासकर कटने या काटने के बाद, इमरजेंसी है।'),
  must:[L('This assessment cannot feel your joints and tendons, test the feeling and strength of your hand, or check your pulses, which a doctor does by examining you.','यह जांच आपके जोड़ों और टेंडन को छूकर नहीं देख सकती, हाथ की संवेदना और ताकत नहीं परख सकती, या नब्ज़ नहीं जांच सकती, जो डॉक्टर जांच से करते हैं।'),
    L('Only a doctor can decide whether you need an X-ray, ultrasound, nerve conduction study, MRI or blood tests, and interpret them with the examination.','एक्स-रे, अल्ट्रासाउंड, नर्व कंडक्शन स्टडी, MRI या ब्लड टेस्ट की ज़रूरत है या नहीं, यह सिर्फ़ डॉक्टर तय कर सकते हैं और जांच के साथ उनका मतलब समझा सकते हैं।'),
    L('Arm and hand symptoms can also come from the neck, the heart, diabetes or thyroid problems; a doctor examines these too.','बांह और हाथ के लक्षण गर्दन, दिल, डायबिटीज़ या थायरॉइड से भी हो सकते हैं; डॉक्टर इनकी भी जांच करते हैं।'),
    L('Injections, splints and exercise plans must be chosen for you personally.','इंजेक्शन, स्प्लिंट और व्यायाम योजना आपके लिए व्यक्तिगत रूप से तय होनी चाहिए।')],
  tip1:L('Keep using the hand for light tasks within comfort; change grip and take breaks rather than resting it completely.','आराम की सीमा में हल्के कामों के लिए हाथ इस्तेमाल करते रहें; पूरा आराम देने की बजाय पकड़ बदलें और बीच-बीच में रुकें।'),
  tip2:L('Until you are examined, avoid heavy gripping, wringing clothes and leaning on the elbow; for night tingling, keep the wrist straight and the elbow not fully bent while sleeping.','जांच होने तक भारी पकड़, कपड़े निचोड़ने और कोहनी पर टेक लगाने से बचें; रात की झुनझुनी हो तो सोते समय कलाई सीधी और कोहनी पूरी न मुड़ी रखें।'),
  gPost:L('Arm and hand bones with the median, ulnar and radial nerves; the highlighted parts are those most involved in the likely cause.','बांह और हाथ की हड्डियाँ और मीडियन, अल्नर व रेडियल नसें; चमकते हिस्से संभावित कारण से सबसे ज़्यादा जुड़े हैं।'),
  gRef:L('Arm and hand bones and nerves for reference.','संदर्भ के लिए बांह और हाथ की हड्डियाँ और नसें।'), gX:L('See-through view: the bones under the areas you marked.','आर-पार व्यू: आपके चिन्हित हिस्सों के नीचे की हड्डियाँ।'),
  hgripT:L('Gripping and lifting (kettle, bag, bucket)','पकड़ना और उठाना (केतली, थैला, बाल्टी)'), hfineT:L('Fine tasks (buttons, writing, phone, cooking)','बारीक काम (बटन, लिखना, फ़ोन, खाना बनाना)')
};
const FUNCS = [
  {id:'hgrip', label:'hgripT', req:true, opts:[['hgrip_ok',L('Normally','सामान्य')],['hgrip_diff',L('With pain','दर्द के साथ')],['hgrip_no',L('Cannot do it','नहीं कर पाते')]]},
  {id:'hfine', label:'hfineT', req:true, opts:[['hfine_ok',L('Normally','सामान्य')],['hfine_diff',L('Clumsy or painful','अनाड़ी या दर्द के साथ')],['hfine_no',L('Cannot do them','नहीं कर पाते')]]},
  {id:'sleep', label:'sleep', opts:C.SLEEPS}
];
SPG.data.modules.hand = {id:'hand', order:9,
  card:{reg:['elb_out_l','wrist_thumb_l','finger_base_l','fingers_l'], view:{az:0.6, el:0.1, d:1.0, yk:'wrist', dy:0.08, tx:0.25, tz:0.12}, hint:L('Tennis elbow, carpal tunnel, de Quervain, trigger finger, finger arthritis, ganglion','टेनिस एल्बो, कार्पल टनल, डी क्वेरवेन, ट्रिगर फिंगर, उंगलियों की गठिया, गैंग्लियन')},
  name:L('Elbow, wrist or hand pain','कोहनी, कलाई या हाथ का दर्द'), safetyView:'fingers', startRegions:['elb_out_l','wrist_thumb_l'], safetyRegions:['fingers_l','fingers_r'],
  labelSet:[], GAL:{nerves:['median','medianF0','medianF1','medianF2','ulnar','ulnarF0','ulnarF1','radial'], joint:{view:{az:0.6, el:0.15, d:0.85, yk:'wrist', dy:0.08, tx:0.25, tz:0.12}, opts:{nerveKeep:['median','medianF0','medianF1','medianF2','ulnar','ulnarF0','ulnarF1','radial'], noLegs:true, noPelvis:true}}},
  resultView:{az:0.7, el:0.1, d:1.0, yk:'wrist', dy:0.08, tx:0.25, tz:0.12}, defaultDept:'ortho',
  ONSETS, PAT, RFS, VIEWS, AREAS, TESTS, CONDS, EMERG, ROOTS:{}, RS, DERIVED, SIDES:{areas:handAreas, one:'hand_one', both:'hand_both', sideAreas:handAreas},
  URGENCY, EMERG_WHEN, ROOT_RULES:[], DISC_OF:{}, EXIT_OF:{}, DEPT_RULES:[], FOCUS, LBLX, UI, FUNCS, FX, STATS};
})();
