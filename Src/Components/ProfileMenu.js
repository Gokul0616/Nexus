import React from 'react';
import {StyleSheet, Text, View, FlatList, TouchableOpacity} from 'react-native';
import {TouchableRipple} from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const menuItems = [
  {
    id: '1',
    title: 'Account Settings',
    icon: 'user-cog',
    onPress: () => {
      console.log('Account Settings');
    },
  },
  {
    id: '2',
    title: 'Privacy Settings',
    icon: 'lock',
    onPress: () => {
      console.log(' Privacy Settings');
    },
  },
  {
    id: '3',
    title: 'Language',
    icon: 'globe',
    onPress: () => {
      console.log('Language');
    },
  },
  {
    id: '4',
    title: 'Share Profile',
    icon: 'share-alt',
    onPress: () => {
      console.log('Share Profile');
    },
  },
  {
    id: '5',
    title: 'My QR Code',
    icon: 'qrcode',
    onPress: () => {
      console.log(' My QR Code');
    },
  },
  {
    id: '6',
    title: 'Help Center',
    icon: 'question-circle',
    onPress: () => {
      console.log(' Help Center');
    },
  },
  {
    id: '7',
    title: 'Logout',
    icon: 'sign-out-alt',
    onPress: () => {
      console.log('Logout');
    },
  },
];

const ProfileMenu = ({navigation}) => {
  const renderItem = ({item}) => (
    <TouchableRipple
      style={styles.menuItem}
      onPress={() => {
        item.onPress();
      }}
      rippleColor={'rgba(0, 0, 0, .32)'}>
      <>
        <FontAwesome5
          name={item.icon}
          size={20}
          color="#000"
          style={styles.menuIcon}
        />
        <Text style={styles.menuText}>{item.title}</Text>
      </>
    </TouchableRipple>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Menu</Text>
        <TouchableRipple
          rippleColor={'#ccc'}
          style={styles.closeButton}
          onPress={() => navigation.goBack()}>
          <FontAwesome5 name="times" size={20} color="#000" />
        </TouchableRipple>
      </View>

      <FlatList
        data={menuItems}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.menuList}
      />
    </View>
  );
};

export default ProfileMenu;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 30,

    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  menuList: {
    paddingHorizontal: 15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    // borderBottomWidth: 1,
    // borderBottomColor: '#eee',
  },
  menuIcon: {
    marginRight: 15,
  },
  menuText: {
    fontSize: 16,
    color: '#000',
  },
});
