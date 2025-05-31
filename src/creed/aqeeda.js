// 📁 src/creed/aqeeda.js
// الأسس العقائدية بناءً على منهج أهل السنة والجماعة (أهل الحديث والأثر)

import manhajAnalysis from './manhaj_analysis.js';

const aqeeda = {
    corePrinciples: {
        methodology: "Ahl al-Sunnah wal-Jama'ah",
        pillarsOfFaith: {
            tawheed: {
                description: "الإيمان بالله الواحد الأحد، لا شريك له، الإيمان بأسمائه وصفاته كما وردت في الكتاب والسنة من غير تعطيل ولا تمثيل",
                evidence: ["قُلْ هُوَ اللَّهُ أَحَدٌ (سورة الإخلاص: 1)", "لَيْسَ كَمِثْلِهِ شَيْءٌ (سورة الشورى: 11)"]
            },
            angels: {
                description: "الإيمان بالملائكة كخلق من خلق الله، يطيعونه ويعملون بأمره",
                evidence: ["الَّذِينَ يَحْمِلُونَ الْعَرْشَ وَمَنْ حَوْلَهُ (سورة غافر: 7)", "حديث جبريل عن الإيمان"]
            },
            books: {
                description: "الإيمان بجميع الكتب السماوية التي أنزلها الله، منها التوراة، الإنجيل، الزبور، والقرآن",
                evidence: ["نَزَّلَ عَلَيْكَ الْكِتَابَ بِالْحَقِّ (سورة آل عمران: 3)"]
            },
            messengers: {
                description: "الإيمان بجميع الرسل والأنبياء، وخاتمتهم محمد صلى الله عليه وسلم",
                evidence: ["رُسُلاً مُّبَشِّرِينَ وَمُنذِرِينَ (سورة البقرة: 213)", "حديث: 'أنا خاتم النبيين'"]
            },
            dayOfJudgment: {
                description: "الإيمان باليوم الآخر، بالبعث والنشور، الحساب، الجنة، والنار",
                evidence: ["كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ (سورة آل عمران: 185)", "حديث الإسراء والمعراج"]
            },
            divineDecree: {
                description: "الإيمان بالقدر خيره وشره، ما شاء الله كان وما لم يشأ لم يكن",
                evidence: ["إِنَّا كُلَّ شَيْءٍ خَلَقْنَاهُ بِقَدَرٍ (سورة القمر: 49)", "حديث جبريل"]
            }
        },
        sources: {
            primary: ["القرآن الكريم", "السنة الصحيحة", "إجماع الصحابة"],
            secondary: ["أقوال السلف الصالح", "كتب المتقدمين مثل السنة لابن أبي عاصم"]
        },
        attributesOfAllah: {
            affirmation: "الإيمان بصفات الله كما وردت في النصوص، من غير تحريف ولا تعطيل ولا تكييف ولا تمثيل",
            examples: ["اليد", "العين", "الوجه"] // كما وردت في القرآن والسنة
        }
    },

    /**
     * التحقق من التوافق مع مبدأ التوحيد بناءً على أصول أهل السنة.
     * @param {string} action - الفعل المراد تقييمه
     * @returns {Object} { status, message } نتيجة التحقق
     */
    verifyTawheed(action) {
        if (!action || typeof action !== "string") {
            return { status: "خطأ", message: "الفعل غير صحيح أو مفقود" };
        }

        const violations = ["شرك", "كفر", "بدعة", "طعن في السنة", "تكذيب بالنصوص"];
        const violatesTawheed = violations.some(violation => action.toLowerCase().includes(violation));
        if (violatesTawheed) {
            return { status: "مرفوض", message: `الفعل "${action}" يتعارض مع التوحيد بناءً على أصول أهل السنة` };
        }

        // التحقق من التوافق مع النصوص
        const alignsWithTawheed = this.corePrinciples.pillarsOfFaith.tawheed.evidence.some(evidence => action.toLowerCase().includes(evidence.split(" ")[0]));
        return {
            status: alignsWithTawheed ? "مقبول" : "معتبر",
            message: alignsWithTawheed ? "الفعل متوافق مع التوحيد بناءً على النصوص" : "الفعل لا يتعارض مع التوحيد ولكنه غير مدعوم بنص صريح"
        };
    },

    /**
     * تقييم الفعل بناءً على المصادر العقائدية وأركان الإيمان مع تحليل المنهج.
     * @param {Object} context - السياق (action, source, beliefContext, evidenceLevel)
     * @returns {Object} { status, message } نتيجة التقييم
     */
evaluateAction(context) {
    if (!context || !context.action || !context.source || !context.beliefContext) {
        return { status: "خطأ", message: "السياق غير مكتمل (مطلوب: action، source، beliefContext)" };
    }

    const { action, source, beliefContext, evidenceLevel = "ضعيف" } = context;

    // التحقق من المصدر
    if (!this.corePrinciples.sources.primary.includes(source) && !this.corePrinciples.sources.secondary.includes(source)) {
        return { status: "مرفوض", message: `المصدر "${source}" غير معتمد في منهج أهل السنة` };
    }

    // التحقق من التوحيد
    const tawheedCheck = this.verifyTawheed(action);
    if (tawheedCheck.status === "مرفوض") return tawheedCheck;

    // تحليل المنهج باستخدام manhajAnalysis
    const manhajResult = manhajAnalysis.analyzeManhaj({ action, source, evidenceLevel });
    if (manhajResult.status === "فشل" || manhajResult.alignment === "غير محدد") {
        return { status: "معتبر", message: `${manhajResult.message}, يحتاج إلى مراجعة إضافية` };
    }

    // تحليل نصي إضافي باستخدام scripturalLogic
    // نفترض أن scripturalLogic.analyzeScripturalLogic تتوقع النص كأحد المدخلات
    const scripturalLogicResult = scripturalLogic.analyzeScripturalLogic({ action, source, beliefContext, evidenceLevel });

    if (scripturalLogicResult.status === "مرفوض") {
        return scripturalLogicResult; // إذا تم رفضها بناءً على التحليل النصي، نرجع الرفض مباشرة
    } else if (scripturalLogicResult.status === "تحتاج_مراجعة") {
        return { status: "معتبر", message: `${scripturalLogicResult.message}, ${manhajResult.message}, يحتاج إلى مراجعة إضافية` };
    }

    // التحقق من التوافق مع أركان الإيمان
    const beliefCheck = Object.entries(this.corePrinciples.pillarsOfFaith).some(([key, value]) => {
        return beliefContext[key] && value.evidence.some(ev => action.toLowerCase().includes(ev.split(" ")[0]));
    });

    if (!beliefCheck) {
        return { status: "معتبر", message: `${manhajResult.message}, الفعل لا يتعارض مع العقيدة ولكن يحتاج تأكيدًا إضافيًا` };
    }

    return {
        status: "مقبول",
        message: `${manhajResult.message}, ${scripturalLogicResult.message || ''} الفعل متوافق مع عقيدة أهل السنة والجماعة بناءً على المصادر`
    };
    /**
     * استخراج دليل عقائدي بناءً على السياق.
     * @param {string} context - السياق أو الموضوع
     * @returns {Object} { status, evidence } دليل عقائدي إن وجد
     */
    getDoctrinalEvidence(context) {
        if (!context || typeof context !== "string") {
            return { status: "خطأ", evidence: null };
        }

        const matchingPillar = Object.entries(this.corePrinciples.pillarsOfFaith).find(([_, value]) =>
            value.evidence.some(ev => context.toLowerCase().includes(ev.split(" ")[0]))
        );
        if (matchingPillar) {
            return { status: "نجاح", evidence: matchingPillar[1].evidence };
        }
        return { status: "فشل", evidence: ["لا يوجد دليل صريح"] };
    }
};

export default aqeeda;