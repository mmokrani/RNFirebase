import React, { Component } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import firebase from "react-native-firebase";
let VeryExpensive = null;

export default class Optimized extends Component {
  state = { needsExpensive: false };

  didPress = () => {
    if (VeryExpensive == null) {
      VeryExpensive = require("./VeryExpensive").default;
    }

    this.setState(() => ({
      needsExpensive: true
    }));
  };
  //
  componentDidMount() {
    const email = "test222@test.fr";
    const password = "test2812";
    alert(email);
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(user => {
        // If you need to do anything with the user, do it here
        // The user will be logged in automatically by the
        // `onAuthStateChanged` listener we set up in App.js earlier
        console.log(
          "Firebase : connexion réussie pour l'utilisateur :   " +
            user.user.email
        );

        alert(
          "Firebase : connexion réussie pour l'utilisateur :  " +
            user.user.email
        );
      })
      .catch(error => {
        const { code, message } = error;
        // For details of error codes, see the docs
        // The message contains the default Firebase string
        // representation of the error
        console.log("KO: " + message);
        alert("KO");
      });

    firebase
      .messaging()
      .hasPermission()
      .then(enabled => {
        if (enabled) {
          console.log("User has permissions");
        } else {
          console.log("user doesn't have permission");
        }
      });

    firebase
      .messaging()
      .requestPermission()
      .then(() => {
        console.log("User has authorised");
      })
      .catch(error => {
        console.log("User has rejected permissions");
      });

    const channel = new firebase.notifications.Android.Channel(
      "channelId",
      "Channel Name",
      firebase.notifications.Android.Importance.Max
    ).setDescription("A natural description of the channel");
    firebase.notifications().android.createChannel(channel);

    this.messageListener = firebase
      .messaging()
      .onMessage((message: RemoteMessage) => {
        console.log("Message listner");
      });

    this.notificationDisplayedListener = firebase
      .notifications()
      .onNotificationDisplayed((notification: Notification) => {
        // Process your notification as required
        // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
        console.log("notificationDisplayedListener");
        console.log(notification);
      });

    this.notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened((notificationOpen: NotificationOpen) => {
        // Get the action triggered by the notification being opened
        const action = notificationOpen.action;
        console.log("notificationOpenedListener");
        console.log(action);
        // Get information about the notification that was opened
        const notification: Notification = notificationOpen.notification;
        console.log(notification);
      });

    // If your app is closed
    this.getInitialNotification = firebase
      .notifications()
      .getInitialNotification()
      .then((notificationOpen: NotificationOpen) => {
        console.log("getInitialNotification");
        if (notificationOpen) {
          console.log("getInitialNotification 2");
          // App was opened by a notification
          // Get the action triggered by the notification being opened
          const action = notificationOpen.action;
          // Get information about the notification that was opened
          const notification: Notification = notificationOpen.notification;
        }
      });

    // the listener returns a function you can use to unsubscribe
    this.unsubscribeFromNotificationListener = firebase
      .notifications()
      .onNotification(notification => {
        console.log("notificationListener");
        console.log(notification);

        if (Platform.OS === "android") {
          const localNotification = new firebase.notifications.Notification({
            sound: "default",
            show_in_foreground: true
          })
            .setNotificationId(notification.notificationId)
            .setTitle(notification.title)
            .setSubtitle(notification.subtitle)
            .setBody(notification.body)
            .setData(notification.data)
            .android.setChannelId("channelId") // e.g. the id you chose above
            //.android.setSmallIcon('ic_stat_notification') // create this icon in Android Studio
            .android.setColor("#000000") // you can set a color here
            .android.setPriority(firebase.notifications.Android.Priority.High);

          // Display the notification
          firebase
            .notifications()
            .displayNotification(localNotification)
            .catch(err => console.error(err));
          /*
          // Build an action
          const action = new firebase.notifications.Android.Action(
            "test_action",
            "ic_launcher",
            "My Test Action"
          );

          // Build a remote input
          const remoteInput = new firebase.notifications.Android.RemoteInput(
            "inputText"
          ).setLabel("Message");

          // Add the remote input to the action
          action.addRemoteInput(remoteInput);

          // Add the action to the notification
          notification.android.addAction(action);
          firebase
            .notifications()
            .displayNotification(localNotification)
            .catch(err => console.error(err));

          // Build your notification
          /*
            const notification = new firebase.notifications.Notification()
            .setTitle('Android Notification Actions')
            .setBody('Action Body')
            .setNotificationId('notification-action')
            .setSound('default')
            .android.setChannelId('notification-action')
            .android.setPriority(firebase.notifications.Android.Priority.Max);
            // Build an action
            const action = new firebase.notifications.Android.Action('snooze', 'ic_launcher', 'My Test Action');
            // This is the important line
            action.setShowUserInterface(false);
            // Add the action to the notification
            notification.android.addAction(action);

            // Display the notification
            firebase.notifications().displayNotification(notification).catch(err => console.error(err));
            */
        } else if (Platform.OS === "ios") {
          const localNotification = new firebase.notifications.Notification()
            .setNotificationId(notification.notificationId)
            .setTitle(notification.title)
            .setSubtitle(notification.subtitle)
            .setBody(notification.body)
            .setData(notification.data)
            .ios.setBadge(notification.ios.badge);

          firebase
            .notifications()
            .displayNotification(localNotification)
            .catch(err => console.error(err));
        }
      });

    // ...
  }

  componentWillUnmount() {
    // this is where you unsubscribe
    this.unsubscribeFromNotificationListener();
    this.notificationDisplayedListener();
    this.notificationOpenedListener();
    this.getInitialNotification();
    this.messageListener();
  }
  render() {
    return (
      <View style={{ marginTop: 20 }}>
        <TouchableOpacity onPress={this.didPress}>
          <Text>Load</Text>
        </TouchableOpacity>
        {this.state.needsExpensive ? <VeryExpensive /> : null}
      </View>
    );
  }
}
