const customSelect = document.querySelector(".select");
const trigger = customSelect.querySelector(".trigger");
const triggerContent = customSelect.querySelector(".trigger_content");
const options = customSelect.querySelectorAll(".option");

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
    if (lang) localStorage.setItem("selected_lang", lang);
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
  const savedLang = localStorage.getItem("selected_lang");
  if (!savedLang) return;

  const matchedOption = Array.from(options).find((option) => {
    const img = option.querySelector("img");
    return img && img.getAttribute("alt") === savedLang;
  });

  if (matchedOption) {
    triggerContent.innerHTML = matchedOption.innerHTML;
    options.forEach((opt) => opt.classList.remove("active"));
    matchedOption.classList.add("active");
  }

  document.body.classList.remove("hidden-before-init");
});
