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
import SelectDropdown from 'react-native-select-dropdown';
import { card, filter, productpage, smallCard } from "../../Consts/styles";
const { width } = Dimensions.get("screen");
const { height } = Dimensions.get("screen");

const cardwidth = width / 2;
let iconcolor;
const ProductsListKids = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [userId, setUserId] = useState("");
  const isFocused = useIsFocused();
  const [isPressed, setIsPressed] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef(null);
  const [activeIndexes, setActiveIndexes] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [filterproduct, setfilterProduct] = useState([]);
  const [iconsort, seticonsort] = useState(true);
  const filters = [
    { title: 'all' },
    { title: 'size' },
    { title: 'color' },
  ];
  const size = [
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
  const color = [
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
  const handleSize = (title) => {

    const filterSize = filterproduct.filter(product => containsize(product, title))
    setProducts(filterSize);
    console.log(filterSize)
  }
  useEffect(() => {
    handleSize()
  }, [])
  const handleColor = (title) => {

    const filterColor = filterproduct.filter(product => containColor(product, title))
    setProducts(filterColor);
    console.log(filterColor)
  }
  useEffect(() => {
    handleColor()
  }, [])
  const containsize = ({ sizes }, query) => {
    console.log(sizes);
    console.log(query);
    // Convert the query to lowercase for case-insensitive comparison
    const lowerCaseQuery = query;
    console.log(sizes.some(size => size.includes(lowerCaseQuery)))
    // Use the some method to check if any color in the list includes the query
    return sizes.some(size => size.includes(lowerCaseQuery));
  };
  const containColor = ({ colors }, query) => {
    console.log(colors);

    // Convert the query to lowercase for case-insensitive comparison
    const lowerCaseQuery = query;

    // Use the some method to check if any color in the list includes the query
    return colors.some(color => color.includes(lowerCaseQuery));
  };
  const sort = [
    { title: 'price' },
    { title: 'rate' },
    { title: 'none' },
  ];
  const [sortOrder, setSortOrder] = useState(true);

  const handlesort = (title) => {
    if (title === 'price') {
      products.sort((a, b) => {
        const priceA = a.price || 0; // Default to 0 if price is missing
        const priceB = b.price || 0;
        return !sortOrder ? priceA - priceB : priceB - priceA;
      });
      console.log(iconsort)
      setProducts(products);
    } else if (title === 'rate') {
      products.sort((a, b) => {
        const rateA = a.rate || 0; // Default to 0 if price is missing
        const rateB = b.rate || 0;
        return !sortOrder ? rateA - rateB : rateB - rateA;
      });
      console.log(iconsort)
      setProducts(products);
    } else {
      setProducts(filterproduct);
    }
  }
  const handleAll = (title) => {
    if (title === 'all') {
      setProducts(filterproduct);
    }
  }
  const getProducts2 = async () => {
    try {
      const productsCollection = collection(db, "woman");
      const productsSnapshot = await getDocs(productsCollection);
      const productsData = productsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      if (sortType === 'price') {
        console.log("title " + sortType)
        console.log("order " + sortOrder)
        productsData.sort((a, b) => {
          const priceA = a.price || 0; // Default to 0 if price is missing
          const priceB = b.price || 0;
          return sortOrder ? priceA - priceB : priceB - priceA;
        });
        console.log(iconsort)
        setProducts(products);
      } else if (sortType === 'rate') {
        console.log("title " + sortType)
        console.log("order " + sortOrder)
        productsData.sort((a, b) => {
          const rateA = a.rate || 0; // Default to 0 if price is missing
          const rateB = b.rate || 0;
          return sortOrder ? rateA - rateB : rateB - rateA;
        });
        console.log(iconsort)
        setProducts(products);
      } setfilterProduct(productsData);
      setProducts(productsData);
    } catch (error) {
      console.error("Error fetching products: ", error);
    } finally {
      setIsLoading(false);
    }
  };
  const [filterType, setFilterType] = useState("");
  const [sizeType, setsizeType] = useState("");
  const [colorType, setcolorType] = useState("");
  const [sortType, setSortType] = useState("");
  useEffect(() => {
    const getProducts = async () => {
      try {
        const productsCollection = collection(db, "kids");
        const productsSnapshot = await getDocs(productsCollection);
        const productsData = productsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        if (sortType === 'price') {
          console.log("title " + sortType)
          console.log("order " + sortOrder)
          productsData.sort((a, b) => {
            const priceA = a.price || 0; // Default to 0 if price is missing
            const priceB = b.price || 0;
            return sortOrder ? priceA - priceB : priceB - priceA;
          });
          console.log(iconsort)
        } else if (sortType === 'rate') {
          console.log("title " + sortType)
          console.log("order " + sortOrder)
          productsData.sort((a, b) => {
            const rateA = a.rate || 0; // Default to 0 if price is missing
            const rateB = b.rate || 0;
            return sortOrder ? rateA - rateB : rateB - rateA;
          });
          console.log(iconsort)
          setProducts(products);
        }
        setProducts(productsData);
        setfilterProduct(productsData);
      } catch (error) {
        console.error("Error fetching products: ", error);
      } finally {
        setIsLoading(false);
      }
    };
    getProducts();
  }, [sortType]);

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
    navigation.navigate("KidsDetails", { product });
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
      <View style={card.cardView}>
        <FlatList
          horizontal
          data={item.images}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item: image, index }) => (
            <Image key={index} source={{ uri: image }} style={card.imagee} />
          )}
          keyExtractor={(image, index) => index.toString()}
          onScroll={(event) => handleScroll(event, item.id)}
        />
        <View style={card.dotsContainer}>
          {item.images?.map((_, index) => (
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
        <View
          style={{

            marginTop: 1,
            height: 100,
          }}
        >
          <View style={{ marginTop: 10, flexDirection: "row" }}>
            <Text style={card.Name} numberOfLines={2} ellipsizeMode="tail">
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
                style={card.pricewithoffer}
              >
                {item.price} EGP
              </Text>
              <Text
                style={card.offer}
              >
                🏷️{item.offer}% Discount{" "}
                <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                  {Math.floor(
                    item.price - item.price / item.offer
                  )}{" "}
                  EGP
                </Text>
              </Text>
            </>
          ) : (
            <Text
              style={card.price}
            >
              {item.price} EGP
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={productpage.container}>
      <View style={productpage.headerName}>
        <Text style={productpage.Textt}> AToZ </Text>
      </View>
      <Search />

      <View style={smallCard.header}>
        <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={filterData}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <Pressable onPress={() => navigation.navigate(item.name)}>
              <View
                style={
                  item.name === "KIDS"
                    ? { ...smallCard.smallCardSelected }
                    : { ...smallCard.smallCard }
                }
              >
                <View style={smallCard.smallCardText}>
                  <Text
                    style={
                      item.name === "KIDS"
                        ? { ...smallCard.boldText }
                        : { ...smallCard.regularText }
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
        <View style={filter.containerfs}>
          <Pressable
            style={{ flexDirection: "row", }}
          >

            {/* <Text style={{fontWeight:'bold',fontSize:18}}>filter</Text> */}
            <View style={filter.numbertypecontainer}>
              <Icon
                name="filter"
                size={25}
                color="#343434"
                style={{ marginRight: 3 }}
              />
              <SelectDropdown
                data={filters}
                onSelect={(selectedItem) => {
                  setFilterType(selectedItem.title);
                  handleAll(selectedItem.title)
                  console.log(selectedItem.title);
                }}
                renderButton={(selectedItem, isOpened) => {
                  return (
                    <View style={filter.dropdownButtonStyle}>
                      <Text style={filter.dropdownButtonTxtStyle}>
                        {(filterType && filterType) || 'filter'}
                      </Text>
                      <Icon name={isOpened ? 'chevron-up' : 'chevron-down'} style={filter.dropdownButtonArrowStyle} />
                    </View>
                  );
                }}
                renderItem={(item, index, isSelected) => {
                  return (
                    <View style={{ ...filter.dropdownItemStyle, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                      <Text style={filter.dropdownItemTxtStyle}>{item.title}</Text>
                    </View>
                  );
                }}
                showsVerticalScrollIndicator={false}
                dropdownStyle={filter.dropdownMenuStyle}
              />



            </View>
            {filterType === 'size' && (
              <SelectDropdown
                data={size}
                onSelect={(selectedItem) => {
                  setsizeType(selectedItem.title);
                  handleSize(selectedItem.title);
                  console.log(selectedItem.title);
                }}
                renderButton={(selectedItem, isOpened) => {
                  return (
                    <View style={filter.dropdownButtonStyle}>
                      <Text style={filter.dropdownButtonTxtStyle}>
                        {(sizeType && sizeType) || 'size'}
                      </Text>
                      <Icon name={isOpened ? 'chevron-up' : 'chevron-down'} style={filter.dropdownButtonArrowStyle} />
                    </View>
                  );
                }}
                renderItem={(item, index, isSelected) => {
                  return (
                    <View style={{ ...filter.dropdownItemStyle, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                      <Text style={filter.dropdownItemTxtStyle}>{item.title}</Text>
                    </View>
                  );
                }}
                showsVerticalScrollIndicator={false}
                dropdownStyle={filter.dropdownMenuStyle}
              />
            )}
            {filterType === 'color' && (
              <SelectDropdown
                data={color}
                onSelect={(selectedItem) => {

                  setcolorType(selectedItem.title);
                  handleColor(selectedItem.title);
                  console.log(selectedItem.title);
                }}
                renderButton={(selectedItem, isOpened) => {
                  return (
                    <View style={filter.dropdownButtonStyle}>
                      <Text style={filter.dropdownButtonTxtStyle}>
                        {(colorType && colorType) || 'color'}
                      </Text>
                      <Icon name={isOpened ? 'chevron-up' : 'chevron-down'} style={filter.dropdownButtonArrowStyle} />
                    </View>
                  );
                }}
                renderItem={(item, index, isSelected) => {
                  return (
                    <View style={{ ...filter.dropdownItemStyle, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                      <Text style={filter.dropdownItemTxtStyle}>{item.title}</Text>
                    </View>
                  );
                }}
                showsVerticalScrollIndicator={false}
                dropdownStyle={filter.dropdownMenuStyle}
              />
            )}
          </Pressable>
          <Pressable
            style={{ flexDirection: "row", marginLeft: 5 }}
          >

            {/* <Text style={{fontWeight:'bold',fontSize:18}}>filter</Text> */}
            <View style={filter.numbertypecontainer}>
              <Pressable onPress={() => { seticonsort(!iconsort), setSortOrder(!iconsort), handlesort(sortType) }}>
                <Icon
                  name={iconsort ? "sort-alpha-asc" : "sort-alpha-desc"}
                  size={25}
                  color="#343434"
                  style={{ marginRight: 10 }}

                />
              </Pressable>
              <SelectDropdown
                data={sort}
                onSelect={(selectedItem) => {
                  setSortType(selectedItem.title);
                  setSortOrder(true);
                  seticonsort(true);
                  handlesort(sortType);
                  console.log(selectedItem.title);
                }}
                renderButton={(selectedItem, isOpened) => {
                  return (
                    <View style={filter.dropdownButtonStyle}>
                      <Text style={filter.dropdownButtonTxtStyle}>
                        {(sortType && sortType) || 'Sort'}
                      </Text>
                      <Icon name={isOpened ? 'chevron-up' : 'chevron-down'} style={filter.dropdownButtonArrowStyle} />
                    </View>
                  );
                }}
                renderItem={(item, index, isSelected) => {
                  return (
                    <View style={{ ...filter.dropdownItemStyle, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                      <Text style={filter.dropdownItemTxtStyle}>{item.title}</Text>
                    </View>
                  );
                }}
                showsVerticalScrollIndicator={false}
                dropdownStyle={filter.dropdownMenuStyle}
              />


            </View>
          </Pressable>
        </View>
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
        <View style={productpage.bottoms}></View>
      </ScrollView>

      <BottomNavigator navigation={navigation} userId={userId} />
    </View>
  );
};
////////////////////////////////////////////////////////////////////////////////////////////

const KidsDetails = ({ route, navigation }) => {
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
    navigation.navigate("CartScreen", { userId: userId });
  };
  const handleSeeAllReviews = () => {
    navigation.navigate("AllReviewsPage", { reviews });
    <Text style={productpage.seeAllText}>
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

  const getCartItems = async (id) => {
    const userRef = doc(db, "users", id);
    const userSnap = await getDoc(userRef);
    const cartCount = userSnap?.data()?.cart?.length ?? 0;

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
    } else {
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
  const words = product.description?.split(" ");
  const lines = [];
  let line = "";
  for (let i = 0; i < words?.length; i++) {
    line += words[i] + " ";
    if ((i + 1) % wordsPerLine === 0 || i === words?.length - 1) {
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
        reviews?.map(async (review, index) => {
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
    <View style={productpage.productContainer}>
      <ScrollView onScroll={handleScroll2}>
        <View>
          {/* image */}
          <FlatList
            horizontal
            data={product.images}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={productpage.productImage} />
            )}
            keyExtractor={(image, index) => index}
            onScroll={(event) => handleScroll(event, product.id)}
          />
          <View style={productpage.dotsContainerDetails}>
            {product.images?.map((_, index) => (
              <View
                key={index}
                style={[
                  productpage.dotDetails,
                  index === (activeIndexes[product.id] || 0)
                    ? productpage.activeDotDetails
                    : null,
                ]}
              />
            ))}
          </View>
          {/* cart */}
          <View style={productpage.containerHeart}>
            <Pressable
              onPress={() => {
                navigation.navigate('CartScreen', { userId: userId })
              }} style={productpage.addToFavBtn}>
              <Icon name="shopping-cart" size={28} color={COLORS.dark} />
            </Pressable>
          </View>
          <View style={productpage.containercount}>
            <Pressable
              onPress={() => {
                navigation.navigate('CartScreen', { userId: userId })
              }} style={productpage.countcart}>
              <Text style={{ color: COLORS.white }}>{cartCount}</Text>
            </Pressable>
          </View>
          <View
            style={{
              marginTop: 2,
              marginBottom: 5,
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
                <View style={{ width: "60%" }}>
                  {/* product name */}
                  <Text style={productpage.NameD}>{product.name}</Text>
                  {product.offer !== 0 ? (
                    <>
                      {/* price with offer */}
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
                </View>
              </View>
            </View>

            <View>
              {/* Choose color */}
              {product.colors.length > 1 && (
                <View style={productpage.colorsContainer}>
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
                    keyExtractor={(color, index) => index}
                    renderItem={({ item }) => {
                      let buttonStyle = [
                        productpage.colorButton,
                        { backgroundColor: item.toLowerCase() },
                      ];
                      if (selectedColor === item) {
                        console.log("color", item)
                        if (item.toLowerCase() === "black") {
                          buttonStyle.push(productpage.blackButtonStyle);
                        } else {
                          buttonStyle.push(productpage.selectedColorButton);
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
              <View style={productpage.sizesContainer}>
                <FlatList
                  horizontal
                  data={product.sizes}
                  keyExtractor={(size, index) => index.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        productpage.sizeButton,
                        selectedSize === item && productpage.selectedSizeButton,
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
                      <Text style={[productpage.sizeText, productpage.sizeButtonText]}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </View>
            <View style={productpage.line}></View>
            {/* discribtion */}
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
            {lines?.map((line, index) => (
              <Text key={index} style={productpage.description}>
                {line}
              </Text>
            ))}
            {/* rate */}
            {reviews.length > 0 && (
              <View style={productpage.container}>

                <View style={{ flexDirection: "row", alignItems: "center", width: '100%' }}>

                  <Text
                    style={{ fontSize: 20, fontWeight: "bold", marginTop: 10, width: '60%' }}
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
                        justifyContent: 'flex-end'
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
                    <View style={productpage.reviewContainer}>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      ><View style={{ flexDirection: "row", alignItems: "center", width: '80%' }}>
                          <Text style={productpage.reviewText}>{item.username} </Text>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Icon
                              name={star <= item.rating ? "star" : "star-o"}
                              size={17}
                              color="black"
                            />
                          ))}
                        </View>
                        <Text style={{ width: '40%', color: "black" }}>
                          {item.date}{" "}
                        </Text>

                      </View>
                      <Text style={[productpage.reviewText, { marginTop: 15 }]}>
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
                          style={productpage.likeButton}
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
                          style={productpage.dislikeButton}
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
            )}
          </View>
        </View>
        {/* add review button */}
        <View style={{ backgroundColor: COLORS.white }}>
          {
            <TouchableOpacity
              style={productpage.reviewButon}
              onPress={() =>
                navigation.navigate("AddReviewMen", {
                  product: { id: product_id },
                  fetchAllReviews,
                })
              }
            >
              <Text style= {[{color:'white',fontSize:20} ] }>Add a Review</Text>
            </TouchableOpacity>
          }
        </View>

      </ScrollView>
      <View style={productpage.bottomBar}>
        <View style={productpage.Navbarr}>
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
                  <View style={productpage.buttonContainer}>
                    <Text style={productpage.priceText}>
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

                    <View style={productpage.container}>
                      <TouchableOpacity
                        style={productpage.addToCartBton2}
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
                        <Text style={productpage.addToCartButtonText}>
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
                        <View style={productpage.modalContainer}>
                          <View style={productpage.modalContent}>
                            {product.colors.length !== 1 ? (
                              selectedColor && selectedSize ? (
                                <>
                                  <Text style={productpage.modalText}>
                                    Item added to cart!
                                  </Text>
                                  {setShowGoToCartButton(true)}
                                </>
                              ) : (
                                <Text style={productpage.modalText}>
                                  Please select a size and color if available
                                </Text>
                              )
                            ) : selectedColor || selectedSize ? (
                              <>
                                <Text style={productpage.modalText}>
                                  Item added to cart!
                                </Text>
                                {setShowGoToCartButton(true)}
                              </>
                            ) : (
                              <Text style={productpage.modalText}>
                                Please select a size and color if available
                              </Text>
                            )}

                            <TouchableOpacity
                              style={productpage.okButton}
                              onPress={() => {
                                setShowGoToCartButton(!showGoToCartButton);
                              }}
                            >
                              {showGoToCartButton ? (
                                <TouchableOpacity
                                  style={productpage.okButton}
                                  onPress={handleGoToCart}
                                >
                                  <Text style={productpage.okButtonText}>
                                    go to cart
                                  </Text>
                                </TouchableOpacity>
                              ) : (
                                <TouchableOpacity style={productpage.okButton}>
                                  <Text style={productpage.okButtonText}>OK</Text>
                                </TouchableOpacity>
                              )}
                            </TouchableOpacity>
                          </View>
                        </View>
                      </Modal>
                    </View>
                  </View>
                ) : (
                  <View style={productpage.buttonContainer}>
                    <Pressable onPress={() => onAddToFav(item, index)}>
                      <Icon
                        name="heart"
                        size={30}
                        color={isPressed ? "black" : "grey"}
                      />
                    </Pressable>
                    <View style={productpage.container}>
                      <TouchableOpacity
                        style={productpage.addToCartBton1}
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
                        <Text style={productpage.addToCartButtonText}>
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
                        <View style={productpage.modalContainer}>
                          <View style={productpage.modalContent}>
                            {product.colors.length !== 1 ? (
                              selectedColor && selectedSize ? (
                                <>
                                  <Text style={productpage.modalText}>
                                    Item added to cart!
                                  </Text>
                                  {setShowGoToCartButton(true)}
                                </>
                              ) : (
                                <Text style={productpage.modalText}>
                                  Please select a size and color if available
                                </Text>
                              )
                            ) : selectedColor || selectedSize ? (
                              <>
                                <Text style={productpage.modalText}>
                                  Item added to cart!
                                </Text>
                                {setShowGoToCartButton(true)}
                              </>
                            ) : (
                              <Text style={productpage.modalText}>
                                Please select a size and color if available
                              </Text>
                            )}

                            <TouchableOpacity
                              style={productpage.okButton}
                              onPress={() => {
                                setShowGoToCartButton(!showGoToCartButton);
                              }}
                            >
                              {showGoToCartButton ? (
                                <TouchableOpacity
                                  style={productpage.okButton}
                                  onPress={handleGoToCart}
                                >
                                  <Text style={productpage.okButtonText}>
                                    go to cart
                                  </Text>
                                </TouchableOpacity>
                              ) : (
                                <TouchableOpacity style={productpage.okButton}>
                                  <Text style={productpage.okButtonText}>OK</Text>
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
    marginBottom: 30,
    marginTop: 0,
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
    height: 40
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
    height: 60,
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
    height: 60,
    borderBottomColor: "transparent",
    borderBottomWidth: 2,
  },
  smallCardSelected: {
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    height: 60,
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
    //fontFamily: "SofiaRegular",
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
    marginTop: 262,
    //  zIndex: 1
    //marginBottom:30,
  },
  dot: {
    width:(cardwidth/4)-10,
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
    //position: "fixed",
    //position: "fixed",
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
    height: height/20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: 10
  },
  reviewButon: {
    backgroundColor: "black",
    paddingHorizontal: 10,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    alignContent: 'center',
    marginLeft: cardwidth / 4,
    width: width - cardwidth / 2,
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
    marginBottom:2,

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
  containerfs: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 5,
    marginBottom: 20
  },
  dropdownButtonStyle: {
    width: 90,
    height: 50,
    // backgroundColor: '#E9ECEF',
    // borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  dropdownButtonTxtStyle: {
    // flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#393e46',
  },
  dropdownButtonArrowStyle: {
    fontSize: 22,
    marginLeft: 5
  },
  // dropdownButtonIconStyle: {
  //   fontSize: 18,
  //   marginRight: 8,
  // },
  dropdownMenuStyle: {
    backgroundColor: '#E9ECEF',
    borderRadius: 8,
  },
  dropdownItemStyle: {
    // width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  numbertypecontainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'space-evenly',
    width: 80,
    height: 45,
    borderBottomColor: "black",
    borderBottomWidth: 1,
  },
  dropdownItemTxtStyle: {
    // flex: 1,
    fontSize: 16,
    // fontWeight: '500',
    color: '#151E26',
  },
});
export { ProductsListKids, KidsDetails };
