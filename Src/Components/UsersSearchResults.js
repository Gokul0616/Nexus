import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import apiClient from '../Services/api/apiInterceptor';
import CustomLoadingIndicator from './CustomLoadingIndicator';
import {useDebounce} from '../Services/Hooks/useDebounce';

const UsersSearchResults = ({searchVal}) => {
  const [users, setUsers] = useState([]);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const debouncedSearchVal = useDebounce(searchVal, 500);

  useEffect(() => {
    if (debouncedSearchVal.length === 0) {
      return;
    }

    fetchVideos();
  }, [debouncedSearchVal]);
  async function fetchVideos() {
    try {
      setLoading(true);
      const response = await apiClient.get(
        `/search?query=${debouncedSearchVal}&type=users`,
      );
      setUsers(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('OtherProfileScreen', {username: item.username})
      }
      style={{flexDirection: 'row', alignItems: 'center', padding: 10}}>
      <Image
        source={{uri: item.profilePic}}
        style={{width: 50, height: 50, borderRadius: 25}}
      />
      <Text style={{marginLeft: 10}}>{item.username}</Text>
    </TouchableOpacity>
  );

  return (
    <>
      {loading && (
        <View
          style={{
            position: 'absolute',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',

            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 5000,
            width: '100%',
          }}>
          <CustomLoadingIndicator />
        </View>
      )}
      <FlatList
        data={users}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => {
              fetchVideos();
            }}
          />
        }
        keyExtractor={item => item.userId}
        contentContainerStyle={{paddingVertical: 20}}
      />
    </>
  );
};

export default UsersSearchResults;
