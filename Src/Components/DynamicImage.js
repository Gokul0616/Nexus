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
  const [cachedUri, setCachedUri] = useState(null);

  useEffect(() => {
    setErrorMsg(null);

    if (!uri) {
      setErrorMsg('Invalid Image URL');
      return;
    }

    const fileName = md5(uri) + '.jpg';
    const cacheDir = RNFS.CachesDirectoryPath;
    const filePath = `${cacheDir}/${fileName}`;

    const updateImage = () => {
      if (!isConnected) {
        setErrorMsg('No Internet Connection');
        return;
      }

      RNFS.downloadFile({fromUrl: uri, toFile: filePath})
        .promise.then(result => {
          if (result.statusCode === 200) {
            const localUri = `file://${filePath}`;
            setCachedUri(localUri);
            Image.getSize(
              localUri,
              (width, height) => {
                setImgHeight((height * screenWidth) / width);
              },
              err => {
                console.warn('Error getting size from new image:', err);
                setErrorMsg('Error loading new image');
              },
            );
          } else {
            setErrorMsg('Failed to download image');
          }
        })
        .catch(e => {
          // console.error('Error updating cached image:', e);
          setErrorMsg('Error updating image');
        });
    };

    RNFS.exists(filePath)
      .then(exists => {
        if (exists) {
          RNFS.stat(filePath)
            .then(stat => {
              const lastModified = new Date(stat.mtime).getTime();
              fetch(uri, {method: 'HEAD'})
                .then(response => {
                  const remoteLastModified = new Date(
                    response.headers.get('Last-Modified'),
                  ).getTime();
                  if (
                    !remoteLastModified ||
                    remoteLastModified > lastModified
                  ) {
                    updateImage();
                  } else {
                    setCachedUri(`file://${filePath}`);
                  }
                })
                .catch(() => {
                  setCachedUri(`file://${filePath}`);
                });
            })
            .catch(() => updateImage());
        } else {
          updateImage();
        }
      })
      .catch(() => updateImage());
  }, [uri, isConnected]);

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
          setLoadingPosts(prev => ({...prev, [item.id]: true}));
        }
      }}
      onLoadEnd={() => {
        if (item) {
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
