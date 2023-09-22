import { StyleSheet, Text, View, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import axios from '../../api/axios'
import { useAuth } from '../../context/auth'
import ImageBlurLoading from 'react-native-image-blur-loading'
import { images } from '../../constants'
import moment from 'moment'
import { Link } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';

const AllCategory = () => {
    const { user, langMode } = useAuth();
    const [catItem, setCatItem ] = useState([]);

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
                    });
                } catch (e) {
                    console.log(e);
                }
            };
            getData();
        }
    }, [])

    const footerComponent = () => {

    };    
    
    const loadMoreItems = () => {

    };

    const CardItems = ({ item }) => {
        return(
            item.name ? (
                <View key={item.key} data-id={item.id} style={styles.cardContainer}>
                    <Link href={`/subcategory/${item.slug}`}>
                        <View className="relative">
                            { item?.category_image ?
                                <>               
                                    <ImageBlurLoading
                                        thumbnailSource={images.placeholder}
                                        source={{ uri: item.category_image  }} 
                                        style={{ width: '100%', height: undefined, aspectRatio: 4 / 3 }}
                                    />
                                    <Text style={styles.counterBG}>{item.news}</Text>   
                                </>  : 
                                <>
                                    <ImageBlurLoading
                                        thumbnailSource={images.placeholder}
                                        source={images.placeholder} 
                                        style={{ width: '100%', height: undefined, aspectRatio: 4 / 3 }}
                                    />
                                    <Text style={styles.counterBG}>{item.news}</Text>   
                                </>        
                            }
                        </View>

                        <View className="text-info">
                            
                            <Text className="text-lg font-semibold mt-4 -mb-3">#{item.name}</Text>

                            <View className="flex flex-row mt-4 justify-between">
                                <View className="flex flex-row content-center">
                                    <View className="text-xl flex flex-row align-">
                                        <FontAwesomeIcon icon={faClock} size={12} style={{opacity: 0.7, marginTop: 2, marginRight: 1}} />
                                        <Text>{ moment(new Date(item.created_at)).startOf('second').fromNow(true) }</Text>
                                    </View>    
                                    <View className="text-xl flex flex-row ml-1">
                                        <FontAwesomeIcon icon={faClock} size={12} style={{opacity: 0.7, marginTop: 2, marginRight: 2}} />
                                        <Text>{item.view}</Text>
                                    </View>
                                </View>

                                <View className="flex justify-items-end">
                                    <FontAwesomeIcon icon={faArrowUp} size={13} transform={{ rotate: 45 }} style={{marginLeft: 15}} />
                                </View>
                            </View>
                        </View>
                    </Link>
                </View>
            ) : (
                ( item.placement_title === "Single Category") ? (
                    <View key={item.key} data-id={item.id} style={styles.cardContainer}>
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
                                    <Text className="leading-normal">{item.button_title}</Text>
                                    <FontAwesomeIcon icon={faClock} size={12} style={{opacity: 0.7, marginTop: 2, marginRight: 1}} />
                                </View>
                                <View className="flex items-center justify-between">
                                    <Text>Sponsored by: {item.sponsor}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View key={item.key} data-id={item.id} style={styles.cardContainer}>
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
                                    <Text className="leading-normal">{item.button_title}</Text>
                                    <FontAwesomeIcon icon={faClock} size={12} style={{opacity: 0.7, marginTop: 2, marginRight: 1}} />
                                </View>
                                <View className="flex items-center justify-between">
                                    <Text>Sponsored by: {item.sponsor}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                )
            ) 
        )
    };

    return (
        <View className="flex flex-row flex-wrap space-x-4 clear-both dark:text-white ml-2.5">
            { catItem?.map( (item, index) => (
                <CardItems item={item} key={index} />
            ) ) }
        </View>
    )
}

export default AllCategory

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: 'white',
        borderRadius: 8,
        shadowColor: 'black',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 5, // Android shadow
        padding: 10,
        width: '44%',
        margin: 10
    },
    counterBG: {
        backgroundColor: '#f9020b',
        borderRadius: 15,
        display: 'flex',
        textAlign: 'center',
        width: 30,
        height: 30,
        color: 'white',
        lineHeight: 30,
        overflow: 'hidden',
        position: 'absolute',
        right: 10,
        bottom: -15
    }
})