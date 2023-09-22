import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native'
import React, { useState } from 'react'
import { useRouter, Link } from 'expo-router';
import axios from '../../api/axios';
import { useAuth } from '../../context/auth';

const ResetPassBody = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');
    const [error, setError] = useState('');
    const [processing, setProcessing] = useState(false);

    const {langMode} = useAuth();
    const router = useRouter();

    const handleResetPass = async() => {
        try {
            await axios.post('/reset-password', {email, password, c_password: confirmPassword, token: otp}, {headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'Access-Control-Allow-Origin': '*',
            }})
            .then(res => {
                setMessage( langMode == 'BN' ? res.data.message_bn : res.data.message );
                setStatus(res.data.status);
                router.push('/login');
                //console.log(res)
            });
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <View className="flex-1 items-center justify-center py-12 px-10">
            <View className="form-title">
                <Text className="text-2xl font-semibold mb-2 leading-none text-center">
                    { langMode == 'BN' ? 'পাসওয়ার্ড রিসেট করুন' : 'Reset Password' }
                </Text>

                <Text className="text-black text-center">
                    { langMode == 'BN' ? 'আপনার ইমেল, নতুন পাসওয়ার্ড এবং ওটিপি কোড লিখুন যা আপনি এইমাত্র ইমেলে পেয়েছেন' : 'Enter your email, new password and OTP code which you just recive in email' }
                </Text>
    
                <View className="form-group mt-6">
                    <Text>
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
                    <Text>
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
                </View>          
                
                <View className="form-group mt-6">
                    <Text>
                        { langMode == 'BN' ? 'পাসওয়ার্ড নিশ্চিত করুন' : 'Confirm Password' }
                        <Text style={{ color: '#ff0000' }}>*</Text>
                    </Text>

                    <TextInput
                        className="form-control bg-white dark:bg-[#272727] dark:text-white shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={true}
                        required
                    />
                </View>

                <View className="form-group mt-6">
                    <Text>
                        { langMode == 'BN' ? 'ওটিপি কোড' : 'OTP Code'}
                        <Text style={{ color: '#ff0000' }}>*</Text>
                    </Text>

                    <TextInput
                        className="form-control bg-white dark:bg-[#272727] dark:text-white shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                        value={otp}
                        onChangeText={setOtp}
                        autoCapitalize="none"
                        autoCorrect={false}
                        required
                    />
                </View> 

                { status == "Error" && (
                    <View><Text>{message}</Text></View>
                ) }       

                { status == "success" && (
                    <View><Text>{message}</Text></View>
                ) }   
            
                <View className="form-group mt-6">
                    <TouchableOpacity
                    onPress={handleResetPass}
                    disabled={processing}
                    style={{
                        backgroundColor: 'black',
                        padding: 10,
                        borderRadius: 5,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    >
                    { processing ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={{ color: 'white' }}>
                            {langMode == 'BN' ? 'পাসওয়ার্ড রিসেট করুন' : 'Reset Password'}
                        </Text>
                    )}
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default ResetPassBody

const styles = StyleSheet.create({})