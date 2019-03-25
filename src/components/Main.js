import React, { Component } from 'react';
import Dimensions from 'Dimensions';
import Timestamp from 'react-timestamp';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  Alert,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import firebase from 'react-native-firebase';
import BluetoothSerial from 'react-native-bluetooth-serial';

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      center: [0,0],
      curTime: '',
      potHoles: false,
      speedBrakers: false,
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
    navigator.geolocation.getCurrentPosition((position) => {
      this.setState({
        center: [position.coords.longitude, position.coords.latitude],
      });
  });
  }

  getCurrentLocation(){
    navigator.geolocation.getCurrentPosition((position) => {
      this.setState({
        center: [position.coords.longitude, position.coords.latitude],
      });
  });
    return [this.state.center[0], this.state.center[1]];
  }

  insertARC(timeStamp,potHole,speedBraker){
    var tid;
    firebase.database().ref('/arc/count').once('value',(snapshot) => {
      id = snapshot.val();
      console.log(id);
      tid = id.c + 1;
      console.log(tid);
      firebase.database().ref('/arc/count').set({
        c : tid
      }).then(() =>{
        firebase.database().ref('/arc/adv' + tid ).set({
          timeStamp,potHole,speedBraker
        }).then(() => {
          console.log("Insertion Successful");
        })
      })
    })
  }

  async insertData(){
    while(true){
      var obj = {
        timestamp : "",
        acc: [0,0,0],
        gyro: [0,0,0],
        accAngle: [0,0],
        gyroAngle: [0,0,0],
        angle: [0,0,0],
        //loc : this.getCurrentLocation()
      };
      await BluetoothSerial.readFromDevice().then((data) => {
        var parsed = "";
        parsed = data.split("\r\n");
        console.log(parsed.length);
        console.log(data);
         for(var i =0 ; i < parsed.length; i++ ){
          if(parsed[i] == "*"){
            i++;
            obj.timestamp = parsed[i].split(":")[1];
            i++;
            obj.acc[0] = parsed[i].split(":")[1];
            i++;
            obj.acc[1] = parsed[i].split(":")[1];
            i++;
            obj.acc[2] = parsed[i].split(":")[1];
            i++;
            obj.gyro[0] = parsed[i].split(":")[1];
            i++;
            obj.gyro[1] = parsed[i].split(":")[1];
            i++;
            obj.gyro[2] = parsed[i].split(":")[1];
            i++;
            obj.accAngle[0] = parsed[i].split(":")[1];
            i++;
            obj.accAngle[1] = parsed[i].split(":")[1];
            i++;
            obj.gyroAngle[0] = parsed[i].split(":")[1];
            i++;
            obj.gyroAngle[1] = parsed[i].split(":")[1];
            i++;
            obj.gyroAngle[2] = parsed[i].split(":")[1];
            i++;
            obj.angle[0] = parsed[i].split(":")[1];
            i++;
            obj.angle[1] = parsed[i].split(":")[1];
            i++;
            obj.angle[2] = parsed[i].split(":")[1];
          }
          console.log(obj);
          /*firebase.database().ref('/data/count').once('value',(snapshot) => {
            id = snapshot.val();
            console.log(id);
            tid = id.c + 1;
            console.log(tid);
          }).then(() => {
            firebase.database().ref('/data/count').set({
              c : tid
            }).then(() =>{
              firebase.database().ref('/data/d' + tid ).set({
                obj
              }).then(() => {
                console.log("Insertion Successful");
              })
            })
  
          })      */  
        }
      }).catch((err) => console.log(err.message))
    }    
  }

  render() {
    return (
        <View style={styles.container}>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity  onPress={() => { this.setState({ speedBrakers: false,  potHoles: true }, this.insertARC(this.state.curTime, this.state.potHoles, this.state.speedBrakers)) }}>
              <Text style={styles.button}>Pot Holes</Text>
            </TouchableOpacity>  
          </View>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity  onPress={() => { this.setState({ speedBrakers: true,  potHoles: false }, this.insertARC(this.state.curTime, this.state.potHoles, this.state.speedBrakers)) }}>
              <Text style={styles.button}>Speed Brakers</Text>
            </TouchableOpacity>  
          </View>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity  onPress={() => { this.insertData()}}>
              <Text style={styles.button}>Collect data</Text>
            </TouchableOpacity>  
          </View>
        </View>
      );
    }

  }
  
  


const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
      },
      buttonsContainer:{
        alignItems: 'center',
        justifyContent: 'center',
      },
      button:{
        fontFamily: 'gotham rounded',
        backgroundColor:"#841584",
        textAlign: 'center',
        fontSize: 24,
        alignItems: 'center',
        marginBottom:5,
        height: 40,
        width: DEVICE_WIDTH - 100,
        color: 'white',
        textAlignVertical: 'center',
      },
});