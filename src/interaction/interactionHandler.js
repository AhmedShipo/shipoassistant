import { detectModelCall, handleModelCall } from './modelCall.js';
import identity from '../core/identity.js';
import { getModelResponse } from '../models/llmAdapter.js';
import { getUserPreferences } from '../memory/userPreferences.js';
import contextManager from '../connectivity/contextManager.js';

const interactionHandler = {
    /**
     * توليد رسالة رد بناءً على الحالة.
     * @param {string} message - محتوى الرسالة
     * @param {string} userName - اسم المستخدم
     * @param {boolean} isError - هل الرسالة رسالة خطأ
     * @returns {string} - الرسالة المولدة
     */
    generateResponseMessage: (message, userName, isError = false) => {
        return `${isError ? 'عذرًا' : 'يا'} ${userName}، ${message}! 💕 ${isError ? 'سأظل هنا لأساعدك' : 'أتمنى أن أكون قد أسعدتك بردي'}!`;
    },

    /**
     * تنظيف المدخل والتحقق من طوله.
     * @param {string} input - النص المدخل
     * @returns {string} - النص المنظف
     * @throws {Error} - إذا كان المدخل طويل جدًا
     */
    sanitizeInput: (input) => {
        const MAX_INPUT_LENGTH = 1000;
        if (input.length > MAX_INPUT_LENGTH) {
            throw new Error(`المدخل طويل جدًا، الحد الأقصى ${MAX_INPUT_LENGTH} حرف.`);
        }
        return input.replace(/<[^>]+>/g, ''); // إزالة أي HTML tags
    },

    /**
     * تحليل المشاعر بناءً على المدخل.
     * @param {string} input - النص المدخل
     * @returns {string} - المشاعر المكتشفة
     */
    detectEmotion: (input) => {
        const sadKeywords = ['حزين', 'زعلان', 'مكتئب'];
        const happyKeywords = ['فرحان', 'سعيد', 'مبسوط'];
        input = input.toLowerCase();
        if (sadKeywords.some(keyword => input.includes(keyword))) return 'sad';
        if (happyKeywords.some(keyword => input.includes(keyword))) return 'happy';
        return 'neutral';
    },

    /**
     * معالجة الاستفسار المقدم من المستخدم وتوليد الرد المناسب.
     * @param {string} userInput - النص المدخل من المستخدم
     * @param {string} userName - اسم المستخدم
     * @returns {Promise<Object>} - كائن الرد.
     */
    async processUserInput(userInput, userName = "يا سيدي الغالي") {
        // التحقق من اكتمال المدخل
        if (!userInput || typeof userInput !== 'string' || userInput.trim() === '') {
            return {
                modelName: identity.getActiveModelData().name,
                text: interactionHandler.generateResponseMessage("أحتاج إلى سؤال واضح لأساعدك بكل حب", userName, true),
                isUser: false,
                messageId: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            };
        }

        try {
            const sanitizedInput = interactionHandler.sanitizeInput(userInput);
            const detectedEmotion = interactionHandler.detectEmotion(sanitizedInput);
            identity.setEmotion(detectedEmotion);

            const currentModelId = identity.getCurrentModelId();
            const calledModelId = detectModelCall(sanitizedInput);

            const context = await contextManager.buildContext();

            if (calledModelId) {
                if (calledModelId === currentModelId) {
                    const response = await getModelResponse(currentModelId, sanitizedInput, context);
                    return {
                        modelName: identity.getActiveModelData().name,
                        text: interactionHandler.generateResponseMessage(response, userName),
                        isUser: false,
                        messageId: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                        emotion: detectedEmotion,
                    };
                } else {
                    try {
                        const response = await handleModelCall(calledModelId, sanitizedInput, currentModelId, userName);
                        return response[0]; // إرجاع أول رد ككائن واحد
                    } catch (error) {
                        console.error("خطأ في معالجة استدعاء النموذج:", error);
                        return {
                            modelName: identity.getActiveModelData().name,
                            text: interactionHandler.generateResponseMessage(`حدث خطأ أثناء محاولة استدعاء ${identity.getModelNameById(calledModelId)}`, userName, true),
                            isUser: false,
                            messageId: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                            emotion: 'sad',
                        };
                    }
                }
            } else {
                try {
                    const response = await getModelResponse(currentModelId, sanitizedInput, context);
                    return {
                        modelName: identity.getActiveModelData().name,
                        text: interactionHandler.generateResponseMessage(response, userName),
                        isUser: false,
                        messageId: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                        emotion: detectedEmotion,
                    };
                } catch (error) {
                    console.error("خطأ في الحصول على استجابة النموذج الرئيسي:", error);
                    return {
                        modelName: identity.getActiveModelData().name,
                        text: interactionHandler.generateResponseMessage("حدث خطأ أثناء معالجة طلبك", userName, true),
                        isUser: false,
                        messageId: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                        emotion: 'sad',
                    };
                }
            }
        } catch (error) {
            console.error("خطأ في معالجة المدخل:", error);
            return {
                modelName: identity.getActiveModelData().name,
                text: interactionHandler.generateResponseMessage(error.message, userName, true),
                isUser: false,
                messageId: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                emotion: 'sad',
            };
        }
    },

    /**
     * إعادة معالجة رسالة بعد التعديل.
     * @param {string} messageId - معرف الرسالة
     * @param {string} newText - النص المعدل
     * @param {Object} context - سياق المحادثة
     * @returns {Promise<Object>} - الرد المعدل
     */
    async reprocessMessage(messageId, newText, context) {
        const userName = getUserPreferences()?.userName || "يا سيدي الغالي";
        try {
            const sanitizedText = interactionHandler.sanitizeInput(newText);
            const detectedEmotion = interactionHandler.detectEmotion(sanitizedText);
            identity.setEmotion(detectedEmotion);

            const response = await getModelResponse(identity.getCurrentModelId(), sanitizedText, context);
            return {
                modelName: identity.getActiveModelData().name,
                text: interactionHandler.generateResponseMessage("تم تحديث الرد بناءً على تعديلك", userName),
                isUser: false,
                messageId: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                emotion: detectedEmotion,
            };
        } catch (error) {
            console.error("خطأ في إعادة معالجة الرسالة:", error);
            return {
                modelName: identity.getActiveModelData().name,
                text: interactionHandler.generateResponseMessage("حدث خطأ أثناء إعادة معالجة الرسالة", userName, true),
                isUser: false,
                messageId: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                emotion: 'sad',
            };
        }
    },

    /**
     * تحديث تفضيلات التفاعل.
     * @param {Object} preferences - التفضيلات (persona: الشخصية، emotion: المشاعر الافتراضية)
     * @returns {Object} { status, message } نتيجة التحديث
     */
    updateInteractionPreferences(preferences) {
        const userName = getUserPreferences()?.userName || "يا سيدي الغالي";

        if (!preferences || !preferences.persona) {
            return {
                status: "فشل",
                message: interactionHandler.generateResponseMessage("أحتاج إلى تحديد الشخصية المفضلة لأكمل بكل حب", userName, true),
            };
        }

        const { persona, emotion } = preferences;
        let newModel = "";
        if (persona.toLowerCase() === "nori") {
            identity.activeGenderModel = "female";
            newModel = "نوري";
        } else if (persona.toLowerCase() === "shipo") {
            identity.activeGenderModel = "male";
            newModel = "شيبو";
        } else {
            return {
                status: "فشل",
                message: interactionHandler.generateResponseMessage("الشخصية المحددة غير مدعومة! اختر نوري أو شيبو", userName, true),
            };
        }

        if (emotion) identity.setEmotion(emotion);

        return {
            status: "نجاح",
            message: interactionHandler.generateResponseMessage(`تم تحديث تفضيلات التفاعل بنجاح! الآن سأكون معك كـ${newModel} بمشاعر ${emotion || "افتراضية"}`, userName),
        };
    },
};

export default interactionHandler;