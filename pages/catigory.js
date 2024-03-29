import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, Image, TouchableOpacity, StyleSheet, FlatList, Pressable,
    ScrollView, Dimensions, TouchableWithoutFeedback
} from 'react-native';
import Countdown from 'react-native-countdown-component'
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import FoodCard from '../components/Foodcard';
import Icon from 'react-native-vector-icons/FontAwesome';
import Food, { Offer, filterData } from '../data';
import COLORS from '../Consts/Color';
import Search from '../components/search';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNavigator from '../components/bar';

const category = ({ navigation }) => {
    return (
        <View>
            <View>
                <Text style={styles.Text}>category</Text>
            </View>
            <BottomNavigator item="catigory" navigation={navigation} />
        </View>
    )
}
const styles = StyleSheet.create({
    NavContainer: {
        position: 'absolute',
        alignItems: 'center',
        bottom: 1,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
    },
    Navbar: {
        flexDirection: 'row',
        backgroundColor: COLORS.white,

        justifyContent: 'space-evenly',
        height: 60

    },
    iconBehave: {
        alignItems: 'center',
        marginTop: 3
    },
    Text: {
        fontWeight: "bold",
        color: COLORS.dark,
        marginTop: 60
    }
});
export default category;