import React, { useState, useRef, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  ToastAndroid,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AppLayout from '../../components/AppLayout';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ModalCamera from '../../components/ModalCamera';
import UnitPickerModal from '../../components/UnitPickerModal';
import ButtonBack from '../../components/ButtonBack';
import BaseApi from '../../api/BaseApi';
import { useAuth } from '../../context/AuthContext';
import { toastSuccess, toastError } from '../../utils/toast';

const PRIMARY = '#1E88E5';

export default function MasterProductCreate({ navigation, route }) {
  const { getApiConfig } = useAuth();
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [variants, setVariants] = useState([
    {
      name: '',
      sku: '',
      costPrice: '',
      unitId: '',
      sellPrice: '',
      barcodes: [{ barcode: '', isPrimary: true }],
    },
  ]);
  const [units, setUnits] = useState([]);
  const [showCam, setShowCam] = useState(false);
  const [loading, setLoading] = useState(false);
  const [unitsLoading, setUnitsLoading] = useState(false);
  const [showUnitPicker, setShowUnitPicker] = useState(false);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(null);
  const [scanningFor, setScanningFor] = useState(null); // { variantIndex, barcodeIndex }

  const scrollRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      fetchUnits();
    }, []),
  );

  const fetchUnits = async () => {
    try {
      setUnitsLoading(true);
      const response = await BaseApi.get('/units', getApiConfig());
      if (response.data?.success) {
        setUnits(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching units:', error);
      toastError('Gagal memuat data unit');
    } finally {
      setUnitsLoading(false);
    }
  };

  const canSave = useMemo(() => {
    return (
      name.trim() &&
      code.trim() &&
      variants.length > 0 &&
      variants.every(v => v.name.trim() && v.sku.trim() && v.unitId) &&
      !loading
    );
  }, [name, code, variants, loading]);

  const addVariant = () => {
    setVariants(prev => [
      ...prev,
      {
        name: '',
        sku: '',
        costPrice: '',
        unitId: '',
        sellPrice: '',
        barcodes: [{ barcode: '', isPrimary: true }],
      },
    ]);
  };

  const removeVariant = index => {
    if (variants.length > 1) {
      setVariants(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updateVariant = (index, field, value) => {
    setVariants(prev =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v)),
    );
  };

  const addBarcode = variantIndex => {
    setVariants(prev =>
      prev.map((v, i) =>
        i === variantIndex
          ? {
              ...v,
              barcodes: [...v.barcodes, { barcode: '', isPrimary: false }],
            }
          : v,
      ),
    );
  };

  const removeBarcode = (variantIndex, barcodeIndex) => {
    setVariants(prev =>
      prev.map((v, i) =>
        i === variantIndex
          ? {
              ...v,
              barcodes: v.barcodes.filter((_, bi) => bi !== barcodeIndex),
            }
          : v,
      ),
    );
  };

  const updateBarcode = (variantIndex, barcodeIndex, field, value) => {
    setVariants(prev =>
      prev.map((v, i) =>
        i === variantIndex
          ? {
              ...v,
              barcodes: v.barcodes.map((b, bi) =>
                bi === barcodeIndex ? { ...b, [field]: value } : b,
              ),
            }
          : v,
      ),
    );
  };

  const openUnitPicker = variantIndex => {
    setSelectedVariantIndex(variantIndex);
    setShowUnitPicker(true);
  };

  const selectUnit = unitId => {
    if (selectedVariantIndex !== null) {
      updateVariant(selectedVariantIndex, 'unitId', unitId);
    }
    setShowUnitPicker(false);
    setSelectedVariantIndex(null);
  };

  const onSave = async () => {
    if (!canSave || loading) return;

    setLoading(true);
    try {
      const payload = {
        name: name.trim(),
        code: code.trim(),
        variants: variants.map(v => ({
          name: v.name.trim(),
          sku: v.sku.trim(),
          costPrice: Number(v.costPrice) || 0,
          unitId: v.unitId,
          sellPrice: Number(v.sellPrice) || 0,
          barcodes: v.barcodes
            .filter(b => b.barcode.trim())
            .map(b => ({
              barcode: b.barcode.trim(),
              isPrimary: b.isPrimary,
            })),
        })),
      };

      const response = await BaseApi.post('/products', payload, getApiConfig());

      if (response.data?.success) {
        toastSuccess('Produk berhasil ditambahkan');
        const newItem = response.data.data || payload;
        route.params?.onSave?.(newItem);
        navigation.goBack();
      } else {
        const msg = response.data?.message || 'Gagal menambahkan produk';
        toastError(msg);
      }
    } catch (error) {
      console.error('Error creating product:', error);
      const message =
        error?.response?.data?.message || 'Gagal menambahkan produk';
      toastError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout navigation={navigation} route={route}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView
          ref={scrollRef}
          style={styles.container}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <View
              style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
            >
              <ButtonBack onPress={() => navigation.goBack()} />
              <View>
                <Text style={styles.title}>Tambah Produk</Text>
                <Text style={styles.subtitle}>
                  Tambahkan produk baru dengan varian
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Informasi Produk</Text>

            <Field
              label="Nama Produk"
              placeholder="Masukkan nama produk"
              value={name}
              onChangeText={setName}
            />

            <Field
              label="Kode Produk"
              placeholder="Masukkan kode produk"
              value={code}
              onChangeText={setCode}
            />
          </View>

          <View style={styles.card}>
            <View style={styles.variantHeader}>
              <Text style={styles.cardTitle}>Varian Produk</Text>
              <TouchableOpacity
                style={styles.addVariantBtn}
                onPress={addVariant}
              >
                <Icon name="plus" size={16} color={PRIMARY} />
                <Text style={styles.addVariantText}>Tambah Varian</Text>
              </TouchableOpacity>
            </View>

            {variants.map((variant, variantIndex) => (
              <View key={variantIndex} style={styles.variantCard}>
                {variants.length > 1 && (
                  <View style={styles.variantHeaderRow}>
                    <Text style={styles.variantTitle}>
                      Varian {variantIndex + 1}
                    </Text>
                    <TouchableOpacity
                      onPress={() => removeVariant(variantIndex)}
                      style={styles.removeBtn}
                    >
                      <Icon name="close" size={16} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                )}

                <Field
                  label="Nama Varian"
                  placeholder="Contoh: Size 42, Warna Merah"
                  value={variant.name}
                  onChangeText={value =>
                    updateVariant(variantIndex, 'name', value)
                  }
                />

                <Field
                  label="SKU Varian"
                  placeholder="Masukkan SKU unik"
                  value={variant.sku}
                  onChangeText={value =>
                    updateVariant(variantIndex, 'sku', value)
                  }
                />

                <View style={styles.row}>
                  <Field
                    label="Harga Beli"
                    placeholder="0"
                    keyboardType="numeric"
                    value={variant.costPrice}
                    onChangeText={value =>
                      updateVariant(variantIndex, 'costPrice', value)
                    }
                    containerStyle={{ flex: 1, marginRight: 8 }}
                  />
                  <Field
                    label="Harga Jual"
                    placeholder="0"
                    keyboardType="numeric"
                    value={variant.sellPrice}
                    onChangeText={value =>
                      updateVariant(variantIndex, 'sellPrice', value)
                    }
                    containerStyle={{ flex: 1 }}
                  />
                </View>

                <View style={styles.field}>
                  <Text style={styles.fieldLabel}>Unit</Text>
                  <TouchableOpacity
                    style={styles.dropdown}
                    onPress={() => openUnitPicker(variantIndex)}
                  >
                    <Text style={styles.dropdownText}>
                      {units.find(u => u.id === variant.unitId)?.name ||
                        'Pilih Unit'}
                    </Text>
                    <Icon name="chevron-down" size={20} color="#64748b" />
                  </TouchableOpacity>
                </View>

                <View style={styles.barcodeSection}>
                  <View style={styles.barcodeHeader}>
                    <Text style={styles.barcodeTitle}>Barcode</Text>
                    <TouchableOpacity
                      style={styles.addBarcodeBtn}
                      onPress={() => addBarcode(variantIndex)}
                    >
                      <Icon name="plus" size={14} color={PRIMARY} />
                      <Text style={styles.addBarcodeText}>Tambah</Text>
                    </TouchableOpacity>
                  </View>

                  {variant.barcodes.map((barcode, barcodeIndex) => (
                    <View key={barcodeIndex} style={styles.barcodeRow}>
                      <View style={{ flex: 1, marginRight: 8 }}>
                        <Field
                          placeholder="Masukkan barcode"
                          value={barcode.barcode}
                          onChangeText={value =>
                            updateBarcode(
                              variantIndex,
                              barcodeIndex,
                              'barcode',
                              value,
                            )
                          }
                          rightIcon={
                            <TouchableOpacity
                              onPress={() => {
                                setScanningFor({ variantIndex, barcodeIndex });
                                setShowCam(true);
                              }}
                              style={styles.scanBtnSmall}
                            >
                              <Icon
                                name="barcode-scan"
                                size={16}
                                color="#64748b"
                              />
                            </TouchableOpacity>
                          }
                        />
                      </View>
                      <View style={styles.barcodeActions}>
                        <TouchableOpacity
                          style={[
                            styles.primaryBadge,
                            !barcode.isPrimary && styles.secondaryBadge,
                          ]}
                          onPress={() =>
                            updateBarcode(
                              variantIndex,
                              barcodeIndex,
                              'isPrimary',
                              !barcode.isPrimary,
                            )
                          }
                        >
                          <Text
                            style={[
                              styles.primaryBadgeText,
                              !barcode.isPrimary && styles.secondaryBadgeText,
                            ]}
                          >
                            {barcode.isPrimary ? 'Primary' : 'Secondary'}
                          </Text>
                        </TouchableOpacity>
                        {variant.barcodes.length > 1 && (
                          <TouchableOpacity
                            onPress={() =>
                              removeBarcode(variantIndex, barcodeIndex)
                            }
                            style={styles.removeBarcodeBtn}
                          >
                            <Icon name="close" size={16} color="#ef4444" />
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.secondaryBtnText}>Batal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.primaryBtn, !canSave && styles.btnDisabled]}
              disabled={!canSave}
              onPress={onSave}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Icon name="content-save" size={18} color="#fff" />
              )}
              <Text style={styles.primaryBtnText}>
                {loading ? 'Menyimpan...' : 'Simpan'}
              </Text>
            </TouchableOpacity>
          </View>

          <ModalCamera
            visible={showCam}
            onClose={() => {
              setShowCam(false);
              setScanningFor(null);
            }}
            onResult={code => {
              if (scanningFor) {
                updateBarcode(
                  scanningFor.variantIndex,
                  scanningFor.barcodeIndex,
                  'barcode',
                  code,
                );
              }
              setShowCam(false);
              setScanningFor(null);
            }}
          />

          {/* Unit Picker Modal */}
          <UnitPickerModal
            visible={showUnitPicker}
            onClose={() => setShowUnitPicker(false)}
            units={units}
            unitsLoading={unitsLoading}
            onSelectUnit={selectUnit}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </AppLayout>
  );
}

function Field({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType,
  rightIcon,
  containerStyle,
}) {
  return (
    <View style={[styles.field, containerStyle]}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#9aa0a6"
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
        />
        {rightIcon}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f6fb' },
  content: { padding: 20, paddingBottom: 28 },
  header: { marginBottom: 12 },
  title: { fontSize: 22, fontWeight: '700', color: '#0f172a' },
  subtitle: { fontSize: 12, color: '#64748b', marginTop: 2 },

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e6eef8',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 10,
  },

  field: { marginBottom: 12 },
  fieldLabel: { fontSize: 12, color: '#64748b', marginBottom: 6 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e6eef8',
    paddingHorizontal: 12,
    height: 44,
  },
  input: { flex: 1, color: '#0f172a' },

  row: { flexDirection: 'row', gap: 12 },

  variantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addVariantBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addVariantText: {
    fontSize: 12,
    color: PRIMARY,
    fontWeight: '600',
  },

  variantCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e6eef8',
  },
  variantHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  variantTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  removeBtn: {
    padding: 4,
  },

  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e6eef8',
    paddingHorizontal: 12,
    height: 44,
  },
  dropdownText: {
    color: '#0f172a',
    flex: 1,
  },

  barcodeSection: {
    marginTop: 8,
  },
  barcodeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  barcodeTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  addBarcodeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  addBarcodeText: {
    fontSize: 12,
    color: PRIMARY,
    fontWeight: '600',
  },

  barcodeRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  barcodeActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  primaryBadge: {
    backgroundColor: PRIMARY,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  primaryBadgeText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },
  secondaryBadge: {
    backgroundColor: '#f1f5f9',
  },
  secondaryBadgeText: {
    color: '#64748b',
  },
  removeBarcodeBtn: {
    padding: 4,
  },

  scanBtnSmall: {
    padding: 4,
    marginLeft: 4,
  },

  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 8,
    gap: 12,
  },
  secondaryBtn: {
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  secondaryBtnText: { color: '#0f172a', fontWeight: '600' },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: PRIMARY,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  primaryBtnText: { color: '#fff', fontWeight: '700' },
  btnDisabled: { opacity: 0.6 },
});
