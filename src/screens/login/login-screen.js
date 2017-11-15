import React, {Component} from 'react';
import {Container, Content} from 'native-base';
import Login from '../../components/login/login';
// import Container from '../../components/container';

export default class LoginScreen extends Component {
  render() {
    return (
      <Container>
        <Content>
          <Login navigation={this.props.navigation} />
        </Content>
      </Container>
    );
  }
}
