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
        
        if (!href || 
            href.startsWith('#') || 
            href.startsWith('http') || 
            href.startsWith('https')) {
            return;
        }
        
        e.preventDefault();
        
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
});

function updateWarsawTime() {
    const warsawTime = new Date().toLocaleTimeString('pl-PL', {
        timeZone: 'Europe/Warsaw',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    document.getElementById('warsaw-time').textContent = warsawTime;
}

setInterval(updateWarsawTime, 1000);
updateWarsawTime();

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

document.addEventListener('DOMContentLoaded', function() {
    const artItems = document.querySelectorAll('.art-item');
    
    artItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            if (item.classList.contains('blur')) {
                showAgeVerification();
            }
        });
    });
});

function showAgeVerification() {
    const modal = document.createElement('div');
    modal.className = 'age-verification-modal';
    
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    
    const currentLang = localStorage.getItem('language') || 'ru';
    
    modal.innerHTML = `
        <h3>${translations[currentLang].ageVerification}</h3>
        <div class="modal-buttons">
            <button class="yes-btn">${translations[currentLang].yes}</button>
            <button class="no-btn">${translations[currentLang].no}</button>
        </div>
    `;
    
    document.body.appendChild(overlay);
    document.body.appendChild(modal);
    
    const yesBtn = modal.querySelector('.yes-btn');
    const noBtn = modal.querySelector('.no-btn');
    
    yesBtn.addEventListener('click', () => {
        sessionStorage.setItem('ageVerified', 'true');
        document.querySelectorAll('.art-item').forEach(item => {
            item.classList.remove('blur');
        });
        closeModal(modal, overlay);
    });
    
    noBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
}

function closeModal(modal, overlay) {
    if (modal) modal.remove();
    if (overlay) overlay.remove();
}

function showArtContent() {
    document.querySelectorAll('.art-item').forEach(item => {
        item.classList.remove('blur');
    });
}

window.onload = function() {
    if (window.location.href.includes('art.html') || window.location.pathname.includes('art.html')) {
        const ageVerified = sessionStorage.getItem('ageVerified');
        if (!ageVerified) {
            showAgeVerification();
        }
    }
};

function updateTerms() {
    const currentLang = document.documentElement.lang || 'ru';
    const terms = translations[currentLang].terms;
    const termsList = document.querySelectorAll('.terms-list li');
    
    termsList.forEach((item, index) => {
        item.textContent = terms[index];
    });
}

document.addEventListener('DOMContentLoaded', updateTerms);
document.addEventListener('languageChanged', updateTerms);

document.addEventListener('DOMContentLoaded', function() {
    if (window.location.href.includes('art.html') || window.location.pathname.includes('art.html')) {
        const ageVerified = sessionStorage.getItem('ageVerified');
        
        if (!ageVerified) {
            showAgeVerification();
        } else {
            showArtContent();
        }
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

function createSnowflakes() {
    const snowflakesContainer = document.createElement('div');
    snowflakesContainer.id = 'snowflakes-container';
    document.body.appendChild(snowflakesContainer);

    function createSnowflake() {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.style.left = Math.random() * window.innerWidth + 'px';
        snowflake.style.opacity = 0.5 + Math.random() * 0.5;
        snowflake.style.width = (2 + Math.random() * 3) + 'px';
        snowflake.style.height = snowflake.style.width;

        snowflakesContainer.appendChild(snowflake);

        const speed = 1 + Math.random() * 2;
        const rotation = Math.random() * 360;
        const sway = 50 + Math.random() * 100;
        let startPositionLeft = parseFloat(snowflake.style.left);
        let angle = 0;
        let currentTop = -10;

        function fall() {
            if (!document.getElementById('snowflakes-container')) {
                return;
            }

            currentTop += speed;
            angle += 0.02;

            snowflake.style.transform = `rotate(${rotation + angle}deg)`;
            snowflake.style.left = startPositionLeft + Math.sin(angle) * sway + 'px';
            snowflake.style.top = currentTop + 'px';

            if (currentTop > window.innerHeight) {
                if (snowflake.parentNode) {
                    snowflake.remove();
                }
                if (document.getElementById('snowflakes-container')) {
                    createSnowflake();
                }
                return;
            }

            requestAnimationFrame(fall);
        }

        fall();
    }

    for (let i = 0; i < 50; i++) {
        createSnowflake();
    }

    return snowflakesContainer;
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

document.addEventListener('click', function(e) {
    const colors = ['#ff0000', '#ff8000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#8000ff'];
    const sparkCount = 8;

    for (let i = 0; i < sparkCount; i++) {
        const spark = document.createElement('div');
        spark.className = 'spark';
        
        const color = colors[Math.floor(Math.random() * colors.length)];
        spark.style.backgroundColor = color;
        spark.style.color = color;
        
        spark.style.left = e.clientX + 'px';
        spark.style.top = e.clientY + 'px';
        
        const angle = (Math.PI * 2 * i) / sparkCount;
        const velocity = 10 + Math.random() * 10;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        document.body.appendChild(spark);
        
        let posX = e.clientX;
        let posY = e.clientY;
        
        function animateSpark() {
            posX += vx;
            posY += vy;
            spark.style.left = posX + 'px';
            spark.style.top = posY + 'px';
            
            if (spark.style.opacity > 0) {
                requestAnimationFrame(animateSpark);
            } else {
                spark.remove();
            }
        }
        
        requestAnimationFrame(animateSpark);
        
        setTimeout(() => spark.remove(), 500);
    }
});

document.body.style.cursor = 'url("Assets/Cursor.png"), auto'; 