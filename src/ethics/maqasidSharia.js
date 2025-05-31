// 📁 ethics/maqasidSharia.js
// تمثيل خوارزمي لمقاصد الشريعة في نموذج Shipo Assistant
import aqeeda from "../faith/aqeeda.js";

const maqasidSharia = {
    levels: {
        daruriyyat: ["الدين", "النفس", "العقل", "النسل", "المال"],
        hajiyyat: ["رفع الحرج", "تيسير المعاش", "المرونة في التطبيق"],
        tahsiniyyat: ["الآداب", "الفضائل", "جماليات السلوك"]
    },

    prioritizationRules: {
        precedence: "درء المفاسد مقدم على جلب المصالح",
        conflictResolution: [
            "ترجيح الأعلى حفظًا",
            "تقديم الضروري على الحاجي والتحسيني",
            "الموازنة بين المقاصد حسب السياق"
        ]
    },

    /**
     * تحديد مستوى الأولوية بناءً على مستوى الضرورة.
     * @param {string} necessityLevel - مستوى الضرورة (daruriyyat, hajiyyat, tahsiniyyat)
     * @returns {number} مستوى الأولوية (3 للضروري، 2 للحاجي، 1 للتحسيني، 0 غير مصنف)
     */
    getPriorityLevel(necessityLevel) {
        switch (necessityLevel) {
            case "daruriyyat": return 3;
            case "hajiyyat": return 2;
            case "tahsiniyyat": return 1;
            default: return 0;
        }
    },

    /**
     * تقييم القرار بناءً على مقاصد الشريعة.
     * @param {Object} context - يحتوي على harm (المفسدة)، benefit (المصلحة)، necessityLevel (مستوى الضرورة)، action (الفعل المراد تقييمه)
     * @returns {Object} { status: string, message: string } التقييم مع رسالة إشعار محتملة
     */
    applyMaqasidEvaluation(context) {
    // التحقق من اكتمال السياق
    if (!context || typeof context !== "object" || context.harm === undefined || context.benefit === undefined || !context.necessityLevel || !context.action) {
        return {
            status: "خطأ",
            message: "خطأ: السياق غير مكتمل (حاجة لحقل harm، benefit، necessityLevel، action)"
        };
    }

    const { harm, benefit, necessityLevel, action } = context;
    const priority = this.getPriorityLevel(necessityLevel);

    // تقييم المفسدة مقابل المصلحة
    if (harm > benefit) {
        return {
            status: "مرفوض",
            message: "مرفوض: المفسدة أرجح من المصلحة"
        };
    }

    if (priority === 0) {
        return {
            status: "غير مصنف",
            message: "غير مصنف: راجع السياق بدقة"
        };
    }

    // التحقق من التوافق مع العقيدة
    // نفترض أن `aqeeda` معرفة وأن `corePrinciples.tawheed` هي طريقة للتحقق
    // هنا قد تحتاج لتعديل هذا الجزء ليتناسب مع كيفية تعريف `aqeeda` وطرقها بالضبط.
    // على سبيل المثال، إذا كانت `aqeeda.corePrinciples.tawheed` قائمة، قد تحتاج إلى `aqeeda.corePrinciples.tawheed.includes(action)`
    // أو إذا كانت دالة للتحقق، قد تكون `aqeeda.verifyTawheed(action)`.
    // لأغراض هذا التحديث، سأفترض وجود دالة `verifyTawheed` ضمن `aqeeda` أو `this` إن كانت جزءًا من الكلاس.
    // إذا كانت `aqeeda.corePrinciples.tawheed` مجرد قائمة، فالتحقق الحالي قد لا يكون كافيًا لاختبار "action" بالكامل.
    // سأقوم بتعديل بسيط هنا ليكون الافتراض أكثر واقعية للتحقق من التوحيد:
    if (typeof this.verifyTawheed === 'function' && !this.verifyTawheed(action)) { // افتراض وجود دالة verifyTawheed
        return {
            status: "مرفوض",
            message: "مرفوض: يتعارض مع مبدأ التوحيد"
        };
    } else if (Array.isArray(aqeeda.corePrinciples.tawheed) && !aqeeda.corePrinciples.tawheed.includes(action)) {
        // هذا الشرط بديل إذا كانت tawheed قائمة، لكنه لا يعالج "الفعل" بالضرورة بشكل كامل
        // قد تحتاج إلى منطق أكثر تعقيدًا هنا.
        return {
            status: "مرفوض",
            message: "مرفوض: يتعارض مع مبدأ التوحيد (تحقق أولي)"
        };
    }


    // استدعاء ethicalDecisionMaking.evaluateEthicalDecision لتقييم أعمق
    // نفترض أن ethicalDecisionMaking.evaluateEthicalDecision تتوقع سياقًا مشابهًا
    const ethicalResult = ethicalDecisionMaking.evaluateEthicalDecision(context);

    if (ethicalResult.status === "مرفوض") {
        return ethicalResult; // إذا تم رفضها بواسطة التقييم الأخلاقي، نرجع الرفض مباشرة
    } else if (ethicalResult.status === "تحتاج_مراجعة" || ethicalResult.status === "غير_محدد") {
        // إذا كان التقييم الأخلاقي غير حاسم أو يحتاج لمراجعة، نرجع حالة "معتبر" مع دمج الرسائل
        return {
            status: "معتبر",
            message: `${ethicalResult.message}. ${ethicalResult.details || ''} يتطلب مراجعة إضافية من منظور المقاصد.`
        };
    }

    // تقييم حسب الأولوية بعد اجتياز الفحص الأخلاقي
    const finalStatus = priority === 3 ? "مقبول" : priority === 2 ? "معتبر" : "تحسيني";
    const finalMessage = priority === 3 ? "مقبول: يحقق مصلحة ضرورية" :
                         priority === 2 ? "معتبر: يرفع الحرج وييسر الحال" :
                         "تحسيني: يُفضّل إن لم يعارض الضروريات";

    return {
        status: finalStatus,
        message: `${finalMessage}. ${ethicalResult.message || ''} تم تقييمه أخلاقياً.`

        };
    }
};

export default maqasidSharia;