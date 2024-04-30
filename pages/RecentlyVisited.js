import {
  getAuth,
  onAuthStateChanged,
  signOut,
  updateProfile,
  // useAuth,
} from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
  Pressable,
  input,
  ScrollView,
  Dimensions,
} from "react-native";
import { upload, useAuth } from "../firebase";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/FontAwesome5";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { Entypo } from "@expo/vector-icons";
import { auth, db, storage } from "../firebase";
import COLORS from "../Consts/Color";
import * as ImagePicker from "expo-image-picker";
import BottomNavigator from "../components/bar";
import { Fontisto } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("screen");
const { height } = Dimensions.get("screen");

const cardwidth = width / 2;

const RecentlyVisited = ({ navigation }) => {
  const currentUser = useAuth();
  const [recentlyVisited, setRecentlyVisited] = useState([]);
  function useAuth() {
    const [currentUser, setCurrentUser] = useState("");

    useEffect(() => {
      const unsub = onAuthStateChanged(auth, (user) => setCurrentUser(user));
      return unsub;
      console.log("iam in useAuth useEffect");
    }, []);

    return currentUser;
  }
  useEffect(() => {
    const fetchRecentlyVisited = async () => {
      try {
        const userRef = doc(db, "users", auth.currentUser.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log("iheihdxliowjdxlemwsjpodkewpd",userData);
          if (userData.recentlyVisited) {
            let updatedRecentlyVisited = [...userData.recentlyVisited];
            if (updatedRecentlyVisited.length > 10) {
              updatedRecentlyVisited = updatedRecentlyVisited.slice(updatedRecentlyVisited.length - 10);
            }
            setRecentlyVisited(updatedRecentlyVisited);
            console.log("recent",updatedRecentlyVisited);
          } else {
            alert("No recently visited data found.");
          }
        } else {
          console.log("User document not found.");
        }
      } catch (error) {
        console.error("Error fetching recently visited data: ", error);
      }
    };

    if (auth.currentUser.uid) {
      fetchRecentlyVisited();
    }
  }, [auth.currentUser.uid]);
// console.log("recent2",recentlyVisited);
  const navigateToDetailsPage = async (id, categoryName) => {
    try {
      console.log("id",id);
      console.log("cat",categoryName);
      categoryName = categoryName.toLowerCase();
      console.log("cat", categoryName);
      const productRef = doc(db, categoryName, id);
      console.log("productRef",productRef);
      console.log("Product Reference Path:", productRef.path);

      const productDoc = await getDoc(productRef);
      console.log("product",productDoc);
      if (productDoc.exists()) {
      
        const productData = { id: productDoc.id, ...productDoc.data() };

        console.log("prooo",productData);
        console.log("id",id);
        if (productData && productData.images && productData.images.length > 0) {
          console.log("Product data:", productData); 
        
          let detailsPageName;
        
          switch (categoryName) {
            case "baby":
              detailsPageName = "BabyDetails";
              break;
            case "kids":
              detailsPageName = "KidsDetails";
              break;
            case "men":
              detailsPageName = "MenDetails";
              break;
            case "woman":
              detailsPageName = "WomanDetails";
              break;
            default:
              console.log("Unknown category:", categoryName);
              return;
          }
          
          console.log("idddddd",id);
          navigation.navigate(detailsPageName, { product: productData});
        } else {
          console.log("Product image is empty or undefined.");
        }
      } else {
        console.log("Product not found.");
      }
    } catch (error) {
      console.error("Error fetching product data: ", error);
    }
  };
  const clearAllVisited = async () => {
    try {
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, { recentlyVisited: [] });
  
    
      setRecentlyVisited([]);
  
      console.log("Recently visited cleared successfully.");
    } catch (error) {
      console.error("Error clearing recently visited: ", error);
    }
  };
  
  return (
<View style={styles.container}>
  <View style={[{flexDirection:"row"}]}>
  <Text style={styles.header}>Recently Visited Products</Text>
  <View style={styles.clearAllContainer}>
  <Text style={styles.clearAll} onPress={clearAllVisited} >ClearAll</Text>
</View>
</View>
  <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ flexGrow: 1 }}
      >
  <View style={styles.productList}>
    {recentlyVisited.map((product, index) => (
      <TouchableOpacity
        key={index}
        style={[styles.productCard]}
        onPress={() =>
          navigateToDetailsPage(product.id, product.categoryName)
        }
      >
        <Image
          source={{ uri: product.image[0] }}
          style={styles.productImage}
        />
        <Text style={[styles.productName,{marginLeft:5}]}>{product.name}</Text>
      </TouchableOpacity>
    ))}
  </View>
  </ScrollView>

</View>

  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start", 
    backgroundColor: COLORS.white,
    // position: "relative",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    // textAlign: "left",
    // position: "absolute",
    // top: 0,
    // left: 0,
    marginLeft: 0,
    marginTop: 10,
  },

  productList: {
    flexDirection: "row", 
    flexWrap: "wrap", 
    justifyContent: "flex-start", 
    marginTop: 10,
    textAlign: "center",
    alignItems: "flex-start",
    // marginHorizontal: 5,
    justifyContent: "space-between",

  },
  productCard: {
    width: cardwidth,
    backgroundColor: COLORS.white,
    alignItems: "flex-start", 
    marginBottom: 10,
    
  },
  productImage: {
    width: cardwidth ,
    height: height / 4,
    // borderRadius: 10,
    margin:2,
    marginBottom: 10,
    alignSelf: "flex-start",
  },

  productName: {
    width: cardwidth - 20,
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "left",
  },
  clearAllContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginTop: 10,
  },
  clearAll: {
    fontSize: 16,
    fontWeight: "bold",
    // marginRight: 0,
    marginTop:30,
    marginLeft:30,
    borderBottomColor:"black",
    borderBottomWidth:1,
  },
  checkbox: {
    position: "absolute",
    top: 5,
    left: 5,
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: COLORS.black,
  },
  checked: {
    backgroundColor: COLORS.black,
  },
  
  
});

export default RecentlyVisited;
