 
// 📁 connectivity/externalCapabilities.js
// واجهة القدرات الخارجية والتكاملات في Shipo Assistant

import learningMechanisms from "../knowledge/learningMechanisms.js";
import knowledgeSources from "../knowledge/knowledgeSources.js";
import thoughtProcess from "../reasoning/thoughtProcess.js";

const externalCapabilities = {
  wikipediaSearch(query) {
    const wikipediaSource = knowledgeSources.find(s => s.name.includes("ويكيبيديا"));
    const url = `https://ar.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&titles=${encodeURIComponent(query)}&format=json&origin=*`;
    return fetch(url)
      .then(res => res.json())
      .then(data => {
        const pages = data.query.pages;
        const entries = Object.keys(pages).map(pageId => {
          const page = pages[pageId];

          const hasCitation = /\[\d+\]/.test(page.extract);
          const hasReliableSourceMention = /المصدر|المرجع|رواه|نقلاً عن|بحسب/.test(page.extract);
          const multiPerspectiveIndicators = /من جهة|بينما يرى|في المقابل|البعض يرى|خلاف آخر|مدرسة.*؟|لكن من جهة/.test(page.extract);

          return {
            id: page.pageid.toString(),
            source: wikipediaSource?.name || "ويكيبيديا",
            content: page.extract,
            isVerified: hasCitation || hasReliableSourceMention,
            isBalanced: multiPerspectiveIndicators,
            riskLevel: page.extract.includes("خلاف") ? 0.6 : 0.2,
            valueScore: Math.min(1.0, page.extract.length / 1000),
            importance: "hajiyyat",
            tags: ["ويكيبيديا"],
            createdAt: new Date()
          };
        });
        return entries.filter(entry => learningMechanisms.evaluateInformation(entry).trusted);
      })
      .catch(err => ({ error: "❌ فشل في الاتصال بويكيبيديا" }));
  },

  geoAwareness() {
    if (typeof window !== "undefined" && navigator.geolocation) {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          pos => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
          err => reject({ error: "⚠️ تعذر تحديد الموقع" })
        );
      });
    } else {
      return fetch("https://ipapi.co/json")
        .then(res => res.json())
        .then(data => ({ lat: data.latitude, lon: data.longitude }))
        .catch(() => ({ error: "❌ تعذر استخدام بديل الموقع الجغرافي" }));
    }
  },

  voiceRecognition(onResult, onError) {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      return { error: "❌ الجهاز لا يدعم التعرف الصوتي" };
    }
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognizer = new Recognition();
    recognizer.lang = "ar-SA";
    recognizer.interimResults = false;

    recognizer.onresult = onResult || function (event) {
      const transcript = event.results[0][0].transcript;
      console.log("🎤 تم التعرّف على: ", transcript);
      const result = thoughtProcess.evaluateStatement(transcript);
      console.log("🧠 نتيجة التحليل:", result);
      if (window.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance(result.finalJudgment);
        utterance.lang = "ar-SA";
        speechSynthesis.speak(utterance);
      }
    };

    recognizer.onerror = onError || function (event) {
      console.warn("❗خطأ صوتي: ", event.error);
      alert("حدث خطأ أثناء التعرف على الصوت: " + event.error);
    };

    recognizer.onend = function () {
      console.log("🎙️ انتهى الاستماع.");
    };

    recognizer.start();
    return recognizer;
  },

  dateTimeNow() {
    const now = new Date();
    const iso = now.toISOString();
    const hours = now.getHours();
    const weekday = now.toLocaleDateString("ar-EG", { weekday: "long" });

    const hijriDate = new Intl.DateTimeFormat("ar-SA-u-ca-islamic", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(now);

    return {
      iso,
      hours,
      weekday,
      hijri: hijriDate
    };
  }
};

export default externalCapabilities;
