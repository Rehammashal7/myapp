import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList } from 'react-native';

const favorite = ({navigation}) => {
return(

    <view style={styles.container } >
        <text style={styles.heading } >Welcome to myApp</text>
    </view>
)};
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
});

export default favorite;