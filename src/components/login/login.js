import React, {Component} from 'react';
import Container from '../container';
import {Alert} from 'react-native';
import {Content, Item, Form, Input, Text, Button} from 'native-base';

import firebase from '../../services/firebase';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };
  }

  handleLogin() {
    const {email, password} = this.state;
    console.log(email, password);
    if (!email || !password) {
      Alert.alert( 'Error', 'Please input email/password to login', [{text: 'OK', onPress: () => console.log('OK Pressed')}, ], { cancelable: false } )
    } else {
      firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
        console.log('auth ok');
      }).catch((error) => {
        console.warn(error);
        Alert.alert('Error', error.message, [{text: 'OK', onPress: () => console.log('erro ok')}]);
      });
    }
  }

  render() {
    const {navigation} = this.props;
    console.log('this', this.state);


    return (
      <Container>
        <Content>
          <Form>
            <Item>
            <Input onChangeText={(email) => this.setState({email})} placeholder="Email" />
            </Item>
            <Item last>
            <Input onChangeText={(password) => this.setState({password})} placeholder="Password" />
            </Item>
            <Button onPress={this.handleLogin.bind(this)}>
              <Text>
                Login
              </Text>
            </Button>
          </Form>
          <Button onPress={() => navigation.navigate('Register')} style={[{backgroundColor: 'transparent'}]}>
            <Text style={[{color: 'blue'}]}>Register</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}
