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

export default function MasterGudang({ navigation, route }) {
  const { getApiConfig, companyId } = useAuth();
  const [gudangList, setGudangList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchGudang();
    }, [companyId]),
  );

  const fetchGudang = async () => {
    try {
      setLoading(true);
      const response = await BaseApi.get(
        '/warehouses',
        getApiConfig({
          params: { company_id: companyId },
        }),
      );
      if (response.data.success) {
        setGudangList(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching gudang:', error);
      toastError('Gagal memuat data gudang');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchGudang();
    setRefreshing(false);
  };

  const renderGudangItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.iconContainer}>
          <Icon name="warehouse" size={24} color="#FF6F00" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.gudangName}>{item.name}</Text>
          <Text style={styles.gudangCode}>{item.code || '-'}</Text>
          {item.address && (
            <Text style={styles.gudangAddr} numberOfLines={1}>
              {item.address}
            </Text>
          )}
        </View>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Icon name="inbox-outline" size={64} color="#cbd5e1" />
      <Text style={styles.emptyText}>Tidak ada data gudang</Text>
      <Text style={styles.emptySubtext}>
        Tap tombol + untuk menambah gudang baru
      </Text>
    </View>
  );

  if (loading && gudangList.length === 0) {
    return (
      <AppLayout navigation={navigation} route={route}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6F00" />
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
            <Text style={styles.pageTitle}>Master Gudang</Text>
            <Text style={styles.pageSubtitle}>
              Kelola data gudang penyimpanan
            </Text>
          </View>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => navigation.navigate('MasterGudangCreate')}
          >
            <Icon name="plus" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {gudangList.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={gudangList}
            renderItem={renderGudangItem}
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
    backgroundColor: '#FF6F00',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF6F00',
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
    backgroundColor: '#fff3e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  gudangName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
  },
  gudangCode: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  gudangAddr: {
    fontSize: 12,
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
