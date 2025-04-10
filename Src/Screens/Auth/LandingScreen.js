import { CommonActions, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { AppName, storage } from '../../Components/CommonData';
import { TouchableRipple } from 'react-native-paper';
import CustomLoadingIndicator from '../../Components/CustomLoadingIndicator';
import apiClient from '../../Services/api/apiInterceptor';

const { width, height } = Dimensions.get('window');

const LandingScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    StatusBar.setBackgroundColor('#000');
  }, [])

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.loadingIndicator}>
          <CustomLoadingIndicator />
        </View>
      )}

      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../../assets/images/logo.png')}
            style={styles.logoImage}
          />
          <Text style={styles.logoText}>{AppName}</Text>
        </View>
      </View>

      {/* Content Section */}
      <View style={styles.content}>
        <View style={styles.illustrationContainer}>
          <Image
            source={{
              uri: 'https://img.freepik.com/premium-vector/real-life-family-moments-vector-illustration-concepts_1253202-66693.jpg',
            }}
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.enterpriseText}>Simple Moments, Forever Bonds</Text>
        <Text style={styles.subText}>
          Capture Memories, Share Joy, and Stay Connected with the Ones Who
          Matter Most.
        </Text>
      </View>

      {/* Button Section */}
      <TouchableRipple
        borderless={true}
        rippleColor={'rgba(255,255,255,0.2)'}
        style={styles.getStartedButton}
        onPress={() => {
          navigation.navigate('Signup');
        }}>
        <Text style={styles.getStartedButtonText}>Get Started</Text>
      </TouchableRipple>
    </View>
  );
};

export default LandingScreen;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'space-between',
  },
  header: {
    height: height * 0.32,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
  },

  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    marginTop: -40,
    paddingHorizontal: 20,
  },

  illustrationContainer: {
    width: 220,
    height: 220,
    borderWidth: 3,
    borderColor: '#444',
    borderRadius: 110,
    overflow: 'hidden',
    marginBottom: 10,
  },
  illustration: {
    width: '100%',
    height: '100%',
  },

  enterpriseText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },

  subText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 30,
  },

  getStartedButton: {
    backgroundColor: '#2980B9',
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
  logoImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
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
