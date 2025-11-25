#!/bin/bash

# Belkhair Android Build Script
# This script helps you build the Android APK using EAS Build

echo "================================================"
echo "  Belkhair Android APK Build Script"
echo "================================================"
echo ""

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null; then
    echo "❌ EAS CLI is not installed."
    echo "📦 Installing EAS CLI..."
    npm install -g eas-cli
    echo "✅ EAS CLI installed successfully!"
    echo ""
fi

# Check if user is logged in
echo "🔐 Checking Expo authentication..."
if ! eas whoami &> /dev/null; then
    echo "❌ You are not logged in to Expo."
    echo "📝 Please login to your Expo account:"
    eas login
else
    EXPO_USER=$(eas whoami)
    echo "✅ Logged in as: $EXPO_USER"
fi
echo ""

# Display build options
echo "📱 Select build type:"
echo "  1) Development APK (for testing)"
echo "  2) Preview APK (for beta testing)"
echo "  3) Production AAB (for Play Store)"
echo ""
read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo ""
        echo "🔨 Building Development APK..."
        eas build --platform android --profile development
        ;;
    2)
        echo ""
        echo "🔨 Building Preview APK..."
        eas build --platform android --profile preview
        ;;
    3)
        echo ""
        echo "🔨 Building Production AAB..."
        eas build --platform android --profile production
        ;;
    *)
        echo "❌ Invalid choice. Exiting."
        exit 1
        ;;
esac

echo ""
echo "================================================"
echo "  Build process initiated!"
echo "================================================"
echo ""
echo "📊 You can monitor the build progress at:"
echo "   https://expo.dev/accounts/$(eas whoami)/projects/belkhair/builds"
echo ""
echo "⏱️  Build typically takes 10-20 minutes."
echo "📧 You'll receive an email when the build completes."
echo "📥 Download link will be available in the terminal and on the Expo website."
echo ""
