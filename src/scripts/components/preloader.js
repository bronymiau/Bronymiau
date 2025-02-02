class PageTransition {
    constructor() {
        this.preloader = document.querySelector('.preloader');
        this.pageTransition = document.querySelector('.page-transition');
        this.isTransitioning = false;

        this.init();
    }

    init() {
        window.addEventListener('load', () => {
            this.pageTransition.classList.remove('active');
            setTimeout(() => {
                this.hidePreloader();
            }, 500);
        });

        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && this.shouldHandleLink(link)) {
                e.preventDefault();
                this.navigateTo(link.href);
            }
        });

        window.addEventListener('popstate', (e) => {
            e.preventDefault();
            this.handleBackNavigation();
        });
    }

    shouldHandleLink(link) {
        return link.href &&
               link.href.startsWith(window.location.origin) &&
               !link.hasAttribute('data-no-transition') &&
               !link.target;
    }

    async navigateTo(url) {
        if (this.isTransitioning) return;
        this.isTransitioning = true;

        this.pageTransition.classList.add('active');

        await new Promise(resolve => setTimeout(resolve, 500));
        
        window.location.href = url;

        window.addEventListener('pageshow', () => {
            this.pageTransition.classList.remove('active');
            this.isTransitioning = false;
        }, { once: true });
    }

    async handleBackNavigation() {
        if (this.isTransitioning) return;
        this.isTransitioning = true;

        this.pageTransition.classList.add('active');

        try {
            const previousUrl = document.referrer;
            
            await new Promise(resolve => setTimeout(resolve, 500));
            
            if (previousUrl && previousUrl.startsWith(window.location.origin)) {
                window.location.href = previousUrl;
            } else {
                window.location.href = '/';
            }

            window.addEventListener('pageshow', () => {
                this.pageTransition.classList.remove('active');
                this.isTransitioning = false;
            }, { once: true });

        } catch (error) {
            console.error('Navigation error:', error);
            this.pageTransition.classList.remove('active');
            this.isTransitioning = false;
            window.location.reload();
        }
    }

    hidePreloader() {
        this.preloader.classList.add('hidden');
        document.body.style.overflow = 'visible';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (!document.querySelector('.preloader')) {
        const preloader = document.createElement('div');
        preloader.className = 'preloader';
        preloader.innerHTML = '<div class="loader"></div>';
        document.body.appendChild(preloader);
    }

    if (!document.querySelector('.page-transition')) {
        const transition = document.createElement('div');
        transition.className = 'page-transition';
        document.body.appendChild(transition);
    }

    new PageTransition();
}); 