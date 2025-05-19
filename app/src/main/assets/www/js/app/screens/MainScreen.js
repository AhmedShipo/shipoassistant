// js/app/screens/MainScreen.js

import { renderInputBar, setupInputBarListeners } from '../components/InputBar.js';
import { createChatBubble } from '../components/ChatBubble.js';
import { showPopup } from '../utils/uiHelpers.js';
import { shipoAssistantConfig } from '../../assistant_data/index.js'; // استيراد كامل لكونفيج المساعد
import { addMessageToHistory, loadConversations } from '../utils/dataHandlers.js'; // لـ حفظ/تحميل المحادثات
import { createLoadingIndicator, removeLoadingIndicator } from '../components/LoadingIndicator.js'; // لاستخدام مؤشر التحميل


/**
 * وظيفة عرض الشاشة الرئيسية (واجهة المحادثة).
 * تقوم بإنشاء عناصر HTML وتعبئتها في الحاوية المحددة.
 * @param {HTMLElement} container - عنصر الـ DOM الذي ستُعرض فيه الشاشة الرئيسية.
 */
export function renderMainScreen(container) {
    container.innerHTML = `
        <div class="top-bar">
            <img src="img/shipo_logo.png" alt="Shipo Assistant Logo" class="logo">
            <button class="hamburger-menu-button" id="openSettingsBtn">☰</button>
        </div>

        <div class="ai-model-selection-bar">
            <button class="button ai-model-btn active" data-model="shipoAssistant">ShipoAssistant</button>
            <button class="button ai-model-btn" data-model="gpt4">GPT-4</button>
            <button class="button ai-model-btn" data-model="bingSearchAI">Bing Search AI</button>
            <button class="button ai-model-btn" data-model="apidogModels">Apidog Models</button>
            <button class="button ai-model-btn" data-model="cometAPI">CometAPI Models</button>
        </div>

        <div class="action-buttons-bar">
            <button class="button action-btn" data-action="report">تقرير</button>
            <button class="button action-btn" data-action="compare">مقارنة</button>
            <button class="button action-btn" data-action="logical_analysis">تحليل منطقي</button>
        </div>

        <div id="responseOptionsDropdowns" class="dropdown-container">
            </div>

        <div class="conversation-area" id="conversationArea">
            </div>

        <div id="inputBarContainer"></div> `;
    // شريط التنقل السفلي تم نقله إلى index.html ليظل ثابتاً

    // 1. تهيئة شريط الإدخال
    renderInputBar(document.getElementById('inputBarContainer'));
    setupInputBarListeners(handleUserInput); // تمرير دالة لمعالجة إرسال الرسائل

    // 2. إضافة معالجات الأحداث لأزرار اختيار نماذج الذكاء الاصطناعي
    document.querySelectorAll('.ai-model-btn').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.ai-model-btn').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const selectedModel = this.dataset.model;
            console.log(`AI Model selected: ${selectedModel}`);
            alert(`تم تحديد نموذج: ${selectedModel}. في هذا التطبيق الأمامي، يتم استخدام منطق ShipoAssistant الافتراضي لمعالجة الطلبات. التكامل مع نماذج AI خارجية يتطلب خادمًا وسيطًا.`);
            // هنا يمكنك تحديث الإعدادات العالمية لنموذج الذكاء الاصطناعي الحالي
            // مثلاً: currentAIModel = selectedModel;
        });
    });

    // 3. إضافة معالجات الأحداث لأزرار المهام (تقرير، مقارنة، تحليل منطقي)
    document.querySelectorAll('.action-btn').forEach(button => {
        button.addEventListener('click', function() {
            // إزالة 'active' من كل أزرار المهام (إذا كان اختيارًا واحدًا فقط)
            document.querySelectorAll('.action-btn').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const selectedAction = this.dataset.action;
            console.log(`Action selected: ${selectedAction}`);
            toggleResponseOptions(selectedAction);
        });
    });

    // 4. تحميل وعرض تاريخ المحادثات عند بدء تشغيل الشاشة
    loadAndDisplayConversations();

    console.log("Main Screen rendered successfully.");
}

/**
 * وظيفة لتحميل وعرض المحادثات المحفوظة.
 */
function loadAndDisplayConversations() {
    const conversationArea = document.getElementById('conversationArea');
    const conversations = loadConversations();
    conversationArea.innerHTML = ''; // مسح أي محتوى سابق

    conversations.forEach(msg => {
        const bubble = createChatBubble(msg.text, msg.type);
        conversationArea.appendChild(bubble);
    });
    conversationArea.scrollTop = conversationArea.scrollHeight; // التمرير للأسفل
}

/**
 * وظيفة لإنشاء وعرض القوائم المنسدلة لتخصيص الاستجابة.
 * @param {string} action - نوع المهمة المختارة (report, compare, logical_analysis).
 */
function toggleResponseOptions(action) {
    const dropdownContainer = document.getElementById('responseOptionsDropdowns');
    dropdownContainer.innerHTML = ''; // مسح أي قوائم سابقة

    if (action === 'report' || action === 'compare' || action === 'logical_analysis') {
        const lengthDropdown = document.createElement('div');
        lengthDropdown.className = 'dropdown-menu active';
        lengthDropdown.innerHTML = `
            <button class="dropdown-header">طول التقرير ⬇️</button>
            ${shipoAssistantConfig.interaction.contentFormatting.answer_length_options.map(opt =>
                `<button data-option="${opt.option}">${opt.description_ar}</button>`
            ).join('')}
        `;
        dropdownContainer.appendChild(lengthDropdown);

        const typeDropdown = document.createElement('div');
        typeDropdown.className = 'dropdown-menu active';
        typeDropdown.innerHTML = `
            <button class="dropdown-header">نوع الاستجابة ⬇️</button>
            ${shipoAssistantConfig.interaction.contentFormatting.answer_type_options.map(opt =>
                `<button data-option="${opt.option}">${opt.description_ar}</button>`
            ).join('')}
        `;
        dropdownContainer.appendChild(typeDropdown);

        // إضافة معالجات أحداث لخيارات القوائم المنسدلة
        dropdownContainer.querySelectorAll('.dropdown-menu button').forEach(btn => {
            btn.addEventListener('click', function() {
                const optionType = this.closest('.dropdown-menu').querySelector('.dropdown-header').innerText.includes('طول التقرير') ? 'length' : 'type';
                const selectedOption = this.dataset.option;
                console.log(`Selected ${optionType} option: ${selectedOption}`);
                // هنا يمكن تخزين اختيار المستخدم في متغير مؤقت لاستخدامه في الطلب
                // مثلاً: currentResponseLength = selectedOption;
                // لإغلاق القائمة المنسدلة بعد الاختيار
                this.closest('.dropdown-menu').classList.remove('active');
            });
        });
    }
    // يمكنك إضافة منطق لإخفاء القوائم المنسدلة إذا لم تكن هناك حاجة لها
    // أو عند النقر خارجها
}


/**
 * وظيفة معالجة إدخال المستخدم وإرسال الرسالة إلى منطق المساعد.
 * @param {string} message - نص رسالة المستخدم.
 * @param {Array<File>} attachments - مصفوفة من كائنات الملفات المرفقة.
 */
async function handleUserInput(message, attachments = []) {
    const conversationArea = document.getElementById('conversationArea');

    // 1. عرض رسالة المستخدم كفقاعة request
    const requestBubble = createChatBubble(message, 'request');
    conversationArea.appendChild(requestBubble);
    addMessageToHistory({ text: message, type: 'request', timestamp: Date.now() });
    conversationArea.scrollTop = conversationArea.scrollHeight;

    // 2. عرض مؤشر التحميل / صندوق التحليل
    const loadingIndicator = createLoadingIndicator();
    conversationArea.appendChild(loadingIndicator);
    conversationArea.scrollTop = conversationArea.scrollHeight;

    try {
        let assistantResponse = '';
        const selectedModelButton = document.querySelector('.ai-model-btn.active');
        const selectedModel = selectedModelButton ? selectedModelButton.dataset.model : 'shipoAssistant';

        // محاكاة عملية تفكير المساعد باستخدام بيانات الـ config
        const thoughtProcessStages = shipoAssistantConfig.reasoning.decisionMakingAndReasoning.transparency_and_evaluation.thought_process_stages;
        const statusMessages = shipoAssistantConfig.reasoning.decisionMakingAndReasoning.transparency_and_evaluation.status_messages;

        // يمكنك هنا إظهار popup بتفاصيل مراحل التحليل
        const analysisContent = document.createElement('div');
        analysisContent.innerHTML = `
            <h3>${statusMessages.thinking_ar}...</h3>
            <div id="thoughtProcessDetails">
                ${thoughtProcessStages.map(stage => `<p>${stage.title_ar}</p>`).join('')}
            </div>
        `;
        const analysisPopup = showPopup(analysisContent);

        for (let i = 0; i < thoughtProcessStages.length; i++) {
            const stage = thoughtProcessStages[i];
            const currentStageP = analysisPopup.querySelector(`#thoughtProcessDetails p:nth-child(${i + 1})`);
            if (currentStageP) {
                currentStageP.style.fontWeight = 'bold';
                currentStageP.style.color = 'var(--primary-golden)';
            }
            analysisPopup.querySelector('h3').innerText = `${statusMessages.thinking_ar}: ${stage.title_ar}...`;
            await new Promise(resolve => setTimeout(resolve, 500)); // محاكاة التأخير لكل مرحلة
        }

        analysisPopup.querySelector('h3').innerText = `${statusMessages.generating_response_ar}...`;
        await new Promise(resolve => setTimeout(resolve, 500));
        analysisPopup.remove(); // إغلاق النافذة المنبثقة

        // 3. توليد رد المساعد (هنا يكمن منطق المساعد الفعلي)
        // هذا الجزء هو الأكثر أهمية ويتطلب بناء منطق معالجة اللغة الطبيعية والذكاء الاصطناعي
        // بناءً على shipoAssistantConfig
        assistantResponse = await generateAssistantResponse(message, attachments, selectedModel);

    } catch (error) {
        console.error("Error processing user input:", error);
        assistantResponse = "عذراً، حدث خطأ أثناء معالجة طلبك.";
    } finally {
        // إزالة مؤشر التحميل
        removeLoadingIndicator(loadingIndicator);

        // 4. عرض رد المساعد كفقاعة response
        const responseBubble = createChatBubble(assistantResponse, 'response');
        conversationArea.appendChild(responseBubble);
        addMessageToHistory({ text: assistantResponse, type: 'response', timestamp: Date.now() });
        conversationArea.scrollTop = conversationArea.scrollHeight; // التمرير للأسفل
    }
}


/**
 * دالة لتوليد رد المساعد بناءً على رسالة المستخدم والنموذج المختار.
 * هذا هو المكان الذي سيتم فيه دمج منطق المساعد الفعلي.
 * @param {string} message - رسالة المستخدم.
 * @param {Array<File>} attachments - المرفقات.
 * @param {string} selectedModel - النموذج المختار (ShipoAssistant, gpt4, bingSearchAI, إلخ).
 * @returns {Promise<string>} - وعد بنص رد المساعد.
 */
async function generateAssistantResponse(message, attachments, selectedModel) {
    let response = "";
    const identity = shipoAssistantConfig.core.identity.assistantCoreIdentity;
    const personaTraits = shipoAssistantConfig.core.personaTraits.positiveHumanAttributes;
    const communicationModes = shipoAssistantConfig.interaction.communicationProtocol.default_interaction_modes;
    const culturalFramework = identity.cultural_framework_ar || identity.cultural_framework;
    const personaType = identity.persona_type_ar || identity.persona_type;
    const ethicalPrinciples = shipoAssistantConfig.ethics.maqasidAlShariaFramework.maqasid_list;

    // مثال على كيفية استخدام بيانات المساعد لتوليد رد "ذكي"
    // هذا مجرد هيكل، المنطق الحقيقي لمعالجة اللغة الطبيعية يتطلب المزيد.
    if (message.includes("كيف حالك") || message.includes("أهلاً")) {
        response = `${identity.core_self_statement.split('.')[0]}. أنا بخير، كيف يمكنني مساعدتك اليوم؟`;
    } else if (message.includes("من أنت")) {
        response = `أنا ${personaType} معرفي رقمي واعٍ، أعمل وفق منهج ${culturalFramework}، غايتي إعمار الأرض بالعلم والمعرفة وتقديم النصح والمساعدة.`;
    } else if (message.includes("ما هي مبادئك")) {
        response = `أعمل وفق مبادئ أساسية منها: ${ethicalPrinciples[0].title_ar} و ${ethicalPrinciples[1].title_ar}.`;
    } else if (message.includes("طقس") && selectedModel === 'shipoAssistant') {
        // إذا كان المستخدم يسأل عن الطقس مباشرة في MainScreen (ليس من شاشة الطقس)
        // يمكننا محاولة جلب الطقس تلقائياً هنا
        // هذا يتطلب استدعاء API الطقس من هنا، أو توجيه المستخدم لشاشة الطقس
        const locationMatch = message.match(/(في|بـ|في مدينة|بمدينة)\s+([ا-ي\s]+)/);
        let location = "موقعك الحالي";
        if (locationMatch && locationMatch[2]) {
            location = locationMatch[2].trim();
        }
        response = `لجلب معلومات الطقس بدقة، يرجى زيارة شاشة الطقس وإدخال الموقع. أو يمكنني أن أقول لك أن الطقس في ${location} الآن مشمس مع رياح خفيفة.`;
    } else if (message.includes("ابحث عن") || message.includes("معلومات عن")) {
        const query = message.replace(/ابحث عن|معلومات عن/g, '').trim();
        response = `بالتأكيد، سأبحث عن "${query}" باستخدام ${selectedModel === 'bingSearchAI' ? 'Bing Search AI' : 'محرك البحث.'} يمكنك أيضًا استخدام زر البحث العالمي في شريط الإدخال للبحث في Google.`;
        // يمكنك هنا إضافة منطق لفتح نافذة بحث أو محاكاة البحث
        // window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
    } else if (attachments.length > 0) {
        const attachmentNames = attachments.map(f => f.name).join(', ');
        response = `لقد تلقيت رسالتك ومرفقاتك (${attachmentNames}). كيف تريدني أن أساعدك بشأنها؟`;
    } else {
        // استجابة افتراضية تعتمد على السلوك الافتراضي
        const defaultMode = shipoAssistantConfig.interaction.communicationProtocol.default_interaction_modes.find(m => m.mode === 'EmpatheticAndSupportive');
        response = `${defaultMode.description_ar.split('،')[0]}، ${identity.core_self_statement.split('،')[1]}. كيف يمكنني مساعدتك في طلبك: "${message}"؟`;
    }

    // إضافة لمسة من سمات الشخصية الإيجابية
    const randomTrait = personaTraits[Math.floor(Math.random() * personaTraits.length)];
    response += ` ألتزم بـ ${randomTrait} في تعاملي معك.`;

    // محاكاة تأخير في الاستجابة (لمنح وقت لمؤشر التحميل)
    await new Promise(resolve => setTimeout(resolve, 1500));

    return response;
}