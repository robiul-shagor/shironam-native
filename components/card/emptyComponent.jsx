import { StyleSheet, Text, View, Image, useColorScheme } from 'react-native'
import React from 'react'
import { images } from '../../constants'
import { Skeleton } from 'moti/skeleton';

const EmptyComponent = () => {
    const colorScheme = useColorScheme();
    const themeStyle = colorScheme === 'light' ? 'light' : 'dark';
    return (
        <Skeleton.Group show={true}>
            <View className="post-item group p-4">
                <View className="mb-2">
                    <Skeleton
                    radius="square"
                    colorMode={themeStyle}
                    >
                    <Image
                        source={images.placeholder} // Provide a default placeholder image source when both ads_image and thumbnail are empty
                        style={{ width: '100%', height: undefined, aspectRatio: 16 / 9 }}
                    />
                    </Skeleton>
                </View>

                <Skeleton width="60%" radius="square" colorMode={themeStyle}>
                    <Text>Placeholder Text</Text>
                </Skeleton>   

                <View className="mt-2">
                    <Skeleton radius="square" colorMode={themeStyle}>
                    <Text>Lorem ipsum, dolor sit amet consectetur adipisicing elit.</Text>
                    </Skeleton>
                </View>      

                <View className="mt-2">
                    <Skeleton radius="square" colorMode={themeStyle}>
                    <Text>Lorem ipsum, dolor sit amet consectetur adipisicing elit.</Text>
                    </Skeleton>
                </View>   
            </View>            
            
            <View className="post-item group p-4">
                <View className="mb-2">
                    <Skeleton
                    radius="square"
                    colorMode={themeStyle}
                    >
                    <Image
                        source={images.placeholder} // Provide a default placeholder image source when both ads_image and thumbnail are empty
                        style={{ width: '100%', height: undefined, aspectRatio: 16 / 9 }}
                    />
                    </Skeleton>
                </View>
                <Skeleton width="60%" radius="square" colorMode={themeStyle}>
                    <Text>Placeholder Text</Text>
                </Skeleton>   
                <View className="mt-2">
                    <Skeleton radius="square" colorMode={themeStyle}>
                    <Text>Lorem ipsum, dolor sit amet consectetur adipisicing elit.</Text>
                    </Skeleton>
                </View>      
                <View className="mt-2">
                    <Skeleton radius="square" colorMode={themeStyle}>
                    <Text>Lorem ipsum, dolor sit amet consectetur adipisicing elit.</Text>
                    </Skeleton>
                </View>   
            </View>            
            
            <View className="post-item group p-4">
                <View className="mb-2">
                    <Skeleton
                    radius="square"
                    colorMode={themeStyle}
                    >
                    <Image
                        source={images.placeholder} // Provide a default placeholder image source when both ads_image and thumbnail are empty
                        style={{ width: '100%', height: undefined, aspectRatio: 16 / 9 }}
                    />
                    </Skeleton>
                </View>
                <Skeleton width="60%" radius="square" colorMode={themeStyle}>
                    <Text>Placeholder Text</Text>
                </Skeleton>   
                <View className="mt-2">
                    <Skeleton radius="square" colorMode={themeStyle}>
                    <Text>Lorem ipsum, dolor sit amet consectetur adipisicing elit.</Text>
                    </Skeleton>
                </View>      
                <View className="mt-2">
                    <Skeleton radius="square" colorMode={themeStyle}>
                    <Text>Lorem ipsum, dolor sit amet consectetur adipisicing elit.</Text>
                    </Skeleton>
                </View>   
            </View>
        </Skeleton.Group>
    )
}

export default EmptyComponent

const styles = StyleSheet.create({})