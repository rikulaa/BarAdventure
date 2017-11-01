import React, {Component} from 'react';
import Container from '../container';
import {Text} from 'native-base';

export default class Summary extends Component {
  render() {
    return (
      <Container>
        <Text style={[{marginTop: 20}]}>Summary with map</Text>
      </Container>
    );
  }
}