import { Slot, Stack, useRouter } from 'expo-router';
import { SafeAreaView, TouchableOpacity, StyleSheet, Text, View } from 'react-native'
import {  HeaderRight  } from '../../components';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/auth';

const TodayNews = () => {
    const { user, langMode } = useAuth();
    const router = useRouter();

    return (
        <>
            <SafeAreaView>
                <Stack.Screen 
                    options={{
                        headerTitle: () => (
                            <Text>{ langMode == 'BN' ? 'আজকের খবর' : 'Today News'}</Text>
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

export default TodayNews

const styles = StyleSheet.create({
    headerLeft: {
        marginLeft: 5
    }
})