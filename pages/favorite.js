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
}
export default Favorite;