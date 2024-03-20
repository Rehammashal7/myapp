import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
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
            <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
            <View style={styles.itemInfoContainer}>
              <Text style={styles.itemText}>Product Name: {item.name}</Text>
              <Text style={styles.itemText}>Description: {item.description}</Text>
              <Text style={styles.itemText}>Price: ${item.totalPrice}</Text>
              <Text style={styles.itemText}>Quantity: {item.quantity}</Text>
              <Text style={styles.itemText}>Timestamp: {item.timestamp ? new Date(item.timestamp.seconds * 1000).toLocaleString() : 'N/A'}</Text>
            </View>
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
    flexDirection: 'row', // Arrange items horizontally
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  itemImage: {
    width: 100, // Adjust image width as needed
    height: 100, // Adjust image height as needed
    resizeMode: 'cover',
    marginRight: 10, // Add spacing between image and text
  },
  itemInfoContainer: {
    flex: 1, // Take remaining space
  },
  itemText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});


export default PurchasedProductsScreen;
