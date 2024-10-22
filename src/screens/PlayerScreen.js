import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, Image, StyleSheet, Platform, StatusBar, Keyboard, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SideMenu from '../components/SideMenu';
import { GlobalStyles } from '../styles/GlobalStyles';
import CustomButton from '../components/CustomButton';

const PlayerScreen = ({ navigation }) => {
  const [playerName, setPlayerName] = useState('');
  const [playerScore, setPlayerScore] = useState('');
  const [players, setPlayers] = useState([]);

  // Função para carregar jogadores do AsyncStorage
  const loadPlayers = async () => {
    try {
      const storedPlayers = await AsyncStorage.getItem('players');
      const playersList = storedPlayers ? JSON.parse(storedPlayers) : [];
      setPlayers(playersList);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os jogadores.');
    }
  };

  useEffect(() => {
    loadPlayers(); // Carrega os jogadores quando o componente é montado
  }, []);

  // Função para inserir um jogador
  const handleInsertPlayer = async () => {
    if (!playerName || !playerScore) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    const formattedScore = parseFloat(playerScore.replace(',', '.'));

    // Verificação para aceitar apenas notas entre 1.00 e 5.00
    if (isNaN(formattedScore) || formattedScore < 1 || formattedScore > 5) {
      Alert.alert('Erro', 'A nota deve estar entre 1.00 e 5.00.');
      return;
    }

    const playerData = { name: playerName, score: formattedScore };

    try {
      const storedPlayers = await AsyncStorage.getItem('players');
      const playersList = storedPlayers ? JSON.parse(storedPlayers) : [];
      playersList.push(playerData);
      await AsyncStorage.setItem('players', JSON.stringify(playersList));

      console.log('Jogadores armazenados:', playersList);
      Alert.alert('Sucesso', `${playerData.name} foi inserido com sucesso!`);
      setPlayerName('');
      setPlayerScore('');
      Keyboard.dismiss();
      loadPlayers(); // Atualiza a lista de jogadores
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível inserir o jogador.');
    }
  };

  // Função para remover um jogador
  const handleRemovePlayer = (playerToRemove) => {
    Alert.alert(
      "Confirmar Remoção",
      `Você tem certeza que deseja remover ${playerToRemove.name}?`,
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Remover",
          onPress: async () => {
            try {
              const updatedPlayers = players.filter(player => player.name !== playerToRemove.name);
              await AsyncStorage.setItem('players', JSON.stringify(updatedPlayers));
              setPlayers(updatedPlayers); // Atualiza a lista de jogadores
              Alert.alert("Sucesso", `${playerToRemove.name} foi removido com sucesso.`);
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível remover o jogador.');
            }
          }
        }
      ]
    );
  };

  return (
    <View style={GlobalStyles.container}>
      <SideMenu navigation={navigation}/>
      <View style={styles.playerContainer}>
        <Image
          source={require('../../assets/player-icon.png')}
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

        {/* Lista de jogadores */}
        {players.length === 0 ? (
          <Text style={styles.noPlayersText}>Nenhum jogador adicionado</Text>
        ) : (
        <FlatList
          data={players}
          keyExtractor={(item, index) => `${item.name}-${index}`} // Usando nome e índice como chave
          renderItem={({ item }) => (
            <View style={styles.playerItem}>
              <Text>{item.name} - Nota: {item.score}</Text>
              <TouchableOpacity onPress={() => handleRemovePlayer(item)} style={styles.removeButton}>
                <Text style={styles.removeText}>Remover</Text>
              </TouchableOpacity>
            </View>
          )}
          contentContainerStyle={styles.flatListContent} // Adiciona espaçamento extra
          showsVerticalScrollIndicator={false} // Esconde a barra de rolagem vertical
        />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  playerContainer: {
    alignItems: 'center',
    marginTop: 20,
    flex: 1, // Garante que o container use o espaço disponível da tela
  },
  playerImage: {
    width: 200,  
    height: 200, 
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
  playersList: {
    width: '100%',
    flexGrow: 1, // Permite que a lista cresça e ocupe o espaço disponível
  },
  playerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  removeButton: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
    marginLeft: 50,
  },
  removeText: {
    color: '#fff',
  },
  flatListContent: {
    paddingBottom: 100, // Espaçamento maior na parte inferior da lista para garantir que o último item fique visível
  },
  noPlayersText: {
    fontSize: 16,
    color: 'gray',
    marginTop: 20,
  },
});

export default PlayerScreen;
