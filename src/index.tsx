import ApkInstall from './NativeApkInstall';

export async function install(
  path: string,
  silent: boolean,
  listener: (status: number, message: string) => void
) {
  await ApkInstall.install(path, silent, listener);
}

export async function checkPermission() {
  return await ApkInstall.checkPermission();
}

export async function requestPermission() {
  await ApkInstall.requestPermission();
}

export default {
  install,
  checkPermission,
  requestPermission,
};
