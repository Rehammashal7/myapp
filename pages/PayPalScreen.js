import React, { useEffect,useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList,Pressable } from 'react-native';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { PayPalButtons } from '@paypal/react-paypal-js';

import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import PayPalScreen from './PayPalScreen'; 


const PayPalScreen = ({navigation}) =>{

  const [amount, setAmount] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=AX8P_k3dNT8FJcVSr_qqFFxbUuRSO6C1W6XJ_eOylME1W8aCvRltDO0AWFAOgA-srgbpw9rHeWtFZ9Pd`;
    script.addEventListener('load', () => {
      window.paypal.Buttons().render('#paypal-button');
    });
    document.body.appendChild(script);
  }, []);

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: amount,
          },
        },
      ],
    });
  };

  const onApprove = (data, actions) => {
    return actions.order.capture().then((details) => {
      firebase.firestore().collection('payments').add({
        payerId: details.payer.payer_id,
        purchaseAmount: amount,
        create_time: details.create_time,
      }).then(() => {
        navigation.navigate('ConfirmationScreen');
      }).catch((error) => {
        setError(error.message);
      });
    });
  };

  const onError = (err) => {
    setError(err.message);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter Amount"
        keyboardType="decimal-pad"
        onChangeText={setAmount}
        value={amount}
      />
      {error && <Text style={styles.error}>{error}</Text>}
      <PayPalScriptProvider
        options={{ "client-id": "AX8P_k3dNT8FJcVSr_qqFFxbUuRSO6C1W6XJ_eOylME1W8aCvRltDO0AWFAOgA-srgbpw9rHeWtFZ9Pd" }}
      >
        <PayPalButtons
          createOrder={createOrder}
          onApprove={onApprove}
          onError={onError}
        />
      </PayPalScriptProvider>
      <View style={styles.paypalContainer}>
        <View style={styles.paypalButton} id="paypal-button"></View>
      </View>
      <View style={styles.NavContainer} >
               <View style={styles.Navbar} >
               <Pressable onPress={() => navigation.navigate("PayPalScreen")} style={styles.iconBehave} >
                       <Icon name="cube" size={20} color="gray" />
                   </Pressable>
                   <Pressable onPress={() => navigation.navigate("Favorite")} style={styles.iconBehave} >
                       <Icon name="heart" size={30} color="#FFDE9B" />
                   </Pressable>
                   <Pressable onPress={() => navigation.navigate("profile")} style={styles.iconBehave}>
                       <Icon name="user" size={30} color="gray" />
                   </Pressable>
                   <Pressable onPress={() => navigation.navigate("Home")} style={styles.iconBehave} >
                       <Icon name="home" size={30} color="gray" />
                   </Pressable>
               </View>
               </View>
    </View>
      );
    }
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
      },
      input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        width: '80%',
      },
      error: {
        color: 'red',
        marginBottom: 10,
      },
      paypalContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
      },
      paypalButton: {
        height: 50,
        color: 'blue',
      },
      NavContainer: {
        position:'absolute',
        alignItems:'center',
        bottom:10,
        padding:10, 
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
     },
     iconBehave:{
      padding:44,
      bottom:35
   },
    });
    

export default PayPalScreen ;

