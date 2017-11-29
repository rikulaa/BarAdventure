import React, {Component} from 'react';
import Container from '../container';
import {View} from 'react-native';
import {Text, List, ListItem, Left, Icon, Right, Body, Spinner} from 'native-base';

import firebase, {DB_NAMES} from '../../services/firebase';

export default class SummaryDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      adventure: null
    }
  }
  componentDidMount() {
    console.log(this.props, 'props');
    // get the adventure from navigation params
    const adventure = this.props.navigation.state.params;
    this.setState({adventure});

  }
    
    
  render() {
    const {adventure} = this.state;
    console.log(adventure, 'adv');

    return (
      <View>
          <Text>Morpo</Text>
      </View>
    );
  }
}