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
      </View>

      <ScrollView contentContainerStyle={styles.items}>
        {items.map((it, idx) => {
          const isActive = currentRoute === it.screen;
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
    height: TOP_ROW_HEIGHT,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft: 8,
  },
  toggleBtn: {
    width: wp(4),
    height: wp(4),
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
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
