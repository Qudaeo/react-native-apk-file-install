package com.apkinstall

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.pm.PackageInstaller
import android.os.Build

class PackageInstallerStatusReceiver : BroadcastReceiver() {

  override fun onReceive(context: Context, intent: Intent) {
    when (val status = intent.getIntExtra(PackageInstaller.EXTRA_STATUS, -1)) {
      PackageInstaller.STATUS_PENDING_USER_ACTION -> {
        val confirmationIntent = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
          intent.getParcelableExtra(Intent.EXTRA_INTENT, Intent::class.java)
        } else {
          @Suppress("DEPRECATION") intent.getParcelableExtra(Intent.EXTRA_INTENT)
        }
        if (confirmationIntent != null) {
          confirmationIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
          context.startActivity(confirmationIntent)
        }
      }

      PackageInstaller.STATUS_SUCCESS -> {
        ApkInstallModule.onStatusReceive(status, "OK")
      }

      else -> {
        val message = intent.getStringExtra(PackageInstaller.EXTRA_STATUS_MESSAGE)
        println("PackageInstallerStatusReceiver: status=$status, message=$message")
        ApkInstallModule.onStatusReceive(status, message)
      }
    }
  }
}
