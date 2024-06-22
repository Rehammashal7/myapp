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
import SelectDropdown from 'react-native-select-dropdown';
import { card, filter, productpage, smallCard } from "../../Consts/styles";

const { width } = Dimensions.get("screen");
const { height } = Dimensions.get("screen");

const cardwidth = width / 2;
let iconcolor;
const ProductsListKids  = ({ navigation ,route}) => {
  console.log(route.params)
  const COLORS=route.params
  const [products, setProducts] = useState([]);
  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [iconsort, setIconSort] = useState(true);
  const [filterType, setFilterType] = useState("");
  const [sizeType, setSizeType] = useState("");
  const [colorType, setColorType] = useState("");
  const [sortType, setSortType] = useState("");
  const [sortOrder, setSortOrder] = useState(true);
  const [activeIndexes, setActiveIndexes] = useState({});

  const [filteredProducts, setFilteredProducts] = useState([]);
  const isFocused = useIsFocused();
  const cards = card(COLORS);
  const productpages=productpage(COLORS)
  const smallCards=smallCard(COLORS);
  const filterr =filter(COLORS);

  const filters = [
    { title: 'all' },
    { title: 'size' },
    { title: 'color' },
  ];
  const sizes = [
    { title: '5/6 Age' },
    { title: '6/7 Age' },
    { title: '7/8 Age' },
    { title: '8/9 Age' },
    { title: '9/10 Age' },
    { title: '10/11 Age' },
    { title: '11/12 Age' },
    { title: '12/13 Age' },
    { title: '13/14 Age' },
  ];
  const colors = [
    { title: 'beige' },
    { title: 'bisque' },
    { title: 'black' },
    { title: 'blue' },
    { title: 'chocolate' },
    { title: 'fuchsia' },
    { title: 'gray' },
    { title: 'green' },
    { title: 'khaki' },
    { title: 'navy' },
    { title: 'red' },
    { title: 'salmon' },
    { title: 'white' },
  ];
  const sorts = [
    { title: 'price' },
    { title: 'rate' },
    { title: 'none' },
  ];

  useEffect(() => {
    const getUserId = async () => {
      const id = await AsyncStorage.getItem("USERID");
      setUserId(id);
    };
    getUserId();
  }, []);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const productsCollection = collection(db, "kids");
        const productsSnapshot = await getDocs(productsCollection);
        const productsData = productsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productsData);
        setFilteredProducts(productsData);
      } catch (error) {
        console.error("Error fetching products: ", error);
      } finally {
        setIsLoading(false);
      }
    };
    getProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filterType, sizeType, colorType, sortType, sortOrder]);

  const applyFilters = () => {
    let updatedProducts = [...products];

    if (filterType === 'size' && sizeType) {
      updatedProducts = updatedProducts.filter(product => product.sizes && product.sizes.includes(sizeType));
    }

    if (filterType === 'color' && colorType) {
      updatedProducts = updatedProducts.filter(product => containColor(product, colorType));
    }

    if (sortType) {
      if (sortType === 'price') {
        updatedProducts.sort((a, b) => {
          const priceA = a.price || 0;
          const priceB = b.price || 0;
          return sortOrder ? priceA - priceB : priceB - priceA;
        });
      } else if (sortType === 'rate') {
        updatedProducts.sort((a, b) => {
          const rateA = a.rate || 0;
          const rateB = b.rate || 0;
          return sortOrder ? rateA - rateB : rateB - rateA;
        });
      }
    }

    setFilteredProducts(updatedProducts);
  };

  const containColor = ({ colors }, query) => {
    return colors.some(color => color.toLowerCase().includes(query));
  };

  const handleProductPress = (product) => {
    navigation.navigate("KidsDetails", { product,COLORS:COLORS });
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
        <View
          style={{

            marginTop: 1,
            height: 100,
          }}
        >
          <View style={{ marginTop: 10, flexDirection: "row" }}>
            <Text style={cards.Name} numberOfLines={2} ellipsizeMode="tail">
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
                style={cards.pricewithoffer}
              >
                {item.price} EGP
              </Text>
              <Text
                style={cards.offer}
              >
                🏷️{item.offer}% Discount{" "}
                <Text style={{ fontSize: 14, fontWeight: "bold", color: COLORS.offerC }}>
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
    <View style={productpages.container}>
      <View style={productpages.headerName}>
        <Text style={productpages.Textt}> AToZ </Text>
      </View>
      <Search COLORS={COLORS}/>

      <View style={smallCards.header}>
        <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={filterData}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <Pressable onPress={() => navigation.navigate(item.name, COLORS)}>
              <View
                style={
                  item.name === "KIDS"
                    ? { ...smallCards.smallCardSelected }
                    : { ...smallCards.smallCard }
                }
              >
                <View style={smallCards.smallCardText}>
                  <Text
                    style={
                      item.name === "KIDS"
                        ? { ...smallCards.boldText }
                        : { ...smallCards.regularText }
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
      <ScrollView nestedScrollEnabled={true}>
        <View style={filterr.containerfs}>
          <Pressable
            style={{ flexDirection: "row", }}
          >
            <View style={filterr.numbertypecontainer}>
              <Icon
                name="filter"
                size={25}
                color={COLORS.dark}
                style={{ marginRight: 3 }}
              />
              <SelectDropdown
                data={filters}
                onSelect={(selectedItem) => {
                  setFilterType(selectedItem.title);
                  applyFilters();
                }}
                renderButton={(selectedItem, isOpened) => {
                  return (
                    <View style={filterr.dropdownButtonStyle}>
                      <Text style={filterr.dropdownButtonTxtStyle}>
                        {(filterType && filterType) || 'filter'}
                      </Text>
                      <Icon name={isOpened ? 'chevron-up' : 'chevron-down'} style={filterr.dropdownButtonArrowStyle} color={COLORS.dark} />
                    </View>
                  );
                }}
                renderItem={(item, index, isSelected) => {
                  return (
                    <View style={{ ...filterr.dropdownItemStyle, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                      <Text style={filterr.dropdownItemTxtStyle}>{item.title}</Text>
                    </View>
                  );
                }}
                showsVerticalScrollIndicator={false}
                dropdownStyle={filterr.dropdownMenuStyle}
              />
            </View>
            {filterType === 'size' && (
              <SelectDropdown
                data={sizes}
                onSelect={(selectedItem) => {
                  setSizeType(selectedItem.title);
                  applyFilters();
                }}
                renderButton={(selectedItem, isOpened) => {
                  return (
                    <View style={filterr.dropdownButtonStyle}>
                      <Text style={filterr.dropdownButtonTxtStyle}>
                        {(sizeType && sizeType) || 'size'}
                      </Text>
                      <Icon name={isOpened ? 'chevron-up' : 'chevron-down'} style={filterr.dropdownButtonArrowStyle} color={COLORS.dark} />
                    </View>
                  );
                }}
                renderItem={(item, index, isSelected) => {
                  return (
                    <View style={{ ...filterr.dropdownItemStyle, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                      <Text style={filterr.dropdownItemTxtStyle}>{item.title}</Text>
                    </View>
                  );
                }}
                showsVerticalScrollIndicator={false}
                dropdownStyle={filterr.dropdownMenuStyle}
              />
            )}
            {filterType === 'color' && (
              <SelectDropdown
                data={colors}
                onSelect={(selectedItem) => {
                  setColorType(selectedItem.title);
                  applyFilters();
                }}
                renderButton={(selectedItem, isOpened) => {
                  return (
                    <View style={filterr.dropdownButtonStyle}>
                      <Text style={filterr.dropdownButtonTxtStyle}>
                        {(colorType && colorType) || 'color'}
                      </Text>
                      <Icon name={isOpened ? 'chevron-up' : 'chevron-down'} style={filterr.dropdownButtonArrowStyle} color={COLORS.dark} />
                    </View>
                  );
                }}
                renderItem={(item, index, isSelected) => {
                  return (
                    <View style={{ ...filterr.dropdownItemStyle, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                      <Text style={filterr.dropdownItemTxtStyle}>{item.title}</Text>
                    </View>
                  );
                }}
                showsVerticalScrollIndicator={false}
                dropdownStyle={filterr.dropdownMenuStyle}
              />
            )}
          </Pressable>
          <Pressable
            style={{ flexDirection: "row", marginLeft: 5 }}
          >
            <View style={filterr.numbertypecontainer}>
              <Pressable onPress={() => { seticonsort(!iconsort), setSortOrder(!iconsort), applyFilters() }}>
                <Icon
                  name={iconsort ? "sort-alpha-asc" : "sort-alpha-desc"}
                  size={25}
                  color={COLORS.dark}
                  style={{ marginRight: 10 }}

                />
              </Pressable>
              <SelectDropdown
                data={sorts}
                onSelect={(selectedItem) => {
                  setSortType(selectedItem.title);
                  setSortOrder(true);
                  seticonsort(true);
                  applyFilters();
                }}
                renderButton={(selectedItem, isOpened) => {
                  return (
                    <View style={filterr.dropdownButtonStyle}>
                      <Text style={filterr.dropdownButtonTxtStyle}>
                        {(sortType && sortType) || 'Sort'}
                      </Text>
                      <Icon name={isOpened ? 'chevron-up' : 'chevron-down'} style={filterr.dropdownButtonArrowStyle} color={COLORS.dark} />
                    </View>
                  );
                }}
                renderItem={(item, index, isSelected) => {
                  return (
                    <View style={{ ...filterr.dropdownItemStyle, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                      <Text style={filterr.dropdownItemTxtStyle}>{item.title}</Text>
                    </View>
                  );
                }}
                showsVerticalScrollIndicator={false}
                dropdownStyle={filterr.dropdownMenuStyle}
              />
            </View>
          </Pressable>
        </View>
        {isLoading ? (
          <View>
            <Spinner
              visible={isLoading}
              customIndicator={<ActivityIndicator size="large" color={COLORS.dark} />}
            />
          </View>
        ) : (
          <FlatList
            numColumns={2}
            data={filteredProducts}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id}
          />
        )}
        <View style={productpages.bottoms}></View>
      </ScrollView>

      <BottomNavigator navigation={navigation} userId={userId} COLORS={COLORS}/>
    </View>
  );
};
////////////////////////////////////////////////////////////////////////////////////////////

const KidsDetails = ({ route, navigation }) => {
  const COLORS =route.params.COLORS
  console.log(route.params)
  const productpages =productpage(COLORS)
  // const { product } = route.params;
  // const { product } = route.params ? route.params : { product: {} };
  const { product } = route.params ? route.params : { product: {} };
  console.log('oroifeo', product);
  const product_id = product.id;
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
  // const productId = Produnt_id;
  // const productId = product?.id;
  console.log("Product ID:", product_id);
  const [showReviews, setShowReviews] = useState(false);
  const [comments, setComment] = useState(0);
  const [rating, setRating] = useState(0);
  const [like, setLike] = useState([0]);
  const [disLike, setDislikes] = useState([0]);
  const [reviews, setReviews] = useState([]);
  const [reviewsWithLikes, setReviewsWithLikes] = useState([]);
  const productId = product.id;

  const [isPaymentCompleted, setPaymentCompleted] = useState(false);
  const scrollViewRef = useRef(null);
  const [activeIndexes, setActiveIndexes] = useState({});
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showPrice, setShowPrice] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [modalVisibleCart, setModalVisibleCart] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [showGoToCartButton, setShowGoToCartButton] = useState(false);

  const numberOfInitialReviews = 3;
  const categoryName = "Kids";
  const handleGoToCart = () => {
    navigation.navigate("CartScreen",{ userId: userId ,COLORS:COLORS });
  };
  const handleSeeAllReviews = () => {
    navigation.navigate("AllReviewsPage", { reviews });
    <Text style={productpages.seeAllText}>
      See All ({reviews ? reviews.length : 0})
    </Text>;
  };
  useEffect(() => {
    const fetchItem = async (product_id) => {
      const documentSnapshot = await getDoc(doc(db, "kids", product_id));
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
      getCartItems(id)
    };
    getUserId();

  }, [isFocused]);
  useEffect(() => {
    getCartItems(userId)
  })

  const [showReview, setShowReview] = useState(false);
  const getCartItems = async (id) => {
    const userRef = doc(db, "users", id);
    const userSnap = await getDoc(userRef);
    const cartCount = userSnap?.data()?.cart?.length ?? 0;

    const showitem = userSnap?.data()?.HistoryOrder ?? [];
    const show = showitem.find((item) => item.productId === product_id);
    if (show) {
      setShowReview(true);
    }

    setCartCount(cartCount);
  };

  useEffect(() => {
    if (userId) {
      getCartItems(userId);
      fetchAllReviews();
    }
  }, [userId]);

  useEffect(() => {
    if (modalVisibleCart) {
      setTimeout(() => {
        setModalVisibleCart(false);
      }, 2000);
    }
  }, [modalVisibleCart]);

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
    } else {
      cart.push({ ...item, qty: 1, color: selectedColor, size: selectedSize, delivery: newDate });
    }

    await updateDoc(userRef, { cart });
    getCartItems();
    if (selectedColor && selectedSize) {
      setShowGoToCartButton(true);
      setModalVisibleCart(true);

    } else if (selectedColor || selectedSize) {
      setShowGoToCartButton(true);
      setModalVisibleCart(true);

    }
    else {
      setModalVisibleCart(true);
      setShowGoToCartButton(false);
    }
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
      const productRef = doc(db, "kids", product_id);
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
        await updateDoc(productRef, { rate: averageRating });
      } else {
        setRating(0);
        setComment(0);
        await updateDoc(productRef, { rate: 0 });
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

  useEffect(() => {
    console.log("iam in recently use effect ");
    saveRecentlyVisited(product.id, product.name, product.categoryName, product.images, product.colors, product.description, product.offer, product.price, product.sizes);
    // console.log("iam get data ");
    console.log("produt id", product_id);
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
    <View style={productpages.productContainer}>
      <ScrollView onScroll={handleScroll2}>
        <View>
          {/* image */}
          <FlatList
            horizontal
            data={product.images}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={productpages.productImage} />
            )}
            keyExtractor={(image, index) => index}
            onScroll={(event) => handleScroll(event, product.id)}
          />
          <View style={productpages.dotsContainerDetails}>
            {product.images.map((_, index) => (
              <View
                key={index}
                style={[
                  productpages.dotDetails,
                  index === (activeIndexes[product.id] || 0)
                    ? productpages.activeDotDetails
                    : null,
                ]}
              />
            ))}
          </View>
          {/* cart */}
          <View style={productpages.containerHeart}>
            <Pressable
              onPress={() => {
                navigation.navigate('CartScreen', { userId: userId ,COLORS:COLORS })
              }} style={productpages.addToFavBtn}>
              <Icon name="shopping-cart" size={28} color={COLORS.dark} />
            </Pressable>
          </View>
          <View style={productpages.containercount}>
            <Pressable
              onPress={() => {
                navigation.navigate('CartScreen', { userId: userId ,COLORS:COLORS })
              }} style={productpages.countcart}>
              <Text style={{ color: COLORS.white }}>{cartCount}</Text>
            </Pressable>
          </View>
          <View
            style={{
              marginTop: 2,
              marginBottom: 5,
              backgroundColor: COLORS.background,
            }}
          >
            <View style={{ width: width }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ width: "60%" }}>
                  {/* product name */}
                  <Text style={productpages.NameD}>{product.name}</Text>
                  {product.offer !== 0 ? (
                    <>
                      {/* price with offer */}
                      <Text
                        style={productpages.priceO}
                      >
                        {product.price} EGP
                      </Text>

                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: "bold",
                          marginHorizontal: 9,
                          color: COLORS.offerC,
                        }}
                      >
                        🏷️ {product.offer}% Discount{" "}
                        <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                          {Math.floor(
                            product.price - product.price / product.offer
                          )}{" "}
                          EGP
                        </Text>
                      </Text>
                    </>
                  ) : (
                    // price
                    <Text
                      style={productpages.price}
                    >
                      {product.price} EGP
                    </Text>
                  )}
                </View>
                {/* stars */}
                <View
                  style={{
                    width: "40%",
                    alignItems: 'center',
                    marginTop: 5,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Icon
                        name={star <= rating ? "star" : "star-o"}
                        size={20}
                        color={COLORS.dark}
                      />
                    ))}
                    <Text style={{ fontSize: 15 ,color:COLORS.dark}}> ({comments})</Text>
                    {reviews.length > 0 && (
                      <TouchableOpacity onPress={handleSeeAllReviews}>
                        <Text style={{ fontSize: 18, color:COLORS.dark }}>{">"}</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            </View>

            <View>
              {/* Choose color */}
              {product.colors.length > 1 && (
                <View style={productpages.colorsContainer}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "bold",
                      marginLeft: 10,
                      color:COLORS.dark
                    }}
                  >
                    Choose Color:{" "}
                  </Text>
                  <FlatList
                    horizontal
                    data={product.colors}
                    keyExtractor={(color, index) => index}
                    renderItem={({ item }) => {
                      let buttonStyle = [
                        productpages.colorButton,
                        { backgroundColor: item.toLowerCase() },
                      ];
                      if (selectedColor === item) {
                        if (item.toLowerCase() ==="black") {
                          buttonStyle.push(productpages.blackButtonStyle);
                        } else {
                          buttonStyle.push(productpages.selectedColorButton);
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
              {/* Choose size */}
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
                    color:COLORS.dark
                  }}
                >
                  Sizes Options
                </Text>

                <TouchableOpacity onPress={() => setModalVisible(true)}>
                  <Text style={{ color: COLORS.dark }}>
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
                      backgroundColor: COLORS.dark,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => setModalVisible(false)}
                      style={{ position: "absolute", top: 20, right: 20 }}
                    >
                      <Text style={{ color: COLORS.white, fontSize: 18 }}>✖️</Text>
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
              <View style={productpages.sizesContainer}>
                <FlatList
                  horizontal
                  data={product.sizes}
                  keyExtractor={(size, index) => index.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        productpages.sizeButton,
                        selectedSize === item && productpages.selectedSizeButton,
                      ]}
                      onPress={() => setSelectedSize(item)}
                    >
                      {selectedSize === item && (
                        <Icon
                          name="check"
                          size={15}
                          color={COLORS.dark}
                          style={{
                            position: "absolute",
                            top: -5,
                            right: -5,
                            backgroundColor: COLORS.white,
                          }}
                        />
                      )}
                      <Text style={[productpages.sizeText, productpages.sizeButtonText]}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </View>
            <View style={productpages.line}></View>
            {/* discribtion */}
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                marginTop: 5,
                marginLeft: 10,
                color:COLORS.dark
              }}
            >
              Product Information
            </Text>
            {lines.map((line, index) => (
              <Text key={index} style={productpages.description}>
                {line}
              </Text>
            ))}
            {/* rate */}
            {reviews.length > 0 && (
              <View style={productpages.container}>

                <View style={{ flexDirection: "row", alignItems: "center", width: '100%' }}>

                  <Text
                    style={{ fontSize: 20, fontWeight: "bold", marginTop: 10, width: '60%',color:COLORS.dark }}
                  >
                    Evaluation  {rating.toFixed(1)}
                  </Text>

                  <TouchableOpacity onPress={handleSeeAllReviews}>
                    <Text
                      style={{
                        textDecorationLine: "underline",
                        right: 1,
                        width: '100%',
                        fontSize: 15,
                        marginTop: 10,
                        marginRight: 5,
                        justifyContent: 'flex-end',
                        color:COLORS.dark
                      }}
                    >
                      {comments} COMMENT | See All{" "}
                    </Text>
                  </TouchableOpacity>

                </View>
                {/* reviews */}
                <FlatList
                  data={reviewsWithLikes.slice(0, numberOfInitialReviews)}
                  renderItem={({ item, index }) => (
                    <View style={productpages.reviewContainer}>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      ><View style={{ flexDirection: "row", alignItems: "center", width: '80%' }}>
                          <Text style={productpages.reviewText}>{item.username} </Text>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Icon
                              name={star <= item.rating ? "star" : "star-o"}
                              size={17}
                              color={COLORS.dark}
                            />
                          ))}
                        </View>
                        <Text style={{ width: '40%', color: COLORS.dark }}>
                          {item.date}{" "}
                        </Text>

                      </View>
                      <Text style={[productpages.reviewText, { marginTop: 15 }]}>
                        {item.comment}
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginTop: 5,
                          width: '100%',
                          marginBottom: 5,
                          justifyContent: 'flex-end'
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => handleLike(index)}
                          style={productpages.likeButton}
                        >
                          <Icon
                            name={item.like === 1 ? "thumbs-up" : "thumbs-o-up"}
                            size={20}
                            color={COLORS.dark}
                          />
                        </TouchableOpacity>
                        <Text style={{ marginHorizontal: 10,color:COLORS.dark }}>
                          ({item.like})
                        </Text>
                        <TouchableOpacity
                          onPress={() => handleDislike(index)}
                          style={productpages.dislikeButton}
                        >
                          <Icon
                            name={
                              item.disLike === 1 ? "thumbs-down" : "thumbs-o-down"
                            }
                            size={20}
                            color={COLORS.dark}
                          />
                        </TouchableOpacity>
                        <Text style={{ marginHorizontal: 10 ,color:COLORS.dark}}>
                          ({item.disLike})
                        </Text>
                      </View>
                    </View>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                />
              </View>
            )}
          </View>
        </View>
        {/* add review button */}
        {showReview &&
          (
            <View style={{ backgroundColor: COLORS.white }}>
              <TouchableOpacity
                style={productpages.reviewButon}
                onPress={() =>
                  navigation.navigate("AddReviewMen", {
                    product: { id: product_id },
                    fetchAllReviews,
                  })
                }
              >
                <Text style={{ color: COLORS.white, fontWeight: "bold", fontSize: 15 }}>Add a Review</Text>
              </TouchableOpacity>

            </View>
          )
        }

      </ScrollView>
      <View style={productpages.bottomBar}>
        <View style={productpages.Navbarr}>
          {/* add to cart button */}
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
                  <View style={productpages.buttonContainer}>
                    <Text style={productpages.priceText}>
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

                    <View style={productpages.container}>
                      <TouchableOpacity
                        style={productpages.addToCartBton2}
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
                        <Text style={productpages.addToCartButtonText}>
                          Add to Cart
                        </Text>
                      </TouchableOpacity>
                      {/* add to cart alert */}
                      <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisibleCart}
                        onRequestClose={() => {
                          setModalVisibleCart(false);
                        }}
                      >
                        <View style={productpages.modalContainer}>
                          <View style={productpages.modalContent}>
                            {product.colors.length !== 1 ? (
                              selectedColor && selectedSize ? (
                                <>
                                  <Text style={productpages.modalText}>
                                    Item added to cart!
                                  </Text>
                                  {setShowGoToCartButton(true)}
                                </>
                              ) : (
                                <Text style={productpages.modalText}>
                                  Please select a size and color if available
                                </Text>
                              )
                            ) : selectedColor || selectedSize ? (
                              <>
                                <Text style={productpages.modalText}>
                                  Item added to cart!
                                </Text>
                                {setShowGoToCartButton(true)}
                              </>
                            ) : (
                              <Text style={productpages.modalText}>
                                Please select a size and color if available
                              </Text>
                            )}

                            <TouchableOpacity
                              style={productpages.okButton}
                              onPress={() => {
                                setShowGoToCartButton(!showGoToCartButton);
                              }}
                            >
                              {showGoToCartButton ? (
                                <TouchableOpacity
                                  style={productpages.okButton}
                                  onPress={handleGoToCart}
                                >
                                  <Text style={productpages.okButtonText}>
                                    go to cart
                                  </Text>
                                </TouchableOpacity>
                              ) : (
                                <TouchableOpacity style={productpages.okButton}>
                                  <Text style={productpages.okButtonText}>OK</Text>
                                </TouchableOpacity>
                              )}
                            </TouchableOpacity>
                          </View>
                        </View>
                      </Modal>
                    </View>
                  </View>
                ) : (
                  <View style={productpages.buttonContainer}>
                    <Pressable onPress={() => onAddToFav(item, index)}>
                      <Icon
                        name="heart"
                        size={30}
                        color={isPressed ? COLORS.dark : "grey"}
                      />
                    </Pressable>
                    <View style={productpages.container}>
                      <TouchableOpacity
                        style={productpages.addToCartBton1}
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
                        <Text style={productpages.addToCartButtonText}>
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
                        <View style={productpages.modalContainer}>
                          <View style={productpages.modalContent}>
                            {product.colors.length !== 1 ? (
                              selectedColor && selectedSize ? (
                                <>
                                  <Text style={productpages.modalText}>
                                    Item added to cart!
                                  </Text>
                                  {setShowGoToCartButton(true)}
                                </>
                              ) : (
                                <Text style={productpages.modalText}>
                                  Please select a size and color if available
                                </Text>
                              )
                            ) : selectedColor || selectedSize ? (
                              <>
                                <Text style={productpages.modalText}>
                                  Item added to cart!
                                </Text>
                                {setShowGoToCartButton(true)}
                              </>
                            ) : (
                              <Text style={productpages.modalText}>
                                Please select a size and color if available
                              </Text>
                            )}

                            <TouchableOpacity
                              style={productpages.okButton}
                              onPress={() => {
                                setShowGoToCartButton(!showGoToCartButton);
                              }}
                            >
                              {showGoToCartButton ? (
                                <TouchableOpacity
                                  style={productpages.okButton}
                                  onPress={handleGoToCart}
                                >
                                  <Text style={productpages.okButtonText}>
                                    go to cart
                                  </Text>
                                </TouchableOpacity>
                              ) : (
                                <TouchableOpacity style={productpages.okButton}>
                                  <Text style={productpages.okButtonText}>OK</Text>
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

export { ProductsListKids, KidsDetails };
