import { StyleSheet, Text, View, FlatList, useColorScheme, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useAuth } from '../../context/auth'
import Footer from './footer'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'expo-router';
import moment from 'moment/min/moment-with-locales';
import axios from '../../api/axios';
import EmptyNotification from './emptyNotification';


const NotificationBody = () => {
    const { user, notificationData, setReFetch, langMode } = useAuth();
    const router = useRouter();
    const colorScheme = useColorScheme();

    const [ loading, setLoading ] = useState();

    const bgColor = colorScheme === 'light' ? 'white' : '#272727';
    const bgUnreadColor = colorScheme === 'light' ? '#f0f1f3' : '#191919';
    const bgReadColor = colorScheme === 'light' ? 'white' : '#272727';
    const textColor = colorScheme === 'light' ? '#191919' : 'white';

    const readNotification = async( id, link ) => {
        if( user?.token ) {
            try {
                await axios.post('/read-notification', {id}, {headers: {
                    'Authorization': `Bearer ${user.token}`
                }})
                .then(res => {
                    if( res.data.message == 'Notification read success.' ) {
                        if( link.length > 0 ) {
                            router.push(link);
                        }
                    }
                    setReFetch(true);
                });
            } catch (e) {
                console.log(e);
            }
        }
    };    
    
    const readAllNotification = async() => {
        if( user?.token ) {
            try {
                await axios.post('/mark-all-read-notifications', {}, {headers: {
                    'Authorization': `Bearer ${user.token}`
                }})
                .then(res => {
                    setReFetch(true);
                });
            } catch (e) {
                console.log(e);
            }
        }
    };

    const CardItems = ({ item }) => {
        const itemLink = item?.data?.link ? `/subcategory/${item.data.slug.split('/').pop()}` : '';
        const itemId = item.id;
        return (
            <TouchableOpacity onPress={()=> readNotification( itemId, itemLink ) }>
                <View className="flex flex-row mb-3" 
                    style={
                        [item.read_at == null
                            ? [styles.notificationUnread, {backgroundColor: bgUnreadColor}]
                            : styles.notificationRead, { backgroundColor: bgReadColor }]
                    }>
                    <View className="w-10 h-10 rounded-full flex items-center justify-center border mr-2" style={{borderColor: textColor}}>
                        <FontAwesomeIcon color={textColor} icon={faCheck} size={10} />
                    </View>

                    <View className="justify-center" style={{ flex: 1}}>
                        <View style={{marginBottom: 0}}>
                            <Text style={{ color: textColor }}>{langMode == 'BN' ? item.data.message_bn : item.data.message_en}</Text>
                        </View>
                        <View style={{marginTop: -5}}>
                            <Text style={{ color: textColor }}>
                                { langMode == 'BN' ? moment(new Date(item.created_at)).startOf('seconds').locale('bn-bd').fromNow() : moment(new Date(item.created_at)).startOf('seconds').locale("en").fromNow() }
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <>
            <View style={{backgroundColor: bgColor, paddingHorizontal: 15, paddingVertical: 15}}>
                <Text style={{fontSize: 18, fontWeight: 600, color: textColor}}>{langMode == 'BN' ? 'বিজ্ঞপ্তি' : 'Notification'}</Text>       
            </View>
            <FlatList
                data={notificationData}
                renderItem={({ item }) => <CardItems item={item} />}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                style={{ paddingHorizontal: 15, width: '100%', backgroundColor: bgColor }}
                ListFooterComponent={
                    <>
                        <View className="mb-[80px]">
                            <TouchableOpacity 
                                onPress={readAllNotification}
                                style={{
                                    backgroundColor: 'black',
                                    padding: 10,
                                    borderRadius: 2,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '100%',
                                    lexDirection: 'row', 
                                    alignItems: 'center'
                                }}
                            >
                                <Text style={{color: 'white'}}>{langMode == 'BN' ? 'সবগুলো পঠিত বলে সনাক্ত কর' : 'Mark all as read'}</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                }
                ListEmptyComponent={
                    <EmptyNotification />
                }
            />
        </>
    )
}

export default NotificationBody

const styles = StyleSheet.create({
    notificationUnread: {
        backgroundColor: '#f0f1f3',
        padding: 15
    }, 
    notificationRead: {
        backgroundColor: 'white',
        padding: 15
    }
})