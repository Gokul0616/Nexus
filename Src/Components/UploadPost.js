import * as mime from 'mime';
import {Platform} from 'react-native';
import apiClient from '../Services/api/apiInterceptor';

export const uploadVideoAndThumbnail = async (
  videoUri,
  thumbnailUri,
  setProgress,
) => {
  try {
    let videoFileType = mime.getType(videoUri) || 'video/mp4';
    let thumbFileType = mime.getType(thumbnailUri) || 'image/jpeg';

    let videoExtension = videoFileType.split('/')[1] || 'mp4';
    let thumbExtension = thumbFileType.split('/')[1] || 'jpg';
    const formattedVideoUri = 'file://' + videoUri;
    const formattedThumbnailUri = thumbnailUri;

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

    const response = await apiClient.post('posts/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
      },
      onUploadProgress: progressEvent => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total,
        );
        setProgress(percentCompleted); // Update progress state
      },
    });

    return response.data;
  } catch (error) {
    setProgress(0);
    return error;
  }
};
