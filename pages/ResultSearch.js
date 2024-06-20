import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, Dimensions, CheckBox, ScrollView, TouchableOpacity, Pressable } from 'react-native';
import COLORS from '../Consts/Color';
import { useIsFocused } from '@react-navigation/native';
import SelectDropdown from 'react-native-select-dropdown';
import Icon from "react-native-vector-icons/FontAwesome";
import { card } from '../Consts/styles';

const { width } = Dimensions.get('screen');
const { height: screenHeight } = Dimensions.get('window');
const cardheight = screenHeight / 2 - 30;
const cardwidth = width / 2;

const ProductPage = ({ route, navigation }) => {
  const { searchData } = route.params;
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeIndexes, setActiveIndexes] = useState({});
  const [numOfProductWoman, setNumOfProductWomen] = useState(0);
  const [numOfProductKids, setNumOfProductKids] = useState(0);
  const [numOfProductMen, setNumOfProductMen] = useState(0);
  const [numOfProductBaby, setNumOfProductBaby] = useState(0);
  const [numOfProduct, setNumOfProduct] = useState(0);
  const [Allproduct, setAllproduct] = useState([]);
  const imageWidth = cardwidth;
  const isFocused = useIsFocused();
  const [filterproduct, setfilterProduct] = useState([]);
  const [iconsort, seticonsort] = useState(true);
  const filters = [
    { title: 'all' },
    { title: 'size' },
    { title: 'color' },
    { title: 'type' },
  ];
  const type = [
    { title: 'woman' },
    { title: 'men' },
    { title: 'kids' },
    { title: 'baby' },
    { title: 'All' },
  ];

  const size = [
    { title: 'XS' },
    { title: 'S' },
    { title: 'M' },
    { title: 'L' },
    { title: 'XL' },
    { title: 'XXL' },
  ];
  const color = [
    { title: 'beige' },
    { title: 'bisque' },
    { title: 'black' },
    { title: 'blue' },
    { title: 'chocolate' },
    { title: 'fuchsia' },
    { title: 'grey' },
    { title: 'green' },
    { title: 'khaki' },
    { title: 'navy' },
    { title: 'red' },
    { title: 'salmon' },
    { title: 'white' },
  ];
  const handletype = (title) => {
    if(title!='All'){
    const filterSize = filterproduct.filter(product => containcategory(product, title))
    setAllproduct(filterSize);
    console.log(filterSize)
    }else {setAllproduct(filterproduct);}
  }
  const containcategory = ({ categoryName }, query) => {
    console.log(categoryName);
    return categoryName.toLowerCase().includes(query);
};
useEffect(() => {
  handletype()
}, [])
  const handleSize = (title) => {

    const filterSize = filterproduct.filter(product => containsize(product, title))
    setAllproduct(filterSize);
    console.log(filterSize)
  }
  useEffect(() => {
    handleSize()
  }, [])
  const handleColor = (title) => {

    const filterColor = filterproduct.filter(product => containColor(product, title))
    setAllproduct(filterColor);
    console.log(filterColor)
  }
  useEffect(() => {
    handleColor()
  }, [])
  const containsize = ({ sizes }, query) => {
    console.log(sizes);
    console.log(query);
    // Convert the query to lowercase for case-insensitive comparison
    const lowerCaseQuery = query;
    console.log(sizes.some(size => size.includes(lowerCaseQuery)))
    // Use the some method to check if any color in the list includes the query
    return sizes.some(size => size.includes(lowerCaseQuery));
  };
  const containColor = ({ colors }, query) => {
    console.log(colors);

    // Convert the query to lowercase for case-insensitive comparison
    const lowerCaseQuery = query;

    // Use the some method to check if any color in the list includes the query
    return colors.some(color => color.includes(lowerCaseQuery));
  };
  const sort = [
    { title: 'price' },
    { title: 'rate' },
    { title: 'none' },
  ];
  const [sortOrder, setSortOrder] = useState(true);

  const handlesort = (title) => {
    if (title === 'price') {
      Allproduct.sort((a, b) => {
        const priceA = a.price || 0; // Default to 0 if price is missing
        const priceB = b.price || 0;
        return !sortOrder ? priceA - priceB : priceB - priceA;
      });
      console.log(iconsort)
      setAllproduct(Allproduct);
    } else if (title === 'rate') {
      Allproduct.sort((a, b) => {
        const rateA = a.rate || 0; // Default to 0 if price is missing
        const rateB = b.rate || 0;
        return !sortOrder ? rateA - rateB : rateB - rateA;
      });
      console.log(iconsort)
      setAllproduct(Allproduct);
    } else {
      setAllproduct(filterproduct);
    }
  }
  const handleAll = (title) => {
    if (title === 'all') {
      setAllproduct(filterproduct);
    }
  }

  const [filterType, setFilterType] = useState("");
  const [sizeType, setsizeType] = useState("");
  const [colorType, setcolorType] = useState("");
  const [Type, setType] = useState("");
  const [sortType, setSortType] = useState("");
  useEffect(() => {
    productCount();
    let all = [];
    searchData.woman.map((item) => all.push(item));
    searchData.men.map((item) => all.push(item));
    searchData.kids.map((item) => all.push(item));
    searchData.baby.map((item) => all.push(item));
    setAllproduct(all);
    setfilterProduct(all);
    console.log(all)
    console.log(Allproduct)
  }, [isFocused]);

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

  const handleCategorySelect = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory('All');
    } else {
      setSelectedCategory(category);
    }
  };

  const productCount = () => {
    setNumOfProductWomen(searchData.woman.length);
    setNumOfProductMen(searchData.men.length);
    setNumOfProductKids(searchData.kids.length);
    setNumOfProductBaby(searchData.baby.length);
    setNumOfProduct(searchData.woman.length
      + searchData.men.length
      + searchData.kids.length
      + searchData.baby.length);
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity onPress={() => { handleProductPress(item, item.categoryName) }}>
      <View style={card.cardView}>
        <FlatList
          horizontal
          data={item.images}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item: image, index }) => (
            <Image key={index} source={{ uri: image }} style={card.imagee} />
          )}
          keyExtractor={(image, index) => index.toString()}
          onScroll={(event) => handleScroll(event, item.id)}
        />
        <View style={card.dotsContainer}>
          {item.images.map((_, index) => (
            <View
              key={index}
              style={[
                card.dot,
                index === (activeIndexes[item.id] || 0)
                  ? card.activeDot
                  : null,
              ]}
            />
          ))}
        </View>
        <View style={{ height: 110 }}>
          <Text style={card.Name} numberOfLines={2} ellipsizeMode="tail">
            {item.name}
          </Text>
          {item.offer !== 0 ? (
            <>
              <Text
                style={card.pricewithoffer}
              >
                {item.price} EGP
              </Text>
              <Text
                style={card.offer}
              >
                🏷️{item.offer}% Discount{" "}
                <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                  {Math.floor(
                    item.price - item.price / item.offer
                  )}{" "}
                  EGP
                </Text>
              </Text>
            </>
          ) : (
            <Text
              style={card.price}
            >
              {item.price} EGP
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (!searchData || searchData.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.Text]}> AtoZ </Text>
        </View>
        
        <Text style={[styles.result, { marginTop: 10, marginBottom: 10 }]}>{"search Result of : null "}</Text>
        <View style={[styles.container, { alignContent: 'center', textAlign: 'center', marginTop: 20 }]}>
          <Text style={[styles.result, { alignContent: 'center', textAlign: 'center' }]}>No products available</Text>
        </View>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.Text]}> AtoZ </Text>
      </View>
      <View style={styles.divider} />
      <View>
        <Text style={[styles.result, { marginBottom: 10 }]}>{"search Result of : " + route.params.searchTexts}</Text>
      </View>

      <ScrollView>
        {/* <View style={styles.container2}> */}
          {/* <View style={styles.headcontener}>
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
        </View> */}
        <View style={styles.containerfs}>
          <Pressable
            style={{ flexDirection: "row", }}
          >

            {/* <Text style={{fontWeight:'bold',fontSize:18}}>filter</Text> */}
            <View style={styles.numbertypecontainer}>
              <Icon
                name="filter"
                size={25}
                color="#343434"
                style={{ marginRight: 3 }}
              />
              <SelectDropdown
                data={filters}
                onSelect={(selectedItem) => {
                  setFilterType(selectedItem.title);
                  handleAll(selectedItem.title)
                  console.log(selectedItem.title);
                }}
                renderButton={(selectedItem, isOpened) => {
                  return (
                    <View style={styles.dropdownButtonStyle}>
                      <Text style={styles.dropdownButtonTxtStyle}>
                        {(filterType && filterType) || 'filter'}
                      </Text>
                      <Icon name={isOpened ? 'chevron-up' : 'chevron-down'} style={styles.dropdownButtonArrowStyle} />
                    </View>
                  );
                }}
                renderItem={(item, index, isSelected) => {
                  return (
                    <View style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                      <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
                    </View>
                  );
                }}
                showsVerticalScrollIndicator={false}
                dropdownStyle={styles.dropdownMenuStyle}
              />



            </View>
            {filterType === 'size' && (
              <SelectDropdown
                data={size}
                onSelect={(selectedItem) => {
                  setsizeType(selectedItem.title);
                  handleSize(selectedItem.title);
                  console.log(selectedItem.title);
                }}
                renderButton={(selectedItem, isOpened) => {
                  return (
                    <View style={styles.dropdownButtonStyle}>
                      <Text style={styles.dropdownButtonTxtStyle}>
                        {(sizeType && sizeType) || 'size'}
                      </Text>
                      <Icon name={isOpened ? 'chevron-up' : 'chevron-down'} style={styles.dropdownButtonArrowStyle} />
                    </View>
                  );
                }}
                renderItem={(item, index, isSelected) => {
                  return (
                    <View style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                      <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
                    </View>
                  );
                }}
                showsVerticalScrollIndicator={false}
                dropdownStyle={styles.dropdownMenuStyle}
              />
            )}
            {filterType === 'color' && (
              <SelectDropdown
                data={color}
                onSelect={(selectedItem) => {

                  setcolorType(selectedItem.title);
                  handleColor(selectedItem.title);
                  console.log(selectedItem.title);
                }}
                renderButton={(selectedItem, isOpened) => {
                  return (
                    <View style={styles.dropdownButtonStyle}>
                      <Text style={styles.dropdownButtonTxtStyle}>
                        {(colorType && colorType) || 'color'}
                      </Text>
                      <Icon name={isOpened ? 'chevron-up' : 'chevron-down'} style={styles.dropdownButtonArrowStyle} />
                    </View>
                  );
                }}
                renderItem={(item, index, isSelected) => {
                  return (
                    <View style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                      <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
                    </View>
                  );
                }}
                showsVerticalScrollIndicator={false}
                dropdownStyle={styles.dropdownMenuStyle}
              />
            )}
            {filterType === 'type' && (
              <SelectDropdown
                data={type}
                onSelect={(selectedItem) => {

                  setType(selectedItem.title);
                  handletype(selectedItem.title);
                  console.log(selectedItem.title);
                }}
                renderButton={(selectedItem, isOpened) => {
                  return (
                    <View style={styles.dropdownButtonStyle}>
                      <Text style={styles.dropdownButtonTxtStyle}>
                        {(Type && Type) || 'type'}
                      </Text>
                      <Icon name={isOpened ? 'chevron-up' : 'chevron-down'} style={styles.dropdownButtonArrowStyle} />
                    </View>
                  );
                }}
                renderItem={(item, index, isSelected) => {
                  return (
                    <View style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                      <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
                    </View>
                  );
                }}
                showsVerticalScrollIndicator={false}
                dropdownStyle={styles.dropdownMenuStyle}
              />
            )}
          </Pressable>
          <Pressable
            style={{ flexDirection: "row", marginLeft: 5 }}
          >

            {/* <Text style={{fontWeight:'bold',fontSize:18}}>filter</Text> */}
            <View style={styles.numbertypecontainer}>
              <Pressable onPress={() => { seticonsort(!iconsort), setSortOrder(!iconsort), handlesort(sortType) }}>
                <Icon
                  name={iconsort ? "sort-alpha-asc" : "sort-alpha-desc"}
                  size={25}
                  color="#343434"
                  style={{ marginRight: 10 }}

                />
              </Pressable>
              <SelectDropdown
                data={sort}
                onSelect={(selectedItem) => {
                  setSortType(selectedItem.title);
                  setSortOrder(true);
                  seticonsort(true);
                  handlesort(sortType);
                  console.log(selectedItem.title);
                }}
                renderButton={(selectedItem, isOpened) => {
                  return (
                    <View style={styles.dropdownButtonStyle}>
                      <Text style={styles.dropdownButtonTxtStyle}>
                        {(sortType && sortType) || 'Sort'}
                      </Text>
                      <Icon name={isOpened ? 'chevron-up' : 'chevron-down'} style={styles.dropdownButtonArrowStyle} />
                    </View>
                  );
                }}
                renderItem={(item, index, isSelected) => {
                  return (
                    <View style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                      <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
                    </View>
                  );
                }}
                showsVerticalScrollIndicator={false}
                dropdownStyle={styles.dropdownMenuStyle}
              />


            </View>
          </Pressable>
        </View>
        {/* <View style={styles.containerItem}>
          {selectedCategory === 'Woman' ? (
            <FlatList
              numColumns={2}
              data={searchData.woman}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderItem}
            />
          ) : null}
        </View>
        <View style={styles.containerItem}>
          {selectedCategory === 'Men' ? (
            <FlatList
              numColumns={2}
              data={searchData.men}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderItem}
            />
          ) : null}
        </View>
        <View style={styles.containerItem}>
          {selectedCategory === 'Kids' ? (
            <FlatList
              numColumns={2}
              data={searchData.kids}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderItem}
            />
          ) : null}
        </View>
        <View style={styles.containerItem}>
          {selectedCategory === 'Baby' ? (
            <FlatList
              numColumns={2}
              data={searchData.baby}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderItem}
            />
          ) : null}
        </View> */}
        <View style={styles.containerItem}>
         
            <FlatList
              numColumns={2}
              data={Allproduct}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
            />
          
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
  divider: {
    borderBottomColor: COLORS.grey,
    borderBottomWidth: 1,

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
    borderRadius: 5,
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
    marginTop: cardheight - 97,
  },
  dot: {
    width: 40,
    height: 2,
    marginBottom: 20,
    backgroundColor: "black",
    marginHorizontal: 5,
  },
  activeDot: {
    marginBottom: 20,
    backgroundColor: "white",
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
   // fontFamily: 'SofiaRegular',
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
  containerfs: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 5,
  },
  dropdownButtonStyle: {
    width: 90,
    height: 50,
    // backgroundColor: '#E9ECEF',
    // borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  dropdownButtonTxtStyle: {
    // flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#393e46',
  },
  dropdownButtonArrowStyle: {
    fontSize: 22,
    marginLeft: 5
  },
  // dropdownButtonIconStyle: {
  //   fontSize: 18,
  //   marginRight: 8,
  // },
  dropdownMenuStyle: {
    backgroundColor: '#E9ECEF',
    borderRadius: 8,
  },
  dropdownItemStyle: {
    // width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  numbertypecontainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'space-evenly',
    width: 80,
    height: 45,
    borderBottomColor: "black",
    borderBottomWidth: 1,
  },
  dropdownItemTxtStyle: {
    // flex: 1,
    fontSize: 16,
    // fontWeight: '500',
    color: '#151E26',
  },
});

export default ProductPage;
