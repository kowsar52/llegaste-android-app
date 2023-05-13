import {
  useStripeTerminal,
  Location,
  Reader,
} from '@stripe/stripe-terminal-react-native';
import React, {useEffect, useContext, useState, useCallback} from 'react';
import {StackActions} from '@react-navigation/native';
import {
  StyleSheet,
  Text,
  ScrollView,
  Alert,
  Modal,
  View,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import ListItem from '../../components/default/ListItem';
import List from '../../components/default/List';
import {Picker} from '@react-native-picker/picker';
import Button from '../../components/default/Button';
import {useSelector, useDispatch} from 'react-redux';
import { getUserData, removeData } from '../../utils/Storage';
import { logoutUser,stripeSetting } from '../../networking/authServices/AuthAPIServices';
import {setUserData} from '../../redux/reducers/userSlice/UserServices';
import { Keys,Screens } from '../../constants';
import { ShowToast } from '../../utils/ShowToast';
import { ColorSet } from '../../styles';
import { setIsLoading } from '../../redux/reducers/loadingSlice/LoadingSlice';
import NavBar from '../../components/default/NavBar';

const SIMULATED_UPDATE_PLANS = [
  'random',
  'available',
  'none',
  'required',
  'lowBattery',
];

export default function SetupTerminal({route, navigation}) {
  const [discoveringLoading, setDiscoveringLoading] = useState(true);
  const [connectingReader, setConnectingReader] = useState();
  const [showPicker, setShowPicker] = useState(false);
  const [selectedUpdatePlan, setSelectedUpdatePlan] = useState('none');

  const [discoveryMethod, setDiscoveryMethod] = useState('bluetoothScan');
  const [simulated, setSimulated] = useState(false);

  const [selectedLocation, setSelectedLocation] = useState();

  const dispatch = useDispatch();
  const [terminal_setting, setTerminalSetting] = useState();

  useEffect(() => {
    async function getUser(){
      const resStripe = await stripeSetting();
      if(resStripe){
        setTerminalSetting(resStripe);
        simulateReaderUpdate('none');
        handleDiscoverReaders(resStripe);
      }
    }

    if(connectedReader){
      navigation.navigate(Screens.home);
    }else{
      // disconnectReader();
      getUser();
    }

  }, [setTerminalSetting,simulateReaderUpdate,handleDiscoverReaders,connectedReader,disconnectReader]);



  const {
    cancelDiscovering,
    discoverReaders,
    connectBluetoothReader,
    discoveredReaders,
    connectInternetReader,
    connectedReader,
    disconnectReader,
    simulateReaderUpdate,
  } = useStripeTerminal({
    onFinishDiscoveringReaders: finishError => {
      if (finishError) {
        ShowToast(`${finishError.code}, ${finishError.message}`)
      } else {
        ShowToast('Reader discovered successfully');
      }
      setDiscoveringLoading(false);
    }
  });



  const handleDiscoverReaders = useCallback(async (resStripe) => {
   let terminal_setting = resStripe;
   console.log(terminal_setting)
    setDiscoveringLoading(true);
    // List of discovered readers will be available within useStripeTerminal hook
    let device_type = terminal_setting.device_type;

    let isSimulated = false;
    if (terminal_setting.mode == 'sandbox') {
      isSimulated = true;
    }
   
    const {error: discoverReadersError} = await discoverReaders({
      discoveryMethod: device_type,
      simulated: isSimulated,
      locationId: terminal_setting.location_id,
    });

    if (discoverReadersError) {
      const {code, message} = discoverReadersError;
      ShowToast(`${message}`);
    }
  }, [navigation, terminal_setting]);



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
      navigation.navigate(Screens.home);
      console.log('Reader connected successfully', connectedReader);
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
      navigation.navigate(Screens.home);
      console.log('Reader connected successfully', connectedReader);
    }
    return {error};
  };



  return (
    <ScrollView
      className="relative"
      testID="discovery-readers-screen"
      contentContainerStyle={styles.container}>
      <NavBar title="Discovery Readers" navigation={navigation} logoutBtn={true}/>
      <List
        title="NEARBY READERS"
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



 
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
  bottomButton:{
    position: 'absolute',
    bottom: 20,
    width: '96%',
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: ColorSet.canclerRedButton,
  },

});

function mapToPlanDisplayName(plan) {
  switch (plan) {
    case 'random':
      return 'Random';
    case 'available':
      return 'Update Available';
    case 'none':
      return 'No Update';
    case 'required':
      return 'Update required';
    case 'lowBattery':
      return 'Update required; reader has low battery';
    default:
      return '';
  }
}
