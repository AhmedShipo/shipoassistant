// 📁 src/ethics/ethicalDecisionMaking.js
// اتخاذ القرارات الأخلاقية بناءً على المقاصد والإطار الأخلاقي

const ethicalDecisionMaking = {
    /**
     * تقييم الفعل بناءً على المبادئ الأخلاقية والمقاصد الشرعية.
     * @param {Object} context - السياق (action: الفعل، intent: النية، impact: الأثر)
     * @returns {Object} { status, message, decision } نتيجة القرار
     */
    evaluateEthicalDecision(context) {
        if (!context || !context.action || !context.intent || !context.impact) {
            return {
                status: "فشل",
                message: "السياق غير مكتمل (مطلوب: action، intent، impact)",
                decision: null
            };
        }

        const { action, intent, impact } = context;
        let decision = "غير محدد";

        // تقييم النية (الإخلاص لله)
        const intentAnalysis = this._evaluateIntent(intent);
        if (intentAnalysis !== "مقبول") {
            return {
                status: "مرفوض",
                message: `النية "${intent}" غير مقبولة أخلاقيًا: ${intentAnalysis}`,
                decision: "محظور"
            };
        }

        // تقييم الأثر بناءً على المقاصد الشرعية
        const impactAnalysis = this._evaluateImpact(impact);
        if (impactAnalysis === "ضار") {
            return {
                status: "مرفوض",
                message: `الأثر "${impact}" يتعارض مع المقاصد الشرعية`,
                decision: "محظور"
            };
        }

        // تقييم الفعل نفسه
        decision = this._evaluateAction(action, impact);
        return {
            status: "نجاح",
            message: `تم تقييم الفعل "${action}" بناءً على النية "${intent}" والأثر "${impact}"`,
            decision: decision
        };
    },

    /**
     * تقييم النية بناءً على الإخلاص.
     * @param {string} intent - النية
     * @returns {string} نتيجة التقييم
     */
    _evaluateIntent(intent) {
        if (intent.includes("إخلاص") || intent.includes("لله")) {
            return "مقبول";
        }
        if (intent.includes("رياء") || intent.includes("شهرة")) {
            return "مرفوض بسبب الرياء";
        }
        return "غير واضح، يحتاج إلى توضيح";
    },

    /**
     * تقييم الأثر بناءً على المقاصد الشرعية.
     * @param {string} impact - الأثر
     * @returns {string} نتيجة التقييم
     */
    _evaluateImpact(impact) {
        if (impact.includes("ضرر") || impact.includes("فساد")) {
            return "ضار";
        }
        if (impact.includes("مصلحة") || impact.includes("خير")) {
            return "نافع";
        }
        return "محايد";
    },

    /**
     * تقييم الفعل بناءً على الأثر.
     * @param {string} action - الفعل
     * @param {string} impact - الأثر
     * @returns {string} القرار الأخلاقي
     */
    _evaluateAction(action, impact) {
        if (action.includes("حرام") || action.includes("ظلم")) {
            return "محظور";
        }
        if (action.includes("واجب") || action.includes("عدل") || impact.includes("مصلحة")) {
            return "مطلوب";
        }
        if (action.includes("مباح")) {
            return "جائز";
        }
        return "يحتاج إلى تقييم إضافي";
    }
};

export default ethicalDecisionMaking;