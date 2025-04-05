import React from 'react';
import {TouchableOpacity, View, StyleSheet} from 'react-native';
import {TouchableRipple} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CustomAddPostButton = ({onPress, colorChange}) => (
  <TouchableRipple
    rippleColor={'#fff'}
    style={styles.wrapper}
    onPress={onPress}>
    <>
      <View style={[styles.coloredLayer, styles.leftTeal]} />
      <View style={[styles.coloredLayer, styles.rightPink]} />
      <View
        style={[
          styles.centerShape,
          colorChange ? {backgroundColor: colorChange} : {},
        ]}>
        <Icon name="add" size={18} color={colorChange ? '#000' : '#fff'} />
      </View>
    </>
  </TouchableRipple>
);

const BUTTON_WIDTH = 35;
const BUTTON_HEIGHT = 25;
const OVERLAP_OFFSET = 5;

const styles = StyleSheet.create({
  wrapper: {
    width: BUTTON_WIDTH,
    height: BUTTON_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coloredLayer: {
    position: 'absolute',
    width: BUTTON_WIDTH,
    height: BUTTON_HEIGHT,
    borderRadius: 4,
  },
  leftTeal: {
    backgroundColor: '#0887ff', // Updated primary color
    left: -OVERLAP_OFFSET,
  },
  rightPink: {
    backgroundColor: '#FF004F',
    right: -OVERLAP_OFFSET,
  },
  centerShape: {
    position: 'absolute',
    width: BUTTON_WIDTH,
    height: BUTTON_HEIGHT,
    borderRadius: 4,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CustomAddPostButton;
