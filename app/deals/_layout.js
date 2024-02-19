import { Slot, Stack, useRouter } from 'expo-router';
import { SafeAreaView, TouchableOpacity, StyleSheet, Text, useColorScheme } from 'react-native'
import {  HeaderRight  } from '../../components';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/auth';

const Deals = () => {
    const { langMode } = useAuth();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const textStyle = colorScheme === 'light' ? styles.textDark : styles.textWhite;
    const iconStyle = colorScheme === 'light' ? 'black' : 'white';

    return (
        <>
            <SafeAreaView>
                <Stack.Screen 
                    options={{
                        headerTitle: () => (
                            <Text style={[textStyle, {fontSize: 18, fontWeight: 700}]}>{ langMode == 'BN' ? 'ডিল' : 'Deals'}</Text>
                        ),
                        headerRight: () => (
                            <HeaderRight />
                        ),
                        headerLeft: () => (
                            <TouchableOpacity onPress={()=> router.back() } style={styles.headerLeft}>
                                <FontAwesomeIcon color={iconStyle} icon={faAngleLeft} size={18}  />
                            </TouchableOpacity>
                        ), 
                        headerStyle: {
                            backgroundColor: colorScheme === 'light' ? 'white' : '#000000',
                            height: 90,
                        },
                    }}
                />

                <SafeAreaView>
                    <Slot />
                </SafeAreaView>
            </SafeAreaView>
        </>
    )
}

export default Deals

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