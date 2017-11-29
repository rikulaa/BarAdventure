import React, {Component} from 'react';
import {Icon, Button} from 'native-base';
import {DrawerNavigator, StackNavigator} from 'react-navigation';

import LoginScreen from '../screens/login/login-screen';
import RegisterScreen from '../screens/register/register-screen';
import MainScreen from '../screens/main/main-screen';
import SummaryScreen from '../screens/summary/summary-screen';
import SummaryDetailScreen from '../screens/summary/summary-detail-screen';
import TestScreen from '../screens/test/test';
import SettingsScreen from '../screens/settings/settings-screen';

// const headerLeft = navigation => (
//   <Button transparent onPress={_ => navigation.navigate('DrawerOpen')}>
//       <Icon ios="ios-menu" android="md-menu" style={{color: '#fff'}} />
//   </Button>
// );

const contentOptions = {
  initialRouteName: 'Main',
  drawerPosition: 'left'

};

const SummaryRoutes = StackNavigator({
  Summary: {
    screen: SummaryScreen,
    navigationOptions: {
      title: 'Adventures'
    }
  },
  SummaryDetail: {
    screen: SummaryDetailScreen,
    navigationOptions: {
      title: 'Adventures'
    }
  }
})


export const LoggedInRoutes = DrawerNavigator({
    Main: {
      screen: MainScreen,
      navigationOptions: {
        headerLeft: <Icon ios="ios-menu" android="md-menu" style={{color: '#fff'}} />,
        title: "Let's Drink!"
      }
    },
    Summary: {
      screen: SummaryRoutes,
      navigationOptions: {
        title: "What did I do??"
      }
    },
    Settings: {
      screen: SettingsScreen,
      navigationOptions: {
        title: 'Settings'
      }
  	}
  },
  contentOptions
);

export const LoggedOutRoutes = StackNavigator({
  Login: {
    screen: LoginScreen,
    navigationOptions: {
      headerLeft: null,
      title: 'Login',
    }
  },
  Register: {
    screen: RegisterScreen,
    navigationOptions: {
      title: 'Register'
    }
  }
})
