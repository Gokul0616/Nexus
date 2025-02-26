import React, {useState, useEffect} from 'react';
import {Image, Dimensions, View, Text, StyleSheet} from 'react-native';

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

  useEffect(() => {
    setErrorMsg(null);
    if (!isConnected) {
      setErrorMsg('No Internet Connection');
      return;
    }
    Image.getSize(
      uri,
      (width, height) => {
        setImgHeight((height * screenWidth) / width);
      },
      error => {
        setErrorMsg(error.message || 'Error loading image');
      },
    );
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
      source={{uri}}
      style={[{width: screenWidth, height: imgHeight}, style]}
      resizeMode={resizeMode}
      onLoadStart={() => {
        if (item) setLoadingPosts(prev => ({...prev, [item.id]: true}));
      }}
      onLoadEnd={() => {
        if (item) setLoadingPosts(prev => ({...prev, [item.id]: false}));
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
