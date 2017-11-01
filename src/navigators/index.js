import React, {Component} from 'react';
import {Icon, Button} from 'native-base';
import {DrawerNavigator, StackNavigator} from 'react-navigation';

import MainScreen from '../screens/main/main-screen';
import SummaryScreen from '../screens/summary/summary-screen';
import TestScreen from '../screens/test/test';

// const headerLeft = navigation => (
//   <Button transparent onPress={_ => navigation.navigate('DrawerOpen')}>
//       <Icon ios="ios-menu" android="md-menu" style={{color: '#fff'}} />
//   </Button>
// );

const contentOptions = {
  initialRouteName: 'Main',
  drawerPosition: 'left'

};


export const RootNavigator = DrawerNavigator({
    Main: {
      screen: MainScreen,
      navigationOptions: {
        headerLeft: <Icon ios="ios-menu" android="md-menu" style={{color: '#fff'}} />,
        title: "Let's Drink!"
      }
    },
    Summary: {
      screen: SummaryScreen,
      navigationOptions: {
        title: "What did I do??"
      }
    }
  },
  contentOptions
);