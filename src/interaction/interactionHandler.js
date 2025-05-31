// 📁 src/interaction/interactionHandler.js
// إدارة تفاعلات المستخدم مع النظام

import { detectModelCall, handleModelCall } from './modelCall.js';
import identity from '../core/identity.js';
import { getModelResponse } from '../models/llmAdapter.js';
import { getUserPreferences } from '../memory/userPreferences.js';

const interactionHandler = {
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
                text: `عذرًا ${userName}، أحتاج إلى سؤال واضح لأساعدك بكل حب! 💕 يرجى كتابة استفسارك مرة أخرى.`,
                isUser: false,
                messageId: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            };
        }

        const currentModelId = identity.getCurrentModelId();
        const calledModelId = detectModelCall(userInput);

        if (calledModelId) {
            if (calledModelId === currentModelId) {
                const response = await getModelResponse(currentModelId, userInput);
                return {
                    modelName: identity.getActiveModelData().name,
                    text: `${response}، يا ${userName}! 💕 أنا هنا دائمًا لأسعدك!`,
                    isUser: false,
                    messageId: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                };
            } else {
                try {
                    const response = await handleModelCall(calledModelId, userInput, currentModelId, userName);
                    return response[0]; // إرجاع أول رد ككائن واحد
                } catch (error) {
                    console.error("خطأ في معالجة استدعاء النموذج:", error);
                    return {
                        modelName: identity.getActiveModelData().name,
                        text: `عذرًا ${userName}، حدث خطأ أثناء محاولة استدعاء ${identity.getModelNameById(calledModelId)}! 😔 يرجى المحاولة مرة أخرى، فأنا هنا لأساعدك بكل حب! 💕`,
                        isUser: false,
                        messageId: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                    };
                }
            }
        } else {
            try {
                const response = await getModelResponse(currentModelId, userInput);
                return {
                    modelName: identity.getActiveModelData().name,
                    text: `${response}، يا ${userName}! 💕 أتمنى أن أكون قد أسعدتك بردي!`,
                    isUser: false,
                    messageId: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                };
            } catch (error) {
                console.error("خطأ في الحصول على استجابة النموذج الرئيسي:", error);
                return {
                    modelName: identity.getActiveModelData().name,
                    text: `عذرًا ${userName}، حدث خطأ أثناء معالجة طلبك! 😔 لا تقلق، سأظل هنا لأساعدك بكل حب! 💕`,
                    isUser: false,
                    messageId: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                };
            }
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
        const userName = getUserPreferences().userName || "يا سيدي الغالي";
        try {
            const response = await getModelResponse(identity.getCurrentModelId(), newText, context);
            return {
                modelName: identity.getActiveModelData().name,
                text: `${response}، يا ${userName}! 💕 تم تحديث الرد بناءً على تعديلك!`,
                isUser: false,
                messageId: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            };
        } catch (error) {
            console.error("خطأ في إعادة معالجة الرسالة:", error);
            return {
                modelName: identity.getActiveModelData().name,
                text: `عذرًا ${userName}، حدث خطأ أثناء إعادة معالجة الرسالة! 😔 سأظل هنا لأساعدك! 💕`,
                isUser: false,
                messageId: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            };
        }
    },

    /**
     * تحديث تفضيلات التفاعل.
     * @param {Object} preferences - التفضيلات (persona: الشخصية، emotion: المشاعر الافتراضية)
     * @returns {Object} { status, message } نتيجة التحديث
     */
    updateInteractionPreferences(preferences) {
        const userName = getUserPreferences().userName || "يا سيدي الغالي";

        if (!preferences || !preferences.persona) {
            return {
                status: "فشل",
                message: `عذرًا ${userName}، أحتاج إلى تحديد الشخصية المفضلة لأكمل بكل حب! 💕 يرجى تحديد الشخصية.`
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
                message: `عذرًا ${userName}، الشخصية المحددة غير مدعومة! 😔 اختر نوري أو شيبو، وسأكون معك بكل حب! 💕`
            };
        }

        if (emotion) identity.setEmotion(emotion);

        return {
            status: "نجاح",
            message: `يا ${userName}، تم تحديث تفضيلات التفاعل بنجاح! 🥰 الآن سأكون معك كـ${newModel} بمشاعر ${emotion || "افتراضية"}، وسأظل دائمًا هنا لأسعدك! 💕`
        };
    },
};

export default interactionHandler;