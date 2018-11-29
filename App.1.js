import React from 'react';
import { Platform, Image, Text, View } from 'react-native';
import firebase from 'react-native-firebase';
import type { RemoteMessage } from 'react-native-firebase';


export default class App extends React.Component {
    componentDidMount2() {


        const  email = "test2@test.fr";
        const password = "test2812"

        firebase.auth().signInWithEmailAndPassword(email, password)
		.then((user) => {
		  // If you need to do anything with the user, do it here
		  // The user will be logged in automatically by the 
		  // `onAuthStateChanged` listener we set up in App.js earlier
		  console.log("Firebase : connexion réussie pour l'utilisateur :   "+ user.user.email);
		 
		  alert("Firebase : connexion réussie pour l'utilisateur :  "+ user.user.email);			

		})
		.catch((error) => {
		  const { code, message } = error;
		  // For details of error codes, see the docs
		  // The message contains the default Firebase string
		  // representation of the error
		  console.log("KO: "+ message);
		  alert("KO");
		});			



        this.messageListener = firebase.messaging().onMessage((message: RemoteMessage) => {
            console.log("Process your message as required")
        });

        firebase.messaging().hasPermission()
        .then(enabled => {
            if (enabled) {
                console.log("user has permissions")
                this.notificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification: Notification) => {
                    // Process your notification as required
                    // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
                    console.log("notificationDisplayedListener")
                });

                this.notificationListener = firebase.notifications().onNotification((notification: Notification) => {
                    // Process your notification as required
                    console.log("notificationListener")
                    console.log(notification)
                    firebase.notifications().displayNotification(notification)
                });  
        
                this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen: NotificationOpen) => {
                    // Get the action triggered by the notification being opened
                    const action = notificationOpen.action;
                    console.log("notificationOpenedListener")
                    console.log(action)
                    // Get information about the notification that was opened
                    const notification: Notification = notificationOpen.notification;
                    console.log(notification)
                });
                firebase.notifications().getInitialNotification()
                .then((notificationOpen: NotificationOpen) => {
                    console.log("getInitialNotification")
                if (notificationOpen) {
                    console.log("getInitialNotification 2")
                    // App was opened by a notification
                    // Get the action triggered by the notification being opened
                    const action = notificationOpen.action;
                    // Get information about the notification that was opened
                    const notification: Notification = notificationOpen.notification;  
                }
                });
            } else {
            console.log("user doesn't have permission")
            } 
        });

        


    }

    componentWillUnmount2() {
        this.messageListener();
        this.notificationDisplayedListener();
        this.notificationListener();
        this.notificationOpenedListener();
    }


    componentDidMount() {

        const channel = new firebase.notifications.Android.Channel(
          'channelId',
          'Channel Name',
          firebase.notifications.Android.Importance.Max
        ).setDescription('A natural description of the channel');
        firebase.notifications().android.createChannel(channel);
        
        this.notificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification: Notification) => {
            // Process your notification as required
            // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
            console.log("notificationDisplayedListener")
        });

        this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen: NotificationOpen) => {
            // Get the action triggered by the notification being opened
            const action = notificationOpen.action;
            console.log("notificationOpenedListener")
            console.log(action)
            // Get information about the notification that was opened
            const notification: Notification = notificationOpen.notification;
            console.log(notification)
        });

        firebase.notifications().getInitialNotification()
            .then((notificationOpen: NotificationOpen) => {
            console.log("getInitialNotification")
                if (notificationOpen) {
                    console.log("getInitialNotification 2")
                    // App was opened by a notification
                    // Get the action triggered by the notification being opened
                    const action = notificationOpen.action;
                    // Get information about the notification that was opened
                    const notification: Notification = notificationOpen.notification;  
                }
            });
            
        // the listener returns a function you can use to unsubscribe
        this.unsubscribeFromNotificationListener = firebase.notifications().onNotification((notification) => {
          
            console.log("notificationListener")
            console.log(notification)

            if (Platform.OS === 'android') {
    
            const localNotification = new firebase.notifications.Notification({
                sound: 'default',
                show_in_foreground: true,
              })
              .setNotificationId(notification.notificationId)
              .setTitle(notification.title)
              .setSubtitle(notification.subtitle)
              .setBody(notification.body)
              .setData(notification.data)
              .android.setChannelId('channelId') // e.g. the id you chose above
              //.android.setSmallIcon('ic_stat_notification') // create this icon in Android Studio
              .android.setColor('#000000') // you can set a color here
              .android.setPriority(firebase.notifications.Android.Priority.High);
    
            firebase.notifications()
              .displayNotification(localNotification)
              .catch(err => console.error(err));
    
          } else if (Platform.OS === 'ios') {
    
            const localNotification = new firebase.notifications.Notification()
              .setNotificationId(notification.notificationId)
              .setTitle(notification.title)
              .setSubtitle(notification.subtitle)
              .setBody(notification.body)
              .setData(notification.data)
              .ios.setBadge(notification.ios.badge);
    
            firebase.notifications()
              .displayNotification(localNotification)
              .catch(err => console.error(err));
    
          }
        });
    
        // ...
      }
    
      componentWillUnmount() {
        // this is where you unsubscribe
        this.unsubscribeFromNotificationListener();
      }

    render(){
        return <View><Text>App</Text></View>
    }
    
}

