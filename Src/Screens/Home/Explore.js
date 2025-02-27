import {BackHandler, StyleSheet, Text, View} from 'react-native';
import React, {useCallback} from 'react';
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';

const Explore = () => {
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
      <Text>Explore</Text>
    </View>
  );
};

export default Explore;

const styles = StyleSheet.create({});
