import React from 'react';
import { View, StyleSheet } from 'react-native';
import SideMenu from '../components/SideMenu';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <SideMenu navigation={navigation} />
      {/* Outros elementos da HomeScreen */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default HomeScreen;
