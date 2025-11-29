import React from 'react';
import { View, StyleSheet } from 'react-native';
import PersistentSidebar from './PersistentSidebar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AppLayout({ children, navigation, route }) {
  const currentRoute = route?.name || '';

  const sidebarItems = [
    {
      label: 'Home',
      screen: 'Home',
      icon: <MaterialCommunityIcons name="cash-register" size={24} />,
    },
    {
      label: 'Sales',
      screen: 'Sales',
      icon: <MaterialCommunityIcons name="receipt" size={24} />,
    },
    {
      label: 'Master',
      screen: 'Master',
      icon: <Ionicons name="apps" size={24} />,
    },
    {
      label: 'Report',
      screen: 'Report',
      icon: <Ionicons name="stats-chart" size={24} />,
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
