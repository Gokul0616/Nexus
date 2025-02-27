import React, {useState, useRef, useEffect, useContext} from 'react';
import {ScrollView, Dimensions, View, StyleSheet} from 'react-native';
import AddStories from '../Screens/AddStories/AddStories';
import BottomStack from './BottomStack';
import {NavigationContext} from '../Services/Hooks/NavigationProvider';

const {width: screenWidth} = Dimensions.get('window');

const TopStack = ({route}) => {
  // Set default index to 1 (BottomStack screen)
  const [currentIndex, setCurrentIndex] = useState(1);
  const scrollRef = useRef(null);
  // Called when user finishes swiping manually
  const handleMomentumScrollEnd = event => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / screenWidth);
    setCurrentIndex(newIndex);
  };

  useEffect(() => {
    // If route.params?.index is provided, use it; otherwise, default to 1.
    const index = route.params?.index ?? 1;
    goToIndex(index);
  }, [route.params]);

  const goToIndex = index => {
    setCurrentIndex(index);
    if (scrollRef.current) {
      scrollRef.current.scrollTo({x: index * screenWidth, animated: true});
    }
  };

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      onMomentumScrollEnd={handleMomentumScrollEnd}
      style={styles.container}>
      <View style={[styles.screen, {width: screenWidth}]}>
        <AddStories setIndex={goToIndex} />
      </View>
      <View style={[styles.screen, {width: screenWidth}]}>
        <BottomStack activeIndex={route.params?.index ?? 1} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screen: {
    flex: 1,
  },
});

export default TopStack;
