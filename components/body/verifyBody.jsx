import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, useColorScheme } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/auth';
import axios from '../../api/axios';
import { useRouter, Link } from 'expo-router';

const VerifyBody = () => {
    const [verify, setVerify] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [ loading, setLoading ] = useState(false);
    const [ otpBtn, setOtpBtn ] = useState(false);
    const { regData, removeRegistarData, langMode } = useAuth();
    const router = useRouter();

    const colorScheme = useColorScheme();
    const bgColor = colorScheme === 'light' ? 'white' : '#272727'; 
    const textColor = colorScheme === 'light' ? '#191919' : 'white'; 

    const handleVerify = async() => {
        setLoading(true);

        try {
            await axios.post('/verify', { email: regData, token: parseInt(verify) }, {headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'Access-Control-Allow-Origin': '*',
            }})
            .then(res => {
                if( typeof res?.data?.status !=="undefined" ) {
                    if( res?.data?.status == "Error" ) {
                        setLoading(false);
                        setError(langMode == 'BN' ? res.data.message_bn : res.data.message);
                    }

                    if( res?.data?.status == "Expired" ) {
                        setLoading(false);
                        setError(langMode == 'BN' ? res.data.message_bn : res.data.message);
                        setOtpBtn(true);
                    }

                    if( res?.data?.status == "Success" ) {
                        setSuccess(res.data.message);
                        router.push('/login');
                        setLoading(false);
                        removeRegistarData();
                    }
                } else {
                    setSuccess(res.data.message);
                    router.push('/login');
                    setLoading(false);
                }
            });
        } catch (e) {
            setError(e.response?.data?.errors || 'Something went wrong')
            setLoading(false);
        }
    };

    const handleResend = async() => {
        setLoading( true )

        try {
            await axios.post('/resent-otp', { email: regData }, {headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'Access-Control-Allow-Origin': '*',
            }})
            .then(res => {
                setLoading(false);
                setOtpBtn(false);
            });
        } catch(e) {
            setError(e.response?.data?.errors || 'Something went wrong')
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 py-12 px-5 h-screen" style={{backgroundColor: bgColor}}>
            <View className="form-title">
                <Text className="text-2xl font-semibold mb-2 leading-none text-center" style={{color: textColor}}>
                    { langMode == 'BN' ? 'আপনার অ্যাকাউন্ট যাচাই করুন' : 'Verify your account'}
                </Text>
                <Text className="text-black text-center" style={{color: textColor}}>
                    { langMode == 'BN' ? 'চলুন কয়েকটি ধাপের মধ্য দিয়ে যাওয়া যাক' : 'Let\'s go through a few steps'}
                </Text>


                <View className="form-group mt-6">
                    <Text style={{color: textColor}}>
                        { langMode == 'BN' ? 'কোড যাচাই করুন' : 'Verify Code'}
                        <Text style={{ color: '#ff0000' }}>*</Text>
                    </Text>

                    <TextInput
                        className="form-control bg-white dark:bg-[#272727] dark:text-white shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                        value={verify}
                        onChangeText={setVerify}
                        autoCapitalize="none"
                        autoCorrect={false}
                        required
                    />
                    {error && <Text className="error">{error}</Text>}
                </View>
                  

                <View className="form-group mt-6">
                    { otpBtn && (
                        <TouchableOpacity
                            onPress={handleResend}
                            disabled={loading}
                            style={{
                                backgroundColor: 'black',
                                padding: 10,
                                borderRadius: 5,
                                marginBottom: 10,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            { loading ? (
                            <ActivityIndicator color="white" />
                            ) : (
                            <Text style={{ color: 'white' }}>
                                {langMode == 'BN' ?  'OTP আবার পাঠান' : 'Resend OTP'}
                            </Text>
                            )}
                        </TouchableOpacity>
                    ) }

                    <TouchableOpacity
                        onPress={handleVerify}
                        disabled={loading}
                        style={{
                        backgroundColor: 'black',
                        padding: 10,
                        borderRadius: 5,
                        alignItems: 'center',
                        justifyContent: 'center',
                        }}
                    >
                        { loading ? (
                        <ActivityIndicator color="white" />
                        ) : (
                        <Text style={{ color: 'white' }}>
                            {langMode == 'BN' ?  'যাচাই করুন' : 'Verify'}
                        </Text>
                        )}
                    </TouchableOpacity>
                </View> 

                { success && ( 
                    <View>
                        <Text style={{color: textColor}}>{success}</Text>
                    </View> 
                )}

                <View><Text>{'\n'}</Text></View>

                <View className="mt-4">
                    <Link href="/login" className="text-center" style={{ textDecorationLine: 'underline', color: textColor }} >
                        { langMode == 'BN' ? 'ইতোমধ্যে একজন সদস্য?' : 'Already a member?'}
                    </Link>     
                </View>
            </View>
        </View>
    )
}

export default VerifyBody

const styles = StyleSheet.create({})