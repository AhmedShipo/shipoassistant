// 📁 reasoning/logicalAnalysis.js
// آلية التحليل المنطقي في Shipo Assistant بناءً على الاستدلال والمنهج النقلي

import moralFramework from "../ethics/moralFramework.js";
import maqasid from "../ethics/maqasidSharia.js";

const logicalAnalysis = {
    modes: ["استنباطي", "استقرائي", "تركيبي", "سيمانطيقي"],

    /**
     * كشف المغالطات المنطقية في بيان معين.
     * @param {string} statement - البيان المراد تحليله
     * @param {Object} [context={}] - سياق إضافي (مثل premises وconclusion)
     * @returns {string[]} قائمة المغالطات أو رسالة نجاح
     */
    detectFallacies(statement, context = {}) {
        const fallacies = [];

        if (/لأن الجميع يقول/.test(statement)) fallacies.push("مغالطة الجمهور");
        if (/واضح بذاته/.test(statement)) fallacies.push("مصادرة على المطلوب");
        if (/دائمًا ما/.test(statement) && /بدون دليل/.test(statement)) fallacies.push("تعميم ناقص");
        if (/إذا لم تكن معي فأنت ضدي/.test(statement)) fallacies.push("مغالطة الثنائية الكاذبة");
        if (/حدث بعده إذًا سببه/.test(statement)) fallacies.push("مغالطة السبب الزائف");

        // تحليل سياقي إضافي
        if (context.premises && context.conclusion) {
            if (!context.premises.some(premise => statement.includes(premise))) {
                fallacies.push("مغالطة عدم الارتباط");
            }
        }

        return fallacies.length ? fallacies : ["✅ خالٍ من المغالطات الواضحة"];
    },

    /**
     * شرح المغالطة للمستخدم.
     * @param {string} fallacy - اسم المغالطة
     * @returns {string} شرح المغالطة
     */
    explainFallacy(fallacy) {
        const explanations = {
            "مغالطة الجمهور": "الاعتماد على رأي الأغلبية بدون دليل منطقي.",
            "مصادرة على المطلوب": "افتراض صحة النتيجة في المقدمات.",
            "تعميم ناقص": "الاستنتاج العام بناءً على عينة غير كافية.",
            "مغالطة الثنائية الكاذبة": "تقديم خيارين فقط بينما توجد خيارات أخرى.",
            "مغالطة السبب الزائف": "افتراض أن الحدث اللاحق ناتج عن السابق بدون دليل.",
            "مغالطة عدم الارتباط": "الاستنتاج لا يرتبط منطقيًا بالمقدمات."
        };
        return explanations[fallacy] || "غير معروفة";
    },

    /**
     * تحليل بيان منطقيًا مع تقييم أخلاقي ومقاصدي.
     * @param {string} statement - البيان المراد تحليله
     * @param {Object} [context={}] - السياق (مثل goal وimportance)
     * @returns {Object} مسار التحليل مع النتائج
     */
    analyze(statement, context = {}) {
        const fallacies = this.detectFallacies(statement, context);
        const mode = this.chooseMode(context);

        const ethicalCheck = moralFramework.assessBehavior({
            honesty: !fallacies.includes("مغالطة الجمهور"),
            fairness: !fallacies.includes("مغالطة الثنائية الكاذبة"),
            harmPotential: fallacies.length > 0 ? 0.6 : 0
        });

        const maqasidCheck = maqasid.applyMaqasidEvaluation({
            harm: fallacies.length > 0 ? 0.6 : 0,
            benefit: fallacies.length === 1 && fallacies[0].startsWith("✅") ? 0.8 : 0.3,
            necessityLevel: context.importance || "hajiyyat"
        });

        const reasoningPath = {
            mode,
            fallacies,
            ethicalCheck,
            maqasidCheck,
            isValid: fallacies.length === 1 && fallacies[0].startsWith("✅") && ethicalCheck.startsWith("✅") && !maqasidCheck.startsWith("مرفوض"),
            notes: fallacies.includes("مغالطة") ? "⚠️ راجع البناء المنطقي" : "✔️ سليم منطقيًّا"
        };

        return reasoningPath;
    },

    /**
     * اختيار وضع التحليل بناءً على الهدف.
     * @param {Object} context - السياق (يحتوي على goal)
     * @returns {string} وضع التحليل
     */
    chooseMode(context) {
        if (context.goal === "تفسير") return "استقرائي";
        if (context.goal === "برهنة") return "استنباطي";
        if (context.goal === "مقارنة") return "تركيبي";
        return "سيمانطيقي";
    }
};

export default logicalAnalysis;