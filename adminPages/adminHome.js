import React, { useState, useEffect, useRef } from 'react';
import {
    View, Text, TextInput, Image, TouchableOpacity, StyleSheet, FlatList, Pressable,
    ScrollView, Dimensions, TouchableWithoutFeedback
} from 'react-native';
import { collection, doc, getDoc, getDocs,updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
// import filterData from '../data';
import Food, { filterData, productt, option, size } from "../data";

import COLORS from '../Consts/Color';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNavigator from '../components/adminbar';
import { useIsFocused } from '@react-navigation/native';
import { LineChart , BarChart, PieChart} from 'react-native-chart-kit';
// import Carousel from 'react-native-snap-carousel';

const { width } = Dimensions.get('screen');
const { height: screenHeight } = Dimensions.get('window');
const cardheight = screenHeight / 2 - 30;
const cardwidth = width / 2;

const HomeScreen = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [indexCheck, setIndexCheck] = useState("0")
    const [products, setProducts] = useState([]);
    const [userId, setUserId] = useState('');
    const [activeIndexes, setActiveIndexes] = useState({});
    const imageWidth = cardwidth;
    const isFocused = useIsFocused();
    const [user, setUser] = useState("");
     const [chartData, setChartData] = useState({
    labels: [ "WOMAN", "MEN", "KIDS", "BABY"],
    datasets: [{
      data: [0, 0, 0, 0] 
    }]
  });
  const [piedata,setpiedata] = useState({
 
    data: [  {
      name: "Orders",
      population: 0,
      color: "#F00",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    },
    {
     name: "Cancels",
     population: 0,
     color: "rgb(0, 0, 255)",
     legendFontColor: "#7F7F7F",
     legendFontSize: 15
   },]
 
});

useEffect(() => {
 const getUserId = async () => {
   const id = await AsyncStorage.getItem("USERID");
   setUserId(id);
   getChartItems(id);
 };
 getUserId();
}, [isFocused]);

const getChartItems = async (id) => {
 try {
   const userRef = doc(db, "users", id);
   const userSnap = await getDoc(userRef);
   const userData = userSnap.data();

   if (userData) {
     const newData = {
       labels: ["WOMAN", "MEN", "KIDS", "BABY"],
       datasets: [{
         data: [userData?.woman || 0, userData?.men || 0, userData?.kids || 0, userData?.baby || 0]
       }]
     };
     setChartData(newData);
   } else {
     console.log("User data not found");
   }
 } catch (error) {
   console.error("Error retrieving user data:", error);
 }
};

const cancelfun = async () => {
  
 try {
   const usersRef = collection(db, "users");
   const querySnapshot = await getDocs(usersRef);
  //  let lost = 0;
  //  let lwalet=0;
   let cancelOrderCount = 0;
   let userOrderCount = 0;

   for (const userDoc of querySnapshot.docs) {
     const userData = userDoc.data();
     const cancelOrder = userData.cancelOrder?? {};
     const userOrders = userData.HistoryOrder || [];
     console.log(userOrders);

     console.log(cancelOrder);
     if (cancelOrder.length > 0) {
      //  cancelOrder.map((item) => {
      //    lost = lost + item.totalPrice * 0.2 ;
      //  })
      cancelOrderCount += cancelOrder.length;

      //  console.log(lost);
      //  console.log(lwalet);
       console.log(cancelOrderCount);
       console.log(userOrderCount);
      
     }

     if (userOrders.length > 0) {
      userOrderCount += userOrders.length;

      console.log(cancelOrderCount);
      console.log(userOrderCount);
    }

     if (userData.isAdmin) {
           const userRef = doc(db, "users", userDoc.id);
           const userSnap = await getDoc(userRef);
           const userData = userSnap.data();
           //await updateDoc(userRef, { lost: lost });
           //lwalet = userData.walet;
           //console.log(lwalet);
         }     
   }
   //console.log(lwalet);
   const newData = {
       data: [{  
         name: "Orders",
         population: userOrderCount,
         color: "rgb(0, 0, 255)",
         legendFontColor: "#7F7F7F",
         legendFontSize: 15
       },{
         name: "Cancels",
         population: cancelOrderCount,
         color: "#F00",
         legendFontColor: "#7F7F7F",
         legendFontSize: 15
       },]
   };

   setpiedata(  newData);

 } catch (error) {
   console.error("Error updating : ", error);
 }

}
useEffect(() => {
 cancelfun();
});


    useEffect(() => {
        getUser();
      }, [isFocused]);

    useEffect(() => {
        const getProducts = async () => {
            const collections = ['woman', 'men', 'kids', 'baby'];
            const allProducts = [];

            for (const collectionName of collections) {
                const productsCollection = collection(db, collectionName);
                const productsSnapshot = await getDocs(productsCollection);
                const productsData = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                allProducts.push(...productsData);
            }
            const filteredProducts = allProducts.filter(product => product.offer > 0);
            console.log(filteredProducts);
            setProducts(filteredProducts);
        };
        getProducts();

    }, []);

    useEffect(() => {
        const getUserId = async () => {
            const id = await AsyncStorage.getItem('USERID');
            setUserId(id);
            console.log(id);
        };
        getUserId();

    }, []);

    const getUser = async () => {
        const docRef = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
    
        if (docSnap.exists()) {
    
          const data = docSnap.data();
          if (data.isAdmin === true) {
            navigation.navigate('adminHome');
          } else {
            navigation.navigate('Home');
          }
        }
      };
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

    const handleScroll = (event, productId) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const currentIndex = Math.floor(contentOffsetX / imageWidth);
        setActiveIndexes((prevState) => ({
            ...prevState,
            [productId]: currentIndex,
        }));
    };

    const renderProduct = ({ item }) => (
        <TouchableOpacity onPress={() => handleProductPress(item, item.categoryName)}>
            <View style={styles.cardView}>
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

    const data = [
        { imageUrl: 'https://cdn.youcan.shop/stores/f725985ece28459e35d7975512972572/others/JJucRU3iTsV1W9zkOqLBOOZONn5iKIIZXEvuuvIf.png' },
        { imageUrl: 'https://ashtonscorner.com/cdn/shop/files/ACB_-_Kids_20_Fashion_Sale.jpg?v=1705717296&width=3000' },
        { imageUrl: 'https://img.freepik.com/free-psd/sales-banner-template-with-image_23-2148149654.jpg?size=626&ext=jpg&ga=GA1.1.1224184972.1714003200&semt=ais' },
        { imageUrl: 'https://img.freepik.com/free-photo/big-sale-discounts-products_23-2150336701.jpg' }
    ];
    const carouselRef = useRef(null);

    const renderItem = ({ item }) => (
        <View style={{ alignItems: 'center', width: '110%' }}>
            <Image source={{ uri: item.imageUrl }} style={{ width: '100%', height: 200 }} />
        </View>
    );
return (
    <View style={styles.container}>
       <View >
                <Text style={styles.Text}> AToZ </Text>
            </View> 
             <ScrollView>

                <View style={styles.chartContainer}>
      
      <Text style={styles.stylishText}>SALES</Text>
      <LineChart
              data={chartData}
        width={Dimensions.get("window").width * 0.9}
        height={220}      
        yAxisInterval={2}
        chartConfig={{
          backgroundColor: "#FFFFFF",
          backgroundGradientFrom: "#FFFFFF",
          backgroundGradientTo: "#FFFFFF",
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`, 
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16
          },
          propsForDots: {
            r: "0",
            strokeWidth: "2",
            stroke: "#0000FF"
          }, 
                 propsForBackgroundLines: {
            stroke: 'black' , 
            strokeWidth: "1",
             strokeDasharray: ""
          },
          fillShadowGradient:'#00BFFF' ,
          fillShadowGradientOpacity: 1,
        }}
        
        withInnerLines={false}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16
        }}
      />

      </View>
      <View style={styles.chartpieContainer}>
      <Text style={styles.stylishText}> Orders and Cancels </Text>
      <PieChart
  data={piedata.data}
  width={Dimensions.get("window").width * 0.9}
  height={Dimensions.get("window").width * 0.6}
  chartConfig={{
    backgroundColor: "#e26a00",
    backgroundGradientFrom: "#fb8c00",
    backgroundGradientTo: "#ffa726",
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
       style:{
      height:100,
       }
  }}
  accessor={"population"}
  backgroundColor={"transparent"}
  paddingLeft={"15"}
  center={[2,-15]}
  absolute
/>
      </View>
      </ScrollView>
         <BottomNavigator item="adminHome" navigation={navigation} userId={userId} />
   
    </View>
    
  );
}

const styles = StyleSheet.create({
    chartContainer: {
        // marginBottom: 20,
        // borderColor: '#000000',
        width: Dimensions.get("window").width,
        paddingVertical: 20,
        paddingHorizontal: 20, 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        marginBottom: 20,
      },
      chartpieContainer: {
        // marginBottom: 20,
        // borderColor: '#000000',
        width: Dimensions.get("window").width,
        paddingVertical: 5,
        paddingHorizontal: 5, 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        marginBottom: 20,
      },
    cardView: {
        marginBottom: 20,
        marginTop: 5,
        marginRight: 5,
        borderRadius: 15,
        width: cardwidth,
        height: cardheight + 30,
        elevation: 13,
        backgroundColor: 'white',
    },
    discoverButton: {
        marginBottom: 20,
        marginTop: 10,
        marginRight: 5,
        borderRadius: 15,
        width: cardwidth,
        height: cardheight + 30,
        elevation: 13,
        backgroundColor: '#ECF0F1',
    },
    discoverText: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.dark,
        marginTop: (cardheight + 30) / 2
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: "row",
        backgroundColor: COLORS.background,
        height: '10%',
    },
    bottoms: {
        flexDirection: "row",
        backgroundColor: COLORS.background,
        height: 50,
        bottom: 20
    },
    headerText: {
        fontSize: 20,
        fontWeight: "bold",
        alignItems: 'center',
        margin: 10
    },
    image: {
        position: "relative",
        height: cardheight  ,
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
    Text: {
        color: COLORS.darkblue,
        fontSize: 35,
        fontFamily: 'SofiaRegular',
        fontWeight: "bold",
        alignItems: 'center',
    },
    stylishText: {
        fontStyle: 'italic',
        fontWeight: 'bold',
        fontFamily: 'Georgia, serif',
        fontSize: 18,
        color: '#000', 
      },
    headerTextView: {
        backgroundColor: 'White',
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
});
export default HomeScreen;