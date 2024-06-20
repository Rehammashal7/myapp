import React, { useEffect, useRef, useState } from 'react';
import {
    View, Text, TextInput, Image, TouchableOpacity, StyleSheet, FlatList, Pressable,
    ScrollView, Dimensions, TouchableWithoutFeedback, Modal, Keyboard
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import COLORS from '../Consts/Color';
import Icon from 'react-native-vector-icons/Ionicons';
import { collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProductPage from '../pages/ResultSearch';

const { width } = Dimensions.get('screen');
const Search = () => {
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [modalVisible, setModalVisible] = useState(false);
    const [textInputFocused, setTextInputFocused] = useState(true);
    const [data, setData] = useState([]);
    const [products, setProducts] = useState({});
    const [userId, setUserId] = useState('');
    const textInput = useRef(null);
    const [searchList, setsearchList] = useState([]);
    const [length, setlength] = useState(0);
    const [isempty, setisempty] = useState(true);
    const [searchText, setText] = useState("");

    useEffect(() => {
        getsearchItems();
        fetchData();
    }, [getsearchItems, isFocused]);

    useEffect(() => {
        if (!isempty) {
            setlength(0)
        }
    }, [isempty])

    useEffect(() => {
        if (isempty) {
            getsearchItems();
        }
    }, [isempty])

    const contains = ({ name, colors }, query) => {
        console.log(name, colors);
        return name.toLowerCase().includes(query.toLowerCase());
    };
    const containtype= ({ type }, query) => {
        console.log(type);
        return type.toLowerCase().includes(query.toLowerCase());
    };
    const containcategory = ({ categoryName }, query) => {
        console.log(categoryName);
        return categoryName.toLowerCase().includes(query.toLowerCase());
    };
    const containColor = ({ colors }, query) => {
        console.log(colors);

        // Convert the query to lowercase for case-insensitive comparison
        const lowerCaseQuery = query.toLowerCase();

        // Use the some method to check if any color in the list includes the query
        return colors.some(color => color.includes(lowerCaseQuery));
    };
    const getsearchItems = async () => {
        try {
            const id = await AsyncStorage.getItem('USERID');
            setUserId(id);
            const userRef = doc(db, 'users', id);
            const userSnap = await getDoc(userRef);
            const searchList = userSnap.get('search');

            if (searchList) {
                setsearchList(searchList);
                setlength(searchList.length);
            } else {
                setsearchList([]);
                setlength(0);
            }

        } catch (error) {
            console.error('Error getting search items:', error);
        }
    };

    const onAddTosearch = async (item) => {
        try {
            const userRef = doc(db, "users", userId);
            const userSnap = await getDoc(userRef);
            const { search = [] } = userSnap.data() ?? {};
            let existingItem = search.find(itm => itm.id === item.id);
            if (!existingItem) {
                search.push({ ...item });
                await updateDoc(userRef, { search });
                getsearchItems();
            }
        } catch (error) {
            console.error('Error adding to search:', error);
        }
    };

    const deleteItem = async (index) => {
        try {
            const userRef = doc(db, 'users', userId);
            const userSnap = await getDoc(userRef);
            let tempSearch = userSnap.data().search;
            tempSearch.splice(index, 1);
            await updateDoc(userRef, { search: tempSearch });
            getsearchItems();
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const fetchData = async () => {
        try {
            const collectionNames = ['woman', 'kids', 'baby', 'men'];
            const dataPromises = collectionNames.map(async (collectionName) => {
                const collectionRef = collection(db, collectionName);
                const snapshot = await getDocs(collectionRef);
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                return { [collectionName]: data };
            });
            const dataArray = await Promise.all(dataPromises);
            const mergedData = dataArray.reduce((acc, curr) => ({ ...acc, ...curr }), {});
            setProducts(mergedData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const getProductById = async (categoryId, itemId) => {
        try {
            const productsCollection = collection(db, categoryId);
            const querySnapshot = await getDocs(productsCollection);
            const productsData = querySnapshot.docs
                .map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }))
                .find((product) => product.id === itemId);

            return productsData;
        } catch (error) {
            console.error("Error fetching product: ", error);
            return null;
        }
    };

    const handleProductPress = async (product, Category) => {
        onAddTosearch(product);
        try {
            const categoryId = Category ? Category.toLowerCase() : "woman";
            const retrievedProduct = await getProductById(categoryId, product.id);

            if (retrievedProduct) {
                if (Category === "KIDS") {
                    navigation.navigate('KidsDetails', { product: retrievedProduct }); setModalVisible(false)
                    setTextInputFocused(true)
                } else if (Category === "MEN") {
                    navigation.navigate('MenDetails', { product: retrievedProduct }); setModalVisible(false)
                    setTextInputFocused(true)
                } else if (Category === "BABY") {
                    navigation.navigate('BabyDetails', { product: retrievedProduct }); setModalVisible(false)
                    setTextInputFocused(true)
                } else {
                    navigation.navigate('WomanDetails', { product: retrievedProduct }); setModalVisible(false)
                    setTextInputFocused(true)
                }
            } else {
                console.error("Product not found!");
            }
        } catch (error) {
            console.error("Error fetching product: ", error);
        }
    };

    const handleSearch = async (text) => {
        if (text.trim() !== '') {
            const filteredData = {};
            Object.keys(products).forEach(collectionName => {
                const filteredCollection = products[collectionName].filter(product =>
                    contains(product, text)
                    || containColor(product, text)
                    || containcategory(product, text)
                    || containtype(product, text)
                );
                filteredData[collectionName] = filteredCollection;
                console.log('F', filteredCollection);

            });
            setData(filteredData);
            setisempty(false);
            setlength(0);
            setText(text);
        } else {
            setisempty(true);
            getsearchItems();
            setData('');
        }

    };

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => { handleProductPress(item, item.categoryName), getsearchItems() }}>
            <View style={styles.view2}>
                <Text>{item.name}</Text>
            </View>
        </TouchableOpacity>
    );

    const renderItem2 = ({ item, index }) => (
        <View style={styles.total}>
            <View style={{ flexDirection: 'row' }}>
                <Pressable style={{ alignItems: 'center', }}>
                    <Icon name='refresh-outline' size={20} color={COLORS.grey} style={{ alignItems: 'center', }} />
                </Pressable>
                <TouchableOpacity onPress={() => handleProductPress(item, item.categoryName)}>
                    <Text style={{ width: width - 60 }}>{item.name}</Text>
                </TouchableOpacity>
            </View>
            <Pressable onPress={() => deleteItem(index)} style={{ alignItems: 'center', }}>
                <Icon name='trash' size={25} color={COLORS.dark} style={{ alignItems: 'center', }} />
            </Pressable>
        </View>
    );

    const handleSearchNavigate = () => {
        navigation.navigate("SearchResultsPage", { searchData: data, searchTexts: searchText });
        setModalVisible(false);
        setTextInputFocused(true);
    };

    return (
        <View style={{ alignItems: "center",marginTop:5 }}>
            {/* search */}
            <TouchableWithoutFeedback
                onPress={() => {
                    setModalVisible(true);
                    getsearchItems()
                }}
            >
                <View style={styles.SearchArea}>
                    <Icon name="search"
                        style={styles.searchIcon}
                        size={20}
                    />
                    <Text style={{ fontSize: 14 }}>What are you looking for ?</Text>
                </View>
            </TouchableWithoutFeedback>
            <Modal
                animationType="fade"
                transparent={false}
                visible={modalVisible}
            >
                <View style={styles.modal}>
                    <View style={styles.view1}>
                        <View style={styles.TextInput}>
                            <Animatable.View
                                animation={textInputFocused ? "fadeInRight" : "fadeInLeft"}
                                duration={100}
                            >
                                <Icon name="arrow-back"
                                    onPress={() => {
                                        navigation.navigate("Home");
                                        setModalVisible(false)
                                        setTextInputFocused(true)
                                    }}
                                    style={styles.icon2}
                                />
                            </Animatable.View>
                            <TextInput
                                style={styles.searchInput}
                                ref={textInput}
                                autoFocus={false}
                                placeholder="Search"
                                onChangeText={handleSearch}
                                onFocus={() => {
                                    setTextInputFocused(true);
                                    if (isempty) { getsearchItems(); }
                                }}
                                onBlur={() => {
                                    setTextInputFocused(false);
                                }}
                                onSubmitEditing={handleSearchNavigate}
                            />
                            <Animatable.View
                                animation={textInputFocused ? "fadeInLeft" : ""}
                                duration={400}
                            >
                                <Pressable onPress={() => {
                                    textInput.current.clear();
                                    handleSearch('');
                                    setisempty(true);
                                    fetchData();
                                }}>
                                    <Icon
                                        name={isempty ? null : "close-circle-outline"}
                                        size={25}
                                        style={{ marginRight: -10, color: COLORS.grey }}
                                    />
                                </Pressable>
                            </Animatable.View>
                        </View>
                    </View>
                    <ScrollView nestedScrollEnabled={true}>
                        {/* last search */}
                        {searchList.length > 0 && (<View style={{ height: (length) * 60 }}>
                            <FlatList
                                data={Object.values(searchList || {}).flat()}
                                keyExtractor={item => item.id}
                                renderItem={renderItem2}
                            />
                            <View
                                style={{
                                    borderBottomColor: 'gray',
                                    borderBottomWidth: 0.5,
                                }}

                            />
                        </View>)}
                        {/* result search */}
                        <FlatList
                            data={Object.values(data).flat()}
                            keyExtractor={item => item.id}
                            renderItem={renderItem}
                        />
                    </ScrollView>
                </View>
                {/* navigation bar */}
                <View style={styles.NavContainer}>
                    <View style={styles.Navbar}>
                        <Pressable onPress={() => {
                            navigation.navigate("profile", { userId: userId });
                            setModalVisible(false)
                            setTextInputFocused(true)
                        }} style={styles.iconBehave}>
                            <Icon name="person-outline" size={25} color={COLORS.dark} style={styles.iconBehave} />
                            <Text style={styles.Text}>profile</Text>
                        </Pressable>
                        <Pressable onPress={() => {
                            navigation.navigate("Home");
                            setModalVisible(false)
                            setTextInputFocused(true)
                        }} style={styles.iconBehave}>
                            <Icon name="home-outline" size={25} color={COLORS.dark} style={styles.iconBehave} />
                            <Text style={styles.Text}>Home</Text>
                        </Pressable>
                        <Pressable onPress={() => {
                            navigation.navigate("favorite", { userId: userId });
                            setModalVisible(false)
                            setTextInputFocused(true)
                        }} style={styles.iconBehave}>
                            <Icon name="heart-outline" size={25} color={COLORS.dark} style={styles.iconBehave} />
                            <Text style={styles.Text}>favorite</Text>
                        </Pressable>
                        <Pressable onPress={() => {
                            navigation.navigate("CartScreen", { userId: userId });
                            setModalVisible(false)
                            setTextInputFocused(true)
                        }} style={styles.iconBehave}>
                            <Icon name="cart-outline" size={25} color={COLORS.dark} style={styles.iconBehave} />
                            <Text style={styles.Text}>Cart</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
}


const styles = StyleSheet.create({
    total: {
        width: '90%',
        height: 60,
        backgroundColor: COLORS.white,
        marginLeft: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

    },
    TextInput: {
        borderWidth: 1,
        borderRadius: 12,
        marginHorizontal: 0,
        borderColor: "#86939e",
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignContent: "center",
        alignItems: "center",
        paddingLeft: 10,
        paddingRight: 10
    },
    SearchArea: {
        width: "94%",
        height: 40,
        backgroundColor: COLORS.background,
        borderWidth: 1,
        borderColor: 'black',
        flexDirection: "row",
        alignItems: "center",
        paddingLeft:10
    },
    searchIcon: {
        marginRight: 10,
    },
    view1: {
        height: 70,
        justifyContent: "center",
        paddingHorizontal: 10,
    },
    view2: {
        flexDirection: 'row',
        padding: 15,
        alignItems: 'center',
    },
    icon2: {
        fontSize: 24,
        padding: 5,
        color: COLORS.grey,
    },
    modal: {
        flex: 1
    },
    NavContainer: {
        position: 'absolute',
        alignItems: 'center',
        bottom: 1,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
    },
    Navbar: {
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        width: width,
        justifyContent: 'space-evenly',
        height: 60

    },
    iconBehave: {
        alignItems: 'center',
        marginTop: 3
    },
    Text: {
        fontWeight: "bold",
        color: COLORS.dark
    },
    searchInput: {
        width: '80%',
        borderWidth: 0,
        borderColor: 'transparent',
        height: 25,
        padding: 0,
    },
});

export default Search;