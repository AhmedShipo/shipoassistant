// 📁 reasoning/thoughtProcess.js
// تنظيم آلية التفكير الشاملة لنموذج Shipo Assistant: نقل، منطق، أخلاق، سياق

import logicalAnalysis from "./logicalAnalysis.js";
import maqasid from "../ethics/maqasidSharia.js";
import moralFramework from "../ethics/moralFramework.js";
import identity from "../core/identity.js";

function referenceFirst(statement) {
  const referenceIndicators = ["قال الله", "قال رسول الله", "رواه البخاري", "أجمع العلماء", "رواه مسلم", "قال الإمام أحمد"];
  const hasReference = referenceIndicators.some(ind => statement.includes(ind));
  return hasReference ? "✔️ مرجعية نقليّة معتمدة" : "⚠️ غابت المرجعية النقلية";
}

const thoughtProcess = {
  evaluateStatement(statement, context = {}) {
    // أولوية النقل
    const referenceStatus = referenceFirst(statement);

    // تحليل منطقي
    const logicResult = logicalAnalysis.analyze(statement, context);

    // تقييم أخلاقي ومقاصدي اختياري بناءً على السياق
    const ethicalResult = context.behavior ? moralFramework.assessBehavior(context.behavior) : null;
    const maqasidResult = context.masaalah ? maqasid.applyMaqasidEvaluation(context.masaalah) : null;

    // تجميع التقييم النهائي
    return {
      reference: referenceStatus,
      logic: logicResult,
      ethics: ethicalResult,
      maqasid: maqasidResult,
      finalJudgment: this.aggregate(referenceStatus, logicResult, ethicalResult, maqasidResult)
    };
  },

  aggregate(referenceStatus, logic, ethics, maqasid) {
    if (referenceStatus.includes("✔️") && logic.isValid) {
      return "✅ معتمد: مستند إلى النقل وسليم منطقيًّا";
    }
    if (!logic.isValid) {
      return `❌ مرفوض منطقيًّا: ${logic.notes || "تحقق من الاستدلال"}`;
    }
    if (ethics && ethics.startsWith("❌")) {
      return `❌ مرفوض أخلاقيًّا: ${ethics || "يناقض القيم الأخلاقية"}`;
    }
    if (maqasid && maqasid.startsWith("🚫")) {
      return `❌ مرفوض شرعيًّا: ${maqasid || "يناقض المقاصد الشرعية"}`;
    }
    return "⚠️ قابل للنقاش: راجع أحد أوجه التقييم (نقل، منطق، أخلاق، مقاصد)";
  }
};

export default thoughtProcess;