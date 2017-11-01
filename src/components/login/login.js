import React, {Component} from 'react';
import Container from '../container';
import {Content, Item, Form, Input, Text, Button} from 'native-base';

export default class Login extends Component {
  render() {
    const {navigation} = this.props;
    console.log(navigation, this.props);

    return (
      <Container>
        <Content>
          <Form>
            <Item>
              <Input placeholder="Username" />
            </Item>
            <Item last>
              <Input placeholder="Password" />
            </Item>
            <Button>
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