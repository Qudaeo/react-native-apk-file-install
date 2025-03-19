# react-native-apk-file-install

APK-file package installer for React Native

## Installation

```sh
yarn add react-native-apk-install
npm install react-native-apk-install
```

## Usage


```js
import { checkPermission, requestPermission, install } from 'react-native-apk-file-install';

const checkPermissionResult = await checkPermission();
const requestPermissionResult = await requestPermission();

const installResult = await install(
  UPDATE_APK_FILE, // path to apk file on device (${Dirs.CacheDir}/update.apk)
  true, // silient
  (status, message) => {
    console.log({ status, message });
  } // status listener
);
```

## License

MIT
