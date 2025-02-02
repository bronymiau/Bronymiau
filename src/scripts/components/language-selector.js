class LanguageSelector {
    constructor() {
        this.currentLang = localStorage.getItem('language') || 'en';
        this.init();
    }
    init() {
        this.btn = document.querySelector('.language-btn');
        this.dropdown = document.querySelector('.language-dropdown');
        this.options = document.querySelectorAll('.language-option');
        if (!this.btn || !this.dropdown || !this.options.length) {
            return;
        }
        this.updateButtonFlag(this.currentLang);
        this.addEventListeners();
    }
    updateButtonFlag(lang) {
        const btnImg = this.btn.querySelector('img');
        if (btnImg) {
            btnImg.src = `/assets/images/icons/${lang}.png`;
            btnImg.alt = lang.toUpperCase();
        }
    }
    addEventListeners() {
        this.btn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDropdown();
        });
        this.options.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const lang = option.dataset.lang;
                this.changeLanguage(lang);
                this.closeDropdown();
            });
        });
        document.addEventListener('click', () => {
            this.closeDropdown();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeDropdown();
            }
        });
    }
    toggleDropdown() {
        this.dropdown.classList.toggle('active');
    }
    closeDropdown() {
        this.dropdown.classList.remove('active');
    }
    changeLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('language', lang);
        this.updateButtonFlag(lang);
        if (window.languageManager) {
            window.languageManager.setLanguage(lang);
        }
        const event = new CustomEvent('languageChanged', { detail: { language: lang } });
        document.dispatchEvent(event);
    }
}
document.addEventListener('DOMContentLoaded', () => {
    new LanguageSelector();
});
export default LanguageSelector; 