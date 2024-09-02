import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  Button, 
  Alert, 
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  // Estados para os campos de usuário e senha
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Função que será chamada ao pressionar o botão de login
  const handleLogin = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        if (username === userData.username && password === userData.password) {
          // Credenciais corretas
          Alert.alert('Sucesso', 'Login bem-sucedido!');
          navigation.navigate('Home'); // Navegue para a página inicial ou outra página desejada
        } else {
          // Credenciais incorretas
          Alert.alert('Erro', 'Nome de usuário ou senha incorretos');
        }
      } else {
        Alert.alert('Erro', 'Nenhum usuário encontrado. Faça o cadastro primeiro.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao autenticar. Tente novamente.');
    }
  };
  const handleNavigateToCreateAccount = () => {
    navigation.navigate('CreateAccount');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : StatusBar.currentHeight}
    >
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <Image
        source={require('./assets/logo-app.png')} // Substitua pelo caminho da sua imagem
        style={styles.logo}
      />
      <Text style={styles.text}>Bem-vindo ao TeamUpp</Text>
      <Text style={styles.description}>Forme seu time!</Text>

      <TextInput
        style={styles.input}
        placeholder="Usuário"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
      <Button title="Ainda não tem conta?" onPress={handleNavigateToCreateAccount} />
    </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  text: {
    fontSize: 22,
    color: '#084b0f',
    marginBottom: 15,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: 'normal',
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  loginButton: {
    width: '50%',
    height: 50,
    marginBottom: 20,
    backgroundColor: '#084b0f', // Cor de fundo do botão
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25, // Bordas arredondadas
  },
  loginButtonText: {
    color: '#fff', // Cor do texto do botão
    fontSize: 18,
    fontWeight: 'bold',
  },
});
