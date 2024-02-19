import { Slot, Stack } from 'expo-router';
import { SafeAreaView, useColorScheme, View } from 'react-native'
import { HeaderLeft, HeaderMiddle, HeaderRight } from '../../components';
import { ThemeProvider, DarkTheme, DefaultTheme, useTheme } from '@react-navigation/native';

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
                        height: 95,
                    },
                    headerRight: () => (
                        <HeaderRight />
                    ),
                    headerTitle: () => (
                        <HeaderMiddle />
                    ),
                }} />
                <Slot /> 
            </SafeAreaView>
        </>
    );
}
