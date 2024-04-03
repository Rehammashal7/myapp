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
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import FontAwesome from "react-native-vector-icons/FontAwesome";
// import Feather from "react-native-vector-icons/Feather";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/FontAwesome5";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { Entypo } from '@expo/vector-icons';
import { auth, db, storage } from "../firebase";
import COLORS from "../Consts/Color";
import * as ImagePicker from "expo-image-picker";
import BottomNavigator from "../components/bar";
import { Fontisto } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';
const { width } = Dimensions.get("screen");
const profile = ({ navigation }) => {
  const currentUser = useAuth();
  const [fristName, setFristName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [mode, setMode] = useState("view");
  const [birthDate, setBirthDate] = useState("");

  const [bounspoint, setBouns] = useState("");

  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [order, setOrder] = useState("");
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [photoURL, setPhotoURL] = useState(
    "https://as1.ftcdn.net/v2/jpg/03/46/83/96/1000_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg"
  );
  //const [profilePhoto, setProfilePhoto] = useState(null);
  const [orderedItems, setOrderedItems] = useState([]);

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

  function handleChange(e) {
    if (e.target.files[0]) {
      setPhoto(e.target.files[0]);
      handleChoosePhoto();
    }
  }

  function handleClick() {
    upload(photo, currentUser, setLoading);
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

  const handleEdit = () => {
    setMode("edit");
    handleChange();
  };
  const handleMyOrderPress = () => {
    navigation.navigate("OrderHistory", { orderedItems: orderedItems });
  };

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

  {
    mode === "view" ? getUser() : null;
  }
  useEffect(() => {
    const checkLoginStatus = () => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          setUserLoggedIn(true);
        } else {
          setUserLoggedIn(false);
        }
      });
    };
    checkLoginStatus();
  }, []);
  const handleLogin = () => {
navigation.navigate('Login')
  };
  const handleSignUp = () => {
    navigation.navigate('SignUp')
      };
      const handleEditProfile=()=>{
        navigation.navigate('EditProfile')
      }



  if(userLoggedIn){
    console.log(userLoggedIn);
  return (
    <View style={styles.container}>
      <View style={styles.welcomecontainer}>
      <TouchableOpacity onPress={handleChoosePhoto} >
        <View >

          <Image
            style={styles.profileImage}
            source={photoURL}

          />
        
        </View>

    </TouchableOpacity>

        <Text style={styles.welcomeinput}> Welcome, {fristName}{lastName} </Text>
        <View style={styles.pencil} >
        <Pressable  onPress={handleEditProfile}>
        <SimpleLineIcons name="pencil" size={20} color="black" />        </Pressable>
        </View>
        
        <View style={styles.pressableContainer}>
          <Pressable style={styles.pressable}>
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
          <Pressable style={styles.pressable}>
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

      {/* <View style={styles.buttonContainer}>
        <Pressable style={[styles.button, { backgroundColor: "#0d0d0d" }]}>
          <Text style={[styles.buttonText, { color: "#ffffff" }]}>Register</Text>
        </Pressable>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>
      </View> */}

      <View style={styles.ordercontainer}>
        <Text style={[styles.welcomeinput, { fontWeight: "normal" }]}>My Orders</Text>
        <Text style={[styles.SeeAll, { fontWeight: "normal" }]}>See All</Text>

      <View style={styles.pressableContainer}>
          <Pressable style={styles.pressable}>
            <View style={styles.row}>
            <Entypo name="star-outlined" size={35} color="black" />
              <Text style={styles.text}> Reviews </Text>
            </View>
          </Pressable>
          <Pressable style={styles.pressable}>
            <View style={styles.row}>
            <Fontisto name="shopping-bag-1" size={35} color="black" />
              <Text style={styles.text}> Orders </Text>
            </View>
          </Pressable>
          <Pressable style={styles.pressable}>
            <View style={styles.row}>
            <MaterialCommunityIcons name="newspaper-variant-outline" size={35} color="black" />  
            <Text style={styles.text}> Reports </Text>
            </View>
          </Pressable>
          
        </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogOut}>
                <Text style={styles.logoutButtonText}>Log Out</Text>
            </TouchableOpacity>

            

      {/* {mode === 'view' && (
        <>
          <View style={styles.field}>
            <FontAwesome name="user-o" color="#333333" size={20} />
            <Text style={styles.label}> frist Name:</Text>
            <Text style={styles.value2}>{fristName}</Text>
          </View>

          <View style={styles.field}>
            <FontAwesome name="user-o" color="#333333" size={20} />
            <Text style={styles.label}> last Name:</Text>
            <Text style={styles.value2}>{lastName}</Text>
          </View>

          <View style={styles.field}>
            <Feather name="mail" color="#333333" size={20} />
            <Text style={styles.label}> Email:</Text>
            <Text style={styles.value2}>{email}</Text>
          </View>

          <View style={styles.field}>
            <Feather name="phone" color="#333333" size={20} />
            <Text style={styles.label}> Phone:</Text>
            <Text style={styles.value2}>{phone}</Text>
          </View>

          <View style={styles.field}>
            <FontAwesome name="table" color="#333333" size={20} />
            <Text style={styles.label}> birth Date:</Text>
            <Text style={styles.value2} >{birthDate}
            </Text>
          </View>

          <View style={styles.field}>
          <FontAwesome name="star" color="#333333" size={20} />
            <Text style={styles.label}> Bouns:</Text>
            <Text style={styles.value2} > {bounspoint} </Text>
    

              
          </View>

          <TouchableOpacity onPress={handleMyOrderPress}>
          <View style={styles.field}>
          <FontAwesome name="shopping-bag" color="#333333" size={20} />
            <Text style={styles.label}> My Orders </Text>
            <Text style={styles.value2} >{order}
            </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.containerButton}><TouchableOpacity style={styles.logoutEdit} onPress={handleEdit}>
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity></View>

        </>
      )}  */}
{/* 
      {mode === 'edit' && (
        <>
          <View style={styles.field}>
            <Feather name="file" color="#333333" size={20} />
            <TouchableOpacity            >

              <input type="file" onChange={handleChange} />
            </TouchableOpacity>
          </View>

          <View style={styles.field}>
            <FontAwesome name="user-o" color="#333333" size={20} />
            <Text style={styles.label}> frist name:</Text>
            <TextInput style={styles.input} value={fristName} onChangeText={setFristName} />
          </View>

          <View style={styles.field}>
            <FontAwesome name="user-o" color="#333333" size={20} />
            <Text style={styles.label}> last name:</Text>
            <TextInput style={styles.input} value={lastName} onChangeText={setLastName} />
          </View>


          <View style={styles.field}>
            <Feather name="mail" color="#333333" size={20} />
            <Text style={styles.label}> Email:</Text>
            <TextInput style={styles.input} value={email} onChangeText={setEmail} />
          </View>

          <View style={styles.field}>
            <Feather name="phone" color="#333333" size={20} />
            <Text style={styles.label}> Phone:</Text>
            <TextInput style={styles.input} value={phone} onChangeText={setPhone} />
          </View>

          <View style={styles.field}>
            <FontAwesome name="table" color="#333333" size={20} />
            <Text style={styles.label}> birth Date:</Text>
            <TextInput style={styles.input} value={birthDate} onChangeText={setBirthDate}
            />

          </View>



          <View style={styles.containerButton}><TouchableOpacity style={styles.logoutEdit} onPress={handleSave}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity></View>

        </>
      )} */}


      {/* <View style={styles.containerButton}><TouchableOpacity style={styles.logoutButton} onPress={handleLogOut}>
        <Text style={styles.buttonTextLoggout}>Logout</Text>
      </TouchableOpacity></View> */}

      <BottomNavigator item="profile" navigation={navigation} />
    </View>
  );
}
else{
  console.log(userLoggedIn)
  return(
    <View style={styles.container}>
      <View style={styles.welcomecontainer}>
        <Text style={styles.welcomeinput}> Welcome to AtoZ</Text>
        <View style={styles.pressableContainer}>
          <Pressable style={styles.pressable}>
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
          <Pressable style={styles.pressable}>
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
          <Text style={[styles.buttonText, { color: "#ffffff" }]} onPress={handleSignUp}>Register</Text>
        </Pressable>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText} onPress={handleLogin}>Login</Text>
        </Pressable>
      </View>

      <View style={styles.ordercontainer}>
        <Text style={[styles.welcomeinput, { fontWeight: "normal" }]}>My Orders</Text>
        <Text style={[styles.SeeAll, { fontWeight: "normal" }]}>See All</Text>

      <View style={styles.pressableContainer}>
          <Pressable style={styles.pressable}>
            <View style={styles.row}>
            <Entypo name="star-outlined" size={35} color="black" />
              <Text style={styles.text}> Reviews </Text>
            </View>
          </Pressable>
          <Pressable style={styles.pressable}>
            <View style={styles.row}>
            <Fontisto name="shopping-bag-1" size={35} color="black" />
              <Text style={styles.text}> Orders </Text>
            </View>
          </Pressable>
          <Pressable style={styles.pressable}>
            <View style={styles.row}>
            <MaterialCommunityIcons name="newspaper-variant-outline" size={35} color="black" />  
            <Text style={styles.text}> Reports </Text>
            </View>
          </Pressable>
          
        </View>
        </View>

     

      <BottomNavigator item="profile" navigation={navigation} />
    </View>

  );
}
}


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
    marginLeft:10,
    position: 'absolute', 
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
  logoutEdit: {
    flex: 1,
    backgroundColor: "#131A2C",
    borderRadius: 35,
    padding: 5,
    width: "100%",
    height: 40,
    alignItems: "center",
    margin: 5,
    // marginVertical: 0,
    // marginBottom:50,
  },
  logoutButton: {
    flex: 1,
    backgroundColor: "#FFDE9B",
    borderRadius: 35,
    padding: 5,
    width: "100%",
    height: 45,
    alignItems: "center",
    //marginTop:10,
    //marginVertical: 10
    margin: 5,
  },
  buttonText: {
    color: "#FFDE9B",
    fontSize: 16,
    fontWeight: "bold",
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
    width: 380,
    height: 145,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    alignSelf: "flex-start",
    marginTop: 5,
    marginLeft: 5,
    marginRight: 10,
    borderStyle:'solid',
    borderColor:'black',
    borderWidth: 0.5,
    position: 'relative',
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
    textAlign:"right",
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
    width: 185,
    height:40,
    borderWidth: 1,
    borderColor: "black",
    textAlign: "center",
  },
  buttonText: {
    color: "#000",
    fontSize: 20,
    textAlign: "center",
  },
  ordercontainer: {
    backgroundColor: "#ffffff",
    width: 380,
    height: 145,
    justifyContent: "center",
    alignItems: "flex-start",
    alignSelf: "flex-start",
    marginTop: 10,
    marginLeft: 5,
    marginRight: 10,
    borderStyle:'solid',
    borderColor:'black',
    borderWidth: 0.5,
  },
  SeeAll:{
    flex: 1,
    alignSelf: "flex-end",
    color: "black",
    marginRight: 15,
    paddingTop:0,
    marginTop: -40,
    fontSize: 16,
    textDecorationLine:'underline',
  },
  offer:{
    marginTop: 10,
    marginLeft: 5,
    marginRight: 10,
    borderStyle:'solid',
    borderColor:'black',
    borderWidth: 0.5,
  },
  logoutButton: {
    backgroundColor: '#f00', // لون الزرار
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 20,
},
logoutButtonText: {
    color: '#fff', // لون نص الزرار
    fontSize: 18,
    fontWeight: 'bold',
},
pencil:{
  position: 'absolute',
  top: 15, 
  // left: 200,
  right:15,


},
});
export default profile;
