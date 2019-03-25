import React, { Component } from 'react';
import {View, Text, TextInput, TouchableOpacity, Alert} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Styles, {AppColors, AppFonts} from './AppStyles';
import MapStyles from './MapStyles';
import MapViewDirections from 'react-native-maps-directions';
import firebase from 'react-native-firebase';
 
const GOOGLE_API_KEY = 'AIzaSyBwwSJUZkTjAm79_OwsIqMcN7wIPyxLdaA';
const USE_METHODS = false;

export default class App extends Component {

    constructor(props)
    {
        super(props);
        this.state = {
            origin: {latitude: 0, longitude: 0},
            destination: ' ',
        }
    }

    renderMarkers(){
        return(<Marker coordinate={this.state.origin}
        image = {require('./pot50.png')}
        />);
    }

    componentWillMount(){
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

    render()
    {
      return (
          <View style={Styles.appContainer}>
              {this.state.isNavigation ? null : (
                  <View style={Styles.appHeader}>
                      <Text style={Styles.inputLabel}>Where do you want to go?</Text>
                      <View style={Styles.inputContainer}>
                          <TextInput style={Styles.input} underlineColorAndroid="transparent" onChangeText={destination => {this.setState({destination}); this.setState({displayPath:false})}} value={this.state.destination}/>  
                          {/* this.setState({dest:this.getDesLoc()}) */}
                          <TouchableOpacity style={Styles.button} onPress={()=>{this.setState({displayPath:true})}}>
                              <Text style={Styles.buttonText}>{'\ue975'}</Text>
                          </TouchableOpacity>
                      </View>
                  </View>
                )}
                <View style={{flex:1}}>
                    <MapView
                        ref={ref => this.refMap = ref}
                        provider={PROVIDER_GOOGLE}
                        style={Styles.map}
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
                        {this.renderMarkers()}
                        {this.state.displayPath ?<MapViewDirections
                            origin={this.getCurrentLocation()}
                            destination={this.state.destination}
                            strokeWidth={10}
                            strokeColor="royalblue"
                            apikey={"AIzaSyBwwSJUZkTjAm79_OwsIqMcN7wIPyxLdaA"}
                        />
                         : null }
                        {/* { this.state.displayPath ? (this.renderMarkers()) : null} */}
                    </MapView>
                </View>
          </View>
        )
    }
}