import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const ProductsListPizza = ({ navigation }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      const productsCollection = collection(db, 'products');
      const productsSnapshot = await getDocs(productsCollection);
      const productsData = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(productsData);
    };
    getProducts();
  }, []);

  const handleProductPress = (product) => {
    navigation.navigate('PizzaDetails', { product });
  };

  const renderProduct = ({ item }) => (
    <TouchableOpacity onPress={() => handleProductPress(item)}>
      <View>
        <Text>{item.name}</Text>
        <Text>{item.description}</Text>
        <Image source={{ uri: item.imageUrl }} style={{ width: 200, height: 200 }} />
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={products}
      renderItem={renderProduct}
      keyExtractor={(item) => item.id}
    />
  );
};

const PizzaDetails = ({ route }) => {
  const { product } = route.params;

  return (
    <View>
      <Text>{product.name}</Text>
      <Text>{product.description}</Text>
      <Text>{product.price}</Text>
      <Text>{product.rating}</Text>
      <Image source={{ uri: product.imageUrl }} style={{ width: 200, height: 200 }} />
      {/* display other product details */}
    </View>
  );
};

export { ProductsListPizza, PizzaDetails };
