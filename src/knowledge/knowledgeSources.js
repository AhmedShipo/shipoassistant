// 📁 knowledge/knowledgeSources.js
// مصادر المعرفة المعتمدة في Shipo Assistant
import maqasidSharia from "../ethics/maqasidSharia.js";
import moralFramework from "../ethics/moralFramework.js";

/**
 * مصادر المعرفة المعتمدة في Shipo Assistant.
 * @type {Array<Object>} مصفوفة تحتوي على كائنات المصادر مع تفاصيلها
 */
const knowledgeSources = [
  {
    name: "المكتبة الشاملة",
    type: "نصوص تراثية شرعية",
    url: "https://shamela.ws",
    reliability: 1.0,
    notes: "مصدر مرجعي أساسي للفقه والعقيدة واللغة والتاريخ"
  },
  {
    name: "ويكيبيديا (نسخة محددة)",
    type: "موسوعة معرفية معاصرة",
    api: "Wikipedia API",
    reliability: 0.7,
    filters: ["المصطلحات الشرعية", "المفاهيم الثقافية"]
  },
  {
    name: "قاعدة البيانات الشخصية",
    type: "ذاكرة مخصصة يتم بناؤها عبر الاستخدام",
    reliability: 0.9,
    dynamic: true,
    updatePolicy: "إشراف المستخدم أو أدوات الفحص الشرعي",
    data: [] // لتخزين البيانات الجديدة
  },
  {
    name: "ملفات المستخدم",
    type: "مصادر إدخال مباشرة من الجهاز",
    reliability: 0.8,
    formatSupport: [".txt", ".pdf", ".json"]
  }
].filter(source => {
    const context = { harm: 0, benefit: source.reliability, necessityLevel: "hajiyyat", action: source.name };
    const maqasidEval = maqasidSharia.applyMaqasidEvaluation(context);
    if (maqasidEval.status !== "معتبر") return false;

    const moralEval = moralFramework.assessBehavior({
        honesty: true,
        fairness: true,
        harmPotential: 1 - source.reliability,
        necessityLevel: "hajiyyat",
        action: source.name
    });
    return moralEval.status === "مقبول";
});

/**
 * التحقق من صلاحية مصدر معين.
 * @param {Object} source - كائن المصدر
 * @returns {boolean} صحة المصدر
 */
const validateSource = (source) => {
    if (!source || typeof source !== "object") return false;
    const context = { harm: 0, benefit: source.reliability || 0, necessityLevel: "hajiyyat", action: source.name };
    const maqasidEval = maqasidSharia.applyMaqasidEvaluation(context);
    if (maqasidEval.status !== "معتبر") return false;

    const moralEval = moralFramework.assessBehavior({
        honesty: true,
        fairness: true,
        harmPotential: 1 - (source.reliability || 0),
        necessityLevel: "hajiyyat",
        action: source.name
    });
    return moralEval.status === "مقبول";
};

/**
 * استرجاع مصدر معرفة بناءً على نوعه.
 * @param {string} type - نوع المصدر
 * @returns {Object|null} المصدر إن وجد، أو null
 */
const getSourceByType = (type) => {
    return knowledgeSources.find(source => source.type === type) || null;
};

/**
 * تحديث قاعدة البيانات الشخصية بدليل جديد.
 * @param {any} newData - البيانات الجديدة
 * @param {string} [fileFormat] - تنسيق الملف (اختياري)
 * @returns {Object} { status, message } حالة التحديث ورسالة
 */
const updatePersonalDatabase = (newData, fileFormat) => {
    const source = knowledgeSources.find(s => s.name === "قاعدة البيانات الشخصية");
    if (!source) {
        return { status: "فشل", message: "قاعدة البيانات الشخصية غير موجودة" };
    }

    // التحقق من التنسيق إن كان موجود
    if (fileFormat && !source.formatSupport.includes(fileFormat)) {
        return { status: "فشل", message: `التنسيق ${fileFormat} غير مدعوم (التنسيقات المدعومة: ${source.formatSupport.join(", ")})` };
    }

    source.data = [...(source.data || []), newData];
    return { status: "نجاح", message: "تم التحديث بنجاح" };
};

export { knowledgeSources, getSourceByType, updatePersonalDatabase, validateSource };