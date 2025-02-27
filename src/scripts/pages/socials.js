document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab-button');
    const contents = document.querySelectorAll('.tab-content');
    document.body.style.overflow = 'hidden';
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            const tabName = tab.dataset.tab;
            const content = document.querySelector(`.tab-content[data-tab="${tabName}"]`);
            if (content) {
                content.classList.add('active');
            }
        });
    });
    document.addEventListener('wheel', (e) => {
        e.preventDefault();
    }, { passive: false });
}); 