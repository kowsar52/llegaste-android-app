import { View, Text,StyleSheet,Pressable,Image } from 'react-native'
import React,{useState,useEffect,useContext} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ColorSet,FamilySet } from '../../styles';
import Button from '../../components/default/Button';
import Icon from 'react-native-vector-icons/Ionicons';
import TextTicker from 'react-native-text-ticker';
import { stripeSetting } from '../../networking/authServices/AuthAPIServices';
import{createPaymentIntentApi,capturePaymentIntent} from '../../networking/stripeServices/StripeApiServices';
import {
  useStripeTerminal,
  PaymentIntent,
  StripeError,
  CommonError,
} from '@stripe/stripe-terminal-react-native';

export default function Checkout({navigation,route}) {
 

  const {amount} = route.params;
  const [logMessage, setLogMessage] = useState('Prepearing');
  const [logType, setLogType] = useState('Success');
  const [terminal_setting, setTerminalSetting] = useState(null);


  //get cart items and total amount from cart screen
  const [currency, setCurrency] = useState('usd');

  const [status, setStatus] = useState('Pending');
  const [testCardNumber, setTestCardNumber] = useState('4242424242424242');
  const [enableInterac, setEnableInterac] = useState(false);
  const [skipTipping, setSkipTipping] = useState(true);

  const {
    createPaymentIntent,
    collectPaymentMethod,
    processPayment,
    retrievePaymentIntent,
    cancelCollectPaymentMethod,
    setSimulatedCard,
    connectedReader,
  } = useStripeTerminal();

  //set and show logs
  const addLogs = (message, type = 'success') => {
    // console.log(data.events[0]);
    setLogMessage(message);
    setLogType(type);
  };

  useEffect(() => {
    async function getUser(){
      const resStripe = await stripeSetting();
      if (resStripe && connectedReader) {
        setTerminalSetting(resStripe);
        setStatus('Reader Connected');
        _createPaymentIntent(resStripe);
      } else {
        setStatus('Location searcing...');
      }
    }
    getUser();

  }, [setTerminalSetting,connectedReader]);

  //make payment with connected reader
  const _createPaymentIntent = async (resStripe) => {
    let authUserCity = resStripe
    //set up user data
    let device_type = authUserCity.device_type;
    let isSimulated = false;
    if (authUserCity.mode == 'sandbox') {
      isSimulated = true;
    }

    if (isSimulated) {
      await setSimulatedCard(testCardNumber);
    }

    const paymentMethods = ['card_present'];
    if (enableInterac) {
      paymentMethods.push('interac_present');
    }

    let paymentIntent = PaymentIntent.Type | undefined;
    let paymentIntentError = StripeError | undefined;
    if (device_type === 'internet') {
      const resp = await createPaymentIntentApi({
        total_amount: amount,
        payment_method_types: paymentMethods,
      });
      console.log('resp create payment intent', resp);
      if ('error' in resp) {
        addLogs('Failed, please contact with us.', 'Failed');
        return;
      }

      if (!resp?.client_secret) {
        return Promise.resolve({
          error: {message: 'no client_secret returned!'},
        });
      }

      const response = await retrievePaymentIntent(resp.client_secret);
      paymentIntent = response.paymentIntent;
      paymentIntentError = response.error;
    } else {
      const response = await createPaymentIntent({
        amount: Number(amount) * 100,
        currency: currency,
        paymentMethodTypes: paymentMethods,
        setupFutureUsage: enableInterac ? undefined : 'off_session',
      });
      paymentIntent = response.paymentIntent;
      paymentIntentError = response.error;
    }

    if (paymentIntentError) {
      addLogs('Failed, please contact with us.', 'Failed');
      return;
    }

    if (!paymentIntent?.id) {
      addLogs('Failed, please contact with us.', 'Failed');
      return;
    }
    addLogs('Please wait and complete your payment.', 'Success');

    return await _collectPaymentMethod(paymentIntent.id);
  };

  const _collectPaymentMethod = async paymentIntentId => {
    addLogs('Please wait and complete your payment.', 'Success');
    const {paymentIntent, error} = await collectPaymentMethod({
      paymentIntentId: paymentIntentId,
      skipTipping: skipTipping,
    });

    if (error) {
      addLogs('Connection failed, please contact with us.', 'Failed');
    } else if (paymentIntent) {
      addLogs('Please wait for payment.', 'Success');
      await _processPayment(paymentIntentId);
    }
  };


  const _processPayment = async paymentIntentId => {
    addLogs('POS device connecting, please be patient.', 'Success');

    const {paymentIntent, error} = await processPayment(paymentIntentId);

    if (error) {
      addLogs('Payment failed. Please try again', 'Failed');
      return;
    }

    if (!paymentIntent) {
      addLogs('Payment failed. Please try again', 'Failed');
      return;
    }

    addLogs('POS Device connecting for payment', 'Success');

    // Set last successful charge Id in context for refunding later
    // setLastSuccessfulChargeId(paymentIntent.charges[0].id);

    if (paymentIntent?.status === 'succeeded') {
      return;
    }

    _capturePayment(paymentIntentId);
  };

  const _capturePayment = async paymentIntentId => {
    addLogs(
      'POS Device connected. Please swap your card and complete the payment.',
      'Success',
    );

    const resp = await capturePaymentIntent({
      total_amount: amount,
      payment_intent_id: paymentIntentId,
    });

    if ('error' in resp) {
      addLogs('Payment Failed. Please try again.', 'Failed');

      return;
    }

    if (resp.success == false && resp.status == 401) {
      navigation.navigate('Login');
    } else {
      addLogs('Payment Successfully. Order completed successfully', 'Success');

      navigation.navigate('CheckoutSuccess', {
        message: 'Payment completed successfully',
        total_amount: amount,
        txn_id : resp.txn_id
      });
    }
  };

  
  return (
    <View style={styles.container}>
      {/* mavbar start  */}
      <View style={styles.navbar}>
        <Pressable style={styles.leftIcon} onPress={() => navigation.goBack()}> 
          <Icon name="arrow-back" size={20} color="#333" />
        </Pressable>
        <Text style={styles.navTitle}>Checkout</Text>
        <View></View>
      </View>
      {/* mavbar end  */}
      <View style={styles.body}>
       <Text style={styles.amount}>${parseFloat(amount).toFixed(2)}</Text>

        <Image
         style={{width: '100%', height: 200,alignSelf:'center'}}
          source={{
            uri: 'https://media2.giphy.com/media/TDyxBGZcViZnoye8iN/giphy.gif',
          }}
        />
      
       
        <Text style={styles.subTitle}>
        Please tap, swipe or enter card on reader
        </Text>

      <TextTicker
        style={
          logType == 'Failed' ? styles.failed : styles.success
        }
        duration={10000}
        loop
        bounce
        repeatSpacer={10}
        onScrollStart={true}
        marqueeDelay={100}>
        {logMessage} -------&nbsp;{logMessage} -------&nbsp;
      </TextTicker>

      <Button
        title="Go Back"
        onPress={() => navigation.goBack()}
      />

      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#fff',
  },
  body:{
    flex: 1,
    width: '100%',
    textAlign: 'center',
    alignContent: 'center',
    alignItems: 'center',
      
  },
  navbar:{
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    maxHeight: 70,
    padding: 20,
      
  },
  leftIcon:{
      width: 20,
  },
  navTitle:{
      fontSize: 20,
      fontFamily: FamilySet.bold,
      color: ColorSet.textColorDark,
  } ,
  amount:{
    fontSize: 70,
    fontFamily: FamilySet.bold,
    borderWidth: 0,
    color: ColorSet.textColorDark,
    textAlign: 'center',
  },
  failed:{
    backgroundColor: ColorSet.lightRedBg,
    padding: 10,
    width: '100%',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  success:{
    backgroundColor: ColorSet.lightGreenBg,
    padding: 10,
    width: '100%',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  subTitle:{
    fontSize: 20,
    fontFamily: FamilySet.bold,
    borderWidth: 0,
    color: ColorSet.textColorDark,
    textAlign: 'center',
    margin: 10,
  }
})