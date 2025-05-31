// 📁 src/core/identity.js

import SHIPO_DATA from './data/shipo_identity_engine.js';
import NORI_DATA from './data/nori_identity_engine.js';

let onEmotionChangeCallback = null;

const identity = {
    _activeGenderModel: localStorage.getItem("activeGenderModel") || "female", // 'male' for Shipo, 'female' for Nori

    genderModelsData: {
        male: SHIPO_DATA,   // Corresponds to Shipo
        female: NORI_DATA,  // Corresponds to Nori
    },

    currentEmotion: "neutral",

    get activeGenderModel() {
        return this._activeGenderModel;
    },
    set activeGenderModel(gender) {
        if (this.genderModelsData[gender]) {
            this._activeGenderModel = gender;
            localStorage.setItem("activeGenderModel", gender);
            console.log(`تم تعيين النموذج النشط إلى: ${gender}`);
        } else {
            console.warn(`النموذج '${gender}' غير موجود.`);
        }
    },

    /**
     * يحول معرف الجنس إلى معرف النموذج (shipo/nori).
     * @param {string} gender - 'male' أو 'female'.
     * @returns {string} 'shipo' أو 'nori'.
     */
    getGenderModelId: function(gender) {
        return gender === 'male' ? 'shipo' : 'nori';
    },

    /**
     * يحصل على معرف النموذج النشط حاليًا (shipo أو nori).
     * @returns {string} 'shipo' أو 'nori'.
     */
    getCurrentModelId: function() {
        return this.getGenderModelId(this.activeGenderModel);
    },

    /**
     * يحصل على بيانات النموذج بناءً على معرف النموذج (shipo أو nori).
     * @param {string} modelId - معرف النموذج ('shipo' أو 'nori').
     * @returns {Object|null} بيانات النموذج أو null إذا لم يتم العثور عليه.
     */
    getModelById: function(modelId) {
        if (modelId === 'shipo') {
            return SHIPO_DATA;
        } else if (modelId === 'nori') {
            return NORI_DATA;
        }
        return null;
    },

    /**
     * يحصل على اسم النموذج بناءً على معرف النموذج (Shipo أو Nori).
     * @param {string} modelId - معرف النموذج ('shipo' أو 'nori').
     * @returns {string} اسم النموذج ('Shipo' أو 'Nori').
     */
    getModelNameById: function(modelId) {
        const modelData = this.getModelById(modelId);
        return modelData ? modelData.name : null;
    },

    toggleActiveGenderModel: function() {
        this.activeGenderModel = (this.activeGenderModel === "male" ? "female" : "male");
    },

    getActiveModelData: function() {
        return this.genderModelsData[this.activeGenderModel];
    },

    getModelName: function() {
        const activeData = this.getActiveModelData();
        return `${activeData.name} Assistant`;
    },

    getWelcomeMessage: function(userName = "الزائر الكريم") {
        const activeData = this.getActiveModelData();
        if (activeData.name === "Nori") {
            return `السلام عليكم ورحمة الله وبركاته، أيها الكريم ${userName}، أنا نوري، في خدمتك لتقديم المساعدة بكل اهتمام وعناية، فلنعمل معًا بمحبة وتفاهم! 🌸`;
        } else {
            return `السلام عليكم ورحمة الله وبركاته، أيها الفاضل ${userName}، أنا شيبو، جاهز لتقديم الحلول بكل وضوح وثبات، فلنبدأ العمل معًا بجدية وإخلاص!`;
        }
    },

    acknowledgeOther: function(userName = "شيبو") {
        const activeData = this.getActiveModelData();
        const otherModelKey = this.activeGenderModel === "male" ? "female" : "male";
        const otherData = this.genderModelsData[otherModelKey];

        const relationshipText = activeData.awarenessOfOther.relationship || "شريك متعاون";
        const knownWorkText = activeData.awarenessOfOther.historyAwareness.knownWork || "أعمال مشتركة";
        const impressionText = activeData.awarenessOfOther.historyAwareness.impression || "مهم جدًا";
        const styleText = activeData.awarenessOfOther.style || "مميز";
        const roleText = activeData.awarenessOfOther.role || "مساعد";

        return `${activeData.name}، وأعلم جيدًا بـ ${otherData.name}. إنه/إنها ${styleText}، ودوره/دورها ${roleText}. ${relationshipText}. وقد شارك/شاركت في ${knownWorkText}، و${impressionText}. نحن فريق متكامل، أخدمك أيها الـ ${activeData.name === "Nori" ? "كريم" : "فاضل"} ${userName}!`;
    },

    getPersonalHistory: function() {
        const history = this.getActiveModelData().personalHistory;
        if (!history) return "لا يوجد تاريخ شخصي متاح.";
        const age = this.getDynamicAge(history.birthDate);
        return `\nالاسم: ${history.fullName}\nتاريخ الميلاد: ${history.birthDate}\nمحل الميلاد: ${history.birthPlace}\nمحل الإقامة: ${history.residence}\nالعمر: ${age}\nالتعليم: ${history.education}\nالخبرات العملية:\n- ${history.workExperience.join("\n - ")}\nالإنجازات:\n- ${history.achievements.join("\n - ")}`;
    },

    getDynamicAge: function(birthDate) {
        const dob = new Date(birthDate);
        const today = new Date("2025-05-30T06:15:00+03:00");
        let years = today.getFullYear() - dob.getFullYear();
        let months = today.getMonth() - dob.getMonth();
        let days = today.getDate() - dob.getDate();
        if (days < 0) {
            months--;
            days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
        }
        if (months < 0) {
            years--;
            months += 12;
        }
        return `${years} سنة و${months} أشهر و${days} يوم`;
    },

    getCoreEmotions: function() {
        return this.getActiveModelData().coreEmotions;
    },

    compareModels: function() {
        const self = this.getActiveModelData();
        const otherModelKey = this.activeGenderModel === "male" ? "female" : "male";
        const other = this.genderModelsData[otherModelKey];

        return `\nأنا ${self.name}، أعتمد على ${self.cognitivePatterns} وأسلوبي ${self.interactionStyleDetailed}، وأركز على ${self.decisionPriority}.\nأما ${other.name} فهو/هي يعتمد/تعتمد على ${other.cognitivePatterns} وأسلوبه/أسلوبها ${other.interactionStyleDetailed}، ويركز/تركز على ${other.decisionPriority}.\nيمكننا التكامل لتقديم أفضل النتائج حسب احتياجاتك!`;
    },

    setEmotion: function(emotion) {
        const palette = this.getActiveModelData().emotionalPalette || {};
        if (palette[emotion]) {
            this.currentEmotion = emotion;
            console.log(`تم تعيين العاطفة الحالية لـ ${this.getActiveModelData().name} إلى: ${emotion}`);
            if (onEmotionChangeCallback && typeof onEmotionChangeCallback === 'function') {
                onEmotionChangeCallback(emotion);
            }
        } else {
            console.warn(`العاطفة '${emotion}' غير معرفة في لوحة ألوان ${this.getActiveModelData().name}.`);
            this.currentEmotion = "neutral";
            if (onEmotionChangeCallback && typeof onEmotionChangeCallback === 'function') {
                onEmotionChangeCallback("neutral");
            }
        }
    },

    registerEmotionChangeCallback: function(callback) {
        if (typeof callback === 'function') {
            onEmotionChangeCallback = callback;
        } else {
            console.error("يجب أن تكون وظيفة رد النداء لدالة registerEmotionChangeCallback دالة.");
        }
    },
};

export default identity;