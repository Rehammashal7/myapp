

import React from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';

const waitingitem = ({ route }) => {
  const { items } = route.params; // Get the items array passed from navigation

  // Function to extract the first image URL from the images array
  const getFirstImageUrl = (item) => {
    return item.imageUrl && item.imageUrl.length > 0 ? item.imageUrl[0] : null;
  };

  const renderItem = ({ item }) => {
    const firstImageUrl = getFirstImageUrl(item);

    return (
      <View style={styles.itemContainer}>
        {/* Left-aligned image */}
        {firstImageUrl && (
          <Image source={{ uri: firstImageUrl }} style={styles.itemImage} />
        )}
        <View style={styles.itemDetails}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.price}>Price: {item.totalPrice} EGP</Text>
          <Text style={styles.quantity}>Quantity: {item.quantity}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={renderItem}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  itemContainer: {
    flexDirection: 'row', // Align items in a row
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    overflow: 'hidden', // Ensure images do not overflow container
  },
  itemImage: {
    width: 150, // Fixed width for the image
    height: '100%', // Take full height of the container
    resizeMode: 'cover',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  itemDetails: {
    flex: 1,
    padding: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    marginBottom: 5,
  },
  quantity: {
    fontSize: 14,
  },
  flatListContent: {
    paddingBottom: 20,
  },
});

export default waitingitem;
