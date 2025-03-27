import {CommonActions, useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Vibration,
  Keyboard,
} from 'react-native';
import {TouchableRipple} from 'react-native-paper';
import {AppName, PrimaryColor, storage} from '../../Components/CommonData';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AlertBox from '../../Components/AlertMessage';
import CustomLoadingIndicator from '../../Components/CustomLoadingIndicator';
import apiClient from '../../Services/api/apiInterceptor';

const {width, height} = Dimensions.get('window');

const SignInScreen = () => {
  const navigation = useNavigation();

  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [passwordError, setPasswordError] = useState('');
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

  const clearStackAndNavigate = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Signup'}],
      }),
    );
  };

  const validateEmail = emailInput => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailInput);
  };

  const validateUsername = usernameInput => {
    return usernameInput.trim().length >= 3;
  };

  const validatePassword = passwordInput => {
    return passwordInput.length >= 8;
  };

  const navigateHome = token => {
    storage.set('token', token);
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'BottomTabs'}],
      }),
    );
  };

  const handleSignin = async () => {
    let valid = true;

    setLoginError('');
    setPasswordError('');

    if (login.includes('@')) {
      if (!validateEmail(login)) {
        setLoginError('Please enter a valid email address.');
        valid = false;
      }
    } else {
      if (!validateUsername(login)) {
        setLoginError('Please enter a valid username.');
        valid = false;
      }
    }

    if (!validatePassword(password)) {
      setPasswordError('Password must be at least 8 characters long.');
      valid = false;
    }

    if (!valid) {
      Vibration.vibrate(100);
      return;
    }

    try {
      Keyboard.dismiss();
      setIsLoading(true);

      const payload = {
        login: login.includes('@') ? login.toLowerCase() : login,
        password: password,
      };
      const response = await apiClient.post('/user/auth/signin', payload);
      if (response.status === 200) {
        setIsMessage({
          message: response.data.message || 'Signed In!!',
          heading: 'Success',
          isRight: true,
          leftTriggerFunction: () => {
            navigateHome(response.data.jwt);
          },
          rightButtonText: 'OK',
          triggerFunction: () => {
            closeAlert();
            navigateHome(response.data.jwt);
          },
          setShowAlert: () => {
            isMessage.setShowAlert(false);
          },
          showAlert: true,
        });
      } else {
        setIsMessage({
          message: response.data || 'Something went wrong',
          heading: 'Error',
          isRight: false,
          rightButtonText: 'OK',
          triggerFunction: () => {},
          setShowAlert: () => {
            isMessage.setShowAlert(false);
          },
          showAlert: true,
        });
      }
    } catch (error) {
      setIsMessage({
        message: error?.response?.data?.message || 'Something went wrong',
        heading: 'Error',
        isRight: false,
        rightButtonText: 'OK',
        triggerFunction: () => {},
        setShowAlert: () => {
          isMessage.setShowAlert(false);
        },
        showAlert: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="always">
      {isLoading && (
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
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../../assets/images/logo.png')}
            style={styles.logoImage}
          />
          <Text style={styles.logoText}>{AppName}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.subText}>Sign in to continue using Nexus.</Text>

        <TextInput
          style={[styles.input, loginError ? styles.errorInput : null]}
          placeholder="Email or Username"
          placeholderTextColor="#999"
          autoCapitalize="none"
          keyboardType="email-address"
          value={login}
          onChangeText={setLogin}
        />
        {loginError ? <Text style={styles.errorText}>{loginError}</Text> : null}

        <View
          style={[
            styles.passwordContainer,
            passwordError ? styles.errorInput : null,
          ]}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            placeholderTextColor="#999"
            secureTextEntry={!passwordVisible}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={() => setPasswordVisible(!passwordVisible)}>
            <Icon
              name={passwordVisible ? 'eye-off' : 'eye'}
              size={24}
              color="#999"
            />
          </TouchableOpacity>
        </View>
        {passwordError ? (
          <Text style={styles.errorText}>{passwordError}</Text>
        ) : null}

        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableRipple
          borderless={true}
          rippleColor={'rgba(0,0,0,0.2)'}
          style={styles.signInButton}
          onPress={handleSignin}>
          <Text style={styles.signInButtonText}>Sign In</Text>
        </TouchableRipple>

        <View style={styles.footerTextContainer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={clearStackAndNavigate}>
            <Text style={styles.footerLink}> Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    flexGrow: 1,
  },
  header: {
    height: height * 0.3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  logoImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: PrimaryColor,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: PrimaryColor,
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  forgotPasswordText: {
    color: PrimaryColor,
    fontSize: 14,
    marginVertical: 20,
    textAlign: 'right',
    alignSelf: 'flex-end',
  },
  signInButton: {
    backgroundColor: PrimaryColor,
    borderRadius: 10,
    paddingVertical: 15,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footerTextContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
  },
  footerLink: {
    fontSize: 14,
    color: PrimaryColor,
    fontWeight: '600',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: '#f9f9f9',
    width: '100%',
    marginVertical: 15,
  },
  passwordInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  errorInput: {
    borderColor: 'red',
    marginBottom: 0,
  },
  loadingIndicator: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    zIndex: 100,
    height: height,
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
