import {AppRegistry} from 'react-native';
import React from 'react';
import Root from './Root';
import {name as appName} from './app.json';
import {Provider} from 'react-redux';

import store from './src/redux/store'

const RNRedux = () => (
  <Provider store={store}>
    <Root />
  </Provider>
);

AppRegistry.registerComponent(appName, () => RNRedux);
