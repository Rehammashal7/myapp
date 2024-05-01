import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Import your Firebase configuration

const WaitingItemDetailScreen = ({ route }) => {
  const { item } = route.params;
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        // Fetch the user document from Firestore based on the userId
        const userDocRef = doc(db, 'users', item.userId);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          // Extract the first name and last name from the user document
          const userData = userDocSnapshot.data();
          const { fName, lName } = userData;

          // Construct the full name
          const fullName = `${fName} ${lName}`;

          // Set the full name in the state
          setUserName(fullName);
        } else {
          console.log('User document not found');
          setUserName('Unknown'); // Set a default name if user not found
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    // Call the fetchUserName function when component mounts
    fetchUserName();
  }, [item.userId]); // Re-run effect when userId changes

 


  return (
    <View style={styles.container}>
      <Text style={styles.userInfo}>User: {userName || 'Loading...'}</Text>
      <Text style={styles.orderInfo}>Ordered At: {item.timestamp.toDate().toLocaleString()}</Text>
      <Image source={{ uri: item.imageUrl[0] }} style={styles.image} />
      <Text style={styles.productName}>Product: {item.name}</Text>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  userInfo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  orderInfo: {
    fontSize: 16,
    marginBottom: 10,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    marginBottom: 20,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  markAsDoneButton: {
    backgroundColor: 'black',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  markAsDoneText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default WaitingItemDetailScreen;
