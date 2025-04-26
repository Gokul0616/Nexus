import React, { useEffect, useState, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Appearance,
  Keyboard,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

/**
 * Icon config per type
 */
const ICON_CONFIG = {
  warning: { name: 'warning-outline', size: 28, color: '#FF9500' },
  success: { name: 'checkmark-circle-outline', size: 28, color: '#28A745' },
  error: { name: 'close-circle-outline', size: 28, color: '#FF3B30' },
  notification: { name: 'notifications-outline', size: 28, color: '#007AFF' },
};

const AlertBox = ({
  heading,
  message,
  triggerFunction,
  showAlert,
  leftTriggerFunction,
  setShowAlert,


  gender = 'female',





  type = 'warning',
  isRight = true,
  rightButtonText = 'OK',
  isLeft = true,
}) => {

  const { name: iconName, size: iconSize, color: iconColor } =
    ICON_CONFIG[type] || ICON_CONFIG.notification;


  const [theme, setTheme] = useState(Appearance.getColorScheme());

  const [backgroundColor, setBgColor] = useState('#FFF');
  const [textColor, setTextColor] = useState('#000');
  const [messageColor, setMsgColor] = useState('#555');

  const [buttonColor, setBtnColor] = useState(
    gender === 'female' ? '#FE2C55' : '#007AFF'
  );
  const scale = useRef(new Animated.Value(0)).current;


  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(colorScheme);
    });
    return () => sub.remove();
  }, []);


  useEffect(() => {
    if (Keyboard.isVisible && Keyboard.isVisible()) {
      Keyboard.dismiss();
    }
  }, []);


  useEffect(() => {
    if (theme === 'dark') {
      setBgColor('#2C2C2E');
      setTextColor('#FFF');
      setMsgColor('#CCC');
      setBtnColor(gender === 'female' ? '#FF375F' : '#0A84FF');
    } else {
      setBgColor('#FFF');
      setTextColor('#000');
      setMsgColor('#555');
      setBtnColor(gender === 'female' ? '#FE2C55' : '#007AFF');
    }
  }, [theme, gender]);


  useEffect(() => {
    if (showAlert) {
      Animated.spring(scale, {
        toValue: 1,
        friction: 7,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(scale, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  }, [showAlert]);

  if (!showAlert) return null;

  return (
    <Modal transparent visible={ showAlert } animationType="none">
      <View style={ styles.backdrop } />
      <View style={ styles.centeredView }>
        <Animated.View
          style={ [
            styles.modalView,
            { backgroundColor: backgroundColor, transform: [{ scale }] },
          ] }
        >

          <Ionicons
            name={ iconName }
            size={ iconSize }
            color={ iconColor }
            style={ styles.icon }
          />


          <Text style={ [styles.heading, { color: textColor }] }>
            { heading }
          </Text>


          <Text style={ [styles.subheading, { color: messageColor }] }>
            { message }
          </Text>


          { isLeft && (
            <TouchableOpacity
              style={ [styles.primaryButton, { backgroundColor: buttonColor }] }
              onPress={ () => {
                setShowAlert(false);
                leftTriggerFunction && leftTriggerFunction();
              } }
              activeOpacity={ 0.8 }
            >
              <Text style={ styles.primaryButtonText }>Cancel</Text>
            </TouchableOpacity>
          ) }


          { isRight && (
            <TouchableOpacity
              style={ [styles.secondaryButton, { borderColor: buttonColor }] }
              onPress={ triggerFunction }
              activeOpacity={ 0.6 }
            >
              <Text
                style={ [styles.secondaryText, { color: buttonColor }] }
              >
                { rightButtonText }
              </Text>
            </TouchableOpacity>
          ) }
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  centeredView: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: width * 0.7,
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: 'center',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  icon: {
    marginBottom: 8,
  },
  heading: {
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  subheading: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 18,
  },
  primaryButton: {
    width: '100%',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600',
  },
  secondaryButton: {
    paddingVertical: 6,
    borderWidth: 1,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  secondaryText: {
    fontSize: 15,
    fontWeight: '600',
  },
});

export default AlertBox;
