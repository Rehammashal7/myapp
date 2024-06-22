import React, { useState, useEffect } from 'react';
import {
    View, Text, Image, TouchableOpacity, StyleSheet, FlatList,
    ScrollView, Dimensions, 
} from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

import Search from '../components/search';
import BottomNavigator from '../components/bar';
import { useRoute } from '@react-navigation/native';
import { Categorys, card } from '../Consts/styles';
const { width } = Dimensions.get('screen');
const { height: screenHeight } = Dimensions.get('window');
const cardheight = screenHeight / 2 - 30;
const cardwidth = width / 2;

const Category = ({ navigation }) => {
    const route = useRoute();
    const [userId, setUserId] = useState(route.params.userId);
    const COLORS =route.params.COLORS;
    const styles =Categorys(COLORS)
    const cards =card(COLORS);
    const handlePress = (type, name) => {
         navigation.navigate('categoryresult', { type: type, categoryName: name, userId: userId ,COLORS:COLORS });
    };

    return (
        <View style={styles.container}>
            <ScrollView nestedScrollEnabled={true}>
                <View style={styles.headerTextView}>
                    <Text style={[styles.headerText, { color: COLORS.dark }]}> Women  </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <ScrollView horizontal={true}>

                        <TouchableOpacity onPress={() => handlePress('t-shirt', 'woman')} style={styles.discoverButton}>
                            <View style={{ alignItems: 'center', width: '110%' }}>
                                <Image source={{ uri: 'https://dfcdn.defacto.com.tr/6/C1872AX_24SP_KH438_01_02.jpg' }} style={styles.slid} />
                            </View>
                            <View style={styles.containerHeart}>
                                <Text style={styles.discoverText}>{'T-Shirt'} </Text>
                            </View>
                        </TouchableOpacity>
                        
                        <TouchableOpacity onPress={() => handlePress('dress', 'woman')} style={styles.discoverButton}>
                            <View style={{ alignItems: 'center', width: '110%' }}>
                                <Image source={{ uri: 'https://5.imimg.com/data5/SELLER/Default/2023/4/303601282/DE/BG/EO/58398864/blue-one-piece-women-dress-500x500.jpg' }} style={styles.slid} />
                            </View>
                            <View style={styles.containerHeart}>
                                <Text style={styles.discoverText}>{'Dress'} </Text>
                            </View>
                        </TouchableOpacity>
                       
                        <TouchableOpacity onPress={() => handlePress('skirt', 'woman')} style={styles.discoverButton}>
                            <View style={{ alignItems: 'center', width: '110%' }}>
                                <Image source={{ uri: 'https://www.lovu.co.za/wp-content/uploads/2022/05/1684743147ac4fa8326e41703f49c1067c5dc89876_thumbnail_720x.webp.jpeg' }} style={styles.slid} />
                            </View>
                            <View style={styles.containerHeart}>
                                <Text style={styles.discoverText}>{'Skirt'} </Text>
                            </View>


                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => handlePress('trousers', 'woman')} style={styles.discoverButton}>
                            <View style={{ alignItems: 'center', width: '110%' }}>
                                <Image source={{ uri: 'https://img.ws.mms.shopee.ph/sg-11134201-22090-9q992gnkbqhv41' }} style={styles.slid} />
                            </View>
                            <View style={styles.containerHeart}>
                                <Text style={styles.discoverText}>{'Trousers'} </Text>
                            </View>
                        </TouchableOpacity>

                    </ScrollView>
                </View>
                <View style={styles.headerTextView}>
                    <Text style={[styles.headerText, { color: COLORS.dark }]}> Men  </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <ScrollView horizontal={true}>

                        <TouchableOpacity onPress={() => handlePress('t-shirt', 'men')} style={styles.discoverButton}>
                            <View style={{ alignItems: 'center', width: '110%' }}>
                                <Image source={{ uri: 'https://mendeez.com/cdn/shop/files/cool-breeze-henley-t-shirtt-shirtsmendeez-pk-0011837-441875_1b448a02-09e6-4a9d-8c40-bc026ce23f2b_1024x1024.jpg?v=1707917951' }} style={styles.slid} />
                            </View>
                            <View style={styles.containerHeart}>
                                <Text style={styles.discoverText}>{'T-Shirt'} </Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => handlePress('shirt', 'men')} style={styles.discoverButton}>
                            <View style={{ alignItems: 'center', width: '110%' }}>
                                <Image source={{ uri: 'https://assets.ajio.com/medias/sys_master/root/20230615/Xs7z/648b116042f9e729d7449239/-1117Wx1400H-466278337-white-MODEL.jpg' }} style={styles.slid} />
                            </View>
                            <View style={styles.containerHeart}>
                                <Text style={styles.discoverText}>{'Shirt'} </Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => handlePress('trousers', 'men')} style={styles.discoverButton}>
                            <View style={{ alignItems: 'center', width: '110%' }}>
                                <Image source={{ uri: 'https://5.imimg.com/data5/SELLER/Default/2023/1/BS/HZ/LL/43967183/black-2-500x500.jpg' }} style={styles.slid} />
                            </View>
                            <View style={styles.containerHeart}>
                                <Text style={styles.discoverText}>{'Trousers'} </Text>
                            </View>
                        </TouchableOpacity>

                    </ScrollView>
                </View>
                <View style={styles.headerTextView}>
                    <Text style={[styles.headerText, { color: COLORS.dark }]}> Kids  </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <ScrollView horizontal={true}>

                        <TouchableOpacity onPress={() => handlePress('boy', 'kids')} style={styles.discoverButton}>
                            <View style={{ alignItems: 'center', width: '110%' }}>
                                <Image source={{ uri: 'https://5.imimg.com/data5/SELLER/Default/2022/3/BO/EO/CL/145764327/kids-500x500.jpg' }} style={styles.slid} />
                            </View>
                            <View style={styles.containerHeart}>
                                <Text style={styles.discoverText}>{'Boys'} </Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => handlePress('girl', 'kids')} style={styles.discoverButton}>
                            <View style={{ alignItems: 'center', width: '110%' }}>
                                <Image source={{ uri: 'https://www.handrlondon.com/product_image/1673454363566%20K%20FRONT.jpg' }} style={styles.slid} />
                            </View>
                            <View style={styles.containerHeart}>
                                <Text style={styles.discoverText}>{'Girls'} </Text>
                            </View>
                        </TouchableOpacity>

                    </ScrollView>
                </View>
                <View style={styles.headerTextView}>
                    <Text style={[styles.headerText, { color: COLORS.dark }]}> Baby  </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <ScrollView horizontal={true}>

                        <TouchableOpacity onPress={() => handlePress('boy', 'baby')} style={styles.discoverButton}>
                            <View style={{ alignItems: 'center', width: '110%' }}>
                                <Image source={{ uri: 'https://www.juniorcouture.ae/on/demandware.static/-/Sites-storefront-catalog/default/dw1c39d503/01-SS23-BabyBoy.jpg' }} style={styles.slid} />
                            </View>
                            <View style={styles.containerHeart}>
                                <Text style={styles.discoverText}>{'Boys'} </Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => handlePress('girl', 'baby')} style={styles.discoverButton}>
                            <View style={{ alignItems: 'center', width: '110%' }}>
                                <Image source={{ uri: 'https://i.etsystatic.com/9170477/r/il/d427d9/3637414691/il_570xN.3637414691_hvth.jpg' }} style={styles.slid} />
                            </View>
                            <View style={styles.containerHeart}>
                                <Text style={styles.discoverText}>{'Girl'} </Text>
                            </View>
                        </TouchableOpacity>

                    </ScrollView>
                </View>
                <View style={styles.bottoms}></View>
            </ScrollView>
            <BottomNavigator item="catigory" navigation={navigation} COLORS={COLORS} />
        </View>
    )
};

const CatigoryResult = ({ route, navigation }) => {
    const type = route.params.type;
    const collectionName = route.params.categoryName;
    const [userId, setUserId] = useState(route.params.userId);
    const [products, setProducts] = useState([]);
    const [activeIndexes, setActiveIndexes] = useState({});
    const COLORS =route.params.COLORS;
    const styles =Categorys(COLORS)
    const cards =card(COLORS);
    useEffect(() => {
        const getProducts = async () => {
            try {
                const productsCollection = collection(db, collectionName);
                const productsSnapshot = await getDocs(productsCollection);
                const productsData = productsSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                const filteredProducts = productsData.filter(product => product.type === type);
                setProducts(filteredProducts);
            } catch (error) {
                console.error("Error fetching products: ", error);
            } 
        };
        getProducts();
    }, []);

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
    
    const handleScroll = (event, productId) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const currentIndex = Math.floor(contentOffsetX / cardwidth);
        setActiveIndexes((prevState) => ({
            ...prevState,
            [productId]: currentIndex,
        }));
    };

    const renderItem = ({ item, index }) => (
        <TouchableOpacity onPress={() => { handleProductPress(item, item.categoryName) }}>
            <View style={cards.cardView}>
                <FlatList
                    horizontal
                    data={item.images}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item: image, index }) => (
                        <Image key={index} source={{ uri: image }} style={cards.imagee} />
                    )}
                    keyExtractor={(image, index) => index.toString()}
                    onScroll={(event) => handleScroll(event, item.id)}
                />
                <View style={cards.dotsContainer}>
                    {item.images.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                cards.dot,
                                index === (activeIndexes[item.id] || 0)
                                    ? cards.activeDot
                                    : null,
                            ]}
                        />
                    ))}
                </View>

                <View style={{ height: 100, width: '95%' }}>
                    <Text style={cards.Name} numberOfLines={2} ellipsizeMode="tail">{item.name}</Text>
                    {item.offer !== 0 ? (
                        <>
                            <Text
                style={cards.pricewithoffer}
              >
                {item.price} EGP
              </Text>
              <Text
                style={cards.offer}
              >
                🏷️{item.offer}% Discount{" "}
                <Text style={{ fontSize: 13, fontWeight: "bold" }}>
                  {Math.floor(
                    item.price - item.price / item.offer
                  )}{" "}
                  EGP
                </Text>
              </Text>
            </>
          ) : (
            <Text
              style={cards.price}
            >
              {item.price} EGP
            </Text>
                    )}

                </View>
            </View>
        </TouchableOpacity>
    );
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.Text}> AToZ </Text>
            </View>
            <Search COLORS={COLORS} />
            <View style={styles.headerTextView}>
                <Text style={[styles.headerText, { color: COLORS.dark }]}> {collectionName.toUpperCase() + ' : ' + type.toUpperCase()}  </Text>
            </View>
            <ScrollView nestedScrollEnabled={true}>
                <View style={styles.containerItem}>
                    <FlatList
                        numColumns={2}
                        data={products}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderItem}
                    />
                </View>
                <View style={styles.bottoms}></View>
            </ScrollView>
            <BottomNavigator navigation={navigation} userId={userId} COLORS={COLORS} />
        </View>
    );

};



export { Category, CatigoryResult };