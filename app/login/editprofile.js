import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React from 'react'
import { EditProfile, Footer } from '../../components'

const Editprofile = () => {
    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <EditProfile />
            <Footer />
        </ScrollView>
    )
}

export default Editprofile

const styles = StyleSheet.create({})