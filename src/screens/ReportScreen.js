import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import AppLayout from '../components/AppLayout';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function ReportScreen({ navigation, route }) {
  const reportMenus = [
    {
      id: '1',
      title: 'Penjualan',
      icon: 'cart-outline',
      color: '#4CAF50',
      onPress: () => navigation.navigate('ReportPenjualan'),
    },
    {
      id: '2',
      title: 'Stok',
      icon: 'warehouse',
      color: '#2196F3',
      onPress: () => navigation.navigate('ReportStok'),
    },
    {
      id: '3',
      title: 'Pengeluaran',
      icon: 'cash-minus',
      color: '#FF9800',
      onPress: () => navigation.navigate('ReportPengeluaran'),
    },
    {
      id: '4',
      title: 'Piutang',
      icon: 'account-cash-outline',
      color: '#9C27B0',
      onPress: () => navigation.navigate('ReportPiutang'),
    },
  ];

  const renderMenuItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={item.onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
        <Icon name={item.icon} size={36} color="#fff" />
      </View>
      <Text style={styles.cardTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <AppLayout navigation={navigation} route={route}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Laporan</Text>
          <Text style={styles.pageSubtitle}>
            Pantau data penjualan, stok, dan keuangan
          </Text>
        </View>

        <FlatList
          data={reportMenus}
          renderItem={renderMenuItem}
          keyExtractor={item => item.id}
          numColumns={4}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.row}
        />
      </View>
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f6fb', padding: 20 },
  header: { marginBottom: 24 },
  pageTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  pageSubtitle: { fontSize: 14, color: '#64748b' },
  grid: { paddingBottom: 20 },
  row: { justifyContent: 'flex-start', marginBottom: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    width: 200,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 3,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    textAlign: 'center',
  },
});
