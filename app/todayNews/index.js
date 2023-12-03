import { StyleSheet, Text, View, useColorScheme } from 'react-native'
import React from 'react'
import { useAuth } from '../../context/auth'
import { Link } from 'expo-router'
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { faBolt } from '@fortawesome/free-solid-svg-icons';
import { TodayCard } from '../../components'

const Index = () => {
    const { user, langMode } = useAuth();
    const colorScheme = useColorScheme();
    const bgColor = colorScheme === 'light' ? 'white' : '#272727';
    const textColor = colorScheme === 'light' ? '#191919' : 'white';
    
    return (
        <>
            {
                user?.token ? (
                    <TodayCard />
                ) : (
                    <View style={[styles.container, { backgroundColor: bgColor }]}>
                        <View style={styles.iconStyle}>
                            <FontAwesomeIcon icon={faBolt} size={ 40 } color="#f9020b" />
                        </View>
                        <View style={styles.textContent}>
                            <Text style={[styles.paraText, {color: textColor}]}>{ langMode == 'BN' ? 'আজকের খবর দেখতে লগইন করুন' : 'Please login to view Today news' }</Text>
                            <Link href="/login" style={styles.linkURL}><Text>{ langMode == 'BN' ? 'লগইন করুন' : 'Login' }</Text></Link>
                        </View>
                    </View>
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
        backgroundColor: 'white',
        height: '100%'
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
        marginBottom: 15
    }
})