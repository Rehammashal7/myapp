import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import COLORS from '../Consts/Color';

const { width } = Dimensions.get('screen');

const BottomNavigator = ({ item, navigation, userId }) => {
  const [iconHome, setIconHome] = useState("home-outline");
  const [iconprofile, setIconProfile] = useState("person-outline");
  const [iconplus, setIconPLUS] = useState("add-outline");

  const [iconcategory, setIconCategory] = useState("grid-outline");

  useEffect(() => {
    if (item === "adminHome") {
      setIconHome("home");
    } else if (item === "adminprofile") {
      setIconProfile("person");
    }
    else if (item === "AddProductForm") {
        setIconPLUS("add");
    }else if (item === "admincatigory") {
      setIconCategory("grid");
    }
  }, [item]);

  return (
    <View style={styles.NavContainer}>
      <View style={styles.Navbar}>
        <Pressable onPress={() => navigation.navigate("adminprofile", { userId: userId })} style={styles.iconBehave}>
          <Icon name={iconprofile} size={25} color={COLORS.dark} style={styles.iconBehave} />
          <Text style={styles.Text}>profile</Text>
        </Pressable>

        <Pressable onPress={() => navigation.navigate("admincatigory")} style={styles.iconBehave}>
          <Icon name={iconcategory} size={25} color={COLORS.dark} style={styles.iconBehave} />
          <Text style={styles.Text}>category</Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate("adminHome")} style={styles.iconBehave}>
          <Icon name={iconHome} size={25} color={COLORS.dark} style={styles.iconBehave} />
          <Text style={styles.Text}>Home</Text>
        </Pressable>

        <Pressable onPress={() => navigation.navigate("AddProductForm", { userId: userId })} style={styles.iconBehave}>
          <Icon name={iconplus} size={25} color={COLORS.dark} style={styles.iconBehave} />
          <Text style={styles.Text}>Plus</Text>
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
