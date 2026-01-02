const phones = [
    {name:"iPhone 16 Pro Max", battery:"4676 mAh", materials:"Титан", processor:"A18 Pro", camera:"48+12+12+12 МП", screen:'6.9" Super Retina XDR 2796x1290 120Гц', charging:"35 Вт", price:"1299", storage:"1 ТБ", os:"iOS 18", weight:"221 г", brand:"Apple"},
    {name:"iPhone 16", battery:"3561 mAh", materials:"Алюминий", processor:"A17 Pro", camera:"48+12 МП", screen:'6.1" OLED 2556x1179 60Гц', charging:"20 Вт", price:"799", storage:"128 ГБ", os:"iOS 18", weight:"171 г", brand:"Apple"},
    {name:"iPhone SE 4", battery:"3279 mAh", materials:"Алюминий", processor:"A16 Bionic", camera:"48 МП", screen:'6.1" OLED 2532x1170 60Гц', charging:"20 Вт", price:"499", storage:"128 ГБ", os:"iOS 18", weight:"165 г", brand:"Apple"},
    {name:"Samsung Galaxy S24 Ultra", battery:"5000 mAh", materials:"Титан", processor:"Snapdragon 8 Gen 3", camera:"200+50+12+10 МП", screen:'6.8" Dynamic AMOLED 3120x1440 120Гц', charging:"45 Вт", price:"1199", storage:"512 ГБ", os:"Android 14", weight:"232 г", brand:"Samsung"},
    {name:"Samsung Galaxy S24", battery:"4000 mAh", materials:"Алюминий", processor:"Exynos 2400", camera:"50+10+12 МП", screen:'6.2" Dynamic AMOLED 2340x1080 120Гц', charging:"25 Вт", price:"799", storage:"256 ГБ", os:"Android 14", weight:"167 г", brand:"Samsung"},
    {name:"Samsung Galaxy Z Fold6", battery:"4400 mAh", materials:"Алюминий", processor:"Snapdragon 8 Gen 3", camera:"50+12+10 МП", screen:'7.6" Dynamic AMOLED 2176x1812 120Гц', charging:"25 Вт", price:"1799", storage:"512 ГБ", os:"Android 14", weight:"239 г", brand:"Samsung"},
    {name:"Google Pixel 9 Pro", battery:"5050 mAh", materials:"Алюминий", processor:"Tensor G4", camera:"50+48+48 МП", screen:'6.7" LTPO OLED 2992x1344 120Гц', charging:"30 Вт", price:"999", storage:"256 ГБ", os:"Android 15", weight:"193 г", brand:"Google"},
    {name:"Google Pixel 9", battery:"4575 mAh", materials:"Алюминий", processor:"Tensor G4", camera:"50+48 МП", screen:'6.2" OLED 2400x1080 120Гц', charging:"27 Вт", price:"699", storage:"128 ГБ", os:"Android 15", weight:"168 г", brand:"Google"},
    {name:"OnePlus 12", battery:"5400 mAh", materials:"Стекло и металл", processor:"Snapdragon 8 Gen 3", camera:"50+64+48 МП", screen:'6.82" LTPO AMOLED 3168x1440 120Гц', charging:"100 Вт", price:"799", storage:"256 ГБ", os:"OxygenOS 14", weight:"220 г", brand:"OnePlus"},
    {name:"OnePlus Nord 4", battery:"5500 mAh", materials:"Алюминий", processor:"Snapdragon 7+ Gen 3", camera:"50+8 МП", screen:'6.74" Fluid AMOLED 2772x1240 120Гц', charging:"80 Вт", price:"449", storage:"256 ГБ", os:"OxygenOS 14", weight:"190 г", brand:"OnePlus"},
    {name:"Xiaomi 14 Ultra", battery:"5300 mAh", materials:"Нано-кожа и металл", processor:"Snapdragon 8 Gen 3", camera:"50+50+50+50 МП", screen:'6.73" LTPO AMOLED 3200x1440 120Гц', charging:"90 Вт", price:"1299", storage:"512 ГБ", os:"HyperOS", weight:"219 г", brand:"Xiaomi"},
    {name:"Xiaomi 14", battery:"4610 mAh", materials:"Стекло и металл", processor:"Snapdragon 8 Gen 3", camera:"50+50+50 МП", screen:'6.36" LTPO AMOLED 2670x1200 120Гц', charging:"90 Вт", price:"899", storage:"256 ГБ", os:"HyperOS", weight:"188 г", brand:"Xiaomi"},
    {name:"Redmi Note 13 Pro", battery:"5100 mAh", materials:"Стекло", processor:"Snapdragon 7s Gen 2", camera:"200+8+2 МП", screen:'6.67" AMOLED 2712x1220 120Гц', charging:"67 Вт", price:"399", storage:"256 ГБ", os:"HyperOS", weight:"187 г", brand:"Xiaomi"},
    {name:"Realme GT 5 Pro", battery:"5400 mAh", materials:"Стекло и металл", processor:"Snapdragon 8 Gen 3", camera:"50+50+8 МП", screen:'6.78" AMOLED 2780x1264 120Гц', charging:"100 Вт", price:"749", storage:"512 ГБ", os:"Realme UI 5", weight:"218 г", brand:"Realme"},
    {name:"Vivo X100 Pro", battery:"5400 mAh", materials:"Стекло и металл", processor:"Dimensity 9300", camera:"50+50+50 МП", screen:'6.78" LTPO AMOLED 2800x1260 120Гц', charging:"100 Вт", price:"899", storage:"512 ГБ", os:"Funtouch OS 14", weight:"221 g", brand:"Vivo"},
    {name:"Oppo Find X7 Ultra", battery:"5000 mAh", materials:"Стекло и металл", processor:"Snapdragon 8 Gen 3", camera:"50+50+50+50 МП", screen:'6.82" LTPO AMOLED 3168x1440 120Гц', charging:"100 Вт", price:"1199", storage:"512 ГБ", os:"ColorOS 14", weight:"221 г", brand:"Oppo"},
    {name:"Asus ROG Phone 8", battery:"5500 mAh", materials:"Стекло и металл", processor:"Snapdragon 8 Gen 3", camera:"50+13+32 МП", screen:'6.78" AMOLED 2448x1080 165Гц', charging:"65 Вт", price:"1099", storage:"512 ГБ", os:"ROG UI", weight:"225 г", brand:"Asus"},
    {name:"Nothing Phone 2", battery:"4700 mAh", materials:"Стекло и алюминий", processor:"Snapdragon 8+ Gen 1", camera:"50+50 МП", screen:'6.7" LTPO OLED 2412x1080 120Гц', charging:"45 Вт", price:"599", storage:"256 ГБ", os:"Nothing OS 2.5", weight:"201 г", brand:"Nothing"},
    {name:"Motorola Edge 40 Neo", battery:"5000 mAh", materials:"Веганская кожа", processor:"Dimensity 7030", camera:"50+13 МП", screen:'6.55" pOLED 2400x1080 144Гц', charging:"68 Вт", price:"449", storage:"256 ГБ", os:"Android 14", weight:"172 г", brand:"Motorola"},
    {name:"Honor Magic 6 Pro", battery:"5600 mAh", materials:"Стекло и металл", processor:"Snapdragon 8 Gen 3", camera:"50+50+180 МП", screen:'6.8" LTPO OLED 2800x1280 120Гц', charging:"80 Вт", price:"1099", storage:"512 ГБ", os:"MagicOS 8", weight:"229 г", brand:"Honor"},
    {name:"Sony Xperia 1 V", battery:"5000 mAh", materials:"Стекло и металл", processor:"Snapdragon 8 Gen 2", camera:"52+12+12 МП", screen:'6.5" OLED 3840x1644 120Гц', charging:"30 Вт", price:"1399", storage:"256 ГБ", os:"Android 14", weight:"187 г", brand:"Sony"},
    {name:"Huawei P60 Pro", battery:"4815 mAh", materials:"Нано-кристалл", processor:"Snapdragon 8+ Gen 1", camera:"48+13+48 МП", screen:'6.67" LTPO OLED 2700x1220 120Гц', charging:"88 Вт", price:"1199", storage:"512 ГБ", os:"HarmonyOS 4", weight:"200 г", brand:"Huawei"},
    {name:"ZTE Nubia Z60 Ultra", battery:"6000 mAh", materials:"Стекло и металл", processor:"Snapdragon 8 Gen 3", camera:"50+50+64 МП", screen:'6.8" AMOLED 2480x1116 120Гц', charging:"80 Вт", price:"799", storage:"512 ГБ", os:"MyOS 14", weight:"246 г", brand:"ZTE"},
    {name:"CAT S75", battery:"5000 mAh", materials:"Резина и металл", processor:"Dimensity 930", camera:"50+8 МП", screen:'6.6" IPS 2408x1080 120Гц', charging:"35 Вт", price:"599", storage:"128 ГБ", os:"Android 13", weight:"268 г", brand:"CAT"},
    {name:"Fairphone 5", battery:"4200 mAh", materials:"Переработанный пластик", processor:"QCM6490", camera:"50+50 МП", screen:'6.46" OLED 2770x1224 90Гц', charging:"30 Вт", price:"699", storage:"256 ГБ", os:"Android 13", weight:"212 г", brand:"Fairphone"}
];

const attributes = {
    battery: "🔋 Аккумулятор",
    materials: "🧱 Материалы",
    processor: "⚙ Процессор",
    camera: "📸 Камера",
    screen: "🖥 Экран",
    charging: "⚡ Зарядка",
    price: "💲 Цена",
    storage: "💾 Память",
    os: "🔷 ОС",
    weight: "⚖️ Вес"
};

function getRandomPhone() {
    return phones[Math.floor(Math.random() * phones.length)];
}