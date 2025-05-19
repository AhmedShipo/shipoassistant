// js/assistant_data/connectivity/externalCapabilities.js

// هذا الملف يحدد قدرات المساعد على التفاعل مع الأنظمة والخدمات الخارجية.

export const externalCapabilities = {
    search_engines: [
        { name: "Wikipedia", description_ar: "محرك بحث ويكيبيديا الموسوعي للوصول إلى المعلومات والمعارف." },
        { name: "Google", description_ar: "محرك بحث جوجل للوصول إلى معلومات الويب العامة." },
        { name: "Bing Search AI", description_ar: "محرك بحث Bing المدعوم بالذكاء الاصطناعي للحصول على إجابات أكثر تفصيلاً وسياقية." },
        { name: "DuckDuckGo", description_ar: "محرك بحث يركز على الخصوصية." }
    ],
    // مفاتيح الـ API (للتوضيح فقط - في الإنتاج الحقيقي، يجب أن تكون على خادم Backend)
    api_keys: {
        open_weather_map_api_key: 'YOUR_OPENWEATHER_API_KEY', // احصل على مفتاحك من OpenWeatherMap (تأكد من تفعيل One Call by Call)
        Maps_api_key: 'YOUR_Maps_API_KEY' // احصل على مفتاحك من Google Cloud Console (Maps Platform)
    },
    // تحديد ما إذا كان المساعد مدمجاً مع واجهات برمجة تطبيقات لخدمات معينة
    weather_api_integration: {
        enabled: true,
        description_ar: "القدرة على جلب بيانات الطقس الحالية والمتوقعة (دقيقة، ساعة، يوم) وتنبيهات الطقس بناءً على الموقع الجغرافي (GPS) باستخدام OpenWeather One Call API 3.0.",
        service: "OpenWeatherMap - One Call API 3.0"
    },
    Maps_integration: {
        enabled: true,
        description_ar: "القدرة على عرض الخرائط، تحديد المواقع، وجلب الاتجاهات من Google Maps.",
        service: "Google Maps Platform"
    },
    // الأمثلة التالية تتطلب عادةً تكاملات أكثر تعقيدًا أو استخدام Cordova Plugins
    calendar_integration: {
        enabled: false,
        description_ar: "القدرة على إدارة التقويم، إضافة أحداث، وتذكيرات (يتطلب تكامل مع Google Calendar API أو ما شابه).",
        details: "يتطلب مصادقة OAuth وربما Cordova plugins للوصول الآمن."
    },
    email_integration: {
        enabled: false,
        description_ar: "القدرة على إرسال وقراءة رسائل البريد الإلكتروني (يتطلب تكامل مع Gmail API أو ما شابه).",
        details: "يتطلب مصادقة OAuth وربما Cordova plugins."
    },
    file_system_access: {
        enabled: true, // AIDE تسمح ببعض الوصول لملفات الـ www
        description_ar: "القدرة على قراءة وكتابة الملفات على الجهاز (للقراءة والكتابة داخل نطاق التطبيق).",
        details: "للوصول الكامل لنظام الملفات، قد تحتاج إلى Cordova plugins مثل cordova-plugin-file."
    },
    device_sensors: {
        enabled: false,
        description_ar: "القدرة على التفاعل مع مستشعرات الجهاز (مثل الكاميرا، الميكروفون، GPS).",
        details: "يتطلب Cordova plugins محددة."
    },
    notification_system: {
        enabled: false,
        description_ar: "القدرة على إرسال إشعارات للمستخدم.",
        details: "يتطلب Cordova plugins."
    },
    geolocation_access: {
        enabled: true,
        description_ar: "القدرة على الوصول إلى الموقع الجغرافي للجهاز (GPS).",
        details: "يتطلب أذونات الموقع في الجهاز."
    }
};

export const connectivity = {
    // يمكن إضافة إعدادات الشبكة، قيود النطاق الترددي، إلخ هنا
    network_status_monitoring: {
        enabled: true,
        description_ar: "مراقبة حالة الاتصال بالشبكة لضبط سلوك المساعد.",
        modes: ["online", "offline"]
    },
    external_capabilities: externalCapabilities // تضمين القدرات الخارجية
};