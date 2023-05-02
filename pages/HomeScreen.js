import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Pressable, ScrollView } from 'react-native';
import data from '../data';
import FoodCard from '../components/Foodcard';
import Icon from 'react-native-vector-icons/FontAwesome';



// Generate required css


// Inject stylesheet


const HomeScreen = ({navigation}) => {
    const [searchQuery, setSearchQuery] = useState('');

const handleSearch = (text) => {
    setSearchQuery(text);
  };
     
   return(
    <View style={styles.container}>

           <View style={styles.header}>
               <Text style={styles.headerText}> Fast Food </Text>
           </View>
           <View style={styles.searchContainer}>
  <Icon name="search" size={20} color="#808080" style={styles.searchIcon} />
  <TextInput
    style={styles.searchInput}
    placeholder="Search"
    onChangeText={handleSearch}
    value={searchQuery}
  />
</View>
           <ScrollView>
               <FlatList
                   style={{ marginTop: 10, marginBottom: 10 }}
                   vertical={true}
                   numColumns={2}
                   data={data}
                   keyExtractor={(item, index) => index.toString()}
                   showsVerticalScrollIndicator={false}
                   renderItem={({ item }) => (
                       <View style={{ marginRight: 3 }}>
                           <FoodCard
                               screenWidth={170}
                               images={item.images}
                               restaurantName={item.restaurantName}
                               price={item.price} />
                       </View>

                   )} />
                 <View style ={styles.bottoms}>
             
                 </View>
           </ScrollView>
 
           <View style={styles.NavContainer} >
               <View style={styles.Navbar} >
                   <Pressable onPress={() => navigation.navigate("Favorite")} style={styles.iconBehave} >
                       <Icon name="heart" size={30} color="gray" />;
                   </Pressable>
                   <Pressable onPress={() => navigation.navigate("profile")} style={styles.iconBehave}>
                       <Icon name="user" size={30} color="gray" />;
                   </Pressable>
                   <Pressable onPress={() => navigation.navigate("Home")} style={styles.iconBehave} >
                       <Icon name="home" size={30} color="gray" />;
                   </Pressable>
               </View>
           </View>

         
         
       </View>
   );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FBFAFF',
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
        backgroundColor:"#FBFAFF",
        height:'10%',
    },
    bottoms :{
        flexDirection:"row",
        backgroundColor:"#FBFAFF",
        height:50,
        bottom:20
    },
    headerText:{
        color:"#0B0E21",
        fontSize:40,
        fontWeight:"bold",
        alignItems: 'center',

    },
    address:{
        fontSize:12,
        paddingTop:5,
        color:"#0B0E21",
        paddingVertical:10
     },
     NavContainer: {
        position:'absolute',
        alignItems:'center',
        bottom:10, 
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
      searchIcon: {
        marginRight: 10,
      },
      searchInput: {
        flex: 1,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333333',
      },
});
export default HomeScreen;