import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Pressable,
  ScrollView,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import { collection, doc, getDoc, getDocs  } from "firebase/firestore";
import { db } from "../firebase";
// import filterData from '../data';
import Food, { filterData, productt, option, size } from "../data";
import Icon from "react-native-vector-icons/Ionicons";
//import Icon from 'react-native-vector-icons/FontAwesome';
import { Octicons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../Consts/Color";
import Search from "../components/search";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomNavigator from "../components/bar";
import { useIsFocused } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
// import Carousel from 'react-native-snap-carousel';
import Homestyles from "../Consts/styles";

const { width } = Dimensions.get("screen");
const { height: screenHeight } = Dimensions.get("window");
const cardheight = screenHeight / 2 - 30;
const cardwidth = width / 2;

const HomeScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [indexCheck, setIndexCheck] = useState("0");
  const [products, setProducts] = useState([]);
  const [TRENDS, setTRENDS] = useState([]);
  const [userId, setUserId] = useState("");
  const [activeIndexes, setActiveIndexes] = useState({});
  const imageWidth = cardwidth;
  const isFocused = useIsFocused();
  const auth = getAuth();
  const hasFetchedData = useRef(false);

  useEffect(() => {
    getUser();
  }, [isFocused]);

    useEffect(() => {
    if (!hasFetchedData.current) {
      const fetchData = async () => {
        const collections = ["woman", "men", "kids", "baby"];
        const allProducts = [];

        for (const collectionName of collections) {
          const productsCollection = collection(db, collectionName);
          const productsSnapshot = await getDocs(productsCollection);
          const productsData = productsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          allProducts.push(...productsData);
        }

        const filteredProducts = allProducts.filter(
          (product) => product.offer > 0
        );
        setProducts(filteredProducts);

        const filteredTrends = allProducts.filter(
          (product) => product.rate > 2
        );
        filteredTrends.sort((a, b) => b.rate - a.rate);
        setTRENDS(filteredTrends);

        hasFetchedData.current = true;
      };
      fetchData();
    }
  }, []);
  
  useEffect(() => {
    const getUserId = async () => {
      const id = await AsyncStorage.getItem("USERID");
      setUserId(id);
    };
    getUserId();
  }, []);

  const getUser = async () => {
    const docRef = doc(db, "users", auth.currentUser.uid);
    const docSnap = await getDoc(docRef);
  };


  const handleProductPress = async (product, Category) => {
    try {
      if (Category === "KIDS") {
        navigation.navigate("KidsDetails", { product });
      } else if (Category === "MEN") {
        navigation.navigate("MenDetails", { product });
      } else if (Category === "BABY") {
        navigation.navigate("BabyDetails", { product });
      } else {
        navigation.navigate("WomanDetails", { product });
      }
    } catch (error) {
      console.error("Error fetching product: ", error);
    }
  };

  const handleScroll = (event, productId) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.floor(contentOffsetX / imageWidth);
    setActiveIndexes((prevState) => ({
      ...prevState,
      [productId]: currentIndex,
    }));
  };

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleProductPress(item, item.categoryName)}
    >
      <View style={Homestyles.cardView}>
        <Image source={{ uri: item.images[0] }} style={Homestyles.image} />

        <View style={{ height: 100 }}>
          <Text style={Homestyles.Name} numberOfLines={2} ellipsizeMode="tail">
            {item.name}
          </Text>
          {item.offer !== 0 ? (
            <>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  marginHorizontal: 10,
                  textDecorationLine: "line-through",
                  height: 20,
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
                  height: 40,
                  marginTop: 5,
                }}
              >
                🏷️{item.offer}% Discount{" "}
                <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                  {Math.floor(item.price - item.price / item.offer)} EGP
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

  const data = [
    {
      imageUrl:
        "https://cdn.youcan.shop/stores/f725985ece28459e35d7975512972572/others/JJucRU3iTsV1W9zkOqLBOOZONn5iKIIZXEvuuvIf.png",
    },
    {
      imageUrl:
        "https://ashtonscorner.com/cdn/shop/files/ACB_-_Kids_20_Fashion_Sale.jpg?v=1705717296&width=3000",
    },
    {
      imageUrl:
        "https://img.freepik.com/free-psd/sales-banner-template-with-image_23-2148149654.jpg?size=626&ext=jpg&ga=GA1.1.1224184972.1714003200&semt=ais",
    },
    {
      imageUrl:
        "https://img.freepik.com/free-photo/big-sale-discounts-products_23-2150336701.jpg",
    },
  ];
  const carouselRef = useRef(null);

  const renderItem = ({ item }) => (
    <View style={{ alignItems: "center", width: "110%" }}>
      <Image
        source={{ uri: item.imageUrl }}
        style={{ width: "100%", height: 200 }}
      />
    </View>
  );
  return (
    <View style={Homestyles.container}>
      <View>
        <Text style={Homestyles.Text}> AToZ </Text>
      </View>
      <Search />
      <ScrollView nestedScrollEnabled={true}>
        <View style={Homestyles.header}>
          <FlatList
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            data={filterData}
            keyExtractor={(item) => item.id}
            extraData={indexCheck}
            renderItem={({ item, index }) => (
              <Pressable onPress={() => navigation.navigate(item.name)}>
                <View
                  style={[
                    Homestyles.smallCard,
                    indexCheck === item.id
                      ? Homestyles.smallCardSelected
                      : null,
                  ]}
                >
                  <View>
                    <Text
                      style={[
                        Homestyles.regularText,
                        indexCheck === item.id
                          ? Homestyles.selectedCardText
                          : null,
                      ]}
                    >
                      {item.name}
                    </Text>
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

        <View style={Homestyles.headerTextView}>
          <Text style={[Homestyles.headerText, { color: "red" }]}>
            {" "}
            Discound product :{" "}
          </Text>
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

            <TouchableOpacity
              onPress={() => navigation.navigate("offer", products)}
              style={Homestyles.discoverButton}
            >
              <Text style={Homestyles.discoverText}>{"See All >>"}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <View style={Homestyles.headerTextView}>
          <Text style={Homestyles.headerText}>TRENDS </Text>
        </View>

        <View style={{ flexDirection: "row" }}>
          <ScrollView horizontal={true}>
            <FlatList
              style={{ marginTop: 10, marginBottom: 10 }}
              horizontal={true}
              data={TRENDS.slice(0, 3)}
              showsHorizontalScrollIndicator={false}
              renderItem={renderProduct}
              keyExtractor={(item) => item.id}
            />

            <TouchableOpacity
              onPress={() => navigation.navigate("offer", TRENDS)}
              style={Homestyles.discoverButton}
            >
              <Text style={Homestyles.discoverText}>{"See All >>"} </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
        <View style={Homestyles.bottoms}></View>
      </ScrollView>
      <Pressable
        onPress={() => navigation.navigate("Chatbot")}
        style={styles.chatIconContainer}
      >
        <Image
          source={require("../assets/bot.jpeg")}
          style={{
            width: 55,
            height: 55,
            resizeMode: "contain",
            borderRadius: 55,
          }}
        />
      </Pressable>
      <BottomNavigator item="Home" navigation={navigation} userId={userId} />
    </View>
  );
};

const styles = StyleSheet.create({
  cardView: {
    marginBottom: 20,
    marginTop: 5,
    marginRight: 5,
    borderRadius: 15,
    width: cardwidth,
    height: cardheight + 30,
    elevation: 13,
    backgroundColor: "white",
  },
  discoverButton: {
    marginBottom: 20,
    marginTop: 10,
    marginRight: 5,
    borderRadius: 15,
    width: cardwidth,
    height: cardheight + 30,
    elevation: 13,
    backgroundColor: "#ECF0F1",
  },
  discoverText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.dark,
    marginTop: (cardheight + 30) / 2,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    backgroundColor: COLORS.background,
    height: 70,
  },
  bottoms: {
    flexDirection: "row",
    backgroundColor: COLORS.background,
    height: 50,
    bottom: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    alignItems: "center",
  },
  image: {
    position: "relative",
    height: cardheight,
    width: cardwidth,
  },
  Name: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#131A2C",
    marginTop: 5,
    marginLeft: 10,
    marginBottom: 5,
    height: 40,
    width: cardwidth - 20,
  },
  Text: {
    color: COLORS.darkblue,
    fontSize: 35,
    //fontFamily: "SofiaRegular",
    fontWeight: "bold",
    alignItems: "center",
  },
  headerTextView: {
    backgroundColor: "White",
    // marginTop: 10
  },
  smallCard: {
    // borderRadius: 30,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    height: 70,
    borderBottomColor: "transparent",
    borderBottomWidth: 2,
  },
  smallCardSelected: {
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    height: 70,
    shadowColor: "black",
    borderBottomColor: "black",
    borderBottomWidth: 2,
  },
  smallCardTextSected: {
    color: "#131A2C",
  },
  regularText: {
    fontWeight: "normal",
    fontSize: 16,
  },
  boldText: {
    fontWeight: "bold",
    fontSize: 18,
  },

  smallCardText: {
    fontSize: 14,
    color: "black",
    textAlign: "center",
    marginTop: 5,
  },
  chatIconContainer: {
    position: "absolute",
    // top:550,
    bottom: 65, // ضبط المسافة من الأعلى
    right: 5, // ضبط المسافة من اليمين
  },
});

export default HomeScreen;
