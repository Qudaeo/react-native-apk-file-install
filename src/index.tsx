import ApkInstall from './NativeApkInstall';

export async function install(
  path: string,
  silent: boolean,
  onStatusReceive: (status: number, message: string) => void
): Promise<boolean> {
  return await ApkInstall.install(path, silent, onStatusReceive);
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
