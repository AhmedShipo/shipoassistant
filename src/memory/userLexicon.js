// 📁 src/memory/userLexicon.js
// إدارة المصطلحات والموضوعات التي يستخدمها المستخدم

const userLexicon = {
    terms: new Map(), // مصطلحات المستخدم (كلمة: عدد التكرارات)
    topics: new Map(), // الموضوعات (موضوع: عدد التكرارات)

    /**
     * تهيئة القاموس من التخزين المحلي أو بيانات افتراضية.
     * @returns {Object} { status, message }
     */
    initialize() {
        const savedTerms = localStorage.getItem("userLexiconTerms");
        const savedTopics = localStorage.getItem("userLexiconTopics");
        if (savedTerms) {
            this.terms = new Map(JSON.parse(savedTerms));
        }
        if (savedTopics) {
            this.topics = new Map(JSON.parse(savedTopics));
        }
        return { status: "نجاح", message: "تم تهيئة قاموس المستخدم بنجاح" };
    },

    /**
     * إضافة مصطلح أو تحديث تكراره.
     * @param {string} term - المصطلح
     */
    addTerm(term) {
        if (!term || typeof term !== "string") return;
        const count = this.terms.get(term) || 0;
        this.terms.set(term, count + 1);
        localStorage.setItem("userLexiconTerms", JSON.stringify([...this.terms]));
    },

    /**
     * إضافة موضوع أو تحديث تكراره.
     * @param {string} topic - الموضوع
     */
    addTopic(topic) {
        if (!topic || typeof topic !== "string") return;
        const count = this.topics.get(topic) || 0;
        this.topics.set(topic, count + 1);
        localStorage.setItem("userLexiconTopics", JSON.stringify([...this.topics]));
    },

    /**
     * استرجاع أكثر المصطلحات استخدامًا.
     * @returns {Array} قائمة المصطلحات مرتبة
     */
    getTopTerms(limit = 5) {
        return [...this.terms.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit)
            .map(([term, count]) => ({ term, count }));
    },

    /**
     * استرجاع أكثر الموضوعات استخدامًا.
     * @returns {Array} قائمة الموضوعات مرتبة
     */
    getTopTopics(limit = 5) {
        return [...this.topics.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit)
            .map(([topic, count]) => ({ topic, count }));
    },

    /**
     * مسح القاموس.
     * @returns {Object} { status, message }
     */
    clearLexicon() {
        this.terms.clear();
        this.topics.clear();
        localStorage.removeItem("userLexiconTerms");
        localStorage.removeItem("userLexiconTopics");
        return { status: "نجاح", message: "تم مسح قاموس المستخدم بنجاح" };
    }
};

export default userLexicon;