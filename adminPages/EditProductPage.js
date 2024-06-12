import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
  ActivityIndicator,
  Modal,
} from "react-native";
import COLORS from "../Consts/Color";
import {
  doc,
  collection,
  updateDoc,
  getDocs,
  getDoc,
  query,
  where,
} from "firebase/firestore";
import { useRef } from "react";
import { auth, db, storage } from "../firebase";
import Food, { filterData, productt, option, size } from "../data";
import Foodcard from "../components/Foodcard";
import Icon from "react-native-vector-icons/FontAwesome";
import PrimaryButton from "../components/Button";
//import Header from "../Header";
import Search from "../components/search";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomNavigator from "../components/adminbar";
import { FontAwesome } from "@expo/vector-icons";
import Spinner from "react-native-loading-spinner-overlay";
import { getStorage } from "firebase/storage";


const { width } = Dimensions.get("screen");
const { height } = Dimensions.get("screen");

const cardwidth = width / 2;

const EditProductPage = ({ route, navigation }) => {
    const { product } = route.params;
    const storage = getStorage();
    const [category, setCategory] = useState(product.categoryName.toLowerCase());
    const [name, setName] = useState(product.name);
    const [description, setDescription] = useState(product.description);
    const [images, setImages] = useState([]);
    const [size, setSize] = useState(product.sizes);
    const [type, setType] = useState(product.type); 
    const [offer, setOffer] = useState(product.offer);
    const [price, setPrice] = useState(product.price);
    const [season, setSeason] = useState(product.season);
    const [colors, setColors] = useState(product.colors); 
    const [link1, setlink1] = useState(product.images[0]);
    const [link2, setlink2] = useState(product.images[1]);
    const [link3, setlink3] = useState(product.images[2]);
    const [link4, setlink4] = useState(product.images[3]);
    const [Links, setLinks] = useState(false);
    const handleSubmit = async () => {
       images.push(link1);
       images.push(link2);
       images.push(link3);
       images.push(link4);
        await updateDoc(doc(db, category, product.id), {
          name: name,
          description: description,
          images: images,
          size: size,
          type: type, 
          colors: colors, 
          offer: offer,
          price: price,
          season:season
        });
      
      // Reset state after submission
      setName('');
      setDescription('');
      setImages(null);
      setSize([]);
      setType('');
      setOffer(0);
      setPrice(0);
      setColors([]);
      setSeason('');
      navigation.goBack();
    };
  
    const handleImageUpload = (e) => {
      if (e.target.files[0]) {
        setImages(e.target.files[0]);
      }
    };
    const handleSizeChange = (text) => {
        const sizeArray = text.split(',').map(size => size.trim());
        setSize(sizeArray);
      };
    
    const handleColorInput = (text) => {
      const colorsArray = text.split(',').map((color) => color.trim());
      setColors(colorsArray);
    };
    const handleLinks = () => {
        setLinks(!Links);
      }
  
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
              <TextInput style={styles.input2} value={size.join(', ')} onChangeText={handleSizeChange} />
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
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Edit Product</Text>
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
export default EditProductPage;