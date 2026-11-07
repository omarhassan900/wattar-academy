// ============================================
// Wattar Academy — Main JS
// Language toggle, mobile nav, form handling
// ============================================

const translations = {
    en: {
        // Navbar
        navHome: "Home",
        navAbout: "About",
        navPrograms: "Programs",
        navContact: "Contact",
        langToggle: "العربية",

        // Home
        heroTitle: "Where Music Begins",
        heroSubtitle: "Wattar Academy is a professional music education center offering structured programs for all ages and skill levels.",
        heroCta: "Explore Programs",
        heroContact: "Get in Touch",
        featTitle: "Why Wattar Academy",
        featSubtitle: "A structured approach to music education that builds real skills.",
        feat1Title: "Structured Curriculum",
        feat1Desc: "A 4-year progressive program with 48 levels, each with 4 sessions designed to build skills step by step.",
        feat2Title: "Expert Trainers",
        feat2Desc: "Learn from professional musicians who are passionate about teaching and dedicated to your growth.",
        feat3Title: "Multiple Instruments",
        feat3Desc: "Guitar, Piano, Violin, Drums, Oud and more. Find the instrument that speaks to you.",
        feat4Title: "Wattar Band",
        feat4Desc: "Join our academy band program and experience the thrill of performing with fellow musicians.",

        // About
        aboutHeroTitle: "About Wattar Academy",
        aboutHeroSubtitle: "Building musicians, one note at a time.",
        aboutTitle: "Our Story",
        aboutText1: "Wattar Academy was founded with a simple mission: to make quality music education accessible to everyone. We believe that music is a universal language that connects people and enriches lives.",
        aboutText2: "Our structured 4-year curriculum takes students from their very first note to confident performance, with personalized attention and professional guidance at every step.",
        statStudents: "Active Students",
        statInstruments: "Instruments",
        statTrainers: "Expert Trainers",
        statYears: "Years of Curriculum",
        valuesTitle: "Our Values",
        val1Title: "Excellence",
        val1Desc: "We hold ourselves and our students to the highest standards of musical education.",
        val2Title: "Passion",
        val2Desc: "Music is not just what we teach — it's who we are. That passion drives everything we do.",
        val3Title: "Community",
        val3Desc: "We build a supportive environment where students inspire and learn from each other.",

        // Programs
        progHeroTitle: "Our Programs",
        progHeroSubtitle: "Discover the right musical path for you.",
        instrTitle: "Instruments We Teach",
        instrSubtitle: "Choose from a wide range of instruments, each taught by specialized trainers.",
        guitar: "Guitar",
        piano: "Piano",
        violin: "Violin",
        drums: "Drums",
        oud: "Oud",
        vocals: "Vocals",
        currTitle: "4-Year Curriculum",
        currSubtitle: "A progressive journey from beginner to advanced musician.",
        year1: "Year 1",
        year1Title: "Foundation",
        year1Desc: "Months 1–12. Build core skills, learn fundamentals, develop proper technique and music reading.",
        year2: "Year 2",
        year2Title: "Development",
        year2Desc: "Months 13–24. Expand repertoire, explore styles, and begin ensemble playing.",
        year3: "Year 3",
        year3Title: "Refinement",
        year3Desc: "Months 25–36. Advanced techniques, performance preparation, and musical expression.",
        year4: "Year 4",
        year4Title: "Mastery",
        year4Desc: "Months 37–48. Professional-level skills, solo performance, and graduation recital.",
        bandTitle: "Wattar Band Program",
        bandSubtitle: "More than lessons — a real band experience.",
        bandDesc: "Selected students join the Wattar Band, where they rehearse together, perform live, and experience the collaborative side of music. The band operates in cycles with regular rehearsals and performances.",
        bandCta: "Join the Band",

        // Contact
        contHeroTitle: "Get in Touch",
        contHeroSubtitle: "Ready to start your musical journey? We'd love to hear from you.",
        formName: "Full Name",
        formPhone: "Phone Number",
        formEmail: "Email (optional)",
        formInstrument: "Instrument of Interest",
        formSelect: "Select an instrument",
        formAge: "Age (optional)",
        formMessage: "Message (optional)",
        formSubmit: "Send Message",
        formSuccess: "Thank you! We'll be in touch soon.",
        contAddress: "Address",
        contAddressVal: "Mokattam, Behind Hosny",
        contPhone: "Phone",
        contPhoneVal: "01009205520",
        contEmail: "Email",
        contEmailVal: "info@wattaracademy.com",
        contHours: "Working Hours",
        contHoursVal: "Sun – Thu: 3PM – 10PM | Sat: 12PM – 10PM",
        contMap: "Map will be embedded here",

        // Footer
        footerDesc: "Professional music education for all ages and skill levels.",
        footerPages: "Pages",
        footerPrograms: "Programs",
        footerConnect: "Connect",
        footerRights: "© 2026 Wattar Academy. All rights reserved."
    },
    ar: {
        // Navbar
        navHome: "الرئيسية",
        navAbout: "مين احنا",
        navPrograms: "البرامج",
        navContact: "كلمنا",
        langToggle: "English",

        // Home
        heroTitle: "هنا الموسيقى بتبدأ",
        heroSubtitle: "أكاديمية وتر مركز تعليم موسيقى محترف بيقدم برامج منظمة لكل الأعمار والمستويات.",
        heroCta: "اعرف برامجنا",
        heroContact: "كلمنا",
        featTitle: "ليه أكاديمية وتر",
        featSubtitle: "طريقة منظمة لتعليم الموسيقى بتبني مهارات حقيقية.",
        feat1Title: "منهج منظم",
        feat1Desc: "برنامج 4 سنين فيه 48 مستوى، كل مستوى فيه 4 حصص مصممة تبني مهاراتك خطوة بخطوة.",
        feat2Title: "مدربين محترفين",
        feat2Desc: "اتعلم من موسيقيين محترفين بيحبوا التدريس ومهتمين بتطويرك.",
        feat3Title: "آلات كتير",
        feat3Desc: "جيتار، بيانو، كمان، درامز، عود وغيرهم. لاقي الآلة اللي تناسبك.",
        feat4Title: "فرقة وتر",
        feat4Desc: "انضم لفرقة الأكاديمية وجرب إحساس العزف مع زمايلك.",

        // About
        aboutHeroTitle: "مين احنا",
        aboutHeroSubtitle: "بنبني موسيقيين، نغمة ورا نغمة.",
        aboutTitle: "حكايتنا",
        aboutText1: "أكاديمية وتر اتأسست بهدف بسيط: إن تعليم الموسيقى الكويس يبقى متاح للكل. بنؤمن إن الموسيقى لغة عالمية بتربط الناس ببعض وبتغني حياتهم.",
        aboutText2: "المنهج بتاعنا اللي مدته 4 سنين بياخد الطالب من أول نغمة لحد ما يعزف بثقة، مع اهتمام شخصي وتوجيه محترف في كل خطوة.",
        statStudents: "طالب نشط",
        statInstruments: "آلة موسيقية",
        statTrainers: "مدرب محترف",
        statYears: "سنين منهج",
        valuesTitle: "قيمنا",
        val1Title: "التميز",
        val1Desc: "بنلتزم بأعلى معايير التعليم الموسيقي لينا ولطلابنا.",
        val2Title: "الشغف",
        val2Desc: "الموسيقى مش بس اللي بنعلمه — دي احنا. الشغف ده بيحرك كل حاجة بنعملها.",
        val3Title: "المجتمع",
        val3Desc: "بنبني بيئة داعمة الطلاب فيها بيلهموا بعض ويتعلموا من بعض.",

        // Programs
        progHeroTitle: "برامجنا",
        progHeroSubtitle: "اكتشف المسار الموسيقي المناسب ليك.",
        instrTitle: "الآلات اللي بنعلمها",
        instrSubtitle: "اختار من آلات كتير، كل واحدة بيدرسها مدربين متخصصين.",
        guitar: "جيتار",
        piano: "بيانو",
        violin: "كمان",
        drums: "درامز",
        oud: "عود",
        vocals: "غناء",
        currTitle: "منهج 4 سنين",
        currSubtitle: "رحلة من المبتدئ للموسيقي المحترف.",
        year1: "السنة الأولى",
        year1Title: "الأساسيات",
        year1Desc: "شهر 1–12. بناء المهارات الأساسية وتعلم الأساسيات وتطوير التكنيك الصح وقراءة النوتة.",
        year2: "السنة التانية",
        year2Title: "التطوير",
        year2Desc: "شهر 13–24. توسيع المقطوعات واستكشاف أنماط مختلفة والبدء بالعزف الجماعي.",
        year3: "السنة التالتة",
        year3Title: "الصقل",
        year3Desc: "شهر 25–36. تكنيكات متقدمة والتحضير للأداء والتعبير الموسيقي.",
        year4: "السنة الرابعة",
        year4Title: "الإتقان",
        year4Desc: "شهر 37–48. مهارات احترافية وأداء منفرد وحفل تخرج.",
        bandTitle: "برنامج فرقة وتر",
        bandSubtitle: "أكتر من دروس — تجربة فرقة حقيقية.",
        bandDesc: "بيتم اختيار طلاب ينضموا لفرقة وتر، بيتدربوا مع بعض ويعملوا عروض لايف ويجربوا الجانب الجماعي من الموسيقى. الفرقة بتشتغل بدورات مع بروفات وعروض منتظمة.",
        bandCta: "انضم للفرقة",

        // Contact
        contHeroTitle: "كلمنا",
        contHeroSubtitle: "مستعد تبدأ رحلتك الموسيقية؟ يسعدنا نسمع منك.",
        formName: "الاسم بالكامل",
        formPhone: "رقم الموبايل",
        formEmail: "الإيميل (اختياري)",
        formInstrument: "الآلة اللي عايز تتعلمها",
        formSelect: "اختار آلة",
        formAge: "السن (اختياري)",
        formMessage: "رسالة (اختياري)",
        formSubmit: "ابعت",
        formSuccess: "شكراً ليك! هنتواصل معاك قريب.",
        contAddress: "العنوان",
        contAddressVal: "المقطم، خلف حسني",
        contPhone: "الموبايل",
        contPhoneVal: "01009205520",
        contEmail: "الإيميل",
        contEmailVal: "info@wattaracademy.com",
        contHours: "مواعيد العمل",
        contHoursVal: "الحد – الخميس: 3 العصر – 10 بليل | السبت: 12 الضهر – 10 بليل",
        contMap: "الخريطة هتبقى هنا",

        // Footer
        footerDesc: "تعليم موسيقى محترف لكل الأعمار والمستويات.",
        footerPages: "الصفحات",
        footerPrograms: "البرامج",
        footerConnect: "تابعنا",
        footerRights: "© 2026 أكاديمية وتر. كل الحقوق محفوظة."
    }
};

let currentLang = localStorage.getItem('wattar-lang') || 'en';

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('wattar-lang', lang);
    document.body.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = translations[lang][key];
            } else if (el.tagName === 'OPTION' && el.value === '') {
                el.textContent = translations[lang][key];
            } else {
                el.textContent = translations[lang][key];
            }
        }
    });
}

function toggleLanguage() {
    setLanguage(currentLang === 'en' ? 'ar' : 'en');
}

// Mobile nav
function openMobileNav() {
    document.getElementById('mobileNav').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeMobileNav() {
    document.getElementById('mobileNav').classList.remove('open');
    document.body.style.overflow = '';
}

// Contact form
function handleContactForm(e) {
    e.preventDefault();
    const form = e.target;
    const data = {
        name: form.querySelector('[name="name"]').value,
        phone: form.querySelector('[name="phone"]').value,
        email: form.querySelector('[name="email"]').value,
        instrument: form.querySelector('[name="instrument"]').value,
        age: form.querySelector('[name="age"]').value,
        message: form.querySelector('[name="message"]').value
    };

    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = currentLang === 'ar' ? 'جاري الإرسال...' : 'Sending...';

    fetch('/api/public/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(r => r.json())
    .then(d => {
        if (d.success) {
            form.style.display = 'none';
            document.getElementById('formSuccess').classList.add('show');
        } else {
            alert(d.error || 'Something went wrong');
            submitBtn.disabled = false;
            submitBtn.textContent = currentLang === 'ar' ? 'إرسال' : 'Send Message';
        }
    })
    .catch(() => {
        alert('Connection error. Please try again.');
        submitBtn.disabled = false;
        submitBtn.textContent = currentLang === 'ar' ? 'إرسال' : 'Send Message';
    });
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    setLanguage(currentLang);

    const form = document.getElementById('contactForm');
    if (form) form.addEventListener('submit', handleContactForm);
});
