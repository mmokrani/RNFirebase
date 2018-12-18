import React from "react";
import {
  StyleSheet,
  Platform,
  Button,
  Text,
  View,
  TextInput
} from "react-native";
import firebase from "react-native-firebase";

export default class Main extends React.Component {
  state = { currentUser: "" };
  componentDidMount() {
    const { currentUser } = firebase.auth();
    this.setState({ currentUser });

    firebase
      .messaging()
      .getToken()
      .then(fcmToken => {
        if (fcmToken) {
          // user has a device token
          console.log("Token :" + fcmToken);
        } else {
          // user doesn't have a device token yet
          console.log("user doesn't have a device token yet");
        }
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
            .android.setSmallIcon("@mipmap/ic_notification") // create this icon in Android Studio
            .android.setColor("#000000") // you can set a color here
            .android.setPriority(firebase.notifications.Android.Priority.High);

          // Display the notification
          firebase
            .notifications()
            .displayNotification(localNotification)
            .catch(err => console.error(err));
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
  }

  componentWillUnmount() {
    // this is where you unsubscribe
    this.unsubscribeFromNotificationListener();
    this.notificationDisplayedListener();
    this.notificationOpenedListener();
    this.getInitialNotification();
    this.messageListener();
  }
  addSubject = () => {
    const title = this.state.subjectText;
    const subjectsRef = firebase.firestore().collection("subjects");
    subjectsRef.add({
      author: "TJ",
      title: title
    });

    const notificationRequests = firebase
      .firestore()
      .collection("notificationRequests");

    notificationRequests.add({
      from_username: "TJ",
      message: "just posted new topic " + title
    });

    /*
    const subjectsRef = firebase.database().ref("subjects");
    const notificationReqsRef = firebase.database().ref("notificationRequests");
    const subjectData = {
      author: "TJ",
      title: this.state.subjectText
    };
    const notificationReq = {
      from_username: "TJ",
      message: `just posted new topic "${this.state.topicText}"`
    };

    const newSubjectKey = subjectsRef.push().key;
    const newNotificationReqKey = notificationReqsRef.push().key;

    console.log("newSubjectKey : " + newSubjectKey);
    console.log("newNotificationReqKey : " + newNotificationReqKey);
    const updates = {};
    updates[`/topics/${newSubjectKey}`] = subjectData;
    updates[`/notificationRequests/${newNotificationReqKey}`] = notificationReq;
    firebase
      .database()
      .ref()
      .update(updates);
    */
    this.setState({
      subjectText: ""
    });
  };
  render() {
    const { currentUser } = this.state;
    return (
      <View style={styles.container}>
        <Text>Hi {currentUser && currentUser.email}!</Text>
        <Text>Liste des Topics</Text>
        <Text>- Sport : </Text>
        <Button title="souscrire" onPress={() => subscribeToTopic("sport")} />
        <Button
          title="se désinscrire"
          onPress={() => unsubscribeFromTopic("sport")}
        />

        <Text>- Météo : </Text>
        <Button title="souscrire" onPress={() => subscribeToTopic("meteo")} />
        <Button
          title="se désinscrire"
          onPress={() => unsubscribeFromTopic("meteo")}
        />
        <TextInput
          placeholder="Subject"
          onChangeText={subjectText => this.setState({ subjectText })}
        />
        <Button title="Add Subject" onPress={() => this.addSubject()} />
        <Button title="logout" onPress={() => signOutUser()} />
      </View>
    );
  }
}

subscribeToTopic = async topicName => {
  console.log(`subscribeToTopic ${topicName}`);
  firebase.messaging().subscribeToTopic(topicName);
};
unsubscribeFromTopic = async topicName => {
  console.log(`unsubscribeFromTopic ${topicName}`);
  firebase.messaging().unsubscribeFromTopic(topicName);
};
signOutUser = async () => {
  try {
    await firebase.auth().signOut();
  } catch (e) {
    console.log(e);
  }
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
