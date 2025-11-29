import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AppLayout from '../components/AppLayout';

export default function DetailsScreen({ navigation, route }) {
  const { itemId } = route.params || {};

  return (
    <AppLayout navigation={navigation} route={route}>
      <View style={styles.container}>
        <Text style={styles.title}>Details Screen</Text>
        <Text>Item ID: {String(itemId)}</Text>
        <Button title="Go back" onPress={() => navigation.goBack()} />
      </View>
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, marginBottom: 8 },
});
