import React, { useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import AppLayout from '../components/AppLayout';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Standar field daftar penjualan harian POS (dummy):
// id, invoice, date, time, itemsCount, subtotal, tax, discount, total, paymentMethod, status, cashier, customer

const dummySales = [
  {
    id: 1,
    invoice: 'INV-20251129-001',
    date: '2025-11-29',
    time: '08:15',
    itemsCount: 4,
    subtotal: 52000,
    tax: 5200,
    discount: 2000,
    total: 55200,
    paymentMethod: 'Cash',
    status: 'Paid',
    cashier: 'Admin',
    customer: 'Walk-in',
  },
  {
    id: 2,
    invoice: 'INV-20251129-002',
    date: '2025-11-29',
    time: '09:02',
    itemsCount: 2,
    subtotal: 18000,
    tax: 1800,
    discount: 0,
    total: 19800,
    paymentMethod: 'QRIS',
    status: 'Paid',
    cashier: 'Sari',
    customer: 'Walk-in',
  },
  {
    id: 3,
    invoice: 'INV-20251129-003',
    date: '2025-11-29',
    time: '09:27',
    itemsCount: 6,
    subtotal: 93000,
    tax: 9300,
    discount: 5000,
    total: 97300,
    paymentMethod: 'Debit',
    status: 'Paid',
    cashier: 'Admin',
    customer: 'Bpk Andi',
  },
  {
    id: 4,
    invoice: 'INV-20251129-004',
    date: '2025-11-29',
    time: '10:11',
    itemsCount: 1,
    subtotal: 15000,
    tax: 1500,
    discount: 0,
    total: 16500,
    paymentMethod: 'Cash',
    status: 'Refunded',
    cashier: 'Sari',
    customer: 'Walk-in',
  },
  {
    id: 5,
    invoice: 'INV-20251129-005',
    date: '2025-11-29',
    time: '10:43',
    itemsCount: 3,
    subtotal: 34000,
    tax: 3400,
    discount: 4000,
    total: 33400,
    paymentMethod: 'QRIS',
    status: 'Paid',
    cashier: 'Admin',
    customer: 'Ibu Rina',
  },
];

export default function SalesScreen({ navigation, route }) {
  const [selectedDate, setSelectedDate] = useState('2025-11-29'); // default: today (dummy)
  const [searchText, setSearchText] = useState('');

  // Filter by date & search
  const filteredSales = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    return dummySales.filter(sale => {
      const dateMatch = sale.date === selectedDate;
      const searchMatch = !q
        ? true
        : [sale.invoice, sale.customer, sale.cashier, sale.paymentMethod]
            .filter(Boolean)
            .some(v => String(v).toLowerCase().includes(q));
      return dateMatch && searchMatch;
    });
  }, [selectedDate, searchText]);

  // Summary metrics
  const summary = useMemo(() => {
    const orders = filteredSales.length;
    const gross = filteredSales.reduce((sum, s) => sum + s.subtotal, 0);
    const taxTotal = filteredSales.reduce((sum, s) => sum + s.tax, 0);
    const discountTotal = filteredSales.reduce((sum, s) => sum + s.discount, 0);
    const net = filteredSales.reduce((sum, s) => sum + s.total, 0);
    const avg = orders > 0 ? Math.round(net / orders) : 0;
    return { orders, gross, net, avg, taxTotal, discountTotal };
  }, [filteredSales]);

  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d.toISOString().slice(0, 10));
  };
  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d.toISOString().slice(0, 10));
  };

  const renderSaleItem = ({ item }) => {
    const statusStyle =
      item.status === 'Paid'
        ? styles.statusPaid
        : item.status === 'Refunded'
        ? styles.statusRefunded
        : styles.statusPending;
    return (
      <TouchableOpacity
        style={styles.saleRow}
        onPress={() => {
          /* placeholder detail navigation */
        }}
        activeOpacity={0.85}
      >
        <View style={styles.saleLeft}>
          <Text style={styles.invoice}>{item.invoice}</Text>
          <View style={styles.metaLine}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={hp(1.8)}
              color="#666"
            />
            <Text style={styles.metaText}>{item.time}</Text>
            <Ionicons name="cube-outline" size={hp(1.8)} color="#666" />
            <Text style={styles.metaText}>{item.itemsCount} items</Text>
            <Ionicons name="person-outline" size={hp(1.8)} color="#666" />
            <Text style={styles.metaText}>{item.cashier}</Text>
          </View>
        </View>
        <View style={styles.saleRight}>
          <Text style={styles.totalValue}>
            Rp {item.total.toLocaleString('id-ID')}
          </Text>
          <View style={styles.badges}>
            <View style={[styles.statusBadge, statusStyle]}>
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
            <View style={styles.methodBadge}>
              <Text style={styles.methodText}>{item.paymentMethod}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <AppLayout navigation={navigation} route={route}>
      <View style={styles.container}>
        {/* Date & Search Controls */}
        <View style={styles.controls}>
          <View style={styles.dateSwitcher}>
            <TouchableOpacity onPress={handlePrevDay} style={styles.navDateBtn}>
              <Ionicons name="chevron-back" size={hp(2.4)} color="#2196F3" />
            </TouchableOpacity>
            <View style={styles.dateDisplay}>
              <Ionicons name="calendar" size={hp(2.1)} color="#666" />
              <Text style={styles.dateText}>{selectedDate}</Text>
            </View>
            <TouchableOpacity onPress={handleNextDay} style={styles.navDateBtn}>
              <Ionicons name="chevron-forward" size={hp(2.4)} color="#2196F3" />
            </TouchableOpacity>
          </View>
          <View style={styles.searchWrapper}>
            <Ionicons name="search" size={hp(2.2)} color="#666" />
            <TextInput
              style={styles.searchInput}
              placeholder="Cari invoice / customer / cashier / metode"
              value={searchText}
              onChangeText={setSearchText}
              placeholderTextColor="#999"
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={() => setSearchText('')}>
                <Ionicons name="close-circle" size={hp(2.2)} color="#94a3b8" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Orders</Text>
            <Text style={styles.summaryValue}>{summary.orders}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Gross</Text>
            <Text style={styles.summaryValue}>
              Rp {summary.gross.toLocaleString('id-ID')}
            </Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Net</Text>
            <Text style={styles.summaryValue}>
              Rp {summary.net.toLocaleString('id-ID')}
            </Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Avg Order</Text>
            <Text style={styles.summaryValue}>
              Rp {summary.avg.toLocaleString('id-ID')}
            </Text>
          </View>
        </View>
        <View style={styles.summaryRowExtra}>
          <View style={styles.summaryCardSmall}>
            <Text style={styles.summaryLabelSmall}>Tax</Text>
            <Text style={styles.summaryValueSmall}>
              Rp {summary.taxTotal.toLocaleString('id-ID')}
            </Text>
          </View>
          <View style={styles.summaryCardSmall}>
            <Text style={styles.summaryLabelSmall}>Discount</Text>
            <Text style={styles.summaryValueSmall}>
              Rp {summary.discountTotal.toLocaleString('id-ID')}
            </Text>
          </View>
        </View>

        {/* List */}
        <FlatList
          data={filteredSales}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <MaterialCommunityIcons
                name="receipt"
                size={hp(5)}
                color="#bbb"
              />
              <Text style={styles.emptyText}>
                Tidak ada transaksi untuk hari ini
              </Text>
            </View>
          }
          renderItem={renderSaleItem}
        />
      </View>
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa', padding: wp(2) },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
    marginBottom: hp(1.5),
    flexWrap: 'wrap',
  },
  dateSwitcher: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: hp(1),
    paddingVertical: hp(0.8),
    paddingHorizontal: wp(2),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
  },
  navDateBtn: { paddingHorizontal: wp(1), paddingVertical: hp(0.3) },
  dateDisplay: { flexDirection: 'row', alignItems: 'center', gap: wp(1.2) },
  dateText: { fontSize: hp(1.9), fontWeight: '600', color: '#333' },
  searchWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: hp(1),
    paddingHorizontal: wp(2),
    gap: wp(1),
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchInput: { flex: 1, fontSize: hp(1.9), color: '#222' },
  summaryRow: { flexDirection: 'row', gap: wp(2), marginBottom: hp(1.2) },
  summaryRowExtra: { flexDirection: 'row', gap: wp(2), marginBottom: hp(1.2) },
  summaryCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: hp(1),
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(2),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  summaryCardSmall: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: hp(1),
    paddingVertical: hp(0.9),
    paddingHorizontal: wp(2),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  summaryLabel: { fontSize: hp(1.5), color: '#64748b', fontWeight: '600' },
  summaryValue: {
    fontSize: hp(2),
    fontWeight: '700',
    color: '#0f172a',
    marginTop: hp(0.3),
  },
  summaryLabelSmall: { fontSize: hp(1.4), color: '#64748b', fontWeight: '600' },
  summaryValueSmall: {
    fontSize: hp(1.7),
    fontWeight: '700',
    color: '#0f172a',
    marginTop: hp(0.2),
  },
  listContent: { paddingBottom: hp(10), paddingTop: hp(0.5) },
  saleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(2),
    borderRadius: hp(1),
    marginBottom: hp(1),
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 2,
  },
  saleLeft: { flex: 1, paddingRight: wp(2) },
  invoice: {
    fontSize: hp(1.9),
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: hp(0.3),
  },
  metaLine: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: wp(1.2),
  },
  metaText: { fontSize: hp(1.5), color: '#475569' },
  saleRight: { alignItems: 'flex-end', justifyContent: 'center' },
  totalValue: { fontSize: hp(1.9), fontWeight: '700', color: '#0d9488' },
  badges: { flexDirection: 'row', gap: wp(1), marginTop: hp(0.5) },
  statusBadge: {
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.4),
    borderRadius: hp(2),
  },
  statusPaid: { backgroundColor: '#dcfce7' },
  statusRefunded: { backgroundColor: '#fee2e2' },
  statusPending: { backgroundColor: '#fde68a' },
  statusText: { fontSize: hp(1.3), fontWeight: '700', color: '#1e293b' },
  methodBadge: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.4),
    borderRadius: hp(2),
  },
  methodText: { fontSize: hp(1.3), fontWeight: '600', color: '#1e40af' },
  emptyWrap: { alignItems: 'center', paddingTop: hp(8) },
  emptyText: { fontSize: hp(1.8), color: '#94a3b8', marginTop: hp(1.5) },
});
