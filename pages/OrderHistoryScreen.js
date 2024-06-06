import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { auth, db, storage } from '../firebase';
import { doc, collection, getDoc, getDocs } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Spinner from "react-native-loading-spinner-overlay";

const { width } = Dimensions.get("screen");

const OrderHistoryScreen =  ({ navigation, route }) => {

  const [userOrders, setUserOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const {  userId } = route.params;

console.log(userId);
console.log("yyy");

  useEffect(() => {
    const getUserOrders = async () => {
      try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.data();
        console.log(userData);

        if (userData && userData.HistoryOrder) {
          setUserOrders(userData.HistoryOrder);
        }
      } catch (error) {
        console.error("Error fetching user orders: ", error);
      } finally {
        setIsLoading(false);
      }
    };
    getUserOrders();
  }, [userId]);

  const renderUserOrder = ({ item }) => (
    <TouchableOpacity onPress={() => handleUserOrderPress(item)}>
      <View style={styles.cardView}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <Text>{item.name}</Text>
        <Text>{item.price}</Text>
        {/* Add any other relevant information here */}
      </View>
    </TouchableOpacity>
  );

  const handleUserOrderPress = (order) => {
    // Handle navigation to order details page
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Spinner
          visible={isLoading}
          customIndicator={<ActivityIndicator size="large" color="black" />}
        />
      ) : (
        <FlatList
          data={userOrders}
          renderItem={renderUserOrder}
          keyExtractor={(item) => item.id}
        />
      )}


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardView: {
    flexDirection: "row",
    margin: 10,
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  image: {
    width: width * 0.25,
    height: width * 0.25,
    resizeMode: "cover",
    marginRight: 10,
  },
});

export default OrderHistoryScreen;
