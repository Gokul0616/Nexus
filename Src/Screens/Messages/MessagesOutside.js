import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  BackHandler,
  Image,
  Keyboard,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import CustomHeader from '../../Components/CustomHeader';
import {MessagesOutsideStyles as styles} from '../../Components/Styles/Styles';
import NexusInput from '../../Components/NexusInput';
import Notes from '../../Components/Notes';
import {dummySearchResults, sampleNotes} from '../../Components/DummyData';

const MessagesOutside = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [searchVal, setSearchVal] = useState('');
  const [searchActive, setSearchActive] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        if (inputRef.current) {
          inputRef.current.blur();
        }
      },
    );
    return () => keyboardDidHideListener.remove();
  }, []);

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

  const handleNotePress = note => {
    console.log('Note pressed:', note);
  };

  return (
    <View style={styles.container}>
      {searchActive ? (
        <View>
          <CustomHeader
            navigation={navigation}
            leftIconFunction={() => setSearchActive(false)}
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
            {dummySearchResults.map((item, index) => (
              <View
                style={styles.searchResultsContainer}
                key={`${index}-${item.name}`}>
                <Image
                  style={styles.searchResultProfileImage}
                  accessibilityLabel={item.name}
                  source={{uri: item.profileUrl}}
                />
                <Text style={styles.searchResultNames}>{item.name}</Text>
              </View>
            ))}
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
            onPress={() => {
              setSearchActive(true);
            }}>
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
