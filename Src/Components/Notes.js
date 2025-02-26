import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import DynamicImage from './DynamicImage';
import NetInfo from '@react-native-community/netinfo';

/**
 * notes: Array of note objects
 *   [
 *     {
 *       id: '1',
 *       name: 'Your note',
 *       avatar: 'https://your-avatar-url.com',
 *       note: 'Hey there!',
 *     },
 *     {
 *       id: '2',
 *       name: 'Kate Shaw',
 *       avatar: 'https://some-other-avatar-url.com',
 *       note: '😀 🍔',
 *     },
 *     // ...
 *   ]
 *
 * onNotePress: Callback when a note is pressed
 */
const Notes = ({notes, onNotePress}) => {
  const [isConnected, setIsConnected] = useState(true);
  const [mediaKey, setMediaKey] = useState(0);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      setMediaKey(prev => prev + 1);
    });
    return () => unsubscribe();
  }, []);
  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.noteContainer}
        onPress={() => onNotePress && onNotePress(item)}>
        <View style={styles.avatarContainer}>
          <DynamicImage
            uri={item.avatar}
            style={styles.avatar}
            isConnected={isConnected}
          />
          {/* Only render the note bubble if there's a note */}
          {item.note ? (
            <>
              <View style={styles.noteBubble}>
                <Text style={styles.noteText}>{item.note}</Text>
              </View>
              <View style={styles.cloudBubble1} />
              <View style={styles.cloudBubble2} />
            </>
          ) : null}
        </View>
        {/* Name or label below the avatar */}
        <Text style={styles.userName} numberOfLines={1}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={notes}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={item => item.id.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.listContainer}
    />
  );
};

export default Notes;

const styles = StyleSheet.create({
  listContainer: {
    alignItems: 'center',
    gap: 10,
    height: 150,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  noteContainer: {
    width: 70,
    alignItems: 'center',
    marginRight: 15,
  },
  avatarContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    // You can add a border to mimic Instagram’s style:
    // borderWidth: 2,
    // borderColor: '#ccc',
  },
  noteBubble: {
    position: 'absolute',
    bottom: 55,
    zIndex: 10,

    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    maxWidth: 80,
    minWidth: 80,
    minHeight: 30,
    maxHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',

    // iOS shadow
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1,

    // Android elevation
    // elevation: 5,
  },

  noteText: {
    fontSize: 12,
    color: '#000',
    textAlign: 'center',
  },
  userName: {
    marginTop: 5,
    fontSize: 12,
    color: '#000',
    maxWidth: 70,
    textAlign: 'center',
  },
  cloudBubble1: {
    height: 20,
    width: 20,
    backgroundColor: '#fff',
    position: 'absolute',
    borderRadius: 10,
    zIndex: 9,
    bottom: 50,
    left: 0,
  },
  cloudBubble2: {
    height: 6,
    width: 6,
    backgroundColor: '#fff',
    position: 'absolute',
    borderRadius: 3,
    zIndex: 9,
    bottom: 45,
    left: 15,
  },
});
