import React, {Component} from 'react';
import Summary from '../../components/summary/summary';
import {Container, Content, Button, Text} from 'native-base';

export default class SummaryScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    title: 'Drink diaries',
    headerRight: <Button onPress={() => navigation.navigate('Main')} transparent><Text>Drink more!</Text></Button>
  });

  render() {
    return (
      <Container>
        <Content>
          <Summary user={this.props.screenProps.user} navigation={this.props.navigation} />
        </Content>
      </Container>
    );
  }
}
