import React, { useState, useEffect } from 'react';
import { View, Text, TextInput,FlatList, TouchableOpacity, Image, StyleSheet, ScrollView,Dimensions, Pressable } from 'react-native';
import { collection, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import ImagePicker from 'react-native-image-picker';

import Food, { filterData, option, size } from '../data';
import FoodCard from '../components/Foodcard';
import Icon from 'react-native-vector-icons/FontAwesome';
import COLORS from '../Consts/Color';
import PrimaryButton from '../components/Button';
import {  query, where, doc, deleteDoc } from 'firebase/firestore';

const {width} = Dimensions.get('screen');
const cardwidth = width/2-20;
let iconcolor 
const adminProductsListBurger = ({ navigation }) => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const getProducts = async () => {
            const productsCollection = collection(db, 'burger');
            const productsSnapshot = await getDocs(productsCollection);
            const productsData = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProducts(productsData);
        };
        getProducts();
    }, []);

    const handleProductPress = (product) => {
        navigation.navigate('adminBurgerDetails', { product });
    };

    const renderProduct = ({ item }) => (
        <TouchableOpacity onPress={() => handleProductPress(item)}>
            <View style={styles.cardView}>
                <Image source={{ uri: item.imageUrl }} style={styles.image} />

                <Text style={styles.Name}>{item.name}</Text>
                <View style={{ flexDirection: "row", marginTop:10,marginHorizontal:20,justifyContent:'space-between'}}>
                <Text style={{fontSize: 18, fontWeight: 'bold'}}>{item.price}</Text>
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
                            <View style={item.name === 'Burgers' ? { ...styles.smallCardSelected } : { ...styles.smallCard }}>
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
                        <Icon name="user" size={25} color={COLORS.grey}/>
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

const adminBurgerDetails = ({ route, navigation }) => {
    const { product } = route.params;
    const [selectedSizeIndex, setSelectedSizeIndex] = React.useState(0);
    const [selectedOptionIndex, setSelectedOptionIndex] = React.useState(0);
    const [products, setProducts] = useState([]);

    const handleDelete = async (item) => {
        // Get the Firestore document ID for the pizza with the selected name
        const querySnapshot = await getDocs(query(collection(db, 'burger'), 
        where('name', '==', product.name)));
        const docId = querySnapshot.docs[0].id;
      
        // Delete the pizza document from Firestore
        await deleteDoc(doc(db, 'burger', docId));
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
            title='Ddit' 
            onPress={() => navigation.navigate('EditProductPage', { product })}/>
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
        width: 170
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

});



//import { ref, uploadBytes } from 'firebase/storage';
import { getDownloadURL, getStorage, ref, uploadBytes ,uploadBytesResumable,child} from "firebase/storage";
import {  storage } from '../firebase';
const EditProductPage = ({ route, navigation }) => {
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
      const querySnapshot = await getDocs(query(collection(db, 'burger'), 
      where('name', '==', product.name)));
      const docId = querySnapshot.docs[0].id;
      // Add product document to Firestore
      await updateDoc(doc(db, 'burger',docId), {
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
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Product Name:</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
        </div>
        <div>
          <label htmlFor="image">Image:</label>
          <input type="file" id="image" onChange={handleImageUpload} />
        </div>
        <button type="submit">Add Product</button>
      </form>
      );
    };
    
export { EditProductPage,adminProductsListBurger, adminBurgerDetails };
