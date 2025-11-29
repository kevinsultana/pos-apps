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

export default function MasterPelangganEdit({ navigation, route }) {
  const customer = route.params?.customer;
  const onUpdate = route.params?.onUpdate;
  const onDelete = route.params?.onDelete;

  const [name, setName] = useState(customer?.name ?? '');
  const [phone, setPhone] = useState(customer?.phone ?? '');

  const save = () => {
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
    onUpdate?.({ ...customer, name: trimmedName, phone: trimmedPhone });
    Platform.OS === 'android' &&
      ToastAndroid.show('Perubahan disimpan', ToastAndroid.SHORT);
    navigation.goBack();
  };

  const remove = () => {
    onDelete?.(customer?.id);
    Platform.OS === 'android' &&
      ToastAndroid.show('Pelanggan dihapus', ToastAndroid.SHORT);
    navigation.goBack();
  };

  return (
    <AppLayout navigation={navigation} route={route}>
      <View style={styles.container}>
        <Text style={styles.title}>Edit Pelanggan</Text>
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
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.btn, styles.deleteBtn]}
            onPress={remove}
          >
            <Icon name="trash-can" size={20} color="#fff" />
            <Text style={styles.btnText}>Hapus</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.saveBtn]} onPress={save}>
            <Icon name="content-save" size={20} color="#fff" />
            <Text style={styles.btnText}>Simpan</Text>
          </TouchableOpacity>
        </View>
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 44,
    borderRadius: 10,
    flex: 1,
  },
  deleteBtn: { backgroundColor: '#ef4444', marginRight: 8 },
  saveBtn: { backgroundColor: PRIMARY, marginLeft: 8 },
  btnText: { color: '#fff', fontWeight: '700' },
});
