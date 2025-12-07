import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../context/AuthContext';

// Responsive sizes (use sensible fallbacks)
const COLLAPSED_WIDTH = wp(5);
const EXPANDED_WIDTH = wp(25);
const TOP_ROW_HEIGHT = wp(6);
const ICON_WRAP_SIZE = wp(3);

export default function PersistentSidebar({
  items = [],
  navigation,
  initialCollapsed = false,
  currentRoute = '',
}) {
  const [collapsed, setCollapsed] = useState(initialCollapsed);
  const widthAnim = useRef(
    new Animated.Value(initialCollapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH),
  ).current;

  const { userData, companyData } = useAuth();

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [collapsed, widthAnim]);

  const onPressItem = item => {
    if (typeof item.onPress === 'function') item.onPress();
    else if (navigation && item.screen)
      navigation.replace(item.screen, item.params);
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { width: widthAnim, transform: [{ translateX: 0 }] },
      ]}
    >
      <View style={[styles.topRow]}>
        <TouchableOpacity
          onPress={() => setCollapsed(v => !v)}
          style={styles.toggleBtn}
        >
          <Ionicons name="menu" size={24} color="#111" />
        </TouchableOpacity>
        {!collapsed && (
          <View style={styles.userInfo}>
            <View style={styles.avatarCircle}>
              <Ionicons name="person" size={20} color="#2196F3" />
            </View>
            <View style={styles.userTexts}>
              <Text style={styles.userName} numberOfLines={1}>
                {userData?.user.username}
              </Text>
              <Text style={styles.userRole} numberOfLines={1}>
                {userData.user.roles.map(r => r).join(', ')}
              </Text>
              <View style={styles.storeRow}>
                <Ionicons name="storefront-outline" size={12} color="#64748b" />
                <Text style={styles.storeName} numberOfLines={1}>
                  {companyData?.name}
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.items}>
        {items.map((it, idx) => {
          let isActive = currentRoute === it.screen;
          // Special case: Master screen should be active for all Master* screens
          if (it.screen === 'Master' && currentRoute?.startsWith('Master')) {
            isActive = true;
          }
          return (
            <TouchableOpacity
              key={it.key ?? `${idx}-${String(it.label)}`}
              style={styles.itemRow}
              onPress={() => onPressItem(it)}
            >
              <View style={styles.iconWrap}>
                {it.icon ? (
                  React.cloneElement(it.icon, {
                    color: isActive ? '#111' : '#999',
                  })
                ) : (
                  <Ionicons
                    name="ellipse"
                    size={24}
                    color={isActive ? '#111' : '#999'}
                  />
                )}
              </View>
              {!collapsed && (
                <Text
                  numberOfLines={1}
                  style={[
                    styles.itemLabel,
                    { color: isActive ? '#111' : '#999' },
                  ]}
                >
                  {it.label}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.bottomFill} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#fff',
    borderRightWidth: 1,
    borderRightColor: '#e6e6e6',
    zIndex: 50,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  topRow: {
    height: 'auto',
    minHeight: TOP_ROW_HEIGHT,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft: 8,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e6e6e6',
    marginBottom: 8,
  },
  toggleBtn: {
    width: wp(4),
    height: wp(4),
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 6,
    width: '100%',
  },
  avatarCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  userTexts: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    fontSize: hp(2.5),
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 2,
    textTransform: 'capitalize',
  },
  userRole: {
    fontSize: hp(2),
    fontWeight: '500',
    color: '#64748b',
    marginBottom: 4,
  },
  storeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  storeName: {
    fontSize: hp(2),
    color: '#64748b',
    fontStyle: 'italic',
  },
  items: { paddingVertical: 8 },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  iconWrap: {
    width: ICON_WRAP_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemLabel: {
    marginLeft: 8,
    fontSize: hp(3),
    color: '#111',
  },
  bottomFill: { flex: 1 },
});
