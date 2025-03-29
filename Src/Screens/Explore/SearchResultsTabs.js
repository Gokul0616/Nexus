import React, {useImperativeHandle, useRef, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {MainExploreScreenStyle as styles} from '../../Components/Styles/Styles';
import UsersSearchResults from '../../Components/UsersSearchResults';
import VideosSearchResults from '../../Components/VideosSearchResults';

const SearchResultsTabs = React.forwardRef(
  ({searchVal, loading, setLoading}, ref) => {
    const [tabIndex, setTabIndex] = useState(0);
    const usersRef = useRef(null);
    const videosRef = useRef(null);

    useImperativeHandle(ref, () => ({
      refresh: () => {
        if (tabIndex === 0 && usersRef.current) {
          usersRef.current.refresh();
        } else if (tabIndex === 1 && videosRef.current) {
          videosRef.current.refresh();
        }
      },
    }));

    return (
      <>
        <View style={styles.searchHeaderContainer}>
          <TouchableOpacity
            style={[
              styles.searchHeaderTextContainer,
              {backgroundColor: tabIndex === 0 ? '#ccc' : '#eee'},
            ]}
            onPress={() => setTabIndex(0)}>
            <Text style={styles.searchHeaderText}>User</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.searchHeaderTextContainer,
              {backgroundColor: tabIndex === 1 ? '#ccc' : '#eee'},
            ]}
            onPress={() => setTabIndex(1)}>
            <Text style={styles.searchHeaderText}>Video</Text>
          </TouchableOpacity>
        </View>
        <View style={{flex: 1, backgroundColor: '#fff'}}>
          {tabIndex === 0 ? (
            <UsersSearchResults
              ref={usersRef}
              searchVal={searchVal}
              key="users"
              loading={loading}
              setLoading={setLoading}
            />
          ) : (
            <VideosSearchResults
              ref={videosRef}
              searchVal={searchVal}
              key="videos"
              loading={loading}
              setLoading={setLoading}
            />
          )}
        </View>
      </>
    );
  },
);

export default SearchResultsTabs;
