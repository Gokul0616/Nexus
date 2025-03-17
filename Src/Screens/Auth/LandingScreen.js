import {CommonActions, useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {AppName, PrimaryColor, storage} from '../../Components/CommonData';
import {TouchableRipple} from 'react-native-paper';
import CustomLoadingIndicator from '../../Components/CustomLoadingIndicator';
import apiClient from '../../Services/api/apiInterceptor';

const {width, height} = Dimensions.get('window');

const LandingScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.loadingIndicator}>
          <CustomLoadingIndicator />
        </View>
      )}
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

      <TouchableRipple
        borderless={true}
        rippleColor={'rgb(0,0,0,0.5)'}
        style={styles.getStartedButton}
        onPress={() => {
          navigation.navigate('Signup');
          // navigation.navigate('TopTabs');
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
    backgroundColor: '#fff',
    justifyContent: 'space-between',
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
    color: PrimaryColor,
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
    borderWidth: 5,
    borderColor: '#ccc',
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
    color: PrimaryColor,
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
    backgroundColor: PrimaryColor,
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
    borderRadius: 25,
    height: 50,
    resizeMode: 'contain',
    marginBottom: 10,
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
