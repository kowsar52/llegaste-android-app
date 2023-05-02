import { View, Image } from 'react-native'
import React from 'react'
import { appStyle } from '../../styles'

export default function LogoLoader() {
  return (
    <View style={appStyle.container_center}>
      <Image source={require('../../assets/logo.png')}/>
    </View>
  )
}