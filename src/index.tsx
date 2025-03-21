import ApkInstall from './NativeApkInstall';

export async function install(
  path: string,
  silent: boolean,
  listener: (status: number, message: string) => void
) {
  await ApkInstall.install(path, silent, listener);
}

export async function checkPermission(): Promise<boolean> {
  return await ApkInstall.checkPermission();
}

export async function requestPermission(): Promise<boolean> {
  return await ApkInstall.requestPermission();
}

export default {
  install,
  checkPermission,
  requestPermission,
};
