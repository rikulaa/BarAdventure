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

const contentOptions = {
  initialRouteName: 'Main',
  drawerPosition: 'left'

};

const SummaryRoutes = StackNavigator({
  Summary: {
    screen: SummaryScreen,
    navigationOptions: {
      title: 'Drink diary'
    }
  },
  SummaryDetail: {
    screen: SummaryDetailScreen,
    navigationOptions: {
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
        title: "Drink Diary"
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
