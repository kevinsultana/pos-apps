import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React from 'react';
import AppLayout from '../components/AppLayout';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const PRIMARY = '#1E88E5';

export default function MasterScreen({ navigation, route }) {
  const masterMenus = [
    {
      id: '1',
      title: 'Produk',
      icon: 'package-variant',
      color: '#4CAF50',
      onPress: () => navigation.navigate('MasterProduct'),
    },
    {
      id: '2',
      title: 'Pelanggan',
      icon: 'account-group',
      color: '#2196F3',
      onPress: () => navigation.navigate('MasterPelanggan'),
    },
    {
      id: '3',
      title: 'Pemasok',
      icon: 'truck-delivery',
      color: '#FF9800',
      onPress: () => navigation.navigate('MasterPemasok'),
    },
    {
      id: '4',
      title: 'Kategori',
      icon: 'tag-multiple',
      color: '#9C27B0',
      onPress: () => navigation.navigate('MasterKategori'),
    },
    {
      id: '5',
      title: 'Satuan',
      icon: 'scale-balance',
      color: '#00BCD4',
      onPress: () => navigation.navigate('MasterSatuan'),
    },
    {
      id: '6',
      title: 'Jenis Pembayaran',
      icon: 'credit-card-multiple',
      color: '#F44336',
      onPress: () => navigation.navigate('MasterPayment'),
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
          <Text style={styles.pageTitle}>Master Data</Text>
          <Text style={styles.pageSubtitle}>Kelola data master sistem</Text>
        </View>

        <FlatList
          data={masterMenus}
          renderItem={renderMenuItem}
          keyExtractor={item => item.id}
          numColumns={5}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.row}
        />
      </View>
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f6fb',
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  grid: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'flex-start',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    width: 160,
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
