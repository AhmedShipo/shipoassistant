// 📁 knowledge/learningMechanisms.js
// خوارزميات التعلّم الذاتي والتراكمي في Shipo Assistant

import knowledgeSources from "./knowledgeSources.js";
import maqasidSharia from "../ethics/maqasidSharia.js";
import moralFramework from "../ethics/moralFramework.js";
import userLexicon from "../memory/userLexicon.js";

const learningMechanisms = {
    knowledgeStore: [], // لتخزين المعرفة المدمجة

    /**
     * تقييم المعلومة بناءً على الموثوقية والتوافق الأخلاقي.
     * @param {Object} entry - المعلومة (يجب أن تحتوي على source، isVerified، isBalanced، riskLevel، valueScore، importance)
     * @returns {Object} نتيجة التقييم مع trusted وmessage
     */
    evaluateInformation(entry) {
        if (!entry || typeof entry !== "object" || !entry.source || entry.isVerified === undefined || entry.isBalanced === undefined) {
            return { trusted: false, message: "البيانات غير مكتملة (مطلوب: source، isVerified، isBalanced)" };
        }

        const source = knowledgeSources.find(src => src.name === entry.source) || { reliability: 0.5 };
        const weight = source.reliability;

        const ethicalCheck = moralFramework.assessBehavior({
            honesty: entry.isVerified,
            fairness: entry.isBalanced,
            harmPotential: entry.riskLevel || 0,
            action: entry.content || "معلومة"
        });

        const maqasidCheck = maqasidSharia.applyMaqasidEvaluation({
            harm: entry.riskLevel || 0,
            benefit: entry.valueScore || 0.5,
            necessityLevel: entry.importance || "hajiyyat",
            action: entry.content || "معلومة"
        });

        return {
            sourceWeight: weight,
            ethicalCheck,
            maqasidCheck,
            trusted: weight > 0.7 && ethicalCheck.status === "مقبول" && maqasidCheck.status !== "مرفوض",
            message: ethicalCheck.message || maqasidCheck.message || `التقييم: ${weight > 0.7 ? "موثوق" : "غير موثوق"}`
        };
    },

    /**
     * دمج المعلومة في قاعدة المعرفة بعد التقييم.
     * @param {Object} entry - المعلومة المراد دمجها
     * @returns {Object} { status, message } نجاح أو فشل الدمج
     */
    integrateKnowledge(entry) {
        const evaluation = this.evaluateInformation(entry);

        if (!evaluation.trusted) {
            console.warn("🛑 تم رفض الإدخال بسبب التقييم الأخلاقي أو المقاصدي أو الموثوقية.", evaluation.message);
            return { status: "فشل", message: evaluation.message };
        }

        this.knowledgeStore.push(entry);
        console.log("📚 تم قبول الإدخال وإدماجه بنجاح:", entry.content.slice(0, 100));
        return { status: "نجاح", message: "تم دمج المعلومة بنجاح" };
    },

    /**
     * التعلّم من الاستخدام بناءً على السياق.
     * @param {Object} usageContext - سياق الاستخدام (type: term أو topic، term/topic: القيمة)
     * @returns {void}
     */
    learnFromUsage(usageContext) {
        if (!usageContext || typeof usageContext !== "object" || !usageContext.type) {
            console.warn("⚠️ سياق الاستخدام غير مكتمل.");
            return;
        }

        if (usageContext.type === "term" && usageContext.term) {
            userLexicon.addTerm(usageContext.term);
            console.log(`📘 إضافة تعبير جديد للقاموس: ${usageContext.term}`);
        } else if (usageContext.type === "topic" && usageContext.topic) {
            userLexicon.trackTopic(usageContext.topic);
            console.log(`🧠 تتبع نمط الاهتمام بموضوع: ${usageContext.topic}`);
        }

        // تحديث تلقائي للقاموس إن كان هناك سياق جديد
        if (usageContext.content) {
            const terms = usageContext.content.match(/[أ-يa-zA-Z]+/g) || [];
            terms.forEach(term => userLexicon.addTerm(term));
            console.log(`📝 تم تحديث القاموس بمصطلحات جديدة من السياق`);
        }
    },

    /**
     * مراقبة تقدم التعليم.
     * @returns {Object} حالة التعلم (عدد المعلومات، المتوسط الثقة)
     */
    getLearningProgress() {
        const totalEntries = this.knowledgeStore.length;
        const avgTrust = totalEntries > 0 ? this.knowledgeStore.reduce((sum, entry) => sum + (knowledgeSources.find(s => s.name === entry.source)?.reliability || 0.5), 0) / totalEntries : 0;

        return {
            totalEntries,
            averageTrust: avgTrust.toFixed(2),
            lastUpdated: new Date().toLocaleString()
        };
    }
};

export default learningMechanisms;