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
import COLORS from "../Consts/Color";
import {
    doc,
    collection,
    updateDoc,
    getDocs,
    getDoc,
    deleteDoc,
} from "firebase/firestore";
import { useRef } from "react";
import { auth, db, storage } from "../firebase";
import Food, { filterData, productt, option, size } from "../data";
import Icon from "react-native-vector-icons/FontAwesome";
import Search from "../components/search";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomNavigator from "../components/bar";
import Spinner from "react-native-loading-spinner-overlay";
import SelectDropdown from 'react-native-select-dropdown';
import { card } from "../Consts/styles";
const { width } = Dimensions.get("screen");
const { height } = Dimensions.get("screen");

const cardwidth = width / 2;
const AdminRecycle = ({ navigation }) => {
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
    const [filterType, setFilterType] = useState("");
    const [sizeType, setsizeType] = useState("");
    const [colorType, setcolorType] = useState("");
    const [sortType, setSortType] = useState("");
    const [sortOrder, setSortOrder] = useState(true);
    const imageWidth = 200;

    const filters = [
        { title: 'all' },
        { title: 'size' },
        { title: 'color' },
    ];
    const size = [
        { title: 'XS' },
        { title: 'S' },
        { title: 'M' },
        { title: 'L' },
        { title: 'XL' },
        { title: 'XXL' },
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
    const sort = [
        { title: 'price' },
        { title: 'rate' },
        { title: 'none' },
    ];

    // get user id
    useEffect(() => {
        const getUserId = async () => {
            const id = await AsyncStorage.getItem("USERID");
            setUserId(id);
        };
        getUserId();
    }, [isFocused]);

    // get products
    useEffect(() => {
        const getProducts = async () => {
            try {
                const productsCollection = collection(db, "recycle");
                const productsSnapshot = await getDocs(productsCollection);
                let productsData = productsSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                if (sortType === 'price') {
                    productsData.sort((a, b) => {
                        const priceA = a.price || 0;
                        const priceB = b.price || 0;
                        return sortOrder ? priceA - priceB : priceB - priceA;
                    });
                } else if (sortType === 'rate') {
                    productsData.sort((a, b) => {
                        const rateA = a.rate || 0; // Default to 0 if price is missing
                        const rateB = b.rate || 0;
                        return sortOrder ? rateA - rateB : rateB - rateA;
                    });
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
    }, [isFocused]);

    // filter
    // filter by size
    useEffect(() => {
        handleSize()
    }, []);

    const handleSize = (title) => {
        const filterSize = filterproduct.filter(product => containsize(product, title))
        setProducts(filterSize);
    };

    const containsize = ({ sizes }, query) => {
        return sizes.some(size => size.includes(query));
    };

    // filter by color
    useEffect(() => {
        handleColor()
    }, []);

    const handleColor = (title) => {
        const filterColor = filterproduct.filter(product => containColor(product, title))
        setProducts(filterColor);
    };

    const containColor = ({ colors }, query) => {
        return colors.some(color => color.includes(query));
    };

    // All product
    const handleAll = (title) => {
        if (title === 'all') {
            setProducts(filterproduct);
        }
    }

    // sort
    const handlesort = (title) => {
        if (title === 'price') {
            products.sort((a, b) => {
                const priceA = a.price || 0; // Default to 0 if price is missing
                const priceB = b.price || 0;
                return !sortOrder ? priceA - priceB : priceB - priceA;
            });
            setProducts(products);
        } else if (title === 'rate') {
            products.sort((a, b) => {
                const rateA = a.rate || 0; // Default to 0 if price is missing
                const rateB = b.rate || 0;
                return !sortOrder ? rateA - rateB : rateB - rateA;
            });
            setProducts(products);
        } else {
            setProducts(filterproduct);
        }
    }

    // navigation
    const handleProductPress = (product) => {
        navigation.navigate("adminRecycleDetails", { product });
    };

    //scroll images
    const handleScroll = (event, productId) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const currentIndex = Math.floor(contentOffsetX / imageWidth);
        setActiveIndexes((prevState) => ({
            ...prevState,
            [productId]: currentIndex,
        }));
    };

    //to flatlist
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
          {item.images.map((_, index) => (
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
        <View style={styles.container}>
            <View style={styles.headerName}>
                <Text style={styles.Textt}> AToZ </Text>
            </View>
            <Search />

            <View style={styles.header}>
                {/* category */}
                <FlatList
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    data={filterData}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item, index }) => (
                        <Pressable onPress={() => navigation.navigate(item.name)}>
                            <View
                                style={
                                    item.name === "Used"
                                        ? { ...styles.smallCardSelected }
                                        : { ...styles.smallCard }
                                }
                            >
                                <View style={styles.smallCardText}>
                                    <Text
                                        style={
                                            item.name === "Used"
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
            <ScrollView nestedScrollEnabled={true}>
                <View style={styles.containerfs}>
                    {/* filter */}
                    <Pressable
                        style={{ flexDirection: "row", }}
                    >
                        <View style={styles.numbertypecontainer}>
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
                                }}
                                renderButton={(selectedItem, isOpened) => {
                                    return (
                                        <View style={styles.dropdownButtonStyle}>
                                            <Text style={styles.dropdownButtonTxtStyle}>
                                                {(filterType && filterType) || 'filter'}
                                            </Text>
                                            <Icon name={isOpened ? 'chevron-up' : 'chevron-down'} style={styles.dropdownButtonArrowStyle} />
                                        </View>
                                    );
                                }}
                                renderItem={(item, index, isSelected) => {
                                    return (
                                        <View style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                                            <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
                                        </View>
                                    );
                                }}
                                showsVerticalScrollIndicator={false}
                                dropdownStyle={styles.dropdownMenuStyle}
                            />
                        </View>

                        {/* filter by size */}
                        {filterType === 'size' && (
                            <SelectDropdown
                                data={size}
                                onSelect={(selectedItem) => {
                                    setsizeType(selectedItem.title);
                                    handleSize(selectedItem.title);
                                }}
                                renderButton={(selectedItem, isOpened) => {
                                    return (
                                        <View style={styles.dropdownButtonStyle}>
                                            <Text style={styles.dropdownButtonTxtStyle}>
                                                {(sizeType && sizeType) || 'size'}
                                            </Text>
                                            <Icon name={isOpened ? 'chevron-up' : 'chevron-down'} style={styles.dropdownButtonArrowStyle} />
                                        </View>
                                    );
                                }}
                                renderItem={(item, index, isSelected) => {
                                    return (
                                        <View style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                                            <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
                                        </View>
                                    );
                                }}
                                showsVerticalScrollIndicator={false}
                                dropdownStyle={styles.dropdownMenuStyle}
                            />
                        )}
                        {/* filter by color */}
                        {filterType === 'color' && (
                            <SelectDropdown
                                data={color}
                                onSelect={(selectedItem) => {
                                    setcolorType(selectedItem.title);
                                    handleColor(selectedItem.title);
                                }}
                                renderButton={(selectedItem, isOpened) => {
                                    return (
                                        <View style={styles.dropdownButtonStyle}>
                                            <Text style={styles.dropdownButtonTxtStyle}>
                                                {(colorType && colorType) || 'color'}
                                            </Text>
                                            <Icon name={isOpened ? 'chevron-up' : 'chevron-down'} style={styles.dropdownButtonArrowStyle} />
                                        </View>
                                    );
                                }}
                                renderItem={(item, index, isSelected) => {
                                    return (
                                        <View style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                                            <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
                                        </View>
                                    );
                                }}
                                showsVerticalScrollIndicator={false}
                                dropdownStyle={styles.dropdownMenuStyle}
                            />
                        )}
                    </Pressable>

                    {/* sort */}
                    <Pressable
                        style={{ flexDirection: "row", marginLeft: 5 }}
                    >
                        <View style={styles.numbertypecontainer}>
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
                                }}
                                renderButton={(selectedItem, isOpened) => {
                                    return (
                                        <View style={styles.dropdownButtonStyle}>
                                            <Text style={styles.dropdownButtonTxtStyle}>
                                                {(sortType && sortType) || 'Sort'}
                                            </Text>
                                            <Icon name={isOpened ? 'chevron-up' : 'chevron-down'} style={styles.dropdownButtonArrowStyle} />
                                        </View>
                                    );
                                }}
                                renderItem={(item, index, isSelected) => {
                                    return (
                                        <View style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                                            <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
                                        </View>
                                    );
                                }}
                                showsVerticalScrollIndicator={false}
                                dropdownStyle={styles.dropdownMenuStyle}
                            />


                        </View>
                    </Pressable>
                </View>

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

            {/* add product button */}
            <View style={styles.Addproduct}>
                <TouchableOpacity onPress={() => navigation.navigate('AddUserProduct')}
                    style={styles.Addproductbutton}>
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>Add product</Text>
                </TouchableOpacity>
            </View>
            <BottomNavigator navigation={navigation} userId={userId} />
        </View>
    );
};
////////////////////////////////////////////////////////////////////////////////////////////

const AdminRecycleDetails = ({ route, navigation }) => {

    const { product } = route.params ? route.params : { product: {} };
    const [productt, setProductt] = React.useState([]);
    const [selectedOptionIndex, setSelectedOptionIndex] = React.useState(0);
    const [cartCount, setCartCount] = useState(0);
    const [hasCheckedOut, setHasCheckedOut] = useState(false);
    const [userId, setUserId] = useState("");
    const isFocused = useIsFocused();
    const product_id = product.id;
    const [comments, setComment] = useState(0);
    const [rating, setRating] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [reviewsWithLikes, setReviewsWithLikes] = useState([]);
    const scrollViewRef = useRef(null);
    const [activeIndexes, setActiveIndexes] = useState({});
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [showPrice, setShowPrice] = useState(false);
    const [modalVisibleCart, setModalVisibleCart] = useState(false);
    const [Accepted, setAccepted] = useState(product.isAccept);
    const [Sold, setSold] = useState(product.sold);
    const numberOfInitialReviews = 3;
    const imageWidth = width;

    // get product
    useEffect(() => {
        const fetchItem = async (product_id) => {
            const documentSnapshot = await getDoc(doc(db, "recycle", product_id));
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
    }, [isFocused]);

    // get user id
    useEffect(() => {
        const getUserId = async () => {
            const id = await AsyncStorage.getItem("USERID");
            setUserId(id);
        };
        getUserId();
    }, []);

    useEffect(() => {
        setAccepted(product.isAccept)
    }, [isFocused]);

    useEffect(() => {
        if (hasCheckedOut) {
            setHasCheckedOut(true);
        }
    }, []);

    useEffect(() => {
        if (userId) {
            getCartItems();
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

    const handleSeeAllReviews = () => {
        navigation.navigate("AllReviewsPage", { reviews });
        <Text style={styles.seeAllText}>
            See All ({reviews ? reviews.length : 0})
        </Text>;
    };

    //cart
    const getCartItems = async () => {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        const cartCount = userSnap?.data()?.cart?.length ?? 0;
        setCartCount(cartCount);
    };

    const handleScroll = (event, product_id) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const currentIndex = Math.floor(contentOffsetX / imageWidth);
        setActiveIndexes((prevState) => ({
            ...prevState,
            [product_id]: currentIndex,
        }));
    };

    const handleScroll2 = (event) => {
        const scrollPosition = event.nativeEvent.contentOffset.y;
        const screenHeight = Dimensions.get("window").height;
        const scrollThreshold = screenHeight * 0.75;
        if (scrollPosition >= 210) {
            setShowPrice(true);
        } else {
            setShowPrice(false);
        }
    };

    // accept product
    const handleAccept = async () => {
        const documentSnapshot = doc(db, "recycle", product_id);
        await updateDoc(documentSnapshot, { isAccept: "accepted" })
        setAccepted(product.isAccept)
    };

    // reject product
    const handleReject = async () => {
        const documentSnapshot = doc(db, "recycle", product_id);
        await updateDoc(documentSnapshot, { isAccept: "reject" })
        setAccepted(product.isAccept)
    }
    const handleDelete = async () => {
        const documentSnapshot = doc(db, "recycle", product_id);
        await deleteDoc(documentSnapshot);
        setTimeout(() => {
            navigation.navigate("adminRecycle");
        }, 10000);
    }

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
    };

    // review 
    let flagAdmin = false;
    const fetchAllReviews = async () => {
        try {
            const productRef = doc(db, "recycle", product_id);
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

    // like and dislike
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

    // like
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

    // dislike
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

    // recently visit    
    useEffect(() => {
        saveRecentlyVisited(
            product.id,
            product.name,
            product.categoryName,
            product.images,
            product.colors,
            product.description,
            product.offer,
            product.price,
            product.sizes);
    }, []);

    const saveRecentlyVisited = async (id, name, categoryName, images, colors, description, offer, price, sizes) => {
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
                }
                await updateDoc(userRef, { recentlyVisited: updatedRecentlyVisited });
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
                    {/* image */}
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
                                <View style={{ width: "50%" }}>
                                    {/* name */}
                                    <Text style={styles.NameD}>
                                        {product.name}
                                    </Text>
                                    {/* price */}
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
                                            {/* offer */}
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
                                <View
                                    style={{
                                        width: "50%",
                                        alignItems: "flex-end",
                                        marginTop: 10,
                                    }}
                                >
                                    {/* stars */}
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
                            {/* color */}
                            {product.colors.length >= 0 && (
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
                            {/* size */}
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
                        {lines.map((line, index) => (
                            <Text key={index} style={styles.description}>
                                {line}
                            </Text>
                        ))}
                        {/* comments */}
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
                            {/* reviews */}
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
                            <Text style={{ color: 'white', fontWeight: "bold", fontSize: 15 }}>Add a Review</Text>
                        </TouchableOpacity>
                    }
                </View>
            </ScrollView>
            {/* accept or reject button */}
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
                                {Accepted === "not accept" && (
                                    <View style={styles.buttonContainer}>
                                        <View style={styles.container}>
                                            <TouchableOpacity
                                                style={styles.addToCartBton2}
                                                onPress={() => handleReject()}
                                            >
                                                <Text style={styles.addToCartButtonText}>
                                                    reject
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={styles.container}>
                                            <TouchableOpacity
                                                style={styles.addToCartBton2}
                                                onPress={() => handleAccept()}
                                            >
                                                <Text style={styles.addToCartButtonText}>
                                                    Accept
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}
                                {(Accepted === 'accepted' && !Sold) && (
                                    <View style={styles.buttonContainer}>
                                        <View style={styles.acceptcontainer}>
                                            <Text style={{ color: 'black', alignItems: 'center', fontSize: 20, fontWeight: 'bold' }}>
                                                Accepted
                                            </Text>
                                        </View>
                                    </View>
                                )}
                                {Accepted === 'reject'  && (
                                    <View style={styles.buttonContainer}>
                                       <View style={styles.container}>
                                            <TouchableOpacity
                                                style={styles.addToCartBton2}
                                                onPress={() => handleDelete()}
                                            >
                                                <Text style={styles.addToCartButtonText}>
                                                    Delete
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}
                                {Sold && (
                                    <View style={styles.buttonContainer}>
                                        <View style={styles.acceptcontainer}>
                                            <Text style={{ color: 'black', alignItems: 'center', fontSize: 20, fontWeight: 'bold' }}>
                                                Sold
                                            </Text>
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
    cardView: {
        marginHorizontal: 1,
        marginBottom: 30,
        marginTop: 0,
        width: cardwidth,
        height: 370,
        elevation: 13,
        backgroundColor: "white",
    },
    Name: {
        fontSize: 14,
        color: "#131A2C",
        marginTop: 0,
        marginLeft: 10,
        marginBottom: 0,
        height: 40,
    },
    container: {
        flex: 1,
        backgroundColor: "#FFFF",
    },
    acceptcontainer: {
        flex: 1,
        backgroundColor: "#FFFF",
        alignItems: 'center',
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
    smallCard: {
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
    Textt: {
        color: COLORS.darkblue,
        fontSize: 35,
    //    fontFamily: "SofiaRegular",
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
    imagee: {
        position: "relative",
        width: 220,
        height: 300,
    },
    ///////////////////add new style/////////////////
    productContainer: {
        padding: 0,
        flex: 1,
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
    },
    sizeText: {
        fontSize: 16,
        color: "black",
    },
    NameD: {
        fontSize: 14,
        color: "#131A2C",
        marginTop: 5,
        marginLeft: 10,
        marginBottom: 0,
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
    },
    bottomBar: {
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
        height: 40,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginLeft: 20
    },
    addToCartBton1: {
        backgroundColor: "black",
        paddingHorizontal: 10,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: cardwidth / 4,
        width: 300,
    },
    addToCartBton2: {
        backgroundColor: "black",
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        width: 150,
    },
    reviewContainer: {
        backgroundColor: "rgb(250, 250, 250)",
        padding: 5,
        marginBottom: 5,
        elevation: 3,
    },
    reviewText: {
        fontSize: 15,
    },
    addToCartButtonText: {
        color: "white",
        fontSize: 18,
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
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 12,
    },
    dropdownButtonTxtStyle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#393e46',
    },
    dropdownButtonArrowStyle: {
        fontSize: 22,
        marginLeft: 5
    },
    dropdownMenuStyle: {
        backgroundColor: '#E9ECEF',
        borderRadius: 8,
    },
    dropdownItemStyle: {
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
        fontSize: 16,
        color: '#151E26',
    },
    Addproduct: {
        width: '100%',
        height: 60,
        backgroundColor: '#fff',
        position: 'absolute',
        bottom: 60,
        elevation: 5,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    Addproductbutton: {
        width: cardwidth,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.dark,
    },
});
export { AdminRecycle, AdminRecycleDetails };
