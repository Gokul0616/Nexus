import {StyleSheet, Text, View} from 'react-native';

import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import React, {useCallback} from 'react';
import {BackHandler} from 'react-native';
const Community = () => {
  const navigation = useNavigation();
  const clearStackAndNavigate = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'TopTabs',
          },
        ],
      }),
    );
  };

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        clearStackAndNavigate(0);
        return true;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );
      return () => subscription.remove();
    }, []),
  );
  return (
    <View>
      <Text>Community</Text>
    </View>
  );
};

export default Community;

const styles = StyleSheet.create({});
