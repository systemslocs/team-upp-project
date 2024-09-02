import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Button } from 'react-native';

export default function LoginScreen({ navigation }) {
  // Estados para os campos de usuário e senha
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Função que será chamada ao pressionar o botão de login
  const handleLogin = () => {
    // Aqui você pode adicionar lógica de autenticação
    // Se o login for bem-sucedido, redirecione para a próxima página:
    navigation.navigate('Home');
  };
  const handleNavigateToCreateAccount = () => {
    navigation.navigate('CreateAccount');
  };

  return (
    <View style={styles.container}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
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
