import React, { useEffect, useRef, useState } from 'react';
import {
    View, Text, TextInput, Image, TouchableOpacity, StyleSheet, FlatList, Pressable,
    ScrollView, Dimensions, TouchableWithoutFeedback, Modal, Keyboard
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import COLORS from '../Consts/Color';
import Icon from 'react-native-vector-icons/FontAwesome';
import { filterData } from '../data';
import filter from 'lodash/filter'
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigation } from '@react-navigation/native';

const Search = () => {
    const navigation  = useNavigation();
    const [data, setData] = useState([])
    const [modalVisible, setModalVisible] = useState(false)
    const [textInputFossued, setTextInputFossued] = useState(true)
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [products, setProducts] = useState([]);
    const textInput = useRef(0)

    const contains = ({ name }, query) => {
        if (name.includes(query)) {
            return true
        }
        return false
    } 

    useEffect(() => {
        const getProducts = async () => {
            const productsCollection = collection(db, 'search');
            const productsSnapshot = await getDocs(productsCollection);
            const productsData = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setData(productsData);
        };
        getProducts();
    }, []);
    
    
    const handleProductPress = (product) => {
        navigation.navigate('PizzaDetails', { product })
        setModalVisible(false)
        setTextInputFossued(true)
    }
    const renderItem = ({ item }) => (
       <TouchableOpacity  onPress={() => handleProductPress(item)}>
        <View style={styles.view2}>
          <Text>{item.name}</Text>
        </View>
        </TouchableOpacity>
      );
      
  
    
    
    const handleSearch = text =>{
        const dataS = filter(data, userSearch =>{
            return contains(userSearch,text)
        })
    
        setData([...dataS])
    }
    // const handleSearch = async text => {
    //    //setSearchQuery(text);
    //     let querySnapshot = await getDocs(query(collection(db, 'pizza'), 
    //     where('searchQuery', '==', 'Margrita')));
    //     setSearchResults(querySnapshot);
    //   };
    return (
        <View style={{ alignItems: "center" }}>
            <TouchableWithoutFeedback
                onPress={() => {
                    setModalVisible(true)
                }}
            >
                <View style={styles.SearchArea}>
                    <Icon name="search"
                        style={styles.searchIcon}
                        size={25}
                    />
                    <Text style={{ fontSize: 15 }}>What are you looking for ?</Text>
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
                                animation={textInputFossued ? "fadeInRight" : "fadeInLeft"}
                                duration={100}
                            >
                                <Icon name={textInputFossued ? "arrow-left" : "search"}
                                    onPress={() => {
                                        if (textInputFossued){
                                            setModalVisible(false)
                                        setTextInputFossued(true)
                                        }
                                    }}
                                    style={styles.icon2}


                                />
                            </Animatable.View>
                            <TextInput
                                style={{width:'80%'}}
                                ref={textInput}
                                autoFocus = {false}
                                placeholder="Search"
                                onChangeText ={handleSearch}
                                

                                onFocus={() => {
                                    setTextInputFossued(true)
                                }}

                                onBlur={() => {
                                    setTextInputFossued(false)
                                }}

                                
                            />

                            <Animatable.View
                                animation={textInputFossued ? "fadeInLeft" : ""}
                                duration={400}
                            >
                                <TouchableOpacity  onPress={() => {
                                        textInput.current.clear()
                                        // handleSearch()          
                                    }}>
                                <Icon
                                    name={textInputFossued ? "times-circle" : null}
                                
                                    size={25}
                                    style={{ marginRight: -10,color:COLORS.grey }}
                                   
                                />
                                </TouchableOpacity>
                            </Animatable.View>
                        </View>
                    </View>
         <FlatList
             
             data={data}
             renderItem={renderItem}
             keyExtractor={item => item.id}

             />           


                </View>
                <View style={styles.NavContainer} >
                    <View style={styles.Navbar} >
                        
                        <Pressable onPress={() =>{ navigation.navigate("profile") 
                            setModalVisible(false)
                            setTextInputFossued(true)}} style={styles.iconBehave}>
                            <Icon name="user" size={25} color="gray" />
                        </Pressable>
                        <Pressable onPress={() =>{ navigation.navigate("Home")  
                            setModalVisible(false)
                            setTextInputFossued(true) }} style={styles.iconBehave} >
                            <Icon name="home" size={25} color={COLORS.grey} />
                        </Pressable>
                        <Pressable onPress={() => {navigation.navigate("CartScreen") 
                              setModalVisible(false)
                              setTextInputFossued(true)}} style={styles.iconBehave} >
                            <Icon name="shopping-cart" size={25} color={COLORS.grey} />
                        </Pressable>
                    </View>
                </View>
            </Modal>

        </View>

    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    },

    text1: {
        color: COLORS.grey,
        fontSize: 16
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
        marginTop: 10,
        width: "94%",
        height: 40,
        backgroundColor: COLORS.background,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: COLORS.grey,
        flexDirection: "row",
        alignItems: "center",
        padding: 10
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
})
export default Search;