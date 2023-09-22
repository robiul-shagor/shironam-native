import { Slot, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native'
import { HeaderLeft, HeaderMiddle, HeaderRight } from '../../components';

export default function HomeLayout() {
    return (
        <>
            <SafeAreaView>
                <Stack.Screen 
                options={{
                    headerShadowVisible: true,
                    headerStyle: {
                        backgroundColor: 'white',
                        height: 85,
                    },
                    headerLeft: () => (
                        <HeaderLeft />
                    ),    
                    headerRight: () => (
                        <HeaderRight />
                    ),
                    headerTitle: () => (
                        <HeaderMiddle />
                    )
                }} />
                
                <Slot /> 
                
            </SafeAreaView>
        </>
    );
}
