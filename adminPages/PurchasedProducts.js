import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Import your Firebase configuration

const { width } = Dimensions.get('window');

const PurchasedProductsScreen = ({ navigation }) => {
  const [purchasedProducts, setPurchasedProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('Delivered'); // 'purchased' or 'waiting'

  useEffect(() => {
    fetchPurchasedProducts();
  }, []);

  const fetchPurchasedProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'purchasedProducts'));
      const data = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setPurchasedProducts(data);
    } catch (error) {
      console.error('Error fetching purchased products:', error);
    }
  };

  const toggleTab = (tab) => {
    setActiveTab(tab);
  };

  
  
  
  
  

  const handleMarkAsDone = async (itemId) => {
    try {
      const purchasedProductRef = doc(db, 'purchasedProducts', itemId);
      await updateDoc(purchasedProductRef, { delivered: true });
      console.log('Item marked as done:', itemId);
      // Refetch the purchased products to reflect changes
      fetchPurchasedProducts();
    } catch (error) {
      console.error('Error marking item as done:', error);
    }
  };

  const renderItem = ({ item }) => {
    const firstImageUrl = item.imageUrl && item.imageUrl.length > 0 ? item.imageUrl[0] : null;
  
    // Determine if the item is clickable based on its delivery status
    const isItemClickable = activeTab === 'waiting' && !item.delivered;
  
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={isItemClickable ? () => navigation.navigate('waitingitem', { item }) : null}
        disabled={!isItemClickable}
      >
        {firstImageUrl ? (
          <Image source={{ uri: firstImageUrl }} style={styles.itemImage} />
        ) : (
          <View style={[styles.itemImage, styles.noImage]}>
            <Text>No Image Available</Text>
          </View>
        )}
  
        <View style={styles.itemInfoContainer}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemText}>Price: ${item.totalPrice}</Text>
          <Text style={styles.itemText}>Quantity: {item.quantity}</Text>
          {activeTab === 'waiting' && !item.delivered && (
            <TouchableOpacity style={styles.doneButton} onPress={() => handleMarkAsDone(item.id)}>
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
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
      </View>

      {activeTab === 'Delivered' ? (
        <FlatList
          data={purchasedProducts.filter(item => item.delivered)}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.flatListContent}
          ListEmptyComponent={<Text style={styles.emptyText}>No purchased items found</Text>}
        />
      ) : (
        <FlatList
          data={purchasedProducts.filter(item => !item.delivered)}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.flatListContent}
          ListEmptyComponent={<Text style={styles.emptyText}>No items in Waiting List</Text>}
        />
      )}
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
    height: 120,
  },
  itemImage: {
    width: 120,
    height: '100%',
    resizeMode: 'cover',
  },
  noImage: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddd',
    width: 120,
    height: '100%',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemInfoContainer: {
    flex: 1,
    padding: 10,
  },
  itemText: {
    fontSize: 14,
    marginBottom: 3,
  },
  doneButton: {
    backgroundColor: 'black', // Change button background color to black
    paddingVertical: 5,
    paddingHorizontal: 8, // Adjust padding to make the button narrower
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
