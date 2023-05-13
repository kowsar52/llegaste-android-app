import Lottie from 'lottie-react-native';
import React, { useState,useContext } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity,Image } from 'react-native';
import Button from '../../components/default/Button';
import Input from '../../components/default/Input';
import {ColorSet, appStyle} from '../../styles'
import { StackActions } from '@react-navigation/native';
import { useDispatch,useSelector } from 'react-redux';
import { loginUser } from '../../networking/authServices/AuthAPIServices';
// import {login} from '../../redux/reducers/authSlice/AuthServices'
import { setIsLoading } from '../../redux/reducers/loadingSlice/LoadingSlice';
import { AuthContext } from '../../context/auth-context';


export default function Login({navigation}) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const authCTX = useContext(AuthContext);


const handleLogin =  async () => {
  dispatch(setIsLoading(true))
  const data = {
    email: email,
    password: password,
  };
  const response = await loginUser(data);
  dispatch(setIsLoading(false))
  if(response.success){
    authCTX.onLogin(response.data.token)
    //navigate
    
  }

}
  return (
    <View style={styles.container}>
    <View style={{
        alignItems: 'center',
        justifyContent: 'center',
    }}>
    <Image source={require('../../assets/logo.png')} style={styles.logo}/>
      <Text style={styles.title}>Sign in to your account.</Text>
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
      <View>
        <Text style={appStyle.label}>Password</Text>
        <Input
            icon="key"
            placeholder="Password"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />
      </View>

      <Button title="Sign in"  onPress={() => handleLogin()} disabled={true}  buttonStyle={styles.buttonStyle}/>

      <View style={{ flexDirection: 'row', marginTop: 20,justifyContent: "center" }}>
        <Text>Forget your pasword? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('ForgetPassword')}>
            <Text style={{ color: ColorSet.theme }}>Forget Password</Text>
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
