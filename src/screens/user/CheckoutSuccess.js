import {View, Text, StatusBar, Alert, PanResponder} from 'react-native';
import React, {useEffect,useRef,useState} from 'react';
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
import CustomAlert from '../../components/default/CustomAlert';


export default function SuccessScreen({route, navigation}) {

   const dispatch = useDispatch();
  const [enable_auto_print, setEnableAutoPrint] = React.useState(0);
  const {txn_id , total_amount, sub_total_amount, tax, service_fee} = route.params

  const getCurrentPrinter = async () => {
   
    //enable_auto_print
    const enable_auto_print = await getData('enable_auto_print');
    if (enable_auto_print) {
      setEnableAutoPrint(enable_auto_print);
      printReceipt()
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
                  textTemplate += `<C> +34434534543 </C>\n\n`;
                  Printer.printText(textTemplate, {
                    beep: false,
                    cut: false,
                  });
                  let columnAlignment = [
                    ColumnAlignment.RIGHT,
                    ColumnAlignment.RIGHT,
                  ];
                  let columnWidth = [30 -  8,  8];
                
                  Printer.printText("<C>AMOUNT TO CHARGE</C>", {
                    beep: false,
                    cut: false,
                  });
                  Printer.printColumnsText(
                    ['Subtotal',  `$${parseFloat(sub_total_amount).toFixed(2)}`],
                    columnWidth,
                    columnAlignment,
                    [`${BOLD_OFF}`, '',''],
                  );
                  Printer.printColumnsText(
                    ['TAX', '$'+tax],
                    columnWidth,
                    columnAlignment,
                    [`${BOLD_OFF}`, '',''],
                  );
                  Printer.printColumnsText(
                    ['Service Fee', '$'+service_fee],
                    columnWidth,
                    columnAlignment,
                    [`${BOLD_OFF}`, '',''],
                  );
                  Printer.printColumnsText(
                    ['Total',  `$${parseFloat(total_amount).toFixed(2)}`],
                    columnWidth,
                    columnAlignment,
                    [`${BOLD_OFF}`, '',''],
                  );

                  let footerText = `${CENTER}${COMMANDS.HORIZONTAL_LINE.HR2_58MM}${CENTER}\n`;
                   footerText += `CARD TYPE: VISA\n`;
                   footerText += `LAST 4 DIGIT: 4242\n`;
                   footerText += `TRAN - #${txn_id}\n`;
                   footerText += `DATE : ${new Date().toLocaleDateString()}\n`;
                   footerText += `TIME : ${new Date().toLocaleTimeString()}\n`;
                   footerText += `${CENTER}${COMMANDS.HORIZONTAL_LINE.HR2_58MM}${CENTER}`;
                  Printer.printText(footerText, {
                    beep: false,
                    cut: false,
                  });
           
                Printer.printBill(
                  "<C>How're we doing? Let us know at llegaste.tech</C>\n<C>Thank You!</C>\n",
                  {
                    beep: false
                  }
                );
              
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

  // idle screen part start
const timerId = useRef(false);
const timerId2 = useRef(false);
const [timeForInactivityInSecond, setTimeForInactivityInSecond] = useState(15);
const [timeForAutoInactivityInSecond, setTimeForAutoInactivityInSecond] = useState(10);
const [visible, setVisible] = useState(false);
const buttons = [
  {
    text: 'Yes',
    onPress: () => {
      clearTimeout(timerId.current);
      clearTimeout(timerId2.current);
    },
  },
  {
    text: 'No',
    onPress: () => {
      clearTimeout(timerId.current);
      clearTimeout(timerId2.current);
      navigation.push('Home');
    },
  },
];

useEffect(() => {
  const getOldData = async () => {
    const res = await getData("enableScreensaver")
    if(res){
      resetInactivityTimeout();
    }
  }

  getOldData()  
  
}, []);

const panResponder = React.useRef(
  PanResponder.create({
    onStartShouldSetPanResponderCapture: () => {
      resetInactivityTimeout();
      resetAutoInactivityTimeout();
    },
  }),
).current;

const resetInactivityTimeout = () => {
 console.log('timerId.current',timerId.current)
  clearTimeout(timerId.current);
  timerId.current = setTimeout(() => {
    setVisible(true);
    resetAutoInactivityTimeout();
  }, timeForInactivityInSecond * 1000);

  return () => {
    clearTimeout(timerId.current);
  };
};

const resetAutoInactivityTimeout = () => {
  clearTimeout(timerId2.current);
  clearTimeout(timerId.current);
  timerId2.current = setTimeout(() => {
      goBack();
  }, timeForAutoInactivityInSecond * 1000);

  return () => {
    clearTimeout(timerId.current);
    clearTimeout(timerId2.current);
  };
};

  const goBack = () => {
    setVisible(false);
    //clear timerID
    clearTimeout(timerId.current);
    clearTimeout(timerId2.current);
    navigation.push('Home');

  }

// idle screen part end
  return (
    <SafeAreaView style={appStyle.container_center} {...panResponder.panHandlers}>
       <CustomAlert
            visible={visible}
            setVisible={setVisible}
            title="Do you need more time?"
            message="Press yes to continue order or press no to cancel."
            buttons={buttons}
          />
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
        <Button title="Back to Home" onPress={() => goBack()} buttonStyle={{
          marginTop: 10,
          backgroundColor: ColorSet.textColorRed,
        }}/>
      </View>
    </SafeAreaView>
  );

}
