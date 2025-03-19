import { useState } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import {
  checkPermission,
  requestPermission,
  install,
} from 'react-native-apk-file-install';
import { Dirs, FileSystem } from 'react-native-file-access';
import { apkUrl } from './config.example';

type Result = boolean | 'in progress' | 'unknown' | 'exception';

const UPDATE_APK_FILE = `${Dirs.CacheDir}/update.apk`;

export default function App() {
  const [checkPermissionResult, setCheckPermissionResult] =
    useState<Result>('unknown');
  const [requestPermissionResult, setRequestPermissionResult] =
    useState<Result>('unknown');
  const [installResult, setInstallResult] = useState<Result>('unknown');
  const [installStatus, setInstallStatus] = useState<{
    status: number;
    message: string;
  } | null>(null);

  const apkInstallCheckPermission = async () => {
    try {
      setCheckPermissionResult('in progress');
      const result = await checkPermission();
      setCheckPermissionResult(result);
    } catch (e) {
      setCheckPermissionResult('exception');
      console.error('checkPermission', e);
    }
  };

  const apkInstallRequestPermission = async () => {
    try {
      setRequestPermissionResult('in progress');
      const result = await requestPermission();
      setRequestPermissionResult(result);
    } catch (e) {
      setRequestPermissionResult('exception');
      console.error('requestPermission', e);
    }
  };

  const installApk = async () => {
    try {
      setInstallResult('in progress');

      const downloadResult = await FileSystem.fetch(apkUrl, {
        path: UPDATE_APK_FILE,
      });

      if (downloadResult.ok) {
        const result = await install(
          UPDATE_APK_FILE,
          true,
          (status, message) => {
            setInstallStatus({ status, message });
          }
        );
        setInstallResult(result);
      }
    } catch (e) {
      setInstallResult('exception');
      console.error('install', e);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Button title={'checkPermission'} onPress={apkInstallCheckPermission} />
        <Text>{`Result: ${checkPermissionResult}`}</Text>
      </View>
      <View style={styles.row}>
        <Button
          title={'requestPermission'}
          onPress={apkInstallRequestPermission}
        />
        <Text>{`Result: ${requestPermissionResult}`}</Text>
      </View>
      <View style={styles.row}>
        <Button title={'install'} onPress={installApk} />
        <Text>{`Result: ${installResult}`}</Text>
      </View>
      {installStatus && <Text>{JSON.stringify(installStatus)}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    gap: 16,
  },
  button: {
    width: 1000,
  },
});
