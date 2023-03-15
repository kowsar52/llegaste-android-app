import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import numeral from 'numeral';

const CurrencyInputKeypad = ({ value, onChange, currencySymbol }) => {
  const [formattedValue, setFormattedValue] = useState(0);

  const handleKeypadPress = (key) => {
    let newValue = formattedValue;
    if (key === 'C') {
      newValue = '';
    } else if (key === '←') {
      newValue = formattedValue.slice(0, -1);
    } else {
      newValue = formattedValue + key;
    }
    console.log('newValue',newValue)
    const numberValue = numeral(newValue).value();
    if (numberValue !== null) {
      const formattedText = numeral(numberValue).format(`$0,0.00`);
      setFormattedValue(formattedText);
      onChange(numberValue);
    }
  };

  const keypad = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['C', '0', '←'],
  ];

  return (
    <View>
      <Text>Enter amount:</Text>
      <Text style={{ textAlign: 'right', marginRight: 10 }}>{formattedValue}</Text>
      <View style={{ flexDirection: 'row' }}>
        {keypad.map((row, rowIndex) => (
          <View key={rowIndex} style={{ flex: 1, flexDirection: 'row' }}>
            {row.map((key) => (
              <TouchableOpacity
                key={key}
                style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
                onPress={() => handleKeypadPress(key)}
              >
                <Text style={{ fontSize: 20 }}>{key}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <TouchableOpacity
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
            onPress={() => handleKeypadPress(currencySymbol)}
          >
            <Text style={{ fontSize: 20 }}>{currencySymbol}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default CurrencyInputKeypad;
