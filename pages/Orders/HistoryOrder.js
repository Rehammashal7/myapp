import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Image, StyleSheet ,Pressable,Dimensions} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import  { filterOrder } from "../../data";

import {
  doc,
  collection,
  where,
  setDoc,
  updateDoc,
  getDocs,
  getDoc,

} from "firebase/firestore";
import { auth, db, storage } from "../../firebase";
const { width } = Dimensions.get("screen");
const { height } = Dimensions.get("screen");

const cardwidth = width / 2;

const HistoryOrder = ({navigation}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeIndexes, setActiveIndexes] = useState({});
  const [OrderList, setOrderList] = useState([]);

  useEffect(() => {
    getOrders();
  }, []);

  const getOrders = async () => {
    try {
      // استرجاع بيانات المستخدم
      const userId = await AsyncStorage.getItem("USERID");
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();

      const userOrders = userData.orders || [];

      setOrderList(userOrders);
      console.log(userOrders);
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

  const handleDotPress = (index) => {
    scrollViewRef.current.scrollTo({ x: index * imageWidth, animated: true });
    setActiveIndex(index);
  };

  const handleScroll = (event, productId) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.floor(contentOffsetX / imageWidth);
    setActiveIndexes((prevState) => ({
      ...prevState,
      [productId]: currentIndex,
    }));
  };

  return (
    <View style={styles.header}>
        <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={filterOrder}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <Pressable onPress={() => navigation.navigate(item.name)}>
              <View
                style={
                  item.name === "HistoryOrder"
                    ? { ...styles.smallCardSelected }
                    : { ...styles.smallCard }
                }
              >
                <View style={styles.smallCardText}>
                  <Text
                    style={
                      item.name === "HistoryOrder"
                        ? { ...styles.boldText }
                        : { ...styles.regularText }
                    }
                  >
                    {item.name}
                  </Text>
                </View>
              </View>
            </Pressable>
          )}
        />
        
      </View>
    
  
  );
};

export default HistoryOrder;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    backgroundColor: "#FBFAFF",
    height: 70,
  },
  smallCard: {
    // borderRadius: 30,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    width: width/3,
    height: 70,
    borderBottomColor: "transparent",
    borderBottomWidth: 2,
  },
  smallCardSelected: {
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    width: width/3,
    height: 70,
    shadowColor: "black",
    borderBottomColor: "black",
    borderBottomWidth: 2,
  },
  smallCardText: {
    fontSize: 14,
    color: "black",
    textAlign: "center",
    marginTop: 5,
  },
  smallCardText: {
    fontSize: 14,
    color: "black",
    textAlign: "center",
    marginTop: 5,
  },
  boldText: {
    fontWeight: "bold",
    fontSize: 18,
  },
  regularText: {
    fontWeight: "normal",
    fontSize: 16,
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
