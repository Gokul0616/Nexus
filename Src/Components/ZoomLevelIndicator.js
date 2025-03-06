import React, {useRef, useEffect} from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  View,
  ScrollView,
  PanResponder,
} from 'react-native';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const SLIDER_VISIBLE_WIDTH = SCREEN_WIDTH - 100; // Visible slider width
const TRACK_WIDTH = 400; // Must be larger than SLIDER_VISIBLE_WIDTH
const THUMB_SIZE = 20;

const ZoomSlider = ({zoom, onZoomChange, maxZoom}) => {
  const scrollX = useRef(new Animated.Value(zoom * TRACK_WIDTH)).current;
  const scrollViewRef = useRef(null);

  useEffect(() => {
    // Sync scrollX with external zoom prop changes
    Animated.timing(scrollX, {
      toValue: zoom * TRACK_WIDTH,
      duration: 0,
      useNativeDriver: false,
    }).start();
  }, [zoom, scrollX, TRACK_WIDTH]);

  const handleScroll = Animated.event(
    [{nativeEvent: {contentOffset: {x: scrollX}}}],
    {
      useNativeDriver: false,
      listener: event => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const newZoom = Math.min(Math.max(offsetX / TRACK_WIDTH, 0), 1);
        onZoomChange(newZoom);
      },
    },
  );

  // PanResponder for direct thumb dragging
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (e, {dx}) => {
        const newScrollX = scrollX._value + dx;
        const clampedX = Math.max(
          0,
          Math.min(newScrollX, TRACK_WIDTH - THUMB_SIZE),
        );
        scrollX.setValue(clampedX);
        const newZoom = clampedX / TRACK_WIDTH;
        onZoomChange(newZoom);
      },
    }),
  ).current;

  const displayedZoom = (zoom * (maxZoom - 1) + 1).toFixed(1);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={handleScroll}
        contentContainerStyle={[
          styles.contentContainer,
          {width: TRACK_WIDTH}, // Explicit content width
        ]}>
        <View style={styles.track} />
      </ScrollView>
      <Animated.View
        style={[
          styles.thumb,
          {
            transform: [
              {
                translateX: scrollX.interpolate({
                  inputRange: [0, TRACK_WIDTH],
                  outputRange: [0, TRACK_WIDTH - THUMB_SIZE],
                  extrapolate: 'clamp',
                }),
              },
            ],
          },
        ]}
        {...panResponder.panHandlers}
      />
      <Text style={styles.zoomText}>{displayedZoom}×</Text>
    </View>
  );
};

export default ZoomSlider;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginVertical: 10,
    alignItems: 'center',
    width: SLIDER_VISIBLE_WIDTH,
    position: 'relative', // Ensure thumb stays on top
  },
  contentContainer: {
    flexGrow: 0, // Prevent layout issues
  },
  track: {
    backgroundColor: '#555',
    height: 4,
    borderRadius: 2,
    width: TRACK_WIDTH,
  },
  thumb: {
    position: 'absolute',
    top: -THUMB_SIZE / 2 + 2, // Vertically center on track
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: '#fff',
    zIndex: 1, // Ensure thumb is above the track
  },
  zoomText: {
    color: '#fff',
    marginTop: 8,
    fontSize: 16,
  },
});
