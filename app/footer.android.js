
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
} from 'react-native';

var globalStyles = require('./style.js');


export default class LogbookFooter extends Component {
  render() {
      return (
          <View style={globalStyles.footerView}>
          <View style={{ borderTopColor: 'black', borderTopWidth: 1, }} />
            <Text style={globalStyles.footer}>©2017 The Outdoor Logbook Ltd</Text>
            <Text style={globalStyles.footer}>www.theoutdoorlogbook.com</Text>
          </View>
      );
  }}
