import { StyleSheet, Text, View, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl, Share, Alert, useColorScheme, Modal, Image } from 'react-native'
import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import UserQuery from '../../query/userQuery'
import { Link, useLocalSearchParams } from 'expo-router'
import { useAuth } from '../../context/auth'
import { WebView } from 'react-native-webview';
import axios from '../../api/axios';
import MainCard from './mainCard';
import EmptyComponent from './emptyComponent';
import { Skeleton } from 'moti/skeleton';
// import { Image } from 'expo-image';

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

const CategoryAllCard = () => {
  const { slug } = useLocalSearchParams();
  const query = slug;

  const type = 'hash_tag';
  const [pageNumber, setPageNumber] = useState(1)
  const [refreshing, setRefreshing] = useState(false)
  const [ singleData, setSingleData ] = useState()
  const [loadFirst, setLoadFirst] = useState(true);
  const [webLoad, setWebLoad] = useState(true);
  const [isFollowing, setIsFollowing] = useState('');

  const colorScheme = useColorScheme();
  const themeContainerStyle =
  colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;
  const themeTextStyle = colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;
  const themeIconStyle = colorScheme === 'light' ? 'black' : 'white';
  const borderColor = colorScheme === 'light' ? styles.lightBorder : styles.darkBorder;

  const { loading, error, news, maxPage, noMore } = UserQuery(query, pageNumber, type);
  const {langMode, user} = useAuth();

  const [modalVisible, setModalVisible] = useState(false);
  const [urlWeb, setUrlWeb] = useState('');
  const [viewableItems, setViewableItems] = useState([]);


  // make lowercase function
  const makeLowercase = ( item ) => {
    return item.split(" ").join("-").toLowerCase()
  }

  //Open Link in popup
  const openLink = async(e, url) => {
    setModalVisible(true);
    setUrlWeb(url);
  };

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

  // Footer elements
  const renderLoader = () => {
    return(
      <>   
        { error ? 
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
            <Text style={themeTextStyle}>{langMode == 'BN' ? 'Error' : 'ত্রুটি হচ্ছে...'}</Text>
          </View> : null
        }          
        
        { noMore ? 
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
            <Text style={themeTextStyle}>{langMode == 'BN' ?  'আর কোন পোস্ট নেই' : 'No More Posts'}</Text>
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

  const handleLoadStart = () => {
    setWebLoad(true);
  };

  const handleLoadEnd = () => {
    setWebLoad(false);
  };

  const [ followText, setFollowText ] = useState('');

  const tagsDetails = async()=> {
    try {
      if( user?.token ) {
        const respose = await axios.get(`/hash-tag/${query}`, {headers: {
          'Authorization': `Bearer ${user.token}`
        }});

        const resData = respose.data.data;
        setSingleData(resData);
        setFollowText(resData.follow);
        setIsFollowing(resData.follow == 'Follow');
        setLoadFirst(false);
      }
    } catch (error) {
      console.log(error)
    }
  };

  useEffect(()=> {
    tagsDetails();
  }, []);
  
  const handleFollowing = async() => {
    try {
      const response = await axios.post(
        '/hash-tag-follow',
        { hash_tag: singleData?.id, follow: isFollowing ? 0 : 1 },
        {
          headers: {
            'Authorization': `Bearer ${user.token}`
          },
        }
      );
      setIsFollowing(response.data.success == 'Follow')
      setFollowText(response.data.success);
    } catch (error) {
      console.log(error)
    }
  }; 

  const HeaderElements = () => {
    return(
      <View className="mb-5">
        <Skeleton show={loadFirst}>
          <View>
            <Image 
              src={singleData?.image } 
              style={{ width: '100%', height: 120, resizeMode: 'cover' }}
            />
          </View>
          <View style={{backgroundColor: singleData?.background_color ? singleData?.background_color : 'white' }} className="p-4">
            <View className="flex-row align-middle justify-between">
              <View style={{backgroundColor: singleData?.background_color ? '#ffffff40' : '#dddddd', paddingHorizontal: 20, paddingVertical: 5, borderRadius: 10, marginBottom: 5}}>
                <Text style={{color: singleData?.background_color ? 'white' : 'black', fontSize: 18, fontWeight: 700}}>#{langMode == 'BN' ? singleData.name_bn : singleData.name_en }</Text>
              </View>
              <View>
                <TouchableOpacity onPress={handleFollowing} style={{backgroundColor: singleData?.background_color ? '#ffffff40' : '#dddddd', paddingHorizontal: 20, paddingVertical: 5, borderRadius: 10}}>
                  <Text style={{color: singleData?.background_color ? 'white' : 'black'}}>{isFollowing ? (langMode === 'BN' ? 'আনফলো' : 'Unfollow') : (langMode === 'BN' ? 'ফলো' : 'Follow') }</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="mt-3">
              <Text style={{color: singleData?.background_color ? 'white' : 'black'}}>{langMode == 'BN' ? singleData.description_bn : singleData.description_en }</Text>
            </View>
          </View>
        </Skeleton>
      </View>
    );
  };

  return (
    <View>   
      <FlatList
        data={news}
        renderItem={({ item }) => <MainCard item={item} themeContainerStyle={themeContainerStyle} themeTextStyle={themeTextStyle} borderColor={borderColor} themeIconStyle={themeIconStyle} bookmarkedItems={bookmarkedItems} langMode={langMode} viewableItems={viewableItems} openLink={openLink} socialShareHandle={socialShareHandle} bookmarkHandle={bookmarkHandle}  />}
        keyExtractor={(item, index) => index.toString()}
        ListFooterComponent={renderLoader}
        onEndReached={loadMoreItems}
        onEndReachedThreshold={0.1}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <EmptyComponent />
        }
        ListHeaderComponent={
          singleData && <HeaderElements /> 
        }
        viewabilityConfig={{viewAreaCoveragePercentThreshold: 50}}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        style={{ marginBottom: 0}}
        initialNumToRender={10}
        windowSize={5}
        maxToRenderPerBatch={5}
        updateCellsBatchingPeriod={30}
        removeClippedSubviews={false}
      />

      <Modal
        animationType="slide"
        visible={modalVisible}
        onBackdropPress={!modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        {webLoad && (
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
        />

        <View className="flex flex-row justify-between p-2 align-middle z-10 relative">
          <Text style={{fontSize: 18, fontWeight: 'bold'}}>{ langMode == 'BN' ? 'বিস্তারিত' : 'Details' }</Text>
          <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}><Text style={{backgroundColor: 'red', color: 'white', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5}}>{ langMode == 'BN' ? 'বন্ধ করুন' : 'Close' }</Text></TouchableOpacity>
        </View> 
      </Modal>
    </View>
  )
}

export default CategoryAllCard

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
    backgroundColor: '#ffffff'
  }, 
  bgDarkColor: {
    backgroundColor: '#000000'
  }
})