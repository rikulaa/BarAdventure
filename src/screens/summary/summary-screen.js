import React, {Component} from 'react';
import Summary from '../../components/summary/summary';
import {Container, Content} from 'native-base';

export default class SummaryScreen extends Component {
  render() {
    return (
         <Container>
        <Content>
      <Summary navigation={this.props.navigation} />
        </Content>
        </Container>
    );
  }
}