import React, { useState } from 'react';
import { Text, TouchableOpacity, Animated, Dimensions, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { logout } from '../utils/logout';

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
  const navigateAndCloseMenu = (route) => {
    toggleMenu(); // Fecha o menu
    navigation.navigate(route); // Navega para a página selecionada
  };

  return (
    <>
      <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
        <Ionicons name="menu-outline" size={50} color="#084b0f" />
      </TouchableOpacity>
      {menuVisible && (
        <TouchableOpacity style={styles.overlay} onPress={handleOutsideClick} activeOpacity={1}>
          <Animated.View style={[styles.menuContainer, { transform: [{ translateX: animation }] }]}>
          <TouchableOpacity onPress={() => navigateAndCloseMenu('Home')} style={styles.menuItemContainer}>
              <Ionicons name="home-outline" size={24} color="#084b0f" style={styles.menuIcon} />
              <Text style={styles.menuItem}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigateAndCloseMenu('Profile')} style={styles.menuItemContainer}>
              <Ionicons name="person-outline" size={24} color="#084b0f" style={styles.menuIcon} />
              <Text style={styles.menuItem}>Perfil</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigateAndCloseMenu('Players')} style={styles.menuItemContainer}>
              <Ionicons name="people-outline" size={24} color="#084b0f" style={styles.menuIcon} />
              <Text style={styles.menuItem}>Jogadores</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigateAndCloseMenu('Teams')} style={styles.menuItemContainer}>
              <Ionicons name="shield-outline" size={24} color="#084b0f" style={styles.menuIcon} />
              <Text style={styles.menuItem}>Times</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigateAndCloseMenu('Matches')} style={styles.menuItemContainer}>
              <Ionicons name="football-outline" size={24} color="#084b0f" style={styles.menuIcon} />
              <Text style={styles.menuItem}>Partidas</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => logout(navigation)} style={styles.menuItemContainer}>
              <Ionicons name="exit-outline" size={24} color="#084b0f" style={styles.menuIcon} />
              <Text style={styles.menuItem}>Sair</Text>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  menuButton: {
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
    backgroundColor: '#c4ac57', //'#9dbfa1',
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
