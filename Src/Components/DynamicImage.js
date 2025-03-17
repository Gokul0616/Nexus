import React, {useState, useEffect} from 'react';
import {Image, Dimensions, View, Text, StyleSheet} from 'react-native';
import RNFS from 'react-native-fs';
import md5 from 'md5';

const {width: screenWidth} = Dimensions.get('window');

const DynamicImage = ({
  uri,
  style,
  resizeMode = 'contain',
  item,
  isConnected,
  setLoadingPosts,
  ...props
}) => {
  const [imgHeight, setImgHeight] = useState(screenWidth);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [cachedUri, setCachedUri] = useState(null);

  useEffect(() => {
    setErrorMsg(null);
    // If we already have a cached URI, use it
    if (cachedUri) {
      try {
        Image.getSize(
          cachedUri,
          (width, height) => {
            setImgHeight((height * screenWidth) / width);
          },
          err => {
            console.warn('Error getting size from cached image:', err);
            setErrorMsg(err.message || 'Error loading cached image');
          },
        );
      } catch (err) {
        console.warn('Cached image error:', err);
        setErrorMsg(err.message);
      }
      return;
    }

    // Generate a safe filename using MD5 hash of the URI
    const fileName = md5(uri) + '.jpg';
    const cacheDir = RNFS.CachesDirectoryPath;
    const filePath = `${cacheDir}/${fileName}`;

    // Ensure the cache directory exists
    RNFS.mkdir(cacheDir)
      .then(() => RNFS.exists(filePath))
      .then(exists => {
        if (exists) {
          const localUri = `file://${filePath}`;
          setCachedUri(localUri);
          Image.getSize(
            localUri,
            (width, height) => {
              setImgHeight((height * screenWidth) / width);
            },
            err => {
              console.warn('Error getting size from local file:', err);
              setErrorMsg(err.message || 'Error loading cached image');
            },
          );
        } else {
          if (!isConnected) {
            setErrorMsg('No Internet Connection');
            return;
          }
          // Get size from the network URL first
          Image.getSize(
            uri,
            (width, height) => {
              setImgHeight((height * screenWidth) / width);
              // Download and cache the image
              RNFS.downloadFile({
                fromUrl: uri,
                toFile: filePath,
              })
                .promise.then(result => {
                  if (result && result.statusCode === 200) {
                    const localUri = `file://${filePath}`;
                    setCachedUri(localUri);
                  } else {
                    // Fall back to network URL if download fails
                    setCachedUri(uri);
                  }
                })
                .catch(e => {
                  console.error('Error caching image:', e);
                  setCachedUri(uri);
                });
            },
            error => {
              setErrorMsg(error.message || 'Error loading image');
            },
          );
        }
      })
      .catch(err => {
        console.error('Error ensuring cache directory:', err);
        setErrorMsg(err.message);
      });
  }, [uri, isConnected, cachedUri]);

  if (errorMsg) {
    return (
      <View
        style={[
          {width: screenWidth, height: imgHeight},
          style,
          styles.errorContainer,
        ]}>
        <Text style={styles.errorText}>{errorMsg}</Text>
      </View>
    );
  }
  return (
    <Image
      source={{uri: cachedUri || uri}}
      style={[{width: screenWidth, height: imgHeight}, style]}
      resizeMode={resizeMode}
      onLoadStart={() => {
        if (item) {
          setLoaded(false);
          setLoadingPosts(prev => ({...prev, [item.id]: true}));
        }
      }}
      onLoadEnd={() => {
        if (item) {
          setLoaded(true);
          setLoadingPosts(prev => ({...prev, [item.id]: false}));
        }
      }}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 10,
  },
  errorText: {
    color: '#f00',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default DynamicImage;
