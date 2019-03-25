import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  Switch,
  TouchableOpacity,
  ToastAndroid,
  InteractionManager
} from 'react-native';
var _ = require('lodash');
import BluetoothSerial from 'react-native-bluetooth-serial';
import firebase from 'react-native-firebase';
import { Actions } from 'react-native-router-flux';

export default class Connect extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isEnabled: false,
      discovering: false,
      devices: [],
      unpairedDevices: [],
      connected: false,
    }
  }
  
  componentWillMount(){
    Promise.all([
      BluetoothSerial.isEnabled(),
      BluetoothSerial.list()
    ])
    .then((values) => {
      const [ isEnabled, devices ] = values

      this.setState({ isEnabled, devices })
    })
    BluetoothSerial.on('bluetoothEnabled', () => {
      Promise.all([
        BluetoothSerial.isEnabled(),
        BluetoothSerial.list()
      ])
      .then((values) => {
        const [ isEnabled, devices ] = values
        this.setState({ devices })
      })
      BluetoothSerial.on('bluetoothDisabled', () => {
         this.setState({ devices: [] })
      })
      BluetoothSerial.on('error', (err) => console.log(`Error: ${err.message}`))
    })
  }

  connect (device) {
    this.setState({ connecting: true })
    BluetoothSerial.connect(device.id)
    .then((res) => {
      console.log(`Connected to device ${device.name}`);  
      ToastAndroid.show(`Connected to device ${device.name}`, ToastAndroid.SHORT);
    })
    .catch((err) => console.log((err.message)))
  }

  _renderItem(item){

    return(<TouchableOpacity onPress={() => this.connect(item.item)}>
            <View style={styles.deviceNameWrap}>
              <Text style={styles.deviceName}>{ item.item.name ? item.item.name : item.item.id }</Text>
            </View>
          </TouchableOpacity>)
  }

  enable () {
    BluetoothSerial.enable()
    .then((res) => this.setState({ isEnabled: true }))
    .catch((err) => Toast.showShortBottom(err.message))
  }

  disable () {
    BluetoothSerial.disable()
    .then((res) => this.setState({ isEnabled: false }))
    .catch((err) => Toast.showShortBottom(err.message))
  }

  toggleBluetooth (value) {
    if (value === true) {
      this.enable()
    } else {
      this.disable()
    }
  }

  discoverAvailableDevices () { 
    if (this.state.discovering) {
      return false
    } else {
      this.setState({ discovering: true })
      BluetoothSerial.discoverUnpairedDevices()
      .then((unpairedDevices) => {
        const uniqueDevices = _.uniqBy(unpairedDevices, 'id');
        console.log(uniqueDevices);
        this.setState({ unpairedDevices: uniqueDevices, discovering: false })
      })
      .catch((err) => console.log(err.message))
    }
  }

  insertDB(obj){
    var tid;
    firebase.database().ref('/arduinodata/count').once('value',(snapshot) => {
      id = snapshot.val();
      console.log(id);
      tid = id.c + 1;
      console.log(tid);
      firebase.database().ref('/arduinodata/count').set({
        c : tid
      }).then(() =>{
        firebase.database().ref('/arduinodata/d' + tid ).set({
          obj
        }).then(() => {
          console.log("Insertion Successful");
        })
      })
    })
  }

  async toggleSwitch(){
    while(true){
      var obj = {
        timestamp : "",
        acc: [0,0,0],
        gyro: [0,0,0],
        accAngle: [0,0],
        gyroAngle: [0,0,0],
        angle: [0,0,0],
      };
      await BluetoothSerial.readFromDevice().then(async (data) => {
        var parsed = "";
        parsed = data.split("\r\n");
        console.log(parsed.length);
         for(var i =0 ; parsed[i]!='\0'; i++ ){
          if(parsed[i] == "*"){
            i++;
            obj.timestamp = parsed[i];
            i++;
            obj.acc[0] = parsed[i];
            i++;
            obj.acc[1] = parsed[i];
            i++;
            obj.acc[2] = parsed[i];
            i++;
            obj.gyro[0] = parsed[i];
            i++;
            obj.gyro[1] = parsed[i];
            i++;
            obj.gyro[2] = parsed[i];
            i++;
            obj.accAngle[0] = parsed[i];
            i++;
            obj.accAngle[1] = parsed[i];
            i++;
            obj.gyroAngle[0] = parsed[i];
            i++;
            obj.gyroAngle[1] = parsed[i];
            i++;
            obj.gyroAngle[2] = parsed[i];
            i++;
            obj.angle[0] = parsed[i];
            i++;
            obj.angle[1] = parsed[i];
            i++;
            obj.angle[2] = parsed[i];
            console.log(obj);
            var tid;
            await firebase.database().ref('/arduinodata/count').once('value',(snapshot) => {
              id = snapshot.val();
              console.log(id);
              tid = id.c + 1;
              firebase.database().ref('/arduinodata/count').set({
                c : tid
              });
                firebase.database().ref('/arduinodata/d' + tid ).set({
                  obj
                }).then(() => {
                  console.log("Insertion Successful");
                })
              })
            }
          }
    }).catch((err) => console.log(err.message))
    }
  }

  insertIntoDB(d){
    var obj = {
      timestamp : "",
      acc: [0,0,0],
      gyro: [0,0,0],
      accAngle: [0,0],
      gyroAngle: [0,0,0],
      angle: [0,0,0],
      loc : this.getCurrentLocation()
    };
    console.log("start");
    console.log(d);
    console.log("end");
  }

  render() {  
    return (
      <View style={styles.container}>
      <View style={styles.toolbar}>
            <Text style={styles.toolbarTitle}>Bluetooth Device List</Text>
            <View style={styles.toolbarButton}>
              <Switch
                value={this.state.isEnabled}
                onValueChange={(val) => this.toggleBluetooth(val)}
              />
            </View>
      </View>
        <Button
          onPress={this.discoverAvailableDevices.bind(this)}
          title="Scan for Devices"
          color="black"
        />
        <FlatList
          style={{flex:1}}
          data={this.state.devices}
          keyExtractor={item => item.id}
          renderItem={(item) => this._renderItem(item)}
        />
        <Button
          onPress={this.toggleSwitch.bind(this)}
          title="Collect Data"
          color="black"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  toolbar:{
    paddingTop:30,
    paddingBottom:30,
    flexDirection:'row'
  },
  toolbarButton:{
    width: 50,
    marginTop: 8,
  },
  toolbarTitle:{
    textAlign:'center',
    fontWeight:'bold',
    fontSize: 20,
    flex:1,
    color: "black",
    marginTop:6
  },
  deviceName: {
    fontSize: 17,
    color: "black"
  },
  deviceNameWrap: {
    margin: 10,
    borderBottomWidth:1
  }
});