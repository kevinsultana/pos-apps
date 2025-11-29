import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  ToastAndroid,
} from 'react-native';
import AppLayout from '../../components/AppLayout';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const PRIMARY = '#1E88E5';

export default function MasterPelangganCreate({ navigation, route }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const onSave = () => {
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    if (!trimmedName) {
      Platform.OS === 'android' &&
        ToastAndroid.show('Nama wajib diisi', ToastAndroid.SHORT);
      return;
    }
    if (!/^\d{8,15}$/.test(trimmedPhone)) {
      Platform.OS === 'android' &&
        ToastAndroid.show('Nomor telepon tidak valid', ToastAndroid.SHORT);
      return;
    }
    route.params?.onSave?.({ name: trimmedName, phone: trimmedPhone });
    Platform.OS === 'android' &&
      ToastAndroid.show('Pelanggan ditambahkan', ToastAndroid.SHORT);
    navigation.goBack();
  };

  return (
    <AppLayout navigation={navigation} route={route}>
      <View style={styles.container}>
        <Text style={styles.title}>Tambah Pelanggan</Text>
        <View style={styles.field}>
          <Text style={styles.label}>Nama</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Nama pelanggan"
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Nomor Telepon</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="08xxxxxxxxxx"
          />
        </View>
        <TouchableOpacity style={styles.saveBtn} onPress={onSave}>
          <Icon name="content-save" size={20} color="#fff" />
          <Text style={styles.saveText}>Simpan</Text>
        </TouchableOpacity>
      </View>
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f6fb', padding: 20 },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 12,
  },
  field: { marginBottom: 12 },
  label: { fontSize: 12, color: '#64748b', marginBottom: 6 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e6eef8',
    borderRadius: 10,
    height: 44,
    paddingHorizontal: 12,
    color: '#0f172a',
  },
  saveBtn: {
    marginTop: 10,
    backgroundColor: PRIMARY,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  saveText: { color: '#fff', fontWeight: '700' },
});
