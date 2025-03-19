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

@ReactModule(name = ApkInstallModule.NAME)
class ApkInstallModule(reactContext: ReactApplicationContext) :
  NativeApkInstallSpec(reactContext) {

  override fun getName(): String {
    return NAME
  }

  override fun install(
    path: String,
    silent: Boolean,
    listener: Callback,
    promise: Promise?
  ) {
    onStatusReceive = listener

    val apkFile = File(path)
    if (!apkFile.exists()) {
      promise?.reject("101", "file not exist. $path")
      return
    }

    val sessionParams = PackageInstaller.SessionParams(PackageInstaller.SessionParams.MODE_FULL_INSTALL)
    if (silent && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
      sessionParams.setRequireUserAction(PackageInstaller.SessionParams.USER_ACTION_NOT_REQUIRED)
    }
    val packageInstaller = reactApplicationContext.packageManager.packageInstaller
    val sessionId = packageInstaller.createSession(sessionParams)
    val session = packageInstaller.openSession(sessionId)

    val apkUri = apkFile.toUri()

    reactApplicationContext.contentResolver.openInputStream(apkUri).use { apkStream ->
      if (apkStream == null) {
        promise?.reject("102", "$apkUri: InputStream was null")
        return
      }

      val sessionStream = session.openWrite(NAME, 0, -1)
      sessionStream.buffered().use { bufferedSessionStream ->
        apkStream.copyTo(bufferedSessionStream)
        bufferedSessionStream.flush()
        session.fsync(sessionStream)
      }
    }

    val receiverIntent = Intent(reactApplicationContext, PackageInstallerStatusReceiver::class.java)
    val flags = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
      PendingIntent.FLAG_MUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
    } else {
      PendingIntent.FLAG_UPDATE_CURRENT
    }
    val receiverPendingIntent = PendingIntent.getBroadcast(reactApplicationContext, 0, receiverIntent, flags)
    session.commit(receiverPendingIntent.intentSender)
    session.close()

    promise?.resolve(true)
  }

  override fun checkPermission(promise: Promise?) {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
      promise?.resolve(true)
    } else {
      promise?.resolve(reactApplicationContext.packageManager.canRequestPackageInstalls())
    }
  }

  override fun requestPermission(promise: Promise?) {
    val packageURI = Uri.parse("package:" + reactApplicationContext.packageName)
    val packageManager = reactApplicationContext.packageManager

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      if (!packageManager.canRequestPackageInstalls()) {
        val intent = Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES, packageURI)
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        reactApplicationContext.startActivity(intent)
      }
    }

    promise?.resolve(true)
  }

  companion object {
    const val NAME = "ApkInstall"
    lateinit var onStatusReceive: Callback
  }
}
