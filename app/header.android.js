
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
} from 'react-native';

var globalStyles = require('./style.js');

export default class LogbookHeader extends Component {
  render() {
      return (
      <View>
        <Text style={globalStyles.header}>The Outdoor Logbook</Text>
        <View style={{
            borderBottomColor: 'black',
            borderBottomWidth: 1,
          }}
        />
        </View>
      );
  }}
