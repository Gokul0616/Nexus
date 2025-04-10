
import notifee, { AndroidStyle } from '@notifee/react-native';
import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { SecondaryColor } from './CommonData';

const DisplayNotification = () => {
    async function setupChannel(channelId, channelName, sound = 'default') {
        return await notifee.createChannel({
            id: channelId,
            name: channelName,
            sound, // Make sure the sound file (e.g., doorbell.mp3) exists in your Android res/raw folder if custom.
        });
    }

    // 1. Simple Notification: Title and body only.
    async function onSimpleNotification() {
        const channelId = await setupChannel('simple', 'Simple Channel');
        await notifee.displayNotification({
            title: 'Simple Notification',
            body: 'This is a basic notification with a title and body.',
            android: {
                channelId,
                smallIcon: 'ic_launcher', // Ensure this icon exists in your resources
                timestamp: Date.now(),
                showTimestamp: true,
                pressAction: {
                    id: 'default',
                },
            },
        });
    }

    // 2. Big Picture Notification: Displays a large image.
    async function onBigPictureNotification() {
        const channelId = await setupChannel('big-picture', 'Big Picture Channel');
        await notifee.displayNotification({
            title: 'New Photo Received',
            body: 'Tap to view the photo.',
            android: {
                channelId,
                smallIcon: 'ic_launcher',
                timestamp: Date.now(),
                showTimestamp: true,
                style: {
                    type: AndroidStyle.BIGPICTURE,
                    picture:
                        'https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?cs=srgb&dl=pexels-anjana-c-169994-674010.jpg&fm=jpg',
                },
                pressAction: {
                    id: 'default',
                },
            },
        });
    }

    // 3. Actionable Notification: Includes action buttons like "Like" and "Dismiss".
    async function onActionableNotification() {
        const channelId = await setupChannel('actions', 'Action Notifications Channel');
        await notifee.displayNotification({
            title: 'Action Required',
            body: 'Do you like this notification?',
            android: {
                channelId,
                smallIcon: 'ic_launcher',
                timestamp: Date.now(),
                showTimestamp: true,
                pressAction: {
                    id: 'default',
                },
                actions: [
                    {
                        title: 'Like',
                        pressAction: { id: 'like' },
                    },
                    {
                        title: 'Dismiss',
                        pressAction: { id: 'dismiss' },
                    },
                ],
            },
        });
    } async function onMessagingNotification() {
        try {
            await notifee.requestPermission();
            const channelId = await setupChannel('messaging', 'Messaging Channel');

            await notifee.displayNotification({
                title: 'New Message',
                android: {
                    channelId,
                    smallIcon: 'ic_launcher',
                    timestamp: Date.now(),
                    showTimestamp: true,
                    style: {
                        type: AndroidStyle.MESSAGING,
                        conversationTitle: 'Chat with Jane',

                        person: {
                            key: 'current-user-key',
                            name: 'Me',
                            icon: "https://static.vecteezy.com/system/resources/thumbnails/002/002/403/small/man-with-beard-avatar-character-isolated-icon-free-vector.jpg",
                        },
                        messages: [

                            {
                                text: 'Hey, are you free this afternoon?',
                                timestamp: Date.now() - 60000,
                                person: {
                                    key: 'john-key',
                                    name: 'John',
                                    icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjRzkEEVtiPqqpsIeWxJzt-6pieZh0gl5wWncL3yQA1XDIZKWtEcYwAvp5qwbMnDWOAQI&usqp=CAU",
                                },
                            },
                            {
                                text: "I am, what's up?",
                                timestamp: Date.now() - 30000,
                                person: {
                                    key: 'jane-key',
                                    name: 'Jane',
                                    icon: "https://png.pngtree.com/png-clipart/20231019/original/pngtree-user-profile-avatar-png-image_13369988.png",
                                },
                            },
                        ],
                    },
                    pressAction: {
                        id: 'default',
                    },
                    actions: [
                        {
                            title: 'Reply',
                            pressAction: { id: 'reply' },
                            input: { placeholder: 'Type your reply...' },
                        },
                        {
                            title: 'Dismiss',
                            pressAction: { id: 'dismiss' },
                        },
                    ],
                },
            });

        } catch (error) {
            console.error('Error displaying messaging notification:', error);
        }
    }
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={onSimpleNotification} style={styles.button}>
                <Text style={styles.buttonText}>Simple Notification</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onBigPictureNotification} style={styles.button}>
                <Text style={styles.buttonText}>Big Picture Notification</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onActionableNotification} style={styles.button}>
                <Text style={styles.buttonText}>Actionable Notification</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onMessagingNotification} style={styles.button}>
                <Text style={styles.buttonText}>Messaging Notification</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
    button: {
        marginVertical: 8,
        height: 50,
        width: '80%',
        maxWidth: 250,
        backgroundColor: SecondaryColor,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
    },
    buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});

export default DisplayNotification;
