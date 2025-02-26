import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {AppName} from '../../Components/CommonData';

const {width, height} = Dimensions.get('window');

const LandingScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      {/* Gradient Header */}
      <LinearGradient
        colors={['#6B63FF', '#A8A4FF']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.header}>
        {/* Top Bar: "Already have an account?" / "Sign in" */}
        <View style={styles.topBar}>
          <Text style={styles.topBarText}>Already have an account?</Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Signin');
            }}>
            <Text style={styles.topBarLink}>Sign in</Text>
          </TouchableOpacity>
        </View>

        {/* Logo */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>{AppName}</Text>
        </View>
      </LinearGradient>

      {/* Middle content (illustration + text) */}
      <View style={styles.content}>
        {/* Illustration placeholder (replace with your own image) */}
        <View style={styles.illustrationContainer}>
          {/* <Image
            source={require('../assets/jobsly-docs.png')} // Example image
            style={styles.illustration}
            resizeMode="contain"
          /> */}
        </View>

        {/* "Jobsly enterprise" + Subtext */}
        <Text style={styles.enterpriseText}>Jobsly enterprise</Text>
        <Text style={styles.subText}>
          Transformative collaboration for larger teams
        </Text>
      </View>

      {/* "Get Started" Button */}
      <TouchableOpacity
        style={styles.getStartedButton}
        onPress={() => {
          // navigation.navigate('Signup');
          navigation.navigate('TopTabs');
        }}>
        <Text style={styles.getStartedButtonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LandingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: height * 0.32,
    paddingTop: 50,
    paddingHorizontal: 20,
    // borderBottomLeftRadius: 40,
    // borderBottomRightRadius: 40,
  },
  topBar: {
    flexDirection: 'row',
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
    marginTop: 20,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    marginTop: -40, // pulls content up over the rounded header
    paddingHorizontal: 20,
  },
  illustrationContainer: {
    width: 220,
    height: 220,
    marginBottom: 10,
  },
  illustration: {
    width: '100%',
    height: '100%',
  },
  enterpriseText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2F2CC9',
    marginBottom: 8,
    textAlign: 'center',
  },
  subText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  getStartedButton: {
    backgroundColor: '#6B63FF',
    borderRadius: 10,
    paddingVertical: 15,
    marginHorizontal: 20,
    marginBottom: 30,
    alignItems: 'center',
  },
  getStartedButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
