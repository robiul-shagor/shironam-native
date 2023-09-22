import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native'
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

    const sections = [
        {
          title: 'Section 1',
          content: 'Content for section 1...',
        },
        {
          title: 'Section 2',
          content: 'Content for section 2...',
        },
        // Add more sections as needed
    ];

    return (
        <ScrollView>
            <View style={ styles.parentContainer }>
                {data.map((section, index) => (
                <View key={index} style={styles.mainAccordian}>
                    <TouchableOpacity onPress={() => toggleAccordion(index)}>
                        <View style={styles.accordianTitle}>
                            <Text>{ langMode == 'BN' ? section.name_bn : section.name_en }</Text>
                            <FontAwesomeIcon icon={faAngleDown} size={13} style={{ transform: [{ rotate: expanded === index ? '180deg' : '0deg' }] }} />
                        </View>
                    </TouchableOpacity>
                    {expanded === index && (
                    <View style={styles.accodianContent}>
                        {section?.interest.map((item, i) => (
                            <Link href={`/subcategory/${makeLowercase(item.name_en)}`} key={i} style={styles.itemEle}>
                                <Text>
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
    parentContainer: {
        backgroundColor: 'white',
        height: '100%',
        flex: 1,
        marginHorizontal: 10,
        marginVertical: 10
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
        borderBottomColor: '#ddd',
        borderBottomWidth: 1
    },
    itemEle: {
        paddingHorizontal: 3,
        paddingVertical: 3
    }
})