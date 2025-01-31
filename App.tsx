import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { DrawNav } from './navigation/DrawNav';
import { StackNav } from './navigation/StackNav';
import { AuthContext, AuthProvider } from './context/authContext'; // Import AuthProvider
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const MainNavigator = ()=> {
  const [state] = useContext(AuthContext);
  return state.user ? <DrawNav /> : <StackNav />;
}


export default function App() {

  
  return (
    <GestureHandlerRootView>
    <AuthProvider>
      <NavigationContainer>
        <MainNavigator/>
      </NavigationContainer>
    </AuthProvider></GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
