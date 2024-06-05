
import Welcome from './pages/Welcome';
import LoginScreen from './pages/LoginScreen'
import SignUpScreen from './pages/SignUpScreen'
import HomeScreen from './pages/HomeScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Adminprofile from './adminPages/Adminprofile';
import Favorite from './pages/Favorite';
import Profile from './pages/Profile';
import Userr from './adminPages/Userr';

import {AdminWomanDetails, AdminProductsListWoman } from './adminPages/AdminWoman' ;
import { AdminBabyDetails,AdminProductsListBaby }  from './adminPages/AdminBaby' ;
import { AdminKidsDetails,AdminProductsListKids } from './adminPages/AdminKids' ;
import { EditProductPage ,AdminMenDetails,AdminProductsListMen } from './adminPages/AdminMen' ;

import Checkout from './pages/Checkout';
import EditProfile from './pages/EditProfile';
import AddProductForm from './adminPages/AddProductForm';
// import products from './pages/AddProducts';

import { OfferDetailsAdmin, ProductsListOfferAdmin, EditOfferPage } from './adminPages/OfferAdmin';
import CartScreen from './pages/CartScreen'
import AdminHome from './adminPages/AdminHome'
import Addadmin from './adminPages/AddAdmin';
import Plusbutton from './adminPages/Plusbutton';
import BottomNavigator from './components/Bar';
import AddReviewWoman from './pages/AddReviews/AddReview-woman';
import AddReviewMen from './pages/AddReviews/AddReview-men';
import AddReviewKids from './pages/AddReviews/AddReview-kids';
import AddReviewBaby from './pages/AddReviews/AddReview-baby';
import {Category,  CatigoryResult } from './pages/Catigory';import admincategory from './adminPages/Admincatigory';
import DeleteAccount from './pages/DeleteAccount';
import OrderHistory from './pages/OrderHistory';
import HistoryOrder from './pages/Orders/HistoryOrder';
import WaitingOrder from './pages/Orders/WaitingOrder';
import CancelOrder from './pages/Orders/CancelOrder';
//import AddProducts from './pages/AddProducts';
import AllReviewsPage from './pages/Catigory/AllReviewsPage';
import {WomanDetails, ProductsListWoman } from './pages/Catigory/Woman';
import { MenDetails,ProductsListMen } from './pages/Catigory/Men';
import { KidsDetails,ProductsListKids } from './pages/Catigory/Kids';
import { BabyDetails,ProductsListBaby } from './pages/Catigory/Baby';
import PayWithCard from './pages/PayWithCard';
import ProductPage from './pages/ResultSearch';
import PurchasedProductsScreen from './adminPages/PurchasedProducts';
import waitingitem from './adminPages/Waitingitem';
import Offer from './pages/Offers';
import RecentlyVisited from './pages/RecentlyVisited';
import AddressScreen from './pages/AddressScreen';
import AddressInformation from './pages/AddressInformation';
import AboutUs from './pages/AboutUs';
import Pay from './pages/Pay';
const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
      <Stack.Screen name="PurchasedProductsScreen" component={PurchasedProductsScreen} />
<Stack.Screen name='waitingitem' component={waitingitem}/>
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
        {/* { <Stack.Screen name='AddProducts' component={AddProducts}/> } */}
        <Stack.Screen name='OrderHistory' component={OrderHistory}/>
        <Stack.Screen name="AddProductForm" component={AddProductForm} />
        <Stack.Screen name="Favorite" component={Favorite} />
        <Stack.Screen name='HistoryOrder' component={HistoryOrder}/>
        <Stack.Screen name='WaitingOrder' component={WaitingOrder}/>
        <Stack.Screen name='CancelOrder' component={CancelOrder}/>
        <Stack.Screen name="Pay" component={Pay} />
        
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="adminprofile" component={Adminprofile} />
        {/* <Stack.Screen name="products" component={products} /> */}
        <Stack.Screen name="CartScreen" component={CartScreen} />
        <Stack.Screen name="adminHome" component={ AdminHome }/>
        <Stack.Screen name="OfferDetailsAdmin" component={ OfferDetailsAdmin }/>
        <Stack.Screen name="adminOffer" component={ ProductsListOfferAdmin }/>
        <Stack.Screen name="EditOfferPage" component={ EditOfferPage }/>
        <Stack.Screen name="Profile" component={ Profile }/>
        <Stack.Screen name="Catigory" component={ Category }/>
        <Stack.Screen name="admincatigory" component={admincategory }/>
       
        <Stack.Screen name="EditProfile" component={ EditProfile }/>
        <Stack.Screen name="DeleteAccount" component={ DeleteAccount }/>
        <Stack.Screen name="Addadmin" component={ Addadmin }/>
        <Stack.Screen name="Plusbutton" component={ Plusbutton }/>
        <Stack.Screen name="Checkout" component={ Checkout }/>
        <Stack.Screen name=" BottomNavigator" component={  BottomNavigator }/>
        <Stack.Screen name="SearchResultsPage" component={ ProductPage }/>
        <Stack.Screen name="Offer" component={ Offer }/>
        <Stack.Screen name="Categoryresult" component= {CatigoryResult}/>
        <Stack.Screen name="RecentlyVisited" component={ RecentlyVisited }/>
        <Stack.Screen name="AddressScreen" component={ AddressScreen }/>
        <Stack.Screen name="AddressInformation" component={ AddressInformation }/>
        <Stack.Screen name="AboutUs" component={ AboutUs }/>







        <Stack.Screen name="Userr" component={ Userr }/>
        <Stack.Screen name="AdminWOMAN" component={AdminProductsListWoman} />
        <Stack.Screen name="AdminWomanDetails" component={AdminWomanDetails} />
        <Stack.Screen name="AdminBABY" component={AdminProductsListBaby} />
        <Stack.Screen name="AdminBabyDetails" component={AdminBabyDetails} />
        <Stack.Screen name="AdminKIDS" component={AdminProductsListKids} />
        <Stack.Screen name="AdminKidsDetails" component={AdminKidsDetails} />
        <Stack.Screen name="AdminMEN" component={AdminProductsListMen} />
        <Stack.Screen name="AdminMenDetails" component={AdminMenDetails} />
        <Stack.Screen name="EditProductPage" component={EditProductPage} />
    
      </Stack.Navigator>
    </NavigationContainer>
  );
}

