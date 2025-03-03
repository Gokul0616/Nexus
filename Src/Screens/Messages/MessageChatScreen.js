import React, {useEffect, useRef, useState} from 'react';
import {
  TextInput,
  TouchableOpacity,
  View,
  Animated,
  Vibration,
} from 'react-native';
import {FlatList, Text} from 'react-native-gesture-handler';
import {TouchableRipple} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import DynamicImage from '../../Components/DynamicImage';
import {ChatscreenStyles as styles} from '../../Components/Styles/Styles';
import {getLinkPreview, getPreviewFromContent} from 'link-preview-js';
import {conversationData} from '../../Components/DummyData';
import NetInfo from '@react-native-community/netinfo';
import {useNavigation} from '@react-navigation/native';
import {getPreview, getRelativeTime} from '../../Components/CommonData';
import {PanGestureHandler, State} from 'react-native-gesture-handler';

const DRAG_THRESHOLD = 80;

const DraggableChatBubble = ({
  item,
  children,
  onSwipeReply,
  flatListRef,
  style,
}) => {
  const translateX = useRef(new Animated.Value(0)).current;

  const onGestureEvent = Animated.event(
    [{nativeEvent: {translationX: translateX}}],
    {useNativeDriver: true},
  );

  const onHandlerStateChange = event => {
    if (event.nativeEvent.state === State.END) {
      const dragX = -event.nativeEvent.translationX;
      if (dragX > DRAG_THRESHOLD) {
        onSwipeReply(item);
        Vibration.vibrate(100);
        translateX.setValue(0);
      } else {
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  return (
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onHandlerStateChange}
      simultaneousHandlers={flatListRef}
      activeOffsetX={[-10, 1000]}
      failOffsetX={[-1000, 0]}>
      <Animated.View style={[style, {transform: [{translateX}]}]}>
        {children}
      </Animated.View>
    </PanGestureHandler>
  );
};

const MessageChatScreen = ({route}) => {
  const {receiverDetails} = route.params;
  const [isConnected, setIsConnected] = useState(true);
  const [messages, setMessages] = useState(conversationData);
  const [replyMessage, setReplyMessage] = useState(null);
  const [highlightedMessageId, setHighlightedMessageId] = useState(null);
  const navigation = useNavigation();
  const flatListRef = useRef(null);

  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToOffset({offset: 0, animated: true});
    }
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (flatListRef.current && messages.length > 0) {
        flatListRef.current.scrollToOffset({offset: 0, animated: true});
      }
    }, 1000);
  }, [messages]);

  const handleReplyPress = replyId => {
    const index = messages.findIndex(msg => msg.id === replyId);
    if (index >= 0 && flatListRef.current) {
      flatListRef.current.scrollToIndex({index, animated: true});
      setHighlightedMessageId(replyId);
      setTimeout(() => {
        setHighlightedMessageId(null);
      }, 2000);
    }
  };

  const Header = () => {
    return (
      <View style={styles.headerContainer}>
        <TouchableRipple
          style={styles.iconContainer}
          rippleColor="rgba(0, 0, 0, .15)"
          onPress={() => {
            navigation.goBack();
          }}>
          <Icon name="chevron-back" size={28} color="#000" />
        </TouchableRipple>
        <View style={styles.headerTitleContainer}>
          <View>
            <DynamicImage
              style={styles.messageContactsAvatar}
              uri={receiverDetails.avatar}
              isConnected={isConnected}
            />
            {receiverDetails?.isOnline && <View style={styles.onlineStatus} />}
          </View>
          <Text style={styles.headerTitle}>
            {receiverDetails?.name.slice(0, 10)}
            {receiverDetails?.name.length > 10 ? '...' : ''}
          </Text>
        </View>
        <TouchableRipple
          style={styles.iconContainer}
          rippleColor="rgba(0, 0, 0, .15)"
          onPress={() => {}}>
          <Icon name="person" size={28} color="#000" />
        </TouchableRipple>
      </View>
    );
  };

  const ChatInput = ({replyMessage, setReplyMessage}) => {
    const [inputValue, setInputValue] = useState('');

    const handleSend = async () => {
      if (inputValue.trim() === '') return;
      const newMessage = {
        id: Date.now().toString(),
        text: inputValue,
        isSender: true,
        timestamp: Date.now(),

        hasReply: replyMessage
          ? {
              id: replyMessage.id,
              text: replyMessage.text,
              timestamp: replyMessage.timestamp,
            }
          : null,
      };

      setMessages(prevMessages => [...prevMessages, newMessage]);
      setInputValue('');
      setReplyMessage(null);
    };

    return (
      <>
        {replyMessage && (
          <View style={styles.replyPreviewContainer}>
            <Text style={styles.replyLabel}>
              Replying to:{' '}
              <Text style={styles.replyText}>
                {replyMessage.text.slice(0, 30)}
                {replyMessage.text.length > 30 ? '...' : ''}
              </Text>
            </Text>
            <TouchableOpacity
              onPress={() => setReplyMessage(null)}
              style={styles.replyCancelButton}>
              <Icon name="close" size={20} color="#000" />
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.textInputContainer}>
          <TextInput
            style={styles.textInput}
            autoFocus={replyMessage ? true : false}
            cursorColor="#0887ff"
            multiline
            placeholder="Type a message..."
            value={inputValue}
            onChangeText={text => setInputValue(text)}
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity
            style={styles.sendButtonContainer}
            onPress={handleSend}>
            <Icon name="paper-plane" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </>
    );
  };
  const renderBubbles = item => {
    return (
      <DraggableChatBubble
        item={item}
        onSwipeReply={item => {
          setReplyMessage(item);
        }}
        flatListRef={flatListRef}>
        {item?.hasReply && (
          <TouchableRipple
            onPress={() => handleReplyPress(item?.hasReply?.id)}
            rippleColor={'rgba(0, 0, 0, .15)'}
            style={[
              styles.replymessageContainer,
              item.isSender
                ? {alignSelf: 'flex-end'}
                : {alignSelf: 'flex-start'},
            ]}>
            <Text style={styles.replyMessageText}>
              {item?.hasReply?.text.slice(0, 30)}
              {item?.hasReply?.text.length > 30 ? '...' : ''}
            </Text>
          </TouchableRipple>
        )}
        <View
          style={[
            styles.chatBubble,
            item.hasReply && {marginVertical: 0},
            item.isSender ? styles.senderBubble : styles.receiverBubble,
            item.id === highlightedMessageId && {
              borderWidth: 2,
              borderColor: '#FFD700',
            },
          ]}>
          <Text
            style={[
              styles.chatText,
              item.isSender ? {color: '#fff'} : {color: '#000'},
            ]}>
            {item.text}
          </Text>
          <Text
            style={[styles.timestamp, item.isSender ? {color: '#fff'} : null]}>
            {getRelativeTime(item.timestamp)}
          </Text>
        </View>
      </DraggableChatBubble>
    );
  };

  return (
    <View style={styles.container}>
      <Header />
      <FlatList
        ref={flatListRef}
        inverted={false}
        data={messages}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item.id}
        renderItem={({item}) => renderBubbles(item)}
        contentContainerStyle={styles.chatList}
      />
      <ChatInput
        replyMessage={replyMessage}
        setReplyMessage={setReplyMessage}
      />
    </View>
  );
};

export default MessageChatScreen;
