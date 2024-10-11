import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Platform, StatusBar } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { retrieveUserData } from '../utils/storage';
import { logout } from '../utils/logout';

const HomeScreen = ({ navigation }) => {
  const [userName, setUserName] = useState('');

  // Função para buscar o nome do usuário no AsyncStorage
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await retrieveUserData();
        if (userData && userData.firstName) {
          setUserName(userData.firstName); // Exibe o nome salvo no AsyncStorage
        }
      } catch (error) {
        console.error('Erro ao buscar os dados do usuário', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require('../../assets/logo-app.png')} 
        style={styles.logo}
      />

      {/* Nome do usuário */}
      <Text style={styles.welcomeText}>Bem-vindo, {userName}!</Text>
      <Text style={styles.descriptionText}>Adicione seus amigos, forme seus times e organize suas partidas</Text>

      {/* Dashboard com opções */}
      <View style={styles.dashboardContainer}>
        <View style={styles.row}>
          <TouchableOpacity style={styles.dashboardOption} onPress={() => navigation.navigate('Profile')}>
            <Ionicons name="person-outline" size={30} color="#084b0f" />
            <Text style={styles.optionText}>Perfil</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dashboardOption} onPress={() => navigation.navigate('Players')}>
            <Ionicons name="people-outline" size={30} color="#084b0f" />
            <Text style={styles.optionText}>Jogadores</Text>
          </TouchableOpacity>
        </View>
  
        <View style={styles.row}>
          <TouchableOpacity style={styles.dashboardOption} onPress={() => navigation.navigate('Teams')}>
            <Ionicons name="shield-outline" size={30} color="#084b0f" />
            <Text style={styles.optionText}>Times</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dashboardOption} onPress={() => navigation.navigate('Matches')}>
            <Ionicons name="football-outline" size={30} color="#084b0f" />
            <Text style={styles.optionText}>Partidas</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.logoutOption} onPress={() => logout(navigation)}>
            <Ionicons name="exit-outline" size={30} color="#084b0f" />
            <Text style={styles.optionText}>Sair</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  logo: {
    width: 200, // Ajuste para aproximadamente 5cm
    height: 200, // Ajuste para aproximadamente 5cm
    marginBottom: 20,
    top: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 40,
  },
  welcomeText: {
    fontSize: 20,
    color: '#084b0f',
    marginBottom: 30,
    marginTop: 20,
  },
  descriptionText: {
    textAlign: 'center',
    fontSize: 18,
    color: 'gray',
  },
  dashboardContainer: {
    padding: 20,
    justifyContent: 'center',
    width: '100%', // Certifique-se de que o container ocupe toda a largura
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dashboardOption: {
    flex: 1,
    backgroundColor: '#c4ac57',
    margin: 10,
    paddingVertical: 20, // Aumente o espaçamento vertical para dar mais espaço ao texto
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  optionText: {
    color: '#084b0f',
    fontSize: 18, // Aumente o tamanho da fonte para tornar o texto mais visível
    fontWeight: 'bold', // Torna o texto mais visível com negrito
    marginTop: 10, // Adiciona espaçamento entre o ícone e o texto
  },
  logoutContainer: {
    alignItems: 'center',
    marginTop: 10, // Espaçamento acima da opção "Sair"
  },
  logoutOption: {
    width: '50%', // Define um tamanho fixo menor para o botão de sair
    backgroundColor: '#c4ac57',
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
});

export default HomeScreen;
