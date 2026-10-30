# AFRAN ONLINE CENTRE — Customer Android App

> **অফিশিয়াল গ্রাহক অ্যান্ড্রয়েড অ্যাপ ও ডিজিটাল নাগরিক সেবা পোর্টাল**  
> **Official Citizen Services & Customer Android App**  
> **Business:** AFRAN ONLINE CENTRE  
> **Address:** UTTAR MAHADEBNAGAR, MAMREJPUR BRIDGE, FARAKKA, WEST BENGAL - 742202, INDIA  
> **WhatsApp:** [+91 7074626784](https://wa.me/917074626784)  

---

## 📱 About the App

The **AFRAN ONLINE CENTRE** Customer Android App is a lightweight, clean, high-performance citizen service portal built specifically for ordinary customers in Farakka, West Bengal.

### 🌟 Key Features
- **Aadhaar Assistance**: Name correction, Date of Birth update, Address update, Mobile number update/link.
- **PAN Card Services**: New PAN application assistance (Form 49A), PAN correction, Lost/Damaged PAN reprint.
- **Voter Card (EPIC)**: New voter registration (Form 6), Name/Age correction (Form 8), Constituency/Assembly shifting.
- **Digital Ration Card**: New ration card application, addition/deletion of family members, address corrections.
- **Ayushman Card (PM-JAY)**: Eligibility assessment, eKYC verification, card download.
- **EPFO / PF Services**: PF withdrawal assistance, UAN activation & KYC linking, member passbook.
- **Driving Licence**: Learner Licence (LL) application, DL renewal, correction assistance.
- **Other Online Services**: SC/ST/OBC Caste certificates, Income & Residential certificates, Passport assistance, Trade licence.
- **Permanent Booking**: Priority reserved slot option alongside standard processing.
- **Transparent Document Checklists**: Clear reasons provided for every requested verification document (JPG, PNG, PDF upload supported).
- **Hidden Pricing Architecture**: No pricing, fees, or checkout screens are shown to customers.
- **Secure Authentication**: Customer-only Google Sign-In with strict data isolation. No customer can see another customer's data or documents.
- **Bilingual Interface**: Seamless 1-tap switching between Bengali (**বাংলা**) and **English**.

---

## 🚀 How to Download & Install the APK on Your Android Phone

You **do not need a computer or Android Studio**. GitHub's cloud servers automatically build the real `.apk` installer file for you.

### Step 1: Push or Sync This Repository to GitHub
If you have connected your GitHub account in Google AI Studio, push this codebase to your GitHub repository.

### Step 2: GitHub Automatically Builds the APK
1. Open your GitHub repository in your Android phone's web browser (e.g. Google Chrome).
2. Tap the **Actions** tab at the top.
3. You will see a workflow named **"Build Android APK"**.
   - If it didn't run automatically, tap **Build Android APK** in the left menu, then tap **Run workflow** -> **Run workflow**.
4. The cloud server will install dependencies, build the React frontend, sync the Android native project, and compile the native APK (takes ~3 to 5 minutes).
5. When the build shows a green checkmark (**Passed**), tap on the completed build run.

### Step 3: Download the APK to Your Phone
1. Scroll down to the **Artifacts** section at the bottom of the completed build page.
2. Tap on **`AFRAN_ONLINE_CENTRE_APK`**.
3. A file named `AFRAN_ONLINE_CENTRE_APK.zip` will download directly to your Android phone's **Downloads** folder.

### Step 4: Extract and Install
1. Open the **Files** app (or *Files by Google*) on your Android phone.
2. Go to **Downloads** and tap on **`AFRAN_ONLINE_CENTRE_APK.zip`**.
3. Tap **Extract**. You will see `AFRAN_ONLINE_CENTRE.apk`.
4. Tap on **`AFRAN_ONLINE_CENTRE.apk`**.
5. If Android asks for permission, tap **Settings** and turn on **"Allow from this source"** (install unknown apps).
6. Tap **Install**.
7. Open **AFRAN ONLINE CENTRE** and sign in with your Google account!

---

## 🛠️ Project Structure

```text
├── .github/workflows/
│   └── build-apk.yml          # GitHub Actions cloud APK compiler
├── android/                   # Capacitor native Android Gradle project
│   ├── app/
│   │   ├── build.gradle       # App-level Android build script
│   │   └── src/main/
│   │       ├── AndroidManifest.xml # Permissions & Android config
│   │       └── res/           # Android app icons & strings
│   ├── build.gradle           # Root Gradle script
│   └── variables.gradle       # Android SDK target versions (SDK 36)
├── capacitor.config.ts        # Capacitor configuration
├── src/
│   ├── components/            # TopBar, BottomNav, ServiceCard, ApplyModal, etc.
│   ├── context/               # AuthContext, LanguageContext
│   ├── data/                  # Service catalogue & business info
│   ├── firebase/              # Firebase client, auth, firestore error handling
│   ├── views/                 # Home, Services, Applications, Notifications, Profile
│   └── App.tsx                # Main application entry point
├── firebase-blueprint.json    # Firestore schema specification
├── firestore.rules            # Hardened zero-trust customer security rules
└── package.json               # Node dependencies & build scripts
```

---

## 🔒 Security & Privacy Notice
- **Firebase Authentication**: Secures customer identities with Google Sign-In.
- **Database Rules**: Only the authenticated owner user can view or submit their own applications (`resource.data.userId == request.auth.uid`).
- **No Client Secrets**: Cloud API tokens or admin credentials are never placed in frontend code.
