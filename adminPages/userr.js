import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'; // Import Firestore functions
import { db } from "../firebase";

const userr = () => {
  const [users, setUsers] = useState([]);

  const getUserData = async () => {
    try {
      const usersRef = collection(db, "users");
      const snapshot = await getDocs(usersRef);
      const userData = [];

      snapshot.forEach((doc) => {
        const user = { id: doc.id, ...doc.data() };

        if ('fName' in user || 'lName' in user) {
          user.name = `${user.fName} ${user.lName}`;
        }
        userData.push(user);
        setUsers((prevUsers) => [...prevUsers, user]);
      });

      setUsers(userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  
  useEffect(() => {
    getUserData();
  }, []);

  const handleDeleteUser = async (userID) => {
    try {
      await deleteDoc(doc(db, "users", userID)); // Delete the user document from Firebase
      setUsers(users.filter(user => user.id !== userID)); // Remove the user from the local state
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
     
      <Text style={styles.title}>User List</Text>
      {users.map((user) => (
        <View key={user.id} style={styles.userContainer}>
          <View style={styles.userInfo}>
          <View style={styles.nameContainer}>
            <Text style={styles.userName}>{user.name}</Text>
            {user.isAdmin && <Text style={styles.adminText}>(admin)</Text>}
            </View>
            <Text style={styles.userEmail}>{user.email}</Text>
           
          </View>
          <TouchableOpacity onPress={() => handleDeleteUser(user.id)} style={styles.deleteButton}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
          
        </View>
      ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  userContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 5,
    padding: 15,
    marginBottom: 10,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16, 
    fontWeight: 'bold',
    color: '#333333',
  },
  userEmail: {
    fontSize: 14, 
    color: '#666666',
  },
  adminText: {
    fontSize: 12,
    color: '#888888',
    marginLeft: 8,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 8,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default userr;




// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet ,TouchableOpacity  } from 'react-native';
// import { collection, getDocs ,deleteDoc ,doc} from 'firebase/firestore';
// import { db } from "../firebase";
// import * as ImagePicker from 'expo-image-picker'; // Import ImagePicker


// const userr = () => {
//   const [users, setUsers] = useState([]);
//   const [deleteUserID, setDeleteUserID] = useState(null);
//   // const [photoURL, setPhotoURL] = useState(null); // State for profile image URL
//   // const [photo, setPhoto] = useState(null);

//   const getUserData = async () => {
//     try{
//     const usersRef = collection(db, "users"); // Assuming 'users' is your collection name
//     const snapshot = await getDocs(usersRef);
//     const userData = [];


//     snapshot.forEach((doc) => {
//       const user = { id: doc.id, ...doc.data() };

//       if ('fName' in user || 'lName' in user) {
//           user.name = `${user.fName} ${user.lName}`;
//       }
//       userData.push(user);
//       setUsers((prevUsers) => [...prevUsers, user]);
//     });



//     console.log("Fetched user data:", userData); 
//     setUsers(userData);
//   } catch (error) {
//     console.error("Error fetching user data:", error);
//   }
// };
  
//   useEffect(() => {
//     getUserData();
//   }, []);


//   // const handleChoosePhoto = async () => {
//   //   let result = await ImagePicker.launchImageLibraryAsync({
//   //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
//   //     allowsEditing: true,
//   //     aspect: [1, 1],
//   //     quality: 1,
//   //   });

//   //   if (!result.cancelled) {
//   //     setPhoto(result.uri);
//   //     setPhotoURL(result.uri);
//   //     // Update user profile with new photo URL
//   //     updateProfile(auth.currentUser, { photoURL: result.uri });
//   //   }
//   // };

//   // const handleDeleteUser = async (userID) => {
//   //   try {
//   //     await deleteDoc(doc(db, "users", userID)); // Delete the user document from Firebase
//   //     setUsers(users.filter(user => user.id !== userID)); // Remove the user from the local state
//   //   } catch (error) {
//   //     console.error("Error deleting user:", error);
//   //   }
//   // };
//   const handleDeleteUser = async (userID) => {
//     try {
//       console.log("Deleting user:", userID);
//       await deleteDoc(doc(db, "users", userID)); // Delete the user document from Firebase
//       console.log("User deleted successfully:", userID);
//       setUsers(users.filter(user => user.id !== userID)); // Remove the user from the local state
//       console.log("User removed from local state:", userID);
//     } catch (error) {
//       console.error("Error deleting user:", error);
//     }
//   };
  

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>User List</Text>
//       {users.map((user) => (
//   <View key={user.id} style={styles.userContainer}>
  
//     <Text style={styles.userName}>{user.name}</Text>
//     <Text style={styles.userEmail}>{user.email}</Text>
//     {/* <TouchableOpacity onPress={() => handleDeleteUser(user.id)}>
//             <Text style={styles.deleteButton}>Delete</Text>
//           </TouchableOpacity> */}
//           <Button
//             title="Delete"
//             color="red"
//             onPress={() => handleDeleteUser(user.id)}
//           />
//   </View>

// ))}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   deleteButton: {
//     color: 'red',
//     fontWeight: 'bold',
//     marginTop: 8,
//   },
//   profileImage: {
//     width: 150,
//     height: 150,
//     borderRadius: 75,
//     marginTop: 20,
//   },
//   userContainer: {
//     borderWidth: 2,
//     borderColor: '#000000',
//     borderRadius: 5,
//     padding: 40,
//     marginBottom: 20,
//   },
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: '#FFFFFF',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#333333',
//     marginBottom: 16,
//   },
//   // userContainer: {
//   //   marginBottom: 8,
//   // },
//   userName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333333',
//   },
//   userEmail: {
//     fontSize: 16,
//     color: '#666666',
//   },
// });

// export default userr;