import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
  Platform,
} from 'react-native';
import AppLayout from '../../components/AppLayout';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const PRIMARY = '#1E88E5';

export default function MasterPemasokCreate({ navigation, route }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const canSave = name.trim().length > 0 && /^\d{8,15}$/.test(phone);

  const handleSave = () => {
    if (!canSave) return;
    route.params?.onSave?.({ name: name.trim(), phone });
    if (Platform.OS === 'android') {
      ToastAndroid.show('Pemasok berhasil ditambahkan', ToastAndroid.SHORT);
    }
    navigation.goBack();
  };

  return (
    <AppLayout navigation={navigation} route={route}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          >
            <Icon name="arrow-left" size={24} color="#0f172a" />
          </TouchableOpacity>
          <Text style={styles.title}>Tambah Pemasok</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.field}>
            <Text style={styles.label}>Nama Pemasok</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan nama pemasok"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#94a3b8"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Nomor Telepon</Text>
            <TextInput
              style={styles.input}
              placeholder="08123456789"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholderTextColor="#94a3b8"
            />
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.btn, styles.btnCancel]}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.btnCancelText}>Batal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.btn,
                styles.btnSave,
                !canSave && styles.btnDisabled,
              ]}
              onPress={handleSave}
              disabled={!canSave}
            >
              <Text style={styles.btnSaveText}>Simpan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
