import React, { useState } from 'react';
import { StyleSheet, Text, View, Switch,TouchableOpacity, Modal,TextInput,Pressable } from 'react-native';
import { appStyle, ColorSet,FamilySet } from '../../../styles';
import Button from '../../../components/default/Button';
import Icon from 'react-native-vector-icons/Ionicons';
import Input from '../../../components/default/Input';

const ProfileSetting = ({navigation}) => {

  return (
    <View style={styles.container}>
          {/* mavbar start  */}
          <View style={styles.navbar}>
        <Pressable style={styles.leftIcon} onPress={() => navigation.goBack()}> 
          <Icon name="arrow-back" size={20} color="#333" />
        </Pressable>
        <Text style={styles.navTitle}>Account info</Text>
        <Pressable onPress={() => navigation.navigate("Account")}>
        <Icon name="log-out-outline" size={20} color="#333" />
        </Pressable>
      </View>
      {/* mavbar end  */}

      <View>
      <View>
        <Text style={appStyle.label}>Name</Text>
        <Input placeholder="Your name"  />
      </View>
  
 
      </View>
 

     

      <View style={styles.logoutContainer}>
      <Button title="Go to checkout" icon="arrow-forward-outline" onPress={() => navigation.navigate("Checkout")} buttonStyle={styles.submitButton} />
    
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: ColorSet.textColorDark,
    fontFamily: 'TTCommons-Bold',
  },
  setting: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  settingLabel: {
    fontSize: 18,
    color: ColorSet.textColorDark,
    fontFamily: 'TTCommons-Medium',
  },
  saveButton: {
    marginTop: 30,
  },
  logoutContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 30,
  },
  logoutButton: {
    backgroundColor: ColorSet.redDeleteColor,
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
  },
  settingLabel: {
    fontSize: 18,
    color: ColorSet.textColorDark,
    fontFamily: FamilySet.medium,
  },
  submitButton:{
    alignContent: 'center',
    justifyContent: 'center',
  },
  settingValue: {
    fontSize: 18,
    color: ColorSet.textColorDark,
    fontFamily: FamilySet.medium,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
    color: ColorSet.textColorDark,
    fontFamily: 'TTCommons-Medium',
  },
  tipInput: {
    height: 50,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  modalAction: {
    flexDirection: 'row',
    justifyContent: 'space-between',

  },
  saveButton: {
    backgroundColor: ColorSet.theme,
    borderRadius: 5,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    width: '47%',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: FamilySet.medium,
  },
  cancelButton: {
    backgroundColor: ColorSet.redDeleteColor,
    borderRadius: 5,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    width: '47%',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: FamilySet.medium,
  },
});

export default ProfileSetting;
