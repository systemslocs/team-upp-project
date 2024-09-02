import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    Image, 
    StyleSheet, 
    TouchableOpacity, 
    Platform, 
    StatusBar, 
    Alert, 
    KeyboardAvoidingView, 
    ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CreateAccountScreen({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleCreateAccount = async () => {
    if (password !== confirmPassword) {
        Alert.alert('Erro', 'As senhas não coincidem');
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
        // Armazenando os dados do usuário no AsyncStorage
        await AsyncStorage.setItem('user', JSON.stringify(userData));
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
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : StatusBar.currentHeight}
    >
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <Text style={styles.backButtonText}>Voltar</Text>
      </TouchableOpacity>

      <Image
        source={require('./assets/logo-app.png')} 
        style={styles.logoCreate}
      />

      <Text style={styles.text}>Criar Conta</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Sobrenome"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Data de Nascimento"
        value={birthDate}
        onChangeText={setBirthDate}
      />
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
      <TextInput
        style={styles.input}
        placeholder="Confirmar Senha"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry={true}
      />

      <TouchableOpacity style={styles.createAccountButton} onPress={handleCreateAccount}>
        <Text style={styles.createAccountButtonText}>Criar conta</Text>
      </TouchableOpacity>
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
backButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 40, // Ajuste para Android e iOS
    left: 10,
    padding: 10,
},
logoCreate: {
    width: 200,
    height: 200,
    marginBottom: 20,
},
backButtonText: {
    color: '#007BFF',
    fontSize: 16,
},
text: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
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
createAccountButton: {
    width: '50%',
    height: 50,
    backgroundColor: '#084b0f',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
},
createAccountButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
},
});
