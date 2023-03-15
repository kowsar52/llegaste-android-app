import AsyncStorage from '@react-native-async-storage/async-storage';
import {Keys} from '../constants';

export const storeData = async (key, data) => {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.log('Error : ', e);
  }
};

export const getData = async key => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    const result = jsonValue != null ? JSON.parse(jsonValue) : null;
    return result;
  } catch (e) {
    console.log('Error : ', e);
  }
};

export const saveUserData = async data => {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem(Keys.user, jsonValue);
  } catch (e) {
    console.log('Error : ', e);
  }
};

export const getUserData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(Keys.user);
    const result = jsonValue != null ? JSON.parse(jsonValue) : null;
    return result;
  } catch (e) {
    console.log('Error : ', e);
  }
};

export const removeData = async key => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.log('Error : ', e);
  }
};
