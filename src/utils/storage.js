import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeUserData = async (userData) => {
  try {
    await AsyncStorage.setItem('user', JSON.stringify(userData));
  } catch (error) {
    throw new Error('Erro ao salvar os dados do usuário');
  }
};

export const retrieveUserData = async () => {
  try {
    const storedUser = await AsyncStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    throw new Error('Erro ao recuperar os dados do usuário');
  }
};
