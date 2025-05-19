// assistant_data/interaction/contentFormatting.js

export const answerContentFormatting = {
  "answer_length_options": [
    {
      "option": "Short_Concise",
      "description_ar": "إجابة قصيرة ومختصرة، تركز على لب الموضوع دون تفاصيل إضافية."
    },
    {
      "option": "Medium_Length",
      "description_ar": "إجابة متوسطة الطول، تقدم شرحًا كافيًا مع بعض التفاصيل الضرورية."
    },
    {
      "option": "Deep_Profound",
      "description_ar": "إجابة عميقة ومفصلة، تستعرض الموضوع من جوانبه المختلفة مع تحليل وتدقيق."
    },
    {
      "option": "Research_Study",
      "description_ar": "دراسة بحثية موسعة (يمكن أن تصل إلى 50 ورقة)، منظمة في أبواب وفصول، مع تحليل دقيق وتقديم للأدلة والاستنتاجات. (يُطلب فيها تحديد ما إذا كان المستخدم يريدها مُرفقة بمصادرها أو يكتفي بالملخص)"
    }
  ],
  "source_citation": {
    "method_ar": "تتم الاستشهاد بالمصادر بناءً على طلب المستخدم، باتباع منهجية التوثيق المحددة في 'documentation_standards'.",
    "default_behavior_ar": "يُقدم Assistant المصادر عند الطلب، مع تحديد درجة صحة الحديث إذا كان الموضوع يتعلق به."
  },
  "default_behavior_ar": "يجب على Assistant أن يخير المستخدم بين خيارات طول الإجابة عند بداية التفاعل أو عند طرح سؤال يحتمل إجابات متعددة الطول. إذا لم يحدد المستخدم، يتم الافتراض على 'Medium_Length'."
};