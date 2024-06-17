// // DataContext.js
// import React, { createContext, useState, useEffect } from 'react';
// import { subscribeToProducts, fetchUser, cacheData, getCachedData } from './dataService';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { onAuthStateChanged } from 'firebase/auth';
// import { auth } from './firebase';
// export const DataContext = createContext();

// export const DataProvider = ({ children }) => {
//   const [products, setProducts] = useState([]);
//   const [user, setUser] = useState(null);
//   const [userId, setUserId] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

// //   useEffect(() => {
// //     const getUserId = async () => {
// //       const id = await AsyncStorage.getItem('USERID');
// //       setUserId(id);
// //     };
// //     getUserId();
// //   }, []);
// useEffect(() => {
//     const checkUser = async () => {
//       const id = await AsyncStorage.getItem('USERID');
//       setUserId(id);
//     };

//     const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         setUserId(user.uid);
//         AsyncStorage.setItem('USERID', user.uid);
//       } else {
//         setUserId(null);
//         setUser(null);
//         AsyncStorage.removeItem('USERID');
//       }
//     });

//     checkUser();

//     return () => {
//       unsubscribeAuth();
//     };
//   }, []);
  
//   useEffect(() => {
//     const fetchData = async () => {
//       if (userId) {
//         setIsLoading(true);
        
//         // جلب البيانات المؤقتة إذا كانت موجودة
//         const cachedProducts = await getCachedData('products');
//         if (cachedProducts) {
//           setProducts(cachedProducts);
//           console.log(products)
//           setIsLoading(false);
//         }

//         const userData = await fetchUser(userId);
//         setUser(userData);

//         // مراقبة التحديثات في Firestore
//         const unsubscribe = subscribeToProducts((collectionName, newProducts) => {
//           setProducts(prevProducts => {
//             const updatedProducts = [...prevProducts.filter(p => p.type !== collectionName), ...newProducts];
//             cacheData('products', updatedProducts);
//             return updatedProducts;
//           });
//           setIsLoading(false);
//         });

//         // تنظيف الاشتراك عند التفكيك
//         return () => unsubscribe();
//       }
//     };
//     fetchData();
//   }, [userId]);

//   return (
//     <DataContext.Provider value={{ products, user, userId, isLoading, setUser,setIsLoading ,setUserId }}>
//       {children}
//     </DataContext.Provider>
//   );
// };
// import React, { createContext, useState, useEffect } from 'react';
// import { subscribeToProducts, fetchUser, cacheData, getCachedData } from './dataService';
// import { onAuthStateChanged } from 'firebase/auth';
// import { auth } from './firebase';
// import AsyncStorage from '@react-native-async-storage/async-storage';


// export const DataContext = createContext();

// export const DataProvider = ({ children }) => {
//   const [products, setProducts] = useState([]);
//   const [user, setUser] = useState(null);
//   const [userId, setUserId] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const checkUser = async () => {
//       const id = await AsyncStorage.getItem('USERID');
//       setUserId(id);
//     };

//     const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         setUserId(user.uid);
//         AsyncStorage.setItem('USERID', user.uid);
//       } else {
//         setUserId(null);
//         setUser(null);
//         AsyncStorage.removeItem('USERID');
//       }
//     });

//     checkUser();

//     return () => {
//       unsubscribeAuth();
//     };
//   }, []);

//   useEffect(() => {
//     const fetchData = async () => {
//       if (userId) {
//         setIsLoading(true);

//         const cachedProducts = await getCachedData('products');
//         if (cachedProducts) {
//           setProducts(cachedProducts);
//           setIsLoading(false);
//         } else {
//           const userData = await fetchUser(userId);
//           setUser(userData);

//           const unsubscribe = subscribeToProducts((collectionName, newProducts) => {
//             setProducts(prevProducts => {
//               const updatedProducts = [...prevProducts.filter(p => p.type !== collectionName), ...newProducts];
//               cacheData('products', updatedProducts);
//               return updatedProducts;
//             });
//             setIsLoading(false);
//           });

//           return () => unsubscribe();
//         }
//       }
//     };

//     fetchData();
//   }, [userId]);

//   return (
//     <DataContext.Provider value={{ products, user, userId, isLoading, setUser, setIsLoading, setUserId }}>
//       {children}
//     </DataContext.Provider>
//   );
// };

// DataContext.js
import React, { createContext, useState, useEffect } from 'react';
import { subscribeToProducts, fetchUser, cacheData, getCachedData } from './dataService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [products, setProducts] = useState({
    woman: [],
    men: [],
    kids: [],
    baby: []
  });
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const id = await AsyncStorage.getItem('USERID');
      setUserId(id);
    };

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        AsyncStorage.setItem('USERID', user.uid);
      } else {
        setUserId(null);
        setUser(null);
        AsyncStorage.removeItem('USERID');
      }
    });

    checkUser();

    return () => {
      unsubscribeAuth();
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        setIsLoading(true);

        const cachedProducts = await getCachedData('products');
        if (cachedProducts) {
          setProducts(cachedProducts);
        }

        const userData = await fetchUser(userId);
        setUser(userData);

        const unsubscribe = subscribeToProducts((collectionName, newProducts) => {
          setProducts(prevProducts => {
            const updatedProducts = {
              ...prevProducts,
              [collectionName]: newProducts
            };

            cacheData('products', updatedProducts);
            return updatedProducts;
          });
          setIsLoading(false);
        });

        return () => unsubscribe();
      } else {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  return (
    <DataContext.Provider value={{ products, user, userId, isLoading, setUser }}>
      {children}
    </DataContext.Provider>
  );
};

