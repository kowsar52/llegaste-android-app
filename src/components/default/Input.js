import React, {useState} from 'react';
import {StyleSheet, TextInput,View,Text} from 'react-native';
import {ColorSet, FamilySet} from '../../styles';
import {horizontalScale, verticalScale} from '../../utils/ScaleUtils';
import Icon from 'react-native-vector-icons/Ionicons';

const Input = props => {
  const {
    keyboardType,
    onChangeText,
    value,
    placeholder,
    inputStyle,
    secureTextEntry,
    editable,
    onPressIn,
    placeholderTextColor,
    multiline,
    maxLength,
    icon
  } = props;

  const [isActive, setIsActive] = useState(false);

  const onFocusHandler = () => {
    setIsActive(true);
  };

  const onBlurHandler = () => {
    setIsActive(false);
  };

  return (
    <View style={styles.styleGroup}>
      {icon == "$" ? <Text style={styles.icon}>$</Text>:  <Icon style={styles.icon} name={icon} size={20} color="#000"/>}
   
    <TextInput
      onPressIn={onPressIn}
      onFocus={onFocusHandler}
      onBlur={onBlurHandler}
      onChangeText={onChangeText}
      value={value}
      keyboardType={keyboardType}
      style={[
        icon ? {paddingLeft: 40} : {paddingLeft: 15},
        styles.textInput,
        {borderColor: isActive ? ColorSet.theme : ColorSet.bgLight},
        inputStyle,
      ]}
      placeholder={placeholder}
      multiline={multiline}
      placeholderTextColor={
        placeholderTextColor ? placeholderTextColor : ColorSet.textColorGrayNew4
      }
      secureTextEntry={secureTextEntry}
      editable={editable}
      maxLength={maxLength}
    />
</View>

  );
};

const styles = StyleSheet.create({
  textInput: {
    borderWidth: 1,
    borderRadius: 5,
    width:"100%",
    height: verticalScale(58),
    paddingHorizontal: horizontalScale(20),
    fontFamily: FamilySet.medium,
    fontSize: 16,
    alignItems: 'center',
    color: ColorSet.textColorDark,
    marginBottom: verticalScale(10),
    paddingTop: 15,

  },
  styleGroup:{
    position: 'relative',
    width: '100%',
  },
  icon: {
    position: 'absolute',
    top: 15,
    left: 15,
    color: ColorSet.theme,

  }
});

export default Input;
