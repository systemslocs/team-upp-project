import React, { useEffect } from 'react';
import { View, Image, StyleSheet, StatusBar } from 'react-native';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    // Função para navegar para a tela de login após 5 segundos
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 5000);

    // Limpar o timer quando o componente for desmontado
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <Image
        source={require('./assets/logo-inicial.png')} // Caminho para a sua imagem
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Cor de fundo da tela inicial
  },
  image: {
    width: '80%', // Largura da imagem (ajuste conforme necessário)
    height: '80%', // Altura da imagem (ajuste conforme necessário)
  },
});
