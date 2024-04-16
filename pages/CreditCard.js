import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Dimensions } from 'react-native';
import COLORS from '../Consts/Color';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';

const { width } = Dimensions.get('screen');
const cardwidth = width / 2;


const CreditCard = ({ navigation }) => {
    const [amount, setAmount] = useState('');
    const [error, setError] = useState(null);
    useEffect(() => {
        const script = document.createElement('script');
        script.src = `https://www.paypal.com/sdk/js?client-id=AWY10CyVpqD5JFq5o5KelET49ca14WVmpcHn6kF7mxkdwEB1oYjcULi4_hEBrENkcapwEBtXg6-UITYd`;
        script.addEventListener('load', () => {

            window.paypal.Buttons().render('#paypal-button');

        },);
        document.body.appendChild(script);
    }, []);
    // const createOrder = (data, actions) => {
    //   return actions.order.create({
    //     purchase_units: [
    //       {
    //         amount: {
    //           currency_code: 'USD',
    //           value: amount,
    //         },
    //       },
    //     ],
    //   });
    // };
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
            {/* <TextInput
            style={styles.input}
             placeholder="Enter Amount"
            keyboardType="decimal-pad"
            onChangeText={setAmount}
            value={amount}
          /> */}
            {error && <Text style={styles.error}>{error}</Text>}
            <PayPalScriptProvider
                options={{ "client-id": "AWY10CyVpqD5JFq5o5KelET49ca14WVmpcHn6kF7mxkdwEB1oYjcULi4_hEBrENkcapwEBtXg6-UITYd" }}
            >
                {/* <PayPalButtons
              createOrder={createOrder}
                onApprove={onApprove}
                onError={onError}
            /> */}

                <PayPalButtons
                    style={{ layout: 'horizontal' }}
                    // createOrder={(data, actions) => {
                    //   // This function is called when the button is clicked
                    //   // You can customize the order details here
                    //   return actions.order.create({
                    //     purchase_units: [
                    //       {
                    //         amount: {
                    //           value: '0.01', // Example amount, should be replaced with actual value
                    //         },
                    //       },
                    //     ],
                    //   });
                    // }}
                    onApprove={onApprove}
                    onError={onError}
                />
            </PayPalScriptProvider>
            <View style={styles.paypalContainer}>
                <View style={styles.paypalButton} id="Checkout"></View>
            </View>


        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: COLORS.white,
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 18
    },
    btnContainer: {
        backgroundColor: COLORS.dark,
        height: 50,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 10,
        marginLeft: 40,

        width: 200
    },
    checkoutView: {
        width: '100%',
        height: 60,
        backgroundColor: '#fff',
        position: 'absolute',
        bottom: 60,
        elevation: 5,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    checkButton: {
        marginTop: 20,
        width: cardwidth,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.dark,

    },
});

export default CreditCard ;
