// js/app/utils/dataHandlers.js

/**
 * لحفظ البيانات في التخزين المحلي (localStorage).
 * @param {string} key - المفتاح الذي سيتم حفظ البيانات به.
 * @param {any} value - القيمة المراد حفظها (سيتم تحويلها إلى JSON).
 */
export function saveData(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        console.log(`Data saved for key: ${key}`);
    } catch (e) {
        console.error(`Error saving data for key ${key}:`, e);
    }
}

/**
 * لتحميل البيانات من التخزين المحلي (localStorage).
 * @param {string} key - المفتاح الذي سيتم تحميل البيانات منه.
 * @param {any} defaultValue - قيمة افتراضية لإرجاعها إذا لم يتم العثور على البيانات.
 * @returns {any} - البيانات المحملة (تم تحليلها من JSON)، أو القيمة الافتراضية.
 */
export function loadData(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
        console.error(`Error loading data for key ${key}:`, e);
        return defaultValue;
    }
}

/**
 * لحذف البيانات من التخزين المحلي (localStorage).
 * @param {string} key - المفتاح الذي سيتم حذف البيانات منه.
 */
export function removeData(key) {
    try {
        localStorage.removeItem(key);
        console.log(`Data removed for key: ${key}`);
    } catch (e) {
        console.error(`Error removing data for key ${key}:`, e);
    }
}

/**
 * لحفظ تاريخ المحادثات.
 * @param {Array} conversations - مصفوفة الكائنات التي تمثل تاريخ المحادثات.
 */
export function saveConversations(conversations) {
    saveData('shipo_conversations', conversations);
}

/**
 * لتحميل تاريخ المحادثات.
 * @returns {Array} - مصفوفة الكائنات التي تمثل تاريخ المحادثات، أو مصفوفة فارغة إذا لم توجد.
 */
export function loadConversations() {
    return loadData('shipo_conversations', []);
}

/**
 * لإضافة رسالة جديدة إلى تاريخ المحادثات.
 * @param {object} message - كائن الرسالة (مثال: { text: "Hello", type: "user", timestamp: Date.now() }).
 */
export function addMessageToHistory(message) {
    const conversations = loadConversations();
    conversations.push(message);
    saveConversations(conversations);
    console.log("Message added to history.");
}