import React, {useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  useWindowDimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation, useRoute} from '@react-navigation/native';
import {exploreData} from '../../Components/DummyData';
import {VideoCard} from '../../Components/VideoCard';

const SingleExplore = () => {
  const {width} = useWindowDimensions();
  const margin = 8;

  let numColumns, CARD_WIDTH;
  if (width <= 360) {
    numColumns = 2;
    CARD_WIDTH = width * 0.45;
  } else {
    numColumns = Math.floor(width / 200);
    CARD_WIDTH = width / numColumns;
  }

  const route = useRoute();
  const navigation = useNavigation();
  const {category: categoryObj} = route.params;

  const filteredData = exploreData.filter(item =>
    item.category.includes(categoryObj.category),
  );

  const [visibleItems, setVisibleItems] = React.useState([]);
  const timeoutRef = useRef(null);

  const onViewableItemsChanged = useRef(({viewableItems}) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      const sortedViewables = [...viewableItems].sort(
        (a, b) => (a.index || 0) - (b.index || 0),
      );
      const visibleIds = sortedViewables.map(viewable => viewable.item.id);

      const lastTwoVisibleIds =
        visibleIds.length <= 2 ? visibleIds : visibleIds.slice(-2);
      setVisibleItems(lastTwoVisibleIds);
    }, 1000);
  }).current;

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 20,
  }).current;

  const renderItem = ({item}) => (
    <View style={[styles.cardContainer, {maxWidth: CARD_WIDTH}]}>
      <VideoCard
        key={item.id + item.profilePic}
        item={item}
        CARD_WIDTH={CARD_WIDTH}
        isVisible={visibleItems.includes(item.id)}
        handleProfileNavigate={item => {
          console.log('Navigate to details for', item);
        }}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name={categoryObj.icon} size={20} />
        <Text style={styles.headerText}> {categoryObj.title} </Text>
      </View>
      <FlatList
        key={`flatlist-${numColumns}`}
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
        numColumns={numColumns}
        contentContainerStyle={styles.flatListContent}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        removeClippedSubviews={false}
      />
    </View>
  );
};

export default SingleExplore;

const styles = StyleSheet.create({
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
    marginLeft: 8,
  },
  flatListContent: {
    paddingBottom: 20,
  },
  cardContainer: {
    flex: 1,
    margin: 8,
  },
});
