import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Switch,
  ScrollView,
} from 'react-native';
import {createThumbnail} from 'react-native-create-thumbnail';
import {PrimaryColor} from './CommonData';
import Octicons from 'react-native-vector-icons/Octicons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import {TouchableRipple} from 'react-native-paper';
const UploadPost = ({route, navigation}) => {
  const {path: uri} = route.params || {};

  const [caption, setCaption] = useState('');
  const [everyoneCanView, setEveryoneCanView] = useState(true);
  const [allowDuet, setAllowDuet] = useState(true);
  const [allowStitch, setAllowStitch] = useState(true);
  const [allowComment, setAllowComment] = useState(true);
  const [saveToDevice, setSaveToDevice] = useState(false);

  const [thumbnail, setThumbnail] = useState(null);

  useEffect(() => {
    if (uri) {
      createThumbnail({
        url: `file://${uri}`,
        timeStamp: 1000,
      })
        .then(response => {
          console.log(response);
          setThumbnail(response.path);
        })
        .catch(err => {
          console.warn('Error generating thumbnail:', err);
        });
    }
  }, [uri]);

  const handlePost = () => {
    console.log('Posting with caption:', caption);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post</Text>
        <TouchableOpacity onPress={handlePost}>
          <Text style={styles.postText}>Post</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.captionRow}>
          <TextInput
            style={styles.captionInput}
            value={caption}
            onChangeText={setCaption}
            placeholder="Write a caption..."
            multiline
          />
          <View style={styles.thumbnailContainer}>
            {thumbnail ? (
              <Image
                source={{uri: thumbnail}}
                style={styles.thumbnail}
                resizeMethod="contain"
              />
            ) : (
              <View style={styles.thumbnailPlaceholder}>
                <Text style={styles.placeholderText}>
                  {uri ? 'Generating thumbnail...' : 'No preview'}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.quickToolsRow}>
          <TouchableOpacity style={styles.quickButton}>
            <Text style={styles.quickButtonText}># Hashtag</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickButton}>
            <Text style={styles.quickButtonText}>@ Mention</Text>
          </TouchableOpacity>
        </View>

        <TouchableRipple rippleColor={'rgb(0,0,0,0.5)'} style={styles.menuItem}>
          <>
            <View style={styles.menuRow}>
              <Octicons name="person" size={22} color="#333" />
              <Text style={styles.menuText}>Tag people</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={22} color="#333" />
          </>
        </TouchableRipple>
        <TouchableRipple rippleColor={'rgb(0,0,0,0.5)'} style={styles.menuItem}>
          <>
            <View style={styles.menuRow}>
              <Ionicons name="location-outline" size={22} color="#333" />

              <View style={[styles.menuRow, {gap: 2}]}>
                <Text style={styles.menuText}>Location</Text>
                <Ionicons
                  name="information-circle-outline"
                  size={15}
                  color="#333"
                />
              </View>
            </View>
            <Ionicons name="chevron-forward-outline" size={22} color="#333" />
          </>
        </TouchableRipple>
        <TouchableRipple rippleColor={'rgb(0,0,0,0.5)'} style={styles.menuItem}>
          <>
            <View style={styles.menuRow}>
              <FontAwesome6 name="plus" size={16} color="#333" />
              <Text style={styles.menuText}>Add link</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={22} color="#333" />
          </>
        </TouchableRipple>

        <TouchableRipple
          rippleColor={'rgb(0,0,0,0.5)'}
          style={[styles.menuItem, styles.visibilityRow]}>
          <>
            <Text style={styles.menuText}>Everyone can view this post</Text>
            <Ionicons name="chevron-forward-outline" size={22} color="#333" />
          </>
        </TouchableRipple>
        {/* 
        <View style={styles.menuItem}>
          <Text style={styles.menuText}>More options</Text>
        </View> */}

        {/* <View style={styles.toggleRow}>
          <View style={styles.toggleItem}>
            <Text style={styles.toggleLabel}>Duet</Text>
            <Switch value={allowDuet} onValueChange={setAllowDuet} />
          </View>
          <View style={styles.toggleItem}>
            <Text style={styles.toggleLabel}>Stitch</Text>
            <Switch value={allowStitch} onValueChange={setAllowStitch} />
          </View>
          <View style={styles.toggleItem}>
            <Text style={styles.toggleLabel}>Comments</Text>
            <Switch value={allowComment} onValueChange={setAllowComment} />
          </View>
          <View style={styles.toggleItem}>
            <Text style={styles.toggleLabel}>Save</Text>
            <Switch value={saveToDevice} onValueChange={setSaveToDevice} />
          </View>
        </View> */}
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.draftsButton}>
          <Text style={styles.draftsText}>Drafts</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.postButton} onPress={handlePost}>
          <Text style={styles.postButtonText}>Post</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UploadPost;

const styles = StyleSheet.create({
  /* Container holds everything */
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  /* Header at the top */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 48,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  cancelText: {
    fontSize: 16,
    color: '#999',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  postText: {
    fontSize: 16,
    color: PrimaryColor,
    fontWeight: '600',
  },

  /* Scrollable content below header */
  scrollContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: 80,
  },

  /* Row with caption + thumbnail */
  captionRow: {
    flexDirection: 'row',
    padding: 16,
  },
  captionInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginRight: 12,
    height: 100,
    textAlignVertical: 'top',
  },
  thumbnailContainer: {
    width: 64,
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f2f2f2',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  thumbnailPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 12,
    color: '#999',
  },

  /* Quick tools row (Hashtag, Mention) */
  quickToolsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  quickButton: {
    backgroundColor: '#f1f1f1',
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginRight: 8,
  },
  quickButtonText: {
    fontSize: 14,
    color: '#333',
  },

  /* Menu item rows: Tag people, Location, Add link, etc. */
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  menuText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  visibilityRow: {},
  visibilityValue: {
    fontSize: 14,
    color: '#666',
  },

  /* Row with multiple toggles */
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
  },
  toggleItem: {
    alignItems: 'center',
  },
  toggleLabel: {
    fontSize: 14,
    marginBottom: 4,
    color: '#333',
  },

  /* Bottom bar with Drafts + Post */
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    height: 56,
    width: '100%',
    borderTopWidth: 0.5,
    borderTopColor: '#ccc',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  draftsButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  draftsText: {
    fontSize: 16,
    color: '#999',
  },
  postButton: {
    backgroundColor: PrimaryColor,
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  postButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
