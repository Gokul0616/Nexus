// // ChatScreen.js
// import React, { useEffect, useState, useRef } from 'react';
// import {
//     View, Text, TextInput,
//     Button, FlatList, ActivityIndicator
// } from 'react-native';
// import { storage } from '../CommonData';
// import apiClient from '../../Services/api/apiInterceptor';

// export default function ChatScreen({ route }) {
//     // const { token, otherUserId } = route.params;
//     const token = storage.getString('token');
//     const userId = JSON.parse(storage.getString('profile')).userId
//     const otherUserId = "user002"
//     const ws = useRef(null);
//     const [msgs, setMsgs] = useState([]);
//     const [input, setInput] = useState('');
//     const [typingUsers, setTypingUsers] = useState(new Set());
//     const [onlineUsers, setOnlineUsers] = useState({}); // { userId: bool }

//     // Fetch history
//     useEffect(() => {
//         apiClient.get(`api/messages/history/${otherUserId}?page=0&size=50`)
//             .then(r => r.json())
//             .then(data => setMsgs(data.content.reverse()));
//     }, []);

//     // Connect WS
//     useEffect(() => {
//         ws.current = new WebSocket(`ws://192.168.1.19:8080/api/v1/ws/raw?token=${token}`);

//         ws.current.onopen = () => console.log('WS open');
//         ws.current.onmessage = ({ data }) => {
//             const msg = JSON.parse(data);
//             switch (msg.type) {
//                 case 'chat':
//                     setMsgs(m => [...m, msg.message]);
//                     // ack delivered
//                     ws.current.send(JSON.stringify({
//                         type: 'delivered',
//                         messageId: msg.message.id
//                     }));
//                     break;

//                 case 'typing':
//                     setTypingUsers(ts => {
//                         const copy = new Set(ts);
//                         if (msg.typing) copy.add(msg.senderId);
//                         else copy.delete(msg.senderId);
//                         return copy;
//                     });
//                     break;

//                 case 'presence':
//                     setOnlineUsers(o => ({ ...o, [msg.userId]: msg.online }));
//                     break;

//                 case 'seen':
//                     setMsgs(m =>
//                         m.map(x =>
//                             x.id === msg.messageId ? { ...x, seen: true } : x
//                         ));
//                     break;
//             }
//         };
//         ws.current.onerror = e => console.warn(e.message);
//         ws.current.onclose = () => console.log('WS closed');
//         return () => ws.current.close();
//     }, []);

//     // Send typing indicator
//     const onChangeText = text => {
//         setInput(text);
//         ws.current.send(JSON.stringify({
//             type: 'typing',
//             receiverId: otherUserId,
//             typing: Boolean(text)
//         }));
//     };

//     // Send chat
//     const send = () => {
//         if (!input.trim()) return;
//         ws.current.send(JSON.stringify({
//             type: 'chat',
//             receiverId: otherUserId,
//             content: input
//         }));
//         setInput('');
//     };

//     // Mark seen when list displayed
//     const onViewableItemsChanged = ({ viewableItems }) => {
//         viewableItems.forEach(v => {
//             if (!v.item.seen && v.item.receiverId === userId) {
//                 ws.current.send(JSON.stringify({
//                     type: 'seen',
//                     messageId: v.item.id,
//                     senderId: v.item.senderId
//                 }));
//             }
//         });
//     };

//     return (
//         <View style={{ flex: 1, padding: 12 }}>
//             <Text>
//                 {onlineUsers[otherUserId] ? '🟢 Online' : '⚪️ Offline'}
//             </Text>
//             {typingUsers.has(otherUserId) && <Text>Typing…</Text>}

//             <FlatList
//                 data={msgs}
//                 keyExtractor={i => i.id.toString()}
//                 renderItem={({ item }) => (
//                     <Text>
//                         {item.senderId}: {item.content}
//                         {item.seen && ' ✓✓'}
//                     </Text>
//                 )}
//                 onViewableItemsChanged={onViewableItemsChanged}
//                 viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
//             />

//             <TextInput
//                 value={input}
//                 onChangeText={onChangeText}
//                 placeholder="Type a message"
//                 style={{ borderWidth: 1, padding: 8, marginVertical: 8 }}
//             />
//             <Button title="Send" onPress={send} />
//         </View>
//     );
// }
