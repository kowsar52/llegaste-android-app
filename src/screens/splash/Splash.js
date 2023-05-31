import { View, StyleSheet, Image,Text } from 'react-native'
import React, { useContext } from 'react'
import Lottie from 'lottie-react-native';
import Button from '../../components/default/Button';
import { ColorSet } from '../../styles';
import {Screens} from '../../constants'
import {getUserData} from '../../utils/Storage';
import { AuthContext } from '../../context/auth-context';
import { useStripeTerminal } from '@stripe/stripe-terminal-react-native';
import { ShowToast } from '../../utils/ShowToast';

export default function Splash({ navigation }) {
  const authCTX = useContext(AuthContext);
  const {connectedReader, initialize} = useStripeTerminal();
  const handleNext = async () => {
      if(authCTX.isAuthenticated){
        if(!connectedReader){
          ShowToast("Please connect your reader first!")
          navigation.navigate(Screens.setupTerminal)
          return
        }

        navigation.navigate(Screens.home)
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
