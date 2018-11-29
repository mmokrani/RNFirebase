/** @format */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import bgMessaging from './bgMessaging'; // <-- Import the file you created in (2)
import bgActions from './bgActions'; // <-- Import the file you created in (2)


// Current main application
AppRegistry.registerComponent(appName, () => App);
// New task registration
AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => bgMessaging); // <-- Add this line

// New task registration
//AppRegistry.registerHeadlessTask('RNFirebaseBackgroundNotificationAction', () => bgActions); // <-- Add this line




