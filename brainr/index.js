/**
 * @format
 */

// Import Reanimated configuration first
import './reanimated-babel';
import 'react-native-gesture-handler';

import { registerRootComponent } from 'expo';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// Register the app component with Expo
registerRootComponent(App);

// Also register with React Native's AppRegistry for compatibility
AppRegistry.registerComponent(appName, () => App);
