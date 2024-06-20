import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { auth, db, storage } from '../firebase';
import COLORS from '../Consts/Color';
import { launchImageLibrary } from 'react-native-image-picker';

const Addclothes = () => {
  const [type, setType] = useState('');
  const [image, setImage] = useState(null);
  const [season, setSeason] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  const handleSubmit = async () => {
    if (!selectedItem) {
      console.log('Please select a category.');
      return;
    }

    if (!image) {
      console.log('Please upload an image.');
      return;
    }

    try {
      const imageRef = ref(storage, `images/${image.fileName}`);
      const response = await fetch(image.uri);
      const blob = await response.blob();
      const uploadTask = uploadBytesResumable(imageRef, blob);
      const downloadURL = await new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {},
          (error) => reject(error),
          () => getDownloadURL(uploadTask.snapshot.ref).then(resolve)
        );
      });

      const userUid = auth.currentUser.uid;
      const userRef = doc(db, 'users', userUid);

      await updateDoc(userRef, {
        clothes: arrayUnion({
          type: type,
          season: season,
          imageUrl: downloadURL,
          categoryName: selectedItem.label,
        }),
      });

      console.log('Product added successfully.');

      setType('');
      setSeason('');
      setImage(null);
      setSelectedItem(null);
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleImageUpload = () => {
    launchImageLibrary({ mediaType: 'photo', selectionLimit: 1 }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        setImage(response.assets[0]);
      }
    });
  };

  const handleRemoveImage = () => {
    setImage(null);
  };

  const menuItems = [
    { id: 1, label: 'BABY' },
    { id: 2, label: 'KIDS' },
    { id: 3, label: 'MEN' },
    { id: 4, label: 'WOMAN' },
  ];

  const handlePress = (item) => {
    setSelectedItem(item);
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Image:</Text>
            {image && (
              <View style={styles.imageContainer}>
                <Image source={{ uri: image.uri }} style={styles.imagePreview} />
                <TouchableOpacity onPress={handleRemoveImage}>
                  <Text style={styles.removeImageText}>Remove</Text>
                </TouchableOpacity>
              </View>
            )}
            {!image && (
              <TouchableOpacity style={styles.button} onPress={handleImageUpload}>
                <Text style={styles.buttonText}>Upload Image</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Type:</Text>
            <TextInput style={styles.input2} value={type} onChangeText={setType} />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Season:</Text>
            <TextInput style={styles.input2} value={season} onChangeText={setSeason} />
          </View>
          <View style={styles.checkboxContainer}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={selectedItem && selectedItem.id === item.id ? styles.selectedCategoryButton : styles.categoryButton}
                onPress={() => handlePress(item)}
              >
                <Text
                  style={[
                    styles.categoryLabel,
                    selectedItem && selectedItem.id === item.id && styles.selectedCategory,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Add Product</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

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
  input2: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#000',
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  imageContainer: {
    marginBottom: 10,
  },
  imagePreview: {
    width: 200,
    height: 200,
    borderRadius: 5,
    marginBottom: 5,
  },
  removeImageText: {
    color: 'red',
  },
  checkboxContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryButton: {
    borderColor: COLORS.grey,
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    margin: 5,
  },
  selectedCategoryButton: {
    backgroundColor: 'black',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    margin: 5,
  },
  categoryLabel: {
    fontSize: 16,
  },
  selectedCategory: {
    color: 'white',
  },
});

export default Addclothes;

























// import React, { useState } from 'react';
// import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
// import { collection, addDoc } from 'firebase/firestore';
// import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
// import { auth, db, storage } from "../firebase";
// import COLORS from '../Consts/Color';
// import { launchImageLibrary } from 'react-native-image-picker';

// const addclothes = () => {
//   const [type, setType] = useState('');
//   const [image, setImage] = useState(null);
//   const [season, setSeason] = useState('');
//   const [selectedItem, setSelectedItem] = useState(null);

//   const handleSubmit = async () => {
//     if (!selectedItem) {
//       console.log("Please select a category.");
//       return;
//     }

//     if (!image) {
//       console.log("Please upload an image.");
//       return;
//     }

//     const imageRef = ref(storage, `images/${image.fileName}`);
//     const response = await fetch(image.uri);
//     const blob = await response.blob();
//     const uploadTask = uploadBytesResumable(imageRef, blob);
//     const downloadURL = await new Promise((resolve, reject) => {
//       uploadTask.on('state_changed',
//         (snapshot) => { },
//         (error) => reject(error),
//         () => getDownloadURL(uploadTask.snapshot.ref).then(resolve)
//       );
//     });

//     const userUid = auth.currentUser.uid;
//     await addDoc(collection(db, "clothes"), {
//       uid: userUid,
//       type: type,
//       season: season,
//       imageUrl: downloadURL,
//       categoryName: selectedItem.label,
//     });

//     console.log("Product added successfully.");

//     setName('');
//     setType('');
//     setSeason('');
//     setImage(null);
//     setSelectedItem(null);
//   };

//   const handleImageUpload = () => {
//     launchImageLibrary({ mediaType: 'photo', selectionLimit: 1 }, (response) => {
//       if (response.didCancel) {
//         console.log('User cancelled image picker');
//       } else if (response.errorCode) {
//         console.log('ImagePicker Error: ', response.errorMessage);
//       } else {
//         setImage(response.assets[0]);
//       }
//     });
//   };

//   const handleRemoveImage = () => {
//     setImage(null);
//   };

  

  

//   const menuItems = [
//     { id: 1, label: 'BABY' },
//     { id: 2, label: 'KIDS' },
//     { id: 3, label: 'MEN' },
//     { id: 4, label: 'WOMAN' },
//   ];

//   const handlePress = (item) => {
//     setSelectedItem(item);
//   };

//   return (
//     <ScrollView>
//       <View style={styles.container}>
//         <View style={styles.form}>
          
          
          
        
//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>Image:</Text>
//             {image && (
//               <View style={styles.imageContainer}>
//                 <Image
//                   source={{ uri: image.uri }}
//                   style={styles.imagePreview}
//                 />
//                 <TouchableOpacity onPress={handleRemoveImage}>
//                   <Text style={styles.removeImageText}>Remove</Text>
//                 </TouchableOpacity>
//               </View>
//             )}
//             {!image && (
//               <TouchableOpacity style={styles.button} onPress={handleImageUpload}>
//                 <Text style={styles.buttonText}>Upload Image</Text>
//               </TouchableOpacity>
//             )}
//           </View>
//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>Type:</Text>
//             <TextInput style={styles.input2} value={type} onChangeText={setType} />
//           </View>
         
         
//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>Season:</Text>
//             <TextInput style={styles.input2} value={season} onChangeText={setSeason} />
//           </View>
//           <View style={styles.checkboxContainer}>
//             {menuItems.map((item) => (
//               <TouchableOpacity
//                 key={item.id}
//                 style={selectedItem && selectedItem.id === item.id ? styles.selectedCategoryButton : styles.categoryButton}
//                 onPress={() => handlePress(item)}
//               >
//                 <Text
//                   style={[
//                     styles.categoryLabel,
//                     selectedItem && selectedItem.id === item.id && styles.selectedCategory,
//                   ]}
//                 >
//                   {item.label}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//           <TouchableOpacity style={styles.button} onPress={handleSubmit}>
//             <Text style={styles.buttonText}>Add Product</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#F5F5F5',
//     paddingHorizontal: 20,
//   },
//   form: {
//     width: '100%',
//     backgroundColor: '#FFF',
//     paddingVertical: 20,
//     paddingHorizontal: 15,
//     borderRadius: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   inputContainer: {
//     marginBottom: 10,
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 5,
//   },
//   input2: {
//     borderWidth: 1,
//     borderColor: '#CCC',
//     borderRadius: 5,
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//     fontSize: 16,
//   },
//   textArea: {
//     height: 100,
//     textAlignVertical: 'top',
//   },
//   button: {
//     backgroundColor: '#000',
//     borderRadius: 5,
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   buttonText: {
//     color: '#FFF',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   imageContainer: {
//     marginBottom: 10,
//   },
//   imagePreview: {
//     width: 200,
//     height: 200,
//     borderRadius: 5,
//     marginBottom: 5,
//   },
//   removeImageText: {
//     color: 'red',
//   },
//   checkboxContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//   },
//   categoryButton: {
//     borderColor: COLORS.grey,
//     backgroundColor: 'white',
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 20,
//     margin: 5,
//   },
//   selectedCategoryButton: {
//     backgroundColor: 'black',
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 20,
//     margin: 5,
//   },
//   categoryLabel: {
//     fontSize: 16,
//   },
//   selectedCategory: {
//     color: 'white',
//   },
// });

// export default addclothes;
