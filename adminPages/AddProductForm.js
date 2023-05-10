
import { View, Text, TextInput,FlatList, TouchableOpacity, Image, StyleSheet, ScrollView,Dimensions, Pressable ,CheckBox} from 'react-native';

import  { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
//import { ref, uploadBytes } from 'firebase/storage';
import { getDownloadURL, getStorage, ref, uploadBytes ,uploadBytesResumable,child} from "firebase/storage";
import { db, storage } from '../firebase';
//import { View, Text, FlatList, TouchableOpacity, StyleSheet,TextInput,CheckBox } from 'react-native';
const AddProductForm = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Upload image to Storage
    const imageRef = ref(storage, image.name);
    await uploadBytes(imageRef, image);
    //const imageUrl = await imageRef.getDownloadURL();
    const imageUrl = await getDownloadURL(imageRef);

    // Add product document to Firestore
       if (selectedItem.id === 1) {
      await addDoc(collection(db, 'pizza'), {
        name: name,
        description: description,
        imageUrl: imageUrl,
      });
      console.log("hi");
    }else if (selectedItem.id === 2) {
      await addDoc(collection(db, 'burger'), {
        name: name,
        description: description,
        imageUrl: imageUrl,
      });
    }
    else if (selectedItem.id === 3) {
      await addDoc(collection(db, 'coffee'), {
        name: name,
        description: description,
        imageUrl: imageUrl,
      });
    }else {
      await addDoc(collection(db, 'offer'), {
        name: name,
        description: description,
        imageUrl: imageUrl,
      });
    
    }

    setName('');
    setDescription('');
    setImage(null);
  };

  const handleImageUpload = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const menuItems = [
    { id: 1, label: 'Pizza' },
    { id: 2, label: 'Burger' },
    { id: 3, label: 'Coffee' },
    { id: 4, label: 'Offer' },
  ];

  const handlePress = async(item) => {
    setSelectedItem(item);
   
  };


  // const renderItem = ({ item }) => (
  //   <TouchableOpacity onPress={() => handlePress(item)}>
  //     <Text>{item.label}</Text>
  //   </TouchableOpacity>
  // );
  const renderItem = ({ item }) => {
    const isSelected = selectedItem && selectedItem.id === item.id;
    // <TouchableOpacity onPress={() => handlePress(item)}>
    //   <Text>{item.label}</Text>
    // </TouchableOpacity>
    return(
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <CheckBox
          value={isSelected}
          onPress={() => handlePress(item)}
          onValueChange={() => setSelectedItem(item)
          }
        />
        <Text>{item.label}</Text>
      </View>
    );
  };

//   return (
//     <form onSubmit={handleSubmit}>
//       <div>
//         <label htmlFor="name">Product Name:</label>
//         <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
//       </div>
//       <div>
//         <label htmlFor="description">Description:</label>
//         <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
//       </div>
//       <div>
//         <label htmlFor="image">Image:</label>
//         <input type="file" id="image" onChange={handleImageUpload} />
//       </div>
//       <div>
          
//        <View >
//          <FlatList
//           data={menuItems}
//           renderItem={renderItem}
//           keyExtractor={(item) => item.id.toString()}
//         />
//         {selectedItem && (
//           <Text>You selected {selectedItem.label}</Text>
//         )}
//       </View>
//       </div>
//       <button type="submit">Add Product</button>
//     </form>
//   );
// };

return (
  <View style={styles.container}>
      <View style={styles.form}>
  {/* <form onSubmit={handleSubmit}> */}
  <View style={styles.inputContainer}>
          <Text style={styles.label}>Product Name:</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description:</Text>
          <TextInput style={[styles.input, styles.textArea]} value={description} onChangeText={setDescription} multiline={true} />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Image:</Text>
        
            {/* <Text style={styles.fileInputText}>Choose File</Text> */}
            <label htmlFor="image">Image:</label>
        <input type="file" id="image" onChange={handleImageUpload} />
        </View>
        <View style={styles.menuContainer}>
        <FlatList
    
        data={menuItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
      {selectedItem && (
        <Text>You selected {selectedItem.label}</Text>
      )}
    </View >
   <TouchableOpacity Style={styles.button}>
    <button type="submit" color='#FBFAFF' fontSize="20">Add Product</button>
    {/* <Text Style={styles.buttonText} >
    Add Product
    </Text> */}
</TouchableOpacity>
  </View>
  </View>
);
};


export default AddProductForm;



const styles = StyleSheet.create({
  container: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#F5F5F5',
  paddingHorizontal: 20,
  },
  form: {
  width: '100%',
  backgroundColor: '#FFF',
  paddingVertical: 20,
  paddingHorizontal: 15,
  borderRadius: 10,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
  },
  inputContainer: {
  marginBottom: 10,
  },
  label: {
  fontSize: 16,
  fontWeight: 'bold',
  marginBottom: 5,
  },
  input: {
  borderWidth: 1,
  borderColor: '#CCC',
  borderRadius: 5,
  paddingHorizontal: 10,
  paddingVertical: 8,
  fontSize: 16,
  },
  button: {
  backgroundColor: '#000',
  borderRadius: 5,
  paddingHorizontal: 20,
  paddingVertical: 10,
  alignItems: 'center',
  marginTop: 10,
  backgroundColor: "#FBFAFF",
  },
  buttonText: {
  color: '#FFF',
  fontSize: 18,
  fontWeight: 'bold',
  },
  imageContainer: {
  alignItems: 'center',
  marginBottom: 10,
  },
  imagePreview: {
  width: 200,
  height: 200,
  borderRadius: 5,
  marginBottom: 5,
  },
  listContainer: {
  marginTop: 20,
  },
  listItem: {
  padding: 10,
  borderWidth: 1,
  borderColor: '#CCC',
  borderRadius: 5,
  marginBottom: 10,
  },
  selectedItem: {
  backgroundColor: '#000',
  color: '#FFF',
  },
  menuContainer:{
    flex: 1,
    padding: 20,
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
bottoms: {
  flexDirection: "row",
  backgroundColor: "#FBFAFF",
  height: 30,
  bottom: 20
},
});







// import { useState } from 'react';
// import { collection, addDoc } from 'firebase/firestore';
// import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
// import { db, storage } from '../firebase';
// import { View, Text, FlatList, TouchableOpacity, StyleSheet,TextInput } from 'react-native';

// const AddProductForm = () => {
//   const [name, setName] = useState('');
//   const [description, setDescription] = useState('');
//   const [image, setImage] = useState(null);
//   const [selectedItem, setSelectedItem] = useState(null);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const imageRef = ref(storage,  image.name);
//     await uploadBytes(imageRef, image);
//     const imageUrl = await getDownloadURL(imageRef);

//     if (selectedItem.id === 1) {
//       await addDoc(collection(db, 'pizza'), {
//         name: name,
//         description: description,
//         imageUrl: imageUrl,
//       });
//       console.log("hi");
//     }else if (selectedItem.id === 2) {
//       await addDoc(collection(db, 'burger'), {
//         name: name,
//         description: description,
//         imageUrl: imageUrl,
//       });
//     }
//     else if (selectedItem.id === 3) {
//       await addDoc(collection(db, 'coffee'), {
//         name: name,
//         description: description,
//         imageUrl: imageUrl,
//       });
//     }else {
//       await addDoc(collection(db, 'offer'), {
//         name: name,
//         description: description,
//         imageUrl: imageUrl,
//       });
    
//     }

//     setName('');
//     setDescription('');
//     setImage(null);
//   };

//   const handleImageUpload = (e) => {
//     if (e.target.files[0]) {
//       setImage(e.target.files[0]);
//     }
//   };

//   const menuItems = [
//     { id: 1, label: 'Pizza' },
//     { id: 2, label: 'Burger' },
//     { id: 3, label: 'Coffee' },
//     { id: 3, label: 'Offer' },
//   ];

//   const handlePress = async(item) => {
//     setSelectedItem(item);
   
//   };


//   const renderItem = ({ item }) => (
//     <TouchableOpacity onPress={() => handlePress(item)}>
//       <Text>{item.label}</Text>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       <View style={styles.form}>
//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>Product Name:</Text>
//           <TextInput style={styles.input} value={name} onChangeText={setName} />
//         </View>
//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>Description:</Text>
//           <TextInput style={[styles.input, styles.textArea]} value={description} onChangeText={setDescription} multiline={true} />
//         </View>
//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>Image:</Text>
//           <TouchableOpacity style={styles.fileInput} onPress={handleImageUpload}>
//             <Text style={styles.fileInputText}>Choose File</Text>
//           </TouchableOpacity>
//         </View>
//         <View style={styles.menuContainer}>
//         <FlatList
//           data={menuItems}
//           renderItem={renderItem}
//           keyExtractor={(item) => item.id.toString()}
//         />
//         {selectedItem && (
//           <Text>You selected {selectedItem.label}</Text>
//         )}
//       </View>
//         <View style={styles.buttonContainer}>
//           <TouchableOpacity style={styles.button} onPress={handleSubmit}>
//             <Text style={styles.buttonText}>Add Product</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
    
//     </View>
//   );
// };
// const styles = StyleSheet.create({
//   container: {
//   flex: 1,
//   alignItems: 'center',
//   justifyContent: 'center',
//   backgroundColor: '#F5F5F5',
//   paddingHorizontal: 20,
//   },
//   form: {
//   width: '100%',
//   backgroundColor: '#FFF',
//   paddingVertical: 20,
//   paddingHorizontal: 15,
//   borderRadius: 10,
//   shadowColor: '#000',
//   shadowOffset: { width: 0, height: 2 },
//   shadowOpacity: 0.25,
//   shadowRadius: 3.84,
//   elevation: 5,
//   },
//   inputContainer: {
//   marginBottom: 10,
//   },
//   label: {
//   fontSize: 16,
//   fontWeight: 'bold',
//   marginBottom: 5,
//   },
//   input: {
//   borderWidth: 1,
//   borderColor: '#CCC',
//   borderRadius: 5,
//   paddingHorizontal: 10,
//   paddingVertical: 8,
//   fontSize: 16,
//   },
//   button: {
//   backgroundColor: '#000',
//   borderRadius: 5,
//   paddingHorizontal: 20,
//   paddingVertical: 10,
//   alignItems: 'center',
//   marginTop: 10,
//   },
//   buttonText: {
//   color: '#FFF',
//   fontSize: 18,
//   fontWeight: 'bold',
//   },
//   imageContainer: {
//   alignItems: 'center',
//   marginBottom: 10,
//   },
//   imagePreview: {
//   width: 200,
//   height: 200,
//   borderRadius: 5,
//   marginBottom: 5,
//   },
//   listContainer: {
//   marginTop: 20,
//   },
//   listItem: {
//   padding: 10,
//   borderWidth: 1,
//   borderColor: '#CCC',
//   borderRadius: 5,
//   marginBottom: 10,
//   },
//   selectedItem: {
//   backgroundColor: '#000',
//   color: '#FFF',
//   },
//   });


// export default AddProductForm;
