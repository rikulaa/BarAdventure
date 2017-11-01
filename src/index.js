import React, { Component } from 'react';

import {Root} from 'native-base';

// navigator (routes)
import {LoggedInRoutes, LoggedOutRoutes} from './navigators';

export default class App extends Component {
  render() {
    const isLoggedIn = true;
    return (
      <Root>
          {isLoggedIn && <LoggedInRoutes />}
          {!isLoggedIn && <LoggedOutRoutes />}
      </Root>
    );
  }
}