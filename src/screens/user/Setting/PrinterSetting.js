import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Switch,
  TouchableOpacity,
  Modal,
  TextInput,
  Pressable,
  Alert,
  StatusBar,
} from 'react-native';
import {appStyle, ColorSet, FamilySet} from '../../../styles';
import Button from '../../../components/default/Button';
import Icon from 'react-native-vector-icons/Ionicons';
import {useDispatch} from 'react-redux';
import {StackActions} from '@react-navigation/native';
import {Screens} from '../../../constants';
import {setIsLoading} from '../../../redux/reducers/loadingSlice/LoadingSlice';
import {setUserType} from '../../../redux/reducers/authSlice/AuthServices';
import {setUserData} from '../../../redux/reducers/userSlice/UserServices';
import {
  logoutUser,
  stripeSetting,
  updateStripeSetting,
  checkAdminPin,
} from '../../../networking/authServices/AuthAPIServices';
import {ShowToast} from '../../../utils/ShowToast';
import {removeData} from '../../../utils/Storage';
import {Keys} from '../../../constants';
import SelectDropdown from 'react-native-select-dropdown'

import {
    USBPrinter,
    NetPrinter,
    BLEPrinter,
    BluetoothEscposPrinter,
  } from "react-native-thermal-receipt-printer";

const PrinterSetting = ({navigation}) => {
  const [settings, setSettings] = useState([]);
  const [printers, setPrinters] = useState(["Usb" , "Self", "Ethernet" , "Bluetooth"]);
  const [currentPrinter, setCurrentPrinter] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    BLEPrinter.init().then(()=> {
      BLEPrinter.getDeviceList().then((list) => {
        console.log("list==", list);
        //connect printer
        _connectPrinter(list[0]);
      });
    });
  }, []);

  const _connectPrinter = ((printer) => {
    console.log("printer==", printer);
    //connect printer
    BLEPrinter.connectPrinter(printer.inner_mac_address).then(
      setCurrentPrinter,
      error => console.warn(error))
  })

  useEffect(() => {
    dispatch(setIsLoading(true));
    async function getSetting() {
      const resStripe = await stripeSetting();
      if (resStripe) {
        console.log(resStripe);
        setSettings(resStripe);
        dispatch(setIsLoading(false));
      }
    }
    getSetting();
  }, []);
 

  //logoutHandler
  const logoutHandler = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'No',
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: async () => {
          dispatch(setIsLoading(true));
          const response = await logoutUser();
          console.log('response', response);
          if (response) {
            await removeData(Keys.user);
            dispatch(setUserData(null));
            dispatch(setUserType(null));
            dispatch(setIsLoading(false));
            navigation.dispatch(StackActions.replace('Login'));
          }
        },
      },
    ]);
  };

  //updateSetting
  const updateSetting = async data => {
    dispatch(setIsLoading(true));
    const response = await updateStripeSetting(data);
    if (response.success) {
      dispatch(setIsLoading(false));
    }
  };
  //pinCheck
  const pinCheck = async () => {
    setPinCheckModalVisible(true);
  };
  const handleConfirmPin = async () => {
    if (admin_pin === '') {
      ShowToast('Please enter pin');
      return;
    }
    dispatch(setIsLoading(true));
    const response = await checkAdminPin({
      admin_pin: admin_pin,
    });
    if (response?.success) {
      setPinCheckModalVisible(false);
      setAdminPin('');
      updateSetting(settings);
      dispatch(setIsLoading(false));
    } else {
      dispatch(setIsLoading(false));
      setAdminPin('');
      ShowToast(response.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* mavbar start  */}
      <View style={styles.navbar}>
        <Pressable style={styles.leftIcon} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={20} color="#333" />
        </Pressable>
        <Text style={styles.navTitle}>Printer Setting</Text>
        <Pressable onPress={() => logoutHandler()}>
          <Icon name="log-out-outline" size={20} color="#333" />
        </Pressable>
      </View>
      {/* mavbar end  */}
    {/* body start  */}
    <View style={styles.body}>

      <View style={styles.setting}>
        <Text style={styles.settingLabel}>Enable Printer</Text>
        <Switch
          value={settings?.enable_terminal ? true : false}
          onValueChange={() => {
            setSettings({
              ...settings,
              enable_terminal: !settings?.enable_terminal,
            });
            updateSetting({
              ...settings,
              enable_terminal: !settings?.enable_terminal,
            });
          }}
          trackColor={{true: ColorSet.theme}}
          thumbColor={settings?.enable_terminal ? ColorSet.theme : '#f4f3f4'}
        />
      </View>
      <View>
        <Text style={styles.settingLabel}>Select Printer</Text>
        <SelectDropdown
            data={printers}
            buttonStyle={styles.dropdown}
            buttonTextStyle={styles.dropdownText}
            dropdownStyle={styles.dropdownStyle}
            rowStyle={{ backgroundColor: ColorSet.white, padding: 10,borderBottomColor: ColorSet.bgLight }}
            rowTextStyle={{ color: ColorSet.theme, fontFamily: FamilySet.regular, fontSize: 16 }}
            selectedRowTextStyle={{ color: ColorSet.theme, fontFamily: FamilySet.bold, fontSize: 16 }}
            onSelect={(selectedItem, index) => {
                console.log(selectedItem, index)
            }}
            buttonTextAfterSelection={(selectedItem, index) => {
                // text represented after item is selected
                // if data array is an array of objects then return selectedItem.property to render after item is selected
                return selectedItem
            }}
            rowTextForSelection={(item, index) => {
                // text represented for each item in dropdown
                // if data array is an array of objects then return item.property to represent item in dropdown
                return item
            }}
        />
      </View>


      <View style={styles.logoutContainer}>
        {/* {connectedReader ? (
            <Button title={`Disconnect ${connectedReader?.label || connectedReader?.serialNumber}`} onPress={() => handleDisconnectReader(connectedReader.id)} buttonStyle={{
                textAlign: 'center',
                alignItems: 'center',
                justifyContent: 'center',
            }}/>
        ): (
            <Button title="Connect Terminal" onPress={() => navigation.navigate(Screens.setupTerminal)} buttonStyle={{
                textAlign: 'center',
                alignItems: 'center',
                justifyContent: 'center',
            }}/>
        )} */}
        <Button title="Connect Printer" onPress={() => navigation.navigate(Screens.setupTerminal)} buttonStyle={{
                textAlign: 'center',
                alignItems: 'center',
                justifyContent: 'center',
            }}/>
       
        </View>

    </View>
    {/* body end  */}
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    marginTop: 50,
    padding: 20,
    backgroundColor: ColorSet.white,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    maxHeight: 50,
    borderBottomWidth: 1,
    borderBottomColor: ColorSet.bgLight,
    padding: 15,
    position: 'absolute',
    zIndex: 99,
    backgroundColor: ColorSet.white,
    width: '100%',
  },
  leftIcon: {
    width: 20,
  },
  navTitle: {
    fontSize: 20,
    fontFamily: FamilySet.bold,
    color: ColorSet.textColorDark,
  },
  container: {
    flex: 1
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: ColorSet.textColorDark,
    fontFamily: 'TTCommons-Bold',
  },
  setting: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  settingLabel: {
    fontSize: 18,
    color: ColorSet.textColorDark,
    fontFamily: 'TTCommons-Medium',
  },
  saveButton: {
    marginTop: 30,
  },
  logoutContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: ColorSet.redDeleteColor,
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
  },
  settingLabel: {
    fontSize: 18,
    color: ColorSet.textColorDark,
    fontFamily: FamilySet.medium,
  },
  submitButton: {
    backgroundColor: ColorSet.redDeleteColor,
    alignContent: 'center',
    justifyContent: 'center',
  },
  settingValue: {
    fontSize: 18,
    color: ColorSet.textColorDark,
    fontFamily: FamilySet.medium,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
    color: ColorSet.textColorDark,
    fontFamily: 'TTCommons-Medium',
  },
  tipInput: {
    height: 50,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  modalAction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    backgroundColor: ColorSet.theme,
    borderRadius: 5,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    width: '47%',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: FamilySet.medium,
  },
  cancelButton: {
    backgroundColor: ColorSet.redDeleteColor,
    borderRadius: 5,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    width: '47%',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: FamilySet.medium,
  },
  dropdown:{
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: ColorSet.bgLight,
        borderRadius: 5,
        backgroundColor: '#FFFFFF',
        marginTop: 10,
    },
    dropdownText:{
        fontSize: 18,
        color: ColorSet.textColorDark,
        fontFamily: FamilySet.medium,
    },
    dropdownStyle:{
        borderBottomColor: ColorSet.bgLight,
        backgroundColor: '#FFFFFF',
    },
});

export default PrinterSetting;
