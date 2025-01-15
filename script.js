let isSnowEnabled = false;
let snowflakeInterval;

(function() {
    const transitionContainer = document.createElement('div');
    transitionContainer.className = 'page-transition';
    
    const rainbowDash = document.createElement('img');
    rainbowDash.src = 'Assets/RainbowDash.png';
    rainbowDash.className = 'rainbow-dash';
    
    transitionContainer.appendChild(rainbowDash);
    document.body.appendChild(transitionContainer);

    function handleTransition(e) {
        const href = this.getAttribute('href');
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        
        if (!href || 
            href.startsWith('#') || 
            href.startsWith('http') || 
            href.startsWith('https') ||
            href === currentPath) {
            return;
        }
        
        if (this.classList.contains('transitioning')) {
            return;
        }
        
        e.preventDefault();
        this.classList.add('transitioning');
        
        const currentLang = localStorage.getItem('language') || 'en';
        sessionStorage.setItem('initialLanguage', currentLang);
        
        rainbowDash.style.transition = 'none';
        rainbowDash.style.transform = 'translateY(-50%) translateX(0)';
        
        transitionContainer.style.opacity = '1';
        transitionContainer.style.visibility = 'visible';
        
        requestAnimationFrame(() => {
            rainbowDash.style.transition = 'transform 0.5s ease-out';
            rainbowDash.style.transform = `translateY(-50%) translateX(-${window.innerWidth + 1200}px)`;
        });
        
        setTimeout(() => {
            window.location.href = href;
        }, 500);
    }

    document.addEventListener('DOMContentLoaded', function() {
        document.querySelectorAll('a').forEach(link => {
            if (link.getAttribute('href') && 
                !link.getAttribute('href').startsWith('#') && 
                !link.getAttribute('href').startsWith('http')) {
                link.addEventListener('click', handleTransition);
            }
        });
    });
})();

(function() {
    const savedTheme = localStorage.getItem('theme') || 'pink';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    const savedLang = localStorage.getItem('language') || 'en';
    document.documentElement.setAttribute('data-lang', savedLang);
    
    document.addEventListener('DOMContentLoaded', () => {
        updatePrices(savedLang);
    });

    document.addEventListener('DOMContentLoaded', () => {
        const snowButton = document.createElement('button');
        snowButton.className = 'snow-button';
        snowButton.innerHTML = '<img src="Assets/Snow.png" alt="Snow">';
        document.body.appendChild(snowButton);

        let snowflakesContainer = null;
        const snowEnabled = localStorage.getItem('snow') === 'true';

        if (snowEnabled) {
            snowflakesContainer = createSnowflakes();
            snowButton.classList.add('active');
        }

        snowButton.addEventListener('click', () => {
            if (snowflakesContainer) {
                snowflakesContainer.remove();
                snowflakesContainer = null;
                snowButton.classList.remove('active');
                localStorage.setItem('snow', 'false');
            } else {
                snowflakesContainer = createSnowflakes();
                snowButton.classList.add('active');
                localStorage.setItem('snow', 'true');
            }
        });
    });

    document.addEventListener('DOMContentLoaded', () => {
        const pinkieImage = document.querySelector('.pinkie-decoration');
        if (pinkieImage) {
            const pinkieSound = new Audio('Assets/PinkieSound.mp3');
            let canClick = true;
            const cooldown = 3000;

            const clickArea = document.createElement('div');
            clickArea.className = 'pinkie-click-area';
            pinkieImage.parentNode.appendChild(clickArea);

            pinkieImage.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                return false;
            });

            clickArea.addEventListener('click', (e) => {
                if (canClick) {
                    pinkieSound.currentTime = 0;
                    pinkieSound.play();

                    createConfetti(e.clientX, e.clientY);

                    pinkieImage.style.transform = 'scale(1.1)';
                    setTimeout(() => {
                        pinkieImage.style.transform = 'scale(1)';
                    }, 200);

                    canClick = false;
                    setTimeout(() => {
                        canClick = true;
                    }, cooldown);
                }
            });

            pinkieImage.addEventListener('dragstart', (e) => {
                e.preventDefault();
                return false;
            });
        }
    });

    function createConfetti(x, y) {
        const colors = ['#ff69b4', '#00bfff', '#9370db', '#ffd700'];
        const confettiCount = 50;

        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            confetti.style.cssText = `
                position: fixed;
                left: ${x}px;
                top: ${y}px;
                width: 10px;
                height: 10px;
                background-color: ${color};
                transform: rotate(${Math.random() * 360}deg);
                z-index: 1000;
                pointer-events: none;
            `;

            document.body.appendChild(confetti);

            const angle = Math.random() * Math.PI * 2;
            const velocity = 15 + Math.random() * 15;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;

            let posX = x;
            let posY = y;

            const animate = () => {
                posX += vx;
                posY += vy + 0.5;

                confetti.style.left = `${posX}px`;
                confetti.style.top = `${posY}px`;

                if (posY > window.innerHeight) {
                    confetti.remove();
                    return;
                }

                requestAnimationFrame(animate);
            };

            animate();

            setTimeout(() => confetti.remove(), 3000);
        }
    }
})();

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = 'translateY(0)';
        }
    });
});

document.querySelectorAll('section > *').forEach((element) => {
    element.style.opacity = 0;
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'all 0.6s ease-out';
    observer.observe(element);
});

document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    const indicator = document.querySelector('.nav-indicator');
    const navItems = document.querySelectorAll('.nav-item');

    const backgroundGradient = document.createElement('div');
    backgroundGradient.classList.add('background-gradient');
    document.body.appendChild(backgroundGradient);

    const activeItem = document.querySelector('.nav-item.active');
    if (activeItem) {
        updateIndicatorPosition(activeItem);
    }

    navItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            updateIndicatorPosition(item);
        });
    });

    navbar.addEventListener('mouseleave', () => {
        const activeItem = document.querySelector('.nav-item.active');
        if (activeItem) {
            updateIndicatorPosition(activeItem);
        }
    });

    function updateIndicatorPosition(item) {
        const rect = item.getBoundingClientRect();
        const navRect = navbar.getBoundingClientRect();
        
        indicator.style.transform = `translateX(${rect.left - navRect.left + (rect.width / 2) - 5}px)`;
    }

    document.querySelectorAll('.nav-item').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            
            const currentItem = document.querySelector('.nav-item.active');
            const targetItem = this;
            const currentRect = currentItem.getBoundingClientRect();
            const targetRect = targetItem.getBoundingClientRect();
            
            const jumpIndicator = document.createElement('div');
            jumpIndicator.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: var(--primary-color);
                border-radius: 50%;
                top: ${currentRect.top + currentRect.height + 20}px;
                left: ${currentRect.left + currentRect.width / 2}px;
                transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
                pointer-events: none;
                box-shadow: 0 0 15px var(--primary-color);
                z-index: 1000;
            `;
            document.body.appendChild(jumpIndicator);
            
            requestAnimationFrame(() => {
                jumpIndicator.style.top = `${targetRect.top + targetRect.height + 20}px`;
                jumpIndicator.style.left = `${targetRect.left + targetRect.width / 2}px`;
            });
            
            setTimeout(() => {
                window.location.href = href;
            }, 500);
        });
    });

    const themeSwitcher = document.querySelector('.theme-switcher');
    const themeButtons = document.querySelectorAll('.theme-button');
    
    const savedTheme = localStorage.getItem('theme') || 'pink';
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeButtons.forEach(btn => {
        if (btn.dataset.theme === savedTheme) {
            btn.classList.add('active');
        }
    });

    themeSwitcher.addEventListener('click', (e) => {
        if (e.target.classList.contains('theme-button')) {
            const theme = e.target.dataset.theme;
            
            themeButtons.forEach(btn => btn.classList.remove('active'));
            
            e.target.classList.add('active');
            
            document.documentElement.setAttribute('data-theme', theme);
            
            localStorage.setItem('theme', theme);
            
            document.body.style.transition = 'all 0.5s ease';
        }
    });

    const langSwitcher = document.querySelector('.language-switcher');
    const langButtons = document.querySelectorAll('.lang-button');
    
    const savedLang = localStorage.getItem('language') || 'en';
    document.documentElement.setAttribute('data-lang', savedLang);
    updateLanguage(savedLang);
    
    langButtons.forEach(btn => {
        if (btn.dataset.lang === savedLang) {
            btn.classList.add('active');
        }
    });

    langSwitcher.addEventListener('click', (e) => {
        const button = e.target.closest('.lang-button');
        if (button) {
            const lang = button.dataset.lang;
            
            langButtons.forEach(btn => btn.classList.remove('active'));
            
            button.classList.add('active');
            
            document.documentElement.setAttribute('data-lang', lang);
            updateLanguage(lang);
            
            localStorage.setItem('language', lang);
        }
    });

    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const closeBtn = document.querySelector('.close-modal');
    const ageModal = document.getElementById('ageVerificationModal');
    let selectedImage = null;
    let isAdult = localStorage.getItem('isAdult') === 'true';

    // Обработка открытия изображений
    document.querySelectorAll('.portfolio-grid .art-item img').forEach(img => {
        img.style.cursor = 'pointer';
        img.style.pointerEvents = 'auto';
        
        img.addEventListener('click', function() {
            selectedImage = this;
            if (isAdult) {
                showImage(this);
            } else {
                showAgeVerification();
            }
        });
    });

    function showImage(imgElement) {
        modal.style.display = 'block';
        modalImg.src = imgElement.src;
        document.body.style.overflow = 'hidden';
    }

    function showAgeVerification() {
        ageModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    // Обработка кнопок подтверждения возраста
    document.getElementById('yesAge').addEventListener('click', () => {
        isAdult = true;
        localStorage.setItem('isAdult', 'true');
        ageModal.style.display = 'none';
        if (selectedImage) {
            showImage(selectedImage);
        }
    });

    document.getElementById('noAge').addEventListener('click', () => {
        ageModal.style.display = 'none';
        document.body.style.overflow = '';
        selectedImage = null;
    });

    // Закрытие модальных окон
    closeBtn.addEventListener('click', closeModals);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModals();
        }
    });
    ageModal.addEventListener('click', (e) => {
        if (e.target === ageModal) {
            closeModals();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModals();
        }
    });

    function closeModals() {
        modal.style.display = 'none';
        ageModal.style.display = 'none';
        document.body.style.overflow = '';
        selectedImage = null;
    }

    // Запрет контекстного меню на изображениях
    document.querySelectorAll('.portfolio-grid .art-item img, .modal-content').forEach(img => {
        img.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            return false;
        });
        
        img.addEventListener('dragstart', (e) => {
            e.preventDefault();
            return false;
        });
    });

    // Запрет контекстного меню в модальном окне
    document.getElementById('imageModal').addEventListener('contextmenu', (e) => {
        e.preventDefault();
        return false;
    });

    // Запрет сохранения изображений через клавиатуру
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
            e.preventDefault();
            return false;
        }
    });

    // Обработка переключения вкладок OC
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = button.getAttribute('data-tab');
            
            // Убираем активный класс у всех кнопок и контента
            document.querySelectorAll('.tab-button').forEach(btn => 
                btn.classList.remove('active')
            );
            document.querySelectorAll('.tab-content').forEach(content => 
                content.classList.remove('active')
            );
            
            // Добавляем активный класс нажатой кнопке и соответствующему контенту
            button.classList.add('active');
            document.querySelector(`.tab-content.${tabId}`).classList.add('active');
        });
    });

    // Обновление года в футере
    const yearElement = document.querySelector('.footer-content p');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.innerHTML = `© ${currentYear} Bronymiau. All rights reserved.`;
    }
});

function updateWarsawTime() {
    const timeElement = document.getElementById('warsaw-time');
    if (!timeElement) return; // Прекращаем выполнение если элемента нет на странице
    
    const warsawTime = new Date().toLocaleTimeString('pl-PL', {
        timeZone: 'Europe/Warsaw',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    timeElement.textContent = warsawTime;
}

// Запускаем интервал только если элемент существует
if (document.getElementById('warsaw-time')) {
    setInterval(updateWarsawTime, 1000);
    updateWarsawTime(); // Первоначальное обновление
}

function updateLanguage(lang) {
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.dataset.translate;
        
        if (key.startsWith('terms.')) {
            const index = parseInt(key.split('.')[1]);
            if (translations[lang].terms && translations[lang].terms[index] !== undefined) {
                element.textContent = translations[lang].terms[index];
            }
        } else if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
}

function updatePrices(lang) {
    document.querySelectorAll('.price-item span[data-price]').forEach(priceSpan => {
        const price = priceSpan.getAttribute(lang === 'ru' ? 'data-price-ru' : 'data-price');
        const currency = lang === 'ru' ? '₽' : '$';
        const prefix = priceSpan.textContent.startsWith('+') ? '+' : '';
        priceSpan.textContent = `${prefix}${currency}${price}`;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const currentLang = localStorage.getItem('language') || 'en';
    updatePrices(currentLang);

    document.querySelectorAll('.lang-button').forEach(button => {
        button.addEventListener('click', () => {
            const lang = button.getAttribute('data-lang');
            document.documentElement.setAttribute('data-lang', lang);
            localStorage.setItem('language', lang);
            updateTranslations();
            updatePrices(lang);
        });
    });
});

function createSnowflakes() {
    const container = document.createElement('div');
    container.className = 'snowflakes-container';
    document.body.appendChild(container);

    function createSnowflake() {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.style.left = Math.random() * window.innerWidth + 'px';
        snowflake.style.opacity = Math.random();
        snowflake.style.width = snowflake.style.height = Math.random() * 4 + 2 + 'px';
        
        container.appendChild(snowflake);
        
        const animationDuration = Math.random() * 3 + 2;
        const xDistance = (Math.random() - 0.5) * 200;
        
        snowflake.animate([
            { transform: 'translateY(0) translateX(0)', opacity: 1 },
            { transform: `translateY(${window.innerHeight}px) translateX(${xDistance}px)`, opacity: 0.3 }
        ], {
            duration: animationDuration * 1000,
            easing: 'linear'
        }).onfinish = () => snowflake.remove();
    }

    const interval = setInterval(createSnowflake, 50);
    return container;
}

document.addEventListener('DOMContentLoaded', () => {
    const snowButton = document.createElement('button');
    snowButton.className = 'snow-button';
    snowButton.innerHTML = '<img src="Assets/Snow.png" alt="Snow">';
    document.body.appendChild(snowButton);

    let snowflakesContainer = null;
    const snowEnabled = localStorage.getItem('snow') === 'true';

    if (snowEnabled) {
        snowflakesContainer = createSnowflakes();
        snowButton.classList.add('active');
    }

    snowButton.addEventListener('click', () => {
        if (snowflakesContainer) {
            snowflakesContainer.remove();
            snowflakesContainer = null;
            snowButton.classList.remove('active');
            localStorage.setItem('snow', 'false');
        } else {
            snowflakesContainer = createSnowflakes();
            snowButton.classList.add('active');
            localStorage.setItem('snow', 'true');
        }
    });
});

// Заменяем обработчик вкладок на более простой
function switchTab(tabId) {
    // Убираем активный класс у всех кнопок
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Убираем активный класс у всех содержимых вкладок
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Добавляем активный класс нужной кнопке
    event.target.classList.add('active');
    
    // Показываем нужное содержимое
    document.getElementById(tabId).classList.add('active');
}

document.addEventListener('DOMContentLoaded', () => {
    // Немедленно применяем сохраненный язык
    const initialLang = sessionStorage.getItem('initialLanguage') || localStorage.getItem('language') || 'en';
    document.documentElement.setAttribute('data-lang', initialLang);
    updateLanguage(initialLang);
    updatePrices(initialLang);
    
    // Обновляем активную кнопку языка
    document.querySelectorAll('.lang-button').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === initialLang);
    });
}); 