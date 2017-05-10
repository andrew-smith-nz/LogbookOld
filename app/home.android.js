/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableNativeFeedback,
  Button,
    AsyncStorage,
} from 'react-native';

import LogbookHeader from './header.android.js' ;
import LogbookFooter from './footer.android.js' ;

    var globalStyles = require('./style.js');


export default class Home extends Component {

    static navigationOptions = { title: 'Home', header: null };

    constructor(props){
        super(props);
        this.state = {
            user: '',
            synced: false
        }
        AsyncStorage.getItem("userid").then((value) => {
            this.setState({user: value});
        }).done();
        this.newEntry = this.newEntry.bind(this);
        this.viewEntries = this.viewEntries.bind(this);
        this.sync = this.sync.bind(this);
        this.logout = this.logout.bind(this);
    }

    componentDidMount() {
            this.checkForData();
        }

  render() {
  //<Text style={{textAlign: 'center'}}>Welcome, {this.state.user}!</Text>
        return (
      <View style={{flex: 1}}>
			<LogbookHeader />
          <View style={{flex: 1, flexDirection: 'column', justifyContent: 'space-between', margin:40, marginTop:80, marginBottom:80}}>

            <Button title="New Entry" color='#68a0cf' onPress={this.newEntry} disabled={!this.state.synced} />
            <Button title="View Entries" color='#68a0cf' onPress={this.viewEntries} disabled={!this.state.synced} />
            <Button title="Sync" color='#68a0cf' onPress={this.sync} />

          </View>
			<LogbookFooter />
      </View>

    );
    }
     newEntry () {
        this.props.navigation.navigate('AddEntry', { editEntryId: 0 });
    }
     viewEntries () {
        this.props.navigation.navigate('ViewEntries');
    }
     sync () {
        this.props.navigation.navigate('Sync');
    }
     logout () {
        AsyncStorage.setItem("userid", '');
        this.props.navigation.navigate('Login');
    }

    checkForData (){
        AsyncStorage.getItem("LogbookData").then((result) => {
                       if (result !== null) {
                          this.setState({ synced: true });
                       }
                     }
                   );

    }
}


AppRegistry.registerComponent('Logbook', () => Logbook);
