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
const cardwidth = width / 2;
const { height: screenHeight } = Dimensions.get('window');
const cardheight =screenHeight/2-50;
const favorite = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [favList, setFavList] = useState([]);

  const route = useRoute();

  const [userId, setUserId] = useState(route.params.userId);

  useEffect(() => {
    getFavItems();
    //console.log(userId);
  }, [isFocused]);


  const getFavItems = async () => {
    //const userId = await AsyncStorage.getItem('USERID');
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    setFavList(userSnap.get('fav'));
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

    let tempfav = [...user.fav];

    const existingItemIndex = tempfav.findIndex(favItem => favItem.id === item.id);

    if (existingItemIndex !== -1) {
      const existingItem = tempfav[existingItemIndex];
      existingItem.qty += 1;
      tempfav[existingItemIndex] = existingItem;
      console.log(`Quantity for item with ID ${item.id} is now ${existingItem.qty}`);
    } else {
      tempfav.push({ ...item, qty: 1 });
    }

    await updateDoc(userRef, { fav: tempfav });
    getFavItems();
  };

  const removeItem = async item => {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    const { fav = [] } = userSnap.data() ?? {};

    let existingItem = fav.find(itm => itm.id === item.id);

    if (existingItem) {
      if (existingItem.qty > 1) {
        existingItem.qty -= 1;
        console.log(`Quantity for item with ID ${item.id} is now ${existingItem.qty}`);

      } else {
        fav.splice(fav.indexOf(existingItem), 1);
      }
    } else {
      console.log('Item not found in fav.');
    }

    await updateDoc(userRef, { fav });
    getFavItems();
  };



  const deleteItem = async (index) => {
    //const userId = await AsyncStorage.getItem('USERID');
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    let tempfav = userSnap.data().fav;
    tempfav.splice(index, 1);
    await updateDoc(userRef, { fav: tempfav });
    getFavItems();
  };
  const handleProductPress = (product,qty) => {
    console.log(qty);
    if(qty===1){
      navigation.navigate('PizzaDetails', { product });
    }else if(qty===2)
   { navigation.navigate('BurgerDetails', { product });
  }else if(qty===3){
    navigation.navigate('CoffeeDetails', { product });
  }else if(qty===4){
    navigation.navigate('OfferDetails', { product });
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
              <TouchableOpacity onPress={() => handleProductPress(item,item.qty)}>
              <View style={styles.container}>


                <View style={styles.cardView}>
                  <Image source={{ uri: item.data.imageUrl }} style={styles.image} />

                  <Text style={styles.Name}>{item.data.name}</Text>
                  <View style={{ flexDirection: "row", marginTop: 10, marginHorizontal: 10, justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.data.price}LE</Text>

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
                      }} style={[
                        styles.addToFavBtn,
                        {
                          width: 30,
                          justifyContent: 'center',
                          alignItems: 'center',
                          //marginRight: 60,
                          marginLeft: 20
                        },
                      ]}>
                      <Icon name="heart" size={30} color={item.qty >= 1 ? 'red' : 'gray'} />
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
  }, Text: {
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
    height: cardheight,
    elevation: 13,
    backgroundColor: 'white',
  },
  image: {
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    height: cardheight-80,
    width: cardwidth
  },

  Name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: "#131A2C",
    marginTop: 5,
    marginLeft: 10,
    marginBottom: 10,
    left: 200
  },
  itemView: {

    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#fff',
    elevation: 4,
    marginTop: 10,
    borderRadius: 10,
    height: 100,
    marginBottom: 10,
    alignItems: 'center',
  },
  itemImage: {
    width: 90,
    height: 90,
    borderRadius: 10,
    margin: 5,
  },
  nameView: {
    width: '30%',
    margin: 10,
  },
  priceView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameText: {
    fontSize: 18,
    fontWeight: '700',
  },
  descText: {
    fontSize: 14,
    fontWeight: '600',
  },
  priceText: {
    fontSize: 18,
    color: 'green',
    fontWeight: '700',
  },
  discountText: {
    fontSize: 17,
    fontWeight: '600',
    textDecorationLine: 'line-through',
    marginLeft: 5,
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
  },
  checkoutView: {
    width: '100%',
    height: 60,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  }, bottoms: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    height: 50,
    bottom: 20
  },
});
export default favorite;