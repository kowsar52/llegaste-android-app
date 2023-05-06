import { View, Text,TextInput } from 'react-native'
import React from 'react'
import { ColorSet, FamilySet } from '../../styles';

export default function PercentageInput(props) {
    const {
        keyboardType,
        onChangeText,
        onKeyPress,
        value,
        placeholder,
        inputStyle,
        secureTextEntry,
        editable,
        onPressIn,
        placeholderTextColor,
        multiline,
        maxLength,
        icon,
        postfix = false
      } = props;
  return (
    <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap:0,
        
      }}>
        <TextInput
          keyboardType="numeric"
          value={value.toString()}
          onChangeText={onChangeText}
          style={{
            fontSize: 18,
            fontFamily: FamilySet.regular,
            color: ColorSet.black,
            padding: 0,
            margin: 0,
            alignContent: 'flex-end',
            textAlign: 'right',
          }}
        />
        {postfix && 
        <Text style={{
           fontSize: 18,
           fontFamily: FamilySet.regular,
           color: ColorSet.black,
            padding: 0,
            margin: 0,
        }}>%</Text>}
      </View>
  )
}