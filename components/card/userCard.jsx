import { StyleSheet, Text, View, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl, Alert, Share, Image, useColorScheme, Modal } from 'react-native'
import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react'
import UserQuery from '../../query/userQuery'
import { images } from '../../constants'
import Breaking from '../body/breaking'
import { useAuth } from '../../context/auth'
import axios from '../../api/axios'
import { WebView } from 'react-native-webview';
import EmptyComponent from './emptyComponent'

import MainCard from './mainCard';

const UserCard = () => {
  const colorScheme = useColorScheme();
  const query = ''; 
  const type = ''; 
  const [pageNumber, setPageNumber] = useState(1)
  const [refreshing, setRefreshing] = useState(false)
  const { user, langMode } = useAuth();
  const [bookmarkedItems, setBookmarkedItems] = useState([]);
  const [loadFirst, setLoadFirst] = useState(true);

  const themeContainerStyle =
    colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;
  const themeTextStyle = colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;
  const themeIconStyle = colorScheme === 'light' ? 'black' : 'white';
  const placeholder = colorScheme === 'light' ? images.placeholder : images.Darkplaceholder;
  const screenBg = colorScheme === 'light' ? styles.bgColor : styles.bgDarkColor;
  const borderColor = colorScheme === 'light' ? styles.lightBorder : styles.darkBorder;

  const { loading, error, news, maxPage, noMore } = UserQuery(query, pageNumber, type);

  const [modalVisible, setModalVisible] = useState(false);
  const [urlWeb, setUrlWeb] = useState('');
  const [viewableItems, setViewableItems] = useState([]);

  const handleLoadStart = () => {
    setLoadFirst(true);
  };

  const handleLoadEnd = () => {
    setLoadFirst(false);
  };

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

  // Bookmark Options
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

  //Open Link in popup
  const openLink = async(e, url) => {
    setModalVisible(true);
    setUrlWeb(url);
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
    const id = changedItem?.item?.id;
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

  const renderSectionHeader = ({ section }) => (
    <Text style={{color: 'white'}}>Title</Text>
  );

  return (
    <View className="h-screen" style={screenBg}>    
      <FlatList
        data={news}
        renderItem={({ item }) => <MainCard item={item} themeContainerStyle={themeContainerStyle} themeTextStyle={themeTextStyle} borderColor={borderColor} themeIconStyle={themeIconStyle} bookmarkedItems={bookmarkedItems} langMode={langMode} viewableItems={viewableItems} openLink={openLink} socialShareHandle={socialShareHandle} bookmarkHandle={bookmarkHandle} />}
        keyExtractor={(item, index) => (item && item.id ? item.id.toString() : index.toString())}
        ListFooterComponent={renderLoader}
        onEndReached={loadMoreItems}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Breaking />
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <EmptyComponent />
        }
        viewabilityConfig={{viewAreaCoveragePercentThreshold: 50}}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        renderSectionHeader={renderSectionHeader}
        style={{marginBottom: 150}}
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

export default UserCard

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