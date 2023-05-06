import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Welcome from './pages/Welcome';
import LoginScreen from './pages/LoginScreen'
import SignUpScreen from './pages/SignUpScreen'
import HomeScreen from './pages/HomeScreen';
import {NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import profile from './pages/profile'
import Favorite from './pages/favorite';
import PayPalScreen from './pages/PayPalScreen' ;

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Favorite" component={Favorite} />
        <Stack.Screen name ="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="profile" component={profile}  />
        <Stack.Screen name="PayPalScreen" component={PayPalScreen}  />

      </Stack.Navigator>
    </NavigationContainer>
  );
}