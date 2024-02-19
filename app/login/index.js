import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React from 'react'
import { Login } from '../../components'

const index = () => {
    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <Login />
        </ScrollView>
    )
}

export default index

const styles = StyleSheet.create({})