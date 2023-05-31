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
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import React, { useEffect, useState,useCallback } from 'react'
import { getData } from '../../utils/Storage'
import { ColorSet } from '../../styles';
import { FamilySet } from '../../styles';
import Button from '../../components/default/Button';
import Icon from 'react-native-vector-icons/Ionicons';
import {useDispatch} from 'react-redux';
import {StackActions} from '@react-navigation/native';
import { setIsLoading } from '../../redux/reducers/loadingSlice/LoadingSlice';
import { Keys, Screens } from '../../constants';
import {
  useStripeTerminal,
} from '@stripe/stripe-terminal-react-native';
import { ShowToast } from '../../utils/ShowToast';
import List from '../../components/default/List';
import ListItem from '../../components/default/ListItem';
import NavBar from '../../components/default/NavBar';
import { stripeSetting } from '../../networking/authServices/AuthAPIServices';

export default function SetupTerminal({navigation}) {
  const [discoveringLoading, setDiscoveringLoading] = useState(true);
  const [connectingReader, setConnectingReader] = useState();
  const [connectedKiosk, setConnectedKiosk] = useState('');
  const [cconnectedTerminal, setConnectedReader] = useState(null);
  const {initialize: initStripe} = useStripeTerminal();
  const dispatch = useDispatch();
  const [terminal_setting, setTerminalSetting] = useState();


  useEffect(() => {
    async function getUser(){
      try {
      const resStripe = await stripeSetting();
      if(resStripe){
        setTerminalSetting(resStripe);
        simulateReaderUpdate('none');
        handleDiscoverReaders(resStripe);
      }
      } catch (error) {
        console.log('error2',error)
      }
    }

    if(connectedReader){
      navigation.navigate(Screens.home);
    }else{
      // disconnectReader();
      getUser();
    }

  }, [handleDiscoverReaders, simulateReaderUpdate]);

  
  //disconvering
  const {
    cancelDiscovering,
    discoverReaders,
    connectBluetoothReader,
    discoveredReaders,
    connectInternetReader,
    simulateReaderUpdate,
    connectedReader
  } = useStripeTerminal({
    onFinishDiscoveringReaders: (error, discoveredReaders) => {
      setDiscoveringLoading(false);
      if (error) {
        ShowToast('Error', error.message);
        return;
      }
      // if (discoveredReaders.length === 0) {
      //   ShowToast('No readers found', 'Please make sure your reader is powered on and in range');
      //   return;
      // }
      // if (discoveredReaders.length === 1) {
      //   // connectReader(discoveredReaders[0]);
      //   console.log('discoveredReaders',discoveredReaders)
      //   return;
      // }
    }
  });

  useEffect(() => {
    if(discoveredReaders.length > 0){
          console.log('discoveredReaders[0]', discoveredReaders[0]);
          handleConnectReader(discoveredReaders[0]);
        }
        ShowToast('Reader discovered successfully!');
  }, [discoveredReaders]);

  const handleGoBack = useCallback(
    async action => {
      await cancelDiscovering();
      if (navigation.canGoBack()) {
        navigation.dispatch(action);
      }
    },
    [cancelDiscovering, navigation],
  );

  useEffect(() => {
    navigation.setOptions({
      headerBackTitle: 'Cancel',
    });

    navigation.addListener('beforeRemove', e => {
      if (!discoveringLoading) {
        return;
      }
      e.preventDefault();
      // handleGoBack(e.data.action);
    });
  }, [navigation, cancelDiscovering, discoveringLoading, handleGoBack]);

  const handleDiscoverReaders = useCallback(async (terminal_setting) => {
    //disconnect old reader
   

    setDiscoveringLoading(true);
    // List of discovered readers will be available within useStripeTerminal hook
    console.log('connectedterminal_setting 22',terminal_setting)
   
    let device_type = terminal_setting.device_type;

    let isSimulated = false;
    if (terminal_setting.mode == 'sandbox') {
      isSimulated = true;
    }
    console.log('simulated', isSimulated);
    console.log(device_type);
    const {error: discoverReadersError} = await discoverReaders({
      discoveryMethod: device_type,
      simulated: isSimulated,
      locationId: terminal_setting.terminal_location_id,
    });

    if (discoverReadersError) {
      const {code, message} = discoverReadersError;

      ShowToast(message);
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    }
  }, [navigation, discoverReaders]);

  const isBTReader = reader =>
    ['stripeM2', 'chipper2X', 'chipper1X', 'wisePad3'].includes(
      reader.deviceType,
    );

  const getReaderDisplayName = reader => {
    if (reader?.simulated) {
      return `SimulatorID - ${reader.deviceType}`;
    }
    return `${reader?.label || reader?.serialNumber} - ${reader.deviceType}`;
  };

  //connect reader
  const handleConnectReader = async reader => {
    let error = undefined;
    let device_type = terminal_setting.device_type;
    if (device_type === 'internet') {
      const result = await handleConnectInternetReader(reader);
      error = result.error;
    } else if (device_type === 'bluetoothScan') {
      const result = await handleConnectBluetoothReader(reader);
      error = result.error;
    }
    if (error) {
      setConnectingReader(undefined);
      Alert.alert(error.code, error.message);
    }
  };

  const handleConnectBluetoothReader = async reader => {
    setConnectingReader(reader);

    const {reader: connectedReader, error} = await connectBluetoothReader({
      reader,
      locationId: terminal_setting?.location_id,
    });

    if (error) {
      console.log('connectBluetoothReader error:', error);
    } else {
     ShowToast('Reader connected successfully');
    }
    return {error};
  };

  const handleConnectInternetReader = async reader => {
    setConnectingReader(reader);

    const {reader: connectedReader, error} = await connectInternetReader({
      reader,
    });

    if (error) {
      console.log('connectInternetReader error:', error);
    } else {
      setConnectedReader(connectedReader);
      ShowToast('Reader connected successfully');
      navigation.navigate('Home')
    }
    return {error};
  };





    return (
      <View style={styles.container}>
        {/* mavbar start  */}
        <NavBar title="Discovery Readers" navigation={navigation} logoutBtn={true}/>
        {/* mavbar end  */}
      {/* body start  */}
      <View style={styles.body}>
  
        <ScrollView
        testID="discovery-readers-screen">
      
        <List
          title={`Select Terminal`}
          loading={discoveringLoading}
          description={connectingReader ? 'Connecting...' : undefined}>
          {discoveredReaders.map(reader => (
            <ListItem
              key={reader.serialNumber}
              onPress={() => handleConnectReader(reader)}
              title={getReaderDisplayName(reader)}
              disabled={!isBTReader(reader) && reader.status === 'offline'}
            />
          ))}
        </List>
{/* 
        <Text style={appStyle.label}>Enable Tips</Text>
          <Input placeholder="Tips percentage %"/> */}

      </ScrollView>
  
  
      </View>
      {/* body end  */}
      </View>
    );
  }



const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: ColorSet.white,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    maxHeight: 80,
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
    fontSize: 22,
    fontFamily: FamilySet.bold,
    color: ColorSet.textColorDark,
  },
  container: {
    flex: 1
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
  settingValue: {
    fontSize: 18,
    color: ColorSet.textColorDark,
    fontFamily: FamilySet.medium,
  },
  container: {
    backgroundColor: '#F5F5F5',
    height: '100%',
    position: 'relative',
  },
  pickerContainer: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#fff',
    left: 0,
    width: '100%',
    ...Platform.select({
      ios: {
        height: 200,
      },
    }),
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  discoveredWrapper: {
    height: 50,
  },
  buttonWrapper: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 22,
    width: '100%',
  },
  locationListTitle: {
    fontWeight: '700',
  },
  picker: {
    width: '100%',
  },
  pickerItem: {
    fontSize: 16,
  },
  text: {
    paddingHorizontal: 12,
    color: '#fff',
  },
  info: {
    fontWeight: '700',
    marginVertical: 10,
  },
  serialNumber: {
    maxWidth: '70%',
  },
  cancelButton: {
    color: '#fff',
    marginLeft: 22,
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  infoText: {
    paddingHorizontal: 16,
    color: '#000',
    marginVertical: 16,
  },
});
