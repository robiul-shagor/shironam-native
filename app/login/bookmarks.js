import { StyleSheet, ScrollView } from 'react-native'
import React from 'react'
import { BookmarkList, Footer } from '../../components'

const Bookmarks = () => {
    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <BookmarkList />
        </ScrollView>
    )
}

export default Bookmarks

const styles = StyleSheet.create({})