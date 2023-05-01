import {View, Text, StatusBar} from 'react-native';
import React, {useEffect} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Lottie from 'lottie-react-native';
import Button from '../../components/default/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch,useSelector} from 'react-redux';
 
import { ShowToast } from '../../utils/ShowToast';
import RNThermalPrinter, { BLEPrinter } from 'react-native-thermal-receipt-printer-image-qr';
import { ColorSet, appStyle } from '../../styles';


export default function SuccessScreen({route, navigation}) {

   const dispatch = useDispatch();
  const [enable_auto_print, setEnableAutoPrint] = React.useState(0);

  const printBill = () => {
   
    
  }

  return (
    <SafeAreaView style={appStyle.container_center} >
      <View
        style={{
          alignContent: 'center',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={[appStyle.title,{
          fontSize: 20,
        }]}>
          Your Order Id: 345
        </Text>
        <Lottie
          source={require('../../assets/lottie/success.json')}
          autoPlay
          loop
          style={{width: 150, height: 150,marginBottom:10, marginTop: 10}}
        />
        <Text style={[appStyle.sub_title,{
          fontSize: 18,
          padding: 10,
        }]}>Payment completed successfully.</Text>
        
        {enable_auto_print == 0 ? (
          <Button title="Print Receipt" onPress={() => printReceipt()} />
        ) : (
          ''
        )}
        <Button title="Back to Home" onPress={() => navigation.navigate("Home")} buttonStyle={{
          marginTop: 10,
          backgroundColor: ColorSet.textColorRed,
        }}/>
      </View>
    </SafeAreaView>
  );

}
