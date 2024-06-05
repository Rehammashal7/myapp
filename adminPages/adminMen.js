import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
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
import COLORS from "../Consts/Color";
import {
  doc,
  collection,
  updateDoc,
  getDocs,
  getDoc,
  query,
  where,
} from "firebase/firestore";
import { useRef } from "react";
import { auth, db, storage } from "../firebase";
import Food, { filterData, productt, option, size } from "../data";
import Foodcard from "../components/Foodcard";
import Icon from "react-native-vector-icons/FontAwesome";
import PrimaryButton from "../components/Button";
//import Header from "../Header";
import Search from "../components/search";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomNavigator from "../components/adminbar";
import { FontAwesome } from "@expo/vector-icons";
import Spinner from "react-native-loading-spinner-overlay";


const { width } = Dimensions.get("screen");
const { height } = Dimensions.get("screen");

const cardwidth = width / 2;
let iconcolor;
const AdminProductsListMen = ({ navigation }) => {
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
        const productsCollection = collection(db, "men");
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
    navigation.navigate("adminMenDetails", { product });
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
            <Pressable onPress={() => navigation.navigate('admin'+item.name)}>
              <View
                style={
                  item.name === "adminMEN"
                    ? { ...styles.smallCardSelected }
                    : { ...styles.smallCard }
                }
              >
                <View style={styles.smallCardText}>
                  <Text
                    style={
                      item.name === "adminMEN"
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

const AdminMenDetails = ({ route, navigation }) => {
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
  const [showPrice, setShowPrice] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const numberOfInitialReviews = 3;

  
  const handleSeeAllReviews = () => {
    navigation.navigate("AllReviewsPage", { reviews });
    <Text style={styles.seeAllText}>
      See All ({reviews ? reviews.length : 0})
    </Text>;
  };
//   const handleModifyPress = () => {
//     navigation.navigate("Modifyproduct", { product });
//   };

  useEffect(() => {
    const fetchItem = async (product_id) => {
      const documentSnapshot = await getDoc(doc(db, "men", product_id));
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
    console.log(userId);
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    const { cart = [] } = userSnap.data() ?? {};
    let existingItem = cart.find((itm) => itm.id === item.id);

    if (existingItem) {
      existingItem.qty += 1;
    } else {
      cart.push({ ...item, qty: 1, color: selectedColor, size: selectedSize });
    }

    await updateDoc(userRef, { cart });
    getCartItems();
  };

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
      const productRef = doc(db, "men", product_id);
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
      setReviews(updatedReviews)
  
    } catch (error) {
      console.log('Error loading likes and dislikes:', error);
    }
  };


const handleLike = async (index) => {
  try {
    const updatedReviews = [...reviewsWithLikes];
    const updatedReview = { ...updatedReviews[index] };
    if (updatedReview.like === 0) {
      updatedReview.like = 1;
      updatedReview.disLike = 0;
      await AsyncStorage.setItem(`like${index}`, '1');
      await AsyncStorage.setItem(`disLike${index}`, '0');
    } else {
      updatedReview.like = 0;
      await AsyncStorage.setItem(`like${index}`, '0');
    }
    updatedReviews[index] = updatedReview;
    setReviewsWithLikes(updatedReviews);
    setReviews(updatedReviews);

    
  } catch (error) {
    console.log('Error handling like:', error);
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
  


  return (
    <View style={styles.productContainer}>
      <ScrollView 
      onScroll={handleScroll2}>

      <View style={styles.editButtonContainer}>
  <TouchableOpacity
    style={styles.editButton}
    onPress={() => navigation.navigate('EditProductPage', { product })}
  >
    <Text style={styles.editButtonText}>Edit</Text>
  </TouchableOpacity>
</View>
        
{/* 
      <TouchableOpacity
  style={styles.editButton}
  onPress={() => navigation.navigate('EditProductPage', { product })}
>
  <Text style={styles.editButtonText}>Edit Product</Text>
</TouchableOpacity> */}
      {/* <View style={{marginLeft:50}}> 
            <PrimaryButton
            title='Edit' 
            onPress={() => navigation.navigate('EditProductPage', { product: product })}/>
            <PrimaryButton
            title='Delete' 
            onPress={() => handleDelete ()}/>
            </View> */}

      {/* <TouchableOpacity onPress={handleModifyPress} style={styles.editButton}>
  <Text style={styles.editButtonText}>Edit Product</Text>
</TouchableOpacity> */}


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
                      source={require("../assets/chart.png")}
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
                      source={require("../assets/womanSize.webp")}
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
                renderItem={({ item ,index}) => (
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
                   <TouchableOpacity onPress={() => handleLike(index)} style={styles.likeButton}>
    <Icon name={item.like === 1 ? 'thumbs-up' : 'thumbs-o-up'} size={20} color="black" />
  </TouchableOpacity>
  <Text style={{ marginHorizontal: 10 }}>({item.like})</Text> 
  <TouchableOpacity onPress={() => handleDislike(index)} style={styles.dislikeButton}>
    <Icon name={item.disLike === 1 ? 'thumbs-down' : 'thumbs-o-down'} size={20} color="black" />
  </TouchableOpacity>
  <Text style={{ marginHorizontal: 10 }}>({item.disLike})</Text>
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
                navigation.navigate("AddReviewMen", {
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
                            alert(
                              "Please select a size and color if available"
                            );
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
                            alert(
                              "Please select a size and color if available"
                            );
                          }
                        }
                      }}
                    >
                      <Text style={{ color: "white", fontSize: 18 }}>
                        {" "}
                        Add to Cart
                      </Text>
                    </TouchableOpacity>
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
                            alert(
                              "Please select a size and color if available"
                            );
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
                            alert(
                              "Please select a size and color if available"
                            );
                          }
                        }
                      }}
                    >
                      <Text style={{ color: "white", fontSize: 18 }}>
                        {" "}
                        Add to Cart
                      </Text>
                    </TouchableOpacity>
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
    editButtonContainer: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 999,
      },
      editButton: {
        bottom: 45,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
      },
      editButtonText: {
        color: 'white',
        fontSize: 16,
      },
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
    left: 200,
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
    left: 200,
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
});




// //import { ref, uploadBytes } from 'firebase/storage';
// import { getDownloadURL, getStorage, ref, uploadBytes ,uploadBytesResumable,child} from "firebase/storage";
// //import {  storage } from '../firebase';
// const EditProductPage = ({ route, navigation }) => {
// const { product } = route.params;
//     const [name, setName] = useState('');
//     const [description, setDescription] = useState('');
//     const [image, setImage] = useState(null);
  
//     const handleSubmit = async (item) => {
//       item.preventDefault();
  
//       // Upload image to Storage
//       const imageRef = ref(storage, image.name);
//       await uploadBytes(imageRef, image);
//       //const imageUrl = await imageRef.getDownloadURL();
//       const imageUrl = await getDownloadURL(imageRef);
//       const querySnapshot = await getDocs(query(collection(db, 'men'), 
//       where('name', '==', product.name)));
//       const docId = querySnapshot.docs[0].id;
//       // Add product document to Firestore
//       await updateDoc(doc(db, 'men',docId), {
//         name: name,
//         description: description,
//         imageUrl: imageUrl,
//       });
  
//       setName('');
//       setDescription('');
//       setImage(null);
//     };
    
  
//     const handleImageUpload = (e) => {
//       if (e.target.files[0]) {
//         setImage(e.target.files[0]);
//       }
//     };
  
//     return (
//     //   <form onSubmit={handleSubmit}>
//     //     <div>
//     //       <label htmlFor="name">Product Name:</label>
//     //       <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
//     //     </div>
//     //     <div>
//     //       <label htmlFor="description">Description:</label>
//     //       <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
//     //     </div>
//     //     <div>
//     //       <label htmlFor="image">Image:</label>
//     //       <input type="file" id="image" onChange={handleImageUpload} />
//     //     </div>
//     //     <button type="submit">Add Product</button>
//     //   </form>
//     <View style={styles.containerEditProduct}>
//       <View style={styles.formEditProduct}>
//         <View style={styles.inputContainerEditProduct}>
//           <Text style={styles.labelEditProduct}>Product Name:</Text>
//           <TextInput
//             style={styles.inputEditProduct}
//             value={name}
//             onChangeText={(text) => setName(text)}
//           />
//         </View>
//         <View style={styles.inputContainerEditProduct}>
//           <Text style={styles.labelEditProduct}>Description:</Text>
//           <TextInput
//             style={styles.textareaEditProduct}
//             multiline
//             value={description}
//             onChangeText={(text) => setDescription(text)}
//           />
//         </View>
//         <View style={styles.inputContainerEditProduct}>
//           {/* <Text style={styles.labelEditProduct}>Image:</Text>
//           <TouchableOpacity
//             style={styles.fileInputEditProduct}
//             onPress={handleImageUpload}
//           >
//             <Text>Select Image</Text>
//           </TouchableOpacity> */}
          
//         </View>
//         <View style={{marginBottom : 10 }}>
//         <label htmlFor="image">Image:</label>
//          <input type="file" id="image" onChange={handleImageUpload} />
//          </View>
//         <TouchableOpacity
//           style={styles.buttonEditProduct}
//           onPress={handleSubmit}
//         >

//           <Text style={styles.buttonTextEditProduct}>Edit Product</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//       );
//import React, { useState, useEffect } from "react";
//import { View, Text, TextInput, TouchableOpacity } from 'react-native';

 import { getDownloadURL, getStorage, ref, uploadBytes ,uploadBytesResumable,child} from "firebase/storage";
// const EditProductPage = ({ route, navigation }) => {
//   const { product } = route.params;
//   const storage = getStorage();
  
//   const [name, setName] = useState(product.name);
//   const [description, setDescription] = useState(product.description);
//   const[images, setImages] = useState(null);
//   const [size, setSize] = useState(product.size);
//   const [type, setType] = useState([]);
//   const [offer, Offer] = useState(product.offer);
//   const [price, Pricee] = useState(product.price);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [colors, setColors] = useState(product.colors);



//   const handleSubmit = async () => {
//     if (!name.trim() || !description.trim()) {
//         alert('Name and description cannot be empty');
//         return;
//       }

//       let imageUrls = product.imageUrls;
//       if (images) {
//         const imageRef = ref(storage, images.name);
//         await uploadBytes(imageRef, images);
//         imageUrls = await getDownloadURL(imageRef);
//       }

//       const querySnapshot = await getDocs(
//         query(collection(db, 'men'), where('id', '==', product.id))
//       );
//        const docId = querySnapshot.docs[0].id;

//     await updateDoc(doc(db, 'men', docId), {
//         name: name,
//         description: description,
//         size : size,
//         type:type,
//         colors:colors,
//         offer:offer,
//         price:price,
//         images: imageUrls,
//     });

//     setName('');
//     setDescription('');
//     setSize([]);
//     setType([]);
//     Pricee('');
//     Offer('');
//     setImages([]);
//     setSelectedItem(null);
//     setColors(''); setName('');
//     setDescription('');
//     navigation.goBack(); // Navigate back after editing
//   };

//   const handleImageUpload = (e) => {
//     if (e.target.files[0]) {
//       setImages(e.target.files[0]);
//     }
//    };
// //   return (
// //     <ScrollView>
// //       <View>
// //         <Text>Edit Product:</Text>
// //         <TextInput
// //           placeholder="Name"
// //           value={name}
// //           onChangeText={(text) => setName(text)}
// //         />
// //         <TextInput
// //           placeholder="Description"
// //           multiline
// //           value={description}
// //           onChangeText={(text) => setDescription(text)}
// //         />
// //         <TouchableOpacity onPress={handleImageUpload}>
// //           <Text>Choose Image</Text>
// //         </TouchableOpacity>
// //         <TouchableOpacity onPress={handleSubmit}>
// //           <Text>Save Changes</Text>
// //         </TouchableOpacity>
// //       </View>
// //     </ScrollView>
// //   );

//   return (
//     <ScrollView>
//       <View>
//         <Text>Edit Product:</Text>
//         <Image source={{ uri: product.imageUrl }} style={{ width: 200, height: 200 }} />
//         <TextInput
//           placeholder="Name"
//           value={name}
//           onChangeText={(text) => setName(text)}
//         />
//         <TextInput
//           placeholder="Description"
//           multiline
//           value={description}
//           onChangeText={(text) => setDescription(text)}
//         />
//         <TouchableOpacity onPress={handleImageUpload}>
//           <Text>Choose Image</Text>
//         </TouchableOpacity>
//         <TextInput
//           placeholder="Size"
//           value={size}
//           onChangeText={(text) => setSize(text)}
//         />
//         <TextInput
//           placeholder="Type"
//           value={type}
//           onChangeText={(text) => setType(text)}
//         />
//         <TextInput
//           placeholder="Colors"
//           value={colors}
//           onChangeText={(text) => setColors(text)}
//         />
//         <TextInput
//           placeholder="Offer"
//           value={offer}
//           onChangeText={(text) => setOffer(text)}
//         />
//         <TextInput
//           placeholder="Price"
//           value={price}
//           onChangeText={(text) => setPrice(text)}
//         />
//         <TouchableOpacity onPress={handleSubmit}>
//           <Text>Save Changes</Text>
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );

// }

//import React, { useState } from 'react';
//import { ScrollView, View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
//import { getDownloadURL, getStorage, ref, uploadBytes, updateDoc, doc } from "firebase/storage";

// const EditProductPage = ({ route, navigation }) => {
//   const { product } = route.params;
//   const storage = getStorage();
  
//   const [name, setName] = useState(product.name);
//   const [description, setDescription] = useState(product.description);
//   const [images, setImages] = useState(null);
//   const [size, setSize] = useState(product.size);
//   const [type, setType] = useState(product.type); // Convert array to string
//   const [offer, setOffer] = useState(product.offer);
//   const [price, setPrice] = useState(product.price);
//   const [colors, setColors] = useState(product.colors); // Convert array to string


//   const handleSubmit = async (item) => {
//     item.preventDefault();

//     // Upload image to Storage
//     const imageRef = ref(storage, image.name);
//     await uploadBytes(imageRef, image);
//     //const imageUrl = await imageRef.getDownloadURL();
//     const imageUrl = await getDownloadURL(imageRef);
//     const querySnapshot = await getDocs(query(collection(db, 'men'), 
//     where('name', '==', product.name)));
//     const docId = querySnapshot.docs[0].id;
//     // Add product document to Firestore
//     await updateDoc(doc(db, 'men',docId), {
//         name: name,
//               description: description,
//               size: size,
//               type: type, // Convert string back to array
//               colors: colors, // Convert string back to array
//               offer: offer,
//               price: price,
//              // imageUrls: imageUrls,
//       imageUrl: imageUrl,
//     });

//     setName('');
//         setDescription('');
//         setSize('');
//         setType('');
//         setOffer('');
//         setPrice('');
//         setImages(null);
//         setColors('');
//         navigation.goBack();
//   };

// //   const handleSubmit = async () => {
// //     if (!name.trim() || !description.trim()) {
// //       alert('Name and description cannot be empty');
// //       return;
// //     }

// //     let imageUrls = product.imageUrls;
// //     if (images) {
// //       const imageRef = ref(storage, images.name);
// //       await uploadBytes(imageRef, images);
// //       imageUrls = await getDownloadURL(imageRef);
// //     }

// //     await updateDoc(doc(db, 'men', product.id), { // Corrected document reference
// //       name: name,
// //       description: description,
// //       size: size,
// //       type: type, // Convert string back to array
// //       colors: colors, // Convert string back to array
// //       offer: offer,
// //       price: price,
// //       imageUrls: imageUrls, // Corrected field name
// //     });

// //     // Clear form fields after submission
// //     setName('');
// //     setDescription('');
// //     setSize('');
// //     setType('');
// //     setOffer('');
// //     setPrice('');
// //     setImages(null);
// //     setColors('');
// //     navigation.goBack(); // Navigate back after editing
// //   };

//   const handleImageUpload = (e) => {
//     if (e.target.files[0]) {
//       setImages(e.target.files[0]);
//     }
//   };

//   return (
//     <ScrollView>
//       <View>
//         <Text>Edit Product:</Text>
//         <Image source={{ uri: product.imageUrl }} style={{ width: 200, height: 200 }} />
//         <TextInput
//           placeholder="Name"
//           value={name}
//           onChangeText={(text) => setName(text)}
//         />
//         <TextInput
//           placeholder="Description"
//           multiline
//           value={description}
//           onChangeText={(text) => setDescription(text)}
//         />
//         <TouchableOpacity onPress={handleImageUpload}>
//           <Text>Choose Image</Text>
//         </TouchableOpacity>
//         <TextInput
//           placeholder="Size"
//           value={size}
//           onChangeText={(text) => setSize(text)}
//         />
//         <TextInput
//           placeholder="Type (comma-separated)"
//           value={type}
//           onChangeText={(text) => setType(text)}
//         />
//         <TextInput
//           placeholder="Colors (comma-separated)"
//           value={colors}
//           onChangeText={(text) => setColors(text)}
//         />
//         <TextInput
//           placeholder="Offer"
//           value={offer}
//           onChangeText={(text) => setOffer(text)}
//         />
//         <TextInput
//           placeholder="Price"
//           value={price}
//           onChangeText={(text) => setPrice(text)}
//         />
//         <TouchableOpacity onPress={handleSubmit}>
//           <Text>Save Changes</Text>
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// }


// const EditProductPage = ({ route, navigation }) => {
//   const { product } = route.params;
//   const storage = getStorage();
  
//   const [name, setName] = useState(product.name);
//   const [description, setDescription] = useState(product.description);
//   const [images, setImages] = useState(null);
//   const [size, setSize] = useState(product.size);
//     const [type, setType] = useState(product.type); 
//     const [offer, setOffer] = useState(product.offer);
//     const [price, setPrice] = useState(product.price);
//     const [colors, setColors] = useState(product.colors); 

//   const handleSubmit = async () => {
//     // Upload image to Storage
//     if (images) {
//       const imageRef = ref(storage, images.name);
//       await uploadBytes(imageRef, images);
//       const imageUrl = await getDownloadURL(imageRef);

//       // Update product document in Firestore
//       const querySnapshot = await getDocs(query(collection(db, 'men'), where('name', '==', product.name)));
//       const docId = querySnapshot.docs[0].id;
//       await updateDoc(doc(db, 'men', docId), {
//         name: name,
//         description: description,
//         imageUrl: imageUrl,
//         size: size,
//         type: type, 
//         colors: colors, 
//         offer: offer,
//         price: price,
//       });
//     } else {
//       // If no new image selected, update only name and description
//       const querySnapshot = await getDocs(query(collection(db, 'men'), where('name', '==', product.name)));
//       const docId = querySnapshot.docs[0].id;
//       await updateDoc(doc(db, 'men', docId), {
//         name: name,
//         description: description,
//         size: size,
//         type: type, 
//         colors: colors, 
//         offer: offer,
//         price: price,
//       });
//     }

//     // Reset state after submission
//     setName('');
//     setDescription('');
//     setImages(null);
//     setSize('');
//     setType('');
//     setOffer('');
//     setPrice('');
//     setColors([]);
//     navigation.goBack();
//   };

//   const handleImageUpload = (e) => {
//     if (e.target.files[0]) {
//       setImages(e.target.files[0]);
//     }
//   };
//   const handleColorInput = (text) => {
//     const colorsArray = text.split(',').map((color) => color.trim());
//     setColors(colorsArray);
//   };

// //   return (
// //     <View style={styles.containerEditProduct}>
// //       <View style={styles.formEditProduct}>
// //         <View style={styles.inputContainerEditProduct}>
// //           <Text style={styles.labelEditProduct}>Product Name:</Text>
// //           <TextInput
// //             style={styles.inputEditProduct}
// //             value={name}
// //             onChangeText={(text) => setName(text)}
// //           />
// //         </View>
// //         <View style={styles.inputContainerEditProduct}>
// //           <Text style={styles.labelEditProduct}>Description:</Text>
// //           <TextInput
// //             style={styles.textareaEditProduct}
// //             multiline
// //             value={description}
// //             onChangeText={(text) => setDescription(text)}
// //           />
// //         </View>
// //         <View style={styles.inputContainerEditProduct}>
// //   <Text style={styles.labelEditProduct}>Size:</Text>
// //   <TextInput
// //     style={styles.inputEditProduct}
// //     value={size}
// //     onChangeText={(text) => setSize(text)}
// //   />
// // </View>
// // <View style={styles.inputContainerEditProduct}>
// //   <Text style={styles.labelEditProduct}>Type:</Text>
// //   <TextInput
// //     style={styles.inputEditProduct}
// //     value={type}
// //     onChangeText={(text) => setType(text)}
// //   />
// // </View>
// // <View style={styles.inputContainerEditProduct}>
// //   <Text style={styles.labelEditProduct}>Colors:</Text>
// //   <TextInput
// //  style={styles.inputEditProduct}
// //  value={colors.join(', ')} // Convert array to comma-separated string
// //  onChangeText={handleColorInput}
// //   />
// // </View>
// // <View style={styles.inputContainerEditProduct}>
// //   <Text style={styles.labelEditProduct}>Offer:</Text>
// //   <TextInput
// //     style={styles.inputEditProduct}
// //     value={offer}
// //     onChangeText={(text) => setOffer(text)}
// //   />
// // </View>
// // <View style={styles.inputContainerEditProduct}>
// //   <Text style={styles.labelEditProduct}>Price:</Text>
// //   <TextInput
// //     style={styles.inputEditProduct}
// //     value={price}
// //     onChangeText={(text) => setPrice(text)}
// //   />
// // </View>
// //         <View style={styles.inputContainerEditProduct}>
// //           <label htmlFor="image">Image:</label>
// //           <input type="file" id="image" onChange={handleImageUpload} />
// //         </View>
// //         <TouchableOpacity
// //           style={styles.buttonEditProduct}
// //           onPress={handleSubmit}
// //         >
// //           <Text style={styles.buttonTextEditProduct}>Edit Product</Text>
// //         </TouchableOpacity>
// //       </View>
// //     </View>
// //   );


// return (
//     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//       <Text style={{ marginBottom: 10 }}>Edit Product</Text>
//       <View style={{ width: '80%' }}>
//         <View style={{ marginBottom: 10 }}>
//           <Text style={{ marginBottom: 5 }}>Product Name:</Text>
//           <TextInput
//             style={{ borderWidth: 1, borderColor: 'black', padding: 5 }}
//             value={name}
//             onChangeText={(text) => setName(text)}
//           />
//         </View>
//         <View style={{ marginBottom: 10 }}>
//           <Text style={{ marginBottom: 5 }}>Description:</Text>
//           <TextInput
//             style={{ borderWidth: 1, borderColor: 'black', padding: 5, height: 100 }}
//             multiline
//             value={description}
//             onChangeText={(text) => setDescription(text)}
//           />
//         </View>
//         <View style={{ marginBottom: 10 }}>
//           <Text style={{ marginBottom: 5 }}>Size:</Text>
//           <TextInput
//             style={{ borderWidth: 1, borderColor: 'black', padding: 5 }}
//             value={size}
//             onChangeText={(text) => setSize(text)}
//           />
//         </View>
//         <View style={{ marginBottom: 10 }}>
//           <Text style={{ marginBottom: 5 }}>Type:</Text>
//           <TextInput
//             style={{ borderWidth: 1, borderColor: 'black', padding: 5 }}
//             value={type}
//             onChangeText={(text) => setType(text)}
//           />
//         </View>
//         <View style={{ marginBottom: 10 }}>
//           <Text style={{ marginBottom: 5 }}>Colors:</Text>
//           <TextInput
//             style={{ borderWidth: 1, borderColor: 'black', padding: 5 }}
//             value={colors}
//             onChangeText={(text) => setColors(text)}
//           />
//         </View>
//         <View style={{ marginBottom: 10 }}>
//           <Text style={{ marginBottom: 5 }}>Offer:</Text>
//           <TextInput
//             style={{ borderWidth: 1, borderColor: 'black', padding: 5 }}
//             value={offer}
//             onChangeText={(text) => setOffer(text)}
//           />
//         </View>
//         <View style={{ marginBottom: 10 }}>
//           <Text style={{ marginBottom: 5 }}>Price:</Text>
//           <TextInput
//             style={{ borderWidth: 1, borderColor: 'black', padding: 5 }}
//             value={price}
//             onChangeText={(text) => setPrice(text)}
//           />
//         </View>
//         <TouchableOpacity
//           style={{ backgroundColor: 'blue', padding: 10, alignItems: 'center', borderRadius: 5 }}
//           onPress={handleSubmit}
//         >
//           <Text style={{ color: 'white' }}>Edit Product</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
  
// };
const EditProductPage = ({ route, navigation }) => {
    const { product } = route.params;
    const storage = getStorage();
    
    const [name, setName] = useState(product.name);
    const [description, setDescription] = useState(product.description);
    const [images, setImages] = useState(null);
    const [size, setSize] = useState(product.size);
    const [type, setType] = useState(product.type); 
    const [offer, setOffer] = useState(product.offer);
    const [price, setPrice] = useState(product.price);
    const [colors, setColors] = useState(product.colors); 
  
    const handleSubmit = async () => {
      // Upload image to Storage
      if (images) {
        const imageRef = ref(storage, images.name);
        await uploadBytes(imageRef, images);
        const imageUrl = await getDownloadURL(imageRef);
  
        // Update product document in Firestore
        const querySnapshot = await getDocs(query(collection(db, 'men'), where('name', '==', product.name)));
        const docId = querySnapshot.docs[0].id;
        await updateDoc(doc(db, 'men', docId), {
          name: name,
          description: description,
          imageUrl: imageUrl,
          size: size,
          type: type, 
          colors: colors, 
          offer: offer,
          price: price,
        });
      } else {
        // If no new image selected, update only name and description
        const querySnapshot = await getDocs(query(collection(db, 'men'), where('name', '==', product.name)));
        const docId = querySnapshot.docs[0].id;
        await updateDoc(doc(db, 'men', docId), {
          name: name,
          description: description,
          size: size,
          type: type, 
          colors: colors, 
          offer: offer,
          price: price,
        });
      }
  
      // Reset state after submission
      setName('');
      setDescription('');
      setImages(null);
      setSize('');
      setType('');
      setOffer('');
      setPrice('');
      setColors([]);
      navigation.goBack();
    };
  
    const handleImageUpload = (e) => {
      if (e.target.files[0]) {
        setImages(e.target.files[0]);
      }
    };
    const handleColorInput = (text) => {
      const colorsArray = text.split(',').map((color) => color.trim());
      setColors(colorsArray);
    };
  
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ marginBottom: 10 }}>Edit Product</Text>
        <View style={{ width: '80%' }}>
          <View style={{ marginBottom: 10 }}>
            <Text style={{ marginBottom: 5 }}>Product Name:</Text>
            <TextInput
              style={{ borderWidth: 1, borderColor: 'black', padding: 5 }}
              value={name}
              onChangeText={(text) => setName(text)}
            />
          </View>
          <View style={{ marginBottom: 10 }}>
            <Text style={{ marginBottom: 5 }}>Description:</Text>
            <TextInput
              style={{ borderWidth: 1, borderColor: 'black', padding: 5, height: 100 }}
              multiline
              value={description}
              onChangeText={(text) => setDescription(text)}
            />
          </View>
          <View style={{ marginBottom: 10 }}>
            <Text style={{ marginBottom: 5 }}>Size:</Text>
            <TextInput
              style={{ borderWidth: 1, borderColor: 'black', padding: 5 }}
              value={size}
              onChangeText={(text) => setSize(text)}
            />
          </View>
          <View style={{ marginBottom: 10 }}>
            <Text style={{ marginBottom: 5 }}>Type:</Text>
            <TextInput
              style={{ borderWidth: 1, borderColor: 'black', padding: 5 }}
              value={type}
              onChangeText={(text) => setType(text)}
            />
          </View>
          <View style={{ marginBottom: 10 }}>
            <Text style={{ marginBottom: 5 }}>Colors:</Text>
            <TextInput
              style={{ borderWidth: 1, borderColor: 'black', padding: 5 }}
              value={colors.join(', ')} // Convert array to comma-separated string
              onChangeText={handleColorInput}
            />
          </View>
          <View style={{ marginBottom: 10 }}>
            <Text style={{ marginBottom: 5 }}>Offer:</Text>
            <TextInput
              style={{ borderWidth: 1, borderColor: 'black', padding: 5 }}
              value={offer}
              onChangeText={(text) => setOffer(text)}
            />
          </View>
          <View style={{ marginBottom: 10 }}>
            <Text style={{ marginBottom: 5 }}>Price:</Text>
            <TextInput
              style={{ borderWidth: 1, borderColor: 'black', padding: 5 }}
              value={price}
              onChangeText={(text) => setPrice(text)}
            />
          </View>
          <TouchableOpacity
            style={{ backgroundColor: 'blue', padding: 10, alignItems: 'center', borderRadius: 5 }}
            onPress={handleSubmit}
          >
            <Text style={{ color: 'white' }}>Edit Product</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

export { EditProductPage,AdminProductsListMen, AdminMenDetails } ;
