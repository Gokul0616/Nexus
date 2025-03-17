import React, {useEffect, useState} from 'react';
import {Dimensions, Image, StyleSheet, Text, View} from 'react-native';
import CustomLoadingIndicator from '../../Components/CustomLoadingIndicator';
import {CommonActions, useNavigation} from '@react-navigation/native';
import apiClient from '../../Services/api/apiInterceptor';
import {storage} from '../../Components/CommonData';
const {width, height} = Dimensions.get('window');

const LandingHome = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  useEffect(() => {
    const token = storage.getString('token');
    const fetchData = async () => {
      try {
        setIsLoading(true);
        if (token) {
          const response = await apiClient.post('/user/auth/authenticate');
          if (response.status === 200) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [
                  {
                    name: 'BottomTabs',
                  },
                ],
              }),
            );
          } else {
            navigation.navigate('Landing');
            storage.delete('token');
          }
        }
      } catch (error) {
        storage.delete('token');
        navigation.navigate('Landing');
      } finally {
        setIsLoading(false);
      }
    };
    if (token) {
      fetchData();
    } else {
      storage.delete('token');
      navigation.navigate('Landing');
    }
  }, []);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#222',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
      }}>
      <View style={{alignItems: 'center'}}>
        <Image
          source={require('../../../assets/images/logo.png')}
          style={{width: 150, height: 150}}
        />
        <Text style={{color: 'white', fontSize: 30}}>Nexus</Text>
      </View>
      {isLoading && (
        <View style={styles.loadingIndicator}>
          <CustomLoadingIndicator />
        </View>
      )}
    </View>
  );
};

export default LandingHome;

const styles = StyleSheet.create({
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
