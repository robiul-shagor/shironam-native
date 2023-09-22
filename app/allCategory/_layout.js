import { Slot, Stack, useRouter } from 'expo-router';
import { SafeAreaView, TouchableOpacity, StyleSheet, Text, View } from 'react-native'
import {  HeaderRight  } from '../../components';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/auth';

const AllCategory = () => {
    const { user } = useAuth();
    const langMode = 'BN';
    const router = useRouter();

    return (
        <>
            <SafeAreaView>
                <Stack.Screen 
                    options={{
                        headerTitle: () => (
                            <Text>{ langMode == 'BN' ? 'সমস্ত বিভাগ' : 'All Category'}</Text>
                        ),
                        headerRight: () => (
                            <HeaderRight />
                        ),
                        headerLeft: () => (
                            <TouchableOpacity onPress={()=> router.back() } style={styles.headerLeft}>
                                <FontAwesomeIcon icon={faAngleLeft} />
                            </TouchableOpacity>
                        ), 
                    }}
                />

                <SafeAreaView>
                    <Slot />
                </SafeAreaView>
            </SafeAreaView>
        </>
    )
}

export default AllCategory

const styles = StyleSheet.create({
    headerLeft: {
        marginLeft: 5
    }
})