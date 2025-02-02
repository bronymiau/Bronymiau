document.addEventListener('DOMContentLoaded', () => {
    import('../../locales/translations.js').then(module => {
        const translations = module.default;
        function applyTranslations(lang) {
            const elements = document.querySelectorAll('[data-i18n]');
            elements.forEach(element => {
                const key = element.dataset.i18n;
                const keys = key.split('.');
                let translation = translations[lang];
                for (const k of keys) {
                    translation = translation?.[k];
                    if (!translation) break;
                }
                if (typeof translation === 'string') {
                    element.textContent = translation;
                }
            });
        }
        const currentLang = localStorage.getItem('language') || 'en';
        applyTranslations(currentLang);
        document.addEventListener('languageChanged', (e) => {
            const newLang = e.detail.language;
            applyTranslations(newLang);
        });
    });
    function initNavbarAnimation() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;
        navbar.style = '';
        navbar.classList.remove('visible');
        navbar.style.transform = 'translateY(0)';
        navbar.style.opacity = '1';
        navbar.style.background = 'rgba(10, 10, 15, 0.7)';
        navbar.style.backdropFilter = 'blur(15px)';
        setTimeout(() => {
            navbar.classList.add('visible');
        }, 300);
        let lastScroll = window.pageYOffset;
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const currentScroll = window.pageYOffset;
                    if (currentScroll > lastScroll && currentScroll > 100) {
                        requestAnimationFrame(() => {
                            navbar.style.transform = 'translateY(-100%)';
                            navbar.style.opacity = '0';
                        });
                    } else {
                        requestAnimationFrame(() => {
                            navbar.style.transform = 'translateY(0)';
                            navbar.style.opacity = '1';
                            if (currentScroll > 50) {
                                navbar.style.background = 'rgba(10, 10, 15, 0.9)';
                                navbar.style.backdropFilter = 'blur(20px)';
                            } else {
                                navbar.style.background = 'rgba(10, 10, 15, 0.7)';
                                navbar.style.backdropFilter = 'blur(15px)';
                            }
                        });
                    }
                    lastScroll = currentScroll;
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
    function initLogoSound() {
        const logoLink = document.querySelector('.nav-logo');
        const yaySound = new Audio('/assets/songs/yay.mp3');
        let canPlaySound = true;
        function playYaySound() {
            if (canPlaySound) {
                yaySound.currentTime = 0; 
                yaySound.play();
                canPlaySound = false; 
                setTimeout(() => {
                    canPlaySound = true;
                }, 5000);
            }
        }
        if (logoLink) {
            logoLink.addEventListener('mouseenter', playYaySound);
            logoLink.addEventListener('click', (e) => {
                e.preventDefault(); 
                setTimeout(() => {
                    window.location.href = '/';
                }, 100);
            });
        }
    }
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.display = 'none';
    }
    initNavbarAnimation();
    initLogoSound();
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');
    if (tabs.length > 0 && contents.length > 0) {
        tabs[0].classList.add('active');
        const firstContent = document.getElementById(tabs[0].dataset.tab);
        if (firstContent) {
            firstContent.classList.add('active');
        }
    }
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            const content = document.getElementById(tab.dataset.tab);
            if (content) {
                content.classList.add('active');
            }
        });
    });
    const languageBtn = document.querySelector('.language-btn');
    const languageDropdown = document.querySelector('.language-dropdown');
    if (languageBtn && languageDropdown) {
        languageBtn.addEventListener('click', function(e) {
            e.preventDefault();
            languageDropdown.classList.toggle('active');
            this.classList.toggle('active');
        });
        document.addEventListener('click', function(e) {
            if (!languageBtn.contains(e.target) && !languageDropdown.contains(e.target)) {
                languageDropdown.classList.remove('active');
                languageBtn.classList.remove('active');
            }
        });
    }
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '50px'
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    document.querySelectorAll('.detail-card').forEach(card => {
        observer.observe(card);
    });
    if (window.Footer) {
        window.Footer.insert().then(() => {
            new Footer();
        });
    }
    function updateWarsawTime() {
        const warsawTimeElement = document.getElementById('warsawTime');
        if (!warsawTimeElement) return;
        const options = {
            timeZone: 'Europe/Warsaw',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        };
        const warsawTime = new Date().toLocaleTimeString('en-US', options);
        warsawTimeElement.textContent = `${warsawTime} Warsaw`;
    }
    setInterval(updateWarsawTime, 60000);
    updateWarsawTime();
    const scrollButton = document.querySelector('.scroll-to-top');
    if (scrollButton) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 200) {
                scrollButton.classList.add('visible');
            } else {
                scrollButton.classList.remove('visible');
            }
        });
        scrollButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    function updateActiveNavLink() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        const currentPath = window.location.pathname;
        const activeLink = document.querySelector(`.nav-link[href="${currentPath}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
    updateActiveNavLink();
}); 