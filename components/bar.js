import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import theme from '../Consts/Color';
import useThemeStyles from '../Consts/themeStyle';
import { Navbar } from '../Consts/styles';

const { width } = Dimensions.get('screen');
const BottomNavigator = ({ item, navigation, userId ,COLORS}) => {
  
 const styles=Navbar(COLORS)
  
  const [iconHome, setIconHome] = useState("home-outline");
  const [iconprofile, setIconProfile] = useState("person-outline");
  const [iconheart, setIconHeart] = useState("heart-outline");
  const [iconcart, setIconCart] = useState("cart-outline");
  const [iconcategory, setIconCategory] = useState("grid-outline");

  useEffect(() => {
    if (item === "Home") {
      setIconHome("home");
    } else if (item === "profile") {
      setIconProfile("person");
    } else if (item === "fav") {
      setIconHeart("heart");
    } else if (item === "cart") {
      setIconCart("cart");
    } else if (item === "catigory") {
      setIconCategory("grid");
    }
  }, [item]);

  return (
    <View style={styles.NavContainer}>
      <View style={styles.Navbar}>
        <Pressable onPress={() => navigation.navigate("profile", { userId: userId ,COLORS:COLORS})} style={styles.iconBehave}>
          <Icon name={iconprofile} size={25} color={COLORS.dark} style={styles.iconBehave} />
          <Text style={styles.Text}>profile</Text>
        </Pressable>

        <Pressable onPress={() => navigation.navigate("catigory", { userId: userId ,COLORS:COLORS})} style={styles.iconBehave}>
          <Icon name={iconcategory} size={25} color={COLORS.dark} style={styles.iconBehave} />
          <Text style={styles.Text}>category</Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate("Home")} style={styles.iconBehave}>
          <Icon name={iconHome} size={25} color={COLORS.dark} style={styles.iconBehave} />
          <Text style={styles.Text}>Home</Text>
        </Pressable>

        <Pressable onPress={() => navigation.navigate("favorite", { userId: userId ,COLORS:COLORS})} style={styles.iconBehave}>
          <Icon name={iconheart} size={25} color={COLORS.dark} style={styles.iconBehave} />
          <Text style={styles.Text}>favorite</Text>
        </Pressable>

        <Pressable onPress={() => navigation.navigate('CartScreen', { userId: userId ,COLORS:COLORS})} style={styles.iconBehave}>
          <Icon name={iconcart} size={25} color={COLORS.dark} style={styles.iconBehave} />
          <Text style={styles.Text}>Cart</Text>
        </Pressable>

      </View>
    </View>
  );
};



export default BottomNavigator;
