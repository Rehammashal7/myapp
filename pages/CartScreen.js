
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
import { doc,collection,where,setDoc, updateDoc ,getDocs,getDoc } from "firebase/firestore";
import { auth , db , storage}  from '../firebase';
import BottomNavigator from '../components/bar';

//parseInt()تحويل 
const CartScreen = ({navigation}) => {
  const isFocused = useIsFocused();
  const [cartList, setCartList] = useState([]);
  //const [userId, setUserId] = useState('');
  const route = useRoute();
  //const userId = route.params.userId;
  const [userId, setUserId] = useState(route.params.userId);
const [HistoryOrder,setHistoryOrder]=useState([]);
const [totalPrice,settotalPrice]=React.useState(0); 
  useEffect(() => {
    getCartItems();
    //console.log(userId);
  }, [isFocused]);


  const handleSomeAction = async () => {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();
      
      console.log('Current Bonus Points:', userData.boun);

      const currentPoints = userData.boun || 0;
      const newPoints = currentPoints + 10;
  
      await updateDoc(userRef, { boun: newPoints });
      console.log('Bonus points increased by 10.');
    } catch (error) {
      console.error('Error increasing bonus points:', error);
    }};

  
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
    

    const handleCheckout = async () => {
      try {
        // Loop through the products and add them to the purchasedProducts collection
        cartList.forEach(async (item) => {
          const purchaseData = {
            userId: userId,
            productId: item.id,
            quantity: item.qty,
            totalPrice: (item.qty || 0) * (item.data.price || 0),
            timestamp: new Date(),
            imageUrl: item.data.imageUrl,
            name: item.data.name,
            description: item.data.description

           
          };
          const purchasedProductRef = doc(db, 'purchasedProducts', `${userId}_${item.id}`);
          await setDoc(purchasedProductRef, purchaseData);
        });
    
        console.log('Purchased products saved to Firestore successfully');
        // After successful checkout, you can navigate to the checkout screen or do any other necessary action
        navigation.navigate('checkout');
      } catch (error) {
        console.error('Error saving purchased products to Firestore:', error);
      }
    };
    

  
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




  const getTotal = () => {
    let total = 0;
    cartList.map(item => {let existingItem = cartList.find(itm => itm.id === item.id)
      total = total + existingItem.qty * item.data.price;
    });
    return total;
  };


const AddOrderHistory = async () => {
  console.log('Executing AddOrderHistory function...');
  
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
     const currentDate = new Date();
    const formattedDate = currentDate.toISOString();
    
    const userOrders = userSnap.data()?.orders || [];

    cartList.forEach((cartItem) => {
      const newOrder = {
        productId: cartItem.id,
        productName: cartItem.data.name,
        quantity: cartItem.qty,
        imageUrl: cartItem.data.imageUrl,
        totalPrice: (cartItem.qty || 0) * (cartItem.data.price || 0),
        timestamp: new Date(),
      };

      userOrders.push(newOrder);
    });

    await updateDoc(userRef, { orders: userOrders });

    console.log('Order history updated successfully');
  } catch (error) {
    console.error('Error updating order history:', error);
  }
};

  
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
                  {'LE' + item.data.price}
                </Text>
                <Text style={styles.discountText}>
                  {'LE' + item.data.discountPrice}
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
    {cartList.length > 0 && (
      <View style={styles.checkoutView}>
        <Text style={{color: '#000', fontWeight: '600'}}>
             {'Items(' + ( cartList.find(itm => itm.id)).qty + ')\nTotal: $' + getTotal()}
        </Text>
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
            navigation.navigate("checkout")
            AddOrderHistory();
            handleSomeAction();
            
            handleCheckout();
          }}>
          <Text style={{color: '#fff'}}>Checkout</Text>
        </TouchableOpacity>
      </View>
    )}
    <BottomNavigator item="cart" navigation={navigation} userId={userId} />
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