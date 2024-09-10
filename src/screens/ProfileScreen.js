import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Platform, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SideMenu from '../components/SideMenu';
import { GlobalStyles } from '../styles/GlobalStyles';

const ProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    birthDate: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUserData = await AsyncStorage.getItem('user');
      if (storedUserData) {
        setUserData(JSON.parse(storedUserData));
      }
    };
    fetchUserData();
  }, []);

  return (
    <View style={GlobalStyles.container}>
      <SideMenu navigation={navigation} />
      <View style={styles.profileContainer}>
        <Image
          source={require('../../assets/user-icon.png')} // Certifique-se de ter um ícone de usuário
          style={styles.profileImage}
        />
        <Text style={styles.title}>Perfil</Text>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Nome:</Text>
          <Text style={styles.infoText}>{userData.firstName} {userData.lastName}</Text>
          <Text style={styles.infoLabel}>Usuário:</Text>
          <Text style={styles.infoText}>{userData.username}</Text>
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoText}>{userData.email}</Text>
          <Text style={styles.infoLabel}>Data de Nascimento:</Text>
          <Text style={styles.infoText}>{userData.birthDate}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  profileImage: {
    top: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 40,
    width: 100,  // Aproximadamente 3 a 4 cm
    height: 100, // Aproximadamente 3 a 4 cm
    borderRadius: 50,
    marginBottom: 10,
    tintColor: '#084b0f',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 30,
    color: '#084b0f',
  },
  infoContainer: {
    width: '80%',
    alignItems: 'flex-start',
  },
  infoLabel: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10,
    color: '#084b0f',
  },
  infoText: {
    fontSize: 16,
    color: '#555',
  },
});

export default ProfileScreen;
