import React, {useState,useRef,useEffect} from 'react';
import {StyleSheet, TextInput,View,Text} from 'react-native';
import {ColorSet, FamilySet} from '../../styles';
import {horizontalScale, verticalScale} from '../../utils/ScaleUtils';
import Icon from 'react-native-vector-icons/Ionicons';

const AmountInput = props => {
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
  const inputRef = useRef();
  useEffect(() => {
   setTimeout(() => {
    inputRef.current.focus();
   }, 0);
}, []);

  const onFocusHandler = () => {
    setIsActive(true);
  };

  const onBlurHandler = () => {
    setIsActive(false);
  };

  return (
<View style={styles.styleGroup}>
     <View>
     <Text style={styles.icon}>$</Text>
   
   <TextInput
       ref={inputRef}
       placeholderTextColor={ColorSet.textColorDark}
     onPressIn={onPressIn}
     onFocus={onFocusHandler}
     onBlur={onBlurHandler}
     onChangeText={onChangeText}
     value={value}
     keyboardType={keyboardType}
     style={[
       styles.textInput,
       inputStyle,
     ]}
     placeholder={placeholder}
     multiline={multiline}
     secureTextEntry={secureTextEntry}
     editable={editable}
     maxLength={maxLength}
   />
     </View>
</View>

  );
};

const styles = StyleSheet.create({
  textInput: {
    width:"100%",
    fontFamily: FamilySet.bold,
    fontSize: 58,
    color: ColorSet.textColorDark,
    paddingLeft: 55,
  },
  styleGroup:{
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    width: '100%',
  },
  icon: {
    position: 'absolute',
    top: 15,
    left: 15,
    fontSize: 58,
    color: ColorSet.theme,
    fontFamily: FamilySet.bold,

  }
});

export default AmountInput;
