import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import LoginScreen from './pages/LoginScreen'
import SignUpScreen from './pages/SignUpScreen'
import {NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import profile from './pages/profile'
const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
   <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
        
        />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="profile" component={profile}  />
      </Stack.Navigator>
  </NavigationContainer>
  );
}