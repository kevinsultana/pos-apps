import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  FlatList,
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
  const [outlets, setOutlets] = useState([]);
  const [selectedOutlet, setSelectedOutlet] = useState(null);
  const [outletLoading, setOutletLoading] = useState(false);
  const [outletModalVisible, setOutletModalVisible] = useState(false);
  const [warehouseType, setWarehouseType] = useState(null);
  const [typeModalVisible, setTypeModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const codeRef = useRef(null);
  const addressRef = useRef(null);

  useEffect(() => {
    const fetchOutlets = async () => {
      try {
        setOutletLoading(true);
        const res = await BaseApi.get('/outlets', getApiConfig());
        if (res.data?.success) {
          setOutlets(res.data.data || []);
        }
      } catch (err) {
        console.error('Error fetching outlets:', err);
        toastError('Gagal memuat daftar outlet');
      } finally {
        setOutletLoading(false);
      }
    };

    fetchOutlets();
  }, [companyId]);

  const WAREHOUSE_TYPE_OPTIONS = [
    { label: 'Utama', value: 'UTAMA' },
    { label: 'Cabang', value: 'CABANG' },
    { label: 'Retail', value: 'RETAIL' },
    { label: 'Virtual', value: 'VIRTUAL' },
  ];

  const handleCreate = async () => {
    if (!name.trim() || selectedOutlet === null || warehouseType === null) {
      toastError('Nama gudang, outlet, dan tipe gudang tidak boleh kosong');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: name.trim(),
        code: code.trim() || null,
        outletId: selectedOutlet?.id || null,
        type: warehouseType || null,
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
            <Text style={styles.label}>Pilih Outlet</Text>
            <TouchableOpacity
              style={styles.select}
              onPress={() => setOutletModalVisible(true)}
            >
              {outletLoading ? (
                <ActivityIndicator />
              ) : (
                <Text style={styles.selectText}>
                  {selectedOutlet ? `${selectedOutlet.name}` : 'Pilih outlet'}
                </Text>
              )}
              <Icon name="chevron-down" size={20} color="#64748b" />
            </TouchableOpacity>
          </View>
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
            <Text style={styles.label}>Tipe Gudang</Text>
            <TouchableOpacity
              style={styles.select}
              onPress={() => setTypeModalVisible(true)}
            >
              <Text style={styles.selectText}>
                {warehouseType
                  ? WAREHOUSE_TYPE_OPTIONS.find(o => o.value === warehouseType)
                      ?.label
                  : 'Pilih tipe gudang'}
              </Text>
              <Icon name="chevron-down" size={20} color="#64748b" />
            </TouchableOpacity>
          </View>

          <Modal
            visible={outletModalVisible}
            animationType="slide"
            transparent={false}
            onRequestClose={() => setOutletModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.pageTitle}>Pilih Outlet</Text>
                <TouchableOpacity onPress={() => setOutletModalVisible(false)}>
                  <Icon name="close" size={24} color="#0f172a" />
                </TouchableOpacity>
              </View>
              {outletLoading ? (
                <ActivityIndicator size="large" color="#FF6F00" />
              ) : (
                <FlatList
                  data={outlets}
                  keyExtractor={item => item.id.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.modalItem}
                      onPress={() => {
                        setSelectedOutlet(item);
                        setOutletModalVisible(false);
                      }}
                    >
                      <Text style={styles.modalItemText}>{item.name}</Text>
                      <Text style={styles.modalItemSub}>
                        {item.code || '-'}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              )}
            </View>
          </Modal>

          <Modal
            visible={typeModalVisible}
            animationType="slide"
            transparent={false}
            onRequestClose={() => setTypeModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.pageTitle}>Pilih Tipe Gudang</Text>
                <TouchableOpacity onPress={() => setTypeModalVisible(false)}>
                  <Icon name="close" size={24} color="#0f172a" />
                </TouchableOpacity>
              </View>
              <FlatList
                data={WAREHOUSE_TYPE_OPTIONS}
                keyExtractor={item => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      setWarehouseType(item.value);
                      setTypeModalVisible(false);
                    }}
                  >
                    <Text style={styles.modalItemText}>{item.label}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </Modal>

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
  select: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectText: {
    fontSize: 14,
    color: '#0f172a',
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
  modalContainer: {
    flex: 1,
    backgroundColor: '#f3f6fb',
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalItem: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e6eef8',
  },
  modalItemText: {
    fontSize: 16,
    color: '#0f172a',
    fontWeight: '600',
  },
  modalItemSub: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
});
