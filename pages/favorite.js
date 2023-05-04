import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList,Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Favorite = ({navigation}) => {
return(

    <View style={styles.container } >
        <View>
        <Text style={styles.heading } >Welcome to favorite </Text>
        </View>
        <View style={styles.NavContainer} >
               <View style={styles.Navbar} >
                   <Pressable onPress={() => navigation.navigate("Favorite")} style={styles.iconBehave} >
                       <Icon name="heart" size={30} color="#FFDE9B" />
                   </Pressable>
                   <Pressable onPress={() => navigation.navigate("profile")} style={styles.iconBehave}>
                       <Icon name="user" size={30} color="gray" />
                   </Pressable>
                   <Pressable onPress={() => navigation.navigate("Home")} style={styles.iconBehave} >
                       <Icon name="home" size={30} color="gray" />
                   </Pressable>
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
        position:'absolute',
        alignItems:'center',
        bottom:10,
        padding:10, 
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
     },
     Navbar: {
        flexDirection: 'row',
        backgroundColor:'#131A2C',
        width:370,
        justifyContent:'space-evenly',
        borderRadius:40,
        height:50
        
     },
     iconBehave:{
        padding:44,
        bottom:35
     },
     searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 10,
        margin: 10,
        padding: 5,
      },
});

export default Favorite;