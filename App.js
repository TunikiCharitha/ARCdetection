import React from 'react';
import { View, Text,Alert } from 'react-native';
import Mappers from './src/components/Mappers';
import Swipe from './src/components/Swipe';
import Navigate from './src/components/Navigate';
import Connect from './src/components/Connect';
import ConnectToDevice from './src/components/ConnectToDevice';
import { Router, Scene } from 'react-native-router-flux';
import Trial from './src/components/Trial';

class App extends React.Component {
  render() {
    return (
      <Router>
        <Scene key="root">
          <Scene key="Mappers"
            component={Mappers}
            //initial
            hideNavBar={true}
          />
          <Scene key="Swipe"
            component={Swipe}
            initial
            hideNavBar={true}
          />
          <Scene key="Connect"
            component={Connect}
            //initial
            hideNavBar={true}
          />
          <Scene key="Trial"
            component={Trial}
            //initial
            hideNavBar={true}
          />
        </Scene>
      </Router>
    );
  }
}

export default App;