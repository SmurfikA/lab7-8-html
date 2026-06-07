/**
 * main.js - Основний файл ініціалізації JavaScript
 * Реалізує функціонал для всіх сторінок сайту
 */

// Ініціалізація при завантаженні DOM
document.addEventListener('DOMContentLoaded', init);

/**
 * Головна функція ініціалізації
 * Викликає усі необхідні функції для активації інтерактивності
 */
function init() {
    initActiveNav();
    initMenuToggle();
    initThemeToggle();
    initBackToTop();
    initAccordion();
    initFilters();
    initModal();
    initTabs();
    setCurrentYear();
}

/**
 * 1. Підсвічування активної сторінки в навігації
 * Порівнює поточну URL зі ссилками меню та додає клас .is-active
 */
function initActiveNav() {
    const navLinks = document.querySelectorAll('.navbar__link');
    if (!navLinks.length) return;

    const currentPath = window.location.pathname;
    const currentFile = currentPath.split('/').pop() || 'index.html';

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        const hrefFile = href.split('/').pop();

        // Перевіряємо, чи це поточна сторінка
        if (hrefFile === currentFile || 
            (currentFile === '' && hrefFile === 'index.html') ||
            (currentFile.startsWith('index') && hrefFile.startsWith('index'))) {
            link.classList.add('is-active');
        } else {
            link.classList.remove('is-active');
        }
    });
}

/**
 * 2. Кнопка відкриття/закриття мобільного меню
 * Керує видимістю меню та змінює стан кнопки
 */
function initMenuToggle() {
    const toggleBtn = document.querySelector('.navbar__toggle');
    const menu = document.querySelector('.navbar__menu');

    if (!toggleBtn || !menu) return;

    toggleBtn.addEventListener('click', () => {
        const isActive = toggleBtn.classList.contains('is-active');

        // Перемикаємо стан
        toggleBtn.classList.toggle('is-active');
        menu.classList.toggle('is-active');
        toggleBtn.setAttribute('aria-expanded', !isActive);
    });

    // Закриваємо меню при кліку на посилання
    document.querySelectorAll('.navbar__link').forEach(link => {
        link.addEventListener('click', () => {
            toggleBtn.classList.remove('is-active');
            menu.classList.remove('is-active');
            toggleBtn.setAttribute('aria-expanded', 'false');
        });
    });
}

/**
 * 3. Перемикач світлої/темної теми
 * Зберігає вибір користувача в localStorage
 */
function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;
    const themeKey = 'siteTheme';

    if (!themeToggle) return;

    // Завантажуємо збережену тему
    const savedTheme = localStorage.getItem(themeKey);
    if (savedTheme === 'dark') {
        body.classList.add('theme-dark');
        updateThemeIcon('dark');
    }

    // Перемикаємо тему при кліку
    themeToggle.addEventListener('click', () => {
        const isDark = body.classList.toggle('theme-dark');
        const theme = isDark ? 'dark' : 'light';
        
        // Зберігаємо вибір
        localStorage.setItem(themeKey, theme);
        updateThemeIcon(theme);
    });
}

/**
 * Оновлює іконку перемикача теми
 */
function updateThemeIcon(theme) {
    const icon = document.querySelector('.theme-toggle__icon');
    if (icon) {
        icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
}

/**
 * 4. Кнопка "Вгору" та її функціональність
 * Показує кнопку при прокручуванні вниз, прокручує вгору при кліку
 */
function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    if (!backToTopBtn) return;

    // Показуємо/приховуємо кнопку при скролі
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.removeAttribute('hidden');
        } else {
            backToTopBtn.setAttribute('hidden', '');
        }
    });

    // Прокручуємо вгору при кліку
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * 5. Акордеон - розгортання/згортання контенту
 * Одночасно може бути відкритою лише одна секція
 */
function initAccordion() {
    const accordionHeaders = document.querySelectorAll('.accordion__header');
    if (!accordionHeaders.length) return;

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const content = item.querySelector('.accordion__content');
            const isOpen = header.getAttribute('aria-expanded') === 'true';

            // Закриваємо усі інші елементи акордеону
            document.querySelectorAll('.accordion__item').forEach(otherItem => {
                if (otherItem !== item) {
                    const otherHeader = otherItem.querySelector('.accordion__header');
                    const otherContent = otherItem.querySelector('.accordion__content');
                    otherHeader.setAttribute('aria-expanded', 'false');
                    otherContent.setAttribute('hidden', '');
                }
            });

            // Перемикаємо поточний елемент
            if (isOpen) {
                header.setAttribute('aria-expanded', 'false');
                content.setAttribute('hidden', '');
            } else {
                header.setAttribute('aria-expanded', 'true');
                content.removeAttribute('hidden');
            }
        });
    });
}

/**
 * 6. Фільтрація портфоліо
 * Показує/приховує картки за вибраною категорією
 */
function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.portfolio-card');

    if (!filterBtns.length || !cards.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');

            // Оновлюємо активну кнопку
            filterBtns.forEach(b => b.classList.remove('filter-btn--active'));
            btn.classList.add('filter-btn--active');

            // Фільтруємо картки
            cards.forEach(card => {
                const category = card.getAttribute('data-category');
                const match = filter === 'all' || category === filter;
                
                if (match) {
                    card.removeAttribute('hidden');
                } else {
                    card.setAttribute('hidden', '');
                }
            });
        });
    });
}

/**
 * 7. Модальні вікна
 * Відкриває/закриває модальні вікна для портфоліо та форм
 */
function initModal() {
    // Відкриття модального вікна при кліку на кнопку
    document.querySelectorAll('[data-modal]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = btn.getAttribute('data-modal');
            const modal = document.getElementById(`modal-${modalId}`);
            if (modal) {
                modal.removeAttribute('hidden');
            }
        });
    });

    // Закриття модального вікна
    document.querySelectorAll('.modal').forEach(modal => {
        // По кліку на кнопку "Закрити"
        const closeBtn = modal.querySelector('.modal__close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.setAttribute('hidden', '');
            });
        }

        // По кліку на overlay
        const overlay = modal.querySelector('.modal__overlay');
        if (overlay) {
            overlay.addEventListener('click', () => {
                modal.setAttribute('hidden', '');
            });
        }

        // При натисканні ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !modal.hasAttribute('hidden')) {
                modal.setAttribute('hidden', '');
            }
        });
    });
}

/**
 * 8. Вкладки на сторінці "Про мене"
 * Перемикається між вкладками без перезавантаження сторінки
 */
function initTabs() {
    const tabBtns = document.querySelectorAll('.tabs__btn');
    if (!tabBtns.length) return;

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.getAttribute('data-tab');
            const tabPanel = document.getElementById(`tab-${tabName}`);

            if (!tabPanel) return;

            // Приховуємо усі панелі та видаляємо активний клас
            document.querySelectorAll('.tabs__panel').forEach(panel => {
                panel.setAttribute('hidden', '');
            });
            document.querySelectorAll('.tabs__btn').forEach(b => {
                b.classList.remove('tabs__btn--active');
            });

            // Показуємо вибрану панель
            tabPanel.removeAttribute('hidden');
            btn.classList.add('tabs__btn--active');
        });
    });
}

/**
 * 9. Динамічний рік у footer
 * Автоматично оновлює рік при завантаженні сторінки
 */
function setCurrentYear() {
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

/**
 * Допоміжна функція для перевірки елемента
 * Повертає елемент, якщо він існує, інакше null
 */
function getElement(selector) {
    return document.querySelector(selector) || null;
}

/**
 * Допоміжна функція для отримання елементів
 */
function getElements(selector) {
    return document.querySelectorAll(selector);
}
