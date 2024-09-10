import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert, ScrollView, Platform, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SideMenu from '../components/SideMenu';
import { GlobalStyles } from '../styles/GlobalStyles';

const TeamsScreen = ({ navigation }) => {
  const [players, setPlayers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const storedPlayers = await AsyncStorage.getItem('players');
        if (storedPlayers) {
          const parsedPlayers = JSON.parse(storedPlayers);
          setPlayers(parsedPlayers);
        } else {
          console.log('Nenhum jogador adicionado');
        }
      } catch (error) {
        console.log('Erro ao carregar os jogadores:', error);
      }
    };
    fetchPlayers();
  }, []);

  const toggleSelection = (player) => {
    if (selectedPlayers.includes(player)) {
      setSelectedPlayers(selectedPlayers.filter(p => p !== player));
    } else {
      setSelectedPlayers([...selectedPlayers, player]);
    }
  };

  const sortTeams = () => {
    if (selectedPlayers.length < 10) {
      Alert.alert('Adicione mais jogadores');
      return;
    }

    if (selectedPlayers.length % 5 !== 0) {
      Alert.alert('Adicione ou remova jogadores para que o número seja divisível por 5');
      return;
    }

    // Função para criar times balanceados
    const createBalancedTeams = () => {
      const numberOfTeams = selectedPlayers.length / 5;
      let teams = Array.from({ length: numberOfTeams }, () => []);

      // Ordena os jogadores por nota (do maior para o menor)
      const sortedPlayers = [...selectedPlayers].sort((a, b) => b.score - a.score);

      // Distribui os jogadores nos times de forma inicial
      let index = 0;
      while (sortedPlayers.length > 0) {
        teams[index % numberOfTeams].push(sortedPlayers.shift());
        index++;
      }

      // Função para calcular a média de um time
      const calculateTeamAverage = (team) => {
        const total = team.reduce((sum, player) => sum + parseFloat(player.score), 0);
        return total / team.length;
      };

      // Função para calcular a diferença entre a maior e a menor média
      const calculateAverageDifference = (teams) => {
        const teamAverages = teams.map(calculateTeamAverage);
        const maxAverage = Math.max(...teamAverages);
        const minAverage = Math.min(...teamAverages);
        return maxAverage - minAverage;
      };

      let difference = calculateAverageDifference(teams);

      // Ajusta os times até que a diferença de médias seja próxima de 0.3 ou menor
      while (difference > 0.3) {
        let maxTeamIndex = -1;
        let minTeamIndex = -1;
        let maxAverage = -Infinity;
        let minAverage = Infinity;

        // Encontra os times com a maior e a menor média
        teams.forEach((team, idx) => {
          const avg = calculateTeamAverage(team);
          if (avg > maxAverage) {
            maxAverage = avg;
            maxTeamIndex = idx;
          }
          if (avg < minAverage) {
            minAverage = avg;
            minTeamIndex = idx;
          }
        });

        // Tenta trocar o jogador com a maior nota do time com a maior média
        // com o jogador com a menor nota do time com a menor média
        const maxTeam = teams[maxTeamIndex];
        const minTeam = teams[minTeamIndex];

        const playerFromMaxTeam = maxTeam.reduce((maxPlayer, player) => {
          return !maxPlayer || player.score > maxPlayer.score ? player : maxPlayer;
        }, null);

        const playerFromMinTeam = minTeam.reduce((minPlayer, player) => {
          return !minPlayer || player.score < minPlayer.score ? player : minPlayer;
        }, null);

        // Realiza a troca se for possível
        if (playerFromMaxTeam && playerFromMinTeam) {
          teams[maxTeamIndex] = maxTeam.filter(player => player !== playerFromMaxTeam);
          teams[minTeamIndex] = minTeam.filter(player => player !== playerFromMinTeam);

          teams[maxTeamIndex].push(playerFromMinTeam);
          teams[minTeamIndex].push(playerFromMaxTeam);
        }

        // Recalcula a diferença
        difference = calculateAverageDifference(teams);
      }

      return teams;
    };

    const teams = createBalancedTeams();
    setTeams(teams);
  };

  return (
    <View style={GlobalStyles.container}>
      <SideMenu navigation={navigation} />
      <View style={styles.content}>
        <Image source={require('../../assets/team-icon.png')} style={styles.image} />
        <Text style={styles.title}>Selecione os jogadores</Text>
        <ScrollView>
          {players.length > 0 ? (
            players.map((player, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => toggleSelection(player)}
                style={[
                  styles.playerContainer,
                  selectedPlayers.includes(player) && styles.selectedPlayer,
                ]}
              >
                <Text style={styles.playerText}>{player.name} - Nota: {player.score}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noPlayersText}>Nenhum jogador adicionado</Text>
          )}
        </ScrollView>
        <TouchableOpacity style={styles.button} onPress={sortTeams}>
          <Text style={styles.buttonText}>Sortear Times</Text>
        </TouchableOpacity>

        {/* Exibe os times sorteados */}
        {teams.length > 0 && (
          <ScrollView style={styles.teamsContainer}>
            {teams.map((team, index) => (
              <View key={index} style={styles.team}>
                <Text style={styles.teamTitle}>Time {index + 1}</Text>
                {team.map((player, idx) => (
                  <Text key={idx} style={styles.playerText}>{player.name}</Text>
                ))}
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
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
  playerContainer: {
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
    color: '#999',
    marginTop: 20,
  },
});

export default TeamsScreen;
