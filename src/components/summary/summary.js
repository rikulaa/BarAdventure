import React, {Component} from 'react';
import Container from '../container';
import {View} from 'react-native';
import {Text, List, ListItem, Left, Icon, Right, Body, Spinner} from 'native-base';

import firebase, {DB_NAMES} from '../../services/firebase';

export default class Summary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      adventures: []
    }
  }
  componentWillMount() {
    const database = firebase.database().ref(DB_NAMES.adventures).once('value').then((snapshot) => {
      console.log(snapshot.val(), 'advenures');
      this.setState({loading: false, adventures: snapshot.val()});
    });
    // console.log(database, 'firebase database');
  }
    
    
  render() {
      console.log(this.props, 'pros');
      const testArray = Array.from(this.state.adventures)
      const allAdventures = Object.keys(this.state.adventures).map((adventureID, index) => {
          const adventure = this.state.adventures[adventureID];
          const start = adventure.start_time;
          console.log(adventure);
          console.log("ID:", adventureID);
            return <ListItem onPress={() => this.props.navigation.navigate('SummaryDetail', adventure)} key={adventureID} icon>
              <Body>
                <Text>{start}</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>;
          
      });
    return (
      <View>
        <List>
            <ListItem itemHeader first>
              <Text>COMEDY</Text>
            </ListItem>
        {allAdventures}
        </List>

        {this.state.loading && <Spinner color='green' />}
      </View>
    );
  }
}