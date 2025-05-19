// js/app/components/LoadingIndicator.js

/**
 * ينشئ عنصر DOM يمثل مؤشر تحميل (نقاط متحركة).
 * @returns {HTMLElement} - عنصر الـ div لمؤشر التحميل.
 */
export function createLoadingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'loading-indicator'; // قم بتنسيق هذا الكلاس في style.css
    indicator.innerHTML = `
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
    `;
    return indicator;
}

/**
 * يزيل مؤشر التحميل من الـ DOM.
 * @param {HTMLElement} indicatorElement - عنصر مؤشر التحميل المراد إزالته.
 */
export function removeLoadingIndicator(indicatorElement) {
    if (indicatorElement && indicatorElement.parentNode) {
        indicatorElement.parentNode.removeChild(indicatorElement);
        console.log("Loading indicator removed.");
    }
}