import React, { useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import AppLayout from '../../components/AppLayout';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ButtonBack from '../../components/ButtonBack';

const PRIMARY = '#1E88E5';

export default function MasterPelanggan({ navigation, route }) {
  const [customers, setCustomers] = useState([
    { id: 'CUST-001', name: 'Budi Santoso', phone: '081234567890' },
    { id: 'CUST-002', name: 'Siti Aisyah', phone: '081298765432' },
    { id: 'CUST-003', name: 'Andi Wijaya', phone: '085712345678' },
  ]);

  const addCustomer = payload => {
    const id = `CUST-${String(customers.length + 1).padStart(3, '0')}`;
    setCustomers(prev => [...prev, { id, ...payload }]);
  };

  const updateCustomer = updated => {
    setCustomers(prev => prev.map(c => (c.id === updated.id ? updated : c)));
  };

  const deleteCustomer = id => {
    setCustomers(prev => prev.filter(c => c.id !== id));
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[styles.thumb, { backgroundColor: '#e8f2fe' }]}>
          <Icon name="account" size={20} color={PRIMARY} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{item.name}</Text>
          <View style={styles.metaRow}>
            <Icon name="phone" color="#64748b" size={14} />
            <Text style={styles.metaText}>{item.phone}</Text>
          </View>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() =>
              navigation.navigate('MasterPelangganEdit', {
                customer: item,
                onUpdate: updateCustomer,
                onDelete: deleteCustomer,
              })
            }
          >
            <Icon name="pencil" size={20} color="#64748b" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => deleteCustomer(item.id)}
          >
            <Icon name="trash-can" size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <AppLayout navigation={navigation} route={route}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <ButtonBack onPress={() => navigation.goBack()} type="large" />
          <Text style={styles.title}>Pelanggan</Text>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() =>
              navigation.navigate('MasterPelangganCreate', {
                onSave: addCustomer,
              })
            }
          >
            <Icon name="account-plus" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={customers}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f6fb', padding: 20 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: { fontSize: 18, fontWeight: '700', color: '#0f172a' },
  addBtn: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  listContent: { paddingBottom: 24 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e6eef8',
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  thumb: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  name: { fontSize: 16, fontWeight: '700', color: '#0f172a' },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 6 },
  metaText: { color: '#64748b', fontSize: 12 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconBtn: { padding: 6 },
});
