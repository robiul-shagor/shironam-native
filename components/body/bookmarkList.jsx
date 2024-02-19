import { StyleSheet, Text, View, useColorScheme, ActivityIndicator, TouchableOpacity, Image, Modal } from 'react-native'
import React, { useState, useEffect } from 'react'
import moment from 'moment/min/moment-with-locales';
import axios from '../../api/axios'
import * as WebBrowser from 'expo-web-browser';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { faShare } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/auth'
import { images } from '../../constants'
import EmptyComponent from '../card/emptyComponent';
import { WebView } from 'react-native-webview';

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

const BookmarkList = () => {
  const [bookmark, setBookmark] = useState([]);
  const [regenerateData, setRegenerateData] = useState(false);
  const [loading, setLoading] = useState(true);
  const colorScheme = useColorScheme();
  const bgColor = colorScheme === 'light' ? '#f8f8f8' : '#000000';
  const textColor = colorScheme === 'light' ? '#191919' : 'white';

  const themeContainerStyle =
    colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;
  
  const { user, langMode } = useAuth();
  const [urlWeb, setUrlWeb] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [loadFirst, setLoadFirst] = useState(true);

  const handleLoadStart = () => {
    setLoadFirst(true);
  };

  const handleLoadEnd = () => {
    setLoadFirst(false);
  };

  const fetchData = async (retryCount = 3, delay = 1000) => {
    if( user?.token ) {
      try {
          await axios.get('/bookmark-list', {
            headers: {
              'Authorization': `Bearer ${user.token}`,
            },
          })
          .then(res => {
            setBookmark(res.data.data);
          });
      } catch (error) {
        if (retryCount > 0 && error.response?.status === 429) {
          await new Promise((resolve) => setTimeout(resolve, delay));
          fetchData(retryCount - 1, delay * 2);
        } else {
          console.log('Hello' + error);
          setLoading(false);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const removeBookmarkHandle = async (item) => {
    setLoading(true);
    if( user?.token ) {
      try {
        await axios.post('/bookmark-remove', { news_id: item }, {
          headers: {
            'Authorization': `Bearer ${user.token}`,
          },
        })
        .then(res => {
          if (res.data.status === 'Success') {
            setRegenerateData(true);
            setLoading(false);
          }
        });
      } catch (e) {
        console.log('Error for here' + e);
      }
    }
  };

  useEffect(() => {
    if (regenerateData) {
      fetchData();
      setRegenerateData(false); // Reset the flag after data regeneration
    }
  }, [regenerateData]);

  //Open Link in popup
  const openLink = async(e, url) => {
    setModalVisible(true);
    setUrlWeb(url);
  };

  const CardItems = ({ item }) => {
    return(
      <View className="post-item group p-4 bg-white dark:bg-transparent max-[767px]:dark:bg-[#1E1E1E] ml-[15px] mr-[15px]" key={item.key} data-id={item.id} style={{marginBottom: 15}}>
        <View className={ item?.ads_image ? 'post-body ads' : 'post-body' }>
          {item?.ads_image || item.thumbnail ? (
            <>
              <Image
                src={item.ads_image || item.thumbnail } // Use ads_image if available, otherwise use thumbnail
                style={{ width: '100%', height: undefined, aspectRatio: 16 / 9, resizeMode: 'cover' }}
                placeholder={blurhash}
              />
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

        { item?.ads_image ? (
            <Text className="post-title font-semibold text-md md:text-3xl mt-3 transition-all dark:text-white" style={styles.headingBold}>{ langMode == 'BN' ? item.title : item.title}</Text>
        ) : (
            <Text className="post-title font-semibold text-md md:text-3xl mt-3 transition-all dark:text-white" style={styles.headingBold}>{ langMode == 'BN' ? item.summary_bn : item.summary_en}</Text>
        ) }

        <View style={styles.container2}>
          <View style={styles.row}>
            <View style={styles.column}>
              <View style={styles.iconoloumn}>
                <FontAwesomeIcon color={textColor} icon={faClock} style={{marginRight: 5, fontSize: 10, opacity: 0.6}} size={14} />
                <Text style={[styles.timeText, { color: textColor }]}>
                  { langMode == 'BN' ? moment(new Date(item.date)).startOf('seconds').locale('bn-bd').fromNow() : moment(new Date(item.date)).startOf('seconds').locale("en").fromNow() }
                </Text>
              </View>
              
              <TouchableOpacity style={styles.readMoreLink} onPress={(e) => item.source && openLink(e, item.source) }>
                <View style={styles.iconoloumn}>
                  <Text style={[styles.readMoreText, { color: textColor }]}>
                    {langMode == 'BN' ? 'উৎস দেখুন' : 'View Source'}
                  </Text>
                  <FontAwesomeIcon color={textColor} icon={faArrowUp} style={{marginRight: 5, opacity: 0.6, transform: [{ rotate: '45deg' }]}} size={16} />
                </View>
              </TouchableOpacity>
            </View>
            
            <View style={styles.column}>
              <TouchableOpacity style={styles.shareLink} onPress={(e) => removeBookmarkHandle(item.news_id)}>
                <View style={styles.socialBookmark}>
                  <FontAwesomeIcon icon={faTrashAlt} color={textColor} style={styles.innerBookmark} size={16} />
                </View>
              </TouchableOpacity>                
              
              <TouchableOpacity style={styles.shareLink} onPress={(e) => socialShareHandle(e, item)}>
                <View style={styles.socialIcons}>
                  <FontAwesomeIcon icon={faShare} style={styles.innerSocial} size={16} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    )
  };

  return (
    <View style={[{paddingHorizontal: 0}, { backgroundColor: bgColor }]}>
      <Text className="text-xl font-bold mt-5 mb-5 ml-5" style={{color: textColor}}>{langMode === 'BN' ? 'আমার বুকমার্ক' : 'My Bookmarks'}</Text>

      { loading ? (
        <EmptyComponent />
      ) : (
        bookmark?.map((item, index) => (
          <CardItems item={item} key={index} />
        ))
      ) }

      {bookmark.length === 0 && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: bgColor, paddingVertical: 220 }}>
          <FontAwesomeIcon color={textColor} icon={faBookmark} style={{ opacity: 0.6}} size={45} />
          <Text className="mt-2">{langMode == 'BN' ?  'কোন বুকমার্ক পাওয়া যায়নি..' : 'No bookmark found..'}</Text>
        </View>
      )}

      <Modal
        animationType="slide"
        visible={modalVisible}
        onBackdropPress={!modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        {loadFirst && (
          <View style={[{ ...StyleSheet.absoluteFillObject, flex: 1, justifyContent: 'center', alignItems: 'center', zIndex: 5}, themeContainerStyle]}>
            <ActivityIndicator size="large" color="#f9020b" />
          </View>
        ) }

        <WebView
          originWhitelist={['*']}
          source={{uri:  urlWeb }}
          style={{marginTop: 20, padding: 20}}
          onLoadStart={handleLoadStart}
          onLoadEnd={handleLoadEnd}
          javaScriptEnabled={true}
          userAgent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
          thirdPartyCookiesEnabled={true}
          onError={(error) => console.error('WebView Error:', error)}
        />

        <View className="flex flex-row justify-between p-2 align-middle z-10 relative">
          <Text style={{fontSize: 18, fontWeight: 'bold'}}>{ langMode == 'BN' ? 'বিস্তারিত' : 'Details' }</Text>
          <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}><Text style={{backgroundColor: 'red', color: 'white', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5}}>{ langMode == 'BN' ? 'বন্ধ করুন' : 'Close' }</Text></TouchableOpacity>
        </View> 
      </Modal>
    </View>
  )
}

export default BookmarkList

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
  },row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  column: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 13,
    marginRight: 10,
  },
  readMoreLink: {
    marginTop: 6,
  },
  readMoreText: {
    fontWeight: 'normal',
    fontSize: 12,
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
  socialIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 25,
    height: 25,
    borderRadius: 100,
    marginLeft: 5, 
    textAlign: 'center',
    justifyContent: 'center'
  },  
  socialBookmark: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 25,
    height: 25,
    borderRadius: 100,
    marginLeft: 5, 
    textAlign: 'center',
    justifyContent: 'center',
  },
  innerSocial: {
    color: '#F9020B',
    fontSize: 10, 
    paddingHorizontal: 3,
    paddingVertical: 3
  },    
  innerBookmark: {
    opacity: 0.6,
    paddingHorizontal: 3,
    paddingVertical: 3
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
  textTheme: {
    color: '#F9020B'
  },
  categoryView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryViewParent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookmarkedIcon: {
    color: '#f9020b', // Example color for bookmarked items
  },
  headingBold: {
    fontSize: 15,
    lineHeight: 26,
    marginBottom: 10
  },
  darkContainer: {
    backgroundColor: '#1E1E1E'
  },
  lightContainer: {
    backgroundColor: '#FFFFFF'
  },
  lightBorder: {
    borderBottomColor: '#ebebeb'
  },
  darkBorder: {
    borderBottomColor: '#1e1e1e'
  },
  lightThemeText: {
    color: '#101010'
  },
  darkThemeText: {
    color: '#FFFFFF'
  },
  nonViewableItem: {
    fontWeight: 'bold'
  }, 
  viewableItem: {
    fontWeight: 'normal'
  },
  bgColor: {
    backgroundColor: '#f8f8f8'
  }, 
  bgDarkColor: {
    backgroundColor: '#000000'
  }
})