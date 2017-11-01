import React, {Component} from 'react';
import Container from '../container';
import {Text, Button} from 'native-base';

import {DeviceEventEmitter} from 'react-native';

import Location from 'react-native-gps';
import firebase, {DB_NAMES, adventures} from '../../services/firebase';

import moment from 'moment';

import {styles} from '../../res/styles';

export default class TrackingContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      latitude: null,
      longitude: null,
      error: null,
      adventureKey: null
    };
    this.getLocation = this.getLocation.bind(this);
    this.nullLocation = this.nullLocation.bind(this);
    this.startNewAdventure = this.startNewAdventure.bind(this);
    this.continueAdventure = this.continueAdventure.bind(this);
  }

  componentDidMount() {
    Location.requestWhenInUseAuthorization();
    DeviceEventEmitter.addListener(
      'locationUpdated',
      (location) => {
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
    Location.startUpdatingLocation();

  }
  componentWillUnmount() {
    console.log('will unmount ');
    Location.stopUpdatingLocation();
    // DeviceEventEmitter.removeAllListeners();
  }

  getLocation() {
      Location.startUpdatingLocation();

      if (this.state.adventureKey) {
       this.continueAdventure(); 
      } else {
       this.startNewAdventure(); 
      }
      setTimeout(function () {
        Location.stopUpdatingLocation();
      }, 1000);
    }

  continueAdventure() {
    console.log('adventure id found');
    // fetch the current adventure
    let currentAdventure = new Promise(
      (resolve, reject) => {
        firebase.database().ref(DB_NAMES.adventures + '/' + this.state.adventureKey).on('value', (snapshot) => {
          resolve(snapshot.val());
        })
      }
    );

    const currentLocation = {latitude: this.state.latitude, longitude: this.state.longitude};
    // update currentAdventure
    currentAdventure.then((snapshot) => {
      console.log(snapshot, 'snapshot');
      const locations = [...snapshot.locations, currentLocation];

      const updatedAdventure = {
        ...snapshot,
        locations
      };

      let updates = {};
      updates[this.state.adventureKey] = updatedAdventure;
      firebase.database().ref(DB_NAMES.adventures).update(updates);
    });
  }

  startNewAdventure() {
    console.log('no adventure found');
    // get the new adventure key before pushing data to firebase
    const newAdventureKey = firebase.database().ref(DB_NAMES.adventures).push().key;

    // save key
    this.setState({adventureKey: newAdventureKey});

    const now = moment().format();
    // create new object
    const location = {latitude: this.state.latitude, longitude: this.state.longitude};

    const newTrackingEvent = {
      drink_count: 1,
      start_time: now,
      end_time: '',
      total_time: '',
      locations: [location],
      completed: false
    };

    let updates = {};
    updates[newAdventureKey] = newTrackingEvent;

    // update firebase db
    firebase.database().ref(DB_NAMES.adventures).update(updates);

    console.log(newAdventureKey, 'newAdventruekey');
  }

  nullLocation() {
    Location.stopUpdatingLocation();
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