import React, {useState, useRef} from 'react';
import {ScrollView, RefreshControl, View} from 'react-native';
import CustomHeader from '../../Components/CustomHeader';
import NexusInput from '../../Components/NexusInput';
import {MainExploreScreenStyle as styles} from '../../Components/Styles/Styles';
import SearchResultsTabs from './SearchResultsTabs';
import CustomLoadingIndicator from '../../Components/CustomLoadingIndicator';
import {useNavigation} from '@react-navigation/native';

const SearchScreen = ({route}) => {
  const navigation = useNavigation();
  const [searchVal, setSearchVal] = useState('');
  const [loading, setLoading] = useState(false);
  const tabsRef = useRef(null);

  const onRefresh = () => {
    if (tabsRef.current) {
      tabsRef.current.refresh();
    }
  };

  return (
    <View style={{flex: 1, position: 'relative', backgroundColor: '#fff'}}>
      <ScrollView
        contentContainerStyle={{flexGrow: 1, backgroundColor: '#fff'}}
        keyboardShouldPersistTaps="always"
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }>
        <CustomHeader headerTitle={'Search'} navigation={navigation} />
        <NexusInput
          placeholder="Search..."
          value={searchVal}
          autofocus={true}
          onChangeText={setSearchVal}
          style={styles.searchInput}
        />
        <SearchResultsTabs
          ref={tabsRef}
          searchVal={searchVal}
          loading={loading}
          setLoading={setLoading}
        />
      </ScrollView>
      {loading && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 5000,
          }}>
          <CustomLoadingIndicator />
        </View>
      )}
    </View>
  );
};

export default SearchScreen;
