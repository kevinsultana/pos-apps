import React from 'react';
import { View, StyleSheet } from 'react-native';
import PersistentSidebar from './PersistentSidebar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AppLayout({ children, navigation, route }) {
  const currentRoute = route?.name || '';

  const sidebarItems = [
    {
      label: 'Home',
      screen: 'Home',
      icon: <Ionicons name="home" size={24} />,
    },
    {
      label: 'POS',
      screen: 'Pos',
      icon: <Ionicons name="cash" size={24} />,
    },
    {
      label: 'Details',
      screen: 'Details',
      params: { itemId: 99 },
      icon: <Ionicons name="document-text" size={24} />,
    },
    {
      label: 'Logout',
      onPress: () => navigation.replace('Login'),
      icon: <Ionicons name="log-out" size={24} />,
    },
  ];
  return (
    <View style={styles.root}>
      <PersistentSidebar
        items={sidebarItems}
        navigation={navigation}
        currentRoute={currentRoute}
        initialCollapsed={true}
      />
      <View style={styles.content} pointerEvents="box-none">
        <SafeAreaView style={styles.safeArea}>{children}</SafeAreaView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff', position: 'relative' },
  content: { flex: 1, marginLeft: wp(5) },
  safeArea: { flex: 1 },
});
