import React from 'react';
import {StyleSheet, View, ActivityIndicator} from 'react-native';
import {useSelector} from 'react-redux';
import {ColorSet} from '../../styles';
import {screenHeight, screenWidth} from '../../styles/screenSize';
import {verticalScale} from '../../utils/ScaleUtils';

const Loader = props => {
  const isLoading = useSelector(state => state.loading.isLoading);
  const {visible} = props;

  return visible || isLoading ? (
    <View style={styles.loaderView}>
      <ActivityIndicator size="large" color={ColorSet.white} style={{}} />
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  loaderView: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
});

export default Loader;
