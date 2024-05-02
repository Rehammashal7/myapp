import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Fontisto } from '@expo/vector-icons'; // Import Fontisto
import COLORS from '../Consts/Color';

const { width } = Dimensions.get('screen');

const BottomNavigator = ({ item, navigation, userId }) => {
  const [iconHome, setIconHome] = useState('home-outline');
  const [iconProfile, setIconProfile] = useState('person-outline');
  const [iconPlus, setIconPlus] = useState('add-outline');
  const [iconCategory, setIconCategory] = useState('grid-outline');

  useEffect(() => {
    if (item === 'adminHome') {
      setIconHome('home');
    } else if (item === 'adminprofile') {
      setIconProfile('person');
    } else if (item === 'AddProductForm') {
      setIconPlus('add');
    } else if (item === 'admincatigory') {
      setIconCategory('grid');
    }
  }, [item]);

  return (
    <View style={styles.NavContainer}>
      <View style={styles.Navbar}>
        <Pressable onPress={() => navigation.navigate('adminprofile', { userId: userId })} style={styles.iconBehave}>
          <Icon name={iconProfile} size={25} color={COLORS.dark} />
          <Text style={styles.Text}>Profile</Text>
        </Pressable>

        <Pressable onPress={() => navigation.navigate('admincatigory')} style={styles.iconBehave}>
          <Icon name={iconCategory} size={25} color={COLORS.dark} />
          <Text style={styles.Text}>Category</Text>
        </Pressable>

        <Pressable onPress={() => navigation.navigate('adminHome')} style={styles.iconBehave}>
          <Icon name={iconHome} size={25} color={COLORS.dark} />
          <Text style={styles.Text}>Home</Text>
        </Pressable>

        <Pressable onPress={() => navigation.navigate('AddProductForm', { userId: userId })} style={styles.iconBehave}>
          <Icon name={iconPlus} size={25} color={COLORS.dark} />
          <Text style={styles.Text}>Add</Text>
        </Pressable>

        {/* Adding Fontisto Icon */}
        <Pressable onPress={() =>  navigation.navigate('PurchasedProductsScreen')} style={styles.iconBehave}>
          <Fontisto name="shopping-bag-1" size={25} color={COLORS.dark} />
          <Text style={styles.Text}>Orders</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  NavContainer: {
    position: 'absolute',
    alignItems: 'center',
    bottom: 1,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  Navbar: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    width: width,
    justifyContent: 'space-evenly',
    height: 60,
  },
  iconBehave: {
    alignItems: 'center',
    marginTop: 3,
  },
  Text: {
    fontWeight: 'bold',
    color: COLORS.dark,
  },
});

export default BottomNavigator;
