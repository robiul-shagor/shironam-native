import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator, Image } from 'react-native'
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/auth';
import axios from '../../api/axios';
import { useRouter } from 'expo-router';
import Checkbox from 'expo-checkbox';

const SetInterestBody = () => {
    const { user, langMode } = useAuth();

    const [interestsData, setInterestsData] = useState([]);
    const [isCheckedList, setIsCheckedList] = useState([]);
    const [selectedValues, setSelectedValues] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [btnVisable, setBtnVisable] = useState(false);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    const router = useRouter();

    const onSkip = () => {
        router.push('/home')
    };

    const handleSubmit = () => {
        if( user?.token ) {
          const selectedCheckboxValues = interestsData.reduce((selectedValues, item, index) => {
            if (isCheckedList[index]) {
              return [...selectedValues, item.id];
            }
            return selectedValues;
          }, []);
      
          const selectedSubcategoryValues = selectedValues.reduce((subcategoryValues, selectedValue) => {
            const [dataNameEn, parentCategoryId] = selectedValue.value.split('-');
            const parentCategory = interestsData.find((item) => item.id == parentCategoryId);
            
            if (parentCategory) {
              const subcategoryValue = parentCategory.interest.find((data) => data.name_en == dataNameEn);
              if (subcategoryValue) {
                return [...subcategoryValues, subcategoryValue.id];
              }
            }
            
            return subcategoryValues;
          }, []);
      
          setLoading(true);
          
          try {
            // First 4 should be parent category
            // rest are child cateogry
            const finalChoice = [...selectedCheckboxValues, ...selectedSubcategoryValues];
            axios.put('/update-interest', {
              interests: finalChoice.toString()
            }, {headers: {
              'Authorization': `Bearer ${user.token}`,
            }})
            .then(res => {
              setSuccess(true);
              router.push('/home')
            });
          } catch (e) {
            setError(true);
            setLoading(false);
            // Hide success after 10 seconds
            setTimeout(() => {
              setError(false);
            }, 10000);
          } finally {
            setLoading(false);
            // Hide success after 10 seconds
            setTimeout(() => {
              setSuccess(false);
            }, 10000);
          }
        }
    };

    // Handle Main checkbox item change
    const handleCheckboxChange = (index) => {
        const updatedCheckedList = [...isCheckedList];
        updatedCheckedList[index] = !updatedCheckedList[index];
        setIsCheckedList(updatedCheckedList);
    };

    // Handle When Sub Category Item changes
    const handleCheckboxChangeValue = (parentCategoryId, value) => {
        setBtnVisable(true);
        const isChecked = selectedValues.some(selectedValue => selectedValue.parentCategoryId === parentCategoryId && selectedValue.value === value);

        if (isChecked) {
            setSelectedValues(prevSelectedValues =>
                prevSelectedValues.filter(selectedValue => !(selectedValue.parentCategoryId === parentCategoryId && selectedValue.value === value))
            );
        } else {
            setSelectedValues(prevSelectedValues => [...prevSelectedValues, { parentCategoryId, value }]);
        }
    };

    useEffect(() => {
        if( user?.token ) {
            const getData = async () => {
              try {
                setIsLoading(true);
                const res = await axios.get('/interest-list', {
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                    }
                });

                setInterestsData(res.data.data);
              } catch (error) {
                console.log(error);
              } finally {
                setIsLoading(false);
              }
            };
          
            getData();
        }
    }, [user]);

    return (
        <View className="flex flex-row flex-wrap bg-white" style={ styles.parentContainer }>
            <Text className="text-xl font-bold mb-5">{langMode == 'BN' ? 'আপনি কি আগ্রহী তা আমাদের বলুন৷' : 'Tell us what you are interested in'}</Text>

            { interestsData?.map((item, index) => (
                <View key={index} style={ styles.cardContainer }>
                    <Image
                        source={{ uri: item.image  }} 
                        style={{ width: '100%', height: undefined, aspectRatio: 4 / 3 }}
                    />
                    <View style={styles.overlay}>
                        <View className="absolute top-3 right-3">
                            <Checkbox
                                value={isCheckedList[index]}
                                onValueChange={() => handleCheckboxChange(index)}
                                color={isCheckedList[index] ? '#4630EB' : '#ffffff'}
                            />
                        </View>

                        <Text className="absolute bottom-3 left-3 font-medium text-xl text-white">
                            #{ langMode == 'BN' ? item.name_bn : item.name_en }
                        </Text>
                        
                        {isCheckedList[index] && (
                            <View style={styles.dropdown}>
                                <ScrollView showsVerticalScrollIndicator={false}>
                                    <View>
                                        <Text>{langMode == 'BN' ? 'সাব ক্যাটাগরি নির্বাচন করুন' : 'Select Sub Categories'}</Text>
                                    </View>
                                    <View>
                                    {
                                        item?.interest?.map((data, indexSub) => (
                                        <View key={indexSub}>
                                            <View style={styles.section}>
                                            <Checkbox
                                                style={styles.checkbox}
                                                value={selectedValues.some(
                                                (selectedValue) => selectedValue.parentCategoryId === item.id && selectedValue.value === `${data.name_en}-${item.id}`
                                                )}
                                                onValueChange={() => handleCheckboxChangeValue( item.id, `${data.name_en}-${item.id}` )}
                                                color={selectedValues.some(
                                                (selectedValue) => selectedValue.parentCategoryId === item.id && selectedValue.value === `${data.name_en}-${item.id}`
                                                ) ? '#4630EB' : undefined}
                                            />
                                            <Text style={styles.paragraph}>{ langMode == 'BN' ? data.name_bn : data.name_en }</Text>
                                            </View>
                                        </View>
                                        ))
                                    }
                                    </View>
                                </ScrollView>
                            </View>
                        )}
                    </View>
                </View>
            )) }

            <View style={styles.btnWrapper}>
                <TouchableOpacity onPress={handleSubmit}
                style={styles.buttons}>
                    <Text style={styles.buttonText}>
                    { loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        langMode == 'BN' ? 'সম্পন্ন' : 'Done'
                    ) }
                    </Text>
                </TouchableOpacity>     
                
                <TouchableOpacity onPress={onSkip}
                style={styles.buttons}>
                    <Text style={styles.buttonText}>
                    { loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        langMode == 'BN' ? 'এড়িয়ে যান' : 'Skip'
                    ) }
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default SetInterestBody

const styles = StyleSheet.create({
    parentContainer: {
        backgroundColor: 'white',
        padding: 30,
        marginHorizontal: 15,
        marginTop: 15
    },
    cardContainer: {
        backgroundColor: 'white',
        borderRadius: 15,
        width: '100%',
        marginBottom: 20,
        position: 'relative',
        zIndex: 1,
        flexDirection: 'column',
        overflow: 'hidden',
    },
    overlay: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        borderRadius: 0,
        zIndex: 0,
        overflow: 'hidden'
    },
    dropdown: {
        position: 'absolute',
        left: 0,
        top: 40,
        backgroundColor: 'white',
        padding: 15,
        zIndex: 3,
        right: 15,
        left: 15,
        bottom: 15,
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10
    },
    paragraph: {
        marginLeft: 5
    },
    buttons: {
        backgroundColor: 'black',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        width: '100%'
    },
    buttonText: {
        color: 'white'
    },
    btnWrapper: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap'
    }
})