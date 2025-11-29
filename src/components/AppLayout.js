import React from 'react';
import { View, StyleSheet } from 'react-native';
import PersistentSidebar from './PersistentSidebar';
import HomeIcon from '../assets/svg/HomeIcon';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

export default function AppLayout({ children, navigation }) {
  const sidebarItems = [
    { label: 'Home', screen: 'Home', icon: <HomeIcon /> },
    { label: 'Details', screen: 'Details', params: { itemId: 99 } },
    { label: 'Logout', onPress: () => console.log('Logout pressed') },
  ];
  return (
    <View style={styles.root}>
      <PersistentSidebar items={sidebarItems} navigation={navigation} />
      <View style={styles.content} pointerEvents="box-none">
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff', position: 'relative' },
  content: { flex: 1, marginLeft: wp(5) },
});
