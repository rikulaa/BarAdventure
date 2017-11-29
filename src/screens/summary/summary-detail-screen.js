import React, {Component} from 'react';
import SummaryDetail from '../../components/summary/summary-detail';
import {Container, Content} from 'native-base';

export default class SummaryScreen extends Component {
  render() {
    return (
         <Container>
        <Content>
      <SummaryDetail navigation={this.props.navigation} />
        </Content>
        </Container>
    );
  }
}