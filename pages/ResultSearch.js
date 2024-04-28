import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, Dimensions, CheckBox, ScrollView, TouchableOpacity } from 'react-native';
import COLORS from '../Consts/Color';
import Search from '../components/search';

const { width } = Dimensions.get('screen');
const { height: screenHeight } = Dimensions.get('window');
const cardheight = screenHeight / 2 - 30;
const cardwidth = width / 2;

const ProductPage = ({ route, navigation }) => {
  const { searchData } = route.params;
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



  if (!searchData || searchData.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.Text]}> AtoZ </Text>
        </View>
        <Search />
        <Text style={[styles.result, { marginTop: 10, marginBottom: 10 }]}>{"search Result of : null "}</Text>
        <View style={[styles.container, { alignContent: 'center', textAlign: 'center', marginTop: 20 }]}>
          <Text style={[styles.result, { alignContent: 'center', textAlign: 'center' }]}>No products available</Text>
        </View>
      </View>
    );
  }
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleScroll = (event, productId) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.floor(contentOffsetX / imageWidth);
    setActiveIndexes((prevState) => ({
      ...prevState,
      [productId]: currentIndex,
    }));
  };

  const handleCategorySelect = (category) => {
    if (selectedCategory === category) {
      // If the selected category is already the current category, deselect it
      setSelectedCategory('All');
    } else {
      // Otherwise, select the clicked category
      setSelectedCategory(category);
    }
  };
  const [activeIndexes, setActiveIndexes] = useState({});
  const [numOfProductWoman, setNumOfProductWomen] = useState(0);
  const [numOfProductKids, setNumOfProductKids] = useState(0);
  const [numOfProductMen, setNumOfProductMen] = useState(0);
  const [numOfProductBaby, setNumOfProductBaby] = useState(0);
  const [numOfProduct, setNumOfProduct] = useState(0);
  const productCount = () => {
    setNumOfProductWomen(searchData.woman.length);
    setNumOfProductMen(searchData.men.length);
    setNumOfProductKids(searchData.kids.length);
    setNumOfProductBaby(searchData.baby.length);
    setNumOfProduct(searchData.woman.length
      + searchData.men.length
      + searchData.kids.length
      + searchData.baby.length);
  }
  useEffect(() => {
    productCount();
  }, []);

  const imageWidth = cardwidth;
  const renderItem = ({ item, index }) => (
    <TouchableOpacity onPress={() => { handleProductPress(item, item.categoryName) }}>
      <View style={styles.cardView}>
        <FlatList
          horizontal
          data={item.images}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item: image, index }) => (
            <Image key={index} source={{ uri: image }} style={styles.image} />
          )}
          keyExtractor={(image, index) => index.toString()}
          onScroll={(event) => handleScroll(event, item.id)}
        />
        <View style={styles.dotsContainer}>
          {item.images.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === (activeIndexes[item.id] || 0)
                  ? styles.activeDot
                  : null,
              ]}
            />
          ))}
        </View>


        <Text style={styles.Name}>{item.name}</Text>
        <View style={{ flexDirection: "row", marginTop: 10, marginHorizontal: 10, justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.price}EGP</Text>

        </View>
      </View>
    </TouchableOpacity>
  );
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.Text]}> AtoZ </Text>
      </View>
      <Search />
      <View>
        <Text style={[styles.result, { marginTop: 10, marginBottom: 10 }]}>{"search Result of : " + route.params.searchTexts}</Text>
      </View>

      <ScrollView>
        <View style={styles.container2}>
          <View style={styles.headcontener}>
            <Text style={styles.heading}>{'Categories : ' + selectedCategory}</Text>
            {selectedCategory === 'All' && (<Text style={[styles.itemcount]}>{"items count : " + numOfProduct}</Text>)}
            {selectedCategory === 'Woman' && (<Text style={[styles.itemcount]}>{"items count : " + numOfProductWoman}</Text>)}
            {selectedCategory === 'Men' && (<Text style={[styles.itemcount]}>{"items count : " + numOfProductMen}</Text>)}
            {selectedCategory === 'Kids' && (<Text style={[styles.itemcount]}>{"items count : " + numOfProductKids}</Text>)}
            {selectedCategory === 'Baby' && (<Text style={[styles.itemcount]}>{"items count : " + numOfProductBaby}</Text>)}
          </View>
          <View style={styles.checkboxContainer}>
            {['All', 'Woman', 'Men', 'Kids', 'Baby'].map((category) => (
              <TouchableOpacity
                key={category}
                style={selectedCategory === category ? styles.selectedcategoryButton : styles.categoryButton}
                onPress={() => handleCategorySelect(category)}
              >
                <Text
                  style={[
                    styles.categoryLabel,
                    selectedCategory === category && styles.selectedCategory,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.containerItem}>
          {selectedCategory === 'All' || selectedCategory === 'Woman' ? (
            <FlatList
              numColumns={2}
              data={searchData.woman}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderItem}
            />
          ) : null}
        </View>
        <View style={styles.containerItem}>
          {selectedCategory === 'All' || selectedCategory === 'Men' ? (
            <FlatList
              numColumns={2}
              data={searchData.men}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderItem}
            />
          ) : null}
        </View>
        <View style={styles.containerItem}>
          {selectedCategory === 'All' || selectedCategory === 'Kids' ? (
            <FlatList
              numColumns={2}
              data={searchData.kids}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderItem}
            />
          ) : null}
        </View>
        <View style={styles.containerItem}>
          {selectedCategory === 'All' || selectedCategory === 'Baby' ? (
            <FlatList
              numColumns={2}
              data={searchData.baby}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderItem}
            />
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  containerItem: {

    backgroundColor: COLORS.white
  },
  container2: {
    flex: 1,
    padding: 5,
    marginBottom: 5,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemcount: {
    fontSize: 18,
    marginBottom: 10,
    color: '#808B96',
    marginLeft: 'auto',
  },
  checkboxContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '98%'
  },
  headcontener: {
    flexDirection: 'row',
    alignContent: 'space-between',
  },
  categoryButton: {
    borderColor: COLORS.grey,
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    margin: 5,
  },
  selectedcategoryButton: {
    backgroundColor: 'black',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    margin: 5,
  },
  categoryLabel: {
    fontSize: 14,
  },
  selectedCategory: {
    backgroundColor: 'black',
    color: 'white',
  },
  cardView: {
    marginBottom: 20,
    marginTop: 20,
    borderRadius: 15,
    width: cardwidth,
    height: cardheight + 20,
    elevation: 13,
    backgroundColor: 'white',
  },
  dotsContainer: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: cardheight - 90,
    //  zIndex: 1
    //marginBottom:30,
  },
  dot: {
    width: 40,
    height: 2,
    marginBottom: 20,
    // borderRadius: 5,
    backgroundColor: "black",

    marginHorizontal: 5,
  },
  activeDot: {
    marginBottom: 20,
    backgroundColor: "white",
  },

  scrollView: {
    height: 200,
  },
  image: {
    position: "relative",
    height: cardheight - 80,
    width: cardwidth,

  },
  Name: {
    fontSize: 14,
    fontWeight: 'bold',
    color: "#131A2C",
    marginTop: 5,
    marginLeft: 10,
    marginBottom: 10,
    height: 40

  },
  header: {
    flexDirection: "row",
    backgroundColor: COLORS.background,
    height: '10%',
    alignItems: 'center',
    textAlign: 'center'
  },
  Text: {
    color: COLORS.darkblue,
    fontSize: 35,
    fontFamily: 'SofiaRegular',
    fontWeight: "bold",
    alignItems: 'center',
  },
  result: {
    fontSize: 20,
    fontWeight: 'bold',
    color: "#131A2C",
    marginTop: 5,
    marginLeft: 10,
    marginBottom: 10,
  },
});

export default ProductPage;
