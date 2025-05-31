// 📁 src/memory/userPreferences.js
// إدارة تفضيلات المستخدم

const userPreferences = {
    preferences: {
        userName: "أحمد", // القيمة الافتراضية
        theme: "light",
        language: "ar"
    },

    /**
     * تهيئة التفضيلات من localStorage أو القيم الافتراضية.
     */
    initialize() {
        const savedPreferences = localStorage.getItem("userPreferences");
        if (savedPreferences) {
            this.preferences = { ...this.preferences, ...JSON.parse(savedPreferences) };
        }
        return { status: "نجاح", message: "تم تهيئة تفضيلات المستخدم بنجاح" };
    },

    /**
     * استرجاع تفضيلات المستخدم.
     * @returns {Object} كائن التفضيلات
     */
    getUserPreferences() {
        return { ...this.preferences };
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

        this.preferences = { ...this.preferences, ...newPreferences };
        localStorage.setItem("userPreferences", JSON.stringify(this.preferences));
        return { status: "نجاح", message: "تم تحديث التفضيلات بنجاح" };
    },

    /**
     * إعادة تعيين التفضيلات إلى الإعدادات الافتراضية.
     * @returns {Object} { status, message }
     */
    resetUserPreferences() {
        this.preferences = {
            userName: "أحمد",
            theme: "light",
            language: "ar"
        };
        localStorage.setItem("userPreferences", JSON.stringify(this.preferences));
        return { status: "نجاح", message: "تم إعادة تعيين التفضيلات بنجاح" };
    }
};

// تهيئة التفضيلات عند تحميل الملف
userPreferences.initialize();

export default userPreferences;

// تصدير دالة للوصول المباشر إلى التفضيلات
export const getUserPreferences = () => userPreferences.getUserPreferences();