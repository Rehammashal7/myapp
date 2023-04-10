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
  return (
    <View style={styles.container}>
      <Image
        style={styles.profileImage}
        source={{ uri: 'https://randomuser.me/api/portraits/women/68.jpg' }}
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
  },
  username: {
    marginTop: 20,
    fontSize: 20,
    color: 'black',
  },
 
  logoutButton: {
    marginTop: 10,
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
export default ProfileScreen;