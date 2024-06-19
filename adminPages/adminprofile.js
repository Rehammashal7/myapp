
import { getAuth, onAuthStateChanged, signOut, updateProfile } from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import React, { useState ,useEffect} from 'react';
import { View, Text, TextInput, Button, StyleSheet , Image, TouchableOpacity ,Pressable ,input,Dimensions,TouchableWithoutFeedback} from 'react-native';
//import { upload ,useAuth} from '../firebase';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/FontAwesome';
import { doc, updateDoc ,getDoc } from "firebase/firestore";
import { auth , db , storage}  from '../firebase';
import COLORS from "../Consts/Color";
import BottomNavigator from '../components/adminbar';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get("screen");
const { height } = Dimensions.get("screen");

const adminProfile = ({navigation}) => {
  const currentUser = useAuth();
    const [fristName, setFristName] = useState('');
    const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [mode, setMode] = useState('view');
  const [birthDate, setBirthDate] = useState('');
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [photoURL, setPhotoURL] = useState('https://as1.ftcdn.net/v2/jpg/03/46/83/96/1000_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg');

  
  const handleLogOut = () => {
    signOut(auth)
      .then(() => {
        setUserLoggedIn(false);
        navigation.navigate('Login')
      })
      .catch((error) => console.log(error));
  };
  function handleChange(e) {
    if (e.target.files[0]) {
      setPhoto(e.target.files[0])
    }
  };


  function handleClick() {
    upload(photo, currentUser, setLoading);
  };
  

  



  const handleSave = () => {
    // TODO: Call backend API to save changes
    setMode('view');
    UpdateUserData();
    if(loading || !photo) 
    {// disable
    }else{handleClick();}
      
  };

  const handleEdit = () => {
    setMode('edit');
    handleChange();
    
  };

  // const handleadd = () => {
  //   setMode('edit');
  //   handleChange();
    
  // };


  const handleusers = () => {
    navigation.navigate("userr");
  };
  const handleadmin = () => {
    navigation.navigate("addadmin");
  };
  const getUser = async() => {
    const docRef = doc(db, "users", auth.currentUser.uid);
const docSnap = await getDoc(docRef);

if (docSnap.exists()) {
  console.log("Document data:", docSnap.data());
  const data =docSnap.data();
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

  const UpdateUserData=async()=>{
    const washingtonRef = doc(db, "users", auth.currentUser.uid);

    // Set the "capital" field of the city 'DC'
    await updateDoc(washingtonRef, {
      fName:fristName,
      lName:lastName,
      phone:phone,
      birthDate:birthDate,
    });

  };

  useEffect(() => {
    if (currentUser?.photoURL) {
      setPhotoURL(currentUser.photoURL);
    }
  }, [currentUser]);

  function useAuth() {
    const [currentUser, setCurrentUser] = useState('');
  
    useEffect(() => {
      const unsub = onAuthStateChanged(auth, user => setCurrentUser(user));
      return unsub;
    }, [])
  

  




    return currentUser;
  }

  async function upload(file, currentUser, setLoading) {
    const storage = getStorage();

    const fileRef = ref(storage,currentUser.uid + '.png');
  
    setLoading(true);
    
    const snapshot = await uploadBytes(fileRef, file);
    const photoURL = await getDownloadURL(fileRef);
  
    updateProfile(currentUser, {photoURL});
    
    setLoading(false);
    alert("Uploaded file!");
  };
  



  {mode==="view"? getUser():null}
 
  return (
  <View style={styles.container}>

    <View  >
      <Image
        style={styles.profileImage}
        // source={photoURL}
         source={{ uri: photoURL }}
          resizeMode="cover"
    
      />
     {/* <Feather name="file" color="#333333" size={20} />
     <input type="file" onChange={handleChange} /> */}

{/* 
     <button  disabled={loading || !photo} onClick={handleClick}>Upload</button>
      */}
    </View>

      {mode === 'view' && (
        <>

<TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <Text style={styles.buttonTextt}>Edit</Text>
            <FontAwesome name="edit" color="black" size={20} />
          </TouchableOpacity>

       

          <View style={styles.field}>
          <FontAwesome name="user-o" color="#333333" size={20}  />
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

          {/* <View style={styles.field}>
          <FontAwesome name="table" color="#333333" size={20} />
            <Text style={styles.label}> birth Date:</Text>
            <Text style={styles.value2} >{birthDate}
            </Text>
          </View> */}

<TouchableOpacity onPress={handleusers}>
            <View style={styles.aboutuscontainer}>
              <MaterialIcons name="group" size={30} color="black" />
              <View style={styles.textAndArrowContainer}>
              <Text style={styles.abouttext}>Users</Text>
              <View>
                <MaterialIcons name="keyboard-arrow-right" size={25} color="black"  />
              </View>
              </View>
            </View>
          </TouchableOpacity >

          <TouchableOpacity onPress={handleadmin}>
            <View style={styles.aboutuscontainer}>
              <MaterialIcons name="person-add" size={25} color="black" />
              <View style={styles.textAndArrowContainer}>
              <Text style={styles.abouttext}>Add Admin</Text>
              <View>
                <MaterialIcons name="keyboard-arrow-right" size={30} color="black"  />
              </View>
              </View>
            </View>
          </TouchableOpacity >


       
                </>
      )}

      {mode === 'edit' && (
        <>
        <View style={styles.field}>
        <Feather name="file" color="#333333" size={20} />
       <input type="file" onChange={handleChange} />
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

          {/* <View style={styles.field}>
          <FontAwesome name="table" color="#333333" size={20} />
            <Text style={styles.label}> birth Date:</Text>
            <TextInput style={styles.input} value={birthDate} onChangeText={setBirthDate} 
            />
          </View> */}
          <View style={styles.buttonsRow}>
         
          <TouchableOpacity style={styles.logoutEdit} onPress={handleSave}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
       </View>

          {/* <Button title="Save" onPress={handleSave} /> */}
        </>
      )}


<View style={styles.containerButton}><TouchableOpacity style={styles.logoutButton} onPress={handleLogOut}>
        <Text style={styles.buttonTextLoggout}>Logout</Text>
      </TouchableOpacity></View>        

      <BottomNavigator item="adminprofile" navigation={navigation} />
    
    </View>

    
    
  );
};

const styles = StyleSheet.create({
  editButton: {
    //position: 'absolute',
    //top: 20,
    //right: 20,
    flexDirection: 'row',
    //backgroundColor: 'black',
    justifyContent: 'flex-end',
    paddingVertical: 2,
    //paddingHorizontal: 20,
    //borderRadius: 5,
    alignItems: 'center',
  }
  ,  buttonTextt: {
    color: 'black',
    fontWeight: 'bold',
    fontSize:15,
    textDecorationLine: 'underline',
    marginRight: 5,
  },

  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    //alignItems: 'flex-start',
     marginTop: 20,
     paddingRight: 0,
      // width: '100%',
   // width: Dimensions.get("window").width,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FBFAFF' ,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  field: {
   
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5,
  },
  label: {
    flex: 1,
    fontWeight: 'bold',
   Color: '#131A2C',
  },
  
  value: {
    flex: 2,
    color:'#FFDE9B',
  },
  value2: {
    flex: 2,
    color:'#67788B',
  },
  input: {
    flex: 2,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 8,
  },
    profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
   // verticalAlign: 'middle',
    //borderRadius: '50%',
   // borderWidth: '5px',
   // borderColor: 'gray',
   // borderStyle: 'outset',
  },
  aboutuscontainer: {
    flexDirection: "row",
    width: width - 10,
    height: height / 18,
    alignItems: "center",
    marginLeft: 1,
    marginTop: 8,
    backgroundColor: "#FBFAFF",
    borderStyle: "solid",
    borderColor: "black",
    // borderWidth: 0.5,
  },
  abouttext: {
    fontSize: 15,
    marginLeft: 10,


  },
  textAndArrowContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 5,
    marginRight:8
  },
  containerButton:{
  //   // display: flex,
  //   flexDirection: 'row',
  // //  flex:1,
  //    alignItems: 'center',
  // //margin:3,
  //   justifyContent: 'space-between',
  
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingHorizontal: 2, 
    marginTop: 10,

  },
    // logoutEdit:{
    //   backgroundColor: 'black',
    //   paddingVertical: 10,
    //   paddingHorizontal: 20,
    //  // marginHorizontal: 15,
    //   borderRadius: 5,
    //   alignItems: 'center'
    // },
    logoutEdit: {
      backgroundColor: COLORS.dark,
      
      padding: 10,
      width: '100%',
      alignItems: 'center',
      marginTop: 10,
    },
    logoutadd:{
      backgroundColor: 'black',
      paddingVertical: 10,
      paddingHorizontal: 20,
      marginHorizontal: 5, 
      borderRadius: 5,
      alignItems: 'center',
    },

  logoutButton: {
     width: '100%',
    //width: 380,
    //marginLeft: 5,
    backgroundColor: "black",
    padding: 10,
    marginTop: 10,
    alignItems: "center",
   
  },
//   logoutButton: {
//     width: '100%',
//     backgroundColor: "black",
//     paddingVertical: 10,
//    alignItems: "center",
//  // justifyContent: 'center', 
//     borderRadius: 5,
//   },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  buttonTextLoggout: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  NavContainer: {
    position: 'absolute',
    alignItems: 'center',
    bottom: 5,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
},
Navbar: {
    flexDirection: 'row',
    backgroundColor: COLORS.darkblue,
    width: 370,
    justifyContent: 'space-evenly',
    borderRadius: 30,
    height: 40

},
iconBehave: {
    padding: 35,
    bottom: 30
},
});
export default adminProfile;

