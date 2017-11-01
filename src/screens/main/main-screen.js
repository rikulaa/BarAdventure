import React, { Component } from 'react';
import {
  StyleSheet
} from 'react-native';

import Tracking from '../../components/main/tracking';

// const instructions = Platform.select({
//   ios: 'Press Cmd+R to reload,\n' +
//     'Cmd+D or shake for dev menu',
//   android: 'Double tap R on your keyboard to reload,\n' +
//     'Shake or press menu button for dev menu he',
// });


export default class HomeScreen extends Component {
  render() {
   return (
     <Tracking />
   );
  }
}