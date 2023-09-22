import { StyleSheet, ScrollView } from 'react-native'
import React from 'react'
import { MyInterests, Footer } from '../../components'

const Interests = () => {
    return (
        <ScrollView>
            <MyInterests />
            <Footer />
        </ScrollView>
    )
}

export default Interests

const styles = StyleSheet.create({})