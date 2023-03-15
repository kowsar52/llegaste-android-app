import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Switch,TouchableOpacity, Modal,TextInput,Pressable } from 'react-native';
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

const CheckoutSuccess = ({navigation,route}) => {
  const {txn_id,message} = route.params;
  //printer
  const [printers, setPrinters] = useState([]);
  const [currentPrinter, setCurrentPrinter] = useState();

  useEffect(() => {
    BLEPrinter.init().then(()=> {
      BLEPrinter.getDeviceList().then(setPrinters);
    });
  }, []);

  const _connectPrinter = ((printer) => {
    console.log("printer==", printer);
    //connect printer
    BLEPrinter.connectPrinter(printer.inner_mac_address).then(
      setCurrentPrinter,
      error => console.warn(error))
  })

  const printBill = () => {
    if(!currentPrinter) {
      ShowToast("Please connect printer first");
      return;
    }
    //template design for llegaste receipt
    let receipt_template = ``;
    receipt_template += `<C> <B> Llegaste Tech</B> </C>\n`;
    receipt_template += `<C> 1234 Main St </C>\n`;
    receipt_template += `<C> New York, NY 10001 </C>\n`;
    receipt_template += `<C> (212) 555-1212 </C>\n`;
    receipt_template += `<C> www.llegaste.com </C>\n`;
    receipt_template += `<C> -------------------------------- </C>\n`;
    receipt_template += `<L> Approval No # ${txn_id} </L>\n`;
    receipt_template += `<L>Total Amount: $${amount} </L>\n`;
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
    } else {
      ShowToast("Message length is greater than 5000");
    }
    
  }


  return (
    <View style={styles.container}>
          {/* mavbar start  */}
          <View style={styles.navbar}>
        <Pressable style={styles.leftIcon} onPress={() => navigation.navigate('Home')}> 
          <Icon name="arrow-back" size={20} color="#333" />
        </Pressable>
        <Text style={styles.navTitle}>Transactions</Text>
        <Pressable onPress={() => navigation.navigate("Account")}>
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
     {
        printers.map(printer => (
          <TouchableOpacity key={printer.inner_mac_address} onPress={() => _connectPrinter(printer)} style={{
            backgroundColor: '#fff',
            padding: 10,
            margin: 10,
            borderRadius: 5,
            borderWidth: 1,
            borderColor: '#ccc',
            width: '100%',
            textAlign: 'center',
            justifyContent: 'center',
            
          }}>
            {`Device: ${printer.device_name}`}
          </TouchableOpacity>
          ))
      }
 

       <Button title="Print Receipt"  onPress={() => printBill()} icon="print-outline" disabled={true}  buttonStyle={styles.buttonStyle}/>
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
  
});

export default CheckoutSuccess;
