import { StyleSheet, Text, View, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl, Share, Alert, useColorScheme } from 'react-native'
import React, { useState, useCallback } from 'react'
import ImageBlurLoading from 'react-native-image-blur-loading'
import { images } from '../../constants'
import NonUserQuery from '../../query/nonUserQuery'
import * as WebBrowser from 'expo-web-browser';
import moment from 'moment/min/moment-with-locales';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { faShare } from '@fortawesome/free-solid-svg-icons';
import Breaking from '../body/breaking'
import Footer from '../body/footer'
import { useAuth } from '../../context/auth'

const NonCard = () => { 
  const query = ''; 
  const { loading, error, news } = NonUserQuery(query);
  const {langMode} = useAuth();
  const [refreshing, setRefreshing] = useState(false)
  const colorScheme = useColorScheme();

  const iconsColors = colorScheme === 'light' ? 'black' : 'white';
  const textColors = colorScheme === 'light' ? styles.textDark : styles.textWhite;
  const borderColor = colorScheme === 'light' ? styles.borderBottomBlack : styles.borderBottomWhite;

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  //Card Items
  const CardItems = ({ item }) => {
    return(
      <View className="post-item group max-[767px]:p-6 bg-white dark:bg-transparent max-[767px]:dark:bg-[#1E1E1E]" key={item.key} data-id={item.id} style={{paddingBottom: 15}}>
        <View className={ item?.ads_image ? 'post-body ads' : 'post-body' }>
          {item?.ads_image || item.thumbnail ? (
            <TouchableOpacity onPress={() => item.action_url && WebBrowser.openBrowserAsync(item.action_url)}>
              <ImageBlurLoading
                thumbnailSource={images.placeholder}
                source={{ uri: item.ads_image || item.thumbnail }} // Use ads_image if available, otherwise use thumbnail
                style={{ width: '100%', height: undefined, aspectRatio: 16 / 9 }}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => item.source && WebBrowser.openBrowserAsync(item.source) }>
              <ImageBlurLoading
                thumbnailSource={images.placeholder}
                source={images.placeholder} // Provide a default placeholder image source when both ads_image and thumbnail are empty
                style={{ width: '100%', height: undefined, aspectRatio: 16 / 9 }}
              />
            </TouchableOpacity>
          )}
        </View>

        { item?.ads_image ? (
            <Text className="post-title font-semibold text-md md:text-3xl mt-6 !leading-[1.7em] transition-all hover:text-theme dark:text-white" style={styles.headingBold}>{ langMode == 'BN' ? item.title : item.title}</Text>
        ) : (
            <Text className="post-title font-semibold text-md md:text-3xl mt-6 !leading-[1.7em] transition-all hover:text-theme dark:text-white" style={styles.headingBold}>{ langMode == 'BN' ? item.summary_bn : item.summary_en}</Text>
        ) }

        { item.ads_image ? (
            <View style={styles.container}>
              <Text style={styles.text}>
                {langMode == 'BN' ? 'সৌজন্যে:' : 'Sponsored by:'}{' '}
                <Text style={styles.linkText}>{item.sponsor}</Text>
              </Text>
            </View>
        ) : (
          <View style={[styles.container2, borderColor]}>
            <View style={styles.row}>
              <View style={styles.column}>
                <View style={styles.iconoloumn}>
                  <FontAwesomeIcon icon={faClock} color={ iconsColors } style={{marginRight: 5, opacity: 0.6}} size={18} />
                  <Text style={[styles.timeText, textColors]}>
                    { langMode == 'BN' ? moment(new Date(item.datetime)).startOf('seconds').locale('bn-bd').fromNow() : moment(new Date(item.datetime)).startOf('seconds').locale("en").fromNow() }
                  </Text>
                </View>
                <TouchableOpacity style={styles.readMoreLink} onPress={() => navigation.navigate('Login')}>
                  <View style={styles.iconoloumn}>
                    <Text style={[styles.readMoreText, textColors]}>
                      {langMode == 'BN' ? 'বিস্তারিত' : 'Read More'}
                    </Text>
                    <FontAwesomeIcon icon={faArrowUp} color={iconsColors} style={{marginRight: 5, opacity: 0.6, transform: [{ rotate: '45deg' }]}} size={18} />
                  </View>
                </TouchableOpacity>
              </View>
              
              {item?.ads && (
                <View style={styles.column}>
                  <Text style={[styles.sponsoredText, textColors]}>
                    {langMode == 'BN' ? 'সৌজন্যে:' : 'Sponsored:'}
                  </Text>
                  <TouchableOpacity style={styles.sponsorLink}>
                    <Image source={{ uri: item.ads.sponsor_image }} style={styles.sponsorImage} />
                    <Text style={[styles.sponsorName, textColors]}>{item.ads.sponsor}</Text>
                  </TouchableOpacity>
                </View>
              )}
      
              <View style={styles.column}>
                <TouchableOpacity style={styles.shareLink} onPress={(e) => socialShareHandle(e, item.id)}>
                  <View style={styles.iconoloumn}>
                    <Text style={[styles.shareText, textColors]}>
                      {langMode == 'BN' ? 'শেয়ার' : 'Share'}
                    </Text>
                    <FontAwesomeIcon icon={faShare} color={iconsColors} style={{marginLeft: 5, fontSize: 10, opacity: 0.6 }} size={18} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) }
      </View>
    )
  }
  const socialShareHandle = async(e, item) => {
    try {
      const result = await Share.share({
        message: langMode == 'BN' ? item.summary_bn : item.summary_en,
        url: `https://shironam.netlify.app/news/${item.id}`
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }    
    } catch(error) {
      Alert.alert(error.message);
    }
  };    

  return (
    <FlatList
      data={news}
      renderItem={({ item }) => <CardItems item={item} />}
      keyExtractor={(item, index) => index.toString()}
      ListHeaderComponent={
        <Breaking />
      }
      ListFooterComponent={
        <>
          { loading ? 
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#f9020b" />
            </View> : null
          }          
          
          { error ? 
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text>{langMode == 'BN' ? 'Error' : 'ত্রুটি হচ্ছে...'}</Text>
            </View> : null
          }
          <Footer />
        </>
      }
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
};

export default NonCard

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 2,
    paddingTop: 7,
    paddingBottom: 5,
  },
  text: {
    fontSize: 20,
    color: 'black', // Change to your desired text color
  },
  linkText: {
    fontWeight: 'bold',
    color: 'blue', // Change to your desired link color
  },
  container2: {
    borderBottomWidth: 2,
    paddingTop: 7,
    paddingBottom: 5,
  },
  borderBottomBlack: {
    borderBottomColor: '#131313'
  },
  borderBottomWhite: {
    borderBottomColor: '#f8f8f8'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  column: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 16,
    marginRight: 10,
  },
  readMoreLink: {
    marginTop: 6,
  },
  readMoreText: {
    fontWeight: 'normal',
    fontSize: 15,
    marginTop: -6,
  },
  sponsoredText: {
    fontSize: 15,
    color: 'black', // Change to your desired text color
  },
  sponsorLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  iconoloumn: {
    flexDirection: 'row',
    alignItems: 'center',
  },  
  sponsorImage: {
    width: 20,
    height: 20,
    resizeMode: 'cover',
    marginRight: 5,
  },
  sponsorName: {
    fontSize: 13,
  },
  shareLink: {
    marginTop: 6,
  },
  shareText: {
    fontSize: 15, // Change to your desired link color
  },
  headingBold: {
    fontSize: 18
  },
  textWhite: {
    color: 'white'
  },
  textDark: {
    color: '#131313'
  }
})