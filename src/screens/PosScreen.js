import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
  Modal,
  Pressable,
} from 'react-native';
import AppLayout from '../components/AppLayout';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useCart } from '../context/CartContext';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default function PosScreen({ navigation, route }) {
  const { cartItems, getTotal, clearCart } = useCart();
  const total = getTotal();
  const [payment, setPayment] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const numericKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '00'];

  const appendValue = val => {
    setPayment(prev => (prev === '0' ? val : prev + val));
  };
  const clearAll = () => setPayment('');
  const backspace = () => setPayment(prev => prev.slice(0, -1));

  const pay = () => {
    const payAmount = Number(payment || 0);
    if (payAmount < total) {
      setErrorMessage('Nominal belum mencukupi total.');
      setShowError(true);
      return;
    }
    const change = payAmount - total;
    setSuccessMessage(`Kembalian: Rp ${change.toLocaleString('id-ID')}`);
    setShowSuccess(true);
  };

  const changeAmount = Math.max(Number(payment || 0) - total, 0);
  const totalItems = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <AppLayout navigation={navigation} route={route} headerTitle="POS">
      <View style={styles.container}>
        <View style={styles.gridContainer}>
          {/* Left: Receipt Print Preview */}
          <View style={styles.leftPane}>
            <View style={styles.receiptPreviewWrapper}>
              <View style={styles.storeHeader}>
                <View style={styles.logoBox}>
                  <Text style={styles.logoText}>LOGO</Text>
                </View>
                <Text style={styles.storeName}>Toko Contoh Bahagia</Text>
                <Text style={styles.storeMeta}>Jl. Mawar No. 123</Text>
                <Text style={styles.storeMeta}>Telp: 0812-3456-7890</Text>
                <Text style={styles.storeMeta}>Kasir: Admin</Text>
                <Text style={styles.separator}>
                  ------------------------------
                </Text>
              </View>
              <ScrollView
                style={styles.itemsScroll}
                contentContainerStyle={styles.itemsContent}
              >
                {cartItems.length === 0 && (
                  <Text style={styles.emptyText}>Tidak ada item</Text>
                )}
                {cartItems.map(item => (
                  <View key={item.id} style={styles.receiptLine}>
                    <Text style={styles.itemName} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={styles.itemQty}>x{item.quantity}</Text>
                    <Text style={styles.itemPrice}>
                      Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                    </Text>
                  </View>
                ))}
              </ScrollView>
              <Text style={styles.separator}>
                ------------------------------
              </Text>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>
                  Rp {total.toLocaleString('id-ID')}
                </Text>
              </View>
              <View style={styles.footerMeta}>
                <Text style={styles.footerText}>Items: {totalItems}</Text>
                <Text style={styles.footerText}>Terima kasih!</Text>
              </View>
            </View>
          </View>

          {/* Right: Payment Calculator */}
          <View style={styles.rightPane}>
            <View style={styles.calcHeader}>
              <Text style={styles.calcTitle}>Payment</Text>
              <View style={styles.totalBar}>
                <Text style={styles.totalBarLabel}>TOTAL</Text>
                <Text style={styles.totalBarValue}>
                  Rp {total.toLocaleString('id-ID')}
                </Text>
              </View>
              <View style={styles.infoBar}>
                <Text style={styles.infoBarLabel}>Customer Pay</Text>
                <Text style={styles.infoBarValue}>
                  Rp {Number(payment || 0).toLocaleString('id-ID')}
                </Text>
              </View>
              <View style={[styles.infoBar, styles.changeBar]}>
                <Text style={[styles.infoBarLabel, styles.changeLabel]}>
                  Change
                </Text>
                <Text style={[styles.infoBarValue, styles.changeValueLarge]}>
                  Rp {changeAmount.toLocaleString('id-ID')}
                </Text>
              </View>
            </View>

            {/* Grid keypad for easier customization */}
            <View style={styles.keypad}>
              {/* First row: quick chips occupying 4 columns */}
              <View style={styles.gridRow4}>
                <TouchableOpacity
                  style={[styles.keyChip, styles.chipPrimary]}
                  onPress={() => setPayment(String(total))}
                >
                  <Text style={[styles.chipText, styles.chipPrimaryText]}>
                    Exact
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.keyChip}
                  onPress={() => setPayment('50000')}
                >
                  <Text style={styles.chipText}>Rp50.000</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.keyChip}
                  onPress={() => setPayment('100000')}
                >
                  <Text style={styles.chipText}>Rp100.000</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.keyChip}
                  onPress={() => setPayment('200000')}
                >
                  <Text style={styles.chipText}>Rp200.000</Text>
                </TouchableOpacity>
              </View>
              {/* Custom modal for success */}
              <Modal
                visible={showSuccess}
                transparent
                animationType="fade"
                onRequestClose={() => setShowSuccess(false)}
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.modalBox}>
                    <View style={styles.modalIconSuccess}>
                      <Ionicons name="checkmark" size={hp(3)} color="#fff" />
                    </View>
                    <Text style={styles.modalTitle}>Pembayaran Berhasil</Text>
                    <Text style={styles.modalMessage}>{successMessage}</Text>
                    <TouchableOpacity
                      style={[
                        styles.modalButton,
                        { backgroundColor: '#FF6F00' },
                      ]}
                      onPress={() => {
                        try {
                          if (typeof clearCart === 'function') clearCart();
                        } catch (e) {}
                        setPayment('');
                        setShowSuccess(false);
                        navigation.navigate('Home');
                      }}
                    >
                      <Text style={styles.modalButtonText}>OK</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>

              {/* Custom modal for error */}
              <Modal
                visible={showError}
                transparent
                animationType="fade"
                onRequestClose={() => setShowError(false)}
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.modalBox}>
                    <View style={styles.modalIconError}>
                      <Ionicons name="close" size={hp(3)} color="#fff" />
                    </View>
                    <Text style={styles.modalTitle}>Error</Text>
                    <Text style={styles.modalMessage}>{errorMessage}</Text>
                    <Pressable
                      style={[
                        styles.modalButton,
                        { backgroundColor: '#1565C0' },
                      ]}
                      onPress={() => setShowError(false)}
                    >
                      <Text style={styles.modalButtonText}>OK</Text>
                    </Pressable>
                  </View>
                </View>
              </Modal>
              <View style={styles.gridRow}>
                {['1', '2', '3'].map(k => (
                  <TouchableOpacity
                    key={k}
                    style={styles.keyLarge}
                    onPress={() => appendValue(k)}
                  >
                    <Text style={styles.keyText}>{k}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.gridRow}>
                {['4', '5', '6'].map(k => (
                  <TouchableOpacity
                    key={k}
                    style={styles.keyLarge}
                    onPress={() => appendValue(k)}
                  >
                    <Text style={styles.keyText}>{k}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.gridRow}>
                {['7', '8', '9'].map(k => (
                  <TouchableOpacity
                    key={k}
                    style={styles.keyLarge}
                    onPress={() => appendValue(k)}
                  >
                    <Text style={styles.keyText}>{k}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.gridRow}>
                <TouchableOpacity
                  style={styles.keyLarge}
                  onPress={() => appendValue('0')}
                >
                  <Text style={styles.keyText}>0</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.keyLarge}
                  onPress={() => appendValue('00')}
                >
                  <Text style={styles.keyText}>00</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.keyLarge, styles.actionKey]}
                  onPress={backspace}
                >
                  <Ionicons name="backspace" size={hp(3)} color="#fff" />
                </TouchableOpacity>
              </View>
              <View style={[styles.gridRow, { marginTop: hp(1) }]}>
                <TouchableOpacity
                  style={[styles.keyLarge, styles.clearKey]}
                  onPress={clearAll}
                >
                  <Text style={styles.keyText}>CLR</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.payButton,
                    (total === 0 || Number(payment || 0) < total) &&
                      styles.payButtonDisabled,
                  ]}
                  onPress={pay}
                  disabled={total === 0 || Number(payment || 0) < total}
                >
                  <Ionicons name="card" size={hp(3.2)} color="#fff" />
                  <Text style={styles.payText}>Bayar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, width: wp(95), backgroundColor: '#f5f5f5' },
  gridContainer: { flex: 1, flexDirection: 'row', gap: wp(1) },
  leftPane: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: hp(1),
    padding: wp(2),
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  receiptPreviewWrapper: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dcdcdc',
    paddingVertical: hp(1),
    paddingHorizontal: wp(2),
  },
  storeHeader: { alignItems: 'center', marginBottom: hp(1) },
  logoBox: {
    width: hp(7),
    height: hp(7),
    borderRadius: hp(1),
    borderWidth: 1,
    borderColor: '#999',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(0.8),
  },
  logoText: { fontSize: hp(2), fontWeight: '600', color: '#333' },
  storeName: { fontSize: hp(2.2), fontWeight: '700', color: '#111' },
  storeMeta: { fontSize: hp(1.5), color: '#555', marginTop: hp(0.2) },
  separator: {
    textAlign: 'center',
    fontSize: hp(1.4),
    color: '#222',
    marginVertical: hp(0.6),
  },
  itemsScroll: { flex: 1 },
  itemsContent: { paddingBottom: hp(1), backgroundColor: '#fff' },
  emptyText: { textAlign: 'center', color: '#777', fontSize: hp(1.6) },
  receiptLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(0.4),
  },
  itemName: {
    fontSize: hp(1.6),
    color: '#000000ff',
    marginRight: wp(1),
  },
  itemQty: {
    // width: wp(8),
    textAlign: 'center',
    fontSize: hp(1.6),
    color: '#222',
  },
  itemPrice: {
    minWidth: wp(18),
    textAlign: 'right',
    fontSize: hp(1.6),
    color: '#222',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(0.5),
  },
  totalLabel: { fontSize: hp(1.8), fontWeight: '600', color: '#000' },
  totalValue: { fontSize: hp(1.8), fontWeight: '700', color: '#000' },
  footerMeta: { marginTop: hp(0.5), alignItems: 'center', gap: hp(0.3) },
  footerText: { fontSize: hp(1.4), color: '#444' },

  rightPane: {
    flex: 2,
    backgroundColor: '#fff',
    borderRadius: hp(1),
    padding: wp(2),
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    flexDirection: 'column',
  },
  calcHeader: { marginBottom: hp(1) },
  calcTitle: {
    fontSize: hp(2.9),
    fontWeight: '700',
    color: '#222',
    marginBottom: hp(1),
  },
  totalBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1f2a37',
    borderRadius: hp(1),
    paddingHorizontal: wp(2),
    paddingVertical: hp(1),
    marginBottom: hp(1),
  },
  totalBarLabel: { color: '#cbd5e1', fontSize: hp(2), fontWeight: '700' },
  totalBarValue: { color: '#ffbf00', fontSize: hp(2.4), fontWeight: '800' },
  infoBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#eef2f7',
    borderRadius: hp(1),
    paddingHorizontal: wp(2),
    paddingVertical: hp(1),
    marginBottom: hp(1),
  },
  infoBarLabel: { color: '#374151', fontSize: hp(2), fontWeight: '600' },
  infoBarValue: { color: '#111827', fontSize: hp(2.1), fontWeight: '700' },
  changeBar: { backgroundColor: '#e8f5e9' },
  changeLabel: { color: '#2e7d32' },
  changeValueLarge: { color: '#2e7d32' },
  quickRow: { flexDirection: 'row', gap: wp(2), marginBottom: hp(1) },
  chip: {
    backgroundColor: '#fdebd0',
    borderRadius: hp(1),
    paddingVertical: hp(1),
    paddingHorizontal: wp(3.2),
  },
  chipText: { color: '#8d6e63', fontSize: hp(1.9), fontWeight: '700' },
  chipPrimary: { backgroundColor: '#e3f2fd' },
  chipPrimaryText: { color: '#1565C0' },
  keypad: { flex: 1, gap: hp(1.2), justifyContent: 'flex-end' },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: wp(2),
  },
  gridRow4: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: wp(2),
  },
  key: {
    width: '30%',
    height: hp(7),
    backgroundColor: '#f0f0f0',
    borderRadius: hp(1),
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyLarge: {
    width: '31%',
    height: hp(9),
    backgroundColor: '#eef2f7',
    borderRadius: hp(1),
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyChip: {
    width: '23%',
    height: hp(6.5),
    backgroundColor: '#fdebd0',
    borderRadius: hp(1),
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyText: { fontSize: hp(2.4), fontWeight: '700', color: '#333' },
  actionKey: { backgroundColor: '#FF9800' },
  clearKey: { backgroundColor: '#9E9E9E' },
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff6f00',
    borderRadius: hp(1),
    flex: 1,
    height: hp(9),
    marginLeft: wp(2),
    gap: wp(2),
  },
  payButtonDisabled: { backgroundColor: '#90CAF9' },
  payText: { fontSize: hp(2), fontWeight: '700', color: '#fff' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: wp(4),
  },
  modalBox: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: hp(1),
    padding: wp(4),
    alignItems: 'center',
  },
  modalTitle: { fontSize: hp(2.2), fontWeight: '800', marginBottom: hp(1) },
  modalMessage: {
    fontSize: hp(1.8),
    color: '#444',
    marginBottom: hp(2),
    textAlign: 'center',
  },
  modalButton: {
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(8),
    borderRadius: hp(1),
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: { color: '#fff', fontWeight: '700', fontSize: hp(1.9) },
  modalIconSuccess: {
    width: hp(6),
    height: hp(6),
    borderRadius: hp(3),
    backgroundColor: '#2e7d32',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  modalIconError: {
    width: hp(6),
    height: hp(6),
    borderRadius: hp(3),
    backgroundColor: '#c62828',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  modalBox: {
    width: wp(70),
    backgroundColor: '#fff',
    borderRadius: hp(1),
    padding: wp(4),
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
  },
});
