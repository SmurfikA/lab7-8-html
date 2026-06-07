/**
 * contact.js - Обробка форми контакту
 * Реалізує валідацію, збереження чернетки, лічильник символів
 */

document.addEventListener('DOMContentLoaded', initContactForm);

// Ключі для localStorage
const DRAFT_KEY = 'contactDraft';

/**
 * Ініціалізація форми контакту
 * Викликається тільки якщо форма існує на сторінці
 */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    // Завантажуємо збережену чернетку
    loadDraft();

    // Обробляємо введення для збереження чернетки
    form.querySelectorAll('input[type="text"], input[type="email"], textarea').forEach(field => {
        field.addEventListener('input', saveDraft);
    });

    // Обробляємо відправку форми
    form.addEventListener('submit', handleFormSubmit);

    // Ініціалізуємо лічильник символів
    initCharCounter();

    // Обробляємо кнопку очищення чернетки
    initClearDraft();

    // Обробляємо успішну відправку
    initSuccessModal();
}

/**
 * 9. Валідація форми та лічильник символів
 */

/**
 * Ініціалізує лічильник символів для textarea
 */
function initCharCounter() {
    const textarea = document.getElementById('message');
    const charCount = document.getElementById('char-count');

    if (!textarea || !charCount) return;

    textarea.addEventListener('input', () => {
        charCount.textContent = textarea.value.length;
    });

    // Встановлюємо початкове значення
    charCount.textContent = textarea.value.length;
}

/**
 * Валідує форму перед відправленням
 * @returns {Object} - об'єкт з результатом валідації та повідомленнями про помилки
 */
function validateForm(formData) {
    const errors = {};

    // Валідація ім'я (мінімум 2 символи)
    const name = formData.name.trim();
    if (!name) {
        errors.name = 'Ім\'я є обов\'язковим';
    } else if (name.length < 2) {
        errors.name = 'Ім\'я має бути не менше 2 символів';
    }

    // Валідація email
    const email = formData.email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        errors.email = 'Email є обов\'язковим';
    } else if (!emailRegex.test(email)) {
        errors.email = 'Будь ласка, введіть коректний email адресу';
    }

    // Валідація повідомлення (не пусте)
    const message = formData.message.trim();
    if (!message) {
        errors.message = 'Повідомлення є обов\'язковим';
    } else if (message.length < 5) {
        errors.message = 'Повідомлення має бути не менше 5 символів';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}

/**
 * Показує помилки валідації під полями форми
 */
function showFormErrors(errors) {
    // Спочатку очищуємо усі помилки
    document.querySelectorAll('.form-error').forEach(el => {
        el.textContent = '';
    });
    document.querySelectorAll('.is-invalid').forEach(el => {
        el.classList.remove('is-invalid');
    });

    // Показуємо нові помилки
    Object.keys(errors).forEach(fieldName => {
        const errorElement = document.getElementById(`error-${fieldName}`);
        const inputElement = document.getElementById(fieldName);

        if (errorElement) {
            errorElement.textContent = errors[fieldName];
        }
        if (inputElement) {
            inputElement.classList.add('is-invalid');
        }
    });
}

/**
 * Очищує помилки форми
 */
function clearFormErrors() {
    document.querySelectorAll('.form-error').forEach(el => {
        el.textContent = '';
    });
    document.querySelectorAll('.is-invalid').forEach(el => {
        el.classList.remove('is-invalid');
    });
}

/**
 * 10. Збереження та завантаження чернетки
 */

/**
 * Збирає дані з форми та зберігає в localStorage
 */
function saveDraft() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
}

/**
 * Завантажує чернетку з localStorage і вставляє у форму
 */
function loadDraft() {
    const draftData = localStorage.getItem(DRAFT_KEY);
    if (!draftData) return;

    try {
        const data = JSON.parse(draftData);
        const form = document.getElementById('contact-form');

        if (form) {
            Object.keys(data).forEach(fieldName => {
                const field = form.elements[fieldName];
                if (field) {
                    field.value = data[fieldName];
                }
            });

            // Оновлюємо лічильник символів після завантаження
            const charCount = document.getElementById('char-count');
            const textarea = document.getElementById('message');
            if (charCount && textarea) {
                charCount.textContent = textarea.value.length;
            }
        }
    } catch (error) {
        console.error('Помилка при завантаженні чернетки:', error);
    }
}

/**
 * Очищує чернетку з localStorage
 */
function clearDraftData() {
    localStorage.removeItem(DRAFT_KEY);
    
    // Очищуємо форму
    const form = document.getElementById('contact-form');
    if (form) {
        form.reset();
        
        // Скидаємо лічильник символів
        const charCount = document.getElementById('char-count');
        if (charCount) {
            charCount.textContent = '0';
        }
    }

    clearFormErrors();
}

/**
 * Ініціалізує кнопку очищення чернетки з модальним підтвердженням
 */
function initClearDraft() {
    const clearBtn = document.getElementById('clear-draft-btn');
    const confirmModal = document.getElementById('modal-confirm-clear');
    const confirmClearBtn = document.getElementById('confirm-clear');
    const cancelClearBtn = document.getElementById('cancel-clear');
    const modalOverlay = confirmModal?.querySelector('.modal__overlay');
    const closeBtn = confirmModal?.querySelector('.modal__close');

    if (!clearBtn) return;

    // Відкриваємо модальне вікно підтвердження
    clearBtn.addEventListener('click', () => {
        if (confirmModal) {
            confirmModal.removeAttribute('hidden');
        }
    });

    // Підтверджуємо очищення
    if (confirmClearBtn) {
        confirmClearBtn.addEventListener('click', () => {
            clearDraftData();
            if (confirmModal) {
                confirmModal.setAttribute('hidden', '');
            }
        });
    }

    // Скасовуємо очищення
    if (cancelClearBtn) {
        cancelClearBtn.addEventListener('click', () => {
            if (confirmModal) {
                confirmModal.setAttribute('hidden', '');
            }
        });
    }

    // Закриваємо по кліку на overlay
    if (modalOverlay) {
        modalOverlay.addEventListener('click', () => {
            if (confirmModal) {
                confirmModal.setAttribute('hidden', '');
            }
        });
    }

    // Закриваємо по кніпці X
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            if (confirmModal) {
                confirmModal.setAttribute('hidden', '');
            }
        });
    }
}

/**
 * Обробка відправки форми
 * Валідує дані, показує результат, очищує чернетку
 */
function handleFormSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Валідуємо форму
    const validation = validateForm(data);

    if (!validation.isValid) {
        showFormErrors(validation.errors);
        return;
    }

    // Очищуємо помилки
    clearFormErrors();

    // Показуємо успішне повідомлення з даними
    showSuccessModal(data);

    // Очищуємо чернетку
    clearDraftData();
}

/**
 * Ініціалізує модальне вікно успішної відправки
 */
function initSuccessModal() {
    const successCloseBtn = document.getElementById('success-close');
    const successModal = document.getElementById('modal-success');
    const modalOverlay = successModal?.querySelector('.modal__overlay');
    const closeBtn = successModal?.querySelector('.modal__close');

    if (!successCloseBtn) return;

    successCloseBtn.addEventListener('click', () => {
        if (successModal) {
            successModal.setAttribute('hidden', '');
        }
    });

    if (modalOverlay) {
        modalOverlay.addEventListener('click', () => {
            if (successModal) {
                successModal.setAttribute('hidden', '');
            }
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            if (successModal) {
                successModal.setAttribute('hidden', '');
            }
        });
    }
}

/**
 * Показує модальне вікно з даними успішної відправки
 */
function showSuccessModal(data) {
    const successModal = document.getElementById('modal-success');
    const successData = document.getElementById('success-data');

    if (!successModal || !successData) return;

    // Формуємо HTML з даними
    let html = '<p><strong>Ваші дані:</strong></p>';
    html += `<p><strong>Ім'я:</strong> ${escapeHtml(data.name)}</p>`;
    html += `<p><strong>Email:</strong> ${escapeHtml(data.email)}</p>`;
    
    if (data.subject) {
        html += `<p><strong>Тема:</strong> ${escapeHtml(data.subject)}</p>`;
    }
    
    html += `<p><strong>Повідомлення:</strong></p>`;
    html += `<p style="white-space: pre-wrap;">${escapeHtml(data.message)}</p>`;

    successData.innerHTML = html;
    successModal.removeAttribute('hidden');
}

/**
 * Екранує HTML символи для безпеки
 */
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}
