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
    BackAndroid
} from 'react-native';
import {
    StackNavigator,		
} from 'react-navigation'

import Home from './app/home.android.js' ;
import AddEntry from './app/addEntry.android.js' ;
import ViewEntries from './app/viewEntries.android.js' ;
import Sync from './app/sync.android.js' ;
import LogbookHeader from './app/header.android.js' ;
import LogbookFooter from './app/footer.android.js' ;
import Login from './app/login.android.js' ;


const Logbook = StackNavigator({
	  Login: {screen: Login},
	  Home: {screen: Home},
	  AddEntry: {screen: AddEntry},
	  ViewEntries: {screen: ViewEntries},
	  Sync: {screen: Sync}}
	  ,{ header:null, headerMode: 'screen' }

);
	

AppRegistry.registerComponent('Logbook', () => Logbook);
