import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  PanResponder,
  Animated,
  Dimensions,
} from 'react-native';
import {createThumbnail} from 'react-native-create-thumbnail';

const SelectThumbnail = ({route, navigation}) => {
  const {videoUri} = route.params;
  const [thumbnails, setThumbnails] = useState([]);
  const [selectedThumbnail, setSelectedThumbnail] = useState(null);
  const sliderX = useRef(new Animated.Value(0)).current;
  const screenWidth = Dimensions.get('window').width;
  const sliderWidth = screenWidth - 40;

  useEffect(() => {
    const generateThumbnails = async () => {
      const frames = [0, 5000, 10000, 15000, 20000];
      const results = [];
      for (const time of frames) {
        try {
          const response = await createThumbnail({
            url: `file://${videoUri}`,
            timeStamp: time,
          });
          results.push(response.path);
        } catch (error) {
          console.log('Thumbnail generation error:', error);
        }
      }
      setThumbnails(results);
      if (results.length > 0) {
        setSelectedThumbnail(results[0]);
      }
    };
    generateThumbnails();
  }, [videoUri]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        sliderX.setOffset(sliderX.__getValue());
      },
      onPanResponderMove: (evt, gestureState) => {
        let newX = gestureState.dx;
        let pos = newX + sliderX.__getValue();
        pos = Math.max(0, Math.min(pos, sliderWidth));
        sliderX.setValue(pos);

        const index = Math.round((pos / sliderWidth) * (thumbnails.length - 1));
        if (index >= 0 && index < thumbnails.length) {
          setSelectedThumbnail(thumbnails[index]);
        }
      },
      onPanResponderRelease: () => {
        sliderX.flattenOffset();
      },
    }),
  ).current;

  return (
    <View style={styles.container}>
      {/* Full-screen background with a blur effect */}
      {selectedThumbnail && (
        <ImageBackground
          source={{uri: selectedThumbnail}}
          style={styles.backgroundImage}
          blurRadius={15}>
          <View style={styles.overlay} />
        </ImageBackground>
      )}

      {/* Main content overlay */}
      <View style={styles.content}>
        <Text style={styles.header}>Select Thumbnail</Text>

        {/* Horizontal list of thumbnails */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.thumbnailContainer}>
          {thumbnails.map((thumb, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.8}
              onPress={() => {
                setSelectedThumbnail(thumb);
                Animated.timing(sliderX, {
                  toValue: (index / (thumbnails.length - 1)) * sliderWidth,
                  duration: 200,
                  useNativeDriver: false,
                }).start();
              }}>
              <Image
                source={{uri: thumb}}
                style={[
                  styles.thumbnail,
                  selectedThumbnail === thumb && styles.thumbnailActive,
                ]}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Draggable slider */}
        <View style={styles.sliderWrapper}>
          <View style={[styles.sliderTrack, {width: sliderWidth}]} />
          <Animated.View
            style={[styles.sliderHandle, {transform: [{translateX: sliderX}]}]}
            {...panResponder.panHandlers}
          />
        </View>

        {/* Preview area */}
        <View style={styles.preview}>
          <Text style={styles.previewText}>Chosen Thumbnail</Text>
          {selectedThumbnail && (
            <Image
              source={{uri: selectedThumbnail}}
              style={styles.previewImage}
              resizeMode="cover"
            />
          )}
        </View>

        {/* Confirm Button */}
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.confirmButtonText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SelectThumbnail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },

  content: {
    flex: 1,
    paddingTop: 50,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 30,
  },
  thumbnailContainer: {
    paddingVertical: 10,
  },
  thumbnail: {
    width: 70,
    height: 70,
    marginHorizontal: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  thumbnailActive: {
    borderColor: '#FFD700',
  },
  sliderWrapper: {
    marginTop: 30,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderTrack: {
    height: 4,
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  sliderHandle: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
  },
  preview: {
    marginTop: 30,
    alignItems: 'center',
  },
  previewText: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 10,
  },
  previewImage: {
    width: 220,
    height: 220,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#fff',
  },
  confirmButton: {
    marginTop: 30,
    backgroundColor: '#FFD700',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  confirmButtonText: {
    fontSize: 20,
    color: '#000',
    fontWeight: 'bold',
  },
});
