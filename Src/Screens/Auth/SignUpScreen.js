import {useNavigation} from '@react-navigation/native';
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

const SignUpScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#6B63FF', '#A8A4FF']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.header}>
        {/* Top bar: "Already have an account?" / "Sign In" */}
        <View style={styles.topBar}>
          <Text style={styles.topBarText}>Already have an account?</Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Signin');
            }}>
            <Text style={styles.topBarLink}>Sign In</Text>
          </TouchableOpacity>
        </View>

        {/* Logo */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>{AppName}</Text>
        </View>
      </LinearGradient>

      <View style={styles.formCard}>
        <Text style={styles.formTitle}>Get started free.</Text>
        <Text style={styles.formSubtitle}>No credit card needed</Text>

        {/* Name */}
        <TextInput
          style={styles.input}
          placeholder="Nicholas"
          placeholderTextColor="#999"
        />
        {/* Email */}
        <TextInput
          style={styles.input}
          placeholder="nicholas@gremlin.ai"
          placeholderTextColor="#999"
        />
        {/* Password */}
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          placeholderTextColor="#999"
          secureTextEntry
        />

        <TouchableOpacity style={styles.signUpButton}>
          <Text style={styles.signUpButtonText}>Sign Up</Text>
        </TouchableOpacity>

        <View style={styles.socialContainer}>
          <Text style={styles.socialText}>Or sign up with</Text>
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

export default SignUpScreen;

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
    justifyContent: 'flex-end',
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
    marginTop: -30,
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
  signUpButton: {
    backgroundColor: '#6B63FF',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 12,
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
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
