const customSelect = document.querySelector(".select");
const trigger = customSelect.querySelector(".trigger");
const triggerContent = customSelect.querySelector(".trigger_content");
const options = customSelect.querySelectorAll(".option");
const STORAGE_KEY = "selected_lang";

// Open select
trigger.addEventListener("click", () => {
  customSelect.classList.toggle("open");
});

options.forEach((option) => {
  option.addEventListener("click", () => {
    // Change option in trigger
    triggerContent.innerHTML = option.innerHTML;
    customSelect.classList.remove("open");

    // Add class to active option
    options.forEach((opt) => opt.classList.remove("active"));
    option.classList.add("active");

    // Save to localStorage
    const lang = option.querySelector("img").getAttribute("alt");
    if (lang) localStorage.setItem(STORAGE_KEY, lang);
  });
});

// Close select when click out select
document.addEventListener("click", (e) => {
  if (!customSelect.contains(e.target)) {
    customSelect.classList.remove("open");
  }
});

// On ready
window.addEventListener("DOMContentLoaded", () => {
  const savedLang = localStorage.getItem(STORAGE_KEY);

  let langToSelect = savedLang;

  // Set lang from browser lang
  if (langToSelect) {
    const cyrillicLanguages = [
      "ru", // Русский
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

    const browserLang = navigator.language.slice(0, 2);
    console.log(navigator.language);

    if (cyrillicLanguages.includes(browserLang)) {
      langToSelect = "ru";
    } else if (browserLang === "fr") {
      langToSelect = "fr";
    } else if (browserLang === "es") {
      langToSelect = "es";
    } else if (browserLang === "de") {
      langToSelect = "de";
    } else if (browserLang === "zh") {
      langToSelect = "zh";
    } else {
      langToSelect = "en";
    }

    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, langToSelect);
  }

  // Set active lang
  const matchedOption = Array.from(options).find((option) => {
    const img = option.querySelector("img");
    return img && img.getAttribute("alt") === savedLang;
  });
  if (matchedOption) {
    triggerContent.innerHTML = matchedOption.innerHTML;
    options.forEach((opt) => opt.classList.remove("active"));
    matchedOption.classList.add("active");
  }

  // Remove loading
  document.body.classList.remove("hidden-before-init");
});
