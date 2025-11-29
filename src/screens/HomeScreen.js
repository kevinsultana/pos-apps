import React from 'react';
import { View, Text, Button, StyleSheet, FlatList } from 'react-native';
import AppLayout from '../components/AppLayout';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import HeaderPos from '../components/pos/HeaderPos';

export default function HomeScreen({ navigation }) {
  const dummyReceipt = [
    { name: 'kopi susu', price: 10000 },
    { name: 'nasi goreng', price: 15000 },
    { name: 'mie ayam', price: 12000 },
    { name: 'kopi susu', price: 10000 },
    { name: 'nasi goreng', price: 15000 },
    { name: 'mie ayam', price: 12000 },
    { name: 'kopi susu', price: 10000 },
    { name: 'nasi goreng', price: 15000 },
    { name: 'mie ayam', price: 12000 },
    { name: 'kopi susu', price: 10000 },
    { name: 'nasi goreng', price: 15000 },
    { name: 'mie ayam', price: 12000 },
    { name: 'kopi susu', price: 10000 },
    { name: 'nasi goreng', price: 15000 },
    { name: 'mie ayam', price: 12000 },
  ];
  return (
    <AppLayout navigation={navigation} headerTitle="Home">
      <View style={{ flex: 1, width: wp(95) }}>
        <HeaderPos />

        {/* grid component */}
        <View style={{ flex: 1, flexDirection: 'row' }}>
          {/* receipt */}
          <View
            style={{
              flex: 1,
              backgroundColor: 'green',
              height: hp(90),
              position: 'relative',
            }}
          >
            {/* FlatList with extra bottom padding so items don't hide behind the sticky footer */}
            <FlatList
              data={dummyReceipt}
              keyExtractor={(item, idx) => String(idx)}
              contentContainerStyle={{ paddingBottom: hp(2) }}
              style={{ flex: 1 }}
              renderItem={({ item }) => (
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    paddingVertical: hp(1),
                    paddingHorizontal: wp(1),
                  }}
                >
                  <Text>{item.name}</Text>
                  <Text>RP {item.price}</Text>
                </View>
              )}
            />

            {/* Sticky footer (subtotal / totals) */}
            <View
              style={{
                height: hp(20),
                backgroundColor: 'yellow',
                paddingHorizontal: wp(1),
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: hp(1),
                }}
              >
                <Text>Sub Total</Text>
                <Text>Rp 123.456</Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Text>Discount</Text>
                <Text>Rp 123.456</Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Text>Tax</Text>
                <Text>Rp 123.456</Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: hp(1),
                }}
              >
                <Text style={{ fontWeight: '700', fontSize: hp(3) }}>
                  Total :
                </Text>
                <Text style={{ fontWeight: '700', fontSize: hp(3) }}>
                  Rp 123.456
                </Text>
              </View>
            </View>

            {/* bottom button */}
            <View
              style={{
                height: hp(10),
                backgroundColor: 'skyblue',
                paddingHorizontal: wp(2),
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Text>Button</Text>
              <Text>Button</Text>
              <Text>Button</Text>
            </View>
          </View>

          <View style={{ flex: 2, backgroundColor: 'blue' }}>
            <View style={{ flex: 6 }}>
              {/* tolong buatkan list itemnya disini dengan flatlist dan dummy data */}
            </View>
            <View style={{ flex: 1, backgroundColor: 'white' }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  flex: 1,
                }}
              >
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

const styles = StyleSheet.create({});
