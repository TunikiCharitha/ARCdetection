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
  InteractionManager,
  TextInput,
  Alert
} from 'react-native';
var _ = require('lodash');
import BluetoothSerial from 'react-native-bluetooth-serial';
import firebase from 'react-native-firebase';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {AppColors, AppFonts} from './AppStyles';
import MapStyles from './MapStyles';
import MapViewDirections from 'react-native-maps-directions';

const GOOGLE_API_KEY = 'AIzaSyBwwSJUZkTjAm79_OwsIqMcN7wIPyxLdaA';
const USE_METHODS = false;

const softShadow = {
  shadowColor: '#000',
  shadowOffset: {width: 0, height: 2},
  shadowOpacity: 0.3,
  shadowRadius: 2
}

export default class Conect extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isEnabled: false,
      discovering: false,
      devices: [],
      center: [0,0],
      curTime: '',
      unpairedDevices: [],
      connected: false,
      origin: {latitude: 0, longitude: 0},
      destination: ' ',
      markersArray : [ ],
      displayMarkers: false
    }
  }
  
  componentDidMount() {
    setInterval( () => {
      this.setState({
        curTime : new Date().toLocaleString()
      })
    })
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
    navigator.geolocation.getCurrentPosition((position) => {
      this.setState({
      origin: {longitude: position.coords.longitude, latitude: position.coords.latitude}
      }); 
  });
  }


  getCurrentLocation(){
    navigator.geolocation.getCurrentPosition((position) => {
        this.setState({
        origin: {longitude: position.coords.longitude, latitude: position.coords.latitude}
        }); 
    });
    return this.state.origin;
  }

  renderMarkers(){
    for(var i=0 ; i <this.state.markersArray.length ; i++ ){
        if(this.state.markersArray[i].pothole==true){
          return(<Marker coordinate={this.state.markersArray[i].loc}
            image = {require('./pot50.png')}
            />);
        }
        if(this.state.markersArray[i].speedbraker==true){
          return(<Marker coordinate={this.state.markersArray[i].loc}
            image = {require('./speed50.png')}
            />);
        }
      }
  }
  connect (device) {
    this.setState({ connecting: true })
    BluetoothSerial.connect(device.id)
    .then((res) => {
      console.log(`Connected to device ${device.name}`);  
      ToastAndroid.show(`Connected to device ${device.name}`, ToastAndroid.SHORT);
      this.setState({connected:true});
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

  // insertDB(obj){
  //   var tid;
  //   firebase.database().ref('/arduinodata/count').once('value',(snapshot) => {
  //     id = snapshot.val();
  //     console.log(id);
  //     tid = id.c + 1;
  //     console.log(tid);
  //     firebase.database().ref('/arduinodata/count').set({
  //       c : tid
  //     }).then(() =>{
  //       firebase.database().ref('/arduinodata/d' + tid ).set({
  //         obj
  //       }).then(() => {
  //         console.log("Insertion Successful");
  //       })
  //     })
  //   })
  // }

  /*async toggleSwitch(){
    while(true){
      var obj = {
        timestamp : "",
        acc: [0,0,0],
        gyro: [0,0,0],
        accAngle: [0,0],
        gyroAngle: [0,0,0],
        angle: [0,0,0],
        loc : this.getCurrentLocation()
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
  }*/

  async toggleSwitch(){
    while(true){
      await BluetoothSerial.readFromDevice().then(async (data) => {
        var obj = {
          pothole: false,
          speedbraker: false,
          loc : this.getCurrentLocation()
        };
        var parsed = "";
        var tid;
        parsed = data.split("\r\n");
        console.log(parsed.length);
        console.log(parsed);
        if(parsed[0] != ''){
            if(parsed[0]=='p'){
              obj.pothole=true;
            }
            if(parsed[0]=='s'){
              obj.speedbraker=true;
            }
            //console.log(parsed[0]);
            // if(obj.mark=='s'){
            //   obj.mark="speedbraker";
            // }
            // if(obj.mark=='p'){
            //   obj.mark="pothole";
            // }
            console.log(obj);
            var a = this.state.markersArray;
            a.push(obj);
            firebase.database().ref('/markers/count').once('value',(snapshot) => {
              id = snapshot.val();
              //console.log(id);
              tid = id.c + 1;
              firebase.database().ref('/markers/count').set({
                c : tid
              });
                firebase.database().ref('/markers/m' + tid ).set({
                  obj
                }).then(() => {
                  console.log("Insertion Successful");
                })
              })
            this.setState({markersArray : a});
            this.setState({displayMarkers : false});
            this.setState({displayMarkers : true});
        }
        /*for(var i =0 ; parsed[i]!='\0'; i++ ){
           if(parsed[i]!=' '){
            obj.mark=parsed[i]; 
            var a = this.state.markersArray;
            a.push(obj);
            this.setState({markersArray : a});
            console.log(this.state.markersArray);
            this.setState({displayMarkers : false});
            this.setState({displayMarkers : true});
           }
            await firebase.database().ref('/markers/count').once('value',(snapshot) => {
              id = snapshot.val();
              console.log(id);
              tid = id.c + 1;
              firebase.database().ref('/markers/count').set({
                c : tid
              });
                firebase.database().ref('/markers/m' + tid ).set({
                  obj
                }).then(() => {
                  console.log("Insertion Successful");
                })
              })
      }*/
        }).catch((err) => console.log(err.message))
    }
  }

  render() {  
    return (
      <View style={{flex:1}}>
      {this.state.connected ? (<View style={styles.appContainer}>
      {this.state.isNavigation ? null : (
          <View style={styles.appHeader}>
              <Text style={styles.inputLabel}>Where do you want to go?</Text>
              <View style={styles.inputContainer}>
                  <TextInput style={styles.input} underlineColorAndroid="transparent" onChangeText={destination => {this.setState({destination}); this.setState({displayPath:false})}} value={this.state.destination}/>  
                  {/* this.setState({dest:this.getDesLoc()}) */}
                  <TouchableOpacity style={styles.button} onPress={()=>{this.setState({displayPath:true})}}>
                      <Text style={styles.buttonText}>{'\ue975'}</Text>
                  </TouchableOpacity>
              </View>
          </View>
        )}
        <View style={{flex:1}}>
            <MapView
                ref={ref => this.refMap = ref}
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                customMapStyle={MapStyles}
                initialRegion={{
                    latitude: this.state.origin.latitude,
                    longitude: this.state.origin.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
                showsUserLocation={true}
                followUserLocation={true}
            >
                {this.state.displayMarkers ? (this.renderMarkers()) : null}
                {this.state.displayPath ?   <MapViewDirections
                    origin={this.getCurrentLocation()}
                    destination={this.state.destination}
                    strokeWidth={10}
                    strokeColor="royalblue"
                    apikey={"AIzaSyBwwSJUZkTjAm79_OwsIqMcN7wIPyxLdaA"}
                /> : null }
            </MapView>
            <Button
      onPress={this.toggleSwitch.bind(this)}
      title="Collect Data"
      color="black"
    />
        </View>
  </View> ) : (<View style={styles.container}>
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
  </View> )}
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
  },
  appContainer: {
    flex: 1,
},

appHeader: {
    ...softShadow,
    flexDirection: 'column',
    flex: 0,
    height: 100,
    paddingTop: 10,
    paddingHorizontal: 10,
    backgroundColor: AppColors.background,
    zIndex: 2,
},

appFooter: {
    flex: 0,
    height: 60,
    paddingHorizontal: 20,
    backgroundColor: AppColors.background,
},

inputContainer: {
    marginBottom: 0,
    flexDirection: 'row',
},

inputLabel: {
    color: AppColors.foreground,
    fontSize: 20,
    marginBottom: 10,
    fontFamily: AppFonts.light,
},

input: {
    backgroundColor: AppColors.foreground,
    color: AppColors.background,
    padding: 5,
    borderRadius: 3,
    fontSize: 19,
    flex: 1,
},

button: {
    flex: 0,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center'
},

buttonText: {
    fontFamily: "Navigation",
    fontSize: 30,
    color: AppColors.foreground,
},

map: {
    flex: 1,
}
});