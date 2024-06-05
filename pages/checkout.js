// import { createStackNavigator } from '@react-navigation/stack';
// import { NavigationContainer } from '@react-navigation/native';
//import Checkout from './Checkout';
import React, { useEffect, useState } from "react";
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
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView } from "react-native";

const { width } = Dimensions.get("screen");
const cardwidth = width / 2;
const Checkout = ({ navigation }) => {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState(null);
  const [IconArr, setIconArr] = useState(false);
  const [IconName, setIconName] = useState(false);
  const [IconName2, setIconName2] = useState(false);
  const [IconName3, setIconName3] = useState(false);
  const [IconName4, setIconName4] = useState(false);
  const [IconName5, setIconName5] = useState(false);

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

  // useEffect(() => {
  //   const script = document.createElement('script');
  //   script.src = `https://www.paypal.com/sdk/js?client-id=AWY10CyVpqD5JFq5o5KelET49ca14WVmpcHn6kF7mxkdwEB1oYjcULi4_hEBrENkcapwEBtXg6-UITYd`;
  //   script.addEventListener('load', () => {

  //     window.paypal.Buttons().render('#paypal-button');

  //   },);
  //   document.body.appendChild(script);
  // }, []);
  // const createOrder = (data, actions) => {
  //   return actions.order.create({
  //     purchase_units: [
  //       {
  //         amount: {
  //           currency_code: 'USD',
  //           value: amount,
  //         },
  //       },
  //     ],
  //   });
  // };
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
  const onError = (err) => {
    setError(err.message);
  };
  const getTotalOfers = () => {
    let total = 0;
    cartList.map(item => {
      let existingItem = cartList.find(itm => itm.id === item.id)
      total = total + (item.data.offer / 100 * item.data.price * existingItem.qty);
    });
    return total.toFixed(2);
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
  
      console.log('Purchased products saved to Firestore successfully');
  
      navigation.navigate('checkout');
    } catch (error) {
      console.error("Error saving purchased products to Firestore:", error);
    }
  };
  
  // const handleCheckout = async () => {
  //   try {
  //     // Prepare an array to hold all purchased items
  //     const purchasedItems = [];
  
  //     // Loop through cartList to collect data for each item
  //     cartList.forEach((item) => {
  //       const purchaseData = {
  //         userId:userId,
  //         productId: item.id,
  //         quantity: item.qty,
  //         totalPrice: (item.qty || 0) * (item.data.price || 0),
  //         imageUrl: item.data.images,
  //         name: item.data.name,
  //         description: item.data.description,
  //         category: item.data.categoryName,
  //         delivered: false,
  //       };
  //       purchasedItems.push(purchaseData);
  //     });
  
  //     // Create a reference to the purchased products collection for the user
  //     const userPurchasedProductsRef = doc(db, 'userPurchasedProducts', userId);
  
  //     // Set the aggregated purchased items data as a single document for the user
  //     await setDoc(userPurchasedProductsRef, { items: purchasedItems, timestamp: new Date() });
  
  //     console.log('Purchased products saved to Firestore successfully');
  //     // After successful checkout, navigate to the checkout screen or perform other actions
  //     navigation.navigate('checkout');
  //   } catch (error) {
  //     console.error('Error saving purchased products to Firestore:', error);
  //   }
  // };
  
  // const handleCheckout = async () => {
  //   try {
  //     // Loop through the products and add them to the purchasedProducts collection
  //     cartList.forEach(async (item) => {
  //       const purchaseData = {
  //         userId: userId,
  //         productId: item.id,
  //          quantity: item.qty,
  //         totalPrice: (item.qty || 0) * (item.data.price || 0),
  //          timestamp: new Date(),
  //         imageUrl: item.data.images,
  //         name: item.data.name,
  //        description: item.data.description,
  //        category:item.data.categoryName,
  //         delivered: false,

  //       };
  //       const purchasedProductRef = doc(db, 'purchasedProducts', `${userId}_${item.id}`);
  //       await setDoc(purchasedProductRef, purchaseData);
  //     });

  //     console.log('Purchased products saved to Firestore successfully');
  //     // After successful checkout, you can navigate to the checkout screen or do any other necessary action
  //     navigation.navigate('checkout');
  //   } catch (error) {
  //     console.error('Error saving purchased products to Firestore:', error);
  //   }
  // };
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
      // استرجاع قيمة المحفظة من قاعدة البيانات
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      const walletAmount = userSnap.data().walet || 0;
  
      // حساب القيمة التي يجب خصمها من المحفظة
      const totalAmountToDeduct = (getTotal() + delprice - getTotalOfers()).toFixed(2);
  
      // التحقق من أن قيمة المحفظة كافية لإتمام الدفع
      if (walletAmount >= totalAmountToDeduct) {
        // تحديث قيمة المحفظة بعد الخصم
        const updatedAmount = walletAmount - totalAmountToDeduct;
        await updateDoc(userRef, { walet: updatedAmount });
  
        console.log("Wallet value updated successfully");
        AddOrderHistory();
              handleSomeAction();
              deleteAllItems();
              handleCheckout();
        alert("You can recover the amount in 24 hours only");

    } else {
      alert("Error: Insufficient balance in the wallet");
    }
  } catch (error) {
    console.error("An error occurred while updating the wallet:", error);
  }
};

  // const AddOrderHistory = async () => {
  //   console.log("Executing AddOrderHistory function...");

  //   try {
  //     const userRef = doc(db, "users", userId);
  //     const userSnap = await getDoc(userRef);
  //     const currentDate = new Date();
  //     const formattedDate = currentDate.toISOString();

  //     const userOrders = userSnap.data()?.waitingOrder || [];
  //     console.log(userOrders);
  //     if (userSnap.exists()) {
  //       const userData = userSnap.data();
  //       let updatedUserData = {};

  //       if (!userData.waitingOrder) {
  //           // إذا لم تكن dataAddress موجودة، قم بإنشائها كقائمة فارغة
  //           updatedUserData = {
  //               ...userData,
  //               waitingOrder: []
  //           };
  //       } else {
  //           updatedUserData = { ...waitingOrder };
  //       }
  // }
  //     const addressIndex = waitingOrder.dataAddress.length;
  //     cartList.forEach((cartItem) => {
  //       const newOrder = {
  //         index: addressIndex,
  //         productId: cartItem.id,
  //         Name: cartItem.data.name,
  //         quantity: cartItem.qty,
  //         image: cartItem.data.images[0],
  //         totalPrice: (cartItem.qty || 0) * (cartItem.data.price || 0),
  //         timestamp: new Date(),
  //         description: cartItem.data.description,
  //         color: cartItem.color,
  //         size: cartItem.size,
  //       };

  //       userOrders.push(newOrder);
  //       console.log(userOrders.push(newOrder));
  //     });

  //     await updateDoc(userRef, { waitingOrder: userOrders });

  //     console.log("Order history updated successfully");
  //   } catch (error) {
  //     console.error("Error updating order history:", error);
  //   }
  // };
  const AddOrderHistory = async () => {
    console.log("Executing AddOrderHistory function...");
    try {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userOrders = userSnap.data().HistoryOrder || [];
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString();
        const addressIndex = userOrders.length;
        // const addressIndex = updatedUserData.dataAddress.length;
        console.log("addresssssIndex :",addressIndex);
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
          };
          userOrders.push(newOrder);
        });

        await updateDoc(userRef, { HistoryOrder: userOrders });
        console.log("Order history updated successfully");
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

      console.log("Current Bonus Points:", userData.boun);

      const currentPoints = userData.boun || 0;
      const newPoints = currentPoints + 10;

      await updateDoc(userRef, { boun: newPoints });
      console.log("Bonus points increased by 10.");
    } catch (error) {
      console.error("Error increasing bonus points:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.Text, { textAlign: "center" }]}> Checkout</Text>
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
              {(getTotal() * 0.05 ).toFixed(2)+ ' EGP'}
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
              {'Total: ' + (getTotal() + delprice- getTotalOfers()).toFixed(2) + ' EGP'}
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
        <View style={styles.bottoms}></View>
      </ScrollView>
      {/* button */}

      {cartList.length > 0 && (
        <View style={styles.checkoutView}>
          <Text style={{ color: COLORS.dark, fontWeight: '600' }}>
            {'Items(' + getTotalItems() + ')\nTotal: $' + (getTotal() + delprice- getTotalOfers()).toFixed(2)}
          </Text>
          <TouchableOpacity
            style={styles.checkButton}
            onPress={() => {
              
              updatewallet();
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
    //     <View style={styles.container}>
    //       {/* <TextInput
    //         style={styles.input}
    //          placeholder="Enter Amount"
    //         keyboardType="decimal-pad"
    //         onChangeText={setAmount}
    //         value={amount}
    //       /> */}
    //       {error && <Text style={styles.error}>{error}</Text>}
    //       <PayPalScriptProvider
    //         options={{ "client-id": "AWY10CyVpqD5JFq5o5KelET49ca14WVmpcHn6kF7mxkdwEB1oYjcULi4_hEBrENkcapwEBtXg6-UITYd" }}
    //       >
    //         {/* <PayPalButtons
    //           createOrder={createOrder}
    //             onApprove={onApprove}
    //             onError={onError}
    //         /> */}

    // <PayPalButtons
    //             style={{ layout: 'horizontal' }}
    //             // createOrder={(data, actions) => {
    //             //   // This function is called when the button is clicked
    //             //   // You can customize the order details here
    //             //   return actions.order.create({
    //             //     purchase_units: [
    //             //       {
    //             //         amount: {
    //             //           value: '0.01', // Example amount, should be replaced with actual value
    //             //         },
    //             //       },
    //             //     ],
    //             //   });
    //             // }}
    //             onApprove={onApprove}
    //             onError={onError}
    //           />
    //       </PayPalScriptProvider>
    //       <View style={styles.paypalContainer}>
    //         <View style={styles.paypalButton} id="Checkout"></View>
    //       </View>

    //     </View>
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
  //  fontFamily: "SofiaRegular",
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
