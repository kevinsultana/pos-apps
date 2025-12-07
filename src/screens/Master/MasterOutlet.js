import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AppLayout from '../../components/AppLayout';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ButtonBack from '../../components/ButtonBack';
import BaseApi from '../../api/BaseApi';
import { useAuth } from '../../context/AuthContext';
import { toastError } from '../../utils/toast';

const PRIMARY = '#1E88E5';

export default function MasterOutlet({ navigation, route }) {
  const { getApiConfig, companyId } = useAuth();
  const [outlets, setOutlets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchOutlets();
    }, [companyId]),
  );

  const fetchOutlets = async () => {
    try {
      setLoading(true);
      const response = await BaseApi.get('/outlets', getApiConfig());

      if (response.data?.success) {
        setOutlets(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching outlets:', error);
      toastError('Gagal memuat data outlet');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOutlets();
    setRefreshing(false);
  };

  const addOutlet = payload => {
    const id = `OUT-${String(outlets.length + 1).padStart(3, '0')}`;
    setOutlets(prev => [...prev, { id, ...payload }]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[styles.thumb, { backgroundColor: '#e3f2fd' }]}>
          <Icon name="storefront" size={20} color="#1565C0" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.desc} numberOfLines={1}>
            {item.address}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <AppLayout navigation={navigation} route={route}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <ButtonBack onPress={() => navigation.goBack()} type="large" />
          <Text style={styles.title}>Outlet</Text>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() =>
              navigation.navigate('MasterOutletCreate', {
                onSave: addOutlet,
              })
            }
          >
            <Icon name="plus" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {loading && outlets.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={PRIMARY} />
          </View>
        ) : (
          <FlatList
            data={outlets}
            keyExtractor={item => String(item.id)}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            refreshing={refreshing}
            onRefresh={onRefresh}
            ListEmptyComponent={
              !loading ? (
                <View style={styles.emptyContainer}>
                  <Icon name="store" size={64} color="#cbd5e1" />
                  <Text style={styles.emptyText}>Tidak ada data outlet</Text>
                  <Text style={styles.emptySubtext}>
                    Tap tombol + untuk menambah outlet baru
                  </Text>
                </View>
              ) : null
            }
          />
        )}
      </View>
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f6fb', padding: 20 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
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
