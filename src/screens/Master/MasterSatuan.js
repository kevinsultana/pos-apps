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

export default function MasterSatuan({ navigation, route }) {
  const [units, setUnits] = useState([
    { id: 'SAT-001', name: 'Pcs', symbol: 'pcs' },
    { id: 'SAT-002', name: 'Karton', symbol: 'krt' },
    { id: 'SAT-003', name: 'Lusin', symbol: 'lsn' },
    { id: 'SAT-004', name: 'Kilogram', symbol: 'kg' },
    { id: 'SAT-005', name: 'Liter', symbol: 'L' },
  ]);

  const addUnit = payload => {
    const id = `SAT-${String(units.length + 1).padStart(3, '0')}`;
    setUnits(prev => [...prev, { id, ...payload }]);
  };

  const updateUnit = updated => {
    setUnits(prev => prev.map(u => (u.id === updated.id ? updated : u)));
  };

  const deleteUnit = id => {
    setUnits(prev => prev.filter(u => u.id !== id));
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[styles.thumb, { backgroundColor: '#e0f2f1' }]}>
          <Icon name="scale-balance" size={20} color="#00BCD4" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{item.name}</Text>
          <View style={styles.metaRow}>
            <Icon name="alpha-s-circle" color="#64748b" size={14} />
            <Text style={styles.metaText}>{item.symbol}</Text>
          </View>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() =>
              navigation.navigate('MasterSatuanEdit', {
                unit: item,
                onUpdate: updateUnit,
                onDelete: deleteUnit,
              })
            }
          >
            <Icon name="pencil" size={20} color="#64748b" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => deleteUnit(item.id)}
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
          <Text style={styles.title}>Satuan Produk</Text>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() =>
              navigation.navigate('MasterSatuanCreate', {
                onSave: addUnit,
              })
            }
          >
            <Icon name="plus" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={units}
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
