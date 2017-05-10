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
  TextInput,
  View,
  ScrollView,
  TouchableNativeFeedback,
  Button,
    AsyncStorage,
    Navigator
} from 'react-native';

import LogbookHeader from './header.android.js' ;
import LogbookFooter from './footer.android.js' ;


export default class Login extends Component {

    static navigationOptions = { title: 'Login', header: null };

    constructor(props){
        super(props);
        this.login = this.login.bind(this);
        this.state={username:'',password:''};
    }

  componentDidMount(){
          AsyncStorage.getItem("userid", (errs,result) => {
              if (result)
              {
                  this.props.navigation.navigate('Home');
              }
          });

    }

  render() {
        return (
       <ScrollView>
            <View style={{flex: 1, flexDirection: 'column', margin:40, alignItems:'center', justifyContent:'space-between'}}>
                <View style={{flex: 1, flexDirection: 'row', alignItems:'center' }}>
                    <Text style={{width:'40%', flex:2}}>Please log in below.  If you have not created an account, you can do so at www.theoutdoorlogbook.com. </Text>
                </View>
                <View style={{flex: 1, flexDirection: 'row', alignItems:'center' }}>
                    <Text style={{width:'40%'}}>Email</Text><TextInput style={{width:'60%'}} value={this.state.username}
                            onChangeText={(a) => { this.setState({ username: a }); }} />
                </View>
                <View style={{flex: 1, flexDirection: 'row', alignItems:'center' }}>
                    <Text style={{width:'40%'}}>Password</Text><TextInput secureTextEntry={true} style={{width:'60%'}} value={this.state.password}
                            onChangeText={(a) => { this.setState({ password: a }); }} />
                </View>
                <View style={{flex: 1, flexDirection: 'row', alignItems:'center', marginTop:20 }}>
                    <Button style={{width:'50%'}} title="Login" color='#68a0cf' onPress={this.login} />
                </View>
                <View visibility={this.state.showLoggingInMessage} style={{flex: 1, flexDirection: 'row', alignItems:'center', marginTop:20 }}>
                    <Text>{this.state.loggingInMessage}</Text>
                </View>
            </View>
        </ScrollView>
            );
      }

   login()
   {
          var url = 'http://www.theoutdoorlogbook.com/api/login/';
          var result = fetch(url, {
              method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: this.state.username, password: this.state.password })
          }).then(function(response) { return(response.json());})
          .then(function(userId){
                if (userId)
                {
                    this.setState({showLoggingInMessage: true, loggingInMessage: "Logging in..."})
                    AsyncStorage.setItem("userid", userId)
                    .then(function(r) {
                        this.props.navigation.navigate('Home');
                        }.bind(this));
                }
          }.bind(this))
            .catch(function(error) {
                    return false;
                });
   }
}