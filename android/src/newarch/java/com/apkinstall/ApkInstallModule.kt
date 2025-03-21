package com.apkinstall

import android.app.PendingIntent
import android.content.Intent
import android.content.pm.PackageInstaller
import android.net.Uri
import android.os.Build
import android.provider.Settings
import androidx.core.net.toUri
import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule
import java.io.File

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
    return implementation.checkPermission(promise)
  }

  override fun requestPermission(promise: Promise?) {
    return implementation.requestPermission(promise)
  }
}
