import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../firebase'; // Import your Firebase configuration

const PurchasedProductsScreen = () => {
  const [purchasedProducts, setPurchasedProducts] = useState([]);

  useEffect(() => {
    fetchPurchasedProducts();
  }, []);

  const fetchPurchasedProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'purchasedProducts'));
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });
      setPurchasedProducts(data);
    } catch (error) {
      console.error('Error fetching purchased products:', error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={purchasedProducts}
        keyExtractor={(item) => item.productId}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemText}>Product Name: {item.name}</Text>
            <Text style={styles.itemText}>Description: {item.description}</Text>
            <Text style={styles.itemText}>Price: ${item.totalPrice}</Text>
            <Text style={styles.itemText}>Quantity: {item.quantity}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  itemContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  itemText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default PurchasedProductsScreen;
