import { Slot, Stack, useRouter } from 'expo-router';
import { SafeAreaView, ScrollView, useColorScheme, TouchableOpacity, StyleSheet } from 'react-native'
import { HeaderLeft, HeaderMiddle, HeaderRight } from '../../components';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';

export default function RegisterLayout() {
    const colorScheme = useColorScheme();
    const router = useRouter();
  return (
    <>
        <SafeAreaView>
            <Stack.Screen 
            options={{
                headerShadowVisible: true,
                headerStyle: {
                    backgroundColor: colorScheme === 'light' ? 'white' : 'black',
                    height: 85,
                },
                headerLeft: () => (
                    <TouchableOpacity onPress={()=> router.push('/login') } style={styles.headerLeft}>
                        <FontAwesomeIcon color={colorScheme === 'light' ? 'black': 'white'} icon={faAngleLeft} size={18}  />
                    </TouchableOpacity>
                ),    
                headerRight: () => (
                    <HeaderRight />
                ),
                headerTitle: () => (
                    <HeaderMiddle />
                )
            }} />

            <ScrollView showsVerticalScrollIndicator={false}>
                <Slot />
            </ScrollView>
        </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
    headerLeft: {
        marginLeft: 5,
        padding: 10
    },
    textDark: {
        color: '#131313'
    },
    textWhite: {
        color: 'white'
    }
})