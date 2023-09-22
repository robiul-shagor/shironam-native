import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import axios from '../../api/axios'
import { useAuth } from '../../context/auth'
import Checkbox from 'expo-checkbox';

const MyInterests = () => {
  const [interestsData, setInterestsData] = useState([]);
  const [isCheckedList, setIsCheckedList] = useState([]);
  const [selectedValues, setSelectedValues] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [btnVisable, setBtnVisable] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [parnetInterest, setParnetInterest] = useState(false);

  const { user, langMode } = useAuth();

  // Handle Main checkbox item change
  const handleCheckboxChange = (index) => {
    const updatedCheckedList = [...isCheckedList];
    updatedCheckedList[index] = !updatedCheckedList[index];
    setBtnVisable(true);
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

  // Get interest data from api fetch
  const getData = async (retryCount = 3, delay = 1000) => {
    try {
      setIsLoading(true);
      const res = await axios.get('/interest-list', {
        headers: {
          'Authorization': `Bearer ${user.token}`,
        }
      });
      setInterestsData(res.data.data);
      setParnetInterest( res.data.data.length )
    } catch (error) {
      if (retryCount > 0 && error.response?.status === 429) {
        await new Promise((resolve) => setTimeout(resolve, delay));
        getData(retryCount - 1, delay * 2); 
      } else {
        console.log(error);
        setLoading(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if( user?.token ) {
      getData();
    }
  }, [user]);

  // Get User default data from api
  const getDefaultData = async (retryCount = 3, delay = 1000) => {
    try {
      setIsLoading(true);
      const res = await axios.get('/me', {
        headers: {
          'Authorization': `Bearer ${user.token}`,
        }
      });
      const obj = JSON.parse(res.data.normal_user.interest);
      setCheckboxState(obj); // Set checkbox state based on defaultInt values
    } catch (error) {
      if (retryCount > 0 && error.response?.status === 429) {
        await new Promise((resolve) => setTimeout(resolve, delay));
        getDefaultData(retryCount - 1, delay * 2); 
      } else {
        console.log(error);
        setLoading(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Set Checkbox state for child checkboxs
  const setCheckboxState = (obj) => {
    const updatedCheckedList = interestsData.map((item) =>
      Object.values(obj).slice(0, parnetInterest).includes(item.id.toString())
    );    
    
    const subcategories = interestsData.flatMap((item) => {
      const subcategory = item.interest.map((subcategory) => `${subcategory.name_en}-${item.id}`);
    
      const matchingSubcategories = subcategory
        .filter((subdata) => {
          const [name, parentCategoryId] = subdata.split('-');
          const subcategoryValue = item.interest.find((data) => data.name_en === name);
          return Object.values(obj).slice(parnetInterest).includes(subcategoryValue.id.toString());
        })
        .map((matchingSubcategory) => {
          const [name, parentCategoryId] = matchingSubcategory.split('-');
          return { parentCategoryId: parseInt(parentCategoryId), value: matchingSubcategory };
        });
    
      return matchingSubcategories;
    });    
    
    setIsCheckedList(updatedCheckedList);
    setSelectedValues(subcategories);
  };

  useEffect(() => {
    if( user?.token ) {
      getDefaultData()
    }
  }, [user, interestsData, parnetInterest]); 

  // Handle when user going to update
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

  return (
    <View style={styles.container}>
      <Text style={styles.mainHeading}>{langMode == 'BN' ? 'আপনার আগ্রহ সেট করুন' : 'Set your interest'}</Text>
      <Text style={styles.subHeading}>{langMode == 'BN' ? 'আপনার শীর্ষ আগ্রহের খবর নির্বাচন করুন' : 'Select your top interest news'}</Text>

      {isCheckedList.length > 0 ? (
        <View>
          { interestsData?.map((item, index) => (
            <View key={index}>
              <View style={styles.section}>
                <Checkbox
                  style={styles.checkbox}
                  value={isCheckedList[index]}
                  onValueChange={() => handleCheckboxChange(index)}
                  color={isCheckedList[index] ? '#4630EB' : undefined}
                />
                <Text style={styles.paragraph}>{ langMode == 'BN' ? item.name_bn : item.name_en }</Text>
              </View>

              <View>
                {isCheckedList[index] && (
                  <View style={styles.subCategory}>
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
                  </View>
                )}
              </View>
            </View>
          )) }
        </View>
      ) : (
        // Render a loading indicator or placeholder
        <ActivityIndicator />
      )}

      {error && ( <View><Text style={{color: 'red'}}>{langMode == 'BN' ? 'ত্রুটি হচ্ছে...' : 'Error...'}</Text></View> )}
      
      {success && ( <View><Text style={{color: '#008000'}}>{langMode == 'BN' ? 'আপনার আগ্রহ আপডেট করা হয়েছে' : 'Your interests updated'}</Text></View> )}

      <View>
        <TouchableOpacity onPress={handleSubmit} disabled={!btnVisable}
          style={styles.buttons}>
          <Text style={styles.buttonText}>
          { loading ? (
            <ActivityIndicator color="white" />
          ) : (
            langMode == 'BN' ? 'সম্পন্ন' : 'Done'
          ) }
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default MyInterests

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
    padding: 30,
    backgroundColor: 'white',
    marginTop: 15
  },  
  section: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mainHeading: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  subHeading: {
    fontSize: 18,
    marginBottom: 15
  },  
  paragraph: {
    fontSize: 15,
  },
  checkbox: {
    margin: 8,
  },
  subCategory: {
    backgroundColor: 'white',
    padding: 15,
    borderColor: '#ddd',
    borderWidth: 1,
    borderStyle: 'solid',
    marginVertical: 10
  },
  buttons: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white'
  }
})