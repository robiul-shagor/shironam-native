import { StyleSheet, Text, View, TouchableOpacity, ScrollView, useColorScheme } from 'react-native'
import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import axios from '../../api/axios';
import { useAuth } from '../../context/auth';
import { useRouter, Link } from 'expo-router';

const CategoriesPage = () => {
    const [expanded, setExpanded] = useState(null);
    const [loading, setLoading] = useState(true); 
    const [data, setData] = useState([]); 
    const { user, logOut, langMode } = useAuth();
    const router = useRouter();
    const colorScheme = useColorScheme();

    const bgStyle = colorScheme === 'light' ? styles.bgWhite : styles.bgDark;
    const textStyle = colorScheme === 'light' ? styles.textDark : styles.textWhite;
    const borderStyle = colorScheme === 'light' ? styles.borderDark : styles.borderWhite;
    const iconsStyle = colorScheme === 'light' ? '#191919' : 'white';

    const makeLowercase = ( item ) => {
        return item.split(" ").join("-").toLowerCase()
    }

    const toggleAccordion = (index) => {
      setExpanded(expanded === index ? null : index);
    };

    const getCategory = async(retryCount = 3, delay = 1000) => {
        if( user?.token ) {
            const bearer_token = `Bearer ${user.token}`;
            try {
                const config = {
                    headers: {
                    'Authorization': bearer_token
                    }
                };
    
                await axios.get('/interest-list', config)
                .then(res => {
                    setData(res.data.data);
                });
            } catch (error) {
                if (retryCount > 0 && error.response?.status === 429) {
                    await new Promise((resolve) => setTimeout(resolve, delay));
                    getCategory(retryCount - 1, delay * 2); 
                } else if(error.response?.data?.message === 'Unauthenticated.' ) {
                    logOut();
                    router.push('/home');
                } else {
                    console.log(error);
                    setLoading(false);
                }
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(()=> {
        getCategory();
    }, [])

    return (
        <ScrollView>
            <View style={ [styles.parentContainer, bgStyle] }>
                {data.map((section, index) => (
                <View key={index} style={[styles.mainAccordian, borderStyle]}>
                    <TouchableOpacity onPress={() => toggleAccordion(index)}>
                        <View style={styles.accordianTitle}>
                            <Text style={[{fontSize: 16}, textStyle]}>{ langMode == 'BN' ? section.name_bn : section.name_en }</Text>
                            <FontAwesomeIcon icon={faAngleDown} color={iconsStyle} size={15} style={{ transform: [{ rotate: expanded === index ? '180deg' : '0deg' }] }} />
                        </View>
                    </TouchableOpacity>
                    {expanded === index && (
                    <View style={styles.accodianContent}>
                        {section?.interest.map((item, i) => (
                            <Link href={`/subcategory/${makeLowercase(item.name_en).replace(/\s+/g, '-')}`} key={i} style={styles.itemEle}>
                                <Text style={[{fontSize: 15, paddingHorizontal: 15}, textStyle]}>
                                    - { langMode == 'BN' ? item.name_bn : item.name_en }
                                </Text>
                            </Link>
                        ))}
                    </View>
                    )}
                </View>
                ))}
            </View>
      </ScrollView>
    )
}

export default CategoriesPage

const styles = StyleSheet.create({
    bgWhite: {
        backgroundColor: 'white',
    },
    bgDark: {
        backgroundColor: '#272727',
    },    
    textWhite: {
        color: 'white',
    },
    textDark: {
        color: '#191919',
    },
    parentContainer: {
        height: '100%',
        flex: 1,
        paddingHorizontal: 10,
        paddingVerticalVertical: 10
    },
    accordianTitle: {
        flex: 1,
        justifyContent: 'space-between',
        flexDirection: 'row',
        padding: 15
    },
    accodianContent: {
        padding: 15,
        paddingTop: 0
    },
    mainAccordian: {
        borderBottomWidth: 1
    },
    itemEle: {
        paddingHorizontal: 3,
        paddingVertical: 3
    },
    borderWhite: {
        borderBottomColor: '#191919',
    },
    borderDark: {
        borderBottomColor: '#dddddd',
    },
})