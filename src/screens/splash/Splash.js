import { View, StyleSheet, Image,Text } from 'react-native'
import React from 'react'
import Lottie from 'lottie-react-native';
import Button from '../../components/default/Button';
import { ColorSet } from '../../styles';
import {Screens} from '../../constants'
import {getUserData} from '../../utils/Storage';

export default function Splash({ navigation }) {
 const handleNext = async () => {
    const user = await getUserData();
    if(user){
      // navigation.navigate(Screens.checkoutSuccess,{
      //   message : "Payment Successful",
      //   txn_id : '223232323'
      // })
      navigation.navigate('Home')
    }else{
      navigation.navigate(Screens.login)
    }
  }

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/logo.png')} style={styles.logo}/>
      <Text style={styles.heading}>Be in control of your money</Text>
       <Lottie source={require('../../assets/lottie/splash.json')} autoPlay loop style={{
            width: 300,
            height: 300,
            alignSelf: 'center'
       }}/>
       <View style={styles.button}>
       <Button title="Let's go"  onPress={() => handleNext()} icon="arrow-forward-outline" disabled={true}  buttonStyle={styles.buttonStyle}/>
     
       </View >
      
    </View>
  )
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: '#fff',
        flex: 1,

    },
    logo: {
        height: 70,
        objectFit: 'contain',
        width: 160,
        marginHorizontal: 15,
        marginTop: 20
    },
    heading:{
      fontSize: 42,
      padding: 20,
      color: ColorSet.textColorDark,
      fontFamily: "TTCommons-Bold"
    },
    button: {
        position: 'absolute',
        bottom: 20,
        width: '100%',
        zIndex: 1,
        padding: 20,
    },
    buttonStyle: {
        textAlign: 'center',
        justifyContent: 'center',
    },
    button2:{
        color: ColorSet.theme,
        textAlign: 'center',
        alignContent: 'center',
        alignItems: 'center',
        padding: 20,
        fontSize: 18,
        fontFamily: "TTCommons-Regular"
    }


})   
