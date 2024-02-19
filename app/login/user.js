import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React from 'react'
import { UserData } from '../../components'

const User = () => {
  return (
      <ScrollView showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1 }}>
        <UserData />
      </ScrollView>
  )
}

export default User

const styles = StyleSheet.create({})