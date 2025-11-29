import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import PosScreen from '../screens/PosScreen';
import MasterScreen from '../screens/MasterScreen';
import MasterProduct from '../screens/Master/MasterProduct';
import MasterProductEdit from '../screens/Master/MasterProductEdit';
import MasterProductCreate from '../screens/Master/MasterProductCreate';
import MasterPelanggan from '../screens/Master/MasterPelanggan';
import MasterPelangganCreate from '../screens/Master/MasterPelangganCreate';
import MasterPelangganEdit from '../screens/Master/MasterPelangganEdit';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Pos" component={PosScreen} />
      <Stack.Screen name="Master" component={MasterScreen} />
      <Stack.Screen name="MasterProduct" component={MasterProduct} />
      <Stack.Screen name="MasterProductEdit" component={MasterProductEdit} />
      <Stack.Screen
        name="MasterProductCreate"
        component={MasterProductCreate}
      />
      <Stack.Screen name="MasterPelanggan" component={MasterPelanggan} />
      <Stack.Screen
        name="MasterPelangganCreate"
        component={MasterPelangganCreate}
      />
      <Stack.Screen
        name="MasterPelangganEdit"
        component={MasterPelangganEdit}
      />
    </Stack.Navigator>
  );
}
