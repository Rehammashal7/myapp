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
  Button,
} from "react-native";
import { auth, db, storage } from '../firebase';
import { doc, collection, getDoc, getDocs } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Spinner from "react-native-loading-spinner-overlay";

const { width } = Dimensions.get("screen");
const Suggtions = ({ navigation, route }) => {
  const { weather, userId } = route.params;

  const [images, setImages] = useState([]);

  const [userOrders, setUserOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

 

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

  const handleLocationPress = () => {
    navigation.navigate('WeatherSearch', { userId });
  };
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weather Information</Text>
      {weather ? (
        <View>
          <Text style={styles.text}>Location: {weather.location}</Text>
          <Text style={styles.text}>Temperature: {weather.temp} °C</Text>
          <Text style={styles.text}>Description: {weather.description}</Text>
          <Button title="Change Location" onPress={handleLocationPress} />
        </View>
      ) : (
        <View>
          <Text style={styles.text}>No weather data available.</Text>
          <Button title="Set Location" onPress={handleLocationPress} />
        </View>
      )}

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
)};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  image: {
    width: 100,
    height: 100,
    margin: 10,
  },
});

export default Suggtions;








// import React, { useState, useEffect } from 'react';
// import { View, Text, Button, StyleSheet, Image } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { doc, collection, getDocs } from "firebase/firestore";
// import { db } from '../firebase';

// const suggtions = ({ navigation, route }) => {
//   const { weather, userId } = route.params;

//   const [images, setImages] = useState([]);

//   useEffect(() => {
//     const fetchUserOrders = async () => {
//       try {
//         console.log(userId);
//         const ordersSnapshot = await getDocs(collection(db, 'users', userId, 'HistoryOrder'));
     

//         const orders = ordersSnapshot.docs.map(doc => doc.data());
//         console.log('Fetched orders:', orders);

//         const images = orders.map(order => order.image).filter(Boolean);
//         console.log('Order images:', images);

//         // Shuffle and select two random images
//         const shuffledImages = images.sort(() => 0.5 - Math.random());
//         setImages(shuffledImages.slice(0, 2));
//       } catch (error) {
//         console.error('Error fetching orders:', error);
//       }
//     };

//     fetchUserOrders();
//   }, [userId]);

//   const handleLocationPress = () => {
//     navigation.navigate('WeatherSearch', { userId });
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Weather Information</Text>
//       {weather ? (
//         <View>
//           <Text style={styles.text}>Location: {weather.location}</Text>
//           <Text style={styles.text}>Temperature: {weather.temp} °C</Text>
//           <Text style={styles.text}>Description: {weather.description}</Text>
//           <Button title="Change Location" onPress={handleLocationPress} />
//         </View>
//       ) : (
//         <View>
//           <Text style={styles.text}>No weather data available.</Text>
//           <Button title="Set Location" onPress={handleLocationPress} />
//         </View>
//       )}

//       <View style={styles.imageContainer}>
//         {images.map((image, index) => (
//           <Image key={index} source={{ uri: image }} style={styles.image} />
//         ))}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   title: {
//     fontSize: 24,
//     marginBottom: 20,
//   },
//   text: {
//     fontSize: 18,
//     marginBottom: 10,
//   },
//   imageContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 20,
//   },
//   image: {
//     width: 100,
//     height: 100,
//     margin: 10,
//   },
// });

// export default suggtions;





















// import React, { useState, useEffect } from 'react';
// import { View, Text, Button, StyleSheet, Image } from 'react-native';
// import firebase from 'firebase/app';
// import 'firebase/firestore';

// const suggtions = ({ navigation, route }) => {
//   const { weather, userId } = route.params;

//   const [images, setImages] = useState([]);

//   useEffect(() => {
//     const fetchUserOrders = async () => {
//       const ordersSnapshot = await firebase.firestore().collection('users').doc(userId).collection('HistoryOrder').get();
//       console.log(ordersSnapshot)
//           const orders = ordersSnapshot.docs.map(doc => doc.data());
//       const images = orders.map(order => order.image);
//       setImages(images.sort(() => 0.5 - Math.random()).slice(0, 2)); // Get 2 random images
//     };

//     fetchUserOrders();
//   }, [userId]);

//   const handleLocationPress = () => {
//     navigation.navigate('WeatherSearch', { userId });
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Weather Information</Text>
//       {weather ? (
//         <View>
//           <Text style={styles.text}>Location: {weather.location}</Text>
//           <Text style={styles.text}>Temperature: {weather.temp} °C</Text>
//           <Text style={styles.text}>Description: {weather.description}</Text>
//           <Button title="Change Location" onPress={handleLocationPress} />
//         </View>
//       ) : (
//         <View>
//           <Text style={styles.text}>No weather data available.</Text>
//           <Button title="Set Location" onPress={handleLocationPress} />
//         </View>
//       )}

//       <View style={styles.imageContainer}>
//         {images.map((image, index) => (
//           <Image key={index} source={{ uri: image }} style={styles.image} />
//         ))}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   title: {
//     fontSize: 24,
//     marginBottom: 20,
//   },
//   text: {
//     fontSize: 18,
//     marginBottom: 10,
//   },
//   imageContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 20,
//   },
//   image: {
//     width: 100,
//     height: 100,
//     margin: 10,
//   },
// });

// export default suggtions;



















// // // src/HomeScreen.js

// // import React, { useState, useEffect } from 'react';
// // import { View, Text, Button, StyleSheet } from 'react-native';

// // const suggtions = ({ navigation, route }) => {
// //   const [weather, setWeather] = useState(null);

// //   useEffect(() => {
// //     if (route.params?.weather) {
// //       setWeather(route.params.weather);
// //     }
// //   }, [route.params?.weather]);

// //   const handleLocationPress = () => {
// //     navigation.navigate('WeatherSearch');
// //   };

// //   return (
// //     <View style={styles.container}>
// //       <Text style={styles.title}>Weather Information</Text>
// //       {weather ? (
// //         <View>
// //           <Text style={styles.text}>Location: {weather.location}</Text>
// //           <Text style={styles.text}>Temperature: {weather.temp} °C</Text>
// //           <Text style={styles.text}>Description: {weather.description}</Text>
// //           <Button title="Change Location" onPress={handleLocationPress} />
// //         </View>
// //       ) : (
// //         <View>
// //           <Text style={styles.text}>No weather data available.</Text>
// //           <Button title="Set Location" onPress={handleLocationPress} />
// //         </View>
// //       )}
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     padding: 20,
// //     backgroundColor: '#fff',
// //   },
// //   title: {
// //     fontSize: 24,
// //     marginBottom: 20,
// //   },
// //   text: {
// //     fontSize: 18,
// //     marginBottom: 10,
// //   },
// // });

// // export default suggtions;
