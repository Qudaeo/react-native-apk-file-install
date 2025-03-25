package com.apkinstall

import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class ApkInstallModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  private var implementation: ApkInstallImpl = ApkInstallImpl(reactContext)

  override fun getName(): String {
    return ApkInstallImpl.NAME
  }

  @ReactMethod
  fun install(
    path: String,
    silent: Boolean,
    listener: Callback,
  ) {
    implementation.install(path, silent, listener)
  }

  @ReactMethod
  fun checkPermission(promise: Promise?) {
    implementation.checkPermission(promise)
  }

  @ReactMethod
  fun requestPermission() {
    implementation.requestPermission()
  }

  @ReactMethod
  fun checkVerifyAppsEnabled(promise: Promise?) {
    implementation.checkVerifyAppsEnabled(promise)
  }
}
