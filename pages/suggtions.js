// src/HomeScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const suggtions = ({ navigation, route }) => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    if (route.params?.weather) {
      setWeather(route.params.weather);
    }
  }, [route.params?.weather]);

  const handleLocationPress = () => {
    navigation.navigate('WeatherSearch');
  };

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
    </View>
  );
};

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
});

export default suggtions;
