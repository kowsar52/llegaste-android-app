import { View, Text,StyleSheet,Pressable,Image } from 'react-native'
import React,{useState,useEffect,useContext} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ColorSet,FamilySet, Size, appStyle } from '../../styles';
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
import NavBar from '../../components/default/NavBar';
import { useDispatch } from 'react-redux';
import { setIsLoading } from '../../redux/reducers/loadingSlice/LoadingSlice';

export default function Checkout({navigation,route}) {
 
  const dispatch = useDispatch();
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
      dispatch(setIsLoading(true))
      const resStripe = await stripeSetting();
      if (resStripe && connectedReader) {
        console.log('resStripe',resStripe)
        setTerminalSetting(resStripe);
        setStatus('Reader Connected');
        _createPaymentIntent(resStripe);
        dispatch(setIsLoading(false))
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
        total_amount: sumTotal() ,
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
        amount: Number(sumTotal()) * 100,
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
      total_amount: sumTotal(),
      payment_intent_id: paymentIntentId,
    });

    if ('error' in resp) {
      addLogs('Payment Failed. Please try again.', 'Failed');

      return;
    }

    if (resp.success == false && resp.status == 401) {
      navigation.navigate('Login');
    } else {
      addLogs('Payment Completed Successfully.', 'Success');

      navigation.navigate('CheckoutSuccess', {
        message: 'Payment completed successfully',
        total_amount: sumTotal(),
        amount: amount,
        tax : (parseFloat(amount) * (terminal_setting.tax_percentage / 100)),
        service_fee : (parseFloat(amount) * (terminal_setting.service_fee_percentage / 100)),
        txn_id : resp.txn_id
      });
    }
  };

  //sum total
  const sumTotal = () => {
    let total = 0;
    total = parseFloat(amount) + (parseFloat(amount) * (terminal_setting.tax_percentage / 100)) + (parseFloat(amount) * (terminal_setting.service_fee_percentage / 100))
    return total.toFixed(2);
  }

  if(terminal_setting){
    return (
      <View style={styles.container}>
        {/* mavbar start  */}
        <NavBar navigation={navigation} title="Payment" />
        {/* mavbar end  */}
        <View style={[appStyle.container_center]}>
    
  
          <Image
           style={{
              width: 200,
              height: 200,
              resizeMode: 'contain',
           }}
            source={{
              uri: 'https://media2.giphy.com/media/TDyxBGZcViZnoye8iN/giphy.gif',
            }}
          />
              {/* payment details table  */}
              <View style={styles.paymentDetails}>
            {/* <Text style={styles.paymentDetails.title}>Payment details</Text> */}
            <View style={[appStyle.row,appStyle.p5,appStyle.justify_between]}>
              <Text style={[appStyle.title]}>Amount</Text>
              <Text style={[appStyle.title]}>
                ${parseFloat(amount).toFixed(2)}
              </Text>
            </View>
            <View style={[appStyle.row,appStyle.p5,appStyle.justify_between]}>
              <Text style={[appStyle.title]}>TAX ({terminal_setting.tax_percentage}%)</Text>
              <Text style={[appStyle.title]}>
                ${(parseFloat(amount) * (terminal_setting.tax_percentage / 100)).toFixed(2)}
              </Text>
            </View>
            <View style={[appStyle.row,appStyle.p5,appStyle.justify_between]}>
              <Text style={[appStyle.title]}>Service Fee ({terminal_setting.service_fee_percentage}%)</Text>
              <Text style={[appStyle.title]}>
                ${(parseFloat(amount) * (terminal_setting.service_fee_percentage / 100)).toFixed(2)}
              </Text>
            </View>
            <View style={[appStyle.row,appStyle.p5, appStyle.justify_between,{
              borderTopWidth: 1,
              borderTopColor: '#ccc',
            }]}>
              <Text style={[appStyle.title]}>Total Amount</Text>
              <Text style={[appStyle.title]}>
                ${sumTotal()}
              </Text>
            </View>
          </View>
          {/* payment details table end  */}
         
          <Text style={[styles.subTitle,Size.normal]}>
            Please swap your card and complete the payment.
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
  }else{
    return null;
  }
  
  
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#fff',
  },

  amount:{
    fontSize: 40,
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
    borderRadius: 10,
  },
  success:{
    backgroundColor: ColorSet.lightGreenBg,
    padding: 10,
    width: '100%',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    borderRadius: 10,
  },
  subTitle:{
    fontSize: 20,
    fontFamily: FamilySet.bold,
    borderWidth: 0,
    color: ColorSet.textColorDark,
    textAlign: 'center',
    margin: 10,
  },
  paymentDetails: {
    width: '100%',
    padding: 15,
    title : {
      fontSize: 20,
      textAlign: 'center',
      padding: 10,
      fontFamily: FamilySet.bold,
      color: ColorSet.textColorDark,
    }
  }
})