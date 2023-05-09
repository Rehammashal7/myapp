// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet,Pressable, FlatList } from 'react-native';
// import COLORS from '../Consts/Color';
// import Icon from 'react-native-vector-icons/FontAwesome';
// const Favorite = ({navigation}) => {
// return(

//     <View style={styles.container } >
//         <text style={styles.heading } >Welcome to favorite </text>
//         <View style={styles.NavContainer} >
//                 <View style={styles.Navbar} >
//                     <Pressable onPress={() => navigation.navigate("Favorite")} style={styles.iconBehave} >
//                         <Icon name="heart" size={25} color={COLORS.grey}/>
//                     </Pressable>
//                     <Pressable onPress={() => navigation.navigate("profile")} style={styles.iconBehave}>
//                         <Icon name="user" size={25} color={COLORS.grey} />
//                     </Pressable>
//                     <Pressable onPress={() => navigation.navigate("Home")} style={styles.iconBehave} >
//                         <Icon name="home" size={25} color={COLORS.grey} />
//                     </Pressable>
//                     <Pressable onPress={() => navigation.navigate("CartScreen")} style={styles.iconBehave} >
//                         <Icon name="shopping-cart" size={25} color={COLORS.yellow} />
//                     </Pressable>
//                 </View>
//             </View>
//     </View>
// )};
// const styles = StyleSheet.create({
//     container: {
//     flex: 1,
//     backgroundColor: '#FBFAFF',
//     alignItems: 'center',
//     justifyContent: 'center',
//     },
//     heading:{
//         color: "black",
//         fontSize : 40 ,
//         alignItems: 'center',
//         fontWeight : 'bold',
//         marginBottom :10 ,

//     },
//     NavContainer: {
//         position: 'absolute',
//         alignItems: 'center',
//         bottom: 5,
//         borderBottomLeftRadius: 15,
//         borderBottomRightRadius: 15,
//     },
//     Navbar: {
//         flexDirection: 'row',
//         backgroundColor: COLORS.darkblue,
//         width: 370,
//         justifyContent: 'space-evenly',
//         borderRadius: 30,
//         height: 40

//     },
//     iconBehave: {
//         padding: 35,
//         bottom: 30
//     },
// });

// export default Favorite;
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
  } from 'react-native';
  import React, {useEffect, useState} from 'react';
  import {useIsFocused, useRoute} from '@react-navigation/native';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  //import firestore from '@react-native-firebase/firestore';
  //import {StripeProvider} from '@stripe/stripe-react-native';
  //import { doc, updateDoc } from 'firebase/firestore';
  //mport { collection, getDocs, where } from 'firebase/firestore';
  //import { useState, useEffect } from 'react';
  import { doc,collection,where,setDoc, updateDoc ,getDocs,getDoc } from "firebase/firestore";
  import { auth , db , storage}  from '../firebase';
  
  //parseInt()تحويل 
  const CartScreen = ({navigation}) => {
    const isFocused = useIsFocused();
    const [cartList, setCartList] = useState([]);
    //const [userId, setUserId] = useState('');
    const route = useRoute();
    //const userId = route.params.userId;
    const [userId, setUserId] = useState(route.params.userId);

    useEffect(() => {
      getCartItems();
      //console.log(userId);
    }, [isFocused]);
  
   
    const getCartItems = async () => {
      //const userId = await AsyncStorage.getItem('USERID');
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      setCartList(userSnap.get('cart'));
    };
    
  
    useEffect(() => {
      const getUserId = async () => {
        const id = await AsyncStorage.getItem('USERID');
        setUserId(id);
        
      };
      getUserId();
    }, []);
  
  
  
    // const addItem = async item => {
    //   //const userId = await AsyncStorage.getItem('USERID');
    //   const userRef = doc(db, 'users', userId);
    //   const userSnap = await getDoc(userRef);
    //   const user = userSnap.data();
    
    //   let tempDart = [...user.cart];
    
    //   tempDart.forEach((itm, index) => {
    //     if (itm.id == item.id) {
    //       tempDart[index].data.qty = tempDart[index].data.qty + 1;
    //       console.log(`Quantity for item with ID ${item.id} is now ${tempDart[index].data.qty}`);
    //       console.log(existingItem.qty);
          
    //     }
    //   });
    
    //  // await updateDoc(userRef, { cart: tempDart });
    //  await setDoc(userRef, { cart: tempDart });
    //   getCartItems();
    // };
    const addItem = async item => {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);
        const user = userSnap.data();
      
        let tempCart = [...user.cart];
      
        const existingItemIndex = tempCart.findIndex(cartItem => cartItem.id === item.id);
      
        if (existingItemIndex !== -1) {
          const existingItem = tempCart[existingItemIndex];
          existingItem.qty += 1;
          tempCart[existingItemIndex] = existingItem;
          console.log(`Quantity for item with ID ${item.id} is now ${existingItem.qty}`);
        } else {
          tempCart.push({ ...item, qty: 1 });
        }
      
        await updateDoc(userRef, { cart: tempCart });
        getCartItems();
      };
      
  
    
  
    // const removeItem = async item => {
    //   const userDoc = doc(db, "users", userId);
    //   const userSnap = await getDoc(userDoc);
    //   const user = userSnap.data();
    //   let tempCart = user.cart;
    //   tempCart.map(itm => {
    //     if (itm.id === item.id) {
    //       itm.data.qty = itm.data.qty - 1;
    //     }
    //   });
    //   await updateDoc(userDoc, { cart: tempCart });
    //   getCartItems();
    // };
    const removeItem = async item => {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);
        const { cart = [] } = userSnap.data() ?? {};
        
        let existingItem = cart.find(itm => itm.id === item.id);
        
        if (existingItem) {
          if (existingItem.qty > 1) {
            existingItem.qty-= 1;
            console.log(`Quantity for item with ID ${item.id} is now ${existingItem.qty}`);

          } else {
            cart.splice(cart.indexOf(existingItem), 1);
          }
        } else {
          console.log('Item not found in cart.');
        }
        
        await updateDoc(userRef, { cart });
        getCartItems();
      };
      
  
   
    const deleteItem = async (index) => {
      //const userId = await AsyncStorage.getItem('USERID');
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      let tempCart = userSnap.data().cart;
      tempCart.splice(index, 1);
      await updateDoc(userRef, { cart: tempCart });
      getCartItems();
    };
    // const deleteItem = async (item) => {
    //     const userRef = doc(db, 'users', userId);
    //     const userSnap = await getDoc(userRef);
    //     const { cart = [] } = userSnap.data() ?? {};
    //     const newCart = cart.filter(itm => itm.id !== item.id);
    //     await setDoc(userRef, { cart: newCart });
    //     getCartItems();
    //   };
      
  
  
    const getTotal = () => {
      let total = 0;
      cartList.map(item => {let existingItem = cartList.find(itm => itm.id === item.id)
        total = total + existingItem.qty * item.data.price;
      });
      return total;
    };

    // const getTotal = () => {
    //   return cartList.reduce((total, item) => {
    //     return total + item.data.qty * item.data.price;
    //   }, 0);
    // };
//     const getTotal =async () => {
//   const userRef = doc(db, 'users', userId);
//   const cart = (await getDoc(userRef)).data().cart;
//   return cart.reduce((total, item) => {
//     return total +( cart.find(itm => itm.id === item.id)).qty ;
//   }, 0);
// };

// const getTotal =async () => {
//     const userRef = doc(db, 'users', userId);
//     const userSnap = await getDoc(userRef);
//     const cartList = userSnap.data().cart;
//     return cartList.reduce((total, item) => {
//       return total + item.data.qty * item.data.discountPrice;
//     }, 0);
//   };

  
    return (
      <View style={styles.container}>
        <FlatList
          data={cartList}

          renderItem={({item, index}) => {
            return (
            
              <View style={styles.itemView}>
                <Image
                  source={{uri: item.data.imageUrl}}
                  style={styles.itemImage}
                />
                <View style={styles.nameView}>
                  <Text style={styles.nameText}>{item.data.name}</Text>
                  {/* <Text style={styles.descText}>{item.data.description}</Text> */}
                  <View style={styles.priceView}>
                    <Text style={styles.priceText}>
                      {'$' + item.data.price}
                    </Text>
                    <Text style={styles.discountText}>
                      {'$' + item.data.discountPrice}
                    </Text>
                  </View>
                </View>
                <View style={styles.addRemoveView}>
                  <TouchableOpacity
                    style={[
                      styles.addToCartBtn,
                      {
                        width: 30,
                        justifyContent: 'center',
                        alignItems: 'center',
                        //marginRight: 60,
                        marginLeft:20
                      },
                    ]}
                    onPress={() => {   
                        let existingItem = cartList.find(itm => itm.id === item.id)
                        if (existingItem.qty > 1)
                       {
                        removeItem(item);
                      } else {
                        deleteItem(index);
                      }
                    }}>
                    <Text
                      style={{color: '#fff', fontSize: 20, fontWeight: '700'}}>
                      -
                    </Text>
                  </TouchableOpacity>
                  <Text style={{fontSize: 16, fontWeight: '600',marginLeft:15}}>
                        {  ( cartList.find(itm => itm.id === item.id)).qty}
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.addToCartBtn,
                      {
                        width: 30,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginLeft: 20,
                      },
                    ]}
                    onPress={() => {
                      addItem(item);
                    }}>
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: 20,
                        fontWeight: '700',
                      }}>
                      +
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
        {getCartItems.length > 0 && (
          <View style={styles.checkoutView}>
            <Text style={{color: '#000', fontWeight: '600'}}>
                 {'Items(' + ( getItem(itm => itm.id)).qty + ')\nTotal: $' + getTotal()}
            </Text>
            </View>)}
               <View style={styles.checkoutView}>
            <TouchableOpacity
              style={[
                styles.addToCartBtn,
                {
                  width: 100,
                  height: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                },
              ]}
              onPress={() => {
                navigation.navigate('Checkout');
              }}>
              <Text style={{color: '#fff'}}>Checkout</Text>
            </TouchableOpacity>
          </View>
       
      </View>
    );
  };
  
  export default CartScreen;
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
      textAlign:'center'
    },
    addToCartBtn: {
      backgroundColor: '#131A2C',
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