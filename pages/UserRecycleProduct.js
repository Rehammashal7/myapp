import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Image, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";


import {
    doc,
    collection,
    where,
    setDoc,
    updateDoc,
    getDocs,
    getDoc,

} from "firebase/firestore";
import { auth, db, storage } from "../firebase";
import COLORS from "../Consts/Color";
import { useIsFocused } from "@react-navigation/native";
// const [userId, setUserId] = useState(route.params.userId);
const UserRecycleProduct = ({ navigation }) => {
    const [RecycleProduct, setRecycleProduct] = useState([]);
    const [isAccept, setisAccept] = useState('');
    const [isSold, setisSold] = useState();
    const isFocused = useIsFocused();

    useEffect(() => {
        getOrders();
        setisSold(RecycleProduct.sold);
        setisAccept(RecycleProduct.isAccept);
        console.log(RecycleProduct);
        console.log(RecycleProduct.sold);
    }, [isFocused]);

    const getOrders = async () => {
        try {
            // استرجاع بيانات المستخدم
            const userId = await AsyncStorage.getItem("USERID");
            const productsCollection = collection(db, "recycle");
            const productsSnapshot = await getDocs(productsCollection);
            let productsData = productsSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            productsData = productsData.filter((product) => product.userId === userId)

            setRecycleProduct(productsData);

            console.log(productsData);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    const formatDate = (timestamp) => {
        // Check if the timestamp is a Firebase Timestamp
        if (timestamp && timestamp.seconds && timestamp.nanoseconds) {
            // Convert Firebase Timestamp to JavaScript Date
            const date = new Date(
                timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
            );
            // Check if the parsedDate is a valid date
            if (!isNaN(date.getTime())) {
                return date.toLocaleDateString();
            }
        }

        return "Invalid Date";
    };

    return (
        <View style={{ backgroundColor: COLORS.white }}>
            <Text style={styles.pageTitle}>Recycle Product</Text>
            <FlatList
                data={RecycleProduct}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <View style={styles.imageContainer}>
                            <Image source={{ uri: item.images[0] }} style={styles.itemImage} />
                        </View>

                        <View style={styles.textContainer}>

                            <Text style={styles.itemText}>
                                Name: {item.name}
                            </Text>
                            <Text style={styles.itemText}>Price: {item.price} EGP</Text>
                            {item.isAccept==='accepted' &&
                            (<Text style={styles.AcceptText}>{item.isAccept}</Text>)
                            }
                            {item.isAccept==='reject' &&
                            (<Text style={styles.rejectText}>{item.isAccept}</Text>)
                            }
                            {item.isAccept==='not accept' &&
                            (<Text style={styles.itemText}>waiting... </Text>)
                            }
                            {item.sold &&
                                (<Text style={styles.itemText}>sold</Text>)

                            }
                        </View>
                    </View>
                )}
            />
        </View>

    );
};

export default UserRecycleProduct;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: "#fff",
    },
    pageTitle: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "left",
        marginVertical: 16,
        paddingLeft: 13,
    },
    itemContainer: {
        flexDirection: "row",
        backgroundColor: COLORS.white,
        padding: 1,
        paddingTop: 8,
        paddingHorizontal: 10,
        marginBottom: 10,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: COLORS.grey,
        marginRight: 10,
        marginLeft: 10,
        height: 120
    },
    imageContainer: {
        marginRight: 10,
    },
    itemImage: {
        width: 110,
        height: 100,
        borderRadius: 10,
    },
    textContainer: {
        marginLeft: 20,
        marginRight: 20,
        marginTop: 5,
       alignContent:'center'
    },
    itemText: {
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 5,
        textAlign: "left",
        color: COLORS.dark
    },
    AcceptText: {
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 5,
        textAlign: "left",
        color: 'green'
    },
    rejectText: {
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 5,
        textAlign: "left",
        color: 'red'
    },
    dateText: {
        fontSize: 10,
        fontWeight: "bold",
        marginRight: 0,
    },
    dateContainer: {
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        marginRight: -20,

    },
});
