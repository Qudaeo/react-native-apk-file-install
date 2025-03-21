import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  install(
    path: string,
    silent: boolean,
    listener: (status: number, message: string) => void
  ): void;
  checkPermission(): Promise<boolean>;
  requestPermission(): Promise<boolean>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('ApkInstall');
