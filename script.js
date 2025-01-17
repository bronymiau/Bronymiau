let endTime = new Date('2025-02-09T00:00:00+01:00').getTime();
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
            updateTimerTheme();
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

    document.getElementById('imageModal').addEventListener('contextmenu', (e) => {
        e.preventDefault();
        return false;
    });

    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
            e.preventDefault();
            return false;
        }
    });

    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = button.getAttribute('data-tab');
            
            document.querySelectorAll('.tab-button').forEach(btn => 
                btn.classList.remove('active')
            );
            document.querySelectorAll('.tab-content').forEach(content => 
                content.classList.remove('active')
            );
            
            button.classList.add('active');
            document.querySelector(`.tab-content.${tabId}`).classList.add('active');
        });
    });


    const yearElement = document.querySelector('.footer-content p');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.innerHTML = `© ${currentYear} Bronymiau. All rights reserved.`;
    }

    function updateTimerTheme() {
        const currentTheme = localStorage.getItem('theme') || 'pink';
        const root = document.documentElement;
        
        switch(currentTheme) {
            case 'pink':
                root.style.setProperty('--timer-color', '#ff69b4');
                break;
            case 'purple':
                root.style.setProperty('--timer-color', '#9b59b6');
                break;
            case 'blue':
                root.style.setProperty('--timer-color', '#3498db');
                break;
            case 'yellow':
                root.style.setProperty('--timer-color', '#FFD700');
                break;
        }
    }

    updateTimerTheme();

    function updateBirthdayCountdown() {
        const countdownElement = document.getElementById('countdown');
        const messageElement = document.getElementById('birthday-message');
        const now = new Date().toLocaleString('en-US', { timeZone: 'Europe/Warsaw' });
        const currentTime = new Date(now).getTime();
        const diff = endTime - currentTime;

        const daysElement = document.getElementById('days');
        const hoursElement = document.getElementById('hours');
        const minutesElement = document.getElementById('minutes');
        const secondsElement = document.getElementById('seconds');

        if (daysElement && hoursElement && minutesElement && secondsElement) {
            if (diff <= 0) {
                if (countdownElement) countdownElement.style.display = 'none';
                if (messageElement) messageElement.style.display = 'block';
                showBirthdayMessage();
            } else {
                if (countdownElement) countdownElement.style.display = 'block';
                if (messageElement) messageElement.style.display = 'none';
                
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);

                daysElement.textContent = String(days).padStart(2, '0');
                hoursElement.textContent = String(hours).padStart(2, '0');
                minutesElement.textContent = String(minutes).padStart(2, '0');
                secondsElement.textContent = String(seconds).padStart(2, '0');
            }
        }
    }

    function showBirthdayMessage() {
        const messageElement = document.getElementById('birthday-message');
        if (messageElement) {
            messageElement.style.display = 'block';
        }

        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                createBalloons(5);
            }, i * 500);
        }

        const effectInterval = setInterval(() => {
            if (!document.hidden) {
                createBalloons(3);
            }
        }, 2000);

        window._birthdayEffectInterval = effectInterval;
    }

    function createBalloons(count = 3) {
        const oldBalloons = document.querySelectorAll('.balloon');
        oldBalloons.forEach(balloon => {
            const rect = balloon.getBoundingClientRect();
            if (rect.bottom < 0) {
                balloon.remove();
            }
        });

        const currentBalloons = document.querySelectorAll('.balloon').length;
        if (currentBalloons > 15) {
            return;
        }

        for (let i = 0; i < count; i++) {
            const balloon = document.createElement('div');
            balloon.className = 'balloon';
            
            const xPos = Math.random() * (window.innerWidth - 40);
            const color = getRandomColor();
            const size = 30 + Math.random() * 20;
            
            balloon.style.cssText = `
                position: fixed;
                left: ${xPos}px;
                bottom: -${size}px;
                width: ${size}px;
                height: ${size * 1.25}px;
                background-color: ${color};
                border-radius: 50% 50% 50% 50% / 40% 40% 60% 60%;
                animation: balloonRise 8s ease-out forwards;
                pointer-events: none;
                z-index: 1000;
            `;
            
            document.body.appendChild(balloon);
            
            setTimeout(() => {
                balloon.remove();
            }, 8000);
        }
    }

    function getRandomColor() {
        const colors = [
            '#ff69b4', // розовый
            '#9b59b6', // пурпурный
            '#3498db', // синий
            '#f1c40f', // желтый
            '#2ecc71', // зеленый
            '#e74c3c', // красный
            '#1abc9c'  // бирюзовый
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    const style = document.createElement('style');
    style.textContent = `
        @keyframes balloonRise {
            0% {
                transform: translateY(0) rotate(0deg);
            }
            100% {
                transform: translateY(-${window.innerHeight + 100}px) rotate(${Math.random() * 360}deg);
            }
        }
        .balloon {
            transition: all 0.3s ease;
        }
    `;
    document.head.appendChild(style);

    updateBirthdayCountdown();
    setInterval(updateBirthdayCountdown, 1000);
});

function updateWarsawTime() {
    const timeElement = document.getElementById('warsaw-time');
    if (!timeElement) return; 
    
    const warsawTime = new Date().toLocaleTimeString('pl-PL', {
        timeZone: 'Europe/Warsaw',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    timeElement.textContent = warsawTime;
}


if (document.getElementById('warsaw-time')) {
    setInterval(updateWarsawTime, 1000);
    updateWarsawTime();
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

function switchTab(tabId) {
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    event.target.classList.add('active');
    
    document.getElementById(tabId).classList.add('active');
}

document.addEventListener('DOMContentLoaded', () => {
    const initialLang = sessionStorage.getItem('initialLanguage') || localStorage.getItem('language') || 'en';
    document.documentElement.setAttribute('data-lang', initialLang);
    updateLanguage(initialLang);
    updatePrices(initialLang);
    
    document.querySelectorAll('.lang-button').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === initialLang);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    function updateBirthdayCountdown() {
        const countdownElement = document.getElementById('countdown');
        const messageElement = document.getElementById('birthday-message');
        const now = new Date().toLocaleString('en-US', { timeZone: 'Europe/Warsaw' });
        const currentTime = new Date(now).getTime();
        const diff = endTime - currentTime;

        const daysElement = document.getElementById('days');
        const hoursElement = document.getElementById('hours');
        const minutesElement = document.getElementById('minutes');
        const secondsElement = document.getElementById('seconds');

        if (daysElement && hoursElement && minutesElement && secondsElement) {
            if (diff <= 0) {
                if (countdownElement) countdownElement.style.display = 'none';
                if (messageElement) messageElement.style.display = 'block';
                showBirthdayMessage();
            } else {
                if (countdownElement) countdownElement.style.display = 'block';
                if (messageElement) messageElement.style.display = 'none';
                
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);

                daysElement.textContent = String(days).padStart(2, '0');
                hoursElement.textContent = String(hours).padStart(2, '0');
                minutesElement.textContent = String(minutes).padStart(2, '0');
                secondsElement.textContent = String(seconds).padStart(2, '0');
            }
        }
    }

    function showBirthdayMessage() {
        const messageElement = document.getElementById('birthday-message');
        if (messageElement) {
            messageElement.style.display = 'block';
        }

        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                createBalloons(5);
            }, i * 500);
        }

        const effectInterval = setInterval(() => {
            if (!document.hidden) {
                createBalloons(3);
            }
        }, 2000);

        window._birthdayEffectInterval = effectInterval;
    }

    function createBalloons(count = 3) {
        const oldBalloons = document.querySelectorAll('.balloon');
        oldBalloons.forEach(balloon => {
            const rect = balloon.getBoundingClientRect();
            if (rect.bottom < 0) {
                balloon.remove();
            }
        });

        const currentBalloons = document.querySelectorAll('.balloon').length;
        if (currentBalloons > 15) {
            return;
        }

        for (let i = 0; i < count; i++) {
            const balloon = document.createElement('div');
            balloon.className = 'balloon';
            
            const xPos = Math.random() * (window.innerWidth - 40);
            const color = getRandomColor();
            const size = 30 + Math.random() * 20;
            
            balloon.style.cssText = `
                position: fixed;
                left: ${xPos}px;
                bottom: -${size}px;
                width: ${size}px;
                height: ${size * 1.25}px;
                background-color: ${color};
                border-radius: 50% 50% 50% 50% / 40% 40% 60% 60%;
                animation: balloonRise 8s ease-out forwards;
                pointer-events: none;
                z-index: 1000;
            `;
            
            document.body.appendChild(balloon);
            
            setTimeout(() => {
                balloon.remove();
            }, 8000);
        }
    }

    function getRandomColor() {
        const colors = [
            '#ff69b4', // розовый
            '#9b59b6', // пурпурный
            '#3498db', // синий
            '#f1c40f', // желтый
            '#2ecc71', // зеленый
            '#e74c3c', // красный
            '#1abc9c'  // бирюзовый
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    const style = document.createElement('style');
    style.textContent = `
        @keyframes balloonRise {
            0% {
                transform: translateY(0) rotate(0deg);
            }
            100% {
                transform: translateY(-${window.innerHeight + 100}px) rotate(${Math.random() * 360}deg);
            }
        }
        .balloon {
            transition: all 0.3s ease;
        }
    `;
    document.head.appendChild(style);

    updateBirthdayCountdown();
    setInterval(updateBirthdayCountdown, 1000);
});

function createFirework(x, y) {
    const colors = ['#ff69b4', '#9b59b6', '#3498db', '#f1c40f', '#2ecc71', '#e74c3c', '#1abc9c'];
    const particles = 30;
    
    for (let i = 0; i < particles; i++) {
        const particle = document.createElement('div');
        particle.className = 'firework-particle';
        
        const angle = (i * 360) / particles;
        const velocity = 2 + Math.random() * 2;
        const hue = colors[Math.floor(Math.random() * colors.length)];
        
        particle.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            width: 4px;
            height: 4px;
            background-color: ${hue};
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
        `;
        
        document.body.appendChild(particle);
        
        const radians = angle * (Math.PI / 180);
        const vx = Math.cos(radians) * velocity;
        const vy = Math.sin(radians) * velocity;
        
        let posX = x;
        let posY = y;
        let opacity = 1;
        let scale = 1;
        
        const animate = () => {
            if (opacity <= 0) {
                particle.remove();
                return;
            }
            
            posX += vx;
            posY += vy;
            opacity -= 0.02;
            scale -= 0.01;
            
            particle.style.transform = `translate(${posX - x}px, ${posY - y}px) scale(${scale})`;
            particle.style.opacity = opacity;
            
            requestAnimationFrame(animate);
        };
        
        requestAnimationFrame(animate);
    }
}

document.addEventListener('DOMContentLoaded', () => {

    function addRandomFirework() {
        const countdown = document.getElementById('countdown');
        if (countdown) {
            const rect = countdown.getBoundingClientRect();
            const x = rect.left + Math.random() * rect.width;
            const y = rect.top + Math.random() * rect.height;
            createFirework(x, y);
        }
    }

    setInterval(() => {
        if (!document.hidden) {
            addRandomFirework();
        }
    }, 3000);
});