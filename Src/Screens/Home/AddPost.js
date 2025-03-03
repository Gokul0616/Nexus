import {BackHandler, StyleSheet, Text, View} from 'react-native';
import React, {useCallback} from 'react';
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';

const AddPost = () => {
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
        clearStackAndNavigate();

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
      <Text>AddPost</Text>
    </View>
  );
};

export default AddPost;

const styles = StyleSheet.create({});
