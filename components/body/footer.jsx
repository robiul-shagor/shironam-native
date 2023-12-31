import { StyleSheet, Text, View, useColorScheme } from 'react-native'
import React from 'react'
import { images } from '../../constants'
import { Link } from 'expo-router'
import { useAuth } from '../../context/auth'

const Footer = () => {
    const {langMode} = useAuth();
    const colorScheme = useColorScheme();

    const bgColor = colorScheme === 'light' ? styles.bgLight : styles.bgDark;
    const textColor = colorScheme === 'light' ? styles.textDark : styles.textLight;

    return (
        <View className="max-[767px]:pb-[8rem] dark:bg-[#272727] dark:text-white" style={bgColor}>
            <View style={styles.container}>
                <View className="footer_top py-7 xl:py-20 space-y-10 border-b border-gray-300">
                    <View className="widget col-span-6 md:col-span-4 lg:col-span-3 xl:col-span-4">   
                        <View className="widget col-span-6 md:col-span-5 lg:col-span-4">
                            <View style={styles.grid}>
                                <Link href="/home/about" style={[styles.cell, textColor]}>
                                    <Text>{langMode == 'BN' ? 'আমাদের সম্পর্কে' : 'About Us'}</Text>
                                </Link>            
                                
                                <Link href="/home/advertisement" style={[styles.cell, textColor]}>
                                    <Text>{langMode == 'BN' ? 'বিজ্ঞাপন' : 'Advertisement'}</Text>
                                </Link>         
                                
                                <Link href="/home/contact" style={[styles.cell, textColor]}>
                                    <Text>{langMode == 'BN' ? 'যোগাযোগ করুন' : 'Contact Us'}</Text>
                                </Link>      
                                
                                <Link href="/home" style={[styles.cell, textColor]}>
                                    <Text>{langMode == 'BN' ? 'নিউজলেটার' : 'Newsletter'}</Text>
                                </Link>  
                                
                                <Link href="/home/privecy" style={[styles.cell, textColor]}>
                                    <Text>{langMode == 'BN' ? 'গোপনীয়তা নীতি' : 'Privacy & Policy'}</Text>
                                </Link>
                            </View>
                        </View>
                    </View>
                </View>

                <View className="footer_bottom sm:flex items-center justify-between pt-5 md:pt-14 pb-10">
                    <View className="copyright basis-1/2 text-2xl text-center sm:text-left">
                        <Text style={textColor}>{langMode == 'BN' ? 'কপিরাইট © ২০২৩, শিরোনাম। সর্বস্বত্ব সংরক্ষিত' : 'Copyright © 2023, SHIRONAM. All rights reserved.'}</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default Footer

const styles = StyleSheet.create({
    container: {
        paddingLeft: 15,
        paddingRight: 15
    },
    gridIn: {
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 15,
        marginTop: 10
    },    
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    cell: {
        width: '48%',
        padding: 0,
        marginTop: 15,
    },
    bgDark : {
        backgroundColor: '#272727'
    },
    bgLight: {
        backgroundColor: 'white'
    },
    textLight: {
        color: 'white'
    },
    textDark: {
        color: '#131313'
    }
})