import {
  getAuth,
  onAuthStateChanged,
  signOut,
  updateProfile,
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
//import { upload ,useAuth} from '../firebase';
import FontAwesome from "react-native-vector-icons/FontAwesome";
// import FontAwesome from "react-native-vector-icons/FontAwesome";
// import Feather from "react-native-vector-icons/Feather";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/FontAwesome5";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { Entypo } from "@expo/vector-icons";
import { auth, db, storage } from "../firebase";
import COLORS from "../Consts/Color";
import * as ImagePicker from "expo-image-picker";
import BottomNavigator from "../components/bar";
import { Fontisto } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";
const { width } = Dimensions.get("screen");

const EditProfile = ({ navigation }) => {
    const [isFocused, setIsFocused] = useState(false);

  const currentUser = useAuth();
  const [fristName, setFristName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");

  const [bounspoint, setBouns] = useState("");

  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [photoURL, setPhotoURL] = useState(
    "https://as1.ftcdn.net/v2/jpg/03/46/83/96/1000_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg"
  );
  function handleChange(e) {
    if (e.target.files[0]) {
      setPhoto(e.target.files[0]);
      handleChoosePhoto();
    }
  }

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
    if (!result.canceled) {
      setPhotoURL(result.uri);
    }
  };

  const handleLogOut = () => {
    signOut(auth)
      .then(() => {
        setUserLoggedIn(false);
        navigation.navigate("Welcome");
      })
      .catch((error) => console.log(error));
  };

  function handleClick() {
    upload(photo, currentUser, setLoading);
  }

  const getUser = async () => {
    const docRef = doc(db, "users", auth.currentUser.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      const data = docSnap.data();
      setFristName(data.fName);
      setEmail(data.email);
      setLastName(data.lName);
      setPhone(data.phone);
      setBirthDate(data.birthDate);
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
  };

  const UpdateUserData = async () => {
    const washingtonRef = doc(db, "users", auth.currentUser.uid);

    // Set the "capital" field of the city 'DC'
    await updateDoc(washingtonRef, {
      fName: fristName,
      lName: lastName,
      phone: phone,
      birthDate: birthDate,
    });
  };

  function useAuth() {
    const [currentUser, setCurrentUser] = useState("");

    useEffect(() => {
      const unsub = onAuthStateChanged(auth, (user) => setCurrentUser(user));
      return unsub;
    }, []);

    return currentUser;
  }
  useEffect(() => {
    if (currentUser?.photoURL) {
      setPhotoURL(currentUser.photoURL);
    }
  }, [currentUser]);

  async function upload(file, currentUser, setLoading) {
    const storage = getStorage();

    const fileRef = ref(storage, currentUser.uid + ".png");

    setLoading(true);

    const snapshot = await uploadBytes(fileRef, file);
    const photoURL = await getDownloadURL(fileRef);

    updateProfile(currentUser, { photoURL });

    setLoading(false);
    alert("Uploaded file!");
  }

  const handleSave = () => {
    // TODO: Call backend API to save changes
    setMode("view");
    UpdateUserData();
    if (loading || !photo) {
      // disable
    } else {
      handleClick();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.inf}> My personal information </Text>
      <TouchableOpacity onPress={handleChoosePhoto}>
        <View>
          <Image style={styles.profileImage} source={photoURL} />
        </View>
      </TouchableOpacity>

      <View style={styles.inputContainer}>
        {/* frist name */}
        <TextInput
        style={styles.input}
        placeholder="User Name"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        // secureTextEntry={true}
      />

    </View>

    </View>


    
  );
};
export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 16,
    backgroundColor: "#ffffff",
  },
  inf: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
    profileImage: {
    width: 100,
    height: 100,
    borderRadius: 75,
    verticalAlign: "middle",
    //   position: "absolute",
    borderRadius: "50%",
    borderWidth: "5px",
    borderColor: "gray",
    borderStyle: "outset",
    marginLeft: 10,
    //   position: "absolute",
    //   left: ,
  },
  inputContainer: {
    flex:1,
    flexDirection: "row",
    // borderColor:'white',
    // alignItems: "center",
    // borderBottomWidth: 10,
    // borderBottomColor: "#ccc",
    // marginBottom: 10,
  },


  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderEndColor:'white'
    // borderLeftColor:'white'
  },

  firstNameInput: {
    marginRight: 5,
    marginLeft: 5, 

  },
  lastNameInput: {
    marginLeft: 5, 
    marginRight: 5,

  },


//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 16,
//   },
//   field: {
//     flexDirection: "row",
//     marginTop: 10,
//     marginBottom: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: "#f2f2f2",
//     paddingBottom: 5,
//   },

//   label: {
//     flex: 1,
//     fontWeight: "bold",
//     Color: "#131A2C",
//   },

//   value: {
//     flex: 2,
//     color: "#FFDE9B",
//   },
//   value2: {
//     flex: 2,
//     color: "#67788B",
//   },
// //   input: {
// //     flex: 2,
// //     borderWidth: 1,
// //     borderColor: "#ccc",
// //     borderRadius: 4,
// //     paddingHorizontal: 8,
// //   },
//   profileImage: {
//     width: 100,
//     height: 100,
//     borderRadius: 75,
//     verticalAlign: "middle",
//     //   position: "absolute",
//     borderRadius: "50%",
//     borderWidth: "5px",
//     borderColor: "gray",
//     borderStyle: "outset",
//     marginLeft: 10,
//     //   position: "absolute",
//     //   left: ,
//   },
//   containerButton: {
//     // display: flex,
//     flexDirection: "row",
//     //  flex:1,
//     //   alignItems: 'center',
//     //margin:3,
//     justifyContent: "space-between",
//   },
//   logoutEdit: {
//     flex: 1,
//     backgroundColor: "#131A2C",
//     borderRadius: 35,
//     padding: 5,
//     width: "100%",
//     height: 40,
//     alignItems: "center",
//     margin: 5,
//     // marginVertical: 0,
//     // marginBottom:50,
//   },
//   logoutButton: {
//     flex: 1,
//     backgroundColor: "#FFDE9B",
//     borderRadius: 35,
//     padding: 5,
//     width: "100%",
//     height: 45,
//     alignItems: "center",
//     //marginTop:10,
//     //marginVertical: 10
//     margin: 5,
//   },
//   buttonText: {
//     color: "#FFDE9B",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   buttonTextLoggout: {
//     color: "#131A2C",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   NavContainer: {
//     position: "absolute",
//     alignItems: "center",
//     bottom: 5,
//     borderBottomLeftRadius: 15,
//     borderBottomRightRadius: 15,
//   },
//   Navbar: {
//     flexDirection: "row",
//     backgroundColor: COLORS.dark,
//     width: width,
//     justifyContent: "space-evenly",
//     borderRadius: 30,
//     height: 40,
//   },
//   iconBehave: {
//     padding: 35,
//     bottom: 30,
//   },
});
