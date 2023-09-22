import { Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { images } from '../../constants'
import { useRouter } from 'expo-router'

const HeaderMiddle = () => {
    const router = useRouter();
    
    const handlePress = () => {
        router.replace('home');
    };

    return (
        <TouchableOpacity onPress={handlePress}>
            <Image 
                source={images.logo}
                resizeMode='contain'
                style={{ width: 100, height: 45, marginBottom: 15 }}
            />
        </TouchableOpacity>
    )
}

export default HeaderMiddle