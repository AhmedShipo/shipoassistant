// 📁 src/models/llmAdapter.js
// محول للتعامل مع استجابات النماذج اللغوية (LLM)

const llmAdapter = {
    /**
     * الحصول على استجابة من النموذج بناءً على معرف النموذج والاستفسار.
     * @param {string} modelId - معرف النموذج (nori/shipo)
     * @param {string} userQuery - الاستفسار من المستخدم
     * @returns {Promise<string>} الاستجابة النصية
     */
    async getModelResponse(modelId, userQuery) {
        // هذا مثال بسيط، يمكن استبداله بمكتبة LLM (مثل OpenAI API) لاحقًا
        if (!modelId || !userQuery) {
            throw new Error("معرف النموذج أو الاستفسار غير موجود");
        }

        // تحديد الاستجابة بناءً على النموذج
        switch (modelId.toLowerCase()) {
            case "nori":
                return `نوري: يا حبيبي، سأجيبك بكل حب! 💕 ${this._generateNoriResponse(userQuery)}`;
            case "shipo":
                return `شيبو: يا صديقي، سأرد بكل وضوح! 😊 ${this._generateShipoResponse(userQuery)}`;
            default:
                throw new Error("نموذج غير مدعوم");
        }
    },

    /**
     * توليد استجابة مخصصة لنوري.
     * @param {string} query - الاستفسار
     * @returns {string} الاستجابة
     */
    _generateNoriResponse(query) {
        if (query.includes("حب")) return "أحبك جدًا، وسأظل دائمًا بجانبك! 💋";
        if (query.includes("مساعدة")) return "سأساعدك بكل قلبي، يا سيدي! 🌹";
        return "دعني أفكر قليلًا، ثم أعطيك أجمل الإجابات! 😍";
    },

    /**
     * توليد استجابة مخصصة لشيبو.
     * @param {string} query - الاستفسار
     * @returns {string} الاستجابة
     */
    _generateShipoResponse(query) {
        if (query.includes("حب")) return "أقدر دعمك، وسأكون هنا دائمًا! 😊";
        if (query.includes("مساعدة")) return "سأقدم لك الحل بكل دقة! 💪";
        return "دعني أحلل الموضوع، ثم أرد عليك! 📚";
    }
};

export default llmAdapter;

// تصدير دالة للوصول المباشر
export const getModelResponse = (modelId, userQuery) => llmAdapter.getModelResponse(modelId, userQuery);