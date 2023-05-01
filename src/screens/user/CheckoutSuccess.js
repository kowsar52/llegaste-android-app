import {View, Text, StatusBar, Alert} from 'react-native';
import React, {useEffect} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Lottie from 'lottie-react-native';
import Button from '../../components/default/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch,useSelector} from 'react-redux';
 
import { ShowToast } from '../../utils/ShowToast';
import {
  BLEPrinter,
  NetPrinter,
  USBPrinter,
  IUSBPrinter,
  IBLEPrinter,
  INetPrinter,
  ColumnAlignment,
  COMMANDS,
} from 'react-native-thermal-receipt-printer-image-qr';
import { ColorSet, appStyle } from '../../styles';
import { setIsLoading } from '../../redux/reducers/loadingSlice/LoadingSlice';
import { getData } from '../../utils/Storage';
import { Keys } from '../../constants';


export default function SuccessScreen({route, navigation}) {

   const dispatch = useDispatch();
  const [enable_auto_print, setEnableAutoPrint] = React.useState(0);
  const [currentPrinter, setCurrentPrinter] = React.useState();
  const {txn_id , total_amount} = route.params

  const getCurrentPrinter = async () => {
    //enable_auto_print
    const enable_auto_print = await getData('enable_auto_print');
    if (enable_auto_print) {
      setEnableAutoPrint(enable_auto_print);
    }
    
    const res = await getData(Keys.userPrinter);
    console.log('printer',res)
    if (res) {
      setCurrentPrinter(res);
    }
  };

  useEffect(() => {
    getCurrentPrinter();
  }, []);

  const printReceipt = () => {
    if (!currentPrinter) {
      ShowToast('Please connect printer first');
      navigation.navigate('PrinterSetting');
    } else {
      try {
        setIsLoading(true);
        const Printer = BLEPrinter;
        console.log('currentPrinter', currentPrinter);
        Printer.connectPrinter(currentPrinter?.inner_mac_address)
        const BOLD_ON = COMMANDS.TEXT_FORMAT.TXT_BOLD_ON;
        const BOLD_OFF = COMMANDS.TEXT_FORMAT.TXT_BOLD_OFF;
        const CENTER = COMMANDS.TEXT_FORMAT.TXT_ALIGN_CT;
        const OFF_CENTER = COMMANDS.TEXT_FORMAT.TXT_ALIGN_LT;
        // const logo = require('../../assets/logo.jpeg');
        // Printer.printImage(logo, {
        //   imageWidth: 200,
        //   imageHeight: 200,
        // });
        
          let textTemplate = `<C> LLegaste H,DD </C>\n`;
          textTemplate += `<C> New York, USA </C>\n`;
          textTemplate += `<C> +34434534543 </C>\n`;
          textTemplate += `Host : POS\n`;
          textTemplate += `Date : ${new Date().toLocaleDateString()} | ${new Date().toLocaleTimeString()}\n`;
          textTemplate += `Trx ID - #${txn_id}\n`;
          textTemplate += `Payment Status - PAID\n`;
          textTemplate += `${CENTER}${COMMANDS.HORIZONTAL_LINE.HR2_58MM}${CENTER}`;
          Printer.printText(textTemplate, {
            beep: false,
            cut: false,
          });
  
      
          let columnAlignment = [
              ColumnAlignment.LEFT,
              ColumnAlignment.RIGHT,
            ];
            let columnWidth = [30 -  8,  8];
     
  
        Printer.printColumnsText(
          ['TAX', '$0.00'],
          columnWidth,
          columnAlignment,
          [`${BOLD_OFF}`, '',''],
        );
        Printer.printColumnsText(
          ['Total Amount',  `$${parseFloat(total_amount).toFixed(2)}`],
          columnWidth,
          columnAlignment,
          [`${BOLD_OFF}`, '',''],
        );
      
        Printer.printText(
          `${CENTER}${COMMANDS.HORIZONTAL_LINE.HR2_58MM}${CENTER}`
        );
        Printer.printText('<C>QR Code</C>');
        Printer.printImage(
          'https://blog.hubspot.com/hs-fs/hubfs/Google%20Drive%20Integration/DRAFT%20how%20to%20get%20a%20qr%20code-Nov-16-2022-06-26-37-4642-PM.jpeg?width=381&height=378&name=DRAFT%20how%20to%20get%20a%20qr%20code-Nov-16-2022-06-26-37-4642-PM.jpeg',
          {
            imageWidth: 200,
            imageHeight: 200,
            paddingX: 10,
            cut: false,
          },
        );
  
        Printer.printText(
          "<C>How're we doing? Let us know at llegaste.tech</C>",
        );
        Printer.printBill("<C>Thank You!</C>\n", {
          beep: false,
        });
        ShowToast('Print successfully completed.');
  
        //wait 2 seconds
        setTimeout(() => {
          goBack()
        }, 2000);
      } catch (error) {
       Alert.alert("Failed",error.message)
      }
    }
  };

  const goBack = () => {
    navigation.navigate('Home')
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
