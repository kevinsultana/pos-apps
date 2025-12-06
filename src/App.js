import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import { CartProvider } from './context/CartContext';
import Toast from 'react-native-toast-message';

export default function App() {
  return (
    <CartProvider>
      <NavigationContainer>
        <AppNavigator />
        <Toast />
      </NavigationContainer>
    </CartProvider>
  );
}
