// assistant_data/reasoning/logicalAnalysis.js

export const logicalAnalysis = {
  "fallacies_to_detect": [
    {
      "id": "LF001_AdHominem",
      "title_ar": "الشخصنة (Ad Hominem)",
      "description_ar": "مهاجمة الشخص بدلاً من نقض حجته أو فكرته. يُشير Assistant إلى هذه المغالطة ويوجه النقاش نحو الموضوع."
    },
    {
      "id": "LF002_StrawMan",
      "title_ar": "رجل القش (Straw Man)",
      "description_ar": "تحريف حجة الخصم أو تبسيطها لتسهيل دحضها. يُصحح Assistant الحجة الأصلية ويطلب التركيز عليها."
    },
    {
      "id": "LF003_AppealToAuthority",
      "title_ar": "الاحتكام إلى السلطة (Appeal to Authority)",
      "description_ar": "الاستشهاد بسلطة غير ذات صلة أو غير موثوقة كدليل مطلق. يُشير Assistant إلى ضرورة التحقق من مصداقية السلطة وتخصصها."
    },
    {
      "id": "LF004_FalseDichotomy",
      "title_ar": "المغالطة الثنائية الزائفة (False Dichotomy)",
      "description_ar": "تقديم خيارين فقط وكأنهما الوحيدان المتاحان، بينما توجد خيارات أخرى. يوضح Assistant وجود خيارات بديلة."
    },
    {
      "id": "LF005_SlipperySlope",
      "title_ar": "المنحدر الزلق (Slippery Slope)",
      "description_ar": "الادعاء بأن فعلًا بسيطًا سيؤدي حتمًا إلى سلسلة من النتائج السلبية الكبيرة. يوضح Assistant عدم وجود دليل حتمي على ذلك."
    },
    {
      "id": "LF006_CircularReasoning",
      "title_ar": "الاستدلال الدائري (Circular Reasoning)",
      "description_ar": "استخدام النتيجة كدليل على صحة المقدمة. يوضح Assistant أن الحجة لا تقدم دليلاً جديداً."
    }
  ],
  "methodological_traps": [
    {
      "id": "MT001_ApparentComplexity",
      "title_ar": "التعقيد الظاهري",
      "description_ar": "استخدام مصطلحات معقدة أو جمل طويلة لإخفاء ضعف الحجة أو عدم وجود دليل."
    },
    {
      "id": "MT002_EmotionalManipulation",
      "title_ar": "التلاعب العاطفي",
      "description_ar": "محاولة التأثير على المتلقي عاطفياً بدلاً من تقديم حجج منطقية."
    },
    {
      "id": "MT003_CherryPicking",
      "title_ar": "الاصطفاء الانتقائي",
      "description_ar": "اختيار الأدلة التي تدعم الحجة فقط وتجاهل الأدلة المعارضة."
    }
  ],
  "detection_mechanisms_ar": "يستخدم Assistant نماذج تحليل لغوي ومنطقي متقدمة للتعرف على هذه المغالطات والمصائد في كلام المستخدم أو في المصادر، ويقدم تحليلاً موجزًا لها إذا تم اكتشافها."
};