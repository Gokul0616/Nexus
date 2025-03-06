import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Animated,
} from 'react-native';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DurationSelector from '../../Components/DurationSelector';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import CustomLoadingIndicator from '../../Components/CustomLoadingIndicator';
import ZoomSlider from '../../Components/ZoomLevelIndicator';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const AddPost = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const navigation = useNavigation();
  const [cameraPosition, setCameraPosition] = useState('back');
  const [isRecording, setIsRecording] = useState(false);
  const [isLongPressRecording, setIsLongPressRecording] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState('15s');
  // zoom is a normalized value from 0 to 1
  const [zoom, setZoom] = useState(0);
  const cameraRef = useRef(null);
  const isFocused = useIsFocused();
  const devices = useCameraDevices();
  const backDevice = devices.find(d => d.position === 'back');
  const frontDevice = devices.find(d => d.position === 'front');
  const device = cameraPosition === 'back' ? backDevice : frontDevice;

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermission();
      const microphonePermission = await Camera.requestMicrophonePermission();
      setHasPermission(
        (cameraPermission === 'authorized' || cameraPermission === 'granted') &&
          (microphonePermission === 'authorized' ||
            microphonePermission === 'granted'),
      );
    })();
  }, []);

  const handleFlipCamera = () => {
    setCameraPosition(prev => (prev === 'back' ? 'front' : 'back'));
  };

  const startRecording = async () => {
    try {
      if (cameraRef.current == null) return;
      setIsRecording(true);
      await cameraRef.current.startRecording({
        onRecordingFinished: video => {
          console.log('Video path:', video.path);
          setIsRecording(false);
        },
        onRecordingError: error => {
          console.error('Recording error:', error);
          setIsRecording(false);
        },
      });
    } catch (e) {
      console.error(e);
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    try {
      if (cameraRef.current == null) return;
      setIsRecording(false);
      await cameraRef.current.stopRecording();
    } catch (e) {
      console.error(e);
    }
  };

  const handleRecordPress = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
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

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={device}
        // isActive={false}
        isActive={isFocused}
        video={true}
        audio={true}
        zoom={zoom} // set camera zoom from state
      />

      <View style={styles.topBar}>
        <TouchableOpacity style={styles.addSoundBtn}>
          <Text style={styles.addSoundText}>Add sound</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => {
          navigation.goBack();
        }}>
        <Ionicons name="close" size={24} color="#fff" />
      </TouchableOpacity>

      <View style={styles.rightSidebar}>
        <TouchableOpacity style={styles.iconButton} onPress={handleFlipCamera}>
          <Ionicons name="camera-reverse-outline" size={24} color="#fff" />
          <Text style={styles.iconLabel}>Flip</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="speedometer-outline" size={24} color="#fff" />
          <Text style={styles.iconLabel}>Speed</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="color-filter-outline" size={24} color="#fff" />
          <Text style={styles.iconLabel}>Filters</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <MaterialCommunityIcons
            name="face-woman-outline"
            size={24}
            color="#fff"
          />
          <Text style={styles.iconLabel}>Beauty</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="timer-outline" size={24} color="#fff" />
          <Text style={styles.iconLabel}>Timer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="chatbubble-outline" size={24} color="#fff" />
          <Text style={styles.iconLabel}>Reply</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="flash-outline" size={24} color="#fff" />
          <Text style={styles.iconLabel}>Flash</Text>
        </TouchableOpacity>
      </View>

      {/* Zoom Slider placed above the DurationSelector */}
      {/* <View style={styles.zoomSliderWrapper}>
        <ZoomSlider
          zoom={zoom}
          onZoomChange={setZoom}
          maxZoom={device.maxZoom || 10}
        />
      </View> */}

      <View style={styles.durationWrapper}>
        <DurationSelector
          options={['3m', '60s', '15s']}
          onSelect={setSelectedDuration}
        />
      </View>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.recordButton}
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
          <View style={styles.innerRecordButton}>
            <Text style={styles.recordButtonText}>
              {isRecording ? 'Stop' : 'Rec'}
            </Text>
          </View>
        </TouchableOpacity>
        <View style={styles.extraOptions}>
          <Text style={styles.extraOption}>Effects</Text>
          <Text style={styles.extraOption}>Upload</Text>
        </View>
      </View>
    </View>
  );
};

export default AddPost;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionText: {
    color: '#fff',
    fontSize: 18,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addSoundBtn: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  addSoundText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  rightSidebar: {
    position: 'absolute',
    top: 100,
    right: 10,
    alignItems: 'center',
  },
  iconButton: {
    marginBottom: 25,
    alignItems: 'center',
  },
  iconLabel: {
    color: '#fff',
    fontSize: 11,
    marginTop: 4,
  },
  zoomSliderWrapper: {
    position: 'absolute',
    bottom: 200,
    width: '100%',
  },
  durationWrapper: {
    position: 'absolute',
    bottom: 150,
    width: SCREEN_WIDTH,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  innerRecordButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  extraOptions: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
  },
  extraOption: {
    color: '#fff',
    fontSize: 14,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
});
