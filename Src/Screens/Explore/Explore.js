import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useCallback, useRef, useState} from 'react';
import {
  Animated,
  BackHandler,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {TouchableRipple} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {formatNumber} from '../../Components/CommonData';
import CustomHeader from '../../Components/CustomHeader';
import CustomLoadingIndicator from '../../Components/CustomLoadingIndicator';
import {exploreCategoriesData, exploreData} from '../../Components/DummyData';
import NexusInput from '../../Components/NexusInput';
import {MainExploreScreenStyle as styles} from '../../Components/Styles/Styles';
import UsersSearchResults from '../../Components/UsersSearchResults';
import VideosSearchResults from '../../Components/VideosSearchResults';
const {width} = Dimensions.get('window');
const CARD_WIDTH = width * 0.5;
const CARD_HEIGHT = 300;

export const VideoCard = ({item, handleProfileNavigate}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <TouchableRipple
      borderless={true}
      rippleColor={'rgba(0, 0, 0, 0.5)'}
      style={styles.videoCard}
      onPress={() => {
        console.log(item);
      }}>
      <>
        <TouchableWithoutFeedback
          onPress={() => {
            handleProfileNavigate(item);
          }}>
          <Image
            source={{uri: item.profilePic}}
            style={[styles.profilePic, {zIndex: 2}]}
          />
        </TouchableWithoutFeedback>
        <View style={styles.thumbnailContainer}>
          <View
            style={[
              StyleSheet.absoluteFill,
              {backgroundColor: 'rgba(0, 0, 0, 0.1)', zIndex: 1},
            ]}
          />
          <Image
            onLoadStart={() => {
              setLoading(true);
              setError(false);
            }}
            onLoadEnd={() => setLoading(false)}
            onError={() => {
              setError(true);
              setLoading(false);
            }}
            source={{uri: item.videoThumbnail || item.thumbnail}}
            style={styles.videoThumbnail}
            resizeMode="cover"
          />
          {loading && (
            <View style={styles.loadingContainer}>
              <CustomLoadingIndicator />
            </View>
          )}
          {error && (
            <View style={styles.errorContainer}>
              <Ionicons name="image-outline" size={30} color="#bbb" />
              <Text style={styles.errorText}>Failed to load image</Text>
            </View>
          )}
        </View>
        <View style={styles.videoInfo}>
          <TouchableWithoutFeedback
            onPress={() => {
              handleProfileNavigate(item);
            }}>
            <Text style={styles.username}>{item.username}</Text>
          </TouchableWithoutFeedback>
          <Text numberOfLines={2} style={styles.caption}>
            {item.caption}
          </Text>
          <View style={styles.metrics}>
            <Text style={styles.metric}>{formatNumber(item.likes)} Likes</Text>
            <Text style={styles.metric}>
              {formatNumber(item.comments)} Comments
            </Text>
          </View>
        </View>
      </>
    </TouchableRipple>
  );
};
const Explore = () => {
  const [searchVal, setSearchVal] = useState('');
  const [isSearch, setIsSearch] = useState(false);
  const navigation = useNavigation();
  const translateY = useRef(new Animated.Value(0)).current;
  const [showButton, setShowButton] = useState(true);

  // Group exploreData by category using exploreCategoriesData objects
  const categorizedData = exploreCategoriesData.reduce((acc, catObj) => {
    acc[catObj.category] = exploreData.filter(item =>
      item.category.includes(catObj.category),
    );
    return acc;
  }, {});

  const naviBack = () => {
    navigation.goBack();
  };

  // useFocusEffect(
  //   useCallback(() => {
  //     const onBackPress = () => {
  //       if (!isSearch) {
  //         naviBack();
  //       } else {
  //         setIsSearch(false);
  //         setSearchVal('');
  //       }
  //       return true;
  //     };

  //     const subscription = BackHandler.addEventListener(
  //       'hardwareBackPress',
  //       onBackPress,
  //     );
  //     return () => subscription.remove();
  //   }, [navigation, isSearch]),
  // );

  const lastOffsetY = useRef(0);
  const isSearchHidden = useRef(false);
  const downThreshold = 50;

  const handleScroll = event => {
    const currentY = event.nativeEvent.contentOffset.y;
    if (
      !isSearchHidden.current &&
      currentY - lastOffsetY.current > downThreshold
    ) {
      Animated.timing(translateY, {
        toValue: -80,
        duration: 300,
        useNativeDriver: true,
      }).start();
      isSearchHidden.current = true;
    } else if (isSearchHidden.current && currentY < lastOffsetY.current) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
      isSearchHidden.current = false;
    }
    lastOffsetY.current = currentY;
  };

  const handleProfileNavigate = item => {
    console.log(item);
  };

  const renderCategorySection = ({item: categoryObj}) => (
    <View style={styles.categorySection}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons
            name={categoryObj.icon}
            size={24}
            color="#000"
            style={styles.categoryIcon}
          />
          <Text style={styles.categoryTitle}>{categoryObj.title}</Text>
        </View>
        <TouchableOpacity
          style={styles.viewAllContainer}
          onPress={() => {
            navigation.navigate('Catagory', {category: categoryObj});
          }}>
          <Text style={styles.viewAll}>View All</Text>
          <Ionicons name="chevron-forward" size={16} color="#666" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={categorizedData[categoryObj.category]}
        renderItem={({item}) => (
          <VideoCard
            item={item}
            handleProfileNavigate={handleProfileNavigate}
          />
        )}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carousel}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.searchContainer,
          {transform: [{translateY: translateY}]},
        ]}>
        <Pressable
          style={styles.searchMessagesContainer}
          onPress={() => navigation.navigate('SearchScreen')}>
          <View style={styles.searchInputView}>
            <Text style={styles.searchText}>Search</Text>
          </View>
        </Pressable>
      </Animated.View>
      <FlatList
        data={exploreCategoriesData}
        renderItem={renderCategorySection}
        keyExtractor={item => item.category}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        maxToRenderPerBatch={5}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />
    </View>
  );
};

export default Explore;
