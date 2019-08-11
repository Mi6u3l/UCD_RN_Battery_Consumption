import React, { Component } from 'react';
import { Platform, Text, View, StyleSheet, Button, ToolbarAndroid } from 'react-native';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

export default class App extends Component {
  state = {
    location: null,
    feedBackMessage: null,
  };

  startGPSTest = () => {
        this.getLocation();  
  }

  getLocation = () => {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        feedBackMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        feedBackMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location });
  };

  render() {
    let text = '';
    if (this.state.feedBackMessage) {
      text = this.state.feedBackMessage;
    } else if (this.state.location) {
      let latitude = parseFloat(this.state.location.coords.latitude);
      let longitude = parseFloat(this.state.location.coords.longitude);
      text = `Latitude ${latitude.toFixed(7)} Longitude: ${longitude.toFixed(7)}`;
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
  paragraph: {
    margin: 24,
    fontSize: 16,
    textAlign: 'center',
  },
   toolbar: {
   backgroundColor: '#2196F3',
   height: 56,
   marginBottom: 10,
   alignSelf: 'stretch',
   textAlign: 'center',
 },
});