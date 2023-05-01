import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {NavigationContainer} from '@react-navigation/native';
import HomeScreen from '../pages/HomeScreen';
import Profile from '../pages/Profile';
import Favorite from '../pages/Favorite';



import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


const Tab = createBottomTabNavigator();

const bar =() =>{
  return (
    <NavigationContainer
    independent={true}>
        <Tab.Navigator
          initialRouteName='Home'
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              let rn = route.name;
  
              if (rn ==='Home') {
                iconName = focused ? 'Home' : 'Home-outline';
  
              } else if (rn === 'Profile') {
                iconName = focused ? 'user' : 'user-outline';
  
              } else if (rn === 'Favorite') {
                iconName = focused ? 'heart' : 'Heart-outline';
              }
  
              // You can return any component that you like here!
              return <Icon name={iconName} size={size} color={color} />;
              
            },
          })}
          tabBarOptions={{
            activeTintColor: 'tomato',
            inactiveTintColor: 'grey',
            labelStyle: { paddingBottom: 10, fontSize: 10 },
            style: { padding: 10, height: 70},
          
          }}
        >   

            <Tab.Screen name='Home' component={HomeScreen}/>
            <Tab.Screen name='Profile' component={Profile}/>
            <Tab.Screen name='Favorite' component={Favorite}/>
        </Tab.Navigator>
    </NavigationContainer>
  );
}
export default bar;