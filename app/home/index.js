import { View, Alert, BackHandler } from 'react-native'
import React, { useEffect } from 'react'
import { NonCard, UserCard } from '../../components'
import { useAuth } from '../../context/auth'
import { useNavigation, usePathname } from 'expo-router'

const Index = () => {
    const { user, langMode } = useAuth();
    const navigation = useNavigation();
    const path = usePathname();

    useEffect(() => {
        const backAction = () => {
          if (!navigation.isFocused()) {
            // If the current screen is not focused, allow the default back action
            return false;
          }

          if( path == '/home' ) {
            Alert.alert(langMode == 'BN' ? 'অপেক্ষা করুন!' : 'Hold on!', langMode == 'BN' ? 'আপনি প্রস্থান করতে চান' : 'Are you sure you want to exit?', [
                {
                text: langMode == 'BN' ? 'বাতিল করুন' : 'Cancel',
                onPress: () => null,
                style: 'cancel',
                },
                {
                text: 'BN' ? 'হ্যাঁ' : 'YES',
                onPress: () => BackHandler.exitApp(),
                },
            ]);
        
            return true;
            };
        }
    
        const backHandler = BackHandler.addEventListener(
          'hardwareBackPress',
          backAction
        );
    
        return () => backHandler.remove();
    }, [path]);

    return (
        <>
            { user?.normal_user ? (
                <View>
                    <UserCard />
                </View>
            ) : (
                <View>
                    <NonCard />
                </View>
            )}
            
        </>
    )
}

export default Index