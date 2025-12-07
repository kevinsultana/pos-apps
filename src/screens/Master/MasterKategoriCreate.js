import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import BaseApi from '../../api/BaseApi';
import { useAuth } from '../../context/AuthContext';
import { toastError, toastSuccess } from '../../utils/toast';
import AppLayout from '../../components/AppLayout';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const PRIMARY = '#1E88E5';

export default function MasterKategoriCreate({ navigation, route }) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const { getApiConfig, companyId } = useAuth();
  const codeRef = useRef(null);

  const canSave = name.trim().length > 0 && code.trim().length > 0;

  const handleSave = async () => {
    if (!canSave) return;

    setLoading(true);
    try {
      const payload = {
        name: name.trim(),
        code: code.trim(),
        parentId: null,
      };

      const response = await BaseApi.post(
        '/categories',
        payload,
        getApiConfig(),
      );

      if (response.data?.success) {
        toastSuccess('Kategori berhasil ditambahkan');
        navigation.goBack();
      } else {
        const msg = response.data?.message || 'Gagal menambahkan kategori';
        toastError(msg);
      }
    } catch (error) {
      console.error('Error creating kategori:', error);
      const message =
        error?.response?.data?.message || 'Gagal menambahkan kategori';
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
          <Text style={styles.title}>Tambah Kategori</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.field}>
            <Text style={styles.label}>Nama Kategori</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan nama kategori"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#94a3b8"
              returnKeyType="next"
              onSubmitEditing={() => codeRef.current?.focus()}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Kode</Text>
            <TextInput
              ref={codeRef}
              style={styles.input}
              placeholder="Masukkan kode kategori"
              value={code}
              onChangeText={setCode}
              placeholderTextColor="#94a3b8"
            />
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.btn, styles.btnCancel]}
              onPress={() => navigation.goBack()}
              disabled={loading}
            >
              <Text style={styles.btnCancelText}>Batal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.btn,
                styles.btnSave,
                (!canSave || loading) && styles.btnDisabled,
              ]}
              onPress={handleSave}
              disabled={!canSave || loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnSaveText}>Simpan</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f6fb', padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  backBtn: { marginRight: 12 },
  title: { fontSize: 18, fontWeight: '700', color: '#0f172a' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e6eef8',
  },
  field: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#334155', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0f172a',
    backgroundColor: '#fff',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  actions: { flexDirection: 'row', gap: 12, marginTop: 8 },
  btn: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnCancel: { backgroundColor: '#f1f5f9' },
  btnCancelText: { color: '#64748b', fontWeight: '600', fontSize: 14 },
  btnSave: { backgroundColor: PRIMARY },
  btnSaveText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  btnDisabled: { backgroundColor: '#cbd5e1' },
});
