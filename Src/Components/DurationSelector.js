import React, {useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const ITEM_WIDTH = 60;
const SPACER_WIDTH = (SCREEN_WIDTH - ITEM_WIDTH) / 2;

const DurationSelector = ({options, onSelect}) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleMomentumScrollEnd = event => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / ITEM_WIDTH);
    setSelectedIndex(index);
    onSelect(options[index]);
  };

  const handleItemPress = index => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({x: index * ITEM_WIDTH, animated: true});
      setSelectedIndex(index);
      onSelect(options[index]);
    }
  };

  return (
    <Animated.ScrollView
      ref={scrollViewRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      pagingEnabled
      snapToInterval={ITEM_WIDTH}
      decelerationRate="fast"
      contentContainerStyle={{
        paddingHorizontal: SPACER_WIDTH,
        height: 30,
      }}
      onMomentumScrollEnd={handleMomentumScrollEnd}
      onScroll={Animated.event([{nativeEvent: {contentOffset: {x: scrollX}}}], {
        useNativeDriver: true,
      })}
      scrollEventThrottle={16}>
      {options.map((option, index) => {
        const inputRange = [
          (index - 1) * ITEM_WIDTH,
          index * ITEM_WIDTH,
          (index + 1) * ITEM_WIDTH,
        ];
        const scale = scrollX.interpolate({
          inputRange,
          outputRange: [0.8, 1, 0.8],
          extrapolate: 'clamp',
        });
        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.5, 1, 0.5],
          extrapolate: 'clamp',
        });

        return (
          <TouchableOpacity key={option} onPress={() => handleItemPress(index)}>
            <Animated.View
              style={[styles.durationItem, {transform: [{scale}], opacity}]}>
              <View style={selectedIndex === index ? styles.highlighter : null}>
                <Text
                  style={[
                    styles.durationText,
                    selectedIndex === index && {fontWeight: 'bold'},
                  ]}>
                  {option}
                </Text>
              </View>
            </Animated.View>
          </TouchableOpacity>
        );
      })}
    </Animated.ScrollView>
  );
};

export default DurationSelector;

const styles = StyleSheet.create({
  durationItem: {
    width: ITEM_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationText: {
    color: '#fff',
    fontSize: 16,
  },
  highlighter: {
    paddingHorizontal: 10,
    backgroundColor: '#727575',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
});
