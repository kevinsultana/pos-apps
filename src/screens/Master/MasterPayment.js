import React, { useState } from 'react';
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

export default function MasterPayment({ navigation, route }) {
  const [payments, setPayments] = useState([
    { id: 'PAY-001', name: 'Tunai', description: 'Pembayaran cash' },
    {
      id: 'PAY-002',
      name: 'Transfer Bank',
      description: 'Transfer via mobile banking',
    },
    { id: 'PAY-003', name: 'QRIS', description: 'Scan QRIS' },
    { id: 'PAY-004', name: 'Debit Card', description: 'Kartu debit/ATM' },
    { id: 'PAY-005', name: 'Kredit', description: 'Pembayaran tempo' },
  ]);

  const addPayment = payload => {
    const id = `PAY-${String(payments.length + 1).padStart(3, '0')}`;
    setPayments(prev => [...prev, { id, ...payload }]);
  };

  const updatePayment = updated => {
    setPayments(prev => prev.map(p => (p.id === updated.id ? updated : p)));
  };

  const deletePayment = id => {
    setPayments(prev => prev.filter(p => p.id !== id));
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[styles.thumb, { backgroundColor: '#ffebee' }]}>
          <Icon name="credit-card-multiple" size={20} color="#F44336" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.desc} numberOfLines={1}>
            {item.description}
          </Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() =>
              navigation.navigate('MasterPaymentEdit', {
                payment: item,
                onUpdate: updatePayment,
                onDelete: deletePayment,
              })
            }
          >
            <Icon name="pencil" size={20} color="#64748b" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => deletePayment(item.id)}
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
          <Text style={styles.title}>Jenis Pembayaran</Text>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() =>
              navigation.navigate('MasterPaymentCreate', {
                onSave: addPayment,
              })
            }
          >
            <Icon name="credit-card-plus" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={payments}
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
  desc: { color: '#64748b', fontSize: 12, marginTop: 4 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconBtn: { padding: 6 },
});
