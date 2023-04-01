import { View, Text,StyleSheet, Pressable, Dimensions, Alert} from 'react-native'
import React,{useState,useEffect} from 'react'
import Icon from 'react-native-vector-icons/Ionicons';
import {FamilySet,ColorSet} from '../../styles';
import Button from '../../components/default/Button';
import NumberPad from '../../components/default/NumberPad';
import { ShowToast } from '../../utils/ShowToast';
import { getUserData } from '../../utils/Storage';
import {useStripeTerminal} from '@stripe/stripe-terminal-react-native';
const screenHeight = Dimensions.get('window').height;

export default function Home({navigation}) {
  const [amount, setAmount] = useState(0);
  const {connectedReader, initialize} = useStripeTerminal();

  const handlePress = (key) => {
   
    switch (key) {
      case 'backspace':
        if(amount == 0){
          setAmount(0);
        }else{
          setAmount(amount.slice(0, -1));
        }
        break;
      case 'clean':
        setAmount(0);
        break;
      default:
        setAmount(`${amount}${key}`);
        break;
    }
  };
  useEffect(() => {
    async function getUser(){
      const userData = await getUserData();
      if(userData){
        const {reader} = await initialize();
        console.log('reader', reader);
        if(reader){
          ShowToast('Reader Connected');
        }else{
          Alert.alert(
            "Reader not connected",
            "Please connect reader",
            [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              { text: "OK", onPress: () => navigation.navigate('SetupTerminal') }
            ]
          );
          // //go to setupterinal screen
          // navigation.navigate('SetupTerminal');
        }
      }else{
        //go to login screen
        navigation.navigate('Login');
      }
    }
    getUser();

  }, []);

  return (
    <View style={styles.container}>
      {/* mavbar start  */}
      <View style={styles.navbar}>
        <Pressable style={styles.leftIcon} onPress={() => navigation.goBack()}> 
          <Icon name="arrow-back" size={20} color="#333" />
        </Pressable>
        <Text style={styles.navTitle}>Payment</Text>
        <Pressable onPress={() => navigation.navigate("Setting")}>
        <Icon name="settings-outline" size={20} color="#333" />
        </Pressable>
      </View>
      {/* mavbar end  */}
      <View style={styles.body}>
       <Text style={styles.amount}>${parseFloat(amount)}</Text>
      </View>
      <View style={styles.numberBar}>
          <NumberPad onPress={handlePress} amount={amount} />
          <Button title="Checkout" icon="arrow-forward-outline"  onPress={() => navigation.navigate("Checkout",{
            amount: amount
          })} disabled={true}  buttonStyle={styles.buttonStyle}/>
      
        </View>
    </View>
  )
}

const styles = StyleSheet.create({  
  amountInputStyle:{
    fontSize: 80,
    height: "70%",
    fontFamily: FamilySet.bold,
    borderWidth: 0,
    color: ColorSet.textColorDark,
    textAlign: 'right',
    padding: 0,
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
    container:{
        flex: 1,
        backgroundColor: '#fff',
    },
    body:{
      flex: 3,
    },
    numberBar:{
      flex: 6,
      backgroundColor: ColorSet.theme,
      position: 'relative',
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
    input:{
        width: '100%',
        height: 50,
        paddingHorizontal: 10,
        paddingVertical:10,
        height: "20%",
        backgroundColor: ColorSet.bgLight
          
    },
    buttonStyle:{
      textAlign: 'center',
      alignContent: 'center',
      justifyContent: 'center',
      marginHorizontal: 20,
      marginVertical: 10,
      backgroundColor: ColorSet.redDeleteColor,
    },
    buttonStyleOutline:{
      width: '100%',
      textAlign: 'center',
      alignContent: 'center',
      justifyContent: 'center',
      marginTop: 15,
      backgroundColor: ColorSet.redDeleteColor,
    },
    amount:{
      fontSize: 80,
      fontFamily: FamilySet.bold,
      color: ColorSet.textColorDark,
      textAlign: 'center',
      marginTop: "10%",

    }
})