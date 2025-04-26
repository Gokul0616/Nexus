import React, { useState, useEffect, useRef } from 'react';
import notifee, {
  AndroidImportance,
  EventType,
  AuthorizationStatus
} from '@notifee/react-native';
import { Platform } from 'react-native';

const UploadProgressNotification = ({ visible, progress, setProgress }) => {
  const [channelId, setChannelId] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState(null);
  const notificationTimeout = useRef(null);
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const setupNotifications = async () => {
      try {
        const settings = await notifee.requestPermission();
        setPermissionStatus(settings.authorizationStatus);

        if (settings.authorizationStatus !== AuthorizationStatus.AUTHORIZED) return;

        if (Platform.OS === 'android') {
          await notifee.deleteChannel('upload_progress');

          const cid = await notifee.createChannel({
            id: 'upload_progress_v2',
            name: 'Upload Notifications',
            importance: AndroidImportance.HIGH,
            vibration: false,
            lights: false,
          });
          setChannelId(cid);
        }
      } catch (error) {
        console.error('Notification setup failed:', error);
      }
    };

    setupNotifications();

    return notifee.onForegroundEvent(({ type }) => {
      if (type === EventType.PRESS) {
        console.log('Notification pressed');
      }
    });
  }, []);

  useEffect(() => {
    if (
      !visible ||
      progress < 0 ||
      permissionStatus !== AuthorizationStatus.AUTHORIZED ||
      !channelId
    ) return;

    const showNotification = async () => {
      try {

        await notifee.setNotificationCategories([
          { id: 'upload_category', actions: [] }
        ]);

        await notifee.displayNotification({
          id: 'upload',
          title: progress < 100 ? 'Uploading Video' : 'Upload Complete!',
          body: progress < 100
            ? `${Math.round(progress)}% complete`
            : 'Your video has been uploaded',
          android: {
            channelId,
            smallIcon: 'ic_launcher',
            ongoing: progress < 100,
            progress: {
              max: 100,
              current: progress,
              indeterminate: false,
              onlyAlertOnce: true,
            },
            pressAction: { id: 'default' },
            groupId: 'upload_group',
            groupSummary: true,
          },
          ios: {
            foregroundPresentationOptions: {
              alert: true,
              badge: true,
              sound: false,
            },
          },
        });

      } catch (error) {
        console.error('Failed to show notification:', error);
      }
    };

    showNotification();

    return () => {
      clearTimeout(notificationTimeout.current);
      if (progress < 100 && isMounted.current) {
        notifee.cancelNotification('upload');
      }
    };
  }, [visible, progress, channelId, permissionStatus, setProgress]);

  return null;
};

export default UploadProgressNotification;