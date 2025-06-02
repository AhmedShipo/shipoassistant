// 📁 src/connectivity/transparencyHandler.js
// إدارة الشفافية في الواجهة بشكل محسن

import uiConfig from '../ui/uiConfig.js';

const transparencyHandler = {
    // القيم الافتراضية للشفافية
    defaultTransparency: {
        topBar: 0.8,
        bottomNav: 0.9,
        background: 1.0,
    },

    // التخزين المؤقت للشفافية
    transparencyCache: {},

    /**
     * تهيئة إعدادات الشفافية من uiConfig أو القيم الافتراضية.
     */
    initialize() {
        try {
            const savedTransparency = uiConfig.getConfig('transparency') || this.defaultTransparency;
            this.transparencyCache = { ...this.defaultTransparency, ...savedTransparency };
            this.applyTransparency();
            console.log("تم تهيئة الشفافية بنجاح:", this.transparencyCache);
            return { status: "نجاح", message: "تم تهيئة الشفافية بنجاح" };
        } catch (error) {
            console.error("خطأ أثناء تهيئة الشفافية:", error);
            return { status: "فشل", message: "فشل في تهيئة الشفافية، سيتم استخدام القيم الافتراضية" };
        }
    },

    /**
     * تطبيق الشفافية على العناصر.
     */
    applyTransparency() {
        try {
            Object.entries(this.transparencyCache).forEach(([element, opacity]) => {
                const domElement = document.getElementById(element);
                if (domElement) {
                    domElement.style.opacity = opacity;
                }
            });
        } catch (error) {
            console.error("خطأ أثناء تطبيق الشفافية:", error);
        }
    },

    /**
     * ضبط الشفافية لعنصر معين.
     * @param {string} element - اسم العنصر (topBar, bottomNav, background)
     * @param {number} opacity - قيمة الشفافية (0.0 إلى 1.0)
     * @returns {Object} { status, message } نتيجة العملية
     */
    setTransparency(element, opacity) {
        if (!element || typeof opacity !== "number" || opacity < 0 || opacity > 1) {
            return { status: "فشل", message: "يرجى تقديم عنصر وقيمة شفافية صحيحة (بين 0 و1)" };
        }

        try {
            this.transparencyCache[element] = opacity;
            uiConfig.updateConfig('transparency', this.transparencyCache);
            this.applyTransparency();
            console.log(`تم ضبط الشفافية لـ ${element} إلى ${opacity}`);
            return { status: "نجاح", message: `تم ضبط الشفافية لـ ${element} بنجاح` };
        } catch (error) {
            console.error("خطأ أثناء ضبط الشفافية:", error);
            return { status: "فشل", message: "فشل في ضبط الشفافية" };
        }
    },

    /**
     * استرجاع قيمة الشفافية لعنصر معين.
     * @param {string} element - اسم العنصر
     * @returns {number|null} قيمة الشفافية أو null إذا لم يتم العثور على العنصر
     */
    getTransparency(element) {
        return this.transparencyCache[element] || null;
    },

    /**
     * إعادة تعيين الشفافية إلى القيم الافتراضية.
     * @returns {Object} { status, message }
     */
    resetTransparency() {
        try {
            this.transparencyCache = { ...this.defaultTransparency };
            uiConfig.updateConfig('transparency', this.transparencyCache);
            this.applyTransparency();
            console.log("تم إعادة تعيين الشفافية بنجاح:", this.transparencyCache);
            return { status: "نجاح", message: "تم إعادة تعيين الشفافية بنجاح" };
        } catch (error) {
            console.error("خطأ أثناء إعادة تعيين الشفافية:", error);
            return { status: "فشل", message: "فشل في إعادة تعيين الشفافية" };
        }
    },
};

// تهيئة الشفافية عند تحميل الملف
transparencyHandler.initialize();

export default transparencyHandler;