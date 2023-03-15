import Lottie from 'lottie-react-native';
import React, { useState,useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity,Image } from 'react-native';
import Button from '../../components/default/Button';
import Input from '../../components/default/Input';
import {ColorSet, appStyle} from '../../styles'
import { StackActions } from '@react-navigation/native';
import { useDispatch,useSelector } from 'react-redux';
import { loginUser } from '../../networking/authServices/AuthAPIServices';
import {login} from '../../redux/reducers/authSlice/AuthServices'
import { setIsLoading } from '../../redux/reducers/loadingSlice/LoadingSlice';

export default function ForgetPassword({navigation}) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');



const handleSubmit =  async () => {
  dispatch(setIsLoading(true))
  const data = {
    email: email,
  };
  const response = await loginUser(data);
  dispatch(setIsLoading(false))
  if(response.success){
    dispatch(login(response.data))
    navigation.dispatch(StackActions.replace('OtpVerify'));
  }

}
  return (
    <View style={styles.container}>
    <View style={{
        alignItems: 'center',
        justifyContent: 'center',
    }}>
    <Image source={require('../../assets/logo.png')} style={styles.logo}/>
      <Text style={styles.title}>Forget password.</Text>
    </View>
      <View>
        <Text style={appStyle.label}>Email Address</Text>
        <Input
            onChangeText={setEmail}
            value={email}
            icon="mail"
            keyboardType="email-address"
            placeholder="Email"
          />
      </View>

      <Button title="Forget password"  onPress={() => handleSubmit()} disabled={true}  buttonStyle={styles.buttonStyle}/>

      <View style={{ flexDirection: 'row', marginTop: 20,justifyContent: "center" }}>
        <Text>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={{ color: ColorSet.theme }}>Login</Text>
        </TouchableOpacity>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
logo: {
        height: 60,
        objectFit: 'contain',
        width: 160,
        marginTop: 10
    },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 10,
    paddingTop: 50,
  },
  title: {
    fontSize: 20,
    paddingBottom: 30,
    color: ColorSet.textColorDark,
    fontFamily: "TTCommons-Medium"
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#CCCCCC',
    borderStyle: 'solid',
    borderWidth: 1,
    padding: 10,
    borderRadius:5,
    marginBottom: 16,
  },
  buttonStyle: {
    width: '100%',
    textAlign: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
