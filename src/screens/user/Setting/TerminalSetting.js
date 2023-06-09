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
  ScrollView,
} from 'react-native';
import {appStyle, ColorSet, FamilySet} from '../../../styles';
import Button from '../../../components/default/Button';
import Input from '../../../components/default/Input';
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
import {getData, removeData, storeData} from '../../../utils/Storage';
import {Keys} from '../../../constants';
import { useStripeTerminal} from '@stripe/stripe-terminal-react-native';
import NavBar from '../../../components/default/NavBar';
import { TextInputMask } from 'react-native-masked-text';
import PercentageInput from '../../../components/default/PercentageInput';

const TerminalSetting = ({navigation}) => {
  const [settings, setSettings] = useState([]);
  const [pinCheckModalVisible, setPinCheckModalVisible] = useState(false);
  const [enableScreensaver, setEnableScreensaver] = useState(false);
  const [admin_pin, setAdminPin] = useState('');
  const { connectedReader,disconnectReader } = useStripeTerminal();
  const [isEnabledManualCheckout, setIsEnabledManualCheckout] = useState(false);

  useEffect(() => {
    dispatch(setIsLoading(true));
    async function getSetting() {
      const resStripe = await stripeSetting();
      if (resStripe) {
        setSettings(resStripe);
        const res = await getData("enableScreensaver")
        if(res){
          setEnableScreensaver(res)
        }
        dispatch(setIsLoading(false));
      }
    }
    getSetting();
  }, [connectedReader]);

  //disconnectReader
  async function handleDisconnectReader(readerId) {
    try {
        dispatch(setIsLoading(true));
      await disconnectReader(readerId);
      ShowToast(`Disconnected reader with ID ${readerId}`);
        dispatch(setIsLoading(false));
    } catch (error) {
        ShowToast(`Error disconnecting reader: ${error.message}`);
        dispatch(setIsLoading(true));
    }
  }
  

  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);
  const [isDarkModeEnabled, setIsDarkModeEnabled] = useState(false);
  const [tipPercentage, setTipPercentage] = useState(15);
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();
  const handleTipChange = text => {
    const percentage = parseFloat(text);
    if (!isNaN(percentage)) {
      setTipPercentage(percentage);
    }
  };

  const handleSaveTip = () => {
    // Save the tip percentage to your app's settings
    setModalVisible(false);
  };


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
      if(settings?.enable_manual_checkout == true){
        storeData('isEnabledManualCheckout', true)
        setIsEnabledManualCheckout(true);
      }else{
        storeData('isEnabledManualCheckout', false)
        setIsEnabledManualCheckout(false);
      }
     
      dispatch(setIsLoading(false));
    } else {
      dispatch(setIsLoading(false));
      setAdminPin('');
      ShowToast(response.message);
    }
  };


  if(settings.length === 0){
    return null
  }else{
    return (
      <View style={styles.container}>
        <NavBar navigation={navigation} title="Terminal Setting" logoutBtn={true}/>
      {/* body start  */}
      <ScrollView style={styles.body}>
  
        <View style={styles.setting}>
          <Text style={styles.settingLabel}>Enable Screensaver</Text>
          <Switch
            value={enableScreensaver ? true : false}
            onValueChange={(value) => {
              setEnableScreensaver(value)
              storeData('enableScreensaver', value)
            }}
            trackColor={{true: ColorSet.theme}}
            thumbColor={enableScreensaver ? ColorSet.theme : '#f4f3f4'}
          />
        </View>
        <View style={styles.setting}>
          <Text style={styles.settingLabel}>Enable Terminal</Text>
          <Switch
            value={settings?.enable_terminal ? true : false}
            onValueChange={() => {
              setSettings({
                ...settings,
                enable_terminal: !settings?.enable_terminal,
              });
            }}
            trackColor={{true: ColorSet.theme}}
            thumbColor={settings?.enable_terminal ? ColorSet.theme : '#f4f3f4'}
          />
        </View>
  
        <View style={styles.setting}>
          <Text style={styles.settingLabel}>Enable Manual Checkout</Text>
          <Switch
            value={settings?.enable_manual_checkout ? true : false}
            onValueChange={() => {
              setSettings({
                ...settings,
                enable_manual_checkout: !settings?.enable_manual_checkout,
              });
            }}
            trackColor={{true: ColorSet.theme}}
            thumbColor={
              settings?.enable_manual_checkout ? ColorSet.theme : '#f4f3f4'
            }
          />
        </View>
        <View style={styles.setting}>
          <Text style={styles.settingLabel}>Enable Tips</Text>
          <Switch
            value={settings?.enable_tips ? true : false}
            onValueChange={() => {
              setSettings({...settings, enable_tips: !settings?.enable_tips});
            }}
            trackColor={{true: ColorSet.theme}}
            thumbColor={settings?.enable_tips ? ColorSet.theme : '#f4f3f4'}
          />
        </View>
        <View
          style={settings?.enable_tips ? styles.settingItem : {display: 'none'}}
        >
          <Text style={styles.settingLabel}>Tips Percentage 1</Text>
          <PercentageInput value={settings?.tips_percentage_1} postfix={true} onChangeText={(text) => {
            setSettings({...settings, tips_percentage_1: text});
          }}/>
        </View>
        <View
          style={settings?.enable_tips ? styles.settingItem : {display: 'none'}}
        >
          <Text style={styles.settingLabel}>Tips Percentage 2</Text>
          <PercentageInput value={settings?.tips_percentage_2} postfix={true} onChangeText={(text) => {
            setSettings({...settings, tips_percentage_2: text});
          }}/>
        </View>
        <View
          style={settings?.enable_tips ? styles.settingItem : {display: 'none'}}
        >
          <Text style={styles.settingLabel}>Tips Percentage 3</Text>
          <PercentageInput value={settings?.tips_percentage_3} postfix={true} onChangeText={(text) => {
            setSettings({...settings, tips_percentage_3: text});
          }}/>
        </View>
        
        <View >
          <Text style={[styles.settingLabel, appStyle.mb10]}>Default charge description</Text>
          <Input  keyboardType='default' value={settings?.descriptor}
          onChangeText={text => {
            setSettings({...settings, descriptor: text});
          }} style={styles.settingValue} placeholder="Enter description"
           />
        </View>
  
  
        <View style={styles.settingItem} >
          <Text style={styles.settingLabel}>Tax Percentage </Text>
          <PercentageInput value={settings?.tax_percentage} postfix={true} onChangeText={(text) => {
            setSettings({...settings, tax_percentage: text});
          }}/>
        </View>
        <View style={styles.settingItem} >
          <Text style={styles.settingLabel}>Service fee</Text>
          <PercentageInput value={settings?.service_fee_percentage} postfix={true} onChangeText={(text) => {
            setSettings({...settings, service_fee_percentage: text});
          }}/>
        </View>
        <View style={styles.settingItem} >
          <Text style={styles.settingLabel}>Currency</Text>
          <PercentageInput value={settings?.currency} keyboardType='default' onChangeText={(text) => {
            setSettings({...settings, currency: text});
          }}/>
        </View>
          
        <View style={{
          marginBottom: 30,
        }}>
          <Button title="Save" onPress={() => pinCheck()} buttonStyle={{
                  textAlign: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
              }}/>
        </View>
  
        <Modal
          animationType="fade"
          transparent={true}
          visible={pinCheckModalVisible}
          statusBarTranslucent={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Enter Pin</Text>
              <TextInput
                keyboardType='numeric'
                style={styles.tipInput}
                placeholder="Enter pin"
                onChangeText={text => setAdminPin(text)}
                value={admin_pin}
              />
              <View style={styles.modalAction}>
              <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setPinCheckModalVisible(false)}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleConfirmPin}>
                  <Text style={styles.saveButtonText}>Confirm</Text>
                </TouchableOpacity>
       
              </View>
            </View>
          </View>
        </Modal>
  
        {/* <View style={styles.logoutContainer}>
          {connectedReader ? (
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
          )}
         
          </View> */}
  
      </ScrollView>
      {/* body end  */}
      </View>
    );
  }
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
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
});

export default TerminalSetting;
