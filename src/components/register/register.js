import React, {Component} from 'react';
import Container from '../container';
import {Text, Content, Form, Item, Button, Input, Alert, Spinner} from 'native-base';
import firebase from '../../services/firebase';

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.handleRegister = this.handleRegister.bind(this);

    this.state = {
      email: '',
      password: '',
      passwordConfirm: '',
      isLoading: false
    }
  }

  handleRegister() {
    console.log(this, 'refs');
    const {email, password, passwordConfirm} = this.state;

    // check that user has filled all fields
    if (!email || !password || !passwordConfirm) {
      alert('no values');
    } else if (password !== passwordConfirm) {
      alert("password don't match");
    } else if (password.length < 6) {
      alert('password length should be more than 6 characters');
    } else {
      // register user
      this.setState({isLoading: true});
      firebase.auth().createUserWithEmailAndPassword(email, password).then(() => {
        alert('Account created!');
        this.setState({isLoading: false});
        this.props.navigation.navigate('Login');

      }).catch((error) => {
        console.warn(error);
        this.setState({isLoading: false});
        alert(error.message);
      });
    }


    console.log(email, password, passwordConfirm);

  }

  render() {
    console.log(this.props);

    return (
      <Container>
        <Content>
          <Form>
            <Item>
              <Input onChangeText={(email) => this.setState({email}) } ref="email" placeholder="email" />
            </Item>
            <Item>
              <Input onChangeText={(password) => this.setState({password}) } ref="password" placeholder="Password" />
            </Item>

            <Item last>
              <Input onChangeText={(passwordConfirm) => this.setState({passwordConfirm})} ref="password_confirm" placeholder="Password confirm" />
            </Item>
            {this.state.isLoading && <Spinner />}
            {!this.state.isLoading &&<Button onPress={this.handleRegister}>
                <Text>
                  Register
                </Text>
            </Button>}
          </Form>

        </Content>
      </Container>
    )
  }

}
