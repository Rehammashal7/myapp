import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Pressable,
  Dimensions,
  ScrollView,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useIsFocused, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, collection, where, setDoc, updateDoc, getDocs, getDoc } from "firebase/firestore";
import { auth, db, storage } from '../firebase';
import Icon from 'react-native-vector-icons/FontAwesome';
import BottomNavigator from '../components/bar';
import COLORS from '../Consts/Color';
import Search from '../components/search';
import { card } from '../Consts/styles';

const { width } = Dimensions.get('screen');
const { height: screenHeight } = Dimensions.get('window');
const cardheight = screenHeight / 2 - 30;
const cardwidth = width / 2;

const Favorite = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [favList, setFavList] = useState([]);
  const [activeIndexes, setActiveIndexes] = useState({});
  const route = useRoute();
  const [userId, setUserId] = useState(route.params.userId);
  const imageWidth = cardwidth;

  useEffect(() => {
    getFavItems();
  }, [isFocused]);

  useEffect(() => {
    const getUserId = async () => {
      const id = await AsyncStorage.getItem('USERID');
      setUserId(id);
    };
    getUserId();
  }, []);

  const handleScroll = (event, productId) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.floor(contentOffsetX / imageWidth);
    setActiveIndexes((prevState) => ({
      ...prevState,
      [productId]: currentIndex,
    }));
  };

  const getFavItems = async () => {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    setFavList(userSnap.get('fav'));
  };

  const deleteItem = async (index) => {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    let tempfav = userSnap.data().fav;
    tempfav.splice(index, 1);
    await updateDoc(userRef, { fav: tempfav });
    getFavItems();
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
    try {
      const categoryId = Category ? Category.toLowerCase() : "woman";
      const retrievedProduct = await getProductById(categoryId, product.id);

      if (retrievedProduct) {
        if (Category === "KIDS") {
          navigation.navigate('KidsDetails', { product: retrievedProduct });
        } else if (Category === "MEN") {
          navigation.navigate('MenDetails', { product: retrievedProduct });
        } else if (Category === "BABY") {
          navigation.navigate('BabyDetails', { product: retrievedProduct });
        } else {
          navigation.navigate('WomanDetails', { product: retrievedProduct });
        }
      } else {
        console.error("Product not found!");
      }
    } catch (error) {
      console.error("Error fetching product: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.Texts, { textAlign: 'center' }]}>Favorite</Text>
      </View>
      <Search />
      <ScrollView nestedScrollEnabled={true}>
        <FlatList
          numColumns={2}
          data={favList}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity onPress={() => handleProductPress(item, item.data.categoryName)}>
                <View style={styles.container}>
                  <View style={card.cardView}>
                    <FlatList
                      horizontal
                      data={item.data.images}
                      showsHorizontalScrollIndicator={false}
                      renderItem={({ item: image, index }) => (
                        <Image key={index} source={{ uri: image }} style={card.imagee} />
                      )}
                      keyExtractor={(image, index) => index.toString()}
                      onScroll={(event) => handleScroll(event, item.id)}
                    />
                    <View style={card.dotsContainer}>
                      {item.data.images.map((_, index) => (
                        <View
                          key={index}
                          style={[
                            card.dot,
                            index === (activeIndexes[item.id] || 0)
                              ? card.activeDot
                              : null,
                          ]}
                        />
                      ))}
                    </View>
                    <View style={{ height: 100 }}>
                    <Text style={card.Name} numberOfLines={2} ellipsizeMode="tail">
                        {item.data.name}
                    </Text>
                    {item.data.offer !== 0 ? (
                        <>
                            <Text
                                style={card.pricewithoffer}
                            >
                                {item.data.price} EGP
                            </Text>

                            <Text
                                style={card.offer}
                            >
                                🏷️{item.data.offer}% Discount{" "}
                                <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                                    {Math.floor(
                                        item.data.price - item.data.price / item.data.offer
                                    )}{" "}
                                    EGP
                                </Text>
                            </Text>
                        </>
                    ) : (
                        <Text
                            style={card.price}
                        >
                            {item.data.price} EGP
                        </Text>
                    )}
                </View>
                    <View style={styles.containerHeart}>
                      <Pressable
                        onPress={() => {
                          let existingItem = favList.find(itm => itm.id === item.id)
                          if (existingItem.qty >= 1) {
                            deleteItem(index);
                          } else {
                            deleteItem(index);
                          }
                        }} style={styles.addToFavBtn}>
                        <Icon name="heart" size={25} color={item.qty >= 1 ? COLORS.dark : 'gray'} />
                      </Pressable>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
        <View style={styles.bottoms}></View>
      </ScrollView>
      <BottomNavigator item="fav" navigation={navigation} userId={userId} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white
  },
  header: {
    flexDirection: "row",
    backgroundColor: COLORS.background,
    height: '10%',
    alignItems: 'center',
    textAlign: 'center'
  },
  Texts: {
    color: COLORS.darkblue,
    fontSize: 35,
    fontFamily: 'SofiaRegular',
    fontWeight: "bold",
    alignItems: 'center',
    marginLeft: width / 2 - 80
  },
  cardView: {
    marginBottom: 20,
    marginTop: 20,
    borderRadius: 5,
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
  },
  dot: {
    width: (cardwidth / 4) - 10,
    height: 2,
    marginBottom: 15,
    backgroundColor: "black",
    marginHorizontal: 5,
  },
  activeDot: {
    marginBottom: 15,
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
      marginBottom: 5,
      height: 40,
      width: cardwidth - 20

  },
  containerHeart: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 40,
    alignItems: 'center',
  },
  addToFavBtn: {
    paddingTop: 10,
    paddingBottom: 8,
    right: 10,
    borderRadius: 10,
    alignItems: 'center',
    width: 25,
    justifyContent: 'center',
    marginLeft: 20
  },
  bottoms: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    height: 50,
    bottom: 20
  },
});
export default Favorite;
