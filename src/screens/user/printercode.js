import { View, Text,TouchableOpacity} from 'react-native'
import React,{useState,useEffect} from 'react'
import {Platform} from 'react-native';
import {
  USBPrinter,
  NetPrinter,
  BLEPrinter,
} from "react-native-thermal-receipt-printer";

export default function App() {
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
  printTextTest = () => {
    console.log("printTextTest",currentPrinter);
    if(currentPrinter){
      
     BLEPrinter.printText("<C>sample text</C>\n");
     console.log("printTextTest done",currentPrinter);
    }
  }

  printBillTest = () => {
    console.log("bill clcik",currentPrinter);
    currentPrinter && BLEPrinter.printBill("<C>sample bill</C>\n");
  }

  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
    {
      printers.map((printer, index) => (
        <TouchableOpacity key={index} onPress={() => _connectPrinter(printer)} style={{
          marginTop: 10,
          marginBottom: 10,
          padding: 10,
          backgroundColor: 'green',
          borderRadius: 5,
        }}>
          <Text style={{
            color: 'white',
            textAlign: 'center',
            fontSize: 20,
          }}>
          {`Device: ${printer.device_name}`}
          </Text>
        </TouchableOpacity>
        ))
    }
    <TouchableOpacity onPress={printTextTest} style={{
      marginTop: 10,
      marginBottom: 10,
      padding: 10,
      backgroundColor: 'blue',
      borderRadius: 5,
    }}>
      <Text style={{
        color: 'white',
        textAlign: 'center',
        fontSize: 20,
      }}>Print Text</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={printBillTest} style={{
      marginTop: 10,
      marginBottom: 10,
      padding: 10,
      backgroundColor: 'green',
      borderRadius: 5,
    }}>
      <Text style={{
        color: 'white',
        textAlign: 'center',
        fontSize: 20,
      }}>Print Bill Text</Text>
    </TouchableOpacity>
  </View>
  )
}