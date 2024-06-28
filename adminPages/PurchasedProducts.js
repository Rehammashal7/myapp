import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase'; 

const { width } = Dimensions.get('window');

const PurchasedProductsScreen = ({ navigation }) => {
  const [purchasedProducts, setPurchasedProducts] = useState([]);
  //const [activeTab, setActiveTab] = useState('waiting'); 
  useEffect(() => {
    fetchPurchasedProducts();
  }, []);
  const handleItemPress = (items) => {
    navigation.navigate('waitingitem', { items });
  };
  const fetchPurchasedProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'userPurchasedProducts'));
      const data = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

      const sortedData = data.sort((a, b) => b.timestamp.toDate() - a.timestamp.toDate());
            // setPurchasedProducts(sortedData);

      //setPurchasedProducts(data);
      setPurchasedProducts(prevProducts => [...prevProducts, ...sortedData]);
    } catch (error) {
      console.error('Error fetching purchased products:', error);
    }
  };

  // const toggleTab = (tab) => {

  //   setActiveTab(tab);
  // };

  // const handleMarkAsDone = async (itemId) => {
  //   try {
  //     const purchasedProductRef = doc(db, 'userPurchasedProducts', itemId);
  //     await updateDoc(purchasedProductRef, { delivered: true });

  //     // setPurchasedProducts(prevProducts =>
  //     //   prevProducts.filter(product => product.id !== itemId)
  //     // );

  //     setPurchasedProducts(prevProducts =>
  //       prevProducts.map(product => 
  //         product.id === itemId ? { ...product, delivered: true } : product
  //       )
  //     );

  //     console.log('Item marked as delivered:', itemId);
  //   } catch (error) {
  //     console.error('Error marking item as delivered:', error);
  //   }
  // };

  const calculateTotalPrice = (items) => {
    return items.reduce((total, item) => total + (item.totalPrice || 0), 0);
  };

  const renderItem = ({ item }) => {
    const {  items, timestamp } = item;
    const totalPrice = calculateTotalPrice(items);

    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => handleItemPress(items)}
      
      >
        <View style={styles.itemInfoContainer}>
          <Text style={styles.itemText}>Number of Items: {items.length}</Text>
          <Text style={styles.itemText}>Order Time: {timestamp.toDate().toLocaleString()}</Text>
          <Text style={styles.itemText}>Total Price: ${totalPrice.toFixed(2)}</Text>
          {/* {!delivered && (
            <TouchableOpacity style={styles.doneButton} onPress={() => handleMarkAsDone(item.id)}>
              <Text style={styles.doneButtonText}>Delivered</Text>
            </TouchableOpacity>
          )} */}
        </View>
      </TouchableOpacity>
    );
  };
  
  return (
    <View style={styles.container}>
      {/* <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'Delivered' ? styles.activeTabButton : null,
            { width: width / 2 }
          ]}
          onPress={() => toggleTab('Delivered')}
        >
          <Text style={[styles.tabText, activeTab === 'Delivered' ? styles.activeTabText : null]}>
            Delivered
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'waiting' ? styles.activeTabButton : null,
            { width: width / 2 }
          ]}
          onPress={() => toggleTab('waiting')}
        >
          <Text style={[styles.tabText, activeTab === 'waiting' ? styles.activeTabText : null]}>
            Waiting List
          </Text>
        </TouchableOpacity>
      </View> */}

      <FlatList
        data={ purchasedProducts } //? purchasedProducts.filter(item => !item.delivered) : purchasedProducts.filter(item => item.delivered)
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.flatListContent}
        ListEmptyComponent={<Text style={styles.emptyText}>No items in Delevered</Text>} //{activeTab === 'waiting' ? 'Waiting List' : 'Delivered'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  activeTabButton: {
    backgroundColor: 'black',
    borderColor: 'black',
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  activeTabText: {
    color: 'white',
  },
  flatListContent: {
    paddingBottom: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    overflow: 'hidden',
    padding: 10,
  },
  itemInfoContainer: {
    flex: 1,
  },
  itemText: {
    fontSize: 14,
    marginBottom: 3,
  },
  doneButton: {
    backgroundColor: 'black',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginTop: 5,
    alignItems: 'center',
  },
  doneButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
});

export default PurchasedProductsScreen;
