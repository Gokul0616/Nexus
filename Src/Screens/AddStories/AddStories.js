import {BackHandler, StyleSheet, Text, View} from 'react-native';
import React, {useCallback} from 'react';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

const AddStories = () => {
  const navigation = useNavigation();
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.navigate('BottomTabs');
        return true;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );
      return () => subscription.remove();
    }, [navigation]),
  );

  return (
    <View>
      <Text>AddStories</Text>
    </View>
  );
};

export default AddStories;

const styles = StyleSheet.create({});
