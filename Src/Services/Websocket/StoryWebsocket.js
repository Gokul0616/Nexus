import React, { useEffect, useRef, useState } from 'react';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { storage } from '../../Components/CommonData';

// const StoryWebSocket = ({ onNewStory }) => {
//     const [storyLog, setStoryLog] = useState([]);
//     useEffect(() => {
//         const token = storage.getString('token');
//         const socket = new WebSocket(
//             `ws://192.168.1.19:8080/api/v1/ws?token=${token}`,
//             null,
//             {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             },
//         );


//         socket.onopen = () => {
//             console.log('WebSocket (story) connected');
//             setStoryLog(prev => [
//                 ...prev,
//                 { type: 'info', text: 'Connected to story WebSocket.' },
//             ]);
//         };

//         socket.onmessage = event => {
//             try {
//                 if (event.data.startsWith("NEW_STORY:")) {
//                     const storyJson = event.data.replace("NEW_STORY:", "");
//                     const story = JSON.parse(storyJson);
//                     console.log('New story received: ', story);
//                     setStoryLog(prev => [...prev, { type: 'story', data: story }]);
//                 } else {
//                     console.log('Unknown message:', event.data);
//                 }
//             } catch (error) {
//                 console.log('Invalid story message format:', event.data);
//                 setStoryLog(prev => [...prev, { type: 'error', text: event.data }]);
//             }
//         };


//         socket.onerror = error => {
//             console.log('Story WebSocket error:', error.message);
//             setStoryLog(prev => [
//                 ...prev,
//                 { type: 'error', text: `Error: ${error.message}` },
//             ]);
//         };

//         socket.onclose = event => {
//             console.log('Story WebSocket closed:', event.code, event.reason);
//             setStoryLog(prev => [
//                 ...prev,
//                 { type: 'info', text: 'Disconnected from story WebSocket.' },
//             ]);
//         };

//         return () => {
//             socket.close();
//         };
//     }, [onNewStory]);
//     useEffect(() => {
//         const latestStories = storyLog.filter(log => log.type === 'story');
//         latestStories.forEach(log => {
//             onNewStory(log.data);
//         });
//         if (latestStories.length > 0) {
//             setStoryLog(prev => prev.filter(log => log.type !== 'story'));
//         }
//     }, [storyLog, onNewStory]);

//     return null;
// };

// export default StoryWebSocket;

const useStoryWebSocket = (onNewStory) => {
    const socketRef = useRef(null);

    useEffect(() => {
        const token = storage.getString('token');
        const socket = new WebSocket(
            `ws://192.168.1.19:8080/api/v1/ws?token=${token}`,
            null,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );

        socketRef.current = socket;

        socket.onopen = () => {
            console.log('WebSocket (story) connected');
        };

        socket.onmessage = event => {
            if (event.data.startsWith("NEW_STORY:")) {
                try {
                    const storyJson = event.data.replace("NEW_STORY:", "");
                    const story = JSON.parse(storyJson);
                    onNewStory(story);
                } catch (e) {
                    console.log('Failed to parse story:', e);
                }
            } else {
                console.log('Unknown message:', event.data);
            }
        };

        socket.onerror = error => {
            console.log('WebSocket error:', error.message);
        };

        socket.onclose = event => {
            console.log('WebSocket closed:', event.code, event.reason);
        };

        return () => {
            socket.close();
        };
    }, [onNewStory]); // only re-creates if onNewStory changes
};

export default useStoryWebSocket;