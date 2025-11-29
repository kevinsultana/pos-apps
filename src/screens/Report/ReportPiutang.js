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

export default function ReportPiutang({ navigation, route }) {
  const [filterVisible, setFilterVisible] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDateStr, setToDateStr] = useState('');

  const receivables = [
    {
      id: 'AR-001',
      date: '2025-11-26',
      customer: 'PT Maju Jaya',
      invoice: 'INV-001',
      total: 500000,
      paid: 200000,
    },
    {
      id: 'AR-002',
      date: '2025-11-27',
      customer: 'Toko Sukses',
      invoice: 'INV-002',
      total: 300000,
      paid: 300000,
    },
    {
      id: 'AR-003',
      date: '2025-11-28',
      customer: 'CV Sentosa',
      invoice: 'INV-003',
      total: 450000,
      paid: 150000,
    },
    {
      id: 'AR-004',
      date: '2025-11-29',
      customer: 'Budi',
      invoice: 'INV-004',
      total: 200000,
      paid: 0,
    },
  ];

  const filtered = useMemo(
    () =>
      receivables.filter(r =>
        inRange(r.date, fromDate || null, toDateStr || null),
      ),
    [fromDate, toDateStr],
  );
  const totalOutstanding = filtered.reduce(
    (sum, r) => sum + (r.total - r.paid),
    0,
  );
  const totalOpen = filtered.filter(r => r.total - r.paid > 0).length;

  const renderItem = ({ item }) => {
    const outstanding = item.total - item.paid;
    const paidOff = outstanding <= 0;
    return (
      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <Text style={styles.code}>{item.invoice}</Text>
          <Text style={styles.date}>{item.date}</Text>
        </View>
        <View style={styles.metaRow}>
          <Icon name="account" size={16} color="#64748b" />
          <Text style={styles.metaText}>{item.customer}</Text>
        </View>
        <View style={styles.rowBetween}>
          <Text style={styles.metaText}>
            Total: Rp {new Intl.NumberFormat('id-ID').format(item.total)}
          </Text>
          <Text style={styles.metaText}>
            Terbayar: Rp {new Intl.NumberFormat('id-ID').format(item.paid)}
          </Text>
        </View>
        <View style={styles.rowBetween}>
          <View
            style={[
              styles.badge,
              paidOff ? styles.badgePaid : styles.badgeOpen,
            ]}
          >
            <Text style={styles.badgeText}>
              {paidOff ? 'Lunas' : 'Belum Lunas'}
            </Text>
          </View>
          <Text style={[styles.total, !paidOff && { color: '#ef4444' }]}>
            Sisa: Rp {new Intl.NumberFormat('id-ID').format(outstanding)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <AppLayout navigation={navigation} route={route}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Laporan Piutang</Text>
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
            <Text style={styles.summaryLabel}>Open</Text>
            <Text style={styles.summaryValue}>{totalOpen}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Sisa</Text>
            <Text style={styles.summaryValue}>
              Rp {new Intl.NumberFormat('id-ID').format(totalOutstanding)}
            </Text>
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
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  metaText: { color: '#64748b' },
  total: { color: '#0f172a', fontWeight: '700' },
  badge: {
    paddingHorizontal: 10,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgePaid: { backgroundColor: '#e0f7fa' },
  badgeOpen: { backgroundColor: '#fff3e0' },
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
