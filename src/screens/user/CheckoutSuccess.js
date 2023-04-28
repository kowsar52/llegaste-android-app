import {View, Text, StatusBar} from 'react-native';
import React, {useEffect} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Lottie from 'lottie-react-native';
import Button from '../components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch,useSelector} from 'react-redux';
import {clearCart} from '../store/cart-slice';
import { ShowToast } from '../utils/ShowToast';
import RNThermalPrinter, { BLEPrinter } from 'react-native-thermal-receipt-printer';


export default function SuccessScreen({route, navigation}) {
  const {order_id, order_details} = route.params;
   //printer
   const currentPrinter = useSelector(state => state.auth.userPrinter);
   const dispatch = useDispatch();
 
  useEffect(() => {
    dispatch(clearCart());
    setTimeout(() => {
      //clear the cart
      navigation.navigate('Splash');
    }, 30000);
  });

  const printBill = () => {
    console.log('currentPrinter',currentPrinter)
    if(!currentPrinter) {
      ShowToast("Please connect printer first");
      navigation.navigate('PrinterSetting')
    }
    BLEPrinter.connectPrinter(currentPrinter?.inner_mac_address)
    //template design for llegaste receipt
    let receipt_template = ``;
    receipt_template += `<C> <B> Lavillita</B> </C>\n`;
    receipt_template += `<C> 1234 Main St </C>\n`;
    receipt_template += `<C> New York, NY 10001 </C>\n`;
    receipt_template += `<C> (212) 555-1212 </C>\n`;
    receipt_template += `<C> www.lavillita.com </C>\n`;
    receipt_template += `<C> -------------------------------- </C>\n`;
    receipt_template += `<L> Order No # ${order_id} </L>\n`;
    receipt_template += `<L>Total Amount: $${parseFloat(10).toFixed(2)} </L>\n`;
    receipt_template += `<L> Date: ${new Date().toLocaleDateString()} </L>\n`;
    receipt_template += `<L> Time: ${new Date().toLocaleTimeString()} </L>\n`;
    receipt_template += `<C> -------------------------------- </C>\n`;
    //footer
    receipt_template += `<C> <QR>https://www.lavillita.com</QR> </C>\n`;
    receipt_template += `<C> Scan me to return to the store. </C>\n`;
    receipt_template += `<C> -------------------------------- </C>\n`;
 
    //check if message length is less than 5000
    if(receipt_template.length < 5000) {
     BLEPrinter.printBill(receipt_template);
     BLEPrinter.printQRCode("https://www.lavillita.com");
     ShowToast("Print successfully completed.")
     //wait 5 seconds
     setTimeout(() => {
        navigation.navigate('Home')
      }, 5000);
    } else {
      ShowToast("Message length is greater than 5000");
    }
    
  }

  return (
    <SafeAreaView className="p-5">
      <StatusBar hidden={true} />
      <View className=" m-auto">
        <Text className="mt-[20%] text-center font-extrabold text-2xl uppercase">
          Your Order Id: #{order_id}
        </Text>
        <Text className="text-center p-2 text-gray-500">
          Order will be delivered in 30 minutes
        </Text>
        <Lottie
          source={require('../assets/animation/success.json')}
          autoPlay
          loop
          style={{width: 300, height: 300}}
        />
        <Text className="mt-[30%] text-center font-extrabold text-2xl uppercase text-red-500">
          Thank you
        </Text>
        <Text className="text-center p-2 text-gray-500">{order_details}</Text>
        <Button
          text="Print"
          styleClass="mt-5 rounded-full p-4"
          onPress={() => printBill()}
        />

        {/* <View style={{
          flex: 1,
          gap: 2,
        }}>
        <Button
          text="Order Again"
          styleClass="mt-5 rounded-full p-4"
          onPress={() => navigation.navigate('Home')}
        />
         
        </View> */}
      </View>
    </SafeAreaView>
  );
}
