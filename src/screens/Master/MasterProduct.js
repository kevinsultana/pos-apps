import React, { useMemo, useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AppLayout from '../../components/AppLayout';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ModalCamera from '../../components/ModalCamera';
import ButtonBack from '../../components/ButtonBack';
import BaseApi from '../../api/BaseApi';
import { useAuth } from '../../context/AuthContext';
import { toastError } from '../../utils/toast';
import { widthPercentageToDP } from 'react-native-responsive-screen';

const PRIMARY = '#1E88E5';
const CARD_BG = '#ffffff';

export default function MasterProduct({ navigation, route }) {
  const { getApiConfig, companyId } = useAuth();
  const [query, setQuery] = useState('');
  const [showCam, setShowCam] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, [companyId]),
  );

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await BaseApi.get('/products', getApiConfig());

      if (response.data?.success) {
        setProducts(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toastError('Gagal memuat data produk');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Icon name="cube-outline" size={64} color="#cbd5e1" />
      <Text style={styles.emptyTitle}>
        {query ? 'Produk tidak ditemukan' : 'Belum ada produk'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {query
          ? 'Coba ubah kata kunci pencarian atau tambahkan produk baru'
          : 'Tambahkan produk pertama Anda untuk memulai'}
      </Text>
      {!query && (
        <TouchableOpacity
          style={styles.emptyBtn}
          onPress={() =>
            navigation.navigate('MasterProductCreate', {
              onSave: () => {
                fetchProducts();
              },
            })
          }
        >
          <Icon name="plus" size={20} color="#fff" />
          <Text style={styles.emptyBtnText}>Tambah Produk</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      p =>
        [p.name, p.code]
          .filter(Boolean)
          .some(v => String(v).toLowerCase().includes(q)) ||
        p.variants.some(
          v =>
            [v.name, v.sku]
              .filter(Boolean)
              .some(vv => String(vv).toLowerCase().includes(q)) ||
            v.barcodes.some(b => String(b.barcode).toLowerCase().includes(q)),
        ),
    );
  }, [query, products]);

  const renderItem = ({ item }) => {
    const firstVariant = item.variants?.[0];
    const variantCount = item.variants?.length || 0;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.thumb, { backgroundColor: '#e8f2fe' }]}>
            <Icon name="cube-outline" size={20} color={PRIMARY} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.variant}>
              {firstVariant?.name || 'No variant'} • {variantCount} variant
              {variantCount !== 1 ? 's' : ''}
            </Text>
            <View style={styles.metaRow}>
              <View style={styles.badgeNeutral}>
                <Icon name="barcode" color="#64748b" size={12} />
                <Text style={styles.badgeNeutralText}>{item.code}</Text>
              </View>
              <View style={styles.dot} />
              <Text style={styles.metaText}>
                SKU {firstVariant?.sku || 'N/A'}
              </Text>
            </View>
          </View>
          <View style={styles.stockBox}>
            <Text style={styles.stockVal}>{variantCount}</Text>
            <Text style={styles.stockUnit}>var</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.cardFooter}>
          <View style={styles.priceGroup}>
            <View style={styles.pricePillSell}>
              <Text style={styles.pricePillLabel}>Harga Jual</Text>
              <Text style={styles.pricePillValue}>
                Rp {formatPrice(firstVariant?.sellPrice || 0)}
              </Text>
            </View>
            <View style={styles.pricePillBuy}>
              <Text style={styles.pricePillLabel}>Harga Beli</Text>
              <Text style={styles.pricePillValue}>
                Rp {formatPrice(firstVariant?.costPrice || 0)}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.moreBtn}
            onPress={() => navigation.navigate('MasterProductEdit', { item })}
          >
            <Icon name="pencil" size={20} color="#64748b" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <AppLayout navigation={navigation} route={route}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <ButtonBack onPress={() => navigation.goBack()} type="large" />
          <View style={{ width: widthPercentageToDP(1) }} />
          <View style={styles.searchBox}>
            <Icon name="magnify" size={20} color="#64748b" />
            <TextInput
              style={styles.searchInput}
              placeholder="Cari produk, SKU, barcode..."
              placeholderTextColor="#9aa0a6"
              value={query}
              onChangeText={setQuery}
              returnKeyType="search"
            />
            {query.length > 0 && (
              <TouchableOpacity
                onPress={() => setQuery('')}
                style={styles.clearBtn}
              >
                <Icon name="close-circle" size={18} color="#94a3b8" />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity
            style={styles.scanBtn}
            onPress={() => setShowCam(true)}
            accessibilityLabel="Scan barcode"
          >
            <Icon name="barcode-scan" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() =>
              navigation.navigate('MasterProductCreate', {
                onSave: () => {
                  fetchProducts(); // Refresh data after adding new product
                },
              })
            }
            accessibilityLabel="Tambah produk"
          >
            <Icon name="plus" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={PRIMARY} />
            <Text style={styles.loadingText}>Memuat produk...</Text>
          </View>
        )}

        <ModalCamera
          visible={showCam}
          onClose={() => setShowCam(false)}
          onResult={code => {
            setQuery(code);
            setShowCam(false);
          }}
        />
      </View>
    </AppLayout>
  );
}

function formatPrice(n) {
  try {
    return new Intl.NumberFormat('id-ID').format(n);
  } catch (e) {
    return String(n);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f6fb',
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: '#e6eef8',
  },
  searchInput: {
    marginLeft: 8,
    flex: 1,
    color: '#0f172a',
  },
  clearBtn: {
    padding: 4,
    marginLeft: 4,
  },
  scanBtn: {
    marginLeft: 10,
    height: 44,
    width: 44,
    borderRadius: 22,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  addBtn: {
    marginLeft: 10,
    height: 44,
    width: 44,
    borderRadius: 22,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  listContent: {
    paddingBottom: 24,
  },
  card: {
    backgroundColor: CARD_BG,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e6eef8',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  thumb: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  variant: {
    marginTop: 2,
    color: '#64748b',
    fontSize: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  metaText: {
    color: '#64748b',
    fontSize: 12,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#cbd5e1',
    marginHorizontal: 8,
  },
  stockBox: {
    alignItems: 'flex-end',
    marginLeft: 10,
  },
  stockVal: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  stockUnit: {
    fontSize: 12,
    color: '#64748b',
  },
  divider: {
    height: 1,
    backgroundColor: '#eef2f7',
    marginVertical: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pricePillSell: {
    backgroundColor: '#e8f2fe',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginRight: 8,
  },
  pricePillBuy: {
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  pricePillLabel: {
    fontSize: 10,
    color: '#64748b',
  },
  pricePillValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  moreBtn: {
    padding: 6,
  },
  badgeNeutral: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeNeutralText: {
    fontSize: 11,
    color: '#64748b',
    marginLeft: 4,
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
});
