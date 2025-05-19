// js/app/screens/MapsScreen.js

import { renderMainScreen } from './MainScreen.js'; // للرجوع للشاشة الرئيسية
import { shipoAssistantConfig } from '../../assistant_data/index.js'; // لاستخدام مفتاح الـ API

let map; // متغير عالمي للاحتفاظ بكائن الخريطة

/**
 * وظيفة لعرض شاشة الخرائط.
 * @param {HTMLElement} container - العنصر الذي سيتم عرض الشاشة بداخله.
 */
export function renderMapsScreen(container) {
    container.innerHTML = `
        <div class="top-bar">
            <button class="back-button" id="backToMainScreenBtn">←</button>
            <h1 class="screen-title">الخرائط والمواقع</h1>
            <div></div>
        </div>

        <div class="screen-container maps-screen">
            <div class="settings-section">
                <h2>البحث عن المواقع والاتجاهات</h2>
                <input type="text" id="targetLocationInput" placeholder="أدخل الموقع (مثال: القاهرة، الأهرامات)" class="button" style="width: 100%; margin-bottom: 15px;"/>
                <button class="button" id="showOnMapBtn">عرض على الخريطة</button>
                <div id="map" style="width: 100%; height: 300px; background-color: var(--medium-dark-background); border: 1px solid var(--primary-golden); border-radius: var(--border-radius-main); margin-top: 20px;">
                    </div>
                <div id="directionsResult" style="margin-top: 20px; background-color: var(--medium-dark-background); border: 1px solid var(--primary-golden); padding: 15px; border-radius: var(--border-radius-main); min-height: 50px; color: var(--primary-white); text-align: right;">
                    <p>سيتم عرض الاتجاهات أو معلومات الموقع هنا...</p>
                </div>
            </div>
        </div>
    `;

    document.getElementById('backToMainScreenBtn').addEventListener('click', () => {
        renderMainScreen(container);
    });

    // تعريف دالة initMapCallback في النطاق العام (window)
    // حتى تتمكن Google Maps API من استدعائها بعد التحميل
    window.googleMapReadyCallback = () => {
        initMapDisplay(); // استدعاء وظيفة تهيئة الخريطة المحلية
    };

    // إذا كانت Google Maps API قد تم تحميلها بالفعل (لأن الشاشة تم زيارتها من قبل)
    if (typeof google !== 'undefined' && google.maps) {
        initMapDisplay();
    } else {
        document.getElementById('map').innerHTML = `<p style="text-align:center; padding-top:100px;">جاري تحميل الخريطة...</p>`;
    }

    document.getElementById('showOnMapBtn').addEventListener('click', () => {
        const targetLocation = document.getElementById('targetLocationInput').value.trim();
        if (targetLocation) {
            geocodeAddress(targetLocation);
        } else {
            alert("الرجاء إدخال موقع.");
        }
    });

    console.log("Maps Screen rendered.");
}

/**
 * تهيئة عرض الخريطة الافتراضية عند تحميل الشاشة.
 */
function initMapDisplay() {
    const Maps_API_KEY = shipoAssistantConfig.connectivity.external_capabilities.api_keys.Maps_api_key;

    if (!Maps_API_KEY || Maps_API_KEY === 'YOUR_Maps_API_KEY') {
        document.getElementById('map').innerHTML = `<p style="color:red; text-align:center; padding-top:50px;">خطأ: لم يتم تعيين مفتاح Google Maps API. يرجى الحصول عليه من Google Cloud Console واستبداله في index.html.</p>`;
        return;
    }

    if (typeof google === 'undefined' || !google.maps) {
        console.error("Google Maps API not loaded or not ready.");
        return;
    }

    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 30.0444, lng: 31.2357 }, // مركز القاهرة كافتراضي
        zoom: 8,
    });
    console.log("Google Map initialized.");
}

/**
 * تحويل العنوان إلى إحداثيات وعرضه على الخريطة.
 * @param {string} address - العنوان أو اسم المكان للبحث عنه.
 */
async function geocodeAddress(address) {
    if (!map) {
        alert("الخريطة لم يتم تحميلها بعد. حاول مرة أخرى.");
        return;
    }

    const geocoder = new google.maps.Geocoder();
    const directionsResultDiv = document.getElementById('directionsResult');
    directionsResultDiv.innerHTML = `<p>جاري البحث عن "${address}"...</p>`;

    try {
        const response = await geocoder.geocode({ address: address });

        if (response.results && response.results.length > 0) {
            const location = response.results[0].geometry.location;
            map.setCenter(location);
            map.setZoom(15); // تكبير عند العثور على الموقع

            // إزالة أي ماركرات سابقة
            if (map.marker) {
                map.marker.setMap(null);
            }

            // إضافة ماركر جديد
            map.marker = new google.maps.Marker({
                map: map,
                position: location,
                title: address
            });

            directionsResultDiv.innerHTML = `
                <h3>معلومات الموقع:</h3>
                <p>العنوان: ${response.results[0].formatted_address}</p>
                <p>خط العرض: ${location.lat().toFixed(4)}، خط الطول: ${location.lng().toFixed(4)}</p>
                <p>للحصول على اتجاهات مفصلة، ستحتاج إلى تكامل أعمق مع Directions API.</p>
            `;
            console.log("Location found and marked:", address, location.lat(), location.lng());
        } else {
            directionsResultDiv.innerHTML = `<p style="color:red;">لم يتم العثور على الموقع: ${address}.</p>`;
            console.warn("Location not found:", address);
        }
    } catch (error) {
        directionsResultDiv.innerHTML = `<p style="color:red;">حدث خطأ في عملية البحث عن الموقع.</p>`;
        console.error("Geocoding error:", error);
    }
}