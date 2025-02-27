import {BackHandler, StyleSheet, Text, View} from 'react-native';
import React, {useCallback} from 'react';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

const AddStories = ({setIndex}) => {
  const navigation = useNavigation();
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        // Switch to BottomStack (index 1) when back is pressed
        setIndex(1);
        return true;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );
      return () => subscription.remove();
    }, [navigation, setIndex]),
  );

  return (
    <View style={styles.container}>
      <Text>AddStories</Text>
    </View>
  );
};

export default AddStories;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
