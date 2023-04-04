import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import auth from '../firebase'
const ProfileScreen = ({ navigation }) => {
  const handleLogout = () => {
    navigation.navigate('Home');
  };
  return (
    <View style={styles.container}>
      <Image
        style={styles.profileImage}
        source={{ uri: 'https://randomuser.me/api/portraits/women/68.jpg' }}
      />
      <Text style={styles.username}>{auth.currentUser?.email}</Text>
  
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
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
    backgroundColor: 'black',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  username: {
    marginTop: 20,
    fontSize: 20,
    color: 'orange',
  },
  changePasswordButton: {
    marginTop: 20,
    backgroundColor: '#FF6D00',
    padding: 10,
    borderRadius: 5,
  },
  logoutButton: {
    marginTop: 10,
    backgroundColor: '#FF6D00',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
export default ProfileScreen;