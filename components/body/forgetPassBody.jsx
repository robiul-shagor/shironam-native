import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import axios from '../../api/axios';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/auth';

const ForgetPassBody = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');
    const [error, setError] = useState('');
    const [processing, setProcessing] = useState(false);

    const {langMode} = useAuth();
    const router = useRouter();
    
    const handleResetPass = async()=> {
        setProcessing(true)

        try {
            await axios.post('/forget-password', {email}, {headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'Access-Control-Allow-Origin': '*',
            }})
            .then(res => {
                setMessage(res.data.message);
                setStatus('success');
                setProcessing(false);
                setError(false);
                if( res.status == 200 ) {
                    router.push('/login/resetpass');
                }
            });
        } catch (e) {
            if( e.response.data.status == 'Error' ) {
                setError(e.response.data.message);
            }
            setProcessing(false);
        } finally {
            setProcessing(false)
        }
    };

    return (
        <View className="flex-1 items-center justify-center py-12 px-10">
            <View className="form-title">
                <Text className="text-2xl font-semibold mb-2 leading-none text-center">
                    { langMode == 'BN' ? 'পাসওয়ার্ড পুনরুদ্ধার করুন' : 'Recover Password' }
                </Text>
                <Text className="text-black text-center">
                    { langMode == 'BN' ? 'আপনি যে ইমেল ঠিকানা ব্যবহার করেছেন তা লিখুন।' : 'Enter email address that you used.' }
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

                { status == "Error" && (
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
                            {langMode == 'BN' ? 'লিঙ্ক পাঠান' : ' Send Link'}
                        </Text>
                    )}
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default ForgetPassBody

const styles = StyleSheet.create({})