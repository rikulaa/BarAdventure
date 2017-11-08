import React, { Component } from 'react';

import {Root, Spinner} from 'native-base';

// navigator (routes)
import {LoggedInRoutes, LoggedOutRoutes} from './navigators';

import firebase from './services/firebase';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      isLoading: false
    };

  }

  componentDidMount() {
    const self = this;
    this.setState({isLoading: true});
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        console.log(user, 'signed in');
        var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        var providerData = user.providerData;
        self.setState({user, isLoggedIn: true, isLoading: false});
      } else {
        // User is signed out.
        // ...
        console.log('user signed out');
        self.setState({user: null, isLoggedIn: false, isLoading: false});
      }
    });
  }
  render() {
    console.log(this.state, 'ROOT');
    const {isLoggedIn, isLoading} = this.state;
    return (
      <Root>
        {isLoading && <Spinner />}
        {isLoggedIn && !isLoading && <LoggedInRoutes />}
        {!isLoggedIn && !isLoading && <LoggedOutRoutes />}
      </Root>
    );
  }
}
