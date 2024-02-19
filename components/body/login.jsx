import { StyleSheet, Text, View, TextInput, Switch, ActivityIndicator, TouchableOpacity, useColorScheme } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/auth'
import { Link, useRouter } from 'expo-router'
import axios from '../../api/axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const { logIn, registerData, langMode } = useAuth();

  const colorScheme = useColorScheme();
  const textColor = colorScheme === 'light' ? '#131313' : 'white';

  // Store user data
  const storeData = async (value) => {
    try {
      const userData = JSON.stringify(value);
      await AsyncStorage.setItem('userDetails', userData);
    } catch (e) {
      console.log(e);
    }
  }; 

  // Store user password
  const storePassword = async (value) => {
    try {
      const userPassword = JSON.stringify(value);
      await AsyncStorage.setItem('rememberedPassword', userPassword);
    } catch (e) {
      console.log(e);
    }
  };

  // Get user password
  const getPassData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('rememberedPassword');
      return jsonValue != null ? jsonValue : null;
    } catch (e) {
      console.log(e);
    }
  };

  // Remove password from storage
  const removeValue = async () => {
    try {
      await AsyncStorage.removeItem('rememberedPassword')
    } catch(e) {
      console.log(e);
    }
  }

  const handleRememberMeChange = () => {
    setRememberMe(!rememberMe);
  };

  // Handle Login
  const handleLogin = async(event) => {
    setProcessing(true);
    
    try {
      await axios.post('/login', {email, password}, {headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'Access-Control-Allow-Origin': '*',
      }})
      .then(res => {
        if( typeof res.data.status !== 'undefined' && res.data.status === 'Error' ) {
          setMessage( ( langMode == 'BN' ) ? res.data.message_bn : res.data.message);
          setProcessing(false);
        } else if ( typeof res.data.status !== 'undefined') {
          if( res.data.status == "Warning" ) {
            setProcessing(false)
            setMessage( ( langMode == 'BN' ) ? res.data.message_bn : res.data.message)
            registerData(res.data.email)

            setTimeout(function() {
              router.push('/register/verify')
              setMessage('');
            }, 1000)

            axios.post('/resent-otp', {email: res.data.email }, {
              headers: {
                  'content-type': 'application/x-www-form-urlencoded',
                  'Access-Control-Allow-Origin': '*',
              }
            }) 
          }
          
          if( res.data.status == 'Error' ) {
            setProcessing(false)
            setMessage( ( langMode == 'BN' ) ? res.data.message_bn : res.data.message)
            setTimeout(function() {
              setMessage('');
            }, 1000)
          }
        } else {
          const data = {
            token: res.data.token,
            normal_user: {
              email: res.data.normal_user.email,
              name: res.data.normal_user.name,
              lastName: res.data.normal_user.last_name
            }
          };

          storeData(data);
          logIn(data);
          setProcessing(false);

          if( res.data?.normal_user?.interest == null ) {
            router.push('/register/interests');
          } else {
            router.push('/home');
          }
        }
      });
    } catch (e) {
      if (e.response && e.response.status === 422) {
        setMessage( ( langMode == 'BN' ) ? 'আনপ্রসেস এন্টিটি: অনুগ্রহ করে আপনার ইনপুট চেক করুন।' : 'Unprocessable Entity: Please check your input.');
      } else {
        setMessage( ( langMode == 'BN' ) ? 'একটি ত্রুটি ঘটেছে. অনুগ্রহ করে একটু পরে আবার চেষ্টা করুন.' : 'An error occurred. Please try again later.');
      }
      setProcessing(false);
    }

    if (rememberMe) {
      storePassword(password)
    } else {
      removeValue();
    }
  };

  useEffect(() => {
    const getPasswordData = async () => {
        const passData = await getPassData();
        if (passData) {
          setPassword(passData); // Set the password state with the retrieved password string
          setRememberMe(true);
        }
    };
    getPasswordData();
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-[#f8f8f8] h-screen dark:bg-[#272727] dark:text-white px-5">
      <View className="form-title">
        <Text className="text-2xl font-semibold mb-2 leading-none text-center" style={{color: textColor}}>
          { langMode == 'BN' ? 'লগইন' : 'Login'}
        </Text>
        <Text className="text-center" style={{color: textColor}}>
          { langMode == 'BN' ? 'আপনার ইমেইল এবং পাসওয়ার্ড ব্যবহার করে এখানে লগইন করুন' : ' Login here using your email and password'}
        </Text>

        <View className="form-group mt-6">
          <Text style={{color: textColor, marginBottom: 5}}>
            {langMode == 'BN' ? 'ইমেইল' : 'Email Address'}
            <Text style={{ color: '#ff0000' }}>*</Text>
          </Text>

          <TextInput
            className="form-control bg-white dark:bg-[#272727] dark:text-white shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            required
          />
        </View>          
        
        <View className="form-group mt-6">
          <Text style={{color: textColor, marginBottom: 5}}>
            {langMode == 'BN' ? 'পাসওয়ার্ড' : 'Password'}
            <Text style={{ color: '#ff0000' }}>*</Text>
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', position: 'relative' }}>
            <TextInput
              className="form-control bg-white dark:bg-[#272727] dark:text-white shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              required
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Text style={{ marginLeft: 0, color: textColor, position: 'absolute', right: 12, bottom: -7, fontSize: 12 }}>
                {showPassword ? (langMode == 'BN' ? 'লুকান' : 'Hide' )  : (langMode == 'BN' ? 'দেখান' : 'Show' )}
              </Text>
            </TouchableOpacity>
          </View>

        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20, marginBottom: 7 }}>
          <Switch
            value={rememberMe}
            onValueChange={handleRememberMeChange}
          />
          <Text style={{  marginLeft: 10, color: textColor}}>
            {langMode == 'BN' ? 'পাসওয়ার্ড সংরক্ষণ' : 'Remember Password'}
          </Text>
        </View>

        <View className="form-group mt-6">
          <TouchableOpacity
            onPress={handleLogin}
            style={styles.buttonStyle}
          >
            { processing ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={{color: 'white'}}>
                {langMode == 'BN' ? 'সাইন ইন করুন' : 'Sign In'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
        
        <View className="mt-4">
          <Link href="/login/forgetpass" className="text-center" style={{ textDecorationLine: 'underline', color: textColor }}>
            { langMode == 'BN' ? 'পাসওয়ার্ড ভুলে গেছেন?' : 'Forgot Password?'}
          </Link>
        </View>

        <View><Text>{'\n'}</Text></View>

        <View className="mt-4 mb-40">
          <Text className="text-center" style={{color: textColor}}> 
            { langMode == 'BN' ? 'অ্যাকাউন্ট প্রয়োজন? ' : 'Need an account? '}
            <Link 
              href="/register"
              style={{
                textDecorationLine: 'underline',
                marginLeft: 5
              }} >
              { langMode == 'BN' ? 'নিবন্ধন করুন' : 'Let\'s Sign Up'}
            </Link>        
          </Text>

          { message && (
            <View className="mt-5" style={{ backgroundColor: '#f9020b',  paddingVertical: 10, paddingHorizontal: 15, borderRadius: 5 }}>
              <Text className="text-center text-white">{message}</Text>
            </View>
          ) }
        </View>
      </View>
    </View>
  )
}

export default Login

const styles = StyleSheet.create({
  buttonStyle: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    textAlign: 'center'
  }
})