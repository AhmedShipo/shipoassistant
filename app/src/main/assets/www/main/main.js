// js/main.js

import { shipoAssistantConfig } from './assistant_data/index.js';
import { renderMainScreen } from './app/screens/MainScreen.js';
import { renderSettingsScreen } from './app/screens/SettingsScreen.js'; // جديد
import { renderTextEditorScreen } from './app/screens/TextEditorScreen.js'; // جديد
import { renderFileReaderScreen } from './app/screens/FileReaderScreen.js'; // جديد
import { renderCalendarScreen } from './app/screens/CalendarScreen.js'; // جديد
import { renderEmailScreen } from './app/screens/EmailScreen.js'; // جديد
import { renderWeatherScreen } from './app/screens/WeatherScreen.js'; // جديد
import { renderMapsScreen } from './app/screens/MapsScreen.js'; // جديد
import { setupUIHelpers } from './app/utils/uiHelpers.js';
import { loadConversations } from './app/utils/dataHandlers.js'; // جديد

// هذه الوظيفة ستكون نقطة الدخول لتطبيقك
function initializeApp() {
    console.log("Initializing Shipo Assistant App...");

    const appContainer = document.getElementById('app-container');
    if (!appContainer) {
        console.error("App container not found!");
        return;
    }

    // قم بتهيئة مساعدات الواجهة
    setupUIHelpers();

    // قم بتحميل شاشة المحادثة الرئيسية أولاً
    renderMainScreen(appContainer);

    // إضافة مستمعي الأحداث لأزرار شريط التنقل السفلي (هذه نقلناها من MainScreen.js)
    // يجب أن تكون هذه المستمعات في مكان أعلى يسمح بتبديل الشاشات
    document.querySelectorAll('.bottom-nav-bar .nav-button').forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault(); // منع سلوك الرابط الافتراضي
            document.querySelectorAll('.bottom-nav-bar .nav-button').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const navTarget = this.dataset.nav;
            console.log(`Navigating to: ${navTarget}`);

            // استدعاء دالة عرض الشاشة المناسبة بناءً على الهدف
            switch (navTarget) {
                case 'conversations':
                    renderMainScreen(appContainer);
                    break;
                case 'write':
                    renderTextEditorScreen(appContainer);
                    break;
                case 'reports':
                    // هذه الشاشة قد تكون لعرض تقارير مجمعة أو واجهة للتقارير
                    // حالياً يمكن أن نعيد استخدام شاشة المحادثة أو تطلب شاشة مخصصة
                    alert("شاشة التقارير قيد التطوير. سيتم توجيهك للمحادثات حالياً.");
                    renderMainScreen(appContainer);
                    break;
                case 'references':
                     // هذه الشاشة قد تكون لعرض مصادر المعرفة للمساعد
                     alert("شاشة المراجع قيد التطوير. سيتم توجيهك للمحادثات حالياً.");
                     renderMainScreen(appContainer);
                     break;
                case 'files':
                    renderFileReaderScreen(appContainer);
                    break;
                case 'calendar': // تأكد من وجود زر في index.html لهذا nav
                    renderCalendarScreen(appContainer);
                    break;
                case 'email': // تأكد من وجود زر في index.html لهذا nav
                    renderEmailScreen(appContainer);
                    break;
                case 'weather': // تأكد من وجود زر في index.html لهذا nav
                    renderWeatherScreen(appContainer);
                    break;
                case 'maps': // تأكد من وجود زر في index.html لهذا nav
                    renderMapsScreen(appContainer);
                    break;
                // يمكنك إضافة حالات أخرى هنا
                default:
                    console.warn(`Unknown navigation target: ${navTarget}`);
                    renderMainScreen(appContainer); // العودة للشاشة الرئيسية كإجراء افتراضي
            }
        });
    });

    // إضافة مستمع لزر إعدادات الهامبرغر الذي يفتح شاشة الإعدادات
    // هذا الزر كان في MainScreen.js، لكن بما أن SettingsScreen ستكون شاشة مستقلة، يجب أن يكون المستمع في main.js
    document.addEventListener('click', (event) => {
        if (event.target && event.target.id === 'openSettingsBtn') {
            console.log("Opening Settings Screen from main.js...");
            renderSettingsScreen(appContainer);
        }
    });

    // يمكنك هنا الوصول إلى بيانات المساعد
    console.log("Shipo Assistant Identity:", shipoAssistantConfig.core.identity.assistantCoreIdentity);
    console.log("Maqasid Al-Sharia:", shipoAssistantConfig.ethics.maqasidAlShariaFramework.maqasid_list[0].title_ar);

    // مثال على تحميل تاريخ المحادثات (إذا كان موجوداً)
    const storedConversations = loadConversations();
    if (storedConversations.length > 0) {
        console.log("Loaded previous conversations:", storedConversations);
        // يمكنك هنا إعادة عرض هذه المحادثات في الواجهة الرئيسية
    }
}

// تشغيل التطبيق عندما يتم تحميل DOM بالكامل
document.addEventListener('DOMContentLoaded', initializeApp);

// إذا كنت تستخدم Cordova، قد تحتاج إلى هذا:
// document.addEventListener('deviceready', initializeApp, false);