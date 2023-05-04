// import React from 'react';
// import { View, Text, Image, TouchableOpacity, StyleSheet ,input} from 'react-native';
// import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile } from "firebase/auth";
// import{ auth} from '../firebase';
// import  { useState ,useEffect} from 'react';
// import { upload ,useAuth} from '../firebase';
// import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";


// const profile = ({ navigation }) => {
//   const [userLoggedIn, setUserLoggedIn] = useState(false);
//   const currentUser = useAuth();
//   const [photo, setPhoto] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [photoURL, setPhotoURL] = useState('https://as1.ftcdn.net/v2/jpg/03/46/83/96/1000_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg');

//   const handleLogOut = () => {
//     signOut(auth)
//       .then(() => {
//         setUserLoggedIn(false);
//         navigation.navigate('Home')
//       })
//       .catch((error) => console.log(error));
//   };
//   function handleChange(e) {
//     if (e.target.files[0]) {
//       setPhoto(e.target.files[0])
//     }
//   };
//   function handleClick() {
//     upload(photo, currentUser, setLoading);
//   };
//   useEffect(() => {
//     if (currentUser?.photoURL) {
//       setPhotoURL(currentUser.photoURL);
//     }
//   }, [currentUser])





//   return (
//     <View style={styles.container}>
//       <Image
//         style={styles.profileImage}
//         source={photoURL}
    
//       />
//       <Text style={styles.username}>{auth.currentUser?.email}</Text>

//      <input type="file" onChange={handleChange} />

//      {/* <TouchableOpacity style={styles.logoutButton}disabled={loading || !photo}
//      onPress={handleClick}>
//         <Text style={styles.buttonText}>Upload</Text>
//       </TouchableOpacity> */}

//      <button  disabled={loading || !photo} onClick={handleClick}>Upload</button>
     
//       <TouchableOpacity style={styles.logoutButton} onPress={handleLogOut}>
//         <Text style={styles.buttonText}>Logout</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: 'white',
//   },
//   profileImage: {
//     width: 150,
//     height: 150,
//     borderRadius: 75,
//     verticalAlign: 'middle',
//     borderRadius: '50%',
//     borderWidth: '5px',
//     borderColor: 'gray',
//     borderStyle: 'outset',
//   },
//   username: {
//     marginTop: 20,
//     fontSize: 20,
//     color: '67738B',
//   },
 
//   logoutButton: {
//     marginTop: 10,
//     backgroundColor: '#131A2C',
//     padding: 10,
//     borderRadius: 5,
//   },
//   buttonText: {
//     color: '#FFDE9B',
//     fontWeight: 'bold',
//   },
// });
// export default profile;


import { getAuth, onAuthStateChanged, signOut, updateProfile } from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import React, { useState ,useEffect} from 'react';
import { View, Text, TextInput, Button, StyleSheet , Image, TouchableOpacity ,Pressable ,input} from 'react-native';
//import { upload ,useAuth} from '../firebase';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/FontAwesome';
import { doc, updateDoc ,getDoc } from "firebase/firestore";
import { auth , db , storage}  from '../firebase';


const Profile = ({navigation}) => {
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
        navigation.navigate('Welcome')
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
        source={photoURL}
    
      />
     {/* <Feather name="file" color="#333333" size={20} />
     <input type="file" onChange={handleChange} /> */}

{/* 
     <button  disabled={loading || !photo} onClick={handleClick}>Upload</button>
      */}
    </View>


    



      {mode === 'view' && (
        <>
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

          <View style={styles.field}>
          <FontAwesome name="table" color="#333333" size={20} />
            <Text style={styles.label}> birth Date:</Text>
            <Text style={styles.value2} >{birthDate}
            </Text>
          </View>
          <View style={styles.containerButton}><TouchableOpacity style={styles.logoutEdit} onPress={handleEdit}>
        <Text style={styles.buttonText}>Edit</Text>
      </TouchableOpacity></View>
          
          {/* <Button  title="Edit" onPress={handleEdit} /> */}
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

          <View style={styles.field}>
          <FontAwesome name="table" color="#333333" size={20} />
            <Text style={styles.label}> birth Date:</Text>
            <TextInput style={styles.input} value={birthDate} onChangeText={setBirthDate} 
            />
          </View>
          <View style={styles.containerButton}><TouchableOpacity style={styles.logoutEdit} onPress={handleSave}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity></View>
          
          {/* <Button title="Save" onPress={handleSave} /> */}
        </>
      )}


<View style={styles.containerButton}><TouchableOpacity style={styles.logoutButton} onPress={handleLogOut}>
        <Text style={styles.buttonTextLoggout}>Logout</Text>
      </TouchableOpacity></View>


      <View style={styles.NavContainer} >
               <View style={styles.Navbar} >
                   <Pressable onPress={() => navigation.navigate("Favorite")} style={styles.iconBehave} >
                       <Icon name="heart" size={30} color='gray' />
                   </Pressable>
                   <Pressable onPress={() => navigation.navigate("profile")} style={styles.iconBehave}>
                       <Icon name="user" size={30} color='#FFDE9B' />
                   </Pressable>
                   <Pressable onPress={() => navigation.navigate("Home")} style={styles.iconBehave} >
                       <Icon name="home" size={30} color='gray' />
                   </Pressable>
               </View>
           </View>
    </View>

    
    
  );
};

const styles = StyleSheet.create({
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
    verticalAlign: 'middle',
    borderRadius: '50%',
    borderWidth: '5px',
    borderColor: 'gray',
    borderStyle: 'outset',
  },
  containerButton:{
    // display: flex,
    flexDirection: 'row',
  //  flex:1,
  //   alignItems: 'center',
  //margin:3,
    justifyContent: 'space-between',
  },
    logoutEdit: {
      flex:1,
    backgroundColor: '#131A2C',
    borderRadius: 35,
    padding: 5,
    width: '100%',
    height: 40,
    alignItems: 'center',
    margin:5,
   // marginVertical: 0,
   // marginBottom:50,
  },
  logoutButton: {
    flex:1,
    backgroundColor: '#FFDE9B',
    borderRadius: 35,
    padding: 5,
    width: '100%',
    height: 40,
    alignItems: 'center',
    //marginTop:10,
    //marginVertical: 10
    margin:5,
  },
  buttonText: {
    color: '#FFDE9B',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonTextLoggout: {
    color: '#131A2C',
    fontSize: 16,
    fontWeight: 'bold',
  },
  NavContainer: {
    position:'absolute',
    alignItems:'center',
    bottom:10,
    padding:10,
   
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
 },
 Navbar: {
    flexDirection: 'row',
    backgroundColor:'#131A2C',
    width:350,
    justifyContent:'space-evenly',
    borderRadius:40,
    height:50
    
 },
 iconBehave:{
    padding:44,
    bottom:35
 },

});
export default Profile;