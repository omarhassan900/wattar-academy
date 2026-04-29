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
        contAddressVal: "Your address here",
        contPhone: "Phone",
        contPhoneVal: "+966 XX XXX XXXX",
        contEmail: "Email",
        contEmailVal: "info@wattaracademy.com",
        contHours: "Working Hours",
        contHoursVal: "Sun – Thu: 10AM – 9PM",
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
        navAbout: "من نحن",
        navPrograms: "البرامج",
        navContact: "تواصل معنا",
        langToggle: "English",

        // Home
        heroTitle: "حيث تبدأ الموسيقى",
        heroSubtitle: "أكاديمية وتر هي مركز تعليم موسيقي احترافي يقدم برامج منظمة لجميع الأعمار والمستويات.",
        heroCta: "استكشف البرامج",
        heroContact: "تواصل معنا",
        featTitle: "لماذا أكاديمية وتر",
        featSubtitle: "نهج منظم لتعليم الموسيقى يبني مهارات حقيقية.",
        feat1Title: "منهج منظم",
        feat1Desc: "برنامج تدريجي مدته 4 سنوات يتكون من 48 مستوى، كل مستوى يحتوي على 4 جلسات مصممة لبناء المهارات خطوة بخطوة.",
        feat2Title: "مدربون محترفون",
        feat2Desc: "تعلم من موسيقيين محترفين شغوفين بالتدريس ومكرسين لتطويرك.",
        feat3Title: "آلات متعددة",
        feat3Desc: "جيتار، بيانو، كمان، درامز، عود والمزيد. اعثر على الآلة التي تناسبك.",
        feat4Title: "فرقة وتر",
        feat4Desc: "انضم إلى برنامج فرقة الأكاديمية واستمتع بتجربة العزف مع زملائك الموسيقيين.",

        // About
        aboutHeroTitle: "عن أكاديمية وتر",
        aboutHeroSubtitle: "نبني موسيقيين، نغمة تلو الأخرى.",
        aboutTitle: "قصتنا",
        aboutText1: "تأسست أكاديمية وتر بمهمة بسيطة: جعل تعليم الموسيقى عالي الجودة متاحاً للجميع. نؤمن بأن الموسيقى لغة عالمية تربط الناس وتثري الحياة.",
        aboutText2: "منهجنا المنظم على مدى 4 سنوات يأخذ الطلاب من أول نغمة إلى الأداء بثقة، مع اهتمام شخصي وتوجيه احترافي في كل خطوة.",
        statStudents: "طالب نشط",
        statInstruments: "آلة موسيقية",
        statTrainers: "مدرب محترف",
        statYears: "سنوات منهج",
        valuesTitle: "قيمنا",
        val1Title: "التميز",
        val1Desc: "نلتزم بأعلى معايير التعليم الموسيقي لأنفسنا ولطلابنا.",
        val2Title: "الشغف",
        val2Desc: "الموسيقى ليست فقط ما نعلمه — إنها من نحن. هذا الشغف يقود كل ما نفعله.",
        val3Title: "المجتمع",
        val3Desc: "نبني بيئة داعمة حيث يلهم الطلاب بعضهم البعض ويتعلمون من بعضهم.",

        // Programs
        progHeroTitle: "برامجنا",
        progHeroSubtitle: "اكتشف المسار الموسيقي المناسب لك.",
        instrTitle: "الآلات التي نعلمها",
        instrSubtitle: "اختر من مجموعة واسعة من الآلات، كل منها يُدرّس بواسطة مدربين متخصصين.",
        guitar: "جيتار",
        piano: "بيانو",
        violin: "كمان",
        drums: "درامز",
        oud: "عود",
        vocals: "غناء",
        currTitle: "منهج 4 سنوات",
        currSubtitle: "رحلة تدريجية من المبتدئ إلى الموسيقي المتقدم.",
        year1: "السنة الأولى",
        year1Title: "الأساسيات",
        year1Desc: "الأشهر 1–12. بناء المهارات الأساسية وتعلم الأساسيات وتطوير التقنية الصحيحة وقراءة الموسيقى.",
        year2: "السنة الثانية",
        year2Title: "التطوير",
        year2Desc: "الأشهر 13–24. توسيع المقطوعات واستكشاف الأنماط والبدء بالعزف الجماعي.",
        year3: "السنة الثالثة",
        year3Title: "الصقل",
        year3Desc: "الأشهر 25–36. تقنيات متقدمة والتحضير للأداء والتعبير الموسيقي.",
        year4: "السنة الرابعة",
        year4Title: "الإتقان",
        year4Desc: "الأشهر 37–48. مهارات احترافية وأداء منفرد وحفل تخرج.",
        bandTitle: "برنامج فرقة وتر",
        bandSubtitle: "أكثر من دروس — تجربة فرقة حقيقية.",
        bandDesc: "يتم اختيار طلاب للانضمام إلى فرقة وتر، حيث يتدربون معاً ويقدمون عروضاً حية ويختبرون الجانب التعاوني من الموسيقى. تعمل الفرقة بدورات مع تدريبات وعروض منتظمة.",
        bandCta: "انضم للفرقة",

        // Contact
        contHeroTitle: "تواصل معنا",
        contHeroSubtitle: "مستعد لبدء رحلتك الموسيقية؟ يسعدنا سماعك.",
        formName: "الاسم الكامل",
        formPhone: "رقم الهاتف",
        formEmail: "البريد الإلكتروني (اختياري)",
        formInstrument: "الآلة المطلوبة",
        formSelect: "اختر آلة",
        formAge: "العمر (اختياري)",
        formMessage: "رسالة (اختياري)",
        formSubmit: "إرسال",
        formSuccess: "شكراً لك! سنتواصل معك قريباً.",
        contAddress: "العنوان",
        contAddressVal: "عنوانك هنا",
        contPhone: "الهاتف",
        contPhoneVal: "+966 XX XXX XXXX",
        contEmail: "البريد الإلكتروني",
        contEmailVal: "info@wattaracademy.com",
        contHours: "ساعات العمل",
        contHoursVal: "الأحد – الخميس: 10 صباحاً – 9 مساءً",
        contMap: "سيتم تضمين الخريطة هنا",

        // Footer
        footerDesc: "تعليم موسيقي احترافي لجميع الأعمار والمستويات.",
        footerPages: "الصفحات",
        footerPrograms: "البرامج",
        footerConnect: "تواصل",
        footerRights: "© 2026 أكاديمية وتر. جميع الحقوق محفوظة."
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
    // For now, just show success (no backend)
    form.style.display = 'none';
    document.getElementById('formSuccess').classList.add('show');
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    setLanguage(currentLang);

    const form = document.getElementById('contactForm');
    if (form) form.addEventListener('submit', handleContactForm);
});
