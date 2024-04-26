// import React, { useEffect, useState } from 'react';
// import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, FlatList, Pressable, ScrollView, Dimensions } from 'react-native';
// import Countdown from 'react-native-countdown-component';
// import { collection, getDocs } from 'firebase/firestore';
// import { db } from '../firebase';
// import FoodCard from '../components/Foodcard';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import Food, { Offer, filterData } from '../data';
// import COLORS from '../Consts/Color';
// import Search from '../components/search';

// const {width} = Dimensions.get('screen');
// const cardwidth = width-20;

// Generate required css


// Inject stylesheet


// const adminHomeScreen = ({ navigation }) => {
//     const [searchQuery, setSearchQuery] = useState('');
//     const [indexCheck, setIndexCheck] = useState("0");
//     const [products, setProducts] = useState([]);
//     const [products2, setProducts2] = useState([]);
//     useEffect(() => {
//         const getProducts = async () => {
//             const productsCollection = collection(db, 'offer');
//             const productsSnapshot = await getDocs(productsCollection);
//             const productsData = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//             setProducts(productsData);
//         };
//         getProducts();
//     }, []);
//     useEffect(() => {
//         const getProducts = async () => {
//             const productsCollection = collection(db, 'burger');
//             const productsSnapshot = await getDocs(productsCollection);
//             const productsData = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//             setProducts2(productsData);
//         };
//         getProducts();
//     }, []);
//     const handleProductPress = (product) => {
//         navigation.navigate('OfferDetails', { product });
//     };

//     const renderProduct = ({ item }) => (
//         <TouchableOpacity onPress={() => handleProductPress(item)}>
//             <View style={styles.cardView}>
//                 <Image source={{ uri: item.imageUrl}} style={styles.image} />

//                 <Text style={styles.Name}>{item.name}</Text>
//                 <View style={{ flexDirection: "row", marginTop: 10, marginHorizontal: 20, justifyContent: 'space-between' }}>
//                     <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.price}LE</Text>
                   
//                 </View>
//             </View>
//         </TouchableOpacity>
//     );

//     return (
//         <View style={styles.container}>

//             <View style={styles.header}>
//                 <Text style={styles.Text}> Fast Food </Text>
//             </View>

//             <ScrollView>
                
//             <View  style = {{marginBottom:10,paddingTop:10}}>
//        <Search/>
// </View>
//                 <View>
//                     <FlatList
//                         horizontal={true}
//                         showsHorizontalScrollIndicator={false}
//                         data={filterData}
//                         keyExtractor={(item) => item.id}
//                         extraData={indexCheck}
//                         renderItem={({ item, index }) => (
//                             <Pressable
//                                 onPress={() => navigation.navigate('admin'+item.name)}
//                             >
//                                 <View style={indexCheck === item.id ? { ...styles.smallCardSelected } : { ...styles.smallCard }}>
//                                     <Image
//                                         style={{ height: 60, width: 60, borderRadius: 30 }}
//                                         source={item.image}
//                                     />

//                                     <View>
//                                         <Text style={indexCheck === item.id ? { ...styles.smallCardTextSected } :
//                                             { ...styles.smallCardText }}>{item.name}</Text>
//                                     </View>
//                                 </View>
//                             </Pressable>
//                         )}
//                     />
//                 </View>
//                 <View style={styles.headerTextView}>
//                     <Text style={styles.headerText}>Free Delivery now</Text>
//                 </View>

//                 <View>

//                     <View style={{ flexDirection: 'row', alignItems: "center" }}>
//                         <Text style={{ marginLeft: 15, fontSize: 16, marginTop: -10, marginRight: 5 }} >Options changing in</Text>
//                         <Countdown
//                             until={3600}
//                             size={14}
//                             digitStyle={{ backgroundColor: 'lightgreen' }}
//                             digitTxtStyle={{ color: '#131A2C' }}
//                             timeToShow={['M', 'S']}
//                             timeLabels={{ m: 'Min', s: 'Sec' }}
//                         />
//                     </View>

//                     <FlatList
//                         style={{ marginTop: 10, marginBottom: 10 }}
//                         horizontal={true}
//                         data={products}
//                         showsHorizontalScrollIndicator={false}
//                         renderItem={renderProduct}
//                         keyExtractor={(item) => item.id}
//                     />
//                 </View>


//                 <View style={styles.headerTextView}>
//                     <Text style={styles.headerText}>Promotions available</Text>
//                 </View>

//                 <View>
//                 <FlatList
//                         style={{ marginTop: 10, marginBottom: 10 }}
//                         horizontal={true}
//                         data={products2}
//                         showsHorizontalScrollIndicator={false}
//                         renderItem={renderProduct}
//                         keyExtractor={(item) => item.id}
//                     />
//                 </View>


//                 {/* <View style ={styles.headerTextView}>
//             <Text style ={styles.headerText}>Restaurants in your Area</Text>
//         </View>
//         <View>
//         <FlatList 
//                style ={{marginTop:10, marginBottom:10}} 
//                horizontal ={true}
//                data = {Food}
//                keyExtractor = {(item,index)=>index.toString()}   
//                showsHorizontalScrollIndicator = {false}
//                renderItem = {({item})=>(
//                    <View style ={{marginRight:5}}>
//                        <FoodCard 
//                             screenWidth={170}
//                             images={item.images}
//                             restaurantName={item.restaurantName}
//                             price={item.price} 
//                        />
//                    </View>
//                )}  
//             />
//         </View> */}
//                 {/* <View style ={{paddingTop:10}}>
//         { 
//             Food.map(item =>(
//                 <View key ={item.id} style = {{paddingBottom:20}}>
//                 <FoodCard 
//                              screenWidth={170}
//                              images={item.images}
//                              restaurantName={item.restaurantName}
//                              price={item.price} 
//                        />
//                 </View>
//             )
//             )
//         }        
//     </View>     */}
//                 {/* <View>
//         <FlatList
//             style={{ marginTop: 10, marginBottom: 10 }}
//             vertical={true}
//             numColumns={2}
//             data={Food}
//             keyExtractor={(item, index) => index.toString()}
//             showsVerticalScrollIndicator={false}
//             renderItem={({ item }) => (
//                 <View style={{ marginRight: 3 }}>
//                     <FoodCard
//                         screenWidth={170}
//                         images={item.images}
//                         restaurantName={item.restaurantName}
//                         price={item.price} />
//                 </View>

//             )} 
//             />
//     </View> */}
//                 <View style={styles.bottoms}></View>
//             </ScrollView>

//             <View style={styles.NavContainer} >
//                 <View style={styles.Navbar} >
//                     {/* <Pressable onPress={() => navigation.navigate("Favorite")} style={styles.iconBehave} >
//                         <Icon name="heart" size={25} color="gray" />
//                     </Pressable> */}
//                     <Pressable onPress={() => navigation.navigate("adminprofile")} style={styles.iconBehave}>
//                         <Icon name="user" size={25} color="gray" />
//                     </Pressable>
//                     <Pressable onPress={() => navigation.navigate("plusbutton")} style={styles.iconBehave} >
//                         <Icon name="plus" size={25} color={COLORS.grey} />
//                     </Pressable>
//                     <Pressable onPress={() => navigation.navigate("adminHome")} style={styles.iconBehave} >
//                         <Icon name="home" size={25} color="#FFDE9B" />
//                     </Pressable>
//                     <Pressable onPress={() => navigation.navigate("adminReports")} style={styles.iconBehave} >
//                         <Icon name="home" size={25} color="#FFDE9B" />
//                     </Pressable>
                   
//                 </View>
//             </View>



//         </View>
//     );


//  }

// const styles = StyleSheet.create({
//     cardView: {
//         marginHorizontal: 10,
//         marginBottom: 20,
//         marginTop: 20,
//         borderRadius: 15,
//         width: cardwidth,
//         height: 220,
//         elevation: 13,
//         backgroundColor: 'white',
//     },
//     image: {
//         borderTopLeftRadius: 5,
//         borderTopRightRadius: 5,
//         height: 150,
//         width: cardwidth,
//     },

//     Name: {
//         fontSize: 20,
//         fontWeight: 'bold',
//         color: "#131A2C",
//         marginTop: 5,
//         marginLeft: 10,
//         marginBottom: 10,
//         left: 200
//     },
//     container: {
//         flex: 1,
//         backgroundColor: COLORS.background,
//         // alignItems: 'center',
//         // justifyContent: 'center',
//     },
//     heading: {
//         color: COLORS.background,
//         fontSize: 40,
//         alignItems: 'center',
//         marginBottom: 5,
//     },
//     header: {
//         flexDirection: "row",
//         backgroundColor: COLORS.background,
//         height: '10%',
//     },
//     bottoms: {
//         flexDirection: "row",
//         backgroundColor: COLORS.background,
//         height: 50,
//         bottom: 20
//     },
//     headerText: {
//         color: COLORS.darkblue,
//         fontSize: 20,
//         fontWeight: "bold",
//         alignItems: 'center',
//         margin: 10

//     },
//     Text: {
//         color: COLORS.darkblue,
//         fontSize: 40,
//         fontWeight: "bold",
//         alignItems: 'center',

//     },
//     address: {
//         fontSize: 12,
//         paddingTop: 5,
//         color: COLORS.darkblue,
//         paddingVertical: 10
//     },
//     NavContainer: {
//         position: 'absolute',
//         alignItems: 'center',
//         bottom: 5,
//         borderBottomLeftRadius: 15,
//         borderBottomRightRadius: 15,
//     },
//     Navbar: {
//         flexDirection: 'row',
//         backgroundColor: COLORS.darkblue,
//         width: 370,
//         justifyContent: 'space-evenly',
//         borderRadius: 30,
//         height: 40

//     },
//     iconBehave: {
//         padding: 35,
//         bottom: 30
//     },
//     searchContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         borderColor: COLORS.grey,
//         borderWidth: 1,
//         borderRadius: 10,
//         margin: 10,
//         padding: 5,
//     },
//     searchIcon: {
//         marginRight: 10,
//     },
//     searchInput: {
//         flex: 1,
//         fontSize: 16,
//         fontWeight: 'bold',
//         color: '#333333',
//     },
//     headerTextView: {
//         backgroundColor: 'White',
//         paddingVertical: 3,
//     },
//     smallCard: {
//         borderRadius: 30,
//         backgroundColor: 'white',
//         justifyContent: "center",
//         alignItems: 'center',
//         padding: 5,
//         width: 80,
//         margin: 10,
//         height: 100
//     },

//     smallCardSelected: {
//         borderRadius: 30,
//         backgroundColor: '#FFDE9B',
//         justifyContent: "center",
//         alignItems: 'center',
//         padding: 5,
//         width: 80,
//         margin: 10,
//         height: 100
//     },

//     smallCardTextSected: {
//         fontWeight: "bold",
//         color: '#131A2C'
//     },

//     smallCardText: {
//         fontWeight: "bold",
//         color: '#131A2C'
//     },

//     floatButton: {
//         position: 'absolute',
//         bottom: 10, right: 15,
//         backgroundColor: 'white',
//         elevation: 10,
//         width: 60, height: 60,
//         borderRadius: 30,
//         alignItems: 'center'
//     }


// });
import React from 'react';
import { View, Dimensions } from 'react-native';
import { PieChart, BarChart } from 'react-native-chart-kit';

// الحصول على عرض الشاشة
const screenWidth = Dimensions.get("window").width;

// تكوين الرسوم البيانية
const chartConfig = {
  backgroundGradientFrom: "#1E2923",
  backgroundGradientTo: "#08130D",
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2 // optional, default 3
};

// بيانات الرسم البياني BarChart
const barData = {
  labels: ["January", "February", "March", "April", "May", "June"],
  datasets: [
    {
      data: [20, 45, 28, 80, 99, 43]
    }
  ]
};
const data = [
    { x: "Cats", y: 35 },
    { x: "Dogs", y: 40 },
    { x: "Birds", y: 55 }
  ];
  
// بيانات الرسم البياني PieChart
const pieData = [
  { name: 'Seoul', population: 21500000, color: 'rgba(131, 167, 234, 1)', legendFontColor: '#7F7F7F', legendFontSize: 15 },
  { name: 'Toronto', population: 2800000, color: '#F00', legendFontColor: '#7F7F7F', legendFontSize: 15 },
  { name: 'Beijing', population: 527612, color: 'red', legendFontColor: '#7F7F7F', legendFontSize: 15 },
  { name: 'New York', population: 8538000, color: '#ffffff', legendFontColor: '#7F7F7F', legendFontSize: 15 },
  { name: 'Moscow', population: 11920000, color: 'rgb(0, 0, 255)', legendFontColor: '#7F7F7F', legendFontSize: 15 }
];

const adminHomeScreen = () => {
  return (
    <View>
      <BarChart
        data={barData}
        width={screenWidth}
        height={220}
        yAxisLabel="$"
        chartConfig={chartConfig}
      />
      <PieChart
        data={pieData}
        width={screenWidth}
        height={220}
        chartConfig={chartConfig}
        accessor={"population"}
        backgroundColor={"transparent"}
        paddingLeft={"15"}
        absolute // this will make the values to be in absolute values rather than percentage
      />
    </View>
  
  );
};

export default adminHomeScreen;



// export default adminHomeScreen;