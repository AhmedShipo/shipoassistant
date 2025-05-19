// js/app/screens/SettingsScreen.js

import { loadData, saveData } from '../utils/dataHandlers.js';
import { shipoAssistantConfig } from '../../assistant_data/index.js';
import { renderMainScreen } from './MainScreen.js'; // لتمكين الرجوع للشاشة الرئيسية

/**
 * وظيفة لعرض شاشة الإعدادات.
 * @param {HTMLElement} container - العنصر الذي سيتم عرض الشاشة بداخله.
 */
export function renderSettingsScreen(container) {
    container.innerHTML = `
        <div class="top-bar">
            <button class="back-button" id="backToMainScreenBtn">←</button>
            <h1 class="screen-title">الإعدادات</h1>
            <div></div> </div>

        <div class="screen-container settings-screen">
            <div class="settings-section">
                <h2>الإعدادات العامة</h2>
                <div class="settings-option">
                    <span>اللغة</span>
                    <select id="languageSelect" class="button">
                        <option value="ar">العربية</option>
                        <option value="en">الإنجليزية</option>
                    </select>
                </div>
                <div class="settings-option">
                    <span>الوضع الداكن</span>
                    <label class="toggle-switch">
                        <input type="checkbox" id="darkModeToggle">
                        <span class="slider"></span>
                    </label>
                </div>
                <div class="settings-option">
                    <span>تمكين ردود الفعل العاطفية</span>
                    <label class="toggle-switch">
                        <input type="checkbox" id="emotionalResponseToggle">
                        <span class="slider"></span>
                    </label>
                </div>
            </div>

            <div class="settings-section">
                <h2>إعدادات المساعد</h2>
                <div class="settings-option">
                    <span>هوية المساعد</span>
                    <span id="assistantPersonaType">${shipoAssistantConfig.core.identity.assistantCoreIdentity.persona_type_ar || shipoAssistantConfig.core.identity.assistantCoreIdentity.persona_type}</span>
                </div>
                <div class="settings-option">
                    <span>المنهجية الثقافية</span>
                    <span id="culturalFramework">${shipoAssistantConfig.core.identity.assistantCoreIdentity.cultural_framework_ar || shipoAssistantConfig.core.identity.assistantCoreIdentity.cultural_framework}</span>
                </div>
                <div class="settings-option">
                    <span>السلوك الافتراضي</span>
                    <select id="defaultBehaviorSelect" class="button">
                        ${shipoAssistantConfig.interaction.communicationProtocol.default_interaction_modes.map(mode =>
                            `<option value="${mode.mode}">${mode.description_ar}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="settings-option">
                    <span>تمكين الوصول للإنترنت</span>
                    <label class="toggle-switch">
                        <input type="checkbox" id="internetAccessToggle">
                        <span class="slider"></span>
                    </label>
                </div>
            </div>

            <div class="settings-section">
                <h2>البيانات والخصوصية</h2>
                <button class="button" id="clearChatHistoryBtn">مسح سجل المحادثات</button>
                <button class="button" id="exportDataBtn">تصدير البيانات</button>
            </div>
        </div>
    `;

    // استعادة الإعدادات المحفوظة
    const savedLanguage = loadData('settings_language', 'ar');
    document.getElementById('languageSelect').value = savedLanguage;

    const savedDarkMode = loadData('settings_darkMode', false);
    document.getElementById('darkModeToggle').checked = savedDarkMode;
    if (savedDarkMode) {
        document.body.classList.add('dark-mode'); // إضافة كلاس للتحكم في الوضع الداكن على الجسم
    } else {
        document.body.classList.remove('dark-mode');
    }

    const savedEmotionalResponse = loadData('settings_emotionalResponse', true);
    document.getElementById('emotionalResponseToggle').checked = savedEmotionalResponse;

    const savedDefaultBehavior = loadData('settings_defaultBehavior', 'EmpatheticAndSupportive'); // قيمة افتراضية
    document.getElementById('defaultBehaviorSelect').value = savedDefaultBehavior;

    const savedInternetAccess = loadData('settings_internetAccess', true);
    document.getElementById('internetAccessToggle').checked = savedInternetAccess;


    // إضافة مستمعي الأحداث
    document.getElementById('backToMainScreenBtn').addEventListener('click', () => {
        renderMainScreen(container); // العودة إلى الشاشة الرئيسية
    });

    document.getElementById('languageSelect').addEventListener('change', (e) => {
        saveData('settings_language', e.target.value);
        console.log(`Language set to: ${e.target.value}`);
        // هنا يمكن إعادة تحميل الواجهة أو تحديث النصوص ديناميكياً
    });

    document.getElementById('darkModeToggle').addEventListener('change', (e) => {
        const isDarkMode = e.target.checked;
        saveData('settings_darkMode', isDarkMode);
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        console.log(`Dark Mode: ${isDarkMode}`);
    });

    document.getElementById('emotionalResponseToggle').addEventListener('change', (e) => {
        saveData('settings_emotionalResponse', e.target.checked);
        console.log(`Emotional Response: ${e.target.checked}`);
    });

    document.getElementById('defaultBehaviorSelect').addEventListener('change', (e) => {
        saveData('settings_defaultBehavior', e.target.value);
        console.log(`Default Behavior: ${e.target.value}`);
    });

    document.getElementById('internetAccessToggle').addEventListener('change', (e) => {
        saveData('settings_internetAccess', e.target.checked);
        console.log(`Internet Access: ${e.target.checked}`);
    });

    document.getElementById('clearChatHistoryBtn').addEventListener('click', () => {
        if (confirm('هل أنت متأكد من مسح سجل المحادثات؟ لا يمكن التراجع عن هذا الإجراء.')) {
            saveData('shipo_conversations', []); // مسح السجل
            console.log("Chat history cleared.");
            alert("تم مسح سجل المحادثات بنجاح.");
        }
    });

    document.getElementById('exportDataBtn').addEventListener('click', () => {
        const allData = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            try {
                allData[key] = JSON.parse(localStorage.getItem(key));
            } catch (e) {
                allData[key] = localStorage.getItem(key); // إذا لم يكن JSON
            }
        }
        const dataStr = JSON.stringify(allData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'shipo_assistant_data_export.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        console.log("Data exported.");
        alert("تم تصدير البيانات بنجاح كملف JSON.");
    });

    console.log("Settings Screen rendered.");
}