import React, {Component} from 'react';
import Container from '../container';
import {Text, Button} from 'native-base';

import {DeviceEventEmitter} from 'react-native';

import firebase, {DB_NAMES, adventures} from '../../services/firebase';

import moment from 'moment';

import {styles} from '../../res/styles';

export default class Tracking extends Component {
  constructor(props) {
    super(props);

    this.state = {
      latitude: null,
      longitude: null,
      error: null,
      adventureKey: null,
      user: null
    };
    this.getLocation = this.getLocation.bind(this);
    this.nullLocation = this.nullLocation.bind(this);
    this.startNewAdventure = this.startNewAdventure.bind(this);
    this.continueAdventure = this.continueAdventure.bind(this);
    this.endAdventure = this.endAdventure.bind(this);
  }

  componentDidMount() {
    this.setState({user: firebase.auth().currentUser});
  }


  getLocation() {
      if (this.state.adventureKey) {
       this.continueAdventure();
      } else {
       this.startNewAdventure();
      }
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

    const currentLocation = {latitude: "21", longitude: "21"};
    // update currentAdventure
    currentAdventure.then((snapshot) => {
      console.log(snapshot, 'snapshot');
      const locations = [...snapshot.locations, currentLocation];

      const updatedAdventure = {
        ...snapshot,
        drink_count: snapshot.drink_count + 1,
        locations
      };

      let updates = {};
      updates[this.state.adventureKey] = updatedAdventure;
      this.setState({updates});

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
    const location = {latitude: "21", longitude: "21"};

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

    // add reference with user
    const {user} = this.state;
    firebase.database().ref(DB_NAMES.users).child(user.uid).child('adventures').push({adventureId: newAdventureKey});

    this.setState({updates});


    console.log(newAdventureKey, 'newAdventruekey');
  }

  endAdventure() {
    if (this.state.adventureKey) {
      // fetch the current adventure
      let currentAdventure = new Promise(
        (resolve, reject) => {
          firebase.database().ref(DB_NAMES.adventures + '/' + this.state.adventureKey).on('value', (snapshot) => {
            resolve(snapshot.val());
          })
        }
      );

      const currentLocation = {latitude: "21", longitude: "21"};
      // update currentAdventure
      currentAdventure.then((snapshot) => {
        console.log(snapshot, 'snapshot');
        const locations = [...snapshot.locations, currentLocation];

        const updatedAdventure = {
          ...snapshot,
          locations,
          completed: true
        };

        let updates = {};
        updates[this.state.adventureKey] = updatedAdventure;

        this.setState({updates});

        firebase.database().ref(DB_NAMES.adventures).update(updates);
        this.setState({adventureKey: null})
      });
    }
  }

  nullLocation() {
    this.setState({
      latitude: null,
      longitude: null,
      error: null,
    });
  }
  render() {
    console.log(this.state, 'this.state');
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

        <Button style={[styles.verticalMargin, styles.centerHorizontal]} onPress={this.endAdventure}>
          <Text>I'm done..</Text>
        </Button>
      </Container >
    );
  }
}
