import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet,Pressable, FlatList } from 'react-native';
import COLORS from '../Consts/Color';
import Icon from 'react-native-vector-icons/FontAwesome';
const Favorite = ({navigation}) => {
return(

    <View style={styles.container } >
        <text style={styles.heading } >Welcome to favorite </text>
        <View style={styles.NavContainer} >
                <View style={styles.Navbar} >
                    {/* <Pressable onPress={() => navigation.navigate("Favorite")} style={styles.iconBehave} >
                        <Icon name="heart" size={25} color={COLORS.grey}/>
                    </Pressable> */}
                    <Pressable onPress={() => navigation.navigate("adminprofile")} style={styles.iconBehave}>
                        <Icon name="user" size={25} color={COLORS.grey} />
                    </Pressable>
                    <Pressable onPress={() => navigation.navigate("adminHome")} style={styles.iconBehave} >
                        <Icon name="home" size={25} color={COLORS.grey} />
                    </Pressable>
                    {/* <Pressable onPress={() => navigation.navigate("CartScreen")} style={styles.iconBehave} >
                        <Icon name="shopping-cart" size={25} color={COLORS.yellow} />
                    </Pressable> */}
                </View>
            </View>
    </View>
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
    NavContainer: {
        position: 'absolute',
        alignItems: 'center',
        bottom: 5,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
    },
    Navbar: {
        flexDirection: 'row',
        backgroundColor: COLORS.darkblue,
        width: 370,
        justifyContent: 'space-evenly',
        borderRadius: 30,
        height: 40

    },
    iconBehave: {
        padding: 35,
        bottom: 30
    },
});

export default Favorite;