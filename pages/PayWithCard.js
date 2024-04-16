
// //import liraries
// import { useState } from 'react';
// import { SafeAreaView, StyleSheet, View, Modal, TouchableOpacity, Text } from 'react-native';

// import { CardField, confirmPayment } from '@stripe/stripe-react-native';
// import paypalApi from'./paypalapi';
// import creatPaymentIntent from './stripeapis';
// import WebView from 'react-native-webview';
// import queryString from 'query-string';

// // create a component
// const PaymentScreen = () => {

//     const [cardInfo, setCardInfo] = useState(null)
//     const [isLoading, setLoading] = useState(false)
//     const [paypalUrl, setPaypalUrl] = useState(null)
//     const [accessToken, setAccessToken] = useState(null)

//     const fetchCardDetail = (cardDetail) => {
//         // console.log("my card details",cardDetail)
//         if (cardDetail.complete) {
//             setCardInfo(cardDetail)
//         } else {
//             setCardInfo(null)
//         }
//     }



//     const onDone = async () => {

//         let apiData = {
//             amount: 500,
//             currency: "INR"
//         }

//         try {
//             const res = await creatPaymentIntent(apiData)
//             console.log("payment intent create succesfully...!!!", res)

//             if (res?.data?.paymentIntent) {
//                 let confirmPaymentIntent = await confirmPayment(res?.data?.paymentIntent, { paymentMethodType: 'Card' })
//                 console.log("confirmPaymentIntent res++++", confirmPaymentIntent)
//                 alert("Payment succesfully...!!!")
//             }
//         } catch (error) {
//             console.log("Error rasied during payment intent", error)
//         }

//         // console.log("cardInfocardInfocardInfo", cardInfo)
//         // if (!!cardInfo) {
//         //     try {
//         //         const resToken = await createToken({ ...cardInfo, type: 'Card' })
//         //         console.log("resToken", resToken)

//         //     } catch (error) {
//         //         alert("Error raised during create token")
//         //     }
//         // }


//     }


//     const onPressPaypal = async () => {
//         setLoading(true)
//         try {
//             const token = await paypalApi.generateToken()
//             const res = await paypalApi.createOrder(token)
//             setAccessToken(token)
//             console.log("res++++++", res)
//             setLoading(false)
//             if (!!res?.links) {
//                 const findUrl = res.links.find(data => data?.rel == "approve")
//                 setPaypalUrl(findUrl.href)
//             }


//         } catch (error) {
//             console.log("error", error)
//             setLoading(false)

//         }
//     }


//     const onUrlChange = (webviewState) => {
//         console.log("webviewStatewebviewState", webviewState)
//         if (webviewState.url.includes('https://example.com/cancel')) {
//             clearPaypalState()
//             return;
//         }
//         if (webviewState.url.includes('https://example.com/return')) {

//             const urlValues = queryString.parseUrl(webviewState.url)
//             console.log("my urls value", urlValues)
//             const { token } = urlValues.query
//             if (!!token) {
//                 paymentSucess(token)
//             }

//         }
//     }

//     const paymentSucess = async (id) => {
//         try {
//             const res = paypalApi.capturePayment(id, accessToken)
//             console.log("capturePayment res++++", res)
//             alert("Payment sucessfull...!!!")
//             clearPaypalState()
//         } catch (error) {
//             console.log("error raised in payment capture", error)
//         }
//     }


//     const clearPaypalState = () => {
//         setPaypalUrl(null)
//         setAccessToken(null)
//     }

//     return (
//         <View style={styles.container}>
//             <SafeAreaView style={{ flex: 1 }}>
//                 <View style={{ padding: 16 }}>
//                     <CardField
//                         postalCodeEnabled={false}
//                         placeholders={{
//                             number: '4242 4242 4242 4242',
//                         }}

//                         cardStyle={{
//                             backgroundColor: '#FFFFFF',
//                             textColor: '#000000',
//                         }}
//                         style={{
//                             width: '100%',
//                             height: 50,
//                             marginVertical: 30,
//                         }}
//                         onCardChange={(cardDetails) => {
//                             fetchCardDetail(cardDetails)
//                         }}
//                         onFocus={(focusedField) => {
//                             console.log('focusField', focusedField);
//                         }}

//                     />

//                     <ButtonComp
//                         onPress={onDone}
//                         disabled={!cardInfo}
//                     />

//                     <ButtonComp
//                         onPress={onPressPaypal}
//                         disabled={false}
//                         btnStyle={{ backgroundColor: '#0f4fa3', marginVertical: 16 }}
//                         text="PayPal"
//                         isLoading={isLoading}
//                     />

//                     <Modal
//                         visible={!!paypalUrl}
//                     >
//                         <TouchableOpacity
//                             onPress={clearPaypalState}
//                             style={{ margin: 24 }}
//                         >
//                             <Text >Closed</Text>
//                         </TouchableOpacity>
//                         <View style={{ flex: 1 }}>
//                             <WebView
//                                 source={{ uri: paypalUrl }}
//                                 onNavigationStateChange={onUrlChange}

//                             />
//                         </View>

//                     </Modal>

//                 </View>
//             </SafeAreaView>
//         </View>
//     );
// };

// // define your styles
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,

//     },
// });

// //make this component available to the app
// export default PaymentScreen;

// // import React from 'react';
// // import { View, Text, Button, ActivityIndicator } from 'react-native';
// // import axios from 'axios';
// // import { encode } from 'base-64';

// // const PayWithCard = ({ onPaymentSuccess }) => {
// //   const handlePayment = async () => {
// //     try {
// //       const response = await axios.post(
// //         'https://api.sandbox.paypal.com/v1/oauth2/token',
// //         'grant_type=client_credentials',
// //         {
// //           headers: {
// //             'Content-Type': 'application/x-www-form-urlencoded',
// //             'Authorization': 'Basic ' + encode('AUwXqWhwfPhhwz6Sl16WTwrssmFCAmt7P1V6Bx7jbSzsVqLWt2cWvKecQziJUbeQtLcrGtJmOKPmqe_f:EO7DEJynzypNjRcjU0v5Hy3L2UH8CMcxMhSLoD-P0hw3_jv1vmYka0hQR6MzYKWnd72snOOwL0-wxNYI')
// //           }
// //         }
// //       );

// //       const accessToken = response.data.access_token;
// //       onPaymentSuccess(accessToken);
// //     } catch (error) {
// //       console.error('Error obtaining OAuth2 token:', error);
// //     }
// //   };

// //   return (
// //     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
// //       <>
// //         <Text>Tap the button below to make a PayPal payment:</Text>
// //         <Button title="Make PayPal Payment" onPress={handlePayment} />
// //       </>
// //     </View>
// //   );
// // };

// // export default PayWithCard;


// // import { encode } from 'base-64';

// // import React, { useState } from 'react';
// // import { View, Text, Button, ActivityIndicator, } from 'react-native';
// // import axios from 'axios';

// // const PayWithCard = () => {
// //   const [loading, setLoading] = useState(false);

  
// //   const handlePayment = async () => {
// //     try {
// //       const response = await axios.post(
// //         'https://api.sandbox.paypal.com/v1/oauth2/token',
// //         'grant_type=client_credentials',
// //         {
// //           headers: {
// //             'Content-Type': 'application/x-www-form-urlencoded',
// //             'Authorization': 'Basic ' + encode('AUwXqWhwfPhhwz6Sl16WTwrssmFCAmt7P1V6Bx7jbSzsVqLWt2cWvKecQziJUbeQtLcrGtJmOKPmqe_f:EO7DEJynzypNjRcjU0v5Hy3L2UH8CMcxMhSLoD-P0hw3_jv1vmYka0hQR6MzYKWnd72snOOwL0-wxNYI')
// //           }
// //         }
// //       );
  
// //       console.log('OAuth2 token response:', response.data);
      
// //       // Proceed with other payment-related logic here
// //     } catch (error) {
// //       console.error('Error obtaining OAuth2 token:', error);
// //     }
// //   };
  
// //   return (
// //     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
// //       {loading ? (
// //         <ActivityIndicator size="large" color="blue" />
// //       ) : (
// //         <>
// //           <Text>Tap the button below to make a PayPal payment:</Text>
// //           <Button title="Make PayPal Payment" onPress={handlePayment} />
// //         </>
// //       )}
// //     </View>
// //   );
// // };

// // export default PayWithCard;


// // import React from 'react';
// // import { View, Text, Button } from 'react-native';
// // import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

// // const PayWithCard = () => {
// //   const handleApprove = (data, actions) => {
// //     // Handle payment approval logic here
// //     console.log('Payment approved!');
// //   };

// //   const handleError = (err) => {
// //     // Handle payment error logic here
// //     console.log('Payment error:', err);
// //   };

// //   return (
// //     <View>
// //       <Text>Tap the button below to make a PayPal payment:</Text>
// //       <PayPalScriptProvider
// //         options={{
// //           'client-id': 'AUwXqWhwfPhhwz6Sl16WTwrssmFCAmt7P1V6Bx7jbSzsVqLWt2cWvKecQziJUbeQtLcrGtJmOKPmqe_f', // Replace with your PayPal client ID
// //         }}
// //       >
// //         <PayPalButtons
// //           createOrder={(data, actions) => {
// //             return actions.order.create({
// //               purchase_units: [
// //                 {
// //                   amount: {
// //                     value: '10.00', // Set the payment amount
// //                     currency_code: 'USD', // Set the currency
// //                   },
// //                   description: 'Sample Payment', // Set the payment description
// //                 },
// //               ],
// //             });
// //           }}
// //           onApprove={handleApprove}
// //           onError={handleError}
// //         />
// //       </PayPalScriptProvider>
// //     </View>
// //   );
// // };

// // export default PayWithCard;


// // // import React from 'react';
// // // import { View, Text, Button } from 'react-native';
// // // import PayPal from 'react-native-paypal';

// // // const PayWithCard = () => {
// // //   const handlePayment = async () => {
// // //     try {
// // //       const confirmation = await PayPal.pay({
// // //         price: '10.00',
// // //         currency: 'USD',
// // //         description: 'Sample Payment',
// // //       });
      
// // //       if (confirmation?.response?.state === 'approved') {
// // //         console.log('Payment approved!');
// // //       } else {
// // //         console.log('Payment not approved.');
// // //       }
// // //     } catch (error) {
// // //       console.log('Payment error:', error);
// // //     }
// // //   };

// // //   return (
// // //     <View>
// // //       <Text>Tap the button below to make a PayPal payment:</Text>
// // //       <Button title="Make PayPal Payment" onPress={handlePayment} />
// // //     </View>
// // //   );
// // // };

// // // export default PayWithCard;










// // // import React, { Component } from 'react';
// // // import { View, WebView, ActivityIndicator } from 'react-native';
// // // import axios from 'axios';

// // // export default class Paypal extends Component {
// // //     state = {
// // //         accessToken: null,
// // //         approvalUrl: null,
// // //         paymentId: null
// // //     }

// // //     componentDidMount() {
// // //         // Base64 encode username and password
// // //         const credentials = 'AUwXqWhwfPhhwz6Sl16WTwrssmFCAmt7P1V6Bx7jbSzsVqLWt2cWvKecQziJUbeQtLcrGtJmOKPmqe_f:EO7DEJynzypNjRcjU0v5Hy3L2UH8CMcxMhSLoD-P0hw3_jv1vmYka0hQR6MzYKWnd72snOOwL0-wxNYI';
      
// // //         // Use the encode function
// // //         let currency = '100 USD';
// // //         currency = currency.replace(" USD", "");

// // //         const dataDetail = {
// // //             "intent": "sale",
// // //             "payer": {
// // //                 "payment_method": "paypal"
// // //             },
// // //             "transactions": [{
// // //                 "amount": {
// // //                     "total": currency,
// // //                     "currency": "THB",
// // //                     "details": {
// // //                         "subtotal": currency,
// // //                         "tax": "0",
// // //                         "shipping": "0",
// // //                         "handling_fee": "0",
// // //                         "shipping_discount": "0",
// // //                         "insurance": "0"
// // //                     }
// // //                 }
// // //             }],
// // //             "redirect_urls": {
// // //                 "return_url": "https://example.com",
// // //                 "cancel_url": "https://example.com"
// // //             }
// // //         }

// // //         // Request access token using Basic Authentication
// // //         axios.post('https://api.sandbox.paypal.com/v1/oauth2/token', { grant_type: 'client_credentials' },
// // //             {
// // //                 headers: {
// // //                     'Content-Type': 'application/x-www-form-urlencoded',
// // //                     'Authorization': `A21AAI6WHEvooeG2FWeGmXW6Ttsk_jjHKXcAnRgWjxIerAG6m-vD-mr1wRH73EGik0MSmwclOGK2sUGMVV6j4Vh4BF7UtWxwg` // Basic authentication with username and password
// // //                 }
// // //             }
// // //         )
// // //             .then(response => {
// // //                 this.setState({
// // //                     accessToken: response.data.access_token
// // //                 });

// // //                 // Use the access token in subsequent requests
// // //                 axios.post('https://api.sandbox.paypal.com/v1/payments/payment', dataDetail,
// // //                     {
// // //                         headers: {
// // //                             'Content-Type': 'application/json',
// // //                             'Authorization': `Bearer A21AAI6WHEvooeG2FWeGmXW6Ttsk_jjHKXcAnRgWjxIerAG6m-vD-mr1wRH73EGik0MSmwclOGK2sUGMVV6j4Vh4BF7UtWxwg` // Use Bearer authentication with the access token
// // //                         }
// // //                     }
// // //                 )
// // //                     .then(response => {
// // //                         const { id, links } = response.data;
// // //                         const approvalUrl = links.find(data => data.rel == "approval_url");

// // //                         this.setState({
// // //                             paymentId: id,
// // //                             approvalUrl: approvalUrl.href
// // //                         });
// // //                     })
// // //                     .catch(err => {
// // //                         console.log({ ...err });
// // //                     });
// // //             })
// // //             .catch(err => {
// // //                 console.log({ ...err });
// // //             });
// // //     }

// // //     _onNavigationStateChange = (webViewState) => {
// // //         if (webViewState.url.includes('https://example.com/')) {
// // //             this.setState({
// // //                 approvalUrl: null
// // //             });

// // //             const { PayerID, paymentId } = webViewState.url;

// // //             axios.post(`https://api.sandbox.paypal.com/v1/payments/payment/${paymentId}/execute`, { payer_id: PayerID },
// // //                 {
// // //                     headers: {
// // //                         'Content-Type': 'application/json',
// // //                         'Authorization': `Bearer A21AAI6WHEvooeG2FWeGmXW6Ttsk_jjHKXcAnRgWjxIerAG6m-vD-mr1wRH73EGik0MSmwclOGK2sUGMVV6j4Vh4BF7UtWxwg`
// // //                     }
// // //                 }
// // //             )
// // //                 .then(response => {
// // //                     console.log(response);
// // //                 })
// // //                 .catch(err => {
// // //                     console.log({ ...err });
// // //                 });
// // //         }
// // //     }

// // //     render() {
// // //         const { approvalUrl } = this.state;
// // //         return (
// // //             <View style={{ flex: 1 }}>
// // //                 {
// // //                     approvalUrl ? <WebView
// // //                         style={{ height: 400, width: 300 }}
// // //                         source={{ uri: approvalUrl }}
// // //                         onNavigationStateChange={this._onNavigationStateChange}
// // //                         javaScriptEnabled={true}
// // //                         domStorageEnabled={true}
// // //                         startInLoadingState={false}
// // //                        // style={{ marginTop: 20 }}
// // //                     /> : <ActivityIndicator />
// // //                 }
// // //             </View>
// // //         );
// // //     }
// // // }




// // // // import React, { Component } from 'react'
// // // // import {
// // // //     View,
// // // //     WebView,
// // // //     ActivityIndicator
// // // // } from 'react-native'
// // // // import axios from 'axios'
// // // // const username = 'AUwXqWhwfPhhwz6Sl16WTwrssmFCAmt7P1V6Bx7jbSzsVqLWt2cWvKecQziJUbeQtLcrGtJmOKPmqe_f';
// // // // const password = 'EO7DEJynzypNjRcjU0v5Hy3L2UH8CMcxMhSLoD-P0hw3_jv1vmYka0hQR6MzYKWnd72snOOwL0-wxNYI';
// // // // const base64Credentials = btoa(`${username}:${password}`);
// // // // export default class PayWithCard extends Component {

  
// // // //     state = {
// // // //         accessToken: null,
// // // //         approvalUrl: null,
// // // //         paymentId: null
// // // //     }

// // // //     componentDidMount() {
// // // //         let currency = '100 USD'
// // // //         currency.replace(" USD", "")

// // // //         const dataDetail = {
// // // //             "intent": "sale",
// // // //             "payer": {
// // // //                 "payment_method": "paypal"
// // // //             },
// // // //             "transactions": [{
// // // //                 "amount": {
// // // //                     "total": currency,
// // // //                     "currency": "THB",
// // // //                     "details": {
// // // //                         "subtotal": currency,
// // // //                         "tax": "0",
// // // //                         "shipping": "0",
// // // //                         "handling_fee": "0",
// // // //                         "shipping_discount": "0",
// // // //                         "insurance": "0"
// // // //                     }
// // // //                 }

// // // //             }],
// // // //             "redirect_urls": {
// // // //                 "return_url": "https://example.com",
// // // //                 "cancel_url": "https://example.com"
// // // //             }
// // // //         }

// // // //         axios.post('https://api.sandbox.paypal.com/v1/oauth2/token', { grant_type: 'client_credentials' },
// // // //             {
// // // //                 headers: {
// // // //                     'Content-Type': 'application/x-www-form-urlencoded',
// // // //                     'Authorization': `Basic ${base64Credentials}`
// // // //                 }
// // // //             }
// // // //         )
// // // //             .then(response => {
// // // //                 this.setState({
// // // //                     accessToken: response.data.access_token
// // // //                 })

// // // //                 axios.post('https://api.sandbox.paypal.com/v1/payments/payment', dataDetail,
// // // //                     {
// // // //                         headers: {
// // // //                             'Content-Type': 'application/json',
// // // //                             'Authorization': `Bearer ${this.state.accessToken}`
// // // //                         }
// // // //                     }
// // // //                 )
// // // //                     .then(response => {

// // // //                         const { id, links } = response.data
// // // //                         const approvalUrl = links.find(data => data.rel == "approval_url")

// // // //                         this.setState({
// // // //                             paymentId: id,
// // // //                             approvalUrl: approvalUrl.href
// // // //                         })
// // // //                     }).catch(err => {
// // // //                         console.log({ ...err })
// // // //                     })
// // // //             }).catch(err => {
// // // //                 console.log({ ...err })
// // // //             })

// // // //     }

// // // //     _onNavigationStateChange = (webViewState) => {

// // // //         if (webViewState.url.includes('https://example.com/')) {

// // // //             this.setState({
// // // //                 approvalUrl: null
// // // //             })

// // // //             const { PayerID, paymentId } = webViewState.url

// // // //             axios.post(`https://api.sandbox.paypal.com/v1/payments/payment/${paymentId}/execute`, { payer_id: PayerID },
// // // //                 {
// // // //                     headers: {
// // // //                         'Content-Type': 'application/json',
// // // //                         'Authorization': `Bearer ${this.state.accessToken}`
// // // //                     }
// // // //                 }
// // // //             )
// // // //                 .then(response => {
// // // //                     console.log(response)

// // // //                 }).catch(err => {
// // // //                     console.log({ ...err })
// // // //                 })

// // // //         }
// // // //     }

// // // //     render() {

// // // //         const { approvalUrl } = this.state
// // // //         return (
// // // //             <View style={{ flex: 1 }}>
// // // //                 {
// // // //                     approvalUrl ? <WebView
// // // //                         style={{ height: 400, width: 300 }}
// // // //                         source={{ uri: approvalUrl }}
// // // //                         onNavigationStateChange={this._onNavigationStateChange}
// // // //                         javaScriptEnabled={true}
// // // //                         domStorageEnabled={true}
// // // //                         startInLoadingState={false}
// // // //                        // style={{ marginTop: 20 }}
// // // //                     /> : <ActivityIndicator />
// // // //                 }
// // // //             </View>
// // // //         )
// // // //     }
// // // // }


// // // // // import React, { useEffect,useState } from 'react';
// // // // // import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList,Pressable } from 'react-native';
// // // // // import { PayPalScriptProvider } from '@paypal/react-paypal-js';
// // // // // import { PayPalButtons } from '@paypal/react-paypal-js';
// // // // // import Icon from 'react-native-vector-icons/FontAwesome';


// // // // // const PayWithCard = ({navigation}) =>{

// // // // //   const [error, setError] = useState(null);

// // // // //   useEffect(() => {
// // // // //     const script = document.createElement('script');
// // // // //     script.src = `https://www.paypal.com/sdk/js?client-id=AX8P_k3dNT8FJcVSr_qqFFxbUuRSO6C1W6XJ_eOylME1W8aCvRltDO0AWFAOgA-srgbpw9rHeWtFZ9Pd`;
// // // // //     script.addEventListener('load', () => {
// // // // //       window.paypal.Buttons().render('#paypal-button');
// // // // //     });
// // // // //     document.body.appendChild(script);
// // // // //   }, []);

// // // // //   // const createOrder = (data, actions) => {
// // // // //   //   return actions.order.create({
// // // // //   //     purchase_units: [
// // // // //   //       {
// // // // //   //         amount: {
// // // // //   //           currency_code: 'USD',
// // // // //   //           value: amount,
// // // // //   //         },
// // // // //   //       },
// // // // //   //     ],
// // // // //   //   });
// // // // //   // };

// // // // //   const onApprove = (data, actions) => {
// // // // //     return actions.order.capture().then((details) => {
// // // // //       firebase.firestore().collection('payments').add({
// // // // //         payerId: details.payer.payer_id,
// // // // //         purchaseAmount: amount,
// // // // //         create_time: details.create_time,
// // // // //       }).then(() => {
// // // // //         navigation.navigate('ConfirmationScreen');
// // // // //       }).catch((error) => {
// // // // //         setError(error.message);
// // // // //       });
// // // // //     });
// // // // //   };

// // // // //   const onError = (err) => {
// // // // //     setError(err.message);
// // // // //   };

// // // // //   return (
// // // // //     <View style={styles.container}>
// // // // //       {/* <TextInput
// // // // //         style={styles.input}
// // // // //         placeholder="Enter Amount"
// // // // //         keyboardType="decimal-pad"
// // // // //         onChangeText={setAmount}
// // // // //         value={amount}
// // // // //       /> */}
// // // // //       {error && <Text style={styles.error}>{error}</Text>}
// // // // //       <PayPalScriptProvider
// // // // //         options={{ "client-id": "AX8P_k3dNT8FJcVSr_qqFFxbUuRSO6C1W6XJ_eOylME1W8aCvRltDO0AWFAOgA-srgbpw9rHeWtFZ9Pd" }}
// // // // //       >
// // // // //         <PayPalButtons
// // // // //           // createOrder={createOrder}
// // // // //           onApprove={onApprove}
// // // // //           onError={onError}
// // // // //         />
// // // // //       </PayPalScriptProvider>
// // // // //       {/* <View style={styles.paypalContainer}>
// // // // //         <View style={styles.paypalButton} id="paypal-button"></View>
// // // // //       </View> */}
// // // // //       <View style={styles.NavContainer} >
// // // // //                <View style={styles.Navbar} >
// // // // //                <Pressable onPress={() => navigation.navigate("PayPalScreen")} style={styles.iconBehave} >
// // // // //                        <Icon name="cube" size={30} color="#FFDE9B" />
// // // // //                    </Pressable>
// // // // //                    <Pressable onPress={() => navigation.navigate("Favorite")} style={styles.iconBehave} >
// // // // //                        <Icon name="heart" size={30} color="gray" />
// // // // //                    </Pressable>
// // // // //                    <Pressable onPress={() => navigation.navigate("profile")} style={styles.iconBehave}>
// // // // //                        <Icon name="user" size={30} color="gray" />
// // // // //                    </Pressable>
// // // // //                    <Pressable onPress={() => navigation.navigate("Home")} style={styles.iconBehave} >
// // // // //                        <Icon name="home" size={30} color="gray" />
// // // // //                    </Pressable>
// // // // //                </View>
// // // // //                </View>
// // // // //     </View>
// // // // //       );
// // // // //     }
// // // // //     const styles = StyleSheet.create({
// // // // //       container: {
// // // // //         flex: 1,
// // // // //         justifyContent: 'center',
// // // // //         alignItems: 'center',
// // // // //         backgroundColor: '#fff',
// // // // //       },
// // // // //       input: {
// // // // //         height: 40,
// // // // //         margin: 12,
// // // // //         borderWidth: 1,
// // // // //         padding: 10,
// // // // //         width: '80%',
// // // // //       },
// // // // //       error: {
// // // // //         color: 'red',
// // // // //         marginBottom: 10,
// // // // //       },
// // // // //       paypalContainer: {
// // // // //         display: 'flex',
// // // // //         justifyContent: 'center',
// // // // //         alignItems: 'center',
// // // // //         marginTop: 10,
// // // // //         marginBottom: 10,
// // // // //       },
// // // // //       paypalButton: {
// // // // //         height: 50,
// // // // //         color: 'blue',
// // // // //       },
// // // // //       NavContainer: {
// // // // //         position:'absolute',
// // // // //         alignItems:'center',
// // // // //         bottom:10,
// // // // //         padding:10, 
// // // // //         borderBottomLeftRadius: 20,
// // // // //         borderBottomRightRadius: 20,
// // // // //      },
// // // // //      Navbar: {
// // // // //       flexDirection: 'row',
// // // // //       backgroundColor:'#131A2C',
// // // // //       width:395,
// // // // //       justifyContent:'space-evenly',
// // // // //       borderRadius:30,
// // // // //       height:50
      
// // // // //    },
// // // // //      iconBehave:{
// // // // //       padding:44,
// // // // //       bottom:35
// // // // //    },
// // // // //     });
    

// // // // // export default PayWithCard ;



// // // // // // // PayWithCard.js

// // // // // import React, { useState } from 'react';
// // // // // import { View, Text, StyleSheet, Pressable } from 'react-native';
// // // // // import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-native-sdk';
// // // // // import Icon from 'react-native-vector-icons/FontAwesome';

// // // // // const PayWithCard = ({ navigation }) => {
// // // // //   const [error, setError] = useState(null);

// // // // //   const onApprove = (data, actions) => {
// // // // //     // Handle payment approval
// // // // //     console.log('Payment approved:', data);
// // // // //   };

// // // // //   const onError = (err) => {
// // // // //     setError(err.message);
// // // // //   };

// // // // //   return (
// // // // //     <View style={styles.container}>
// // // // //       {error && <Text style={styles.error}>{error}</Text>}
// // // // //       <PayPalScriptProvider
// // // // //         options={{ "client-id": "AUwXqWhwfPhhwz6Sl16WTwrssmFCAmt7P1V6Bx7jbSzsVqLWt2cWvKecQziJUbeQtLcrGtJmOKPmqe_f" }} // Replace with your PayPal client ID
// // // // //       >
// // // // //         <PayPalButtons
// // // // //           style={styles.paypalButton}
// // // // //           onApprove={onApprove}
// // // // //           onError={onError}
// // // // //         />
// // // // //       </PayPalScriptProvider>
// // // // //       <View style={styles.NavContainer}>
// // // // //         <View style={styles.Navbar}>
// // // // //           <Pressable onPress={() => navigation.navigate("PayPalScreen")} style={styles.iconBehave}>
// // // // //             <Icon name="cube" size={30} color="#FFDE9B" />
// // // // //           </Pressable>
// // // // //           <Pressable onPress={() => navigation.navigate("Favorite")} style={styles.iconBehave}>
// // // // //             <Icon name="heart" size={30} color="gray" />
// // // // //           </Pressable>
// // // // //           <Pressable onPress={() => navigation.navigate("profile")} style={styles.iconBehave}>
// // // // //             <Icon name="user" size={30} color="gray" />
// // // // //           </Pressable>
// // // // //           <Pressable onPress={() => navigation.navigate("Home")} style={styles.iconBehave}>
// // // // //             <Icon name="home" size={30} color="gray" />
// // // // //           </Pressable>
// // // // //         </View>
// // // // //       </View>
// // // // //     </View>
// // // // //   );
// // // // // }

// // // // // const styles = StyleSheet.create({
// // // // //   container: {
// // // // //     flex: 1,
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //     backgroundColor: '#fff',
// // // // //   },
// // // // //   error: {
// // // // //     color: 'red',
// // // // //     marginBottom: 10,
// // // // //   },
// // // // //   paypalButton: {
// // // // //     height: 50,
// // // // //     width: 300, // Set the width as per your requirement
// // // // //   },
// // // // //   NavContainer: {
// // // // //     position: 'absolute',
// // // // //     alignItems: 'center',
// // // // //     bottom: 10,
// // // // //     padding: 10,
// // // // //     borderBottomLeftRadius: 20,
// // // // //     borderBottomRightRadius: 20,
// // // // //   },
// // // // //   Navbar: {
// // // // //     flexDirection: 'row',
// // // // //     backgroundColor: '#131A2C',
// // // // //     width: 395,
// // // // //     justifyContent: 'space-evenly',
// // // // //     borderRadius: 30,
// // // // //     height: 50,
// // // // //   },
// // // // //   iconBehave: {
// // // // //     padding: 44,
// // // // //     bottom: 35
// // // // //   },
// // // // // });

// // // // // // export default PayWithCard;

// // // // // import React from 'react';
// // // // // import { View, Text, StyleSheet } from 'react-native';

// // // // // const PayWithCard = () => {
// // // // //   return (
// // // // //     <View style={styles.container}>
// // // // //       <Text style={styles.text}>You are paid</Text>
// // // // //     </View>
// // // // //   );
// // // // // };

// // // // // const styles = StyleSheet.create({
// // // // //   container: {
// // // // //     flex: 1,
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //   },
// // // // //   text: {
// // // // //     fontSize: 20,
// // // // //     fontWeight: 'bold',
// // // // //   },
// // // // // });

// // // // // export default PayWithCard;
