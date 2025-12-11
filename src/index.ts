import ApkInstall from './NativeApkInstall';

export function install(
  path: string,
  silent: boolean,
  listener: (status: number, message: string) => void
) {
  return ApkInstall.install(path, silent, listener);
}

export function checkPermission() {
  return ApkInstall.checkPermission();
}

export function requestPermission() {
  return ApkInstall.requestPermission();
}

export function checkVerifyAppsEnabled() {
  return ApkInstall.checkVerifyAppsEnabled();
}

export default {
  install,
  checkPermission,
  requestPermission,
  checkVerifyAppsEnabled,
};
