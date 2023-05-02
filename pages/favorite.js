import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList } from 'react-native';

const Favorite = ({navigation}) => {
return(

    <view style={styles.container } >
        <text style={styles.heading } >Welcome to favorite </text>
    </view>
)};
const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: '#FBFAFF',
    alignItems: 'center',
    justifyContent: 'center',
    },
    heading:{
        color: "black",
        fontSize : 40 ,
        alignItems: 'center',
        fontWeight : 'bold',
        marginBottom :10 ,

    },
});

export default Favorite;