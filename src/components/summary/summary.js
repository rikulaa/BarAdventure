import React, {Component} from 'react';
import Container from '../container';
import {Text} from 'native-base';

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
    return (
      <Container>
        {this.state.loading && <Text style={[{marginTop:50}]}>Im loading data from firebase</Text>}
        {!this.state.loading && <Text style={[{marginTop: 20}]}>Summary with map and list. CHECK CONSOLE</Text>}
      </Container>
    );
  }
}