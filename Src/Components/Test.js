import React, { useEffect, useRef, useState } from 'react';
import {
    Button,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { storage } from './CommonData';
import { wsUrl } from '../Services/api/EndPoint';

const WebSocketExample = () => {
    const [ws, setWs] = useState(null);
    const [message, setMessage] = useState('');
    const [chatLog, setChatLog] = useState([]);
    const typingTimeoutRef = useRef(null);

    useEffect(() => {
        const token = storage.getString('token');
        const socket = new WebSocket(
            `${wsUrl}ws?token=${token}`,
            null,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );

        socket.onopen = () => {
            setChatLog(prev => [...prev, 'Connected to the server.']);
        };

        socket.onmessage = e => { setChatLog(prev => [...prev, `Server: ${e.data}`]); };

        socket.onerror = e => { setChatLog(prev => [...prev, `Error: ${e.message}`]); };

        socket.onclose = e => { setChatLog(prev => [...prev, 'Disconnected from the server.']); };

        setWs(socket);

        return () => {
            socket.close();
        };
    }, []);

    const sendTypingEvent = () => {
        if (ws) {
            ws.send(
                JSON.stringify({
                    type: 'TYPING',
                    timestamp: new Date().toISOString(),
                }),
            );
        }
    };

    const sendStopTypingEvent = () => {
        if (ws) {
            ws.send(
                JSON.stringify({
                    type: 'STOP_TYPING',
                    timestamp: new Date().toISOString(),
                }),
            );
        }
    };

    const handleInputChange = text => {
        setMessage(text);
        sendTypingEvent();

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            sendStopTypingEvent();
        }, 1000);
    };

    const sendMessage = () => {
        if (ws && message) {
            ws.send(
                JSON.stringify({
                    type: 'MESSAGE',
                    topic: '<userId>',
                    from: '<senderId>',
                    content: message,
                    timestamp: new Date().toISOString(),
                }),
            );
            setChatLog(prev => [...prev, `You: ${message}`]);
            setMessage('');
            sendStopTypingEvent();
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>WebSocket Chat</Text>
            <ScrollView style={styles.chatContainer}>
                {chatLog.map((msg, index) => (
                    <Text key={index} style={styles.chatMessage}>
                        {msg}
                    </Text>
                ))}
            </ScrollView>
            <TextInput
                style={styles.input}
                value={message}
                onChangeText={handleInputChange}
                placeholder="Type your message"
            />
            <Button title="Send" onPress={() => {
                sendMessage();
            }} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        paddingTop: 40,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        marginBottom: 16,
        textAlign: 'center',
    },
    chatContainer: {
        flex: 1,
        marginBottom: 16,
    },
    chatMessage: {
        fontSize: 16,
        marginVertical: 4,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        paddingHorizontal: 8,
        marginBottom: 8,
    },
});

export default WebSocketExample;
