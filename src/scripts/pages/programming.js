document.addEventListener('DOMContentLoaded', () => {    const cards = document.querySelectorAll('.project-card');    cards.forEach(card => {        card.addEventListener('mousemove', (e) => {            const rect = card.getBoundingClientRect();            const x = e.clientX - rect.left;            const y = e.clientY - rect.top;            card.style.setProperty('--mouse-x', `${x}px`);            card.style.setProperty('--mouse-y', `${y}px`);        });    });});function requestAccess(event) {    event.preventDefault();    alert('Запрос на доступ отправлен. Мы свяжемся с вами после проверки.');}document.addEventListener('DOMContentLoaded', () => {    const images = document.querySelectorAll('img[loading="lazy"]');    if ('loading' in HTMLImageElement.prototype) {        images.forEach(img => {            img.src = img.dataset.src;        });    } else {        const script = document.createElement('script');        script.src = '/scripts/lazysizes.min.js';        document.body.appendChild(script);    }    const cards = document.querySelectorAll('.project-card');    cards.forEach(card => {        const observer = new IntersectionObserver(            (entries) => {                entries.forEach(entry => {                    if (entry.isIntersecting) {                        card.style.transform = 'translateY(0)';                        card.style.opacity = '1';                    }                });            },            { threshold: 0.1 }        );        observer.observe(card);    });}); 