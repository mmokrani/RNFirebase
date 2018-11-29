import firebase from 'react-native-firebase';
// Optional flow type
import type { NotificationOpen } from 'react-native-firebase';

export default async (notificationOpen: NotificationOpen) => {

    console.log("snooze KO")

    if (notificationOpen.action === 'snooze') {
        // handle the action
        console.log("snooze")
        console.log(notificationOpen)
    }

    return Promise.resolve();
}