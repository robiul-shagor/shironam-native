import { StyleSheet, ScrollView } from 'react-native'
import React from 'react'
import { MyInterests, Footer, Login } from '../../components'
import { useAuth } from '../../context/auth'

const Interests = () => {
    const { user, langMode } = useAuth();

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            { user?.normal_user ? (
                <MyInterests />
            ) : (
                <Login />
            ) }
        </ScrollView>
    )
}

export default Interests

const styles = StyleSheet.create({})