import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, Image, Dimensions } from 'react-native';
import COLORS from '../Consts/Color';
import PrimaryButton from '../components/Button';
import DynamicPage from './DynamicPage';

const Welcome = ({ navigation }) => {
  const [showButton, setShowButton] = useState(true);
  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    const timeout1 = setTimeout(() => {
      setShowButton(false);
      setShowImage(true);
    }, 2000); 
    const timeout2 = setTimeout(() => {
      navigation.navigate('Login');
    }, 5000); 
    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
    };
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={styles.textContainer}>
        {
          showButton &&
          <DynamicPage />
        }
        
        {showImage && (
          <Image
            source={require('../assets/welcom.jpeg')} 
            style={[styles.imageStyle, { width: Dimensions.get('window').width, height: Dimensions.get('window').height }]}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textContainer: {
    flex: 1,
    // paddingHorizontal: 50,
    justifyContent: 'space-between',
    // paddingBottom: 40,
  },
  imageStyle: {
    resizeMode: 'cover',
  },
});

export default Welcome;
