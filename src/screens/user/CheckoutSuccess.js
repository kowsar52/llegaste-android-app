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
      printReceipt()
    }else{
      setTimeout(() => {
        navigation.navigate("Home")
      },30000)
    }
  };

  useEffect(() => {
    getCurrentPrinter();
  }, []);

  const printReceipt = () => {

      try {
        dispatch(setIsLoading(true));
        const Printer = BLEPrinter;
        Printer.init().then(() => {
          //list printers
          Printer.getDeviceList().then(printers => {
            console.log('kitchen Printers', printers);
            if (printers.length > 0) {
              Printer.connectPrinter(printers[1].inner_mac_address).then( () => {
                const BOLD_ON = COMMANDS.TEXT_FORMAT.TXT_BOLD_ON;
                const BOLD_OFF = COMMANDS.TEXT_FORMAT.TXT_BOLD_OFF;
                const CENTER = COMMANDS.TEXT_FORMAT.TXT_ALIGN_CT;
                const OFF_CENTER = COMMANDS.TEXT_FORMAT.TXT_ALIGN_LT;
          
                
                  let textTemplate = `<C> LLegaste H,DD </C>\n`;
                  textTemplate += `<C> New York, USA </C>\n`;
                  textTemplate += `<C> +34434534543 </C>\n`;
                  textTemplate += `Date : ${new Date().toLocaleDateString()} | ${new Date().toLocaleTimeString()}\n`;
                  textTemplate += `Trx ID - #${txn_id}\n`;
                  textTemplate += `Payment Status - PAID\n`;
                  textTemplate += `${CENTER}${COMMANDS.HORIZONTAL_LINE.HR2_58MM}${CENTER}`;
                  Printer.printText(textTemplate, {
                    beep: false,
                    cut: false,
                  });
          
              Printer.printBill(`Total Amount $${parseFloat(total_amount).toFixed(2)}`,{
                cut : false
              })
           
                Printer.printBill(
                  "<C>How're we doing? Let us know at llegaste.tech</C>",
                  {
                    cut: false
                  }
                );
                Printer.printBill("<C>Thank You!</C>\n", {
                  beep: false,
                });
                ShowToast('Print successfully completed.');
                
                //wait 2 seconds
                setTimeout(() => {
                  dispatch(setIsLoading(false));
                  goBack()
                }, 2000);   
              });
            }
          });
        });
      } catch (error) {
       Alert.alert("Failed",error.message)
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
          Your Payment Id: #{txn_id}
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
