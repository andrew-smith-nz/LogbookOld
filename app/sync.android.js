
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableNativeFeedback,
  Button,
    AsyncStorage,
    Navigator,
    TextInput
} from 'react-native';

var globalStyles = require('./style.js');
//var functions = require('./functions.js');  // NOT WORKING, binding?

export default class Sync extends Component {

    static navigationOptions = ({ navigation }) => ({ title: 'Sync', header: null });

constructor(props){
        super(props);
        this.state = {  status: '',
                        syncStatus: 'NotStarted',
                        connectionStatus: 'Checking...',
                        allowSync: false,
                        steps: []}
        this.syncWithWebsite = this.syncWithWebsite.bind(this);
        this.returnHome = this.returnHome.bind(this);

        AsyncStorage.getItem("userid", (errs,result) => {
                this.setState( { userId: result } );
        });

    }

  componentDidMount(){
        this.CheckConnection();
         }

  render() {
        return (
        <View style={{alignItems:'center'}}>
            <Text style={globalStyles.minorHeader}>Sync</Text>
            <Text>Internet Connection: {this.state.connectionStatus}</Text>
            <View style={{flexDirection:'column', marginTop:10, marginLeft: 40, marginRight: 40}}>
                {(this.state.syncStatus == "NotStarted") ?
                <Button color='#68a0cf' title='Sync' onPress={this.syncWithWebsite} disabled={!this.state.allowSync}  />
                : <Text style={{width:'100%', height:40}}>{(this.state.syncStatus == "InProgress") ? "Sync in Progress. Do not close the app." : "Sync Complete"}</Text>}
            </View>
            <View style={{flexDirection:'column', marginTop:10, marginLeft: 40, marginRight: 40, justifyContent:'flex-start'}}>
                <View style={[globalStyles.tableView, {alignItems:'center', flexDirection:'row'}]}>
                    <Text style={{width:'70%'}}>Get Activities</Text>
                    <Text style={{width:'30%'}}>{this.state.loadedActivities}</Text>
                </View>
                <View style={[globalStyles.tableView, {alignItems:'center', flexDirection:'row'}]}>
                    <Text style={{width:'70%'}}>Get Logbooks</Text>
                    <Text style={{width:'30%'}}>{this.state.loadedLogbooks}</Text>
                </View>
                <View style={[globalStyles.tableView, {alignItems:'center', flexDirection:'row'}]}>
                    <Text style={{width:'70%'}}>Send latest entries</Text>
                    <Text style={{width:'30%'}}>{this.state.sentNewEntries}</Text>
                </View>
                <View style={[globalStyles.tableView, globalStyles.tableViewLast, {alignItems:'center', flexDirection:'row'}]}>
                    <Text style={{width:'70%'}}>Get latest entries</Text>
                    <Text style={{width:'30%'}}>{this.state.refreshedEntries}</Text>
                </View>
            </View>
             <View style={{flexDirection:'column', marginTop:10, marginLeft: 40, marginRight: 40}}>
                <Button color='#68a0cf' title='Return' onPress={this.returnHome}  />
            </View>
        </View>
        );
        }

   returnHome () {
        this.props.navigation.navigate('Home')
   }

   async syncWithWebsite(){
        this.setState({ syncStatus: 'InProgress'});
        await this.GetActivitiesAsync(this.state.userId);
        await this.GetLogbooks(this.state.userId);
        await this.PostNewEntries(this.state.userId);
        this.setState({ refreshedEntries: 'Running...' });
        setTimeout(function() { this.RefreshEntriesFromServer(this.state.userId); }.bind(this), 2000);
   }

   async PostNewEntries(userId){
        this.setState({ sentNewEntries: 'Running...' });
        var entries = AsyncStorage.getItem("Entries").then(function (result) {
                if (result)
                {
                    var entries = JSON.parse(result);
                    var num = entries.length;
                    for (i = 0; i < num; i++)
                    {
                        if (entries[i].synced == false)
                            entries[i] = this.PostEntry(entries[i]);
                    };
                    return entries;
                }
            }.bind(this)).then(function (entries) {
            if (entries)
                {
                    AsyncStorage.setItem("Entries", JSON.stringify(entries));
                }});

            this.setState({ sentNewEntries: 'Done' });
   }

   async CheckConnection() {
        var url = 'http://www.theoutdoorlogbook.com/api/ping/';
        return fetch(url)
            .then(function(data) { return true; }, function(error) {return false;})
            .then(function(result)
            {
                this.setState({connectionStatus: (result) ? 'Connected' : 'Not Connected' });
                if (result)
                    this.setState({allowSync: true});
            }.bind(this))
   }

   async RefreshEntriesFromServer(userId) {
       var url = 'http://www.theoutdoorlogbook.com/api/getentries/' + userId;
       fetch(url)
           .then(function(data) { return data.json(); })
           .then(function(actualData) {
               AsyncStorage.getItem("Entries").then(function(data) {
                    var existingEntries = JSON.parse(data);
                    for(i=0;i<existingEntries;i++)
                    {
                        if (!existingEntries[i].synced)
                        {
                            actualData.push(existingEntries[i]);
                        }
                    }
                    AsyncStorage.setItem("Entries", JSON.stringify(actualData));
                    this.setState({ refreshedEntries: 'Done' });
                    this.setState({ syncStatus: 'Complete'});
               }.bind(this));
              // alert(JSON.stringify(actualData));
               // Get all activities
               // Store in AsyncStorage as JSON objects by activity
           }.bind(this))
           .catch(function(error) {
               // If there is any error you will catch them here
           });
   }

   async PostEntry(entry)
   {
      var url = 'http://www.theoutdoorlogbook.com/api/CreateEntry/';
     return fetch(url, {
          method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(entry)
      }).then(function(response) {
          if (response.ok)
            {
                entry.synced = true;
                return entry;
            }
      }.bind(this))
      .catch(function(error) {
                return false;
            });
   }

   GetActivitiesAsync (userId) {
        this.setState({ loadedActivities: 'Running...' });
       var url = 'http://www.theoutdoorlogbook.com/api/activities/' + userId;
              return fetch(url)
                   .then(function(data) { return data.json(); })
                   .then(function(actualData) {
                       // Get all activities
                       AsyncStorage.setItem("ActivityData", JSON.stringify(actualData));
                        this.setState({ loadedActivities: 'Done' });
                       // Store in AsyncStorage as JSON objects by activity
                   }.bind(this))
                   .catch(function(error) {
                       // If there is any error you will catch them here
                   });
       }

   GetLogbooks(userId){
                        this.setState({ loadedLogbooks: 'Running...' });
        var url = 'http://www.theoutdoorlogbook.com/api/logbooks/' + userId;
                       return fetch(url)
                           .then(function(data) { return data.json(); })
                           .then(function(actualData) {
                               // Get all activities
                               AsyncStorage.setItem("LogbookData", JSON.stringify(actualData));
                                this.setState({ loadedLogbooks: 'Done' });
                               // Store in AsyncStorage as JSON objects by activity
                           }.bind(this))
                           .catch(function(error) {
                               // If there is any error you will catch them here
                           });

   }
}