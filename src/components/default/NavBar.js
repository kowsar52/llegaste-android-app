import {View, Text, StyleSheet,Pressable, Alert} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { ColorSet, FamilySet } from '../../styles';
import { removeData } from '../../utils/Storage';
import { Keys } from '../../constants';
import { ShowToast } from '../../utils/ShowToast';
import { useDispatch } from 'react-redux';
import {setUserType,setUserPrinter} from '../../redux/reducers/authSlice/AuthServices';
import {setUserData} from '../../redux/reducers/userSlice/UserServices';
import { setIsLoading } from '../../redux/reducers/loadingSlice/LoadingSlice';
import { logoutUser } from '../../networking/authServices/AuthAPIServices';


export default function NavBar({navigation, title,customStyle, logoutBtn, cancelDiscovering = false}) {
  const dispatch = useDispatch();
  //logoutHandler
  const logoutHandler = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'No',
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: async () => {
          dispatch(setIsLoading(true));
          const response = await logoutUser();
          console.log('response', response);
          if (response) {
            await removeData(Keys.user);
            dispatch(setUserData(null));
            dispatch(setUserType(null));
            dispatch(setIsLoading(false));
            navigation.navigate('Login');
          }
        },
      },
    ]);
  };

  return (
    <View style={[styles.navbar,customStyle]}>
       <Pressable onPress={() => navigation.goBack()}>
          <Icon name="chevron-back-outline" size={22} color="#333" />
        </Pressable>
        <Text style={styles.navTitle}>{title}</Text>
       <View>
        {
          logoutBtn &&  <Pressable onPress={() => logoutHandler()}>
          <Icon name="log-out-outline" size={20} color="#333" />
             </Pressable>
        }
       </View>
       
      </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    maxHeight: 60,
    borderBottomWidth: 1,
    borderBottomColor: ColorSet.borderColorGray,
    padding: 10,
    paddingTop: 15,
    zIndex: 99,
    backgroundColor: ColorSet.white,
    width: '100%',
  },
  leftIcon: {
    width: 16,
  },
  navTitle: {
    fontSize: 16,
    fontFamily: FamilySet.bold,
    color: ColorSet.textColorDark,
  },
});
