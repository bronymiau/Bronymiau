import translations from '../locales/translations.js';
class LanguageManager {
    constructor() {
        window.languageManager = this;
        this.isLoading = true;
        this.currentLang = localStorage.getItem('language') || 'en';
        this.translations = translations;
        document.documentElement.setAttribute('data-lang', this.currentLang);
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }
    init() {
        try {
            this.updateContent();
            this.updateLanguageButton();
            this.setupLanguageSelector();
            requestAnimationFrame(() => {
                document.documentElement.style.visibility = 'visible';
                this.isLoading = false;
            });
        } catch (error) {
            this.isLoading = false;
        }
    }
    setupLanguageSelector() {
        const languageBtn = document.getElementById('languageBtn');
        const languageDropdown = document.getElementById('languageDropdown');
        if (!languageBtn || !languageDropdown) {
            return;
        }
        languageBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            languageDropdown.classList.toggle('active');
        });
        const languageOptions = languageDropdown.querySelectorAll('.language-option');
        languageOptions.forEach(option => {
            option.addEventListener('click', () => {
                const lang = option.dataset.lang;
                this.setLanguage(lang);
                languageDropdown.classList.remove('active');
            });
        });
        document.addEventListener('click', (e) => {
            if (!languageBtn.contains(e.target) && !languageDropdown.contains(e.target)) {
                languageDropdown.classList.remove('active');
            }
        });
    }
    setLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('language', lang);
        document.documentElement.setAttribute('data-lang', lang);
        this.updateContent();
        this.updateLanguageButton();
    }
    updateLanguageButton() {
        const flagImg = document.getElementById('currentLangFlag');
        flagImg.src = `/assets/images/icons/${this.currentLang}.png`;
    }
    updateContent() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.dataset.i18n;
            const translation = this.getTranslation(key);
            if (translation) {
                if (element.tagName === 'INPUT' && element.type === 'placeholder') {
                    element.placeholder = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });
    }
    getTranslation(key) {
        const keys = key.split('.');
        let translation = this.translations[this.currentLang];
        for (const k of keys) {
            if (translation && translation[k]) {
                translation = translation[k];
            } else {
                return null;
            }
        }
        return translation;
    }
    observeDOM() {
        const observer = new MutationObserver((mutations) => {
            this.updateContent();
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    updateFlag(lang) {
        const currentFlag = document.querySelector('.language-btn img');
        currentFlag.src = `/assets/images/icons/${lang}.png`;
        currentFlag.alt = lang.toUpperCase();
        document.querySelectorAll('.language-option').forEach(option => {
            option.classList.toggle('active', option.dataset.lang === lang);
        });
    }
}
const languageManager = new LanguageManager();
export default languageManager; 