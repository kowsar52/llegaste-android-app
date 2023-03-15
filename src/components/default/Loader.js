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
      <ActivityIndicator size="large" color={ColorSet.theme} />
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  loaderView: {
    position: 'absolute',
    top: screenHeight.height50,
    left: screenWidth.width45,
    zIndex: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ColorSet.white,
    borderRadius: 10,
    width: verticalScale(80),
    height: verticalScale(80),
    shadowColor: ColorSet.shadow,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
  },
});

export default Loader;
