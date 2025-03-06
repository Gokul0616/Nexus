import React from 'react';
import {StyleSheet, Text, View, FlatList, Dimensions} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation, useRoute} from '@react-navigation/native';
import {exploreData} from '../../Components/DummyData';
import {VideoCard} from '../../Components/VideoCard';

const {width} = Dimensions.get('window');
const CARD_WIDTH = width * 0.45;

const SingleExplore = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {category: categoryObj} = route.params;

  const filteredData = exploreData.filter(item =>
    item.category.includes(categoryObj.category),
  );

  const [visibleItems, setVisibleItems] = React.useState([]);

  const onViewableItemsChanged = React.useRef(({viewableItems}) => {
    const visibleIds = viewableItems.map(viewable => viewable.item.id);
    setVisibleItems(visibleIds);
  }).current;

  const viewabilityConfig = React.useRef({
    viewAreaCoveragePercentThreshold: 20,
  }).current;
  const renderItem = ({item}) => (
    <View style={singleExploreStyles.cardContainer}>
      <VideoCard
        key={item.id + item.profilePic}
        item={item}
        CARD_WIDTH={CARD_WIDTH}
        isVisible={visibleItems.includes(item.id)}
        viewableItems={visibleItems}
        handleProfileNavigate={item => {
          console.log('Navigate to details for', item);
        }}
      />
    </View>
  );

  return (
    <View style={singleExploreStyles.container}>
      <View style={singleExploreStyles.header}>
        <Ionicons name={categoryObj.icon} size={20} />
        <Text style={singleExploreStyles.headerText}>
          {' '}
          {categoryObj.title}{' '}
        </Text>
      </View>
      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={singleExploreStyles.flatListContent}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig} // Lower threshold
        removeClippedSubviews={false} // Keep items mounted even if partially offscreen
      />
    </View>
  );
};

export default SingleExplore;

const singleExploreStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  flatListContent: {
    paddingBottom: 20,
  },
  cardContainer: {
    flex: 1,
    margin: 8,
    maxWidth: CARD_WIDTH,
  },
});
