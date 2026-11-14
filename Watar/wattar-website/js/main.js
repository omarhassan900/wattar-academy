// Wattar Academy — public website (brand 2026)
// Language, loader, sound, booking, Play section and the 3D instrument scene

const T={
en:{navHome:"Home",navProgrammes:"Programmes",navJourney:"The journey",navConcerts:"Concerts & Band",navPlay:"Play",playLabel:"Play",playTitle:"Try an instrument before your first lesson.",playLead:"Pick one and play it right here. The sound turns on as soon as you play.",howPiano:"Tap or click the keys, or drag across them. On a computer, play A S D F G H J K.",howDrums:"Tap the drums and the cymbal. On a computer: F kick, J snare, K tom, L cymbal.",howOud:"Swipe across the strings, or tap one. On a computer, press 1 to 5.",navLogin:"Student login",langToggle:"عربي",
ctaTrial:"Book a free trial",ctaProgrammes:"Explore programmes",
heroEyebrow:"Music school · Mokattam, Cairo",heroTitle1:"Where music",heroTitle2:"begins.",
heroLead:"Oud, piano, guitar, violin, drums and voice — for children and adults, taught by musicians who perform.",
soundOff:"Sound off",soundOn:"Sound on",strumHint:"Swipe across the strings to play",
progLabel:"Programmes",progTitle:"Choose your instrument",progLead:"Every programme follows the same 48 levels, with a trainer who plays that instrument on stage.",
oudCat:"Strings · Arabic tradition",oud:"Oud",oudD:"From the risha to your first maqam and your first full song.",
pianoCat:"Keys",piano:"Piano",pianoD:"Read music and play with both hands from the first month.",
guitarCat:"Strings",guitar:"Guitar",guitarD:"Chords and rhythm first, then the solos you came for.",
violinCat:"Bowed strings",violin:"Violin",violinD:"Posture, bow and a clear tone, with classical and Arabic pieces.",
drumsCat:"Percussion",drums:"Drums",drumsD:"Timing, grooves and the confidence to hold a band together.",
voiceCat:"Voice",voice:"Voice",voiceD:"Breathing, pitch and confidence on stage.",
metaWho:"Children & adults",metaLevels:"48 levels",mark:"وتر",
journeyLabel:"The journey",journeyTitle:"One clear path, from first note to the stage.",
journeyLead:"Each level is four sessions. Your trainer evaluates it before you move on, so parents always know where their child stands.",
y1:"Year 1",y1m:"Levels 1–12",y1t:"Foundation",y1d:"Technique, rhythm and reading music.",
y2:"Year 2",y2m:"Levels 13–24",y2t:"Development",y2d:"More repertoire, new styles, first ensemble playing.",
y3:"Year 3",y3m:"Levels 25–36",y3t:"Refinement",y3d:"Advanced technique and expression.",
y4:"Year 4",y4m:"Levels 37–48",y4t:"Mastery",y4d:"Solo performance and the graduation recital.",
nInst:"instruments",nLevels:"levels",nSessions:"sessions per level",nYears:"years to graduation",
methodLabel:"How lessons work",methodTitle:"The Wattar method",methodLead:"The same four steps at every level, for every instrument.",
m1t:"Find your level",m1d:"A free first session with a trainer shows where to start.",
m2t:"Learn in levels",m2d:"Four sessions per level, with practice assignments in the student portal.",
m3t:"Evaluate and move up",m3d:"Your trainer evaluates each level before the next one starts.",
m4t:"Perform",m4d:"Concerts, the Wattar Band and the graduation recital.",
bandLabel:"Concerts & Band",bandTitle:"Every season ends on a real stage.",
bandLead:"Students perform for their families at the academy concert. Selected students join the Wattar Band, rehearse together and play live.",
ticketT:"WATTAR ACADEMY CONCERT",ticketH:"Students on stage",tWhen:"When",tWho:"Who",tSeats:"Seats",tWhenV:"Every season",tWhoV:"All levels",tSeatsV:"Families",bandCta:"Join the band",
bookLabel:"Book a free trial",bookTitle:"Three steps. No account needed.",
bookLead:"Choose an instrument and a time that suits you. We confirm your trial on WhatsApp, the way most families already talk to us.",
tick1:"Free first session with a trainer",tick2:"Children and adults welcome",tick3:"Confirmation on WhatsApp",
s1:"Instrument",s2:"Time",s3:"Details",q1:"Which instrument?",q2:"When suits you best?",q3:"Your details",continue:"Continue",back:"Back",
tA:"Weekday afternoon",tAs:"Sun – Thu · 3 – 6 PM",tB:"Weekday evening",tBs:"Sun – Thu · 6 – 10 PM",tC:"Saturday",tCs:"12 – 10 PM",
fName:"Parent's or student's name",phName:"e.g. Mona Ali",fPhone:"WhatsApp number",fAge:"Student's age (optional)",
eName:"Enter a name so we know who to ask for.",ePhone:"Enter an 11-digit Egyptian mobile number.",send:"Book my free trial",sending:"Sending…",
doneT:"Request received",doneD:"We'll message you on WhatsApp to confirm your trial time.",again:"Book another trial",
errSend:"We couldn't send your request. Try again, or message us on WhatsApp.",previewNote:"Preview: nothing was sent.",orWa:"Or message us on",
finLabel:"وتر means string",finTitle:"Every musician starts with one string.",
finLead:"Our mark is the word وتر, cut by channels of equal width. The channels are the strings. Pluck them.",
fDesc:"Music school for children and adults in Mokattam, Cairo.",fProg:"Programmes",fSchool:"Academy",fVisit:"Visit",
addr:"Mokattam, behind Hosny",h1:"Sun – Thu · 3 – 10 PM",h2:"Saturday · 12 – 10 PM",rights:"© 2026 Wattar Academy",made:"Black, white and gold · Made in Cairo"},
ar:{navHome:"الرئيسية",navProgrammes:"البرامج",navJourney:"الرحلة",navConcerts:"الحفلات والفرقة",navPlay:"جرّب",playLabel:"جرّب",playTitle:"جرّب الآلة قبل أول حصة.",playLead:"اختار آلة واعزف عليها هنا. الصوت بيشتغل أول ما تعزف.",howPiano:"دوس أو اضغط على المفاتيح، أو اسحب عليها. على الكمبيوتر اعزف بـ A S D F G H J K.",howDrums:"دوس على الطبول والصاج. على الكمبيوتر: F الكيك، J السنير، K التوم، L الصاج.",howOud:"حرّك إيدك على الأوتار أو دوس على وتر. على الكمبيوتر اضغط من 1 لـ 5.",navLogin:"دخول الطلاب",langToggle:"English",
ctaTrial:"احجز حصة تجريبية مجانية",ctaProgrammes:"شوف البرامج",
heroEyebrow:"مدرسة موسيقى · المقطم، القاهرة",heroTitle1:"هنا الموسيقى",heroTitle2:"بتبدأ.",
heroLead:"عود وبيانو وجيتار وكمان ودرامز وغناء — للأطفال والكبار، مع موسيقيين بيعزفوا على المسرح.",
soundOff:"الصوت مقفول",soundOn:"الصوت شغال",strumHint:"حرّك إيدك على الأوتار عشان تعزف",
progLabel:"البرامج",progTitle:"اختار آلتك",progLead:"كل برنامج ماشي على نفس الـ48 مستوى، مع مدرب بيعزف الآلة دي على المسرح.",
oudCat:"وتريات · تراث عربي",oud:"عود",oudD:"من الريشة لأول مقام وأول أغنية كاملة.",
pianoCat:"كيبورد",piano:"بيانو",pianoD:"اقرأ النوتة واعزف بالإيدين الاتنين من أول شهر.",
guitarCat:"وتريات",guitar:"جيتار",guitarD:"الكوردات والإيقاع الأول، وبعدها السولو اللي جاي عشانه.",
violinCat:"وتريات بالقوس",violin:"كمان",violinD:"الوقفة والقوس وصوت نضيف، بمقطوعات كلاسيك وعربي.",
drumsCat:"إيقاع",drums:"درامز",drumsD:"التايمنج والجروف والثقة إنك تمسك الفرقة.",
voiceCat:"صوت",voice:"غناء",voiceD:"التنفس والطبقة والثقة على المسرح.",
metaWho:"أطفال وكبار",metaLevels:"48 مستوى",mark:"وتر",
journeyLabel:"الرحلة",journeyTitle:"طريق واحد واضح، من أول نغمة للمسرح.",
journeyLead:"كل مستوى أربع حصص. المدرب بيقيّمه قبل ما تنقل للي بعده، عشان الأهل دايماً عارفين ابنهم وصل لفين.",
y1:"السنة الأولى",y1m:"المستويات 1–12",y1t:"الأساس",y1d:"التكنيك والإيقاع وقراءة النوتة.",
y2:"السنة التانية",y2m:"المستويات 13–24",y2t:"التطوير",y2d:"مقطوعات أكتر وأنماط جديدة وأول عزف جماعي.",
y3:"السنة التالتة",y3m:"المستويات 25–36",y3t:"الصقل",y3d:"تكنيك متقدم وتعبير موسيقي.",
y4:"السنة الرابعة",y4m:"المستويات 37–48",y4t:"الإتقان",y4d:"عزف منفرد وحفلة التخرج.",
nInst:"آلات",nLevels:"مستوى",nSessions:"حصص في كل مستوى",nYears:"سنين للتخرج",
methodLabel:"الحصص ماشية إزاي",methodTitle:"طريقة وتر",methodLead:"نفس الأربع خطوات في كل مستوى، ولكل آلة.",
m1t:"اعرف مستواك",m1d:"أول حصة مجانية مع مدرب بتوضح تبدأ منين.",
m2t:"اتعلم بالمستويات",m2d:"أربع حصص في كل مستوى، وواجبات التمرين في بوابة الطالب.",
m3t:"تقييم وترقّي",m3d:"المدرب بيقيّم كل مستوى قبل ما اللي بعده يبدأ.",
m4t:"اعزف",m4d:"الحفلات وفرقة وتر وحفلة التخرج.",
bandLabel:"الحفلات والفرقة",bandTitle:"كل موسم بيخلص على مسرح حقيقي.",
bandLead:"الطلاب بيعزفوا لأهاليهم في حفلة الأكاديمية. وطلاب مختارين بينضموا لفرقة وتر، يتمرنوا مع بعض ويعزفوا لايف.",
ticketT:"حفلة أكاديمية وتر",ticketH:"الطلاب على المسرح",tWhen:"إمتى",tWho:"مين",tSeats:"الحضور",tWhenV:"كل موسم",tWhoV:"كل المستويات",tSeatsV:"العائلات",bandCta:"انضم للفرقة",
bookLabel:"احجز حصة تجريبية مجانية",bookTitle:"تلات خطوات. من غير حساب.",
bookLead:"اختار الآلة والوقت اللي يناسبك. هنأكدلك الحصة على واتساب، زي ما أغلب العائلات بتكلمنا.",
tick1:"أول حصة مجانية مع مدرب",tick2:"أطفال وكبار",tick3:"تأكيد على واتساب",
s1:"الآلة",s2:"الوقت",s3:"البيانات",q1:"أنهي آلة؟",q2:"إيه الوقت اللي يناسبك؟",q3:"بياناتك",continue:"التالي",back:"رجوع",
tA:"وسط الأسبوع بعد الضهر",tAs:"الحد – الخميس · 3 – 6 م",tB:"وسط الأسبوع بالليل",tBs:"الحد – الخميس · 6 – 10 م",tC:"السبت",tCs:"12 – 10 م",
fName:"اسم ولي الأمر أو الطالب",phName:"مثلاً منى علي",fPhone:"رقم الواتساب",fAge:"سن الطالب (اختياري)",
eName:"اكتب اسم عشان نعرف نسأل على مين.",ePhone:"اكتب رقم موبايل مصري من 11 رقم.",send:"احجز حصتي المجانية",sending:"جاري الإرسال…",
doneT:"وصلنا طلبك",doneD:"هنبعتلك على واتساب نأكد معاد الحصة.",again:"احجز حصة تانية",
errSend:"مقدرناش نبعت طلبك. جرّب تاني أو كلمنا على واتساب.",previewNote:"معاينة: مفيش حاجة اتبعتت.",orWa:"أو كلمنا على",
finLabel:"وتر يعني string",finTitle:"كل موسيقي بيبدأ بوتر واحد.",
finLead:"شعارنا هو كلمة وتر، مقطوعة بقنوات بنفس العرض. القنوات دي هي الأوتار. جرّب تعزف عليها.",
fDesc:"مدرسة موسيقى للأطفال والكبار في المقطم، القاهرة.",fProg:"البرامج",fSchool:"الأكاديمية",fVisit:"زورنا",
addr:"المقطم، خلف حسني",h1:"الحد – الخميس · 3 – 10 م",h2:"السبت · 12 – 10 م",rights:"© 2026 أكاديمية وتر",made:"أسود وأبيض ودهبي · معمول في القاهرة"}
};
const EXTRA={"en": {"brand": "Wattar Academy", "navHome": "Home", "navAbout": "About", "navPrograms": "Programs", "navContact": "Contact", "navPortal": "Student Portal", "langToggle": "العربية", "heroEyebrow": "Music academy · Mokattam, Cairo", "heroTitle1": "Where music", "heroTitle2": "begins.", "heroSubtitle": "A structured 4-year journey from your very first note to the stage — guitar, piano, violin, drums, oud and vocals, for every age.", "heroCta": "Explore programs", "heroContact": "Book a free trial", "soundOff": "Sound off", "soundOn": "Sound on", "strumHint": "Swipe across the strings to play", "statStudents": "Active students", "statInstruments": "Instruments", "statLevels": "Progressive levels", "statYears": "Year curriculum", "whyKicker": "Why Wattar", "featTitle": "Built to turn beginners into musicians", "featSubtitle": "A structured approach to music education that builds real skills.", "feat1Title": "Structured curriculum", "feat1Desc": "48 levels over 4 years, each with 4 sessions designed to build skills step by step.", "feat2Title": "Expert trainers", "feat2Desc": "Learn from professional musicians who are passionate about teaching and dedicated to your growth.", "feat3Title": "Student portal", "feat3Desc": "Track your progress, practice assignments and your roadmap online, anytime.", "feat4Title": "Wattar Band", "feat4Desc": "Join our academy band and feel the thrill of performing live with fellow musicians.", "instrKicker": "Programs", "instrTitle": "Find the instrument that speaks to you", "instrSubtitle": "Each taught by specialized trainers, from first lesson to performance.", "guitar": "Guitar", "piano": "Piano", "violin": "Violin", "drums": "Drums", "oud": "Oud", "vocals": "Vocals", "guitarDesc": "Acoustic & electric, chords to solos.", "pianoDesc": "Reading, technique and repertoire.", "violinDesc": "Bowing, tone and classical pieces.", "drumsDesc": "Groove, timing and coordination.", "oudDesc": "Maqamat and the Arabic tradition.", "vocalsDesc": "Breathing, pitch and stage confidence.", "currKicker": "The journey", "currTitle": "4 years. 48 levels. One musician.", "currSubtitle": "A progressive path from beginner to advanced musician.", "year1": "Year 1", "year1Title": "Foundation", "year1Desc": "Core skills, proper technique and music reading.", "year2": "Year 2", "year2Title": "Development", "year2Desc": "Wider repertoire, new styles and ensemble playing.", "year3": "Year 3", "year3Title": "Refinement", "year3Desc": "Advanced technique, expression and performance prep.", "year4": "Year 4", "year4Title": "Mastery", "year4Desc": "Professional-level skills, solo performance and a graduation recital.", "monthsY1": "Months 1–12", "monthsY2": "Months 13–24", "monthsY3": "Months 25–36", "monthsY4": "Months 37–48", "bandKicker": "On stage", "bandTitle": "More than lessons — a real band.", "bandDesc": "Selected students join the Wattar Band: they rehearse together, perform live and discover the collaborative side of music. The band runs in cycles with regular rehearsals and shows.", "bandCta": "Join the band", "ctaKicker": "Start today", "ctaTitle": "Your first note is one message away.", "ctaSubtitle": "Tell us which instrument you love and we'll set up a free trial session.", "footerDesc": "Professional music education for all ages and skill levels.", "footerPages": "Pages", "footerPrograms": "Programs", "footerVisit": "Visit us", "contAddressVal": "Mokattam, Behind Hosny", "hoursA": "Sun – Thu: 3PM – 10PM", "hoursB": "Sat: 12PM – 10PM", "footerRights": "© 2026 Wattar Academy. All rights reserved.", "footerMade": "Made with ♪ in Cairo", "aboutKicker": "About us", "aboutHeroTitle1": "Building musicians,", "aboutHeroTitle2": "one note at a time.", "aboutHeroSubtitle": "Wattar Academy is a music school in Mokattam where every student follows a clear path, with trainers who know their name, their level and their next step.", "aboutTitle": "Our story", "aboutText1": "Wattar Academy was founded with a simple mission: to make quality music education accessible to everyone. We believe that music is a universal language that connects people and enriches lives.", "aboutText2": "Our structured 4-year curriculum takes students from their very first note to confident performance, with personalized attention and professional guidance at every step.", "valuesKicker": "What we believe", "valuesTitle": "Our values", "val1Title": "Excellence", "val1Desc": "We hold ourselves and our students to the highest standards of musical education.", "val2Title": "Passion", "val2Desc": "Music is not just what we teach — it's who we are. That passion drives everything we do.", "val3Title": "Community", "val3Desc": "We build a supportive environment where students inspire and learn from each other.", "methodKicker": "How we teach", "methodTitle": "The Wattar method", "methodSubtitle": "Every student moves through the same clear cycle, level after level.", "m1Title": "Find your level", "m1Desc": "A first session with a trainer to see where you are and which level to start from.", "m2Title": "Learn in levels", "m2Desc": "Each level is 4 sessions, with practice assignments waiting for you in the student portal.", "m3Title": "Evaluate & move up", "m3Desc": "Your trainer evaluates every level before you move on, so progress is real and measurable.", "m4Title": "Perform", "m4Desc": "Recitals, the Wattar Band and the graduation recital put your skills on stage.", "progKicker": "Programs", "progHeroTitle1": "Six instruments.", "progHeroTitle2": "One clear path.", "progHeroSubtitle": "Pick your instrument and follow a structured program built from 48 levels, each with 4 sessions and a trainer who specializes in it.", "learnLabel": "What you'll learn", "bookThis": "Book a trial", "catStrings": "Strings", "catKeys": "Keys", "catBowed": "Bowed strings", "catPercussion": "Percussion", "catArabic": "Arabic tradition", "catVoice": "Voice", "guitarLong": "From your first chords to confident solos. Learn acoustic and electric guitar with songs you actually want to play.", "guitarL1": "Chords, strumming and rhythm", "guitarL2": "Reading notes and tabs", "guitarL3": "Scales, solos and improvisation", "pianoLong": "Build strong foundations in reading music and two-hand coordination, then grow into classical and modern repertoire.", "pianoL1": "Reading sheet music", "pianoL2": "Two-hand coordination and technique", "pianoL3": "Classical and modern pieces", "violinLong": "Develop a beautiful tone through posture, bow control and ear training, with classical and Arabic pieces.", "violinL1": "Posture and bow control", "violinL2": "Intonation and ear training", "violinL3": "Classical and Arabic repertoire", "drumsLong": "Find the groove. Build timing, coordination and the confidence to hold a band together.", "drumsL1": "Rhythm, timing and reading", "drumsL2": "Grooves and fills in many styles", "drumsL3": "Playing with other musicians", "oudLong": "Learn the king of Arabic instruments, from the risha technique to the maqamat behind the classics.", "oudL1": "Risha technique and tone", "oudL2": "Maqamat basics", "oudL3": "Classic Arabic songs", "vocalsLong": "Train your voice with breathing, support and pitch work, then bring it to the stage with confidence.", "vocalsL1": "Breathing and support", "vocalsL2": "Pitch, range and ear training", "vocalsL3": "Performing on stage", "contKicker": "Contact", "contHeroTitle1": "Let's start your", "contHeroTitle2": "musical journey.", "contHeroSubtitle": "Send us your details and the instrument you love. We'll call you back to set up a free trial session.", "formTitle": "Book a free trial", "formName": "Full name", "formPhone": "Phone number", "formEmail": "Email (optional)", "formInstrument": "Instrument of interest", "formSelect": "Select an instrument", "formAge": "Age (optional)", "formMessage": "Message (optional)", "formSubmit": "Send", "formSending": "Sending…", "formSuccess": "Thank you! We'll be in touch soon.", "formSuccessSub": "Our team will call you on the number you gave us.", "formErrRequired": "Please enter your name and phone number.", "formErrServer": "We couldn't send your message. Please try again or reach us on WhatsApp.", "formErrNet": "Connection problem. Check your internet and try again.", "contAddress": "Address", "contPhone": "Phone & WhatsApp", "contHours": "Working hours", "contFollow": "Follow us", "whatsappCta": "Chat on WhatsApp", "mapTitle": "Find us", "openMaps": "Open in Google Maps", "storyLabel": "Our story", "storyTitle": "Music should be learned the way it is played: one step at a time, with someone who loves it.", "valuesLead": "Three things we hold on to, in every lesson.", "visitLabel": "Visit us", "pathLabel": "The path", "pathTitle": "4 years. 48 levels. One musician."}, "ar": {"brand": "أكاديمية وتر", "navHome": "الرئيسية", "navAbout": "مين احنا", "navPrograms": "البرامج", "navContact": "كلمنا", "navPortal": "بوابة الطالب", "langToggle": "English", "heroEyebrow": "أكاديمية موسيقى · المقطم، القاهرة", "heroTitle1": "هنا الموسيقى", "heroTitle2": "بتبدأ.", "heroSubtitle": "رحلة منظمة 4 سنين من أول نغمة لحد المسرح — جيتار، بيانو، كمان، درامز، عود وغناء، لكل الأعمار.", "heroCta": "اعرف برامجنا", "heroContact": "احجز حصة تجريبية مجانية", "soundOff": "الصوت مقفول", "soundOn": "الصوت شغال", "strumHint": "حرّك إيدك على الأوتار عشان تعزف", "statStudents": "طالب نشط", "statInstruments": "آلات موسيقية", "statLevels": "مستوى متدرج", "statYears": "سنين منهج", "whyKicker": "ليه وتر", "featTitle": "معمولة عشان تحوّل المبتدئ لموسيقي", "featSubtitle": "طريقة منظمة لتعليم الموسيقى بتبني مهارات حقيقية.", "feat1Title": "منهج منظم", "feat1Desc": "48 مستوى على 4 سنين، كل مستوى 4 حصص مصممة تبني مهاراتك خطوة بخطوة.", "feat2Title": "مدربين محترفين", "feat2Desc": "اتعلم من موسيقيين محترفين بيحبوا التدريس ومهتمين بتطويرك.", "feat3Title": "بوابة الطالب", "feat3Desc": "تابع تقدمك وواجبات التمرين وخطتك أونلاين في أي وقت.", "feat4Title": "فرقة وتر", "feat4Desc": "انضم لفرقة الأكاديمية وجرب إحساس العزف لايف مع زمايلك.", "instrKicker": "البرامج", "instrTitle": "لاقي الآلة اللي تشبهك", "instrSubtitle": "كل آلة بيدرسها مدربين متخصصين، من أول حصة لحد العرض.", "guitar": "جيتار", "piano": "بيانو", "violin": "كمان", "drums": "درامز", "oud": "عود", "vocals": "غناء", "guitarDesc": "أكوستيك وإلكتريك، من الكوردات للسولو.", "pianoDesc": "قراءة نوتة وتكنيك ومقطوعات.", "violinDesc": "القوس والصوت والمقطوعات الكلاسيك.", "drumsDesc": "الجروف والتايمنج والتنسيق.", "oudDesc": "المقامات والتراث العربي.", "vocalsDesc": "التنفس والطبقة والثقة على المسرح.", "currKicker": "الرحلة", "currTitle": "4 سنين. 48 مستوى. موسيقي واحد.", "currSubtitle": "مسار متدرج من المبتدئ للموسيقي المتقدم.", "year1": "السنة الأولى", "year1Title": "الأساسيات", "year1Desc": "المهارات الأساسية والتكنيك الصح وقراءة النوتة.", "year2": "السنة التانية", "year2Title": "التطوير", "year2Desc": "مقطوعات أكتر وأنماط جديدة وعزف جماعي.", "year3": "السنة التالتة", "year3Title": "الصقل", "year3Desc": "تكنيك متقدم وتعبير موسيقي وتحضير للعروض.", "year4": "السنة الرابعة", "year4Title": "الإتقان", "year4Desc": "مهارات احترافية وأداء منفرد وحفلة تخرج.", "monthsY1": "شهر 1–12", "monthsY2": "شهر 13–24", "monthsY3": "شهر 25–36", "monthsY4": "شهر 37–48", "bandKicker": "على المسرح", "bandTitle": "أكتر من دروس — فرقة بجد.", "bandDesc": "بيتم اختيار طلاب ينضموا لفرقة وتر: بيتدربوا مع بعض ويعملوا عروض لايف ويكتشفوا الجانب الجماعي من الموسيقى. الفرقة بتشتغل بدورات فيها بروفات وعروض منتظمة.", "bandCta": "انضم للفرقة", "ctaKicker": "ابدأ النهارده", "ctaTitle": "أول نغمة ليك على بعد رسالة.", "ctaSubtitle": "قولنا الآلة اللي بتحبها وهنظبطلك حصة تجريبية مجانية.", "footerDesc": "تعليم موسيقى محترف لكل الأعمار والمستويات.", "footerPages": "الصفحات", "footerPrograms": "البرامج", "footerVisit": "زورنا", "contAddressVal": "المقطم، خلف حسني", "hoursA": "الحد – الخميس: 3 العصر – 10 بليل", "hoursB": "السبت: 12 الضهر – 10 بليل", "footerRights": "© 2026 أكاديمية وتر. كل الحقوق محفوظة.", "footerMade": "معمول بـ ♪ في القاهرة", "aboutKicker": "مين احنا", "aboutHeroTitle1": "بنبني موسيقيين،", "aboutHeroTitle2": "نغمة ورا نغمة.", "aboutHeroSubtitle": "أكاديمية وتر مدرسة موسيقى في المقطم، كل طالب فيها ماشي في مسار واضح، مع مدربين عارفين اسمه ومستواه وخطوته الجاية.", "aboutTitle": "حكايتنا", "aboutText1": "أكاديمية وتر اتأسست بهدف بسيط: إن تعليم الموسيقى الكويس يبقى متاح للكل. بنؤمن إن الموسيقى لغة عالمية بتربط الناس ببعض وبتغني حياتهم.", "aboutText2": "المنهج بتاعنا اللي مدته 4 سنين بياخد الطالب من أول نغمة لحد ما يعزف بثقة، مع اهتمام شخصي وتوجيه محترف في كل خطوة.", "valuesKicker": "اللي بنؤمن بيه", "valuesTitle": "قيمنا", "val1Title": "التميز", "val1Desc": "بنلتزم بأعلى معايير التعليم الموسيقي لينا ولطلابنا.", "val2Title": "الشغف", "val2Desc": "الموسيقى مش بس اللي بنعلمه — دي احنا. الشغف ده بيحرك كل حاجة بنعملها.", "val3Title": "المجتمع", "val3Desc": "بنبني بيئة داعمة الطلاب فيها بيلهموا بعض ويتعلموا من بعض.", "methodKicker": "إزاي بنعلّم", "methodTitle": "طريقة وتر", "methodSubtitle": "كل طالب بيمشي في نفس الدورة الواضحة، مستوى ورا مستوى.", "m1Title": "اعرف مستواك", "m1Desc": "أول حصة مع مدرب عشان نعرف انت فين وتبدأ من أنهي مستوى.", "m2Title": "اتعلم بالمستويات", "m2Desc": "كل مستوى 4 حصص، وواجبات التمرين مستنياك في بوابة الطالب.", "m3Title": "تقييم وترقّي", "m3Desc": "المدرب بيقيّم كل مستوى قبل ما تنقل للي بعده، عشان تقدمك يبقى حقيقي.", "m4Title": "اعزف قدام الناس", "m4Desc": "حفلات وفرقة وتر وحفلة التخرج بيطلّعوا مهاراتك على المسرح.", "progKicker": "البرامج", "progHeroTitle1": "ست آلات.", "progHeroTitle2": "مسار واحد واضح.", "progHeroSubtitle": "اختار آلتك وامشي في برنامج منظم من 48 مستوى، كل مستوى 4 حصص مع مدرب متخصص فيها.", "learnLabel": "هتتعلم إيه", "bookThis": "احجز حصة تجريبية", "catStrings": "وتريات", "catKeys": "كيبورد", "catBowed": "وتريات بالقوس", "catPercussion": "إيقاع", "catArabic": "تراث عربي", "catVoice": "صوت", "guitarLong": "من أول كوردات لحد السولو بثقة. اتعلم جيتار أكوستيك وإلكتريك بأغاني انت عايز تعزفها.", "guitarL1": "الكوردات والستروم والإيقاع", "guitarL2": "قراءة النوتة والتابات", "guitarL3": "السلالم والسولو والارتجال", "pianoLong": "ابني أساس قوي في قراءة النوتة والتنسيق بين الإيدين، وبعدها انطلق في المقطوعات الكلاسيك والحديثة.", "pianoL1": "قراءة النوتة", "pianoL2": "التنسيق بين الإيدين والتكنيك", "pianoL3": "مقطوعات كلاسيك وحديثة", "violinLong": "طلّع صوت جميل من خلال الوقفة الصح والتحكم في القوس وتدريب الودن، بمقطوعات كلاسيك وعربي.", "violinL1": "الوقفة والتحكم في القوس", "violinL2": "ضبط النغمة وتدريب الودن", "violinL3": "مقطوعات كلاسيك وعربي", "drumsLong": "لاقي الجروف. ابني التايمنج والتنسيق والثقة إنك تمسك الفرقة كلها.", "drumsL1": "الإيقاع والتايمنج والقراءة", "drumsL2": "جروفات وفيلز في أنماط كتير", "drumsL3": "العزف مع موسيقيين تانيين", "oudLong": "اتعلم سلطان الآلات العربية، من تكنيك الريشة لحد المقامات اللي ورا الأغاني الكلاسيك.", "oudL1": "تكنيك الريشة والصوت", "oudL2": "أساسيات المقامات", "oudL3": "أغاني عربي كلاسيك", "vocalsLong": "درّب صوتك بالتنفس والدعم وضبط الطبقة، وبعدها اطلع بيه على المسرح بثقة.", "vocalsL1": "التنفس والدعم", "vocalsL2": "الطبقة والمساحة وتدريب الودن", "vocalsL3": "الأداء على المسرح", "contKicker": "كلمنا", "contHeroTitle1": "يلا نبدأ", "contHeroTitle2": "رحلتك الموسيقية.", "contHeroSubtitle": "ابعتلنا بياناتك والآلة اللي بتحبها، وهنكلمك نحجزلك حصة تجريبية مجانية.", "formTitle": "احجز حصة تجريبية مجانية", "formName": "الاسم بالكامل", "formPhone": "رقم الموبايل", "formEmail": "الإيميل (اختياري)", "formInstrument": "الآلة اللي عايز تتعلمها", "formSelect": "اختار آلة", "formAge": "السن (اختياري)", "formMessage": "رسالة (اختياري)", "formSubmit": "ابعت", "formSending": "جاري الإرسال…", "formSuccess": "شكراً ليك! هنتواصل معاك قريب.", "formSuccessSub": "فريقنا هيكلمك على الرقم اللي كتبته.", "formErrRequired": "من فضلك اكتب اسمك ورقم موبايلك.", "formErrServer": "مقدرناش نبعت رسالتك. جرب تاني أو كلمنا واتساب.", "formErrNet": "فيه مشكلة في الاتصال. اتأكد من النت وجرب تاني.", "contAddress": "العنوان", "contPhone": "موبايل وواتساب", "contHours": "مواعيد العمل", "contFollow": "تابعنا", "whatsappCta": "كلمنا واتساب", "mapTitle": "مكاننا", "openMaps": "افتح في جوجل ماب", "storyLabel": "حكايتنا", "storyTitle": "الموسيقى بتتعلم زي ما بتتعزف: خطوة خطوة، مع حد بيحبها.", "valuesLead": "تلات حاجات متمسكين بيها في كل حصة.", "visitLabel": "زورنا", "pathLabel": "المسار", "pathTitle": "4 سنين. 48 مستوى. موسيقي واحد."}};
["en","ar"].forEach(l=>{T[l]=Object.assign({},EXTRA[l],T[l])});
let lang='en';try{lang=localStorage.getItem('wattar-lang')||'en'}catch(e){}
function setLanguage(l){
  lang=l;try{localStorage.setItem('wattar-lang',l)}catch(e){}
  const h=document.documentElement;h.lang=l;h.dir=l==='ar'?'rtl':'ltr';
  document.querySelectorAll('[data-i18n]').forEach(el=>{const v=T[l][el.dataset.i18n];if(v==null)return;
    if(el.tagName==='INPUT'||el.tagName==='TEXTAREA')el.placeholder=v;else el.textContent=v});
  if(typeof updateSoundLabel==='function')updateSoundLabel();
}
function toggleLanguage(){setLanguage(lang==='en'?'ar':'en')}
function openDrawer(){document.getElementById('drawer').classList.add('open');document.body.style.overflow='hidden'}
function closeDrawer(){document.getElementById('drawer').classList.remove('open');document.body.style.overflow=''}

const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- loader: the middle channel is plucked, then settles ---------- */
function runLoader(){
  const L=document.getElementById('loader');if(!L)return;
  let seen=false;try{seen=sessionStorage.getItem('wattar-loader')==='1';sessionStorage.setItem('wattar-loader','1')}catch(e){}
  if(seen||reduceMotion){L.remove();return}
  const p=document.getElementById('loaderString'),t0=performance.now(),D=760;
  (function step(now){const t=(now-t0)/D;
    const amp=t<1?Math.sin(t*Math.PI*9)*2.2*Math.pow(1-t,2):0;
    p.setAttribute('d',`M9.5 -1 Q${(9.5+amp).toFixed(3)} 6.6 9.5 14.2`);
    if(t<1)requestAnimationFrame(step);else{L.classList.add('done');setTimeout(()=>L.remove(),450)}
  })(t0);
}

/* ---------- reveal ---------- */
function initReveal(){
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
  const links=[...document.querySelectorAll('.nav-links a[href^="#"]')];
  const secs=links.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
  addEventListener('scroll',()=>{const y=innerHeight*.35;let cur=0;secs.forEach((s,i)=>{if(s.getBoundingClientRect().top<y)cur=i});
    links.forEach((a,i)=>a.classList.toggle('active',i===cur))},{passive:true});
}

/* ---------- audio: plucked strings (Karplus-Strong) + three-note sonic logo ---------- */
let actx=null,master=null,soundOn=false;const bufCache={};
const FREQS=[82.41,110,146.83,196,246.94,329.63];
function ksBuffer(f){const sr=actx.sampleRate,len=Math.floor(sr*2.4),b=actx.createBuffer(1,len,sr),d=b.getChannelData(0),N=Math.round(sr/f);
  let last=0;for(let i=0;i<N;i++){const n=Math.random()*2-1;last=last*.45+n*.55;d[i]=last}
  for(let i=N;i<len;i++)d[i]=.4982*(d[i-N]+d[i-N-1]);return b}
function playFreq(f,vel,when){if(!soundOn||!actx)return;const s=actx.createBufferSource();s.buffer=bufCache[f]||(bufCache[f]=ksBuffer(f));
  const g=actx.createGain();g.gain.value=Math.min(1,.25+(vel||.5)*.6);s.connect(g).connect(master);s.start(actx.currentTime+(when||0))}
function playString(f,vel){playFreq(f,vel)}
function sonicLogo(){[[146.83,0,.55],[220,.2,.6],[293.66,.46,.95]].forEach(([f,t,v])=>playFreq(f,v,t))}
const soundBtn=document.getElementById('soundBtn');
function updateSoundLabel(){if(!soundBtn)return;const sp=soundBtn.querySelector('[data-i18n]');const k=soundOn?'soundOn':'soundOff';sp.dataset.i18n=k;sp.textContent=T[lang][k];soundBtn.classList.toggle('on',soundOn)}
function makeCtx(){if(actx)return true;const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return false;actx=new AC();master=actx.createGain();master.gain.value=.5;
  const comp=actx.createDynamicsCompressor();master.connect(comp).connect(actx.destination);return true}
// called from a click or key press on an instrument: playing turns the sound on
function ensureAudio(){if(!makeCtx())return;if(actx.state==='suspended')actx.resume();if(!soundOn){soundOn=true;updateSoundLabel()}}
if(soundBtn)soundBtn.addEventListener('click',()=>{if(!makeCtx())return;if(actx.state==='suspended')actx.resume();
  soundOn=!soundOn;updateSoundLabel();if(soundOn)sonicLogo()});

/* piano: a few decaying partials, slightly detuned */
function playPiano(f){if(!soundOn||!actx)return;const t=actx.currentTime,out=actx.createGain();out.gain.setValueAtTime(0,t);out.gain.linearRampToValueAtTime(.55,t+.006);
  out.gain.exponentialRampToValueAtTime(.18,t+.35);out.gain.exponentialRampToValueAtTime(.0008,t+2.2);
  const lp=actx.createBiquadFilter();lp.type='lowpass';lp.frequency.setValueAtTime(Math.min(9000,f*9),t);lp.frequency.exponentialRampToValueAtTime(Math.max(600,f*2),t+1.2);
  out.connect(lp).connect(master);
  [[1,1],[2,.42],[3,.18],[4,.09],[5,.04]].forEach(([h,g],i)=>{const o=actx.createOscillator(),gg=actx.createGain();o.type=i?'sine':'triangle';o.frequency.value=f*h*(1+(i?.0009*i:0));gg.gain.value=g;o.connect(gg).connect(out);o.start(t);o.stop(t+2.3)})}
/* drums: synthesized kit */
let noiseBuf=null;function noise(){if(noiseBuf)return noiseBuf;const len=actx.sampleRate;noiseBuf=actx.createBuffer(1,len,actx.sampleRate);const d=noiseBuf.getChannelData(0);for(let i=0;i<len;i++)d[i]=Math.random()*2-1;return noiseBuf}
function playDrum(type){if(!soundOn||!actx)return;const t=actx.currentTime;
  const env=(g,a,d)=>{const n=actx.createGain();n.gain.setValueAtTime(a,t);n.gain.exponentialRampToValueAtTime(.001,t+d);n.connect(master);return n};
  if(type==='kick'||type==='tom'){const o=actx.createOscillator();o.type='sine';const f0=type==='kick'?150:210,f1=type==='kick'?44:96;
    o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(f1,t+(type==='kick'?.14:.22));o.connect(env(0,type==='kick'?1:.7,type==='kick'?.5:.45));o.start(t);o.stop(t+.6)}
  if(type==='snare'){const n=actx.createBufferSource();n.buffer=noise();const hp=actx.createBiquadFilter();hp.type='highpass';hp.frequency.value=1400;n.connect(hp).connect(env(0,.6,.22));n.start(t);n.stop(t+.3);
    const o=actx.createOscillator();o.type='triangle';o.frequency.setValueAtTime(220,t);o.frequency.exponentialRampToValueAtTime(160,t+.1);o.connect(env(0,.35,.12));o.start(t);o.stop(t+.2)}
  if(type==='cymbal'){const n=actx.createBufferSource();n.buffer=noise();const hp=actx.createBiquadFilter();hp.type='highpass';hp.frequency.value=6500;
    const bp=actx.createBiquadFilter();bp.type='peaking';bp.frequency.value=9000;bp.gain.value=6;n.connect(hp).connect(bp).connect(env(0,.32,1.4));n.start(t);n.stop(t+1.5)}
}

/* ---------- 3-step free-trial booking ---------- */
function initBooking(){
  const W=document.getElementById('widget');if(!W)return;
  const state={inst:'',time:''};
  const panels=[...W.querySelectorAll('[data-panel]')],steps=[...W.querySelectorAll('.progress [data-step]')];
  const form=document.getElementById('bookForm'),done=document.getElementById('bookDone'),err=document.getElementById('bookErr');
  function go(n){panels.forEach(p=>p.hidden=+p.dataset.panel!==n);done.hidden=true;
    steps.forEach(s=>{const k=+s.dataset.step;s.classList.toggle('on',k===n);s.classList.toggle('done',k<n)})}
  W.querySelectorAll('[data-group]').forEach(g=>{
    g.addEventListener('click',e=>{const c=e.target.closest('.choice');if(!c)return;
      g.querySelectorAll('.choice').forEach(x=>x.setAttribute('aria-checked',x===c?'true':'false'));
      state[g.dataset.group]=c.dataset.value;g.closest('.panel').querySelector('[data-next]:not(.back)').disabled=false});
  });
  W.querySelectorAll('[data-next]').forEach(b=>b.addEventListener('click',()=>go(+b.dataset.next)));
  document.querySelectorAll('[data-pick]').forEach(a=>a.addEventListener('click',()=>{
    const c=W.querySelector(`[data-group="inst"] .choice[data-value="${a.dataset.pick}"]`);if(c)c.click();go(c?2:1)}));
  const fld=(id,ok)=>{const f=document.getElementById(id);f.classList.toggle('err',!ok);f.querySelector('.msg').hidden=ok;return ok};
  function normPhone(v){v=v.replace(/[\s\-().]/g,'');if(v.startsWith('+20'))v='0'+v.slice(3);else if(v.startsWith('0020'))v='0'+v.slice(4);else if(v.startsWith('20')&&v.length===12)v='0'+v.slice(2);return v}
  form.addEventListener('submit',e=>{
    e.preventDefault();err.hidden=true;
    const name=form.elements.name.value.trim(),phone=normPhone(form.elements.phone.value),age=form.elements.age.value.trim();
    const a=fld('fName',name.length>1),b=fld('fPhone',/^01[0125]\d{8}$/.test(phone));if(!a){form.elements.name.focus();return}if(!b){form.elements.phone.focus();return}
    const btn=form.querySelector('[type=submit]'),lab=btn.querySelector('[data-i18n]');btn.disabled=true;lab.textContent=T[lang].sending;
    const finish=(ok,preview)=>{btn.disabled=false;lab.textContent=T[lang].send;
      if(ok){form.hidden=true;done.hidden=false;steps.forEach(s=>{s.classList.remove('on');s.classList.add('done')});
        if(preview){const p=done.querySelector('p');p.textContent=T[lang].doneD+' ('+T[lang].previewNote+')'}}
      else{err.textContent=T[lang].errSend;err.hidden=false}};
    const isPreview=location.protocol==='file:'||/claude/.test(location.hostname);
    if(isPreview){setTimeout(()=>finish(true,true),500);return}
    fetch('/api/public/lead',{method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({name,phone,age,instrument:state.inst,message:'Free trial request — preferred time: '+state.time+' (website booking)'})})
      .then(r=>r.json()).then(d=>finish(!!d.success)).catch(()=>finish(false));
  });
  document.getElementById('bookAgain').addEventListener('click',()=>{form.reset();W.querySelectorAll('.choice').forEach(c=>c.setAttribute('aria-checked','false'));
    W.querySelectorAll('[data-next]:not(.back)').forEach(b=>b.disabled=true);state.inst=state.time='';go(1)});
  go(1);
  const mm=location.hash.match(/^#book-(\w+)/);
  if(mm){const v={oud:'Oud',piano:'Piano',guitar:'Guitar',violin:'Violin',drums:'Drums',voice:'Voice',vocals:'Voice'}[mm[1]];
    const c=v&&W.querySelector(`[data-group="inst"] .choice[data-value="${v}"]`);if(c){c.click();go(2)}
    setTimeout(()=>document.getElementById('book').scrollIntoView(),50)}
}

/* ---------- Play section tabs ---------- */
function initPlay(){
  const sec=document.getElementById('play');if(!sec)return;
  const how=document.getElementById('playHow'),kbd=document.getElementById('playKbd');
  const K={piano:['A','S','D','F','G','H','J','K'],drums:['F','J','K','L'],oud:['1','2','3','4','5']};
  sec.querySelectorAll('[role=tab]').forEach(b=>b.addEventListener('click',()=>{
    sec.querySelectorAll('[role=tab]').forEach(x=>x.setAttribute('aria-selected',x===b?'true':'false'));
    const ty=b.dataset.type,k='how'+ty[0].toUpperCase()+ty.slice(1);how.dataset.i18n=k;how.textContent=T[lang][k];
    kbd.innerHTML=K[ty].map(x=>'<kbd>'+x+'</kbd>').join('');
    if(window.wattarSetInstrument)window.wattarSetInstrument(sec,ty)}));
}
/* ================= 3D scene: instruments ride with their sections, gold stream between them ================= */
function initScene(){
  const canvas=document.getElementById('bg3d');
  let renderer;
  try{if(!window.THREE)throw 0;renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'high-performance'})}
  catch(e){document.body.classList.add('no-webgl');return}
  const mobile=()=>innerWidth<760;
  renderer.setPixelRatio(Math.min(devicePixelRatio,mobile()?1.6:2));
  renderer.outputEncoding=THREE.sRGBEncoding;
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(35,1,.1,200);camera.position.set(0,0,14);
  const root=new THREE.Group();scene.add(root);
  const V=(x,y,z)=>new THREE.Vector3(x,y,z);

  /* ---------- shared materials & helpers ---------- */
  const glow=c=>new THREE.MeshBasicMaterial({color:c});
  const gloss=(c,e)=>new THREE.MeshPhysicalMaterial({color:c,metalness:.35,roughness:.22,clearcoat:1,clearcoatRoughness:.12,emissive:e||0x050506});
  const metal=c=>new THREE.MeshStandardMaterial({color:c,metalness:.9,roughness:.25});
  const matte=c=>new THREE.MeshStandardMaterial({color:c,roughness:.6});
  const box=(w,h,d,m,x,y,z,p)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);p.add(o);return o};
  const ew=(y,c,rx,ry)=>{const d=(y-c)/ry;return Math.abs(d)>=1?0:rx*Math.sqrt(1-d*d)};
  function outlineFrom(hw,y0,y1,n){const r=[];for(let i=0;i<=n;i++){const y=y0+(y1-y0)*i/n;r.push(new THREE.Vector2(hw(y),y))}
    return r.concat(r.slice(1,-1).reverse().map(v=>new THREE.Vector2(-v.x,v.y)))}
  function neonLine(pts,color,parent,op){const l=new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color,transparent:true,opacity:op||.95}));parent.add(l);return l}
  const white=new THREE.Color(0xffffff);
  // vibrating strings
  function makeStrings(parent,defs){
    const SEG=40;
    return defs.map((d,i)=>{
      const pos=new Float32Array((SEG+1)*3);
      for(let j=0;j<=SEG;j++){const t=j/SEG;pos[j*3]=d.a.x+(d.b.x-d.a.x)*t;pos[j*3+1]=d.a.y+(d.b.y-d.a.y)*t;pos[j*3+2]=d.a.z+(d.b.z-d.a.z)*t}
      const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));
      const base=new THREE.Color(d.color);
      const line=new THREE.Line(g,new THREE.LineBasicMaterial({color:base.clone(),transparent:true,opacity:.95}));parent.add(line);
      const L=Math.hypot(d.b.x-d.a.x,d.b.y-d.a.y)||1;
      return{a:d.a,b:d.b,line,base,amp:0,ph:0,w:38+i*7,SEG,prevSide:null,nx:-(d.b.y-d.a.y)/L,ny:(d.b.x-d.a.x)/L};
    });
  }
  function updateStrings(arr,dt,decay){
    arr.forEach(s=>{const A=s.line.geometry.attributes.position,arr2=A.array,S=s.SEG;
      if(s.amp>.0005){s.ph+=dt*s.w;
        for(let j=1;j<S;j++){const u=j/S;const d=s.amp*Math.sin(Math.PI*u)*Math.sin(s.ph)+s.amp*.35*Math.sin(2*Math.PI*u)*Math.sin(s.ph*2.03);arr2[j*3]=s.a.x+(s.b.x-s.a.x)*u+d*s.nx;arr2[j*3+1]=s.a.y+(s.b.y-s.a.y)*u+d*s.ny}
        A.needsUpdate=true;s.amp*=Math.pow(decay||.06,dt);s.line.material.color.copy(s.base).lerp(white,Math.min(1,s.amp*8));
      }else if(s.amp!==0){s.amp=0;for(let j=1;j<S;j++){arr2[j*3]=s.a.x+(s.b.x-s.a.x)*j/S;arr2[j*3+1]=s.a.y+(s.b.y-s.a.y)*j/S}A.needsUpdate=true;s.line.material.color.copy(s.base)}
    });
  }

  /* ---------- 1. GUITAR ---------- */
  function makeGuitar(){
    const m=new THREE.Group(),g=new THREE.Group();m.add(g);g.rotation.z=-.62;
    const inner=new THREE.Group();g.add(inner);inner.position.y=-1.95;inner.scale.setScalar(.93);
    const hw=y=>{const a=ew(y,-.75,1.25,1.05),b=ew(y,.62,.98,.82),k=5;return Math.pow(Math.pow(a,k)+Math.pow(b,k),1/k)};
    const outline=outlineFrom(hw,-1.8,1.44,90);
    const shape=new THREE.Shape(outline);const hole=new THREE.Path();hole.absarc(0,.42,.36,0,Math.PI*2,true);shape.holes.push(hole);
    const geo=new THREE.ExtrudeGeometry(shape,{depth:.42,bevelEnabled:true,bevelThickness:.07,bevelSize:.06,bevelSegments:4,curveSegments:32});geo.translate(0,0,-.21);
    inner.add(new THREE.Mesh(geo,gloss(0x111113)));
    const rp=outline.map(v=>V(v.x*1.035,v.y,.29));rp.push(rp[0].clone());neonLine(rp,0xc9a24f,inner);
    const rb=neonLine(rp,0xe6c873,inner,.7);rb.position.z=-.58;
    const r1=new THREE.Mesh(new THREE.TorusGeometry(.43,.025,12,80),glow(0xc9a24f));r1.position.set(0,.42,.28);inner.add(r1);
    const r2=new THREE.Mesh(new THREE.TorusGeometry(.5,.012,8,80),glow(0xc9a24f));r2.position.set(0,.42,.28);inner.add(r2);
    const ins=new THREE.Mesh(new THREE.CircleGeometry(.37,48),glow(0x020202));ins.position.set(0,.42,-.1);inner.add(ins);
    const NUT=4.94,BR=-1.0,L=NUT-BR,dark=gloss(0x0e0e10);
    box(.44,3.7,.24,dark,0,3.19,.08,inner);box(.42,3.55,.05,matte(0x060606),0,NUT-1.775,.235,inner);
    const fm=glow(0xb8b8bc);for(let n=1;n<=15;n++)box(.42,.022,.03,fm,0,NUT-L*(1-Math.pow(2,-n/12)),.27,inner);
    [3,5,7,9,12].forEach(n=>{const y=NUT-L*((1-Math.pow(2,-n/12))+(1-Math.pow(2,-(n-1)/12)))/2;(n===12?[-.09,.09]:[0]).forEach(x=>{const d=new THREE.Mesh(new THREE.CircleGeometry(.035,20),glow(0xc9a24f));d.position.set(x,y,.262);inner.add(d)})});
    const head=box(.62,1.05,.16,dark,0,NUT+.56,.05,inner);
    const he=new THREE.LineSegments(new THREE.EdgesGeometry(head.geometry),new THREE.LineBasicMaterial({color:0xe6c873}));he.position.copy(head.position);inner.add(he);
    box(.44,.05,.07,glow(0xf5f3ee),0,NUT,.28,inner);
    for(let i=0;i<6;i++){const s=i<3?-1:1,yy=NUT+.22+(i%3)*.3;const p=new THREE.Mesh(new THREE.CylinderGeometry(.035,.035,.32,12),metal(0xbfc7da));p.rotation.z=Math.PI/2;p.position.set(s*.42,yy,.05);inner.add(p);
      const k=new THREE.Mesh(new THREE.SphereGeometry(.07,16,12),glow(i%2?0xc9a24f:0xc9a24f));k.scale.set(.6,1,1);k.position.set(s*.6,yy,.05);inner.add(k)}
    box(1.0,.16,.08,matte(0x060606),0,BR,.3,inner);box(.6,.025,.04,glow(0xf5f3ee),0,BR+.04,.35,inner);
    const cols=[0xc9a24f,0xe6c873,0xf5f3ee,0xe6c873,0xc9a24f,0xf5f3ee];
    const strings=makeStrings(inner,cols.map((c,i)=>({a:V(-.25+i*.1,BR+.04,.37),b:V(-.16+i*.064,NUT,.31),color:c})));
    return{model:m,strings,inner,pluckable:true,freqs:FREQS,colors:[0xe6c873,0xc9a24f],
      update(t,dt){updateStrings(strings,dt)}};
  }

  /* ---------- 2. PIANO ---------- */
  function makePiano(){
    const m=new THREE.Group(),g=new THREE.Group();m.add(g);g.rotation.set(.72,-.28,0);
    const N=14,kw=.42,gap=.035,step=kw+gap,total=N*step,x0=-total/2+step/2;
    const body=box(total+.6,.5,2.5,gloss(0x111113),0,-.32,-.35,g);
    const be=new THREE.LineSegments(new THREE.EdgesGeometry(body.geometry),new THREE.LineBasicMaterial({color:0xc9a24f,transparent:true,opacity:.8}));be.position.copy(body.position);g.add(be);
    const back=box(total+.6,1.3,.18,gloss(0x111113),0,.38,-1.5,g);
    box(total+.4,.04,.04,glow(0xc9a24f),0,1.02,-1.4,g);
    box(total+.4,.03,.03,glow(0xc9a24f),0,-.06,.92,g);
    const keys=[];
    for(let i=0;i<N;i++){const mat=new THREE.MeshPhysicalMaterial({color:0xf5f3ee,roughness:.25,clearcoat:1,emissive:0x111111});
      const k=box(kw,.24,1.9,mat,x0+i*step,0,.0,g);keys.push({mesh:k,mat,base:0,black:false,i})}
    const blackAfter=[0,1,3,4,5];
    for(let o=0;o<2;o++)blackAfter.forEach(b=>{const i=o*7+b;if(i>=N-1)return;const mat=new THREE.MeshPhysicalMaterial({color:0x0b0716,roughness:.3,clearcoat:1,emissive:0x000000});
      const k=box(kw*.58,.26,1.15,mat,x0+i*step+step/2,.2,-.36,g);box(kw*.5,.02,.02,glow(0xe6c873),x0+i*step+step/2,.34,.22,g);keys.push({mesh:k,mat,base:.2,black:true,i:i+.5})});
    const cA=new THREE.Color(0xf5f3ee),cHi=new THREE.Color(0xc9a24f),eLo=new THREE.Color(0x111111),eHi=new THREE.Color(0x5a4318),bLo=new THREE.Color(0x000000),bHi=new THREE.Color(0xa67c2e);
    const WM=[60,62,64,65,67,69,71,72,74,76,77,79,81,83];
    keys.forEach(k=>{k.p=0;k.midi=k.black?WM[Math.floor(k.i)]+1:WM[k.i];k.mesh.userData.hit={kind:'key',midi:k.midi,mesh:k.mesh}});
    const I={model:m,colors:[0xc9a24f,0xf5f3ee],played:false,hitTargets:keys.map(k=>k.mesh),
      press(midi){const k=keys.find(q=>q.midi===midi);if(!k)return null;k.p=1;I.played=true;return k.mesh},
      update(t,dt){const idle=I.played?0:1;keys.forEach(k=>{k.p=Math.max(0,k.p-dt*3);const w=idle*Math.pow(Math.max(0,Math.sin(t*2.6-k.i*.55)),10);const p=Math.max(k.p,w);
        k.mesh.position.y=k.base-p*.13;k.mesh.rotation.x=p*.06;
        if(k.black)k.mat.emissive.copy(bLo).lerp(bHi,p);else{k.mat.color.copy(cA).lerp(cHi,p*.6);k.mat.emissive.copy(eLo).lerp(eHi,p)}})}};
    return I;
  }

  /* ---------- 3. VIOLIN ---------- */
  function makeViolin(){
    const m=new THREE.Group(),g=new THREE.Group();m.add(g);g.rotation.z=.55;
    const inner=new THREE.Group();g.add(inner);inner.position.y=-1.1;inner.scale.setScalar(1.05);
    const hw=y=>{const a=ew(y,-.7,.98,.85),b=ew(y,.78,.8,.68),k=7;return Math.pow(Math.pow(a,k)+Math.pow(b,k),1/k)+.02};
    const outline=outlineFrom(hw,-1.55,1.46,110);
    const geo=new THREE.ExtrudeGeometry(new THREE.Shape(outline),{depth:.26,bevelEnabled:true,bevelThickness:.1,bevelSize:.06,bevelSegments:6,curveSegments:24});geo.translate(0,0,-.13);
    inner.add(new THREE.Mesh(geo,gloss(0x1a1410,0x0a0705)));
    const rp=outline.map(v=>V(v.x*1.04,v.y,.24));rp.push(rp[0].clone());neonLine(rp,0xf5f3ee,inner);
    [-1,1].forEach(s=>{const pts=[];for(let i=0;i<=24;i++){const u=i/24;pts.push(V(s*(.36+.07*Math.sin(u*Math.PI*2)),-.55+u*.75,.24))}neonLine(pts,0xc9a24f,inner);
      [0,1].forEach(e=>{const c=new THREE.Mesh(new THREE.CircleGeometry(.035,14),glow(0xc9a24f));c.position.set(s*(.36),e?.2:-.55,.245);inner.add(c)})});
    const dark=gloss(0x0e0e10);
    box(.26,2.05,.18,dark,0,2.45,.05,inner);box(.24,2.65,.05,matte(0x050505),0,1.88,.2,inner);
    box(.22,.5,.18,dark,0,3.68,.03,inner);
    const scroll=new THREE.Mesh(new THREE.TorusGeometry(.13,.05,10,30),gloss(0x1a1410,0x0a0705));scroll.rotation.y=Math.PI/2;scroll.position.set(0,4.02,.03);inner.add(scroll);
    for(let i=0;i<4;i++){const p=new THREE.Mesh(new THREE.CylinderGeometry(.03,.03,.42,10),glow(i%2?0xc9a24f:0xf5f3ee));p.rotation.z=Math.PI/2;p.position.set(0,3.55+i*.1,.03);inner.add(p)}
    box(.5,.14,.03,glow(0xf5f3ee),0,-.32,.32,inner);
    box(.24,.7,.05,matte(0x050505),0,-1.08,.26,inner);
    const cols=[0xf5f3ee,0xc9a24f,0xf5f3ee,0xc9a24f];
    const strings=makeStrings(inner,cols.map((c,i)=>({a:V(-.08+i*.053,-.75,.3),b:V(-.06+i*.04,3.2,.27),color:c})));
    // bow
    const bowPivot=new THREE.Group();bowPivot.position.set(0,-.05,.48);bowPivot.rotation.z=Math.PI/2-.25;inner.add(bowPivot);
    const bow=new THREE.Group();bowPivot.add(bow);
    const stick=new THREE.Mesh(new THREE.CylinderGeometry(.022,.032,4.6,10),gloss(0x3b1d0e,0x1a0a02));bow.add(stick);
    neonLine([V(.12,-2.2,0),V(.12,2.2,0)],0xc9a24f,bow);
    box(.16,.28,.06,glow(0xc9a24f),.07,-2.25,0,bow);
    return{model:m,colors:[0xf5f3ee,0xc9a24f],
      update(t,dt){bow.position.y=Math.sin(t*1.7)*1.25;
        strings.forEach((s,i)=>{if(i===1||i===2){s.amp=Math.max(s.amp,.02+.012*Math.abs(Math.cos(t*1.7)))}});updateStrings(strings,dt,.2)}};
  }

  /* ---------- 4. DRUMS ---------- */
  function makeDrums(){
    const m=new THREE.Group(),g=new THREE.Group();m.add(g);g.rotation.set(.18,-.4,0);
    const shell=gloss(0x141416,0x050506);
    function drum(r,h,x,y,z,rx,rz,type){const d=new THREE.Group();d.position.set(x,y,z);d.rotation.set(rx,0,rz);g.add(d);d.userData.hit={kind:'drum',type};
      const s=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,48,1,true),shell);s.material.side=THREE.DoubleSide;d.add(s);
      const headMat=new THREE.MeshPhysicalMaterial({color:0xf5f3ee,roughness:.5,emissive:0x111111});
      const head=new THREE.Mesh(new THREE.CircleGeometry(r,48),headMat);head.rotation.x=-Math.PI/2;head.position.y=h/2;d.add(head);
      const rimT=new THREE.Mesh(new THREE.TorusGeometry(r,.035,8,64),glow(0xc9a24f));rimT.rotation.x=Math.PI/2;rimT.position.y=h/2;d.add(rimT);
      const rimB=new THREE.Mesh(new THREE.TorusGeometry(r,.03,8,64),glow(0xe6c873));rimB.rotation.x=Math.PI/2;rimB.position.y=-h/2;d.add(rimB);
      for(let i=0;i<8;i++){const a=i/8*Math.PI*2;box(.05,h*.8,.05,metal(0xbfc7da),Math.cos(a)*(r+.03),0,Math.sin(a)*(r+.03),d)}
      return{d,headMat,rimT}}
    const snare=drum(1.05,.55,0,0,0,.45,0,'snare');
    const tom=drum(.72,.6,-1.55,1.05,-.6,.6,.25,'tom');
    const kick=drum(1.45,1.0,.55,-1.6,-2.0,Math.PI/2-.05,0,'kick');
    const cym=new THREE.Mesh(new THREE.CylinderGeometry(.06,1.35,.1,48),new THREE.MeshStandardMaterial({color:0xe7c56a,metalness:1,roughness:.22,emissive:0x2a1a00}));
    cym.position.set(1.95,1.55,-.7);cym.userData.hit={kind:'drum',type:'cymbal'};cym.rotation.set(.35,0,-.25);g.add(cym);
    const cymRing=new THREE.Mesh(new THREE.TorusGeometry(1.35,.012,6,80),glow(0xe6c873));cymRing.rotation.x=Math.PI/2;cymRing.position.y=-.05;cym.add(cymRing);
    box(.04,2.6,.04,metal(0x9aa3b8),1.95,.25,-.75,g);
    function stick(x,side){const p=new THREE.Group();p.position.set(x,.95,1.4);g.add(p);
      const s=new THREE.Mesh(new THREE.CylinderGeometry(.03,.05,2.3,10),new THREE.MeshStandardMaterial({color:0xf3d9b1,roughness:.5,emissive:0x2a1a0a}));s.position.y=-1.1;s.rotation.x=0;p.add(s);
      const tip=new THREE.Mesh(new THREE.SphereGeometry(.06,10,8),glow(0xc9a24f));tip.position.y=-2.25;p.add(tip);
      p.rotation.set(-1.0,0,side*.35);return p}
    const sL=stick(-.45,-1),sR=stick(.45,1);
    const loC=new THREE.Color(0x111111),hiC=new THREE.Color(0xc9a24f);
    const H={snare:0,tom:0,kick:0,cymbal:0},S={L:0,R:0},deep=new THREE.Color(0xa67c2e);
    const I={model:m,colors:[0xe6c873,0xc9a24f],played:false,hitTargets:[snare.d,tom.d,kick.d,cym],
      hit(type){H[type]=1;I.played=true;if(type==='snare')S.L=1;else if(type!=='kick')S.R=1;
        return type==='snare'?snare.d:type==='tom'?tom.d:type==='kick'?kick.d:cym},
      update(t,dt){
        if(!I.played){const a=Math.abs(Math.sin(t*3.4)),b=Math.abs(Math.sin(t*3.4+Math.PI/2));
          sL.rotation.x=-1.0-a*.55;sR.rotation.x=-1.0-b*.55;H.snare=Math.max(H.snare,Math.pow(1-a,10),Math.pow(1-b,10));
          H.kick=Math.max(H.kick,Math.pow(Math.max(0,Math.sin(t*1.7)),18))}
        else{S.L=Math.max(0,S.L-dt*6);S.R=Math.max(0,S.R-dt*6);sL.rotation.x=-1.55+.55*S.L;sR.rotation.x=-1.55+.55*S.R}
        snare.headMat.emissive.copy(loC).lerp(hiC,H.snare);snare.rimT.scale.setScalar(1+H.snare*.06);
        tom.headMat.emissive.copy(loC).lerp(hiC,H.tom);tom.rimT.scale.setScalar(1+H.tom*.08);
        kick.headMat.emissive.copy(loC).lerp(deep,H.kick);kick.d.scale.setScalar(1+H.kick*.05);
        cym.rotation.z=-.25+Math.sin(t*22)*.09*H.cymbal+Math.sin(t*5)*.02;
        for(const k in H)H[k]=Math.max(0,H[k]-dt*(I.played?3.5:8))}};
    return I;
  }

  /* ---------- 5. OUD ---------- */
  function makeOud(){
    const m=new THREE.Group(),g=new THREE.Group();m.add(g);g.rotation.set(0,-.35,-.55);
    const inner=new THREE.Group();g.add(inner);inner.position.y=-.9;
    const RX=1.3,RY=1.6,RZ=1.05;
    const narrow=yu=>1-.38*Math.max(0,yu);
    const bowlGeo=new THREE.SphereGeometry(1,56,32,0,Math.PI);bowlGeo.rotateY(Math.PI);
    const p=bowlGeo.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i);p.setXYZ(i,x*RX*narrow(y),y*RY,z*RZ)}bowlGeo.computeVertexNormals();
    // ribs need sphere's yu along its own y; SphereGeometry poles are at ±y — good: pear narrows to the top
    const bowl=new THREE.Mesh(bowlGeo,gloss(0x1a140c,0x0a0705));bowl.material.side=THREE.DoubleSide;inner.add(bowl);
    for(let k=1;k<12;k++){const ph=k/12*Math.PI;const pts=[];for(let j=0;j<=40;j++){const th=j/40*Math.PI;let x=-Math.cos(ph)*Math.sin(th),y=Math.cos(th),z=-Math.sin(ph)*Math.sin(th);pts.push(V(x*RX*narrow(y)*1.01,y*RY*1.01,z*RZ*1.01))}
      neonLine(pts,k%2?0xc9a24f:0xc9a24f,inner,.55)}
    const face=outlineFrom(y=>{const yu=y/RY;return Math.abs(yu)>=1?0:RX*Math.sqrt(1-yu*yu)*narrow(yu)},-RY,RY,90);
    const fs=new THREE.Shape(face);
    [[0,.15,.32],[-.36,.78,.12],[.36,.78,.12]].forEach(([x,y,r])=>{const h=new THREE.Path();h.absarc(x,y,r,0,Math.PI*2,true);fs.holes.push(h);
      const ring=new THREE.Mesh(new THREE.TorusGeometry(r+.04,.02,8,60),glow(r>.2?0xc9a24f:0xc9a24f));ring.position.set(x,y,.03);inner.add(ring);
      const ring2=new THREE.Mesh(new THREE.TorusGeometry(r+.1,.008,6,60),glow(0xc9a24f));ring2.position.set(x,y,.03);inner.add(ring2)});
    const faceMesh=new THREE.Mesh(new THREE.ShapeGeometry(fs,32),new THREE.MeshPhysicalMaterial({color:0x15110a,roughness:.35,clearcoat:.8,emissive:0x070504,side:THREE.DoubleSide}));inner.add(faceMesh);
    const fp=face.map(v=>V(v.x,v.y,.02));fp.push(fp[0].clone());neonLine(fp,0xc9a24f,inner);
    const dark=gloss(0x0e0e10);
    box(.38,1.3,.18,dark,0,RY+.55,-.05,inner);box(.34,1.9,.04,matte(0x050505),0,RY+.2,.07,inner);
    const pegbox=new THREE.Group();pegbox.position.set(0,RY+1.2,-.05);pegbox.rotation.x=-1.05;inner.add(pegbox);
    box(.3,1.15,.2,dark,0,.57,0,pegbox);
    for(let i=0;i<5;i++){[-1,1].forEach(s=>{const pg=new THREE.Mesh(new THREE.CylinderGeometry(.03,.03,.38,8),metal(0xd6b37a));pg.rotation.z=Math.PI/2;pg.position.set(s*.25,.2+i*.2,0);pegbox.add(pg);
      const kn=new THREE.Mesh(new THREE.SphereGeometry(.055,10,8),glow(s>0?0xc9a24f:0xc9a24f));kn.position.set(s*.44,.2+i*.2,0);pegbox.add(kn)})}
    box(.62,.08,.05,glow(0xe6c873),0,-.95,.05,inner);
    const cols=[0xc9a24f,0xe6c873,0xf5f3ee,0xc9a24f,0xc9a24f];
    const strings=makeStrings(inner,cols.map((c,i)=>({a:V(-.2+i*.1,-.95,.1),b:V(-.12+i*.06,RY+1.15,.11),color:c})));
    let next=0;
    const I={model:m,inner,strings,pluckable:true,freqs:[130.81,174.61,220,293.66,392],colors:[0xc9a24f,0xe6c873],played:false,
      update(t,dt){if(!I.played&&t>next){const i=Math.floor(Math.random()*5);strings[i].amp=.05+Math.random()*.04;next=t+.25+Math.random()*.45}updateStrings(strings,dt,.08)}};
    return I;
  }

  /* ---------- 6. MICROPHONE ---------- */
  function makeMic(){
    const m=new THREE.Group(),g=new THREE.Group();m.add(g);g.rotation.z=-.3;g.position.y=.6;
    const grill=new THREE.Mesh(new THREE.SphereGeometry(.85,22,16),new THREE.MeshBasicMaterial({color:0xc9a24f,wireframe:true,transparent:true,opacity:.85}));grill.position.y=1;g.add(grill);
    const core=new THREE.Mesh(new THREE.SphereGeometry(.78,32,24),gloss(0x111113));core.position.y=1;g.add(core);
    const band=new THREE.Mesh(new THREE.CylinderGeometry(.8,.72,.25,48),metal(0xc8cfe0));band.position.y=.2;g.add(band);
    const body=new THREE.Mesh(new THREE.CylinderGeometry(.55,.32,2.6,40),gloss(0x111113));body.position.y=-1.2;g.add(body);
    [-.3,-1.3].forEach((y,i)=>{const r=new THREE.Mesh(new THREE.TorusGeometry(i?.43:.53,.025,8,60),glow(i?0xf5f3ee:0xe6c873));r.rotation.x=Math.PI/2;r.position.y=y;g.add(r)});
    box(.18,.32,.05,glow(0xc9a24f),0,-.7,.52,g);
    const waves=[];for(let i=0;i<4;i++){const w=new THREE.Mesh(new THREE.TorusGeometry(1,.014,6,90),new THREE.MeshBasicMaterial({color:i%2?0xc9a24f:0xc9a24f,transparent:true,opacity:0,depthWrite:false}));w.position.y=1;g.add(w);waves.push(w)}
    return{model:m,colors:[0xc9a24f,0xc9a24f],noSample:waves,
      update(t){grill.rotation.y=t*.4;waves.forEach((w,i)=>{const p=((t*.45)+i/4)%1;w.scale.setScalar(.95+p*2.6);w.material.opacity=(1-p)*.8*Math.min(1,p*6)})}};
  }


  /* ---------- 7. THE WATTAR MARK — channels become strings ---------- */
  function makeMark(){
    const GRID=["####.####.#########", "####.####.#########", "####.####.#########", "####.####.#########", "..........####.####", "####.####.####.####", "####.####.####.####", "####.####.####.####", "####.####.####.####", "####.####.####.####", "#########.#########", "#########.#########", "#########.#########", "#########.#########", "####...........####", "####.##############", "####.##############", "####.##############", "####.##############"];
    const m=new THREE.Group(),inner=new THREE.Group();m.add(inner);
    const U=.24,N=19,off=N*U/2,D=.9,X=gx=>gx*U-off,Y=gy=>off-gy*U;
    const mat=new THREE.MeshPhysicalMaterial({color:0xf5f3ee,roughness:.3,metalness:.05,clearcoat:1,clearcoatRoughness:.18,emissive:0x111111});
    // merge rows into vertical stacks of equal runs to avoid seams
    const runs=[];GRID.forEach((row,r)=>{let c=0;while(c<N){if(row[c]==='#'){const s=c;while(c<N&&row[c]==='#')c++;runs.push({s,w:c-s,r,h:1})}else c++}});
    const merged=[];runs.forEach(q=>{const p=merged.find(o=>o.s===q.s&&o.w===q.w&&o.r+o.h===q.r);if(p)p.h++;else merged.push({...q})});
    merged.forEach(q=>{const b=new THREE.Mesh(new THREE.BoxGeometry(q.w*U,q.h*U,D),mat);b.position.set(X(q.s+q.w/2),Y(q.r+q.h/2),0);inner.add(b)});
    const frame=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(N*U+.5,N*U+.5,.02)),new THREE.LineBasicMaterial({color:0xc9a24f,transparent:true,opacity:.55}));frame.position.z=-.6;inner.add(frame);
    const z=.18,E=3.2;
    const segs=[[4.5,-E,4.5,10],[9.5,-E,9.5,14.5],[14.5,4,14.5,10],[4.5,14.5,4.5,19+E],[-E,4.5,9.5,4.5],[4,14.5,15,14.5]];
    const cols=[0xc9a24f,0xe6c873,0xc9a24f,0xe6c873,0xc9a24f,0xe6c873];
    const strings=makeStrings(inner,segs.map((s,i)=>({a:V(X(s[0]),Y(s[1]),z),b:V(X(s[2]),Y(s[3]),z),color:cols[i]})));
    let next=2;
    return{model:m,inner,strings,pluckable:true,freqs:[146.83,174.61,196,220,261.63,293.66],colors:[0xf5f3ee,0xc9a24f],
      update(t,dt){if(!this.played&&t>next){const s=strings[Math.floor(Math.random()*strings.length)];if(s.amp<.01)s.amp=.035;next=t+2.5+Math.random()*2.5}updateStrings(strings,dt,.12)}};
  }


  /* ================= ENGINE ================= */
  const BUILD={guitar:makeGuitar,piano:makePiano,violin:makeViolin,drums:makeDrums,oud:makeOud,mic:makeMic,mark:makeMark};
  const FULL={guitar:1,piano:.95,violin:1.05,drums:.9,oud:1.08,mic:1.05,mark:1};
  const HUDKEY={guitar:'guitar',piano:'piano',violin:'violin',drums:'drums',oud:'oud',mic:'voice',mark:'mark'};
  const NP=mobile()?1400:2200;
  const sstep=(a,b,x)=>{const t=Math.min(1,Math.max(0,(x-a)/(b-a)));return t*t*(3-2*t)};
  const clamp=(x,a,b)=>Math.min(b,Math.max(a,x));

  // surface sampler (points on the instrument's meshes, in model space)
  function samplePoints(I){
    const hidden=I.noSample||[];hidden.forEach(o=>o.visible=false);
    I.model.updateMatrixWorld(true);
    const inv=new THREE.Matrix4().copy(I.model.matrixWorld).invert(),tmp=new THREE.Matrix4(),tris=[];let total=0;
    I.model.traverse(o=>{if(!o.isMesh||!o.visible)return;tmp.multiplyMatrices(inv,o.matrixWorld);
      const pos=o.geometry.attributes.position,idx=o.geometry.index,n=idx?idx.count:pos.count;
      for(let i=0;i+2<n;i+=3){const a=new THREE.Vector3().fromBufferAttribute(pos,idx?idx.getX(i):i).applyMatrix4(tmp),
        b=new THREE.Vector3().fromBufferAttribute(pos,idx?idx.getX(i+1):i+1).applyMatrix4(tmp),c=new THREE.Vector3().fromBufferAttribute(pos,idx?idx.getX(i+2):i+2).applyMatrix4(tmp);
        const ar=new THREE.Vector3().subVectors(b,a).cross(new THREE.Vector3().subVectors(c,a)).length()/2;if(ar<1e-7)continue;total+=ar;tris.push([a,b,c,total])}});
    hidden.forEach(o=>o.visible=true);
    const out=new Float32Array(NP*3);
    for(let k=0;k<NP;k++){const r=Math.random()*total;let lo=0,hi=tris.length-1;while(lo<hi){const mid=(lo+hi)>>1;if(tris[mid][3]<r)lo=mid+1;else hi=mid}
      const[a,b,c]=tris[lo];let u=Math.random(),v=Math.random();if(u+v>1){u=1-u;v=1-v}
      out[k*3]=a.x+(b.x-a.x)*u+(c.x-a.x)*v;out[k*3+1]=a.y+(b.y-a.y)*u+(c.y-a.y)*v;out[k*3+2]=a.z+(b.z-a.z)*u+(c.z-a.z)*v}
    return out;
  }

  /* ---------- sections → instruments ---------- */
  const anchors=[...document.querySelectorAll('[data-inst]')];
  if(!anchors.length){document.body.classList.add('no-webgl');return}
  const entries=anchors.map((a,j)=>({a,j,side:a.dataset.side||(j%2?'left':'right'),dy:parseFloat(a.dataset.y||0),z:a.dataset.side==='center'?-1.5:-.4,
    type:a.dataset.inst,prev:null,swap:1,inst:{},pos:new THREE.Vector3(),appear:0,prog:0,r:null,near:false,focus:false}));
  function inst(e,type){
    if(!e.inst[type]){const I=BUILD[type]();I.type=type;I.holder=new THREE.Group();I.holder.add(I.model);root.add(I.holder);
      I.samples=samplePoints(I);I.holder.visible=false;e.inst[type]=I}
    return e.inst[type]}
  entries.forEach(e=>inst(e,e.type));
  window.wattarSetInstrument=(el,type)=>{const e=entries.find(x=>x.a===el);if(!e||e.type===type||!BUILD[type])return;
    inst(e,type);e.prev=e.type;e.type=type;e.swap=0;buildHud()};

  /* ---------- overlay renderer: gold particles + notes fly above every section ---------- */
  const fxCanvas=document.getElementById('fx3d');let fx=null;const fxScene=new THREE.Scene();
  if(fxCanvas){try{fx=new THREE.WebGLRenderer({canvas:fxCanvas,antialias:false,alpha:true});fx.setPixelRatio(Math.min(devicePixelRatio,1.5));fx.outputEncoding=THREE.sRGBEncoding}catch(e){fx=null}}
  const fxRoot=fx?fxScene:scene;
  const dotTex=(()=>{const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d');const gr=x.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(.35,'rgba(255,255,255,.7)');gr.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=gr;x.fillRect(0,0,64,64);return new THREE.CanvasTexture(c)})();
  const mPos=new Float32Array(NP*3),mCol=new Float32Array(NP*3),seed=new Float32Array(NP);
  const golds=[0xc9a24f,0xe6c873,0xa67c2e,0xc9a24f].map(c=>new THREE.Color(c));
  for(let i=0;i<NP;i++){seed[i]=Math.random();const c=golds[i%4];mCol[i*3]=c.r;mCol[i*3+1]=c.g;mCol[i*3+2]=c.b}
  const mGeo=new THREE.BufferGeometry();mGeo.setAttribute('position',new THREE.BufferAttribute(mPos,3));mGeo.setAttribute('color',new THREE.BufferAttribute(mCol,3));
  const mMat=new THREE.PointsMaterial({size:mobile()?.08:.07,map:dotTex,vertexColors:true,transparent:true,opacity:0,depthWrite:false,blending:fx?THREE.NormalBlending:THREE.AdditiveBlending});
  const morph=new THREE.Points(mGeo,mMat);morph.frustumCulled=false;morph.visible=false;fxRoot.add(morph);

  const noteTex=['♪','♫','♬','♩'].map(ch=>{const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d');x.font='bold 96px serif';x.textAlign='center';x.textBaseline='middle';x.fillStyle='#fff';x.fillText(ch,64,68);return new THREE.CanvasTexture(c)});
  const notes=[];
  function spawnNote(at,color){const sm=new THREE.SpriteMaterial({map:noteTex[Math.floor(Math.random()*4)],color,transparent:true,depthWrite:false});
    const s=new THREE.Sprite(sm);s.position.copy(at);s.scale.setScalar(.5);fxRoot.add(s);notes.push({s,life:1,vx:(Math.random()-.5)*.03,vy:.03+Math.random()*.015});
    if(notes.length>30){const o=notes.shift();fxRoot.remove(o.s);o.s.material.dispose()}}

  /* ---------- stage dressing ---------- */
  const SN=mobile()?260:480,sp=new Float32Array(SN*3),sc=new Float32Array(SN*3);
  for(let i=0;i<SN;i++){sp[i*3]=(Math.random()-.5)*40;sp[i*3+1]=(Math.random()-.5)*26;sp[i*3+2]=-5-Math.random()*16;const c=golds[i%4];sc[i*3]=c.r;sc[i*3+1]=c.g;sc[i*3+2]=c.b}
  const sg=new THREE.BufferGeometry();sg.setAttribute('position',new THREE.BufferAttribute(sp,3));sg.setAttribute('color',new THREE.BufferAttribute(sc,3));
  const stars=new THREE.Points(sg,new THREE.PointsMaterial({size:.08,map:dotTex,vertexColors:true,transparent:true,opacity:.4,depthWrite:false,blending:THREE.AdditiveBlending}));scene.add(stars);
  const bgG=new THREE.Group();scene.add(bgG);
  const bgStrings=makeStrings(bgG,[0,1,2,3,4,5].map(i=>({a:V(-46,-7+i*1.1,-16),b:V(46,-2+i*2.6,-16),color:i%2?0xe6c873:0xc9a24f})));
  bgStrings.forEach(s=>s.line.material.opacity=.16);
  const halo=new THREE.Group();root.add(halo);
  const h1=new THREE.Mesh(new THREE.TorusGeometry(3.6,.01,8,160),new THREE.MeshBasicMaterial({color:0xc9a24f,transparent:true,opacity:.45}));h1.rotation.x=1.25;halo.add(h1);
  const h2=new THREE.Mesh(new THREE.TorusGeometry(4.15,.007,8,160),new THREE.MeshBasicMaterial({color:0xe6c873,transparent:true,opacity:.3}));h2.rotation.set(1.1,.5,0);halo.add(h2);

  scene.add(new THREE.AmbientLight(0xffffff,.32));
  const key=new THREE.DirectionalLight(0xfff4dc,1.05);key.position.set(3,5,8);scene.add(key);
  const warm=new THREE.PointLight(0xc9a24f,2.6,40);warm.position.set(-6,3,6);scene.add(warm);
  const rim=new THREE.PointLight(0xffffff,1.5,40);rim.position.set(6,-3,6);scene.add(rim);
  const back=new THREE.PointLight(0xa67c2e,1.6,40);back.position.set(0,2,-6);scene.add(back);
  const sweep=new THREE.PointLight(0xe6c873,2.4,22);scene.add(sweep);   // gold light that sweeps with the scroll

  /* ---------- geometry helpers ---------- */
  const rtl=()=>document.documentElement.dir==='rtl';
  function worldY(ys,z){const d=camera.position.z-z,hh=Math.tan(THREE.MathUtils.degToRad(camera.fov/2))*d;return(innerHeight/2-ys)/(innerHeight/2)*hh}
  const ghost=new THREE.Object3D();
  function pose(I,pos,rotY,s,out){ghost.position.copy(pos);ghost.rotation.set(0,rotY,0);ghost.scale.setScalar(s);ghost.updateMatrix();I.model.updateMatrix();
    out.multiplyMatrices(root.matrixWorld,ghost.matrix).multiply(I.model.matrix)}
  const baseS=t=>(mobile()?.62:1)*FULL[t];

  /* ---------- HUD ---------- */
  const hudEl=document.querySelector('.hud');let hudIdx=-1;
  function buildHud(){if(!hudEl)return;hudIdx=-1;hudEl.innerHTML=entries.map(e=>'<button type="button"><span data-i18n="'+HUDKEY[e.type]+'">'+T[lang][HUDKEY[e.type]]+'</span><i></i></button>').join('');
    [...hudEl.children].forEach((b,i)=>b.addEventListener('click',()=>entries[i].a.scrollIntoView({behavior:'smooth',block:i?'center':'start'})))}
  buildHud();

  /* ---------- playing: strum strings, tap keys and drums, keyboard ---------- */
  const tA=new THREE.Vector3(),tB=new THREE.Vector3(),ray=new THREE.Raycaster(),ndc=new THREE.Vector2();
  const focused=()=>entries.find(e=>e.focus);
  const cur=()=>{const e=focused();return e&&e.swap>=1?e.inst[e.type]:null};
  function scr(I,v,out){out.copy(v);I.inner.localToWorld(out);out.project(camera);return{x:(out.x+1)/2*innerWidth,y:(1-out.y)/2*innerHeight}}
  function noteAt(obj,color){const p=new THREE.Vector3();obj.getWorldPosition(p);p.y+=.4;spawnNote(p,color||0xc9a24f)}
  function pluck(I,i,vel){const s=I.strings[i];if(!s)return;s.amp=Math.min(.16,.06+vel*.1);s.ph=0;I.played=true;playString(I.freqs[i%I.freqs.length],vel);
    const at=s.a.clone().lerp(s.b,.35+Math.random()*.3);I.inner.localToWorld(at);spawnNote(at,i%2?0xe6c873:0xc9a24f)}
  function hitAt(I,x,y){if(!I.hitTargets)return null;ndc.set(x/innerWidth*2-1,-(y/innerHeight)*2+1);ray.setFromCamera(ndc,camera);
    const h=ray.intersectObjects(I.hitTargets,true)[0];if(!h)return null;let o=h.object;while(o&&!o.userData.hit)o=o.parent;return o?o.userData.hit:null}
  const midiF=m=>440*Math.pow(2,(m-69)/12);
  function playKey(I,midi){const mesh=I.press(midi);if(!mesh)return;ensureAudio();playPiano(midiF(midi));noteAt(mesh,midi%2?0xe6c873:0xc9a24f)}
  function playDrumHit(I,type){const o=I.hit(type);ensureAudio();playDrum(type);noteAt(o,0xe6c873)}
  let lastKey=null,last=null;
  document.querySelectorAll('.strum-zone').forEach(zone=>{
    zone.addEventListener('pointermove',e=>{const I=cur();if(!I)return;const x=e.clientX,y=e.clientY;
      if(I.hitTargets){if(e.buttons&1&&I.press){const h=hitAt(I,x,y);if(h&&h.kind==='key'&&h.midi!==lastKey){lastKey=h.midi;playKey(I,h.midi)}}return}
      if(!I.pluckable)return;const vel=last?Math.min(1,Math.hypot(x-last.x,y-last.y)/40):.3;last={x,y};
      I.strings.forEach((s,i)=>{const A=scr(I,s.a,tA),B=scr(I,s.b,tB),dx=B.x-A.x,dy=B.y-A.y,t=((x-A.x)*dx+(y-A.y)*dy)/(dx*dx+dy*dy),side=Math.sign(dx*(y-A.y)-dy*(x-A.x));
        if(t>.03&&t<.97&&s.prevSide!=null&&side!==0&&side!==s.prevSide)pluck(I,i,vel);s.prevSide=(t>-.1&&t<1.1)?side:null})});
    zone.addEventListener('pointerleave',()=>{last=null;lastKey=null;entries.forEach(en=>Object.values(en.inst).forEach(I=>I.strings&&I.strings.forEach(s=>s.prevSide=null)))});
    zone.addEventListener('pointerup',()=>{lastKey=null});
    zone.addEventListener('pointerdown',e=>{const I=cur();if(!I)return;
      if(I.hitTargets){const h=hitAt(I,e.clientX,e.clientY);if(!h)return;if(h.kind==='key'){lastKey=h.midi;playKey(I,h.midi)}else if(h.kind==='drum')playDrumHit(I,h.type);return}
      if(!I.pluckable)return;ensureAudio();let best=-1,bd=30;
      I.strings.forEach((s,i)=>{const A=scr(I,s.a,tA),B=scr(I,s.b,tB),dx=B.x-A.x,dy=B.y-A.y,t=clamp(((e.clientX-A.x)*dx+(e.clientY-A.y)*dy)/(dx*dx+dy*dy),0,1);
        const d=Math.hypot(A.x+dx*t-e.clientX,A.y+dy*t-e.clientY);if(d<bd){bd=d;best=i}});if(best>=0)pluck(I,best,.6)});
  });
  const PIANO_KEYS={a:60,w:61,s:62,e:63,d:64,f:65,t:66,g:67,y:68,h:69,u:70,j:71,k:72,o:73,l:74,p:75,';':76};
  const DRUM_KEYS={f:'kick',' ':'kick',d:'snare',j:'snare',k:'tom',l:'cymbal'};
  addEventListener('keydown',e=>{if(e.repeat||e.ctrlKey||e.metaKey||e.altKey)return;const tg=e.target;if(tg&&/INPUT|TEXTAREA|SELECT/.test(tg.tagName))return;
    const I=cur();if(!I)return;const k=e.key.toLowerCase();
    if(I.type==='piano'&&PIANO_KEYS[k]!=null){playKey(I,PIANO_KEYS[k]);e.preventDefault()}
    else if(I.type==='drums'&&DRUM_KEYS[k]){playDrumHit(I,DRUM_KEYS[k]);e.preventDefault()}
    else if(I.pluckable&&/^[1-6]$/.test(k)){const i=+k-1;if(i<I.strings.length){ensureAudio();pluck(I,i,.6)}}});

  /* ---------- resize ---------- */
  let baseZ=14;
  function resize(){const w=innerWidth,h=innerHeight;renderer.setSize(w,h,false);if(fx)fx.setSize(w,h,false);camera.aspect=w/h;
    baseZ=Math.max(14,7.2/(.63*camera.aspect));camera.updateProjectionMatrix()}
  addEventListener('resize',resize);resize();

  /* ---------- loop ---------- */
  const mouse={x:0,y:0,tx:0,ty:0};
  addEventListener('pointermove',e=>{mouse.tx=e.clientX/innerWidth*2-1;mouse.ty=e.clientY/innerHeight*2-1},{passive:true});
  const clock=new THREE.Clock();let intro=0,lastSY=window.scrollY;
  const ease=x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;
  const mA=new THREE.Matrix4(),mB=new THREE.Matrix4(),vv=new THREE.Vector3(),vw=new THREE.Vector3(),mid=new THREE.Vector3();
  let dead=false;
  function frame(){if(dead)return;requestAnimationFrame(frame);try{frameBody()}catch(err){dead=true;console.error('Wattar 3D stopped:',err);document.documentElement.classList.add('no-webgl')}}
  function frameBody(){
    if(document.hidden)return;
    const dt=Math.min(clock.getDelta(),.05),t=clock.elapsedTime,vh=innerHeight;
    intro=Math.min(1,intro+dt*.6);const ie=ease(intro);
    mouse.x+=(mouse.tx-mouse.x)*.05;mouse.y+=(mouse.ty-mouse.y)*.05;
    // camera: intro dolly + parallax
    camera.position.set(mouse.x*.6,-mouse.y*.35,baseZ+(1-ie)*7);camera.lookAt(0,0,-2);
    root.updateMatrixWorld();
    // sections
    let focusE=null;
    entries.forEach(e=>{
      const r=e.a.getBoundingClientRect();e.r=r;
      e.near=r.bottom>-vh*.35&&r.top<vh*1.35;
      e.focus=r.top<vh*.5&&r.bottom>vh*.5;if(e.focus)focusE=e;
      let ys=r.height<vh*.84?r.top+r.height/2:clamp(vh/2,r.top+vh*.42,r.bottom-vh*.42);
      if(mobile())ys+=vh*(e.j===0?.2:.16);
      e.appear=Math.min(sstep(0,1,(vh-r.top)/(vh*.8)),sstep(0,1,r.bottom/(vh*.8)));
      e.prog=clamp((vh-r.top)/(r.height+vh),0,1);
      let x=0;if(!mobile()){x=e.side==='right'?4.1:e.side==='left'?-4.3:0;if(rtl())x=-x}
      e.pos.set(x,worldY(ys,e.z)+e.dy*(mobile()?.6:1),e.z);
      if(e.swap<1)e.swap=Math.min(1,e.swap+dt*1.15);
      for(const type in e.inst){const I=e.inst[type];
        let s=0;if(type===e.type)s=e.prev?sstep(.52,1,e.swap):1;else if(type===e.prev)s=1-sstep(0,.48,e.swap);
        const scl=baseS(type)*s*(.5+.5*e.appear)*(e.j===0?.75+.25*ie:1);
        I.holder.visible=e.near&&scl>.01;if(!I.holder.visible)continue;
        const swapSpin=e.prev?(type===e.type?-(1-e.swap)*2.6:e.swap*2.6):0;
        const enterSpin=(1-e.appear)*1.9*(r.top>0?1:-1);
        I.holder.position.copy(e.pos);I.holder.position.y+=Math.sin(t*.8+e.j)*.1;
        I.holder.rotation.set(Math.sin(t*.3+e.j)*.05+(e.prog-.5)*.3,(e.prog-.5)*1.25+enterSpin+swapSpin+mouse.x*.3+Math.sin(t*.45+e.j)*.1-(e.j===0?1.4*(1-ie):0),0);
        I.holder.scale.setScalar(scl);
        I.update(t,dt);
      }
      if(e.swap>=1&&e.prev){e.inst[e.prev].holder.visible=false;e.prev=null}
    });
    // particle stream: tab swap first, otherwise between consecutive sections
    let A=null,B=null,pa=null,pb=null,ra=0,rb=0,f=0;
    const sw=entries.find(e=>e.prev&&e.near);
    if(sw){A=sw.inst[sw.prev];B=sw.inst[sw.type];pa=pb=sw.pos;f=sw.swap;ra=f*2.6;rb=-(1-f)*2.6}
    else for(let j=0;j<entries.length-1;j++){const ea=entries[j],eb=entries[j+1];const d1=vh*.78-ea.r.bottom,d2=eb.r.top-vh*.22;
      if(d1>0&&d2>0){f=d1/(d1+d2);A=ea.inst[ea.type];B=eb.inst[eb.type];pa=ea.pos;pb=eb.pos;ra=(ea.prog-.5)*1.25;rb=(eb.prog-.5)*1.25;break}}
    if(A&&B&&f>.001&&f<.999&&!reduceMotion){
      pose(A,pa,ra,baseS(A.type),mA);pose(B,pb,rb,baseS(B.type),mB);mid.copy(pa).lerp(pb,.5);
      const burst=Math.sin(Math.PI*f),sa=A.samples,sb=B.samples;
      for(let k=0;k<NP;k++){const j=k*3,sd=seed[k];
        vv.set(sa[j],sa[j+1],sa[j+2]).applyMatrix4(mA);vw.set(sb[j],sb[j+1],sb[j+2]).applyMatrix4(mB);
        const lm=clamp((f-sd*.3)/.7,0,1),e2=lm*lm*(3-2*lm);
        let x=vv.x+(vw.x-vv.x)*e2,y=vv.y+(vw.y-vv.y)*e2,z=vv.z+(vw.z-vv.z)*e2;
        const ang=t*1.4+sd*6.283,sw2=Math.sin(Math.PI*e2);
        x+=((x-mid.x)*.25+Math.cos(ang)*1.1)*sw2;y+=Math.sin(ang*1.3)*.7*sw2;z+=Math.sin(ang*.7)*1.4*sw2;
        mPos[j]=x;mPos[j+1]=y;mPos[j+2]=z}
      mGeo.attributes.position.needsUpdate=true;mMat.opacity=Math.min(1,Math.pow(burst,.5)*1.15);morph.visible=true;
    }else morph.visible=false;
    // focused-section dressing
    const fe=focusE||entries[0];
    halo.position.copy(fe.pos);halo.scale.setScalar(Math.max(.01,baseS(fe.type)*fe.appear));halo.rotation.z=t*.08;halo.rotation.y=Math.sin(t*.2)*.3;
    sweep.position.set(Math.sin(t*.35+window.scrollY*.0025)*8,3+Math.cos(t*.25)*2,5);
    stars.rotation.y=Math.sin(t*.05)*.1;stars.position.y=window.scrollY*.0015;
    const sy=window.scrollY,sv=Math.abs(sy-lastSY)/Math.max(dt,.001);lastSY=sy;
    if(sv>900&&Math.random()<.25){const b=bgStrings[Math.floor(Math.random()*bgStrings.length)];b.amp=Math.min(.5,b.amp+.25)}updateStrings(bgStrings,dt,.25);
    for(let n=notes.length-1;n>=0;n--){const o=notes[n];o.life-=dt*.55;o.s.position.x+=o.vx;o.s.position.y+=o.vy;o.s.material.opacity=Math.max(0,o.life);o.s.scale.setScalar(.5+(1-o.life)*.3);
      if(o.life<=0){fxRoot.remove(o.s);o.s.material.dispose();notes.splice(n,1)}}
    const hi=focusE?focusE.j:0;if(hi!==hudIdx&&hudEl){hudIdx=hi;[...hudEl.children].forEach((b,i)=>b.classList.toggle('on',i===hi))}
    renderer.render(scene,camera);
    if(fx)fx.render(fxScene,camera);
  }
  frame();
}

/* ---------- enquiry form (same fields and endpoint as before) ---------- */
function initContactForm(){
  const form=document.getElementById('contactForm');if(!form)return;
  const msg=document.getElementById('formMsg'),ok=document.getElementById('formSuccess'),sel=form.elements.instrument;
  const MAP={oud:'Oud',piano:'Piano',guitar:'Guitar',violin:'Violin',drums:'Drums',voice:'Vocals',vocals:'Vocals'};
  const pick=v=>{if(v)sel.value=v};
  document.querySelectorAll('[data-pick]').forEach(a=>a.addEventListener('click',()=>pick(a.dataset.pick==='Voice'?'Vocals':a.dataset.pick)));
  const mm=location.hash.match(/^#book-(\w+)/);if(mm){pick(MAP[mm[1]]);setTimeout(()=>document.getElementById('book').scrollIntoView(),50)}
  const show=k=>{msg.dataset.i18n=k;msg.textContent=T[lang][k];msg.hidden=false};
  form.addEventListener('submit',e=>{
    e.preventDefault();msg.hidden=true;
    const v=n=>(form.elements[n].value||'').trim();
    const data={name:v('name'),phone:v('phone'),email:v('email'),instrument:v('instrument'),age:v('age'),message:v('message')};
    form.querySelectorAll('.field').forEach(f=>f.classList.remove('err'));
    if(!data.name||!data.phone){if(!data.name)form.elements.name.closest('.field').classList.add('err');if(!data.phone)form.elements.phone.closest('.field').classList.add('err');show('formErrRequired');return}
    const btn=form.querySelector('[type=submit]'),label=btn.querySelector('span');
    btn.disabled=true;label.dataset.i18n='formSending';label.textContent=T[lang].formSending;
    const done=()=>{btn.disabled=false;label.dataset.i18n='formSubmit';label.textContent=T[lang].formSubmit};
    if(location.protocol==='file:'){setTimeout(()=>{form.hidden=true;ok.hidden=false;done()},400);return}
    fetch('/api/public/lead',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)})
      .then(r=>r.json()).then(d=>{if(d.success){form.hidden=true;ok.hidden=false}else show('formErrServer')})
      .catch(()=>show('formErrNet')).finally(done);
  });
}

document.addEventListener('DOMContentLoaded',()=>{setLanguage(lang);runLoader();initReveal();initContactForm();initPlay();try{initScene()}catch(err){console.error('Wattar 3D unavailable:',err);document.documentElement.classList.add('no-webgl')}});
