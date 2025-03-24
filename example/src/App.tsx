import { useState } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import {
  checkPermission,
  requestPermission,
  install,
} from 'react-native-apk-file-install';
import { Dirs, FileSystem } from 'react-native-file-access';
import { apkUrl } from './config.example';

type Result =
  | boolean
  | 'in progress'
  | 'finish'
  | 'unknown'
  | 'exception'
  | `exception ${any}`
  | 'downloading'
  | 'installing start'
  | 'installing started'
  | `download error ${number} ${string}`;

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
      await requestPermission();
      setRequestPermissionResult('finish');
    } catch (e) {
      setRequestPermissionResult('exception');
      console.error('requestPermission', e);
    }
  };

  const installApk = async () => {
    setInstallStatus(null);
    try {
      setInstallResult('downloading');

      const downloadResult = await FileSystem.fetch(apkUrl, {
        path: UPDATE_APK_FILE,
      });

      if (downloadResult.ok) {
        setInstallResult('installing start');
        await install(UPDATE_APK_FILE, true, (status, message) => {
          setInstallStatus({ status, message });
        });
        setInstallResult('installing started');
      } else {
        setInstallResult(
          `download error ${downloadResult.status} ${downloadResult.statusText}` as const
        );
      }
    } catch (e) {
      // @ts-ignore
      setInstallResult(`exception ${e?.message}` as const);
      console.error('install', e);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Button title={'checkPermission'} onPress={apkInstallCheckPermission} />
        <Text style={styles.text}>{`Result: ${checkPermissionResult}`}</Text>
      </View>
      <View style={styles.row}>
        <Button
          title={'requestPermission'}
          onPress={apkInstallRequestPermission}
        />
        <Text style={styles.text}>{`Result: ${requestPermissionResult}`}</Text>
      </View>
      <View style={styles.row}>
        <Button title={'install'} onPress={installApk} />
        <Text style={styles.text}>{`Result: ${installResult}`}</Text>
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
  text: {
    flexShrink: 1,
  },
});
