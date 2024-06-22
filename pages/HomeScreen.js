import React, { useState, useEffect, useRef } from 'react';
import {
    View, Text, TextInput, Image, TouchableOpacity, StyleSheet, FlatList, Pressable,
    ScrollView, Dimensions, TouchableWithoutFeedback, ActivityIndicator
} from 'react-native';
import { collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
// import filterData from '../data';
import Food, { filterData, productt, option, size } from "../data";
import Icon from 'react-native-vector-icons/Ionicons';

import Search from '../components/search';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNavigator from '../components/bar';
import { useIsFocused } from '@react-navigation/native';
import { getAuth } from "firebase/auth";
// import Carousel from 'react-native-snap-carousel';
import Homestyles from '../Consts/styles';
import theme from '../Consts/Color';

const { width } = Dimensions.get('screen');
const { height: screenHeight } = Dimensions.get('window');
const cardWidth = width / 2;

const HomeScreen = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [indexCheck, setIndexCheck] = useState("0");
    const [products, setProducts] = useState([]);
    const [trends, setTrends] = useState([]);
    const [userId, setUserId] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const isFocused = useIsFocused();
    const [dark, setDark] = useState(false);
    const [COLORS, setColor] = useState(theme.LIGHT_COLORS);
    const Homestyle = Homestyles(COLORS);

    const handledark = async () => {
        try {
            console.log(!dark)
            if (!dark) {
                setColor(theme.DARK_COLORS)
            } else {
                setColor(theme.LIGHT_COLORS)
            }

        } catch (error) {
            console.error("Error updating theme: ", error);
        }
    };
    const auth = getAuth();



    useEffect(() => {
        const fetchProducts = async () => {
            const collections = ['woman', 'men', 'kids', 'baby'];
            const allProducts = [];

            for (const collectionName of collections) {
                const productsCollection = collection(db, collectionName);
                const productsSnapshot = await getDocs(productsCollection);
                const productsData = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                allProducts.push(...productsData);
            }

            const offerProducts = allProducts.filter(product => product.offer > 0);
            setProducts(offerProducts);

            const trendProducts = allProducts.filter(product => product.rate > 2);
            trendProducts.sort((a, b) => b.rate - a.rate);
            setTrends(trendProducts);

            setIsLoading(false);
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        const fetchUserId = async () => {
            const id = await AsyncStorage.getItem('USERID');
            setUserId(id);
        };

        fetchUserId();
    }, []);



    const handleProductPress = (product, category) => {
        const routes = {
            KIDS: 'KidsDetails',
            MEN: 'MenDetails',
            BABY: 'BabyDetails',
            default: 'WomanDetails'
        };
        navigation.navigate(routes[category] || routes.default, { product ,COLORS:COLORS});
    };

    const renderProduct = ({ item }) => (
        <TouchableOpacity onPress={() => handleProductPress(item, item.categoryName)}>
            <View style={Homestyle.cardView}>
                <Image source={{ uri: item.images[0] }} style={Homestyle.image} />
                <View style={{ height: 100 }}>
                    <Text style={Homestyle.Name} numberOfLines={2} ellipsizeMode="tail">
                        {item.name}
                    </Text>
                    {item.offer !== 0 ? (
                        <>
                            <Text
                                style={Homestyle.priceO}
                            >
                                {item.price} EGP
                            </Text>
                            <Text
                                style={{
                                    fontSize: 13,
                                    fontWeight: "bold",
                                    marginHorizontal: 9,
                                    color: "#df2600",
                                    height: 40,
                                    marginTop: 5
                                }}
                            >
                                🏷️{item.offer}% Discount{" "}
                                <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                                    {Math.floor(item.price - (item.price * item.offer / 100))} EGP
                                </Text>
                            </Text>
                        </>
                    ) : (
                        <Text style={Homestyle.priceO}>
                            {item.price} EGP
                        </Text>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

    const renderItem = ({ item }) => (
        <View style={{ alignItems: 'center', width: '110%' }}>
            <Image source={{ uri: item.imageUrl }} style={{ width: '100%', height: 200 }} />
        </View>
    );

    // if (isLoading) {
    //     return <ActivityIndicator size="large" color="#0000ff" style={Homestyle.loading} />;
    // }

    return (
        <View style={Homestyle.container}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={Homestyle.Text}> AToZ </Text>
                <Pressable onPress={() => { setDark(!dark),handledark() }} style={{ margin: 10 }} >
                    <Icon name='moon' size={25} color={COLORS.dark} />

                </Pressable>
            </View>
            <Search COLORS={COLORS} />
            <ScrollView nestedScrollEnabled={true}>
                <View style={Homestyle.header} >
                    <FlatList
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        data={filterData}
                        keyExtractor={(item) => item.id}
                        extraData={indexCheck}
                        renderItem={({ item, index }) => (
                            <Pressable
                                onPress={() => navigation.navigate(item.name, COLORS)}
                            >
                                <View style={[Homestyle.smallCard, indexCheck === item.id ? Homestyle.smallCardSelected : null]}>
                                    <View>
                                        <Text style={[Homestyle.regularText, indexCheck === item.id ? Homestyle.selectedCardText : null]}>{item.name}</Text>
                                    </View>
                                </View>
                            </Pressable>
                        )}
                    />

                </View>
                {/* 
                <Carousel
                    ref={carouselRef}
                    data={data}
                    renderItem={renderItem}
                    sliderWidth={width}
                    itemWidth={300}
                    autoplay={true}
                    autoplayInterval={3000}
                    loop={true}
                /> */}

                <View style={Homestyle.headerTextView}>
                    <Text style={[Homestyle.headerText, { color: COLORS.offerC }]}> Discound product : </Text>
                </View>
                <View>
                    <ScrollView horizontal={true}>
                        <FlatList
                            style={{ marginTop: 10, marginBottom: 10 }}
                            horizontal={true}
                            data={products.slice(0, 7)}
                            showsHorizontalScrollIndicator={false}
                            renderItem={renderProduct}
                            keyExtractor={(item) => item.id}
                        />

                        <TouchableOpacity onPress={() => navigation.navigate('offer', products)} style={Homestyle.discoverButton}>
                            <Text style={Homestyle.discoverText}>{'See All >>'}</Text>
                        </TouchableOpacity>

                    </ScrollView>
                </View>

                <View style={Homestyle.headerTextView}>
                    <Text style={Homestyle.headerText}>TRENDS </Text>
                </View>

                <View style={{ flexDirection: 'row' }}>
                    <ScrollView horizontal={true}>
                        <FlatList
                            style={{ marginTop: 10, marginBottom: 10 }}
                            horizontal={true}
                            data={trends.slice(0, 3)}
                            showsHorizontalScrollIndicator={false}
                            renderItem={renderProduct}
                            keyExtractor={(item) => item.id}
                        />

                        <TouchableOpacity onPress={() => navigation.navigate('offer', trends)} style={Homestyle.discoverButton}>
                            <Text style={Homestyle.discoverText}>{'See All >>'} </Text>
                        </TouchableOpacity>

                    </ScrollView>
                </View>
                <View style={Homestyle.bottoms}></View>
            </ScrollView>
            <BottomNavigator item="Home" navigation={navigation} userId={userId} COLORS={COLORS} />
        </View>
    );
}

export default HomeScreen;


