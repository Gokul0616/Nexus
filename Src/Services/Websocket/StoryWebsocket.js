import { useEffect, useRef } from 'react';
import { storage } from '../../Components/CommonData';
import { wsUrl } from '../api/EndPoint';
const useStoryWebSocket = (onNewStory) => {
    const socketRef = useRef(null);

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

        socketRef.current = socket;

        socket.onopen = () => {
            //console.log('WebSocket (story) connected');
        };

        socket.onmessage = event => {

            if (event.data.startsWith("NEW_STORY:")) {
                try {
                    const storyJson = event.data.replace("NEW_STORY:", "");
                    const story = JSON.parse(storyJson);
                    onNewStory(story);
                } catch (e) {
                    //console.log('Failed to parse story:', e);
                }
            } else {
                //console.log('Unknown message:', event.data);
            }
        };

        socket.onerror = error => {
            //console.log('WebSocket error:', error.message);
        };

        socket.onclose = event => {
            //console.log('WebSocket closed:', event.code, event.reason);
        };

        return () => {
            socket.close();
        };
    }, [onNewStory]); // only re-creates if onNewStory changes
};

export default useStoryWebSocket;