import { StatusBar,StyleSheet,Platform, LogBox } from 'react-native'
import React,{useState,useEffect,useCallback} from 'react'
import AppNavigator from './src/navigation/AppNavigator'
import Loader from './src/components/default/Loader'
import { SafeAreaProvider } from 'react-native-safe-area-context'
LogBox.ignoreLogs([
    'Overwriting fontFamily style attribute preprocessor',
    // https://reactnavigation.org/docs/5.x/troubleshooting#i-get-the-warning-non-serializable-values-were-found-in-the-navigation-state
    'Non-serializable values were found in the navigation state',
    // https://github.com/software-mansion/react-native-gesture-handler/issues/722
    'RCTBridge required dispatch_sync to load RNGestureHandlerModule. This may lead to deadlocks',
    // https://github.com/react-native-netinfo/react-native-netinfo/issues/486
    'new NativeEventEmitter()` was called with a non-null argument without the required `removeListeners` method.',
    'new NativeEventEmitter()` was called with a non-null argument without the required `addListener` method.',
  ]);
import {
    useStripeTerminal,
    requestNeededAndroidPermissions,
  } from '@stripe/stripe-terminal-react-native';

const App = ({navigator}) => {
    const [hasPerms, setHasPerms] = useState(false);
    const {initialize: initStripe} = useStripeTerminal();
    const [initializedStripe, setInitializeStripe] = useState(false);

    useEffect(() => {
        const initAndClear = async () => {
            const {error, reader} = await initStripe();
            if (error) {
            Alert.alert('StripeTerminal init failed', error.message);
            return;
            }
            if (reader) {
            setInitializeStripe(true);
            console.log(
                'StripeTerminal has been initialized properly and connected to the reader',
                reader,
            );
            return;
            }
            setInitializeStripe(true);
            console.log('StripeTerminal has been initialized properly');
        };
        if (hasPerms) {
            initAndClear();
        }
    }, [initStripe, hasPerms, navigator]);

    useEffect(() => {
        async function handlePermissions() {
            try {
            const {error} = await requestNeededAndroidPermissions({
                accessFineLocation: {
                title: 'Location Permission',
                message: 'Stripe Terminal needs access to your location',
                buttonPositive: 'Accept',
                },
            });
            if (!error) {
                handlePermissionsSuccess();
            } else {
                console.error(error);
            }
            } catch (e) {
            console.error(e);
            }
        }
        if (Platform.OS === 'android') {
            handlePermissions();
        } else {
            handlePermissionsSuccess();
        }
    }, [handlePermissionsSuccess]);

    const handlePermissionsSuccess = useCallback(async () => {
        setHasPerms(true);
      }, []);

      
    return (
    <SafeAreaProvider style={styles.container}>
        <StatusBar hidden />
        <AppNavigator />
        <Loader/>
    </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
})

export default App