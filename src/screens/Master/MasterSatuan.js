import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AppLayout from '../../components/AppLayout';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ButtonBack from '../../components/ButtonBack';
import BaseApi from '../../api/BaseApi';
import { useAuth } from '../../context/AuthContext';
import { toastError } from '../../utils/toast';

const PRIMARY = '#1E88E5';

export default function MasterSatuan({ navigation, route }) {
  const { getApiConfig, companyId } = useAuth();
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchUnits();
    }, [companyId]),
  );

  const fetchUnits = async () => {
    try {
      setLoading(true);
      const response = await BaseApi.get('/units', getApiConfig());

      if (response.data?.success) {
        setUnits(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching units:', error);
      toastError('Gagal memuat data satuan');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUnits();
    setRefreshing(false);
  };

  const addUnit = () => {
    fetchUnits(); // Refresh data after adding new unit
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
            <Text style={styles.metaText}>{item.short_name}</Text>
          </View>
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
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            !loading ? (
              <View style={styles.emptyContainer}>
                <Icon name="scale-balance" size={64} color="#cbd5e1" />
                <Text style={styles.emptyTitle}>Belum ada satuan</Text>
                <Text style={styles.emptySubtitle}>
                  Tambahkan satuan produk pertama Anda
                </Text>
                <TouchableOpacity
                  style={styles.emptyBtn}
                  onPress={() =>
                    navigation.navigate('MasterSatuanCreate', {
                      onSave: addUnit,
                    })
                  }
                >
                  <Icon name="plus" size={20} color="#fff" />
                  <Text style={styles.emptyBtnText}>Tambah Satuan</Text>
                </TouchableOpacity>
              </View>
            ) : null
          }
        />

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={PRIMARY} />
            <Text style={styles.loadingText}>Memuat satuan...</Text>
          </View>
        )}
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PRIMARY,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 24,
    elevation: 3,
  },
  emptyBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#64748b',
  },
});
