// 📁 src/memory/userPreferences.js
// إدارة تفضيلات المستخدم بشكل محسن

const userPreferences = {
    preferences: {
        userName: "أحمد",
        theme: "light",
        language: "ar",
        preferredEmotion: "happy", // المشاعر المفضلة
        memoryRetention: "full", // full, partial, none
        preferredTopics: [], // قائمة المواضيع المفضلة
    },
    cache: null, // لتخزين التفضيلات مؤقتًا

    /**
     * تنظيف المدخلات لمنع مشاكل الأمان.
     * @param {Object} input - المدخل
     * @returns {Object} - المدخل المنظف
     */
    sanitizeInput(input) {
        const sanitized = {};
        for (const [key, value] of Object.entries(input)) {
            if (typeof value === "string") {
                sanitized[key] = value.replace(/<[^>]+>/g, '').trim();
            } else if (Array.isArray(value)) {
                sanitized[key] = value.map(item => typeof item === "string" ? item.replace(/<[^>]+>/g, '').trim() : item);
            } else {
                sanitized[key] = value;
            }
        }
        return sanitized;
    },

    /**
     * تهيئة التفضيلات من localStorage أو القيم الافتراضية.
     */
    initialize() {
        try {
            const savedPreferences = localStorage.getItem("userPreferences");
            if (savedPreferences) {
                const parsed = JSON.parse(savedPreferences);
                this.preferences = { ...this.preferences, ...this.sanitizeInput(parsed) };
            }
            this.cache = { ...this.preferences };
            return { status: "نجاح", message: "تم تهيئة تفضيلات المستخدم بنجاح" };
        } catch (error) {
            console.error("خطأ أثناء تهيئة التفضيلات:", error);
            return { status: "فشل", message: "فشل في تهيئة التفضيلات، سيتم استخدام القيم الافتراضية" };
        }
    },

    /**
     * استرجاع تفضيلات المستخدم.
     * @returns {Object} كائن التفضيلات
     */
    getUserPreferences() {
        if (this.cache) {
            return { ...this.cache };
        }
        this.cache = { ...this.preferences };
        return { ...this.cache };
    },

    /**
     * تحديث تفضيلات المستخدم وحفظها.
     * @param {Object} newPreferences - التفضيلات الجديدة
     * @returns {Object} { status, message } نتيجة التحديث
     */
    updateUserPreferences(newPreferences) {
        if (!newPreferences || typeof newPreferences !== "object") {
            return { status: "فشل", message: "يرجى تقديم تفضيلات صحيحة" };
        }

        try {
            const sanitizedPreferences = this.sanitizeInput(newPreferences);
            this.preferences = { ...this.preferences, ...sanitizedPreferences };
            localStorage.setItem("userPreferences", JSON.stringify(this.preferences));
            this.cache = { ...this.preferences };
            return { status: "نجاح", message: "تم تحديث التفضيلات بنجاح" };
        } catch (error) {
            console.error("خطأ أثناء تحديث التفضيلات:", error);
            return { status: "فشل", message: "فشل في تحديث التفضيلات" };
        }
    },

    /**
     * إعادة تعيين التفضيلات إلى الإعدادات الافتراضية.
     * @returns {Object} { status, message }
     */
    resetUserPreferences() {
        try {
            this.preferences = {
                userName: "أحمد",
                theme: "light",
                language: "ar",
                preferredEmotion: "happy",
                memoryRetention: "full",
                preferredTopics: [],
            };
            localStorage.setItem("userPreferences", JSON.stringify(this.preferences));
            this.cache = { ...this.preferences };
            return { status: "نجاح", message: "تم إعادة تعيين التفضيلات بنجاح" };
        } catch (error) {
            console.error("خطأ أثناء إعادة تعيين التفضيلات:", error);
            return { status: "فشل", message: "فشل في إعادة تعيين التفضيلات" };
        }
    },
};

// تهيئة التفضيلات عند تحميل الملف
userPreferences.initialize();

export default userPreferences;

// تصدير دالة للوصول المباشر إلى التفضيلات
export const getUserPreferences = () => userPreferences.getUserPreferences();