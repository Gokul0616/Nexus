import NetInfo from '@react-native-community/netinfo';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {BackHandler, Pressable, ScrollView, Text, View} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import CustomHeader from '../../Components/CustomHeader';
import {
  dummySearchResults as initialDummySearchResults,
  sampleNotes,
} from '../../Components/DummyData';
import DynamicImage from '../../Components/DynamicImage';
import NexusInput from '../../Components/NexusInput';
import Notes from '../../Components/Notes';
import {MessagesOutsideStyles as styles} from '../../Components/Styles/Styles';

const MessagesOutside = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [searchVal, setSearchVal] = useState('');
  const [searchActive, setSearchActive] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [mediaKey, setMediaKey] = useState(0);

  const [searchResults, setSearchResults] = useState(initialDummySearchResults);

  useEffect(() => {
    navigation.setParams({swipeEnabled: !searchActive});
  }, [searchActive, navigation]);

  const naviBack = () => {
    navigation.navigate('BottomTabs');
  };

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (!searchActive) {
          naviBack();
        } else {
          setSearchActive(false);
          setSearchVal('');
        }
        return true;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );
      return () => subscription.remove();
    }, [navigation, searchActive]),
  );
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      setMediaKey(prev => prev + 1);
    });
    return () => unsubscribe();
  }, []);
  const handleNotePress = note => {
    console.log('Note pressed:', note);
  };

  const filteredResults = searchResults.filter(item =>
    item.name.toLowerCase().includes(searchVal.toLowerCase()),
  );

  const displayResults =
    searchVal.trim() === ''
      ? searchResults.filter(item => item.recent)
      : filteredResults;

  const handleRemoveRecent = id => {
    setSearchResults(prevResults =>
      prevResults.map(item =>
        item.id === id ? {...item, recent: false} : item,
      ),
    );
  };
  return (
    <View style={styles.container}>
      {searchActive ? (
        <View>
          <CustomHeader
            navigation={navigation}
            leftIconFunction={() => {
              setSearchActive(false);
              setSearchVal('');
            }}
            headerTitle="Search"
          />
          <NexusInput
            value={searchVal}
            onChangeText={setSearchVal}
            style={{width: '90%', alignSelf: 'center'}}
            autoFocus={true}
            placeholder="Search"
          />
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{gap: 5, padding: 10}}>
            {displayResults.length > 0 ? (
              displayResults.map((item, index) => (
                <Pressable
                  style={styles.searchResultsContainer}
                  key={`${index}-${item.name}`}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 20,
                    }}>
                    <DynamicImage
                      style={styles.searchResultProfileImage}
                      accessibilityLabel={item.name}
                      uri={item.profileUrl}
                      isConnected={isConnected}
                    />
                    <Text style={styles.searchResultNames}>{item.name}</Text>
                  </View>
                  {item.recent && searchVal.trim() === '' && (
                    <Pressable
                      onPress={() => handleRemoveRecent(item.id)}
                      style={{
                        height: 20,
                        width: 20,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Feather name="x" size={15} color={'#ccc'} />
                    </Pressable>
                  )}
                </Pressable>
              ))
            ) : (
              <View style={{alignItems: 'center', marginTop: 20}}>
                <Text style={{fontSize: 16, color: '#666'}}>
                  {searchVal.trim() === ''
                    ? 'Search for people'
                    : 'No results found'}
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      ) : (
        <>
          <CustomHeader
            navigation={navigation}
            leftIconFunction={() => naviBack()}
            headerTitle="Direct Messages"
          />
          <Pressable
            style={styles.searchMessagesContainer}
            onPress={() => setSearchActive(true)}>
            <View style={styles.searchInputView}>
              <Text style={styles.searchText}>Search</Text>
            </View>
          </Pressable>
          <View>
            <Notes notes={sampleNotes} onNotePress={handleNotePress} />
          </View>
          <View>
            <Text>Hello</Text>
          </View>
        </>
      )}
    </View>
  );
};

export default MessagesOutside;
