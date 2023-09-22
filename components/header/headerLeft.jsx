import { TouchableOpacity } from 'react-native'
import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { faBars } from "@fortawesome/free-solid-svg-icons/faBars"
import { useRouter } from 'expo-router'
import { useAuth } from '../../context/auth'

const HeaderLeft = () => {
  const { user } = useAuth();
  const router = useRouter();

  const handlePress = () => {
    if (user && user.normal_user) {
      router.replace('home/categories');
    } else {
      router.replace('login');
    }
  }

  return (
    <TouchableOpacity onPress={handlePress} style={{ marginLeft: 10 }} >
        <FontAwesomeIcon icon={faBars} />
    </TouchableOpacity>
  )
}

export default HeaderLeft