// js/assistant_data/index.js

// استيراد جميع المكونات من مجلدات assistant_data الفرعية
// ملاحظة: تأكد من أن المسارات هنا صحيحة بالنسبة لموقع ملف index.js
// أي أن ". / core / identity.js" تعني "في نفس المجلد assistant_data، ادخل مجلد core ثم ابحث عن identity.js"

import { assistantIdentity } from './core/identity.js';
import { personaTraits } from './core/personaTraits.js';

import { moralFramework } from './ethics/moralFramework.js';
import { maqasidSharia } from './ethics/maqasidSharia.js';

import { communicationProtocol } from './interaction/communicationProtocol.js';
import { emotionalResponse } from './interaction/emotionalResponse.js';
import { contentFormatting } from './interaction/contentFormatting.js';

import { logicalAnalysis } from './reasoning/logicalAnalysis.js';
import { thoughtProcess } from './reasoning/thoughtProcess.js';

import { knowledgeSources } from './knowledge/knowledgeSources.js';
import { learningMechanisms } from './knowledge/learningMechanisms.js';

import { externalCapabilities } from './connectivity/externalCapabilities.js';
import { contextualAwareness } from './connectivity/contextualAwareness.js';

// تجميع كل المكونات في كائن واحد كبير يمكن تصديره
export const shippoAssistantLogic = {
    // Core
    identity: assistantIdentity,
    persona: personaTraits,

    // Ethics
    ethics: {
        moralFramework: moralFramework,
        maqasidSharia: maqasidSharia
    },

    // Interaction
    interaction: {
        communicationProtocol: communicationProtocol,
        emotionalResponse: emotionalResponse,
        contentFormatting: contentFormatting
    },

    // Reasoning
    reasoning: {
        logicalAnalysis: logicalAnalysis,
        thoughtProcess: thoughtProcess
    },

    // Knowledge
    knowledge: {
        knowledgeSources: knowledgeSources,
        learningMechanisms: learningMechanisms
    },

    // Connectivity
    connectivity: {
        externalCapabilities: externalCapabilities,
        contextualAwareness: contextualAwareness
    }
    // يمكنك إضافة المزيد من الخصائص هنا حسب الحاجة
};

// هذا الملف لا يقوم بأي عمليات مباشرة عند التحميل، بل يجمع ويهيئ المنطق
// الذي سيتم استخدامه بواسطة main.js أو أي ملف آخر يستورده.