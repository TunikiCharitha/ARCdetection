import React, { Component } from 'react';
import {
  AppRegistry,
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  TouchableOpacity,
  ImageBackground
} from 'react-native';
 
import Swiper from 'react-native-swiper';
import ConnectToDevice from './ConnectToDevice';
import Connect from './Connect';
import Navigate from './Navigate';
import Mappers from './Mappers';
import {Actions} from 'react-native-router-flux';
 
const styles = StyleSheet.create({
  wrapper: {
  },
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffff',
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffff',
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffff',
  },
  text: {
    color: '#ffff',
    fontSize: 25,
    fontWeight: 'bold',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: '#202020',
  },
   button: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    backgroundColor: '#202020',
    paddingLeft: 20,
    position: 'absolute',
    borderRadius: 30,
    paddingRight: 20
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'stretch', 
    width:400
  },
  logo:{
    height:20,
    width:20,
    top: 50,
    bottom: 50
  },
})
 
export default class Swipers extends Component {
  render(){
    return (

      <Swiper style={styles.wrapper} showsButtons={true} index={1} loop={false}>
        <View style={styles.slide1}>
        <Image source={require('./bg4.png')} style={styles.backgroundImage}/>
        <TouchableOpacity style={styles.button} onPress={() => Actions.Trial()}>    
          <Text style={styles.text}>NAVIGATION MODE</Text>  
        </TouchableOpacity>
 
        </View>
        
        <View style={styles.slide3}>
          <Image source={require('./logo.jpeg')} style={styles.backgroundImage}/>
        </View>

        <View style={styles.slide2}>
        <Image source={require('./bg4.png')} style={styles.backgroundImage}/>
        <TouchableOpacity style={styles.button} onPress={() => Actions.Connect()}>    
          <Text style={styles.text}>MAPPER MODE</Text>   
        </TouchableOpacity>
        </View>
      </Swiper> 
    );
  }
}