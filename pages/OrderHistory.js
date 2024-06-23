import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Image, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";


import {
  doc,
  collection,
  where,
  setDoc,
  updateDoc,
  getDocs,
  getDoc,

} from "firebase/firestore";
import { auth, db, storage } from "../firebase";
// const [userId, setUserId] = useState(route.params.userId);
const OrderHistory = ({navigation}) => {
  const [OrderList, setOrderList] = useState([]);

  useEffect(() => {
    getOrders();
  }, []);

  const getOrders = async () => {
    try {
      
      const userId = await AsyncStorage.getItem("USERID");
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();

      const userOrders = userData.orders || [];

      setOrderList(userOrders);
     
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const formatDate = (timestamp) => {
    // Check if the timestamp is a Firebase Timestamp
    if (timestamp && timestamp.seconds && timestamp.nanoseconds) {
      // Convert Firebase Timestamp to JavaScript Date
      const date = new Date(
        timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
      );
      // Check if the parsedDate is a valid date
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString();
      }
    }

    return "Invalid Date";
  };

  return (
    <View>
      <Text style={styles.pageTitle}>Order History</Text>
      <FlatList
        data={OrderList}
        keyExtractor={(item) => item.productId}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
            </View>
            
            <View style={styles.textContainer}>
            <View style={styles.dateContainer}>
            <Text style={styles.dateText}> Date: {formatDate(item.timestamp)}
              </Text>
            </View>
              <Text style={styles.itemText}>
                Product Name: {item.productName}
              </Text>
              <Text style={styles.itemText}>Price: ${item.totalPrice}</Text>
              <Text style={styles.itemText}>Quantity: {item.quantity}</Text>
              
            </View>
          </View>
        )}
      />
    </View>
  
  );
};

export default OrderHistory;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "left",
    marginVertical: 16,
    paddingLeft: 10,
  },
  itemContainer: {
    flexDirection: "row", 
    backgroundColor: "#f0f0f0",
    padding: 1,
    marginBottom: 10,
    borderRadius: 4,
    marginRight:10 ,
  },
  imageContainer: {
    marginRight: 10, 
  },
  itemImage: {
    width: 90,
    height: 90,
    borderRadius: 10,
  },
  textContainer: {
    marginLeft: 10,
    marginRight: 10,
    marginTop:5,
  },
  itemText: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "left", 
  },
  dateText: {
    fontSize: 10,
    fontWeight: "bold",
    marginRight: 0,
    },
  dateContainer: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginRight: -20,

  },
});
