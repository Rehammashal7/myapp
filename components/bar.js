import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import COLORS from '../Consts/Color';

const { width } = Dimensions.get('screen');
const BottomNavigator = ({ item, navigation, userId }) => {
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
        <Pressable onPress={() => navigation.navigate("Profile", { userId: userId })} style={styles.iconBehave}>
          <Icon name={iconprofile} size={25} color={COLORS.dark} style={styles.iconBehave} />
          <Text style={styles.Text}>profile</Text>
        </Pressable>

        <Pressable onPress={() => navigation.navigate("Catigory", { userId: userId })} style={styles.iconBehave}>
          <Icon name={iconcategory} size={25} color={COLORS.dark} style={styles.iconBehave} />
          <Text style={styles.Text}>category</Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate("Home")} style={styles.iconBehave}>
          <Icon name={iconHome} size={25} color={COLORS.dark} style={styles.iconBehave} />
          <Text style={styles.Text}>Home</Text>
        </Pressable>

        <Pressable onPress={() => navigation.navigate("Favorite", { userId: userId })} style={styles.iconBehave}>
          <Icon name={iconheart} size={25} color={COLORS.dark} style={styles.iconBehave} />
          <Text style={styles.Text}>favorite</Text>
        </Pressable>

        <Pressable onPress={() => navigation.navigate('CartScreen', { userId: userId })} style={styles.iconBehave}>
          <Icon name={iconcart} size={25} color={COLORS.dark} style={styles.iconBehave} />
          <Text style={styles.Text}>Cart</Text>
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
    height: 60

  },
  iconBehave: {
    alignItems: 'center',
    marginTop: 3
  },
  Text: {
    fontWeight: "bold",
    color: COLORS.dark
  }
});

export default BottomNavigator;
