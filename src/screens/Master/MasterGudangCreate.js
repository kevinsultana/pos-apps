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

export default function MasterGudangCreate({ navigation, route }) {
  const { getApiConfig, companyId } = useAuth();
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const codeRef = useRef(null);
  const addressRef = useRef(null);

  const handleCreate = async () => {
    if (!name.trim()) {
      toastError('Nama gudang tidak boleh kosong');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        company_id: companyId,
        name: name.trim(),
        code: code.trim() || null,
        address: address.trim() || null,
      };

      const response = await BaseApi.post(
        '/warehouses',
        payload,
        getApiConfig(),
      );

      if (response.data.success) {
        toastSuccess('Gudang berhasil ditambahkan');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error creating gudang:', error);
      const message =
        error?.response?.data?.message || 'Gagal menambahkan gudang';
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
            <Text style={styles.pageTitle}>Tambah Gudang</Text>
            <Text style={styles.pageSubtitle}>
              Tambahkan gudang penyimpanan baru
            </Text>
          </View>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Nama Gudang *</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan nama gudang"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#cbd5e1"
              returnKeyType="next"
              onSubmitEditing={() => codeRef.current?.focus()}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Kode Gudang</Text>
            <TextInput
              ref={codeRef}
              style={styles.input}
              placeholder="Masukkan kode gudang (optional)"
              value={code}
              onChangeText={setCode}
              placeholderTextColor="#cbd5e1"
              returnKeyType="next"
              onSubmitEditing={() => addressRef.current?.focus()}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Alamat</Text>
            <TextInput
              ref={addressRef}
              style={[styles.input, styles.textArea]}
              placeholder="Masukkan alamat gudang (optional)"
              value={address}
              onChangeText={setAddress}
              placeholderTextColor="#cbd5e1"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
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
  textArea: {
    height: 100,
    paddingTop: 10,
  },
  submitBtn: {
    backgroundColor: '#FF6F00',
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
