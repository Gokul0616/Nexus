import * as mime from 'mime';
import {Platform} from 'react-native';
import apiClient from '../Services/api/apiInterceptor';

export const uploadVideoAndThumbnail = async (videoUri, thumbnailUri) => {
  try {
    let videoFileType = mime.getType(videoUri) || 'video/mp4';
    let thumbFileType = mime.getType(thumbnailUri) || 'image/jpeg';

    let videoExtension = videoFileType.split('/')[1];
    if (videoExtension === 'quicktime') {
      videoExtension = 'mov';
    } else if (!['mp4', 'mov', 'avi', 'mkv'].includes(videoExtension)) {
      videoExtension = 'mp4';
    }

    let thumbExtension = thumbFileType.split('/')[1] || 'jpg';

    const formattedVideoUri = 'file://' + videoUri;
    const formattedThumbnailUri = 'file://' + thumbnailUri;

    const videoId = `video_${Date.now()}`;

    const formData = new FormData();
    formData.append('video', {
      uri: formattedVideoUri,
      type: videoFileType,
      name: `${videoId}.${videoExtension}`,
    });
    formData.append('thumbnail', {
      uri: formattedThumbnailUri,
      type: thumbFileType,
      name: `thumbnail-${videoId}.${thumbExtension}`,
    });

    console.log('Uploading files:', formData);
    const response = await apiClient.post('posts/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    // console.error('Video upload failed:', error);
    if (error.response) {
      // console.error('Error Response Data:', error.response.data);
      // console.error('Error Status:', error.response.status);
    }
    return null;
  }
};
