import { useRouter, useSegments } from "expo-router";
import React, { useContext, createContext, useState, useEffect } from 'react'
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext(null);

// Define the token expiration duration (7 days in milliseconds).
const TOKEN_EXPIRATION_DURATION = 7 * 24 * 60 * 60 * 1000; 

// This hook will protect the route access based on user authentication.
function useProtectedRoute(user, lastLoginTimestamp) {
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        const inAuthGroup = segments[0] === '(auth)';
    
        if (!user || (lastLoginTimestamp && Date.now() - lastLoginTimestamp > TOKEN_EXPIRATION_DURATION)) {
            // Token is expired or user is not logged in.
            // Redirect to the sign-in page.
            router.replace('/home');
        } else if (user && inAuthGroup) {
            // Redirect away from the sign-in page.
            router.replace('/home');
        }
    }, [user, segments, lastLoginTimestamp]);
}

export function Provider(props) {
    const [user, setAuth] = useState(null);
    const [lastLoginTimestamp, setLastLoginTimestamp] = useState(null);
    const [notificationData, setNotificationData] = useState([]);
    const [reFetch, setReFetch] = useState(false);
    const [langMode, setLangMode] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [regData, setRegData] = useState([]);
    const baseURL = 'https://admin.shironam.live';

    // User Login Data
    useEffect(() => {
        const checkUserLogin = async () => {
            // Check if the user is already logged in (e.g., token available in AsyncStorage).
            const userData = await AsyncStorage.getItem('userDetails');
            if (userData) {
                const userObj = JSON.parse(userData);
                setAuth(userObj);
            }
        };
        checkUserLogin();
    }, []);
    
    // Check User Language
    useEffect(() => {
        const checkUserLang = async () => {
            // Check if the user is already logged in (e.g., token available in AsyncStorage).
            const userLang = await AsyncStorage.getItem('langMode');
            if (userLang) {
                const userObj = JSON.parse(userLang);
                setLangMode(userObj);
            }
        };
        checkUserLang();
    }, []);

    // Check Mode Data
    useEffect(() => {
        const checkUserThemeMode = async () => {
            // Check if the user is already logged in (e.g., token available in AsyncStorage).
            const userMode = await AsyncStorage.getItem('darkmode');
            if (userMode) {
                const userObj = JSON.parse(userMode);
                setDarkMode(userObj);
            }
        };
        checkUserThemeMode();
    }, []);


    //useProtectedRoute(user);

    const logIn = async (data) => {
        // Assuming that the API response contains the user details and the token.
        const { token, normal_user } = data;
        const userData = {
          token,
          normal_user,
        };
    
        // Store user details in AsyncStorage.
        await AsyncStorage.setItem('userDetails', JSON.stringify(userData));
        setAuth(userData);
    };    
    
    const registerData = async (data) => {
        // Store user details in AsyncStorage.
        await AsyncStorage.setItem('newUserDetails', JSON.stringify(data));
        setRegData(data);
    };     
    
    const langModeSet = async (data) => {
        // Store user details in AsyncStorage.
        await AsyncStorage.setItem('langMode', JSON.stringify(data));
        setLangMode(data);
    };      
    
    const darkModeSet = async (data) => {
        // Store user details in AsyncStorage.
        await AsyncStorage.setItem('darkmode', JSON.stringify(data));
        setDarkMode(data);
    };     
    
    const getRegisterData = async () => {
        // Store user details in AsyncStorage.
        const registerData = await AsyncStorage.getItem('newUserDetails');
        setRegData(JSON.parse(registerData));
    };    
    
    const removeRegistarData = async () => {
        // Store user details in AsyncStorage.
        await AsyncStorage.removeItem('newUserDetails');
        setRegData(null);
    };
    
    const logOut = async () => {
        // Remove user details from AsyncStorage on logout.
        await AsyncStorage.removeItem('userDetails');
        setAuth(null);
    };

    return (
        <AuthContext.Provider 
            value={{
                logIn, 
                logOut, 
                user, 
                baseURL, 
                notificationData, 
                setNotificationData, 
                reFetch, 
                setReFetch, 
                registerData, 
                regData, 
                removeRegistarData, 
                langModeSet, 
                darkModeSet, 
                langMode, 
                darkMode 
            }}>
            {props.children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    return useContext(AuthContext);
}
  