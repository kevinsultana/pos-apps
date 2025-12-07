import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AppLayout from '../../components/AppLayout';
import BaseApi from '../../api/BaseApi';
import { useAuth } from '../../context/AuthContext';
import { toastError, toastSuccess } from '../../utils/toast';
import ButtonBack from '../../components/ButtonBack';

export default function MasterStok({ navigation, route }) {
  const { getApiConfig, companyId } = useAuth();
  const [stokList, setStokList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchStok();
    }, [companyId]),
  );

  const fetchStok = async () => {
    try {
      setLoading(true);
      const response = await BaseApi.get(
        '/stocks',
        getApiConfig({
          params: { company_id: companyId },
        }),
      );
      if (response.data.success) {
        setStokList(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching stok:', error);
      toastError('Gagal memuat data stok');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStok();
    setRefreshing(false);
  };

  const renderStokItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.iconContainer}>
          <Icon name="package-multiple" size={24} color="#7CB342" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.stokName}>{item.product_name || 'Produk'}</Text>
          <View style={styles.detailRow}>
            <Text style={styles.stokDetail}>
              Gudang: {item.warehouse_name || '-'}
            </Text>
            <Text style={styles.stokDetail}>Qty: {item.quantity || 0}</Text>
          </View>
          {item.unit && <Text style={styles.stokUnit}>{item.unit}</Text>}
        </View>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Icon name="inbox-outline" size={64} color="#cbd5e1" />
      <Text style={styles.emptyText}>Tidak ada data stok</Text>
      <Text style={styles.emptySubtext}>
        Tap tombol + untuk menambah stok baru
      </Text>
    </View>
  );

  if (loading && stokList.length === 0) {
    return (
      <AppLayout navigation={navigation} route={route}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#7CB342" />
        </View>
      </AppLayout>
    );
  }

  return (
    <AppLayout navigation={navigation} route={route}>
      <View style={styles.container}>
        <View style={styles.header}>
          <ButtonBack onPress={() => navigation.goBack()} type="large" />
          <View style={styles.headerCenter}>
            <Text style={styles.pageTitle}>Master Stok</Text>
            <Text style={styles.pageSubtitle}>Kelola data stok produk</Text>
          </View>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => navigation.navigate('MasterStokCreate')}
          >
            <Icon name="plus" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {stokList.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={stokList}
            renderItem={renderStokItem}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            onRefresh={onRefresh}
            refreshing={refreshing}
          />
        )}
      </View>
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f6fb',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f6fb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerCenter: {
    flex: 1,
    marginHorizontal: 12,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 13,
    color: '#64748b',
  },
  addBtn: {
    backgroundColor: '#7CB342',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#7CB342',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#f1f5e9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  stokName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  stokDetail: {
    fontSize: 12,
    color: '#64748b',
    marginRight: 12,
  },
  stokUnit: {
    fontSize: 11,
    color: '#94a3b8',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 60,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginTop: 12,
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 13,
    color: '#64748b',
  },
});
