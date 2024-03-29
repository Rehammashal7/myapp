import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableWithoutFeedback, Image } from 'react-native';
import { useFonts } from 'expo-font';

const DynamicPage = () => {
    const [animatedValue] = useState(new Animated.Value(0));
    const [fontsLoaded] = useFonts({
        SofiaRegular: require('../assets/Sofia-Regular.ttf'),
      });
      
    useEffect(() => {
        Animated.loop(
            Animated.timing(animatedValue, {
                toValue: 1,
                duration: 2000,
                useNativeDriver: false,
            })
        ).start();
    }, []);

    const interpolateColor = animatedValue.interpolate({
        inputRange: [0, 0.3, 0.7, 1],
        outputRange: ['#D2B48C', '#543E2A', '#2C2923', '#000000'],
    });

    const handlePress = () => {
    };

    return (
        <View style={styles.container}>
                        <Image source={require('../assets/Woman.jpeg')} style={styles.image} />
            <TouchableWithoutFeedback onPress={handlePress}>
                <Animated.Text style={{ ...styles.text, transform: [{ translateX: animatedValue.interpolate({ inputRange: [0, 1], outputRange: [0, -200] }) }], color: interpolateColor }} >A to Z</Animated.Text>
            </TouchableWithoutFeedback>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    text: {
        fontSize: 70,
        fontWeight: 'bold',
        fontFamily: 'SofiaRegular',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 5, height: 5 },
        textShadowRadius: 5,
    },
    image: {
        width: 100, 
        height: 100,
        borderRadius: 25, 
        marginTop: 20, 
    },
  
});

export default DynamicPage;
