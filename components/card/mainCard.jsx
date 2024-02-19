import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import { images } from '../../constants'
import moment from 'moment/min/moment-with-locales';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { faShare } from '@fortawesome/free-solid-svg-icons';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

const MemoizedImageBlurLoading = ({ item }) => (
    <Image
      style={{ width: '100%', height: undefined, aspectRatio: 16 / 9, borderRadius: 5 }}
      src={  item.ads_image || item.crop_size }
    />
);
  
const MemoizedVendorBlurLoading = ({ item }) => (
    <Image
    src={ item.news_vendor_logo }
      style={{ flex: 1, width: 90, height: 20, backgroundColor: 'white', resizeMode: 'contain' }}
    />
);

const MainCard = ( { item, themeContainerStyle, themeTextStyle, borderColor, themeIconStyle, bookmarkedItems, langMode, viewableItems, openLink, socialShareHandle, bookmarkHandle } ) => {
    return(
        <>
            { item?.news_group ? 
            <View className="mb-5 ml-[15px] mr-[15px]">
                <View>
                <Text style={[themeTextStyle, borderColor, {fontSize: 16, fontWeight: '600', borderBottomWidth: 1, borderStyle: 'solid', paddingBottom: 10}]}>{item?.news_group}</Text>
                <View style={{width: 40, height: 2, backgroundColor: '#f9020b', marginTop: -2}}></View>
                </View>
            </View>
            :       
            <View className="post-item group max-[767px]:p-4 ml-[15px] mr-[15px]" data-id={item?.id} style={[themeContainerStyle, {marginBottom: 15}]}>
                <View className={ item?.ads_image ? 'post-body ads' : 'post-body' }>
                {item?.ads_image || item?.thumbnail ? (
                    <>
                        <MemoizedImageBlurLoading item={item} />
                        { item?.news_vendor_logo && (
                            <View style={{ flex: 1, position: 'absolute', top: '109%', right: 0 }}>
                                <MemoizedVendorBlurLoading item={item} />
                            </View>
                        ) }
                    </>
                ) : (
                    <>
                        <Image
                            source={images.placeholder} // Provide a default placeholder image source when both ads_image and thumbnail are empty
                            style={{ width: '100%', height: undefined, aspectRatio: 16 / 9 }}
                            contentFit="cover"
                        />
                    </>
                )}
                </View>

                { !item?.ads_image && (
                    <View className="post-category flex text-xl mt-5 dark:text-white" style={styles.categoryViewParent}>
                        <View>
                            { item && 
                                <Text className='dark:text-white' style={{fontSize: 11}}>{ langMode == 'BN' ? item?.creator + ' দ্বারা নির্মিত' : 'Cruated By ' + item?.creator }</Text>
                            }
                        </View>
                    </View>
                )}

                { item?.ads_image ? (
                    <Text className={`post-title font-bold text-md md:text-3xl mt-3 transition-al`} style={[styles.headingBold, themeTextStyle]}>{ langMode == 'BN' ? item?.title : item?.title}</Text>
                ) : (
                    <Text className={`post-title ${ viewableItems === item?.id || item?.is_read ? '' : 'font-bold' } text-md md:text-3xl mt-3 transition-al`} style={[styles.headingBold, themeTextStyle]}>{ langMode == 'BN' ? item?.summary_bn : item?.summary_en}</Text>
                ) }

                { item?.ads_image ? (
                    <View style={styles.container}>
                        <Text style={[styles.linkText, themeTextStyle]}>
                        {langMode == 'BN' ? 'সৌজন্যে:' : 'Sponsored by:'}{' '}
                        <Text style={[styles.linkText, themeTextStyle]}>{item?.sponsor}</Text>
                        </Text>
                    </View>
                ) : (
                    <View style={styles.container2}>
                        <View style={styles.row}>
                            <View style={styles.column}>
                                <View style={styles.iconoloumn}>
                                    <FontAwesomeIcon icon={faClock} style={{marginRight: 5, fontSize: 10, opacity: 0.6}} color={themeIconStyle} size={15} />
                                    <Text style={[styles.timeText, themeTextStyle]}>
                                        {langMode === 'BN' ? moment(new Date(item?.publish_date)).startOf('seconds').locale('bn-bd').fromNow() : moment(new Date(item?.publish_date)).startOf('seconds').locale('en').fromNow() }
                                    </Text>
                                </View>

                                <TouchableOpacity style={styles.readMoreLink} onPress={(e) => item.source && openLink(e, item.source) }>
                                    <View style={styles.iconoloumn}>
                                        <Text style={[styles.readMoreText, themeTextStyle]}>
                                        {langMode == 'BN' ? 'বিস্তারিত' : 'Read More'}
                                        </Text>
                                        <FontAwesomeIcon color={themeIconStyle} icon={faArrowUp} style={{marginTop: -5,marginRight: 5, opacity: 0.6, transform: [{ rotate: '45deg' }]}} size={15} />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            
                            {item?.ads && (
                                <View style={styles.column}>
                                    <Text style={[styles.sponsoredText, themeTextStyle]}>
                                        {langMode == 'BN' ? 'সৌজন্যে:' : 'Sponsored:'}
                                    </Text>
                                    <TouchableOpacity style={styles.sponsorLink}>
                                        <Image source={{ uri: item?.ads.sponsor_image }} style={styles.sponsorImage} contentFit='cover' />
                                        <Text style={[styles.sponsorName, themeTextStyle]}>{item?.ads.sponsor}</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                    
                            <View style={styles.column}>
                                <TouchableOpacity style={styles.shareLink} onPress={(e) => bookmarkHandle(e, item)}>
                                <View style={styles.socialBookmark}>
                                    <FontAwesomeIcon icon={faBookmark} color={bookmarkedItems.includes(item?.id) ? styles.bookmarkedIcon?.color : (item?.book_marks ? styles.bookmarkedIcon?.color : themeIconStyle )} style={styles.innerBookmark} size={15} />
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
            }
        </>
    )
}


export default MainCard

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
      marginTop: -7,
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