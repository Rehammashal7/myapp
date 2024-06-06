// // src/WeatherSearch.js











import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import firebase from 'firebase/app';
import 'firebase/firestore';
const governorates = [
    { name: 'Cairo', lat: 30.0444, lon: 31.2357 },
    { name: 'Alexandria', lat: 31.2156, lon: 29.9553 },
    { name: 'Giza', lat: 30.0131, lon: 31.2089 },
    { name: 'Aswan', lat: 24.0889, lon: 32.8998 },
    { name: 'Asyut', lat: 27.1809, lon: 31.1837 },
    { name: 'Beheira', lat: 30.5965, lon: 30.8990 },
    { name: 'Beni Suef', lat: 29.0661, lon: 31.0994 },
    { name: 'Dakahlia', lat: 31.0409, lon: 31.3785 },
    { name: 'Damietta', lat: 31.4175, lon: 31.8144 },
    { name: 'Faiyum', lat: 29.3102, lon: 30.8418 },
    { name: 'Gharbia', lat: 30.8754, lon: 31.0335 },
    { name: 'Ismailia', lat: 30.5900, lon: 32.2654 },
    { name: 'Kafr El Sheikh', lat: 31.3051, lon: 30.9233 },
    { name: 'Luxor', lat: 25.6872, lon: 32.6396 },
    { name: 'Matrouh', lat: 31.3547, lon: 27.2373 },
    { name: 'Minya', lat: 28.1099, lon: 30.7503 },
    { name: 'Monufia', lat: 30.5785, lon: 30.9876 },
    { name: 'New Valley', lat: 25.4544, lon: 30.5463 },
    { name: 'North Sinai', lat: 30.4898, lon: 33.6659 },
    { name: 'Port Said', lat: 31.2565, lon: 32.2841 },
    { name: 'Qalyubia', lat: 30.1230, lon: 31.2422 },
    { name: 'Qena', lat: 26.1551, lon: 32.7160 },
    { name: 'Red Sea', lat: 27.2579, lon: 33.8116 },
    { name: 'Sharqia', lat: 30.7326, lon: 31.7150 },
    { name: 'Sohag', lat: 26.5598, lon: 31.6954 },
    { name: 'South Sinai', lat: 29.3117, lon: 33.1321 },
    { name: 'Suez', lat: 29.9668, lon: 32.5498 },
  ];

const WeatherSearch = ({ navigation, route }) => {
  const { userId } = route.params;
  const [search, setSearch] = useState('');
  const [filteredGovernorates, setFilteredGovernorates] = useState([]);
  const [selectedGovernorate, setSelectedGovernorate] = useState(null);


  // const fetchWeather = async (lat, lon, location) => {
  //   const apiKey = 'bc67d4a8416bf1033a65c84097d7c561'; // Replace with your OpenWeatherMap API key
  //   const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  //   try {
  //     const response = await fetch(url);
  //     const data = await response.json();
  //     const tempInKelvin = data.main.temp;
  //     const tempInCelsius = tempInKelvin - 273.15;
  //     const weatherData = {
  //      location,
  //       temp: tempInCelsius.toFixed(2),
  //       description: data.weather[0].description,
       
  //     };
  //     console.log(weatherData)

  //     // await firebase.firestore().collection('users').doc(userId).update({
  //     //   weatherData,
  //     // });

  //     navigation.navigate('suggtions', { weather: weatherData, userId });
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };
 

  const fetchWeather = async (lat, lon, location) => {
    const apiKey = 'bc67d4a8416bf1033a65c84097d7c561'; // Replace with your OpenWeatherMap API key
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      const tempInKelvin = data.main.temp;
      const tempInCelsius = tempInKelvin - 273.15;
      const weatherData = {
        location,
        temp: tempInCelsius.toFixed(2),
        description: data.weather[0].description,
      };
      navigation.navigate('suggtions', { weather: weatherData,userId });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (text) => {
    setSearch(text);
    if (text) {
      const filtered = governorates.filter(gov =>
        gov.name.toLowerCase().startsWith(text.toLowerCase())
      );
      setFilteredGovernorates(filtered);
    } else {
      setFilteredGovernorates([]);
    }
  };

  const handleSelectGovernorate = (governorate) => {
    setSearch(governorate.name);
    setSelectedGovernorate(governorate);
    setFilteredGovernorates([]);
    fetchWeather(governorate.lat, governorate.lon, governorate.name);
    Keyboard.dismiss();
  };

  const handleFocus = () => {
    setFilteredGovernorates(governorates);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>Search Governorate</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter governorate name"
          value={search}
          onFocus={handleFocus}
          onChangeText={handleSearch}
        />
        {selectedGovernorate && (
          <View style={styles.selectedContainer}>
            <Text style={styles.selectedText}>{selectedGovernorate.name}</Text>
          </View>
        )}
        {filteredGovernorates.length > 0 && (
          <FlatList
            data={filteredGovernorates}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleSelectGovernorate(item)}>
                <Text style={styles.item}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default WeatherSearch;


// import React, { useState } from 'react';
// import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';

// const governorates = [
//   { name: 'Cairo', lat: 30.0444, lon: 31.2357 },
//   { name: 'Alexandria', lat: 31.2156, lon: 29.9553 },
//   { name: 'Giza', lat: 30.0131, lon: 31.2089 },
//   { name: 'Aswan', lat: 24.0889, lon: 32.8998 },
//   { name: 'Asyut', lat: 27.1809, lon: 31.1837 },
//   { name: 'Beheira', lat: 30.5965, lon: 30.8990 },
//   { name: 'Beni Suef', lat: 29.0661, lon: 31.0994 },
//   { name: 'Dakahlia', lat: 31.0409, lon: 31.3785 },
//   { name: 'Damietta', lat: 31.4175, lon: 31.8144 },
//   { name: 'Faiyum', lat: 29.3102, lon: 30.8418 },
//   { name: 'Gharbia', lat: 30.8754, lon: 31.0335 },
//   { name: 'Ismailia', lat: 30.5900, lon: 32.2654 },
//   { name: 'Kafr El Sheikh', lat: 31.3051, lon: 30.9233 },
//   { name: 'Luxor', lat: 25.6872, lon: 32.6396 },
//   { name: 'Matrouh', lat: 31.3547, lon: 27.2373 },
//   { name: 'Minya', lat: 28.1099, lon: 30.7503 },
//   { name: 'Monufia', lat: 30.5785, lon: 30.9876 },
//   { name: 'New Valley', lat: 25.4544, lon: 30.5463 },
//   { name: 'North Sinai', lat: 30.4898, lon: 33.6659 },
//   { name: 'Port Said', lat: 31.2565, lon: 32.2841 },
//   { name: 'Qalyubia', lat: 30.1230, lon: 31.2422 },
//   { name: 'Qena', lat: 26.1551, lon: 32.7160 },
//   { name: 'Red Sea', lat: 27.2579, lon: 33.8116 },
//   { name: 'Sharqia', lat: 30.7326, lon: 31.7150 },
//   { name: 'Sohag', lat: 26.5598, lon: 31.6954 },
//   { name: 'South Sinai', lat: 29.3117, lon: 33.1321 },
//   { name: 'Suez', lat: 29.9668, lon: 32.5498 },
// ];

// const WeatherSearch = ({ navigation }) => {
//   const [search, setSearch] = useState('');
//   const [filteredGovernorates, setFilteredGovernorates] = useState([]);

//   const fetchWeather = async (lat, lon, location) => {
//     const apiKey = 'bc67d4a8416bf1033a65c84097d7c561'; // Replace with your OpenWeatherMap API key
//     const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
//     try {
//       const response = await fetch(url);
//       const data = await response.json();
//       const tempInKelvin = data.main.temp;
//       const tempInCelsius = tempInKelvin - 273.15;
//       const weatherData = {
//         location,
//         temp: tempInCelsius.toFixed(2),
//         description: data.weather[0].description,
//       };
//       navigation.navigate('suggtions', { weather: weatherData });
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleSearch = (text) => {
//     setSearch(text);
//     if (text) {
//       const filtered = governorates.filter(gov =>
//         gov.name.toLowerCase().startsWith(text.toLowerCase())
//       );
//       setFilteredGovernorates(filtered);
//     } else {
//       setFilteredGovernorates([]);
//     }
//   };

//   const handleSelectGovernorate = (governorate) => {
//     setSearch(governorate.name);
//     setFilteredGovernorates([]);
//     fetchWeather(governorate.lat, governorate.lon, governorate.name);
//     Keyboard.dismiss();
//   };

//   const handleFocus = () => {
//     setFilteredGovernorates(governorates);
//   };

//   return (
//     <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//       <View style={styles.container}>
//         <Text style={styles.title}>Search Governorate</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter governorate name"
//           value={search}
//           onFocus={handleFocus}
//           onChangeText={handleSearch}
//         />
//         {filteredGovernorates.length > 0 && (
//           <FlatList
//             data={filteredGovernorates}
//             keyExtractor={(item) => item.name}
//             renderItem={({ item }) => (
//               <TouchableOpacity onPress={() => handleSelectGovernorate(item)}>
//                 <Text style={styles.item}>{item.name}</Text>
//               </TouchableOpacity>
//             )}
//           />
//         )}
//       </View>
//     </TouchableWithoutFeedback>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     justifyContent: 'center',
//     backgroundColor: '#fff',
//   },
//   title: {
//     fontSize: 24,
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     padding: 10,
//     marginBottom: 20,
//   },
//   item: {
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//   },
// });

// export default WeatherSearch;
