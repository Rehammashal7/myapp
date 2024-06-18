// App.js
import React, { useState, useEffect } from 'react';
import { View, Button, Image, StyleSheet, Text, ScrollView } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import '@tensorflow/tfjs-react-native';
import firestore from '@react-native-firebase/firestore';

const ImageSearch = () => {
  const [imageUri, setImageUri] = useState(null);
  const [model, setModel] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);

  useEffect(() => {
    const loadModel = async () => {
      await tf.ready();
      const model = await mobilenet.load();
      setModel(model);
    };
    loadModel();
  }, []);

  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (!response.didCancel && !response.errorCode) {
        setImageUri(response.assets[0].uri);
      }
    });
  };

  const findSimilarProducts = async () => {
    if (!imageUri || !model) return;

    const response = await fetch(imageUri);
    const imageBlob = await response.blob();
    const imageTensor = await tf.browser.fromPixels(imageBlob).resizeNearestNeighbor([224, 224]).toFloat().expandDims();
    const imageFeatures = model.infer(imageTensor, true).dataSync();

    const productsSnapshot = await firestore().collection('woman').get();
    const products = productsSnapshot.docs.map(doc => doc.data());

    const similarProducts = products.filter(product => {
      const distance = tf.norm(tf.sub(tf.tensor(imageFeatures), tf.tensor(product.features))).dataSync()[0];
      return distance < 5; // يمكنك تعديل هذا الحد وفقًا للاحتياج
    });

    setSimilarProducts(similarProducts);
  };

  return (
    <View style={styles.container}>
      <Button title="Choose Image" onPress={pickImage} />
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      {imageUri && <Button title="Find Similar Products" onPress={findSimilarProducts} />}
      <ScrollView>
        {similarProducts.map((product, index) => (
          <View key={index} style={styles.product}>
            <Image source={{ uri: product.imagePath }} style={styles.productImage} />
            <Text>{product.name}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
  },
  product: {
    marginTop: 20,
    alignItems: 'center',
  },
  productImage: {
    width: 100,
    height: 100,
  },
});

export default ImageSearch;
