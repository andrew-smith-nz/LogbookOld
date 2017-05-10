
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableNativeFeedback,
  Button,
    AsyncStorage,
    Picker,
    ScrollView,
    TextInput,
    DatePickerAndroid,
} from 'react-native';

var globalStyles = require('./style.js');

//import DateTimePicker from 'react-native-modal-datetime-picker';


export default class AddEntry extends Component {

    static navigationOptions = ({ navigation }) => ({
                                   title:  'Add Entry',
                                   editEntryId: navigation.state.params.editEntryId,
                                   header: null });

    constructor(props){
        super(props);
        this.state = {  activitySelected: false,
                        date: new Date().toLocaleDateString(),
                        activities: [],
                        fields: [],
                        selectedFieldOptions:[],
                        fieldCustomValues:[],
                        logbooks: [],
                        editEntryId: this.props.navigation.state.params.editEntryId
                        };
        this.save = this.save.bind(this);

        AsyncStorage.getItem("userid", (errs,result) => {
                this.setState( { userId: result } );
        });
    }

  setupEdit(entryId)  {
     var editEntry;
    AsyncStorage.getItem("Entries").then( function (result) {
            var entries = JSON.parse(result);
            for (i = 0; i < entries.length; i++)
            {
                if (entries[i].entryId == entryId)
                {
                    return entries[i];
                }
            }
       }).then(function(entry) {
     //alert(JSON.stringify(entry));

                   this.setState({
                        editEntryId: entry.entryId,
                        logbookId: entry.logbookId,
                        logbook: entry.logbookId,
                        activity: entry.activityId,
                        activityName: entry.activityName,
                        notes: entry.notes,
                        date: entry.date,
                        formattedDate: entry.formattedDate,
                        selectedFieldOptions: entry.selectedFieldOptions,
                        fieldCustomValues: entry.fieldCustomValues
                     });
                     this.LoadFields(entry.activityId);
                        }.bind(this))
   }

  render() {
        let logbookItems = this.state.logbooks.map( (s, i) => {
                            return <Picker.Item key={i} value={s.id} label={s.name} />
                        });
        let activityItems = this.state.activities.map( (s, i) => {
                    return <Picker.Item key={i} value={s.id} label={s.name} />
                });
        let fieldOptions = this.state.fields.map( (s, i) => {
            return <View style={{flex: 1, flexDirection: 'row', alignItems:'center'}} key={i}>
                    <Text style={[globalStyles.formLabel, {width:'30%'}]} key={'custom'+s.fieldId}>{s.name}</Text>
                    {(s.fieldOptions.length == 0)
                        ?
                         (s.name) ? <TextInput style={[globalStyles.formInput, {width:'70%'}]} key={s.fieldId}
                            value={this.getCustomValue(s.fieldId)}
                            onChangeText={(a) => { this.setCustomValue(s.fieldId, a, s.name); }}
                        /> : <Text style={{height:0}}></Text>
                        :
                        <Picker style={[globalStyles.formInput, {width:'70%'}]} mode='dropdown'
                            selectedValue={this.getSelectedField(s.fieldId)}
                            onValueChange={(a) => { this.setSelectedField(s.fieldId, a, s.name); }}>
                            {s.fieldOptions.map( (s, i) =>
                                {return <Picker.Item key={s.fieldOptionId} value={s.fieldOptionId} label={s.fieldOptionText} />})}
                          </Picker>}
                    </View>;
            });
        return (
       <ScrollView>
             <Text style={globalStyles.minorHeader}>{this.state.editEntryId ? 'Edit' : 'New'} Entry</Text>
             <View style={{flex: 1, flexDirection: 'row', alignItems:'center'}}>
                <Text style={[globalStyles.formLabel, {width:'30%'}]}>Logbook</Text>
                <Picker style={[globalStyles.formInput, {width:'70%'}]} mode='dropdown'
                selectedValue={this.state.logbook}
                onValueChange={(a) => {
                        this.setState({logbook:a});
                        this.setDefaultActivity(a);
                        }}>
                    {logbookItems}
                </Picker>
            </View>
            <View style={{flex: 1, flexDirection: 'row', alignItems:'center'}}>
                <Text style={[globalStyles.formLabel, {width:'30%'}]}>Activity</Text>
                <Picker style={[globalStyles.formInput, {width:'70%'}]} mode='dropdown'
                selectedValue={this.state.activity}
                onValueChange={(a) => {
                        this.LoadFields(a);
                        this.setState({activity:a});
                    }}>
                    {activityItems}
                </Picker>
            </View>
            <View style={{flex: 1, flexDirection: 'row', alignItems:'center'}}>
                <Text style={[globalStyles.formLabel, {width:'30%'}]}>Date</Text>
                <Text style={[globalStyles.formInput, {width:'70%', fontSize:16, color:'black', marginLeft:7, marginTop:12, marginBottom:12}]}
                 onPress={this.selectDate}>{this.state.date}</Text>
            </View>
            <View style={{flex: 1, flexDirection: 'row', alignItems:'center'}}>
                <Text style={[globalStyles.formLabel, {width:'30%'}]}>Notes</Text>
                <TextInput style={[globalStyles.formInput, {width:'70%'}]}
                    onChangeText={(text) => this.setState({notes: text})}
                    value={this.state.notes} />
            </View>
            {this.state.activitySelected ?
            <View>{fieldOptions}</View> : null}
            <View style={{margin: 40}}>
                <Button color='#68a0cf' title={this.state.editEntryId ? 'Update' : 'Create'} onPress={this.save} />
            </View>
        </ScrollView>
        );
        }

      selectDate = async (stateKey, options) => {
           var newState = {};
           const {action, year, month, day} = await DatePickerAndroid.open(options);
           if (action === DatePickerAndroid.dismissedAction) {
             newState[stateKey + 'Text'] = 'dismissed';
           } else {
             var date = new Date(year, month, day);
             newState['date'] = date.toLocaleDateString();
           }
           this.setState(newState);
       };

     save() {
        AsyncStorage.getItem("Entries", (errs,result) => {
                if (!errs) {
                    var currentEntries;
                    if (!result)
                        currentEntries = [];
                    else
                        currentEntries = JSON.parse(result);
                        //currentEntries = []; // remove to persist multiple records
                        if (this.state.editEntryId)
                        {
                            // update existing record
                            var existingRecord = currentEntries.find(e => e.entryId === this.state.editEntryId);
                            if (existingRecord)
                            {
                                existingRecord.logbookId = this.state.logbook;
                                existingRecord.activityId = this.state.activity;
                                existingRecord.activityName = this.state.activityName;
                                existingRecord.notes = this.state.notes;
                                existingRecord.date = this.state.date;
                                existingRecord.formattedDate = this.formatDate(this.state.date);
                                existingRecord.selectedFieldOptions = this.state.selectedFieldOptions;
                                existingRecord.fieldCustomValues = this.state.fieldCustomValues;
                                existingRecord.synced = false;
                            }
                        }
                        else
                        {
                        currentEntries.push({
                            userId: this.state.userId,
                            entryId: this.state.editEntryId ? this.state.editEntryId : this.guid(),
                            logbookId: this.state.logbook,
                            activityId: this.state.activity,
                            activityName: this.state.activityName,
                            notes: this.state.notes,
                            date: this.state.date,
                            formattedDate: this.formatDate(this.state.date),
                            selectedFieldOptions: this.state.selectedFieldOptions,
                            fieldCustomValues: this.state.fieldCustomValues,
                            synced: false
                            }
                    )};
                    AsyncStorage.setItem("Entries", JSON.stringify(currentEntries))
                        .then(this.props.navigation.navigate('Home'));
                 }
            })
     }

     formatDate(date) {
       var monthNames = [
         "January", "February", "March",
         "April", "May", "June", "July",
         "August", "September", "October",
         "November", "December"
       ];
       var d = new Date(date);
       var day = d.getDate();
       var monthIndex = d.getMonth();
       var year = d.getFullYear();

       return ('0' + day).slice(-2) + '-' + monthNames[monthIndex].substring(0,3) + '-' + year;
     }

     guid() {
       function s4() {
         return Math.floor((1 + Math.random()) * 0x10000)
           .toString(16)
           .substring(1);
       }
       return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
         s4() + '-' + s4() + s4() + s4();
     }

     setSelectedField (fieldId, fieldOptionId, fieldName) {
       var a = this.state.selectedFieldOptions.slice();
       var item = a.find(x => x.fieldId == fieldId);
       if (item)
       {
            var index = a.indexOf(item);
            a[index].fieldName = fieldName;
            a[index].fieldOptionId = fieldOptionId;
       }
       else
            a.push ({   fieldId: fieldId,
                        fieldName: fieldName,
                        fieldOptionId: fieldOptionId,
                    });
       this.setState({selectedFieldOptions: a});
     }

     setDefaultActivity (logbookId)
     {
         AsyncStorage.getItem("LogbookData", (errs,result) => {
                    if (!errs) {
                        if (result !== null) {

                            var logbookData = JSON.parse(result);
                            var defaultActivityId = logbookData.find(a => a.LogbookId == logbookId).DefaultActivityId;
                            this.setState({ activity: defaultActivityId });
                            this.LoadFields(this.state.activity);
                        }
                    }
                });
     }

     getSelectedField (fieldId) {
        var a = this.state.selectedFieldOptions.find(x => x.fieldId == fieldId);
        return a ? a.fieldOptionId : "";
     }

     setCustomValue (fieldId, customValue, fieldName) {
       var a = this.state.fieldCustomValues.slice();
       var item = a.find(x => x.fieldId == fieldId);
       if (item)
       {
            var index = a.indexOf(item);
            a[index].customValue = customValue;
            a[index].fieldName = fieldName;
       }
       else
            a.push ({ fieldId: fieldId, customValue: customValue, fieldName: fieldName });
       this.setState({fieldCustomValues: a});
     }

     getCustomValue (fieldId) {
        var a = this.state.fieldCustomValues.find(x => x.fieldId === fieldId);
        return a ? a.customValue : "";
     }

     componentDidMount() {
        this.PopulateActivities();
        this.PopulateLogbooks();
        if (this.state.editEntryId)
        {
            this.setupEdit(this.state.editEntryId);
        }
     }

     PopulateActivities() {
        AsyncStorage.getItem("ActivityData", (errs,result) => {
           if (!errs) {
               if (result !== null) {
                   var activityData = JSON.parse(result);
                   var presort = []
                   for (i = 0; i < activityData.length; i++)
                   {
                       if (!presort.find(a => a.id == activityData[i].ActivityId))
                           presort.push({ name: activityData[i].ActivityName, id: activityData[i].ActivityId });
                   }
                   this.setState({activities: presort.sort(function (a,b) { return a.name > b.name ? 1 : a.name < b.name ? -1 : 0 })});
               }
            }
       })
     }

     PopulateLogbooks(){
        AsyncStorage.getItem("LogbookData").then(function (result) {
               if (result !== null) {
                  var logbooks = [];
                  var logbookData = JSON.parse(result);
                  for (i = 0; i < logbookData.length; i++)
                  {
                      logbooks.push({ name: logbookData[i].Name, id:logbookData[i].LogbookId });
                  }
                  this.setState({logbooks: logbooks});
                  this.setState({logbook: logbookData[0].LogbookId});
                  if (!this.props.editEntryId)
                    this.setDefaultActivity(logbookData[0].LogbookId);
               }
             }
           );

     }


    LoadFields(newValue) {
        if (newValue !== "") {
            this.setState({activitySelected:true});
            AsyncStorage.getItem("ActivityData", (errs,result) => {
                if (!errs) {
                    if (result !== null) {
                        var activityData = JSON.parse(result);
                        var fields = [];
                        for (i = 0; i < activityData.length; i++)
                        {
                            if (activityData[i].ActivityId == newValue)
                            {
                                this.setState({activityName: activityData[i].ActivityName}); // TODO: make this once per load
                                var existingField = fields.find(x => x.fieldId == activityData[i].FieldId);
                                if (!existingField)
                                {
                                    var field = {
                                        name: activityData[i].FieldName,
                                        fieldId: activityData[i].FieldId,
                                        fieldOptions: [],
                                        selectedOption: ''
                                    };
                                    for (j = 0; j < activityData.length; j++)
                                    {
                                        if (activityData[j].FieldId == activityData[i].FieldId)
                                        {
                                            if (activityData[j].FieldOptionText)
                                            {
                                                if (field.fieldOptions.length == 0)
                                                {
                                                    var empty = {fieldOptionText: "Select...", fieldOptionId: "", fieldOptionSortOrder: "-1"};
                                                    field.fieldOptions.push(empty);
                                                }
                                                var fieldOption = {
                                                    fieldOptionText: activityData[j].FieldOptionText,
                                                    fieldOptionId: activityData[j].FieldOptionId,
                                                    fieldOptionSortOrder: activityData[j].FieldOptionSortOrder
                                                    };
                                                field.fieldOptions.push(fieldOption);
                                            }
                                        }
                                    }
                                    if (field.fieldOptions.length > 0)
                                    {
                                        field.fieldOptions.sort(function (a,b) { return a.fieldOptionSortOrder > b.fieldOptionSortOrder ? 1 : a.fieldOptionSortOrder < b.fieldOptionSortOrder ? -1 : 0 });
                                    }
                                    fields.push(field);
                                }
                            }
                        }
                        this.setState({fields: fields});
                    }
                 }
            })
        }
    }

}

