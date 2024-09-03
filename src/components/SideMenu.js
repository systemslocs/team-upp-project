import React, { useState } from 'react';
import { Text, TouchableOpacity, Animated, Dimensions, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const SideMenu = ({ navigation }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [animation] = useState(new Animated.Value(-width * 0.5));

  const toggleMenu = () => {
    if (menuVisible) {
      Animated.timing(animation, {
        toValue: -width * 0.5,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setMenuVisible(false));
    } else {
      setMenuVisible(true);
      Animated.timing(animation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleOutsideClick = () => {
    if (menuVisible) {
      toggleMenu();
    }
  };

  return (
    <>
      <TouchableOpacity onPress={toggleMenu} style={styles.profileButton}>
        <Ionicons name="person-circle-outline" size={50} color="#084b0f" />
      </TouchableOpacity>
      {menuVisible && (
        <TouchableOpacity style={styles.overlay} onPress={handleOutsideClick} activeOpacity={1}>
          <Animated.View style={[styles.menuContainer, { transform: [{ translateX: animation }] }]}>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.menuItemContainer}>
              <Ionicons name="person-outline" size={24} color="#084b0f" style={styles.menuIcon} />
              <Text style={styles.menuItem}>Perfil</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Players')} style={styles.menuItemContainer}>
              <Ionicons name="people-outline" size={24} color="#084b0f" style={styles.menuIcon} />
              <Text style={styles.menuItem}>Jogadores</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Teams')} style={styles.menuItemContainer}>
              <Ionicons name="shield-outline" size={24} color="#084b0f" style={styles.menuIcon} />
              <Text style={styles.menuItem}>Times</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={styles.menuItemContainer}>
              <Ionicons name="settings-outline" size={24} color="#084b0f" style={styles.menuIcon} />
              <Text style={styles.menuItem}>Configurações</Text>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  profileButton: {
    position: 'absolute',
    top: 40, 
    left: 10,
    zIndex: 10,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 5,
  },
  menuContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '50%',
    backgroundColor: '#9dbfa1',
    zIndex: 6,
    paddingTop: 100, 
    paddingLeft: 20,
  },
  menuItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15, 
  },
  menuIcon: {
    marginRight: 15,
  },
  menuItem: {
    fontSize: 20,
    paddingVertical: 15,
  },
});

export default SideMenu;
