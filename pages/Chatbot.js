

import React, { useEffect, useState, useRef  } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { Dialogflow_V2 } from 'react-native-dialogflow';
import Voice from 'react-native-voice';
import { dialogflowConfig ,sendQueryToDialogflow } from '../env'; // Ensure this file contains correct values
import { db } from '../firebase';
import { getAuth } from "firebase/auth";
import { collection, addDoc, query, getDocs, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';
// import { v4 as uuidv4 } from 'uuid';
// import * as Random from 'expo-random';

//  import 'react-native-get-random-values';
// import { getRandomBytes } from 'expo-random';

const Chatbot = ({ navigation }) => {
  const route = useRoute();
  // const [userId, setUserId] = useState(route.params.userId);
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);

  const [isWoman, setIsWoman] = useState(false); 
  const [isKid, setIsKid] = useState(false); 
  const [isBaby, setIsBaby] = useState(false); 

  const [productsWomenDress, setProductsWomenDress] = useState([]);
  const [productsWomenSkirt, setProductsWomenSkirt] = useState([]);
  const [productsWomenTshirt, setProductsWomenTshirt] = useState([]);
  const [productsWomenTrousers, setProductsWomenTrousers] = useState([]);

  const [productsMenShirt, setProductsMenShirt] = useState([]);
  const [productsMenTshirt, setProductsMenTshirt] = useState([]);
  const [productsMenTrousers, setProductsMenTrousers] = useState([]);

  const [productsKidsBoys, setProductsKidsBoys] = useState([]);
  const [productsKidsGirls, setProductsKidsGirls] = useState([]);

  const [productsBabyBoys, setProductsBabyBoys] = useState([]);
  const [productsBabyGirls, setProductsBabyGirls] = useState([]);


  const [isLoading, setIsLoading] = useState(true);
  const [state, setState] = useState(null);

  const dataFetchedRef = useRef(false);
  const auth = getAuth();

  const botAvatar = require('../assets/Avatar.png');
  const BOT = {
    _id: 2,
    name: 'Mr.Bot',
    avatar: botAvatar,
  };
  const getProducts = (data, type) => {
    if (!data || !Array.isArray(data)) {
      console.error("Invalid data format");
      return [];
    }
    return data.filter(product => product.type === type);
  };

  useEffect(() => {
    const fetchProductsData = async () => {
      try {
        const womenCollection = collection(db, "woman");
        const menCollection = collection(db, "men");
        const kidsCollection = collection(db, "kids");
        const babyCollection = collection(db, "baby");

        const [womenSnapshot, menSnapshot, kidsSnapshot, babySnapshot] = await Promise.all([
          getDocs(womenCollection),
          getDocs(menCollection),
          getDocs(kidsCollection),
          getDocs(babyCollection),
        ]);

        const womenData = womenSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const menData = menSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const kidsData = kidsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const babyData = babySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        setProductsWomenDress(getProducts(womenData, "dress"));
        setProductsWomenSkirt(getProducts(womenData, "skirt"));
        setProductsWomenTshirt(getProducts(womenData, "t-shirt"));
        setProductsWomenTrousers(getProducts(womenData, "trousers"));

        setProductsMenShirt(getProducts(menData, "shirt"));
        setProductsMenTshirt(getProducts(menData, "t-shirt"));
        setProductsMenTrousers(getProducts(menData, "trousers"));

        setProductsKidsBoys(getProducts(kidsData, "boy"));
        setProductsKidsGirls(getProducts(kidsData, "girl"));

        setProductsBabyBoys(getProducts(babyData, "boy"));
        setProductsBabyGirls(getProducts(babyData, "girl"));
        
      } catch (error) {
        console.error("Error fetching products: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!dataFetchedRef.current) {
      fetchProductsData();
      dataFetchedRef.current = true;
    }
  }, []);
  
  // const generateUUID = async () => {
  //   const randomBytes = await Random.getRandomBytesAsync(16);
  //   let uuid = '';
  //   for (let i = 0; i < randomBytes.length; i++) {
  //     let hex = randomBytes[i].toString(16);
  //     if (hex.length === 1) {
  //       hex = '0' + hex;
  //     }
  //     uuid += hex;
  //     if (i === 3 || i === 5 || i === 7 || i === 9) {
  //       uuid += '-';
  //     }
  //   }
  //   return uuid;
  // };

  // useEffect(() => {
  //   const initialize = async () => {
  //     try {
  //       console.log("uuidv4:", uuidv4); // Check if this logs a function
  //       const uniqueId = uuidv4();
  //       console.log("UUID generated:", uniqueId);
  //       setState(uniqueId);
  //     } catch (error) {
  //       console.error("An error occurred:", error);
  //     }
  //   };

  //   initialize();
  // }, []);

  // const handleSend = async (newMessage = []) => {
  //   setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessage));
  //   const text = newMessage[0].text;

  //   const auth = getAuth();
  //   if (auth.currentUser) {
  //     await saveMessage(newMessage[0]);
  //   }

  //   try {
  //     const result = await sendQueryToDialogflow(text, state);
  //     handleResponse(result);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   const getProductsDataForWomen = async () => {
  //     try {
  //       const productsCollection = collection(db, "woman");
  //       const productsSnapshot = await getDocs(productsCollection);
  //       const productsData = productsSnapshot.docs.map((doc) => ({
  //         id: doc.id,
  //         ...doc.data(),
  //       }));
  //       const filteredProductsWomenDress = getProducts("woman", productsData, "dress");
  //       setProductsWomenDress(filteredProductsWomenDress);
  //       const filteredProductsWomenSkirt = getProducts("woman", productsData, "skirt");
  //       setProductsWomenSkirt(filteredProductsWomenSkirt);
  //       const filteredProductsWomenTshirt = getProducts("woman", productsData, "t-shirt");
  //       setProductsWomenTshirt(filteredProductsWomenTshirt);
  //       const filteredProductsWomenTrousers = getProducts("woman", productsData, "trousers");
  //       setProductsWomenTrousers(filteredProductsWomenTrousers);
  //     } catch (error) {
  //       console.error("Error fetching products: ", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   getProductsDataForWomen();
  //   const getProductsDataForMen = async () => {
  //     try {
  //       const productsCollection = collection(db, "men");
  //       const productsSnapshot = await getDocs(productsCollection);
  //       const productsData = productsSnapshot.docs.map((doc) => ({
  //         id: doc.id,
  //         ...doc.data(),
  //       }));
  //       const filteredProductsMenShirt = getProducts("men", productsData, "shirt");
  //       setProductsMenShirt(filteredProductsMenShirt);
  //       const filteredProductsMenTshirt = getProducts("men", productsData, "t-shirt");
  //       setProductsMenTshirt(filteredProductsMenTshirt);
  //       const filteredProductsMenTrousers = getProducts("men", productsData, "trousers");
  //       setProductsMenTrousers(filteredProductsMenTrousers);
  //     } catch (error) {
  //       console.error("Error fetching products: ", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   getProductsDataForMen();
  // }, []);

  // useEffect(() => {
  //   const getProductsDataForMen = async () => {
  //     try {
  //       const productsCollection = collection(db, "men");
  //       const productsSnapshot = await getDocs(productsCollection);
  //       const productsData = productsSnapshot.docs.map((doc) => ({
  //         id: doc.id,
  //         ...doc.data(),
  //       }));
  //       const filteredProductsMenShirt = getProducts("men", productsData, "shirt");
  //       setProductsMenShirt(filteredProductsMenShirt);
  //       const filteredProductsMenTshirt = getProducts("men", productsData, "t-shirt");
  //       setProductsMenTshirt(filteredProductsMenTshirt);
  //       const filteredProductsMenTrousers = getProducts("men", productsData, "trousers");
  //       setProductsMenTrousers(filteredProductsMenTrousers);
  //     } catch (error) {
  //       console.error("Error fetching products: ", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   getProductsDataForMen();
  // }, []);


  // const getProducts = (collectionName, data, type) => {
  //   if (!data || !Array.isArray(data)) {
  //     console.error("Invalid data format");
  //     return [];
  //   }

  //   const filteredProducts = data.filter(product => product.type === type);

  //   return filteredProducts;
  // };

  const saveMessage = async (message) => {
    try {
      if (auth.currentUser) {
        console.log('User ID:', auth.currentUser.uid);
        console.log(`Message Collection Path: users/${auth.currentUser.uid}/messages`);
        console.log('Message data to save:', {
          text: message.text,
          createdAt: Timestamp.fromDate(message.createdAt),
          user: message.user,
          quickReplies: message.quickReplies || null,
        });
  
        // const messageId = ; // استخدام مكتبة uuid لتوليد UUID
        await addDoc(collection(db, "users", auth.currentUser.uid, "messages"), {
          // id: uuidv4(),
          text: message.text,
          createdAt: Timestamp.fromDate(message.createdAt),
          user: message.user,
          quickReplies: message.quickReplies || null,
        });
        console.log('Message saved successfully with ID:');
      } else {
        console.log('No current user');
      }
    } catch (error) {
      console.error('Error saving message: ', error);
      if (error.stack) {
        console.error('Error stack trace: ', error.stack);
      }
    }
  };

  function generateRandomHex() {
    return Math.floor(Math.random() * 16).toString(16);
  }
  
  function generateRandomUuid() {
    let uuid = '';
    for (let i = 0; i < 32; i++) {
      if (i === 8 || i === 12 || i === 16 || i === 20) {
        uuid += '-';
      } else if (i === 16) {
        uuid += '4';
      } else if (i === 12) {
        uuid += '4';
      } else {
        uuid += generateRandomHex();
      }
    }
    return uuid;
  }
  
 // const randomId = Date.now().toString() + Math.floor(Math.random() * 1000).toString();
  useEffect(() => {
    Dialogflow_V2.setConfiguration(
      dialogflowConfig.client_email,
      dialogflowConfig.private_key,
      Dialogflow_V2.LANG_ENGLISH_US,
      dialogflowConfig.project_id
    );

 
    
    const auth = getAuth();
    if (auth.currentUser) {
      const q = query(collection(db, "users", auth.currentUser.uid, "messages"), orderBy("createdAt", "desc"));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const messagesFirestore = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            _id: doc.id,
            text: data.text,
            createdAt: data.createdAt.toDate(),
            user: data.user,
            quickReplies: data.quickReplies || null,
          };
        });
        setMessages(messagesFirestore);

        if (messagesFirestore.length === 0) {
          sendWelcomeMessage();
        }
      });

      return () => unsubscribe();
    } else {
      checkFirstVisit();
    }

    // Voice.onSpeechResults = (event) => {
    //   handleSend([{ text: event.value[0] }]);
    // };

    // return () => {
    //   Voice.destroy().then(Voice.removeAllListeners);
    // };
  }, []);

  const checkFirstVisit = async () => {
    try {
      const hasVisitedBefore = await AsyncStorage.getItem('hasVisitedBefore');
      if (!hasVisitedBefore) {
        sendWelcomeMessage();
        await AsyncStorage.setItem('hasVisitedBefore', 'true');
      }
    } catch (error) {
      console.error('Failed to check first visit', error);
    }
  };

  const sendWelcomeMessage = () => {
    const welcomeMessage = {
      _id: 1,
      text: 'Hi there! How can I assist you today? We have a wide range of clothes. Can you specify the category you\'re interested in? Like women, men, kids, or babies?',
      createdAt: new Date(),
      user: BOT,
      quickReplies: {
        type: 'radio',
        keepIt: true,
        values: [
          { title: 'Women', value: 'Women' },
          { title: 'Men', value: 'Men' },
          { title: 'Kids', value: 'Kids' },
          { title: 'Baby', value: 'Baby' },
        ],
      },
    };

    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, [welcomeMessage])
    );

    const auth = getAuth();
    if (auth.currentUser) {
      saveMessage(welcomeMessage);
    }
  };
  // const sessionId = uuidv4();

  const handleSend = async (newMessage = []) => {
  setMessages((previousMessages) =>
    GiftedChat.append(previousMessages, newMessage)
  );
  const text = newMessage[0].text;

  const auth = getAuth();
  if (auth.currentUser) {
    await saveMessage(newMessage[0]);
  }

  Dialogflow_V2.requestQuery(
    text,
    result => handleResponse(result),
    error => console.log(error)
  );
};

  // const saveMessage = async (message) => {
  //   const auth = getAuth();
  //   if (!auth.currentUser) {
  //     return;
  //   }


  //   await addDoc(collection(db, "users", auth.currentUser.uid, "messages"), {
  //     text: message.text,
  //     createdAt: Timestamp.fromDate(new Date()),
  //     user: message.user,
  //     quickReplies: message.quickReplies || null,
  //   });
  // };



  const handleResponse = (result) => {
    if (result.queryResult && result.queryResult.fulfillmentMessages) {
      const text = result.queryResult.fulfillmentMessages[0].text.text[0];
      sendBotResponse(text);
    } else {
      console.error('Invalid response format', result);
    }
  };

//  let isMan=false;
//  let isWoman=false;

  const sendBotResponse = async (text) => {
    if (isLoading) {
      console.log("Loading products, please wait...");
      return;
    }
    const message = {
      _id:50,
      text: text,
      createdAt: new Date(),
      user: BOT,
    };

    const lowerCaseText = text.toLowerCase();

    const setProductQuickReplies = (products, titleCount = 2) => {
      if (products && products.length > 0) {
        return {
          type: 'radio',
          keepIt: true,
          values: products.map( product => ({
            title: product.name.split(' ').slice(0, titleCount).join(' '),
            value: product.name,
            image: product.images[0],
            productId: product.id,
            _id:86,
          })),
        };
      } else {
        return null;
      }
    };
/////////////////////////////////Welcom//////////////////////////////
    if (lowerCaseText.includes('hi there')
      || lowerCaseText.includes('hello')
      || lowerCaseText.includes('we have four')
    ) {
      message.quickReplies = {
        type: 'radio',
        keepIt: true,
        values: [
          { title: 'Women', value: 'Women' },
          { title: 'Men', value: 'Men' },
          { title: 'Kids', value: 'Kids' },
          { title: 'Baby', value: 'Baby' },
        ],
      };
    }
    /////////////////////////////////WOMEN/////////////////////////////////////
    else if (lowerCaseText.includes('what do you need: a t-shirt, a skirt, a dress, or trousers?')) {
      message.quickReplies = {
        type: 'radio',
        keepIt: true,
        values: [
          { title: 'T-shirt', value: 'T-shirt-Women' },
          { title: 'Skirt', value: 'Skirt' },
          { title: 'Dress', value: 'Dress' },
          { title: 'Trousers', value: 'Trousers-Women' },
        ],
      };
      setIsWoman(true);
      setIsBaby(false);
      setIsKid(false);
    }
    else if (lowerCaseText.includes('what do you think of these dresses?')) {
     
      const quickReplies = setProductQuickReplies(productsWomenDress);
      if (quickReplies) {
        message.quickReplies = quickReplies;
        setIsWoman(true);
      setIsBaby(false);
      setIsKid(false);
      } else {
        console.log("No products available");
        message.text = "Sorry, no products available right now.";
      }
    }
    else if (lowerCaseText.includes('what do you think of these skirts?')) {
      const quickReplies = setProductQuickReplies(productsWomenSkirt, 2);
      if (quickReplies) {
        message.quickReplies = quickReplies;
        setIsWoman(true);
      setIsBaby(false);
      setIsKid(false);

      } else {
        console.log("No products available");
        message.text = "Sorry, no products available right now.";
      }
    }
   /////////////////////////////////////t-shirt Man Or Women///////////////////////////////////// 
    else if (lowerCaseText.includes('do you need a women or men t-shirt?')) {
      message.quickReplies = {
        type: 'radio',
        keepIt: true,
        values: [
          { title: 'T-shirt-Women', value: 'T-shirt-Women' },
          { title: 'T-shirt-Men', value: 'T-shirt-Men' },

        ],
      };
    }
  //////////////////////////////////////T-shirt Woman//////////////////////////////////  
    else if (lowerCaseText.includes('what do you think of these women t-shirts?')) {
      const quickReplies = setProductQuickReplies(productsWomenTshirt, 2);
      if (quickReplies) {
        message.quickReplies = quickReplies;
        setIsWoman(true);
        setIsBaby(false);
        setIsKid(false);
      } else {
        console.log("No products available");
        message.text = "Sorry, no products available right now.";
      }
    }
  //////////////////////////////////////T-shirt Man///////////////////////////////////////////////  
    else if (lowerCaseText.includes('what do you think of these men t-shirts?')) {
      const quickReplies = setProductQuickReplies(productsMenTshirt, 2);
      if (quickReplies) {
        message.quickReplies = quickReplies;
        setIsWoman(false);
      setIsBaby(false);
      setIsKid(false);
      } else {
        console.log("No products available");
        message.text = "Sorry, no products available right now.";
      }
    }
     /////////////////////////////////////trousers Man Or Women///////////////////////////////////// 
    else if (lowerCaseText.includes('do you need a women or men trousers?')) {
      message.quickReplies = {
        type: 'radio',
        keepIt: true,
        values: [
          { title: 'trousers-Women', value: 'trousers-Women' },
          { title: 'trousers-Men', value: 'trousers-Men' },

        ],
      };
    }
///////////////////////////trousers Women///////////////////////////////////// 
  
    else if (lowerCaseText.includes('what do you think of these women trousers?')) {
      const quickReplies = setProductQuickReplies(productsWomenTrousers, 2);
      if (quickReplies) {
        message.quickReplies = quickReplies;
        setIsWoman(true);
        setIsBaby(false);
        setIsKid(false);
      } else {
        console.log("No products available");
        message.text = "Sorry, no products available right now.";
      }

    }
       /////////////////////////////////////trousers Man ///////////////////////////////////// 

    else if (lowerCaseText.includes('what do you think of these men trousers?')) {
      const quickReplies = setProductQuickReplies(productsMenTrousers, 2);
      if (quickReplies) {
        message.quickReplies = quickReplies;
        setIsWoman(false);
      setIsBaby(false);
      setIsKid(false);

      } else {
        console.log("No products available");
        message.text = "Sorry, no products available right now.";
      }
    }

   //////////////////////////////////// Man //////////////////////////////////// 
    else if (lowerCaseText.includes('what do you need: a t-shirt, a shirt ,or trousers?')) {
      message.quickReplies = {
        type: 'radio',
        keepIt: true,
        values: [
          { title: 'T-shirt', value: 'T-shirt-Man' },
          { title: 'shirt', value: 'Shirt-Man' },
          { title: 'Trousers', value: 'Trousers-Men' },
        ],
      };
      setIsWoman(false);
      setIsBaby(false);
      setIsKid(false);
    }
       //////////////////////////////////// Man shirt//////////////////////////////////// 
    else if (lowerCaseText.includes('what do you think of these men shirts?')) {
      const quickReplies = setProductQuickReplies(productsMenShirt, 2);
      if (quickReplies) {
        message.quickReplies = quickReplies;
        setIsWoman(false);
        setIsBaby(false);
        setIsKid(false);
      } else {
        console.log("No products available");
        message.text = "Sorry, no products available right now.";
      }

    }
///////////////////////////////////KIDS//////////////////////////////////
else if (lowerCaseText.includes('do you need clothes for boys or girls?')) {
  message.quickReplies = {
    type: 'radio',
    keepIt: true,
    values: [
      { title: 'kids-boy', value: 'kids-boy' },
      { title: 'kids-girl', value: 'kids-girl' },
     
    ],
  };
  setIsWoman(false);
  setIsBaby(false);
  setIsKid(true);
}
/////////////////////////////////For KIDS BOY/////////////////////////
else if (lowerCaseText.includes('what do you think about boy children clothing?')) {
  const quickReplies = setProductQuickReplies(productsKidsBoys, 2);
  if (quickReplies) {
    message.quickReplies = quickReplies;
    setIsWoman(false);
    setIsBaby(false);
    setIsKid(true);
  } else {
    console.log("No products available");
    message.text = "Sorry, no products available right now.";
  }

}
/////////////////////////////////For KIDS GIRL/////////////////////////
else if (lowerCaseText.includes('what do you think about girl children clothing?')) {
  const quickReplies = setProductQuickReplies(productsKidsGirls, 2);
  if (quickReplies) {
    message.quickReplies = quickReplies;
    setIsWoman(false);
    setIsBaby(false);
    setIsKid(true);
  } else {
    console.log("No products available");
    message.text = "Sorry, no products available right now.";
  }
}

///////////////////////////////////BABY//////////////////////////////////
else if (lowerCaseText.includes('do you want clothes for boys or girls?')) {
  message.quickReplies = {
    type: 'radio',
    keepIt: true,
    values: [
      { title: 'baby-boy', value: 'baby-boy' },
      { title: 'baby-girl', value: 'baby-girl' },
     
    ],
  };
  setIsWoman(false);
  setIsBaby(true);
  setIsKid(false);
}
/////////////////////////////////For BABY BOY/////////////////////////
else if (lowerCaseText.includes('what do you think about boy baby clothing?')) {
  const quickReplies = setProductQuickReplies(productsBabyBoys, 2);
  if (quickReplies) {
    message.quickReplies = quickReplies;
    setIsWoman(false);
    setIsBaby(true);
    setIsKid(false);
  } else {
    console.log("No products available");
    message.text = "Sorry, no products available right now.";
  }

}
/////////////////////////////////For BABY GIRL/////////////////////////
else if (lowerCaseText.includes('what do you think about girl baby clothing?')) {
  const quickReplies = setProductQuickReplies(productsBabyGirls, 2);
  if (quickReplies) {
    message.quickReplies = quickReplies;
    setIsWoman(false);
    setIsBaby(true);
    setIsKid(false);
  } else {
    console.log("No products available");
    message.text = "Sorry, no products available right now.";
  }
}
    // setMessages((previousMessages) => GiftedChat.append(previousMessages, [message]));

setMessages((previousMessages) => GiftedChat.append(previousMessages, [message]));

    const auth = getAuth();
    if (auth.currentUser) {
      try {
        console.log(message._id)
        await saveMessage(message);
      } catch (error) {
        console.error("Error saving messagee: ", error);
      }
    }
  };
  
  const getProductById = async (categoryId, itemId) => {
    try {
      const productsCollection = collection(db, categoryId);
      const querySnapshot = await getDocs(productsCollection);
      if (!querySnapshot.empty) {
        const productsData = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .find((product) => product.id === itemId);

        console.log('Product Data:', productsData);
        return productsData;
      } else {
        console.error('No documents found in collection');
        return null;
      }
    } catch (error) {
      console.error("Error fetching product: ", error);
      return null;
    }
  };

  const handleOnQuickReply = async (quickReply) => {
    const userMessage = {
      _id: 66,
      text: quickReply[0].title,
      createdAt: new Date(),
      user: {
        _id: getAuth().currentUser ? getAuth().currentUser.uid : 'anonymous',
        name: getAuth().currentUser ? getAuth().currentUser.displayName || "User" : "Guest",
      },
    };

    setMessages((previousMessages) => GiftedChat.append(previousMessages, [userMessage]));

    const auth = getAuth();
    if (auth.currentUser) {
      await saveMessage(userMessage)
    }

    let category;
    if (isWoman) {
      category = 'woman';
    } else if (isKid) {
      category = 'kids';
    } else if (isBaby) {
      category = 'baby';
    } else {
      category = 'men';
    }

    if (quickReply[0].productId) {
      const id = quickReply[0].productId;
      const retrievedProduct = await getProductById(category, id);

      if (retrievedProduct) {
        console.log('id', quickReply[0].productId);
        console.log(retrievedProduct);

        let screenName;
        if (isWoman) {
          screenName = 'WomanDetails';
        } else if (isKid) {
          screenName = 'KidsDetails';
        } else if (isBaby) {
          screenName = 'BabyDetails';
        } else {
          screenName = 'MenDetails';
        }

        setTimeout(() => {
          navigation.navigate(screenName, { product: retrievedProduct });
        }, 2000);

      } else {
        console.error('Product not found');
      }
    } else {
      Dialogflow_V2.requestQuery(
        quickReply[0].value,
        result => handleResponse(result),
        error => console.log(error)
      );
    }
  };

  // const renderQuickReplies = (props) => {
  //   const { quickReplies } = props.currentMessage;
  //   if (!quickReplies || !quickReplies.values) return null;
  //   return (
  //     <View style={styles.quickRepliesContainer}>
  //       {quickReplies.values.map((reply, index) => (
  //         <TouchableOpacity key={index} onPress={() => handleOnQuickReply([reply])} style={styles.quickReply}>
  //           {reply.image && <Image source={{ uri: reply.image }} style={styles.quickReplyImage} />}
  //           <Text style={styles.quickReplyText}>{reply.title}</Text>
  //         </TouchableOpacity>
  //       ))}
  //     </View>
  //   );
  // };
  const renderQuickReplies = (props) => {
    const { quickReplies } = props.currentMessage;
    if (!quickReplies || !quickReplies.values) return null;
    return (
      <View style={styles.quickRepliesContainer}>
        {quickReplies.values.map((reply, index) => (
          <TouchableOpacity key={reply._id || index} onPress={() => handleOnQuickReply([reply])} style={styles.quickReply}>
            {reply.image && <Image source={{ uri: reply.image }} style={styles.quickReplyImage} />}
            <Text style={styles.quickReplyText}>{reply.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };


  // const getProductById = async (categoryId, itemId) => {
  //   try {
  //     const productsCollection = collection(db, categoryId);
  //     const querySnapshot = await getDocs(productsCollection);
  
  //     if (!querySnapshot.empty) {
  //       const productsData = querySnapshot.docs
  //         .map((doc) => ({
  //           id: doc.id,
  //           ...doc.data(),
  //         }))
  //         .find((product) => product.id === itemId);
  
  //       console.log('Product Data:', productsData);
  //       return productsData;
  //     } else {
  //       console.error('No documents found in collection');
  //       return null;
  //     }
  //   } catch (error) {
  //     console.error("Error fetching product: ", error);
  //     return null;
  //   }
  // };
  
  // const handleOnQuickReply = async (quickReply) => {
  //   const userMessage = {
  //     _id: messages.length + 1,
  //     text: quickReply[0].title,
  //     createdAt: new Date(),
  //     user: {
  //       _id: getAuth().currentUser ? getAuth().currentUser.uid : 'anonymous',
  //       name: getAuth().currentUser ? getAuth().currentUser.displayName || "User" : "Guest",
  //     },
  //   };
  
  //   setMessages((previousMessages) => GiftedChat.append(previousMessages, [userMessage]));
  
  //   const auth = getAuth();
  //   if (auth.currentUser) {
  //     await saveMessage(userMessage);
  //   }
  // console.log(isWoman)
  //   const category = isWoman ? 'woman' : 'men';
  
  //   if (quickReply[0].productId) {
  //     const id = quickReply[0].productId;

  //     const retrievedProduct = await getProductById(category, id);
  
  //     if (retrievedProduct) { 
  //       console.log('id', quickReply[0].productId);
  //       console.log(retrievedProduct);
  
  //       const screenName = isWoman ? 'WomanDetails' : 'MenDetails';
  //       setTimeout(() => {
  //         navigation.navigate(screenName, { product: retrievedProduct });
  //       }, 2000);
    
  //     } else {
  //       console.error('Product not found');
  //     }
  //   }
  //    else {
  //     Dialogflow_V2.requestQuery(
  //       quickReply[0].value,
  //       result => handleResponse(result),
  //       error => console.log(error)
  //     );
  //   }
  // };
  
  // const renderQuickReplies = (props) => {
  //   const { quickReplies } = props.currentMessage;
  //   if (!quickReplies || !quickReplies.values) return null;
  //   return (
  //     <View style={styles.quickRepliesContainer}>
  //       {quickReplies.values.map((reply, index) => (
  //         <TouchableOpacity key={index} onPress={() => handleOnQuickReply([reply])} style={styles.quickReply}>
  //           {reply.image && <Image source={{ uri: reply.image }} style={styles.quickReplyImage} />}
  //           <Text style={styles.quickReplyText}>{reply.title}</Text>
  //         </TouchableOpacity>
  //       ))}
  //     </View>
  //   );
  // };

   
  return (
    <View style={{ flex: 1 }}>
      <GiftedChat
        messages={messages}
        onSend={(newMessage) => handleSend(newMessage)}
        onQuickReply={(quickReply) => handleOnQuickReply(quickReply)}
        user={{
          _id: getAuth().currentUser ? getAuth().currentUser.uid : 'anonymous',
          name: getAuth().currentUser ? getAuth().currentUser.displayName || "User" : "Guest",
        }}
        placeholder="Type your message here..."
        renderUsernameOnMessage
        scrollToBottom
        renderQuickReplies={renderQuickReplies}
      />
    </View>
  );
};
  // return (
  //   <View style={{ flex: 1 }}>
  //     <GiftedChat
  //       messages={messages}
  //       onSend={(newMessage) => handleSend(newMessage)}
  //       onQuickReply={(quickReply) => handleOnQuickReply(quickReply)}
  //       user={{
  //         _id: auth.currentUser ? auth.currentUser.uid : 'anonymous',
  //         name: auth.currentUser ? auth.currentUser.displayName || "User" : "Guest",
  //       }}
  //       placeholder="Type your message here..."
  //       renderUsernameOnMessage
  //       scrollToBottom
  //       renderQuickReplies={renderQuickReplies}
  //     />
  //   </View>
  // );};
const styles = StyleSheet.create({
  quickRepliesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
    justifyContent: 'center', // Center the quick replies
  },
  quickReply: {
    margin: 5,
    padding: 10,
    backgroundColor: '#e0e0e0', // Slightly darker background for better contrast
    borderRadius: 10, // More rounded corners
    alignItems: 'center',
    borderColor: '#ccc', // Add border
    borderWidth: 1,
  },
  quickReplyImage: {
    width: 60, // Increase image size
    height: 60, // Increase image size
    borderRadius: 30, // Make the image round
    marginBottom: 5,
  },
  quickReplyText: {
    fontSize: 16, // Slightly larger font size
    fontWeight: 'bold', // Bold text
  },
});

export default Chatbot;