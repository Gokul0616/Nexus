import { StyleSheet, Dimensions } from 'react-native';
import { PrimaryColor, SecondaryColor } from '../CommonData';
const CARD_WIDTH = Dimensions.get('window').width * 0.5;
const CARD_HEIGHT = 300;
const { width: screenWidth } = Dimensions.get('window');
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

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
  },
  storiesContent: {
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  storyContainer: {
    alignItems: "center",
    marginHorizontal: 8,
  },
  storyAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
  }, plusIconContainer: {
    position: "absolute",
    bottom: 2.5,
    right: 5,
    borderWidth: 2, borderColor: "#fff",
    backgroundColor: "#fff", borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  plusIcon: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  storyName: {
    marginTop: 5,
    fontSize: 14,
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
    transform: [{ translateX: -50 }, { translateY: -50 }],
  },
});
const MessagesOutsideStyles = StyleSheet.create({
  container: { backgroundColor: '#fff', flex: 1 },
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
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  loadingIndicator: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    zIndex: 100,
    height: height,
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    resizeMode: 'cover',
  },
  streakBorder: {
    position: 'absolute',
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 2,
    borderColor: '#ff2478',
    borderStyle: 'dashed',
  },
  statsContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  statLabel: {
    color: 'gray',
    fontSize: 12,
  },
  streakCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ffeef4',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  streakPercentage: {
    fontWeight: 'bold',
    color: '#ff2478',
  },
  streakProgress: {
    position: 'absolute',
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 2,
    borderColor: '#ff2478',
    borderLeftColor: 'transparent',
  },
  infoContainer: {
    paddingHorizontal: 15,
    marginBottom: 7,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  username: {
    color: 'gray',
    marginBottom: 5,
  },
  bio: {
    marginBottom: 5,
  },
  website: {
    color: '#0095f6',
    marginBottom: 5,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    color: 'gray',
    marginLeft: 5,
  },
  tabsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: 'white',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#000',
  },
  gridItem: {
    width: width / 3,
    height: width / 3,
    borderWidth: 0.5,
    borderColor: 'white',
  },
  gridImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -12 }, { translateY: -12 }],
  },
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
  linkPreviewContainer: {
    flexDirection: 'column',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    marginTop: 8,
    maxWidth: '50%',
    maxHeight: 250,
    alignItems: 'flex-start',
  },
  previewImage: {
    minWidth: '100%',
    minHeight: '70%',
  },
  previewTextContainer: {
    flex: 1,
    paddingHorizontal: 8,
    backgroundColor: '#ggg',
    minWidth: '100%',
    paddingVertical: 5,
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  previewLink: {
    fontSize: 12,
    color: '#666',
    textDecorationLine: 'underline',
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
    backgroundColor: PrimaryColor,
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
    borderColor: '#007AFF',
    borderWidth: 2,
    alignSelf: 'flex-end',
    borderTopRightRadius: 0,
  },
  receiverBubble: {
    backgroundColor: '#E5E5EA',
    borderColor: '#E5E5EA',
    alignSelf: 'flex-start',
    borderWidth: 2,
    borderTopLeftRadius: 0,
  },
  chatText: {
    fontSize: 15,
  },
  timestamp: { textAlign: 'right', color: '#8e8e93', fontSize: 11 },
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
    borderLeftColor: '#007aff',
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

const ClipItemStyles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    position: 'relative',
    overflow: 'hidden',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  likeAnimation: {
    position: 'absolute',
    alignSelf: 'center',
    top: '40%',
    zIndex: 999,
  },
  progressBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 30,
    backgroundColor: 'transpar`ent',
    justifyContent: 'flex-end',
    zIndex: 9999,
  },
  progressBar: {
    height: 3,
    backgroundColor: '#fff',
  },
  volumeButtonContainer: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
  },
  volumeButton: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 8,
    borderRadius: 25,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingLeft: 10,
    paddingBottom: 20,
    justifyContent: 'space-between',
  },
  bottomLeft: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  username: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  caption: {
    color: '#fff',
    fontSize: 13,
    marginBottom: 8,
  },
  musicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#rgba(225,225,225,0.25)',
    padding: 3,
    borderRadius: 5,
    maxWidth: 250
  },
  musicTitle: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 4,
  },
  followButton: {
    marginLeft: 15,
    padding: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff004f',
    minWidth: 80,
  },
  followText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  bottomRight: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  profileContainer: {
    marginBottom: 20,
    alignItems: 'center',
    borderRadius: '50%', backgroundColor: '#ccc',
  },
  profileImage: {
    width: 45,
    height: 45,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#fff',
  },
  followIcon: {
    position: 'absolute',
    bottom: -6,
    right: '%0%',
    backgroundColor: '#ff004f',
    borderRadius: 10,
    padding: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    alignItems: 'center',
    marginBottom: 18,
  },
  iconText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 2,
  },
  musicDisk: {
    width: 45,
    height: 45,
    borderRadius: 24,
    borderWidth: 5,
    borderColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  diskImage: {
    width: 35,
    height: 35,
    borderRadius: 19,
  },
  overlayLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 24,
  },
  musicIconOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -9 }, { translateY: -9 }],
  },
});



const NotificationScreenStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  dotNotification: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: SecondaryColor,
    alignSelf: 'flex-end', position: 'absolute', bottom: 0, left: 0
  },
  notificationList: {
    paddingVertical: 10,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  notificationImage: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
  },
  notificationTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  notificationMessage: {
    fontSize: 15,
    color: '#000',
  },
  notificationTimestamp: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  rightIconContainer: {
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  followButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: SecondaryColor,
  },
  followButtonText: {
    color: SecondaryColor,
    fontSize: 14,
  },
  videoThumbnail: {
    width: 45,
    height: 45,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  usernameText: {
    fontWeight: 'bold',
  },
  activityHeaderContainer: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',

    marginTop: 10,
  },
  activityHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    letterSpacing: 1,
  },
});

const MainExploreScreenStyle = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  searchInput: {
    margin: 16,
  },
  content: {
    paddingTop: 90,
    paddingBottom: 20,
  },
  searchHeaderText: { color: '#666' },
  searchHeaderTextContainer: {
    padding: 5,
    borderRadius: '40%',

    paddingHorizontal: 30,
  },
  searchHeaderContainer: {
    padding: 3,
    flexDirection: 'row',
    gap: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  searchContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2,
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    backgroundColor: '#fff',
  },
  searchMessagesContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInputView: {
    height: 40,
    paddingHorizontal: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    width: '100%',
    justifyContent: 'center',
    borderRadius: 4,
    backgroundColor: '#f8f8f8',
  },
  searchText: {
    fontSize: 16,
    color: '#666',
  },
  categorySection: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    marginRight: 8,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  viewAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAll: {
    color: '#666',
    fontWeight: '500',
    marginRight: 4,
  },
  carousel: {
    paddingLeft: 16,
  },
  videoCard: {
    width: CARD_WIDTH,
    marginRight: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
  },
  thumbnailContainer: {
    position: 'relative',
  },
  videoThumbnail: {
    width: '100%',
    height: CARD_HEIGHT,
    maxHeight: 800,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
  },
  videoInfo: {
    padding: 12,
    position: 'absolute',
    bottom: 0,
    zIndex: 2,
  },
  username: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#fff',
  },
  caption: {
    color: '#fff',
    marginBottom: 8,
  },
  metrics: {
    flexDirection: 'row',
    gap: 16,
  },
  metric: {
    fontSize: 12,
    color: '#fff',
  },
});

const AddPostScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  fullScreenOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 200,
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionText: {
    color: '#fff',
    fontSize: 18,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addSoundBtn: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  addSoundText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  timerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  timerContainer: {
    position: 'absolute',
    top: 50,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightSidebar: {
    position: 'absolute',
    top: 100,
    right: 10,
    alignItems: 'center',
  },
  iconButton: {
    marginBottom: 25,
    alignItems: 'center',
  },
  iconLabel: {
    color: '#fff',
    fontSize: 11,
    marginTop: 4,
  },
  durationWrapper: {
    position: 'absolute',
    bottom: 150,
    width: screenWidth,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    zIndex: 2,
  },
  innerRecordButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    // You can replace '#007bff' with your actual PrimaryColor if imported.
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  extraOptions: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    position: 'absolute',
    zIndex: 1,
  },
  extraOption: {
    color: '#fff',
    fontSize: 14,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  // New styles for the Camera container with aspect ratio support
  cameraContainer: {
    width: '100%',
    backgroundColor: 'black',
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
  },
});

export {
  HomeScreenStyles,
  MessagesOutsideStyles,
  MainExploreScreenStyle,
  ProfileScreenstyles,
  ClipItemStyles,
  ChatscreenStyles,
  NotificationScreenStyles,
  AddPostScreenStyles,
};
