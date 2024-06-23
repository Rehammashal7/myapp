
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Pressable,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useIsFocused, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, collection, where, setDoc, updateDoc, getDocs, getDoc } from "firebase/firestore";
import { auth, db, storage } from '../firebase';
import BottomNavigator from '../components/bar';
import Search from '../components/search';
import COLORS from '../Consts/Color';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('screen');
const { height: screenHeight } = Dimensions.get('window');
const cardheight = screenHeight / 2;
const cardwidth = width / 2;

//parseInt()تحويل 
const CartScreen = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [cartList, setCartList] = useState([]);
  //const [userId, setUserId] = useState('');
  const route = useRoute();
  //const userId = route.params.userId;
  const [userId, setUserId] = useState(route.params.userId);
  const [HistoryOrder, setHistoryOrder] = useState([]);
  const [totalPrice, settotalPrice] = React.useState(0);
  useEffect(() => {
    getCartItems();
    recommended()
  }, [isFocused]);
  const [activeIndexes, setActiveIndexes] = useState({});
  const imageWidth = width;
  const handleScroll = (event, productId) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.floor(contentOffsetX / imageWidth);
    setActiveIndexes((prevState) => ({
      ...prevState,
      [productId]: currentIndex,
    }));
  };
  const handleSomeAction = async () => {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();

      const currentPoints = userData.boun || 0;
      const newPoints = currentPoints + 10;

      await updateDoc(userRef, { boun: newPoints });
    } catch (error) {
      console.error('Error increasing bonus points:', error);
    }
  };
  const [points, setpoints] = useState(0);
  useEffect(() => {
    const getbouns = async () => {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();
      const currentPoints = userData.boun || 0;
      setpoints(currentPoints);
    }
    getbouns();
  }, []);

  const [collectionName, setCollection] = useState([]);
  const [type, setType] = useState([])

  const [indices, setindices] = useState([]);

  useEffect(() => {
    recommended();
    setindices(Array.from({ length: cartList.length }, (_, index) => index));

  }, [cartList]);

  const [Recomendproduct, setRecomendproduct] = useState([])
  const recommended = async () => {
    try {
      const categories = cartList.map(item => item.data.categoryName);
      const types = cartList.map(item => item.data.type);
      const prices = cartList.map(item => item.data.price);
      const Name = cartList.map(item => item.data.name);

      setCollection(categories);
      setType(types);
      const recommendedProductsPromises = categories.map((item, index) =>
        getRecommendProduct(item, types[index], prices[index], Name)
      );
      const recommendedProducts = await Promise.all(recommendedProductsPromises);

      const allRecommendedProducts = recommendedProducts.flat();
      const uniqueProducts = [];
      const productIds = new Set();

      allRecommendedProducts.forEach(product => {
        if (!productIds.has(product.id)) {
          uniqueProducts.push(product);
          productIds.add(product.id);
        }
      });

      setRecomendproduct(uniqueProducts);
    } catch (error) {
      console.error("Error fetching recommended products: ", error);
    }
  };

  const getRecommendProduct = async (item, types, prices, Names) => {

    const collectname = item.toLowerCase();
    try {
      const productsCollection = collection(db, collectname);
      const productsSnapshot = await getDocs(productsCollection);
      const productsData = productsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      let filteredProducts = [];
      if (types === 't-shirt') {
        filteredProducts = productsData.filter(product => (product.type === 'trousers' || product.type === 't-shirt' || product.type === 'skirt') && product.price < prices + 100);
      } else if (types === 'shirt') {
        filteredProducts = productsData.filter(product => (product.type === 'trousers' || product.type === 'shirt') && product.price < prices + 100);
      } else if (types === 'trousers') {
        filteredProducts = productsData.filter(product => (product.type === 't-shirt' || product.type === 'trousers') && product.price < prices + 100);
      } else if (types === 'skirt') {
        filteredProducts = productsData.filter(product => (product.type === 't-shirt' || product.type === 'skirt') && product.price < prices + 100);
      } else {
        filteredProducts = productsData.filter(product => product.type === types && product.price < prices + 100);
      }
      const filteredProducts2 = filteredProducts.filter(product => !Names.includes(product.name));

      const uniqueProducts = [];
      const productIds = new Set();

      filteredProducts2.forEach(product => {
        if (!productIds.has(product.id)) {
          uniqueProducts.push(product);
          productIds.add(product.id);
        }
      });

      return uniqueProducts;
    } catch (error) {
      console.error("Error fetching products: ", error);
      throw error;
    }
  };

  const getCartItems = async () => {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    setCartList(userSnap.get('cart'));
  };

  useEffect(() => {
    const getUserId = async () => {
      const id = await AsyncStorage.getItem('USERID');
      setUserId(id);
    };
    getUserId();
  }, []);

  const addItem = async item => {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    const user = userSnap.data();
    let tempCart = [...user.cart];
    const existingItemIndex = tempCart.findIndex(cartItem => cartItem.id === item.id);

    if (existingItemIndex !== -1) {
      const existingItem = tempCart[existingItemIndex];
      existingItem.qty += 1;
      tempCart[existingItemIndex] = existingItem;

    } else {
      tempCart.push({ ...item, qty: 1 });
    }

    await updateDoc(userRef, { cart: tempCart });
    getCartItems();
  };


  const handleCheckout = async () => {
    try {
      cartList.forEach(async (item) => {
        const purchaseData = {
          userId: userId,
          productId: item.id,
          quantity: item.qty,
          totalPrice: (item.qty || 0) * (item.data.price || 0),
          timestamp: new Date(),
          imageUrl: item.data.imageUrl,
          name: item.data.name,
          description: item.data.description

        };
        const purchasedProductRef = doc(db, 'purchasedProducts', `${userId}_${item.id}`);
        await setDoc(purchasedProductRef, purchaseData);
      });

      navigation.navigate('checkout');
    } catch (error) {
      console.error('Error saving purchased products to Firestore:', error);
    }
  };



  const removeItem = async item => {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    const { cart = [] } = userSnap.data() ?? {};

    let existingItem = cart.find(itm => itm.id === item.id);

    if (existingItem) {
      if (existingItem.qty > 1) {
        existingItem.qty -= 1;

      } else {
        cart.splice(cart.indexOf(existingItem), 1);
      }
    } else {
      console.log('Item not found in cart.');
    }

    await updateDoc(userRef, { cart });
    getCartItems();
  };



  const deleteItem = async (index) => {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    let tempCart = userSnap.data().cart;
    tempCart.splice(index, 1);
    await updateDoc(userRef, { cart: tempCart });
    getCartItems();
  };

  const deleteAllItems = async () => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { cart: [] });
      getCartItems();
    } catch (error) {
      console.error('Error deleting all items:', error);
    }
  };
  const [items, setitems] = useState(0);


  const getTotalOfers = () => {
    let total = 0;
    cartList.map(item => {
      let existingItem = cartList.find(itm => itm.id === item.id)
      total = total + (item.data.offer / 100 * item.data.price * existingItem.qty);
    });
    return total.toFixed(2);
  };
  const getTotal = () => {
    let total = 0;
    cartList.map(item => {
      let existingItem = cartList.find(itm => itm.id === item.id)
      total = total + existingItem.qty * item.data.price;
    });
    return total;
  };
  const getTotalItems = () => {
    let total = 0;
    cartList.map(item => {
      let existingItem = cartList.find(itm => itm.id === item.id)
      total = total + existingItem.qty;
    });
    return total;
  };
  const [IconName, setIconName] = useState(false);
  const [IconName2, setIconName2] = useState(false);
  const formatDate = (timestamp) => {
    if (timestamp && timestamp.seconds && timestamp.nanoseconds) {

      const newDate = new Date(
        timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
      );
      // Check if the parsedDate is a valid date
      if (!isNaN(newDate.getTime())) {
        return newDate.toLocaleDateString();
      }
      const year = newDate.getFullYear();
      const month = String(newDate.getMonth() + 1).padStart(2, '0'); // Adding 1 to month because months are zero-indexed
      const day = String(newDate.getDate()).padStart(2, '0');

      const formattedDate = `${year}-${month}-${day}`;
      return formattedDate;
    };
  };

  const getpoint = () => {
    let offer = getTotal() - getTotalOfers() - points;
    if (offer < 0) {
      offer = 0
    }
    return offer;
  }
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

  const renderProduct = ({ item }) => (
    <TouchableOpacity onPress={() => handleProductPress(item, item.categoryName)}>
      <View style={styles.cardView2}>
        <FlatList
          vertical={true}
          data={item.images}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item: image, index }) => (
            <Image key={index} source={{ uri: image }} style={styles.image} />
          )}
          keyExtractor={(image, index) => index.toString()}
          onScroll={(event) => handleScroll(event, item.id)}
        />
        <View style={{ height: 110 }}>
          <Text style={styles.Name} numberOfLines={2} ellipsizeMode="tail">
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
                  height: 20
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
                  height: 40
                }}
              >
                🏷️ {item.offer}% Discount{" "}
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                  {Math.floor(
                    item.price - item.price / item.offer
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
        <Text style={[styles.Text, { textAlign: 'center' }]}> My basket </Text>
      </View>
      <Search />
      <ScrollView style={[styles.container, { marginTop: 10 }]} nestedScrollEnabled={true}>
        <TouchableOpacity
          style={[
            styles.addToCartBtn,
            {
              width: 100,
              marginLeft: 5
            },
          ]}
          onPress={() => {
            deleteAllItems();
          }}>
          <Text
            style={{
              color: COLORS.grey,
              fontSize: 16,
              fontWeight: '700',
            }}>
            Clear all
          </Text>
        </TouchableOpacity>
        <FlatList
          data={cartList}
          renderItem={({ item, index }) => {
            return (
              <View style={styles.container}>
                <View style={styles.cardView}>
                  <Pressable onPress={() => deleteItem(index)} style={[styles.iconBehave, { marginLeft: 5 }]}>
                    <Icon name='trash-outline' size={25} color={COLORS.dark} style={styles.iconBehave} />
                  </Pressable>
                  <FlatList
                    horizontal
                    data={item.data.images}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item: image, index }) => (
                      <Image key={index} source={{ uri: image }} style={styles.itemImage} />
                    )}
                    keyExtractor={(image, index) => index.toString()}
                    onScroll={(event) => handleScroll(event, item.data.id)}
                  />
                  <View style={styles.nameView}>
                    <Text style={styles.nameText}>{item.data.name}</Text>

                    <Text style={styles.descText}>
                      {item.color ? `${item.color}/${item.size}` : item.size}
                    </Text>


                    <View style={styles.priceView}>
                      <Text style={styles.priceText}>
                        {item.data.price + 'EGP '}
                      </Text>
                      {item.data.offer !== 0 && (
                        <Text style={styles.discountText}>
                          {' - ' + (item.data.offer / 100 * item.data.price).toFixed(2) + 'EGP'}
                        </Text>
                      )}
                    </View>
                    <View style={styles.addRemoveView}>

                      <TouchableOpacity
                        style={[
                          styles.addToCartBtn,
                          {
                            width: 30,
                            justifyContent: 'center',
                            alignItems: 'center',

                          },
                        ]}
                        onPress={() => {
                          let existingItem = cartList.find(itm => itm.id === item.id)
                          if (existingItem.qty > 1) {
                            removeItem(item);

                          } else {
                            deleteItem(index);
                          }
                        }}>
                        <Text
                          style={{ color: COLORS.grey, fontSize: 30, fontWeight: '700' }}>
                          -
                        </Text>
                      </TouchableOpacity>
                      <Text style={{ fontSize: 22, fontWeight: '600', marginLeft: 15, color: COLORS.dark }}>
                        {(cartList.find(itm => itm.id === item.id)).qty}
                      </Text>
                      <TouchableOpacity
                        style={[
                          styles.addToCartBtn,
                          {
                            width: 35,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginLeft: 20,
                          },
                        ]}
                        onPress={() => {
                          addItem(item);
                        }}>
                        <Text
                          style={{
                            color: COLORS.grey,
                            fontSize: 30,
                            fontWeight: '700',
                          }}>
                          +
                        </Text>
                      </TouchableOpacity>

                    </View>

                  </View>

                </View>
                <Text style={styles.deliveryText}>Delivery:{formatDate(item.delivery)}</Text>
              </View>
            );
          }}
        />
        <View style={[styles.containerTotal, { marginBottom: 5 }]}>
          <View style={styles.total}>
            <Text style={{ color: COLORS.dark, fontWeight: '600', fontSize: 20 }}>
              {'Total: ' + (getTotal() - getTotalOfers()) + ' EGP'}
            </Text>
            <Pressable onPress={() => setIconName(!IconName)}>
              <Icon name={IconName ? 'chevron-up' : 'chevron-down'} size={25} color={COLORS.dark} style={{ marginTop: 5, right: 30 }} />
            </Pressable>
          </View>
          {IconName && (
            <>
              <View style={styles.row}>
                <Text style={{ fontSize: 18 }}>SubTotal</Text>
                <Text style={{ fontSize: 18 }}>{(getTotal()) + ' EGP'}</Text>
              </View>
              <View style={styles.row}>
                <Text style={{ fontSize: 18 }}>Delivery</Text>
                <Text style={{ fontSize: 18 }}>{(getTotal() * 0.05).toFixed(2) + ' EGP'}</Text>
              </View>
              <View style={[styles.row, styles.totalRow]}>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Total(after Delivery)</Text>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{(getTotal() + (getTotal() * 0.05)).toFixed(2) + ' EGP'}</Text>
              </View>
              <View style={[styles.row, styles.totalRow]}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'green' }}>20% Discound </Text>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'green' }}>{'-' + getTotalOfers() + ' EGP'}</Text>
              </View>
            </>
          )}
        </View>
        <View style={[styles.containerTotal, { marginBottom: 5 }]}>
          <View style={styles.total}>
            <Text style={{ color: COLORS.dark, fontWeight: '600', fontSize: 20 }}>
              {'Total : ' + getpoint().toFixed(2) + ' EGP'}
            </Text>
            <Pressable onPress={() => setIconName2(!IconName2)}>
              <Icon name={IconName2 ? 'chevron-up' : 'chevron-down'} size={25} color={COLORS.dark} style={{ marginTop: 5, right: 30 }} />
            </Pressable>
          </View>
          {IconName2 && (
            <>
              <View style={styles.row}>
                <Text style={{ fontSize: 18 }}>Points</Text>
                <Text style={{ fontSize: 18 }}>{points}</Text>
              </View>
              <View style={styles.row}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'green' }}>total (after points)</Text>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'green' }}>{getpoint().toFixed(2)}</Text>
              </View>
            </>
          )}
        </View>
        {Recomendproduct.length > 0 &&
          (<View>
            <View style={styles.headerTextView}>
              <Text style={[styles.headerText, { color: COLORS.dark }]}> Recommended for you   </Text>
            </View>
            <ScrollView horizontal={true}>

              <FlatList

                style={{ marginTop: 10, marginBottom: 10 }}
                horizontal={true}
                data={Recomendproduct}
                showsHorizontalScrollIndicator={false}
                renderItem={renderProduct}
              />
            </ScrollView>
          </View>)}

        <View style={styles.bottoms}></View>
      </ScrollView>
      {cartList.length > 0 && (
        <View style={styles.checkoutView}>
          <Text style={{ color: COLORS.dark, fontWeight: '600' }}>
            {'Items(' + getTotalItems() + ')\nTotal: $' + getTotal()}
          </Text>
          <TouchableOpacity
            style=
            {styles.checkButton}

            onPress={() => {
              navigation.navigate("checkout", { userId: userId });
              handleCheckout();
            }}>
            <Text style={{ color: '#fff' }}>Checkout</Text>
          </TouchableOpacity>
        </View>
      )}

      <BottomNavigator item="cart" navigation={navigation} userId={userId} />
    </View>
  );
};

export default CartScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: COLORS.white
  },
  containerTotal: {
    padding: 10,
    borderWidth: 0.1,
    borderColor: COLORS.grey,
    borderWidth: 0.1,
    borderRadius: 1,
    elevation: 13,
    flexDirection: 'column',
    backgroundColor: COLORS.white,
    marginBottom: 10,
    margin: 5
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  header: {
    flexDirection: "row",
    backgroundColor: COLORS.background,
    height: '10%',
    alignItems: 'center',
    textAlign: 'center'
  }, Text: {
    color: COLORS.darkblue,
    fontSize: 35,
    //fontFamily: 'SofiaRegular',
    fontWeight: "bold",
    alignItems: 'center',
    marginLeft: width / 2 - 80

  },
  headerTextView: {
    backgroundColor: 'White',
    marginTop: 10
  }, headerText: {
    fontSize: 20,
    fontWeight: "bold",
    alignItems: 'center',
    margin: 10
  },
  deliveryText: {
    marginLeft: 60,
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.grey
  },
  iconBehave: {
    marginTop: 50,
    marginLeft: 10,
    marginRight: 10
  },
  cardView: {
    flexDirection: 'row',
    marginBottom: 5,
    marginTop: 20,
    borderRadius: 15,
    width: width - 20,
    height: 210,
    elevation: 13,
    backgroundColor: COLORS.white,
    marginLeft: 20,
  },
  cardView2: {
    marginBottom: 20,
    marginTop: 5,
    marginRight: 5,
    borderRadius: 15,
    width: cardwidth,
    height: cardheight - 30,
    elevation: 13,
    backgroundColor: 'white',
  },
  itemView: {
    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#fff',
    elevation: 4,
    marginTop: 10,
    borderRadius: 10,
    height: 100,
    marginBottom: 10,
    alignItems: 'center',
    marginLeft: 70,
  },
  itemImage: {
    width: cardwidth - 90,
    height: 210,
    marginLeft: 5,
    marginRight: 5
  },
  nameView: {
    width: '50%',
    margin: 10,
    height: 90

  },
  priceView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameText: {
    fontSize: 18,
    color: COLORS.dark,
    fontWeight: '500',
    marginBottom: 10
  },
  descText: {
    fontSize: 18,
    color: COLORS.dark,
    fontWeight: '600',
    marginBottom: 10
  },
  priceText: {
    fontSize: 16,
    color: COLORS.dark,
    fontWeight: '700',
    marginBottom: 5
  },
  discountText: {
    fontSize: 16,
    color: "green",
    fontWeight: '700',
    textDecorationLine: 'line-through',
    marginLeft: 5,
    marginBottom: 5
  },
  addRemoveView: {
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'center'
  },
  addToCartBtn: {
    padding: 10,

  },
  checkoutView: {
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
  checkButton: {
    width: cardwidth,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.dark,

  }, bottoms: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    height: 150,
    bottom: 0
  },
  total: {
    width: '90%',
    height: 60,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',

  },
  image: {
    position: "relative",
    height: cardheight - 130,
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
});