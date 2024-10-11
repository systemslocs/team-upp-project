import { Alert } from 'react-native';

export const logout = (navigation) => {
  // Exibe um alerta informando que o usuário saiu
  Alert.alert('Logout', 'Logout realizado.');

  // Redireciona para a tela de login
  navigation.navigate('Login');
};
