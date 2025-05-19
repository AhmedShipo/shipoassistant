// js/app/components/ChatBubble.js

/**
 * ينشئ عنصر DOM لفقاعة محادثة (bubble) لعرض الرسائل.
 * يحتوي على محتوى الرسالة وأزرار الإجراءات (نسخ، تحرير).
 * @param {string} message - نص الرسالة لعرضها داخل الفقاعة.
 * @param {'request'|'response'} type - نوع الفقاعة: 'request' لرسائل المستخدم، 'response' لردود المساعد.
 * @returns {HTMLElement} - عنصر الـ div الذي يمثل فقاعة المحادثة.
 */
export function createChatBubble(message, type) {
    // إنشاء العنصر الأساسي لفقاعة المحادثة
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${type}`; // إضافة كلاس 'request' أو 'response' للتنسيق

    // إضافة محتوى الرسالة
    const contentDiv = document.createElement('div');
    contentDiv.className = 'chat-bubble-content';
    contentDiv.innerHTML = message; // يمكن استخدام innerText إذا كنت لا تتوقع HTML في الرسائل
    bubble.appendChild(contentDiv);

    // إنشاء حاوية لأزرار الإجراءات (نسخ، تحرير)
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'chat-bubble-actions';

    // زر النسخ
    const copyBtn = document.createElement('button');
    copyBtn.className = 'icon-button copy-btn';
    copyBtn.innerHTML = '📋'; // أيقونة "نسخ"
    copyBtn.title = 'نسخ النص';
    copyBtn.addEventListener('click', () => {
        // استخدام Clipboard API لنسخ النص
        navigator.clipboard.writeText(message)
            .then(() => {
                console.log('Text copied to clipboard successfully!');
                // يمكن إضافة إشارة مرئية للمستخدم (مثل رسالة "تم النسخ!")
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
                // يمكن عرض رسالة خطأ للمستخدم
            });
    });
    actionsDiv.appendChild(copyBtn);

    // زر التحرير (يظهر فقط لرسائل المستخدم - 'request')
    if (type === 'request') {
        const editBtn = document.createElement('button');
        editBtn.className = 'icon-button edit-btn';
        editBtn.innerHTML = '✏️'; // أيقونة "قلم رصاص"
        editBtn.title = 'تحرير الرسالة';
        editBtn.addEventListener('click', () => {
            console.log('Edit message:', message);
            // هنا يمكنك إضافة منطق لتحرير الرسالة.
            // على سبيل المثال، يمكن ملء حقل الإدخال بالرسالة الحالية
            const chatInput = document.getElementById('chatInput'); // يجب التأكد من وجود هذا الـ ID
            if (chatInput) {
                chatInput.value = message;
                chatInput.focus(); // نقل التركيز إلى حقل الإدخال
            }
            // يمكن أيضًا إخفاء هذه الفقاعة مؤقتًا أو تغيير حالتها لـ "قيد التحرير"
        });
        actionsDiv.appendChild(editBtn);
    }

    // إضافة حاوية الأزرار إلى الفقاعة
    bubble.appendChild(actionsDiv);

    return bubble;
}