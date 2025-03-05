import React, {memo, useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Animated,
  Image,
  Easing,
} from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import CustomLoadingIndicator from './CustomLoadingIndicator';
import DynamicImage from './DynamicImage';
import {ClipItemStyles as styles} from './Styles/Styles';
import {TouchableRipple} from 'react-native-paper';

const ClipItem = memo(
  ({
    item,
    isPlaying,
    isMuted,
    onVideoPress,
    handleLoadStart,
    handleLoad,
    loadingStates,
    commentVisible,
    setCommentVisible,
    width,
    height,
    setIsMuted,
    videoRefs,
    handleDoubleTap,
    likeAnimations,
    isConnected,
    onLongPressAction,
  }) => {
    const [pausedLocally, setPausedLocally] = useState(false);
    const [overlayVisible, setOverlayVisible] = useState(true);
    const spinValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 4000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ).start();
    }, [pausedLocally]);

    const spin = spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    const handleLongPress = () => {
      setPausedLocally(true);
      setOverlayVisible(false);
      if (onLongPressAction) {
        onLongPressAction(item.id);
      }
    };

    const handlePressOut = () => {
      setPausedLocally(false);
      setOverlayVisible(true);
    };

    const handlePress = () => {
      handleDoubleTap(item.id);
      onVideoPress(item.id);
    };

    return (
      <View style={[styles.container, {width, height}]}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={handlePress}
          onLongPress={handleLongPress}
          onPressOut={handlePressOut}
          delayLongPress={300}>
          <Video
            key={`video-${item.id}-${isConnected}`}
            ref={ref => videoRefs.current.set(item.id, ref)}
            source={{uri: item.videoSource}}
            style={StyleSheet.absoluteFill}
            resizeMode="contain"
            paused={!isPlaying || pausedLocally}
            repeat
            muted={isMuted}
            onLoadStart={() => handleLoadStart(item.id)}
            onLoad={() => handleLoad(item.id)}
            ignoreSilentSwitch="obey"
          />
        </Pressable>

        {loadingStates[item.id] && (
          <View style={styles.loadingContainer}>
            <CustomLoadingIndicator />
          </View>
        )}

        {likeAnimations.current[item.id] && (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.likeAnimation,
              {
                opacity: likeAnimations.current[item.id],
                transform: [
                  {
                    scale: likeAnimations.current[item.id].interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.5, 1.2],
                    }),
                  },
                ],
              },
            ]}>
            <Icon name="heart" size={100} color="#ed4956" />
          </Animated.View>
        )}

        {overlayVisible && (
          <View style={styles.volumeButtonContainer}>
            <Pressable onPress={() => setIsMuted(!isMuted)}>
              <View style={styles.volumeButton}>
                <Icon
                  name={isMuted ? 'volume-mute' : 'volume-high'}
                  size={24}
                  color="#fff"
                />
              </View>
            </Pressable>
          </View>
        )}

        {overlayVisible && (
          <View style={styles.bottomContainer}>
            <View style={styles.bottomLeft}>
              <Text style={styles.username}>{item.username}</Text>
              <Text style={styles.caption}>{item.caption}</Text>
              <View style={styles.musicRow}>
                <Icon name="musical-notes" size={16} color="#fff" />
                <Text style={styles.musicTitle}>{item.musicTitle}</Text>
              </View>
            </View>
            <View style={styles.bottomRight}>
              <TouchableRipple
                rippleColor={'rgb(0,0,0,0.5)'}
                borderless={true}
                style={styles.profileContainer}>
                <>
                  <DynamicImage
                    uri={item.profilePic}
                    isConnected={isConnected}
                    style={styles.profileImage}
                  />
                  <View style={styles.followIcon}>
                    <Entypo name="plus" size={13} color="#fff" />
                  </View>
                </>
              </TouchableRipple>
              <TouchableRipple
                rippleColor={'rgb(0,0,0,0.5)'}
                borderless={true}
                style={styles.iconWrapper}>
                <>
                  <Icon name="heart" size={32} color="#fff" />
                  <Text style={styles.iconText}>{item.likes}</Text>
                </>
              </TouchableRipple>
              <TouchableRipple
                rippleColor={'rgb(0,0,0,0.5)'}
                borderless={true}
                onPress={() => setCommentVisible(true)}
                style={styles.iconWrapper}>
                <>
                  <Icon name="chatbubble" size={32} color="#fff" />
                  <Text style={styles.iconText}>{item.comments}</Text>
                </>
              </TouchableRipple>
              <TouchableRipple
                rippleColor={'rgb(0,0,0,0.5)'}
                borderless={true}
                style={styles.iconWrapper}>
                <>
                  <Icon name="share-social" size={32} color="#fff" />
                  <Text style={styles.iconText}>{item.shares}</Text>
                </>
              </TouchableRipple>
              <Animated.View
                style={[styles.musicDisk, {transform: [{rotate: spin}]}]}>
                <DynamicImage
                  uri={item.profilePic}
                  isConnected={isConnected}
                  style={styles.diskImage}
                />
                <View style={styles.overlayLayer} />
                <View style={styles.musicIconOverlay}>
                  <Icon name="musical-notes" size={18} color="#fff" />
                </View>
              </Animated.View>
            </View>
          </View>
        )}
      </View>
    );
  },
);

export default ClipItem;
