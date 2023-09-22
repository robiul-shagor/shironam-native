import { StyleSheet, Text, View, TouchableOpacity, Switch, Image, Alert } from 'react-native'
import React, {useState, useEffect} from 'react'
import axios from '../../api/axios';
import { useAuth } from '../../context/auth';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { faSignOut } from '@fortawesome/free-solid-svg-icons';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { faUserEdit } from '@fortawesome/free-solid-svg-icons';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';
import { Link, useRouter } from 'expo-router';

const UserData = () => {
    const { user, baseURL, logOut, langModeSet, darkModeSet, langMode, darkMode } = useAuth();
    const router = useRouter();
    const [langMe, setLangMe] = useState(false);
    const [darkMe, setDarkMe] = useState(false);
    const [userImage, setUserImage] = useState(null);

    useEffect(() => {
      if (user?.token) {
        // Fetch the user's profile image from the API
        axios.get('/me', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then(res => {
          res.data?.normal_user?.image && setUserImage( baseURL + '/' + res.data.normal_user.image);
        })
        .catch(error => {
            if(error.response?.data?.message === 'Unauthenticated.' ) {
                logOut();
                router.push('/home');
            } else {
                if (error?.response?.status === 401) {
                    // Show an alert asking the user to log in again
                    Alert.alert(
                        langMode === 'BN' ? 'অননুমোদিত' : 'Unauthorized',
                        langMode === 'BN' ? 'আপনার সেশনের মেয়াদ শেষ হয়ে গেছে। আবার লগইন করুন.' : 'Your session has expired. Please log in again.',
                        [
                            {
                                text: langMode === 'BN' ? 'ঠিক আছে' : 'Okey',
                                onPress: () => {
                                    router.push('/login');
                                }
                            }
                        ]
                    );
                }
            }
        });
      }
    }, [user]);

    const handleLogout = async() => {
        try {
            if (user?.token) {
                await axios.post('/logout', {}, { headers: { 'Authorization': `Bearer ${user.token}` } });
                logOut();
                router.push('/home');
            }
        } catch (e) {
            console.log(e);
        }
    };

    const handleLanguageChange = () => {
        setLangMe(!langMe);
        
        if( langMe ) {
            langModeSet('EN')
        } else {
            langModeSet('BN')
        }
    };    
    
    const handleDarkMode = () => {
        setDarkMe(!darkMe);
        if( darkMe ) {
            darkModeSet('light')
        } else {
            darkModeSet('dark')
        }
    };

    return (
        <View className={`flex-1 ${darkMode == 'dark' ? 'bg-[#272727] text-white' : 'bg-white' } h-screen py-15 px-10`}>

            <View className="mt-10">
                <Text className="mb-4 text-md">{langMode === 'BN' ? 'আমার প্রোফাইল' : 'My Profile'}</Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 0, marginTop: 0, borderBottomWidth: 1, borderBottomColor: '#ebebeb', paddingBottom: 15, marginBottom: 15 }}>
                <View style={{marginRight: 15}}>
                {userImage && (
                    <Image source={{ uri: userImage }} style={{ width: 65, height: 65, borderRadius: 100 }} />
                ) }
                </View>
                <View>
                    <Text className="text-left text-lg font-bold">{user?.normal_user?.name} {user?.normal_user?.lastName}</Text>
                    <Text>{user?.normal_user?.email}</Text>
                </View>
            </View>   

            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20, marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#ebebeb' }}>
                <FontAwesomeIcon size={20} icon={faUserEdit} style={{color: '#000000', marginRight: 5}} />
                <Text className="text-left text-lg font-semibold">{langMode == 'BN' ? 'আমার পছন্দ সম্পাদনা করুন' : 'Edit my preference'}</Text>
            </View>        

            <View className="mt-3">
                <Link href='login/editprofile' >
                    <View style={styles.menuItem}>
                        <FontAwesomeIcon size={15} icon={faEdit} style={styles.menuIcons} />
                        <Text>{langMode === 'BN' ? 'জীবন বৃত্তান্ত সম্পাদনা' : 'Edit Profile'}</Text>
                    </View>
                </Link>    
            </View>         

            <View className="mt-3">
                <Link href='login/interests'>
                    <View style={styles.menuItem}>
                        <FontAwesomeIcon size={15} icon={faStar} style={styles.menuIcons} />
                        <Text>{langMode === 'BN' ? 'আমার আগ্রহ' : 'My Interests'}</Text>
                    </View>
                </Link>
            </View>            
            
            <View className="mt-3 mb-5">
                <Link href='login/bookmarks'>
                    <View style={styles.menuItem}>
                        <FontAwesomeIcon size={15} icon={faBookmark} style={styles.menuIcons} />
                        <Text>{langMode === 'BN' ? 'বুকমার্ক' : 'Bookmarks'}</Text>
                    </View>
                </Link>
            </View>
            
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20, marginBottom: 0, borderBottomWidth: 1, borderBottomColor: '#ebebeb' }}>
                <FontAwesomeIcon icon={faCog} size={20} style={{color: '#000000', marginRight: 5}} />
                <Text className="text-left text-lg font-semibold">{langMode == 'BN' ? 'সেটিংস' : 'Settings'}</Text>
            </View>
            
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20, marginBottom: 7 }}>

                <Text style={{  marginRight: 10}}>
                    {langMode == 'BN' ? 'হালকা মোড' : 'Light Mode'}
                </Text>
                <Switch
                    value={darkMe}
                    onValueChange={handleDarkMode}
                />
                <Text style={{  marginLeft: 10}}>
                    {langMode == 'BN' ? 'ডার্ক মোড' : 'Dark Mode'}
                </Text>
            </View>            
            
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20, marginBottom: 7 }}>
                <Text style={{  marginRight: 10}}>
                    {langMode == 'BN' ? 'ইংরেজি' : 'English'}
                </Text>
                <Switch
                    value={langMe}
                    onValueChange={handleLanguageChange}
                />
                <Text style={{  marginLeft: 10}}>
                    {langMode == 'BN' ? 'বাংলা' : 'Bangla'}
                </Text>
            </View>

            <TouchableOpacity 
                onPress={handleLogout}
                className="mt-10"
                style={{
                    backgroundColor: 'black',
                    padding: 10,
                    borderRadius: 2,
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    flexDirection: 'row', 
                    alignItems: 'center'
                }}
            >
                <FontAwesomeIcon icon={faSignOut} style={{color: '#ffffff', marginRight: 5}} />
                <Text className="text-white">{langMode == 'BN' ? 'লগআউট' : 'Logout'}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default UserData

const styles = StyleSheet.create({
    menuItem: {
       flexDirection:'row',
       justifyContent: 'center',
       alignItems: 'center'
    },
    menuIcons: {
        marginRight: 10,
        opacity: 0.80
    }
})