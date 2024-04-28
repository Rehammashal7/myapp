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

const { width } = Dimensions.get('screen');
const { height: screenHeight } = Dimensions.get('window');
const cardheight = screenHeight / 2 - 30;
const cardwidth = width / 2;

const favorite = ({ navigation }) => {
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
        <Text style={[styles.Text, { textAlign: 'center' }]}> Favorite </Text>
      </View>
      <Search />
      <ScrollView>
        <FlatList
          numColumns={2}
          data={favList}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity onPress={() => handleProductPress(item, item.data.categoryName)}>
                <View style={styles.container}>
                  <View style={styles.cardView}>
                    <FlatList
                      horizontal
                      data={item.data.images}
                      showsHorizontalScrollIndicator={false}
                      renderItem={({ item: image, index }) => (
                        <Image key={index} source={{ uri: image }} style={styles.image} />
                      )}
                      keyExtractor={(image, index) => index.toString()}
                      onScroll={(event) => handleScroll(event, item.id)}
                    />
                    <View style={styles.dotsContainer}>
                      {item.data.images.map((_, index) => (
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
                    <Text style={styles.Name}>{item.data.name}</Text>
                    <View style={{ flexDirection: "row", marginTop: 10, marginHorizontal: 10, justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.data.price}</Text>
                 
                  <Text style={{ fontSize: 18, fontWeight: 'bold' }}> <Text>EGP</Text> </Text>
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
        /> <View style={styles.bottoms}></View>
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
  Text: {
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
    padding: 10,
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
export default favorite;