import React, { useEffect, useState } from 'react';
import { useDispatch,useSelector } from 'react-redux';
import { StyleSheet, Text, View, Switch,TouchableOpacity, Modal,Alert,Pressable } from 'react-native';
import { appStyle, ColorSet,FamilySet } from '../../styles';
import Button from '../../components/default/Button';
import Icon from 'react-native-vector-icons/Ionicons';
import Lottie from 'lottie-react-native';
import {Platform} from 'react-native';
import {
  USBPrinter,
  NetPrinter,
  BLEPrinter,
  BluetoothEscposPrinter,
} from "react-native-thermal-receipt-printer";
import { ShowToast } from '../../utils/ShowToast';
import {setIsLoading} from '../../redux/reducers/loadingSlice/LoadingSlice';
import {setUserType} from '../../redux/reducers/authSlice/AuthServices';
import {setUserData} from '../../redux/reducers/userSlice/UserServices';
import {logoutUser } from '../../networking/authServices/AuthAPIServices';
import {removeData} from '../../utils/Storage';
import {Keys, Screens} from '../../constants';
import {StackActions} from '@react-navigation/native';


const CheckoutSuccess = ({navigation,route}) => {
  const {txn_id,message,amount} = route.params;
  //printer
  const currentPrinter = useSelector(state => state.auth.userPrinter);
  const dispatch = useDispatch();


  const printBill = () => {
    console.log('currentPrinter',currentPrinter)
    if(!currentPrinter) {
      ShowToast("Please connect printer first");
      navigation.navigate(Screens.printerSetting)
    }
    BLEPrinter.connectPrinter(currentPrinter.inner_mac_address)
    //template design for llegaste receipt
    let receipt_template = ``;
    receipt_template += `<C> <B> Llegaste Tech</B> </C>\n`;
    receipt_template += `<C> 1234 Main St </C>\n`;
    receipt_template += `<C> New York, NY 10001 </C>\n`;
    receipt_template += `<C> (212) 555-1212 </C>\n`;
    receipt_template += `<C> www.llegaste.com </C>\n`;
    receipt_template += `<C> -------------------------------- </C>\n`;
    receipt_template += `<L> Approval No # ${txn_id} </L>\n`;
    receipt_template += `<L>Total Amount: $${parseFloat(amount).toFixed(2)} </L>\n`;
    receipt_template += `<L> Date: ${new Date().toLocaleDateString()} </L>\n`;
    receipt_template += `<L> Time: ${new Date().toLocaleTimeString()} </L>\n`;
    receipt_template += `<C> -------------------------------- </C>\n`;
    //footer
    receipt_template += `<C> <QR>https://www.llegaste.com</QR> </C>\n`;
    receipt_template += `<C> Scan me to return to the store. </C>\n`;
    receipt_template += `<C> -------------------------------- </C>\n`;
 
    //check if message length is less than 5000
    if(receipt_template.length < 5000) {
     BLEPrinter.printBill(receipt_template);
     ShowToast("Print successfully completed.")
    } else {
      ShowToast("Message length is greater than 5000");
    }
    
  }

    //logoutHandler
    const logoutHandler = () => {
      Alert.alert("Logout", "Are you sure you want to logout?",[
        {
          text: "No",
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: async () => {
            dispatch(setIsLoading(true));
            const response = await logoutUser();
            console.log('response', response)
            if (response) {
              await removeData(Keys.user);
              dispatch(setUserData(null));
              dispatch(setUserType(null));
              dispatch(setIsLoading(false));
              navigation.dispatch(StackActions.replace('Login'));
            } 
          }
        }
      ])
    }


  return (
    <View style={styles.container}>
          {/* mavbar start  */}
          <View style={styles.navbar}>
        <Pressable style={styles.leftIcon} onPress={() => navigation.navigate('Home')}> 
          <Icon name="arrow-back" size={20} color="#333" />
        </Pressable>
        <Text style={styles.navTitle}>Transactions</Text>
        <Pressable onPress={() => logoutHandler()}>
        <Icon name="log-out-outline" size={20} color="#333" />
        </Pressable>
      </View>
      {/* mavbar end  */}

     <View>
        <Lottie source={require('../../assets/lottie/success.json')} autoPlay loop  style={{
            width: 200,
            height: 200,
            alignSelf: 'center',
            marginTop: 20,
        }}/>
        <Text style={{
            fontSize: 20,
            fontFamily: FamilySet.bold,
            color: ColorSet.textColorDark,
            textAlign: 'center',
            paddingTop: 30,
            
        }}>{message}</Text>
           <Text style={{
            fontSize: 20,
            fontFamily: FamilySet.bold,
            color: ColorSet.textColorGrayNew,
            textAlign: 'center',
            paddingTop: 10,
            
        }}>Approved code is #{txn_id}</Text>
     </View>

     <View style={styles.button}>
       <Button title="Print Receipt"  onPress={() => printBill()} icon="print-outline" disabled={true}  buttonStyle={styles.buttonStyle}/>
       <Button title="Go to Checkout"  onPress={() => navigation.navigate(Screens.home)}  buttonStyle={styles.buttonStyle_2}/>
      </View >

    </View>
  );
};

const styles = StyleSheet.create({
    
  navbar:{
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    maxHeight: 70,
    padding: 20,
      
  },
  leftIcon:{
      width: 20,
  },
  navTitle:{
      fontSize: 20,
      fontFamily: FamilySet.bold,
      color: ColorSet.textColorDark,

  } ,
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: ColorSet.textColorDark,
    fontFamily: 'TTCommons-Bold',
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
buttonStyle_2:{
  textAlign: 'center',
  justifyContent: 'center',
  marginTop: 5,
  backgroundColor : ColorSet.redDeleteColor
}
  
});

export default CheckoutSuccess;
