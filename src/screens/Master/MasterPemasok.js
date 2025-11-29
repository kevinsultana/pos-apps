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

export default function MasterPemasok({ navigation, route }) {
  const [suppliers, setSuppliers] = useState([
    { id: 'SUP-001', name: 'PT Indofood CBP', phone: '02112345678' },
    { id: 'SUP-002', name: 'Sinar Sosro', phone: '02187654321' },
    { id: 'SUP-003', name: 'PT Santos Jaya Abadi', phone: '02198765432' },
  ]);

  const addSupplier = payload => {
    const id = `SUP-${String(suppliers.length + 1).padStart(3, '0')}`;
    setSuppliers(prev => [...prev, { id, ...payload }]);
  };

  const updateSupplier = updated => {
    setSuppliers(prev => prev.map(s => (s.id === updated.id ? updated : s)));
  };

  const deleteSupplier = id => {
    setSuppliers(prev => prev.filter(s => s.id !== id));
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[styles.thumb, { backgroundColor: '#fff3e0' }]}>
          <Icon name="truck-delivery" size={20} color="#FF9800" />
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
              navigation.navigate('MasterPemasokEdit', {
                supplier: item,
                onUpdate: updateSupplier,
                onDelete: deleteSupplier,
              })
            }
          >
            <Icon name="pencil" size={20} color="#64748b" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => deleteSupplier(item.id)}
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
          <Text style={styles.title}>Pemasok</Text>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() =>
              navigation.navigate('MasterPemasokCreate', {
                onSave: addSupplier,
              })
            }
          >
            <Icon name="truck-plus" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={suppliers}
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
