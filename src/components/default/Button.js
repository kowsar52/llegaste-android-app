import React from 'react';
import {Pressable, Text, StyleSheet, View} from 'react-native';
import {ColorSet, FamilySet} from '../../styles';
import {horizontalScale, verticalScale} from '../../utils/ScaleUtils'
import Icon from 'react-native-vector-icons/Ionicons';

const Button = props => {
  const {buttonStyle, textStyle, title, onPress, icon, disabled, ammount, servicesCount } = props;

  return (
    <Pressable  style={[styles.button, buttonStyle]} onPress={onPress}>
      {ammount ? 
      <View style={styles.amountServicesView}>
        <Text style={[styles.title, textStyle]}>{title}</Text>
        <View style={styles.flexEnd}>
        <Text style={styles.servicesCount}>{servicesCount}</Text>
        <Text style={styles.ammount}>{ammount}</Text>
        </View>
      </View>
      :
      <Text style={[styles.title, textStyle]}>{title}</Text>}
      {icon && (
        <View style={styles.iconView}>
          <Icon name={icon} size={verticalScale(26)} color={ColorSet.white} />
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: ColorSet.theme,
    height: verticalScale(60),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: horizontalScale(20),
    borderRadius: 10,
    shadowColor: ColorSet.theme,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    elevation: 8,
  },
  title: {
    color: ColorSet.white,
    fontFamily: FamilySet.medium,
    fontSize: verticalScale(20),
    lineHeight: verticalScale(27),
    textAlign:'center'
  },
  ammount: {
    color: ColorSet.white,
    fontFamily: FamilySet.bold,
    fontSize: verticalScale(16),
    lineHeight: verticalScale(25),
  },
  servicesCount: {
    color: ColorSet.white,
    fontFamily: FamilySet.medium,
    fontSize: verticalScale(12),
    lineHeight: verticalScale(18),
  },
  iconView:{
    width: verticalScale(36),
    height: verticalScale(36),
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flexEnd:{
    alignItems:'flex-end'
  },
  amountServicesView:{
    width:'100%',
    height: verticalScale(60),
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between'
  },
});

export default Button;
