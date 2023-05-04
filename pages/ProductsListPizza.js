import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ScrollView, Pressable } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

import Food, { filterData } from '../data';
import FoodCard from '../components/Foodcard';
import Icon from 'react-native-vector-icons/FontAwesome';
let iconcolor 
const ProductsListPizza = ({ navigation }) => {
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
        navigation.navigate('PizzaDetails', { product });
    };

    const renderProduct = ({ item }) => (
        <TouchableOpacity onPress={() => handleProductPress(item)}>
            <View style={styles.cardView}>
                <Image source={{ uri: item.imageUrl }} style={styles.image} />

                <Text style={styles.Name}>{item.name}</Text>
                <View style={{ flex: 9, flexDirection: "row" }}>
                    <Text style={styles.price}>{item.price}</Text>
                    <Pressable onPress={iconcolor = 'gray' ? 'red' : 'gray'} style={styles.iconBehave} >
                        <Icon name="heart" size={30} color={iconcolor} />
                    </Pressable>
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
            <FlatList
                numColumns={2}
                data={products}
                renderItem={renderProduct}
                keyExtractor={(item) => item.id}
            />
        </View>
    );
};

const PizzaDetails = ({ route, navigation }) => {
    const { product } = route.params;

    return (


        <View >
            <View style={styles.container2}>
                <Image source={{ uri: product.imageUrl }} style={styles.imageCounter} />
                <View style={styles.container}>
                    <Text style={styles.Name2}> Name : {product.name}</Text>

                    <Text style={styles.price}> price : {product.price}</Text>
                </View>
            </View>
            <Text style={styles.headerText}> discription : {product.description}</Text>

            {/* display other product details */}
        </View>
    );
}
const styles = StyleSheet.create({
    cardView: {
        marginHorizontal: 9,
        marginBottom: 10,
        borderTopRightRadius: 5,
        borderTopLeftRadius: 5,
        borderWidth: 1,
        borderColor: "0B0E21",
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        width: 170
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
    Name2: {
        fontSize: 20,
        fontWeight: 'bold',
        color: "#131A2C",
        marginTop: 50,
        marginLeft: 10,
        marginBottom: 10,
        left: 200
    },
    price: {
        fontSize: 17,
        paddingTop: 5,
        color: "#0B0E21",
        paddingHorizontal: 10,
        left: 200
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
        height: 50,
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
    iconBehave: {
        marginLeft: 60
    },

});
export { ProductsListPizza, PizzaDetails };
