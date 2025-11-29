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
import MasterPemasok from '../screens/Master/MasterPemasok';
import MasterPemasokCreate from '../screens/Master/MasterPemasokCreate';
import MasterPemasokEdit from '../screens/Master/MasterPemasokEdit';
import MasterKategori from '../screens/Master/MasterKategori';
import MasterKategoriCreate from '../screens/Master/MasterKategoriCreate';
import MasterKategoriEdit from '../screens/Master/MasterKategoriEdit';
import MasterSatuan from '../screens/Master/MasterSatuan';
import MasterSatuanCreate from '../screens/Master/MasterSatuanCreate';
import MasterSatuanEdit from '../screens/Master/MasterSatuanEdit';
import MasterPayment from '../screens/Master/MasterPayment';
import MasterPaymentCreate from '../screens/Master/MasterPaymentCreate';
import MasterPaymentEdit from '../screens/Master/MasterPaymentEdit';

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
      <Stack.Screen name="MasterPemasok" component={MasterPemasok} />
      <Stack.Screen
        name="MasterPemasokCreate"
        component={MasterPemasokCreate}
      />
      <Stack.Screen name="MasterPemasokEdit" component={MasterPemasokEdit} />
      <Stack.Screen name="MasterKategori" component={MasterKategori} />
      <Stack.Screen
        name="MasterKategoriCreate"
        component={MasterKategoriCreate}
      />
      <Stack.Screen name="MasterKategoriEdit" component={MasterKategoriEdit} />
      <Stack.Screen name="MasterSatuan" component={MasterSatuan} />
      <Stack.Screen name="MasterSatuanCreate" component={MasterSatuanCreate} />
      <Stack.Screen name="MasterSatuanEdit" component={MasterSatuanEdit} />
      <Stack.Screen name="MasterPayment" component={MasterPayment} />
      <Stack.Screen
        name="MasterPaymentCreate"
        component={MasterPaymentCreate}
      />
      <Stack.Screen name="MasterPaymentEdit" component={MasterPaymentEdit} />
    </Stack.Navigator>
  );
}
