import React, {Component} from 'react';
import SummaryDetail from '../../components/summary/summary-detail';
import {Container, Content, Button, Text, Icon} from 'native-base';

export default class SummaryDetailScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    headerLeft: <Button transparent onPress={() => navigation.goBack()}>
      <Icon style={{marginRight: 0, paddingRight: 0}} name="arrow-back" />
      <Text>Back</Text>
    </Button>
  })
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
