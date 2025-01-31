import React, { createContext, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'

// context 
const AuthContext = createContext()

// provider 

const AuthProvider = ({children}) => {
    // global state
    const [state, setState] = useState({
        user: null,
        token: '', 
    });
    // default axios
    axios.defaults.baseURL = "https://tiffintracker.onrender.com/api/v1"
    // iniital local storage data 
    useEffect(()=>{
        const loadLocalStorageData = async () => {
            let data = await AsyncStorage.getItem('@auth');
            let loginData = JSON.parse(data);
            setState({...state , user:loginData?.user, token : loginData?.token}) 
        };
        loadLocalStorageData()
    },[])
   

    return (
        <AuthContext.Provider value = {[state , setState]}>
            {children}
        </AuthContext.Provider>
    )
};


export {AuthContext , AuthProvider};