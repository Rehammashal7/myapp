import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { auth, db, storage } from "../../firebase";
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import theme from '../../Consts/Color';
const COLORS =theme.LIGHT_COLORS;
const AddUserProduct = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [sizes, setSizes] = useState([]);
  const [type, setType] = useState('');
  const [images, setImages] = useState([]);
  const [offer, setOffer] = useState(0);
  const [price, setPrice] = useState(0);
  const [season, setSeason] = useState('');
  const [link1, setlink1] = useState('');
  const [link2, setlink2] = useState('');
  const [link3, setlink3] = useState('');
  const [link4, setlink4] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [colors, setColors] = useState('');
  const [Links, setLinks] = useState(false);
  const [imageLinks, setimageLinks] = useState([]);

  const [userId, setUserId] = useState('');
  useEffect(() => {
    const getUserId = async () => {
        const id = await AsyncStorage.getItem('USERID');
        setUserId(id);
        console.log(id);
    };
    getUserId();

}, []);

  const handleSubmit = async () => {
    let img = []
    img.push(link1);
    img.push(link2);
    img.push(link3);
    img.push(link4);
    const imageUrls = [];
    if (img.length = 0) {
      for (const image of images) {
        const imageRef = ref(storage, `images/${image.fileName}`);
        const response = await fetch(image.uri);
        const blob = await response.blob();
        const uploadTask = uploadBytesResumable(imageRef, blob);
        const downloadURL = await new Promise((resolve, reject) => {
          uploadTask.on('state_changed',
            (snapshot) => { },
            (error) => reject(error),
            () => getDownloadURL(uploadTask.snapshot.ref).then(resolve)
          );
        });
        imageUrls.push(downloadURL);
      }
    } else {
      if (link1 != '') {
        imageUrls.push(link1)
      } if (link2 != '') {
        imageUrls.push(link2)
      } if (link3 != '') {
        imageUrls.push(link3)
      } if (link4 != '') {
        imageUrls.push(link4)
      }
      console.log(imageUrls)
    }
    if (selectedItem) {
      await addDoc(collection(db, 'recycle'), {
        userId:userId,
        name: name,
        description: description,
        sizes: sizes,
        type: type,
        colors: colors,
        offer: offer,
        price: price,
        season: season,
        isAccept: 'not accept',
        images: imageUrls,
        categoryName: selectedItem.label,
        recycleProduct:true,
        sold:false,
      });
      console.log("Product added successfully.");
    } else {
      console.log("Please select a category.");
    }

    setName('');
    setDescription('');
    setSizes([]);
    setType('');
    setPrice(0);
    setSeason('');
    setOffer(0);
    setImages([]);
    setSelectedItem(null);
    setColors('');
    setlink1('');
    setlink2('');
    setlink3('');
    setlink4('');

  };

  const handleImageUpload = () => {
    launchImageLibrary({ mediaType: 'photo', selectionLimit: 0 }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        setImages([...images, ...response.assets]);
      }
    });
  };

  const handleLinks = () => {
    setLinks(!Links);
  }
  const handleRemoveImage = (indexToRemove) => {
    const updatedImages = images.filter((_, index) => index !== indexToRemove);
    setImages(updatedImages);
  };

  const handleSizeChange = (text) => {
    const sizeArray = text.split(',').map(size => size.trim());
    setSizes(sizeArray);
  };

  const handleColorInput = (text) => {
    const colorsArray = text.split(',').map(color => color.trim());
    setColors(colorsArray);
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
            <Text style={styles.label}>Product Name:</Text>
            <TextInput style={styles.input2} value={name} onChangeText={setName} />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Description:</Text>
            <TextInput style={[styles.input2, styles.textArea]} value={description} onChangeText={setDescription} multiline={true} />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Size:</Text>
            <TextInput style={styles.input2} value={sizes.join(', ')} onChangeText={handleSizeChange} />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Type:</Text>
            <TextInput style={styles.input2} value={type} onChangeText={setType} />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Colors:</Text>
            <TextInput style={styles.input2} value={colors} onChangeText={handleColorInput} />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Offer:</Text>
            <TextInput style={styles.input2} value={offer.toString()} onChangeText={(value) => setOffer(Number(value))} keyboardType="numeric" />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Price:</Text>
            <TextInput style={styles.input2} value={price.toString()} onChangeText={(value) => setPrice(Number(value))} keyboardType="numeric" />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Season:</Text>
            <TextInput style={styles.input2} value={season} onChangeText={setSeason} />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Images:</Text>
            {images.map((image, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image
                  source={{ uri: image.uri }}
                  style={styles.imagePreview}
                />
                <TouchableOpacity onPress={() => handleRemoveImage(index)}>
                  <Text style={styles.removeImageText}>Remove</Text>
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={styles.button} onPress={handleImageUpload}>
              <Text style={styles.buttonText}>Upload Images</Text>
            </TouchableOpacity >
            <TouchableOpacity style={styles.button} onPress={handleLinks}>
              <Text style={styles.buttonText}>Add Links</Text>
            </TouchableOpacity >
            {Links && (
              <><View style={styles.inputContainer}>
                <Text style={styles.label}>Link 1:</Text>
                <TextInput style={styles.input2} value={link1} onChangeText={setlink1} />
              </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Link 2:</Text>
                  <TextInput style={styles.input2} value={link2} onChangeText={setlink2} />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Link 3:</Text>
                  <TextInput style={styles.input2} value={link3} onChangeText={setlink3} />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Link 4:</Text>
                  <TextInput style={styles.input2} value={link4} onChangeText={setlink4} />
                </View></>
            )}
          </View>
          <View style={styles.checkboxContainer}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={selectedItem && selectedItem.id === item.id ? styles.selectedcategoryButton : styles.categoryButton}
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
  selectedcategoryButton: {
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

export default AddUserProduct;
