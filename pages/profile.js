import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { signOut } from "firebase/auth";
import auth from '../firebase';
import  { useState } from 'react';

const ProfileScreen = ({ navigation }) => {
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  const handleLogOut = () => {
    signOut(auth)
      .then(() => {
        setUserLoggedIn(false);
        navigation.navigate('Home')
      })
      .catch((error) => console.log(error));
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