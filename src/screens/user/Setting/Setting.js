import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  Modal,
  TextInput,
  Pressable,
  Alert,
  StatusBar,
} from 'react-native';
import {appStyle, ColorSet, FamilySet} from '../../../styles';
import Button from '../../../components/default/Button';
import Icon from 'react-native-vector-icons/Ionicons';
import {useDispatch} from 'react-redux';
import {StackActions} from '@react-navigation/native';
import {Screens} from '../../../constants';
import {setIsLoading} from '../../../redux/reducers/loadingSlice/LoadingSlice';
import {setUserType} from '../../../redux/reducers/authSlice/AuthServices';
import {setUserData} from '../../../redux/reducers/userSlice/UserServices';
import {logoutUser} from '../../../networking/authServices/AuthAPIServices';
import {removeData} from '../../../utils/Storage';
import {Keys} from '../../../constants';

const Setting = ({navigation}) => {
  const dispatch = useDispatch();
  const settings = [
    {
      id: 1,
      title: 'Terminal Settings',
      icon: require('../../../assets/images/pos-terminal.png'),
      screen: Screens.terminalSetting,
    },
    // {
    //   id: 2,
    //   title: 'Printer Settings',
    //   icon: require('../../../assets/images/printer.png'),
    //   screen: Screens.printerSetting,
    // },
    // {
    //   id: 3,
    //   title: 'Payment Settings',
    //   icon: require('../../../assets/images/pos-terminal.png'),
    //   screen: Screens.terminalSetting,
    // },
    // {
    //   id: 4,
    //   title: 'Profile Settings',
    //   icon: require('../../../assets/images/settings.png'),
    //   screen: Screens.profileSetting,
    // },
    {
      id: 5,
      title: 'Change Pin',
      icon: require('../../../assets/images/password.png'),
      screen: Screens.pinSetting,
    }
    
  ]
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
          if (response) {
            await removeData(Keys.user);
            dispatch(setUserData(null));
            dispatch(setUserType(null));
            dispatch(setIsLoading(false));
            navigation.dispatch(StackActions.replace('Login'));
          }
        },
      },
    ]);
  };

  const Item = ({item}) => (
   <Pressable style={styles.item} onPress={() => navigation.navigate(item.screen)}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}>
        <Image source={item.icon} style={styles.icon} />
        <Text style={styles.title}>{item.title}</Text>
      </View>
      <Icon name="chevron-forward-outline" size={20} color="#333" />
    </Pressable>
  );

  return (
    <View style={styles.container}>
      {/* mavbar start  */}
      <View style={styles.navbar}>
        <Pressable style={styles.leftIcon} onPress={() => navigation.navigate("Home")}>
          <Icon name="arrow-back" size={20} color="#333" />
        </Pressable>
        <Text style={styles.navTitle}>Settings</Text>
        <Pressable onPress={() => logoutHandler()}>
          <Icon name="log-out-outline" size={20} color="#333" />
        </Pressable>
      </View>
      {/* mavbar end  */}

      {/* body start  */}
      <View style={styles.body}>
      <FlatList
        data={settings}
        renderItem={({item}) => <Item item={item} />}
        keyExtractor={item => item.id}
      />
      </View>
      {/* body end  */}

    </View>
  );
};

const styles = StyleSheet.create({
  body:{
    flex: 1,
    marginTop: 50,
    padding: 10,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    maxHeight: 50,
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
    fontSize: 20,
    fontFamily: FamilySet.bold,
    color: ColorSet.textColorDark,
  },
  container: {
    flex: 1,
  },
  item:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: ColorSet.white,
    marginBottom: 10,
    borderRadius: 5,
  },
  icon:{
    width: 40,
    height: 40,
  },
  title: {
    fontSize: 17,
    fontFamily: FamilySet.bold,
    paddingLeft: 15,
    color: ColorSet.textColorDark,

  }
  
  
});

export default Setting;
