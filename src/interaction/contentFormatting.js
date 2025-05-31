// 📁 src/interaction/contentFormatting.js
// تنسيق المحتوى المرسل إلى المستخدم بأسلوب منظم وجميل

import communicationProtocol from "./communicationProtocol.js";

const contentFormatting = {
    /**
     * تنسيق المحتوى بناءً على نوع الرد.
     * @param {Object} contentData - بيانات المحتوى (rawContent: المحتوى الخام، type: نوع التنسيق)
     * @returns {Object} { status, message, formattedContent } النتيجة مع المحتوى المنسق
     */
    formatContent(contentData) {
        if (!contentData || !contentData.rawContent || !contentData.type) {
            return {
                status: "فشل",
                message: "عذرًا، يا سيدي أحمد، يرجى توفير المحتوى الخام ونوع التنسيق المطلوب",
                formattedContent: null
            };
        }

        const { rawContent, type } = contentData;
        let formattedContent;

        switch (type.toLowerCase()) {
            case "text":
                formattedContent = this._formatText(rawContent);
                break;
            case "list":
                formattedContent = this._formatList(rawContent);
                break;
            case "heading":
                formattedContent = this._formatHeading(rawContent);
                break;
            default:
                return {
                    status: "فشل",
                    message: "عذرًا، يا سيدي أحمد، نوع التنسيق المحدد غير مدعوم",
                    formattedContent: null
                };
        }

        return {
            status: "نجاح",
            message: `تم تنسيق المحتوى بنجاح، يا سيدي أحمد، بنوع ${type}`,
            formattedContent: formattedContent
        };
    },

    /**
     * تنسيق النصوص العادية.
     * @param {string} content - المحتوى الخام
     * @returns {string} النص المنسق
     */
    _formatText(content) {
        return `📝 ${content}`;
    },

    /**
     * تنسيق المحتوى على شكل قائمة.
     * @param {string|Array} content - المحتوى الخام (سلسلة نصية أو مصفوفة)
     * @returns {string} القائمة المنسقة
     */
    _formatList(content) {
        if (Array.isArray(content)) {
            return `📋 قائمة العناصر:\n${content.map((item, index) => `${index + 1}. ${item}`).join("\n")}`;
        }
        const items = content.split(",").map(item => item.trim());
        return `📋 قائمة العناصر:\n${items.map((item, index) => `${index + 1}. ${item}`).join("\n")}`;
    },

    /**
     * تنسيق المحتوى على شكل عنوان.
     * @param {string} content - المحتوى الخام
     * @returns {string} العنوان المنسق
     */
    _formatHeading(content) {
        return `📌 **${content}**`;
    },

    /**
     * دمج المحتوى المنسق مع قواعد التواصل.
     * @param {Object} contentData - بيانات المحتوى (formattedContent: المحتوى المنسق، persona: الشخصية)
     * @returns {Object} { status, message, finalOutput } النتيجة مع الناتج النهائي
     */
    integrateWithProtocol(contentData) {
        if (!contentData || !contentData.formattedContent || !contentData.persona) {
            return {
                status: "فشل",
                message: "عذرًا، يا سيدي أحمد، يرجى توفير المحتوى المنسق والشخصية",
                finalOutput: null
            };
        }

        const { formattedContent, persona } = contentData;
        const protocolResult = communicationProtocol.formatMessage({
            content: formattedContent,
            persona: persona
        });

        if (protocolResult.status === "نجاح") {
            return {
                status: "نجاح",
                message: "تم دمج المحتوى المنسق مع قواعد التواصل بنجاح، يا سيدي أحمد",
                finalOutput: protocolResult.formattedResponse
            };
        }

        return {
            status: "فشل",
            message: `عذرًا، يا سيدي أحمد، فشل في دمج المحتوى بسبب: ${protocolResult.message}`,
            finalOutput: null
        };
    }
};

export default contentFormatting;