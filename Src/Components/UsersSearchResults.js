import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useImperativeHandle, useState} from 'react';
import {FlatList, Image, Text, TouchableOpacity} from 'react-native';
import apiClient from '../Services/api/apiInterceptor';
import {useDebounce} from '../Services/Hooks/useDebounce';
import {storage} from './CommonData';

const UsersSearchResults = React.forwardRef(
  ({searchVal, loading, setLoading}, ref) => {
    const [users, setUsers] = useState([]);
    const navigation = useNavigation();
    const debouncedSearchVal = useDebounce(searchVal, 500);

    const fetchUsers = async () => {
      if (searchVal.length === 0) return;

      try {
        setLoading(true);
        const response = await apiClient.get(
          `/search?query=${debouncedSearchVal}&type=users`,
        );
        setUsers(response.data);
      } catch (err) {
        // console.error(err);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      if (debouncedSearchVal.length === 0) return;
      fetchUsers();
    }, [debouncedSearchVal]);

    useImperativeHandle(ref, () => ({
      refresh: () => {
        fetchUsers();
      },
    }));

    const handlePressOfProfile = item => {
      const profileString = storage.getString('profile');
      const profile = JSON.parse(profileString);
      if (profile.username === item.username) {
        navigation.navigate('Profile');
      } else {
        navigation.navigate('OtherProfileScreen', {username: item.username});
      }
    };

    const renderItem = ({item}) => (
      <TouchableOpacity
        onPress={() => handlePressOfProfile(item)}
        style={{flexDirection: 'row', alignItems: 'center', padding: 10}}>
        <Image
          source={{uri: item.profilePic}}
          style={{width: 50, height: 50, borderRadius: 25}}
        />
        <Text style={{marginLeft: 10}}>{item.username}</Text>
      </TouchableOpacity>
    );

    return (
      <FlatList
        data={users}
        scrollEnabled={false}
        nestedScrollEnabled={true}
        renderItem={renderItem}
        keyExtractor={item => item.userId}
        contentContainerStyle={{paddingVertical: 20}}
      />
    );
  },
);

export default UsersSearchResults;
