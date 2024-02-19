import { StyleSheet, Text, View, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl, Alert, Share, Image, useColorScheme, Modal } from 'react-native'
import React, { useState, useCallback, useRef } from 'react'
import UserQuery from '../../query/userQuery'
import { images } from '../../constants'
import moment from 'moment/min/moment-with-locales';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { faShare } from '@fortawesome/free-solid-svg-icons';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import Footer from '../body/footer'
import { Link } from 'expo-router'
import { useAuth } from '../../context/auth'
import { WebView } from 'react-native-webview';
import axios from '../../api/axios';

const BreakingCard = () => {
  const query = '';
  const type = 'breaking'; 
  const [pageNumber, setPageNumber] = useState(1)
  const [refreshing, setRefreshing] = useState(false)
  const colorScheme = useColorScheme();
  const themeContainerStyle =
  colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;
  const themeTextStyle = colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;
  const themeIconStyle = colorScheme === 'light' ? 'black' : 'white';
  const indicatorBg = colorScheme === 'light' ? 'white' : 'black';

  const { loading, error, news, maxPage, noMore } = UserQuery(query, pageNumber, type);
  const {langMode, user} = useAuth();

  const [modalVisible, setModalVisible] = useState(false);
  const [urlWeb, setUrlWeb] = useState('');
  const [viewableItems, setViewableItems] = useState([]);

  // make lowercase function
  const makeLowercase = ( item ) => {
    return item.split(" ").join("-").toLowerCase()
  }

  // Page refresh on swipe
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  // Share Options
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

  //Open Link in popup
  const openLink = async(e, url) => {
    setModalVisible(true);
    setUrlWeb(url);
  };

  //Bookmark manage
  const [bookmarkedItems, setBookmarkedItems] = useState([]);
  const bookmarkHandle = async(e, item) => {
    if( user?.token ) {
      const bookmarks = item.id;

      try {           
        const isBookmarked = bookmarkedItems.includes(bookmarks) || item.book_marks;
        if( isBookmarked ) {
            await axios.post('/bookmark-remove', { news_id: bookmarks }, { headers: { 'Authorization': `Bearer ${user.token}` } })
            .then((res) => {
              if (res.data.status === 'Success') {
                setBookmarkedItems(bookmarkedItems.filter(id => id !== bookmarks));
              }
            });
        } else {
            await axios.post('/bookmark-news', {news_id: bookmarks}, {headers: {
              'Authorization': `Bearer ${user.token}`,
            }})
            .then(res => {  
                if (res.data.status === 'Success') {
                  setBookmarkedItems([...bookmarkedItems, bookmarks]);
                }
            });
        }
      } catch (e) {
        console.log(e);
      }
    }
  };

  // Card Items
  const CardItems = ({ item }) => {
    return(
      <View className="post-item group max-[767px]:p-6" key={item.key} data-id={item.id} style={themeContainerStyle}>
        <View className={ item?.ads_image ? 'post-body ads' : 'post-body' }>
          {item?.ads_image || item.thumbnail ? (
            <>
              <Image
                source={{ uri: item.ads_image || item.thumbnail }} // Use ads_image if available, otherwise use thumbnail
                style={{ width: '100%', height: undefined, aspectRatio: 16 / 9 }}
              />
              { item?.news_vendor_logo && (
                <View style={{ flex: 1, position: 'absolute', top: '110%', right: 0 }}>
                  <Image
                    source={{ uri: item.news_vendor_logo } }
                    style={{ flex: 1, width: 110, height: 20, resizeMode: 'contain', backgroundColor: 'white' }}
                  />
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

        { !item.ads_image && (
          <View className="post-category flex text-xl mt-6 dark:text-white" style={styles.categoryViewParent}>
            <View>
              <Link href={`category/${item.category_en.toLowerCase().replace(/\s+/g, '-')}`} style={styles.textTheme}>
                #<Text>{ langMode == 'BN' ? item.category_bn : item.category_en}</Text>
              </Link>
            </View>

            {item.sub_category_en && (
              <View style={styles.categoryView}>                
                <View>
                  <FontAwesomeIcon icon={faAngleRight} color={themeIconStyle} style={{marginRight: 5, fontSize: 10, opacity: 0.6}} />
                </View>            
                
                <View>
                  <Link href={`/subcategory/${makeLowercase(item.sub_category_en)}`}>
                    <Text style={themeTextStyle}>{ langMode == 'BN' ? item.sub_category_bn : item.sub_category_en}</Text>
                  </Link>
                </View>
              </View>
            )}
          </View>
        )}

        { item?.ads_image ? (
            <Text className="post-title font-semibold text-md md:text-3xl mt-3 transition-al" style={[styles.headingBold, themeTextStyle]}>{ langMode == 'BN' ? item.title : item.title}</Text>
        ) : (
          <Text className={`post-title ${ viewableItems === item.id || item?.is_read ? '' : 'font-bold' } text-md md:text-3xl mt-3 transition-al`} style={[styles.headingBold, themeTextStyle]}>{ langMode == 'BN' ? item.summary_bn : item.summary_en}</Text>
        ) }

        { item.ads_image ? (
            <View style={styles.container}>
              <Text style={[styles.sponsoredText, themeTextStyle]}>
                {langMode == 'BN' ? 'সৌজন্যে:' : 'Sponsored by:'}{' '}
                <Text style={[styles.linkText, themeTextStyle]}>{item.sponsor}</Text>
              </Text>
            </View>
        ) : (
          <View style={styles.container2}>
            <View style={styles.row}>
              <View style={styles.column}>
                <View style={styles.iconoloumn}>
                  <FontAwesomeIcon icon={faClock} style={{marginRight: 5, fontSize: 10, opacity: 0.6}} color={themeIconStyle} size={12} />
                  <Text style={[styles.timeText, themeTextStyle]}>
                    { langMode == 'BN' ? moment(new Date(item.publish_date)).startOf('seconds').locale('bn-bd').fromNow() : moment(new Date(item.publish_date)).startOf('seconds').locale("en").fromNow() }
                  </Text>
                </View>
                
                <TouchableOpacity style={styles.readMoreLink} onPress={(e) => item.source && openLink(e, item.source) }>
                  <View style={styles.iconoloumn}>
                    <Text style={[styles.readMoreText, themeTextStyle]}>
                      {langMode == 'BN' ? 'বিস্তারিত' : 'Read More'}
                    </Text>
                    <FontAwesomeIcon color={themeIconStyle} icon={faArrowUp} style={{marginRight: 5, opacity: 0.6, transform: [{ rotate: '45deg' }]}} size={15} />
                  </View>
                </TouchableOpacity>
              </View>
              
              {item?.ads && (
                <View style={styles.column}>
                  <Text style={[styles.sponsoredText, themeTextStyle]}>
                    {langMode == 'BN' ? 'সৌজন্যে:' : 'Sponsored:'}
                  </Text>
                  <TouchableOpacity style={styles.sponsorLink}>
                    <Image source={{ uri: item.ads.sponsor_image }} style={styles.sponsorImage} />
                    <Text style={[styles.sponsorName, themeTextStyle]}>{item.ads.sponsor}</Text>
                  </TouchableOpacity>
                </View>
              )}
      
              <View style={styles.column}>
                <TouchableOpacity style={styles.shareLink} onPress={(e) => bookmarkHandle(e, item)}>
                  <View style={styles.socialBookmark}>
                    <FontAwesomeIcon icon={faBookmark} style={[styles.innerBookmark, bookmarkedItems.includes(item.id) ? styles.bookmarkedIcon : (item.book_marks ? styles.bookmarkedIcon : null )]} size={15} />
                  </View>
                </TouchableOpacity>                
                <TouchableOpacity style={styles.shareLink} onPress={(e) => socialShareHandle(e, item)}>
                  <View style={styles.socialIcons}>
                    <FontAwesomeIcon color={themeIconStyle} icon={faShare} style={styles.innerSocial} size={15} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) }
      </View>
    )
  };

  // Footer elements
  const renderLoader = () => {
    return(
      <>   
        { loading ? 
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: indicatorBg }}>
            <ActivityIndicator size="large" color="#f9020b" />
          </View> : null
        }   

        { error ? 
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: indicatorBg }}>
            <Text>{langMode == 'BN' ? 'Error' : 'ত্রুটি হচ্ছে...'}</Text>
          </View> : null
        }          
      </>
    )
  }

  // Load More Elements
  const loadMoreItems = () => {
    if (pageNumber >= maxPage) {
      // Don't load more posts if you've reached the limit
      return;
    }
    setPageNumber(pageNumber + 1);
  };

  //On View item changed
  const onViewableItemsChanged = (info) => {
    const changedItem = info.viewableItems[0];
    const id = changedItem.item.id;
    const actionUrl = changedItem?.item?.action_url;
    setViewableItems(id);
    if( user?.token ) {
      try {
        if( actionUrl ) {
          axios.post('/view-ads', {ads_id: id}, {headers: {
            'Authorization': `Bearer ${user.token}`
          }})
        } else {
          axios.post('/view-news', {news_id: id}, {headers: {
            'Authorization': `Bearer ${user.token}`,
          }})
        }
      } catch (e) {
        //Alert.alert(langMode == 'BN' ? 'ভিউতে কিছু ভুল হয়েছে' : 'Something Went Wrong in View');
      }
    }
  };

  const viewabilityConfigCallbackPairs = useRef([
    { onViewableItemsChanged },
  ]);
  
  return (
    <>    
      <FlatList
        data={news}
        renderItem={({ item }) => <CardItems item={item} />}
        keyExtractor={(item, index) => index.toString()}
        ListFooterComponent={renderLoader}
        onEndReached={loadMoreItems}
        onEndReachedThreshold={0.1}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          !loading && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>{langMode == 'BN' ?  'এখানে কোন পোস্ট নেই' : 'No Posts Available Here'}</Text>
          </View>
        }
      />

      <Modal
        animationType="slide"
        visible={modalVisible}
        onBackdropPress={!modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View className="flex flex-row justify-between p-2 align-middle">
          <Text style={{fontSize: 18, fontWeight: 'bold'}}>{ langMode == 'BN' ? 'বিস্তারিত' : 'Details' }</Text>
          <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}><Text style={{backgroundColor: 'red', color: 'white', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5}}>{ langMode == 'BN' ? 'বন্ধ করুন' : 'Close' }</Text></TouchableOpacity>
        </View> 
        <WebView
          originWhitelist={['*']}
          source={{uri: urlWeb }}
          style={{marginTop: 20, padding: 20}}
          javaScriptEnabled={true}
          userAgent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
          thirdPartyCookiesEnabled={true}
          onError={(error) => console.error('WebView error:', error)}
        />
      </Modal>
    </>
  )
}

export default BreakingCard

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
  socialIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9020b4a',
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
    backgroundColor: '#F7f7f7',
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
    opacity: 0.6,
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
    fontSize: 20,
    lineHeight: 30
  },
  darkContainer: {
    backgroundColor: '#1E1E1E'
  },
  lightContainer: {
    backgroundColor: '#FFFFFF'
  },
  lightThemeText: {
    color: '#101010'
  },
  darkThemeText: {
    color: '#FFFFFF'
  }
})