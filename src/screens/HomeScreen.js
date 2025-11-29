import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import AppLayout from '../components/AppLayout';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import HeaderPos from '../components/pos/HeaderPos';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useCart } from '../context/CartContext';

export default function HomeScreen({ navigation, route }) {
  const [searchText, setSearchText] = useState('');
  const {
    cartItems,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    getSubTotal,
    getTax,
    getDiscount,
    getTotal,
  } = useCart();

  const dummyProducts = [
    { id: 1, name: 'Kopi Hitam', price: 8000, category: 'Minuman', stock: 50 },
    { id: 2, name: 'Kopi Susu', price: 10000, category: 'Minuman', stock: 45 },
    { id: 3, name: 'Teh Manis', price: 5000, category: 'Minuman', stock: 60 },
    { id: 4, name: 'Jus Jeruk', price: 12000, category: 'Minuman', stock: 30 },
    {
      id: 5,
      name: 'Nasi Goreng',
      price: 15000,
      category: 'Makanan',
      stock: 25,
    },
    { id: 6, name: 'Mie Goreng', price: 14000, category: 'Makanan', stock: 28 },
    { id: 7, name: 'Mie Ayam', price: 12000, category: 'Makanan', stock: 32 },
    {
      id: 8,
      name: 'Ayam Geprek',
      price: 18000,
      category: 'Makanan',
      stock: 20,
    },
    { id: 9, name: 'Sate Ayam', price: 20000, category: 'Makanan', stock: 15 },
    { id: 10, name: 'Bakso', price: 13000, category: 'Makanan', stock: 22 },
    { id: 11, name: 'Es Teh', price: 4000, category: 'Minuman', stock: 70 },
    { id: 12, name: 'Es Jeruk', price: 6000, category: 'Minuman', stock: 55 },
    {
      id: 13,
      name: 'Cappuccino',
      price: 15000,
      category: 'Minuman',
      stock: 18,
    },
    { id: 14, name: 'Latte', price: 16000, category: 'Minuman', stock: 20 },
    { id: 15, name: 'Roti Bakar', price: 10000, category: 'Snack', stock: 35 },
    {
      id: 16,
      name: 'Pisang Goreng',
      price: 8000,
      category: 'Snack',
      stock: 40,
    },
    {
      id: 17,
      name: 'Kentang Goreng',
      price: 12000,
      category: 'Snack',
      stock: 30,
    },
    { id: 18, name: 'Nugget', price: 14000, category: 'Snack', stock: 25 },
  ];

  const filteredProducts = dummyProducts.filter(product =>
    product.name.toLowerCase().includes(searchText.toLowerCase()),
  );
  return (
    <AppLayout navigation={navigation} route={route} headerTitle="Home">
      <View style={styles.container}>
        <HeaderPos />

        {/* grid component */}
        <View style={styles.gridContainer}>
          {/* receipt */}
          <View style={styles.receiptContainer}>
            {/* FlatList with extra bottom padding so items don't hide behind the sticky footer */}
            <FlatList
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
                  <View style={styles.receiptItemInfo}>
                    <Text style={styles.receiptItemName}>{item.name}</Text>
                    <Text style={styles.receiptItemQty}>x{item.quantity}</Text>
                  </View>
                  <View style={styles.receiptItemActions}>
                    <Text style={styles.receiptItemPrice}>
                      Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                    </Text>
                    <View style={styles.receiptItemButtons}>
                      <TouchableOpacity
                        onPress={() => decreaseQuantity(item.id)}
                        style={styles.qtyButton}
                      >
                        <Ionicons name="remove" size={hp(2)} color="#fff" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => increaseQuantity(item.id)}
                        style={styles.qtyButton}
                      >
                        <Ionicons name="add" size={hp(2)} color="#fff" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => removeFromCart(item.id)}
                        style={styles.deleteButton}
                      >
                        <Ionicons name="trash" size={hp(2)} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
            />

            {/* Sticky footer (subtotal / totals) */}
            <View style={styles.receiptFooter}>
              <View style={styles.summaryRowFirst}>
                <Text>Sub Total</Text>
                <Text>Rp {getSubTotal().toLocaleString('id-ID')}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text>Discount</Text>
                <Text>Rp {getDiscount().toLocaleString('id-ID')}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text>Tax (10%)</Text>
                <Text>Rp {getTax().toLocaleString('id-ID')}</Text>
              </View>
              <View style={styles.summaryRowFirst}>
                <Text style={styles.totalLabel}>Total :</Text>
                <Text style={styles.totalValue}>
                  Rp {getTotal().toLocaleString('id-ID')}
                </Text>
              </View>
            </View>

            {/* bottom button */}
            <View style={styles.receiptBottomButtons}>
              <Text>Button</Text>
              <Text>Button</Text>
              <Text>Button</Text>
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
                </View>
                <TouchableOpacity style={styles.cameraButton}>
                  <Ionicons name="camera" size={hp(3.5)} color="#fff" />
                </TouchableOpacity>
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
            <View style={styles.productsBottomBar}>
              <View style={styles.productsBottomButtons}>
                <Text>Button</Text>
                <Text>Button</Text>
                <Text>Button</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: wp(95),
  },
  gridContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  receiptContainer: {
    flex: 1,
    backgroundColor: 'green',
    height: hp(90),
    position: 'relative',
  },
  receiptList: {
    flex: 1,
  },
  receiptListContent: {
    paddingBottom: hp(2),
  },
  receiptItem: {
    flexDirection: 'column',
    paddingVertical: hp(1),
    paddingHorizontal: wp(2),
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  receiptItemInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(0.5),
  },
  receiptItemName: {
    fontSize: hp(2),
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  receiptItemQty: {
    fontSize: hp(1.8),
    color: '#666',
    marginLeft: wp(2),
  },
  receiptItemActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  receiptItemPrice: {
    fontSize: hp(1.8),
    fontWeight: '600',
    color: '#007AFF',
  },
  receiptItemButtons: {
    flexDirection: 'row',
    gap: wp(1),
  },
  qtyButton: {
    backgroundColor: '#007AFF',
    width: hp(3.5),
    height: hp(3.5),
    borderRadius: hp(0.5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    width: hp(3.5),
    height: hp(3.5),
    borderRadius: hp(0.5),
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
    height: hp(20),
    backgroundColor: 'yellow',
    paddingHorizontal: wp(1),
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryRowFirst: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(1),
  },
  totalLabel: {
    fontWeight: '700',
    fontSize: hp(3),
  },
  totalValue: {
    fontWeight: '700',
    fontSize: hp(3),
  },
  receiptBottomButtons: {
    height: hp(10),
    backgroundColor: 'skyblue',
    paddingHorizontal: wp(2),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productsContainer: {
    flex: 2,
    backgroundColor: 'blue',
  },
  productsMainArea: {
    flex: 6,
  },
  productsBottomBar: {
    flex: 1,
    backgroundColor: 'white',
  },
  productsBottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: wp(1),
    paddingVertical: hp(2),
    gap: wp(2),
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: hp(2),
    paddingHorizontal: wp(2),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: wp(2),
  },
  searchInput: {
    flex: 1,
    height: hp(6),
    fontSize: hp(2),
    color: '#333',
  },
  cameraButton: {
    width: hp(6),
    height: hp(6),
    backgroundColor: '#007AFF',
    borderRadius: hp(1),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  productListContainer: {
    padding: wp(1),
    backgroundColor: 'white',
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: wp(1),
    marginBottom: hp(1.5),
    borderRadius: hp(1.5),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productIcon: {
    width: hp(7),
    height: hp(7),
    backgroundColor: '#f0f0f0',
    borderRadius: hp(1),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(3),
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
    backgroundColor: '#E8F4FF',
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.3),
    borderRadius: hp(0.8),
  },
  categoryText: {
    fontSize: hp(1.5),
    color: '#007AFF',
    fontWeight: '500',
  },
  productStock: {
    fontSize: hp(1.6),
    color: '#666',
  },
  productPrice: {
    fontSize: hp(2.2),
    fontWeight: '700',
    color: '#007AFF',
    marginLeft: wp(2),
  },
});
