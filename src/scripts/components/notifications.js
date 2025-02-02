window.Notifications = class Notifications {
    static notifications = [];
    static gap = 10; 
    static show(messageKey, type = 'info', lang = 'en') {
        const message = this.getTranslatedMessage(messageKey, lang);
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${this.getIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <div class="notification-progress"></div>
        `;
        document.body.appendChild(notification);
        this.notifications.push(notification);
        this.updatePositions();
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
                this.notifications = this.notifications.filter(n => n !== notification);
                this.updatePositions();
            }, 300);
        }, 3000);
    }
    static updatePositions() {
        let currentTop = 20;
        this.notifications.forEach(notification => {
            notification.style.top = `${currentTop}px`;
            currentTop += notification.offsetHeight + this.gap;
        });
    }
    static getTranslatedMessage(messageKey, lang) {
        const messages = {
            en: {
                success: "Success!",
                error: "Error occurred!",
                info: "Information",
                warning: "Warning!",
                languageChanged: "Language changed to English. Reload the page"
            },
            ru: {
                success: "Успешно!",
                error: "Произошла ошибка!",
                info: "Информация",
                warning: "Предупреждение!",
                languageChanged: "Язык изменён на русский. Перезагрузите страницу"
            }
        };
        return messages[lang]?.[messageKey] || messageKey;
    }
    static getIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-times-circle',
            info: 'fa-info-circle',
            warning: 'fa-exclamation-circle'
        };
        return icons[type] || icons.info;
    }
} 