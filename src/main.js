// 📁 src/main.js
// النواة الرئيسية لتشغيل Shipo Assistant

import maqasidSharia from "./ethics/maqasidSharia.js";
import moralFramework from "./ethics/moralFramework.js";
import knowledgeSources from "./knowledge/knowledgeSources.js";
import learningMechanisms from "./knowledge/learningMechanisms.js";
import identity from "./core/identity.js";
import aqeeda from "./creed/aqeeda.js";
import userLexicon from "./memory/userLexicon.js";
import conversationHistory from "./memory/conversationHistory.js";
import interactionHandler from "./interaction/interactionHandler.js";
import communicationProtocol from "./interaction/communicationProtocol.js";
import contentFormatting from "./interaction/contentFormatting.js";
import emotionalResponse from "./interaction/emotionalResponse.js";
import scrollHandler from "./interaction/scrollHandler.js";
import modelSwitch from "./interaction/modelSwitch.js";
import modelCall from "./interaction/modelCall.js";
import { getUserPreferences } from "./memory/userPreferences.js";

const ShipoAssistantCore = {
    identity: identity,

    interaction: {
        handler: interactionHandler,
        protocol: communicationProtocol,
        formatter: contentFormatting,
        emotion: emotionalResponse,
        scroll: scrollHandler,
        modelSwitcher: modelSwitch,
        modelCaller: modelCall
    },

    /**
     * تهيئة النظام وتحميل الهويات.
     * @returns {Object} { status, message } نتيجة التهيئة
     */
    initialize() {
        // تعيين قيمة افتراضية صريحة للنموذج النشط
        if (!identity.activeGenderModel) {
            identity.activeGenderModel = "female"; // Nori كنموذج افتراضي
        }
        const userName = getUserPreferences().userName || "يا سيدي";
        this.notify({ status: "نجاح", message: `تم تهيئة النموذج النشط إلى ${identity.getModelNameById(identity.getCurrentModelId())}, ${userName}` });

        // تهيئة إعدادات التمرير
        const scrollInit = this.interaction.scroll.initializeScroll({ autoScroll: true, speed: 1 });
        this.notify(scrollInit);

        // تهيئة بيانات المستخدم
        const lexiconInit = userLexicon.initialize();
        this.notify(lexiconInit);

        return { status: "نجاح", message: `تم تهيئة النظام بنجاح, ${userName}` };
    },

    /**
     * دالة الإشعار لعرض الرسائل.
     * @param {Object} notification - كائن الإشعار (status, message)
     * @returns {void}
     */
    notify(notification) {
        if (!notification || !notification.status || !notification.message) {
            console.warn("⚠️ الإشعار غير مكتمل");
            return;
        }
        const userName = getUserPreferences().userName || "يا سيدي";
        console.log(`🔔 [${notification.status}]: ${notification.message.replace("يا سيدي أحمد", userName)}`);
    },

    /**
     * تقييم السياق بناءً على العقيدة، الأخلاق، والمقاصد.
     * @param {Object} context - السياق (action, source, harm, benefit, necessityLevel)
     * @returns {Object} نتيجة التقييم
     */
    evaluateContext(context) {
        const aqeedaEval = aqeeda.evaluateAction({ action: context.action, source: context.source });
        if (aqeedaEval.status !== "مقبول") {
            return { status: aqeedaEval.status, message: aqeedaEval.message };
        }

        const maqasidEval = maqasidSharia.applyMaqasidEvaluation({
            harm: context.harm,
            benefit: context.benefit,
            necessityLevel: context.necessityLevel,
            action: context.action
        });
        if (maqasidEval.status !== "مقبول" && maqasidEval.status !== "معتبر" && maqasidEval.status !== "تحسيني") {
            return { status: maqasidEval.status, message: maqasidEval.message };
        }

        const moralEval = moralFramework.assessBehavior({
            honesty: true,
            fairness: true,
            harmPotential: context.harm,
            necessityLevel: context.necessityLevel,
            action: context.action
        });

        return {
            status: moralEval.status,
            message: `${moralEval.message} | تقييم المقاصد: ${maqasidEval.message} | تقييم العقيدة: ${aqeedaEval.message}`
        };
    },

    /**
     * معالجة استفسار المستخدم.
     * @param {Object} query - الاستفسار (content, context)
     * @returns {Object} الرد
     */
    processQuery(query) {
        if (!query || !query.content || !query.context) {
            const userName = getUserPreferences().userName || "يا سيدي";
            return { status: "فشل", message: `الاستفسار غير مكتمل, ${userName}. يرجى التأكد من البيانات` };
        }

        const contextEval = this.evaluateContext(query.context);
        if (contextEval.status !== "مقبول") {
            return contextEval;
        }

        const interactionResult = this.interaction.handler.handleInteraction({
            userInput: {
                query: query.content,
                emotion: "حب" // فقط العاطفة تُمرر، persona يتم استنتاجه من identity
            }
        });
        if (interactionResult.status === "نجاح") {
            const formattedResponse = this.interaction.formatter.formatContent({
                rawContent: interactionResult.response,
                type: "text"
            });
            return {
                status: "نجاح",
                message: formattedResponse.formattedContent.message
            };
        }

        return interactionResult;
    },

    /**
     * عرض تقرير تقدم التعليم.
     * @returns {Object} تقرير التعليم
     */
    getLearningReport() {
        const progress = learningMechanisms.getLearningProgress();
        const topTerms = userLexicon.getTopTerms();
        const topTopics = userLexicon.getTopTopics();
        const userName = getUserPreferences().userName || "يا سيدي";

        return {
            learningProgress: progress,
            topTerms,
            topTopics,
            message: `تم عرض تقرير التعليم بنجاح, ${userName}`
        };
    },

    /**
     * إنشاء محادثة جديدة.
     * @returns {Object} { status, message } نتيجة الإنشاء
     */
    createNewConversation() {
        const historySaved = conversationHistory.saveConversation(identity.getCurrentModelId());
        this.notify(historySaved);
        conversationHistory.clearCurrent();
        const userName = getUserPreferences().userName || "يا سيدي";
        return {
            status: "نجاح",
            message: `تم إنشاء محادثة جديدة بنجاح, ${userName}`
        };
    }
};

// لا يتم استدعاء initialize تلقائيًا، يترك للمستورد
export default ShipoAssistantCore;