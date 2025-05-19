// js/app/screens/FileReaderScreen.js

import { renderMainScreen } from './MainScreen.js'; // للرجوع للشاشة الرئيسية

/**
 * وظيفة لعرض شاشة قارئ الملفات.
 * @param {HTMLElement} container - العنصر الذي سيتم عرض الشاشة بداخله.
 */
export function renderFileReaderScreen(container) {
    container.innerHTML = `
        <div class="top-bar">
            <button class="back-button" id="backToMainScreenBtn">←</button>
            <h1 class="screen-title">قارئ الملفات</h1>
            <div></div>
        </div>

        <div class="screen-container file-reader-screen">
            <div class="settings-section">
                <h2>تحميل وعرض الملفات</h2>
                <input type="file" id="fileInput" accept=".txt,.pdf,.doc,.docx" class="button" style="display:block; margin-bottom: 15px;"/>
                <div id="fileContent" style="background-color: var(--medium-dark-background); border: 1px solid var(--primary-golden); padding: 15px; border-radius: var(--border-radius-main); min-height: 200px; overflow-y: auto; color: var(--primary-white); text-align: right;">
                    <p>المحتوى سيظهر هنا...</p>
                </div>
                <button class="button" id="analyzeFileContentBtn" style="margin-top: 15px;">تحليل محتوى الملف</button>
            </div>
        </div>
    `;

    document.getElementById('backToMainScreenBtn').addEventListener('click', () => {
        renderMainScreen(container);
    });

    document.getElementById('fileInput').addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target.result;
                document.getElementById('fileContent').innerText = content.substring(0, 2000) + (content.length > 2000 ? '...' : ''); // عرض جزء من المحتوى
                console.log(`File loaded: ${file.name}`);
            };
            reader.onerror = (e) => {
                document.getElementById('fileContent').innerText = "خطأ في قراءة الملف.";
                console.error("File reading error:", e);
            };
            reader.readAsText(file); // قراءة الملف كنص
        }
    });

    document.getElementById('analyzeFileContentBtn').addEventListener('click', () => {
        const fileContent = document.getElementById('fileContent').innerText;
        if (fileContent && fileContent !== "المحتوى سيظهر هنا...") {
            console.log("Analyzing file content:", fileContent);
            // هنا يمكنك إرسال المحتوى إلى دالة معالجة المساعد
            // import { handleUserInput } from './MainScreen.js'; // يجب استيرادها بشكل صحيح
            // handleUserInput(`حلل لي هذا النص من الملف: ${fileContent}`);
            alert("تم إرسال محتوى الملف للتحليل. راجع شاشة المحادثة.");
            renderMainScreen(container); // العودة للشاشة الرئيسية بعد الإرسال
        } else {
            alert("الرجاء تحميل ملف أولاً لتحليله.");
        }
    });

    console.log("File Reader Screen rendered.");
}