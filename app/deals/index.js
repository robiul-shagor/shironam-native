import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React from 'react'
import { useAuth } from '../../context/auth'
import { Login } from '../../components'

const Index = () => {
    const { user, langMode } = useAuth();

    return (
        <>
            {
                user?.token ? (
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{ 
                        flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                            <Text>All Deals Go Here</Text>
                        </View>
                    </ScrollView>
                ) : (
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Login />
                    </ScrollView>
                )
            }
        </>
    )
}

export default Index

const styles = StyleSheet.create({})