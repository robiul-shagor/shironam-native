import { StyleSheet, Text, View, ScrollView, useColorScheme } from 'react-native'
import React from 'react'
import { useAuth } from '../../context/auth'
import { Link } from 'expo-router'
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { faCompass } from '@fortawesome/free-solid-svg-icons';
import { Breaking, AllCategory, Footer } from '../../components'

const Index = () => {
    const { user, langMode } = useAuth();
    const colorScheme = useColorScheme();
    const bgColor = colorScheme === 'light' ? 'white' : '#272727';
    const textColor = colorScheme === 'light' ? '#191919' : 'white';
    
    return (
        <>
            {
                user?.token ? (
                    <ScrollView>
                        <View>
                            <Breaking />
                            <AllCategory />
                        </View>
                    </ScrollView>
                ) : (
                    <ScrollView>
                        <View className="h-screen" style={[styles.container, {backgroundColor: bgColor}]}>
                            <View style={styles.iconStyle}>
                                <FontAwesomeIcon icon={faCompass} size={ 40 } color="#f9020b" />
                            </View>
                            <View style={styles.textContent}>
                                <Text style={[styles.paraText, {color: textColor}]}>{langMode == 'BN'? 'সমস্ত বিভাগ দেখতে লগইন করুন' : 'Please login to view All Category'}</Text>
                                <Link href="/login" style={styles.linkURL}><Text>Login</Text></Link>
                            </View>
                        </View>
                    </ScrollView>
                )
            }
        </>
    )
}

export default Index

const styles = StyleSheet.create({
    linkURL: {
        backgroundColor: 'black',
        padding: 10,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        display: 'flex',
        width: 150,
        textAlign: 'center',
        marginTop: 15,
        fontSize: 16
    },
    container: {
        alignItems: 'center',
        justifyContent: 'center', 
    },
    textContent: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    paraText: {
        fontSize: 20,
        paddingHorizontal: 15,
    },
    iconStyle: {
        opacity: 0.6,
        marginBottom: 15,
        textAlign: 'center'
    }
})