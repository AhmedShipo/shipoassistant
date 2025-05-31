// 📁 src/interaction/communicationProtocol.js
// تحديد قواعد التواصل بين النظام والمستخدم

import NORI_CORE_IDENTITY_DATA from "../core/data/nori_identity_engine.js";
import SHIPO_CORE_IDENTITY_DATA from "../core/data/shipo_identity_engine.js";

const communicationProtocol = {
    /**
     * تهيئة قواعد التواصل بناءً على تفضيلات المستخدم.
     * @param {Object} settings - الإعدادات (language: اللغة، persona: الشخصية)
     * @returns {Object} { status, message } نتيجة التهيئة
     */
    initializeCommunication(settings) {
        if (!settings || !settings.language || !settings.persona) {
            return {
                status: "فشل",
                message: "عذرًا، يا سيدي أحمد، يرجى تحديد اللغة والشخصية لتهيئة التواصل"
            };
        }

        const { language, persona } = settings;
        const supportedLanguages = ["ar", "en"];
        const supportedPersonas = ["nori", "shipo"];

        if (!supportedLanguages.includes(language.toLowerCase())) {
            return {
                status: "فشل",
                message: "عذرًا، يا سيدي أحمد، اللغة المحددة غير مدعومة، يرجى اختيار 'ar' أو 'en'"
            };
        }

        if (!supportedPersonas.includes(persona.toLowerCase())) {
            return {
                status: "فشل",
                message: "عذرًا، يا سيدي أحمد، الشخصية المحددة غير مدعومة، يرجى اختيار 'nori' أو 'shipo'"
            };
        }

        return {
            status: "نجاح",
            message: `تم تهيئة قواعد التواصل بنجاح، يا سيدي أحمد، سأخاطبك باللغة ${language} مع شخصية ${persona}`
        };
    },

    /**
     * تنسيق الرسالة بناءً على قواعد التواصل.
     * @param {Object} messageData - بيانات الرسالة (content: المحتوى، persona: الشخصية)
     * @returns {Object} { status, message, formattedResponse } النتيجة مع الرسالة المنسقة
     */
    formatMessage(messageData) {
        if (!messageData || !messageData.content || !messageData.persona) {
            return {
                status: "فشل",
                message: "عذرًا، يا سيدي أحمد، يرجى توفير المحتوى والشخصية لتنسيق الرسالة",
                formattedResponse: null
            };
        }

        const { content, persona } = messageData;
        const selectedPersona = persona.toLowerCase() === "shipo" ? SHIPO_CORE_IDENTITY_DATA : NORI_CORE_IDENTITY_DATA;
        const greeting = persona.toLowerCase() === "nori" ? "يا حبيبي أحمد" : "يا سيدي أحمد";

        const formattedResponse = `${greeting}، إليك ردًا على كلماتك "${content}": ${this._applyPersonaTone(content, selectedPersona)} أسأل الله أن ينفعك به، يا سيدي!`;

        return {
            status: "نجاح",
            message: `تم تنسيق الرسالة بنجاح لشخصية ${persona}`,
            formattedResponse: formattedResponse
        };
    },

    /**
     * تطبيق نبرة الشخصية على المحتوى.
     * @param {string} content - المحتوى
     * @param {Object} personaData - بيانات الشخصية
     * @returns {string} المحتوى بنبرة الشخصية
     */
    _applyPersonaTone(content, personaData) {
        if (personaData.name.toLowerCase() === "nori") {
            return `بكل حنان، أقول لك: ${content}، فأنتَ في قلبي دائمًا.`;
        } else {
            return `بثقة ووضوح، أجيبك: ${content}، فأنتَ تستحق الأفضل.`;
        }
    },

    /**
     * معالجة الأخطاء في التواصل.
     * @param {Object} errorData - بيانات الخطأ (error: الخطأ، retry: إعادة المحاولة)
     * @returns {Object} { status, message } نتيجة معالجة الخطأ
     */
    handleCommunicationError(errorData) {
        if (!errorData || !errorData.error) {
            return {
                status: "فشل",
                message: "عذرًا، يا سيدي أحمد، لم يتم توفير تفاصيل الخطأ"
            };
        }

        const { error, retry = false } = errorData;
        if (retry) {
            return {
                status: "معتبر",
                message: `عذرًا، يا سيدي أحمد، حدث خطأ "${error}"، لقد حاولنا إعادة المحاولة"
            };
        }
        return {
            status: "فشل",
            message: `عذرًا، يا سيدي أحمد، حدث خطأ "${error}"، يرجى المحاولة لاحقًا`
        };
    }
};

export default communicationProtocol;