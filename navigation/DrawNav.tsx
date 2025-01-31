import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Main from '../components/Main';
import Calendar from '../components/Calendar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Account from '../components/Account';
import UpdateDetails from '../components/UpdateDetails'; // Import the UpdateDetails screen
import UpdateUser from '../components/UpdateUser';
import { useFonts, Quicksand_400Regular } from "@expo-google-fonts/quicksand";
import { Lato_400Regular, Lato_700Bold } from "@expo-google-fonts/lato";
import About from '../components/About';
export const DrawNav = () => {
  let [fontsLoaded] = useFonts({
      Quicksand_400Regular,
      Lato_400Regular,
      Lato_700Bold,
    });
  const Tab = createBottomTabNavigator();
  const AccountStack = createNativeStackNavigator();

  const AccountStackNavigator = () => {
    return (
      <AccountStack.Navigator>
        <AccountStack.Screen 
          name="AccountHome" 
          component={Account} 
          options={{ headerShown: false ,}} 
        />
        <AccountStack.Screen 
          name="UpdateDetails" 
          component={UpdateDetails} 
          options={{ title: 'Change password', 
            headerStyle: { backgroundColor: 'rgba(1 ,11 , 20, 255)' }, 
            
            headerTitleStyle: {
              fontFamily: 'Lato_700Bold',
              fontSize: 23
            },
          headerTintColor: 'white', }} 
        />
        <AccountStack.Screen 
          name="UpdateUser" 
          component={UpdateUser} 
          options={{ title: 'Change username', 
            headerStyle: { backgroundColor: 'rgba(1 ,11 , 20, 255)'}, 
            headerTitleStyle: {
              fontFamily: 'Lato_700Bold',
              fontSize: 23
            },
          headerTintColor: 'white', }} 
        />
        <AccountStack.Screen 
          name="About" 
          component={About} 
          options={{ title: 'About', 
            headerStyle: { backgroundColor: 'rgba(1 ,11 , 20, 255)'}, 
            headerTitleStyle: {
              fontFamily: 'Lato_700Bold',
              fontSize: 23
            },
          headerTintColor: 'white', }} 
        />
      </AccountStack.Navigator>
    );
  };

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Calendar') {
            iconName = 'calendar';
          } else if (route.name === 'Account') {
            iconName = 'person-circle-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'aqua',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: 'rgba(1 ,11 , 20, 255)',
          borderTopWidth: 0,
        },
      })}
    >
      <Tab.Screen name="Home" component={Main} options={{ headerShown: false, }} />
      <Tab.Screen name="Calendar" component={Calendar} options={{ headerShown: false }} />
      <Tab.Screen
      name="Account"
      component={AccountStackNavigator}
      options={{
        headerShown: false,
      }}
    />
    </Tab.Navigator>
  );
};
