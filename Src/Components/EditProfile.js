import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import {TouchableRipple} from 'react-native-paper';
import CustomHeader from './CustomHeader';
import {profileDummyData} from './DummyData';
import NexusInput from './NexusInput';

const EditProfile = () => {
  const profile = profileDummyData[0];
  const navigation = useNavigation();
  const [name, setName] = useState(profile.name);
  const [username, setUsername] = useState(profile.username);
  const [bio, setBio] = useState(profile.bio);
  const [website, setWebsite] = useState(profile.website);
  const [location, setLocation] = useState(profile.location);

  const handleSave = () => {
    console.log('Updated Profile:', {name, username, bio, website, location});
  };

  return (
    <>
      <CustomHeader headerTitle={'edit profile'} navigation={navigation} />
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="always">
        <View style={styles.avatarContainer}>
          <Image source={{uri: profile.avatar}} style={styles.avatar} />
          <Text style={styles.username}>{username}</Text>
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Name</Text>
          <NexusInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
          />
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Bio</Text>
          <NexusInput
            style={[styles.input, {height: 80}]}
            value={bio}
            onChangeText={setBio}
            placeholder="Tell us about yourself"
            multiline
          />
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Website</Text>
          <NexusInput
            style={styles.input}
            value={website}
            onChangeText={setWebsite}
            placeholder="Your website URL"
            keyboardType="url"
          />
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Location</Text>
          <NexusInput
            style={styles.input}
            value={location}
            onChangeText={setLocation}
            placeholder="Where are you based?"
          />
        </View>
        <TouchableRipple
          borderless={true}
          style={styles.saveButton}
          onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableRipple>
      </ScrollView>
    </>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  username: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
  },
  fieldContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: '#000',
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: '#0887ff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
