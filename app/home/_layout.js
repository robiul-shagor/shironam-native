import { Slot, Stack } from 'expo-router';
import { SafeAreaView, useColorScheme } from 'react-native'
import { HeaderLeft, HeaderMiddle, HeaderRight } from '../../components';

export default function HomeLayout() {
    const colorScheme = useColorScheme();
      
    return (
        <>
            <SafeAreaView>
                <Stack.Screen 
                options={{
                    headerShadowVisible: true,
                    headerStyle: {
                        backgroundColor: colorScheme === 'light' ? 'white' : '#000000',
                        height: 90,
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
                
                <Slot style={{ backgroundColor: colorScheme === 'light' ? 'white' : '#272727' }} /> 
            </SafeAreaView>
        </>
    );
}
