import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const PRIMARY = '#1E88E5';
const CARD_BG = '#ffffff';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const scrollRef = useRef(null);
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (loading) {
      Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ).start();
    } else {
      spinAnim.stopAnimation(() => {
        spinAnim.setValue(0);
      });
    }
  }, [loading, spinAnim]);

  const onRegister = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.replace('Home');
    }, 600);
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
        <Text style={styles.subtitle}>Buat akun baru Anda</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Daftar Akun Baru</Text>

        <View style={styles.inputRow}>
          <Text style={styles.icon}>👤</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Nama lengkap"
            style={styles.input}
            placeholderTextColor="#9aa0a6"
            returnKeyType="next"
            onFocus={() => {
              if (scrollRef.current) {
                scrollRef.current.scrollTo({ y: 0, animated: true });
              }
            }}
            onSubmitEditing={() => emailRef.current && emailRef.current.focus()}
          />
        </View>

        <View style={styles.inputRow}>
          <Text style={styles.icon}>📧</Text>
          <TextInput
            ref={emailRef}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            placeholderTextColor="#9aa0a6"
            returnKeyType="next"
            onFocus={() => {
              if (scrollRef.current) {
                scrollRef.current.scrollTo({ y: 0, animated: true });
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
            ref={passwordRef}
            value={password}
            onChangeText={setPassword}
            placeholder="Kata sandi"
            secureTextEntry
            style={styles.input}
            placeholderTextColor="#9aa0a6"
            returnKeyType="done"
            onFocus={() => {
              if (scrollRef.current) {
                scrollRef.current.scrollTo({ y: 0, animated: true });
              }
            }}
          />
        </View>

        <TouchableOpacity
          style={[styles.primaryButton, loading && styles.buttonDisabled]}
          onPress={onRegister}
          disabled={loading}
        >
          {loading ? (
            <Animated.View
              style={{
                transform: [
                  {
                    rotate: spinAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '360deg'],
                    }),
                  },
                ],
              }}
            >
              <Icon name="loading" size={20} color="#fff" />
            </Animated.View>
          ) : (
            <Text style={styles.primaryButtonText}>Daftar</Text>
          )}
        </TouchableOpacity>

        <View style={styles.rowBetween}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.link}>Kembali ke login</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.footer}>Versi demo • Untuk keperluan internal</Text>
    </ScrollView>
  );
}

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

  footer: { marginTop: 22, color: '#94a3b8', fontSize: 12 },
});
