import React, {Component} from 'react';
import Container from '../container';
import {Text, Button} from 'native-base';

import {styles} from '../../res/styles';

export default class TrackingContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      latitude: null,
      longitude: null,
      error: null,
    };
    this.getLocation = this.getLocation.bind(this);
    this.nullLocation = this.nullLocation.bind(this);
  }

  getLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
        });
      },
      (error) => this.setState({error: error.message}),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
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