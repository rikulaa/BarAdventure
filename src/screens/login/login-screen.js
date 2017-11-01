import React, {Component} from 'react';
import Login from '../../components/login/login';

export default class LoginScreen extends Component {
  render() {
    return (
        <Login navigation={this.props.navigation} />
    );
  }
}