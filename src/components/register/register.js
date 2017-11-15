import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
// import Container from '../container';
import {Text, Container, Content, Form, Item, Button, Input, Alert, Spinner} from 'native-base';
import firebase, {DB_NAMES} from '../../services/firebase';
import {styles} from '../../res/styles';


export default class Register extends Component {
  constructor(props) {
    super(props);
    this.handleRegister = this.handleRegister.bind(this);
    this.validate = this.validate.bind(this);

    this.state = {
      email: {
        value: '',
        touched: false
      },
      // email: '',
      password: {
        value: '',
        touched: false
      },
      // password: '',
      passwordConfirm: '',
      passwordConfirm: {
        value: '',
        touched: false
      },
      isLoading: false
    }
  }

  handleRegister() {
    const {email, password, passwordConfirm} = this.state;

    // check that user has filled all fields
    if (!email.value || !password.value || !passwordConfirm.value) {
      alert('no values');
    } else if (password.value !== passwordConfirm.value) {
      alert("password don't match");
    } else if (password.value.length < 6) {
      alert('password length should be more than 6 characters');
    } else {
      // register user
      this.setState({isLoading: true});
      firebase.auth().createUserWithEmailAndPassword(email.value, password.value).then((response) => {
        alert('Account created!');
        this.setState({isLoading: false});

        // get user data from response
        const user = {
          uid: response.uid,
          name: response.displayName ? response.displayName : '',
          email: response.email,
          photoUrl: response.photoUrl ? response.photoUrl : '',
          adventures: {}
        }

        // save user to userrs table
        firebase.database().ref(DB_NAMES.users + '/' + user.uid).set(user);

      }).catch((error) => {
        console.warn(error);
        this.setState({isLoading: false});
        alert(error.message);
      });
    }

  }

  validate(value, type) {
    switch (type) {
      case 'email':
      console.log(value.includes("@"));
        return value.length > 0 && !value.includes("@");

      case 'password':
        return value.length < 6;
      case 'passwordConfirm':
        return value.length < 6;
    }

    return true;
  }

  render() {
    const {email, password, passwordConfirm} = this.state;
    const {validate} = this;

    return (
      <Container style={[localStyles.container, styles.centerHorizontal]}>
          <Form style={[localStyles.form]}>
            <Item error={validate(email.value, 'email') && email.touched}>
              <Input onChangeText={(email) => this.setState({email: {value: email, touched: true}}) } ref="email" placeholder="Email" />
            </Item>
            <Item error={validate(password.value, 'password') < 6 && password.touched}>
              <Input secureTextEntry onChangeText={(password) => this.setState({password: {value: password, touched: true}}) } ref="password" placeholder="Password" />
            </Item>

            <Item error={validate(passwordConfirm.value, 'password') && passwordConfirm.touched}>
              <Input secureTextEntry onChangeText={(passwordConfirm) => this.setState({passwordConfirm: {value: passwordConfirm, touched: true}})} ref="password_confirm" placeholder="Password confirm" />
            </Item>
            {this.state.isLoading && <Spinner />}
            {!this.state.isLoading &&<Button style={[styles.centerHorizontal, localStyles.button]} onPress={this.handleRegister}>
                <Text>
                  Register
                </Text>
            </Button>}
          </Form>
      </Container>
    )
  }

}

const localStyles = StyleSheet.create({
  container: {
    width: '80%'
  },
  button: {
    marginTop: '10%',
    alignSelf: 'center'
  },
  form: {
    marginTop: '40%'
  }
})
