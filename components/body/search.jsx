import { StyleSheet, Text, View, TextInput, Keyboard, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { faShare } from '@fortawesome/free-solid-svg-icons';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/auth';
import axios from '../../api/axios';
import * as WebBrowser from 'expo-web-browser';
import moment from 'moment';
import ImageBlurLoading from 'react-native-image-blur-loading'
import { images } from '../../constants';
import { Link } from 'expo-router';
import Footer from './footer';

const Search = () => {
    const [ searchData, setSearchData ] = useState('');
    const [ count, setCount ] = useState(0);
    const [newsItem, setNewsItem ] = useState([]);
    const [clicked, setClicked] = useState(false);
    const [loading, setLoading] = useState(false); 
    const [typingTimeout, setTypingTimeout] = useState(null);
    const { user, langMode } = useAuth();

    // make lowercase function
    const makeLowercase = ( item ) => {
        return item.split(" ").join("-").toLowerCase()
    }

    const handleSearchChange = (event) => {
        setSearchData(event);

        // Clear the previous typing timeout
        clearTimeout(typingTimeout);

        setLoading(true);

        // Set a new timeout to wait before making the API call
        const newTypingTimeout = setTimeout(() => {
            // Make the API call with the search keyword
            fetchData(event);
            setLoading(false);
        }, 500); // Adjust the delay time (in milliseconds) according to your preference
        setTypingTimeout(newTypingTimeout);
    };

    const fetchData = async (keyword, retryCount = 3, delay = 1000) => {
        if (user?.token) {
            const config = {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            };

            try {
                await axios.get(`/news-list?search=${keyword}`, config)
                .then(res => {
                    setNewsItem(res.data);
                    setCount( res.data.length );
                });
            } catch (error) {
                if (retryCount > 0 && error.response?.status === 429) {
                    await new Promise((resolve) => setTimeout(resolve, delay));
                    fetchData(retryCount - 1, delay * 2); 
                } else {
                    console.log(error);
                    setLoading(false);
                }
            } finally {
                setLoading(false);
            }
        }
    };

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
                    <TouchableOpacity style={styles.shareLink} onPress={(e) => bookmarkHandle(e, item.id)}>
                      <View style={styles.socialBookmark}>
                        <FontAwesomeIcon icon={faBookmark} style={styles.innerBookmark} size={11} />
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
            ) }
          </View>
        )
    };
  

    return (
        <>
            <View style={styles.container}>
                <View style={
                    clicked
                        ? styles.searchBar__clicked
                        : styles.searchBar__unclicked
                    }>
                    <FontAwesomeIcon icon={faSearch} size={14} style={{ marginLeft: 5 }} />
                    <TextInput 
                        style={styles.input}
                        placeholder="Search"
                        value={searchData} 
                        onChangeText={handleSearchChange} 
                        onFocus={() => {
                            setClicked(true);
                        }}
                        autoCapitalize="none"
                    />
                    {clicked && (
                        <FontAwesomeIcon icon={faTimes} size={14} style={{ padding: 2 }} onPress={() => {
                            setSearchData("")
                        }} />
                    )}
                </View>
                

                {clicked && (
                    <View>
                        <TouchableOpacity
                            onPress={() => {
                                Keyboard.dismiss();
                                setClicked(false);
                                setSearchData("");
                            }}
                        >
                            <Text style={{ fontSize: 14, color: '#f9020b', marginLeft: 10 }}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            <View style={{paddingHorizontal: 15, marginBottom: 20 }}>
                <Text>{ langMode == 'BN' ? `${searchData}-এর জন্য ${count}-এর মধ্যে 1-${count} ফলাফল দেখানো হচ্ছে` : `Displaying  1-${count} results out of ${count} for "${searchData}"`}</Text>
            </View>

            <FlatList
                data={newsItem}
                renderItem={({ item }) => <CardItems item={item} />}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                style={{ paddingHorizontal: 15 }}
                ListFooterComponent={
                    <>
                        { loading ? 
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <ActivityIndicator size="large" color="#f9020b" />
                            </View> : null
                        }   
                        <Footer />
                    </>
                }
            />
        </>
    )
}

export default Search

const styles = StyleSheet.create({
    container: {
        margin: 15,
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: "row",
        width: "97%",
    },
    searchBar__unclicked: {
        padding: 10,
        flexDirection: "row",
        width: "95%",
        backgroundColor: "#d9dbda",
        borderRadius: 15,
        alignItems: "center",
    },
    searchBar__clicked: {
        padding: 10,
        flexDirection: "row",
        width: "80%",
        backgroundColor: "#d9dbda",
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "space-evenly",
    },
    input: {
        fontSize: 16,
        marginLeft: 10,
        width: "90%",
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