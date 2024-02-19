import { StyleSheet, Text, View, TouchableOpacity, Switch, Alert, useColorScheme, Image } from 'react-native'
import React, {useState, useEffect, useCallback} from 'react'
import axios from '../../api/axios';
import { useAuth } from '../../context/auth';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { faSignOut } from '@fortawesome/free-solid-svg-icons';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { faMoon } from '@fortawesome/free-solid-svg-icons';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';
import { Link, useRouter } from 'expo-router';
import { Skeleton } from 'moti/skeleton';
// import { Image } from 'expo-image';


const UserData = () => {
    const { user, baseURL, logOut, langModeSet, darkModeSet, langMode, darkMode } = useAuth();
    const router = useRouter();
    const [langMe, setLangMe] = useState(false);
    const [darkMe, setDarkMe] = useState(false);
    const [userImage, setUserImage] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const colorScheme = useColorScheme();
    const bgDark = colorScheme === 'light' ? '#f8f8f8' : '#191919';
    const bgbutton = colorScheme === 'light' ? '#dddddd' : '#000000';
    const textDark = colorScheme === 'light' ? '#191919' : 'white';
    const borderColor = colorScheme === 'light' ? styles.lightBorder : styles.darkBorder;
    const themeStyle = colorScheme === 'light' ? 'light' : 'dark';

    const fetchData = async() => {
        if (user?.token) {
          // Fetch the user's profile image from the API
          await axios.get('/me', {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          })
          .then(res => {
            res.data?.normal_user?.image && setUserImage( baseURL + '/' + res.data.normal_user.image);
            setLoading(false);
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
    };

    useEffect(() => {
        fetchData();

        if( langMode == 'BN' ) {
            setLangMe(true)
        } else {
            setLangMe(false)
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
        <View className='pt-0 px-5' style={{ backgroundColor: bgDark }}>
            <Skeleton.Group show={loading}>
                <View className="mt-10 mb-2">
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 0, marginTop: 0, paddingBottom: 15, marginBottom: 15, gap: 15 }}>
                    <View style={{marginBottom: 0}}>
                        <Skeleton radius="round" width={65} height={65} colorMode={themeStyle}>
                            {userImage && (
                                <Image 
                                    src={ userImage } 
                                    style={{ width: 65, height: 65, borderRadius: 100, resizeMode: 'cover' }}
                                />
                            ) }
                        </Skeleton>
                    </View>
                    <View>
                        <View className="mb-0">
                            <Skeleton colorMode={themeStyle}>
                                <Text style={{color: textDark}} className="text-left text-lg font-bold">{user?.normal_user?.name} {user?.normal_user?.lastName}</Text>
                            </Skeleton>
                        </View>
                        <View>
                            <Skeleton colorMode={themeStyle}>
                                <Text style={{color: textDark}}>{user?.normal_user?.email}</Text>
                            </Skeleton>
                        </View>
                    </View>
                </View>   

                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20, marginBottom: 0}}>
                    <Skeleton radius="square" colorMode={themeStyle}>
                        <Text style={{color: textDark}} className="text-left text-lg font-semibold">{langMode == 'BN' ? 'প্রোফাইল সম্পাদনা করুন' : 'Edit Profile'}</Text>
                    </Skeleton>
                </View>        

                <View className="mt-3">
                    <Skeleton radius="square" colorMode={themeStyle}>
                        <Link href='login/editprofile' >
                            <View style={styles.menuItem}>
                                <View style={styles.iconWrapper}>
                                    <FontAwesomeIcon size={16} color="#f9020b" icon={faEdit} style={styles.menuIcons} />
                                </View>
                                <Text style={[styles.menuText, {color: textDark}]}>{langMode === 'BN' ? 'জীবন বৃত্তান্ত সম্পাদনা' : 'Edit Profile'}</Text>
                            </View>
                        </Link>    
                    </Skeleton>
                </View>         
                
                <View className="mt-3">
                    <Skeleton radius="square" colorMode={themeStyle}>
                        <Link href='login/bookmarks'>
                            <View style={styles.menuItem}>
                                <View style={styles.iconWrapper}>
                                    <FontAwesomeIcon size={16} color="#f9020b" icon={faBookmark} style={styles.menuIcons} />
                                </View>
                                <Text style={[styles.menuText, {color: textDark}]}>{langMode === 'BN' ? 'বুকমার্ক' : 'Bookmarks'}</Text>
                            </View>
                        </Link>
                    </Skeleton>
                </View>
                
                <View style={{marginTop: 30, marginBottom: 10}}>
                    <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                        <Skeleton radius="square" colorMode={themeStyle}>
                            <Text style={{color: textDark}} className="text-left text-lg font-semibold">{langMode == 'BN' ? 'সেটিংস' : 'Settings'}</Text>
                        </Skeleton>
                    </View>
                </View>

                <View>
                    <Skeleton radius="square" colorMode={themeStyle}>
                        <Link href='login/notification'>
                            <View style={styles.menuItem}>
                                <View style={styles.iconWrapper}>
                                    <FontAwesomeIcon size={16} color="#f9020b" icon={faBell} style={styles.menuIcons} />
                                </View>
                                <Text style={[styles.menuText, {color: textDark}]}>{langMode === 'BN' ? 'বিজ্ঞপ্তি' : 'Notifications'}</Text>
                            </View>
                        </Link>
                    </Skeleton>
                </View>                 
            
                
                <View style={{paddingTop: 0}}>
                    <Skeleton radius="square" colorMode={themeStyle}>
                        <View style={{marginTop: 20}}>
                            <View className="flex-1 flex-row items-center">
                                <View>
                                    <View style={styles.iconWrapper}>
                                        <FontAwesomeIcon size={16} color="#f9020b" icon={faGlobe} style={styles.menuIcons} />
                                    </View>
                                </View>
                                <View className="ml-2 mt-0">
                                    <Text style={[styles.menuText, {color: textDark}]}>{langMode == 'BN' ? 'ভাষা নির্বাচন' : 'Select Language'}</Text>
                                </View>
                            </View>

                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 0, marginBottom: 20, marginLeft: 50, justifyContent: 'space-between' }}>
                                <Text style={{  marginRight: 10, color: textDark}}>
                                    {langMode == 'BN' ? 'ইংরেজি' : 'English'}/{langMode == 'BN' ? 'বাংলা' : 'Bangla'}
                                </Text>
                                <Switch
                                    value={langMe}
                                    onValueChange={handleLanguageChange}
                                    trackColor={{false: '#767577', true: 'rgba(249,2,11,0.08)'}}
                                    thumbColor={darkMe ? '#f9020b' : '#f9020b'}
                                />
                            </View>
                        </View>
                    </Skeleton>                
                </View>

                <View style={{paddingTop: 0, display: 'none'}}>
                    <Skeleton radius="square" colorMode={themeStyle}>
                        <View>
                            <View className="flex-1 flex-row items-center">
                                <View>
                                    <View style={styles.iconWrapper}>
                                        <FontAwesomeIcon size={16} color="#f9020b" icon={faMoon} style={styles.menuIcons} />
                                    </View>
                                </View>
                                <View className="ml-2">
                                    <Text style={[styles.menuText, {color: textDark}]}>{langMode == 'BN' ? 'অ্যাপ মোড' : 'App Mode'}</Text>
                                </View>
                            </View>

                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 0, marginBottom: 7, marginLeft: 50, justifyContent: 'space-between' }}>
                                <Text style={{  marginRight: 10, color: textDark}}>
                                    {langMode == 'BN' ? 'লাইট মোড' : 'Light Mode'}/{langMode == 'BN' ? 'ডার্ক মোড' : 'Dark Mode'}
                                </Text>
                                <Switch
                                    value={darkMe}
                                    onValueChange={handleDarkMode}
                                    trackColor={{false: '#767577', true: 'rgba(249,2,11,0.08)'}}
                                    thumbColor={darkMe ? '#f9020b' : '#f9020b'}
                                />
                            </View>
                        </View>
                    </Skeleton>
                </View>
                
                <View className="mt-10 mb-[50px]">          
                    <Skeleton radius="square" colorMode={themeStyle}>
                        <TouchableOpacity 
                            onPress={handleLogout}
                            style={{
                                backgroundColor: bgbutton,
                                padding: 10,
                                borderRadius: 2,
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '100%',
                                flexDirection: 'row', 
                                alignItems: 'center',
                            }}
                        >
                            <FontAwesomeIcon icon={faSignOut} color="#f9020b" style={{color: textDark, marginRight: 5}} />
                            <Text style={{fontSize: 16, color: '#f9020b'}}>{langMode == 'BN' ? 'লগআউট' : 'Logout'}</Text>
                        </TouchableOpacity>
                    </Skeleton>
                </View>   
            </Skeleton.Group>
        </View>
    )
}

export default UserData

const styles = StyleSheet.create({
    menuItem: {
       flexDirection:'row',
       justifyContent: 'center',
       alignItems: 'center',
       marginBottom: 25,
       gap: 10
    },
    menuIcons: {
        marginRight: 0,
        opacity: 1
    },
    iconWrapper: {
        backgroundColor: 'rgba(249,2,11,0.13)', 
        width: 40,
        height: 40,
        borderRadius: 100,
        justifyContent: 'center',
        textAlign: 'center',
        alignItems: 'center',
        flex: 1
    },
    menuText: {
        fontSize: 16
    },
    lightBorder: {
        borderBottomColor: '#ebebeb'
    },
    darkBorder: {
        borderBottomColor: '#1e1e1e21'
    },
})