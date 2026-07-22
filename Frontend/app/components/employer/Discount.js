
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Client from '../../api/Client';
import { Linking } from 'react-native';

const Discount = () => {
  const [discountItems, setDiscountItems] = useState([]);

  useFocusEffect(
    useCallback(() => {
      loadDiscountItems();
    }, [])
  );

  const loadDiscountItems = async () => {
    try {
      const res = await Client.get('/items');
      // Filter only items that have a discountPrice and it is less than the original price
      const discounted = res.data.filter(item => item.discountPrice && item.discountPrice < item.price);
      setDiscountItems(discounted);
    } catch (err) {
      console.log('Error fetching discount items', err);
    }
  };

  const handleBuyNow = async (item) => {
    try {
        // Price + 2% fee handled on backend or we can just send price
        const res = await Client.post('/payment/checkout', {
            title: `Discounted Item: ${item.name}`,
            amount: item.discountPrice,
            bookingId: `ITEM-${item.id}` // Pseudo booking ID for items
        });
        if (res.data && res.data.url) {
            Linking.openURL(res.data.url);
        } else {
            Alert.alert("Error", "Could not generate payment link");
        }
    } catch (err) {
        console.error(err);
        Alert.alert("Payment Error", "Something went wrong initializing checkout.");
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={styles.placeholderImage}>
          <Text style={styles.placeholderText}>No Image</Text>
        </View>
      )}
      <View style={styles.details}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
        <Text style={styles.roleText}>For: {item.worktype?.name || 'General'}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.oldPrice}>LKR {Number(item.price).toFixed(2)}</Text>
          <Text style={styles.newPrice}>LKR {Number(item.discountPrice).toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.buyButton} onPress={() => handleBuyNow(item)}>
          <Text style={styles.buyButtonText}>Buy Now via Stripe</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Special Discounts!</Text>
      <Text style={styles.subtitle}>Check out these discounted items added by the admin.</Text>
      
      <FlatList
        data={discountItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListEmptyComponent={<Text style={styles.emptyText}>No discounts available right now. Check back later!</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8fafc' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1e293b', marginBottom: 5 },
  subtitle: { fontSize: 16, color: '#64748b', marginBottom: 20 },
  card: { backgroundColor: '#fff', borderRadius: 12, marginBottom: 16, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 3 },
  image: { width: '100%', height: 150 },
  placeholderImage: { width: '100%', height: 150, backgroundColor: '#e2e8f0', justifyContent: 'center', alignItems: 'center' },
  placeholderText: { color: '#94a3b8', fontSize: 16 },
  details: { padding: 15 },
  name: { fontSize: 20, fontWeight: 'bold', color: '#1e293b', marginBottom: 4 },
  description: { fontSize: 14, color: '#475569', marginBottom: 8 },
  roleText: { fontSize: 12, color: '#0ea5e9', fontWeight: 'bold', marginBottom: 12, textTransform: 'uppercase' },
  priceRow: { flexDirection: 'row', alignItems: 'center' },
  oldPrice: { fontSize: 16, color: '#9ca3af', textDecorationLine: 'line-through', marginRight: 12 },
  newPrice: { fontSize: 22, fontWeight: '800', color: '#10b981' },
  buyButton: { backgroundColor: '#000', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 12 },
  buyButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  emptyText: { textAlign: 'center', color: '#94a3b8', fontStyle: 'italic', marginTop: 40 }
});

export default Discount;
