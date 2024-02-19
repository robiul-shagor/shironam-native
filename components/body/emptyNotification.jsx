import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Skeleton } from 'moti/skeleton';

const EmptyNotification = () => {
    return (
        <Skeleton.Group show={true}>
            <View className="mb-2">
                <Skeleton>
                    <Text>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quidem ipsum nulla dolores quasi consequatur necessitatibus vero.</Text>
                </Skeleton>
            </View>         
            <View className="mb-2">
                <Skeleton>
                    <Text>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quidem ipsum nulla dolores quasi consequatur necessitatibus vero.</Text>
                </Skeleton>
            </View>          
            <View className="mb-2">
                <Skeleton>
                    <Text>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quidem ipsum nulla dolores quasi consequatur necessitatibus vero.</Text>
                </Skeleton>
            </View>         
            <View className="mb-2">
                <Skeleton>
                    <Text>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quidem ipsum nulla dolores quasi consequatur necessitatibus vero.</Text>
                </Skeleton>
            </View>            
            <View className="mb-2">
                <Skeleton>
                    <Text>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quidem ipsum nulla dolores quasi consequatur necessitatibus vero.</Text>
                </Skeleton>
            </View>
        </Skeleton.Group>
    )
}

export default EmptyNotification

const styles = StyleSheet.create({})