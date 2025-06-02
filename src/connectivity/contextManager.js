// 📁 src/connectivity/contextManager.js
// إدارة سياق المحادثة لضمان استمرارية التفاعل بشكل شامل ومرن مع أرشفة وأداء محسن

import { conversationHistory } from '../memory/conversationHistory.js';

const contextManager = {
    // فهارس لتحسين الأداء
    dateIndex: new Map(), // فهرسة حسب التاريخ
    keywordIndex: new Map(), // فهرسة حسب الكلمات المفتاحية

    /**
     * بناء الفهارس لتحسين الأداء.
     * @param {Array} messages - مصفوفة الرسائل
     */
    buildIndexes(messages) {
        this.dateIndex.clear();
        this.keywordIndex.clear();

        messages.forEach((msg, idx) => {
            // فهرسة حسب التاريخ
            const date = new Date(msg.timestamp).toDateString();
            if (!this.dateIndex.has(date)) {
                this.dateIndex.set(date, []);
            }
            this.dateIndex.get(date).push(idx);

            // فهرسة حسب الكلمات المفتاحية
            const words = msg.text.toLowerCase().split(/\s+/);
            words.forEach(word => {
                if (word.length > 2) { // تجاهل الكلمات القصيرة جدًا
                    if (!this.keywordIndex.has(word)) {
                        this.keywordIndex.set(word, []);
                    }
                    this.keywordIndex.get(word).push(idx);
                }
            });
        });
    },

    /**
     * إضافة رسالة جديدة إلى السياق وتخزينها في conversationHistory.
     * @param {Object} message - كائن الرسالة (text, isUser, modelName, emotion)
     */
    async addToContext(message) {
        if (!message || !message.text) {
            console.warn("لا يمكن إضافة رسالة فارغة إلى السياق.");
            return;
        }

        const contextMessage = {
            text: message.text,
            isUser: message.isUser || false,
            modelName: message.modelName || null,
            emotion: message.emotion || 'neutral',
            timestamp: new Date().toISOString(),
            topic: this.detectTopic(message.text), // تحديد الموضوع
        };

        try {
            const currentHistory = await conversationHistory.getCurrentConversation() || { messages: [] };
            currentHistory.messages.push(contextMessage);
            await conversationHistory.saveCurrentConversation(currentHistory);
            this.buildIndexes(currentHistory.messages); // إعادة بناء الفهارس
            console.log(`تم إضافة رسالة إلى السياق: ${contextMessage.text}`);
        } catch (error) {
            console.error("خطأ أثناء حفظ الرسالة في السياق:", error);
        }
    },

    /**
     * تحديد موضوع الرسالة بناءً على الكلمات المفتاحية.
     * @param {string} text - نص الرسالة
     * @returns {string} - الموضوع المكتشف
     */
    detectTopic(text) {
        const topics = {
            "برمجة": ["كود", "ملف", "تطبيق", "برنامج"],
            "مشاعر": ["حب", "شوق", "حزين", "سعيد"],
            "دعم فني": ["مشكلة", "خطأ", "حل", "مساعدة"],
        };

        text = text.toLowerCase();
        for (const [topic, keywords] of Object.entries(topics)) {
            if (keywords.some(keyword => text.includes(keyword))) {
                return topic;
            }
        }
        return "عام";
    },

    /**
     * بناء السياق مع خيارات تصفية.
     * @param {Object} options - خيارات التصفية (filterByDate, filterByKeywords, filterByTopic)
     * @returns {Object} - كائن يحتوي على السياق المبني
     */
    async buildContext(options = {}) {
        try {
            const { filterByDate, filterByKeywords, filterByTopic } = options;
            const savedHistory = await conversationHistory.getCurrentConversation() || { messages: [] };
            this.buildIndexes(savedHistory.messages); // بناء الفهارس

            let filteredMessages = [...savedHistory.messages];
            let indices = new Set([...Array(savedHistory.messages.length).keys()]); // كل الفهارس

            // تصفية حسب التاريخ باستخدام الفهرس
            if (filterByDate) {
                const date = new Date(filterByDate);
                if (!isNaN(date.getTime())) {
                    const dateStr = date.toDateString();
                    indices = new Set(this.dateIndex.get(dateStr) || []);
                    filteredMessages = [...indices].map(idx => savedHistory.messages[idx]);
                }
            }

            // تصفية حسب الكلمات المفتاحية باستخدام الفهرس
            if (filterByKeywords && Array.isArray(filterByKeywords)) {
                const keywordIndices = new Set();
                filterByKeywords.forEach(keyword => {
                    const keywordLower = keyword.toLowerCase();
                    if (this.keywordIndex.has(keywordLower)) {
                        this.keywordIndex.get(keywordLower).forEach(idx => keywordIndices.add(idx));
                    }
                });
                indices = new Set([...indices].filter(idx => keywordIndices.has(idx)));
                filteredMessages = [...indices].map(idx => savedHistory.messages[idx]);
            }

            // تصفية حسب الموضوع
            if (filterByTopic) {
                filteredMessages = filteredMessages.filter(msg => msg.topic === filterByTopic);
            }

            const formattedContext = {
                messages: filteredMessages.map(msg => ({
                    role: msg.isUser ? 'user' : 'model',
                    content: msg.text,
                    emotion: msg.emotion,
                    modelName: msg.modelName,
                    timestamp: msg.timestamp,
                    topic: msg.topic,
                })),
                summary: this.generateSummary(filteredMessages),
            };

            console.log("تم بناء السياق المصفى بنجاح:", formattedContext);
            return formattedContext;
        } catch (error) {
            console.error("خطأ أثناء بناء السياق:", error);
            return { 
                messages: [], 
                summary: "", 
                error: "حدث خطأ أثناء بناء السياق، يرجى المحاولة مرة أخرى." 
            };
        }
    },

    /**
     * توليد ملخص للسياق بناءً على الرسائل المصفاة.
     * @param {Array} messages - مصفوفة الرسائل
     * @returns {string} - ملخص السياق
     */
    generateSummary(messages) {
        if (!messages || messages.length === 0) return "لا يوجد سياق متاح.";

        const userMessages = messages.filter(msg => msg.isUser).map(msg => msg.text);
        const modelMessages = messages.filter(msg => !msg.isUser).map(msg => msg.text);

        const topicsCount = {};
        messages.forEach(msg => {
            topicsCount[msg.topic] = (topicsCount[msg.topic] || 0) + 1;
        });

        const dominantTopic = Object.entries(topicsCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "عام";

        const startDate = messages.length > 0 ? new Date(messages[0].timestamp).toLocaleDateString() : "غير متاح";
        const endDate = messages.length > 0 ? new Date(messages[messages.length - 1].timestamp).toLocaleDateString() : "غير متاح";

        return `المحادثة تتضمن ${userMessages.length} رسائل من المستخدم و${modelMessages.length} ردود من النموذج. الموضوع الرئيسي: ${dominantTopic}. التاريخ: من ${startDate} إلى ${endDate}. آخر رسالة مستخدم: "${userMessages[userMessages.length - 1] || 'غير متاح'}". آخر رد: "${modelMessages[modelMessages.length - 1] || 'غير متاح'}".`;
    },

    /**
     * أرشفة المحادثات حسب المواضيع والتاريخ.
     * @returns {Object} - الأرشيف المنظم
     */
    async archiveConversations() {
        try {
            const savedHistory = await conversationHistory.getCurrentConversation() || { messages: [] };
            const archive = {
                byTopic: {},
                byDate: {},
            };

            savedHistory.messages.forEach(msg => {
                // الأرشفة حسب الموضوع
                if (!archive.byTopic[msg.topic]) {
                    archive.byTopic[msg.topic] = [];
                }
                archive.byTopic[msg.topic].push(msg);

                // الأرشفة حسب التاريخ
                const date = new Date(msg.timestamp).toDateString();
                if (!archive.byDate[date]) {
                    archive.byDate[date] = [];
                }
                archive.byDate[date].push(msg);
            });

            console.log("تم إنشاء الأرشيف بنجاح:", archive);
            return archive;
        } catch (error) {
            console.error("خطأ أثناء الأرشفة:", error);
            return { byTopic: {}, byDate: {} };
        }
    },

    /**
     * استرجاع الأرشيف بناءً على معايير.
     * @param {Object} options - خيارات (byTopic, byDate)
     * @returns {Array} - المحادثات المؤرشفة
     */
    async retrieveArchive(options = {}) {
        const { byTopic, byDate } = options;
        const archive = await this.archiveConversations();
        let result = [];

        if (byTopic && archive.byTopic[byTopic]) {
            result = archive.byTopic[byTopic];
        } else if (byDate && archive.byDate[byDate]) {
            result = archive.byDate[byDate];
        } else {
            result = Object.values(archive.byTopic).flat();
        }

        return result;
    },

    /**
     * مسح السياق بكاملة.
     */
    async clearContext() {
        try {
            await conversationHistory.saveCurrentConversation({ messages: [] });
            this.dateIndex.clear();
            this.keywordIndex.clear();
            console.log("تم مسح السياق بنجاح.");
        } catch (error) {
            console.error("خطأ أثناء مسح السياق:", error);
        }
    },

    /**
     * استرجاع السياق الحالي مع خيارات تصفية.
     * @param {Object} options - خيارات التصفية (filterByDate, filterByKeywords, filterByTopic)
     * @returns {Array} - مصفوفة السياق
     */
    async getContext(options = {}) {
        const savedHistory = await conversationHistory.getCurrentConversation() || { messages: [] };
        this.buildIndexes(savedHistory.messages);

        let filteredMessages = [...savedHistory.messages];
        let indices = new Set([...Array(savedHistory.messages.length).keys()]);

        if (options.filterByDate) {
            const date = new Date(options.filterByDate);
            if (!isNaN(date.getTime())) {
                const dateStr = date.toDateString();
                indices = new Set(this.dateIndex.get(dateStr) || []);
                filteredMessages = [...indices].map(idx => savedHistory.messages[idx]);
            }
        }

        if (options.filterByKeywords && Array.isArray(options.filterByKeywords)) {
            const keywordIndices = new Set();
            options.filterByKeywords.forEach(keyword => {
                const keywordLower = keyword.toLowerCase();
                if (this.keywordIndex.has(keywordLower)) {
                    this.keywordIndex.get(keywordLower).forEach(idx => keywordIndices.add(idx));
                }
            });
            indices = new Set([...indices].filter(idx => keywordIndices.has(idx)));
            filteredMessages = [...indices].map(idx => savedHistory.messages[idx]);
        }

        if (options.filterByTopic) {
            filteredMessages = filteredMessages.filter(msg => msg.topic === options.filterByTopic);
        }

        return filteredMessages;
    },
};

export default contextManager;