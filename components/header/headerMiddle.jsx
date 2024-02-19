import { Image, TouchableOpacity, useColorScheme } from 'react-native'
import React from 'react'
import { images } from '../../constants'
import { useRouter } from 'expo-router'

const HeaderMiddle = () => {
    const router = useRouter();
    const colorScheme = useColorScheme();
    
    const handlePress = () => {
        router.replace('home');
    };

    const logoElement =
    colorScheme === 'light' ? images.logo : images.logoDark;

    return (
        <TouchableOpacity onPress={handlePress}>
            <Image 
                source={logoElement}
                resizeMode='contain'
                style={{ width: 100, height: 45, marginBottom: 0 }}
            />
        </TouchableOpacity>
    )
}

export default HeaderMiddle