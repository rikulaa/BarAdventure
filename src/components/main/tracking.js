import React, {Component} from 'react';
import Container from '../container';
import {Text, Button, H1, Spinner} from 'native-base';


import {DeviceEventEmitter, Alert, Image} from 'react-native';

import firebase, {DB_NAMES, adventures} from '../../services/firebase';

import moment from 'moment';

import {getCurrentPosition} from '../../services/geolocation';

import {styles as globalStyles} from '../../res/styles';
import {getDistanceInKmBetweenCoordinates} from '../../helpers/location';

const getCurrentAdventureByKey = (adventureKey) => {
  return new Promise((resolve, reject) => {
    firebase.database().ref(DB_NAMES.adventures + '/' + adventureKey).on('value', (snapshot) => {
      resolve(snapshot.val());
    })
  })
}
const fetchPreviousAdventure = (uid) => {
  return new Promise((resolve, reject) => {
    firebase.database().ref(DB_NAMES.adventures)
      .orderByChild("userUid")
      .equalTo(uid)
      .limitToLast(1)
      .once('value').then((snapshot) => {
        const adventures = !!snapshot.val() ? Object.keys(snapshot.val()).map((id, index) => {
          return snapshot.val()[id];
        }) : []
       const lastAdventure = !!adventures ? adventures[0] : {};
       resolve(lastAdventure);
      }).catch(er => {
        console.log(er);
      });
  });
};



const createNewAdventure = () => {
    return firebase.database().ref(DB_NAMES.adventures).push().key;
}

export default class Tracking extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      error: null,
      adventureKey: null,
      adventure: null,
      user: null
    };

    this.startNewAdventure = this.startNewAdventure.bind(this);
    this.continueAdventure = this.continueAdventure.bind(this);
    this.endAdventure = this.endAdventure.bind(this);
    this.handleDrinkButtonClick = this.handleDrinkButtonClick.bind(this);
    this.handleAlert = this.handleAlert.bind(this);
    this.alertCheck = this.alertCheck.bind(this);
    this.checkUncompleteAdventure = this.checkUncompleteAdventure.bind(this);
  }

  componentDidMount() {
    const currentUser = firebase.auth().currentUser;
    this.setState({user: currentUser});
    this.checkUncompleteAdventure(currentUser.uid);
  }

  checkUncompleteAdventure(uid) {
    this.setState({loading: true});
    const getPreviousAdventure = fetchPreviousAdventure(uid);
    getPreviousAdventure.then(adventure => {
      console.log(adventure, 'fetced previous');
      if (!!adventure && !adventure.completed) {
        console.log('previous adventure was not completed');
        this.setState({adventure, adventureKey: adventure.id, loading: false});
      } else {
        this.setState({loading: false});
      }
    }).catch(er => {
      console.log('error fetching previous adventure');
      this.setState({loading: false});
    });
  }

  handleDrinkButtonClick() {
      if (this.state.adventureKey) {
       this.continueAdventure();

        this.alertCheck();
      } else {
       this.startNewAdventure();
      }
    }

  continueAdventure() {
    // const getAdventure = getCurrentAdventureByKey(this.state.adventureKey);
    const getPosition = getCurrentPosition();

    // const promises = [getAdventure, getPosition];
    // Promise.all(promises).then(resolvedPromises => {
      getPosition.then((pos) => {
      const currentAdventure = this.state.adventure;
      // const currentLocation = resolvedPromises[1];
      const currentLocation = pos;
      const locations = [...currentAdventure.locations, currentLocation];

      const updatedAdventure = {
        ...currentAdventure,
        drink_count: currentAdventure.drink_count + 1,
        locations
      };

      let updates = {};
      updates[this.state.adventureKey] = updatedAdventure;
      this.setState({adventure: updatedAdventure});

      firebase.database().ref(DB_NAMES.adventures).update(updates);
    }).catch(er => {
      console.log(er)
    })
  }

  alertCheck() {
    const {adventure} = this.state;
    const drinkCount = adventure.drink_count;
    let alertOptions = {
      title: "",
      content: "",
      successText: "",
      successAction: null,
      abortText: "",
      abortAction: null,
    };

    switch (drinkCount) {
      case 4:
        alertOptions.title = "Time to call a taxi";
        alertOptions.content = "Jyväskylä Local Taxi: 0100 6900";
        alertOptions.successText = "Yes, please";
        alertOptions.successAction = console.log("Yuub");
        alertOptions.abortText = "I Was just StArting";
        this.handleAlert(alertOptions);
        break;
      case 14:
        alertOptions.title = "Your drink count is now 15";
        alertOptions.content = "Was it worth it?";
        alertOptions.successText = "Hell no!";
        alertOptions.successAction = console.log("Yuub");
        alertOptions.abortText = "YAAAAASSSS";
        this.handleAlert(alertOptions);
        break;
      case 49:
        alertOptions.title = "Your drink count is now 50";
        alertOptions.content = "I think you need to go to hospital";
        alertOptions.successText = "Y2es, please";
        alertOptions.successAction = console.log("Yuub");
        alertOptions.abortText = "It was an accident";
        this.handleAlert(alertOptions);
        break;
        }

  }

    handleAlert(alertOptions) {
    Alert.alert(
      alertOptions.title,
      alertOptions.content,
   [
        {text: alertOptions.successText, onPress: () => alertOptions.successAction},
        {text: alertOptions.abortText, onPress: () => alertOptions.abortAction}
]);
}

  startNewAdventure() {
    console.log('no adventure found');
    // get the new adventure key before pushing data to firebase
    const newAdventureKey = createNewAdventure();
    const {user} = this.state;

    // save key
    this.setState({adventureKey: newAdventureKey});

    // create new object
    const getPosition = getCurrentPosition();
    getPosition.then((pos) => {
      const location = pos;
      const now = pos.timestamp;

      const newAdventure = {
        id: newAdventureKey,
        drink_count: 1,
        start_time: now,
        end_time: '',
        total_time: '',
        locations: [location],
        completed: false,
        userUid: user.uid
      };

      let updates = {};
      updates[newAdventureKey] = newAdventure;
      this.setState({adventure: newAdventure});

      // update firebase db
      firebase.database().ref(DB_NAMES.adventures).update(updates);

      // add reference with user
      firebase.database().ref(DB_NAMES.users).child(user.uid).child('adventures').push({adventureId: newAdventureKey});

    }).catch(er => {
      console.log(er);
    });
  }

  endAdventure() {
    if (this.state.adventureKey) {
      // fetch the current adventure
      const getAdventure = getCurrentAdventureByKey(this.state.adventureKey);
      const getPosition = getCurrentPosition();

      Promise.all([getAdventure, getPosition]).then(resolvedPromises => {
        const currentAdventure = resolvedPromises[0];
        const currentLocation = resolvedPromises[1];
        // update currentAdventure
        const locations = [...currentAdventure.locations, currentLocation];
        const now = currentLocation.timestamp;
        const start = locations[0].timestamp;
        const total_time = start - now;


        const updatedAdventure = {
          ...currentAdventure,
          locations,
          completed: true,
          end_time: now,
          total_time
        };

        let updates = {};
        updates[this.state.adventureKey] = updatedAdventure;

        this.setState({adventure: null});

        firebase.database().ref(DB_NAMES.adventures).update(updates);
        this.setState({adventureKey: null})
      }).catch(er => {
        console.log(er);
      })
    }
  }



  render() {
    console.log(this.state, 'this.state');
    const {adventure, loading} = this.state;

    if (loading) return (
      <Container style={[globalStyles.centerContent]}>
        <Spinner style={[globalStyles.centerHorizontal, globalStyles.centerVertical]} />
      </Container>
    )

    let travelledDistance = 0;
    if (!!adventure && !!adventure.locations && adventure.locations.length) {
      adventure.locations.map((location, index) => {
        const previousValue = adventure.locations[index - 1];
        const currentValue = location;
        const distanceBetweenPrevious = getDistanceInKmBetweenCoordinates(previousValue, currentValue);
        travelledDistance = travelledDistance + distanceBetweenPrevious;
      })
    }

    return (
      <Container style={globalStyles.centerContent}>
       <H1>Bar Adventure</H1>
      <Image source={require('../../res/assets/images/owl.png')} style={{width: 300, height: 300}} />

        <Text style={[globalStyles.textPrimary, {marginBottom: 20}]}>
          Current drink count: {!!adventure ? adventure.drink_count : 0}
        </Text>
      <Text style={[globalStyles.textPrimary, {marginBottom: 50}]}>
          Travelled distance: {travelledDistance.toFixed(2)} km
        </Text>

        <Button style={[globalStyles.verticalMargin, globalStyles.centerHorizontal]} onPress={this.handleDrinkButtonClick}>
          <Text>Drink!</Text>
        </Button>
         <Button danger style={[globalStyles.verticalMargin, globalStyles.centerHorizontal]} onPress={this.endAdventure}>
          <Text>I'm done..</Text>
        </Button>
      </Container >
    );
  }
}
