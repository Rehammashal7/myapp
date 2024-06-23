// import { createStackNavigator } from '@react-navigation/stack';
// import { NavigationContainer } from '@react-navigation/native';
//import Checkout from './Checkout';
import React, { useEffect, useState, useRef } from "react";
// import firebase from 'firebase/app';
// import 'firebase/firestore';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Pressable,
  Dimensions,
} from "react-native";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { PayPalButtons } from "@paypal/react-paypal-js";

import COLORS from "../Consts/Color";
import Icon from "react-native-vector-icons/Ionicons";
import { useIsFocused, useRoute } from "@react-navigation/native";
import { collection, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView } from "react-native";
import chart from '../adminPages/adminHome';

const { width } = Dimensions.get("screen");
const cardwidth = width / 2;

const Checkout = ({ navigation }) => {
  //const [currentCount, setCurrentCount] = useState(0);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState(null);
  const [IconArr, setIconArr] = useState(false);
  const [IconName, setIconName] = useState(false);
  const [IconName2, setIconName2] = useState(false);
  const [IconName3, setIconName3] = useState(false);
  const [IconName4, setIconName4] = useState(false);
  const [IconName5, setIconName5] = useState(false);
  const [point, setpoint] = useState(false);
  const isFocused = useIsFocused();
  const [cartList, setCartList] = useState([]);
  const route = useRoute();
  const [userId, setUserId] = useState("");

  useEffect(() => {
    getUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      getCartItems();
    }
  }, [userId, isFocused]);

  const getUserId = async () => {
    try {
      const id = await AsyncStorage.getItem("USERID");
      if (id !== null) {
        setUserId(id);
      }
    } catch (error) {
      console.error("Error reading user ID:", error);
    }
  };

  const getCartItems = async () => {
    //const userId = await AsyncStorage.getItem('USERID');
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    setCartList(userSnap.get("cart"));
  };

  const onApprove = (data, actions) => {
    return actions.order.capture().then((details) => {
      firebase
        .firestore()
        .collection("payments")
        .add({
          payerId: details.payer.payer_id,
          purchaseAmount: amount,
          create_time: details.create_time,
        })
        .then(() => {
          navigation.navigate("ConfirmationScreen");
        })
        .catch((error) => {
          setError(error.message);
        });
    });
  };


  const [points, setpoints] = useState(0);
  const getbouns = async () => {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.data();
    const currentPoints = userData.boun || 0;
    setpoints(currentPoints);
  }
  useEffect(() => {

    getbouns();

  }, [getbouns()]);
  const getpoint = () => {
    let offer = getTotal() - getTotalOfers() - points;
    if (offer < 0) {
      offer = 0
    }
    return offer;
  }
  const getTotalOfers = () => {
    let total = 0;
    cartList.map(item => {
      let existingItem = cartList.find(itm => itm.id === item.id)
      total = total + (item.data.offer / 100 * item.data.price * existingItem.qty);
    });
    return total;
  };
  const getTotal = () => {
    let total = 0;
    cartList.map(item => {
      let existingItem = cartList.find(itm => itm.id === item.id)
      total = total + existingItem.qty * item.data.price;
    });
    return total;
  };
  const getTotalItems = () => {
    let total = 0;
    cartList.map((item) => {
      let existingItem = cartList.find((itm) => itm.id === item.id);
      total = total + existingItem.qty;
    });
    return total;
  };
  const [delprice, setdelprice] = useState(0);
  const handelNavigation = () => {
    if (IconName4) {
      AddOrderHistory();
      handleSomeAction();
      deleteAllItems();
      handleCheckout();
      updatewallet();
      handleRecycleWallet()
      setTimeout(() => {
        navigation.navigate("pay", { userId: userId });
      }, 2000);

    } else if (IconName3) {
      AddOrderHistory();
      handleSomeAction();
      deleteAllItems();
      handleCheckout();
      handleRecycleWallet()
      setTimeout(() => {
        navigation.navigate("CreditCard", { userId: userId });
      }, 2000);

    } else {
      alert('pless choose how can pay')
    }
  }
  const deliveryprice = () => {
    if (IconName) {
      setdelprice((getTotal() * 0.05));
    } else { setdelprice(0); }
  };
  useEffect(() => {
    deliveryprice();
  }, [deliveryprice]);
  

  const handleCheckout = async () => {
    
    try {
      const usersRef = collection(db, "users");
      const querySnapshot = await getDocs(usersRef);

      for (const userDoc of querySnapshot.docs) {
        const userData = userDoc.data();
        if (userData.isAdmin) {
          cartList.forEach(async (cartItem) => {
           
            if (cartItem.data.categoryName == 'WOMAN') {
          
              const currentcount = userData.woman || 0;
              const newwoman = currentcount + 1;
              const userRef = doc(db, "users", userDoc.id);
              await updateDoc(userRef, { woman: newwoman });
            }
            else if (cartItem.data.categoryName == 'MEN') {

              const currentcount = userData.men || 0;
              const newmen = currentcount + 1;
              const userRef = doc(db, "users", userDoc.id);
              await updateDoc(userRef, { men: newmen });
            }
            else if (cartItem.data.categoryName == 'KIDS') {

              const currentcount = userData.kids || 0;
              const newkids = currentcount + 1;
              const userRef = doc(db, "users", userDoc.id);
              await updateDoc(userRef, { kids: newkids });
            }
            else if (cartItem.data.categoryName == 'BABY') {

              const currentcount = userData.baby || 0;
              const newbaby = currentcount + 1;
              const userRef = doc(db, "users", userDoc.id);
              await updateDoc(userRef, { baby: newbaby });
            }

          });

        }
      }
    } catch (error) {
      console.error("Error updating checkoutcount: ", error);
    }

      try {
      const items = [];

      cartList.forEach((item) => {
        const { id, qty, data } = item;
        const totalPrice = (qty || 0) * (data.price || 0);

        items.push({
          productId: id,
          quantity: qty,
          totalPrice: totalPrice,
          imageUrl: data.images,
          name: data.name,
          description: data.description,
          category: data.categoryName,
        });

      });

      const userPurchasedProductsRef = doc(db, 'userPurchasedProducts', userId);

      await setDoc(userPurchasedProductsRef, {

        items: items,
        userId: userId,
        timestamp: new Date(),
        delivered: false,
      });

      navigation.navigate('checkout');
    } catch (error) {
      console.error("Error saving purchased products to Firestore:", error);
    }


  };

  const deleteAllItems = async () => {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { cart: [] });
      getCartItems(); // Refresh the cart items after deletion
    } catch (error) {
      console.error("Error deleting all items:", error);
    }
  };
  const updatewallet = async () => {
    try {
     
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      const walletAmount = userSnap.data().walet || 0;

      const totalAmountToDeduct = (getTotal() + delprice - getTotalOfers()).toFixed(2);

      if (walletAmount >= totalAmountToDeduct) {
       
        const updatedAmount = walletAmount - totalAmountToDeduct;
        await updateDoc(userRef, { walet: updatedAmount });
        
        alert("You can recover the amount in 24 hours only");

      } else {
        alert("Error: Insufficient balance in the wallet");
      }
    } catch (error) {
      console.error("An error occurred while updating the wallet:", error);
    }
  };

  const handleRecycleWallet =async()=>{
    
    cartList.forEach(async (item)=>{
     
      if(item.data.recycleProduct===true){
       
        const userRef = doc(db, "users", item.data.userId);
      const userSnap = await getDoc(userRef);
      const walletAmount = userSnap.data().walet || 0;

      const totalAmountToDeduct = ((getTotal() - getTotalOfers())-((getTotal() - getTotalOfers())*0.1));
      const updatedAmount = walletAmount + totalAmountToDeduct;
        await updateDoc(userRef, { walet: updatedAmount });
      
        const usersRef2 = collection(db, "users"); 
      const querySnapshot = await getDocs(usersRef2); 
      
      for (const userDoc of querySnapshot.docs) {
        const userData = userDoc.data();
        if (userData.isAdmin) {
          
          const currentWalletBalance = userData.walet ; 
          const newWalletBalance = (currentWalletBalance + ((getTotal()-getTotalOfers())*0.1)); 
          const userRef3 = doc(db, "users", userDoc.id);
          await updateDoc(userRef3, { walet: newWalletBalance });
        }
        
      }
      const userRef2 = doc(db, "recycle", item.id);
      await updateDoc(userRef2, { sold: true });

      
      }else {
        handleWallerAdmin();
      }
    })
  }
  const handleWallerAdmin = async () => {
    try {
      const usersRef = collection(db, "users"); 
      const querySnapshot = await getDocs(usersRef); 
      
      for (const userDoc of querySnapshot.docs) {
        const userData = userDoc.data();
        if (userData.isAdmin) {
          
          const currentWalletBalance = userData.walet ; 
          const newWalletBalance = currentWalletBalance + (getTotal()-getTotalOfers()); 
          const userRef = doc(db, "users", userDoc.id);
          await updateDoc(userRef, { walet: newWalletBalance });
        }
      }
    } catch (error) {
      console.error("Error updating wallet balances: ", error); 
    }
  };

  const AddOrderHistory = async () => {
   
    try {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userOrders = userSnap.data().HistoryOrder || [];
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString();
        const addressIndex = userOrders.length;
        
        cartList.forEach((cartItem, index) => {
          const newOrder = {
            index: addressIndex + index,
            productId: cartItem.id,
            Name: cartItem.data.name,
            quantity: cartItem.qty,
            image: cartItem.data.images[0],
            totalPrice: (cartItem.qty || 0) * (cartItem.data.price || 0),
            timestamp: new Date(),
            description: cartItem.data.description,
            color: cartItem.color,
            size: cartItem.size,
            season:cartItem.data.season,
            type:cartItem.data.type,
          };
          userOrders.push(newOrder);
        });

        await updateDoc(userRef, { HistoryOrder: userOrders });
        
      } else {
        console.log("User does not exist!");
      }
    } catch (error) {
      console.error("Error updating order history:", error);
    }
  };

  const handleSomeAction = async () => {
    try {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();

      let currentPoints = userData.boun || 0;
      if (point) {
        const minespoints = getpoint();
        if (minespoints === 0) {
          currentPoints = currentPoints - (getTotal() - getTotalOfers());
        } else {
          currentPoints = 0;
        }
      }
      const newPoints = Math.ceil(currentPoints + (getTotal() * 0.1));

      await updateDoc(userRef, { boun: newPoints });
    } catch (error) {
      console.error("Error increasing bonus points:", error);
    }
  };

  return (

    <View style={styles.container}>
      <View style={styles.header}>

        <Text style={[styles.Text, { textAlign: "center" }]}> Checkout </Text>
      </View>
      <ScrollView style={styles.container}>
        {/* delivery */}

        <Text
          style={{
            fontSize: 18,
            color: COLORS.dark,
            fontWeight: "600",
            marginLeft: 30,
          }}
        >
          Delivery
        </Text>
        <View style={[styles.containerTotal, { marginBottom: 5 }]}>
          <View style={styles.total}>
            <View style={{ flexDirection: "row" }}>
              <Pressable
                onPress={() => {
                  if (IconName2) {
                    setIconName2(!IconName2), setIconName(!IconName);
                  } else {
                    setIconName(!IconName);
                  }
                  deliveryprice();
                }}
              >
                <Icon
                  name={IconName ? "ellipse" : "ellipse-outline"}
                  size={25}
                  color="#343434"
                  style={{ marginRight: 3 }}
                />
              </Pressable>
              <Text
                style={{ color: COLORS.dark, fontWeight: "600", fontSize: 20 }}
              >
                {"Delivery to address "}
              </Text>
            </View>
            <Text style={{ color: COLORS.dark, fontWeight: '600', fontSize: 20 }}>
              {(getTotal() * 0.05).toFixed(2) + ' EGP'}
            </Text>
          </View>
          <View style={styles.total}>
            <View style={{ flexDirection: "row" }}>
              <Pressable
                onPress={() => {
                  if (IconName) {
                    setIconName(!IconName), setIconName2(!IconName2);
                  } else {
                    setIconName2(!IconName2);
                  }
                }}
              >
                <Icon
                  name={IconName2 ? "ellipse" : "ellipse-outline"}
                  size={25}
                  color="#343434"
                  style={{ marginRight: 3 }}
                />
              </Pressable>
              <Text
                style={{ color: COLORS.dark, fontWeight: "600", fontSize: 20 }}
              >
                {"Store Delivery "}
              </Text>
            </View>
            <Text
              style={{ color: COLORS.dark, fontWeight: "600", fontSize: 20 }}
            >
              Free
            </Text>
          </View>
        </View>

        {/* payment */}

        <Text
          style={{
            fontSize: 18,
            color: COLORS.dark,
            fontWeight: "600",
            marginLeft: 30,
          }}
        >
          Payment
        </Text>
        <View style={[styles.containerTotal, { marginBottom: 5 }]}>
          <View style={styles.total}>
            <View style={{ flexDirection: "row" }}>
              <Pressable
                onPress={() => {
                  if (IconName4) {
                    setIconName4(!IconName4), setIconName3(!IconName3);
                  } else {
                    setIconName3(!IconName3);
                  }
                }}
              >
                <Icon
                  name={IconName3 ? "ellipse" : "ellipse-outline"}
                  size={25}
                  color="#343434"
                  style={{ marginRight: 3 }}
                />
              </Pressable>
              <Text
                style={{ color: COLORS.dark, fontWeight: "600", fontSize: 20 }}
              >
                {"Credit card "}
              </Text>
            </View>
          </View>
          <View style={styles.total}>
            <View style={{ flexDirection: "row" }}>
              <Pressable
                onPress={() => {
                  if (IconName3) {
                    setIconName3(!IconName3), setIconName4(!IconName4);
                  } else {
                    setIconName4(!IconName4);
                  }
                }}
              >
                <Icon
                  name={IconName4 ? "ellipse" : "ellipse-outline"}
                  size={25}
                  color="#343434"
                  style={{ marginRight: 3 }}
                />
              </Pressable>
              <Text
                style={{ color: COLORS.dark, fontWeight: "600", fontSize: 20 }}
              >
                {"Cash from my Wallet "}
              </Text>
            </View>
          </View>
        </View>

        {/* total price */}

        <Text
          style={{
            color: COLORS.dark,
            fontWeight: "600",
            fontSize: 20,
            marginLeft: 30,
          }}
        >
          {"Order " + getTotalItems() + " product"}
        </Text>
        <View style={[styles.containerTotal, { marginBottom: 5 }]}>
          <View style={styles.total}>
            <Text style={{ color: COLORS.dark, fontWeight: '600', fontSize: 20 }}>
              {'Total: ' + (getTotal() + delprice - getTotalOfers()).toFixed(2) + ' EGP'}
            </Text>
            <Pressable onPress={() => setIconArr(!IconArr)}>
              <Icon
                name={IconArr ? "chevron-up" : "chevron-down"}
                size={25}
                color={COLORS.dark}
                style={{ marginTop: 5, right: 30 }}
              />
            </Pressable>
          </View>
          {IconArr && (
            <>
              <View style={styles.row}>
                <Text style={{ fontSize: 18 }}>SubTotal</Text>
                <Text style={{ fontSize: 18 }}>{getTotal() + " EGP"}</Text>
              </View>
              <View style={styles.row}>
                <Text style={{ fontSize: 18 }}>Delivery</Text>
                <Text style={{ fontSize: 18 }}>{delprice.toFixed(2) + ' EGP'}</Text>
              </View>
              <View style={[styles.row, styles.totalRow]}>
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                  Total(VAT included)
                </Text>
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                  {getTotal() + delprice + " EGP"}
                </Text>
              </View>
              <View style={[styles.row, styles.totalRow]}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'green' }}>20% Discound </Text>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'green' }}>{'-' + getTotalOfers() + ' EGP'}</Text>
              </View>
            </>
          )}
        </View>
        <View style={[styles.containerTotal, { marginBottom: 5 }]}>
          <View style={styles.total}>
            <Pressable
              onPress={() => {
                setpoint(!point)

              }}
            >
              <Icon
                name={point ? "ellipse" : "ellipse-outline"}
                size={25}
                color="#343434"
                style={{ marginRight: 3 }}
              />
            </Pressable>
            {point ? (<Text style={{ color: COLORS.dark, fontWeight: '600', fontSize: 20 }}>
              {'Total : ' + getpoint().toFixed(2) + ' EGP'}
            </Text>) : (<Text style={{ color: COLORS.dark, fontWeight: '600', fontSize: 20 }}>
              {'Total : ' + (getTotal() + delprice - getTotalOfers()).toFixed(2) + ' EGP'}
            </Text>)}

            <Pressable onPress={() => setIconName5(!IconName5)}>
              <Icon name={IconName5 ? 'chevron-up' : 'chevron-down'} size={25} color={COLORS.dark} style={{ marginTop: 5, right: 30 }} />
            </Pressable>
          </View>
          {IconName5 && (
            <>
              <View style={styles.row}>
                <Text style={{ fontSize: 18 }}>Points</Text>
                <Text style={{ fontSize: 18 }}>{points}</Text>
              </View>
              <View style={styles.row}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'green' }}>total (after points)</Text>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'green' }}>{getpoint().toFixed(2)}</Text>
              </View>
            </>
          )}
        </View>
        <View style={styles.bottoms}></View>
      </ScrollView>
      {/* button */}

      {cartList.length > 0 && (
        <View style={styles.checkoutView}>
          {/* <chart currentCount={currentCount} /> */}
          <Text style={{ color: COLORS.dark, fontWeight: '600' }}>
            {'Items(' + getTotalItems() + ')\nTotal: $' + (getTotal() + delprice - getTotalOfers()).toFixed(2)}
          </Text>
          {/* <chart currentCount={currentCount} /> */}
          <TouchableOpacity
            style={styles.checkButton}
            onPress={() => {
              handelNavigation();
              
              // if (IconName4) {+-
              //   setTimeout(() => {
              //     navigation.navigate("pay", { userId: userId });
              //   }, 2000);

              // } else {
              //   setTimeout(() => {
              //     navigation.navigate("CreditCard", { userId: userId });
              //   }, 2000);

              // }
            }}
          >
            <Text style={{ color: "#fff" }}>pay</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: "row",
    backgroundColor: COLORS.background,
    height: "10%",
    alignItems: "center",
    textAlign: "center",
  },
  Text: {
    color: COLORS.darkblue,
    fontSize: 35,
    //fontFamily: "SofiaRegular",
    fontWeight: "bold",
    alignItems: "center",
    marginLeft: width / 2 - 80,
  },
  containerTotal: {
    padding: 10,
    borderWidth: 0.1,
    borderColor: COLORS.grey,
    borderWidth: 0.1,
    borderRadius: 1,
    elevation: 5,
    flexDirection: "column",
    backgroundColor: COLORS.white,
    marginBottom: 10,
    margin: 5,
  },
  total: {
    width: "90%",
    height: 60,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: "80%",
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  paypalContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
    height: 100,
    width: 100,
  },
  paypalButton: {
    height: 20,
    width: 20,
    color: "blue",
  },
  NavContainer: {
    position: "absolute",
    alignItems: "center",
    bottom: 5,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  Navbar: {
    flexDirection: "row",
    backgroundColor: COLORS.darkblue,
    width: 38,
    justifyContent: "space-evenly",
    borderRadius: 30,
    height: 40,
  },
  iconBehave: {
    padding: 44,
    bottom: 35,
  },
  checkoutView: {
    width: "100%",
    height: 60,
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 0,
    elevation: 5,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  checkButton: {
    width: cardwidth,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.dark,

  }, bottoms: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    height: 70,
    bottom: 0
  },
});

export default Checkout;
