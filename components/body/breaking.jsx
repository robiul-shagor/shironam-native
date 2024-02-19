import { StyleSheet, Text, View, useColorScheme, Image } from 'react-native'
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useAuth } from '../../context/auth';
import axios from '../../api/axios';
import Swiper from 'react-native-swiper';
import { images } from '../../constants';
import { Skeleton } from 'moti/skeleton';

const Breaking = () => {
    const { user, langMode } = useAuth();
    const [newsItem, setNewsItem ] = useState([]);
    const colorScheme = useColorScheme();
    const [loading, setLoading] = useState(true);

    const bgColors = colorScheme === 'light' ? styles.containerWhite : styles.containerDark;
    const textColors = colorScheme === 'light' ? styles.textDark : styles.textWhite;
    const imageBG = colorScheme === 'light' ? images.BreakingImage : images.BreakingImageDark;
    const themeStyle = colorScheme === 'light' ? 'light' : 'dark';


    const getData = async() => {
        if (user?.token) {
            const bearer_token = `Bearer ${user.token}`;
            try {
                const config = {
                    headers: {
                      'Authorization': bearer_token
                    }
                };

                const response = await axios.get('/breaking-news', config);
                const data = response.data.data;
                setNewsItem(data);
                setLoading(false);
            } catch (e) {
                console.log(e);
            }
        } else {
            try {    
                const response = await axios.get('/breaking-news-without-authentication', {});
                const data = response.data.data;
                setNewsItem(data);
                setLoading(false);
            } catch (e) {
                console.log(e);
            }
        }
    };

    useEffect(() => {
        const data = async() => {
            await getData();
        }
        data();
    }, [])

    return (
        <View style={ [bgColors, { marginBottom: 30, marginTop: 20, marginHorizontal: 15  }] }>
            <View className="p-5">
                { loading ? (
                    <Skeleton.Group show={true}>
                        <View className="mb-1">
                            <Skeleton radius="square" colorMode={themeStyle}>
                                <Text>Lorem ipsum dolor</Text>
                            </Skeleton>
                        </View>     
                        <View className="mb-1">
                            <Skeleton radius="square" colorMode={themeStyle}>
                                <Text>Lorem ipsum dolor</Text>
                            </Skeleton>
                        </View>
                        <View className="mb-1">
                            <Skeleton radius="square" colorMode={themeStyle}>
                                <Text>Lorem ipsum dolor</Text>
                            </Skeleton>
                        </View>
                    </Skeleton.Group>
                ) : (
                    <Swiper autoplay={true} loop={true} height="auto" automaticallyAdjustContentInsets={true} showsButtons={false} showsPagination={false}>
                        { newsItem.map( (news, index) => (
                            <View key={ index } className="flex flex-row" style={bgColors}>
                                <Text style={[textColors, {fontSize: 14, textAlign: 'center', lineHeight: 23}]}><Text style={{color: '#ff1c22', fontWeight: 'bold'}}>// </Text>{ langMode == 'BN' ? news.summary_bn : news.summary_en}</Text>
                            </View>
                        ) ) }
                    </Swiper> 
                ) }
            </View>
            <Image source={ imageBG } style={{width: '100%', resizeMode: 'contain', marginBottom: -10}} />
        </View>
    )
}

export default Breaking

const styles = StyleSheet.create({
    linkItem: {
        backgroundColor: '#f9020b', // Replace with your theme color
        borderColor: '#f9020b', // Replace with your theme color
        borderWidth: 1,
        borderRadius: 0,
        margin: 0,
    },
    menuItem: { 
        flex: 1,
        flexDirection: 'row', 
        alignItems: 'center', 
        flex: 1,
        justifyContent: 'space-between', 
        margin: 0, 
        paddingTop: 13,
        paddingLeft: 13,
        paddingRight: 13,
        paddingBottom: 8,
    },
    nonActive: {
        backgroundColor: 'transparent', 
        borderColor: '#777',
        borderWidth: 1,
        borderRadius: 0,
        margin: 0,
        cursor: 'pointer',

    },
    textSize: {
        fontSize: 13,
        position: 'relative',
        top: -1
    },
    containerWhite: {
        backgroundColor: '#ffffff'
    }, 
    containerDark: {
        backgroundColor: '#131313'
    },
    textDark: {
        color: '#131313'
    },
    textWhite: {
        color: 'white'
    }
})