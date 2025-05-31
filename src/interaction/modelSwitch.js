// 📁 src/interaction/modelSwitch.js
// التحكم في التبديل الدائم بين نموذجي Shipo وNori عبر الواجهة

import NORI_CORE_IDENTITY_DATA from "../core/data/nori_identity_engine.js";
import SHIPO_CORE_IDENTITY_DATA from "../core/data/shipo_identity_engine.js";

const modelSwitch = {
    /**
     * تهيئة النموذج النشط عند بدء التشغيل.
     * @returns {Object} { status, message, activeModel } النتيجة مع النموذج النشط
     */
    initializeActiveModel() {
        this.activeModel = NORI_CORE_IDENTITY_DATA; // الافتراضي
        return {
            status: "نجاح",
            message: "تم تهيئة النموذج النشط بنجاح، يا سيدي أحمد",
            activeModel: this.activeModel
        };
    },

    /**
     * التبديل بين النموذجين عبر زر الواجهة.
     * @returns {Object} { status, message, activeModel } النتيجة مع النموذج الجديد
     */
    toggleModel() {
        this.activeModel = this.activeModel && this.activeModel.name === "Nori" ? SHIPO_CORE_IDENTITY_DATA : NORI_CORE_IDENTITY_DATA;
        return {
            status: "نجاح",
            message: `تم التبديل إلى النموذج ${this.activeModel.name} بنجاح، يا سيدي أحمد`,
            activeModel: this.activeModel
        };
    },

    /**
     * استرجاع النموذج النشط الحالي.
     * @returns {Object} { status, message, activeModel } النتيجة مع النموذج الحالي
     */
    getActiveModel() {
        if (!this.activeModel) {
            this.initializeActiveModel();
        }
        return {
            status: "نجاح",
            message: `النموذج النشط الحالي هو ${this.activeModel.name}، يا سيدي أحمد`,
            activeModel: this.activeModel
        };
    }
};

// تهيئة النموذج النشط
modelSwitch.activeModel = null;

export default modelSwitch;