import { StyleSheet, Text, View, Share, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import moment from 'moment'
import axios from '../../api/axios'
import ImageBlurLoading from 'react-native-image-blur-loading'
import * as WebBrowser from 'expo-web-browser';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { faShare } from '@fortawesome/free-solid-svg-icons';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'expo-router'
import { useAuth } from '../../context/auth'
import Footer from './footer'
import { images } from '../../constants'

const BookmarkList = () => {
  const [bookmark, setBookmark] = useState([]);
  const [regenerateData, setRegenerateData] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const { user, langMode } = useAuth();

  const fetchData = async (retryCount = 3, delay = 1000) => {
    if( user?.token ) {
      try {
        axios.get('/bookmark-list', {
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
          console.log(res)
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

        { item?.ads_image ? (
            <Text className="post-title font-semibold text-md md:text-3xl mt-3 transition-all dark:text-white" style={styles.headingBold}>{ langMode == 'BN' ? item.title : item.title}</Text>
        ) : (
            <Text className="post-title font-semibold text-md md:text-3xl mt-3 transition-all dark:text-white" style={styles.headingBold}>{ langMode == 'BN' ? item.summary_bn : item.summary_en}</Text>
        ) }

        <View style={styles.container2}>
          <View style={styles.row}>
            <View style={styles.column}>
              <View style={styles.iconoloumn}>
                <FontAwesomeIcon icon={faClock} style={{marginRight: 5, fontSize: 10, opacity: 0.6}} size={12} />
                <Text style={styles.timeText}>
                  {moment(item.publish_date).fromNow(true)}
                </Text>
              </View>
              
              <TouchableOpacity style={styles.readMoreLink} onPress={() => item.source && WebBrowser.openBrowserAsync(item.source) }>
                <View style={styles.iconoloumn}>
                  <Text style={styles.readMoreText}>
                    {langMode == 'BN' ? 'উৎস দেখুন' : 'View Source'}
                  </Text>
                  <FontAwesomeIcon icon={faArrowUp} style={{marginRight: 5, opacity: 0.6, transform: [{ rotate: '45deg' }]}} size={12} />
                </View>
              </TouchableOpacity>
            </View>
            
            <View style={styles.column}>
              <TouchableOpacity style={styles.shareLink} onPress={(e) => removeBookmarkHandle(item.news_id)}>
                <View style={styles.socialBookmark}>
                  <FontAwesomeIcon icon={faTrashAlt} style={styles.innerBookmark} size={11} />
                </View>
              </TouchableOpacity>                
              
              <TouchableOpacity style={styles.shareLink} onPress={(e) => socialShareHandle(e, item)}>
                <View style={styles.socialIcons}>
                  <FontAwesomeIcon icon={faShare} style={styles.innerSocial} size={11} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    )
  };

  return (
    <View style={{paddingHorizontal: 15}}>
      <Text className="text-xl font-bold ml-0 mt-5 mb-5">{langMode === 'BN' ? 'আমার বুকমার্ক' : 'My Bookmarks'}</Text>

      { bookmark?.map((item, index) => (
        <CardItems item={item} key={index} />
      )) }

      { loading ? 
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#f9020b" />
        </View> : null
      } 

      {bookmark.length === 0 && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>{langMode == 'BN' ?  'কোন বুকমার্ক পাওয়া যায়নি..' : 'No bookmark found..'}</Text>
        </View>
      )}
    </View>
  )
}

export default BookmarkList

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: 'white',
    margin: 15
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
  }
})