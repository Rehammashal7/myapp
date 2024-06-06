import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, FlatList, TouchableOpacity, Image, StyleSheet ,CheckBox} from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, db, storage } from "../../firebase";


const AddUserProduct = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [sizes, setSizes] = useState([]);
  const [type, setType] = useState([]);
  const [images, setImages] = useState([]);
  const [offer, setOffer] = useState(0);
  const [price, setPrice] = useState(0);
  const [season, setSeason] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [colors, setColors] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("handleSubmit.");
    // let discountedPrice = price;
    // if (offer !== '') {
    //   const discount = parseFloat(offer);
    //   discountedPrice = price - (price * (discount / 100));
    // }

    const imageUrls = [];
    for (const image of images) {
      const imageRef = ref(storage, image.name);
      await uploadBytes(imageRef, image);
      const imageUrl = await getDownloadURL(imageRef);
      imageUrls.push(imageUrl);
    }

    if (selectedItem) {
      await addDoc(collection(db, 'recycle'), {
        name: name,
        description: description,
        sizes: sizes,
        type: type,
        colors: colors,
        offer: offer,
        price: price,
        season: season,
        isAccept:'not accept',
        images: imageUrls,
        categoryName:selectedItem.label,
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
  };

  const handleImageUpload = (e) => {
    console.log("handleSubmit2.");
    const newImages = Array.from(e.target.files);
    setImages([...images, ...newImages]);
  };

  const handleRemoveImage = (indexToRemove) => {
    const updatedImages = images.filter((image, index) => index !== indexToRemove);
    setImages(updatedImages);
  };

  const handleSizeChange = (text) => {
    console.log("handleSubmit3.");
    const sizeArray = text.split(',').map(size => size.trim());
    setSizes(sizeArray);
  };

  

  const handleColorInput = (text) => {
    console.log("handleSubmit5.");
    const colorsArray = text.split(',').map(color => color.trim());
    setColors(colorsArray);
  };

  const menuItems = [
    { id: 1, label: 'BABY' },
    { id: 2, label: 'KIDS' },
    { id: 3, label: 'MEN' },
    { id: 4, label: 'WOMAN' },
  ];

  const handlePress = async(item) => {
    console.log("handleSubmit6.");
    setSelectedItem(item);
  };

  const renderItem = ({ item }) => {
    console.log("handleSubmit7.");
    const isSelected = selectedItem && selectedItem.id === item.id;

    return (
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
            <TextInput style={styles.input2} value={offer} onChangeText={setOffer} keyboardType="numeric" />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Price:</Text>
            <TextInput style={styles.input2} value={price} onChangeText={setPrice} keyboardType="numeric" />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>season:</Text>
            <TextInput style={styles.input2} value={season} onChangeText={setSeason} />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Images:</Text>
            {images.map((image, index) => (
              <Image
                key={index}
                source={{ uri: URL.createObjectURL(image) }}
                style={styles.imagePreview}
              />
            ))}
            <input type="file" id="images" onChange={handleImageUpload} multiple/>
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
  imagePreview: {
    width: 200,
    height: 200,
    borderRadius: 5,
    marginBottom: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 5,
    marginRight: 10,
  },
  itemText: {
    fontSize: 16,
  },
  selectedItemButton: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  selectedItemText: {
    color: '#FFF',
  },
  menuContainer: {
    flex: 1,
    padding: 20,
  },
});

export default AddUserProduct;
