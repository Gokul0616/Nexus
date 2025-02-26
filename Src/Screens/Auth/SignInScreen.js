import {CommonActions, useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {AppName} from '../../Components/CommonData';

const {width, height} = Dimensions.get('window');

const SignInScreen = () => {
  const navigation = useNavigation();
  const clearStackAndNavigate = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'Tabs',
          },
        ],
      }),
    );
  };

  return (
    <View style={styles.container}>
      {/* Gradient header */}
      <LinearGradient
        colors={['#6B63FF', '#A8A4FF']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.header}>
        {/* Top bar: "Don’t have an account?" / "Get Started" */}
        <View style={styles.topBar}>
          <Text style={styles.topBarText}>Don’t have an account?</Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Signup');
            }}>
            <Text style={styles.topBarLink}>Get Started</Text>
          </TouchableOpacity>
        </View>

        {/* Logo */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>{AppName}</Text>
        </View>
      </LinearGradient>

      {/* White card with form */}
      <View style={styles.formCard}>
        <Text style={styles.formTitle}>Welcome Back</Text>
        <Text style={styles.formSubtitle}>Enter your details below</Text>

        <TextInput
          style={styles.input}
          placeholder="nicholas@gremlin.ai"
          placeholderTextColor="#999"
        />
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          placeholderTextColor="#999"
          secureTextEntry
        />

        <TouchableOpacity style={styles.signInButton}>
          <Text style={styles.signInButtonText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
        </TouchableOpacity>

        <View style={styles.socialContainer}>
          <Text style={styles.socialText}>Or sign in with</Text>
        </View>
        <View style={styles.socialButtons}>
          <TouchableOpacity style={styles.socialButton}>
            <Text style={styles.socialButtonText}>Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Text style={styles.socialButtonText}>Facebook</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: height * 0.3,
    paddingTop: 50,
    paddingHorizontal: 20,
    // borderBottomLeftRadius: 40,
    // borderBottomRightRadius: 40,
  },
  topBar: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  topBarText: {
    fontSize: 14,
    color: '#fff',
    marginRight: 5,
  },
  topBarLink: {
    fontSize: 14,
    color: '#fff',
    textDecorationLine: 'underline',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 15,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  formCard: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: -30, // overlaps the gradient
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2f2cc9',
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#F2F2F2',
    borderRadius: 10,
    marginBottom: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  signInButton: {
    backgroundColor: '#6B63FF',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 12,
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  forgotPassword: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#2f2cc9',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  socialContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  socialText: {
    fontSize: 14,
    color: '#999',
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  socialButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  socialButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
  },
});
