import React from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';

const ProductItem = ({ item }) => (
  <View style={styles.itemContainer}>
    <Image source={{ uri: item.imageUrl }} style={styles.image} />
    <Text style={styles.name}>{item.name}</Text>
    <Text style={styles.description}>{item.description}</Text>
    <Text style={styles.price}>Price: ${item.price}</Text>
  </View>
);

const ProductPage = ({ products }) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ProductItem item={item} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  itemContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'green',
  },
});

export default ProductPage;
