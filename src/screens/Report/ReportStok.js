import React, { useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import AppLayout from '../../components/AppLayout';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const PRIMARY = '#1E88E5';

const toDate = s => new Date(s);
const inRange = (dateStr, from, to) => {
  const d = toDate(dateStr);
  if (from && d < toDate(from)) return false;
  if (to && d > toDate(to)) return false;
  return true;
};

export default function ReportStok({ navigation, route }) {
  const [filterVisible, setFilterVisible] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDateStr, setToDateStr] = useState('');

  const moves = [
    {
      id: 'MV-001',
      date: '2025-11-26',
      product: 'Indomie Goreng',
      type: 'IN',
      qty: 100,
    },
    {
      id: 'MV-002',
      date: '2025-11-27',
      product: 'Aqua 600ml',
      type: 'OUT',
      qty: 30,
    },
    {
      id: 'MV-003',
      date: '2025-11-28',
      product: 'Gulaku 1kg',
      type: 'IN',
      qty: 50,
    },
    {
      id: 'MV-004',
      date: '2025-11-29',
      product: 'Aqua 600ml',
      type: 'OUT',
      qty: 20,
    },
  ];

  const filtered = useMemo(
    () =>
      moves.filter(m => inRange(m.date, fromDate || null, toDateStr || null)),
    [fromDate, toDateStr],
  );
  const totalIn = filtered
    .filter(m => m.type === 'IN')
    .reduce((s, m) => s + m.qty, 0);
  const totalOut = filtered
    .filter(m => m.type === 'OUT')
    .reduce((s, m) => s + m.qty, 0);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.rowBetween}>
        <Text style={styles.code}>{item.id}</Text>
        <Text style={styles.date}>{item.date}</Text>
      </View>
      <Text style={styles.name}>{item.product}</Text>
      <View style={styles.rowBetween}>
        <View
          style={[
            styles.badge,
            item.type === 'IN' ? styles.badgeIn : styles.badgeOut,
          ]}
        >
          <Text style={styles.badgeText}>{item.type}</Text>
        </View>
        <Text style={styles.qty}>Qty: {item.qty}</Text>
      </View>
    </View>
  );

  return (
    <AppLayout navigation={navigation} route={route}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Laporan Pergerakan Stok</Text>
          <TouchableOpacity
            style={styles.filterBtn}
            onPress={() => setFilterVisible(true)}
          >
            <Icon name="filter-variant" size={18} color="#fff" />
            <Text style={styles.filterText}>Filter Tanggal</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Masuk</Text>
            <Text style={styles.summaryValue}>{totalIn}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Keluar</Text>
            <Text style={styles.summaryValue}>{totalOut}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Saldo</Text>
            <Text style={styles.summaryValue}>{totalIn - totalOut}</Text>
          </View>
        </View>

        <FlatList
          data={filtered}
          keyExtractor={i => i.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 24 }}
        />

        <Modal
          visible={filterVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setFilterVisible(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Filter Tanggal</Text>
              <View style={styles.field}>
                <Text style={styles.label}>Dari Tanggal (YYYY-MM-DD)</Text>
                <TextInput
                  value={fromDate}
                  onChangeText={setFromDate}
                  placeholder="2025-11-26"
                  style={styles.input}
                  placeholderTextColor="#94a3b8"
                />
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Sampai Tanggal (YYYY-MM-DD)</Text>
                <TextInput
                  value={toDateStr}
                  onChangeText={setToDateStr}
                  placeholder="2025-11-29"
                  style={styles.input}
                  placeholderTextColor="#94a3b8"
                />
              </View>
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.btn, styles.btnCancel]}
                  onPress={() => setFilterVisible(false)}
                >
                  <Text style={styles.btnCancelText}>Batal</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btn, styles.btnApply]}
                  onPress={() => setFilterVisible(false)}
                >
                  <Text style={styles.btnApplyText}>Terapkan</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: PRIMARY,
    paddingHorizontal: 12,
    height: 40,
    borderRadius: 8,
  },
  filterText: { color: '#fff', fontWeight: '600' },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e6eef8',
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryItem: { flex: 1, alignItems: 'center' },
  divider: { width: 1, height: 32, backgroundColor: '#e6eef8' },
  summaryLabel: { color: '#64748b', fontSize: 12 },
  summaryValue: { color: '#0f172a', fontWeight: '700', marginTop: 4 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e6eef8',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  code: { fontWeight: '700', color: '#0f172a' },
  date: { color: '#64748b' },
  name: { color: '#0f172a', fontWeight: '600', marginTop: 8 },
  qty: { color: '#0f172a', fontWeight: '700' },
  badge: {
    paddingHorizontal: 10,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeIn: { backgroundColor: '#e8f5e9' },
  badgeOut: { backgroundColor: '#ffebee' },
  badgeText: { fontSize: 12, fontWeight: '700', color: '#334155' },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    width: 420,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 12,
  },
  field: { marginBottom: 12 },
  label: { fontSize: 12, color: '#334155', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 8 },
  btn: {
    flex: 1,
    height: 42,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnCancel: { backgroundColor: '#f1f5f9' },
  btnCancelText: { color: '#64748b', fontWeight: '600' },
  btnApply: { backgroundColor: PRIMARY },
  btnApplyText: { color: '#fff', fontWeight: '600' },
});
