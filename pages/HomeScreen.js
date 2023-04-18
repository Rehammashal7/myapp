import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Pressable } from 'react-native';
import data from '../data';
import FoodCard from '../components/Foodcard';
import Icon from 'react-native-vector-icons/FontAwesome';

// Generate required css


// Inject stylesheet



const iconheight=26;
const iconwidth=26;
const HomeScreen = ({navigation}) => {
     
   return(
    <view style={styles.container}>
           <view style={styles.header}>
               <Text style={styles.headerText}> Fast Food </Text>
           </view>
           <View>
               <FlatList
                   style={{ marginTop: 10, marginBottom: 10 }}
                   horizontal={true}
                   data={data}
                   keyExtractor={(item, index) => index.toString()}
                   showsHorezontalScrollIndicator={false}
                   renderItem={({ item }) => (
                       <View style={{ marginRight: 3 }}>
                           <FoodCard
                               screenWidth={150}
                               images={item.images}
                               restaurantName={item.restaurantName}
                               price={item.price} />
                       </View>
                   )} />
           </View>
           <view style={styles.NavContainer}>
               <view style={styles.Navbar}>
                   <Pressable onPress={()=>navigation.navigate("favorite")} style={styles.iconBehave} borderRadius= {20} >
                       <Icon name="heart" size={30} color="gray" />;
                   </Pressable>
                   <Pressable onPress={()=>navigation.navigate("profile")} style={styles.iconBehave}  >
                       <Icon name="user" size={30} color="gray" />;
                   </Pressable>
                   <Pressable onPress={()=>navigation.navigate("home")} style={styles.iconBehave} borderRadius= {20}>
                       <Icon name="home" size={30} color="gray" />;
                   </Pressable>
               </view>
             </view>

         </view>
   );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'FBFAFF',
        // alignItems: 'center',
        // justifyContent: 'center',
    },
    heading:{
        color: "WHITE",
        fontSize : 40 ,
        alignItems: 'center',
        marginBottom :5 ,
    },
    header :{
        flexDirection:"row",
        backgroundColor:"FBFAFF",
        height:'15%',
    },

    headerText:{
        color:"0B0E21",
        fontSize:40,
        fontWeight:"bold",
        alignItems: 'center',

    },
    address:{
        fontSize:12,
        paddingTop:5,
        color:"0B0E21",
        paddingVertical:10
     },
     NavContainer: {
        position:'absolute',
        alignItems:'center',
        bottom:30
     },
     Navbar: {
        flexDirection: 'column',
        backgroundColor:'131A2C',
        color:'black',
        width:'80%',
        justifyContent:'space-evenly',
        borderRadius:40
     },
     iconBehave:{
        padding:44
     },
});
export default HomeScreen;