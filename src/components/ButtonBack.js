import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { heightPercentageToDP } from 'react-native-responsive-screen';

export default function ButtonBack({ onPress, type = 'small' }) {
  const PRIMARY = '#1E88E5';
  return (
    <TouchableOpacity
      style={{
        padding: type === 'small' ? 6 : 10,
        backgroundColor: '#e0e7ff',
        borderRadius: 8,
      }}
      onPress={onPress}
    >
      <Icon
        name="arrow-left"
        size={
          type === 'small' ? heightPercentageToDP(4) : heightPercentageToDP(5)
        }
        color={PRIMARY}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({});
