import { StyleSheet, Text, View, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl, Alert, Share, Image } from 'react-native'
import React, { useState, useCallback } from 'react'
import ImageBlurLoading from 'react-native-image-blur-loading'
import UserQuery from '../../query/userQuery'
import { images } from '../../constants'
import * as WebBrowser from 'expo-web-browser';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { faShare } from '@fortawesome/free-solid-svg-icons';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import Footer from '../body/footer'
import { Link } from 'expo-router'
import { useAuth } from '../../context/auth'

const TodayCard = () => {
  const query = '';
  const type = 'today'; 
  const [pageNumber, setPageNumber] = useState(1)
  const [refreshing, setRefreshing] = useState(false)

  const { loading, error, news, maxPage, noMore } = UserQuery(query, pageNumber, type);
  const {langMode} = useAuth();

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

  // Card Items
  const CardItems = ({ item }) => {
    return(
      <View className="post-item group max-[767px]:p-6 bg-white dark:bg-transparent max-[767px]:dark:bg-[#1E1E1E]" key={item.key} data-id={item.id} style={{marginBottom: 15}}>
        <View className={ item?.ads_image ? 'post-body ads' : 'post-body' }>
          {item?.ads_image || item.thumbnail ? (
            <TouchableOpacity onPress={() => item.action_url && WebBrowser.openBrowserAsync( item?.ads_image ? item.action_url : item.source )}>
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

        { !item.ads_image && (
          <View className="post-category flex text-xl mt-6 dark:text-white" style={styles.categoryViewParent}>
            <View>
              <Link href={`category/${item.category_en.toLowerCase()}`} style={styles.textTheme}>
                #<Text>{ langMode == 'BN' ? item.category_bn : item.category_en}</Text>
              </Link>
            </View>

            {item.sub_category_en && (
              <View style={styles.categoryView}>                
                <View>
                  <FontAwesomeIcon icon={faAngleRight} style={{marginRight: 5, fontSize: 10, opacity: 0.6}} />
                </View>            
                
                <View>
                  <Link href={`/subcategory/${makeLowercase(item.sub_category_en)}`}>
                    <Text>{ langMode == 'BN' ? item.sub_category_bn : item.sub_category_en}</Text>
                  </Link>
                </View>
              </View>
            )}
          </View>
        )}

        { item?.ads_image ? (
            <Text className="post-title font-semibold text-md md:text-3xl mt-3 transition-all dark:text-white" style={styles.headingBold}>{ langMode == 'BN' ? item.title : item.title}</Text>
        ) : (
            <Text className="post-title font-semibold text-md md:text-3xl mt-3 transition-all dark:text-white" style={styles.headingBold}>{ langMode == 'BN' ? item.summary_bn : item.summary_en}</Text>
        ) }

        { item.ads_image ? (
            <View style={styles.container}>
              <Text style={styles.text}>
                {langMode == 'BN' ? 'সৌজন্যে:' : 'Sponsored by:'}{' '}
                <Text style={styles.linkText}>{item.sponsor}</Text>
              </Text>
            </View>
        ) : (
          <View style={styles.container2}>
            <View style={styles.row}>
              <View style={styles.column}>
                <View style={styles.iconoloumn}>
                  <FontAwesomeIcon icon={faClock} style={{marginRight: 5, fontSize: 10, opacity: 0.6}} size={12} />
                  <Text style={styles.timeText}>
                    {moment(item.publish_date).fromNow()}
                  </Text>
                </View>
                
                <TouchableOpacity style={styles.readMoreLink} onPress={() => item.source && WebBrowser.openBrowserAsync(item.source) }>
                  <View style={styles.iconoloumn}>
                    <Text style={styles.readMoreText}>
                      {langMode == 'BN' ? 'বিস্তারিত' : 'Read More'}
                    </Text>
                    <FontAwesomeIcon icon={faArrowUp} style={{marginRight: 5, opacity: 0.6, transform: [{ rotate: '45deg' }]}} size={12} />
                  </View>
                </TouchableOpacity>
              </View>
              
              {item?.ads && (
                <View style={styles.column}>
                  <Text style={styles.sponsoredText}>
                    {langMode == 'BN' ? 'সৌজন্যে:' : 'Sponsored:'}
                  </Text>
                  <TouchableOpacity style={styles.sponsorLink}>
                    <Image source={{ uri: item.ads.sponsor_image }} style={styles.sponsorImage} />
                    <Text style={styles.sponsorName}>{item.ads.sponsor}</Text>
                  </TouchableOpacity>
                </View>
              )}
      
              <View style={styles.column}>
                <TouchableOpacity style={styles.shareLink} onPress={(e) => socialShareHandle(e, item)}>
                    <View style={styles.socialBookmark}>
                      <FontAwesomeIcon icon={faBookmark} style={[styles.innerBookmark, bookmarkedItems.includes(item.id) ? styles.bookmarkedIcon : (item.book_marks ? styles.bookmarkedIcon : null )]} size={11} />
                    </View>
                </TouchableOpacity>                
                
                <TouchableOpacity style={styles.shareLink} onPress={(e) => socialHandle(e, item.id)}>
                  <View style={styles.socialIcons}>
                    <FontAwesomeIcon icon={faShare} style={styles.innerSocial} size={11} />
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

  return (
    <FlatList
      data={news}
      renderItem={({ item }) => <CardItems item={item} />}
      keyExtractor={(item, index) => index.toString()}
      ListFooterComponent={renderLoader}
      onEndReached={loadMoreItems}
      onEndReachedThreshold={0.5}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      style={styles.mainContainer}
      ListEmptyComponent={
        !loading && !error && news.length === 0 ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>{langMode == 'BN' ? 'এখানে কোন পোস্ট নেই' : 'No Posts Available Here'}</Text>
          </View>
        ) : null
      }
    />
  )
}

export default TodayCard

const styles = StyleSheet.create({
  mainContainer: {
    paddingHorizontal: 15,
    marginTop: 15
  },
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
    fontSize: 14,
    marginRight: 10,
  },
  readMoreLink: {
    marginTop: 6,
  },
  readMoreText: {
    fontWeight: 'normal',
    fontSize: 13,
  },
  sponsoredText: {
    fontSize: 13,
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
    paddingHorizontal: 2,
    paddingVertical: 2
  },    
  innerBookmark: {
    fontSize: 10, 
    opacity: 0.6,
    paddingHorizontal: 2,
    paddingVertical: 2
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
})