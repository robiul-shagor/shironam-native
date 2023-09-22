import { SafeAreaView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { HeaderRight, CategoryCard } from '../../components';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';


export default function CategoryPage() {
    const { slug } = useLocalSearchParams();
    const router = useRouter();
    const formattedTitle = slug
                            .split('-')
                            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(' ');
    

    return(
        <>
            <SafeAreaView>
                <Stack.Screen 
                    options={{
                        headerTitle: formattedTitle,
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

                <CategoryCard />
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    headerLeft: {
        marginLeft: 5
    } 
})