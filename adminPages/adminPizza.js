import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ScrollView, Pressable, Dimensions } from 'react-native';
import { collection, getDocs ,updateDoc} from 'firebase/firestore';
import { db } from '../firebase';
import COLORS from '../Consts/Color';
import {  query, where, doc, deleteDoc } from 'firebase/firestore';

import Food, { filterData, option, size } from '../data';
import FoodCard from '../components/Foodcard';
import Icon from 'react-native-vector-icons/FontAwesome';
import PrimaryButton from '../components/Button';
const { width } = Dimensions.get('screen');
const cardwidth = width / 2 - 20;
let iconcolor
const ProductsListPizzaAdmin = ({ navigation }) => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const getProducts = async () => {
            const productsCollection = collection(db, 'pizza');
            const productsSnapshot = await getDocs(productsCollection);
            const productsData = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProducts(productsData);
        };
        getProducts();
    }, []);

    const handleProductPress = (product) => {
        navigation.navigate('PizzaDetailsAdmin', { product });
    };

    const renderProduct = ({ item }) => (
        <TouchableOpacity onPress={() => handleProductPress(item)}>
            <View style={styles.cardView}>
                <Image source={{ uri: item.imageUrl }} style={styles.image} />

                <Text style={styles.Name}>{item.name}</Text>
                <View style={{ flexDirection: "row", marginTop: 10, marginHorizontal: 20, justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.price}</Text>
                    <View style={styles.HeartIcone}>
                        <Icon name="heart" size={30} color={COLORS.grey} />
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container} >
            <View style={styles.header}>
                <FlatList
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    data={filterData}
                    keyExtractor={(item) => item.id}

                    renderItem={({ item, index }) => (
                        <Pressable
                            onPress={() => navigation.navigate('admin'+item.name)}
                        >
                            <View style={item.name === 'Pizza' ? { ...styles.smallCardSelected } : { ...styles.smallCard }}>
                                <Image
                                    style={{ height: 60, width: 60, borderRadius: 30 }}
                                    source={item.image}
                                />

                                <View style={styles.smallCardText}>
                                    <Text>{item.name}</Text>
                                </View>
                            </View>
                        </Pressable>
                    )}
                />
            </View>
            <ScrollView>
                <FlatList
                    numColumns={2}
                    data={products}
                    renderItem={renderProduct}
                    keyExtractor={(item) => item.id}
                />
                <View style={styles.bottoms}></View>
            </ScrollView>
            <View style={styles.NavContainer} >
                <View style={styles.Navbar} >
                    {/* <Pressable onPress={() => navigation.navigate("Favorite")} style={styles.iconBehave} >
                        <Icon name="heart" size={25} color={COLORS.grey} />
                    </Pressable> */}
                    <Pressable onPress={() => navigation.navigate("adminprofile")} style={styles.iconBehave}>
                        <Icon name="user" size={25} color={COLORS.grey} />
                    </Pressable>
                    <Pressable onPress={() => navigation.navigate("plusbutton")} style={styles.iconBehave} >
                        <Icon name="plus" size={25} color={COLORS.grey} />
                    </Pressable>
                    <Pressable onPress={() => navigation.navigate("adminHome")} style={styles.iconBehave} >
                        <Icon name="home" size={25} color={COLORS.grey} />
                    </Pressable>
                    {/* <Pressable onPress={() => navigation.navigate("CartScreen")} style={styles.iconBehave} >
                        <Icon name="shopping-cart" size={25} color={COLORS.grey} />
                    </Pressable> */}
                </View>
            </View>
        </View>
    );
};

const PizzaDetailsAdmin = ({ route, navigation }) => {
    const { product } = route.params;
    const [selectedSizeIndex, setSelectedSizeIndex] = React.useState(0);
    const [selectedOptionIndex, setSelectedOptionIndex] = React.useState(0);
    const [products, setProducts] = useState([]);

    const handleDelete = async (item) => {
        // Get the Firestore document ID for the pizza with the selected name
        const querySnapshot = await getDocs(query(collection(db, 'pizza'), 
        where('name', '==', product.name)));
        const docId = querySnapshot.docs[0].id;
      
        // Delete the pizza document from Firestore
        await deleteDoc(doc(db, 'pizza', docId));
        const newProducts = products.filter((product) => product.name !== item.label);
        setProducts(newProducts);
        
      };
    return (


        <View style={{ backgroundColor: COLORS.background, flex: 1 }}>
            <View style={styles.headerWrapper}>
                <View style={styles.titlesWrapper}>
                    <Text style={styles.Name2}>{product.name}</Text>
                </View>
                <View style={styles.headerRight}>
                    <Icon name='heart' size={25} color={COLORS.heart} />
                </View>

            </View>
            <View style={styles.container2}>


                <View style={styles.container}>

                    <View style={styles.priceWrapper}>
                        <Text style={styles.price}> price : {product.price}</Text>
                    </View>
                    <Text style={{fontSize:20,color:COLORS.grey ,marginBottom:10,marginLeft:20}}>rate</Text>
                    <View style={{ flexDirection: 'row', marginLeft: 20,marginBottom:10 }}>
                        <Icon name='star' size={20} color={COLORS.star} />
                        <Icon name='star' size={20} color={COLORS.star} />
                        <Icon name='star' size={20} color={COLORS.star} />
                        <Icon name='star' size={20} color={COLORS.star} />
                        <Icon name='star' size={20} color={COLORS.star} />
                    </View>
                    <FlatList
                            Vertical={true}
                            showsVerticalScrollIndicator={false}
                            data={products}
                            keyExtractor={(item) => item.id}

                            renderItem={({ item, index }) => (
                                <TouchableOpacity
                                    key={index}
                                    activeOpacity={0.8}
                                    onPress={() => setSelectedSizeIndex(index)}>
                                    <View
                                        style={{
                                            backgroundColor:
                                                selectedSizeIndex == index
                                                    ? COLORS.darkblue
                                                    : COLORS.yellow,
                                            ...styles.size,
                                            marginBottom:5,
                                            marginLeft:20
                                        }}>
                                        <Text
                                            style={{
                                                fontSize: 15,
                                                fontWeight: 'bold',
                                                marginLeft: 10,
                                                marginTop:5,
                                                color:
                                                    selectedSizeIndex == index
                                                        ? COLORS.white
                                                        : COLORS.darkblue,
                                            }}>
                                            {item.Name}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                        />
                  
                </View>

                <Image source={{ uri: product.imageUrl }} style={styles.imageCounter} />
            </View>
            <View style={{backgroundColor:COLORS.background,flex:1}}>
            <FlatList
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            data={option}
                            keyExtractor={(item) => item.id}

                            renderItem={({ item, index }) => (
                                <TouchableOpacity
                                    key={index}
                                    activeOpacity={0.8}
                                    onPress={() => setSelectedOptionIndex(index)}>
                                    <View
                                        style={{
                                            backgroundColor:
                                                selectedOptionIndex == index
                                                    ? COLORS.darkblue
                                                    : COLORS.yellow,
                                            ...styles.size,
                                            marginBottom:5,
                                            marginLeft:20,
                                            marginTop:20
                                        }}>
                                        <Text
                                            style={{
                                                fontSize: 15,
                                                fontWeight: 'bold',
                                              
                                                marginTop:5,
                                                color:
                                                    selectedOptionIndex == index
                                                        ? COLORS.white
                                                        : COLORS.darkblue,
                                            }}>
                                            {item.Name}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                        />
            <Text style={{fontSize:20,marginBottom:5}}> discription : {product.description}</Text>
            
            <View style={{marginLeft:50}}> 
            <PrimaryButton
            title='Edit' 
            onPress={() => navigation.navigate('EditPizzaPage', { product })}/>
            <PrimaryButton
            title='Delete' 
            onPress={() => handleDelete ()}/>
            </View>
            </View>
            {/* display other product details */}
        </View>
    );
}
const styles = StyleSheet.create({
    headerWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 5,
    },
    headerRight: {
        backgroundColor: COLORS.background,
        padding: 12,
        borderRadius: 10,
        borderColor: COLORS.background,
        marginLeft: 10,
        marginBottom: 5,
        marginTop: 10,
        width: 40,
        borderWidth: 2,
    },
    cardView: {
        marginHorizontal: 10,
        marginBottom: 20,
        marginTop: 20,
        borderRadius: 15,
        width: cardwidth,
        height: 220,
        elevation: 13,
        backgroundColor: 'white',
    },
    image: {
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        height: 150,
        width: cardwidth,
    },

    Name: {
        fontSize: 20,
        fontWeight: 'bold',
        color: "#131A2C",
        marginTop: 5,
        marginLeft: 10,
        marginBottom: 10,
        left: 200
    },
    titlesWrapper: {
        paddingHorizontal: 5,
        marginTop: 5,
    },
    Name2: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 32,
        color: COLORS.darkblue,
    },
    priceWrapper: {
        marginTop: 10,
        paddingHorizontal: 20,
        marginBottom: 10
    },
    price: {
        color: COLORS.darkblue,
        fontFamily: 'Montserrat-Bold',
        fontSize: 24,
    },
    HeartIcone: {
        height: 30,
        width: 30,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sizeContainer: {
        paddingVertical: 20,
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    size: {
        height: 30,
        width: 100,
        marginRight: 7,
        borderRadius: 30,
        alignItems: 'center',
        paddingHorizontal: 5,
    },
    container: {
        flex: 1,
        backgroundColor: '#FBFAFF',
        //flexDirection:"row",
        // alignItems: 'center',
        // justifyContent: 'center',
    },
    container2: {
        flex: 1,
        backgroundColor: '#FBFAFF',
        flexDirection: "row",

        // alignItems: 'center',
        // justifyContent: 'center',
    },
    heading: {
        color: "WHITE",
        fontSize: 40,
        alignItems: 'center',
        marginBottom: 5,
    },
    header: {
        flexDirection: "row",
        backgroundColor: "#FBFAFF",
        height: 120,
    },
    bottoms: {
        flexDirection: "row",
        backgroundColor: "#FBFAFF",
        height: 30,
        bottom: 20
    },
    headerText: {
        color: "#131A2C",
        fontSize: 17,
        fontWeight: "bold",
        alignItems: 'center',
        marginLeft: 10,
        marginBottom: 10,
        marginTop: 10

    },
    Text: {
        color: "#0B0E21",
        fontSize: 40,
        fontWeight: "bold",
        alignItems: 'center',

    },
    discribtion: {
        color: "#0B0E21",
        fontSize: 20,
        fontWeight: "bold",
        alignItems: 'center',

    },
    imageCounter: {
        width: 200,
        height: 250,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        padding: 10,
        left: 7,
        backgroundColor: 'black',
        marginTop: 10,
    },
    smallCard: {
        borderRadius: 30,
        backgroundColor: 'white',
        justifyContent: "center",
        alignItems: 'center',
        padding: 5,
        width: 80,
        margin: 10,
        height: 100
    },

    smallCardSelected: {
        borderRadius: 30,
        backgroundColor: '#FFDE9B',
        justifyContent: "center",
        alignItems: 'center',
        padding: 5,
        width: 80,
        margin: 10,
        height: 100
    },

    smallCardTextSected: {
        fontWeight: "bold",
        color: '#131A2C'
    },

    smallCardText: {
        fontWeight: "bold",
        color: '#131A2C'
    },
    NavContainer: {
        position: 'absolute',
        alignItems: 'center',
        bottom: 5,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
    },
    Navbar: {
        flexDirection: 'row',
        backgroundColor: COLORS.darkblue,
        width: 370,
        justifyContent: 'space-evenly',
        borderRadius: 30,
        height: 40

    },
    iconBehave: {
        padding: 35,
        bottom: 30
    },
    containerEditProduct: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
      },
      formEditProduct: {
        width: '80%',
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
      inputContainerEditProduct: {
        marginBottom: 10,
      },
      labelEditProduct: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
      },
      inputEditProduct: {
        borderWidth: 1,
        borderColor: '#CCC',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 8,
        fontSize: 16,
      },
      textareaEditProduct: {
        borderWidth: 1,
        borderColor: '#CCC',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 8,
        fontSize: 16,
        height: 100,
        textAlignVertical: 'top',
      },
      fileInputEditProduct: {
        borderWidth: 1,
        borderColor: '#CCC',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 8,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
      },
      buttonContainerEditProduct: {
        alignItems: 'center',
        marginTop: 20,
      },
      buttonEditProduct: {
        backgroundColor: '#131A2C',
        borderRadius: 5,
        paddingHorizontal: 20,
        paddingVertical: 10,
      },
      buttonTextEditProduct: {
        color: '#FFDE9B',
        fontSize: 18,
        fontWeight: 'bold',
      },

});
import { getDownloadURL, getStorage, ref, uploadBytes ,uploadBytesResumable,child} from "firebase/storage";
import {  storage } from '../firebase';
import { TextInput } from 'react-native-web';
const EditPizzaPage = ({ route, navigation }) => {
const { product } = route.params;
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
  
    const handleSubmit = async (item) => {
      item.preventDefault();
  
      // Upload image to Storage
      const imageRef = ref(storage, image.name);
      await uploadBytes(imageRef, image);
      //const imageUrl = await imageRef.getDownloadURL();
      const imageUrl = await getDownloadURL(imageRef);
      const querySnapshot = await getDocs(query(collection(db, 'pizza'), 
      where('name', '==', product.name)));
      const docId = querySnapshot.docs[0].id;
      // Add product document to Firestore
      await updateDoc(doc(db, 'pizza',docId), {
        name: name,
        description: description,
        imageUrl: imageUrl,
      });
  
      setName('');
      setDescription('');
      setImage(null);
    };
    
  
    const handleImageUpload = (e) => {
      if (e.target.files[0]) {
        setImage(e.target.files[0]);
      }
    };
  
    return (
        <View style={styles.containerEditProduct}>
        <View style={styles.formEditProduct}>
          <View style={styles.inputContainerEditProduct}>
            <Text style={styles.labelEditProduct}>Product Name:</Text>
            <TextInput
              style={styles.inputEditProduct}
              value={name}
              onChangeText={(text) => setName(text)}
            />
          </View>
          <View style={styles.inputContainerEditProduct}>
            <Text style={styles.labelEditProduct}>Description:</Text>
            <TextInput
              style={styles.textareaEditProduct}
              multiline
              value={description}
              onChangeText={(text) => setDescription(text)}
            />
          </View>
          <View style={styles.inputContainerEditProduct}>
            {/* <Text style={styles.labelEditProduct}>Image:</Text>
            <TouchableOpacity
              style={styles.fileInputEditProduct}
              onPress={handleImageUpload}
            >
              <Text>Select Image</Text>
            </TouchableOpacity> */}
            
          </View>
          <View style={{marginBottom : 10 }}>
          <label htmlFor="image">Image:</label>
           <input type="file" id="image" onChange={handleImageUpload} />
           </View>
          <TouchableOpacity
            style={styles.buttonEditProduct}
            onPress={handleSubmit}
          >
  
            <Text style={styles.buttonTextEditProduct}>Edit Product</Text>
          </TouchableOpacity>
        </View>
      </View>
      );
    };
export { ProductsListPizzaAdmin, PizzaDetailsAdmin,EditPizzaPage };
