package com.yokohama.warrantyapp;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

import java.io.File;

public class RootChecker extends ReactContextBaseJavaModule {

    public RootChecker(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "RootChecker"; // Module name for JavaScript
    }

    @ReactMethod
    public void isDeviceRooted(Callback callback) {
        try {
            boolean isRooted = checkRoot();
            callback.invoke(null, isRooted); // Success: No error, return result
        } catch (Exception e) {
            callback.invoke(e.getMessage(), false); // Error: Pass the exception message
        }
    }

    private boolean checkRoot() {
        // Paths to check for root binaries
        String[] paths = {
            "/system/xbin/su",
            "/system/bin/su",
            "/sbin/su",
            "/system/app/Superuser.apk",
            "/system/etc/init.d"
        };

        // Check if any of the files exist
        for (String path : paths) {
            File file = new File(path);
            if (file.exists()) {
                return true; // Root detected
            }
        }

        // Additional check: look for writable system directory
        try {
            File testFile = new File("/system/test_su");
            if (testFile.createNewFile()) {
                testFile.delete();
                return true; // Root detected if file creation was possible
            }
        } catch (Exception ignored) {
        }

        // Check for root management apps
        String[] rootApps = {
            "com.noshufou.android.su", // Superuser
            "eu.chainfire.supersu",   // SuperSU
            "com.koushikdutta.superuser" // Koush's Superuser
        };

        for (String app : rootApps) {
            try {
                getReactApplicationContext().getPackageManager().getPackageInfo(app, 0);
                return true; // Root management app detected
            } catch (Exception ignored) {
            }
        }

        // No root detected
        return false;
    }
}
