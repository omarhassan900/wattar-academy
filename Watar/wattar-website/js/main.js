// Wattar Academy — public website script
// Language, UI effects, guitar audio, 3D instrument scene, contact form

/* ================= i18n ================= */
const T={
en:{brand:"Wattar Academy",navHome:"Home",navAbout:"About",navPrograms:"Programs",navContact:"Contact",navPortal:"Student Portal",langToggle:"العربية",
heroEyebrow:"Music academy · Mokattam, Cairo",heroTitle1:"Where music",heroTitle2:"begins.",
heroSubtitle:"A structured 4-year journey from your very first note to the stage — guitar, piano, violin, drums, oud and vocals, for every age.",
heroCta:"Explore programs",heroContact:"Book a free trial",soundOff:"Sound off",soundOn:"Sound on",strumHint:"Swipe across the strings to play",
statStudents:"Active students",statInstruments:"Instruments",statLevels:"Progressive levels",statYears:"Year curriculum",
whyKicker:"Why Wattar",featTitle:"Built to turn beginners into musicians",featSubtitle:"A structured approach to music education that builds real skills.",
feat1Title:"Structured curriculum",feat1Desc:"48 levels over 4 years, each with 4 sessions designed to build skills step by step.",
feat2Title:"Expert trainers",feat2Desc:"Learn from professional musicians who are passionate about teaching and dedicated to your growth.",
feat3Title:"Student portal",feat3Desc:"Track your progress, practice assignments and your roadmap online, anytime.",
feat4Title:"Wattar Band",feat4Desc:"Join our academy band and feel the thrill of performing live with fellow musicians.",
instrKicker:"Programs",instrTitle:"Find the instrument that speaks to you",instrSubtitle:"Each taught by specialized trainers, from first lesson to performance.",
guitar:"Guitar",piano:"Piano",violin:"Violin",drums:"Drums",oud:"Oud",vocals:"Vocals",
guitarDesc:"Acoustic & electric, chords to solos.",pianoDesc:"Reading, technique and repertoire.",violinDesc:"Bowing, tone and classical pieces.",
drumsDesc:"Groove, timing and coordination.",oudDesc:"Maqamat and the Arabic tradition.",vocalsDesc:"Breathing, pitch and stage confidence.",
currKicker:"The journey",currTitle:"4 years. 48 levels. One musician.",currSubtitle:"A progressive path from beginner to advanced musician.",
year1:"Year 1",year1Title:"Foundation",year1Desc:"Core skills, proper technique and music reading.",
year2:"Year 2",year2Title:"Development",year2Desc:"Wider repertoire, new styles and ensemble playing.",
year3:"Year 3",year3Title:"Refinement",year3Desc:"Advanced technique, expression and performance prep.",
year4:"Year 4",year4Title:"Mastery",year4Desc:"Professional-level skills, solo performance and a graduation recital.",
monthsY1:"Months 1–12",monthsY2:"Months 13–24",monthsY3:"Months 25–36",monthsY4:"Months 37–48",
bandKicker:"On stage",bandTitle:"More than lessons — a real band.",bandDesc:"Selected students join the Wattar Band: they rehearse together, perform live and discover the collaborative side of music. The band runs in cycles with regular rehearsals and shows.",bandCta:"Join the band",
ctaKicker:"Start today",ctaTitle:"Your first note is one message away.",ctaSubtitle:"Tell us which instrument you love and we'll set up a free trial session.",
footerDesc:"Professional music education for all ages and skill levels.",footerPages:"Pages",footerPrograms:"Programs",footerVisit:"Visit us",
contAddressVal:"Mokattam, Behind Hosny",hoursA:"Sun – Thu: 3PM – 10PM",hoursB:"Sat: 12PM – 10PM",
footerRights:"© 2026 Wattar Academy. All rights reserved.",footerMade:"Made with ♪ in Cairo",
/* about */
aboutKicker:"About us",aboutHeroTitle1:"Building musicians,",aboutHeroTitle2:"one note at a time.",
aboutHeroSubtitle:"Wattar Academy is a music school in Mokattam where every student follows a clear path, with trainers who know their name, their level and their next step.",
aboutTitle:"Our story",aboutText1:"Wattar Academy was founded with a simple mission: to make quality music education accessible to everyone. We believe that music is a universal language that connects people and enriches lives.",
aboutText2:"Our structured 4-year curriculum takes students from their very first note to confident performance, with personalized attention and professional guidance at every step.",
valuesKicker:"What we believe",valuesTitle:"Our values",
val1Title:"Excellence",val1Desc:"We hold ourselves and our students to the highest standards of musical education.",
val2Title:"Passion",val2Desc:"Music is not just what we teach — it's who we are. That passion drives everything we do.",
val3Title:"Community",val3Desc:"We build a supportive environment where students inspire and learn from each other.",
methodKicker:"How we teach",methodTitle:"The Wattar method",methodSubtitle:"Every student moves through the same clear cycle, level after level.",
m1Title:"Find your level",m1Desc:"A first session with a trainer to see where you are and which level to start from.",
m2Title:"Learn in levels",m2Desc:"Each level is 4 sessions, with practice assignments waiting for you in the student portal.",
m3Title:"Evaluate & move up",m3Desc:"Your trainer evaluates every level before you move on, so progress is real and measurable.",
m4Title:"Perform",m4Desc:"Recitals, the Wattar Band and the graduation recital put your skills on stage.",
/* programs */
progKicker:"Programs",progHeroTitle1:"Six instruments.",progHeroTitle2:"One clear path.",
progHeroSubtitle:"Pick your instrument and follow a structured program built from 48 levels, each with 4 sessions and a trainer who specializes in it.",
learnLabel:"What you'll learn",bookThis:"Book a trial",
catStrings:"Strings",catKeys:"Keys",catBowed:"Bowed strings",catPercussion:"Percussion",catArabic:"Arabic tradition",catVoice:"Voice",
guitarLong:"From your first chords to confident solos. Learn acoustic and electric guitar with songs you actually want to play.",
guitarL1:"Chords, strumming and rhythm",guitarL2:"Reading notes and tabs",guitarL3:"Scales, solos and improvisation",
pianoLong:"Build strong foundations in reading music and two-hand coordination, then grow into classical and modern repertoire.",
pianoL1:"Reading sheet music",pianoL2:"Two-hand coordination and technique",pianoL3:"Classical and modern pieces",
violinLong:"Develop a beautiful tone through posture, bow control and ear training, with classical and Arabic pieces.",
violinL1:"Posture and bow control",violinL2:"Intonation and ear training",violinL3:"Classical and Arabic repertoire",
drumsLong:"Find the groove. Build timing, coordination and the confidence to hold a band together.",
drumsL1:"Rhythm, timing and reading",drumsL2:"Grooves and fills in many styles",drumsL3:"Playing with other musicians",
oudLong:"Learn the king of Arabic instruments, from the risha technique to the maqamat behind the classics.",
oudL1:"Risha technique and tone",oudL2:"Maqamat basics",oudL3:"Classic Arabic songs",
vocalsLong:"Train your voice with breathing, support and pitch work, then bring it to the stage with confidence.",
vocalsL1:"Breathing and support",vocalsL2:"Pitch, range and ear training",vocalsL3:"Performing on stage",
/* contact */
contKicker:"Contact",contHeroTitle1:"Let's start your",contHeroTitle2:"musical journey.",
contHeroSubtitle:"Send us your details and the instrument you love. We'll call you back to set up a free trial session.",
formTitle:"Book a free trial",formName:"Full name",formPhone:"Phone number",formEmail:"Email (optional)",formInstrument:"Instrument of interest",
formSelect:"Select an instrument",formAge:"Age (optional)",formMessage:"Message (optional)",formSubmit:"Send",formSending:"Sending…",
formSuccess:"Thank you! We'll be in touch soon.",formSuccessSub:"Our team will call you on the number you gave us.",
formErrRequired:"Please enter your name and phone number.",formErrServer:"We couldn't send your message. Please try again or reach us on WhatsApp.",
formErrNet:"Connection problem. Check your internet and try again.",
contAddress:"Address",contPhone:"Phone & WhatsApp",contHours:"Working hours",contFollow:"Follow us",
whatsappCta:"Chat on WhatsApp",mapTitle:"Find us",openMaps:"Open in Google Maps"},
ar:{brand:"أكاديمية وتر",navHome:"الرئيسية",navAbout:"مين احنا",navPrograms:"البرامج",navContact:"كلمنا",navPortal:"بوابة الطالب",langToggle:"English",
heroEyebrow:"أكاديمية موسيقى · المقطم، القاهرة",heroTitle1:"هنا الموسيقى",heroTitle2:"بتبدأ.",
heroSubtitle:"رحلة منظمة 4 سنين من أول نغمة لحد المسرح — جيتار، بيانو، كمان، درامز، عود وغناء، لكل الأعمار.",
heroCta:"اعرف برامجنا",heroContact:"احجز حصة تجريبية مجانية",soundOff:"الصوت مقفول",soundOn:"الصوت شغال",strumHint:"حرّك إيدك على الأوتار عشان تعزف",
statStudents:"طالب نشط",statInstruments:"آلات موسيقية",statLevels:"مستوى متدرج",statYears:"سنين منهج",
whyKicker:"ليه وتر",featTitle:"معمولة عشان تحوّل المبتدئ لموسيقي",featSubtitle:"طريقة منظمة لتعليم الموسيقى بتبني مهارات حقيقية.",
feat1Title:"منهج منظم",feat1Desc:"48 مستوى على 4 سنين، كل مستوى 4 حصص مصممة تبني مهاراتك خطوة بخطوة.",
feat2Title:"مدربين محترفين",feat2Desc:"اتعلم من موسيقيين محترفين بيحبوا التدريس ومهتمين بتطويرك.",
feat3Title:"بوابة الطالب",feat3Desc:"تابع تقدمك وواجبات التمرين وخطتك أونلاين في أي وقت.",
feat4Title:"فرقة وتر",feat4Desc:"انضم لفرقة الأكاديمية وجرب إحساس العزف لايف مع زمايلك.",
instrKicker:"البرامج",instrTitle:"لاقي الآلة اللي تشبهك",instrSubtitle:"كل آلة بيدرسها مدربين متخصصين، من أول حصة لحد العرض.",
guitar:"جيتار",piano:"بيانو",violin:"كمان",drums:"درامز",oud:"عود",vocals:"غناء",
guitarDesc:"أكوستيك وإلكتريك، من الكوردات للسولو.",pianoDesc:"قراءة نوتة وتكنيك ومقطوعات.",violinDesc:"القوس والصوت والمقطوعات الكلاسيك.",
drumsDesc:"الجروف والتايمنج والتنسيق.",oudDesc:"المقامات والتراث العربي.",vocalsDesc:"التنفس والطبقة والثقة على المسرح.",
currKicker:"الرحلة",currTitle:"4 سنين. 48 مستوى. موسيقي واحد.",currSubtitle:"مسار متدرج من المبتدئ للموسيقي المتقدم.",
year1:"السنة الأولى",year1Title:"الأساسيات",year1Desc:"المهارات الأساسية والتكنيك الصح وقراءة النوتة.",
year2:"السنة التانية",year2Title:"التطوير",year2Desc:"مقطوعات أكتر وأنماط جديدة وعزف جماعي.",
year3:"السنة التالتة",year3Title:"الصقل",year3Desc:"تكنيك متقدم وتعبير موسيقي وتحضير للعروض.",
year4:"السنة الرابعة",year4Title:"الإتقان",year4Desc:"مهارات احترافية وأداء منفرد وحفلة تخرج.",
monthsY1:"شهر 1–12",monthsY2:"شهر 13–24",monthsY3:"شهر 25–36",monthsY4:"شهر 37–48",
bandKicker:"على المسرح",bandTitle:"أكتر من دروس — فرقة بجد.",bandDesc:"بيتم اختيار طلاب ينضموا لفرقة وتر: بيتدربوا مع بعض ويعملوا عروض لايف ويكتشفوا الجانب الجماعي من الموسيقى. الفرقة بتشتغل بدورات فيها بروفات وعروض منتظمة.",bandCta:"انضم للفرقة",
ctaKicker:"ابدأ النهارده",ctaTitle:"أول نغمة ليك على بعد رسالة.",ctaSubtitle:"قولنا الآلة اللي بتحبها وهنظبطلك حصة تجريبية مجانية.",
footerDesc:"تعليم موسيقى محترف لكل الأعمار والمستويات.",footerPages:"الصفحات",footerPrograms:"البرامج",footerVisit:"زورنا",
contAddressVal:"المقطم، خلف حسني",hoursA:"الحد – الخميس: 3 العصر – 10 بليل",hoursB:"السبت: 12 الضهر – 10 بليل",
footerRights:"© 2026 أكاديمية وتر. كل الحقوق محفوظة.",footerMade:"معمول بـ ♪ في القاهرة",
aboutKicker:"مين احنا",aboutHeroTitle1:"بنبني موسيقيين،",aboutHeroTitle2:"نغمة ورا نغمة.",
aboutHeroSubtitle:"أكاديمية وتر مدرسة موسيقى في المقطم، كل طالب فيها ماشي في مسار واضح، مع مدربين عارفين اسمه ومستواه وخطوته الجاية.",
aboutTitle:"حكايتنا",aboutText1:"أكاديمية وتر اتأسست بهدف بسيط: إن تعليم الموسيقى الكويس يبقى متاح للكل. بنؤمن إن الموسيقى لغة عالمية بتربط الناس ببعض وبتغني حياتهم.",
aboutText2:"المنهج بتاعنا اللي مدته 4 سنين بياخد الطالب من أول نغمة لحد ما يعزف بثقة، مع اهتمام شخصي وتوجيه محترف في كل خطوة.",
valuesKicker:"اللي بنؤمن بيه",valuesTitle:"قيمنا",
val1Title:"التميز",val1Desc:"بنلتزم بأعلى معايير التعليم الموسيقي لينا ولطلابنا.",
val2Title:"الشغف",val2Desc:"الموسيقى مش بس اللي بنعلمه — دي احنا. الشغف ده بيحرك كل حاجة بنعملها.",
val3Title:"المجتمع",val3Desc:"بنبني بيئة داعمة الطلاب فيها بيلهموا بعض ويتعلموا من بعض.",
methodKicker:"إزاي بنعلّم",methodTitle:"طريقة وتر",methodSubtitle:"كل طالب بيمشي في نفس الدورة الواضحة، مستوى ورا مستوى.",
m1Title:"اعرف مستواك",m1Desc:"أول حصة مع مدرب عشان نعرف انت فين وتبدأ من أنهي مستوى.",
m2Title:"اتعلم بالمستويات",m2Desc:"كل مستوى 4 حصص، وواجبات التمرين مستنياك في بوابة الطالب.",
m3Title:"تقييم وترقّي",m3Desc:"المدرب بيقيّم كل مستوى قبل ما تنقل للي بعده، عشان تقدمك يبقى حقيقي.",
m4Title:"اعزف قدام الناس",m4Desc:"حفلات وفرقة وتر وحفلة التخرج بيطلّعوا مهاراتك على المسرح.",
progKicker:"البرامج",progHeroTitle1:"ست آلات.",progHeroTitle2:"مسار واحد واضح.",
progHeroSubtitle:"اختار آلتك وامشي في برنامج منظم من 48 مستوى، كل مستوى 4 حصص مع مدرب متخصص فيها.",
learnLabel:"هتتعلم إيه",bookThis:"احجز حصة تجريبية",
catStrings:"وتريات",catKeys:"كيبورد",catBowed:"وتريات بالقوس",catPercussion:"إيقاع",catArabic:"تراث عربي",catVoice:"صوت",
guitarLong:"من أول كوردات لحد السولو بثقة. اتعلم جيتار أكوستيك وإلكتريك بأغاني انت عايز تعزفها.",
guitarL1:"الكوردات والستروم والإيقاع",guitarL2:"قراءة النوتة والتابات",guitarL3:"السلالم والسولو والارتجال",
pianoLong:"ابني أساس قوي في قراءة النوتة والتنسيق بين الإيدين، وبعدها انطلق في المقطوعات الكلاسيك والحديثة.",
pianoL1:"قراءة النوتة",pianoL2:"التنسيق بين الإيدين والتكنيك",pianoL3:"مقطوعات كلاسيك وحديثة",
violinLong:"طلّع صوت جميل من خلال الوقفة الصح والتحكم في القوس وتدريب الودن، بمقطوعات كلاسيك وعربي.",
violinL1:"الوقفة والتحكم في القوس",violinL2:"ضبط النغمة وتدريب الودن",violinL3:"مقطوعات كلاسيك وعربي",
drumsLong:"لاقي الجروف. ابني التايمنج والتنسيق والثقة إنك تمسك الفرقة كلها.",
drumsL1:"الإيقاع والتايمنج والقراءة",drumsL2:"جروفات وفيلز في أنماط كتير",drumsL3:"العزف مع موسيقيين تانيين",
oudLong:"اتعلم سلطان الآلات العربية، من تكنيك الريشة لحد المقامات اللي ورا الأغاني الكلاسيك.",
oudL1:"تكنيك الريشة والصوت",oudL2:"أساسيات المقامات",oudL3:"أغاني عربي كلاسيك",
vocalsLong:"درّب صوتك بالتنفس والدعم وضبط الطبقة، وبعدها اطلع بيه على المسرح بثقة.",
vocalsL1:"التنفس والدعم",vocalsL2:"الطبقة والمساحة وتدريب الودن",vocalsL3:"الأداء على المسرح",
contKicker:"كلمنا",contHeroTitle1:"يلا نبدأ",contHeroTitle2:"رحلتك الموسيقية.",
contHeroSubtitle:"ابعتلنا بياناتك والآلة اللي بتحبها، وهنكلمك نحجزلك حصة تجريبية مجانية.",
formTitle:"احجز حصة تجريبية مجانية",formName:"الاسم بالكامل",formPhone:"رقم الموبايل",formEmail:"الإيميل (اختياري)",formInstrument:"الآلة اللي عايز تتعلمها",
formSelect:"اختار آلة",formAge:"السن (اختياري)",formMessage:"رسالة (اختياري)",formSubmit:"ابعت",formSending:"جاري الإرسال…",
formSuccess:"شكراً ليك! هنتواصل معاك قريب.",formSuccessSub:"فريقنا هيكلمك على الرقم اللي كتبته.",
formErrRequired:"من فضلك اكتب اسمك ورقم موبايلك.",formErrServer:"مقدرناش نبعت رسالتك. جرب تاني أو كلمنا واتساب.",
formErrNet:"فيه مشكلة في الاتصال. اتأكد من النت وجرب تاني.",
contAddress:"العنوان",contPhone:"موبايل وواتساب",contHours:"مواعيد العمل",contFollow:"تابعنا",
whatsappCta:"كلمنا واتساب",mapTitle:"مكاننا",openMaps:"افتح في جوجل ماب"}
};
let lang='en';
try{lang=localStorage.getItem('wattar-lang')||'en'}catch(e){}
function setLanguage(l){
  lang=l;try{localStorage.setItem('wattar-lang',l)}catch(e){}
  document.documentElement.lang=l;document.documentElement.dir=l==='ar'?'rtl':'ltr';document.body.dir=l==='ar'?'rtl':'ltr';
  document.querySelectorAll('[data-i18n]').forEach(el=>{const v=T[l][el.dataset.i18n];if(v==null)return;
    if(el.tagName==='INPUT'||el.tagName==='TEXTAREA')el.placeholder=v;else el.textContent=v});
  updateSoundLabel();
  document.dispatchEvent(new Event('langchange'));
}
function toggleLanguage(){setLanguage(lang==='en'?'ar':'en')}
function openMobileNav(){document.getElementById('mobileNav').classList.add('open');document.body.style.overflow='hidden'}
function closeMobileNav(){document.getElementById('mobileNav').classList.remove('open');document.body.style.overflow=''}

/* ================= UI effects ================= */
const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.15,rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// counters
const cio=new IntersectionObserver(es=>es.forEach(e=>{
  if(!e.isIntersecting) return; cio.unobserve(e.target);
  const el=e.target,to=+el.dataset.count,suf=el.dataset.suffix||'',t0=performance.now(),d=reduceMotion?0:1600;
  (function step(now){const p=d?Math.min(1,(now-t0)/d):1;el.textContent=Math.round(to*(1-Math.pow(1-p,3)))+suf;if(p<1)requestAnimationFrame(step)})(t0);
}),{threshold:.5});
document.querySelectorAll('[data-count]').forEach(el=>cio.observe(el));

// tilt + spotlight
if(matchMedia('(pointer:fine)').matches && !reduceMotion){
  document.querySelectorAll('.tilt').forEach(card=>{
    card.addEventListener('pointermove',e=>{
      const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
      card.classList.add('active');
      card.style.setProperty('--ry',((x-.5)*14)+'deg');card.style.setProperty('--rx',((.5-y)*14)+'deg');
      card.style.setProperty('--mx',x*100+'%');card.style.setProperty('--my',y*100+'%');
    });
    card.addEventListener('pointerleave',()=>{card.classList.remove('active');card.style.setProperty('--rx','0deg');card.style.setProperty('--ry','0deg')});
  });
}
// timeline progress
const tl=document.getElementById('timeline');
function onScroll(){if(!tl)return;const r=tl.getBoundingClientRect(),vh=innerHeight;const p=Math.min(1,Math.max(0,(vh*.85-r.top)/(r.height+vh*.3)));tl.style.setProperty('--p',p.toFixed(3))}
addEventListener('scroll',onScroll,{passive:true});onScroll();

/* ================= Audio (Karplus-Strong plucked strings) ================= */
let actx=null,master=null,buffers=[],soundOn=false;
const FREQS=[82.41,110,146.83,196,246.94,329.63]; // E A D G B E
function buildBuffers(){
  const sr=actx.sampleRate,len=Math.floor(sr*2.6);
  buffers=FREQS.map(f=>{
    const b=actx.createBuffer(1,len,sr),d=b.getChannelData(0),N=Math.round(sr/f);
    let last=0;for(let i=0;i<N;i++){const n=Math.random()*2-1;last=last*.5+n*.5;d[i]=last}
    for(let i=N;i<len;i++){d[i]=.4985*(d[i-N]+d[i-N-1])}
    return b;
  });
}
function playString(i,vel){
  if(!soundOn||!actx) return;
  const s=actx.createBufferSource();s.buffer=buffers[i];
  const g=actx.createGain();g.gain.value=Math.min(1,.25+vel*.6);
  const p=actx.createStereoPanner?actx.createStereoPanner():null;
  if(p){p.pan.value=(i-2.5)/6;s.connect(g).connect(p).connect(master)}else s.connect(g).connect(master);
  s.start();
}
const soundBtn=document.getElementById('soundBtn');
function updateSoundLabel(){if(!soundBtn)return;const sp=soundBtn.querySelector('[data-i18n]');const k=soundOn?'soundOn':'soundOff';sp.dataset.i18n=k;sp.textContent=T[lang][k];soundBtn.classList.toggle('on',soundOn)}
if(soundBtn)soundBtn.addEventListener('click',()=>{
  if(!actx){const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;actx=new AC();master=actx.createGain();master.gain.value=.55;
    const comp=actx.createDynamicsCompressor();master.connect(comp).connect(actx.destination);buildBuffers()}
  if(actx.state==='suspended')actx.resume();
  soundOn=!soundOn;updateSoundLabel();
  if(soundOn&&window.__guitar){[0,1,2,3,4,5].forEach((i,k)=>setTimeout(()=>window.__guitar.pluck(i,.5),k*55))}
});


/* ================= 3D scene: scroll-driven instrument morph ================= */
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
  const gloss=(c,e)=>new THREE.MeshPhysicalMaterial({color:c,metalness:.35,roughness:.22,clearcoat:1,clearcoatRoughness:.12,emissive:e||0x0e0824});
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
      return{a:d.a,b:d.b,line,base,amp:0,ph:0,w:38+i*7,SEG,prevSide:null};
    });
  }
  function updateStrings(arr,dt,decay){
    arr.forEach(s=>{const A=s.line.geometry.attributes.position,arr2=A.array,S=s.SEG;
      if(s.amp>.0005){s.ph+=dt*s.w;
        for(let j=1;j<S;j++){const u=j/S;const d=s.amp*Math.sin(Math.PI*u)*Math.sin(s.ph)+s.amp*.35*Math.sin(2*Math.PI*u)*Math.sin(s.ph*2.03);arr2[j*3]=s.a.x+(s.b.x-s.a.x)*u+d}
        A.needsUpdate=true;s.amp*=Math.pow(decay||.06,dt);s.line.material.color.copy(s.base).lerp(white,Math.min(1,s.amp*8));
      }else if(s.amp!==0){s.amp=0;for(let j=1;j<S;j++)arr2[j*3]=s.a.x+(s.b.x-s.a.x)*j/S;A.needsUpdate=true;s.line.material.color.copy(s.base)}
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
    inner.add(new THREE.Mesh(geo,gloss(0x1b1240)));
    const rp=outline.map(v=>V(v.x*1.035,v.y,.29));rp.push(rp[0].clone());neonLine(rp,0x22d3ee,inner);
    const rb=neonLine(rp,0xa78bfa,inner,.7);rb.position.z=-.58;
    const r1=new THREE.Mesh(new THREE.TorusGeometry(.43,.025,12,80),glow(0xc084fc));r1.position.set(0,.42,.28);inner.add(r1);
    const r2=new THREE.Mesh(new THREE.TorusGeometry(.5,.012,8,80),glow(0x22d3ee));r2.position.set(0,.42,.28);inner.add(r2);
    const ins=new THREE.Mesh(new THREE.CircleGeometry(.37,48),glow(0x020106));ins.position.set(0,.42,-.1);inner.add(ins);
    const NUT=4.94,BR=-1.0,L=NUT-BR,dark=gloss(0x140d2e);
    box(.44,3.7,.24,dark,0,3.19,.08,inner);box(.42,3.55,.05,matte(0x07050f),0,NUT-1.775,.235,inner);
    const fm=glow(0x8fa3c8);for(let n=1;n<=15;n++)box(.42,.022,.03,fm,0,NUT-L*(1-Math.pow(2,-n/12)),.27,inner);
    [3,5,7,9,12].forEach(n=>{const y=NUT-L*((1-Math.pow(2,-n/12))+(1-Math.pow(2,-(n-1)/12)))/2;(n===12?[-.09,.09]:[0]).forEach(x=>{const d=new THREE.Mesh(new THREE.CircleGeometry(.035,20),glow(0x22d3ee));d.position.set(x,y,.262);inner.add(d)})});
    const head=box(.62,1.05,.16,dark,0,NUT+.56,.05,inner);
    const he=new THREE.LineSegments(new THREE.EdgesGeometry(head.geometry),new THREE.LineBasicMaterial({color:0xa78bfa}));he.position.copy(head.position);inner.add(he);
    box(.44,.05,.07,glow(0xf5f3ff),0,NUT,.28,inner);
    for(let i=0;i<6;i++){const s=i<3?-1:1,yy=NUT+.22+(i%3)*.3;const p=new THREE.Mesh(new THREE.CylinderGeometry(.035,.035,.32,12),metal(0xbfc7da));p.rotation.z=Math.PI/2;p.position.set(s*.42,yy,.05);inner.add(p);
      const k=new THREE.Mesh(new THREE.SphereGeometry(.07,16,12),glow(i%2?0x22d3ee:0xc084fc));k.scale.set(.6,1,1);k.position.set(s*.6,yy,.05);inner.add(k)}
    box(1.0,.16,.08,matte(0x07050f),0,BR,.3,inner);box(.6,.025,.04,glow(0xf5f3ff),0,BR+.04,.35,inner);
    const cols=[0x22d3ee,0x5eead4,0x93c5fd,0xa78bfa,0xc084fc,0xf0abfc];
    const strings=makeStrings(inner,cols.map((c,i)=>({a:V(-.25+i*.1,BR+.04,.37),b:V(-.16+i*.064,NUT,.31),color:c})));
    return{model:m,strings,inner,colors:[0xa78bfa,0x22d3ee],
      update(t,dt){updateStrings(strings,dt)}};
  }

  /* ---------- 2. PIANO ---------- */
  function makePiano(){
    const m=new THREE.Group(),g=new THREE.Group();m.add(g);g.rotation.set(.62,-.35,0);
    const N=14,kw=.42,gap=.035,step=kw+gap,total=N*step,x0=-total/2+step/2;
    const body=box(total+.6,.5,2.5,gloss(0x150e30),0,-.32,-.35,g);
    const be=new THREE.LineSegments(new THREE.EdgesGeometry(body.geometry),new THREE.LineBasicMaterial({color:0x22d3ee,transparent:true,opacity:.8}));be.position.copy(body.position);g.add(be);
    const back=box(total+.6,1.3,.18,gloss(0x150e30),0,.38,-1.5,g);
    box(total+.4,.04,.04,glow(0xc084fc),0,1.02,-1.4,g);
    box(total+.4,.03,.03,glow(0x22d3ee),0,-.06,.92,g);
    const keys=[];
    for(let i=0;i<N;i++){const mat=new THREE.MeshPhysicalMaterial({color:0xe9e5ff,roughness:.25,clearcoat:1,emissive:0x1a1238});
      const k=box(kw,.24,1.9,mat,x0+i*step,0,.0,g);keys.push({mesh:k,mat,base:0,black:false,i})}
    const blackAfter=[0,1,3,4,5];
    for(let o=0;o<2;o++)blackAfter.forEach(b=>{const i=o*7+b;if(i>=N-1)return;const mat=new THREE.MeshPhysicalMaterial({color:0x0b0716,roughness:.3,clearcoat:1,emissive:0x000000});
      const k=box(kw*.58,.26,1.15,mat,x0+i*step+step/2,.2,-.36,g);box(kw*.5,.02,.02,glow(0xa78bfa),x0+i*step+step/2,.34,.22,g);keys.push({mesh:k,mat,base:.2,black:true,i:i+.5})});
    const cA=new THREE.Color(0xe9e5ff),cHi=new THREE.Color(0x22d3ee),eLo=new THREE.Color(0x1a1238),eHi=new THREE.Color(0x0e7490),bLo=new THREE.Color(0x000000),bHi=new THREE.Color(0x6d28d9);
    return{model:m,colors:[0x22d3ee,0xe9e5ff],
      update(t){keys.forEach(k=>{const p=Math.pow(Math.max(0,Math.sin(t*2.6-k.i*.55)),10);k.mesh.position.y=k.base-p*.13;k.mesh.rotation.x=p*.06;
        if(k.black)k.mat.emissive.copy(bLo).lerp(bHi,p);else{k.mat.color.copy(cA).lerp(cHi,p*.6);k.mat.emissive.copy(eLo).lerp(eHi,p)}})}};
  }

  /* ---------- 3. VIOLIN ---------- */
  function makeViolin(){
    const m=new THREE.Group(),g=new THREE.Group();m.add(g);g.rotation.z=.55;
    const inner=new THREE.Group();g.add(inner);inner.position.y=-1.1;inner.scale.setScalar(1.05);
    const hw=y=>{const a=ew(y,-.7,.98,.85),b=ew(y,.78,.8,.68),k=7;return Math.pow(Math.pow(a,k)+Math.pow(b,k),1/k)+.02};
    const outline=outlineFrom(hw,-1.55,1.46,110);
    const geo=new THREE.ExtrudeGeometry(new THREE.Shape(outline),{depth:.26,bevelEnabled:true,bevelThickness:.1,bevelSize:.06,bevelSegments:6,curveSegments:24});geo.translate(0,0,-.13);
    inner.add(new THREE.Mesh(geo,gloss(0x2a0f3a,0x1a0626)));
    const rp=outline.map(v=>V(v.x*1.04,v.y,.24));rp.push(rp[0].clone());neonLine(rp,0xf0abfc,inner);
    [-1,1].forEach(s=>{const pts=[];for(let i=0;i<=24;i++){const u=i/24;pts.push(V(s*(.36+.07*Math.sin(u*Math.PI*2)),-.55+u*.75,.24))}neonLine(pts,0x22d3ee,inner);
      [0,1].forEach(e=>{const c=new THREE.Mesh(new THREE.CircleGeometry(.035,14),glow(0x22d3ee));c.position.set(s*(.36),e?.2:-.55,.245);inner.add(c)})});
    const dark=gloss(0x120a24);
    box(.26,2.05,.18,dark,0,2.45,.05,inner);box(.24,2.65,.05,matte(0x050309),0,1.88,.2,inner);
    box(.22,.5,.18,dark,0,3.68,.03,inner);
    const scroll=new THREE.Mesh(new THREE.TorusGeometry(.13,.05,10,30),gloss(0x2a0f3a,0x1a0626));scroll.rotation.y=Math.PI/2;scroll.position.set(0,4.02,.03);inner.add(scroll);
    for(let i=0;i<4;i++){const p=new THREE.Mesh(new THREE.CylinderGeometry(.03,.03,.42,10),glow(i%2?0x22d3ee:0xf0abfc));p.rotation.z=Math.PI/2;p.position.set(0,3.55+i*.1,.03);inner.add(p)}
    box(.5,.14,.03,glow(0xf5f3ff),0,-.32,.32,inner);
    box(.24,.7,.05,matte(0x050309),0,-1.08,.26,inner);
    const cols=[0xf0abfc,0xc084fc,0x93c5fd,0x22d3ee];
    const strings=makeStrings(inner,cols.map((c,i)=>({a:V(-.08+i*.053,-.75,.3),b:V(-.06+i*.04,3.2,.27),color:c})));
    // bow
    const bowPivot=new THREE.Group();bowPivot.position.set(0,-.05,.48);bowPivot.rotation.z=Math.PI/2-.25;inner.add(bowPivot);
    const bow=new THREE.Group();bowPivot.add(bow);
    const stick=new THREE.Mesh(new THREE.CylinderGeometry(.022,.032,4.6,10),gloss(0x3b1d0e,0x1a0a02));bow.add(stick);
    neonLine([V(.12,-2.2,0),V(.12,2.2,0)],0x22d3ee,bow);
    box(.16,.28,.06,glow(0xc084fc),.07,-2.25,0,bow);
    return{model:m,colors:[0xf0abfc,0x22d3ee],
      update(t,dt){bow.position.y=Math.sin(t*1.7)*1.25;
        strings.forEach((s,i)=>{if(i===1||i===2){s.amp=Math.max(s.amp,.02+.012*Math.abs(Math.cos(t*1.7)))}});updateStrings(strings,dt,.2)}};
  }

  /* ---------- 4. DRUMS ---------- */
  function makeDrums(){
    const m=new THREE.Group(),g=new THREE.Group();m.add(g);g.rotation.set(.18,-.4,0);
    const shell=gloss(0x24104a,0x12062a);
    function drum(r,h,x,y,z,rx,rz){const d=new THREE.Group();d.position.set(x,y,z);d.rotation.set(rx,0,rz);g.add(d);
      const s=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,48,1,true),shell);s.material.side=THREE.DoubleSide;d.add(s);
      const headMat=new THREE.MeshPhysicalMaterial({color:0xd9d2ff,roughness:.5,emissive:0x1a1238});
      const head=new THREE.Mesh(new THREE.CircleGeometry(r,48),headMat);head.rotation.x=-Math.PI/2;head.position.y=h/2;d.add(head);
      const rimT=new THREE.Mesh(new THREE.TorusGeometry(r,.035,8,64),glow(0x22d3ee));rimT.rotation.x=Math.PI/2;rimT.position.y=h/2;d.add(rimT);
      const rimB=new THREE.Mesh(new THREE.TorusGeometry(r,.03,8,64),glow(0xa78bfa));rimB.rotation.x=Math.PI/2;rimB.position.y=-h/2;d.add(rimB);
      for(let i=0;i<8;i++){const a=i/8*Math.PI*2;box(.05,h*.8,.05,metal(0xbfc7da),Math.cos(a)*(r+.03),0,Math.sin(a)*(r+.03),d)}
      return{d,headMat,rimT}}
    const snare=drum(1.05,.55,0,0,0,.45,0);
    const tom=drum(.72,.6,-1.55,1.05,-.6,.6,.25);
    const kick=drum(1.45,1.0,.55,-1.6,-2.0,Math.PI/2-.05,0);
    const cym=new THREE.Mesh(new THREE.CylinderGeometry(.06,1.35,.1,48),new THREE.MeshStandardMaterial({color:0xe7c56a,metalness:1,roughness:.22,emissive:0x2a1a00}));
    cym.position.set(1.95,1.55,-.7);cym.rotation.set(.35,0,-.25);g.add(cym);
    const cymRing=new THREE.Mesh(new THREE.TorusGeometry(1.35,.012,6,80),glow(0xfde68a));cymRing.rotation.x=Math.PI/2;cymRing.position.y=-.05;cym.add(cymRing);
    box(.04,2.6,.04,metal(0x9aa3b8),1.95,.25,-.75,g);
    function stick(x,side){const p=new THREE.Group();p.position.set(x,.95,1.4);g.add(p);
      const s=new THREE.Mesh(new THREE.CylinderGeometry(.03,.05,2.3,10),new THREE.MeshStandardMaterial({color:0xf3d9b1,roughness:.5,emissive:0x2a1a0a}));s.position.y=-1.1;s.rotation.x=0;p.add(s);
      const tip=new THREE.Mesh(new THREE.SphereGeometry(.06,10,8),glow(0x22d3ee));tip.position.y=-2.25;p.add(tip);
      p.rotation.set(-1.0,0,side*.35);return p}
    const sL=stick(-.45,-1),sR=stick(.45,1);
    const loC=new THREE.Color(0x1a1238),hiC=new THREE.Color(0x22d3ee);
    return{model:m,colors:[0xa78bfa,0xfde68a],
      update(t){const a=Math.abs(Math.sin(t*3.4)),b=Math.abs(Math.sin(t*3.4+Math.PI/2));
        sL.rotation.x=-1.0-a*.55;sR.rotation.x=-1.0-b*.55;
        const hitA=Math.pow(1-a,10),hitB=Math.pow(1-b,10);
        snare.headMat.emissive.copy(loC).lerp(hiC,Math.max(hitA,hitB));snare.rimT.scale.setScalar(1+Math.max(hitA,hitB)*.06);
        const k=Math.pow(Math.max(0,Math.sin(t*1.7)),18);kick.headMat.emissive.copy(loC).lerp(new THREE.Color(0x7c3aed),k);kick.d.scale.setScalar(1+k*.04);
        cym.rotation.z=-.25+Math.sin(t*5)*.04*(1+hitB);}};
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
    const bowl=new THREE.Mesh(bowlGeo,gloss(0x3a1650,0x1a0626));bowl.material.side=THREE.DoubleSide;inner.add(bowl);
    for(let k=1;k<12;k++){const ph=k/12*Math.PI;const pts=[];for(let j=0;j<=40;j++){const th=j/40*Math.PI;let x=-Math.cos(ph)*Math.sin(th),y=Math.cos(th),z=-Math.sin(ph)*Math.sin(th);pts.push(V(x*RX*narrow(y)*1.01,y*RY*1.01,z*RZ*1.01))}
      neonLine(pts,k%2?0xf59e0b:0xc084fc,inner,.55)}
    const face=outlineFrom(y=>{const yu=y/RY;return Math.abs(yu)>=1?0:RX*Math.sqrt(1-yu*yu)*narrow(yu)},-RY,RY,90);
    const fs=new THREE.Shape(face);
    [[0,.15,.32],[-.36,.78,.12],[.36,.78,.12]].forEach(([x,y,r])=>{const h=new THREE.Path();h.absarc(x,y,r,0,Math.PI*2,true);fs.holes.push(h);
      const ring=new THREE.Mesh(new THREE.TorusGeometry(r+.04,.02,8,60),glow(r>.2?0xf59e0b:0x22d3ee));ring.position.set(x,y,.03);inner.add(ring);
      const ring2=new THREE.Mesh(new THREE.TorusGeometry(r+.1,.008,6,60),glow(0xc084fc));ring2.position.set(x,y,.03);inner.add(ring2)});
    const faceMesh=new THREE.Mesh(new THREE.ShapeGeometry(fs,32),new THREE.MeshPhysicalMaterial({color:0x2a1840,roughness:.35,clearcoat:.8,emissive:0x120822,side:THREE.DoubleSide}));inner.add(faceMesh);
    const fp=face.map(v=>V(v.x,v.y,.02));fp.push(fp[0].clone());neonLine(fp,0xf59e0b,inner);
    const dark=gloss(0x1a0d2e);
    box(.38,1.3,.18,dark,0,RY+.55,-.05,inner);box(.34,1.9,.04,matte(0x050309),0,RY+.2,.07,inner);
    const pegbox=new THREE.Group();pegbox.position.set(0,RY+1.2,-.05);pegbox.rotation.x=-1.05;inner.add(pegbox);
    box(.3,1.15,.2,dark,0,.57,0,pegbox);
    for(let i=0;i<5;i++){[-1,1].forEach(s=>{const pg=new THREE.Mesh(new THREE.CylinderGeometry(.03,.03,.38,8),metal(0xd6b37a));pg.rotation.z=Math.PI/2;pg.position.set(s*.25,.2+i*.2,0);pegbox.add(pg);
      const kn=new THREE.Mesh(new THREE.SphereGeometry(.055,10,8),glow(s>0?0xf59e0b:0x22d3ee));kn.position.set(s*.44,.2+i*.2,0);pegbox.add(kn)})}
    box(.62,.08,.05,glow(0xfde68a),0,-.95,.05,inner);
    const cols=[0xf59e0b,0xfbbf24,0xf0abfc,0xc084fc,0x22d3ee];
    const strings=makeStrings(inner,cols.map((c,i)=>({a:V(-.2+i*.1,-.95,.1),b:V(-.12+i*.06,RY+1.15,.11),color:c})));
    let next=0;
    return{model:m,colors:[0xf59e0b,0xc084fc],
      update(t,dt){if(t>next){const i=Math.floor(Math.random()*5);strings[i].amp=.05+Math.random()*.04;next=t+.25+Math.random()*.45}updateStrings(strings,dt,.08)}};
  }

  /* ---------- 6. MICROPHONE ---------- */
  function makeMic(){
    const m=new THREE.Group(),g=new THREE.Group();m.add(g);g.rotation.z=-.3;g.position.y=.6;
    const grill=new THREE.Mesh(new THREE.SphereGeometry(.85,22,16),new THREE.MeshBasicMaterial({color:0x22d3ee,wireframe:true,transparent:true,opacity:.85}));grill.position.y=1;g.add(grill);
    const core=new THREE.Mesh(new THREE.SphereGeometry(.78,32,24),gloss(0x150e30));core.position.y=1;g.add(core);
    const band=new THREE.Mesh(new THREE.CylinderGeometry(.8,.72,.25,48),metal(0xc8cfe0));band.position.y=.2;g.add(band);
    const body=new THREE.Mesh(new THREE.CylinderGeometry(.55,.32,2.6,40),gloss(0x1b1240));body.position.y=-1.2;g.add(body);
    [-.3,-1.3].forEach((y,i)=>{const r=new THREE.Mesh(new THREE.TorusGeometry(i?.43:.53,.025,8,60),glow(i?0xf0abfc:0xa78bfa));r.rotation.x=Math.PI/2;r.position.y=y;g.add(r)});
    box(.18,.32,.05,glow(0x22d3ee),0,-.7,.52,g);
    const waves=[];for(let i=0;i<4;i++){const w=new THREE.Mesh(new THREE.TorusGeometry(1,.014,6,90),new THREE.MeshBasicMaterial({color:i%2?0x22d3ee:0xc084fc,transparent:true,opacity:0,depthWrite:false}));w.position.y=1;g.add(w);waves.push(w)}
    return{model:m,colors:[0x22d3ee,0xc084fc],noSample:waves,
      update(t){grill.rotation.y=t*.4;waves.forEach((w,i)=>{const p=((t*.45)+i/4)%1;w.scale.setScalar(.95+p*2.6);w.material.opacity=(1-p)*.8*Math.min(1,p*6)})}};
  }

  /* ---------- assemble ---------- */
  const INST=[makeGuitar(),makePiano(),makeViolin(),makeDrums(),makeOud(),makeMic()];
  const FULL=[1,.95,1,.9,1.05,1.05];
  INST.forEach(I=>{I.holder=new THREE.Group();I.holder.add(I.model);root.add(I.holder);I.ghost=new THREE.Object3D()});

  // surface sampler for particle morph
  const NP=mobile()?1500:2400;
  function samplePoints(I){
    const hidden=I.noSample||[];hidden.forEach(o=>o.visible=false);
    I.model.updateMatrixWorld(true);
    const inv=new THREE.Matrix4().copy(I.model.matrixWorld).invert();
    const tris=[];let total=0;const tmp=new THREE.Matrix4();
    I.model.traverse(o=>{if(!o.isMesh||!o.visible)return;let vis=true,p=o;while(p){if(!p.visible)vis=false;p=p.parent}if(!vis)return;
      tmp.multiplyMatrices(inv,o.matrixWorld);const pos=o.geometry.attributes.position,idx=o.geometry.index,n=idx?idx.count:pos.count;
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
  const NAMES={guitar:0,piano:1,violin:2,drums:3,oud:4,mic:5},HUDKEY=['guitar','piano','violin','drums','oud','vocals'];
  const anchors=[...document.querySelectorAll('[data-inst]')];
  if(!anchors.length){document.body.classList.add('no-webgl');return}
  const seq=anchors.map(a=>NAMES[a.dataset.inst]??0);
  const sides=anchors.map((a,j)=>a.dataset.side||(j%2?'left':'right'));
  const hasStage=!!document.getElementById('stage');
  [...new Set(seq)].forEach(i=>{INST[i].samples=samplePoints(INST[i])});
  const hudEl=document.querySelector('.hud');
  if(hudEl){hudEl.innerHTML=seq.map(i=>'<button type="button"><span data-i18n="'+HUDKEY[i]+'">'+T[lang][HUDKEY[i]]+'</span><i></i></button>').join('')}

  // morph particles
  const dotTex=(()=>{const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d');const gr=x.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(.3,'rgba(255,255,255,.55)');gr.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=gr;x.fillRect(0,0,64,64);return new THREE.CanvasTexture(c)})();
  const mPos=new Float32Array(NP*3),mCol=new Float32Array(NP*3),seed=new Float32Array(NP);for(let i=0;i<NP;i++)seed[i]=Math.random();
  const mGeo=new THREE.BufferGeometry();mGeo.setAttribute('position',new THREE.BufferAttribute(mPos,3));mGeo.setAttribute('color',new THREE.BufferAttribute(mCol,3));
  const mMat=new THREE.PointsMaterial({size:.075,map:dotTex,vertexColors:true,transparent:true,opacity:0,depthWrite:false,blending:THREE.AdditiveBlending});
  const morph=new THREE.Points(mGeo,mMat);morph.frustumCulled=false;scene.add(morph);

  // ambient star field
  const SN=mobile()?300:520,sp=new Float32Array(SN*3),sc=new Float32Array(SN*3),pal=[0x8b5cf6,0x22d3ee,0xf0abfc].map(c=>new THREE.Color(c));
  for(let i=0;i<SN;i++){sp[i*3]=(Math.random()-.5)*36;sp[i*3+1]=(Math.random()-.5)*24;sp[i*3+2]=-4-Math.random()*14;const c=pal[i%3];sc[i*3]=c.r;sc[i*3+1]=c.g;sc[i*3+2]=c.b}
  const sg=new THREE.BufferGeometry();sg.setAttribute('position',new THREE.BufferAttribute(sp,3));sg.setAttribute('color',new THREE.BufferAttribute(sc,3));
  const stars=new THREE.Points(sg,new THREE.PointsMaterial({size:.11,map:dotTex,vertexColors:true,transparent:true,opacity:.7,depthWrite:false,blending:THREE.AdditiveBlending}));scene.add(stars);

  // halo rings that follow the active instrument
  const halo=new THREE.Group();root.add(halo);
  const h1=new THREE.Mesh(new THREE.TorusGeometry(3.6,.012,8,160),new THREE.MeshBasicMaterial({color:0x8b5cf6,transparent:true,opacity:.5}));h1.rotation.x=1.25;halo.add(h1);
  const h2=new THREE.Mesh(new THREE.TorusGeometry(4.1,.008,8,160),new THREE.MeshBasicMaterial({color:0x22d3ee,transparent:true,opacity:.35}));h2.rotation.set(1.1,.5,0);halo.add(h2);

  // notes on pluck
  const noteTex=['♪','♫','♬','♩'].map(ch=>{const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d');x.font='bold 96px serif';x.textAlign='center';x.textBaseline='middle';x.shadowColor='#a78bfa';x.shadowBlur=24;x.fillStyle='#fff';x.fillText(ch,64,68);return new THREE.CanvasTexture(c)});
  const notes=[];
  function spawnNote(at,color){const sm=new THREE.SpriteMaterial({map:noteTex[Math.floor(Math.random()*4)],color,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending});
    const s=new THREE.Sprite(sm);s.position.copy(at);s.scale.setScalar(.55);scene.add(s);notes.push({s,life:1,vx:(Math.random()-.5)*.03,vy:.025+Math.random()*.015});
    if(notes.length>24){const o=notes.shift();scene.remove(o.s);o.s.material.dispose()}}

  // lights
  scene.add(new THREE.AmbientLight(0xffffff,.35));
  const key=new THREE.DirectionalLight(0xffffff,.9);key.position.set(3,5,8);scene.add(key);
  const pv=new THREE.PointLight(0x8b5cf6,2.6,40);pv.position.set(-6,3,6);scene.add(pv);
  const pc=new THREE.PointLight(0x22d3ee,2.4,40);pc.position.set(6,-3,6);scene.add(pc);
  const pb=new THREE.PointLight(0xe879f9,1.6,40);pb.position.set(0,2,-6);scene.add(pb);

  /* ---------- layout per section ---------- */
  function slot(j){const side=sides[j];
    if(mobile())return{p:V(0,j===0?(hasStage?-4.4:-3.4):-2.6,side==='center'?-1.5:-1),s:.62};
    let x=side==='right'?4.1:side==='left'?-4.3:0;if(document.documentElement.dir==='rtl')x=-x;
    return{p:V(x,j===0&&hasStage?-.1:-.2,side==='center'?-3:-.4),s:1}}

  /* ---------- guitar strumming (hero) ---------- */
  const G=INST[0];
  function pluck(i,vel){const s=G.strings[i];s.amp=Math.min(.16,.06+vel*.1);s.ph=0;playString(i,vel);
    const at=s.a.clone().lerp(s.b,.35+Math.random()*.2);G.inner.localToWorld(at);spawnNote(at,[0x22d3ee,0x5eead4,0x93c5fd,0xa78bfa,0xc084fc,0xf0abfc][i])}
  window.__guitar={pluck};
  const tA=new THREE.Vector3(),tB=new THREE.Vector3();
  function scr(v,out){out.copy(v);G.inner.localToWorld(out);out.project(camera);return{x:(out.x+1)/2*innerWidth,y:(1-out.y)/2*innerHeight}}
  let last=null,kNow=0,gActive=false;
  document.querySelectorAll('#stage,.strum-zone').forEach(zone=>{
  zone.addEventListener('pointermove',e=>{if(!gActive)return;const x=e.clientX,y=e.clientY;const vel=last?Math.min(1,Math.hypot(x-last.x,y-last.y)/40):.3;last={x,y};
    G.strings.forEach((s,i)=>{const A=scr(s.a,tA),B=scr(s.b,tB);const dx=B.x-A.x,dy=B.y-A.y,t=((x-A.x)*dx+(y-A.y)*dy)/(dx*dx+dy*dy),side=Math.sign(dx*(y-A.y)-dy*(x-A.x));
      if(t>.03&&t<.97&&s.prevSide!==null&&side!==0&&side!==s.prevSide)pluck(i,vel);s.prevSide=(t>-.1&&t<1.1)?side:null})});
  zone.addEventListener('pointerleave',()=>{last=null;G.strings.forEach(s=>s.prevSide=null)});
  zone.addEventListener('pointerdown',e=>{if(!gActive)return;let best=-1,bd=28;
    G.strings.forEach((s,i)=>{const A=scr(s.a,tA),B=scr(s.b,tB),dx=B.x-A.x,dy=B.y-A.y,t=Math.max(0,Math.min(1,((e.clientX-A.x)*dx+(e.clientY-A.y)*dy)/(dx*dx+dy*dy)));
      const d=Math.hypot(A.x+dx*t-e.clientX,A.y+dy*t-e.clientY);if(d<bd){bd=d;best=i}});if(best>=0)pluck(best,.6)});
  });

  /* ---------- resize ---------- */
  function resize(){const w=innerWidth,h=innerHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.position.z=Math.max(14,7.2/(.63*camera.aspect));camera.updateProjectionMatrix()}
  addEventListener('resize',resize);resize();

  /* ---------- scroll → k ---------- */
  const sstep=(a,b,x)=>{const t=Math.min(1,Math.max(0,(x-a)/(b-a)));return t*t*(3-2*t)};
  function targetK(){const y=innerHeight*.5;const c=anchors.map(a=>{const r=a.getBoundingClientRect();return r.top+Math.min(r.height,innerHeight)*.5});
    if(y<=c[0])return 0;for(let i=0;i<c.length-1;i++){if(y<c[i+1]){const f=(y-c[i])/(c[i+1]-c[i]);return i+sstep(.18,.82,f)}}return c.length-1}
  const hud=[...document.querySelectorAll('.hud button')];document.addEventListener('langchange',()=>{});
  hud.forEach((b,i)=>b.addEventListener('click',()=>anchors[i].scrollIntoView({behavior:'smooth',block:i?'center':'start'})));

  /* ---------- loop ---------- */
  const mouse={x:0,y:0,tx:0,ty:0};
  addEventListener('pointermove',e=>{mouse.tx=e.clientX/innerWidth*2-1;mouse.ty=e.clientY/innerHeight*2-1},{passive:true});
  const clock=new THREE.Clock();let intro=0,hudIdx=-1;
  const ease=x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;
  const cA=new THREE.Color(),cB=new THREE.Color(),cTmp=new THREE.Color(),mA=new THREE.Matrix4(),mB=new THREE.Matrix4(),vv=new THREE.Vector3(),vw=new THREE.Vector3();
  function pose(I,pos,rotY,scaleFull,out){I.ghost.position.copy(pos);I.ghost.rotation.set(0,rotY,0);I.ghost.scale.setScalar(scaleFull);I.ghost.updateMatrix();I.model.updateMatrix();
    out.multiplyMatrices(root.matrixWorld,I.ghost.matrix).multiply(I.model.matrix)}
  function frame(){
    requestAnimationFrame(frame);if(document.hidden)return;
    const dt=Math.min(clock.getDelta(),.05),t=clock.elapsedTime;
    intro=Math.min(1,intro+dt*.7);const ie=1-Math.pow(1-intro,3);
    mouse.x+=(mouse.tx-mouse.x)*.05;mouse.y+=(mouse.ty-mouse.y)*.05;
    const tk=targetK();kNow+=(tk-kNow)*Math.min(1,dt*(reduceMotion?30:5));
    const a0=Math.min(anchors.length-1,Math.floor(kNow+1e-4)),f=kNow-a0,a1=Math.min(anchors.length-1,a0+1),i0=seq[a0],i1=seq[a1];
    root.rotation.y=mouse.x*.12;root.rotation.x=mouse.y*.06;root.updateMatrixWorld();
    const sA=slot(a0),sB=slot(a1);const travel=ease(sstep(.1,.9,f));
    const anchor=sA.p.clone().lerp(sB.p,travel);
    const moving=a1!==a0&&f>.001&&f<.999,morphing=moving&&i1!==i0;
    INST.forEach((I,i)=>{
      let vis=0,rotY=0,pos=null,fullS=0;
      if(i===i0){vis=morphing?1-sstep(.02,.42,f):1;rotY=morphing?f*Math.PI*1.2:0;pos=moving?anchor:sA.p;fullS=(morphing||!moving?sA.s:sA.s+(sB.s-sA.s)*travel)*FULL[i]}
      else if(i===i1&&morphing){vis=sstep(.58,.98,f);rotY=-(1-f)*Math.PI*1.2;pos=anchor;fullS=sB.s*FULL[i]}
      if(vis<=.001){I.holder.visible=false;return}
      I.holder.visible=true;I.holder.position.copy(pos);
      I.holder.position.y+=Math.sin(t*.8+i)*.12;
      I.holder.rotation.set(Math.sin(t*.3+i)*.05,rotY+Math.sin(t*.45+i)*.18+mouse.x*.35-(i===0?1.2*(1-ie):0),0);
      I.holder.scale.setScalar(fullS*vis*(i===0?.75+.25*ie:1));
      I.update(t,dt);
    });
    // morph particles
    if(morphing&&!reduceMotion){
      const A=INST[i0],B=INST[i1];
      pose(A,anchor,f*Math.PI*1.2,sA.s*FULL[i0],mA);pose(B,anchor,-(1-f)*Math.PI*1.2,sB.s*FULL[i1],mB);
      const mm=sstep(.22,.78,f),burst=Math.sin(Math.PI*f);
      cA.setHex(A.colors[0]);cB.setHex(B.colors[0]);const cA2=new THREE.Color(A.colors[1]),cB2=new THREE.Color(B.colors[1]);
      const sa=A.samples,sb=B.samples;
      for(let k=0;k<NP;k++){const j=k*3,sd=seed[k];
        vv.set(sa[j],sa[j+1],sa[j+2]).applyMatrix4(mA);vw.set(sb[j],sb[j+1],sb[j+2]).applyMatrix4(mB);
        const lm=Math.min(1,Math.max(0,(mm-sd*.25)/.75));const e2=lm*lm*(3-2*lm);
        let x=vv.x+(vw.x-vv.x)*e2,y=vv.y+(vw.y-vv.y)*e2,z=vv.z+(vw.z-vv.z)*e2;
        const dx=x-anchor.x,dy=y-anchor.y,ang=t*1.5+sd*6.283;
        x+=(dx*.45+Math.cos(ang)*.9)*burst;y+=(dy*.45+Math.sin(ang*1.3)*.9)*burst;z+=Math.sin(ang*.7)*1.2*burst;
        mPos[j]=x;mPos[j+1]=y;mPos[j+2]=z;
        cTmp.copy(sd<.5?cA:cA2).lerp(sd<.5?cB:cB2,e2);mCol[j]=cTmp.r;mCol[j+1]=cTmp.g;mCol[j+2]=cTmp.b}
      mGeo.attributes.position.needsUpdate=true;mGeo.attributes.color.needsUpdate=true;
      mMat.opacity=Math.min(1,Math.pow(burst,.6)*1.1);morph.visible=true;
    }else{morph.visible=false}
    halo.position.copy(anchor);halo.scale.setScalar((morphing?1+Math.sin(Math.PI*f)*.4:1)*sA.s);halo.rotation.z=t*.08;halo.rotation.y=Math.sin(t*.2)*.3;
    stars.rotation.y=Math.sin(t*.05)*.1;stars.position.y=window.scrollY*.0015;
    for(let n=notes.length-1;n>=0;n--){const o=notes[n];o.life-=dt*.55;o.s.position.x+=o.vx;o.s.position.y+=o.vy;o.s.material.opacity=Math.max(0,o.life);o.s.scale.setScalar(.55+(1-o.life)*.3);
      if(o.life<=0){scene.remove(o.s);o.s.material.dispose();notes.splice(n,1)}}
    gActive=G.holder.visible&&!morphing&&G.holder.scale.x>.4;
    const hi=Math.round(kNow);if(hi!==hudIdx){hudIdx=hi;hud.forEach((b,i)=>b.classList.toggle('on',i===hi))}
    document.documentElement.style.setProperty('--k',kNow.toFixed(3));
    renderer.render(scene,camera);
  }
  frame();
}


/* ================= Contact form ================= */
function initContactForm(){
  const form=document.getElementById('contactForm');if(!form)return;
  const msg=document.getElementById('formMsg'),ok=document.getElementById('formSuccess');
  const show=(k)=>{msg.dataset.i18n=k;msg.textContent=T[lang][k];msg.hidden=false};
  form.addEventListener('submit',e=>{
    e.preventDefault();msg.hidden=true;
    const v=n=>(form.elements[n].value||'').trim();
    const data={name:v('name'),phone:v('phone'),email:v('email'),instrument:v('instrument'),age:v('age'),message:v('message')};
    if(!data.name||!data.phone){show('formErrRequired');return}
    const btn=form.querySelector('[type=submit]'),label=btn.querySelector('span');
    btn.disabled=true;label.dataset.i18n='formSending';label.textContent=T[lang].formSending;
    fetch('/api/public/lead',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)})
      .then(r=>r.json()).then(d=>{
        if(d.success){form.hidden=true;ok.hidden=false}else show('formErrServer');
      }).catch(()=>show('formErrNet'))
      .finally(()=>{btn.disabled=false;label.dataset.i18n='formSubmit';label.textContent=T[lang].formSubmit});
  });
}

document.addEventListener('DOMContentLoaded',()=>{
  const p=document.body.dataset.page;document.querySelectorAll('.nav-links a,.mobile-nav a').forEach(a=>{if(a.dataset.page===p)a.classList.add('active')});
  setLanguage(lang);initScene();initContactForm();
});
