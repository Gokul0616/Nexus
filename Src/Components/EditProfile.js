import {useNavigation} from '@react-navigation/native';
import React, {useRef, useState} from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {TouchableRipple} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomHeader from './CustomHeader';
import {profileDummyData} from './DummyData';
import NexusInput from './NexusInput';
import apiClient from '../Services/api/apiInterceptor';
import CustomLoadingIndicator from './CustomLoadingIndicator';
import AlertBox from './AlertMessage';
import {fetchCityData} from './CommonData';
const {height, width} = Dimensions.get('window');
const EditProfile = ({route}) => {
  const {profileData} = route.params;
  const profile = profileDummyData[0];
  const navigation = useNavigation();
  const [name, setName] = useState(profileData?.fullName);
  const [username, setUsername] = useState(profileData?.username);
  const [bio, setBio] = useState(profileData?.bio);
  const [location, setLocation] = useState(profileData?.location);
  const [locationSearch, setLocationSearch] = useState('');
  const [locationPressed, setLocationPressed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [cityLoading, setCityLoading] = useState(false);
  const [isMessage, setIsMessage] = useState({
    message: '',
    heading: '',
    isRight: false,
    rightButtonText: 'OK',
    triggerFunction: () => {},
    setShowAlert: () => {},
    showAlert: false,
  });
  const closeAlert = () => {
    setIsMessage(prev => ({...prev, showAlert: false}));
  };
  const handleSave = async profilePic => {
    try {
      setLoading(true);
      const resopnse = await apiClient.post('/user/updateProfile', {
        fullName: name,
        username,
        bio,
        location,
        profilePic,
      });
      if (resopnse.status === 200) {
        setIsMessage({
          message: resopnse.data || 'Profile Updated Successfully!!',
          heading: 'Error',
          isRight: true,
          rightButtonText: 'OK',
          triggerFunction: () => {
            isMessage.setShowAlert(false);

            navigation.goBack();
          },
          setShowAlert: () => {
            isMessage.setShowAlert(false);
          },
          showAlert: true,
        });
      }
    } catch (error) {
      console.error('error', error);
      setIsMessage({
        message: error?.message || 'Unable to save user Profile!!',
        heading: 'Error',
        isRight: false,
        rightButtonText: 'OK',
        triggerFunction: () => {},
        setShowAlert: () => {
          isMessage.setShowAlert(false);
        },
        showAlert: true,
      });
    } finally {
      setLoading(false);
    }
  };
  const [cityResults, setCityResults] = useState([]);
  const debounceTimer = useRef(null);

  const handleCitySearch = val => {
    setLocationSearch(val);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (val.length < 3) {
      setCityResults([]);
      setCityLoading(false);
      return;
    }

    setCityLoading(true);

    debounceTimer.current = setTimeout(() => {
      fetchCityData(val)
        .then(cityData => {
          if (cityData) {
            setCityResults(cityData);
          }
          setCityLoading(false);
        })
        .catch(err => {
          console.error('Error fetching city data:', err);
          setCityLoading(false);
        });
    }, 1000);
  };
  const handleCitySelect = item => {
    setLocation(item.display_name);

    setCityResults([]);
    setLocationPressed(false);
  };

  const handleProfileUpload = async imageUrl => {
    try {
      const formData = new FormData();

      formData.append('image', {
        uri: imageUrl,
        type: 'image/jpeg',
        name: 'profile.jpg',
      });

      const response = await apiClient.post('images/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading image:', error);
      setIsMessage({
        message: error?.message || 'Unable to upload image',
        heading: 'Error',
        isRight: false,
        rightButtonText: 'OK',
        triggerFunction: () => {},
        setShowAlert: () => {
          isMessage.setShowAlert(false);
        },
        showAlert: true,
      });
    }
  };

  const handleGallery = async () => {
    setLoading(true);
    const options = {
      mediaType: 'photo',
      selectionLimit: 1,
    };

    launchImageLibrary(options, res => {
      if (res.didCancel) {
        console.log('User cancelled image picker');
      } else if (res.errorCode) {
        console.log('ImagePicker Error: ', res.errorMessage);
      } else if (res.assets && res.assets.length > 0) {
        const imageAsset = res.assets[0];
        setProfilePic(imageAsset.uri);
      }
    }).finally(() => {
      setLoading(false);
    });
  };
  return (
    <>
      {loading && (
        <View style={styles.loadingIndicator}>
          <CustomLoadingIndicator />
        </View>
      )}
      <AlertBox
        heading={isMessage.heading}
        message={isMessage.message}
        setShowAlert={closeAlert}
        showAlert={isMessage.showAlert}
        triggerFunction={isMessage.triggerFunction}
        isRight={isMessage.isRight}
        rightButtonText={isMessage.rightButtonText}
      />
      {locationPressed && (
        <View>
          <CustomHeader
            headerTitle={'Location'}
            navigation={navigation}
            leftIconFunction={() => {
              setLocationPressed(false);
            }}
          />
          <View style={{paddingHorizontal: 10, paddingVertical: 5}}>
            <NexusInput
              style={styles.input}
              autofocus={locationPressed ? true : false}
              value={locationSearch}
              onChangeText={val => handleCitySearch(val)}
              placeholder="Where are you based?"
            />
          </View>
          {cityLoading && (
            <CustomLoadingIndicator style={{borderColor: '#ccc'}} />
          )}
          {cityResults.length > 0 && (
            <FlatList
              data={cityResults}
              keyExtractor={item => item.place_id.toString()}
              keyboardShouldPersistTaps="handled"
              renderItem={({item}) => (
                <TouchableRipple
                  rippleColor={'rgb(0,0,0,0.5)'}
                  onPress={() => handleCitySelect(item)}>
                  <View
                    style={{
                      padding: 10,
                      paddingVertical: 15,
                      borderBottomWidth: 1,
                      borderBottomColor: '#ccc',
                    }}>
                    <Text>{item.display_name}</Text>
                  </View>
                </TouchableRipple>
              )}
            />
          )}
        </View>
      )}
      {!locationPressed && (
        <>
          <CustomHeader headerTitle={'edit profile'} navigation={navigation} />
          <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="always">
            <View style={styles.avatarContainer}>
              <TouchableRipple
                borderless
                rippleColor={'#fff'}
                onPress={handleGallery}>
                <>
                  {profilePic || profileData?.profilePic ? (
                    <Image
                      source={
                        profilePic
                          ? {uri: profilePic}
                          : {uri: profileData?.profilePic}
                      }
                      style={[styles.avatar, {borderWidth: 0}]}
                    />
                  ) : (
                    <Image
                      source={require('../../assets/images/emptyAvatar.png')}
                      style={styles.avatar}
                    />
                  )}
                  <View style={styles.overlay} />
                  <Ionicons
                    name="camera"
                    style={[
                      styles.cameraIcon,
                      profileData?.profilePic
                        ? {color: '#eee'}
                        : {color: '#666'},
                    ]}
                    size={30}
                  />
                </>
              </TouchableRipple>
              <Text style={styles.username}>{profileData?.username}</Text>
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Name</Text>
              <NexusInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
              />
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Bio</Text>
              <NexusInput
                style={[styles.input, {height: 80}]}
                value={bio}
                onChangeText={val => {
                  if (val.length <= 100) {
                    setBio(val);
                  }
                }}
                placeholder="Tell us about yourself"
                multiline
              />
              <Text style={{alignSelf: 'flex-end'}}>
                {bio?.length ? bio.length : 0}/100
              </Text>
            </View>
            {/* <View style={styles.fieldContainer}>
          <Text style={styles.label}>Website</Text>
          <NexusInput
            style={styles.input}
            value={website}
            onChangeText={setWebsite}
            placeholder="Your website URL"
            keyboardType="url"
          />
        </View> */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Location</Text>
              <NexusInput
                onPress={() => {
                  setLocationPressed(true);
                  setLocationSearch('');
                }}
                style={styles.input}
                value={location}
                onChangeText={val => {
                  setLocation(val);
                }}
                placeholder="Where are you based?"
              />
            </View>
            <TouchableRipple
              borderless={true}
              style={styles.saveButton}
              onPress={async () => {
                let response;
                if (profilePic !== null) {
                  response = await handleProfileUpload(profilePic);
                }
                await handleSave(response);
              }}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableRipple>
          </ScrollView>
        </>
      )}
    </>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  loadingIndicator: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    zIndex: 100,
    height: height,
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
    backgroundColor: 'rgba(0,0,0,0.2)',
    position: 'absolute',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    borderRadius: 15,
    padding: 5,
  },
  avatar: {
    width: 120,
    height: 120,
    borderWidth: 5,
    borderColor: '#ccc',
    borderRadius: 60,
    marginBottom: 10,
  },
  username: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
  },
  fieldContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: '#000',
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: '#0887ff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
