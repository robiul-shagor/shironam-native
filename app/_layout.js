import { Tabs, useNavigation } from 'expo-router';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faThLarge } from '@fortawesome/free-solid-svg-icons';
import { faBolt } from '@fortawesome/free-solid-svg-icons';
import { faCompass } from '@fortawesome/free-solid-svg-icons';
import { useFonts } from 'expo-font';
import { Provider } from '../context/auth';
import 'moment/dist/locale/bn-bd';
import { useColorScheme } from 'react-native';

export const unstable_settings = {
    initialRouteName: "home"
};

export default function Layout() {
    const [fontsLoaded] = useFonts({
        InterRegular: require("../assets/font/Inter-Regular.ttf"),
        InterMedium: require("../assets/font/Inter-Medium.ttf"),
        InterBold: require("../assets/font/Inter-Bold.ttf"),
        NotoSerifRegular: require("../assets/font/NotoSerif-Regular.ttf"),
        NotoSerifMedium: require("../assets/font/NotoSerif-Medium.ttf"),
        NotoSerifBold: require("../assets/font/NotoSerif-Bold.ttf"),
    });

    
    const colorScheme = useColorScheme();
    const tabBarBg =
    colorScheme === 'light' ? 'white' : 'black';

    if(!fontsLoaded ) {
        return null;
    }
      
    return (
        <Provider>
            <Tabs
                screenOptions={{ 
                    tabBarStyle: [{
                        backgroundColor: tabBarBg,
                        borderTopColor: tabBarBg,
                    }]
                }}
            >
                <Tabs.Screen
                    name="index"
                    options={{
                        href: null,
                    }}
                />  

                <Tabs.Screen
                    name="allCategory"
                    options={{
                        tabBarLabel: "Explore",
                        tabBarIcon:  ({ focused }) => (
                            <FontAwesomeIcon icon={faCompass} color={ focused ? "#f9020b" : "#666666" } />
                        ),
                        tabBarActiveTintColor: '#f9020b',
                        tabBarLabelStyle: {
                            marginBottom: 5,
                        }
                    }}
                />            
                
                <Tabs.Screen
                    name="home"
                    options={{
                        tabBarLabel: "News Feeds",
                        href: '/home',
                        tabBarIcon:  ({ focused }) => (
                            <FontAwesomeIcon icon={faThLarge} color={ focused ? "#f9020b" : "#666666" } />
                        ),
                        tabBarActiveTintColor: '#f9020b',
                        tabBarLabelStyle: {
                            marginBottom: 5,
                        }            
                    }}
                />

                <Tabs.Screen
                    name="login"
                    options={{
                        href: null,
                    }}
                />                  
                
                <Tabs.Screen
                    name="register"
                    options={{
                        href: null,
                    }}
                />              
                
                <Tabs.Screen
                    name="category/[slug]"
                    options={{
                        href: null,
                    }}
                />       

                <Tabs.Screen
                    name="subcategory/[slug]"
                    options={{
                        href: null,
                    }}
                />              
                
                <Tabs.Screen
                    name="news/[id]"
                    options={{
                        href: null,
                    }}
                />                  
                
                <Tabs.Screen
                    name="todayNews"
                    options={{
                        href: null,
                    }}
                />        
                

                <Tabs.Screen
                    name="breaking"
                    options={{
                        href: null,
                    }}
                /> 
                 

                <Tabs.Screen
                    name="deals"
                    options={{
                        tabBarLabel: "Interests",
                        href: '/login/interests',
                        tabBarIcon:  ({ focused }) => (
                            <FontAwesomeIcon icon={faBolt} color={ focused ? "#f9020b" : "#666666" } />
                        ),
                        tabBarActiveTintColor: '#f9020b',
                        tabBarLabelStyle: {
                            marginBottom: 5,
                        },
                    }}
                />   

                <Tabs.Screen
                    name="categoryall/[slug]"
                    options={{
                        href: null,
                    }}
                />  
            </Tabs>
        </Provider>
    );
}
