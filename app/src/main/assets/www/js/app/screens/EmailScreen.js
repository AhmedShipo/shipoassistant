// js/app/screens/EmailScreen.js

import { renderMainScreen } from './MainScreen.js'; // للرجوع للشاشة الرئيسية

/**
 * وظيفة لعرض شاشة البريد الإلكتروني.
 * @param {HTMLElement} container - العنصر الذي سيتم عرض الشاشة بداخله.
 */
export function renderEmailScreen(container) {
    container.innerHTML = `
        <div class="top-bar">
            <button class="back-button" id="backToMainScreenBtn">←</button>
            <h1 class="screen-title">البريد الإلكتروني</h1>
            <div></div>
        </div>

        <div class="screen-container email-screen">
            <div class="settings-section">
                <h2>إرسال وقراءة رسائل البريد الإلكتروني</h2>
                <p>يمكنك هنا إرسال رسائل جديدة أو طلب قراءة رسائل واردة.</p>
                <button class="button" id="composeEmailBtn">إنشاء رسالة جديدة</button>
                <button class="button" id="readInboxBtn">قراءة البريد الوارد</button>
                <div id="emailContentArea" style="margin-top: 20px;">
                    </div>
            </div>
        </div>
    `;

    document.getElementById('backToMainScreenBtn').addEventListener('click', () => {
        renderMainScreen(container);
    });

    document.getElementById('composeEmailBtn').addEventListener('click', () => {
        const recipient = prompt("أدخل عنوان البريد الإلكتروني للمستلم:");
        const subject = prompt("أدخل موضوع الرسالة:");
        const body = prompt("أدخل نص الرسالة:");
        if (recipient && subject && body) {
            alert(`تم طلب إرسال رسالة إلى ${recipient}. (يتطلب تكامل API)`);
            console.log(`Request to send email to: ${recipient}, Subject: ${subject}`);
            // هنا يمكنك إرسال الطلب للمساعد لإرسال بريد إلكتروني
            // handleUserInput(`أرسل بريداً إلكترونياً إلى "${recipient}" بموضوع "${subject}" ومحتوى "${body}".`);
        }
    });

    document.getElementById('readInboxBtn').addEventListener('click', () => {
        const emailContentArea = document.getElementById('emailContentArea');
        emailContentArea.innerHTML = `<p>جاري تحميل البريد الوارد... (تحتاج إلى تكامل مع Gmail API أو ما شابه)</p>`;
        // هنا ستقوم باستدعاء قدرات المساعد الخارجية للوصول إلى البريد
        // import { externalCapabilities } from '../../assistant_data/connectivity/externalCapabilities.js';
        // if (externalCapabilities.email_integration) {
        //     console.log("Fetching inbox via assistant...");
        // }
    });

    console.log("Email Screen rendered.");
}