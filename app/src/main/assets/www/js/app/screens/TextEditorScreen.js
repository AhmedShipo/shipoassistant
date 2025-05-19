// js/app/screens/TextEditorScreen.js

import { renderMainScreen } from './MainScreen.js'; // للرجوع للشاشة الرئيسية

/**
 * وظيفة لعرض شاشة محرر النصوص.
 * @param {HTMLElement} container - العنصر الذي سيتم عرض الشاشة بداخله.
 */
export function renderTextEditorScreen(container) {
    container.innerHTML = `
        <div class="top-bar">
            <button class="back-button" id="backToMainScreenBtn">←</button>
            <h1 class="screen-title">محرر النصوص</h1>
            <div></div>
        </div>

        <div class="screen-container text-editor-screen">
            <div class="settings-section">
                <h2>اكتب أو حرر نصك</h2>
                <textarea id="textEditorArea" placeholder="ابدأ بالكتابة هنا..." style="width: 100%; height: 250px; background-color: var(--medium-dark-background); border: 1px solid var(--primary-golden); border-radius: var(--border-radius-main); padding: 15px; color: var(--primary-white); font-size: 16px; direction: rtl; text-align: right;"></textarea>
                <button class="button" id="processTextBtn" style="margin-top: 15px; margin-left: 10px;">معالجة النص بالمساعد</button>
                <button class="button" id="clearTextBtn" style="margin-top: 15px;">مسح النص</button>
            </div>
        </div>
    `;

    document.getElementById('backToMainScreenBtn').addEventListener('click', () => {
        renderMainScreen(container);
    });

    document.getElementById('processTextBtn').addEventListener('click', () => {
        const textContent = document.getElementById('textEditorArea').value.trim();
        if (textContent) {
            console.log("Processing text:", textContent);
            // هنا يمكنك إرسال المحتوى إلى دالة معالجة المساعد
            // import { handleUserInput } from './MainScreen.js';
            // handleUserInput(`اعمل على النص التالي: ${textContent}`);
            alert("تم إرسال النص للمساعد للمعالجة. راجع شاشة المحادثة.");
            renderMainScreen(container);
        } else {
            alert("الرجاء إدخال نص للمعالجة.");
        }
    });

    document.getElementById('clearTextBtn').addEventListener('click', () => {
        document.getElementById('textEditorArea').value = '';
        console.log("Text editor cleared.");
    });

    console.log("Text Editor Screen rendered.");
}