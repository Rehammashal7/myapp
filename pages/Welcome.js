import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { ImageBackground } from 'react-native';
import backGround from '../assets/Pizza1.jpg';


const Welcome = ({navigation}) => {
    const handleSignIn = () => {
        navigation.navigate("Login");
    };
    const handleSignUp = () => {
        navigation.navigate("SignUp");
    };
return(
    <view>
    <ImageBackground  source = {backGround}
   
    style = {styles.backGroundimage} >
    <text style={styles.heading } >Welcome to myApp</text>
    <TouchableOpacity
        onPress={handleSignIn}
        style={styles.buttonContainer}>
        <text style={styles.buttonText}> sign in </text>
    </TouchableOpacity>
    <TouchableOpacity
        onPress={handleSignUp}
        style={styles.buttonContainer}>
        <text style={styles.buttonText}> sign up </text>
    </TouchableOpacity>
    </ImageBackground>
    </view>
);
};

const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: '#FFE4E1',
    alignItems: 'center',
    justifyContent: 'center',
    },
    heading:{
        color: "white",
        fontSize : 40 ,
        alignItems: 'center',
        fontWeight : 'bold',
        marginBottom :10 ,

    },
    backGroundimage : {
        backgroundColor:'while',
        width:390, 
        height : 844,
        alignItems: 'center',
        justifyContent: 'center' ,   
    },
    buttonText: {
        color: '#FFDE9B',
        fontSize: 20,
        fontWeight: 'bold',
    },
    buttonContainer: {
        backgroundColor: '#000000',
        borderRadius: 10,
        padding: 10,
        width: '50%',
        alignItems: 'center',
        marginBottom :10 ,

      },
    
});


export default Welcome;