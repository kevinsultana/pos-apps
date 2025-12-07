import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AppLayout from '../../components/AppLayout';
import BaseApi from '../../api/BaseApi';
import { useAuth } from '../../context/AuthContext';
import { toastError, toastSuccess } from '../../utils/toast';

export default function MasterStokCreate({ navigation, route }) {
  const { getApiConfig, companyId } = useAuth();
  const [productId, setProductId] = useState('');
  const [warehouseId, setWarehouseId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [loading, setLoading] = useState(false);
  const warehouseRef = useRef(null);
  const quantityRef = useRef(null);
  const unitRef = useRef(null);

  const handleCreate = async () => {
    if (!productId.trim()) {
      toastError('ID Produk tidak boleh kosong');
      return;
    }

    if (!warehouseId.trim()) {
      toastError('ID Gudang tidak boleh kosong');
      return;
    }

    if (!quantity.trim()) {
      toastError('Jumlah stok tidak boleh kosong');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        company_id: companyId,
        product_id: parseInt(productId, 10),
        warehouse_id: parseInt(warehouseId, 10),
        quantity: parseInt(quantity, 10),
        unit: unit.trim() || null,
      };

      const response = await BaseApi.post('/stocks', payload, getApiConfig());

      if (response.data.success) {
        toastSuccess('Stok berhasil ditambahkan');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error creating stok:', error);
      const message =
        error?.response?.data?.message || 'Gagal menambahkan stok';
      toastError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout navigation={navigation} route={route}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          >
            <Icon name="arrow-left" size={24} color="#0f172a" />
          </TouchableOpacity>
          <View>
            <Text style={styles.pageTitle}>Tambah Stok</Text>
            <Text style={styles.pageSubtitle}>
              Tambahkan data stok produk baru
            </Text>
          </View>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>ID Produk *</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan ID produk"
              value={productId}
              onChangeText={setProductId}
              placeholderTextColor="#cbd5e1"
              keyboardType="number-pad"
              returnKeyType="next"
              onSubmitEditing={() => warehouseRef.current?.focus()}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>ID Gudang *</Text>
            <TextInput
              ref={warehouseRef}
              style={styles.input}
              placeholder="Masukkan ID gudang"
              value={warehouseId}
              onChangeText={setWarehouseId}
              placeholderTextColor="#cbd5e1"
              keyboardType="number-pad"
              returnKeyType="next"
              onSubmitEditing={() => quantityRef.current?.focus()}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Jumlah Stok *</Text>
            <TextInput
              ref={quantityRef}
              style={styles.input}
              placeholder="Masukkan jumlah stok"
              value={quantity}
              onChangeText={setQuantity}
              placeholderTextColor="#cbd5e1"
              keyboardType="number-pad"
              returnKeyType="next"
              onSubmitEditing={() => unitRef.current?.focus()}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Satuan</Text>
            <TextInput
              ref={unitRef}
              style={styles.input}
              placeholder="Masukkan satuan (optional)"
              value={unit}
              onChangeText={setUnit}
              placeholderTextColor="#cbd5e1"
              returnKeyType="done"
            />
          </View>

          <TouchableOpacity
            style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
            onPress={handleCreate}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Icon name="check" size={20} color="#fff" />
                <Text style={styles.submitBtnText}>Simpan</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
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
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0f172a',
  },
  submitBtn: {
    backgroundColor: '#7CB342',
    borderRadius: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
