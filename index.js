import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './package.json';

// React Native Maps 설정 (Android)
import { enableScreens } from 'react-native-screens';
enableScreens();

AppRegistry.registerComponent(appName, () => App);