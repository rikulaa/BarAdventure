import React, {Component} from 'react';
import Container from '../container';
import {Text, Button} from 'native-base';

import {DeviceEventEmitter} from 'react-native';
// var { DeviceEventEmitter } = React;

// var { RNLocation: Location } = require('NativeModules');
import Location from 'react-native-gps';


import {styles} from '../../res/styles';

export default class TrackingContainer extends Component {
  constructor(props) {
    super(props);

    Location.requestWhenInUseAuthorization();

    // Location.startUpdatingLocation();

  
    this.state = {
      latitude: null,
      longitude: null,
      error: null,
    };
    this.getLocation = this.getLocation.bind(this);
    this.nullLocation = this.nullLocation.bind(this);
  }

  componentDidMount() {
    var subscription = DeviceEventEmitter.addListener(
      'locationUpdated',
      (location) => {
        console.log('location updated', location);
        this.setState({latitude: location.latitude, longitude: location.longitude});
        /* Example location returned
        {
          speed: -1,
          longitude: -0.1337,
          latitude: 51.50998,
          accuracy: 5,
          heading: -1,
          altitude: 0,
          altitudeAccuracy: -1
        }
        */
      }
    );

  }
  componentWillUnmount() {
    // Location.stopUpdatingLocation();
    // DeviceEventEmitter.removeAllListeners();
  }

  getLocation() {
    Location.startUpdatingLocation();
    setTimeout(function() {
      Location.stopUpdatingLocation();
    }, 1000);
    // Location.stopUpdatingLocation();
    // navigator.geolocation.getCurrentPosition(
    //   (position) => {
    //     this.setState({
    //       latitude: position.coords.latitude,
    //       longitude: position.coords.longitude,
    //       error: null,
    //     });
    //   },
    //   (error) => this.setState({error: error.message}),
    //   {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    // );
  }

  nullLocation() {
    this.setState({
      latitude: null,
      longitude: null,
      error: null,
    });
  }
  render() {
    return (
      <Container style={styles.centerContent}>
        <Text style={[styles.textPrimary, {marginBottom: 20}]}>
          Current Bar: 
        </Text>
        <Text style={[styles.textPrimary, {marginBottom: 10}]}>
          Current location
        </Text>
        <Text style={[styles.textPrimary]}>
          Latitude: {this.state.latitude}
        </Text>
        <Text style={[styles.textPrimary, {marginBottom: 50}]}>
          Longitude: {this.state.longitude}
        </Text>
        <Button style={[styles.buttonRounded, styles.verticalMargin, styles.centerHorizontal, {width: 200, height: 200}]} onPress={this.getLocation}>
          <Text>Drink!</Text>
        </Button>

        <Button style={[styles.verticalMargin, styles.centerHorizontal]} onPress={this.nullLocation}>
          <Text>Oops, mistake!</Text>
        </Button>
      </Container >
    );
  }
}