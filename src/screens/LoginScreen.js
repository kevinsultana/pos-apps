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
import BaseApi from '../api/BaseApi';
import { toastError, toastSuccess } from '../utils/toast';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const { saveAuthData } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const scrollRef = useRef(null);

  const onLogin = async () => {
    if (!email.trim() || !password.trim()) {
      toastError('Lengkapi semua data terlebih dahulu');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        companyCode: 'CUAN',
        username: email.trim(),
        password,
      };
      const response = await BaseApi.post('/auth/login', payload);
      if (response.data.success === true) {
        const authData = response.data.data;
        const saved = await saveAuthData(authData.token, authData);

        if (saved) {
          toastSuccess('Berhasil Login');
          navigation.replace('Home');
        } else {
          toastError('Gagal menyimpan data login');
        }
      }
    } catch (error) {
      const message =
        error?.response?.data?.message || 'Tidak dapat masuk, coba lagi';
      toastError(message);
      console.log('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      ref={scrollRef}
    >
      <View style={styles.header}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>POS</Text>
        </View>
        <Text style={styles.appName}>POSApps</Text>
        <Text style={styles.subtitle}>Solusi kasir cepat & mudah</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Masuk ke Akun Anda</Text>

        <View style={styles.inputRow}>
          <Text style={styles.icon}>📧</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email atau username"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            placeholderTextColor="#9aa0a6"
            returnKeyType="next"
            ref={usernameRef}
            onFocus={() => {
              if (scrollRef.current) {
                scrollRef.current.scrollTo({ y: -100, animated: true });
              }
            }}
            onSubmitEditing={() =>
              passwordRef.current && passwordRef.current.focus()
            }
          />
        </View>

        <View style={styles.inputRow}>
          <Text style={styles.icon}>🔒</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Kata sandi"
            secureTextEntry={!showPassword}
            style={styles.input}
            placeholderTextColor="#9aa0a6"
            ref={passwordRef}
            returnKeyType="done"
            onFocus={() => {
              if (scrollRef.current) {
                scrollRef.current.scrollTo({ y: 0, animated: true });
              }
            }}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeButton}
            accessibilityLabel={
              showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'
            }
          >
            <Icon
              name={showPassword ? 'eye-off' : 'eye'}
              size={20}
              color={PRIMARY}
              accessibilityIgnoresInvertColors={false}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.primaryButton, loading && styles.buttonDisabled]}
          onPress={onLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator animating={true} color={'white'} />
          ) : (
            <Text style={styles.primaryButtonText}>Masuk</Text>
          )}
        </TouchableOpacity>

        <View style={styles.rowBetween}>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.link}>Daftar akun</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <Text style={styles.link}>Lupa password?</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>Versi demo • Untuk keperluan internal</Text>
      </View>
    </ScrollView>
  );
}
const PRIMARY = '#1E88E5';
const CARD_BG = '#ffffff';

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flexGrow: 1,
    backgroundColor: '#f3f6fb',
    alignItems: 'center',
    padding: 20,
    justifyContent: 'center',
  },
  header: { alignItems: 'center', marginTop: 16, marginBottom: 12 },
  logoCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 6,
  },
  logoText: { color: 'white', fontSize: 28, fontWeight: '700' },
  appName: { marginTop: 10, fontSize: 20, fontWeight: '700', color: '#243447' },
  subtitle: { color: '#6b7280', marginTop: 4 },

  card: {
    width: '50%',
    marginTop: 12,
    backgroundColor: CARD_BG,
    borderRadius: 12,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    color: '#0f172a',
  },

  inputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  icon: { fontSize: 18, marginRight: 8 },
  input: {
    flex: 1,
    height: 44,
    borderBottomWidth: 1,
    borderBottomColor: '#e6eef8',
    paddingVertical: 6,
    color: '#111827',
  },
  eyeButton: { paddingHorizontal: 8 },
  eyeText: { color: PRIMARY, fontWeight: '600' },
  eyeIcon: { color: PRIMARY, fontWeight: '600', fontSize: 18 },

  primaryButton: {
    marginTop: 6,
    backgroundColor: PRIMARY,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.7 },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  link: { color: PRIMARY, fontWeight: '600' },
  link: { color: PRIMARY, fontWeight: '600' },

  footer: { marginTop: 22, color: '#94a3b8', fontSize: 12 },
});
