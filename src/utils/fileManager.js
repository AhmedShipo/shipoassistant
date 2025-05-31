import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Permissions } from '@capacitor/permissions';

// إدارة ملفات التطبيق (فتح، حفظ، تحرير، نقل، اختيار مسار)
const fileManager = {
    // طلب الأذونات
    requestPermissions: async () => {
        const permissions = [
            'camera',
            'storage', // للوصول إلى الذاكرة الخارجية
        ];
        for (const perm of permissions) {
            const status = await Permissions.query({ name: perm });
            if (status.state !== 'granted') {
                const result = await Permissions.request({ name: perm });
                if (result.state !== 'granted') {
                    throw new Error(`إذن ${perm} مرفوض. يرجى تفعيله من الإعدادات.`);
                }
            }
        }
    },

    // مسار التخزين الافتراضي
    defaultStoragePath: async () => {
        const { value } = await Preferences.get({ key: 'storagePath' });
        if (value) return value;
        // مسار افتراضي (External Storage إذا متاح، وإلا Data)
        return Directory.External ? Directory.External : Directory.Data;
    },

    // واجهة UI لتحديد المسار يدويًا
    setStoragePath: async () => {
        try {
            // طلب إذن التخزين أولًا
            await fileManager.requestPermissions();

            // اختيار مسار جديد
            const newPath = await Filesystem.pickDirectory();
            if (!newPath) throw new Error("لم يتم اختيار مسار.");

            const currentPath = await fileManager.defaultStoragePath();
            await Preferences.set({ key: 'storagePath', value: newPath.uri });

            // نقل الملفات إلى المسار الجديد
            await fileManager.moveAllFiles(currentPath, newPath.uri);
            return newPath.uri;
        } catch (error) {
            console.error("خطأ أثناء تحديد المسار:", error);
            throw error;
        }
    },

    // فتح ملف من الهاتف
    openFilePicker: async (options = {}) => {
        await fileManager.requestPermissions();
        const input = document.createElement("input");
        input.type = "file";
        input.accept = options.accept || "*";
        return new Promise((resolve) => {
            input.onchange = (e) => resolve(e.target.files[0]);
            input.click();
        });
    },

    // قراءة ملف
    readFile: async (filePath) => {
        const path = await fileManager.defaultStoragePath();
        const result = await Filesystem.readFile({
            path: `${path}/${filePath}`,
            directory: Directory.Data,
        });
        return result.data;
    },

    // حفظ ملف
    saveFile: async (fileName, content) => {
        const path = await fileManager.defaultStoragePath();
        await Filesystem.writeFile({
            path: `${path}/${fileName}`,
            data: content,
            directory: Directory.Data,
            recursive: true,
        });
        return `${path}/${fileName}`;
    },

    // تحرير ملف
    editFile: async (filePath, newContent) => {
        await fileManager.saveFile(filePath, newContent);
    },
	
	//دالة لعرض المسار الحالي
    getCurrentStoragePath: async () => {
    return await fileManager.defaultStoragePath();
    },
	
    // نقل جميع الملفات إلى مسار جديد
    moveAllFiles: async (oldPath, newPath) => {
        try {
            const contents = await Filesystem.readdir({ path: oldPath, directory: Directory.Data });
            for (const item of contents.files) {
                await Filesystem.copy({
                    from: `${oldPath}/${item.name}`,
                    to: `${newPath}/${item.name}`,
                    directory: Directory.Data,
                });
                await Filesystem.deleteFile({
                    path: `${oldPath}/${item.name}`,
                    directory: Directory.Data,
                });
            }
        } catch (error) {
            console.error("خطأ أثناء نقل الملفات:", error);
            throw error;
        }
    },

    // التقاط صورة باستخدام الكاميرا
    captureImage: async () => {
        await fileManager.requestPermissions();
        const image = await Camera.getPhoto({
            quality: 90,
            allowEditing: false,
            resultType: CameraResultType.Uri,
        });
        return {
            type: "image/jpeg",
            url: image.webPath,
            name: `photo_${Date.now()}.jpg`
        };
    },
};

export default fileManager;