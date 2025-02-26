import React, {useState, useRef, useEffect} from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Dimensions,
} from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/Ionicons';

const {width: screenWidth} = Dimensions.get('window');

const CustomVideoPlayer = ({
  source,
  style,
  isVisible,
  isConnected,
  item,
  setLoadingPosts,
  resizeMode = 'contain',
  ...props
}) => {
  const [paused, setPaused] = useState(true);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isEnded, setIsEnded] = useState(false);
  const [videoHeight, setVideoHeight] = useState(screenWidth);
  const controlsOpacity = useRef(new Animated.Value(1)).current;
  const videoRef = useRef(null);

  useEffect(() => {
    let timeout;
    if (!paused && !errorMsg && !isEnded && isConnected) {
      timeout = setTimeout(() => {
        Animated.timing(controlsOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.linear,
        }).start(() => setControlsVisible(false));
      }, 3000);
    }
    return () => clearTimeout(timeout);
  }, [paused, controlsOpacity, errorMsg, isEnded, isConnected]);

  const togglePlayPause = () => {
    setControlsVisible(true);
    Animated.timing(controlsOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start();
    if (isEnded) {
      if (videoRef.current) {
        videoRef.current.seek(0);
      }
      setIsEnded(false);
      setPaused(false);
    } else {
      setPaused(!paused);
    }
  };

  const onVideoError = error => {
    const err =
      typeof error.error === 'object'
        ? JSON.stringify(error.error)
        : error.error || 'Error loading video';
    setErrorMsg(err);
  };

  const onVideoEnd = () => {
    setPaused(true);
    setIsEnded(true);
    setControlsVisible(true);
    Animated.timing(controlsOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start();
  };

  const onVideoLoad = data => {
    setLoadingPosts(prev => ({...prev, [item.id]: false}));
    if (data?.naturalSize?.width && data?.naturalSize?.height) {
      const computedHeight =
        (screenWidth * data.naturalSize.height) / data.naturalSize.width;
      setVideoHeight(computedHeight);
    }
  };

  useEffect(() => {
    if (!isConnected) {
      setErrorMsg('No Internet Connection');
    } else {
      setErrorMsg(null);
    }
    if (isVisible) {
      setControlsVisible(true);
      Animated.timing(controlsOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.linear,
      }).start();
    }
    setPaused(!isVisible);
  }, [isVisible, isConnected, controlsOpacity]);

  return (
    <View style={[style, styles.container, {height: videoHeight}]}>
      <Video
        ref={videoRef}
        source={source}
        style={[StyleSheet.absoluteFill, {pointerEvents: 'none'}]}
        resizeMode={resizeMode}
        paused={!isVisible || paused}
        onError={onVideoError}
        onEnd={onVideoEnd}
        onLoad={onVideoLoad}
        onLoadStart={() =>
          setLoadingPosts(prev => ({...prev, [item.id]: true}))
        }
        {...props}
      />
      {errorMsg && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      )}
      {(controlsVisible || isVisible) && !errorMsg && (
        <Animated.View style={[styles.overlay, {opacity: controlsOpacity}]}>
          <TouchableOpacity onPress={togglePlayPause}>
            {isEnded ? (
              <Icon name="reload-circle-outline" size={60} color="#fff" />
            ) : (
              <Icon
                name={paused ? 'play-circle-outline' : 'pause-circle-outline'}
                size={60}
                color="#fff"
              />
            )}
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'auto',
  },
  errorContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#f00',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default CustomVideoPlayer;
