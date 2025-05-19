// js/app/screens/WeatherScreen.js

import { renderMainScreen } from './MainScreen.js';
import { shipoAssistantConfig } from '../../assistant_data/index.js';
import { showPopup } from '../utils/uiHelpers.js'; // لاستخدام popups إذا لزم الأمر

/**
 * وظيفة لعرض شاشة الطقس.
 * @param {HTMLElement} container - العنصر الذي سيتم عرض الشاشة بداخله.
 */
export function renderWeatherScreen(container) {
    container.innerHTML = `
        <div class="top-bar">
            <button class="back-button" id="backToMainScreenBtn">←</button>
            <h1 class="screen-title">الطقس</h1>
            <div></div>
        </div>

        <div class="screen-container weather-screen">
            <div class="settings-section">
                <h2>حالة الطقس الحالية</h2>
                <p>قم بتحديث بيانات الطقس لموقعك الحالي:</p>
                <button class="button icon-button refresh-button" id="refreshWeatherBtn">
                    <span class="refresh-icon">🔄</span> تحديث الطقس
                </button>
                <div id="weatherResult" class="weather-result-box">
                    <p>انقر على "تحديث الطقس" لجلب بيانات الطقس لموقعك الحالي.</p>
                </div>
                <div id="weatherDisclaimer" class="disclaimer-text">
                    <p>يستخدم هذا التطبيق الموقع الجغرافي الخاص بك (GPS) لجلب بيانات الطقس.</p>
                </div>
            </div>
        </div>
    `;

    document.getElementById('backToMainScreenBtn').addEventListener('click', () => {
        renderMainScreen(container);
    });

    const refreshWeatherBtn = document.getElementById('refreshWeatherBtn');
    const weatherResult = document.getElementById('weatherResult');
    const OPENWEATHER_API_KEY = shipoAssistantConfig.connectivity.external_capabilities.api_keys.open_weather_map_api_key;

    refreshWeatherBtn.addEventListener('click', async () => {
        if (!OPENWEATHER_API_KEY || OPENWEATHER_API_KEY === 'YOUR_OPENWEATHER_API_KEY') {
            weatherResult.innerHTML = `<p style="color:red;">خطأ: لم يتم تعيين مفتاح OpenWeatherMap API. يرجى الحصول عليه من OpenWeatherMap (وتفعيل خطة One Call by Call) واستبدال 'YOUR_OPENWEATHER_API_KEY' في ملف externalCapabilities.js.</p>`;
            return;
        }

        // تفعيل زر التحديث (ذهبي) ووضع مؤشر تحميل
        refreshWeatherBtn.classList.add('active');
        weatherResult.innerHTML = `<p>جاري جلب الموقع وبيانات الطقس...</p><div class="loading-indicator"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>`;

        try {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const lat = position.coords.latitude;
                        const lon = position.coords.longitude;
                        console.log(`GPS Coordinates: Lat ${lat}, Lon ${lon}`);

                        try {
                            // استخدام One Call API 3.0
                            const response = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=ar`);
                            const data = await response.json();

                            if (response.ok) {
                                const current = data.current;
                                const daily = data.daily[0]; // اليوم الأول من التوقعات اليومية
                                const weatherDescription = current.weather[0].description;
                                const temp = current.temp;
                                const feelsLike = current.feels_like;
                                const humidity = current.humidity;
                                const windSpeed = current.wind_speed;
                                const pressure = current.pressure;
                                const uvi = current.uvi;
                                const visibility = current.visibility;

                                // تحويل درجة الحرارة من كلفن إلى مئوية إذا لم يتم تعيين الوحدات
                                // (مع أننا طلبنا units=metric)
                                const displayTemp = (temp - 273.15).toFixed(1);
                                const displayFeelsLike = (feelsLike - 273.15).toFixed(1);

                                weatherResult.innerHTML = `
                                    <h3>الطقس الحالي لموقعك:</h3>
                                    <p>الوصف: ${weatherDescription}</p>
                                    <p>درجة الحرارة: ${displayTemp}°C (تبدو كـ ${displayFeelsLike}°C)</p>
                                    <p>الرطوبة: ${humidity}%</p>
                                    <p>سرعة الرياح: ${windSpeed} م/ث</p>
                                    <p>الضغط الجوي: ${pressure} هكتوباسكال</p>
                                    <p>مؤشر الأشعة فوق البنفسجية (UVI): ${uvi}</p>
                                    <p>مدى الرؤية: ${visibility} متر</p>
                                    ${daily && daily.summary ? `<p>ملخص اليوم: ${daily.summary}</p>` : ''}
                                    ${data.alerts && data.alerts.length > 0 ? `<p style="color:orange;">تنبيهات الطقس: ${data.alerts[0].event}</p>` : ''}
                                `;
                                console.log("Weather data fetched successfully:", data);
                            } else {
                                weatherResult.innerHTML = `<p style="color:red;">خطأ في جلب بيانات الطقس: ${data.message || 'خطأ في API'}.</p>`;
                                console.error("OpenWeatherMap API error:", data);
                            }
                        } catch (apiError) {
                            weatherResult.innerHTML = `<p style="color:red;">حدث خطأ أثناء الاتصال بخدمة الطقس.</p>`;
                            console.error("API Fetch Error:", apiError);
                        } finally {
                            refreshWeatherBtn.classList.remove('active'); // إيقاف تفعيل زر التحديث
                        }
                    },
                    (error) => {
                        let errorMessage = "تعذر الحصول على الموقع الجغرافي. يرجى التأكد من تفعيل GPS ومنح الإذن للتطبيق.";
                        switch(error.code) {
                            case error.PERMISSION_DENIED:
                                errorMessage = "تم رفض طلب تحديد الموقع الجغرافي. يرجى السماح للتطبيق بالوصول إلى موقعك.";
                                break;
                            case error.POSITION_UNAVAILABLE:
                                errorMessage = "معلومات الموقع غير متوفرة حالياً.";
                                break;
                            case error.TIMEOUT:
                                errorMessage = "انتهت مهلة طلب تحديد الموقع الجغرافي.";
                                break;
                            case error.UNKNOWN_ERROR:
                                errorMessage = "حدث خطأ غير معروف أثناء تحديد الموقع الجغرافي.";
                                break;
                        }
                        weatherResult.innerHTML = `<p style="color:red;">${errorMessage}</p>`;
                        console.error("Geolocation Error:", error);
                        refreshWeatherBtn.classList.remove('active'); // إيقاف تفعيل زر التحديث
                    },
                    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 } // خيارات الحصول على الموقع
                );
            } else {
                weatherResult.innerHTML = `<p style="color:red;">ميزة تحديد الموقع الجغرافي غير مدعومة في متصفحك أو جهازك.</p>`;
                refreshWeatherBtn.classList.remove('active');
            }
        } catch (geolocationError) {
            weatherResult.innerHTML = `<p style="color:red;">حدث خطأ غير متوقع أثناء محاولة تحديد الموقع الجغرافي.</p>`;
            console.error("Geolocation Setup Error:", geolocationError);
            refreshWeatherBtn.classList.remove('active');
        }
    });

    console.log("Weather Screen rendered with GPS and One Call API 3.0 setup.");
}