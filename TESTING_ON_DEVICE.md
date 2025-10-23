# Testing ModestApp on Your iPhone

This guide will help you test the ModestApp on your physical iPhone device.

## Prerequisites

1. **Mac Computer** with Xcode installed
2. **iPhone** with iOS 13.0 or later
3. **Apple Developer Account** (free account works)
4. **USB Cable** to connect iPhone to Mac

## Setup Steps

### 1. Install Xcode (if not already installed)

```bash
# Download from Mac App Store or use:
xcode-select --install
```

### 2. Install Dependencies

Make sure all npm packages are installed:

```bash
cd /Users/alencengic/Documents/Projects/ReactNative/ModestApp
npm install
```

### 3. Install CocoaPods (iOS dependencies)

```bash
# Install CocoaPods if you don't have it
sudo gem install cocoapods

# Install iOS dependencies
cd ios
pod install
cd ..
```

### 4. Configure Environment Variables

Make sure your `.env` file has the Weather API key:

```bash
WEATHER_API_KEY=your_api_key_here
```

## Testing Methods

### Method 1: Using Expo Go App (Easiest)

This is the quickest way to test on your device:

1. **Install Expo Go** on your iPhone from the App Store

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Scan the QR code** that appears in your terminal using your iPhone camera

4. The app will open in Expo Go automatically

**Note:** This method has some limitations with native modules. For full functionality, use Method 2.

### Method 2: Using Expo Dev Client (Recommended)

This provides a complete development experience with all native modules:

1. **Connect your iPhone** to your Mac via USB cable

2. **Trust your Mac** on your iPhone (popup will appear on first connection)

3. **Build the development client:**
   ```bash
   npx expo run:ios --device
   ```

4. **Select your device** when prompted

5. **Trust the developer certificate:**
   - On your iPhone, go to: Settings > General > VPN & Device Management
   - Tap on your Apple ID
   - Tap "Trust"

6. The app will install and launch on your iPhone

### Method 3: Using EAS Build (For Production Testing)

This creates a production-like build that you can install:

1. **Install EAS CLI:**
   ```bash
   npm install -g eas-cli
   ```

2. **Login to your Expo account:**
   ```bash
   eas login
   ```

3. **Configure your project:**
   ```bash
   eas build:configure
   ```

4. **Create a development build:**
   ```bash
   eas build --profile development --platform ios
   ```

5. **Install on device:**
   - Download the IPA file from the EAS build page
   - Or scan the QR code to install directly

## Common Issues and Solutions

### Issue: "Developer Mode Required" (iOS 16+)

**Solution:**
1. Go to Settings > Privacy & Security > Developer Mode
2. Enable Developer Mode
3. Restart your iPhone

### Issue: "Untrusted Developer"

**Solution:**
1. Go to Settings > General > VPN & Device Management
2. Find your Apple ID under "Developer App"
3. Tap "Trust [Your Apple ID]"

### Issue: "No devices found"

**Solution:**
1. Make sure your iPhone is connected via USB
2. Unlock your iPhone
3. Trust the computer when prompted
4. In Xcode, go to Window > Devices and Simulators
5. Verify your device appears in the list

### Issue: Build fails with "Could not find iPhone"

**Solution:**
```bash
# Clean and rebuild
cd ios
rm -rf build
pod deintegrate
pod install
cd ..
npx expo run:ios --device
```

### Issue: Weather API not working

**Solution:**
1. Verify your `.env` file contains the API key
2. Restart the development server
3. Check your internet connection on the device
4. Allow location permissions when prompted

## Device Testing Checklist

Once the app is running on your device, test these features:

- [ ] **Onboarding Screen** - Should appear on first launch
- [ ] **Location Permission** - Grant location access for weather features
- [ ] **Mood Tracking** - Log a mood entry with current weather
- [ ] **Food Intake** - Add breakfast, lunch, dinner, snacks
- [ ] **Daily Journal** - Write, edit, and delete journal entries
- [ ] **Trends Screen** - View food intake charts
- [ ] **Weather & Mood** - Check weather-mood correlations
- [ ] **Analytics** - Test mood and food analytics screens
- [ ] **Navigation** - Test all tabs and screen transitions
- [ ] **Info Buttons** - Verify info modals on weather and analytics screens

## Quick Start Commands

```bash
# Start development server
npm start

# Run on connected iPhone
npx expo run:ios --device

# Run in iOS Simulator (for comparison)
npm run ios

# Clear cache if issues occur
npx expo start --clear

# Rebuild with fresh install
rm -rf node_modules
npm install
npx expo run:ios --device
```

## Performance Tips

1. **Enable Production Mode** for better performance:
   ```bash
   npx expo start --no-dev --minify
   ```

2. **Close other apps** on your iPhone to free up memory

3. **Use Release build** for final testing:
   ```bash
   npx expo run:ios --device --configuration Release
   ```

## App Features to Test

### Core Features:
1. **Mood Tracking** with weather correlation
2. **Food Intake Logging** with symptom tracking
3. **Daily Journaling** with edit/delete capabilities
4. **Analytics & Trends** with visual charts
5. **Weather Integration** with location-based data

### UI/UX Features:
1. Smooth navigation between tabs
2. Form validation and error messages
3. Loading states and spinners
4. Empty states when no data
5. Modal popups and info buttons

## Troubleshooting Resources

- **Expo Documentation**: https://docs.expo.dev/guides/
- **React Native Docs**: https://reactnative.dev/docs/running-on-device
- **Expo Discord**: https://chat.expo.dev/
- **Stack Overflow**: Search for "Expo iOS device testing"

## Contact Information

If you encounter any issues during testing, make note of:
- Error messages (screenshot them)
- Steps to reproduce the issue
- iOS version on your device
- Xcode version on your Mac

## Next Steps After Testing

Once you've verified the app works correctly on your device:

1. **Build for TestFlight** (optional):
   ```bash
   eas build --profile production --platform ios
   ```

2. **Submit to App Store** (when ready):
   - Create an app in App Store Connect
   - Upload your build via EAS or Xcode
   - Fill in app information and screenshots
   - Submit for review

---

**Happy Testing! 🎉**
