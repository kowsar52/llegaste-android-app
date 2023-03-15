import React from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import { ColorSet as colors } from '../../styles';

export default function ListItem({
  title,
  rightElement,
  color,
  description,
  onPress,
  testID,
  disabled,
}) {
  return (
    <TouchableOpacity
      testID={testID}
      activeOpacity={onPress ? 0.5 : 1}
      onPress={onPress}
      style={styles.container}>
      <View style={styles.flex}>
        <Text
          style={[
            styles.title,
            color ? {color} : {},
            disabled && styles.disabled,
          ]}>
          {title}
        </Text>
        {description !== null && description !== undefined && (
          <Text style={styles.description}>{description}</Text>
        )}
      </View>
      {rightElement && rightElement}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomColor: colors.gray,
    backgroundColor: colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        borderBottomWidth: StyleSheet.hairlineWidth,
      },
      android: {
        borderBottomWidth: 1,
        borderBottomColor: `${colors.gray}66`,
      },
    }),
  },
  title: {
    color: colors.slate,
    fontSize: 14,
  },
  description: {
    color: colors.slate,
    fontSize: 13,
  },
  flex: {
    flex: 1,
  },
  disabled: {
    opacity: 0.5,
  },
});
