import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Welcome from './pages/Welcome';
import LoginScreen from './pages/LoginScreen'
import SignUpScreen from './pages/SignUpScreen'
import HomeScreen from './pages/HomeScreen';
import {NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import profile from './pages/profile'
import Favorite from './pages/Favorite';
import AddProductForm from './pages/AddProductForm';
import{ProductsListPizza,PizzaDetails} from './pages/ProductsListPizza'
import AddProducts from './pages/AddProducts';
const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="AddProducts">
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Favorite" component={Favorite} />
        <Stack.Screen name ="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="profile" component={profile}  />
        <Stack.Screen name="AddProductForm" component={AddProductForm} />
        <Stack.Screen name="PizzaDetails" component={PizzaDetails}  />
        <Stack.Screen name="ProductsListPizza" component={ProductsListPizza} />
        <Stack.Screen name="AddProducts" component={AddProducts} />

       
      </Stack.Navigator>
    </NavigationContainer>
  );
}