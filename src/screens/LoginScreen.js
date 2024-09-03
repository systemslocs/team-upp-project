import React, { useState } from 'react';
import { 
  Text, 
  TextInput,
  Button, 
  Alert, 
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import CustomButton from '../components/CustomButton';
import Logo from '../components/Logo';
import { GlobalStyles } from '../styles/GlobalStyles';

import { retrieveUserData } from '../utils/storage';

export default function LoginScreen({ navigation }) {
  // Estados para os campos de usuário e senha
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Função que será chamada ao pressionar o botão de login
  const handleLogin = async () => {
    try {
      const userData = await retrieveUserData();
      if (userData && username === userData.username && password === userData.password) {
        Alert.alert('Sucesso', 'Login bem-sucedido!');
        navigation.navigate('Home');
      } else {
        Alert.alert('Erro', 'Nome de usuário ou senha incorretos');
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
      style={GlobalStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : StatusBar.currentHeight}
    >
    <ScrollView contentContainerStyle={GlobalStyles.scrollViewContainer}>
      <Logo/>
      <Text style={GlobalStyles.text}>Bem-vindo ao TeamUpp</Text>
      <Text style={GlobalStyles.description}>Forme seu time!</Text>

      <TextInput
        style={GlobalStyles.input}
        placeholder="Usuário"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={GlobalStyles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />
      <CustomButton
        title="Login"
        onPress={handleLogin}
        style={{ marginTop: 20 }}
      />
      <Button title="Ainda não tem conta?" onPress={handleNavigateToCreateAccount} />
    </ScrollView>
    </KeyboardAvoidingView>
  );
};
