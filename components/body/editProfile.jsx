import { StyleSheet, Text, View, ActivityIndicator, Alert, Image, TouchableOpacity, TextInput, useColorScheme } from 'react-native'
import React, { useState, useEffect } from 'react'
import axios from '../../api/axios'
import { useAuth } from '../../context/auth'
import { Dropdown } from 'react-native-element-dropdown';
import * as ImagePicker from 'expo-image-picker';

const EditProfile = () => {
  const { user, baseURL, langMode } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');
  const [occupation, setOccupation] = useState('');
  const [country, setCountry] = useState('');
  const [countryList, setCountryList] = useState([]);
  const [city, setCity] = useState('');
  const [cityList, setCityList] = useState([]);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [passwordCurrent, setPasswordCurrent] = useState('');
  const [newPass, setNewPass] = useState('');
  const [reTypePass, setReTypePass] = useState('');


  const [error, setError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [staticData, setStaticData] = useState({});
  const [processing, setProcessing] = useState(false);

  const colorScheme = useColorScheme();
  const textColor = colorScheme === 'light' ? '#131313' : 'white';


  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  // Get Personal Data
  useEffect(() => {
    if (user?.token) {
      // Fetch the user's profile image from the API
      axios.get('/me', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then(res => {
        res.data?.normal_user?.image && setProfileImage( baseURL + '/' + res.data.normal_user.image);
        setFirstName(res.data?.normal_user?.name || '');
        setLastName(res.data?.normal_user?.last_name || '');
        setEmail(res.data?.normal_user?.email || '');
        setPhone(res.data?.normal_user?.phone || '');
        setBirthDate(res.data?.normal_user?.dob || '');
        setGender(res.data?.normal_user?.gender.toString() || '');
        setCountry(res.data?.normal_user?.country.toString() || '');
        setCity(res.data?.normal_user?.city.toString() || '');
        setMaritalStatus(res.data?.normal_user?.marital_status.toString() || '');
        setOccupation(res.data?.normal_user?.occupations ? JSON.parse(res.data?.normal_user?.occupations)[0] : '');
      })
      .catch(error => {
          if(error.response?.data?.message === 'Unauthenticated.' ) {
              logOut();
              router.push('/home');
          } else {
              if (error?.response?.status === 401) {
                  // Show an alert asking the user to log in again
                  Alert.alert(
                      langMode === 'BN' ? 'অননুমোদিত' : 'Unauthorized',
                      langMode === 'BN' ? 'আপনার সেশনের মেয়াদ শেষ হয়ে গেছে। আবার লগইন করুন.' : 'Your session has expired. Please log in again.',
                      [
                          {
                              text: langMode === 'BN' ? 'ঠিক আছে' : 'Okey',
                              onPress: () => {
                                  router.push('/login');
                              }
                          }
                      ]
                  );
              }
          }
      });
    }
  }, [user]);

  // Get Static Data
  useEffect(() => {
    if( user?.token ) {
      async function fetchData() {
        try {
          const res = await axios.get('/personal-static-data', {
            headers: {
              'Authorization': `Bearer ${user.token}`
            }
          });
          setStaticData(res.data);
        } catch (error) {
          console.log(error);
        }
      }
      fetchData();
    }
  }, [user]);

  // Get Country List
  useEffect(() => {
    if( user?.token ) {
      async function getCountryList() {
        try {
          const res = await axios.get('/country-list', {
            headers: {
              'Authorization': `Bearer ${user.token}`
            }
          });
          setCountryList(res.data.data);
        } catch (error) {
          console.log(error);
        }
      }
      getCountryList();
    }
  }, [user]);

  // Get City Lists
  useEffect(() => {
    async function getCityList() {
      try {
        if (country) {
          const res = await axios.get(`/city-list/${country}`, {
            headers: {
              'Authorization': `Bearer ${user.token}`
            }
          });
          setCityList(res.data.cities);
        }
      } catch (error) {
        console.log(error);
      }
    }
    getCityList();
  }, [user, country])


  // Hangle Profile Images changes
  const handleFileChange = async() => {
    if( user?.token ) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
  
      if (!result.canceled) { 
        const formData = new FormData();
        formData.append('image', result.assets);
  
        const res = await axios.post('/update-profile-picture', formData, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        setProfileImage(baseURL + '/' + res.data.image);
        setSuccess('success');
        setSuccessMessage(langMode === 'BN' ? 'প্রোফাইল ছবি আপডেট সফল' : 'Profile Picture update successful');
      }
    }
  };

  // Handle Profile Update
  const updateProfile = async() => {
    if( user?.token ) {
      try {
        const payload = {
          name: firstName,
          last_name: lastName,
          country_id: parseInt(country),
          city_id: parseInt(city),
          date_of_birth: birthDate,
          gender: parseInt(gender),
          phone: phone,
          marital_status: parseInt(maritalStatus),
          occupations: parseInt(occupation)
        };

        if( passwordCurrent ) {
          payload.old_password = passwordCurrent;
        }
  
        if( newPass ) {
          payload.new_password = newPass;
        }
  
          // Perform confirmation password validation
        if (newPass !== reTypePass) {
          setError('error');
          setErrorMessage(langMode === 'BN' ? "নতুন পাসওয়ার্ড এবং নিশ্চিত পাসওয়ার্ড মেলে না" : "New password and confirm password do not match");
          return;
        }
  
        if( reTypePass ) {
          payload.confirm_password = reTypePass;
        }
        
        const res = await axios.put('/profile-update', payload, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
  
        if (res?.data?.status === 'Error') {
          setError('error');
          setErrorMessage(res.data.message);
        } else {
          setSuccess('success');
          setSuccessMessage(res.data.message);
        }
      } catch (e) {
        setError('error');
        setErrorMessage(e.response?.data?.message || (langMode === 'BN' ? 'ত্রুটি হয়েছে' : 'Error occurred'));
      }
    }
  };

  // Update default Data which save before

  // Re organize gender data
  const genderData = staticData?.genders?.map(item => {
    return { label: langMode == 'BN' ? item.name_bn : item.name_en, value: item.id.toString() };
  }) || [];  
  
  // Re organize marital data
  const maritalData = staticData?.marital_status?.map(item => {
    return { label: langMode == 'BN' ? item.name_bn : item.name_en, value: item.id.toString() };
  }) || [];  
  
  // Re organize occupations data
  const occupationData = staticData?.occupations?.map(item => {
    return { label: langMode == 'BN' ? item.name_bn : item.name_en, value: item.id.toString() };
  }) || [];

  // Re organize country data
  const countryData = countryList?.map(item => {
    return { label: item.name, value: item.id.toString() };
  }) || [];  
  
  // Re organize city data
  const cityData = cityList?.map(item => {
    return { label: item.name, value: item.id.toString() };
  }) || [];


  return (
    <View className="flex-1 justify-center bg-white dark:bg-[#272727] dark:text-white py-15 px-5">
      <View className="pt-10">
        <Text className="mb-8 font-semibold text-xl" style={{ color: textColor }}>{ langMode == 'BN' ? 'প্রোফাইল সেটিংস' : 'Profile Settings' }</Text>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 0, marginTop: 0, borderBottomWidth: 1, borderBottomColor: '#ebebeb', paddingBottom: 15, marginBottom: 15 }}>
          <View style={{marginRight: 15}}>
          {profileImage && (
              <Image source={{ uri: profileImage }} style={{ width: 65, height: 65, borderRadius: 100 }} />
          ) }
          </View>
          <View>
            <TouchableOpacity onPress={handleFileChange}>
              <Text className="text-left text-lg font-bold" style={{ color: textColor }}>{user?.normal_user?.name} {user?.normal_user?.lastName}</Text>
              <Text style={{ color: textColor }}>{ langMode == 'BN' ? 'প্রোফাইল ফটো পরিবর্তন করুন' : 'Change profile photo' }</Text>
            </TouchableOpacity>
          </View>
      </View> 

      <View className="mb-1">
        <Text style={{ color: textColor }} className="text-xl font-semibold">{ langMode == 'BN' ? 'ব্যক্তিগত তথ্য' : 'Personal Information' }</Text>
      </View>

      <View className="mb-5">
        <View className="form-group mt-6">
          <Text style={{ color: textColor }}>
            { langMode == 'BN' ? 'নামের প্রথম অংশ' : 'First Name' }
            <Text style={{ color: '#ff0000' }}>*</Text>
          </Text>

          <TextInput
            className="form-control bg-white dark:bg-[#272727] dark:text-white shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
            value={firstName}
            onChangeText={setFirstName}
            autoCapitalize="none"
            autoCorrect={false}
            required
          />
        </View>  

        <View className="form-group mt-6">
          <Text style={{ color: textColor }}>
            { langMode == 'BN' ? 'নামের শেষাংশ' : 'Last Name' }
            <Text style={{ color: '#ff0000' }}>*</Text>
          </Text>

          <TextInput
            className="form-control bg-white dark:bg-[#272727] dark:text-white shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
            value={lastName}
            onChangeText={setLastName}
            autoCapitalize="none"
            autoCorrect={false}
            required
          />
        </View>  

        <View className="form-group mt-6">
          <Text style={{ color: textColor }}>
            { langMode == 'BN' ? 'জন্ম তারিখ' : 'Date of Birth' }
            <Text style={{ color: '#ff0000' }}>*</Text>
          </Text>

          <TextInput
            className="form-control bg-white dark:bg-[#272727] dark:text-white shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
            value={birthDate}
            onChangeText={setBirthDate}
            placeholder="YYYY-MM-DD"
            autoCapitalize="none"
            autoCorrect={false}
            required
          />
        </View>  

        <View className="form-group mt-6">
          <Text style={{ color: textColor }}>
            { langMode == 'BN' ? 'লিঙ্গ' : 'Gender' }
            <Text style={{ color: '#ff0000' }}>*</Text>
          </Text>

          <Dropdown 
            style={styles.dropdown}
            data={genderData}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={langMode == 'BN' ? 'লিঙ্গ নির্বাচন' : 'Select Gender'}
            value={gender}
            search
            onChange={item => {
              setGender(item.value);
            }}
          />
        </View>  

        <View className="form-group mt-6">
          <Text style={{ color: textColor }}>
            { langMode == 'BN' ? 'বৈবাহিক অবস্থা' : 'Marital Status' }
          </Text>

        
          <Dropdown 
            style={styles.dropdown}
            data={maritalData}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={langMode == 'BN' ? 'বৈবাহিক অবস্থা নির্বাচন করুন' : 'Select Status'}
            value={maritalStatus}
            search
            onChange={item => {
              setMaritalStatus(item.value);
            }}
          />
        </View>

        <View className="form-group mt-6">
          <Text style={{ color: textColor }}>
            { langMode == 'BN' ? 'পেশা' : 'Occupation' }
          </Text>

          <Dropdown 
            style={styles.dropdown}
            data={occupationData}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={langMode == 'BN' ? 'পেশা নির্বাচন করুন' : 'Select Occupation'}
            value={occupation}
            search
            onChange={item => {
              setOccupation(item.value);
            }}
          />
        </View>        
        
        <View className="form-group mt-6">
          <Text style={{ color: textColor }}>
            { langMode == 'BN' ? 'দেশ' : 'Country' }
          </Text>

          <Dropdown 
            style={styles.dropdown}
            data={countryData}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={ langMode == 'BN' ? 'দেশ' : 'Country' }
            value={country}
            search
            onChange={item => {
              setCountry(item.value);
            }}
          />
        </View>      

        <View className="form-group mt-6">
          <Text style={{ color: textColor }}>
            { langMode == 'BN' ? 'শহর' : 'City' }
          </Text>
        
          <Dropdown 
            style={styles.dropdown}
            data={cityData}
            maxHeight={250}
            labelField="label"
            valueField="value"
            placeholder={ langMode == 'BN' ? 'শহর' : 'City' }
            value={city}
            search
            onChange={item => {
              setCity(item.value);
            }}
          />
        </View>
      </View>

      <View className="mb-1">
        <Text className="text-xl font-semibold" style={{ color: textColor }}>{ langMode == 'BN' ? 'যোগাযোগের তথ্য' : 'Contact Information' }</Text>
      </View>

      <View className="mb-1">
        <View className="form-group mt-6">
          <Text style={{ color: textColor }}>
            { langMode == 'BN' ? 'ইমেইল' : 'Email' }
            <Text style={{ color: '#ff0000' }}>*</Text>
          </Text>

          <TextInput
            className="form-control bg-white dark:bg-[#272727] dark:text-white shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline opacity-50"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={false}
            selectTextOnFocus={false}
            required
          />
        </View>  

        <View className="form-group mt-6">
          <Text style={{ color: textColor }}>
            { langMode == 'BN' ? 'ফোন' : 'Phone' }
            <Text style={{ color: '#ff0000' }}>*</Text>
          </Text>

          <TextInput
            className="form-control bg-white dark:bg-[#272727] dark:text-white shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline opacity-50"
            value={phone}
            onChangeText={setPhone}
            autoCapitalize="none"
            inputMode="tel"
            editable={false}
            selectTextOnFocus={false}
            required
          />
        </View>  
      </View>   

      <View className="mt-5">
        <Text className="text-xl font-semibold" style={{ color: textColor }}>{ langMode == 'BN' ? 'পাসওয়ার্ড পরিবর্তন' : 'Password Change' }</Text>
      </View>   

        <View className="form-group mt-6">
          <Text style={{ color: textColor }}>
            { langMode == 'BN' ? 'বর্তমান পাসওয়ার্ড' : 'Current Password' }
            <Text style={{ color: '#ff0000' }}>*</Text>
          </Text>

          <TextInput
            className="form-control bg-white dark:bg-[#272727] dark:text-white shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline opacity-50"
            value={passwordCurrent}
            onChangeText={setPasswordCurrent}
            secureTextEntry={true}
            requiredFocus={false}
            required
          />
        </View>          
        
        <View className="form-group mt-6">
          <Text style={{ color: textColor }}>
            { langMode == 'BN' ? 'নতুন পাসওয়ার্ড' : 'New Password' }
            <Text style={{ color: '#ff0000' }}>*</Text>
          </Text>

          <TextInput
            className="form-control bg-white dark:bg-[#272727] dark:text-white shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline opacity-50"
            value={newPass}
            onChangeText={setNewPass}
            secureTextEntry={true}
            requiredFocus={false}
            required
          />
        </View>          
        
        <View className="form-group mt-6">
          <Text style={{ color: textColor }}>
            { langMode == 'BN' ? 'নতুন পাসওয়ার্ড পুনরায় টাইপ করুন' : 'Re Type New Password' }
            <Text style={{ color: '#ff0000' }}>*</Text>
          </Text>

          <TextInput
            className="form-control bg-white dark:bg-[#272727] dark:text-white shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline opacity-50"
            value={reTypePass}
            onChangeText={setReTypePass}
            secureTextEntry={true}
            requiredFocus={false}
            required
          />
        </View>  
      
      <View className="mb-10">
        <View>
          <TouchableOpacity 
            onPress={updateProfile} 
            style={styles.updateButton}
            disabled={processing}
          >
            { processing ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={{ color: 'white' }}>
                { langMode == 'BN' ? 'হালনাগাদ' : 'Update' }
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <View className="mt-3">
          { error && (
            <View className="flex-1 font-bold">
              <Text style={{ color: textColor }}>{errorMessage}</Text>
            </View>
          ) }         
          
          { success && (
            <View className="flex-1 font-bold">
              <Text style={{ color: textColor }}>{successMessage}</Text>
            </View>
          ) }
        </View>
      </View>
    </View>
  )
}

export default EditProfile

const styles = StyleSheet.create({
  dropdown: {
    height: 40,
    borderColor: '#d1d5db',
    backgroundColor: 'white',
    borderWidth: 0.5,
    borderRadius: 2,
    paddingHorizontal: 8,
  },
  updateButton: {
    backgroundColor: '#f9020b',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  }
})