import { Text, View, TouchableOpacity, Image, Alert, useColorScheme } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCircleUser } from '@fortawesome/free-solid-svg-icons'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { faBell } from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '../../context/auth'
import { useRouter } from 'expo-router'
import axios from '../../api/axios'
import useIntervalAsync from '../../api/useIntervalAsync'
import { Skeleton } from 'moti/skeleton';

const HeaderRight = () => {
  const { user, baseURL, notificationData, setNotificationData, reFetch, setReFetch, logOut, langMode } = useAuth();
  const router = useRouter();
  const [userImage, setUserImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const colorScheme = useColorScheme();
  const textColors = colorScheme === 'light' ? 'black' : 'white';

  const userProfileImage = useCallback( async() => {
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
      });
    } else {
      setUserImage(null); // Reset userImage when user is not logged in
      setLoading(false);
    }
  }, [user, baseURL] )

  useEffect(() => {
    userProfileImage();
  }, [user, baseURL]);

  const handlePress = () => {
    if (user && user.normal_user) {
      router.replace('login/user');
    } else {
      router.replace('login');
    }
  };

  const handleSearch = () => {
    router.replace('home/search');
  }  
  
  const handleNotification = () => {
    router.replace('home/notification');
  }

  const updateNotification = useCallback(async () => {
    if( user?.token ) {
      const config = {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      };

      try {
        await axios.get('/notifications', config)
        .then(res => {
          setNotificationData(res.data);
        });
      } catch (e) {
          if(e.response?.data?.message === 'Unauthenticated.' ) {
              logOut();
              router.push('/home');
          } else {
              console.log(e);
          }
      }
    }
  }, []);

  useEffect(() => {
    if (reFetch) {
      updateNotification();
      setReFetch(false);
    }
  }, [reFetch]);

  useIntervalAsync(updateNotification, 300000);

  const filteredNotification = notificationData.filter((post) => post.read_at === null);

  return (
    <> 
      {user?.token ? (
        <>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={handlePress} style={{ marginRight: 10 }} >
              { loading ? (
                <Skeleton show={true} radius="round" width={35} height={35}>
                  <FontAwesomeIcon icon={faCircleUser} size={20} />
                </Skeleton>
              ) : (
                userImage ? (
                  <Image source={{ uri: userImage }} style={{ width: 30, height: 30, borderRadius: 100 }} />
                ) : (
                  <FontAwesomeIcon icon={faCircleUser} size={20} />
                )
              ) }
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <TouchableOpacity onPress={handlePress} style={{ paddingRight: 15 }} >
          <FontAwesomeIcon icon={faCircleUser} size={20} color={textColors} />
        </TouchableOpacity>
      )}
    </>
  )
}

export default HeaderRight