import { StyleSheet, View } from 'react-native'
import React from 'react'
import { NonCard, UserCard } from '../../components'
import { useAuth } from '../../context/auth'

const Index = () => {
    const { user } = useAuth();
    return (
        <>
            { user?.normal_user ? (
                <View style={styles.parentContainer}>
                    <UserCard />
                </View>
            ) : (
                <View style={styles.parentContainer}>
                    <NonCard />
                </View>
            )}
            
        </>
    )
}

export default Index

const styles = StyleSheet.create({
    parentContainer: {
        paddingHorizontal: 15,
    }
})