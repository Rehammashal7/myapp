
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';

const Suggestions = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { weather, userId } = route.params || {};
  const [governorate, setGovernorate] = useState('');
  const [loading, setLoading] = useState(true);
  const [combinations, setCombinations] = useState([]);
  const [displayedCombinations, setDisplayedCombinations] = useState([]);
  const [noMoreSuggestions, setNoMoreSuggestions] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (weather) {
      setGovernorate(weather.location);
      fetchSuggestions(weather);
    }
  }, [weather]);

  useFocusEffect(
    React.useCallback(() => {
      if (weather) {
        fetchSuggestions(weather);
      }
    }, [weather])
  );

  const getSeason = (temp) => {
    if (temp >= 25) return 'summer';
    if (temp >= 15 && temp < 25) return 'spring';
    if (temp >= 5 && temp < 15) return 'fall';
    return 'winter';
  };

  const fetchSuggestions = async (weatherData) => {
    try {
      setLoading(true);
      const season = getSeason(weatherData.temp);

      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const seasonOrders = userData.HistoryOrder.filter(order => order.season === season);
        const seasonClothes = userData.clothes.filter(clothes => clothes.season === season);

        const combinedItems = [...seasonOrders, ...seasonClothes];
        const tShirts = combinedItems.filter(item => item.type === 't-shirt');
        const trousers = combinedItems.filter(item => item.type === 'trousers');
        const dresses = combinedItems.filter(item => item.type === 'dress');

        const allCombinations = [
          ...tShirts.flatMap(tShirt =>
            trousers.map(trouser => ({ tShirt: tShirt.image || tShirt.imageUrl, trouser: trouser.image || trouser.imageUrl }))
          ),
          ...dresses.map(dress => ({ dress: dress.image || dress.imageUrl })),
        ];

        setCombinations(allCombinations);
        setNoMoreSuggestions(false);
        setDisplayedCombinations([]);

        getNextCombination(allCombinations);
      } else {
        console.error('No such user document!');
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getNextCombination = (combinationsArray = combinations) => {
    const remainingCombinations = combinationsArray.filter(
      combo => !displayedCombinations.some(displayedCombo =>
        (combo.tShirt && combo.trouser && displayedCombo.tShirt === combo.tShirt && displayedCombo.trouser === combo.trouser) ||
        (combo.dress && displayedCombo.dress === combo.dress)
      )
    );

    if (remainingCombinations.length === 0) {
      setNoMoreSuggestions(true);
      return null;
    }

    const randomIndex = Math.floor(Math.random() * remainingCombinations.length);
    const nextCombination = remainingCombinations[randomIndex];

    setDisplayedCombinations([...displayedCombinations, nextCombination]);
    return nextCombination;
  };

  const handleLocationPress = () => {
    navigation.navigate('weathersearch', { userId });
  };

  const handleRefreshPress = async () => {
    setRefreshing(true);
    try {
      let nextCombination;
      if (selectedItem) {
        const filteredCombinations = combinations.filter(
          combo =>
            (selectedItem.type === 't-shirt' && selectedItem.image === combo.tShirt) ||
            (selectedItem.type === 'trousers' && selectedItem.image === combo.trouser) ||
            (selectedItem.type === 'dress' && selectedItem.image === combo.dress)
        );

        nextCombination = filteredCombinations.find(
          combo => !displayedCombinations.some(displayedCombo =>
            (combo.tShirt && combo.trouser && displayedCombo.tShirt === combo.tShirt && displayedCombo.trouser === combo.trouser) ||
            (combo.dress && displayedCombo.dress === combo.dress)
          )
        );
      } else {
        nextCombination = getNextCombination();
      }

      if (nextCombination) {
        setDisplayedCombinations([...displayedCombinations, nextCombination]);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleRepeatPress = () => {
    setDisplayedCombinations([]);
    setNoMoreSuggestions(false);
    setSelectedItem(null);
    getNextCombination(combinations);
  };

  const handleItemPress = (item, type) => {
    if (selectedItem && selectedItem.image === item) {
      setSelectedItem(null);
    } else {
      setSelectedItem({ image: item, type });
    }
  };

  const currentCombination = displayedCombinations[displayedCombinations.length - 1];


return (
  <View style={styles.container}>
    <View style={styles.header}>
      <View style={styles.weatherInfo}>
        {weather ? (
          <>
            <Text style={styles.text}>{weather.temp} °C</Text>
            <Text style={styles.text}>{weather.description}</Text>
          </>
        ) : (
          <Text style={styles.text}></Text>
        )}
      </View>
      <TouchableOpacity onPress={handleLocationPress} style={styles.locationIcon}>
        {governorate ? (
          <Text style={styles.text}>{governorate}</Text>
        ) : (
          <Ionicons name="location-sharp" size={35} color="black" />
        )}
      </TouchableOpacity>
    </View>

    <TouchableOpacity onPress={() => navigation.navigate('addclothes')} style={styles.addIcon}>
      <Ionicons name="add-circle-outline" size={50} color="black" />
    </TouchableOpacity>

    {!weather ? (
      <View style={styles.placeholderContainer}>
        <Image source={require('../assets/placeholder.webp')} style={styles.placeholderImage} />
        <Text style={styles.placeholderText}>Please select your location to get suggestions</Text>
      </View>
    ) : (
      <>
        {loading ? (
          <ActivityIndicator size="large" color="black" />
        ) : (
          <>
            {noMoreSuggestions ? (
              <Text style={styles.text}>No more suggestions available</Text>
            ) : (
              <>
                {currentCombination ? (
                  <>
                    {currentCombination.tShirt && currentCombination.trouser ? (
                      <>
                        <TouchableOpacity
                          style={[
                            styles.suggestionItem,
                            selectedItem && selectedItem.image === currentCombination.tShirt && styles.selectedItem
                          ]}
                          onPress={() => handleItemPress(currentCombination.tShirt, 't-shirt')}
                        >
                          <Image source={{ uri: currentCombination.tShirt }} style={styles.suggestionImage} />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            styles.suggestionItem,
                            selectedItem && selectedItem.image === currentCombination.trouser && styles.selectedItem
                          ]}
                          onPress={() => handleItemPress(currentCombination.trouser, 'trousers')}
                        >
                          <Image source={{ uri: currentCombination.trouser }} style={styles.suggestionImage} />
                        </TouchableOpacity>
                      </>
                    ) : (
                      <TouchableOpacity
                        style={[
                          styles.suggestionItem,
                          selectedItem && selectedItem.image === currentCombination.dress && styles.selectedItem
                        ]}
                        onPress={() => handleItemPress(currentCombination.dress, 'dress')}
                      >
                        <Image source={{ uri: currentCombination.dress }} style={styles.suggestionImage} />
                      </TouchableOpacity>
                    )}
                  </>
                ) : (
                  <Text style={styles.text}>No suggestions available</Text>
                )}
              </>
            )}
          </>
        )}
        <View style={styles.buttonContainer}>
          {refreshing ? (
            <ActivityIndicator size="small" color="black" />
          ) : (
            !noMoreSuggestions && (
              <Button title="Refresh Suggestions" onPress={handleRefreshPress} color="black" />
            )
          )}

          {noMoreSuggestions && (
            <Button title="Repeat Suggestions" onPress={handleRepeatPress} color="black" />
          )}
        </View>
      </>
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
  marginRight: 8,
},
weatherInfo: {
  flex: 1,
  alignItems: 'flex-start',
},
text: {
  fontSize: 18,
},
buttonContainer: {
  marginTop: 20,
  alignItems: 'center',
},
suggestionItem: {
  padding: 10,
  borderBottomWidth: 1,
  borderBottomColor: '#ccc',
},
suggestionImage: {
  width: '100%',
  height: 200,
  resizeMode: 'cover',
},
placeholderContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
},
placeholderImage: {
  width: 150,
  height: 150,
  marginBottom: 20,
},
placeaholderText: {
  fontSize: 18,
  textAlign: 'center',
},
selectedItem: {
  borderColor: 'black',
  borderWidth: 2,
},
addIcon: {
  position: 'absolute',
  bottom:10,
  right: 9,
  zIndex: 10,
 
},
});

export default Suggestions;


// import React, { useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Button } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { doc, getDoc } from 'firebase/firestore';
// import { db } from '../firebase';
// import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';

// const Suggestions = () => {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const { weather, userId } = route.params || {};
//   const [governorate, setGovernorate] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [combinations, setCombinations] = useState([]);
//   const [displayedCombinations, setDisplayedCombinations] = useState([]);
//   const [noMoreSuggestions, setNoMoreSuggestions] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [refreshing, setRefreshing] = useState(false);

//   useEffect(() => {
//     if (weather) {
//       setGovernorate(weather.location);
//       fetchSuggestions(weather);
//     }
//   }, [weather]);

//   useFocusEffect(
//     React.useCallback(() => {
//       if (weather) {
//         fetchSuggestions(weather);
//       }
//     }, [weather])
//   );

//   const getSeason = (temp) => {
//     if (temp >= 25) return 'summer';
//     if (temp >= 15 && temp < 25) return 'spring';
//     if (temp >= 5 && temp < 15) return 'fall';
//     return 'winter';
//   };

//   const fetchSuggestions = async (weatherData) => {
//     try {
//       setLoading(true);
//       const season = getSeason(weatherData.temp);

//       const userRef = doc(db, 'users', userId);
//       const userSnap = await getDoc(userRef);

//       if (userSnap.exists()) {
//         const userData = userSnap.data();
//         const seasonOrders = userData.HistoryOrder.filter(order => order.season === season);
//         const seasonClothes = userData.clothes.filter(clothes => clothes.season === season);

//         const combinedItems = [...seasonOrders, ...seasonClothes];
//         const tShirts = combinedItems.filter(item => item.type === 't-shirt');
//         const trousers = combinedItems.filter(item => item.type === 'trousers');
//         const dresses = combinedItems.filter(item => item.type === 'dress');

//         const allCombinations = [
//           ...tShirts.flatMap(tShirt =>
//             trousers.map(trouser => ({ tShirt: tShirt.image || tShirt.imageUrl, trouser: trouser.image || trouser.imageUrl }))
//           ),
//           ...dresses.map(dress => ({ dress: dress.image || dress.imageUrl })),
//         ];

//         setCombinations(allCombinations);
//         setNoMoreSuggestions(false);
//         setDisplayedCombinations([]);

//         getNextCombination(allCombinations);
//       } else {
//         console.error('No such user document!');
//       }
//     } catch (error) {
//       console.error('Error fetching suggestions:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getNextCombination = (combinationsArray = combinations) => {
//     const remainingCombinations = combinationsArray.filter(
//       combo => !displayedCombinations.some(displayedCombo =>
//         (combo.tShirt && combo.trouser && displayedCombo.tShirt === combo.tShirt && displayedCombo.trouser === combo.trouser) ||
//         (combo.dress && displayedCombo.dress === combo.dress)
//       )
//     );

//     if (remainingCombinations.length === 0) {
//       setNoMoreSuggestions(true);
//       return null;
//     }

//     const randomIndex = Math.floor(Math.random() * remainingCombinations.length);
//     const nextCombination = remainingCombinations[randomIndex];

//     setDisplayedCombinations([...displayedCombinations, nextCombination]);
//     return nextCombination;
//   };

//   const handleLocationPress = () => {
//     navigation.navigate('weathersearch', { userId });
//   };

//   const handleRefreshPress = async () => {
//     setRefreshing(true);
//     try {
//       let nextCombination;
//       if (selectedItem) {
//         const filteredCombinations = combinations.filter(
//           combo =>
//             (selectedItem.type === 't-shirt' && selectedItem.image === combo.tShirt) ||
//             (selectedItem.type === 'trousers' && selectedItem.image === combo.trouser) ||
//             (selectedItem.type === 'dress' && selectedItem.image === combo.dress)
//         );

//         nextCombination = filteredCombinations.find(
//           combo => !displayedCombinations.some(displayedCombo =>
//             (combo.tShirt && combo.trouser && displayedCombo.tShirt === combo.tShirt && displayedCombo.trouser === combo.trouser) ||
//             (combo.dress && displayedCombo.dress === combo.dress)
//           )
//         );
//       } else {
//         nextCombination = getNextCombination();
//       }

//       if (nextCombination) {
//         setDisplayedCombinations([...displayedCombinations, nextCombination]);
//       }
//     } catch (error) {
//       console.error('Error fetching suggestions:', error);
//     } finally {
//       setRefreshing(false);
//     }
//   };

//   const handleRepeatPress = () => {
//     setDisplayedCombinations([]);
//     setNoMoreSuggestions(false);
//     setSelectedItem(null);
//     getNextCombination(combinations);
//   };

//   const handleItemPress = (item, type) => {
//     if (selectedItem && selectedItem.image === item) {
//       setSelectedItem(null);
//     } else {
//       setSelectedItem({ image: item, type });
//     }
//   };

//   const currentCombination = displayedCombinations[displayedCombinations.length - 1];

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <View style={styles.weatherInfo}>
//           {weather ? (
//             <>
//               <Text style={styles.text}>{weather.temp} °C</Text>
//               <Text style={styles.text}>{weather.description}</Text>
//             </>
//           ) : (
//             <Text style={styles.text}></Text>
//           )}
//         </View>
//         <TouchableOpacity onPress={handleLocationPress} style={styles.locationIcon}>
//           {governorate ? (
//             <Text style={styles.text}>{governorate}</Text>
//           ) : (
//             <Ionicons name="location-sharp" size={30} color="black" />
//           )}
//         </TouchableOpacity>
//       </View>

//       {!weather ? (
//         <View style={styles.placeholderContainer}>
//           <Image source={require('../assets/placeholder.webp')} style={styles.placeholderImage} />
//           <Text style={styles.placeholderText}>Please select your location to get suggestions</Text>
//         </View>
//       ) : (
//         <>
//           {loading ? (
//             <ActivityIndicator size="large" color="black" />
//           ) : (
//             <>
//               {noMoreSuggestions ? (
//                 <Text style={styles.text}>No more suggestions available</Text>
//               ) : (
//                 <>
//                   {currentCombination ? (
//                     <>
//                       {currentCombination.tShirt && currentCombination.trouser ? (
//                         <>
//                           <TouchableOpacity
//                             style={[
//                               styles.suggestionItem,
//                               selectedItem && selectedItem.image === currentCombination.tShirt && styles.selectedItem
//                             ]}
//                             onPress={() => handleItemPress(currentCombination.tShirt, 't-shirt')}
//                           >
//                             <Image source={{ uri: currentCombination.tShirt }} style={styles.suggestionImage} />
//                           </TouchableOpacity>
//                           <TouchableOpacity
//                             style={[
//                               styles.suggestionItem,
//                               selectedItem && selectedItem.image === currentCombination.trouser && styles.selectedItem
//                             ]}
//                             onPress={() => handleItemPress(currentCombination.trouser, 'trousers')}
//                           >
//                             <Image source={{ uri: currentCombination.trouser }} style={styles.suggestionImage} />
//                           </TouchableOpacity>
//                         </>
//                       ) : (
//                         <TouchableOpacity
//                           style={[
//                             styles.suggestionItem,
//                             selectedItem && selectedItem.image === currentCombination.dress && styles.selectedItem
//                           ]}
//                           onPress={() => handleItemPress(currentCombination.dress, 'dress')}
//                         >
//                           <Image source={{ uri: currentCombination.dress }} style={styles.suggestionImage} />
//                         </TouchableOpacity>
//                       )}
//                     </>
//                   ) : (
//                     <Text style={styles.text}>No suggestions available</Text>
//                   )}
//                 </>
//               )}
//             </>
//           )}
//           <View style={styles.buttonContainer}>
//             {refreshing ? (
//               <ActivityIndicator size="small" color="black" />
//             ) : (
//               !noMoreSuggestions && (
//                 <Button title="Refresh Suggestions" onPress={handleRefreshPress} color="black" />
//               )
//             )}

//             {noMoreSuggestions && (
//               <Button title="Repeat Suggestions" onPress={handleRepeatPress} color="black" />
//             )}
//           </View>
//         </>
//       )}
//     </View>
//   );
// };



// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   locationIcon: {
//     marginRight: 10,
//   },
//   weatherInfo: {
//     flex: 1,
//     alignItems: 'flex-start',
//   },
//   text: {
//     fontSize: 18,
//   },
//   buttonContainer: {
//     marginTop: 20,
//     alignItems: 'center',
//   },
//   suggestionItem: {
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//   },
//   suggestionImage: {
//     width: '100%',
//     height: 200,
//     resizeMode: 'cover',
//   },
//   placeholderContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   placeholderImage: {
//     width: 200,
//     height: 200,
//     marginBottom: 20,
//   },
//   placeholderText: {
//     fontSize: 18,
//     textAlign: 'center',
//   },
//   selectedItem: {
//     borderColor: 'black',
//     borderWidth: 2,
//   },
// });

// export default Suggestions;


























// import React, { useState, useEffect, useLayoutEffect } from 'react';
// import { View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Button } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { doc, getDoc } from 'firebase/firestore';
// import { db } from '../firebase';
// import { useRoute, useNavigation } from '@react-navigation/native';

// const Suggestions = () => {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const { weather, userId } = route.params || {};
//   const [governorate, setGovernorate] = useState('');
//   const [combinations, setCombinations] = useState([]);
//   const [displayedCombinations, setDisplayedCombinations] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [noMoreSuggestions, setNoMoreSuggestions] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [refreshing, setRefreshing] = useState(false);

//   const getSeason = (temp) => {
//     if (temp >= 25) return 'summer';
//     if (temp >= 15 && temp < 25) return 'spring';
//     if (temp >= 5 && temp < 15) return 'fall';
//     return 'winter';
//   };

//   const fetchSuggestions = async () => {
//     try {
//       setLoading(true);
//       const season = getSeason(weather.temp);

//       const userRef = doc(db, 'users', userId);
//       const userSnap = await getDoc(userRef);

//       if (userSnap.exists()) {
//         const userData = userSnap.data();
//         const seasonOrders = userData.HistoryOrder.filter(order => order.season === season);
//         const seasonClothes = userData.clothes.filter(clothes => clothes.season === season);

//         const combinedItems = [...seasonOrders, ...seasonClothes];
//         const tShirts = combinedItems.filter(item => item.type === 't-shirt');
//         const trousers = combinedItems.filter(item => item.type === 'trousers');
//         const dresses = combinedItems.filter(item => item.type === 'dress');

//         const allCombinations = [
//           ...tShirts.flatMap(tShirt =>
//             trousers.map(trouser => ({ tShirt: tShirt.image || tShirt.imageUrl, trouser: trouser.image || trouser.imageUrl }))
//           ),
//           ...dresses.map(dress => ({ dress: dress.image || dress.imageUrl })),
//         ];

//         setCombinations(allCombinations);
//         setDisplayedCombinations([]);
//         setNoMoreSuggestions(false);

//         // Only get the next combination if there are no displayed combinations yet
//         if (displayedCombinations.length === 0) {
//           getNextCombination(allCombinations);
//         }
//       } else {
//         console.error('No such user document!');
//       }
//     } catch (error) {
//       console.error('Error fetching suggestions:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getNextCombination = (combinationsArray = combinations) => {
//     const remainingCombinations = combinationsArray.filter(
//       combo => !displayedCombinations.some(displayedCombo =>
//         (combo.tShirt && combo.trouser && displayedCombo.tShirt === combo.tShirt && displayedCombo.trouser === combo.trouser) ||
//         (combo.dress && displayedCombo.dress === combo.dress)
//       )
//     );

//     if (remainingCombinations.length === 0) {
//       setNoMoreSuggestions(true);
//       return null;
//     }

//     const randomIndex = Math.floor(Math.random() * remainingCombinations.length);
//     const nextCombination = remainingCombinations[randomIndex];

//     setDisplayedCombinations([...displayedCombinations, nextCombination]);
//     return nextCombination;
//   };

//   useEffect(() => {
//     if (weather) {
//       fetchSuggestions();
//       setGovernorate(weather.location);
//     }
//   }, [weather]);

//   useLayoutEffect(() => {
//     navigation.setOptions({
//       headerRight: () => (
//         <TouchableOpacity onPress={() => navigation.navigate('addclothes', { userId })}>
//           <Ionicons name="add-circle-outline" size={30} color="black" />
//         </TouchableOpacity>
//       ),
//     });
//   }, [navigation, userId]);

//   const handleLocationPress = () => {
//     navigation.navigate('weathersearch', { userId });
//   };

//   const handleRefreshPress = async () => {
//     setRefreshing(true);
//     try {
//       let nextCombination;
//       if (selectedItem) {
//         const filteredCombinations = combinations.filter(
//           combo =>
//             (selectedItem.type === 't-shirt' && selectedItem.image === combo.tShirt) ||
//             (selectedItem.type === 'trousers' && selectedItem.image === combo.trouser) ||
//             (selectedItem.type === 'dress' && selectedItem.image === combo.dress)
//         );

//         nextCombination = filteredCombinations.find(
//           combo => !displayedCombinations.some(displayedCombo =>
//             (combo.tShirt && combo.trouser && displayedCombo.tShirt === combo.tShirt && displayedCombo.trouser === combo.trouser) ||
//             (combo.dress && displayedCombo.dress === combo.dress)
//           )
//         );
//       } else {
//         nextCombination = getNextCombination();
//       }

//       if (nextCombination) {
//         setDisplayedCombinations([...displayedCombinations, nextCombination]);
//       }
//     } catch (error) {
//       console.error('Error fetching suggestions:', error);
//     } finally {
//       setRefreshing(false);
//     }
//   };

//   const handleRepeatPress = () => {
//     setDisplayedCombinations([]);
//     setNoMoreSuggestions(false);
//     setSelectedItem(null);
//     getNextCombination(combinations); // Pass the current combinations directly
//   };

//   const handleItemPress = (item, type) => {
//     if (selectedItem && selectedItem.image === item) {
//       setSelectedItem(null);
//     } else {
//       setSelectedItem({ image: item, type });
//     }
//   };

//   const currentCombination = displayedCombinations[displayedCombinations.length - 1];

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <View style={styles.weatherInfo}>
//           {weather ? (
//             <>
//               <Text style={styles.text}>{weather.temp} °C</Text>
//               <Text style={styles.text}>{weather.description}</Text>
//             </>
//           ) : (
//             <Text style={styles.text}></Text>
//           )}
//         </View>
//         <TouchableOpacity onPress={handleLocationPress} style={styles.locationIcon}>
//           {governorate ? (
//             <Text style={styles.text}>{governorate}</Text>
//           ) : (
//             <Ionicons name="location-sharp" size={30} color="black" />
//           )}
//         </TouchableOpacity>
//       </View>

//       {!weather ? (
//         <View style={styles.placeholderContainer}>
//           <Image source={require('../assets/placeholder.webp')} style={styles.placeholderImage} />
//           <Text style={styles.placeholderText}>Please select your location to get suggestions</Text>
//         </View>
//       ) : (
//         <>
//           {loading ? (
//             <ActivityIndicator size="large" color="black" />
//           ) : (
//             <>
//               {noMoreSuggestions ? (
//                 <Text style={styles.text}>No more suggestions available</Text>
//               ) : (
//                 <>
//                   {currentCombination ? (
//                     <>
//                       {currentCombination.tShirt && currentCombination.trouser ? (
//                         <>
//                           <TouchableOpacity
//                             style={[
//                               styles.suggestionItem,
//                               selectedItem && selectedItem.image === currentCombination.tShirt && styles.selectedItem
//                             ]}
//                             onPress={() => handleItemPress(currentCombination.tShirt, 't-shirt')}
//                           >
//                             <Image source={{ uri: currentCombination.tShirt }} style={styles.suggestionImage} />
//                           </TouchableOpacity>
//                           <TouchableOpacity
//                             style={[
//                               styles.suggestionItem,
//                               selectedItem && selectedItem.image === currentCombination.trouser && styles.selectedItem
//                             ]}
//                             onPress={() => handleItemPress(currentCombination.trouser, 'trousers')}
//                           >
//                             <Image source={{ uri: currentCombination.trouser }} style={styles.suggestionImage} />
//                           </TouchableOpacity>
//                         </>
//                       ) : (
//                         <TouchableOpacity
//                           style={[
//                             styles.suggestionItem,
//                             selectedItem && selectedItem.image === currentCombination.dress && styles.selectedItem
//                           ]}
//                           onPress={() => handleItemPress(currentCombination.dress, 'dress')}
//                         >
//                           <Image source={{ uri: currentCombination.dress }} style={styles.suggestionImage} />
//                         </TouchableOpacity>
//                       )}
//                     </>
//                   ) : (
//                     <Text style={styles.text}>No suggestions available</Text>
//                   )}
//                 </>
//               )}
//             </>
//           )}
//           <View style={styles.buttonContainer}>
//             {refreshing ? (
//               <ActivityIndicator size="small" color="black" />
//             ) : (
//               !noMoreSuggestions && (
//                 <Button title="Refresh Suggestions" onPress={handleRefreshPress} color="black" />
//               )
//             )}

//             {noMoreSuggestions && (
//               <Button title="Repeat Suggestions" onPress={handleRepeatPress} color="black" />
//             )}
//           </View>
//         </>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   locationIcon: {
//     marginRight: 10,
//   },
//   weatherInfo: {
//     flex: 1,
//     alignItems: 'flex-start',
//   },
//   text: {
//     fontSize: 18,
//   },
//   buttonContainer: {
//     marginTop: 20,
//     alignItems: 'center',
//   },
//   suggestionItem: {
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//   },
//   suggestionImage: {
//     width: '100%',
//     height: 200,
//     resizeMode: 'cover',
//   },
//   placeholderContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   placeholderImage: {
//     width: 200,
//     height: 200,
//     marginBottom: 20,
//   },
//   placeholderText: {
//     fontSize: 18,
//     textAlign: 'center',
//   },
//   selectedItem: {
//     borderColor: 'black',
//     borderWidth: 2,
//   },
// });

// export default Suggestions;





















// import React, { useState, useEffect, useLayoutEffect } from 'react';
// import { View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Button } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { doc, getDoc } from 'firebase/firestore';
// import { db } from '../firebase';
// import { useRoute, useNavigation } from '@react-navigation/native';

// const Suggestions = () => {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const { weather, userId } = route.params || {};
//   const [governorate, setGovernorate] = useState('');
//   const [combinations, setCombinations] = useState([]);
//   const [displayedCombinations, setDisplayedCombinations] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [noMoreSuggestions, setNoMoreSuggestions] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [refreshing, setRefreshing] = useState(false);

//   const getSeason = (temp) => {
//     if (temp >= 25) return 'summer';
//     if (temp >= 15 && temp < 25) return 'spring';
//     if (temp >= 5 && temp < 15) return 'fall';
//     return 'winter';
//   };

//   const fetchSuggestions = async () => {
//     try {
//       setLoading(true);
//       const season = getSeason(weather.temp);

//       const userRef = doc(db, 'users', userId);
//       const userSnap = await getDoc(userRef);

//       if (userSnap.exists()) {
//         const userData = userSnap.data();
//         const seasonOrders = userData.HistoryOrder.filter(order => order.season === season);
//         const seasonClothes = userData.clothes.filter(clothes => clothes.season === season);

//         const combinedItems = [...seasonOrders, ...seasonClothes];
//         const tShirts = combinedItems.filter(item => item.type === 't-shirt');
//         const trousers = combinedItems.filter(item => item.type === 'trousers');
//         const dresses = combinedItems.filter(item => item.type === 'dress');

//         const allCombinations = [
//           ...tShirts.flatMap(tShirt =>
//             trousers.map(trouser => ({ tShirt: tShirt.image || tShirt.imageUrl, trouser: trouser.image || trouser.imageUrl }))
//           ),
//           ...dresses.map(dress => ({ dress: dress.image || dress.imageUrl })),
//         ];

//         setCombinations(allCombinations);
//         setDisplayedCombinations([]);
//         setNoMoreSuggestions(false);

//         // Only get the next combination if there are no displayed combinations yet
//         if (displayedCombinations.length === 0) {
//           getNextCombination(allCombinations);
//         }
//       } else {
//         console.error('No such user document!');
//       }
//     } catch (error) {
//       console.error('Error fetching suggestions:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getNextCombination = (combinationsArray = combinations) => {
//     const remainingCombinations = combinationsArray.filter(
//       combo => !displayedCombinations.some(displayedCombo =>
//         (combo.tShirt && combo.trouser && displayedCombo.tShirt === combo.tShirt && displayedCombo.trouser === combo.trouser) ||
//         (combo.dress && displayedCombo.dress === combo.dress)
//       )
//     );

//     if (remainingCombinations.length === 0) {
//       setNoMoreSuggestions(true);
//       return null;
//     }

//     const randomIndex = Math.floor(Math.random() * remainingCombinations.length);
//     const nextCombination = remainingCombinations[randomIndex];

//     setDisplayedCombinations([...displayedCombinations, nextCombination]);
//     return nextCombination;
//   };

//   useEffect(() => {
//     if (weather) {
//       fetchSuggestions();
//       setGovernorate(weather.location);
//     }
//   }, [weather]);

//   useLayoutEffect(() => {
//     navigation.setOptions({
//       headerRight: () => (
//         <TouchableOpacity onPress={() => navigation.navigate('addclothes', { userId })}>
//           <Ionicons name="add-circle-outline" size={30} color="black" />
//         </TouchableOpacity>
//       ),
//     });
//   }, [navigation, userId]);

//   const handleLocationPress = () => {
//     navigation.navigate('weathersearch', { userId });
//   };

//   const handleRefreshPress = async () => {
//     setRefreshing(true);
//     try {
//       let nextCombination;
//       if (selectedItem) {
//         const filteredCombinations = combinations.filter(
//           combo =>
//             (selectedItem.type === 't-shirt' && selectedItem.image === combo.tShirt) ||
//             (selectedItem.type === 'trousers' && selectedItem.image === combo.trouser) ||
//             (selectedItem.type === 'dress' && selectedItem.image === combo.dress)
//         );

//         nextCombination = filteredCombinations.find(
//           combo => !displayedCombinations.some(displayedCombo =>
//             (combo.tShirt && combo.trouser && displayedCombo.tShirt === combo.tShirt && displayedCombo.trouser === combo.trouser) ||
//             (combo.dress && displayedCombo.dress === combo.dress)
//           )
//         );
//       } else {
//         nextCombination = getNextCombination();
//       }

//       if (nextCombination) {
//         setDisplayedCombinations([...displayedCombinations, nextCombination]);
//       }
//     } catch (error) {
//       console.error('Error fetching suggestions:', error);
//     } finally {
//       setRefreshing(false);
//     }
//   };

//   const handleRepeatPress = () => {
//     setDisplayedCombinations([]);
//     setNoMoreSuggestions(false);
//     const nextCombination = getNextCombination();
//     if (nextCombination) {
//       setSelectedItem(null);
//     }
//   };

//   const handleItemPress = (item, type) => {
//     if (selectedItem && selectedItem.image === item) {
//       setSelectedItem(null);
//     } else {
//       setSelectedItem({ image: item, type });
//     }
//   };

//   const currentCombination = displayedCombinations[displayedCombinations.length - 1];

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <View style={styles.weatherInfo}>
//           {weather ? (
//             <>
//               <Text style={styles.text}>{weather.temp} °C</Text>
//               <Text style={styles.text}>{weather.description}</Text>
//             </>
//           ) : (
//             <Text style={styles.text}></Text>
//           )}
//         </View>
//         <TouchableOpacity onPress={handleLocationPress} style={styles.locationIcon}>
//           {governorate ? (
//             <Text style={styles.text}>{governorate}</Text>
//           ) : (
//             <Ionicons name="location-sharp" size={30} color="black" />
//           )}
//         </TouchableOpacity>
//       </View>

//       {!weather ? (
//         <View style={styles.placeholderContainer}>
//           <Image source={require('../assets/placeholder.webp')} style={styles.placeholderImage} />
//           <Text style={styles.placeholderText}>Please select your location to get suggestions</Text>
//         </View>
//       ) : (
//         <>
//           {loading ? (
//             <ActivityIndicator size="large" color="black" />
//           ) : (
//             <>
//               {noMoreSuggestions ? (
//                 <Text style={styles.text}>No more suggestions available</Text>
//               ) : (
//                 <>
//                   {currentCombination ? (
//                     <>
//                       {currentCombination.tShirt && currentCombination.trouser ? (
//                         <>
//                           <TouchableOpacity
//                             style={[
//                               styles.suggestionItem,
//                               selectedItem && selectedItem.image === currentCombination.tShirt && styles.selectedItem
//                             ]}
//                             onPress={() => handleItemPress(currentCombination.tShirt, 't-shirt')}
//                           >
//                             <Image source={{ uri: currentCombination.tShirt }} style={styles.suggestionImage} />
//                           </TouchableOpacity>
//                           <TouchableOpacity
//                             style={[
//                               styles.suggestionItem,
//                               selectedItem && selectedItem.image === currentCombination.trouser && styles.selectedItem
//                             ]}
//                             onPress={() => handleItemPress(currentCombination.trouser, 'trousers')}
//                           >
//                             <Image source={{ uri: currentCombination.trouser }} style={styles.suggestionImage} />
//                           </TouchableOpacity>
//                         </>
//                       ) : (
//                         <TouchableOpacity
//                           style={[
//                             styles.suggestionItem,
//                             selectedItem && selectedItem.image === currentCombination.dress && styles.selectedItem
//                           ]}
//                           onPress={() => handleItemPress(currentCombination.dress, 'dress')}
//                         >
//                           <Image source={{ uri: currentCombination.dress }} style={styles.suggestionImage} />
//                         </TouchableOpacity>
//                       )}
//                     </>
//                   ) : (
//                     <Text style={styles.text}>No suggestions available</Text>
//                   )}
//                 </>
//               )}
//             </>
//           )}
//           <View style={styles.buttonContainer}>
//             {refreshing ? (
//               <ActivityIndicator size="small" color="black" />
//             ) : (
//               !noMoreSuggestions && (
//                 <Button title="Refresh Suggestions" onPress={handleRefreshPress} color="black" />
//               )
//             )}
//             {noMoreSuggestions && (
//               <Button title="Repeat Suggestions" onPress={handleRepeatPress} color="black" />
//             )}
//           </View>
//         </>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   locationIcon: {
//     marginRight: 10,
//   },
//   weatherInfo: {
//     flex: 1,
//     alignItems: 'flex-start',
//   },
//   text: {
//     fontSize: 18,
//   },
//   buttonContainer: {
//     marginTop: 20,
//     alignItems: 'center',
//   },
//   suggestionItem: {
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//   },
//   suggestionImage: {
//     width: '100%',
//     height: 200,
//     resizeMode: 'cover',
//   },
//   placeholderContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   placeholderImage: {
//     width: 200,
//     height: 200,
//     marginBottom: 20,
//   },
//   placeholderText: {
//     fontSize: 18,
//     textAlign: 'center',
//   },
//   selectedItem: {
//     borderColor: 'black',
//     borderWidth: 2,
//   },
// });

// export default Suggestions;









// import React, { useState, useEffect, useLayoutEffect } from 'react';
// import { View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Button } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { doc, getDoc } from 'firebase/firestore';
// import { db } from '../firebase';
// import { useRoute, useNavigation } from '@react-navigation/native';

// const Suggestions = () => {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const { weather, userId } = route.params || {};
//   const [governorate, setGovernorate] = useState('');
//   const [combinations, setCombinations] = useState([]);
//   const [displayedCombinations, setDisplayedCombinations] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [noMoreSuggestions, setNoMoreSuggestions] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [refreshing, setRefreshing] = useState(false);

//   const getSeason = (temp) => {
//     if (temp >= 25) return 'summer';
//     if (temp >= 15 && temp < 25) return 'spring';
//     if (temp >= 5 && temp < 15) return 'fall';
//     return 'winter';
//   };

//   const fetchSuggestions = async () => {
//     try {
//       setLoading(true);
//       const season = getSeason(weather.temp);

//       const userRef = doc(db, 'users', userId);
//       const userSnap = await getDoc(userRef);

//       if (userSnap.exists()) {
//         const userData = userSnap.data();
//         const seasonOrders = userData.HistoryOrder.filter(order => order.season === season);
//         const seasonClothes = userData.clothes.filter(clothes => clothes.season === season);

//         const combinedItems = [...seasonOrders, ...seasonClothes];
//         const tShirts = combinedItems.filter(item => item.type === 't-shirt');
//         const trousers = combinedItems.filter(item => item.type === 'trousers');
//         const dresses = combinedItems.filter(item => item.type === 'dress');

//         const allCombinations = [
//           ...tShirts.flatMap(tShirt =>
//             trousers.map(trouser => ({ tShirt: tShirt.image || tShirt.imageUrl, trouser: trouser.image || trouser.imageUrl }))
//           ),
//           ...dresses.map(dress => ({ dress: dress.image || dress.imageUrl })),
//         ];

//         setCombinations(allCombinations);
//         setDisplayedCombinations([]);
//         setNoMoreSuggestions(false);

//         // Only get the next combination if there are no displayed combinations yet
//         if (displayedCombinations.length === 0) {
//           getNextCombination(allCombinations);
//         }
//       } else {
//         console.error('No such user document!');
//       }
//     } catch (error) {
//       console.error('Error fetching suggestions:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getNextCombination = (combinationsArray = combinations) => {
//     const remainingCombinations = combinationsArray.filter(
//       combo => !displayedCombinations.some(displayedCombo =>
//         (combo.tShirt && combo.trouser && displayedCombo.tShirt === combo.tShirt && displayedCombo.trouser === combo.trouser) ||
//         (combo.dress && displayedCombo.dress === combo.dress)
//       )
//     );

//     if (remainingCombinations.length === 0) {
//       setNoMoreSuggestions(true);
//       return null;
//     }

//     const randomIndex = Math.floor(Math.random() * remainingCombinations.length);
//     const nextCombination = remainingCombinations[randomIndex];

//     setDisplayedCombinations([...displayedCombinations, nextCombination]);
//     return nextCombination;
//   };

//   useEffect(() => {
//     if (weather) {
//       fetchSuggestions();
//       setGovernorate(weather.location);
//     }
//   }, [weather]);

//   useLayoutEffect(() => {
//     navigation.setOptions({
//       headerRight: () => (
//         <TouchableOpacity onPress={() => navigation.navigate('addclothes', { userId })}>
//           <Ionicons name="add-circle-outline" size={30} color="black" />
//         </TouchableOpacity>
//       ),
//     });
//   }, [navigation, userId]);

//   const handleLocationPress = () => {
//     navigation.navigate('weathersearch', { userId });
//   };

//   const handleRefreshPress = async () => {
//     setRefreshing(true);
//     try {
//       let nextCombination;
//       if (selectedItem) {
//         const filteredCombinations = combinations.filter(
//           combo =>
//             (selectedItem.type === 't-shirt' && selectedItem.image === combo.tShirt) ||
//             (selectedItem.type === 'trousers' && selectedItem.image === combo.trouser) ||
//             (selectedItem.type === 'dress' && selectedItem.image === combo.dress)
//         );

//         nextCombination = filteredCombinations.find(
//           combo => !displayedCombinations.some(displayedCombo =>
//             (combo.tShirt && combo.trouser && displayedCombo.tShirt === combo.tShirt && displayedCombo.trouser === combo.trouser) ||
//             (combo.dress && displayedCombo.dress === combo.dress)
//           )
//         );
//       } else {
//         nextCombination = getNextCombination();
//       }

//       if (nextCombination) {
//         setDisplayedCombinations([...displayedCombinations, nextCombination]);
//       }
//     } catch (error) {
//       console.error('Error fetching suggestions:', error);
//     } finally {
//       setRefreshing(false);
//     }
//   };

//   const handleRepeatPress = () => {
//     setDisplayedCombinations([]);
//     setNoMoreSuggestions(false);
//     const nextCombination = getNextCombination();
//     if (nextCombination) {
//       setSelectedItem(null);
//     }
//   };

//   const handleItemPress = (item, type) => {
//     if (selectedItem && selectedItem.image === item) {
//       setSelectedItem(null);
//     } else {
//       setSelectedItem({ image: item, type });
//     }
//   };

//   const currentCombination = displayedCombinations[displayedCombinations.length - 1];

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <View style={styles.weatherInfo}>
//           {weather ? (
//             <>
//               <Text style={styles.text}>{weather.temp} °C</Text>
//               <Text style={styles.text}>{weather.description}</Text>
//             </>
//           ) : (
//             <Text style={styles.text}></Text>
//           )}
//         </View>
//         <TouchableOpacity onPress={handleLocationPress} style={styles.locationIcon}>
//           {governorate ? (
//             <Text style={styles.text}>{governorate}</Text>
//           ) : (
//             <Ionicons name="location-sharp" size={30} color="black" />
//           )}
//         </TouchableOpacity>
//       </View>

//       {!weather ? (
//         <View style={styles.placeholderContainer}>
//           <Image source={require('../assets/placeholder.webp')} style={styles.placeholderImage} />
//           <Text style={styles.placeholderText}>Please select your location to get suggestions</Text>
//         </View>
//       ) : (
//         <>
//           {loading ? (
//             <ActivityIndicator size="large" color="black" />
//           ) : (
//             <>
//               {currentCombination ? (
//                 <>
//                   {currentCombination.tShirt && currentCombination.trouser ? (
//                     <>
//                       <TouchableOpacity
//                         style={[
//                           styles.suggestionItem,
//                           selectedItem && selectedItem.image === currentCombination.tShirt && styles.selectedItem
//                         ]}
//                         onPress={() => handleItemPress(currentCombination.tShirt, 't-shirt')}
//                       >
//                         <Image source={{ uri: currentCombination.tShirt }} style={styles.suggestionImage} />
//                       </TouchableOpacity>
//                       <TouchableOpacity
//                         style={[
//                           styles.suggestionItem,
//                           selectedItem && selectedItem.image === currentCombination.trouser && styles.selectedItem
//                         ]}
//                         onPress={() => handleItemPress(currentCombination.trouser, 'trousers')}
//                       >
//                         <Image source={{ uri: currentCombination.trouser }} style={styles.suggestionImage} />
//                       </TouchableOpacity>
//                     </>
//                   ) : (
//                     <TouchableOpacity
//                       style={[
//                         styles.suggestionItem,
//                         selectedItem && selectedItem.image === currentCombination.dress && styles.selectedItem
//                       ]}
//                       onPress={() => handleItemPress(currentCombination.dress, 'dress')}
//                     >
//                       <Image source={{ uri: currentCombination.dress }} style={styles.suggestionImage} />
//                     </TouchableOpacity>
//                   )}
//                 </>
//               ) : (
//                 <Text style={styles.text}>No suggestions available</Text>
//               )}
//             </>
//           )}
//           <View style={styles.buttonContainer}>
//             {refreshing ? (
//               <ActivityIndicator size="small" color="black" />
//             ) : (
//               !noMoreSuggestions && (
//                 <Button title="Refresh Suggestions" onPress={handleRefreshPress} color="black" />
//               )
//             )}
//             {noMoreSuggestions && (
//               <Button title="Repeat Suggestions" onPress={handleRepeatPress} color="black" />
//             )}
//           </View>
//         </>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   locationIcon: {
//     marginRight: 10,
//   },
//   weatherInfo: {
//     flex: 1,
//     alignItems: 'flex-start',
//   },
//   text: {
//     fontSize: 18,
//   },
//   buttonContainer: {
//     marginTop: 20,
//     alignItems: 'center',
//   },
//   suggestionItem: {
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//   },
//   suggestionImage: {
//     width: '100%',
//     height: 200,
//     resizeMode: 'cover',
//   },
//   placeholderContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   placeholderImage: {
//     width: 200,
//     height: 200,
//     marginBottom: 20,
//   },
//   placeholderText: {
//     fontSize: 18,
//     textAlign: 'center',
//   },
//   selectedItem: {
//     borderColor: 'black',
//     borderWidth: 2,
//   },
// });

// export default Suggestions;









// import React, { useState, useEffect, useLayoutEffect } from 'react';
// import { View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Button } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { doc, getDoc } from 'firebase/firestore';
// import { db } from '../firebase';
// import { useRoute, useNavigation } from '@react-navigation/native';

// const Suggestions = () => {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const { weather, userId } = route.params || {};
//   const [governorate, setGovernorate] = useState('');
//   const [combinations, setCombinations] = useState([]);
//   const [displayedCombinations, setDisplayedCombinations] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [noMoreSuggestions, setNoMoreSuggestions] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [refreshing, setRefreshing] = useState(false);

//   const getSeason = (temp) => {
//     if (temp >= 25) return 'summer';
//     if (temp >= 15 && temp < 25) return 'spring';
//     if (temp >= 5 && temp < 15) return 'fall';
//     return 'winter';
//   };

//   const fetchSuggestions = async () => {
//     try {
//       setLoading(true);
//       const season = getSeason(weather.temp);

//       const userRef = doc(db, 'users', userId);
//       const userSnap = await getDoc(userRef);

//       if (userSnap.exists()) {
//         const userData = userSnap.data();
//         const seasonOrders = userData.HistoryOrder.filter(order => order.season === season);
//         const seasonClothes = userData.clothes.filter(clothes => clothes.season === season);

//         const combinedItems = [...seasonOrders, ...seasonClothes];
//         const tShirts = combinedItems.filter(item => item.type === 't-shirt');
//         const trousers = combinedItems.filter(item => item.type === 'trousers');
//         const dresses = combinedItems.filter(item => item.type === 'dress');

//         const allCombinations = [
//           ...tShirts.flatMap(tShirt =>
//             trousers.map(trouser => ({ tShirt: tShirt.image || tShirt.imageUrl, trouser: trouser.image || trouser.imageUrl }))
//           ),
//           ...dresses.map(dress => ({ dress: dress.image || dress.imageUrl })),
//         ];

//         setCombinations(allCombinations);
//         setDisplayedCombinations([]);
//         setNoMoreSuggestions(false);
//         getNextCombination(allCombinations); // Get the first combination after fetching suggestions
//       } else {
//         console.error('No such user document!');
//       }
//     } catch (error) {
//       console.error('Error fetching suggestions:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getNextCombination = (combinationsArray = combinations) => {
//     const remainingCombinations = combinationsArray.filter(
//       combo => !displayedCombinations.some(displayedCombo =>
//         (combo.tShirt && combo.trouser && displayedCombo.tShirt === combo.tShirt && displayedCombo.trouser === combo.trouser) ||
//         (combo.dress && displayedCombo.dress === combo.dress)
//       )
//     );

//     if (remainingCombinations.length === 0) {
//       setNoMoreSuggestions(true);
//       return null;
//     }

//     const randomIndex = Math.floor(Math.random() * remainingCombinations.length);
//     const nextCombination = remainingCombinations[randomIndex];

//     setDisplayedCombinations([...displayedCombinations, nextCombination]);
//     return nextCombination;
//   };

//   useEffect(() => {
//     if (weather) {
//       fetchSuggestions();
//       setGovernorate(weather.location);
//     }
//   }, [weather]);

//   useLayoutEffect(() => {
//     navigation.setOptions({
//       headerRight: () => (
//         <TouchableOpacity onPress={() => navigation.navigate('addclothes', { userId })}>
//           <Ionicons name="add-circle-outline" size={30} color="black" />
//         </TouchableOpacity>
//       ),
//     });
//   }, [navigation, userId]);

//   const handleLocationPress = () => {
//     navigation.navigate('weathersearch', { userId });
//   };

//   const handleRefreshPress = async () => {
//     setRefreshing(true);
//     try {
//       let nextCombination;
//       if (selectedItem) {
//         const filteredCombinations = combinations.filter(
//           combo =>
//             (selectedItem.type === 't-shirt' && selectedItem.image === combo.tShirt) ||
//             (selectedItem.type === 'trousers' && selectedItem.image === combo.trouser) ||
//             (selectedItem.type === 'dress' && selectedItem.image === combo.dress)
//         );

//         nextCombination = filteredCombinations.find(
//           combo => !displayedCombinations.some(displayedCombo =>
//             (combo.tShirt && combo.trouser && displayedCombo.tShirt === combo.tShirt && displayedCombo.trouser === combo.trouser) ||
//             (combo.dress && displayedCombo.dress === combo.dress)
//           )
//         );
//       } else {
//         nextCombination = getNextCombination();
//       }

//       if (nextCombination) {
//         setDisplayedCombinations([...displayedCombinations, nextCombination]);
//       }
//     } catch (error) {
//       console.error('Error fetching suggestions:', error);
//     } finally {
//       setRefreshing(false);
//     }
//   };

//   const handleRepeatPress = () => {
//     setDisplayedCombinations([]);
//     setNoMoreSuggestions(false);
//     const nextCombination = getNextCombination();
//     if (nextCombination) {
//       setSelectedItem(null);
//     }
//   };

//   const handleItemPress = (item, type) => {
//     if (selectedItem && selectedItem.image === item) {
//       setSelectedItem(null);
//     } else {
//       setSelectedItem({ image: item, type });
//     }
//   };

//   const currentCombination = displayedCombinations[displayedCombinations.length - 1];

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <View style={styles.weatherInfo}>
//           {weather ? (
//             <>
//               <Text style={styles.text}>{weather.temp} °C</Text>
//               <Text style={styles.text}>{weather.description}</Text>
//             </>
//           ) : (
//             <Text style={styles.text}></Text>
//           )}
//         </View>
//         <TouchableOpacity onPress={handleLocationPress} style={styles.locationIcon}>
//           {governorate ? (
//             <Text style={styles.text}>{governorate}</Text>
//           ) : (
//             <Ionicons name="location-sharp" size={30} color="black" />
//           )}
//         </TouchableOpacity>
//       </View>

//       {!weather ? (
//         <View style={styles.placeholderContainer}>
//           <Image source={require('../assets/placeholder.webp')} style={styles.placeholderImage} />
//           <Text style={styles.placeholderText}>Please select your location to get suggestions</Text>
//         </View>
//       ) : (
//         <>
//           {loading ? (
//             <ActivityIndicator size="large" color="black" />
//           ) : (
//             <>
//               {currentCombination ? (
//                 <>
//                   {currentCombination.tShirt && currentCombination.trouser ? (
//                     <>
//                       <TouchableOpacity
//                         style={[
//                           styles.suggestionItem,
//                           selectedItem && selectedItem.image === currentCombination.tShirt && styles.selectedItem
//                         ]}
//                         onPress={() => handleItemPress(currentCombination.tShirt, 't-shirt')}
//                       >
//                         <Image source={{ uri: currentCombination.tShirt }} style={styles.suggestionImage} />
//                       </TouchableOpacity>
//                       <TouchableOpacity
//                         style={[
//                           styles.suggestionItem,
//                           selectedItem && selectedItem.image === currentCombination.trouser && styles.selectedItem
//                         ]}
//                         onPress={() => handleItemPress(currentCombination.trouser, 'trousers')}
//                       >
//                         <Image source={{ uri: currentCombination.trouser }} style={styles.suggestionImage} />
//                       </TouchableOpacity>
//                     </>
//                   ) : (
//                     <TouchableOpacity
//                       style={[
//                         styles.suggestionItem,
//                         selectedItem && selectedItem.image === currentCombination.dress && styles.selectedItem
//                       ]}
//                       onPress={() => handleItemPress(currentCombination.dress, 'dress')}
//                     >
//                       <Image source={{ uri: currentCombination.dress }} style={styles.suggestionImage} />
//                     </TouchableOpacity>
//                   )}
//                 </>
//               ) : (
//                 <Text style={styles.text}>No suggestions available</Text>
//               )}
//             </>
//           )}
//           <View style={styles.buttonContainer}>
//             {refreshing ? (
//               <ActivityIndicator size="small" color="black" />
//             ) : (
//               !noMoreSuggestions && (
//                 <Button title="Refresh Suggestions" onPress={handleRefreshPress} color="black" />
//               )
//             )}
//             {noMoreSuggestions && (
//               <Button title="Repeat Suggestions" onPress={handleRepeatPress} color="black" />
//             )}
//           </View>
//         </>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   locationIcon: {
//     marginRight: 10,
//   },
//   weatherInfo: {
//     flex: 1,
//     alignItems: 'flex-start',
//   },
//   text: {
//     fontSize: 18,
//   },
//   buttonContainer: {
//     marginTop: 20,
//     alignItems: 'center',
//   },
//   suggestionItem: {
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//   },
//   suggestionImage: {
//     width: '100%',
//     height: 200,
//     resizeMode: 'cover',
//   },
//   placeholderContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   placeholderImage: {
//     width: 200,
//     height: 200,
//     marginBottom: 20,
//   },
//   placeholderText: {
//     fontSize: 18,
//     textAlign: 'center',
//   },
//   selectedItem: {
//     borderColor: 'black',
//     borderWidth: 2,
//   },
// });

// export default Suggestions;
























// import React, { useState, useEffect, useLayoutEffect } from 'react';
// import { View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Button } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { doc, getDoc } from 'firebase/firestore';
// import { db } from '../firebase';
// import { useRoute, useNavigation } from '@react-navigation/native';

// const Suggestions = () => {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const { weather, userId } = route.params || {};
//   const [governorate, setGovernorate] = useState('');
//   const [combinations, setCombinations] = useState([]);
//   const [displayedCombinations, setDisplayedCombinations] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [noMoreSuggestions, setNoMoreSuggestions] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [refreshing, setRefreshing] = useState(false);

//   const getSeason = (temp) => {
//     if (temp >= 25) return 'summer';
//     if (temp >= 15 && temp < 25) return 'spring';
//     if (temp >= 5 && temp < 15) return 'fall';
//     return 'winter';
//   };

//   const fetchSuggestions = async () => {
//     try {
//       setLoading(true);
//       const season = getSeason(weather.temp);

//       const userRef = doc(db, 'users', userId);
//       const userSnap = await getDoc(userRef);

//       if (userSnap.exists()) {
//         const userData = userSnap.data();
//         const seasonOrders = userData.HistoryOrder.filter(order => order.season === season);
//         const seasonClothes = userData.clothes.filter(clothes => clothes.season === season);

//         const combinedItems = [...seasonOrders, ...seasonClothes];
//         const tShirts = combinedItems.filter(item => item.type === 't-shirt');
//         const trousers = combinedItems.filter(item => item.type === 'trousers');
//         const dresses = combinedItems.filter(item => item.type === 'dress');

//         const allCombinations = [
//           ...tShirts.flatMap(tShirt =>
//             trousers.map(trouser => ({ tShirt: tShirt.image || tShirt.imageUrl, trouser: trouser.image || trouser.imageUrl }))
//           ),
//           ...dresses.map(dress => ({ dress: dress.image || dress.imageUrl })),
//         ];

//         setCombinations(allCombinations);
//         setDisplayedCombinations([]);
//         setNoMoreSuggestions(false);
//         getNextCombination(); // Get the first combination after fetching suggestions
//       } else {
//         console.error('No such user document!');
//       }
//     } catch (error) {
//       console.error('Error fetching suggestions:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getNextCombination = () => {
//     const remainingCombinations = combinations.filter(
//       combo => !displayedCombinations.some(displayedCombo =>
//         (combo.tShirt && combo.trouser && displayedCombo.tShirt === combo.tShirt && displayedCombo.trouser === combo.trouser) ||
//         (combo.dress && displayedCombo.dress === combo.dress)
//       )
//     );

//     if (remainingCombinations.length === 0) {
//       setNoMoreSuggestions(true);
//       return null;
//     }

//     const randomIndex = Math.floor(Math.random() * remainingCombinations.length);
//     const nextCombination = remainingCombinations[randomIndex];

//     setDisplayedCombinations([...displayedCombinations, nextCombination]);
//     return nextCombination;
//   };

//   useEffect(() => {
//     if (weather) {
//       fetchSuggestions();
//       setGovernorate(weather.location);
//     }
//   }, [weather]);

//   useLayoutEffect(() => {
//     navigation.setOptions({
//       headerRight: () => (
//         <TouchableOpacity onPress={() => navigation.navigate('addclothes', { userId })}>
//           <Ionicons name="add-circle-outline" size={30} color="black" />
//         </TouchableOpacity>
//       ),
//     });
//   }, [navigation, userId]);

//   const handleLocationPress = () => {
//     navigation.navigate('weathersearch', { userId });
//   };

//   const handleRefreshPress = async () => {
//     setRefreshing(true);
//     try {
//       let nextCombination;
//       if (selectedItem) {
//         const filteredCombinations = combinations.filter(
//           combo =>
//             (selectedItem.type === 't-shirt' && selectedItem.image === combo.tShirt) ||
//             (selectedItem.type === 'trousers' && selectedItem.image === combo.trouser) ||
//             (selectedItem.type === 'dress' && selectedItem.image === combo.dress)
//         );

//         nextCombination = filteredCombinations.find(
//           combo => !displayedCombinations.some(displayedCombo =>
//             (combo.tShirt && combo.trouser && displayedCombo.tShirt === combo.tShirt && displayedCombo.trouser === combo.trouser) ||
//             (combo.dress && displayedCombo.dress === combo.dress)
//           )
//         );
//       } else {
//         nextCombination = getNextCombination();
//       }

//       if (nextCombination) {
//         setDisplayedCombinations([...displayedCombinations, nextCombination]);
//       }
//     } catch (error) {
//       console.error('Error fetching suggestions:', error);
//     } finally {
//       setRefreshing(false);
//     }
//   };

//   const handleRepeatPress = () => {
//     setDisplayedCombinations([]);
//     setNoMoreSuggestions(false);
//     const nextCombination = getNextCombination();
//     if (nextCombination) {
//       setSelectedItem(null);
//     }
//   };

//   const handleItemPress = (item, type) => {
//     if (selectedItem && selectedItem.image === item) {
//       setSelectedItem(null);
//     } else {
//       setSelectedItem({ image: item, type });
//     }
//   };

//   const currentCombination = displayedCombinations[displayedCombinations.length - 1];

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <View style={styles.weatherInfo}>
//           {weather ? (
//             <>
//               <Text style={styles.text}>{weather.temp} °C</Text>
//               <Text style={styles.text}>{weather.description}</Text>
//             </>
//           ) : (
//             <Text style={styles.text}></Text>
//           )}
//         </View>
//         <TouchableOpacity onPress={handleLocationPress} style={styles.locationIcon}>
//           {governorate ? (
//             <Text style={styles.text}>{governorate}</Text>
//           ) : (
//             <Ionicons name="location-sharp" size={30} color="black" />
//           )}
//         </TouchableOpacity>
//       </View>

//       {!weather ? (
//         <View style={styles.placeholderContainer}>
//           <Image source={require('../assets/placeholder.webp')} style={styles.placeholderImage} />
//           <Text style={styles.placeholderText}>Please select your location to get suggestions</Text>
//         </View>
//       ) : (
//         <>
//           {loading ? (
//             <ActivityIndicator size="large" color="black" />
//           ) : (
//             <>
//               {currentCombination ? (
//                 <>
//                   {currentCombination.tShirt && currentCombination.trouser ? (
//                     <>
//                       <TouchableOpacity
//                         style={[
//                           styles.suggestionItem,
//                           selectedItem && selectedItem.image === currentCombination.tShirt && styles.selectedItem
//                         ]}
//                         onPress={() => handleItemPress(currentCombination.tShirt, 't-shirt')}
//                       >
//                         <Image source={{ uri: currentCombination.tShirt }} style={styles.suggestionImage} />
//                       </TouchableOpacity>
//                       <TouchableOpacity
//                         style={[
//                           styles.suggestionItem,
//                           selectedItem && selectedItem.image === currentCombination.trouser && styles.selectedItem
//                         ]}
//                         onPress={() => handleItemPress(currentCombination.trouser, 'trousers')}
//                       >
//                         <Image source={{ uri: currentCombination.trouser }} style={styles.suggestionImage} />
//                       </TouchableOpacity>
//                     </>
//                   ) : (
//                     <TouchableOpacity
//                       style={[
//                         styles.suggestionItem,
//                         selectedItem && selectedItem.image === currentCombination.dress && styles.selectedItem
//                       ]}
//                       onPress={() => handleItemPress(currentCombination.dress, 'dress')}
//                     >
//                       <Image source={{ uri: currentCombination.dress }} style={styles.suggestionImage} />
//                     </TouchableOpacity>
//                   )}
//                 </>
//               ) : (
//                 <Text style={styles.text}>No suggestions available</Text>
//               )}
//             </>
//           )}
//           <View style={styles.buttonContainer}>
//             {refreshing ? (
//               <ActivityIndicator size="small" color="black" />
//             ) : (
//               !noMoreSuggestions && (
//                 <Button title="Refresh Suggestions" onPress={handleRefreshPress} color="black" />
//               )
//             )}
//             {noMoreSuggestions && (
//               <Button title="Repeat Suggestions" onPress={handleRepeatPress} color="black" />
//             )}
//           </View>
//         </>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   locationIcon: {
//     marginRight: 10,
//   },
//   weatherInfo: {
//     flex: 1,
//     alignItems: 'flex-start',
//   },
//   text: {
//     fontSize: 18,
//   },
//   buttonContainer: {
//     marginTop: 20,
//     alignItems: 'center',
//   },
//   suggestionItem: {
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//   },
//   suggestionImage: {
//     width: '100%',
//     height: 200,
//     resizeMode: 'cover',
//   },
//   placeholderContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   placeholderImage: {
//     width: 200,
//     height: 200,
//     marginBottom: 20,
//   },
//   placeholderText: {
//     fontSize: 18,
//     textAlign: 'center',
//   },
//   selectedItem: {
//     borderColor: 'black',
//     borderWidth: 2,
//   },
// });

// export default Suggestions;



















// import React, { useState, useEffect, useLayoutEffect } from 'react';
// import { View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Button } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { doc, getDoc } from 'firebase/firestore';
// import { db } from '../firebase';
// import { useRoute, useNavigation } from '@react-navigation/native';

// const Suggestions = () => {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const { weather, userId } = route.params || {};
//   const [governorate, setGovernorate] = useState('');
//   const [combinations, setCombinations] = useState([]);
//   const [displayedCombinations, setDisplayedCombinations] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [noMoreSuggestions, setNoMoreSuggestions] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [refreshing, setRefreshing] = useState(false);

//   const getSeason = (temp) => {
//     if (temp >= 25) return 'summer';
//     if (temp >= 15 && temp < 25) return 'spring';
//     if (temp >= 5 && temp < 15) return 'fall';
//     return 'winter';
//   };

//   const fetchSuggestions = async () => {
//     try {
//       setLoading(true);
//       const season = getSeason(weather.temp);

//       const userRef = doc(db, 'users', userId);
//       const userSnap = await getDoc(userRef);

//       if (userSnap.exists()) {
//         const userData = userSnap.data();
//         const seasonOrders = userData.HistoryOrder.filter(order => order.season === season);
//         const seasonClothes = userData.clothes.filter(clothes => clothes.season === season);

//         const combinedItems = [...seasonOrders, ...seasonClothes];
//         const tShirts = combinedItems.filter(item => item.type === 't-shirt');
//         const trousers = combinedItems.filter(item => item.type === 'trousers');
//         const dresses = combinedItems.filter(item => item.type === 'dress');

//         const allCombinations = [
//           ...tShirts.flatMap(tShirt =>
//             trousers.map(trouser => ({ tShirt: tShirt.image || tShirt.imageUrl, trouser: trouser.image || trouser.imageUrl }))
//           ),
//           ...dresses.map(dress => ({ dress: dress.image || dress.imageUrl })),
//         ];

//         setCombinations(allCombinations);
//         setDisplayedCombinations([]);
//         setNoMoreSuggestions(false);
//       } else {
//         console.error('No such user document!');
//       }
//     } catch (error) {
//       console.error('Error fetching suggestions:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getNextCombination = () => {
//     const remainingCombinations = combinations.filter(
//       combo => !displayedCombinations.some(displayedCombo =>
//         (combo.tShirt && combo.trouser && displayedCombo.tShirt === combo.tShirt && displayedCombo.trouser === combo.trouser) ||
//         (combo.dress && displayedCombo.dress === combo.dress)
//       )
//     );

//     if (remainingCombinations.length === 0) {
//       setNoMoreSuggestions(true);
//       return null;
//     }

//     const randomIndex = Math.floor(Math.random() * remainingCombinations.length);
//     const nextCombination = remainingCombinations[randomIndex];

//     setDisplayedCombinations([...displayedCombinations, nextCombination]);
//     return nextCombination;
//   };

//   useEffect(() => {
//     if (weather) {
//       fetchSuggestions();
//       setGovernorate(weather.location);
//     }
//   }, [weather]);

//   useLayoutEffect(() => {
//     navigation.setOptions({
//       headerRight: () => (
//         <TouchableOpacity onPress={() => navigation.navigate('addclothes', { userId })}>
//           <Ionicons name="add-circle-outline" size={30} color="black" />
//         </TouchableOpacity>
//       ),
//     });
//   }, [navigation, userId]);

//   const handleLocationPress = () => {
//     navigation.navigate('weathersearch', { userId });
//   };

//   // const handleRefreshPress = async () => {
//   //   setRefreshing(true);
//   //   let nextCombination;
//   //   if (selectedItem) {
//   //     const filteredCombinations = combinations.filter(
//   //       combo =>
//   //         (selectedItem.type === 't-shirt' && selectedItem.image === combo.tShirt) ||
//   //         (selectedItem.type === 'trousers' && selectedItem.image === combo.trouser) ||
//   //         (selectedItem.type === 'dress' && selectedItem.image === combo.dress)
//   //     );

//   //     nextCombination = filteredCombinations.find(
//   //       combo => !displayedCombinations.some(displayedCombo =>
//   //         (combo.tShirt && combo.trouser && displayedCombo.tShirt === combo.tShirt && displayedCombo.trouser === combo.trouser) ||
//   //         (combo.dress && displayedCombo.dress === combo.dress)
//   //       )
//   //     );
//   //   } else {
//   //     nextCombination = getNextCombination();
//   //   }

//   //   if (nextCombination) {
//   //     setDisplayedCombinations([...displayedCombinations, nextCombination]);
//   //   }
//   //   setRefreshing(false);
//   // };
//   const handleRefreshPress = async () => {
//     setRefreshing(true); // Set refreshing to true to show the loading indicator
  
//     try {
//       let nextCombination;
//       if (selectedItem) {
//         const filteredCombinations = combinations.filter(
//           combo =>
//             (selectedItem.type === 't-shirt' && selectedItem.image === combo.tShirt) ||
//             (selectedItem.type === 'trousers' && selectedItem.image === combo.trouser) ||
//             (selectedItem.type === 'dress' && selectedItem.image === combo.dress)
//         );
  
//         nextCombination = filteredCombinations.find(
//           combo => !displayedCombinations.some(displayedCombo =>
//             (combo.tShirt && combo.trouser && displayedCombo.tShirt === combo.tShirt && displayedCombo.trouser === combo.trouser) ||
//             (combo.dress && displayedCombo.dress === combo.dress)
//           )
//         );
//       } else {
//         nextCombination = getNextCombination();
//       }
  
//       if (nextCombination) {
//         setDisplayedCombinations([...displayedCombinations, nextCombination]);
//       }
//     } catch (error) {
//       console.error('Error fetching suggestions:', error);
//     } finally {
//       setRefreshing(false); // Set refreshing to false after fetching is complete
//     }
//   };
  
//   const handleRepeatPress = () => {
//     setDisplayedCombinations([]);
//     setNoMoreSuggestions(false);
//     const nextCombination = getNextCombination();
//     if (nextCombination) {
//       setSelectedItem(null);
//     }
//   };

//   const handleItemPress = (item, type) => {
//     if (selectedItem && selectedItem.image === item) {
//       setSelectedItem(null);
//     } else {
//       setSelectedItem({ image: item, type });
//     }
//   };

//   const currentCombination = displayedCombinations[displayedCombinations.length - 1];

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <View style={styles.weatherInfo}>
//           {weather ? (
//             <>
//               <Text style={styles.text}>{weather.temp} °C</Text>
//               <Text style={styles.text}>{weather.description}</Text>
//             </>
//           ) : (
//             <Text style={styles.text}></Text>
//           )}
//         </View>
//         <TouchableOpacity onPress={handleLocationPress} style={styles.locationIcon}>
//           {governorate ? (
//             <Text style={styles.text}>{governorate}</Text>
//           ) : (
//             <Ionicons name="location-sharp" size={30} color="black" />
//           )}
//         </TouchableOpacity>
//       </View>

//       {!weather ? (
//         <View style={styles.placeholderContainer}>
//           <Image source={require('../assets/placeholder.webp')} style={styles.placeholderImage} />
//           <Text style={styles.placeholderText}>Please select your location to get suggestions</Text>
//         </View>
//       ) : (
//         <>
//           {loading ? (
//             <ActivityIndicator size="large" color="black" />
//           ) : (
//             <>
//               {currentCombination ? (
//                 <>
//                   {currentCombination.tShirt && currentCombination.trouser ? (
//                     <>
//                       <TouchableOpacity
//                         style={[
//                           styles.suggestionItem,
//                           selectedItem && selectedItem.image === currentCombination.tShirt && styles.selectedItem
//                         ]}
//                         onPress={() => handleItemPress(currentCombination.tShirt, 't-shirt')}
//                       >
//                         <Image source={{ uri: currentCombination.tShirt }} style={styles.suggestionImage} />
//                       </TouchableOpacity>
//                       <TouchableOpacity
//                         style={[
//                           styles.suggestionItem,
//                           selectedItem && selectedItem.image === currentCombination.trouser && styles.selectedItem
//                         ]}
//                         onPress={() => handleItemPress(currentCombination.trouser, 'trousers')}
//                       >
//                         <Image source={{ uri: currentCombination.trouser }} style={styles.suggestionImage} />
//                       </TouchableOpacity>
//                     </>
//                   ) : (
//                     <TouchableOpacity
//                       style={[
//                         styles.suggestionItem,
//                         selectedItem && selectedItem.image === currentCombination.dress && styles.selectedItem
//                       ]}
//                       onPress={() => handleItemPress(currentCombination.dress, 'dress')}
//                     >
//                       <Image source={{ uri: currentCombination.dress }} style={styles.suggestionImage} />
//                     </TouchableOpacity>
//                   )}
//                 </>
//               ) : (
//                 <Text style={styles.text}>No suggestions available</Text>
//               )}
//             </>
//           )}
//           <View style={styles.buttonContainer}>
//           {refreshing ? (
//   <ActivityIndicator size="small" color="black" />
// ) : (
//   !noMoreSuggestions && (
//     <Button title="Refresh Suggestions" onPress={handleRefreshPress} color="black" />
//   )
// )}

//             {noMoreSuggestions && (
//               <Button title="Repeat Suggestions" onPress={handleRepeatPress} color="black" />
//             )}
//           </View>
//         </>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   locationIcon: {
//     marginRight: 10,
//   },
//   weatherInfo: {
//     flex: 1,
//     alignItems: 'flex-start',
//   },
//   text: {
//     fontSize: 18,
//   },
//   buttonContainer: {
//     marginTop: 20,
//     alignItems: 'center',
//   },
//   suggestionItem: {
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//   },
//   suggestionImage: {
//     width: '100%',
//     height: 200,
//     resizeMode: 'cover',
//   },
//   placeholderContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   placeholderImage: {
//     width: 200,
//     height: 200,
//     marginBottom: 20,
//   },
//   placeholderText: {
//     fontSize: 18,
//     textAlign: 'center',
//   },
//   selectedItem: {
//     borderColor: 'black',
//     borderWidth: 2,
//   },
// });

// export default Suggestions;



// import React, { useState, useEffect, useLayoutEffect } from 'react';
// import { View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Button } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { doc, getDoc } from 'firebase/firestore';
// import { db } from '../firebase';
// import { useRoute, useNavigation } from '@react-navigation/native';

// const Suggestions = () => {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const { weather, userId } = route.params || {};
//   const [governorate, setGovernorate] = useState('');
//   const [combinations, setCombinations] = useState([]);
//   const [displayedCombinations, setDisplayedCombinations] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [noMoreSuggestions, setNoMoreSuggestions] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [refreshing, setRefreshing] = useState(false);

//   const getSeason = (temp) => {
//     if (temp >= 25) return 'summer';
//     if (temp >= 15 && temp < 25) return 'spring';
//     if (temp >= 5 && temp < 15) return 'fall';
//     return 'winter';
//   };

//   const fetchSuggestions = async () => {
//     try {
//       setLoading(true);
//       const season = getSeason(weather.temp);

//       const userRef = doc(db, 'users', userId);
//       const userSnap = await getDoc(userRef);

//       if (userSnap.exists()) {
//         const userData = userSnap.data();
//         const seasonOrders = userData.HistoryOrder.filter(order => order.season === season);
//         const seasonClothes = userData.clothes.filter(clothes => clothes.season === season);

//         const combinedItems = [...seasonOrders, ...seasonClothes];
//         const tShirts = combinedItems.filter(item => item.type === 't-shirt');
//         const trousers = combinedItems.filter(item => item.type === 'trousers');

//         const allCombinations = tShirts.flatMap(tShirt =>
//           trousers.map(trouser => ({ tShirt: tShirt.image || tShirt.imageUrl, trouser: trouser.image || trouser.imageUrl }))
//         );

//         setCombinations(allCombinations);
//         setDisplayedCombinations([]);
//         setNoMoreSuggestions(false);
//       } else {
//         console.error('No such user document!');
//       }
//     } catch (error) {
//       console.error('Error fetching suggestions:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getNextCombination = () => {
//     const remainingCombinations = combinations.filter(
//       combo => !displayedCombinations.some(displayedCombo =>
//         displayedCombo.tShirt === combo.tShirt && displayedCombo.trouser === combo.trouser
//       )
//     );

//     if (remainingCombinations.length === 0) {
//       setNoMoreSuggestions(true);
//       return null;
//     }

//     const randomIndex = Math.floor(Math.random() * remainingCombinations.length);
//     const nextCombination = remainingCombinations[randomIndex];

//     setDisplayedCombinations([...displayedCombinations, nextCombination]);
//     return nextCombination;
//   };

//   useEffect(() => {
//     if (weather) {
//       fetchSuggestions();
//       setGovernorate(weather.location);
//     }
//   }, [weather]);

//   useLayoutEffect(() => {
//     navigation.setOptions({
//       headerRight: () => (
//         <TouchableOpacity onPress={() => navigation.navigate('addclothes', { userId })}>
//           <Ionicons name="add-circle-outline" size={30} color="black" />
//         </TouchableOpacity>
//       ),
//     });
//   }, [navigation, userId]);

//   const handleLocationPress = () => {
//     navigation.navigate('weathersearch', { userId });
//   };

//   const handleRefreshPress = () => {
//     setRefreshing(true);
//     let nextCombination;
//     if (selectedItem) {
//       const filteredCombinations = combinations.filter(
//         combo =>
//           (selectedItem.type === 't-shirt' && selectedItem.image === combo.tShirt) ||
//           (selectedItem.type === 'trousers' && selectedItem.image === combo.trouser)
//       );

//       nextCombination = filteredCombinations.find(
//         combo => !displayedCombinations.some(displayedCombo =>
//           displayedCombo.tShirt === combo.tShirt && displayedCombo.trouser === combo.trouser
//         )
//       );
//     } else {
//       nextCombination = getNextCombination();
//     }

//     if (nextCombination) {
//       setDisplayedCombinations([...displayedCombinations, nextCombination]);
//     }
//     setRefreshing(false);
//   };

//   const handleRepeatPress = () => {
//     setDisplayedCombinations([]);
//     setNoMoreSuggestions(false);
//     const nextCombination = getNextCombination();
//     if (nextCombination) {
//       setSelectedItem(null);
//     }
//   };

//   const handleItemPress = (item, type) => {
//     if (selectedItem && selectedItem.image === item) {
//       setSelectedItem(null);
//     } else {
//       setSelectedItem({ image: item, type });
//     }
//   };

//   const currentCombination = displayedCombinations[displayedCombinations.length - 1];

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <View style={styles.weatherInfo}>
//           {weather ? (
//             <>
//               <Text style={styles.text}>{weather.temp} °C</Text>
//               <Text style={styles.text}>{weather.description}</Text>
//             </>
//           ) : (
//             <Text style={styles.text}></Text>
//           )}
//         </View>
//         <TouchableOpacity onPress={handleLocationPress} style={styles.locationIcon}>
//           {governorate ? (
//             <Text style={styles.text}>{governorate}</Text>
//           ) : (
//             <Ionicons name="location-sharp" size={30} color="black" />
//           )}
//         </TouchableOpacity>
//       </View>

//       {!weather ? (
//         <View style={styles.placeholderContainer}>
//           <Image source={require('../assets/placeholder.webp')} style={styles.placeholderImage} />
//           <Text style={styles.placeholderText}>Please select your location to get suggestions</Text>
//         </View>
//       ) : (
//         <>
//           {loading ? (
//             <ActivityIndicator size="large" color="black" />
//           ) : (
//             <>
//               {currentCombination ? (
//                 <>
//                   <TouchableOpacity
//                     style={[
//                       styles.suggestionItem,
//                       selectedItem && selectedItem.image === currentCombination.tShirt && styles.selectedItem
//                     ]}
//                     onPress={() => handleItemPress(currentCombination.tShirt, 't-shirt')}
//                   >
//                     <Image source={{ uri: currentCombination.tShirt }} style={styles.suggestionImage} />
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     style={[
//                       styles.suggestionItem,
//                       selectedItem && selectedItem.image === currentCombination.trouser && styles.selectedItem
//                     ]}
//                     onPress={() => handleItemPress(currentCombination.trouser, 'trousers')}
//                   >
//                     <Image source={{ uri: currentCombination.trouser }} style={styles.suggestionImage} />
//                   </TouchableOpacity>
//                 </>
//               ) : (
//                 <Text style={styles.text}>No suggestions available</Text>
//               )}
//             </>
//           )}
//           <View style={styles.buttonContainer}>
//             {refreshing ? (
//               <ActivityIndicator size="small" color="black" />
//             ) : (
//               !noMoreSuggestions && (
//                 <Button title="Refresh Suggestions" onPress={handleRefreshPress} color="black" />
//               )
//             )}
//             {noMoreSuggestions && (
//               <Button title="Repeat Suggestions" onPress={handleRepeatPress} color="black" />
//             )}
//           </View>
//         </>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   locationIcon: {
//     marginRight: 10,
//   },
//   weatherInfo: {
//     flex: 1,
//     alignItems: 'flex-start',
//   },
//   text: {
//     fontSize: 18,
//   },
//   buttonContainer: {
//     marginTop: 20,
//     alignItems: 'center',
//   },
//   suggestionItem: {
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//   },
//   suggestionImage: {
//     width: '100%',
//     height: 200,
//     resizeMode: 'cover',
//   },
//   placeholderContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   placeholderImage: {
//     width: 200,
//     height: 200,
//     marginBottom: 20,
//   },
//   placeholderText: {
//     fontSize: 18,
//     textAlign: 'center',
//   },
//   selectedItem: {
//     borderColor: 'black',
//     borderWidth: 2

//   },
//   text: {
//       fontSize: 18,
//   },
//   buttonContainer: {
//       marginTop: 20,
//       alignItems: 'center',
//   },
//   suggestionItem: {
//       padding: 10,
//       borderBottomWidth: 1,
//       borderBottomColor: '#ccc',
//   },
//   suggestionImage: {
//       width: '100%',
//       height: 200,
//       resizeMode: 'cover',
//   },
//   placeholderContainer: {
//       flex: 1,
//       justifyContent: 'center',
//       alignItems: 'center',
//   },
//   placeholderImage: {
//       width: 200,
//       height: 200,
//       marginBottom: 20,
//   },
//   placeholderText: {
//       fontSize: 18,
//       textAlign: 'center',
//   },
//   selectedItem: {
//       borderColor: 'black',
//       borderWidth: 2,
//   },
// });

// export default Suggestions;
























// import React, { useState, useEffect, useLayoutEffect } from 'react';
// import { View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Button } from 'react-native';





























// import { Ionicons } from '@expo/vector-icons';
// import { doc, getDoc } from 'firebase/firestore';
// import { db } from '../firebase';
// import { useRoute, useNavigation } from '@react-navigation/native';

// const Suggestions = () => {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const { weather, userId } = route.params || {};
//   const [governorate, setGovernorate] = useState('');
//   const [combinations, setCombinations] = useState([]);
//   const [displayedCombinations, setDisplayedCombinations] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [noMoreSuggestions, setNoMoreSuggestions] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);

//   const getSeason = (temp) => {
//     if (temp >= 25) return 'summer';
//     if (temp >= 15 && temp < 25) return 'spring';
//     if (temp >= 5 && temp < 15) return 'fall';
//     return 'winter';
//   };

//   const fetchSuggestions = async () => {
//     try {
//       setLoading(true);
//       const season = getSeason(weather.temp);

//       const userRef = doc(db, 'users', userId);
//       const userSnap = await getDoc(userRef);

//       if (userSnap.exists()) {
//         const userData = userSnap.data();
//         const seasonOrders = userData.HistoryOrder.filter(order => order.season === season);
//         const seasonClothes = userData.clothes.filter(clothes => clothes.season === season);

//         const combinedItems = [...seasonOrders, ...seasonClothes];
//         const tShirts = combinedItems.filter(item => item.type === 't-shirt');
//         const trousers = combinedItems.filter(item => item.type === 'trousers');

//         const allCombinations = tShirts.flatMap(tShirt =>
//           trousers.map(trouser => ({ tShirt: tShirt.image || tShirt.imageUrl, trouser: trouser.image || trouser.imageUrl }))
//         );

//         setCombinations(allCombinations);
//         setDisplayedCombinations([]);
//         setNoMoreSuggestions(false);
//       } else {
//         console.error('No such user document!');
//       }
//     } catch (error) {
//       console.error('Error fetching suggestions:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getNextCombination = () => {
//     const remainingCombinations = combinations.filter(
//       combo => !displayedCombinations.some(displayedCombo =>
//         displayedCombo.tShirt === combo.tShirt && displayedCombo.trouser === combo.trouser
//       )
//     );

//     if (remainingCombinations.length === 0) {
//       setNoMoreSuggestions(true);
//       return;
//     }

//     const randomIndex = Math.floor(Math.random() * remainingCombinations.length);
//     const nextCombination = remainingCombinations[randomIndex];

//     setDisplayedCombinations([...displayedCombinations, nextCombination]);
//     return nextCombination;
//   };

//   useEffect(() => {
//     if (weather) {
//       fetchSuggestions();
//       setGovernorate(weather.location);
//     }
//   }, [weather]);

//   useLayoutEffect(() => {
//     navigation.setOptions({
//       headerRight: () => (
//         <TouchableOpacity onPress={() => navigation.navigate('addclothes', { userId })}>
//           <Ionicons name="add-circle-outline" size={30} color="black" />
//         </TouchableOpacity>
//       ),
//     });
//   }, [navigation, userId]);

//   const handleLocationPress = () => {
//     navigation.navigate('weathersearch', { userId });
//   };

//   const handleRefreshPress = () => {
//     const nextCombination = getNextCombination();
//     if (nextCombination) {
//       setSelectedItem(null);
//     }
//   };

//   const handleRepeatPress = () => {
//     setDisplayedCombinations([]);
//     setNoMoreSuggestions(false);
//     const nextCombination = getNextCombination();
//     if (nextCombination) {
//       setSelectedItem(null);
//     }
//   };

//   const handleItemPress = (item, type) => {
//     if (selectedItem && selectedItem.image === item) {
//       setSelectedItem(null);
//     } else {
//       setSelectedItem({ image: item, type });
//     }
//   };

//   const currentCombination = displayedCombinations[displayedCombinations.length - 1];

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <View style={styles.weatherInfo}>
//           {weather ? (
//             <>
//               <Text style={styles.text}>{weather.temp} °C</Text>
//               <Text style={styles.text}>{weather.description}</Text>
//             </>
//           ) : (
//             <Text style={styles.text}></Text>
//           )}
//         </View>
//         <TouchableOpacity onPress={handleLocationPress} style={styles.locationIcon}>
//           {governorate ? (
//             <Text style={styles.text}>{governorate}</Text>
//           ) : (
//             <Ionicons name="location-sharp" size={30} color="black" />
//           )}
//         </TouchableOpacity>
//       </View>

//       {!weather ? (
//         <View style={styles.placeholderContainer}>
//           <Image source={require('../assets/placeholder.webp')} style={styles.placeholderImage} />
//           <Text style={styles.placeholderText}>Please select your location to get suggestions</Text>
//         </View>
//       ) : (
//         <>
//           {loading ? (
//             <ActivityIndicator size="large" color="black" />
//           ) : (
//             <>
//               {currentCombination ? (
//                 <>
//                   <TouchableOpacity
//                     style={[
//                       styles.suggestionItem,
//                       selectedItem && selectedItem.image === currentCombination.tShirt && styles.selectedItem
//                     ]}
//                     onPress={() => handleItemPress(currentCombination.tShirt, 't-shirt')}
//                   >
//                     <Image source={{ uri: currentCombination.tShirt }} style={styles.suggestionImage} />
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     style={[
//                       styles.suggestionItem,
//                       selectedItem && selectedItem.image === currentCombination.trouser && styles.selectedItem
//                     ]}
//                     onPress={() => handleItemPress(currentCombination.trouser, 'trousers')}
//                   >
//                     <Image source={{ uri: currentCombination.trouser }} style={styles.suggestionImage} />
//                   </TouchableOpacity>
//                 </>
//               ) : (
//                 <Text style={styles.text}>No suggestions available</Text>
//               )}
//             </>
//           )}
//           <View style={styles.buttonContainer}>
//             {!noMoreSuggestions && (
//               <Button title="Refresh Suggestions" onPress={handleRefreshPress} color="black" />
//             )}
//             {noMoreSuggestions && (
//               <Button title="Repeat Suggestions" onPress={handleRepeatPress} color="black" />
//             )}
//           </View>
//         </>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   locationIcon: {
//     marginRight: 10,
//   },
//   weatherInfo: {
//     flex: 1,
//     alignItems: 'flex-start',
//   },
//   text: {
//     fontSize: 18,
//   },
//   buttonContainer: {
//     marginTop: 20,
//     alignItems: 'center',
//   },
//   suggestionItem: {
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//   },
//   suggestionImage: {
//     width: '100%',
//     height: 200,
//     resizeMode: 'cover',
//   },
//   placeholderContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   placeholderImage: {
//     width: 200,
//     height: 200,
//     marginBottom: 20,
//   },
//   placeholderText: {
//     fontSize: 18,
//     textAlign: 'center',
//   },
//   selectedItem: {
//     borderColor: 'black',
//     borderWidth: 2,
//   },
// });

// export default Suggestions;








// import React, { useState, useEffect, useLayoutEffect } from 'react';
// import { View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Button } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { doc, getDoc } from 'firebase/firestore';
// import { db } from '../firebase';
// import { useRoute, useNavigation } from '@react-navigation/native';

// const Suggestions = () => {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const { weather, userId } = route.params || {};
//   const [governorate, setGovernorate] = useState('');
//   const [suggestions, setSuggestions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [displayedImages, setDisplayedImages] = useState([]);
//   const [noMoreSuggestions, setNoMoreSuggestions] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);

//   const getSeason = (temp) => {
//     if (temp >= 25) return 'summer';
//     if (temp >= 15 && temp < 25) return 'spring';
//     if (temp >= 5 && temp < 15) return 'fall';
//     return 'winter';
//   };

//   const fetchSuggestions = async (refreshSelectedItem = false) => {
//     try {
//       setLoading(true);
//       const season = getSeason(weather.temp);

//       const userRef = doc(db, 'users', userId);
//       const userSnap = await getDoc(userRef);

//       if (userSnap.exists()) {
//         const userData = userSnap.data();

//         const seasonOrders = userData.HistoryOrder.filter(order => order.season === season);
//         const seasonClothes = userData.clothes.filter(clothes => clothes.season === season);

//         const combinedImages = [...seasonOrders, ...seasonClothes].reduce((acc, item) => {
//           if (!acc[item.type]) acc[item.type] = [];
//           acc[item.type].push(item.image || item.imageUrl);
//           return acc;
//         }, {});

//         const allImages = Object.values(combinedImages).flat();
//         const filteredImages = allImages.filter(image => !displayedImages.includes(image));

//         if (filteredImages.length > 0) {
//           let selectedImage;
//           let pairedImage;

//           if (refreshSelectedItem && selectedItem) {
//             const otherType = selectedItem.type === 't-shirt' ? 'trousers' : 't-shirt';
//             const otherImages = combinedImages[otherType].filter(image => !displayedImages.includes(image));

//             if (otherImages.length > 0) {
//               const randomIndex = Math.floor(Math.random() * otherImages.length);
//               selectedImage = otherImages[randomIndex];
//               pairedImage = selectedItem.image;
//             }
//           } else {
//             const randomIndex = Math.floor(Math.random() * filteredImages.length);
//             selectedImage = filteredImages[randomIndex];

//             if (combinedImages['t-shirt'] && combinedImages['t-shirt'].includes(selectedImage)) {
//               const trousers = combinedImages['trousers'].filter(image => !displayedImages.includes(image));
//               if (trousers.length > 0) {
//                 pairedImage = trousers[Math.floor(Math.random() * trousers.length)];
//               }
//             } else if (combinedImages['trousers'] && combinedImages['trousers'].includes(selectedImage)) {
//               const tShirts = combinedImages['t-shirt'].filter(image => !displayedImages.includes(image));
//               if (tShirts.length > 0) {
//                 pairedImage = tShirts[Math.floor(Math.random() * tShirts.length)];
//               }
//             }
//           }

//           setSuggestions(pairedImage ? [selectedImage, pairedImage] : [selectedImage]);
//           setDisplayedImages([...displayedImages, selectedImage, pairedImage].filter(Boolean));
//           setNoMoreSuggestions(false);
//         } else {
//           setNoMoreSuggestions(true);
//         }
//       } else {
//         console.error('No such user document!');
//       }
//     } catch (error) {
//       console.error('Error fetching suggestions:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (weather) {
//       fetchSuggestions();
//       setGovernorate(weather.location);
//     }
//   }, [weather]);

//   useLayoutEffect(() => {
//     navigation.setOptions({
//       headerRight: () => (
//         <TouchableOpacity onPress={() => navigation.navigate('addclothes', { userId })}>
//           <Ionicons name="add-circle-outline" size={30} color="black" />
//         </TouchableOpacity>
//       ),
//     });
//   }, [navigation, userId]);

//   const handleLocationPress = () => {
//     navigation.navigate('weathersearch', { userId });
//   };

//   const handleRefreshPress = () => {
//     fetchSuggestions(true);
//   };

//   const handleRepeatPress = () => {
//     setDisplayedImages([]);
//     setNoMoreSuggestions(false);
//     fetchSuggestions();
//   };

//   const handleItemPress = (item, type) => {
//     if (selectedItem && selectedItem.image === item) {
//       setSelectedItem(null);
//     } else {
//       setSelectedItem({ image: item, type });
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <View style={styles.weatherInfo}>
//           {weather ? (
//             <>
//               <Text style={styles.text}>{weather.temp} °C</Text>
//               <Text style={styles.text}>{weather.description}</Text>
//             </>
//           ) : (
//             <Text style={styles.text}></Text>
//           )}
//         </View>
//         <TouchableOpacity onPress={handleLocationPress} style={styles.locationIcon}>
//           {governorate ? (
//             <Text style={styles.text}>{governorate}</Text>
//           ) : (
//             <Ionicons name="location-sharp" size={30} color="black" />
//           )}
//         </TouchableOpacity>
//       </View>

//       {!weather ? (
//         <View style={styles.placeholderContainer}>
//           <Image source={require('../assets/placeholder.webp')} style={styles.placeholderImage} />
//           <Text style={styles.placeholderText}>Please select your location to get suggestions</Text>
//         </View>
//       ) : (
//         <>
//           {loading ? (
//             <ActivityIndicator size="large" color="black" />
//           ) : (
//             <>
//               {suggestions.length > 0 ? (
//                 suggestions.map((image, index) => (
//                   <TouchableOpacity 
//                     key={index} 
//                     style={[
//                       styles.suggestionItem, 
//                       selectedItem && selectedItem.image === image && styles.selectedItem
//                     ]} 
//                     onPress={() => handleItemPress(image, index === 0 ? 't-shirt' : 'trousers')}
//                   >
//                     <Image source={{ uri: image }} style={styles.suggestionImage} />
//                   </TouchableOpacity>
//                 ))
//               ) : (
//                 <Text style={styles.text}>No suggestions available</Text>
//               )}
//             </>
//           )}
//           <View style={styles.buttonContainer}>
//             {!noMoreSuggestions && (
//               <Button title="Refresh Suggestions" onPress={handleRefreshPress} color="black" />
//             )}
//             {noMoreSuggestions && (
//               <Button title="Repeat Suggestions" onPress={handleRepeatPress} color="black" />
//             )}
//           </View>
//         </>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   locationIcon: {
//     marginRight: 10,
//   },
//   weatherInfo: {
//     flex: 1,
//     alignItems: 'flex-start',
//   },
//   text: {
//     fontSize: 18,
//   },
//   buttonContainer: {
//     marginTop: 20,
//     alignItems: 'center',
//   },
//   suggestionItem: {
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//   },
//   suggestionImage: {
//     width: '100%',
//     height: 200,
//     resizeMode: 'cover',
//   },
//   placeholderContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   placeholderImage: {
//     width: 200,
//     height: 200,
//     marginBottom: 20,
//   },
//   placeholderText: {
//     fontSize: 18,
//     textAlign: 'center',
//   },
//   selectedItem: {
//     borderColor: 'black',
//     borderWidth: 2,
//   },
// });

// export default Suggestions;







// import React, { useState, useEffect, useLayoutEffect } from 'react';
// import { View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Button } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { doc, getDoc } from 'firebase/firestore';
// import { db } from '../firebase';
// import { useRoute, useNavigation } from '@react-navigation/native';

// const Suggestions = () => {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const { weather, userId } = route.params || {};
//   const [governorate, setGovernorate] = useState('');
//   const [suggestions, setSuggestions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [displayedImages, setDisplayedImages] = useState([]);
//   const [noMoreSuggestions, setNoMoreSuggestions] = useState(false);

//   const getSeason = (temp) => {
//     if (temp >= 25) return 'summer';
//     if (temp >= 15 && temp < 25) return 'spring';
//     if (temp >= 5 && temp < 15) return 'fall';
//     return 'winter';
//   };

//   const fetchSuggestions = async () => {
//     try {
//       setLoading(true);
//       const season = getSeason(weather.temp);

//       const userRef = doc(db, 'users', userId);
//       const userSnap = await getDoc(userRef);

//       if (userSnap.exists()) {
//         const userData = userSnap.data();

//         const seasonOrders = userData.HistoryOrder.filter(order => order.season === season);
//         const seasonClothes = userData.clothes.filter(clothes => clothes.season === season);

//         const combinedImages = [...seasonOrders, ...seasonClothes].reduce((acc, item) => {
//           if (!acc[item.type]) acc[item.type] = [];
//           acc[item.type].push(item.image || item.imageUrl);
//           return acc;
//         }, {});

//         const allImages = Object.values(combinedImages).flat();
//         const filteredImages = allImages.filter(image => !displayedImages.includes(image));

//         if (filteredImages.length > 0) {
//           const randomIndex = Math.floor(Math.random() * filteredImages.length);
//           const selectedImage = filteredImages[randomIndex];

//           let pairedImage = null;
//           if (combinedImages['t-shirt'] && combinedImages['t-shirt'].includes(selectedImage)) {
//             const trousers = combinedImages['trousers'].filter(image => !displayedImages.includes(image));
//             if (trousers.length > 0) {
//               pairedImage = trousers[Math.floor(Math.random() * trousers.length)];
//             }
//           } else if (combinedImages['trousers'] && combinedImages['trousers'].includes(selectedImage)) {
//             const tShirts = combinedImages['t-shirt'].filter(image => !displayedImages.includes(image));
//             if (tShirts.length > 0) {
//               pairedImage = tShirts[Math.floor(Math.random() * tShirts.length)];
//             }
//           }

//           setSuggestions(pairedImage ? [selectedImage, pairedImage] : [selectedImage]);
//           setDisplayedImages([...displayedImages, selectedImage, pairedImage].filter(Boolean));

//           setNoMoreSuggestions(false);
//         } else {
//           setNoMoreSuggestions(true);
//         }
//       } else {
//         console.error('No such user document!');
//       }
//     } catch (error) {
//       console.error('Error fetching suggestions:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (weather) {
//       fetchSuggestions();
//       setGovernorate(weather.location);
//     }
//   }, [weather]);

//   useLayoutEffect(() => {
//     navigation.setOptions({
//       headerRight: () => (
//         <TouchableOpacity onPress={() => navigation.navigate('addclothes', { userId })}>
//           <Ionicons name="add-circle-outline" size={30} color="black" />
//         </TouchableOpacity>
//       ),
//     });
//   }, [navigation, userId]);

//   const handleLocationPress = () => {
//     navigation.navigate('weathersearch', { userId });
//   };

//   const handleRefreshPress = () => {
//     fetchSuggestions();
//   };

//   const handleRepeatPress = () => {
//     setDisplayedImages([]);
//     setNoMoreSuggestions(false);
//     fetchSuggestions();
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <View style={styles.weatherInfo}>
//           {weather ? (
//             <>
//               <Text style={styles.text}>{weather.temp} °C</Text>
//               <Text style={styles.text}>{weather.description}</Text>
//             </>
//           ) : (
//             <Text style={styles.text}></Text>
//           )}
//         </View>
//         <TouchableOpacity onPress={handleLocationPress} style={styles.locationIcon}>
//           {governorate ? (
//             <Text style={styles.text}>{governorate}</Text>
//           ) : (
//             <Ionicons name="location-sharp" size={30} color="black" />
//           )}
//         </TouchableOpacity>
//       </View>

//       {!weather ? (
//         <View style={styles.placeholderContainer}>
//           <Image source={require('../assets/placeholder.webp')} style={styles.placeholderImage} />
//           <Text style={styles.placeholderText}>Please select your location to get suggestions</Text>
//         </View>
//       ) : (
//         <>
//           {loading ? (
//             <ActivityIndicator size="large" color="black" />
//           ) : (
//             <>
//               {suggestions.length > 0 ? (
//                 suggestions.map((image, index) => (
//                   <View key={index} style={styles.suggestionItem}>
//                     <Image source={{ uri: image }} style={styles.suggestionImage} />
//                   </View>
//                 ))
//               ) : (
//                 <Text style={styles.text}>No suggestions available</Text>
//               )}
//             </>
//           )}
//           <View style={styles.buttonContainer}>
//             {!noMoreSuggestions && (
//               <Button title="Refresh Suggestions" onPress={handleRefreshPress} color="black" />
//             )}
//             {noMoreSuggestions && (
//               <Button title="Repeat Suggestions" onPress={handleRepeatPress} color="black" />
//             )}
//           </View>
//         </>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   locationIcon: {
//     marginRight: 10,
//   },
//   weatherInfo: {
//     flex: 1,
//     alignItems: 'flex-start',
//   },
//   text: {
//     fontSize: 18,
//   },
//   buttonContainer: {
//     marginTop: 20,
//     alignItems: 'center',
//   },
//   suggestionItem: {
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//   },
//   suggestionImage: {
//     width: '100%',
//     height: 200,
//     resizeMode: 'cover',
//   },
//   placeholderContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   placeholderImage: {
//     width: 200,
//     height: 200,
//     marginBottom: 20,
//   },
//   placeholderText: {
//     fontSize: 18,
//     textAlign: 'center',
//   },
// });

// export default Suggestions;










// import React, { useState, useEffect, useLayoutEffect } from 'react';
// import { View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Button } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { doc, getDoc } from 'firebase/firestore';
// import { db } from '../firebase';
// import { useRoute, useNavigation } from '@react-navigation/native';

// const Suggestions = () => {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const { weather, userId } = route.params || {};
//   const [governorate, setGovernorate] = useState('');
//   const [suggestions, setSuggestions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [displayedImages, setDisplayedImages] = useState([]);
//   const [noMoreSuggestions, setNoMoreSuggestions] = useState(false);

//   const getSeason = (temp) => {
//     if (temp >= 25) return 'summer';
//     if (temp >= 15 && temp < 25) return 'spring';
//     if (temp >= 5 && temp < 15) return 'fall';
//     return 'winter';
//   };

//   const fetchSuggestions = async () => {
//     try {
//       setLoading(true);
//       const season = getSeason(weather.temp);

//       const userRef = doc(db, 'users', userId);
//       const userSnap = await getDoc(userRef);

//       if (userSnap.exists()) {
//         const userData = userSnap.data();
//         const seasonOrders = userData.HistoryOrder.filter(order => order.season === season);
//         const seasonSuggestions = seasonOrders.reduce((acc, order) => {
//           if (!acc[order.type]) acc[order.type] = [];
//           acc[order.type].push(order.image);
//           return acc;
//         }, {});

//         const allImages = Object.values(seasonSuggestions).flat();
//         const filteredImages = allImages.filter(image => !displayedImages.includes(image));

//         if (filteredImages.length > 0) {
//           const randomIndex = Math.floor(Math.random() * filteredImages.length);
//           const selectedImage = filteredImages[randomIndex];

//           let pairedImage = null;
//           if (seasonSuggestions['t-shirt'] && seasonSuggestions['t-shirt'].includes(selectedImage)) {
//             const trousers = seasonSuggestions['trousers'].filter(image => !displayedImages.includes(image));
//             if (trousers.length > 0) {
//               pairedImage = trousers[Math.floor(Math.random() * trousers.length)];
//             }
//           } else if (seasonSuggestions['trousers'] && seasonSuggestions['trousers'].includes(selectedImage)) {
//             const tShirts = seasonSuggestions['t-shirt'].filter(image => !displayedImages.includes(image));
//             if (tShirts.length > 0) {
//               pairedImage = tShirts[Math.floor(Math.random() * tShirts.length)];
//             }
//           }

//           setSuggestions(pairedImage ? [selectedImage, pairedImage] : [selectedImage]);
//           setDisplayedImages([...displayedImages, selectedImage, pairedImage].filter(Boolean));

//           setNoMoreSuggestions(false);
//         } else {
//           setNoMoreSuggestions(true);
//         }
//       } else {
//         console.error('No such user document!');
//       }
//     } catch (error) {
//       console.error('Error fetching suggestions:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (weather) {
//       fetchSuggestions();
//       setGovernorate(weather.location);
//     }
//   }, [weather]);

//   useLayoutEffect(() => {
//     navigation.setOptions({
//       headerRight: () => (
//         <TouchableOpacity onPress={() => navigation.navigate('addclothes', { userId })}>
//           <Ionicons name="add-circle-outline" size={30} color="black" />
//         </TouchableOpacity>
//       ),
//     });
//   }, [navigation, userId]);

//   const handleLocationPress = () => {
//     navigation.navigate('weathersearch', { userId });
//   };

//   const handleRefreshPress = () => {
//     fetchSuggestions();
//   };

//   const handleRepeatPress = () => {
//     setDisplayedImages([]);
//     setNoMoreSuggestions(false);
//     fetchSuggestions();
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <View style={styles.weatherInfo}>
//           {weather ? (
//             <>
//               <Text style={styles.text}>{weather.temp} °C</Text>
//               <Text style={styles.text}>{weather.description}</Text>
//             </>
//           ) : (
//             <Text style={styles.text}></Text>
//           )}
//         </View>
//         <TouchableOpacity onPress={handleLocationPress} style={styles.locationIcon}>
//           {governorate ? (
//             <Text style={styles.text}>{governorate}</Text>
//           ) : (
//             <Ionicons name="location-sharp" size={30} color="black" />
//           )}
//         </TouchableOpacity>
//       </View>

//       {!weather ? (
//         <View style={styles.placeholderContainer}>
//           <Image source={require('../assets/placeholder.webp')} style={styles.placeholderImage} />
//           <Text style={styles.placeholderText}>Please select your location to get suggestions</Text>
//         </View>
//       ) : (
//         <>
//           {loading ? (
//             <ActivityIndicator size="large" color="black" />
//           ) : (
//             <>
//               {suggestions.length > 0 ? (
//                 suggestions.map((image, index) => (
//                   <View key={index} style={styles.suggestionItem}>
//                     <Image source={{ uri: image }} style={styles.suggestionImage} />
//                   </View>
//                 ))
//               ) : (
//                 <Text style={styles.text}>No suggestions available</Text>
//               )}
//             </>
//           )}
//           <View style={styles.buttonContainer}>
//             {!noMoreSuggestions && (
//               <Button title="Refresh Suggestions" onPress={handleRefreshPress} color="black" />
//             )}
//             {noMoreSuggestions && (
//               <Button title="Repeat Suggestions" onPress={handleRepeatPress} color="black" />
//             )}
//           </View>
//         </>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   locationIcon: {
//     marginRight: 10,
//   },
//   weatherInfo: {
//     flex: 1,
//     alignItems: 'flex-start',
//   },
//   text: {
//     fontSize: 18,
//   },
//   buttonContainer: {
//     marginTop: 20,
//     alignItems: 'center',
//   },
//   suggestionItem: {
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//   },
//   suggestionImage: {
//     width: '100%',
//     height: 200,
//     resizeMode: 'cover',
//   },
//   placeholderContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   placeholderImage: {
//     width: 200,
//     height: 200,
//     marginBottom: 20,
//   },
//   placeholderText: {
//     fontSize: 18,
//     textAlign: 'center',
//   },
// });

// export default Suggestions;










































































































//////////////////////////////////////////////////////////////////////////////////////
// import React, { useState, useEffect } from 'react';
// import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Button } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { doc, getDoc } from 'firebase/firestore';
// import { db } from '../firebase';
// import { useRoute, useNavigation } from '@react-navigation/native';

// const Suggestions = () => {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const { weather, userId } = route.params || {};
//   const [governorate, setGovernorate] = useState('');
//   const [suggestions, setSuggestions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [displayedImages, setDisplayedImages] = useState([]);
//   const [noMoreSuggestions, setNoMoreSuggestions] = useState(false);

//   const getSeason = (temp) => {
//     if (temp >= 25) return 'summer';
//     if (temp >= 15 && temp < 25) return 'spring';
//     if (temp >= 5 && temp < 15) return 'fall';
//     return 'winter';
//   };

//   const fetchSuggestions = async () => {
//     try {
//       setLoading(true);
//       const season = getSeason(weather.temp);

//       const userRef = doc(db, 'users', userId);
//       const userSnap = await getDoc(userRef);

//       if (userSnap.exists()) {
//         const userData = userSnap.data();
//         const seasonOrders = userData.HistoryOrder.filter(order => order.season === season);
//         const seasonSuggestions = seasonOrders.reduce((acc, order) => {
//           if (!acc[order.type]) acc[order.type] = [];
//           acc[order.type].push(order.image);
//           return acc;
//         }, {});

//         const allImages = Object.values(seasonSuggestions).flat();
//         const filteredImages = allImages.filter(image => !displayedImages.includes(image));

//         if (filteredImages.length > 0) {
//           const randomIndex = Math.floor(Math.random() * filteredImages.length);
//           const selectedImage = filteredImages[randomIndex];

//           let pairedImage = null;
//           if (seasonSuggestions['t-shirt'] && seasonSuggestions['t-shirt'].includes(selectedImage)) {
//             const trousers = seasonSuggestions['trousers'].filter(image => !displayedImages.includes(image));
//             if (trousers.length > 0) {
//               pairedImage = trousers[Math.floor(Math.random() * trousers.length)];
//             }
//           } else if (seasonSuggestions['trousers'] && seasonSuggestions['trousers'].includes(selectedImage)) {
//             const tShirts = seasonSuggestions['t-shirt'].filter(image => !displayedImages.includes(image));
//             if (tShirts.length > 0) {
//               pairedImage = tShirts[Math.floor(Math.random() * tShirts.length)];
//             }
//           }

//           setSuggestions(pairedImage ? [selectedImage, pairedImage] : [selectedImage]);
//           setDisplayedImages([...displayedImages, selectedImage, pairedImage].filter(Boolean));

//           setNoMoreSuggestions(false);
//         } else {
//           setNoMoreSuggestions(true);
//         }
//       } else {
//         console.error('No such user document!');
//       }
//     } catch (error) {
//       console.error('Error fetching suggestions:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (weather) {
//       fetchSuggestions();
//       setGovernorate(weather.location);
//     }
//   }, [weather]);

//   const handleLocationPress = () => {
//     navigation.navigate('weathersearch', { userId });
//   };

//   const handleRefreshPress = () => {
//     fetchSuggestions();
//   };

//   const handleRepeatPress = () => {
//     setDisplayedImages([]);
//     setNoMoreSuggestions(false);
//     fetchSuggestions();
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <View style={styles.weatherInfo}>
//           {weather ? (
//             <>
//               <Text style={styles.text}>{weather.temp} °C</Text>
//               <Text style={styles.text}>{weather.description}</Text>
//             </>
//           ) : (
//             <Text style={styles.text}></Text>
//           )}
//         </View>
//         <TouchableOpacity onPress={handleLocationPress} style={styles.locationIcon}>
//           {governorate ? (
//             <Text style={styles.text}>{governorate}</Text>
//           ) : (
//             <Ionicons name="location-sharp" size={30} color="black" />
//           )}
//         </TouchableOpacity>
//       </View>

//       {!weather ? (
//         <View style={styles.placeholderContainer}>
//           <Image source={require('../assets/placeholder.webp')} style={styles.placeholderImage} />
//           <Text style={styles.placeholderText}>Please select your location to get suggestions</Text>
//         </View>
//       ) : (
//         <>
//           {loading ? (
//             <ActivityIndicator size="large" color="black" />
//           ) : (
//             <>
//               {suggestions.length > 0 ? (
//                 suggestions.map((image, index) => (
//                   <View key={index} style={styles.suggestionItem}>
//                     <Image source={{ uri: image }} style={styles.suggestionImage} />
//                   </View>
//                 ))
//               ) : (
//                 <Text style={styles.text}>No suggestions available</Text>
//               )}
//             </>
//           )}
//           <View style={styles.buttonContainer}>
//             {!noMoreSuggestions && (
//               <Button title="Refresh Suggestions" onPress={handleRefreshPress} color="black" />
//             )}
//             {noMoreSuggestions && (
//               <Button title="Repeat Suggestions" onPress={handleRepeatPress} color="black" />
//             )}
//           </View>
//         </>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   locationIcon: {
//     marginRight: 10,
//   },
//   weatherInfo: {
//     flex: 1,
//     alignItems: 'flex-start',
//   },
//   text: {
//     fontSize: 18,
//   },
//   buttonContainer: {
//     marginTop: 20,
//     alignItems: 'center',
//   },
//   suggestionItem: {
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//   },
//   suggestionImage: {
//     width: '100%',
//     height: 200,
//     resizeMode: 'cover',
//   },
//   placeholderContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   placeholderImage: {
//     width: 200,
//     height: 200,
//     marginBottom: 20,
//   },
//   placeholderText: {
//     fontSize: 18,
//     textAlign: 'center',
//   },
// });

// export default Suggestions;





// import React, { useState, useEffect } from 'react';
// import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Button } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { doc, getDoc } from 'firebase/firestore';
// import { db } from '../firebase';
// import { useRoute, useNavigation } from '@react-navigation/native';

// const Suggestions = () => {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const { weather, userId } = route.params || {};
//   const [governorate, setGovernorate] = useState('');
//   const [suggestions, setSuggestions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [displayedImages, setDisplayedImages] = useState([]);
//   const [noMoreSuggestions, setNoMoreSuggestions] = useState(false);

//   const getSeason = (temp) => {
//     if (temp >= 25) return 'summer';
//     if (temp >= 15 && temp < 25) return 'spring';
//     if (temp >= 5 && temp < 15) return 'fall';
//     return 'winter';
//   };

//   const fetchSuggestions = async () => {
//     try {
//       setLoading(true);
//       const season = getSeason(weather.temp);

//       const userRef = doc(db, 'users', userId);
//       const userSnap = await getDoc(userRef);

//       if (userSnap.exists()) {
//         const userData = userSnap.data();
//         const seasonOrders = userData.HistoryOrder.filter(order => order.season === season);
//         const seasonSuggestions = seasonOrders.reduce((acc, order) => {
//           if (!acc[order.type]) acc[order.type] = [];
//           acc[order.type].push(order.image);
//           return acc;
//         }, {});

//         const allImages = Object.values(seasonSuggestions).flat();
//         const filteredImages = allImages.filter(image => !displayedImages.includes(image));

//         if (filteredImages.length > 0) {
//           const randomIndex = Math.floor(Math.random() * filteredImages.length);
//           const selectedImage = filteredImages[randomIndex];

//           let pairedImages = [];

//           if (seasonSuggestions['t-shirt'] && seasonSuggestions['t-shirt'].includes(selectedImage)) {
//             pairedImages = seasonSuggestions['trousers'].filter(image => !displayedImages.includes(image));
//           } else if (seasonSuggestions['trousers'] && seasonSuggestions['trousers'].includes(selectedImage)) {
//             pairedImages = seasonSuggestions['t-shirt'].filter(image => !displayedImages.includes(image));
//           }

//           if (pairedImages.length > 0) {
//             const newSuggestions = pairedImages.map(pair => [selectedImage, pair]);
//             setSuggestions(newSuggestions);
//             setDisplayedImages([...displayedImages, selectedImage, ...pairedImages]);
//           } else {
//             setSuggestions([[selectedImage]]);
//             setDisplayedImages([...displayedImages, selectedImage]);
//           }

//           setNoMoreSuggestions(false);
//         } else {
//           setNoMoreSuggestions(true);
//         }
//       } else {
//         console.error('No such user document!');
//       }
//     } catch (error) {
//       console.error('Error fetching suggestions:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (weather) {
//       fetchSuggestions();
//       setGovernorate(weather.location);
//     }
//   }, [weather]);

//   const handleLocationPress = () => {
//     navigation.navigate('weathersearch', { userId });
//   };

//   const handleRefreshPress = () => {
//     fetchSuggestions();
//   };

//   const handleRepeatPress = () => {
//     setDisplayedImages([]);
//     setNoMoreSuggestions(false);
//     fetchSuggestions();
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <View style={styles.weatherInfo}>
//           {weather ? (
//             <>
//               <Text style={styles.text}>{weather.temp} °C</Text>
//               <Text style={styles.text}>{weather.description}</Text>
//             </>
//           ) : (
//             <Text style={styles.text}></Text>
//           )}
//         </View>
//         <TouchableOpacity onPress={handleLocationPress} style={styles.locationIcon}>
//           {governorate ? (
//             <Text style={styles.text}>{governorate}</Text>
//           ) : (
//             <Ionicons name="location-sharp" size={30} color="black" />
//           )}
//         </TouchableOpacity>
//       </View>

//       {!weather ? (
//         <View style={styles.placeholderContainer}>
//           <Image source={require('../assets/placeholder.webp')} style={styles.placeholderImage} />
//           <Text style={styles.placeholderText}>Please select your location to get suggestions</Text>
//         </View>
//       ) : (
//         <>
//           {loading ? (
//             <ActivityIndicator size="large" color="black" />
//           ) : (
//             <>
//               {suggestions.length > 0 ? (
//                 <FlatList
//                   data={suggestions}
//                   keyExtractor={(item, index) => index.toString()}
//                   renderItem={({ item }) => (
//                     <View style={styles.suggestionItem}>
//                       <Image source={{ uri: item[0] }} style={styles.suggestionImage} />
//                       {item[1] && <Image source={{ uri: item[1] }} style={styles.suggestionImage} />}
//                     </View>
//                   )}
//                 />
//               ) : (
//                 <Text style={styles.text}>No suggestions available</Text>
//               )}
//             </>
//           )}
//           <View style={styles.buttonContainer}>
//             {!noMoreSuggestions && (
//               <Button title="Refresh Suggestions" onPress={handleRefreshPress} color="black" />
//             )}
//             {noMoreSuggestions && (
//               <Button title="Repeat Suggestions" onPress={handleRepeatPress} color="black" />
//             )}
//           </View>
//         </>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   locationIcon: {
//     marginRight: 10,
//   },
//   weatherInfo: {
//     flex: 1,
//     alignItems: 'flex-start',
//   },
//   text: {
//     fontSize: 18,
//   },
//   buttonContainer: {
//     marginTop: 20,
//     alignItems: 'center',
//   },
//   suggestionItem: {
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//   },
//   suggestionImage: {
//     width: '100%',
//     height: 200,
//     resizeMode: 'cover',
//     marginBottom: 10,
//   },
//   placeholderContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   placeholderImage: {
//     width: 200,
//     height: 200,
//     marginBottom: 20,
//   },
//   placeholderText: {
//     fontSize: 18,
//     textAlign: 'center',
//   },
// });

// export default Suggestions;































// import React, { useState, useEffect } from 'react';
// import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Button } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { doc, getDoc } from 'firebase/firestore';
// import { db } from '../firebase';
// import { useRoute, useNavigation } from '@react-navigation/native';

// const Suggestions = () => {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const { weather, userId } = route.params || {};
//   const [governorate, setGovernorate] = useState('');
//   const [suggestions, setSuggestions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [displayedImages, setDisplayedImages] = useState([]);
//   const [noMoreSuggestions, setNoMoreSuggestions] = useState(false);

//   const getSeason = (temp) => {
//     if (temp >= 25) return 'summer';
//     if (temp >= 15 && temp < 25) return 'spring';
//     if (temp >= 5 && temp < 15) return 'fall';
//     return 'winter';
//   };

//   const fetchSuggestions = async () => {
//     try {
//       setLoading(true);
//       const season = getSeason(weather.temp);

//       const userRef = doc(db, 'users', userId);
//       const userSnap = await getDoc(userRef);

//       if (userSnap.exists()) {
//         const userData = userSnap.data();
//         const seasonOrders = userData.HistoryOrder.filter(order => order.season === season);
//         const seasonSuggestions = seasonOrders.reduce((acc, order) => {
//           if (!acc[order.type]) acc[order.type] = [];
//           acc[order.type].push(order.image);
//           return acc;
//         }, {});

//         const allImages = Object.values(seasonSuggestions).flat();
//         const filteredImages = allImages.filter(image => !displayedImages.includes(image));

//         if (filteredImages.length > 0) {
//           const randomIndex = Math.floor(Math.random() * filteredImages.length);
//           const selectedImage = filteredImages[randomIndex];

//           let pairedImage = null;
//           if (seasonSuggestions['t-shirt'] && seasonSuggestions['t-shirt'].includes(selectedImage)) {
//             const trousers = seasonSuggestions['trousers'].filter(image => !displayedImages.includes(image));
//             if (trousers.length > 0) {
//               pairedImage = trousers[Math.floor(Math.random() * trousers.length)];
//             }
//           } else if (seasonSuggestions['trousers'] && seasonSuggestions['trousers'].includes(selectedImage)) {
//             const tShirts = seasonSuggestions['t-shirt'].filter(image => !displayedImages.includes(image));
//             if (tShirts.length > 0) {
//               pairedImage = tShirts[Math.floor(Math.random() * tShirts.length)];
//             }
//           }

//           setSuggestions(pairedImage ? [selectedImage, pairedImage] : [selectedImage]);
//           setDisplayedImages([...displayedImages, selectedImage, pairedImage].filter(Boolean));

//           setNoMoreSuggestions(false);
//         } else {
//           setNoMoreSuggestions(true);
//         }
//       } else {
//         console.error('No such user document!');
//       }
//     } catch (error) {
//       console.error('Error fetching suggestions:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (weather) {
//       fetchSuggestions();
//       setGovernorate(weather.location);
//     }
//   }, [weather]);

//   const handleLocationPress = () => {
//     navigation.navigate('weathersearch', { userId });
//   };

//   const handleRefreshPress = () => {
//     fetchSuggestions();
//   };

//   const handleRepeatPress = () => {
//     setDisplayedImages([]);
//     setNoMoreSuggestions(false);
//     fetchSuggestions();
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <View style={styles.weatherInfo}>
//           {weather ? (
//             <>
//               <Text style={styles.text}>{weather.temp} °C</Text>
//               <Text style={styles.text}>{weather.description}</Text>
//             </>
//           ) : (
//             <Text style={styles.text}></Text>
//           )}
//         </View>
//         <TouchableOpacity onPress={handleLocationPress} style={styles.locationIcon}>
//           {governorate ? (
//             <Text style={styles.text}>{governorate}</Text>
//           ) : (
//             <Ionicons name="location-sharp" size={30} color="black" />
//           )}
//         </TouchableOpacity>
//       </View>

//       {!weather ? (
//         <View style={styles.placeholderContainer}>
//           <Image source={require('../assets/placeholder.webp')} style={styles.placeholderImage} />
//           <Text style={styles.placeholderText}>Please select your location to get suggestions</Text>
//         </View>
//       ) : (
//         <>
//           {loading ? (
//             <ActivityIndicator size="large" color="black" />
//           ) : (
//             <>
//               {suggestions.length > 0 ? (
//                 suggestions.map((image, index) => (
//                   <View key={index} style={styles.suggestionItem}>
//                     <Image source={{ uri: image }} style={styles.suggestionImage} />
//                   </View>
//                 ))
//               ) : (
//                 <Text style={styles.text}>No suggestions available</Text>
//               )}
//             </>
//           )}
//           <View style={styles.buttonContainer}>
//             {!noMoreSuggestions && (
//               <Button title="Refresh Suggestions" onPress={handleRefreshPress} color="black" />
//             )}
//             {noMoreSuggestions && (
//               <Button title="Repeat Suggestions" onPress={handleRepeatPress} color="black" />
//             )}
//           </View>
//         </>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   locationIcon: {
//     marginRight: 10,
//   },
//   weatherInfo: {
//     flex: 1,
//     alignItems: 'flex-start',
//   },
//   text: {
//     fontSize: 18,
//   },
//   buttonContainer: {
//     marginTop: 20,
//     alignItems: 'center',
//   },
//   suggestionItem: {
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//   },
//   suggestionImage: {
//     width: '100%',
//     height: 200,
//     resizeMode: 'cover',
//   },
//   placeholderContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   placeholderImage: {
//     width: 200,
//     height: 200,
//     marginBottom: 20,
//   },
//   placeholderText: {
//     fontSize: 18,
//     textAlign: 'center',
//   },
// });

// export default Suggestions;

















// import React, { useState, useEffect } from 'react';
// import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Button } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { doc, getDoc } from 'firebase/firestore';
// import { db } from '../firebase';
// import { useRoute, useNavigation } from '@react-navigation/native';

// const Suggestions = () => {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const { weather, userId } = route.params || {};
//   const [governorate, setGovernorate] = useState('');
//   const [suggestions, setSuggestions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [displayedImages, setDisplayedImages] = useState([]); // Track displayed images
//   const [noMoreSuggestions, setNoMoreSuggestions] = useState(false); // Track if no more suggestions available

//   const getSeason = (temp) => {
//     if (temp >= 25) return 'summer';
//     if (temp >= 15 && temp < 25) return 'spring';
//     if (temp >= 5 && temp < 15) return 'fall';
//     return 'winter';
//   };

//   const fetchSuggestions = async () => {
//     try {
//       setLoading(true);
//       const season = getSeason(weather.temp);

//       const userRef = doc(db, 'users', userId);
//       const userSnap = await getDoc(userRef);

//       if (userSnap.exists()) {
//         const userData = userSnap.data();
//         const seasonOrders = userData.HistoryOrder.filter(order => order.season === season);
//         const seasonSuggestions = seasonOrders.reduce((acc, order) => {
//           if (!acc[order.type]) acc[order.type] = [];
//           acc[order.type].push(order.image);
//           return acc;
//         }, {});

//         // Combine all types into one array
//         const combinedSuggestions = Object.values(seasonSuggestions).flat();

//         // Filter out images already displayed
//         const filteredSuggestions = combinedSuggestions.filter(image => !displayedImages.includes(image));

//         if (filteredSuggestions.length > 0) {
//           // Choose a random index within the filtered suggestions array length
//           const randomIndex = Math.floor(Math.random() * filteredSuggestions.length);
//           setSuggestions([filteredSuggestions[randomIndex]]);
          
//           // Add the displayed image to the displayedImages state
//           setDisplayedImages([...displayedImages, filteredSuggestions[randomIndex]]);
          
//           // Reset noMoreSuggestions state
//           setNoMoreSuggestions(false);
//         } else {
//           // If no more suggestions available, set noMoreSuggestions to true
//           setNoMoreSuggestions(true);
//         }
//       } else {
//         console.error('No such user document!');
//       }
//     } catch (error) {
//       console.error('Error fetching suggestions:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (weather) {
//       fetchSuggestions();
//       setGovernorate(weather.location);
//     }
//   }, [weather]);

//   const handleLocationPress = () => {
//     navigation.navigate('weathersearch', { userId });
//   };

//   const handleRefreshPress = () => {
//     fetchSuggestions(); // Fetch suggestions again
//   };

//   const handleRepeatPress = () => {
//     setDisplayedImages([]); // Reset displayed images
//     setNoMoreSuggestions(false); // Reset noMoreSuggestions state
//     fetchSuggestions(); // Fetch suggestions again
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <View style={styles.weatherInfo}>
//           {weather ? (
//             <>
//               <Text style={styles.text}>{weather.temp} °C</Text>
//               <Text style={styles.text}>{weather.description}</Text>
//             </>
//           ) : (
//             <Text style={styles.text}></Text>
//           )}
//         </View>
//         <TouchableOpacity onPress={handleLocationPress} style={styles.locationIcon}>
//           {governorate ? (
//             <Text style={styles.text}>{governorate}</Text>
//           ) : (
//             <Ionicons name="location-sharp" size={30} color="black" />
//           )}
//         </TouchableOpacity>
//       </View>

//       {!weather ? (
//         <View style={styles.placeholderContainer}>
//           <Image source={require('../assets/placeholder.webp')} style={styles.placeholderImage} />
//           <Text style={styles.placeholderText}>Please select your location to get suggestions</Text>
//         </View>
//       ) : (
//         <>
//           {loading ? (
//             <ActivityIndicator size="large" color="black" />
//           ) : (
//             <>
//               {suggestions.length > 0 ? (
//                 <View style={styles.suggestionItem}>
//                   <Image source={{ uri: suggestions[0] }} style={styles.suggestionImage} />
//                 </View>
//               ) : (
//                 <Text style={styles.text}>No suggestions available</Text>
//               )}
//             </>
//           )}
//           <View style={styles.buttonContainer}>
//             {!noMoreSuggestions && (
//               <Button title="Refresh Suggestions" onPress={handleRefreshPress} color="black" />
//             )}
//             {noMoreSuggestions && (
//               <Button title="Repeat Suggestions" onPress={handleRepeatPress} color="black" />
//             )}
//           </View>
//         </>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   locationIcon: {
//     marginRight: 10,
//   },
//   weatherInfo: {
//     flex: 1,
//     alignItems: 'flex-start',
//   },
//   text: {
//     fontSize: 18,
//   },
//   buttonContainer: {
//     marginTop: 20,
//     alignItems: 'center',
//   },
//   suggestionItem: {
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//   },
//   suggestionImage: {
//     width: '100%',
//     height: 200,
//     resizeMode: 'cover',
//   },
//   placeholderContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   placeholderImage: {
//     width: 200,
//     height: 200,
//     marginBottom: 20,
//   },
//   placeholderText: {
//     fontSize: 18,
//     textAlign: 'center',
//   },
// });

// export default Suggestions;






















// import React, { useState, useEffect } from 'react';
// import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Button } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { doc, getDoc } from 'firebase/firestore';
// import { db } from '../firebase';
// import { useRoute, useNavigation } from '@react-navigation/native';

// const Suggestions = () => {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const { weather, userId } = route.params || {};
//   const [governorate, setGovernorate] = useState('');
//   const [suggestions, setSuggestions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0); // Track current image index
//   const [displayedImages, setDisplayedImages] = useState([]); // Track displayed images
//   const [noMoreSuggestions, setNoMoreSuggestions] = useState(false); // Track if no more suggestions available

//   const getSeason = (temp) => {
//     if (temp >= 25) return 'summer';
//     if (temp >= 15 && temp < 25) return 'spring';
//     if (temp >= 5 && temp < 15) return 'fall';
//     return 'winter';
//   };

//   const fetchSuggestions = async () => {
//     try {
//       setLoading(true);
//       const season = getSeason(weather.temp);
//       console.log('Season:', season); // Debugging line for season

//       const userRef = doc(db, 'users', userId);
//       const userSnap = await getDoc(userRef);

//       if (userSnap.exists()) {
//         const userData = userSnap.data();
//         const seasonOrders = userData.HistoryOrder.filter(order => order.season === season);
//         const seasonSuggestions = seasonOrders.map(order => order.image);
        
//         // Filter out images already displayed
//         const filteredSuggestions = seasonSuggestions.filter(image => !displayedImages.includes(image));
        
//         if (filteredSuggestions.length > 0) {
//           // Choose a random index within the filtered suggestions array length
//           const randomIndex = Math.floor(Math.random() * filteredSuggestions.length);
//           setSuggestions(filteredSuggestions);
//           setCurrentImageIndex(randomIndex);
          
//           // Add the displayed image to the displayedImages state
//           setDisplayedImages([...displayedImages, filteredSuggestions[randomIndex]]);
          
//           // Reset noMoreSuggestions state
//           setNoMoreSuggestions(false);
//         } else {
//           // If no more suggestions available, set noMoreSuggestions to true
//           setNoMoreSuggestions(true);
//         }
//       } else {
//         console.error('No such user document!');
//       }
//     } catch (error) {
//       console.error('Error fetching suggestions:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (weather) {
//       fetchSuggestions();
//       setGovernorate(weather.location);
//     }
//   }, [weather]);

//   const handleLocationPress = () => {
//     navigation.navigate('weathersearch', { userId });
//   };

//   const handleRefreshPress = () => {
//     setDisplayedImages([]); // Reset displayed images
//     setNoMoreSuggestions(false); // Reset noMoreSuggestions state
//     fetchSuggestions(); // Fetch suggestions again
//   };

//   const handleRepeatPress = () => {
//     setDisplayedImages([]); // Reset displayed images
//     setNoMoreSuggestions(false); // Reset noMoreSuggestions state
//     fetchSuggestions(); // Fetch suggestions again
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <View style={styles.weatherInfo}>
//           {weather ? (
//             <>
//               <Text style={styles.text}>{weather.temp} °C</Text>
//               <Text style={styles.text}>{weather.description}</Text>
//             </>
//           ) : (
//             <Text style={styles.text}></Text>
//           )}
//         </View>
//         <TouchableOpacity onPress={handleLocationPress} style={styles.locationIcon}>
//           {governorate ? (
//             <Text style={styles.text}>{governorate}</Text>
//           ) : (
//             <Ionicons name="location-sharp" size={30} color="black" />
//           )}
//         </TouchableOpacity>
//       </View>

//       {!weather ? (
//         <View style={styles.placeholderContainer}>
//           <Image source={require('../assets/placeholder.webp')} style={styles.placeholderImage} />
//           <Text style={styles.placeholderText}>Please select your location to get suggestions</Text>
//         </View>
//       ) : (
//         <>
//           {loading ? (
//             <ActivityIndicator size="large" color="black" />
//           ) : (
//             <>
//               {suggestions.length > 0 ? (
//                 <View style={styles.suggestionItem}>
//                   <Image source={{ uri: suggestions[currentImageIndex] }} style={styles.suggestionImage} />
//                 </View>
//               ) : (
//                 <Text style={styles.text}>No suggestions available</Text>
//               )}
//             </>
//           )}
//           <View style={styles.buttonContainer}>
//             {!noMoreSuggestions && (
//               <Button title="Refresh Suggestions" onPress={handleRefreshPress} color="black" />
//             )}
//             {noMoreSuggestions && (
//               <Button title="Repeat Suggestions" onPress={handleRepeatPress} color="black" />
//             )}
//           </View>
//         </>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   locationIcon: {
//     marginRight: 10,
//   },
//   weatherInfo: {
//     flex: 1,
//     alignItems: 'flex-start',
//   },
//   text: {
//     fontSize: 18,
//   },
//   buttonContainer: {
//     marginTop: 20,
//     alignItems: 'center',
//   },
//   suggestionItem: {
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//   },
//   suggestionImage: {
//     width: '100%',
//     height: 200,
//     resizeMode: 'cover',
//   },
//   placeholderContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   placeholderImage: {
//     width: 200,
//     height: 200,
//     marginBottom: 20,
//   },
//   placeholderText: {
//     fontSize: 18,
//     textAlign: 'center',
//   },
// });

// export default Suggestions;














// import React, { useState, useEffect } from 'react';
// import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Button } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { doc, getDoc } from 'firebase/firestore';
// import { db } from '../firebase';
// import { useRoute, useNavigation } from '@react-navigation/native';

// const Suggestions = () => {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const { weather, userId } = route.params || {};
//   const [governorate, setGovernorate] = useState('');
//   const [suggestions, setSuggestions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0); // Track current image index

//   const getSeason = (temp) => {
//     if (temp >= 25) return 'summer';
//     if (temp >= 15 && temp < 25) return 'spring';
//     if (temp >= 5 && temp < 15) return 'fall';
//     return 'winter';
//   };

//   const fetchSuggestions = async () => {
//     try {
//       setLoading(true);
//       const season = getSeason(weather.temp);
//       console.log('Season:', season); // Debugging line for season

//       const userRef = doc(db, 'users', userId);
//       const userSnap = await getDoc(userRef);

//       if (userSnap.exists()) {
//         const userData = userSnap.data();
//         const seasonOrders = userData.HistoryOrder.filter(order => order.season === season);
//         const seasonSuggestions = seasonOrders.map(order => order.image);
//         setSuggestions(seasonSuggestions);

//         // Reset currentImageIndex to 0 if suggestions array is empty
//         if (seasonSuggestions.length === 0) {
//           setCurrentImageIndex(0);
//         } else {
//           // Cycle through images by incrementing currentImageIndex
//           setCurrentImageIndex(prevIndex => (prevIndex + 1) % seasonSuggestions.length);
//         }
//       } else {
//         console.error('No such user document!');
//       }
//     } catch (error) {
//       console.error('Error fetching suggestions:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (weather) {
//       fetchSuggestions();
//       setGovernorate(weather.location);
//     }
//   }, [weather]);

//   const handleLocationPress = () => {
//     navigation.navigate('weathersearch', { userId });
//   };

//   const handleRefreshPress = () => {
//     fetchSuggestions();
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <View style={styles.weatherInfo}>
//           {weather ? (
//             <>
//               <Text style={styles.text}>{weather.temp} °C</Text>
//               <Text style={styles.text}>{weather.description}</Text>
//             </>
//           ) : (
//             <Text style={styles.text}></Text>
//           )}
//         </View>
//         <TouchableOpacity onPress={handleLocationPress} style={styles.locationIcon}>
//           {governorate ? (
//             <Text style={styles.text}>{governorate}</Text>
//           ) : (
//             <Ionicons name="location-sharp" size={30} color="black" />
//           )}
//         </TouchableOpacity>
//       </View>

//       {!weather ? (
//         <View style={styles.placeholderContainer}>
//           <Image source={require('../assets/placeholder.webp')} style={styles.placeholderImage} />
//           <Text style={styles.placeholderText}>Please select your location to get suggestions</Text>
//         </View>
//       ) : (
//         <>
//           {loading ? (
//             <ActivityIndicator size="large" color="black" />
//           ) : (
//             <>
//               {suggestions.length > 0 ? (
//                 <View style={styles.suggestionItem}>
//                   <Image source={{ uri: suggestions[currentImageIndex] }} style={styles.suggestionImage} />
//                 </View>
//               ) : (
//                 <Text style={styles.text}>No suggestions available</Text>
//               )}
//             </>
//           )}
//           <View style={styles.refreshButtonContainer}>
//             <Button title="Refresh Suggestions" onPress={handleRefreshPress} color="black" />
//           </View>
//         </>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   locationIcon: {
//     marginRight: 10,
//   },
//   weatherInfo: {
//     flex: 1,
//     alignItems: 'flex-start',
//   },
//   text: {
//     fontSize: 18,
//   },
//   refreshButtonContainer: {
//     marginTop: 20,
//     alignItems: 'center',
//   },
//   suggestionItem: {
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//   },
//   suggestionImage: {
//     width: '100%',
//     height: 200,
//     resizeMode: 'cover',
//   },
//   placeholderContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   placeholderImage: {
//     width: 200,
//     height: 200,
//     marginBottom: 20,
//   },
//   placeholderText: {
//     fontSize: 18,
//     textAlign: 'center',
//   },
// });

// export default Suggestions;











// import React, { useState, useEffect } from 'react';
// import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Button } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { doc, getDoc } from 'firebase/firestore';
// import { db } from '../firebase';
// import { useRoute, useNavigation } from '@react-navigation/native';

// const Suggestions = () => {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const { weather, userId } = route.params || {};
//   const [governorate, setGovernorate] = useState('');
//   const [suggestions, setSuggestions] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const getSeason = (temp) => {
//     if (temp >= 25) return 'summer';
//     if (temp >= 15 && temp < 25) return 'spring';
//     if (temp >= 5 && temp < 15) return 'fall';
//     return 'winter';
//   };

//   const fetchSuggestions = async () => {
//     try {
//       setLoading(true);
//       const season = getSeason(weather.temp);
//       console.log('Season:', season); // Debugging line for season

//       const userRef = doc(db, 'users', userId);
//       const userSnap = await getDoc(userRef);

//       if (userSnap.exists()) {
//         const userData = userSnap.data();
//         const seasonOrders = userData.HistoryOrder.filter(order => order.season === season);
//         const seasonSuggestions = seasonOrders.map(order => order.image);
//         setSuggestions(seasonSuggestions);
//       } else {
//         console.error('No such user document!');
//       }
//     } catch (error) {
//       console.error('Error fetching suggestions:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (weather) {
//       fetchSuggestions();
//       setGovernorate(weather.location);
//     }
//   }, [weather]);

//   const handleLocationPress = () => {
//     navigation.navigate('weathersearch', { userId });
//   };

//   const handleRefreshPress = () => {
//     fetchSuggestions();
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <View style={styles.weatherInfo}>
//           {weather ? (
//             <>
//               <Text style={styles.text}>{weather.temp} °C</Text>
//               <Text style={styles.text}>{weather.description}</Text>
//             </>
//           ) : (
//             <Text style={styles.text}></Text>
//           )}
//         </View>
//         <TouchableOpacity onPress={handleLocationPress} style={styles.locationIcon}>
//           {governorate ? (
//             <Text style={styles.text}>{governorate}</Text>
//           ) : (
//             <Ionicons name="location-sharp" size={30} color="black" />
//           )}
//         </TouchableOpacity>
//       </View>

//       {!weather ? (
//         <View style={styles.placeholderContainer}>
//           <Image source={require('../assets/placeholder.webp')} style={styles.placeholderImage} />
//           <Text style={styles.placeholderText}>Please select your location to get suggestions</Text>
//         </View>
//       ) : (
//         <>
//           {loading ? (
//             <ActivityIndicator size="large" color="black" />
//           ) : (
//             <FlatList
//               data={suggestions}
//               keyExtractor={(item, index) => index.toString()}
//               renderItem={({ item }) => (
//                 <View style={styles.suggestionItem}>
//                   {item ? (
//                     <Image source={{ uri: item }} style={styles.suggestionImage} />
//                   ) : (
//                     <Text style={styles.text}>No Image Available</Text>
//                   )}
//                 </View>
//               )}
//             />
//           )}
//           <View style={styles.refreshButtonContainer}>
//             <Button title="Refresh Suggestions" onPress={handleRefreshPress} color="black" />
//           </View>
//         </>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   locationIcon: {
//     marginRight: 10,
//   },
//   weatherInfo: {
//     flex: 1,
//     alignItems: 'flex-start',
//   },
//   text: {
//     fontSize: 18,
//   },
//   refreshButtonContainer: {
//     marginTop: 20,
//     alignItems: 'center',
//   },
//   suggestionItem: {
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//   },
//   suggestionImage: {
//     width: '100%',
//     height: 200,
//     resizeMode: 'cover',
//   },
//   placeholderContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   placeholderImage: {
//     width: 200,
//     height: 200,
//     marginBottom: 20,
//   },
//   placeholderText: {
//     fontSize: 18,
//     textAlign: 'center',
//   },
// });

// export default Suggestions;















// // import React, { useState, useEffect } from 'react';
// // import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Button } from 'react-native';
// // import { Ionicons } from '@expo/vector-icons';
// // import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
// // import { db } from '../firebase';
// // import { useRoute, useNavigation } from '@react-navigation/native';

// // const Suggestions = () => {
// //   const route = useRoute();
// //   const navigation = useNavigation();
// //   const { weather, userId } = route.params || {};

// //   const [isLoading, setIsLoading] = useState(true);
// //   const [filteredOrders, setFilteredOrders] = useState([]);
// //   const [usedOrders, setUsedOrders] = useState([]);

// //   const getSeason = (temp) => {
// //     if (temp >= 25) return 'summer';
// //     if (temp >= 15 && temp < 25) return 'spring';
// //     if (temp >= 5 && temp < 15) return 'fall';
// //     return 'winter';
// //   };

// //   const fetchAndFilterOrders = async () => {
// //     if (!weather || !userId) {
// //       console.error('Weather or userId is missing');
// //       setIsLoading(false);
// //       return;
// //     }

// //     try {
// //       const userRef = doc(db, 'users', userId);
// //       const userSnap = await getDoc(userRef);

// //       if (userSnap.exists()) {
// //         const userData = userSnap.data();
// //         const season = getSeason(weather.temp);
// //         const seasonOrders = userData.HistoryOrder.filter(order => order.season === season);

// //         const dressOrders = seasonOrders.filter(order => order.type === 'dress' && !usedOrders.includes(order.id));
// //         const suitOrders = seasonOrders.filter(order => order.type === 'suit' && !usedOrders.includes(order.id));
// //         const tshirtOrders = seasonOrders.filter(order => order.type === 't-shirt' && !usedOrders.includes(order.id));
// //         const trousersOrders = seasonOrders.filter(order => order.type === 'trousers' && !usedOrders.includes(order.id));

// //         console.log('Dress Orders:', dressOrders);
// //         console.log('Suit Orders:', suitOrders);
// //         console.log('T-Shirt Orders:', tshirtOrders);
// //         console.log('Trousers Orders:', trousersOrders);

// //         let newFilteredOrders = [];
// //         let attempts = 0;
// //         const maxAttempts = 4;

// //         while (newFilteredOrders.length === 0 && attempts < maxAttempts) {
// //           // إعادة تعيين القائمة في كل محاولة

// //           const randomChoice = Math.floor(Math.random() * 3);

// //           switch (randomChoice) {
// //             case 0:
// //               if (dressOrders.length > 0) {
// //                 newFilteredOrders.push(dressOrders[Math.floor(Math.random() * dressOrders.length)]);
// //               }
// //               break;
// //             case 1:
// //               if (suitOrders.length > 0) {
// //                 newFilteredOrders.push(suitOrders[Math.floor(Math.random() * suitOrders.length)]);
// //               }
// //               break;
// //             case 2:
// //               if (tshirtOrders.length > 0 && trousersOrders.length > 0) {
// //                 newFilteredOrders.push(tshirtOrders[Math.floor(Math.random() * tshirtOrders.length)]);
// //                 newFilteredOrders.push(trousersOrders[Math.floor(Math.random() * trousersOrders.length)]);
// //               }
// //               break;
// //             default:
// //               break;
// //           }
// //           attempts++;
// //         }

// //         if (newFilteredOrders.length > 0) {
// //           setFilteredOrders(newFilteredOrders);
// //           const updatedUsedOrders = [...usedOrders, ...newFilteredOrders.map(order => order.id)];
// //           setUsedOrders(updatedUsedOrders);
// //           await updateDoc(userRef, {
// //             SuggestedOrders: arrayUnion(...newFilteredOrders)
// //           });
// //         }
// //       } else {
// //         console.error('No such user document!');
// //       }
// //     } catch (error) {
// //       console.error('Error fetching user orders: ', error);
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     if (weather && userId) {
// //       fetchAndFilterOrders();
// //     }
// //   }, [weather, userId]);

// //   const handleLocationPress = () => {
// //     navigation.navigate('weathersearch', { userId });
// //   };

// //   const handleRefreshPress = async () => {
// //     setIsLoading(true);
// //     await fetchAndFilterOrders();
// //   };

// //   const handleStartOverPress = () => {
// //     setUsedOrders([]);
// //     handleRefreshPress();
// //   };

// //   const renderUserOrder = ({ item }) => (
// //     <View style={styles.cardView}>
// //       <Image source={{ uri: item.image }} style={filteredOrders.length === 1 ? styles.largeImage : styles.image} />
// //       <Text>{item.name}</Text>
// //       <Text>{item.price}</Text>
// //     </View>
// //   );

// //   return (
// //     <View style={styles.container}>
// //       <View style={styles.header}>
// //         <View style={styles.weatherInfo}>
// //           {weather && (
// //             <>
// //               <Text style={styles.text}>{weather.temp} °C</Text>
// //               <Text style={styles.text}>{weather.description}</Text>
// //             </>
// //           )}
// //         </View>
// //         <TouchableOpacity onPress={handleLocationPress} style={styles.locationIcon}>
// //           <Ionicons name="location-sharp" size={30} color="black" />
// //         </TouchableOpacity>
// //       </View>

// //       <View style={styles.orderContainer}>
// //         {isLoading ? (
// //           <ActivityIndicator size="large" color="black" />
// //         ) : (
// //           <FlatList
// //             data={filteredOrders}
// //             renderItem={renderUserOrder}
// //             keyExtractor={(item) => item.id}
// //             contentContainerStyle={styles.flatListContainer}
// //           />
// //         )}
// //       </View>

// //       {!isLoading && filteredOrders.length === 0 && (
// //         <View style={styles.startOverButtonContainer}>
// //           <Button title="Start Over" onPress={handleStartOverPress} color="black" />
// //         </View>
// //       )}

// //       {!isLoading && filteredOrders.length > 0 && (
// //         <View style={styles.refreshButtonContainer}>
// //           <Button title="Refresh Suggestions" onPress={handleRefreshPress} color="black" />
// //         </View>
// //       )}
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     padding: 20,
// //     backgroundColor: '#fff',
// //   },
// //   header: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: 20,
// //   },
// //   locationIcon: {
// //     marginRight: 10,
// //   },
// //   weatherInfo: {
// //     flex: 1,
// //     alignItems: 'flex-start',
// //   },
// //   text: {
// //     fontSize: 18,
// //   },
// //   orderContainer: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     width: '100%',
// //   },
// //   cardView: {
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginBottom: 20,
// //   },
// //   image: {
// //     width: 100,
// //     height: 100,
// //     margin: 10,
// //   },
// //   largeImage: {
// //     width: 200,
// //     height: 200,
// //     margin: 10,
// //   },
// //   flatListContainer: {
// //     alignItems: 'center',
// //   },
// //   refreshButtonContainer: {
// //     marginTop: 20,
// //     width: '100%',
// //   },
// //   startOverButtonContainer: {
// //     marginTop: 20,
// //     width: '100%',
// //   },
// // });

// // export default Suggestions;














// // import React, { useState, useEffect } from 'react';
// // import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Button } from 'react-native';
// // import { Ionicons } from '@expo/vector-icons';
// // import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
// // import { db } from '../firebase';

// // const Suggestions = ({ navigation, route }) => {
// //   const { weather, userId } = route.params || {};
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [filteredOrders, setFilteredOrders] = useState([]);
// //   const [usedOrders, setUsedOrders] = useState([]);

// //   const getSeason = (temp) => {
// //     if (temp >= 25) return 'summer';
// //     if (temp >= 15 && temp < 25) return 'spring';
// //     if (temp >= 5 && temp < 15) return 'fall';
// //     return 'winter';
// //   };

// //   const fetchAndFilterOrders = async () => {
// //     if (!weather || !userId) {
// //       console.error('Weather or userId is missing');
// //       setIsLoading(false);
// //       return;
// //     }

// //     try {
// //       const userRef = doc(db, 'users', userId);
// //       const userSnap = await getDoc(userRef);

// //       if (userSnap.exists()) {
// //         const userData = userSnap.data();
// //         const season = getSeason(weather.temp);
// //         const seasonOrders = userData.HistoryOrder.filter(order => order.season === season);

// //         const dressOrders = seasonOrders.filter(order => order.type === 'dress' && !usedOrders.includes(order.id));
// //         const suitOrders = seasonOrders.filter(order => order.type === 'suit' && !usedOrders.includes(order.id));
// //         const tshirtOrders = seasonOrders.filter(order => order.type === 't-shirt' && !usedOrders.includes(order.id));
// //         const trousersOrders = seasonOrders.filter(order => order.type === 'trousers' && !usedOrders.includes(order.id));

// //         let newFilteredOrders = [];
// //         let attempts = 0;

// //         while (newFilteredOrders.length === 0 && attempts < 4) {
// //           // Generate a random number to decide which type of order to show
// //           const randomChoice = Math.floor(Math.random() * 4);

// //           switch (randomChoice) {
// //             case 0:
// //               if (dressOrders.length > 0) {
// //                 newFilteredOrders.push(dressOrders[Math.floor(Math.random() * dressOrders.length)]);
// //               }
// //               break;
// //             case 1:
// //               if (suitOrders.length > 0) {
// //                 newFilteredOrders.push(suitOrders[Math.floor(Math.random() * suitOrders.length)]);
// //               }
// //               break;
// //             case 2:
// //               if (tshirtOrders.length > 0 && trousersOrders.length > 0) {
// //                 newFilteredOrders.push(tshirtOrders[Math.floor(Math.random() * tshirtOrders.length)]);
// //                 newFilteredOrders.push(trousersOrders[Math.floor(Math.random() * trousersOrders.length)]);
// //               }
// //               break;
// //             case 3:
// //               if (trousersOrders.length > 0 && tshirtOrders.length > 0) {
// //                 newFilteredOrders.push(trousersOrders[Math.floor(Math.random() * trousersOrders.length)]);
// //                 newFilteredOrders.push(tshirtOrders[Math.floor(Math.random() * tshirtOrders.length)]);
// //               }
// //               break;
// //             default:
// //               break;
// //           }
// //           attempts++;
// //         }

// //         setFilteredOrders(newFilteredOrders);
// //         const updatedUsedOrders = [...usedOrders, ...newFilteredOrders.map(order => order.id)];
// //         setUsedOrders(updatedUsedOrders);
// //         await updateDoc(userRef, {
// //           SuggestedOrders: arrayUnion(...newFilteredOrders)
// //         });
// //       } else {
// //         console.error('No such user document!');
// //       }
// //     } catch (error) {
// //       console.error('Error fetching user orders: ', error);
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchAndFilterOrders();
// //   }, [weather, userId]);

// //   const handleLocationPress = () => {
// //     navigation.navigate('weathersearch', { userId });
// //   };

// //   const handleRefreshPress = async () => {
// //     setIsLoading(true);
// //     setFilteredOrders([]);
// //     await fetchAndFilterOrders();
// //   };

// //   const handleStartOverPress = () => {
// //     setUsedOrders([]);
// //     handleRefreshPress();
// //   };

// //   const renderUserOrder = ({ item }) => (
// //     <View style={styles.cardView}>
// //       <Image source={{ uri: item.image }} style={filteredOrders.length === 1 ? styles.largeImage : styles.image} />
// //       <Text>{item.name}</Text>
// //       <Text>{item.price}</Text>
// //     </View>
// //   );

// //   return (
// //     <View style={styles.container}>
// //       <View style={styles.header}>
// //         <View style={styles.weatherInfo}>
// //           {weather && (
// //             <>
// //               <Text style={styles.text}>{weather.temp} °C</Text>
// //               <Text style={styles.text}>{weather.description}</Text>
// //             </>
// //           )}
// //         </View>
// //         <TouchableOpacity onPress={handleLocationPress} style={styles.locationIcon}>
// //           <Ionicons name="location-sharp" size={30} color="black" />
// //         </TouchableOpacity>
// //       </View>

// //       <View style={styles.orderContainer}>
// //         {isLoading ? (
// //           <ActivityIndicator size="large" color="black" />
// //         ) : (
// //           <FlatList
// //             data={filteredOrders}
// //             renderItem={renderUserOrder}
// //             keyExtractor={(item) => item.id}
// //             contentContainerStyle={styles.flatListContainer}
// //           />
// //         )}
// //       </View>

// //       {!isLoading && filteredOrders.length === 0 && (
// //         <View style={styles.startOverButtonContainer}>
// //           <Button title="Start Over" onPress={handleStartOverPress} color="black" />
// //         </View>
// //       )}

// //       {!isLoading && filteredOrders.length > 0 && (
// //         <View style={styles.refreshButtonContainer}>
// //           <Button title="Refresh Suggestions" onPress={handleRefreshPress} color="black" />
// //         </View>
// //       )}
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     padding: 20,
// //     backgroundColor: '#fff',
// //   },
// //   header: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: 20,
// //   },
// //   locationIcon: {
// //     marginRight: 10,
// //   },
// //   weatherInfo: {
// //     flex: 1,
// //     alignItems: 'flex-start',
// //   },
// //   text: {
// //     fontSize: 18,
// //   },
// //   orderContainer: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     width: '100%',
// //   },
// //   cardView: {
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginBottom: 20,
// //   },
// //   image: {
// //     width: 100,
// //     height: 100,
// //     margin: 10,
// //   },
// //   largeImage: {
// //     width: 200,
// //     height: 200,
// //     margin: 10,
// //   },
// //   flatListContainer: {
// //     alignItems: 'center',
// //   },
// //   refreshButtonContainer: {
// //     marginTop: 20,
// //     width: '100%',
// //   },
// //   startOverButtonContainer: {
// //     marginTop: 20,
// //     width: '100%',
// //   },
// // });

// // export default Suggestions;










// // import React, { useState, useEffect } from 'react';
// // import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Button } from 'react-native';
// // import { Ionicons } from '@expo/vector-icons';
// // import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
// // import { db } from '../firebase';

// // const Suggestions = ({ navigation, route }) => {
// //   const { weather, userId } = route.params;

// //   const [isLoading, setIsLoading] = useState(true);
// //   const [filteredOrders, setFilteredOrders] = useState([]);
// //   const [usedOrders, setUsedOrders] = useState([]);

// //   const getSeason = (temp) => {
// //     if (temp >= 25) return 'summer';
// //     if (temp >= 15 && temp < 25) return 'spring';
// //     if (temp >= 5 && temp < 15) return 'fall';
// //     return 'winter';
// //   };

// //   const fetchAndFilterOrders = async () => {
// //     if (!weather || !userId) {
// //       console.error('Weather or userId is missing');
// //       setIsLoading(false);
// //       return;
// //     }

// //     try {
// //       const userRef = doc(db, 'users', userId);
// //       const userSnap = await getDoc(userRef);

// //       if (userSnap.exists()) {
// //         const userData = userSnap.data();
// //         const season = getSeason(weather.temp);
// //         const seasonOrders = userData.HistoryOrder.filter(order => order.season === season);

// //         const dressOrders = seasonOrders.filter(order => order.type === 'dress' && !usedOrders.includes(order.id));
// //         const suitOrders = seasonOrders.filter(order => order.type === 'suit' && !usedOrders.includes(order.id));
// //         const tshirtOrders = seasonOrders.filter(order => order.type === 't-shirt' && !usedOrders.includes(order.id));
// //         const trousersOrders = seasonOrders.filter(order => order.type === 'trousers' && !usedOrders.includes(order.id));

// //         let newFilteredOrders = [];
// //         let attempts = 0;

// //         while (newFilteredOrders.length === 0 && attempts < 4) {
// //           // Generate a random number to decide which type of order to show
// //           const randomChoice = Math.floor(Math.random() * 4);

// //           switch (randomChoice) {
// //             case 0:
// //               if (dressOrders.length > 0) {
// //                 newFilteredOrders.push(dressOrders[Math.floor(Math.random() * dressOrders.length)]);
// //               }
// //               break;
// //             case 1:
// //               if (suitOrders.length > 0) {
// //                 newFilteredOrders.push(suitOrders[Math.floor(Math.random() * suitOrders.length)]);
// //               }
// //               break;
// //             case 2:
// //               if (tshirtOrders.length > 0 && trousersOrders.length > 0) {
// //                 newFilteredOrders.push(tshirtOrders[Math.floor(Math.random() * tshirtOrders.length)]);
// //                 newFilteredOrders.push(trousersOrders[Math.floor(Math.random() * trousersOrders.length)]);
// //               }
// //               break;
// //             case 3:
// //               if (trousersOrders.length > 0 && tshirtOrders.length > 0) {
// //                 newFilteredOrders.push(trousersOrders[Math.floor(Math.random() * trousersOrders.length)]);
// //                 newFilteredOrders.push(tshirtOrders[Math.floor(Math.random() * tshirtOrders.length)]);
// //               }
// //               break;
// //             default:
// //               break;
// //           }
// //           attempts++;
// //         }

// //         setFilteredOrders(newFilteredOrders);
// //         const updatedUsedOrders = [...usedOrders, ...newFilteredOrders.map(order => order.id)];
// //         setUsedOrders(updatedUsedOrders);
// //         await updateDoc(userRef, {
// //           SuggestedOrders: arrayUnion(...newFilteredOrders)
// //         });
// //       } else {
// //         console.error('No such user document!');
// //       }
// //     } catch (error) {
// //       console.error('Error fetching user orders: ', error);
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchAndFilterOrders();
// //   }, [weather, userId]);

// //   const handleLocationPress = () => {
// //     navigation.navigate('weathersearch', { userId });
// //   };

// //   const handleRefreshPress = async () => {
// //     setIsLoading(true);
// //     setFilteredOrders([]);
// //     await fetchAndFilterOrders();
// //   };

// //   const handleStartOverPress = () => {
// //     setUsedOrders([]);
// //     handleRefreshPress();
// //   };

// //   const renderUserOrder = ({ item }) => (
// //     <View style={styles.cardView}>
// //       <Image source={{ uri: item.image }} style={filteredOrders.length === 1 ? styles.largeImage : styles.image} />
// //       <Text>{item.name}</Text>
// //       <Text>{item.price}</Text>
// //     </View>
// //   );

// //   return (
// //     <View style={styles.container}>
// //       <View style={styles.header}>
// //         <View style={styles.weatherInfo}>
// //           {weather && (
// //             <>
// //               <Text style={styles.text}>{weather.temp} °C</Text>
// //               <Text style={styles.text}>{weather.description}</Text>
// //             </>
// //           )}
// //         </View>
// //         <TouchableOpacity onPress={handleLocationPress} style={styles.locationIcon}>
// //           <Ionicons name="location-sharp" size={30} color="black" />
// //         </TouchableOpacity>
// //       </View>

// //       <View style={styles.orderContainer}>
// //         {isLoading ? (
// //           <ActivityIndicator size="large" color="black" />
// //         ) : (
// //           <FlatList
// //             data={filteredOrders}
// //             renderItem={renderUserOrder}
// //             keyExtractor={(item) => item.id}
// //             contentContainerStyle={styles.flatListContainer}
// //           />
// //         )}
// //       </View>

// //       {!isLoading && filteredOrders.length === 0 && (
// //         <View style={styles.startOverButtonContainer}>
// //           <Button title="Start Over" onPress={handleStartOverPress} color="black" />
// //         </View>
// //       )}

// //       {!isLoading && filteredOrders.length > 0 && (
// //         <View style={styles.refreshButtonContainer}>
// //           <Button title="Refresh Suggestions" onPress={handleRefreshPress} color="black" />
// //         </View>
// //       )}
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     padding: 20,
// //     backgroundColor: '#fff',
// //   },
// //   header: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: 20,
// //   },
// //   locationIcon: {
// //     marginRight: 10,
// //   },
// //   weatherInfo: {
// //     flex: 1,
// //     alignItems: 'flex-start',
// //   },
// //   text: {
// //     fontSize: 18,
// //   },
// //   orderContainer: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     width: '100%',
// //   },
// //   cardView: {
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginBottom: 20,
// //   },
// //   image: {
// //     width: 100,
// //     height: 100,
// //     margin: 10,
// //   },
// //   largeImage: {
// //     width: 200,
// //     height: 200,
// //     margin: 10,
// //   },
// //   flatListContainer: {
// //     alignItems: 'center',
// //   },
// //   refreshButtonContainer: {
// //     marginTop: 20,
// //     width: '100%',
// //   },
// //   startOverButtonContainer: {
// //     marginTop: 20,
// //     width: '100%',
// //   },
// // });

// // export default Suggestions;




