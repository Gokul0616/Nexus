import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {TouchableRipple} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';

const CustomHeader = ({
  navigation,
  headerTitle,
  leftIcon,
  leftIconFunction,
  rightIconFunction,
  rightIcon,
  style,
  isLeftIcon = true,
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
    <View style={[styles.headerContainer, style]}>
      {isLeftIcon ? (
        <TouchableRipple
          borderless={true}
          style={styles.leftIconContainer}
          onPress={() => handlePress('left')}>
          {leftIcon ? (
            leftIcon
          ) : (
            <Icon name="chevron-back" size={28} color="#000" />
          )}
        </TouchableRipple>
      ) : (
        <View style={styles.emptyIcon} />
      )}
      <Text style={styles.headerTitle}>{headerTitle}</Text>
      {rightIcon ? (
        <TouchableRipple
          borderless={true}
          style={styles.rightIconContainer}
          onPress={() => handlePress('right')}>
          {rightIcon}
        </TouchableRipple>
      ) : (
        <View style={styles.emptyIcon} />
      )}
    </View>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  headerContainer: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    borderBottomWidth: 0.2,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 8,
    elevation: 5,
    borderBottomColor: '#ddd',
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
