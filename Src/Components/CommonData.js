export const AppName = 'Nexus';
import axios from 'axios';
export const PrimaryColor = '#0887ff'; // utils/relativeTime.js
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
import {getLinkPreview} from 'link-preview-js';

export const fetchLinkPreview = async url => {
  try {
    const previewData = await getLinkPreview(url);
    return previewData;
  } catch (error) {
    console.error('Error fetching link preview:', error.message);
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
    console.error('Error fetching city data:', error.message);
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

import {MMKV} from 'react-native-mmkv';

export const storage = new MMKV();
