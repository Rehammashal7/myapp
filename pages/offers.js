import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, Dimensions, CheckBox, ScrollView, TouchableOpacity, Pressable } from 'react-native';
import COLORS from '../Consts/Color';
import Search from '../components/search';
import { filterData } from '../data';

const { width } = Dimensions.get('screen');
const { height: screenHeight } = Dimensions.get('window');
const cardheight = screenHeight / 2 - 30;
const cardwidth = width / 2;

const Offer = ({ route, navigation }) => {
    const offerData = route.params;
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

                <View style={{ height: 110 }}>
                    <Text style={styles.Name} numberOfLines={2} ellipsizeMode="tail">{item.name}</Text>
                    {item.offer !== 0 ? (
                        <>
                            <Text
                                style={{
                                    fontSize: 18,
                                    fontWeight: "bold",
                                    marginHorizontal: 10,
                                    textDecorationLine: "line-through",
                                    height: 20
                                }}
                            >
                                {item.price} EGP
                            </Text>

                            <Text
                                style={{
                                    fontSize: 13,
                                    fontWeight: "bold",
                                    marginHorizontal: 9,
                                    color: "#df2600",
                                    height: 40
                                }}
                            >
                                🏷️ {item.offer}% Discount{" "}
                                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                                    {Math.floor(
                                        item.price - item.price / item.offer
                                    )}{" "}
                                    EGP
                                </Text>
                            </Text>
                        </>
                    ) : (
                        <Text
                            style={{
                                fontSize: 18,
                                fontWeight: "bold",
                                marginHorizontal: 10,
                            }}
                        >
                            {item.price} EGP
                        </Text>
                    )}
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
        marginTop: cardheight - 100,
    },
    dot: {
        width: 40,
        height: 2,
        marginBottom: 20,
        backgroundColor: "black",
        marginHorizontal: 5,
    },
    activeDot: {
        marginBottom: 20,
        backgroundColor: "white",
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
        //fontFamily: 'SofiaRegular',
        fontWeight: "bold",
        alignItems: 'center',
    },
    smallCard: {
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
export default Offer;