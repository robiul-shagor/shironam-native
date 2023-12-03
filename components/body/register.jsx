import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, useColorScheme } from 'react-native'
import React, { useState } from 'react'
import { Link, useRouter } from 'expo-router';
import axios from '../../api/axios';
import { useAuth } from '../../context/auth';

const Register = () => {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [cPassword, setCpassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [ message, setMessage ] = useState('');
  const [ processing, setProcessing ] = useState('');

  const router = useRouter()
  const { registerData, langMode } = useAuth();

  const colorScheme = useColorScheme();
  const bgColor = colorScheme === 'light' ? 'white' : '#272727'; 
  const textColor = colorScheme === 'light' ? '#191919' : 'white'; 

  const handleRegistration = async() => {
    setProcessing(true);

    try {
      await axios.post('/register', {name, email, password, c_password: cPassword, last_name: lastName, phone }, {headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'Access-Control-Allow-Origin': '*',
      }})
      .then(res => {
        setMessage(res.data.message);
        registerData(res.data.user.email);
        router.push('/register/verify')
      });
    } catch (e) {
        setError(e.response.data.message)
        setProcessing(false);
    } finally {
        setLoading(false)
    }
  }

  return (
    <View className="flex-1 items-center justify-center py-10" style={{backgroundColor: bgColor}}>
      <View className="form-title">
        <Text className="text-2xl font-semibold mb-2 leading-none text-center" style={{color: textColor}}>
          { langMode == 'BN' ? 'একটি অ্যাকাউন্ট তৈরি করুন' : 'Create an account'}
        </Text>
        <Text className="text-black text-center" style={{color: textColor}}>
          { langMode == 'BN' ? 'চলুন কয়েকটি ধাপের মধ্য দিয়ে যাওয়া যাক' : 'Let\'s go through a few steps'}
        </Text>

        <View className="form-group mt-6">
          <Text style={{color: textColor}}>
            { langMode == 'BN' ? 'নামের প্রথম অংশ' : 'First Name'}
            <Text style={{ color: '#ff0000' }}>*</Text>
          </Text>

          <TextInput
            className="form-control bg-white dark:bg-[#272727] dark:text-white shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
            value={name}
            onChangeText={setName}
            autoCapitalize="none"
            autoCorrect={false}
            required
          />
          {typeof error.name !== 'undefined' && <Text className="error">{error.name}</Text>}
        </View>    

        <View className="form-group mt-6">
          <Text style={{color: textColor}}>
            { langMode == 'BN' ? 'নামের শেষাংশ' : 'Last Name'}
            <Text style={{ color: '#ff0000' }}>*</Text>
          </Text>

          <TextInput
            className="form-control bg-white dark:bg-[#272727] dark:text-white shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
            value={lastName}
            onChangeText={setLastName}
            autoCapitalize="none"
            autoCorrect={false}
            required
          />
          {typeof error.last_name !== 'undefined' && <Text className="error">{error.last_name}</Text>}
        </View>    

        <View className="form-group mt-6">
          <Text style={{color: textColor}}>
            { langMode == 'BN' ? 'ফোন' : 'Phone'}
            <Text style={{ color: '#ff0000' }}>*</Text>
          </Text>

          <TextInput
            className="form-control bg-white dark:bg-[#272727] dark:text-white shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
            value={phone}
            onChangeText={setPhone}
            autoCapitalize="none"
            autoCorrect={false}
            required
          />

          {typeof error.phone !== 'undefined' && <Text className="error">{error.phone}</Text>}
        </View> 

        <View className="form-group mt-6">
          <Text style={{color: textColor}}>
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

          {typeof error.email !== 'undefined' && <Text className="error">{error.email}</Text>}
        </View>          
        
        <View className="form-group mt-6">
          <Text style={{color: textColor}}>
            {langMode == 'BN' ? 'পাসওয়ার্ড' : 'Password'}
            <Text style={{ color: '#ff0000' }}>*</Text>
          </Text>

          <TextInput
            className="form-control bg-white dark:bg-[#272727] dark:text-white shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            required
          />
          {typeof error.password !== 'undefined' && <Text className="error">{error.password}</Text>}
        </View>

        <View className="form-group mt-6">
          <Text style={{color: textColor}}>
            { langMode == 'BN' ? 'পাসওয়ার্ড নিশ্চিত করুন' : 'Confirm Password'}
            <Text style={{ color: '#ff0000' }}>*</Text>
          </Text>

          <TextInput
            className="form-control bg-white dark:bg-[#272727] dark:text-white shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
            value={cPassword}
            onChangeText={setCpassword}
            secureTextEntry={true}
            required
          />
          {typeof error.c_password !== 'undefined' && <Text className="error">{error.c_password}</Text>}
        </View>

        <View className="form-group mt-6">
          <TouchableOpacity
            onPress={handleRegistration}
            >
            { processing ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonStyle}>
                {langMode == 'BN' ? 'নিবন্ধন করুন' : 'Sign Up'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <View className="mt-4">
          <Link href="/login" className="text-center" style={{ textDecorationLine: 'underline', color: textColor }} s>
            { langMode == 'BN' ? 'ইতোমধ্যে একজন সদস্য?' : 'Already a member?'}
          </Link>    
        </View>
      </View>
    </View>
  )
}

export default Register

const styles = StyleSheet.create({
  container: {
    paddingVertical: 50
  },
  buttonStyle: {
    backgroundColor: 'black',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    textAlign: 'center'
  }
})