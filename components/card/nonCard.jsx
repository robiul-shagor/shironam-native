import { StyleSheet, Text, View, TouchableOpacity, FlatList, RefreshControl, Share, Alert, useColorScheme, Image, Dimensions } from 'react-native'
import React, { useState, useCallback, useMemo } from 'react'
import { useRouter } from 'expo-router'
import { images } from '../../constants'
import NonUserQuery from '../../query/nonUserQuery'
import moment from 'moment/min/moment-with-locales';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { faShare } from '@fortawesome/free-solid-svg-icons';
import Breaking from '../body/breaking'
import { useAuth } from '../../context/auth'
import EmptyComponent from './emptyComponent';

const MemoizedImageBlurLoading = React.memo(({ item }) => (
  <Image
    source={{ uri: item.ads_image || item.crop_image }}
    style={{ width: '100%', height: undefined, aspectRatio: 16 / 9 }}
  />
));

const MemoizedVendorBlurLoading = React.memo(({ item }) => (
  <Image
    source={{ uri: item.news_vendor_logo  }}
    style={{ flex: 1, width: 110, height: 20, resizeMode: 'contain' }}
  />
));

const NonCard = () => { 
  const query = ''; 
  const { loading, error, news } = NonUserQuery(query);
  const {langMode} = useAuth();
  const [refreshing, setRefreshing] = useState(false)
  const colorScheme = useColorScheme();
  const navigation = useRouter();

  const iconsColors = colorScheme === 'light' ? 'black' : 'white';
  const textColors = colorScheme === 'light' ? styles.textDark : styles.textWhite;
  const borderColor = colorScheme === 'light' ? styles.borderBottomBlack : styles.borderBottomWhite;
  const placeholder = colorScheme === 'light' ? images.placeholder : images.Darkplaceholder;
  const screenBg = colorScheme === 'light' ? styles.bgColor : styles.bgDarkColor;

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  //Card Items
  const CardItems = ({ item }) => {
    return(
      <View className="p-4 ml-[15px] mr-[15px bg-white dark:bg-transparent max-[767px]:dark:bg-[#1E1E1E]" key={item?.key} data-id={item?.id} style={{paddingBottom: 15, marginBottom: 15}}>
        <View className={ item?.ads_image ? 'post-body ads mb-12' : 'post-body mb-12' }>
          {item?.ads_image || item?.thumbnail ? (
            <>
              <MemoizedImageBlurLoading item={item} />
              { item?.news_vendor_logo_thumb && (
                <View style={{ flex: 1, position: 'absolute', top: '109%', right: 0, backgroundColor: 'white' }}>
                    <MemoizedVendorBlurLoading item={item} />
                </View>
              ) }
            </>
          ) : (
            <>
              <Image
                source={images.placeholder} // Provide a default placeholder image source when both ads_image and thumbnail are empty
                style={{ width: '100%', height: undefined, aspectRatio: 16 / 9 }}
              />
            </>
          )}
        </View>

        { !item?.ads_image && (
          <View className="flex mb-4 -mt-7">
            <Text className='dark:text-white'>{ langMode == 'BN' ? item?.author + ' দ্বারা নির্মিত' : 'Cruated By ' + item?.author }</Text>
          </View>
        )}

        { item?.ads_image ? (
            <Text className="post-title font-semibold text-md md:text-3xl transition-all hover:text-theme dark:text-white" style={styles.headingBold}>{ langMode == 'BN' ? item?.title : item?.title}</Text>
        ) : (
          <Text className="post-title font-semibold text-md md:text-2xl transition-all hover:text-theme dark:text-white" style={styles.headingBold}>{ langMode == 'BN' ? item?.summary_bn : item?.summary_en}</Text>
        ) }

        { item?.ads_image ? (
          <View style={styles.container}>
            <Text style={styles.text}>
              {langMode == 'BN' ? 'সৌজন্যে:' : 'Sponsored by:'}{' '}
              <Text style={styles.linkText}>{item.sponsor}</Text>
            </Text>
          </View>
        ) : (
          <View style={[styles.container2]}>
            <View style={styles.row}>
              <View style={styles.column}>
                <View style={styles.iconoloumn}>
                  <FontAwesomeIcon icon={faClock} color={ iconsColors } style={{marginRight: 5, opacity: 0.6}} size={15} />
                  <Text style={[styles.timeText, textColors]}>
                    { langMode == 'BN' ? moment(new Date(item?.datetime)).startOf('seconds').locale('bn-bd').fromNow() : moment(new Date(item?.datetime)).startOf('seconds').locale("en").fromNow() }
                  </Text>
                </View>
                <TouchableOpacity style={styles.readMoreLink} onPress={() => navigation.push('/login')}>
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
                    <FontAwesomeIcon icon={faShare} color={iconsColors} style={{marginLeft: 5, fontSize: 10, opacity: 0.6 }} size={15} />
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
    <View className="h-screen" style={screenBg}>
      <FlatList
        data={news}
        renderItem={({ item }) => <CardItems item={item} />}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={
          <Breaking />
        }
        ListFooterComponent={
          <>     
            { error ? 
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={textColors}>{langMode == 'BN' ? 'Error' : 'ত্রুটি হচ্ছে...'}</Text>
              </View> : <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={[textColors, {marginBottom: 10}]}>{langMode == 'BN' ? 'আরো খবর দেখতে লগইন করুন' : 'Please Login to view more news'}</Text>
              </View>
            }
          </>
        }
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <EmptyComponent />
        }
        style={{ marginBottom: 150}}
      />
    </View>
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
    fontSize: 15,
    marginRight: 10,
  },
  readMoreLink: {
    marginTop: 6,
  },
  readMoreText: {
    fontWeight: 'normal',
    fontSize: 14,
    marginTop: -5,
  },
  sponsoredText: {
    fontSize: 14,
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
    fontSize: 14, // Change to your desired link color
  },
  headingBold: {
    fontSize: 16,
    lineHeight: 26,
    marginBottom: 10
  },
  textWhite: {
    color: 'white'
  },
  textDark: {
    color: '#131313'
  },
  bgColor: {
    backgroundColor: '#f8f8f8'
  }, 
  bgDarkColor: {
    backgroundColor: '#000000'
  }
})