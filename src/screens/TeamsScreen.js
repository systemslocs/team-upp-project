import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, FlatList, Platform, StatusBar, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SideMenu from '../components/SideMenu';
import { GlobalStyles } from '../styles/GlobalStyles';

const TeamsScreen = ({ navigation }) => {
  const [players, setPlayers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const loadPlayers = async () => {
      try {
        const storedPlayers = await AsyncStorage.getItem('players');
        const parsedPlayers = storedPlayers ? JSON.parse(storedPlayers) : [];
        setPlayers(parsedPlayers);
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar os jogadores.');
      }
    };

    loadPlayers();
  }, []);

  // Alternar seleção de jogadores
  const togglePlayerSelection = (player) => {
    if (selectedPlayers.includes(player)) {
      setSelectedPlayers(selectedPlayers.filter((p) => p !== player));
    } else {
      setSelectedPlayers([...selectedPlayers, player]);
    }
  };

  // Função de sorteio
  const handleSortTeams = () => {
    const numberOfSelectedPlayers = selectedPlayers.length;

    if (numberOfSelectedPlayers < 10) {
      Alert.alert('Erro', 'Selecione pelo menos 10 jogadores.');
      return;
    }

    if (numberOfSelectedPlayers % 5 !== 0) {
      Alert.alert('Erro', 'O número de jogadores deve ser múltiplo de 5.');
      return;
    }

    const sortedTeams = sortTeams(selectedPlayers);
    setTeams(sortedTeams);
  };

  // Lógica para balancear e sortear os times
  const sortTeams = (playersToSort) => {
    // Ordena os jogadores por nota (decrescente)
    const sortedPlayers = [...playersToSort].sort((a, b) => b.score - a.score);

    const numberOfTeams = Math.floor(sortedPlayers.length / 5);
    const teams = Array.from({ length: numberOfTeams }, () => []);

    // Distribui os jogadores de forma alternada entre os times
    let teamIndex = 0;
    sortedPlayers.forEach((player) => {
      teams[teamIndex].push(player);
      teamIndex = (teamIndex + 1) % numberOfTeams; // Alterna entre os times
    });

    return teams;
  };

  return (
    <View style={GlobalStyles.container}>
      <SideMenu navigation={navigation} />
      <View style={styles.content}>
        <Image source={require('../../assets/team-icon.png')} style={styles.image} />
        <Text style={styles.title}>Selecione os jogadores</Text>

        {players.length === 0 ? (
          <Text style={styles.noPlayersText}>Nenhum jogador adicionado</Text>
        ) : (
          <FlatList
            data={players}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.playerItem,
                  selectedPlayers.includes(item) && styles.selectedPlayer,
                ]}
                onPress={() => togglePlayerSelection(item)}
              >
                <Text>{item.name} - Nota: {typeof item.score === 'number' ? item.score.toFixed(2) : 'Sem nota'}</Text>
              </TouchableOpacity>
            )}
          />
        )}

        <TouchableOpacity
          style={[styles.button, selectedPlayers.length < 10 && styles.buttonDisabled]}
          onPress={handleSortTeams}
          disabled={selectedPlayers.length < 10 || selectedPlayers.length % 5 !== 0}
        >
          <Text style={styles.buttonText}>Sortear Times</Text>
        </TouchableOpacity>

        {/* Exibe os times sorteados */}
        {teams.length > 0 && (
          <View style={styles.teamsContainer}>
            {teams.map((team, index) => (
              <View key={index} style={styles.team}>
                <Text style={styles.teamTitle}>Time {index + 1} - Média: {calculateTeamAverage(team).toFixed(2)}</Text>
                {team.map((player, idx) => (
                  <Text key={idx} style={styles.playerText}>{player.name} - Nota: {player.score.toFixed(2)}</Text>
                ))}
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

// Função auxiliar para calcular a média de cada time
const calculateTeamAverage = (team) => {
  const totalScore = team.reduce((sum, player) => sum + player.score, 0);
  return totalScore / team.length;
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 20,
    marginTop: 60,
  },
  image: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
    top: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 40,
    tintColor: '#084b0f',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
    color: '#084b0f',
  },
  playerItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  selectedPlayer: {
    backgroundColor: '#84e184',
  },
  playerText: {
    fontSize: 18,
  },
  button: {
    backgroundColor: '#084b0f',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
  },
  teamsContainer: {
    marginTop: 20,
  },
  team: {
    marginBottom: 20,
  },
  teamTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  noPlayersText: {
    textAlign: 'center',
    fontSize: 18,
    color: 'gray',
    marginVertical: 20,
  },
});

export default TeamsScreen;
