import {StyleSheet, Dimensions} from 'react-native';

const {width: screenWidth} = Dimensions.get('window');

const HomeScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  navBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
  },
  logo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  icons: {
    flexDirection: 'row',
    gap: 20,
  },
  iconsContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotMessage: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ff0000',
  },
  dotNotification: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ff0000',
  },
  storiesContainer: {
    height: 120,
    backgroundColor: '#fff',
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
    marginTop: 55,
  },
  storiesContent: {
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  storyContainer: {
    alignItems: 'center',
    marginRight: 15,
  },
  storyAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#ff8501',
  },
  storyName: {
    marginTop: 5,
    fontSize: 12,
    textAlign: 'center',
    color: '#000',
    maxWidth: 70,
  },
  post: {
    marginBottom: 15,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  postUser: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  postAvatar: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
  },
  postUsername: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  postImage: {
    width: screenWidth,
  },
  mediaContainer: {
    position: 'relative',
    alignSelf: 'flex-start',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  adLabel: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  adLabelText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  actionIcons: {
    flexDirection: 'row',
    gap: 20,
  },
  postDetails: {
    paddingHorizontal: 15,
  },
  likes: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000',
  },
  caption: {
    fontSize: 14,
    marginBottom: 5,
    color: '#000',
  },
  bold: {
    fontWeight: 'bold',
  },
  comments: {
    fontSize: 14,
    color: '#8e8e93',
    marginBottom: 5,
  },
  timestamp: {
    fontSize: 12,
    color: '#8e8e93',
  },
  carouselIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  carouselIndicatorText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  likeAnimation: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{translateX: -50}, {translateY: -50}],
  },
});
const MessagesOutsideStyles = StyleSheet.create({
  container: {backgroundColor: '#fff', flex: 1},
  searchMessagesContainer: {
    justifyContent: 'center',
    alignContent: 'center',
    marginTop: 10,
  },
  searchInputView: {
    height: 40,
    paddingHorizontal: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    width: '90%',
    alignSelf: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  searchText: {
    fontSize: 16,
    color: '#8e8e93',
  },
  searchResultsContainer: {
    minHeight: 60,
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
    marginTop: 10,
  },
  searchResultProfileImage: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  searchResultNames: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    marginLeft: 10,
  },
  messageContactsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 15,
  },
  messageContactsAvatar: {
    height: 55,
    width: 55,
    borderRadius: 27.5,
  },
  messageContactsContentContainer: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  messageContactsName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  messageContactsLastMessageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  messageContactsLastMessage: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  messageContactsLastMessageTimePeriod: {
    fontSize: 12,
    color: '#999',
    marginLeft: 10,
  },
});
const ProfileScreenstyles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  header: {
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  avatar: {width: 100, height: 100, borderRadius: 50},
  name: {fontSize: 22, fontWeight: 'bold', marginTop: 10},
  username: {fontSize: 16, color: '#666'},
  bio: {
    marginTop: 10,
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  statsContainer: {flexDirection: 'row', marginTop: 15},
  stat: {alignItems: 'center', marginHorizontal: 15},
  statNumber: {fontSize: 18, fontWeight: 'bold'},
  statLabel: {fontSize: 14, color: '#666'},
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tabButton: {paddingVertical: 10},
  activeTab: {borderBottomWidth: 2, borderBottomColor: '#000'},
  tabText: {fontSize: 16, color: '#000'},
  contentSection: {padding: 10},
  sectionHeader: {fontSize: 18, fontWeight: 'bold', marginBottom: 10},
  grid: {justifyContent: 'space-between'},
  gridItem: {flex: 1, margin: 5, alignItems: 'center'},
  gridImage: {width: 110, height: 110, borderRadius: 8},
  gridCaption: {marginTop: 5, fontSize: 12, color: '#333', textAlign: 'center'},
  horizontalList: {paddingVertical: 10},
});
const ChatscreenStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    height: 55,

    backgroundColor: '#fff',
    borderBottomWidth: 0.5,
    paddingHorizontal: 10,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  messageContactsAvatar: {
    height: 45,
    width: 45,
    borderRadius: 22.5,
  },
  iconContainer: {
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    width: 35,
  },
  onlineStatus: {
    position: 'absolute',
    bottom: 4,
    right: 0,
    borderWidth: 2,
    borderColor: '#fff',
    height: 12,
    borderRadius: 6,
    width: 12,
    backgroundColor: '#40c040',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    paddingHorizontal: 10,
    gap: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  textInput: {
    flex: 1,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#0887ff',
    fontSize: 16,
    padding: 8,
    borderRadius: 20,
    color: '#000',
  },
  sendButtonContainer: {
    backgroundColor: '#0887ff',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginLeft: 10,
  },
  chatList: {
    padding: 10,
    // paddingBottom: 70,
    backgroundColor: '#f9f9f9',
  },
  chatBubble: {
    maxWidth: '70%',
    padding: 10,
    borderRadius: 16,
    marginVertical: 6,
  },
  senderBubble: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-end',
    borderTopRightRadius: 0,
  },
  receiverBubble: {
    backgroundColor: '#E5E5EA',
    alignSelf: 'flex-start',
    borderTopLeftRadius: 0,
  },
  chatText: {
    fontSize: 15,
  },
  timestamp: {textAlign: 'right', color: '#8e8e93', fontSize: 11},
  replyPreviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    padding: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#0887ff',
    marginHorizontal: 10,
    marginBottom: 4,
    justifyContent: 'space-between',
    borderRadius: 4,
  },
  replyLabel: {
    fontSize: 12,
    color: '#555',
    marginRight: 4,
  },
  replyText: {
    flex: 1,
    fontSize: 14,
    color: '#000',
  },
  replyCancelButton: {
    paddingHorizontal: 4,
  },
  replymessageContainer: {
    backgroundColor: '#f0f0f0',
    borderLeftWidth: 4,
    borderLeftColor: '#007aff', // Accent color (change as needed)
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginTop: 8,
    maxWidth: '60%',
  },
  replyMessageText: {
    fontSize: 12,
    color: '#333',
    fontStyle: 'italic',
  },
});

export {
  HomeScreenStyles,
  MessagesOutsideStyles,
  ProfileScreenstyles,
  ChatscreenStyles,
};
