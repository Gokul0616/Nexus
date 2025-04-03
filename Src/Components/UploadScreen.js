import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  BackHandler,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {createThumbnail} from 'react-native-create-thumbnail';
import {TouchableRipple} from 'react-native-paper';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Ionicons from 'react-native-vector-icons/Ionicons';
import apiClient from '../Services/api/apiInterceptor';
import {useDebounce} from '../Services/Hooks/useDebounce';
import AlertBox from './AlertMessage';
import {fetchCityData, PrimaryColor} from './CommonData';
import CustomLoadingIndicator from './CustomLoadingIndicator';
import NexusInput from './NexusInput';
import {uploadVideoAndThumbnail} from './UploadPost';
import {NavigationContext} from '../Services/Hooks/NavigationProvider';

const UploadPost = ({route, navigation}) => {
  const {path: uri} = route.params || {};

  const [caption, setCaption] = useState('');
  const [thumbnail, setThumbnail] = useState(null);

  const [allowDuet, setAllowDuet] = useState(true);
  const [allowStitch, setAllowStitch] = useState(true);
  const [allowComment, setAllowComment] = useState(true);
  const [saveToDevice, setSaveToDevice] = useState(false);

  const [isLocation, setIsLocation] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [locationVal, setLocationVal] = useState('');
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [locationList, setLocationList] = useState([]);
  const {setProgressmodalVisible, setUploadProgress, setIsMessage, isMessage} =
    useContext(NavigationContext);
  const [isMusic, setIsMusic] = useState(false);
  const [musicTitle, setMusicTitle] = useState('');
  const [selectedMusic, setSelectedMusic] = useState('');

  const [isPrivacy, setIsPrivacy] = useState(false);
  const [privacyOption, setPrivacyOption] = useState(
    'Everyone can view this post',
  );
  const privacyOptions = [
    'Everyone can view this post',
    'Friends Only',
    'Only Me',
  ];

  useEffect(() => {
    if (uri) {
      createThumbnail({
        url: `file://${uri}`,
        timeStamp: 1000,
      })
        .then(response => {
          setThumbnail(response.path);
        })
        .catch(err => {
          console.warn('Error generating thumbnail:', err);
        });
    }
  }, [uri]);

  const naviBack = () => {
    navigation.goBack();
  };

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (!isLocation && !isMusic && !isPrivacy) {
          naviBack();
        } else {
          setIsLocation(false);
          setIsMusic(false);
          setIsPrivacy(false);
          setSearchVal('');
        }
        return true;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );
      return () => subscription.remove();
    }, [navigation, isLocation, isMusic, isPrivacy]),
  );
  const closeAlert = () => {
    setIsMessage(prev => ({...prev, showAlert: false}));
  };
  const handlePost = () => {
    if (thumbnail === null) {
      setIsMessage({
        message: 'Please waiit unitll thumbnail is generated',
        heading: 'Wait',
        isRight: false,
        rightButtonText: 'OK',
        triggerFunction: () => {},
        setShowAlert: () => {
          isMessage.setShowAlert(false);
        },
        showAlert: true,
      });
      return;
      0;
    }
    navigation.pop(2);
    setProgressmodalVisible(true);
    uploadVideoAndThumbnail(uri, thumbnail, setUploadProgress)
      .then(response => {
        if (response.status === 500) {
          setProgressmodalVisible(false);
          setIsMessage({
            message: response.response.data.error || 'Unable to upload video',
            heading: 'Error',
            isRight: false,
            rightButtonText: 'OK',
            triggerFunction: () => {},
            setShowAlert: () => {
              isMessage.setShowAlert(false);
            },
            showAlert: true,
          });
          return;
        } else {
          saveVideo(
            response.videoId,
            response.videoUrl,
            response.thumbnailUrl,
            caption,
            'Music',
            'music',
          );
        }
      })
      .catch(error => {
        setProgressmodalVisible(false);
        setIsMessage({
          message: error.message || 'Unable to upload video',
          heading: 'Error',
          isRight: false,
          rightButtonText: 'OK',
          triggerFunction: () => {},
          setShowAlert: () => {
            isMessage.setShowAlert(false);
          },
          showAlert: true,
        });
        return;
        0;
      });
  };
  const saveVideo = async (
    videoId,
    videoUrl,
    thumbnailUrl,
    description,
    category,
    tags,
  ) => {
    try {
      const payload = {
        videoId,
        videoUrl,
        thumbnailUrl,
        description,
        category,
        tags,
      };

      const response = await apiClient.post('post/savePost', payload);

      if (response.status === 200) {
        return response.data;
      } else {
        // console.error('Failed to save post:', response.statusText);
        return null;
      }
    } catch (error) {
      // console.error('Error saving video:', error);
      if (error.response) {
        // console.error('Error Response Data:', error.response.data);
        // console.error('Error Status:', error.response.status);
      }
      return null;
    }
  };

  const debounceVal = useDebounce(searchVal, 500);
  useEffect(() => {
    if (debounceVal.length > 0) {
      setIsLocationLoading(true);
      const fetchData = async () => {
        try {
          const data = await fetchCityData(debounceVal);
          setLocationList(data);
        } catch (error) {
          // console.error('Error fetching city data:', error);
        } finally {
          setIsLocationLoading(false);
        }
      };
      fetchData();
    }
  }, [debounceVal]);

  return (
    <View style={styles.container}>
      {/* <AlertBox
        heading={isMessage.heading}
        message={isMessage.message}
        setShowAlert={closeAlert}
        showAlert={isMessage.showAlert}
        triggerFunction={isMessage.triggerFunction}
        isRight={isMessage.isRight}
        rightButtonText={isMessage.rightButtonText}
      /> */}
      {!isLocation && !isMusic && !isPrivacy && (
        <>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Post</Text>
            <TouchableOpacity onPress={handlePost}>
              <Text style={styles.postText}>Post</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}>
            <View style={styles.captionRow}>
              <TextInput
                style={styles.captionInput}
                value={caption}
                onChangeText={setCaption}
                placeholder="Write a caption..."
                multiline
              />
              <Pressable
                style={styles.thumbnailContainer}
                onPress={() => {
                  // navigation.navigate('SelectThumbnail', {
                  //   videoUri: uri,
                  // });
                  return;
                }}>
                {thumbnail ? (
                  <Image
                    source={{uri: thumbnail}}
                    style={styles.thumbnail}
                    resizeMethod="contain"
                  />
                ) : (
                  <View style={styles.thumbnailPlaceholder}>
                    <Text style={styles.placeholderText}>
                      {uri ? 'Generating thumbnail...' : 'No preview'}
                    </Text>
                  </View>
                )}
              </Pressable>
            </View>

            <View style={styles.quickToolsRow}>
              <Pressable style={styles.quickButton}>
                <Text style={styles.quickButtonText}># Hashtag</Text>
              </Pressable>
              <Pressable style={styles.quickButton}>
                <Text style={styles.quickButtonText}>@ Mention</Text>
              </Pressable>
            </View>

            <TouchableRipple
              rippleColor={'rgba(0,0,0,0.5)'}
              onPress={() => setIsLocation(true)}
              style={styles.menuItem}>
              <>
                <View style={styles.menuRow}>
                  <Ionicons name="location-outline" size={22} color="#333" />
                  <View style={[styles.menuRow, {gap: 2}]}>
                    <Text style={styles.menuText}>
                      {locationVal.length > 0
                        ? locationVal.length > 30
                          ? locationVal.slice(0, 30) + '...'
                          : locationVal
                        : 'Add Location'}
                    </Text>
                    <Ionicons
                      name="information-circle-outline"
                      size={15}
                      color="#333"
                    />
                  </View>
                </View>
                {locationVal.length > 0 ? (
                  <TouchableOpacity
                    onPress={() => {
                      setLocationVal('');
                    }}>
                    <Ionicons name="close" size={22} color="#333" />
                  </TouchableOpacity>
                ) : (
                  <Ionicons
                    name="chevron-forward-outline"
                    size={22}
                    color="#333"
                  />
                )}
              </>
            </TouchableRipple>

            <TouchableRipple
              rippleColor={'rgba(0,0,0,0.5)'}
              style={styles.menuItem}
              onPress={() => setIsMusic(true)}>
              <>
                <View style={styles.menuRow}>
                  <FontAwesome6 name="music" size={22} color="#333" />
                  <Text style={styles.menuText}>
                    {selectedMusic || 'Add Music'}
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward-outline"
                  size={22}
                  color="#333"
                />
              </>
            </TouchableRipple>

            <TouchableRipple
              rippleColor={'rgba(0,0,0,0.5)'}
              style={[styles.menuItem, styles.visibilityRow]}
              onPress={() => setIsPrivacy(true)}>
              <>
                <Text style={styles.menuText}>{privacyOption}</Text>
                <Ionicons
                  name="chevron-forward-outline"
                  size={22}
                  color="#333"
                />
              </>
            </TouchableRipple>

            {/* <TouchableRipple
              rippleColor={'rgba(0,0,0,0.5)'}
              style={styles.menuItem}>
              <>
                <View style={styles.menuRow}>
                  <FontAwesome6 name="plus" size={16} color="#333" />
                  <Text style={styles.menuText}>Add Link</Text>
                </View>
                <Ionicons
                  name="chevron-forward-outline"
                  size={22}
                  color="#333"
                />
              </>
            </TouchableRipple> */}

            <View style={styles.toggleSection}>
              <View style={styles.toggleItemCustom}>
                <Ionicons
                  name="people-outline"
                  size={24}
                  color="#333"
                  style={styles.toggleIcon}
                />
                <Text style={styles.toggleLabelCustom}>Duet</Text>
                <Switch
                  value={allowDuet}
                  onValueChange={setAllowDuet}
                  trackColor={{false: '#767577', true: PrimaryColor}}
                  thumbColor={allowDuet ? '#fff' : '#f4f3f4'}
                  ios_backgroundColor="#3e3e3e"
                />
              </View>
              <View style={styles.toggleItemCustom}>
                <Ionicons
                  name="videocam-outline"
                  size={24}
                  color="#333"
                  style={styles.toggleIcon}
                />
                <Text style={styles.toggleLabelCustom}>Stitch</Text>
                <Switch
                  value={allowStitch}
                  onValueChange={setAllowStitch}
                  trackColor={{false: '#767577', true: PrimaryColor}}
                  thumbColor={allowStitch ? '#fff' : '#f4f3f4'}
                  ios_backgroundColor="#3e3e3e"
                />
              </View>
              <View style={styles.toggleItemCustom}>
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={24}
                  color="#333"
                  style={styles.toggleIcon}
                />
                <Text style={styles.toggleLabelCustom}>Comments</Text>
                <Switch
                  value={allowComment}
                  onValueChange={setAllowComment}
                  trackColor={{false: '#767577', true: PrimaryColor}}
                  thumbColor={allowComment ? '#fff' : '#f4f3f4'}
                  ios_backgroundColor="#3e3e3e"
                />
              </View>
              <View style={styles.toggleItemCustom}>
                <Ionicons
                  name="download-outline"
                  size={24}
                  color="#333"
                  style={styles.toggleIcon}
                />
                <Text style={styles.toggleLabelCustom}>Save</Text>
                <Switch
                  value={saveToDevice}
                  onValueChange={setSaveToDevice}
                  trackColor={{false: '#767577', true: PrimaryColor}}
                  thumbColor={saveToDevice ? '#fff' : '#f4f3f4'}
                  ios_backgroundColor="#3e3e3e"
                />
              </View>
            </View>
          </ScrollView>

          <View style={styles.bottomBar}>
            <TouchableOpacity style={styles.draftsButton}>
              <Text style={styles.draftsText}>Drafts</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.postButton} onPress={handlePost}>
              <Text style={styles.postButtonText}>Post</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      {isLocation && (
        <View style={styles.locationContainer}>
          <NexusInput
            value={searchVal}
            onChangeText={setSearchVal}
            placeholder={'Location'}
            autofocus={true}
          />
          <View style={styles.locationList}>
            {isLocationLoading && <CustomLoadingIndicator />}
            {locationList?.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.locationItem}
                onPress={() => {
                  setLocationVal(item.display_name);
                  setIsLocation(false);
                  setSearchVal('');
                  setLocationList([]);
                }}>
                <Text
                  style={styles.locationText}
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  {item.display_name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
      {isMusic && (
        <View style={styles.inlineContainer}>
          <Text style={styles.inlineTitle}>Enter Music Title</Text>
          <NexusInput
            value={musicTitle}
            onChangeText={setMusicTitle}
            placeholder="Type music title..."
          />
          <View style={styles.inlineButtonsRow}>
            <TouchableOpacity
              style={styles.inlineButton}
              onPress={() => {
                setSelectedMusic(musicTitle);
                setIsMusic(false);
                setMusicTitle('');
              }}>
              <Text style={styles.inlineButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.inlineButton, styles.inlineCancelButton]}
              onPress={() => {
                setIsMusic(false);
                setMusicTitle('');
              }}>
              <Text style={styles.inlineButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {isPrivacy && (
        <View style={styles.inlineContainer}>
          <Text style={styles.inlineTitle}>Select Privacy Option</Text>
          {privacyOptions.map((option, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.privacyOptionInline}
              onPress={() => {
                setPrivacyOption(option);
                setIsPrivacy(false);
              }}>
              <Text style={styles.privacyOptionText}>{option}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={[styles.inlineButton, styles.inlineCancelButton]}
            onPress={() => setIsPrivacy(false)}>
            <Text style={styles.inlineButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default UploadPost;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 48,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  cancelText: {fontSize: 16, color: '#999'},
  headerTitle: {fontSize: 16, fontWeight: '600', color: '#000'},
  postText: {fontSize: 16, color: PrimaryColor, fontWeight: '600'},
  scrollContainer: {flex: 1, backgroundColor: '#fff'},
  scrollContent: {paddingBottom: 80},
  captionRow: {flexDirection: 'row', padding: 16},
  captionInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginRight: 12,
    height: 100,
    textAlignVertical: 'top',
  },
  thumbnailContainer: {
    width: 64,
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f2f2f2',
  },
  thumbnail: {width: '100%', height: '100%', resizeMode: 'cover'},
  thumbnailPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {fontSize: 12, color: '#999'},
  quickToolsRow: {flexDirection: 'row', paddingHorizontal: 16, marginBottom: 8},
  quickButton: {
    backgroundColor: '#f1f1f1',
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginRight: 8,
  },
  quickButtonText: {fontSize: 14, color: '#333'},
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  menuText: {fontSize: 16, fontWeight: 'bold', color: '#333'},
  menuRow: {flexDirection: 'row', alignItems: 'center', gap: 10},
  visibilityRow: {},

  toggleSection: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 20,
  },
  toggleItemCustom: {
    alignItems: 'center',
  },
  toggleIcon: {
    marginBottom: 6,
  },
  toggleLabelCustom: {
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
    marginBottom: 6,
  },

  bottomBar: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    height: 56,
    width: '100%',
    borderTopWidth: 0.5,
    borderTopColor: '#ccc',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  draftsButton: {paddingVertical: 8, paddingHorizontal: 12},
  draftsText: {fontSize: 16, color: '#999'},
  postButton: {
    backgroundColor: PrimaryColor,
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  postButtonText: {color: '#fff', fontSize: 16, fontWeight: '600'},
  locationContainer: {paddingHorizontal: 16, paddingVertical: 12},
  locationList: {flexDirection: 'column', marginTop: 10},
  locationItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  locationText: {fontSize: 14, color: '#333'},
  inlineContainer: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    fles: 1,
    height: '100%',
  },
  inlineTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  inlineButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  inlineButton: {
    backgroundColor: PrimaryColor,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
  inlineCancelButton: {backgroundColor: '#999'},
  inlineButtonText: {color: '#fff', fontSize: 16},
  privacyOptionInline: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  privacyOptionText: {fontSize: 16, color: '#333'},
});
