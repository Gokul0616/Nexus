import NetInfo from '@react-native-community/netinfo';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  BackHandler,
  FlatList,
  Modal,
  Pressable,
  Text,
  View,
} from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';
import CustomHeader from '../../Components/CustomHeader';
import {
  dummySearchResults as initialDummySearchResults,
  messageDummyData,
  sampleNotes,
} from '../../Components/DummyData';
import DynamicImage from '../../Components/DynamicImage';
import NexusInput from '../../Components/NexusInput';
import Notes from '../../Components/Notes';
import { MessagesOutsideStyles as styles } from '../../Components/Styles/Styles';
import { useChatInput } from '../../Services/Hooks/useChatInput';
import CustomBottomSheet from '../../Components/CustomBottomSheet';

const MessagesOutside = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [searchVal, setSearchVal] = useState('');
  const [searchActive, setSearchActive] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [mediaKey, setMediaKey] = useState(0);
  const [noteVisible, setNoteVisible] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [searchResults, setSearchResults] = useState(initialDummySearchResults);
  useEffect(() => {
    navigation.setParams({ swipeEnabled: !searchActive });
  }, [searchActive, navigation]);

  const naviBack = () => {
    navigation.goBack();
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
    setSelectedNote(note);
    setNoteVisible(true);
  };
  const { clearInputValue } = useChatInput();

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
        item.id === id ? { ...item, recent: false } : item,
      ),
    );
  };
  const renderMessage = item => {
    return (
      <TouchableRipple
        borderless={true}
        style={styles.messageContactsContainer}
        onPress={() => {
          clearInputValue();
          navigation.navigate('ChatScreen', { receiverDetails: item });
        }}
        rippleColor="rgba(0, 0, 0, .15)">
        <>
          <DynamicImage
            style={styles.messageContactsAvatar}
            accessibilityLabel={item.name}
            uri={item.avatar}
            isConnected={isConnected}
          />
          <View style={styles.messageContactsContentContainer}>
            <Text style={styles.messageContactsName}>{item.name}</Text>
            <View style={styles.messageContactsLastMessageContainer}>
              <Text style={styles.messageContactsLastMessage}>
                {item.lastMessage.slice(0, 30)}
                {item.lastMessage.length > 30 ? '...' : ''}
              </Text>
              <Text style={styles.messageContactsLastMessageTimePeriod}>
                {item.lastMessageTimePeriod}
              </Text>
            </View>
          </View>
        </>
      </TouchableRipple>
    );
  };
  const renderMessageContacts = item => {
    return (
      <FlatList
        data={item}
        keyExtractor={item => item.id}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        showsVerticalScrollIndicator={false}
        windowSize={5}
        updateCellsBatchingPeriod={50}
        contentContainerStyle={{ paddingBottom: 60 }}
        removeClippedSubviews={true}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={() => {
          return (
            <>
              <Pressable
                style={styles.searchMessagesContainer}
                onPress={() => setSearchActive(true)}>
                <View style={styles.searchInputView}>
                  <Text style={styles.searchText}>Search</Text>
                </View>
              </Pressable>
              <Notes notes={sampleNotes} onNotePress={handleNotePress} />
            </>
          );
        }}
        renderItem={({ item }) => {
          return renderMessage(item);
        }}
      />
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
            style={{ width: '90%', alignSelf: 'center' }}
            autoFocus={true}
            placeholder="Search"
          />
          <FlatList
            data={displayResults}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 10 }}
            keyExtractor={(item, index) => `${index}-${item.name}`}
            renderItem={({ item, index }) => (
              <Pressable style={styles.searchResultsContainer}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
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
                    <Feather name="x" size={15} color="#ccc" />
                  </Pressable>
                )}
              </Pressable>
            )}
            ListEmptyComponent={() => (
              <View style={{ alignItems: 'center', marginTop: 20 }}>
                <Text style={{ fontSize: 16, color: '#666' }}>
                  {searchVal.trim() === ''
                    ? 'Search for people'
                    : 'No results found'}
                </Text>
              </View>
            )}
          />
        </View>
      ) : (
        <>
          <CustomHeader
            navigation={navigation}
            leftIconFunction={() => naviBack()}
            headerTitle="Chats"
          />

          <View>{renderMessageContacts(messageDummyData)}</View>
        </>
      )}
      <CustomBottomSheet
        modalVisible={noteVisible}
        setModalVisible={setNoteVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.noteTitle}>{selectedNote?.title}</Text>
            <Text style={styles.noteContent}>{selectedNote?.content}</Text>
            <Pressable
              onPress={() => setNoteVisible(false)}
              style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </CustomBottomSheet>
    </View>
  );
};

export default MessagesOutside;
