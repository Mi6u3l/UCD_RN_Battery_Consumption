import React, { Component } from "react";
import {
  Platform,
  Text,
  View,
  StyleSheet,
  Button,
  ToolbarAndroid,
  Vibration
} from "react-native";
import { Audio } from "expo-av";
import Constants from "expo-constants";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import Torch from "react-native-torch";
import * as Calendar from "expo-calendar";
import * as Speech from "expo-speech";

export default class App extends Component {
  state = {
    location: null,
    feedBackMessage: null,
    torchOn: false
  };

  startGPSTest = () => {
    this.getLocation();
  };

  toggleFlashLight = () => {
    Torch.switchState(true);
    this.setState({ torchOn: !this.torchOn });
  };

  vibrate = () => {
    Vibration.vibrate(2000);
  };

  playSound = () => {
    const soundObject = new Audio.Sound();
    soundObject.loadAsync(require('./assets/sounds/sound.mp3'))
      .then(() => {
        soundObject.playAsync(); 
      });
    
  };
  
  getLocation = () => {
    if (Platform.OS === "android" && !Constants.isDevice) {
      this.setState({
        feedBackMessage:
          "Oops, this will not work on Sketch in an Android emulator. Try it on your device!"
      });
    } else {
      this._getLocationAsync();
    }
  };

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      this.setState({
        feedBackMessage: "Permission to access location was denied"
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location });
  };

  getCalendar = () => {
    this._getCalendarAsync();
  };

  _getCalendarAsync = async () => {
      const { status } = await Permissions.askAsync(Permissions.CALENDAR);
      if (status === 'granted') {
        const calendars = await Calendar.getCalendarsAsync();
        this.setState({
          feedBackMessage:
          calendars[0].title
        });
    }
  };

  speak() {
    var stringToSpeak = "UCD Advanced Software Engineering";
    Speech.speak(stringToSpeak);
  }

  render() {
    let text = "";
    if (this.state.feedBackMessage) {
      text = this.state.feedBackMessage;
    } else if (this.state.location) {
      let latitude = parseFloat(this.state.location.coords.latitude);
      let longitude = parseFloat(this.state.location.coords.longitude);
      text = `Latitude ${latitude.toFixed(7)} Longitude: ${longitude.toFixed(
        7
      )}`;
    }

    return (
      <View style={styles.container}>
        <ToolbarAndroid
          style={styles.toolbar}
          title="UCD ASE React Native energy consumption test app"
        />

        <Button
          onPress={this.startGPSTest}
          title="Get Current Location"
          className="button"
        />
        <Text style={styles.text}></Text>
        <Button
          onPress={this.toggleFlashLight}
          title="Toggle Flash Light"
          className="button"
        />
        <Text style={styles.text}></Text>
        <Button
          onPress={this.vibrate}
          title="Vibrate"
          className="button"
        />
        <Text style={styles.text}></Text>
        <Button
          onPress={this.playSound}
          title="Play sound"
          className="button"
        />
        <Text style={styles.text}></Text>
        <Button
          onPress={this.getCalendar}
          title="Get calendar"
          className="button"
        />
        <Text style={styles.text}></Text>
        <Button
          onPress={this.speak}
          title="Speak"
          className="button"
        />
        <View style={styles.container}>
          <Text style={styles.paragraph}>{text}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#ecf0f1"
  },
  paragraph: {
    margin: 24,
    fontSize: 16,
    textAlign: "center"
  },
  toolbar: {
    backgroundColor: "#2196F3",
    height: 56,
    marginBottom: 10,
    alignSelf: "stretch",
    textAlign: "center"
  },
  text: {
    height: 10
  }
});
