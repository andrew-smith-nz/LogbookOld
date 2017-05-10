'use strict';

var React = require('react-native');

var {
  StyleSheet,
} = React;

module.exports = StyleSheet.create({
  header: {
    textAlign: 'center',
    color: '#004A7F',
    margin: 10,
    fontSize: 24,
  },
  minorHeader: {
    textAlign: 'center',
    color: '#004A7F',
    margin: 10,
    fontSize: 16,
  },
  footer: {
    textAlign: 'center',
    color: '#004A7F',
    fontSize: 12,
  },
  footerView: {
    marginBottom: 10,
  },
  buttonText: {
    marginRight:40,
    marginLeft:40,
    marginTop:10,
    paddingTop:10,
    paddingBottom:10,
    borderRadius:10,
    borderWidth: 1,
    color:'#fff',
    fontSize:16,
    backgroundColor:'#68a0cf',
    textAlign:'center',
  },
   button: {
          padding: 10,
          borderColor: 'blue',
          borderWidth: 1,
          borderRadius: 5
      },
   formLabel: {
        textAlign:'left',
        paddingLeft:10,
   },
   formInput: {
        paddingRight:10
    },
    tableView: {
        borderTopWidth:1,
        borderTopColor:'black',
        borderLeftWidth:1,
        borderLeftColor:'black',
        borderRightWidth:1,
        borderRightColor:'black',
        padding:10,
    },
    tableViewLast: {
        borderBottomWidth:1,
        borderBottomColor:'black',}
});