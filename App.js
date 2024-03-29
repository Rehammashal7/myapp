import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Welcome from './pages/Welcome';
import LoginScreen from './pages/LoginScreen'
import SignUpScreen from './pages/SignUpScreen'
import HomeScreen from './pages/HomeScreen';
import {NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import adminprofile from './adminPages/adminprofile';
import favorite from './pages/favorite';
import profile from'./pages/profile';
import  { BurgerDetails, ProductsListBurger } from './pages/Burgers';
import  { CoffeeDetails, ProductsListCoffee } from './pages/Drink';
import  { adminBurgerDetails, adminProductsListBurger ,EditProductPage} from './adminPages/adminBurger'
import  { CoffeeDetailsAdmin, ProductsListCoffeeAdmin,EditCoffeePage } from './adminPages/adminDrink';
import { PizzaDetailsAdmin, ProductsListPizzaAdmin,EditPizzaPage } from './adminPages/adminPizza';
import Checkout from './pages/checkout';
import { PizzaDetails, ProductsListPizza } from './pages/ProductsListPizza';
import AddProductForm from './adminPages/AddProductForm';
import products from './pages/AddProducts'
import { OfferDetails, ProductsListOffer } from './pages/Offers';
import { OfferDetailsAdmin, ProductsListOfferAdmin ,EditOfferPage} from './adminPages/OfferAdmin';
import CartScreen from './pages/CartScreen'
import adminHome from './adminPages/adminHome'
import addadmin from './adminPages/addAdmin' ;
import plusbutton from './adminPages/plusbutton';
import BottomNavigator from './components/bar';
import adminReports from './adminPages/PurchasedProducts';
import AddReview from './pages/AddReview';
import OrderHistory from './pages/OrderHistory';

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="MEN" component={ProductsListBurger} />
        <Stack.Screen name="adminBurgers" component={adminProductsListBurger} />
        <Stack.Screen name="KIDS" component={ProductsListCoffee} />
        <Stack.Screen name="BABY" component={ProductsListOffer} />
        <Stack.Screen name='AddReview' component={AddReview}/>

        <Stack.Screen name="AddProductForm" component={AddProductForm} />
        <Stack.Screen name="PizzaDetails" component={PizzaDetails}  />
        <Stack.Screen name="OfferDetails" component={OfferDetails}  />
        <Stack.Screen name="CoffeeDetails" component={CoffeeDetails}  />
        <Stack.Screen name="BurgerDetails" component={BurgerDetails}  />
        <Stack.Screen name="adminBurgerDetails" component={adminBurgerDetails}  />
        <Stack.Screen name="WOMAN" component={ProductsListPizza} />
        <Stack.Screen name="favorite" component={favorite} />
        <Stack.Screen name ="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="adminprofile" component={adminprofile}  />
        <Stack.Screen name="products" component={products}  />
        <Stack.Screen name="CartScreen" component={CartScreen} />
        <Stack.Screen name="AddProductForm " component={AddProductForm } /> 
        <Stack.Screen name="adminHome" component={ adminHome }/>
        <Stack.Screen name="EditProductPage" component={ EditProductPage }/>
        <Stack.Screen name="OfferDetailsAdmin" component={ OfferDetailsAdmin }/>
        <Stack.Screen name="adminOffer" component={ ProductsListOfferAdmin }/>
        <Stack.Screen name="EditOfferPage" component={ EditOfferPage }/>
        <Stack.Screen name="CoffeeDetailsAdmin" component={ CoffeeDetailsAdmin }/>
        <Stack.Screen name="adminCoffee" component={ ProductsListCoffeeAdmin }/>
        <Stack.Screen name="EditCoffeePage" component={ EditCoffeePage }/>
        <Stack.Screen name="PizzaDetailsAdmin" component={ PizzaDetailsAdmin }/>
        <Stack.Screen name="profile" component={ profile }/>
        <Stack.Screen name="OrderHistory" component={OrderHistory}/>
        <Stack.Screen name="adminPizza" component={ ProductsListPizzaAdmin }/>
        <Stack.Screen name="EditPizzaPage" component={ EditPizzaPage }/>

        <Stack.Screen name="addadmin" component={ addadmin }/>
        <Stack.Screen name="plusbutton" component={ plusbutton }/>
        <Stack.Screen name="checkout" component={ Checkout }/>
        <Stack.Screen name=" BottomNavigator" component={  BottomNavigator }/>     
           <Stack.Screen name="adminReports" component={ adminReports }/>

      </Stack.Navigator>
    </NavigationContainer>
  );
}