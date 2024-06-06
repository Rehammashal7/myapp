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
import COLORS from "../Consts/Color";
import * as ImagePicker from "expo-image-picker";
import BottomNavigator from "../components/bar";
import { Fontisto } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get("screen");
const { height } = Dimensions.get("screen");
const cardheight = height / 2;
const cardwidth = width / 2;

const Profile = ({ navigation }) => {
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
                <SimpleLineIcons name="pencil" size={20} color="black" />
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
                    color="black"
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
                    color="black"
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
                  <Entypo name="star-outlined" size={35} color="black" />
                  <Text style={styles.text}> Bouns </Text>
                </View>
              </Pressable>
              <Pressable style={styles.pressable} onPress={handleMyOrderPress}>
                <View style={styles.row}>
                  <Fontisto name="shopping-bag-1" size={35} color="black" />
                  <Text style={styles.text}> Orders </Text>
                </View>
              </Pressable>
              <Pressable style={styles.pressable} onPress={handleMyOrderPressed}>
                <View style={styles.row}>
                  <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                    <Fontisto name="shopping-bag-1" size={40} color="black" />
                    <MaterialCommunityIcons name="cancel" size={30} color="white" style={{ position: 'absolute', top: 10, left: 5 }} />
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
              <MaterialIcons name="stars" size={30} color="black" />
              <Text style={styles.abouttext}>AboutUs</Text>
              <View>
                <MaterialIcons name="keyboard-arrow-right" size={30} color="black" style={[{ marginLeft: width/1.7 }]} />
              </View>
            </View>
          </TouchableOpacity >
         <Pressable onPress={() => setShowWallet(!showWallet)}>
         <View style={styles.aboutuscontainer} >
          <Ionicons name="wallet-outline" size={24} color="black" />
          <Text style={styles.abouttext}>MyWallet</Text>
          <View>
          {!showWallet && (
                <MaterialIcons name="keyboard-arrow-right" size={30} color="black" style={[{ marginLeft: width/1.7 }]} />
              )}
              {showWallet && (
                <MaterialIcons name="keyboard-arrow-down" size={30} color="black" style={[{ marginLeft: width/1.7 }]} />
              )}
              </View>
          </View>
         </Pressable>
          <TouchableOpacity>
          {showWallet && (
            
            <Text style={styles.walletText}>MyWallet: {wallet}</Text>
          )}
          </TouchableOpacity>
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
                    color="black"
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
                    color="black"
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
                  <Entypo name="star-outlined" size={35} color="black" />
                  <Text style={styles.text}> Bouns </Text>
                </View>
              </Pressable>
              <Pressable style={styles.pressable} onPress={handleSignUp}>
                <View style={styles.row}>
                  <Fontisto name="shopping-bag-1" size={35} color="black" />

                  <Text style={styles.text}> Orders </Text>
                </View>
              </Pressable>
              <Pressable style={styles.pressable} onPress={handleSignUp} >
                <View style={styles.row}>
                  <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                    <Fontisto name="shopping-bag-1" size={40} color="black" />
                    <MaterialCommunityIcons name="cancel" size={30} color="white" style={{ position: 'absolute', top: 10, left: 5 }} />
                  </View>
                  <Text style={styles.text}> Cancel Order </Text>
                </View>
              </Pressable>
            </View>
          </View>
          <TouchableOpacity onPress={handleAboutUs}>
            <View style={styles.aboutuscontainer}>
              <MaterialIcons name="stars" size={30} color="black" />
              <Text style={styles.abouttext}>AboutUs</Text>
              <View>
                <MaterialIcons name="keyboard-arrow-right" size={30} color="black" style={[{ marginLeft: width/1.7 }]} />
              </View>
            </View>
          </TouchableOpacity>

        </View>

      )}
      <BottomNavigator item="profile" navigation={navigation} />
    </>
    //     <BottomNavigator item="profile" navigation={navigation} />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 16,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  field: {
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
  },

  label: {
    flex: 1,
    fontWeight: "bold",
    Color: "#131A2C",
  },

  value: {
    flex: 2,
    color: "#FFDE9B",
  },
  value2: {
    flex: 2,
    color: "#67788B",
  },
  input: {
    flex: 2,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    paddingHorizontal: 8,
  },
  logoutButton: {
    width: width - 10,
    height: cardheight/10,
    marginLeft: 5,
    backgroundColor: "black",
    padding: 10,
    marginTop: 10,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 75,
    // verticalAlign: "middle",
    // position: "absolute",
    // borderRadius: "50%",
    // borderWidth: "5px",
    // borderColor: "gray",
    // borderStyle: "outset",
    marginLeft: 10,
    position: "absolute",
    left: 5,
    top: 10,
  },
  containerButton: {
    // display: flex,
    flexDirection: "row",
    //  flex:1,
    //   alignItems: 'center',
    //margin:3,
    justifyContent: "space-between",
  },


  buttonTextLoggout: {
    color: "#131A2C",
    fontSize: 16,
    fontWeight: "bold",
  },
  NavContainer: {
    position: "absolute",
    alignItems: "center",
    bottom: 5,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  Navbar: {
    flexDirection: "row",
    backgroundColor: COLORS.dark,
    width: width,
    justifyContent: "space-evenly",
    borderRadius: 30,
    height: 40,
  },
  iconBehave: {
    padding: 35,
    bottom: 30,
  },
  welcomecontainer: {
    backgroundColor: "#ffffff",
    width: width - 10,
    height: "20%",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    alignSelf: "flex-start",
    marginTop: 5,
    marginLeft: 5,
    marginRight: 10,
    borderStyle: "solid",
    borderColor: "black",
    borderWidth: 0.5,
    position: "relative",
    textAlign: "right",
    // flexDirection: 'row',
    // marginLeft:5,
    // marginRight:0,
  },
  welcomeinput: {
    flex: 1,
    // fontWeight: "bold",
    color: "black",
    marginLeft: 50,
    marginTop: 10,
    fontSize: 20,
    textAlign: "right",
  },
  pressableContainer: {
    flexDirection: "row",
    // alignItems: 'center',
    marginBottom: 20,
    marginLeft: 30,
  },
  pressable: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  row: {
    flexDirection: "column",
    alignItems: "center",
  },
  column: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    color: "#000",
    fontSize: 17,
    marginLeft: 10,
    flexDirection: "row",
  },
  icon: {
    marginRight: -10,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  button: {
    // paddingVertical: 15,
    // paddingHorizontal: 20,
    // borderRadius: 0,
    marginHorizontal: 5,
    width: cardwidth - 10,
    height: height/20,
    borderWidth: 1,
    borderColor: "black",
    textAlign: "center",
  },
  buttonText: {
    color: "#000",
    fontSize: 20,
    marginTop:3,
    // textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  ordercontainer: {
    backgroundColor: "#ffffff",
    width: width - 10,
    height: "20%",
    justifyContent: "center",
    alignItems: "flex-start",
    alignSelf: "flex-start",
    marginTop: 10,
    marginLeft: 5,
    marginRight: 10,
    borderStyle: "solid",
    borderColor: "black",
    borderWidth: 0.5,
  },
  SeeAll: {
    position: "absolute",
    top: 10,
    right: 15,
    alignSelf: "flex-end",
    color: "black",
    marginRight: 5,
    textDecorationLine: "underline",
  },
  offer: {
    marginTop: 10,
    marginLeft: 5,
    marginRight: 10,
    borderStyle: "solid",
    borderColor: "black",
    borderWidth: 0.5,
  },
  bounsText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    marginTop: 10,
    marginLeft: 10,
  },
  walletText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    marginTop: 10,
    marginLeft: 30,
  },

  pencil: {
    position: "absolute",
    top: 15,
    // left: 200,
    right: 15,
  },
  aboutuscontainer: {
    flexDirection: "row",
    width: width - 10,
    height: height /18,
    alignItems: "center",
    marginLeft: 5,
    marginTop: 10,
    backgroundColor: "#ffffff",
    borderStyle: "solid",
    borderColor: "black",
    // borderWidth: 0.5,

  },
  abouttext: {
    fontSize: 20,
    marginLeft: 10,


  },
});
export default Profile;