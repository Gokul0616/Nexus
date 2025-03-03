import React, {useRef, useEffect, useState} from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  PanResponder,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Image,
  ScrollView,
  Keyboard,
  useWindowDimensions,
  Platform,
} from 'react-native';
import {commentData} from './DummyData';
import Feather from 'react-native-vector-icons/Feather';
import {TouchableRipple} from 'react-native-paper';
import DynamicImage from './DynamicImage';

const Comment = ({modalVisible, setModalVisible, isConnected}) => {
  const windowDimensions = useWindowDimensions();
  const windowHeight = windowDimensions.height;
  // Use a default animation starting value based on current window height
  const translateY = useRef(new Animated.Value(windowHeight)).current;
  const [comments, setComments] = useState(commentData);
  const inputRef = useRef(null);
  const [newComment, setNewComment] = useState('');
  const [replyReference, setReplyReference] = useState({
    comment: '',
    parentUsername: '',
  });
  const [replyingTo, setReplyingTo] = useState(null);
  const [expandedReplies, setExpandedReplies] = useState({});
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // Listen to keyboard events
  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', e => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // Compute a dynamic height for the modal
  // Use 75% of window height as default, but if keyboard is open,
  // reduce modal height to fit in the remaining space (with a margin of 20)
  const modalHeight = Math.min(
    windowHeight * 0.75,
    windowHeight - keyboardHeight - 20,
  );

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) translateY.setValue(gestureState.dy);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > windowHeight * 0.25) {
          closeModal();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  useEffect(() => {
    if (modalVisible) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [modalVisible, translateY]);

  const closeModal = () => {
    Animated.timing(translateY, {
      toValue: windowHeight,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  const handleLike = commentId => {
    const updateLikes = items =>
      items.map(item => {
        if (item.id === commentId) {
          return {
            ...item,
            likes: (item.likes || 0) + (item.isLiked ? -1 : 1),
            isLiked: !item.isLiked,
          };
        }
        if (item.replies) {
          return {
            ...item,
            replies: updateLikes(item.replies),
          };
        }
        return item;
      });
    setComments(prev => updateLikes(prev));
  };

  const handleReply = (parentId, username) => {
    setReplyingTo(parentId);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleReplyCommentReference = (comment, parentUsername) => {
    setReplyReference({
      comment: comment.text,
      parentUsername: parentUsername || comment.user.name,
    });
  };

  const handlePostComment = () => {
    if (!newComment.trim()) return;
    const newReply = {
      id: Date.now().toString(),
      user: {
        id: 'current-user',
        name: 'Current User',
        avatar: 'https://via.placeholder.com/150',
      },
      text: newComment,
      timestamp: new Date().toISOString(),
      replies: [],
    };
    const addReply = items =>
      items.map(item => {
        if (item.id === replyingTo) {
          return {
            ...item,
            replies: [...(item.replies || []), newReply],
          };
        }
        if (item.replies) {
          return {
            ...item,
            replies: addReply(item.replies),
          };
        }
        return item;
      });
    setComments(prev => (replyingTo ? addReply(prev) : [...prev, newReply]));
    setNewComment('');
    setReplyingTo(null);
    setReplyReference({comment: '', parentUsername: ''});
  };

  const CommentItem = ({comment, parentUsername}) => {
    const isExpanded = expandedReplies[comment.id] || false;
    const toggleReplies = () => {
      setExpandedReplies(prev => ({
        ...prev,
        [comment.id]: !isExpanded,
      }));
    };
    return (
      <View style={styles.commentWrapper}>
        {parentUsername && (
          <View style={styles.replyHeader}>
            <Text style={styles.replyHeaderText}>
              Replied to {parentUsername}
            </Text>
          </View>
        )}
        <View style={styles.commentContainer}>
          <DynamicImage
            isConnected={isConnected}
            uri={comment.user.avatar}
            style={styles.avatar}
          />
          <View style={styles.commentContent}>
            <Text style={styles.username}>{comment.user.name}</Text>
            <Text style={styles.commentText}>{comment.text}</Text>
            <View style={styles.actionContainer}>
              <Text style={styles.timestamp}>
                {new Date(comment.timestamp).toLocaleTimeString()}
              </Text>
              <TouchableOpacity onPress={() => handleLike(comment.id)}>
                <Text
                  style={[styles.likeButton, comment.isLiked && styles.liked]}>
                  {comment.likes || 0} ❤️
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  handleReply(comment.id, comment.user.name);
                  handleReplyCommentReference(comment, parentUsername);
                }}>
                <Text style={styles.replyButton}>↪️ Reply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {comment.replies && comment.replies.length > 0 && (
          <>
            <TouchableOpacity onPress={toggleReplies}>
              <Text style={styles.viewRepliesText}>
                {isExpanded
                  ? 'Hide Replies'
                  : `View ${comment.replies.length} Replies`}
              </Text>
            </TouchableOpacity>
            {isExpanded && (
              <View style={styles.repliesContainer}>
                {comment.replies.map(reply => (
                  <CommentItem
                    key={reply.id}
                    comment={reply}
                    parentUsername={comment.user.name}
                  />
                ))}
              </View>
            )}
          </>
        )}
      </View>
    );
  };

  return (
    <Modal
      visible={modalVisible}
      transparent
      animationType="none"
      onRequestClose={closeModal}>
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.backgroundOverlay} />
        </TouchableWithoutFeedback>
        <Animated.View
          style={[
            styles.bottomSheet,
            {height: modalHeight, transform: [{translateY}]},
          ]}>
          <View {...panResponder.panHandlers}>
            <View style={styles.handle} />
          </View>
          <Text style={styles.totalCommentsText}>
            {comments.length} Comments
          </Text>
          <ScrollView
            contentContainerStyle={styles.listContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled>
            {comments.map(item => (
              <CommentItem key={item.id} comment={item} />
            ))}
          </ScrollView>
          {replyReference.comment !== '' && (
            <View style={styles.replyCommentReferecnceContainer}>
              <View style={styles.replyHeaderContainer}>
                <Text style={styles.replyLabel}>Replying To</Text>
                <Text style={styles.replyUsername}>
                  {replyReference.parentUsername}
                </Text>
              </View>
              <Text style={styles.replyText}>
                {replyReference.comment.slice(0, 30)}
                {replyReference.comment.length > 30 ? '...' : ''}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  setReplyReference({comment: '', parentUsername: ''})
                }>
                <TouchableRipple
                  style={{position: 'absolute', bottom: 10, right: 10}}>
                  <Feather name="x" size={24} color="black" />
                </TouchableRipple>
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.inputContainer}>
            <TextInput
              ref={inputRef}
              placeholder={
                replyingTo ? 'Replying to comment...' : 'Add a comment...'
              }
              placeholderTextColor="#666"
              style={styles.input}
              value={newComment}
              onChangeText={setNewComment}
              onSubmitEditing={handlePostComment}
            />
            <TouchableOpacity
              style={styles.postButton}
              onPress={handlePostComment}>
              <Text style={styles.postButtonText}>Post</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  backgroundOverlay: {
    flex: 1,
  },
  bottomSheet: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 10,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
    alignSelf: 'center',
    marginVertical: 16,
  },
  totalCommentsText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  commentWrapper: {
    marginBottom: 16,
    paddingLeft: 8,
  },
  replyHeader: {
    marginBottom: 4,
  },
  replyHeaderText: {
    color: '#666',
    fontSize: 12,
    marginBottom: 4,
  },
  horizontalLine: {
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  commentContent: {
    flex: 1,
  },
  username: {
    color: '#333',
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 2,
  },
  commentText: {
    color: '#333',
    fontSize: 14,
    lineHeight: 18,
    flexShrink: 1,
  },
  timestamp: {
    color: '#666',
    fontSize: 12,
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 12,
  },
  likeButton: {
    color: '#666',
    fontSize: 12,
  },
  liked: {
    color: '#ff0000',
    fontWeight: 'bold',
  },
  replyButton: {
    color: '#007AFF',
    fontSize: 12,
  },
  viewRepliesText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
  },
  repliesContainer: {
    marginTop: 8,
    borderLeftWidth: 1,
    borderLeftColor: '#e0e0e0',
    paddingLeft: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: '#333',
    fontSize: 14,
  },
  postButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  postButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    // paddingBottom: 100,
  },
  replyCommentReferecnceContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 16,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  replyHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  replyLabel: {
    fontSize: 12,
    color: '#555',
    marginRight: 4,
  },
  replyUsername: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  replyText: {
    fontSize: 14,
    color: '#333',
  },
});

export default Comment;
