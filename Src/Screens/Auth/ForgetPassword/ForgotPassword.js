import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Vibration,
  Keyboard,
} from 'react-native';
import {TouchableRipple} from 'react-native-paper';
import {PrimaryColor} from '../../../Components/CommonData';
import apiClient from '../../../Services/api/apiInterceptor';
import CustomHeader from '../../../Components/CustomHeader';
import {useNavigation} from '@react-navigation/native';
import CustomLoadingIndicator from '../../../Components/CustomLoadingIndicator';
import AlertBox from '../../../Components/AlertMessage';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigation = useNavigation();
  const [isMessage, setIsMessage] = useState({
    message: '',
    heading: '',
    isRight: false,
    rightButtonText: 'OK',
    triggerFunction: () => {},
    setShowAlert: () => {},
    showAlert: false,
    leftTriggerFunction: () => {},
  });
  const closeAlert = () => {
    setIsMessage(prev => ({...prev, showAlert: false}));
  };
  const validateEmail = email => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError('Please enter your email address.');
      Vibration.vibrate(100);
      return;
    } else if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      Vibration.vibrate(100);
      return;
    }

    setError('');
    await verifyData();
  };
  const verifyData = async () => {
    try {
      setLoading(true);
      Keyboard.dismiss();
      const response = await apiClient.post('/user/auth/forgot-password', {
        email: email.toLowerCase(),
      });
      console.log('Success:', response.data);
      setIsMessage({
        message: response.data.message || 'Email sent successfully',
        heading: 'Alert',
        isRight: false,
        rightButtonText: 'OK',
        triggerFunction: () => {},
        setShowAlert: () => {
          isMessage.setShowAlert(false);
        },
        showAlert: true,
      });
      setEmail('');
    } catch (error) {
      if (error.response) {
        console.log('Error:', error.response.data);
        setIsMessage({
          message: error?.response?.data || 'Email not found',
          heading: 'Alert',
          isRight: false,
          rightButtonText: 'OK',
          triggerFunction: () => {},
          setShowAlert: () => {
            isMessage.setShowAlert(false);
          },
          showAlert: true,
        });
      } else if (error.request) {
        console.log(error.request);
        setIsMessage({
          message: error?.request || 'Something went wrong',
          heading: 'Alert',
          isRight: false,
          rightButtonText: 'OK',
          triggerFunction: () => {},
          setShowAlert: () => {
            isMessage.setShowAlert(false);
          },
          showAlert: true,
        });
      } else {
        console.log('Error', error.message);
        setIsMessage({
          message: error?.message || 'Something went wrong',
          heading: 'Alert',
          isRight: false,
          rightButtonText: 'OK',
          triggerFunction: () => {},
          setShowAlert: () => {
            isMessage.setShowAlert(false);
          },
          showAlert: true,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CustomHeader navigation={navigation} />
      {loading && (
        <View style={styles.loadingIndicator}>
          <CustomLoadingIndicator />
        </View>
      )}
      <AlertBox
        heading={isMessage.heading}
        message={isMessage.message}
        setShowAlert={closeAlert}
        showAlert={isMessage.showAlert}
        triggerFunction={isMessage.triggerFunction}
        isRight={isMessage.isRight}
        leftTriggerFunction={isMessage.leftTriggerFunction}
        rightButtonText={isMessage.rightButtonText}
      />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Text style={styles.title}>Forgot Password</Text>
        <Text style={styles.instructions}>
          Enter your email address below and we'll send you instructions to
          reset your password.
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={text => setEmail(text)}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TouchableRipple
          rippleColor="rgba(0, 0, 0, .15)"
          style={styles.button}
          onPress={handleResetPassword}>
          <Text style={styles.buttonText}>Reset Password</Text>
        </TouchableRipple>
      </KeyboardAvoidingView>
    </>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  instructions: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#555',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  button: {
    backgroundColor: PrimaryColor,
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingIndicator: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    zIndex: 100,
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
