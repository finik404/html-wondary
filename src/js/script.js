import i18next from "i18next";
import locales from './locales.json';

const customSelect = document.querySelector(".select");
const trigger = customSelect.querySelector(".trigger");
const triggerContent = customSelect.querySelector(".trigger_content");
const options = customSelect.querySelectorAll(".option");
const scrollBtn = document.getElementById('scrollBtn');
const STORAGE_KEY = "selected_lang";

if (scrollBtn) {
    scrollBtn.addEventListener('click', function () {
        const target = document.getElementById('download');
        if (target) {
            target.scrollIntoView({behavior: 'smooth'});
        }
    });
}

// Detect browser lang
function detectBrowserLang() {
    const cyrillicLanguages = ["ru", // Русский
        "be", // Белорусский
        "uk", // Украинский
        "kk", // Казахский
        "ky", // Киргизский
        "uz", // Узбекский
        "tg", // Таджикский
        "tk", // Туркменский
        "az", // Азербайджанский
        "hy", // Армянский
        "ro", // Румынский (Молдова)
    ];

    const langs = (navigator.languages || [navigator.language]).map(lang => lang.slice(0, 2));

    if (langs.find(lang => cyrillicLanguages.includes(lang))) return "ru";
    if (langs.includes("fr")) return "fr";
    if (langs.includes("es")) return "es";
    if (langs.includes("de")) return "de";
    if (langs.includes("zh")) return "zh";

    return "en";
}

// Update content
function updateContent() {
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        el.innerHTML = i18next.t(key);
    });

    // 👇 Show RuStore only on russian
    const rustoreBtn = document.querySelector(".rustore-btn");
    if (rustoreBtn) {
        if (i18next.language.startsWith("ru")) {
            rustoreBtn.classList.remove("hidden");
        } else {
            rustoreBtn.classList.add("hidden");
        }
    }

    // Add class to option
    if (i18next.language.startsWith("ru") && trigger) {
        trigger.parentElement.classList.add("ru");
    } else {
        trigger.parentElement.classList.remove("ru");
    }

    // Change images
    document.querySelectorAll('[data-lang-src]').forEach(img => {
        const template = img.getAttribute('data-lang-src');
        const finalSrc = template.replace('{lang}', i18next.language);
        img.setAttribute('src', finalSrc);
    });
}

// Update meta
function updateMeta() {
    const description = document.querySelector('meta[name="description"]');
    const keywords = document.querySelector('meta[name="keywords"]');

    if (description) {
        description.setAttribute('content', i18next.t('meta_description'));
    }

    if (keywords) {
        keywords.setAttribute('content', i18next.t('meta_keywords'));
    }
}

// Set locale on ready
window.addEventListener("DOMContentLoaded", () => {
    let savedLang = localStorage.getItem(STORAGE_KEY);
    const langToUse = savedLang || detectBrowserLang();

    // Save lang
    if (!savedLang) localStorage.setItem(STORAGE_KEY, langToUse);

    // Init i18next
    i18next.init({
        lng: langToUse, resources: locales,
    }, () => {
        updateMeta();
        updateContent();
        initSelect(langToUse);
        document.body.classList.remove("hidden-before-init");
    });
});

// Init select lang
function initSelect(lang) {
    const matchedOption = Array.from(options).find(option => {
        const img = option.querySelector("img");
        return img && img.getAttribute("alt") === lang;
    });

    if (matchedOption && triggerContent && options) {
        triggerContent.innerHTML = matchedOption.innerHTML;
        options.forEach(opt => opt.classList.remove("active"));
        matchedOption.classList.add("active");
    }
}

// Open select
if (trigger) {
    trigger.addEventListener("click", () => {
        customSelect.classList.toggle("open");
    });
}

// Change lang
options.forEach((option) => {
    option.addEventListener("click", () => {
        // Lang
        const lang = option.querySelector("img").getAttribute("alt");
        if (!lang || !customSelect || !customSelect) return;

        // Change option
        triggerContent.innerHTML = option.innerHTML;
        customSelect.classList.remove("open");
        options.forEach((opt) => opt.classList.remove("active"));
        option.classList.add("active");

        // Save to localStorage
        localStorage.setItem(STORAGE_KEY, lang);

        // Change content
        i18next.changeLanguage(lang, () => {
            updateMeta();
            updateContent();
        });
    });
});

// Close select when click out select
document.addEventListener("click", (e) => {
    if (!customSelect.contains(e.target)) {
        customSelect.classList.remove("open");
    }
});
