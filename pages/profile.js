import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet ,input} from 'react-native';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile } from "firebase/auth";
import auth from '../firebase';
import  { useState ,useEffect} from 'react';
import { upload ,useAuth} from '../firebase';
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";


const profile = ({ navigation }) => {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const currentUser = useAuth();
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [photoURL, setPhotoURL] = useState('../assets/defalt.jpg');

  const handleLogOut = () => {
    signOut(auth)
      .then(() => {
        setUserLoggedIn(false);
        navigation.navigate('Home')
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
  useEffect(() => {
    if (currentUser?.photoURL) {
      setPhotoURL(currentUser.photoURL);
    }
  }, [currentUser])





  return (
    <View style={styles.container}>
      <Image
        style={styles.profileImage}
        source={photoURL}
    
      />
      <Text style={styles.username}>{auth.currentUser?.email}</Text>

     <input type="file" onChange={handleChange} />

     {/* <TouchableOpacity style={styles.logoutButton}disabled={loading || !photo}
     onPress={handleClick}>
        <Text style={styles.buttonText}>Upload</Text>
      </TouchableOpacity> */}

     <button  disabled={loading || !photo} onClick={handleClick}>Upload</button>
     
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogOut}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
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
  username: {
    marginTop: 20,
    fontSize: 20,
    color: '67738B',
  },
 
  logoutButton: {
    marginTop: 10,
    backgroundColor: '#131A2C',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFDE9B',
    fontWeight: 'bold',
  },
});
export default profile;