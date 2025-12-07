import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useAuth } from '../context/AuthContext';

const PRIMARY = '#1E88E5';

export default function AuthLayout({ children, navigation }) {
  const { isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        // User sudah login, redirect ke Home
        navigation.replace('Home');
      }
      // Jika tidak authenticated, tetap di halaman login (children akan di-render)
    }
  }, [isLoading, isAuthenticated, navigation]);

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>POS</Text>
        </View>
        <ActivityIndicator
          size="large"
          color={PRIMARY}
          style={styles.spinner}
        />
        <Text style={styles.loadingText}>Memeriksa autentikasi...</Text>
      </View>
    );
  }

  // Jika tidak authenticated, render children (LoginScreen)
  return <>{children}</>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f6fb',
  },
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
    marginBottom: 24,
  },
  logoText: {
    color: 'white',
    fontSize: 28,
    fontWeight: '700',
  },
  spinner: {
    marginVertical: 16,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
});
