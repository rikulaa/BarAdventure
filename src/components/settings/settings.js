import React, {Component} from 'react';
import {Button, Text, Header, Spinner} from 'native-base';
import Container from '../container.js';
import {Alert} from 'react-native';
import firebase from '../../services/firebase';

export default class Settings extends Component {
  constructor(props) {
		super(props);
    this.state = {
			isLoading: false
    };
  }

  handleLogout() {
    Alert.alert( 'Logout?', 'Do you want to logout?', [
      {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
      {text: 'Yes, I want to logout', onPress: () => this.doLogout()}, ], { cancelable: false });
  }

  doLogout() {
    this.setState({isLoading: true});
    console.log('doLogout');
    firebase.auth().signOut().then(() => {

      this.setState({isLoading: false});
    }).catch((error) => {
      // An error happened.
      this.setState({isLoading: false});
      alert(error.message);
    });

  }
  render() {
    const {isLoading} = this.state;
    return(
      <Container>
        <Header>
          <Text>Settings</Text>
        </Header>
        {isLoading && <Spinner />}
        {!isLoading && <Button onPress={this.handleLogout.bind(this)}>
          <Text>Logout</Text>
        </Button>}
      </Container>
    );
  }
}
