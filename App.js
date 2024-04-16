
import Welcome from './pages/Welcome';
import LoginScreen from './pages/LoginScreen'
import SignUpScreen from './pages/SignUpScreen'
import HomeScreen from './pages/HomeScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import adminprofile from './adminPages/adminprofile';
import favorite from './pages/favorite';
import profile from './pages/profile';
import { adminBurgerDetails, adminProductsListBurger, EditProductPage } from './adminPages/adminBurger'
import { CoffeeDetailsAdmin, ProductsListCoffeeAdmin, EditCoffeePage } from './adminPages/adminDrink';
import { PizzaDetailsAdmin, ProductsListPizzaAdmin, EditPizzaPage } from './adminPages/adminPizza';
import Checkout from './pages/Checkout';
import EditProfile from './pages/EditProfile';
import AddProductForm from './adminPages/AddProductForm';
import products from './pages/AddProducts'

import { OfferDetailsAdmin, ProductsListOfferAdmin, EditOfferPage } from './adminPages/OfferAdmin';
import CartScreen from './pages/CartScreen'
import adminHome from './adminPages/adminHome'
import addadmin from './adminPages/addAdmin';
import plusbutton from './adminPages/plusbutton';
import BottomNavigator from './components/bar';
import AddReviewWoman from './pages/AddReviews/AddReview-woman';
import AddReviewMen from './pages/AddReviews/AddReview-men';
import AddReviewKids from './pages/AddReviews/AddReview-kids';
import AddReviewBaby from './pages/AddReviews/AddReview-baby';
import category from './pages/catigory';
import DeleteAccount from './pages/DeleteAccount';
// import MapScreen from './pages/MapScreen';
import OrderHistory from './pages/OrderHistory';
import AddProducts from './pages/AddProducts';
import AllReviewsPage from './pages/Catigory/AllReviewsPage';
import {WomanDetails, ProductsListWoman } from './pages/Catigory/Woman';
import { MenDetails,ProductsListMen } from './pages/Catigory/Men';
import { KidsDetails,ProductsListKids } from './pages/Catigory/Kids';
import { BabyDetails,ProductsListBaby } from './pages/Catigory/Baby';
import PayWithCard from './pages/PayWithCard';
const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
      <Stack.Screen name="PayWithCard" component={PayWithCard} />
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="WOMAN" component={ProductsListWoman} />
        <Stack.Screen name="WomanDetails" component={WomanDetails} />
        <Stack.Screen name='AddReviewWoman' component={AddReviewWoman}/>
        <Stack.Screen name="MEN" component={ProductsListMen} />
        <Stack.Screen name="MenDetails" component={MenDetails} />
        <Stack.Screen name='AddReviewMen' component={AddReviewMen}/>
        <Stack.Screen name="KIDS" component={ProductsListKids} />
        <Stack.Screen name="KidsDetails" component={KidsDetails} />
        <Stack.Screen name='AddReviewKids' component={AddReviewKids}/>
        <Stack.Screen name="BABY" component={ProductsListBaby} />
        <Stack.Screen name="BabyDetails" component={BabyDetails} />
        <Stack.Screen name='AddReviewBaby' component={AddReviewBaby}/>
        <Stack.Screen name="AllReviewsPage" component={AllReviewsPage} />
        <Stack.Screen name="adminBurgers" component={adminProductsListBurger} />
        <Stack.Screen name='AddProducts' component={AddProducts}/>
        <Stack.Screen name='OrderHistory' component={OrderHistory}/>
        <Stack.Screen name="AddProductForm" component={AddProductForm} />
        <Stack.Screen name="adminBurgerDetails" component={adminBurgerDetails}  />
        <Stack.Screen name="favorite" component={favorite} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="adminprofile" component={adminprofile} />
        <Stack.Screen name="products" component={products} />
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
        <Stack.Screen name="catigory" component={ category }/>
        <Stack.Screen name="EditProfile" component={ EditProfile }/>
        <Stack.Screen name="DeleteAccount" component={ DeleteAccount }/>
        <Stack.Screen name="adminPizza" component={ ProductsListPizzaAdmin }/>
        <Stack.Screen name="EditPizzaPage" component={ EditPizzaPage }/>
        <Stack.Screen name="addadmin" component={ addadmin }/>
        <Stack.Screen name="plusbutton" component={ plusbutton }/>
        <Stack.Screen name="checkout" component={ Checkout }/>
        <Stack.Screen name=" BottomNavigator" component={  BottomNavigator }/>

      </Stack.Navigator>
    </NavigationContainer>
  );
}