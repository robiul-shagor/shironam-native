import { Slot, Stack, useRouter, usePathname, useLocalSearchParams } from 'expo-router';
import { StyleSheet, SafeAreaView, ScrollView, useColorScheme, TouchableOpacity } from 'react-native'
import { HeaderLeft, HeaderMiddle, HeaderRight } from '../../components';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';

export default function LoginLayout() {
    const colorScheme = useColorScheme();
    const router = useRouter();
    const currentScreen = usePathname();

    const handleBackRoute = () => {
        //router.back()
        if( currentScreen == '/login/bookmarks' || currentScreen == '/login/editprofile' || currentScreen == '/login/notification' ) {
            router.push('/login/user');
        } else if ( currentScreen == '/login/forgetpass' || currentScreen == '/login/resetpass') {
            router.push('/login');
        } else {
            router.back();
        }


    };

    return(
        <>
            <SafeAreaView>
                <Stack.Screen 
                options={{
                    headerShadowVisible: true,
                    headerStyle: {
                        backgroundColor: colorScheme === 'light' ? 'white': 'black',
                        height: 85,
                    },
                    headerLeft: () => (
                        <TouchableOpacity onPress={handleBackRoute} style={styles.headerLeft}>
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

                <Slot style={{ backgroundColor: colorScheme === 'light' ? 'white' : '#272727' }} />
            </SafeAreaView>            
        </>
    )
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