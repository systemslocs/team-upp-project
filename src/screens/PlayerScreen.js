import React, { useState } from 'react';
import { View, Text, TextInput, Alert, Image, StyleSheet, Platform, StatusBar, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SideMenu from '../components/SideMenu';
import { GlobalStyles } from '../styles/GlobalStyles';
import CustomButton from '../components/CustomButton';

const PlayerScreen = ({ navigation }) => {
  const [playerName, setPlayerName] = useState('');
  const [playerScore, setPlayerScore] = useState('');

  const handleInsertPlayer = async () => {
    if (!playerName || !playerScore) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    const formattedScore = parseFloat(playerScore.replace(',', '.'));

    if (isNaN(formattedScore)) {
      Alert.alert('Erro', 'A nota inserida não é válida');
      return;
    }

    const playerData = { name: playerName, score: formattedScore };

    try {
      const storedPlayers = await AsyncStorage.getItem('players');
      const players = storedPlayers ? JSON.parse(storedPlayers) : [];
      players.push(playerData);
      await AsyncStorage.setItem('players', JSON.stringify(players));
    
      console.log('Jogadores armazenados:', players); // Adicione este log
      Alert.alert('Sucesso', `${playerData.name} foi inserido com sucesso!`);
      setPlayerName('');
      setPlayerScore('');
      Keyboard.dismiss();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível inserir o jogador.');
    }
  };

  return (
    <View style={GlobalStyles.container}>
      <SideMenu navigation={navigation}/>
      <View style={styles.playerContainer}>
        <Image
          source={require('../../assets/player-icon.png')} // Imagem salva em assets
          style={styles.playerImage}
        />
        <Text style={styles.title}>Insira os jogadores</Text>
        <TextInput
          style={GlobalStyles.input}
          placeholder="Nome do jogador"
          value={playerName}
          onChangeText={setPlayerName}
        />
        <TextInput
          style={GlobalStyles.input}
          placeholder="Nota do jogador"
          value={playerScore}
          keyboardType="numeric"
          onChangeText={setPlayerScore}
        />
        <CustomButton title="Inserir" onPress={handleInsertPlayer} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  playerContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  playerImage: {
    width: 200,  // Aproximadamente 3 a 4 cm
    height: 200, // Aproximadamente 3 a 4 cm
    marginBottom: 10,
    top: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 40,
    tintColor: '#084b0f',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    marginTop: 30,
    color:'#084b0f',
  },
});

export default PlayerScreen;
