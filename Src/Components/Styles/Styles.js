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
    borderRadius: 8,
    marginTop: 10,
    // Optional: add a subtle shadow (iOS only, or with elevation for Android)
    // shadowColor: '#000',
    // shadowOffset: {width: 0, height: 1},
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    // elevation: 2,
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
  },
});
export {HomeScreenStyles, MessagesOutsideStyles};
