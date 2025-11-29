import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Platform,
  ToastAndroid,
  Animated,
} from 'react-native';
import AppLayout from '../components/AppLayout';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useCart } from '../context/CartContext';
import ModalCamera from '../components/ModalCamera';

export default function HomeScreen({ navigation, route }) {
  const [searchText, setSearchText] = useState('');
  const [showCam, setShowCam] = useState(false);
  const receiptListRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const {
    cartItems,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    getTotal,
  } = useCart();

  // Auto-scroll to bottom when cart items change
  useEffect(() => {
    if (cartItems.length > 0 && receiptListRef.current) {
      receiptListRef.current.scrollToEnd({ animated: true });
    }
  }, [cartItems.length]);

  const dummyProducts = [
    {
      id: 1,
      name: 'Kopi Hitam',
      price: 8000,
      category: 'Minuman',
      stock: 50,
      barcode: '123456789012',
    },
    {
      id: 2,
      name: 'Kopi Susu',
      price: 10000,
      category: 'Minuman',
      stock: 45,
      barcode: '8991001000002',
    },
    {
      id: 3,
      name: 'Teh Manis',
      price: 5000,
      category: 'Minuman',
      stock: 60,
      barcode: '8991001000003',
    },
    {
      id: 4,
      name: 'Jus Jeruk',
      price: 12000,
      category: 'Minuman',
      stock: 30,
      barcode: '8991001000004',
    },
    {
      id: 5,
      name: 'Nasi Goreng',
      price: 15000,
      category: 'Makanan',
      stock: 25,
      barcode: '8991001000005',
    },
    {
      id: 6,
      name: 'Mie Goreng',
      price: 14000,
      category: 'Makanan',
      stock: 28,
      barcode: '8991001000006',
    },
    {
      id: 7,
      name: 'Mie Ayam',
      price: 12000,
      category: 'Makanan',
      stock: 32,
      barcode: '8991001000007',
    },
    {
      id: 8,
      name: 'Ayam Geprek',
      price: 18000,
      category: 'Makanan',
      stock: 20,
      barcode: '8991001000008',
    },
    {
      id: 9,
      name: 'Sate Ayam',
      price: 20000,
      category: 'Makanan',
      stock: 15,
      barcode: '8991001000009',
    },
    {
      id: 10,
      name: 'Bakso',
      price: 13000,
      category: 'Makanan',
      stock: 22,
      barcode: '8991001000010',
    },
    {
      id: 11,
      name: 'Es Teh',
      price: 4000,
      category: 'Minuman',
      stock: 70,
      barcode: '8991001000011',
    },
    {
      id: 12,
      name: 'Es Jeruk',
      price: 6000,
      category: 'Minuman',
      stock: 55,
      barcode: '8991001000012',
    },
    {
      id: 13,
      name: 'Cappuccino',
      price: 15000,
      category: 'Minuman',
      stock: 18,
      barcode: '8991001000013',
    },
    {
      id: 14,
      name: 'Latte',
      price: 16000,
      category: 'Minuman',
      stock: 20,
      barcode: '8991001000014',
    },
    {
      id: 15,
      name: 'Roti Bakar',
      price: 10000,
      category: 'Snack',
      stock: 35,
      barcode: '8991001000015',
    },
    {
      id: 16,
      name: 'Pisang Goreng',
      price: 8000,
      category: 'Snack',
      stock: 40,
      barcode: '8991001000016',
    },
    {
      id: 17,
      name: 'Kentang Goreng',
      price: 12000,
      category: 'Snack',
      stock: 30,
      barcode: '8991001000017',
    },
    {
      id: 18,
      name: 'Nugget',
      price: 14000,
      category: 'Snack',
      stock: 25,
      barcode: '8991001000018',
    },
  ];

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'Makanan', name: 'Makanan' },
    { id: 'Minuman', name: 'Minuman' },
    { id: 'Snack', name: 'Snack' },
  ];

  // Animated values per category (0 = normal, 1 = selected)
  const categoryAnim = useRef({}).current;
  categories.forEach(cat => {
    if (!categoryAnim[cat.id]) {
      categoryAnim[cat.id] = new Animated.Value(
        cat.id === selectedCategory ? 1 : 0,
      );
    }
  });

  // Animate when selectedCategory changes
  useEffect(() => {
    categories.forEach(cat => {
      Animated.timing(categoryAnim[cat.id], {
        toValue: cat.id === selectedCategory ? 1 : 0,
        duration: 220,
        useNativeDriver: true, // scale & opacity only
      }).start();
    });
  }, [selectedCategory]);

  // Filter products by search text and selected category
  const filteredProducts = dummyProducts.filter(product => {
    const q = searchText.trim().toLowerCase();
    const matchesSearch = !q
      ? true
      : [product.name, product.category, product.barcode]
          .filter(Boolean)
          .some(v => String(v).toLowerCase().includes(q));
    const matchesCategory =
      selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  return (
    <AppLayout navigation={navigation} route={route} headerTitle="Home">
      <View style={styles.container}>
        {/* grid component */}
        <View style={styles.gridContainer}>
          {/* receipt */}
          <View style={styles.receiptContainer}>
            {/* FlatList with extra bottom padding so items don't hide behind the sticky footer */}
            <FlatList
              ref={receiptListRef}
              data={cartItems}
              keyExtractor={(item, idx) => String(idx)}
              contentContainerStyle={styles.receiptListContent}
              style={styles.receiptList}
              ListEmptyComponent={
                <View style={styles.emptyCart}>
                  <Ionicons name="cart-outline" size={hp(5)} color="#999" />
                  <Text style={styles.emptyCartText}>Keranjang kosong</Text>
                </View>
              }
              renderItem={({ item }) => (
                <View style={styles.receiptItem}>
                  <View style={styles.receiptLeft}>
                    <Text style={styles.receiptItemName}>{item.name}</Text>
                    <Text style={styles.receiptItemSub}>
                      x{item.quantity} • Rp{' '}
                      {(item.price * item.quantity).toLocaleString('id-ID')}
                    </Text>
                  </View>
                  <View style={styles.receiptActions}>
                    <TouchableOpacity
                      onPress={() => decreaseQuantity(item.id)}
                      style={styles.actionButton}
                    >
                      <Ionicons name="remove" size={hp(2.4)} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => increaseQuantity(item.id)}
                      style={styles.actionButton}
                    >
                      <Ionicons name="add" size={hp(2.4)} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => removeFromCart(item.id)}
                      style={styles.actionDelete}
                    >
                      <Ionicons name="trash" size={hp(2.4)} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />

            {/* Simple footer: item count + total only */}
            <View style={styles.receiptFooter}>
              <View style={styles.footerRow}>
                <Text style={styles.footerItems}>
                  Items: {cartItems.reduce((sum, i) => sum + i.quantity, 0)}
                </Text>
                <Text style={styles.footerTotalLabel}>Total</Text>
              </View>
              <Text style={styles.footerTotalValue}>
                Rp {getTotal().toLocaleString('id-ID')}
              </Text>
            </View>
          </View>

          <View style={styles.productsContainer}>
            <View style={styles.productsMainArea}>
              {/* search bar and camera icon */}
              <View style={styles.searchContainer}>
                <View style={styles.searchInputWrapper}>
                  <Ionicons
                    name="search"
                    size={hp(3)}
                    color="#666"
                    style={styles.searchIcon}
                  />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search products..."
                    value={searchText}
                    onChangeText={setSearchText}
                    placeholderTextColor="#999"
                  />
                  {searchText.length > 0 && (
                    <TouchableOpacity
                      onPress={() => setSearchText('')}
                      style={styles.clearBtn}
                    >
                      <Ionicons
                        name="close-circle"
                        size={hp(3)}
                        color="#94a3b8"
                      />
                    </TouchableOpacity>
                  )}
                </View>
                <TouchableOpacity
                  style={styles.cameraButton}
                  onPress={() => setShowCam(true)}
                >
                  <Ionicons name="camera" size={hp(3.5)} color="#fff" />
                </TouchableOpacity>
              </View>

              {/* category selector */}
              <View style={styles.categorySelector}>
                <FlatList
                  data={categories}
                  keyExtractor={item => String(item.id)}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.categoryList}
                  renderItem={({ item }) => {
                    const anim = categoryAnim[item.id];
                    const scale = anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.08],
                    });
                    const opacity = anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.55, 1],
                    });
                    return (
                      <TouchableOpacity
                        onPress={() => setSelectedCategory(item.id)}
                        activeOpacity={0.85}
                      >
                        <Animated.View
                          style={[
                            styles.categoryItem,
                            {
                              transform: [{ scale }],
                              opacity,
                              backgroundColor:
                                item.id === selectedCategory
                                  ? '#2196F3'
                                  : '#fff',
                              borderColor: '#2196F3',
                              shadowOpacity:
                                item.id === selectedCategory ? 0.12 : 0.05,
                              elevation: item.id === selectedCategory ? 4 : 2,
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.categoryItemText,
                              item.id === selectedCategory &&
                                styles.selectedCategoryText,
                            ]}
                          >
                            {item.name}
                          </Text>
                        </Animated.View>
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>

              {/* Product List */}
              <FlatList
                data={filteredProducts}
                keyExtractor={item => String(item.id)}
                contentContainerStyle={styles.productListContainer}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.productItem}
                    onPress={() => addToCart(item)}
                  >
                    <View style={styles.productIcon}>
                      <Ionicons name="fast-food" size={hp(3.5)} color="#666" />
                    </View>
                    <View style={styles.productInfo}>
                      <Text style={styles.productName}>{item.name}</Text>
                      <View style={styles.productMeta}>
                        <View style={styles.categoryBadge}>
                          <Text style={styles.categoryText}>
                            {item.category}
                          </Text>
                        </View>
                        <Text style={styles.productStock}>
                          Stock: {item.stock}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.productPrice}>
                      Rp {item.price.toLocaleString('id-ID')}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
            {/* Floating action button to proceed to payment, shown when cart has items */}
            {cartItems && cartItems.length > 0 && (
              <TouchableOpacity
                style={styles.floatingButton}
                onPress={() => navigation.navigate('Pos')}
                activeOpacity={0.85}
              >
                <Ionicons
                  name="arrow-forward-circle"
                  size={hp(4)}
                  color="#fff"
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
      {/* Camera Modal */}
      <ModalCamera
        visible={showCam}
        onClose={() => setShowCam(false)}
        onResult={code => {
          // Fill search bar with scanned code
          setSearchText(code);

          // Find product by barcode
          const product = dummyProducts.find(
            p => String(p.barcode) === String(code),
          );
          setShowCam(false);

          if (!product) {
            if (Platform.OS === 'android') {
              ToastAndroid.show(
                'Barcode tidak valid: produk tidak ditemukan',
                ToastAndroid.SHORT,
              );
            }
            return;
          }

          if (product.stock <= 0) {
            if (Platform.OS === 'android') {
              ToastAndroid.show(
                'Stok habis: produk tidak tersedia',
                ToastAndroid.SHORT,
              );
            }
            return;
          }

          // Add to cart
          addToCart(product);
          if (Platform.OS === 'android') {
            ToastAndroid.show(
              'Produk ditambahkan ke keranjang',
              ToastAndroid.SHORT,
            );
          }
        }}
      />
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: wp(95),
    backgroundColor: '#f5f5f5',
  },
  gridContainer: {
    flex: 1,
    flexDirection: 'row',
    gap: wp(1),
  },
  receiptContainer: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'relative',
    borderRadius: hp(1),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'column',
  },
  receiptList: {
    flex: 1,
  },
  receiptListContent: {
    paddingBottom: hp(2),
  },
  receiptItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(2),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  receiptLeft: {
    flex: 1,
    paddingRight: wp(2),
  },
  receiptItemName: {
    fontSize: hp(2),
    fontWeight: '600',
    color: '#1a1a1a',
  },
  receiptItemSub: {
    fontSize: hp(1.8),
    color: '#666',
    marginTop: hp(0.3),
  },
  receiptActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1.5),
  },
  actionButton: {
    backgroundColor: '#4CAF50',
    width: hp(4.2),
    height: hp(4.2),
    borderRadius: hp(0.9),
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionDelete: {
    backgroundColor: '#f44336',
    width: hp(4.2),
    height: hp(4.2),
    borderRadius: hp(0.9),
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: hp(10),
  },
  emptyCartText: {
    fontSize: hp(2),
    color: '#999',
    marginTop: hp(2),
  },
  receiptFooter: {
    backgroundColor: '#ffffff',
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.8),
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(0.5),
  },
  footerItems: {
    fontSize: hp(1.8),
    color: '#555',
    fontWeight: '500',
  },
  footerTotalLabel: {
    fontSize: hp(1.8),
    fontWeight: '600',
    color: '#1a1a1a',
  },
  footerTotalValue: {
    fontWeight: '700',
    fontSize: hp(2.3),
    color: '#4CAF50',
    textAlign: 'right',
  },

  productsContainer: {
    flex: 2,
    backgroundColor: '#fff',
    borderRadius: hp(1),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  productsMainArea: {
    flex: 6,
    backgroundColor: '#f8f9fa',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: wp(2),
    paddingVertical: hp(2),
    gap: wp(2),
    backgroundColor: '#fff',
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: hp(1),
    paddingHorizontal: wp(2),
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchIcon: {
    marginRight: wp(1),
  },
  searchInput: {
    flex: 1,
    fontSize: hp(2),
    color: '#333',
  },
  clearBtn: {
    paddingHorizontal: wp(0.5),
    paddingVertical: hp(0.3),
  },
  cameraButton: {
    width: hp(6),
    height: hp(6),
    backgroundColor: '#2196F3',
    borderRadius: hp(1),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  productListContainer: {
    padding: wp(2),
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: wp(2),
    marginBottom: hp(1.5),
    borderRadius: hp(1),
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  productIcon: {
    width: hp(7),
    height: hp(7),
    backgroundColor: '#f8f9fa',
    borderRadius: hp(1),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(3),
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: hp(2.2),
    fontWeight: '600',
    color: '#333',
    marginBottom: hp(0.5),
  },
  productMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
  },
  categoryBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.3),
    borderRadius: hp(0.8),
  },
  categoryText: {
    fontSize: hp(1.5),
    color: '#2196F3',
    fontWeight: '600',
  },
  productStock: {
    fontSize: hp(1.6),
    color: '#757575',
  },
  productPrice: {
    fontSize: hp(2.2),
    fontWeight: '700',
    color: '#4CAF50',
    marginLeft: wp(2),
  },
  floatingButton: {
    position: 'absolute',
    right: wp(1),
    bottom: wp(0.5),
    width: hp(8.5),
    height: hp(6.5),
    borderRadius: hp(3.25),
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  // Category selector styles
  categorySelector: {
    backgroundColor: '#fff',
    paddingVertical: hp(1),
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  categoryList: {
    paddingHorizontal: wp(2),
  },
  categoryItem: {
    marginRight: wp(2),
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.8),
    borderRadius: hp(3),
    borderWidth: 1,
    borderColor: '#2196F3',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedCategory: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
    elevation: 3,
  },
  categoryItemText: {
    fontSize: hp(1.7),
    fontWeight: '600',
    color: '#2196F3',
  },
  selectedCategoryText: {
    color: '#fff',
  },
});

// Camera modal for barcode scanning
// On successful scan: fill search, validate product, add to cart
// On failure: show alert message
