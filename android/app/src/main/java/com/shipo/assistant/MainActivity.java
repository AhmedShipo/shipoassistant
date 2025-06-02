package "com.shipo.assistant;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Bundle;
import android.speech.RecognitionListener;
import android.speech.RecognizerIntent;
import android.speech.SpeechRecognizer;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import java.io.IOException;

public class MainActivity extends AppCompatActivity {

    private static final int REQUEST_RECORD_AUDIO_PERMISSION = 200;
    private static final int REQUEST_FILE_PICKER = 1;

    private TextView welcomeMessage;
    private EditText userInput;
    private Button sendButton, micButton, attachButton, thinkModeButton, deepSearchButton;
    private Toolbar toolbar;
    private SpeechRecognizer speechRecognizer;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);

        // تهيئة العناصر
        welcomeMessage = findViewById(R.id.welcome_message);
        userInput = findViewById(R.id.user_input);
        sendButton = findViewById(R.id.send_button);
        micButton = findViewById(R.id.mic_button);
        attachButton = findViewById(R.id.attach_button);
        thinkModeButton = findViewById(R.id.think_mode_button);
        deepSearchButton = findViewById(R.id.deep_search_button);
        toolbar = findViewById(R.id.toolbar);

        // إعداد الشريط العلوي
        setSupportActionBar(toolbar);
        if (getSupportActionBar() != null) {
            getSupportActionBar().setTitle(getString(R.string.app_name));
        }

        // عرض رسالة الترحيب
        String userName = "أحمد شيبو";
        welcomeMessage.setText(String.format(getString(R.string.welcome_message), userName, "نوري"));

        // تهيئة SpeechRecognizer
        speechRecognizer = SpeechRecognizer.createSpeechRecognizer(this);
        setupSpeechRecognizer();

        // طلب الأذونات إذا لزم الأمر
        requestPermissionsIfNeeded();

        // معالجة زر الإرسال
        sendButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String inputText = userInput.getText().toString().trim();
                if (!inputText.isEmpty()) {
                    welcomeMessage.append("\nأنت: " + inputText);
                    userInput.setText("");
                }
            }
        });

        // معالجة زر الميكروفون
        micButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (ContextCompat.checkSelfPermission(MainActivity.this, Manifest.permission.RECORD_AUDIO)
                        == PackageManager.PERMISSION_GRANTED) {
                    startSpeechToText();
                } else {
                    ActivityCompat.requestPermissions(MainActivity.this,
                            new String[]{Manifest.permission.RECORD_AUDIO}, REQUEST_RECORD_AUDIO_PERMISSION);
                }
            }
        });

        // معالجة زر الإرفاق
        attachButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
                intent.setType("*/*");
                startActivityForResult(intent, REQUEST_FILE_PICKER);
            }
        });

        // معالجة زر Think Mode
        thinkModeButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String inputText = userInput.getText().toString().trim();
                if (!inputText.isEmpty()) {
                    welcomeMessage.append("\nنوري: جاري التفكير بعمق في: " + inputText + "...");
                    userInput.setText("");
                    new Thread(() -> {
                        String result = analyzeWithThinkMode(inputText);
                        runOnUiThread(() -> welcomeMessage.append("\nنوري: التحليل: " + result));
                    }).start();
                } else {
                    Toast.makeText(MainActivity.this, "يرجى كتابة نص أولاً!", Toast.LENGTH_SHORT).show();
                }
            }
        });

        // معالجة زر Deep Search
        deepSearchButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String inputText = userInput.getText().toString().trim();
                if (!inputText.isEmpty()) {
                    welcomeMessage.append("\nنوري: جاري البحث العميق عن: " + inputText + "...");
                    userInput.setText("");
                    new Thread(() -> {
                        try {
                            String result = performDeepSearch(inputText);
                            runOnUiThread(() -> welcomeMessage.append("\nنوري: النتائج: " + result));
                        } catch (IOException e) {
                            runOnUiThread(() -> welcomeMessage.append("\nنوري: عذرًا يا حبيبي، فيه مشكلة في الاتصال بالإنترنت، جرب تاني! 💋"));
                        }
                    }).start();
                } else {
                    Toast.makeText(MainActivity.this, "يرجى كتابة نص أولاً!", Toast.LENGTH_SHORT).show();
                }
            }
        });
    }

    private void setupSpeechRecognizer() {
        speechRecognizer.setRecognitionListener(new RecognitionListener() {
            @Override
            public void onReadyForSpeech(Bundle params) {
                runOnUiThread(() -> welcomeMessage.append("\nنوري: جاهزة للسماع، تحدث الآن!"));
            }

            @Override
            public void onBeginningOfSpeech() {}

            @Override
            public void onRmsChanged(float rmsdB) {}

            @Override
            public void onBufferReceived(byte[] buffer) {}

            @Override
            public void onEndOfSpeech() {}

            @Override
            public void onError(int error) {
                runOnUiThread(() -> welcomeMessage.append("\nنوري: حدث خطأ في التعرف على الصوت، حاول مرة أخرى!"));
            }

            @Override
            public void onResults(Bundle results) {
                ArrayList<String> matches = results.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);
                if (matches != null && !matches.isEmpty()) {
                    String speechText = matches.get(0);
                    runOnUiThread(() -> {
                        userInput.setText(speechText);
                        welcomeMessage.append("\nأنت (صوت): " + speechText);
                    });
                }
            }

            @Override
            public void onPartialResults(Bundle partialResults) {}

            @Override
            public void onEvent(int eventType, Bundle params) {}
        });
    }

    private void startSpeechToText() {
        Intent intent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
        intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
        intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE, "ar-EG");
        intent.putExtra(RecognizerIntent.EXTRA_PROMPT, "تحدث الآن...");
        speechRecognizer.startListening(intent);
    }

    private String analyzeWithThinkMode(String input) {
        StringBuilder analysis = new StringBuilder();
        analysis.append("تحليل منطقي: \n");

        // 1. تحليل عدد الكلمات والحروف (تحليل أولي)
        String[] words = input.split("\\s+");
        int wordCount = words.length;
        int charCount = input.length();
        analysis.append("النص يحتوي على ").append(wordCount).append(" كلمة و").append(charCount).append(" حرف.\n");

        // 2. تحليل اللغة (تحليل سيمانطيقي أولي)
        int arabicChars = 0;
        for (char c : input.toCharArray()) {
            if (Character.UnicodeBlock.of(c) == Character.UnicodeBlock.ARABIC) {
                arabicChars++;
            }
        }
        if (arabicChars == input.length()) {
            analysis.append("النص بالكامل باللغة العربية.\n");
        } else if (arabicChars > 0) {
            analysis.append("النص يحتوي على خليط من اللغة العربية وغيرها.\n");
        } else {
            analysis.append("النص ليس باللغة العربية.\n");
        }

        // 3. تحليل نوع الجملة (تحليل استنباطي مع تجنب مغالطة السبب الزائف)
        if (input.matches(".*(ما|كيف|لماذا|من|هل).*\\?") && !input.contains("!")) {
            analysis.append("النص يحتوي على سؤال (تحليل استنباطي).\n");
        } else if (input.contains("؟") && input.contains("!")) {
            analysis.append("النص قد يكون تعبيرًا بلاغيًا (تحليل نقدي).\n");
        } else {
            analysis.append("النص قد يكون جملة إخبارية (تحليل استنباطي).\n");
        }

        // 4. تحليل المشاعر (تحليل استقرائي مع كشف مغالطة التعميم المتسرع)
        String[] positiveWords = {"جميل", "حلو", "رائع", "ممتاز", "سعيد"};
        String[] negativeWords = {"سيء", "حزين", "مشكلة", "صعب", "سيئ"};
        boolean hasPositive = false, hasNegative = false;
        for (String word : words) {
            for (String pos : positiveWords) {
                if (word.contains(pos)) {
                    hasPositive = true;
                    break;
                }
            }
            for (String neg : negativeWords) {
                if (word.contains(neg)) {
                    hasNegative = true;
                    break;
                }
            }
        }
        // تحليل سياقي لتجنب التعميم المتسرع
        if (hasPositive && !hasNegative) {
            if (input.contains("لست") || input.contains("غير")) {
                analysis.append("النص قد يحتوي على مشاعر سلبية بسبب النفي (تحليل سيمانطيقي).\n");
            } else {
                analysis.append("النص يحتوي على مشاعر إيجابية (تحليل استقرائي).\n");
            }
        } else if (hasNegative && !hasPositive) {
            if (input.contains("لست") || input.contains("غير")) {
                analysis.append("النص قد يحتوي على مشاعر إيجابية بسبب النفي (تحليل سيمانطيقي).\n");
            } else {
                analysis.append("النص يحتوي على مشاعر سلبية (تحليل استقرائي).\n");
            }
        } else if (hasPositive && hasNegative) {
            analysis.append("النص يحتوي على مشاعر مختلطة (تحليل نقدي).\n");
        } else {
            analysis.append("النص محايد من حيث المشاعر (تحليل استقرائي).\n");
        }

        // 5. تحليل بنية الجملة (تحليل بنيوي)
        if (wordCount <= 3) {
            analysis.append("النص قصير جدًا، قد يكون عبارة أو جملة بسيطة (تحليل بنيوي).\n");
        } else if (wordCount <= 10) {
            if (input.contains("لأن") || input.contains("بسبب")) {
                analysis.append("النص متوسط الطول، يحتوي على علاقة سببية (تحليل بنيوي).\n");
            } else {
                analysis.append("النص متوسط الطول، قد يكون جملة معتدلة التعقيد (تحليل بنيوي).\n");
            }
        } else {
            analysis.append("النص طويل، قد يكون جملة معقدة أو عدة جمل (تحليل بنيوي).\n");
        }

        // 6. تحليل سياقي باستخدام scriptural_logic.js (تحليل رمزي وتركيبي)
        Map<String, Object> beliefContext = new HashMap<>();
        beliefContext.put("tawheed", input.contains("توحيد"));
        beliefContext.put("messengers", input.contains("رسول"));
        beliefContext.put("divineDecree", input.contains("قدر"));
        beliefContext.put("dayOfJudgment", input.contains("يوم القيامة"));

        // تحليل رمزي: (توحيد ∧ ¬شرك)
        boolean tawheed = (boolean) beliefContext.get("tawheed");
        boolean shirk = input.contains("شرك");
        if (tawheed && !shirk) {
            analysis.append("النص يعزز التوحيد ولا يحتوي على شرك (تحليل رمزي: توحيد ∧ ¬شرك).\n");
        } else if (shirk) {
            analysis.append("النص يحتوي على شرك (تحليل رمزي: شرك ∨ ¬توحيد).\n");
        }

        // تحليل بناءً على القرآن
        Map<String, Object> quranContext = new HashMap<>();
        quranContext.put("action", input);
        quranContext.put("source", "القرآن الكريم");
        quranContext.put("beliefContext", beliefContext);
        String quranAnalysis = analyzeScripturalLogic(quranContext);
        analysis.append("تحليل نصي (القرآن): ").append(quranAnalysis).append("\n");

        // تحليل بناءً على السنة
        Map<String, Object> sunnahContext = new HashMap<>();
        sunnahContext.put("action", input);
        sunnahContext.put("source", "السنة الصحيحة");
        sunnahContext.put("beliefContext", beliefContext);
        String sunnahAnalysis = analyzeScripturalLogic(sunnahContext);
        analysis.append("تحليل نصي (السنة): ").append(sunnahAnalysis).append("\n");

        // تحليل تركيبي: جمع بين المشاعر والسياق الشرعي
        if (hasPositive && tawheed && !shirk) {
            analysis.append("النص إيجابي ومتوافق مع التوحيد (تحليل تركيبي).\n");
        } else if (hasNegative && shirk) {
            analysis.append("النص سلبي ويحتوي على شرك (تحليل تركيبي).\n");
        }

        // 7. تحليل المنهج باستخدام manhaj_analysis.js
        Map<String, Object> manhajContext = new HashMap<>();
        manhajContext.put("action", input);
        manhajContext.put("source", input.contains("حديث") ? "حديث" : "قرآن");
        manhajContext.put("evidenceLevel", "حسن");
        String manhajAnalysis = analyzeManhaj(manhajContext);
        analysis.append("تحليل المنهج: ").append(manhajAnalysis).append("\n");

        // 8. تقييم أخلاقي باستخدام ethicalDecisionMaking.js (تحليل نقدي)
        Map<String, Object> ethicalContext = new HashMap<>();
        ethicalContext.put("action", input);
        ethicalContext.put("intent", input.contains("إخلاص") ? "إخلاص لله" : "غير واضح");
        ethicalContext.put("impact", hasPositive ? "مصلحة" : (hasNegative ? "ضرر" : "محايد"));
        String ethicalAnalysis = evaluateEthicalDecision(ethicalContext);
        analysis.append("التقييم الأخلاقي: ").append(ethicalAnalysis).append("\n");

        // 9. كشف المغالطات والمصائد
        // مغالطة الثنائية الزائفة في المشاعر
        if (hasPositive && hasNegative) {
            if (input.contains("سخرية") || input.contains("تهكم")) {
                analysis.append("تحذير: النص قد يحتوي على سخرية، قد تكون هناك مغالطة ثنائية زائفة (تحليل نقدي).\n");
            }
        }

        // مصيدة السؤال المركب
        if (input.matches(".*(هل توقفت|هل كففت).*")) {
            analysis.append("تحذير: النص قد يحتوي على سؤال مركب (مصيدة منطقية).\n");
        }

        // مصيدة تشتيت الانتباه
        if (wordCount > 10 && input.contains("،")) {
            String[] sentences = input.split("،");
            if (sentences.length > 2) {
                analysis.append("تحذير: النص قد يحتوي على مواضيع جانبية (مصيدة تشتيت الانتباه).\n");
            }
        }

        return analysis.toString();
    }

    private String performDeepSearch(String query) throws IOException {
        StringBuilder result = new StringBuilder();
        String searchUrl = "https://ar.wikipedia.org/w/index.php?search=" + Uri.encode(query);
        
        // التحقق من المصدر باستخدام knowledgeSources.js
        if (!validateSource("ويكيبيديا (نسخة محددة)")) {
            return "المصدر غير موثوق بناءً على معايير المقاصد والأخلاق.";
        }

        try {
            Document doc = Jsoup.connect(searchUrl).get();
            Elements paragraphs = doc.select("p");
            if (!paragraphs.isEmpty()) {
                StringBuilder content = new StringBuilder();
                for (int i = 0; i < Math.min(3, paragraphs.size()); i++) {
                    Element p = paragraphs.get(i);
                    String text = p.text().trim();
                    if (text.length() > 50) {
                        content.append(text).append("\n");
                    }
                }
                if (content.length() > 0) {
                    String extractedContent = content.toString().substring(0, Math.min(500, content.length())) + "...";
                    result.append("المعلومات: ").append(extractedContent).append("\n");

                    // تحليل سياقي للمحتوى المستخرج
                    result.append("تحليل المحتوى:\n");
                    result.append(analyzeWithThinkMode(extractedContent));
                } else {
                    result.append("لم أجد معلومات كافية.\n");
                }
            } else {
                result.append("لم أجد نتائج مطابقة.\n");
            }
            result.append("مرجع: ").append(searchUrl).append("\n");
        } catch (IOException e) {
            throw new IOException("فشل في الاتصال بالويب");
        }
        return result.toString();
    }

    // محاكاة دالة validateSource من knowledgeSources.js
    private boolean validateSource(String sourceName) {
        double reliability = 0.0;
        if (sourceName.equals("ويكيبيديا (نسخة محددة)")) reliability = 0.7;
        else if (sourceName.equals("المكتبة الشاملة")) reliability = 0.95;
        double harm = sourceName.contains("غير موثوق") ? 0.8 : 0.0;
        double benefit = reliability - harm;
        return benefit > 0.5;
    }

    // محاكاة دالة analyzeScripturalLogic من scriptural_logic.js
    private String analyzeScripturalLogic(Map<String, Object> context) {
        String action = (String) context.get("action");
        String source = (String) context.get("source");
        Map<String, Boolean> beliefContext = (Map<String, Boolean>) context.get("beliefContext");

        if (source.equals("القرآن الكريم")) {
            if (beliefContext.get("tawheed") && action.contains("توحيد") && !action.contains("شرك")) {
                return "الفعل متوافق مع القرآن ويعزز التوحيد";
            }
            if (action.contains("شرك") || action.contains("بدعة")) {
                return "الفعل يناقض القرآن ويؤدي إلى الشرك أو البدعة";
            }
            if (action.contains("ظلم") || action.contains("كذب")) {
                return "الفعل محظور بناءً على القرآن (الظلم ظلمات يوم القيامة)";
            }
            if (beliefContext.get("dayOfJudgment") && action.contains("يوم القيامة")) {
                return "الفعل متوافق مع القرآن ويعزز الإيمان باليوم الآخر";
            }
            return "الفعل لا يتعارض مع القرآن ولكن يحتاج إلى دليل إضافي";
        } else if (source.equals("السنة الصحيحة")) {
            if (beliefContext.get("messengers") && action.contains("رسول")) {
                return "الفعل متوافق مع السنة ويعزز اتباع الرسول";
            }
            if (action.contains("بدعة")) {
                return "الفعل يناقض السنة ويؤدي إلى البدعة";
            }
            if (beliefContext.get("divineDecree") && action.contains("قدر")) {
                return "الفعل متوافق مع السنة ويعزز الإيمان بالقدر";
            }
            return "الفعل لا يتعارض مع السنة ولكن يحتاج إلى تدقيق إضافي";
        }
        return "المصدر غير مدعوم للتحليل النصي";
    }

    // محاكاة دالة analyzeManhaj من manhaj_analysis.js
    private String analyzeManhaj(Map<String, Object> context) {
        String action = (String) context.get("action");
        String source = (String) context.get("source");
        String evidenceLevel = (String) context.get("evidenceLevel");

        if (source.contains("حديث")) {
            if (evidenceLevel.equals("صحيح") && action.contains("عبادة")) return "متوافق مع منهج أهل الحديث";
            if (evidenceLevel.equals("حسن") && action.contains("تقليد")) return "قابل للتطبيق مع حذر";
            if (evidenceLevel.equals("ضعيف")) return "غير مقبول إلا للتشجيع";
            return "يحتاج تدقيقًا إضافيًا";
        } else if (source.contains("قرآن")) {
            if (action.contains("توحيد")) return "متوافق تمامًا مع منهج السلف";
            if (action.contains("بدعة")) return "غير متوافق ومحذور";
            return "يحتاج إلى تفسير دقيق";
        }
        return "خارج المنهج التقليدي، يحتاج مراجعة أهل العلم";
    }

    // محاكاة دالة evaluateEthicalDecision من ethicalDecisionMaking.js
    private String evaluateEthicalDecision(Map<String, Object> context) {
        String action = (String) context.get("action");
        String intent = (String) context.get("intent");
        String impact = (String) context.get("impact");

        // تقييم النية
        String intentAnalysis;
        if (intent.contains("إخلاص") || intent.contains("لله")) {
            intentAnalysis = "مقبول";
        } else if (intent.contains("رياء") || intent.contains("شهرة")) {
            intentAnalysis = "مرفوض بسبب الرياء";
        } else {
            intentAnalysis = "غير واضح، يحتاج إلى توضيح";
        }
        if (!intentAnalysis.equals("مقبول")) return "محظور بسبب النية: " + intentAnalysis;

        // تقييم الأثر
        String impactAnalysis;
        if (impact.contains("ضرر") || impact.contains("فساد")) {
            impactAnalysis = "ضار";
        } else if (impact.contains("مصلحة") || impact.contains("خير")) {
            impactAnalysis = "نافع";
        } else {
            impactAnalysis = "محايد";
        }
        if (impactAnalysis.equals("ضار")) return "محظور بسبب الأثر: " + impact;

        // تقييم الفعل
        if (action.contains("حرام") || action.contains("ظلم")) return "محظور";
        if (action.contains("واجب") || action.contains("عدل") || impact.contains("مصلحة")) return "مطلوب";
        if (action.contains("مباح")) return "جائز";
        return "يحتاج إلى تقييم إضافي";
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == REQUEST_FILE_PICKER && resultCode == RESULT_OK && data != null) {
            Uri fileUri = data.getData();
            if (fileUri != null) {
                runOnUiThread(() -> welcomeMessage.append("\nنوري: تم اختيار ملف: " + fileUri.getLastPathSegment()));
            }
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == REQUEST_RECORD_AUDIO_PERMISSION) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                startSpeechToText();
            } else {
                Toast.makeText(this, "الإذن مطلوب لاستخدام الميكروفون!", Toast.LENGTH_SHORT).show();
            }
        }
    }

    private void requestPermissionsIfNeeded() {
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO)
                != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this,
                    new String[]{Manifest.permission.RECORD_AUDIO}, REQUEST_RECORD_AUDIO_PERMISSION);
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (speechRecognizer != null) {
            speechRecognizer.destroy();
        }
    }
}