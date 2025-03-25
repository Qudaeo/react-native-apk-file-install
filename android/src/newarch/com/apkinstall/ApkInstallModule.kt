package com.apkinstall

import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule

@ReactModule(name = ApkInstallImpl.NAME)
class ApkInstallModule(reactContext: ReactApplicationContext) :
  NativeApkInstallSpec(reactContext) {

  private var implementation: ApkInstallImpl = ApkInstallImpl(reactContext)

  override fun getName(): String {
    return ApkInstallImpl.NAME
  }

  override fun install(
    path: String,
    silent: Boolean,
    listener: Callback,
  ) {
    implementation.install(path, silent, listener)
  }

  override fun checkPermission(promise: Promise?) {
    implementation.checkPermission(promise)
  }

  override fun requestPermission() {
    implementation.requestPermission()
  }

  override fun checkVerifyAppsEnabled(promise: Promise?) {
    implementation.checkVerifyAppsEnabled(promise)
  }
}
