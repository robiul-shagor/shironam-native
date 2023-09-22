import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/auth';
import axios from '../../api/axios';
import {Ticker} from 'react-native-ticker-tape';
import { Link } from 'expo-router';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faThLarge } from '@fortawesome/free-solid-svg-icons';
import { faBolt } from '@fortawesome/free-solid-svg-icons';
import { faBullhorn } from '@fortawesome/free-solid-svg-icons';


const Breaking = () => {
    const { user, langMode } = useAuth();
    const [newsItem, setNewsItem ] = useState([]);

    const getData = async() => {
        if (user?.token) {
            const bearer_token = `Bearer ${user.token}`;
            try {
                const config = {
                    headers: {
                      'Authorization': bearer_token
                    }
                };

                await axios.get('/breaking-news', config)
                .then(res => {
                    setNewsItem(res.data.data);
                });
            } catch (e) {
                console.log(e);
            }
        } else {
            try {    
                await axios.get('/breaking-news-without-authentication', {})
                .then(res => {
                    setNewsItem(res.data.data);
                });
    
            } catch (e) {
                console.log(e);
            }
        }
    };

    useEffect(() => {
        getData();
    }, [])

    return (
        <View className="breaking_news_slider mt-5 mb-3">
            <View className="container">
                <View className="slider-title flex" style={{ flexDirection: 'row', borderBottomWidth: 2, borderBottomColor: '#f9020b' }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text className="text-white inline-block px-8 py-3" style={{ backgroundColor: '#f9020b' }}>{ langMode == 'BN' ? 'ব্রেকিং' : 'Breakings'}</Text>
                    </View>
                    <View style={{
                        paddingLeft: 5, 
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 20,
                        marginTop: 10
                    }}>
                        <Ticker msPerPX={50}>
                        { newsItem.map( (news, index) => (
                            <Text key={ index }>{ langMode == 'BN' ? news.summary_bn : news.summary_en}&nbsp;|&nbsp;</Text>
                        ) ) }
                        </Ticker>
                    </View>
                </View>
                
                <View className="flex flex-row flex-wrap gap-2 pt-5">
                    <Link href='/home' className="transition-all" style={styles.linkItem}>
                        <View style={styles.menuItem}>
                            <FontAwesomeIcon size={11} icon={faThLarge} style={{marginRight: 5, color: '#fff'}} />
                            <Text style={{color: '#fff', fontSize: styles.textSize.fontSize}}>{ langMode == 'BN' ? 'ঘটনাচক্র' : 'News Feed'}</Text>
                        </View>
                    </Link>

                    <Link href={ user?.token ? '/todayNews' : '/login' } className="transition-all" style={styles.nonActive}>
                        <View style={styles.menuItem}>
                            <FontAwesomeIcon icon={faBolt} size={11} style={{marginRight: 5 }} />
                            <Text style={styles.textSize}>{ langMode == 'BN' ? 'আজকের খবর' : 'Today News'}</Text>
                        </View>
                    </Link>                    
                    
                    <Link href={ user?.token ? '/breaking' : '/login' }  className="transition-all" style={styles.nonActive}>
                        <View style={styles.menuItem}>
                            <FontAwesomeIcon icon={faBullhorn} size={11} style={{marginRight: 5 }} />
                            <Text style={styles.textSize}>{ langMode == 'BN' ? 'ব্রেকিং নিউজ' : 'Breakings'}</Text>
                        </View>
                    </Link>
                </View>
            </View>
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
        fontSize: 11
    }
})