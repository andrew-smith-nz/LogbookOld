
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
    ScrollView,
    TouchableOpacity,
    Picker
} from 'react-native';

var globalStyles = require('./style.js');

export default class ViewEntries extends Component {

    static navigationOptions = { title: 'View Entries', header: null };

    constructor(props){
        super(props);
        this.state = { entries:[], expandedRows:[], logbooks:[] };
        this.edit = this.edit.bind(this);
        this.newEntry = this.newEntry.bind(this);
     }

     componentDidMount() {
        this.getLogbooks();
        this.getEntries();
        this.getFieldOptions();
     }

  render() {
        let logbooks = this.state.logbooks.map( (s, i) => {
                    return <Picker.Item key={i} value={s.id} label={s.name} />
                });
        let entries = this.state.entries.map( (s, i) => {
                return <View key={'v' + i} style={{flex: 1, flexDirection: 'column',
                                            borderTopColor:'black', borderTopWidth:1, padding:10,
                                            backgroundColor: !s.synced ? '#ffe6e6' : 'transparent' }}>
                           <TouchableOpacity id={'t' + i} onPress={() => this.expandRow(s.entryId)}>
                               <View key={'vv' + i} style={{flex: 1, flexDirection: 'row', alignItems:'center'}}>
                                    <Text style={{width:'70%', fontWeight:'bold'}} key={'a' + i}>{s.activityName}</Text>
                                    <Text style={{width:'30%', fontWeight:'bold'}} key={'c' + i}>{s.formattedDate}</Text>
                               </View>
                               {(this.state.expandedRows.indexOf(s.entryId) != -1)
                                        ? <View key={'fv' + i} style={{flex: 1, flexDirection: 'column', paddingTop:5}}>
                                            <Text style={{paddingBottom:5, fontStyle:'italic'}}>{s.notes}</Text>
                                            {s.selectedFieldOptions.map( (ss, i) => {
                                                return <View key={"vvv" + i} style={{flex: 1, flexDirection: 'row'}}>
                                                         <Text style={{width:'50%', fontWeight:'bold'}} key={'fn' + i}>{ss.fieldName}</Text>
                                                         <Text style={{width:'50%'}} key={'ft' + i}>{this.getOptionText(ss.fieldOptionId)}</Text>
                                                       </View>
                                            })}
                                            {s.fieldCustomValues.map( (ss, i) => {
                                                return <View key={"vvv" + i} style={{flex: 1, flexDirection: 'row'}}>
                                                         <Text style={{width:'50%', fontWeight:'bold'}} key={'fn' + i}>{ss.fieldName}</Text>
                                                         <Text style={{width:'50%'}} key={'ft' + i}>{ss.customValue}</Text>
                                                       </View>
                                            })}
                                            {!s.synced ? <View style={{flex: 1, flexDirection: 'row', justifyContent:'flex-end'}}>
                                                <Button title='Edit' color='#68a0cf' key={s.entryId} onPress={() => this.edit(s.entryId)} />
                                            </View> : <View />}
                                        </View>
                                        : <Text style={{height:0}} />}
                           </TouchableOpacity>
                       </View>;
            });
        return (
        <ScrollView>
        <Text style={globalStyles.minorHeader}>View Entries (touch to expand)</Text>
        <Text style={{fontSize:10, textAlign:'center'}}>Entries highlighted in red have not been synced</Text>
        <View style={{flexDirection:'row', marginLeft:20, marginRight:20, alignItems:'center'}}>
            <Text style={{width:'50%'}}>Logbook:</Text>
            <Picker style={{width:'50%'}} selectedValue={this.state.logbook}
             onValueChange={(a) => { this.setState({logbook: a}); this.getEntries(); }}>{logbooks}</Picker>
        </View>
        {entries}
        </ScrollView>
        );
        }

     newEntry () {
        this.props.navigation.navigate('AddEntry');
    }

    getOptionText(fieldOptionId)
    {
        var text = this.state.optionTexts.find(o => o.fieldOptionId === fieldOptionId);
        return text ? text.fieldOptionText : "";
    }

    expandRow (e) {
        var expandedRows = this.state.expandedRows;
        if (expandedRows.indexOf(e) == -1)
            expandedRows.push(e);
        else
            delete expandedRows[expandedRows.indexOf(e)];
        this.setState({expandedRows: expandedRows})
    }

    edit (entryId) {
        this.props.navigation.navigate('AddEntry', { editEntryId: entryId });
    }

   getEntries() {
        AsyncStorage.getItem("Entries", (errs,result) => {
            if (!errs) {
                var entries = JSON.parse(result);
                var logbookEntries = [];
                for (i = 0; i < entries.length; i++)
                {
                    if (entries[i].logbookId == this.state.logbook)
                        logbookEntries.push(entries[i]);
                }
                this.setState({entries: logbookEntries});
             }
        })
   }

   getFieldOptions() {
        AsyncStorage.getItem("ActivityData").then(function(data) {
            var optionTexts = [];
            var activityData = JSON.parse(data);
            for (i = 0; i < activityData.length; i++)
            {
                if (!optionTexts.find(o => o.fieldOptionId === activityData[i].FieldOptionId))
                {
                    optionTexts.push({ fieldOptionId: activityData[i].FieldOptionId,
                        fieldOptionText: activityData[i].FieldOptionText});

                }
            }
            this.setState({optionTexts: optionTexts});
        }.bind(this));
   }

   getLogbooks(){
           AsyncStorage.getItem("LogbookData", (errs,result) => {
              if (!errs) {
                  if (result !== null) {
                  }
                     var logbooks = [];
                     var logbookData = JSON.parse(result);
                     for (i = 0; i < logbookData.length; i++)
                     {
                         logbooks.push({ name: logbookData[i].Name, id:logbookData[i].LogbookId });
                     }
                     this.setState({logbooks: logbooks});
                     this.setState({logbook: logbookData[0].LogbookId});
                  }
              });
        }

}