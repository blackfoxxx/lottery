# Quick Guide: Build Belkhair Android App

## 🚀 Fastest Method: Using the Build Script

We've created an automated script to make building the Android APK as simple as possible.

### Step 1: Run the Build Script

```bash
cd /home/ubuntu/belkhair-mobile
./build-android.sh
```

### Step 2: Follow the Prompts

The script will:
1. Check if EAS CLI is installed (and install it if needed)
2. Verify you're logged into Expo (and prompt you to login if not)
3. Ask you to choose a build type:
   - **Development APK** - For testing on your device
   - **Preview APK** - For beta testing with others
   - **Production AAB** - For uploading to Google Play Store

### Step 3: Wait for the Build

The build process runs on Expo's cloud servers and typically takes 10-20 minutes. You can:
- Monitor progress in the terminal
- Check the Expo website for build status
- Wait for the email notification when it's done

### Step 4: Download and Install

Once complete, you'll receive a download link. Download the APK to your Android device and install it.

**Note:** You may need to enable "Install from Unknown Sources" in your Android settings.

---

## 📱 Alternative: Test Without Building

If you just want to test the app quickly without building an APK:

### Step 1: Install Expo Go

Download the "Expo Go" app from the Google Play Store on your Android device.

### Step 2: Start the Development Server

```bash
cd /home/ubuntu/belkhair-mobile
npm start
```

### Step 3: Scan the QR Code

Open Expo Go on your device and scan the QR code shown in the terminal. The app will load instantly!

---

## 📚 Need More Details?

For comprehensive build instructions, troubleshooting, and advanced options, see:
- `ANDROID_BUILD_GUIDE.md` - Complete guide with all build methods
- `QUICK_START.md` - General setup and testing guide

---

## ✅ Pre-Build Checklist

Before building, make sure:
- [ ] Backend API is running and accessible
- [ ] API URL in `services/api.ts` points to your server
- [ ] You have an Expo account (free tier is fine)
- [ ] App configuration in `app.json` is correct

---

**Happy Building! 🎉**
