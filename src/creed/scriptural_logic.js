// 📁 src/creed/scriptural_logic.js
// المنطق النصي بناءً على القرآن والسنة لدعم التحليل العقائدي

const scripturalLogic = {
    /**
     * تحليل المنطق النصي بناءً على القرآن والسنة.
     * @param {Object} context - السياق (action: الفعل، source: المصدر، beliefContext: سياق الإيمان)
     * @returns {Object} { status, message, logicOutcome } نتيجة التحليل
     */
    analyzeScripturalLogic(context) {
        if (!context || !context.action || !context.source || !context.beliefContext) {
            return {
                status: "فشل",
                message: "السياق غير مكتمل (مطلوب: action، source، beliefContext)",
                logicOutcome: null
            };
        }

        const { action, source, beliefContext } = context;
        let logicOutcome = "غير محدد";

        // تحليل المصدر (القرآن أو السنة)
        if (source === "القرآن الكريم") {
            logicOutcome = this._analyzeQuranLogic(action, beliefContext);
        } else if (source === "السنة الصحيحة") {
            logicOutcome = this._analyzeSunnahLogic(action, beliefContext);
        } else {
            return {
                status: "مرفوض",
                message: `المصدر "${source}" غير مدعوم للتحليل النصي`,
                logicOutcome: "غير متوافق"
            };
        }

        return {
            status: "نجاح",
            message: `تم تحليل المنطق النصي للفعل "${action}" بناءً على "${source}"`,
            logicOutcome: logicOutcome
        };
    },

    /**
     * تحليل المنطق بناءً على القرآن.
     * @param {string} action - الفعل
     * @param {Object} beliefContext - سياق الإيمان
     * @returns {string} نتيجة التحليل
     */
    _analyzeQuranLogic(action, beliefContext) {
        if (beliefContext.tawheed && action.includes("توحيد")) {
            return "الفعل متوافق مع القرآن ويعزز التوحيد";
        }
        if (action.includes("شرك") || action.includes("بدعة")) {
            return "الفعل يناقض القرآن ويؤدي إلى الشرك أو البدعة";
        }
        if (beliefContext.dayOfJudgment && action.includes("إيمان بالبعث")) {
            return "الفعل متوافق مع القرآن ويعزز الإيمان باليوم الآخر";
        }
        return "الفعل لا يتعارض مع القرآن ولكن يحتاج إلى دليل إضافي";
    },

    /**
     * تحليل المنطق بناءً على السنة.
     * @param {string} action - الفعل
     * @param {Object} beliefContext - سياق الإيمان
     * @returns {string} نتيجة التحليل
     */
    _analyzeSunnahLogic(action, beliefContext) {
        if (beliefContext.messengers && action.includes("اتباع الرسول")) {
            return "الفعل متوافق مع السنة ويعزز اتباع الرسول";
        }
        if (action.includes("بدعة")) {
            return "الفعل يناقض السنة ويؤدي إلى البدعة";
        }
        if (beliefContext.divineDecree && action.includes("الإيمان بالقدر")) {
            return "الفعل متوافق مع السنة ويعزز الإيمان بالقدر";
        }
        return "الفعل لا يتعارض مع السنة ولكن يحتاج إلى تدقيق إضافي";
    }
};

export default scripturalLogic;