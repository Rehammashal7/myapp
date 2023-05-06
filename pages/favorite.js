import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import {  createUserWithEmailAndPassword , signInWithPopup,
  GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";  

  import {FlatList, Pressable, ScrollView } from 'react-native';
  import data from '../data';
  import FoodCard from '../components/Foodcard';
  import Icon from 'react-native-vector-icons/FontAwesome';
  import { Image } from 'react-native';
  import googleicon from "../assets/iconn.png";
  import faceicon from '../assets/fac.png';
  import { auth , db}  from '../firebase';
  import { doc, setDoc } from "firebase/firestore";
const Favorite = ({navigation}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in 
          const user = userCredential.user;
          console.log("Done");
          adduserTodata();
          navigation.navigate('Home')
          
          // ...
         
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          // ..
        });
    
       
      };
      const adduserTodata = async()=>{
        await setDoc(doc(db, "users", auth.currentUser.uid), {
          email: email,
        
             isAdmin:true,
        });
        
    
      };

return(
    

    <View style={styles.container } >
        
        <View style={styles.container}>
      <Text style={styles.heading}>Log In</Text>
      <TextInput
       value={email}
       onChangeText={setEmail}
        placeholder="Email"
        style={styles.input}
      />
      <TextInput
       value={password}
       onChangeText={setPassword}
        secureTextEntry={true}
        placeholder="Password"
        style={styles.input}
      />
      <TouchableOpacity
       onPress={handleLogin}
        style={styles.buttonlogin}
      >
        <Text style={styles.buttonText}> Log In</Text>
      </TouchableOpacity>
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
        width:'100%',
        justifyContent:'space-evenly',
        borderRadius:40,
        height:50
        
     },
     iconBehave:{
        padding:44,
        bottom:35
     },
    
      input: {
        backgroundColor: '#FFFFFF',
        width: '100%',
        padding: 10,
        borderRadius: 10,
        marginBottom: 20,
        backgroundColor:'#D3D3D3'
      },
      buttonlogin: {
        backgroundColor: '#131A2C',
        borderRadius: 10,
        padding: 10,
        width: '100%',
        alignItems: 'center',
        marginTop:10,
      },
     
      buttonText: {
        color: '#FFDE9B',
        fontSize: 18,
        fontWeight: 'bold',
      },
});

export default Favorite;