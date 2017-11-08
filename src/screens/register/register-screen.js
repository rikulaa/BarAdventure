import React, {Component} from 'react';
import {Container, Content, Text} from 'native-base';
import Register from '../../components/register/register';

export default class RegisterScreen extends Component {
  render() {
    return (
        <Register navigation={this.props.navigation} />
    );
  }
}
