import React, { useState, useEffect } from "react";
import GoogleMapReact from "google-map-react";
//import Marker  from 'google-map-react';
import * as Location from "expo-location";
import { async } from "@firebase/util";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Pressable,
  ScrollView,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
// import { Icon } from "react-native-vector-icons/icon";
import { SafeAreaView } from "react-native-safe-area-context";
import { render } from "react-dom";
import { SearchBar } from "react-native-screens";
import Search from "../components/search";


const Mapscreen = () => {
  const [location, setLocation] = useState();
  const [errorMsg, setErrorMsg] = useState(null);
  const [address, setAddress] = useState();
  const [searchText, setSearchText] = useState("");

  const defaultProps = {
    center: {
      lat: 30.0444,
      lng: 31.2357,
    },
    zoom: 10,
  };
  useEffect(() => {
    const fetchLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      console.log("Location:", currentLocation);
    };

    fetchLocation();
  }, []);

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = `Latitude: ${location.coords.latitude}, Longitude: ${location.coords.longitude}`;
  }
  const geocode = async () => {
    const geocodeLocation = await Location.geocodeAsync(address);
    console.log("Geocodeed Address :", geocodeLocation);
  };
  const reverseGeocode = async () => {
    const reversegeocodeLocation = await location.reverseGeocodeAsync({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });

    console.log("reverseGeocode Address :", reversegeocodeLocation);
  };
  // SearchSelection = () => {
  //   return (
  //     <View style={styles.Search}>
  //       <Text style={styles.text}>jkk</Text>
  //     </View>
  //   );
  // };

  // MapSelection = () => {
  //   return (
  //     <View>
  //     <div style={{ height: "80vh", width: "100%" }}>
  //       <GoogleMapReact
  //         bootstrapURLKeys={{ key: "AIzaSyAg_OCpvTnPsWbcdiiNJUcGVmmRoFrrCT8" }}
  //         defaultCenter={defaultProps.center}
  //         defaultZoom={defaultProps.zoom}
  //       >
  //         <Marker lat={30.0444} lng={31.2357} text="Cairo" />
  //       </GoogleMapReact>
  //     </div>
  //     </View>
  //   );
  // };
  const SearchSelection = () => {
    return (
      <View style={styles.container}>
        <TextInput
        style={styles.input}
        placeholder="Location ..."
        value={searchText}
        onChangeText={setSearchText}
        
      />
       <TouchableOpacity
        onPress={handleSearch}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>
      </View>
    );
  };
  
  const MapSelection = () => {
    return (
      <div style={{ height: "5000%", width: "100%" }}>
        <GoogleMapReact
          bootstrapURLKeys={{
            key: "YOUR_API_KEY",
          }}
          defaultCenter={defaultProps.center}
          defaultZoom={defaultProps.zoom}
        >
          <Marker lat={30.0444} lng={31.2357} text="Cairo" />
        </GoogleMapReact>
      </div>
    );
  };
  const handleSearch = () => {
    // Call the onSearch callback function and pass the search text
    onSearch(searchText);
  };

  const Marker = ({ text }) => <div>{text}</div>;
  return (
    <View style={{ flexDirection: "clonm" ,height: "100%", width: "100%"  }}>
      {SearchSelection() }
      {MapSelection() }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    backgroundColor: "white",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: "100%",
    marginRight: 10,
    padding: 5,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingTop : 5,

  },
  button: {
    backgroundColor: '#131A2C',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    paddingTop : 5,
  },
  buttonText: {
    color: "#FFDE9B",
    fontSize: 18,
    fontWeight: "bold",
  },
});
export default Mapscreen;
