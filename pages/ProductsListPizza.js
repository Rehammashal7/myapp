import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ScrollView, Pressable, Dimensions } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import COLORS from '../Consts/Color';

import Food, { filterData, option, size } from '../data';
import FoodCard from '../components/Foodcard';
import Icon from 'react-native-vector-icons/FontAwesome';
import PrimaryButton from '../components/Button';
const { width } = Dimensions.get('screen');
const cardwidth = width / 2 - 20;
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
                {/* <View style={{ flexDirection: "row", marginTop:10,marginHorizontal:20,justifyContent:'space-between'}}> */}
                <Text style={{fontSize: 18, fontWeight: 'bold',marginHorizontal:20}}>{item.price}</Text>
                   
                  
                   {/* </View> */}
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
                   
                    <Pressable onPress={() => navigation.navigate("profile")} style={styles.iconBehave}>
                        <Icon name="user" size={25} color={COLORS.grey} />
                    </Pressable>
                    <Pressable onPress={() => navigation.navigate("Home")} style={styles.iconBehave} >
                        <Icon name="home" size={25} color={COLORS.grey} />
                    </Pressable>
                    <Pressable onPress={() => navigation.navigate("CartScreen")} style={styles.iconBehave} >
                        <Icon name="shopping-cart" size={25} color={COLORS.grey} />
                    </Pressable>
                </View>
            </View>
        </View>
    );
};

const PizzaDetails = ({ route, navigation }) => {
    const { product } = route.params;
    const [selectedSizeIndex, setSelectedSizeIndex] = React.useState(0);
    const [selectedOptionIndex, setSelectedOptionIndex] = React.useState(0);
    return (


        <View style={{ backgroundColor: COLORS.background, flex: 1 }}>
            <View style={styles.headerWrapper}>
                <View style={styles.titlesWrapper}>
                    <Text style={styles.Name2}>{product.name}</Text>
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
            <Text style={{fontSize:20,marginBottom:20}}> discription : {product.description}</Text>
            <View style={{marginLeft:50}}> 
            <PrimaryButton
            title='Add to cart' 
            onPress={() => navigation.navigate('CartScreen')}/>
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
        height: 35,
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
export { ProductsListPizza, PizzaDetails };
