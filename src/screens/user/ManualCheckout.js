import { View, Text,StyleSheet, Pressable, TextInput} from 'react-native'
import React,{useState} from 'react'
import Icon from 'react-native-vector-icons/Ionicons';
import {FamilySet,ColorSet} from '../../styles';
import Button from '../../components/default/Button';
import Input from '../../components/default/Input';
import { CreditCardInput, LiteCreditCardInput } from "react-native-credit-card-input";
import { ShowToast } from '../../utils/ShowToast';
import { captureManualPayment } from '../../networking/stripeServices/StripeApiServices';
import { setIsLoading } from '../../redux/reducers/loadingSlice/LoadingSlice';
import { useDispatch } from 'react-redux';

export default function CheckoutManually({navigation, route}) {
  const [formData, setFormData] = useState()
  const dispatch = useDispatch();
   const _onChange = (data) => {
      setFormData(data)
   };
  const [amount] = React.useState(route.params.amount);
  const submitHandler = async () => {
    if(formData.status.number == 'valid' && formData.status.expiry == 'valid' && formData.status.cvc == 'valid'){
        dispatch(setIsLoading(true))
        const res = await captureManualPayment({
          total_amount: amount,
          number: formData.values.number,
          expiry: formData.values.expiry,
          cvc: formData.values.cvc,
          postalCode:  formData.values.postalCode,
        })
        console.log('res == res',res)
        if(res){
          dispatch(setIsLoading(false))
        }
        if(res.success){
          ShowToast(res.message);
          navigation.navigate('CheckoutSuccess', {
            message: 'Payment completed successfully',
            txn_id : res.txn_id,
            total_amount : amount
          });
        }else{
          ShowToast('Payment failed');
        }

    }else{
      ShowToast('Please enter valid card details');
    }
  }

  return (
    <View style={styles.container}>
      {/* mavbar start  */}
      <View style={styles.navbar}>
        <Pressable style={styles.leftIcon} onPress={() => navigation.goBack()}> 
          <Icon name="arrow-back" size={20} color="#333" />
        </Pressable>
        <Text style={styles.navTitle}>Checkout Manually</Text>
        <Pressable onPress={() => navigation.navigate("Setting")}>
        <Icon name="settings-outline" size={20} color="#333" />
        </Pressable>
      </View>
      {/* mavbar end  */}
     <View>
      <Text style={{
        fontSize: 20,
        fontFamily: FamilySet.bold,
        color: ColorSet.textColorGrayNew,
        marginTop: 0,
        marginBottom: 20,
        justifyContent: 'center',
        textAlign: 'center',

      }}>Checkout amount : ${parseFloat(amount).toFixed(2)}</Text>
     <CreditCardInput 
        onChange={_onChange}
        requiresPostalCode={true} 
        allowScroll={true}
        inputStyle={styles.inputStyle}
        cardFontFamily={FamilySet.regular}
        inputContainerStyle={styles.inputContainerStyle}
     />
     </View>
     <View style={{ 
        position: 'absolute',
        bottom: 20,
        left: 10,
        right: 10,
      }}>
        <Button title="Submit" icon="arrow-forward-outline"  onPress={() => submitHandler()} disabled={true}  buttonStyle={styles.buttonStyle}/>
      
      </View>
    </View>
  )
}

const styles = StyleSheet.create({  
    container:{
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        position: 'relative',
    },
    body:{
      flex: 1,
        
    },
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
    buttonStyle:{
      width: '100%',
      textAlign: 'center',
      alignContent: 'center',
      justifyContent: 'center',
    },
    inputStyle:{
      fontSize: 16,
      fontFamily: FamilySet.regular,
      color: ColorSet.textColorDark,
      borderColor: ColorSet.bgLight,
      borderWidth: 1,
      borderRadius: 5,
      padding: 10,
      outline: 'none',
      marginTop: 10,
    },
    inputContainerStyle:{
      borderBottomWidth: 0,
    }
   
})