export const AppName = 'Nexus';
import { Platform } from 'react-native'; import mime from 'mime'; // install with: npm install mime

import axios from 'axios';
export const PrimaryColor = '#0887ff';
export const SecondaryColor = '#FF004F';
export const getRelativeTime = timestamp => {
  // Simulated current time to match the test data
  const simulatedNow = new Date('2025-03-03T10:10:00Z'); // Set this to match your test data
  const messageDate = new Date(timestamp);

  const secondsAgo = Math.floor((simulatedNow - messageDate) / 1000);
  const minutesAgo = Math.floor(secondsAgo / 60);
  const hoursAgo = Math.floor(minutesAgo / 60);
  const daysAgo = Math.floor(hoursAgo / 24);

  if (secondsAgo < 60) {
    return 'Just now';
  } else if (minutesAgo < 60) {
    return `${minutesAgo}m ago`;
  } else if (hoursAgo < 24) {
    return `${hoursAgo}h ago`;
  } else if (daysAgo < 7) {
    return `${daysAgo}d ago`;
  } else {
    // Fallback to full date if older than 7 days
    return messageDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }
};
// linkPreviewHelper.js
import { getLinkPreview } from 'link-preview-js';

export const fetchLinkPreview = async url => {
  try {
    const previewData = await getLinkPreview(url);
    return previewData;
  } catch (error) {
    // console.error('Error fetching link preview:', error.message);
    return null;
  }
};
export const formatNumber = num => {
  if (num >= 1e9) {
    return (num / 1e9).toFixed(1).replace(/\.0$/, '') + 'B';
  }
  if (num >= 1e6) {
    return (num / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1e3) {
    return (num / 1e3).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toString();
};

export const fetchCityData = async city => {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?q=${city}&format=json`,
      {
        headers: {
          'User-Agent': 'MyAppName/1.0 (contact@myapp.com)',
          Referer: 'https://yourdomain.com',
        },
      },
    );
    if (response.data.length > 0) {
      return response.data;
    }
    return null;
  } catch (error) {
    // console.error('Error fetching city data:', error.message);
    return null;
  }
};

export const formatTime = ms => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
    2,
    '0',
  )}`;
};

import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV();


import { captureRef } from 'react-native-view-shot';
import { FFmpegKit, FFprobeKit } from 'ffmpeg-kit-react-native';
import RNFS from 'react-native-fs';
import apiClient from '../Services/api/apiInterceptor';
import CustomToast from '../Services/Hooks/Customtoast/CustomToast';

/**
 * Exports media based on its type.
 * @param {Object} media - The media object with { uri, type }.
 * @param {React.RefObject} ref - The ref to the view (for screenshots).
 * @returns {Promise<string|null>} - The URI of the exported media or null on failure.
 */
export const exportMedia = async (media, ref, transform) => {
  if (!media?.uri || !media?.type || !ref?.current) {
    console.warn("⚠️ Missing ref or media data.");
    return null;
  }

  if (media.type.startsWith('image')) {
    try {
      const uri = await captureRef(ref.current, {
        format: 'jpg',
        quality: 0.8,
      });
      return uri;
    } catch (error) {
      console.error('❌ Failed to capture image:', error);
      return null;
    }
  }

  if (media.type.startsWith("video")) {
    try {
      const { scale, translateX, translateY, rotation } = transform;
      // Fallback to 0 if rotation is undefined.
      const rotationValue = rotation !== undefined ? rotation : 0;

      const originalUri = media.uri.replace("file://", "");
      const tempExists = await RNFS.exists(originalUri);
      if (!tempExists) {
        console.error("❌ Original media file does not exist:", originalUri);
        return null;
      }

      // Copy file for FFmpeg access.
      const inputPath = `${RNFS.CachesDirectoryPath}/ffmpeg_input_${Date.now()}.mp4`;
      await RNFS.copyFile(originalUri, inputPath);

      const outputPath = `${RNFS.CachesDirectoryPath}/export_${Date.now()}.mp4`;
      const safeUri = media.uri.replace("file://", "").replace(/'/g, "'\\''").replace(/ /g, '\\ ');
      const safeOutput = outputPath.replace(/'/g, "'\\''").replace(/ /g, '\\ ');

      // Canvas and video scaling settings.
      const canvasWidth = 1080;
      const canvasHeight = 1920;
      const scaledWidth = media.width * scale;
      const scaledHeight = media.height * scale;

      // Pre-rotation offset (if needed)
      const offsetX = translateX + (canvasWidth - scaledWidth) / 2;
      const offsetY = translateY + (canvasHeight - scaledHeight) / 2;

      // Retrieve video duration
      const info = await FFprobeKit.getMediaInformation(media.uri);
      const duration = parseFloat(info.getMediaInformation()?.getDuration() > 15 ? 15 : info.getMediaInformation()?.getDuration() || '15');

      // Calculate required padding so the video does not get clipped during rotation.
      const paddedSize = Math.ceil(Math.sqrt(scaledWidth ** 2 + scaledHeight ** 2));
      const padX = Math.floor((paddedSize - scaledWidth) / 2);
      const padY = Math.floor((paddedSize - scaledHeight) / 2);

      // Build the FFmpeg command.
      // The rotated output's dimensions are available as overlay_w and overlay_h.
      const command = `-y -r 30 -t ${duration} -i '${safeUri}' -filter_complex `
        + `"[0:v]scale=${scaledWidth}:${scaledHeight},pad=${paddedSize}:${paddedSize}:${padX}:${padY}:color=black,`
        + `rotate=${rotationValue}:ow=rotw(${rotationValue}):oh=roth(${rotationValue}):c=none[v];`
        + `color=black:s=${canvasWidth}x${canvasHeight}[bg];`
        + `[bg][v]overlay=(((${canvasWidth}-overlay_w)/2)+${translateX}):(((`
        + `${canvasHeight}-overlay_h)/2)+${translateY})" `
        + `-c:v libx264 -preset ultrafast -crf 23 -c:a copy -movflags +faststart -shortest '${safeOutput}'`;

      const session = await FFmpegKit.execute(command);
      const returnCode = await session.getReturnCode();

      if (returnCode.isValueSuccess()) {
        return `file://${outputPath}`;
      } else {
        console.error("❌ FFmpeg failed:", await session.getAllLogsAsString());
        return null;
      }
    } catch (error) {
      console.error("❌ Error during video processing:", error);
      return null;
    }
  }


  return null;
};
export const uploadStory = async (mediaUri, transform) => {
  if (!mediaUri) throw new Error('No media selected');

  const token = storage.getString('token');
  const userId = JSON.parse(storage.getString('profile')).userId;

  const uri = Platform.OS === 'ios' ? mediaUri.replace('file://', '') : mediaUri;
  const fileName = uri.split('/').pop();
  const mimeType = mime.getType(uri) || 'image/jpeg';

  const formData = new FormData();
  formData.append('file', {
    uri,
    name: fileName,
    type: mimeType,
  });
  formData.append('userId', userId.toString());
  formData.append('placement', JSON.stringify(transform));


  console.log(formData)
  try {
    const response = await apiClient.post('stories', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Upload failed:', error.response?.data || error.message);
    throw error;
  }
};
export const saveFCMToken = (token) => {
  apiClient.post("user/saveFcmToken", {
    fcmToken: token
  }).then(res => {
    // console.log(res)
  }).catch(err => {
    CustomToast.show(err.response?.data?.error || "Unexpected error occurred while saving FCM token" || err?.message)
  })
}