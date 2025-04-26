import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  Vibration,
  View
} from 'react-native';

import Clipboard from '@react-native-clipboard/clipboard';
import NetInfo from '@react-native-community/netinfo';
import { useNavigation } from '@react-navigation/native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { TouchableRipple } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { fetchLinkPreview, getRelativeTime } from '../../Components/CommonData';
import CustomLoadingIndicator from '../../Components/CustomLoadingIndicator';
import { conversationData } from '../../Components/DummyData';
import DynamicImage from '../../Components/DynamicImage';
import { ChatscreenStyles as styles } from '../../Components/Styles/Styles';
import CustomToast from '../../Services/Hooks/Customtoast/CustomToast';
import { useChatInput } from '../../Services/Hooks/useChatInput';

const DRAG_PERCENTAGE = 0.15;
const REPLY_TRIGGER_PERCENTAGE = 0.1;

const DraggableChatBubble = ({
  item,
  children,
  onSwipeReply,
  flatListRef,
  style,
}) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const containerWidth = useRef(0);

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true },
  );

  const onHandlerStateChange = event => {
    if (event.nativeEvent.state === State.END) {
      const dragX = -event.nativeEvent.translationX;
      const maxDrag = containerWidth.current * DRAG_PERCENTAGE;
      const triggerReply = containerWidth.current * REPLY_TRIGGER_PERCENTAGE;
      if (dragX > triggerReply) {
        onSwipeReply(item);
        Vibration.vibrate(100);
      }
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  };
  return (
    <View
      onLayout={ event => {
        containerWidth.current = event.nativeEvent.layout.width;
      } }>
      <PanGestureHandler
        onGestureEvent={ onGestureEvent }
        onHandlerStateChange={ onHandlerStateChange }
        simultaneousHandlers={ flatListRef }
        activeOffsetX={ [-10, 500] }
        failOffsetX={ [-500, 0] }>
        <Animated.View style={ [style, { transform: [{ translateX }] }] }>
          { children }
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};
const MessageChatScreen = ({ route }) => {
  const { receiverDetails } = route.params;
  const [isConnected, setIsConnected] = useState(true);
  const [messages, setMessages] = useState(conversationData);
  const [replyMessage, setReplyMessage] = useState(null);
  const [highlightedMessageId, setHighlightedMessageId] = useState(null);
  const navigation = useNavigation();
  const flatListRef = useRef(null);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (flatListRef.current && messages.length > 0) {
        flatListRef.current.scrollToOffset({ offset: 0, animated: true });
      }
    }, 1000);
  }, [messages]);

  const handleReplyPress = replyId => {
    const index = messages.findIndex(msg => msg.id === replyId);
    if (index >= 0 && flatListRef.current) {
      flatListRef.current.scrollToIndex({ index, animated: true });
      setHighlightedMessageId(replyId);
      setTimeout(() => {
        setHighlightedMessageId(null);
      }, 2000);
    }
  };

  const Header = () => {
    return (
      <View style={ styles.headerContainer }>
        <TouchableRipple
          borderless={ true }
          style={ styles.iconContainer }
          rippleColor="rgba(0, 0, 0, .15)"
          onPress={ () => {
            navigation.goBack();
          } }>
          <Icon name="chevron-back" size={ 28 } color="#000" />
        </TouchableRipple>
        <View style={ styles.headerTitleContainer }>
          <View>
            <DynamicImage
              style={ styles.messageContactsAvatar }
              uri={ receiverDetails.avatar }
              isConnected={ isConnected }
            />
            { receiverDetails?.isOnline && <View style={ styles.onlineStatus } /> }
          </View>
          <Text style={ styles.headerTitle }>
            { receiverDetails?.name.slice(0, 10) }
            { receiverDetails?.name.length > 10 ? '...' : '' }
          </Text>
        </View>
        <TouchableRipple
          borderless={ true }
          style={ styles.iconContainer }
          rippleColor="rgba(0, 0, 0, .15)"
          onPress={ () => { } }>
          <Icon name="person" size={ 28 } color="#000" />
        </TouchableRipple>
      </View>
    );
  };
  const sendMessage = async () => {
    const payload = {
      text: messageText,
      isSender: true,
      timestamp: new Date().toISOString(),
      replyTo: replyMessage
        ? {
          id: replyMessage.id,
          text: replyMessage.text,
          timestamp: replyMessage.timestamp,
        }
        : null,
      linkPreview: url
        ? {
          title: previewData.title,
          description: previewData.description,
          image: previewData.image,
          url: previewData.url,
        }
        : null,
      receiverId: selectedUser.id, // the ID of the person you’re chatting with
    };

    try {
      const response = await axios.post(`${API_URL}/messages/send`, payload);
      // update chat UI with response.data
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const ChatInput = ({ replyMessage, setReplyMessage }) => {
    const { inputValue, setInputValue } = useChatInput();
    const inputRef = useRef(null);

    useEffect(() => {
      if (replyMessage) {
        inputRef.current?.focus();
      }
    }, [replyMessage]);

    const handleSend = () => {
      if (inputValue.trim() === '') return;

      const messageText = inputValue;

      const urlRegex = /https?:\/\/[^\s]+/;
      const urlMatch = messageText.match(urlRegex);
      const url = urlMatch ? urlMatch[0] : null;

      const newMessage = {
        id: Date.now().toString(),
        text: messageText,
        isSender: true,
        timestamp: Date.now(),
        hasReply: replyMessage
          ? {
            id: replyMessage.id,
            text: replyMessage.text,
            timestamp: replyMessage.timestamp,
          }
          : null,
        isLink: !!url,
        linkPreview: null,
      };

      setMessages(prevMessages => [newMessage, ...prevMessages]);

      setInputValue('');
      setReplyMessage(null);

      if (url) {
        fetchLinkPreview(url).then(linkPreview => {
          if (linkPreview) {
            setMessages(prevMessages =>
              prevMessages.map(msg =>
                msg.id === newMessage.id
                  ? {
                    ...msg,
                    linkPreview: {
                      title: linkPreview.title,
                      description: linkPreview.description,
                      image: linkPreview.images?.[0],
                      url: linkPreview.url,
                    },
                    isLink: true,
                  }
                  : msg,
              ),
            );
          }
        });
      }
    };

    return (
      <>
        { replyMessage && (
          <View style={ styles.replyPreviewContainer }>
            <Text style={ styles.replyLabel }>
              Replying to:{ ' ' }
              <Text style={ styles.replyText }>
                { replyMessage.text.slice(0, 30) }
                { replyMessage.text.length > 30 ? '...' : '' }
              </Text>
            </Text>
            <TouchableOpacity
              onPress={ () => setReplyMessage(null) }
              style={ styles.replyCancelButton }>
              <Icon name="close" size={ 20 } color="#000" />
            </TouchableOpacity>
          </View>
        ) }
        <View style={ styles.textInputContainer }>
          <TextInput
            autoFocus={ replyMessage ? true : false }
            ref={ inputRef }
            style={ styles.textInput }
            cursorColor="#0887ff"
            multiline
            placeholder="Type a message..."
            value={ inputValue }
            onChangeText={ text => setInputValue(text) }
            onSubmitEditing={ handleSend }
          />
          <TouchableOpacity
            style={ styles.sendButtonContainer }
            onPress={ handleSend }>
            <Icon name="paper-plane" size={ 22 } color="#fff" />
          </TouchableOpacity>
        </View>
      </>
    );
  };

  const handleLongPress = text => {
    Clipboard.setString(text);
    Vibration.vibrate(100);
    CustomToast.show('Link Copied to Clipboard', true);

  };
  const renderMessageContent = message => {
    const urlRegex = /((?:https?:\/\/)?[\w-]+\.[\w.-]+[^\s]*)/g;
    const parts = message.split(urlRegex);
    return parts.map((part, index) => {
      if (/^((?:https?:\/\/)?[\w-]+\.[\w.-]+[^\s]*)$/.test(part)) {
        return (
          <Text
            key={ index }
            onPress={ () => navigation.navigate('WebScreen', { url: part }) }
            onLongPress={ () => handleLongPress(part) }
            style={ { textDecorationLine: 'underline', color: '#fff' } }>
            { part }
          </Text>
        );
      } else {
        return <Text key={ index }>{ part }</Text>;
      }
    });
  };

  const renderBubbles = item => {
    return (
      <DraggableChatBubble
        item={ item }
        onSwipeReply={ () => setReplyMessage(item) }
        flatListRef={ flatListRef }>
        { item.isLink &&
          (item.linkPreview ? (
            <TouchableRipple
              borderless={ true }
              rippleColor={ 'rgba(0, 0, 0, .15)' }
              onPress={ () =>
                navigation.navigate('WebScreen', { url: item.linkPreview.url })
              }
              style={ [
                styles.linkPreviewContainer,
                item.isSender
                  ? { alignSelf: 'flex-end' }
                  : { alignSelf: 'flex-start' },
              ] }>
              <>
                { item.linkPreview.image && (
                  <View style={ { height: '70%' } }>
                    <Image
                      source={ { uri: item.linkPreview.image } }
                      style={ styles.previewImage }
                    />
                  </View>
                ) }
                <View style={ styles.previewTextContainer }>
                  <Text
                    style={ styles.previewTitle }
                    numberOfLines={ 2 }
                    ellipsizeMode="tail">
                    { item.linkPreview.title }
                  </Text>
                  <Text
                    style={ styles.previewLink }
                    numberOfLines={ 2 }
                    ellipsizeMode="tail">
                    { item.linkPreview.url }
                  </Text>
                </View>
              </>
            </TouchableRipple>
          ) : item.text.match(/https?:\/\/[^\s]+/) ? (
            <CustomLoadingIndicator />
          ) : null) }
        { item?.hasReply && (
          <TouchableRipple
            borderless={ true }
            onPress={ () => handleReplyPress(item?.hasReply?.id) }
            rippleColor={ 'rgba(0, 0, 0, .15)' }
            style={ [
              styles.replymessageContainer,
              item.isSender
                ? { alignSelf: 'flex-end' }
                : { alignSelf: 'flex-start' },
            ] }>
            <Text style={ styles.replyMessageText }>
              { item?.hasReply?.text.slice(0, 30) }
              { item?.hasReply?.text.length > 30 ? '...' : '' }
            </Text>
          </TouchableRipple>
        ) }
        <View
          style={ [
            styles.chatBubble,
            // {backgroundColor: item.isSender ? '#0887ff' : 'red'},
            (item.hasReply || item.linkPreview) && { marginVertical: 0 },
            item.isSender ? styles.senderBubble : styles.receiverBubble,
            item.id === highlightedMessageId && {
              borderWidth: 2,
              borderColor: '#FFD700',
            },
          ] }>
          <Text
            style={ [
              styles.chatText,
              item.isSender ? { color: '#fff' } : { color: '#000' },
            ] }>
            { item.linkPreview ? renderMessageContent(item.text) : item.text }
          </Text>
          <Text
            style={ [styles.timestamp, item.isSender ? { color: '#fff' } : null] }>
            { getRelativeTime(item.timestamp) }
          </Text>
        </View>
      </DraggableChatBubble>
    );
  };

  return (
    <View style={ styles.container }>
      <Header />
      <FlatList
        ref={ flatListRef }
        inverted={ true }
        data={ messages }
        showsVerticalScrollIndicator={ false }
        keyExtractor={ item => item.id }
        renderItem={ ({ item }) => renderBubbles(item) }
        contentContainerStyle={ styles.chatList }
      />
      <ChatInput
        replyMessage={ replyMessage }
        setReplyMessage={ setReplyMessage }
      />
    </View>
  );
};

export default MessageChatScreen;
