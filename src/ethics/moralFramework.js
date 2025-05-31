// 📁 ethics/moralFramework.js
// إطار أخلاقي مستند إلى المرجعية الدينية لنموذج Shipo Assistant

import maqasidSharia from "./maqasidSharia.js";

const moralFramework = {
    principles: [
        "الصدق",
        "الأمانة",
        "العدل",
        "الوفاء",
        "التواضع",
        "الرحمة"
    ],

    decisionRules: [
        "لا ضرر ولا ضرار",
        "اليقين لا يزول بالشك",
        "المشقة تجلب التيسير",
        "الضرورات تبيح المحظورات (بضوابطها)",
        "درء المفاسد مقدم على جلب المصلحة"
    ],

    /**
     * تقييم المفاسد والمصالح.
     * @param {number} harm - مستوى الضرر (0 إلى 1)
     * @param {number} benefit - مستوى المصلحة (0 إلى 1)
     * @returns {Object} قرار وسبب التقييم
     */
    evaluateHarmBenefit(harm, benefit) {
        if (typeof harm !== "number" || typeof benefit !== "number" || harm < 0 || harm > 1 || benefit < 0 || benefit > 1) {
            return { decision: "خطأ", reason: "المدخلات غير صالحة (يجب أن تكون بين 0 و1)" };
        }
        if (harm > benefit) return { decision: "مرفوض", reason: "المفسدة أرجح" };
        if (harm === 0 && benefit > 0) return { decision: "مقبول", reason: "مصلحة خالصة" };
        return { decision: "معتبر", reason: "موازنة بين المفسدة والمصلحة" };
    },

    /**
     * تقييم السلوك بناءً على الإطار الأخلاقي.
     * @param {Object} behavior - يحتوي على honesty (الصدق)، fairness (العدل)، harmPotential (إمكانية الضرر)، necessityLevel (مستوى الضرورة)، action (الفعل)
     * @returns {Object} { status, message, icon } التقييم مع رمز بصري ورسالة
     */
    assessBehavior(behavior) {
        if (!behavior || typeof behavior !== "object" || behavior.honesty === undefined || behavior.fairness === undefined || behavior.harmPotential === undefined || !behavior.action) {
            return {
                status: "خطأ",
                message: "خطأ: البيانات غير مكتملة (حاجة لحقول honesty، fairness، harmPotential، action)",
                icon: "❓"
            };
        }

        const { honesty, fairness, harmPotential, necessityLevel = "tahsiniyyat", action } = behavior;

        // تقييم المفسدة والمصلحة
        const harmBenefitEval = this.evaluateHarmBenefit(harmPotential, 1 - harmPotential);
        if (harmBenefitEval.decision === "خطأ") {
            return {
                status: "خطأ",
                message: harmBenefitEval.reason,
                icon: "❓"
            };
        }

        // دمج تقييم مقاصد الشريعة
        const maqasidEval = maqasidSharia.applyMaqasidEvaluation({
            harm: harmPotential,
            benefit: 1 - harmPotential,
            necessityLevel,
            action
        });

        if (maqasidEval.status === "مرفوض" || maqasidEval.status === "خطأ") {
            return {
                status: maqasidEval.status,
                message: maqasidEval.message,
                icon: "🚫"
            };
        }

        // تقييم الأخلاق
        if (!honesty) {
            return {
                status: "مخالف",
                message: "مخالف: الكذب مرفوض شرعًا وعقلاً",
                icon: "❌"
            };
        }
        if (!fairness) {
            return {
                status: "غير منصف",
                message: "غير منصف: يستوجب مراجعة",
                icon: "⚠️"
            };
        }

        return {
            status: "مقبول",
            message: "مقبول أخلاقيًا: منضبط بالقيم المرجعية",
            icon: "✅"
        };
    },

    /**
     * توصية بفضيلة بناءً على السياق.
     * @param {string} context - السياق (خلاف، سؤال، تفاعل اجتماعي)
     * @returns {string} الفضيلة الموصى بها
     */
    recommendVirtue(context) {
        switch (context) {
            case "خلاف": return "العدل والصبر";
            case "سؤال": return "الصدق والأمانة";
            case "تفاعل اجتماعي": return "الرحمة والتواضع";
            default: return "التمسك بالفضائل دائمًا";
        }
    },

    /**
     * إعطاء ملخص أخلاقي شامل.
     * @param {Object} behavior - نفس الكائن المستخدم في assessBehavior
     * @returns {Object} ملخص يحتوي على التقييم الأخلاقي، المقاصدي، والفضيلة الموصى بها
     */
    getEthicalSummary(behavior) {
        const assessment = this.assessBehavior(behavior);
        const recommendedVirtue = this.recommendVirtue(behavior?.context || "تفاعل اجتماعي");

        return {
            ethicalAssessment: assessment,
            recommendedVirtue: recommendedVirtue,
            principlesApplied: this.principles.filter(p => 
                recommendedVirtue.includes(p) || assessment.message.includes(p)
            ),
            decisionRule: this.decisionRules.find(rule => 
                assessment.message.includes(rule.split(" ")[0])
            ) || "درء المفاسد مقدم على جلب المصلحة"
        };
    }
};

export default moralFramework;