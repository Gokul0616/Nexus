import React, { useEffect, useState } from 'react';
import { Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View, Appearance, Keyboard } from 'react-native';

const { width } = Dimensions.get('window');

const AlertBox = ({
  heading,
  message,
  triggerFunction,
  showAlert,
  leftTriggerFunction,
  setShowAlert,
  isRight = false,
  rightButtonText = 'OK',
  isLeft = true,
}) => {
  const [theme, setTheme] = useState(Appearance.getColorScheme());
  const [backgroundColor, setBackgroundColor] = useState('white');
  const [textColor, setTextColor] = useState('black');
  const [messageColor, setMessageColor] = useState('grey');
  const [buttonColor, setButtonColor] = useState('#007AFF');

  useEffect(() => {
    const colorSchemeListener = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(colorScheme);
    });

    return () => colorSchemeListener.remove();
  }, []);
  useEffect(() => {
    if (Keyboard.isVisible()) {
      Keyboard.dismiss();
    }
  }, [])

  useEffect(() => {
    if (theme === 'dark') {
      setBackgroundColor('#333');
      setTextColor('white');
      setMessageColor('lightgrey');
      setButtonColor('#00B0FF');
    } else {
      setBackgroundColor('white');
      setTextColor('black');
      setMessageColor('grey');
      setButtonColor('#007AFF');
    }
  }, [theme]);

  if (!showAlert) return null;

  return (
    <Modal
      transparent
      animationType="none"
      visible={showAlert}
      style={styles.modal}
      onRequestClose={() => setShowAlert(false)}>
      <View style={[styles.overlay, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
        <View style={[styles.alertContainer, { backgroundColor }]}>
          <Text style={[styles.heading, { color: textColor }]}>{heading}</Text>
          <View style={styles.spacing} />
          <Text style={[styles.message, { color: messageColor }]}>{message}</Text>
          <View style={styles.largeSpacing} />
          <View style={styles.divider} />
          <View style={styles.buttonRow}>
            {isRight && (
              <TouchableOpacity
                onPress={triggerFunction}
                style={[styles.button, styles.rightButton, isRight && { borderRightWidth: 0 }]}>
                <Text style={[styles.buttonText, { color: buttonColor }]}>{rightButtonText}</Text>
              </TouchableOpacity>
            )}
            {isLeft && (
              <TouchableOpacity
                onPress={() => {
                  setShowAlert(false);
                  if (leftTriggerFunction) {
                    leftTriggerFunction();
                  }
                }}
                style={styles.button}>
                <Text style={[styles.buttonText, { color: buttonColor }]}>Cancel</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertContainer: {
    width: width * 0.75,
    padding: 20,
    borderRadius: 10,
  },
  heading: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Roboto-Medium',
  },
  spacing: {
    height: 10,
  },
  largeSpacing: {
    height: 20,
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Roboto-Medium',
  },
  divider: {
    height: 1,
    backgroundColor: '#DDDDDD',
    marginVertical: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    alignItems: 'center',
  },
  rightButton: {
    borderRightWidth: 1,
    borderRightColor: '#DDDDDD',
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
  },
});

export default AlertBox;