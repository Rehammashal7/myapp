import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ScrollView, Pressable, Dimensions } from 'react-native';
import COLORS from '../Consts/Color';
import { doc, collection, updateDoc, getDocs, getDoc } from "firebase/firestore";
import { auth, db, storage } from '../firebase';
import Food, { filterData, productt, option, size } from '../data';
import FoodCard from '../components/Foodcard';
import Icon from 'react-native-vector-icons/FontAwesome';
import PrimaryButton from '../components/Button';
import Header from './Header';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Search from '../components/search';
import BottomNavigator from '../components/bar';

const { width } = Dimensions.get("screen");
const cardwidth = width / 2 - 20;
let iconcolor;
const ProductsListPizza = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [userId, setUserId] = useState("");
  const isFocused = useIsFocused();
    const [isPressed, setIsPressed] = useState('');
  useEffect(() => {
    const getProducts = async () => {
      const productsCollection = collection(db, "pizza");
      const productsSnapshot = await getDocs(productsCollection);
      const productsData = productsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsData);
    };
    getProducts();
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      const querySnapshot = await getDocs(collection(db, "pizza"));
      console.log("Total products: ", querySnapshot.size);
      let tempData = [];
      querySnapshot.forEach((documentSnapshot) => {
        console.log(
          "product ID: ",
          documentSnapshot.id,
          documentSnapshot.data()
        );
        tempData.push({
          id: documentSnapshot.id,
          data: documentSnapshot.data(),
        });
      });
      setProducts(tempData);
    };
    //fetchItems();
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
            const id = await AsyncStorage.getItem('USERID');
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
        let existingItem = fav.find(itm => itm.id === item.id);

        if (existingItem) {
            existingItem.qty += 1;
        } else {
            fav.push({ ...item, qty: 1 });
        }
        await updateDoc(userRef, { fav });
        getFavItems();
    };



  const handleProductPress = (product) => {
    navigation.navigate("PizzaDetails", { product });
  };

  const renderProduct = ({ item }) => (
    <TouchableOpacity onPress={() => handleProductPress(item)}>
      <View style={styles.cardView}>
        <Image source={{ uri: item.imageUrl }} style={styles.image} />

        <Text style={styles.Name}>{item.name}</Text>
        <View
          style={{
            flexDirection: "row",
            marginTop: 10,
            marginHorizontal: 20,
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            {item.price}LE
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  return (

    <View style={styles.container}>
      
      <View style={styles.headerName}>
                <Text style={styles.Textt}> AToZ </Text>
            </View>
                <Search/>

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
                    <Text style={
                      item.name === "WOMAN" ? { ...styles.boldText} : { ...styles.regularText}}>{item.name}</Text>
                </View>
            </View>
        </Pressable>
    )}
/>
            </View>
            <ScrollView>
                <FlatList
                    numColumns={2}
                    data={products}
                    renderItem={renderProduct}
                    keyExtractor={(item) => item.id}
                />
                <View style={styles.bottoms}></View>
            </ScrollView>
            {/* <View style={styles.NavContainer} >
                <View style={styles.Navbar} >

                    <Pressable onPress={() => navigation.navigate("profile")} style={styles.iconBehave}>
                        <Icon name="user" size={25} color={COLORS.grey} />
                    </Pressable>
                    <Pressable onPress={() => navigation.navigate("Home")} style={styles.iconBehave} >
                        <Icon name="home" size={25} color={COLORS.grey} />
                    </Pressable>
                    <Pressable onPress={() => navigation.navigate("favorite", { userId: userId })} style={styles.iconBehave} >
                        <Icon name="heart" size={25} color={COLORS.grey} />
                    </Pressable>
                    <Pressable onPress={() => navigation.navigate('CartScreen', { userId: userId })} style={styles.iconBehave} >
                        <Icon name="shopping-cart" size={25} color={COLORS.grey} />
                    </Pressable>
                </View>
            </View> */}
                        <BottomNavigator navigation={navigation} userId={userId} />
        </View>
    );
};
////////////////////////////////////////////////////////////////////////////////////////////

const PizzaDetails = ({ route, navigation }) => {
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
  const [reviews, setReviews] = useState([]);
  const [showReviews, setShowReviews] = useState(false);
  const [rating, setRating] = useState(0);
  const [isPaymentCompleted, setPaymentCompleted] = useState(false);
  const toggleReviews = () => {
    setShowReviews(!showReviews);
  };
  useEffect(() => {
    const fetchItem = async (product_id) => {
      const documentSnapshot = await getDoc(doc(db, "pizza", product_id));
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
    console.log("noo " + hasCheckedOut)
    if (hasCheckedOut) {
      setHasCheckedOut(true);
      console.log("yess " + hasCheckedOut)

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
  
  
  let  flagAdmin = false;
const fetchAllReviews = async () => {
    try {
        const productRef = doc(db, "pizza", product_id);
        const productDoc = await getDoc(productRef);
        const productData = productDoc.data();
        const docRef = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        const username = docSnap.data()?.fName || 'Unknown';
        const data =docSnap.data();
        if (data.isAdmin ==true) {
          flagAdmin = true;
        } 
        setReviews(productData.reviews || []);

        if (productData.reviews && productData.reviews.length > 0) {
            const averageRating =
                productData.reviews.reduce((total, review) => total + review.rating, 0) /
                productData.reviews.length;
            
            setRating(averageRating);
        } else {
            setRating(0);
        }
    } catch (error) {
        console.error("Error fetching reviews: ", error);
    }
};


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

  const onAddToCart = async (item, index) => {
    console.log(userId);
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    const { cart = [] } = userSnap.data() ?? {};
    let existingItem = cart.find((itm) => itm.id === item.id);

        if (existingItem) {
            existingItem.qty += 1;
        } else {
            cart.push({ ...item, qty: 1 });
        }
        await updateDoc(userRef, { cart });
        getCartItems();
    };
    const getFavItems = async () => {

        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);
        const cartCount = userSnap?.data()?.fav?.length ?? 0;
    };
    const onAddToFav = async (item, index) => {
        setIsPressed(!isPressed);
        console.log(userId);
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        const { fav = [] } = userSnap.data() ?? {};
        let existingItem = fav.find(itm => itm.id === item.id);

        if (existingItem) {
            existingItem.qty += 1;
        } else {
            fav.push({ ...item, qty: 1 });
        }
        await updateDoc(userRef, { fav });
        getFavItems();
    };
    const [isPressed, setIsPressed] = useState('');
    const [Newprice, setNewprice] = useState(product.price);
   
    const handlePrice = (pl) => {
      const price=Newprice+pl;
       setNewprice(price)
    };

  return (
    <View style={styles.container}>
      <Header
        title={"FoodApp"}
        icon={require("../assets/cart.png")}
        count={cartCount}
        onClickIcon={() => {
          navigation.navigate("CartScreen", { userId: userId });
        }}
      />

      <View style={{ backgroundColor: COLORS.background, flex: 1 }}>
        <View style={styles.headerWrapper}>
          <View style={styles.titlesWrapper}>
            <Text style={styles.Name2}>{product.name}</Text>
          </View>
        </View>
        <View style={styles.container2}>
          <View style={styles.container}>
            <View style={styles.priceWrapper}>
              <Text style={styles.price}> price : {product.price}LE</Text>
            </View>
    
<View style={styles.inputContainer}>
    <Text style={styles.label}>Rating:</Text>
</View>


<View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                        <Icon
                            name={star <= rating ? 'star' : 'star-o'}
                            size={25}
                            color="gold"
                        />
                  
                ))}
            </View>




                        <FlatList
                            Vertical={true}
                            showsVerticalScrollIndicator={false}
                            data={size}
                            keyExtractor={(item) => item.id}

                            renderItem={({ item, index }) => (
                                <TouchableOpacity
                                    key={index}
                                    activeOpacity={0.8}
                                    onPress={() =>{setSelectedSizeIndex(index),handlePrice(item.price)}}>
                                    <View
                                        style={{
                                            backgroundColor:
                                                selectedSizeIndex == index
                                                    ? COLORS.darkblue
                                                    : COLORS.yellow,
                                            ...styles.size,
                                            marginBottom: 5,
                                            marginLeft: 20
                                        }}
                                        >
                                        <Text
                                            style={{
                                                fontSize: 15,
                                                fontWeight: 'bold',
                                                marginLeft: 10,
                                                marginTop: 5,
                                                color:
                                                    selectedSizeIndex == index
                                                        ? COLORS.white
                                                        : COLORS.darkblue,
                                            }}>
                                            {item.Name}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                            
                        />
                     <View style={styles.priceWrapper}>
                            <Text style={styles.price}> Total price : {Newprice}LE</Text>
                        </View>
                    </View>

                    <Image source={{ uri: product.imageUrl }} style={styles.imageCounter} />
                </View>
                <View style={{ backgroundColor: COLORS.background, flex: 1 }}>
                    <FlatList
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        data={option}
                        keyExtractor={(item) => item.id}


                        renderItem={({ item, index }) => (
                            <TouchableOpacity
                                key={index}
                                activeOpacity={0.8}
                                onPress={() => {setSelectedOptionIndex(index),handlePrice(item.price)}}>
                                <View
                                    style={{
                                        backgroundColor:
                                            selectedOptionIndex == index
                                                ? COLORS.darkblue
                                                : COLORS.yellow,
                                        ...styles.size,
                                        marginBottom: 5,
                                        marginLeft: 20,
                                        marginTop: 20
                                    }}>
                                    <Text
                                        style={{
                                            fontSize: 15,
                                            fontWeight: 'bold',

                                            marginTop: 5,
                                            color:
                                                selectedOptionIndex == index
                                                    ? COLORS.white
                                                    : COLORS.darkblue,
                                        }}>
                                        {item.Name}
                                    </Text>
                                   
                </View>
              </TouchableOpacity>
            )}
          />
          <Text style={{ fontSize: 20, marginBottom: 20 }}>
            {" "}
            discription : {product.description}
          </Text>
                    <View style={{ flex: 9, flexDirection: "row" }}>
              <View style={{ marginLeft: 50, flexDirection: "row" }}>
                <FlatList
                  data={productt}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity
                      key={index}
                      activeOpacity={0.8}
                      onPress={() => setSelectedOptionIndex(index)}
                    >
                      <PrimaryButton
                        title="Add to Order"
                        style={styles.addToCartBtn}
                        onPress={() => {
                          onAddToCart(item, index);
                        }} />
                                        <Pressable onPress={() => onAddToFav(item, index)} >
                          <Icon name="heart" size={30} color={isPressed ? 'red' : 'grey'} />
                                        </Pressable>
                    </TouchableOpacity>

                  )}
                />
                        </View>

          </View>
          <View>
          { (
  <TouchableOpacity 
    style={styles.addToCartBtn}
    onPress={() =>
      navigation.navigate("AddReview", {
        product: { id: product_id },
        fetchAllReviews,
      })
    }
  >
    <Text style={styles.buttonText}>Add a Review</Text>
  </TouchableOpacity>
)}
</View>

<View style={styles.addToCartBtn}>
  <TouchableOpacity onPress={() => { console.log("Fetching reviews..."); fetchAllReviews(); setShowReviews(!showReviews); }}>
    <Text style={styles.buttonText}>{showReviews ? 'Hide Reviews' : 'View Reviews'}</Text>
  </TouchableOpacity>
  {showReviews && (
    <FlatList
      data={reviews}
      renderItem={({ item }) => (
        <View style={styles.reviewContainer}>
              <Text style={styles.reviewText}>User:  {item.username}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                        <Icon
                            name={star <= item.rating ? 'star' : 'star-o'}
                            size={25}
                            color="gold"
                        />
                  
                ))}
            </View>
          <Text style={styles.reviewText}>Comment: {item.comment}</Text>
        </View>
      )}
      keyExtractor={(item, index) => index.toString()}
    />
  )}
</View>

        </View>
        {/* display other product details */}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  headerWrapper: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
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
      marginHorizontal: 10,
      marginBottom: 20,
      marginTop: 20,
      borderRadius: 15,
      width: cardwidth,
      height: 220,
      elevation: 13,
      backgroundColor: 'white',
  },
  image: {
      borderTopLeftRadius: 5,
      borderTopRightRadius: 5,
      height: 150,
      width: 170
  },

  Name: {
      fontSize: 20,
      fontWeight: 'bold',
      color: "#131A2C",
      marginTop: 5,
      marginLeft: 10,
      marginBottom: 5,
      left: 200
  },
  titlesWrapper: {
      paddingHorizontal: 5,
      marginTop: 5,
  },
  Name2: {
      fontFamily: 'Montserrat-Bold',
      fontSize: 32,
      color: COLORS.dark,
  },
  priceWrapper: {
      marginTop: 10,
      paddingHorizontal: 20,
      marginBottom: 10
  },
  price: {
      color: COLORS.dark,
      fontFamily: 'Montserrat-Bold',
      fontSize: 24,
  },
  HeartIcone: {
      height: 30,
      width: 30,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
  },
  sizeContainer: {
      paddingVertical: 20,
      alignItems: 'center',
      paddingHorizontal: 10,
  },
  size: {
      height: 30,
      width: 100,
      marginRight: 7,
      borderRadius: 30,
      alignItems: 'center',
      paddingHorizontal: 5,
  },
  container: {
      flex: 1,
      backgroundColor: '#FFFF',
      //flexDirection:"row",
      // alignItems: 'center',
      // justifyContent: 'center',
  },
  container2: {
      flex: 1,
      backgroundColor: '#FBFAFF',
      flexDirection: "row",

      // alignItems: 'center',
      // justifyContent: 'center',
  },
  heading: {
      color: "WHITE",
      fontSize: 40,
      alignItems: 'center',
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
      bottom: 20
  },
  headerText: {
      color: "#131A2C",
      fontSize: 17,
      fontWeight: "bold",
      alignItems: 'center',
      marginLeft: 10,
      marginBottom: 10,
      marginTop: 10

  },
  Text: {
      color: "#0B0E21",
      fontSize: 40,
      fontWeight: "bold",
      alignItems: 'center',

  },
  discribtion: {
      color: "#0B0E21",
      fontSize: 20,
      fontWeight: "bold",
      alignItems: 'center',

  },
  imageCounter: {
      width: 200,
      height: 250,
      justifyContent: 'space-evenly',
      alignItems: 'center',
      padding: 10,
      left: 7,
      backgroundColor: 'black',
      marginTop: 10,
  },
  smallCard: {
      // borderRadius: 30,
      backgroundColor: 'white',
      justifyContent: "center",
      alignItems: 'center',
      width: 100,
      height: 70,
     borderBottomColor:'transparent', 
      borderBottomWidth: 2, 
  },
  smallCardSelected: {
      backgroundColor: "#FFFFFF",
      justifyContent: "center",
      alignItems: "center",
      width: 100,
      height: 70,
    shadowColor: 'black',
    borderBottomColor: 'black', 
    borderBottomWidth: 2, 
  },
    smallCardTextSected: {
      color: "#131A2C",
    },
    regularText: {
      
      fontWeight: 'normal', 
      fontSize: 16,
  },
  boldText: {
      fontWeight: 'bold',
      fontSize: 18, 
  },
    
    smallCardText: {
      fontSize: 14, 
      color: 'black', 
      textAlign: 'center',
      marginTop: 5, 
  },
  NavContainer: {
      position: 'absolute',
      alignItems: 'center',
      bottom: 5,
      borderBottomLeftRadius: 15,
      borderBottomRightRadius: 15,
  },
  Navbar: {
      flexDirection: 'row',
      backgroundColor: COLORS.dark,
      width: width,
      justifyContent: 'space-evenly',
      borderRadius: 30,
      height: 40

  },
  iconBehave: {
      padding: 35,
      bottom: 30
  },Textt: {
      color: COLORS.darkblue,
      fontSize: 35,
      fontFamily: 'SofiaRegular',
      fontWeight: "bold",
      alignItems: 'center',

  }, headerName: {
      flexDirection: "row",
      backgroundColor: COLORS.background,
      height: '10%',
  },

});
export { ProductsListPizza, PizzaDetails };
