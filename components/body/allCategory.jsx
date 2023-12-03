import { StyleSheet, Text, View, useColorScheme, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import axios from '../../api/axios'
import { useAuth } from '../../context/auth'
import ImageBlurLoading from 'react-native-image-blur-loading'
import { images } from '../../constants'
import moment from 'moment/min/moment-with-locales';
import { Link } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';

const AllCategory = () => {
    const { user, langMode } = useAuth();
    const [catItem, setCatItem ] = useState([]);
    const [loading, setLoading] = useState(true);
    const colorScheme = useColorScheme();

    const bgCardColor = colorScheme === 'light' ? styles.cardContainerWhite : styles.cardContainerDark;
    const textColor = colorScheme === 'light' ? styles.textDark : styles.textWhite;
    const iconColor = colorScheme === 'light' ? '#131313' : 'white';
    const containerColor = colorScheme === 'light' ? 'white' : 'black';

    useEffect(() => {
        if (user?.token) {
            const config = {
                headers: {
                  'Authorization': `Bearer ${user.token}`
                }
            };
            const getData = async() => {
                try {
                    await axios.get('/category-list', config)
                    .then(res => {
                        setCatItem(res.data);
                        setLoading(false);
                    });
                } catch (e) {
                    console.log(e);
                }
            };
            getData();
        }
    }, [])

    const CardItems = ({ item }) => {
        return(
            item.name ? (
                <View key={item.key} data-id={item.id} style={[styles.cardContainer, bgCardColor]}>
                    <Link href={`/categoryall/${item.slug}`}>
                        <View className="relative overflow-hidden">
                            { item?.category_image ?
                                <>               
                                    <ImageBlurLoading
                                        thumbnailSource={images.placeholder}
                                        source={{ uri: item.category_image  }} 
                                        style={{ width: '100%', height: 125, aspectRatio: 4 / 3, resizeMode: 'cover' }}
                                    />
                                    <Text style={styles.counterBG}>{item.news}</Text>   
                                </>  : 
                                <>
                                    <ImageBlurLoading
                                        thumbnailSource={images.placeholder}
                                        source={images.placeholder} 
                                        style={{ width: '100%', height: 125, aspectRatio: 4 / 3, resizeMode: 'cover' }}
                                    />
                                    <Text style={styles.counterBG}>{item.news}</Text>   
                                </>        
                            }
                        </View>

                        <View className="text-info">
                            <Text className="text-lg font-semibold mt-4" style={[styles.headingStyle, textColor]}>#{ langMode == 'BN' ? item.name_bn: item.name}</Text>

                            <View className="flex flex-row mt-4 justify-between">
                                <View className="flex flex-row content-center">
                                    <View className="text-xl flex flex-row align-">
                                        <FontAwesomeIcon icon={faClock} size={12} color={iconColor} style={{opacity: 0.7, marginTop: 2, marginRight: 1}} />
                                        <Text style={[styles.metaTitle, textColor]}>{ langMode == 'BN' ? moment(new Date(item.created_at)).startOf('seconds').locale('bn-bd').fromNow() : moment(new Date(item.created_at)).startOf('seconds').locale("en").fromNow() }</Text>
                                    </View>    
                                    <View className="text-xl flex flex-row ml-1">
                                        <FontAwesomeIcon icon={faClock} size={12} color={iconColor} style={{opacity: 0.7, marginTop: 2, marginRight: 2}} />
                                        <Text style={[styles.metaTitle, textColor]}>{item.view}</Text>
                                    </View>
                                </View>

                                <View className="flex justify-items-end">
                                    <FontAwesomeIcon icon={faArrowUp} size={13} color={iconColor} transform={{ rotate: 45 }} style={{marginLeft: 15}} />
                                </View>
                            </View>
                        </View>
                    </Link>
                </View>
            ) : (
                ( item.placement_title === "Single Category") ? (
                    <View key={item.key} data-id={item.id} style={[styles.cardContainer, bgCardColor]}>
                        <TouchableOpacity onPress={() => item.action_url && WebBrowser.openBrowserAsync(item.action_url)}>
                            <View className="relative">
                                <ImageBlurLoading
                                    thumbnailSource={images.placeholder}
                                    source={{ uri: item.media[0].original_url  }} 
                                    style={{ width: '100%', height: undefined, aspectRatio: 4 / 3 }}
                                />
                            </View>

                            <View className="text-info flex flex-row">
                                <View>
                                    <Text style={styles.metaTitle} className="leading-normal">{item.button_title}</Text>
                                    <FontAwesomeIcon icon={faClock} size={12} color={iconColor} style={{opacity: 0.7, marginTop: 2, marginRight: 1}} />
                                </View>
                                <View className="flex items-center justify-between">
                                    <Text style={styles.metaTitle}>Sponsored by: {item.sponsor}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View key={item.key} data-id={item.id} style={[styles.cardContainer, bgCardColor]}>
                        <TouchableOpacity onPress={() => item.action_url && WebBrowser.openBrowserAsync(item.action_url)}>
                            <View className="relative">
                                <ImageBlurLoading
                                    thumbnailSource={images.placeholder}
                                    source={{ uri: item.media[0].original_url  }} 
                                    style={{ width: '100%', height: undefined, aspectRatio: 4 / 3 }}
                                />
                            </View>

                            <View className="text-info flex flex-row">
                                <View>
                                    <Text style={styles.metaTitle} className="leading-normal">{item.button_title}</Text>
                                    <FontAwesomeIcon icon={faClock} size={12} color={iconColor} style={{opacity: 0.7, marginTop: 2, marginRight: 1}} />
                                </View>
                                <View className="flex items-center justify-between">
                                    <Text style={styles.metaTitle}>Sponsored by: {item.sponsor}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                )
            ) 
        )
    };

    return (
        <View className="flex flex-row flex-wrap" style={{ backgroundColor: containerColor }}>
            {loading ? 
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#f9020b" />
            </View> : null}
            
            { !loading && catItem?.map( (item, index) => (
                <CardItems item={item} key={index} />
            ) ) }
        </View>
    )
}

export default AllCategory

const styles = StyleSheet.create({
    cardContainer: {
        borderRadius: 8,
        shadowColor: 'black',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 5, // Android shadow
        padding: 10,
        width: '44.85%',
        margin: 10,
        overflow: 'hidden'
    },
    cardContainerDark: {
        backgroundColor: '#272727',
    },    
    cardContainerWhite: {
        backgroundColor: 'white',
    },
    counterBG: {
        backgroundColor: '#f9020b',
        borderRadius: 15,
        display: 'flex',
        textAlign: 'center',
        width: 30,
        height: 30,
        color: 'white',
        lineHeight: 25,
        overflow: 'hidden',
        position: 'absolute',
        right: 10,
        bottom: 10
    },
    headingStyle: {
       marginBottom: -8,
       fontSize: 16,
       width: 120,
       lineHeight: 22
    },
    metaTitle: {
        fontSize: 12,
        marginHorizontal: 5,
        marginTop: -1,
        marginBottom: 8
    },
    textDark: {
        color: '#131313'
    },
    textWhite: {
        color: 'white'
    }
})