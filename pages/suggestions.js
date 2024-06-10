import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Button,
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc } from "firebase/firestore";
import { db } from '../firebase';

const Suggestions = ({ navigation, route }) => {
  const { weather = null, userId = '' } = route.params || {};

  const [isLoading, setIsLoading] = useState(true);
  const [filteredOrders, setFilteredOrders] = useState([]);

  const getSeason = (temp) => {
    if (temp >= 25) return 'summer';
    if (temp >= 15 && temp < 25) return 'spring';
    if (temp >= 5 && temp < 15) return 'fall';
    return 'winter';
  };

  const fetchAndFilterOrders = async () => {
    if (!weather || !userId) {
      console.error("Weather or userId is missing");
      setIsLoading(false);
      return;
    }

    try {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();

        if (userData && userData.HistoryOrder) {
          const season = getSeason(weather.temp);
          const seasonOrders = userData.HistoryOrder.filter(order => order.season === season);

          const dressOrders = seasonOrders.filter(order => order.type === 'dress');
          console.log("Dress Orders:", dressOrders);

          if (dressOrders.length > 0) {
            const randomDress = dressOrders[Math.floor(Math.random() * dressOrders.length)];
            console.log("Selected Dress Order:", randomDress);
            setFilteredOrders([randomDress]);
          } else {
            const pantsOrders = seasonOrders.filter(order => order.type === 'trousers');
            const blouseOrders = seasonOrders.filter(order => order.type === 't-shirt');

            let selectedOrders = [];
            if (pantsOrders.length > 0) {
              selectedOrders.push(pantsOrders[Math.floor(Math.random() * pantsOrders.length)]);
            }
            if (blouseOrders.length > 0) {
              selectedOrders.push(blouseOrders[Math.floor(Math.random() * blouseOrders.length)]);
            }

            setFilteredOrders(selectedOrders);
          }
        }
      } else {
        console.error("No such user document!");
      }
    } catch (error) {
      console.error("Error fetching user orders: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAndFilterOrders();
  }, [weather, userId]);

  const handleLocationPress = () => {
    navigation.navigate('weathersearch', { userId });
  };

  const handleRefreshPress = () => {
    setIsLoading(true);
    fetchAndFilterOrders();
  };

  const renderUserOrder = ({ item }) => (
    <View style={styles.cardView}>
      <Image source={{ uri: item.image }} style={filteredOrders.length === 1 ? styles.largeImage : styles.image} />
      <Text>{item.name}</Text>
      <Text>{item.price}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.weatherInfo}>
          {weather && (
            <>
              <Text style={styles.text}>{weather.temp} °C</Text>
              <Text style={styles.text}>{weather.description}</Text>
            </>
          )}
        </View>
        <TouchableOpacity onPress={handleLocationPress} style={styles.locationIcon}>
          <Ionicons name="location-sharp" size={30} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.orderContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color="black" />
        ) : (
          <FlatList
            data={filteredOrders}
            renderItem={renderUserOrder}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.flatListContainer}
          />
        )}
      </View>

      {!isLoading && (
        <View style={styles.refreshButtonContainer}>
          <Button title="Refresh Suggestions" onPress={handleRefreshPress} color="black" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  locationIcon: {
    marginRight: 10,
  },
  weatherInfo: {
    flex: 1,
    alignItems: 'flex-start',
  },
  text: {
    fontSize: 18,
  },
  orderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  cardView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    margin: 10,
  },
  largeImage: {
    width: 200,
    height: 200,
    margin: 10,
  },
  flatListContainer: {
    alignItems: 'center',
  },
  refreshButtonContainer: {
    marginTop: 20,
    width: '100%',
  },
});

export default Suggestions;

























































// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   Image,
//   StyleSheet,
//   ActivityIndicator,
//   Button,
// } from "react-native";
// import { doc, getDoc } from "firebase/firestore";
// import { db } from '../firebase';

// const Suggestions = ({ navigation, route }) => {
//   const { weather = null, userId = '' } = route.params || {};

//   const [userOrders, setUserOrders] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [filteredOrders, setFilteredOrders] = useState([]);

//   const getSeason = (temp) => {
//     if (temp >= 25) return 'summer';
//     if (temp >= 15 && temp < 25) return 'spring';
//     if (temp >= 5 && temp < 15) return 'fall';
//     return 'winter';
//   };

//   const fetchAndFilterOrders = async () => {
//     if (!weather || !userId) {
//       console.error("Weather or userId is missing");
//       setIsLoading(false);
//       return;
//     }

//     try {
//       const userRef = doc(db, "users", userId);
//       const userSnap = await getDoc(userRef);

//       if (userSnap.exists()) {
//         const userData = userSnap.data();

//         if (userData && userData.HistoryOrder) {
//           const season = getSeason(weather.temp);
//           const seasonOrders = userData.HistoryOrder.filter(order => order.season === season);

//           const dressOrders = seasonOrders.filter(order => order.type === 'dress');
//           console.log("Dress Orders:", dressOrders);

//           if (dressOrders.length > 0) {
//             const randomDress = dressOrders[Math.floor(Math.random() * dressOrders.length)];
//             console.log("Selected Dress Order:", randomDress);
//             setFilteredOrders([randomDress]);
//           } else {
//             const pantsOrders = seasonOrders.filter(order => order.type === 'trousers');
//             const blouseOrders = seasonOrders.filter(order => order.type === 't-shirt');

//             let selectedOrders = [];
//             if (pantsOrders.length > 0) {
//               selectedOrders.push(pantsOrders[Math.floor(Math.random() * pantsOrders.length)]);
//             }
//             if (blouseOrders.length > 0) {
//               selectedOrders.push(blouseOrders[Math.floor(Math.random() * blouseOrders.length)]);
//             }

//             setFilteredOrders(selectedOrders);
//           }
//         }
//       } else {
//         console.error("No such user document!");
//       }
//     } catch (error) {
//       console.error("Error fetching user orders: ", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAndFilterOrders();
//   }, [weather, userId]);

//   const handleLocationPress = () => {
//     navigation.navigate('weathersearch', { userId });
//   };

//   const handleRefreshPress = () => {
//     setIsLoading(true);
//     fetchAndFilterOrders();
//   };

//   const renderUserOrder = ({ item }) => (
//     <TouchableOpacity>
//       <View style={styles.cardView}>
//         <Image source={{ uri: item.image }} style={styles.image} />
//         <Text>{item.name}</Text>
//         <Text>{item.price}</Text>
//       </View>
//     </TouchableOpacity>
//   );

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

//       <View style={styles.orderContainer}>
//         {isLoading ? (
//           <ActivityIndicator size="large" color="black" />
//         ) : (
//           <FlatList
//             data={filteredOrders}
//             renderItem={renderUserOrder}
//             keyExtractor={(item) => item.id}
//           />
//         )}
//       </View>

//       <Button title="Refresh Suggestions" onPress={handleRefreshPress} />
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
//   orderContainer: {
//     flex: 1,
//     marginTop: 20,
//     width: '100%',
//   },
//   cardView: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   image: {
//     width: 100,
//     height: 100,
//     margin: 10,
//   },
// });

// export default Suggestions;







