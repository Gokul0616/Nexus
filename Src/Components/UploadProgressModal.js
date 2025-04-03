import React, {useEffect, useRef, useState} from 'react';
import {View, Text, Animated, StyleSheet, Pressable} from 'react-native';
import Modal from 'react-native-modal';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {PrimaryColor} from './CommonData';

const UploadProgressBar = ({
  visible,
  setModalVisible,
  progress,
  setProgress,
}) => {
  const animatedWidth = useRef(new Animated.Value(visible ? 10 : 0)).current;
  const startY = useRef(0);
  const [uploadCompleted, setUploadCompleted] = useState(false);
  const handleTouchStart = e => {
    startY.current = e.nativeEvent.pageY;
  };

  const handleTouchMove = e => {
    const currentY = e.nativeEvent.pageY;
    const deltaY = currentY - startY.current;

    if (deltaY < -30) {
      setModalVisible(false);
    }
  };

  useEffect(() => {
    setUploadCompleted(false);
    if (progress === 100) {
      setTimeout(() => {
        setUploadCompleted(true);
      }, 1000);
      setTimeout(() => {
        setModalVisible(false);
      }, 3000);
      setTimeout(() => {
        setProgress(0);
      }, 5000);
    }
  }, [progress, setModalVisible]);
  React.useEffect(() => {
    if (visible) {
      Animated.timing(animatedWidth, {
        toValue: progress,
        duration: 500,
        useNativeDriver: false,
      }).start();
    }
  }, [progress, visible]);

  const widthInterpolated = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  return (
    <Modal
      isVisible={visible}
      coverScreen={false}
      hasBackdrop={false}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      style={styles.modal}
      animationIn="slideInDown"
      animationOut="slideOutUp">
      <View style={styles.container}>
        <View style={styles.header}>
          {uploadCompleted ? (
            <Text style={styles.text}>Upload Complete</Text>
          ) : (
            <Text style={styles.text}>Uploading 1 video... {progress}%</Text>
          )}
          <Pressable onPress={() => setModalVisible(false)}>
            <Ionicons name="close" size={24} color={PrimaryColor} />
          </Pressable>
        </View>
        <View style={styles.progressBar}>
          <Animated.View
            style={[styles.progressFill, {width: widthInterpolated}]}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-start',
    margin: 0,
  },
  container: {
    marginTop: 50,
    marginHorizontal: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  progressBar: {
    marginTop: 10,
    height: 5,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: PrimaryColor,
  },
});

export default UploadProgressBar;
