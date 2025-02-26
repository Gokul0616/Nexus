import React from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';

const NexusInput = ({
  value,
  placeholder,
  ref,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  autoCorrect = false,
  style,
  containerStyle,
  label,
  cursorColor = '#0887ff',
  error,
  ...rest
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        value={value}
        placeholder={placeholder}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        ref={ref}
        keyboardType={keyboardType}
        cursorColor={cursorColor}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        style={[styles.input, style]}
        {...rest}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default NexusInput;

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    marginBottom: 4,
    color: '#333',
    fontSize: 14,
  },
  input: {
    height: 40,
    paddingHorizontal: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  errorText: {
    marginTop: 4,
    color: 'red',
    fontSize: 12,
  },
});
