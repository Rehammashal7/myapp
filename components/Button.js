import React from 'react';
import {StyleSheet, TouchableOpacity, View, Text} from 'react-native';
import COLORS from '../Consts/Color';


const PrimaryButton = ({title, onPress = () => {}}) => {
  return (
    <TouchableOpacity activeOpacity={0.2} onPress={onPress}>
      <View style={style.btnContainer}>
        <Text style={style.title}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};
const style = StyleSheet.create({
    title: {color: COLORS.yellow , fontWeight: 'bold', fontSize: 18},
    btnContainer: {
      backgroundColor: COLORS.darkblue,
      height: 50,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop:20,
      marginBottom:10,
      marginLeft:40,

      width:200
    },
  });
  
  export default PrimaryButton;