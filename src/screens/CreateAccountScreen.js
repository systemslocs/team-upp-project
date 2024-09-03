import React, { useState } from 'react';
import { 
    Text, 
    TextInput, 
    StyleSheet, 
    TouchableOpacity, 
    Platform, 
    StatusBar, 
    Alert, 
    KeyboardAvoidingView, 
    ScrollView
} from 'react-native';
import CustomButton from '../components/CustomButton';
import Logo from '../components/Logo';
import { GlobalStyles } from '../styles/GlobalStyles';
import { validatePassword } from '../utils/validation';
import { storeUserData } from '../utils/storage';

export default function CreateAccountScreen({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleCreateAccount = async () => {
    const error = validatePassword(password, confirmPassword);
      if (error) {
        Alert.alert('Erro', error);
        return;
      }
  
      const userData = {
        firstName,
        lastName,
        email,
        birthDate,
        username,
        password,
      };
  
      try {
        await storeUserData(userData);
        Alert.alert('Sucesso', 'Conta criada com sucesso!');
        navigation.navigate('Login');
      } catch (error) {
        Alert.alert('Erro', 'Falha ao criar conta');
      }
    };
  
  const handleGoBack = () => {
    navigation.goBack('Login'); // Volta para a tela anterior (LoginScreen)
  };

  return (
    <KeyboardAvoidingView
      style={GlobalStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : StatusBar.currentHeight}
    >
    <ScrollView contentContainerStyle={GlobalStyles.scrollViewContainer}>
      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <Text style={styles.backButtonText}>Voltar</Text>
      </TouchableOpacity>

      <Logo/>

      <Text style={GlobalStyles.text}>Criar Conta</Text>

      <TextInput
        style={GlobalStyles.input}
        placeholder="Nome"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={GlobalStyles.input}
        placeholder="Sobrenome"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={GlobalStyles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={GlobalStyles.input}
        placeholder="Data de Nascimento"
        value={birthDate}
        onChangeText={setBirthDate}
      />
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
      <TextInput
        style={GlobalStyles.input}
        placeholder="Confirmar Senha"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry={true}
      />

      <CustomButton
        title="Criar conta"
        onPress={handleCreateAccount}
      />
    </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
backButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 40, // Ajuste para Android e iOS
    left: 10,
    padding: 10,
},
backButtonText: {
    color: '#007BFF',
    fontSize: 16,
},
});
