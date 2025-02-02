console.clear();

console.log(`%c
    🦄 Welcome to Equestria!
    Version: 6.6.6
    `, 'color: #ec4899; font-size: 14px; font-weight: bold; padding: 10px;'
);

console.log(`%c
    ⚠️ Warning: This is a protected area!
    Any unauthorized modifications may result in unexpected pony appearances!
    `, 'color: #eab308; font-size: 12px; font-weight: bold; padding: 5px;'
);

function initFadeInElements() {
    const fadeElements = document.querySelectorAll('[data-fade]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const delay = element.dataset.delay || 0;
                const randomDelay = Math.random() * 100;
                setTimeout(() => {
                    element.classList.add('fade-in');
                }, delay * 100 + randomDelay);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '50px'
    });
    fadeElements.forEach(element => {
        observer.observe(element);
    });
}
function handlePreloader() {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            preloader.classList.add('hidden');
            document.body.style.overflow = 'visible';
            initFadeInElements();
        });
    }
}
function initializeRoutes() {
    const currentPath = window.location.pathname;
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('hidden');
                document.body.style.overflow = 'visible';
                if (currentPath === '/try-luck') {
                    const fortuneSection = document.querySelector('.luck-section');
                    if (fortuneSection) {
                        fortuneSection.style.opacity = '1';
                        fortuneSection.style.visibility = 'visible';
                    }
                }
            }, 500);
        });
    }
}
document.addEventListener('DOMContentLoaded', () => {
    initializeRoutes();
    document.documentElement.classList.add('js-loaded');
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        navbar.style.transform = 'translateY(0)';
        navbar.style.opacity = '1';
        navbar.style.background = 'rgba(10, 10, 15, 0.7)';
        navbar.style.backdropFilter = 'blur(15px)';
        setTimeout(() => {
            navbar.classList.add('visible');
        }, 100);
    }
    const elements = {
        '.hero-text h1': { fade: 'up', delay: 0 },
        '.hero-text .subtitle': { fade: 'up', delay: 2 },
        '.hero-text .description': { fade: 'up', delay: 4 },
        '.hero-buttons': { fade: 'up', delay: 6 },
        '.hero-image': { fade: 'right', delay: 4 },
        '.category-choice': { fade: 'up', delay: 'index' },
        '.gallery-item': { fade: 'up', delay: 'index' },
        '.project-card': { fade: 'up', delay: 'index' },
        '.section-title': { fade: 'up', delay: 0 },
        '.age-warning': { fade: 'up', delay: 2 },
        '.nav-logo': { fade: 'down', delay: 0 },
        '.nav-links a': { fade: 'down', delay: 'index' }
    };
    Object.entries(elements).forEach(([selector, config]) => {
        document.querySelectorAll(selector).forEach((element, index) => {
            element.setAttribute('data-fade', config.fade);
            element.setAttribute('data-delay', config.delay === 'index' ? index * 2 : config.delay);
        });
    });
    handlePreloader();
    document.querySelectorAll('.container').forEach((block, index) => {
        block.classList.add('fade-in');
        block.style.animationDelay = `${index * 0.2}s`;
    });
    const ponyImages = document.querySelectorAll('img[data-hover]');
    ponyImages.forEach(img => {
        const staticSrc = img.src;
        const animatedSrc = img.dataset.hover;
        img.addEventListener('click', () => {
            img.src = animatedSrc;
            setTimeout(() => {
                img.src = staticSrc;
            }, 3000); 
        });
    });
    const ponySprites = document.querySelectorAll('.pony-sprite');
    ponySprites.forEach(sprite => {
        sprite.addEventListener('click', () => {
            sprite.classList.add('active');
            const character = sprite.dataset.character;
            sprite.style.backgroundImage = `url('/assets/images/ponies/animated/${character}-sprite.gif')`;
            setTimeout(() => {
                sprite.classList.remove('active');
                sprite.style.backgroundImage = `url('/assets/images/ponies/static/${character}-sprite.png')`;
            }, 3000);
        });
    });
    initGallery();
    createConstellation();
    initCategorySelection();
    initGallery();
    createGalleryConstellation();
    createPonyConstellation();
    initFadeInElements();
    initScrollToTop();
    initScrollAnimations();
    const categoryLinks = document.querySelectorAll('.category-choice');
    if (categoryLinks) {
        categoryLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const type = link.dataset.category;
                let targetSection;
                if (type === 'art') {
                    targetSection = document.querySelector('.artwork-gallery');
                } else if (type === 'programming') {
                    targetSection = document.querySelector('.coding-section');
                }
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    const initComponents = () => {
    };
    try {
        initComponents();
    } catch (error) {
    }
    initNavbarAnimation();
    initLogoSound();
    if (window.location.search.includes('horror=true')) {
        document.body.style.animation = 'glitch 0.2s infinite';
        setTimeout(() => {
            document.body.style.animation = '';
            history.replaceState({}, document.title, window.location.pathname);
        }, 5000);
    }
});
let lastScroll = 0;
let ticking = false;
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const currentScroll = window.pageYOffset;
            if (currentScroll > lastScroll && currentScroll > 100) {
                navbar.style.transform = 'translateY(-100%)';
                navbar.style.opacity = '0';
            } else {
                navbar.style.transform = 'translateY(0)';
                navbar.style.opacity = '1';
                if (currentScroll > 50) {
                    navbar.style.background = 'rgba(10, 10, 15, 0.9)';
                    navbar.style.backdropFilter = 'blur(20px)';
                } else {
                    navbar.style.background = 'rgba(10, 10, 15, 0.7)';
                    navbar.style.backdropFilter = 'blur(15px)';
                }
            }
            lastScroll = currentScroll;
            ticking = false;
        });
        ticking = true;
    }
});
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});
function createConstellation() {
    const constellation = document.createElement('div');
    constellation.classList.add('constellation');
    for (let i = 0; i < 50; i++) {
        const dot = document.createElement('div');
        dot.classList.add('constellation-dot');
        dot.style.left = `${Math.random() * 100}%`;
        dot.style.top = `${Math.random() * 100}%`;
        constellation.appendChild(dot);
    }
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        heroSection.appendChild(constellation);
    }
}
function initProjectsSection() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const projectCards = document.querySelectorAll('.project-card');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const category = btn.dataset.category;
            projectCards.forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    card.style.display = 'block';
                    setTimeout(() => card.classList.add('visible'), 100);
                } else {
                    card.classList.remove('visible');
                    setTimeout(() => card.style.display = 'none', 300);
                }
            });
        });
    });
    const projectLinks = document.querySelectorAll('a[href="#projects"]');
    projectLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const projectsSection = document.querySelector('.projects-section');
            projectsSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        });
    });
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    projectCards.forEach(card => observer.observe(card));
}
function initCategorySelection() {
    const categories = document.querySelectorAll('.category-choice');
    categories.forEach(category => {
        category.addEventListener('click', (e) => {
            e.preventDefault();
            const type = category.dataset.category;
            let targetSection;
            if (type === 'art') {
                targetSection = document.querySelector('.artwork-gallery');
            } else if (type === 'programming') {
                targetSection = document.querySelector('.coding-section');
            }
            if (targetSection) {
                category.classList.add('clicked');
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                targetSection.classList.add('highlight');
                setTimeout(() => {
                    category.classList.remove('clicked');
                    setTimeout(() => {
                        targetSection.classList.remove('highlight');
                    }, 1000);
                }, 300);
            }
        });
    });
}
function initGallery() {
    const galleryContainer = document.querySelector('.gallery-container');
    const galleryTrack = document.querySelector('.gallery-track');
    const items = document.querySelectorAll('.gallery-item');
    if (!galleryContainer || !galleryTrack || items.length === 0) return;
    const itemWidth = 350; 
    const gap = 32; 
    const visibleItems = 3; 
    const maxScroll = Math.max(0, items.length - visibleItems); 
    let currentIndex = 0;
    function updateNavButtons() {
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        if (currentIndex === 0) {
            prevBtn.classList.add('disabled');
        } else {
            prevBtn.classList.remove('disabled');
        }
        if (currentIndex >= maxScroll) {
            nextBtn.classList.add('disabled');
        } else {
            nextBtn.classList.remove('disabled');
        }
    }
    function smoothScroll(target) {
        const scrollAmount = target * (itemWidth + gap);
        galleryTrack.style.transform = `translateX(-${scrollAmount}px)`;
    }
    document.querySelector('.prev-btn')?.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            smoothScroll(currentIndex);
            updateNavButtons();
        }
    });
    document.querySelector('.next-btn')?.addEventListener('click', () => {
        if (currentIndex < maxScroll) {
            currentIndex++;
            smoothScroll(currentIndex);
            updateNavButtons();
        }
    });
    updateNavButtons();
    let modal = document.querySelector('.image-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.className = 'image-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <img src="" alt="Full size image">
                <div class="close-modal"></div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    const modalImg = modal.querySelector('img');
    const closeBtn = modal.querySelector('.close-modal');
    items.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            modal.classList.add('active');
            modalImg.src = img.src;
            document.body.classList.add('modal-open');
        });
    });
    function closeModal() {
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
    }
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}
function createGalleryConstellation() {
    const section = document.querySelector('.projects-section');
    const constellationBg = document.createElement('div');
    constellationBg.className = 'constellation-bg';
    const dotsCount = 30;
    const positions = [];
    for (let i = 0; i < dotsCount; i++) {
        const dot = document.createElement('div');
        dot.className = 'constellation-dot';
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        dot.style.left = `${x}%`;
        dot.style.top = `${y}%`;
        dot.style.animationDelay = `${Math.random() * 3}s`;
        constellationBg.appendChild(dot);
        positions.push({x, y});
    }
    positions.forEach((start, i) => {
        positions.slice(i + 1).forEach(end => {
            if (Math.random() > 0.85) return; 
            const distance = Math.hypot(end.x - start.x, end.y - start.y);
            if (distance > 30) return; 
            const line = document.createElement('div');
            line.className = 'constellation-line';
            const angle = Math.atan2(end.y - start.y, end.x - start.x);
            line.style.width = `${distance}%`;
            line.style.left = `${start.x}%`;
            line.style.top = `${start.y}%`;
            line.style.transform = `rotate(${angle}rad)`;
            constellationBg.appendChild(line);
        });
    });
    if (section && constellationBg && section.firstChild) {
        section.insertBefore(constellationBg, section.firstChild);
    }
}
function createPonyConstellation() {
    const ponyPoints = [
        {x: 15, y: 40},  
        {x: 25, y: 35},  
        {x: 35, y: 45},  
        {x: 20, y: 55},  
        {x: 65, y: 30},  
        {x: 75, y: 35},  
        {x: 85, y: 45},  
        {x: 80, y: 55},  
        {x: 70, y: 50},  
    ];
    const constellation = document.createElement('div');
    constellation.className = 'pony-constellation';
    ponyPoints.forEach((point, index) => {
        const star = document.createElement('div');
        star.className = 'pony-star';
        star.style.left = `${point.x}%`;
        star.style.top = `${point.y}%`;
        star.style.animationDelay = `${index * 0.2}s`;
        constellation.appendChild(star);
    });
    for (let i = 0; i < ponyPoints.length - 1; i++) {
        const start = ponyPoints[i];
        const end = ponyPoints[i + 1];
        const length = Math.hypot(end.x - start.x, end.y - start.y);
        const angle = Math.atan2(end.y - start.y, end.x - start.x);
        const line = document.createElement('div');
        line.className = 'pony-line';
        line.style.width = `${length}%`;
        line.style.left = `${start.x}%`;
        line.style.top = `${start.y}%`;
        line.style.transform = `rotate(${angle}rad)`;
        line.style.animationDelay = `${i * 0.2}s`;
        constellation.appendChild(line);
    }
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        heroSection.appendChild(constellation);
    }
}
function initScrollToTop() {
    const scrollButton = document.querySelector('.scroll-to-top');
    function toggleScrollButton() {
        if (window.pageYOffset > 200) { 
            scrollButton.classList.add('visible');
        } else {
            scrollButton.classList.remove('visible');
        }
    }
    scrollButton.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    window.addEventListener('scroll', toggleScrollButton);
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
function initScrollAnimations() {
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, options);
    const timeline = document.querySelector('.timeline-chart');
    if (timeline) observer.observe(timeline);
    const aboutContent = document.querySelector('.about-content');
    if (aboutContent) observer.observe(aboutContent);
    const projectsContainer = document.querySelector('.projects-container');
    if (projectsContainer) observer.observe(projectsContainer);
}
function initNavbarAnimation() {
    const navbar = document.querySelector('.navbar');
    setTimeout(() => {
        navbar.classList.add('visible');
    }, 300);
    let lastScroll = 0;
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const currentScroll = window.pageYOffset;
                if (currentScroll > lastScroll && currentScroll > 100) {
                    navbar.style.transform = 'translateY(-100%)';
                    navbar.style.opacity = '0';
                } else {
                    navbar.style.transform = 'translateY(0)';
                    navbar.style.opacity = '1';
                    if (currentScroll > 50) {
                        navbar.style.background = 'rgba(10, 10, 15, 0.9)';
                        navbar.style.backdropFilter = 'blur(20px)';
                    } else {
                        navbar.style.background = 'rgba(10, 10, 15, 0.7)';
                        navbar.style.backdropFilter = 'blur(15px)';
                    }
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

function getRandomJoke() {
    const jokes = [
        "🦄 Looking for bugs? They're not bugs, they're surprise features!",
        "🎮 My code is like a box of chocolates... You never know what you're gonna get!",
        "🌈 If debugging is the process of removing bugs, then programming must be the process of adding them!",
        "🚀 Why do programmers prefer dark mode? Because light attracts bugs!",
        "🐴 Why did the pony get kicked out of the coding bootcamp? Too many neigh-gative comments!",
        "✨ I'm not lazy, I'm just in power saving mode!",
        "🎨 CSS is like modern art - nobody really understands it, but everyone pretends they do!",
        "🔮 My code doesn't have bugs, it just develops random features!",
        "🌟 Keep digging in the console, you might find an Easter egg... or not!",
        "🎵 404: Joke not found... Just kidding!"
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
}

console.log(`%c
    ========== 404 ==========
    `, 'color: #8b5cf6; font-size: 12px; font-weight: bold;'
);

function spamConsole() {
    console.log(`%c${getRandomJoke()}
    ${new Date().toLocaleTimeString()}
    `, 'color: #8b5cf6; font-size: 12px; font-style: italic;');
}

setInterval(spamConsole, 3000);
