
import Welcome from './pages/Welcome';
import LoginScreen from './pages/LoginScreen'
import SignUpScreen from './pages/SignUpScreen'
import HomeScreen from './pages/HomeScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Adminprofile from './adminPages/adminprofile';
import Favorite from './pages/favorite';
import Profile from './pages/profile';
import Userr from './adminPages/userr';

import { AdminWomanDetails, AdminProductsListWoman } from './adminPages/adminWoman' ;
import { AdminBabyDetails, AdminProductsListBaby }  from './adminPages/adminBaby' ;
import { AdminKidsDetails, AdminProductsListKids } from './adminPages/adminKids' ;
import { EditProductPage , AdminMenDetails, AdminProductsListMen } from './adminPages/adminMen' ;

import Checkout from './pages/checkout';
import EditProfile from './pages/EditProfile';
import AddProductForm from './adminPages/AddProductForm';
// import products from './pages/AddProducts';

import { OfferDetailsAdmin, ProductsListOfferAdmin, EditOfferPage } from './adminPages/OfferAdmin';
import CartScreen from './pages/CartScreen'
import AdminHome from './adminPages/adminHome'
import Addadmin from './adminPages/addAdmin';
import Plusbutton from './adminPages/plusbutton';
import BottomNavigator from './components/bar';
import AddReviewWoman from './pages/AddReviews/AddReview-woman';
import AddReviewMen from './pages/AddReviews/AddReview-men';
import AddReviewKids from './pages/AddReviews/AddReview-kids';
import AddReviewBaby from './pages/AddReviews/AddReview-baby';
import {Category,  CatigoryResult } from './pages/catigory';
import Admincategory from './adminPages/admincatigory';
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
import Waitingitem from './adminPages/waitingitem';
import Offer from './pages/offers';
import RecentlyVisited from './pages/RecentlyVisited';
import AddressScreen from './pages/AddressScreen';
import AddressInformation from './pages/AddressInformation';
import AboutUs from './pages/AboutUs';
import Pay from './pages/pay';
import CreditCard from './pages/CreditCard';
import { Recycle, RecycleDetails } from './pages/Catigory/Recycle';
import AddUserProduct from './pages/Catigory/AddUserProduct';
import suggestions from './pages/suggestions';
import weathersearch from './pages/weathersearch' ;
const Stack = createNativeStackNavigator();
export default function App() {
  return (

    <NavigationContainer>

      <Stack.Navigator initialRouteName="Welcome">
      <Stack.Screen name="weathersearch" component={weathersearch} />

      <Stack.Screen name="suggestions" component={suggestions} />

      <Stack.Screen name="PurchasedProductsScreen" component={PurchasedProductsScreen} />
<Stack.Screen name='waitingitem' component={Waitingitem}/>
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
        <Stack.Screen name='CreditCard' component={CreditCard}/> 
        <Stack.Screen name='OrderHistory' component={OrderHistory}/>
        <Stack.Screen name="AddProductForm" component={AddProductForm} />
        <Stack.Screen name="AddUserProduct" component={AddUserProduct} />
        <Stack.Screen name="favorite" component={Favorite} />
        <Stack.Screen name='HistoryOrder' component={HistoryOrder}/>
        <Stack.Screen name='WaitingOrder' component={WaitingOrder}/>
        <Stack.Screen name='CancelOrder' component={CancelOrder}/>
        <Stack.Screen name="pay" component={Pay} />
        <Stack.Screen name="Used" component={Recycle} /> 
        <Stack.Screen name="RecycleDetails" component={RecycleDetails} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="adminprofile" component={Adminprofile} />
        {/* <Stack.Screen name="products" component={products} /> */}
        <Stack.Screen name="CartScreen" component={CartScreen} />
        <Stack.Screen name="adminHome" component={ AdminHome }/>
        <Stack.Screen name="OfferDetailsAdmin" component={ OfferDetailsAdmin }/>
        <Stack.Screen name="adminOffer" component={ ProductsListOfferAdmin }/>
        <Stack.Screen name="EditOfferPage" component={ EditOfferPage }/>
        <Stack.Screen name="profile" component={ Profile }/>
        <Stack.Screen name="catigory" component={ Category }/>
        <Stack.Screen name="admincatigory" component={Admincategory }/>
       
        <Stack.Screen name="EditProfile" component={ EditProfile }/>
        <Stack.Screen name="DeleteAccount" component={ DeleteAccount }/>
        <Stack.Screen name="addadmin" component={ Addadmin }/>
        <Stack.Screen name="plusbutton" component={ Plusbutton }/>
        <Stack.Screen name="checkout" component={ Checkout }/>
        <Stack.Screen name=" BottomNavigator" component={  BottomNavigator }/>
        <Stack.Screen name="SearchResultsPage" component={ ProductPage }/>
        <Stack.Screen name="offer" component={ Offer }/>
        <Stack.Screen name="categoryresult" component= {CatigoryResult}/>
        <Stack.Screen name="RecentlyVisited" component={ RecentlyVisited }/>
        <Stack.Screen name="AddressScreen" component={ AddressScreen }/>
        <Stack.Screen name="AddressInformation" component={ AddressInformation }/>
        <Stack.Screen name="AboutUs" component={ AboutUs }/>
        <Stack.Screen name="userr" component={ Userr }/>
        <Stack.Screen name="adminWOMAN" component={AdminProductsListWoman} />
        <Stack.Screen name="adminWomanDetails" component={AdminWomanDetails} />
        <Stack.Screen name="adminBABY" component={AdminProductsListBaby} />
        <Stack.Screen name="adminBabyDetails" component={AdminBabyDetails} />
        <Stack.Screen name="adminKIDS" component={AdminProductsListKids} />
        <Stack.Screen name="adminKidsDetails" component={AdminKidsDetails} />
        <Stack.Screen name="adminMEN" component={AdminProductsListMen} />
        <Stack.Screen name="adminMenDetails" component={AdminMenDetails} />
        <Stack.Screen name="EditProductPage" component={EditProductPage} />
    
      </Stack.Navigator>
    </NavigationContainer>
  );
}

