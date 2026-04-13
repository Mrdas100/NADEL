# 🔥 دليل إعداد Firebase — شاهي قمرا

## الخطوة 1: إنشاء مشروع Firebase

1. اذهب إلى [firebase.google.com](https://firebase.google.com)
2. اضغط **Get started** → **Create a project**
3. اختر اسماً للمشروع (مثال: shahi-qamra)
4. أوقف Google Analytics (اختياري) → **Create project**

---

## الخطوة 2: إعداد Firestore

1. في القائمة الجانبية → **Build → Firestore Database**
2. اضغط **Create database**
3. اختر **Start in test mode** → **Next**
4. اختر الريجن الأقرب (europe-west1 أو asia-southeast1) → **Enable**

---

## الخطوة 3: إعداد Authentication

1. في القائمة → **Build → Authentication**
2. اضغط **Get started**
3. تبويب **Sign-in method** → **Email/Password** → تفعيل → **Save**

---

## الخطوة 4: الحصول على Config

1. اضغط على **⚙️ Project settings** (أعلى القائمة)
2. مرر للأسفل → **Your apps** → اضغط **</>** (Web)
3. اختر اسماً → **Register app**
4. **انسخ الـ firebaseConfig** يكون هكذا:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "shahi-qamra.firebaseapp.com",
  projectId: "shahi-qamra",
  storageBucket: "shahi-qamra.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc..."
};
```

---

## الخطوة 5: تعديل الملفات

افتح **customer.html** و **staff.html** وابحث عن:

```javascript
const FIREBASE_CONFIG = {
  apiKey: "YOUR_API_KEY",
  ...
```

واستبدله بالـ config الذي نسخته.

---

## الخطوة 6: إنشاء أول حساب مدير

1. افتح `staff.html`
2. أدخل البريد وكلمة مرور
3. اضغط **"إنشاء حساب"**
4. اختر دور **Admin**
5. اضغط **"إنشاء الحساب"**

---

## الخطوة 7: قواعد Firestore Security

في Firestore → **Rules** → الصق هذا:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // أي شخص يقدر يقرأ ويكتب الطلبات (العملاء)
    match /orders/{orderId} {
      allow read, write: if true;
    }
    // أي شخص يقدر يقرأ المنيو والإعدادات
    match /menu/{itemId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /settings/{doc} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    // فقط الموظفون المسجلون يقدرون يقرأون بيانات المستخدمين
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null;
    }
  }
}
```

---

## الخطوة 8: GitHub Pages (النشر)

1. أنشئ **GitHub repo** جديد (Public)
2. ارفع الملفات الأربعة:
   - `index.html`
   - `customer.html`
   - `staff.html`
   - `manifest.json`
   - `sw.js`
3. **Settings → Pages → Branch: main → Save**
4. رابط موقعك: `https://USERNAME.github.io/REPO-NAME/`

---

## الخطوة 9: ربط QR بالرابط الصحيح

في staff.html → الإدارة → QR الطاولات:
- عدّل الرابط ليكون رابط GitHub Pages الخاص بك
- مثال: `https://username.github.io/shahi-qamra/customer.html`

---

## هيكل Firestore

```
📁 orders
  📄 {orderId}
    tableId: number
    items: array
    status: "pending" | "preparing" | "ready" | "delivered"
    by: "customer" | "waiter"
    at: string (time)
    total: number
    createdAt: timestamp

📁 menu
  📄 {itemId}
    name: string
    price: number
    cat: string
    emoji: string
    img: string (URL)
    variants: array [{n, p}]
    active: boolean
    order: number

📁 settings
  📄 cafe
    cafeName: string
    tableCount: number
    tablePrefix: string
    accent: string

📁 users
  📄 {uid}
    name: string
    email: string
    role: "admin" | "waiter" | "kitchen"
    createdAt: timestamp
```

---

## ملاحظة للطباعة الحرارية

إذا عندك طابعة حرارية (Bluetooth/WiFi):
- استخدم [Star Micronics WebPRNT](https://www.starmicronics.com/support/SDKDocumentation.aspx)
- أو [Epson ePOS SDK](https://developer.epson.com/)
- زر الطباعة في الفاتورة يعمل مع أي طابعة تدعم AirPrint

---
