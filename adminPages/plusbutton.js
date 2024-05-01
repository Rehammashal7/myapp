import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet,Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import COLORS from '../Consts/Color';
import BottomNavigator from '../components/adminbar';
// import plusss from '../assets/plusss.png';

const plusbutton = ({ navigation }) => {
     
    return (
        <View style={styles.container}>
             <Text style={styles.headerText}>Choose What You Want:</Text>
             
          <View style={styles.buttonContainer}>
            <Pressable style={styles.button} onPress={() => navigation.navigate("AddProductForm")}  >
            <Text style={styles.buttonText}>Add Product</Text>
            {/* <Image source={plusss} style={styles.buttonImage} /> */}
          </Pressable>
          <Pressable style={styles.button} onPress={() => navigation.navigate("addadmin")}>
            <Text style={styles.buttonText}>Add Admin</Text>
          </Pressable>
          </View>
          <BottomNavigator item="plus" navigation={navigation} />
        </View>
      );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    button: {
      backgroundColor: '#131A2C',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 25,
      marginBottom: 20,
    },
    buttonText: {
      color: '#FFDE9B',
      fontSize: 18,
      fontWeight: 'bold',
    },
    headerText: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    buttonContainer: {
      alignItems: 'center',
     // backgroundColor: 'black'
    },
    NavContainer: {
      position: 'absolute',
      alignItems: 'center',
      bottom: 5,
      borderBottomLeftRadius: 15,
      borderBottomRightRadius: 15,
  },
  Navbar: {
      flexDirection: 'row',
      backgroundColor: COLORS.darkblue,
      width: 370,
      justifyContent: 'space-evenly',
      borderRadius: 30,
      height: 40

  },
    // buttonImage: {
    //   marginRight: 10, 
    // },
  });

export default plusbutton;