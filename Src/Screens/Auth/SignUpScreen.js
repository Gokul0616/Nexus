import {CommonActions, useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Vibration,
  View,
} from 'react-native';
import {TouchableRipple} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {AppName, PrimaryColor, storage} from '../../Components/CommonData';
import apiClient from '../../Services/api/apiInterceptor';
import AlertBox from '../../Components/AlertMessage';
import CustomLoadingIndicator from '../../Components/CustomLoadingIndicator';

const {width, height} = Dimensions.get('window');

const SignupScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Error state variables for each field
  const [nameError, setNameError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const clearStackAndNavigate = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Signin'}],
      }),
    );
  };
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
  const validateFields = () => {
    let valid = true;
    setNameError('');
    setUsernameError('');
    setEmailError('');
    setPasswordError('');

    if (!name.trim()) {
      setNameError('Full Name is required');
      valid = false;
    } else if (name.trim().length < 2) {
      setNameError('Full Name is too short');
      valid = false;
    }

    if (!username.trim()) {
      setUsernameError('Username is required');
      valid = false;
    } else if (username.trim().length < 2) {
      setUsernameError('Username is too short');
      valid = false;
    }

    if (!email.trim()) {
      setEmailError('Email is required');
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError('Email is invalid');
      valid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      valid = false;
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      valid = false;
    }
    return valid;
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
  const handleSubmit = async () => {
    if (!validateFields()) {
      // storage.delete('token');
      // console.log(storage.getString('token'));
      Vibration.vibrate(100);
      return;
    }
    try {
      setIsLoading(true);
      const response = await apiClient.post('/user/auth/signup', {
        fullName: name,
        username: username,
        email: email.toLowerCase(),
        password: password,
      });
      if (response.status === 200) {
        setIsMessage({
          message: response.data.message || 'SignUp Successfull!!!',
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
          message: response.data.message || 'Something went wrong',
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
        message: error.response.data || 'Something went wrong',
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

      <View style={styles.formContainer}>
        <Text style={styles.title}>Welcome To Nexus</Text>
        <Text style={styles.subText}>Create Account and Create Memories</Text>

        <TextInput
          style={[styles.input, nameError ? styles.errorInput : null]}
          placeholder="Full Name"
          placeholderTextColor="#888"
          value={name}
          cursorColor={PrimaryColor}
          onChangeText={setName}
        />
        {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

        <TextInput
          style={[styles.input, usernameError ? styles.errorInput : null]}
          placeholder="Username"
          placeholderTextColor="#888"
          value={username}
          cursorColor={PrimaryColor}
          onChangeText={setUsername}
        />
        {usernameError ? (
          <Text style={styles.errorText}>{usernameError}</Text>
        ) : null}

        <TextInput
          style={[styles.input, emailError ? styles.errorInput : null]}
          placeholder="Email Address"
          placeholderTextColor="#888"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          cursorColor={PrimaryColor}
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

        <View
          style={[
            styles.passwordContainer,
            passwordError ? styles.errorInput : null,
          ]}>
          <TextInput
            style={[styles.passwordInput]}
            placeholder="Password"
            placeholderTextColor="#999"
            secureTextEntry={!passwordVisible}
            value={password}
            cursorColor={PrimaryColor}
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
      </View>

      <View style={styles.buttonContainer}>
        <TouchableRipple
          borderless={true}
          rippleColor={'rgba(0,0,0,0.5)'}
          style={styles.signupButton}
          onPress={handleSubmit}>
          <Text style={styles.signupButtonText}>Sign Up</Text>
        </TouchableRipple>

        <TouchableOpacity onPress={clearStackAndNavigate}>
          <Text style={styles.loginText}>
            Already have an account?{' '}
            <Text style={styles.loginLink}>Log In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
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
  logoContainer: {
    alignItems: 'center',
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
  formContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#f9f9f9',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  signupButton: {
    backgroundColor: PrimaryColor,
    borderRadius: 10,
    paddingVertical: 15,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loginText: {
    fontSize: 14,
    color: '#666',
  },
  loginLink: {
    color: PrimaryColor,
    fontWeight: 'bold',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 15,
    width: '100%',
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
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
