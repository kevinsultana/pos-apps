import React, { useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import AppLayout from '../../components/AppLayout';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ModalCamera from '../../components/ModalCamera';

const PRIMARY = '#1E88E5';
const CARD_BG = '#ffffff';

const sampleProducts = [
  {
    id: 'SKU-001',
    name: 'Indomie Goreng',
    variant: 'Original 85g',
    sku: 'SKU-001',
    barcode: '8992718850012',
    category: 'Mie Instan',
    supplier: 'PT Indofood CBP',
    stock: 124,
    unit: 'pcs',
    priceSell: 3800,
    priceBuy: 3200,
  },
  {
    id: 'SKU-002',
    name: 'Teh Botol Sosro',
    variant: 'Botol 350ml',
    sku: 'SKU-002',
    barcode: '8996001600042',
    category: 'Minuman',
    supplier: 'Sinar Sosro',
    stock: 56,
    unit: 'btl',
    priceSell: 5000,
    priceBuy: 4200,
  },
  {
    id: 'SKU-003',
    name: 'Gulaku',
    variant: 'Putih 1kg',
    sku: 'SKU-003',
    barcode: '8991234567890',
    category: 'Bahan Pokok',
    supplier: 'Gulaku',
    stock: 28,
    unit: 'sak',
    priceSell: 14500,
    priceBuy: 13000,
  },
  {
    id: 'SKU-004',
    name: 'Kopi Kapal Api',
    variant: 'Special 165g',
    sku: 'SKU-004',
    barcode: '8991002100165',
    category: 'Kopi',
    supplier: 'PT Santos Jaya Abadi',
    stock: 73,
    unit: 'pcs',
    priceSell: 17000,
    priceBuy: 15000,
  },
];

export default function MasterProduct({ navigation, route }) {
  const [query, setQuery] = useState('');
  const [showCam, setShowCam] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sampleProducts;
    return sampleProducts.filter(p =>
      [p.name, p.variant, p.sku, p.barcode, p.category, p.supplier]
        .filter(Boolean)
        .some(v => String(v).toLowerCase().includes(q)),
    );
  }, [query]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[styles.thumb, { backgroundColor: '#e8f2fe' }]}>
          <Icon name="cube-outline" size={20} color={PRIMARY} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.variant}>{item.variant}</Text>
          <View style={styles.metaRow}>
            <View style={styles.badgeNeutral}>
              <Icon name="barcode" color="#64748b" size={12} />
              <Text style={styles.badgeNeutralText}>{item.barcode}</Text>
            </View>
            <View style={styles.dot} />
            <Text style={styles.metaText}>{item.category}</Text>
            <View style={styles.dot} />
            <Text style={styles.metaText}>SKU {item.sku}</Text>
          </View>
        </View>
        <View style={styles.stockBox}>
          <Text style={styles.stockVal}>{item.stock}</Text>
          <Text style={styles.stockUnit}>{item.unit}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.cardFooter}>
        <View style={styles.priceGroup}>
          <View style={styles.pricePillSell}>
            <Text style={styles.pricePillLabel}>Harga Jual</Text>
            <Text style={styles.pricePillValue}>
              Rp {formatPrice(item.priceSell)}
            </Text>
          </View>
          <View style={styles.pricePillBuy}>
            <Text style={styles.pricePillLabel}>Harga Beli</Text>
            <Text style={styles.pricePillValue}>
              Rp {formatPrice(item.priceBuy)}
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

  return (
    <AppLayout navigation={navigation} route={route}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
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
        </View>

        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />

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
});
