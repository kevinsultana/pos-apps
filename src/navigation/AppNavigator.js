import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
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
import ReportScreen from '../screens/ReportScreen';
import ReportPenjualan from '../screens/Report/ReportPenjualan';
import ReportStok from '../screens/Report/ReportStok';
import ReportPengeluaran from '../screens/Report/ReportPengeluaran';
import ReportPiutang from '../screens/Report/ReportPiutang';
import SalesScreen from '../screens/SalesScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { isLoading, isAuthenticated } = useAuth();

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>POS</Text>
        </View>
        <ActivityIndicator
          size="large"
          color="#1E88E5"
          style={styles.spinner}
        />
        <Text style={styles.loadingText}>Memuat aplikasi...</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={isAuthenticated ? 'Home' : 'Login'}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Pos" component={PosScreen} />
      <Stack.Screen name="Sales" component={SalesScreen} />
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
      <Stack.Screen name="Report" component={ReportScreen} />
      <Stack.Screen name="ReportPenjualan" component={ReportPenjualan} />
      <Stack.Screen name="ReportStok" component={ReportStok} />
      <Stack.Screen name="ReportPengeluaran" component={ReportPengeluaran} />
      <Stack.Screen name="ReportPiutang" component={ReportPiutang} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f6fb',
  },
  logoCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#1E88E5',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 6,
    marginBottom: 24,
  },
  logoText: {
    color: 'white',
    fontSize: 28,
    fontWeight: '700',
  },
  spinner: {
    marginVertical: 16,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
});
