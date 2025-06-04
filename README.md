THIS BRANCH IS FOR TESTING PURPOSES ONLY
CLONE THIS BRANCH, REBUILD AND INSTALL ON ANDROID EMULATOR DEVICE/IOS SIMULATOR.

Make sure you have the following installed on your computer:
- Android Stuido
- XCode
- yarn package manager
- expo GO (allows for phsyical device testing)
```bash

# inital install of the dependencies
npx expo install

# if you already have the dependencies installed, you can skip this step
rm -rf node_modules yarn.lock package-lock.json
rm -rf android/build android/app/build android/.gradle
rm -rf ios/Pods ios/Podfile.lock ios/build

# Reinstall dependencies
npx expo prebuild --clean
cd ios && pod install && cd ..
cd android && ./gradlew clean && cd ..

# uninstall from app
adb uninstall com.yourapp.sussySushi

# Rebuild the app
npx expo run:ios
npx expo run:android
```


you will know the error has been replicated if you see the following output:

```bash
> Configure project :react-native-reanimated
Android gradle plugin: 8.8.2
Gradle: 8.13

> Task :app:processDebugMainManifest
/Users/APPROOT_DIVIDENDO/blank-reactanimatedtest/my-app/android/app/src/debug/AndroidManifest.xml:6:5-162 Warning:
        application@android:usesCleartextTraffic was tagged at AndroidManifest.xml:6 to replace other declarations but no other declaration present
/Users/APPROOT_DIVIDENDO/blank-reactanimatedtest/my-app/android/app/src/debug/AndroidManifest.xml Warning:
        provider#expo.modules.filesystem.FileSystemFileProvider@android:authorities was tagged at AndroidManifest.xml:0 to replace other declarations but no other declaration present

> Task :react-native-edge-to-edge:compileDebugKotlin
w: file:///Users/APPROOT_DIVIDENDO/blank-reactanimatedtest/my-app/node_modules/react-native-edge-to-edge/android/src/main/java/com/zoontek/rnedgetoedge/EdgeToEdgePackage.kt:21:24 'constructor(name: String, className: String, canOverrideExistingModule: Boolean, needsEagerInit: Boolean, hasConstants: Boolean, isCxxModule: Boolean, isTurboModule: Boolean): ReactModuleInfo' is deprecated. This constructor is deprecated and will be removed in the future. Use ReactModuleInfo(String, String, boolean, boolean, boolean, boolean)].

> Task :app:buildCMakeDebug[arm64-v8a]
C/C++: ninja: Entering directory `/Users/APPROOT_DIVIDENDO/blank-reactanimatedtest/my-app/android/app/.cxx/Debug/721ua524/arm64-v8a'
C/C++: /Users/APPROOT_DIVIDENDO/blank-reactanimatedtest/my-app/node_modules/react-native-svg/android/build/generated/source/codegen/jni/react/renderer/components/rnsvg/EventEmitters.cpp:31:44: warning: '$' in identifier [-Wdollar-in-identifier-extension]
C/C++:    31 | void RNSVGImageEventEmitter::onLoad(OnLoad $event) const {
C/C++:       |                                            ^
C/C++: /Users/APPROOT_DIVIDENDO/blank-reactanimatedtest/my-app/node_modules/react-native-svg/android/build/generated/source/codegen/jni/react/renderer/components/rnsvg/EventEmitters.cpp:32:26: warning: '$' in identifier [-Wdollar-in-identifier-extension]
C/C++:    32 |   dispatchEvent("load", [$event=std::move($event)](jsi::Runtime &runtime) {
C/C++:       |                          ^
C/C++: /Users/APPROOT_DIVIDENDO/blank-reactanimatedtest/my-app/node_modules/react-native-svg/android/build/generated/source/codegen/jni/react/renderer/components/rnsvg/EventEmitters.cpp:32:43: warning: '$' in identifier [-Wdollar-in-identifier-extension]
C/C++:    32 |   dispatchEvent("load", [$event=std::move($event)](jsi::Runtime &runtime) {
C/C++:       |                                           ^
C/C++: /Users/APPROOT_DIVIDENDO/blank-reactanimatedtest/my-app/node_modules/react-native-svg/android/build/generated/source/codegen/jni/react/renderer/components/rnsvg/EventEmitters.cpp:33:10: warning: '$' in identifier [-Wdollar-in-identifier-extension]
C/C++:    33 |     auto $payload = jsi::Object(runtime);
C/C++:       |          ^
C/C++: /Users/APPROOT_DIVIDENDO/blank-reactanimatedtest/my-app/node_modules/react-native-svg/android/build/generated/source/codegen/jni/react/renderer/components/rnsvg/EventEmitters.cpp:36:40: warning: '$' in identifier [-Wdollar-in-identifier-extension]
C/C++:    36 |   source.setProperty(runtime, "width", $event.source.width);
C/C++:       |                                        ^
C/C++: /Users/APPROOT_DIVIDENDO/blank-reactanimatedtest/my-app/node_modules/react-native-svg/android/build/generated/source/codegen/jni/react/renderer/components/rnsvg/EventEmitters.cpp:37:41: warning: '$' in identifier [-Wdollar-in-identifier-extension]
C/C++:    37 |   source.setProperty(runtime, "height", $event.source.height);
C/C++:       |                                         ^
C/C++: /Users/APPROOT_DIVIDENDO/blank-reactanimatedtest/my-app/node_modules/react-native-svg/android/build/generated/source/codegen/jni/react/renderer/components/rnsvg/EventEmitters.cpp:38:38: warning: '$' in identifier [-Wdollar-in-identifier-extension]
C/C++:    38 |   source.setProperty(runtime, "uri", $event.source.uri);
C/C++:       |                                      ^
C/C++: /Users/APPROOT_DIVIDENDO/blank-reactanimatedtest/my-app/node_modules/react-native-svg/android/build/generated/source/codegen/jni/react/renderer/components/rnsvg/EventEmitters.cpp:39:3: warning: '$' in identifier [-Wdollar-in-identifier-extension]
C/C++:    39 |   $payload.setProperty(runtime, "source", source);
C/C++:       |   ^
C/C++: /Users/APPROOT_DIVIDENDO/blank-reactanimatedtest/my-app/node_modules/react-native-svg/android/build/generated/source/codegen/jni/react/renderer/components/rnsvg/EventEmitters.cpp:41:12: warning: '$' in identifier [-Wdollar-in-identifier-extension]
C/C++:    41 |     return $payload;
C/C++:       |            ^
C/C++: 9 warnings generated.
```


```bash
npx expo-doctor

13/15 checks passed. 2 checks failed. Possible issues detected:
Use the --verbose flag to see more details about passed checks.

✖ Check for app config fields that may not be synced in a non-CNG project
This project contains native project folders but also has native configuration properties in app.json, indicating it is configured to use Prebuild. When the android/ios folders are present, if you don't run prebuild in your build pipeline, the following properties will not be synced: orientation, icon, scheme, userInterfaceStyle, ios, android, plugins, androidStatusBar. 


✖ Validate packages against React Native Directory package metadata
The following issues were found when validating your dependencies against React Native Directory:
  No metadata available: @flaticon/flaticon-uicons, babel, expo-dev-client-components, expo-doctor, expo-module-scripts, unique-names-generator
Advice:
Update React Native Directory to include metadata for unknown packages. Alternatively, set expo.doctor.reactNativeDirectoryCheck.listUnknownPackages in package.json to false to skip warnings about packages with no metadata, if the warning is not relevant.

2 checks failed, indicating possible issues with the project.
```
= any changes or solution goes into feature/database_implementation
