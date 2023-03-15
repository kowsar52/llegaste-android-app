import React, { useState } from 'react';
import { StyleSheet, Text, View, Switch,TouchableOpacity, Modal,TextInput,Pressable } from 'react-native';
import { appStyle, ColorSet,FamilySet } from '../../styles';
import Button from '../../components/default/Button';
import Icon from 'react-native-vector-icons/Ionicons';
import Input from '../../components/default/Input';
import SelectDropdown from 'react-native-select-dropdown'
const Profile = ({navigation}) => {
    const [isEnableManualCheckout, setIsEnableManualCheckout] = useState(false);
    const [printers, setPrinters] = useState(["Usb" , "Self", "Ethernet" , "Bluetooth"]);


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
        <Text style={appStyle.label}>Account info</Text>
        <Input
            placeholder="Account info"
          />
      </View>
      <View>
        <Text style={appStyle.label}>Terminal Name</Text>
        <Input
            placeholder="Terminal Name"
          />
      </View>
      <View>
        <Text style={appStyle.label}>Select Printer</Text>
        <SelectDropdown
            data={printers}
            buttonStyle={styles.dropdown}
            buttonTextStyle={styles.dropdownText}
            dropdownStyle={styles.dropdownStyle}
            rowStyle={{ backgroundColor: ColorSet.white, padding: 10,borderBottomColor: ColorSet.bgLight }}
            rowTextStyle={{ color: ColorSet.theme, fontFamily: FamilySet.regular, fontSize: 16 }}
            selectedRowTextStyle={{ color: ColorSet.theme, fontFamily: FamilySet.bold, fontSize: 16 }}
            onSelect={(selectedItem, index) => {
                console.log(selectedItem, index)
            }}
            buttonTextAfterSelection={(selectedItem, index) => {
                // text represented after item is selected
                // if data array is an array of objects then return selectedItem.property to render after item is selected
                return selectedItem
            }}
            rowTextForSelection={(item, index) => {
                // text represented for each item in dropdown
                // if data array is an array of objects then return item.property to represent item in dropdown
                return item
            }}
        />
      </View>
      <View style={styles.setting}>
        <Text style={appStyle.label}>Enable manual checkout</Text>
        <Switch
          value={isEnableManualCheckout}
          onValueChange={setIsEnableManualCheckout}
          trackColor={{ true: ColorSet.theme }}
          thumbColor={isEnableManualCheckout ? ColorSet.theme : '#f4f3f4'}
        />
      </View>
     
      
        {/* <Pressable onPress={() => navigation.navigate("Account")} style={{
            backgroundColor: ColorSet.theme,
            padding: 10,
            borderRadius: 5,
            marginTop: 10,
            marginBottom: 10,
            width: 200,
            alignItems: 'center',
        }}>
            <Text style={{
                 color: "#fff",
                 fontFamily: FamilySet.bold,
            }}>Enable mannualy checkout</Text>
        </Pressable> */}
      </View>
 

     

      <View style={styles.logoutContainer}>
      <Button title="Go to checkout" icon="arrow-forward-outline" onPress={() => navigation.navigate("Checkout")} buttonStyle={styles.submitButton} />
    
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    dropdown:{
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: ColorSet.bgLight,
        borderRadius: 5,
        backgroundColor: '#FFFFFF',
    },
    dropdownText:{
        fontSize: 18,
        color: ColorSet.textColorDark,
        fontFamily: FamilySet.medium,
    },
    dropdownStyle:{
        borderBottomColor: ColorSet.bgLight,
        backgroundColor: '#FFFFFF',
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

export default Profile;
