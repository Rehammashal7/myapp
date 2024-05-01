import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  updateProfile,
} from "firebase/auth";
import {
  doc,
  updateDoc,
  collection,
  getDocs,
  getDoc,
  addDoc,
} from "firebase/firestore";
import { auth, db, storage } from "../firebase";
import { AntDesign } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
const { width } = Dimensions.get("screen");
const { height } = Dimensions.get("screen");

const cardwidth = width / 2;
const AddressScreen = ({ navigation }) => {
  const currentUser = useAuth();
  const [frist, setFrist] = useState("");
  const [address, setAddress] = useState([]);

  function useAuth() {
    const [currentUser, setCurrentUser] = useState("");

    useEffect(() => {
      const unsub = onAuthStateChanged(auth, (user) => setCurrentUser(user));

      return unsub;
    }, []);

    return currentUser;
  }

  const handlePressButton = () => {
    navigation.navigate("AddressInformation");
  };

  useEffect(() => {
    if (currentUser) {
      getUserData();
    }
  }, [currentUser]);

  useEffect(() => {
    console.log("New address:", address);
    // getUserData();
  }, [address]);

  const deleteAddress = (index) => {
    const updatedAddress = address.filter((_, i) => i !== index);
    setAddress(updatedAddress);
  };
  const getUserData = async () => { 
    console.log("cureent", currentUser.uid);
    try {
      const docRef = doc(db, "users", auth.currentUser.uid);
      console.log("curedsent", currentUser.uid);

      const docSnap = await getDoc(docRef);
      console.log(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        console.log(userData);
        if (userData.dataAddress) {
          let updateddataAddress = [...userData.dataAddress];
          console.log("address", updateddataAddress);
          setAddress(updateddataAddress);
        }
      }
      //   console.log(address);
      console.log("cureent", currentUser.uid);
    } catch (error) {
      console.error("Error fetching user data: ", error);
    }
  };
  const handleEdit = (index) => {
    console.log("index: ", index);
    navigation.navigate("AddressInformation", { useraddress: address[index] });
  };

  const handleDeleteAddress = async (index) => {
    try {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        let updatedDataAddress = userData.dataAddress.filter(
          (item, i) => i !== index
        );

        
        updatedDataAddress = updatedDataAddress.map((item, i) => ({
          ...item,
          index: i,
        }));

        
        await updateDoc(userDocRef, { dataAddress: updatedDataAddress });

        alert("Address deleted successfully");
        deleteAddress(index);
      } else {
        alert("No user data found");
      }
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  
  const updateIndexesInDatabase = async (indexes) => {
    try {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userDocRef, { deletedIndexes: indexes });
      console.log("Indexes updated successfully");
    } catch (error) {
      console.error("Error updating indexes:", error);
    }
  };

  console.log("dwhiejw", address);
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {address.map((item, index) => (
          <View key={index} style={styles.addressContainer}>
            <View style={styles.welcomecontainer}>
              <Text style={styles.addressTitle}>{item.addressTitle}</Text>
              <Text style={styles.addressItem}>{item.address}</Text>
              <View style={styles.buttonContent}>
                <Text style={styles.addressItem}>{item.city}</Text>
                <Text style={styles.slash}>/</Text>
                <Text style={styles.addressItem}>{item.district}</Text>
              </View>
              <View style={styles.buttonContent}>
                <Text style={[styles.addressItem, { fontWeight: "bold" }]}>
                  {item.firstName}
                </Text>
                <Text style={[styles.addressItem, { fontWeight: "bold" }]}>
                  {item.lastName}
                </Text>
              </View>
              <View style={styles.buttonContent}>
                <Text style={[styles.numberItem, { marginLeft: 10 }]}>
                  {item.countryCode}
                </Text>
                <Text style={styles.numberItem}>{item.numberType}</Text>
                <Text style={styles.numberItem}>{item.phone}</Text>
              </View>
              <View style={styles.buttonContent}>
                <SimpleLineIcons
                  name="pencil"
                  size={24}
                  color="black"
                  style={{ marginLeft: 10, marginTop: 15 }}
                  onPress={() => handleEdit(index)}
                />
                <Ionicons
                  name="trash-outline"
                  size={24}
                  color="black"
                  style={{ marginLeft: 15, marginTop: 15 }}
                  onPress={() => handleDeleteAddress(index)}
                />
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
      <View
        style={{
          padding: 35,
          backgroundColor: "white",
          width: width - 700,
        }}
      ></View>

      <TouchableOpacity style={styles.AddButton} onPress={handlePressButton}>
        <View style={styles.buttonContent}>
          <AntDesign name="plus" size={24} color="white" />
          <Text style={styles.AddButtonText}>Add Address</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
export default AddressScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "flex-start",
    // alignItems: 'center',
  },
  scrollView: {
    flex: 1,
    backgroundColor: "white",
  },
  AddButton: {
    position: "absolute",
    bottom: 10,
    width: width - 20,
    marginLeft: 10,
    backgroundColor: "black",
    padding: 10,
    marginTop: 50,
    alignItems: "center",
    // marginBottom:50 ,
  },
  AddButtonText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 5,
    // alignItems: 'center',
    // justifyContent: 'center',
    fontSize: 18,
  },
  buttonContent: {
    flexDirection: "row", 
    alignItems: "center", 
  },
  welcomecontainer: {
    backgroundColor: "#ffffff",
    width: width - 20,
    height: height - 600,
    justifyContent: "center",
    alignItems: "flex-start",
    alignSelf: "center",
    marginTop: 5,
    marginLeft: 5,
    marginRight: 5,
    borderStyle: "solid",
    borderColor: "black",
    borderWidth: 1,
    position: "relative",
    textAlign: "right",
    // flexDirection: 'row',
    // marginLeft:5,
    // marginRight:0,
  },
  addressTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
    marginLeft: 10,
    textAlign: "left", 
  },
  addressItem: {
    fontSize: 16,
    marginTop: 5,
    marginLeft: 10,
  },
  numberItem: {
    fontSize: 16,
    marginTop: 5,
    // marginLeft: 10,
  },
  slash: {
    fontsize: 40,
    marginTop: 5,
    marginLeft: 10,
  },
});
