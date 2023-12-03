import { SafeAreaView, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { HeaderRight, CategoryAllCard } from '../../components';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';


export default function CategoryAllPage() {
    const { slug } = useLocalSearchParams();
    const router = useRouter();
    const formattedTitle = slug
                            .split('-')
                            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(' ');

    const colorScheme = useColorScheme();

    

    return(
        <>
            <SafeAreaView>
                <Stack.Screen 
                    options={{
                        headerTitle: formattedTitle,
                        headerTintColor: colorScheme === 'light' ? 'black' : 'white',
                        headerRight: () => (
                            <HeaderRight />
                        ),
                        headerLeft: () => (
                            <TouchableOpacity onPress={()=> router.push('/allCategory') } style={styles.headerLeft}>
                                <FontAwesomeIcon size={18} icon={faAngleLeft} color={colorScheme === 'light' ? 'black' : 'white'} />
                            </TouchableOpacity>
                        ), 
                        headerStyle: {
                            backgroundColor: colorScheme === 'light' ? 'white' : '#000000',
                        },
                    }}
                />

                <CategoryAllCard />
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    headerLeft: {
        marginLeft: 5,
        padding: 10
    } 
})