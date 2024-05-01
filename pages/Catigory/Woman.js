import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
  ActivityIndicator,
  Modal,
} from "react-native";
import COLORS from "../../Consts/Color";
import {
  doc,
  collection,
  updateDoc,
  getDocs,
  getDoc,
  arrayUnion,
} from "firebase/firestore";
import { useRef } from "react";
import { auth, db, storage } from "../../firebase";
import Food, { filterData, productt, option, size } from "../../data";
import Foodcard from "../../components/Foodcard";
import Icon from "react-native-vector-icons/FontAwesome";
import PrimaryButton from "../../components/Button";
import Header from "../Header";
import Search from "../../components/search";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomNavigator from "../../components/bar";
import { FontAwesome } from "@expo/vector-icons";
import Spinner from "react-native-loading-spinner-overlay";

const { width } = Dimensions.get("screen");
const { height } = Dimensions.get("screen");

const cardwidth = width / 2;
let iconcolor;
const ProductsListWoman = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [userId, setUserId] = useState("");
  const isFocused = useIsFocused();
  const [isPressed, setIsPressed] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef(null);
  const [activeIndexes, setActiveIndexes] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const productsCollection = collection(db, "woman");
        const productsSnapshot = await getDocs(productsCollection);
        const productsData = productsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products: ", error);
      } finally {
        setIsLoading(false);
      }
    };
    getProducts();
  }, []);

  useEffect(() => {
    const getUserId = async () => {
      const id = await AsyncStorage.getItem("USERID");
      setUserId(id);
      console.log(id);
    };
    getUserId();
  }, []);
  useEffect(() => {
    const getUserId = async () => {
      const id = await AsyncStorage.getItem("USERID");
      setUserId(id);
      console.log(id);
    };
    getUserId();
  }, []);

  const onAddToFav = async (item, index) => {
    setIsPressed(!isPressed);
    console.log(userId);
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    const { fav = [] } = userSnap.data() ?? {};
    let existingItem = fav.find((itm) => itm.id === item.id);

    if (existingItem) {
      existingItem.qty += 1;
    } else {
      fav.push({ ...item, qty: 1 });
    }
    await updateDoc(userRef, { fav });
    getFavItems();
  };

  const imageWidth = 200;

  const handleProductPress = (product) => {
    navigation.navigate("WomanDetails", { product });
  };

  const handleDotPress = (index) => {
    scrollViewRef.current.scrollTo({ x: index * imageWidth, animated: true });
    setActiveIndex(index);
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
    <TouchableOpacity onPress={() => handleProductPress(item)}>
      <View style={styles.cardView}>
        <FlatList
          horizontal
          data={item.images}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item: image, index }) => (
            <Image key={index} source={{ uri: image }} style={styles.imagee} />
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
        <View
          style={{
            // flexDirection: "row",
            marginTop: 1,
            height: 80,

            // marginHorizontal: 20,
            // justifyContent: "space-between",
          }}
        >
          <View style={{ marginTop: 10, flexDirection: "row" }}>
            <Text style={styles.Name} numberOfLines={2} ellipsizeMode="tail">
              {item.name}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
            }}
          ></View>
          {item.offer !== 0 ? (
            <>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  marginHorizontal: 10,
                  textDecorationLine: "line-through",
                }}
              >
                {item.price} EGP
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "bold",
                  marginHorizontal: 10,
                  color: "#df2600",
                }}
              >
                {item.offer}% Discount{" "}
              </Text>
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: "bold",
                  marginHorizontal: 10,
                  marginBottom: 10,
                  color: "#df2600",
                }}
              >
                {Math.floor(item.price - item.price / item.offer)} EGP
              </Text>
            </>
          ) : (
            <Text
              style={{ fontSize: 18, fontWeight: "bold", marginHorizontal: 10 }}
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
      <View style={styles.headerName}>
        <Text style={styles.Textt}> AToZ </Text>
      </View>
      <Search />

      <View style={styles.header}>
        <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={filterData}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <Pressable onPress={() => navigation.navigate(item.name)}>
              <View
                style={
                  item.name === "WOMAN"
                    ? { ...styles.smallCardSelected }
                    : { ...styles.smallCard }
                }
              >
                <View style={styles.smallCardText}>
                  <Text
                    style={
                      item.name === "WOMAN"
                        ? { ...styles.boldText }
                        : { ...styles.regularText }
                    }
                  >
                    {item.name}
                  </Text>
                </View>
              </View>
            </Pressable>
          )}
        />
      </View>
      <ScrollView>
        {/* Render "Loading..." if isLoading is true, otherwise render products */}
        {isLoading ? (
          <View>
            <Spinner
              visible={isLoading}
              customIndicator={<ActivityIndicator size="large" color="black" />}
            />
          </View>
        ) : (
          <FlatList
            numColumns={2}
            data={products}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id}
          />
        )}
        <View style={styles.bottoms}></View>
      </ScrollView>

      <BottomNavigator navigation={navigation} userId={userId} />
    </View>
  );
};
////////////////////////////////////////////////////////////////////////////////////////////

const WomanDetails = ({ route, navigation }) => {
  // const { product } = route.params;
  const { product } = route.params ? route.params : { product: {} };
  // const [products, setProducts] = React.useState('');
  const [productt, setProductt] = React.useState([]);

  const [selectedSizeIndex, setSelectedSizeIndex] = React.useState(0);
  const [selectedfav, setSelectedfav] = React.useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = React.useState(0);
  const [cartCount, setCartCount] = useState(0);
  //const navigation = useNavigation();
  const [hasCheckedOut, setHasCheckedOut] = useState(false);

  const [userId, setUserId] = useState("");
  const isFocused = useIsFocused();
  const product_id = product.id;
  const [showReviews, setShowReviews] = useState(false);
  const [comments, setComment] = useState(0);
  const [rating, setRating] = useState(0);
  const [like, setLike] = useState([0]);
  const [disLike, setDislikes] = useState([0]);
  const [reviews, setReviews] = useState([]);
  const [reviewsWithLikes, setReviewsWithLikes] = useState([]);

  const [isPaymentCompleted, setPaymentCompleted] = useState(false);
  const scrollViewRef = useRef(null);
  const [activeIndexes, setActiveIndexes] = useState({});
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleCart, setModalVisibleCart] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const [showPrice, setShowPrice] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showGoToCartButton, setShowGoToCartButton] = useState(false);

  const numberOfInitialReviews = 3;
  const categoryName="Women";

  const handleSeeAllReviews = () => {
    navigation.navigate("AllReviewsPage", { reviews });
    <Text style={styles.seeAllText}>
      See All ({reviews ? reviews.length : 0})
    </Text>;
  };
  useEffect(() => {
    const fetchItem = async (product_id) => {
      const documentSnapshot = await getDoc(doc(db, "woman", product_id));
      console.log("product ID: ", documentSnapshot.id, documentSnapshot.data());
      let tempData = [];
      tempData.push({
        id: documentSnapshot.id,
        data: {
          ...documentSnapshot.data(),
          reviews: [],
        },
      });
      setProductt(tempData);
    };
    fetchItem(product_id);
  }, []);

  useEffect(() => {
    console.log("noo " + hasCheckedOut);
    if (hasCheckedOut) {
      setHasCheckedOut(true);
      console.log("yess " + hasCheckedOut);
    }
  }, []);

  useEffect(() => {
    const getUserId = async () => {
      const id = await AsyncStorage.getItem("USERID");
      setUserId(id);
      console.log(id);
    };
    getUserId();
  }, []);

  useEffect(() => {
    if (modalVisibleCart) {
      setTimeout(() => {
        setModalVisibleCart(false);
      }, 2000);
    }
  }, [modalVisibleCart]);

  const getCartItems = async () => {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    const cartCount = userSnap?.data()?.cart?.length ?? 0;

    setCartCount(cartCount);
  };

  useEffect(() => {
    if (userId) {
      getCartItems();
      fetchAllReviews();
    }
  }, [userId]);

  const imageWidth = width;
  const handleScroll = (event, product_id) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.floor(contentOffsetX / imageWidth);
    setActiveIndexes((prevState) => ({
      ...prevState,
      [product_id]: currentIndex,
    }));
  };

  // const onAddToCart = async (item, index) => {
  //   console.log(userId);
  //   const userRef = doc(db, "users", userId);
  //   const userSnap = await getDoc(userRef);
  //   const { cart = [] } = userSnap.data() ?? {};
  //   let existingItem = cart.find((itm) => itm.id === item.id);

  //   if (existingItem) {
  //     existingItem.qty += 1;
  //   } else {
  //     cart.push({ ...item, qty: 1 });
  //   }
  //   await updateDoc(userRef, { cart });
  //   getCartItems();
  // };
  const onAddToCart = async (item, index, selectedColor, selectedSize) => {
    const newDate = new Date();
     newDate.setDate(newDate.getDate() + 2);
    console.log(userId);
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    const { cart = [] } = userSnap.data() ?? {};
    let existingItem = cart.find((itm) => itm.id === item.id);

    if (existingItem) {
      existingItem.qty += 1;
      setShowGoToCartButton(true);
    } else {
      cart.push({ ...item, qty: 1, color: selectedColor, size: selectedSize ,delivery: newDate});
    }
    await updateDoc(userRef, { cart });
    getCartItems();
    if (selectedColor && selectedSize) {
      setShowGoToCartButton(true);
      setModalVisibleCart(true);

    }else if (selectedColor || selectedSize) {
      setShowGoToCartButton(true);
      setModalVisibleCart(true);

    }
    else {
      setModalVisibleCart(true);
      setShowGoToCartButton(false);
    }

  
  };

  const handleGoToCart = () => {
    navigation.navigate("CartScreen", { userId: userId });
  };
  // const onAddToCart = async (item, selectedColor, selectedSize) => {
  //   console.log(userId);
  //   const userRef = doc(db, "users", userId);
  //   const userSnap = await getDoc(userRef);
  //   const { cart = [] } = userSnap.data() ?? {};
  //   let existingItem = cart.find((itm) => itm.id === item.id);

  //   if (selectedColor && selectedSize) {
  //     setShowGoToCartButton(true);
  //     if (existingItem) {
  //       existingItem.qty += 1;
  //     } else {
  //       cart.push({
  //         ...item,
  //         qty: 1,
  //         color: selectedColor,
  //         size: selectedSize,
  //       });
  //     }
  //     await updateDoc(userRef, { cart });
  //     getCartItems();
  //   } else {
  //     setModalVisibleCart(true);
  //     setShowGoToCartButton(false);
  //   }

  //   if (selectedColor || selectedSize) {
  //     setShowGoToCartButton(true);
  //     showGoToCartButton = true;
  //     if (existingItem) {
  //       existingItem.qty += 1;
  //     } else {
  //       cart.push({
  //         ...item,
  //         qty: 1,
  //         color: selectedColor,
  //         size: selectedSize,
  //       });
  //     }
  //     await updateDoc(userRef, { cart });
  //     getCartItems();
  //   } else {
  //     setModalVisibleCart(true);
  //     setShowGoToCartButton(false);
  //   }
  // };

  const getFavItems = async () => {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    const cartCount = userSnap?.data()?.fav?.length ?? 0;
  };
  const onAddToFav = async (item, index) => {
    setIsPressed(!isPressed);
    console.log(userId);
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    const { fav = [] } = userSnap.data() ?? {};
    let existingItem = fav.find((itm) => itm.id === item.id);

    if (existingItem) {
      existingItem.qty += 1;
    } else {
      fav.push({ ...item, qty: 1 });
    }
    await updateDoc(userRef, { fav });
    getFavItems();
  };
  const [isPressed, setIsPressed] = useState("");
  const handelHeart = async (item) => {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    const { fav = [] } = userSnap.data() ?? {};
    const existingItem = fav.find(itm => itm.id === item.id);
    
    setIsPressed(!!existingItem); 
  };
  
  useEffect(() => {
    handelHeart(product);
  }, [handelHeart]); 
  useEffect(() => {
    console.log(isPressed);
  }, [isPressed]); 

  const [Newprice, setNewprice] = useState(product.price);

  const handlePrice = (pl) => {
    const price = Newprice + pl;
    setNewprice(price);
  };

  const wordsPerLine = 7;
  const words = product.description.split(" ");
  const lines = [];
  let line = "";
  for (let i = 0; i < words.length; i++) {
    line += words[i] + " ";
    if ((i + 1) % wordsPerLine === 0 || i === words.length - 1) {
      line = "◼︎ " + line.trim();
      lines.push(line);
      line = "";
    }
  }
  const handleScroll2 = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.y;
    const screenHeight = Dimensions.get("window").height;
    const scrollThreshold = screenHeight * 0.75;
    console.log(scrollPosition);

    console.log(scrollThreshold);
    if (scrollPosition >= 210) {
      setShowPrice(true);
    } else {
      setShowPrice(false);
    }
  };

  let flagAdmin = false;
  const fetchAllReviews = async () => {
    try {
      const productRef = doc(db, "woman", product_id);
      const productDoc = await getDoc(productRef);
      const productData = productDoc.data();
      const docRef = doc(db, "users", auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      const username = docSnap.data()?.fName || "Unknown";
      const data = docSnap.data();
      if (data.isAdmin == true) {
        flagAdmin = true;
      }
      setReviews(productData.reviews || []);
      // loadLikesAndDislikes(reviews);

      if (productData.reviews && productData.reviews.length > 0) {
        const averageRating =
          productData.reviews.reduce(
            (total, review) => total + review.rating,
            0
          ) / productData.reviews.length;
        setComment(productData.reviews.length);
        setRating(averageRating);
        loadLikesAndDislikes(productData.reviews);
      } else {
        setRating(0);
        setComment(0);
      }
    } catch (error) {
      console.error("Error fetching reviews: ", error);
    }
  };

  const loadLikesAndDislikes = async (reviews) => {
    try {
      const updatedReviews = await Promise.all(
        reviews.map(async (review, index) => {
          const likeValue = await AsyncStorage.getItem(`like${index}`);
          const dislikeValue = await AsyncStorage.getItem(`disLike${index}`);
          const updatedReview = { ...review };
          updatedReview.like = likeValue ? parseInt(likeValue) : 0;
          updatedReview.disLike = dislikeValue ? parseInt(dislikeValue) : 0;

          return updatedReview;
        })
      );

      setReviewsWithLikes(updatedReviews);
      setReviews(updatedReviews);
    } catch (error) {
      console.log("Error loading likes and dislikes:", error);
    }
  };

  const handleLike = async (index) => {
    try {
      const updatedReviews = [...reviewsWithLikes];
      const updatedReview = { ...updatedReviews[index] };
      if (updatedReview.like === 0) {
        updatedReview.like = 1;
        updatedReview.disLike = 0;
        await AsyncStorage.setItem(`like${index}`, "1");
        await AsyncStorage.setItem(`disLike${index}`, "0");
      } else {
        updatedReview.like = 0;
        await AsyncStorage.setItem(`like${index}`, "0");
      }
      updatedReviews[index] = updatedReview;
      setReviewsWithLikes(updatedReviews);
      setReviews(updatedReviews);
    } catch (error) {
      console.log("Error handling like:", error);
    }
  };

const handleDislike = async (index) => {
  try {
    const updatedReviews = [...reviewsWithLikes];
    const updatedReview = { ...updatedReviews[index] };
    if (updatedReview.disLike === 0) {
      updatedReview.disLike = 1;
      updatedReview.like = 0;
      await AsyncStorage.setItem(`disLike${index}`, '1');
      await AsyncStorage.setItem(`like${index}`, '0');
    } else {
      updatedReview.dislike = 0;
      await AsyncStorage.setItem(`disLike${index}`, '0');
    }
    updatedReviews[index] = updatedReview;
    setReviewsWithLikes(updatedReviews);
    setReviews(updatedReviews);
  } catch (error) {
    console.log('Error handling dislike:', error);
  }
};

useEffect(() => {
  console.log("iam in recently use effect ");
  saveRecentlyVisited(product.id, product.name, product.categoryName,product.images,product.colors,product.description,product.offer,product.price,product.sizes);
  // console.log("iam get data ");
  console.log("produt id",product_id);
}, []);

const saveRecentlyVisited = async (id, name, categoryName, images, colors, description, offer, price, sizes) => {
  console.log("I am in save visit");
  try {
    const userRef = doc(db, "users", auth.currentUser.uid);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists) {
      const userData = userDoc.data();
      let updatedRecentlyVisited = [];
      if (userData.recentlyVisited) {
        const productExists = userData.recentlyVisited.some(item => item.id === id);
        if (!productExists) {
          updatedRecentlyVisited = [
            {
              id: id,
              name: name,
              categoryName: categoryName,
              image: images,
              colors: colors,
              description: description,
              offer: offer,
              price: price,
              sizes: sizes
            },
            ...userData.recentlyVisited
          ];
        } else {
          console.log("Product already exists in recentlyVisited");
          updatedRecentlyVisited = [...userData.recentlyVisited];
        }
      } else {
        updatedRecentlyVisited = [{
          id: id,
          name: name,
          categoryName: categoryName,
          image: images,
          colors: colors,
          description: description,
          offer: offer,
          price: price,
          sizes: sizes
        }];
      }
      if (updatedRecentlyVisited.length > 10) {
        updatedRecentlyVisited.splice(10);
        console.log("More than 10 items, removing the oldest ones.");
      }
      await updateDoc(userRef, { recentlyVisited: updatedRecentlyVisited });
      console.log("Data added to recentlyVisited successfully");
    } else {
      console.log("User document not found");
    }
  } catch (error) {
    console.error('Error', error);
  }
};



  return (
    <View style={styles.productContainer}>
      <ScrollView onScroll={handleScroll2}>
        <View>
          <FlatList
            horizontal
            data={product.images}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.productImage} />
            )}
            keyExtractor={(image, index) => index.toString()}
            onScroll={(event) => handleScroll(event, product.id)}
          />
          <View style={styles.dotsContainerDetails}>
            {product.images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dotDetails,
                  index === (activeIndexes[product.id] || 0)
                    ? styles.activeDotDetails
                    : null,
                ]}
              />
            ))}
          </View>
          <View
            style={{
              marginTop: 2,
              height: 500,
              backgroundColor: "white",
            }}
          >
            <View style={{ width: width }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                {/* العمود الأول */}
                <View style={{ width: "50%" }}>
                  <Text style={styles.NameD}>{product.name}</Text>
                  {product.offer !== 0 ? (
                    <>
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "bold",
                          marginHorizontal: 10,
                          textDecorationLine: "line-through",
                        }}
                      >
                        {product.price} EGP
                      </Text>

                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: "bold",
                          marginHorizontal: 9,
                          color: "#df2600",
                        }}
                      >
                        🏷️ {product.offer}% Discount{" "}
                        <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                          {Math.floor(
                            product.price - product.price / product.offer
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
                      {product.price} EGP
                    </Text>
                  )}
                </View>

                {/* العمود الثاني */}
                <View
                  style={{
                    width: "50%",
                    alignItems: "flex-end",
                    marginTop: 10,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Icon
                        name={star <= rating ? "star" : "star-o"}
                        size={20}
                        color="black"
                      />
                    ))}
                    <Text style={{ fontSize: 15 }}> ({comments})</Text>
                    {reviews.length > 0 && (
                      <TouchableOpacity onPress={handleSeeAllReviews}>
                        <Text style={{ fontSize: 18 }}>{">"}</Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  <Text
                    style={{
                      color: "#131A2C",
                      fontSize: 12,
                      marginTop: 15,
                      marginRight: 5,
                    }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    Product Code: {product.id.substring(0, 11)}
                  </Text>
                </View>
              </View>
            </View>

            <View>
              {product.colors.length > 1 && (
                <View style={styles.colorsContainer}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "bold",
                      marginLeft: 10,
                    }}
                  >
                    Choose Color:{" "}
                  </Text>
                  <FlatList
                    horizontal
                    data={product.colors}
                    keyExtractor={(color, index) => index.toString()}
                    renderItem={({ item }) => {
                      let buttonStyle = [
                        styles.colorButton,
                        { backgroundColor: item },
                      ];
                      if (selectedColor === item) {
                        if (item === "black") {
                          buttonStyle.push(styles.blackButtonStyle);
                        } else {
                          buttonStyle.push(styles.selectedColorButton);
                        }
                      }
                      return (
                        <TouchableOpacity
                          style={buttonStyle}
                          onPress={() => setSelectedColor(item)}
                        />
                      );
                    }}
                  />
                </View>
              )}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    marginTop: 5,
                    marginLeft: 10,
                  }}
                >
                  Sizes Options
                </Text>

                <TouchableOpacity onPress={() => setModalVisible(true)}>
                  <Text style={{ color: "black" }}>
                    {" "}
                    <Image
                      source={require("../../assets/chart.png")}
                      style={{ width: 25, height: 25, marginBottom: -8 }}
                    />
                    Chart Size{" "}
                  </Text>
                </TouchableOpacity>
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={modalVisible}
                  onRequestClose={() => setModalVisible(false)}
                >
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => setModalVisible(false)}
                      style={{ position: "absolute", top: 20, right: 20 }}
                    >
                      <Text style={{ color: "white", fontSize: 18 }}>✖️</Text>
                    </TouchableOpacity>
                    <Image
                      source={require("../../assets/womanSize.webp")}
                      style={{
                        width: "80%",
                        height: "80%",
                        resizeMode: "contain",
                      }}
                    />
                  </View>
                </Modal>
              </View>
              <View style={styles.sizesContainer}>
                <FlatList
                  horizontal
                  data={product.sizes}
                  keyExtractor={(size, index) => index.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.sizeButton,
                        selectedSize === item && styles.selectedSizeButton,
                      ]}
                      onPress={() => setSelectedSize(item)}
                    >
                      {selectedSize === item && (
                        <Icon
                          name="check"
                          size={15}
                          color="black"
                          style={{
                            position: "absolute",
                            top: -5,
                            right: -5,
                            backgroundColor: "white",
                          }}
                        />
                      )}
                      <Text style={[styles.sizeText, styles.sizeButtonText]}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </View>
            <View style={styles.line}></View>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                marginTop: 5,
                marginLeft: 10,
              }}
            >
              Product Information
            </Text>
            {lines.map((line, index) => (
              <Text key={index} style={styles.description}>
                {line}
              </Text>
            ))}

            <View style={styles.container}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {reviews.length > 0 && (
                  <Text
                    style={{ fontSize: 20, fontWeight: "bold", marginTop: 20 }}
                  >
                    Evaluation {"\n"} {rating.toFixed(1)}
                  </Text>
                )}
                {reviews.length > 0 && (
                  <TouchableOpacity onPress={handleSeeAllReviews}>
                    <Text
                      style={{
                        textDecorationLine: "underline",
                        marginLeft: 138,
                        fontSize: 15,
                      }}
                    >
                      {comments} COMMENT | See All{" "}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              <FlatList
                data={reviewsWithLikes.slice(0, numberOfInitialReviews)}
                renderItem={({ item, index }) => (
                  <View style={styles.reviewContainer}>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text style={styles.reviewText}>{item.username} </Text>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Icon
                          name={star <= item.rating ? "star" : "star-o"}
                          size={17}
                          color="black"
                        />
                      ))}
                      <Text style={{ marginLeft: 180, color: "black" }}>
                        {item.date}{" "}
                      </Text>
                      {"\n"}
                    </View>
                    <Text style={[styles.reviewText, { marginTop: 15 }]}>
                      {item.comment}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: 5,
                        marginLeft: 290,
                        marginBottom: 5,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => handleLike(index)}
                        style={styles.likeButton}
                      >
                        <Icon
                          name={item.like === 1 ? "thumbs-up" : "thumbs-o-up"}
                          size={20}
                          color="black"
                        />
                      </TouchableOpacity>
                      <Text style={{ marginHorizontal: 10 }}>
                        ({item.like})
                      </Text>
                      <TouchableOpacity
                        onPress={() => handleDislike(index)}
                        style={styles.dislikeButton}
                      >
                        <Icon
                          name={
                            item.disLike === 1 ? "thumbs-down" : "thumbs-o-down"
                          }
                          size={20}
                          color="black"
                        />
                      </TouchableOpacity>
                      <Text style={{ marginHorizontal: 10 }}>
                        ({item.disLike})
                      </Text>
                    </View>
                  </View>
                )}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          </View>
        </View>
        <View>
          {
            <TouchableOpacity
              style={styles.addToCartBton1}
              onPress={() =>
                navigation.navigate("AddReviewWoman", {
                  product: { id: product_id },
                  fetchAllReviews,
                })
              }
            >
              <Text style={styles.buttonText}>Add a Review</Text>
            </TouchableOpacity>
          }
        </View>
      </ScrollView>
      <View style={styles.bottomBar}>
        <View style={styles.Navbarr}>
          <FlatList
            data={productt}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                key={index}
                activeOpacity={0.8}
                onPress={() => setSelectedOptionIndex(index)}
              >
                {showPrice ? (
                  <View style={styles.buttonContainer}>
                    <Text style={styles.priceText}>
                      {" "}
                      {product.offer !== 0 ? (
                        <>
                          <Text
                            style={{
                              fontSize: 12,
                              fontWeight: "bold",
                              marginLeft: 10,
                              marginRight: 40,
                              color: "white",
                              backgroundColor: "#df2600",
                              width: 90,
                              height: 22,
                            }}
                          >
                            {product.offer}% Discount{"\n"}
                          </Text>
                          <Text
                            style={{
                              fontSize: 16,
                              fontWeight: "bold",
                              color: "#df2600",
                              marginLeft: 14,
                            }}
                          >
                            {Math.floor(
                              product.price - product.price / product.offer
                            )}{" "}
                            EGP
                          </Text>
                        </>
                      ) : (
                        <Text
                          style={{
                            fontSize: 18,
                            fontWeight: "bold",
                            marginHorizontal: 10,
                            marginRight: 45,
                          }}
                        >
                          {product.price} EGP
                        </Text>
                      )}
                    </Text>

                    <View style={styles.container}>
                      <TouchableOpacity
                        style={styles.addToCartBton2}
                        onPress={() => {
                          if (product.colors.length !== 1) {
                            if (selectedColor && selectedSize) {
                              onAddToCart(
                                item,
                                index,
                                selectedColor,
                                selectedSize
                              );
                            } else {
                              setModalVisibleCart(true);
                            }
                          } else {
                            if (selectedColor || selectedSize) {
                              onAddToCart(
                                item,
                                index,
                                selectedColor,
                                selectedSize
                              );
                            } else {
                              setModalVisibleCart(true);
                            }
                          }
                        }}
                      >
                        <Text style={styles.addToCartButtonText}>
                          Add to Cart
                        </Text>
                      </TouchableOpacity>
                      <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisibleCart}
                        onRequestClose={() => {
                          setModalVisibleCart(false);
                        }}
                      >
                        <View style={styles.modalContainer}>
                          <View style={styles.modalContent}>
                            {product.colors.length !== 1 ? (
                              selectedColor && selectedSize ? (
                                <>
                                  <Text style={styles.modalText}>
                                    Item added to cart!
                                  </Text>
                                  {setShowGoToCartButton(true)}
                                </>
                              ) : (
                                <Text style={styles.modalText}>
                                  Please select a size and color if available
                                </Text>
                              )
                            ) : selectedColor || selectedSize ? (
                              <>
                                <Text style={styles.modalText}>
                                  Item added to cart!
                                </Text>
                                {setShowGoToCartButton(true)}
                              </>
                            ) : (
                              <Text style={styles.modalText}>
                                Please select a size and color if available
                              </Text>
                            )}

                            <TouchableOpacity
                              style={styles.okButton}
                              onPress={() => {
                                setShowGoToCartButton(!showGoToCartButton);
                              }}
                            >
                              {showGoToCartButton ? (
                                <TouchableOpacity
                                  style={styles.okButton}
                                  onPress={handleGoToCart}
                                >
                                  <Text style={styles.okButtonText}>
                                    go to cart
                                  </Text>
                                </TouchableOpacity>
                              ) : (
                                <TouchableOpacity style={styles.okButton}>
                                  <Text style={styles.okButtonText}>OK</Text>
                                </TouchableOpacity>
                              )}
                            </TouchableOpacity>
                          </View>
                        </View>
                      </Modal>
                    </View>
                  </View>
                ) : (
                  <View style={styles.buttonContainer}>
                    <Pressable onPress={() => onAddToFav(item, index)}>
                      <Icon
                        name="heart"
                        size={30}
                        color={isPressed ? "black" : "grey"}
                      />
                    </Pressable>
                    <View style={styles.container}>
                      <TouchableOpacity
                        style={styles.addToCartBton1}
                        onPress={() => {
                          if (product.colors.length !== 1) {
                            if (selectedColor && selectedSize) {
                              onAddToCart(
                                item,
                                index,
                                selectedColor,
                                selectedSize
                              );
                            } else {
                              setModalVisibleCart(true);
                            }
                          } else {
                            if (selectedColor || selectedSize) {
                              onAddToCart(
                                item,
                                index,
                                selectedColor,
                                selectedSize
                              );
                            } else {
                              setModalVisibleCart(true);
                            }
                          }
                        }}
                      >
                        <Text style={styles.addToCartButtonText}>
                          Add to Cart
                        </Text>
                      </TouchableOpacity>
                      <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisibleCart}
                        onRequestClose={() => {
                          setModalVisibleCart(false);
                        }}
                      >
                        <View style={styles.modalContainer}>
                          <View style={styles.modalContent}>
                            {product.colors.length !== 1 ? (
                              selectedColor && selectedSize ? (
                                <>
                                  <Text style={styles.modalText}>
                                    Item added to cart!
                                  </Text>
                                  {setShowGoToCartButton(true)}
                                </>
                              ) : (
                                <Text style={styles.modalText}>
                                  Please select a size and color if available
                                </Text>
                              )
                            ) : selectedColor || selectedSize ? (
                              <>
                                <Text style={styles.modalText}>
                                  Item added to cart!
                                </Text>
                                {setShowGoToCartButton(true)}
                              </>
                            ) : (
                              <Text style={styles.modalText}>
                                Please select a size and color if available
                              </Text>
                            )}

                            <TouchableOpacity
                              style={styles.okButton}
                              onPress={() => {
                                setShowGoToCartButton(!showGoToCartButton);
                              }}
                            >
                              {showGoToCartButton ? (
                                <TouchableOpacity
                                  style={styles.okButton}
                                  onPress={handleGoToCart}
                                >
                                  <Text style={styles.okButtonText}>
                                    go to cart
                                  </Text>
                                </TouchableOpacity>
                              ) : (
                                <TouchableOpacity style={styles.okButton}>
                                  <Text style={styles.okButtonText}>OK</Text>
                                </TouchableOpacity>
                              )}
                            </TouchableOpacity>
                          </View>
                        </View>
                      </Modal>
                    </View>
                  </View>
                )}

                <View></View>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  headerWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    marginHorizontal: 1,
    marginBottom: 20,
    marginTop: 20,
    // borderRadius: 15,
    width: cardwidth,
    // width:220,
    height: 370,
    elevation: 13,
    backgroundColor: "white",
  },
  image: {
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    height: 150,
    width: 170,
  },

  Name: {
    fontSize: 14,
    // fontWeight: 'bold',
    color: "#131A2C",
    marginTop: 0,
    marginLeft: 10,
    marginBottom: 0,
    // left: 200,
  },
  titlesWrapper: {
    paddingHorizontal: 5,
    marginTop: 5,
  },
  Name2: {
    fontFamily: "Montserrat-Bold",
    fontSize: 32,
    color: COLORS.dark,
  },
  priceWrapper: {
    marginTop: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  price: {
    color: COLORS.dark,
    fontFamily: "Montserrat-Bold",
    fontSize: 24,
  },
  HeartIcone: {
    height: 30,
    width: 30,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  sizeContainer: {
    paddingVertical: 20,
    alignItems: "center",
    paddingHorizontal: 10,
  },
  size: {
    height: 30,
    width: 100,
    marginRight: 7,
    borderRadius: 30,
    alignItems: "center",
    paddingHorizontal: 5,
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFF",
    //flexDirection:"row",
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  container2: {
    flex: 1,
    backgroundColor: "#FBFAFF",
    flexDirection: "row",

    // alignItems: 'center',
    // justifyContent: 'center',
  },
  heading: {
    color: "WHITE",
    fontSize: 40,
    alignItems: "center",
    marginBottom: 5,
  },
  header: {
    flexDirection: "row",
    backgroundColor: "#FBFAFF",
    height: 70,
  },
  bottoms: {
    flexDirection: "row",
    backgroundColor: "#FBFAFF",
    height: 35,
    bottom: 20,
  },
  headerText: {
    color: "#131A2C",
    fontSize: 17,
    fontWeight: "bold",
    alignItems: "center",
    marginLeft: 10,
    marginBottom: 10,
    marginTop: 10,
  },
  Text: {
    color: "#0B0E21",
    fontSize: 40,
    fontWeight: "bold",
    alignItems: "center",
  },
  discribtion: {
    color: "#0B0E21",
    fontSize: 20,
    fontWeight: "bold",
    alignItems: "center",
  },
  imageCounter: {
    width: 200,
    height: 250,
    justifyContent: "space-evenly",
    alignItems: "center",
    padding: 10,
    left: 7,
    backgroundColor: "black",
    marginTop: 10,
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
  NavContainer: {
    position: "absolute",
    alignItems: "center",
    bottom: 5,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  Navbar: {
    flexDirection: "row",
    backgroundColor: COLORS.dark,
    width: width,
    justifyContent: "space-evenly",
    borderRadius: 30,
    height: 40,
  },
  iconBehave: {
    padding: 35,
    bottom: 30,
  },
  Textt: {
    color: COLORS.darkblue,
    fontSize: 35,
    fontFamily: "SofiaRegular",
    fontWeight: "bold",
    alignItems: "center",
  },
  headerName: {
    flexDirection: "row",
    backgroundColor: COLORS.background,
    height: "10%",
  },
  dotsContainer: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 282,
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
  imagee: {
    position: "relative",
    width: 220,
    height: 300,
    // width: width * 0.5,
    // height: width * 0.8 * 0.95,
  },
  ///////////////////add new style/////////////////
  productContainer: {
    padding: 0,
    flex: 1,
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  productDescription: {
    fontSize: 16,
    marginBottom: 10,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  productOffer: {
    fontSize: 16,
    color: "red",
    marginBottom: 10,
  },
  productImage: {
    width: width,
    height: 490,
    marginRight: 10,
  },
  dotsContainerDetails: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 475,
    //  zIndex: 1
    //marginBottom:30,
    marginLeft: 175,
  },
  dotDetails: {
    width: 5,
    height: 5,
    marginBottom: 20,
    borderRadius: 30,
    backgroundColor: "black",

    marginHorizontal: 5,
  },
  activeDotDetails: {
    marginBottom: 20,
    backgroundColor: "white",
  },

  colorsContainer: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  sizesContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 10,
  },
  colorButton: {
    width: 25,
    height: 25,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  selectedColorButton: {
    borderWidth: 3,
    borderColor: "black",
  },
  blackButtonStyle: {
    borderWidth: 2,
    borderColor: "#df2600",
  },
  sizeButton: {
    width: 70,
    height: 40,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    margin: 3,
  },
  sizeButtonText: {
    position: "relative",
  },

  selectedSizeButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "black",
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  sizeText: {
    fontSize: 16,
    color: "black",
  },
  NameD: {
    fontSize: 14,
    // fontWeight: 'bold',
    color: "#131A2C",
    marginTop: 5,
    marginLeft: 10,
    marginBottom: 0,
    // left: 200,
  },
  line: {
    width: "100%",
    height: 1,
    backgroundColor: "#b3b3b3",
    marginTop: 5,
  },

  description: {
    fontSize: 15,
    marginTop: 2,
    marginLeft: 10,
  },
  bottomBar: {
    position: "absolute",
    alignItems: "center",
    bottom: 0,
    left: 0,
    right: 0,
    // borderBottomLeftRadius: 15,
    // borderBottomRightRadius: 15,
  },
  // buttonContainer: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  //   marginBottom: 10,
  // },
  // Navbarr: {
  //   flexDirection: 'row',
  //   backgroundColor: COLORS.white,
  //   width: width,
  //   justifyContent: 'space-evenly',
  //   height: 60

  // },
  bottomBar: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderColor: "#cccccc",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  Navbarr: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 30,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "start",

    alignItems: "center",
  },
  addToCartBton1: {
    backgroundColor: "black",
    paddingHorizontal: 20,
    // paddingVertical: 10,
    // marginRight: 10,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    // marginTop:20,
    // marginBottom:10,
    marginLeft: 40,
    width: 300,
  },
  addToCartBton2: {
    backgroundColor: "black",
    paddingHorizontal: 20,

    height: 40,
    justifyContent: "center",
    alignItems: "center",

    marginLeft: 60,
    width: 150,
  },
  priceText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "black",
  },
  reviewContainer: {
    backgroundColor: "rgb(250, 250, 250)",
    // borderRadius: 10,
    padding: 5,
    marginBottom: 5,
    elevation: 3,
  },
  reviewText: {
    fontSize: 15,
    // marginTop:10
    // marginBottom: 8,
  },

  addToCartButtonText: {
    color: "white",
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 30,
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
  },
  okButton: {
    backgroundColor: "black",
    padding: 5,
    // marginTop: 5,
    // borderRadius: 5,
  },
  okButtonText: {
    color: "white",
    fontSize: 16,
  },
});
export { ProductsListWoman, WomanDetails };
