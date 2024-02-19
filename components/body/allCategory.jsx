import { StyleSheet, Text, View, useColorScheme, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import axios from '../../api/axios'
import { useAuth } from '../../context/auth'
import { images } from '../../constants'
import moment from 'moment/min/moment-with-locales';
import { Link } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { Skeleton } from 'moti/skeleton';
// import { Image } from 'expo-image';

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

const AllCategory = () => {
    const { user, langMode } = useAuth();
    const [catItem, setCatItem ] = useState([]);
    const [loading, setLoading] = useState(true);
    const colorScheme = useColorScheme();

    const bgCardColor = colorScheme === 'light' ? styles.cardContainerWhite : styles.cardContainerDark;
    const textColor = colorScheme === 'light' ? styles.textDark : styles.textWhite;
    const iconColor = colorScheme === 'light' ? '#131313' : 'white';
    const containerColor = colorScheme === 'light' ? '#f8f8f8' : 'black';
    const themeStyle = colorScheme === 'light' ? 'light' : 'dark';

    useEffect(() => {
        if (user?.token) {
            const config = {
                headers: {
                  'Authorization': `Bearer ${user.token}`
                }
            };
            const getData = async() => {
                try {
                    await axios.get('/hash-tags', config)
                    .then(res => {
                        setCatItem(res.data.data);
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
            <View key={item.key} data-id={item.id} style={[styles.cardContainer, { backgroundColor: item?.bg_color ? item.bg_color : 'white' }]}>
                <Link href={`/categoryall/${item.slug}`}>
                    <View className="relative">
                        <View>
                        { item?.image ?
                            <>               
                                <Image
                                    src={ item.image } 
                                    style={{ width: '100%', height: 80, aspectRatio: 3, resizeMode: "cover" }}
                                />
                                <Text style={styles.counterBG}>{item.summary[0].totalView}</Text>   
                            </>  : 
                            <>
                                <Image
                                    source={images.placeholder} 
                                    style={{ width: '100%', height: 80, aspectRatio: 4 / 3 }}
                                />
                                <Text style={styles.counterBG}>{item.summary[0].totalView}</Text>   
                            </>        
                        }
                        </View>
                    </View>

                    <View className="p-3">
                        <Text className="text-lg font-semibold" style={[styles.headingStyle, item?.bg_color ? textColor :  styles.textDark ]}>#{ langMode == 'BN' ? item.name_bn: item.name_en}</Text>

                        <View className="flex flex-row mt-3 justify-between">
                            <View>
                                <View className="text-xl flex flex-row align-">
                                    <FontAwesomeIcon icon={faClock} size={12} color={item?.bg_color ? iconColor : '#131313'} style={{opacity: 0.7, marginTop: 2, marginRight: 1}} />
                                    <Text style={[styles.metaTitle, item?.bg_color ? textColor :  styles.textDark]}>{ langMode == 'BN' ? item.summary[0].latestHour : item.summary[0].latestHour }</Text>
                                </View>    
                            </View>
                            
                            <View>
                                <View className="flex justify-items-end">
                                    <FontAwesomeIcon icon={faArrowUp} size={13} color={item?.bg_color ? iconColor : '#131313'} transform={{ rotate: 45 }} style={{marginLeft: 15}} />
                                </View>
                            </View>
                        </View>
                    </View>
                </Link>
            </View>
        )
    };

    const EmptyCards = () => {
        return(
            <Skeleton.Group show={true}>
                <View style={{flexDirection: 'row', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10}}>
                    <View style={{width: '48.5%'}}>
                        <Skeleton colorMode={themeStyle}>
                            <View>
                                <Image
                                    source={images.placeholder} 
                                    style={{ width: '100%', height: 80, borderRadius: 10 }}
                                />
                                <Text>Lorem ipsum dolor sit amet consectetur</Text>
                            </View>              
                        </Skeleton>
                    </View>      

                    <View style={{width: '48.5%'}}>
                        <Skeleton colorMode={themeStyle}>
                            <View>
                                <Image
                                    source={images.placeholder} 
                                    style={{ width: '100%', height: 80, aspectRatio: 4 / 3, resizeMode: 'cover', borderRadius: 10 }}
                                />
                                <Text>Lorem ipsum dolor sit amet consectetur</Text>
                            </View>              
                        </Skeleton>
                    </View>

                    <View style={{width: '48.5%'}}>
                        <Skeleton colorMode={themeStyle}>
                            <View>
                                <Image
                                    source={images.placeholder} 
                                    style={{ width: '100%', height: 80, borderRadius: 10 }}
                                />
                                <Text>Lorem ipsum dolor sit amet consectetur</Text>
                            </View>              
                        </Skeleton>
                    </View>      

                    <View style={{width: '48.5%'}}>
                        <Skeleton colorMode={themeStyle}>
                            <View>
                                <Image
                                    source={images.placeholder} 
                                    style={{ width: '100%', height: 80, aspectRatio: 4 / 3, resizeMode: 'cover', borderRadius: 10 }}
                                />
                                <Text>Lorem ipsum dolor sit amet consectetur</Text>
                            </View>              
                        </Skeleton>
                    </View>
                </View>
            </Skeleton.Group>
        );
    }


    return (
        <View className="h-[calc(82vh)] flex-wrap p-5" style={{ backgroundColor: containerColor }}>            
            { loading ? (
                <EmptyCards />
            ) : (
                <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', gap: 10}}>
                    { catItem?.map( (item, index) => (
                        <CardItems item={item} key={index} />
                    ) ) }
                </View>             
            ) }
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
        padding: 0,
        margin: 0,
        overflow: 'hidden',
        width: '48.5%'
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
        left: 10,
        top: 10
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