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

export default function MasterKategori({ navigation, route }) {
  const [categories, setCategories] = useState([
    { id: 'KAT-001', name: 'Makanan', description: 'Produk makanan dan snack' },
    {
      id: 'KAT-002',
      name: 'Minuman',
      description: 'Minuman kemasan dan segar',
    },
    {
      id: 'KAT-003',
      name: 'Sembako',
      description: 'Kebutuhan pokok sehari-hari',
    },
    {
      id: 'KAT-004',
      name: 'Alat Tulis',
      description: 'Perlengkapan tulis dan kantor',
    },
  ]);

  const addCategory = payload => {
    const id = `KAT-${String(categories.length + 1).padStart(3, '0')}`;
    setCategories(prev => [...prev, { id, ...payload }]);
  };

  const updateCategory = updated => {
    setCategories(prev => prev.map(c => (c.id === updated.id ? updated : c)));
  };

  const deleteCategory = id => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[styles.thumb, { backgroundColor: '#f3e5f5' }]}>
          <Icon name="tag-multiple" size={20} color="#9C27B0" />
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
              navigation.navigate('MasterKategoriEdit', {
                category: item,
                onUpdate: updateCategory,
                onDelete: deleteCategory,
              })
            }
          >
            <Icon name="pencil" size={20} color="#64748b" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => deleteCategory(item.id)}
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
          <Text style={styles.title}>Kategori Produk</Text>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() =>
              navigation.navigate('MasterKategoriCreate', {
                onSave: addCategory,
              })
            }
          >
            <Icon name="tag-plus" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={categories}
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
