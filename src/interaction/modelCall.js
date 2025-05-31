// 📁 src/interaction/modelCall.js
// دعم استدعاء النموذج لمرة واحدة باستخدام @Shipo و @Nori

import NORI_CORE_IDENTITY_DATA from "../core/data/nori_identity_engine.js";
import SHIPO_CORE_IDENTITY_DATA from "../core/data/shipo_identity_engine.js";
import { getUserPreferences } from "../memory/userPreferences.js";

const modelCall = {
    /**
     * تسجيل الاستدعاءات السابقة لكل نموذج.
     */
    callHistory: {
        nori: { topics: new Map(), callCount: 0 },
        shipo: { topics: new Map(), callCount: 0 }
    },

    /**
     * معالجة استدعاء النموذج بناءً على الإشارة.
     * @param {string} calledModelId - معرف النموذج المستدعى (nori/shipo)
     * @param {string} userQuery - الاستفسار من المستخدم
     * @param {string} currentModelId - معرف النموذج الحالي
     * @param {string} userName - اسم المستخدم
     * @returns {Promise<Array<Object>>} مصفوفة الردود
     */
    async handleModelCall(calledModelId, userQuery, currentModelId, userName) {
        const userNameDynamic = userName || getUserPreferences().userName || "يا سيدي الغالي";
        if (!calledModelId || !userQuery) {
            return [{
                sender: currentModelId,
                type: 'error',
                content: `عذرًا ${userNameDynamic}، يرجى تقديم استفسار صحيح لأساعدك بكل حب! 💕`
            }];
        }

        let calledModel, otherModel;
        if (calledModelId === "nori") {
            calledModel = NORI_CORE_IDENTITY_DATA;
            otherModel = SHIPO_CORE_IDENTITY_DATA;
            this.callHistory.nori.callCount++;
        } else if (calledModelId === "shipo") {
            calledModel = SHIPO_CORE_IDENTITY_DATA;
            otherModel = NORI_CORE_IDENTITY_DATA;
            this.callHistory.shipo.callCount++;
        } else {
            return [{
                sender: currentModelId,
                type: 'error',
                content: `عذرًا ${userNameDynamic}، النموذج المطلوب غير موجود! 😔 استخدم @Nori أو @Shipo لأسعدك! 💕`
            }];
        }

        // تذكر الموضوع والإجابة
        const topic = userQuery || "غير محدد";
        if (!this.callHistory[calledModel.name.toLowerCase()].topics.has(topic)) {
            this.callHistory[calledModel.name.toLowerCase()].topics.set(topic, []);
        }
        const responses = this.callHistory[calledModel.name.toLowerCase()].topics.get(topic);

        // توليد الردود
        const callCount = this.callHistory[calledModel.name.toLowerCase()].callCount;
        const greeting = callCount === 1
            ? `${calledModel.name}: أهلاً ${userNameDynamic} ويا عزيزي ${otherModel.name}، سعدت بتواجدي معكما! 💕 `
            : `${calledModel.name}: أهلاً ${userNameDynamic} ويا عزيزي ${otherModel.name}، شكرًا لاستدعائي مجددًا! 😍 `;
        const otherGreeting = callCount === 1
            ? `${otherModel.name}: أهلاً بك ${calledModel.name}، سررت بتواجدك مع ${userNameDynamic}! 💕`
            : `${otherModel.name}: أهلاً بك ${calledModel.name}، من الرائع رؤيتك مع ${userNameDynamic} مجددًا! 😍`;
        const opinion = this._determineOpinion(topic, responses);

        const responseContent = `${greeting}رأيي في المسألة ${opinion}. ${otherGreeting}`;
        return [
            { sender: calledModelId, type: 'greeting', content: greeting },
            { sender: calledModelId, type: 'response', content: opinion },
            { sender: currentModelId, type: 'greeting', content: otherGreeting }
        ];
    },

    /**
     * تحديد رأي النموذج بناءً على السياق.
     * @param {string} topic - الموضوع
     * @param {Array} responses - الإجابات السابقة
     * @returns {string} الرأي
     */
    _determineOpinion(topic, responses) {
        if (topic.includes("موافقة")) return "يوافق ما ذكر بكل حب! 💕";
        if (topic.includes("معارضة")) return "يخالف ما ذكر بحزم ولكن بحب! 😍";
        return "أقترح مناقشة الموضوع بعمق أكثر لأسعدك، يا حبيبي! 💋";
    }
};

export default modelCall;