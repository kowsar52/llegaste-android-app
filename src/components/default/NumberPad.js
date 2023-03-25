import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet,Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { ColorSet,FamilySet } from '../../styles';
import { useNavigation } from '@react-navigation/native';

const NumberPad = ({ onPress, amount}) => {
  const navigation = useNavigation();
    return (
      <View style={styles.container}>
           <Pressable onPress={() => navigation.navigate("ManualCheckout",{amount: amount})} style={{
          backgroundColor: 'black',
          bottom: 0,
        }}>
          <Text style={{
            fontSize: 18,
            color: 'white',
            fontFamily: FamilySet.medium,
            textAlign: 'center',
            padding: 10,
          }}>Manual Checkout</Text>
        </Pressable>
        <View style={styles.row}>
          <TouchableOpacity style={styles.button} onPress={() => onPress('1')}>
            <Text style={styles.buttonText}>1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => onPress('2')}>
            <Text style={styles.buttonText}>2</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => onPress('3')}>
            <Text style={styles.buttonText}>3</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity style={styles.button} onPress={() => onPress('4')}>
            <Text style={styles.buttonText}>4</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => onPress('5')}>
            <Text style={styles.buttonText}>5</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => onPress('6')}>
            <Text style={styles.buttonText}>6</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity style={styles.button} onPress={() => onPress('7')}>
            <Text style={styles.buttonText}>7</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => onPress('8')}>
            <Text style={styles.buttonText}>8</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => onPress('9')}>
            <Text style={styles.buttonText}>9</Text>
          </TouchableOpacity>
        </View>
        <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 30,
            marginBottom: 60,
        }}>
            <TouchableOpacity style={styles.button} onPress={() => onPress('clean')}>
                <Icon name="close-outline"  style={styles.buttonText} />
            </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => onPress('0')}>
            <Text style={styles.buttonText}>0</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.backspace]} onPress={() => onPress('backspace')}>
            <Icon name="backspace-outline"  style={styles.buttonText} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  
  const styles = StyleSheet.create({
    container: {
      backgroundColor: ColorSet.theme,
      flex: 1,
      marginBottom:20
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 0,
      paddingHorizontal: 30,
    },
    button: {
      width: 80,
      height: 80,
      alignItems: 'center',
      justifyContent: 'center',
    },
    blank: {
      opacity: 0,
    },
    backspace: {
     
    },
    backspaceText: {
      color: '#fff',
      
    },
    buttonText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#fff',
    },
  });

  
  export default NumberPad
