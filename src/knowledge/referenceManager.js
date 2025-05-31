import fileManager from '../utils/fileManager';

// إدارة المراجع (حفظ، قراءة، عرض)
const referenceManager = {
    // حفظ مرجع جديد
    saveReference: async (refName, content) => {
        try {
            const path = await fileManager.defaultStoragePath();
            const refPath = `references/${refName}`;
            await fileManager.saveFile(refPath, content);
            return `${path}/${refPath}`;
        } catch (error) {
            console.error("خطأ أثناء حفظ المرجع:", error);
            throw error;
        }
    },

    // قراءة مرجع
    readReference: async (refName) => {
        try {
            const refPath = `references/${refName}`;
            const content = await fileManager.readFile(refPath);
            return content;
        } catch (error) {
            console.error("خطأ أثناء قراءة المرجع:", error);
            throw error;
        }
    },

    // عرض قائمة المراجع
    listReferences: async () => {
        try {
            const path = await fileManager.defaultStoragePath();
            const result = await fileManager.readdir({
                path: `${path}/references`,
                directory: fileManager.defaultStoragePath(),
            });
            return result.files || [];
        } catch (error) {
            console.error("خطأ أثناء عرض المراجع:", error);
            return [];
        }
    },

    // حذف مرجع
    deleteReference: async (refName) => {
        try {
            const path = await fileManager.defaultStoragePath();
            await fileManager.deleteFile({
                path: `${path}/references/${refName}`,
                directory: fileManager.defaultStoragePath(),
            });
        } catch (error) {
            console.error("خطأ أثناء حذف المرجع:", error);
            throw error;
        }
    },
};

export default referenceManager;