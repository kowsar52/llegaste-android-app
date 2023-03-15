import React, { useState ,useEffect} from 'react';
import { StyleSheet, Text, View, Switch,TouchableOpacity, Modal,TextInput,Pressable,Alert,StatusBar } from 'react-native';
import { appStyle, ColorSet,FamilySet } from '../../styles';
import Button from '../../components/default/Button';
import Icon from 'react-native-vector-icons/Ionicons';
import {useDispatch} from 'react-redux';
import {StackActions} from '@react-navigation/native';
import { Screens } from '../../constants';
import {setIsLoading} from '../../redux/reducers/loadingSlice/LoadingSlice';
import {setUserType} from '../../redux/reducers/authSlice/AuthServices';
import {setUserData} from '../../redux/reducers/userSlice/UserServices';
import {logoutUser, stripeSetting,updateStripeSetting,checkAdminPin } from '../../networking/authServices/AuthAPIServices';
import { ShowToast } from '../../utils/ShowToast';
import {removeData} from '../../utils/Storage';
import {Keys} from '../../constants';

const Setting = ({navigation}) => {
  const [settings, setSettings] = useState([]);
  const [pinCheckModalVisible, setPinCheckModalVisible] = useState(false);
  const [admin_pin, setAdminPin] = useState('');
 

  useEffect(() => {
    dispatch(setIsLoading(true));
    async function getSetting(){
      const resStripe = await stripeSetting();
      if (resStripe) {
        console.log(resStripe)
        setSettings(resStripe);
        dispatch(setIsLoading(false));
      } 
    }
    getSetting();

  }, []);

  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);
  const [isDarkModeEnabled, setIsDarkModeEnabled] = useState(false);
  const [tipPercentage, setTipPercentage] = useState(15);
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();
  const handleTipChange = (text) => {
    const percentage = parseFloat(text);
    if (!isNaN(percentage)) {
      setTipPercentage(percentage);
    }
  };

  const handleSaveTip = () => {
    // Save the tip percentage to your app's settings
    setModalVisible(false);
  };


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

  //updateSetting
  const updateSetting = async (data) => {
    dispatch(setIsLoading(true));
    const response = await updateStripeSetting(data);
    if (response.success) {
      dispatch(setIsLoading(false));
    } 
  }
  //pinCheck
  const pinCheck = async () => {
    setPinCheckModalVisible(true);
  }
  const handleConfirmPin = async () => {
    if (admin_pin === '') {
      ShowToast('Please enter pin');
      return;
    }
    dispatch(setIsLoading(true));
    const response = await checkAdminPin({
      admin_pin: admin_pin
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
  }


  return (
    <View style={styles.container}>
          {/* mavbar start  */}
          <View style={styles.navbar}>
        <Pressable style={styles.leftIcon} onPress={() => navigation.goBack()}> 
          <Icon name="arrow-back" size={20} color="#333" />
        </Pressable>
        <Text style={styles.navTitle}>Settings</Text>
        <Pressable onPress={() => logoutHandler()}>
        <Icon name="log-out-outline" size={20} color="#333" />
        </Pressable>
      </View>
      {/* mavbar end  */}

      <View style={styles.setting}>
        <Text style={styles.settingLabel}>Enable Terminal</Text>
        <Switch
          value={settings?.enable_terminal ? true :  false}
          onValueChange={() => {
            setSettings({...settings, enable_terminal: !settings?.enable_terminal})
            updateSetting({...settings, enable_terminal: !settings?.enable_terminal});
          }}
          trackColor={{ true: ColorSet.theme }}
          thumbColor={settings?.enable_terminal ? ColorSet.theme : '#f4f3f4'}
        />
      </View>

      <View style={styles.setting}>
        <Text style={styles.settingLabel}>Enable Manual Checkout</Text>
        <Switch
          value={settings?.enable_manual_checkout ? true :  false}
          onValueChange={() => {
            setSettings({...settings, enable_manual_checkout: !settings?.enable_manual_checkout})
            pinCheck({...settings, enable_manual_checkout: !settings?.enable_manual_checkout});
          }}
          trackColor={{ true: ColorSet.theme }}
          thumbColor={settings?.enable_manual_checkout ? ColorSet.theme : '#f4f3f4'}
        />
      </View>
      <View style={styles.setting}>
        <Text style={styles.settingLabel}>Enable Tips</Text>
        <Switch
          value={settings?.enable_tips ? true :  false}
          onValueChange={() => {
            setSettings({...settings, enable_tips: !settings?.enable_tips})
            updateSetting({...settings, enable_tips: !settings?.enable_tips});
          }}
          trackColor={{ true: ColorSet.theme }}
          thumbColor={settings?.enable_tips ? ColorSet.theme : '#f4f3f4'}
        />
      </View>
      <TouchableOpacity style={settings?.enable_tips ? styles.settingItem : {display: "none"}} onPress={() => setModalVisible(true)}>
        <Text style={styles.settingLabel}>Tipping Percentage 1</Text>
        <Text style={styles.settingValue}>{settings?.tips_percentage_1}%</Text>
      </TouchableOpacity>
      <TouchableOpacity style={settings?.enable_tips ? styles.settingItem : {display: "none"}} onPress={() => setModalVisible(true)}>
        <Text style={styles.settingLabel}>Tipping Percentage 2</Text>
        <Text style={styles.settingValue}>{settings?.tips_percentage_2}%</Text>
      </TouchableOpacity>
      <TouchableOpacity style={settings?.enable_tips ? styles.settingItem : {display: "none"}} onPress={() => setModalVisible(true)}>
        <Text style={styles.settingLabel}>Tipping Percentage 3</Text>
        <Text style={styles.settingValue}>{settings?.tips_percentage_3}%</Text>
      </TouchableOpacity>




      <TouchableOpacity style={styles.settingItem} onPress={() => setModalVisible(true)}>
        <Text style={styles.settingLabel}>Default charge description</Text>
        <Text style={styles.settingValue}>{settings?.descriptor}</Text>
      </TouchableOpacity>


      <TouchableOpacity style={styles.settingItem} onPress={() => setModalVisible(true)}>
        <Text style={styles.settingLabel}>Tax rate</Text>
        <Text style={styles.settingValue}>{settings?.tax_percentage}%</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.settingItem} onPress={() => setModalVisible(true)}>
        <Text style={styles.settingLabel}>Service fee</Text>
        <Text style={styles.settingValue}>{settings?.service_fee_percentage}%</Text>
      </TouchableOpacity>
     
      <TouchableOpacity style={styles.settingItem} onPress={() => setModalVisible(true)}>
        <Text style={styles.settingLabel}>Currency</Text>
        <Text style={styles.settingValue}>{settings?.currency}</Text>
      </TouchableOpacity>

      {/* tipping percetage modal start */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Tipping Percentage</Text>
            <TextInput
              style={styles.tipInput}
              placeholder="Enter a percentage"
              keyboardType="numeric"
              onChangeText={handleTipChange}
              value={String(tipPercentage)}
            />
           <View style={styles.modalAction}>
           <TouchableOpacity style={styles.saveButton} onPress={handleSaveTip}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
           </View>
          </View>
        </View>
      </Modal>
      {/* tipping percetage modal end */}
      <Modal animationType="fade" transparent={true} visible={pinCheckModalVisible} statusBarTranslucent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Pin</Text>
            <TextInput
              style={styles.tipInput}
              placeholder="Enter pin"
              onChangeText={ (text) => setAdminPin(text)}
              value={admin_pin}
            />
           <View style={styles.modalAction}>
           <TouchableOpacity style={styles.saveButton} onPress={ handleConfirmPin}>
              <Text style={styles.saveButtonText}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setPinCheckModalVisible(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
           </View>
          </View>
        </View>
      </Modal>
 

     

      <View style={styles.logoutContainer}>
      <Button title="Change admin pin" onPress={() => console.log('Settings saved')} buttonStyle={styles.submitButton} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar:{
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    maxHeight: 50,
      
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
    flex: 1,
    padding: 20,
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
    marginBottom: 30,
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
  submitButton:{
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

export default Setting;
