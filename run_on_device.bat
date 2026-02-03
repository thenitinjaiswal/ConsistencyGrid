@echo off
echo ========================================
echo   ConsistencyGrid Android Builder
echo ========================================

echo.
echo [1/4] Checking for connected devices...
adb devices

echo.
echo [2/4] Building APK...
cd android

if not exist gradlew.bat (
    echo ==================================================================
    echo ERROR: Gradle Wrapper (gradlew.bat) is missing!
    echo.
    echo Since the Android project was recreated from scratch, the Gradle 
    echo wrapper binaries are missing.
    echo.
    echo PLEASE DO THIS ONCE:
    echo 1. Open the "android" folder in Android Studio
    echo 2. Allow it to sync/configure (this generates gradlew)
    echo 3. Run this script again
    echo ==================================================================
    cd ..
    pause
    exit /b 1
)

call gradlew.bat assembleDebug
if %ERRORLEVEL% NEQ 0 (
    echo Build failed!
    cd ..
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo [3/4] Installing APK...
adb install -r app\build\outputs\apk\debug\app-debug.apk

echo.
echo [4/4] Launching App...
adb shell am start -n com.consistencygrid/.MainActivity

cd ..
echo.
echo Done! App should be running on your device.
pause
