
// import { collection, onSnapshot, doc, getDoc } from 'firebase/firestore';
// import { db } from'./firebase';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// export const subscribeToProducts = (onUpdate) => {
//   const collections = ['woman', 'men', 'kids', 'baby'];
//   const unsubscribeFunctions = [];

//   collections.forEach(collectionName => {
//     const productsCollection = collection(db, collectionName);
//     const unsubscribe = onSnapshot(productsCollection, snapshot => {
//       const productsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//       onUpdate(collectionName, productsData);
//     });
//     unsubscribeFunctions.push(unsubscribe);
//   });

//   // إرجاع دالة لإلغاء الاشتراك من جميع المستمعين
//   return () => {
//     unsubscribeFunctions.forEach(unsubscribe => unsubscribe());
//   };
// };

// // جلب بيانات المستخدم
// export const fetchUser = async (userId) => {
//   try {
//     const docRef = doc(db, "users", userId);
//     const docSnap = await getDoc(docRef);
//     return docSnap.exists() ? docSnap.data() : null;
//   } catch (error) {
//     console.error("Error fetching user: ", error);
//     return null;
//   }
// };

// // تخزين البيانات مؤقتًا
// export const cacheData = async (key, data) => {
//   try {
//     await AsyncStorage.setItem(key, JSON.stringify(data));
//   } catch (error) {
//     console.error("Error caching data: ", error);
//   }
// };

// // استرجاع البيانات من التخزين المؤقت
// export const getCachedData = async (key) => {
//   try {
//     const data = await AsyncStorage.getItem(key);
//     return data ? JSON.parse(data) : null;
//   } catch (error) {
//     console.error("Error getting cached data: ", error);
//     return null;
//   }
// };
// export const fetchUserData = async (userId) => {
//     try {
//       const userRef = doc(db, "users", userId);
//       const userSnap = await getDoc(userRef);
//       return userSnap.exists() ? userSnap.data() : null;
//     } catch (error) {
//       console.error("Error fetching user data: ", error);
//       return null;
//     }
//   };
// DataService.js
import { collection, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const subscribeToProducts = (onUpdate) => {
  const collections = ['woman', 'men', 'kids', 'baby'];
  const unsubscribeFunctions = [];

  collections.forEach(collectionName => {
    const productsCollection = collection(db, collectionName);
    const unsubscribe = onSnapshot(productsCollection, async (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log(`Fetched ${productsData.length} products from ${collectionName} collection.`);
      
      // Call onUpdate callback
      onUpdate(collectionName, productsData);

      // Cache the data in a single key
      const cachedProducts = await getCachedData('products') || {};
      cachedProducts[collectionName] = productsData;
      await cacheData('products', cachedProducts);
    }, error => {
      console.error(`Error fetching products from ${collectionName} collection:`, error);
    });
    unsubscribeFunctions.push(unsubscribe);
  });

  return () => {
    unsubscribeFunctions.forEach(unsubscribe => unsubscribe());
  };
};

export const fetchUser = async (userId) => {
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.error("Error fetching user: ", error);
    return null;
  }
};

export const cacheData = async (key, data) => {
  try {
    console.log(`Caching data for key: ${key}`, data);
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error("Error caching data: ", error);
  }
};

export const getCachedData = async (key) => {
  try {
    const data = await AsyncStorage.getItem(key);
    const parsedData = data ? JSON.parse(data) : null;
    console.log(`Retrieved cached data for key: ${key}`, parsedData);
    return parsedData;
  } catch (error) {
    console.error("Error getting cached data: ", error);
    return null;
  }
};
