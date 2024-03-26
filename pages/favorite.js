import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useIsFocused, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import firestore from '@react-native-firebase/firestore';
//import {StripeProvider} from '@stripe/stripe-react-native';
//import { doc, updateDoc } from 'firebase/firestore';
//mport { collection, getDocs, where } from 'firebase/firestore';
//import { useState, useEffect } from 'react';
import { doc, collection, where, setDoc, updateDoc, getDocs, getDoc } from "firebase/firestore";
import { auth, db, storage } from '../firebase';
import Icon from 'react-native-vector-icons/FontAwesome';

const favorite = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [favList, setFavList] = useState([]);
  //const [userId, setUserId] = useState('');
  const route = useRoute();
  //const userId = route.params.userId;
  const [userId, setUserId] = useState(route.params.userId);

  useEffect(() => {
    getFavItems();
    //console.log(userId);
  }, [isFocused]);


  const getFavItems = async () => {
    //const userId = await AsyncStorage.getItem('USERID');
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    setFavList(userSnap.get('fav'));
  };


  useEffect(() => {
    const getUserId = async () => {
      const id = await AsyncStorage.getItem('USERID');
      setUserId(id);

    };
    getUserId();
  }, []);

  const addItem = async item => {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    const user = userSnap.data();

    let tempfav = [...user.fav];

    const existingItemIndex = tempfav.findIndex(favItem => favItem.id === item.id);

    if (existingItemIndex !== -1) {
      const existingItem = tempfav[existingItemIndex];
      existingItem.qty += 1;
      tempfav[existingItemIndex] = existingItem;
      console.log(`Quantity for item with ID ${item.id} is now ${existingItem.qty}`);
    } else {
      tempfav.push({ ...item, qty: 1 });
    }

    await updateDoc(userRef, { fav: tempfav });
    getFavItems();
  };

  const removeItem = async item => {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    const { fav = [] } = userSnap.data() ?? {};

    let existingItem = fav.find(itm => itm.id === item.id);

    if (existingItem) {
      if (existingItem.qty > 1) {
        existingItem.qty -= 1;
        console.log(`Quantity for item with ID ${item.id} is now ${existingItem.qty}`);

      } else {
        fav.splice(fav.indexOf(existingItem), 1);
      }
    } else {
      console.log('Item not found in fav.');
    }

    await updateDoc(userRef, { fav });
    getFavItems();
  };



  const deleteItem = async (index) => {
    //const userId = await AsyncStorage.getItem('USERID');
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    let tempfav = userSnap.data().fav;
    tempfav.splice(index, 1);
    await updateDoc(userRef, { fav: tempfav });
    getFavItems();
  };
  return (
    <View style={styles.container}>
      <FlatList
        data={favList}

        renderItem={({ item, index }) => {
          return (

            <View style={styles.itemView}>
              <Image
                source={{ uri: item.data.imageUrl }}
                style={styles.itemImage}
              />
              <View style={styles.nameView}>
                <Text style={styles.nameText}>{item.data.name}</Text>
                {/* <Text style={styles.descText}>{item.data.description}</Text> */}

              </View>
              <View style={styles.addRemoveView}>
              

                  
                  <Pressable 
                  onPress={() => {
                    let existingItem = favList.find(itm => itm.id === item.id)
                    if (existingItem.qty >= 1) {
                      deleteItem(index);
                    } else {
                      deleteItem(index);
                    }
                  }} style={[
                    styles.addToFavBtn,
                    {
                      width: 30,
                      justifyContent: 'center',
                      alignItems: 'center',
                      //marginRight: 60,
                      marginLeft: 20
                    },
                  ]}>
                    <Icon name="heart" size={30} color={item.qty >= 1 ? 'red':'gray'} />
                  </Pressable>
                

              </View>
            </View>
          );
        }}
      />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemView: {
    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#fff',
    elevation: 4,
    marginTop: 10,
    borderRadius: 10,
    height: 100,
    marginBottom: 10,
    alignItems: 'center',
  },
  itemImage: {
    width: 90,
    height: 90,
    borderRadius: 10,
    margin: 5,
  },
  nameView: {
    width: '30%',
    margin: 10,
  },
  priceView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameText: {
    fontSize: 18,
    fontWeight: '700',
  },
  descText: {
    fontSize: 14,
    fontWeight: '600',
  },
  priceText: {
    fontSize: 18,
    color: 'green',
    fontWeight: '700',
  },
  discountText: {
    fontSize: 17,
    fontWeight: '600',
    textDecorationLine: 'line-through',
    marginLeft: 5,
  },
  addRemoveView: {
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'center'
  },
  addToFavBtn: {
    padding: 10,
    borderRadius: 10,
  },
  checkoutView: {
    width: '100%',
    height: 60,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
});
export default favorite;