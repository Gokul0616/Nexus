import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {
  Alert,
  Image,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from 'react-native';
import {TouchableRipple} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import CustomLoadingIndicator from '../../Components/CustomLoadingIndicator';
import DurationSelector from '../../Components/DurationSelector';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import {AddPostScreenStyles as styles} from '../../Components/Styles/Styles';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

const AddPost = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const navigation = useNavigation();
  const [cameraPosition, setCameraPosition] = useState('back');
  const [isRecording, setIsRecording] = useState(false);
  const [isLongPressRecording, setIsLongPressRecording] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState('3m');
  const [zoom, setZoom] = useState(0);
  const cameraRef = useRef(null);
  const isFocused = useIsFocused();
  const devices = useCameraDevices();
  const backDevice = devices.find(d => d.position === 'back');
  const [torch, setTorch] = useState(false);
  const frontDevice = devices.find(d => d.position === 'front');
  const device = cameraPosition === 'back' ? backDevice : frontDevice;
  const [loading, setLoading] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef(null);
  const [videoUri, setVideoUri] = useState(null);
  const [cameraPer, setCamerPer] = useState(false);
  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermission();
      const microphonePermission = await Camera.requestMicrophonePermission();
      setHasPermission(
        (cameraPermission === 'authorized' || cameraPermission === 'granted') &&
          (microphonePermission === 'authorized' ||
            microphonePermission === 'granted'),
      );
      setCamerPer(true);
    })();
  }, []);
  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      const permissionType =
        Platform.Version >= 33
          ? PERMISSIONS.ANDROID.READ_MEDIA_VIDEO
          : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
      let result = await check(permissionType);
      console.log('Permission check result:', result);

      if (result === RESULTS.GRANTED) {
        return true;
      }
      result = await request(permissionType);

      if (result === RESULTS.GRANTED) {
        return true;
      } else if (result === RESULTS.BLOCKED || result === RESULTS.UNAVAILABLE) {
        // Alert.alert(
        //   'Permission Required',
        //   'Please enable storage permission in settings to load videos.',
        // );
        console.log(
          'Permission Required Please enable storage permission in settings to load videos.',
        );
      }
      return false;
    }
    return true;
  };

  useEffect(() => {
    const fetchLatestVideo = async () => {
      try {
        if (Platform.OS === 'android') {
          const permissionGranted = await requestStoragePermission();
          if (!permissionGranted) {
            return;
          }
        }

        const params = {
          first: 10,
          assetType: 'Videos',
          maxDurationSec: 180,
        };
        const {edges} = await CameraRoll.getPhotos(params);

        if (edges.length > 0) {
          const latestVideo = edges
            .map(edge => edge.node)
            .sort((a, b) => b.timestamp - a.timestamp)[0];
          const uri =
            latestVideo.image.uri ||
            (latestVideo.video && latestVideo.video.uri);
          setVideoUri(uri);
        }
      } catch (error) {
        console.error('Error fetching video:', error);
      }
    };
    if (cameraPer) {
      fetchLatestVideo();
    }
  }, [cameraPer]);
  const handleFlipCamera = () => {
    setCameraPosition(prev => (prev === 'back' ? 'front' : 'back'));
  };

  const parseDurationToMs = duration => {
    const num = parseInt(duration, 10);
    return duration.includes('m') ? num * 60 * 1000 : num * 1000;
  };

  const formatTime = timeInSeconds => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  };

  const startRecording = async () => {
    try {
      if (cameraRef.current == null) return;

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      setIsRecording(true);
      setElapsedTime(0);

      const maxDuration = parseDurationToMs(selectedDuration);
      Vibration.vibrate(100);
      intervalRef.current = setInterval(() => {
        setElapsedTime(prev => {
          const nextTime = prev + 1;
          if (nextTime * 1000 >= maxDuration) {
            clearInterval(intervalRef.current);
            stopRecording();
          }
          return nextTime;
        });
      }, 1000);

      await cameraRef.current.startRecording({
        onRecordingFinished: video => {
          setIsRecording(false);
          clearInterval(intervalRef.current);
          setElapsedTime(0);
          navigation.navigate('UploadScreen', {path: video.path});
        },
        onRecordingError: error => {
          console.warn('Recording error:', error);
          setIsRecording(false);
          clearInterval(intervalRef.current);
          setElapsedTime(0);
        },
        maxDuration: maxDuration,
      });
    } catch (e) {
      console.warn(e);
      setIsRecording(false);
      clearInterval(intervalRef.current);
      setElapsedTime(0);
    }
  };

  const stopRecording = async () => {
    try {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (cameraRef.current == null) return;
      setIsRecording(false);
      setElapsedTime(0);
      await cameraRef.current.stopRecording();
    } catch (e) {
      console.warn(e);
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleRecordPress = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleGallery = async () => {
    setLoading(true);
    const options = {
      mediaType: 'video',
      selectionLimit: 1,
      durationLimit: 180,
      maxDurationSec: 180,
    };

    launchImageLibrary(options, res => {
      if (res.didCancel) {
        console.log('User cancelled');
      } else if (res.errorCode) {
        console.log('ImagePickerError: ', res.errorMessage);
      } else {
        console.log('loading');
        const videoAsset = res.assets[0];
        if (videoAsset.duration && videoAsset.duration > 180) {
          Alert.alert('Please select a video that is 3 minutes or shorter');
          return;
        }
        navigation.navigate('UploadScreen', {path: videoAsset.uri});
      }
    }).finally(() => {
      setLoading(false);
    });
  };
  if (!hasPermission) {
    return (
      <View style={styles.permissionContainer}>
        <CustomLoadingIndicator />
        <Text style={styles.permissionText}>No access to camera</Text>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.loadingContainer}>
        <CustomLoadingIndicator />
      </View>
    );
  }

  const maxDurationSec = parseDurationToMs(selectedDuration) / 1000;

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.fullScreenOverlay}>
          <CustomLoadingIndicator />
        </View>
      )}
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isFocused}
        video={true}
        torch={torch ? 'on' : 'off'}
        audio={true}
      />

      {/* <View style={styles.topBar}>
        <TouchableOpacity style={styles.addSoundBtn}>
          <Text style={styles.addSoundText}>Add sound</Text>
        </TouchableOpacity>
      </View> */}
      {isRecording && (
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>
            {formatTime(elapsedTime)} / {formatTime(maxDurationSec)}
          </Text>
        </View>
      )}
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => {
          navigation.goBack();
        }}>
        <Ionicons name="close" size={24} color="#fff" />
      </TouchableOpacity>

      <View style={styles.rightSidebar}>
        <TouchableRipple
          rippleColor={'rgba(0, 0, 0, .15)'}
          style={styles.iconButton}
          onPress={handleFlipCamera}>
          <>
            <Ionicons name="camera-reverse-outline" size={24} color="#fff" />
            <Text style={styles.iconLabel}>Flip</Text>
          </>
        </TouchableRipple>
        <TouchableRipple
          rippleColor={'rgba(0, 0, 0, .15)'}
          style={styles.iconButton}
          onPress={() => {
            if (cameraPosition === 'back') {
              setTorch(!torch);
            }
          }}>
          <>
            {torch ? (
              <Ionicons name="flash-off-outline" size={24} color="#fff" />
            ) : (
              <Ionicons name="flash-outline" size={24} color="#fff" />
            )}
            <Text style={styles.iconLabel}>Flash</Text>
          </>
        </TouchableRipple>
      </View>

      <View style={styles.durationWrapper}>
        <DurationSelector
          options={['3m', '60s', '15s']}
          onSelect={setSelectedDuration}
        />
      </View>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[
            styles.recordButton,
            isRecording && {backgroundColor: '#a9d3fb'},
          ]}
          onPress={handleRecordPress}
          onLongPress={() => {
            setIsLongPressRecording(true);
            startRecording();
          }}
          onPressOut={() => {
            if (isLongPressRecording) {
              setIsLongPressRecording(false);
              stopRecording();
            }
          }}>
          <View
            style={[
              styles.innerRecordButton,
              !isRecording && {backgroundColor: 'grey'},
            ]}>
            <Text style={styles.recordButtonText}>
              {isRecording ? 'Stop' : 'Rec'}
            </Text>
          </View>
        </TouchableOpacity>
        <View style={styles.extraOptions}>
          <Text style={styles.extraOption}></Text>
          <TouchableOpacity
            onPress={() => handleGallery()}
            style={{
              height: 50,
              width: 50,
              borderWidth: 1,
              borderColor: '#fff',
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={{uri: videoUri}}
              style={{height: 47, width: 47, borderRadius: 9.4}}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default AddPost;
