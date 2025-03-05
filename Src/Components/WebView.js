import React, {useState, useRef, useCallback} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  BackHandler,
} from 'react-native';
import {WebView} from 'react-native-webview';
import Icon from 'react-native-vector-icons/Feather';
import {PrimaryColor} from './CommonData';
import {useFocusEffect} from '@react-navigation/native';

export const WebScreen = ({route, navigation}) => {
  const {url} = route.params;
  const [currentUrl, setCurrentUrl] = useState(url);
  const [progress, setProgress] = useState(0);
  const [canGoBack, setCanGoBack] = useState(false);
  const webViewRef = useRef(null);
  const animatedProgress = useRef(new Animated.Value(0)).current;

  const animateProgress = value => {
    Animated.timing(animatedProgress, {
      toValue: value,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (canGoBack && webViewRef.current) {
          webViewRef.current.goBack();
        } else {
          navigation.goBack();
        }
        return true;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );
      return () => subscription.remove();
    }, [canGoBack]),
  );

  return (
    <View style={styles.container}>
      {progress < 1 && (
        <Animated.View
          style={[
            styles.progressBar,
            {
              width: animatedProgress.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      )}

      {/* Browser Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            if (canGoBack && webViewRef.current) {
              webViewRef.current.goBack();
            } else {
              navigation.goBack();
            }
          }}
          style={styles.iconButton}>
          <Icon name="arrow-left" size={20} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => webViewRef.current?.reload()}
          style={styles.iconButton}>
          <Icon name="rotate-cw" size={20} color="#333" />
        </TouchableOpacity>
        <TextInput
          style={styles.addressBar}
          value={currentUrl}
          editable={false}
        />
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.iconButton}>
          <Icon name="x" size={22} color={PrimaryColor} />
        </TouchableOpacity>
      </View>

      {/* WebView */}
      <WebView
        ref={webViewRef}
        source={{uri: url}}
        style={styles.webview}
        onLoadProgress={({nativeEvent}) => {
          setProgress(nativeEvent.progress);
          animateProgress(nativeEvent.progress);
        }}
        onNavigationStateChange={navState => {
          setCurrentUrl(navState.url);
          setCanGoBack(navState.canGoBack);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  progressBar: {
    height: 3,
    backgroundColor: PrimaryColor,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1000,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  iconButton: {
    padding: 8,
  },
  addressBar: {
    flex: 1,
    height: 35,
    backgroundColor: '#eee',
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 14,
    color: '#333',
    marginHorizontal: 10,
  },
  webview: {
    flex: 1,
    marginTop: 3,
  },
});
