import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, Dimensions, CheckBox, ScrollView, TouchableOpacity, Pressable } from 'react-native';
import COLORS from '../Consts/Color';
import Search from '../components/search';
import { filterData } from '../data';
const { width } = Dimensions.get('screen');
const { height: screenHeight } = Dimensions.get('window');
const cardheight = screenHeight / 2 - 30;
const cardwidth = width / 2;
const offer = ({ route, navigation }) => {
    const  offerData  = route.params;
    console.log(offerData)
    const [indexCheck, setIndexCheck] = useState("0")
    const [activeIndexes, setActiveIndexes] = useState({});
    const handleProductPress = async (product, Category) => {
        try {
            if (Category === "KIDS") {
                navigation.navigate('KidsDetails', { product });
            } else if (Category === "MEN") {
                navigation.navigate('MenDetails', { product });
            } else if (Category === "BABY") {
                navigation.navigate('BabyDetails', { product });
            } else {
                navigation.navigate('WomanDetails', { product });
            }

        } catch (error) {
            console.error("Error fetching product: ", error);
        }
    };
    const renderItem = ({ item, index }) => (
        <TouchableOpacity onPress={() => { handleProductPress(item, item.categoryName) }}>
            <View style={styles.cardView}>
                <FlatList
                    horizontal
                    data={item.images}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item: image, index }) => (
                        <Image key={index} source={{ uri: image }} style={styles.image} />
                    )}
                    keyExtractor={(image, index) => index.toString()}
                    onScroll={(event) => handleScroll(event, item.id)}
                />
                <View style={styles.dotsContainer}>
                    {item.images.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                index === (activeIndexes[item.id] || 0)
                                    ? styles.activeDot
                                    : null,
                            ]}
                        />
                    ))}
                </View>


                <Text style={styles.Name}>{item.name}</Text>
                <View style={{ flexDirection: "row", marginTop: 10, marginHorizontal: 10, justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.price}EGP</Text>

                </View>
            </View>
        </TouchableOpacity>
    );
    const handleScroll = (event, productId) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const currentIndex = Math.floor(contentOffsetX / imageWidth);
        setActiveIndexes((prevState) => ({
          ...prevState,
          [productId]: currentIndex,
        }));
      };
    
    return (
        <View style={styles.container}>

            <View style={styles.header}>
                <Text style={styles.Text}> AToZ </Text>
            </View>
            <Search />

            <ScrollView>

                <View>
                    <FlatList
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        data={filterData}
                        keyExtractor={(item) => item.id}
                        extraData={indexCheck}
                        renderItem={({ item, index }) => (
                            <Pressable
                                onPress={() => navigation.navigate(item.name)}
                            >
                                <View style={[styles.smallCard, indexCheck === item.id ? styles.selectedCard : null]}>
                                    <View>
                                        <Text style={[styles.smallCardText, indexCheck === item.id ? styles.selectedCardText : null]}>{item.name}</Text>
                                    </View>
                                </View>
                            </Pressable>
                        )}
                    />

                </View>
                <View style={styles.containerItem}>
                <FlatList
                    numColumns={2}
                    data={offerData}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                />
                </View>
            </ScrollView>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    containerItem: {

        backgroundColor: COLORS.white
    },
    container2: {
        flex: 1,
        padding: 5,
        marginBottom: 5,
    },
    heading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    itemcount: {
        fontSize: 18,
        marginBottom: 10,
        color: '#808B96',
        marginLeft: 'auto',
    },
    checkboxContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '98%'
    },
    headcontener: {
        flexDirection: 'row',
        alignContent: 'space-between',
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
        fontSize: 14,
    },
    selectedCategory: {
        backgroundColor: 'black',
        color: 'white',
    },
    cardView: {
        marginBottom: 20,
        marginTop: 20,
        borderRadius: 15,
        width: cardwidth,
        height: cardheight + 20,
        elevation: 13,
        backgroundColor: 'white',
    },
    dotsContainer: {
        position: "absolute",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: cardheight - 90,
        //  zIndex: 1
        //marginBottom:30,
    },
    dot: {
        width: 40,
        height: 2,
        marginBottom: 20,
        // borderRadius: 5,
        backgroundColor: "black",

        marginHorizontal: 5,
    },
    activeDot: {
        marginBottom: 20,
        backgroundColor: "white",
    },

    scrollView: {
        height: 200,
    },
    image: {
        position: "relative",
        height: cardheight - 80,
        width: cardwidth,

    },
    Name: {
        fontSize: 14,
        fontWeight: 'bold',
        color: "#131A2C",
        marginTop: 5,
        marginLeft: 10,
        marginBottom: 10,
        height: 40

    },
    header: {
        flexDirection: "row",
        backgroundColor: COLORS.background,
        height: '10%',
        alignItems: 'center',
        textAlign: 'center'
    },
    Text: {
        color: COLORS.darkblue,
        fontSize: 35,
        fontFamily: 'SofiaRegular',
        fontWeight: "bold",
        alignItems: 'center',
    },
    result: {
        fontSize: 20,
        fontWeight: 'bold',
        color: "#131A2C",
        marginTop: 5,
        marginLeft: 10,
        marginBottom: 10,
    },smallCard: {
        // borderRadius: 30,
        backgroundColor: COLORS.background,
        justifyContent: "center",
        alignItems: 'center',
        width: 100,
        height: 70
    },

    smallCardText: {
        fontWeight: "bold",
        color: '#131A2C'
    },

    selectedCard: {

        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    smallCardText: {
    },
    selectedCardText: {
        color: 'black',
    },
});
export default offer;