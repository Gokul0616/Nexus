import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const CustomHeader = ({
  navigation,
  headerTitle = 'Direct',
  leftIcon,
  leftIconFunction,
  rightIconFunction,
  rightIcon,
}) => {
  const handlePress = side => {
    if (side === 'left') {
      if (leftIconFunction) {
        leftIconFunction();
      } else {
        navigation.goBack();
      }
    } else if (side === 'right') {
      if (rightIconFunction) {
        rightIconFunction();
      } else {
        return;
      }
    }
  };
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        style={styles.leftIconContainer}
        onPress={() => handlePress('left')}>
        {leftIcon ? (
          leftIcon
        ) : (
          <Icon name="chevron-back" size={28} color="#000" />
        )}
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{headerTitle}</Text>
      {rightIcon ? (
        <TouchableOpacity
          style={styles.rightIconContainer}
          onPress={handlePress('right')}>
          {rightIcon}
        </TouchableOpacity>
      ) : (
        <View style={styles.emptyIcon} />
      )}
    </View>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  headerContainer: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    borderBottomWidth: 0.2,
    borderBottomColor: '#ccc',
  },
  leftIconContainer: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    color: '#000',
    fontWeight: '600',
  },
  rightIconContainer: {
    padding: 8,
  },
  emptyIcon: {
    padding: 8,
    height: 45,
    width: 45,
  },
});
