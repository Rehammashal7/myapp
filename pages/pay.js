import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Dimensions } from 'react-native';
import COLORS from '../Consts/Color';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';

const { width } = Dimensions.get('screen');
const cardwidth = width / 2;

const Pay = ({ navigation }) => {
    useEffect(() => {
        console.log('pay')
    }, []);
    return (
        <View style={styles.container}>
            <Text style={{ color: COLORS.dark, fontWeight: '600', fontSize: 20, textAlign: 'center' }}>
                pay successful
            </Text>
            <Text style={{ color: COLORS.grey, fontWeight: '600', fontSize: 20, textAlign: 'center' }}>
                You can receive the products in:
            </Text>
            <View style={styles.checkButton}>
                <TouchableOpacity onPress={() => navigation.navigate("Home")}>

                    <Text style={{ color: COLORS.white }}>Home</Text>

                </TouchableOpacity>
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

export default Pay;
