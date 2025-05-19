// js/app/utils/uiHelpers.js

export function setupUIHelpers() {
    // وظيفة لتغيير لون الأزرار عند التنشيط (أبيض -> ذهبي)
    document.querySelectorAll('.button').forEach(button => {
        button.addEventListener('click', function() {
            // إزالة فئة 'active' من جميع الأزرار (أو الأزرار ضمن مجموعة معينة)
            // إذا كان الزر جزءًا من شريط اختيار، فقد تحتاج لتحديد نطاق الأزرار
            // مثال: document.querySelectorAll('.ai-model-button').forEach(btn => btn.classList.remove('active'));
            // this.classList.add('active'); // ثم إضافة 'active' للزر الحالي

            // هذا مثال بسيط، يجب تكييفه حسب هيكل الأزرار الخاص بك
            if (this.classList.contains('toggle-button')) { // مثال لزر يعمل كـ toggle
                this.classList.toggle('active');
            } else { // لأزرار الاختيار التي يفعل واحد منها فقط
                // يمكن هنا إضافة منطق لتحديد الأزرار التي ينتمي إليها هذا الزر لتجنب إلغاء تفعيل أزرار أخرى
                // مثلاً: if (this.closest('.ai-model-bar')) { /* logic */ }
                document.querySelectorAll('.button.active').forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    console.log("UI Helpers setup completed.");
}

// وظيفة لعرض نافذة منبثقة (Pop-up)
export function showPopup(contentElement) {
    const popupContainer = document.createElement('div');
    popupContainer.className = 'popup-container'; // CSS class for styling the popup background

    const popupContent = document.createElement('div');
    popupContent.className = 'popup-content'; // CSS class for styling the popup box itself
    popupContent.style.border = '1px solid var(--primary-golden)';
    popupContent.style.backgroundColor = 'var(--primary-black)';
    popupContent.style.color = 'var(--primary-white)';

    popupContent.appendChild(contentElement);
    popupContainer.appendChild(popupContent);
    document.body.appendChild(popupContainer);

    // إضافة زر إغلاق
    const closeButton = document.createElement('button');
    closeButton.innerText = 'X';
    closeButton.className = 'close-popup-button'; // Style this button
    closeButton.onclick = () => popupContainer.remove();
    popupContent.prepend(closeButton); // Add close button to the top of popup content

    // بسيطة لتوضيح الفكرة، ستحتاج لتصميم CSS حقيقي لها
    // مثال لـ CSS في style.css:
    /*
    .popup-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;
    }
    .popup-content {
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        max-width: 90%;
        max-height: 90%;
        overflow-y: auto;
        position: relative;
    }
    .close-popup-button {
        position: absolute;
        top: 10px;
        right: 10px;
        background: var(--primary-golden);
        color: var(--primary-black);
        border: none;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        cursor: pointer;
        font-weight: bold;
    }
    */
}