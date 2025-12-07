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
import { toastError } from '../../utils/toast';
import ButtonBack from '../../components/ButtonBack';

export default function MasterMerek({ navigation, route }) {
  const { getApiConfig } = useAuth();
  const [merekList, setMerekList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchMerek();
    }, []),
  );

  const fetchMerek = async () => {
    try {
      setLoading(true);
      const response = await BaseApi.get(`/brands`, getApiConfig());
      if (response.data.success) {
        setMerekList(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching merek:', error);
      toastError('Gagal memuat data merk');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMerek();
    setRefreshing(false);
  };

  const renderMerekItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.iconContainer}>
          <Icon name="trademark" size={24} color="#E91E63" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.merekName}>{item.name}</Text>
          <Text style={styles.merekCode}>{item.code || '-'}</Text>
          {item.description && (
            <Text style={styles.merekDesc} numberOfLines={1}>
              {item.description}
            </Text>
          )}
        </View>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Icon name="inbox-outline" size={64} color="#cbd5e1" />
      <Text style={styles.emptyText}>Tidak ada data merk</Text>
      <Text style={styles.emptySubtext}>
        Tap tombol + untuk menambah merk baru
      </Text>
    </View>
  );

  if (loading && merekList.length === 0) {
    return (
      <AppLayout navigation={navigation} route={route}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E91E63" />
        </View>
      </AppLayout>
    );
  }

  return (
    <AppLayout navigation={navigation} route={route}>
      <View style={styles.container}>
        <View style={styles.header}>
          <ButtonBack onPress={() => navigation.goBack()} type="large" />
          <Text style={styles.pageTitle}>Merk Produk</Text>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => navigation.navigate('MasterMerekCreate')}
          >
            <Icon name="plus" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {merekList.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={merekList}
            renderItem={renderMerekItem}
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

  pageTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a' },
  pageSubtitle: {
    fontSize: 13,
    color: '#64748b',
  },
  addBtn: {
    backgroundColor: '#E91E63',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#E91E63',
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
    backgroundColor: '#f3e5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  merekName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
  },
  merekCode: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  merekDesc: {
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
