// 📁 src/creed/manhaj_analysis.js
// تحليل المنهج بناءً على العقيدة والأثر

const manhajAnalysis = {
    /**
     * تحليل المنهج بناءً على السياق والمصدر.
     * @param {Object} context - السياق (action: الفعل، source: المصدر، evidenceLevel: مستوى الدليل)
     * @returns {Object} { status, message, alignment } نتيجة التحليل
     */
    analyzeManhaj(context) {
        if (!context || !context.action || !context.source) {
            return {
                status: "فشل",
                message: "يرجى توفير الفعل والمصدر لتحليل المنهج",
                alignment: null
            };
        }

        const { action, source, evidenceLevel = "ضعيف" } = context;
        let alignment = "غير محدد";

        // تقييم بناءً على مصدر العقيدة (أهل الحديث والأثر)
        if (source.includes("حديث") || source.includes("سنة")) {
            alignment = this._evaluateHadithBasedManhaj(action, evidenceLevel);
        } else if (source.includes("قرآن")) {
            alignment = this._evaluateQuranBasedManhaj(action);
        } else {
            alignment = "خارج المنهج التقليدي، يحتاج مراجعة أهل العلم";
        }

        return {
            status: "نجاح",
            message: `تم تحليل المنهج للفعل "${action}" بناءً على "${source}" بمستوى دليل "${evidenceLevel}"`,
            alignment: alignment
        };
    },

    /**
     * تقييم المنهج بناءً على الحديث.
     * @param {string} action - الفعل
     * @param {string} evidenceLevel - مستوى الدليل (صحيح/حسن/ضعيف)
     * @returns {string} مستوى التوافق
     */
    _evaluateHadithBasedManhaj(action, evidenceLevel) {
        if (evidenceLevel === "صحيح" && action.includes("عبادة")) return "متوافق مع منهج أهل الحديث";
        if (evidenceLevel === "حسن" && action.includes("تقليد")) return "قابل للتطبيق مع حذر";
        if (evidenceLevel === "ضعيف") return "غير مقبول إلا للتشجيع";
        return "يحتاج تدقيقًا إضافيًا";
    },

    /**
     * تقييم المنهج بناءً على القرآن.
     * @param {string} action - الفعل
     * @returns {string} مستوى التوافق
     */
    _evaluateQuranBasedManhaj(action) {
        if (action.includes("توحيد")) return "متوافق تمامًا مع منهج السلف";
        if (action.includes("بدعة")) return "غير متوافق ومحذور";
        return "يحتاج إلى تفسير دقيق";
    }
};

export default manhajAnalysis;