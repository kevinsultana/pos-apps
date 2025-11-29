import React, { useMemo, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AppLayout from '../../components/AppLayout';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ModalCamera from '../../components/ModalCamera';
import ButtonBack from '../../components/ButtonBack';

const PRIMARY = '#1E88E5';

export default function MasterProductEdit({ navigation, route }) {
  const item = route?.params?.item;
  const [name, setName] = useState(item?.name || '');
  const [variant, setVariant] = useState(item?.variant || '');
  const [sku, setSku] = useState(item?.sku || '');
  const [barcode, setBarcode] = useState(item?.barcode || '');
  const [category, setCategory] = useState(item?.category || '');
  const [supplier, setSupplier] = useState(item?.supplier || '');
  const [unit, setUnit] = useState(item?.unit || 'pcs');
  const [stock, setStock] = useState(String(item?.stock ?? ''));
  const [priceSell, setPriceSell] = useState(String(item?.priceSell ?? ''));
  const [priceBuy, setPriceBuy] = useState(String(item?.priceBuy ?? ''));
  const [description, setDescription] = useState('');
  const [showCam, setShowCam] = useState(false);

  const scrollRef = useRef(null);

  const canSave = useMemo(() => {
    return name.trim() && sku.trim();
  }, [name, sku]);

  const onSave = () => {
    // Placeholder: normally submit to API / state
    const payload = {
      name: name.trim(),
      variant: variant.trim(),
      sku: sku.trim(),
      barcode: barcode.trim(),
      category: category.trim(),
      supplier: supplier.trim(),
      unit: unit.trim(),
      stock: Number(stock) || 0,
      priceSell: Number(priceSell) || 0,
      priceBuy: Number(priceBuy) || 0,
      description: description.trim(),
    };
    console.log('Save product', payload);
    navigation.goBack();
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
                <Text style={styles.title}>Edit Produk</Text>
                <Text style={styles.subtitle}>Perbarui detail produk Anda</Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Informasi Utama</Text>

            <Field
              label="Nama Produk"
              value={name}
              onChangeText={setName}
              placeholder="Contoh: Indomie Goreng"
              onFocus={() =>
                scrollRef.current?.scrollTo({ y: 0, animated: true })
              }
            />
            <Field
              label="Varian"
              value={variant}
              onChangeText={setVariant}
              placeholder="Contoh: Original 85g"
            />
            <Field
              label="SKU"
              value={sku}
              onChangeText={setSku}
              placeholder="Contoh: SKU-001"
            />
            <Field
              label="Barcode"
              value={barcode}
              onChangeText={setBarcode}
              placeholder="Contoh: 8992718850012"
              rightAdornment={
                <TouchableOpacity
                  style={styles.iconBtn}
                  onPress={() => setShowCam(true)}
                >
                  <Icon name="barcode-scan" size={18} color={PRIMARY} />
                </TouchableOpacity>
              }
            />
            <Field
              label="Kategori"
              value={category}
              onChangeText={setCategory}
              placeholder="Contoh: Mie Instan"
            />
            <Field
              label="Pemasok"
              value={supplier}
              onChangeText={setSupplier}
              placeholder="Contoh: PT Indofood CBP"
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Stok & Harga</Text>

            <View style={styles.row2}>
              <View style={styles.col}>
                <Field
                  label="Satuan"
                  value={unit}
                  onChangeText={setUnit}
                  placeholder="pcs/btl/sak"
                />
              </View>
              <View style={styles.col}>
                <Field
                  label="Stok"
                  value={stock}
                  onChangeText={setStock}
                  keyboardType="numeric"
                  placeholder="0"
                />
              </View>
            </View>

            <View style={styles.row2}>
              <View style={styles.col}>
                <Field
                  label="Harga Jual"
                  value={priceSell}
                  onChangeText={setPriceSell}
                  keyboardType="numeric"
                  placeholder="0"
                />
              </View>
              <View style={styles.col}>
                <Field
                  label="Harga Beli"
                  value={priceBuy}
                  onChangeText={setPriceBuy}
                  keyboardType="numeric"
                  placeholder="0"
                />
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Deskripsi</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Catatan tambahan"
              placeholderTextColor="#9aa0a6"
              multiline
              numberOfLines={4}
            />
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
              <Icon name="content-save" size={18} color="#fff" />
              <Text style={styles.primaryBtnText}>Simpan</Text>
            </TouchableOpacity>
          </View>
          <ModalCamera
            visible={showCam}
            onClose={() => setShowCam(false)}
            onResult={code => {
              setBarcode(code);
              setShowCam(false);
            }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </AppLayout>
  );
}

function Field({ label, rightAdornment, style, inputStyle, ...inputProps }) {
  return (
    <View style={[styles.field, style]}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={[styles.input, inputStyle]}
          placeholderTextColor="#9aa0a6"
          {...inputProps}
        />
        {rightAdornment}
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
  label: { fontSize: 12, color: '#64748b', marginBottom: 6 },
  inputRow: {
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
  textArea: { height: 120, textAlignVertical: 'top', paddingTop: 12 },
  iconBtn: { marginLeft: 8, padding: 6 },

  row2: { flexDirection: 'row', gap: 12 },
  col: { flex: 1 },

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
