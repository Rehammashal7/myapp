import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ScrollView, Dimensions, Pressable } from 'react-native';
import { db } from '../firebase';
import COLORS from '../Consts/Color';
import { doc, collection, updateDoc, getDocs, getDoc } from "firebase/firestore";
import Header from './Header';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Food, { filterData, option, size } from '../data';
import FoodCard from '../components/Foodcard';
import Icon from 'react-native-vector-icons/FontAwesome';
import PrimaryButton from '../components/Button';
const { width } = Dimensions.get('screen');
const cardwidth = width - 20;
let iconcolor
const ProductsListOffer = ({ navigation }) => {
    const [products, setProducts] = useState([]);
    const [userId, setUserId] = useState('');
    const isFocused = useIsFocused();
    useEffect(() => {
        const getProducts = async () => {
            const productsCollection = collection(db, 'offer');
            const productsSnapshot = await getDocs(productsCollection);
            const productsData = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProducts(productsData);
        };
        getProducts();
    }, []);

    useEffect(() => {
        const fetchItems = async () => {
            const querySnapshot = await getDocs(collection(db, 'pizza'));
            console.log('Total products: ', querySnapshot.size);
            let tempData = [];
            querySnapshot.forEach((documentSnapshot) => {
                console.log(
                    'product ID: ',
                    documentSnapshot.id,
                    documentSnapshot.data(),
                );
                tempData.push({
                    id: documentSnapshot.id,
                    data: documentSnapshot.data(),
                });
            });
            setProducts(tempData);
        };
        //fetchItems();
    }, []);


    useEffect(() => {
        const getUserId = async () => {
            const id = await AsyncStorage.getItem('USERID');
            setUserId(id);
            console.log(id);
        };
        getUserId();
    }, []);


    const handleProductPress = (product) => {
        navigation.navigate('OfferDetails', { product });
    };

    const renderProduct = ({ item }) => (
        <TouchableOpacity onPress={() => handleProductPress(item)}>
            <View style={styles.cardView}>
                <Image source={{ uri: item.imageUrl }} style={styles.image} />

                <Text style={styles.Name}>{item.name}</Text>
                <View style={{ flexDirection: "row", marginTop: 10, marginHorizontal: 10, justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.price}LE</Text>

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
                            onPress={() => navigation.navigate(item.name)}
                        >
                            <View style={item.name === 'Offer' ? { ...styles.smallCardSelected } : { ...styles.smallCard }}>
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

                    data={products}
                    renderItem={renderProduct}
                    keyExtractor={(item) => item.id}
                />
                <View style={styles.bottoms}></View>
            </ScrollView>
            <View style={styles.NavContainer} >
                <View style={styles.Navbar} >

                    <Pressable onPress={() => navigation.navigate("profile")} style={styles.iconBehave}>
                        <Icon name="user" size={25} color={COLORS.grey} />
                    </Pressable>
                    <Pressable onPress={() => navigation.navigate("Home")} style={styles.iconBehave} >
                        <Icon name="home" size={25} color={COLORS.grey} />
                    </Pressable>
                    <Pressable onPress={() => navigation.navigate('CartScreen', { userId: userId })} style={styles.iconBehave} >
                        <Icon name="shopping-cart" size={25} color={COLORS.grey} />
                    </Pressable>
                </View>
            </View>
        </View>
    );
};
//////////////////////////////////////////////////////////////////////////////////////////////////////
const OfferDetails = ({ route, navigation }) => {
    const { product } = route.params;

    const [selectedSizeIndex, setSelectedSizeIndex] = React.useState(0);
    const [selectedOptionIndex, setSelectedOptionIndex] = React.useState(0);
    const [productt, setProductt] = React.useState([]);

    const [cartCount, setCartCount] = useState(0);
    // const navigation = useNavigation();
    const [userId, setUserId] = useState('');
    const isFocused = useIsFocused();
    const product_id = product.id;

    useEffect(() => {

        const fetchItem = async (product_id) => {
            const documentSnapshot = await getDoc(doc(db, 'offer', product_id));
            console.log('product ID: ', documentSnapshot.id, documentSnapshot.data());
            let tempData = [];
            tempData.push({
                id: documentSnapshot.id,
                data: documentSnapshot.data(),
            });
            setProductt(tempData);
        };
        fetchItem(product_id);

    }, []);



    useEffect(() => {
        const getUserId = async () => {
            const id = await AsyncStorage.getItem('USERID');
            setUserId(id);
            console.log(id);
        };
        getUserId();
    }, []);




    const getCartItems = async () => {

        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);
        const cartCount = userSnap?.data()?.cart?.length ?? 0;

        setCartCount(cartCount);
    };

    useEffect(() => {
        if (userId) {
            getCartItems();
        }
    }, [userId]);

    const onAddToCart = async (item, index) => {

        console.log(userId);
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        const { cart = [] } = userSnap.data() ?? {};
        let existingItem = cart.find(itm => itm.id === item.id);

        if (existingItem) {
            existingItem.qty += 1;
        } else {
            cart.push({ ...item, qty: 1 });
        }
        await updateDoc(userRef, { cart });
        getCartItems();
    };


    return (
        <View style={styles.container}>
            <Header
                title={'FoodApp'}
                icon={require('../assets/cart.png')}
                count={cartCount}
                onClickIcon={() => {
                    navigation.navigate('CartScreen', { userId: userId });
                }}
            />

            <View style={{ backgroundColor: COLORS.background, flex: 1 }}>
                <View style={styles.headerWrapper}>
                    <View style={styles.titlesWrapper}>
                        <Text style={styles.Name2}>{product.name}</Text>
                    </View>


                </View>
                <View style={styles.container2}>


                    <View style={styles.container}>

                        <View style={styles.priceWrapper}>
                            <Text style={styles.price}> price : {product.price}LE</Text>
                        </View>
                        <Text style={{ fontSize: 20, color: COLORS.grey, marginBottom: 10, marginLeft: 20 }}>rate</Text>
                        <View style={{ flexDirection: 'row', marginLeft: 20, marginBottom: 10 }}>
                            <Icon name='star' size={20} color={COLORS.star} />
                            <Icon name='star' size={20} color={COLORS.star} />
                            <Icon name='star' size={20} color={COLORS.star} />
                            <Icon name='star' size={20} color={COLORS.star} />
                            <Icon name='star' size={20} color={COLORS.star} />
                        </View>
                        <FlatList
                            Vertical={true}
                            showsVerticalScrollIndicator={false}
                            data={size}
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
                                            marginBottom: 5,
                                            marginLeft: 20
                                        }}>
                                        <Text
                                            style={{
                                                fontSize: 15,
                                                fontWeight: 'bold',
                                                marginLeft: 10,
                                                marginTop: 5,
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
                <View style={{ backgroundColor: COLORS.background, flex: 1 }}>
                    
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
                                        marginBottom: 5,
                                        marginLeft: 20,
                                        marginTop: 20
                                    }}>
                                    <Text
                                        style={{
                                            fontSize: 15,
                                            fontWeight: 'bold',

                                            marginTop: 5,
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
                    <Text style={{ fontSize: 20, marginBottom: 20 }}> discription : {product.description}</Text>
                    <View style={{ marginLeft: 50 }}>
                        <FlatList

                            data={productt}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item, index }) => (
                                <TouchableOpacity
                                    key={index}
                                    activeOpacity={0.8}

                                    onPress={() => setSelectedOptionIndex(index)}
                                >

                                    <PrimaryButton
                                        title="Add to Order"
                                        style={styles.addToCartBtn}
                                        onPress={() => {
                                            onAddToCart(item, index);
                                        }}
                                    />
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
                {/* display other product details */}
            </View>
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
        width: width,
        justifyContent: 'space-evenly',
        borderRadius: 30,
        height: 40

    },
    iconBehave: {
        padding: 35,
        bottom: 30
    },

});
export { ProductsListOffer, OfferDetails };
