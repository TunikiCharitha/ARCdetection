import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import Mapbox from '@mapbox/react-native-mapbox-gl';

Mapbox.setAccessToken('pk.eyJ1IjoidmFuaXRoYWt1bnRhIiwiYSI6ImNqczk3c2ZzeTBqbmY0NHF4OGx6cnMxMTUifQ.qatpKqtWDvfOWoIUk83H3A');

export default class Navigate extends Component {
    constructor(props) {
    super(props);
    this.state = {
      center: [78.3, 17.4],
      }
    }

  componentWillMount(){
    navigator.geolocation.getCurrentPosition((position) => {
      this.setState({
        center: [position.coords.longitude, position.coords.latitude],
        zoomLevel: 20
      });
  });
  }

  render() {
    return (
      <View style={styles.container}>
        <Mapbox.MapView
            styleURL={Mapbox.StyleURL.Street}
            zoomLevel={5}
            centerCoordinate={this.state.center}
            style={styles.container}
            showUserLocation={true}>
        </Mapbox.MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});