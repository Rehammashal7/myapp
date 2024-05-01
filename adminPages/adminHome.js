// // import React, { useEffect, useState } from 'react';
// // import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, FlatList, Pressable, ScrollView, Dimensions } from 'react-native';
// // import Countdown from 'react-native-countdown-component';
// // import { collection, getDocs } from 'firebase/firestore';
// // import { db } from '../firebase';
// // import FoodCard from '../components/Foodcard';
// // import Icon from 'react-native-vector-icons/FontAwesome';
// // import Food, { Offer, filterData } from '../data';
// // import COLORS from '../Consts/Color';
// // import Search from '../components/search';

// // const {width} = Dimensions.get('screen');
// // const cardwidth = width-20;

// // // Generate required css


// // // Inject stylesheet


// // const adminHomeScreen = ({ navigation }) => {
// //     const [searchQuery, setSearchQuery] = useState('');
// //     const [indexCheck, setIndexCheck] = useState("0");
// //     const [products, setProducts] = useState([]);
// //     const [products2, setProducts2] = useState([]);
// //     useEffect(() => {
// //         const getProducts = async () => {
// //             const productsCollection = collection(db, 'offer');
// //             const productsSnapshot = await getDocs(productsCollection);
// //             const productsData = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
// //             setProducts(productsData);
// //         };
// //         getProducts();
// //     }, []);
// //     useEffect(() => {
// //         const getProducts = async () => {
// //             const productsCollection = collection(db, 'burger');
// //             const productsSnapshot = await getDocs(productsCollection);
// //             const productsData = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
// //             setProducts2(productsData);
// //         };
// //         getProducts();
// //     }, []);
// //     const handleProductPress = (product) => {
// //         navigation.navigate('OfferDetails', { product });
// //     };

// //     const renderProduct = ({ item }) => (
// //         <TouchableOpacity onPress={() => handleProductPress(item)}>
// //             <View style={styles.cardView}>
// //                 <Image source={{ uri: item.imageUrl}} style={styles.image} />

// //                 <Text style={styles.Name}>{item.name}</Text>
// //                 <View style={{ flexDirection: "row", marginTop: 10, marginHorizontal: 20, justifyContent: 'space-between' }}>
// //                     <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.price}LE</Text>
                   
// //                 </View>
// //             </View>
// //         </TouchableOpacity>
// //     );


// //     // const renderProduct = ({ item }) => (
// //     //     <TouchableOpacity onPress={() => navigation.navigate('adminWoman')}>
// //     //       <View style={styles.cardView}>
// //     //         <Image source={{ uri: item.imageUrl}} style={styles.image} />
// //     //         <Text style={styles.Name}>{item.name}</Text>
// //     //         <View style={{ flexDirection: "row", marginTop: 10, marginHorizontal: 20, justifyContent: 'space-between' }}>
// //     //           <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.price}LE</Text>
// //     //         </View>
// //     //       </View>
// //     //     </TouchableOpacity>
// //     //   );

      
// //     return (
// //         <View style={styles.container}>


// //             <ScrollView>

// // <View style={styles.headerName}>
// //         <Text style={styles.Text}> AToZ </Text>
// //       </View>
// //       <Search />

      
// //                {/* <View>
// //                     <FlatList
// //                         horizontal={true}
// //                         showsHorizontalScrollIndicator={false}
// //                         data={filterData}
// //                         keyExtractor={(item) => item.id}
// //                         extraData={indexCheck}
// //                         renderItem={({ item, index }) => (
// //                             <Pressable
// //                                 onPress={() => navigation.navigate('admin'+item.name)}
// //                             >
// //                                 <View style={indexCheck === item.id ? { ...styles.smallCardSelected } : { ...styles.smallCard }}>
// //                                     <Image
// //                                         style={{ height: 60, width: 60, borderRadius: 30 }}
// //                                         source={item.image}
// //                                     />

// //                                     <View>
// //                                         <Text style={indexCheck === item.id ? { ...styles.smallCardTextSected } :
// //                                             { ...styles.smallCardText }}>{item.name}</Text>
// //                                     </View>
// //                                 </View>
// //                             </Pressable>
// //                         )}
// //                     />
// //                 </View>  */}

// // <View>
// //   <FlatList
// //     horizontal={true}
// //     showsHorizontalScrollIndicator={false}
// //     data={filterData}
// //     keyExtractor={(item) => item.id}
// //     extraData={indexCheck}
// //     renderItem={({ item, index }) => (
// //       <Pressable
// //         onPress={() => navigation.navigate('admin' + item.name)} // تأكد من أن هنا تكون القيمة الصحيحة لـ item.name هي "Woman"
// //       >
// //         <View style={indexCheck === item.id ? { ...styles.smallCardSelected } : { ...styles.smallCard }}>
// //           <Image
// //             style={{ height: 60, width: 60, borderRadius: 30 }}
// //             source={item.image}
// //           />
// //           <Text style={indexCheck === item.id ? { ...styles.smallCardTextSected } : { ...styles.smallCardText }}>
// //             {item.name}
// //           </Text>
// //         </View>
// //       </Pressable>
// //     )}
// //   />
// // </View>


// //                 <View style={styles.headerTextView}>
// //                     <Text style={styles.headerText}>Free Delivery now</Text>
// //                 </View>

// //                 <View>

// //                     {/* <View style={{ flexDirection: 'row', alignItems: "center" }}>
// //                         <Text style={{ marginLeft: 15, fontSize: 16, marginTop: -10, marginRight: 5 }} >Options changing in</Text>
// //                         <Countdown
// //                             until={3600}
// //                             size={14}
// //                             digitStyle={{ backgroundColor: 'lightgreen' }}
// //                             digitTxtStyle={{ color: '#131A2C' }}
// //                             timeToShow={['M', 'S']}
// //                             timeLabels={{ m: 'Min', s: 'Sec' }}
// //                         />
// //                     </View> */}

// //                     <FlatList
// //                         style={{ marginTop: 10, marginBottom: 10 }}
// //                         horizontal={true}
// //                         data={products}
// //                         showsHorizontalScrollIndicator={false}
// //                         renderItem={renderProduct}
// //                         keyExtractor={(item) => item.id}
// //                     />
// //                 </View>


// //                 <View style={styles.headerTextView}>
// //                     <Text style={styles.headerText}>Promotions available</Text>
// //                 </View>

// //                 <View>
// //                 <FlatList
// //                         style={{ marginTop: 10, marginBottom: 10 }}
// //                         horizontal={true}
// //                         data={products2}
// //                         showsHorizontalScrollIndicator={false}
// //                         renderItem={renderProduct}
// //                         keyExtractor={(item) => item.id}
// //                     />
// //                 </View>


// //                 {/* <View style ={styles.headerTextView}>
// //             <Text style ={styles.headerText}>Restaurants in your Area</Text>
// //         </View>
// //         <View>
// //         <FlatList 
// //                style ={{marginTop:10, marginBottom:10}} 
// //                horizontal ={true}
// //                data = {Food}
// //                keyExtractor = {(item,index)=>index.toString()}   
// //                showsHorizontalScrollIndicator = {false}
// //                renderItem = {({item})=>(
// //                    <View style ={{marginRight:5}}>
// //                        <FoodCard 
// //                             screenWidth={170}
// //                             images={item.images}
// //                             restaurantName={item.restaurantName}
// //                             price={item.price} 
// //                        />
// //                    </View>
// //                )}  
// //             />
// //         </View> */}
// //                 {/* <View style ={{paddingTop:10}}>
// //         { 
// //             Food.map(item =>(
// //                 <View key ={item.id} style = {{paddingBottom:20}}>
// //                 <FoodCard 
// //                              screenWidth={170}
// //                              images={item.images}
// //                              restaurantName={item.restaurantName}
// //                              price={item.price} 
// //                        />
// //                 </View>
// //             )
// //             )
// //         }        
// //     </View>     */}
// //                 {/* <View>
// //         <FlatList
// //             style={{ marginTop: 10, marginBottom: 10 }}
// //             vertical={true}
// //             numColumns={2}
// //             data={Food}
// //             keyExtractor={(item, index) => index.toString()}
// //             showsVerticalScrollIndicator={false}
// //             renderItem={({ item }) => (
// //                 <View style={{ marginRight: 3 }}>
// //                     <FoodCard
// //                         screenWidth={170}
// //                         images={item.images}
// //                         restaurantName={item.restaurantName}
// //                         price={item.price} />
// //                 </View>

// //             )} 
// //             />
// //     </View> */}
// //                 <View style={styles.bottoms}></View>
// //             </ScrollView>

// //             <View style={styles.NavContainer} >
// //                 <View style={styles.Navbar} >
// //                     {/* <Pressable onPress={() => navigation.navigate("Favorite")} style={styles.iconBehave} >
// //                         <Icon name="heart" size={25} color="gray" />
// //                     </Pressable> */}
// //                     <Pressable onPress={() => navigation.navigate("adminprofile")} style={styles.iconBehave}>
// //                         <Icon name="user" size={25} color="gray" />
// //                     </Pressable>
// //                     <Pressable onPress={() => navigation.navigate("plusbutton")} style={styles.iconBehave} >
// //                         <Icon name="plus" size={25} color={COLORS.grey} />
// //                     </Pressable>
// //                     <Pressable onPress={() => navigation.navigate("adminHome")} style={styles.iconBehave} >
// //                         <Icon name="home" size={25} color="#FFDE9B" />
// //                     </Pressable>
// //                     <Pressable onPress={() => navigation.navigate("adminReports")} style={styles.iconBehave} >
// //                         <Icon name="star" size={25} color="#FFDE9B" />
// //                     </Pressable>
                   
// //                 </View>
// //             </View>



// //         </View>
// //     );
// // }

// // const styles = StyleSheet.create({
// //     cardView: {
// //         marginHorizontal: 10,
// //         marginBottom: 20,
// //         marginTop: 20,
// //         borderRadius: 15,
// //         width: cardwidth,
// //         height: 220,
// //         elevation: 13,
// //         backgroundColor: 'white',
// //     },
// //     image: {
// //         borderTopLeftRadius: 5,
// //         borderTopRightRadius: 5,
// //         height: 150,
// //         width: cardwidth,
// //     },

// //     Name: {
// //         fontSize: 20,
// //         fontWeight: 'bold',
// //         color: "#131A2C",
// //         marginTop: 5,
// //         marginLeft: 10,
// //         marginBottom: 10,
// //         left: 200
// //     },
// //     container: {
// //         flex: 1,
// //         backgroundColor: COLORS.background,
// //         // alignItems: 'center',
// //         // justifyContent: 'center',
// //     },
// //     heading: {
// //         color: COLORS.background,
// //         fontSize: 40,
// //         alignItems: 'center',
// //         marginBottom: 5,
// //     },
// //     header: {
// //         flexDirection: "row",
// //         backgroundColor: COLORS.background,
// //         height: '10%',
// //     },
// //     bottoms: {
// //         flexDirection: "row",
// //         backgroundColor: COLORS.background,
// //         height: 50,
// //         bottom: 20
// //     },
// //     headerText: {
// //         color: COLORS.darkblue,
// //         fontSize: 20,
// //         fontWeight: "bold",
// //         alignItems: 'center',
// //         margin: 10

// //     },
// //     Text: {
// //         color: COLORS.darkblue,
// //         fontSize: 40,
// //         fontWeight: "bold",
// //         alignItems: 'center',

// //     },
// //     address: {
// //         fontSize: 12,
// //         paddingTop: 5,
// //         color: COLORS.darkblue,
// //         paddingVertical: 10
// //     },
// //     NavContainer: {
// //         position: 'absolute',
// //         alignItems: 'center',
// //         bottom: 5,
// //         borderBottomLeftRadius: 15,
// //         borderBottomRightRadius: 15,
// //     },
// //     Navbar: {
// //         flexDirection: 'row',
// //         backgroundColor: COLORS.darkblue,
// //         width: 370,
// //         justifyContent: 'space-evenly',
// //         borderRadius: 30,
// //         height: 40

// //     },
// //     iconBehave: {
// //         padding: 35,
// //         bottom: 30
// //     },
// //     searchContainer: {
// //         flexDirection: 'row',
// //         alignItems: 'center',
// //         borderColor: COLORS.grey,
// //         borderWidth: 1,
// //         borderRadius: 10,
// //         margin: 10,
// //         padding: 5,
// //     },
// //     searchIcon: {
// //         marginRight: 10,
// //     },
// //     searchInput: {
// //         flex: 1,
// //         fontSize: 16,
// //         fontWeight: 'bold',
// //         color: '#333333',
// //     },
// //     headerTextView: {
// //         backgroundColor: 'White',
// //         paddingVertical: 3,
// //     },
// //     smallCard: {
// //         borderRadius: 30,
// //         backgroundColor: 'white',
// //         justifyContent: "center",
// //         alignItems: 'center',
// //         padding: 5,
// //         width: 80,
// //         margin: 10,
// //         height: 100
// //     },

// //     smallCardSelected: {
// //         borderRadius: 30,
// //         backgroundColor: '#FFDE9B',
// //         justifyContent: "center",
// //         alignItems: 'center',
// //         padding: 5,
// //         width: 80,
// //         margin: 10,
// //         height: 100
// //     },

// //     smallCardTextSected: {
// //         fontWeight: "bold",
// //         color: '#131A2C'
// //     },

// //     smallCardText: {
// //         fontWeight: "bold",
// //         color: '#131A2C'
// //     },

// //     floatButton: {
// //         position: 'absolute',
// //         bottom: 10, right: 15,
// //         backgroundColor: 'white',
// //         elevation: 10,
// //         width: 60, height: 60,
// //         borderRadius: 30,
// //         alignItems: 'center'
// //     }


// // });
// // export default adminHomeScreen;

// import React, { useState, useEffect } from 'react';
// import {
//     View, Text, TextInput, Image, TouchableOpacity, StyleSheet, FlatList, Pressable,
//     ScrollView, Dimensions, TouchableWithoutFeedback
// } from 'react-native';
// import Countdown from 'react-native-countdown-component'
// import { collection, getDocs } from 'firebase/firestore';
// import { db } from '../firebase';
// import FoodCard from '../components/Foodcard';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import Food, { Offer, filterData ,filterDataa} from '../data';
// import COLORS from '../Consts/Color';
// import Search from '../components/search';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import BottomNavigator from '../components/adminbar';

// const { width } = Dimensions.get('screen');
// const cardwidth = width - 20;


// // Generate required css


// // Inject stylesheet


// const adminHome = ({ navigation }) => {
//     const [searchQuery, setSearchQuery] = useState('');
//     const [indexCheck, setIndexCheck] = useState("0")
//     const [products, setProducts] = useState([]);
//     const [userId, setUserId] = useState('');


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
//         const getUserId = async () => {
//             const id = await AsyncStorage.getItem('USERID');
//             setUserId(id);
//             console.log(id);
//         };
//         getUserId();
//     }, []);

//     const handleProductPress = (product) => {
//         navigation.navigate('OfferDetails', { product });
//     };

//     const renderProduct = ({ item }) => (
//         <TouchableOpacity onPress={() => handleProductPress(item)}>
//             <View style={styles.cardView}>
//                 <Image source={{ uri: item.imageUrl }} style={styles.image} />

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
//                 <Text style={styles.Text}> AToZ </Text>
//             </View>
//             <Search/>

//             <ScrollView>
//                 {/* <View  style = {{marginBottom:10,paddingTop:10}}>
//        <Search/>
// </View> */}

//                 <View>
//                 <FlatList
//     horizontal={true}
//     showsHorizontalScrollIndicator={false}
//     data={filterData}
//     keyExtractor={(item) => item.id}
//     extraData={indexCheck}
//     renderItem={({ item, index }) => (
//         <Pressable
//             onPress={() => navigation.navigate('admin'+item.name)}
//         >
//             <View style={[styles.smallCard, indexCheck === item.id ? styles.selectedCard : null]}>
//                 <View>
//                     <Text style={[styles.smallCardText, indexCheck === item.id ? styles.selectedCardText : null]}>{item.name}</Text>
//                 </View>
//             </View>
//         </Pressable>
//     )}
// />

//                 </View>
//                 {/* <View>
//                 <FlatList
//     horizontal={true}
//     showsHorizontalScrollIndicator={false}
//     data={filterDataa}
//     keyExtractor={(item) => item.id}
//     renderItem={({ item, index }) => (
//         <Pressable
//                   onPress={() => navigation.navigate(item.name)}
//                         >
//                             <View style={item.id === "1" ? { ...styles.smallCardSelected } : { ...styles.smallCard }}>
//                                 <Image
//                                     style={{ height: 60, width: 60, borderRadius: 30 }}
//                                     source={item.image}
//                                 />

//                                 <View style={styles.smallCardText}>
//                                     <Text>{item.name}</Text>
//                                 </View>
//                             </View>
//                         </Pressable>
//                     )}
//                 />
//                 </View> */}
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
//                     // <View style={{ marginRight: 5 }}>
//                     //     <FoodCard
//                     //         screenWidth={300}
//                     //         images={item.images}
//                     //         restaurantName={item.restaurantName}
//                     //         price={item.price}
//                     //     />
//                     // </View>
//                     // )}
//                     />
//                 </View>


//                 <View style={styles.headerTextView}>
//                     <Text style={styles.headerText}>Promotions available</Text>
//                 </View>

//                 <View>
//                     <FlatList
//                         style={{ marginTop: 10, marginBottom: 10 }}
//                         horizontal={true}
//                         data={products}
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

        
//             <BottomNavigator item="adminHome" navigation={navigation} userId={userId} />



//         </View>
//     );
// }

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
//         color: COLORS.dark,
//         fontSize: 20,
//         fontWeight: "bold",
//         alignItems: 'center',
//         margin: 10

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
//     HeartIcone: {
//         height: 30,
//         width: 30,
//         borderRadius: 20,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     Text: {
//         color: COLORS.darkblue,
//         fontSize: 35,
//         fontFamily: 'SofiaRegular',
//         fontWeight: "bold",
//         alignItems: 'center',

//     },
//     address: {
//         fontSize: 12,
//         paddingTop: 5,
//         color: COLORS.dark,
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
//         backgroundColor: COLORS.dark,
//         width: width,
//         justifyContent: 'space-evenly',
//         borderRadius: 30,
//         height: 40

//     },
//     iconBehave: {
//         padding: 35,
//         bottom: 30
//     },
//     SearchArea: {
//         marginTop: 10,
//         width: "94%",
//         height: 40,
//         backgroundColor: COLORS.background,
//         borderRadius: 30,
//         borderWidth: 1,
//         borderColor: COLORS.grey,
//         flexDirection: "row",
//         alignItems: "center",
//         padding: 10
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
//         // borderRadius: 30,
//         backgroundColor:  COLORS.background,
//         justifyContent: "center",
//         alignItems: 'center',
//         width: 100,
//         height: 70
//     },

//     // smallCardSelected: {
//     //     // borderRadius: 30,
//     //     backgroundColor: '#FFDE9B',
//     //     justifyContent: "center",
//     //     alignItems: 'center',
//     //     width: 100,
//     //     height: 70
//     // },

//     // smallCardTextSected: {
//     //     fontWeight: "bold",
//     //     color: '#131A2C'
//     // },

//     smallCardText: {
//         fontWeight: "bold",
//         color: '#131A2C'
//     },

//     selectedCard: {

//         shadowColor: 'black',
//         shadowOffset: {
//             width: 0,
//             height: 2,
//         },
//         shadowOpacity: 0.25,
//         shadowRadius: 3.84,
//         elevation: 5,
//     },
//     smallCardText: {
//     },
//     selectedCardText: {
//         color: 'black',
//     },
//     floatButton: {
//         position: 'absolute',
//         bottom: 10, right: 15,
//         backgroundColor: 'white',
//         elevation: 10,
//         width: 60, height: 60,
//         borderRadius: 30,
//         alignItems: 'center'
//     },


// });
// export default adminHome;



import React, { useState, useEffect, useRef } from 'react';
import {
    View, Text, TextInput, Image, TouchableOpacity, StyleSheet, FlatList, Pressable,
    ScrollView, Dimensions, TouchableWithoutFeedback
} from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import filterData from '../data';
import COLORS from '../Consts/Color';
import Search from '../components/search';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNavigator from '../components/adminbar';
// import Carousel from 'react-native-snap-carousel';

const { width } = Dimensions.get('screen');
const { height: screenHeight } = Dimensions.get('window');
const cardheight = screenHeight / 2 - 30;
const cardwidth = width / 2;

const adminHome = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [indexCheck, setIndexCheck] = useState("0")
    const [products, setProducts] = useState([]);
    const [userId, setUserId] = useState('');
    const [activeIndexes, setActiveIndexes] = useState({});
    const imageWidth = cardwidth;

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

    const handleProductPress = async (product, Category) => {
        try {
            if (Category === "KIDS") {
                navigation.navigate('adminKidsDetails', { product });
            } else if (Category === "MEN") {
                navigation.navigate('adminMenDetails', { product });
            } else if (Category === "BABY") {
                navigation.navigate('adminBabyDetails', { product });
            } else {
                navigation.navigate('adminWomanDetails', { product });
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
                    <Text style={styles.Name}>{item.name}</Text>
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
            <View style={styles.header}>
                <Text style={styles.Text}> AToZ </Text>
            </View>
            <Search />
            <ScrollView>
                <View>
                    <FlatList
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        data={filterData}
                        keyExtractor={(item) => item.id}
                        extraData={indexCheck}
                        renderItem={({ item, index }) => (
                            <Pressable
                                onPress={() => navigation.navigate(item.name)}
                            >
                                <View style={[styles.smallCard, indexCheck === item.id ? styles.selectedCard : null]}>
                                    <View>
                                        <Text style={[styles.smallCardText, indexCheck === item.id ? styles.selectedCardText : null]}>{item.name}</Text>
                                    </View>
                                </View>
                            </Pressable>
                        )}
                    />

                </View>
{/* 
                <Carousel
                    ref={carouselRef}
                    data={data}
                    renderItem={renderItem}
                    sliderWidth={width}
                    itemWidth={300}
                    autoplay={true}
                    autoplayInterval={3000}
                    loop={true}
                /> */}

                <View style={styles.headerTextView}>
                    <Text style={[styles.headerText, { color: 'red' }]}> Discound product : </Text>
                </View>
                <View>
                    <ScrollView horizontal={true}>
                        <FlatList
                            style={{ marginTop: 10, marginBottom: 10 }}
                            horizontal={true}
                            data={products.slice(0, 7)}
                            showsHorizontalScrollIndicator={false}
                            renderItem={renderProduct}
                            keyExtractor={(item) => item.id}
                        />

                        <TouchableOpacity onPress={() => navigation.navigate('offerAdmin ', products)} style={styles.discoverButton}>
                            <Text style={styles.discoverText}>{'See All >>'}</Text>
                        </TouchableOpacity>

                    </ScrollView>
                </View>

                <View style={styles.headerTextView}>
                    <Text style={styles.headerText}>TRENDS </Text>
                </View>

                <View style={{ flexDirection: 'row' }}>
                    <ScrollView horizontal={true}>
                        <FlatList
                            style={{ marginTop: 10, marginBottom: 10 }}
                            horizontal={true}
                            data={products.slice(0, 3)}
                            showsHorizontalScrollIndicator={false}
                            renderItem={renderProduct}
                            keyExtractor={(item) => item.id}
                        />

                        <TouchableOpacity onPress={() => navigation.navigate('WOMAN')} style={styles.discoverButton}>
                            <Text style={styles.discoverText}>{'See All >>'} </Text>
                        </TouchableOpacity>

                    </ScrollView>
                </View>
                <View style={styles.bottoms}></View>
            </ScrollView>
            <BottomNavigator item="Home" navigation={navigation} userId={userId} />
        </View>
    );
}

const styles = StyleSheet.create({
    cardView: {
        marginBottom: 20,
        marginTop: 5,
        marginRight: 5,
        borderRadius: 15,
        width: cardwidth,
        height: cardheight - 30,
        elevation: 13,
        backgroundColor: 'white',
    },
    discoverButton: {
        marginBottom: 20,
        marginTop: 10,
        marginRight: 5,
        borderRadius: 15,
        width: cardwidth,
        height: cardheight - 30,
        elevation: 13,
        backgroundColor: '#ECF0F1',
    },
    discoverText: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.dark,
        marginTop: (cardheight - 30) / 2
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
    Text: {
        color: COLORS.darkblue,
        fontSize: 35,
        fontFamily: 'SofiaRegular',
        fontWeight: "bold",
        alignItems: 'center',
    },
    headerTextView: {
        backgroundColor: 'White',
        marginTop: 10
    },
    smallCard: {
        backgroundColor: COLORS.background,
        justifyContent: "center",
        alignItems: 'center',
        width: 100,
        height: 70
    },
    smallCardText: {
        fontWeight: "bold",
        color: '#131A2C'
    },
    selectedCard: {
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    smallCardText: {
    },
    selectedCardText: {
        color: 'black',
    },
});
export default adminHome;