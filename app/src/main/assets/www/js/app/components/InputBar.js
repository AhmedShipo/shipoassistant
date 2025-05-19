// js/app/components/InputBar.js

import { showPopup } from '../utils/uiHelpers.js';

/**
 * وظيفة عرض شريط الإدخال في حاوية محددة.
 * @param {HTMLElement} container - عنصر الـ DOM الذي سيُعرض فيه شريط الإدخال.
 */
export function renderInputBar(container) {
    container.innerHTML = `
        <div class="input-field-container">
            <input type="text" id="chatInput" placeholder="أدخل النص هنا...">
            <button class="icon-button" id="wikipediaSearchBtn">📚</button> <button class="icon-button" id="attachmentBtn">📎</button> <div class="send-button" id="sendButton">
                <img src="img/send_icon.png" alt="Send">
            </div>
        </div>
    `;

    console.log("Input Bar HTML rendered.");
}

/**
 * وظيفة إعداد مستمعي الأحداث لشريط الإدخال.
 * يجب استدعاؤها بعد renderInputBar().
 * @param {Function} onSendMessageCallback - دالة تُستدعى عند إرسال الرسالة، وتمرر النص والمرفقات.
 */
export function setupInputBarListeners(onSendMessageCallback) {
    const sendButton = document.getElementById('sendButton');
    const chatInput = document.getElementById('chatInput');
    const wikipediaSearchBtn = document.getElementById('wikipediaSearchBtn'); // تم تغيير الـ ID
    const attachmentBtn = document.getElementById('attachmentBtn');
    const inputBarContainer = document.getElementById('inputBarContainer');

    let currentAttachments = [];

    // إضافة مستمع لزر الإرسال
    sendButton.addEventListener('click', () => {
        const message = chatInput.value.trim();
        if (message || currentAttachments.length > 0) {
            onSendMessageCallback(message, currentAttachments);
            chatInput.value = '';
            currentAttachments = [];
            console.log("Message and attachments sent.");
        }
    });

    // إضافة مستمع لزر Enter في حقل الإدخال
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendButton.click();
        }
    });

    // إضافة مستمع لزر البحث في ويكيبيديا
    wikipediaSearchBtn.addEventListener('click', async () => {
        const query = chatInput.value.trim();
        if (query) {
            console.log("Wikipedia search triggered for:", query);
            const searchPopupContent = document.createElement('div');
            searchPopupContent.innerHTML = `<p class="loading-message" style="text-align: center;">جاري البحث عن "${query}" في ويكيبيديا...</p><div class="loading-indicator"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>`;
            const popup = showPopup(searchPopupContent, "بحث ويكيبيديا"); // Show loading popup with a title

            try {
                // MediaWiki API for search (using Arabic Wikipedia)
                const wikipediaApiUrl = `https://ar.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`;
                const response = await fetch(wikipediaApiUrl);
                const data = await response.json();

                if (data.query && data.query.search && data.query.search.length > 0) {
                    let resultsHtml = `<h3>نتائج البحث عن "${query}" في ويكيبيديا:</h3><ul class="wikipedia-results-list">`;
                    data.query.search.forEach(result => {
                        const pageUrl = `https://ar.wikipedia.org/wiki/${encodeURIComponent(result.title.replace(/ /g, '_'))}`;
                        // استخدام `snippet` للحصول على جزء من النص
                        resultsHtml += `
                            <li>
                                <h4>${result.title}</h4>
                                <p>${result.snippet ? result.snippet.replace(/<span class="searchmatch">/g, '<b>').replace(/<\/span>/g, '</b>') + '...' : 'لا يوجد مقتطف.'}</p>
                                <div class="wikipedia-result-actions">
                                    <a href="${pageUrl}" target="_blank" class="button wikipedia-read-more-btn">اقرأ المزيد</a>
                                    <button class="button save-reference-btn" data-title="${result.title}" data-url="${pageUrl}">حفظ كمرجع</button>
                                </div>
                            </li>`;
                    });
                    resultsHtml += `</ul>`;
                    searchPopupContent.innerHTML = resultsHtml;

                    // إضافة مستمعي الأحداث لأزرار الحفظ بعد تحديث الـ HTML
                    searchPopupContent.querySelectorAll('.save-reference-btn').forEach(btn => {
                        btn.addEventListener('click', () => {
                            const title = btn.dataset.title;
                            const url = btn.dataset.url;
                            // هنا يمكنك حفظ المرجع في localStorage أو في أي مكان آخر
                            let savedReferences = JSON.parse(localStorage.getItem('savedReferences')) || [];
                            const newReference = { title, url, timestamp: Date.now() };
                            savedReferences.push(newReference);
                            localStorage.setItem('savedReferences', JSON.stringify(savedReferences));

                            alert(`تم حفظ "${title}" كمرجع بنجاح!\n(تم حفظه مؤقتاً في Local Storage)`);
                            console.log("Saved reference:", newReference);
                            btn.textContent = 'تم الحفظ!';
                            btn.disabled = true; // منع الحفظ المتعدد لنفس المرجع
                            btn.style.backgroundColor = 'var(--accent-blue-dark)';
                        });
                    });

                } else {
                    searchPopupContent.innerHTML = `<p>لم يتم العثور على نتائج لـ "${query}" في ويكيبيديا.</p>`;
                }
            } catch (error) {
                console.error("Wikipedia search error:", error);
                searchPopupContent.innerHTML = `<p style="color:red;">حدث خطأ أثناء البحث في ويكيبيديا.</p>`;
            } finally {
                chatInput.value = ''; // مسح حقل الإدخال
            }
        } else {
            alert("الرجاء إدخال نص للبحث في ويكيبيديا.");
        }
    });

    // إضافة مستمع لزر المرفقات (سيعرض قائمة منبثقة)
    attachmentBtn.addEventListener('click', (event) => {
        console.log("Attachment button clicked. Displaying attachment options.");
        const existingMenu = inputBarContainer.querySelector('.attachment-options-menu');
        if (existingMenu) {
            existingMenu.remove();
            return; // إغلاق القائمة إذا كانت مفتوحة بالفعل
        }

        const attachmentOptions = document.createElement('div');
        attachmentOptions.className = 'attachment-options-menu dropdown-menu active';
        const buttonRect = attachmentBtn.getBoundingClientRect();
        attachmentOptions.style.position = 'absolute';
        attachmentOptions.style.bottom = `${inputBarContainer.offsetHeight - buttonRect.top + 10}px`;
        attachmentOptions.style.right = `${window.innerWidth - buttonRect.right}px`;

        attachmentOptions.innerHTML = `
            <button data-type="camera">📷 الكاميرا</button>
            <button data-type="photos">🖼️ الصور</button>
            <button data-type="files">📁 الملفات</button>
        `;

        inputBarContainer.appendChild(attachmentOptions);

        // إغلاق القائمة عند النقر خارجها
        document.addEventListener('click', function closeMenu(e) {
            if (!attachmentOptions.contains(e.target) && e.target !== attachmentBtn) {
                attachmentOptions.remove();
                document.removeEventListener('click', closeMenu);
            }
        });

        // إضافة مستمعي الأحداث لخيارات المرفقات
        attachmentOptions.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', function() {
                const attachmentType = this.dataset.type;
                console.log(`Attachment type selected: ${attachmentType}`);
                handleAttachmentSelection(attachmentType);
                attachmentOptions.remove();
            });
        });
    });

    // وظيفة للتعامل مع اختيار نوع المرفق
    function handleAttachmentSelection(type) {
        if (type === 'files') {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.style.display = 'none';
            fileInput.multiple = true;
            fileInput.addEventListener('change', (e) => {
                const files = e.target.files;
                if (files.length > 0) {
                    Array.from(files).forEach(file => {
                        console.log(`Selected file: ${file.name}, Type: ${file.type}, Size: ${file.size} bytes`);
                        currentAttachments.push(file);
                        chatInput.value = (chatInput.value ? chatInput.value + ' ' : '') + `[ملف: ${file.name}]`;
                    });
                }
            });
            fileInput.click();
        } else {
            alert(`وظيفة الكاميرا أو الصور تتطلب Cordova plugins مثل cordova-plugin-camera. هذه مجرد واجهة وهمية.`);
            console.warn(`Attachment type '${type}' not yet implemented for real interaction.`);
        }
    }

    console.log("Input Bar listeners set up.");
}