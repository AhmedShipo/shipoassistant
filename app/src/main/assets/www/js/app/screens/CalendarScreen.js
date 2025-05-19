// js/app/screens/CalendarScreen.js

import { renderMainScreen } from './MainScreen.js'; // للرجوع للشاشة الرئيسية

/**
 * وظيفة لعرض شاشة التقويم.
 * @param {HTMLElement} container - العنصر الذي سيتم عرض الشاشة بداخله.
 */
export function renderCalendarScreen(container) {
    container.innerHTML = `
        <div class="top-bar">
            <button class="back-button" id="backToMainScreenBtn">←</button>
            <h1 class="screen-title">التقويم والمهام</h1>
            <div></div>
        </div>

        <div class="screen-container calendar-screen">
            <div class="settings-section">
                <h2>إدارة المواعيد والمهام</h2>
                <p>هنا يمكنك عرض المواعيد وإنشاء مهام جديدة.</p>
                <button class="button" id="viewEventsBtn">عرض المواعيد الحالية</button>
                <button class="button" id="addEventBtn">إضافة موعد جديد</button>
                <div id="calendarEventsList" style="margin-top: 20px;">
                    </div>
            </div>
        </div>
    `;

    document.getElementById('backToMainScreenBtn').addEventListener('click', () => {
        renderMainScreen(container);
    });

    document.getElementById('viewEventsBtn').addEventListener('click', () => {
        const eventsList = document.getElementById('calendarEventsList');
        eventsList.innerHTML = `<p>جاري تحميل المواعيد... (تحتاج إلى تكامل مع Google Calendar API أو ما شابه)</p>`;
        // هنا ستقوم باستدعاء قدرات المساعد الخارجية للوصول إلى التقويم
        // import { externalCapabilities } from '../../assistant_data/connectivity/externalCapabilities.js';
        // if (externalCapabilities.calendar_integration) {
        //     console.log("Fetching calendar events via assistant...");
        // }
    });

    document.getElementById('addEventBtn').addEventListener('click', () => {
        const eventTitle = prompt("أدخل عنوان الموعد:");
        const eventDate = prompt("أدخل تاريخ الموعد (مثال: YYYY-MM-DD):");
        if (eventTitle && eventDate) {
            alert(`تم طلب إضافة موعد: ${eventTitle} في ${eventDate}. (يتطلب تكامل API)`);
            console.log(`Request to add event: ${eventTitle} on ${eventDate}`);
            // هنا يمكنك إرسال الطلب للمساعد لإضافة موعد
            // handleUserInput(`أضف موعداً بعنوان "${eventTitle}" بتاريخ "${eventDate}" في التقويم.`);
        }
    });

    console.log("Calendar Screen rendered.");
}