import React, {useState, useRef, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  BackHandler,
  ActivityIndicator,
  Keyboard,
  Linking,
  Share,
  Platform,
  SafeAreaView,
  TouchableWithoutFeedback,
} from 'react-native';
import {WebView} from 'react-native-webview';
import Icon from 'react-native-vector-icons/Feather';
import AlertBox from './AlertMessage';
import {PrimaryColor} from './CommonData';
import {useFocusEffect} from '@react-navigation/native';

export const WebScreen = ({route, navigation}) => {
  const initialUrl = route.params.url;
  // State for the actual URL the WebView loads.
  const [currentUrl, setCurrentUrl] = useState(initialUrl);
  // State for the address bar input.
  const [inputUrl, setInputUrl] = useState(initialUrl);
  const [progress, setProgress] = useState(0);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageTitle, setPageTitle] = useState('');
  // Key to force WebView re-rendering on URL change.
  const [webViewKey, setWebViewKey] = useState(0);
  const webViewRef = useRef(null);
  const animatedProgress = useRef(new Animated.Value(0)).current;
  const [isInputFocused, setIsInputFocused] = useState(false);

  const [isMessage, setIsMessage] = useState({
    message: '',
    heading: '',
    isRight: false,
    rightButtonText: 'OK',
    triggerFunction: () => {},
    setShowAlert: () => {},
    showAlert: false,
  });

  const closeAlert = () => {
    setIsMessage(prev => ({...prev, showAlert: false}));
  };

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
    }, [canGoBack, navigation]),
  );

  const handleReload = () => {
    setError(null);
    webViewRef.current?.reload();
  };

  const handleShare = async () => {
    try {
      await Share.share({message: currentUrl});
    } catch (err) {
      setIsMessage({
        message: 'Unable to share the URL.',
        heading: 'Error',
        isRight: false,
        rightButtonText: 'OK',
        triggerFunction: () => {},
        setShowAlert: () => setIsMessage(prev => ({...prev, showAlert: false})),
        showAlert: true,
      });
    }
  };

  const openInExternalBrowser = async () => {
    try {
      await Linking.openURL(currentUrl);
    } catch (err) {
      setIsMessage({
        message: err.message || 'Cannot open this URL in browser.',
        heading: 'Error',
        isRight: false,
        rightButtonText: 'OK',
        triggerFunction: () => {},
        setShowAlert: () => setIsMessage(prev => ({...prev, showAlert: false})),
        showAlert: true,
      });
    }
  };

  const onUrlSubmit = () => {
    let newUrl = inputUrl.trim();
    if (!newUrl) {
      // If input is empty, revert to last valid URL.
      setInputUrl(currentUrl);
      return;
    }
    if (!/^https?:\/\//i.test(newUrl)) {
      newUrl = 'http://' + newUrl;
    }
    setCurrentUrl(newUrl);
    setInputUrl(newUrl);
    setWebViewKey(prev => prev + 1);
    Keyboard.dismiss();
  };

  const injectedJS = `
    (function() {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        title: document.title
      }));
    })();
  `;

  return (
    <SafeAreaView style={styles.safeContainer}>
      <AlertBox
        heading={isMessage.heading}
        message={isMessage.message}
        setShowAlert={closeAlert}
        showAlert={isMessage.showAlert}
        triggerFunction={isMessage.triggerFunction}
        isRight={isMessage.isRight}
        rightButtonText={isMessage.rightButtonText}
      />
      {/* Wrap only the header with TouchableWithoutFeedback to dismiss the keyboard */}
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.header}>
          {!isInputFocused && (
            <>
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
                onPress={() => {
                  if (canGoForward && webViewRef.current) {
                    webViewRef.current.goForward();
                  }
                }}
                style={[styles.iconButton, {opacity: canGoForward ? 1 : 0.3}]}>
                <Icon name="arrow-right" size={20} color="#333" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleReload}
                style={styles.iconButton}>
                <Icon name="rotate-cw" size={20} color="#333" />
              </TouchableOpacity>
            </>
          )}
          <TextInput
            style={[
              styles.addressBar,
              isInputFocused && styles.addressBarFocused,
            ]}
            value={inputUrl}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            onChangeText={text => {
              setInputUrl(text);
              if (error) setError(null);
            }}
            onSubmitEditing={onUrlSubmit}
            keyboardType="url"
            cursorColor={PrimaryColor}
            returnKeyType="go"
            clearButtonMode="while-editing"
          />
          {isInputFocused && (
            <TouchableOpacity
              onPress={() => {
                setIsInputFocused(false);
                Keyboard.dismiss();
              }}
              style={styles.iconButton}>
              <Icon name="x" size={22} color={PrimaryColor} />
            </TouchableOpacity>
          )}
          {!isInputFocused && (
            <>
              <TouchableOpacity onPress={handleShare} style={styles.iconButton}>
                <Icon name="share-2" size={20} color="#333" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={openInExternalBrowser}
                style={styles.iconButton}>
                <Icon name="external-link" size={20} color="#333" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.iconButton}>
                <Icon name="x" size={22} color={PrimaryColor} />
              </TouchableOpacity>
            </>
          )}
        </View>
      </TouchableWithoutFeedback>
      <View style={styles.container}>
        {/* Animated progress bar */}
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

        <WebView
          key={webViewKey}
          ref={webViewRef}
          source={{uri: currentUrl}}
          style={styles.webview}
          onLoadStart={() => {
            setIsLoading(true);
            setError(null);
          }}
          onLoadProgress={({nativeEvent}) => {
            setProgress(nativeEvent.progress);
            animateProgress(nativeEvent.progress);
          }}
          onLoadEnd={() => setIsLoading(false)}
          onError={syntheticEvent => {
            const {nativeEvent} = syntheticEvent;
            setError(nativeEvent);
          }}
          onHttpError={syntheticEvent => {
            const {nativeEvent} = syntheticEvent;
            setError(nativeEvent);
          }}
          onNavigationStateChange={navState => {
            setCurrentUrl(navState.url);
            setInputUrl(navState.url);
            setCanGoBack(navState.canGoBack);
            setCanGoForward(navState.canGoForward);
          }}
          injectedJavaScript={injectedJS}
          onMessage={event => {
            try {
              const data = JSON.parse(event.nativeEvent.data);
              if (data.title) {
                setPageTitle(data.title);
              }
            } catch (e) {
              // Ignore JSON parse errors.
            }
          }}
          pullToRefreshEnabled={Platform.OS === 'android'}
          contentInsetAdjustmentBehavior="automatic"
          // For iOS, dismiss the keyboard when scrolling
          keyboardDismissMode="on-drag"
        />

        {/* Loading overlay */}
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={PrimaryColor} />
          </View>
        )}

        {/* Error overlay */}
        {error && (
          <View style={styles.errorOverlay}>
            <Text style={styles.errorText}>Failed to load the page.</Text>
            <Text style={styles.errorDetail}>
              {error.description || 'An unexpected error occurred.'}
            </Text>
            <TouchableOpacity onPress={handleReload} style={styles.retryButton}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
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
    paddingVertical: 8,
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
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 14,
    color: '#333',
    marginHorizontal: 6,
  },
  webview: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
    fontWeight: '600',
  },
  errorDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: PrimaryColor,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 5,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default WebScreen;
