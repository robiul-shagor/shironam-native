import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React from 'react'
import { useAuth } from '../../context/auth'
import { Link } from 'expo-router'
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { faCompass } from '@fortawesome/free-solid-svg-icons';
import { Breaking, AllCategory, Footer } from '../../components'

const Index = () => {
    const { user, langMode } = useAuth();
    
    return (
        <>
            {
                user?.token ? (
                    <ScrollView>
                        <View style={styles.container}>
                            <Breaking />
                            <AllCategory />
                            <Footer />
                        </View>
                    </ScrollView>
                ) : (
                    <ScrollView>
                        <View style={styles.container}>
                            <View style={styles.iconStyle}>
                                <FontAwesomeIcon icon={faCompass} size={ 40 } color="#f9020b" />
                            </View>
                            <View style={styles.textContent}>
                                <Text style={styles.paraText}>{langMode == 'BN'? 'সমস্ত বিভাগ দেখতে লগইন করুন' : 'Please login to view All Category'}</Text>
                                <Link href="/login" style={styles.linkURL}><Text>Login</Text></Link>
                            </View>
                        </View>
                        <Footer />
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
        backgroundColor: 'white',
        height: '100%',
        flex: 1,
        paddingVertical: 100,
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