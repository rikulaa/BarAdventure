import React, {Component} from 'react';
import Container from '../container';
import {View, Image, StyleSheet, Alert} from 'react-native';
import moment from 'moment';
import {Text, List, ListItem, Left, Icon, Right, Body, Spinner, Button} from 'native-base';
import {NavigationActions} from 'react-navigation'
import {GOOGLE_STATIC_MAPS_API_KEY} from '../../../env';

import {styles as globalStyles} from '../../res/styles';

import {getDurationBetweenDates} from '../../helpers/time';
import firebase, {DB_NAMES} from '../../services/firebase';

// const GOOGLE_MAPS_PREFIX = 'https://maps.googleapis.com/maps/api/staticmap?center=40.714%2c%20-73.998&zoom=12&size=800x800&key=';
const GOOGLE_MAPS_PREFIX = 'https://maps.googleapis.com/maps/api/staticmap?size=800x800&';

export default class SummaryDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      adventure: null,
      mapUrl: null
    }
    this.handleDelete = this.handleDelete.bind(this);
  }
  componentDidMount() {
    console.log(this.props, 'props in summary detail');
    // get the adventure from navigation params
    const adventure = this.props.navigation.state.params;
    const locations = !!adventure ? adventure.locations : [];
    let markerStartAndEndString = 'markers=color:red';
    let markerString = 'markers=color:blue|label:TEST';
    let paths = '&path=color:0x0000ff|weight:5';
    let markerLocations = '';
    locations.forEach((currentLocation, index) => {
      console.log(currentLocation, 'ccurrloca', index, 'index');
      markerLocations = markerLocations + '|' + String(currentLocation.latitude) + ',' + String(currentLocation.longitude);
      paths = paths + '|' + String(currentLocation.latitude) + ',' + String(currentLocation.longitude);
      console.log(markerLocations, 'lcscscs');
    });

    markerString = markerString + markerLocations;
    const mapUrl = GOOGLE_MAPS_PREFIX + markerString + paths + '&key=' + GOOGLE_STATIC_MAPS_API_KEY;
    this.setState({adventure, mapUrl, loading: false});
  }

  handleDelete() {
    const {adventure: {id, userUid}} = this.state;
    const {navigation} = this.props;
    let updates = {};
    updates[id] = null;
    Alert.alert('Forget?', 'Do you really wish to forget this one?', [
      {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
      {
        text: 'Yes, I want to forget', onPress: () => {
          updates[DB_NAMES.users + '/' + userUid + '/adventures/' + id] = null
          firebase.database().ref(DB_NAMES.adventures).update(updates);
          navigation.dispatch(
            NavigationActions.reset(
              {index: 0, actions: [NavigationActions.navigate({routeName: 'Summary'})]}
            )
          );
        }
      }], {cancelable: false})
  }


  render() {
    const {adventure, mapUrl, loading} = this.state;

    if (loading) return (
      <View>
          <Spinner />
      </View>
    );

    const totalTime = adventure.start_time - adventure.end_time;
    console.log(adventure.end_time - adventure.start_time, 'start and end');
    const durations = getDurationBetweenDates(adventure.end_time, adventure.start_time);
    console.log(totalTime, 'totalTime', durations);
    return (
      <View style={[{flex: 1}]}>
        <Image resizeMode='cover' style={{width: '100%', height: 300}} source={{uri: mapUrl}} />
        <View style={[styles.textContent]}>
          <Text style={[styles.text]}>Total drinks: {adventure.drink_count}</Text>
          <Text style={[styles.text]}>Duration of your adventure: {durations.days} days, {durations.hours} hours, {durations.minutes} minutes and {durations.seconds} seconds</Text>
          <Image source={require('../../res/assets/images/drunk_owl.png')} style={{width: 200, height: 200}} />
          <Button onPress={() => this.handleDelete()} style={[styles.deleteButton, globalStyles.centerVertical, globalStyles.centerHorizontal]}>

            <Text>Forget plz..</Text>
          </Button>
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  textContent: {
    padding: 20
  },
  text: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 5
  },
  deleteButton: {
    marginTop: 30
  }
})
