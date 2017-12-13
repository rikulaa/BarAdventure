import React, {Component} from 'react';
import moment from 'moment';
import Container from '../container';
import {View} from 'react-native';
import {Text, List, ListItem, Left, Icon, Right, Body, Spinner, Button} from 'native-base';

import firebase, {DB_NAMES} from '../../services/firebase';
import {styles} from '../../res/styles';

const fetchAdventuresFromFirebase = (uid, limit) => {
  return new Promise((resolve, reject) => {
    firebase.database().ref(DB_NAMES.adventures)
    .orderByChild("userUid")
    .equalTo(uid)
    .limitToLast(limit)
    .once('value').then((snapshot) => {
      const adventures = !!snapshot.val() ? Object.keys(snapshot.val()).map((id, index) => {
        return snapshot.val()[id];
      }).reverse() : [];

      resolve(adventures);
    }).catch(er => {
      console.log(er);
    });
  });
};

export default class Summary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      adventures: [],
      currentLimit: 10
    }

    this.loadMore = this.loadMore.bind(this);
    this.fetchAdventures = this.fetchAdventures.bind(this);
    this.handleScrollEnd = this.handleScrollEnd.bind(this);
  }
  componentWillMount() {
    this.fetchAdventures();
  }

  fetchAdventures() {
    this.setState({loading: true});
    const {user} = this.props;
    const {currentLimit} = this.state;
    console.log(currentLimit, 'currentLimit');
    const getAdventures = fetchAdventuresFromFirebase(user.uid, currentLimit);

    getAdventures.then((adventures) => {
      this.setState({loading: false, adventures});
    }).catch(er => {
      this.setState({loading: false});
    })
  }

  loadMore() {
    const previousLimit = this.state.currentLimit;
    this.setState({currentLimit: previousLimit + 10});
    this.fetchAdventures();
    console.log('load more');
  }

  handleScrollEnd(event) {
    console.log(event, 'event');
  }


  render() {
      console.log(this.props, 'pros');
      const {adventures} = this.state;
      const {navigate} = this.props.navigation;
      const date = adventure => moment(adventure.start_time).format('MMMM Do YYYY'); // December 12th 2017

    return (
      <View>
        <List style={{backgroundColor: '#fff'}} onTouchEndCapture={(event) => this.handleScrollEnd(event)}>
          {!!adventures && !!adventures.length && adventures.map((adventure, index) =>
            <ListItem onPress={() => navigate('SummaryDetail', adventure)} key={index} icon>
              <Body>
                <Text>{date(adventure.start_time)}</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>)}
        </List>

        {this.state.loading && <Spinner color='green' />}
        {adventures.length === 0 &&
          <View>
            <Text style={[styles.centerHorizontal, styles.centerVertical, {marginTop: 50}]}>No adventures available.</Text>
            <Button onPress={() => navigate('Main')} style={[styles.centerHorizontal, styles.centerVertical, {marginTop: 20}]} bordered><Text>Start new</Text></Button>
          </View>}
      </View>
    );
  }
}
