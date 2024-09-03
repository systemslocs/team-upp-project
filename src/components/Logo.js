import React from 'react';
import { Image, StyleSheet } from 'react-native';

const Logo = ({ style }) => {
  return (
    <Image
      source={require('../../assets/logo-app.png')}
      style={[styles.logo, style]}
    />
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
});

export default Logo;
