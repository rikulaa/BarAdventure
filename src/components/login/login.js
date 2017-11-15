import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import Container from '../container';
import {Alert} from 'react-native';
import {Content,  Item, Form, Input, Text, Button, Spinner} from 'native-base';
import {styles} from '../../res/styles';

import firebase from '../../services/firebase';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: {
        value: '',
        touched: false
      },
      password: {
        value: '',
        touched: false
      },
      isLoading: false
    };
  }

  handleLogin() {
    const {email, password} = this.state;
    console.log(email, password);
    if (!email.value || !password.value) {
      Alert.alert('Error', 'Please input email/password to login', [{text: 'OK', onPress: () => console.log('OK Pressed')},], {cancelable: false})
    } else {
      this.setState({isLoading: true});
      firebase.auth().signInWithEmailAndPassword(email.value, password.value).then(() => {
        console.log('auth ok');
      this.setState({isLoading: false});
      }).catch((error) => {
        console.warn(error);
        this.setState({isLoading: false});
        Alert.alert('Error', error.message, [{text: 'OK', onPress: () => console.log('erro ok')}]);
      });
    }
  }

  validate(value, type) {
    switch(type) {
      case 'email':
        return value < 1 || !value.includes("@");
      case 'password':
        return value.length < 6;
    }

    return true;

  }

  render() {
    const {navigation} = this.props;
    const {validate} = this;
    const {email, password, isLoading} = this.state;
    console.log('this', this.state);

    if (isLoading) return <Spinner />

    return (
      <Container style={[localStyles.container, styles.centerHorizontal]}>
        <Form style={[localStyles.form]}>
          <Item error={validate(email.value, 'email') && email.touched}>
            <Input onChangeText={(email) => this.setState({email: {value: email, touched: true}})} placeholder="Email" />
          </Item>
          <Item error={validate(password.value, 'password') && password.touched}>
            <Input secureTextEntry onChangeText={(password) => this.setState({password: {value: password, touched: true}})} placeholder="Password" />
          </Item>

        </Form>

        <Button style={[styles.centerHorizontal, localStyles.button]} onPress={this.handleLogin.bind(this)}>
          <Text>
            Login
            </Text>
        </Button>

        <Button style={[styles.centerHorizontal, localStyles.button, styles.bgTransparent]} onPress={() => navigation.navigate('Register')}>
          <Text style={[{color: 'blue'}]}>Register</Text>
        </Button>


      </Container>
    );
  }
}

const localStyles = StyleSheet.create({
  container: {
    width: '80%',
  },
  button: {
    marginTop: '10%',
    alignSelf: 'center'
  },
  form: {
    marginTop: '40%'
  }
})
