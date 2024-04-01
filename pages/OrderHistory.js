import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Pressable,
  TextInput,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
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
import { Ionicons } from "@expo/vector-icons"; // استيراد أيقونة من مكتبة الرموز
// const [userId, setUserId] = useState(route.params.userId);
const OrderHistory = ({}) => {
  const [OrderList, setOrderList] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
  const [date, setDate] = useState(null);
  const [mode, setMode] = useState("date");
  // const [text,setText] = useState('empty');

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowPicker(Platform.OS === "ios");
    setDate(currentDate);
    if (Platform.OS === "android") {
      // toggleDatepicker(); // إغلاق المفتاح بعد تحديد التاريخ
      setShowPicker(false);
    }
    // if(type == "set"){
    //   const currentDate = selectDate ;
    //   setDate(currentDate);
    //   if (Platform.OS === " android"){
    //     toggleDatepicker();
    //     setDate(currentDate.toDateString());
    //   }
    // }
    // else{
    //   toggleDatepicker();
    // }
  };

  //  const toggleDatepicker = () => {
  //   setShowPicker(!showPicker);
  //  }
  const toggleDatepicker = () => {
    setShowPicker((prevState) => !prevState);
  };

  useEffect(() => {
    getOrders();
  }, [date]);

  const getOrders = async () => {
    try {
      // استرجاع بيانات المستخدم
      const userId = await AsyncStorage.getItem("USERID");
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();

      const userOrders = userData.orders || [];

      if (!date) {
        setOrderList(userOrders);
        return;
      }

      const filteredOrders = userOrders.filter((Order) => {
        const orderDate = new Date(Order.timestamp.seconds * 1000);
        return orderDate.toDateString() === date.toDateString();
      });
      setOrderList(filteredOrders);
      if (filteredOrders.length === 0) {
        // لم يتم العثور على أي طلبات
        alert("You have not made any purchases on this day");
      }
      if (OrderList.length === 0) {
        alert("You haven't made any orders yet.");
      }
      // console.log(userOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const formatDate = (timestamp) => {
    if (timestamp instanceof Date) {
      // If the timestamp is already a Date object, return it formatted
      return timestamp.toLocaleDateString();
    } else if (
      timestamp &&
      typeof timestamp === "object" &&
      timestamp.seconds &&
      timestamp.nanoseconds
    ) {
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
  const clearDate = () => {
    setDate(null); 
  };

  return (
    <View>
      <Text style={styles.pageTitle}>Order History</Text>
      <View style={styles.dateContain}>
        {!showPicker && (
          <Pressable onPress={toggleDatepicker} style={styles.datePressable}>
            <Ionicons
              name="md-calendar"
              size={25}
              color="black"
              style={styles.calendarIcon}
            />
            <Text style={styles.input}>
              {date ? formatDate(date) : "Select Date"}
            </Text>
            <Pressable onPress={clearDate} style={styles.trashIcon}>
              <Ionicons name="trash-outline" size={20} color="black" />
            </Pressable>
          </Pressable>
        )}
        {showPicker && (
          <DateTimePicker
            mode="date"
            display="spinner"
            value={date || new Date()}
            onChange={onChange}
            minimumDate={new Date("2000-1-1")}
          />
        )}
      </View>

      <FlatList
        data={date ? OrderList : OrderList}
        keyExtractor={(item) => item.productId}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
            </View>

            <View style={styles.textContainer}>
              <View style={styles.dateContainer}>
                <Text style={styles.dateText}>
                  Date: {formatDate(item.timestamp)}
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
    backgroundColor: "#FFFFFF",
  },
  // pageTitle: {
  //   fontSize: 24,
  //   fontWeight: "bold",
  //   textAlign: "left",
  //   marginVertical: 16,
  //   color: "#000000",
  // },
  itemContainer: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    padding: 5,
    marginBottom: 10,
    borderRadius: 4,
    marginRight: 10,
    alignItems: "center", // لتوسيط العناصر عمودياً
  },
  imageContainer: {
    marginRight: 10,
  },
  itemImage: {
    width: 90,
    height: 110,
    borderRadius: 10,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
  },
  itemText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "left",
    color: "#000000",
  },
  dateText: {
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: "auto", // يضع التاريخ على اليمين
    color: "#000000",
  },

  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "left", // لتحقيق التوجيه لليمين
    marginVertical: 16,
    paddingRight: 10,
    paddingLeft: 10, // يضع هامشًا على اليمين للعنوان
    // يضع هامشًا على اليمين للعنوان
    color: "#000000",
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end', // لجعل العناصر تُحاذ إلى اليمين
    alignSelf: 'flex-end', // لتحديد الموقع الذاتي لنفس العنصر
    alignItems: 'center',
    marginVertical: 10,
  },
  
  dateContain: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // لتوزيع العناصر بين الفراغات بالتساوي على السطر
    marginVertical: 10,
  },
  input: {
    fontSize: 18,
    paddingHorizontal: 8,
    paddingVertical: 6,
    textAlign: "center",
    color: "#000000",
  },
  calendarIcon: {
    marginLeft: 5, // يضع الهامش الأيسر للأيقونة لتكون جنب النص
  },
  datePressable: {
    position: 'absolute', // لجعل العنصر موجودًا بموقع ثابت
  top: -55, // تحديد الموضع من الأعلى
  right: 10, // تحديد الموضع من اليمين
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'center', // لتحقيق التوجيه لليمين

  },
});
