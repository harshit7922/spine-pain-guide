window.SPG = window.SPG || {data:{modules:{}}};
/* First-step exercises (Phase 11). Shown on the result page only for green or yellow results, for the condition at the top of the list,
   always with "show these to your doctor or physiotherapist first". Each picture is the 3D body posed by TPOSE[pose] in js/app.js.
   No repetitions or times are given: the guidelines leave the dose to the physiotherapist. Evidence table: research/exercises-evidence.md. */
(function(){
const L = (en, hi) => ({en, hi});
const C = SPG.data.common;
C.SRC.push(
  ['walkback','Pocovi N et al. Walking programme plus physiotherapist-guided education after a bout of low back pain (WalkBack). Lancet 2024 (701 adults; median 208 vs 112 days before the next activity-limiting bout; hazard ratio 0.72), summarised by HealthDay','https://www.healthday.com/healthpro-news/bone-and-joint/walking-education-intervention-prevents-recurrence-of-low-back-pain'],
  ['crossley16','Crossley KM et al. 2016 Patellofemoral pain consensus statement. Br J Sports Med 2016;50:844–52 (exercise recommended; combine hip and knee exercises rather than knee exercises alone)','https://repub.eur.nl/pub/97316/REPUB_97316-OA.pdf'],
  ['neckcpg','Blanpied PR et al. Neck pain: revision 2017, APTA Orthopaedic Section clinical practice guideline, decision tree (new neck pain: range-of-motion and low-load exercise with a home programme; long-standing: neck and shoulder-blade strengthening and endurance; with arm pain: mobilising and stabilising exercise)','https://www.orthopt.org/uploads/content_files/files/Neck%20Pain%20Revision%20Decision%20Tree%202017%20-%20Ortho%20Section.pdf'],
  ['jull02','Jull G et al. A randomized controlled trial of exercise and manipulative therapy for cervicogenic headache. Spine 2002;27:1835–43 (200 people; low-load exercise reduced headache frequency and intensity, lasting to 12 months)','https://chiro.org/Headache/A_Randomized_Controlled_Trial.shtml'],
  ['kelley13','Kelley MJ et al. Shoulder pain and mobility deficits: adhesive capsulitis. JOSPT 2013, APTA guideline (education and stretching, grade B, with intensity set by how irritable the shoulder is; exercise within pain limits including pendulum swings: good result in 89% vs 64% with intensive stretching at 24 months)','https://www.orthopt.org/uploads/content_files/ICF/Updated_Guidelines/Shoulder_Guidelines_AdhesiveCapsulitis_JOSPT_May_2013.pdf'],
  ['heelcpg','Koc TA et al. Heel pain – plantar fasciitis: revision 2023, APTA guideline (calf and plantar fascia stretching grade A; taping A; night splints A; foot and ankle strengthening B), summarised by Physical Therapy First','https://physicaltherapyfirst.com/blog/heel-pain-plantar-fasciitis-revision-2023/'],
  ['achcpg','Midportion Achilles tendinopathy: revision 2024, APTA guideline (tendon-loading exercise grade A; education grade B; complete rest not advised), summarised by Physical Therapy First','https://physicaltherapyfirst.com/blog/2024-clnical-practice-guideline-for-midportion-achilles-tendinopathy/'],
  ['hupperets','Hupperets MDW et al. Unsupervised home-based balance training after an ankle sprain. BMJ 2009;339:b2684 (8-week programme; new sprain within a year 22% vs 33%, a 35% reduction), summarised by Medical News Today','https://www.medicalnewstoday.com/articles/157185/'],
  ['vuurberg','Vuurberg G et al. Diagnosis, treatment and prevention of ankle sprains: update of an evidence-based clinical guideline. Br J Sports Med 2018;52:956 (supervised exercise programmes preferred over passive treatment)','https://pubmed.ncbi.nlm.nih.gov/29514819/'],
  ['letcpg','Lucado AM et al. Lateral elbow pain and muscle function impairments. JOSPT 2022, APTA guideline (isometric, concentric or eccentric resisted exercise of the wrist extensors for subacute or long-standing pain, grade B)','https://www.orthopt.org/uploads/content_files/files/jospt.2022.0302.pdf'],
  ['eularfm','Macfarlane GJ et al. EULAR revised recommendations for the management of fibromyalgia. Ann Rheum Dis 2017;76:318–28 (exercise was the only therapy rated "strong for")','https://ard.bmj.com/content/76/2/318.abstract'],
  ['axspaex','Systematic literature review informing the 2022 ASAS-EULAR recommendations for axial spondyloarthritis. Ann Rheum Dis 2023;82:142 (exercise improved disease activity, function and mobility with moderate to large effects; education smaller effects)','https://ard.bmj.com/content/82/1/142']
);

/* pose = picture (TPOSE id); null = a text card without a picture */
const EX = {
  walk:{pose:'ex_walk', name:L('Regular walking','नियमित सैर'), steps:[
    L('Walk on level ground at a comfortable pace, in supportive shoes.','समतल ज़मीन पर आरामदायक रफ़्तार से, सहारा देने वाले जूतों में चलें।'),
    L('Start with a distance that does not make the pain worse, and build up slowly over the weeks.','उतनी दूरी से शुरू करें जिससे दर्द न बढ़े, और हफ्तों में धीरे-धीरे बढ़ाएँ।'),
    L('Keep a short note of how far you walked and how you felt the next day.','कितना चले और अगले दिन कैसा लगा, इसका छोटा सा नोट रखें।')]},
  sitstand:{pose:'ex_sit', name:L('Sit to stand from a chair','कुर्सी से उठना-बैठना'), steps:[
    L('Sit near the front of a firm chair, feet flat and hip-width apart.','मज़बूत कुर्सी के आगे वाले हिस्से पर बैठें, पैर ज़मीन पर सपाट और कूल्हों जितनी दूरी पर।'),
    L('Lean forward a little and stand up; use your hands on the chair or thighs only if you need to.','थोड़ा आगे झुकें और खड़े हों; ज़रूरत हो तभी हाथों से कुर्सी या जांघों का सहारा लें।'),
    L('Sit back down slowly and with control, keeping the knees in line with the toes.','घुटनों को पंजों की सीध में रखते हुए धीरे-धीरे और संभलकर वापस बैठें।')]},
  slr:{pose:'ex_slr', name:L('Straight-leg raise','सीधी टांग उठाना'), steps:[
    L('Lie on your back with the other knee bent and that foot flat.','पीठ के बल लेटें; दूसरा घुटना मोड़कर उस पैर का तलवा बिस्तर पर रखें।'),
    L('Tighten the muscle at the front of the thigh so the knee is fully straight.','जांघ के आगे की मांसपेशी कसें ताकि घुटना पूरा सीधा रहे।'),
    L('Lift the straight leg to about the height of the other knee, hold briefly, then lower it slowly.','सीधी टांग को दूसरे घुटने की ऊँचाई तक उठाएँ, थोड़ा रुकें, फिर धीरे-धीरे नीचे लाएँ।')]},
  hipabd:{pose:'ex_abd', name:L('Side leg raise','टांग को बगल में उठाना'), steps:[
    L('Stand tall, holding a chair, table or wall for balance.','संतुलन के लिए कुर्सी, मेज़ या दीवार पकड़कर सीधे खड़े हों।'),
    L('Keeping the knee straight and the toes pointing forward, slowly lift the leg out to the side.','घुटना सीधा और पंजे आगे की ओर रखते हुए टांग को धीरे-धीरे बगल में उठाएँ।'),
    L('Do not lean your body to the other side; lower the leg slowly.','शरीर को दूसरी तरफ न झुकाएँ; टांग को धीरे-धीरे नीचे लाएँ।')]},
  neckturn:{pose:'ex_turn', name:L('Gentle neck turns','गर्दन को धीरे से घुमाना'), steps:[
    L('Sit tall with your shoulders relaxed.','कंधे ढीले रखकर सीधे बैठें।'),
    L('Slowly turn your head to look over one shoulder, as far as is comfortable, then come back to the middle.','सिर को धीरे-धीरे घुमाकर एक कंधे की ओर देखें, जितना आराम से हो सके, फिर बीच में लौटें।'),
    L('Repeat to the other side. Move within comfort and do not force it.','दूसरी तरफ दोहराएँ। आराम की सीमा में हिलाएँ, ज़ोर न लगाएँ।')]},
  chintuck:{pose:'ex_chin', name:L('Chin tuck','चिन टक (ठुड्डी पीछे खींचना)'), steps:[
    L('Sit tall and look straight ahead.','सीधे बैठें और सामने देखें।'),
    L('Gently slide your chin straight back, as if making a double chin, keeping your eyes level.','आँखें सीधी रखते हुए ठुड्डी को धीरे से सीधा पीछे खींचें, जैसे डबल चिन बना रहे हों।'),
    L('Hold briefly, then relax. You should feel a gentle stretch at the back of the neck, not pain.','थोड़ा रुकें, फिर ढीला छोड़ें। गर्दन के पीछे हल्का खिंचाव लगना चाहिए, दर्द नहीं।')]},
  pendulum:{pose:'ex_pend', name:L('Pendulum swing','पेंडुलम (झूलता हाथ)'), steps:[
    L('Lean forward and rest your good hand on a table.','आगे झुकें और ठीक वाले हाथ को मेज़ पर टिकाएँ।'),
    L('Let the painful arm hang down loosely.','दर्द वाले हाथ को ढीला नीचे लटकने दें।'),
    L('Gently rock your body so the arm swings in small circles or side to side; the arm itself stays relaxed.','शरीर को धीरे से हिलाएँ ताकि हाथ छोटे घेरों में या दाएँ-बाएँ झूले; हाथ खुद ढीला रहे।')]},
  ser:{pose:'ex_ser', name:L('Turning the shoulder outward','कंधे को बाहर की ओर घुमाना'), steps:[
    L('Stand with the elbow tucked in at your side and bent to a right angle.','कोहनी को बगल से सटाकर समकोण पर मोड़कर खड़े हों।'),
    L('Keeping the elbow at your side, slowly turn the forearm outward, then bring it back.','कोहनी बगल में रखते हुए बांह के निचले हिस्से को धीरे-धीरे बाहर घुमाएँ, फिर वापस लाएँ।'),
    L('Your physiotherapist may add a light resistance band, or ask you to press against a door frame instead.','फिज़ियोथेरेपिस्ट हल्का रेज़िस्टेंस बैंड जोड़ सकते हैं, या दरवाज़े की चौखट पर दबाने को कह सकते हैं।')]},
  calfstretch:{pose:'ex_calf', name:L('Calf stretch against a wall','दीवार के सहारे पिंडली का खिंचाव'), steps:[
    L('Face a wall with your hands on it at shoulder height.','दीवार की ओर मुँह करके हाथ कंधे की ऊँचाई पर दीवार पर रखें।'),
    L('Step the painful foot back, keeping that knee straight and the heel on the floor.','दर्द वाले पैर को पीछे रखें; उस घुटने को सीधा और एड़ी ज़मीन पर रखें।'),
    L('Bend the front knee and lean towards the wall until you feel a stretch in the back calf, then hold.','आगे वाला घुटना मोड़कर दीवार की ओर झुकें जब तक पीछे वाली पिंडली में खिंचाव न लगे, फिर रुकें।')]},
  heelraise:{pose:'ex_heel', name:L('Heel raises','एड़ी उठाना'), steps:[
    L('Stand facing a wall, or hold a firm support.','दीवार की ओर मुँह करके खड़े हों, या किसी मज़बूत सहारे को पकड़ें।'),
    L('Rise slowly up onto your toes, then lower slowly.','धीरे-धीरे पंजों पर उठें, फिर धीरे-धीरे नीचे आएँ।'),
    L('Start on both feet; your physiotherapist will tell you when to move to one foot (as in the picture) and how to add load.','दोनों पैरों पर शुरू करें; कब एक पैर पर करना है (जैसा तस्वीर में) और वज़न कैसे बढ़ाना है, यह फिज़ियोथेरेपिस्ट बताएँगे।')]},
  balance:{pose:'ex_bal', name:L('Single-leg balance','एक पैर पर संतुलन'), steps:[
    L('Stand next to a wall or kitchen counter that you can hold if needed.','दीवार या रसोई के काउंटर के पास खड़े हों जिसे ज़रूरत पड़ने पर पकड़ सकें।'),
    L('Lift the other foot and balance on the injured leg.','दूसरा पैर उठाएँ और चोट वाले पैर पर संतुलन बनाएँ।'),
    L('As it gets easier, your physiotherapist may ask you to close your eyes or stand on a cushion or balance board.','आसान लगने पर फिज़ियोथेरेपिस्ट आँखें बंद करने या गद्दी या बैलेंस बोर्ड पर खड़े होने को कह सकते हैं।')]},
  wristext:{pose:'ex_wext', name:L('Wrist lift','कलाई ऊपर उठाना'), steps:[
    L('Sit with your forearm resting on a table or armrest, palm facing down and the hand over the edge.','बांह का निचला हिस्सा मेज़ या कुर्सी के हत्थे पर टिकाकर बैठें, हथेली नीचे की ओर और हाथ किनारे से बाहर।'),
    L('Slowly lift the hand up, then lower it slowly.','हाथ को धीरे-धीरे ऊपर उठाएँ, फिर धीरे-धीरे नीचे लाएँ।'),
    L('Your physiotherapist may give you a light weight, or ask you to hold the hand still against resistance (an isometric hold).','फिज़ियोथेरेपिस्ट हल्का वज़न दे सकते हैं, या रुकावट के ख़िलाफ़ हाथ को स्थिर रोकने (आइसोमेट्रिक) को कह सकते हैं।')]},
  extender:{pose:'ex_ext', name:L('The extender (hamstring lengthening)','एक्सटेंडर (हैमस्ट्रिंग लंबी करने का व्यायाम)'), steps:[
    L('Lie on your back and lift the injured leg so the hip is bent to a right angle.','पीठ के बल लेटें और चोट वाली टांग उठाएँ ताकि कूल्हा समकोण पर मुड़े।'),
    L('Hold the back of the thigh with both hands to keep it still.','जांघ के पीछे दोनों हाथों से पकड़कर उसे स्थिर रखें।'),
    L('Slowly straighten the knee until you feel a stretch at the back of the thigh, not pain, then bend it back.','घुटने को धीरे-धीरे सीधा करें जब तक जांघ के पीछे खिंचाव लगे, दर्द नहीं, फिर वापस मोड़ें।')]},
  gtpsedu:{pose:null, name:L('Take pressure off the tendon','टेंडन पर दबाव कम करें'), steps:[
    L('Avoid crossing your legs and sitting in very low chairs.','पैर पर पैर रखकर बैठने और बहुत नीची कुर्सियों से बचें।'),
    L('Sleep on your back, or on the good side with a pillow between the knees.','पीठ के बल सोएँ, या ठीक वाली करवट घुटनों के बीच तकिया रखकर।'),
    L('When standing, keep your weight even on both legs instead of leaning on one hip.','खड़े होते समय वज़न दोनों टांगों पर बराबर रखें, एक कूल्हे पर टिककर न खड़े हों।'),
    L('Your physiotherapist will add strengthening exercises for the hip muscles.','फिज़ियोथेरेपिस्ट कूल्हे की मांसपेशियों को मज़बूत करने वाले व्यायाम जोड़ेंगे।')]}
};

/* why each set is suggested, with its source */
const R = {
  back:{why:L('Guidelines recommend exercise for low back pain, matched to your needs and abilities. In a trial of 701 adults who had just recovered from a bout of back pain, a walking programme with physiotherapist education nearly doubled the time before the next bout (median 208 vs 112 days).','गाइडलाइंस कमर दर्द के लिए आपकी ज़रूरत और क्षमता के हिसाब से व्यायाम की सलाह देती हैं। एक ट्रायल में कमर दर्द के दौर से अभी ठीक हुए 701 वयस्कों में, सैर के कार्यक्रम और फिज़ियोथेरेपिस्ट की सलाह से अगला दौर आने तक का समय लगभग दोगुना हो गया (मीडियन 208 बनाम 112 दिन)।'), src:['nice','whocplbp','walkback']},
  oa:{why:L('NICE advises offering exercise tailored to the person, such as muscle strengthening and general fitness, to everyone with osteoarthritis as a core treatment.','NICE ऑस्टियोआर्थराइटिस वाले हर व्यक्ति को उसके हिसाब से बनाया व्यायाम, जैसे मांसपेशियों को मज़बूत करना और सामान्य फ़िटनेस, मुख्य इलाज के रूप में देने की सलाह देता है।'), src:['niceoa']},
  pfp:{why:L('An international consensus recommends exercise for pain around the kneecap, combining hip and knee exercises rather than knee exercises alone.','एक अंतरराष्ट्रीय सहमति (कंसेंसस) घुटने की टोपी के आसपास के दर्द के लिए व्यायाम की सलाह देती है: सिर्फ घुटने के नहीं, कूल्हे और घुटने दोनों के व्यायाम मिलाकर।'), src:['crossley16']},
  neckNew:{why:L('For new neck pain, the physiotherapy guideline advises gentle range-of-motion exercise, staying active and a home exercise plan.','नए गर्दन दर्द के लिए फिज़ियोथेरेपी गाइडलाइन हल्के हिलाने वाले व्यायाम, सक्रिय रहने और घर पर व्यायाम की योजना की सलाह देती है।'), src:['neckcpg']},
  neckArm:{why:L('For neck pain with pain into the arm, the guideline advises gentle mobilising and stabilising exercise.','बांह तक जाते गर्दन दर्द के लिए गाइडलाइन हल्के हिलाने और स्थिर करने वाले व्यायाम की सलाह देती है।'), src:['neckcpg']},
  neckLong:{why:L('For long-standing neck pain, the guideline advises strengthening and endurance exercise for the neck and shoulder blades.','लंबे समय के गर्दन दर्द के लिए गाइडलाइन गर्दन और कंधे की हड्डी (स्कैपुला) की मांसपेशियों को मज़बूत करने और सहनशक्ति वाले व्यायाम की सलाह देती है।'), src:['neckcpg']},
  cgh:{why:L('In a trial of 200 people with headache from the neck, a low-load neck exercise programme reduced how often and how badly the headaches came, and the effect lasted to 12 months.','गर्दन से आने वाले सिरदर्द वाले 200 लोगों के एक ट्रायल में, हल्के गर्दन व्यायाम के कार्यक्रम से सिरदर्द कम बार और कम तेज़ आया, और असर 12 महीने तक रहा।'), src:['jull02','neckcpg']},
  frozen:{why:L('The physiotherapy guideline advises explanation and gentle stretching matched to how irritable the shoulder is. In one study, gentle exercise within the pain limit, including pendulum swings, gave a good result in 89% at 2 years, against 64% with intensive stretching.','फिज़ियोथेरेपी गाइडलाइन जानकारी और कंधे में दर्द कितना तेज़ है उसके हिसाब से हल्के खिंचाव की सलाह देती है। एक अध्ययन में दर्द की सीमा के अंदर हल्के व्यायाम, पेंडुलम समेत, से 2 साल पर 89% में अच्छा नतीजा मिला, जबकि ज़ोरदार खिंचाव से 64% में।'), src:['kelley13','bessfs']},
  cuff:{why:L('Guidelines advise exercise-based physiotherapy for at least 6 weeks as the first treatment for rotator cuff-related shoulder pain.','रोटेटर कफ से जुड़े कंधे के दर्द में गाइडलाइंस पहले इलाज के रूप में कम से कम 6 हफ्ते व्यायाम वाली फिज़ियोथेरेपी की सलाह देती हैं।'), src:['besssap']},
  heel:{why:L('The 2023 physiotherapy guideline gives its strongest grade (A) to calf and plantar fascia stretching for heel pain.','2023 की फिज़ियोथेरेपी गाइडलाइन एड़ी के दर्द के लिए पिंडली और प्लांटर फ़ेशिया के खिंचाव को सबसे मज़बूत ग्रेड (A) देती है।'), src:['heelcpg','aafppf']},
  achilles:{why:L('The 2024 guideline gives its strongest grade (A) to tendon-loading exercise for Achilles tendon pain and advises against complete rest.','2024 की गाइडलाइन एकिलीज़ टेंडन के दर्द के लिए टेंडन पर धीरे-धीरे भार डालने वाले व्यायाम को सबसे मज़बूत ग्रेड (A) देती है और पूरे आराम के ख़िलाफ़ सलाह देती है।'), src:['achcpg']},
  sprain:{why:L('After an ankle sprain, an 8-week home balance programme cut new sprains within a year from 33% to 22%. The guideline prefers exercise over passive treatment.','टखने की मोच के बाद, 8 हफ्ते के घर वाले संतुलन कार्यक्रम से एक साल में दोबारा मोच 33% से घटकर 22% रह गई। गाइडलाइन निष्क्रिय इलाज के बजाय व्यायाम को बेहतर मानती है।'), src:['hupperets','vuurberg']},
  elbow:{why:L('For tennis elbow that has lasted a while, the physiotherapy guideline recommends resisted exercise of the wrist muscles (grade B).','कुछ समय से चल रहे टेनिस एल्बो के लिए फिज़ियोथेरेपी गाइडलाइन कलाई की मांसपेशियों के रुकावट के ख़िलाफ़ व्यायाम की सलाह देती है (ग्रेड B)।'), src:['letcpg','bisset']},
  hamstring:{why:L('In elite footballers with a hamstring strain, lengthening exercises like this got players back in 28 days, against 51 days with standard exercises.','हैमस्ट्रिंग खिंचाव वाले पेशेवर फ़ुटबॉल खिलाड़ियों में ऐसे लंबाई बढ़ाने वाले व्यायामों से खिलाड़ी 28 दिन में लौटे, जबकि सामान्य व्यायामों से 51 दिन में।'), src:['askling13']},
  gtps:{why:L('In the LEAP trial, advice on taking pressure off the tendon plus exercise worked better than a steroid injection or waiting: success at 8 weeks 77.3% vs 58.5% vs 29.4%.','LEAP ट्रायल में टेंडन पर दबाव कम करने की सलाह और व्यायाम, स्टेरॉयड इंजेक्शन या इंतज़ार से बेहतर रहे: 8 हफ्ते पर सफलता 77.3% बनाम 58.5% बनाम 29.4%।'), src:['leap']},
  fibro:{why:L('European guidelines give exercise their only "strong" recommendation among treatments for fibromyalgia.','यूरोपीय गाइडलाइंस फ़ाइब्रोमायल्जिया के इलाजों में सिर्फ व्यायाम को "मज़बूत" सिफ़ारिश देती हैं।'), src:['eularfm']},
  axspa:{why:L('Regular exercise is a core part of care for axial spondyloarthritis: in the review behind the 2022 ASAS-EULAR recommendations it improved disease activity, function and mobility.','एक्सियल स्पॉन्डिलोआर्थराइटिस की देखभाल में नियमित व्यायाम मुख्य हिस्सा है: 2022 की ASAS-EULAR सिफ़ारिशों के पीछे की समीक्षा में इससे बीमारी की सक्रियता, काम करने की क्षमता और लचीलापन सुधरे।'), src:['axspaex']}
};

/* condition id (any module) -> exercises and reason. Ids shared by two modules point to the same advice. */
const MAP = {
  disc:['back', 'walk'], strain:['back', 'walk'], facet:['back', 'walk'], cplbp:['back', 'walk'], ddd:['back', 'walk'], myofascial:['back', 'walk'],
  axspa:['axspa', 'walk'], taxspa:['axspa', 'walk'], waxspa:['axspa', 'walk'], fibro:['fibro', 'walk'],
  koa:['oa', 'walk', 'sitstand', 'slr'], hipoa:['oa', 'walk', 'sitstand'], pfp:['pfp', 'sitstand', 'hipabd'],
  gtps:['gtps', 'gtpsedu'], hamstring:['hamstring', 'extender'],
  neckstrain:['neckNew', 'neckturn'], wryneck:['neckNew', 'neckturn'], whiplash:['neckNew', 'neckturn'], cervrad:['neckArm', 'chintuck', 'neckturn'],
  cspondy:['neckLong', 'chintuck', 'neckturn'], cgh:['cgh', 'chintuck'], cervicogenic:['cgh', 'chintuck'],
  frozen:['frozen', 'pendulum'], rcrsp:['cuff', 'ser'],
  pfasc:['heel', 'calfstretch'], achten:['achilles', 'heelraise'], sprain:['sprain', 'balance'],
  latepi:['elbow', 'wristext']
};

const U = {
  exT:L('First exercises to ask your physiotherapist about','फिज़ियोथेरेपिस्ट से पूछने लायक शुरुआती व्यायाम'),
  exFor:L('Matched to','किसके लिए'),
  exSafe:L('Show these to your doctor or physiotherapist before you start, so they can check that they suit you. Move gently. Stop and ask for advice if the pain becomes sharp or keeps getting worse, or if you get new numbness, tingling or weakness.','शुरू करने से पहले ये व्यायाम अपने डॉक्टर या फिज़ियोथेरेपिस्ट को दिखाएँ, ताकि वे जांच सकें कि ये आपके लिए ठीक हैं। धीरे-धीरे करें। दर्द तेज़ हो जाए या बढ़ता जाए, या नया सुन्नपन, झनझनाहट या कमज़ोरी आए, तो रुकें और सलाह लें।'),
  exDose:L('How many and how often: your physiotherapist will set this for you.','कितनी बार और कितनी देर: यह आपके फिज़ियोथेरेपिस्ट तय करेंगे।'),
  exWork:L('Muscles working or being stretched','जिन मांसपेशियों पर काम होता है या खिंचाव आता है'),
  exWhy:L('Why','क्यों')
};

SPG.data.exercises = {EX, R, MAP, U};
})();
