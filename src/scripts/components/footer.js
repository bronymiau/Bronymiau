class Footer {
    constructor() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }
    init() {
        this.languageBtn = document.querySelector('.language-btn');
        this.languageDropdown = document.querySelector('.language-dropdown');
        this.languageOptions = document.querySelectorAll('.language-option');
        if (!this.languageBtn || !this.languageDropdown) {
            console.error('Language selector elements not found');
            return;
        }
        const savedLang = localStorage.getItem('language') || 'en';
        this.setInitialLanguage(savedLang);
        this.setupEventListeners();
        this.setupProtection();
    }
    setInitialLanguage(lang) {
        this.updateLanguageButton(lang);
        this.updateActiveOption(lang);
        this.applyTranslations(lang);
    }
    setLanguage(lang) {
        const transition = document.querySelector('.page-transition');
        if (!transition) return;
        transition.classList.add('active');
        setTimeout(() => {
            this.updateLanguageButton(lang);
            this.updateActiveOption(lang);
            this.applyTranslations(lang).then(({ languageChanged }) => {
                transition.classList.remove('active');
                if (languageChanged) {
                    window.Notifications?.show('languageChanged', 'info', lang);
                }
            });
        }, 300);
    }
    async applyTranslations(lang) {
        try {
            const module = await import('../../locales/translations.js');
            const translations = module.default[lang];
            if (!translations) return;
            const previousLang = localStorage.getItem('language');
            document.querySelectorAll('[data-translate]').forEach(element => {
                const key = element.dataset.translate;
                const parts = key.split('.');
                let translation = translations;
                for (const part of parts) {
                    translation = translation?.[part];
                    if (!translation) break;
                }
                if (typeof translation === 'string') {
                    element.textContent = translation;
                }
            });
            localStorage.setItem('language', lang);
            window.dispatchEvent(new CustomEvent('languageChanged', { 
                detail: { language: lang } 
            }));
            return { languageChanged: previousLang && previousLang !== lang };
        } catch (error) {
            console.error('Error applying translations:', error);
            window.Notifications?.show('error', 'error', lang);
            return { languageChanged: false };
        }
    }
    updateLanguageButton(lang) {
        const img = this.languageBtn.querySelector('img');
        if (img) {
            img.src = `/assets/images/icons/${lang}.png`;
            img.alt = lang.toUpperCase();
        }
    }
    updateActiveOption(lang) {
        this.languageOptions.forEach(option => {
            option.classList.toggle('active', option.dataset.lang === lang);
        });
    }
    setupEventListeners() {
        this.languageBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.languageBtn.classList.toggle('active');
            this.languageDropdown.classList.toggle('active');
        });
        document.addEventListener('click', (e) => {
            if (!this.languageBtn.contains(e.target) && !this.languageDropdown.contains(e.target)) {
                this.languageBtn.classList.remove('active');
                this.languageDropdown.classList.remove('active');
            }
        });
        this.languageOptions.forEach(option => {
            option.addEventListener('click', () => {
                const lang = option.dataset.lang;
                this.setLanguage(lang);
                this.languageBtn.classList.remove('active');
                this.languageDropdown.classList.remove('active');
            });
        });
    }
    setupProtection() {
        const footer = document.querySelector('.footer');
        if (!footer) return;
        footer.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            return false;
        });
        const images = footer.getElementsByTagName('img');
        Array.from(images).forEach(img => {
            img.setAttribute('draggable', 'false');
            img.addEventListener('dragstart', (e) => {
                e.preventDefault();
                return false;
            });
        });
        footer.addEventListener('selectstart', (e) => {
            e.preventDefault();
            return false;
        });
        footer.addEventListener('dragstart', (e) => {
            e.preventDefault();
            return false;
        });
        footer.addEventListener('copy', (e) => {
            e.preventDefault();
            return false;
        });
    }
    static async insert() {
        try {
            if (document.querySelector('.footer')) {
                return;
            }
            const response = await fetch('/components/footer.html');
            const footerHtml = await response.text();
            document.body.insertAdjacentHTML('beforeend', footerHtml);
            if (!document.querySelector('link[href="/styles/components/footer.css"]')) {
                const footerStyles = document.createElement('link');
                footerStyles.rel = 'stylesheet';
                footerStyles.href = '/styles/components/footer.css';
                document.head.appendChild(footerStyles);
            }
        } catch (error) {
            console.error('Error loading footer:', error);
        }
    }
}
document.addEventListener('DOMContentLoaded', () => {
    window.footerInstance = new Footer();
});
window.Footer = Footer; 
