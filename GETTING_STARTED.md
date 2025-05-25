# Getting Started with FoodConnect Mobile App

This guide will help you set up and run the FoodConnect mobile app on your device using Visual Studio Code.

## Prerequisites

Before you begin, make sure you have the following installed:

1. **Node.js** (v14 or newer): [Download Node.js](https://nodejs.org/)
2. **Visual Studio Code**: [Download VS Code](https://code.visualstudio.com/)
3. **Git**: [Download Git](https://git-scm.com/downloads)

## Setting Up Your Development Environment

### Step 1: Install React Native CLI

Open a terminal or command prompt and run:

\`\`\`bash
npm install -g react-native-cli
\`\`\`

### Step 2: Install Required Development Tools

#### For Android Development:

1. **Install Android Studio**: [Download Android Studio](https://developer.android.com/studio)
2. **Set up Android SDK**:
   - Open Android Studio
   - Go to "SDK Manager"
   - Install Android SDK Platform 31 (or newer)
   - Install Android SDK Build-Tools
   - Install Android Emulator
   - Install HAXM (for faster emulation)

3. **Set up environment variables**:
   - Add ANDROID_HOME to your environment variables (path to your Android SDK)
   - Add platform-tools to your PATH

#### For iOS Development (Mac only):

1. **Install Xcode**: Download from the Mac App Store
2. **Install CocoaPods**:
   \`\`\`bash
   sudo gem install cocoapods
   \`\`\`

### Step 3: Clone and Set Up the Project

1. **Clone the repository**:
   \`\`\`bash
   git clone <repository-url>
   cd restaurantorderingapp
   \`\`\`

2. **Install dependencies**:
   \`\`\`bash
   npm install
   \`\`\`

3. **Install pod dependencies (iOS only)**:
   \`\`\`bash
   cd ios && pod install && cd ..
   \`\`\`

## Running the App on Your Device

### Option 1: Using a Physical Device

#### For Android:

1. **Enable Developer Options and USB Debugging**:
   - Go to Settings > About Phone
   - Tap "Build Number" 7 times to enable Developer Options
   - Go to Settings > Developer Options
   - Enable "USB Debugging"

2. **Connect your device**:
   - Connect your Android device to your computer with a USB cable
   - Allow USB debugging when prompted on your device

3. **Run the app**:
   \`\`\`bash
   npx react-native run-android
   \`\`\`

#### For iOS (Mac only):

1. **Register your device in Xcode**:
   - Open Xcode
   - Connect your iOS device
   - Sign in with your Apple ID
   - Register your device for development

2. **Run the app**:
   \`\`\`bash
   npx react-native run-ios --device
   \`\`\`

### Option 2: Using an Emulator/Simulator

#### For Android:

1. **Create a virtual device**:
   - Open Android Studio
   - Go to "AVD Manager"
   - Click "Create Virtual Device"
   - Select a device and system image (API 31 or newer recommended)
   - Create and start the virtual device

2. **Run the app**:
   \`\`\`bash
   npx react-native run-android
   \`\`\`

#### For iOS (Mac only):

1. **Run the app**:
   \`\`\`bash
   npx react-native run-ios
   \`\`\`

## Troubleshooting Common Issues

### App Crashes on Start

1. **Clean the build**:
   \`\`\`bash
   # For Android
   cd android && ./gradlew clean && cd ..
   
   # For iOS
   cd ios && pod install && cd ..
   \`\`\`

2. **Clear cache**:
   \`\`\`bash
   npm start -- --reset-cache
   \`\`\`

### Build Fails

1. **Check Node.js version**:
   \`\`\`bash
   node -v
   \`\`\`
   Make sure it's v14 or newer.

2. **Update dependencies**:
   \`\`\`bash
   npm update
   \`\`\`

### Device Not Detected

1. **For Android**:
   - Make sure USB debugging is enabled
   - Try a different USB cable
   - Run `adb devices` to check if your device is detected

2. **For iOS**:
   - Make sure your device is trusted on your Mac
   - Check if your Apple Developer account has proper permissions

## Using the App

Once the app is running on your device:

1. You'll see the splash screen followed by the login screen
2. You can create a new account or use these test credentials:
   - Email: john@example.com
   - Password: password123
3. Browse restaurants, add items to your cart, and place orders

## Development Tips

1. **Enable Hot Reloading**:
   - Shake your device to open the developer menu
   - Select "Enable Hot Reloading"

2. **View Logs**:
   \`\`\`bash
   # For Android
   adb logcat *:S ReactNative:V ReactNativeJS:V
   
   # For iOS
   npx react-native log-ios
   \`\`\`

3. **Install VS Code Extensions**:
   - React Native Tools
   - ESLint
   - Prettier
   - TypeScript React code snippets

## Need Help?

If you encounter any issues not covered in this guide, please:
1. Check the React Native documentation: [reactnative.dev](https://reactnative.dev/)
2. Search for your issue on Stack Overflow
3. Contact our development team for support
