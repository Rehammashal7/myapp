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
  Dimensions,
} from "react-native";
import { upload, useAuth } from "../firebase";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from '@expo/vector-icons';
import Icon from "react-native-vector-icons/FontAwesome5";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { Entypo } from "@expo/vector-icons";
import { auth, db, storage } from "../firebase";

import * as ImagePicker from "expo-image-picker";
import BottomNavigator from "../components/bar";
import { Fontisto } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";
import { Ionicons } from '@expo/vector-icons';
import { profilee } from "../Consts/styles";

const { width } = Dimensions.get("screen");
const { height } = Dimensions.get("screen");
const cardheight = height / 2;
const cardwidth = width / 2;

const Profile  = ({ navigation ,route}) => {
  console.log(route.params)
  const COLORS=route.params.COLORS
  const styles =profilee(COLORS)
  const currentUser = useAuth();
  const [fristName, setFristName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState();
  const [mode, setMode] = useState("unlogginUser");
  const [showBouns, setShowBouns] = useState(false);
  const [wallet, setWallet] = useState("");
  const [showWallet, setShowWallet] = useState(false);

  const [bounspoint, setBouns] = useState("");
  const [getData, setGetData] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  // const [order, setOrder] = useState("");
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [photoURL, setPhotoURL] = useState(
    "https://as1.ftcdn.net/v2/jpg/03/46/83/96/1000_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg"
  );
  const [profilePhoto, setProfilePhoto] = useState(null);
  // const [orderedItems, setOrderedItems] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Set getData to true when the profile page is focused
      setGetData(true);
    });

    // Clean up the listener when the component is unmounted
    return unsubscribe;
  }, [navigation]);

  function useAuth() {
    const [currentUser, setCurrentUser] = useState("");

    useEffect(() => {
      const unsub = onAuthStateChanged(auth, user => setCurrentUser(user));
      return unsub;
      console.log("iam in useAuth useEffect");
    }, []);

    return currentUser;
  }
  useEffect(() => {
    if (getData) {
      getUserData();
      console.log("iam in useEffect 2");
    }
    else {
      console.log("data not found")
    }


  }, [getData, mode]);

  useEffect(() => {
    if (currentUser) {

      setMode("loggedIn");
      console.log("iam in useEffect 3");

    } else {
      setMode("unlogginUser");
      console.log("iam in useEffect 3");

    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser?.photoURL) {
      setPhotoURL(currentUser.photoURL);
    }
  }, [currentUser]);

  // function handleChange() {
  //   // if (imagepath && imagepath.length > 0 ) {
  //   //   const image = imagepath[0];
  //   //   setPhotoURL(imagepath.uri);
  //   //   setPhoto(imagepath);
  //   //   handleChoosePhoto();
  //   // }
  // }
  const handleChoosePhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setPhotoURL(result.uri);

    }


  };


  // const handleRecentlyVisitedPress = () => {
  //   if (mode === "loggedIn") {
  //     if (recentlyVisited.length > 0) {
  //       const lastVisitedProduct = recentlyVisited[recentlyVisited.length - 1];
  //       alert(`Last visited product: ${lastVisitedProduct}`);
  //     } else {
  //       alert("No recently visited products.");
  //     }
  //   }
  // };
  function handleClick() {
    upload(photo, currentUser, setLoading);
  }
  async function upload(file, currentUser, setLoading) {
    const storage = getStorage();

    const fileRef = ref(storage, currentUser.uid + '.png');

    setLoading(true);

    const snapshot = await uploadBytes(fileRef, file);
    const photoURL = await getDownloadURL(fileRef);

    updateProfile(currentUser, { photoURL });

    setLoading(false);
    alert("Uploaded file!");
  };


  const getUserData = async () => {
    const docRef = doc(db, "users", auth.currentUser.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      setFristName(data.fName);
      setLastName(data.lName);
      setBouns((data.boun || 0));
      setGetData(false);
      setWallet(data.walet);
      console.log("getdata done");

    }
  };




  {
    mode === "loggedIn" ? getUserData() : null;
  }


  const handleLogin = () => {
    navigation.navigate("Login");
  };
  const handleSignUp = () => {
    navigation.navigate("SignUp");
  };
  const handleAboutUs = () => {
    navigation.navigate("AboutUs");
  };
  const handleRecycleProduct = () => {
    navigation.navigate("UserRecycleProduct");
  };
  const handleEditProfile = () => {
    navigation.navigate("EditProfile");
  };
  const handleMyAddressPress = () => {
    navigation.navigate("AddressScreen");
  };
  const handleMyOrderPress = () => {
    navigation.navigate("HistoryOrder");
  };
  const handleMyOrderPressed = () => {
    navigation.navigate("CancelOrder");
  };
  const handleLogOut = () => {
    signOut(auth)
      .then(() => {
        setUserLoggedIn(false);
        navigation.navigate("Login");
      })
      .catch((error) => console.log(error));
  };
  const handleRecentlyVisitedPress = () => {
    navigation.navigate("RecentlyVisited");

  };
  return (
    <>
      {mode === "loggedIn" && (
        <View style={styles.container}>
          <View style={styles.welcomecontainer}>
            <View>
              <Image style={styles.profileImage} source={{ uri: photoURL }} />
            </View>
            <Text style={styles.welcomeinput}>
              Welcome,{fristName} {lastName}
            </Text>
            <View style={styles.pencil}>
              <Pressable onPress={handleEditProfile}>
                <SimpleLineIcons name="pencil" size={20} color={COLORS.dark} />
              </Pressable>
            </View>

            <View style={styles.pressableContainer}>
              <Pressable
                style={styles.pressable}
                onPress={handleRecentlyVisitedPress}
              >
                <View style={styles.row}>
                  <MaterialCommunityIcons
                    style={styles.icon}
                    name="eye-circle-outline"
                    size={35}
                    color={COLORS.dark}
                  />
                  <Text style={styles.text}> Recently Visited </Text>
                </View>
              </Pressable>
              <Pressable
                style={styles.pressable}
                onPress={handleMyAddressPress}
              >
                <View style={styles.row}>
                  <Icon
                    style={styles.icon}
                    name="map-marked-alt"
                    size={35}
                    color={COLORS.dark}
                  />
                  <Text style={styles.text}>My Address</Text>
                </View>
              </Pressable>
            </View>
          </View>

          <View style={styles.ordercontainer}>
            <Text style={[styles.welcomeinput, { marginLeft: 10, fontWeight: "normal" }]}>
              My Orders
            </Text>
            <Text style={[styles.SeeAll, { fontWeight: "normal" }]} onPress={handleMyOrderPress}>
              See All
            </Text>

            <View style={styles.pressableContainer}>
              <Pressable style={styles.pressable} onPress={() => setShowBouns(!showBouns)}>
                <View style={styles.row}>
                  <Entypo name="star-outlined" size={35} color={COLORS.dark} />
                  <Text style={styles.text}> Bouns </Text>
                </View>
              </Pressable>
              <Pressable style={styles.pressable} onPress={handleMyOrderPress}>
                <View style={styles.row}>
                  <Fontisto name="shopping-bag-1" size={35} color={COLORS.dark} />
                  <Text style={styles.text}> Orders </Text>
                </View>
              </Pressable>
              <Pressable style={styles.pressable} onPress={handleMyOrderPressed}>
                <View style={styles.row}>
                  <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                    <Fontisto name="shopping-bag-1" size={40} color={COLORS.dark} />
                    <MaterialCommunityIcons name="cancel" size={30} color={COLORS.white} style={{ position: 'absolute', top: 10, left: 5 }} />
                  </View>
                  <Text style={styles.text}> Cancle Order </Text>
                </View>
              </Pressable>
            </View>
          </View>
          {showBouns && (
            <Text style={styles.bounsText}>Bouns: {bounspoint}</Text>
          )}
          <TouchableOpacity onPress={handleAboutUs}>
            <View style={styles.aboutuscontainer}>
              <MaterialIcons name="stars" size={30} color={COLORS.dark} />
              <View style={styles.textAndArrowContainer}>
              <Text style={styles.abouttext}>AboutUs</Text>
              <View>
                <MaterialIcons name="keyboard-arrow-right" size={30} color={COLORS.dark}  />
              </View>
              </View>
            </View>
          </TouchableOpacity >
          <Pressable onPress={() => setShowWallet(!showWallet)}>
            <View style={styles.aboutuscontainer} >
              <Ionicons name="wallet-outline" size={24} color={COLORS.dark} />
              <View style={styles.textAndArrowContainer}>
              <Text style={styles.abouttext}>MyWallet</Text>
              <View>
                {!showWallet && (
                  <MaterialIcons name="keyboard-arrow-right" size={30} color={COLORS.dark}  />
                )}
                {showWallet && (
                  <MaterialIcons name="keyboard-arrow-down" size={30} color={COLORS.dark}  />
                )}
              </View>
              </View>
            </View>
          </Pressable>
          <TouchableOpacity>
            {showWallet && (

              <Text style={styles.walletText}>MyWallet: {wallet}</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={handleRecycleProduct}>
            <View style={styles.aboutuscontainer}>
              <Icon name="recycle" size={25} color={COLORS.dark} />
              <View style={styles.textAndArrowContainer}>
              <Text style={styles.abouttext}>Recycle Product</Text>
              <View>
                <MaterialIcons name="keyboard-arrow-right" size={30} color={COLORS.dark}  />
              </View>
              </View>
            </View>
          </TouchableOpacity >
          <TouchableOpacity onPress={handleLogOut} style={styles.logoutButton}>
            <Text style={styles.logoutButtonText}>LogOut</Text>
          </TouchableOpacity>
        </View>
      )}
      {mode === "unlogginUser" && (
        <View style={styles.container}>
          <View style={styles.welcomecontainer}>
            <Text style={[styles.welcomeinput, { marginLeft: 10 }]}>
              Welcome to AtoZ
            </Text>
            <View style={styles.pressableContainer}>
              <Pressable style={styles.pressable} onPress={handleSignUp}>
                <View style={styles.row}>
                  <MaterialCommunityIcons
                    style={styles.icon}
                    name="eye-circle-outline"
                    size={35}
                    color={COLORS.dark}
                  />
                  <Text style={styles.text}> Recently Visited </Text>
                </View>
              </Pressable>
              <Pressable style={styles.pressable} onPress={handleSignUp}>
                <View style={styles.row}>
                  <Icon
                    style={styles.icon}
                    name="map-marked-alt"
                    size={35}
                    color={COLORS.dark}
                  />
                  <Text style={styles.text}> My Address </Text>
                </View>
              </Pressable>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Pressable style={[styles.button, { backgroundColor: "#0d0d0d" }]}>
              <Text
                style={[styles.buttonText, { color: "#ffffff" }]}
                onPress={handleSignUp}
              >
                Register
              </Text>
            </Pressable>
            <Pressable style={styles.button}>
              <Text style={styles.buttonText} onPress={handleLogin}>
                Login
              </Text>
            </Pressable>
          </View>

          <View style={styles.ordercontainer}>
            <Text style={[styles.welcomeinput, { marginLeft: 10, fontWeight: "normal" }]}>
              My Orders
            </Text>
            <Text style={[styles.SeeAll, { fontWeight: "normal" }]} onPress={handleSignUp}>
              See All
            </Text>

            <View style={styles.pressableContainer}>
              <Pressable style={styles.pressable} onPress={handleSignUp}>
                <View style={styles.row}>
                  <Entypo name="star-outlined" size={35} color={COLORS.dark} />
                  <Text style={styles.text}> Bouns </Text>
                </View>
              </Pressable>
              <Pressable style={styles.pressable} onPress={handleSignUp}>
                <View style={styles.row}>
                  <Fontisto name="shopping-bag-1" size={35} color={COLORS.dark} />

                  <Text style={styles.text}> Orders </Text>
                </View>
              </Pressable>
              <Pressable style={styles.pressable} onPress={handleSignUp} >
                <View style={styles.row}>
                  <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                    <Fontisto name="shopping-bag-1" size={40} color={COLORS.dark} />
                    <MaterialCommunityIcons name="cancel" size={30} color={COLORS.white} style={{ position: 'absolute', top: 10, left: 5 }} />
                  </View>
                  <Text style={styles.text}> Cancel Order </Text>
                </View>
              </Pressable>
            </View>
          </View>
          <TouchableOpacity onPress={handleAboutUs}>
            <View style={styles.aboutuscontainer}>
              <MaterialIcons name="stars" size={30} color={COLORS.dark} />
              <Text style={styles.abouttext}>AboutUs</Text>
              <View>
                <MaterialIcons name="keyboard-arrow-right" size={30} color={COLORS.dark} style={[{ marginLeft: width / 1.7 }]} />
              </View>
            </View>
          </TouchableOpacity>

        </View>

      )}
      <BottomNavigator item="profile" navigation={navigation} COLORS={COLORS}/>
    </>
    //     <BottomNavigator item="profile" navigation={navigation} />
  );
};


export default Profile;